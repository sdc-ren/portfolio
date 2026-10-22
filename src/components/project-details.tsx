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
          {project.role && (
            <div className={styles.role}>
              <span className={styles.badge}>{project.role}</span>
            </div>
          )}
          {project.tech.length > 0 && (
            <div>
              <ul className={styles.techList} aria-label={labels.technology}>
                {project.tech.map((tech) => (
                  <li key={tech} className={styles.badge}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <ProjectLinks links={project.links} labels={labels} />
      {project.description.trim() !==
        project.highlights.join("\n\n").trim() && (
        <div className="prose text-muted-foreground">
          <Markdown>{project.description}</Markdown>
        </div>
      )}
      <h2 className="mb-4 mt-7 text-base font-semibold">
        {["Contributions", "Highlights"].includes(labels.contributions)
          ? "Project details"
          : ["Đóng góp", "Điểm nổi bật"].includes(labels.contributions)
            ? "Chi tiết dự án"
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
