"use client";
import {
  ArrowRight,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  Languages,
  Star,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { PortfolioContent } from "@/features/content/schema";
import type { Section } from "./navigation";
import styles from "./studio.module.scss";
export function Overview({
  data,
  locales,
  onSelect,
  publishedAt,
}: {
  data: PortfolioContent;
  locales: string[];
  onSelect: (section: Section) => void;
  publishedAt: string | null;
}) {
  const stats = [
    {
      label: "Projects",
      value: data.projects.length,
      note: `${data.projects.filter((item) => item.featured).length} featured on homepage`,
      icon: FolderKanban,
      section: "projects",
    },
    {
      label: "Experience",
      value: data.experience.length,
      note: "Professional roles",
      icon: BriefcaseBusiness,
      section: "experience",
    },
    {
      label: "CV documents",
      value: data.cvs.length,
      note: "Shared content and PDF exports",
      icon: FileText,
      section: "cvs",
    },
    {
      label: "Translations",
      value: locales.length,
      note: "Configured content languages",
      icon: Languages,
      section: "translations",
    },
  ] as const;
  return (
    <div className="space-y-6">
      <div className={styles.statsGrid}>
        {stats.map(({ label, value, note, icon: Icon, section }) => (
          <Card key={label} className="border-border">
            <CardHeader className="flex flex-row items-start justify-between">
              <CardDescription>{label}</CardDescription>
              <Icon size={18} className="text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{note}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 -ml-3"
                onClick={() => onSelect(section)}
              >
                Manage <ArrowRight size={14} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className={styles.overviewGrid}>
        <Card className="border-border">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle>Project library</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelect("projects")}
              >
                Manage projects <ArrowRight size={14} />
              </Button>
            </div>
            <CardDescription>
              Project order and featured selection in this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {data.projects.slice(0, 5).map((project) => (
              <button
                key={project.id}
                type="button"
                className={styles.overviewRow}
                onClick={() => onSelect("projects")}
              >
                <span className={styles.recordIcon}>
                  <FolderKanban size={16} />
                </span>
                <span className="min-w-0 flex-1 text-left">
                  <span className="block truncate text-sm font-medium">
                    {project.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {project.role}
                  </span>
                </span>
                {project.featured && (
                  <Badge variant="secondary">
                    <Star size={12} />
                    Featured
                  </Badge>
                )}
                <ArrowRight
                  size={14}
                  className="shrink-0 text-muted-foreground"
                />
              </button>
            ))}
            {!data.projects.length && (
              <p className="py-8 text-sm text-muted-foreground">
                Add a project to start your portfolio.
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Publishing workflow</CardTitle>
            <CardDescription>
              Content stays private until you publish it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className={styles.workflow}>
              <li>
                <span>1</span>
                <div>
                  <strong>Edit content</strong>
                  <p>Use cards and drawers to update one record at a time.</p>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Save a draft</strong>
                  <p>
                    Store your workspace changes without changing the public
                    website.
                  </p>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Preview & publish</strong>
                  <p>
                    Review your CV, then publish the current language to the
                    website and PDF.
                  </p>
                </div>
              </li>
            </ol>
            <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
              {publishedAt
                ? `Last published: ${new Date(publishedAt).toISOString().replace("T", " ").slice(0, 16)} UTC`
                : "This language has not been published."}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
