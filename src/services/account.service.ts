import type {
  AccountAccessState,
  AccountServiceResult,
} from "@/types/account";
import {
  ACCOUNT_MOCK_ENABLED,
  getMockAccountState,
  type AccountMockQuery,
} from "./mocks/account.mock";

export async function getAccountAccessState(
  query: AccountMockQuery = {},
): Promise<AccountServiceResult<AccountAccessState>> {
  if (ACCOUNT_MOCK_ENABLED) {
    return { ok: true, data: getMockAccountState(query) };
  }

  return { ok: false, error: "NOT_CONNECTED" };
}

export async function refreshAccountAccessState(): Promise<
  AccountServiceResult<AccountAccessState>
> {
  return { ok: false, error: "NOT_CONNECTED" };
}