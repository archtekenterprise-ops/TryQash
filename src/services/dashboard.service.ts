import type {
  DashboardDataResult,
  EarningActivity,
  EarningOpportunity,
  EarningsSummary,
  ReferralInfo,
  UserProfile,
} from "@/types/dashboard";
import {
  DASHBOARD_MOCK_ENABLED,
  getMockDashboardData,
  parsePreviewState,
} from "./mocks/dashboard.mock";

/**
 * Dashboard data service.
 *
 * FRONTEND ONLY. This module separates data retrieval from the dashboard
 * UI: the page asks this service, and the service decides where the data
 * comes from.
 *
 * BACKEND CONNECTION: Connected to backend APIs at http://localhost:3001
 */

export interface DashboardQuery {
  /** Signed-in user's email when a session exists, else null. */
  email: string | null;
  /** Preview state override (?preview=...); inert once the mock is removed. */
  preview?: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

/**
 * Get the current user's profile from the backend.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (DASHBOARD_MOCK_ENABLED) {
    return getMockDashboardData("loaded").profile;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch profile:", response.status);
      return null;
    }

    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}

/**
 * Get earnings summary from the backend.
 */
export async function getEarningsSummary(): Promise<EarningsSummary | null> {
  if (DASHBOARD_MOCK_ENABLED) {
    return getMockDashboardData("loaded").earnings;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard/earnings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch earnings:", response.status);
      return null;
    }

    const data = await response.json();
    return {
      total: data.totalEarned || 0,
      available: data.balance || 0,
      pending: 0, // Backend doesn't provide pending yet
    };
  } catch (error) {
    console.error("Error fetching earnings:", error);
    return null;
  }
}

/**
 * Placeholder: earning opportunities and their statuses.
 * Backend endpoint not yet implemented.
 */
export async function getEarningOpportunities(): Promise<EarningOpportunity[]> {
  if (DASHBOARD_MOCK_ENABLED) {
    return getMockDashboardData("loaded").opportunities;
  }

  // TODO: Connect to backend when offers endpoint is implemented
  return [];
}

/**
 * Get recent earning activity from the backend.
 */
export async function getRecentEarningActivity(): Promise<EarningActivity[]> {
  if (DASHBOARD_MOCK_ENABLED) {
    return getMockDashboardData("loaded").activity;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard/activity`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch activity:", response.status);
      return [];
    }

    const data = await response.json();
    return data.activity || [];
  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
}

/**
 * Get referral information from the backend.
 */
export async function getReferralInfo(): Promise<ReferralInfo | null> {
  if (DASHBOARD_MOCK_ENABLED) {
    return getMockDashboardData("loaded").referrals;
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/dashboard/referrals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Failed to fetch referrals:", response.status);
      return null;
    }

    const data = await response.json();
    return {
      code: data.referralCode || "",
      totalReferrals: data.stats?.total || 0,
      level1Count: data.stats?.level1 || 0,
      level2Count: data.stats?.level2 || 0,
      level3Count: data.stats?.level3 || 0,
    };
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return null;
  }
}

/**
 * Loads everything the dashboard page needs.
 */
export async function getDashboardData(
  query: DashboardQuery,
): Promise<DashboardDataResult> {
  if (DASHBOARD_MOCK_ENABLED) {
    const state = parsePreviewState(query.preview);

    if (state === "error") {
      return { status: "error" };
    }

    const data = getMockDashboardData(state);
    return { status: "ok", data };
  }

  // Try to load real data from backend
  try {
    const [profile, earnings, opportunities, activity, referrals] =
      await Promise.all([
        getCurrentUserProfile(),
        getEarningsSummary(),
        getEarningOpportunities(),
        getRecentEarningActivity(),
        getReferralInfo(),
      ]);

    if (!profile || !earnings) {
      return { status: "error" };
    }

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
    console.error("Error loading dashboard data:", error);
    return { status: "error" };
  }
}
