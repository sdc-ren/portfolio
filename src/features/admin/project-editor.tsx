"use client";

import { Field, type Json } from "./editor-fields";
import type {
  ProjectImage,
  ProjectLink,
} from "@/features/content/project-assets";
import { ProjectImagesEditor } from "./project-images-editor";
import { ProjectLinksEditor } from "./project-links-editor";

export function ProjectEditor({
  value,
  disabled,
  lockId,
  uploading,
  onBusyChange,
  onChange,
}: {
  value: { id: string; [key: string]: Json };
  disabled: boolean;
  lockId: boolean;
  uploading: boolean;
  onBusyChange: (busy: boolean) => void;
  onChange: (value: Json) => void;
}) {
  const { images, coverImageId, links, ...fields } = value;
  return (
    <div className="grid gap-6">
      <Field
        name="projects-item"
        value={fields}
        disabled={disabled || uploading}
        lockId={lockId}
        onChange={(next) => onChange({ ...value, ...(next as typeof fields) })}
      />
      <ProjectLinksEditor
        value={(links ?? []) as ProjectLink[]}
        disabled={disabled || uploading}
        onChange={(next) => onChange({ ...value, links: next })}
      />
      <ProjectImagesEditor
        projectId={value.id}
        images={(images ?? []) as ProjectImage[]}
        coverImageId={typeof coverImageId === "string" ? coverImageId : ""}
        disabled={disabled}
        onBusyChange={onBusyChange}
        onChange={(images, coverImageId) =>
          onChange({ ...value, images, coverImageId })
        }
      />
    </div>
  );
}
