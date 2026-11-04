# Borderline verstehen · Fugenland 2 — Claude-Fassung

Stand: 4. November 2026. Harness: Claude (Claude Code, Modell Claude Opus 5.5). Eigene Arbeitskopie, eigener Dienst, eigene Registrierung. Diese Fassung ist **vorgelegt, nicht abgenommen**. Ob sie überzeugt, entscheidet Ralf.

Startadresse: <http://127.0.0.1:4393/> (nur Loopback). Start: `node server.mjs` in diesem Ordner.

## Anlass

Ralf hat Fugenland 1 am 4. November abgelehnt: „die visualisierung und funktionalität liegt noch meilenweit von meinem anspruch und wunsch entfernt“. Er sah „nur gleich aussehende Verbindungen, Bananengraphen und nicht Fugen mit unterschiedlichsten Funktionen“. Die früheren Fugen-Apps seien nicht wirklich angeschaut worden.

Der abgelehnte Stand ist als Git-Tag `abgelehnt-20261104` erhalten. Sein Ergebnisbericht liegt in [docs/QUELLEN-UND-ERGEBNIS-ABGELEHNT-20261103.md](docs/QUELLEN-UND-ERGEBNIS-ABGELEHNT-20261103.md).

## Grundidee von Fugenland 2

Die Fugen tragen den Raum. Im Feld gibt es **keine Kantenlinien** mehr. Das Gelände entsteht aus der Dichte der 1226 Orte. Darauf stehen 217 **Fugenorte**, jeder mit einem Zeichen seiner Art. Ein Fugenort ist kein Strich zwischen zwei Punkten, sondern ein Ort, den man betritt: Die Kamera fliegt hin, der Raum entfaltet sich aus dieser Stelle, und „Zum Feld“ (oder Escape, oder Browser-Zurück) führt an dieselbe Stelle zurück.

Jede Raumart ist **anders gebaut und anders bedienbar**. Die Gestalt kommt aus den Daten des Falls: so viele Riegel wie Grenzen, so viele Zuströme wie Herkünfte, so viele Steine wie Quellen.

| Raum | Bau | Bedienung | aus dem Bestand | Fälle |
| --- | --- | --- | --- | --- |
| **Übersetzung** | zwei Fassungen, dazwischen ein Pass mit fünf Becken | Wort aufnehmen, in „bleibt erhalten / verändert sich / nur in einer Fassung / nicht übersetzbar / hier beginnt Verfälschung“ legen; Wortgleiche zeigen; Original lesen | derselbe Ortstitel in verschiedenen Gebieten, mit eigenem Wortlaut | 36 |
| **Gegenhalt** | zwei Felsmassen mit Bruchkante, offener Spalt | Belegstein aufnehmen, Gegenstimme in den Spalt keilen, Seite wechseln | Originalkanten der Lesarten Widerspruch, Gegenpol, Nicht-dasselbe | 31 |
| **Schwelle** | Tor mit Riegeln, Aussage dahinter | Riegel ziehen (entziehen), Riegel prüfen (erfüllt, ungeklärt, verletzt), Stufen Möglichkeit → Regel → Versuch → Wirkung | Kanten mit Geltungsgrenze oder Bedingung an einem Ort (ab drei im Feld) | 29 im Feld, 72 im Bestand |
| **Überschneidung** | Membranen mehrerer Stimmen, Phänomene im Schwerpunkt ihrer Stimmen | bis zu sechs Stimmen zu- und abschalten, Phänomen antippen, Unterscheidungsfrage festhalten | „wird beschrieben im Kontext“ mit Quelle, 26 Stimmen | 37 |
| **Entstehung** | Zuströme laufen in einem Becken zusammen, Nachfolger fließen ab | Zustrom öffnen, Beitrag benennen, Wendepunkt setzen, Gemeinsames festhalten, flussabwärts gehen | „hervorgegangen aus“ mit mindestens zwei Herkünften | 21 |
| **Fehlstelle** | ausgesparte Kammer mit beschriftetem Rand, leere Mitte | Rand abtasten, Lücke einordnen (unbekannt, nicht untersucht, nicht zugänglich, bewusst offen), Frage heften, Nicht-Verbindung begründen | untersucht ohne festgehaltenen Befund; ein Fundus-Kapitel ohne Ort | 63 |
| **Herkunft und Geltung** | Bohrkern unter jedem Raum: Original → Ableitung → Raumbildung → deine Revision | Verbindung wählen, Schlussprobe ansetzen (trägt teilweise, scheitert, trifft nicht – aus den Feldern ausgewertet), Reichweite lesen | alle Kanten des Raums | in jedem Raum |

### Orte, Werke, Aufnahmen und eigene Arbeit (aus Fugenland 1, jetzt in die Fugen eingebettet)

- **Ortssuche** über alle 1226 Orte (Kopfzeile, mit Pfeiltasten und Eingabe bedienbar).
- **Ortsraum** für jeden Ort: voller Wortlaut, Herkunft und Quellen. Daneben die Fugenräume, an denen der Ort beteiligt ist; dies ist der Rückweg vom Ort in seine Fugen. Dazu die Kanten des Orts im Bestand.
- **Ortslinks** führen aus jedem Fugenraum in den Ortsraum der Beteiligten.
- **Werke von Walter Andreas Kirchner** an den Orten, denen der Bestand sie zuordnet: ganzes Bild, Herkunft ohne Maßangabe, Link zur Künstlerseite, Hinweis „Bildzuordnung als Anregung; keine Deutung des Werks“.
- **Aufnahmen**: Sie hängen im Bestand an keinem Ort und sind deshalb redaktionell über ihr Thema einem Gebiet zugeordnet, als solche gekennzeichnet, mit KI-Hinweis und Prüfangabe. Es gibt einen gemeinsamen Spieler: Er startet nur auf Klick, lässt sich verkleinern, spielt bei jedem Raumwechsel weiter und hat einen Rückweg zum Ort.
- **Notizen am Ort** und **Hand**: Orte aufnehmen, daraus eine **eigene Fuge** bilden. Sie ist eine Station mit Armen, mit Rolle und Richtung je Beteiligtem, Aussage, Gegenrichtung, Grenze, Perspektive, Stand und Verlauf mit vorheriger Fassung; auch als Nicht-Verbindung (Arme enden vor der Mitte). Eigene Fugen stehen in blauer Tinte als Fugenorte im Feld und erscheinen im Ortsraum jedes Beteiligten.

Mehr als zwei Beteiligte gibt es in der Überschneidung (bis zu sechs Stimmen), in der Entstehung (bis zu drei Herkünfte und mehrere Nachfolger) und in der Fehlstelle (ein Rand aus bis zu 189 Kanten).

**Lebendig ist nur, was belegt ist.** Jede Handlung in einem Raum wird als Ereignis mit Ort gespeichert. Aus diesen Ereignissen entsteht eine Reifungsschicht im Feld: eine Diffusion echter Ereignisse. Nach jeder neuen Handlung läuft ein Ausbreitungsring vom Fugenort aus, und bearbeitete Fugenorte tragen Spiralringe. Ohne Handlung ruht das Feld. Es gibt keinen wandernden Punkt und keine Strömung, die eine Wirkung nahelegt.

Herkunft jeder Idee, was ich davon bedient habe und wie sie weiterentwickelt wurde: [docs/HERKUNFT-DER-IDEEN.md](docs/HERKUNFT-DER-IDEEN.md). Vorher und nachher an derselben Fuge: [docs/VORHER-NACHHER.md](docs/VORHER-NACHHER.md).

## Fünf Bauschritte aus der FASKA-Sichtung (4. November, nachmittags)

Grundlage: `Artifacts/faska-verknuepfungen-claude-20261104/FASKA-VERKNUEPFUNGEN-FUER-FUGENLAND-CLAUDE.md`, Abschnitte 4–6, und Ralfs Reihenfolge („zuerst die Bedienfehler, danach die weiteren Schritte einzeln mit Bildern“). Jeder Schritt ist ein eigener Commit. Bilder der bedienten Oberfläche liegen in `evidence/schritte-20261104/`.

1. **Bedienfehler** (`7cf292e`):
   - Die Herkunftsebene schließt beim Raumwechsel; „Zur Quelle“ ist wieder erreichbar.
   - Die Original-Schicht ist ganz lesbar. Ursache war eine Klassenkollision mit dem Original-Dialog.
   - Die Art-Auswahl der eigenen Fuge wirkt sofort.
   - Eine gespeicherte eigene Fuge öffnet sich in der Gestalt ihrer Art, zum Beispiel als Schwelle mit eigenen Riegeln („deine eigene Bedingung, kein Bestand“). Ebenso Gegenhalt, Übersetzung, Entstehung und Fehlstelle. Überschneidung, offene Frage und Nicht-Verbindung bleiben Station, mit Begründung.
2. **Zustand jeder Fuge** (`c62e86e`):
   - Dein Urteil über die redaktionelle Raumbildung: trägt, begrenzt, trägt nicht, gilt hier nicht oder offen halten, jeweils mit Grund. Ohne Urteil heißt es „ungeprüft“. Es gibt einen Verlauf.
   - Das Urteil ist an einen Abdruck des Inhalts gebunden. Ändert sich der Inhalt, erlischt es dauerhaft, auch wenn der alte Inhalt zurückkehrt (OCR-Prinzip).
   - Jeder Zustand hat eine eigene Marke an der Glyphe.
   - „Vom Dienst gespeichert“ erscheint erst nach der Schreibbestätigung. Ein geladener Stand heißt „Gespeicherter Stand geladen“.
3. **Offene Fäden** (`4b5ec6f`):
   - Gegenstimmen, Lückenfragen und Unterscheidungsfragen stehen in einer Sammlung und im Ortsraum aller Beteiligten.
   - Schließen geht nur mit Notiz, Wiederöffnen nur mit Grund. Beides bleibt im Verlauf; es gibt keinen Systemdialog.
   - Ein Faden springt in seinen Raum.
4. **Bindung eigener Fugen** (`13453ee`):
   - Jede Beteiligung trägt den Abdruck ihres Ortswortlauts.
   - Lösen oder Hinzunehmen ergibt „Persönliche Zuordnung erloschen, weil …“, bis du neu bestätigst. Das gilt auch, wenn der Beteiligte zurückkommt.
   - Ein geänderter Wortlaut ergibt „Ende hat sich geändert, prüfen“.
   - Der Verlauf zeigt Fassung, vorher, nachher, Grund und Zeit. Im Feld steht die erloschen-Marke.
5. **Umgebung und Rückweg** (Commit siehe Git-Log):
   - Hover oder Auswahl zeigt Leinen in der Form der Art: Riss, Riegelstriche, Doppellinie, Zustrom, Punktlinie, Membranrand oder Arm.
   - Andere Fugenorte am selben Ort werden markiert, höchstens sechs, dazu „weitere N“. Unbeteiligte Fugenorte treten zurück.
   - Ohne Auswahl ruht das Feld ohne Linien.
   - Ein Lesepfad mit Sprung zu jedem Glied. Escape geht Stufe für Stufe zurück und kehrt einen laufenden Flug um.
   - „Zum Feld“ stellt den vorherigen Ausschnitt her.

**Bewusst nicht entschieden**: die Rücknahmespur (Ralfs EINE-APP-Entscheidung, „Zurücknehmen hinterlässt keine Spur“). Es gibt keine neue Regel. Verläufe gibt es nur, wo die fünf Schritte sie ausdrücklich verlangen: bei Fäden, Urteilen und der Fassung eigener Fugen. **OCR**: nicht angeschlossen, nicht erwähnt, kein Modell gestartet. Übernommen sind nur die Prinzipien: Freigabe an den Inhalt gebunden, ungeprüft und „gilt nicht“ als eigene Zustände, nichts automatisch bestätigt.

**Offen aus den Schritten**:
- Fäden aus eigenen Fugen in Raumgestalt werden nicht gesammelt.
- Bei erloschener Zuordnung bleibt unten „persönliche Zuordnung“ angewählt; das Banner meldet „erloschen“.
- Die Zustandsmarken sind klein. Im Überblick sind sie erst beim Hineinzoomen lesbar.
- Der Kombinator (Ralf: „sowohl als auch“) ist nicht gebaut.
- Kanten im Ortsraum sind noch nicht nach Art gruppiert.

## Datenbasis

- Lesebestand wie in Fugenland 1: aus `borderline-verstehen-atlas/dist/atlas-collection.json` nur lesend abgeleitet (`data-readonly/karte.json`, `texte.json`).
- Neu: `scripts/build-fugenraeume.mjs` bildet daraus `data-readonly/fugenraeume.json`. Jede Rauminstanz nennt in `gebildetAus`, aus welchen Originalkanten sie entstand. Die Raumart ist eine **redaktionelle Lesart dieser Fassung**, keine fachliche Prüfung.
- Der Wortabgleich der Übersetzung arbeitet mit Wortstämmen und ist ausdrücklich nur Sprachebene.
- Die Schlussproben im Bohrkern werten tatsächliche Felder aus: Hat die Verbindung selbst eine Quelle? Ist sie eine Modellkante? Gibt es gleiche Wortstämme?

## Persönliche Arbeit

- Gespeichert in `private-data/werkstatt.json` (Format `fugenland-werkstatt`, jetzt Version 2 mit `raeume` und `ereignisse`). Rechte 0600, nicht im Git, Sicherung des vorherigen Stands. Ein veralteter Stand wird abgewiesen statt überschrieben.
- Vorhandene v1-Einträge (`gefuege`, `notizen`) bleiben beim Speichern erhalten. Fugenland 2 zeigt sie aber nicht an (siehe unten).
- Vor jedem Speichern prüft der Dienst das Volume A03B10FD-5F22-4366-A71C-2D95AC701BD2. Ohne Volume startet er nicht.

## Prüfung

`scripts/pruefung.mjs` startet einen eigenen Prüfdienst (Port 4394) mit eigenem Datenordner `.cache/pruefdaten`. Protokoll: `evidence/pruefung-20261104/protokoll.json`, Bilder: `evidence/pruefung-20261104/bilder/`, Bewegungsaufnahme: `evidence/pruefung-20261104/video/gesamtweg-desktop.mp4` (nicht im Git). Prüfstand:
- **Letzter vollständiger Lauf (nach allen Änderungen, mit Orten, Werken, Spieler und Werkbank): 76 von 77 bestanden.** Nicht bestanden ist „Variantenraum erreichbar“: Der Raum auf Port 4191 lief zu diesem Zeitpunkt nicht mehr. Er ist nicht mein Dienst, deshalb habe ich ihn nicht gestartet. Die Einbettungsprüfung ist für den Endstand also **offen**.
- Im Lauf vor dem Wiedereinbau, noch vor den letzten CSS-Anpassungen, bestanden 63 von 63, eingebettet im laufenden Raum. Bilder `95-eingebettet-feld.png` und `96-eingebettet-gegenhalt.png` stammen aus diesem Lauf. Geprüft:

- **Desktop 1440×900**:
  - Feld mit allen Raumarten, Ziehen und Zoomen;
  - Fugenort im Feldbild anklicken, Flug und Entfaltung;
  - jeder Raum mit seinen Handlungen und Zustandswechseln;
  - Herkunftsebene mit Probe;
  - technische Kennungen nur in geschlossenen Details;
  - Rückkehr mit erhaltener Kamera und Auswahl;
  - Reifung im Feld;
  - Original und Fundus-Kapitel im vollen Wortlaut;
  - Verschiedenheit der Raumarten (eigene Wurzelklasse; Zahl der SVG, Knöpfe und Eingaben);
  - Browser-Zurück;
  - keine Anfragen an fremde Dienste, keine Konsolenfehler;
  - sichtbarer Speicherstand und Bewegungsaufnahme.
- **Orte und Werkbank**: Spieler startet nicht von selbst; Suche per Tastatur; Ortsraum mit Wortlaut, Herkunft und Fugenräumen; Notiz; vom Ort in die Fuge und über den Ortslink zurück; Werk mit Herkunft und ohne Maßangabe; Spieler bleibt bei Raumwechsel; Hand mit drei Orten; eigene Fuge anlegen und als Nicht-Verbindung ändern (Verlauf); eigene Fuge im Feld; Wiederöffnen von eigener Fuge und Notiz.
- **Wiederöffnen** in einem neuen Browser: Gegenstimme, Becken und Ereignisse sind noch da.
- **Schmal 390×844 mit Berührung**: Raum über die Liste geöffnet, Wort per Berührung eingelegt, fünf Räume ohne seitliches Überlaufen, Herkunftsebene erreichbar.
- **Tastatur**:
  - Feld bewegen, Liste öffnen, Raum öffnen mit Fokus auf dem Titel;
  - Wort mit Pfeiltasten wählen und einlegen;
  - Phänomen in der Membranansicht wählen;
  - Escape zurück mit Fokus auf dem Feld.
- **Kontrast**: 16 Farbpaare rechnerisch aus den gesetzten Werten, Text mindestens 4,5 : 1, Rahmen mindestens 3 : 1. Bei Verläufen gilt jeweils die ungünstigste Stelle.
- **Ohne WebGL und mit reduzierter Bewegung**: Das Feld ist ohnehin Canvas 2D und zeichnet vollständig. „Bewegung ruht“ ist von Anfang an gesetzt, der Raum öffnet ohne Entfaltung.
- **Eingebettet** im Variantenraum (515×603, Sandbox wie im Raum): Laden, Raum bedienen, Arbeit gespeichert.

Die Bilder der Gestaltungsentwicklung liegen in `evidence/entwurf-20261104/`, die Sichtung der früheren Werke in `evidence/sichtung-20261104/` (beide nicht im Git).

## Ausdrücklich offen

- **Menschliche gestalterische Abnahme**: offen. Tests und Screenshots sind kein Gestaltungsurteil.
- **Wiedergabe im Spieler**: Im Headless-Browser startet der Spieler auf Klick und ist nicht pausiert. Die Wiedergabezeit blieb dort aber bei 0. Dass tatsächlich Ton oder Bild läuft, ist damit nicht belegt.
- **Altdaten-Import** aus dem früheren Atlasformat (`mein-atlasblick.json`): in Fugenland 2 nicht wieder eingebaut.
- **Dichte im Überblick**: In Gebieten mit vielen Fugenorten (Beziehungen & Borderline, Phänomenatlas) drängen sich die Zeichen trotz Entzerrung. Erst beim Hineinzoomen werden sie einzeln lesbar und tragen ihren Namen.
- **Gleichförmige Grenzen**: Viele Schwellen im Gebiet „Beziehungen & Borderline“ tragen dieselbe redaktionelle Grenze („Redaktioneller Lernanschluss …“). Das ist der Bestand. Die Riegel unterscheiden sich dort nur durch ihre Fuge, nicht durch den Grenztext.
- **Fachliche Prüfung** der Raumzuordnung: offen. Die Regeln stehen in `scripts/build-fugenraeume.mjs`.
- **Werkverbindungen** zu TiSCH, Companion, Hermes, NotebookLM, Unreal und weiteren: nicht hergestellt.
- **Grok-App und WiRKGEFÜGE** wurden nicht im Betrieb bedient: Grok braucht Datenbank und Umgebung, WiRKGEFÜGE übermittelt an einen OpenAI-Zugang. Gesehen sind ein Grok-Bildschirmbild und der WiRKGEFÜGE-Rahmen ohne Bestand.
- **Forschung**: bibliografisch per Crossref geprüft, inhaltlich nicht vollständig gelesen; nur als Gestaltungsanregung verwendet.
- **Screenreader**: nur über Namen und Rollen geprüft, nicht mit VoiceOver. **Echte Telefone**: nur Emulation.
