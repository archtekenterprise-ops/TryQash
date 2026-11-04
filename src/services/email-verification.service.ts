"use client";

/**
 * Email verification service.
 *
 * Connects the verify-email page to the backend API endpoints.
 * Calls /api/verify-email and /api/verify-email/resend.
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

function mapError(error: any): VerificationError {
  const message = error?.message || 'Unknown error';
  
  if (message.includes('expired') || message.includes('EXPIRED')) {
    return { code: "EXPIRED_CODE", message };
  }
  if (message.includes('invalid') || message.includes('INVALID')) {
    return { code: "INVALID_CODE", message };
  }
  if (message.includes('rate') || message.includes('RATE')) {
    return { code: "RATE_LIMITED", message };
  }
  
  return { code: "UNKNOWN", message };
}

export async function verifyEmailCode(
  input: VerifyEmailCodeInput,
): Promise<VerificationResult> {
  try {
    const response = await fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.email, token: input.code }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: mapError(data) };
    }

    return { ok: true };
  } catch (error) {
    console.error('Error verifying email:', error);
    return { ok: false, error: { code: "UNKNOWN", message: 'Network error' } };
  }
}

export async function resendVerificationCode(
  input: ResendVerificationCodeInput,
): Promise<VerificationResult> {
  try {
    const response = await fetch('/api/verify-email/resend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: input.email }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: mapError(data) };
    }

    return { ok: true };
  } catch (error) {
    console.error('Error resending verification:', error);
    return { ok: false, error: { code: "UNKNOWN", message: 'Network error' } };
  }
}
