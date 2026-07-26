import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const docsSource = "docs/index.source.html";
const docsIndex = "docs/index.html";

if (existsSync(docsSource)) {
  await rm(docsIndex, { force: true });
  await rename(docsSource, docsIndex);
}

const normalizedIndex = (await readFile(docsIndex, "utf8"))
  .replace(/\r/g, "")
  .replace(/[ \t]+(?=\n)/g, "");
await writeFile(docsIndex, normalizedIndex);
await cp(docsIndex, "index.html");

for (const dir of ["assets", "images", "brand", "og"]) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await cp(`docs/${dir}`, dir, { recursive: true });
}

await writeFile(".nojekyll", "");
await writeFile("docs/.nojekyll", "");
