import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Minimal table primitives in the reference style: quiet uppercase headers,
 * row dividers, airy cell padding, and horizontal scrolling on small screens.
 * Compose Table + TableHead + TableBody + TableRow + TableHeaderCell +
 * TableCell. The surrounding rounding/border usually comes from a Card.
 */
export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={joinClasses("w-full text-left text-sm", className)}
        {...props}
      />
    </div>
  );
}

export function TableHead({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={joinClasses(className)} {...props} />;
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={joinClasses(className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={joinClasses(
        "border-b border-surface transition-colors last:border-b-0 hover:bg-surface-subtle/60",
        className,
      )}
      {...props}
    />
  );
}

export function TableHeaderCell({
  className,
  scope = "col",
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope={scope}
      className={joinClasses(
        "whitespace-nowrap border-b border-surface px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={joinClasses("px-4 py-3 align-middle text-body", className)}
      {...props}
    />
  );
}
