"use client";
import { useState } from "react";
import { formatProjectCount, type UiLabels } from "@/features/content/ui";
import type { PortfolioContent } from "@/features/content/schema";
import { ProjectCard } from "./project-card";
export function ProjectList({
  projects,
  locale,
  labels,
}: {
  projects: PortfolioContent["projects"];
  locale: string;
  labels: UiLabels;
}) {
  const [search, setSearch] = useState(""),
    [tech, setTech] = useState("");
  const techs = [...new Set(projects.flatMap((p) => p.tech))].sort();
  const shown = projects.filter(
    (p) =>
      (!tech || p.tech.includes(tech)) &&
      `${p.title} ${p.summary} ${p.role}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <label>
          <span>{labels.searchProjects}</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
          />
        </label>
        <label>
          <span>{labels.technology}</span>
          <select value={tech} onChange={(e) => setTech(e.target.value)}>
            <option value="">{labels.allTechnologies}</option>
            {techs.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {formatProjectCount(labels, shown.length)}
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((p, i) => (
          <ProjectCard key={p.id} project={p} locale={locale} index={i} />
        ))}
      </div>
      {!shown.length && (
        <p className="py-12 text-muted-foreground">{labels.noProjects}</p>
      )}
    </>
  );
}
