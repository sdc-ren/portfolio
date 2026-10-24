"use client";

import { useState, type ComponentProps } from "react";

/** Only save successful export responses; an API error must never become a CV file. */
export function DownloadLink({
  onClick,
  format = "pdf",
  children,
  ...props
}: ComponentProps<"a"> & { format?: "pdf" | "md" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  return (
    <>
      <a
        {...props}
        download
        aria-busy={busy}
        aria-disabled={busy || undefined}
        onClick={async (event) => {
          event.stopPropagation();
          onClick?.(event);
          if (event.defaultPrevented) return;
          event.preventDefault();
          if (busy || !props.href) return;
          setBusy(true);
          setError(false);
          try {
            const response = await fetch(props.href, { cache: "no-store" });
            if (
              !response.ok ||
              !response.headers
                .get("content-type")
                ?.includes(
                  format === "pdf" ? "application/pdf" : "text/markdown",
                )
            )
              throw new Error("Export unavailable");
            const blob = await response.blob();
            if (format === "pdf" && (await blob.slice(0, 5).text()) !== "%PDF-")
              throw new Error("Invalid PDF");
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =
              response.headers
                .get("content-disposition")
                ?.match(
                  format === "pdf"
                    ? /filename="([^"/\\]+\.pdf)"/i
                    : /filename="([^"/\\]+\.md)"/i,
                )?.[1] || `dang-chi-son-cv.${format}`;
            document.body.append(link);
            link.click();
            link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          } catch {
            setError(true);
          } finally {
            setBusy(false);
          }
        }}
      >
        {children}
      </a>
      {busy && (
        <span
          role="status"
          className="absolute right-0 top-full mt-2 w-64 rounded bg-background p-3 text-sm shadow"
        >
          Preparing {format === "pdf" ? "PDF" : "Markdown"}…
        </span>
      )}
      {error && (
        <span
          role="alert"
          className="absolute right-0 top-full mt-2 w-64 rounded border border-destructive bg-background p-3 text-sm text-destructive shadow"
        >
          Unable to download {format === "pdf" ? "PDF" : "Markdown"}. Please try
          again. / Không thể tải CV. Vui lòng thử lại.
        </span>
      )}
    </>
  );
}
