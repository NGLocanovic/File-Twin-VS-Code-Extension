"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildIncludePattern = buildIncludePattern;
exports.normalizeSearchOptions = normalizeSearchOptions;
function buildIncludePattern(includeGlob, targetFileName) {
    const normalized = includeGlob.replace(/\\/g, "/").replace(/\/+$/, "");
    if (normalized === "**") {
        return `**/${targetFileName}`;
    }
    return `${normalized}/**/${targetFileName}`;
}
function normalizeSearchOptions(rawIncludeGlob, rawExcludeGlob) {
    const includeGlob = rawIncludeGlob.trim();
    const excludeGlob = rawExcludeGlob.trim();
    return {
        includeGlob: includeGlob.length > 0 ? includeGlob : "**",
        excludeGlob: excludeGlob.length > 0 ? excludeGlob : undefined
    };
}
//# sourceMappingURL=search.js.map