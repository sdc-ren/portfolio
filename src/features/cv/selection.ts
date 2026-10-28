import { selectByIds, type PortfolioContent } from "@/features/content/schema";
import { experienceBullets } from "@/features/content/experience";
export function cvExperience(
  data: PortfolioContent,
  cv: PortfolioContent["cvs"][number],
) {
  return selectByIds(data.experience, cv.experienceIds).flatMap((item) => {
    const bullets = experienceBullets(item);
    const selection = cv.experienceSelections[item.id];
    const highlights =
      selection === undefined
        ? bullets.map((b) => b.text)
        : selectByIds(bullets, selection).map((b) => b.text);
    return highlights.length ? [{ ...item, highlights }] : [];
  });
}
export function cvSectionOrder<T>(
  cv: { sectionOrder: string },
  experience: T,
  projects: T,
): T[] {
  return cv.sectionOrder === "projects-first"
    ? [projects, experience]
    : [experience, projects];
}
