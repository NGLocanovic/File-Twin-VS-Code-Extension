"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const strict_1 = require("node:assert/strict");
const search_1 = require("./search");
(0, node_test_1.test)("buildIncludePattern handles wildcard and scoped roots", () => {
    (0, strict_1.deepEqual)((0, search_1.buildIncludePattern)("**", "sample.target.sql"), "**/sample.target.sql");
    (0, strict_1.deepEqual)((0, search_1.buildIncludePattern)("workspace/data", "sample.target.sql"), "workspace/data/**/sample.target.sql");
});
(0, node_test_1.test)("normalizeSearchOptions applies trim and fallback defaults", () => {
    (0, strict_1.deepEqual)((0, search_1.normalizeSearchOptions)("   ", "   "), {
        includeGlob: "**",
        excludeGlob: undefined
    });
    (0, strict_1.deepEqual)((0, search_1.normalizeSearchOptions)(" workspace/data ", " **/node_modules/** "), {
        includeGlob: "workspace/data",
        excludeGlob: "**/node_modules/**"
    });
});
//# sourceMappingURL=search.test.js.map