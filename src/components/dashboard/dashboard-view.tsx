"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { buttonClasses } from "@/components/ui/button";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { MockStatePicker } from "@/components/dashboard/mock-state-picker";
import { ActivitySection } from "@/components/dashboard/activity-section";
import { EarningsCards } from "@/components/dashboard/earnings-cards";
import { GettingStartedSection } from "@/components/dashboard/getting-started-section";
import { OpportunitiesSection } from "@/components/dashboard/opportunities-section";
import { ReferralCard } from "@/components/dashboard/referral-card";
import { formatTitle } from "@/i18n/config";
import { useDocumentTitle, useTranslation } from "@/i18n/context";
import { DASHBOARD_MOCK_ENABLED } from "@/services/mocks/dashboard.mock";
import type { DashboardDataResult } from "@/types/dashboard";

export interface DashboardViewProps {
  /** Result of the server-side data load from the dashboard service. */
  result: DashboardDataResult;
  /** Whether a Supabase project is configured (auth availability). */
  configured: boolean;
  /** Signed-in user's session email when one exists, else null. */
  email: string | null;
}

/** The three result states looked after individually for readability. */
function DashboardContent({
  result,
  email,
}: {
  result: DashboardDataResult;
  email: string | null;
}) {
  const t = useTranslation();
  const router = useRouter();

  if (result.status === "not-connected") {
    return (
      <NotificationBanner tone="info" title={t("dashboard.notConnectedTitle")}>
        {t("dashboard.notConnectedBody")}
      </NotificationBanner>
    );
  }

  if (result.status === "error") {
    return (
      <div className="space-y-4">
        <NotificationBanner tone="error" title={t("dashboard.errorTitle")}>
          {t("dashboard.errorBody")}
        </NotificationBanner>
        <button
          type="button"
          onClick={() => router.refresh()}
          className={buttonClasses({ variant: "secondary", size: "sm" })}
        >
          {t("dashboard.retry")}
        </button>
      </div>
    );
  }

  const { profile, earnings, opportunities, activity, referrals } = result.data;
  const displayName = profile?.username ?? email;
  const greeting = displayName
    ? t("dashboard.greeting", { name: displayName })
    : t("dashboard.greetingFallback");

  return (
    <div className="space-y-8">
      {/* B. Welcome section: personalized greeting + explore action. */}
      <div className="animate-fade-up relative overflow-hidden rounded-card border border-surface bg-surface-card">
        {/* Accents bar: the four earning sources. */}
        <div
          aria-hidden="true"
          className="h-1.5 w-full bg-[linear-gradient(90deg,var(--color-accent-sky),var(--color-accent-teal),var(--color-accent-violet),var(--color-accent-rose))]"
        />
        <div className="bg-gradient-to-br from-surface-card to-accent-sky-soft/40 p-5 sm:p-6">
          <PageHeader
            eyebrow={greeting}
            title={t("dashboard.title")}
            description={t("dashboard.welcomeMessage")}
            actions={
              opportunities.length > 0 ? (
                <a
                  href="#ways-to-earn"
                  className={buttonClasses({ size: "md" }) + " button-press"}
                >
                  {t("dashboard.exploreOpportunities")}
                </a>
              ) : undefined
            }
          />
        </div>
      </div>

      {/* C. Earnings overview. */}
      <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
        <EarningsCards earnings={earnings} />
      </div>

      {/* D. Ways to Earn, the main focus. */}
      <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
        <OpportunitiesSection opportunities={opportunities} />
      </div>

      <div className="animate-fade-up grid gap-6 lg:grid-cols-5" style={{ animationDelay: "240ms" }}>
        <div className="min-w-0 lg:col-span-3">
          {/* E. Recent earning activity. */}
          <ActivitySection
            activity={activity}
            currency={earnings?.currency ?? "USD"}
          />
        </div>
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* F. Referral summary. */}
          <ReferralCard referrals={referrals} />
        </div>
      </div>

      {/* G. Getting started (full width beneath, responsive grid). */}
      <GettingStartedSection />
    </div>
  );
}

/**
 * Full client presentation for /dashboard, an online earning platform.
 *
 * The server page performs the session check and the data load; this view
 * renders everything through useTranslation() so the language switch stays
 * instant with no reload. It composes the persistent sidebar shell, the top
 * bar (title, greeting, profile menu), the preview banner shown while the
 * mock is enabled, and the main content states. It never fabricates
 * earnings or activity, and money-transfer concepts are absent by design.
 */
export function DashboardView({
  result,
  configured,
  email,
}: DashboardViewProps) {
  const t = useTranslation();
  useDocumentTitle(formatTitle(t("dashboard.metaTitle")));

  const signedIn = configured && email !== null;
  const profile = result.status === "ok" ? result.data.profile : null;
  const displayName = profile?.username ?? email;
  const greeting =
    result.status === "ok" && displayName
      ? t("dashboard.greeting", { name: displayName })
      : undefined;

  return (
    <AppShell>
      <DashboardTopBar
        title={t("dashboard.title")}
        greeting={greeting}
        username={displayName}
        email={email}
        canSignOut={signedIn}
      />

      <Container className="py-8">
        {/* Note while no auth provider is wired yet. */}
        {!configured ? (
          <div className="mb-6">
            <NotificationBanner
              tone="warning"
              title={t("dashboard.notConfiguredTitle")}
            >
              {t("dashboard.notConfiguredBody")}
            </NotificationBanner>
          </div>
        ) : null}

        {/* Mock-data preview banner (visible while the mock is on). */}
        {DASHBOARD_MOCK_ENABLED && result.status !== "not-connected" ? (
          <div className="mb-6">
            <NotificationBanner
              tone="info"
              title={t("dashboard.previewBannerTitle")}
            >
              <div className="space-y-3">
                <p>{t("dashboard.previewBannerBody")}</p>
                <MockStatePicker />
              </div>
            </NotificationBanner>
          </div>
        ) : null}

        <DashboardContent result={result} email={email} />
      </Container>
    </AppShell>
  );
}
