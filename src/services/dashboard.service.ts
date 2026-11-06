import type {
  DashboardDataResult,
  EarningActivity,
  EarningOpportunity,
  EarningsSummary,
  ReferralInfo,
  UserProfile,
} from "@/types/dashboard";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Dashboard data service.
 *
 * Connects the dashboard UI directly to Supabase.
 * All calls are made server-side using the Supabase client.
 */

export interface DashboardQuery {
  /** Signed-in user's email when a session exists, else null. */
  email: string | null;
  /** Auth token for API calls */
  token: string | null;
  /** Preview state override (?preview=...); inert once the mock is removed. */
  preview?: string;
}

/**
 * Fetches the current user's profile from Supabase.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, username, country, phone, status, referral_code, created_at, updated_at')
      .eq('id', user.id)
      .single();

    if (!profile) return null;

    // Correction : Mapping explicite de snake_case vers camelCase pour referralCode
    return {
      id: profile.id,
      username: profile.username,
      country: profile.country,
      phone: profile.phone,
      status: profile.status,
      referralCode: profile.referral_code,
      createdAt: profile.created_at,
      updated_at: profile.updated_at,
    } as UserProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Fetches the user's earnings summary from Supabase.
 */
export async function getEarningsSummary(): Promise<EarningsSummary | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: wallet } = await supabase
      .from('wallets')
      .select('balance, total_earned, total_withdrawn')
      .eq('user_id', user.id)
      .single();

    return {
      currency: 'USD',
      totalEarnedMinor: wallet?.total_earned || 0,
      availableEarnedMinor: wallet?.balance || 0,
      pendingEarnedMinor: 0,
    };
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return null;
  }
}

/**
 * Returns earning opportunities - currently all marked as coming-soon.
 */
export async function getEarningOpportunities(): Promise<EarningOpportunity[]> {
  return [
    { id: "surveys", status: "coming-soon" },
    { id: "offerwalls", status: "coming-soon" },
    { id: "affiliates", status: "coming-soon" },
    { id: "referrals", status: "coming-soon" },
  ];
}

/**
 * Fetches recent earning activity from Supabase.
 */
export async function getRecentEarningActivity(): Promise<EarningActivity[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return [];

    const { data: ledger } = await supabase
      .from('ledger_entries')
      .select('entry_type, amount, note, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return ledger?.map(entry => ({
      id: `act-${entry.created_at}`,
      description: entry.note || entry.entry_type,
      source: entry.entry_type,
      occurredAt: entry.created_at,
      rewardMinor: entry.amount,
      status: 'approved',
    })) || [];
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
}

/**
 * Fetches referral information from Supabase.
 */
export async function getReferralInfo(): Promise<ReferralInfo | null> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', user.id)
      .single();

    const { data: referrals } = await supabase
      .from('referrals')
      .select('level')
      .eq('referrer_id', user.id);

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

    return {
      code: profile?.referral_code || '',
      friendsJoined: levelCounts.total,
      rewardsPending: 0,
    };
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return null;
  }
}

/**
 * Loads everything the dashboard page needs from Supabase.
 */
export async function getDashboardData(
  query: DashboardQuery,
): Promise<DashboardDataResult> {
  const { token } = query;

  if (!token) {
    return { status: "not-connected" };
  }

  try {
    const [profile, earnings, opportunities, activity, referrals] = await Promise.all([
      getCurrentUserProfile(),
      getEarningsSummary(),
      getEarningOpportunities(),
      getRecentEarningActivity(),
      getReferralInfo(),
    ]);

    return {
      status: "ok",
      data: {
        profile,
        earnings,
        opportunities,
        activity,
        referrals,
      },
    };
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    return { status: "error" };
  }
}