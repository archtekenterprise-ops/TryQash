"use client";

import { Check, Copy, Info, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { buttonClasses } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";
import type { ReferralInfo } from "@/types/dashboard";

export interface ReferralCardProps {
  /** null = referral information is unavailable (show placeholder). */
  referrals: ReferralInfo | null;
}

/**
 * Compact referral summary. Shows the user's referral code with copy,
 * a small activity area, and a link to the referral section.
 *
 * The plan's three-level referral system is not confirmed, so this card
 * carries no rates, payouts, or level math, and stays adaptable to the
 * final referral rules. When referral info is missing it renders a neutral
 * placeholder instead of an unusable code.
 */
export function ReferralCard({ referrals }: ReferralCardProps) {
  const t = useTranslation();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  async function handleCopy(code: string) {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <Card className="transition-card animate-fade-up hover:-translate-y-1 hover:border-accent-rose hover:shadow-card-lg">
      <div className="flex items-start gap-4">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-control bg-accent-rose text-white shadow-sm">
          <Share2 aria-hidden="true" className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold tracking-tight text-heading">
              {t("referral.title")}
            </h2>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-subtle">
              <Info aria-hidden="true" className="size-3" />
              {t("referral.viewFullSoon")}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {t("referral.desc")}
          </p>
        </div>
      </div>

      {!referrals || !referrals.code ? (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">
            {t("referral.codeLabel")}
          </p>
          <p className="mt-2 rounded-control border border-dashed border-surface-strong bg-surface-subtle px-3 py-2 text-center text-sm text-subtle">
            {t("referral.codeUnavailable")}
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wider text-subtle">
            {t("referral.codeLabel")}
          </p>
          <div className="mt-2 flex items-stretch gap-2">
            <code className="flex h-9 min-w-0 flex-1 items-center justify-center rounded-control border border-accent-rose-border bg-accent-rose-soft/70 px-3 font-mono text-sm tracking-wide text-accent-rose-foreground">
              {referrals.code}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(referrals.code as string)}
              className={buttonClasses({ size: "sm" }) + " button-press gap-1.5"}
            >
              {copied ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Copy aria-hidden="true" className="size-4" />
              )}
              {copied ? t("referral.copied") : t("referral.copy")}
            </button>
          </div>
          {copyError ? (
            <p className="mt-2 text-xs text-error-foreground">
              {t("referral.copyFailed")}
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-control border border-accent-rose-border/70 bg-accent-rose-soft/60 p-3 text-center">
              <p className="text-lg font-semibold tabular-nums text-accent-rose-foreground">
                {referrals.friendsJoined}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t("referral.friendsJoined")}
              </p>
            </div>
            <div className="rounded-control border border-accent-rose-border/70 bg-accent-rose-soft/60 p-3 text-center">
              <p className="text-lg font-semibold tabular-nums text-accent-rose-foreground">
                {referrals.rewardsPending}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                {t("referral.rewardsPending")}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
