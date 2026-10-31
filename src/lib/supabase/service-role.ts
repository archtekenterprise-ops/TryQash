import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with service role key.
 *
 * This client has elevated permissions and can bypass RLS policies.
 * Use ONLY for server-side operations that require admin-level access:
 * - Calling security definer functions (email_for_phone, phone_taken)
 * - Admin operations that need full database access
 * - Postback handlers that need to write to protected tables
 *
 * NEVER use this in browser code or expose the service role key to the client.
 * NEVER import this file in client components.
 */

let serviceClient: SupabaseClient | null = null;

export function getServiceRoleClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Service role client not configured: set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local. " +
        "See .env.example for details."
    );
  }

  if (!serviceClient) {
    serviceClient = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serviceClient;
}

export function isServiceRoleConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
