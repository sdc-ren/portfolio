"use client";

import { useCallback, useState } from "react";
import { ProfileLocationIntro } from "./profile-location-intro";
import { ProfileSequence } from "./profile-sequence";
import { ActionAnchor } from "./action-link";
import { Github, Linkedin, Mail, Code2, MapPin } from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import styles from "./profile-card.module.scss";

export function ProfileCard({
  profile,
  emailLabel,
}: {
  profile: PortfolioContent["profile"];
  emailLabel: string;
}) {
  const [introComplete, setIntroComplete] = useState(false);
  const [cycle, setCycle] = useState(0);
  const finishIntro = useCallback(() => setIntroComplete(true), []);
  const finishSequence = useCallback(() => {
    setIntroComplete(false);
    setCycle((value) => value + 1);
  }, []);
  return (
    <aside className={styles.card} aria-label={profile.name}>
      <div className={styles.toolbar}>
        <span className={styles.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={styles.filename}>
          {introComplete ? (
            <Code2 size={14} aria-hidden="true" />
          ) : (
            <MapPin size={14} aria-hidden="true" />
          )}{" "}
          {introComplete ? "profile.ts" : "location.svg"}
        </span>
        <img src="/icon.svg" alt="SDC" width={28} height={28} />
      </div>
      <div className={styles.scene}>
        {introComplete ? (
          <ProfileSequence
            profile={profile}
            cycle={cycle}
            onComplete={finishSequence}
          />
        ) : (
          <ProfileLocationIntro onComplete={finishIntro} />
        )}
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
