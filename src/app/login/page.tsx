import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";
import { getTranslator } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return {
    title: t("login.metaTitle"),
    description: t("login.metaDescription"),
  };
}

/**
 * Server wrapper: it only provides metadata for full loads and soft
 * navigations. All visible text is rendered by the client AuthPage so the
 * language switch applies instantly without a refresh.
 */
export default function LoginPage() {
  return <AuthPage page="login" />;
}
