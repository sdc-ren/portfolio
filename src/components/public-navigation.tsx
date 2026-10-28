"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ActionLink } from "./action-link";
import styles from "./header-nav.module.scss";
export function PublicNavigation({
  items,
}: {
  items: { href: string; label: string; section?: string }[];
}) {
  const pathname = usePathname();
  const [active, setActive] = useState("");
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--header-offset",
          ),
        ) || 140;
      let next = "";
      for (const item of items) {
        if (!item.section) continue;
        const node = document.getElementById(item.section);
        if (node && node.getBoundingClientRect().top <= offset + 80)
          next = item.section;
      }
      setActive(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname, items]);
  return (
    <div className={styles.navigation}>
      {items.map((item) => {
        const selected = item.section
          ? active === item.section ||
            (item.section === "projects" && /\/projects(?:\/|$)/.test(pathname))
          : pathname === item.href ||
            (item.href.includes("/cv/") && pathname.includes("/cv/"));
        return (
          <ActionLink
            key={item.href}
            className={styles.link}
            href={item.href}
            aria-current={
              selected ? (item.section ? "location" : "page") : undefined
            }
          >
            {item.label}
          </ActionLink>
        );
      })}
    </div>
  );
}
