import Link from "next/link";
import { selectByIds, type PortfolioContent } from "@/features/content/schema";
import { publicPath } from "@/lib/public-path";

export function SkillsOverview({
  data,
  locale,
}: {
  data: PortfolioContent;
  locale: string;
}) {
  const groups = data.settings.websiteSkillIds.length
    ? selectByIds(data.skills, data.settings.websiteSkillIds)
    : data.skills;
  const research = groups.filter((s) => s.stage === "research");
  return (
    <>
      <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        {groups
          .filter((s) => s.stage !== "research")
          .map((group) => (
            <section
              key={group.id}
              className="min-w-0 border-t border-border pt-4"
            >
              <h3 className="font-semibold text-foreground">{group.name}</h3>
              {group.description && (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {group.description}
                </p>
              )}
              <ul
                className="mt-3 flex flex-wrap gap-1.5"
                aria-label={group.name}
              >
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              {group.projectIds.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span className="text-muted-foreground">
                    {locale.startsWith("vi")
                      ? "Dự án minh chứng:"
                      : "Project evidence:"}
                  </span>
                  {selectByIds(data.projects, group.projectIds).map(
                    (project) => (
                      <Link
                        key={project.id}
                        href={publicPath(locale, `/projects/${project.id}`)}
                        className="text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        {project.title.split(" - ")[0]}
                      </Link>
                    ),
                  )}
                </div>
              )}
            </section>
          ))}
      </div>
      {research.length > 0 && (
        <aside className="mt-8 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
          <h3 className="font-medium text-foreground">
            {locale.startsWith("vi")
              ? "Đang nghiên cứu / thử nghiệm"
              : "Research / Exploration"}
          </h3>
          <p className="mt-1">{research.flatMap((s) => s.items).join(" · ")}</p>
        </aside>
      )}
    </>
  );
}
