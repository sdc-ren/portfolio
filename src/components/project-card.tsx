"use client";
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={project.title}
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary group flex w-full text-left flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40 hover:bg-muted"
        >
          <span className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
            <span>{project.category}</span>
            <span>{String(index + 1).padStart(2, "0")}</span>
          </span>
          <span className="mb-4 flex items-start justify-between gap-4 text-xl font-semibold text-foreground">
            {project.title.split(" — ")[0]}
            <Expand size={20} className="shrink-0 text-primary" />
          </span>
          <span className="block mb-6 text-sm leading-7 text-muted-foreground">
            {project.summary}
          </span>
          <span className="mt-auto flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        closeLabel={labels.closeDialog}
        onInteractOutside={(event) => event.preventDefault()}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-3xl grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden rounded-xl bg-card p-0"
      >
        <DialogHeader className="border-b border-border px-6 py-5 pr-14 text-left">
          <p className="text-xs uppercase tracking-widest text-primary">
            {project.category}
          </p>
          <DialogTitle className="text-xl leading-snug sm:text-2xl">
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
  );
}
