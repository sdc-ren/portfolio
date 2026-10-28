"use client";
import { ExperienceBulletsEditor } from "./experience-bullets-editor";
import { ExperienceSelectionEditor } from "./experience-selection-editor";
import { experienceBullets } from "@/features/content/experience";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createContext, useContext, useId } from "react";
import { ReferencePicker } from "./reference-picker";
import { ChipPicker } from "./chip-picker";
import { technologySuggestions, roleSuggestions } from "./chip-options";
import type { PortfolioContent } from "@/features/content/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
export type Json = string | boolean | Json[] | { [key: string]: Json };
const labels: Record<string, string> = {
  projectIds: "Projects (IDs, in order)",
  skillIds: "Skill groups in this CV (IDs, in order)",
  experienceIds: "Experience in this CV (IDs, in order)",
  description: "Description (Markdown)",
  tech: "Technologies",
  repository: "Repository URL",
  demo: "Live project URL",
  featured: "Featured on homepage",
  id: "Stable ID (used in URLs / CV selections)",
};
const large = new Set([
  "summary",
  "description",
  "highlights",
  "contactDescription",
  "projectsDescription",
]);
export const ContentContext = createContext<PortfolioContent | null>(null);
export function Field({
  name,
  value,
  onChange,
  disabled = false,
  lockId = false,
}: {
  name: string;
  value: Json;
  onChange: (v: Json) => void;
  disabled?: boolean;
  lockId?: boolean;
}) {
  const content = useContext(ContentContext);
  const fieldId = useId();
  const label =
    labels[name] ??
    name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  if (name === "bullets" && Array.isArray(value)) {
    const bullets = value.flatMap((v) =>
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      typeof v.id === "string" &&
      typeof v.text === "string"
        ? [{ id: v.id, text: v.text }]
        : [],
    );
    return (
      <ExperienceBulletsEditor
        value={bullets}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
  if (
    name === "experienceSelections" &&
    content &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    const selected = Object.fromEntries(
      Object.entries(value).map(([id, ids]) => [
        id,
        Array.isArray(ids)
          ? ids.filter((v): v is string => typeof v === "string")
          : [],
      ]),
    );
    return (
      <ExperienceSelectionEditor
        value={selected}
        experience={content.experience}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
  if (["sectionOrder", "stage"].includes(name) && typeof value === "string") {
    const options =
      name === "sectionOrder"
        ? [
            ["experience-first", "Experience before projects"],
            ["projects-first", "Projects before experience"],
          ]
        : [
            ["applied", "Applied / implemented"],
            ["research", "Research / exploration"],
          ];
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{label}</Label>
        <Select value={value} disabled={disabled} onValueChange={onChange}>
          <SelectTrigger id={fieldId}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(([id, label]) => (
              <SelectItem key={id} value={id}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
  if (name === "role" && typeof value === "string")
    return (
      <ChipPicker
        label={label}
        single
        value={value ? [value] : []}
        options={[...(content?.roles ?? []), ...roleSuggestions]}
        disabled={disabled}
        onChange={(next) => onChange(next[0] ?? "")}
      />
    );
  if (
    Array.isArray(value) &&
    ["technologies", "tech", "roles", "items"].includes(name)
  ) {
    const options =
      name === "roles"
        ? [
            ...(content?.roles ?? []),
            ...(content?.experience.map((item) => item.role) ?? []),
            ...(content?.projects.map((item) => item.role) ?? []),
            ...roleSuggestions,
          ]
        : [
            ...(content?.technologies ?? []),
            ...(name === "items"
              ? (content?.skills.flatMap((item) => item.items) ?? [])
              : []),
            ...(content?.projects.flatMap((item) => item.tech) ?? []),
            ...(name === "technologies" ? technologySuggestions : []),
          ];
    return (
      <ChipPicker
        label={label}
        value={value as string[]}
        options={options}
        disabled={disabled}
        onChange={onChange}
      />
    );
  }
  if (typeof value === "boolean")
    return (
      <div className="flex items-center gap-3">
        <Checkbox
          id={fieldId}
          checked={value}
          disabled={disabled}
          onCheckedChange={(checked) => onChange(checked === true)}
        />
        <Label htmlFor={fieldId}>{label}</Label>
      </div>
    );
  if (typeof value === "string")
    return (
      <div className="space-y-2">
        <Label htmlFor={fieldId}>{label}</Label>
        {large.has(name) ? (
          <Textarea
            id={fieldId}
            rows={name === "description" ? 7 : 4}
            value={value}
            disabled={disabled || (name === "id" && lockId)}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Input
            id={fieldId}
            type={
              name === "email"
                ? "email"
                : ["repository", "demo", "github", "linkedin"].includes(name)
                  ? "url"
                  : "text"
            }
            value={value}
            disabled={disabled || (name === "id" && lockId)}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
    );
  if (Array.isArray(value)) {
    const references =
      name === "projectIds"
        ? content?.projects
        : ["skillIds", "websiteSkillIds"].includes(name)
          ? content?.skills
          : name === "experienceIds"
            ? content?.experience
            : undefined;
    if (references) {
      return (
        <ReferencePicker
          label={label.split(" (")[0]}
          items={references.map((item) => ({
            id: item.id,
            label:
              "title" in item
                ? item.title
                : "name" in item
                  ? item.name
                  : `${item.company} · ${item.role}`,
          }))}
          value={value as string[]}
          disabled={disabled}
          onChange={onChange}
        />
      );
    }

    return (
      <div>
        <div className="space-y-2">
          <Label htmlFor={fieldId}>{label} · one per line</Label>
          <Textarea
            id={fieldId}
            rows={4}
            value={(value as string[]).join("\n")}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value.split("\n"))}
          />
        </div>
      </div>
    );
  }

  const fields =
    "company" in value &&
    "highlights" in value &&
    Array.isArray(value.highlights)
      ? Object.fromEntries(
          Object.entries({
            ...value,
            bullets: experienceBullets({
              highlights: value.highlights.filter(
                (v): v is string => typeof v === "string",
              ),
              bullets: Array.isArray(value.bullets)
                ? value.bullets.flatMap((v) =>
                    v &&
                    typeof v === "object" &&
                    !Array.isArray(v) &&
                    typeof v.id === "string" &&
                    typeof v.text === "string"
                      ? [{ id: v.id, text: v.text }]
                      : [],
                  )
                : [],
            }),
          }).filter(([key]) => key !== "highlights"),
        )
      : value;
  return (
    <div
      className={
        name.endsWith("-item") ? "grid gap-6" : "grid gap-6 xl:grid-cols-2"
      }
    >
      {Object.entries(fields).map(([key, v]) => (
        <div
          key={key}
          className={
            !name.endsWith("-item") && large.has(key)
              ? "xl:col-span-2"
              : undefined
          }
        >
          <Field
            key={key}
            name={key}
            value={v}
            disabled={disabled}
            lockId={lockId}
            onChange={(next) =>
              onChange({
                ...value,
                [key]: next,
                ...(key === "bullets" && Array.isArray(next)
                  ? {
                      highlights: next.flatMap((v) =>
                        v &&
                        typeof v === "object" &&
                        !Array.isArray(v) &&
                        typeof v.text === "string"
                          ? [v.text]
                          : [],
                      ),
                    }
                  : {}),
              })
            }
          />
        </div>
      ))}
    </div>
  );
}
