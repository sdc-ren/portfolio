"use client";

import type { ComponentProps } from "react";

/** File transfers do not change routes, so they must bypass the navigation loader. */
export function DownloadLink({ onClick, ...props }: ComponentProps<"a">) {
  return (
    <a
      {...props}
      download
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
    />
  );
}
