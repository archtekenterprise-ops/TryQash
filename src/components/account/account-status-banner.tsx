"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";
import { preserveAccountPreviewParams } from "@/lib/account-preview";
import type { AccountAccessState } from "@/types/account";

export function AccountStatusBanner({ state }: { state: AccountAccessState }) {
  const t = useTranslation();
  const searchParams = useSearchParams();

  if (state.accountStatus === "active") {
    return (
      <NotificationBanner tone="success" title={t("account.activeTitle")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>{t("account.activeBody")}</p>
          <StatusBadge tone="success">{t("account.statusActive")}</StatusBadge>
        </div>
      </NotificationBanner>
    );
  }

  if (state.accountStatus !== "pending") return null;

  return (
    <NotificationBanner tone="warning" title={t("account.pendingTitle")}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p>{t("account.pendingBody")}</p>
          <StatusBadge tone="warning">{t("account.statusPending")}</StatusBadge>
        </div>
        <Link
          href={preserveAccountPreviewParams("/activate-account", searchParams)}
          className={buttonClasses({ size: "sm" })}
        >
          {t("activation.activateAccount")}
        </Link>
      </div>
    </NotificationBanner>
  );
}
