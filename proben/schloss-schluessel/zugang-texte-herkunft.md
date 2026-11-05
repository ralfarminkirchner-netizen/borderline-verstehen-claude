# Zugangsfassungen – Herkunft und Anschluss

`zugang-texte.js` setzt `window.ZUGANG_TEXTE`. Die Datei ist reine Daten. Sie macht keine Netzanfragen und speichert nichts. Einbinden: `<script src="zugang-texte.js"></script>` vor `schloss.js`.

- **Niveaus:** `einfach`, `alltag`, `original`
- **Umfänge** (nur bei Orten): `kern` (ein Satz), `mehr` (zwei bis drei Sätze), `ganz` (alles Menschenlesbare aus dem Bestand)
- **Kennzeichen:** Jede Fassung `alltag` und `einfach` ist ein KI-Entwurf und ungeprüft.
  - Bei Orten steht dafür `entwurf: true` im Niveau-Objekt. `original` hat `entwurf: false`.
  - Bei der Oberfläche steht es in `entwurf: { alltag: true, einfach: true }`.
  - Die Oberfläche soll das sichtbar sagen, zum Beispiel mit „KI-Entwurf, ungeprüft“.
- **Regel beim Schreiben:** Es wurde nur umformuliert und gekürzt. Es gibt keine neuen Ursachen, Häufigkeiten, Behandlungen oder Wertungen. Wo das Vereinfachen Bedeutung gekostet hätte, ist der Satz weggelassen (siehe unten).
- **Erzeugung:** Ein Hilfsskript, das nicht in der Probe liegt, hat die Datei gebaut.
  - `original` kommt maschinell aus `texte.json`/`karte.json`. Gesäubert wurde wie in `baue-daten.mjs` (`saeubern`).
  - `alltag` und `einfach` sind von Hand geschrieben.
  - Jedes Oberflächen-`original` wurde gegen den Quelltext von `schloss.js`, `index.html` und `daten.js` geprüft: kein Fehler. Die Platzhalter sind in allen drei Niveaus gleich.

## Orte: `orte["<Ortstitel>"]`

Schlüssel sind die Titel aus `daten.js`: Aufgabenstarre, Hyperfokus, Wartemodus, Body Doubling, Delay Aversion, Zeitblindheit, Aufgaben bleiben offen.

### Die drei Umfänge im Original

| Umfang | Was `original` enthält | Entspricht in schloss.js |
|---|---|---|
| `kern` | `ersterSatz(ort.kurz)` | `S.entfaltet = 0` (`.kurz-erst`) |
| `mehr` | ganzer Kurztext `ort.kurz`. Bei „Aufgaben bleiben offen“: Kurztext plus der jeweils erste Satz der Absätze „ADHS“ und „Zwanghafte Persönlichkeitsstörung“ | `S.entfaltet = 1` |
| `ganz` | Absätze, getrennt durch `\n\n` (siehe unten) | `S.entfaltet = 2` ersetzt Kurztext und `ort.mehr` |

`ganz` bei den sechs Randphänomen-Orten besteht aus diesen Absätzen:

1. der Kurztext
2. „Wie es sonst genannt wird: …“
3. „Was das nicht ist: …“
4. „Verwandt und zu unterscheiden: …“
5. „Offene Fragen: …“
6. „Aussagegrenze: …“

Bei „Aufgaben bleiben offen“ ist `ganz` der ganze Eintrag aus dem Neuroatlas.

`alltag.ganz` und `einfach.ganz` haben dieselbe Zahl an Absätzen in derselben Reihenfolge. Jeder Absatz beginnt mit einem Vorsatz, der zum Niveau passt:

| Absatz | alltag | einfach |
|---|---|---|
| Andere Namen | „Andere Namen:“ | „Andere Namen dafür:“ |
| Was das nicht ist | „Was es nicht ist:“ | „Was es nicht ist:“ |
| Verwandt und zu unterscheiden | wie im Original | „Was nah ist und was anders ist:“ |
| Offene Fragen | wie im Original | wie im Original |
| Aussagegrenze | „Grenze dieser Aussage:“ | „Grenze:“ |

Wer die Absätze getrennt setzen will, teilt mit `text.split('\n\n')` und am ersten `: `.

### Ein Hinweis zum Wort-Kamm

Der Wort-Kamm vergleicht Wortstämme im Kurztext (`autoWoerter` über `ort.kurz`). Das soll beim Wechsel des Niveaus auf `original.mehr` bleiben. Sonst ändert sich die Passung mit der Ansicht, und das Invariante ginge verloren. Die anderen Niveaus sind nur Anzeige.

## Oberfläche: `oberflaeche["<schlüssel>"]`

Jeder Eintrag sieht so aus: `{ original, alltag, einfach, entwurf }`.

- **Platzhalter** wie `{titel}` füllt der Bau-Agent zur Laufzeit. Sie entsprechen den Template-Variablen in `schloss.js`.
- **Zusammengesetzte Texte** (Ansagen, Verlaufseinträge, aria-labels) baut der Bau-Agent aus diesen Bausteinen. Dafür gibt es keine eigenen Schlüssel.

### Kopf und Rahmen (index.html, schloss.js)

| Schlüssel | Stelle |
|---|---|
| `kopf.titel` | `index.html` `<h1>` |
| `kopf.unterzeile` | `index.html` `.kopf p` |
| `kopf.probe` | `index.html` `p.probe` |
| `bund.titel` | `schloss.js` `bund-titel` |
| `rolle.schloss`, `rolle.schluessel` | `baueOrt(…, 'Schloss' / 'Schlüssel')`, im Kopf des Orts `${rolle} · ${gebiet}` |
| `ort.mehrTitel.verwandt`, `ort.mehrTitel.imEintrag` | `ort.mehr[].titel` in `baueOrt` (`.ort-mehr-titel`), Werte aus `daten.js` |

### Regeln „Wie die Zähne entstehen“ (index.html `details.regeln`)

| Schlüssel | Stelle |
|---|---|
| `regeln.titel` | `<summary>` |
| `regeln.merk` | `p.regeln-merk` |
| `regeln.einleitung` | erster `<p>` nach `regeln-merk` |
| `regeln.fuss` | `p.regeln-fuss` |
| `regeln.lesart.titel`, `regeln.lesart.text` | Abschnitt „Lesart · Walze“, `<h3>` und `<p>` |
| `regeln.beleg.titel`, `regeln.beleg.text` | Abschnitt „Beleg · Kerbe“ |
| `regeln.grenze.titel`, `regeln.grenze.text` | Abschnitt „Grenze · Zahn“ |
| `regeln.wort.titel`, `regeln.wort.text` | Abschnitt „Wort · Kamm“ |

### Zähne: Namen und Lesartwörter

| Schlüssel | Stelle |
|---|---|
| `zahn.name.lesart`, `.beleg`, `.grenze`, `.wort` | `SLOT_NAME`. Bei `einfach` heißt Beleg „Quelle“. |
| `zahn.greift`, `zahn.greiftNicht` | `baueZaehne`, aria-label „Greift“ / „Greift nicht“. Auch Ansage. |
| `zahn.ki` | `[KI-Entwurf aus deinen Worten]` im Grenzfeld und in `baueZaehne` |
| `lesart.wort.gegenpol` | `lesarten[].wort` = „Gegenpol“ (Walze `.zahn-wert`, `.walze-vor` und `.walze-nach`, Naht-Marke) |
| `lesart.wort.naeheNichtIdentitaet` | = „Nähe, nicht Identität“ |
| `lesart.wort.naehe` | = „Nähe“ |
| `lesart.wort.koennteZusammenhaengen` | = „könnte zusammenhängen“ |
| `lesart.wort.obTrennbar` | = „ob trennbar“ |
| `lesart.wort.abstand` | = „Abstand“ |
| `lesart.wort.keineFuge` | = „keine Fuge“ |
| `lesart.wort.gegenteilAmStart` | `lesarten[].auchImSatz` = „Gegenteil am Start“ |

Die Lesartwörter ordnet der Bau-Agent über ihren Originalwert zu, also `original === l.wort`.

### Bestandsfuge (Werte aus daten.js, `fugen[]`)

| Schlüssel | Feld und Wert |
|---|---|
| `fuge.label.gegenpol` | `label` = „im Original als Gegenpol beschrieben“ |
| `fuge.label.benachbart` | `label` = „im Original als begrifflich benachbart beschrieben“ |
| `fuge.label.unterscheiden` | `label` = „muss unterschieden werden von“ |
| `fuge.geltung.redaktionell` | `geltungWort` = „redaktionell zugeordnet“ |
| `fuge.status.vorgeschlagen` | `statusWort` = „vorgeschlagen“ |
| `fuge.status.redaktionelleZuordnung` | `statusWort` = „redaktionelle Zuordnung“ |
| `fuge.grenze.startUndAbschluss` | `grenze` der Fuge Aufgabenstarre → Aufgaben bleiben offen. Sichtbar über `zahn.grenze.imBestand`. |

Auch hier gilt die Zuordnung über den Originalwert.

### Inhalte an den Zähnen (`zahnInhalt`)

**Lesart**

| Schlüssel | Stelle |
|---|---|
| `zahn.lesart.keineFuge` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.lesart.von` | `von: 'deine Lesart'` |
| `zahn.lesart.deine` | `{woher}` = Ergebnis von `woherText` |
| `zahn.lesart.woherBeide`, `.woherEiner` (`{ort}`), `.woherBestand` | `woherText` |
| `zahn.lesart.auchImSatz` | `{woerter}` = `auchImSatz.join('“, „')` |
| `zahn.lesart.imBestand` | `{artWort}` und `{geltungWort}` |
| `zahn.lesart.bestand` | `{label}`, `{geltungWort}`, `{statusZusatz}` = `', ' + statusWort` oder leer |
| `zahn.lesart.drehen` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.lesart.nurDiese` | auch in der Ansage zur Lesart |

**Beleg**

| Schlüssel | Stelle |
|---|---|
| `zahn.beleg.ziehWert`, `zahn.beleg.ziehMehr` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.beleg.deinVon` | `von` |
| `zahn.beleg.deinGehoert` | `{titel}`, `{art}`, `{ort}` = `b.vonOrt` |
| `zahn.beleg.deinUngeprueft` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.beleg.imOrtstext` | `{zitat}` = gekürztes Zitat |
| `zahn.beleg.herausnehmen` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.beleg.eigeneQuellen`, `zahn.beleg.eineEigeneQuelle` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.beleg.traegt` | `{quellenWort}` = einer der beiden vorigen Schlüssel, `{liste}` = Quellenliste |
| `zahn.beleg.ohneWert`, `zahn.beleg.hohl`, `zahn.beleg.holen` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |

**Grenze**

| Schlüssel | Stelle |
|---|---|
| `zahn.grenze.deinWert`, `zahn.grenze.dein` (`{grenze}`), `zahn.grenze.wiederOeffnen` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.grenze.begrenzt`, `zahn.grenze.imBestand` (`{grenze}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.grenze.ohneWert`, `zahn.grenze.ragt`, `zahn.grenze.wischen` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |

**Wort**

| Schlüssel | Stelle |
|---|---|
| `zahn.wort.uebersetzungVon`, `zahn.wort.uebersetzung` (`{a}`, `{ortA}`, `{b}`, `{ortB}`), `zahn.wort.nurSprache`, `zahn.wort.herunterBeide` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.wort.trefferVon`, `zahn.wort.treffer` (`{ort}`, `{anderer}`, `{woerter}`), `zahn.wort.nurWort`, `zahn.wort.herunterEins` | `nurWort` auch beim automatischen Wortstamm |
| `zahn.wort.stamm` | `{paare}` = Liste der Paare „x“ – „y“ |
| `zahn.wort.halbVon` (`{ort}`), `zahn.wort.halb` (`{wort}`, `{ort}`), `zahn.wort.halbZieh` (`{anderer}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.wort.ziehWert`, `zahn.wort.ziehMehr` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `zahn.wort.keinWert`, `zahn.wort.keinStamm`, `zahn.wort.oeffnen` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |

### Statuszeile über dem Spalt (`zeichneStatus`)

| Schlüssel | Stelle |
|---|---|
| `status.schatten` (`{titel}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.schattenStoesst` (`{zahn}` = Zahnname) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.schattenAlle`, `status.schattenLiegt` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.eingerastet`, `status.eingerastetHinweis` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.beleg`, `status.belegHinweis` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.uebersetzen`, `status.uebersetzenHinweis` (`{ort}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.wortAblegen`, `status.wortAblegenHinweis` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.grenze`, `status.grenzeHinweis` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.alle`, `status.alleHinweis` (`{titel}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `status.offen`, `status.offenStart` (`{titel}`), `status.offenGueltig` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |

### Meldungen in der Statuszeile (`melde(wort, text)`)

| Schlüssel | Stelle |
|---|---|
| `meldung.stoesst` (`{zahn}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.anstoss.gegenpol`, `.abstand`, `.greiftNicht` (`{wort}`) | `lesartAnstoss` |
| `meldung.anstoss.grenze`, `.wortHalb` (`{wort}`), `.wortKein`, `.beleg` | `kontakt` |
| `meldung.haeltNicht` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.haelt.keineFugeHohl`, `meldung.haelt.keineFuge` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.haelt.mulde` (`{wort}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.haelt.kerbe` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.erloschen` | Der Text kommt aus `nachAenderung`. |
| `meldung.geloest`, `meldung.geloestText` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.nurDieseLesart`, `.nurDieseLesart.keineFuge`, `.nurDieseLesart.keineAndere` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.nochNichtDurch`, `meldung.nochNichtDurchText` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.nachgewachsen`, `meldung.nachgewachsenText` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.traegtSchon`, `meldung.traegtSchonText` | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.zaehltNicht`, `meldung.zaehltNichtText` (`{wort}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.nurBeiEinem`, `meldung.nurBeiEinemText` (`{wort}`, `{ort}`) | im Abschnitt oben genannte Funktion; Originaltext dort suchen |
| `meldung.schonEingerastetText` | Das Meldungswort ist `status.eingerastet`. |

### Kurzzustand, Naht-Marken, Grenzfeld

| Schlüssel | Stelle |
|---|---|
| `kurz.mitQuelle`, `kurz.ohneQuelle`, `kurz.grenzeBenannt`, `kurz.ohneGrenze`, `kurz.einWortGemeinsam`, `kurz.keinWortGemeinsam` | `kurzZustand` |
| `marke.lesartDeine`, `marke.lesartBestand` | `baueMarken` |
| `marke.belegVonDir`, `marke.belegBestand` | `baueMarken` |
| `marke.grenzeDeine`, `marke.grenzeBestand`, `marke.benannt` | `baueMarken` |
| `marke.wortUebersetzung`, `marke.wortVonDir`, `marke.wortBeide` | `baueMarken` |
| `grenzfeld.label`, `grenzfeld.platzhalter`, `grenzfeld.hilfe` | `grenzeFeld.innerHTML` |

Zugeordnet wird über Funktionsnamen und den Originaltext: Jeder `original`-Wert steht wörtlich (bis auf Platzhalter) in `schloss.js` oder `index.html` und lässt sich dort suchen. Zeilennummern sind weggelassen, weil `schloss.js` parallel weiterbearbeitet wird.

## Bewusst weggelassen

### In allen Niveaus, also auch in `original.ganz`

- **Abschnitte „Was im Manual steht“, „Was Studien sagen“, „Was Berichte sagen“ und „Belege“.** Sie tragen Abrufvermerke und Kennungen: NLM-Ask mit Datum, PMID, DOI, PMCID, ICD-Entity-Nummer, Heftnamen, Quellenzahlen. Sie sind Meta über die Quellenlage. Die Quellen selbst zeigt die Probe schon über `quellen` und den Beleg-Keil.
- **Hyperfokus, Offene Fragen, zweiter Satz** („Initiation … war im Hyperfokus-Heft am 02.09.2026 nicht mehr als Quelle vorhanden (0 Quellen) …“). Das ist ein Abrufvermerk mit Zählung. Er sagt nichts über das Phänomen.
- **Technische Verweise** wie „(MODEL; → …)“ oder „(→ …)“. Sie sind wie in `baue-daten.mjs` entfernt.

### Nur in `einfach`

Diese Sätze ließen sich nicht ohne Bedeutungsverlust vereinfachen, ohne etwas zu erfinden. `alltag` behält sie.

- **Aufgabenstarre:** der Satz zur Heritabilität („Hohe populationsweite Heritabilität schließt Passung/Gerüst … nicht aus“).
- **Hyperfokus:**
  - die Sätze zur Flow-Forschung und zu Passungskosten/h²
  - der Satz zur Dopaminmangel-Erklärung, weil „Dopamin“ ein Fachwort ist, das man erklären müsste
- **Wartemodus:** der Satz zur Termin-/Kalenderumwelt und Onset-Ursache.
- **Body Doubling:**
  - der Satz zur ICF
  - der Satz zur These „Umwelt formt Kosten, ohne Onset zu schalten“
- **Delay Aversion:**
  - der Teilsatz „motivationaler Pfad ≠ rGE-Schuldnarrativ“
  - „Discounting“ in den Offenen Fragen
  - in der Aussagegrenze „zeitliches Diskontieren“
  - die Autorennamen bei den anderen Namen
- **Zeitblindheit:** der Satz zu Timing-Laborbefunden gegenüber Symptomen nach extremer früher Umwelt. Aus der Aussagegrenze ist der Teil über das damalige Notebook mit Leitlinien-Portalseiten herausgenommen. Nur der Schluss bleibt: Ein Wort, das auf einer Übersichtsseite fehlt, ist kein Beweis, dass es nirgends vorkommt.
- **Aufgabenstarre:** In der Aussagegrenze ist „Initiation-Notebook“ ersetzt durch „die Sammlung von Studien dazu“.

### Nur in `alltag`

- **Aufgabenstarre:** „Initiation-Notebook“ ist umschrieben als „Studiensammlung zum Anfangen“.
- **Body Doubling:** „im Kopf genannt“ ist umschrieben als „oben im Eintrag genannt“.

## Bewusst stehen gelassen, ohne Erklärung

- **Diagnosenamen** (ADHS, Depression, Autismus, Schizophrenie, zwanghafte Persönlichkeitsstörung) bleiben auch in `einfach` unerklärt. Eine Erklärung wäre eine neue medizinische Aussage.
- **Ortsnamen** (Wartemodus, Body Doubling, Delay Aversion …) bleiben als Namen in Anführungszeichen stehen. Wenn `einfach` sie kurz erklärt, dann nur mit Worten aus dem Bestandstext des jeweiligen Orts. Ein Beispiel: „Delay Aversion“ heißt „Warten ist schwer“ – das steht so im Ortstext von Delay Aversion.
- **Lesart und Passung:** „deine Lesart, kein fachlicher Befund“ steht in allen Niveaus wörtlich. `einfach` ergänzt es nur bei `regeln.merk`, und zwar mit „So liest du es. Fachleute haben das nicht geprüft.“ Der zweite Satz deutet „kein fachlicher Befund“ aus. Er fügt keine Sachaussage hinzu.

## Nicht abgedeckt

- **Ansagen für Screenreader** (`ansage(...)`), **Verlaufseinträge** (`verlauf`/`nachAenderung`) und die **aria-labels**. Sie werden aus den Bausteinen oben zusammengesetzt. Der Bau-Agent kann sie aus `status.*`, `meldung.*` und `zahn.*` bilden.
- **`fugen[].detail`.** In `schloss.js` wird es nicht angezeigt.
- **Quellentitel und Gebietsnamen** („ADHS · Randphänomene“, „Neuroatlas“). Das sind Namen, keine Texte zum Umformulieren.
