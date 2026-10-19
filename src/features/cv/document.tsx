import type { PortfolioContent } from "@/features/content/schema";
import { selectByIds } from "@/features/content/schema";
import styles from "./cv.module.scss";
export function CvDocument({
  data,
  variant,
}: {
  data: PortfolioContent;
  variant: string;
}) {
  const cv = data.cvs.find((c) => c.id === variant)!;
  return (
    <article className={styles.sheet}>
      <header>
        <h1>{data.profile.name.toUpperCase()}</h1>
        <p className={styles.role}>{cv.title}</p>
        <p className={styles.muted}>{cv.specialties}</p>
        <p className={styles.muted}>
          {data.profile.location} ·{" "}
          <a href={`mailto:${data.profile.email}`}>{data.profile.email}</a> ·{" "}
          {data.profile.phone}
        </p>
        <p className={styles.muted}>
          {data.profile.github && (
            <a href={data.profile.github}>{data.profile.github}</a>
          )}{" "}
          {data.profile.linkedin && (
            <>
              {" "}
              · <a href={data.profile.linkedin}>{data.profile.linkedin}</a>
            </>
          )}
        </p>
      </header>
      <section>
        <h2>Professional Summary</h2>
        <p>{cv.summary}</p>
      </section>
      <section>
        <h2>Technical Skills</h2>
        <div className={styles.grid}>
          {selectByIds(data.skills, cv.skillIds).map((s) => (
            <p key={s.id}>
              <b>{s.name}:</b> {s.items.join(", ")}
            </p>
          ))}
        </div>
      </section>
      <section>
        <h2>Professional Experience</h2>
        {selectByIds(data.experience, cv.experienceIds).map((e) => (
          <article key={e.id}>
            <h3>
              {e.company} — {e.role}
            </h3>
            <p className={styles.muted}>
              {e.period} · {e.location}
            </p>
            <ul>
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section>
        <h2>Selected Projects</h2>
        {selectByIds(data.projects, cv.projectIds).map((p) => (
          <article key={p.id}>
            <h3>{p.title}</h3>
            <p className={styles.muted}>{p.role}</p>
            {p.repository && <a href={p.repository}>{p.repository}</a>}
            <p className={styles.muted}>{p.tech.join(" · ")}</p>
            <ul>
              {p.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section>
        <h2>Education & Languages</h2>
        {data.education.map((e) => (
          <p key={e.id}>
            <b>{e.institution}</b> — {e.qualification}, {e.year}
          </p>
        ))}
        {data.languages.map((l) => (
          <p key={l.id}>
            <b>{l.name}:</b> {l.proficiency}
          </p>
        ))}
      </section>
    </article>
  );
}
