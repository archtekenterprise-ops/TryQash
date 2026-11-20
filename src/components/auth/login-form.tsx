"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { useTranslation } from "@/i18n/context";
import { getEmailError, PASSWORD_MIN_LENGTH } from "@/lib/validation";
import { signInWithPassword } from "@/services/auth.service";
import type { AuthError } from "@/types/auth";
import { PasswordInput } from "./password-input";

interface FieldErrors {
  email?: string;
  password?: string;
}

/**
 * Sign-in form. Supabase authentication uses an email address and password.
 *
 * A redirect to /dashboard happens ONLY after the service reports a genuine
 * success; NOT_CONFIGURED or provider errors render an inline banner.
 */
export function LoginForm() {
  const router = useRouter();
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};
    const emailError = getEmailError(email);
    if (emailError) {
      errors.email = t(emailError);
    }
    if (!password) {
      errors.password = t("validation.password.enterYours");
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    const result = await signInWithPassword({ email, password });
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
        label={t("login.emailLabel")}
        name="email"
        type="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        required
        placeholder={t("login.emailPlaceholder")}
        value={email}
        error={fieldErrors.email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (fieldErrors.email) {
            setFieldErrors((previous) => ({
              ...previous,
              email: undefined,
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
