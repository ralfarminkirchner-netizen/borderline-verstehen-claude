# Lebende Welt · Design-Leinwand (Claude, 6. November 2026)

Stand: **Leinwand, noch kein App-Code.** Gebaut wird erst nach Ralfs Wahl, unter `/welt/` in `app/server.mjs`; `/` und `/schloss/` bleiben unverändert.

Bilder: `bilder/leinwand-20261106/` (Übersicht, Weltkarte, Gebiet, Startfall streng, Startfall Lesebrücke, Verstärkung, Klangquelle, Kurve).
Live ansehen (lokal): `node werkzeug/statisch.mjs 47231`, dann `http://127.0.0.1:47231/varianten/claude-welt/leinwand/index.html?tafel=welt` (weitere: `gebiet`, `begegnung&modus=streng|lesebruecke`, `verstaerkung`, `klang`, `kurve`, `uebersicht`).

## Ralfs Rückmeldung (6. November 2026, zweite Runde)

- **Nicht streng.** Jede verbindende Fuge lässt die Farben ineinanderlaufen, auch ohne Beleg; dann schwach (`mischGewicht`, Boden 0,3 × Artgewicht). Gewachsen wird nur über Belege, Endpunktquellen zählen halb. Trennend bleibt Wand, ohne Fuge zieht vorbei.
- **Keine Meta-Kommentare in der Welt.** Kein Wort darüber, wie gebaut, gesammelt, geprüft oder mit welchem Werkzeug erzeugt wurde. Gebietsnamen nach Inhalt statt nach Herkunftsprojekt; Fugenbezeichnungen und Grenzsätze laufen durch `kern/sprache.mjs` (Originalfelder bleiben in den Daten); Projektdateien erscheinen nicht als Quelle; Zähne der Schloss-Regel nicht mehr sichtbar.
- **Bildnisse ohne Namen.** Die sieben Marmorbildnisse stehen ohne Beschriftung in der Lichtung.
- Neue Bilder: `bilder/leinwand-20261106b/`. Kurve und Übersicht sind Werkstattblätter und gehören nicht in die App.

## Was die Bilder zeigten (erste Runde, überholt)

| Tafel | Inhalt, alles aus dem Bestand |
|---|---|
| Weltkarte | 10 Gebiete als Aquarellfelder aus der Dichte ihrer eigenen Orte (keine gezeichneten Grenzen), Membran dort, wo die Dichte die Schwelle erreicht; Überlappung in OKLab gemischt; Höhenlinien der Gesamtdichte; 1226 Wesen als atmender Schwarm; Namen der Gebiete auf Bögen über ihrer Membran, große Wesen wie Städte benannt. |
| Gebiet | Beziehungen & Borderline mit der Überlappung zu Forschung & Einordnung (Mischton Mauve), Wesen mit Armen in Richtung ihrer echten Fugen, Porträtlichtung der sieben Marmorbildnisse von Walter Andreas Kirchner an den beiden Orten, denen der Bestand sie zuordnet (1039, 1042), nur Titel und Jahr, keine Deutung. |
| Startfall streng | „Die Angst vor Verlust ist groß“ im Augenblick der Begegnung. Drei redaktionelle Einordnungen ohne Beleg **halten sich** (Arme greifen ineinander, Lücke bleibt, Zähne der Schloss-Regel sichtbar). „Verlassenheitsangst und Vermeidungsbemühungen“ ist durch eine **trennende** Fuge („unterscheidet Symptomdomäne und Alltagsszene“) als Wand angedrückt: Farben bleiben nebeneinander. „Abstand wünschen“ hat **keine Fuge** und zieht vorbei. Nichts mischt sich, nichts wächst — das ist der ehrliche Bestand. |
| Startfall Lesebrücke | Gleiche Szene, aber Quellen, die laut Anker nur zu den Endpunkten gehören, zählen halb. Dann mischen sich „Auch meine Grenze gilt“ mit „Nähe, Freiheit und Grenzen“ (Rose → Koralle → Sand) und mit „Schutz hängt nicht an einem Grenzwert“ (Rose → Mauve → Seegrün), dünn, weil schwach. Wachstum ×1,01. |
| Verstärkung | Der stärkste belegte Verbund im Bestand: Genetische Veranlagung, Autistische Merkmale, Unterschiedliche Entwicklungswege, Probabilistische Entwicklung (Studien 1953–2026). Die Körper verschmelzen, gestrichelte Kreise zeigen die Größe vor der Begegnung; Fläche ×1,77. Körnung = Zahl der Fugen jedes Wesens. |
| Klangquelle | „Trauma, Sicherheit und Behandlung“ (KI-Audio, 1:52) als Quelle im TraumaAtlas: 96 Ringe, jeder ein Abschnitt des Tons, Strichstärke = **gemessene** Lautheit (aus der Datei berechnet); Gehörtes dunkler; Untertitel des Bestands erscheinen als Schrift in der Welt; KI-Kennzeichnung und Prüfgrenze am Ort. |
| Kurve | Die offengelegte Wachstumskurve mit den echten Punkten. |

## Regeln, wie gebaut (Kern `kern/`)

- **Farbe** (`farbe.mjs`): Mischung in OKLab, Buntheit danach auf das gewichtete Mittel angehoben (kein Grau). Zehn feste Gebietsfarben in OKLCH, Nachbarn nie im Ton benachbart. Jedes Wesen leitet seinen Ton aus der Art seines Orts ab (Feld `k`), nie aus einer Kennung.
- **Lesart** (`begegnung.mjs`): trennend bei Art widerspruch/abstand/spannung/begrenzung, Typ nicht_dasselbe/verwechselbar/gegenteil/gegenbeispiel, Bezeichnungen „unterscheidet/trennt/grenzt/begrenzt/… gegenüber“ und verneinten Bezeichnungen; offen bei Art offen; sonst verbindend.
- **Stärke**: Art × Geltung × (1 − e^(−Werke/1,5)) (übernommen aus der Sichtung DATENMODELL). Endpunktquellen (Anker „kein neuer unabhängiger Beleg“) zählen streng nicht, im Lesebrücken-Modus halb.
- **Wachstum**: Fläche = Σ Teilflächen × (1 + g), g = W²/(1,2² + W²) × beste Geltung. Überadditiv am Anfang, Sättigung bei ×2.
- **Einrasten** (`regel.mjs`): `zaehne()` wörtlich aus der Schloss-Probe. Vorschlag: Mischen und Wachsen geschieht, solange die Wesen beieinander sind; **bleibend** wird ein Verbund nur, wenn die Zähne greifen (im Bestand heute 5 von 1797 Paaren). So entscheidet die Regel, nicht der Abstand.
- **Begegnung über Gebietsgrenzen**: Querfugen sind im Median 831 Einheiten lang, Wesen streifen ±40. Vorschlag: **Hinwenden ruft** — wendest du dich einem Wesen zu, ziehen seine Fugenpartner heran. Ohne Hinwenden begegnen sich Wesen innerhalb ihrer Gebiete und in den fünf echten Überlappungen.

## Zur Wahl (Ralf)

1. **Stärkeregel:** streng (nur Belege der Verbindung selbst; neue Farben über Gebietsgrenzen gibt es heute fast nirgends, nur eine tragende Querfuge im ganzen Bestand) oder Lesebrücke (Endpunktquellen halb, 51 Querbrücken, schwach und als Lesebrücke gekennzeichnet). Empfehlung: Lesebrücke als Einstellung im Zugang, streng als Vorgabe.
2. **Hinwenden ruft** die Fugenpartner herbei — ja/nein.
3. **Lage der Klangquelle**: der Bestand belegt nur Gebiete; gesetzt am Westrand des TraumaAtlas.
4. **Zugangsprofil**: Felder der Schloss-Probe (Umfang, Niveau, Blick, Reiz, Ton, Schrift) plus Bilddichte; dazu beim Start Bewegung und Schriftgröße aus den Atlas-Einstellungen lesen (berührt Regel 4 der Probe „kein localStorage“).
5. **Gebietsfarben**: diese zehn Töne zunächst nur in der Welt.

## Ehrlich: gebaut, geprüft, Urteil, offen

- **Gebaut:** Datenaufbereitung (`baue-welt.mjs`), Kern (Farbe, Feld, Leben, Begegnung, Regel, Zeichner), sieben Tafeln.
- **Selbst geprüft:** jede Tafel mehrfach am Bild (echter Chrome, 3200×2000), Überdeckungen korrigiert; `zaehne()` auf dem ganzen Bestand nachgerechnet (5 von 1797, wie die Sichtung). Einziger Konsolenfehler ist eine fehlende Favicon-Anfrage.
- **Mein Gestaltungsurteil:** Weltkarte und Verstärkung tragen; Gebiet und Klangquelle sind gut lesbar, die Wesen dort sind als Körper noch zu einfach (Kugeln mit Körnung). Der Startfall ist ehrlich, aber im strengen Modus bildarm — das liegt am Bestand, nicht an der Gestaltung.
- **Offen:** Bewegung (die Bilder sind Standbilder eines laufenden Modells), Leistung bei 1226 Wesen, schmale Ansicht, reduzierte Bewegung, Klang- und Videowiedergabe, Video-Lichtung (das Neurodivergenz-Video wäre der Fall für eine Überlappung von vier Gebieten). Abnahme: Ralf.
