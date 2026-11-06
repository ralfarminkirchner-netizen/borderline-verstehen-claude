# Technik-Bausteine für Lebewesen-Bewegung

Sichtung für die Variante „Lebende Welt“ von „Borderline verstehen“. Stand 06.11.2026, Claude. Nur gelesen, nichts verändert, kein Dienst gestartet, keine eigenen Bilder erzeugt.

Gelesene Quellen (vollständig, wo nicht anders gesagt):

| Baustein | Quellordner | Fassung |
|---|---|---|
| TraumaAtlas 5 „Wasser“ | `/Volumes/ThunderBolt4_2TB/Development/Projects/traumaatlas-5-wasser/` | Commit `6848d5d` „Eingefrorene Codex-Prueffassung 2026-10-13“ |
| dasselbe als Bau | `/Volumes/ThunderBolt4_2TB/Development/Artifacts/atlas-variantenvergleich-20261103/variants/original-04/assets/index-CWzBe_rx.js` | minifiziert; enthält dieselbe Arm-Logik (`latched`, `growth+n*.8`), per grep geprüft. Quelle und Bau stimmen in diesem Teil überein. |
| Phänomenkörper mit Armen | `/Volumes/ThunderBolt4_2TB/Development/Artifacts/atlas-variantenvergleich-20261103/prepared/cursor-phaenomenkoerper-70f4/source/apps/web/src/` | Commit `2b767bf` vom 06.10.2026, Zweig `cursor/phaenomenkoerper-70f4` (provenance.json). `phenomenon-body.ts` ist in `cursor-water-body-0d2e` byte-gleich (`diff -q` ohne Ausgabe). |
| Lichtgrund-Morphing | `/Volumes/ThunderBolt4_2TB/Development/Projects/spiralcells-lichtwerk-lichtgrund/` | Commit `e03f214` „Lichtgrund Schritt 23“ |

Ganz gelesen: `src/ocean/world.ts`, `src/ocean3d/Arms3D.tsx`, `src/ocean3d/Phenomena3D.tsx`, `src/data/blocks.ts` Z. 130–310, `src/ocean3d/dive.ts`; `phenomenon-body.ts`, `PhenomenonBody.tsx`, `liquid-surface.ts` Z. 1–100; `LICHTGRUND.md` Z. 1–135, `app/js/wuchs.js`. In Ausschnitten: `OceanStage.tsx` Z. 955–990, `mapping.ts` Z. 205–225, `OceanWater.tsx` Z. 262–285 und 370–420, `continuous-atlas.css` Z. 150–164, `ContinuousAtlas.tsx` Z. 285–305, `garten.js` Z. 1–160, `gelaende.js` Z. 55–98, `haupt.js` Z. 548–566, `bedienung.js` Z. 570–600.
Nicht gelesen: die übrigen Dateien von TA5 (`swimmer.ts`, `waves.ts`, `OceanStage.tsx` großteils), `mycel.js`, `zelle.js`, `licht.js` und die neue three.js-Engine (`werkzeuge/neu/welten.js`) im Lichtgrund.

Angesehene Bilder (aus `/Volumes/ThunderBolt4_2TB/Development/Artifacts/fugenland-bausteine-claude-20261105/bilder/`): `ta5wasser-01b-zelle-faeden-ausschnitt.png`, `cur-koerper-21b-arme-ausschnitt.png`, `lichtgrund-06-morph-zum-garten-mitte.png`.

Eigene Zählungen aus `data-readonly/karte.json` (node, nur gelesen) stehen in Abschnitt 4.1.

---

## 1 TraumaAtlas 5 „Wasser“: Arme, Zellen, Schwarm, Atmen

### 1.1 Datenmodell
`world.ts` Z. 47–79. Ein Phänomen hat Weltlage `x, y`, Geschwindigkeit `vx, vy`, eine Leuchtfarbe, `links` (Wortnähe-Vorschläge), `confirmed` (bestätigte Atlasbezüge), `bornAt` (Zeitstempel, dient als Phase) und optional `graphId`/`projection`. Ein Arm ist `{a, b, strength, growth 0..1, latched, reason, graphEdgeId?}`. Die Welt ist 5200 × 3200 Einheiten groß (Z. 11).

### 1.2 Wie die Stärke eines Arms entsteht
`relatedness(a, b)`, Z. 446–473. Vier feste Stufen, die erste Treffer-Regel gewinnt:

| Bedingung | Stärke | Grund-Satz |
|---|---|---|
| beide haben denselben bestätigten Atlasbezug | 0,95 | „Gemeinsamer bestätigter Bezug: …“ |
| ein gleicher Zuordnungsvorschlag in `links` | 0,6 | „… keine bestätigte Beziehung“ |
| gleiche Erregungslage des ersten Vorschlags | 0,5 | „Räumlicher Vorschlag aus gleichen Erregungszuordnungen“ |
| verschiedene Erregungslage (hyper/hypo, nicht „both“) | −0,5 | „Räumlicher Vorschlag aus verschiedenen …“ |
| sonst | kein Arm | |

`rebuildArms()` (Z. 475–506) legt für jedes Paar mit |Stärke| > 0,3 einen Arm an und übernimmt `growth`/`latched` eines schon vorhandenen Arms. Projektions-Arme aus dem kanonischen Graph bekommen fest `strength 0,65, growth 1` und werden nie animiert (Z. 479–485, 570). Bewusst gelöste Arme bleiben gelöst (`releasedArms`, in `localStorage`, Z. 103–109, 399–405).

### 1.3 Bewegung: Kräfte und Integration
`stepPhysics(dt)`, Z. 513–594, aufgerufen aus dem rAF-Loop in `OceanStage.tsx` Z. 967–975 mit `dt = min(Δt, 0,05 s)`.

Paarkräfte (Z. 519–550), für **alle** Paare, Einheitsvektor `u` von a nach b, `d` Abstand:
- Anziehung bei Stärke > 0,3: `f = min(1, (d − 260) / 620) · s · 14`. Unter 260 wird `f` negativ, also eine weiche Ruhedistanz von 260.
- Abstoßung bei Stärke < −0,3: `f = (1 − min(1, d/700)) · s · 60`.
- Fremde ohne Beziehung: `f = −(1 − min(1, d/560)) · 26`, sie weichen sacht aus.
- Anwendung: `a.v += u·f·dt`, `b.v −= u·f·dt`.

Integration (Z. 553–566):
- Schweben: `bobX = sin(0,5 t + bornAt/1000) · 2,2`, `bobY = cos(0,4 t + bornAt/700) · 2,2`, als Beschleunigung addiert.
- Dämpfung `v = (v + bob·dt) · 0,94` **pro Aufruf**, also abhängig von der Bildrate.
- Rand: 120 Einheiten Abstand, Abprall mit halber Geschwindigkeit.

### 1.4 Wachsen, Einhaken, Reißen
Z. 510–511 und 569–588. `LINK_DIST = 620`, `LATCH_DIST = 300`.

Positive Arme:
- `d < 620`: `growth += 0,8 · dt` (voll nach etwa 1,25 s).
- `d < 300`: `latched = true`. Das bleibt so, auch wenn sie wieder auseinandertreiben.
- `d > 930` (1,5 × 620): `growth −= 0,6 · dt` und `latched = false`.
- Zwischen 620 und 930 ändert sich nichts. Das ist eine Hysterese, die Flattern verhindert.

Negative Arme wachsen unter 868 (1,4 × 620), schrumpfen darüber und haken nie ein.

Zustände also: ruhend (growth 0), wachsend, eingehakt, schrumpfend. Einen eigenen Zustand „gerissen“ gibt es nicht, nur das Schrumpfen.

### 1.5 Arm-Geometrie und -Sprache (`Arms3D.tsx`)
- **Band:** 28 Segmente (Z. 16), ein Dreiecksstreifen mit Attributen `aU` (0..1 entlang) und `aSide` (±1 quer), Z. 158–177.
- **Bogen:** quadratischer Bézier von a nach b (Z. 239–250).
  - Kontrollpunkt in der Mitte, gehoben um `0,24 + 0,04·len − sag`.
  - Seitlich versetzt um `sway = sin(0,6 t + Phase) · len · 0,07 · (1 − 0,65 · tension)` (Z. 228–232).
- **Spannung** = `clamp(len / 12,4, 0, 1)` (Z. 221). Weit auseinander heißt also gespannt.
  - Breite `lerp(0,2 → 0,06, tension)` (Z. 235): locker ist breit, gespannt ist dünn.
  - Durchhang `(1 − tension) · min(0,1·len, 0,65)` (Z. 229).
- **Zittern** ab tension > 0,15, mit `sin(πt)` an den Enden auf null gezogen (Z. 253–258):
  - quer `sin(17 t + 1,31 i) · 0,05 · tension`,
  - vertikal `sin(21 t + 0,9 i) · 0,02 · tension`.
- **Fragment-Shader** (Z. 48–69):
  - `discard` für `vU > growth`. Der Arm wächst also sichtbar von a nach b, das Ende blendet über 0,08 weich aus.
  - Kantenprofil `smoothstep`; eine helle Kernlinie wächst mit der Spannung.
  - Eingehakt: Lichtpuls `exp(−((fract(vU − 0,35 t) − 0,5) · 7)²) · 1,6`, er wandert mit 0,35 Armlängen je Sekunde.
  - Negativ: Flackern `0,7 + 0,3 · sin(9 t + 22 vU)`.
- **Farben fest, nicht aus den Phänomenen:** locker `#9fd8cf`, eingehakt `#e8c9a0`, negativ `#8a6cff` (Z. 179, 208). Blending additiv.
- **Deckkraft** `growth · (0,6 negativ | 0,85 eingehakt | 0,68 locker)` (Z. 225).
- **Abstoßung** stößt alle 80 **Frames** an beiden Enden eine Ringwelle ins Wasser (Z. 273–280).
- **Riss-Funken** (`TearBursts`, Z. 74–147 und 284–301):
  - Jeder zweite Bandpunkt wird zum Funken (15 Funken).
  - Geschwindigkeit seitlich ±0,8, nach oben 0,3–1,5, Schwerkraft 0,9, Ausblenden über 1,2 s, höchstens 4 Ausbrüche zugleich.
  - **Befund aus dem Code, nicht am Bild geprüft:** Der Ausbruch hängt am Unmount-Cleanup und verlangt `growthRef > 0,25`. Ein Arm wird aber erst entfernt, wenn `growth ≤ 0,02` (Z. 314). Beim normalen Auseinanderdriften fällt der Funkenregen deshalb nie. Er erscheint nur, wenn ein Arm abrupt verschwindet (`releaseArm`, `removePhenomenon`, `rebuildArms`). Das deckt sich mit der Ernte: „im Band ist dafür ein Funkenregen vorgesehen“.

### 1.6 Zelle, Fasern, Schwarm, Atmen (`Phenomena3D.tsx`)
**Saat** (Z. 29–40): 32-Bit-Hash der Kennung mit `Math.imul`-Mischung als Zufallsgenerator. Dieselbe Kennung ergibt dieselbe Form.

**Fasern** (`buildThreads`, Z. 50–88):
- 3–5 Hauptstränge, gleichmäßig verteilt plus Zufallswinkel bis 0,8 rad, Länge 1,1–2,2.
- Jeder Strang läuft in 3–5 Schritten:
  - Richtungsrauschen ±0,45 rad je Schritt,
  - Segmentlänge `len/steps · (0,7–1,3)`,
  - die Spitze hebt sich mit `0,02 + f² · 0,2` (hyphal).
- Seitenast mit Wahrscheinlichkeit 0,45 je Schritt, nur solange `depth < 2`. Weil die Hauptstränge mit `depth 1` starten, gibt es genau **eine** Seitenebene. Winkel ±(0,5–1,2) rad, Länge × 0,45.
- Farbe verblasst zur Spitze: `base · (1 − 0,88 f)`. An jedem Gelenk sitzt ein Knotenlicht.
- Im Bild `ta5wasser-01b-zelle-faeden-ausschnitt.png` gut zu sehen: goldener Kern, feine verzweigte Fäden mit Lichtpunkten auf warmem, hellem Dunst.

**Schwarm** (`buildSwirl`, Z. 100–120; Bewegung Z. 204–224):
- 16–24 Körner.
- Bahnradius 0,28–1,33, mit `0,9 + 0,1·sin(0,3 t + 2φ)` atmend.
- Winkelgeschwindigkeit ±(0,25–0,9) rad/s.
- Höhe `0,14 + yAmp · (0,5 + 0,5·sin(ySp t + yφ))`, mit yAmp 0,05–0,35 und ySp 0,5–1,9.
- Helligkeit 0,55–1,2 × Grundfarbe.
- Der Parameter „Größe“ (`params[i*8+6]`) wird erzeugt, aber nie benutzt. Die Größe ist pauschal 0,2.

**Atmen und Leben** (Z. 141–149, 188–232):
- Skalierung `1 + 0,045 · sin(breathW t + breathP)`, mit breathW 0,25–0,65 rad/s. Das ergibt eine Periode von etwa 10–25 s.
- Langsame Drehung der Fasern: 0,02–0,055 rad/s, Richtung zufällig.
- Faser-Deckkraft `0,3 + 0,16·sin(lineW t + lineP)`, mit lineW 0,5–1,3.
- Knotengröße pulsiert mit 1,7 × breathW.
- Kernpuls `1 + 0,07·sin(1,6 t + bornAt/900)`.
- Auswahl: Fasern × 1,22, Schwarm × 1,45 schneller, Kern × 1,3, Halo 0,85 statt 0,5.
- Die Form neigt sich zur Wellennormalen (`slerp 0,08`).

**Lichtpool im Wasser** (Z. 332–365, Shader `OceanWater.tsx` Z. 271–277):
- Höchstens 13 Phänomene, die der Kamera nächsten, plus der Schwimmer.
- Jedes als Gauß-Fleck `exp(−d²/r²)` mit `r = 2,1 + 1,3·Nähe` und Intensität `(0,7 + 0,9·Nähe) · (0,65 + 0,35·sin)`.
- Additiv, Summe auf 1,6 begrenzt.

**Kielspur:** Bei Geschwindigkeit über 70 setzt eine 6-%-Chance je Frame einen Wasserspritzer (Z. 234–235).

### 1.7 Farbgebung
- Farbe nach Zieltyp (`mapping.ts` Z. 214–219): Symptom `#d98a7e`, Übung `#8fd8cf`, Verfahren `#e2b35c`, Kategorie `#b48ea3`. Freier Text ist `#e8b86d` (`world.ts` Z. 252).
- Gemischt wird nur durch additive Überlagerung in linearem RGB, das heißt Überlappung wird heller bis weiß. Eine wahrnehmungsgetreue Mischung gibt es nicht.

### 1.8 Regelbedingungen und Leerstellen (`blocks.ts`)
- `SynergyRule` (Z. 154–161): `{when(prog) → bool, kind: synergy | order | dose | caution, title, reason, related[]}`. Die Regeln Z. 165–228 sind Prädikate über die Menge gewählter Bausteine, etwa „Stabilisierung vor Konfrontation“.
- `BlindSpot` (Z. 232–240, Einträge Z. 242–296): `check(prog) → bool`, `severity hinweis | wichtig | dringend`, Text und nächster Schritt.
- **Tauglich ist die Form:** eine Regel als Prädikat mit Art und Begründung, eine Leerstelle als eigene, sichtbare Instanz.
- **Untauglich ist der Inhalt:** Die Begründungstexte sind medizinische Aussagen ohne Quelle, etwa „wirken nachhaltiger als jede einzelne“ in Z. 179. Für „Lebende Welt“ darf davon nichts übernommen werden.

### 1.9 Tauchen
`dive.ts`: `sub` folgt dem Halten exponentiell (Rate 2,4 hinein, 1,6 hinaus). `depth` steigt linear über 2,6 s und fällt über 1,2 s. Die Stufen sind Oberfläche < 0,33 · Schwelle < 0,75 · Tiefe (Z. 31–35). Brauchbar als Gestenmuster für „tiefer heißt mehr Text“.

### 1.10 Was falsch war
1. **Distanz entscheidet die Passung.** Einhaken passiert bei `d < 300` (Z. 579), nicht durch erfüllte Voraussetzungen. Zwei Stufen (±0,5) sind reine „räumliche Vorschläge“ aus Erregungslagen.
2. **Form aus dem Hash.** Strangzahl, Verzweigung, Drehsinn und Atemtakt kommen aus der Kennung und sagen nichts über Beziehungen oder Quellen.
3. **Laufzeit O(n²) mit teurem Kern.** `stepPhysics` ruft für jedes Paar `relatedness` auf, mit Mengenbildung und verschachtelten Schleifen über `links`, dazu `ps.find` je Arm. Bei 1226 Orten wären das rund 751 000 Paarprüfungen je Frame. Das war für eine Handvoll Bojen gebaut.
4. **React-Neuaufbau je Frame.** `stepPhysics` meldet jedes Frame an alle Listener (Z. 590–593). Die Lage der Zellen wird beim Rendern gelesen (`bx = w2x(p.x)`, `Phenomena3D.tsx` Z. 133), also wird der Baum jedes Frame neu aufgebaut.
5. **Speicher.**
   - Je Frame und Arm 29 neue `Vector3` (Z. 268), je Frame und Lichtpool eine neue `THREE.Color` (Z. 352).
   - `TearBursts` erzeugt bei jedem Render neue `BufferGeometry` und gibt sie nie frei (Z. 123).
   - Material und Geometrie der Arme werden beim Unmount nicht freigegeben.
   - Eine Aufräumfunktion steht in `useMemo` (Z. 92–95); React ruft sie nie auf.
6. **Abstürze.** Die Ernte belegt Schwarz nach drei eigenen Einträgen (`ta5wasser-20-absturz-nach-drei-eigenen.png`, R3F „code-path“) und nach dem Auftauchen (`ta5wasser-06-…`). **Die Ursache ist offen.** Die Punkte 4 und 5 sind Kandidaten aus dem Code, nicht belegt.
7. **Bildratenabhängigkeit.** Dämpfung `·0,94` je Aufruf, Ringwellen alle 80 Frames.
8. **Riss ohne Bild** (siehe 1.5) und **Armfarben ohne Bezug** zu den Phänomenen.

---

## 2 Phänomenkörper mit fünf Andockstellen (Cursor)

### 2.1 Andockstellen
`phenomenon-body.ts` Z. 6–12: `influence` „beeinflussen“, `influenced` „beeinflusst werden“, `together` „gemeinsam auftreten“, `compare` „vergleichen“, `support` „unterstützen“.
- Lage: `portAngle = ((index + turns) mod 5) · 72° − 90°` (Z. 160–163). Die Stellen liegen auf einem Kreis mit festem **Radius 22 px** (Z. 239; Zeichnung `PhenomenonBody.tsx` Z. 18–24).
- Die „Anschlussdrehung“ verschiebt alle fünf um 72° (`turns` 0–4, Z. 82).
- `facingPort` (Z. 168–176) wählt die Stelle, deren Winkel dem Richtungswinkel zum anderen Ausgangspunkt am nächsten liegt. Daraus kommt „Dem anderen zugewandt: …“.

### 2.2 Armart und Andockstelle aus der gespeicherten Beziehung
- `armKind` (Z. 117–124), Reihenfolge der Prüfung:
  1. Folge-Prädikat (`follows`, `before` …) oder `qualifiers.temporal` → `sequence`
  2. nichtleeres `qualifiers.condition` → `condition`
  3. Vergleichs-Prädikat → `compare`
  4. `supports | contradicts | strengthens | weakens` → `change`
  5. Unterstützungs-Prädikat oder Ziel ist Ressource → `support`
  6. sonst `together`
- `armReading` (Z. 126–130): `change` und `compare` sowie alles mit `epistemic_status = hypothesis` gelten als „Eigene Einordnung“, der Rest als „Beschriebene Beziehung“.
- `armPorts` (Z. 132–137): `change`/`sequence` gehen von `influence` nach `influenced`, `compare` auf `compare`, `support` auf `support`, alles andere auf `together`. **Auch `condition` landet auf `together`.** Die Bedingung hat also keine eigene Andockstelle.

### 2.3 Geometrie des Arms
`armGeometry` (Z. 181–192) ist ein quadratischer Bézier zwischen den beiden Andockpunkten.
- Der Ellbogen ist um `min(36, 0,18·len)` senkrecht versetzt.
- Die Richtung der Biegung kommt aus `bendOf(relationId)`, einem FNV-Hash mod 2, also **aus der Kennung**.
- Am Ellbogen sitzt ein Gelenkpunkt. Sein Tooltip sagt selbst: „Der Winkel trägt keine zusätzliche Bedeutung“ (`PhenomenonBody.tsx` Z. 32).

### 2.4 Auswahl, Kontext, Motive
- **Auswahl** (`buildPhenomenonBody`, Z. 213–256): zwei Ausgangspunkte; alle Beziehungen, die einen davon berühren, sortiert; direkte Beziehungen zuerst; höchstens 16 Arme. Der Rest zählt als `overflow`.
- **Arm-Satz** (Z. 139–146): gespeicherte Erläuterung, sonst Zitat aus `evidence.locator.exact_text`, sonst „A Prädikat B“. **Angebotsgrund** fest formuliert: „… kein neuer Befund und keine Ursache“ (Z. 148–150).
- **Kontext** (Z. 152–158): Zeitdruck, Ruhe, mit Unterstützung. Er gilt als „benannt“, wenn ein Stichwort (`zeitdruck`, `frist`, `in ruhe` …) im gespeicherten Text vorkommt. Das ist eine reine Wortsuche.
- **Motive** (Z. 258–293): Brücke (gemeinsamer Nachbar), Verzweigung (mehrere `change`/`compare` von einem Anker), Bedingungsknoten, Schleife (Tiefensuche auf Zyklus).

### 2.5 Strichsprache
`continuous-atlas.css` Z. 150–164.
- **Farben nach Art:** together `#9ec0c4`, sequence `#f3ddb8`, change `#9be0c0`, condition `#c9b7e6`, compare `#d4c2f0`, support `#e7c39a`.
- **Zustände:**
  - aufgenommen: 3,4 px statt 2,4 px,
  - offen gelassen: gestrichelt mit Deckkraft 0,7,
  - Kontext nicht angegeben: Deckkraft 0,38,
  - Eigene Einordnung: hohler Gelenkpunkt.
- **Kopf:** gerichtete Arme haben einen Punkt am Ende, `support` einen offenen Ring.
- **Einwachsen:** Ein angebotener Arm zeichnet sich über 1,4 s per `stroke-dashoffset` ein, nur bei `prefers-reduced-motion: no-preference` (Z. 161–164).

### 2.6 Die flüssige Fläche darunter
`liquid-surface.ts` Z. 11–58 ist eine gedämpfte Wellengleichung auf einem Gitter: `v = (v·0,992 + 0,16·Laplace(h)) · Schwamm`, `h = clamp(h + v, ±1,8)`. Ein Rand von drei Zellen schluckt die Wellen.
- Störungen entstehen aus Klicks und den „Kielwellen“ wandernder Lichter: Kreuz-Stempel, die Nachbarn bekommen 0,45.
- Unter den beiden Ankern liegt eine Meniskus-Delle (Z. 90–99).
- Bei reduzierter Bewegung wird die Fläche glattgestellt und nur einmal gemalt (`ContinuousAtlas.tsx` Z. 288–303).

### 2.7 Was falsch war
1. **Statisch.** Nichts bewegt sich als Wesen, nur die Arme zeichnen sich ein. Der Körper existiert nur für zwei gewählte Orte, nicht für alle.
2. **Belegung unsichtbar.** Alle fünf Andockstellen werden gleich als Punkt mit r 1,6 gezeichnet (`PhenomenonBody.tsx` Z. 21–24). Ob ein Zahn belegt ist, sieht man nicht. Im Bild `cur-koerper-21b-arme-ausschnitt.png` wirken die Ringe wie Zielkreise im Kanten-Knäuel, mit weißen Zeigern oben.
3. **Form aus Hash** (Biegerichtung) und **Kontext aus Stichwortsuche**.
4. **`condition` ohne eigene Andockstelle**, `influenced` nur als Ziel.
5. **Panel verdeckt die Arme**, Dunkelgrün mit heller Schrift. Die Wellen bedeuten nichts (Ernte, `cur-wasser-25-karte-wellen.png`).
6. **Abhängigkeit:** Die Ansicht „Verbindungen“ stürzte in der Ernte mit Attrappe ab, sie braucht `/neuro/inventory` (`ernte-originale.md` Z. 6).

---

## 3 Lichtgrund-Morphing (SPiRALCELLS-Lichtwerk, Zweig „Lichtgrund“)

### 3.1 Was Ralf dazu entschieden hat
`LICHTGRUND.md`:
- Z. 36–40 (Schritt 7): Morph von 5,5 s. „jedes Korn bleibt an seinem Ort und entfaltet sich dort zum Blatt; das Gelände breitet sich von der Zentrale aus, dann kommt der Himmel“.
- Z. 57–66 (Schritt 11) nimmt das zurück. Ralf will keine optische 1:1-Übertragung und keinen Morph zwischen den Welten, sondern dasselbe Prinzip darunter, in jeder Welt frei gestaltet. Wörtlich, Z. 66: „die Stufe ‚echter Morph‘ aus Schritt 7 gilt nicht mehr“.
- Der Code hat die Umformung trotzdem behalten (`haupt.js` Z. 553–554).

**Lesart, nicht belegt:** Übertragbar ist das Entfalten *am selben Ort innerhalb einer Welt*, etwa als Detailstufe beim Zoomen: dasselbe Wesen bekommt mehr Gestalt. Nicht übertragbar ist das Hinüberformen zwischen verschiedenen Welten.

### 3.2 Die Uhren
`haupt.js` Z. 548–556.
- Landschaft `landK`: **linear** mit `rdt / 5,5 s`. Der Kommentar dazu: „gleichmäßiges Tempo: so ist das Umformen zu sehen“.
- Gartenlage `gartenK` exponentiell, τ = 1,3 s; Netz τ = 1,5 s; Kelch und Spirale τ = 1,1 s.
- Bei reduzierter Bewegung (`W.RM`): Landschaft in 0,1 s, die übrigen τ ≈ 0,05–0,12 s oder sofort (`gartenK = gartenT`). Wind 0 (`garten.js` Z. 154), die Galaxiezeit steht.

### 3.3 Der Morph im Vertex-Shader
`garten.js` Z. 60–74. Jede Fassung ist eine instanzierte Viereck-Instanz mit 18 Floats (`gelaende.js` Z. 12: `a0 ox oz ty werk · a1 x y z art · a2 x y z breite · a3 r g b wann · a4 kx kz`). Die Arten sind BLATT 0, STIEL 1, BLÜTE 2, GRAS 3, KORN 4, FRUCHT 5.

- **Gestaffelter Fortschritt je Organ:** `m = smoothstep(wann·0,55, wann·0,55 + 0,45, (E − 0,18)/0,82)`, mit E = globaler Morph 0..1.
  - Bis E = 0,18 passiert nichts an den Organen, nur das Gelände.
  - Danach entfaltet sich jedes Organ in einem Fenster von 45 % der Restzeit, Beginn verschoben um `wann · 55 %`.
- **Blatt** (Z. 67–68):
  - Start ist ein kamerazugewandtes Lichtkorn der Kantenlänge `uS` an seiner Stelle `A`.
  - Ziel ist eine Blattspreite von `A` nach `A + Stielvektor · m`, mit Durchhang `−v² · l · 0,42 · m` und Breite `w · m · 0,5`.
  - Die Position mischt `mix(Korn, Blatt, smoothstep(0, 0,22, m))`.
- **Stiel** wächst entlang `mix(a1, a2, m)` (Z. 69). **Korn, Blüte, Frucht** ändern nur die Größe: `max(w·m, uS·(1 − m))`, das Korn schrumpft oder wächst auf Organgröße (Z. 71).
- **Fragment** (Z. 77–81):
  - Alpha `mix(Gauß-Korn exp(−5r²), Blattsilhouette, smoothstep(0, 0,25, m))`.
  - Farbe von leuchtendem Korn `vF · 2,4` zu beleuchtetem Blatt mit Mittelrippe und Adern (`smoothstep(0,25, 0,8, m)`).
  - Erst Form, dann Licht.
- **Gelände:**
  - Die Höhe steigt mit `uE` (Z. 33).
  - Die sichtbare Fläche breitet sich von der Zentrale aus, mit Radius `uR · (0,5 + 19 q³)` und `q = smoothstep(0,1, 0,9, E)` (Z. 58).
- **Wind:** `0,012 · Höhe²` als Sinusversatz (Z. 72).

### 3.4 Woher die Staffelung kommt
`gelaende.js` Z. 64–90: `wann` stammt aus den **Daten**.
- Ranke: Position in der Kette, das Älteste zuerst.
- Baum: `0,25 + 0,7 · (Tiefe + 1)/(tiefste + 2)`.
- Wiese: `0,25 + 0,6 · i/zahl`.

Nur Gras und die Streuung der Wiesenblumen nutzen `hash()`, beide ausdrücklich „Grund, trägt nichts“.

Die Pflanzenart folgt der belegten Abstammung (`pflanzenArt`, Z. 60): Mehr als die Hälfte lose ergibt Wiese, eine Gabel ergibt Baum, Tiefe ≥ 4 ergibt Ranke, sonst Blume. Die Größe eines Organs kommt aus der Textmenge (`g(i)`, logarithmisch, Z. 69).

### 3.5 Form aus belegter Abstammung (`wuchs.js`)
`wuchs(m)` rechnet aus den Fassungen eines Werks Eltern und Art, „erfindet keine Herkunft“ (Z. 14).
- Arten: Kette über `derived_from`, Gabel, Keim, Form, frei, Reihe.
- Eine Gabel gilt nur, wenn die Abzweig-Kante vom selben Urheber stammt und höchstens 5 s neben der Fassung angelegt wurde (Z. 44–47). Später behauptete Beziehungen bleiben Faden und werden nie Herkunft.
- Fächerwinkel nach der Zahl der Blätter im Teilbaum hoch 0,75. Die Hauptlinie bleibt mittig, Abzweige wechseln links und rechts (Z. 107–121).
- Jede Stimme hat ihre Speiche bei Vielfachen von 144° (Z. 18, 79–97).

Das ist das sauberste Vorbild für „Zeichen aus echten Daten“: Gezeigt wird nur Belegtes, Unbelegtes steht sichtbar lose daneben.

### 3.6 Was falsch war
1. **Dunkel:** Schwarzer Grund mit kleiner, gesperrter grauer Schrift (Bild `lichtgrund-06-morph-zum-garten-mitte.png`). Das widerspricht „kein Dunkel auf Dunkel“.
2. **Zwischenwelt-Morph von Ralf verworfen** (3.1).
3. In der Ernte blieben die Welten bei Software-Rendering **im Mischzustand**, Beschriftungen überlagerten sich (`ernte-eigene-und-netz.md` Z. 377–379).
4. **Startprobleme der späteren Engine:** zweimal kein WebGPU-Adapter unter Last, Neuladen half (`LICHTGRUND.md` Z. 112). Seit Schritt 18 gibt es den WebGL-2-Ersatzweg.

---

## 4 Übernahme für 1226 Lebewesen auf Canvas2D/WebGL

### 4.1 Maßstab aus den echten Daten
Gezählt in `data-readonly/karte.json`:
- **Umfang:** 1226 Orte, 1831 Fugen, 10 Regionen.
- **Ausdehnung:** etwa 2700 × 2800 Einheiten. Jeder Ort liegt in seinem Regionskreis.
- **Überlappende Regionskreise:**
  - TraumaAtlas ⟷ Phänomenatlas (knapp),
  - TraumaAtlas ⟷ Trigger & Kontext,
  - Phänomenatlas ⟷ Forschung & Einordnung,
  - Beziehungswerkstatt ⟷ Forschung & Einordnung,
  - **Beziehungen & Borderline ⟷ Forschung & Einordnung.**
- **Abstände:** nächster Nachbar im Median 26 Einheiten. Fugenlänge im Median 97, 90 % kürzer als 171.
- **Verknüpfung:** 124 Fugen laufen über Regionsgrenzen. 262 Orte haben keine Fuge. Grad im Median 2, höchstens 189 (ein Knoten).
- **Fugenart (`art`):** einordnung 1037 · offen 253 · uebergang 160 · aussage 148 · annaeherung 86 · folge 67 · abstand 25 · bedingung 19 · widerspruch 18 · zusammenhang 15 · spannung 2 · begrenzung 1.
- **`quellen` je Fuge:** 0 → 876, 1 → 836, 2 → 67, 3 → 21, 4 → 15, ≥ 5 → 16. **`anker`:** 0 → 1733, 1 → 13, 2 → 85.
- **Startfall** „Die Angst vor Verlust ist groß“: 4 Fugen.
  - 3 × einordnung, redaktionell, ohne Quelle: „Eine Antwort bleibt aus“, „Wenn Nähe zur Verpflichtung wird“, „Auch meine Grenze gilt“.
  - 1 × aussage mit 2 Quellen und 1 Anker: „Verlassenheitsangst und Vermeidungsbemühungen“.

Folgerung: Die Partner einer Fuge liegen schon nah beieinander. Begegnungen entstehen durch Wandern im Umkreis von rund einer Fugenlänge, nicht über Weltdistanzen wie in TA5 (620 von 5200).

### 4.2 Was wir übernehmen und wie es sich ändert

| Aus | Übernehmen | Ändern |
|---|---|---|
| TA5 1.4 | Zustandsmaschine wachsen, einhaken, lösen, mit Hysterese im Verhältnis Begegnung 1 : Einhaken ≈ 0,5 : Reißen 1,5 | Der Abstand bestimmt nur, **wann** sich zwei begegnen, nie, **ob** es passt. Ob es einrastet, entscheidet allein `zaehne(fuge)` aus der Schloss-Probe. Ohne Fuge gibt es keinen Arm, die beiden ziehen vorbei. |
| TA5 1.5 | Spannungssprache (locker breit und durchhängend, gespannt dünn, hell, zitternd), Wachstum per Längenmaske, wandernder Puls beim Einrasten | Armfarbe aus der OKLab-Mischung der beiden Orte statt Festfarbe. Riss-Funken beim Zustandswechsel auslösen, nicht beim Unmount. Danach bleibt eine gekittete Spur. |
| TA5 1.6 | Kern, Halo, Fasern, Schwarm; Atmen 4,5 % mit 10–25 s Periode; langsame Drehung | **Fasern = echte Fugen.** Zahl und Richtung der Hauptstränge kommen aus den Fugen des Orts, gebündelt nach Andockstelle. Die Strangdicke folgt den Belegen. Eine Fuge ohne Quelle ist ein feiner, offener Faden. Der Hash darf nur Phasen der Bewegung setzen, nie Form, Zahl oder Farbe. |
| TA5 1.6 Lichtpool | Lichthof je Wesen als Gauß-Fleck | Kein additives Weißwerden. Mischfarbe per OKLab rechnen, deckend mit weichem Alpha malen. |
| TA5 1.8 | Prädikat-Regel mit Art und Begründung; Leerstelle als eigene Instanz | Regeln und Begründungen nur aus `karte.json`/`fugenraeume.json` mit Quelle. Die 63 Fehlstellen als hohle, helle Stellen in der Membran. |
| Cursor 2.1 | Fünf Andockstellen auf der Körperhaut, Zuwendung zum Gegenüber | **Belegung sichtbar:** Eine belegte Stelle wölbt sich als Zahn aus der Membran, die Größe folgt der Zahl der Fugen dort. Eine leere Stelle bleibt glatt. Radius proportional zur Wesensgröße, nicht fest 22 px. |
| Cursor 2.2 | Art und Lesart einer Fuge als Strichform; „beschrieben“ vs. „eigene Einordnung“ | Aus `typ`, `art` und `geltung` ableiten (Vorschlag in 4.4). Die Bedingung bekommt eine sichtbare Andockstelle. |
| Cursor 2.6 | Wellengleichung als Antwort auf Berührung | Nur, wenn sie etwas bedeutet, etwa eine Ringwelle beim Einrasten. Sonst weglassen. |
| Lichtgrund 3.3 | Gestaffeltes Entfalten am selben Ort `m = smoothstep(wann·0,55, wann·0,55 + 0,45, (E − 0,18)/0,82)`; erst Form, dann Licht | Das E kommt aus dem Zoom und ist die Detailstufe. `wann` kommt aus den Daten (Rang der Belege): Belegte Wesen entfalten sich zuerst. Nur innerhalb der einen Welt (Ralf, Schritt 11). |
| Lichtgrund 3.2 | Reduzierte Bewegung: Übergänge in ≤ 0,1 s oder gerundet, Wind aus | Dasselbe für „Ruhe“ und `prefers-reduced-motion`. |
| Lichtgrund 3.5 | „Erfindet keine Herkunft“: Unbelegtes sichtbar lose | 262 Orte ohne Fuge stehen als gültige Einzelwesen da, ohne Fasern zu anderen. |

### 4.3 Pseudocode

Alle Daten liegen in Float32/Int32-Arrays (SoA). Es gibt keinen Framework-Zustand je Frame und keine Allokation im Frame.

```js
// ── Vorberechnung, einmal ───────────────────────────────────────────
N = orte.length; E = fugen.length
hx,hy = Heimat (orte[i].x, .y)        // feste Datenlage, nie verändert
x,y,vx,vy = Float32Array(N)           // lebendige Lage
reg[i] = orte[i].r; regX,regY,regR aus regionen
phase1[i], phase2[i] = saat(i)        // NUR Bewegungsphase; trägt nichts
ea[e], eb[e] = fugen[e].a, .b
passt[e]   = zaehne(fugen[e])         // Schloss-Probe: bool + Begründung, vorab
inkomm[e]  = istInkommensurabel(fugen[e])   // OFFEN: welche typ/art; siehe 4.4
staerke[e] = kurve(fugen[e].art, fugen[e].quellen.length, fugen[e].anker.length) // offenzulegen
port[e,a], port[e,b] = andockstelle(fugen[e])   // 0..4
zaehne[i][p] = Zahl belegter Fugen an Stelle p   // Membranwölbung
beleg[i] = Summe Quellen der Fugen von i;  wann[i] = rang(beleg)/N   // Entfaltungsfolge
st[e] = RUHEND; g[e] = 0              // Armzustand, Wachstum 0..1

// ── je Frame, O(N + E) ───────────────────────────────────────────────
dt = min(dtFrame, 0.05); ruhe = reducedMotion || zugang.ruhe
if (ruhe) { x=hx; y=hy; /* Arme sofort im Endzustand */ }
gitter.neu(x, y, ZELLE = 2*SEP)        // räumliches Hash-Gitter für Ausweichen

for i in 0..N:
  ax = (hx[i]-x[i]) * K_HEIM;  ay = (hy[i]-y[i]) * K_HEIM   // Heimweh
  ax += WANDER*(sin(t*w1+phase1[i]) + .5*sin(t*w2+phase2[i]))  // glattes Streunen
  ay += WANDER*(cos(t*w1*.9+phase2[i]) + .5*cos(t*w2*1.1+phase1[i]))
  d = dist((x,y),(regX,regY)[reg[i]]);                       // Membran der Region
  if (d > regR*0.92) zieheHinein(i, (d-regR*0.92)*K_RAND)
  for j in gitter.nachbarn(i, SEP): stoßeAb(i, j)             // vorbeiziehen, nicht durchdringen
  vx[i] = vx[i]*exp(-DAEMPF*dt) + ax*dt                        // bildratenunabhängig
  x[i] += vx[i]*dt  (… y analog)

for e in 0..E:                                                 // Begegnung nur entlang Fugen
  d = dist(ea[e], eb[e])
  switch st[e]:
    RUHEND:      if (d < D_BEGEGNUNG)
                   st[e] = passt[e] ? WACHSEND : (inkomm[e] ? NEBENEINANDER : VORBEI)
    WACHSEND:    g[e] = min(1, g[e] + dt/T_WACHS)
                 if (g[e]==1 && d < D_EINRAST) { st[e]=EINGERASTET; welle(e) }
                 if (d > D_RISS) st[e] = LOESEND
    EINGERASTET: zieheZusammen(e, staerke[e])                  // Feder auf Ruhelänge
                 if (d > D_RISS) { st[e]=LOESEND; funken(e) } // beim Wechsel, nicht beim Unmount
    LOESEND:     g[e] = max(0, g[e] - dt/T_LOES); if (g[e]==0) { st[e]=RUHEND; spur[e]++ }
    VORBEI, NEBENEINANDER: if (d > D_RISS) st[e] = RUHEND
// Hysterese wie TA5: D_EINRAST ≈ 0,5·D_BEGEGNUNG, D_RISS = 1,5·D_BEGEGNUNG.
// Startwert-Vorschlag (OFFEN, am Bild prüfen): D_BEGEGNUNG ≈ Fugenlänge-Median 97,
// WANDER so, dass ein Wesen etwa ±40 um seine Heimat streunt (NN-Median 26).

// ── Gemeinsames Phänomen: Zusammenhangskomponenten über EINGERASTET ──
unionFind.reset(); for e with st[e]==EINGERASTET: union(ea[e], eb[e])
for jede Komponente K mit |K| ≥ 2:
  farbe(K)  = oklabMittel({farbe(i), gewicht = r(i)·Σ staerke}) // nie RGB
  groesse(K)= WACHSTUM(K)   // überadditiv, begrenzt; Kurve offenlegen (Hauptauftrag)
  // NEBENEINANDER-Paare zählen nicht in K: die Farben bleiben getrennt sichtbar
```

OKLab-Mischung nach Ottosson (2020), Standardformeln:
```js
lin = c => c<=0.04045 ? c/12.92 : ((c+0.055)/1.055)**2.4
l = cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b)
m = cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b)
s = cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b)
L = 0.2104542553*l+0.7936177850*m-0.0040720468*s
A = 1.9779984951*l-2.4285922050*m+0.4505937099*s
B = 0.0259040371*l+0.7827717662*m-0.8086757660*s
// mischen: gewichtetes Mittel in (L,A,B); zurück mit den inversen Matrizen;
// Chroma behutsam begrenzen, damit die Mischfarbe im sRGB-Raum bleibt.
```

Zeichnen in drei Detailstufen. E kommt aus dem Zoom, das Entfalten folgt Lichtgrund 3.3 mit `wann[i]` aus den Belegen.

```js
m_i = smoothstep(wann[i]*.55, wann[i]*.55+.45, (Ezoom-.18)/.82)
// Welt (m≈0): je Region ein Schwarm. Alle Wesen als Gauß-Korn in eine Viertelauflösungs-
//   Leinwand (Regionfarbe, Alpha), weichgezeichnet → atmende Membran (Skala 1 ± 0,03, 10–25 s).
//   Überlappende Regionen zeigen ihre Schnittfläche als eigene Mischung (OKLab), Grenzen bleiben lesbar.
// Gebiet (0<m<1): Kern + Lichthof (je Regionfarbe EIN vorgerendertes Sprite, drawImage),
//   aktive Arme als quadratische Kurven mit Spannungssprache (TA5 1.5).
// Begegnung (m≈1): Körper mit Membran aus fünf Andockstellen (Zahn = belegt), Fasern = Fugen,
//   Name in der Welt, Beleg-Griff an jeder Faser. Höchstens ~150 Vollkörper gleichzeitig, sonst Stufe 2.
// Nur sichtbare Zellen des Hash-Gitters zeichnen. WebGL: instanzierte Quads, SoA-Puffer,
//   ein Draw je Schicht, 'webglcontextlost' abfangen und auf Canvas2D zurückfallen.
```

### 4.4 Offene Entscheidungen
Diese sind nicht aus den Bausteinen ableitbar; der Hauptauftrag muss sie entscheiden.

1. **Andockstellen-Zuordnung (Vorschlag).** beeinflussen/beeinflusst: `folge`, `uebergang`, `bedingung`. gemeinsam: `zusammenhang`, `aussage`. vergleichen: `annaeherung`, `abstand`, `widerspruch`, `spannung`. unterstützen: `typ` `behandlt`/`reguliert`. **Problem:** `einordnung` (1037) und `offen` (253) würden jede Stelle überfüllen. Sie brauchen eine eigene, leisere Darstellung, etwa als Haut-Textur statt als Zahn.
2. **Inkommensurabel.** Welche `typ`/`art` zählen dazu? Kandidaten mit Zahl: `typ nicht_dasselbe` 14, `abstand` 9, `gegenteil_am_start` 2, `verwechselbar_mit` 2; `art widerspruch` 18, `abstand` 25, `spannung` 2. Nicht entschieden.
3. **Stärke- und Wachstumskurve.** Gewicht je Art, Wirkung von Quellen und Ankern, Sättigung. Alle Parameter oben (`K_HEIM`, `WANDER`, `D_*`, `T_*`) sind Startwerte, am Bild zu prüfen.
4. **Die 189er-Nabe.** Fasern bündeln, sonst wird es ein Igel. TA5 hatte dafür nichts.

### 4.5 Nicht übernehmen
- Distanz als Passung.
- Form, Biegerichtung und Strangzahl aus dem Hash.
- O(n²)-Paarschleifen.
- Framework-Neuaufbau je Frame und Allokation im Frame.
- Bildratenabhängige Dämpfung.
- Additive Farbmischung zu Weiß.
- Festfarben der Arme.
- Effekte ohne Bedeutung, etwa Wellen, die nichts sagen.
- Dunkler Grund mit grauer Kleinschrift.
- Panels über der Szene.
- Morph zwischen verschiedenen Welten.
- Medizinische Begründungstexte ohne Quelle (TA5 `blocks.ts`).
