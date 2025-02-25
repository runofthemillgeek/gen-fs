import { genTmpFs } from "../mod.ts";

await using tmpFs = await genTmpFs({
  "dist/index.html": "<h1>Hello genFs!</h1>",
  "dist/styles.css": "* { font-size: 2rem; }",
  "dist/main.js": "console.log('hello world')",
}, { cleanup: false });

console.log(tmpFs.tmpDir);
