import Link from "next/link";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";
import { getPublished } from "@/features/content/repository";
import { Button } from "@/components/ui/button";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const d = await getPublished(locale);
  const p = d?.projects.find((p) => p.id === slug);
  return { title: p?.title, description: p?.summary };
}
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const d = await getPublished(locale);
  const p = d?.projects.find((p) => p.id === slug);
  if (!p) notFound();
  return (
    <main id="main" className="mx-auto max-w-4xl px-6 py-16">
      <Link href={`/${locale}/projects`} className="text-sm text-slate-400">
        ← All projects
      </Link>
      <p className="mb-5 mt-12 text-xs uppercase tracking-widest text-teal-300">
        {p.category}
      </p>
      <h1 className="text-4xl font-semibold text-white md:text-5xl">
        {p.title}
      </h1>
      <p className="mt-6 text-slate-400">{p.role}</p>
      <div className="my-8 flex flex-wrap gap-2">
        {p.tech.map((t) => (
          <span key={t} className="rounded bg-slate-800 px-3 py-1 text-xs">
            {t}
          </span>
        ))}
      </div>
      <div className="mb-12 flex gap-3">
        {p.repository && (
          <Button asChild>
            <a href={p.repository}>Source code ↗</a>
          </Button>
        )}
        {p.demo && (
          <Button asChild variant="outline">
            <a href={p.demo}>Live project ↗</a>
          </Button>
        )}
      </div>
      <div className="prose border-t border-slate-800 pt-10 text-slate-300">
        <Markdown>{p.description}</Markdown>
      </div>
      <h2 className="mb-5 mt-10 text-2xl font-semibold">Contributions</h2>
      <ul className="list-disc space-y-3 pl-5 text-slate-400">
        {p.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </main>
  );
}
