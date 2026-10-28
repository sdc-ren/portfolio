import presentation from "@/data/role-presentation.json";
import initial from "@/data/initial-content.json";
import projectCopy from "@/data/ai-project-copy.json";
import speech from "@/data/speech-ai-content.json";
import additions from "@/data/ai-content.json";
import { contentSchema, projectSchema } from "./schema";

/** New installations use the same additive content as the CMS migration. */
export function initialContent() {
  const data = contentSchema.parse(initial);
  const { project, skills, cv } = additions.en;
  data.projects.push(projectSchema.parse(project));
  data.projects = data.projects.map((project) => {
    const copy = projectCopy.find((entry) => entry.id === project.id);
    return copy ? projectSchema.parse({ ...project, ...copy }) : project;
  });
  data.projects.push(projectSchema.parse(speech.en.project));
  data.skills.push(
    ...contentSchema.shape.skills.parse([...skills, speech.en.skill]),
  );
  data.technologies = [
    ...new Set([
      ...data.technologies,
      ...project.tech,
      ...speech.en.project.tech,
    ]),
  ];
  const role = presentation.en;
  data.skills.push(...contentSchema.shape.skills.parse(role.skills));
  data.cvs.push(
    contentSchema.shape.cvs.element.parse({
      ...cv,
      projectIds: cv.projectIds.filter((id) =>
        data.projects.some((p) => p.id === id),
      ),
      skillIds: cv.skillIds.filter((id) =>
        data.skills.some((s) => s.id === id),
      ),
      experienceIds: cv.experienceIds.filter((id) =>
        data.experience.some((e) => e.id === id),
      ),
    }),
  );
  data.experience = data.experience.map((item) => ({
    ...item,
    bullets: item.highlights.map((text, index) => ({
      id: `bullet-${index + 1}`,
      text,
    })),
  }));
  data.cvs = data.cvs.map((cv) =>
    cv.id === "senior-software-engineer"
      ? contentSchema.shape.cvs.element.parse({ ...cv, ...role.senior })
      : cv,
  );
  data.settings.websiteSkillIds = role.websiteSkillIds;
  data.settings.experienceNote = role.experienceNote;
  return contentSchema.parse(data);
}
