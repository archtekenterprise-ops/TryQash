"use client";

import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { useTranslation } from "@/i18n/context";

/**
 * Full-page loading skeleton used as the Suspense fallback by route-level
 * loading.tsx files. The skeleton blocks mirror the real layout (header
 * block, then a grid of cards) so the page does not jump when content
 * arrives.
 *
 * The container carries role="status" with a visually hidden label, since
 * the skeleton blocks themselves are hidden from assistive technology.
 */
export function PageLoading({ cards = 3 }: { cards?: number }) {
  const t = useTranslation();

  return (
    <div role="status" className="py-8 sm:py-10">
      <span className="sr-only">{t("loading.content")}</span>

      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="mt-3 h-6 w-64 max-w-full rounded-full" />
      <Skeleton className="mt-3 h-3 w-full max-w-md rounded-full" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cards }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
