"use client";
import { ActionTooltip } from "@/components/action-tooltip";
import { actionLabel } from "@/lib/action-label";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva(
  "motion-button inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
  {
    variants: {
      variant: {
        default: "border border-primary bg-transparent text-primary",
        outline: "border border-border bg-transparent text-foreground",
        ghost: "text-muted-foreground hover:bg-muted",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
      },
      size: { default: "h-11 px-5", sm: "h-9 px-3", icon: "size-9 p-0" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export function Button({
  className,
  variant,
  size,
  asChild = false,
  tooltip,
  title,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    tooltip?: string | false;
  }) {
  const Comp = asChild ? Slot : "button";
  const label =
    tooltip === false
      ? undefined
      : (tooltip ??
        props["aria-label"] ??
        title ??
        actionLabel(props.children));
  return (
    <ActionTooltip label={label}>
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        data-variant={variant ?? "default"}
        {...props}
      />
    </ActionTooltip>
  );
}
export { buttonVariants };
