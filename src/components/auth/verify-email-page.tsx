"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { AuthPageShell } from "./auth-page-shell";
import { Button, buttonClasses } from "@/components/ui/button";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { OtpInput } from "@/components/ui/otp-input";
import { Spinner } from "@/components/ui/spinner";
import { formatTitle, type Locale, LOCALES } from "@/i18n/config";
import { useDocumentTitle, useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { createEmptyOtp, isOtpComplete, OTP_LENGTH, otpToString } from "@/lib/otp";
import { isValidEmail } from "@/lib/validation";
import {
  resendVerificationCode,
  verifyEmailCode,
} from "@/services/email-verification.service";
import type { VerificationErrorCode } from "@/services/email-verification.service";

/**
 * Frontend cooldown for the resend action, in seconds. The backend may
 * enforce its own rate limit on top of this (surfaced as RATE_LIMITED).
 * Adjust once the backend resend rules are confirmed.
 */
const RESEND_COOLDOWN_SECONDS = 60;

type PageState = "form" | "success" | "expired";

const ERROR_MESSAGE_KEYS: Record<VerificationErrorCode, TranslationKey> = {
  NOT_CONNECTED: "verifyEmail.errorNotConnected",
  INVALID_CODE: "verifyEmail.errorInvalidCode",
  EXPIRED_CODE: "verifyEmail.expiredTitle",
  RATE_LIMITED: "verifyEmail.errorRateLimited",
  UNKNOWN: "verifyEmail.errorUnknown",
};

/**
 * Email verification page (/verify-email).
 *
 * The user arrives here after registering. The email address is read from
 * the ?email= query parameter passed by the registration flow; when it is
 * missing (direct visit), the page still works and simply shows the
 * generic description.
 *
 * States:
 * - form: six-digit input, verify button, resend action with countdown.
 * - success: verified, continue to sign in (never the dashboard).
 * - expired: the code expired, offer to request a new one.
 *
 * All verification operations go through the email verification service;
 * this component contains no transport logic.
 */
export function VerifyEmailPage() {
  const t = useTranslation();
  const searchParams = useSearchParams();

  // Only trust a well-formed, sensibly sized address from the query string.
  const rawEmail = searchParams.get("email")?.trim() ?? "";
  const email = rawEmail.length <= 254 && isValidEmail(rawEmail) ? rawEmail : null;

  const [digits, setDigits] = useState<string[]>(() => createEmptyOtp());
  const [codeError, setCodeError] = useState<string | null>(null);
  const [formError, setFormError] = useState<VerificationErrorCode | null>(null);
  const [pageState, setPageState] = useState<PageState>("form");
  const [verifying, setVerifying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useDocumentTitle(formatTitle(t("verifyEmail.metaTitle")));

  // Resend countdown: one tick per second, cleaned up on unmount.
  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }
    const id = setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  function resetCodeFeedback() {
    setCodeError(null);
    setFormError(null);
    setResent(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (verifying || pageState !== "form") {
      return;
    }
    setFormError(null);

    if (!isOtpComplete(digits)) {
      setCodeError(t("verifyEmail.codeIncomplete"));
      return;
    }

    setVerifying(true);
    const result = await verifyEmailCode({
      email: email ?? "",
      code: otpToString(digits),
    });
    setVerifying(false);

    if (result.ok) {
      setPageState("success");
      return;
    }
    if (result.error.code === "EXPIRED_CODE") {
      setPageState("expired");
      return;
    }
    setFormError(result.error.code);
  }

  async function handleResend() {
    if (secondsLeft > 0 || resending || pageState === "success") {
      return;
    }
    setResending(true);
    setFormError(null);

    const result = await resendVerificationCode({ email: email ?? "" });
    setResending(false);

    if (!result.ok) {
      setFormError(result.error.code);
      return;
    }

    // A fresh code invalidates whatever was on screen.
    setDigits(createEmptyOtp());
    resetCodeFeedback();
    setResent(true);
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
    setPageState("form");
  }

  return (
    <AuthPageShell
      title={t("verifyEmail.title")}
      description={t("verifyEmail.description")}
      footer={
        <>
          {t("verifyEmail.wrongEmail")}{" "}
          <Link
            href="/register"
            className="rounded-control font-medium text-heading hover:underline underline-offset-4"
          >
            {t("verifyEmail.registerAgain")}
          </Link>
        </>
      }
    >
      {email ? (
        <p className="mb-5 break-all rounded-control border border-surface bg-surface-subtle px-3 py-2 text-center text-sm font-medium text-heading">
          {email}
        </p>
      ) : null}

      {pageState === "success" ? (
        <div className="space-y-5">
          <NotificationBanner tone="success" title={t("verifyEmail.successTitle")}>
            {t("verifyEmail.successBody")}
          </NotificationBanner>
          <Link href="/login" className={buttonClasses({}) + " w-full"}>
            {t("verifyEmail.continueToSignIn")}
          </Link>
        </div>
      ) : pageState === "expired" ? (
        <div className="space-y-5">
          <NotificationBanner tone="error" title={t("verifyEmail.expiredTitle")}>
            {t("verifyEmail.expiredBody")}
          </NotificationBanner>
          <Button
            type="button"
            onClick={handleResend}
            loading={resending}
            className="w-full"
          >
            {t("verifyEmail.requestNew")}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {formError ? (
            <NotificationBanner
              tone={formError === "NOT_CONNECTED" ? "warning" : "error"}
            >
              {t(ERROR_MESSAGE_KEYS[formError])}
            </NotificationBanner>
          ) : resent ? (
            <NotificationBanner tone="info">
              {t("verifyEmail.resendSent")}
            </NotificationBanner>
          ) : null}

          <div className="space-y-2">
            <OtpInput
              label={t("verifyEmail.codeLabel")}
              digitLabel={(index) =>
                t("verifyEmail.digitLabel", {
                  number: index + 1,
                  total: OTP_LENGTH,
                })
              }
              value={digits}
              onChange={(next) => {
                setDigits(next);
                resetCodeFeedback();
              }}
              disabled={verifying}
              invalid={Boolean(codeError)}
              autoFocus
            />
            {codeError ? (
              <p className="text-sm text-error-foreground">{codeError}</p>
            ) : (
              <p className="text-sm text-muted">{t("verifyEmail.codeHelper")}</p>
            )}
          </div>

          <Button type="submit" loading={verifying} className="w-full">
            {t("verifyEmail.submit")}
          </Button>

          <div className="flex min-h-8 items-center justify-center">
            {secondsLeft > 0 ? (
              <p className="text-sm text-subtle tabular-nums">
                {t("verifyEmail.resendIn", { seconds: secondsLeft })}
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="inline-flex cursor-pointer items-center gap-2 rounded-control text-sm font-medium text-heading underline-offset-4 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resending ? <Spinner className="size-3.5 border" /> : null}
                {t("verifyEmail.resend")}
              </button>
            )}
          </div>
        </form>
      )}
    </AuthPageShell>
  );
}
