import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

/**
 * Server-side Supabase client factory that binds the session to Next.js
 * request cookies. Use inside Server Components and Route Handlers.
 *
 * @throws {Error} When the Supabase environment variables are missing.
 * Prefer checking isSupabaseConfigured() first so pages can render a
 * helpful setup state instead of an error page.
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local. " +
        "See .env.example and docs/BACKEND_INTEGRATION.md.",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component, where cookies cannot be written.
          // Session refresh is handled by src/proxy.ts, so this can be
          // safely ignored.
        }
      },
    },
  });
}

export interface AuthenticatedUser {
  id: string;
  email: string | null;
}

/**
 * Returns the currently authenticated user, verified against the Supabase
 * Auth server (auth.getUser validates the token instead of trusting local
 * session data). Returns null when Supabase is not configured or when
 * no valid session exists.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  if (!getSupabaseConfig()) {
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return null;
    }
    return { id: data.user.id, email: data.user.email ?? null };
  } catch {
    return null;
  }
}
