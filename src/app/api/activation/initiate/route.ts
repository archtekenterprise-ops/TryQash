import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { initiateSasPayActivation } from '@/services/account-service';

/**
 * POST /api/activation/initiate
 *
 * Initiates an activation payment through SasPay.
 * Called by the frontend when user clicks "Start Payment".
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    const userName = profile?.username || user.email || 'User';

    // Initiate payment (default 1000 XOF)
    const result = await initiateSasPayActivation(
      user.id,
      user.email || '',
      userName,
      1000
    );

    return NextResponse.json({
      success: true,
      data: {
        redirectUrl: result.paymentUrl,
        providerReference: result.providerReference,
        sasPayId: result.sasPayId,
      },
    });
  } catch (error) {
    console.error('Error initiating activation payment:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
