"use client";

import { useState, type ComponentProps } from "react";

/** Only save successful PDF responses; an API error must never become a CV file. */
export function DownloadLink({
  onClick,
  children,
  ...props
}: ComponentProps<"a">) {
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
              !response.headers.get("content-type")?.includes("application/pdf")
            )
              throw new Error("PDF unavailable");
            const blob = await response.blob();
            if ((await blob.slice(0, 5).text()) !== "%PDF-")
              throw new Error("Invalid PDF");
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download =
              response.headers
                .get("content-disposition")
                ?.match(/filename="([^"/\\]+\.pdf)"/i)?.[1] ||
              "dang-chi-son-cv.pdf";
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
          Preparing PDF…
        </span>
      )}
      {error && (
        <span
          role="alert"
          className="absolute right-0 top-full mt-2 w-64 rounded border border-destructive bg-background p-3 text-sm text-destructive shadow"
        >
          Unable to generate PDF. Please try again. / Không thể tạo PDF. Vui
          lòng thử lại.
        </span>
      )}
    </>
  );
}
