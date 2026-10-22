"use client";

import { useEffect, useState } from "react";
import type { PortfolioContent } from "@/features/content/schema";
import { useRoleAnimation } from "./role-animation";
import styles from "./profile-card.module.scss";

/** Three scenes share one fixed viewport instead of stacking code and output. */
export function ProfileSequence({
  profile,
  enabled = true,
}: {
  profile: PortfolioContent["profile"];
  enabled?: boolean;
}) {
  const { roles } = useRoleAnimation();
  const rolesKey = JSON.stringify(roles);
  const [frame, setFrame] = useState({ scene: 0, text: "" });
  useEffect(() => {
    if (!enabled) return;
    const phrases: string[] = JSON.parse(rolesKey);
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setTimeout>;
    function restart() {
      clearTimeout(timer);
      let roleIndex = 0;
      let scene = 0;
      let character = 0;
      function scenes() {
        const role = phrases[roleIndex] || profile.role;
        return [
          `const developer = {\n  name: ${JSON.stringify(profile.name)},\n  role: ${JSON.stringify(role)},\n  location: ${JSON.stringify(profile.location)}\n};`,
          'function introduce() {\n  return developer.name +\n    " | " + developer.role;\n}\n\nconsole.log(introduce());',
          `› ${profile.name} | ${role}`,
        ];
      }
      if (preference.matches) {
        setFrame({ scene: 0, text: scenes()[0] });
        return;
      }
      setFrame({ scene: 0, text: "" });
      function tick() {
        const text = Array.from(scenes()[scene]);
        character++;
        setFrame({ scene, text: text.slice(0, character).join("") });
        let delay = scene === 2 ? 28 : 22;
        if (character >= text.length) {
          delay = scene === 2 ? 2400 : 1000;
          scene = (scene + 1) % 3;
          if (scene === 0)
            roleIndex = (roleIndex + 1) % Math.max(phrases.length, 1);
          character = 0;
        }
        timer = setTimeout(tick, delay);
      }
      timer = setTimeout(tick, 250);
    }
    restart();
    preference.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", restart);
    };
  }, [enabled, rolesKey, profile.name, profile.role, profile.location]);

  const tokens = frame.text.split(
    /("(?:[^"\\]|\\.)*"|\b(?:const|function|return|console|log|introduce)\b)/g,
  );
  return (
    <div className={styles.viewport} aria-hidden="true">
      {frame.scene === 2 && (
        <p className={styles.consoleTitle}>
          Console <span>stdout</span>
        </p>
      )}
      <pre className={frame.scene === 2 ? styles.logText : styles.codeText}>
        {tokens.map((token, index) => (
          <span
            key={index}
            className={
              token.startsWith('"')
                ? styles.string
                : /^(const|function|return)$/.test(token)
                  ? styles.keyword
                  : /^(introduce|log)$/.test(token)
                    ? styles.functionName
                    : undefined
            }
          >
            {token}
          </span>
        ))}
        <span className={styles.caret} />
      </pre>
    </div>
  );
}
