/**
 * Supabase configuration resolution.
 *
 * Reads the public Supabase credentials from environment variables. Both
 * values are public by design and safe for the browser. NEVER put a
 * service-role key or any other secret here.
 *
 * Returns null when the variables are missing so callers can decide how to
 * behave (show a setup hint, skip session refresh, etc.) instead of failing
 * at import time. This module never throws.
 */

export interface SupabaseConfig {
  url: string;
  key: string;
}

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}
