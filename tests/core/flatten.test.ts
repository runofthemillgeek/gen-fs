import { assertEquals } from "@std/assert";

import { flatten } from "@/core/flatten.ts";
import type { FsLayout } from "@/core/types.ts";

Deno.test("flattens nested layout structure", () => {
  const layout: FsLayout = {
    a: {
      b: {
        c: "c",
      },
    },
    d: "d",
    x: {
      y: {
        z: "z",
      },
    },
  };

  const expected = {
    "a/b/c": "c",
    "d": "d",
    "x/y/z": "z",
  };

  assertEquals(flatten(layout), expected);
});

Deno.test("flattens while preserving empty dirs", () => {
  const layout: FsLayout = {
    a: {},
    b: {
      c: {},
      d: "d",
    },
    e: {
      f: "f",
    },
  };

  const expected = {
    "a": null,
    "b/c": null,
    "b/d": "d",
    "e/f": "f",
  };

  assertEquals(flatten(layout), expected);
});

Deno.test("flattens correctly even when keys can be path fragments", () => {
  const layout: FsLayout = {
    "a/b/c": "c",
    "d": {
      "e/f": {
        g: "g",
        h: {},
      },
    },
    "i/j": {
      "k/l": {
        "m/n": "n",
      },
    },
  };

  const expected = {
    "a/b/c": "c",
    "d/e/f/g": "g",
    "d/e/f/h": null,
    "i/j/k/l/m/n": "n",
  };

  assertEquals(flatten(layout), expected);
});

Deno.test("prefixes when flattening if prefix path provided", () => {
  const layout: FsLayout = {
    "a/b/c/d": "d",
    "e": {
      "f": "f",
      "g": {},
    },
  };

  const prefix = "/tmp/foo";

  const expected = {
    [`${prefix}/a/b/c/d`]: "d",
    [`${prefix}/e/f`]: "f",
    [`${prefix}/e/g`]: null,
  };

  assertEquals(flatten(layout, prefix), expected);
});
