"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAccountAccess } from "@/contexts/account-access-context";
import { useTranslation } from "@/i18n/context";
import { getParticipationOutcome } from "@/lib/account-permissions";
import { preserveAccountPreviewParams } from "@/lib/account-preview";
import { ActivationRequiredDialog } from "./activation-required-dialog";

export interface ParticipationActionProps {
  label: string;
  /** Called for an Active user. Provider integration can be connected here. */
  onActiveAction: () => void;
  /** Direct action URLs use ?action=participate to open the gate. */
  directAction?: boolean;
}

/**
 * Central participation gate. Pending -> activation prompt. Active -> action.
 * Suspended/banned pages never render this (AccountRestriction is shown).
 */
export function ParticipationAction({
  label,
  onActiveAction,
  directAction = false,
}: ParticipationActionProps) {
  const t = useTranslation();
  const state = useAccountAccess();
  const searchParams = useSearchParams();
  const [promptOpen, setPromptOpen] = useState(
    () => Boolean(directAction && state && getParticipationOutcome(state) === "activation-required"),
  );

  function participate() {
    if (!state) return;
    const outcome = getParticipationOutcome(state);
    if (outcome === "allowed") onActiveAction();
    else if (outcome === "activation-required") setPromptOpen(true);
  }

  return (
    <>
      <Button type="button" onClick={participate} disabled={!state}>
        {label}
      </Button>
      <ActivationRequiredDialog
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
        activationHref={preserveAccountPreviewParams(
          "/activate-account",
          searchParams,
        )}
      />
      {!state ? (
        <p className="mt-2 text-xs text-subtle">{t("account.stateUnavailable")}</p>
      ) : null}
    </>
  );
}
