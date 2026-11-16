import type { Metadata } from "next";
import { EarningServicePage } from "@/components/earning/earning-service-page";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("service.referrals.title") };
}

export default async function ReferralsPage() {
  const state = await loadVerifiedAccountState();
  return <EarningServicePage kind="referrals" accountState={state} />;
}
