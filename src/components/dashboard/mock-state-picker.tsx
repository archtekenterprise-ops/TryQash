"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import {
  type DashboardMockState,
  parsePreviewState,
} from "@/services/mocks/dashboard.mock";

const STATE_LABEL_KEYS: Record<DashboardMockState, TranslationKey> = {
  loaded: "dashboard.stateLoaded",
  "new-user": "dashboard.stateNewUser",
  "no-earnings": "dashboard.stateNoEarnings",
  "no-opportunities": "dashboard.stateNoOpportunities",
  "no-referral": "dashboard.stateNoReferrals",
  error: "dashboard.stateError",
};

const STATE_ORDER: DashboardMockState[] = [
  "loaded",
  "new-user",
  "no-earnings",
  "no-opportunities",
  "no-referral",
  "error",
];

/**
 * DEVELOPMENT ONLY - rendered next to the preview banner while the
 * dashboard mock is enabled. Lets you switch the sample state (loaded,
 * new user, missing data, error) from the preview banner by rewriting
 * ?preview=, without editing code. Removed together with the mock module.
 */
export function MockStatePicker() {
  const t = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const active = parsePreviewState(searchParams.get("preview") ?? undefined);

  function choose(state: DashboardMockState) {
    startTransition(() => {
      router.push(state === "loaded" ? "/dashboard" : `/dashboard?preview=${state}`);
    });
  }

  return (
    <div
      className="flex flex-wrap items-center gap-1.5"
      aria-busy={pending || undefined}
    >
      <span className="text-xs font-medium text-subtle">
        {t("dashboard.previewStateLabel")}:
      </span>
      {STATE_ORDER.map((state) => (
        <button
          key={state}
          type="button"
          onClick={() => choose(state)}
          disabled={pending}
          className={`h-7 cursor-pointer rounded-full border px-2.5 text-xs font-medium transition-colors ${
            active === state
              ? "border-primary-strong bg-primary-strong text-primary-on"
              : "border-surface-strong bg-surface-page text-body hover:bg-surface-subtle"
          } disabled:opacity-60`}
        >
          {t(STATE_LABEL_KEYS[state])}
        </button>
      ))}
    </div>
  );
}
