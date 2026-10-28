import initial from "@/data/initial-content.json";
import projectCopy from "@/data/ai-project-copy.json";
import additions from "@/data/ai-content.json";
import { contentSchema, projectSchema } from "./schema";

/** New installations use the same additive content as the CMS migration. */
export function initialContent() {
  const data = contentSchema.parse(initial);
  const { project, skills, cv } = additions.en;
  data.projects.push(projectSchema.parse(project));
  data.projects = data.projects.map((project) => {
    const copy = projectCopy.find((entry) => entry.id === project.id);
    return copy ? { ...project, ...copy } : project;
  });
  data.skills.push(...skills);
  data.technologies = [...new Set([...data.technologies, ...project.tech])];
  data.cvs.push({
    ...cv,
    projectIds: cv.projectIds.filter((id) =>
      data.projects.some((p) => p.id === id),
    ),
    skillIds: cv.skillIds.filter((id) => data.skills.some((s) => s.id === id)),
    experienceIds: cv.experienceIds.filter((id) =>
      data.experience.some((e) => e.id === id),
    ),
  });
  return contentSchema.parse(data);
}
