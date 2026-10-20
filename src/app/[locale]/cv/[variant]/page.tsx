import { DownloadLink } from "@/components/download-link";
import { publicPath } from "@/lib/public-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished } from "@/features/content/repository";
import { CvDocument } from "@/features/cv/document";
import { Button } from "@/components/ui/button";
import styles from "@/features/cv/cv.module.scss";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}) {
  const { locale, variant } = await params;
  const d = await getPublished(locale);
  return { title: d?.cvs.find((c) => c.id === variant)?.title };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; variant: string }>;
}) {
  const { locale, variant } = await params;
  const d = await getPublished(locale);
  if (!d || !d.cvs.some((c) => c.id === variant)) notFound();
  return (
    <main id="main" className="px-4 py-8">
      <div
        className={`${styles.toolbar} mx-auto flex max-w-[900px] flex-wrap items-center justify-between gap-4`}
      >
        {d.cvs.length > 1 ? (
          <nav aria-label={d.ui.cvVersions} className="flex flex-wrap gap-3">
            {d.cvs.map((c) => (
              <Link
                key={c.id}
                href={publicPath(locale, `/cv/${c.id}`)}
                aria-current={c.id === variant ? "page" : undefined}
                className={`text-xs ${c.id === variant ? "text-primary" : "text-muted-foreground"}`}
              >
                {c.title}
              </Link>
            ))}
          </nav>
        ) : (
          <span className="text-sm font-medium">{d.ui.navCv}</span>
        )}
        <Button asChild>
          <DownloadLink href={`/api/cv/${locale}/${variant}`}>
            {d.ui.downloadPdf} ↓
          </DownloadLink>
        </Button>
      </div>
      <CvDocument data={d} variant={variant} />
    </main>
  );
}
