// Baut den Weltbestand der Lebenden Welt aus dem Lesebestand (nur lesend).
// Eingabe: data-readonly/karte.json, data-readonly/texte.json
// Ausgabe: varianten/claude-welt/daten/welt.json (kompakt) und daten/texte/<index>.json (Wortlaut je Ort, bei Bedarf geladen)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lesart, staerke, mischGewicht } from './kern/begegnung.mjs';
import { GEBIETSNAMEN, sichtbareBezeichnung, sichtbarerText, quelleSichtbar, sichtbarerFliesstext, sichtbarerKernsatz } from './kern/sprache.mjs';
import { GEBIETSFARBEN } from './kern/farbe.mjs';

const hier = path.dirname(fileURLToPath(import.meta.url));
const wurzel = path.resolve(hier, '../..');
const karte = JSON.parse(fs.readFileSync(path.join(wurzel, 'data-readonly/karte.json'), 'utf8'));
const texte = JSON.parse(fs.readFileSync(path.join(wurzel, 'data-readonly/texte.json'), 'utf8'));
const ziel = path.join(hier, 'daten');
fs.mkdirSync(path.join(ziel, 'texte'), { recursive: true });

const quellIndex = new Map();
const quellen = [];
function quelle(schluessel) {
  if (quellIndex.has(schluessel)) return quellIndex.get(schluessel);
  const q = texte.quellen[schluessel];
  if (!q) return null;
  const i = quellen.length;
  const eintrag = { titel: q.titel || '', url: q.url || '', autoren: q.autoren || '', jahr: q.jahr || '', stelle: q.stelle || '', art: q.art || '', schluessel };
  eintrag.sichtbar = quelleSichtbar(eintrag);
  quellen.push(eintrag);
  quellIndex.set(schluessel, i);
  return i;
}

const grad = new Array(karte.orte.length).fill(0);
for (const f of karte.fugen) { grad[f.a]++; grad[f.b]++; }

const fugen = karte.fugen.map((f) => ({
  a: f.a, b: f.b, art: f.art, typ: f.typ, lesart: lesart(f), staerke: +staerke(f).toFixed(4), staerkeLesebruecke: +staerke(f, 'lesebruecke').toFixed(4), misch: +mischGewicht(f).toFixed(4), anker: f.anker.length > 0,
  label: f.label, detail: f.detail, grenze: f.grenze, geltung: f.geltung, herkunft: f.herkunft,
  // sichtbar: nur Sprache zum Thema (kern/sprache.mjs); Originalfelder oben bleiben Herkunftsdaten
  sicht: { label: sichtbareBezeichnung(f.label), detail: sichtbarerText(f.detail), grenze: sichtbarerText(f.grenze) },
  quellen: f.quellen.map(quelle).filter((x) => x !== null),
}));

const orte = karte.orte.map((o, i) => ({ t: o.t, r: o.r, k: o.k, s: sichtbarerKernsatz(o.s), x: o.x, y: o.y, n: o.n, grad: grad[i] }));

const gebiete = karte.regionen.map((g, i) => ({
  name: GEBIETSNAMEN[i], herkunftsname: g.name, zusammenfassung: g.summary, zahl: g.count, x: g.x, y: g.y, r: g.r, links: g.links, lch: GEBIETSFARBEN[i].lch,
}));

for (let i = 0; i < karte.orte.length; i++) {
  const t = texte.orte[String(i)] || texte.orte[i];
  if (!t) continue;
  fs.writeFileSync(path.join(ziel, 'texte', `${i}.json`), JSON.stringify({
    body: sichtbarerFliesstext(t.body), tags: t.tags || [], quellen: (t.quellen || []).map(quelle).filter((x) => x !== null),
    herkunft: t.herkunft?.titel || '', schluessel: t.id,
  }));
}

const welt = { format: 'lebende-welt', version: 1, gebaut: new Date().toISOString().slice(0, 10), gebiete, orte, fugen, quellen };
fs.writeFileSync(path.join(ziel, 'welt.json'), JSON.stringify(welt));
const zaehl = fugen.reduce((m, f) => ((m[f.lesart] = (m[f.lesart] || 0) + 1), m), {});
console.log(`welt.json: ${gebiete.length} Gebiete, ${orte.length} Orte, ${fugen.length} Fugen`, zaehl, `${quellen.length} Quellen`,
  `${(fs.statSync(path.join(ziel, 'welt.json')).size / 1024).toFixed(0)} KB`);
