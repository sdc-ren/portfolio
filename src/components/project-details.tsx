import Markdown from "react-markdown";
import type { PortfolioContent } from "@/features/content/schema";
import type { UiLabels } from "@/features/content/ui";
import { Button } from "./ui/button";

/** Shared content for the project dialog and directly accessed detail page. */
export function ProjectDetails({
  project,
  labels,
}: {
  project: PortfolioContent["projects"][number];
  labels: UiLabels;
}) {
  return (
    <>
      <p className="mt-6 text-muted-foreground">{project.role}</p>
      <div className="my-8 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="rounded bg-muted px-3 py-1 text-xs">
            {t}
          </span>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        {project.repository && (
          <Button asChild>
            <a href={project.repository}>{labels.sourceCode} ↗</a>
          </Button>
        )}
        {project.demo && (
          <Button asChild variant="outline">
            <a href={project.demo}>{labels.liveProject} ↗</a>
          </Button>
        )}
      </div>
      {project.description.trim() !==
        project.highlights.join("\n\n").trim() && (
        <div className="prose border-t border-border pt-6 text-muted-foreground">
          <Markdown>{project.description}</Markdown>
        </div>
      )}
      <h2 className="mb-5 mt-10 text-2xl font-semibold">
        {labels.contributions}
      </h2>
      <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </>
  );
}
