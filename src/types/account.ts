/**
 * Sprint 2 account access model.
 *
 * These properties are intentionally separate:
 * - Email verification proves ownership of the email address.
 * - Account status controls platform access.
 * - Activation payment status describes the payment process only.
 *
 * A payment redirect or frontend success message MUST NOT set accountStatus
 * to active. Only a refreshed backend account response may do that.
 */

export type AccountStatus = "pending" | "active" | "suspended" | "banned";

export type ActivationPaymentStatus =
  | "not_started"
  | "pending"
  | "successful"
  | "failed"
  | "cancelled";

/**
 * Activation price supplied by backend/configuration. null means it is not
 * available and the frontend must never invent one.
 */
export interface ActivationPrice {
  amountMinor: number;
  currency: string;
}

/** Complete snapshot required by status-aware frontend navigation. */
export interface AccountAccessState {
  emailVerified: boolean;
  accountStatus: AccountStatus;
  activationPaymentStatus: ActivationPaymentStatus;
  activationPrice: ActivationPrice | null;
}

/** Provider-neutral result used by account/activation service functions. */
export type AccountServiceResult<T> =
  | { ok: true; data: T }
  | {
      ok: false;
      error: "NOT_CONNECTED" | "NOT_AVAILABLE" | "UNKNOWN";
    };
