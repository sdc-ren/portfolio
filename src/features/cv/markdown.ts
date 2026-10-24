import type { PortfolioContent } from "@/features/content/schema";
import { selectByIds } from "@/features/content/schema";
import { projectLinkLabel } from "@/features/content/project-link-label";
import { PORTFOLIO_URL } from "./contact";

/** CMS text is literal text, not executable Markdown/HTML. */
export function markdownText(value: string): string {
  return value
    .replace(/&(?=#\d+;|#x[\da-f]+;|[a-z][\da-z]+;)/gi, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/([\\`*_[\]{}()#+.!|~-])/g, "\\$1");
}
const inline = (value: string) =>
  markdownText(value.replace(/\s+/g, " ").trim());
const paragraph = (value: string) =>
  value.trim().split(/\r?\n/).map(markdownText).join("\n");
const link = (label: string, url: string) =>
  "[" +
  inline(label) +
  "](<" +
  url.replace(/[<>\s\\]/g, (c) => encodeURIComponent(c)) +
  ">)";
const bullets = (items: string[]) =>
  items.map((text) => "- " + paragraph(text).replace(/\n/g, "\n  ")).join("\n");

/** Uses the same selections, order and link visibility rules as the PDF template. */
export function cvMarkdown(data: PortfolioContent, variant: string): string {
  const cv = data.cvs.find((item) => item.id === variant);
  if (!cv) throw new Error("CV not found");
  const { profile, ui } = data;
  const section = (title: string, body: string) =>
    "## " + inline(title) + "\n\n" + body;
  const contact = [
    inline(profile.location),
    link(profile.email, "mailto:" + profile.email),
    profile.phone
      ? link(profile.phone, "tel:" + profile.phone.replace(/[^\d+]/g, ""))
      : "",
    ...[PORTFOLIO_URL, profile.linkedin, profile.github]
      .filter(Boolean)
      .map((url) => link(url, url)),
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    [
      "# " + inline(profile.name.toUpperCase()),
      "**" + inline(cv.title) + "**",
      inline(cv.specialties),
      contact,
      section(ui.cvSummary, paragraph(cv.summary)),
      section(
        ui.cvSkills,
        selectByIds(data.skills, cv.skillIds)
          .map(
            (skill) =>
              "- **" +
              inline(skill.name) +
              ":** " +
              skill.items.map(inline).join(", "),
          )
          .join("\n"),
      ),
      section(
        ui.cvExperience,
        selectByIds(data.experience, cv.experienceIds)
          .map((item) =>
            [
              "### " + inline(item.company) + " - " + inline(item.role),
              inline(item.period) + " · " + inline(item.location),
              bullets(item.highlights),
            ].join("\n\n"),
          )
          .join("\n\n"),
      ),
      section(
        ui.cvProjects,
        selectByIds(data.projects, cv.projectIds)
          .map((item) =>
            [
              "### " + inline(item.title),
              inline(item.role),
              ...item.links
                .filter((entry) => entry.showInCv)
                .map((entry) => link(projectLinkLabel(entry, ui), entry.url)),
              item.tech.map(inline).join(" · "),
              bullets(item.highlights),
            ]
              .filter(Boolean)
              .join("\n\n"),
          )
          .join("\n\n"),
      ),
      section(
        ui.cvEducation,
        data.education
          .map(
            (item) =>
              "- **" +
              inline(item.institution) +
              "**" +
              (item.location ? ", " + inline(item.location) : "") +
              " - " +
              inline(item.qualification) +
              ", " +
              inline(item.year),
          )
          .join("\n"),
      ),
      section(
        ui.cvLanguages,
        data.languages
          .map(
            (item) =>
              "- **" + inline(item.name) + ":** " + inline(item.proficiency),
          )
          .join("\n"),
      ),
    ].join("\n\n") + "\n"
  );
}
