import { Container } from "@/components/layout/container";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Route-level loading UI for /dashboard, matching the real layout (sidebar
 * + top bar + header + three summary cards) so the page does not jump when
 * content arrives.
 */
export default function DashboardLoading() {
  return (
    <div className="flex min-h-dvh">
      <div className="hidden w-60 shrink-0 border-r border-surface lg:block" />
      <div className="min-w-0 flex-1">
        <div className="h-16 border-b border-surface bg-surface-page" />
        <Container className="py-8">
          <div role="status" aria-label="Loading">
            <Skeleton className="h-3 w-40 rounded-full" />
            <Skeleton className="mt-3 h-6 w-64 max-w-full rounded-full" />
            <Skeleton className="mt-3 h-3 w-80 max-w-full rounded-full" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
