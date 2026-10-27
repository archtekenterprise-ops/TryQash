"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useTranslation } from "@/i18n/context";
import { getIdentifierError, PASSWORD_MIN_LENGTH } from "@/lib/validation";
import { signInWithIdentifier } from "@/services/auth.service";
import type { AuthError } from "@/types/auth";
import { PasswordInput } from "./password-input";

interface FieldErrors {
  identifier?: string;
  password?: string;
}

/**
 * Sign-in form. The single identifier field accepts an email address or a
 * username; the auth service classifies the value and routes it
 * appropriately.
 *
 * A redirect to /dashboard happens ONLY after the service reports a genuine
 * success; NOT_CONFIGURED or provider errors render an inline banner.
 */
export function LoginForm() {
  const router = useRouter();
  const t = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};
    const identifierError = getIdentifierError(identifier);
    if (identifierError) {
      errors.identifier = t(identifierError);
    }
    if (!password) {
      errors.password = t("validation.password.enterYours");
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    const result = await signInWithIdentifier({ identifier, password });
    setSubmitting(false);

    if (!result.ok) {
      setFormError(result.error);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {formError ? (
        <NotificationBanner
          tone={formError.code === "NOT_CONFIGURED" ? "warning" : "error"}
        >
          {formError.messageKey
            ? t(formError.messageKey, { min: PASSWORD_MIN_LENGTH })
            : formError.message}
        </NotificationBanner>
      ) : null}

      <Input
        label={t("login.identifierLabel")}
        name="identifier"
        type="text"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        required
        placeholder={t("login.identifierPlaceholder")}
        value={identifier}
        error={fieldErrors.identifier}
        onChange={(event) => {
          setIdentifier(event.target.value);
          if (fieldErrors.identifier) {
            setFieldErrors((previous) => ({
              ...previous,
              identifier: undefined,
            }));
          }
        }}
      />

      <div className="space-y-2">
        <PasswordInput
          label={t("login.passwordLabel")}
          name="password"
          autoComplete="current-password"
          required
          placeholder={t("login.passwordPlaceholder")}
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
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="rounded-control text-sm font-medium text-muted transition-colors hover:text-heading"
          >
            {t("login.forgotLink")}
          </Link>
        </div>
      </div>

      <Button type="submit" loading={submitting} className="w-full">
        {t("login.submit")}
      </Button>
    </form>
  );
}
