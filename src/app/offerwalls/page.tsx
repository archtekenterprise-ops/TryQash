import type { Metadata } from "next";
import { EarningServicePage } from "@/components/earning/earning-service-page";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";
import type { AccountRouteSearchParams } from "@/lib/account-route";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("service.offerwalls.title") };
}

export default async function OfferwallsPage({ searchParams }: { searchParams: Promise<AccountRouteSearchParams> }) {
  const params = await searchParams;
  const state = await loadVerifiedAccountState(params);
  return state ? <EarningServicePage kind="offerwalls" accountState={state} /> : null;
}
