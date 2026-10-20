import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getPublished } from "@/features/content/repository";
import { ProjectList } from "@/components/project-list";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const d = await getPublished(locale);
  if (!d) notFound();
  return pageMetadata({
    data: d,
    locale,
    path: "/projects",
    title: `${d.ui.navProjects} | ${d.profile.name}`,
    description: d.ui.projectsDescription,
  });
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const d = await getPublished(locale);
  if (!d) notFound();
  return (
    <main id="main" className="mx-auto max-w-[1440px] px-6 py-16">
      <p className="mb-4 text-xs uppercase tracking-widest text-primary">
        {d.ui.portfolio}
      </p>
      <h1 className="mb-6 text-3xl font-semibold sm:text-4xl text-foreground">
        {d.ui.projectsHeading}
      </h1>
      <p className="mb-10 max-w-3xl text-muted-foreground">
        {d.ui.projectsDescription}
      </p>
      <ProjectList projects={d.projects} labels={d.ui} />
    </main>
  );
}
