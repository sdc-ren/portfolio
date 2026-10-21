"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  FolderKanban,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import { uniqueItemId } from "@/features/content/normalize";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, type Json } from "./editor-fields";
import { templates } from "./templates";
import {
  referencedBy,
  validateCollectionItem,
  type CollectionKey,
} from "./collections";
import styles from "./studio.module.scss";

type RecordValue = { id: string; [key: string]: Json };
const text = (value: Json | undefined) =>
  typeof value === "string" ? value : "";
function title(item: RecordValue) {
  return (
    text(item.title || item.company || item.name || item.institution) || item.id
  );
}

export function CollectionManager({
  section,
  data,
  disabled,
  onChange,
}: {
  section: CollectionKey;
  data: PortfolioContent;
  disabled: boolean;
  onChange: (items: Json[]) => void;
}) {
  const items = data[section] as unknown as RecordValue[];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState<RecordValue | null>(null);
  const [original, setOriginal] = useState<RecordValue | null>(null);
  const [error, setError] = useState("");
  const [discard, setDiscard] = useState(false);
  const [removing, setRemoving] = useState<RecordValue | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const changed = !!draft && JSON.stringify(draft) !== JSON.stringify(original);
  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => {
      if (changed) event.preventDefault();
    };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [changed]);
  const visible = items.filter((item) => {
    const matches = JSON.stringify(item)
      .toLowerCase()
      .includes(search.toLowerCase());
    return (
      matches &&
      (section !== "projects" ||
        filter === "all" ||
        (filter === "featured"
          ? item.featured === true
          : item.featured === false))
    );
  });
  const open = (item: RecordValue | null, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    const copy = item
      ? structuredClone(item)
      : (structuredClone(templates[section]) as RecordValue);
    if (!item) copy.id = uniqueItemId(copy.id, items);
    setOriginal(item ? structuredClone(item) : null);
    setDraft(copy);
    setError("");
  };
  const close = () => {
    if (changed) setDiscard(true);
    else setDraft(null);
  };
  const apply = () => {
    if (!draft) return;
    const result = validateCollectionItem(data, section, draft, original?.id);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const value = result.value as unknown as RecordValue;
    onChange(
      original
        ? items.map((item) => (item.id === original.id ? value : item))
        : [...items, value],
    );
    setDraft(null);
  };
  const move = (id: string, delta: number) => {
    const index = items.findIndex((item) => item.id === id);
    const next = [...items];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange(next);
  };
  const linked = removing ? referencedBy(data, section, removing.id) : [];
  return (
    <>
      <div className={styles.collectionToolbar}>
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-3 text-muted-foreground"
            aria-hidden="true"
          />
          <Label className="sr-only" htmlFor={`${section}-search`}>
            Search {section}
          </Label>
          <Input
            id={`${section}-search`}
            className="bg-card pl-9"
            placeholder={`Search ${section}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {section === "projects" && (
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger
              className="w-44 bg-card"
              aria-label="Filter projects"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="other">Not featured</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button
          disabled={disabled}
          onClick={(event) => open(null, event.currentTarget)}
        >
          <Plus size={16} />
          Add{" "}
          {
            {
              projects: "project",
              experience: "experience",
              skills: "skill group",
              education: "education",
              languages: "language",
              cvs: "CV",
            }[section]
          }
        </Button>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        {visible.length} of {items.length} records · Card order matches website
        order
      </p>
      <div className={styles.recordGrid}>
        {visible.map((item) => {
          const index = items.findIndex((record) => record.id === item.id);
          const references = referencedBy(data, section, item.id);
          return (
            <Card key={item.id} className={styles.recordCard}>
              <CardContent className="flex flex-1 flex-col p-0">
                <button
                  type="button"
                  disabled={disabled}
                  className={styles.cardOpen}
                  onClick={(event) => open(item, event.currentTarget)}
                  aria-label={`Edit ${title(item)}`}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span className={styles.recordIcon}>
                      <FolderKanban size={18} />
                    </span>
                    {item.featured === true && (
                      <Badge variant="secondary">
                        <Star size={12} />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {title(item)}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {text(
                      item.role ||
                        item.qualification ||
                        item.proficiency ||
                        item.period ||
                        item.specialties,
                    )}
                  </p>
                  {item.summary && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {text(item.summary)}
                    </p>
                  )}
                  {Array.isArray(item.items) && (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {item.items.join(" · ")}
                    </p>
                  )}
                  {Array.isArray(item.tech) && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.tech.slice(0, 4).map((tech) => (
                        <Badge key={String(tech)} variant="outline">
                          {String(tech)}
                        </Badge>
                      ))}
                      {item.tech.length > 4 && (
                        <Badge variant="outline">+{item.tech.length - 4}</Badge>
                      )}
                    </div>
                  )}
                  {item.category && (
                    <p className="mt-3 text-xs text-primary">
                      {text(item.category)}
                    </p>
                  )}
                </button>
              </CardContent>
              <CardFooter className="flex flex-wrap justify-between gap-2 border-t border-border px-4 pt-3">
                <span className="text-xs text-muted-foreground">
                  {references.length
                    ? `${references.length} CV reference${references.length > 1 ? "s" : ""}`
                    : `#${index + 1}`}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled || index === 0}
                    aria-label={`Move ${title(item)} up`}
                    onClick={() => move(item.id, -1)}
                  >
                    <ArrowUp size={14} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled || index === items.length - 1}
                    aria-label={`Move ${title(item)} down`}
                    onClick={() => move(item.id, 1)}
                  >
                    <ArrowDown size={14} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={disabled}
                    aria-label={`Edit ${title(item)}`}
                    onClick={(event) => open(item, event.currentTarget)}
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={
                      disabled || (section === "cvs" && items.length === 1)
                    }
                    aria-label={`Delete ${title(item)}`}
                    onClick={() => setRemoving(item)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {!visible.length && (
        <Card className="border-dashed border-border py-16 text-center">
          <CardContent>
            <FolderKanban className="mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold">
              {items.length ? "No matching records" : "No records yet"}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length
                ? "Try a different search or filter."
                : "Add your first record to start building this section."}
            </p>
          </CardContent>
        </Card>
      )}
      <Sheet
        open={!!draft}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <SheetContent
          className={styles.recordSheet}
          onInteractOutside={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            triggerRef.current?.focus();
          }}
        >
          <SheetHeader className="border-b border-border pr-12">
            <SheetTitle>
              {original
                ? `Edit ${title(original)}`
                : `Add ${section === "cvs" ? "CV" : section}`}
            </SheetTitle>
            <SheetDescription>
              Apply changes to this workspace, then save draft or publish from
              the toolbar.
            </SheetDescription>
          </SheetHeader>
          <div className={styles.sheetBody}>
            {draft && (
              <Field
                name={`${section}-item`}
                value={draft}
                disabled={disabled}
                lockId={!!original}
                onChange={(value) => {
                  setDraft(value as RecordValue);
                  setError("");
                }}
              />
            )}
            {original && (
              <p className={styles.fieldHint}>
                Existing IDs are locked to preserve URLs and CV references.
              </p>
            )}
            {error && (
              <p
                className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>
          <SheetFooter className="flex-row justify-end border-t border-border">
            <Button variant="outline" disabled={disabled} onClick={close}>
              Cancel
            </Button>
            <Button disabled={disabled} onClick={apply}>
              Apply changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Dialog open={discard} onOpenChange={setDiscard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Discard changes in this drawer?</DialogTitle>
            <DialogDescription>
              Your workspace content will stay as it was before opening this
              drawer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDiscard(false)}>
              Keep editing
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDiscard(false);
                setDraft(null);
              }}
            >
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!removing}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {linked.length
                ? "This record is used in a CV"
                : `Delete ${removing ? title(removing) : "record"}?`}
            </DialogTitle>
            <DialogDescription>
              {linked.length
                ? `Remove it from these CV selections first: ${linked.join(", ")}.`
                : "This removes the record from your workspace. Save draft or publish to persist the deletion."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoving(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={linked.length > 0 || disabled}
              onClick={() => {
                onChange(items.filter((item) => item.id !== removing?.id));
                setRemoving(null);
              }}
            >
              Delete record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
