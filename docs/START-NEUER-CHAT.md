# Fortsetzung Fugenland 2 · Claude-Fassung (Stand 4. November 2026, abends)

Du setzt als **Claude** die Arbeit an „Borderline verstehen · Fugenland 2“ fort. Arbeitskopie: `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103`. Dienst: `node server.mjs` → http://127.0.0.1:4393/. Er nutzt `private-data/` mit Ralfs persönlicher Arbeit; diese Daten sind nicht zum Testen da.

## Zuerst prüfen, nicht glauben
- Volume prüfen: `diskutil info /Volumes/ThunderBolt4_2TB | grep "Volume UUID"` muss `A03B10FD-5F22-4366-A71C-2D95AC701BD2` ergeben.
- `git status` und `git log --oneline | head -8` ausführen. Der letzte bekannte Stand ist `ea0ccb2` mit sauberem Arbeitsbaum, lokal und nicht gepusht.
- Prüfen, ob 4393 läuft (`lsof -tiTCP:4393 -sTCP:LISTEN`). Falls nicht, starten.
- Den Variantenraum auf 4191 prüfen. Er lief zuletzt nicht. Er ist nicht dein Dienst; starte ihn nicht.
- Lesen: `QUELLEN-UND-ERGEBNIS-CLAUDE.md`, besonders den Abschnitt „Fünf Bauschritte aus der FASKA-Sichtung“ und „Ausdrücklich offen“. Dazu `docs/HERKUNFT-DER-IDEEN.md`, `docs/VORHER-NACHHER.md` und die heutigen Einträge der Tageschronik `/Volumes/ThunderBolt4_2TB/MiNDLAXY/Tageschronik/2026-11-04.md`.

## Was steht (technisch geprüft, von Ralf nicht abgenommen)
- **Feld**: keine Kantenlinien, 217 Fugenorte mit eigenem Zeichen je Art, Reifung nur aus gespeicherten Handlungen.
- **Sechs Raumarten** (Übersetzung, Gegenhalt, Schwelle, Überschneidung, Entstehung, Fehlstelle) und die Ebene Herkunft und Geltung (Bohrkern mit Schlussproben).
- **Ortssuche und Ortsraum** für alle 1226 Orte, Werke von Walter Andreas Kirchner, Spieler, Notizen, Hand, eigene Fugen.
- **Die fünf FASKA-Schritte** (je ein Commit):
  - `7cf292e`: Bedienfehler; eigene Fuge in der Gestalt ihrer Art.
  - `c62e86e`: Urteil je Fuge, an den Inhalt gebunden und erlöschend; „gespeichert“ erst nach Bestätigung des Dienstes.
  - `4b5ec6f`: offene Fäden über alle Räume.
  - `13453ee`: eigene Fugen an den Ortswortlaut gebunden, erlöschende Zuordnung, „Ende hat sich geändert, prüfen“.
  - `ea0ccb2`: Leinen in Fugenform nur bei Auswahl, Lesepfad, Escape in Stufen, Rückkehr zum alten Ausschnitt.
- **Prüfung**: `scripts/pruefung.mjs` (isolierter Dienst 4394, Datenordner `.cache/pruefdaten`). Letzter Lauf 118 von 119; offen ist die Einbettung, weil 4191 nicht lief. Einzelne Blöcke laufen mit `node scripts/pruefung.mjs <block>`. Blöcke: desktop, bedienfehler, zustand, faeden, bindung, umgebung, werkbank, schmal, tastatur, kontrast, ohne-webgl, eingebettet. Achtung: Ein Einzellauf überschreibt `protokoll.json`; am Ende immer den vollständigen Lauf machen.
- Für eigene Bildaufnahmen gibt es den Helfer `.cache/shot.mjs` (Playwright, `OUT`, `VW`, `VH`, `TOUCH`). Starte dazu einen Skizzendienst: `PORT=4395 WERKSTATT_DIR=$PWD/.cache/skizze-daten node server.mjs`.

## Offen, zur Entscheidung oder als nächste Arbeit
- **Ralfs Abnahme** aller Schritte steht aus. Ralf nimmt am Bild ab, nicht an Testzahlen.
- **Rücknahmespur** (EINE-APP: „Zurücknehmen hinterlässt keine Spur“): bewusst unentschieden. Keine neue Regel einbauen, bis Ralf entscheidet.
- **Gestaltungspunkte, die ich gemeldet habe**:
  - Bei erloschener Zuordnung bleibt unten „persönliche Zuordnung“ angewählt.
  - Die Zustandsmarken sind klein.
  - Der Lesepfad ist neben der Suche knapp gekürzt.
  - Im Überblick klumpen die Glyphen in dichten Gebieten.
- **Nicht gebaut**:
  - der Kombinator (Ralf: „sowohl als auch“: Funktion der Hand und eigener Raum; Vorschläge in `/Volumes/ThunderBolt4_2TB/Development/Artifacts/ai-studio-phaenomene-sichtung-claude-20261104/UEBERTRAGUNG-FUER-FUGENLAND.md`);
  - Kanten im Ortsraum nach Art gruppiert;
  - Fäden aus eigenen Fugen in Raumgestalt;
  - Altdaten-Import;
  - der Nachweis, dass der Spieler wirklich abspielt (headless blieb die Zeit bei 0).
- **Weitere Vorschläge** aus der FASKA-Matrix (`/Volumes/ThunderBolt4_2TB/Development/Artifacts/faska-verknuepfungen-claude-20261104/FASKA-VERKNUEPFUNGEN-FUER-FUGENLAND-CLAUDE.md`, Abschnitt 4):
  - Riegel nach Bedingungsart typisieren;
  - Gegenhalt mit den Fächern „geeinigt / strittig / offen / ruhend“;
  - „für diese Stimme nicht dabei“ statt Entfernen;
  - Zeitregler über die eigenen Ereignisse.

  Abschnitt 6 (Ablehnungen) beachten, unter anderem: keine Linienwolke, keine Menge als Größe, keine beigen Flächen mit dünnen Strichen, keine Tortensektoren oder Zielscheiben.

## Regeln (verbindlich)
- **Astra und Fable sind gesperrt**, auch für Unteragenten.
- Vor jeder Schreibarbeit das Volume prüfen. Kein interner Ersatzpfad.
- **Kein Push, kein Railway, keine Veröffentlichung** ohne Ralfs ausdrückliche Freigabe. OCR bleibt aus: kein Modell starten, keinen Adapter anschließen, das kanonische Atlas-Projekt nicht ändern.
- Kanonische Projekte, fremde Arbeitskopien und laufende fremde Dienste nicht verändern. Nur die eigene Arbeitskopie und `Artifacts/atlas-variantenvergleich-20261103/submissions/claude.json` bearbeiten (humanAcceptance bleibt „offen“).
- `private-data/` nie für Tests benutzen. Vor Eingriffen sichern (Beispiel: `.cache/sicherung/`).
- Keine erfundenen medizinischen Aussagen, Forschungsergebnisse oder Werkanschlüsse. Werke von Walter Andreas Kirchner ohne Deutung und ohne Maßangabe.
- Technische Kennungen nur in geschlossenen „Technische Details“. Keine Akkordeons, kein Dunkel-auf-dunkel. Vor UI-Arbeit `/Volumes/ThunderBolt4_2TB/Development/GRUNDMANIFEST-MENSCHLICHE-OBERFLAECHEN.md` lesen.
- Implementierung, technischer Test, Gestaltungsurteil und Ralfs Abnahme getrennt ausweisen. Kein Erfolgstext ohne Nachweis. Größere Schritte mit Bildern der bedienten Oberfläche vorlegen.
- Tageschronik führen, auch mit Fehlschlägen: `python3 tools/chronik/chronik.py eintrag --modell <dein-modell> --themenfeld Fugenland ...` im Repo `/Users/ralfkirchner/Documents/Claude/Projects/ADHS OS/modules/llm-wiki`.

## Erster Schritt
Stand prüfen (siehe oben) und Ralf in drei Sätzen sagen, was du vorgefunden hast. Dann fragen, ob er zu den fünf Schritten oder zur Rücknahmespur schon etwas entschieden hat, bevor du weiterbaust.
