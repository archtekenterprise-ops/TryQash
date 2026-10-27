import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getTranslator } from "@/i18n/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/lib/supabase/server";
import { getDashboardData } from "@/services/dashboard.service";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslator();
  return {
    title: t("dashboard.metaTitle"),
    description: t("dashboard.metaDescription"),
  };
}

// Sessions and dashboard data are request-scoped, so always render dynamic.
export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams: Promise<{ preview?: string | string[] }>;
}

/**
 * Dashboard route.
 *
 * Server responsibilities (this file):
 * 1. INTEGRATION POINT - authentication guard. When Supabase is configured,
 *    the signed-in user is verified via getCurrentUser() and unauthenticated
 *    requests redirect to /login. When not configured (current state), the
 *    page renders the preview with sample data instead of faking a session.
 * 2. Load the dashboard data through the dashboard service. The ?preview=
 *    query is a development override that selects a mock state
 *    (src/services/mocks/dashboard.mock.ts); it becomes inert when the mock
 *    is removed.
 *
 * The client DashboardView renders everything, so language switching stays
 * instant and this file stays presentational/data-only.
 */
export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const configured = isSupabaseConfigured();
  const user = configured ? await getCurrentUser() : null;

  if (configured && !user) {
    redirect("/login");
  }

  const { preview } = await searchParams;
  const result = await getDashboardData({
    email: user?.email ?? null,
    preview: typeof preview === "string" ? preview : undefined,
  });

  return (
    <DashboardView
      result={result}
      configured={configured}
      email={user?.email ?? null}
    />
  );
}
