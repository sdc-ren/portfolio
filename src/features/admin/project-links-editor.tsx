"use client";

import { useId } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { linkTypes, type ProjectLink } from "@/features/content/project-assets";
import styles from "./project-editor.module.scss";

const typeNames: Record<ProjectLink["type"], string> = {
  website: "Website",
  github: "Source code",
  "chrome-web-store": "Chrome Web Store",
  "app-store": "App Store",
  "google-play": "Google Play",
  testflight: "TestFlight",
  custom: "Custom",
};
export function ProjectLinksEditor({
  value,
  onChange,
  disabled,
}: {
  value: ProjectLink[];
  onChange: (next: ProjectLink[]) => void;
  disabled: boolean;
}) {
  const id = useId();
  const update = (index: number, patch: Partial<ProjectLink>) =>
    onChange(
      value.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  const move = (index: number, delta: number) => {
    const next = [...value];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };
  return (
    <section className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.heading}>
        <h3 id={`${id}-title`}>Project links</h3>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || value.length >= 12}
          onClick={() =>
            onChange([
              ...value,
              {
                id: crypto.randomUUID(),
                type: "website",
                url: "",
                label: "",
                showInCv: false,
              },
            ])
          }
        >
          <Plus size={14} />
          Add link
        </Button>
      </div>
      <p className={styles.hint}>
        Add websites, repositories, store listings or beta invitations. Only
        links marked “Include in CV” appear in the CV/PDF.
      </p>
      <div className={styles.list}>
        {value.map((link, index) => (
          <div key={link.id} className={styles.item}>
            <div className={styles.toolbar}>
              <span className={styles.number}>Link {index + 1}</span>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled || index === 0}
                aria-label={`Move link ${index + 1} up`}
                onClick={() => move(index, -1)}
              >
                <ArrowUp size={15} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled || index === value.length - 1}
                aria-label={`Move link ${index + 1} down`}
                onClick={() => move(index, 1)}
              >
                <ArrowDown size={15} />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                disabled={disabled}
                aria-label={`Remove link ${index + 1}`}
                onClick={() =>
                  onChange(value.filter((item) => item.id !== link.id))
                }
              >
                <Trash2 size={15} />
              </Button>
            </div>
            <div className={styles.field}>
              <Label htmlFor={`${id}-${link.id}-type`}>Platform</Label>
              <Select
                value={link.type}
                disabled={disabled}
                onValueChange={(type) =>
                  update(index, { type: type as ProjectLink["type"] })
                }
              >
                <SelectTrigger id={`${id}-${link.id}-type`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {linkTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {typeNames[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className={styles.field}>
              <Label htmlFor={`${id}-${link.id}-url`}>URL</Label>
              <Input
                id={`${id}-${link.id}-url`}
                type="url"
                value={link.url}
                disabled={disabled}
                placeholder="https://…"
                onChange={(event) => update(index, { url: event.target.value })}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor={`${id}-${link.id}-label`}>
                Button label{" "}
                {link.type === "custom" ? "(required)" : "(optional)"}
              </Label>
              <Input
                id={`${id}-${link.id}-label`}
                maxLength={100}
                value={link.label}
                disabled={disabled}
                onChange={(event) =>
                  update(index, { label: event.target.value })
                }
              />
            </div>
            <div className={styles.check}>
              <Checkbox
                id={`${id}-${link.id}-cv`}
                checked={link.showInCv}
                disabled={disabled}
                onCheckedChange={(checked) =>
                  update(index, { showInCv: checked === true })
                }
              />
              <Label htmlFor={`${id}-${link.id}-cv`}>Include in CV</Label>
            </div>
          </div>
        ))}
      </div>
      {!value.length && <p className={styles.hint}>No links yet.</p>}
    </section>
  );
}
