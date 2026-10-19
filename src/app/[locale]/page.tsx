import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublished } from "@/features/content/repository";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const d = await getPublished(locale);
  return { title: d?.settings.title, description: d?.settings.description };
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
    <main id="main" className="mx-auto max-w-6xl px-6">
      <section className="grid gap-12 py-20 md:grid-cols-[1fr_270px] md:py-28">
        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[.25em] text-teal-300">
            {d.profile.role} · {d.profile.location}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
            {d.profile.tagline}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-slate-400">
            {d.profile.summary}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={d.ui.navCv}>
            {d.roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400"
              >
                {role}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/${locale}/projects`}>
                {d.ui.exploreWork} <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/${locale}/cv/${d.cvs[0].id}`}>{d.ui.viewCv}</Link>
            </Button>
          </div>
        </div>
        <aside className="self-end rounded-2xl border border-slate-800 p-6">
          <div className="mb-7 text-6xl font-bold tracking-tighter text-teal-300">
            {d.profile.name
              .split(/\s+/)
              .filter(Boolean)
              .map((word) => word[0])
              .slice(0, 3)
              .join("")}
            <span className="text-slate-600">/</span>
          </div>
          <p className="mb-5 text-sm text-slate-400">
            {d.profile.name}
            <br />
            {d.profile.role}
          </p>
          <div className="flex gap-4 text-slate-300">
            {d.profile.github && (
              <a href={d.profile.github} aria-label="GitHub">
                <Github size={20} />
              </a>
            )}
            {d.profile.linkedin && (
              <a href={d.profile.linkedin} aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            )}
            <a href={`mailto:${d.profile.email}`} aria-label={d.ui.emailLabel}>
              <Mail size={20} />
            </a>
          </div>
        </aside>
      </section>
      <section className="border-t border-slate-800 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-teal-300">
              {d.ui.selectedWork}
            </p>
            <h2 className="text-3xl font-semibold text-white">
              {d.ui.workHeading}
            </h2>
          </div>
          <Link href={`/${locale}/projects`} className="text-sm text-slate-400">
            {d.ui.allProjects} ↗
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {d.projects
            .filter((p) => p.featured)
            .map((p, i) => (
              <ProjectCard key={p.id} project={p} locale={locale} index={i} />
            ))}
        </div>
      </section>
      <section
        id="experience"
        className="grid gap-10 border-t border-slate-800 py-16 md:grid-cols-[1fr_2fr]"
      >
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-teal-300">
            {d.ui.navExperience}
          </p>
          <h2 className="text-3xl font-semibold text-white">
            {d.ui.experienceHeading}
          </h2>
        </div>
        <div className="space-y-10">
          {d.experience.map((e) => (
            <article key={e.id} className="border-l border-slate-700 pl-6">
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">
                {e.period}
              </p>
              <h3 className="text-xl font-semibold text-white">{e.role}</h3>
              <p className="mb-4 text-sm text-teal-300">{e.company}</p>
              <ul className="list-disc space-y-2 pl-4 text-sm text-slate-400">
                {e.highlights.slice(0, 3).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-slate-800 py-16">
        <p className="mb-3 text-xs uppercase tracking-widest text-teal-300">
          {d.ui.toolkit}
        </p>
        <h2 className="mb-8 text-3xl font-semibold text-white">
          {d.ui.toolkitHeading}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {d.skills.map((s) => (
            <div key={s.id}>
              <h3 className="mb-3 font-semibold text-slate-200">{s.name}</h3>
              <p className="text-sm leading-7 text-slate-400">
                {s.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="flex flex-wrap items-center justify-between gap-6 border-t border-slate-800 py-16">
        <div>
          <h2 className="mb-3 text-3xl font-semibold text-white">
            {d.ui.contactHeading}
          </h2>
          <p className="text-slate-400">{d.profile.email}</p>
        </div>
        <Button asChild variant="outline">
          <a href={`mailto:${d.profile.email}`}>
            {d.ui.contactButton} <ArrowRight size={16} />
          </a>
        </Button>
      </section>
    </main>
  );
}
