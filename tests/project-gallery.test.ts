import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import { TooltipProvider } from "../src/components/ui/tooltip";

// Node does not load CSS Modules. Only skip styling; render the real UI components.
const hooks = registerHooks({
  load(url, context, next) {
    if (url.endsWith(".module.scss"))
      return {
        format: "module",
        source: "export default {}",
        shortCircuit: true,
      };
    return next(url, context);
  },
});
const { ProjectCard } = await import("../src/components/project-card");
hooks.deregister();
const data = contentSchema.parse(initial);
const project = structuredClone(data.projects[0]);
const render = (images: typeof project.images) =>
  renderToStaticMarkup(
    createElement(
      TooltipProvider,
      null,
      createElement(ProjectCard, {
        project: { ...project, images },
        labels: data.ui,
      }),
    ),
  );

test("Cards without screenshots have no gallery action and render no image elements", () => {
  const html = render([]);
  assert.ok(!html.includes(`${data.ui.projectGallery}:`));
  assert.ok(!html.includes("<img"));
  assert.equal((html.match(/<button\b/g) ?? []).length, 1);
});

test("Cards with screenshots expose a separate gallery action without loading photos or nesting buttons", () => {
  const html = render([
    {
      id: "screen",
      url: "https://example.com/screen.webp",
      alt: "Dashboard",
      caption: "",
    },
  ]);
  assert.ok(html.includes(`${data.ui.projectGallery}:`));
  assert.ok(!html.includes("<img"));
  assert.ok(!html.includes("https://example.com/screen.webp"));
  assert.equal((html.match(/<button\b/g) ?? []).length, 2);
  assert.ok(!/<button\b[^>]*>(?:(?!<\/button>)[\s\S])*<button\b/.test(html));
});
