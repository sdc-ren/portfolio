import { ProjectMetadata } from "./project-metadata";
import Markdown from "react-markdown";
import type { PortfolioContent } from "@/features/content/schema";
import type { UiLabels } from "@/features/content/ui";
import { ProjectLinks } from "./project-links";
import { ProjectGallery } from "./project-gallery";

/** Shared content for the project dialog and directly accessed detail page. */
export function ProjectDetails({
  project,
  labels,
  showMetadata = true,
  showLinks = true,
}: {
  project: PortfolioContent["projects"][number];
  labels: UiLabels;
  showMetadata?: boolean;
  showLinks?: boolean;
}) {
  return (
    <>
      {showMetadata && <ProjectMetadata project={project} />}
      {project.images.length > 0 && (
        <section aria-label={labels.projectGallery}>
          <h2 className="mb-3 text-sm font-medium">{labels.projectGallery}</h2>
          <ProjectGallery
            variant="thumbnails"
            images={project.images}
            coverImageId={project.coverImageId}
            title={project.title}
            labels={labels}
          />
        </section>
      )}
      <h2 className="mb-4 mt-7 text-base font-semibold">
        {["Contributions", "Highlights"].includes(labels.contributions)
          ? "Project details"
          : ["Đóng góp", "Điểm nổi bật"].includes(labels.contributions)
            ? "Chi tiết dự án"
            : labels.contributions}
      </h2>
      {showLinks && <ProjectLinks links={project.links} labels={labels} />}
      {project.description.trim() !==
        project.highlights.join("\n\n").trim() && (
        <div className="prose mb-5 text-muted-foreground">
          <Markdown>{project.description}</Markdown>
        </div>
      )}

      <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </>
  );
}
