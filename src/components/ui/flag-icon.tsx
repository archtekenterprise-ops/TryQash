import type { Locale } from "@/i18n/config";

/**
 * Small inline SVG flags for the language switcher.
 *
 * SVG is used instead of emoji flags because emoji flags do not render on
 * several platforms (notably Windows) and the project avoids emoji in the
 * interface. Flags are decorative: the switcher always carries a text
 * label and an accessible name.
 */
export function FlagIcon({
  locale,
  className = "size-4",
}: {
  locale: Locale;
  className?: string;
}) {
  if (locale === "fr") {
    return (
      <svg
        viewBox="0 0 3 2"
        aria-hidden="true"
        focusable="false"
        className={`${className} shrink-0 rounded-[2px]`}
      >
        <rect width="3" height="2" fill="#ffffff" />
        <rect width="1" height="2" fill="#002654" />
        <rect x="2" width="1" height="2" fill="#ce1126" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 60 30"
      aria-hidden="true"
      focusable="false"
      className={`${className} shrink-0 rounded-[2px]`}
    >
      <clipPath id="tryqash-flag-gb">
        <path d="M0 0h60v30H0z" />
      </clipPath>
      <g clipPath="url(#tryqash-flag-gb)">
        <path d="M0 0h60v30H0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}
