import { z } from "zod";

export const linkTypes = [
  "website",
  "github",
  "chrome-web-store",
  "app-store",
  "google-play",
  "testflight",
  "custom",
] as const;
export const httpUrl = z
  .url()
  .max(2048)
  .refine((value) => /^https?:\/\//.test(value), "Use an http(s) URL");
export const projectLinkSchema = z
  .object({
    id: z.string().min(1).max(80),
    type: z.enum(linkTypes),
    url: httpUrl,
    label: z.string().trim().max(100).default(""),
    showInCv: z.boolean().default(false),
  })
  .superRefine((link, ctx) => {
    if (link.type === "custom" && !link.label)
      ctx.addIssue({
        code: "custom",
        path: ["label"],
        message: "Custom links need a label",
      });
  });
export const projectImageSchema = z.object({
  id: z.string().min(1).max(80),
  url: httpUrl,
  alt: z.string().trim().min(1).max(300),
  caption: z.string().trim().max(500).default(""),
});
export type ProjectLink = z.infer<typeof projectLinkSchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;

/** Only used while reading documents that predate project links. An explicit [] stays empty. */
export function legacyProjectLinks(
  repository?: string,
  demo?: string,
): ProjectLink[] {
  return [
    ...(repository
      ? [
          {
            id: "source",
            type: "github" as const,
            url: repository,
            label: "",
            showInCv: true,
          },
        ]
      : []),
    ...(demo
      ? [
          {
            id: "website",
            type: "website" as const,
            url: demo,
            label: "",
            showInCv: false,
          },
        ]
      : []),
  ];
}
export function coverImage(project: {
  images: ProjectImage[];
  coverImageId: string;
}) {
  return (
    project.images.find((image) => image.id === project.coverImageId) ??
    project.images[0]
  );
}

export const PROJECT_IMAGES_BUCKET = "project-images";
export const MAX_PROJECT_IMAGES = 20;
export const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
export const imageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;
export const imageUploadSchema = z.object({
  projectId: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80),
  type: z.enum(imageMimeTypes),
  size: z.number().int().positive().max(MAX_IMAGE_BYTES),
});
