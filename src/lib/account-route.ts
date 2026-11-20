import type { AccountMockQuery } from "@/services/mocks/account.mock";

export interface AccountRouteSearchParams {
  account?: string | string[];
  emailVerified?: string | string[];
  payment?: string | string[];
  action?: string | string[];
}

function first(value?: string | string[]): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

export function accountQueryFromSearchParams(
  params: AccountRouteSearchParams,
): AccountMockQuery {
  return {
    account: first(params.account),
    emailVerified: first(params.emailVerified),
    payment: first(params.payment),
  };
}

export function actionFromSearchParams(
  params: AccountRouteSearchParams,
): string | undefined {
  return first(params.action);
}
