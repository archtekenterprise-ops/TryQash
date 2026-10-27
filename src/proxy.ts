import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

/**
 * Refreshes the Supabase session cookie on every page request, following
 * the official Supabase SSR pattern for Next.js. Without this, sessions
 * can silently expire for server-rendered pages.
 *
 * Access control itself does NOT live here: the dashboard page verifies the
 * user server-side. When Supabase is not configured, requests pass through
 * untouched.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const config = getSupabaseConfig();
  if (!config) {
    return response;
  }

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Refreshes the session if it has expired. Do not run logic between
  // createServerClient and getUser; see Supabase SSR guidance.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Page routes only: skip API routes, static assets, and files.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
