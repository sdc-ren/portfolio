"use server";
import { revalidatePath } from "next/cache";
import { publicPath } from "@/lib/public-path";
import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { contentSchema, localeSchema } from "@/features/content/schema";
import { z } from "zod";
import { normalizeContentInput } from "@/features/content/normalize";
import { defaultUiForLocale } from "@/features/content/ui";
export async function saveContent(input: unknown) {
  await requireAdmin();
  const parsed = z
    .object({
      locale: localeSchema,
      revision: z.number().int().nonnegative(),
      publish: z.boolean(),
      data: z.preprocess(normalizeContentInput, contentSchema),
    })
    .safeParse(input);
  if (!parsed.success)
    return {
      ok: false,
      error: parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; "),
    };
  const { locale, revision, publish, data } = parsed.data;
  const result = await getDb().content.updateMany({
    where: { locale, revision },
    data: {
      draft: data,
      revision: { increment: 1 },
      ...(publish ? { published: data, publishedAt: new Date() } : {}),
    },
  });
  if (result.count !== 1)
    return {
      ok: false,
      error: "Content changed in another tab. Reload before saving.",
    };
  if (publish) revalidatePath(publicPath(locale), "layout");
  return { ok: true, revision: revision + 1 };
}
export async function createLocale(input: unknown) {
  await requireAdmin();
  const { locale, source } = z
    .object({ locale: localeSchema, source: localeSchema })
    .parse(input);
  const db = getDb();
  const row = await db.content.findUnique({ where: { locale: source } });
  if (!row) return { ok: false, error: "Source language not found." };
  const draft = contentSchema.parse(row.draft);
  draft.ui = defaultUiForLocale(locale);
  draft.settings.languageLabel =
    locale === "vi" ? "Tiếng Việt" : locale.toUpperCase();
  try {
    await db.content.create({ data: { locale, draft } });
  } catch (e) {
    if (e instanceof Error && "code" in e && e.code === "P2002")
      return { ok: false, error: "Language already exists." };
    throw e;
  }
  revalidatePath("/admin");
  return { ok: true };
}
