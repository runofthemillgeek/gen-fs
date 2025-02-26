# gen-fs

Library functions to seamlessly generate directories and files at the specified
path using a JavaScript object that maps to the desired filesystem tree.
Includes support for the
[ES Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management)
spec and
[`using` keyword](https://www.totaltypescript.com/typescript-5-2-new-keyword-using).

## Examples

### Basic usage of `genFs`

```ts
await genFs({
  "dist/index.html": "<h1>Hello genFs!</h1>",
  "dist/styles.css": "* { font-size: 2rem; }",
  "dist/main.js": "console.log('hello world')",
}, { rootDir: "dist" });
```

Creates the following:

```
.
└── dist
    ├── index.html
    ├── main.js
    └── styles.css
```

### Cleanup after `using`

```ts
async function run() {
  await using tmpFs = await genFs({
    "dist": {
      "css/main.css": "",
      "js/main.js": ""
      "index.html": ""
    }
  }, { rootDir: "dist", cleanup: true });

  // ... do something ...

  // Removes `dist/` before returning
}
```

### Generating files/dirs for testing using `genTmpFs`

This package also exports `genTmpFs` that automatically creates a temp dir where
your filesystem is generated and cleans up afterward via `using` keyword.

```ts
Deno.test("my test", async () => {
  await using tmpFs = await genTmpFs({
    "dist/index.html": "<h1>Hello genFs!</h1>",
    "dist/styles.css": "* { font-size: 2rem; }",
    "dist/main.js": "console.log('hello world')",
  });

  console.log(tmpFs.tmpDir);

  // ACT

  // Removes the tmp dir before returning
});
```

## TODOs

- [ ] Add documentation via JSDoc comments
- [ ] Add more test cases
- [ ] Publish to JSR and npm
- [ ] Chores
  - [ ] Add git hooks to fmt/lint check
  - [ ] Enforce conventional commits
  - [ ] Setup CI for PRs
  - [ ] Setup CI/CD for publishing using semantic release (or equivalent)
