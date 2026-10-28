"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./entrance-intro.module.scss";

const streams = [
  "01<>TS{}AI",
  "FN/0101=>",
  "AGENT{}01",
  "UI<0101/>",
  "REACT=>01",
  "0101VUE{}",
  "BUILD<>01",
  "TS{}0101",
  "01<>NODE",
  "FLOW=>01",
  "0101CSS{}",
  "WEB<>0101",
  "API{}0101",
  "01<CODE>",
  "SHIP=>01",
  "0101AI{}",
];

export function EntranceIntro({
  name,
  role,
  locale,
}: {
  name: string;
  role: string;
  locale: string;
}) {
  const text = `${name} // ${role}`;
  const characters = Array.from(text);
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);
  const [opening, setOpening] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || location.hash) return;
    setVisible(true);
    setCount(0);
    setOpening(false);
    const finish = () => setVisible(false);
    const keydown = (event: KeyboardEvent) => {
      if (["Escape", "Tab", "Enter", " "].includes(event.key)) finish();
    };
    const change = () => {
      if (preference.matches) finish();
    };
    const length = Array.from(text).length;
    // Cap typing time for long localized roles without cutting any text.
    const step = Math.min(35, 2200 / Math.max(1, length));
    const start = performance.now();
    const typing = window.setInterval(() => {
      const next = Math.min(
        length,
        Math.max(0, Math.floor((performance.now() - start - 350) / step)),
      );
      setCount(next);
      if (next === length) clearInterval(typing);
    }, 25);
    const revealAt = 350 + length * step + 450;
    const reveal = window.setTimeout(() => setOpening(true), revealAt);
    const timer = window.setTimeout(finish, revealAt + 550);
    window.addEventListener("keydown", keydown);
    preference.addEventListener("change", change);
    return () => {
      clearInterval(typing);
      clearTimeout(reveal);
      clearTimeout(timer);
      window.removeEventListener("keydown", keydown);
      preference.removeEventListener("change", change);
    };
  }, [text]);
  if (!visible) return null;
  return (
    <div className={styles.intro} data-opening={opening}>
      <div className={styles.top} aria-hidden="true" />
      <div className={styles.bottom} aria-hidden="true" />
      <div className={styles.rain} aria-hidden="true">
        {streams.map((text, index) => (
          <span
            key={index}
            style={
              {
                "--column": index,
                "--delay": `${(index % 5) * -310}ms`,
                "--fall-duration": `${1800 + (index % 4) * 270}ms`,
              } as CSSProperties
            }
          >
            {text}
          </span>
        ))}
      </div>
      <div className={styles.identity} aria-hidden="true">
        <div className={styles.terminal}>
          <span className={styles.reserve}>
            {text}
            <span className={styles.cursor} />
          </span>
          <span className={styles.typed}>
            {characters.slice(0, count).join("")}
            <span className={styles.cursor} />
          </span>
        </div>
      </div>
      <button
        type="button"
        className={styles.skip}
        onClick={() => setVisible(false)}
      >
        {locale.startsWith("vi") ? "Bỏ qua" : "Skip intro"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
