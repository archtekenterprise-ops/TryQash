"use client";

import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Link2,
  Package,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/table";
import { useLanguage, useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { formatDate, formatSignedMoney } from "@/lib/format";
import type {
  EarningActivity,
  EarningSource,
  EarningStatus,
} from "@/types/dashboard";

const SOURCE_META: Record<
  EarningSource,
  { labelKey: TranslationKey; icon: LucideIcon; chipClass: string }
> = {
  survey: { labelKey: "activity.sourceSurvey", icon: ClipboardList, chipClass: "bg-accent-sky-soft text-accent-sky" },
  offerwall: { labelKey: "activity.sourceOfferwall", icon: Package, chipClass: "bg-accent-teal-soft text-accent-teal" },
  affiliate: { labelKey: "activity.sourceAffiliate", icon: Link2, chipClass: "bg-accent-violet-soft text-accent-violet" },
  referral: { labelKey: "activity.sourceReferral", icon: Users, chipClass: "bg-accent-rose-soft text-accent-rose" },
};

const STATUS_META: Record<
  EarningStatus,
  { tone: "warning" | "success" | "error"; labelKey: TranslationKey }
> = {
  pending: { tone: "warning", labelKey: "activity.statusPending" },
  approved: { tone: "success", labelKey: "activity.statusApproved" },
  rejected: { tone: "error", labelKey: "activity.statusRejected" },
};

export interface ActivitySectionProps {
  activity: EarningActivity[];
  currency?: string;
}

/**
 * Recent Activity: earning history across surveys, offerwalls, affiliates,
 * and referrals. Status labels (Pending / Approved / Rejected) are display
 * states only; the final approval rules belong to the backend. New users
 * get a clear empty state that invites a first earning activity.
 */
export function ActivitySection({
  activity,
  currency = "USD",
}: ActivitySectionProps) {
  const t = useTranslation();
  const { locale } = useLanguage();

  return (
    <Card className="animate-fade-up p-0">
      <div className="border-b border-surface px-5 py-4">
        <h2 className="text-base font-semibold tracking-tight text-heading">
          {t("activity.title")}
        </h2>
      </div>

      {activity.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-surface bg-surface-subtle text-muted">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          <p className="mt-3 text-sm font-medium text-heading">
            {t("activity.emptyTitle")}
          </p>
          <p className="mt-1 max-w-xs text-sm text-muted">
            {t("activity.emptyBody")}
          </p>
        </div>
      ) : (
        <div>
          {/* Mobile hint: the table scrolls horizontally on small screens. */}
          <p className="px-5 pt-3 text-xs text-subtle sm:hidden">
            {t("activity.scrollHint")}
          </p>
          {/* min-width forces the scroll region to engage on narrow screens. */}
          <Table className="min-w-[560px]">
          <TableHead>
            <TableRow>
              <TableHeaderCell>{t("activity.colDescription")}</TableHeaderCell>
              <TableHeaderCell>{t("activity.colSource")}</TableHeaderCell>
              <TableHeaderCell>{t("activity.colDate")}</TableHeaderCell>
              <TableHeaderCell className="text-right">
                {t("activity.colReward")}
              </TableHeaderCell>
              <TableHeaderCell>{t("activity.colStatus")}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activity.map((item) => {
              const source = SOURCE_META[item.source];
              const status = STATUS_META[item.status];
              const SourceIcon = source.icon;
              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="block font-medium text-heading">
                      {item.description}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <span className={`inline-flex size-6 items-center justify-center rounded-control ${source.chipClass}`}>
                        <SourceIcon aria-hidden="true" className="size-3.5" />
                      </span>
                      {t(source.labelKey)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-muted">
                    {formatDate(item.occurredAt, locale)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right font-medium tabular-nums text-heading">
                    {formatSignedMoney(item.rewardMinor, currency, locale)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={status.tone}>
                      {t(status.labelKey)}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              );
            })}
              </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
