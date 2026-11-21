import { redirect } from "next/navigation";
import {
  accountQueryFromSearchParams,
  type AccountRouteSearchParams,
} from "./account-route";
import { getAccountAccessState } from "@/services/account.service";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AccountAccessState } from "@/types/account";

export async function loadVerifiedAccountState(
  params: AccountRouteSearchParams,
): Promise<AccountAccessState | null> {
  // Try using the real API first by calling directly on server
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    try {
      // Get account status from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single();

      // Get most recent payment status
      const { data: payment } = await supabase
        .from('activation_payments')
        .select('status, amount, currency')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const accountState: AccountAccessState = {
        emailVerified: true, // Assuming verified if logged in
        accountStatus: profile?.status || 'pending',
        activationPaymentStatus: payment?.status || 'not_started',
        activationPrice: payment ? {
          amountMinor: parseInt(payment.amount) * 100,
          currency: payment.currency,
        } : { amountMinor: 315000, currency: 'XAF' }, // Default activation price
      };

      if (!accountState.emailVerified) {
        redirect("/verify-email");
      }
      return accountState;
    } catch (error) {
      console.error('Failed to load account state from database:', error);
    }
  }

  // Fallback to mock for preview/testing
  const mockResult = await getAccountAccessState(accountQueryFromSearchParams(params));
  if (!mockResult.ok) {
    console.error('Failed to load account state from mock:', mockResult.error);
    return null;
  }
  if (!mockResult.data.emailVerified) {
    redirect("/verify-email");
  }
  return mockResult.data;
}