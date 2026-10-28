"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUp,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import { publicPath } from "@/lib/public-path";
import styles from "./floating-actions.module.scss";

export function FloatingActions({
  profile,
  locale,
}: {
  profile: PortfolioContent["profile"];
  locale: string;
}) {
  const pathname = usePathname();
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const vi = locale.startsWith("vi");
  const channels = [
    {
      href: profile.email ? `mailto:${profile.email}` : "",
      label: "Email",
      detail: profile.email,
      Icon: Mail,
    },
    { href: profile.linkedin, label: "LinkedIn", detail: "", Icon: Linkedin },
    { href: profile.github, label: "GitHub", detail: "", Icon: Github },
    {
      href: profile.phone.trim()
        ? `tel:${profile.phone.replace(/[^+\d]/g, "")}`
        : "",
      label: vi ? "Điện thoại" : "Phone",
      detail: profile.phone,
      Icon: Phone,
    },
  ].filter((channel) => channel.href);

  useEffect(() => {
    setOpen(false);
    setContactVisible(false);
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const observer =
      pathname === publicPath(locale) &&
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            ([entry]) => {
              setContactVisible(entry.isIntersecting);
              if (entry.isIntersecting) {
                // Keep keyboard focus visible when a focused quick-link panel disappears.
                if (
                  root.current?.contains(document.activeElement) &&
                  document.activeElement !==
                    root.current.querySelector("[data-top]")
                ) {
                  const heading = document.getElementById("contact-heading");
                  heading?.setAttribute("tabindex", "-1");
                  heading?.focus({ preventScroll: true });
                }
                setOpen(false);
              }
            },
            { rootMargin: "0px 0px 80px 0px", threshold: 0 },
          )
        : null;
    const bindContact = () => {
      const contact = document.getElementById("contact");
      if (!contact || !observer) return false;
      observer.observe(contact);
      return true;
    };
    // Route content can stream in after the shared layout hydrates.
    const mutations = observer
      ? new MutationObserver(() => {
          if (bindContact()) mutations?.disconnect();
        })
      : null;
    if (!bindContact())
      mutations?.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      mutations?.disconnect();
    };
  }, [pathname, locale]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className={styles.actions}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      {!contactVisible && channels.length > 0 && (
        <div className={styles.connect}>
          <button
            ref={trigger}
            type="button"
            className={`${styles.button} ${styles.fab}`}
            aria-label={
              vi
                ? open
                  ? "Đóng kết nối nhanh"
                  : "Mở kết nối nhanh"
                : open
                  ? "Close quick connect"
                  : "Open quick connect"
            }
            aria-expanded={open}
            aria-controls={open ? panelId : undefined}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={21} aria-hidden="true" />
            ) : (
              <MessageCircle size={21} aria-hidden="true" />
            )}
          </button>
          {open && (
            <nav
              id={panelId}
              className={styles.panel}
              aria-label={vi ? "Kết nối nhanh" : "Quick connect"}
            >
              {channels.map(({ href, label, detail, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  onClick={() => {
                    setOpen(false);
                    trigger.current?.focus();
                  }}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span>
                    {label}
                    {detail && <small>{detail}</small>}
                  </span>
                </a>
              ))}
            </nav>
          )}
        </div>
      )}
      {scrolled && (
        <button
          data-top
          type="button"
          className={styles.button}
          aria-label={vi ? "Lên đầu trang" : "Back to top"}
          title={vi ? "Lên đầu trang" : "Back to top"}
          onClick={() => {
            window.scrollTo({
              top: 0,
              behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "instant"
                : "smooth",
            });
          }}
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
