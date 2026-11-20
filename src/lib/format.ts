import type { Locale } from "@/i18n/config";

/**
 * Locale-aware formatting helpers. Used by the dashboard to present money
 * and dates in the active language (e.g. fr-FR uses comma decimals and
 * spaces).
 */

const intlLocale = (locale: Locale): string =>
  locale === "fr" ? "fr-FR" : "en-US";

function currencyFractionDigits(currency: string, locale: Locale): number {
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
  }).resolvedOptions().maximumFractionDigits ?? 2;
}

/**
 * Formats an integer amount in the currency's minor unit as a currency
 * string, e.g. 482050 USD -> "$4,820.50" or 3500 XAF -> "3,500 FCFA".
 */
export function formatMoney(
  minorUnits: number,
  currency: string,
  locale: Locale,
): string {
  const digits = currencyFractionDigits(currency, locale);
  const value = minorUnits / 10 ** digits;
  return new Intl.NumberFormat(intlLocale(locale), {
    style: "currency",
    currency,
  }).format(value);
}

/** Formats a minor-unit amount with an explicit sign, e.g. "+$250.00". */
export function formatSignedMoney(
  minorUnits: number,
  currency: string,
  locale: Locale,
): string {
  const formatted = formatMoney(Math.abs(minorUnits), currency, locale);
  if (minorUnits === 0) {
    return formatted;
  }
  return minorUnits > 0 ? `+${formatted}` : `-${formatted}`;
}

/** Formats an ISO date as a medium-length date in the active locale. */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(intlLocale(locale), {
    dateStyle: "medium",
  }).format(date);
}

/**
 * Builds avatar initials from a username: first two letters, uppercase.
 * Returns null when the username has no letters.
 */
export function initialsFromUsername(username: string): string | null {
  const letters = username.replace(/[^A-Za-z]/g, "");
  return letters.length > 0 ? letters.slice(0, 2).toUpperCase() : null;
}
