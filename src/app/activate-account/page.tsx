import type { Metadata } from "next";
import { ActivationPage } from "@/components/account/activation-page";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("activation.metaTitle") };
}

export default async function ActivateAccountPage() {
  const state = await loadVerifiedAccountState();
  return <ActivationPage state={state} />;
}
