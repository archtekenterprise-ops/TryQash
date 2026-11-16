import type { Metadata } from "next";
import { HelpPageView } from "@/components/account/help-page-view";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("help.metaTitle") };
}

export default async function HelpPage() {
  const state = await loadVerifiedAccountState();
  return <HelpPageView state={state} />;
}
