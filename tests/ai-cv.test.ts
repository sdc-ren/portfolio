import { test } from "node:test";
import assert from "node:assert/strict";
import initial from "../src/data/initial-content.json";
import { initialContent } from "../src/features/content/seed-content";
import { cvMarkup } from "../src/features/cv/markup";
import { cvMarkdown } from "../src/features/cv/markdown";

test("AI CV and localmem seed preserve the software CV and resolve selections", () => {
  const data = initialContent();
  assert.equal(data.cvs.length, 2);
  assert.deepEqual(data.cvs[0], initial.cvs[0]);
  const ai = data.cvs.find((cv) => cv.id === "ai-engineer")!;
  assert.equal(ai.projectIds[0], "localmem");
  assert.deepEqual(ai.projectIds, [
    "localmem",
    "gdrive-cli",
    "cc-notify-telegram",
    "altfins",
  ]);
  const project = data.projects.find((p) => p.id === "localmem")!;
  assert.equal(project.links[0].url, "https://github.com/sdc-ren/localmem");
  assert.ok(project.links[0].showInCv);
  for (const render of [cvMarkup, cvMarkdown]) {
    const aiOutput = render(data, "ai-engineer");
    assert.ok(aiOutput.includes("AI ENGINEER"));
    assert.ok(aiOutput.includes("localmem"));
    assert.ok(aiOutput.includes("SQLite"));
    assert.ok(!render(data, "senior-software-engineer").includes("localmem"));
  }
});

test("AI project summaries, details and CV exports share evidence-based technical copy", () => {
  const data = initialContent();
  const md = cvMarkdown(data, "ai-engineer");
  const html = cvMarkup(data, "ai-engineer");
  const memory = data.projects.find((p) => p.id === "localmem")!;
  assert.equal(memory.highlights.length, 4);
  assert.ok(memory.summary.includes("FTS5/BM25"));
  assert.ok(memory.description.includes("not embedding-based semantic search"));
  for (const keyword of [
    "Model Context Protocol",
    "human-in-the-loop",
    "session-aware",
    "recall@k",
    "MRR",
    "service-account",
  ]) {
    assert.ok(md.replaceAll("\\", "").includes(keyword), keyword);
    assert.ok(html.includes(keyword), keyword);
  }
  for (const id of ["gdrive-cli", "cc-notify-telegram", "altfins"]) {
    const project = data.projects.find((p) => p.id === id)!;
    assert.ok(project.description.length > project.summary.length);
    assert.ok(
      project.highlights.every((h) =>
        html.includes(h.replaceAll("&", "&amp;")),
      ),
    );
  }
  assert.equal(
    data.projects.find((p) => p.id === "altfins")!.highlights.length,
    2,
  );
});
