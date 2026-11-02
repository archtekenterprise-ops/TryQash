import type {
  DashboardDataResult,
  EarningActivity,
  EarningOpportunity,
  EarningsSummary,
  ReferralInfo,
  UserProfile,
} from "@/types/dashboard";

/**
 * Dashboard data service.
 *
 * Connects the dashboard UI to the backend API endpoints.
 * All calls are made server-side to the /api/dashboard/* endpoints.
 */

export interface DashboardQuery {
  /** Signed-in user's email when a session exists, else null. */
  email: string | null;
  /** Auth token for API calls */
  token: string | null;
  /** Preview state override (?preview=...); inert once the mock is removed. */
  preview?: string;
}

async function fetchWithAuth(url: string, token: string | null) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetches the current user's profile from the backend.
 */
export async function getCurrentUserProfile(token: string | null): Promise<UserProfile | null> {
  try {
    const data = await fetchWithAuth('/api/dashboard/profile', token);
    return data.profile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

/**
 * Fetches the user's earnings summary from the backend.
 */
export async function getEarningsSummary(token: string | null): Promise<EarningsSummary | null> {
  try {
    const data = await fetchWithAuth('/api/dashboard/earnings', token);
    return {
      currency: 'USD',
      totalEarnedMinor: data.totalEarned || 0,
      availableEarnedMinor: data.balance || 0,
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
 * Fetches recent earning activity from the backend.
 */
export async function getRecentEarningActivity(token: string | null): Promise<EarningActivity[]> {
  try {
    const data = await fetchWithAuth('/api/dashboard/activity', token);
    return data.activity.map((item: any) => ({
      id: item.id || `act-${Date.now()}`,
      description: item.description,
      source: item.type,
      occurredAt: item.date,
      rewardMinor: item.amount,
      status: 'approved',
    }));
  } catch (error) {
    console.error('Error fetching activity:', error);
    return [];
  }
}

/**
 * Fetches referral information from the backend.
 */
export async function getReferralInfo(token: string | null): Promise<ReferralInfo | null> {
  try {
    const data = await fetchWithAuth('/api/dashboard/referrals', token);
    return {
      code: data.referralCode,
      friendsJoined: data.stats?.total || 0,
      rewardsPending: 0,
    };
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return null;
  }
}

/**
 * Loads everything the dashboard page needs from the backend.
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
      getCurrentUserProfile(token),
      getEarningsSummary(token),
      getEarningOpportunities(),
      getRecentEarningActivity(token),
      getReferralInfo(token),
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
