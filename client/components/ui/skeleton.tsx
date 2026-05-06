"use client"
import type { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type SkeletonVariant = "default" | "text" | "circle";

const variantClass: Record<SkeletonVariant, string> = {
  default: "w-full min-h-4 rounded-md",
  text: "h-8 w-full rounded-sm",
  circle: "aspect-square rounded-full",
};

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
};

export function Skeleton({
  variant = "default",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={twMerge(
        "bg-muted animate-pulse",
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
