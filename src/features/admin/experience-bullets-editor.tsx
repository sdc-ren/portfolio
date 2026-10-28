"use client";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uniqueItemId } from "@/features/content/normalize";
export function ExperienceBulletsEditor({
  value,
  disabled,
  onChange,
}: {
  value: { id: string; text: string }[];
  disabled: boolean;
  onChange: (value: { id: string; text: string }[]) => void;
}) {
  const move = (index: number, offset: number) => {
    const next = [...value];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Shared experience bullets</p>
      <p className="text-xs text-muted-foreground">
        Edit each fact once. CVs reference its stable ID; reordering keeps
        selections intact.
      </p>
      {value.map((bullet, index) => (
        <div key={bullet.id} className="rounded-lg border border-border p-3">
          <div className="mb-2 flex items-center gap-1">
            <span className="mr-auto text-xs text-muted-foreground">
              {bullet.id}
            </span>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Move bullet up"
              disabled={disabled || index === 0}
              onClick={() => move(index, -1)}
            >
              <ArrowUp size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Move bullet down"
              disabled={disabled || index === value.length - 1}
              onClick={() => move(index, 1)}
            >
              <ArrowDown size={14} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Remove bullet"
              disabled={disabled}
              onClick={() => onChange(value.filter((b) => b.id !== bullet.id))}
            >
              <X size={14} />
            </Button>
          </div>
          <Textarea
            aria-label={`Experience bullet ${index + 1}`}
            value={bullet.text}
            disabled={disabled}
            onChange={(e) =>
              onChange(
                value.map((b) =>
                  b.id === bullet.id ? { ...b, text: e.target.value } : b,
                ),
              )
            }
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() =>
          onChange([
            ...value,
            {
              id: uniqueItemId("bullet", value),
              text: "New experience bullet",
            },
          ])
        }
      >
        <Plus size={14} />
        Add bullet
      </Button>
    </div>
  );
}
