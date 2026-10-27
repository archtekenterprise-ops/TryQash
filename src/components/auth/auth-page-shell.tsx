import Link from "next/link";
import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Card } from "@/components/ui/card";

export interface AuthPageShellProps {
  /** Card heading, rendered as the page h1. */
  title: string;
  /** Muted helper line under the heading. */
  description: string;
  /** Form content. */
  children: ReactNode;
  /** Secondary navigation shown below the card (e.g. link to the other auth page). */
  footer?: ReactNode;
}

/**
 * Shared centered layout for the unauthenticated pages (/login, /register,
 * /forgot-password, /reset-password). It intentionally does NOT render the
 * dashboard sidebar: the application shell only applies to signed-in areas.
 * The language switcher sits in the top right corner, as on every screen.
 */
export function AuthPageShell({
  title,
  description,
  children,
  footer,
}: AuthPageShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-page">
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>

      <main className="flex flex-1 items-start justify-center px-4 pb-10 sm:items-center sm:pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center">
            <Link
              href="/"
              className="rounded-control text-lg font-semibold tracking-tight text-heading"
            >
              TryQash
            </Link>
          </div>

          <Card elevated className="mt-6 bg-surface-page">
            <h1 className="text-xl font-semibold tracking-tight text-heading">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-muted">{description}</p>
            <div className="mt-6">{children}</div>
          </Card>

          {footer ? (
            <p className="mt-6 text-center text-sm text-muted">{footer}</p>
          ) : null}
        </div>
      </main>
    </div>
  );
}
