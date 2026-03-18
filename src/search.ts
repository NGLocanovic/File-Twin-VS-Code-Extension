export function buildIncludePattern(includeGlob: string, targetFileName: string): string {
  const normalized = includeGlob.replace(/\\/g, "/").replace(/\/+$/, "");
  if (normalized === "**") {
    return `**/${targetFileName}`;
  }

  return `${normalized}/**/${targetFileName}`;
}

export function normalizeSearchOptions(rawIncludeGlob: string, rawExcludeGlob: string): {
  includeGlob: string;
  excludeGlob?: string;
} {
  const includeGlob = rawIncludeGlob.trim();
  const excludeGlob = rawExcludeGlob.trim();

  return {
    includeGlob: includeGlob.length > 0 ? includeGlob : "**",
    excludeGlob: excludeGlob.length > 0 ? excludeGlob : undefined
  };
}
