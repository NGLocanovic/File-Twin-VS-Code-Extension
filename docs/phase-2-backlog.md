# Phase 2 Backlog

Interne Projektdokumentation (Backlog-Historie).

Stand: 2026-03-18

## Ziel von Phase 2
MVP stabilisieren, ohne den Funktionsumfang unnötig auszubauen.

## Aktuell
- Keine offenen Punkte.

## Erledigt
- Fehlermeldung bei nicht gefundener Zieldatei um den berechneten Zielpfad erweitert.
- Schutz gegen identische Quell-/Zieldatei umgesetzt (kein sinnloses Re-Open derselben Datei).
- Multi-Root-Verhalten (alt) ersetzt: "Zieldatei im gleichen Verzeichnis wie Quelldatei".
- Multi-Root-Verhalten (neu entschieden): Dateinamen-basierte Suche ueber den gesamten Multi-Root-Workspace.
- Workspace-weite Dateisuche fuer Zielkandidaten umgesetzt (dateinamen-basiert ueber alle Workspace-Ordner).

## Spaeter
- Optionaler Keybinding-Trigger pruefen.
- Optionales Kontextmenue-Feintuning (`when`-Bedingungen) pruefen.

## Bewusst nicht Teil von Phase 2
- Komplexer Settings-Editor.
- Dateiwatcher oder Hintergrund-Indexierung.
- Umfangreiche Test-/CI-Infrastruktur.

## Phase-Status
- Phase 2 abgeschlossen (2026-03-18).
