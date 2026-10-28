import {
  contentSchema,
  type PortfolioContent,
} from "@/features/content/schema";
import { normalizeContentInput } from "@/features/content/normalize";

export const collectionKeys = [
  "projects",
  "experience",
  "skills",
  "education",
  "languages",
  "cvs",
] as const;
export type CollectionKey = (typeof collectionKeys)[number];
export function isCollection(key: string): key is CollectionKey {
  return (collectionKeys as readonly string[]).includes(key);
}
export function referencedBy(
  data: PortfolioContent,
  collection: CollectionKey,
  id: string,
) {
  const field =
    collection === "projects"
      ? "projectIds"
      : collection === "skills"
        ? "skillIds"
        : collection === "experience"
          ? "experienceIds"
          : null;
  const references = field
    ? data.cvs
        .filter(
          (cv) =>
            cv[field].includes(id) ||
            (collection === "experience" && id in cv.experienceSelections),
        )
        .map((cv) => cv.title)
    : [];
  if (collection === "projects")
    references.push(
      ...data.skills
        .filter((skill) => skill.projectIds.includes(id))
        .map((skill) => `Skill evidence: ${skill.name}`),
    );
  if (collection === "skills" && data.settings.websiteSkillIds.includes(id))
    references.push("Website skill groups");
  return references;
}
export function validateCollectionItem(
  data: PortfolioContent,
  collection: CollectionKey,
  record: unknown,
  originalId?: string,
) {
  if (!record || typeof record !== "object" || Array.isArray(record))
    return { ok: false as const, error: "A content record is required." };
  const normalized = normalizeContentInput(record) as { id?: string };
  if (originalId && normalized.id !== originalId)
    return {
      ok: false as const,
      error: "Existing IDs cannot be changed because URLs and CVs use them.",
    };
  if (
    data[collection].some(
      (item) => item.id === normalized.id && item.id !== originalId,
    )
  )
    return {
      ok: false as const,
      error: "This ID is already in use. Choose a unique ID.",
    };
  const result = contentSchema.shape[collection].element.safeParse(normalized);
  if (!result.success)
    return {
      ok: false as const,
      error: result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    };
  const nextItems = originalId
    ? data[collection].map((item) =>
        item.id === originalId ? result.data : item,
      )
    : [...data[collection], result.data];
  const sizeCheck = contentSchema.shape[collection].safeParse(nextItems);
  if (!sizeCheck.success)
    return {
      ok: false as const,
      error: sizeCheck.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    };
  // Validate shared evidence and bullet references for every collection edit.
  const checked = contentSchema.safeParse({ ...data, [collection]: nextItems });
  if (!checked.success)
    return {
      ok: false as const,
      error: checked.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; "),
    };
  return { ok: true as const, value: result.data };
}
