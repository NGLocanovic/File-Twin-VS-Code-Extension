import * as vscode from "vscode";
import * as path from "node:path";
import {
  isSupportedLinkPattern,
  resolveLinkedFileNameCandidates,
  type LinkPattern
} from "./mapping";
import { buildIncludePattern, normalizeSearchOptions } from "./search";

type SearchOptions = {
  includeGlob: string;
  excludeGlob?: string;
};

type OpenOptions = {
  openInSplit: boolean;
};

type TargetSelectionResult = {
  uri?: vscode.Uri;
  canceled?: boolean;
  searchedName?: string;
};

type TargetQuickPickItem = vscode.QuickPickItem & {
  uri: vscode.Uri;
};

export function activate(context: vscode.ExtensionContext): void {
  const openMappedFileCommand = vscode.commands.registerCommand(
    "fileTwin.openMappedFile",
    async (resourceUri?: vscode.Uri) => {
      const editor = vscode.window.activeTextEditor;
      const sourceUri = resourceUri ?? editor?.document.uri;

      if (!sourceUri) {
        await vscode.window.showInformationMessage(
          "File Twin: Keine Quelldatei verfuegbar."
        );
        return;
      }

      const config = vscode.workspace.getConfiguration("fileTwin", sourceUri);
      const links = config.get<LinkPattern[]>("links", []);
      const searchOptions = readSearchOptions(config);
      const openOptions = readOpenOptions(config);

      if (!isValidLinks(links) || links.length === 0) {
        await vscode.window.showInformationMessage(
          "File Twin: Ungueltige Settings. Bitte fileTwin.links als nicht-leeres Array mit [patternA, patternB, ...] setzen."
        );
        return;
      }

      if (!hasValidLinkSyntax(links)) {
        await vscode.window.showInformationMessage(
          "File Twin: Ungueltige Namenskonvention. Erlaubt sind {name}-Templates oder Regex in /.../."
        );
        return;
      }

      if (sourceUri.scheme !== "file") {
        await vscode.window.showInformationMessage(
          "File Twin: Nur lokale Dateien werden im MVP unterstuetzt."
        );
        return;
      }

      const sourceFileName = path.basename(sourceUri.fsPath);
      await openLinkedTargetsFromSource(sourceUri, sourceFileName, links, searchOptions, openOptions);
    }
  );

  context.subscriptions.push(openMappedFileCommand);
}

export function deactivate(): void {}

function isValidLinks(value: LinkPattern[] | undefined): value is LinkPattern[] {
  return Boolean(
    value &&
      Array.isArray(value) &&
      value.every(
        (link) =>
          Array.isArray(link) &&
          link.length >= 2 &&
          link.every((pattern) => typeof pattern === "string")
      )
  );
}

function hasValidLinkSyntax(links: LinkPattern[]): boolean {
  return links.every((link) => isSupportedLinkPattern(link));
}

async function findTargetUriInWorkspace(
  sourceUri: vscode.Uri,
  targetFileNames: string[],
  searchOptions: SearchOptions
): Promise<TargetSelectionResult> {
  for (const targetFileName of targetFileNames) {
    const includePattern = buildIncludePattern(searchOptions.includeGlob, targetFileName);
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

async function showTargetSelectionQuickPick(
  targetFileName: string,
  matchingFiles: vscode.Uri[]
): Promise<vscode.Uri | undefined> {
  const quickPickItems: TargetQuickPickItem[] = matchingFiles.map((uri) => {
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

function readSearchOptions(config: vscode.WorkspaceConfiguration): SearchOptions {
  return normalizeSearchOptions(
    config.get<string>("searchIncludeGlob", "**"),
    config.get<string>("searchExcludeGlob", "")
  );
}

function readOpenOptions(config: vscode.WorkspaceConfiguration): OpenOptions {
  return {
    openInSplit: config.get<boolean>("openInSplit", false)
  };
}

async function openTargetUri(targetUri: vscode.Uri, openOptions: OpenOptions): Promise<void> {
  const targetDocument = await vscode.workspace.openTextDocument(targetUri);
  await vscode.window.showTextDocument(
    targetDocument,
    openOptions.openInSplit
      ? { preview: false, viewColumn: vscode.ViewColumn.Beside }
      : { preview: false }
  );
}

async function openLinkedTargetsFromSource(
  sourceUri: vscode.Uri,
  sourceFileName: string,
  links: LinkPattern[],
  searchOptions: SearchOptions,
  openOptions: OpenOptions
): Promise<void> {
  const linkedTargetFileNames = resolveLinkedFileNameCandidates(sourceFileName, links);
  if (linkedTargetFileNames.length === 0) {
    await vscode.window.showInformationMessage(
      "File Twin: Keine Zuordnung fuer die aktive Datei gefunden."
    );
    return;
  }

  const openedTargetPaths = new Set<string>();

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
    await vscode.window.showInformationMessage(
      `File Twin: Zieldatei im Workspace nicht gefunden. Gesuchter Dateiname: ${linkedTargetFileNames[0]}`
    );
  }
}
