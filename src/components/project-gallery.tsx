"use client";

import { useId, useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
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

export function ProjectGallery({
  images,
  labels,
  title,
}: {
  images: ImageValue[];
  labels: UiLabels;
  title: string;
}) {
  const id = useId();
  const [selectedId, setSelectedId] = useState(images[0]?.id);
  if (!images.length) return null;
  const index = Math.max(
    0,
    images.findIndex((image) => image.id === selectedId),
  );
  const selected = images[index];
  const move = (delta: number) =>
    setSelectedId(images[(index + delta + images.length) % images.length].id);
  return (
    <section className={styles.gallery} aria-label={labels.projectGallery}>
      <Dialog>
        <ActionTooltip label={labels.viewImage}>
          <DialogTrigger asChild>
            <button
              type="button"
              className={styles.hero}
              aria-label={`${labels.viewImage}: ${selected.alt}`}
            >
              <ProjectImage
                src={selected.url}
                alt={selected.alt}
                unavailable={labels.imageUnavailable}
                className={styles.mainImage}
              />
              <span className={styles.expand}>
                <Expand size={18} aria-hidden="true" />
              </span>
            </button>
          </DialogTrigger>
        </ActionTooltip>
        <DialogContent
          closeLabel={labels.closeDialog}
          className={styles.lightbox}
          onPointerDownOutside={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}
        >
          <DialogTitle className={styles.lightboxTitle}>
            {title} · {labels.projectGallery}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {labels.previousImage} / {labels.nextImage}
          </DialogDescription>
          <ProjectImage
            src={selected.url}
            alt={selected.alt}
            unavailable={labels.imageUnavailable}
            className={styles.fullImage}
            loading="eager"
          />
          <div className={styles.controls}>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={labels.previousImage}
              disabled={images.length < 2}
              onClick={() => move(-1)}
            >
              <ChevronLeft size={18} />
            </Button>
            <span className={styles.position} aria-live="polite">
              {index + 1} / {images.length}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={labels.nextImage}
              disabled={images.length < 2}
              onClick={() => move(1)}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
          {selected.caption && (
            <p className={styles.caption}>{selected.caption}</p>
          )}
        </DialogContent>
      </Dialog>
      <div className={styles.controls}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={labels.previousImage}
          disabled={images.length < 2}
          onClick={() => move(-1)}
        >
          <ChevronLeft size={18} />
        </Button>
        <span className={styles.position} aria-live="polite">
          {index + 1} / {images.length}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={labels.nextImage}
          disabled={images.length < 2}
          onClick={() => move(1)}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      {images.length > 1 && (
        <div
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
                aria-pressed={image.id === selected.id}
                aria-label={`${labels.viewImage} ${i + 1}: ${image.alt}`}
                onClick={() => setSelectedId(image.id)}
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
      )}
      {selected.caption && (
        <p id={`${id}-caption`} className={styles.caption}>
          {selected.caption}
        </p>
      )}
    </section>
  );
}
