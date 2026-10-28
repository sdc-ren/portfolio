"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { experienceBullets } from "@/features/content/experience";
import type { PortfolioContent } from "@/features/content/schema";
import { ReferencePicker } from "./reference-picker";
export function ExperienceSelectionEditor({
  value,
  experience,
  disabled,
  onChange,
}: {
  value: Record<string, string[]>;
  experience: PortfolioContent["experience"];
  disabled: boolean;
  onChange: (next: Record<string, string[]>) => void;
}) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium">Experience bullets for this CV</h3>
      <p className="text-xs text-muted-foreground">
        Only selected companies above appear in this CV. Choose/reorder shared
        bullets below; use all to follow the source automatically.
      </p>
      {experience.map((item) => (
        <div key={item.id} className="rounded-lg border border-border p-3">
          <p className="mb-2 text-sm font-medium">
            {item.company} · {item.role}
          </p>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <Checkbox
              disabled={disabled}
              checked={value[item.id] === undefined}
              onCheckedChange={(checked) => {
                const next = { ...value };
                if (checked) delete next[item.id];
                else next[item.id] = experienceBullets(item).map((b) => b.id);
                onChange(next);
              }}
            />
            Use all shared bullets
          </label>
          {value[item.id] !== undefined && (
            <ReferencePicker
              label="Selected bullets (in order)"
              items={experienceBullets(item).map((b) => ({
                id: b.id,
                label: b.text,
              }))}
              value={value[item.id]}
              disabled={disabled}
              onChange={(ids) => onChange({ ...value, [item.id]: ids })}
            />
          )}
        </div>
      ))}
    </div>
  );
}
