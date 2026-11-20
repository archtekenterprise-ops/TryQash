import { DEFAULT_ACTIVATION_PRICE } from "@/lib/activation-config";
import type {
  AccountAccessState,
  AccountStatus,
  ActivationPaymentStatus,
} from "@/types/account";

export const ACCOUNT_MOCK_ENABLED = true;

const ACCOUNT_STATUSES: AccountStatus[] = [
  "pending",
  "active",
  "suspended",
  "banned",
];

const PAYMENT_STATUSES: ActivationPaymentStatus[] = [
  "not_started",
  "pending",
  "successful",
  "failed",
  "cancelled",
];

function isAccountStatus(value: string): value is AccountStatus {
  return ACCOUNT_STATUSES.some((status) => status === value);
}

function isPaymentStatus(value: string): value is ActivationPaymentStatus {
  return PAYMENT_STATUSES.some((status) => status === value);
}

function accountStatus(value?: string): AccountStatus {
  return value && isAccountStatus(value) ? value : "pending";
}

function paymentStatus(value?: string): ActivationPaymentStatus {
  return value && isPaymentStatus(value) ? value : "not_started";
}

export interface AccountMockQuery {
  account?: string;
  emailVerified?: string;
  payment?: string;
}

export function getMockAccountState(
  query: AccountMockQuery = {},
): AccountAccessState {
  return {
    emailVerified: query.emailVerified !== "false",
    accountStatus: accountStatus(query.account),
    activationPaymentStatus: paymentStatus(query.payment),
    activationPrice: DEFAULT_ACTIVATION_PRICE,
  };
}
