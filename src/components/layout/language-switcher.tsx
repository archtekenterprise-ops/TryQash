"use client";

import { FlagIcon } from "@/components/ui/flag-icon";
import { LOCALE_LABELS, LOCALE_SHORT, type Locale } from "@/i18n/config";
import { useLanguage } from "@/i18n/context";

/**
 * Language switcher shown in the top right corner of every screen.
 *
 * With exactly two supported languages a single toggle button is clearer
 * than a dropdown: it shows the active language (flag + code) and switches
 * to the other one when activated. The accessible name states both the
 * current language and the action, since the flag alone is decorative.
 *
 * Switching is instant and purely client-side: no reload, no navigation,
 * and no route refresh. The choice is persisted in a cookie so the next
 * full page load starts in the selected language.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();
  const nextLocale: Locale = locale === "en" ? "fr" : "en";

  return (
    <button
      type="button"
      onClick={() => setLocale(nextLocale)}
      lang={locale}
      title={t("language.switchTo", { language: LOCALE_LABELS[nextLocale] })}
      aria-label={`${t("language.current", {
        language: LOCALE_LABELS[locale],
      })} ${t("language.switchTo", { language: LOCALE_LABELS[nextLocale] })}`}
      className={[
        "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-control border border-surface-strong bg-surface-page px-2 text-xs font-medium text-body transition-colors hover:bg-surface-subtle",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FlagIcon locale={locale} className="h-3 w-[18px]" />
      {LOCALE_SHORT[locale]}
    </button>
  );
}
