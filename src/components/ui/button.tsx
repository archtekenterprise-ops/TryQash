import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default: "primary". */
  variant?: ButtonVariant;
  /** Control height. Default: "md". Sizes follow the compact reference style. */
  size?: ButtonSize;
  /**
   * Shows a spinner, disables interaction, and exposes aria-busy.
   * The label stays visible so the control keeps its accessible name.
   */
  loading?: boolean;
}

const BASE_CLASSES =
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-medium transition-colors duration-150 button-press disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-strong text-primary-on hover:bg-primary-strong-hover active:bg-primary-strong-active",
  secondary:
    "border border-surface-strong bg-surface-page text-body hover:bg-surface-subtle active:bg-surface-subtle",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-4 text-sm",
};

function joinClasses(...classes: Array<string | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Returns the composed class list for a button style. Useful for links that
 * should look like buttons, e.g. className={buttonClasses({ size: "sm" })}.
 */
export function buttonClasses({
  variant = "primary",
  size = "md",
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
}): string {
  return joinClasses(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
  );
}

/**
 * Action button in the reference style: compact, bordered, restrained.
 * Primary is the solid black action; secondary is the bordered default.
 * Keyboard focus styling comes from the global :focus-visible rule in
 * globals.css. Lucide icons can be composed as children with class "size-4".
 */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={joinClasses(buttonClasses({ variant, size }), className)}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
