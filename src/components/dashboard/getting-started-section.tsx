"use client";

import {
  ClipboardCheck,
  Compass,
  LineChart,
  Megaphone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";

interface StepSpec {
  stepKey: TranslationKey;
  icon: LucideIcon;
  /** Full literal Tailwind classes so the build detects every accent. */
  iconTile: string;
  card: string;
}

const STEPS: StepSpec[] = [
  {
    stepKey: "gettingStarted.step1",
    icon: Compass,
    iconTile: "bg-accent-sky",
    card: "hover:border-accent-sky-border",
  },
  {
    stepKey: "gettingStarted.step2",
    icon: ClipboardCheck,
    iconTile: "bg-accent-teal",
    card: "hover:border-accent-teal-border",
  },
  {
    stepKey: "gettingStarted.step3",
    icon: LineChart,
    iconTile: "bg-accent-violet",
    card: "hover:border-accent-violet-border",
  },
  {
    stepKey: "gettingStarted.step4",
    icon: Megaphone,
    iconTile: "bg-accent-rose",
    card: "hover:border-accent-rose-border",
  },
];

/**
 * Compact onboarding for new users. On mobile the steps stack vertically in
 * readable rows; from small screens up they form two columns; on desktop
 * four columns. Each step carries a vivid accent-chip icon and number, with
 * a soft hover lift. Reduced-motion users get the content without the
 * entrance animation.
 */
export function GettingStartedSection() {
  const t = useTranslation();

  return (
    <section aria-labelledby="getting-started">
      <h2
        id="getting-started"
        className="text-base font-semibold tracking-tight text-heading"
      >
        {t("gettingStarted.title")}
      </h2>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          return (
            <Card
              key={step.stepKey}
              className={`transition-card animate-fade-up relative flex items-start gap-3 p-4 hover:-translate-y-1 hover:shadow-card-lg ${step.card}`}
            >
              <span
                className={`inline-flex size-8 shrink-0 items-center justify-center rounded-control text-white shadow-sm ${step.iconTile}`}
              >
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">
                  {index + 1}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-body">
                  {t(step.stepKey)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
