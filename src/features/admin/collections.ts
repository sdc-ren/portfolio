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
  return field
    ? data.cvs.filter((cv) => cv[field].includes(id)).map((cv) => cv.title)
    : [];
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
  // Check CV references against the current, possibly unsaved, content.
  if (collection === "cvs") {
    const candidate = {
      ...data,
      cvs: originalId
        ? data.cvs.map((item) => (item.id === originalId ? result.data : item))
        : [...data.cvs, result.data],
    };
    const checked = contentSchema.safeParse(candidate);
    if (!checked.success)
      return {
        ok: false as const,
        error: checked.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; "),
      };
  }
  return { ok: true as const, value: result.data };
}
