"use client";

import { Banknote, Clock4, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage, useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { formatMoney } from "@/lib/format";
import type { EarningsSummary } from "@/types/dashboard";

interface EarningsCardSpec {
  labelKey: TranslationKey;
  icon: LucideIcon;
  /** Full literal Tailwind classes so the build detects every accent. */
  tile: string;
  card: string;
  /** Colour used for the figure text. */
  amountClass: string;
  value: (summary: EarningsSummary) => number;
}

const CARDS: EarningsCardSpec[] = [
  {
    labelKey: "earnings.totalEarned",
    icon: TrendingUp,
    tile: "bg-accent-teal text-white shadow-sm",
    card: "border-accent-teal-border/70 hover:border-accent-teal",
    amountClass: "text-accent-teal-foreground",
    value: (s) => s.totalEarnedMinor,
  },
  {
    labelKey: "earnings.available",
    icon: Banknote,
    tile: "bg-accent-sky text-white shadow-sm",
    card: "border-accent-sky-border/70 hover:border-accent-sky",
    amountClass: "text-accent-sky-foreground",
    value: (s) => s.availableEarnedMinor,
  },
  {
    labelKey: "earnings.pending",
    icon: Clock4,
    tile: "bg-warning text-white shadow-sm",
    card: "border-warning-soft-border hover:border-warning",
    amountClass: "text-warning-foreground",
    value: (s) => s.pendingEarnedMinor,
  },
];

export interface EarningsCardsProps {
  /** null = earnings data is missing or unavailable; show neutral state. */
  earnings: EarningsSummary | null;
}

/**
 * Earnings overview: Total Earned, Available Earnings, Pending Earnings.
 * Values come in minor units and are formatted in the active locale. Each
 * card carries a soft accent tint and lifts gently on hover. When the
 * summary is null the cards render a neutral "not available" state and
 * never invent figures. Points Balance is intentionally omitted (unconfirmed).
 */
export function EarningsCards({ earnings }: EarningsCardsProps) {
  const t = useTranslation();
  const { locale } = useLanguage();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {CARDS.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={card.labelKey}
            className={`transition-card animate-fade-up flex items-start gap-4 p-5 hover:-translate-y-1 hover:shadow-card-lg ${card.card}`}
          >
            <span
              className={`inline-flex size-9 shrink-0 items-center justify-center rounded-control border ${card.tile}`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-subtle">
                {t(card.labelKey)}
              </p>
              {earnings ? (
                <p className={`mt-1.5 truncate text-xl font-semibold tabular-nums tracking-tight ${card.amountClass}`}>
                  {formatMoney(card.value(earnings), earnings.currency, locale)}
                </p>
              ) : (
                <p className="mt-1.5 text-xl font-semibold tracking-tight text-subtle">
                  <span aria-hidden="true">--</span>
                  <span className="sr-only">{t("earnings.notAvailable")}</span>
                </p>
              )}
              {earnings ? null : (
                <p className="mt-1 text-xs text-subtle">
                  {t("earnings.notAvailableHelper")}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
