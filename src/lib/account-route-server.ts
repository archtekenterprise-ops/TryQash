import { redirect } from "next/navigation";
import {
  accountQueryFromSearchParams,
  type AccountRouteSearchParams,
} from "./account-route";
import { getAccountAccessState, refreshAccountAccessState } from "@/services/account.service";
import type { AccountAccessState } from "@/types/account";

export async function loadVerifiedAccountState(
  params: AccountRouteSearchParams,
): Promise<AccountAccessState | null> {
  // Try using the real API first
  const result = await refreshAccountAccessState();
  if (!result.ok) {
    // Fallback to mock for preview/testing
    const mockResult = await getAccountAccessState(accountQueryFromSearchParams(params));
    if (!mockResult.ok) return null;
    if (!mockResult.data.emailVerified) {
      redirect("/verify-email");
    }
    return mockResult.data;
  }
  if (!result.data.emailVerified) {
    redirect("/verify-email");
  }
  return result.data;
}