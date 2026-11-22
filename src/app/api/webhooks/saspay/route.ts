import { NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import crypto from 'crypto';

// Match the API environment to the secret key prefix (sk_live_* → live,
// sk_test_* → sandbox), independent of NODE_ENV.
const SASPAY_API_BASE = (process.env.SASPAY_SECRET_KEY || '').startsWith('sk_live')
  ? 'https://api.saspay.me/api/v1'
  : 'https://sandbox-api.saspay.me/api/v1';

const WEBHOOK_TOLERANCE_SECONDS = 300;

function verifySignature(rawBody: string, signature: string, timestamp: string): boolean {
  const secret = process.env.SASPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !timestamp) return false;

  // Reject stale timestamps to prevent replay attacks
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > WEBHOOK_TOLERANCE_SECONDS) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Resolve which activation_payments row a SasPay transaction belongs to.
 *
 * The webhook only carries the *transaction* reference/id — generated when the
 * customer pays, long after we created the checkout session. Our DB stores the
 * checkout session UUID in provider_reference, so we poll each pending
 * session's status endpoint until transaction_id / transaction_reference match.
 */
async function findPaymentRecord(data: {
  id?: string;
  reference?: string;
  metadata?: { reference?: string };
}) {
  const serviceRole = getServiceRoleClient();

  // Fast path: our own reference echoed back through session metadata
  const ourReference = data.metadata?.reference;
  if (ourReference) {
    const { data: byMetadata } = await serviceRole
      .from('activation_payments')
      .select('*')
      .eq('provider_reference', ourReference)
      .maybeSingle();
    // Note: provider_reference stores the session UUID, so this only matches
    // rows written by older versions. Kept for safety.
    if (byMetadata) return byMetadata;
  }

  // Direct match (legacy rows or future flows storing SasPay references)
  if (data.reference) {
    const { data: byReference } = await serviceRole
      .from('activation_payments')
      .select('*')
      .eq('provider_reference', data.reference)
      .maybeSingle();
    if (byReference) return byReference;
  }

  // Slow path: resolve pending sessions via the SasPay status endpoint
  const { data: pending } = await serviceRole
    .from('activation_payments')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(50);

  for (const payment of pending ?? []) {
    try {
      const res = await fetch(
        `${SASPAY_API_BASE}/checkout-sessions/${payment.provider_reference}/status/`,
        { headers: { Authorization: `Bearer ${process.env.SASPAY_SECRET_KEY}` } }
      );
      if (!res.ok) continue;
      const statusData = await res.json();
      const session = statusData.data || statusData;

      if (
        (data.id && session.transaction_id === data.id) ||
        (data.reference && session.transaction_reference === data.reference)
      ) {
        return payment;
      }
    } catch (err) {
      console.error('Failed to check session status for payment', payment.id, err);
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const timestamp = request.headers.get('x-webhook-timestamp') || '';
    const eventName = request.headers.get('x-webhook-event') || '';

    console.log('Webhook received:', {
      event: eventName,
      signature: signature ? 'present' : 'missing',
      timestamp: timestamp || 'missing',
      bodyLength: rawBody.length,
      bodyPreview: rawBody.substring(0, 200),
    });

    const validSignature = verifySignature(rawBody, signature, timestamp);
    console.log('Signature verification:', { valid: validSignature });

    if (process.env.NODE_ENV === 'production' && !validSignature) {
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const resolvedEventName = event.event || eventName;
    const data = event.data || {};
    console.log('Parsed webhook event:', resolvedEventName, data);

    // transaction.created (and any non-final event) carries status PENDING —
    // acknowledge it without touching the payment record.
    const status = String(data.status || '').toUpperCase();
    const isFinal =
      resolvedEventName === 'transaction.success' ||
      resolvedEventName === 'transaction.failed' ||
      resolvedEventName === 'transaction.cancelled' ||
      status === 'SUCCESS' ||
      status === 'FAILED' ||
      status === 'CANCELLED';

    if (!isFinal) {
      return NextResponse.json({ success: true, message: 'Event acknowledged' });
    }

    if (!data.reference && !data.id) {
      console.error('Missing reference/id in webhook event');
      return NextResponse.json({ message: 'Missing transaction identifier' }, { status: 400 });
    }

    const serviceRole = getServiceRoleClient(); // bypass RLS for webhook updates

    // Retrouver le paiement correspondant à cette transaction SasPay
    const paymentRecord = await findPaymentRecord(data);

    if (!paymentRecord) {
      console.error('Payment record not found for transaction:', {
        id: data.id,
        reference: data.reference,
        metadata: data.metadata,
      });
      // 404 makes SasPay retry — correct, since the session status may not be
      // queryable yet when transaction.created arrives.
      return NextResponse.json({ message: 'Payment record not found' }, { status: 404 });
    }

    // Idempotence : ne pas retraiter un webhook déjà finalisé
    if (paymentRecord.status === 'successful') {
      return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
    }

    const isSuccess =
      resolvedEventName === 'transaction.success' ||
      status === 'SUCCESS' ||
      status === 'COMPLETED';

    if (isSuccess) {
      // Mettre à jour le paiement puis ouvrir la porte : pending → active
      await serviceRole
        .from('activation_payments')
        .update({ status: 'successful', updated_at: new Date().toISOString() })
        .eq('id', paymentRecord.id);

      const { error: updateError } = await serviceRole
        .from('profiles')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', paymentRecord.user_id);

      if (updateError) {
        throw new Error('Failed to activate user account');
      }

      return NextResponse.json({ success: true, message: 'Account successfully activated via SasPay' });
    }

    // Paiement échoué ou annulé
    await serviceRole
      .from('activation_payments')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('id', paymentRecord.id);

    return NextResponse.json({ success: true, message: 'Payment failure recorded' });
  } catch (error) {
    console.error('SasPay webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
