import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { contentSchema, projectSchema } from "../src/features/content/schema";
import { initialContent } from "../src/features/content/seed-content";
import initial from "../src/data/initial-content.json";

test("Project focus is explicit, optional for legacy records and validated", () => {
  assert.equal(contentSchema.parse(initial).projects[0].focus, "");
  const project = initialContent().projects.find((p) => p.id === "ivr-studio")!;
  assert.equal(
    projectSchema.safeParse({ ...project, focus: "random-ai" }).success,
    false,
  );
  assert.equal(projectSchema.parse({ ...project, focus: "" }).focus, "");
});

test("Cards label agent/speech/automation projects distinctly and omit unclassified badges", async () => {
  const hook = registerHooks({
    load(url, context, next) {
      if (url.endsWith(".scss"))
        return {
          format: "module",
          source: "export default new Proxy({}, {get:(_,key)=>String(key)});",
          shortCircuit: true,
        };
      return next(url, context);
    },
  });
  try {
    const { ProjectCard } = await import("../src/components/project-card");
    const data = initialContent();
    const expected = {
      localmem: "AI Agent Memory",
      "gdrive-cli": "AI Agent Tooling",
      "cc-notify-telegram": "AI Workflow",
      altfins: "Workflow Automation",
      "ivr-studio": "Speech AI",
    };
    for (const [id, label] of Object.entries(expected)) {
      const project = data.projects.find((p) => p.id === id)!;
      const html = renderToStaticMarkup(
        createElement(
          TooltipProvider,
          null,
          createElement(ProjectCard, { project, labels: data.ui }),
        ),
      );
      assert.ok(html.includes(label));
      assert.ok(html.includes(`data-focus="${project.focus}"`));
      assert.ok(html.includes(project.summary.replaceAll("&", "&amp;")));
      if (id === "altfins") assert.ok(!html.includes("AI Workflow"));
    }
    const ordinary = renderToStaticMarkup(
      createElement(
        TooltipProvider,
        null,
        createElement(ProjectCard, {
          project: data.projects[0],
          labels: data.ui,
        }),
      ),
    );
    assert.ok(!ordinary.includes("data-focus="));
  } finally {
    hook.deregister();
  }
});
