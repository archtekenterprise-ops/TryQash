import { useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label text. Always rendered and associated via htmlFor. */
  label: string;
  /** Optional helper text shown below the field. */
  helperText?: string;
  /**
   * Validation message. When set, the field shows error styling and exposes
   * aria-invalid; the message is referenced via aria-describedby.
   */
  error?: string;
}

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Labelled text input with helper text and validation message support.
 * The label is programmatically associated with the input, and helper/error
 * text is wired through aria-describedby.
 */
export function Input({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const describedBy = hasError ? errorId : helperText ? helperId : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-heading">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-error-foreground">
            *
          </span>
        ) : null}
      </label>

      <input
        id={inputId}
        required={required}
        disabled={disabled}
        aria-required={required || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={joinClasses(
          "h-9 w-full rounded-control border bg-surface-field px-3 text-sm text-heading transition-colors duration-150 placeholder:text-subtle focus-visible:border-primary disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted",
          hasError ? "border-error" : "border-surface-strong",
          className,
        )}
        {...props}
      />

      {hasError ? (
        <p id={errorId} className="text-sm text-error-foreground">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
