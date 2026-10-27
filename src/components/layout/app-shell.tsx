"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "@/i18n/context";
import { LanguageSwitcher } from "./language-switcher";
import { Sidebar } from "./sidebar";

export interface AppShellProps {
  children: ReactNode;
}

/**
 * Shared application shell in the reference proportions:
 * a fixed-looking narrow sidebar (240px) beside a spacious main column.
 *
 * Desktop (lg and up): the sidebar is always visible.
 * Mobile: the sidebar becomes a slide-over drawer opened from the slim top
 * bar, closed via the backdrop, the close button, Escape, or navigation.
 */
export function AppShell({ children }: AppShellProps) {
  const t = useTranslation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    if (!navOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [navOpen]);

  return (
    <div className="flex min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-surface lg:block">
        <div className="sticky top-0 h-dvh">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile navigation drawer */}
      {navOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-50 lg:hidden"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-heading/40"
            onClick={() => setNavOpen(false)}
          />
          <div className="shadow-overlay absolute inset-y-0 left-0 w-64 max-w-[85vw]">
            <div className="relative h-full">
              <Sidebar onNavigate={() => setNavOpen(false)} />
              <button
                type="button"
                aria-label={t("nav.close")}
                onClick={() => setNavOpen(false)}
                className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-control text-muted transition-colors hover:bg-surface-subtle hover:text-heading"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Slim mobile top bar (desktop pages use TopBar instead) */}
        <div className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-surface bg-surface-page px-4 lg:hidden">
          <button
            type="button"
            aria-label={t("nav.open")}
            onClick={() => setNavOpen(true)}
            className="inline-flex size-9 items-center justify-center rounded-control border border-surface-strong bg-surface-page text-body transition-colors hover:bg-surface-subtle"
          >
            <Menu aria-hidden="true" className="size-4" />
          </button>
          <Link
            href="/"
            className="rounded-control text-base font-semibold tracking-tight text-heading"
          >
            TryQash
          </Link>
          <LanguageSwitcher className="ml-auto" />
        </div>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
