"use client";

import {
  projectFocusLabels,
  projectFocusValues,
} from "@/features/content/project-focus";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useId } from "react";
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
  const { images, coverImageId, links, focus, ...fields } = value;
  const focusId = useId();
  return (
    <div className="grid gap-6">
      <Field
        name="projects-item"
        value={fields}
        disabled={disabled || uploading}
        lockId={lockId}
        onChange={(next) => onChange({ ...value, ...(next as typeof fields) })}
      />
      <div className="space-y-2">
        <Label htmlFor={focusId}>Project focus badge</Label>
        <Select
          value={typeof focus === "string" && focus ? focus : "none"}
          disabled={disabled || uploading}
          onValueChange={(next) =>
            onChange({ ...value, focus: next === "none" ? "" : next })
          }
        >
          <SelectTrigger id={focusId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {projectFocusValues.map((option) => (
              <SelectItem key={option || "none"} value={option || "none"}>
                {projectFocusLabels[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
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
