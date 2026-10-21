import assert from "node:assert/strict";
import { test } from "node:test";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import {
  referencedBy,
  validateCollectionItem,
} from "../src/features/admin/collections";
const data = contentSchema.parse(initial);

test("Drawer rejects duplicate IDs and changes to existing stable IDs", () => {
  assert.equal(
    validateCollectionItem(data, "projects", data.projects[0]).ok,
    false,
  );
  assert.equal(
    validateCollectionItem(
      data,
      "projects",
      { ...data.projects[0], id: "changed" },
      data.projects[0].id,
    ).ok,
    false,
  );
  assert.equal(
    validateCollectionItem(
      data,
      "projects",
      { ...data.projects[0], summary: "Updated summary" },
      data.projects[0].id,
    ).ok,
    true,
  );
});
test("Drawer validates URLs and required project fields before applying", () => {
  assert.equal(
    validateCollectionItem(
      data,
      "projects",
      { ...data.projects[0], repository: "javascript:alert(1)" },
      data.projects[0].id,
    ).ok,
    false,
  );
  assert.equal(
    validateCollectionItem(
      data,
      "projects",
      { ...data.projects[0], title: "" },
      data.projects[0].id,
    ).ok,
    false,
  );
});
test("Applying a drawer record normalizes lists without mutating workspace data", () => {
  const input = { ...data.projects[0], tech: [" React ", "", "TypeScript"] };
  const before = structuredClone(data);
  const result = validateCollectionItem(data, "projects", input, input.id);
  assert.equal(result.ok, true);
  if (result.ok)
    assert.deepEqual((result.value as typeof input).tech, [
      "React",
      "TypeScript",
    ]);
  assert.deepEqual(data, before);
  assert.deepEqual(input.tech, [" React ", "", "TypeScript"]);
});
test("Deletion guard reports CVs that use a record and ignores unrelated collections", () => {
  const cv = data.cvs[0];
  assert.ok(
    referencedBy(data, "projects", cv.projectIds[0]).includes(cv.title),
  );
  assert.ok(
    referencedBy(data, "experience", cv.experienceIds[0]).includes(cv.title),
  );
  assert.ok(referencedBy(data, "skills", cv.skillIds[0]).includes(cv.title));
  assert.deepEqual(referencedBy(data, "education", data.education[0].id), []);
});
test("CV drawer checks missing references and collection limits", () => {
  const cv = data.cvs[0];
  assert.equal(
    validateCollectionItem(
      data,
      "cvs",
      { ...cv, projectIds: ["missing-project"] },
      cv.id,
    ).ok,
    false,
  );
  const full = {
    ...data,
    cvs: Array.from({ length: 10 }, (_, i) => ({ ...cv, id: `cv-${i}` })),
  };
  assert.equal(
    validateCollectionItem(full, "cvs", { ...cv, id: "cv-over-limit" }).ok,
    false,
  );
  assert.equal(validateCollectionItem(data, "projects", null).ok, false);
});
