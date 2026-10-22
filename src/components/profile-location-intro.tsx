"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "./ui/button";
import { DA_NANG_POINT, VIETNAM_OUTLINE } from "./profile-location-map";
import styles from "./profile-location-intro.module.scss";

/** One short decorative intro. It never requests the visitor's location or map tiles. */
export function ProfileLocationIntro({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const root = useRef<HTMLDivElement | null>(null);
  const skip = useRef<() => void>(() => {});
  const patternId = useId().replace(/:/g, "");
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let finished = false;
    let started = false;
    let context: { revert: () => void } | undefined;
    let observer: IntersectionObserver | undefined;
    let watchdog: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      clearTimeout(watchdog);
      observer?.disconnect();
      onComplete();
    };
    skip.current = finish;
    if (preference.matches) {
      finish();
      return;
    }
    const onPreferenceChange = () => {
      if (preference.matches) finish();
    };
    preference.addEventListener("change", onPreferenceChange);
    async function start() {
      if (started || cancelled || finished) return;
      started = true;
      // Import failure or an unusually slow device must not leave the profile hidden.
      watchdog = setTimeout(finish, 1000);
      try {
        const { gsap } = await import("gsap");
        if (cancelled || finished || !root.current) return;
        clearTimeout(watchdog);
        watchdog = setTimeout(finish, 4500);
        context = gsap.context(() => {
          gsap.set(root.current, { autoAlpha: 1 });
          const camera = root.current!.querySelector("[data-camera]");
          const country = root.current!.querySelector("[data-country-label]");
          const pin = root.current!.querySelector("[data-pin]");
          const ring = root.current!.querySelector("[data-ring]");
          const city = root.current!.querySelector("[data-city-label]");
          const scale = 3.8;
          const tx = 160 - DA_NANG_POINT.x * scale;
          const ty = 82 - DA_NANG_POINT.y * scale;
          gsap
            .timeline({ onComplete: finish })
            .to(country, { opacity: 0, duration: 0.25 }, 0.4)
            .to(
              camera,
              {
                attr: {
                  transform: `matrix(${scale} 0 0 ${scale} ${tx} ${ty})`,
                },
                duration: 1.45,
                ease: "power2.inOut",
              },
              0.3,
            )
            .to(pin, { attr: { opacity: 1 }, duration: 0.3 }, 1.35)
            .fromTo(
              ring,
              { attr: { r: 2 }, opacity: 0.8 },
              { attr: { r: 10 }, opacity: 0, duration: 0.6, repeat: 1 },
              1.4,
            )
            .fromTo(
              city,
              { y: 6, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.3 },
              1.65,
            )
            .to(root.current, { opacity: 0, duration: 0.3 }, 2.55);
        }, root.current);
      } catch {
        finish();
      }
    }
    // On phones the profile card can be below the fold. Start when it is visible.
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            void start();
          }
        },
        { threshold: 0.35 },
      );
      if (root.current) observer.observe(root.current);
    } else {
      void start();
    }
    return () => {
      cancelled = true;
      clearTimeout(watchdog);
      observer?.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      context?.revert();
    };
  }, [onComplete]);

  return (
    <div ref={root} className={styles.intro}>
      <svg className={styles.map} viewBox="0 0 320 186" aria-hidden="true">
        <defs>
          <pattern
            id={patternId}
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="#0f766e"
              strokeOpacity=".07"
              strokeWidth=".7"
            />
          </pattern>
        </defs>
        <rect width="320" height="186" fill={`url(#${patternId})`} />
        <g data-camera transform="matrix(1 0 0 1 0 0)">
          <path
            d={VIETNAM_OUTLINE}
            fill="#d0e8e2"
            stroke="#4f9388"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <g fill="#557d76" fontSize="5" fontFamily="ui-monospace, monospace">
            <circle cx="148.4" cy="37.7" r="1" />
            <text x="151" y="36">
              Ha Noi
            </text>
            <circle cx="157.7" cy="150.9" r="1" />
            <text x="164" y="153">
              Ho Chi Minh City
            </text>
          </g>
          <g data-pin opacity="0">
            <circle
              data-ring
              cx={DA_NANG_POINT.x}
              cy={DA_NANG_POINT.y}
              r="2"
              fill="none"
              stroke="#0f766e"
              strokeWidth=".5"
            />
            <circle
              cx={DA_NANG_POINT.x}
              cy={DA_NANG_POINT.y}
              r="2"
              fill="#0f766e"
              stroke="white"
              strokeWidth=".8"
            />
          </g>
        </g>
      </svg>
      <div data-country-label className={styles.country} aria-hidden="true">
        <span>LOCATION</span>
        <strong>Viet Nam</strong>
        <small>Locating Da Nang…</small>
      </div>
      <div data-city-label className={styles.city} aria-hidden="true">
        <span className={styles.signal} />
        <span>
          <small>BASED IN</small>
          <strong>Da Nang, Vietnam</strong>
        </span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={styles.skip}
        aria-label="Skip location intro"
        onClick={() => skip.current()}
      >
        Skip
      </Button>
    </div>
  );
}
