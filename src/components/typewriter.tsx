"use client";

import { useRoleAnimation } from "./role-animation";
import styles from "./typewriter.module.scss";

export function Typewriter() {
  const { visible, roles: texts } = useRoleAnimation();
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
