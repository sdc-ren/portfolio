"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./reveal.module.scss";
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.06 },
    );
    node.dataset.motion = "ready";
    observer.observe(node);
    const show = () => {
      if (preference.matches) {
        node.dataset.visible = "true";
        observer.disconnect();
      }
    };
    preference.addEventListener("change", show);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", show);
      delete node.dataset.motion;
    };
  }, []);
  const style: CSSProperties & { "--reveal-delay": string } = {
    "--reveal-delay": `${Math.min(Math.max(delay, 0), 180)}ms`,
  };
  return (
    <div ref={ref} className={`${styles.reveal} ${className}`} style={style}>
      {children}
    </div>
  );
}
