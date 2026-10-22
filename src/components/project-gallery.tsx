"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { ProjectImage as ImageValue } from "@/features/content/project-assets";
import type { UiLabels } from "@/features/content/ui";
import { Button } from "./ui/button";
import { ActionTooltip } from "./action-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ProjectImage } from "./project-image";
import styles from "./project-gallery.module.scss";

function ThumbnailStrip({
  images,
  labels,
  selectedId,
  opensDialog = false,
  onSelect,
}: {
  images: ImageValue[];
  labels: UiLabels;
  selectedId?: string;
  opensDialog?: boolean;
  onSelect: (id: string, trigger: HTMLButtonElement) => void;
}) {
  const strip = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (selectedId)
      strip.current
        ?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')
        ?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "instant",
        });
  }, [selectedId]);
  return (
    <div
      ref={strip}
      className={styles.thumbnails}
      role="group"
      aria-label={labels.projectGallery}
    >
      {images.map((image, i) => (
        <ActionTooltip
          key={image.id}
          label={`${labels.viewImage} ${i + 1}: ${image.alt}`}
        >
          <button
            type="button"
            className={styles.thumbnail}
            aria-pressed={
              selectedId === undefined ? undefined : image.id === selectedId
            }
            aria-haspopup={opensDialog ? "dialog" : undefined}
            aria-label={`${labels.viewImage} ${i + 1}: ${image.alt}`}
            onClick={(event) => onSelect(image.id, event.currentTarget)}
          >
            <ProjectImage
              src={image.url}
              alt=""
              unavailable={labels.imageUnavailable}
              className={styles.thumbImage}
            />
          </button>
        </ActionTooltip>
      ))}
    </div>
  );
}

/** Card icons defer photos; detail views expose a compact thumbnail strip. */
export function ProjectGallery({
  images,
  labels,
  title,
  coverImageId = "",
  variant = "icon",
}: {
  images: ImageValue[];
  labels: UiLabels;
  title: string;
  coverImageId?: string;
  variant?: "icon" | "thumbnails";
}) {
  const [selectedId, setSelectedId] = useState(coverImageId || images[0]?.id);
  const [open, setOpen] = useState(false);
  const thumbnailTrigger = useRef<HTMLButtonElement | null>(null);
  if (!images.length) return null;
  const index = Math.max(
    0,
    images.findIndex((image) => image.id === selectedId),
  );
  const selected = images[index];
  const move = (delta: number) =>
    setSelectedId(images[(index + delta + images.length) % images.length].id);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {variant === "thumbnails" ? (
        <div className={styles.detailStrip}>
          <ThumbnailStrip
            images={images}
            labels={labels}
            opensDialog
            onSelect={(id, trigger) => {
              thumbnailTrigger.current = trigger;
              setSelectedId(id);
              setOpen(true);
            }}
          />
        </div>
      ) : (
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`${labels.projectGallery}: ${title}`}
            tooltip={`${labels.projectGallery} (${images.length})`}
            onClick={() => setSelectedId(coverImageId || images[0].id)}
          >
            <Images size={18} aria-hidden="true" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        closeLabel={labels.closeDialog}
        closeClassName={styles.closeButton}
        className={styles.lightbox}
        onInteractOutside={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => {
          if (variant === "thumbnails") {
            event.preventDefault();
            thumbnailTrigger.current?.focus();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <header className={styles.viewerHeader}>
          <DialogTitle className={styles.lightboxTitle}>{title}</DialogTitle>
          <span className={styles.position} aria-live="polite">
            {index + 1} / {images.length}
          </span>
        </header>
        <DialogDescription className="sr-only">
          {labels.previousImage} / {labels.nextImage}
        </DialogDescription>
        <div className={styles.stage}>
          <ProjectImage
            src={selected.url}
            alt={selected.alt}
            unavailable={labels.imageUnavailable}
            className={styles.fullImage}
            loading="eager"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`${styles.navigationButton} ${styles.previous}`}
            aria-label={labels.previousImage}
            disabled={images.length < 2}
            onClick={() => move(-1)}
          >
            <ChevronLeft size={24} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={`${styles.navigationButton} ${styles.next}`}
            aria-label={labels.nextImage}
            disabled={images.length < 2}
            onClick={() => move(1)}
          >
            <ChevronRight size={24} />
          </Button>
        </div>
        <footer className={styles.filmstrip}>
          {selected.caption && (
            <p className={styles.caption}>{selected.caption}</p>
          )}
          <ThumbnailStrip
            images={images}
            labels={labels}
            selectedId={selected.id}
            onSelect={setSelectedId}
          />
        </footer>
      </DialogContent>
    </Dialog>
  );
}
