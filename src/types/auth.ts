import type { TranslationKey } from "@/i18n/dictionaries";

/**
 * Shared authentication types.
 *
 * Field names here follow the TryQash database plan:
 * - email + password are Supabase Auth credentials (NOT profiles columns).
 * - username / country / referral_code belong to the profile and referral
 *   creation process handled by the database handle_new_user() trigger.
 */

export type AuthErrorCode = "NOT_CONFIGURED" | "VALIDATION" | "PROVIDER";

/** Form fields an auth error can be attributed to. */
export type AuthErrorField =
  | "email"
  | "password"
  | "username"
  | "referralCode"
  | "identifier";

export interface AuthError {
  /** Machine-readable category. NOT_CONFIGURED means env vars are missing. */
  code: AuthErrorCode;
  /**
   * Translation key for messages the frontend owns. Preferred over
   * `message` so errors appear in the active language.
   */
  messageKey?: TranslationKey;
  /**
   * Raw provider message, used only when no translation key applies
   * (arbitrary Supabase text cannot be translated reliably).
   */
  message?: string;
  /** When set, the error is attached to this field instead of the form. */
  field?: AuthErrorField;
}

export type AuthResult = { ok: true } | { ok: false; error: AuthError };

export interface AuthCredentials {
  email: string;
  password: string;
}

/**
 * Sign-in payload. The identifier may be an email address or a username;
 * the service classifies it (see src/lib/identifier.ts).
 */
export interface LoginCredentials {
  identifier: string;
  password: string;
}

/**
 * Registration payload. username, country, and referralCode are forwarded
 * to Supabase Auth as raw_user_meta_data so the database trigger can
 * consume them (see src/services/auth.service.ts).
 */
export interface RegistrationDetails extends AuthCredentials {
  /** Database constraint: 3-20 chars, letters, numbers, underscores. */
  username: string;
  /** ISO 3166-1 alpha-2 code, matching the profiles.country char(2) column. */
  country: string;
  /** Optional code identifying the referrer. Never the user's own code. */
  referralCode?: string;
}
