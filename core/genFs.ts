import { dirname, isAbsolute, relative } from "jsr:@std/path";
import { flatten } from "../core/flatten.ts";
import type { FsLayout } from "../core/types.ts";

interface GenFsOptions {
  rootDir: string;
  cleanup?: boolean;
}

export async function genFs(
  layout: FsLayout,
  { rootDir, cleanup = false }: GenFsOptions,
) {
  if (!isAbsolute(rootDir)) {
    rootDir = relative(Deno.cwd(), rootDir);
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

  async function dispose() {
    if (cleanup) {
      await Deno.remove(rootDir, { recursive: true });
    }
  }

  return {
    [Symbol.asyncDispose]: dispose,
    dispose,
  };
}
