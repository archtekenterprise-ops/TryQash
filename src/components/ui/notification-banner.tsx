import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

export type BannerTone = "info" | "success" | "warning" | "error";

export interface NotificationBannerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Tone. Default: "info", which renders a neutral grey banner with an
   * information icon. Status tones use semantic colors.
   */
  tone?: BannerTone;
  /** Optional bold lead line above the message content. */
  title?: string;
}

const TONE_STYLES: Record<
  BannerTone,
  { wrapper: string; Icon: LucideIcon; role: "status" | "alert" }
> = {
  info: {
    wrapper: "border-surface bg-surface-subtle text-heading",
    Icon: Info,
    role: "status",
  },
  success: {
    wrapper:
      "border-success-soft-border bg-success-soft text-success-foreground",
    Icon: CheckCircle2,
    role: "status",
  },
  warning: {
    wrapper:
      "border-warning-soft-border bg-warning-soft text-warning-foreground",
    Icon: AlertTriangle,
    role: "alert",
  },
  error: {
    wrapper: "border-error-soft-border bg-error-soft text-error-foreground",
    Icon: XCircle,
    role: "alert",
  },
};

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Full-width page notification. Informational and successful messages use
 * role="status"; warnings and errors use role="alert". Keep content short
 * and factual.
 */
export function NotificationBanner({
  tone = "info",
  title,
  className,
  children,
  ...props
}: NotificationBannerProps) {
  const { wrapper, Icon, role } = TONE_STYLES[tone];
  return (
    <div
      role={role}
      className={joinClasses(
        "flex gap-3 rounded-card border p-4",
        wrapper,
        className,
      )}
      {...props}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        {title ? <p className="text-sm font-semibold">{title}</p> : null}
        <div className={`text-sm ${title ? "mt-0.5" : ""}`}>{children}</div>
      </div>
    </div>
  );
}
