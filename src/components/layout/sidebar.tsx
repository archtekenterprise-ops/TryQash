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
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useAccountAccess } from "@/contexts/account-access-context";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { canAccessArea, type PlatformArea } from "@/lib/account-permissions";
import { preserveAccountPreviewParams } from "@/lib/account-preview";
import { signOut } from "@/services/auth.service";

interface NavItem {
  labelKey: TranslationKey;
  icon: LucideIcon;
  area: PlatformArea;
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
 * Intended Referrago navigation. Items whose pages are not implemented yet
 * are rendered as disabled placeholders with a "soon" marker, never as
 * links to non-existent routes.
 */
const NAV_SECTIONS: NavSection[] = [
  {
    labelKey: "sidebar.menu",
    items: [
      { labelKey: "nav.overview", icon: LayoutDashboard, area: "dashboard", href: "/dashboard", implemented: true },
      { labelKey: "nav.surveys", icon: ClipboardList, area: "surveys", href: "/surveys", implemented: true },
      { labelKey: "nav.offerwalls", icon: Package, area: "offerwalls", href: "/offerwalls", implemented: true },
      { labelKey: "nav.affiliates", icon: Link2, area: "affiliates", href: "/affiliate-programmes", implemented: true },
      { labelKey: "nav.referrals", icon: Users, area: "referrals", href: "/referrals", implemented: true },
      { labelKey: "nav.earnings", icon: History, area: "earningsHistory", href: "/earnings-history", implemented: true },
    ],
  },
  {
    labelKey: "sidebar.account",
    items: [
      { labelKey: "nav.profile", icon: UserRound, area: "profile", href: "/account", implemented: true },
      { labelKey: "nav.help", icon: CircleHelp, area: "help", href: "/help", implemented: true },
    ],
  },
];

export interface SidebarProps {
  /** Called when a navigation entry is activated (used to close the mobile drawer). */
  onNavigate?: () => void;
}

/**
 * Narrow grouped sidebar from the visual reference: Referrago mark, small
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
  const searchParams = useSearchParams();
  const accountState = useAccountAccess();
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
          href="/dashboard"
          className="inline-flex rounded-control"
        >
          <Image
            src="/referrago-logo.png"
            alt="Referrago"
            width={690}
            height={160}
            className="h-7 w-auto"
          />
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
                const allowed =
                  !accountState || canAccessArea(accountState, item.area);
                const linked = item.implemented && item.href && allowed;
                const disabledLabel = item.implemented
                  ? t("nav.restricted")
                  : t("nav.soon");
                return (
                  <li key={item.labelKey}>
                    {linked && item.href ? (
                      <Link
                        href={preserveAccountPreviewParams(
                          item.href,
                          searchParams,
                        )}
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
                        title={disabledLabel}
                        className="flex cursor-not-allowed items-center gap-2.5 rounded-control px-2.5 py-1.5 text-sm font-medium text-muted/50"
                      >
                        <Icon aria-hidden="true" className="size-4 shrink-0" />
                        {t(item.labelKey)}
                        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-subtle">
                          {disabledLabel}
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
