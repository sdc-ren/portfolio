import { test } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { actionLabel } from "../src/lib/action-label";

test("Action tooltips prefer accessible names and ignore decorative icons", () => {
  assert.equal(
    actionLabel(
      createElement(
        "a",
        { "aria-label": "Download PDF" },
        createElement("svg"),
      ),
    ),
    "Download PDF",
  );
  assert.equal(
    actionLabel([
      createElement("svg", { "aria-hidden": true }, "decorative icon"),
      " Save ",
      createElement("span", {}, "draft"),
    ]),
    "Save draft",
  );
});

test("Tooltip wrapping preserves native form submit behavior", async () => {
  const { renderToStaticMarkup } = await import("react-dom/server");
  const { Button } = await import("../src/components/ui/button");
  const { TooltipProvider } = await import("../src/components/ui/tooltip");
  const html = renderToStaticMarkup(
    createElement(TooltipProvider, {
      children: createElement("form", {}, createElement(Button, {}, "Sign in")),
    }),
  );
  assert.ok(html.includes("Sign in"));
  assert.ok(!html.includes('type="button"'));
});
