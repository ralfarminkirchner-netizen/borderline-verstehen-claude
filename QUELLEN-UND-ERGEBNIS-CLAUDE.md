# Borderline verstehen · Fugenland — Claude-Fassung

Stand: 3. November 2026. Harness: Claude (Claude Code, Modell Claude Opus 5.5). Eigene Arbeitskopie, eigener Dienst, eigene Registrierung. Diese Fassung ist **vorgelegt, nicht abgenommen**. Ob sie überzeugt, entscheidet Ralf.

Startadresse: <http://127.0.0.1:4393/> (nur Loopback). Start: `node server.mjs` in diesem Ordner.

## Grundidee

Der ganze Atlasbestand liegt als **ein Gelände**: zehn Gebiete (die Sammlungen des Bestands) als Inseln eines Archipels, 1226 Orte als Siedlungen, und dazwischen die **Fugen**, also die Beziehungen, die der Bestand festhält. Die Fuge ist der Kern: Jede Fugenart hat eine eigene **Form** (Zeichen), ein eigenes **Verhalten** (fließt, schreitet, zittert, ruht, bleibt offen) und eine eigene **Funktion** (was sie zeigt, was sie ausdrücklich nicht sagt).

Entfaltung ohne Seitenwechsel: Überblick → Gebiet → Ort (Fugenstern) → Fuge (Station mit Lesebewegungen und Vergleich) → vollständiges Original im Leseraum. Die Karte verschwindet nie. Ein Blatt legt sich über einen Teil der Karte, die Kamera fliegt den gewählten Ort in die freie Fläche, und der Pfad oben bleibt jederzeit antippbar. Browser-Zurück fliegt zurück.

Persönliche Arbeit liegt in derselben Welt: Orte aufnehmen und als Licht über die Karte tragen, weitere bewusst einfangen, daraus eine eigene Fuge mit Rollen, Richtungen, Aussage, Gegenrichtung, Grenze und Perspektive bilden. Eigene Fugen erscheinen in blauer Tinte auf der Karte. Notizen hängen an konkreten Orten.

## Was die Gestaltung gegen die Ablehnung tut

| Abgelehnt (Ablehnungsbilder 21.24.01 und 21.25.04) | In dieser Fassung |
| --- | --- |
| Lange gleichförmige Textstrecken | Text erscheint immer zusammen mit seinem Raum: Fugenstern über dem Text, Lagebild und Abschnittsleiste im Leseraum, Verweise im Fließtext führen zu Orten. Der Originaltext bleibt vollständig und ungekürzt. |
| Akkordeons als Standard | Kein Akkordeon im Inhalt. Die einzige geschlossene Aufklappung sind die technischen Details (Grundmanifest). |
| Isolierte Inhaltskästen, leere Flächen | Das Blatt liegt neben der lebenden Karte. Die Kamera richtet sich nach der freien Fläche, Fugen laufen sichtbar vom Ort zu den Nachbarn. |
| Kaum erkennbare persönliche Eingaben | Helle Felder mit 2 px dunklem Rahmen; Text-Kontrast 17,3:1, Rahmen 3,7:1 (gemessen). Notizen und Werkbank auf hellem Grund. |
| Abgeschnittene Inhalte in der Einbettung | Ein App-Rahmen über 100dvh mit eigenen Scrollbereichen; das schmale Layout greift auch bei kleiner Rahmenhöhe. Speichern läuft über Klick und `fetch` statt Formular, Originale öffnen in der App. Geprüft in einem 515×603-Rahmen mit `sandbox="allow-scripts allow-same-origin"` auf der Seite des Variantenraums. |

Was von der **Einbettung** kommt und hier nicht lösbar ist: Höhe und Breite des Rahmens legt der Variantenraum fest (`clamp(420px,67vh,1000px)`), dazu der weiße Hintergrund und die Hinweiszeile darunter. Die App passt sich an. Den Rahmen selbst ändere ich nicht, weil der Raum nicht meine Datei ist.

## Fugenarten und ihre Herkunft

Die Fugenart ist eine **redaktionelle Lesart dieser Fassung** über den unveränderten Originalkanten (Label, Detail, Grenze und Quellen bleiben erhalten). Jede Fuge nennt, woraus ihre Art gelesen wurde (Originaltyp oder Originalbezeichnung). Die Zuordnungsregeln stehen in `scripts/build-content.mjs`; Prüfsummen der Originaldateien stehen in `data-readonly/herkunft.json`.

| Fugenart | Form/Verhalten | gelesen aus | Ideenherkunft |
| --- | --- | --- | --- |
| Annäherung | zwei Bögen, die sich treffen | `benannte_naehe`, `co_mentioned_with`, „begrifflich benachbart“, „assoziiert“ | Vault-Linktyp `benannte_naehe`; Brücke in WiRKGEFÜGE |
| Abstand | Doppellinie mit Lücke und Querstrichen | `nicht_dasselbe`, `verwechselbar_mit`, „muss unterschieden werden“ | Hermes „zu unterscheiden“ |
| Spannung | Zickzack, zittert | `gegenteil_am_start`, „Gegenpol“ | Reibung (`friction`) in DAS DAZWISCHEN, Zusammenführung (unversioniert) |
| Widerspruch | Linien, die frontal mit Zähnen aufeinandertreffen | `gegenbeispiel`, Originalstatus „Gegenbefund“ | Einwand in Grok „Fugenfassung“ 0.2 |
| Bedingung | Tor/Schwelle | `voraussetzung`, `fundierung` | Grok (Bedingung ≠ Ursache ≠ Erlaubnis), WiRKGEFÜGE, Cursor |
| Zeitliche Folge | Trittsteine, schreitet | `abstammung`, „zeitversetzt“ (Phase gilt als Einordnung) | WiRKGEFÜGE `zeit`, Grok „drei Zeiten“, Cursor |
| Gerichteter Übergang | Bogen mit ruhenden Winkeln (keine Bewegung, die Wirkung nahelegt) | `reguliert`, `zielzustand`, `behandlt` | Cursor-Phänomenkörper „gerichtete Veränderung“ |
| Gegenseitigkeit | Doppellinie, beide Richtungen | gerichtete Art in beiden Richtungen mit derselben Art im Bestand | Grok/WiRKGEFÜGE: zwei Aussagen, nie automatisch |
| Belegte Einzelaussage | Linie mit Belegraute | Kante mit Quelle und inhaltlicher Aussage (z. B. „kann … verringern“) | Stützung in Grok „Fugenfassung“ 0.2 |
| Statistischer Zusammenhang | weiche Welle, ohne Richtung | „assoziiert“, „verbunden mit erhöhtem Risiko“, „sagt … voraus“ | Unterscheidung Stützung/Folgerung in Grok 0.2 |
| Begrenzung | Linie endet an einer Schranke | „legt … nicht vollständig fest“ | Geltungsachse und „folgt nicht“ in Grok 0.2 |
| Offenes Dazwischen | keine Linie, schraffierte Linse | „Forschungsfrage“, `investigated_in_context_of` | „ungeklärt“ und Leerwerte in Grok und „Fuge der Relationen“ 0.2 |
| Unterbrechung | Linie mit Bruchstelle | nur eigene Arbeit | Bruch/gekittete Bruchstelle in DAS DAZWISCHEN |
| Nichtverbindung | Arme enden bei 30 %, Kreuz | nur eigene Arbeit | WiRKGEFÜGE (Arme enden bei 45 %) |
| Einordnung | leiser Strich | alle übrigen Originalkanten | Originalbestand |

Die **Herkunft** einer Verbindung ist getrennt von ihrer Art und als Strichart sichtbar: mit Quelle, aus dem Originalbestand, redaktionell vorgeschlagen (nicht fachlich geprüft; auch alle Kanten mit Originalstatus „vorgeschlagen“), offen, persönlich, künstlerisch. Geltungsgrenzen (`limit` oder `boundary`), Erläuterungen, offene Fragen und „ausdrücklich keine Ursache“ werden aus dem Bestand übernommen. Eine fehlende Grenzangabe erscheint als „im Bestand nicht angegeben“, nie als „keine Grenze“.

Die **sechs Lesebewegungen** der Fugenstation (neben, gegen, durch, fehlt, kippt, takt) stammen aus dem ChatGPT-Entwurf „FUGE“ (Juli 2026; Vault-Beleg `MiNDSOURCE/inbox/capture-2026-07-13-T010938-chatgpt-datei-geladen-pr_fen.md`, Datei `FUGE-Neustart/FUGE.html` auf Samsung_X5, Bytegleichheit nicht belegt). Codex hat sie in „FUGEN“ als Leseweisen übernommen. Hier ordnen sie die beiden Beteiligten räumlich neu; sie sind Leseweisen, keine Daten.

Die **Station mit Armen** für eigene Fugen mit mehreren Beteiligten stammt aus WiRKGEFÜGE (`public/fugen.js`). Rollen an der Beteiligung statt am Ort, Richtung je Beteiligung (geht aus / kommt an / beides / nicht angegeben) und Verlauf mit vorheriger Fassung: Grok `src/lib/fuge/model.ts`, WiRKGEFÜGE `fugen-actions.js`, Cursor `phenomenon-body.ts` (Ausgangs-/Eingangsrolle).

## Verwendete Bestände

- **Inhalt**: `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-atlas/dist/atlas-collection.json` (1226 Einträge, 1831 Relationen, 606 Quellenangaben), dazu `atlas-media.json` und `atlas-editorial.json`. Die redaktionelle Korrektur wird nach dem Laden angewendet, und der ursprüngliche Wortlaut bleibt im Leseraum sichtbar. Nur gelesen, nicht verändert.
- **Vollständige Originale**: 11 Kapitel des Wissensfundus `phaenomenatlas-sites-20261022/atlas-source/wissensfundus/neurodiversitaet-genetik-umwelt-20261027/*.md`, unverändert gesetzt. Das zwölfte Kapitel (Luftschadstoffe) hat im Bestand keinen eigenen Eintrag und bleibt hier unerreichbar.
- **Werke von Walter Andreas Kirchner**: 18 Werke, jeweils an den Orten, denen der Bestand sie zuordnet. Das Bild wird ganz gezeigt, ohne Text darüber. Die Bildunterschrift nennt die Herkunft ohne Maßangabe, mit Link zur Künstlerseite und dem Hinweis „Bildzuordnung als Anregung; keine Deutung des Werks“. Es gibt keine Galerie und keine Bildfragen. Ausgeliefert werden die Dateien lesend aus dem kanonischen Ordner, ohne Kopie.
- **Audio und Video**: Die vorhandenen Aufnahmen hängen im Bestand an keinem Ort. Sie sind deshalb **redaktionell über ihr Thema** dem passenden Gebiet zugeordnet und als solche gekennzeichnet. Es gibt einen gemeinsamen Spieler: Er startet nicht von selbst, lässt sich minimieren, spielt bei Navigation weiter und hat einen Rückweg. Die Prüfangabe des Bestands (KI-generiert, Grenzen) steht im Spieler. Externe VA-Videos sind als externe Quelle gekennzeichnet.
- **Recherche dieser Sitzung**: `evidence/recherche-20261103/` (nicht im Git). Darin: Inhalt, Codex-FUGEN und Variantenraum, ChatGPT/Grok-FUGE, WiRKGEFÜGE und DAS DAZWISCHEN, Fassungen (Kimi, Cursor, Antigravity, Hermes, Lesewege), Auftrag, Referenzen und eine Vollständigkeitskritik. Jeder Bericht trennt Zählung, geprüfte Passage und vollständig Gelesenes.

### Nicht übernommen, mit Grund

- **Kimi**: Das Original (16 Commits bis `a54593e`) ist nur als nicht lauffähige Lesereferenz gesichert. Übernommen ist nur ein Gedanke: Verstehen öffnet Nachbarn, hier als Fugenstern statt Nebel. Die Kimi-`insight`-Zeilen enthalten unbelegte Wirkbehauptungen und wurden nicht übernommen.
- **Cursor-Wasserkörper**: Übernommen ist nur das Prinzip „Bewegung ändert nie die gespeicherte Ordnung“. Die Wasseroptik hat Ralf verworfen.
- **Codex FUGEN**: Die 28 erfundenen Lernsituationen sind nicht übernommen. Die Lesebewegungen sind übernommen, mit Zuordnung.
- **Companion und Anbieteraufrufe**: nicht eingebaut. Es gibt keine Übermittlung an Dienste außerhalb dieses Rechners.

### Inventar-Ergänzung (Funde dieser Sitzung)

- Auf Samsung_X5 liegen weitere FUGE-Dateien, die gefunden, aber nicht gelesen wurden: `INSTRUMENT-PRUEFFUGE-FELD-v1.html`, `INSTRUMENT-PRUEFFUGE-GOLDEN-PATH-v1.html` (je zwei Vault-Kopien unter `ADHSOS_Core/proposals/`), `fuge-gefuege-hypothese.md`, `fuge-gefuege-aenderung.md`.
- DAS DAZWISCHEN, Stufe C (`dazwischen-wirkgefuege`), ist nach Git **älter** als die Zusammenführung B (Seitenzweig `203a3cc` vom 25. Oktober), nicht später. Die Fugenarten von B (`relationJoints.ts`) sind unversioniert.
- Weitere Prüfkopie: `/Volumes/ThunderBolt4_2TB/Development/Projects/dazwischen-kimi-review-20261026/`.
- Im Repository `neuroatlas` liegt fremde unversionierte Arbeit („Dieselbe Nähe“, `NaeheStage.tsx`). Sie wurde nicht angefasst.

## Referenzen

Ein Unteragent dieser Sitzung hat alle acht Seiten im eingebauten Browser bedient (Viewport 1024×768). Den Bericht mit Bedienschritten enthält `evidence/recherche-20261103/referenzen.md`. Übertragen wurden Prinzipien, keine Identität:

- **OneZoom**: Die Suche führt als sichtbarer Flug zu einer festen Ankunft (in der Prüfung bestätigt: Blatt „Mensch“). Der Zustand steht in der Adresse, Zurück fliegt zurück, und ein Flug lässt sich überspringen. Hier: Flug mit Herauszoomen bei weiten Wegen, Knopf „Flug überspringen“, Hash-Adressen, Browser-Zurück.
- **Of the Oak (Arten)**: Kategorien sind Regionen desselben Körpers, und eine Auswahl ist eine Kamerabewegung mit Detail am Ort. Hier: Gebiete als Inseln eines Archipels, Auswahl als Flug.
- **11 Tanjung**: Blätter gleiten übereinander, und ein Original öffnet sich im Raum. Hier: Blatt über der Karte, Leseraum als weit aufgezogenes Blatt mit sichtbarer Karte.
- **AtlasMotion**: Ein Ganzes lässt sich in benannte Teile zerlegen und wieder zusammensetzen. Hier: Lesebewegungen ordnen die Station neu und kehren zurück.
- **Lusion**: Größenwechsel laufen fließend, Licht reagiert auf den Zeiger. Hier: Das Licht des Geländes folgt dem Zeiger, die Energie in der Hand leuchtet.
- **Innovate, EverSwap, Of the Oak (Meditationen)**: Eine feste Spur zeigt, wo man ist. Hier: Pfad oben und Abschnittsleiste im Leseraum.
- **Gegenbeispiele, bewusst vermieden**: dunkler Text auf dunklem Grund, Text über unruhigem Bild, Overlay ohne sichtbares Schließen, Ladezeiten von 15 bis 35 Sekunden, verlorene Scrollposition.
- **Offene Grenzen der Sichtung**: nur 1024×768, kein Mobilbild der Referenzen, Audio nicht gehört. Lusion- und 11-Tanjung-Übergänge waren sehr langsam (10 bis 14 Sekunden). Ein Teil der Zeiten kann am Hintergrundbetrieb des Browserfensters liegen.

## Technik

- Gelände in **WebGL2** mit eigenem Shader: Höhe aus der Dichte der Einträge, unregelmäßige Küsten durch Rauschen, Höhenlinien, Papierkorn, Licht am Zeiger, Fokus und Energie. Bei Ausfall übernimmt ein **Canvas-Gelände** aus demselben Feld. Auch ein Kontextverlust zur Laufzeit wird abgefangen.
- Karte (Orte, Fugen, Beschriftungen mit Kollisionsvermeidung) auf Canvas 2D. Dieselbe Pfadgeometrie zeichnet die Fugen auf der Karte (Path2D) und in Stern und Station (SVG).
- DOM für alle Inhalte und Bedienelemente: Tastatur, Fokus und Screenreader-Namen.
- Keine Fremdbibliothek im Frontend. three.js wurde erwogen und wieder entfernt, weil das Gelände ein einzelner Shader ist.
- Server ohne Abhängigkeiten. Er lauscht nur auf Loopback, prüft Host und Herkunft und setzt `frame-ancestors` für den Variantenraum.

## Speicher und Schutz

- Persönliche Arbeit liegt in `private-data/werkstatt.json` (Format `fugenland-werkstatt` v1, Rechte 0600, nicht im Git) mit Sicherung des vorherigen Stands.
- Vor jedem Speichern prüft der Dienst das Volume (UUID A03B10FD-…, Mountpoint, Dateisystem). Fehlt es, antwortet er mit 503 und schreibt nichts; ohne Volume startet er nicht. `scripts/external-storage.mjs` ist ausführbar (`node scripts/external-storage.mjs <pfad>`). Getestet: ein externes Ziel wird angenommen, `/tmp` wird mit Exit 2 abgelehnt.
- Import des bisherigen Atlasformats `mein-atlasblick.json` (`schemaVersion 1`): Die Originaldatei wird unverändert mitgesichert (`uebernommen`), Notizen und Graphen werden zusätzlich lesbar übernommen. Der Export enthält alles, die Übernahme ist also verlustfrei überprüfbar. **Mit echten Altdaten nicht geprüft**: In dieser Sitzung lag keine solche Datei vor.
- Prüfungen laufen in einem eigenen Dienst mit eigenem Datenordner (`.cache/pruefdaten`). Persönliche Daten bleiben unberührt.

## Prüfung

`scripts/pruefung.mjs` (Playwright-Core, Chromium for Testing, Profil, Temp-Dateien und Bilder auf dem externen Volume). Ergebnis im Protokoll `evidence/pruefung-20261103/protokoll.json`: **46 von 46 bestanden** (nach der Gegenprüfung erneut ausgeführt). Zusätzlich ist die Fassung im echten Variantenraum neben Codex geöffnet: Bilder `50-variantenraum-beide.png`, `51-variantenraum-ort.png` und `52-variantenraum-original.png`; dort reicht das Original bis zum Ende und bleibt innerhalb der Rahmenbreite. Geprüft wurden:

- **Desktop 1440×900**: Einstieg mit WebGL, Ziehen und Zoomen, Gebiet, Ort, Fugenstern, Fuge (Spannung), alle Lesebewegungen, Vergleich, Rückweg über den Pfad, Original vollständig bis zum Ende, Zurück, Browser-Zurück, Fundus-Kapitel mit sieben Abschnitten, Werk des Vaters, Aufnahme spielt und läuft bei Navigation weiter.
- **Tragen und Kombination**: Energie tragen, zweiten Ort bewusst einfangen, gemeinsame Nachbarn, Lösen.
- **Eigene Arbeit**: eigene Fuge mit drei Beteiligten anlegen, Kontrast messen, Datei prüfen, nach Neuladen wieder öffnen, bearbeiten mit Verlauf, löschen, rückgängig machen, endgültig löschen; Notiz am Ort, nach Neuladen am selben Ort.
- **Perspektivwechsel** bewahrt Kamera und Auswahl.
- **Tastatur**: Pfeil zum Nachbarort, Escape eine Ebene zurück, sichtbarer Fokus.
- **Netz und Fehler**: keine Anfragen an fremde Dienste, keine Skriptfehler.
- **Schmal 390×844 mit Berührung**: Blatt von unten, Original ohne waagerechtes Abschneiden.
- **Ohne WebGL mit reduzierter Bewegung**: Canvas-Gelände, kein Flug.
- **Eingebettet** (515×603, Sandbox wie im Raum): Laden, Speichern, Original scrollbar.

Die Bilder liegen in `evidence/pruefung-20261103/bilder/`. Die Bewegungsaufnahmen `evidence/pruefung-20261103/video/gesamtweg-desktop.mp4` (64 s) und `gesamtweg-schmal.mp4` (13 s) sind echte Bildschirmbilder per Chrome-Screencast, mit ffmpeg zusammengesetzt.

## Ausdrücklich offen

- **Menschliche gestalterische Abnahme**: offen. Technische Prüfung und Screenshots sind kein gestalterisches Urteil.
- **Werkverbindungen** zu TiSCH, Companion, Hermes, NotebookLM, GANZ SEiN, KiNFORMER oder Unreal: **nicht hergestellt**.
- **Wahrscheinlichkeitsbereiche**: nicht vorhanden. Die Fugenart ist keine Stärke und keine Wahrscheinlichkeit.
- **Fachliche Prüfung der Fugenart-Zuordnung**: offen. Die Regeln sind redaktionell, und Verbindungen mit Originaltyp `behandlt` erscheinen als „Gerichteter Übergang“ mit dem Hinweis, dass dies kein Wirksamkeitsnachweis ist.
- **Altdaten-Import**: ohne echte Datei ungeprüft.
- **Screenreader**: nur über Namen und Rollen im Barrierebaum geprüft, nicht mit VoiceOver.
- **Echte Telefone**: nicht geprüft, nur Emulation.
- **Lichtwirkung des WebGL-Geländes**: im Headless-Browser gerendert; auf echter Hardware gesehen nur im eingebauten Browserfenster.

## Unabhängige Gegenprüfung (drei Prüfer, 3. November)

Drei unabhängige Prüfer haben vor der Registrierung gegengelesen: Gestaltung gegen die Ablehnungsbilder, Code und Sicherheit, fachliche Ehrlichkeit und Herkunft. Behoben ist Folgendes:

- **Fachlich**: Statistische Zusammenhänge erschienen als Annäherung, belegte Studienaussagen als Einordnung, „Phase“ als Abfolge und Gegenbefunde als Einordnung. 98 Geltungsgrenzen fehlten, weil das Feld `boundary` nicht übernommen wurde. Offene Fragen mit Quelle trugen den Hinweis „nicht geklärt“ statt „gemeinsam untersucht“. Gegenseitigkeit wurde auch bei verschiedenen Arten vergeben. Die Behandlungsbezüge waren animiert, als würden sie wirken. Redaktionelle Vorschläge hießen „Nachbarschaft“.
- **Werke des Vaters**: Bei 13 Werken standen Maßangaben in der Bildunterschrift, bei neun davon mit „Maßangabe der Quelle“. Unter dem Bild stand ein Metakommentar. Die Bildunterschrift wird jetzt aus Feldern gebaut, und der Build bricht ab, sobald eine Maßangabe auftaucht.
- **Medien**: Die Prüfangabe erschien als „[object Object]“. Die Kennzeichnung als KI-Erzeugnis bleibt sichtbar.
- **Oberfläche**: Die Lesebewegungen haben jetzt eigenen Inhalt (beide Texte nebeneinander, gemeinsame Nachbarn als dritte Stimme, Bruchstelle aus der Grenze, gemeinsame Fugenarten). Die Fugensätze sind grammatisch. Gleichnamige Orte tragen einen Unterscheider. Im Fugenstern erscheint jeder Nachbar einmal, mit Zeilenumbruch statt Abschneiden. Kastenraster wurden zum Randvermerk. Rohtypen und Dateipfade liegen in den geschlossenen technischen Details. Die Karussells sind ein Raster. Die Werkbank ist kompakt. Meldungen verschwinden beim Wechsel. Beschriftungen weichen aus oder entfallen. Der Überblick lässt Platz für die Einstiegskarte. Programmatischer Fokus erzeugt keinen Rahmen mehr.
- **Sicherheit und Speicher**:
  - Ein kaputter Range-Header ließ den Dienst abstürzen; jetzt antwortet er mit 416.
  - Nach einem gescheiterten Laden konnte ein Speichervorgang alles überschreiben; jetzt ist Speichern dann gesperrt, und ein unlesbarer Speicher wird mit 503 angehalten.
  - Gleichzeitiges Speichern ist serialisiert und hat eindeutige Temp-Dateien. Ein veralteter Stand wird mit 409 abgewiesen.
  - Ein unmaskiertes Feld aus Importen ist jetzt maskiert; Importe werden feldweise neu aufgebaut, und der Server validiert.
  - Die CSP ist vollständig, `diskutil` hat ein Zeitlimit, Links aus Daten müssen `http(s)` sein.
  - Gelöscht wird erst nach erfolgreichem Speichern; Rückgängig sucht den Eintrag über seine Kennung.
  - Ein nicht gespeicherter Werkbank-Entwurf bleibt beim Verlassen erhalten. Escape gilt nicht in Auswahlfeldern.
  - Die Ortssuche in der Werkbank ist als Combobox bedienbar.
  - Gezeichnet wird nur bei Bewegung, mit höchstens etwa 30 Bildern pro Sekunde.

Nicht behoben und weiter offen:

- Lange Originale bleiben lange gesetzte Texte, mit Abschnittsleiste, Lagebild und Ortsverweisen, aber ohne zusätzliche visuelle Anker zwischen den Absätzen.
- Auf schmalen Bildschirmen deckt das weit aufgezogene Leseblatt die Karte fast ganz ab.
- Gleichnamige Orte werden unterschieden, nicht zusammengeführt.
- Die Station mit Armen bleibt bei wenigen Beteiligten grafisch schlicht.
