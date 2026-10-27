"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, type Locale } from "./config";
import { translate, type TranslationKey } from "./dictionaries";

export type TranslateFn = (
  key: TranslationKey,
  values?: Record<string, string | number>,
) => string;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Provides the active locale to client components.
 *
 * Switching is deliberately INSTANT and purely client-side:
 *
 * - The new locale is stored in React state, so every component using
 *   useTranslation() re-renders in the new language immediately.
 * - The choice is persisted in the tryqash_locale cookie, so full page
 *   loads and soft navigations render the right language server-side
 *   (<html lang> and page metadata).
 * - <html lang> is updated directly for assistive technology.
 *
 * There is NO router.refresh(), no Server Action, and no navigation. That
 * is intentional: a refresh caused a visible reload and, through the App
 * Router's client cache, previously served stale payloads in the old
 * language (making the app appear to switch back to English).
 *
 * CONSEQUENCE / CONVENTION: all user-visible text must be rendered by
 * client components through useTranslation(). Server components only read
 * the locale for generateMetadata; text they rendered would not change
 * until the next full load. Every page in this project follows the
 * convention (see README, "Languages").
 */
export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    // Persist for the next full load, and so that soft navigations ask the
    // server for metadata in the right language. No refresh is triggered.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, values) => translate(locale, key, values),
    }),
    [locale, setLocale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/** Access the active locale and translator inside a client component. */
export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside a LanguageProvider.");
  }
  return context;
}

/** Shorthand when only the translate function is needed. */
export function useTranslation(): TranslateFn {
  return useLanguage().t;
}

/**
 * Keeps the browser tab title in the active language after a client-side
 * language switch. Server-rendered metadata only updates on navigation or
 * a full load, so pages call this with their translated title.
 */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
