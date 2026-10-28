import { test } from "node:test";
import assert from "node:assert/strict";
import { initialContent } from "../src/features/content/seed-content";
import { createCvPdf } from "../src/features/cv/pdf";
test("Both CV variants generate real PDFs with bundled Unicode fonts", async () => {
  const data = initialContent();
  data.profile.name = "Đặng Chí Sơn";
  for (const cv of data.cvs) {
    const buffer = await createCvPdf(data, cv.id, "vi");
    assert.equal(buffer.subarray(0, 5).toString(), "%PDF-");
    assert.ok(buffer.length > 10000);
  }
});
