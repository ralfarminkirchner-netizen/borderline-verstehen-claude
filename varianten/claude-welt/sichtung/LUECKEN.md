# Lücken vor der Design-Leinwand „Lebende Welt“

Stand 06.11.2026. Diese Datei prüft die Sichtung auf Vollständigkeit. Gelesen habe ich den Auftrag `PROMPT-LEBENDE-WELT.md` und alle sechs Sichtungsdateien in diesem Ordner. Gegen die Quellen geprüft habe ich mit eigenen Node-Abfragen auf `data-readonly/karte.json`, `texte.json`, `medien.json`, `app/atlas/atlas-media.json`, `atlas-collection.json` und `atlas-selection.mjs` sowie mit `sed` auf `schloss.js`, `app/server.mjs`, history-02 `atlas-world-renderer.mjs` und TA5 `world.ts`. Ich habe nichts verändert und keine Bilder erzeugt. Volume vor dem Schreiben geprüft (UUID A03B10FD-5F22-4366-A71C-2D95AC701BD2).

Abkürzungen:
- `P` = `/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103`
- `S` = dieser Ordner `…/varianten/claude-welt/sichtung/`

---

## 1 · Stichproben gegen die Quelle

### 1.1 DATENMODELL: Startfall, Überlappung, keine belegte Querfuge. Bestätigt, mit einer Randfrage

- `karte.fugen[1657]`, `[1659]` und `[1660]`: einordnung, redaktionell, 0 Quellen, 0 Anker. Die Labels stimmen wörtlich.
- `karte.fugen[1749]`: 1053 → 1031, aussage, redaktionell, 2 Quellen, 1 Anker, Label „unterscheidet Symptomdomäne und Alltagsszene“.
- `texte.orte[1031].quellen = []`. Grad 4, Position (−131.6, −241), Region 6 mit 28 Orten.
- Es überlappen genau 5 von 45 Regionskreisen. Beziehungen & Borderline ↔ Forschung & Einordnung: Abstand 595 bei r1+r2 = 662, wie angegeben.
- **Keine belegte Querfuge.** Von den 124 Querfugen hat keine Quellen ohne Anker, die nicht die Art `offen` trägt. Vier Querfugen haben die Geltung `original`: 1700, 1703 und 1707 (Art abstand) sowie 1699 (einordnung, „vertieft die Unterscheidung“). 1699 wird nur über das Label als trennend gewertet (`S/.tmp/analyse.mjs` Z. 38, Muster `Unterscheidung`). Ob „vertieft die Unterscheidung“ wirklich trennt oder eine verbindende Einordnung ist, bleibt eine Lesefrage. Ohne diese Wertung gäbe es genau **eine** schwach belegte Querfuge (Forschung ↔ Phänomenatlas, w ≈ 0,25·0,7·0,49 ≈ 0,09, nach meiner Rechnung mit der Formel aus DATENMODELL (e)).

### 1.2 MEDIENLISTE: Porträts, Gebietswiderspruch, Konflikt-Ort. Bestätigt, aber unvollständig

- Für alle 7 Marmorporträts gilt `atlas-media.json → relatedEntryIds` = `relationship-original:mensch-rolle`, `relationship-original:andere-innenwelt` und `dimension:memory`. Über `atlas-collection.json → entries` entspricht das den Orten #1039, #1042 und #264. Die Titel stimmen mit `karte.orte` überein, die Regionen sind 6, 6 und 2. `medien.json[22].eintraege = [1039, 1042, 264]`.
- `atlas-selection.mjs` Z. 36–42: Für die Porträts steht dort nur „Phänomenatlas, Beziehungswerkstatt“. Der Widerspruch ist also echt.
- Der Ort #1168 hat 0 Fugen, Region 8.
- Der Weg #1031 → #1032 → #1039 ist echt: Die zweite Fuge ist `karte.fugen[1661]`, einordnung, redaktionell, 0 Quellen, „Die Rolle verpflichtet nicht zu allem“.
- **Auslassung:** `atlas-selection.mjs` ordnet drei weitere Medien ausdrücklich dem Startgebiet zu:
  - Z. 19: `sgw-biopsychosocial-video`. Laut `atlas-supplement.json → germanMedia` ist das ein **YouTube-Video** der Stiftung Gesundheitswissen, „Was ist das biopsychosoziale Modell?“.
  - Z. 22: `lmu-bpd-information`.
  - Z. 26: `konstanz-safety-plan`.

  Die MEDIENLISTE nennt diese Einträge in §3 nur pauschal als „externe Medien“. In §9 fehlen sie, obwohl sie die einzigen Bewegtmedien bzw. Fachmedien mit dem Gebiet „Beziehungen & Borderline“ sind. Was `lmu-bpd-information` und `konstanz-safety-plan` sind (Format, Herkunft), habe ich nicht nachgesehen; das ist **offen**. Ein YouTube-Einbau wäre ein Drittanbieter-Zugriff und braucht eine eigene Entscheidung.

### 1.3 SCHLOSS-ZUGANG-SERVER: Regel, Farben, Server. Bestätigt, mit einer Zeilenpräzisierung

- `zaehne()` steht in `P/proben/schloss-schluessel/schloss.js` Z. 146–166, wörtlich wie zitiert. Die Hilfsdefinitionen stehen in Z. 25–33.
- Die Farben stehen in Z. 34–44: Die Zuordnung Region → Farbname ist Z. 34, die Paletten sind Z. 35–43, der Rückfall auf schiefer ist Z. 44. Gemeint ist also „34–44“, nicht „34–45“; Z. 45 ist `farbe(ort)`. Für TraumaAtlas, Dynamikraum und Trigger & Kontext gibt es keinen Eintrag, das ist bestätigt.
- `P/app/server.mjs` hat 67 Zeilen. Z. 13 ist die Positivliste, Z. 24 `MEDIEN_QUELLE`, Z. 25 `SCHUTZ`, Z. 32 die 302, Z. 58–62 der `/schloss`-Zweig, Z. 63–66 der Rückfall in den Atlas, Z. 67 Port und Host. Alles bestätigt.

### 1.4 Zusätzlich geprüft

- VORLAEUFER-A: history-02 `atlas-world-renderer.mjs` Z. 36–63, drei Lagen (Z. 39) und `scallop` in Z. 43. Bestätigt.
- TECHNIK-BAUSTEINE: TA5 `src/ocean/world.ts` Z. 446–473, Stufen 0,95 / 0,6 / 0,5 / −0,5. Bestätigt.

### 1.5 Fehler gefunden

1. **Chromium fehlt.** Die Arbeitsanweisung sagt, Chromium liege in `P/.cache/pw-browsers`. Dort liegt aber nur `ffmpeg-1011` (`ls`, 06.11.2026). SCHLOSS-ZUGANG-SERVER Z. 4 sagt das richtig. Die vorhandenen Aufnahmen liefen mit dem installierten Chrome (`S/.tmp/vb-shots.cjs` Z. 34: `executablePath: '/Applications/Google Chrome.app/…'`). Für die Leinwandbilder und die spätere Prüfung muss diese Startart verwendet werden.
2. **„Belegt“ hat drei Bedeutungen.**
   - MEDIENLISTE §8 und die Kernzusammenfassung nennen #1030, #1032 und #1034 „belegte Nachbarn“, obwohl ihre Fugen 0 Quellen haben.
   - SCHLOSS §0.2 nennt Fuge 1749 „belegt“. Laut `anker` belegen ihre Quellen aber Ort 1053, nicht die Verbindung.
   - DATENMODELL wertet streng, dort ist w = 0.

   Vor der Leinwand braucht es **ein** Wort für jeden Zustand: verbunden ohne Beleg, Ortsquelle ohne Verbindungsbeleg, belegt. Sonst steht auf dem Bild „belegt“ an einer Stelle, die nichts belegt.
3. **Zeilenangabe Farben:** „34–45“ statt „34–44“ (siehe 1.3). Das ist geringfügig.

---

## 2 · Was für die Leinwand mit echten Daten noch fehlt

Ich ordne nach den vier geforderten Bildern. **B** heißt: blockiert, das Bild lässt sich ohne Entscheidung nicht ehrlich zeichnen. **E** heißt: eine Entscheidung durch Ralf. **A** heißt: Arbeit, die ohne Entscheidung machbar ist.

### 2.1 Weltkarte (Maßstab 1)

| Lücke | Art | Befund |
|---|---|---|
| Farben für 3 von 10 Regionen | B/E | TraumaAtlas (168 Orte), Dynamikraum (14) und Trigger & Kontext (8) fallen in `schloss.js` Z. 44 auf schiefer zurück, also auf dieselbe Farbe wie Forschung. TraumaAtlas grenzt an Trigger, und beide überlappen geometrisch (Abstand 707 bei r1+r2 = 803). Drei neue, stabile Farbtöne fehlen. Sie müssen in OKLCh Abstand zu den sieben vorhandenen halten. |
| Farbwelt `/` gegen `/welt/` | E | Der Atlas unter `/` färbt nach 8 Richtungen aus Wortmustern (`knowledge-landscape.mjs` Z. 9–16), die Welt nach 10 Regionen. Für denselben Ort entstehen dann zwei Farben im selben Atlas. „Stabile Farben“ ist nicht entschieden: stabil innerhalb der Welt oder atlasweit? |
| Grundgröße eines Wesens | E | `karte.orte[i].n` ist **genau der Grad**; das habe ich an allen 1226 Orten geprüft. Folgt die Größe dem Grad, wird die Nabe mit 189 Fugen riesig, und zwar ohne Beleg (alle 189 Fugen sind `offen`). Das wäre eine erfundene Verstärkung. `S/.tmp/analyse.mjs` Z. 168 rechnet mit gleich großen Wesen (√n). Für die Leinwand braucht es eine feste Regel, zum Beispiel eine einheitliche Größe, die nur nach Ortsart (`k`) leicht abgestuft ist. |
| Ortsarten | E | Von 1226 Orten sind 185 Quellen-Orte (`k: source`), 134 Methoden, 81 Kapitel und 510 Phänomene; dazu kommen 262 Orte ohne Fuge. Ob Quellen und Methoden als Lebewesen wandern oder als Grund bzw. Saat liegen, ist offen (DATENMODELL §7.4). Auf der Weltkarte entscheidet das, was atmet. |
| 189er-Nabe | A | Sie braucht eine Bündelung (TECHNIK 4.4.4). Für die Weltkarte genügt es, sie als eine Lichtung ohne Befund zu zeigen (`fugenraeume.json`: 189 Ränder, `befund-fehlt`). |
| Beschriftungsdichte | A | Vorbild ist `living-network.mjs` mit 12, 28, 52 und 84 Beschriftungen und Kollisionsprüfung (VORLAEUFER-A §5). Für die Weltkarte werden nur Regionsnamen gebraucht; die 10 Namen liegen in `karte.regionen[].name`. |

### 2.2 Gebiet mit Überlappung (Maßstab 2: Beziehungen & Borderline)

| Lücke | Art | Befund |
|---|---|---|
| Die Überlappung ist fast leer | B | In der Linse Beziehungen & Borderline ∩ Forschung & Einordnung liegt **genau ein Ort**: #1051 „Was kostet das scheinbare Gelingen?“ aus Region 6. Kein Forschungsort liegt in der Linse. Die Forschungspartner #1194 und #1223 liegen außerhalb des Kreises von Beziehungen & Borderline, 260 bzw. 224 von #1034 entfernt. Die Fugen dorthin sind trennend (1781) bzw. nur über Anker belegt (1826, w = 0 im strengen Modell). Das Bild zeigt also eine Linse, in der sich nichts mischt. Das ist ehrlich, aber Ralf muss wissen, dass die geforderte „Überlappung mit Verstärkung“ im Startgebiet nicht vorkommt. |
| Querbegegnungen sind physikalisch unmöglich | B | Alle 124 Querfugen sind mindestens 223 lang, im Median 831. Fugen innerhalb einer Region haben einen Median von 93, in Beziehungen & Borderline 78 (höchstens 134). TECHNIK 4.3 schlägt D_BEGEGNUNG ≈ 97 und ein Streunen von etwa ±40 vor. Damit kann sich **kein einziges Ortspaar über eine Regionsgrenze je begegnen**. Das gilt auch für die Startnaht #1031 ↔ #1053: Der Abstand ist 495, und Region 7 überlappt nicht mit Region 6 (Lücke 241). Es braucht eine Entscheidung. Möglich sind Ausläufer entlang der Fuge (das Wesen streckt einen Arm über die Grenze), Wanderzüge zum Partner oder eine feste Naht ohne Bewegung. Ohne diese Entscheidung bleiben Inkommensurabilität und Überlappung im Bild Behauptungen. |
| Zahl der Gebietsorte, Kurztexte, Positionen | A | vollständig vorhanden: 28 Orte, Indizes 1025–1052, `karte.orte[].s` |
| Echter Vorbeizug ohne Fuge | A, Vorschlag | #1039 „Ich bin mehr als die Rolle, in der du mich siehst“ liegt nur 38 von #1031 entfernt und hat **keine** direkte Fuge zu ihm. Er ist der natürliche Fall für „ziehen aneinander vorbei“ im Startbild, besser als das Kontrollpaar 1031/1026 in DATENMODELL. |

### 2.3 Begegnung mit OKLab-Mischung und Wachstum (Maßstab 3)

| Lücke | Art | Befund |
|---|---|---|
| Startfall kann nicht wachsen | B/E | Bestätigt: W = 0 für den ganzen Startfall. Für ein Wachstumsbild muss Ralf einen anderen Ort zulassen. |
| Das Ersatzdreieck erzeugt keine neue Farbe | B/E | Genetische Veranlagung (#151), Unterschiedliche Entwicklungswege (#158) und Autistische Merkmale (#169) liegen **alle drei im Phänomenatlas** (koralle). Eine OKLab-Mischung gleicher Farben ergibt dieselbe Farbe. Die „neue Farbe“ entsteht dort nur, wenn jedes Wesen einen eigenen festen Farbton bekommt (DATENMODELL §7.2). Diese Entscheidung ist **Voraussetzung** für das Bild, nicht bloß eine Option. Ohne sie kann die Leinwand Mischung nur innerhalb einer Farbfamilie zeigen. Die Regel für den eigenen Farbton fehlt ebenfalls: Aus welchem Datenfeld kommt die Verschiebung? Der Hash der Kennung ist verboten. |
| `zaehne()` und Gewichtskurve widersprechen sich genau hier | B | Der Auftrag sagt: `zaehne()` entscheidet das Einrasten. TECHNIK 4.2 und 4.3 übernehmen das wörtlich (`passt[e] = zaehne(fugen[e])`). Im Ersatzdreieck hat aber **keine** der 6 Fugen eine `grenze` (396, 399, 401, 402, 406, 444, je `grenze` leer). Der Pflichtstift Grenze greift also nicht, und nach `zaehne()` rastet das Dreieck ohne Eingabe nie ein. Das Gewichtsmodell gibt ihm dagegen ×1,65. Über die ganze Karte rasten mit `zaehne()` nur 5 von 1797 Paaren ein (SCHLOSS §1.6), mit dem Gewichtsmodell tragen 1133 Paare. Es fehlt eine Regel, wie beides zusammenwirkt, etwa so: `zaehne()` entscheidet *rastet ein / bedingt / Spalt*, das Gewicht entscheidet *wie stark*. Und es fehlt die Antwort, was mit Fugen ohne Grenze geschieht. Erst dann ist das Wachstumsbild regelgerecht. |
| Fuge 444 als Verstärkung | E | `fugen[444]` „ist nicht als zielgerichtete Umschreibung zu verstehen“ (aussage, 1 Quelle) gilt in `analyse.mjs` als verbindend, weil kein Trennmuster greift. Sie trägt zum Dreieckswert bei. Ihr Wortlaut ist eine Abgrenzung. Vor dem Bild sollte geprüft werden, ob sie wirklich verstärkt. |
| Inkommensurable Naht am Startfall | A | Alle Daten liegen vor: Wortlaut, Grenze, NIMH- und AWMF-Titel samt URL (`S/startfall.json`). Offen bleibt nur die Darstellung über die Distanz von 495 (siehe 2.2). Auch hier muss die sichtbare Kennziffer „038-015“ im AWMF-Titel entfernt werden (SCHLOSS §1.7, `ohneKennziffern` greift nicht). |
| Griff zur Quelle für redaktionelle Texte | E | #1031 und seine drei Nachbarfugen haben keine Quelle, nur die Herkunft „Borderline verstehen · Beziehungskarte“ bzw. „redaktionelle Lesebeziehung“. Die Regel „jede Aussage führt mit einem Griff zu ihrer Quelle“ braucht für diesen Fall eine Form: Der Griff führt zur Herkunft, und es ist sichtbar, dass sie redaktionell ist. Das ist nicht entschieden. |

### 2.4 Medienort (Video oder Audio, eingebettet)

| Lücke | Art | Befund |
|---|---|---|
| Kein Klang- oder Bewegtmedium hat einen Ort | B/E | Das ist bestätigt. Der Auftrag verlangt aber ausdrücklich „Video oder Audio“. Die Empfehlung der MEDIENLISTE für das Startgebiet ist die Porträtlichtung, also **Bilder** (Werke WAK). Damit ist die Forderung nicht erfüllt. |
| Lage der Klangquelle | E | `trauma-sicherheit-behandlung.m4a` hat die Gebiete TraumaAtlas, Diagnose & Differenzierung und Forschung & Einordnung (`atlas-selection.mjs` Z. 2 und 8). Forschung überlappt mit dem Startgebiet, Diagnose trägt den Partner #1053. Eine Lage, die zum Startfall passt, wäre ein Ort im Gebiet Forschung. Jede genaue Position bliebe aber gesetzt, nicht belegt. Das muss im Bild als offene Gebietslage erkennbar sein, und Ralf muss zustimmen. Die Alternative ist das YouTube-Video aus Z. 19, das als einziges Bewegtmedium Beziehungen & Borderline nennt; es ist extern und kommt von einem Drittanbieter. |
| Pflichtangaben an der Quelle | A | Die KI-Kennzeichnung (NotebookLM) und die Prüfgrenze aus `medien.json[0].pruefung` müssen an der Klangquelle stehen. Die Untertitel `trauma-sicherheit-behandlung.vtt` (de, 32 Cues) und das Wellenbild sind vorhanden. Das Wellenbild hat keine belegte Herkunft (MEDIENLISTE §5). |
| Einbettung technisch | A | Lokal liegen alle 42 Mediendateien in `P/app/atlas/assets/media`. Auf Railway gibt es kein CORS, also nur DOM-Elemente oder 2D-`drawImage`, keine WebGL-Textur (SCHLOSS §3.4). Für die Leinwand ist das egal, für den Bau aber nicht. Die Videos sind hochkant (720 × 1280); eine runde oder organische Maske muss das Format berücksichtigen. |
| Werke WAK | A | An der Lichtung nur Titel, Jahr, Technik und Quellseite zeigen, keine Deutung. Die Daten liegen vor (MEDIENLISTE §7). |

### 2.5 Querschnitt (für die Leinwand nachrangig, vor dem Bau nötig)

- **Atlasweites Zugangsprofil:** Technisch gibt es keins. Bilddichte fehlt, die Speicherregeln widersprechen sich: Die Schloss-Probe speichert nichts, `/` speichert in localStorage. Das muss Ralf entscheiden (SCHLOSS §2.2). Für die Leinwand genügt ein zusätzliches Bild „Ruhe“, also dasselbe Gebiet ohne Bewegungsspuren.
- **Andockstellen:** einordnung (1037) und offen (253) würden jede Andockstelle überfüllen (TECHNIK 4.4.1). Für Maßstab 3 muss die Hautdarstellung entschieden sein.
- **Laufzeitdaten:** `data-readonly/` wird nicht hochgeladen. Die Leinwand darf lokal direkt lesen, der Bau braucht eine vorab gebaute Datei. Ihre Größe ist nicht gemessen.
- **Nicht gesichtet:** Bewegung (nur Standbilder), der Lichtgrund-Code (VORLAEUFER-B §5), original-01 und die Dauer der VA-Videos.

---

## 3 · Kurzliste der Entscheidungen, ohne die die Leinwand nicht ehrlich wird

1. Drei Regionsfarben ergänzen (TraumaAtlas, Dynamikraum, Trigger & Kontext). Dazu klären: Gelten die Farben nur in der Welt oder im ganzen Atlas?
2. Bekommt jedes Wesen einen eigenen festen Farbton, und aus welchem Datenfeld? Ohne ihn gibt es im Bestand nirgends eine neue Mischfarbe.
3. Wie wirken `zaehne()` und das Gewicht zusammen, und was gilt für Fugen ohne `grenze`?
4. Wie begegnen sich Orte über Regionsgrenzen, wenn alle Querfugen mindestens 223 lang sind?
5. Darf das Wachstumsbild außerhalb des Startgebiets liegen, zum Beispiel im Dreieck im Phänomenatlas?
6. Welcher Ton- oder Bewegtort darf in eine bloße Gebietslage gesetzt werden?
7. Ein Wortschatz für „belegt“, „Ortsquelle“ und „redaktionell“ und die Form des Quellengriffs bei redaktioneller Herkunft.
8. Grundgröße der Wesen, nicht nach Grad. Und: Wandern Quellen- und Methodenorte mit?
