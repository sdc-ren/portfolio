import { EntranceIntro } from "@/components/entrance-intro";
import styles from "@/components/home.module.scss";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { SkillsOverview } from "@/components/skills-overview";
import { experienceBullets } from "@/features/content/experience";
import { ContactSection } from "@/components/contact-section";
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
  const featured = d.projects.filter((project) => project.featured);
  const selectedIds = ["jinjer", "twinci", "localmem", "ivr-studio"];
  const selectedProjects = [
    ...selectedIds.flatMap((id) =>
      featured.filter((project) => project.id === id),
    ),
    ...featured.filter((project) => !selectedIds.includes(project.id)),
  ].slice(0, 4);
  return (
    <main id="main" className="mx-auto max-w-[1440px] px-6">
      <EntranceIntro
        name={d.profile.name}
        role="Senior Frontend Engineer · AI Agent Engineer"
        locale={locale}
      />
      <section className={styles.hero}>
        <Reveal>
          <p className={styles.eyebrow}>
            {d.profile.role} · {d.profile.location}
          </p>
          <h1 className={styles.headline}>{d.profile.tagline}</h1>
          <p className={styles.intro}>{d.profile.summary}</p>
          <ul className={styles.roles} aria-label={d.ui.navCv}>
            {d.roles.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
          <div className={styles.ctas}>
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
        </Reveal>
        <Reveal delay={100} className={styles.visual}>
          <ProfileCard profile={d.profile} emailLabel={d.ui.emailLabel} />
        </Reveal>
      </section>
      <section id="projects" className={styles.section}>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <SectionHeading
              subtitle={d.ui.selectedWork}
              title={d.ui.workHeading}
            />
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {selectedProjects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 2) * 60}>
              <ProjectCard project={p} labels={d.ui} index={i} />
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href={publicPath(locale, "/projects")}>
              {d.ui.allProjects}{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </section>
      <section
        id="experience"
        className={`${styles.section} ${styles.experience}`}
      >
        <div className={styles.experienceIntro}>
          <SectionHeading
            subtitle={d.ui.navExperience}
            title={d.ui.experienceHeading}
          />
          {d.settings.experienceNote && (
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              {d.settings.experienceNote}
            </p>
          )}
        </div>
        <div className={styles.timeline}>
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
                {experienceBullets(e).map(({ id, text }) => (
                  <li key={id}>{text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section id="skills" className={styles.section}>
        <SectionHeading
          subtitle={d.ui.toolkit}
          title={d.ui.toolkitHeading}
          className="mb-8"
        />
        <Reveal>
          <SkillsOverview data={d} locale={locale} />
        </Reveal>
      </section>
      <Reveal>
        <ContactSection profile={d.profile} labels={d.ui} />
      </Reveal>
    </main>
  );
}
