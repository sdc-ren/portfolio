import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { Button } from "../src/components/ui/button";
import { initialContent } from "../src/features/content/seed-content";

test("Reveal content remains readable in server HTML before JavaScript runs", async () => {
  const hook = registerHooks({
    load(url, context, next) {
      if (url.endsWith(".scss"))
        return {
          format: "module",
          source: 'export default {reveal:"reveal"};',
          shortCircuit: true,
        };
      return next(url, context);
    },
  });
  try {
    const { Reveal } = await import("../src/components/reveal");
    const html = renderToStaticMarkup(
      createElement(
        Reveal,
        null,
        createElement("h2", null, "Visible project content"),
      ),
    );
    assert.ok(html.includes("Visible project content"));
    assert.ok(!html.includes('data-motion="ready"'));
    assert.ok(!html.includes("aria-hidden"));
  } finally {
    hook.deregister();
  }
});
test("Wave buttons preserve native button and link semantics and expose their visual variant", () => {
  const html = renderToStaticMarkup(
    createElement(
      TooltipProvider,
      null,
      createElement(
        Button,
        { type: "submit", variant: "outline" },
        "Save draft",
      ),
      createElement(
        Button,
        { asChild: true },
        createElement("a", { href: "/projects" }, "Explore work"),
      ),
    ),
  );
  assert.ok(html.includes('type="submit"'));
  assert.ok(html.includes('data-variant="outline"'));
  assert.ok(html.includes('href="/projects"'));
  assert.ok(html.includes('data-variant="default"'));
});
test("Visual copy keeps the existing project order and adds grounded case studies", () => {
  const data = initialContent();
  assert.deepEqual(
    data.projects.map((p) => p.id),
    [
      "jinjer",
      "twinci",
      "personal-finance-management",
      "gdrive-cli",
      "cc-notify-telegram",
      "altfins",
      "localmem",
      "ivr-studio",
    ],
  );
  for (const id of ["jinjer", "localmem", "ivr-studio"]) {
    const description = data.projects.find((p) => p.id === id)!.description;
    for (const heading of [
      "Problem",
      "My contribution",
      "Technical decisions",
      "Trade-offs",
      "Outcome",
    ])
      assert.ok(description.includes("### " + heading));
  }
});
