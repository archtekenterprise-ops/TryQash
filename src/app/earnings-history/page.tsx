import type { Metadata } from "next";
import { EarningsHistoryView } from "@/components/account/earnings-history-view";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";
import type { AccountRouteSearchParams } from "@/lib/account-route";
import { getRecentEarningActivity } from "@/services/dashboard.service";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("earningsHistory.title") };
}

export default async function EarningsHistoryPage({ searchParams }: { searchParams: Promise<AccountRouteSearchParams> }) {
  const params = await searchParams;
  const state = await loadVerifiedAccountState(params);
  if (!state) return null;
  const activity = await getRecentEarningActivity();
  return <EarningsHistoryView state={state} activity={activity} />;
}
