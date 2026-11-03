"use client";

import {
  ClipboardList,
  CircleHelp,
  History,
  LayoutDashboard,
  Link2,
  LogOut,
  Package,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { signOut } from "@/services/auth.service";

interface NavItem {
  labelKey: TranslationKey;
  icon: LucideIcon;
  /** Present only when the destination is actually implemented. */
  href?: string;
  /** True when the destination exists in the app today. */
  implemented: boolean;
}

interface NavSection {
  labelKey: TranslationKey;
  items: NavItem[];
}

/**
 * Intended TryQash navigation. Items whose pages are not implemented yet
 * are rendered as disabled placeholders with a "soon" marker, never as
 * links to non-existent routes.
 */
const NAV_SECTIONS: NavSection[] = [
  {
    labelKey: "sidebar.menu",
    items: [
      { labelKey: "nav.overview", icon: LayoutDashboard, href: "/dashboard", implemented: true },
      { labelKey: "nav.surveys", icon: ClipboardList, implemented: false },
      { labelKey: "nav.offerwalls", icon: Package, implemented: false },
      { labelKey: "nav.affiliates", icon: Link2, implemented: false },
      { labelKey: "nav.referrals", icon: Users, implemented: false },
      { labelKey: "nav.earnings", icon: History, implemented: false },
    ],
  },
  {
    labelKey: "sidebar.account",
    items: [
      { labelKey: "nav.profile", icon: UserRound, implemented: false },
      { labelKey: "nav.help", icon: CircleHelp, implemented: false },
    ],
  },
];

export interface SidebarProps {
  /** Called when a navigation entry is activated (used to close the mobile drawer). */
  onNavigate?: () => void;
}

/**
 * Narrow grouped sidebar from the visual reference: TryQash mark, small
 * uppercase section labels, line icons beside items, grey active state,
 * and the sign-out action pinned at the bottom.
 *
 * Sign out uses the project's auth service. Until a provider is connected
 * it reports "not configured"; the button is the integration placeholder
 * and shows that state inline instead of failing silently.
 */
export function Sidebar({ onNavigate }: SidebarProps) {
  const t = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutFailed, setSignOutFailed] = useState(false);

  function isActive(href?: string): boolean {
    return Boolean(href) && pathname === href;
  }

  async function handleSignOut() {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    setSignOutFailed(false);
    const result = await signOut();
    setSigningOut(false);
    if (result.ok) {
      router.push("/login");
      router.refresh();
      return;
    }
    // Not configured or the provider rejected it: integration placeholder.
    setSignOutFailed(true);
  }

  return (
    <div className="flex h-full flex-col bg-surface-sidebar">
      <div className="flex h-14 shrink-0 items-center border-b border-surface px-4">
        <Link
          href="/"
          className="rounded-control text-base font-semibold tracking-tight text-heading"
        >
          TryQash
        </Link>
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.labelKey}>
            <p className="px-2.5 pt-5 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
              {t(section.labelKey)}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.labelKey}>
                    {item.implemented && item.href ? (
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? "page" : undefined}
                        className={
                          active
                            ? "flex items-center gap-2.5 rounded-control bg-primary-soft px-2.5 py-1.5 text-sm font-medium text-primary-foreground"
                            : "flex items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface-subtle hover:text-heading"
                        }
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0" />
                        {t(item.labelKey)}
                      </Link>
                    ) : (
                      <span
                        aria-disabled="true"
                        title={t("nav.soon")}
                        className="flex cursor-not-allowed items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm font-medium text-muted/60"
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0" />
                        {t(item.labelKey)}
                        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-subtle">
                          {t("nav.soon")}
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-surface px-3 py-3">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-busy={signingOut || undefined}
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:bg-surface-subtle hover:text-heading disabled:opacity-60"
        >
          {signingOut ? (
            <Spinner className="size-4 border" />
          ) : (
            <LogOut aria-hidden="true" className="size-4 shrink-0" />
          )}
          {t("nav.logout")}
        </button>
        {signOutFailed ? (
          <p className="mt-1.5 px-2.5 text-xs text-subtle">
            {t("nav.logoutUnavailable")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
