import "server-only";
import { cache } from "react";
import { getDb } from "@/lib/db";
import { contentSchema, localeSchema } from "./schema";
export const getPublished = cache(async (locale: string) => {
  if (!localeSchema.safeParse(locale).success) return null;
  const row = await getDb().content.findUnique({
    where: { locale },
    select: { published: true },
  });
  return row?.published ? contentSchema.parse(row.published) : null;
});
export async function getLocales() {
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
