import type { Metadata } from "next";
import { HelpPageView } from "@/components/account/help-page-view";
import { getTranslator } from "@/i18n/server";
import { accountQueryFromSearchParams, type AccountRouteSearchParams } from "@/lib/account-route";
import { getAccountAccessState } from "@/services/account.service";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("help.metaTitle") };
}

export default async function HelpPage({ searchParams }: { searchParams: Promise<AccountRouteSearchParams> }) {
  const params = await searchParams;
  const result = await getAccountAccessState(accountQueryFromSearchParams(params));
  return <HelpPageView state={result.ok ? result.data : null} />;
}
