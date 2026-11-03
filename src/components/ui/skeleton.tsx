import type { HTMLAttributes } from "react";

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Grey placeholder block shown while content loads.
 *
 * Skeletons are purely decorative: they are hidden from assistive
 * technology, so the surrounding container should expose the loading
 * state (for example role="status" with a visually hidden label).
 */
export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={joinClasses(
        "animate-pulse rounded-control bg-surface-strong/50",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Several skeleton lines imitating a paragraph. The last line is shorter
 * so the block reads as text rather than a solid box.
 */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={joinClasses("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={joinClasses(
            "h-2.5 rounded-full",
            index === lines - 1 ? "w-1/3" : index % 2 === 0 ? "w-2/3" : "w-1/2",
          )}
        />
      ))}
    </div>
  );
}

/** Card-shaped skeleton matching the dashboard placeholder cards. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={joinClasses(
        "rounded-card border border-surface bg-surface-card p-6",
        className,
      )}
    >
      <Skeleton className="h-2.5 w-24 rounded-full" />
      <SkeletonText className="mt-4" />
    </div>
  );
}

/** Rows of skeleton cells for tables that are still loading. */
export function SkeletonTableRows({
  rows = 4,
  columns = 3,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-surface last:border-b-0">
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <td key={columnIndex} className="px-4 py-3">
              <Skeleton
                className={joinClasses(
                  "h-2.5 rounded-full",
                  columnIndex === 0 ? "w-32" : "w-20",
                )}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
