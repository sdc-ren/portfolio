import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { contentSchema, localeSchema } from "./schema";
import initial from "@/data/initial-content.json";
export const isDemo = () => process.env.DEMO_MODE === "true";
export const getPublished = cache(async (locale: string) => {
  if (!localeSchema.safeParse(locale).success) return null;
  if (isDemo()) return locale === "en" ? contentSchema.parse(initial) : null;
  const row = await getDb().content.findUnique({
    where: { locale },
    select: { published: true },
  });
  return row?.published ? contentSchema.parse(row.published) : null;
});
export async function getLocales() {
  if (isDemo()) return ["en"];
  const rows = await getDb().content.findMany({
    select: { locale: true, published: true },
  });
  return rows.filter((r) => r.published !== null).map((r) => r.locale);
}

export const getLanguageOptions = cache(async () => {
  const locales = await getLocales();
  const rows = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      content: await getPublished(locale),
    })),
  );
  return rows.flatMap(({ locale, content }) =>
    content ? [{ locale, label: content.settings.languageLabel }] : [],
  );
});
