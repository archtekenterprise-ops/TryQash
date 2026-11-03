"use client";

import { ChevronDown, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/i18n/context";
import { initialsFromUsername } from "@/lib/format";
import { signOut } from "@/services/auth.service";

export interface DashboardTopBarProps {
  /** Page title, e.g. "Dashboard". */
  title: string;
  /** Personalized greeting when the username is available. */
  greeting?: string;
  /** Signed-in identity for the avatar/menu: username and/or email. */
  username: string | null;
  email: string | null;
  /** Whether a real session exists and sign-out is wired up. */
  canSignOut: boolean;
}

/**
 * Dashboard top bar: page title, an optional greeting, the language
 * switcher, and a profile menu (avatar trigger) with account settings
 * (placeholder, disabled) and sign-out. The menu closes on outside click
 * or Escape and is keyboard reachable. No notifications are added: none
 * have been specified.
 */
export function DashboardTopBar({
  title,
  greeting,
  username,
  email,
  canSignOut,
}: DashboardTopBarProps) {
  const t = useTranslation();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const initials = username ? initialsFromUsername(username) : null;

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: PointerEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    if (!canSignOut || signingOut) {
      return;
    }
    setSigningOut(true);
    const result = await signOut();
    setSigningOut(false);
    setOpen(false);
    if (result.ok) {
      router.push("/login");
      router.refresh();
    }
  }

  return (
    <div className="flex h-16 items-center justify-between gap-4 border-b border-surface bg-surface-page px-4 sm:px-6 lg:px-8">
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold text-heading">{title}</h2>
        {greeting ? (
          <p className="hidden truncate text-xs text-muted sm:block">
            {greeting}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <LanguageSwitcher />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={t("dashboard.profileMenuLabel")}
            className="flex items-center gap-1.5 rounded-full transition-opacity"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-surface-strong bg-surface-subtle text-xs font-semibold text-heading">
              {initials ?? (
                <UserRound aria-hidden="true" className="size-4" />
              )}
            </span>
            <ChevronDown
              aria-hidden="true"
              className={`size-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open ? (
            <div
              role="menu"
              aria-label={t("dashboard.profileMenuLabel")}
              className="animate-pop-in absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-card border border-surface bg-surface-page py-1 shadow-card-lg"
            >
              {/* Identity line, when known */}
              {username || email ? (
                <div className="border-b border-surface px-3 py-2">
                  {username ? (
                    <p className="truncate text-sm font-medium text-heading">
                      {username}
                    </p>
                  ) : null}
                  {email ? (
                    <p className="truncate text-xs text-muted">{email}</p>
                  ) : null}
                </div>
              ) : null}

              <div className="p-1">
                {/* Account settings: destination not implemented yet. */}
                <button
                  type="button"
                  role="menuitem"
                  disabled
                  aria-disabled="true"
                  title={t("nav.soon")}
                  className="flex w-full cursor-not-allowed items-center justify-between gap-2 rounded-control px-2.5 py-1.5 text-left text-sm text-muted/60"
                >
                  {t("dashboard.profileSettings")}
                  <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                    {t("nav.soon")}
                  </span>
                </button>

                {canSignOut ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-control px-2.5 py-1.5 text-left text-sm text-body transition-colors hover:bg-surface-subtle"
                  >
                    {signingOut ? (
                      <Spinner className="size-3.5 border" />
                    ) : (
                      <LogOut aria-hidden="true" className="size-4 shrink-0" />
                    )}
                    {t("nav.logout")}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    role="menuitem"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center gap-2 rounded-control px-2.5 py-1.5 text-left text-sm text-body transition-colors hover:bg-surface-subtle"
                  >
                    <LogOut aria-hidden="true" className="size-4 shrink-0" />
                    {t("common.signIn")}
                  </Link>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
