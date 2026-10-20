import { publicPath } from "@/lib/public-path";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioContent } from "@/features/content/schema";
export function ProjectCard({
  project,
  locale,
  index = 0,
}: {
  project: PortfolioContent["projects"][number];
  locale: string;
  index?: number;
}) {
  return (
    <Link
      href={publicPath(locale, `/projects/${project.id}`)}
      className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-colors hover:border-primary/40 hover:bg-muted"
    >
      <div className="mb-8 flex items-center justify-between text-xs uppercase tracking-widest text-muted-foreground">
        <span>{project.category}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mb-4 flex items-start justify-between gap-4 text-xl font-semibold text-foreground">
        {project.title.split(" — ")[0]}
        <ArrowUpRight size={20} className="shrink-0 text-primary" />
      </h3>
      <p className="mb-6 text-sm leading-7 text-muted-foreground">
        {project.summary}
      </p>
      <div className="mt-auto flex flex-wrap gap-2">
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
