"use client";
import { publicPath } from "@/lib/public-path";
import {
  createContext,
  useContext,
  useId,
  useEffect,
  useState,
  useTransition,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
import { saveContent, createLocale } from "./actions";
import { Button } from "@/components/ui/button";
import {
  normalizeContentInput,
  uniqueItemId,
} from "@/features/content/normalize";
import { CvDocument } from "@/features/cv/document";
type Json = string | boolean | Json[] | { [key: string]: Json };
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
const large = new Set(["summary", "description", "highlights"]);
const templates: Record<string, Json> = {
  projects: {
    id: "new-project",
    title: "New project",
    role: "Developer",
    category: "Product engineering",
    summary: "Describe the project.",
    description: "Describe the problem, approach and outcomes.",
    tech: [],
    highlights: [],
    repository: "",
    demo: "",
    featured: false,
  },
  experience: {
    id: "new-experience",
    company: "Company",
    role: "Role",
    period: "2026 – Present",
    location: "Location",
    highlights: [],
  },
  skills: { id: "new-skill", name: "Skill group", items: [] },
  education: {
    id: "new-education",
    institution: "Institution",
    qualification: "Qualification",
    year: "2026",
  },
  languages: {
    id: "new-language",
    name: "Language",
    proficiency: "Proficiency",
  },
  cvs: {
    id: "new-cv",
    title: "CV title",
    summary: "Professional summary",
    specialties: "Specialties",
    projectIds: [],
    skillIds: [],
    experienceIds: [],
  },
};
const ContentContext = createContext<PortfolioContent | null>(null);
function Field({
  name,
  value,
  onChange,
  disabled = false,
}: {
  name: string;
  value: Json;
  onChange: (v: Json) => void;
  disabled?: boolean;
}) {
  const content = useContext(ContentContext);
  const fieldId = useId();
  const label =
    labels[name] ??
    name.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  if (typeof value === "boolean")
    return (
      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label}
      </label>
    );
  if (typeof value === "string")
    return (
      <label>
        <span>{label}</span>
        {large.has(name) ? (
          <textarea
            rows={name === "description" ? 7 : 4}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <>
            <input
              value={value}
              disabled={disabled}
              list={name === "role" ? fieldId : undefined}
              onChange={(e) => onChange(e.target.value)}
            />
            {name === "role" && (
              <datalist id={fieldId}>
                {content?.roles.map((role) => (
                  <option key={role} value={role} />
                ))}
              </datalist>
            )}
          </>
        )}
      </label>
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
              <label key={item.id} className="flex items-start gap-3">
                <input
                  className="mt-1"
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={(e) =>
                    onChange(
                      e.target.checked
                        ? [...selected, item.id]
                        : selected.filter((id) => id !== item.id),
                    )
                  }
                />
                {labelFor(item)}
              </label>
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

    const objects =
      !!templates[name] ||
      value.some((v) => typeof v === "object" && !Array.isArray(v));
    if (!objects)
      return (
        <div>
          <label>
            <span>{label} · one per line</span>
            <textarea
              rows={4}
              value={(value as string[]).join("\n")}
              disabled={disabled}
              onChange={(e) => onChange(e.target.value.split("\n"))}
            />
          </label>
          {name === "tech" && (
            <span className="mt-3 flex flex-wrap gap-2">
              {content?.technologies
                .filter((tech) => !(value as string[]).includes(tech))
                .map((tech) => (
                  <Button
                    key={tech}
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={disabled}
                    onClick={() =>
                      onChange([...(value as string[]).filter(Boolean), tech])
                    }
                  >
                    + {tech}
                  </Button>
                ))}
            </span>
          )}
        </div>
      );
    const move = (i: number, delta: number) => {
      const next = [...value];
      [next[i], next[i + delta]] = [next[i + delta], next[i]];
      onChange(next);
    };
    return (
      <div className="space-y-5">
        {value.map((v, i) => (
          <fieldset
            key={i}
            className="rounded-xl border border-border p-5"
            disabled={disabled}
          >
            <legend className="px-2 text-xs text-primary">
              {name} {i + 1}
            </legend>
            <div className="mb-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={i === 0}
                aria-label={`Move item ${i + 1} up`}
                onClick={() => move(i, -1)}
              >
                <ArrowUp size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={i === value.length - 1}
                aria-label={`Move item ${i + 1} down`}
                onClick={() => move(i, 1)}
              >
                <ArrowDown size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (
                    window.confirm(
                      "Remove this item? Update any CV references before saving.",
                    )
                  )
                    onChange(value.filter((_, j) => i !== j));
                }}
              >
                <Trash2 size={16} />
                Remove
              </Button>
            </div>
            <Field
              name={`${name}-item`}
              value={v}
              onChange={(v) =>
                onChange(value.map((old, j) => (j === i ? v : old)))
              }
            />
          </fieldset>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => {
            const item = structuredClone(templates[name]) as { id: string };
            item.id = uniqueItemId(item.id, value as { id: string }[]);
            onChange([...value, item]);
          }}
        >
          <Plus size={16} />
          Add {name}
        </Button>
      </div>
    );
  }
  return (
    <div className="grid gap-5">
      {Object.entries(value).map(([key, v]) => (
        <Field
          key={key}
          name={key}
          value={v}
          disabled={disabled}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  );
}
export function Editor({
  initial,
  locale,
  locales,
  revision: initialRevision,
  publishedAt,
}: {
  initial: PortfolioContent;
  locale: string;
  locales: string[];
  revision: number;
  publishedAt: string | null;
}) {
  const [data, setData] = useState(initial),
    [revision, setRevision] = useState(initialRevision),
    [tab, setTab] = useState<keyof PortfolioContent>("profile"),
    [dirty, setDirty] = useState(false),
    [status, setStatus] = useState(""),
    [preview, setPreview] = useState(false),
    [previewCv, setPreviewCv] = useState(initial.cvs[0].id),
    [newLocale, setNewLocale] = useState(""),
    [pending, start] = useTransition();
  const router = useRouter();
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  const save = (publish: boolean) =>
    start(async () => {
      setStatus("");
      try {
        const normalized = normalizeContentInput(data) as PortfolioContent;
        const r = await saveContent({
          locale,
          revision,
          publish,
          data: normalized,
        });
        if (r.ok && r.revision !== undefined) {
          setData(normalized);
          setRevision(r.revision);
          setDirty(false);
          setStatus(
            publish
              ? "Published. Website and PDF now use this version."
              : "Draft saved. Public website is unchanged.",
          );
        } else setStatus(r.error ?? "Could not save.");
      } catch {
        setStatus(
          "Save failed. Your edits remain here; check your session and retry.",
        );
      }
    });
  const addLanguage = () =>
    start(async () => {
      try {
        const r = await createLocale({ locale: newLocale, source: locale });
        if (r.ok) router.push(`/admin?locale=${newLocale}`);
        else setStatus(r.error ?? "Could not create language.");
      } catch {
        setStatus(
          "Use a locale such as vi, en or ja. Check your session and retry.",
        );
      }
    });
  return (
    <>
      <div className="sticky top-0 z-20 mb-8 flex flex-wrap items-center justify-between gap-4 border-y border-border bg-background/95 py-4">
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="locale">
            Editing language
          </label>
          <select
            id="locale"
            value={locale}
            disabled={pending}
            onChange={(e) => {
              if (!dirty || window.confirm("Discard unsaved changes?"))
                router.push(`/admin?locale=${e.target.value}`);
            }}
          >
            {locales.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <span className="whitespace-nowrap text-xs text-muted-foreground">
            {dirty ? "Unsaved changes" : `Revision ${revision}`}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Edit content" : "Preview draft"}
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => save(false)}
          >
            Save draft
          </Button>
          <Button disabled={pending} onClick={() => save(true)}>
            {pending ? "Working…" : "Publish"}
          </Button>
        </div>
      </div>
      <p role="status" aria-live="polite" className="mb-5 text-sm text-primary">
        {status}
      </p>
      {preview ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Draft preview. Save or publish to validate references.
          </p>
          <select
            aria-label="Preview CV"
            value={previewCv}
            onChange={(e) => setPreviewCv(e.target.value)}
          >
            {data.cvs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          {data.cvs.some((c) => c.id === previewCv) && (
            <CvDocument data={data} variant={previewCv} />
          )}
        </>
      ) : (
        <div className="grid items-start gap-8 md:grid-cols-[210px_1fr]">
          <aside className="space-y-1">
            <nav aria-label="Content sections">
              {(Object.keys(data) as (keyof PortfolioContent)[]).map((key) => (
                <button
                  key={key}
                  disabled={pending}
                  onClick={() => setTab(key)}
                  aria-current={tab === key ? "page" : undefined}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm capitalize ${tab === key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                >
                  {key}
                </button>
              ))}
            </nav>
            <div className="border-t border-border pt-5">
              <label>
                <span>Add translation locale</span>
                <input
                  placeholder="vi"
                  value={newLocale}
                  disabled={pending}
                  onChange={(e) => setNewLocale(e.target.value)}
                />
              </label>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                disabled={pending || dirty || !newLocale}
                onClick={addLanguage}
              >
                Create draft language
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Copies current draft. Translate before publishing. Save your
                edits first.
              </p>
            </div>
            <Link
              href={publicPath(locale)}
              className="mt-6 block px-4 text-sm text-primary"
            >
              Open published site ↗
            </Link>
          </aside>
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="mb-6 text-2xl font-semibold capitalize">{tab}</h2>
            {tab === "cvs" && (
              <p className="mb-6 text-sm text-muted-foreground">
                Select shared projects, skills and experience. Use the arrows to
                set their order in this CV.
              </p>
            )}
            <ContentContext.Provider value={data}>
              <Field
                name={tab}
                value={data[tab] as Json}
                disabled={pending}
                onChange={(v) => {
                  setData({ ...data, [tab]: v });
                  setDirty(true);
                }}
              />
            </ContentContext.Provider>
          </section>
        </div>
      )}
      <p className="mt-8 text-xs text-muted-foreground">
        {publishedAt
          ? `Published content exists · loaded ${new Date(publishedAt).toISOString()}`
          : "This language has not been published."}{" "}
        · Public pages and PDFs use published content only.
      </p>
    </>
  );
}
