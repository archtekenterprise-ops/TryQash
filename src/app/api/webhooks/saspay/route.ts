import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-saspay-signature') || '';

    console.log('Webhook received:', {
      signature: signature ? 'present' : 'missing',
      bodyLength: rawBody.length,
      bodyPreview: rawBody.substring(0, 200),
    });

    // 1. Sécurité : Vérification de la signature du webhook SasPay (optionnel mais recommandé si fourni par SasPay)
    const computedSignature = crypto
      .createHmac('sha256', process.env.SASPAY_WEBHOOK_SECRET || '')
      .update(rawBody)
      .digest('hex');

    console.log('Signature verification:', {
      received: signature,
      computed: computedSignature,
      match: signature === computedSignature,
    });

    if (process.env.NODE_ENV === 'production' && signature !== computedSignature) {
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody);
    console.log('Parsed webhook event:', event);

    // SasPay webhook payload structure: { data: { reference, status, ... }, event: "transaction.success" }
    const reference = event.data?.reference;
    const status = event.data?.status?.toLowerCase(); // Convert SUCCESS to successful
    const amount = event.data?.amount;

    if (!reference) {
      console.error('Missing reference in webhook event');
      return NextResponse.json({ message: 'Missing reference' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const serviceRole = getServiceRoleClient(); // Use service role to bypass RLS for webhook updates

    // 2. Consulter le "carnet de notes" pour retrouver le paiement
    const { data: paymentRecord, error: fetchError } = await serviceRole
      .from('activation_payments')
      .select('*')
      .eq('provider_reference', reference)
      .single();

    if (fetchError || !paymentRecord) {
      return NextResponse.json({ message: 'Payment record not found' }, { status: 404 });
    }

    // Gestion de l'idempotence (éviter de traiter 2 fois le même webhook réussi)
    if (paymentRecord.status === 'successful') {
      return NextResponse.json({ message: 'Event already processed' }, { status: 200 });
    }

    // 3. Vérifier si le paiement est réellement validé par SasPay
    if (status === 'successful' || status === 'success' || status === 'completed') {

      // Mettre à jour le carnet de notes (le paiement passe à successful)
      await serviceRole
        .from('activation_payments')
        .update({ status: 'successful', updated_at: new Date().toISOString() })
        .eq('id', paymentRecord.id);

      // Règle 4 : Ouvrir la porte ! Mettre à jour le statut du compte utilisateur de 'pending' à 'active'
      const { error: updateError } = await serviceRole
        .from('profiles')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', paymentRecord.user_id);

      if (updateError) {
        throw new Error('Failed to activate user account');
      }

      return NextResponse.json({ success: true, message: 'Account successfully activated via SasPay' });
    } else {
      // Si le paiement a échoué ou a été annulé
      await serviceRole
        .from('activation_payments')
        .update({ status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', paymentRecord.id);

      return NextResponse.json({ success: true, message: 'Payment failure recorded' });
    }

  } catch (error) {
    console.error('SasPay webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}