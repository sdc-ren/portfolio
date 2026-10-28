"use client";
import { useEffect, useRef, type ReactNode } from "react";
import styles from "./site-header.module.scss";
export function SiteHeader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const resize = () =>
      document.documentElement.style.setProperty(
        "--header-offset",
        `${header.getBoundingClientRect().height + 20}px`,
      );
    const scroll = () => {
      header.dataset.scrolled = String(scrollY > 16);
    };
    resize();
    scroll();
    const observer = new ResizeObserver(resize);
    observer.observe(header);
    addEventListener("scroll", scroll, { passive: true });
    return () => {
      observer.disconnect();
      removeEventListener("scroll", scroll);
      document.documentElement.style.removeProperty("--header-offset");
    };
  }, []);
  return (
    <header ref={ref} className={styles.header}>
      {children}
    </header>
  );
}
