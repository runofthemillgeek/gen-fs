import { genFs, type GenFsResult } from "./genFs.ts";
import type { FsLayout } from "./types.ts";

interface GenTmpFsOptions {
  cleanup?: boolean;
}

type GenTmpFsResult = GenFsResult & {
  tmpDir: string;
};

export async function genTmpFs(
  layout: FsLayout,
  { cleanup = true }: GenTmpFsOptions = {},
  genFsFunc = genFs,
): Promise<GenTmpFsResult> {
  const tmpDir = await Deno.makeTempDir({ prefix: "gen_fs_" });

  const genFsResource = await genFsFunc(layout, {
    rootDir: tmpDir,
    cleanup,
  });

  return {
    ...genFsResource,
    tmpDir: tmpDir,
  };
}
