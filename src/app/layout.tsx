import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, siteUrl } from "@/lib/seo";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NextTopLoader
          color="var(--primary)"
          height={3}
          showSpinner={false}
          showForHashAnchor={false}
          shadow={false}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
