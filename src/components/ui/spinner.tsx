export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  /** Ring diameter. Default: "sm" (matches button text). */
  size?: SpinnerSize;
  /**
   * Accessible label. Provide one when the spinner is the only indication
   * that something is loading. Omit it inside a button whose text already
   * describes the action (the button exposes aria-busy instead).
   */
  label?: string;
  className?: string;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-8 border-[3px]",
};

/**
 * Rotating ring loading indicator.
 *
 * Built from a circular border with one transparent edge, so it inherits
 * the current text color and works on any surface (solid black buttons,
 * bordered buttons, plain backgrounds). Respects reduced-motion
 * preferences through the global rule in globals.css.
 */
export function Spinner({ size = "sm", label, className }: SpinnerProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={[
        "inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent align-[-0.125em]",
        SIZE_CLASSES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
