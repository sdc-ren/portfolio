import { createElement } from "react";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { renderToStaticMarkup } from "react-dom/server";
import { initialContent } from "../src/features/content/seed-content";

test("CV switch links, preview, metadata and downloads follow the active variant and locale", async () => {
  const data = initialContent();
  const fixture = globalThis as typeof globalThis & {
    __cvVariantsData?: typeof data;
  };
  fixture.__cvVariantsData = data;
  const hooks = registerHooks({
    resolve(specifier, context, next) {
      if (specifier === "@/features/content/repository")
        return {
          url: "data:text/javascript,export async function getPublished(){return globalThis.__cvVariantsData;}",
          shortCircuit: true,
        };
      return next(specifier, context);
    },
    load(url, context, next) {
      if (url.endsWith(".scss"))
        return {
          format: "module",
          source:
            'export default {page:"page",actions:"actions",variants:"variants",variant:"variant"};',
          shortCircuit: true,
        };
      return next(url, context);
    },
  });
  try {
    const { default: Page, generateMetadata } =
      await import("../src/app/[locale]/cv/[variant]/page");
    for (const locale of ["en", "vi"])
      for (const variant of ["senior-software-engineer", "ai-engineer"]) {
        const params = Promise.resolve({ locale, variant });
        const html = renderToStaticMarkup(
          createElement(TooltipProvider, null, await Page({ params })),
        );
        const prefix = locale === "en" ? "" : "/vi";
        assert.ok(html.includes(`href="${prefix}/cv/ai-engineer"`));
        assert.ok(
          html.includes(`href="${prefix}/cv/senior-software-engineer"`),
        );
        const activeLink = html.match(/<a[^>]*aria-current="page"[^>]*>/)?.[0];
        assert.ok(activeLink?.includes(`href="${prefix}/cv/${variant}"`));
        assert.ok(html.includes(`/api/cv/${locale}/${variant}"`));
        assert.ok(html.includes(`/api/cv/${locale}/${variant}/markdown"`));
        assert.equal(
          html.includes("localmem - Local Memory"),
          variant === "ai-engineer",
        );
        const metadata = await generateMetadata({ params });
        assert.ok(
          JSON.stringify(metadata.title).includes(
            data.cvs.find((cv) => cv.id === variant)!.title,
          ),
        );
      }
  } finally {
    hooks.deregister();
    delete fixture.__cvVariantsData;
  }
});
