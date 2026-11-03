import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

/**
 * GET /api/dashboard/referrals
 *
 * Fetches the user's referral information including their referral code
 * and referral statistics.
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

    // Fetch the user's profile for referral code
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { error: 'Failed to fetch referral info' },
        { status: 500 }
      );
    }

    // Count referrals at each level
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('level')
      .eq('referrer_id', user.id);

    if (referralsError) {
      console.error('Error fetching referrals:', referralsError);
      return NextResponse.json(
        { error: 'Failed to fetch referral stats' },
        { status: 500 }
      );
    }

    // Count referrals by level
    const levelCounts = {
      level1: 0,
      level2: 0,
      level3: 0,
      total: 0,
    };

    referrals?.forEach(ref => {
      if (ref.level === 1) levelCounts.level1++;
      else if (ref.level === 2) levelCounts.level2++;
      else if (ref.level === 3) levelCounts.level3++;
      levelCounts.total++;
    });

    return NextResponse.json({
      referralCode: profile?.referral_code,
      stats: levelCounts,
    });
  } catch (error) {
    console.error('Error in referrals endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
