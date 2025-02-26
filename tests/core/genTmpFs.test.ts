import type { genFs } from "@/core/genFs.ts";
import { genTmpFs } from "@/core/genTmpFs.ts";

import { assertSpyCall, returnsNext, spy, stub } from "@std/testing/mock";

Deno.test("calls genFs with a new tmp dir", async () => {
  const genFsSpy = spy<
    unknown,
    Parameters<typeof genFs>,
    ReturnType<typeof genFs>
  >();
  using makeTmpDirStub = stub(
    Deno,
    "makeTempDir",
    returnsNext([Promise.resolve("/tmp/foo")]),
  );

  await genTmpFs({}, { cleanup: false }, genFsSpy);

  assertSpyCall(makeTmpDirStub, 0);
  assertSpyCall(genFsSpy, 0, {
    args: [{}, {
      chdir: false,
      rootDir: "/tmp/foo",
      cleanup: false,
    }],
  });
});
