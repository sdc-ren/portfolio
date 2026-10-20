import { test } from "node:test";
import assert from "node:assert/strict";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import { metaDescription, pageMetadata } from "../src/lib/seo";

const data = contentSchema.parse(initial);
test("Home metadata uses an absolute title without duplicating the profile name", () => {
  const result = pageMetadata({
    data,
    locale: "en",
    title: data.settings.title,
    description: data.settings.description,
  });
  assert.deepEqual(result.title, {
    absolute: "Dang Chi Son | Senior Software Engineer",
  });
  assert.equal(result.description, data.settings.description);
  assert.equal(result.openGraph?.title, data.settings.title);
  assert.equal(result.twitter?.description, result.description);
});
test("Canonical URLs use the production origin and correct locale paths", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    process.env.NEXT_PUBLIC_SITE_URL = "https://portfolio.example/";
    for (const [locale, expected] of [
      ["en", "https://portfolio.example/projects/jinjer"],
      ["vi", "https://portfolio.example/vi/projects/jinjer"],
    ]) {
      const result = pageMetadata({
        data,
        locale,
        path: "/projects/jinjer",
        title: "Jinjer",
        description: "Project details",
      });
      assert.equal(String(result.alternates?.canonical), expected);
      assert.equal(String(result.openGraph?.url), expected);
    }
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const result = pageMetadata({
      data,
      locale: "en",
      title: "CV",
      description: "CV details",
    });
    assert.equal(result.alternates, undefined);
    assert.equal(result.openGraph?.url, undefined);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});
test("Descriptions normalize whitespace and shorten long CV summaries at word boundaries", () => {
  assert.equal(
    metaDescription("  Frontend\n architecture   "),
    "Frontend architecture",
  );
  const result = metaDescription(data.cvs[0].summary);
  assert.ok(result.length <= 160);
  assert.ok(result.endsWith("…"));
  assert.ok(data.cvs[0].summary.startsWith(result.slice(0, -1)));
});
