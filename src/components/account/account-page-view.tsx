"use client";

import { AccountRestriction } from "./account-restriction";
import { AccountStatusBanner } from "./account-status-banner";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import type { AccountAccessState } from "@/types/account";
import type { UserProfile } from "@/types/dashboard";

const STATUS_LABELS: Record<
  NonNullable<UserProfile["status"]>,
  TranslationKey
> = {
  pending: "account.statusPending",
  active: "account.statusActive",
  suspended: "account.statusSuspended",
  banned: "account.statusBanned",
};

export function AccountPageView({
  state,
  profile,
}: {
  state: AccountAccessState | null;
  profile: UserProfile | null;
}) {
  const t = useTranslation();
  const profileStatus = profile?.status;
  const hasRecognizedProfileStatus =
    profileStatus === "pending" ||
    profileStatus === "active" ||
    profileStatus === "suspended" ||
    profileStatus === "banned";
  const accountStatus =
    state?.accountStatus ??
    (hasRecognizedProfileStatus ? profileStatus : null);

  if (accountStatus === "banned") {
    return (
      <AppShell accountState={state}>
        <DashboardTopBar title={t("accountPage.title")} username={null} email={null} canSignOut={Boolean(state)} />
        <Container><AccountRestriction status="banned" /></Container>
      </AppShell>
    );
  }

  const rows = [
    [t("accountPage.username"), profile?.username],
    [t("accountPage.country"), profile?.country],
    [
      t("accountPage.status"),
      accountStatus ? t(STATUS_LABELS[accountStatus]) : t("account.stateUnavailable"),
    ],
    [
      t("account.activationStatus"),
      state
        ? state.accountStatus === "active" &&
          state.activationPaymentStatus === "successful"
          ? t("account.activationConfirmed")
          : t("account.activationNotConfirmed")
        : t("account.stateUnavailable"),
    ],
    [t("accountPage.referralCode"), profile?.referralCode],
  ];

  return (
    <AppShell accountState={state}>
      <DashboardTopBar title={t("accountPage.title")} username={profile?.username ?? null} email={null} canSignOut={Boolean(state)} />
      <Container className="py-8">
        <div className="space-y-6">
          <PageHeader title={t("accountPage.title")} description={t("accountPage.description")} />
          {state ? (
            <AccountStatusBanner state={state} />
          ) : (
            <p className="text-sm text-muted">{t("account.stateUnavailable")}</p>
          )}
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
