# Die leuchtenden Ufer · Gestaltungsentscheidung

Codex, 5. November 2026. Entwurf zur menschlichen Wahl. Die Gestaltung beginnt mit dem Ganzen und führt über ein tatsächliches Gebiet in eine konkrete Beziehungsszene. Inhalt und Herkunft sind aus dem vorhandenen Bestand gelesen; die Zeichnungen behaupten keine schon implementierte Interaktion.

## Ein Prinzip

**Jeder Ort besitzt einen Körper; jede Verbindung braucht einen Grund.** Durchlässige, mehrfach gezeichnete Membranen geben den Gebieten Tiefe. Einzelne Orte erhalten unregelmäßige Körper mit einer eigenen Pigmentnuance und Anschlüssen. Farbe bildet Zugehörigkeit ab; ein Faden verbindet, ohne zwei Perspektiven zu einem Symptom zusammenzuschieben. Ein ruhiger heller Wassergrund lässt dunkle Schrift und Material hervortreten.

Die Welt liegt rechts im offenen Raum. Links beginnt eine inhaltliche Spur, die beim gewählten Ort bleibt. Im Gebiet tritt die Überschrift zurück; die Orte und ihre tatsächlichen Nachbarn nehmen den Raum ein. In der Begegnung stehen Zitat und Körper nebeneinander. Schmal folgen Körper, Szene und Handlungsspielraum einer vertikalen Leserichtung.

```text
WELT                   GEBIET                    BEGEGNUNG
Name      Membranen    Name     Überlappung      Szene       Körper
          + Schwärme          Orte + Fugen                   Farbfaden
Startort                                                    Gegenüber
   → Weg               ausgewählter Ort          Herkunft   Handlung
```

Ausrichtung: feste linke Textkante, freie kurvige Landschaft; Namen nah an ihren Körpern; keine rechteckigen Träger um Inhalt. Der Zeichnungsrand ist kein Produktpanel.

## Typografie und sechs Farbrollen

Baskerville trägt große Ortsnamen und das tatsächliche Szenenzitat. Avenir Next trägt kurzen Sachtext, Herkunft und Wege. Beide sind auf dem vorhandenen Mac gerendert; SVG-Fallbacks sind Iowan Old Style/Georgia und Avenir/Arial. Es werden keine Schriftdateien nachgeladen.

| Rolle | Entscheidung |
|---|---|
| Wasser | Weiß bis blasses Blaugrau `#EDF3F6` / `#E4EEF1` |
| Schrift | Dunkles Petrol `#173E4B` |
| Nebenstimme | Gedämpftes Petrolgrau `#526F79` |
| Gebietsidentität | Zehn feste Pigmente aus `leinwand.py`, unabhängig vom Maßstab |
| Individuum | Stabile, deterministische Nuance seines Gebietspigments; Grenze und Angst bleiben in derselben Rosenfamilie |
| Begegnung | Wahrnehmungsbezogene Mischung in OKLab, begrenzt auf den Verbindungsfaden |

Die Textnuancen der Gebietspigmente werden in OKLab Richtung Petrol abgedunkelt. Die Gebietskörper behalten ihre Grundfarbe. Eine persönliche Nuance wechselt beim Zoomen nicht. Die hier gewählte Palette ist eine eigene Entwurfsentscheidung; sie wird nicht als bereits atlasweit akzeptierte Farbvereinbarung ausgegeben.

## Welche realen Daten sichtbar sind

Welt: alle 1.226 Orte, alle zehn Gebietspositionen und Bestandszahlen aus `karte.json`. Um lesbar zu bleiben, zeigt die Ferne nur eine deterministisch ausgewählte Teilmenge tatsächlicher gebietsübergreifender Fugen. Die nicht gezeichneten Fugen bleiben im Datenbestand erhalten. Es gibt keine aus Distanz erfundenen Kanten. Die 63 Fehlstellen sind erfasst, im Weltbild aber noch nicht als eigene begehbare Landschaft gestaltet.

Gebiet: alle 28 Orte von Beziehungen & Borderline und der tatsächlich verknüpfte Diagnoseort. Ihre Anordnung ist eine eigene redaktionelle Komposition, keine behauptete klinische Distanz. Vier Verbindungen am Startort sind hervorgehoben, weitere vorhandene Beziehungen treten zurück. Die Gebietsmembranen markieren Überschneidungen, keinen Wirkungsnachweis.

Start: „Die Angst vor Verlust ist groß“ mit „Eine Antwort bleibt aus“, „Wenn Nähe zur Verpflichtung wird“, „Auch meine Grenze gilt“ und „Verlassenheitsangst und Vermeidungsbemühungen“. Die Abschiedsszene bleibt einschließlich des allein geplanten Abends erhalten. Der diagnostische Nachbar bleibt eine andere Evidenzebene. Einzelne Armspitzen stehen für vorhandene Anschlussmöglichkeiten; Richtung und sichtbare Höchstzahl von acht sind zeichnerisch vereinfacht, keine vollständige Kantenliste.

## Farbe und bedingtes Wachstum

Der Generator wandelt sRGB zuerst in lineares sRGB und dann in OKLab. Neun dort berechnete Mischstufen werden als SVG-Gradient ausgegeben, damit nicht der Browser allein in RGB interpoliert. Endpunkte: `#B45D7B` und `#C58A7A`; Mitte: `#BD747B`. Das ist eine wahrnehmungsbezogene digitale Farbmischung, keine physikalische Pigmentmischung.

Die konkrete redaktionelle Fuge zwischen Angst und Grenze bekommt einen schmalen Farbfaden. Die Flächen beider Körper werden dabei nicht vergrößert. Ihre Quellen begründen keine überadditive Verstärkung. Blatt „Begegnungsgrammatik“ zeigt Wachstum daher nur an unbenannten schematischen Körpern. Es ersetzt keinen tatsächlich quellengebundenen Wachstumsfall.

Für eine spätere geprüfte Verstärkung ist folgende **grafische Konvention dieser Variante** vorgeschlagen, keine medizinische Effektkurve:

```text
S = Aa + Ab
Aout = S × [1 + 0.20 × g × w_art × (1 − exp(−E / 2))]
```

`Aa` und `Ab` sind Darstellungsflächen, keine Krankheitsschwere. `g` ist nur dann eins, wenn eine tatsächliche Fuge besteht, `zaehne().alle` ein Einrasten erlaubt, die gemeinsame Wirkung durch ausdrücklich geprüfte Interaktionsbelege getragen wird und kein begründeter inkommensurabler Zustand gesetzt ist. Ansonsten ist `g` null. Quellengebundene `folge` erhält als Entwurfsgewicht 1, `aussage` 0,75 und `zusammenhang` 0,5; alle anderen Fugenarten erhalten null. Diese Gewichte sind offengelegte Gestaltungsentscheidungen. Keine der Benennungen öffnet allein das Gate.

`E` zählt kuratierte, voneinander unabhängige Interaktionsbelege genau dieser gemeinsamen Wirkung. Rohe Quellenzahlen, wiederholte Zitationen, Quellennähe und Distanz zählen nicht als unabhängige Belege. Für positive Flächen gilt `S ≤ Aout < 1,20 × S`; die Zusatzfläche wächst sättigend. Die Radien wachsen mit der Quadratwurzel des Flächenfaktors. Die Grenze von 20 Prozent hält die Begegnung sichtbar, ohne die Karte durch Dominanz eines Körpers unlesbar zu machen. Sie ist keine Schätzung eines klinischen Risikos.

Bei sämtlichen in dieser Runde auditierten Paaren bleibt `g = 0`. Ohne Fuge ziehen Körper vorbei. Inkommensurabilität bleibt ein gesonderter begründeter Zustand mit zwei getrennten Farben; fehlende Evidenz oder ein Widerspruch reichen zur automatischen Zuweisung nicht. Die Schloss-und-Schlüssel-Funktion bleibt ein Experimentierwerkzeug; sie ist kein wissenschaftliches Kausalitätsprüfverfahren. Ein selbst aufgelegter Beleg oder eine eigene Grenze allein begründet deshalb kein empirisches Wachstum.

## Medienort

Das vorhandene Bild „Mensch und Verbindungen“ bleibt als Bild erkennbar und wird organisch beschnitten. Ein eindeutig benannter Audiozugang gehört zur tatsächlich vorhandenen NotebookLM-Übersicht „Trauma, Sicherheit und Behandlung“. Die Lichtung verortet deren bestehende Zuordnungen TraumaAtlas, Diagnose & Differenzierung und Forschung & Einordnung. Sie wird nicht als direkter Quellenbeleg der Abschiedsszene dargestellt. Das Bild erhält keinen Play-Knopf, keine erfundene Waveform und keine erfundene Laufzeit. Keine automatische Wiedergabe.

Das vollständige 42-Dateien-Inventar liegt gesondert vor. Eine Bestandsprüfung ist keine vollständige Rezeption sämtlicher Audios und Videos. Weder vollständige Medienrezeption noch funktionierende Wiedergabe wird in dieser Runde behauptet. Später werden Originalmedien ausschließlich über geprüfte Weiterleitungen zur kanonischen Quelle eingebunden.

## Was aus den Vorläufern weiterlebt

Vor dem eigenen Entwurf wurden die tatsächlichen Prüfbilder aus der Ernte angesehen und `KOMBINATION.md` vollständig gelesen:

- `ta5wasser-01b-zelle-faeden-ausschnitt.png`: Körper, feine Fasern und verzweigte Anschlüsse tragen die Idee des lebenden Ortes. Übernommen ist die Grammatik, keine Bildkopie.
- `cur-koerper-21b-arme-ausschnitt.png`: Fünf Anschlussarme machen Möglichkeiten räumlich greifbar. Hier werden Anschlüsse und tatsächlich gezogene Beziehungen unterschieden.
- `lichtgrund-06-morph-zum-garten-mitte.png`: Übergänge zwischen Maßstäben tragen die Vorstellung einer zusammenhängenden Welt. Bewegung ist bislang Entwurfsabsicht.
- `history-01-09-fuge-im-netz.png`: Zeigt die Gefahr eines gleichförmigen Fadengewirrs. Die gewählte Verbindung erhält hier Vorrang, die übrigen treten zurück.

Diese Dateien liegen unter `/Volumes/ThunderBolt4_2TB/Development/Artifacts/fugenland-bausteine-claude-20261105/bilder/`. Zusätzlich wurde `variants/original-04` aus dem vorhandenen Variantenvergleich mit eigenem lokalen Server und echtem Chrome geöffnet und unter `bilder/referenz-original-04-chrome.png` aufgenommen. Wasserraum, leuchtende Anschlüsse und räumliche Tiefe sind nachvollziehbare Vorläufer. Die dichte dunkle Bedienoberfläche wird gestalterisch überarbeitet. Andere Stimmen wurden nicht eingesehen.

## Nach einer Auswahl zu bauen

Canvas mit quellenstabilen Daten und Detailstufen: Ferne als Schwärme, mittlere Entfernung als Körper mit ausgewählten Namen, Nähe als Szene mit Herkunft und tatsächlichen Nachbarn. Ruhiges Driften innerhalb der Gebiete; Fugen durch Bestand und Einrasten, niemals durch Kollisionsabstand. Organismen sollen nicht bei jedem Rendering neu würfeln.

Maus, Touch und Tastatur sollen denselben Weg von Welt über Gebiet und Ort zur Quelle eröffnen. Der zugängliche Textbaum braucht Namen und echte Beziehungen, unabhängig von Canvas. „Zur Herkunft“ führt zum vollständigen Beleg und seiner Grenze. Nur eine ausdrücklich geöffnete technische Ansicht darf Kennungen offenlegen.

Ein atlasweites Zugangsprofil steuert Textumfang, Niveau, Reizmenge, Bilddichte und Ton. „Ruhe“ und `prefers-reduced-motion` stoppen Driften und pulsierende Übergänge; keine Quelle oder Verbindung darf dadurch verloren gehen. Audio bleibt stumm bis zum bewussten Start; Transkript und fachliche Einordnung liegen am Klangort. Diese Funktionen sind noch nicht implementiert.

## Eigenes Urteil und offene Prüfung

Stark ist die Begegnungsnähe: erwachsene Typografie, ein konkreter Satz und zwei selbständige Körper. Der Medienort macht vorhandenes Material sichtbar. Das Beziehungsgebiet bleibt lesbar, ohne die Quellebene des Diagnoseorts zu verwischen.

Die Weltferne ist ruhiger, aber noch zu gleichmäßig: In den großen Regionen werden Körper zu Punktfeldern. Erst bewegte Schwärme mit sparsameren, aber differenzierten Fernsilhouetten können beweisen, ob daraus tatsächlich Leben entsteht. Die feinen Gebietsgrenzen sind bewusst zurückhaltend und brauchen einen späteren Zustand mit höherem Kontrast. Ob Bewegung, Quellwege, Klang und flüssige 1.226 Körper zusammen tragen, ist offen. Ralfs gestalterische Abnahme ist offen.
