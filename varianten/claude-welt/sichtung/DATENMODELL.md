# Datenmodell „Lebende Welt“: Begegnung, Verstärkung, Nicht-Mischung

Stand 06.11.2026. Gelesen: `data-readonly/karte.json`, `texte.json`, `fugenraeume.json` im Projekt `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103`, dazu `proben/schloss-schluessel/schloss.js` (Z. 28–43 Farben und Arten, Z. 136–166 `zaehne()`). Nichts davon verändert.
Rechnung: `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-lebende-welt/varianten/claude-welt/sichtung/.tmp/analyse.mjs` (Rollen Z. 36–49, Gewichte Z. 130–158, Cluster Z. 159–169, OKLab Z. 192–210, Startfall Z. 211–246, Fehlstellen Z. 248–258, Varianten und Deckel ab Z. 259). Rohzahlen: `.tmp/ergebnis.json`. Startfall: `startfall.json` im selben Ordner.
Die drei JSON-Dateien sind einzeilig, deshalb verweise ich auf Feldpfade wie `karte.json → fugen[1749]` statt auf Zeilen.

**Der Befund vorweg.** Mit einer ehrlichen Belegregel kann der Startfall „Die Angst vor Verlust ist groß“ nicht wachsen. Keine seiner 4 Fugen und keine der 10 Fugen zweiten Grades trägt eine Verstärkung. Das gilt für alle 64 Fugen der Region „Beziehungen & Borderline“. Es gibt auch keine einzige belegte Fuge zwischen zwei Regionen. Neue Farben aus zwei Gebietsfarben entstehen im Bestand also nirgends durch Verstärkung. Daraus folgen zwei Gestaltungsentscheidungen, beschrieben in Abschnitt 7.

---

## (a) Fugen nach Art, Geltung und Quellenzahl

1831 Fugen, 1797 verschiedene Ortspaare, keine Schleife. 27 Paare haben mehrere Fugen. 55 Fugen tragen `gegen`, also eine Gegenrichtung (38 davon mit `gegenGleich: true`). Quellenzahl ist die Länge von `quellen`; alle 471 verwendeten Schlüssel lassen sich über `texte.json → quellen` auflösen.

| art | Σ | original (0/1/2/3+) | quelle (0/1/2/3+) | redaktionell (0/1/2/3+) | offen (0/1/2/3+) |
|---|---:|---|---|---|---|
| einordnung | 1037 | 300/0/0/0 | 0/271/1/0 | 265/189/5/6 | – |
| offen | 253 | – | 0/58/3/0 | 0/189/0/0 | 3/0/0/0 |
| uebergang | 160 | 159/0/0/0 | – | 1/0/0/0 | – |
| aussage | 148 | – | 0/47/16/3 | 0/15/33/34 | – |
| annaeherung | 86 | 18/0/0/0 | – | 22/45/1/0 | – |
| folge | 67 | 64/0/0/0 | 0/2/0/1 | – | – |
| abstand | 25 | 3/0/0/0 | – | 18/1/1/2 | – |
| bedingung | 19 | 18/0/0/0 | – | 1/0/0/0 | – |
| widerspruch | 18 | – | 0/8/5/3 | 2/0/0/0 | – |
| zusammenhang | 15 | – | 0/11/1/3 | – | – |
| spannung | 2 | – | – | 2/0/0/0 | – |
| begrenzung | 1 | – | 0/0/1/0 | – | – |

Muster: `original` hat nie Quellen an der Fuge, denn die Herkunft ist der Originalgraph. `quelle` hat immer mindestens eine Quelle. `redaktionell` ist gemischt.

**typ × art.** `typ` ist bei 972 Fugen leer. Gefüllt bestimmt er die Art fast immer eindeutig:
- `abstammung` → folge 64, `fundierung` → bedingung 18
- `phase` 38, `kategorie` 31, `erregung` 46, `profil` 39 → einordnung
- `behandlt` 77, `reguliert` 71, `zielzustand` 11 → uebergang
- `described_in` 189 → einordnung, `investigated_in_context_of` 189 → offen
- `co_mentioned_with` 45 und `benannte_naehe` 19 → annaeherung
- `nicht_dasselbe` 14 und `verwechselbar_mit` 2 → abstand
- `gegenteil_am_start` 2 → spannung, `gegenbeispiel` 2 → widerspruch
- `voraussetzung` 1 → bedingung, `kann_strategie_sein_gegen` 1 → uebergang

Die vollständige Tabelle steht in `ergebnis.json → a_typ_art`.

**Wie viele Fugen sind „belegt“?** Das hängt von der Definition ab:

| Definition | Fugen |
|---|---:|
| lose (Auftrag): `quellen > 0` oder `geltung ∈ {original, quelle}` | **1517** |
| nur `quellen > 0` | 955 |
| davon mit `anker` (die Quellen gehören den Orten, nicht der Verbindung) | 98 |
| nur `geltung ∈ {original, quelle}` | 996 |
| weder noch | 314 |
| **streng, wie unten vorgeschlagen (w > 0)** | **1141** (1133 Paare) |

Die lose Definition zählt drei Gruppen mit, die keine Verstärkung tragen dürfen:
- 250 Fugen der Art `offen`. Das sind bibliografische Kontakte, „Befund fehlt“; daraus entstehen die Fehlstellen, siehe Abschnitt (f).
- 16 Widersprüche und 7 Abstände.
- 98 Fugen mit `anker`. Ihr Wortlaut lautet ausdrücklich: „Vorhandene Quellenzuordnung dieses gelesenen Eintrags; kein neuer unabhängiger Beleg für die Querverbindung.“

Außerdem zählen 8 Fugen dasselbe Werk mehrfach. Beispiel `fugen[404]`: 3 Schlüssel, aber nur 1 Studie. Deshalb zählt `q_eff` verschiedene Werke (nach URL oder Titel), nicht Schlüssel.

## (b) Inkommensurabilität: wo sich nichts mischen darf

| Kandidat | n | Geltung | Beispiel |
|---|---:|---|---|
| art widerspruch | 18 | quelle 16, red. 2 | Vorgeburtliche Expositionen ⟷ Familiäre Alternativerklärungen, „verliert Assoziationen unter Familienkontrolle“ |
| art abstand | 25 | red. 22, orig. 3 | Aufgabenstarre ⟷ Delay Aversion, „muss unterschieden werden von“ |
| art spannung | 2 | red. 2 | Aufgabenstarre ⟷ Hyperfokus, „im Original als Gegenpol beschrieben“ |
| art begrenzung | 1 | quelle 1 | Genetische Veranlagung ⟷ Unterschiede trotz ähnlicher Gene, „legt Ausprägung nicht vollständig fest“ |
| typ nicht_dasselbe | 14 | red. 14 | alle mit art abstand |
| typ verwechselbar_mit | 2 | red. 2 | Reizfilterschwäche ⟷ Rejection Sensitive Dysphoria |
| typ gegenteil_am_start | 2 | red. 2 | = spannung |
| typ gegenbeispiel | 2 | red. 2 | Heritabilität ist kein Schicksal ⟷ Extreme frühe Umwelt … |
| Label „muss (begrifflich/diagnostisch) unterschieden werden von“ | 23 | red. 20, orig. 3 | |
| Label „unterscheidet / trennt / getrennt / gegenüber / nebeneinander / auseinander / Unterscheidung“, bei sonst nicht trennender Art | 55 | red. 47, quelle 7, orig. 1 | `fugen[1749]` „unterscheidet Symptomdomäne und Alltagsszene“ (Startfall); `fugen[1658]` „Zeitablauf von Erklärung trennen“ |
| status gegenbefund | 16 | quelle 16 | alle art widerspruch |

**Vereinigung (Rolle „trennend“) = 101 Fugen, 86 Paare.**
- Nach Art: aussage 46, abstand 25, widerspruch 18, einordnung 9, spannung 2, begrenzung 1.
- 49 davon verbinden zwei Regionen. Das sind die einzigen sichtbaren Begegnungen zwischen Gebieten, die eine Bedeutung tragen.

Die Regel deckt sich mit `TRENNEND` in `schloss.js` Z. 33. Erweitert habe ich sie um Typ und Label (`analyse.mjs` Z. 36–49).

Zwei falsche Treffer der ersten Regel habe ich ausgeschlossen. Hauptwörter wie „trägt zu Unterschieden bei“ oder „sagt spätere Unterschiede voraus“ verbinden; sie trennen nicht.

Offen bleibt: Die 4 Fugen mit `typ` verwechselbar_mit oder gegenbeispiel tragen das Label „begrifflich benachbart“. `grund` sagt dazu: „Vorgeschlagen, nicht fachlich geprüft“. Ich werte sie nach ihrer Art als trennend.

**Konflikte.** 4 Paare tragen eine verbindende und eine trennende Fuge zugleich:
- Predictive Processing / Sensorische Verarbeitung
- Double Empathy / Soziale und materielle Passung (2 Aussagen, 3 Widersprüche)
- Gezielte Unterstützung / Planung und flexible Steuerung
- Differential Susceptibility / Heritabilität ist kein Schicksal

Vorschlag: Die trennende Fuge hat Vorrang. Es gibt dann weder Mischung noch Wachstum, aber einen sichtbaren Saum, und beide Fugen sind greifbar.

## (c) Geometrie

**Regionskreise.** 5 der 45 Paare überlappen (Abstand < r1+r2). Keine Region liegt in einer anderen.

| Paar | Abstand | r1+r2 | Tiefe | Tiefe/r_klein | Linse/Fläche_klein |
|---|---:|---:|---:|---:|---:|
| Beziehungswerkstatt ↔ Forschung & Einordnung | 624 | 746 | 122 | 0.44 | 13.4 % |
| TraumaAtlas ↔ Trigger & Kontext | 707 | 803 | 96 | 0.42 | 13.1 % |
| **Beziehungen & Borderline ↔ Forschung & Einordnung** | 595 | 662 | 67 | 0.35 | 10.0 % |
| Phänomenatlas ↔ Forschung & Einordnung | 1234 | 1344 | 110 | 0.24 | 5.4 % |
| TraumaAtlas ↔ Phänomenatlas | 1444 | 1448 | 4 | 0.01 | ≈ 0 |

Lücken am Startgebiet:
- Beziehungen & Borderline ↔ Beziehungswerkstatt: 55 (5 Querfugen)
- ↔ ADHS: 107
- ↔ Diagnose: 241 (4 Querfugen)

Die Geometrie deckt sich nur teilweise mit den Querfugen. 25 Regionspaare haben Querfugen, nur 5 davon überlappen. Forschung ↔ Neuroatlas hat zum Beispiel 14 Querfugen ohne Überlappung. Für die Welt heißt das: Überlappung sollte aus den Querfugen wachsen, etwa als Ausläufer oder Membranbrücke, und nicht nur aus den gegebenen Kreisen.

**Orte.** Kein Ort liegt außerhalb seines Regionskreises; der größte Abstand ist 0,97 r (Phänomenatlas).

10 Orte liegen zusätzlich in einem fremden Kreis:
- 7 Orte der Beziehungswerkstatt im Kreis von Forschung, darunter 561 „Nähe, Freiheit und Grenzen“
- 1051 „Was kostet das scheinbare Gelingen?“ (Beziehungen & Borderline) im Kreis von Forschung
- 1166 (Trigger) im TraumaAtlas
- 1200 (Forschung) in der Beziehungswerkstatt

Die Felder `regionen[].count` stimmen mit den Orten überein. Die Felder `regionen[].links` stimmen in allen 50 Einträgen genau mit den Querfugen überein.

| Region | Orte | r | Dichte /10⁴ | Median-Abstand / r |
|---|---:|---:|---:|---:|
| Phänomenatlas | 552 | 876 | 2.29 | 0.21 |
| Neuroatlas | 258 | 383 | 5.60 | 0.41 |
| TraumaAtlas | 168 | 572 | 1.63 | 0.21 |
| Diagnose & Differenzierung | 113 | 504 | 1.42 | 0.32 |
| Forschung & Einordnung | 52 | 468 | 0.76 | 0.68 |
| **Beziehungen & Borderline** | 28 | 194 | 2.37 | 0.42 |
| Beziehungswerkstatt | 21 | 278 | 0.87 | 0.64 |
| Dynamikraum | 14 | 229 | 0.85 | 0.38 |
| ADHS · Randphänomene | 12 | 103 | 3.60 | 0.47 |
| Trigger & Kontext | 8 | 231 | 0.48 | 0.28 |

Kartenausdehnung: x −1142…1553, y −1390…1434.

**Ortsgrade.**
- Mittel 2,99.
- Verteilung: 0 → 262, 1 → 333, 2 → 111, 3 → 207, 4 → 97, 5–9 → 149, 10–19 → 60, ≥ 20 → 7.

262 Orte haben keine einzige Fuge:
- Neuroatlas, Methoden: 97
- Diagnose & Differenzierung: 82 Phänomene und 14 Befunde
- weitere Kapitel, Pfade, Instrumente und Übungen

Diese Orte können sich bewegen, aber nie verstärken.

Top 20 nach Grad:
1. ADHS / attention-deficit… (Phänomenatlas, context): **189**. Das ist der Forschungsknoten und zugleich die größte Fehlstelle.
2. Sympathikus (Kampf & Flucht): 31
3. PDA-Profil: 31
4. Bipolare Störungsbilder: 25
5. Dorsaler Vagus: 23
6. PTBS: 22
7. Depressive Störungsbilder: 22
8. ME/CFS: 19
9. Körper & Schlaf: 18
10. Autismus-Spektrum: 18
11. Phänomenatlas-Domänen (Aktivierung …, Emotion …, Sensorik …, Schlaf …, Soziale Erfahrung …): je 18
12. Gezielte Unterstützung: 17
13. Belastung & Stressreaktionen: 17
14. Aufmerksamkeit …: 17
15. Impulsivität …: 17
16. Autistische Merkmale: 16

Die vollständige Liste steht in `ergebnis.json → c_top20`.

**Komponenten.** 271 insgesamt: eine Riesenkomponente mit 945 Orten, 262 Einzelne, 8 kleine Komponenten (2–3 Orte).

**Fugen zwischen Regionen.** 124 von 1831 (6,8 %).
- Nach Art: aussage 79, offen 18, einordnung 14, abstand 9, annaeherung 4.
- Häufigste Paare: Forschung ↔ Phänomenatlas 18, Forschung ↔ Neuroatlas 14, Forschung ↔ TraumaAtlas 11, Forschung ↔ Diagnose 11, Phänomen ↔ Trauma 10, **Beziehungen & Borderline ↔ Forschung 9**, Werkstatt ↔ Forschung 8.
- Im strengen Modell ist davon **keine** belegt, 49 sind trennend. Lässt man Ankerquellen zu (Variante V1/V2), werden 49 Querfugen schwach belegt, darunter 4 von Beziehungen & Borderline zur Werkstatt (w 0,12–0,18).

## (d) Startfall: Ort 1031 „Die Angst vor Verlust ist groß“

Region 6 „Beziehungen & Borderline“, k phenomenon, Grad 4, Position (−131.6, −241), Tag „Nähe & Abstand“. Die Herkunft des Texts ist „Borderline verstehen · Beziehungskarte“, **ohne eigene Quelle** (`texte.json → orte[1031].quellen = []`).

Kurztext (`s`): „Die Angst ist als Erleben ernst zu nehmen. Sie beweist nicht, dass eine Trennung bevorsteht, und verpflichtet das Gegenüber nicht zu unbegrenzter Rückversicherung.“ Der Volltext (Alltag, Beobachtung, Deutung, Fragen, Spielraum) steht vollständig in `startfall.json → zentrum.text`.

**Fugen erster Ordnung (vollständiger Wortlaut):**

1. **`fugen[1657]` 1030 „Eine Antwort bleibt aus“ → 1031.** art einordnung, geltung redaktionell, 0 Quellen. Herkunft: „Vorhandene Beziehungskarte · redaktionelle Lesebeziehung“.
   - Label: „Eine mögliche Bedeutung des Wartens“
   - Detail: „Eine unbeantwortete Nachricht kann in einer erfundenen Situation als drohender Verlust erlebt werden. Der Zeitablauf beweist diese Bedeutung nicht.“
   - Grenze: „Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.“
   - Rolle verbindend, **w = 0** (kein Beleg).
2. **`fugen[1659]` 1031 → 1032 „Wenn Nähe zur Verpflichtung wird“.** einordnung, redaktionell, 0 Quellen, gleiche Herkunft.
   - Label: „Wenn Beruhigung eingefordert wird“
   - Detail: „Aus eigener Angst kann eine Forderung nach Kontakt entstehen. Die Angst begründet keinen Anspruch auf Verfügbarkeit.“
   - Grenze: wie 1.
   - **w = 0.**
3. **`fugen[1660]` 1031 → 1034 „Auch meine Grenze gilt“.** einordnung, redaktionell, 0 Quellen.
   - Label: „Bedürfnis trifft begrenzte Verfügbarkeit“
   - Detail: „Ein starkes Bedürfnis und die Grenze des Gegenübers dürfen zugleich ernst genommen werden.“
   - Grenze: wie 1.
   - **w = 0.**
4. **`fugen[1749]` 1053 „Verlassenheitsangst und Vermeidungsbemühungen“ (Region Diagnose & Differenzierung) → 1031.** art aussage, geltung redaktionell, status redaktionelle-zuordnung. Herkunft: „Redaktionelle Verbindung vorhandener Atlasinhalte“.
   - Label: „unterscheidet Symptomdomäne und Alltagsszene“
   - Detail: „Das Dossier bezeichnet Verlassenheitsangst als klinische Symptomdomäne. Die fiktive Abschiedsszene zeigt dagegen nur einen Satz, berichtete Angst und einen Kontaktwunsch. Nebeneinander wird sichtbar, wie viel mehr als eine einzelne Episode eine diagnostische Beurteilung benötigt.“
   - Grenze: „Die Szene belegt weder einen Bindungstyp noch Borderline. Ein klassifikatorischer Bezug ist kein Ursachenbeleg und keine Diagnose einer in einer Szene beschriebenen Person.“
   - Quellen: *Borderline Personality Disorder – NIMH* (https://www.nimh.nih.gov/health/publications/borderline-personality-disorder) und *S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022* (https://register.awmf.org/de/leitlinien/detail/038-015).
   - Anker auf Ort 1053 mit dem Satz „kein neuer unabhängiger Beleg für die Querverbindung“.
   - Rolle **trennend** (Label), w = 0. Es ist die einzige quellentragende Fuge des Startorts, und sie sagt ausdrücklich: nicht dasselbe.

**Nachbarn ersten Grades** (Kurztexte in `startfall.json → nachbarn_1`):
- 1030 Eine Antwort bleibt aus (Grad 3)
- 1032 Wenn Nähe zur Verpflichtung wird (3)
- 1034 Auch meine Grenze gilt (7; Textquelle „Family Connections · Unterstützung für Angehörige“)
- 1053 Verlassenheitsangst und Vermeidungsbemühungen (Diagnose, Grad 1; Textquellen NIMH und AWMF S3)

**Zweiter Grad: 10 Fugen zu 10 weiteren Orten.**
- 7 Orte in Beziehungen & Borderline: 1041, 1039, 1040, 1044, 1051, 1035, 1038
- 561 „Nähe, Freiheit und Grenzen“ (Beziehungswerkstatt)
- 1194 „Schutz braucht einen passenden nächsten Schritt“ und 1223 „Schutz hängt nicht an einem Grenzwert“ (beide Forschung & Einordnung)

Sieben der Fugen sind redaktionelle Einordnungen ohne Quelle. Eine davon ist trennend: `1658` „Zeitablauf von Erklärung trennen“.

Drei tragen Quellen, alle von 1034 aus und alle mit 2 Ankern, also Ortsquellen:
- `1745` → 561: „verbindet Nähe mit freiwilliger Verfügbarkeit“ (verbindend)
- `1781` 1194 →: „unterscheidet persönliche Zusage und technischen Schutzplan“ (trennend)
- `1826` 1223 →: „verbindet Grenzen mit Handlungsspielraum“ (verbindend)

Den vollen Wortlaut mit aufgelösten Quellen enthält `startfall.json → fugen_2`.

**Ergebnis.**

| Cluster | Orte | W streng | Flächenfaktor |
|---|---:|---:|---:|
| erster Grad | 5 | 0 | 1,00 |
| zweiter Grad | 15 | 0 | 1,00 |
| ganze Region 6 (64 Fugen: 42 intern, 22 nach außen; 46 verbindend, 18 trennend) | 28 | 0 | 1,00 |

Ließe man Ankerquellen zu, entstünde nur am Rand eine schwache Verstärkung:
- V1 (Anker halb): W = 0,24 → ×1,04
- V2 (Anker voll): W = 0,36 → ×1,06

Beide Male wirken nur 1745 und 1826 (Grenze ⟷ Nähe/Schutz). Das Zentrum bleibt in jeder Variante bei W = 0.

Die nächsten belegten Orte liegen über 800 Kartenpunkte entfernt in Forschung & Einordnung (w 0,085). Nach Stärke folgen „Dissoziative Störungsbilder“ und „Scham oder Schuld“ im Neuroatlas, 1190–1210 entfernt (w 0,12).

## (e) Wachstumskurve

### Gewicht einer Fuge

`w(f) = basis(art) · g(geltung) · (1 − e^(−q_eff/1.5))`. Das Gewicht ist 0, wenn die Rolle trennend oder offen ist. Umgesetzt in `analyse.mjs` Z. 130–158.

- `basis`: zusammenhang 1,0 · aussage 0,7 · folge 0,6 (aber 0,3 bei typ abstammung, also Herkunft von Schulen) · annaeherung 0,6 · uebergang 0,5 · bedingung 0,45 · einordnung 0,25.
  - Begründung: Eine belegte Assoziation trägt am stärksten. Eine benannte Nähe oder eine Modellphase trägt mittel. Zugehörigkeit zu einer Kategorie ist kaum eine Verstärkung, sondern eher eine Verschachtelung.
  - Das entspricht `NESTEND` und `lesartGreift` in `schloss.js` Z. 29–32.
- `g`: quelle 1,0 · original 0,7 · redaktionell 0,35 · offen 0.
- `q_eff`: Zahl der verschiedenen Werke. Bei Fugen mit `anker` ist sie 0. Für `original` ohne Quelle gilt sie als 1, weil der Originalgraph als dokumentierte Herkunft zählt.
- Sättigung: k = 1,5 ergibt bei 1 / 2 / 3 / 5 Werken die Faktoren 0,49 / 0,74 / 0,86 / 0,96. Ein zweites Werk zählt also deutlich, ab dem vierten kaum noch.

Belegt im strengen Sinn sind **1141 Fugen**:
- nach Geltung: original 558, quelle 349, redaktionell 234
- nach Art: einordnung 760, uebergang 159, folge 67, annaeherung 63, aussage 59, bedingung 18, zusammenhang 15

Verteilung der Gewichte: < 0,1: 488 · 0,1–0,2: 558 · 0,2–0,4: 66 · 0,4–0,6: 24 · ≥ 0,6: 5. Belegte Fugen finden sich nur an 749 Orten, nämlich in TraumaAtlas 156, Phänomenatlas 430, Neuroatlas 159 und Forschung 4.

### Größe eines Begegnungsclusters

Grundlage ist die Fläche, nicht der Radius:

`A = Σ r_i² · (1 + Gmax_eff · (1 − e^(−W/c)))`

- `W = Σ über Paare (1 − Π(1 − w_f))`. Mehrere Fugen eines Paares werden per Noisy-Or verbunden; ein Paar trägt so höchstens 1 bei.
- `Gmax_eff = Gmax · max g`, wobei max g die höchste Geltung der beitragenden Fugen ist. Das ist der Qualitätsdeckel.
- Parameter: **Gmax = 1, c = 2.**

Begründung:
- **Fläche statt Radius.** Würde man zwei gleich große Wesen zu einem Körper mit dem Radius Σr verschmelzen, hätte er schon ohne jede Fuge die doppelte Fläche. Das wäre ein erfundenes Wachstum. „Summe der Teile“ heißt deshalb Summe der Flächen.
- **Gmax = 1.** Ein Cluster wird höchstens doppelt so groß wie seine Teile. Das ist sichtbar mehr als die Summe, bleibt aber begrenzt.
- **c = 2.** Die stärkste Einzelfuge im Bestand (`fugen[396]` Genetische Veranlagung ⟷ Autistische Merkmale, zusammenhang, 3 Studien, w = 0,86) ergibt ×1,35. Ein Paar allein soll nie in die Sättigung kommen.
- **Überadditiv.** Bei dichter Verbindung wächst W mit der Zahl der Paare, also ungefähr quadratisch mit der Zahl der Mitglieder, und erst dann sättigt die Kurve. Das trifft „es potenziert sich, wenn mehrere zusammenkommen“.
- **Qualitätsdeckel.** Er verhindert, dass viele schwache Modellkanten so stark wirken wie Studien. Ohne Deckel käme Sympathikus mit 32 Orten und nur Originalkanten auf ×1,98, mit Deckel auf ×1,69.

So sieht die Kurve aus (W → Flächenfaktor bei Gmax_eff = 1): 0 → 1,00 · 0,25 → 1,12 · 0,5 → 1,22 · 1 → 1,39 · 2 → 1,63 · 3 → 1,78 · 4 → 1,87 · 6 → 1,95 · 8 → 1,98.

### Durchgerechnet mit echten Daten

| Cluster | Orte | W | Faktor |
|---|---:|---:|---:|
| Startfall, erster und zweiter Grad (streng) | 5 / 15 | 0 | 1,00 |
| Stärkste Einzelfuge (396) | 2 | 0,86 | 1,35 |
| Dreieck Genetische Veranlagung · Unterschiedliche Entwicklungswege · Autistische Merkmale | 3 | 2,09 | 1,65 |
| Dreieck Schlaf und Tagesfunktion · Gezielte Unterstützung · Emotionsregulation | 3 | 1,42 | 1,51 |
| Dreieck ADHS · Konzentration bricht ab · Leicht abgelenkt (Neuroatlas, original) | 3 | 0,45 | 1,20 |
| Ego Autistische Merkmale | 12 | 6,02 | 1,95 |
| Ego Bipolare Störungsbilder | 26 | 3,65 | 1,84 |
| Ego Sympathikus (nur original, gedeckelt) | 32 | 7,75 | 1,69 |

Insgesamt gibt es 114 belegte Dreiecke.

Die Ego-Cluster sind obere Schranken. In der Welt sollte eine Begegnung lokal bleiben, also aus 2 bis 6 Wesen innerhalb eines Begegnungsradius bestehen.

### Kontrollen

- **Ohne Fuge** (1031 und 1026, kein Paar im Bestand): W = 0, Faktor 1,00. Die Wesen ziehen aneinander vorbei, keine Mischung.
- **Trennende Fuge:** w = 0 und Veto für das Paar (86 Paare). Der Mischgrad ist 0, die Farben bleiben nebeneinander. Geprüft am Startfall 1031 ⟷ 1053: `trennPaare = 1`, W = 0.
- **Offene Fuge** (bibliografisch): w = 0.

### Farbe

Gemischt wird in OKLab, gewichtet mit Fläche und Mischgrad m = 1 − e^(−W/c). Jedes Wesen behält am Rand seine Grundfarbe; nur der gemeinsame Kern trägt die Mischung.

Beispiele mit den `tief`-Werten aus `schloss.js` Z. 35–43:

| Farben | OKLab-Mitte | naive RGB-Mitte |
|---|---|---|
| pflaume `#9a3a74` + ocker `#a86a12` | `#a15553` | `#a15243` |
| pflaume + petrol `#1f6f86` | `#6f5a7d` | `#5d557d` (dunkler, „schmutzig“) |
| minze + koralle | `#8e7651` | `#756f4d` |

Für pflaume und petrol ist diese Mitte im Startfall gerade **verboten**, weil die Fuge 1749 trennend ist.

Lücke: Für TraumaAtlas, Dynamikraum und Trigger & Kontext gibt es in `schloss.js` keine eigene Farbe; sie fallen auf schiefer, die Farbe von Forschung, zurück. Für stabile Gebietsfarben braucht es 3 neue Farbtöne. Das ist offen.

## (f) Fehlstellen in `fugenraeume.json`

63 Fehlstellen:
- 62 vom Modus `befund-fehlt`: Originalkanten „untersucht in / im Kontext von“, für die kein Befund festgehalten ist.
- 1 vom Modus `nicht-erreichbar`: das Fundus-Kapitel `12-luftschadstoffe-studienvergleich.md` „Luftschadstoffe: Vergleich zweier vorhandener Studien“, ohne eigenen Ort.

Wo die 62 liegen:
- Nach Region: Phänomenatlas 45, TraumaAtlas 9, Beziehungswerkstatt 6, Neuroatlas 2, **Beziehungen & Borderline 0**.
- Nach Ortsart: concept 44, perspective 6, model 4, je 2 context, phenomenon und practice, je 1 dimension und domain.
- Nach Zahl der Ränder: 60 Fehlstellen mit 1 Rand, „Neurowissenschaften“ (204) mit 4, „ADHS / attention-deficit…“ (1009) mit **189** Rändern. Das sind alle 189 `investigated_in_context_of`-Fugen.
- Alle Ränder haben die art offen. Die Gegenüber liegen zu 250 im Phänomenatlas und zu 3 in Forschung.

Für die Welt sind das Lichtungen ohne Befund: sichtbare Kontakte, die nicht wachsen dürfen.

## 7. Folgen für die Gestaltung (Vorschlag, nicht entschieden)

1. **Der Startfall zeigt Begegnung ohne Verstärkung.** Die Angst vor Verlust zieht an „Eine Antwort bleibt aus“, „Wenn Nähe zur Verpflichtung wird“ und „Auch meine Grenze gilt“ entlang. Die Begegnungen sind sichtbar als Lesebrücke, aber ohne Wachstum, weil sie redaktionell und ohne Quelle sind. An „Verlassenheitsangst und Vermeidungsbemühungen“ (Diagnose, petrol) liegt eine **inkommensurable Naht**: pflaume neben petrol, ohne Mischung, mit einem Griff zu NIMH und AWMF S3.

   Das ist die belegte Aussage des Bestands: Eine Alltagsszene ist nicht die Symptomdomäne.

   Für die Szene mit sichtbarem Wachstum eignet sich das Dreieck Genetische Veranlagung · Unterschiedliche Entwicklungswege · Autistische Merkmale (×1,65, quellenbelegt). Es liegt aber im Phänomenatlas und nicht im Startgebiet. Wenn es näher sein soll, kommen „Dissoziative Störungsbilder“ oder „Scham oder Schuld“ im Neuroatlas in Frage. Sie haben je 6 Orte und eine Einordnung mit Quelle (w 0,12 je Paar) und erreichen ×1,26 bzw. ×1,25.
2. **Eine neue Farbe zwischen Gebieten entsteht im strengen Modell nirgends**, denn es gibt keine einzige belegte Querfuge. Damit „jedes Phänomen strahlt seine eigene Farbe“ trotzdem gilt, braucht jedes Wesen einen eigenen, stabilen Farbton innerhalb des Farbbands seines Gebiets, zum Beispiel ±25° Farbton in OKLCh, fest aus Ortsart und Position abgeleitet. Dann ergeben Begegnungen innerhalb eines Gebiets eine sichtbar neue Mischfarbe, und Gebietsgrenzen bleiben ehrlich.
3. **Lockert man die Anker-Regel** (V1), entstehen 49 schwache Querverbindungen. Darüber muss Ralf entscheiden; der Bestand selbst sagt bei diesen Fugen „kein unabhängiger Beleg“.
4. **Die 262 Orte ohne Fuge** (vor allem Methoden und Diagnose-Phänomene) und die 185 Quellen-Orte (k source) sollten anders erscheinen als Lebewesen, die sich begegnen können. Das ist offen.

Nicht gesehen oder nicht geprüft: die Medien (`medien.json`), der Atlas-Code außer der genannten Stelle und alle Bilder. Fachlich bewertet habe ich keine Fuge; alle Rollen sind aus Feldern und Wortlaut abgeleitet.
