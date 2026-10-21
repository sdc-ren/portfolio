"use client";
import { createContext, useContext, useId } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ChipPicker } from "./chip-picker";
import { technologySuggestions, roleSuggestions } from "./chip-options";
import type { PortfolioContent } from "@/features/content/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
export type Json = string | boolean | Json[] | { [key: string]: Json };
const labels: Record<string, string> = {
  projectIds: "Projects in this CV (IDs, in order)",
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
        : name === "skillIds"
          ? content?.skills
          : name === "experienceIds"
            ? content?.experience
            : undefined;
    if (references) {
      const selected = value as string[];
      const labelFor = (item: (typeof references)[number]) =>
        "title" in item
          ? item.title
          : "name" in item
            ? item.name
            : `${item.company} · ${item.role}`;
      const move = (index: number, delta: number) => {
        const next = [...selected];
        [next[index], next[index + delta]] = [next[index + delta], next[index]];
        onChange(next);
      };
      return (
        <fieldset
          disabled={disabled}
          className="rounded-xl border border-border p-4"
        >
          <legend className="px-2 text-sm text-muted-foreground">
            {label.split(" (")[0]}
          </legend>
          <div className="space-y-3">
            {references.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <Checkbox
                  id={`${fieldId}-${item.id}`}
                  disabled={disabled}
                  className="mt-1"
                  checked={selected.includes(item.id)}
                  onCheckedChange={(checked) =>
                    onChange(
                      checked === true
                        ? [...selected, item.id]
                        : selected.filter((id) => id !== item.id),
                    )
                  }
                />
                <Label htmlFor={`${fieldId}-${item.id}`}>
                  {labelFor(item)}
                </Label>
              </div>
            ))}
          </div>
          <p className="mb-2 mt-5 text-xs text-muted-foreground">
            Selected order
          </p>
          {selected.map((id, index) => (
            <div
              key={id}
              className="flex items-center justify-between gap-3 border-t border-border py-2 text-xs"
            >
              <span>
                {index + 1}.{" "}
                {references.find((item) => item.id === id)
                  ? labelFor(references.find((item) => item.id === id)!)
                  : `Missing: ${id}`}
              </span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={disabled || index === 0}
                  aria-label={`Move ${id} up`}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp size={14} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={disabled || index === selected.length - 1}
                  aria-label={`Move ${id} down`}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown size={14} />
                </Button>
              </div>
            </div>
          ))}
        </fieldset>
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

  return (
    <div
      className={
        name.endsWith("-item") ? "grid gap-6" : "grid gap-6 xl:grid-cols-2"
      }
    >
      {Object.entries(value).map(([key, v]) => (
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
            onChange={(next) => onChange({ ...value, [key]: next })}
          />
        </div>
      ))}
    </div>
  );
}
