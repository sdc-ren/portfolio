"use client";

import { useId, useState } from "react";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import styles from "./reference-picker.module.scss";

type Reference = { id: string; label: string };

export function ReferencePicker({
  label,
  items,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  items: Reference[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<string[]>([]);
  const available = items.filter((item) => !value.includes(item.id));
  const matches = available.filter((item) =>
    item.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const move = (index: number, delta: number) => {
    const next = [...value];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };

  return (
    <section className={styles.root} aria-labelledby={`${id}-title`}>
      <div className={styles.header}>
        <h3 id={`${id}-title`} className={styles.title}>
          {label} <span className={styles.count}>{value.length}</span>
        </h3>
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) {
              setQuery("");
              setPending([]);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || available.length === 0}
              aria-label={`Add to ${label}`}
            >
              <Plus size={14} />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent
            className={styles.dialog}
            onPointerDownOutside={(event) => event.preventDefault()}
          >
            <DialogTitle>Add to {label}</DialogTitle>
            <DialogDescription>
              Choose items to append to this CV. Existing selections keep their
              order.
            </DialogDescription>
            <Label htmlFor={`${id}-search`} className="sr-only">
              Search available items
            </Label>
            <Input
              id={`${id}-search`}
              placeholder="Search available items…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className={styles.options}>
              {matches.map((item) => (
                <Label
                  key={item.id}
                  className={styles.option}
                  htmlFor={`${id}-${item.id}`}
                >
                  <Checkbox
                    id={`${id}-${item.id}`}
                    checked={pending.includes(item.id)}
                    disabled={disabled}
                    onCheckedChange={(checked) =>
                      setPending((current) =>
                        checked === true
                          ? [...current, item.id]
                          : current.filter((key) => key !== item.id),
                      )
                    }
                  />
                  <span>{item.label}</span>
                </Label>
              ))}
              {matches.length === 0 && (
                <p className={styles.empty}>No matching items.</p>
              )}
            </div>
            <div className={styles.footer}>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={disabled || pending.length === 0}
                onClick={() => {
                  onChange([
                    ...value,
                    ...pending.filter((key) =>
                      available.some((item) => item.id === key),
                    ),
                  ]);
                  setOpen(false);
                }}
              >
                Add selected ({pending.length})
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <p className={styles.hint}>Items appear in this order in the CV.</p>
      {value.length === 0 ? (
        <p className={styles.empty}>
          No items selected. Use Add to choose from your content.
        </p>
      ) : (
        <ol className={styles.list}>
          {value.map((key, index) => {
            const item = items.find((item) => item.id === key);
            const title = item?.label ?? `Missing item: ${key}`;
            return (
              <li key={key} className={styles.row}>
                <span className={styles.position} aria-hidden="true">
                  {index + 1}
                </span>
                <span className={styles.name}>{title}</span>
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${title} up`}
                    disabled={disabled || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${title} down`}
                    disabled={disabled || index === value.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${title} from CV`}
                    disabled={disabled}
                    onClick={() =>
                      onChange(value.filter((itemId) => itemId !== key))
                    }
                  >
                    <X size={15} />
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
