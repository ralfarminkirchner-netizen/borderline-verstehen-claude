# Gesamt-App · Herkunft

- `atlas/` ist eine bytegleiche Kopie der Fassung **history-01** aus dem Variantenraum
  (`Artifacts/atlas-variantenvergleich-20261103/variants/history-01`), dem dist-Stand des Commits
  e2e6b0c „Schärfe Themenraum, Ast und die drei Bühnen im selben Lichtraum.“ (3.11.2026) im Projekt
  borderline-verstehen-atlas. Das kanonische Projekt wurde nicht verändert.
- Gewählt am 5.11.2026 (Claude), weil sie die ganze Borderline-App mit allen eingebauten Atlasräumen
  (Trauma, Phänomene, Neuro, ADHS), Medien, Ausprobieren und Meine Karte hell zeigt. Der von Ralf
  abgelehnte spätere Arbeitsstand („working“, Codex-Änderungen) ist es ausdrücklich nicht.
- Eigene Änderungen an der Kopie: Zugang „Schloss & Schlüssel“ in der Unternavigation von
  „Ausprobieren“ (`shared-atlas.mjs`, eine Stelle) und `schloss-zugang.css`.
- Ohne Profilserver: `/api/personal` fehlt, der Atlas meldet das selbst; nichts wird gespeichert.
  `atlas-work-supplement.mjs` fehlt schon im Originalstand.
- `/schloss/` liefert die Laufzeitdateien aus `proben/schloss-schluessel/`.
- Auf Railway fehlen die großen Medien (`assets/media`, 173 MB): Der Upload bricht nach 30 s ab. Der Server
  leitet sie auf dieselben Dateien im öffentlichen kanonischen Atlas um (borderline-verstehen-atlas-production);
  am 5.11. alle 42 gleich groß, 8 Prüfsummen stichprobenhaft gleich. Lokal und auf GitHub liegen sie vollständig.
