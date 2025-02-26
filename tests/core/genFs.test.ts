import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";

import type { FsLayout } from "@/core/types.ts";
import { genFs } from "@/core/genFs.ts";
import { assertNotEquals } from "@std/assert/not-equals";

Deno.test("creates files/folders at rootDir using given layout", async () => {
  const rootDir = await Deno.makeTempDir({ "prefix": "genfs_test_" });

  const layout: FsLayout = {
    "dist": {
      "a": "a",
      "b/c": "c",
    },
  };

  await genFs(layout, {
    rootDir,
  });

  assert((await Deno.stat(`${rootDir}/dist`)).isDirectory);
  assert((await Deno.stat(`${rootDir}/dist/b`)).isDirectory);

  assertEquals(await Deno.readTextFile(`${rootDir}/dist/a`), "a");
  assertEquals(await Deno.readTextFile(`${rootDir}/dist/b/c`), "c");

  await Deno.remove(rootDir, { recursive: true });
});

Deno.test.ignore(
  "removes rootDir and contents if cleanup option is set",
  () => {
  },
);

Deno.test(
  "cd into rootDir if chdir is set",
  async () => {
    const rootDir = await Deno.makeTempDir({ "prefix": "genfs_test_" });

    const layout: FsLayout = {
      "a": "",
      "b": "",
    };

    const originalCwd = Deno.cwd();
    await using _tmpFs = await genFs(layout, { rootDir, chdir: true });

    assertNotEquals(Deno.cwd(), originalCwd);
    assert((await Deno.stat(`a`)).isFile);
    assert((await Deno.stat(`b`)).isFile);
  },
);
