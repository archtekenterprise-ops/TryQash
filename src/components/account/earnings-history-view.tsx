"use client";

import { AccountRestriction } from "./account-restriction";
import { AccountStatusBanner } from "./account-status-banner";
import { ActivitySection } from "@/components/dashboard/activity-section";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useTranslation } from "@/i18n/context";
import type { AccountAccessState } from "@/types/account";
import type { EarningActivity } from "@/types/dashboard";

/** Minimal, read-only Earnings History shell. No calculations or backend logic. */
export function EarningsHistoryView({
  state,
  activity,
}: {
  state: AccountAccessState | null;
  activity: EarningActivity[];
}) {
  const t = useTranslation();
  const restricted =
    state?.accountStatus === "suspended" || state?.accountStatus === "banned";
  return (
    <AppShell accountState={state}>
      <DashboardTopBar title={t("earningsHistory.title")} username={null} email={null} canSignOut={Boolean(state)} />
      <Container className="py-8">
        {restricted && state ? (
          <AccountRestriction status={state.accountStatus as "suspended" | "banned"} />
        ) : (
          <div className="space-y-6">
            <PageHeader title={t("earningsHistory.title")} description={t("earningsHistory.description")} />
            {state ? (
              <AccountStatusBanner state={state} />
            ) : (
              <NotificationBanner tone="info">
                {t("account.stateUnavailable")}
              </NotificationBanner>
            )}
            <ActivitySection activity={activity} />
          </div>
        )}
      </Container>
    </AppShell>
  );
}
