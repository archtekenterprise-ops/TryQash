import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailPage } from "@/components/auth/verify-email-page";
import { Spinner } from "@/components/ui/spinner";
import { getTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return {
    title: t("verifyEmail.metaTitle"),
    description: t("verifyEmail.metaDescription"),
  };
}

/**
 * Server wrapper: provides metadata for full loads and soft navigations.
 * All visible text is rendered by the client VerifyEmailPage so the
 * language switch applies instantly without a refresh.
 *
 * Suspense is required because the page reads the ?email= parameter with
 * useSearchParams().
 */
export default async function VerifyEmailRoute() {
  const { t } = await getTranslator();

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-surface-page">
          <Spinner size="lg" label={t("loading.page")} />
        </div>
      }
    >
      <VerifyEmailPage />
    </Suspense>
  );
}
