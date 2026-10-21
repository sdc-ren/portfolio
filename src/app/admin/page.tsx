import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { contentSchema, localeSchema } from "@/features/content/schema";
import { Editor } from "@/features/admin/editor";
import { cookies } from "next/headers";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Portfolio administration",
  robots: { index: false, follow: false },
};
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const locale = localeSchema.safeParse(query.locale ?? "en").success
    ? (query.locale ?? "en")
    : "en";
  const db = getDb();
  const [row, locales] = await Promise.all([
    db.content.findUnique({ where: { locale } }),
    db.content.findMany({ select: { locale: true } }),
  ]);
  if (!row)
    return (
      <main id="main" className="p-12">
        No content found. Run the seed command first.
      </main>
    );
  return (
    <Editor
      key={locale}
      locale={locale}
      locales={locales.map((l) => l.locale)}
      initial={contentSchema.parse(row.draft)}
      revision={row.revision}
      publishedAt={row.publishedAt?.toISOString() ?? null}
      defaultSidebarOpen={
        (await cookies()).get("sidebar_state")?.value !== "false"
      }
    />
  );
}
