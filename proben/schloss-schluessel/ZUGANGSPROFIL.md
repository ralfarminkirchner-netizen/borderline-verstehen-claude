# Zugangsprofil

Ein kleines Objekt, das sagt, **in welcher Form** ein Inhalt zu einem Menschen kommen soll – nie, **was** der Inhalt ist. Es gehört keiner App. Die Probe „Schloss und Schlüssel“ benutzt es als erste; KiNFORMER und andere Frontends können es unverändert übernehmen.

Datei: `zugangsprofil.js` (ohne Abhängigkeiten, vor allen anderen Skripten laden).

## Das Objekt

```js
window.ZUGANGSPROFIL = {
  umfang:  'kern' | 'mehr' | 'ganz',          // wie viel Text: ein Satz · ein Absatz · alles Menschenlesbare
  niveau:  'einfach' | 'alltag' | 'original', // wie gesagt: einfache Sprache · Alltagssprache · Bestandstext
  blick:   'innen' | 'aussen' | 'spielraum',  // Blickrichtung: innen erleben · von außen unterscheiden · Spielraum finden
  reiz:    'ruhig' | 'lebendig',              // Bewegung: nur Form und Farbe · fließende Energie, Glanz, Atmen
  ton:     false | true,                      // leise synthetische Klänge bei Einrasten, Anstoßen, Erlöschen
  schrift: 'normal' | 'gross',                // Schriftgröße, groß ≈ 125 %
};
```

`JSON.stringify(ZUGANGSPROFIL)` liefert genau diese sechs Felder. Zwei nicht aufzählbare Helfer kommen dazu:

- `ZUGANGSPROFIL.setze({ niveau: 'einfach' })` – ändert nur gültige Werte, meldet Änderungen an alle Beobachter.
- `ZUGANGSPROFIL.beobachte(fn)` – `fn(neu, vorher)` bei jeder Änderung; gibt eine Abmeldefunktion zurück.

Startwerte: `kern`, `original`, `innen`, `lebendig`, kein Ton, normale Schrift. Wünscht das System reduzierte Bewegung (`prefers-reduced-motion`), startet `reiz` auf `ruhig`.

## Regeln, die jede App einhält

1. **Der Kern bleibt unverändert.** Orte, Fugen, die fünf Riegel und ihre gemeinsame Regel, Gebietsfarben, Passung und Verlauf hängen nie vom Profil ab. Das Profil ändert nur die Form: Textlänge, Sprachniveau, Bewegung, Klang, Schriftgröße. Beispiel: Der Wort-Riegel vergleicht immer die Original-Kurztexte; beim Ablegen von Wörtern tritt eine vereinfachte Fassung zurück.
2. **Das Original ist immer einen Griff entfernt.** Jede nicht originale Fassung trägt am Text ein lesbares Zeichen „vereinfacht – KI-Entwurf“. Ein Griff daran zeigt das Original daneben, ohne das Profil zu verlassen.
3. **Vereinfachte Fassungen sind gekennzeichnete KI-Entwürfe.** Sie sind ungeprüft, fügen nichts hinzu (keine Ursachen, Häufigkeiten, Behandlungen, Wertungen) und lassen weg, was sich nicht ohne Bedeutungsverlust vereinfachen lässt. Fehlt eine Fassung, steht das Original da, mit dem Hinweis „einfache Fassung fehlt noch“.
4. **Nichts wird gespeichert.** Das Profil lebt nur im Speicher der offenen Seite: kein localStorage, keine Cookies, keine URL-Parameter, keine Netzanfragen.
5. **Bedienung direkt am Text, ohne Formular und ohne Knopfreihen.** Über dem Ortstext steht ein Satz: „Du liest ihn *von innen erlebt* ⟳, *im Original* ⟳.“ Die kursiven Wörter drehen sich beim Antippen (oder mit Pfeiltasten) weiter: Blickrichtung innen → außen → Spielraum, Sprache Original → Alltag → einfach. Am Textende stehen „weiterlesen ↓“ und „kürzer ↑“ (Umfang). Bewegung, Schrift und Ton sind drei Wörter im Satz oben rechts („Bewegung *lebendig* · Schrift *normal* · Ton *aus*“). Alles auch mit Tastatur.
6. **Blickrichtung nimmt nur vorhandene Abschnitte.** innen = „Was Menschen beschreiben“ / „Im Alltag“ (bei „alles“ dazu „Was Berichte sagen“), ohne Kapitel der Kurztext; außen = „Was das nicht ist“, „Verwandt und zu unterscheiden“; Spielraum = nur ein ausdrücklicher Abschnitt „Handlungsspielraum“. Fehlt er, steht ruhig „Dazu sagt der Bestand nichts.“ Abgelegt werden die Abschnitte von `baue-daten.mjs` unter `orte[…].blick`.

## Was die Werte in der Probe bewirken

| Feld | Wirkung |
|---|---|
| `umfang` | Ortstext in der Lesespalte (ein Satz · ein Abschnitt · alle Abschnitte der Blickrichtung), Kurztext an den Wänden des Schlosses (höchstens ein Abschnitt) |
| `niveau` | dieselben Ortstexte (Fassungen aus `zugang-texte.js`, über die Lage im Original-Gesamttext zugeordnet). Die Oberfläche selbst bleibt im Original. Beim Wort-Riegel stehen an den Wänden immer die Original-Kurztexte. |
| `blick` | welcher Abschnitt des Ortstexts in der Lesespalte steht (siehe Regel 6) |
| `reiz` | lebendig: Arme wachsen sichtbar aus den Körpern, haken mit einem Lichtpuls ein, reißen beim Erlöschen mit kleinen Fetzen; Bänder wiegen, Membranen atmen kaum merklich; die Kamera fährt. ruhig: keine Bewegung, Zustände nur durch Form (Länge, Strich, Knoten, Kitt) |
| `ton` | Web Audio, synthetisch, ohne Dateien: heller kurzer Klang beim Einrasten, dumpfer beim Anstoßen, fallender beim Erlöschen |
| `schrift` | alle Schriftgrößen × 1,25 |

## Texte für die Niveaus

`zugang-texte.js` setzt `window.ZUGANG_TEXTE` (Format und Herkunft: `zugang-texte-herkunft.md`):

- `orte[Titel][original|alltag|einfach][kern|mehr|ganz]`
- `oberflaeche[Schlüssel][original|alltag|einfach]`, Platzhalter `{name}` füllt die App

Eine App nimmt eine Ortsfassung nur, wenn deren `original.kern` mit dem eigenen Original übereinstimmt (gleicher Titel, anderer Ort – etwa zweimal „Hyperfokus“ – bekommt sonst keine fremde Fassung).
