import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { initialContent } from "../src/features/content/seed-content";
import { contentSchema } from "../src/features/content/schema";
import { experienceBullets } from "../src/features/content/experience";
import { cvExperience } from "../src/features/cv/selection";
import { cvMarkup } from "../src/features/cv/markup";
import { cvMarkdown } from "../src/features/cv/markdown";
import { SkillsOverview } from "../src/components/skills-overview";
import {
  referencedBy,
  validateCollectionItem,
} from "../src/features/admin/collections";

test("Website keeps shared facts; CVs share professional evidence with different section order", () => {
  const data = initialContent();
  const lead = data.experience[0];
  assert.equal(experienceBullets(lead).length, 6);
  const ai = data.cvs.find((c) => c.id === "ai-engineer")!;
  const senior = data.cvs.find((c) => c.id === "senior-software-engineer")!;
  assert.equal(cvExperience(data, ai)[0].highlights.length, 5);
  assert.equal(cvExperience(data, senior)[0].highlights.length, 5);
  assert.deepEqual(cvExperience(data, ai), cvExperience(data, senior));
  for (const render of [cvMarkup, cvMarkdown]) {
    const aiText = render(data, ai.id),
      seniorText = render(data, senior.id);
    assert.ok(
      aiText.indexOf(ai.projectsHeading) < aiText.indexOf(data.ui.cvExperience),
    );
    assert.ok(
      seniorText.indexOf(data.ui.cvExperience) <
        seniorText.indexOf(data.ui.cvProjects),
    );
  }
});

test("Stable bullet IDs survive source reordering/edits; deleting a selected fact is blocked", () => {
  const data = initialContent();
  const ai = data.cvs.find((c) => c.id === "ai-engineer")!;
  const first = data.experience[0];
  first.bullets.reverse();
  first.bullets.find((b) => b.id === "bullet-1")!.text =
    "Updated shared leadership fact";
  const normalized = contentSchema.parse(data);
  assert.equal(
    cvExperience(normalized, ai)[0].highlights[0],
    "Updated shared leadership fact",
  );
  const result = validateCollectionItem(
    normalized,
    "experience",
    { ...first, bullets: first.bullets.filter((b) => b.id !== "bullet-1") },
    first.id,
  );
  assert.equal(result.ok, false);
  const bad = structuredClone(normalized);
  bad.cvs[1].experienceSelections[first.id] = ["missing"];
  assert.equal(contentSchema.safeParse(bad).success, false);
});

test("Skills overview shows six evidence-linked groups and separate research, with locale-safe URLs", () => {
  const data = initialContent();
  const selected = data.skills.filter((s) =>
    data.settings.websiteSkillIds.includes(s.id),
  );
  assert.equal(selected.filter((s) => s.stage === "applied").length, 6);
  assert.equal(selected.filter((s) => s.stage === "research").length, 1);
  const html = renderToStaticMarkup(
    createElement(SkillsOverview, { data, locale: "vi" }),
  );
  assert.ok(html.includes('href="/vi/projects/localmem"'));
  assert.ok(html.includes('href="/vi/projects/ivr-studio"'));
  assert.ok(html.includes("Đang nghiên cứu / thử nghiệm"));
  assert.ok(!html.includes("90%"));
  assert.ok(
    referencedBy(data, "projects", "ivr-studio").some((s) =>
      s.startsWith("Skill evidence:"),
    ),
  );
  assert.ok(
    referencedBy(data, "skills", "expertise-frontend").includes(
      "Website skill groups",
    ),
  );
});
