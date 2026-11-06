# Vorläufer B – organische Formen für „Lebende Welt“

Stand 6. November 2026, Claude. Teil B der Sichtung: `history-13` bis `history-23`, `original-01` bis `original-04` und `material-01` im Variantenraum `/Volumes/ThunderBolt4_2TB/Development/Artifacts/atlas-variantenvergleich-20261103/variants/`. Ich habe nur gelesen. Geschrieben habe ich ausschließlich diese Datei, die Bilder `bilder/vb-*.png` und das Aufnahmeskript `.tmp/vb-shots.cjs`.

## 0. Wie gearbeitet wurde

- **Vorhandene Bilder angesehen** (Read auf die PNG-Dateien in `/Volumes/ThunderBolt4_2TB/Development/Artifacts/fugenland-bausteine-claude-20261105/bilder/`): `ta5wasser-01-start`, `-01b-zelle-faeden-ausschnitt`, `-10-zoom-weit`, `-13-kapitel-polyvagal`, `-14-kapitel-toleranz`, `-19-zweites-eigenes-arme`, `cur-koerper-21b-arme-ausschnitt`, `cur-wasser-02-kartenraum-zoom`, `cur-wasser-25-karte-wellen`, `lichtgrund-01-start`, `-06-morph-zum-garten-mitte`, `-08-galaxie-mondspiralen`, `history-17-03-spatial`, `history-18-01-trigger-auftakt`, `history-20-02-beziehungsfeld`, `history-22-02-situation`. Gelesen habe ich dazu `KOMBINATION.md`, `ernte-historie-b.md` und `ernte-originale.md`. Aus `ernte-eigene-und-netz.md` nur den Lichtgrund-Abschnitt.
- **Neue Bilder, 1440×900:** Der Variantenordner lief statisch über `python3 -I -m http.server` auf 127.0.0.1:47981. Der Port war vorher frei, der Dienst lief mit PID 85552 und ist per PID beendet worden. Aufgenommen hat Google Chrome headless über playwright-core aus dem Projekt. Alle Anfragen außerhalb von 127.0.0.1:47981 waren gesperrt. Nichts wurde gebaut, es lagen nur vorhandene `dist`-Stände vor.
- **Quellcode gelesen:** Die Builds `original-02` und `original-04` sind minifiziert. Ihren Quellbaum habe ich deshalb nur gelesen, unter `/Volumes/ThunderBolt4_2TB/Development/Projects/traumaatlas-5-wasser/src/` (Quelle von `original-04` laut `catalog.json`). Die Zeilenangaben unten beziehen sich auf diesen Quellbaum. `material-01`, `original-03` und `history-18/20/22` habe ich direkt im Variantenordner gelesen.
- **Zuordnung der Ordnernamen** (aus `catalog.json` und `<title>`):
  - `original-01` ist PHÄNOMENAUTiK 3 (Kimi-Welt).
  - `original-02` ist TraumaAtlas 2/4 „Der Schwimmer“, Titel „TRAUMAATLAS 5 — Die Welle“.
  - `original-03` ist die PHÄNOMENAUTiK-Site mit dem Dynamikraum.
  - `original-04` ist TraumaAtlas 5 „Wasser“ („Das Meer der Phänomene“).
  - `material-01` ist das Antigravity-Zellgewebe (Mooncells).
- **Grenzen:**
  - `original-01` öffnet statisch nicht und zeigt „Die Spielwelt bleibt geschlossen“ (`bilder/vb-original01-phaenomenautik3-start.png`). Daraus ist nichts zu ernten.
  - `history-13` bis `-17` habe ich nicht neu aufgenommen, weil die vorhandenen `history-1x-*.png` dieselben Stände zeigen. Laut `ernte-historie-b.md` §1 sind 13, 14 und `archive-*` Doppelungen.
  - Die Aufnahme von `history-20` mit Klick auf „Die Angst vor Verlust ist groß“ lief in einen Zeitüberlauf, das Element ist ein SVG-`<g role=button>` außerhalb des Bildes. Statt der neuen Aufnahme zählt hier das vorhandene `history-20-02-beziehungsfeld.png`.

## 1. Rangfolge: die organischsten Vorläufer in Teil B

1. **original-04 TraumaAtlas 5 „Wasser“**: Fasern und Zellen, wachsende, einhakende und reißende Arme, Lichthöfe im Wasser, Farbströmung und ein Fernbild als atmende Wolke. Bilder: `bilder/vb-original04-ta5wasser-start.png`, `bilder/vb-original04-ta5wasser-arme-ausschnitt.png`, `bilder/vb-original04-ta5wasser-karte.png`.
2. **material-01 Zellgewebe**: atmende Membranen, sich überlappende Gebietshüllen und Brücken mit Taille. Hell, auf Papiergrund. Bilder: `bilder/vb-material01-zellgewebe-ruhe.png`, `bilder/vb-material01-zellgewebe-kapitel.png`.
3. **original-04, Kapitel „Drei Ebenen“**: drei ineinanderliegende, rauschverformte Membrankörper, also Morphing und Überlagerung. Bild: `ta5wasser-13-kapitel-polyvagal.png`.
4. **original-02 TA2/4 „Schwimmer“**: konzentrische Ellipsenringe als Ortszeichen, Lichtwolken und der Leerzustand „schwebt frei“. Bilder: `bilder/vb-original02-ta2welle-start.png`, `bilder/vb-original02-ta2welle-ringe-ausschnitt.png`.
5. **original-03 Dynamikraum**: Ringwellen auf einer lichtbrechenden Wasserfläche, mit CPU-Ersatz. Bild: `bilder/vb-original03-dynamikraum.png`.
6. **history-22 / history-18**: heller Grundton mit Pfadlandschaft (Illustration) und ein Ellipsenring von Leitfragen. Bilder: `bilder/vb-history22-start.png`, `history-18-01-trigger-auftakt.png`.

Alle übrigen Stände in Teil B (history-13 bis 17, 19, 21, 23) sind in ihrer Form Kachel-, Formular-, Organigramm- oder Graphansichten (`history-17-03-spatial.png`: weiße Kästen mit geraden Linien). Organisch ist an ihnen nichts. Ihr Wert liegt im Inhalt, siehe `ernte-historie-b.md`.

## 2. Gelungene organische Formen, einzeln

### 2.1 Fasern und Zellen: Phänomen als Myzelzelle (original-04)
- **Gesehen:** `ta5wasser-01b-zelle-faeden-ausschnitt.png`, `vb-original04-ta5wasser-arme-ausschnitt.png`. Ein leuchtender Kern mit 3–5 verästelten Fäden, Knotenpunkte auf den Fäden und ein feiner Partikelschwarm. Bei Brainspotting und PITT wirkt das wie Neuronen oder Myzel im Nebel und ist das stärkste „Lebewesen“-Bild im Bestand.
- **Technik:**
  - `src/ocean3d/Phenomena3D.tsx:29` `seeded(id)` liefert einen deterministischen Zufall aus der Kennung.
  - `:50–86` `buildThreads`: rekursiver Lauf `walk()`, Verzweigung bei `depth < 2` mit Wahrscheinlichkeit 0,45 (`:73`), Astlänge × 0,45. Hauptstränge `3 + floor(rnd*3)` (`:79`).
  - `:100–119` `buildSwirl`: Partikel in der Grundfarbe mit gestreuter Helligkeit.
  - `:188` Atmen: `1 + 0.045·sin(t·breathW + breathP)`, mit `breathW` 0,25–0,65 je Wesen (`:145`).
  - `:200` Die Punktgröße pulsiert gegenphasig.
  - Linien mit `AdditiveBlending`, Deckkraft 0,4 (`:249`), Punkte mit Halo-Textur (`:253–258`).
- **Farben:** Die Zellfarbe kommt aus dem Knotentyp (`nodeTypeMeta`):
  - Verfahren `#d9a05b`, Symptom `#c98a8a`, Phänomen `#91b5bd`, Übung `#7fb8a4`, Nervensystem `#8fd0b8`.
  - Profil `#a98fc7`, Kontext `#bba5ca`, Schule `#9aa8c7`, Phase `#d4b483`, Baustein `#a3b18a`, Symptomfeld `#b48ea3`.
- **Übernehmen:** Das Lebewesen als Kern mit Fasern, das gegeneinander phasenversetzt atmet. Für 1226 Orte als 2D-Canvas oder WebGL-Instanzen. Die Fasern erst ab mittlerem Zoom zeichnen (Detailstufe).
- **Nicht übernehmen:**
  - Die Form aus dem Hash der Kennung. Zahl und Richtung der Fasern müssen aus den echten Fugen eines Orts kommen: ein Strang je Fuge, seine Art bestimmt die Strichart (siehe KOMBINATION §1).
  - Additive RGB-Mischung der Punkte.

### 2.2 Arme: wachsen, haken ein, reißen (original-04)
- **Gesehen:** `ta5wasser-19-zweites-eigenes-arme.png` und `vb-original04-ta5wasser-arme-ausschnitt.png`. Die Lichtbänder laufen von einem Kern zu vielen anderen. Gespannte Arme sind dünn und hell, lockere breit und gedimmt. Wo zwei Arme dicht beieinanderliegen, entsteht ein Bündel.
- **Technik:**
  - `src/ocean/world.ts:446–473` `relatedness()` liefert Stärke und Grund: bestätigter gemeinsamer Bezug 0,95, Zuordnungsvorschlag 0,6, gleiche Erregungslage 0,5, Gegensatz −0,5.
  - `:475` `rebuildArms`.
  - `:510–511` `LINK_DIST 620`, `LATCH_DIST 300`.
  - `:513–600` `stepPhysics`: Anziehung mit Ruheabstand 260 (`f = min(1,(d−260)/620)·s·14`), Abstoßung, Ausweichen Fremder (`:542`, `−(1−d/560)·26`), Treiben `sin/cos` mit 2,2 (`:556`), Dämpfung 0,94 (`:558f`). Wachstum `+0,8·dt`, Rückzug `−0,6·dt` jenseits 1,5 × LINK.
  - Negative Arme haken nie ein (`:582`).
  - Shader `src/ocean3d/Arms3D.tsx:36–69`:
    - `discard` jenseits `uGrowth`, mit weichem Wachstumsende.
    - Spannung gibt eine helle Kernlinie (`:55–58`).
    - Eingehakt läuft ein wandernder Puls `exp(−((fract(u−t·0.35)−0.5)·7)²)` (`:60`).
    - Gegner flackern (`sin(t·9+u·22)`).
  - Geometrie `:221–257`: Breite `lerp(0.2, 0.06, tension)`, Durchhang `(1−tension)·min(len·0.1,0.65)`, Zittern bei Spannung über 0,15 mit 17 Hz bzw. 21 Hz.
  - Reißen: Funkenregen `TearBursts` (`:87`, `:283`).
- **Farben:** wachsend `#9fd8cf` (Mint), eingehakt `#e8c9a0` (Sand und Gold), Gegensatz `#8a6cff` (kaltes Violett) (`Arms3D.tsx:179/208/284`).
- **Übernehmen:**
  - Die Zustandssprache des Arms: locker, gespannt, eingehakt mit Puls, gerissen mit Funken.
  - Das weiche Wachstumsende.
  - Für die Begegnung in der Lebenden Welt: Der Arm wächst nur entlang einer belegten Fuge. Seine Stärke kommt aus Fugenart und Belegzahl, nicht aus `relatedness()`. Einhaken entscheidet `zaehne()` (Schloss und Schlüssel), nicht `LATCH_DIST`.
- **Nicht übernehmen:**
  - Einrasten durch Abstand.
  - Die Stufe „gleiche Erregungslage“, die ein räumlicher Vorschlag ohne Beleg ist.
  - Die erfundenen Stärken 0,95/0,6/0,5.
  - Die Physik `O(n²)` über alle Paare, die bei 1226 Wesen ein Raster oder Nachbarschaftsgitter braucht.

### 2.3 Lichthöfe im Wasser (original-04)
- **Gesehen:** Um jede Zelle liegt ein farbiger Hof auf der Wasseroberfläche (`vb-original04-ta5wasser-start.png`: Rosa um Symptome, Türkis um „Sympathikus“, Sand um die Verfahren).
- **Technik:** `src/ocean3d/OceanWater.tsx:119–123` mit `uPools[10]`/`uBuoys[14]` (x, z, Radius, Intensität) und Farbe. `:259–279`: Gauß-Abfall `exp(−d²/r²)`, aufsummiert, auf `min(field, 1.6)` begrenzt und mit dem Wellenkamm moduliert.
- **Übernehmen:**
  - Den Hof als Gauß-Feld je Wesen.
  - Aus der Überlagerung zweier Höfe wird die Begegnungsfarbe. Für die Lebende Welt gilt: Höfe nicht in RGB aufsummieren, sondern an der Schnittstelle in OKLab mischen (Gewicht aus beiden Intensitäten). Nur bei belegter Fuge entsteht ein gemeinsamer, wachsender Hof. Ohne Fuge bleiben beide Höfe getrennt.
- **Nicht übernehmen:**
  - Additive RGB-Summe mit harter Kappung.
  - Nur 14 Bojen-Slots (für 1226 Wesen eine Dichtetextur oder Instanzen nehmen).

### 2.4 Strömung und Farbschleppe (original-04)
- **Gesehen:** Farbschlieren im Wasser hinter bewegten Körpern (`ta5wasser-03-fahrt-heckwelle.png` laut Ernte; im Startbild die Nebelfarben).
- **Technik:**
  - `src/ocean/fluid.ts:1–9`: GPU-Stable-Fluids nach Dobryakov (MIT): Advektion, Druck nach Jacobi, Vorticity.
  - `:74` Splat `exp(−p²/r)·color`.
  - `:334–339` Tonemapping `dye/(1+dye·0.9)` „gegen Schlamm“.
  - `:465–468` `dyeRes` 640, mobil 384, Zerfall 0,976.
  - Ruhemodus `calm` (`:444`, `:618–620`): Zeit × 0,55 und stärkerer Zerfall.
- **Übernehmen:** Den Ruhemodus als Muster für „Ruhe“ und `prefers-reduced-motion` (Zeitfaktor senken statt alles anhalten), dazu die Tonemapping-Idee gegen Farbschlamm.
- **Nicht übernehmen:**
  - Die volle Navier-Stokes-Simulation als Grundlage, für 2D-Canvas zu schwer.
  - Den dunklen Meeresgrund.
  - Farbe als dekorative Spur ohne Bedeutung.

### 2.5 Fernbild: Gebiet als atmende Wolke (original-04)
- **Gesehen:** `vb-original04-ta5wasser-karte.png` und `ta5wasser-10-zoom-weit.png`. Weit herausgezoomt verschmelzen die Phänomenzellen zu einer warmen, rosa-sandfarbenen Lichtwolke, aus der nur einzelne Fasern ragen. Die Kapitel liegen im Kreis als kleine Ringzeichen.
- **Technik:** Das Bild entsteht aus der Summe der Wasserhöfe (2.3) und dem Nebel `FogLayer` (`src/ocean/OceanStage.tsx:37–82`, `FOG_RES 0.5`). Der Nebel ist `rgba(4,10,13,0.72)`, darin schneiden `destination-out`-Gradientenlöcher Lichtungen: besuchte Inseln mit r × 3,2, jedes Phänomen mit `340 + stage·130`.
- **Übernehmen:**
  - Das ist die Vorlage für die ferne Detailstufe: Ein Gebiet ist eine Wolke aus summierten Höfen, keine Umrisslinie.
  - Dazu „Erkenntnis lichtet“ als Lichtungsmechanik: Ein Medienort öffnet eine Lichtung.
- **Nicht übernehmen:**
  - Nebel als dunkle Multiplikationsschicht, denn das wäre Dunkel auf Dunkel.
  - Für die Lebende Welt die Lichtung umkehren: heller Grund, die Lichtung ist ein klarer, wärmerer Fleck.
  - Beschriftungsknäuel in der Wolkenmitte (im Bild überlappen 8 Titel).

### 2.6 Membranen, die atmen, und Gebiete, die sich überlappen (material-01)
- **Gesehen:**
  - `vb-material01-zellgewebe-ruhe.png`: drei große Gebietshüllen auf Papiergrund. Zwei überlappen sich sichtbar in der Mitte, die Hüllen zeigen Doppelkontur und Einschnürungen. Darin liegen ovale Zellen mit Doppelwand und lichtdurchlässigem Rand.
  - `vb-material01-zellgewebe-kapitel.png`: Bei Auswahl leuchten alle Vorkommen und ihre Hüllen kupferfarben, alles andere blasst ab, ohne zu verschwinden.
  - Das ist die beste helle, nicht-rechteckige Gebietsform im ganzen Teil B.
- **Technik (`variants/material-01/index.html`):**
  - Gebietshülle `renderTissueGeometry` (`:1704`). Je Mitglied 12 Randpunkte mit welligem Polster `pad = 16 + 4.5·sin(3θ + s·1.7 + m·0.9)` (`:1752–1759`). Dann konvexe Hülle `convexHull` (`:1522`).
  - `buildOrganicZonePath` (`:1552–1610`): Lange Segmente über 150 px bekommen eine Taille zur Mitte (`waist = min(12, len·0.045)`, `:1568`). Danach geschlossene Catmull-Rom-Kurve als kubische Bézierkurve mit `tension 0.21` (`:1590`). Eine zweite Kontur mit 5,5 px Einzug (`:1766f`).
  - Zellen: CSS `::before`/`::after` mit Doppelkontur (`:474–495`), radiale Füllung von Papier 66 % auf Grün-Rand. Zehn asymmetrische `border-radius`-Silhouetten, jede atmet mit eigener Periode von 14,8 bis 23,6 s und negativem Versatz (`:519–577`). Keyframes mit ±2–3 px Versatz, ±1,3 % Maß und wanderndem Radius (`:609–621`).
  - Brücken `buildBridgePaths` (`:1613ff.`): ein Schlauch, an den Enden 8,2 bzw. 10,2 breit, in der Mitte nur 2,7 (Taille). Wechselnder Bogen ±(4–15). Füllung, zwei Wände, Kernlinie und eine „Klappe“ als Richtungszeichen (`:302–311`).
  - `prefers-reduced-motion` schaltet jede Animation ab (`:1152–1158`).
- **Farben** (`:20–31`, `:251–264`):
  - Papier `#e8e8df`, Tinte `#234246`, Grün `#637873`, Kupfer `#a66948`.
  - Zonenfüllung `rgba(99,120,115,0.055)`, Zonenlinie `rgba(99,120,115,0.44)`.
  - Aktiv: Füllung `rgba(166,105,72,0.055)`, Rand `rgba(35,66,70,0.56)`.
- **Übernehmen:**
  - Das Hüllenrezept (Polster mit Sinuswelle, Hülle, Taille, Catmull-Rom, Doppelkontur) für die zehn Regionen. Berechnet wird es aus den echten Ortspositionen in `karte.json`. Die Überlappung entsteht von selbst, wo Orte zweier Regionen nahe liegen.
  - Die Brücke mit Taille als Form einer belegten Fuge, also nicht als Strich.
  - Das versetzte Atmen.
  - Abblassen statt Ausblenden.
- **Nicht übernehmen:**
  - Den Metasatz unter dem Bild („Größe, Position und langsame Membranbewegung dienen ausschließlich …“), das Etikett „Isolierter visueller Arbeitsbeitrag“, die Legendenzeile und den Fokustext unten.
  - Feste CSS-Positionen `.mc-membrane-pos-*` (`:365–430`).
  - DOM-Zellen für 1226 Orte. Die Hülle muss im Canvas laufen.
  - Wörter wie „KAPITELVERWEIS“ als sichtbare Typmarke.
  - Die Zellen sind waagerechte Ovale, sie lesen sich fast wie Pillen-Knöpfe: Silhouette unruhiger machen.

### 2.7 Morphing: drei ineinanderliegende Rauschkörper (original-04, Kapitel „Drei Ebenen“)
- **Gesehen:** `ta5wasser-13-kapitel-polyvagal.png`. Drei Membranen liegen ineinander: außen Blau mit Kristallzacken, Mitte Orange mit Flammenrand, innen Grün-Sand mit hellem Saum. Ihre Ränder überschneiden und durchdringen sich.
- **Technik:**
  - `src/views/polyvagal/PolyvagalView.tsx:23–58` `ZoneStage`: drei `SilkBody` mit Maß 2,35/1,75/1,2 und gegenläufiger Drehung 0,02/−0,05/0,08.
  - `src/viz/silk.ts`: Simplex-FBM-Verschiebung entlang der Normalen (`:69–85`), Frequenz `mix(1.6, 4.5, uFrost)` (`:80`), Fresnel-Glühen, Farbverlauf `mix(uColorA,uColorB)` (`:110–113`).
  - Ersatz ohne WebGL: SVG-Kreise (`PolyvagalView.tsx:61–80`).
- **Farben:** `PolyvagalView.tsx:17–19`:
  - ventral `#7fb8a4`/`#e2c98c`.
  - sympathisch `#e2a35c`/`#d97742`, Tempo 2,6.
  - dorsal `#8b93c9`/`#aab3e0`, Frost 1, Tempo 0,06.
  - Standardfarben in `silk.ts:142–144` (`#e2a35c`, `#8fd8cf`, `#8b93c9`).
- **Übernehmen:**
  - Den Gedanken „ein Zustand bestimmt die Randtextur“ (ruhig glatt, erregt flackernd, erstarrt kristallin) als Lesart der Randform eines Wesens oder Gebiets, wenn der Bestand dafür ein Feld hat. Wenn nicht, offen lassen.
  - Ineinanderliegende Membranen als Bild für Schichten oder Verschachtelung (Fugenart `nestend`).
- **Nicht übernehmen:**
  - Dunklen Grund `#0b0906` mit Kästen und Tabs.
  - Den Radar.
  - Die Polyvagal-Inhalte selbst, die als medizinische Aussage nicht Teil dieses Bestands sind.
  - 3D-Skulptur als Selbstzweck.

### 2.8 Schwärme (original-04)
- **Gesehen:** nur im Code. Die Fische sind im Startbild nicht sichtbar, das bleibt **offen**.
- **Technik:**
  - `src/ocean3d/FishSchool.tsx:1–4`: vereinfachte Boids (Kohäsion, Ausrichtung, Trennung, Revier-Zug), Fluchtreaktion.
  - CPU-Schritt nur etwa 12 Hz (`:130–134`, `acc > 0.083`), dazwischen nur Matrizen.
  - Kohäsion, Ausrichtung und Trennung grob `O(n²)` je Schwarm von 44 (`:148`), Revier-Zug `:168`.
  - Gezeichnet instanziert in einem Aufruf.
  - Schwanzschlag im Vertex-Shader.
- **Übernehmen:**
  - Das Muster für 1226 Lebewesen: Verhalten mit niedriger Rate je Gebiet (Revier-Zug zur Regionsmitte, Kohäsion nur innerhalb der Region, Trennung über ein Raster), Zeichnen jeden Frame instanziert.
  - Revier gleich Region. Die Überlappungszone entsteht dort, wo sich zwei Reviere schneiden.
- **Nicht übernehmen:** Fische als Bild. Die Wesen sind Zellen mit Fasern (2.1), keine Tiere.

### 2.9 Ringwellen und Lichtungsrand (original-03 Dynamikraum, original-02)
- **Gesehen:**
  - `vb-original03-dynamikraum.png`: ein lichtbrechendes Raster als Wasser, Kreise als Momente, gestrichelte Bögen.
  - `vb-original02-ta2welle-ringe-ausschnitt.png`: drei konzentrische, geneigte Ellipsenringe um ein Rautenzeichen (Kapitelort) und darunter rosa Lichtwolken der Phänomene.
- **Technik:**
  - `variants/original-03/dynamics-effects.mjs:6`: GLSL `height()` mit bis zu 16 Ringwellen (`front = age·3.4`, Band `exp(−((r−front)·1.6)²)`, Abklingen `exp(−age·0.9)`), Licht aus dem Gradienten.
  - CPU-Ersatz `mountWaterCPU` in derselben Datei: Ellipsen mit `radius·0.68`, `rgba(175,240,221,…)`, `shadowBlur 6`.
  - Ringe in `src/ocean3d/Chapters3D.tsx:2` („drei langsam rotierende Lichtringe + vertikale Lichtsäule“), gegenläufig `:69–110`, goldener Ring für besucht `:162`.
- **Übernehmen:**
  - Eine Ringwelle als Zeichen einer Begegnung ohne Fuge: Zwei Wesen streifen sich, eine kurze Welle läuft aus, nichts mischt sich.
  - Konzentrische Ringe als Zeichen eines Medienorts (Klangquelle: Ringe pulsieren nur während der Wiedergabe).
- **Nicht übernehmen:**
  - Den Knopf „Welle auslösen“ (Bedienknopf über der Fläche).
  - Das Gitter.
  - Dunkles Türkis `#18434b → #071c25`.
  - Die Rautensymbole.

### 2.10 Pfadlandschaft und heller Grundton (history-22) sowie Fragenring (history-18)
- **Gesehen:**
  - `vb-history22-start.png`: eine Illustration mit flussartigen Wegen in Salbei, Petrol und Papier. Der hellste und wärmste Ton im ganzen Teil B.
  - `history-18-01-trigger-auftakt.png`: drei schräge Ellipsenbahnen um einen Satz, darauf Fragen als Punkte.
- **Technik:**
  - Die Illustration ist ein Rasterbild `assets/wege-und-spielraum.jpg` und keine Datenform.
  - Der Ring ist CSS `.trigger-field-rings` (`variants/history-18/trigger.css:16`: `border-radius:50%`, `rotate(-18deg)`, radialer Mint-Schleier).
- **Farben:**
  - history-22: `--paper #f6f5ee`, `--ink #203e37`, `--muted #596b62`, `--line #d4dcd1`, `--sage #e5eadf`, `--green #285949`, `--peach #f2e2d2`.
  - history-18 hell: `--trigger-accent #305f55`, `--trigger-warm #8a4d25`, `--trigger-wash #f0f3ea`.
- **Übernehmen:** die Palette als Grund (Papier, Salbei, Petrol, Pfirsich) mit dunkler Tinte. Das löst „kein Dunkel auf Dunkel“. Pfade als weiche, breite Bänder zwischen Gebieten.
- **Nicht übernehmen:**
  - Die Illustration selbst. Sie ist Dekoration ohne Daten, und die Figuren sind erfunden.
  - Die drei Einstiegskacheln.
  - Die obere Navigationsleiste.
  - Das Notizfeld (`history-22-02-situation.png`).
  - Den statischen Ring.

### 2.11 Lichtgrund-Morphing (außerhalb Teil B, nur Bilder gesehen)
- **Gesehen:**
  - `lichtgrund-01-start.png`: Lichtkörner auf einer Spirale.
  - `lichtgrund-06-morph-zum-garten-mitte.png`: dieselben Körner im halben Übergang zum Garten.
  - `lichtgrund-08-galaxie-mondspiralen.png`: Galaxie mit Mondspiralen. Gruppen als Lichtschwärme, darin FASKA als gelbe Blütenwolke.
- **Technik:** Nicht selbst gelesen. Laut `ernte-eigene-und-netz.md` §D: `bedienung.js:575ff.` (Tasten L/B/M/D/C/O/T) und `wuchs.js` (Kette wird Ranke, Gabel wird Seitentrieb). Das bleibt **offen**, bis Teil A oder eine Prüfung es bestätigt.
- **Übernehmen:** Die Detailstufen wechseln durch Verwandlung am selben Ort, jedes Korn bleibt, wo es ist. Weit weg Korn, nah Wesen mit Fasern und Namen.
- **Nicht übernehmen:**
  - Schwarzer Grund.
  - Kleine graue Sperrschrift.
  - Die erklärende Satzzeile unten („Sonne = Dach, Spirale = Werk …“), die als Metakommentar wirkt.

## 3. Nicht übernehmen: gesamt, aus dem, was ich in Teil B gesehen habe

1. **Dunkle Gründe und dunkle Paneele:**
   - TA5 und TA2 mit Nachtmeer, Panelen `bg ≈ #0b0906`/`#14100b` und Nebel `rgba(4,10,13,.72)`.
   - Dynamikraum `#071c25`.
   - history-18/20 `#1b2a2e`-Ton.
   - Dunkle Schrift auf Dunkel (history-17-Überschriften kaum lesbar).
2. **Rechteckige Bedienung:**
   - Paneele rechts („ATLAS-PHÄNOMEN … Details öffnen … Schließen“).
   - Steuerkasten mit Pfeiltasten.
   - Select „Kapitel wählen …“, Regler und Eingabezeile „Ins Meer geben“.
   - Tabs, Pillenknöpfe, Formulare, Notizfelder.
3. **Zählwerke und Spielstand:** „Entdeckt 3 / 66“, „Nächste Lichtung ‚Verstehen‘: noch 5“, „411 Einträge“, „10 Atlasbereiche · 25 Querverbindungen“.
4. **Metatext im Bild:**
   - „Größe, Position … dienen ausschließlich …“ (material-01).
   - „Fiktive Beispiele · keine Vorhersage“-Plakette.
   - „Die Anordnung bündelt Themen …“ (history-20 unten).
   - Bedienhinweise als Fließtext („Wasserfläche halten oder WASD …“).
5. **Beschriftungsknäuel:** In TA5 und TA2 überlappen sich die Titel (z. B. „Dorsaler Vagus (Erstarru…)“ doppelt übereinander, abgeschnittene „…“-Titel). Nötig sind Platzauflösung und Detailstufe.
6. **Form aus der Kennung** (`seeded(p.id)`) statt aus Daten.
7. **Abstand als Passung** (`LATCH_DIST`) und **erfundene Stärkestufen** (0,95/0,6/0,5/−0,5).
8. **Additive RGB-Mischung** (Arme, Höfe, Farbströmung), die der OKLab-Regel widerspricht.
9. **Schwarze Kugel als Avatar** (TA5 und TA2). Sie verdeckt die Mitte und trägt keine Information.
10. **Organigramm und Graph:**
    - history-17 Atlasraum (weiße Kästen, gerade Linien).
    - Cursor-Haarknäuel (`cur-wasser-02`, 1142 Linien).
    - Zielscheibenringe des Phänomenkörpers (`cur-koerper-21b`).
11. **Klinischer Inhalt der Vorläufer** (Polyvagal-Zonen, Übungsempfehlungen, „Hier findet Heilung statt“). Er gehört nicht zum Bestand und darf nicht als Aussage in die Welt.
12. **Absturzpfad:** TA5 stürzt nach drei eigenen Einträgen ab (`ta5wasser-20-absturz-nach-drei-eigenen.png`, laut Ernte). In der Lebenden Welt gibt es keine eigene Eingabe ins Meer.

## 4. Nebenfund zum Startfall

`variants/history-20/atlas-relations.mjs:184` führt den Ort „Die Angst vor Verlust ist groß“ (Gruppe „Nähe & Abstand“) mit Situation, Beobachtung, möglicher Lesart, Unsicherheit, Handlungsspielraum und Frage.

Die Kanten `:435–438` haben dieselben Beschriftungen wie die Fugen in `data-readonly/karte.json`. Das habe ich nachgesehen, Ort-Index 1031, Region 6 „Beziehungen & Borderline“:
- „Eine Antwort bleibt aus“ → „Eine mögliche Bedeutung des Wartens“, Art `einordnung`.
- → „Wenn Nähe zur Verpflichtung wird“: „Wenn Beruhigung eingefordert wird“, `einordnung`.
- → „Auch meine Grenze gilt“: „Bedürfnis trifft begrenzte Verfügbarkeit“, `einordnung`.
- Zusätzlich in karte.json: „Verlassenheitsangst und Vermeidungsbemühungen“ → „unterscheidet Symptomdomäne und Alltagsszene“, Art `aussage`, `typ redaktionelle-zuordnung`, 2 Quellen.

In history-20 sind die Kantenarten `comparison`/`tension`. Die Bildsprache dort (Doppelstrich und Strich als Fugenmarke, `history-20-02-beziehungsfeld.png`) ist ein erster Ansatz für eine Strichart je Fugenart, wirkt aber noch wie ein Graph.

## 5. Offen

- Die Schwärme in TA5 (2.8) sind im Bild nicht gesehen, nur im Code.
- Lichtgrund-Code (2.11) nicht selbst gelesen.
- `original-01` statisch nicht lauffähig. Ob dort organische Formen stecken, bleibt ungeprüft.
- Die Funken beim Reißen (`TearBursts`) und der Puls eines eingehakten Arms sind im Standbild nicht sicher zu erkennen. Für die Bewegung braucht es eine Videoaufnahme, die ich nicht gemacht habe.
- WebGL lief in Chrome headless. Ob Farben und Höfe dabei der echten GPU-Darstellung entsprechen, ist nicht verglichen.
- Ob `karte.json` ein Feld hat, das eine Randtextur je Ort (2.7) belegen könnte, habe ich nicht geprüft.

## Bilder dieser Sichtung (`bilder/`)
- `vb-original04-ta5wasser-start.png`, `vb-original04-ta5wasser-arme-ausschnitt.png`, `vb-original04-ta5wasser-karte.png`
- `vb-material01-zellgewebe-ruhe.png`, `vb-material01-zellgewebe-kapitel.png`
- `vb-original02-ta2welle-start.png`, `vb-original02-ta2welle-ringe-ausschnitt.png`
- `vb-original03-dynamikraum.png`, `vb-history18-auftakt.png` (zeigt die Beziehungskarte, nicht den Trigger-Auftakt), `vb-history22-start.png`
- `vb-original01-phaenomenautik3-start.png` (Fehlbild als Beleg, dass der Stand statisch nicht öffnet)
