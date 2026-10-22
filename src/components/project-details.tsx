import Markdown from "react-markdown";
import type { PortfolioContent } from "@/features/content/schema";
import type { UiLabels } from "@/features/content/ui";
import { ProjectLinks } from "./project-links";
import { ProjectGallery } from "./project-gallery";

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
      <ProjectGallery
        variant="thumbnails"
        images={project.images}
        coverImageId={project.coverImageId}
        title={project.title}
        labels={labels}
      />
      <p className="mt-6 text-muted-foreground">{project.role}</p>
      <div className="my-8 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="rounded bg-muted px-3 py-1 text-xs">
            {t}
          </span>
        ))}
      </div>
      <ProjectLinks links={project.links} labels={labels} />
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
