# Borderline verstehen · Fugenland 2 (Claude-Fassung)

Eigene Fassung des Harness Claude im Variantenraum `atlas-variantenvergleich-20261103`. Fugenland 2 ist ein Neuentwurf nach der Ablehnung vom 4. November 2026. Der abgelehnte Stand liegt im Git-Tag `abgelehnt-20261104`.

- Ergebnis, Prüfung und offene Grenzen: [QUELLEN-UND-ERGEBNIS-CLAUDE.md](QUELLEN-UND-ERGEBNIS-CLAUDE.md)
- Woher jede Idee stammt und was davon bedient wurde: [docs/HERKUNFT-DER-IDEEN.md](docs/HERKUNFT-DER-IDEEN.md)
- Vorher und nachher: [docs/VORHER-NACHHER.md](docs/VORHER-NACHHER.md)

```bash
node scripts/external-storage.mjs .      # Volume- und Zielprüfung
node scripts/build-content.mjs           # Lesebestand aus dem kanonischen Atlas ableiten (nur lesend)
node scripts/build-fugenraeume.mjs       # Fugenräume aus dem Lesebestand bilden
node server.mjs                          # http://127.0.0.1:4393/
PLAYWRIGHT_BROWSERS_PATH=$PWD/.cache/pw-browsers TMPDIR=$PWD/.cache/tmp node scripts/pruefung.mjs
```

`private-data/`, `data-readonly/`, `.cache/`, Videos und die Sichtungsbilder fremder Arbeitsstände bleiben lokal und außerhalb des Git.
