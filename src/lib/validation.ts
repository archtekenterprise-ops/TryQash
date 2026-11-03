import type { TranslationKey } from "@/i18n/dictionaries";

/**
 * Client-side form validators.
 *
 * Each validator returns a TRANSLATION KEY (or null when the value is
 * valid) rather than a finished sentence, so the same rule works in every
 * supported language. Components translate the key with t().
 *
 * Important: client-side validation is a UX convenience only. It never
 * replaces server-side / database enforcement.
 *
 * Rules marked PROVISIONAL still need confirmation against the backend.
 * The username and country rules mirror the TryQash database plan
 * (3-20 char username of letters/numbers/underscores, country char(2)).
 */

export const PASSWORD_MIN_LENGTH = 8;

/** Database constraint for profiles.username. */
export const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getEmailError(value: string): TranslationKey | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "validation.email.required";
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "validation.email.invalid";
  }
  return null;
}

/** Boolean form of the email rule, for non-form checks. */
export function isValidEmail(value: string): boolean {
  return getEmailError(value) === null;
}

export function getPasswordError(value: string): TranslationKey | null {
  if (!value) {
    return "validation.password.required";
  }
  if (value.length < PASSWORD_MIN_LENGTH) {
    return "validation.password.tooShort";
  }
  return null;
}

export function getPasswordConfirmationError(
  password: string,
  confirmation: string,
): TranslationKey | null {
  if (!confirmation) {
    return "validation.confirm.required";
  }
  if (confirmation !== password) {
    return "validation.confirm.mismatch";
  }
  return null;
}

export function getUsernameError(value: string): TranslationKey | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "validation.username.required";
  }
  if (!USERNAME_PATTERN.test(trimmed)) {
    return "validation.username.invalid";
  }
  return null;
}

export function getCountryError(value: string): TranslationKey | null {
  if (!value) {
    return "validation.country.required";
  }
  if (!/^[A-Z]{2}$/.test(value)) {
    return "validation.country.invalid";
  }
  return null;
}

/** Login accepts an email address or a username. */
export function getIdentifierError(value: string): TranslationKey | null {
  if (!value.trim()) {
    return "validation.identifier.required";
  }
  return null;
}
