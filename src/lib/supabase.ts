import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Central Supabase client module for the TryQash frontend.
 *
 * Configuration is read from public environment variables:
 *
 * - NEXT_PUBLIC_SUPABASE_URL
 * - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
 *   (NEXT_PUBLIC_SUPABASE_ANON_KEY is accepted as a fallback for projects
 *   that still use Supabase legacy API keys)
 *
 * These variables are public by design and safe to expose in the browser.
 * NEVER use a Supabase service-role key — or any other secret — here or in
 * any other client-side code.
 *
 * The client is created lazily so the application can build, lint, and
 * render before any Supabase project has been provisioned. The first call
 * to getSupabaseClient() throws a descriptive error if the environment is
 * not configured yet.
 */

let client: SupabaseClient | null = null;

function readSupabaseEnv(): { url?: string; key?: string } {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/**
 * Returns true when both required Supabase environment variables are set.
 * Useful for conditional rendering while credentials are not yet provisioned.
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = readSupabaseEnv();
  return Boolean(url && key);
}

/**
 * Returns the shared Supabase client, creating it on first call.
 *
 * @throws {Error} A descriptive error naming every missing environment
 * variable, so it is always clear what still needs to be configured.
 */
export function getSupabaseClient(): SupabaseClient {
  if (client) {
    return client;
  }

  const { url, key } = readSupabaseEnv();

  const missing: string[] = [];
  if (!url) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!key) {
    missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  if (missing.length > 0 || !url || !key) {
    throw new Error(
      `Supabase is not configured: missing environment variable(s): ${missing.join(
        ", ",
      )}. Copy .env.example to .env.local and fill in your Supabase project's URL and publishable (anon/public) key. See README.md for details.`,
    );
  }

  client = createClient(url, key);
  return client;
}
