import type { FsLayout } from "./types.ts";

export function flatten(layout: FsLayout, prefix = "") {
  const stack = [layout];
  const pathStack = [prefix];

  const flattened: Record<string, string | null> = {};

  while (stack.length > 0 && pathStack.length > 0) {
    const currLayout = stack.pop()!;
    const currPath = pathStack.pop()!;

    let isEmpty = true;

    for (const key in currLayout) {
      isEmpty = false;
      const fullKey = currPath === "" ? key : `${currPath}/${key}`;

      if (typeof currLayout[key] === "string") {
        flattened[fullKey] = currLayout[key];
      } else if (typeof currLayout[key] === "object") {
        stack.push(currLayout[key]);
        pathStack.push(fullKey);
      } else {
        throw new Error("Invalid node in fs layout object");
      }
    }

    if (isEmpty) {
      flattened[currPath] = null;
    }
  }

  return flattened;
}
