"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { buttonClasses } from "@/components/ui/button";
import { useTranslation } from "@/i18n/context";

export interface ActivationRequiredDialogProps {
  open: boolean;
  onClose: () => void;
  activationHref: string;
}

/**
 * One reusable activation prompt for surveys, offerwalls, affiliates, and
 * reward-generating referral actions. It never opens the restricted form or
 * external provider first. Active accounts never render it.
 */
export function ActivationRequiredDialog({
  open,
  onClose,
  activationHref,
}: ActivationRequiredDialogProps) {
  const t = useTranslation();
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="activation-dialog-title"
      aria-describedby="activation-dialog-description"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label={t("activation.continueBrowsing")}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-heading/45"
      />
      <div className="animate-pop-in relative w-full max-w-md rounded-card border border-surface bg-surface-page p-6 shadow-overlay">
        <span className="inline-flex size-10 items-center justify-center rounded-control bg-accent-violet-soft text-accent-violet">
          <LockKeyhole aria-hidden="true" className="size-5" />
        </span>
        <h2
          id="activation-dialog-title"
          className="mt-4 text-lg font-semibold tracking-tight text-heading"
        >
          {t("activation.promptTitle")}
        </h2>
        <p
          id="activation-dialog-description"
          className="mt-2 text-sm leading-relaxed text-muted"
        >
          {t("activation.promptBody")}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={buttonClasses({ variant: "secondary" })}
          >
            {t("activation.continueBrowsing")}
          </button>
          <Link href={activationHref} className={buttonClasses({})}>
            {t("activation.activateAccount")}
          </Link>
        </div>
      </div>
    </div>
  );
}
