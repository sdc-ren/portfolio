import { experienceBullets } from "./experience";
import { z } from "zod";
import { projectFocusValues } from "./project-focus";
import { uiSchema } from "./ui";
import {
  legacyProjectLinks,
  projectImageSchema,
  projectLinkSchema,
  MAX_PROJECT_IMAGES,
} from "./project-assets";
const normalizeDash = (value: string) => value.replaceAll("\u2014", "-");
const text = z.string().trim().min(1).max(20000).transform(normalizeDash);
const short = z.string().trim().min(1).max(200).transform(normalizeDash);
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
export const projectSchema = z
  .object({
    id: slug,
    title: short,
    role: short,
    category: short,
    focus: z.enum(projectFocusValues).default(""),
    summary: text,
    description: text,
    tech: list,
    highlights: z.array(text).max(30),
    repository: url.optional(),
    demo: url.optional(),
    links: z.array(projectLinkSchema).max(12).optional(),
    images: z.array(projectImageSchema).max(MAX_PROJECT_IMAGES).default([]),
    coverImageId: z.string().max(80).default(""),
    featured: z.boolean(),
  })
  .superRefine((project, ctx) => {
    for (const key of ["links", "images"] as const) {
      const ids = (project[key] ?? []).map((item) => item.id);
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "IDs must be unique",
        });
    }
    if (
      project.coverImageId &&
      !project.images.some((image) => image.id === project.coverImageId)
    )
      ctx.addIssue({
        code: "custom",
        path: ["coverImageId"],
        message: "Choose an image from this gallery",
      });
  })
  .transform(({ repository, demo, ...project }) => ({
    ...project,
    links: project.links ?? legacyProjectLinks(repository, demo),
  }));
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
    skills: z
      .array(
        z.object({
          id: slug,
          name: short,
          items: list,
          description: z.string().trim().max(1000).default(""),
          projectIds: list.default([]),
          stage: z.enum(["applied", "research"]).default("applied"),
        }),
      )
      .max(30),
    experience: z
      .array(
        z
          .object({
            id: slug,
            company: short,
            role: short,
            period: short,
            location: short,
            highlights: z.array(text).max(30),
            bullets: z
              .array(z.object({ id: slug, text }))
              .max(30)
              .default([]),
          })
          .superRefine((item, ctx) => {
            if (
              new Set(item.bullets.map((b) => b.id)).size !==
              item.bullets.length
            )
              ctx.addIssue({
                code: "custom",
                path: ["bullets"],
                message: "Bullet IDs must be unique",
              });
          })
          .transform((item) => ({
            ...item,
            highlights: item.bullets.length
              ? item.bullets.map((b) => b.text)
              : item.highlights,
          })),
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
          sectionOrder: z
            .enum(["experience-first", "projects-first"])
            .default("experience-first"),
          projectsHeading: z.string().trim().max(200).default(""),
          experienceSelections: z.record(slug, list).default({}),
        }),
      )
      .min(1)
      .max(10),
    settings: z.object({
      websiteSkillIds: list.default([]),
      experienceNote: z.string().trim().max(2000).default(""),
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
    for (const [i, skill] of data.skills.entries()) {
      if (
        skill.projectIds.some((id) => !data.projects.some((p) => p.id === id))
      )
        ctx.addIssue({
          code: "custom",
          path: ["skills", i, "projectIds"],
          message: "Unknown skill evidence project",
        });
    }
    if (
      data.settings.websiteSkillIds.some(
        (id) => !data.skills.some((s) => s.id === id),
      )
    )
      ctx.addIssue({
        code: "custom",
        path: ["settings", "websiteSkillIds"],
        message: "Unknown website skill group",
      });
    for (const [i, cv] of data.cvs.entries()) {
      for (const [id, ids] of Object.entries(cv.experienceSelections)) {
        const experience = data.experience.find((e) => e.id === id);
        const known = experience
          ? experienceBullets(experience).map((b) => b.id)
          : [];
        if (
          !experience ||
          new Set(ids).size !== ids.length ||
          ids.some((id) => !known.includes(id))
        )
          ctx.addIssue({
            code: "custom",
            path: ["cvs", i, "experienceSelections", id],
            message: "Unknown or duplicate experience bullet",
          });
      }
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
