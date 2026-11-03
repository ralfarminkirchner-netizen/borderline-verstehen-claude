// Fugenland · Zustand, Wege und Bedienung.
import { Karte } from './karte.mjs';
import { Gelaende, dichteFeld } from './gelaende.mjs';
import { ARTEN, fugenArt } from './fugen.mjs';
import * as V from './ansichten.mjs';
import { Werkstatt } from './werkstatt.mjs';
import { Spieler } from './medien.mjs';

const $ = (s) => document.querySelector(s);
const app = $('#app');

// Gebietsfarben: erdige, unterscheidbare Töne; Tinte für Beschriftung.
const FARBEN = [
  ['#7d4e57', '#5a333b'], ['#3f6e5a', '#284a3c'], ['#4f6f85', '#2f4a5e'], ['#a0643a', '#6e4122'], ['#6b5b8e', '#47395f'],
  ['#8a7a2e', '#5a4f19'], ['#a14a3a', '#6e2d22'], ['#2f6b6b', '#1c4747'], ['#7a5a8a', '#523a5e'], ['#5d6b3a', '#3c4624'],
];

export const A = {
  daten: null, texte: null, medien: [], karte: null, werkstatt: null, spieler: null,
  zustand: { ebene: 'atlas' }, slugs: [], slugIndex: new Map(), hand: [],
  linse: 'gebiete', ruhig: false,
};

const slug = (t) => t.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'ort';

async function laden() {
  const [karte, medien] = await Promise.all([fetch('/inhalt/karte.json').then((r) => r.json()), fetch('/inhalt/medien.json').then((r) => r.json())]);
  karte.regionen.forEach((g, i) => {
    const [farbe, tinte] = FARBEN[i % FARBEN.length]; g.farbe = farbe; g.tinte = tinte;
    g.rgb = [parseInt(farbe.slice(1, 3), 16), parseInt(farbe.slice(3, 5), 16), parseInt(farbe.slice(5, 7), 16)];
  });
  A.daten = karte; A.medien = medien;
  const seen = new Map();
  A.slugs = karte.orte.map((o) => { let s = slug(o.t); const n = seen.get(s) || 0; seen.set(s, n + 1); if (n) s += `-${n + 1}`; return s; });
  A.slugs.forEach((s, i) => A.slugIndex.set(s, i));
  A.gebietSlugs = karte.regionen.map((g) => slug(g.name));
  A.medienZuOrt = new Map();
  medien.forEach((m) => m.eintraege.forEach((i) => { if (!A.medienZuOrt.has(i)) A.medienZuOrt.set(i, []); A.medienZuOrt.get(i).push(m); }));
  // Texte werden nachgeladen; die Karte steht vorher.
  A.textePromise = fetch('/inhalt/texte.json').then((r) => r.json()).then((t) => { A.texte = t; return t; });
}

function aufbauen() {
  const gel = new Gelaende($('#gelaende'));
  const karte = new Karte({ el: $('#welt'), overlay: $('#ueberlage'), gelaende: gel, daten: A.daten, regionen: A.daten.regionen });
  gel.setze(dichteFeld(A.daten.orte, A.daten.regionen, karte.bounds));
  gel.onFallback = () => meldung('Die Grafikkarte hat abgebrochen. Die Karte zeichnet jetzt ohne WebGL weiter.');
  A.karte = karte; A.gelaende = gel;
  A.adj = karte.adj;

  karte.onTap = (i) => { if (A.hand.length && !A.hand.includes(i)) return einfangen(i); geh({ ebene: 'ort', ort: i }); };
  karte.onFuge = (fi) => geh({ ebene: 'fuge', ort: A.zustand.ort, fuge: fi });
  karte.onLeer = (w) => {
    if (A.hand.length) return;
    const z = karte.zoom; const g = naechstesGebiet(w);
    if (g !== null && (z < 0.7 || A.zustand.ebene === 'atlas')) return geh({ ebene: 'gebiet', gebiet: g });
    if (A.zustand.ebene === 'ort' || A.zustand.ebene === 'fuge') return geh(A.zustand.gebiet !== undefined ? { ebene: 'gebiet', gebiet: A.daten.orte[A.zustand.ort].r, ruhig: true } : { ebene: 'atlas' });
  };
  karte.onHover = (i, x, y) => schwebe(i, x, y);
  karte.onFlug = (an) => { $('#flug-ueberspringen').hidden = !an || A.ruhig; };
  $('#flug-ueberspringen').onclick = () => karte.ueberspringeFlug();

  A.werkstatt = new Werkstatt(A, { meldung, geh });
  A.spieler = new Spieler($('#spieler'), A, { geh });
  bedienung();
}

function naechstesGebiet(w) {
  let best = null; let bd = Infinity;
  A.daten.regionen.forEach((g, i) => { const d = Math.hypot(g.x - w.x, g.y - w.y) / g.r; if (d < 1.15 && d < bd) { bd = d; best = i; } });
  return best;
}

// ---------- Wege: jeder Zustand hat eine Adresse; Zurück fliegt zurück ----------
function adresse(z) {
  const s = (i) => A.slugs[i];
  switch (z.ebene) {
    case 'gebiet': return `#/gebiet/${A.gebietSlugs[z.gebiet]}`;
    case 'ort': return `#/ort/${s(z.ort)}`;
    case 'fuge': { const f = A.daten.fugen[z.fuge]; const n = f.a === z.ort ? f.b : f.a; return `#/ort/${s(z.ort)}/fuge/${s(n)}/${z.fuge}`; }
    case 'lesen': return `#/ort/${s(z.ort)}/original`;
    case 'werkbank': return z.eigen ? `#/eigen/${A.werkstatt.slug(z.eigen)}/bearbeiten` : '#/werkbank';
    case 'eigen': return z.eigen ? `#/eigen/${A.werkstatt.slug(z.eigen)}` : '#/eigen';
    case 'info': return '#/so-ist-die-karte-gebaut';
    default: return '#/';
  }
}

function ausAdresse() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (!parts.length) return { ebene: 'atlas' };
  if (parts[0] === 'gebiet') { const g = A.gebietSlugs.indexOf(parts[1]); return g >= 0 ? { ebene: 'gebiet', gebiet: g } : { ebene: 'atlas' }; }
  if (parts[0] === 'ort') {
    const i = A.slugIndex.get(parts[1]); if (i === undefined) return { ebene: 'atlas' };
    if (parts[2] === 'original') return { ebene: 'lesen', ort: i };
    if (parts[2] === 'fuge') { const fi = Number(parts[4]); const f = A.daten.fugen[fi]; if (f && (f.a === i || f.b === i)) return { ebene: 'fuge', ort: i, fuge: fi }; }
    return { ebene: 'ort', ort: i };
  }
  if (parts[0] === 'eigen') { const id = A.werkstatt.ausSlug(parts[1]); return parts[2] === 'bearbeiten' ? { ebene: 'werkbank', eigen: id } : { ebene: 'eigen', eigen: id }; }
  if (parts[0] === 'werkbank') return { ebene: 'werkbank' };
  if (parts[0] === 'so-ist-die-karte-gebaut') return { ebene: 'info' };
  return { ebene: 'atlas' };
}

export function geh(z, { ersetzen = false, ausVerlauf = false } = {}) {
  const vorher = A.zustand; A.zustand = z;
  if (!ausVerlauf) {
    const url = adresse(z);
    if (ersetzen || url === location.hash) history.replaceState(null, '', url); else history.pushState(null, '', url);
  }
  zeige(z, vorher);
}

function zeige(z, vorher = {}) {
  const k = A.karte;
  k.sel = z.ort ?? null; k.fugeSel = z.ebene === 'fuge' ? z.fuge : null; k.eigenSel = z.eigen ?? null; k.dirty = true;
  const inhalt = $('#blatt-inhalt'); inhalt.onscroll = null;
  $('#meldung').hidden = vorher.ebene === z.ebene ? $('#meldung').hidden : true;
  const offen = z.ebene !== 'atlas';
  blatt(offen ? (z.ebene === 'lesen' ? 'weit' : 'offen') : 'zu');
  if (z.ebene === 'atlas') { k.ueberblick(); inhalt.innerHTML = ''; }
  if (z.ebene === 'gebiet') { V.gebiet(inhalt, z.gebiet); if (!z.ruhig) k.zuGebiet(z.gebiet); }
  if (z.ebene === 'ort') { V.ort(inhalt, z.ort); if (vorher.ort !== z.ort || vorher.ebene === 'lesen' || vorher.ebene === 'atlas' || vorher.ebene === 'gebiet') k.zuOrt(z.ort); }
  if (z.ebene === 'fuge') { V.fuge(inhalt, z.ort, z.fuge); fokusFuge(z.fuge); }
  if (z.ebene === 'lesen') { V.lesen(inhalt, z.ort); k.zuOrt(z.ort, Math.max(k.zoom, 1.1)); }
  if (z.ebene === 'werkbank') { A.werkstatt.werkbank(inhalt, z.eigen, z.vorlage); }
  if (z.ebene === 'eigen') { A.werkstatt.liste(inhalt, z.eigen); if (z.eigen) A.werkstatt.zeigeAufKarte(z.eigen); }
  if (z.ebene === 'info') V.legende(inhalt);
  pfad(z);
  if (offen && vorher.ebene !== z.ebene) inhalt.scrollTop = 0;
  if (offen && z.fokus !== false) requestAnimationFrame(() => (inhalt.querySelector('[data-erster-fokus]') || inhalt.querySelector('h1,h2'))?.focus({ preventScroll: true }));
  status(z);
}

function fokusFuge(fi) {
  const f = A.daten.fugen[fi]; const a = A.daten.orte[f.a]; const b = A.daten.orte[f.b];
  const k = A.karte; const fr = k.frei();
  const span = Math.hypot(a.x - b.x, a.y - b.y) + 120;
  k.fliege((a.x + b.x) / 2, (a.y + b.y) / 2, Math.max(0.25, Math.min(2.4, Math.min(fr.w, fr.h) / span)));
}

function blatt(modus) {
  app.dataset.blatt = modus;
  // Freie Kartenfläche sofort aus Fenstergröße und Blattmodus berechnen (gleiche Regeln wie im CSS),
  // damit ein gleichzeitig startender Flug sein Ziel in der sichtbaren Fläche findet.
  const W = window.innerWidth; const H = window.innerHeight;
  const quer = H <= 520 && W >= 600; const schmal = W <= 720 && !quer;
  let inset = { r: 0, b: 0 };
  if (modus !== 'zu') {
    if (quer) inset.r = modus === 'weit' ? Math.min(760, W * 0.7) : Math.min(460, W * 0.48);
    else if (schmal) inset.b = modus === 'weit' ? H - 58 : H * 0.6;
    else inset.r = modus === 'weit' ? Math.min(980, W * 0.74) : Math.min(600, Math.max(340, W * 0.4));
  }
  A.karte.inset = inset;
  app.style.setProperty('--frei-r', `${inset.r}px`);
}

function pfad(z) {
  const ol = $('#pfad'); const items = [{ text: 'Borderline verstehen', ziel: { ebene: 'atlas' }, marke: true }];
  const g = z.gebiet ?? (z.ort !== undefined ? A.daten.orte[z.ort].r : undefined);
  if (g !== undefined && z.ebene !== 'atlas') items.push({ text: A.daten.regionen[g].name, ziel: { ebene: 'gebiet', gebiet: g } });
  if (z.ort !== undefined) items.push({ text: A.daten.orte[z.ort].t, ziel: { ebene: 'ort', ort: z.ort } });
  if (z.ebene === 'fuge') { const f = A.daten.fugen[z.fuge]; items.push({ text: `${ARTEN[fugenArt(f)].name}: ${A.daten.orte[f.a === z.ort ? f.b : f.a].t}`, ziel: z }); }
  if (z.ebene === 'lesen') items.push({ text: 'Original', ziel: z });
  if (z.ebene === 'eigen' || z.ebene === 'werkbank') items.push({ text: 'Meine Arbeit', ziel: { ebene: 'eigen' } });
  if (z.ebene === 'werkbank') items.push({ text: z.eigen ? 'Bearbeiten' : 'Neue Fuge', ziel: z });
  if (z.ebene === 'info') items.push({ text: 'So ist die Karte gebaut', ziel: z });
  ol.innerHTML = '';
  items.forEach((it, n) => {
    const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button';
    b.textContent = it.text; if (it.marke) b.className = 'marke';
    if (n === items.length - 1) b.setAttribute('aria-current', 'location');
    b.onclick = () => geh(it.ziel); li.append(b); ol.append(li);
  });
}

function status(z) {
  const t = { atlas: 'Überblick über alle Gebiete.', gebiet: `Gebiet ${A.daten.regionen[z.gebiet]?.name}.`, ort: `Ort ${A.daten.orte[z.ort]?.t}.`, fuge: 'Fuge geöffnet.', lesen: 'Original geöffnet.', werkbank: 'Werkbank geöffnet.', eigen: 'Meine Arbeit.', info: 'Erklärung der Karte.' };
  $('#karten-status').textContent = t[z.ebene] || '';
}

// ---------- Schwebe ----------
function schwebe(i, x, y) {
  const el = $('#schwebe');
  if (i === null || i === undefined || window.matchMedia('(hover: none)').matches) { el.hidden = true; return; }
  const o = A.daten.orte[i]; const g = A.daten.regionen[o.r];
  let extra = '';
  if (A.hand.length) {
    const rel = A.hand.flatMap((h) => A.adj[h].map((fi) => A.daten.fugen[fi]).filter((f) => (f.a === h && f.b === i) || (f.b === h && f.a === i)));
    extra = rel.length ? `<small>${rel.map((f) => ARTEN[fugenArt(f)].name).join(' · ')} – zum Einfangen tippen</small>` : '<small>Keine Fuge im Bestand – Einfangen bleibt möglich</small>';
  }
  el.innerHTML = `${V.esc(o.t)}<small>${V.esc(g.name)}</small>${extra}`;
  el.style.left = `${x}px`; el.style.top = `${y}px`; el.hidden = false;
}

// ---------- Tragen und Einfangen ----------
export function aufnehmen(i) {
  if (!A.hand.includes(i)) A.hand.push(i);
  handZeigen();
  meldung(A.hand.length === 1 ? 'Aufgenommen. Bewege dich über die Karte: Orte mit Fugen zeigen ihre Art. Tippe einen Ort an, um ihn einzufangen.' : 'Eingefangen. Ringe zeigen gemeinsame Nachbarn der Kombination.');
}
function einfangen(i) { aufnehmen(i); }
export function loesen(i) { A.hand = A.hand.filter((h) => h !== i); handZeigen(); }
function handZeigen() {
  const k = A.karte; k.getragen = [...A.hand]; k.dirty = true;
  const el = $('#hand'); el.hidden = !A.hand.length;
  const liste = $('#hand-liste'); liste.innerHTML = '';
  for (const i of A.hand) {
    const li = document.createElement('li'); li.innerHTML = `<span>${V.esc(A.daten.orte[i].t)}</span>`;
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `${A.daten.orte[i].t} lösen`); b.textContent = '×';
    b.onclick = () => loesen(i); li.append(b); liste.append(li);
  }
  const geteilt = gemeinsameNachbarn();
  $('#hand-hinweis').textContent = A.hand.length > 1 ? (geteilt.length ? `· ${geteilt.length} ${geteilt.length === 1 ? 'gemeinsamer Nachbar' : 'gemeinsame Nachbarn'} im Bestand` : '· keine gemeinsamen Nachbarn im Bestand') : '· tippe weitere Orte an';
  $('#hand-fuge').disabled = A.hand.length < 1;
}
export function gemeinsameNachbarn() {
  if (A.hand.length < 2) return [];
  const count = new Map();
  for (const h of A.hand) {
    const seen = new Set();
    for (const fi of A.adj[h]) { const f = A.daten.fugen[fi]; const n = f.a === h ? f.b : f.a; if (!A.hand.includes(n) && !seen.has(n)) { seen.add(n); count.set(n, (count.get(n) || 0) + 1); } }
  }
  return [...count].filter(([, c]) => c > 1).map(([n]) => n);
}

// ---------- Meldung mit Rückgängig ----------
let meldungTimer;
export function meldung(text, rueck) {
  const el = $('#meldung'); el.innerHTML = ''; const span = document.createElement('span'); span.textContent = text; el.append(span);
  if (rueck) { const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Rückgängig'; b.onclick = () => { el.hidden = true; rueck(); }; el.append(b); }
  el.hidden = false; clearTimeout(meldungTimer); meldungTimer = setTimeout(() => { el.hidden = true; }, rueck ? 9000 : 5200);
}

// ---------- Bedienung: Suche, Linsen, Tastatur ----------
function bedienung() {
  const k = A.karte;
  addEventListener('popstate', () => { const z = ausAdresse(); const vorher = A.zustand; A.zustand = z; zeige(z, vorher); });
  addEventListener('resize', () => blatt(app.dataset.blatt));

  // Suche
  const input = $('#suche'); const liste = $('#treffer'); let aktiv = -1; let ergebnisse = [];
  const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  const titel = A.daten.orte.map((o) => norm(o.t));
  const schliessen = () => { liste.hidden = true; input.setAttribute('aria-expanded', 'false'); aktiv = -1; };
  const waehle = (i) => { schliessen(); input.value = ''; input.blur(); geh({ ebene: 'ort', ort: i }); };
  input.addEventListener('input', () => {
    const q = norm(input.value.trim()); if (q.length < 2) return schliessen();
    ergebnisse = titel.map((t, i) => [t.startsWith(q) ? 0 : t.includes(q) ? 1 : 9, i]).filter(([s]) => s < 9).sort((a, b) => a[0] - b[0] || A.daten.orte[b[1]].n - A.daten.orte[a[1]].n).slice(0, 12).map(([, i]) => i);
    liste.innerHTML = ergebnisse.length ? '' : '<li aria-disabled="true"><span></span><b>Kein Ort mit diesem Namen</b></li>';
    ergebnisse.forEach((i, n) => {
      const o = A.daten.orte[i]; const g = A.daten.regionen[o.r];
      const li = document.createElement('li'); li.role = 'option'; li.id = `t${n}`;
      li.innerHTML = `<span class="punkt" style="background:${g.farbe}"></span><b>${V.esc(o.t)}</b><small>${V.esc(g.name)}</small>`;
      li.onpointerdown = (e) => { e.preventDefault(); waehle(i); }; liste.append(li);
    });
    liste.hidden = false; input.setAttribute('aria-expanded', 'true'); aktiv = -1;
  });
  input.addEventListener('keydown', (e) => {
    if (liste.hidden) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); aktiv = Math.max(0, Math.min(ergebnisse.length - 1, aktiv + (e.key === 'ArrowDown' ? 1 : -1)));
      [...liste.children].forEach((li, n) => li.setAttribute('aria-selected', String(n === aktiv)));
      input.setAttribute('aria-activedescendant', `t${aktiv}`);
    }
    if (e.key === 'Enter' && ergebnisse.length) { e.preventDefault(); waehle(ergebnisse[Math.max(0, aktiv)]); }
    if (e.key === 'Escape') schliessen();
  });
  input.addEventListener('blur', () => setTimeout(schliessen, 150));

  // Linsen (Perspektive): Kamera und Auswahl bleiben erhalten.
  const lk = $('#linsen-knopf'); const lp = $('#linsen');
  lk.onclick = () => { lp.hidden = !lp.hidden; lk.setAttribute('aria-expanded', String(!lp.hidden)); };
  lp.querySelectorAll('[data-linse]').forEach((b) => b.addEventListener('click', () => {
    A.linse = b.dataset.linse; k.linse = A.linse; k.dirty = true;
    lp.querySelectorAll('[data-linse]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    legende(); lp.hidden = true; lk.setAttribute('aria-expanded', 'false'); lk.focus();
    meldung(`Perspektive: ${b.querySelector('b').textContent}. Ausschnitt und Auswahl bleiben.`);
  }));
  const ruhig = $('#ruhig');
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  ruhig.checked = rm.matches; setRuhig(rm.matches);
  ruhig.onchange = () => setRuhig(ruhig.checked);
  $('#eigen-knopf').onclick = () => geh({ ebene: 'eigen' });
  $('#info-knopf').onclick = () => geh({ ebene: 'info' });
  $('#hand-ablegen').onclick = () => { A.hand = []; handZeigen(); };
  $('#hand-fuge').onclick = () => geh({ ebene: 'werkbank', vorlage: { teile: A.hand.map((i) => ({ ort: i })), kontext: 'Kombination aus der Hand' } });

  // Blatt auf schmalen Bildschirmen ziehen
  const griff = document.querySelector('.blatt-griff'); let start = null;
  griff.addEventListener('pointerdown', (e) => { start = e.clientY; griff.setPointerCapture(e.pointerId); });
  griff.addEventListener('pointerup', (e) => {
    if (start === null) return; const dy = e.clientY - start; start = null;
    if (dy < -40) blatt('weit'); else if (dy > 60) { app.dataset.blatt === 'weit' ? blatt('offen') : geh({ ebene: 'atlas' }); } else blatt(app.dataset.blatt === 'weit' ? 'offen' : 'weit');
  });

  // Tastatur auf der Karte
  const cv = $('#ueberlage');
  cv.addEventListener('keydown', (e) => {
    const z = A.zustand;
    if (e.key === '+' || e.key === '=') { k.zoomSchritt(1.3); e.preventDefault(); }
    if (e.key === '-' || e.key === '_') { k.zoomSchritt(1 / 1.3); e.preventDefault(); }
    const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (dirs[e.key]) {
      e.preventDefault(); const [dx, dy] = dirs[e.key];
      if (e.shiftKey || (z.ort === undefined && z.gebiet === undefined)) return k.verschiebe(dx * 80, dy * 80);
      const from = z.ort !== undefined ? A.daten.orte[z.ort] : { x: A.daten.regionen[z.gebiet].x, y: A.daten.regionen[z.gebiet].y };
      let best = null; let bs = Infinity;
      A.daten.orte.forEach((o, i) => {
        if (i === z.ort) return; const vx = o.x - from.x; const vy = o.y - from.y; const d = Math.hypot(vx, vy); if (d < 1) return;
        const cos = (vx * dx + vy * dy) / d; if (cos < 0.5) return; const score = d * (2 - cos);
        if (score < bs) { bs = score; best = i; }
      });
      if (best !== null) geh({ ebene: 'ort', ort: best, fokus: false });
    }
    if (e.key === 'Enter' && z.ort !== undefined) { $('#blatt').focus(); }
    if (e.key.toLowerCase() === 'a' && z.ort !== undefined) aufnehmen(z.ort);
  });
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.target.closest?.('input,textarea,select')) return;
    if (!$('#linsen').hidden) { $('#linsen').hidden = true; lk.setAttribute('aria-expanded', 'false'); return; }
    if (A.karte.flug) return A.karte.ueberspringeFlug();
    if (A.hand.length) { A.hand = []; handZeigen(); return; }
    zurueck();
  });
}

function legende() {
  const el = $('#legende'); const l = A.linse;
  if (l === 'gebiete') { el.hidden = true; return; }
  const item = (farbe, text, rand) => `<span><i style="background:${farbe};${rand ? `border:1.5px ${rand} #6d6457` : ''}"></i>${V.esc(text)}</span>`;
  if (l === 'fugen') el.innerHTML = `<b>Fugenarten · Farbe der vorherrschenden Fuge eines Ortes</b>${['widerspruch', 'begrenzung', 'spannung', 'abstand', 'bedingung', 'aussage', 'zusammenhang', 'uebergang', 'gegenseitig', 'folge', 'annaeherung', 'offen'].map((a) => item(ARTEN[a].farbe, ARTEN[a].name)).join('')}${item('#a49a88', 'nur Einordnung')}`;
  if (l === 'geltung') el.innerHTML = `<b>Herkunft · stärkste Herkunft der Verbindungen eines Ortes</b>${item('#1d1a16', 'mit Quelle')}${item('#7d7466', 'Originalbestand')}${item('#b0a38c', 'redaktionell', 'solid')}${item('#f4efe5', 'offen', 'dotted')}`;
  if (l === 'eigen') el.innerHTML = `<b>Meine Fugen</b><span>Nur Orte, an denen du selbst eine Fuge festgehalten hast. Blaue Tinte: persönlich.</span>`;
  el.hidden = false;
}

function willkommen() {
  const box = $('#einstiege');
  const wahl = ['Beziehungen & Borderline', 'TraumaAtlas', 'ADHS · Randphänomene', 'Neuroatlas', 'Phänomenatlas'];
  for (const name of wahl) {
    const g = A.daten.regionen.findIndex((r) => r.name === name); if (g < 0) continue;
    const b = document.createElement('button'); b.type = 'button';
    b.innerHTML = `<span class="punkt" style="background:${A.daten.regionen[g].farbe}"></span>${V.esc(name)}`;
    b.onclick = () => geh({ ebene: 'gebiet', gebiet: g }); box.append(b);
  }
  $('#willkommen').hidden = false;
  $('#willkommen-zu').onclick = () => { $('#willkommen').hidden = true; $('#ueberlage').focus(); };
}

export function zurueck() {
  const z = A.zustand;
  if (z.ebene === 'lesen' || z.ebene === 'fuge') return geh({ ebene: 'ort', ort: z.ort });
  if (z.ebene === 'ort') return geh({ ebene: 'gebiet', gebiet: A.daten.orte[z.ort].r });
  if (z.ebene === 'werkbank') return geh(z.eigen ? { ebene: 'eigen', eigen: z.eigen } : { ebene: 'eigen' });
  return geh({ ebene: 'atlas' });
}

function setRuhig(an) {
  A.ruhig = an; A.karte.ruhig = an; app.classList.toggle('ruhig', an); app.classList.toggle('anim', !an); A.karte.dirty = true;
}

(async () => {
  try {
    await laden(); aufbauen();
    await A.werkstatt.laden(); willkommen();
    const z = ausAdresse(); A.zustand = z; history.replaceState(null, '', adresse(z)); zeige(z);
    if (A.gelaende.modus !== 'webgl') document.documentElement.dataset.grafik = 'ohne-webgl';
  } catch (error) {
    console.error(error);
    document.body.insertAdjacentHTML('beforeend', '<p class="ohne-skript" role="alert">Der Atlasbestand konnte nicht geladen werden. Läuft der lokale Dienst?</p>');
  }
})();
