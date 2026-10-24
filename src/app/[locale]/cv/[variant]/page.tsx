import { pageMetadata } from "@/lib/seo";
import { DownloadLink } from "@/components/download-link";
import { Download, FileText } from "lucide-react";
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
  const cv = d?.cvs.find((c) => c.id === variant);
  if (!d || !cv) notFound();
  return pageMetadata({
    data: d,
    locale,
    path: `/cv/${cv.id}`,
    title: `${d.ui.navCv} | ${d.profile.name}`,
    description: cv.summary,
  });
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
          <>
            {(["pdf", "md"] as const).map((format) => {
              const label =
                format === "pdf" ? d.ui.downloadPdf : d.ui.downloadMarkdown;
              return (
                <Button
                  key={format}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={styles.downloadButton}
                  tooltip={label}
                >
                  <DownloadLink
                    href={`/api/cv/${locale}/${variant}${format === "md" ? "/markdown" : ""}`}
                    format={format}
                    aria-label={label}
                  >
                    <FileText size={16} aria-hidden="true" />
                    <span>{format.toUpperCase()}</span>
                    <Download size={13} aria-hidden="true" />
                  </DownloadLink>
                </Button>
              );
            })}
          </>
        }
      />
    </main>
  );
}
