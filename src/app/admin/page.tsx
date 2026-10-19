import { requireAdmin } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { contentSchema, localeSchema } from "@/features/content/schema";
import { Editor } from "@/features/admin/editor";
import { logout } from "./login/actions";
import { Button } from "@/components/ui/button";
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
    <main id="main" className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-teal-300">
            Content studio
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            Your work, your words.
          </h1>
        </div>
        <form action={logout}>
          <Button variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </header>
      <Editor
        key={locale}
        locale={locale}
        locales={locales.map((l) => l.locale)}
        initial={contentSchema.parse(row.draft)}
        revision={row.revision}
        publishedAt={row.publishedAt?.toISOString() ?? null}
      />
    </main>
  );
}
