import { test } from "node:test";
import assert from "node:assert/strict";
import { publicPath } from "../src/lib/public-path";
test("Default language has clean home, project and CV URLs", () => {
  assert.equal(publicPath("en"), "/");
  assert.equal(publicPath("en", "/projects"), "/projects");
  assert.equal(
    publicPath("en", "/cv/senior-software-engineer"),
    "/cv/senior-software-engineer",
  );
});
test("Other languages retain explicit prefixes", () => {
  assert.equal(publicPath("vi"), "/vi");
  assert.equal(
    publicPath("vi", "/projects/gdrive-cli"),
    "/vi/projects/gdrive-cli",
  );
});
