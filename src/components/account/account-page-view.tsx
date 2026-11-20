"use client";

import { AccountRestriction } from "./account-restriction";
import { AccountStatusBanner } from "./account-status-banner";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";
import type { AccountAccessState } from "@/types/account";
import type { UserProfile } from "@/types/dashboard";

export function AccountPageView({ state, profile }: { state: AccountAccessState; profile: UserProfile | null }) {
  const t = useTranslation();
  if (state.accountStatus === "banned") {
    return (
      <AppShell accountState={state}>
        <DashboardTopBar title={t("accountPage.title")} username={null} email={null} canSignOut={true} />
        <Container><AccountRestriction status="banned" /></Container>
      </AppShell>
    );
  }

  const rows = [
    [t("accountPage.username"), profile?.username],
    [t("accountPage.country"), profile?.country],
    [t("accountPage.status"), t(`account.status${state.accountStatus[0].toUpperCase()}${state.accountStatus.slice(1)}` as "account.statusPending")],
    [t("accountPage.referralCode"), profile?.referralCode],
  ];

  return (
    <AppShell accountState={state}>
      <DashboardTopBar title={t("accountPage.title")} username={profile?.username ?? null} email={null} canSignOut={true} />
      <Container className="py-8">
        <div className="space-y-6">
          <PageHeader title={t("accountPage.title")} description={t("accountPage.description")} />
          <AccountStatusBanner state={state} />
          <Card>
            <dl className="divide-y divide-surface">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="text-sm text-muted">{label}</dt>
                  <dd className="text-sm font-medium text-heading">{value || t("accountPage.missing")}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <p className="text-xs text-subtle">{t("accountPage.editingSoon")}</p>
        </div>
      </Container>
    </AppShell>
  );
}
