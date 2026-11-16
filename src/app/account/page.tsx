import type { Metadata } from "next";
import { AccountPageView } from "@/components/account/account-page-view";
import { getTranslator } from "@/i18n/server";
import { loadVerifiedAccountState } from "@/lib/account-route-server";
import { getCurrentUserProfile } from "@/services/dashboard.service";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return { title: t("accountPage.metaTitle") };
}

export default async function AccountPage() {
  const state = await loadVerifiedAccountState();
  const profile = await getCurrentUserProfile();
  return <AccountPageView state={state} profile={profile} />;
}
