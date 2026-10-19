import { test } from "node:test";
import assert from "node:assert/strict";
import initial from "../src/data/initial-content.json";
import { contentSchema } from "../src/features/content/schema";
import { createCvPdf } from "../src/features/cv/pdf";
test("Both CV variants generate real PDFs with bundled Unicode fonts", async () => {
  const data = contentSchema.parse(initial);
  data.profile.name = "Đặng Chí Sơn";
  for (const cv of data.cvs) {
    const buffer = await createCvPdf(data, cv.id, "vi");
    assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
    assert.ok(buffer.length > 10000);
  }
});
