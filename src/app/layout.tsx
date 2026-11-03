import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/context";
import { getLocale } from "@/i18n/server";
import "./globals.css";

/*
 * Inter is vendored locally (src/app/fonts) via next/font/local, so builds
 * never depend on a font CDN and rendering has zero network font cost.
 * It exposes --font-inter, consumed by the --font-sans token in globals.css.
 */
const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/inter-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "TryQash",
    template: "%s - TryQash",
  },
  description:
    "TryQash web application. The frontend foundation and shared design system are in place; product features follow in later milestones.",
};

/**
 * Root layout. The active locale is read from the cookie on the server so
 * the first paint is already translated and <html lang> is correct. This
 * makes routes dynamic, which is expected for a cookie-driven UI.
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body
        className={`${inter.variable} flex min-h-dvh flex-col bg-surface-page font-sans text-body antialiased`}
      >
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
