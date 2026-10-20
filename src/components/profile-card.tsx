"use client";

import { useRoleAnimation } from "./role-animation";
import { ActionAnchor } from "./action-link";
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
  const { visible, logs } = useRoleAnimation();
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
      <div className={styles.editor} aria-hidden="true">
        <p aria-hidden="true">
          <span className={styles.keyword}>const</span> developer = &#123;
        </p>
        <dl className={styles.fields}>
          {[
            ["name", profile.name],
            ["role", visible],
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
                {key === "role" && (
                  <span className={styles.caret} aria-hidden="true" />
                )}
                <span aria-hidden="true">&quot;,</span>
              </dd>
            </div>
          ))}
        </dl>
        <p aria-hidden="true">&#125;;</p>
        <div className={styles.functionCode} aria-hidden="true">
          <p>
            <span className={styles.keyword}>function</span>{" "}
            <span className={styles.functionName}>introduce</span>() &#123;
          </p>
          <p className={styles.indent}>
            <span className={styles.keyword}>return</span> developer.name +
          </p>
          <p className={styles.indent}>
            {" "}
            <span className={styles.string}>&quot; | &quot;</span> +
            developer.role;
          </p>
          <p>&#125;</p>
          <p className={styles.call}>
            console.<span className={styles.functionName}>log</span>
            (introduce());
          </p>
        </div>
      </div>
      <div className={styles.console} aria-hidden="true">
        <p className={styles.consoleTitle}>
          Console <span>stdout</span>
        </p>
        <div className={styles.output}>
          {logs.length ? (
            logs.map((role, index) => (
              <p key={`${index}-${role}`}>
                <span className={styles.prompt}>›</span>
                <span>
                  {profile.name} | {role}
                </span>
              </p>
            ))
          ) : (
            <p>
              <span className={styles.prompt}>›</span>
              <span className={styles.caret} />
            </p>
          )}
        </div>
      </div>
      <p className="sr-only">
        {profile.name}, {profile.role}, {profile.location}
      </p>
      <div className={styles.links}>
        {profile.github && (
          <ActionAnchor href={profile.github} aria-label="GitHub">
            <Github size={17} />
            GitHub
          </ActionAnchor>
        )}
        {profile.linkedin && (
          <ActionAnchor href={profile.linkedin} aria-label="LinkedIn">
            <Linkedin size={17} />
            LinkedIn
          </ActionAnchor>
        )}
        <ActionAnchor href={`mailto:${profile.email}`} aria-label={emailLabel}>
          <Mail size={17} />
        </ActionAnchor>
      </div>
    </aside>
  );
}
