import { redirect } from "next/navigation";
import {
  accountQueryFromSearchParams,
  type AccountRouteSearchParams,
} from "./account-route";
import { getAccountAccessState } from "@/services/account.service";
import type { AccountAccessState } from "@/types/account";

export async function loadVerifiedAccountState(
  params: AccountRouteSearchParams,
): Promise<AccountAccessState | null> {
  const result = await getAccountAccessState(accountQueryFromSearchParams(params));
  if (!result.ok) return null;
  if (!result.data.emailVerified) {
    redirect("/verify-email");
  }
  return result.data;
}