"use client";

import { useCallback, useState, useEffect } from "react";
import { ProfileLocationIntro } from "./profile-location-intro";
import { ProfileSequence } from "./profile-sequence";
import { ActionAnchor } from "./action-link";
import {
  Github,
  Linkedin,
  Mail,
  Code2,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import styles from "./profile-card.module.scss";

export function ProfileCard({
  profile,
  emailLabel,
}: {
  profile: PortfolioContent["profile"];
  emailLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
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
          {introComplete || paused || reduced ? (
            <Code2 size={14} aria-hidden="true" />
          ) : (
            <MapPin size={14} aria-hidden="true" />
          )}{" "}
          {introComplete || paused || reduced ? "profile.ts" : "location.svg"}
        </span>
        <button
          type="button"
          className={styles.pause}
          aria-label={paused ? "Play code animation" : "Pause code animation"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
          disabled={reduced}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <div className={styles.scene}>
        {paused || reduced ? (
          <div className={styles.viewport}>
            <pre className={styles.codeText}>{`const engineer = {
  focus: "Frontend engineering",
  tools: ["TypeScript", "Vue", "React"],
  building: "AI agent tools",
  location: ${JSON.stringify(profile.location)}
};`}</pre>
          </div>
        ) : introComplete ? (
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
