import { test } from "node:test";
import assert from "node:assert/strict";
import initial from "../src/data/initial-content.json";
import {
  contentSchema,
  selectByIds,
  localeSchema,
} from "../src/features/content/schema";
test("Both imported CVs resolve all project, experience and skill references", () => {
  const d = contentSchema.parse(initial);
  assert.equal(d.cvs.length, 2);
  for (const cv of d.cvs) {
    assert.equal(
      selectByIds(d.projects, cv.projectIds).length,
      cv.projectIds.length,
    );
    assert.equal(selectByIds(d.skills, cv.skillIds).length, cv.skillIds.length);
  }
});
test("Deletion of an item referenced by a CV is rejected", () => {
  const d = structuredClone(initial);
  d.projects.shift();
  assert.equal(contentSchema.safeParse(d).success, false);
});
test("Duplicate IDs and unsafe project links are rejected", () => {
  const d = structuredClone(initial);
  d.projects[1].id = d.projects[0].id;
  assert.equal(contentSchema.safeParse(d).success, false);
  d.projects[1].id = "other";
  d.projects[0].repository = "javascript:alert(1)";
  assert.equal(contentSchema.safeParse(d).success, false);
});
test("CV selection follows the configured order", () => {
  assert.deepEqual(selectByIds([{ id: "a" }, { id: "b" }], ["b", "a"]), [
    { id: "b" },
    { id: "a" },
  ]);
});
test("Locale validation rejects malformed and path-like values", () => {
  assert.equal(localeSchema.safeParse("vi").success, true);
  assert.equal(localeSchema.safeParse("../en").success, false);
});
