# Codex · Die leuchtenden Ufer

Eine eigene Gestaltungsrichtung der Lebenden Welt. **Stand: Design-Leinwände zur Wahl, noch keine begehbare Anwendung.** Die beiden beauftragten Prompts verlangen diese Wahl vor Anwendungscode. Keine andere Stimme wurde zur Gestaltung eingesehen.

Die [Bildfolge](index.html) lässt sich ohne Installation im Browser öffnen. Sie enthält sechs vollständig gerasterte Entwürfe und braucht dafür keinen Server. Die PNGs sind die verbindlichen Prüfbilder dieser Runde; die SVGs bleiben bearbeitbare Zeichnungen. Die Bildfolge ist eine Entwurfsansicht, keine Simulation funktionierender Navigation oder Medienwiedergabe.

| Bild | Inhalt |
|---|---|
| [Weltkarte](bilder/01-weltkarte.png) | Alle 1.226 Orte in zehn tatsächlich angeordneten Gebieten |
| [Beziehungsgebiet](bilder/02-beziehungsgebiet.png) | Alle 28 Orte des Gebiets, vier Startverbindungen, Überlappung mit Diagnose und Werkstatt |
| [Begegnung](bilder/03-begegnung.png) | Verlustangst und eigene Grenze; begrenzter OKLab-Farbfaden, kein behauptetes Wachstum |
| [Klanglichtung](bilder/04-klanglichtung.png) | Bestehendes TraumaAtlas-Bild und zugeordneter Platz für die tatsächliche KI-Audioübersicht |
| [Schmale Begegnung](bilder/05-begegnung-schmal.png) | Eigenständig gesetztes Bild mit 430 Pixel Breite |
| [Begegnungsgrammatik](bilder/06-begegnungsgrammatik.png) | Ausdrückliche Gestaltungsspezifikation mit schematischen Körpern, einschließlich bedingten Wachstums |

Gestaltung, Begründung und spätere Interaktionen: [DESIGN.md](DESIGN.md). Quellenprüfung: [BEGEGNUNGSBELEGE.md](BEGEGNUNGSBELEGE.md). Vollständiger Dateibestand mit Zuordnungen und Prüfgrenzen: [MEDIEN-INVENTAR.md](MEDIEN-INVENTAR.md). Tatsächliche Prüfung: [PRUEFUNG.md](PRUEFUNG.md).

## Entwürfe neu erzeugen

Im eigenen Worktree:

```sh
python3 varianten/codex-welt/leinwand.py
node varianten/codex-welt/render-leinwand.cjs
```

Der Generator prüft vor dem Schreiben das registrierte externe Volume. Der Renderer verwendet vorhandenes `playwright-core` aus dem kanonischen Checkout und echtes Google Chrome; optional lässt sich der Modulpfad über `CODEX_WELT_PLAYWRIGHT` setzen. Profil, Cache und temporäre Dateien liegen extern. Es wird nichts installiert. Für PNGs ist kein Server erforderlich. Das eingebettete SVG-Bild wird von der kanonischen öffentlichen Medienadresse geladen; keine Originalmediendatei wird kopiert oder hochgeladen.

Nur Zweig `variante/codex-lebende-welt`, nur dieser Variantenordner. Kein Railway-Deploy, kein Merge, keine Änderungen an Atlas, Server, Proben oder anderen Stimmen. Die spätere Einbindung nach Ralfs Wahl übernimmt Claude.
