# Borderline verstehen · Fugenland (Claude-Fassung)

Eigene Fassung des Harness Claude im Variantenraum `atlas-variantenvergleich-20261103`. Herkunft, Grundidee, Prüfung und offene Grenzen: [QUELLEN-UND-ERGEBNIS-CLAUDE.md](QUELLEN-UND-ERGEBNIS-CLAUDE.md).

```bash
node scripts/external-storage.mjs .      # Volume- und Zielprüfung
node scripts/build-content.mjs           # Lesebestand aus dem kanonischen Atlas ableiten (nur lesend)
node server.mjs                          # http://127.0.0.1:4393/
PLAYWRIGHT_BROWSERS_PATH=$PWD/.cache/pw-browsers TMPDIR=$PWD/.cache/tmp node scripts/pruefung.mjs
```

`private-data/`, `data-readonly/`, `.cache/` und Videos bleiben lokal und außerhalb des Git.
