import type { HTMLAttributes } from "react";

export type StatusTone = "success" | "warning" | "error" | "neutral";

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Semantic tone. Default: "neutral". */
  tone?: StatusTone;
}

const TONE_STYLES: Record<StatusTone, { wrapper: string; dot: string }> = {
  success: {
    wrapper: "border-success-soft-border bg-success-soft text-success-foreground",
    dot: "bg-success",
  },
  warning: {
    wrapper: "border-warning-soft-border bg-warning-soft text-warning-foreground",
    dot: "bg-warning",
  },
  error: {
    wrapper: "border-error-soft-border bg-error-soft text-error-foreground",
    dot: "bg-error",
  },
  neutral: {
    wrapper: "border-surface bg-surface-subtle text-muted",
    dot: "bg-subtle",
  },
};

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Compact status indicator: a small pill with a colored dot and short label.
 * Green communicates positive states and red negative states, matching the
 * reference. Always provide a short text label - never color alone.
 */
export function StatusBadge({
  tone = "neutral",
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const { wrapper, dot } = TONE_STYLES[tone];
  return (
    <span
      className={joinClasses(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        wrapper,
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${dot}`} />
      {children}
    </span>
  );
}
