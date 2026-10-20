import { DownloadLink } from "@/components/download-link";
import { Download } from "lucide-react";
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
    <main id="main" className={styles.page}>
      <CvDocument
        data={d}
        variant={variant}
        actions={
          <Button asChild variant="ghost" size="sm" className="size-10 p-0">
            <DownloadLink
              href={`/api/cv/${locale}/${variant}`}
              aria-label={d.ui.downloadPdf}
              title={d.ui.downloadPdf}
            >
              <Download size={20} aria-hidden="true" />
            </DownloadLink>
          </Button>
        }
      />
    </main>
  );
}
