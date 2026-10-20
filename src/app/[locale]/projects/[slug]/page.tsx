import { pageMetadata } from "@/lib/seo";
import { publicPath } from "@/lib/public-path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublished } from "@/features/content/repository";
import { ProjectDetails } from "@/components/project-details";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const d = await getPublished(locale);
  const p = d?.projects.find((p) => p.id === slug);
  if (!d || !p) notFound();
  return pageMetadata({
    data: d,
    locale,
    path: `/projects/${p.id}`,
    title: `${p.title} | ${d.profile.name}`,
    description: p.summary,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const d = await getPublished(locale);
  const p = d?.projects.find((p) => p.id === slug);
  if (!d || !p) notFound();
  return (
    <main id="main" className="mx-auto max-w-[1440px] px-6 py-16">
      <Link
        href={publicPath(locale, "/projects")}
        className="text-sm text-muted-foreground"
      >
        ← {d.ui.allProjects}
      </Link>
      <p className="mb-5 mt-12 text-xs uppercase tracking-widest text-primary">
        {p.category}
      </p>
      <h1 className="text-2xl font-semibold leading-snug text-foreground sm:text-3xl">
        {p.title}
      </h1>
      <ProjectDetails project={p} labels={d.ui} />
    </main>
  );
}
