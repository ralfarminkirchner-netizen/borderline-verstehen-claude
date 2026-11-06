# Vorläufer A – organische Formen in archive-* und history-01 bis history-12

Sichtung für die Variante „Lebende Welt“, 06.11.2026. Alles nur gelesen.
Variantenraum: `/Volumes/ThunderBolt4_2TB/Development/Artifacts/atlas-variantenvergleich-20261103/variants/` (unten `variants/`).
Vorhandene Bilder: `/Volumes/ThunderBolt4_2TB/Development/Artifacts/fugenland-bausteine-claude-20261105/bilder/` (unten `ernte/`).
Eigene Bilder: `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-lebende-welt/varianten/claude-welt/sichtung/bilder/va-*.png`.

## So wurde gearbeitet
- Gelesen: `PROMPT-LEBENDE-WELT.md`, `ernte-historie-a.md`, Kopf von `ernte-historie-b.md`, `KOMBINATION.md`. Einen eigenen Ordner `variants/bilder` gibt es nicht. `atlas-variantenvergleich-20261103/bilder` enthält nur 14 Bilder des Variantenfelds und keine Fassungsbilder. Fassungsbilder liegen nur in `ernte/` (117 history-Bilder, keine archive-Bilder).
- Angesehen (Read auf PNG): `ernte/history-01-01, -09, -10`, `02-01, -02, -03`, `04-01, -02`, `05-01, -03`, `06-01, -02, -03`, `07-01`, `08-01, -02`, `09-02`, `10-01`, `12-02`.
- Frisch aufgenommen: 1440×900, hell, im System-Chrome über playwright-core 1.63 (headless). Im Cache `pw-browsers` liegt nur ffmpeg und kein Chromium. Statischer Node-Dienst auf 127.0.0.1:47961, `/api/*` liefert 404, externe Anfragen sind blockiert. Der Dienst ist danach über seine PID beendet worden, der Port ist wieder frei. Neun Bilder, alle geladen, keine Seitenfehler.
- Oben links steht auf allen hellen Bildern der Hinweis „Dein gespeicherter Blick konnte nicht geladen werden …“, weil `/api/personal` fehlt. Er gehört nicht zur Gestaltung.

## archive-* sind Doppelungen (selbst geprüft mit `diff -rq`)
| archive | identisch mit | Unterschied |
|---|---|---|
| archive-04 | history-13 | nur `.openai/` |
| archive-02 | history-14 | nur `.openai/` |
| archive-07 | history-15 | nur `.openai/` |
| archive-06 | history-16 | nur `.openai/` |
| archive-05 | history-17 | nur `.openai/` |
| archive-01 | history-13 | `app.mjs` und `index.html`, also nur der Startpunkt |

archive-01 startet in der dunklen **Beziehungskarte** (`va-archive-01-start.png`). Für uns zählt sie nur, weil sie den **Startfall** enthält:
- Knoten `variants/archive-01/atlas-relations.mjs:184` „Die Angst vor Verlust ist groß“, Gruppe „Nähe & Abstand“, mit Szene, Beobachtung, Lesart, Unsicherheit, Handlung und Frage.
- Drei Kanten in `:435`, `:437`, `:438`:
  - „Eine mögliche Bedeutung des Wartens“ (comparison) von „Eine Antwort bleibt aus“,
  - „Wenn Beruhigung eingefordert wird“ (tension) zu „Wenn Nähe zur Verpflichtung wird“,
  - „Bedürfnis trifft begrenzte Verfügbarkeit“ (tension) zu „eigene Grenze“.
- **Offen:** Ob diese Kanten in `data-readonly/karte.json` als belegte Fugen vorkommen, habe ich nicht geprüft. Die Variante hat einen eigenen Datenbestand.
- Organisch ist an archive-01 nichts. Die Gestalt ist dunkel, mit Knopfzeilen und Seitenpanel. Ihr Inhalt ist in `ernte-historie-a` Nr. 25 beschrieben.

## Familien der Fassungen 01–12 (Dateivergleich, md5)
- `atlas-world-renderer.mjs`: 01–04 haben gefaltete WebGL-Membranen und unterscheiden sich nur in Parametern. 05 ist ein Höhenrelief mit Fluss.
- `atlas-terrain-space.mjs`: Ab 06 ist es ein SVG-Höhenlinienfeld.
- `living-network.mjs`: Faser-Canvas, identisch in 01–08, sichtbar am Start von 08.
- `knowledge-landscape.mjs`: Punktwolken auf Canvas in 09–11.
- `atlas-space.mjs`: Beziehungskarte, identisch in 01–12.

**Grundsätzlich:** Alle Fassungen ordnen in **8 redaktionelle Themengruppen** (Bindung & Beziehung … Modelle & Forschung) ein. Die 10 Regionen der `karte.json` (TraumaAtlas, Phänomenatlas, Neuroatlas, Dynamikraum, Beziehungswerkstatt, ADHS · Randphänomene, Beziehungen & Borderline, Diagnose & Differenzierung, Trigger & Kontext, Forschung & Einordnung) kennt keine Fassung. Lage und Farben lassen sich deshalb nicht direkt übernehmen.

---

## 1 Membranen: gefaltete Gebietskörper (history-02, am stärksten)
**Bilder:** `va-history-02-landschaft.png`, `va-history-02-gebiet.png`, `ernte/history-02-01-start.png`, `ernte/history-02-02-gebiet-koerper.png`

**Was wirkt**
- Jedes Gebiet ist ein satter, eigenfarbiger Körper aus drei geschichteten Blättern mit gewelltem Rand. Er sieht aus wie ein Blatt oder eine Blüte und nicht wie ein Kreis.
- Die Größe folgt der Ortszahl.
- Feine helle Nähte und Ringlinien geben Tiefe, ohne einen Rahmen zu ziehen.
- Der Hintergrund ist hell, Dunkel auf Dunkel gibt es nicht.
- Beim Zoom ins Gebiet werden die Untergebiete zu eigenen Körpern, und die Nachbargebiete bleiben am Rand als Kontext stehen (`va-history-02-gebiet.png`). Das ist der beste Maßstabswechsel im ganzen Teil A.

**Technik:** `variants/history-02/atlas-world-renderer.mjs`
- Membranblatt `:36–63`, parametrische Fläche (u = Winkel, v = Radius):
  - Wellenrand: `scallop = 1 + .095·sin(3θ+φ) + .055·cos(5θ−φ)` (`:43`),
  - Faltung: `fold = .58·sin(3θ+turn) + .22·sin(5θ−φ)`,
  - Hub: `lift = r²(.65+fold)`,
  - drei Lagen mit leichter Verdrehung (`turn = phase + layer·.26`),
  - Gewicht aus der Ortszahl: `heft = .82 + .48·clamp(w)` (`:38`, gespeist aus `atlas-terrain-space.mjs:169` mit `weights: placeCounts/placePeak`).
- Nähte als `gl.LINES` (`:58–63`).
- Fragment-Shader `:91`:
  - Lambert-Licht mit Randlicht (`rim = (1−|n.z|)^2.2`),
  - Nebel `smoothstep(40,96,dist)` in Papierfarbe,
  - Tagmodus mit flacheren Schatten.
- Morphing Landschaft ↔ Baum über `aFrom` und `uMorph` (`:84–86`, 1800 ms nach `atlas-terrain-space.mjs:50`).
- Canvas-2D-Ersatz ohne WebGL: Dreiecke werden nach Tiefe sortiert (`:99–117`). Das ist eine gute Rückfallstufe.

**Farben**
- Gebiete, WebGL-Palette `:13` (in Hex umgerechnet):

  | Gebiet | Farbe |
  |---|---|
  | Bindung | #8ed2bd |
  | Selbst | #b7a5df |
  | Trauma | #ef967d |
  | Körper | #abcb96 |
  | Neurodivergenz | #7db5d9 |
  | Wahrnehmen | #e9c778 |
  | Schutz | #d6a57d |
  | Modelle | #bbb3e4 |

- Papier `[.961,.922,.851]` = #f5ebd9. Hintergrund am Tag `[.945,.953,.965]` = #f1f3f6.
- **Fehler, im Bild sichtbar:** Die HTML-Rauten über den Körpern nehmen eine zweite Palette aus `atlas-terrain-space.mjs:7` (`#8ed2bd,#b7a5df,#ef967d,#9bc9a3,#92c4e0,#e9c778,#c3cf8b,#d6a9bb`). Über dem braunen Schutz-Körper sitzt deshalb eine grüne Raute, über dem lila Modelle-Körper eine rosa. **Die Farben sind also nicht stabil.** In der neuen Variante darf es nur eine Quelle für die Gebietsfarbe geben.

**Bänder zwischen Gebieten:** SVG-Quadratkurven (`atlas-terrain-space.mjs:95–116`). Die Breite ist `1.4 + log2(n+1)·.45`, höchstens 4.5 px, wobei n die Zahl der vorhandenen Beziehungen ist (`:113`). Gefärbt sind sie nach dem kleineren Gebietsindex. Das ist eine brauchbare Vorlage für eine logarithmisch gedämpfte Stärke.

**Nicht übernehmen**
- Die Bänder in der Mitte laufen zu einer redaktionellen Mitte (`:66`: „They are orientation, not a factual edge“). In der Lebenden Welt darf **keine Linie ohne belegte Fuge** stehen.
- Die Körper wirken stellenweise wie zerknitterte Folie, mit spitzen Zipfeln und Polygonkanten bei 16×4 Segmenten.
- Die Beschriftung ist fett und groß mitten auf dem Körper und überdeckt ihn.
- Ortsebene: Einträge erscheinen als dunkle Rechteckkarten `.aw-place-entry{background:#172138cb}` (`atlas-art-direction.css:22`) mit Seitenblättern „1–6 / 19“ (`ernte/history-01-03-ort-geoeffnet.png`).
- Meta-Sätze: „Jedes Gebiet hat eine eigene Farbe. Nähe ist keine Ursache.“, „Wie dieser Raum gelesen wird“.
- Zahlen als Etikett („131 Orte“).
- Die Steuerleiste als abgerundetes Rechteck unten rechts.

## 2 Lichtvariante der Membran (history-04)
**Bild:** `va-history-04-lichtraum.png`

**Was wirkt**
- Dieselben Körper, aber fast weiß und glasig. Die Gebietsfarbe bleibt nur als Saum und Schimmer.
- Die Bänder werden breite, irisierende Bögen (Breite `1.05 + .78·sin(πu)`, Bogen `arch = 1.9·sin(πu)`).
- Darunter liegen konzentrische Höhenringe als Grund.

**Technik:** `variants/history-04/atlas-world-renderer.mjs`. Die Farbe ist `mix(palette, paper, light)` statt `.04 + light·.1`, so ergibt der Diff zu 02 (Zeile 54 zu 55). Die Auflösung ist höher, 36×7 statt 16×4.

**Urteil:** Lichter, aber die Gebiete sind kaum noch zu unterscheiden, und das verletzt die stabilen Gebietsfarben. Die schwarzen Höhenringe sind hart und tragen keine Daten. Brauchbar ist nur der **Lichthof-Saum** als Zustand „hervorgehoben“ oder „Begegnung“, nicht als Grundzustand.

## 3 Terrain mit Strömung (history-05)
**Bild:** `va-history-05-gelaende.png`

**Was wirkt**
- Ein zusammenhängendes Relief. Die Gebiete sind Kuppen, deren Farbe weich ineinander übergeht.
- Durch die Mitte fließt ein Fluss mit treibenden Lichtpunkten.

**Technik:** `variants/history-05/atlas-world-renderer.mjs`
- Höhe `worldHeight` `:14–20`: Sinusrauschen plus eine Gauß-Kuppe je Gebiet, minus Flussrinne `river = x − (2.3·sin(.21z) + .08z)`.
- **Farbübergang zwischen Gebieten:** gewichtetes Mittel nach inversem Abstand, `w = 1/(d²+10)^1.4` (`:31`), danach `mix(dunkelpetrol [.06,.16,.19], tint, .22 + Höhe·.07)`. Ab Höhe 3.1 kommt Schnee hinzu (`:34`).
  - Das ist der einzige Vorläufer, in dem sich Gebietsfarben **im Raum überlagern**. Er mischt allerdings in RGB und ohne Bezug zu Fugen.
- Wasserfläche `[.10,.32,.39]` und 460 Punkte entlang der Flusslinie (`:38–39`). Im Vertex-Shader wandern sie mit `uTime·.45` stromab (`:58`).
  - Das ist eine Vorlage für **Strömung als Teilchenfluss entlang einer Kurve**. Die Bewegung habe ich im Standbild nicht gesehen, sie ist nur aus dem Code belegt.
- Palette `:9`, dunkel gesättigt: `[.30,.66,.64]`, `[.57,.47,.70]`, `[.76,.45,.36]` …

**Nicht übernehmen**
- Dunkler Grund mit dunklen Bergen, also Dunkel auf Dunkel.
- Grobe Rasterstufen: 150×130 Zellen, flach schattiert.
- Die Höhe trägt keine Daten.
- Dünne, graue Beschriftung.
- „Einen Ort wählen. Näher kommen.“ ist ein Bedienhinweis als Text.

## 4 Höhenlinien-Membranen und Wuchs nach unten (history-06)
**Bilder:** `va-history-06-hoehenlinien.png`, `va-history-06-territorium.png`, `ernte/history-06-03-unterregion-trigger.png`

**Was wirkt**
- Jedes Gebiet besteht aus 4 geschachtelten weichen Konturringen. Die Ringe benachbarter Gebiete **schneiden sich**, so dass sichtbare Überlappungszonen entstehen. Das ist der klarste Vorläufer für „Gebiete überschneiden sich“.
- Die Beschriftung steht in Serifen in der Mitte, ruhig.
- Beim Hineingehen wächst ein Stamm von unten. Die Untergebiete sind Ringe mit kleinen Baumkronen, die Orte sind Blätter (Pfad und Wuchs).
- Ein Brotkrumenpfad „Überblick › Gebiet“ führt zurück.

**Technik:** `variants/history-06/atlas-terrain-space.mjs`
- `terrainContours` `:9–13`: 8 Stützpunkte auf einer Ellipse (1.28 r × .81 r) mit Radiusjitter `1 + .12·sin(2.3i + seed)`, als geschlossene Catmull-Rom-Kurve in kubische Bézier umgesetzt (Tangente = (Nachbar − Vorgänger)/6).
  - Das ist eine billige, schöne Membranform, ein Vorbild für unsere Gebietsgrenzen.
- `regionShape` `:24`: Radien 210/180/145/100, Linienfarbe `--territory`.
- `forestBranch` `:23`: rekursive Quadratzweige, Tiefe 5, Spreizung ±.5.
- `focused` `:26`: Stamm und Kurven zu den Untergebieten.

**Farben:** `:7` `#80bdb9, #b9a5cb, #d49b87, #9ec4a0, #8ab9d2, #d4b982, #b5c88b, #a5afc6` auf dem Feldgrund `#102d30` (`atlas-terrain-space.css:1`).

**Nicht übernehmen**
- Dunkles Petrol als Feld.
- Alle Gebiete haben dieselbe Ringform. Die Form kommt nicht aus Daten.
- Die Blätter auf Ortsebene sind dunkle Flächen mit Text darin.
- Datenfehler: Genetik-Blätter unter „Bedeutung & Trigger“ (`ernte/history-06-03`).
- Die Ringe sind statisch, sie atmen nicht.

## 5 Fasern, Schwarm, Lichthöfe, Textführung (living-network, sichtbar in history-08)
**Bilder:** `va-history-08-fasern.png`, `ernte/history-08-02-faden-aufnehmen.png`

**Was wirkt**
- Alle 1226 Einträge sind kleine Punkte. Jedes Gebiet bildet einen **blattförmigen Schwarm** entlang einer gebogenen Rippe.
- Zwischen den Punkten laufen feine Fasern, deren Farbe vom Ausgangsgebiet zum Zielgebiet verläuft.
- Ausgewählte Orte tragen runde Medaillons, entweder mit Bildausschnitt oder mit Strichsymbol und Lichthof.
- Im Sternbild-Zoom (08-02) umkreisen benannte Nachbarn den Ort. Die Beziehungssätze stehen an den Fäden, und ein Lichtpunkt wandert in Leserichtung.

**Technik:** `variants/history-02/living-network.mjs` (identisch in 01–08)
- Schwarmplatzierung `place()` `:70–93`:
  - Position entlang der Rippe `u` mit Hüllkurve `sin(πu)^.72`,
  - seitlicher Versatz `across·width·envelope`,
  - Rippe als Bogen `sin(πu)·bow + 12·sin(2πu)`,
  - Tiefe für Parallaxe.
  - Gebiete mit Mittelpunkt, Winkel, Länge, Breite und Bogen: `NETWORK_GROUPS` `:2–11`.
- Atmen `animated()` `:174–179`: Periode 19 s, Amplitude etwa 1.4 px je Gebiet phasenversetzt, dazu Zeiger-Parallaxe nach Tiefe. `prefers-reduced-motion` setzt `still` (`:105`).
- Fasern `drawFibres()` `:205–224`:
  - kubische Bézier, innerhalb eines Gebiets über dessen Rippe, zwischen Gebieten über beide Mittelpunkte gebündelt (`strand()` `:184–203`),
  - linearer Verlauf Farbe A → Mischton → Farbe B, also eine RGB-Interpolation,
  - höchstens 700 Kanten, deterministisch ausgewählt (`:13`, `:144`),
  - wandernder Lichtpunkt mit 11-s-Takt nur auf fokussierten Fasern (`:218–223`). Der Code-Kommentar sagt dazu: Geschwindigkeit und Größe „conveys no measured strength“.
- Lichthof `drawKnots()` `:226–247`: Radialverlauf aus der Gebietsfarbe mit Alpha .34 bzw. .2 bis 0, Radius 4–5 × Punkt. Die Punkte sind Ellipsen, gedreht nach dem Gebietswinkel.
- Medaillons `drawVisuals()` `:249–307`: Bild rund beschnitten, Schatten, Doppelring. Ihre Zahl folgt der Detailstufe: 12, 20 oder 32.
- **Detailstufen für Text** `drawLabels()` `:309ff`:
  - Beschriftungsgrenze `12 / 28 / 52 / 84` je Detailstufe (`:311`),
  - sechs Kandidatenlagen um den Punkt, Kollision gegen belegte Flächen (Gebietsnamen, Medaillons),
  - Serifenschrift „Newsreader“, höchstens 2 Zeilen mit Auslassung.
  - Das ist die beste vorhandene **Textführung im Raum** und direkt übertragbar.
- Gebietsfarben `:2–11`, stark entsättigt: `#cba583, #d5b5a1, #b8ad9e, #a7bca7, #a1b9bc, #e4d4b6, #a6b99a, #b9b8ae` auf `#14252b`.

**Nicht übernehmen**
- Fast schwarzer Grund. Graue Fasern ergeben ein **Haarknäuel** im Überblick.
- Die Gebietsfarben sind zu ähnlich, Beige gegen Beige.
- Die Position kommt aus dem FNV-Hash der Kennung (`unit(key,…)` `:15–16`). Für Streuung ist das in Ordnung, als Form ist es nicht erlaubt (KOMBINATION.md).
- Symbole sind redaktionell vergeben („Atlas-Symbol · redaktionelle Orientierung“, als Meta-Text sichtbar).
- Nummern wie „01 … 08“ und Zähler „132 Einträge“.
- Suchfeld- und Reiterleisten.
- Das helle Lesepapier rechts ist ein Rechteckpanel.

## 6 Punktwolken mit Gebietsringen und Bündelschild (history-09 bis 11)
**Bilder:** `ernte/history-09-02-buendel-zwischen-gebieten.png`, `ernte/history-10-01-start.png`

**Was wirkt**
- Gebiete sind Punktwolken mit zwei weichen Konturringen.
- Zwischen zwei Gebieten sitzt ein Bündel, das die Fuge zwischen Gebieten als eigenen Ort zeigt.
- In 10 ist der Grund hell, die Punkte sind nach Gebiet gefärbt.

**Technik:** `variants/history-09/knowledge-landscape.mjs`
- Konturring `:184`: 80 Stützpunkte, `f = 1 + .09·sin(3a+i) + .035·cos(5a+i)`.
- Gebiete mit drei Schlüsselwörtern `:6–13`.

**Farben**
- Kräftig, gut unterscheidbar: `:6–13` `#416a91, #8063a0, #a16c62, #428376, #537b9d, #997848, #557448, #786f8c`.
- Hell: `:85` `#98c2c7, #d2aed2, #ce9d8f, #92c8ae, #9cb9d0, #dbbf86, #bbc98f, #b4adc8`.

**Nicht übernehmen**
- Dunkler Canvas `#15272b` (09).
- Graue Kantenknäuel.
- Vier Formularzeilen mit Auswahllisten.
- Schilder „36 Verbindungen ↗“ als Zahl.
- Rechte Seitenleiste als Rechteck.
- Kachelknöpfe „Borderline ↗ / Scham ↗ …“.

## 7 Themenraum-Gestalten (history-02 bis 05, atlas-chapter-spaces)
**Bilder:** `ernte/history-02-03-themenraum.png`, `ernte/history-05-03-themenraum.png`, `ernte/history-04-02-themenraum.png`

**Was wirkt:** Jedes Gebiet faltet dasselbe Papiernetz (28×6) anders: Dialog als zwei Bögen, Körperumriss, Wellen, Umlaufbahnen, Pfade (`variants/history-02/atlas-chapter-spaces.mjs:52–97`). Dazu kommt ein Bühnenlicht als Radialverlauf in der Gebietsfarbe (`:104`).

**Urteil:** Die Gestalten kommen aus dem Thema und nicht aus den Daten. Der Körperumriss legt Orte an einen Körper, was der Code selbst verneint (`:43`, Meta-Satz „Die Körperform ist eine Lesehilfe …“). Für die Lebende Welt taugt höchstens das **Bühnenlicht** als Lichthof eines Gebiets.

**Nicht übernehmen**
- Milchglas-Rechtecke mit weißer Schrift (04).
- Dunkler Grund (05).
- Auswahlliste „Themenraum wechseln“.
- Zähler „1 / 57“.

## 8 Pfad und Wuchs: Baum-Morph (history-01)
**Bild:** `va-history-01-baum.png`

**Was wirkt:** Dieselben Körper ordnen sich zu einer Krone über einem gemeinsamen Stamm aus den farbigen Bändern. Das ist ein echter Morph, keine neue Seite.

**Nicht übernehmen**
- Die Krone ist gedrängt, Beschriftungen überlappen sich mehrfach.
- Der Stamm behauptet eine gemeinsame Wurzel, die keine Fuge belegt.
- Meta-Satz „Derselbe Bestand, senkrecht. Nähe ist keine Ursache.“

## 9 Textführung an Kanten: Freistellmaske (atlas-space, 01–12)
- `variants/archive-01/atlas-space.mjs:150–152, 181–184`: Alle Kanten tragen eine SVG-Maske, die unter jeder Beschriftung ausspart. Linien laufen also nie durch Text.
- Kanten sind leicht gekrümmte Quadratkurven, abwechselnd ±18 px (`:178–179`).
- Kantenarten in `atlas-relations.mjs`: comparison, tension, practice, verantwortung, reparatur …
- Das ist klein und übertragbar.

---

## Was davon für die Lebende Welt trägt (Bilanz)
1. **Membran:** Die Form der Gebietsgrenze aus dem Catmull-Rom-Ring (`history-06 terrainContours`) zusammen mit Wellenrand und Faltung aus `history-02 sheet` (`:43–47`). Als Grenze dient ein mehrlagiger, halbtransparenter Saum statt eines festen Körpers, damit Überlappung sichtbar bleibt (history-06-Prinzip, auf hellem Grund).
2. **Schwarm:** Platzierung entlang einer gebogenen Rippe mit Hüllkurve und Atmen (`living-network.mjs:70–93, 174–179`). Die Streuung darf aus einem Hash kommen, die Form muss aus Daten kommen. Fernsicht zeigt Gebiete als atmende Schwärme, Nahsicht die Einzelwesen.
3. **Lichthof:** Radialverlauf aus der Eigenfarbe um gewählte oder begegnende Wesen (`living-network.mjs:233–236`). Das Bühnenlicht des Gebiets kommt aus `atlas-chapter-spaces.mjs:104`.
4. **Strömung:** Teilchen wandern entlang einer Kurve (`history-05 :39, :58`) und Lichtpunkte entlang einer Faser (`living-network.mjs:218–223`). Für die Lebende Welt nur auf **belegten Fugen**, mit Richtung aus der Fuge.
5. **Farbüberlagerung im Raum:** Das IDW-Mischen aus history-05 `:31` ist der Vorläufer. Es muss ersetzt werden durch OKLab und durch Mischung nur dort, wo eine belegte Fuge besteht.
6. **Stärke gedämpft:** Die log2-Breite der Bänder (`history-02 atlas-terrain-space.mjs:113`) ist eine Vorlage für eine begrenzte Kurve. Die überadditive Kurve selbst gibt es in keiner Fassung, sie ist neu zu begründen.
7. **Text im Raum:** Kollisionsfreie Lagen in sechs Varianten, Beschriftungszahl nach Detailstufe 12/28/52/84 (`living-network.mjs:309–330`) und die Freistellmaske unter Text (`atlas-space.mjs:150`).
8. **Maßstabswechsel:** Zoom ins Gebiet mit Nachbarn als Randkontext (`va-history-02-gebiet.png`). Morph per `aFrom/uMorph` statt Seitenwechsel. Bewegung entfällt bei reduzierter Bewegung oder Ruhe (`atlas-terrain-space.mjs:18–19, 50, 69`).
9. **Rückfallstufe:** Canvas-2D-Ersatz ohne WebGL (`atlas-world-renderer.mjs:99–117`).

## Was in keiner Form übernommen werden darf
- **Rechtecke:**
  - dunkle Ortskarten `.aw-place-entry` (`history-02 atlas-art-direction.css:22`),
  - Milchglas-Kästen (04-Raum),
  - Seitenpanels (08, 09, archive-01),
  - Steuerleisten als Rechteck,
  - Fugenblatt-Overlay (`ernte/history-01-09`),
  - Kachelknöpfe (10).
- **Dunkel auf Dunkel:** 05 (#0f1c22-artig), 06-Feld `#102d30`, 08 und living-network `#14252b`, 09 `#15272b`, 12 und archive-01.
- **Meta-Text:**
  - „Nähe ist keine Ursache.“
  - „Derselbe Bestand, senkrecht.“
  - „Wie dieser Raum gelesen wird“
  - „Einen Ort wählen. Näher kommen.“
  - „Bewegung zeigt die Leserichtung“
  - „Atlas-Symbol · redaktionelle Orientierung“
  - „Die Körperform ist eine Lesehilfe …“
- **Zahlen als Etikett** („131 Orte“, „36 Verbindungen“, „01 … 08“, „1 / 57“).
- **Formularleisten** und **Kantenknäuel** im Überblick.
- **Linien ohne Fuge** (Bänder zur redaktionellen Mitte, Baumstamm).
- **Instabile Farben:** zwei Paletten für dasselbe Gebiet in history-02; jede Fassung hat eigene Werte für dieselben 8 Gruppen.
- **Form aus dem Hash der Kennung.**
- **Höhe ohne Datenbedeutung** (05).

## Offen
- Bewegung (Atmen, Flussteilchen, Morph) ist nur aus dem Code belegt, nicht im Bewegtbild gesehen. Alle Aufnahmen sind Standbilder.
- Ob die Startfall-Kanten aus archive-01 in `karte.json` als belegte Fugen bestehen, ist nicht geprüft.
- Zuordnung der 8 alten Gruppen zu den 10 Regionen: keine Vorlage gefunden.
- history-03 und history-07 habe ich nicht frisch aufgenommen. 03 ist nach Ernte A eine Parametervariante von 02. 07 ist eine Bildkapitel-Kachelwand, also nicht organisch.
