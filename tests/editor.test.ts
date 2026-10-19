import { test } from "node:test";
import assert from "node:assert/strict";
import { contentSchema } from "../src/features/content/schema";
import initial from "../src/data/initial-content.json";
import {
  normalizeContentInput,
  uniqueItemId,
} from "../src/features/content/normalize";
import {
  defaultUiForLocale,
  formatProjectCount,
} from "../src/features/content/ui";
test("Existing documents without UI labels remain readable", () => {
  const { ui, ...oldDocument } = initial;
  const parsed = contentSchema.parse(oldDocument);
  assert.equal(parsed.ui.cvSummary, "Professional Summary");
});
test("Vietnamese UI labels and project counts use locale defaults", () => {
  const labels = defaultUiForLocale("vi");
  assert.equal(labels.downloadPdf, "Tải PDF");
  assert.equal(formatProjectCount(labels, 2), "2 dự án");
  assert.equal(formatProjectCount(defaultUiForLocale("en"), 1), "1 project");
});
test("Multiline input ignores blank lines without altering Markdown paragraphs", () => {
  assert.deepEqual(
    normalizeContentInput({
      tech: ["Vue", "", " React  "],
      description: "a\n\nb",
    }),
    { tech: ["Vue", "React"], description: "a\n\nb" },
  );
});
test("Adding several records generates distinct stable IDs", () => {
  assert.equal(
    uniqueItemId("new-project", [
      { id: "new-project" },
      { id: "new-project-2" },
    ]),
    "new-project-3",
  );
});
test("Duplicate references cannot publish a CV", () => {
  const d = structuredClone(initial);
  d.cvs[0].projectIds.push(d.cvs[0].projectIds[0]);
  assert.equal(contentSchema.safeParse(d).success, false);
});
