/**
 * Pure helpers for one-time-code input handling.
 *
 * A code is modelled as an array of fixed length where every entry is
 * either "" or a single digit. An array (rather than a plain string) is
 * used so that gaps are preserved: a user may type into box 4 before box 1
 * is filled, and the boxes must not shift.
 *
 * These functions are intentionally free of React so they can be tested
 * directly with Node.
 */

export const OTP_LENGTH = 6;

/** A fresh, empty code: length boxes, all blank. */
export function createEmptyOtp(length: number = OTP_LENGTH): string[] {
  return Array.from({ length }, () => "");
}

/** Keeps digits only, truncated to maxLength. */
export function sanitizeOtp(
  value: string,
  maxLength: number = OTP_LENGTH,
): string {
  return value.replace(/\D/g, "").slice(0, maxLength);
}

/** Overwrites the digit at index. */
export function setOtpDigit(
  digits: string[],
  index: number,
  digit: string,
): string[] {
  const next = [...digits];
  next[index] = digit;
  return next;
}

/** Clears the digit at index. */
export function clearOtpDigit(digits: string[], index: number): string[] {
  const next = [...digits];
  next[index] = "";
  return next;
}

/**
 * Writes a run of digits starting at index without exceeding the total
 * length. Non-digits are ignored. Used for paste and autofill.
 */
export function insertOtpDigits(
  digits: string[],
  index: number,
  pasted: string,
  length: number = OTP_LENGTH,
): string[] {
  const clean = sanitizeOtp(pasted, length - index);
  const next = [...digits];
  for (let i = 0; i < clean.length; i += 1) {
    next[index + i] = clean[i];
  }
  return next;
}

/** Joins the boxes into the code string, e.g. "123456". */
export function otpToString(digits: string[]): string {
  return digits.join("");
}

/** True when every box holds exactly one digit. */
export function isOtpComplete(
  digits: string[],
  length: number = OTP_LENGTH,
): boolean {
  return digits.length === length && digits.every((d) => /^\d$/.test(d));
}
