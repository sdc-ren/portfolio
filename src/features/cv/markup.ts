import { PORTFOLIO_URL } from "./contact";
import type { PortfolioContent } from "@/features/content/schema";
import { projectLinkLabel } from "@/features/content/project-link-label";
import { selectByIds } from "@/features/content/schema";

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
}
export function displayUrl(value: string) {
  return value.replace(/^https?:\/\/(?:www\.)?/, "").replace(/\/$/, "");
}

/** One escaped, semantic template drives both the web document and the PDF print renderer. */
export function cvMarkup(data: PortfolioContent, variant: string) {
  const cv = data.cvs.find((item) => item.id === variant);
  if (!cv) throw new Error("CV not found");
  const e = escapeHtml;
  const link = (href: string, label: string) =>
    `<a href="${e(href)}">${e(label)}</a>`;
  const bullets = (items: string[]) =>
    `<ul>${items.map((item) => `<li>${e(item)}</li>`).join("")}</ul>`;
  const section = (title: string, content: string, className = "") =>
    `<section${className ? ` class="${className}"` : ""}><h2>${e(title)}</h2>${content}</section>`;
  return `<header>
<h1>${e(data.profile.name.toUpperCase())}</h1>
<div class="cv-job-title">${e(cv.title)}</div>
<p class="cv-specialties">${e(cv.specialties)}</p>
<div class="cv-contact"><span>${e(data.profile.location)}</span><span>${link(`mailto:${data.profile.email}`, data.profile.email)}</span><span>${link(`tel:${data.profile.phone.replace(/[^\d+]/g, "")}`, data.profile.phone)}</span>${[
    PORTFOLIO_URL,
    data.profile.linkedin,
    data.profile.github,
  ]
    .filter(Boolean)
    .map((url) => `<span>${link(url, displayUrl(url))}</span>`)
    .join("")}</div>
</header>
${section(data.ui.cvSummary, `<p>${e(cv.summary)}</p>`)}
${section(
  data.ui.cvSkills,
  selectByIds(data.skills, cv.skillIds)
    .map(
      (skill) =>
        `<div class="cv-skill-item"><b>${e(skill.name)}: </b>${e(skill.items.join(", "))}</div>`,
    )
    .join(""),
)}
${section(
  data.ui.cvExperience,
  selectByIds(data.experience, cv.experienceIds)
    .map(
      (item) =>
        `<article class="cv-entry"><div class="cv-entry-head"><h3>${e(item.company)} - ${e(item.role)}</h3><span class="cv-date">${e(item.period)}</span></div><div class="cv-subhead">${e(item.location)}</div>${bullets(item.highlights)}</article>`,
    )
    .join(""),
)}
${section(
  data.ui.cvProjects,
  selectByIds(data.projects, cv.projectIds)
    .map(
      (item) =>
        `<article class="cv-entry"><div class="cv-entry-head"><h3>${e(item.title)}</h3><span class="cv-date">${e(item.role)}</span></div>${item.links
          .filter((item) => item.showInCv)
          .map(
            (item) =>
              `<p class="cv-project-link">${link(item.url, `${projectLinkLabel(item, data.ui)}: ${displayUrl(item.url)}`)}</p>`,
          )
          .join(
            "",
          )}<p class="cv-project-tech">${e(item.tech.join(" · "))}</p>${bullets(item.highlights)}</article>`,
    )
    .join(""),
  "cv-page-start",
)}
${section(data.ui.cvEducation, data.education.map((item) => `<p><b>${e(item.institution)}</b>${item.location ? `, ${e(item.location)}` : ""} - ${e(item.qualification)}, ${e(item.year)}</p>`).join(""))}
${section(data.ui.cvLanguages, data.languages.map((item) => `<p><b>${e(item.name)}:</b> ${e(item.proficiency)}</p>`).join(""))}`;
}
