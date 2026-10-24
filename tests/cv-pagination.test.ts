import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import { createCvPdf } from "../src/features/cv/pdf";

test("Default CV stays within two pages and extracts keywords without ligature characters", async (t) => {
  if (
    spawnSync("pdfinfo", ["-v"]).error ||
    spawnSync("pdftotext", ["-v"]).error
  ) {
    t.skip("Install Poppler to run PDF pagination and text extraction checks");
    return;
  }
  const data = contentSchema.parse(initial);
  const pdf = await createCvPdf(data, data.cvs[0].id, "en");
  const info = spawnSync("pdfinfo", ["-"], { input: pdf });
  assert.equal(info.status, 0, info.stderr.toString());
  assert.equal(Number(info.stdout.toString().match(/Pages:\s+(\d+)/)?.[1]), 2);
  const extracted = spawnSync("pdftotext", ["-", "-"], { input: pdf });
  assert.equal(extracted.status, 0, extracted.stderr.toString());
  const text = extracted.stdout.toString("utf8");
  assert.doesNotMatch(text, /[\uFB00-\uFB06]/u);
  for (const keyword of [
    "workflow",
    "finance",
    "verification",
    "notifications",
  ])
    assert.ok(text.toLowerCase().includes(keyword), keyword);
  for (const heading of [
    "PROFESSIONAL EXPERIENCE",
    "SELECTED PROJECTS",
    "EDUCATION",
    "LANGUAGES",
  ])
    assert.ok(text.includes(heading), heading);
});
