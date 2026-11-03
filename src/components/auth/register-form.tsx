"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationBanner } from "@/components/ui/notification-banner";
import { Select } from "@/components/ui/select";
import { useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { COUNTRIES } from "@/lib/countries";
import {
  getCountryError,
  getEmailError,
  getPasswordConfirmationError,
  getPasswordError,
  getUsernameError,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation";
import { registerUser } from "@/services/auth.service";
import type { AuthError } from "@/types/auth";
import { PasswordInput } from "./password-input";

interface FieldErrors {
  email?: string;
  password?: string;
  passwordConfirmation?: string;
  username?: string;
  country?: string;
  referralCode?: string;
}

/**
 * Registration form following the TryQash database plan.
 *
 * Fields: email + password (Supabase Auth credentials), username (3-20
 * letters/numbers/underscores), country (ISO alpha-2 code), and an
 * optional referral code. No full name, date of birth, or address fields
 * exist here because the plan does not define them. The password
 * confirmation field is client-side validation only and is never
 * submitted. Roles and account status are never selectable: the database
 * trigger assigns the default "user" role.
 *
 * On success the user is sent to /verify-email with their email address in
 * the query string, where they enter the six-digit code sent to them. The
 * next step after verification is sign-in, never the dashboard.
 */
export function RegisterForm() {
  const t = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<AuthError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function clearFieldError(field: keyof FieldErrors) {
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }));
  }

  function translateKey(key: TranslationKey): string {
    return t(key, { min: PASSWORD_MIN_LENGTH });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const errors: FieldErrors = {};

    const emailError = getEmailError(email);
    if (emailError) {
      errors.email = translateKey(emailError);
    }
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
    const usernameError = getUsernameError(username);
    if (usernameError) {
      errors.username = translateKey(usernameError);
    }
    const countryError = getCountryError(country);
    if (countryError) {
      errors.country = translateKey(countryError);
    }
    // The referral code is optional and its format is defined by the
    // backend, so the client performs no format validation on it.
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    const result = await registerUser({
      email: email.trim(),
      password,
      username: username.trim(),
      country,
      referralCode: referralCode.trim() || undefined,
    });
    setSubmitting(false);

    if (!result.ok) {
      const { error } = result;
      const text = error.messageKey
        ? translateKey(error.messageKey)
        : (error.message ?? "");

      // Backend-attributed errors land on their field; everything else
      // shows as a form-level banner.
      if (error.field && error.field !== "password") {
        setFieldErrors((previous) => ({
          ...previous,
          [error.field as keyof FieldErrors]: text,
        }));
      } else {
        setFormError(error);
      }
      return;
    }

    // Registration succeeded: continue to email verification.
    router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
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

      <Input
        label={t("register.emailLabel")}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder={t("register.emailPlaceholder")}
        value={email}
        error={fieldErrors.email}
        onChange={(event) => {
          setEmail(event.target.value);
          if (fieldErrors.email) {
            clearFieldError("email");
          }
        }}
      />

      <Input
        label={t("register.usernameLabel")}
        name="username"
        autoComplete="username"
        required
        placeholder={t("register.usernamePlaceholder")}
        helperText={t("register.usernameHelper")}
        value={username}
        error={fieldErrors.username}
        onChange={(event) => {
          setUsername(event.target.value);
          if (fieldErrors.username) {
            clearFieldError("username");
          }
        }}
      />

      <Select
        label={t("register.countryLabel")}
        name="country"
        required
        value={country}
        error={fieldErrors.country}
        onChange={(event) => {
          setCountry(event.target.value);
          if (fieldErrors.country) {
            clearFieldError("country");
          }
        }}
      >
        <option value="" disabled>
          {t("register.countryPlaceholder")}
        </option>
        {COUNTRIES.map((entry) => (
          <option key={entry.code} value={entry.code}>
            {entry.name}
          </option>
        ))}
      </Select>

      <PasswordInput
        label={t("register.passwordLabel")}
        name="password"
        autoComplete="new-password"
        required
        placeholder={t("register.passwordPlaceholder")}
        helperText={t("register.passwordHelper")}
        value={password}
        error={fieldErrors.password}
        onChange={(event) => {
          setPassword(event.target.value);
          if (fieldErrors.password) {
            clearFieldError("password");
          }
        }}
      />

      <PasswordInput
        label={t("register.confirmLabel")}
        name="passwordConfirmation"
        autoComplete="new-password"
        required
        placeholder={t("register.confirmPlaceholder")}
        value={passwordConfirmation}
        error={fieldErrors.passwordConfirmation}
        onChange={(event) => {
          setPasswordConfirmation(event.target.value);
          if (fieldErrors.passwordConfirmation) {
            clearFieldError("passwordConfirmation");
          }
        }}
      />

      <Input
        label={t("register.referralLabel")}
        name="referralCode"
        autoComplete="off"
        placeholder={t("register.referralPlaceholder")}
        value={referralCode}
        error={fieldErrors.referralCode}
        onChange={(event) => {
          setReferralCode(event.target.value);
          if (fieldErrors.referralCode) {
            clearFieldError("referralCode");
          }
        }}
      />

      <Button type="submit" loading={submitting} className="w-full">
        {t("register.submit")}
      </Button>
    </form>
  );
}
