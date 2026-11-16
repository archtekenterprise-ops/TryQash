"use client";

import { CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AccountRestriction } from "./account-restriction";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useTranslation } from "@/i18n/context";
import type { AccountAccessState } from "@/types/account";

export function ActivationPage({ state }: { state: AccountAccessState | null }) {
  const t = useTranslation();
  const [activationAttempted, setActivationAttempted] = useState(false);

  const restricted =
    state?.accountStatus === "suspended" || state?.accountStatus === "banned";
  const activationConfirmed =
    state?.accountStatus === "active" &&
    state.activationPaymentStatus === "successful";

  return (
    <AppShell accountState={state}>
      <DashboardTopBar
        title={t("activation.metaTitle")}
        username={null}
        email={null}
        canSignOut={Boolean(state)}
      />
      <Container className="py-8">
        {restricted && state ? (
          <AccountRestriction status={state.accountStatus as "suspended" | "banned"} />
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            <PageHeader
              eyebrow="Referrago"
              title={t("activation.title")}
              description={t("activation.description")}
            />

            <Card>
              <div className="flex items-start gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded-control bg-accent-violet text-white">
                  <CreditCard aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-heading">
                    {t("activation.priceTitle")}
                  </h2>
                  <p className="mt-1 text-2xl font-semibold text-heading">
                    {t("activation.priceAmount")}
                  </p>
                  <p className="mt-0.5 text-sm text-muted">
                    {t("activation.priceOneTime")}
                  </p>
                  {!activationConfirmed ? (
                    <Button
                      className="mt-4"
                      onClick={() => setActivationAttempted(true)}
                    >
                      {t("activation.activateAccount")}
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-base font-semibold text-heading">
                {t("activation.benefitsTitle")}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  "activation.benefitSurveys",
                  "activation.benefitOfferwalls",
                  "activation.benefitAffiliates",
                  "activation.benefitReferrals",
                ].map((key) => (
                  <li key={key} className="flex items-start gap-2.5 text-sm text-body">
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-success"
                    />
                    {t(key as "activation.benefitSurveys")}
                  </li>
                ))}
              </ul>
            </Card>

            {activationAttempted ? (
              <NotificationBanner tone="warning">
                {t("activation.integrationUnavailable")}
              </NotificationBanner>
            ) : null}

            {activationConfirmed ? (
              <NotificationBanner tone="success" title={t("account.activeTitle")}>
                <div className="space-y-4">
                  <p>{t("account.activeBody")}</p>
                  <Link href="/dashboard" className={buttonClasses({ size: "sm" })}>
                    {t("activation.returnDashboard")}
                  </Link>
                </div>
              </NotificationBanner>
            ) : (
              <NotificationBanner tone="info" title={t("activation.title")}>
                {state
                  ? t("account.activationUnknownBody")
                  : t("account.stateUnavailable")}
              </NotificationBanner>
            )}
          </div>
        )}
      </Container>
    </AppShell>
  );
}
