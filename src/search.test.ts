import { test } from "node:test";
import { deepEqual } from "node:assert/strict";
import { buildIncludePattern, normalizeSearchOptions } from "./search";

test("buildIncludePattern handles wildcard and scoped roots", () => {
  deepEqual(buildIncludePattern("**", "sample.target.sql"), "**/sample.target.sql");
  deepEqual(
    buildIncludePattern("workspace/data", "sample.target.sql"),
    "workspace/data/**/sample.target.sql"
  );
});

test("normalizeSearchOptions applies trim and fallback defaults", () => {
  deepEqual(normalizeSearchOptions("   ", "   "), {
    includeGlob: "**",
    excludeGlob: undefined
  });

  deepEqual(normalizeSearchOptions(" workspace/data ", " **/node_modules/** "), {
    includeGlob: "workspace/data",
    excludeGlob: "**/node_modules/**"
  });
});
