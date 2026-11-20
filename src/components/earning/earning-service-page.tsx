"use client";

import {
  ClipboardList,
  Link2,
  Package,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { AccountRestriction } from "@/components/account/account-restriction";
import { AccountStatusBanner } from "@/components/account/account-status-banner";
import { ParticipationAction } from "@/components/account/participation-action";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import type { AccountAccessState } from "@/types/account";

export type EarningServiceKind =
  | "surveys"
  | "offerwalls"
  | "affiliates"
  | "referrals";

interface ServiceSpec {
  icon: LucideIcon;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  actionKey: TranslationKey;
  stepKeys: [TranslationKey, TranslationKey, TranslationKey];
  accent: string;
}

const SERVICE_SPECS: Record<EarningServiceKind, ServiceSpec> = {
  surveys: {
    icon: ClipboardList,
    titleKey: "service.surveys.title",
    descriptionKey: "service.surveys.description",
    actionKey: "service.surveys.action",
    stepKeys: ["service.surveys.step1", "service.surveys.step2", "service.surveys.step3"],
    accent: "bg-accent-sky text-white",
  },
  offerwalls: {
    icon: Package,
    titleKey: "service.offerwalls.title",
    descriptionKey: "service.offerwalls.description",
    actionKey: "service.offerwalls.action",
    stepKeys: ["service.offerwalls.step1", "service.offerwalls.step2", "service.offerwalls.step3"],
    accent: "bg-accent-teal text-white",
  },
  affiliates: {
    icon: Link2,
    titleKey: "service.affiliates.title",
    descriptionKey: "service.affiliates.description",
    actionKey: "service.affiliates.action",
    stepKeys: ["service.affiliates.step1", "service.affiliates.step2", "service.affiliates.step3"],
    accent: "bg-accent-violet text-white",
  },
  referrals: {
    icon: Users,
    titleKey: "service.referrals.title",
    descriptionKey: "service.referrals.description",
    actionKey: "service.referrals.action",
    stepKeys: ["service.referrals.step1", "service.referrals.step2", "service.referrals.step3"],
    accent: "bg-accent-rose text-white",
  },
};

export function EarningServicePage({
  kind,
  accountState,
}: {
  kind: EarningServiceKind;
  accountState: AccountAccessState;
}) {
  const t = useTranslation();
  const searchParams = useSearchParams();
  const directAction = searchParams.get("action") === "participate";
  const [activeUnavailable, setActiveUnavailable] = useState(
    () => directAction && accountState.accountStatus === "active",
  );
  const spec = SERVICE_SPECS[kind];
  const Icon = spec.icon;
  const activeAction = useCallback(() => setActiveUnavailable(true), []);

  const restricted =
    accountState.accountStatus === "suspended" ||
    accountState.accountStatus === "banned";

  return (
    <AppShell accountState={accountState}>
      <DashboardTopBar
        title={t(spec.titleKey)}
        username={null}
        email={null}
        canSignOut={true}
      />
      <Container className="py-8">
        {restricted ? (
          <AccountRestriction status={accountState.accountStatus as "suspended" | "banned"} />
        ) : (
          <div className="space-y-6">
            <AccountStatusBanner state={accountState} />

            <PageHeader
              eyebrow="Referrago"
              title={t(spec.titleKey)}
              description={t(spec.descriptionKey)}
            />

            <NotificationBanner tone="info">
              {t("service.previewNotice")}
            </NotificationBanner>

            <div className="grid gap-4 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <div className="flex items-start gap-4">
                  <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-control shadow-sm ${spec.accent}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-heading">
                      {t("service.howItWorks")}
                    </h2>
                    <ol className="mt-4 space-y-3">
                      {spec.stepKeys.map((key, index) => (
                        <li key={key} className="flex items-start gap-3 text-sm text-body">
                          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary-foreground">
                            {index + 1}
                          </span>
                          {t(key)}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </Card>

              <Card className="lg:col-span-2">
                <h2 className="text-base font-semibold text-heading">
                  {t("service.opportunities")}
                </h2>
                <div className="mt-5 text-center">
                  <p className="text-sm font-medium text-heading">
                    {t("service.noneTitle")}
                  </p>
                  <p className="mt-1 text-sm text-muted">{t("service.noneBody")}</p>
                  <div className="mt-5">
                    <ParticipationAction
                      label={t(spec.actionKey)}
                      onActiveAction={activeAction}
                      directAction={searchParams.get("action") === "participate"}
                    />
                  </div>
                  <p className="mt-3 text-xs text-subtle">
                    {t(
                      accountState.accountStatus === "active"
                        ? "service.actionActiveHint"
                        : "service.actionPendingHint",
                    )}
                  </p>
                </div>
              </Card>
            </div>

            {activeUnavailable ? (
              <NotificationBanner tone="info">
                {t("service.activeUnavailable")}
              </NotificationBanner>
            ) : null}
          </div>
        )}
      </Container>
    </AppShell>
  );
}
