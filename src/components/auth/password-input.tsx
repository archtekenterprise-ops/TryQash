"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { useTranslation } from "@/i18n/context";

export interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Visible label text, associated with the input via htmlFor. */
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
 * Password field with an accessible show/hide toggle. Mirrors the styling
 * and aria wiring of the base Input component.
 */
export function PasswordInput({
  label,
  helperText,
  error,
  id,
  required,
  disabled,
  className,
  ...props
}: PasswordInputProps) {
  const t = useTranslation();
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;
  const hasError = Boolean(error);
  const describedBy = hasError ? errorId : helperText ? helperId : undefined;

  const [visible, setVisible] = useState(false);

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

      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          required={required}
          disabled={disabled}
          aria-required={required || undefined}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={joinClasses(
            "h-9 w-full rounded-control border bg-surface-field py-0 pl-3 pr-10 text-sm text-heading transition-colors duration-150 placeholder:text-subtle focus-visible:border-primary disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:text-muted",
            hasError ? "border-error" : "border-surface-strong",
            className,
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={
            visible ? t("field.hidePassword") : t("field.showPassword")
          }
          aria-pressed={visible}
          disabled={disabled}
          className="absolute inset-y-0 right-0 inline-flex w-9 items-center justify-center rounded-r-control text-muted transition-colors hover:text-heading disabled:cursor-not-allowed"
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
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
