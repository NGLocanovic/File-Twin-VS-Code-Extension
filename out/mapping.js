"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NAME_PLACEHOLDER = void 0;
exports.countPlaceholder = countPlaceholder;
exports.isRegexPattern = isRegexPattern;
exports.isSupportedLinkPattern = isSupportedLinkPattern;
exports.resolveLinkedFileNameCandidates = resolveLinkedFileNameCandidates;
exports.NAME_PLACEHOLDER = "{name}";
const MAX_LINKED_CANDIDATES = 500;
function countPlaceholder(pattern) {
    return pattern.split(exports.NAME_PLACEHOLDER).length - 1;
}
function isRegexPattern(pattern) {
    return pattern.length >= 2 && pattern.startsWith("/") && pattern.endsWith("/");
}
function isSupportedLinkPattern(link) {
    if (link.length < 2) {
        return false;
    }
    const regexPatterns = link.filter((pattern) => isRegexPattern(pattern));
    if (regexPatterns.length > 1) {
        return false;
    }
    if (regexPatterns.length === 1) {
        return (Boolean(buildExplicitRegex(regexPatterns[0])) &&
            link.every((pattern) => pattern.trim().length > 0));
    }
    return link.every((pattern) => countPlaceholder(pattern) === 1);
}
function resolveLinkedFileNameCandidates(sourceFileName, links) {
    const visitedFileNames = new Set([sourceFileName]);
    const resolvedFileNames = [];
    const queue = [sourceFileName];
    while (queue.length > 0 && resolvedFileNames.length < MAX_LINKED_CANDIDATES) {
        const currentFileName = queue.shift();
        if (!currentFileName) {
            continue;
        }
        for (const link of links) {
            const candidates = resolveLinkPatternCandidates(currentFileName, link);
            for (const candidate of candidates) {
                if (visitedFileNames.has(candidate)) {
                    continue;
                }
                visitedFileNames.add(candidate);
                resolvedFileNames.push(candidate);
                if (resolvedFileNames.length < MAX_LINKED_CANDIDATES) {
                    queue.push(candidate);
                }
            }
        }
    }
    return resolvedFileNames;
}
function resolveLinkPatternCandidates(sourceFileName, link) {
    const matchingSourceIndices = link
        .map((sourcePattern, index) => hasPatternMatch(sourceFileName, sourcePattern) ? index : -1)
        .filter((index) => index >= 0);
    if (matchingSourceIndices.length === 0) {
        return [];
    }
    const selectedSourceIndex = selectMostSpecificSourcePatternIndex(link, matchingSourceIndices);
    const sourcePattern = link[selectedSourceIndex];
    const targets = link
        .map((targetPattern, targetIndex) => {
        if (targetIndex === selectedSourceIndex) {
            return undefined;
        }
        return tryResolveWithPattern(sourceFileName, sourcePattern, targetPattern);
    })
        .filter((value) => Boolean(value));
    return Array.from(new Set(targets));
}
function hasPatternMatch(sourceFileName, sourcePattern) {
    const sourceRegex = buildFromRegex(sourcePattern);
    return Boolean(sourceRegex && sourceRegex.test(sourceFileName));
}
function selectMostSpecificSourcePatternIndex(link, matchingSourceIndices) {
    let selectedIndex = matchingSourceIndices[0];
    let selectedSpecificity = getPatternSpecificity(link[selectedIndex]);
    for (const sourceIndex of matchingSourceIndices.slice(1)) {
        const candidateSpecificity = getPatternSpecificity(link[sourceIndex]);
        if (candidateSpecificity > selectedSpecificity) {
            selectedIndex = sourceIndex;
            selectedSpecificity = candidateSpecificity;
        }
    }
    return selectedIndex;
}
function tryResolveWithPattern(sourceFileName, sourcePattern, targetPattern) {
    const sourceRegex = buildFromRegex(sourcePattern);
    if (!sourceRegex) {
        return undefined;
    }
    const match = sourceFileName.match(sourceRegex);
    if (!match) {
        return undefined;
    }
    if (isRegexPattern(sourcePattern)) {
        return sourceFileName.replace(sourceRegex, targetPattern);
    }
    return targetPattern.replace(exports.NAME_PLACEHOLDER, match[1]);
}
function buildFromRegex(fromPattern) {
    const explicitRegex = buildExplicitRegex(fromPattern);
    if (explicitRegex) {
        return explicitRegex;
    }
    if (countPlaceholder(fromPattern) !== 1) {
        return undefined;
    }
    const regexSource = `^${escapeRegexLiteral(fromPattern).replace(escapeRegexLiteral(exports.NAME_PLACEHOLDER), "(.+)")}$`;
    return new RegExp(regexSource);
}
function buildExplicitRegex(pattern) {
    if (!isRegexPattern(pattern)) {
        return undefined;
    }
    const regexBody = pattern.slice(1, -1);
    if (regexBody.length === 0) {
        return undefined;
    }
    try {
        return new RegExp(regexBody);
    }
    catch {
        return undefined;
    }
}
function escapeRegexLiteral(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function getPatternSpecificity(pattern) {
    if (isRegexPattern(pattern)) {
        return pattern.length;
    }
    return pattern.replace(exports.NAME_PLACEHOLDER, "").length;
}
//# sourceMappingURL=mapping.js.map