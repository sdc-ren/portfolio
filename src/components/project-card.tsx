"use client";
import { useRef } from "react";
import { ProjectGallery } from "./project-gallery";
import styles from "./project-card.module.scss";
import { ActionTooltip } from "./action-tooltip";
import type { UiLabels } from "@/features/content/ui";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { ProjectDetails } from "./project-details";
import { Expand } from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
export function ProjectCard({
  project,
  labels,
  index = 0,
}: {
  project: PortfolioContent["projects"][number];
  labels: UiLabels;
  index?: number;
}) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  return (
    <article className={styles.card}>
      <header className={styles.meta}>
        <span>{project.category}</span>
        <div className={styles.actions}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <ProjectGallery
            images={project.images}
            coverImageId={project.coverImageId}
            title={project.title}
            labels={labels}
          />
        </div>
      </header>
      <Dialog>
        <ActionTooltip label={project.title}>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label={project.title}
              className={styles.openCard}
            >
              <span className={styles.title}>
                <span className={styles.titleText}>
                  {project.title.split(" — ")[0]}
                </span>
                <Expand size={18} aria-hidden="true" />
              </span>
              <span className={styles.summary}>{project.summary}</span>
              <span className={styles.tags}>
                {project.tech.slice(0, 4).map((tech) => (
                  <span key={tech} className={styles.tag}>
                    {tech}
                  </span>
                ))}
              </span>
            </button>
          </DialogTrigger>
        </ActionTooltip>
        <DialogContent
          closeLabel={labels.closeDialog}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            titleRef.current?.focus();
          }}
          onInteractOutside={(event) => event.preventDefault()}
          className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-xl bg-card p-0"
        >
          <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
            <p className="text-xs uppercase tracking-widest text-primary">
              {project.category}
            </p>
            <DialogTitle
              ref={titleRef}
              tabIndex={-1}
              className="text-xl leading-snug outline-none sm:text-2xl"
            >
              {project.title}
            </DialogTitle>
            <DialogDescription className="line-clamp-3">
              {project.summary}
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto overscroll-contain px-6 py-5">
            <ProjectDetails project={project} labels={labels} />
          </div>
          <DialogFooter className="border-t border-border px-6 py-4">
            <DialogClose asChild>
              <Button variant="outline">{labels.closeDialog}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
