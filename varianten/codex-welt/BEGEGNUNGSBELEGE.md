# Begegnungsbelege der Codex-Welt

Stand: 5. November 2026. Audit der vorhandenen Daten, keine neue klinische Aussage. Geprüft wurden die vier Fugen am Startort „Die Angst vor Verlust ist groß“ sowie die Fuge zwischen Schlaf und Aufmerksamkeit. Die Indizes sind nullbasiert und beziehen sich auf `data-readonly/karte.json`; Quellenmetadaten stammen aus `data-readonly/texte.json`. Indizes und Quellenkennungen gehören ausschließlich in diese Dokumentation, nicht in die normale Oberfläche.

## Vier tatsächliche Fugen am Start

Der Startort ist `orte[1031]`. Seine vier vorhandenen Fugen sind sämtlich **redaktionell**. Eine Verbindung ist damit im Bestand vorhanden; ihre Existenz belegt keine kausale Wechselwirkung.

### Fuge 1657 — Eine Antwort bleibt aus → Die Angst vor Verlust ist groß

`a: 1030`, `b: 1031`, `art: einordnung`, `geltung: redaktionell`; keine zugeordneten Quellen.

Label: „Eine mögliche Bedeutung des Wartens“.

Originalpassage: „Eine unbeantwortete Nachricht kann in einer erfundenen Situation als drohender Verlust erlebt werden. Der Zeitablauf beweist diese Bedeutung nicht.“

Gespeicherte Grenze: „Redaktioneller Lernanschluss; keine nachgewiesene Ursache, Diagnose oder individuelle Vorhersage.“ Herkunft: „Vorhandene Beziehungskarte · redaktionelle Lesebeziehung“.

**Tragweite:** Eine mögliche Lesart einer erfundenen Situation. Kein Beleg, dass Warten Verlustangst verursacht oder beide einander überadditiv verstärken.

### Fuge 1659 — Die Angst vor Verlust ist groß → Wenn Nähe zur Verpflichtung wird

`a: 1031`, `b: 1032`, `art: einordnung`, `geltung: redaktionell`; keine zugeordneten Quellen.

Label: „Wenn Beruhigung eingefordert wird“.

Originalpassage: „Aus eigener Angst kann eine Forderung nach Kontakt entstehen. Die Angst begründet keinen Anspruch auf Verfügbarkeit.“

Gespeicherte Grenze und Herkunft entsprechen Fuge 1657.

**Tragweite:** Redaktioneller Anschluss zwischen Angst, Kontaktforderung und Verfügbarkeit. Kein empirisch geprüfter Verstärkungsmechanismus.

### Fuge 1660 — Die Angst vor Verlust ist groß → Auch meine Grenze gilt

`a: 1031`, `b: 1034`, `art: einordnung`, `geltung: redaktionell`; keine zugeordneten Quellen.

Label: „Bedürfnis trifft begrenzte Verfügbarkeit“.

Originalpassage: „Ein starkes Bedürfnis und die Grenze des Gegenübers dürfen zugleich ernst genommen werden.“

Gespeicherte Grenze und Herkunft entsprechen Fuge 1657.

**Tragweite:** Gleichzeitige Anerkennung zweier Perspektiven. Keine Wirkungsprüfung und keine ausdrücklich gesetzte Inkommensurabilität.

### Fuge 1749 — Verlassenheitsangst und Vermeidungsbemühungen → Die Angst vor Verlust ist groß

`a: 1053`, `b: 1031`, `art: aussage`, `geltung: redaktionell`, `status: redaktionelle-zuordnung`.

Label: „unterscheidet Symptomdomäne und Alltagsszene“.

Originalpassage: „Das Dossier bezeichnet Verlassenheitsangst als klinische Symptomdomäne. Die fiktive Abschiedsszene zeigt dagegen nur einen Satz, berichtete Angst und einen Kontaktwunsch. Nebeneinander wird sichtbar, wie viel mehr als eine einzelne Episode eine diagnostische Beurteilung benötigt.“

Gespeicherte Grenze: „Die Szene belegt weder einen Bindungstyp noch Borderline. Ein klassifikatorischer Bezug ist kein Ursachenbeleg und keine Diagnose einer in einer Szene beschriebenen Person.“

Zugeordnete Quellen:

- `source:bpd:ae3d3e3e08a0aad`: [Borderline Personality Disorder – NIMH](https://www.nimh.nih.gov/health/publications/borderline-personality-disorder).
- `source:bpd:58630727af716c7`: [S3 Borderline-Persönlichkeitsstörung 038-015; Fassung 14.11.2022](https://register.awmf.org/de/leitlinien/detail/038-015).

Der gespeicherte Quellenanker gilt für Ort 1053 und lautet ausdrücklich: „Vorhandene Quellenzuordnung dieses gelesenen Eintrags; kein neuer unabhängiger Beleg für die Querverbindung.“ Herkunft: „Redaktionelle Verbindung vorhandener Atlasinhalte“.

**Tragweite:** Die Quellenzuordnung der klinischen Symptomdomäne wird erhalten. Sie verwandelt die redaktionelle Gegenüberstellung mit der Szene weder in eine Diagnose noch in zwei unabhängige Interaktionsbelege.

## Ein tatsächlich quellengebundener Wirkungsfall

**Fuge 464 — Schlaf und Tagesfunktion → Aufmerksamkeit im Alltag.** `a: 180`, `b: 171`, `art: aussage`, `geltung: quelle`, `status: intervention`. Beide Orte liegen in derselben Region.

Label: „kann unter experimenteller Einschränkung verändert werden“.

Originalpassage: „Bei Jugendlichen mit bestehender ADHS verstärkte eine kurze Schlafrestriktion elternberichtete Unaufmerksamkeit und Tagesmüdigkeit.“

Unmittelbar folgende Einschränkung im selben Datensatz: „Nur 48 von 72 Eingeschlossenen analysiert; die Computeraufgabe zeigte kein entsprechendes einheitliches Muster. Kein Nachweis der Entstehung von ADHS.“ Kontext: „Jugendliche mit ADHS im Überkreuzversuch“; „Je eine Woche Schlafbedingungen“.

Quelle `fundus-source:bruecke-becker-2019`: Becker et al. (2019), [Shortened Sleep Duration Causes Sleepiness, Inattention, and Oppositionality in Adolescents With Attention-Deficit/Hyperactivity Disorder: Findings From a Crossover Sleep Restriction/Extension Study](https://pubmed.ncbi.nlm.nih.gov/30768404/). Herkunft der Fuge: „Phänomenatlas · Neurodiversität: Gene, Umwelt und Entwicklung“.

**Tragweite:** Ein begrenzter experimenteller Effekt von Schlafrestriktion auf bestimmte berichtete Merkmale bei Jugendlichen mit bereits bestehender ADHS. Der Befund belegt weder die Entstehung von ADHS noch eine überadditive Wechselwirkung zweier eigenständiger Phänomene. Er liefert keine quantitative Regel für die Fläche eines verschmolzenen Darstellungskörpers.

## Inkommensurabilität und Evidenzgrenze

Keine der fünf auditierten Fugen setzt ausdrücklich Inkommensurabilität. Ein zusätzlicher Suchlauf über die 1.831 Fugen nach `inkommens` und `unvereinbar` in den Relations- und Erläuterungsfeldern ergab keinen Treffer. Vorhandene Kategorien wie `spannung`, `abstand` oder `widerspruch` sind dafür kein automatischer Ersatz. Das ist eine Aussage über den geprüften Datenbestand und die Suche, kein Beweis, dass sachliche Inkommensurabilität grundsätzlich ausgeschlossen wäre.

Die auditierten Passagen enthalten **keinen empirischen Beleg für überadditive Wirkung**. Ein offenes Wirkungs-Gate ist deshalb weder durch die vier Startfugen noch durch den Schlafversuch gerechtfertigt.

## Prüfung der vorgeschlagenen Darstellungsregel

Für diese Variante gilt folgende sichtbare, editorische Entwurfsregel:

```text
S = Aa + Ab
Aout = S * (1 + 0.20 * g * w_art * (1 - exp(-E / 2)))
```

- `g = 1` ausschließlich bei tatsächlicher Fuge, erfülltem `zaehne().alle`, ausdrücklich geprüftem Interaktionsbeleg und keiner gesetzten Inkommensurabilität; sonst `g = 0`.
- Für quellengebundene Fugen gilt `w_art = 1` bei `folge`, `0.75` bei `aussage`, `0.5` bei `zusammenhang`; in allen anderen Fällen `0`.
- `E` zählt kuratierte, unabhängige Interaktionsbelege für genau diese gemeinsame Wirkung. Rohe Quellenzahl zählt nicht; `E` bezeichnet weder Effektstärke noch Evidenzqualität.

Gewichte und 20-Prozent-Grenze sind **Darstellungskonventionen, keine Empirierechnung**. Für `S > 0` und endliches `E ≥ 0` gilt `1 ≤ Aout/S < 1.20`; die Zusatzfläche wächst sättigend, der Radius einer kreisförmigen Darstellung mit `sqrt(Aout/S)`. Eine zusätzliche Kappung durch `Amax` entfällt.

**Aktueller Stand:** Alle hier auditierten Paare haben `g = 0`, einschließlich des Schlafversuchs. Fehlender Interaktionsbeleg bleibt eine offene Erkenntnisgrenze; er beweist weder Nullwirkung noch Inkommensurabilität. Blatt 06 zeigt mit schematischen, unbenannten Körpern ausschließlich die grafische obere Schranke und keinen belegten Quellenfall.

Diese Regel beschreibt den Entwurf dieser Variante; sie setzt keine neue allgemeine Projektsperre.
