import styles from "./project-details.module.scss";
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
      {(project.role || project.tech.length > 0) && (
        <div className={styles.metadata}>
          {project.role && <p className={styles.role}>{project.role}</p>}
          {project.tech.length > 0 && (
            <div className={styles.technology}>
              <span className={styles.label}>{labels.technology}</span>
              <ul className={styles.techList}>
                {project.tech.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <ProjectLinks links={project.links} labels={labels} />
      {project.description.trim() !==
        project.highlights.join("\n\n").trim() && (
        <div className="prose border-t border-border pt-6 text-muted-foreground">
          <Markdown>{project.description}</Markdown>
        </div>
      )}
      <h2 className="mb-4 mt-7 text-base font-semibold">
        {labels.contributions === "Contributions"
          ? "Highlights"
          : labels.contributions === "Đóng góp"
            ? "Điểm nổi bật"
            : labels.contributions}
      </h2>
      <ul className="list-disc space-y-3 pl-5 text-muted-foreground">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </>
  );
}
