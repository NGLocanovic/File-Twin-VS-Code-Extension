# MVP Smoke Test

Interne QA-Dokumentation. Oeffentliche Nutzungshinweise stehen in `README.md`.

Stand: 2026-03-17

## Ziel
Schnell pruefen, dass `fileTwin.openMappedFile` Ziel-Dateien aus `fileTwin.links` korrekt oeffnet.

## Voraussetzungen
- Abhaengigkeiten installiert: `npm install`
- Build erfolgreich: `npm run compile`

## Testdaten
- Quell-Datei: `smoke-test-fixtures/example.ts`
- Ziel-Datei: `smoke-test-fixtures/example.test.ts`

## Extension-Settings (MVP)
Setze in den Workspace-Settings:

- Vollstaendige Settings-Referenz:
  `docs/settings-reference.md`

```json
{
  "fileTwin.links": [
    ["{name}.ts", "{name}.test.ts"]
  ]
}
```

## Smoke-Test 1: Command Palette (vorwaerts)
1. Starte die Extension im Extension Development Host (`F5`).
2. Oeffne `smoke-test-fixtures/example.ts`.
3. Fuehre `File Twin: Open Twin File` aus der Command Palette aus.
4. Erwartet: `smoke-test-fixtures/example.test.ts` wird geoeffnet.

## Smoke-Test 2: Explorer-Kontextmenue (rueckwaerts)
1. Rechtsklick auf `smoke-test-fixtures/example.test.ts` im Explorer.
2. Fuehre `File Twin: Open Twin File` aus.
3. Erwartet: `smoke-test-fixtures/example.ts` wird geoeffnet.

## Smoke-Test 3: Kein Mapping-Treffer
1. Oeffne `smoke-test-fixtures/no-match.js`.
2. Fuehre `File Twin: Open Twin File` aus.
3. Erwartet: Info-Meldung `Keine Zuordnung fuer die aktive Datei gefunden.`

## Ergebnis
- Ausfuehrung am 2026-03-17: erfolgreich.
- Smoke-Test 1: bestanden.
- Smoke-Test 2: bestanden.
- Smoke-Test 3: bestanden.
