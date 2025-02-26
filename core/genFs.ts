import { dirname, isAbsolute, relative } from "@std/path";
import { flatten } from "../core/flatten.ts";
import type { FsLayout } from "../core/types.ts";

interface GenFsOptions {
  rootDir: string;
  cleanup?: boolean;
  chdir?: boolean;
}

export interface GenFsResult {
  [Symbol.asyncDispose]: () => Promise<void>;
  dispose: () => Promise<void>;
}

export async function genFs(
  layout: FsLayout,
  { rootDir, cleanup = false, chdir = false }: GenFsOptions,
): Promise<GenFsResult> {
  const originalCwd = Deno.cwd();

  if (!isAbsolute(rootDir)) {
    rootDir = relative(originalCwd, rootDir);
  }

  await Deno.mkdir(rootDir, { recursive: true });

  const flattened = flatten(layout, rootDir);

  for (const path in flattened) {
    if (flattened[path] === null) {
      await Deno.mkdir(path, { recursive: true });
    } else {
      await Deno.mkdir(dirname(path), { recursive: true });
      await Deno.writeTextFile(path, flattened[path]);
    }
  }

  if (chdir) {
    await Deno.chdir(rootDir);
  }

  async function dispose() {
    if (chdir) {
      await Deno.chdir(originalCwd);
    }

    if (cleanup) {
      await Deno.remove(rootDir, { recursive: true });
    }
  }

  return {
    [Symbol.asyncDispose]: dispose,
    dispose,
  };
}
