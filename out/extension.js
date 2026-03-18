"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const path = require("node:path");
const mapping_1 = require("./mapping");
const search_1 = require("./search");
function activate(context) {
    const openMappedFileCommand = vscode.commands.registerCommand("fileTwin.openMappedFile", async (resourceUri) => {
        const editor = vscode.window.activeTextEditor;
        const sourceUri = resourceUri ?? editor?.document.uri;
        if (!sourceUri) {
            await vscode.window.showInformationMessage("File Twin: Keine Quelldatei verfuegbar.");
            return;
        }
        const config = vscode.workspace.getConfiguration("fileTwin", sourceUri);
        const links = config.get("links", []);
        const searchOptions = readSearchOptions(config);
        const openOptions = readOpenOptions(config);
        if (!isValidLinks(links) || links.length === 0) {
            await vscode.window.showInformationMessage("File Twin: Ungueltige Settings. Bitte fileTwin.links als nicht-leeres Array mit [patternA, patternB, ...] setzen.");
            return;
        }
        if (!hasValidLinkSyntax(links)) {
            await vscode.window.showInformationMessage("File Twin: Ungueltige Namenskonvention. Erlaubt sind {name}-Templates oder Regex in /.../.");
            return;
        }
        if (sourceUri.scheme !== "file") {
            await vscode.window.showInformationMessage("File Twin: Nur lokale Dateien werden im MVP unterstuetzt.");
            return;
        }
        const sourceFileName = path.basename(sourceUri.fsPath);
        await openLinkedTargetsFromSource(sourceUri, sourceFileName, links, searchOptions, openOptions);
    });
    context.subscriptions.push(openMappedFileCommand);
}
function deactivate() { }
function isValidLinks(value) {
    return Boolean(value &&
        Array.isArray(value) &&
        value.every((link) => Array.isArray(link) &&
            link.length >= 2 &&
            link.every((pattern) => typeof pattern === "string")));
}
function hasValidLinkSyntax(links) {
    return links.every((link) => (0, mapping_1.isSupportedLinkPattern)(link));
}
async function findTargetUriInWorkspace(sourceUri, targetFileNames, searchOptions) {
    for (const targetFileName of targetFileNames) {
        const includePattern = (0, search_1.buildIncludePattern)(searchOptions.includeGlob, targetFileName);
        const excludePattern = searchOptions.excludeGlob?.trim() ? searchOptions.excludeGlob.trim() : undefined;
        const workspaceMatches = await vscode.workspace.findFiles(includePattern, excludePattern);
        const matchingFiles = workspaceMatches
            .filter((uri) => uri.scheme === "file" && uri.fsPath !== sourceUri.fsPath)
            .sort((left, right) => left.fsPath.localeCompare(right.fsPath));
        if (matchingFiles.length === 1) {
            return { uri: matchingFiles[0], searchedName: targetFileName };
        }
        if (matchingFiles.length > 1) {
            const selectedUri = await showTargetSelectionQuickPick(targetFileName, matchingFiles);
            if (!selectedUri) {
                return { canceled: true, searchedName: targetFileName };
            }
            return { uri: selectedUri, searchedName: targetFileName };
        }
    }
    return { searchedName: targetFileNames[0] };
}
async function showTargetSelectionQuickPick(targetFileName, matchingFiles) {
    const quickPickItems = matchingFiles.map((uri) => {
        const relativePath = vscode.workspace.asRelativePath(uri, false);
        const parentPath = path.dirname(relativePath);
        return {
            label: path.basename(uri.fsPath),
            description: parentPath === "." ? "" : parentPath,
            uri
        };
    });
    const selectedItem = await vscode.window.showQuickPick(quickPickItems, {
        title: "File Twin: Ziel-Datei waehlen",
        placeHolder: `Mehrere Treffer fuer '${targetFileName}' - suche und waehle eine Datei`,
        matchOnDescription: true,
        ignoreFocusOut: true
    });
    return selectedItem?.uri;
}
function readSearchOptions(config) {
    return (0, search_1.normalizeSearchOptions)(config.get("searchIncludeGlob", "**"), config.get("searchExcludeGlob", ""));
}
function readOpenOptions(config) {
    return {
        openInSplit: config.get("openInSplit", false)
    };
}
async function openTargetUri(targetUri, openOptions) {
    const targetDocument = await vscode.workspace.openTextDocument(targetUri);
    await vscode.window.showTextDocument(targetDocument, openOptions.openInSplit
        ? { preview: false, viewColumn: vscode.ViewColumn.Beside }
        : { preview: false });
}
async function openLinkedTargetsFromSource(sourceUri, sourceFileName, links, searchOptions, openOptions) {
    const linkedTargetFileNames = (0, mapping_1.resolveLinkedFileNameCandidates)(sourceFileName, links);
    if (linkedTargetFileNames.length === 0) {
        await vscode.window.showInformationMessage("File Twin: Keine Zuordnung fuer die aktive Datei gefunden.");
        return;
    }
    const openedTargetPaths = new Set();
    for (const targetFileName of linkedTargetFileNames) {
        const selection = await findTargetUriInWorkspace(sourceUri, [targetFileName], searchOptions);
        if (selection.canceled) {
            return;
        }
        if (!selection.uri) {
            continue;
        }
        if (selection.uri.fsPath === sourceUri.fsPath) {
            continue;
        }
        if (openedTargetPaths.has(selection.uri.fsPath)) {
            continue;
        }
        await openTargetUri(selection.uri, openOptions);
        openedTargetPaths.add(selection.uri.fsPath);
    }
    if (openedTargetPaths.size === 0) {
        await vscode.window.showInformationMessage(`File Twin: Zieldatei im Workspace nicht gefunden. Gesuchter Dateiname: ${linkedTargetFileNames[0]}`);
    }
}
//# sourceMappingURL=extension.js.map