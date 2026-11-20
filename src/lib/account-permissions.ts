import type { AccountAccessState, AccountStatus } from "@/types/account";

/** Navigation areas whose policy may differ by account status. */
export type PlatformArea =
  | "dashboard"
  | "surveys"
  | "offerwalls"
  | "affiliates"
  | "referrals"
  | "earningsHistory"
  | "profile"
  | "help"
  | "activation";

/**
 * Provisional frontend navigation policy.
 *
 * Pending and active rules reflect Sprint 2. Suspended/banned permissions
 * for profile and earnings history are explicitly isolated HERE pending the
 * CTO/backend policy, so no component invents its own rule.
 *
 * This controls UX only. Developer 2 must enforce the same (or stricter)
 * policy on every backend endpoint.
 */
export const ACCOUNT_AREA_POLICY: Record<
  AccountStatus,
  Record<PlatformArea, boolean>
> = {
  pending: {
    dashboard: true,
    surveys: true,
    offerwalls: true,
    affiliates: true,
    referrals: true,
    earningsHistory: true,
    profile: true,
    help: true,
    activation: true,
  },
  active: {
    dashboard: true,
    surveys: true,
    offerwalls: true,
    affiliates: true,
    referrals: true,
    earningsHistory: true,
    profile: true,
    help: true,
    activation: false,
  },
  suspended: {
    dashboard: false,
    surveys: false,
    offerwalls: false,
    affiliates: false,
    referrals: false,
    // Provisional until final policy: no earnings history.
    earningsHistory: false,
    // Provisional: account info remains visible, editing is not implemented.
    profile: true,
    help: true,
    activation: false,
  },
  banned: {
    dashboard: false,
    surveys: false,
    offerwalls: false,
    affiliates: false,
    referrals: false,
    earningsHistory: false,
    // Minimal banned experience: support only.
    profile: false,
    help: true,
    activation: false,
  },
};

export function canAccessArea(
  state: AccountAccessState,
  area: PlatformArea,
): boolean {
  return state.emailVerified && ACCOUNT_AREA_POLICY[state.accountStatus][area];
}

/** Browsing and participation are deliberately different permissions. */
export function canBrowseEarningServices(state: AccountAccessState): boolean {
  return (
    state.emailVerified &&
    (state.accountStatus === "pending" || state.accountStatus === "active")
  );
}

/** Only backend-confirmed active accounts may participate. */
export function canParticipateInEarningActivities(
  state: AccountAccessState,
): boolean {
  return state.emailVerified && state.accountStatus === "active";
}

export type ParticipationOutcome =
  | "verify-email"
  | "activation-required"
  | "allowed"
  | "restricted";

/** Single decision used by every earning action and direct-action route. */
export function getParticipationOutcome(
  state: AccountAccessState,
): ParticipationOutcome {
  if (!state.emailVerified) return "verify-email";
  if (state.accountStatus === "active") return "allowed";
  if (state.accountStatus === "pending") return "activation-required";
  return "restricted";
}

export type AccountRestriction =
  | "email-unverified"
  | "suspended"
  | "banned"
  | null;

export function getAccountRestriction(
  state: AccountAccessState,
): AccountRestriction {
  if (!state.emailVerified) return "email-unverified";
  if (state.accountStatus === "suspended") return "suspended";
  if (state.accountStatus === "banned") return "banned";
  return null;
}
