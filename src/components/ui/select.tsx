import { ChevronDown } from "lucide-react";
import { useId } from "react";
import type { SelectHTMLAttributes } from "react";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Visible label text, associated with the select via htmlFor. */
  label: string;
  /** Optional helper text shown below the field. */
  helperText?: string;
  /** Validation message; enables error styling and aria-invalid. */
  error?: string;
}

function joinClasses(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Labelled select with the same styling and aria wiring as Input.
 * Options are passed as children (<option> elements).
 */
export function Select({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  className,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const helperId = `${selectId}-helper`;
  const errorId = `${selectId}-error`;
  const hasError = Boolean(error);
  const describedBy = hasError ? errorId : helperText ? helperId : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-heading">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-error-foreground">
            *
          </span>
        ) : null}
      </label>

      <div className="relative">
        <select
          id={selectId}
          required={required}
          disabled={disabled}
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={joinClasses(
            "h-9 w-full appearance-none rounded-control border bg-surface-field py-0 pl-3 pr-10 text-sm text-heading transition-colors duration-150 focus-visible:border-primary disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted",
            hasError ? "border-error" : "border-surface-strong",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-3 my-auto size-4 text-muted"
        />
      </div>

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
