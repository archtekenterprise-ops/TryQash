import { redirect } from "next/navigation";
import type { AccountAccessState, AccountStatus } from "@/types/account";
import { createServerSupabaseClient, getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { AuthenticatedUser } from "@/lib/supabase/server";

function isAccountStatus(value: unknown): value is AccountStatus {
  return (
    value === "pending" ||
    value === "active" ||
    value === "suspended" ||
    value === "banned"
  );
}

/**
 * Loads account access from the signed-in user's Supabase profile. Missing
 * status or backend data stays unavailable; it never becomes an active state.
 */
export async function loadVerifiedAccountState(
  knownUser?: AuthenticatedUser | null,
): Promise<AccountAccessState | null> {
  if (!isSupabaseConfigured()) return null;

  const user = knownUser === undefined ? await getCurrentUser() : knownUser;
  if (!user) redirect("/login");
  if (!user.emailVerified) redirect("/verify-email");

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error loading account access status:", error);
      return null;
    }

    if (!data || !isAccountStatus(data.status)) {
      console.error("Account profile has no recognized status.");
      return null;
    }

    return {
      emailVerified: user.emailVerified,
      accountStatus: data.status,
      activationPaymentStatus: null,
      activationPrice: null,
    };
  } catch (error) {
    console.error("Error loading account access status:", error);
    return null;
  }
}
