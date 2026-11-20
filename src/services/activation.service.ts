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
  try {
    const response = await fetch('/api/activation/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'UNKNOWN' };
    }

    return {
      ok: true,
      data: {
        redirectUrl: data.data?.redirectUrl,
      },
    };
  } catch (error) {
    console.error('Error initiating activation payment:', error);
    return { ok: false, error: 'NETWORK_ERROR' };
  }
}

export async function checkActivationPaymentStatus(): Promise<
  AccountServiceResult<ActivationPaymentStatus>
> {
  try {
    const response = await fetch('/api/activation/status');
    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'UNKNOWN' };
    }

    return {
      ok: true,
      data: data.data?.status as ActivationPaymentStatus,
    };
  } catch (error) {
    console.error('Error checking activation status:', error);
    return { ok: false, error: 'NETWORK_ERROR' };
  }
}
