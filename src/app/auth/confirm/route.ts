import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * Auth code exchange endpoint (provider plumbing, not a business API).
 *
 * Supabase emails (password recovery, email confirmation) link back here
 * with a ?code= parameter. Exchanging the code establishes the session
 * cookie, after which the user is sent to their destination. This is the
 * standard Supabase SSR flow for Next.js.
 *
 * Failure (missing configuration, missing code, or an invalid/expired code)
 * redirects to /reset-password, whose form renders the clear
 * "invalid or expired link" state when no session exists.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const destination =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/reset-password";

  if (!getSupabaseConfig() || !code) {
    return NextResponse.redirect(new URL(destination, origin));
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(destination, origin));
    }
  } catch {
    // Fall through to the failure redirect below.
  }

  return NextResponse.redirect(new URL("/reset-password", origin));
}
