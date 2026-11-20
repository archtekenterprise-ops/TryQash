import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/account/state
 *
 * Returns the user's account status and activation payment status.
 * Called by the frontend to display account state (pending/active) and payment state.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get account status from profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .single();

    // Get most recent payment status
    const { data: payment } = await supabase
      .from('activation_payments')
      .select('status, amount, currency')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      success: true,
      data: {
        accountStatus: profile?.status || 'pending',
        activationPaymentStatus: payment?.status || 'not_started',
        activationPrice: payment ? {
          amountMinor: parseInt(payment.amount) * 100, // Convert to minor units
          currency: payment.currency,
        } : null,
      },
    });
  } catch (error) {
    console.error('Error fetching account state:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account state' },
      { status: 500 }
    );
  }
}
