import { ContactSection } from "@/components/contact-section";
import { ActionTooltip } from "@/components/action-tooltip";
import { pageMetadata } from "@/lib/seo";
import { ProfileCard } from "@/components/profile-card";
import { publicPath } from "@/lib/public-path";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  if (!d) notFound();
  return pageMetadata({
    data: d,
    locale,
    title: d.settings.title,
    description: d.settings.description,
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
    <main id="main" className="mx-auto max-w-[1440px] px-6">
      <section className="grid items-start gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[.12em] text-primary">
            {d.profile.role} · {d.profile.location}
          </p>
          <h1 className="max-w-none text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {d.profile.tagline}
          </h1>
          <p className="mt-5 max-w-4xl text-base leading-7 text-muted-foreground">
            {d.profile.summary}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label={d.ui.navCv}>
            {d.roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
              >
                {role}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={publicPath(locale, "/projects")}>
                {d.ui.exploreWork} <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={publicPath(locale, `/cv/${d.cvs[0].id}`)}>
                {d.ui.viewCv}
              </Link>
            </Button>
          </div>
        </div>
        <ProfileCard profile={d.profile} emailLabel={d.ui.emailLabel} />
      </section>
      <section
        id="projects"
        className="scroll-mt-6 border-t border-border py-12"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest text-primary">
              {d.ui.selectedWork}
            </p>
            <h2 className="text-2xl font-semibold text-foreground">
              {d.ui.workHeading}
            </h2>
          </div>
          <ActionTooltip label={d.ui.allProjects}>
            <Link
              href={publicPath(locale, "/projects")}
              className="text-sm text-muted-foreground"
            >
              {d.ui.allProjects} ↗
            </Link>
          </ActionTooltip>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {d.projects
            .filter((p) => p.featured)
            .map((p, i) => (
              <ProjectCard key={p.id} project={p} labels={d.ui} index={i} />
            ))}
        </div>
      </section>
      <section
        id="experience"
        className="grid gap-10 border-t border-border py-12 md:grid-cols-[1fr_2fr]"
      >
        <div>
          <p className="mb-3 text-xs uppercase tracking-widest text-primary">
            {d.ui.navExperience}
          </p>
          <h2 className="text-2xl font-semibold text-foreground">
            {d.ui.experienceHeading}
          </h2>
        </div>
        <div className="space-y-10">
          {d.experience.map((e) => (
            <article key={e.id} className="border-l border-border pl-6">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                {e.period}
              </p>
              <h3 className="text-xl font-semibold text-foreground">
                {e.role}
              </h3>
              <p className="mb-4 text-sm text-primary">{e.company}</p>
              <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
                {e.highlights.slice(0, 3).map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="border-t border-border py-12">
        <p className="mb-3 text-xs uppercase tracking-widest text-primary">
          {d.ui.toolkit}
        </p>
        <h2 className="mb-8 text-2xl font-semibold text-foreground">
          {d.ui.toolkitHeading}
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {d.skills.map((s) => (
            <div key={s.id}>
              <h3 className="mb-3 font-semibold text-foreground">{s.name}</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                {s.items.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </section>
      <ContactSection profile={d.profile} labels={d.ui} />
    </main>
  );
}
