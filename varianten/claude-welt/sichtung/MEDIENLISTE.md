# Medienliste · Variante „Lebende Welt“

Stand 06.11.2026. Nur gelesen, nichts im Projekt verändert. Ziel-Volume geprüft (UUID A03B10FD-5F22-4366-A71C-2D95AC701BD2).

Abkürzungen für Pfade:
- `P` = `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103`
- `M` = `P/app/atlas/assets/media/`
- `AM` = `P/app/atlas/atlas-media.json` (Zeilenangaben = Zeile des `"id"` bzw. `"file"`)
- `MJ` = `P/data-readonly/medien.json`. Die Datei ist einzeilig, deshalb wird mit Array-Index `[n]` zitiert.
- `SEL` = `P/app/atlas/atlas-selection.mjs` (Gebietszuordnung `mediaPlacements`, Zeilen 4–45)
- Ortsangaben: `#Index` in `P/data-readonly/karte.json` → `orte[Index]`. Abgeglichen: Die Indizes in `MJ.eintraege` und die String-IDs in `AM.relatedEntryIds` meinen dieselben Orte. `atlas-collection.json` `entries[i].title` stimmt für alle 1226 Orte mit `karte.orte[i].t` überein (0 Abweichungen).

Methode:
- Pixelmaß mit `sips`, Dauer mit `ffprobe`. Fundstellen mit `grep` über `P/app` (ohne `media/`).
- Drei kanonische URLs per `curl -sI` geprüft (nur HEAD).
- Angesehen habe ich: die drei nicht registrierten Dateien und einen Kontaktbogen aller Bilder samt je einem Videostandbild bei 0:20. Keine OCR, keine Hör- oder Vollsichtung.
- Werke von Walter Andreas Kirchner werden nur benannt.

Kontaktbögen:
- `bilder/medien-werke-wak.png`: 18 Werke WAK, nur Dateiname
- `bilder/medien-uebrige-und-videos.png`: übrige 13 Bilder/PNG und 4 Videostandbilder

---

## 1 · Bestand in Zahlen

| Art | Anzahl | Davon |
|---|---|---|
| jpg | 28 | 18 Werke WAK · 3 TraumaAtlas-Bilder · 2 „atlas-*“-Bilder · 5 Poster (adhs-dyskalkulie, dyskalkulie-video-poster, neurodivergenz-video-poster, va-cpt-poster, va-pe-poster) |
| png | 3 | trauma-infografik, trauma-mindmap, trauma-audio-waveform (alle mit Alphakanal) |
| mp4 | 4 | trauma-video, neurodivergenz-video, dyskalkulie-bewaeltigen, adhs-dyskalkulie |
| m4a | 2 | trauma-sicherheit-behandlung, warum-schlaue-kinder-an-zahlen-scheitern |
| vtt | 5 | trauma-sicherheit-behandlung, trauma-video, neurodivergenz-video (alle deutsch) · va-cpt-en, va-pe-en (englisch) |

Das sind 42 Dateien. Als Medien-Einheiten zählen sie so:
- `MJ` und `AM` führen je 31 Einheiten in gleicher Reihenfolge: 13 Fach- bzw. KI-Medien und 18 Werke.
- Zwei Einheiten sind Videos ohne lokale MP4: **va-cpt** und **va-pe** (U.S. VA). Sie liegen extern unter `https://www.media.eo.va.gov/ptsd/mp4/Whiteboard_CPT.mp4` bzw. `…_PE.mp4`. Lokal liegen nur Poster und Untertitel.
- **Nicht registriert** in `MJ` und `AM` sind 3 Dateien: `atlas-wegweiser.jpg`, `atlas-verarbeitung.jpg` und `trauma-audio-waveform.png`.

## 2 · Kanonische URL und HEAD-Stichprobe

Muster: `https://borderline-verstehen-atlas-production.up.railway.app/assets/media/<datei>`

| Datei | HTTP | content-type | content-length | lokal (Bytes) |
|---|---|---|---|---|
| walter-andreas-kirchner-konflikt-2010.jpg | 200 | image/jpeg | 131641 | 131641 |
| trauma-sicherheit-behandlung.m4a | 200 | audio/mp4 | 3622492 | 3622492 |
| neurodivergenz-video.mp4 | 200 | video/mp4 | 6852863 | 6852863 |

Alle drei Antworten tragen `accept-ranges: bytes`, damit sind Sprünge in Audio und Video möglich.

Server der Gesamt-App (`P/app/server.mjs:24,32`): Fehlt eine `/assets/media/…`-Datei lokal, leitet er per 302 auf diese Quelle um.

Offen: `MJ` verwendet Pfade der Form `/medien/atlas/<datei>`. Diesen Pfad bedient `P/app/server.mjs` nicht (kein Treffer für `medien/atlas`). Für die Welt die kanonische URL bzw. `/assets/media/` nehmen.

## 3 · Wie der bestehende Atlas Medien verwendet

Diese Stellen gelten für alle Einträge aus `AM`:

- **Laden:**
  - `P/app/atlas/shared-atlas.mjs:454` lädt `./atlas-media.json` per fetch.
- **Mediathek:**
  - `shared-atlas.mjs:292` filtert `!item.originWork`. Werke WAK und die 3 TraumaAtlas-Bilder erscheinen dort also **nicht**.
  - Gebietsfilter: `SEL:47,59-61` (`placementsFor`, `mediaMatches`).
  - Darstellung als Kachel: `shared-atlas.mjs:285`.
- **Player:**
  - `P/app/atlas/notebook-context.mjs:151` (`<audio>`) und `:152` (`<video poster track>`).
  - Medienvorschau: `P/app/atlas/notebook-library.mjs:43-48`.
  - Medium in der Landschaft: `P/app/atlas/knowledge-landscape.mjs:136` (`mediumHTML`).
- **Ortsbezug, nur ausdrücklich redaktionell:**
  - `P/app/atlas/atlas-media-associations.mjs:2-11` (`explicitlyRelatedMedia`). Laut Kommentar erzeugen gemeinsame Wörter oder Tags **nie** eine Zuordnung.
  - Benutzt in `shared-atlas.mjs:288`, `atlas-rooms.mjs:48` und `atlas-network-space.mjs:267`.
- **Medien als Kanten in der Wissenslandschaft:**
  - `shared-atlas.mjs:163` mit `mediaEditorialRelations` (`SEL:49-57`), Ziel `landscape-medium-<id>`.
- **Toter Verweis:**
  - `P/app/atlas/atlas-rooms.mjs:13` exportiert `roomImages` mit acht Bildpfaden.
  - `grep` findet keinen Import dieser Liste. Die Bilder darin werden darüber also nicht angezeigt.
- **Außerhalb dieses Ordners, nur zur Kenntnis:**
  - `P/app/atlas/relationship-scene.mjs:122` verweist auf `/media/trauma-exercises/sos-orientieren.mp4` samt Poster. Das liegt nicht in `assets/media`. Offen, ob es existiert.
  - `SEL:18-26` nennt außerdem externe Medien ohne Datei im Ordner: drei YouTube-Videos der Stiftung Gesundheitswissen (`atlas-supplement.json` `germanMedia`), dazu awmf, lmu, at-adult-adhd, bavaria-autism, tirol und konstanz.

---

## 4 · Klang- und Bewegtmedien (Kandidaten für Klangquellen)

Spaltenlegende: **Ort laut Bestand** meint die Ortsebene (`#Index`); **Gebiet(e) laut Bestand** sind die Regionen aus `SEL`.

| Datei | Titel (Bestand) | Urheber | Format · Dauer | KI | Untertitel / Poster | Ort laut Bestand | Gebiet(e) laut Bestand | Verwendung im Atlas |
|---|---|---|---|---|---|---|---|---|
| trauma-sicherheit-behandlung.m4a | Trauma, Sicherheit und Behandlung | NotebookLM · KI-Audioübersicht aus einer von Codex kuratierten Lehrgrundlage | AAC · 1:52 (112,0 s) | **ja** (`MJ[0].ki`) | `trauma-sicherheit-behandlung.vtt` (de, 32 Cues) · kein Poster; Wellenbild `trauma-audio-waveform.png` per Sonderfall | **keiner** (`MJ[0].eintraege=[]`) | TraumaAtlas, Diagnose & Differenzierung, Forschung & Einordnung (`SEL:2,8`) | `AM:3` (Datei `:7`, vtt `:20`) · `SEL:8` · `notebook-library.mjs:47` |
| trauma-video.mp4 | Trauma verstehen · eine kurze NotebookLM-Übersicht | NotebookLM · KI-Ausgabe aus redaktionell geprüften Grundlagen | H.264 720×1280 (hochkant) · 1:30 (89,8 s) | **ja**; Prüfung im Bestand: vier Standbilder mit unlesbarer KI-Pseudoschrift (`MJ[4].pruefung`) | `trauma-video.vtt` (de, 21 Cues) · kein Poster | keiner | wie oben (`SEL:12`, Schlüssel ist der Dateipfad) | `AM:235/238` · `SEL:12` · `atlas-supplement.json:8152` (Produktionsbericht) |
| neurodivergenz-video.mp4 | Überlastung verstehen · ADHS, Autismus und Traumafolgen | NotebookLM · KI-Videoübersicht | H.264 720×1280 · 1:44 (104,2 s) | **ja** | `neurodivergenz-video.vtt` (de, 22 Cues) · Poster `neurodivergenz-video-poster.jpg` (720×1280) | keiner | Neuroatlas, ADHS · Randphänomene, Diagnose & Differenzierung, Phänomenatlas (`SEL:3,14`) | `AM:317` (`:321-323`) · `SEL:14` · `atlas-supplement.json:8152` |
| dyskalkulie-bewaeltigen.mp4 | Dyskalkulie bewältigen · NotebookLM-Erklärvideo | NotebookLM · Export aus Notebook „Calcularis …“ | H.264 1280×720 · 9:03 (542,6 s) | **ja** | keine Untertitel · Poster `dyskalkulie-video-poster.jpg` (800×450) | keiner | Neuroatlas, Phänomenatlas (`SEL:15`) | `AM:528` (`:532,590,597`) |
| adhs-dyskalkulie.mp4 | ADHS & Dyskalkulie · NotebookLM-Erklärvideo | NotebookLM · Export aus „Calcularis …“ | H.264 1280×720 · 8:05 (484,9 s) | **ja**; Inhalt laut Bestand **ungeprüft** | keine Untertitel · Poster `adhs-dyskalkulie.jpg` (1280×720) | keiner | Neuroatlas, ADHS · Randphänomene, Phänomenatlas (`SEL:16`) | `AM:600` (`:604,661`) |
| warum-schlaue-kinder-an-zahlen-scheitern.m4a | Warum schlaue Kinder an Zahlen scheitern · NotebookLM-Audio | NotebookLM · Export aus „Calcularis …“ | AAC · 27:15 (1635,1 s) | **ja**; Inhalt laut Bestand **ungeprüft** | keine Untertitel, kein Poster | keiner | Neuroatlas, Phänomenatlas (`SEL:17`) | `AM:664` (`:668`) |
| *(extern)* Whiteboard_CPT.mp4 | Cognitive Processing Therapy: Gedanken nach einem Trauma prüfen | U.S. Department of Veterans Affairs · National Center for PTSD | MP4 extern, Dauer **offen** (nicht geprobt) | nein | `va-cpt-en.vtt` (en, 58 Cues) · `va-cpt-poster.jpg` (720×480) | keiner. Die Quelle `verified:va-cpt-video` steht in `atlas-collection.json:100452`, wird aber von **keinem** Ort zitiert. | Trauma-Gruppe (`SEL:9`) | `AM:105` (`:110,112,136`) · `SEL:9` · `notebook-library.mjs:77` (bevorzugtes Video der Mediathek-Startseite) |
| *(extern)* Whiteboard_PE.mp4 | Prolonged Exposure: Sich Erinnerungen und sicheren Situationen annähern | U.S. VA · National Center for PTSD | MP4 extern, Dauer offen | nein | `va-pe-en.vtt` (en, 57 Cues) · `va-pe-poster.jpg` (720×480) | keiner. Quelle `verified:va-pe-video` (`atlas-collection.json:100486`) wird von keinem Ort zitiert. | Trauma-Gruppe (`SEL:10`) | `AM:154` (`:159,161,185`) · `SEL:10` |

Hinweise aus dem Bestand:
- `va-pe` trägt den Satz, das Video sei „keine Anleitung zur eigenständigen Traumaexposition“ (`MJ[2].zusammenfassung`). Dieser Satz muss am Ort mitgeführt werden.
- Bei `va-pe` sind Bild, Ton und Synchronität im Browser laut `MJ[2].pruefung` „noch nicht geprüft“.

## 5 · Infografiken und Gebrauchsgrafik

| Datei | Titel | Urheber | Maß | KI | Ort | Gebiet(e) | Verwendung |
|---|---|---|---|---|---|---|---|
| trauma-infografik.png | Trauma verstehen · Differenzierung, Schutz und Evidenz | NotebookLM | 2752×1536 | ja | keiner | Trauma-Gruppe (`SEL:13`) | `AM:280` (`:284`) |
| trauma-mindmap.png | Trauma-Mindmap · Unterschiede, Schutz und Handlungsspielraum | NotebookLM · KI-Ausgabe | 5568×4585, dunkler Grund (gesehen) | ja | keiner | Trauma-Gruppe (`SEL:11`) | `AM:216` · `SEL:11` · `atlas-supplement.json:829` (`mindmapTree`, Bildverweis `:948` mit `sourceIds` who-icd11-2024, nice-ng116, van-vliet-2021-rct, bohus-2020-rct) |
| trauma-audio-waveform.png | *(kein Titel)*: Wellenbild, gesehen; lachsfarbene Hüllkurve auf transparentem Grund | **nicht belegt** | 1000×220, Alpha | offen | – | – | nur `notebook-library.mjs:47`: Vorschaubild, wenn das Audio `notebook-trauma-audio` gezeigt wird. **Nicht in MJ/AM.** |

## 6 · Bilder ohne Werkstatus

| Datei | Titel | Urheber/Herkunft laut Bestand | Maß | KI | Ort | Gebiet(e) | Verwendung |
|---|---|---|---|---|---|---|---|
| traumaatlas-mensch-und-verbindungen.jpg | Mensch und Verbindungen | „Bild aus dem bestehenden TraumaAtlas“; Herstellung und Lizenz **nicht belegt** (`MJ[7].pruefung`) | 1536×1024, dunkler Grund | `false` im Bestand. Die Herstellung ist laut Bestand aber nicht belegt, deshalb gilt KI ja/nein als **offen**. | keiner | TraumaAtlas, Beziehungswerkstatt, Beziehungen & Borderline (`SEL:5`) | `AM:455` (`:459`) · `atlas-rooms.mjs:13` (toter Export) |
| traumaatlas-kugel-in-der-welle.jpg | Kugel in einer Welle | wie oben (`MJ[8]`) | 1536×1024, dunkel | wie oben | keiner | TraumaAtlas, Trigger & Kontext (`SEL:6`) | `AM:479` (`:483`) · `atlas-rooms.mjs:13` |
| traumaatlas-lichtfluss-im-koerper.jpg | Lichtfluss im Körper | wie oben (`MJ[9]`) | 1536×1024, dunkel | wie oben | keiner | TraumaAtlas, Trigger & Kontext (`SEL:7`) | `AM:503` (`:507`) · `atlas-rooms.mjs:13` |
| atlas-wegweiser.jpg | **kein Titel im Bestand** (gesehen: nächtliche Landschaft mit Leuchtturm, Lichtpfad und leuchtendem Herzgebilde) | **nicht belegt**; keine EXIF-Angaben (sips) | 1536×1024, dunkel | **offen** | – | – | nur `atlas-rooms.mjs:13`, zweimal im toten Export. **Nicht in MJ/AM.** |
| atlas-verarbeitung.jpg | **kein Titel im Bestand** (gesehen: abstraktes Fasergeflecht grün → orange → blau) | **nicht belegt**; keine EXIF-Angaben | 1536×1024, dunkel | **offen** | – | – | nur `atlas-rooms.mjs:13` (toter Export). **Nicht in MJ/AM.** |
| *(Poster)* adhs-dyskalkulie.jpg, dyskalkulie-video-poster.jpg, neurodivergenz-video-poster.jpg, va-cpt-poster.jpg, va-pe-poster.jpg | Poster der jeweiligen Videos (siehe §4) | wie das Video | 1280×720, 800×450, 720×1280, 720×480, 720×480 | wie das Video | – | – | `AM:661, 597, 322, 136, 185` |

## 7 · Werke von Walter Andreas Kirchner (18)

Für alle 18 Werke gilt:
- Urheber: Walter Andreas Kirchner. `werk: true`, `ki: false`.
- Herkunftsangabe im Bestand: „Reproduktion von der Künstlerwebsite“.
- Alle Ortsbezüge haben den Status `redaktionelle-zuordnung`. Als Basis nennt der Bestand: „visually inspected artwork reproduction and open editorial invitation; no diagnosis or causal claim“ (`AM` editorialRelations).
- Keine Deutung meinerseits.

| Datei | Titel | Jahr | Technik (Herkunftsangabe) | Quellseite | Maß | Zugeordnete Orte (`MJ.eintraege` = `AM.relatedEntryIds`) | Gebiete laut `SEL` | Fundstelle |
|---|---|---|---|---|---|---|---|---|
| …-erfuellte-zeit-2017.jpg | Erfüllte Zeit | 2017 | Öl auf Leinwand | kunst2.html | 896×900 | #496 An der gegenwärtigen Umgebung orientieren (Neuroatlas) | Phänomenatlas, Neuroatlas (`SEL:27`) | `AM:716`, `MJ[13]` |
| …-herbstlicher-farbentaumel-2016.jpg | Herbstlicher Farbentaumel | 2016 | Öl auf Leinwand | kunst2.html | 906×900 | #270 ADHS (Neuroatlas, Kontext) · #496 (Neuroatlas) | Phänomenatlas, Neuroatlas, ADHS · Randphänomene (`SEL:28`) | `AM:756`, `MJ[14]` |
| …-ein-ganz-gewoehnlicher-tag-2008.jpg | Ein ganz gewöhnlicher Tag | 2008 | Öl auf Leinwand | kunst2.html | 899×900 | #141 ADHS (Phänomenatlas, Kapitel) · #556 Mentalisieren: die andere Innenwelt offenlassen (Dynamikraum) | Phänomenatlas, Neuroatlas, Dynamikraum, Beziehungswerkstatt, ADHS · Randphänomene (`SEL:29`) | `AM:809`, `MJ[15]` |
| …-lass-die-puppen-tanzen-2018.jpg | Lass die Puppen tanzen | 2018 | Öl auf Leinwand | kunst2.html | 600×900 | #566 Borderline verstehen, Menschen offenhalten (Beziehungswerkstatt) · #556 (Dynamikraum) | Phänomenatlas, Dynamikraum, Beziehungswerkstatt (`SEL:30`) | `AM:862`, `MJ[16]` |
| …-konflikt-2010.jpg | Konflikt | 2010 | Öl auf Hartfaser | kunst2.html | 712×900 | #1168 Wenn ein kleines Zeichen die ganze Beziehung berührt. (Trigger & Kontext) · #566 (Beziehungswerkstatt) | Phänomenatlas, Dynamikraum, Beziehungswerkstatt, **Beziehungen & Borderline**, Trigger & Kontext (`SEL:31`) | `AM:915`, `MJ[17]` |
| …-relax-2014.jpg | Relax | 2014 | Marmor | kunst10.html | 727×900 | #441 Vertrauten Körperkomfort wählen (Neuroatlas) · #188 Emotionsregulation (Phänomenatlas) | Phänomenatlas, Neuroatlas, Beziehungswerkstatt, TraumaAtlas (`SEL:32`) | `AM:969`, `MJ[18]` |
| …-schicksalswege-2016.jpg | Schicksalswege | 2016 | Marmor und Granit | kunst12.html | 900×647 | #264 Erinnerung & Verbundenheit (Neuroatlas) | Phänomenatlas (`SEL:33`) | `AM:1024`, `MJ[19]` |
| …-taenzer-2006.jpg | Tänzer | 2006 | Porzellan | kunst10.html | 724×900 | #436 Bewegung nach eigenem Maß · #443 Rhythmus oder Musik auswählen (beide Neuroatlas) | Phänomenatlas, Neuroatlas, Beziehungswerkstatt (`SEL:34`) | `AM:1066`, `MJ[20]` |
| …-nischbach-und-die-schlimmen-jahre-1999.jpg | Nischbach und die schlimmen Jahre (Nischbachhaus Ingolstadt) | 1999 | Holzrelief | kunst12.html | 900×659 | **keiner** (`relatedEntryIds: []`, `editorialRelations: []`) | Phänomenatlas (`SEL:35`) | `AM:1119`, `MJ[21]` |
| …-franz-heinz-2019.jpg | Franz Heinz | 2019 | Marmor | kunst10.html | 597×900 | #1039 Ich bin mehr als die Rolle, in der du mich siehst · #1042 Die andere Innenwelt bleibt eine Hypothese (beide **Beziehungen & Borderline**) · #264 (Neuroatlas) | Phänomenatlas, Beziehungswerkstatt (`SEL:36`) | `AM:1144`, `MJ[22]` |
| …-lennart-2010.jpg | Lennart | 2010 | Marmor | kunst10.html | 683×900 | #1039 · #1042 · #264 | wie Franz Heinz (`SEL:37`) | `AM:1212`, `MJ[23]` |
| …-jannik-2010.jpg | Jannik | 2010 | Marmor | kunst10.html | 647×900 | #1039 · #1042 · #264 | (`SEL:38`) | `AM:1280`, `MJ[24]` |
| …-franco-2015.jpg | Franco | 2015 | Marmor | kunst10.html | 698×900 | #1039 · #1042 · #264 | (`SEL:39`) | `AM:1348`, `MJ[25]` |
| …-linda-2005.jpg | Linda | 2005 | Marmor | kunst10.html | 712×900 | #1039 · #1042 · #264 | (`SEL:40`) | `AM:1416`, `MJ[26]` |
| …-evelyne-2005.jpg | Evelyne | 2005 | Marmor | kunst10.html | 562×900 | #1039 · #1042 · #264 | (`SEL:41`) | `AM:1484`, `MJ[27]` |
| …-andrea-2008.jpg | Andrea | 2008 | Marmor | kunst10.html | 664×900 | #1039 · #1042 · #264 | (`SEL:42`) | `AM:1552`, `MJ[28]` |
| …-nach-dem-bad-2009.jpg | Nach dem Bad | 2009 | Marmor | kunst10.html | 900×598 | #266 Körper & Schlaf (Neuroatlas) · #540 Kurzer Körperscan (innere Landkarte) (TraumaAtlas) | Phänomenatlas, Neuroatlas (`SEL:43`) | `AM:1620`, `MJ[29]` |
| …-dornroeschen-2010.jpg | Dornröschen | 2010 | Marmor | kunst10.html | 737×900 | #266 Körper & Schlaf · #497 Eine Pause ohne zusätzlichen Inhalt (beide Neuroatlas) | Phänomenatlas, Neuroatlas (`SEL:44`) | `AM:1674`, `MJ[30]` |

Quellseiten: `https://walter-andreas-kirchner.de/<seite>`.

Werke mit Ortsbezug werden im bestehenden Atlas so gezeigt:
- über `explicitlyRelatedMedia` am Ort (`atlas-rooms.mjs:48`, `atlas-network-space.mjs:267`, `shared-atlas.mjs:288`);
- als Landschaftskante (`shared-atlas.mjs:163`).

In der Mediathek fehlen sie (`shared-atlas.mjs:292`).

Auffälligkeiten aus den Daten:
- `SEL` ordnet die Porträts **nicht** dem Gebiet „Beziehungen & Borderline“ zu, obwohl ihre Orte #1039 und #1042 dort liegen. Die Gebietsliste in `SEL` und die Ortsbezüge widersprechen sich hier. Für die Welt gilt die Ortsebene.
- Der Ort #1168 (Konflikt) hat in `karte.json` **0 Fugen**. Er ist dort ein isolierter Ort.

---

## 8 · Bezug zum Startfall „Die Angst vor Verlust ist groß“ (#1031, Beziehungen & Borderline)

- Der Startfall #1031 hat **kein eigenes Medium**.
- Belegte Nachbarn von #1031 laut `karte.fugen`:
  - #1030 Eine Antwort bleibt aus · einordnung · 0 Quellen
  - #1032 Wenn Nähe zur Verpflichtung wird · einordnung · 0 Quellen
  - #1034 Auch meine Grenze gilt · einordnung · 0 Quellen
  - #1053 Verlassenheitsangst und Vermeidungsbemühungen (Diagnose & Differenzierung) · aussage · 2 Quellen
- Der kürzeste Weg zu einem Medienort führt über zwei Fugen: #1031 → #1032 → **#1039**, beide Schritte vom Typ einordnung, Label „Die Rolle verpflichtet nicht zu allem“. An #1039 hängen die 7 Marmorporträts.
- Der zweite Medienort im Gebiet ist #1042, belegt über #1028, #1041, #1043 sowie über #565 (aussage, 2 Quellen).
- Zwischen #1039 und #1042 gibt es **keine** direkte Fuge.

## 9 · Vorschlag: Lage in der Welt

Grundsätze:
- Nur was der Bestand zuordnet, liegt an einem Ort.
- Wo der Bestand nur Gebiete nennt (`SEL`), liegt das Medium im Gebiet, aber **ohne Ort**. Das ist ausdrücklich offen und kein Defekt.
- Wörter und Tags erzeugen keine Lage. Das folgt der Bestandsregel in `atlas-media-associations.mjs:1`.

**Lichtungen (Bilder)**

| Medium | Vorschlag | Begründung im Bestand |
|---|---|---|
| 7 Marmorporträts (Franz Heinz, Lennart, Jannik, Franco, Linda, Evelyne, Andrea) | **Eine gemeinsame Porträtlichtung in „Beziehungen & Borderline“** zwischen #1039 und #1042, mit leiser Spur zu #264 (Neuroatlas). Vom Startfall aus zwei Schritte entfernt. Das ist der Medienort für die Design-Leinwand. | Je drei identische Ortsbezüge (`AM:1144…1552`, `MJ[22–28]`) |
| Konflikt | Lichtung an #566 (Beziehungswerkstatt). Ein zweiter Lichtpunkt an #1168 (Trigger & Kontext), der dort ohne Fugen allein steht. | `AM:915`, `MJ[17]` |
| Lass die Puppen tanzen | an #566, mit Spur zu #556 (Dynamikraum) | `AM:862` |
| Ein ganz gewöhnlicher Tag | zwischen #141 (Phänomenatlas) und #556 (Dynamikraum) | `AM:809` |
| Herbstlicher Farbentaumel | an #270 ADHS (Neuroatlas), Spur zu #496 | `AM:756` |
| Erfüllte Zeit | an #496 (Neuroatlas). Liegt dort zusammen mit dem Farbentaumel. | `AM:716` |
| Relax | an #441 (Neuroatlas), Spur zu #188 (Phänomenatlas) | `AM:969` |
| Tänzer | zwischen #436 und #443 (Neuroatlas) | `AM:1066` |
| Nach dem Bad | an #266 (Neuroatlas), Spur zu #540 (TraumaAtlas) | `AM:1620` |
| Dornröschen | an #266, Spur zu #497 (Neuroatlas) | `AM:1674` |
| Schicksalswege | an #264 (Neuroatlas) | `AM:1024` |
| Nischbach und die schlimmen Jahre | **ohne Ort**. Nur Gebiet Phänomenatlas (`SEL:35`). Lage offen, Ralf entscheidet. | `AM:1119`: keine Bezüge |
| Mensch und Verbindungen | im Gebiet TraumaAtlas/Beziehungswerkstatt/Beziehungen & Borderline (`SEL:5`), **Ort offen** | keine Ortszuordnung (`MJ[7]`) |
| Kugel in einer Welle · Lichtfluss im Körper | zwischen TraumaAtlas und Trigger & Kontext (`SEL:6-7`). Die beiden Gebiete sind laut `karte.regionen[0].links` und `[8].links` miteinander verbunden. **Ort offen.** | keine Ortszuordnung |
| Trauma-Infografik · Trauma-Mindmap | Lesetafel bzw. Lichtung in der Trauma-Gruppe (`SEL:2,11,13`), **Ort offen**. Die Mindmap trägt im Bestand eigene Quellen (`atlas-supplement.json:948`); nur diese dürfen am Griff erscheinen. | keine Ortszuordnung |
| atlas-wegweiser.jpg · atlas-verarbeitung.jpg | **nicht platzieren**, solange Herkunft, Titel und KI-Status ungeklärt sind. Höchstens als Lichtgrund-Textur, wenn Ralf das freigibt. | nicht registriert |
| trauma-audio-waveform.png | nur als Gestalt der Klangquelle von `trauma-sicherheit-behandlung.m4a`, so wie im Bestand | `notebook-library.mjs:47` |

**Klangquellen (Audio/Video)**

| Medium | Vorschlag | Begründung im Bestand |
|---|---|---|
| Trauma, Sicherheit und Behandlung (m4a, 1:52, KI, de-vtt) | Klangquelle in der Trauma-Gruppe. Sie ist dort die einzige kurze, untertitelte deutsche Audioquelle, also ein guter Kandidat für den „Medienort Audio“ der Leinwand. **Ort offen.** Die KI-Kennzeichnung und die Prüfgrenzen aus `MJ[0].pruefung` gehören an die Quelle. | `SEL:8`, keine Ortszuordnung |
| Trauma verstehen (mp4 hochkant, 1:30, KI) | Trauma-Gruppe, Ort offen. Hinweis zur KI-Pseudoschrift mitführen. | `SEL:12` |
| CPT- und PE-Video (VA, extern, en-vtt) | Trauma-Gruppe, Ort offen. Bei PE den Grenzsatz aus `MJ[2]` mitführen. Englisch, deshalb im Zugangsprofil kennzeichnen. | `SEL:9-10`; die Quellen sind im Bestand von keinem Ort zitiert |
| Überlastung verstehen (mp4 hochkant, 1:44, KI) | Überlappung Neuroatlas / ADHS · Randphänomene / Diagnose & Differenzierung / Phänomenatlas, Ort offen. Es ist das einzige Medium, das `SEL` vier Gebieten zuordnet, und damit der natürliche Fall für ein Medium in einer Gebietsüberlappung. | `SEL:3,14` |
| Dyskalkulie bewältigen · ADHS & Dyskalkulie · Warum schlaue Kinder … | Neuroatlas/Phänomenatlas (+ ADHS · Randphänomene), Ort offen. Ohne Untertitel. Zwei davon sind inhaltlich **ungeprüft** (`MJ[11–12]`), also nur als gekennzeichnete, ungeprüfte Quelle führen oder vorerst zurückhalten. | `SEL:15-17` |

**Für die Design-Leinwand empfohlen:**
- Medienort Bild: die Porträtlichtung bei #1039/#1042. Sie ist echt ortsgebunden und liegt im Startgebiet.
- Medienort Klang: `trauma-sicherheit-behandlung.m4a`. Kurz, deutsch untertitelt, mit eigenem Wellenbild. Ihre Lage bleibt eine offen markierte Gebietslage.
- Ehrlich bleibt: Kein Klang- oder Bewegtmedium ist im Bestand einem Ort zugeordnet. Alle 8 Einheiten (6 lokale Dateien und 2 externe VA-Videos) haben nur Gebietsangaben.

## 10 · Offene Punkte

1. Herkunft, Titel und KI-Status von `atlas-wegweiser.jpg`, `atlas-verarbeitung.jpg` und `trauma-audio-waveform.png`.
2. Herstellung und Lizenz der drei TraumaAtlas-Bilder: laut Bestand nicht belegt.
3. Dauer und Erreichbarkeit der externen VA-MP4: nicht geprobt.
4. Inhaltsprüfung von `adhs-dyskalkulie.mp4` und `warum-schlaue-kinder-an-zahlen-scheitern.m4a`: laut Bestand ausstehend.
5. Ortslage aller Klang- und Bewegtmedien: im Bestand nur auf Gebietsebene.
6. Widerspruch zwischen `SEL` und den Ortsbezügen der Porträts: Gebiet „Beziehungen & Borderline“ fehlt in `SEL:36-42`.
7. `relationship-scene.mjs:122` verweist auf ein Medium außerhalb von `assets/media`. Ob es existiert, ist nicht geprüft.
