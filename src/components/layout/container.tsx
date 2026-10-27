import type { HTMLAttributes } from "react";

export type ContainerMaxWidth = "sm" | "md" | "lg";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Content width cap. sm = 48rem (reading measure), md = 64rem,
   * lg = 72rem (default page width).
   */
  maxWidth?: ContainerMaxWidth;
}

const MAX_WIDTH_CLASSES: Record<ContainerMaxWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
};

/**
 * Responsive page container: centered, capped width, and consistent
 * horizontal padding (16px mobile, 24px tablet, 32px desktop).
 */
export function Container({
  maxWidth = "lg",
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        MAX_WIDTH_CLASSES[maxWidth],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
