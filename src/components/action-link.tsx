"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { actionLabel } from "@/lib/action-label";
import { ActionTooltip } from "./action-tooltip";

export function ActionLink({
  tooltip,
  title,
  ...props
}: ComponentProps<typeof Link> & { tooltip?: string }) {
  const label =
    tooltip ?? props["aria-label"] ?? title ?? actionLabel(props.children);
  return (
    <ActionTooltip label={label}>
      <Link {...props} />
    </ActionTooltip>
  );
}

export function ActionAnchor({ title, ...props }: ComponentProps<"a">) {
  const label = props["aria-label"] ?? title ?? actionLabel(props.children);
  return (
    <ActionTooltip label={label}>
      <a {...props} />
    </ActionTooltip>
  );
}
