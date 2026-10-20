import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: {
    default: "Dang Chi Son | Software Engineer",
    template: "%s | Dang Chi Son",
  },
  description: "Frontend architecture and AI agent tooling.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
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
