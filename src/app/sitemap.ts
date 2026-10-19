import type { MetadataRoute } from "next";
import { getLocales, getPublished } from "@/features/content/repository";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const locales = await getLocales();
  const rows = await Promise.all(
    locales.map(async (locale) => {
      const d = await getPublished(locale);
      if (!d) return [];
      return [
        `/${locale}`,
        `/${locale}/projects`,
        ...d.projects.map((p) => `/${locale}/projects/${p.id}`),
        ...d.cvs.map((c) => `/${locale}/cv/${c.id}`),
      ].map((p) => ({ url: base + p }));
    }),
  );
  return rows.flat();
}
