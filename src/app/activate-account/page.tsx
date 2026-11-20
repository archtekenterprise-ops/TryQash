import type { Metadata } from "next";
import { ActivationPage } from "@/components/account/activation-page";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";
import type { AccountRouteSearchParams } from "@/lib/account-route";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("activation.metaTitle") };
}

export default async function ActivateAccountPage({ searchParams }: { searchParams: Promise<AccountRouteSearchParams> }) {
  const params = await searchParams;
  const state = await loadVerifiedAccountState(params);
  return state ? <ActivationPage state={state} /> : null;
}
