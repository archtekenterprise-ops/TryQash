import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Adds the minimal card shadow. The reference keeps cards flat by default;
   * use this sparingly for surfaces that must read as raised.
   */
  elevated?: boolean;
}

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Standard light grey surface for grouping related content, following the
 * reference: subtle border, small radius, flat by default.
 * Compose with CardHeader, CardTitle, CardDescription, CardContent, and
 * CardFooter as needed - all parts are optional.
 */
export function Card({ elevated = false, className, ...props }: CardProps) {
  return (
    <div
      className={joinClasses(
        "rounded-card border border-surface bg-surface-card p-6",
        elevated && "shadow-card",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={joinClasses(className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={joinClasses(
        "text-base font-semibold tracking-tight text-heading",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={joinClasses("mt-1 text-sm text-muted", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={joinClasses("mt-4 text-sm leading-relaxed text-body", className)}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={joinClasses("mt-6 flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}
