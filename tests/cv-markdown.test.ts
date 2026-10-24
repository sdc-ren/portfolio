import { test } from "node:test";
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import { cvMarkdown } from "../src/features/cv/markdown";
import { defaultUiForLocale } from "../src/features/content/ui";
import { cvMarkup } from "../src/features/cv/markup";

test("Markdown follows CV selections/order and excludes galleries and hidden links", () => {
  const data = contentSchema.parse(initial);
  data.cvs[0].projectIds = ["cc-notify-telegram", "gdrive-cli"];
  data.projects
    .find((p) => p.id === "gdrive-cli")!
    .links.push({
      id: "hidden",
      type: "website",
      url: "https://hidden.example",
      label: "Hidden",
      showInCv: false,
    });
  data.projects[0].images = [
    {
      id: "pic",
      url: "https://image.example/screen.png",
      alt: "Screenshot",
      caption: "",
    },
  ];
  const md = cvMarkdown(data, data.cvs[0].id);
  assert.ok(md.indexOf("### cc-notify") < md.indexOf("### gdrive"));
  assert.ok(!md.includes("hidden.example"));
  assert.ok(!md.includes("image.example"));
  assert.ok(!md.includes("### Jinjer"));
  assert.ok(md.includes("https://sondc-portfolio.vercel.app/"));
  assert.ok(
    cvMarkup(data, data.cvs[0].id).includes(
      "https://sondc-portfolio.vercel.app/",
    ),
  );
  for (const title of [
    data.ui.cvSummary,
    data.ui.cvSkills,
    data.ui.cvExperience,
    data.ui.cvProjects,
    data.ui.cvEducation,
    data.ui.cvLanguages,
  ])
    assert.ok(md.includes("## " + title));
  assert.ok(md.endsWith("\n"));
});

test("Markdown keeps Unicode and treats CMS markup and multiline bullets as literal text", () => {
  const data = contentSchema.parse(initial);
  data.profile.name = "Đặng Chí Sơn";
  data.cvs[0].summary =
    '<script>alert("x")</script>\n\n[click](javascript:alert(1))';
  data.experience[0].highlights = ["First line\n# Fake heading\n- nested"];
  const md = cvMarkdown(data, data.cvs[0].id);
  assert.ok(md.includes("ĐẶNG CHÍ SƠN"));
  assert.ok(!md.includes("<script>"));
  assert.ok(md.includes("&lt;script&gt;"));
  assert.ok(md.includes("\\[click\\]"));
  assert.ok(md.includes("- First line\n  \\# Fake heading\n  \\- nested"));
  assert.throws(() => cvMarkdown(data, "missing"), /CV not found/);
});

test("new download label defaults work for old content and Vietnamese defaults", () => {
  assert.equal(
    contentSchema.parse(initial).ui.downloadMarkdown,
    "Download Markdown",
  );
  assert.equal(defaultUiForLocale("vi").downloadMarkdown, "Tải Markdown");
});

// Only the database boundary is replaced; exercise the actual route and renderer.
test("Markdown endpoint returns an attachment and handles invalid/missing/error cases", async () => {
  let calls = 0;
  let mode: "ok" | "missing" | "error" = "ok";
  const data = contentSchema.parse(initial);
  const fixture = globalThis as typeof globalThis & {
    __cvMarkdownPublished?: () => Promise<typeof data | null>;
  };
  fixture.__cvMarkdownPublished = async () => {
    calls++;
    if (mode === "error") throw new Error("database unavailable");
    return mode === "missing" ? null : data;
  };
  const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier === "@/features/content/repository")
        return {
          url: "data:text/javascript,export async function getPublished(){ return globalThis.__cvMarkdownPublished(); }",
          shortCircuit: true,
        };
      return nextResolve(specifier, context);
    },
  });
  try {
    const { GET } =
      await import("../src/app/api/cv/[locale]/[variant]/markdown/route");
    const request = new Request(
      "https://example.test/api/cv/en/senior-software-engineer/markdown",
    );
    const invoke = (locale = "en", variant = data.cvs[0].id) =>
      GET(request, { params: Promise.resolve({ locale, variant }) });
    const response = await invoke();
    assert.equal(response.status, 200);
    assert.equal(
      response.headers.get("content-type"),
      "text/markdown; charset=utf-8",
    );
    assert.match(response.headers.get("content-disposition")!, /\.md"$/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(await response.text(), cvMarkdown(data, data.cvs[0].id));
    const previousCalls = calls;
    assert.equal((await invoke("../../bad")).status, 404);
    assert.equal((await invoke("en", "bad\r\nheader")).status, 404);
    assert.equal(calls, previousCalls);
    assert.equal((await invoke("en", "missing")).status, 404);
    mode = "missing";
    assert.equal((await invoke()).status, 404);
    mode = "error";
    const failed = await invoke();
    assert.equal(failed.status, 500);
    assert.equal(failed.headers.get("cache-control"), "no-store");
    assert.ok(!(await failed.text()).includes("database unavailable"));
  } finally {
    hooks.deregister();
    delete fixture.__cvMarkdownPublished;
  }
});
