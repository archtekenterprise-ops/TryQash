import { cookies } from "next/headers";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { translate, type TranslationKey } from "./dictionaries";

/**
 * Server-side locale helpers for Server Components, layouts, and
 * generateMetadata. Client components use useTranslation() instead
 * (src/i18n/context.tsx).
 */

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export interface ServerTranslator {
  locale: Locale;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

export async function getTranslator(): Promise<ServerTranslator> {
  const locale = await getLocale();
  return {
    locale,
    t: (key, values) => translate(locale, key, values),
  };
}
