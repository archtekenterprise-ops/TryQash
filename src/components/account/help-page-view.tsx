"use client";

import { CircleHelp } from "lucide-react";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";
import type { AccountAccessState } from "@/types/account";

export function HelpPageView({ state }: { state: AccountAccessState | null }) {
  const t = useTranslation();
  return (
    <AppShell accountState={state}>
      <DashboardTopBar title={t("help.title")} username={null} email={null} canSignOut={Boolean(state)} />
      <Container className="py-8">
        <PageHeader title={t("help.title")} description={t("help.description")} />
        <Card className="mt-6 flex items-start gap-4">
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-control bg-accent-sky-soft text-accent-sky">
            <CircleHelp aria-hidden="true" className="size-5" />
          </span>
          <p className="text-sm leading-relaxed text-muted">{t("help.body")}</p>
        </Card>
      </Container>
    </AppShell>
  );
}
