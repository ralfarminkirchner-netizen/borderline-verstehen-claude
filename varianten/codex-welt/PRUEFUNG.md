# Tatsächlicher Prüfstand · Codex

Stand: 5. November 2026. Sechs statische Design-Leinwände zur gestalterischen Wahl. **Keine begehbare Anwendung, keine menschliche Abnahme.**

## Gebaut und gesichtet

- Weltkarte mit allen 1.226 tatsächlichen Orten und zehn Regionen; Gebietsansicht mit allen 28 Beziehungsorten und tatsächlichen Fugen.
- Begegnung mit realer Abschiedsszene, vollständigem Satz zum geplanten Abend allein und den vier tatsächlichen Startnachbarn. Farbidentität bleibt zwischen den Maßstäben erhalten.
- Klanglichtung mit vorhandener öffentlicher Illustration und gestaltetem Zugang zur zugeordneten Audioübersicht; eigenständig gesetzte schmale Begegnung; separates Blatt zur Begegnungsgrammatik.
- Vorherige Materialversuche und die ursprüngliche Variante 04 gesichtet. Letztere tatsächlich in Google Chrome geöffnet und als [Referenzbild](bilder/referenz-original-04-chrome.png) festgehalten. Keine anderen Stimmen dieser Runde gelesen.
- Alle 42 vorhandenen Mediendateien inventarisiert. Dateiexistenz, Format und Zuordnung sind keine vollständige inhaltliche Rezeption; Grenzen stehen im [Medieninventar](MEDIEN-INVENTAR.md).

## Tatsächlich geprüft

Alle sechs SVGs wurden mit echtem Google Chrome über das vorhandene `playwright-core` gerastert: fünf Leinwände mit 1.800 × 1.160 Pixeln und eine eigene schmale Setzung mit 430 × 1.340 Pixeln. Anschließend visuell angesehen. Kein `pageerror` in diesem Durchlauf. Die letzte Rasterung und die Bildfolgenprüfung stehen maschinenlesbar in [RENDERPRUEFUNG.json](RENDERPRUEFUNG.json).

Die Bildfolge wurde bei 1.440 × 1.000 und 430 × 900 Pixeln in Google Chrome geöffnet. Alle sechs Bilder vollständig geladen, kein seitlicher Überlauf, alle vier lokalen Dokumentverweise vorhanden, keine gemeldeten Seitenfehler. Die zugehörigen Screenshots liegen unter `bilder/pruefung-bildfolge-desktop.png` und `bilder/pruefung-bildfolge-schmal.png`. Das prüft die statische Entwurfsansicht; die mobile Bedienbarkeit einer späteren Anwendung folgt daraus nicht.

Zusätzlich gegen `data-readonly/karte.json` geprüft: 1.226 Orte, zehn Regionen, 1.831 Fugen und die vier Startnachbarn stimmen mit den Entwurfsdaten überein. Alle sechs SVGs sind gültiges XML; ihre sichtbaren Textsetzungen enthalten keine Quellkennungen. Die neun Farbstufen haben die korrekten Pigment-Endpunkte und die dokumentierte OKLab-Mitte. Keine App-Funktionen daraus abgeleitet.

Die vier Startfugen sowie der zusätzliche Schlafversuch wurden quellenbezogen auditiert. Keiner dieser Fälle begründet ein überadditives Wachstum. Die Wachstumsformel ist eine begrenzte editorische Darstellungskonvention; in allen auditierten Fällen bleibt ihr Gate geschlossen. Siehe [Begegnungsbelege](BEGEGNUNGSBELEGE.md).

Der erste Chrome-Rasterversuch blieb mit GPU-Unterstützung hängen. Die eigenen Prozesse wurden beendet; der anschließende Durchlauf mit deaktivierter GPU war erfolgreich. Das ist ein Rasterbefund, kein Leistungstest der künftigen Welt.

Externe Ablage vor Schreibarbeiten durch `scripts/external-storage.mjs` gegen registriertes Volume und UUID geprüft. Nach dem Schreiben liegen eine PNG-Datei und die tatsächlich angelegte Chrome-Profildatei `Local State` auf demselben Dateisystem wie das registrierte externe Volume. Cache und temporärer Arbeitsbereich liegen extern. Keine Installation zusätzlicher Abhängigkeiten.

## Gestalterisches Urteil und offene Arbeit

Die Nahansicht hat die deutlichste eigene Handschrift: freie Typografie, eigenständige Körper und eine präzise begrenzte Verbindung. Der Weltmaßstab trägt den vollständigen Bestand, bleibt in dichten Gebieten aber noch zu punktförmig. Die spätere Bewegung muss dort Material und Orientierung hinzufügen. Die zurückhaltenden Gebietsgrenzen benötigen ebenfalls einen Test in der begehbaren Anwendung.

Offen bleiben Ralfs gestalterische Wahl, begehbare Maßstabswechsel, Drag-Begegnungen, Bewegung und Ruhemodus, erreichbare Quellen, echte Audio-/Videowiedergabe, Tastatur- und Screenreader-Bedienung sowie Leistung mit dem gesamten Datenbestand. Die statische Bildfolge ist kein Nachweis dafür. Keine Veröffentlichung auf Railway, kein Merge in den Hauptzweig.

Reproduzierbar über `leinwand.py` und `render-leinwand.cjs`. Beide schreiben ausschließlich nach geprüfter externer Pfadauflösung. Keine Originalmediendateien kopiert oder hochgeladen; die SVG-Illustration verweist auf den vorhandenen kanonischen öffentlichen Medienpfad.
