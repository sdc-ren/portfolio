"use server";

import { randomUUID } from "node:crypto";
import { requireAdmin } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase";
import {
  imageUploadSchema,
  PROJECT_IMAGES_BUCKET,
} from "@/features/content/project-assets";

export async function createImageUpload(input: unknown) {
  const user = await requireAdmin();
  const parsed = imageUploadSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      error: "Choose a JPEG, PNG, WebP or AVIF image up to 3 MB.",
    };
  const extension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  }[parsed.data.type];
  const id = randomUUID();
  const path = `${user.id}/${parsed.data.projectId}/${id}.${extension}`;
  const storage = (await supabaseServer()).storage.from(PROJECT_IMAGES_BUCKET);
  const { data, error } = await storage.createSignedUploadUrl(path, {
    upsert: false,
  });
  if (error) {
    console.error("Could not authorize project image upload:", error.message);
    return {
      ok: false as const,
      error:
        "Could not prepare upload. Check the project-images bucket and its admin upload policy (pnpm db:deploy).",
    };
  }
  return {
    ok: true as const,
    id,
    path,
    token: data.token,
    url: storage.getPublicUrl(path).data.publicUrl,
  };
}
