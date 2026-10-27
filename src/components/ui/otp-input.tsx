"use client";

import { useEffect, useRef } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";
import {
  clearOtpDigit,
  insertOtpDigits,
  sanitizeOtp,
  setOtpDigit,
} from "@/lib/otp";

export interface OtpInputProps {
  /** Current value: exactly `length` entries, each "" or a single digit. */
  value: string[];
  onChange: (value: string[]) => void;
  /** Number of boxes. Default: 6. */
  length?: number;
  /** Accessible name for the whole group, e.g. "Verification code". */
  label: string;
  /** Accessible name for one box, e.g. "Digit 3 of 6". */
  digitLabel?: (index: number) => string;
  disabled?: boolean;
  /** Draws the error border on every box. */
  invalid?: boolean;
  /** Focuses (and selects) the first box when mounted. */
  autoFocus?: boolean;
}

const BASE_BOX_CLASSES =
  "h-12 w-full min-w-0 rounded-control border bg-surface-field text-center text-base font-semibold text-heading transition-colors duration-150 sm:text-lg";

/**
 * Six single-digit boxes for one-time codes.
 *
 * Behaviour:
 * - Typing a digit fills the box and moves focus forward.
 * - Backspace clears the current box; on an empty box it clears the
 *   previous one and moves back.
 * - Arrow Left/Right move between boxes.
 * - Pasting digits fills from the focused box onward (non-digits ignored).
 * - Mobile: inputMode numeric shows the number keypad and enterKeyHint
 *   labels the keyboard action.
 *
 * The component is fully controlled: the page owns the value array and
 * derives the code string with otpToString().
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  label,
  digitLabel,
  disabled = false,
  invalid = false,
  autoFocus = false,
}: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
      inputRefs.current[0]?.select();
    }
  }, [autoFocus]);

  function focusIndex(index: number) {
    const input = inputRefs.current[index];
    if (!input) {
      return;
    }
    input.focus();
    input.select();
  }

  function handleChange(index: number, raw: string) {
    if (raw === "") {
      // Deletion in this box.
      onChange(clearOtpDigit(value, index));
      return;
    }

    const digits = sanitizeOtp(raw, length);
    if (digits.length === 0) {
      // Non-numeric input: ignore it entirely.
      return;
    }

    if (digits.length > 1) {
      // Autofill or a fast keystroke delivered several digits at once:
      // distribute them from this box.
      onChange(insertOtpDigits(value, index, digits, length));
      focusIndex(Math.min(index + digits.length, length - 1));
      return;
    }

    onChange(setOtpDigit(value, index, digits));
    if (index < length - 1) {
      focusIndex(index + 1);
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      // The current box is empty: clear the previous one and move back.
      event.preventDefault();
      onChange(clearOtpDigit(value, index - 1));
      focusIndex(index - 1);
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
      return;
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusIndex(index + 1);
    }
  }

  function handlePaste(index: number, event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const text = event.clipboardData.getData("text");
    const digits = sanitizeOtp(text, length - index);
    if (digits.length === 0) {
      return;
    }
    onChange(insertOtpDigits(value, index, text, length));
    focusIndex(Math.min(index + digits.length, length - 1));
  }

  return (
    <div role="group" aria-label={label} className="flex gap-1.5 sm:gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          enterKeyHint={index === length - 1 ? "done" : "next"}
          maxLength={length}
          value={value[index] ?? ""}
          disabled={disabled}
          aria-label={digitLabel ? digitLabel(index) : `${label} ${index + 1}`}
          aria-invalid={invalid || undefined}
          onFocus={(event) => event.target.select()}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          className={[
            BASE_BOX_CLASSES,
            invalid ? "border-error" : "border-surface-strong",
            disabled ? "cursor-not-allowed bg-surface-subtle text-muted" : "",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
