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
 * comes from. No backend endpoints exist yet, so the functions below are
 * placeholders backed by an isolated development mock.
 *
 * BACKEND INTEGRATION POINTS (to be defined by the backend developer):
 *
 * 1. Current user's profile - see getCurrentUserProfile().
 * 2. Earnings summary - see getEarningsSummary(). The project's planned
 *    unified earnings ledger and anti-fraud controls are BACKEND
 *    responsibilities; this service only reads their results.
 * 3. Available earning opportunities - see getEarningOpportunities().
 * 4. Recent earning activity - see getRecentEarningActivity().
 * 5. Referral information - see getReferralInfo().
 * 6. getDashboardData() composes all of the above for the page.
 *
 * Endpoint URLs, HTTP methods, payloads, and response formats are NOT
 * defined and are marked TODO. Do not call Supabase (or any provider)
 * from here until the contract is agreed; see docs/BACKEND_INTEGRATION.md,
 * "Dashboard data".
 *
 * Authentication note: the caller (src/app/dashboard/page.tsx) performs the
 * session check. When the real backend lands, every query here must be
 * scoped to the authenticated user server-side per the backend's RLS rules.
 * Nothing here must hardcode the mock values into the final architecture:
 * implement the TODOs and delete src/services/mocks/dashboard.mock.ts.
 */

export interface DashboardQuery {
  /** Signed-in user's email when a session exists, else null. */
  email: string | null;
  /** Preview state override (?preview=...); inert once the mock is removed. */
  preview?: string;
}

/**
 * Placeholder: the current user's profile. Returns null when the profile
 * cannot be loaded; the UI must then stay neutral (no invented identity).
 * TODO(backend): implement and document the actual endpoint.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  return getMockDashboardData("loaded").profile;
}

/**
 * Placeholder: total / available / pending earnings. Returns null when
 * earnings data is missing or unavailable; the UI must show "not
 * available", never invented figures. TODO(backend): real endpoint.
 */
export async function getEarningsSummary(): Promise<EarningsSummary | null> {
  return getMockDashboardData("loaded").earnings;
}

/**
 * Placeholder: earning opportunities and their statuses. An empty array
 * means no earning service is integrated yet. TODO(backend): real endpoint.
 */
export async function getEarningOpportunities(): Promise<EarningOpportunity[]> {
  return getMockDashboardData("loaded").opportunities;
}

/**
 * Placeholder: recent earning activity. An empty array means the user
 * simply has none yet. TODO(backend): real endpoint.
 */
export async function getRecentEarningActivity(): Promise<EarningActivity[]> {
  return getMockDashboardData("loaded").activity;
}

/**
 * Placeholder: referral code and referral activity summary. Returns null
 * when referral information is unavailable; the card shows its placeholder.
 * TODO(backend): real endpoint. Referral reward rules (the planned
 * three-level system) are a backend responsibility and are not part of this
 * reading shape beyond what the card needs to display.
 */
export async function getReferralInfo(): Promise<ReferralInfo | null> {
  return getMockDashboardData("loaded").referrals;
}

/**
 * Loads everything the dashboard page needs. While the development mock is
 * enabled (src/services/mocks/dashboard.mock.ts, DASHBOARD_MOCK_ENABLED) it
 * returns sample data, clearly labelled as such in the UI. The ?preview=
 * query selects a mock state purely for development. Once the mock module
 * is deleted, this function must call the real endpoints.
 */
export async function getDashboardData(
  query: DashboardQuery,
): Promise<DashboardDataResult> {
  if (!DASHBOARD_MOCK_ENABLED) {
    void query;
    return { status: "not-connected" };
  }

  const state = parsePreviewState(query.preview);

  if (state === "error") {
    // Simulates a retrieval failure so the error and retry state is real.
    return { status: "error" };
  }

  const data = getMockDashboardData(state);
  return { status: "ok", data };
}
