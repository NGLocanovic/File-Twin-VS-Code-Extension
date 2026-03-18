# Projektstatus

Interne Entwicklerdokumentation fuer Projektfortschritt. Oeffentliche Produktinfo steht in `README.md`.

Stand: 2026-03-18

## Status
- Phase 1: abgeschlossen
- Phase 2: abgeschlossen
- Phase 3: abgeschlossen

## Umgesetzte Funktionen
- Command `fileTwin.openMappedFile` (Command Palette + Explorer/Editor/Tab-Kontextmenue + Icon in der Editor-Tableiste)
- Dateinamen-basiertes Mapping ueber `fileTwin.links` als Pattern-Link-Gruppen
- Symmetrische Verlinkung (`[patternA, patternB, ...]` in beide Richtungen) mit Kettenauswertung
- Workspace-weite Suche nach Ziel-Dateien
- Optionales Such-Scoping:
  - `fileTwin.searchIncludeGlob`
  - `fileTwin.searchExcludeGlob`
- Mehrfachtreffer-Auswahl via suchbarem QuickPick
- Schutz gegen identische Quelle/Ziel-Datei
- Klare Info-Meldungen bei fehlender Zuordnung oder fehlender Zieldatei

## Verifizierte Praxis-Konfiguration (SQL)
```json
{
  "fileTwin.links": [
    ["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]
  ],
  "fileTwin.searchIncludeGlob": "src",
  "fileTwin.searchExcludeGlob": "**/node_modules/**"
}
```

## Teststatus
- Build: `npm run compile` erfolgreich
- Automatisierte Tests: `npm test` erfolgreich (9/9)
  - Link-Kettenaufloesung
  - Schutz vor rekursivem Namenswachstum bei mehrdeutigen Links
  - Zyklus-Stop-Regel und Duplikatvermeidung
  - Regex-Link-Unterstuetzung
  - Multi-Target-Link-Unterstuetzung innerhalb eines Link-Eintrags
  - Link-Validierung
  - Include-Pattern-Aufbau
  - Search-Options-Normalisierung (Trim/Fallback)
- Manuelle MVP-Smoke-Tests: bestanden (dokumentiert in `docs/mvp-smoke-test.md`)

## Bekannte Grenzen
- Keine automatisierten Extension-Host-Integrationstests
- Keine Snapshot-/UI-Tests fuer QuickPick
- Keine Persistenz von letzter Mehrfachtreffer-Auswahl
- Keine komplexe Settings-UI

## Referenzen
- Settings: `docs/settings-reference.md`
- MVP-Tests: `docs/mvp-smoke-test.md`
- Phase 1: `docs/phase-1-mvp-definition.md`
- Phase 2: `docs/phase-2-backlog.md`
- Phase 3: `docs/phase-3-backlog.md`
