"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import styles from "./project-gallery.module.scss";

export function ProjectImage({
  src,
  alt,
  unavailable,
  className = "",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  unavailable: string;
  className?: string;
  loading?: "eager" | "lazy";
}) {
  const [failedSrc, setFailedSrc] = useState("");
  return failedSrc === src ? (
    <span
      className={`${styles.failed} ${className}`}
      role="img"
      aria-label={`${unavailable}: ${alt}`}
    >
      <ImageOff size={22} aria-hidden="true" />
      <span>{unavailable}</span>
    </span>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );
}
