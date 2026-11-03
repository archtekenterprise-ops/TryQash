"use client";

import { ClipboardList, Link2, Package, Rocket, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import type { EarningOpportunity, EarningOpportunityId } from "@/types/dashboard";

interface OpportunitySpec {
  id: EarningOpportunityId;
  icon: LucideIcon;
  /** Full literal Tailwind classes so the build detects every accent. */
  accent: {
    tile: string;
    card: string;
    cta: string;
  };
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  actionKey: TranslationKey;
}

/**
 * Static presentation per opportunity; only status comes from the service.
 * Each source carries a light accent colour (from the design tokens) so the
 * four ways to earn are visually distinct. Cards animate in on load and lift
 * gently on hover.
 */
const OPPORTUNITIES: OpportunitySpec[] = [
  {
    id: "surveys",
    icon: ClipboardList,
    accent: {
      tile: "bg-accent-sky text-white shadow-sm",
      card: "border-accent-sky-border/70 hover:border-accent-sky",
      cta: "bg-accent-sky text-white",
    },
    titleKey: "opp.surveys.title",
    descriptionKey: "opp.surveys.desc",
    actionKey: "opp.surveys.action",
  },
  {
    id: "offerwalls",
    icon: Package,
    accent: {
      tile: "bg-accent-teal text-white shadow-sm",
      card: "border-accent-teal-border/70 hover:border-accent-teal",
      cta: "bg-accent-teal text-white",
    },
    titleKey: "opp.offerwalls.title",
    descriptionKey: "opp.offerwalls.desc",
    actionKey: "opp.offerwalls.action",
  },
  {
    id: "affiliates",
    icon: Link2,
    accent: {
      tile: "bg-accent-violet text-white shadow-sm",
      card: "border-accent-violet-border/70 hover:border-accent-violet",
      cta: "bg-accent-violet text-white",
    },
    titleKey: "opp.affiliates.title",
    descriptionKey: "opp.affiliates.desc",
    actionKey: "opp.affiliates.action",
  },
  {
    id: "referrals",
    icon: Users,
    accent: {
      tile: "bg-accent-rose text-white shadow-sm",
      card: "border-accent-rose-border/70 hover:border-accent-rose",
      cta: "bg-accent-rose text-white",
    },
    titleKey: "opp.referrals.title",
    descriptionKey: "opp.referrals.desc",
    actionKey: "opp.referrals.action",
  },
];

export interface OpportunitiesSectionProps {
  opportunities: EarningOpportunity[];
}

export function OpportunitiesSection({ opportunities }: OpportunitiesSectionProps) {
  const t = useTranslation();
  const statusById = new Map(opportunities.map((o) => [o.id, o.status]));

  return (
    <section aria-labelledby="ways-to-earn">
      <h2
        id="ways-to-earn"
        className="text-base font-semibold tracking-tight text-heading"
      >
        {t("opportunities.title")}
      </h2>

      {opportunities.length === 0 ? (
        <Card className="animate-fade-up mt-4">
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <span className="inline-flex size-10 items-center justify-center rounded-full border border-surface bg-surface-subtle text-muted">
              <Rocket aria-hidden="true" className="size-5" />
            </span>
            <p className="mt-3 text-sm font-medium text-heading">
              {t("opportunities.emptyTitle")}
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              {t("opportunities.emptyBody")}
            </p>
          </div>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OPPORTUNITIES.map((opportunity, index) => {
            if (!statusById.has(opportunity.id)) {
              return null;
            }
            const Icon = opportunity.icon;
            const available = statusById.get(opportunity.id) === "available";
            return (
              <Card
                key={opportunity.id}
                className={`transition-card animate-fade-up flex h-full flex-col p-5 hover:-translate-y-1 hover:shadow-card-lg ${opportunity.accent.card}`}
              >
                <span
                  className={`inline-flex size-10 items-center justify-center rounded-control border ${opportunity.accent.tile}`}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold tracking-tight text-heading">
                  {t(opportunity.titleKey)}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                  {t(opportunity.descriptionKey)}
                </p>
                <div className="mt-4">
                  {available ? (
                    <span
                      className={`button-press inline-flex h-8 items-center rounded-control px-3 text-xs font-semibold ${opportunity.accent.cta}`}
                    >
                      {t(opportunity.actionKey)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        title={t("opp.comingSoon")}
                        className="button-press inline-flex h-8 cursor-not-allowed items-center rounded-control border border-surface-strong bg-surface-page px-3 text-xs font-medium text-body opacity-60"
                      >
                        {t(opportunity.actionKey)}
                      </button>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">
                        {t("opp.comingSoon")}
                      </span>
                    </span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
}
