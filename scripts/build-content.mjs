// Leitet aus dem kanonischen Atlasbestand einen Lesebestand für diese Fassung ab.
// Das Original wird nur gelesen. Die Fugenart ist eine redaktionelle Lesart
// über den unveränderten Originalkanten; Label, Detail, Grenze und Quellen bleiben erhalten.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireExternalWriteTarget } from './external-storage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CANON = '/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-atlas/dist';
const FUNDUS = '/Volumes/ThunderBolt4_2TB/Development/Projects/phaenomenatlas-sites-20261022/atlas-source/wissensfundus/neurodiversitaet-genetik-umwelt-20261027';
const OUT = requireExternalWriteTarget(join(ROOT, 'data-readonly'));
await mkdir(OUT, { recursive: true });

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const rawCollection = await readFile(join(CANON, 'atlas-collection.json'));
const rawMedia = await readFile(join(CANON, 'atlas-media.json'));
const rawEditorial = await readFile(join(CANON, 'atlas-editorial.json'));
const atlas = JSON.parse(rawCollection);
const media = JSON.parse(rawMedia);
const editorial = JSON.parse(rawEditorial);

// ---- Fugenarten: redaktionelle Zuordnung über Originalstatus, Originaltyp und Originallabel ----
// Jede Regel nennt, woraus sie gelesen wird. Was keiner Regel entspricht, bleibt „Einordnung“
// oder – wenn eine Quelle eine inhaltliche Aussage trägt – „Belegte Einzelaussage“.
const RULES = [
  { art: 'abstand', types: ['nicht_dasselbe', 'verwechselbar_mit'], labels: [/unterschieden werden/, /verwechselbar/] },
  { art: 'widerspruch', types: ['gegenbeispiel'], labels: [/Gegenbeispiel/] },
  { art: 'begrenzung', types: [], labels: [/nicht vollständig fest/, /legt .* nicht .* fest/] },
  { art: 'spannung', types: ['gegenteil_am_start'], labels: [/Gegenpol/] },
  { art: 'bedingung', types: ['voraussetzung', 'fundierung'], labels: [/Voraussetzung/, /begründet mit/] },
  { art: 'folge', types: ['abstammung'], labels: [/hervorgegangen aus/, /zeitversetzt/, /früh beobachtbar/, /mehrere Verläufe/] },
  { art: 'uebergang', types: ['reguliert', 'zielzustand', 'behandlt', 'kann_strategie_sein_gegen'], labels: [/regulierend/, /zielt auf/, /Behandlungsbezug/] },
  { art: 'zusammenhang', types: [], labels: [/assoziiert/, /verbunden mit/, /Risiko/, /sagt .* voraus/, /trägt zu Unterschieden bei/, /Populationsunterschiede/] },
  { art: 'annaeherung', types: ['benannte_naehe', 'co_mentioned_with'], labels: [/begrifflich benachbart/, /ähnelt/, /selben Quellenabschnitt/, /denselben Themenbereich/] },
  { art: 'offen', types: ['investigated_in_context_of'], labels: [/Forschungsfrage/, /Forschungskontext/, /untersucht/] },
];
// Ordnende Kanten des Originalbestands: Zugehörigkeit, Kontext, Phase, Beschreibung.
const ORDNEND = /wird beschrieben|eingeordnet|gehört zu|Kontext|Phase|Profilbezug|Erregungslage|Erfahrungsdimension|vertieft|beschrieben in|unterstützt die Erkundung/;
// Lesbare Namen der Originaltypen (keine Rohbezeichner in der Oberfläche).
const TYP_NAME = {
  nicht_dasselbe: 'nicht dasselbe', verwechselbar_mit: 'verwechselbar mit', gegenbeispiel: 'Gegenbeispiel', gegenteil_am_start: 'Gegenpol',
  voraussetzung: 'Voraussetzung', fundierung: 'Begründung im Modell', abstammung: 'hervorgegangen aus', phase: 'Phase',
  reguliert: 'Regulationsbezug', zielzustand: 'Zielzustand', behandlt: 'Behandlungsbezug', kann_strategie_sein_gegen: 'mögliche Strategie gegen',
  benannte_naehe: 'benannte Nähe', co_mentioned_with: 'im selben Abschnitt genannt', investigated_in_context_of: 'gemeinsam untersucht',
  described_in: 'beschrieben in', kategorie: 'Kategorie', profil: 'Profil', erregung: 'Erregungslage',
};
function artFor(rel) {
  if (rel.status === 'gegenbefund') return { art: 'widerspruch', grund: 'dem Originalstatus „Gegenbefund“' };
  if (rel.originalType === 'phase') return { art: 'einordnung', grund: 'der Zuordnung zu einer Phase im Original' };
  for (const rule of RULES) {
    if (rel.originalType && rule.types.includes(rel.originalType)) {
      let grund = `dem Originaltyp „${TYP_NAME[rel.originalType] || rel.originalType.replace(/_/g, ' ')}“`;
      if (/benachbart/.test(rel.label || '') && rule.art !== 'annaeherung') grund += '; die Bezeichnung im Bestand nennt nur begriffliche Nachbarschaft. Vorgeschlagen, nicht fachlich geprüft';
      return { art: rule.art, grund };
    }
  }
  for (const rule of RULES) {
    if (rule.labels.some((re) => re.test(rel.label || ''))) return { art: rule.art, grund: `der Originalbezeichnung „${rel.label}“` };
  }
  if (rel.sourceIds?.length && !ORDNEND.test(rel.label || '')) return { art: 'aussage', grund: `der belegten Originalaussage „${rel.label}“` };
  return { art: 'einordnung', grund: `der Originalbezeichnung „${rel.label || 'ohne Bezeichnung'}“` };
}

// Herkunft der Beziehung: Quelle, Originalbestand, Redaktion (vorgeschlagen), offen.
function geltungFor(rel, art) {
  const prov = typeof rel.provenance === 'string' ? rel.provenance : rel.provenance?.title || '';
  if (rel.status === 'proposed' || /[Rr]edaktionell|Lesebrücke|Beziehungskarte|vorgeschlagen/.test(prov)) return 'redaktionell';
  if (rel.sourceIds?.length) return 'quelle';
  if (art === 'offen') return 'offen';
  return 'original';
}

const entries = atlas.entries;
const index = new Map(entries.map((e, i) => [e.id, i]));
const collections = atlas.collections.map((c) => c.title);
// Die Sammlungsnamen der Einträge stimmen nicht immer mit den Titeln überein.
const collectionNames = [...new Set(entries.map((e) => e.collection))];
const regions = collectionNames.map((name) => {
  const meta = atlas.collections.find((c) => c.title === name || c.title.startsWith(name.split(' ')[0])) || {};
  return { name, summary: meta.summary || '', count: entries.filter((e) => e.collection === name).length };
});
const regionOf = new Map(collectionNames.map((n, i) => [n, i]));

// Redaktionelle Korrekturen werden nach dem Laden angewendet (Vorgabe des Bestands).
const corrected = new Map();
for (const c of editorial.corrections || []) {
  const id = c.match?.entryId;
  if (id && index.has(id)) corrected.set(id, { text: c.editorialText, original: c.originalExcerpt, grenze: c.boundary, match: c.match.textIncludes });
}

const relations = [];
const pairSeen = new Map();
for (const rel of atlas.relations) {
  const a = index.get(rel.from); const b = index.get(rel.to);
  if (a === undefined || b === undefined || a === b) continue;
  const { art, grund } = artFor(rel);
  const item = {
    a, b, art, grund, geltung: geltungFor(rel, art), label: rel.label || '',
    detail: rel.explanation || rel.detail || '', grenze: rel.limit || rel.boundary || '', quellen: rel.sourceIds || [],
    herkunft: typeof rel.provenance === 'string' ? rel.provenance : rel.provenance?.title || '',
    typ: rel.originalType || '', status: rel.status || '', frage: rel.question || '',
    kausal: rel.causal === false ? false : undefined,
    anker: (rel.sourceAnchors || []).map((s) => ({ ort: index.get(s.entryId), rolle: s.role || '' })).filter((s) => s.ort !== undefined),
  };
  const key = `${a}|${b}`; const back = `${b}|${a}`;
  if (pairSeen.has(back)) {
    // Gegenrichtung als eigene Aussage: beide bleiben erhalten, die Fuge wird als gegenseitig lesbar markiert.
    item.gegen = pairSeen.get(back);
    relations[pairSeen.get(back)].gegen = relations.length;
    // Gegenseitigkeit nur, wenn beide Richtungen dieselbe Art tragen.
    item.gegenGleich = relations[item.gegen].art === art; relations[item.gegen].gegenGleich = item.gegenGleich;
  }
  pairSeen.set(key, relations.length);
  relations.push(item);
}

// ---- Layout: Gebiete nach Verbindungsdichte, Orte innerhalb nach Kanten ----
const R = collectionNames.length;
const between = Array.from({ length: R }, () => new Array(R).fill(0));
for (const r of relations) {
  const ra = regionOf.get(entries[r.a].collection); const rb = regionOf.get(entries[r.b].collection);
  if (ra !== rb) { between[ra][rb] += 1; between[rb][ra] += 1; }
}
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const centers = regions.map((reg, i) => {
  const ang = (i / R) * Math.PI * 2;
  return { x: Math.cos(ang) * 900, y: Math.sin(ang) * 700, r: 120 + Math.sqrt(reg.count) * 34 };
});
for (let it = 0; it < 800; it++) {
  for (let i = 0; i < R; i++) for (let j = i + 1; j < R; j++) {
    const A = centers[i]; const B = centers[j];
    let dx = B.x - A.x; let dy = B.y - A.y; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d;
    const want = (A.r + B.r) * (between[i][j] > 0 ? 1.05 : 1.45) + 40;
    const pull = between[i][j] > 0 ? Math.min(0.06, 0.01 + between[i][j] / 2000) : 0.004;
    const f = d < want ? (want - d) * 0.25 : -(d - want) * pull;
    A.x -= dx * f; A.y -= dy * f; B.x += dx * f; B.y += dy * f;
  }
  for (const c of centers) { c.x *= 0.995; c.y *= 0.995; }
}

const pos = entries.map((e) => {
  const c = centers[regionOf.get(e.collection)];
  const ang = rand() * Math.PI * 2; const rad = Math.sqrt(rand()) * c.r * 0.9;
  return { x: c.x + Math.cos(ang) * rad, y: c.y + Math.sin(ang) * rad };
});
const adj = entries.map(() => []);
for (const r of relations) { adj[r.a].push(r.b); adj[r.b].push(r.a); }
const CELL = 40;
for (let it = 0; it < 260; it++) {
  const t = 1 - it / 260;
  const grid = new Map();
  pos.forEach((p, i) => {
    const k = `${Math.floor(p.x / CELL)},${Math.floor(p.y / CELL)}`;
    if (!grid.has(k)) grid.set(k, []); grid.get(k).push(i);
  });
  const disp = pos.map(() => ({ x: 0, y: 0 }));
  pos.forEach((p, i) => {
    const gx = Math.floor(p.x / CELL); const gy = Math.floor(p.y / CELL);
    for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
      for (const j of grid.get(`${gx + ox},${gy + oy}`) || []) {
        if (j <= i) continue;
        const q = pos[j]; let dx = p.x - q.x; let dy = p.y - q.y; let d = Math.hypot(dx, dy);
        if (d < 0.01) { dx = rand() - 0.5; dy = rand() - 0.5; d = 0.5; }
        if (d < CELL) { const f = (CELL - d) / d * 0.5; disp[i].x += dx * f; disp[i].y += dy * f; disp[j].x -= dx * f; disp[j].y -= dy * f; }
      }
    }
    for (const j of adj[i]) {
      const q = pos[j]; const same = entries[i].collection === entries[j].collection;
      const dx = q.x - p.x; const dy = q.y - p.y; const d = Math.hypot(dx, dy);
      const want = same ? 46 : 140; const f = (d - want) / Math.max(d, 1) * (same ? 0.04 : 0.006);
      disp[i].x += dx * f; disp[i].y += dy * f;
    }
    const c = centers[regionOf.get(entries[i].collection)];
    const dx = c.x - p.x; const dy = c.y - p.y; const d = Math.hypot(dx, dy);
    const f = d > c.r ? (d - c.r) / d * 0.2 : 0.004; disp[i].x += dx * f; disp[i].y += dy * f;
  });
  pos.forEach((p, i) => {
    const d = Math.hypot(disp[i].x, disp[i].y); const m = Math.min(d, 18 * t + 1) / (d || 1);
    p.x += disp[i].x * m; p.y += disp[i].y * m;
  });
}

// Gebietsmitte und Ausdehnung aus tatsächlichen Lagen.
regions.forEach((reg, i) => {
  const own = pos.filter((_, j) => regionOf.get(entries[j].collection) === i);
  const cx = own.reduce((s, p) => s + p.x, 0) / own.length; const cy = own.reduce((s, p) => s + p.y, 0) / own.length;
  reg.x = Math.round(cx); reg.y = Math.round(cy);
  reg.r = Math.round(Math.max(...own.map((p) => Math.hypot(p.x - cx, p.y - cy))) + 30);
  reg.links = between[i].map((n, j) => ({ j, n })).filter((l) => l.n > 0).sort((p, q) => q.n - p.n).map((l) => [l.j, l.n]);
});

// ---- Medien: Werke des Vaters und Aufnahmen, nur mit Originalbezug ----
const mediaOut = media.filter((m) => m.file || m.sourceURL).map((m) => {
  const isWork = /Walter Andreas Kirchner/.test(m.producer || '');
  const local = m.file && !/^https?:/.test(m.file);
  return {
    id: m.id || m.file, titel: m.title, format: m.format || (isWork ? 'Bild' : ''), urheber: m.producer || '',
    werk: isWork, datei: local ? `/medien/atlas/${m.file.replace(/^assets\/media\//, '')}` : null,
    extern: local ? null : (m.file || null),
    alt: m.alt || m.alternative?.slice(0, 400) || '',
    // Maßangaben bleiben in der Quelle, nicht in der Bildunterschrift (menschliche Korrektur).
    // Werke: Urheber · Titel · Jahr · Material. Maßangaben bleiben in der Quelle (menschliche Korrektur).
    herkunft: isWork ? `${(m.provenance || '').split('. Reproduktion')[0].split(' · ').filter((t) => !/\d\s*[x×]\s*\d|Maßangabe/.test(t)).join(' · ')}. Reproduktion von der Künstlerwebsite.` : (typeof m.provenance === 'string' ? m.provenance : ''),
    quelle: /^https?:\/\//.test(m.sourceURL || m.notebookURL || '') ? (m.sourceURL || m.notebookURL) : '',
    pruefung: isWork ? '' : (typeof m.review === 'object' && m.review ? (m.review.scope || m.review.summary || '') : (m.review || '')),
    ki: /NotebookLM|KI-/.test(`${m.producer} ${m.title}`),
    zusammenfassung: isWork ? '' : (m.summary || ''),
    untertitel: m.track ? `/medien/atlas/${m.track.replace(/^assets\/media\//, '')}` : null,
    poster: m.poster && !/^https?:/.test(m.poster) ? `/medien/atlas/${m.poster.replace(/^assets\/media\//, '')}` : null,
    eintraege: (m.relatedEntryIds || []).map((id) => index.get(id)).filter((i) => i !== undefined),
  };
});

// ---- Vollständige Originale des Wissensfundus (Markdown) ----
const fundus = [];
for (const name of (await readdir(FUNDUS)).filter((f) => /^\d\d-.*\.md$/.test(f)).sort()) {
  const text = await readFile(join(FUNDUS, name), 'utf8');
  const title = (text.match(/^#\s+(.+)$/m) || [, name])[1].trim();
  const match = entries.findIndex((e) => e.title.trim() === title || (e.origin?.path || '').endsWith(name));
  fundus.push({ datei: name, titel: title, text, eintrag: match >= 0 ? match : null, sha256: sha(text) });
}

const sources = Object.fromEntries((atlas.sources || []).map((s) => [s.id, {
  titel: s.title, art: s.kind || '', url: /^https?:\/\//.test(s.url || '') ? s.url : '', autoren: s.authors || s.author || '', jahr: s.year || '',
  stelle: s.passage || s.locator || s.excerpt || '',
}]));

const karte = {
  format: 'fugenland-karte', version: 1,
  regionen: regions,
  orte: entries.map((e, i) => ({
    t: e.title, r: regionOf.get(e.collection), k: e.kind, s: (corrected.get(e.id)?.text || e.summary || '').slice(0, 320),
    x: Math.round(pos[i].x * 10) / 10, y: Math.round(pos[i].y * 10) / 10, n: adj[i].length,
  })),
  fugen: relations,
};
const texte = {
  format: 'fugenland-texte', version: 1,
  orte: entries.map((e) => ({
    id: e.id, body: e.body || '', tags: e.tags || [], quellen: e.sourceIds || [],
    herkunft: e.origin ? { titel: e.origin.title || '', pfad: e.origin.path || '', commit: e.origin.commit || '' } : null,
    korrektur: corrected.get(e.id) || null,
  })),
  quellen: sources,
  fundus,
};
const herkunft = {
  erzeugt: new Date().toISOString(),
  original: CANON, fundus: FUNDUS,
  pruefsummen: { 'atlas-collection.json': sha(rawCollection), 'atlas-media.json': sha(rawMedia), 'atlas-editorial.json': sha(rawEditorial) },
  regeln: RULES.map((r) => ({ art: r.art, typen: r.types, labels: r.labels.map(String) })),
  hinweis: 'Fugenart, Lage und Höhe sind Lesarten dieser Fassung. Originalkanten, Label, Detail, Grenze und Quellen bleiben unverändert.',
};

for (const [name, data] of [['karte.json', karte], ['texte.json', texte], ['medien.json', mediaOut], ['herkunft.json', herkunft]]) {
  await writeFile(requireExternalWriteTarget(join(OUT, name)), JSON.stringify(data));
}
for (const m of mediaOut) if (m.werk && /\d\s*[x×]\s*\d|Maßangabe/.test(m.herkunft)) throw new Error(`Maßangabe in Bildunterschrift: ${m.titel}`);
const counts = relations.reduce((acc, r) => ({ ...acc, [r.art]: (acc[r.art] || 0) + 1 }), {});
console.log({ orte: entries.length, fugen: relations.length, gegenseitig: relations.filter((r) => r.gegen !== undefined).length, arten: counts, medien: mediaOut.length, fundus: fundus.map((f) => [f.datei, f.eintrag]) });
