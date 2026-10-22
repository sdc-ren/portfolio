"use client";

import { useCallback, useState } from "react";
import { Button } from "./ui/button";
import { ProfileLocationIntro } from "./profile-location-intro";
import { ProfileSequence } from "./profile-sequence";
import { ActionAnchor } from "./action-link";
import { Github, Linkedin, Mail, Code2, MapPin, RotateCcw } from "lucide-react";
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
  const [replay, setReplay] = useState(0);
  const finishIntro = useCallback(() => setIntroComplete(true), []);
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
        <div className={styles.toolbarActions}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={styles.replayButton}
            aria-label="Replay location intro"
            onClick={() => {
              setIntroComplete(false);
              setReplay((value) => value + 1);
            }}
          >
            <RotateCcw size={13} />
          </Button>
          <img src="/icon.svg" alt="SDC" width={28} height={28} />
        </div>
      </div>
      <div className={styles.scene}>
        {introComplete ? (
          <ProfileSequence profile={profile} />
        ) : (
          <ProfileLocationIntro key={replay} onComplete={finishIntro} />
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
