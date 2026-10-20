"use client";

import { useEffect, useState } from "react";
import styles from "./typewriter.module.scss";

export function Typewriter({ texts }: { texts: readonly string[] }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phrases = texts.filter(Boolean);
    let phrase = 0;
    let characters = Array.from(phrases[phrase] ?? "");
    let timer: ReturnType<typeof setTimeout>;

    function restart() {
      clearTimeout(timer);
      phrase = 0;
      characters = Array.from(phrases[phrase] ?? "");
      setVisible(preference.matches ? (phrases[0] ?? "") : "");
      if (preference.matches) return;
      let index = 0;
      let deleting = false;
      function tick() {
        index += deleting ? -1 : 1;
        setVisible(characters.slice(0, index).join(""));
        let delay = deleting ? 45 : 85;
        if (index === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
          characters = Array.from(phrases[phrase]);
          delay = 450;
        } else if (index === characters.length) {
          deleting = true;
          delay = 1800;
        }
        timer = setTimeout(tick, delay);
      }
      if (characters.length) timer = setTimeout(tick, 250);
    }

    restart();
    preference.addEventListener("change", restart);
    return () => {
      clearTimeout(timer);
      preference.removeEventListener("change", restart);
    };
  }, [texts]);

  const first = texts[0] ?? "";
  const longest = texts.reduce(
    (result, text) =>
      Array.from(text).length > Array.from(result).length ? text : result,
    "",
  );
  return (
    <span className={styles.typewriter}>
      <span className="sr-only">{texts.join(" / ")}</span>
      <span className={styles.measure} aria-hidden="true">
        {longest}
      </span>
      <span className={styles.animated} aria-hidden="true">
        {visible}
        <span className={styles.cursor} />
      </span>
      <span className={styles.static} aria-hidden="true">
        {first}
      </span>
    </span>
  );
}
