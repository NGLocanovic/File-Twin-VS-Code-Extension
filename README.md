# File Twin VS Code Extension

Open related files in VS Code based on configurable filename conventions.

## Features
- One command: `fileTwin.openMappedFile`
- Trigger via:
  - Command Palette
  - Explorer context menu
  - Editor context menu
  - Tab context menu
  - Editor title action icon
- Mapping via `fileTwin.links` as symmetric link groups
- Recursive resolution of connected filename candidates
- Workspace-wide file search (including Multi-Root workspaces)
- Optional search scoping:
  - `fileTwin.searchIncludeGlob`
  - `fileTwin.searchExcludeGlob`
- Optional open in split editor via `fileTwin.openInSplit`
- QuickPick selection when multiple target files are found

## Command
- `File Twin: Open Twin File` -> `fileTwin.openMappedFile`

## Configuration
Set these in `.vscode/settings.json` or in your `*.code-workspace` under `"settings"`.

### `fileTwin.links` (required)
Type: `array` of link groups.

Each link group must have at least 2 string patterns:
```json
["patternA", "patternB", "..."]
```

Rules per link group:
- Template mode:
  - each pattern contains exactly one `{name}`.
- Regex mode:
  - at most one pattern is regex (`/.../`).
  - the other patterns are string targets and may reference captures (`$1`, `$2`, ...).

Behavior:
- Link groups are symmetric.
- If one pattern matches the active filename, all other patterns in the same group are derived as candidates.
- Candidates are chained recursively across all link groups.

### `fileTwin.searchIncludeGlob` (optional)
- Type: `string`
- Default: `**`
- Limits search scope.

### `fileTwin.searchExcludeGlob` (optional)
- Type: `string`
- Default: empty
- Excludes paths from search (for example `**/node_modules/**`).

### `fileTwin.openInSplit` (optional)
- Type: `boolean`
- Default: `false`
- Opens matched target files beside the current editor when `true`.

## Examples
### 1) TypeScript Twin
```json
{
  "fileTwin.links": [
    ["{name}.ts", "{name}.test.ts"]
  ]
}
```

### 2) SQL Three-Way Link
```json
{
  "fileTwin.links": [
    ["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]
  ]
}
```

### 3) Regex Rule
```json
{
  "fileTwin.links": [
    ["/^db\\.proc_(.+)\\.sql$/", "db.table_$1.sql"]
  ]
}
```

### 4) Scoped Search + Split Editor
```json
{
  "fileTwin.links": [
    ["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]
  ],
  "fileTwin.searchIncludeGlob": "src",
  "fileTwin.searchExcludeGlob": "**/node_modules/**",
  "fileTwin.openInSplit": true
}
```

## Runtime Behavior
- No matching link pattern for the active file:
  - info message: `File Twin: Keine Zuordnung fuer die aktive Datei gefunden.`
- Derived target name not found in workspace:
  - info message with searched filename.
- Multiple workspace matches:
  - searchable QuickPick to choose target file.
- Only local file URIs are supported in current scope.

## Quality Status
- Automated tests: `npm test` (Node test runner) currently green.
- Covered areas include:
  - template and regex link validation
  - recursive link resolution and cycle handling
  - ambiguous pattern stabilization
  - multi-target link groups
  - search option normalization

## Internal Developer Docs
Internal planning, architecture rules, and QA docs are in `docs/`.

Start here: `docs/README-internal.md`

Public usage/config documentation is intentionally centralized in this README.
