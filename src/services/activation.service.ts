import type {
  AccountServiceResult,
  ActivationPaymentStatus,
} from "@/types/account";

export interface ActivationPaymentStart {
  redirectUrl?: string;
}

export async function initiateActivationPayment(): Promise<
  AccountServiceResult<ActivationPaymentStart>
> {
  return { ok: false, error: "NOT_CONNECTED" };
}

export async function checkActivationPaymentStatus(): Promise<
  AccountServiceResult<ActivationPaymentStatus>
> {
  return { ok: false, error: "NOT_CONNECTED" };
}
