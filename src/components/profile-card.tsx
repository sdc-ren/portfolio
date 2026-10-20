import { Github, Linkedin, Mail, Code2 } from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import styles from "./profile-card.module.scss";

export function ProfileCard({
  profile,
  emailLabel,
}: {
  profile: PortfolioContent["profile"];
  emailLabel: string;
}) {
  return (
    <aside className={styles.card} aria-label={profile.name}>
      <div className={styles.toolbar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.filename}>
          <Code2 size={14} aria-hidden="true" /> profile.ts
        </span>
        <img src="/icon.svg" alt="SDC" width={28} height={28} />
      </div>
      <div className={styles.editor}>
        <p aria-hidden="true">
          <span className={styles.keyword}>const</span> developer = &#123;
        </p>
        <dl className={styles.fields}>
          {[
            ["name", profile.name],
            ["role", profile.role],
            ["location", profile.location],
          ].map(([key, value]) => (
            <div key={key}>
              <dt>
                {key}
                <span aria-hidden="true">:</span>
              </dt>
              <dd>
                <span aria-hidden="true">&quot;</span>
                {value}
                <span aria-hidden="true">&quot;,</span>
              </dd>
            </div>
          ))}
        </dl>
        <p aria-hidden="true">
          &#125;;
          <span className={styles.caret} />
        </p>
      </div>
      <div className={styles.links}>
        {profile.github && (
          <a href={profile.github} aria-label="GitHub">
            <Github size={17} />
            GitHub
          </a>
        )}
        {profile.linkedin && (
          <a href={profile.linkedin} aria-label="LinkedIn">
            <Linkedin size={17} />
            LinkedIn
          </a>
        )}
        <a href={`mailto:${profile.email}`} aria-label={emailLabel}>
          <Mail size={17} />
        </a>
      </div>
    </aside>
  );
}
