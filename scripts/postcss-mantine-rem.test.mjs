import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";
import postcss from "postcss";
import mantineRem from "./postcss-mantine-rem.cjs";

const css = ".control { height: 32px; border-width: 1px; }";

test("selective core styles retain text zoom and Mantine scaling", async () => {
  const result = await postcss([mantineRem()]).process(css, {
    from: resolve("node_modules/@mantine/core/styles/Pill.css"),
  });
  assert.match(result.css, /height: calc\(2rem \* var\(--mantine-scale\)\)/);
  assert.match(result.css, /border-width: calc\(0.0625rem \* var\(--mantine-scale\)\)/);
});

test("application and already compiled extension styles are unchanged", async () => {
  for (const file of ["src/app/globals.css", "node_modules/@mantine/dates/styles.css"]) {
    const result = await postcss([mantineRem()]).process(css, { from: resolve(file) });
    assert.equal(result.css, css);
  }
});
