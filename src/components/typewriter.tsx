"use client";

import { useEffect, useState } from "react";
import styles from "./typewriter.module.scss";

export function Typewriter({ text }: { text: string }) {
  const [visible, setVisible] = useState("");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const characters = Array.from(text);
    let timer: ReturnType<typeof setTimeout>;

    function restart() {
      clearTimeout(timer);
      setVisible(preference.matches ? text : "");
      if (preference.matches) return;
      let index = 0;
      let deleting = false;
      function tick() {
        index += deleting ? -1 : 1;
        setVisible(characters.slice(0, index).join(""));
        let delay = deleting ? 45 : 85;
        if (index === 0) {
          deleting = false;
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
  }, [text]);

  return (
    <span className={styles.typewriter}>
      <span className="sr-only">{text}</span>
      <span className={styles.measure} aria-hidden="true">
        {text}
      </span>
      <span className={styles.animated} aria-hidden="true">
        {visible}
        <span className={styles.cursor} />
      </span>
      <span className={styles.static} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
