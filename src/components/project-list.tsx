"use client";
import { useState } from "react";
import type { PortfolioContent } from "@/features/content/schema";
import { ProjectCard } from "./project-card";
export function ProjectList({
  projects,
  locale,
}: {
  projects: PortfolioContent["projects"];
  locale: string;
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
          <span>Search projects</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, role or description…"
          />
        </label>
        <label>
          <span>Technology</span>
          <select value={tech} onChange={(e) => setTech(e.target.value)}>
            <option value="">All technologies</option>
            {techs.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 text-sm text-slate-500" aria-live="polite">
        {shown.length} projects
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((p, i) => (
          <ProjectCard key={p.id} project={p} locale={locale} index={i} />
        ))}
      </div>
      {!shown.length && (
        <p className="py-12 text-slate-400">No projects match your filters.</p>
      )}
    </>
  );
}
