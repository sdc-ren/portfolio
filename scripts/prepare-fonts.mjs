import { mkdir, copyFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
const require = createRequire(import.meta.url);
const source = path.dirname(require.resolve("dejavu-fonts-ttf/package.json"));
await mkdir("public/fonts", { recursive: true });
for (const name of ["DejaVuSans.ttf", "DejaVuSans-Bold.ttf"]) {
  await copyFile(
    path.join(source, "ttf", name),
    path.join("public/fonts", name),
  );
}
await copyFile(path.join(source, "LICENSE"), "public/fonts/LICENSE.txt");
