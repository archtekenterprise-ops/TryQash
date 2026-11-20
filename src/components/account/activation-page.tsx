"use client";

import { CheckCircle2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { AccountRestriction } from "./account-restriction";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useLanguage, useTranslation } from "@/i18n/context";
import { formatMoney } from "@/lib/format";
import { preserveAccountPreviewParams } from "@/lib/account-preview";
import {
  checkActivationPaymentStatus,
  initiateActivationPayment,
} from "@/services/activation.service";
import { refreshAccountAccessState } from "@/services/account.service";
import type { AccountAccessState, ActivationPaymentStatus } from "@/types/account";

const PAYMENT_STATES: ActivationPaymentStatus[] = [
  "not_started",
  "pending",
  "failed",
  "cancelled",
  "successful",
];

function PreviewControls() {
  const t = useTranslation();
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-subtle">{t("activation.previewTitle")}:</span>
      {PAYMENT_STATES.map((payment) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("payment", payment);
        if (payment !== "successful") params.set("account", "pending");
        return (
          <Link
            key={payment}
            href={`/activate-account?${params.toString()}`}
            className="rounded-full border border-surface-strong px-2 py-1 text-xs text-muted hover:bg-surface-subtle"
          >
            {payment.replace("_", " ")}
          </Link>
        );
      })}
      <Link
        href="/activate-account?payment=successful&account=active"
        className="rounded-full border border-success-soft-border bg-success-soft px-2 py-1 text-xs text-success-foreground"
      >
        active confirmed
      </Link>
    </div>
  );
}

export function ActivationPage({ state }: { state: AccountAccessState }) {
  const t = useTranslation();
  const { locale } = useLanguage();
  const searchParams = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [integrationError, setIntegrationError] = useState(false);

  const restricted =
    state.accountStatus === "suspended" || state.accountStatus === "banned";

  async function startPayment() {
    setBusy(true);
    setIntegrationError(false);
    const result = await initiateActivationPayment();
    setBusy(false);
    if (!result.ok) setIntegrationError(true);
    else if (result.data.redirectUrl) window.location.assign(result.data.redirectUrl);
  }

  async function refreshStatus() {
    setBusy(true);
    setIntegrationError(false);
    const payment = await checkActivationPaymentStatus();
    const account = await refreshAccountAccessState();
    setBusy(false);
    if (!payment.ok || !account.ok) setIntegrationError(true);
    // Only backend-returned accountStatus="active" may unlock the app.
  }

  const dashboardHref = preserveAccountPreviewParams("/dashboard", searchParams);
  const payment = state.activationPaymentStatus;
  const backendConfirmedActive =
    payment === "successful" && state.accountStatus === "active";

  return (
    <AppShell accountState={state}>
      <DashboardTopBar
        title={t("activation.metaTitle")}
        username={null}
        email={null}
        canSignOut={true}
      />
      <Container className="py-8">
        {restricted ? (
          <AccountRestriction status={state.accountStatus as "suspended" | "banned"} />
        ) : (
          <div className="mx-auto max-w-2xl space-y-6">
            <PageHeader
              eyebrow="Referrago"
              title={t("activation.title")}
              description={t("activation.description")}
            />

            <NotificationBanner tone="info">
              <PreviewControls />
            </NotificationBanner>

            <Card>
              <div className="flex items-start gap-4">
                <span className="inline-flex size-10 items-center justify-center rounded-control bg-accent-violet text-white">
                  <CreditCard aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-heading">
                    {t("activation.priceTitle")}
                  </h2>
                  {state.activationPrice ? (
                    <>
                      <p className="mt-1 text-2xl font-semibold text-heading">
                        {formatMoney(
                          state.activationPrice.amountMinor,
                          state.activationPrice.currency,
                          locale,
                        )}
                      </p>
                      <p className="mt-0.5 text-sm text-muted">
                        {t("activation.priceOneTime")}
                      </p>
                    </>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {t("activation.priceUnavailable")}
                    </p>
                  )}
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

            {integrationError ? (
              <NotificationBanner tone="warning">
                {t("activation.integrationUnavailable")}
              </NotificationBanner>
            ) : null}

            {backendConfirmedActive ? (
              <NotificationBanner tone="success" title={t("activation.successTitle")}>
                <div className="space-y-4">
                  <p>{t("activation.successBody")}</p>
                  <Link href={dashboardHref} className={buttonClasses({ size: "sm" })}>
                    {t("activation.returnDashboard")}
                  </Link>
                </div>
              </NotificationBanner>
            ) : payment === "pending" ? (
              <NotificationBanner tone="info" title={t("activation.pendingTitle")}>
                <div className="space-y-4">
                  <p>{t("activation.pendingBody")}</p>
                  <Button size="sm" loading={busy} onClick={refreshStatus}>
                    {t("activation.checkStatus")}
                  </Button>
                </div>
              </NotificationBanner>
            ) : payment === "failed" || payment === "cancelled" ? (
              <NotificationBanner
                tone={payment === "failed" ? "error" : "warning"}
                title={t(
                  payment === "failed"
                    ? "activation.failedTitle"
                    : "activation.cancelledTitle",
                )}
              >
                <div className="space-y-4">
                  <p>
                    {t(
                      payment === "failed"
                        ? "activation.failedBody"
                        : "activation.cancelledBody",
                    )}
                  </p>
                  <Button
                    size="sm"
                    loading={busy}
                    disabled={!state.activationPrice}
                    onClick={startPayment}
                  >
                    {t("activation.retryPayment")}
                  </Button>
                </div>
              </NotificationBanner>
            ) : payment === "successful" ? (
              <NotificationBanner
                tone="warning"
                title={t("activation.paymentOnlyTitle")}
              >
                <div className="space-y-4">
                  <p>{t("activation.paymentOnlyBody")}</p>
                  <Button size="sm" loading={busy} onClick={refreshStatus}>
                    {t("activation.refreshAccount")}
                  </Button>
                </div>
              </NotificationBanner>
            ) : (
              <NotificationBanner
                tone="info"
                title={t("activation.notStartedTitle")}
              >
                <div className="space-y-4">
                  <p>{t("activation.notStartedBody")}</p>
                  <Button
                    loading={busy}
                    disabled={!state.activationPrice}
                    onClick={startPayment}
                  >
                    {t("activation.startPayment")}
                  </Button>
                </div>
              </NotificationBanner>
            )}
          </div>
        )}
      </Container>
    </AppShell>
  );
}
