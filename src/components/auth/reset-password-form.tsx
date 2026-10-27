"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button, buttonClasses } from "@/components/ui/button";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { Spinner } from "@/components/ui/spinner";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import {
  getPasswordConfirmationError,
  getPasswordError,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation";
import { hasActiveSession, updatePassword } from "@/services/auth.service";
import type { AuthError } from "@/types/auth";
import { PasswordInput } from "./password-input";

type LinkState = "checking" | "ready" | "invalid";

interface FieldErrors {
  password?: string;
  passwordConfirmation?: string;
}

/**
 * Sets a new password after email recovery. A valid recovery link grants a
 * temporary session (via /auth/confirm); on mount this form checks for that
 * session and shows a clear invalid-or-expired-link state when it is
 * missing, instead of rendering a form that could never work.
 */
export function ResetPasswordForm() {
  const t = useTranslation();
  const [linkState, setLinkState] = useState<LinkState>("checking");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let active = true;
    hasActiveSession().then((hasSession) => {
      if (active) {
        setLinkState(hasSession ? "ready" : "invalid");
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function translateKey(key: TranslationKey): string {
    return t(key, { min: PASSWORD_MIN_LENGTH });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};
    const passwordError = getPasswordError(password);
    if (passwordError) {
      errors.password = translateKey(passwordError);
    }
    const confirmationError = getPasswordConfirmationError(
      password,
      passwordConfirmation,
    );
    if (confirmationError) {
      errors.passwordConfirmation = translateKey(confirmationError);
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    const result = await updatePassword(password);
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    setCompleted(true);
  }

  if (linkState === "checking") {
    return (
      <p className="flex items-center gap-2 text-sm text-muted" role="status">
        <Spinner />
        {t("reset.checking")}
      </p>
    );
  }

  if (linkState === "invalid") {
    return (
      <div className="space-y-5">
        <NotificationBanner tone="error" title={t("reset.invalidTitle")}>
          {t("reset.invalidBody")}
        </NotificationBanner>
        <Link href="/forgot-password" className={buttonClasses({}) + " w-full"}>
          {t("reset.requestNew")}
        </Link>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="space-y-5">
        <NotificationBanner tone="success" title={t("reset.successTitle")}>
          {t("reset.successBody")}
        </NotificationBanner>
        <Link href="/login" className={buttonClasses({}) + " w-full"}>
          {t("register.continueToSignIn")}
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
            ? translateKey(formError.messageKey)
            : formError.message}
        </NotificationBanner>
      ) : null}

      <PasswordInput
        label={t("reset.newPasswordLabel")}
        name="password"
        autoComplete="new-password"
        required
        placeholder={t("reset.newPasswordPlaceholder")}
        value={password}
        error={fieldErrors.password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (fieldErrors.password) {
            setFieldErrors((previous) => ({
              ...previous,
              password: undefined,
            }));
          }
        }}
      />

      <PasswordInput
        label={t("reset.confirmLabel")}
        name="passwordConfirmation"
        autoComplete="new-password"
        required
        placeholder={t("reset.confirmPlaceholder")}
        value={passwordConfirmation}
        error={fieldErrors.passwordConfirmation}
        onChange={(event) => {
          setPasswordConfirmation(event.target.value);
          if (fieldErrors.passwordConfirmation) {
            setFieldErrors((previous) => ({
              ...previous,
              passwordConfirmation: undefined,
            }));
          }
        }}
      />

      <Button type="submit" loading={submitting} className="w-full">
        {t("reset.submit")}
      </Button>
    </form>
  );
}
