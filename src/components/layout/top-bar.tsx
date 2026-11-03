import type { ReactNode } from "react";
import { LanguageSwitcher } from "./language-switcher";

export interface TopBarProps {
  /** Short context label for the current view (not the page h1). */
  title: string;
  /** Right-aligned slot for compact actions, shown before the switcher. */
  actions?: ReactNode;
  className?: string;
}

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Slim horizontal bar at the top of the main content column. Sticky below
 * the mobile top bar on small screens. The language switcher is always the
 * last item in the top right corner. The page h1 itself belongs to
 * PageHeader inside the content area.
 */
export function TopBar({ title, actions, className }: TopBarProps) {
  return (
    <div
      className={joinClasses(
        "sticky top-14 z-30 flex h-14 items-center justify-between gap-4 border-b border-surface bg-surface-page px-4 sm:px-6 lg:top-0 lg:px-8",
        className,
      )}
    >
      <p className="truncate text-sm font-medium text-heading">{title}</p>
      <div className="flex shrink-0 items-center gap-2">
        {actions}
        <LanguageSwitcher />
      </div>
    </div>
  );
}
