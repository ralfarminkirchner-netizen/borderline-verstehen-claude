// Leitet aus dem abgeleiteten Lesebestand (karte.json, texte.json) die konkreten Fugenräume ab.
// Nur lesend gegenüber dem Bestand. Jede Rauminstanz nennt, aus welchen Originalkanten und Feldern sie gebildet wurde.
// Die Raumart ist eine redaktionelle Lesart dieser Fassung, keine fachliche Prüfung.
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireExternalWriteTarget } from './external-storage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DATA = join(ROOT, 'data-readonly');
const karte = JSON.parse(await readFile(join(DATA, 'karte.json'), 'utf8'));
const texte = JSON.parse(await readFile(join(DATA, 'texte.json'), 'utf8'));
const { orte: O, fugen: F, regionen: R } = karte;

if (texte.orte.length !== O.length) throw new Error('texte.json und karte.json sind nicht gleich lang');
const quelle = (q) => { const x = texte.quellen[q]; return { schluessel: q, titel: x?.titel || 'Quelle ohne Titel im Bestand', autoren: x?.autoren || '', jahr: x?.jahr || '', url: x?.url || '', art: x?.art || '' }; };
const ort = (i) => ({ i, id: texte.orte[i].id, t: O[i].t, r: O[i].r, gebiet: R[O[i].r].name, k: O[i].k, s: O[i].s, x: O[i].x, y: O[i].y });
const kante = (n) => { const f = F[n]; return { n, a: f.a, b: f.b, label: f.label, detail: f.detail, grenze: f.grenze, frage: f.frage, typ: f.typ, art: f.art, grund: f.grund, herkunft: f.herkunft, status: f.status, quellen: f.quellen.map(quelle) }; };

// Inhaltswörter für den Wortabgleich der Übersetzungsfuge. Wortgleichheit ist keine Bedeutungsgleichheit.
const STOP = new Set('der die das und oder ein eine einer eines einem einen ist sind wird werden wurde im in am an auf aus bei mit von vom zu zum zur für über unter nach vor als wie auch nicht kein keine sich es er sie wir ihr man dass daß den dem des durch so nur noch schon sehr mehr weniger kann können muss oft etwa ohne um bis gegen zwischen diese dieser dieses jede jeder jedes wenn weil denn aber doch hier dort was wer wo wie sein seine ihre ihren ihrem'.split(' '));
const woerter = (s) => [...new Set((s.toLowerCase().match(/[a-zäöüß][a-zäöüß-]{2,}/g) || []).filter((w) => !STOP.has(w)))];
const stamm = (w) => w.replace(/(ungen|ung|en|er|es|e|n|s)$/, '');

// 1 · Übersetzung: derselbe Titel in verschiedenen Gebieten, jeweils eigener Wortlaut.
const nachTitel = new Map();
O.forEach((o, i) => { const k = o.t.trim().toLowerCase(); if (!nachTitel.has(k)) nachTitel.set(k, []); nachTitel.get(k).push(i); });
const uebersetzung = [];
for (const ids of nachTitel.values()) {
  const gebiete = new Map(); for (const i of ids) if (!gebiete.has(O[i].r)) gebiete.set(O[i].r, i);
  if (gebiete.size < 2) continue;
  const fass = [...gebiete.values()].slice(0, 3).map((i) => ({ ...ort(i), text: texte.orte[i].body || O[i].s, herkunft: texte.orte[i].herkunft?.titel || '' }));
  if (fass.some((f) => !f.text) || new Set(fass.map((f) => f.text)).size < 2) continue;
  const w = fass.map((f) => woerter(f.text)); const st = w.map((l) => new Set(l.map(stamm)));
  const gemeinsam = w[0].filter((x) => st.slice(1).every((s) => s.has(stamm(x))));
  const nurHier = w.map((l, k) => l.filter((x) => st.every((s, j) => j === k || !s.has(stamm(x)))));
  uebersetzung.push({ art: 'uebersetzung', titel: fass[0].t, fassungen: fass, wortabgleich: { gemeinsam, nurHier }, gebildetAus: 'gleicher Ortstitel in mehreren Gebieten des Bestands' });
}

// 2 · Gegenhalt: Widerspruch, Gegenpol, Abstand. Gegenseitige Kanten werden ein Raum mit zwei Aussagen.
const gegenArten = new Set(['widerspruch', 'spannung', 'abstand']);
const gegenhalt = []; const gesehen = new Map();
F.forEach((f, n) => {
  if (!gegenArten.has(f.art)) return;
  const key = [Math.min(f.a, f.b), Math.max(f.a, f.b)].join('-');
  if (f.a === f.b) return;
  if (!gesehen.has(key)) { gesehen.set(key, { art: 'gegenhalt', modus: f.art, seiten: [ort(f.a), ort(f.b)], aussagen: [], gebildetAus: `Originalkanten der Lesart „${f.art}“` }); gegenhalt.push(gesehen.get(key)); }
  gesehen.get(key).aussagen.push(kante(n));
});

// 3 · Schwelle: ein Ort, an dem mehrere Geltungsgrenzen oder Bedingungen hängen. Jede ist ein Riegel.
const riegel = new Map();
F.forEach((f, n) => {
  if (!(f.grenze || f.art === 'bedingung' || f.art === 'begrenzung')) return;
  if (f.a === f.b) return;
  for (const i of [f.a, f.b]) { if (!riegel.has(i)) riegel.set(i, []); riegel.get(i).push(n); }
});
const schwelle = [...riegel.entries()].filter(([, ns]) => ns.length >= 2).sort((a, b) => b[1].length - a[1].length)
  .map(([i, ns]) => ({ art: 'schwelle', ort: ort(i), text: texte.orte[i].body || O[i].s, riegel: ns.map((n) => ({ ...kante(n), gegenueber: ort(F[n].a === i ? F[n].b : F[n].a) })), gebildetAus: 'Kanten mit Geltungsgrenze oder Bedingung an diesem Ort' }));

// 4 · Überschneidung: Kontexte (Stimmen), die Phänomene beschreiben. Mehrseitig, kein Zentrum.
const stimmen = new Map();
F.forEach((f, n) => {
  if (f.label !== 'wird beschrieben im Kontext') return;
  const [ph, kx] = O[f.a].k === 'context' ? [f.b, f.a] : [f.a, f.b];
  if (O[kx].k !== 'context') return;
  if (!stimmen.has(kx)) stimmen.set(kx, { ...ort(kx), phaenomene: [], quellen: new Set() });
  const s = stimmen.get(kx); s.phaenomene.push(ph); f.quellen.forEach((q) => s.quellen.add(q));
});
const stimmListe = [...stimmen.values()].map((s) => ({ ...s, quellen: [...s.quellen].map(quelle) }));
const phaenomenOrte = [...new Set(stimmListe.flatMap((s) => s.phaenomene))].map(ort);
const ueberschneidung = { art: 'ueberschneidung', stimmen: stimmListe, phaenomene: phaenomenOrte, gebildetAus: 'Originalkanten „wird beschrieben im Kontext“ mit ihrer Quelle' };

// 5 · Fehlstelle: untersucht, aber kein Befund im Bestand; ein Kapitel ohne Eintrag; Aussagen ohne Grenzangabe.
const fehl = new Map();
F.forEach((f, n) => {
  if (f.art !== 'offen' || f.a === f.b) return;
  if (!fehl.has(f.b)) fehl.set(f.b, { art: 'fehlstelle', modus: 'befund-fehlt', ort: ort(f.b), raender: [], gebildetAus: 'Originalkanten „untersucht in / im Kontext von“ ohne festgehaltenen Befund' });
  fehl.get(f.b).raender.push({ ...kante(n), gegenueber: ort(f.a) });
});
const fehlstelle = [...fehl.values()].sort((a, b) => b.raender.length - a.raender.length);
const kapitelMitOrt = new Set(texte.orte.map((t) => t.herkunft?.pfad || '').filter(Boolean).map((p) => p.split('/').pop()));
for (const k of texte.fundus) if (![...kapitelMitOrt].some((p) => p === k.datei)) {
  fehlstelle.unshift({ art: 'fehlstelle', modus: 'nicht-erreichbar', kapitel: { datei: k.datei, titel: k.titel, anfang: k.text.slice(0, 900) }, raender: [], gebildetAus: 'Fundus-Kapitel ohne eigenen Ort im Bestand' });
}
const ohneGrenze = F.filter((f) => f.art === 'aussage' && !f.grenze).length;

// 7 · Entstehung: ein Ort, der aus mehreren Herkünften hervorgegangen ist (Zusammenfluss), mit seinen Nachfolgern.
const herk = new Map(), nach = new Map();
F.forEach((f, n) => {
  if (f.label !== 'hervorgegangen aus' || f.a === f.b) return;
  if (!herk.has(f.a)) herk.set(f.a, []); herk.get(f.a).push(n);
  if (!nach.has(f.b)) nach.set(f.b, []); nach.get(f.b).push(n);
});
const entstehung = [...herk.entries()].filter(([, ns]) => new Set(ns.map((n) => F[n].b)).size >= 2).sort((a, b) => b[1].length - a[1].length)
  .map(([i, ns]) => ({ art: 'entstehung', ort: ort(i), text: texte.orte[i].body || O[i].s,
    herkuenfte: ns.map((n) => ({ ...kante(n), quelle: ort(F[n].b), text: texte.orte[F[n].b].body || O[F[n].b].s })),
    nachfolger: (nach.get(i) || []).map((n) => ({ ...kante(n), ziel: ort(F[n].a) })),
    gebildetAus: 'Originalkanten „hervorgegangen aus“ mit mindestens zwei Herkünften' }));

// 6 · Herkunft und Geltung: Schichten jeder Kante (Original → Ableitung → Lesart → persönliche Revision) und Schlussproben.
const proben = [
  { id: 'pfad', satz: 'A hängt mit B zusammen, B mit C – also stützt A die Aussage C.', herkunft: 'Grok · Fugenfassung, Erprobung „pfad-stuetzt“', regel: 'Ein begehbarer Pfad ist kein Schluss.' },
  { id: 'ueberschneidung', satz: 'Das Phänomen kommt in beiden Beschreibungen vor – also haben beide dieselbe Ursache.', herkunft: 'Atlasregel „unspezifische Überschneidung“', regel: 'Eine Überschneidung unterscheidet nicht.' },
  { id: 'wort', satz: 'Beide Fassungen benutzen dieselben Wörter – also meinen sie dasselbe.', herkunft: 'Verkörperungsvertrag (Transduktion und Invarianz)', regel: 'Sprachähnlichkeit ist keine Bedeutungsgleichheit.' },
  { id: 'endpunkt', satz: 'Beide Orte sind belegt – also ist auch ihre Verbindung belegt.', herkunft: 'DAS DAZWISCHEN · Endpunktbeleg bleibt am Widerlager', regel: 'Endpunkt-Evidenz ist keine Verbindungs-Evidenz.' },
  { id: 'modell', satz: 'Die Kante sagt „reguliert“ – also ist eine Wirkung nachgewiesen.', herkunft: 'TraumaAtlas-Bestand: „Modellkanten sind keine individuell bewiesenen Ursachen“', regel: 'Eine Modellkante ist kein Wirknachweis.' },
];

const out = {
  format: 'fugenraeume', version: 1, erzeugt: new Date().toISOString(),
  hinweis: 'Redaktionelle Raumbildung dieser Fassung über unveränderten Originalkanten. Keine fachliche Prüfung, keine Diagnose, kein Wirknachweis.',
  zaehlung: { uebersetzung: uebersetzung.length, gegenhalt: gegenhalt.length, schwelle: schwelle.length, stimmen: stimmListe.length, fehlstelle: fehlstelle.length, entstehung: entstehung.length, aussagenOhneGrenze: ohneGrenze },
  uebersetzung, gegenhalt, schwelle, ueberschneidung, fehlstelle, entstehung, proben,
};
const ziel = requireExternalWriteTarget(join(DATA, 'fugenraeume.json'));
await writeFile(ziel, JSON.stringify(out));
console.log('Fugenräume:', JSON.stringify(out.zaehlung));
