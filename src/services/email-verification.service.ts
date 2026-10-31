"use client";

/**
 * Email verification service.
 *
 * FRONTEND ONLY. This is the single place the verify-email page talks to
 * for verification operations, and it is deliberately independent of any
 * authentication provider (including Supabase).
 *
 * BACKEND CONNECTION: Connected to backend APIs at http://localhost:3001
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

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

export async function verifyEmailCode(
  input: VerifyEmailCodeInput,
): Promise<VerificationResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        token: input.code,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        error: {
          code: "UNKNOWN",
          message: errorData.error || "Verification failed",
        },
      };
    }

    const data = await response.json();
    if (data.success) {
      return { ok: true };
    }

    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: "Verification failed",
      },
    };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      ok: false,
      error: {
        code: "NOT_CONNECTED",
        message: "Backend not connected",
      },
    };
  }
}

export async function resendVerificationCode(
  input: ResendVerificationCodeInput,
): Promise<VerificationResult> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/verify-email/resend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        ok: false,
        error: {
          code: "UNKNOWN",
          message: errorData.error || "Resend failed",
        },
      };
    }

    const data = await response.json();
    if (data.success) {
      return { ok: true };
    }

    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: "Resend failed",
      },
    };
  } catch (error) {
    console.error("Error resending verification:", error);
    return {
      ok: false,
      error: {
        code: "NOT_CONNECTED",
        message: "Backend not connected",
      },
    };
  }
}
