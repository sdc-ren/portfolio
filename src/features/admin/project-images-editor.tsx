"use client";

import { useId, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  imageUploadSchema,
  imageMimeTypes,
  MAX_PROJECT_IMAGES,
  PROJECT_IMAGES_BUCKET,
  type ProjectImage,
} from "@/features/content/project-assets";
import { createImageUpload } from "./media-actions";
import styles from "./project-editor.module.scss";

export function ProjectImagesEditor({
  projectId,
  images,
  coverImageId,
  disabled,
  onChange,
  onBusyChange,
}: {
  projectId: string;
  images: ProjectImage[];
  coverImageId: string;
  disabled: boolean;
  onChange: (images: ProjectImage[], coverImageId: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const id = useId();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const locked = disabled || busy;
  const selectedCover = coverImageId || images[0]?.id || "";
  const update = (key: string, patch: Partial<ProjectImage>) =>
    onChange(
      images.map((image) =>
        image.id === key ? { ...image, ...patch } : image,
      ),
      coverImageId,
    );
  const move = (index: number, delta: number) => {
    const next = [...images];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next, selectedCover);
  };
  const upload = async (files: File[]) => {
    if (!files.length) return;
    setError("");
    if (images.length + files.length > MAX_PROJECT_IMAGES) {
      setError(`A project can have up to ${MAX_PROJECT_IMAGES} images.`);
      return;
    }
    for (const file of files) {
      if (
        !imageUploadSchema.safeParse({
          projectId,
          type: file.type,
          size: file.size,
        }).success
      ) {
        setError(
          `${file.name}: use JPEG, PNG, WebP or AVIF, up to 3 MB. Check that the project ID is valid.`,
        );
        return;
      }
    }
    setBusy(true);
    onBusyChange(true);
    const next = [...images];
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (!url || !key) throw new Error("Supabase is not configured.");
      // Upload with a short-lived token; no session or privileged key is placed in this client.
      const client = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      });
      for (const [index, file] of files.entries()) {
        setStatus(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
        // Decode locally before transferring: rejects corrupt files and oversized dimensions.
        const bitmap = await createImageBitmap(file);
        const valid =
          bitmap.width > 0 &&
          bitmap.height > 0 &&
          bitmap.width * bitmap.height <= 40_000_000;
        bitmap.close();
        if (!valid)
          throw new Error(`${file.name}: image must be below 40 megapixels.`);
        const ticket = await createImageUpload({
          projectId,
          type: file.type,
          size: file.size,
        });
        if (!ticket.ok) throw new Error(ticket.error);
        const { error: uploadError } = await client.storage
          .from(PROJECT_IMAGES_BUCKET)
          .uploadToSignedUrl(ticket.path, ticket.token, file, {
            contentType: file.type,
            cacheControl: "31536000",
          });
        if (uploadError)
          throw new Error(`${file.name}: ${uploadError.message}`);
        next.push({
          id: ticket.id,
          url: ticket.url,
          alt:
            file.name.replace(/\.[^.]+$/, "").slice(0, 300) ||
            "Project screenshot",
          caption: "",
        });
      }
      setStatus(
        `${files.length} image${files.length === 1 ? "" : "s"} uploaded. Review the descriptions, then apply and publish.`,
      );
    } catch (error) {
      setStatus("");
      setError(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.",
      );
    } finally {
      // Keep successful uploads even if a later file fails.
      if (next.length !== images.length)
        onChange(next, selectedCover || next[0].id);
      setBusy(false);
      onBusyChange(false);
    }
  };
  return (
    <section
      className={styles.section}
      aria-labelledby={`${id}-title`}
      aria-busy={busy}
    >
      <div className={styles.heading}>
        <h3 id={`${id}-title`}>
          Project gallery · {images.length}/{MAX_PROJECT_IMAGES}
        </h3>
        <ImagePlus size={18} aria-hidden="true" />
      </div>
      <p className={styles.hint}>
        Images appear on the website only. Choose a cover for the project card.
        Review each image description for accessibility.
      </p>
      <div className={styles.upload}>
        <Label htmlFor={`${id}-upload`}>Upload screenshots</Label>
        <Input
          id={`${id}-upload`}
          type="file"
          accept={imageMimeTypes.join(",")}
          multiple
          disabled={locked || images.length >= MAX_PROJECT_IMAGES}
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            event.target.value = "";
            void upload(files);
          }}
        />
        <p className={styles.hint}>
          JPEG, PNG, WebP or AVIF · Up to 3 MB per image. Uploads are public;
          add screenshots suitable for sharing.
        </p>
      </div>
      <p className={styles.hint} role="status">
        {status}
      </p>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <div className={styles.list}>
        {images.map((image, index) => (
          <div key={image.id} className={styles.item}>
            <div className={styles.toolbar}>
              <span className={styles.number}>Image {index + 1}</span>
              <Button
                type="button"
                size="sm"
                variant={selectedCover === image.id ? "default" : "outline"}
                disabled={locked}
                aria-pressed={selectedCover === image.id}
                onClick={() => onChange(images, image.id)}
              >
                <Star size={14} />
                {selectedCover === image.id ? "Cover" : "Set cover"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={locked || index === 0}
                aria-label={`Move image ${index + 1} up`}
                onClick={() => move(index, -1)}
              >
                <ArrowUp size={15} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={locked || index === images.length - 1}
                aria-label={`Move image ${index + 1} down`}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={15} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={locked}
                aria-label={`Remove image ${index + 1} from gallery`}
                onClick={() => {
                  const next = images.filter((item) => item.id !== image.id);
                  onChange(
                    next,
                    selectedCover === image.id
                      ? (next[0]?.id ?? "")
                      : selectedCover,
                  );
                }}
              >
                <Trash2 size={15} />
              </Button>
            </div>
            {/* Native images use the public Storage URL directly; no Vercel image transformation cost. */}
            <img
              className={styles.preview}
              src={image.url}
              alt={image.alt}
              loading="lazy"
            />
            <div className={styles.field}>
              <Label htmlFor={`${id}-${image.id}-alt`}>
                Image description (required)
              </Label>
              <Input
                id={`${id}-${image.id}-alt`}
                value={image.alt}
                maxLength={300}
                disabled={locked}
                onChange={(event) =>
                  update(image.id, { alt: event.target.value })
                }
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor={`${id}-${image.id}-caption`}>
                Caption (optional)
              </Label>
              <Input
                id={`${id}-${image.id}-caption`}
                value={image.caption}
                maxLength={500}
                disabled={locked}
                onChange={(event) =>
                  update(image.id, { caption: event.target.value })
                }
              />
            </div>
          </div>
        ))}
      </div>
      <p className={styles.hint}>
        Removing an image detaches it from this project when published. The
        stored file is retained so existing published versions and other
        languages keep working.
      </p>
    </section>
  );
}
