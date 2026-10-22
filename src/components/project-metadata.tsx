import type { PortfolioContent } from "@/features/content/schema";
import styles from "./project-details.module.scss";

export function ProjectMetadata({
  project,
}: {
  project: PortfolioContent["projects"][number];
}) {
  if (!project.role && !project.tech.length) return null;
  return (
    <ul className={styles.metadata}>
      {project.role && <li className={styles.badge}>{project.role}</li>}
      {project.tech.map((tech) => (
        <li key={tech} className={styles.badge}>
          {tech}
        </li>
      ))}
    </ul>
  );
}
