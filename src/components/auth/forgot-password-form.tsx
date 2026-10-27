"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useTranslation } from "@/i18n/context";
import { getEmailError } from "@/lib/validation";
import { requestPasswordReset } from "@/services/auth.service";
import type { AuthError } from "@/types/auth";

/**
 * Requests a password recovery email. On success the form is replaced by a
 * confirmation state instructing the user to follow the instructions sent
 * to their email. The message intentionally says "if an account exists"
 * because the provider does not reveal whether an address is registered.
 */
export function ForgotPasswordForm() {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const error = getEmailError(email);
    setEmailError(error ? t(error) : undefined);
    if (error) {
      return;
    }

    setSubmitting(true);
    const result = await requestPasswordReset(email.trim());
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setCompleted(true);
  }

  if (completed) {
    return (
      <div className="space-y-5">
        <NotificationBanner tone="success" title={t("forgot.successTitle")}>
          {t("forgot.successBody", { email: email.trim() })}
        </NotificationBanner>
        <Link
          href="/login"
          className={buttonClasses({ variant: "secondary" }) + " w-full"}
        >
          {t("forgot.backToSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError ? (
        <NotificationBanner
          tone={formError.code === "NOT_CONFIGURED" ? "warning" : "error"}
        >
          {formError.messageKey
            ? t(formError.messageKey)
            : formError.message}
        </NotificationBanner>
      ) : null}

      <Input
        label={t("forgot.emailLabel")}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder={t("forgot.emailPlaceholder")}
        helperText={t("forgot.emailHelper")}
        value={email}
        error={emailError}
        onChange={(event) => {
          setEmail(event.target.value);
          if (emailError) {
            setEmailError(undefined);
          }
        }}
      />

      <Button type="submit" loading={submitting} className="w-full">
        {t("forgot.submit")}
      </Button>
    </form>
  );
}
