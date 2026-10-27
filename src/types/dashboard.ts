/**
 * Dashboard data models for the TryQash earning platform.
 *
 * Field names follow the TryQash database plan for the profile section.
 * Earnings, activity, and referral shapes are PROVISIONAL: their final
 * structure depends on the backend contract (ledger, provider integrations,
 * referral rules). Fields marked "provisional" exist only for this preview
 * interface.
 */

/** Account statuses defined by the database plan. */
export type AccountStatus = "active" | "suspended" | "banned";

/**
 * The current user's profile. Mirrors the plan's fields; full name and
 * phone number deliberately do not exist here because the plan does not
 * define them.
 */
export interface UserProfile {
  username: string;
  /** ISO 3166-1 alpha-2 code (profiles.country char(2)). */
  country: string;
  /** The user's own referral code (assigned by the backend). */
  referralCode: string;
  status: AccountStatus;
  /** ISO timestamps. Provisional: column names depend on the backend. */
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Earnings figures for the overview cards.
 *
 * PROVISIONAL structure. Amounts are integers in the currency's minor unit
 * (e.g. cents) to avoid floating-point money bugs.
 *
 * A points balance is deliberately NOT included: the points system and any
 * points-to-money conversion are unconfirmed. If points are confirmed, add
 * it here as a separate, explicitly typed field.
 */
export interface EarningsSummary {
  /** ISO 4217 currency code, e.g. "USD". Provisional. */
  currency: string;
  /** Cumulative earnings recorded for the user. Minor units. Provisional. */
  totalEarnedMinor: number;
  /** Earnings eligible for use or withdrawal (final rules TBD). Provisional. */
  availableEarnedMinor: number;
  /** Awaiting provider confirmation or validation. Provisional. */
  pendingEarnedMinor: number;
}

/** Earning sources supported by the platform concept. */
export type EarningSource = "survey" | "offerwall" | "affiliate" | "referral";

/**
 * Activity status labels. Display-only frontend states; the real rules
 * (approval flows, anti-fraud holds) belong to the backend.
 */
export type EarningStatus = "pending" | "approved" | "rejected";

/** One row of recent earning activity. */
export interface EarningActivity {
  id: string;
  /** Display text from the backend, e.g. the survey or task name. */
  description: string;
  source: EarningSource;
  /** ISO timestamp of the activity. */
  occurredAt: string;
  /** Minor units, positive. A reward, never a transfer. Provisional. */
  rewardMinor: number;
  status: EarningStatus;
}

/** Four ways to earn. Identifiers are stable; status comes from the backend. */
export type EarningOpportunityId =
  | "surveys"
  | "offerwalls"
  | "affiliates"
  | "referrals";

export interface EarningOpportunity {
  id: EarningOpportunityId;
  /**
   * "available" only when the provider integration really exists.
   * "coming-soon" while it is not integrated.
   */
  status: "available" | "coming-soon";
}

/**
 * Referral summary for the referral card.
 *
 * PROVISIONAL. The plan's three-level referral system is unconfirmed; these
 * fields carry no commission rates, payouts, or level calculations.
 */
export interface ReferralInfo {
  /** The user's own referral code, or null when unavailable. */
  code: string | null;
  /** Count of people who joined through this user. Provisional. */
  friendsJoined: number;
  /** Referral rewards awaiting confirmation. Provisional. */
  rewardsPending: number;
}

/**
 * Complete payload for the dashboard page. null means that part is missing
 * or unavailable and the UI must show a neutral state, never invent values.
 * An empty activity list means the user simply has no earning activity yet.
 */
export interface DashboardData {
  profile: UserProfile | null;
  earnings: EarningsSummary | null;
  opportunities: EarningOpportunity[];
  activity: EarningActivity[];
  referrals: ReferralInfo | null;
}

/** Result contract for the dashboard data service. */
export type DashboardDataResult =
  | { status: "ok"; data: DashboardData }
  /** Service has no backend wired up: show the neutral integration state. */
  | { status: "not-connected" }
  /** Retrieval genuinely failed (network/server): show error with retry. */
  | { status: "error" };
