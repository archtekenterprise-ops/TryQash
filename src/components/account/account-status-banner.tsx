"use client";

import Link from "next/link";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClasses } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";
import type { AccountAccessState } from "@/types/account";

export function AccountStatusBanner({ state }: { state: AccountAccessState }) {
  const t = useTranslation();

  if (
    state.accountStatus === "active" &&
    state.activationPaymentStatus === "successful"
  ) {
    return (
      <NotificationBanner tone="success" title={t("account.activeTitle")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>{t("account.activeBody")}</p>
          <StatusBadge tone="success">
            {t("account.activationConfirmed")}
          </StatusBadge>
        </div>
      </NotificationBanner>
    );
  }

  if (state.accountStatus === "active") {
    return (
      <NotificationBanner
        tone="warning"
        title={t("account.activationUnknownTitle")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p>{t("account.activationUnknownBody")}</p>
          <Link
            href="/activate-account"
            className={buttonClasses({ size: "sm" })}
          >
            {t("activation.activateAccount")}
          </Link>
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
          href="/activate-account"
          className={buttonClasses({ size: "sm" })}
        >
          {t("activation.activateAccount")}
        </Link>
      </div>
    </NotificationBanner>
  );
}
