# Internal: Settings Schema Reference

Interne Entwicklerdokumentation. Oeffentliche Nutzung und Beispiele stehen in `README.md`.

Stand: 2026-03-18

## Settings (technisches Schema)
- `fileTwin.links` (array, bevorzugter Standard)
- `fileTwin.links[]` (array mit mindestens 2 strings, pflicht)
- `fileTwin.searchIncludeGlob` (string, optional, default: `**`)
- `fileTwin.searchExcludeGlob` (string, optional, default: leer)
- `fileTwin.openInSplit` (boolean, optional, default: `false`)

## Regeln (technischer Stand)
- `fileTwin.links` soll mindestens einen gueltigen Link enthalten.
- Pro Link muessen mindestens zwei Muster gesetzt sein: `["patternA", "patternB", ...]`.
- Jede Seite des Link-Eintrags nutzt bekannte Pattern-Syntax:
  - Template mit genau einem `{name}` oder
  - Regex im Format `/.../`.
- Regex-Regel pro Link-Eintrag:
  - maximal eine Regex-Seite pro Link-Eintrag.
- `searchIncludeGlob` begrenzt den Suchbereich im Workspace.
- `searchExcludeGlob` schliesst Pfade aus der Suche aus.
- `openInSplit` steuert, ob gefundene Zieldateien im Split Editor geoeffnet werden.

## Regex-Syntax
- Eine Regex-Seite wird als String im Format `/.../` angegeben.
- Die Gegenseiten duerfen Capture-Gruppen ueber `$1`, `$2`, ... referenzieren.
- Ungueltige Regex machen den betroffenen Link/die betroffene Regel ungueltig.

## Interne Beispielkonfiguration 1: TypeScript
```json
{
  "fileTwin.links": [
    ["{name}.ts", "{name}.test.ts"]
  ]
}
```

## Interne Beispielkonfiguration 2: SQL Verlinkungskette
```json
{
  "fileTwin.links": [
    ["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]
  ]
}
```

## Interne Beispielkonfiguration 3: SQL + Suchbereich begrenzen
```json
{
  "fileTwin.links": [
    ["db.proc_{name}.sql", "db.table_{name}.sql"]
  ],
  "fileTwin.searchIncludeGlob": "src",
  "fileTwin.searchExcludeGlob": "**/node_modules/**"
}
```

## Interne Beispielkonfiguration 4: Regex in links
```json
{
  "fileTwin.links": [
    ["/^db\\.proc_(.+)\\.sql$/", "db.table_$1.sql"]
  ]
}
```

## Interne Beispielkonfiguration 5: Im Split Editor oeffnen
```json
{
  "fileTwin.links": [
    ["{name}.ts", "{name}.test.ts"]
  ],
  "fileTwin.openInSplit": true
}
```

## Wo eintragen (intern)
- Ordnerbasiert: `.vscode/settings.json`
- Workspace-basiert: `*.code-workspace` unter `"settings"`

Hinweis: Fuer Nutzerkommunikation immer auf `README.md` verweisen.
