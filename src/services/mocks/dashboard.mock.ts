import type {
  DashboardData,
  EarningActivity,
  EarningOpportunity,
} from "@/types/dashboard";

/* ---------------------------------------------------------------------------
 * DASHBOARD DEVELOPMENT MOCK - DELETE THIS FILE WHEN THE BACKEND IS CONNECTED.
 *
 * Everything in here is SAMPLE DATA for the development preview. None of it
 * is real account information, real earnings, or real activity, and the UI
 * says so via the preview banner. The page calls getDashboardData() in
 * src/services/dashboard.service.ts, so removing this module and implementing
 * the TODOs there is all that is required to go live - no page changes.
 * ------------------------------------------------------------------------- */

/**
 * Master switch for the preview. While true, the dashboard service returns
 * the sample data below. The UI marks it visibly as preview data.
 */
export const DASHBOARD_MOCK_ENABLED = true;

/** States the preview can demonstrate, switchable via ?preview=<state>. */
export type DashboardMockState =
  | "loaded"
  | "new-user"
  | "no-earnings"
  | "no-opportunities"
  | "no-referral"
  | "error";

export const DASHBOARD_MOCK_STATES: DashboardMockState[] = [
  "loaded",
  "new-user",
  "no-earnings",
  "no-opportunities",
  "no-referral",
  "error",
];

export function parsePreviewState(value: unknown): DashboardMockState {
  return typeof value === "string" &&
    (DASHBOARD_MOCK_STATES as string[]).includes(value)
    ? (value as DashboardMockState)
    : "loaded";
}

const SAMPLE_PROFILE = {
  username: "amina.k",
  country: "US",
  referralCode: "AMINA42",
  status: "active",
  createdAt: "2026-10-20T09:00:00Z",
  updatedAt: "2026-10-26T14:30:00Z",
} satisfies DashboardData["profile"];

const SAMPLE_EARNINGS = {
  currency: "USD",
  totalEarnedMinor: 12450,
  availableEarnedMinor: 8200,
  pendingEarnedMinor: 4250,
} satisfies NonNullable<DashboardData["earnings"]>;

/**
 * All providers are marked coming-soon: no surveys, offerwalls, affiliates,
 * or referrals are integrated yet, and the cards must not suggest otherwise.
 */
const COMING_SOON_OPPORTUNITIES: EarningOpportunity[] = [
  { id: "surveys", status: "coming-soon" },
  { id: "offerwalls", status: "coming-soon" },
  { id: "affiliates", status: "coming-soon" },
  { id: "referrals", status: "coming-soon" },
];

/** Sample activity rows. They are not real account history. */
const SAMPLE_ACTIVITY: EarningActivity[] = [
  {
    id: "act-sample-1",
    description: "Survey: Mobile usage habits",
    source: "survey",
    occurredAt: "2026-10-26T10:15:00Z",
    rewardMinor: 350,
    status: "approved",
  },
  {
    id: "act-sample-2",
    description: "Offerwall: App install task",
    source: "offerwall",
    occurredAt: "2026-10-25T16:40:00Z",
    rewardMinor: 1200,
    status: "pending",
  },
  {
    id: "act-sample-3",
    description: "Referral invite joined",
    source: "referral",
    occurredAt: "2026-10-24T09:05:00Z",
    rewardMinor: 500,
    status: "approved",
  },
  {
    id: "act-sample-4",
    description: "Affiliate link: VPN offer signup",
    source: "affiliate",
    occurredAt: "2026-10-21T11:20:00Z",
    rewardMinor: 2400,
    status: "rejected",
  },
];

const SAMPLE_REFERRALS = {
  code: "AMINA42",
  friendsJoined: 2,
  rewardsPending: 1,
} satisfies NonNullable<DashboardData["referrals"]>;

/** Returns the sample payload for the requested preview state. */
export function getMockDashboardData(state: DashboardMockState): DashboardData {
  switch (state) {
    case "new-user":
      return {
        profile: SAMPLE_PROFILE,
        // A new user's zero earnings are real zeros, not missing data.
        earnings: {
          currency: "USD",
          totalEarnedMinor: 0,
          availableEarnedMinor: 0,
          pendingEarnedMinor: 0,
        },
        opportunities: COMING_SOON_OPPORTUNITIES,
        activity: [],
        referrals: { code: SAMPLE_PROFILE.referralCode, friendsJoined: 0, rewardsPending: 0 },
      };
    case "no-earnings":
      return {
        profile: SAMPLE_PROFILE,
        // Earnings summary missing/unavailable: cards must not invent any.
        earnings: null,
        opportunities: COMING_SOON_OPPORTUNITIES,
        activity: SAMPLE_ACTIVITY,
        referrals: SAMPLE_REFERRALS,
      };
    case "no-opportunities":
      return {
        profile: SAMPLE_PROFILE,
        earnings: SAMPLE_EARNINGS,
        // No available earning opportunities: section shows its empty state.
        opportunities: [],
        activity: SAMPLE_ACTIVITY,
        referrals: SAMPLE_REFERRALS,
      };
    case "no-referral":
      return {
        profile: SAMPLE_PROFILE,
        earnings: SAMPLE_EARNINGS,
        opportunities: COMING_SOON_OPPORTUNITIES,
        activity: SAMPLE_ACTIVITY,
        // Referral info unavailable: card shows its placeholder.
        referrals: null,
      };
    case "loaded":
    default:
      return {
        profile: SAMPLE_PROFILE,
        earnings: SAMPLE_EARNINGS,
        opportunities: COMING_SOON_OPPORTUNITIES,
        activity: SAMPLE_ACTIVITY,
        referrals: SAMPLE_REFERRALS,
      };
  }
}
