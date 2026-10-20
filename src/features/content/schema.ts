import { z } from "zod";
import { uiSchema } from "./ui";
const text = z.string().trim().min(1).max(20000);
const short = z.string().trim().min(1).max(200);
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(80);
const url = z.union([
  z.literal(""),
  z.url().refine((v) => /^https?:\/\//.test(v), "Use an http(s) URL"),
]);
const list = z.array(short).max(100);
export const localeSchema = z.string().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/);
export const projectSchema = z.object({
  id: slug,
  title: short,
  role: short,
  category: short,
  summary: text,
  description: text,
  tech: list,
  highlights: z.array(text).max(30),
  repository: url,
  demo: url,
  featured: z.boolean(),
});
export const contentSchema = z
  .object({
    ui: uiSchema,
    profile: z.object({
      name: short,
      role: short,
      location: short,
      email: z.email(),
      phone: z.string().max(50),
      summary: text,
      tagline: short,
      github: url,
      linkedin: url,
    }),
    technologies: list,
    roles: list,
    skills: z.array(z.object({ id: slug, name: short, items: list })).max(30),
    experience: z
      .array(
        z.object({
          id: slug,
          company: short,
          role: short,
          period: short,
          location: short,
          highlights: z.array(text).max(30),
        }),
      )
      .max(30),
    projects: z.array(projectSchema).max(100),
    education: z
      .array(
        z.object({
          id: slug,
          institution: short,
          location: z.string().trim().max(200).default(""),
          qualification: short,
          year: short,
        }),
      )
      .max(20),
    languages: z
      .array(z.object({ id: slug, name: short, proficiency: short }))
      .max(20),
    cvs: z
      .array(
        z.object({
          id: slug,
          title: short,
          summary: text,
          specialties: short,
          projectIds: list,
          skillIds: list,
          experienceIds: list,
        }),
      )
      .min(1)
      .max(10),
    settings: z.object({
      headerRoles: z
        .array(short)
        .min(1)
        .max(10)
        .default(["SOFTWARE ENGINEER", "AI AGENT ENGINEERING"]),
      title: short,
      description: text,
      footer: short,
      languageLabel: short,
    }),
  })
  .superRefine((data, ctx) => {
    for (const key of [
      "projects",
      "skills",
      "experience",
      "education",
      "languages",
      "cvs",
    ] as const) {
      const ids = data[key].map((v) => v.id);
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "IDs must be unique",
        });
    }
    for (const [i, cv] of data.cvs.entries())
      for (const [field, collection] of [
        ["projectIds", "projects"],
        ["skillIds", "skills"],
        ["experienceIds", "experience"],
      ] as const) {
        if (new Set(cv[field]).size !== cv[field].length)
          ctx.addIssue({
            code: "custom",
            path: ["cvs", i, field],
            message: "CV selections must not contain duplicate IDs",
          });
        const ids = new Set(data[collection].map((v) => v.id));
        if (cv[field].some((id) => !ids.has(id)))
          ctx.addIssue({
            code: "custom",
            path: ["cvs", i, field],
            message:
              "Unknown reference; update CV selection before deleting content",
          });
      }
  });
export type PortfolioContent = z.infer<typeof contentSchema>;
export function selectByIds<T extends { id: string }>(
  items: T[],
  ids: string[],
): T[] {
  const map = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => (map.has(id) ? [map.get(id)!] : []));
}
