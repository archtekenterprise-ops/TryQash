"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

let client: SupabaseClient | null = null;

/**
 * Returns the browser Supabase client (cookie-based session storage via
 * @supabase/ssr, so server components and the request proxy can read the session).
 * Only call this in browser code: event handlers and effects of client
 * components.
 *
 * @throws {Error} When the Supabase environment variables are missing.
 * Callers should check isSupabaseConfigured() first and show a helpful
 * state instead of letting this throw.
 */
export function getBrowserSupabaseClient(): SupabaseClient {
  const config = getSupabaseConfig();
  if (!config) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local. " +
        "See .env.example and docs/BACKEND_INTEGRATION.md.",
    );
  }

  client ??= createBrowserClient(config.url, config.key);
  return client;
}

export { isSupabaseConfigured } from "./config";
