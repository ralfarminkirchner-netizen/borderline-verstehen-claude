# Sichtung: Schloss-Regel, Zugangsprofil, Server, Quellenweg, Farben und Schriften

Stand 06.11.2026 · nur gelesen, nichts im Projekt verändert. Projektwurzel im Folgenden: `B = /Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103`.
Ausgeführt habe ich nur Lesebefehle und zwei eigene Node-Simulationen im Scratchpad. Die Simulationen kopieren `zaehne()` unverändert aus `schloss.js` und laufen auf `daten.js` bzw. `karte.json`. Dazu kommen zwei Bildschirmfotos der Probe über `file://` mit dem installierten Chrome. Im Projekt-Cache `.cache/pw-browsers` liegt nur `ffmpeg-1011` und kein Chromium.

---

## 0. Was für die „Lebende Welt“ zuerst wichtig ist

1. **Ohne Eingabe rastet nach `zaehne()` keine Begegnung ein.** In der Probe sind es 0 von 66 Paaren. Über die ganze Karte habe ich `zaehne()` nur angenähert, siehe 1.6: Dort rasten 5 von 1797 Ortspaaren ein, die eine Fuge haben. Der Engpass ist die Grenze: Nur 140 Paare haben eine Bestandsgrenze. Danach folgen Wort (309) und Beleg (940). Die Lesart greift bei 1134 Paaren, und zwar nur bei den Fugenarten `einordnung`, `annaeherung` und `zusammenhang` sowie bei 3 Aussagen, die mit „verbindet“ beginnen. Wenn die Welt `zaehne()` unverändert als Schalter fürs Einrasten nimmt, wächst fast nichts. Darüber muss entschieden werden. Möglich ist etwa ein abgestuftes Maß „wie viele Zähne greifen“ statt des bloßen Ja/Nein. Die Probe selbst macht das schon so: Wie weit ein Arm dicht bleibt, hängt dort an der Zahl der fehlenden Zähne, siehe 1.5.
2. **Startfall „Die Angst vor Verlust ist groß“ (Ort 1031).** Der Ort hat 4 Fugen. Nur eine davon ist belegt: Fuge 1749 von „Verlassenheitsangst und Vermeidungsbemühungen“ (Ort 1053, Region „Diagnose & Differenzierung“). Ihre Art ist `aussage`, die Bezeichnung lautet „unterscheidet Symptomdomäne und Alltagsszene“. Die Lesart greift dort **nicht**, und eine andere Lesart gibt es nicht. Die Probe zeigt deshalb „der Spalt bleibt – ein gültiger Zustand“. Die drei Fugen innerhalb der Region (`einordnung`, redaktionell) haben **keine Quelle**. Der Ort selbst hat in `texte.orte[1031].quellen` ebenfalls keine Quelle. Im Startfall gibt es also keine Verstärkung, die belegt und zugleich verbindend ist. Das ist ehrlich darstellbar und sollte nicht umgangen werden.
3. **Ein „atlasweites Zugangsprofil“ gibt es technisch noch nicht.** Es gibt zwei getrennte Systeme:
   - Das `ZUGANGSPROFIL` der Schloss-Probe lebt nur im Speicher, ausdrücklich ohne localStorage.
   - Die Atlas-Einstellungen unter `/` liegen in localStorage und sessionStorage, unter anderen Feldern und Schlüsseln.
   Ein Feld „Bilddichte“ fehlt in beiden.
4. **Medien auf Railway sind fremder Herkunft ohne CORS.** Der Server antwortet mit 302 auf `borderline-verstehen-atlas-production.up.railway.app`. Dort steht kein `Access-Control-Allow-Origin` (`curl -I` vom 06.11.2026). Als DOM-`<img>`/`<video>` oder per `drawImage` auf ein 2D-Canvas lassen sich die Medien zeigen, das Canvas wird dabei aber „tainted“. **Als WebGL-Textur gehen sie nicht** (SecurityError), Pixel auslesen geht auch nicht.
5. **`data-readonly/` wird nicht zu Railway hochgeladen** (`B/.railwayignore`). `/welt/` braucht deshalb eine vorab gebaute Laufzeitdatei unter `app/`, so wie `daten.js` bei der Schloss-Probe.

---

## 1. Die Regelfunktion `zaehne()`

### 1.1 Wo sie steht

- Die Funktion selbst steht **nur** in `B/proben/schloss-schluessel/schloss.js`, Zeilen 136–166, in einer IIFE `(() => { 'use strict'; … })()` (Zeile 8). **Sie wird weder exportiert noch als globale Funktion bereitgestellt.**
- `baue-daten.mjs` enthält **kein** `zaehne()`. Es baut nur die Felder, aus denen die Zähne im Browser abgeleitet werden. Wörtlich heißt es in Zeile 18: „Die Zähne selbst werden im Browser (schloss.js) aus diesen Feldern abgeleitet.“

### 1.2 Volltext (schloss.js, Zeilen 136–166)

```js
136	  /* ===== Die EINE Regel für Schloss und Feld: zaehne(Paar, Eingaben). Alles andere ruft sie auf. =====
137	     Vier Stifte sind nötig:
138	       Lesart  greift bei „Nähe“ oder „könnte zusammenhängen“ (aus Bestandsfuge oder Sätzen, die den Partner nennen).
139	       Beleg   greift bei Quellen der Fuge oder einer aufgelegten Ortsquelle (die bleibt deine Lesart).
140	       Grenze  greift bei einer Bestandsgrenze der Fuge, einem Satz, der beide nennt, oder einem Stein, den du
141	               bewusst als deine Grenze auflegst (Grenze eines Orts, Vermerk, eigenes Wort).
142	       Wort    greift bei einem gemeinsamen Wort der Kurztexte oder deiner Übersetzung.
143	     Kontext ist kein Pflichtstift, sondern ein Hebel: Fehlt genau einer der Stifte Beleg, Grenze oder Wort,
144	     hält eine aufgelegte Bedingung ihn – die Fuge rastet dann „nur unter“ dieser Bedingung ein. Die Lesart
145	     ersetzt sie nie: eine Bedingung ändert die Lage, nicht, was die Lesart sagt. */
146	  function zaehne(i, e) {
147	    const p = paar(i);
148	    const les = p.lesarten[e.lesart] || p.lesarten[0];
149	    const bestQ = bestandQuellen(p);
150	    const bestG = (p.fugen.find((f) => f.grenze) || {}).grenze || '';
151	    const auto = autoWoerter(i);
152	    const w = e.wort;
153	    const z = {
154	      lesart: { greift: lesartGreift(les), les, deine: !les.ausBestand, bestand: p.lesarten[0] },
155	      beleg: { greift: bestQ.length > 0 || !!e.beleg, bestand: bestQ, dein: e.beleg },
156	      grenze: { greift: !!bestG || !!e.grenze, bestand: bestG, dein: e.grenze },
157	      wort: { greift: auto.length > 0 || !!(w && w.art === 'uebersetzung'), auto, dein: w },
158	      kontext: { greift: !!e.kontext, dein: e.kontext },
159	    };
160	    z.fehlend = VIER.filter((s) => !z[s].greift);
161	    z.vier = z.fehlend.length === 0;
162	    z.bedingt = !z.vier && z.fehlend.length === 1 && z.fehlend[0] !== 'lesart' && z.kontext.greift;
163	    z.ersetzt = z.bedingt ? z.fehlend[0] : null;
164	    z.alle = z.vier || z.bedingt;
165	    return z;
166	  }
```

Der Kommentar in Zeile 138 nennt für die Lesart nur „Nähe“ und „könnte zusammenhängen“. Der Code in Zeile 32 lässt zusätzlich `einordnung` und mit „verbindet“ beginnende `aussage` greifen.

### 1.3 Abhängigkeiten, die beim Herauslösen mitmüssen (alle in schloss.js)

| Zeilen | Was |
|---|---|
| 25–26 | `SLOTS = ['lesart','beleg','grenze','wort','kontext']`, `VIER = ['lesart','beleg','grenze','wort']` |
| 29 | `NESTEND = new Set(['annaeherung','zusammenhang'])` |
| 32 | `lesartGreift = (les) => NESTEND.has(les.art) \|\| les.art === 'einordnung' \|\| (les.art === 'aussage' && /^verbindet\b/.test(les.belege[0].satz))` |
| 33 | `TRENNEND = {spannung, widerspruch, abstand, begrenzung}`. Wird in `zaehne()` nicht gebraucht, nur für Form und Muster (Zeilen 824, 915). |
| 49–59 | Vorbereitung: Gibt es einen Titel doppelt, bekommt der Ort außerhalb des Heimgebiets den Gebietsnamen in Klammern dazu. `p.A`/`p.B` werden als Ortsobjekte angehängt. |
| 62–90 | Wortebene: `STOPP` (Stoppwörter), `FUNDORT` (Wörter wie Forum oder Studie), `tokens()`, `titelWoerter()`, `zaehlt()` (≥ 4 Buchstaben, kein Stoppwort), `gleicherStamm()` (gemeinsames Präfix ≥ 5 und höchstens 2 Zeichen kürzer als das kürzere Wort), `gemeinsam(t1,t2,aus)` |
| 119 | Leere Eingabe je Paar: `{ lesart: 0, beleg: null, grenze: null, wort: null, kontext: null, eingerastet: false, … }` |
| 121–122 | `paar(i) = D.paare[i]`, `ein(i) = S.paare[i]` |
| 124–134 | `autoWoerter(i)` holt gemeinsame Wörter der Kurztexte `p.A.kurz`/`p.B.kurz` ohne die Titelwörter und speichert sie je `i` zwischen. `bestandQuellen(p)` vereinigt die Quellen aller Fugen des Paars, ohne doppelte Titel. |

### 1.4 Eingaben, die fünf Riegel und die Rückgabe

**Eingabe `i`:** der Index in `D.paare`. Ein Paar sieht so aus (aus `daten.js`, gebaut von `baue-daten.mjs` `paarDaten()`, Zeilen 320–388):

`{ a, b, fugen: [{ richtung, vomSchloss, art, artWort, label, grund, geltung, status, grenze, detail, quellen:[{titel,kurz,art,zitat,technisch:{schluessel,url,titelBestand}}], herkunft, technisch:{fugeIndex,typ,gegen} }], lesarten: [{ art, artWort, wort, ausBestand, auchImSatz, belege:[{woher,satz,…}] }], saetzeOhneFuge }`

Zur Lesart:
- `lesarten[0]` ist die Art der ersten Bestandsfuge. Die Fugen sind so sortiert, dass die vom Schloss ausgehende zuerst kommt (Zeile 346).
- Danach kommen weitere Arten aus der Gegenrichtung (Zeilen 362–367).
- Dann kommen Arten aus Sätzen der Abschnitte „Verwandt und zu unterscheiden“ und „Offene Fragen“, in denen ein Ort den anderen beim Namen nennt. Dafür gelten die `LESEREGELN` in Zeilen 70–76 (Gegenteil/Gegenpol → `spannung`, „Nähe“ → `annaeherung`, „könnte zusammenhängen“ → `zusammenhang`, „nicht dasselbe …“ → `abstand`, „Ob … trennbar“ → `offen`).
- Ohne Bestandsfuge entsteht eine Lesart `keine` (Zeile 369). Sätze werden dann nur als `saetzeOhneFuge` mitgegeben (Zeilen 377–387).

**Eingabe `e`** (Nutzerzustand je Paar):
- `lesart`: Index der gewählten Lesart
- `beleg`: `{titel, von}`, eine aufgelegte Ortsquelle
- `grenze`: `{text, art: 'partner'|'vermerk'|'ort'|'eigen'}`
- `wort`: `{art: 'uebersetzung', a, b}`
- `kontext`: `{text, …}`

Was die Oberfläche als Eingabe anbietet, steht in `versuche()` (Zeilen 169–182) und bei den Vorschlägen (Zeilen 213–237).

**Die Riegel:**
- Vier Pflichtstifte: Lesart, Beleg, Grenze, Wort.
- Ein Hebel: Kontext. Er gleicht genau einen fehlenden Stift aus, wenn es Beleg, Grenze oder Wort ist, **nie die Lesart**.
- In der Oberfläche heißen sie „Stifte“ beziehungsweise „Riegel“ (`S.riegel`, Zeile 1805). Die Bezeichnung „die fünf Riegel“ steht in ZUGANGSPROFIL.md, Zeile 29.

**Rückgabe `z`:**
```
{ lesart:{greift, les, deine, bestand}, beleg:{greift, bestand:[Quellen], dein},
  grenze:{greift, bestand:String, dein}, wort:{greift, auto:[{a,b,roh,rohB}], dein},
  kontext:{greift, dein},
  fehlend:[Namen der fehlenden Pflichtstifte], vier:Boolean, bedingt:Boolean, ersetzt:Stift|null, alle:Boolean }
```

### 1.5 Wie „einrasten“ entschieden wird

`zaehne()` selbst ist eine reine Funktion. Der Zustand wechselt erst in `nachAenderung(i, was)` (Zeilen 276–296):
- `!e.eingerastet && z.alle` → eingerastet. Ist `z.bedingt`, dann „nur unter ‚Bedingung‘“. Dazu kommen Verlaufseintrag, Meldung und Klang `ein`.
- `e.eingerastet && !z.alle` → erloschen. Die Bruchstelle wird gekittet (`e.kitt = true`), Klang `aus`.
- `entscheide(i, 'bestritten' | 'gefasst' | 'offen')` (Zeilen 297–309) setzt einen Sperrbalken, eine Goldnaht oder einen Ring.

Ableitungen der Regel:
- `fehltNur()`, `fehltMitEinem()`, `blockiert()`, `spaltBleibt() = blockiert(i,'lesart')` (Zeilen 187–208). Die beiden ersten fragen: „Reicht genau eine weitere Handlung?“
- Im Feld legt `armZiel(a)` (Zeilen 867–876) fest, wie weit ein Faserbündel **dicht** bleibt:
  - eingerastet: 1
  - nur noch der gewählte Stift fehlt: 0,92
  - danach fehlt noch einer: 0,76
  - bestritten oder `spaltBleibt`: 0,3
  - sonst nach Zahl der fehlenden Stifte: höchstens 1 → 0,62, 2 → 0,5, 3 und mehr → 0,4
- Die Deckkraft folgt dieser Abstufung (Zeilen 1300–1303): ≤ 1 → 0,78, 2 → 0,5, sonst 0,24, Spalt 0,14. Der Kopfkommentar (Zeilen 2–4) und Zeile 866 halten fest: „Der Abstand entscheidet nie.“

### 1.6 Ergebnisse auf echten Daten (eigene Simulation, Code unverändert kopiert)

Skripte: `…/scratchpad/zaehne-sim.cjs` und `…/scratchpad/zaehne-alle.cjs`. Der Scratchpad liegt unter `/private/tmp/claude-501/-Volumes-ThunderBolt4-2TB-Development-Projects-faska-varianten-netz/53b310cf-cc95-46f3-bef0-fdcdc14254d7/scratchpad/`.

**Schlüsselbund des Schlosses (`bunde[1031] = [0..5]`), leere Eingabe:**

| Paar | Fuge | Lesart | Beleg | Grenze | Wort | fehlt |
|---|---|---|---|---|---|---|
| ↔ Auch meine Grenze gilt | einordnung | ja | nein | ja | nein | Beleg, Wort |
| ↔ Eine Antwort bleibt aus | einordnung | ja | nein | ja | ja („Gegenüber“) | Beleg |
| ↔ Wenn Nähe zur Verpflichtung wird | einordnung | ja | nein | ja | nein | Beleg, Wort |
| ↔ Verlassenheitsangst und Vermeidungsbemühungen | aussage („unterscheidet …“) | **nein** | ja (2) | ja | nein | Lesart, Wort → Spalt bleibt |
| ↔ Abstand wünschen | keine | nein | nein | nein | nein | alle vier |
| ↔ Rückzug hat mehrere mögliche Bedeutungen | keine | nein | nein | nein | nein | alle vier |

**Alle 66 Paare der Probe:**
- Bei keinem Paar ist `alle = true`.
- Fehlende Stifte: nur Beleg 22, Beleg und Wort 20, Lesart und Wort 12, nur Lesart 8, nur Wort 2, alle vier 2.

**Ganze Karte (Näherung).** Je ungeordnetem Ortspaar: Lesart = Art der ersten Fuge in Dateireihenfolge; Beleg und Grenze aus allen Fugen des Paars; Wort aus den rohen Kurztexten `o.s` ohne `saeubern`. Ergebnis für 1797 Ortspaare mit Fuge:
- Lesart greift 1134, Beleg 940, Grenze 140, Wort 309.
- Alle vier greifen: **5**.
- Bedingt möglich (genau ein Stift fehlt, nicht die Lesart): 113.
- Lesart nach Art: einordnung 1037 von 1037, annaeherung 79 von 79, zusammenhang 15 von 15, aussage 3 von 144. Bei folge, uebergang, offen, bedingung, widerspruch, abstand, spannung und begrenzung greift sie nie.

### 1.7 Wiederverwendung von einer anderen Seite aus

- **Ohne Eingriff geht es nicht.** `zaehne` liegt in der Closure. `window.SCHLOSS_DATEN` (daten.js, Zeile 3) enthält nur die 49 Orte und 66 Paare um das Schloss (Feld: 49 Orte, 64 Feldpaare; `feld.regel` Zeilen 544–556), nicht die 1226 Orte.
- **Weg mit wenig Risiko** (ohne `/schloss/` zu ändern): Die Zeilen 25–34, 62–90 und 124–166 werden für `/welt/` **wörtlich kopiert** in ein eigenes Modul, etwa `app/welt/regel.js` mit `export function zaehne(paar, e)`. Dabei wird nur der Zugriff von `paar(i)` und `autoWoerter(i)` auf ein übergebenes Paarobjekt umgestellt, mit Zwischenspeicher je Paarschlüssel. Ein Prüfskript vergleicht die Ergebnisse auf allen 66 Paaren mit dem Original, so wie meine Simulation. `schloss.js` selbst bleibt unverändert.
- **Datenformat für die Welt:** Für alle Ortspaare mit Fuge wird ein `paare`-Array im Format von `paarDaten()` gebraucht (A, B mit `titel`/`kurz`/`quellen`, `fugen[].grenze`/`quellen`, `lesarten[]`). Am einfachsten baut es ein eigenes Bauskript nach dem Muster von `baue-daten.mjs`, ohne die Feldbegrenzung `FELD_MAX = 160` (Zeile 395). Das Ergebnis ist eine Datei `window.WELT_DATEN = …`, wie Zeile 603.
  - Offen: Wie groß wird die Datei bei rund 1800 Paaren mit Lesart-Sätzen? Nicht gemessen.
- Säuberung der sichtbaren Texte und Quellentitel: `saeubern()` (Zeilen 93–104), `ohneKennziffern()` (Zeilen 86–92), `anzeigeTitel()`/`kurzTitel()` (Zeilen 145–154). Diese Funktionen gehören zur Regel „keine sichtbaren Kennungen“ und sollten übernommen werden. Achtung: `ohneKennziffern` ersetzt AWMF-Nummern nur, wenn „AWMF“ davorsteht. Im Titel „S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022“ bleibt „038-015“ deshalb sichtbar.

---

## 2. Zugangsprofil

### 2.1 Schloss-Probe: `ZUGANGSPROFIL`

- Beschreibung: `B/proben/schloss-schluessel/ZUGANGSPROFIL.md`, Zeilen 1–54. Code: `zugangsprofil.js`, Zeilen 1–39. Geladen vor allen anderen Skripten (`index.html` Zeile 13, Reihenfolge `atlas-rueckweg.js`, `zugangsprofil.js`, `daten.js`, `zugang-texte.js`, `schloss.js`).
- Felder und Werte (`zugangsprofil.js`, Zeilen 7–14):

| Feld | Werte | Start |
|---|---|---|
| `umfang` | `kern`, `mehr`, `ganz` | `kern` |
| `niveau` | `einfach`, `alltag`, `original` | `original` |
| `blick` | `innen`, `aussen`, `spielraum` | `innen` |
| `reiz` | `ruhig`, `lebendig` | `lebendig`, bei `prefers-reduced-motion` `ruhig` (Zeilen 15–17) |
| `ton` | `false`, `true` | `false` |
| `schrift` | `normal`, `gross` (× 1,25) | `normal` |

- API: `ZUGANGSPROFIL.setze({…})` übernimmt nur gültige Werte und benachrichtigt die Beobachter (Zeilen 20–33). `ZUGANGSPROFIL.beobachte(fn)` gibt eine Abmeldefunktion zurück (Zeilen 34–37). `ZUGANGSPROFIL.werte` ist nicht aufzählbar (Zeile 19).
- **Speicher: keiner.** Regel 4 in ZUGANGSPROFIL.md, Zeile 32: „kein localStorage, keine Cookies, keine URL-Parameter, keine Netzanfragen“. Das habe ich geprüft: Nach dem Laden ist `Object.keys(localStorage)` leer.
- **„Bilddichte“ fehlt.** „Reizmenge“ entspricht `reiz`, „Ruhe“ entspricht `reiz:'ruhig'`, Textumfang ist `umfang`, Niveau ist `niveau`, Ton ist `ton`.
- Verwendung in schloss.js:
  - Zeile 15: Rückfall, falls das Profil fehlt. Dort steht `reiz:'ruhig'`, abweichend vom Start `lebendig`.
  - Zeilen 17–18: `lebendig = !systemStill() && PROFIL.reiz === 'lebendig'`. Die Systemeinstellung gewinnt immer.
  - Zeilen 402 und 418–426: Wörter oben rechts, „Bewegung/Schrift/Ton“.
  - Zeile 1711: Blick. Zeilen 1735–1736: „weiterlesen ↓ / kürzer ↑“. Zeile 2447: Ton. Zeile 2469: `--sf`. Zeile 2478: `beobachte`.
- Fassungen für die Niveaus: `zugang-texte.js` (`window.ZUGANG_TEXTE`: `orte`, `oberflaeche`, `meta`). **Sie enthält nur 7 ADHS-Orte** (Aufgabenstarre, Hyperfokus, Wartemodus, Body Doubling, Delay Aversion, Zeitblindheit, Aufgaben bleiben offen), dazu 159 Oberflächenschlüssel. Für „Die Angst vor Verlust ist groß“ gibt es keine einfache oder alltägliche Fassung. Nach Regel 3 erscheint dann das Original mit „einfache Fassung fehlt noch“.

### 2.2 Atlas unter `/` (app/atlas): eigene, andere Einstellungen

| Schlüssel | Speicher | Werte | Datei:Zeile |
|---|---|---|---|
| `atlas-accessibility-preferences-v1` | localStorage | `motion: system\|reduced\|full`, `transparency: soft\|solid`, `contrast: normal\|high`, `text: normal\|large\|larger`, `media: pause\|continue` (jeweils der erste Wert als Vorgabe) | `atlas-companion.mjs`, 6–16 |
| Anwendung | data-Attribute an `<html>`: `data-atlas-motion`, `-transparency`, `-contrast`, `-text`, `-media` | | `atlas-companion.mjs`, 58–66; beim Laden `shared-atlas.mjs`, 30 |
| `atlas.appearance.v1` | localStorage | `light`, `dark` (sonst Systemeinstellung) | `index.html`, 2 (Inline-Skript); `atlas-art-direction.mjs`, 4 und 8 |
| `atlas.motion.presentation.v1` | sessionStorage | `{paused, quiet, reduced}` → Klassen `atlas-motion-paused`, `atlas-quiet`, `atlas-reduced` und Ereignis `atlas:motionchange` | `atlas-art-direction.mjs`, 13–17; eingebunden in `shared-atlas.mjs`, 473 |
| Sitzungsschlüssel für Ansichten und Filter (`borderline.atlas.view.v1`, `.filters.v1`, `.fractal.v1`, `.reading-route.v1`) | sessionStorage | Ansichtszustand, kein Profil | `shared-atlas.mjs`, 67–76 |

CSS wirkt zum Beispiel über `html[data-atlas-motion="reduced"] *{animation:none…}` (`atlas-companion.css`, 2) und über `[data-atlas-contrast=high]`/`[data-atlas-text=large]` (`atlas-network-space.css`, 12).

**Folgerung:** `/`, `/schloss/` und `/welt/` haben denselben Origin, `/welt/` **könnte** also die Atlas-Schlüssel in localStorage lesen. Das Schloss-Profil speichert dagegen grundsätzlich nichts. Wie „atlasweit“ gemeint ist, muss entschieden werden. Eine Möglichkeit: `/welt/` lädt `zugangsprofil.js` (dieselbe Datei) und übernimmt beim Start lesend `motion` und `text` aus `atlas-accessibility-preferences-v1`. Das ist **offen** und braucht Ralfs Entscheidung, weil es Regel 4 berührt.

---

## 3. Server, Railway und ein neuer Pfad `/welt/`

### 3.1 `B/app/server.mjs` (67 Zeilen)

- Zeilen 10–13: `ATLAS = app/atlas`, `SCHLOSS = proben/schloss-schluessel`, Positivliste `SCHLOSS_DATEIEN = {index.html, schloss.css, schloss.js, daten.js, zugang-texte.js, zugangsprofil.js, atlas-rueckweg.js}`.
- Zeilen 14–20: MIME-Tabelle, darunter `.vtt` → `text/vtt`, `.m4a` → `audio/mp4`, `.mp4`, Schriftarten und `.ttf`.
- Zeile 24: `MEDIEN_QUELLE = process.env.MEDIEN_QUELLE || 'https://borderline-verstehen-atlas-production.up.railway.app'`.
- Zeile 25, **Header**: `x-content-type-options: nosniff`, `referrer-policy: no-referrer`, `x-robots-tag: noindex, nofollow`. **Keine CSP und keine CORS-Header.** Zum Vergleich: Der eigenständige Probenserver `proben/schloss-schluessel/serve.mjs`, Zeile 22, setzt eine strenge CSP, ist aber nicht der Railway-Einstieg.
- Zeilen 29–52, `liefere()`:
  - Gibt es die Datei nicht und beginnt `pfad` mit `/assets/media/`, folgt eine **302-Weiterleitung** auf `MEDIEN_QUELLE + encodeURI(pfad)` (Zeile 32).
  - Bereichsanfragen werden mit 206/416 beantwortet (Zeilen 38–48).
  - `cache-control`: no-cache für html/mjs/js/css/json, sonst `max-age=86400`.
- Zeilen 54–67, **Routing**:
  - Nur GET und HEAD.
  - `/schloss` → 301 auf `/schloss/` (Zeile 58).
  - `/schloss/<name>` nur aus der Positivliste, sonst 404 (Zeilen 59–62). `liefere` wird dabei **ohne** `pfad` aufgerufen, also ohne Medien-302.
  - Alles andere wird unter `app/atlas` aufgelöst, mit Schutz gegen Pfadausbruch (Zeilen 63–66). Nur hier wird `pfad` übergeben und die Medien-302 ist aktiv.
- **Port:** `process.env.PORT || 8080`, Host `0.0.0.0` (Zeile 67).

### 3.2 Einbindung von `/schloss/` in den Atlas

- Link in der Unternavigation „Ausprobieren“: `shared-atlas.mjs`, Zeile 444 (`<a class="schloss-zugang" href="schloss/"…`). Stil in `schloss-zugang.css`, Zeilen 1–3. Geladen über `index.html`, Zeile 2.
- Rückweg: `atlas-rueckweg.js`, Zeilen 1–9. Er greift nur bei `/schloss/` und führt auf `../#atlas`.
- Beide Eingriffe sind in `B/app/HERKUNFT.md`, Zeilen 10–14, als eigene Änderungen an der Kopie von history-01 ausgewiesen.

### 3.3 Railway

- `B/railway.json`: `{"deploy":{"startCommand":"node app/server.mjs"}}`. Laut Auftrag setzt der Dienst schloss-schluessel-probe zusätzlich `RAILPACK_START_CMD=node app/server.mjs`. Im Dienst selbst habe ich das nicht gesehen, es ist **offen**.
- Achtung: `package.json` `start` ist `node server.mjs`, also der lokale Fugenland-Dienst mit Schreibzugriff, **nicht** die App. `start:app` ist `node app/server.mjs`.
- `B/.railwayignore` lädt **nicht** hoch: `data-readonly/`, `docs/`, `public/`, `scripts/`, `evidence/`, `proben/**/bilder/`, `proben/**/*.cjs`, `proben/**/*.md` und `app/atlas/assets/media/` (wegen 302).
- Git: `origin` ist `https://github.com/ralfarminkirchner-netizen/borderline-verstehen-claude.git`, letzter Commit `90158bb`. Die öffentliche URL des Dienstes schloss-schluessel-probe habe ich in den gelesenen Dateien nicht gefunden, sie ist **offen**.
- Kanonische Medienquelle, `curl -I` mit Origin-Kopf vom 06.11.2026: 200, `content-type: image/jpeg`, `x-content-type-options: nosniff`, `cache-control: no-cache`, **kein `access-control-allow-origin`**.

### 3.4 Was `/welt/` mindestens braucht (Vorschlag, nicht umgesetzt)

Einzufügen nach Zeile 62 von `app/server.mjs`, also vor dem Rückfall in den Atlas. `/` und `/schloss/` ändern sich dadurch nicht: Heute fällt `/welt/` in den Atlaszweig und endet mit 404, weil es `app/atlas/welt/` nicht gibt.

```js
const WELT = join(HIER, 'welt');                                    // neben ATLAS/SCHLOSS (Zeile 10–12)
const WELT_DATEIEN = new Set(['index.html', 'welt.css', 'welt.js', 'welt-daten.js', 'regel.js']); // Positivliste
// im Handler, nach dem /schloss/-Block:
if (pfad === '/welt') { res.writeHead(301, { location: '/welt/', ...SCHUTZ }); return res.end(); }
if (pfad.startsWith('/welt/')) {
  const name = pfad.slice('/welt/'.length) || 'index.html';
  return WELT_DATEIEN.has(name) ? liefere(req, res, join(WELT, name)) : nichtGefunden(res);
}
```

Hinweise dazu:
- **Ablage unter `app/welt/`.** `app/` wird hochgeladen. `proben/**/*.md` und `data-readonly/` werden es nicht.
- **Medien** in `/welt/` absolut als `/assets/media/<datei>` ansprechen. Lokal liefert der Atlaszweig dann die Datei samt Bereichsanfragen, auf Railway greift die 302. `/welt/assets/media/…` würde **nicht** weitergeleitet.
- **Kein WebGL mit Medientexturen auf Railway**, solange die Quelle kein CORS sendet. Bilder und Videos entweder als DOM-Elemente über dem Canvas zeigen (Lichtungen als runde, maskierte `<img>`/`<video>`) oder per 2D-`drawImage`. Die Alternative wäre ein Streaming-Proxy im Server, der dann aber 173 MB durch den Dienst schicken müsste.
- **Schriften** über `/atlas-fonts.css` oder direkt `/assets/fonts/…`, beides aus `app/atlas`.
- Wer eine CSP will, setzt sie nur im `/welt/`-Zweig, etwa per zusätzlichem Header in einem eigenen `liefere`-Aufruf. `SCHUTZ` bleibt dann unverändert, damit sich `/` nicht ändert.

---

## 4. `texte.json` und der Weg vom Ort zur Quelle

### 4.1 Struktur

- `texte.json`: `{ format: 'fugenland-texte', version: 1, orte, quellen, fundus }`.
  - `orte`: ein Array mit 1226 Einträgen, **im selben Index wie `karte.orte`**. Jeder Eintrag hat `{ id, body (Markdown mit ##-Abschnitten), tags, quellen: [Quellschlüssel], herkunft: {titel, pfad, commit}, korrektur }`. 1018 Orte haben mindestens eine Quelle.
  - `quellen`: ein Objekt mit 606 Schlüsseln, jeweils `{ titel, art, url, autoren, jahr, stelle }`.
    - Alle 606 haben eine `url`, 68 haben Autoren, 205 ein Jahr, keine eine `stelle`.
    - `autoren` ist entweder `""` oder ein Array von Namen, `jahr` entweder `""` oder eine Zahl.
    - `art` ist meist leer (542). Daneben kommen vor: `public_health_information`, `studie`, `leitlinie`, `Geprüfte Forschung`, `Original-Projektdatei` und andere.
    - Die Schlüssel sind technische Kennungen und dürfen nicht sichtbar werden, zum Beispiel `source:bpd:…`, `fundus-source:…`, `trauma-source:N`, `audit:…`.
  - `fundus`: ein Array mit 12 Kapiteln `{ datei, titel, text (Markdown, Links inline), eintrag, sha256 }`. `eintrag` ist der Ortsindex des Kapitels: 139–146 und 148–150, zum Beispiel 139 „Überblick“. `12-luftschadstoffe-studienvergleich.md` hat `eintrag: null`.
- `karte.json`: `{ format: 'fugenland-karte', version: 1, regionen[10], orte[1226], fugen[1831] }`.
  - Ort: `{t, r (Regionsindex), k (Art), s (Kurztext), x, y, n}`.
  - Fuge: `{a, b, art, grund, geltung, label, detail, grenze, quellen: [Quellschlüssel], herkunft, typ, status, frage, anker[, gegen, gegenGleich, kausal]}`.
  - Quellen je Fuge: 0 → 876 Fugen, 1 → 836, 2 und mehr → 119.
  - Alle Quellschlüssel der Fugen lassen sich in `texte.quellen` auflösen, es fehlen 0.
  - `geltung`: original 562, quelle 434, redaktionell 832, offen 3.
- Kapitelzitate zu einer Quelle: In `baue-daten.mjs` holen `belegZeilen()` (Zeilen 156–163) und `zitatFuer()` (Zeilen 165–173) das Zitat aus dem Abschnitt `## Belege` des Ortstexts (`- [art] url:…|titel|"Zitat"`), und zwar über die URL oder die PMID.

### 4.2 Weg in drei Schritten

1. Ort `i` → `karte.orte[i]` (Titel und Kurztext) und `texte.orte[i]` (Text und eigene Quellschlüssel).
2. Fuge → `karte.fugen[fi]` mit `a`/`b` = Ortsindizes, dazu `quellen: [Schlüssel]`, `grenze`, `detail`, `geltung`, `status`.
3. Schlüssel → `texte.quellen[schlüssel]` → `titel`, `url`, `autoren`, `jahr`. Für die Anzeige `anzeigeTitel(titel)`. Autor und Jahr nur zeigen, wenn sie vorhanden sind, sonst weglassen und nichts ergänzen.

### 4.3 Beispiel: Ort 1031 „Die Angst vor Verlust ist groß“

- `karte.orte[1031]`: Region 6 „Beziehungen & Borderline“ (28 Orte, Indizes 1025–1052), `k: phenomenon`, `n: 4`. Kurztext: „Die Angst ist als Erleben ernst zu nehmen. Sie beweist nicht, dass eine Trennung bevorsteht, und verpflichtet das Gegenüber nicht zu unbegrenzter Rückversicherung.“
- `texte.orte[1031]`:
  - Abschnitte: Im Alltag (Pat-Szene), Beobachtung, Mögliche Deutung, Offene Fragen, Handlungsspielraum.
  - `quellen: []`, Herkunft „Borderline verstehen · Beziehungskarte“. Die technische Kennung steht in `id` und wird nicht angezeigt.
- Fugen an 1031:

| Index | Richtung | Partner | Art | Geltung | Quellen | Label |
|---|---|---|---|---|---|---|
| 1657 | 1030 → 1031 | Eine Antwort bleibt aus | einordnung | redaktionell | 0 | Eine mögliche Bedeutung des Wartens |
| 1659 | 1031 → 1032 | Wenn Nähe zur Verpflichtung wird | einordnung | redaktionell | 0 | Wenn Beruhigung eingefordert wird |
| 1660 | 1031 → 1034 | Auch meine Grenze gilt | einordnung | redaktionell | 0 | Bedürfnis trifft begrenzte Verfügbarkeit |
| 1749 | 1053 → 1031 | Verlassenheitsangst und Vermeidungsbemühungen (Diagnose & Differenzierung) | aussage | redaktionell, Status `redaktionelle-zuordnung` | 2 | unterscheidet Symptomdomäne und Alltagsszene |

- **Fuge 1749 bis zur lesbaren Quelle:**
  - `quellen` hat zwei Schlüssel (technisch, nicht anzeigen).
    - Erster Schlüssel: Titel „Borderline Personality Disorder – NIMH“, URL `https://www.nimh.nih.gov/health/publications/borderline-personality-disorder`, Autoren `""`, Jahr `""`.
    - Zweiter Schlüssel: Titel „S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022“, URL `https://register.awmf.org/de/leitlinien/detail/038-015`, Autoren `""`, Jahr `""`. Das Datum der Fassung steht nur im Titel.
  - Grenze der Fuge: „Die Szene belegt weder einen Bindungstyp noch Borderline. Ein klassifikatorischer Bezug ist kein Ursachenbeleg und keine Diagnose einer in einer Szene beschriebenen Person.“
  - `detail`: Das Dossier nennt Verlassenheitsangst eine klinische Symptomdomäne. Die fiktive Abschiedsszene zeigt nur einen Satz, Angst und Kontaktwunsch.
  - `anker`: „Vorhandene Quellenzuordnung dieses gelesenen Eintrags; kein neuer unabhängiger Beleg für die Querverbindung.“ Das heißt: Die zwei Quellen belegen Ort 1053, **nicht die Verbindung**.
- Ort 1053, `texte.orte[1053]`:
  - Dieselben zwei Quellschlüssel.
  - Abschnitte: Begriffstyp „Klinische Symptomdomäne“, Evidenzstatus „diagnostisch anerkannt“, Vertrauen/Grenze „Klassifikatorisch anerkannt; keine Ursachenevidenz“, Bedingungen „BPS-Kriterium; einzeln nicht spezifisch“, Aussagegrenze, Herkunft.
  - Kein Abschnitt `## Belege`, daher gibt es auch kein Zitat (`zitat: ''` in daten.js).
- In `daten.js` liegt genau dieses Paar mit `technisch.fugeIndex: 1749` vor, als Paar 3 im Bund.

---

## 5. Stabile Farben und Schriften

### 5.1 Gebietsfarben

- **Für die 10 Regionen der Karte gibt es feste Farben nur in der Schloss-Probe:** `schloss.js`, Zeilen 34–45. Für jede Farbe gibt es die Stufen tief, dunkel, Hauch, Licht und Faser:

| Region (karte.json) | Farbname | tief | dunkel | Hauch | Licht | Faser |
|---|---|---|---|---|---|---|
| ADHS · Randphänomene | blau | #2f45d6 | #1b2994 | #d3dbfb | #f1f4ff | #5367e0 |
| Neuroatlas | minze | #1a8467 | #0f5c47 | #c8ecdf | #eefaf5 | #2f9a7a |
| Phänomenatlas | koralle | #d05a33 | #8f3517 | #ffd9ca | #fff4ef | #d9734f |
| Beziehungen & Borderline | pflaume | #9a3a74 | #6a2050 | #f4dbea | #fcf3f8 | #ad5689 |
| Forschung & Einordnung | schiefer | #4d5e7e | #2f3b52 | #e0e6ef | #f6f8fb | #687a99 |
| Beziehungswerkstatt | ocker | #a86a12 | #6e4407 | #f6e2bf | #fdf7ec | #bd8231 |
| Diagnose & Differenzierung | petrol | #1f6f86 | #124858 | #cbe6ee | #f0f8fb | #3a879c |
| TraumaAtlas, Dynamikraum, Trigger & Kontext | – (Rückfall auf schiefer, Zeile 44) | | | | | |

  Drei Regionen haben also **keine eigene Farbe**: TraumaAtlas mit 168 Orten, Dynamikraum mit 14, Trigger & Kontext mit 8. Für die Welt muss das ergänzt werden, sonst haben vier Regionen dasselbe Grau.
  Grundtöne der Probe (`schloss.css`, Zeilen 2–14): `--grund #e9edf5`, `--papier #fbfcfe`, `--tinte #121733`, `--gold #f2b300`.
- **Der Atlas unter `/` färbt nicht nach diesen Regionen**, sondern nach **8 thematischen Richtungen**, in die er die Einträge über Wortmuster einsortiert:
  - `knowledge-landscape.mjs`, Zeilen 9–16: Bindung & Beziehung #416a91, Selbst & Persönlichkeit #8063a0, Trauma & Geschichte #a16c62, Körper & Regulation #428376, Neurodivergenz & Alltag #537b9d, Wahrnehmen & Erleben #997848, Schutz & Handlungsspielraum #557448, Modelle & Forschung #786f8c. Die Rückfall-Zuordnung Sammlung → Richtung steht in Zeile 51.
  - Gedämpfte Varianten derselben 8 Richtungen auf dunklem Grund: `living-network.mjs`, Zeilen 3–10, zum Beispiel #cba583 und #d5b5a1.
  - Weitere Paletten: `atlas-chapter-spaces.mjs`, Zeile 38, und `atlas-relationship-heatmap.mjs`, Zeile 43, jeweils #8ed2bd, #b7a5df, #ef967d, #9bc5df, #e9c778. `atlas-world-renderer.mjs`, Zeile 13, mit RGB-Tripeln.
  - Grundtöne in `styles.css`, Zeile 2: dunkel, `--paper #18252b`, `--ink #dbebe5`, `--mint #83cbbb`, `--peach #f4bc87`. Der Lichtraum ist hell.
- Bild: `bilder/sz-schloss-feld-desktop.png` zeigt die Membranfarben der Probe (Pflaume, Petrol, Ocker, Minze, Koralle, Blau, Schiefer) am echten Feld um Ort 1031.

### 5.2 Schriften

- `B/app/atlas/atlas-fonts.css`, Zeilen 1–60:
  - Selbst gehostete, unveränderte Variable Fonts (OFL 1.1), Herkunft in `assets/fonts/provenance.json`.
  - **Newsreader** normal und kursiv, Gewicht 200–800 (`assets/fonts/Newsreader-Variable.ttf`, `Newsreader-Italic-Variable.ttf`).
  - **Manrope** normal, 200–800 (`Manrope-Variable.ttf`). Manrope hat keine Kursive (Zeile 57).
  - Tokens (Zeilen 34–38): `--atlas-font-editorial` und `--atlas-font-reading` = Newsreader …, Georgia, serif; `--atlas-font-interface` = Manrope, „Avenir Next“, „Segoe UI“, sans-serif.
  - Eingebunden wird die Datei nur per `@import` in `atlas-stage-shell.css` und `personal-workbench.css`, **nicht** direkt in `index.html`.
- Die Schloss-Probe verwendet diese Schriften nicht. Sie nimmt Systemschriften: `--serif` „Iowan Old Style“/Charter/Palatino, `--grotesk` -apple-system/„SF Pro Text“ (`schloss.css`, Zeilen 12–13).
- Für `/welt/` ist `<link rel="stylesheet" href="/atlas-fonts.css">` möglich, die Dateien kommen aus `app/atlas` und sind auf Railway vorhanden.

---

## Offen bzw. nicht gesehen

- Die öffentliche URL des Railway-Dienstes schloss-schluessel-probe und seine Variablen habe ich nicht gesehen.
- Die Größe einer Laufzeitdatei mit allen rund 1800 Paaren ist nicht gemessen.
- Die Kartennäherung in 1.6 ist nicht bytegenau. Kurztexte wurden ohne `saeubern` genommen, die Lesart nach Dateireihenfolge statt nach Schlossrichtung, und Lesarten aus Sätzen fehlen.
- Ob die Videos der kanonischen Quelle nach der 302 Bereichsanfragen sauber bedienen, habe ich nicht geprüft. Geprüft habe ich nur HEAD auf ein JPG.
- `medien.json` und die Medienliste gehörten nicht zu diesem Auftrag.

## Bilder (eigene)

- `bilder/sz-schloss-feld-desktop.png`: Schloss-Probe, Feld um „Die Angst vor Verlust ist groß“, 1440 × 900, ohne Skriptfehler, localStorage leer
- `bilder/sz-schloss-feld-schmal.png`: dasselbe bei 390 × 844
