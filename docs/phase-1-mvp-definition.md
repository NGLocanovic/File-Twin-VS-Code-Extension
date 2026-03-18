# Phase 1 MVP Definition

Interne Projektdokumentation (Historie/Entscheidungen).

Stand: 2026-03-16

## 1) Ziel-Usecase (praezisiert)
Aus einer aktuell geoeffneten Datei in VS Code soll per bewusst ausgeloester Aktion genau eine definierte Zieldatei geoeffnet werden.
Status: Final bestaetigt.

## 2) MVP-Scope

### Im Scope (MVP)
- Eine minimale, klar ausloesbare Aktion zum Oeffnen der Zieldatei.
- Fokus auf genau die Kernfunktion "Datei A -> Datei B oeffnen".
- Bidirektionales Springen innerhalb derselben Namenskonvention.
- Klare, deterministische Reaktion, wenn fuer die Ausgangsdatei keine Zuordnung existiert.

### Nicht im Scope (MVP)
- Mehrere Commands oder komplexe UX-Varianten.
- Komfortfunktionen (Dateiwatcher, Telemetrie, erweiterte UI).
- Komplexe Persistenz oder eigene Datenhaltung.
- Erweiterte Sonderfaelle (z. B. breite Multi-Root-Logik).

## 3) Offene, direkt blockierende Entscheidungen
1. Mapping-Strategie im MVP
   - Entschieden: Ableitung ueber Namenskonvention, individuell konfigurierbar ueber Extension-Settings.

2. Minimales Settings-Schema fuer die Namenskonvention (MVP)
   - Entschieden: Genau ein `from`/`to`-Pattern-Paar in den Extension-Settings.
   - Setting-Key (MVP): `fileTwin.mappingPattern`
   - Historischer Stand: In Phase 4 ersetzt durch `fileTwin.links` (symmetrische Link-Gruppen als `[patternA, patternB, ...]`).
   - Struktur (MVP):
     - `from`: string (pflicht)
     - `to`: string (pflicht)
   - Platzhalter-Regel (MVP): `{name}` steht fuer den variablen Dateinamenanteil.
   - Beispiel:
     - `from`: `{name}.ts`
     - `to`: `{name}.test.ts`

3. MVP-UX-Ausloeser
   - Entschieden: Option B (Command Palette plus Explorer-/Kontextmenue).

4. Verhalten ohne Zuordnung
   - Entschieden: Option A (kurze Info-Meldung und kein Oeffnen).

## 4) Phase-1-Backlog

### Aktuell
- Keine offenen Definitionspunkte in Phase 1.

### Spaeter
- Weitere Ausloeser (Kontextmenue, Keybinding) pruefen.
- Multi-Root-Unterstuetzung konkretisieren (nur wenn notwendig).

### Bewusst nicht Teil dieser Phase
- Ausbau zu komplexer Konfigurationsoberflaeche.
- Erweiterte Zusatzfeatures ohne direkten MVP-Nutzen.
- Umfangreiche Architektur fuer spaeteren Ausbau.

## 5) Phase-Status
- Phase 1 abgeschlossen (2026-03-17).
- MVP-Smoke-Tests erfolgreich bestaetigt.
- Nachtrag (2026-03-17): Multi-Root-Verhalten spaeter angepasst auf dateinamen-basierte Suche ueber den gesamten Workspace.
