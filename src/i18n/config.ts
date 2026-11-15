/**
 * Internationalization configuration.
 *
 * The app is available in English and French. The chosen locale is stored
 * in a cookie so the server can render the correct language on a full page
 * load (correct <html lang>, no flash of the wrong language). Switching
 * itself is client-side and instant; see src/i18n/context.tsx.
 */

export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Cookie name holding the selected locale. Readable by the client. */
export const LOCALE_COOKIE = "tryqash_locale";

/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "fr";
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Francais",
};

/** Short code shown next to the flag in the switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
};

/** App name used in document titles. */
export const APP_NAME = "TryQash";

/**
 * Mirrors the metadata title template "%s - TryQash" in
 * src/app/layout.tsx, so the client-side title matches the server-rendered
 * one exactly.
 */
export function formatTitle(pageTitle: string): string {
  return `${pageTitle} - ${APP_NAME}`;
}
