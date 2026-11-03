import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/dashboard/earnings
 *
 * Fetches the user's earnings summary from the wallets view.
 * Returns balance, total earned, and total withdrawn.
 */
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Use server client to verify the token and get the user
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Fetch the user's wallet from the wallets view
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance, total_earned, total_withdrawn')
      .eq('user_id', user.id)
      .single();

    if (walletError) {
      console.error('Error fetching wallet:', walletError);
      return NextResponse.json(
        { error: 'Failed to fetch earnings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      balance: wallet?.balance || 0,
      totalEarned: wallet?.total_earned || 0,
      totalWithdrawn: wallet?.total_withdrawn || 0,
    });
  } catch (error) {
    console.error('Error in earnings endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
