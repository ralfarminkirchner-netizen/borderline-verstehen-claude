// Lebende Welt: begehbare Weltkarte der Phänomene.
// Die Wesen leben in ihren Gebieten. Wendest du dich einem zu, ruft es seine Verbindungen herbei:
// verbindende Verbindungen lassen die Farben ineinanderlaufen (getragen von Belegen wächst das Gemeinsame),
// unterscheidende stehen Wand an Wand, offene Fragen greifen nur ineinander. Ohne Verbindung keine Begegnung.
import { berechneFeld, faerbeFeld, isolinien, glaette, gesamtDichte, dichteAn, TAU } from './kern/feld.mjs';
import { bereiteWesen, bewege } from './kern/leben.mjs';
import * as Z from './kern/zeichner.mjs';
import { LESART } from './kern/begegnung.mjs';
import { zeichneSzene, radiusPx } from './kern/szene.mjs';

const $ = (s) => document.querySelector(s);
const leinwand = $('#welt');
const ctx = leinwand.getContext('2d');
let W = 0, H = 0, dpr = 1;
const schmal = () => W < 760;

// ——— Zugang: ein Profil für den ganzen Atlas ———
const SCHLUESSEL = 'atlas-accessibility-preferences-v1';
const lies = () => { try { return JSON.parse(localStorage.getItem(SCHLUESSEL) || '{}') || {}; } catch { return {}; } };
const pref = { motion: 'system', text: 'normal', contrast: 'normal', bilder: 'viel', ...lies() };
function speichere() {
  try { localStorage.setItem(SCHLUESSEL, JSON.stringify({ ...lies(), motion: pref.motion, text: pref.text, contrast: pref.contrast, bilder: pref.bilder })); } catch { /* ohne Speicher geht es auch */ }
}
const systemRuhig = matchMedia('(prefers-reduced-motion: reduce)');
const ruhig = () => pref.motion === 'reduced' || (pref.motion === 'system' && systemRuhig.matches);
const schriftFaktor = () => ({ normal: 1, large: 1.15, larger: 1.32 }[pref.text] || 1);
const WAHL = {
  text: { name: 'Schrift', werte: ['normal', 'large', 'larger'], wort: { normal: 'gewohnt', large: 'größer', larger: 'am größten' } },
  motion: { name: 'Bewegung', werte: ['system', 'full', 'reduced'], wort: { system: 'wie das Gerät', full: 'lebt', reduced: 'ruht' } },
  bilder: { name: 'Bilder', werte: ['viel', 'wenig', 'keine'], wort: { viel: 'alle', wenig: 'wenige', keine: 'keine' } },
  contrast: { name: 'Kontrast', werte: ['normal', 'high'], wort: { normal: 'sanft', high: 'kräftig' } },
};
function wendeZugangAn() {
  document.documentElement.dataset.text = pref.text;
  document.documentElement.dataset.contrast = pref.contrast;
  for (const b of document.querySelectorAll('.blatt')) {
    const w = WAHL[b.dataset.wahl];
    b.innerHTML = '';
    const n = document.createElement('b'); n.textContent = w.name; b.append(n, document.createTextNode(w.wort[pref[b.dataset.wahl]]));
    b.setAttribute('aria-label', `${w.name}: ${w.wort[pref[b.dataset.wahl]]}`);
  }
  anfordern();
}

// ——— Bestand laden ———
const [welt, medienDaten] = await Promise.all([
  fetch('./daten/welt.json').then((r) => r.json()),
  fetch('./daten/medien.json').then((r) => r.json()),
  document.fonts.load('450 14px Newsreader'), document.fonts.load('italic 450 14px Newsreader'), document.fonts.load('600 14px Manrope'),
]);
const O = welt.orte;
const feld = berechneFeld(welt, { zellen: 420 });
const feldbild = Z.feldBild(feld, faerbeFeld(feld, welt, Z.GRUND));
const membranen = welt.gebiete.map((g, k) => ({ gebiet: k, linien: isolinien(feld, feld.dichte[k], TAU).map((l) => glaette(l, 2)) }));
const summe = gesamtDichte(feld);
const hoehen = [0.9, 1.8, 3.2, 5.2, 8].map((stufe) => ({ stufe, linien: isolinien(feld, summe, stufe).map((l) => glaette(l, 2)) }));
const wesen = bereiteWesen(welt);
const farbeVon = (i) => Z.eigenfarbe(welt.gebiete[O[i].r].lch, O[i].k);
const START = O.findIndex((o) => o.t === 'Die Angst vor Verlust ist groß');
const medien = medienDaten.medien;
const bildnisse = medien.filter((m) => m.gruppe === 'bildnisse');
const einzelmedien = medien.filter((m) => m.gruppe !== 'bildnisse');

// ——— Kamera ———
const G = feld.grenzen;
const passend = () => Math.min(W / (G.x1 - G.x0), H / (G.y1 - G.y0)) * (schmal() ? 1.05 : 0.95);
const kam = { cx: 0, cy: 0, zoom: 0.4 };
const ziel = { cx: 0, cy: 0, zoom: 0.4 };
let kamera = new Z.Kamera(0, 0, 0.4, 1, 1);
const grenzeZoom = (z) => Math.min(5, Math.max(passend() * 0.7, z));
function fliegeZu(x, y, zoom = ziel.zoom, versatz = [0, 0]) {
  ziel.zoom = grenzeZoom(zoom);
  ziel.cx = x - versatz[0] / ziel.zoom; ziel.cy = y - versatz[1] / ziel.zoom;
  anfordern();
}

function groesse() {
  dpr = Math.min(2, window.devicePixelRatio || 1);
  W = window.innerWidth; H = window.innerHeight;
  leinwand.width = Math.round(W * dpr); leinwand.height = Math.round(H * dpr);
  anfordern();
}

// ——— Zeichnen ———
let geplant = false, letzteZeit = 0, standZeit = 37;
function anfordern() { if (!geplant) { geplant = true; requestAnimationFrame(bild); } }
let treffer = []; // Trefferflächen dieses Bildes: { x, y, r } oder { box }, aktion

function bild(jetzt) {
  geplant = false;
  const t = ruhig() ? standZeit : jetzt / 1000;
  if (!ruhig()) standZeit = t;
  // Kamera gleitet (bei ruhender Bewegung springt sie)
  const k = ruhig() ? 1 : 1 - Math.pow(0.0008, Math.min(0.05, (jetzt - (letzteZeit || jetzt)) / 1000 || 0.016));
  letzteZeit = jetzt;
  let bewegt = false;
  for (const a of ['cx', 'cy', 'zoom']) {
    const d = ziel[a] - kam[a];
    if (Math.abs(d) > (a === 'zoom' ? 0.0004 : 0.05)) { kam[a] += d * Math.max(k, 0.12); bewegt = true; } else kam[a] = ziel[a];
  }
  kamera = new Z.Kamera(kam.cx, kam.cy, kam.zoom, W, H);
  treffer = [];
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  bewege(wesen, t, ruhig() ? 1 : 0);
  weicheLichtungen();

  Z.zeichneGrund(ctx, W, H);
  Z.zeichneFeld(ctx, kamera, feld, feldbild);
  if (!fokus) Z.zeichneHoehenlinien(ctx, kamera, hoehen);
  Z.zeichneMembranen(ctx, kamera, membranen, welt, t, ruhig() ? 1 : 0);
  zeichneMedienInDerWelt(t);
  const stufe = detailstufe();
  zeichneWesen(stufe, t);
  zeichneNamen(stufe);
  let laeuft = bewegt;
  if (fokus) laeuft = zeichneFokus(jetzt, t) || laeuft;
  if (betrachten) laeuft = zeichneBetrachten() || laeuft;
  Z.zeichneKorn(ctx, W, H);
  setzeMediumDom();
  if (klang && !klang.el.paused) laeuft = true;
  if (laeuft || !ruhig()) anfordern();
}

// Lichtungen bleiben frei: Wesen in ihrer Nähe werden sanft nach außen geschoben
const lichtungen = [...(bildnisse.length ? [bildnisse[0]] : []), ...einzelmedien.filter((m) => m.art !== 'bild')];
function weicheLichtungen() {
  for (const m of lichtungen) {
    const rand = m.r * (m.gruppe ? 1.4 : 1.25) + 10;
    for (const w of wesen) {
      const dx = w.x - m.x, dy = w.y - m.y, d = Math.hypot(dx, dy);
      if (d < rand) { const n = rand + (d / rand) * 12; const f = n / Math.max(1, d); w.x = m.x + dx * f; w.y = m.y + dy * f; }
    }
  }
}

function detailstufe() {
  const z = kam.zoom / passend();
  return z < 1.9 ? 0 : z < 3.4 ? 1 : 2;
}

const inSzene = new Set();
function zeichneWesen(stufe, t) {
  const sichtbar = [];
  for (const w of wesen) if (!inSzene.has(w.i) && kamera.sichtbar(w.x, w.y, 60)) sichtbar.push(w);
  const blass = fokus ? 0.45 : 1;
  if (stufe === 0) { for (const w of sichtbar) Z.zeichnePunkt(ctx, kamera, w, farbeVon(w.i), blass); return; }
  if (stufe === 2 && sichtbar.length < 320) {
    for (const w of sichtbar) {
      for (const fi of w.fugen.slice(0, 9)) {
        const f = welt.fugen[fi]; const j = f.a === w.i ? f.b : f.a;
        Z.zeichneArm(ctx, kamera, Z.armGeometrie(w, f, wesen[j], t, ruhig() ? 1 : 0, 1), f, Z.tief(farbeVon(w.i), 0.52), { alpha: 0.75 * blass, dicke: 0.95 });
      }
    }
  }
  for (const w of sichtbar) Z.zeichneKoerper(ctx, kamera, w, farbeVon(w.i), { groesse: stufe === 1 ? 0.95 : 1.12, alpha: blass });
}

// Bereiche, in denen keine Namen liegen dürfen (Kopf, Suche, Steuerung, Lesespalte)
function freiZonen() {
  const z = [[0, 0, 330, 90], [W - 80, 0, W, 80], [W - 230, H - 120, W, H]];
  if (lesenOffen()) z.push(schmal() ? [0, H * 0.54, W, H] : [W - Math.min(W * 0.31, 440) - 40, 100, W, H]);
  return z;
}

function zeichneNamen(stufe) {
  if (fokus && fokus.p > 0.4) return;
  const zonen = freiZonen();
  const belegt = [...zonen];
  const sf = schriftFaktor();
  const start = wesen[START];
  // Startort zuerst, mit feinem Ring
  if (!inSzene.has(START) && kamera.sichtbar(start.x, start.y)) {
    const sx = kamera.sx(start.x), sy = kamera.sy(start.y);
    ctx.beginPath(); ctx.arc(sx, sy, stufe === 0 ? 9 : start.radius * kam.zoom + 7, 0, Math.PI * 2);
    ctx.strokeStyle = Z.cssLch(Z.tief(welt.gebiete[O[START].r].lch, 0.45), 0.8); ctx.lineWidth = 1.2; ctx.stroke();
  }
  // Gebietsnamen auf Bögen über ihrer Membran
  if (stufe === 0) {
    const reihenfolge = welt.gebiete.map((g, k) => k).sort((a, b) => (b === 6) - (a === 6) || welt.gebiete[b].zahl - welt.gebiete[a].zahl);
    for (const k of reihenfolge) {
      const frei = (sx, sy) => welt.gebiete.every((_, j) => j === k || dichteAn(feld, j, kamera.wx(sx), kamera.wy(sy)) < TAU * 0.9);
      Z.gebietsnameAmRand(ctx, kamera, welt.gebiete[k].name.toUpperCase(), membranen[k].linien, Z.tief(welt.gebiete[k].lch, 0.4),
        { belegt, frei, groesse: (stufe === 0 ? 13 : 14) * sf });
    }
  }
  belegt.push(...medienFlaechen);
  if (stufe > 0) gebietsnamenNah(belegt, sf);
  // Ortsnamen nach Zahl der Verbindungen, ohne Überdeckung
  const wahl = wesen.filter((w) => !inSzene.has(w.i) && kamera.sichtbar(w.x, w.y, 0) && (stufe > 0 || w.ort.t.length <= 34))
    .sort((a, b) => (b.i === START) - (a.i === START) || b.ort.grad - a.ort.grad).slice(0, stufe === 0 ? 20 : stufe === 1 ? 45 : 70);
  const kand = wahl.map((w) => ({ text: w.ort.t, x: kamera.sx(w.x), y: kamera.sy(w.y), r: stufe === 0 ? 4 : w.radius * kam.zoom + 3,
    groesse: (w.i === START ? 13.5 : stufe === 0 ? 11.5 : 13) * sf, gewicht: w.i === START ? 600 : 470, w }));
  for (const p of Z.platziereNamen(ctx, kand, { vorbelegt: belegt })) {
    Z.schrift(ctx, p.text, p.x, p.y, { groesse: p.groesse, gewicht: p.gewicht, ausrichtung: p.ausrichtung,
      farbe: p.w.i === START || stufe > 0 ? Z.tief(welt.gebiete[p.w.gebiet].lch, 0.36) : Z.TINTE_LEISE, alpha: fokus ? 0.5 : 1 });
    ctx.font = `${p.gewicht} ${p.groesse}px ${Z.SCHRIFT_SERIF}`;
    const b = ctx.measureText(p.text).width;
    const x0 = p.ausrichtung === 'left' ? p.x : p.ausrichtung === 'right' ? p.x - b : p.x - b / 2;
    treffer.push({ box: [x0 - 4, p.y - p.groesse, x0 + b + 4, p.y + 5], aktion: () => wendeDichZu(p.w.i), name: p.text });
  }
}

// Nah: Gebietsname dort, wo das eigene Gebiet sichtbar und allein ist (nie im fremden Gebiet)
function gebietsnamenNah(belegt, sf) {
  const groesse = 14 * sf;
  for (let k = 0; k < welt.gebiete.length; k++) {
    const sicht = wesen.filter((w) => w.gebiet === k && kamera.sichtbar(w.x, w.y, -40));
    if (sicht.length < 3) continue;
    const name = welt.gebiete[k].name.toUpperCase();
    ctx.font = `620 ${groesse}px ${Z.SCHRIFT_SANS}`;
    const b = ctx.measureText(name).width + name.length * 2.4;
    const mx = sicht.reduce((s, w) => s + kamera.sx(w.x), 0) / sicht.length, my = sicht.reduce((s, w) => s + kamera.sy(w.y), 0) / sicht.length;
    const eigen = (sx, sy) => dichteAn(feld, k, kamera.wx(sx), kamera.wy(sy)) > TAU * 1.05
      && welt.gebiete.every((_, j) => j === k || dichteAn(feld, j, kamera.wx(sx), kamera.wy(sy)) < TAU * 0.85);
    let gesetzt = false;
    for (const [dx, dy] of [[0, 0], [0, -60], [0, 60], [-120, 0], [120, 0], [0, -120], [0, 120], [-200, -80], [200, 80], [-200, 80], [200, -80]]) {
      const x = Math.min(W - b / 2 - 16, Math.max(b / 2 + 16, mx + dx)), y = Math.min(H - 30, Math.max(40, my + dy));
      const box = [x - b / 2 - 6, y - groesse - 4, x + b / 2 + 6, y + 6];
      if (belegt.some((q) => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]))) continue;
      if (![0, 0.25, 0.5, 0.75, 1].every((u) => eigen(box[0] + (box[2] - box[0]) * u, y - groesse / 2))) continue;
      Z.schrift(ctx, name, x, y, { groesse, ausrichtung: 'center', familie: Z.SCHRIFT_SANS, gewicht: 620, sperrung: 2.4, farbe: Z.tief(welt.gebiete[k].lch, 0.4), alpha: fokus ? 0.5 : 1 });
      belegt.push(box); gesetzt = true; break;
    }
    if (!gesetzt) continue;
  }
}

// ——— Medien in der Welt ———
let medienFlaechen = []; // Bildschirmflächen der Medien in diesem Bild (Namen weichen ihnen aus)
const bilderCache = new Map();
function ladeBild(src) {
  if (bilderCache.has(src)) return bilderCache.get(src);
  const b = new Image();
  b.decoding = 'async';
  b.onload = () => anfordern();
  b.src = src;
  bilderCache.set(src, b);
  return b;
}
function blobPfad(x, y, r, k = 0, wellen = 0.06, hoch = 1.08) {
  ctx.beginPath();
  for (let a = 0; a <= 48; a++) {
    const th = (a / 48) * Math.PI * 2;
    const rr = r * (1 + wellen * Math.sin(th * 3 + k * 1.7) + wellen * 0.6 * Math.sin(th * 5 - k));
    const px = x + Math.cos(th) * rr, py = y + Math.sin(th) * rr * hoch;
    if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}
function bildImKiesel(bild, x, y, r, k, { schatten = true, hoch = 1.08 } = {}) {
  ctx.save();
  if (schatten) { ctx.shadowColor = Z.cssLch([0.4, 0.03, 60], 0.22); ctx.shadowBlur = Math.min(18, r * 0.3); ctx.shadowOffsetY = 3; }
  blobPfad(x, y, r, k, 0.06, hoch); ctx.fillStyle = Z.cssLch([0.97, 0.01, 80]); ctx.fill();
  ctx.restore();
  ctx.save();
  blobPfad(x, y, r * 0.96, k, 0.06, hoch); ctx.clip();
  if (bild && bild.complete && bild.naturalWidth) {
    const f = Math.max((2 * r) / bild.naturalWidth, (2 * r * hoch) / bild.naturalHeight);
    ctx.drawImage(bild, x - (bild.naturalWidth * f) / 2, y - (bild.naturalHeight * f) / 2.2, bild.naturalWidth * f, bild.naturalHeight * f);
  }
  ctx.restore();
  blobPfad(x, y, r * 0.96, k, 0.06, hoch);
  ctx.strokeStyle = Z.cssLch([0.99, 0.01, 80], 0.9); ctx.lineWidth = 2; ctx.stroke();
}
function lichtpunkt(x, y, farbe, r = 5) {
  const hof = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
  hof.addColorStop(0, Z.cssLch(Z.GRUND_HELL, 0.95)); hof.addColorStop(1, Z.cssLch(Z.GRUND_HELL, 0));
  ctx.fillStyle = hof; ctx.beginPath(); ctx.arc(x, y, r * 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = Z.cssLch([0.99, 0.01, 80]); ctx.fill();
  ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.5), 0.75); ctx.lineWidth = 1.2; ctx.stroke();
}
// Titel eines Mediums: ruhig über seiner Lichtung, höchstens zwei Zeilen
function titelBogen(text, x, y, R, groesse = 15) {
  const gr = groesse * schriftFaktor();
  const zeilen = Z.umbreche(ctx, text, Math.max(180, R * 2.4), `560 ${gr}px ${Z.SCHRIFT_SERIF}`).slice(0, 2);
  zeilen.forEach((z, n) => Z.schrift(ctx, z, x, y - R - 14 - (zeilen.length - 1 - n) * gr * 1.25, { groesse: gr, ausrichtung: 'center', gewicht: 560 }));
  medienFlaechen.push([x - R * 1.3, y - R - 20 - zeilen.length * gr * 1.25, x + R * 1.3, y - R]);
}

function zeichneMedienInDerWelt(t) {
  medienFlaechen = [];
  const dicht = pref.bilder;
  const blass = fokus ? 0.35 : 1;
  ctx.save(); ctx.globalAlpha = blass;
  // Lichtung der Bildnisse
  if (dicht !== 'keine' && bildnisse.length) {
    const m = bildnisse[0];
    const x = kamera.sx(m.x), y = kamera.sy(m.y), R = m.r * kam.zoom;
    if (kamera.sichtbar(m.x, m.y, R + 40)) {
      const farbe = welt.gebiete[m.gebiet].lch;
      if (R < 22) { lichtpunkt(x, y, farbe, Math.max(4, R * 0.25)); treffer.push({ x, y, r: Math.max(14, R), aktion: () => fliegeZu(m.x, m.y, passend() * 6.5), name: 'Lichtung mit Bildnissen' }); }
      else {
        const hof = ctx.createRadialGradient(x, y, R * 0.5, x, y, R * 1.35);
        hof.addColorStop(0, Z.cssLch(Z.GRUND_HELL, 0.97)); hof.addColorStop(0.72, Z.cssLch(Z.GRUND_HELL, 0.9)); hof.addColorStop(1, Z.cssLch(Z.GRUND_HELL, 0));
        ctx.fillStyle = hof; blobPfad(x, y, R * 1.35, 3, 0.05); ctx.fill();
        medienFlaechen.push([x - R * 0.95, y - R * 0.95, x + R * 0.95, y + R * 0.95]);
        bildnisse.forEach((b, k) => {
          const th = -Math.PI / 2 + (k * Math.PI * 2) / bildnisse.length;
          const px = x + Math.cos(th) * R * 0.6, py = y + Math.sin(th) * R * 0.6;
          bildImKiesel(ladeBild(b.datei), px, py, R * 0.26, k);
          treffer.push({ x: px, y: py, r: R * 0.28, aktion: () => oeffneBild(b), name: 'Bildnis' });
        });
      }
    }
  }
  for (const m of einzelmedien) {
    if (m.art === 'bild' && (dicht === 'keine' || dicht === 'wenig')) continue;
    const x = kamera.sx(m.x), y = kamera.sy(m.y), R = m.r * kam.zoom;
    if (!kamera.sichtbar(m.x, m.y, R + 60)) continue;
    const farbe = welt.gebiete[m.gebiet].lch;
    if (m.art === 'klang') { zeichneKlangquelle(m, x, y, R, farbe, t); continue; }
    if (R < 14) {
      lichtpunkt(x, y, farbe, m.art === 'video' ? 5.5 : 4);
      treffer.push({ x, y, r: 14, aktion: () => (m.art === 'video' ? oeffneFilm(m) : oeffneBild(m)), name: m.titel || 'Bild' });
      continue;
    }
    medienFlaechen.push([x - R, y - R * 1.15, x + R, y + R * 1.15]);
    if (m.art === 'bild') {
      bildImKiesel(ladeBild(m.datei), x, y, R, m.x % 7);
      treffer.push({ x, y, r: R, aktion: () => oeffneBild(m), name: 'Bild' });
    } else {
      bildImKiesel(ladeBild(m.poster || ''), x, y, R, m.y % 5, { hoch: 1.15 });
      // Samen zum Abspielen
      ctx.beginPath(); ctx.arc(x, y, Math.max(12, R * 0.2), 0, Math.PI * 2); ctx.fillStyle = Z.cssLch([0.99, 0.01, 80], 0.92); ctx.fill();
      ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.7); ctx.lineWidth = 1.2; ctx.stroke();
      const s = Math.max(5, R * 0.08);
      ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x - s * 0.6, y + s); ctx.closePath();
      ctx.fillStyle = Z.cssLch(Z.tief(farbe, 0.4)); ctx.fill();
      if (R > 34 && m.titel) titelBogen(m.titel, x, y, R * 1.15, 14);
      treffer.push({ x, y, r: R, aktion: () => oeffneFilm(m), name: m.titel });
    }
  }
  ctx.restore();
}

// Klangquelle: jeder Ring ist ein Abschnitt des Tons, Strichstärke = gemessene Lautheit
let klang = null; // { m, el }
function zeichneKlangquelle(m, x, y, R, farbe, t) {
  const spielt = klang && klang.m === m;
  if (R < 18 && !spielt) {
    lichtpunkt(x, y, farbe, 6);
    treffer.push({ x, y, r: 16, aktion: () => { fliegeZu(m.x, m.y, passend() * 4.2); schalteKlang(m); }, name: m.titel });
    return;
  }
  R = Math.max(R, 24);
  medienFlaechen.push([x - R, y - R - (R > 40 ? 40 : 0), x + R, y + R]);
  const werte = m.huelle?.werte || [];
  const n = werte.length || 1, r0 = Math.max(10, R * 0.24);
  const gehoert = spielt && klang.el.duration ? klang.el.currentTime / klang.el.duration : 0;
  const lichthof = ctx.createRadialGradient(x, y, 0, x, y, R * 1.25);
  lichthof.addColorStop(0, Z.cssLch(Z.GRUND_HELL, 1)); lichthof.addColorStop(0.8, Z.cssLch(Z.GRUND_HELL, 0.9)); lichthof.addColorStop(1, Z.cssLch(Z.GRUND_HELL, 0));
  ctx.fillStyle = lichthof; ctx.beginPath(); ctx.arc(x, y, R * 1.25, 0, Math.PI * 2); ctx.fill();
  const schritt = R < 50 ? 3 : 1;
  for (let k = 0; k < n; k += schritt) {
    const a = werte[k];
    const rad = r0 + (k / n) * (R - r0);
    const vorbei = k / n <= gehoert;
    const puls = spielt && !ruhig() ? Math.sin(t * 3 - k * 0.3) * 0.6 : 0;
    ctx.beginPath();
    for (let q = 0; q <= 72; q++) {
      const th = (q / 72) * Math.PI * 2;
      const welle = (a * 2.4 + puls) * Math.sin(th * (6 + (k % 5)) + k * 0.7) * Math.min(1, R / 90);
      const px = x + Math.cos(th) * (rad + welle), py = y + Math.sin(th) * (rad + welle);
      if (q === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = Z.cssLch(vorbei ? Z.tief(farbe, 0.5) : Z.tief(farbe, 0.62), vorbei ? 0.25 + a * 0.55 : 0.1 + a * 0.24);
    ctx.lineWidth = (0.4 + a * 1.6) * Math.min(1.4, R / 90 + 0.3);
    ctx.stroke();
  }
  if (spielt) {
    ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.85); ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.arc(x, y, R + 8, -Math.PI / 2, -Math.PI / 2 + gehoert * Math.PI * 2); ctx.stroke(); ctx.restore();
  }
  // Samen in der Mitte: abspielen oder anhalten
  const sr = Math.max(13, R * 0.17);
  ctx.beginPath(); ctx.arc(x, y, sr, 0, Math.PI * 2); ctx.fillStyle = Z.cssLch([0.99, 0.01, 80]); ctx.fill();
  ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.7); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = Z.cssLch(Z.tief(farbe, 0.4));
  const s = sr * 0.36;
  if (spielt && !klang.el.paused) { ctx.fillRect(x - s * 0.9, y - s, s * 0.65, s * 2); ctx.fillRect(x + s * 0.25, y - s, s * 0.65, s * 2); }
  else { ctx.beginPath(); ctx.moveTo(x - s * 0.6, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x - s * 0.6, y + s); ctx.closePath(); ctx.fill(); }
  if (R > 40 && m.titel) titelBogen(m.titel, x, y, R, 16);
  treffer.push({ x, y, r: R, aktion: () => schalteKlang(m), name: m.titel });
  // Was gerade gesagt wird, steht als Schrift in der Welt
  if (spielt && m.hinweise?.length) {
    const jetzt = klang.el.currentTime;
    const cue = m.hinweise.find((c) => jetzt >= c.von && jetzt <= c.bis);
    if (cue) Z.absatz(ctx, cue.text, x - Math.min(260, W / 2 - 20), y + R + 40, Math.min(520, W - 40), { groesse: 17 * schriftFaktor(), kursiv: true });
  }
}

function schalteKlang(m) {
  if (filmAktiv()) schliesseBetrachten();
  if (klang && klang.m === m) { if (klang.el.paused) klang.el.play(); else klang.el.pause(); anfordern(); return; }
  if (klang) { klang.el.pause(); klang.el.remove(); }
  const el = document.createElement('audio');
  el.src = m.datei; el.preload = 'auto';
  el.addEventListener('ended', anfordern);
  $('#medium').append(el);
  klang = { m, el };
  el.play().catch(() => {});
  anfordern();
}

// ——— Betrachten: ein Bild oder ein Film groß in einer Lichtung ———
let betrachten = null; // { m, art }
const filmAktiv = () => betrachten && betrachten.art === 'video';
function oeffneBild(m) { betrachten = { m, art: 'bild', t0: performance.now() }; anfordern(); }
function oeffneFilm(m) {
  if (klang && !klang.el.paused) klang.el.pause();
  const box = $('#medium');
  box.querySelector('video')?.remove();
  const v = document.createElement('video');
  v.src = m.datei; v.playsInline = true; v.preload = 'metadata';
  if (m.poster) v.poster = m.poster;
  v.setAttribute('aria-label', m.titel || 'Film');
  v.addEventListener('click', () => { if (v.paused) v.play(); else v.pause(); });
  v.addEventListener('loadedmetadata', anfordern);
  v.addEventListener('timeupdate', anfordern);
  box.append(v); box.hidden = false;
  betrachten = { m, art: 'video', el: v, t0: performance.now() };
  v.play().catch(() => {});
  anfordern();
}
function schliesseBetrachten() {
  if (betrachten?.el) { betrachten.el.pause(); betrachten.el.remove(); }
  $('#medium').hidden = !klang;
  betrachten = null; anfordern();
}
function betrachtenRahmen() {
  const v = betrachten.el;
  const seite = (v && v.videoWidth) ? v.videoHeight / v.videoWidth : (betrachten.m.art === 'video' ? 1.6 : 1.1);
  const maxH = H * (schmal() ? 0.66 : 0.74), maxB = W * (schmal() ? 0.9 : 0.56);
  let b = Math.min(maxB, maxH / seite); let h = b * seite;
  return { x: W / 2 - b / 2, y: H * 0.48 - h / 2, b, h };
}
function zeichneBetrachten() {
  const p = ruhig() ? 1 : Math.min(1, (performance.now() - betrachten.t0) / 420);
  ctx.fillStyle = Z.cssLch(Z.GRUND, 0.86 * p); ctx.fillRect(0, 0, W, H);
  const r = betrachtenRahmen();
  const m = betrachten.m;
  if (betrachten.art === 'bild') {
    const bild = ladeBild(m.datei);
    const seite = bild.naturalWidth ? bild.naturalHeight / bild.naturalWidth : 1.1;
    const R = Math.min(W * (schmal() ? 0.44 : 0.3), (H * 0.4) / seite);
    ctx.globalAlpha = p;
    bildImKiesel(bild, W / 2, H * 0.48, R, 2, { hoch: seite });
    ctx.globalAlpha = 1;
  } else {
    const farbe = welt.gebiete[m.gebiet].lch;
    ctx.save(); ctx.shadowColor = Z.cssLch([0.4, 0.03, 60], 0.25); ctx.shadowBlur = 24; ctx.shadowOffsetY = 6;
    ctx.beginPath(); ctx.ellipse(W / 2, r.y + r.h / 2, r.b / 2, r.h / 2, 0, 0, Math.PI * 2); ctx.fillStyle = Z.cssLch(Z.GRUND_HELL); ctx.fill(); ctx.restore();
    if (m.titel) Z.schrift(ctx, m.titel, W / 2, Math.max(104, r.y - 18), { groesse: 19 * schriftFaktor(), ausrichtung: 'center', gewicht: 560 });
    const v = betrachten.el;
    if (v && v.duration) {
      ctx.save(); ctx.lineCap = 'round';
      const y = r.y + r.h + 18, x0 = W / 2 - r.b * 0.35, x1 = W / 2 + r.b * 0.35;
      ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.6), 0.25); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
      ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.85); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + (x1 - x0) * (v.currentTime / v.duration), y); ctx.stroke();
      ctx.restore();
      treffer.push({ box: [x0, y - 14, x1, y + 14], aktion: (px) => { v.currentTime = ((px - x0) / (x1 - x0)) * v.duration; }, name: 'Stelle wählen' });
      const cue = m.hinweise?.find((c) => v.currentTime >= c.von && v.currentTime <= c.bis);
      if (cue) Z.absatz(ctx, cue.text, W / 2, y + 36, Math.min(560, W - 40), { groesse: 17 * schriftFaktor(), kursiv: true, ausrichtung: 'center' });
    }
  }
  return p < 1 || filmAktiv();
}
function setzeMediumDom() {
  const v = betrachten?.el;
  if (!v) return;
  const r = betrachtenRahmen();
  Object.assign(v.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.b}px`, height: `${r.h}px`, position: 'fixed' });
}

// ——— Hinwenden: ein Wesen ruft seine Verbindungen herbei ———
let fokus = null;
function partnerVon(i) {
  const paare = new Map();
  for (const fi of wesen[i].fugen) {
    const f = welt.fugen[fi]; const j = f.a === i ? f.b : f.a;
    if (j === i) continue;
    if (!paare.has(j)) paare.set(j, []);
    paare.get(j).push(f);
  }
  const liste = [...paare].map(([j, fs]) => {
    const trennend = fs.some((f) => f.lesart === LESART.UNTERSCHEIDEND);
    const misch = trennend ? 0 : 1 - fs.reduce((p, f) => p * (1 - (f.misch || 0)), 1);
    const art = trennend ? 'wand' : misch > 0 ? 'misch' : 'offen';
    return { j, fs, art, misch };
  });
  const misch = liste.filter((p) => p.art === 'misch').sort((a, b) => b.misch - a.misch || O[b.j].grad - O[a.j].grad);
  const wand = liste.filter((p) => p.art === 'wand');
  const offen = liste.filter((p) => p.art === 'offen');
  const n = schmal() ? 5 : 7;
  const wahl = [...misch.slice(0, n - Math.min(1, wand.length) - Math.min(1, offen.length)), ...wand.slice(0, 1), ...offen.slice(0, 1)];
  for (const p of [...misch, ...wand, ...offen]) { if (wahl.length >= n) break; if (!wahl.includes(p)) wahl.push(p); }
  return { wahl, alle: liste.length };
}

function szeneMitte() {
  return schmal() ? [W / 2, H * 0.29] : [Math.min(W * 0.36, W - Math.min(W * 0.31, 440) - 330), H * 0.5];
}

function wendeDichZu(i, { stumm = false } = {}) {
  if (betrachten) schliesseBetrachten();
  const { wahl, alle } = partnerVon(i);
  const alt = fokus;
  fokus = { i, wahl, alle, t0: performance.now(), p: 0, start: new Map() };
  // Ausgangslagen: wo die Wesen gerade auf dem Bildschirm sind (fliegen von dort heran)
  for (const k of [i, ...wahl.map((p) => p.j)]) {
    const w = wesen[k];
    const vorher = alt?.lage?.get(k);
    fokus.start.set(k, vorher || [kamera.sx(w.x), kamera.sy(w.y)]);
  }
  inSzene.clear(); inSzene.add(i); for (const p of wahl) inSzene.add(p.j);
  const [mx, my] = szeneMitte();
  const zoom = Math.max(kam.zoom, passend() * 2.2);
  fliegeZu(O[i].x, O[i].y, zoom, [mx - W / 2, my - H / 2]);
  zeigeOrt(i, stumm);
  history.replaceState(null, '', `#${encodeURIComponent(O[i].t)}`);
}

function loseFokus() {
  fokus = null; inSzene.clear();
  schliesseLesen();
  history.replaceState(null, '', location.pathname);
  anfordern();
}

const sanft = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);

function zeichneFokus(jetzt) {
  const roh = ruhig() ? 1 : Math.min(1, (jetzt - fokus.t0) / 1500);
  const p = sanft(roh);
  fokus.p = p;
  const [mx, my] = szeneMitte();
  // Schleier über der übrigen Welt, dazu ein Lichthof, auf dem der Text steht
  ctx.fillStyle = Z.cssLch(Z.GRUND, 0.58 * p); ctx.fillRect(0, 0, W, H);
  if (lesenOffen()) {
    const [lx, ly, rx, ry] = schmal() ? [W / 2, H * 0.8, W * 0.9, H * 0.36] : [W - Math.min(W * 0.31, 440) / 2 - 26, H * 0.5, Math.min(W * 0.31, 440) * 0.9, H * 0.62];
    ctx.save(); ctx.translate(lx, ly); ctx.scale(rx, ry);
    const hof = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    hof.addColorStop(0, Z.cssLch(Z.GRUND_HELL, 0.92 * p)); hof.addColorStop(0.62, Z.cssLch(Z.GRUND_HELL, 0.85 * p)); hof.addColorStop(1, Z.cssLch(Z.GRUND_HELL, 0));
    ctx.fillStyle = hof; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
  const flaeche = schmal() ? Math.min(W, H * 0.56) : Math.min(mx * 2, H);
  const s = Math.max(0.7, Math.min(1.25, flaeche / 820));
  const ri = radiusPx(O[fokus.i].grad, s);
  const maxD = flaeche * 0.44;
  // Richtung: zum Heimatort des Gegenübers, Abstände ausgleichen
  const teile = fokus.wahl.map((q) => ({ ...q, th: Math.atan2(O[q.j].y - O[fokus.i].y, O[q.j].x - O[fokus.i].x), r: radiusPx(O[q.j].grad, s) }));
  teile.sort((a, b) => a.th - b.th);
  const luecke = (Math.PI * 2) / Math.max(3, teile.length) * 0.82;
  for (let runde = 0; runde < 12; runde++) {
    for (let k = 0; k < teile.length; k++) {
      const a = teile[k], b = teile[(k + 1) % teile.length];
      let d = b.th - a.th; if (k === teile.length - 1) d += Math.PI * 2;
      if (teile.length > 1 && d < luecke) { const schub = (luecke - d) / 2; a.th -= schub; b.th += schub; }
    }
  }
  const lage = new Map();
  lage.set(fokus.i, [mx, my]);
  for (const q of teile) {
    const faktor = q.art === 'wand' ? 0.9 : q.art === 'offen' ? 3.1 : 2.8;
    let d = Math.min(maxD, Math.max((ri + q.r) * faktor, flaeche * (q.art === 'offen' ? 0.36 : 0.3)));
    if (q.art === 'wand') d = (ri + q.r) * 0.9;
    let x = mx + Math.cos(q.th) * d, y = my + Math.sin(q.th) * d * (schmal() ? 0.82 : 1);
    const rand = q.r + 14;
    const unten = schmal() ? H * 0.53 : H - 70;
    x = Math.min(schmal() ? W - rand : W - Math.min(W * 0.31, 440) - 40 - rand, Math.max(rand, x)); y = Math.min(unten - rand, Math.max(96 + rand, y));
    lage.set(q.j, [x, y]);
  }
  fokus.lage = new Map();
  const glieder = [fokus.i, ...teile.map((q) => q.j)].map((k) => {
    const [sx, sy] = fokus.start.get(k) || lage.get(k);
    const [zx, zy] = lage.get(k);
    const x = sx + (zx - sx) * p, y = sy + (zy - sy) * p;
    fokus.lage.set(k, [x, y]);
    return { i: k, x, y };
  });
  const info = zeichneSzene(ctx, welt, glieder, { t: ruhig() ? standZeit : jetzt / 1000, massstab: s, wachsen: p });
  const sf = schriftFaktor();
  // Namen außen an den Körpern, Verbindungen als Schrift auf ihrem Weg
  // Name des zugewandten Wesens in die größte Lücke zwischen seinen Verbindungen
  const winkel = teile.map((q) => Math.atan2(lage.get(q.j)[1] - my, lage.get(q.j)[0] - mx)).sort((a, b) => a - b);
  let fokusWinkel = -Math.PI / 2;
  if (winkel.length) {
    let beste = -1;
    winkel.forEach((a, k) => { const b = k + 1 < winkel.length ? winkel[k + 1] : winkel[0] + Math.PI * 2; if (b - a > beste) { beste = b - a; fokusWinkel = a + (b - a) / 2; } });
  }
  glieder.forEach((g, k) => {
    const r = info.rr[k];
    const istFokus = g.i === fokus.i;
    const th = istFokus ? fokusWinkel : Math.atan2(g.y - my, g.x - mx);
    const cx = Math.cos(th), cy = Math.sin(th);
    const ausr = Math.abs(cx) < 0.35 ? 'center' : cx > 0 ? 'left' : 'right';
    const gr = (istFokus ? 19 : 15) * sf;
    let x = g.x + cx * (r + 12), y = g.y + cy * (r + 12) + (cy > 0.35 ? gr : cy < -0.35 ? -4 : gr * 0.35);
    const rechts = schmal() ? W - 10 : (lesenOffen() ? W - Math.min(W * 0.31, 440) - 40 : W - 10);
    const frei = ausr === 'left' ? rechts - x : ausr === 'right' ? x - 10 : 2 * Math.min(x - 10, rechts - x);
    const breite = Math.max(110, Math.min(istFokus ? 300 : 220, frei));
    if (ausr === 'left' && x + breite > rechts) x = rechts - breite;
    if (ausr === 'right' && x - breite < 10) x = 10 + breite;
    if (ausr === 'center') x = Math.min(rechts - breite / 2, Math.max(10 + breite / 2, x));
    const font = `${istFokus ? 620 : 520} ${gr}px ${Z.SCHRIFT_SERIF}`;
    const zeilen = Z.umbreche(ctx, O[g.i].t, breite, font);
    ctx.font = font;
    const maxB = Math.max(...zeilen.map((z) => ctx.measureText(z).width));
    if (ausr === 'left') x = Math.min(x, rechts - maxB); else if (ausr === 'right') x = Math.max(x, 10 + maxB); else x = Math.min(rechts - maxB / 2, Math.max(10 + maxB / 2, x));
    const y0 = cy < -0.35 ? y - (zeilen.length - 1) * gr * 1.2 : y;
    zeilen.forEach((z, n) => Z.schrift(ctx, z, x, y0 + n * gr * 1.2, { groesse: gr, gewicht: istFokus ? 620 : 520, ausrichtung: ausr,
      farbe: Z.tief(welt.gebiete[O[g.i].r].lch, 0.34), alpha: istFokus ? 1 : p }));
    if (!istFokus) treffer.push({ x: g.x, y: g.y, r: Math.max(18, r), aktion: () => wendeDichZu(g.i), name: O[g.i].t });
  });
  if (p > 0.85) {
    const a = (p - 0.85) / 0.15;
    for (const q of teile) {
      const A = lage.get(fokus.i), B = lage.get(q.j);
      const haupt = [...q.fs].sort((x, y) => (y.misch || 0) - (x.misch || 0))[0];
      const text = haupt.sicht?.label || '';
      const ang = Math.atan2(B[1] - A[1], B[0] - A[0]);
      const nx = -Math.sin(ang), ny = Math.cos(ang);
      const umgekehrt = Math.cos(ang) < 0;
      const pts = [];
      const ra = info.rr[0], rb = info.rr[glieder.findIndex((g) => g.i === q.j)];
      const lang = Math.hypot(B[0] - A[0], B[1] - A[1]);
      ctx.font = `italic 450 ${13 * sf}px ${Z.SCHRIFT_SERIF}`;
      const passt = ctx.measureText(text).width * 1.06 < lang - ra - rb - 24;
      if (q.art !== 'wand' && passt) {
        for (let n = 0; n <= 20; n++) {
          const u = (ra + 8) / lang + (n / 20) * (1 - (ra + rb + 16) / lang);
          pts.push([A[0] + (B[0] - A[0]) * u + nx * -17, A[1] + (B[1] - A[1]) * u + ny * -17]);
        }
        ctx.save(); ctx.globalAlpha = a;
        Z.textAufKurve(ctx, text, umgekehrt ? pts.reverse() : pts, { groesse: 13 * sf, farbe: Z.TINTE_LEISE, kursiv: true });
        ctx.restore();
      }
      // Knoten in der Mitte: führt zur Verbindung und ihren Quellen
      const kx = A[0] + (B[0] - A[0]) * 0.5, ky = A[1] + (B[1] - A[1]) * 0.5;
      const qn = new Set(q.fs.flatMap((f) => f.quellen.filter((x) => welt.quellen[x]?.sichtbar))).size;
      ctx.globalAlpha = a;
      if (qn) Z.zeichneQuellstein(ctx, kx, ky, qn, welt.gebiete[O[q.j].r].lch);
      else { ctx.beginPath(); ctx.arc(kx, ky, 4, 0, Math.PI * 2); ctx.fillStyle = Z.cssLch(Z.GRUND_HELL); ctx.fill(); ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.6); ctx.lineWidth = 1; ctx.stroke(); }
      ctx.globalAlpha = 1;
      treffer.push({ x: kx, y: ky, r: 18, aktion: () => zeigeVerbindung(fokus.i, q.j, q.fs), name: `Verbindung zu ${O[q.j].t}` });
    }
  }
  treffer.push({ x: mx, y: my, r: info.rr[0], aktion: () => zeigeOrt(fokus.i), name: O[fokus.i].t });
  return roh < 1;
}

// ——— Lesen: Text in der Welt (DOM, damit er lesbar, vergrößerbar und vorlesbar ist) ———
const lesen = $('#lesen');
const lesenOffen = () => !lesen.hidden;
const texte = new Map();
async function ortstext(i) {
  if (!texte.has(i)) texte.set(i, fetch(`./daten/texte/${i}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  return texte.get(i);
}
function el(tag, attrs = {}, ...kinder) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); }
  e.append(...kinder.filter(Boolean));
  return e;
}
const farbeCss = (i, L = 0.38) => Z.cssLch(Z.tief(welt.gebiete[O[i].r].lch, L));

function absaetze(markdown) {
  const teile = [];
  for (const block of String(markdown).split(/\n{2,}/)) {
    const z = block.trim();
    if (!z) continue;
    if (/^\|/.test(z)) {
      const ul = el('ul');
      for (const zeile of z.split('\n')) { if (/^\|\s*-/.test(zeile)) continue; const zellen = zeile.split('|').map((c) => c.trim()).filter(Boolean); if (zellen.length) ul.append(el('li', { text: zellen.join(' · ') })); }
      teile.push(ul); continue;
    }
    if (z.split('\n').every((l) => /^\s*[-*]\s+/.test(l))) { teile.push(el('ul', {}, ...z.split('\n').map((l) => el('li', { text: l.replace(/^\s*[-*]\s+/, '').replace(/\*\*/g, '') })))); continue; }
    if (/^#{3,4}\s/.test(z)) { teile.push(el('h3', { text: z.replace(/^#+\s*/, '').replace(/\*\*/g, '') })); continue; }
    teile.push(el('p', { text: z.replace(/\*\*/g, '').replace(/^#+\s*/, '') }));
  }
  return teile;
}
function abschnitte(body) {
  const teile = String(body || '').split(/^## /m);
  const vorne = teile.shift().trim();
  const liste = teile.map((t) => { const [kopf, ...rest] = t.split('\n'); return { kopf: kopf.trim(), text: rest.join('\n').trim() }; }).filter((a) => a.text);
  if (vorne) liste.unshift({ kopf: '', text: vorne });
  return liste;
}
function quellListe(indices) {
  const qs = [...new Set(indices)].map((k) => welt.quellen[k]).filter((q) => q?.sichtbar);
  if (!qs.length) return null;
  const ul = el('ul', { class: 'quellen' });
  for (const q of qs) {
    const t = Z.quellTitel(q);
    const kopf = [t.wer, t.jahr].filter(Boolean).join(' · ');
    ul.append(el('li', {}, kopf ? el('span', { class: 'wer', text: kopf }) : null, /^https?:\/\//.test(q.url || '') ? el('a', { href: q.url, target: '_blank', rel: 'noopener noreferrer', text: t.titel }) : el('span', { text: t.titel })));
  }
  return ul;
}
function oeffneLesen(...inhalt) {
  lesen.replaceChildren(...inhalt.filter(Boolean));
  lesen.hidden = false; lesen.scrollTop = 0;
  document.body.classList.add('liest');
  anfordern();
}
function schliesseLesen() { lesen.hidden = true; lesen.replaceChildren(); document.body.classList.remove('liest'); }

async function zeigeOrt(i, stumm = false) {
  const o = O[i];
  const kopf = [el('p', { class: 'gebiet', text: welt.gebiete[o.r].name, style: `color:${farbeCss(i, 0.4)}` }), el('h2', { text: o.t, style: `color:${farbeCss(i, 0.32)}` })];
  if (o.s) kopf.push(el('p', { class: 'kern', text: o.s }));
  oeffneLesen(...kopf);
  const text = await ortstext(i);
  if (!fokus || fokus.i !== i) return;
  const teile = abschnitte(text?.body || '');
  const inhalt = el('div');
  const pfad = el('ul', { class: 'pfad', 'aria-label': 'Abschnitte' });
  const zeige = (k) => {
    inhalt.replaceChildren(...absaetze(teile[k].text));
    for (const [n, b] of [...pfad.querySelectorAll('button')].entries()) {
      b.setAttribute('aria-pressed', String(n === k));
      b.style.background = n === k ? farbeCss(i, 0.45) : '';
    }
  };
  teile.forEach((a, k) => { if (a.kopf) pfad.append(el('li', {}, el('button', { type: 'button', text: a.kopf, onclick: () => zeige(k) }))); });
  const quellen = quellListe(text?.quellen || []);
  const quellTeil = quellen ? el('div', {}, el('button', { type: 'button', class: 'quellwahl', 'aria-expanded': 'false', text: 'Quellen', onclick: (e) => {
    const offen = e.target.getAttribute('aria-expanded') === 'true';
    e.target.setAttribute('aria-expanded', String(!offen)); quellen.hidden = offen;
  } }), quellen) : null;
  if (quellen) quellen.hidden = true;
  const verbunden = fokus.alle > fokus.wahl.length ? el('p', { class: 'grenze', text: `Hier sind ${fokus.wahl.length} von ${fokus.alle} Verbindungen herangekommen. Wende dich einem Wesen zu, um weiterzugehen.` }) : null;
  lesen.append(...[pfad.children.length ? pfad : null, inhalt, verbunden, quellTeil].filter(Boolean));
  if (teile.length) zeige(0);
  if (!stumm && schmal()) lesen.scrollTop = 0;
}

function zeigeVerbindung(i, j, fs) {
  const haupt = [...fs].sort((x, y) => (y.misch || 0) - (x.misch || 0));
  const art = fs.some((f) => f.lesart === LESART.UNTERSCHEIDEND) ? 'unterscheidet sich von' : fs.every((f) => f.lesart === LESART.OFFEN) ? 'offene Frage mit' : 'verbunden mit';
  const teile = [el('button', { type: 'button', class: 'zurueck', text: `← ${O[i].t}`, onclick: () => zeigeOrt(i) }),
    el('p', { class: 'gebiet', text: art, style: `color:${farbeCss(j, 0.4)}` }),
    el('h2', { text: O[j].t, style: `color:${farbeCss(j, 0.32)}` })];
  for (const f of haupt) {
    if (f.sicht?.label) teile.push(el('h3', { text: f.sicht.label }));
    if (f.sicht?.detail) teile.push(...absaetze(f.sicht.detail));
    if (f.sicht?.grenze) teile.push(el('p', { class: 'grenze', text: f.sicht.grenze }));
  }
  const q = quellListe(fs.flatMap((f) => f.quellen));
  if (q) teile.push(el('h3', { text: 'Quellen' }), q);
  teile.push(el('button', { type: 'button', class: 'quellwahl', text: `Zu „${O[j].t}“ wenden`, onclick: () => wendeDichZu(j) }));
  oeffneLesen(...teile);
}

// ——— Eingabe: ziehen, zoomen, tippen ———
const zeiger = new Map();
let zug = null;
function naechsterTreffer(x, y) {
  for (let k = treffer.length - 1; k >= 0; k--) {
    const h = treffer[k];
    if (h.box ? x >= h.box[0] && x <= h.box[2] && y >= h.box[1] && y <= h.box[3] : Math.hypot(x - h.x, y - h.y) <= h.r) return h;
  }
  return null;
}
function wesenBei(x, y) {
  if (detailstufe() === 0 && !fokus) {
    let best = null, bd = 16;
    for (const w of wesen) { const d = Math.hypot(kamera.sx(w.x) - x, kamera.sy(w.y) - y); if (d < bd) { bd = d; best = w; } }
    return best;
  }
  let best = null, bd = Infinity;
  for (const w of wesen) {
    if (inSzene.has(w.i)) continue;
    const d = Math.hypot(kamera.sx(w.x) - x, kamera.sy(w.y) - y);
    if (d < Math.max(12, w.radius * kam.zoom * 1.3) && d < bd) { bd = d; best = w; }
  }
  return best;
}
function tippe(x, y) {
  if (betrachten) {
    const h = naechsterTreffer(x, y);
    if (h && h.name === 'Stelle wählen') { h.aktion(x); return; }
    schliesseBetrachten(); return;
  }
  const h = naechsterTreffer(x, y);
  if (h) { h.aktion(x, y); return; }
  if (fokus) { loseFokus(); return; }
  const w = wesenBei(x, y);
  if (w) wendeDichZu(w.i);
}
leinwand.addEventListener('pointerdown', (e) => {
  leinwand.setPointerCapture(e.pointerId);
  zeiger.set(e.pointerId, [e.clientX, e.clientY]);
  if (zeiger.size === 1) zug = { x: e.clientX, y: e.clientY, cx: ziel.cx, cy: ziel.cy, weg: 0 };
  if (zeiger.size === 2) { const [a, b] = [...zeiger.values()]; zug = { ...zug, pinch: Math.hypot(a[0] - b[0], a[1] - b[1]), zoom: ziel.zoom, weg: 99 }; }
});
leinwand.addEventListener('pointermove', (e) => {
  if (!zeiger.has(e.pointerId)) {
    const h = naechsterTreffer(e.clientX, e.clientY);
    leinwand.classList.toggle('zeigt', !!h || (!!wesenBei(e.clientX, e.clientY) && !betrachten));
    return;
  }
  zeiger.set(e.pointerId, [e.clientX, e.clientY]);
  if (!zug) return;
  if (zeiger.size === 2 && zug.pinch) {
    const [a, b] = [...zeiger.values()];
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    zoomeUm((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (zug.zoom * d) / zug.pinch / ziel.zoom);
    return;
  }
  const dx = e.clientX - zug.x, dy = e.clientY - zug.y;
  zug.weg = Math.max(zug.weg, Math.hypot(dx, dy));
  if (zug.weg > 6 && !betrachten) {
    leinwand.classList.add('zieht');
    ziel.cx = zug.cx - dx / ziel.zoom; ziel.cy = zug.cy - dy / ziel.zoom;
    kam.cx = ziel.cx; kam.cy = ziel.cy;
    anfordern();
  }
});
const loslassen = (e) => {
  if (!zeiger.has(e.pointerId)) return;
  zeiger.delete(e.pointerId);
  leinwand.classList.remove('zieht');
  if (zeiger.size === 0) { if (zug && zug.weg <= 6 && e.type === 'pointerup') tippe(e.clientX, e.clientY); zug = null; }
};
leinwand.addEventListener('pointerup', loslassen);
leinwand.addEventListener('pointercancel', loslassen);
function zoomeUm(sx, sy, faktor) {
  const wx = kamera.wx(sx), wy = kamera.wy(sy);
  const z = grenzeZoom(ziel.zoom * faktor);
  ziel.zoom = z;
  ziel.cx = wx - (sx - W / 2) / z; ziel.cy = wy - (sy - H / 2) / z;
  if (ruhig()) Object.assign(kam, ziel);
  anfordern();
}
leinwand.addEventListener('wheel', (e) => { e.preventDefault(); zoomeUm(e.clientX, e.clientY, Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0015))); }, { passive: false });
$('#naeher').addEventListener('click', () => zoomeUm(W / 2, H / 2, 1.5));
$('#weiter').addEventListener('click', () => zoomeUm(W / 2, H / 2, 1 / 1.5));
window.addEventListener('keydown', (e) => {
  if (e.target.closest('input, textarea')) { if (e.key === 'Escape') schliesseSuche(); return; }
  const schritt = 120 / ziel.zoom;
  if (e.key === 'Escape') { if (betrachten) schliesseBetrachten(); else if (fokus) loseFokus(); else schliesseSuche(); }
  else if (e.key === '+' || e.key === '=') zoomeUm(W / 2, H / 2, 1.4);
  else if (e.key === '-') zoomeUm(W / 2, H / 2, 1 / 1.4);
  else if (e.key === 'ArrowLeft' && !e.target.closest('button')) { ziel.cx -= schritt; anfordern(); }
  else if (e.key === 'ArrowRight' && !e.target.closest('button')) { ziel.cx += schritt; anfordern(); }
  else if (e.key === 'ArrowUp' && !e.target.closest('button')) { ziel.cy -= schritt; anfordern(); }
  else if (e.key === 'ArrowDown' && !e.target.closest('button')) { ziel.cy += schritt; anfordern(); }
});

// ——— Suche ———
const linse = $('#linse'), suchfeld = $('#suchfeld'), suchwort = $('#suchwort'), trefferListe = $('#treffer');
const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
const suchIndex = O.map((o, i) => ({ i, n: norm(o.t) }));
function schliesseSuche() { suchfeld.hidden = true; linse.setAttribute('aria-expanded', 'false'); }
linse.addEventListener('click', () => {
  const offen = suchfeld.hidden;
  suchfeld.hidden = !offen; linse.setAttribute('aria-expanded', String(offen));
  if (offen) suchwort.focus();
});
suchwort.addEventListener('input', () => {
  const q = norm(suchwort.value.trim());
  trefferListe.replaceChildren();
  if (q.length < 2) return;
  const gebiete = welt.gebiete.map((g, k) => ({ k, n: norm(g.name) })).filter((g) => g.n.includes(q)).slice(0, 2);
  for (const g of gebiete) {
    const os = O.filter((o) => o.r === g.k);
    const cx = os.reduce((s, o) => s + o.x, 0) / os.length, cy = os.reduce((s, o) => s + o.y, 0) / os.length;
    trefferListe.append(el('li', {}, el('button', { type: 'button', onclick: () => { if (fokus) loseFokus(); fliegeZu(cx, cy, passend() * 2.4); schliesseSuche(); } },
      document.createTextNode(welt.gebiete[g.k].name), el('small', { text: 'Gebiet' }))));
  }
  const orte = suchIndex.filter((s) => s.n.includes(q)).sort((a, b) => (b.n.startsWith(q) - a.n.startsWith(q)) || O[b.i].grad - O[a.i].grad).slice(0, 8);
  for (const s of orte) {
    trefferListe.append(el('li', {}, el('button', { type: 'button', onclick: () => { schliesseSuche(); wendeDichZu(s.i); } },
      document.createTextNode(O[s.i].t), el('small', { text: welt.gebiete[O[s.i].r].name }))));
  }
});
suchwort.addEventListener('keydown', (e) => { if (e.key === 'Enter') trefferListe.querySelector('button')?.click(); });

// ——— Zugang ———
const bluete = $('#bluete'), blaetter = $('#blaetter');
bluete.addEventListener('click', () => { const offen = blaetter.hidden; blaetter.hidden = !offen; bluete.setAttribute('aria-expanded', String(offen)); });
for (const b of document.querySelectorAll('.blatt')) {
  b.addEventListener('click', () => {
    const w = WAHL[b.dataset.wahl];
    pref[b.dataset.wahl] = w.werte[(w.werte.indexOf(pref[b.dataset.wahl]) + 1) % w.werte.length];
    speichere(); wendeZugangAn();
  });
}
systemRuhig.addEventListener?.('change', anfordern);
window.addEventListener('storage', (e) => { if (e.key === SCHLUESSEL) { Object.assign(pref, lies()); wendeZugangAn(); } });

// ——— Verzeichnis für Tastatur und Vorlesen ———
const verzeichnis = $('#verzeichnis');
welt.gebiete.forEach((g, k) => {
  const liste = el('ul');
  O.forEach((o, i) => { if (o.r === k) liste.append(el('li', {}, el('button', { type: 'button', text: o.t, onclick: () => wendeDichZu(i) }))); });
  verzeichnis.append(el('h2', { text: g.name }), liste);
});

// ——— Start ———
window.addEventListener('resize', groesse);
groesse();
wendeZugangAn();
const mitte = [(G.x0 + G.x1) / 2 + 40, (G.y0 + G.y1) / 2 - 30];
Object.assign(kam, { cx: mitte[0], cy: mitte[1], zoom: passend() });
Object.assign(ziel, kam);
const anker = decodeURIComponent(location.hash.slice(1));
const gesucht = anker ? O.findIndex((o) => o.t === anker) : -1;
if (gesucht >= 0) { bild(performance.now()); wendeDichZu(gesucht, { stumm: true }); }
window.addEventListener('hashchange', () => {
  const name = decodeURIComponent(location.hash.slice(1));
  const i = name ? O.findIndex((o) => o.t === name) : -1;
  if (i >= 0 && (!fokus || fokus.i !== i)) wendeDichZu(i);
});
// Für die Prüfung: wo ein Ort gerade auf dem Bildschirm liegt (keine Kennungen in der Oberfläche)
window.lebendeWelt = { aufSchirm: (titel) => { const w = wesen[O.findIndex((o) => o.t === titel)]; return w ? [kamera.sx(w.x), kamera.sy(w.y)] : null; },
  treffer: () => treffer.map((h) => ({ name: h.name, x: h.box ? (h.box[0] + h.box[2]) / 2 : h.x, y: h.box ? (h.box[1] + h.box[3]) / 2 : h.y })) };
document.body.dataset.bereit = '1';
anfordern();
