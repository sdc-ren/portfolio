"use client";
import { useId, useState } from "react";
import { formatProjectCount, type UiLabels } from "@/features/content/ui";
import type { PortfolioContent } from "@/features/content/schema";
import { ProjectCard } from "./project-card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
export function ProjectList({
  projects,
  labels,
}: {
  projects: PortfolioContent["projects"];
  labels: UiLabels;
}) {
  const fieldId = useId();
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
        <div className="space-y-2">
          <Label htmlFor={`${fieldId}-search`}>{labels.searchProjects}</Label>
          <Input
            id={`${fieldId}-search`}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${fieldId}-tech`}>{labels.technology}</Label>
          <Select
            value={tech ? `tech:${tech}` : "all"}
            onValueChange={(value) =>
              setTech(value === "all" ? "" : value.slice(5))
            }
          >
            <SelectTrigger tooltip={labels.technology} id={`${fieldId}-tech`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{labels.allTechnologies}</SelectItem>
              {techs.map((t) => (
                <SelectItem key={t} value={`tech:${t}`}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {formatProjectCount(labels, shown.length)}
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        {shown.map((p, i) => (
          <ProjectCard key={p.id} project={p} labels={labels} index={i} />
        ))}
      </div>
      {!shown.length && (
        <p className="py-12 text-muted-foreground">{labels.noProjects}</p>
      )}
    </>
  );
}
