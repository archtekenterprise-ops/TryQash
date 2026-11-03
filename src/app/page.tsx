"use client";

import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { APP_NAME } from "@/i18n/config";
import { useDocumentTitle, useTranslation } from "@/i18n/context";

/* Small local helper for preview sections. */
function Section({
  id,
  title,
  note,
  children,
}: {
  id?: string;
  title: string;
  note: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-label={title}>
      <h2 className="text-base font-semibold tracking-tight text-heading">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted">{note}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-subtle">
      {children}
    </p>
  );
}

/* Neutral placeholder card: labelled skeleton bars, no invented data. */
function PlaceholderCard({
  label,
  reserved,
}: {
  label: string;
  reserved: string;
}) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wider text-subtle">
        {label}
      </p>
      <SkeletonText className="mt-4" />
      <p className="mt-4 text-xs text-subtle">{reserved}</p>
    </Card>
  );
}

const TABLE_ROWS: Array<{
  number: string;
  tone: "success" | "warning" | "error" | "neutral";
  statusKey: "preview.positive" | "preview.attention" | "preview.negative" | "preview.idle";
}> = [
  { number: "01", tone: "success", statusKey: "preview.positive" },
  { number: "02", tone: "warning", statusKey: "preview.attention" },
  { number: "03", tone: "error", statusKey: "preview.negative" },
  { number: "04", tone: "neutral", statusKey: "preview.idle" },
];

/**
 * Design-system preview page. Everything on this page is clearly labelled
 * placeholder material used to verify the shared layout and components
 * against the visual reference - it contains no real TryQash data.
 *
 * This page is purely presentational and holds no server data, so it is a
 * client component: that keeps every string in useTranslation(), which is
 * what makes the language switch instant without a reload or refresh.
 */
export default function HomePage() {
  const t = useTranslation();
  useDocumentTitle(APP_NAME);

  return (
    <AppShell>
      <TopBar
        title={t("preview.topBar")}
        actions={
          <>
            <Button
              size="sm"
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              {t("preview.secondaryAction")}
            </Button>
            <Button size="sm">{t("preview.primaryAction")}</Button>
          </>
        }
      />

      <Container className="py-8 sm:py-10">
        <div id="preview-overview">
          <PageHeader
            eyebrow={t("preview.eyebrow")}
            title={t("preview.title")}
            description={t("preview.description")}
          />
        </div>

        <div className="mt-8 space-y-10">
          <div id="preview-banners">
            <NotificationBanner tone="info" title={t("preview.bannerTitle")}>
              {t("preview.bannerBody")}
            </NotificationBanner>
          </div>

          {/* ---- Cards ---- */}
          <Section
            id="preview-cards"
            title={t("preview.cardsTitle")}
            note={t("preview.cardsNote")}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <PlaceholderCard
                  key={index}
                  label={t("preview.placeholderCard")}
                  reserved={t("preview.reserved")}
                />
              ))}
            </div>
          </Section>

          {/* ---- Buttons and inputs ---- */}
          <Section
            id="preview-forms"
            title={t("preview.formsTitle")}
            note={t("preview.formsNote")}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("preview.buttonsTitle")}</CardTitle>
                  <CardDescription>{t("preview.buttonsNote")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <GroupLabel>{t("preview.variants")}</GroupLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button>{t("preview.primaryAction")}</Button>
                      <Button variant="secondary">
                        {t("preview.secondaryAction")}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <GroupLabel>{t("preview.states")}</GroupLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button loading>{t("preview.processing")}</Button>
                      <Button disabled>{t("preview.primaryDisabled")}</Button>
                      <Button variant="secondary" disabled>
                        {t("preview.secondaryDisabled")}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <GroupLabel>{t("preview.sizes")}</GroupLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm">{t("preview.small")}</Button>
                      <Button size="md">{t("preview.medium")}</Button>
                      <Button size="lg">{t("preview.large")}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("preview.inputsTitle")}</CardTitle>
                  <CardDescription>{t("preview.inputsNote")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <Input
                    label={t("preview.sampleLabel")}
                    placeholder={t("preview.samplePlaceholder")}
                    helperText={t("preview.sampleHelper")}
                  />
                  <Input
                    label={t("preview.invalidSample")}
                    defaultValue={t("preview.sampleValue")}
                    error={t("preview.sampleValidation")}
                  />
                  <Input
                    label={t("preview.disabledSample")}
                    placeholder={t("preview.disabledPlaceholder")}
                    disabled
                  />
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ---- Status indicators ---- */}
          <Section
            id="preview-status"
            title={t("preview.statusTitle")}
            note={t("preview.statusNote")}
          >
            <Card>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone="success">{t("preview.positive")}</StatusBadge>
                <StatusBadge tone="warning">
                  {t("preview.attention")}
                </StatusBadge>
                <StatusBadge tone="error">{t("preview.negative")}</StatusBadge>
                <StatusBadge tone="neutral">{t("preview.neutral")}</StatusBadge>
              </div>
            </Card>
          </Section>

          {/* ---- Notification tones ---- */}
          <Section
            title={t("preview.notificationsTitle")}
            note={t("preview.notificationsNote")}
          >
            <div className="space-y-3">
              <NotificationBanner tone="info" title={t("preview.information")}>
                {t("preview.informationBody")}
              </NotificationBanner>
              <NotificationBanner tone="warning" title={t("preview.warning")}>
                {t("preview.warningBody")}
              </NotificationBanner>
              <NotificationBanner tone="error" title={t("preview.error")}>
                {t("preview.errorBody")}
              </NotificationBanner>
            </div>
          </Section>

          {/* ---- Loading states ---- */}
          <Section
            id="preview-loading"
            title={t("preview.loadingTitle")}
            note={t("preview.loadingNote")}
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("preview.spinnersLabel")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-5 text-heading">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" label={t("preview.loadingExample")} />
                  </div>
                  <div className="space-y-3">
                    <GroupLabel>{t("preview.buttonLoadingLabel")}</GroupLabel>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button loading>{t("preview.saving")}</Button>
                      <Button variant="secondary" loading>
                        {t("preview.processing")}
                      </Button>
                      <Button size="sm" loading>
                        {t("preview.saving")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("preview.skeletonsLabel")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-2.5 w-1/2 rounded-full" />
                      <Skeleton className="h-2.5 w-1/3 rounded-full" />
                    </div>
                  </div>
                  <SkeletonText lines={4} />
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ---- Table ---- */}
          <Section
            id="preview-table"
            title={t("preview.tableTitle")}
            note={t("preview.tableNote")}
          >
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>{t("preview.tableItem")}</TableHeaderCell>
                    <TableHeaderCell>
                      {t("preview.tableStatus")}
                    </TableHeaderCell>
                    <TableHeaderCell>
                      {t("preview.tableNoteColumn")}
                    </TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {TABLE_ROWS.map((row) => (
                    <TableRow key={row.number}>
                      <TableCell className="font-medium text-heading">
                        {t("preview.tableRow", { number: row.number })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge tone={row.tone}>
                          {t(row.statusKey)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-muted">
                        {t("preview.tablePlaceholder")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="border-t border-surface px-4 py-3 text-xs text-subtle">
                {t("preview.tableFooter")}
              </p>
            </Card>
          </Section>

          <p className="text-xs text-subtle">{t("preview.endNote")}</p>
        </div>
      </Container>
    </AppShell>
  );
}
