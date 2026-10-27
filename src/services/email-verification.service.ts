"use client";

/* -------------------------------------------------------------------------
 * DEMO MOCK - DELETE THIS BLOCK WHEN THE BACKEND IS CONNECTED.
 *
 * Set USE_DEMO_MOCK to true to demonstrate every UI state without a
 * backend. It performs NO real verification and must never be enabled in
 * production. Demo codes: 000000 = expired, 111111 = invalid,
 * 222222 = rate limited, anything else = success.
 * ---------------------------------------------------------------------- */
const USE_DEMO_MOCK = false;

function mockDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function mockVerify(code: string): Promise<VerificationResult> {
  await mockDelay(1200);
  if (code === "000000") {
    return { ok: false, error: { code: "EXPIRED_CODE" } };
  }
  if (code === "111111") {
    return { ok: false, error: { code: "INVALID_CODE" } };
  }
  if (code === "222222") {
    return { ok: false, error: { code: "RATE_LIMITED" } };
  }
  return { ok: true };
}

async function mockResend(): Promise<VerificationResult> {
  await mockDelay(1000);
  return { ok: true };
}
/* --------------------------- END DEMO MOCK --------------------------- */

/**
 * Email verification service.
 *
 * FRONTEND ONLY. This is the single place the verify-email page talks to
 * for verification operations, and it is deliberately independent of any
 * authentication provider (including Supabase). No backend endpoints
 * exist yet, so both functions return a NOT_CONNECTED result instead of
 * pretending to succeed. Nothing here calls Brevo: transactional email
 * will be delivered by the backend in a later phase.
 *
 * BACKEND INTEGRATION POINTS (to be defined by the backend developer):
 *
 * 1. verifyEmailCode(input) - verify the six-digit code for an email.
 *    Endpoint, HTTP method, request payload, and response format are NOT
 *    defined yet. The result must distinguish: valid code, invalid code,
 *    expired code, and rate limited.
 * 2. resendVerificationCode(input) - send a new code to the address.
 *    Same: endpoint/method/payload/response to be agreed. The backend owns
 *    the real resend rules (cooldown, attempt limits); the frontend only
 *    mirrors a cooldown in the UI.
 * 3. The frontend identifies the user by email address. If the backend
 *    prefers a session token or a pending-verification identifier, change
 *    the input types in this file only - the page does not depend on the
 *    transport details.
 *
 * See docs/BACKEND_INTEGRATION.md, "Email verification".
 */

export type VerificationErrorCode =
  | "NOT_CONNECTED"
  | "INVALID_CODE"
  | "EXPIRED_CODE"
  | "RATE_LIMITED"
  | "UNKNOWN";

export interface VerificationError {
  code: VerificationErrorCode;
  /** Raw provider message for logging only; the UI translates codes. */
  message?: string;
}

export type VerificationResult =
  | { ok: true }
  | { ok: false; error: VerificationError };

export interface VerifyEmailCodeInput {
  email: string;
  code: string;
}

export interface ResendVerificationCodeInput {
  email: string;
}

function notConnected(): VerificationResult {
  return { ok: false, error: { code: "NOT_CONNECTED" } };
}

export async function verifyEmailCode(
  input: VerifyEmailCodeInput,
): Promise<VerificationResult> {
  if (USE_DEMO_MOCK) {
    return mockVerify(input.code);
  }

  // TODO(backend): call the verification endpoint once the contract is
  // agreed, and map its response to VerificationResult. Until then the
  // page shows a clear "not connected" state and never fakes a success.
  void input;
  return notConnected();
}

export async function resendVerificationCode(
  input: ResendVerificationCodeInput,
): Promise<VerificationResult> {
  if (USE_DEMO_MOCK) {
    return mockResend();
  }

  // TODO(backend): call the resend endpoint once the contract is agreed.
  void input;
  return notConnected();
}
