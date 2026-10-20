import assert from "node:assert/strict";
import test from "node:test";
import { localChromePath } from "../src/features/cv/browser";

test("explicit Chrome path takes priority", async () => {
  assert.equal(
    await localChromePath("darwin", {
      CHROMIUM_EXECUTABLE_PATH: "/custom/chrome",
    }),
    "/custom/chrome",
  );
});
test("macOS selects installed Chrome rather than Linux binary", async () => {
  assert.equal(
    await localChromePath("darwin", {}, async () => true),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  );
});
test("Windows resolves Chrome from installation roots", async () => {
  assert.equal(
    await localChromePath(
      "win32",
      { LOCALAPPDATA: "C:\\Users\\Ren" },
      async () => true,
    ),
    "C:\\Users\\Ren\\Google\\Chrome\\Application\\chrome.exe",
  );
});
test("unsupported local system never launches bundled Linux executable", async () => {
  await assert.rejects(
    localChromePath("darwin", {}, async () => false),
    /Chrome was not found/,
  );
  assert.equal(await localChromePath("linux", {}), undefined);
});
