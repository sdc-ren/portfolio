import type { Metadata } from "next";
import type { PortfolioContent } from "@/features/content/schema";
import { publicPath } from "./public-path";

export const DEFAULT_TITLE = "Dang Chi Son | Senior Software Engineer";
export const DEFAULT_DESCRIPTION =
  "Senior Software Engineer in Da Nang, Vietnam, with 12 years of experience in frontend architecture, technical leadership, and practical AI agent tooling.";

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  return value ? new URL(new URL(value).origin) : undefined;
}

export function metaDescription(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= 160) return normalized;
  const excerpt = normalized.slice(0, 157);
  return `${excerpt.slice(0, excerpt.lastIndexOf(" ") > 0 ? excerpt.lastIndexOf(" ") : excerpt.length)}…`;
}

/** Complete page metadata prevents parent titles and sharing descriptions leaking into child routes. */
export function pageMetadata({
  data,
  locale,
  path = "",
  title,
  description,
}: {
  data: PortfolioContent;
  locale: string;
  path?: string;
  title: string;
  description: string;
}): Metadata {
  const base = siteUrl();
  const canonical = base ? new URL(publicPath(locale, path), base) : undefined;
  const summary = metaDescription(description);
  return {
    title: { absolute: title },
    description: summary,
    authors: [{ name: data.profile.name }],
    creator: data.profile.name,
    ...(base ? { metadataBase: base } : {}),
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      type: "website",
      title,
      description: summary,
      siteName: data.profile.name,
      ...(locale === "en" || locale === "vi" || locale.includes("-")
        ? {
            locale:
              locale === "en"
                ? "en_US"
                : locale === "vi"
                  ? "vi_VN"
                  : locale.replace("-", "_"),
          }
        : {}),
      ...(canonical ? { url: canonical } : {}),
    },
    twitter: { card: "summary", title, description: summary },
    robots: { index: true, follow: true },
  };
}
