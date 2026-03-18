# Phase 4 Backlog

Interne Projektdokumentation (Backlog-Historie).

Stand: 2026-03-18

## Ziel von Phase 4
Funktionsausbau fuer flexiblere Mapping-Regeln und oeffnungsbezogene UX-Optionen.

## Offene, blockierende Entscheidung 1
Wie werden mehrere Regeln minimal in den Settings modelliert?

- Option A: Ein Objekt mit festen Feldern fuer eine Primarregel plus optionale Zusatzregel.
- Option B: Ein Array von Regelobjekten (jede Regel mit `from`/`to`, spaeter optional weiteren Feldern).
- Entschieden: Option B (Array von Regelobjekten).

## Offene, blockierende Entscheidung 2
Wie wird Regex-Unterstuetzung in Regeln minimal und eindeutig modelliert?

- Option A: Expliziter Regelmodus pro Regelobjekt, z. B. `mode: "template" | "regex"`.
- Option B: Regex direkt in `from`/`to` ohne separates Modus-Feld (implizite Erkennung).
- Entschieden: Option B (Regex direkt in `from`/`to` mit impliziter Erkennung).

## Offene, blockierende Entscheidung 3
Soll das Regelmodell von gerichteten `from`/`to`-Regeln auf symmetrische Verlinkungen umgestellt werden?

- Option A: Bestehendes gerichtetes Muster-Modell behalten.
- Option B: Neues Verlinkungsmodell mit Link-Gruppen (z. B. `["patternA","patternB", ...]`) und rekursiver Folgeregel-Auswertung.
- Entschieden: Option B (symmetrische Verlinkungen mit Folgeregel-Auswertung).

## Aktuell (Todo)
- Keine Eintraege.

## Spaeter
- VSCE-Optimierung in eigener Folgephase:
  - `repository` in `package.json` ergaenzen.
  - `LICENSE` hinzufuegen.
  - `.vscodeignore` oder `files`-Whitelist definieren.
  - README-Links fuer VSCE robust halten.

## Erledigt
- Oeffnungsverhalten konfigurierbar:
  - Setting `fileTwin.openInSplit` steuert die Oeffnung im Split Editor.
- Regex-Unterstuetzung in Link-Patterns:
  - Implizite Erkennung ueber `/.../` auf der gematchten Seite.
  - Capture-Gruppen koennen auf der Gegenseite ueber `$1`, `$2`, ... verwendet werden.
- Verlinkungsmodell (symmetrische Links) umgesetzt:
  - Ziel-Schema `fileTwin.links` mit Link-Gruppen (`[patternA, patternB, ...]`) eingefuehrt.
  - Kettenauswertung inkl. Stop-Regel und Duplikatvermeidung umgesetzt.
  - Runtime verwendet durchgaengig `fileTwin.links`.
  - Doku und Unit-Tests sind auf den `links`-Standard aktualisiert.

## Bewusst nicht Teil von Phase 4
- Noch offen.

## Minimales Settings-Schema (festgelegt)
- Neuer Setting-Key (Standard): `fileTwin.links`
- Typ: Array von Link-Gruppen
- Pflichtformat pro Link:
  - `["patternA", "patternB", ...]` (mindestens 2 strings)
- Regel-Syntax:
  - Template-Regel: Bei Links ohne Regex muss `{name}` auf jeder Link-Seite genau einmal vorkommen.
  - Regex-Regel: Maximal eine Seite eines Links steht im Format `/.../`; die Gegenseiten sind String-Muster (optional mit `$1`, `$2`, ...).
- Reihenfolge:
  - Links werden symmetrisch ausgewertet; Kettenauswertung erfolgt iterativ mit Stop-Regel.
- Fallback-Verhalten:
  - `fileTwin.links` muss als gueltiges, nicht-leeres Array gesetzt sein.
  - Bei ungueltigen/fehlenden `links` wird eine klare Settings-Info-Meldung gezeigt.
  - Wenn keine Zuordnung Treffer liefert: Info-Meldung "Keine Zuordnung fuer die aktive Datei gefunden."

### Beispiel
```json
{
  "fileTwin.links": [
    ["db.proc_{name}.sql", "db.table_{name}.sql", "module.{name}.sql"]
  ]
}
```
