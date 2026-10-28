"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "./entrance-intro.module.scss";

const sessionKey = "portfolio:intro:v1";
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
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || location.hash || window.scrollY > 0) return;
    try {
      if (sessionStorage.getItem(sessionKey)) return;
    } catch {
      /* Storage restrictions must not block the page. */
    }
    setVisible(true);
    const finish = () => {
      setVisible(false);
      try {
        sessionStorage.setItem(sessionKey, "seen");
      } catch {
        /* Optional storage. */
      }
    };
    const keydown = (event: KeyboardEvent) => {
      if (["Escape", "Tab", "Enter", " "].includes(event.key)) finish();
    };
    const change = () => {
      if (preference.matches) finish();
    };
    const timer = window.setTimeout(
      finish,
      matchMedia("(max-width: 640px)").matches ? 1550 : 1900,
    );
    window.addEventListener("keydown", keydown);
    preference.addEventListener("change", change);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", keydown);
      preference.removeEventListener("change", change);
    };
  }, []);
  const skip = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(sessionKey, "seen");
    } catch {
      /* Optional storage. */
    }
  };
  if (!visible) return null;
  return (
    <div className={styles.intro}>
      <div className={styles.top} aria-hidden="true" />
      <div className={styles.bottom} aria-hidden="true" />
      <div className={styles.rain} aria-hidden="true">
        {streams.map((text, index) => (
          <span
            key={index}
            style={
              {
                "--column": index,
                "--delay": `${(index % 5) * -95}ms`,
              } as CSSProperties
            }
          >
            {text}
          </span>
        ))}
      </div>
      <div className={styles.identity} aria-hidden="true">
        <span className={styles.name}>{name}</span>
        <span className={styles.divider} />
        <span className={styles.role}>{role}</span>
      </div>
      <button type="button" className={styles.skip} onClick={skip}>
        {locale.startsWith("vi") ? "Bỏ qua" : "Skip intro"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
