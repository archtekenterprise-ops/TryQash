"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import { AuthPageShell } from "./auth-page-shell";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";
import { ResetPasswordForm } from "./reset-password-form";
import { formatTitle } from "@/i18n/config";
import { useDocumentTitle, useTranslation } from "@/i18n/context";
import type { TranslationKey } from "@/i18n/dictionaries";

export type AuthPageKind =
  | "login"
  | "register"
  | "forgotPassword"
  | "resetPassword";

interface AuthPageMeta {
  /** Document/tab title key. */
  metaTitleKey: TranslationKey;
  /** Card heading key (rendered as the h1). */
  titleKey: TranslationKey;
  /** Muted helper line under the heading. */
  descriptionKey: TranslationKey;
  /** Footer prompt text, e.g. "New to TryQash?". */
  footerPromptKey: TranslationKey;
  /** Footer link text. */
  footerLinkKey: TranslationKey;
  /** Footer link destination. */
  footerHref: string;
}

const PAGE_META: Record<AuthPageKind, AuthPageMeta> = {
  login: {
    metaTitleKey: "login.metaTitle",
    titleKey: "login.title",
    descriptionKey: "login.description",
    footerPromptKey: "login.footerPrompt",
    footerLinkKey: "login.footerLink",
    footerHref: "/register",
  },
  register: {
    metaTitleKey: "register.metaTitle",
    titleKey: "register.title",
    descriptionKey: "register.description",
    footerPromptKey: "register.footerPrompt",
    footerLinkKey: "register.footerLink",
    footerHref: "/login",
  },
  forgotPassword: {
    metaTitleKey: "forgot.metaTitle",
    titleKey: "forgot.title",
    descriptionKey: "forgot.description",
    footerPromptKey: "forgot.footerPrompt",
    footerLinkKey: "forgot.backToSignIn",
    footerHref: "/login",
  },
  resetPassword: {
    metaTitleKey: "reset.metaTitle",
    titleKey: "reset.title",
    descriptionKey: "reset.description",
    footerPromptKey: "reset.footerPrompt",
    footerLinkKey: "reset.footerLink",
    footerHref: "/login",
  },
};

const FORMS: Record<AuthPageKind, ComponentType> = {
  login: LoginForm,
  register: RegisterForm,
  forgotPassword: ForgotPasswordForm,
  resetPassword: ResetPasswordForm,
};

/**
 * Client shell for every authentication page.
 *
 * Being a client component is what makes the language switch instant: the
 * heading, description, and footer come from useTranslation(), so they
 * re-render the moment the locale changes, with no reload or refresh. The
 * route files stay on the server and only provide generateMetadata (the
 * tab title is additionally kept in sync by useDocumentTitle).
 */
export function AuthPage({ page }: { page: AuthPageKind }) {
  const t = useTranslation();
  const meta = PAGE_META[page];
  const Form = FORMS[page];

  useDocumentTitle(formatTitle(t(meta.metaTitleKey)));

  return (
    <AuthPageShell
      title={t(meta.titleKey)}
      description={t(meta.descriptionKey)}
      footer={
        <>
          {t(meta.footerPromptKey)}{" "}
          <Link
            href={meta.footerHref}
            className="rounded-control font-medium text-heading hover:underline underline-offset-4"
          >
            {t(meta.footerLinkKey)}
          </Link>
        </>
      }
    >
      <Form />
    </AuthPageShell>
  );
}
