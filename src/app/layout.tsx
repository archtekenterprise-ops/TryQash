import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/i18n/context";
import { getLocale } from "@/i18n/server";
import "./globals.css";

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
        className="flex min-h-dvh flex-col bg-surface-page font-sans text-body antialiased"
      >
        <LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
