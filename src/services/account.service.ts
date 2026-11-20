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
  try {
    const response = await fetch('/api/account/state');
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'UNKNOWN' };
    }

    return {
      ok: true,
      data: data.data as AccountAccessState,
    };
  } catch (error) {
    console.error('Error refreshing account state:', error);
    return { ok: false, error: 'NETWORK_ERROR' };
  }
}