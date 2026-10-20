import { siteUrl } from "@/lib/seo";
import { publicPath } from "@/lib/public-path";
import type { MetadataRoute } from "next";
import { getLocales, getPublished } from "@/features/content/repository";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  if (!base) return [];
  const locales = await getLocales();
  const rows = await Promise.all(
    locales.map(async (locale) => {
      const d = await getPublished(locale);
      if (!d) return [];
      return [
        publicPath(locale),
        publicPath(locale, "/projects"),
        ...d.projects.map((p) => publicPath(locale, `/projects/${p.id}`)),
        ...d.cvs.map((c) => publicPath(locale, `/cv/${c.id}`)),
      ].map((p) => ({ url: new URL(p, base).href }));
    }),
  );
  return rows.flat();
}
