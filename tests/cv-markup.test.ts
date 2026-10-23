import { test } from "node:test";
import assert from "node:assert/strict";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import { cvMarkup } from "../src/features/cv/markup";

test("CV template preserves source structure, contact display and separate education/languages", () => {
  const data = contentSchema.parse(initial);
  const html = cvMarkup(data, data.cvs[0].id);
  assert.ok(
    html.indexOf(data.ui.cvExperience) < html.indexOf('class="cv-page-start"'),
  );
  assert.ok(html.includes('class="cv-entry-head"'));
  assert.ok(html.includes('class="cv-skill-item"'));
  assert.ok(html.includes("linkedin.com/in/sondangc</a>"));
  assert.ok(
    html.includes(
      'href="https://sondc-portfolio.vercel.app/">sondc-portfolio.vercel.app</a>',
    ),
  );
  assert.ok(html.includes("<h2>Education</h2>"));
  assert.ok(html.includes("<h2>Languages</h2>"));
  assert.ok(html.includes("Duy Tan University</b>, Da Nang"));
});
test("CMS text is escaped before HTML is used on screen or in the PDF renderer", () => {
  const data = contentSchema.parse(initial);
  data.cvs[0].summary = '<img src=x onerror="alert(1)"> & details';
  const html = cvMarkup(data, data.cvs[0].id);
  assert.ok(!html.includes("<img"));
  assert.ok(
    html.includes(
      "&lt;img src=x onerror=&quot;alert(1)&quot;&gt; &amp; details",
    ),
  );
});
