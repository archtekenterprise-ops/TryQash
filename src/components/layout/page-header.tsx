import type { ReactNode } from "react";

export interface PageHeaderProps {
  /** Small uppercase category label rendered above the title. */
  eyebrow?: string;
  /** Page title - renders the page-level h1. */
  title: string;
  /** Supporting paragraph below the title. */
  description?: string;
  /** Optional action area, typically compact Button components. */
  actions?: ReactNode;
}

/**
 * In-content page introduction following the reference hierarchy: restrained
 * title, muted supporting copy, actions aligned to the right on desktop.
 * Every page should render exactly one PageHeader.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-heading sm:text-2xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  );
}
