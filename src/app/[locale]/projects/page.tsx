import { notFound } from "next/navigation";
import { getPublished } from "@/features/content/repository";
import { ProjectList } from "@/components/project-list";
export const metadata = { title: "Projects" };
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const d = await getPublished(locale);
  if (!d) notFound();
  return (
    <main id="main" className="mx-auto max-w-6xl px-6 py-16">
      <p className="mb-4 text-xs uppercase tracking-widest text-teal-300">
        Portfolio
      </p>
      <h1 className="mb-6 text-5xl font-semibold text-white">
        Selected projects.
      </h1>
      <p className="mb-10 max-w-xl text-slate-400">
        Product engineering, frontend leadership and open-source developer
        tools.
      </p>
      <ProjectList projects={d.projects} locale={locale} />
    </main>
  );
}
