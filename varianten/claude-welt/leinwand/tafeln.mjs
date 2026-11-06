// Design-Leinwand: vier Tafeln mit echten Daten (Welt, Gebiet, Begegnung, Medienort).
// Aufruf: index.html?tafel=welt|gebiet|begegnung|medien&t=Sekunden&b=Breite&h=Höhe
import { berechneFeld, faerbeFeld, isolinien, glaette, gesamtDichte, dichteAn, TAU } from '../kern/feld.mjs';
import { bereiteWesen, bewege, spur } from '../kern/leben.mjs';
import * as Z from '../kern/zeichner.mjs';
import { LESART, gemeinsamerRadius, zuwachs, paarStaerke, GELTUNG, KURVE } from '../kern/begegnung.mjs';
import { mischeOklch } from '../kern/farbe.mjs';
import { zeichneSzene, beschrifte } from './szene.mjs';

const q = new URLSearchParams(location.search);
const TAFEL = q.get('tafel') || 'welt';
const T = Number(q.get('t') || 37);
const B = Number(q.get('b') || 1600), H = Number(q.get('h') || 1000);
const leinwand = document.getElementById('welt');
const dpr = Math.min(2, window.devicePixelRatio || 1);
leinwand.width = B * dpr; leinwand.height = H * dpr;
leinwand.style.width = `${B}px`; leinwand.style.height = `${H}px`;
const ctx = leinwand.getContext('2d');
ctx.scale(dpr, dpr);

await document.fonts.load('450 14px Newsreader');
await document.fonts.load('italic 450 14px Newsreader');
await document.fonts.load('600 14px Manrope');

const welt = await (await fetch('../daten/welt.json')).json();
const feld = berechneFeld(welt, { zellen: 420 });
const bild = Z.feldBild(feld, faerbeFeld(feld, welt, Z.GRUND));
const membranen = welt.gebiete.map((g, k) => ({ gebiet: k, linien: isolinien(feld, feld.dichte[k], TAU).map((l) => glaette(l, 2)) }));
const summe = gesamtDichte(feld);
const hoehen = [0.9, 1.8, 3.2, 5.2, 8].map((stufe) => ({ stufe, linien: isolinien(feld, summe, stufe).map((l) => glaette(l, 2)) }));
const wesen = bereiteWesen(welt);
bewege(wesen, T);
const farbeVon = (w) => Z.eigenfarbe(welt.gebiete[w.gebiet].lch, w.ort.k);

function schwerpunkt(k) {
  const os = welt.orte.filter((o) => o.r === k);
  return [os.reduce((s, o) => s + o.x, 0) / os.length, os.reduce((s, o) => s + o.y, 0) / os.length];
}

function bedienung(kamera, { zugang = true } = {}) {
  // Kopf: Titel als Schrift in der Welt, kein Balken
  Z.schrift(ctx, 'Borderline verstehen', 34, 46, { groesse: 25, gewicht: 520, farbe: Z.TINTE });
  Z.schrift(ctx, 'Die Welt der Phänomene', 35, 70, { groesse: 15, kursiv: true, farbe: Z.TINTE_LEISE });
  if (!zugang) return;
  // Zugang: ein Samen mit fünf Blättern (Textumfang, Niveau, Reiz, Bilddichte, Ton) unten rechts
  const x = B - 64, y = H - 64;
  ctx.save();
  for (let k = 0; k < 5; k++) {
    const a = -Math.PI / 2 + (k * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(a) * 15, y + Math.sin(a) * 15, 13, 7, a, 0, Math.PI * 2);
    ctx.fillStyle = Z.cssLch([0.93, 0.03, 60 + k * 50], 0.95);
    ctx.fill();
    ctx.strokeStyle = Z.cssLch([0.55, 0.05, 60 + k * 50], 0.55);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fillStyle = Z.cssLch([0.99, 0.01, 80]); ctx.fill();
  ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.5); ctx.stroke();
  ctx.restore();
  Z.schrift(ctx, 'Zugang', x, y + 46, { groesse: 13, ausrichtung: 'center', farbe: Z.TINTE_LEISE, familie: Z.SCHRIFT_SANS, gewicht: 600, sperrung: 0.6 });
  // Annähern und Entfernen: zwei Kiesel
  for (const [k, zeichen] of [[0, '+'], [1, '−']]) {
    const px = B - 152 - k * 46, py = H - 58;
    ctx.beginPath(); ctx.ellipse(px, py, 18, 16, 0.3, 0, Math.PI * 2);
    ctx.fillStyle = Z.cssLch([0.985, 0.008, 80], 0.95); ctx.fill();
    ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.35); ctx.stroke();
    Z.schrift(ctx, zeichen, px, py + 6, { groesse: 20, ausrichtung: 'center', familie: Z.SCHRIFT_SANS, hof: false, farbe: Z.TINTE });
  }
  // Suche: eine Linse oben rechts
  ctx.beginPath(); ctx.arc(B - 58, 52, 17, 0, Math.PI * 2);
  ctx.fillStyle = Z.cssLch([0.985, 0.008, 80], 0.95); ctx.fill(); ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.35); ctx.stroke();
  ctx.beginPath(); ctx.arc(B - 61, 49, 6.5, 0, Math.PI * 2); ctx.moveTo(B - 56, 54); ctx.lineTo(B - 51, 59);
  ctx.strokeStyle = Z.cssLch(Z.TINTE, 0.8); ctx.lineWidth = 1.6; ctx.stroke();
}

function tafelWelt() {
  const g = feld.grenzen;
  const zoom = Math.min(B / (g.x1 - g.x0), H / (g.y1 - g.y0)) * 0.98;
  const kamera = new Z.Kamera((g.x0 + g.x1) / 2 + 40, (g.y0 + g.y1) / 2 - 30, zoom, B, H);
  Z.zeichneGrund(ctx, B, H);
  Z.zeichneFeld(ctx, kamera, feld, bild);
  Z.zeichneHoehenlinien(ctx, kamera, hoehen);
  Z.zeichneMembranen(ctx, kamera, membranen, welt, T);
  for (const w of wesen) Z.zeichnePunkt(ctx, kamera, w, farbeVon(w));
  Z.zeichneKorn(ctx, B, H);
  // Große Wesen wie Städte auf einer Karte benennen
  const kand = [...wesen].filter((w) => w.ort.t.length <= 34 && w.i !== 1031).sort((a, b) => b.ort.grad - a.ort.grad).slice(0, 22)
    .map((w) => ({ text: w.ort.t, x: kamera.sx(w.x), y: kamera.sy(w.y), r: 3, groesse: 11.5, w }));
  const start = wesen[1031];
  const startK = { text: start.ort.t, x: kamera.sx(start.x), y: kamera.sy(start.y), r: 6, groesse: 12.5, gewicht: 560, w: start };
  const [startP] = Z.platziereNamen(ctx, [startK]);
  ctx.font = `560 12.5px ${Z.SCHRIFT_SERIF}`;
  const sb = ctx.measureText(startK.text).width;
  const sx0 = startP.ausrichtung === 'left' ? startP.x : startP.ausrichtung === 'right' ? startP.x - sb : startP.x - sb / 2;
  const belegtNamen = [[sx0 - 4, startP.y - 14, sx0 + sb + 4, startP.y + 5]];
  const gebietsNamen = welt.gebiete.map((geb, k) => ({ text: geb.name.toUpperCase(), k }));
  for (const n of [...gebietsNamen].sort((a, b) => (b.k === 6) - (a.k === 6) || welt.gebiete[b.k].zahl - welt.gebiete[a.k].zahl)) {
    const frei = (sx, sy) => welt.gebiete.every((_, k) => k === n.k || dichteAn(feld, k, kamera.wx(sx), kamera.wy(sy)) < TAU * 0.9);
    Z.gebietsnameAmRand(ctx, kamera, n.text, membranen[n.k].linien, Z.tief(welt.gebiete[n.k].lch, 0.4), { belegt: belegtNamen, frei });
  }
  const platz = [startP, ...Z.platziereNamen(ctx, kand, { vorbelegt: belegtNamen })];
  for (const p of platz) {
    Z.schrift(ctx, p.text, p.x, p.y, { groesse: p.groesse, gewicht: p.gewicht || 450, ausrichtung: p.ausrichtung,
      farbe: p.w === start ? Z.tief(welt.gebiete[6].lch, 0.36) : Z.TINTE_LEISE });
  }
  // Startort: feiner Ring
  ctx.beginPath(); ctx.arc(kamera.sx(start.x), kamera.sy(start.y), 9, 0, Math.PI * 2);
  ctx.strokeStyle = Z.cssLch(Z.tief(welt.gebiete[6].lch, 0.45), 0.8); ctx.lineWidth = 1.2; ctx.stroke();
  bedienung(kamera);
}

function hintergrund(cx, cy, zoom, deckung = 0.5) {
  const kamera = new Z.Kamera(cx, cy, zoom, B, H);
  Z.zeichneGrund(ctx, B, H);
  Z.zeichneFeld(ctx, kamera, feld, bild, deckung);
  Z.zeichneHoehenlinien(ctx, kamera, hoehen);
  Z.zeichneMembranen(ctx, kamera, membranen, welt, T);
  return kamera;
}

function quellfaden(x0, y0, x1, y1, quellen, { breite = 330, farbe = Z.TINTE_LEISE, zusatz = '' } = {}) {
  ctx.save();
  ctx.strokeStyle = Z.cssLch(farbe, 0.5);
  ctx.lineWidth = 0.9;
  ctx.setLineDash([1, 3]);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.bezierCurveTo(x0, (y0 + y1) / 2, x1 - 20, y1 - 30, x1 - 6, y1 - 6); ctx.stroke();
  ctx.restore();
  let y = y1 + 8;
  for (const q of quellen) {
    const t = Z.quellTitel(q);
    const kopf = [t.wer, t.jahr].filter(Boolean).join(' · ');
    if (kopf) { Z.schrift(ctx, kopf, x1, y, { groesse: 12.5, familie: Z.SCHRIFT_SANS, gewicht: 600, farbe: Z.TINTE_LEISE, sperrung: 0.3 }); y += 17; }
    y = Z.absatz(ctx, t.titel, x1, y, breite, { groesse: 14, kursiv: true, farbe: Z.TINTE }) + 8;
  }
  if (zusatz) y = Z.absatz(ctx, zusatz, x1, y + 2, breite, { groesse: 13, farbe: Z.TINTE_LEISE });
  return y;
}

function pfadsteine(x, y, abschnitte, farbe) {
  // Entfalten durch Hinwenden: Abschnitte des Ortstexts als Trittsteine auf einem Pfad
  ctx.save();
  ctx.strokeStyle = Z.cssLch(farbe, 0.35);
  ctx.setLineDash([2, 5]);
  ctx.beginPath(); ctx.moveTo(x, y);
  abschnitte.forEach((_, k) => ctx.lineTo(x + 18 + k * 96, y + Math.sin(k * 1.3) * 7 + 22));
  ctx.stroke();
  ctx.restore();
  abschnitte.forEach((a, k) => {
    const px = x + 18 + k * 96, py = y + Math.sin(k * 1.3) * 7 + 22;
    ctx.beginPath(); ctx.ellipse(px, py, 7, 5, k * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = Z.cssLch(k === 0 ? Z.tief(farbe, 0.55) : [0.97, 0.02, farbe[2]], 0.95); ctx.fill();
    ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.6); ctx.lineWidth = 1; ctx.stroke();
    Z.schrift(ctx, a, px, py + (k % 2 ? -13 : 24), { groesse: 11.5, ausrichtung: 'center', familie: Z.SCHRIFT_SANS, gewicht: 560, farbe: Z.TINTE_LEISE });
  });
}

async function ortstext(i) {
  try { return await (await fetch(`../daten/texte/${i}.json`)).json(); } catch { return null; }
}

async function tafelBegegnung() {
  const modus = q.get('modus') || 'streng';
  const O = welt.orte;
  hintergrund(-120, -200, 2.4, 0.42);
  // Augenblick der Begegnung: die Nachbarn mit Fuge sind herangezogen (Hinwenden ruft sie herbei)
  const A = 1031, E = 1030, Wv = 1032, G = 1034, N = 561, S = 1223, V = 1053, U = 1194, P = 1033;
  const r = (i) => (11 + 7 * Math.log2(1 + O[i].grad)) * 1.7;
  const pos = { [A]: [560, 430], [E]: [285, 255], [Wv]: [300, 650], [G]: [920, 480], [N]: [1235, 300], [S]: [1240, 690], [P]: [790, 175] };
  const an = (basis, i, winkel) => [pos[basis][0] + (r(basis) + r(i)) * 0.8 * Math.cos(winkel), pos[basis][1] + (r(basis) + r(i)) * 0.8 * Math.sin(winkel)];
  pos[V] = an(A, V, 2.45);
  pos[U] = an(G, U, 2.15);
  const glieder = [A, E, Wv, G, N, S, V, U, P].map((i) => ({ i, x: pos[i][0], y: pos[i][1] }));
  // Vorbeiziehen: „Abstand wünschen“ hat keine Fuge zu diesem Verbund
  ctx.save();
  ctx.strokeStyle = Z.cssLch(Z.tief(welt.gebiete[6].lch, 0.55), 0.45);
  ctx.setLineDash([1.5, 7]); ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(1590, 70); ctx.bezierCurveTo(1350, 40, 1060, 200, 830, 172); ctx.stroke();
  ctx.restore();
  const info = zeichneSzene(ctx, welt, glieder, { modus, t: T });
  beschrifte(ctx, welt, glieder, info, {
    namen: { [A]: { dx: 40, dy: -58, ausrichtung: 'left', groesse: 19, gewicht: 620 }, [E]: { dx: 0, dy: -50, ausrichtung: 'center' },
      [Wv]: { dx: 0, dy: 58, ausrichtung: 'center' }, [G]: { dx: 0, dy: -70, ausrichtung: 'center', groesse: 17 },
      [N]: { dx: 0, dy: -48, ausrichtung: 'center' }, [S]: { dx: 0, dy: 60, ausrichtung: 'center' },
      [V]: { dx: -46, dy: 8, ausrichtung: 'right' }, [U]: { dx: 0, dy: 56, ausrichtung: 'center' },
      [P]: { dx: -44, dy: 6, ausrichtung: 'right' } },
    fugen: [{ a: A, b: E, versatz: 16, bogen: 6 }, { a: A, b: Wv, versatz: -16, bogen: -6 }, { a: A, b: G, versatz: 18, bogen: 4 },
      { a: G, b: N, versatz: -16 }, { a: G, b: S, versatz: 18, bogen: -4 }],
  });
  // Wandbeschriftung: die trennende Fuge steht an ihrer Naht
  const fV = welt.fugen.find((f) => (f.a === V && f.b === A) || (f.a === A && f.b === V));
  Z.absatz(ctx, fV.label, pos[V][0] - 46, pos[V][1] + 34, 250, { groesse: 13.5, kursiv: true, farbe: Z.TINTE_LEISE, ausrichtung: 'right' });
  const fU = welt.fugen.find((f) => (f.a === U && f.b === G) || (f.a === G && f.b === U));
  Z.absatz(ctx, fU.label, pos[U][0], pos[U][1] + 80, 260, { groesse: 13.5, kursiv: true, farbe: Z.TINTE_LEISE, ausrichtung: 'center' });
  // Der Startort spricht: Kernsatz in der Welt, darunter der Pfad seiner Abschnitte
  const text = await ortstext(A);
  const farbeA = Z.eigenfarbe(welt.gebiete[6].lch, 'phenomenon');
  Z.absatz(ctx, O[A].s, 70, 805, 470, { groesse: 18, kursiv: true, farbe: Z.TINTE });
  const abschnitte = (text?.body.match(/^## (.+)$/gm) || []).map((h) => h.replace('## ', ''));
  pfadsteine(70, 900, abschnitte, farbeA);
  // Quellfaden an der Brücke zu „Schutz hängt nicht an einem Grenzwert“
  const fS = welt.fugen.find((f) => (f.a === G && f.b === S) || (f.a === S && f.b === G));
  const mx = (pos[G][0] + pos[S][0]) / 2, my = (pos[G][1] + pos[S][1]) / 2;
  Z.zeichneQuellstein(ctx, mx + 26, my + 18, fS.quellen.length, welt.gebiete[9].lch);
  quellfaden(mx + 26, my + 26, 1150, 800, fS.quellen.map((k) => welt.quellen[k]), { breite: 380,
    zusatz: 'Beide Quellen gehören zu den Texten der zwei Orte. Die Brücke selbst ist eine redaktionelle Lesart.' });
  bedienung(null, { zugang: true });
}

async function tafelVerstaerkung() {
  const O = welt.orte;
  const kamera = hintergrund(1190, 900, 2.6, 0.4);
  const glieder = [{ i: 158, x: 880, y: 500 }, { i: 151, x: 620, y: 330 }, { i: 169, x: 640, y: 680 }, { i: 194, x: 1170, y: 610 }];
  const info = zeichneSzene(ctx, welt, glieder, { modus: 'streng', t: T });
  beschrifte(ctx, welt, glieder, info, {
    namen: { 158: { dx: 70, dy: -40, ausrichtung: 'left', groesse: 18, gewicht: 620 }, 151: { dx: 0, dy: -72, ausrichtung: 'center', groesse: 16 },
      169: { dx: 0, dy: 84, ausrichtung: 'center', groesse: 16 }, 194: { dx: 0, dy: 66, ausrichtung: 'center', groesse: 16 } },
    fugen: [{ a: 151, b: 169, versatz: -22, bogen: -12 }, { a: 158, b: 194, versatz: -22 }, { a: 151, b: 158, versatz: -24 }, { a: 169, b: 158, versatz: 24, bogen: -8 }],
  });
  const [w] = [...info.wachstum.values()].filter((x) => x.W > 0);
  // Belege der stärksten Fuge
  const f = welt.fugen.find((x) => (x.a === 151 && x.b === 169) || (x.a === 169 && x.b === 151));
  Z.zeichneQuellstein(ctx, 560, 505, f.quellen.length, welt.gebiete[1].lch);
  quellfaden(560, 512, 90, 760, f.quellen.slice(0, 3).map((k) => welt.quellen[k]), { breite: 360 });
  Z.absatz(ctx, O[158].s, 1010, 150, 440, { groesse: 17, kursiv: true });
  bedienung(null, { zugang: true });
  document.body.dataset.wachstum = JSON.stringify({ W: w?.W, g: w?.g });
}

// Gebietsname im eigenen Feld: Rastersuche nach freier, eindeutig eigener Stelle nahe der sichtbaren Mitte.
function gebietsnameImFeld(kamera, k, belegt, groesse = 15) {
  const name = welt.gebiete[k].name.toUpperCase();
  ctx.font = `620 ${groesse}px ${Z.SCHRIFT_SANS}`;
  const breite = ctx.measureText(name).width + name.length * 2.4;
  const eigen = (sx, sy) => dichteAn(feld, k, kamera.wx(sx), kamera.wy(sy));
  const fremd = (sx, sy) => welt.gebiete.some((_, j) => j !== k && dichteAn(feld, j, kamera.wx(sx), kamera.wy(sy)) > TAU * 0.8);
  const kand = [];
  for (let y = 40; y < H - 30; y += 18) for (let x = breite / 2 + 16; x < B - breite / 2 - 16; x += 24) {
    const box = [x - breite / 2 - 6, y - groesse - 4, x + breite / 2 + 6, y + 6];
    let ok = true;
    for (let i = 0; i <= 4 && ok; i++) { const px = box[0] + ((box[2] - box[0]) * i) / 4; if (eigen(px, y - groesse / 2) < TAU * 1.1 || fremd(px, y - groesse / 2)) ok = false; }
    if (!ok || belegt.some((q) => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]))) continue;
    kand.push({ x, y, box, wert: eigen(x, y) });
  }
  if (!kand.length) return;
  kand.sort((a, b) => b.wert - a.wert);
  const w = kand[Math.floor(kand.length * 0.15)];
  Z.schrift(ctx, name, w.x, w.y, { groesse, ausrichtung: 'center', familie: Z.SCHRIFT_SANS, gewicht: 620, sperrung: 2.4, farbe: Z.tief(welt.gebiete[k].lch, 0.4) });
  belegt.push(w.box);
}

function ladeBild(src) {
  return new Promise((ok) => { const b = new Image(); b.onload = () => ok(b); b.onerror = () => ok(null); b.src = src; });
}

// Organische Form: Kreis mit sanften Ausbuchtungen (Lage aus dem Index der Form, nicht aus Kennungen)
function blobPfad(x, y, r, k = 0, wellen = 0.06) {
  ctx.beginPath();
  for (let a = 0; a <= 48; a++) {
    const th = (a / 48) * Math.PI * 2;
    const rr = r * (1 + wellen * Math.sin(th * 3 + k * 1.7) + wellen * 0.6 * Math.sin(th * 5 - k));
    const px = x + Math.cos(th) * rr, py = y + Math.sin(th) * rr * 1.08;
    if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function bildImKiesel(bild, x, y, r, k) {
  ctx.save();
  ctx.shadowColor = Z.cssLch([0.4, 0.03, 60], 0.22); ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
  blobPfad(x, y, r, k); ctx.fillStyle = Z.cssLch([0.97, 0.01, 80]); ctx.fill();
  ctx.restore();
  ctx.save();
  blobPfad(x, y, r * 0.96, k); ctx.clip();
  if (bild) {
    const f = Math.max((2 * r) / bild.width, (2.2 * r) / bild.height);
    ctx.drawImage(bild, x - (bild.width * f) / 2, y - (bild.height * f) / 2.3, bild.width * f, bild.height * f);
  }
  ctx.restore();
  blobPfad(x, y, r * 0.96, k);
  ctx.strokeStyle = Z.cssLch([0.99, 0.01, 80], 0.9); ctx.lineWidth = 2; ctx.stroke();
}

async function tafelGebiet() {
  const O = welt.orte;
  const kamera = hintergrund(-150, -200, 2.05, 0.85);
  // Porträtlichtung zwischen den beiden Orten, denen der Bestand die sieben Bildnisse zuordnet (1039, 1042)
  const LX = (O[1039].x + O[1042].x) / 2 - 10, LY = (O[1039].y + O[1042].y) / 2 + 5, LR = 66;
  bewege(wesen, T);
  for (const w of wesen) {
    const d = Math.hypot(w.x - LX, w.y - LY);
    if (d < LR + 40) { const nd = LR + 16 + d * 0.9; w.x = LX + ((w.x - LX) / Math.max(1, d)) * nd; w.y = LY + ((w.y - LY) / Math.max(1, d)) * nd; }
  }
  const sichtbar = wesen.filter((w) => kamera.sichtbar(w.x, w.y, 60));
  // Arme zuerst (unter den Körpern)
  for (const w of sichtbar) {
    const fl = farbeVon(w);
    for (const fi of w.fugen.slice(0, 16)) {
      const f = welt.fugen[fi];
      const j = f.a === w.i ? f.b : f.a;
      const arm = Z.armGeometrie(w, f, wesen[j], T, 0, 1.0);
      Z.zeichneArm(ctx, kamera, arm, f, Z.tief(fl, 0.52), { alpha: 0.8, dicke: 1 });
    }
  }
  for (const w of sichtbar) Z.zeichneKoerper(ctx, kamera, w, farbeVon(w), { groesse: 1.15 });
  // Lichtung
  const lx = kamera.sx(LX), ly = kamera.sy(LY), lr = LR * kamera.zoom;
  const hof = ctx.createRadialGradient(lx, ly, lr * 0.5, lx, ly, lr * 1.35);
  hof.addColorStop(0, Z.cssLch(Z.GRUND_HELL, 0.97)); hof.addColorStop(0.72, Z.cssLch(Z.GRUND_HELL, 0.9)); hof.addColorStop(1, Z.cssLch(Z.GRUND_HELL, 0));
  ctx.fillStyle = hof; blobPfad(lx, ly, lr * 1.35, 3, 0.05); ctx.fill();
  const werke = [
    ['franz-heinz-2019', 'Franz Heinz', 2019], ['lennart-2010', 'Lennart', 2010], ['jannik-2010', 'Jannik', 2010],
    ['franco-2015', 'Franco', 2015], ['linda-2005', 'Linda', 2005], ['evelyne-2005', 'Evelyne', 2005], ['andrea-2008', 'Andrea', 2008],
  ];
  const bilder = await Promise.all(werke.map(([d]) => ladeBild(`/app/atlas/assets/media/walter-andreas-kirchner-${d}.jpg`)));
  werke.forEach(([, titel, jahr], k) => {
    const th = -Math.PI / 2 + (k * Math.PI * 2) / werke.length;
    const px = lx + Math.cos(th) * lr * 0.6, py = ly + Math.sin(th) * lr * 0.6;
    bildImKiesel(bilder[k], px, py, lr * 0.26, k);
    // Titel auf dem äußeren Ring, nahe seinem Bildnis
    const bogen = [];
    for (let m = -10; m <= 10; m++) { const a = th + (m / 10) * 0.3; bogen.push([lx + Math.cos(a) * (lr * 1.02), ly + Math.sin(a) * (lr * 1.02)]); }
    Z.textAufKurve(ctx, `${titel} · ${jahr}`, Math.sin(th) > 0.2 ? bogen.reverse() : bogen, { groesse: 11.5, kursiv: false, familie: Z.SCHRIFT_SANS, gewicht: 560, farbe: Z.TINTE_LEISE, versatz: Math.sin(th) > 0.2 ? 12 : -4 });
  });
  // Mitte bleibt frei: die Lichtung. Urheber nur einmal, ohne Deutung.
  Z.schrift(ctx, 'Walter Andreas Kirchner', lx, ly + lr * 1.32 + 6, { groesse: 14, ausrichtung: 'center', kursiv: true, farbe: Z.TINTE });
  Z.schrift(ctx, 'sieben Bildnisse in Marmor', lx, ly + lr * 1.32 + 24, { groesse: 11.5, ausrichtung: 'center', familie: Z.SCHRIFT_SANS, gewicht: 560, farbe: Z.TINTE_LEISE });
  // Namen ohne Überdeckung, Startort zuerst, dann nach Zahl der Fugen
  const kand = sichtbar.sort((a, b) => (b.i === 1031) - (a.i === 1031) || b.ort.grad - a.ort.grad).map((w) => ({
    text: w.ort.t, x: kamera.sx(w.x), y: kamera.sy(w.y), r: w.radius * kamera.zoom * 1.15 + 2, groesse: w.i === 1031 ? 15 : 13, gewicht: w.i === 1031 ? 620 : 470, w }));
  const koerperBoxen = sichtbar.map((w) => { const x = kamera.sx(w.x), y = kamera.sy(w.y), r = w.radius * kamera.zoom * 1.2; return [x - r, y - r, x + r, y + r]; });
  const vorbelegt = [[lx - lr * 1.25, ly - lr * 1.25, lx + lr * 1.25, ly + lr * 1.25 + 32], [20, 20, 420, 90], [B - 300, H - 110, B, H], [B - 90, 20, B, 90]];
  // Gebietsnamen zuerst: dort, wo das eigene Gebiet dicht ist und kein anderes Gebiet liegt
  const belegt = [...vorbelegt, ...koerperBoxen];
  for (const k of [6, 9, 4, 5]) gebietsnameImFeld(kamera, k, belegt, 15);
  const platz = Z.platziereNamen(ctx, kand, { vorbelegt: [...belegt] });
  for (const p of platz) {
    Z.schrift(ctx, p.text, p.x, p.y, { groesse: p.groesse, gewicht: p.gewicht, ausrichtung: p.ausrichtung, farbe: Z.tief(welt.gebiete[p.w.gebiet].lch, 0.36) });
  }
  bedienung(kamera);
}

async function tafelKlang() {
  const O = welt.orte;
  // Lage: im Bestand nur auf Gebietsebene belegt (TraumaAtlas, Diagnose & Differenzierung, Forschung & Einordnung).
  // Gesetzt am Westrand des TraumaAtlas, der den beiden anderen Gebieten zugewandt ist.
  const QX = 975, QY = -360, QR = 100;
  const kamera = hintergrund(1120, -420, 1.55, 0.8);
  bewege(wesen, T);
  for (const w of wesen) {
    const d = Math.hypot(w.x - QX, w.y - QY);
    if (d < QR + 30) { const nd = QR + 14 + d * 0.6; w.x = QX + ((w.x - QX) / Math.max(1, d)) * nd; w.y = QY + ((w.y - QY) / Math.max(1, d)) * nd; }
  }
  const sichtbar = wesen.filter((w) => kamera.sichtbar(w.x, w.y, 60));
  for (const w of sichtbar) for (const fi of w.fugen.slice(0, 10)) {
    const f = welt.fugen[fi]; const j = f.a === w.i ? f.b : f.a;
    Z.zeichneArm(ctx, kamera, Z.armGeometrie(w, f, wesen[j], T, 0, 1.0), f, Z.tief(farbeVon(w), 0.52), { alpha: 0.7, dicke: 0.9 });
  }
  for (const w of sichtbar) Z.zeichneKoerper(ctx, kamera, w, farbeVon(w), { groesse: 1.1 });
  // Klangquelle: jeder Ring ist ein Abschnitt des Tons, Stärke = gemessene Lautheit (aus der Datei berechnet)
  const klang = await (await fetch('../daten/klang/trauma-sicherheit-behandlung.json')).json();
  const x = kamera.sx(QX), y = kamera.sy(QY), R = QR * kamera.zoom;
  const lichthof = ctx.createRadialGradient(x, y, 0, x, y, R * 1.25);
  lichthof.addColorStop(0, Z.cssLch(Z.GRUND_HELL, 1)); lichthof.addColorStop(0.8, Z.cssLch(Z.GRUND_HELL, 0.92)); lichthof.addColorStop(1, Z.cssLch(Z.GRUND_HELL, 0));
  ctx.fillStyle = lichthof; ctx.beginPath(); ctx.arc(x, y, R * 1.25, 0, Math.PI * 2); ctx.fill();
  const farbe = welt.gebiete[0].lch;
  const gehoert = 0.38; // Wiedergabestand im Bild: 0:42 von 1:52
  const n = klang.huelle.length, r0 = 26;
  klang.huelle.forEach((a, k) => {
    const rad = r0 + (k / n) * (R - r0);
    const vorbei = k / n <= gehoert;
    ctx.beginPath();
    for (let m = 0; m <= 90; m++) {
      const th = (m / 90) * Math.PI * 2;
      const welle = a * 2.6 * Math.sin(th * (6 + (k % 5)) + k * 0.7);
      const px = x + Math.cos(th) * (rad + welle), py = y + Math.sin(th) * (rad + welle);
      if (m === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = Z.cssLch(vorbei ? Z.tief(farbe, 0.5) : Z.tief(farbe, 0.62), vorbei ? 0.25 + a * 0.55 : 0.08 + a * 0.22);
    ctx.lineWidth = 0.4 + a * 1.6;
    ctx.stroke();
  });
  // Wiedergabestand als feiner Bogen außen
  ctx.save(); ctx.lineCap = 'round';
  ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.85); ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.arc(x, y, R + 9, -Math.PI / 2, -Math.PI / 2 + gehoert * Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.6), 0.2);
  ctx.beginPath(); ctx.arc(x, y, R + 9, -Math.PI / 2 + gehoert * Math.PI * 2, Math.PI * 1.5); ctx.stroke();
  ctx.restore();
  // Mitte: Samen zum Anhalten (läuft gerade)
  ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fillStyle = Z.cssLch([0.99, 0.01, 80]); ctx.fill();
  ctx.strokeStyle = Z.cssLch(Z.tief(farbe, 0.45), 0.7); ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = Z.cssLch(Z.tief(farbe, 0.4));
  ctx.fillRect(x - 6, y - 7, 4, 14); ctx.fillRect(x + 2, y - 7, 4, 14);
  // Titel auf dem oberen Bogen
  const bogen = [];
  for (let m = -20; m <= 20; m++) { const a = -Math.PI / 2 + (m / 20) * 0.62; bogen.push([x + Math.cos(a) * (R + 24), y + Math.sin(a) * (R + 24)]); }
  Z.textAufKurve(ctx, 'Trauma, Sicherheit und Behandlung', bogen, { groesse: 17, kursiv: false, farbe: Z.TINTE, gewicht: 560 });
  // Was gerade gesagt wird, steht in der Welt (Untertitel des Bestands, Stelle 0:21 bis 0:33)
  const zeilen = ['Wenn sich jemand extrem zurückzieht, kann das zig Ursachen haben.',
    'Eine belastende Erfahrung allein ist eben noch lange keine posttraumatische Belastungsstörung.'];
  let ty = y + R + 52;
  Z.absatz(ctx, zeilen[0], x - 250, ty, 500, { groesse: 15, kursiv: true, farbe: Z.TINTE_LEISE, ausrichtung: 'left', alpha: 0.6 });
  Z.absatz(ctx, zeilen[1], x - 250, ty + 30, 500, { groesse: 18, kursiv: true, farbe: Z.TINTE });
  // Herkunft und Prüfgrenze gehören zum Medium (aus medien.json)
  const hx = x - R - 360, hy = y - 40;
  Z.schrift(ctx, 'KI-erzeugte Audioübersicht', hx, hy, { groesse: 12.5, familie: Z.SCHRIFT_SANS, gewicht: 650, sperrung: 0.6, farbe: Z.tief(farbe, 0.42) });
  Z.absatz(ctx, 'NotebookLM, aus einer quellengeprüften Lehrgrundlage. Der Sprachtext wurde fachlich geprüft: Er verkürzt komplexe PTBS und Dissoziation und formuliert Studiengrenzen teils zu pauschal.', hx, hy + 22, 300, { groesse: 13.5, farbe: Z.TINTE_LEISE });
  Z.schrift(ctx, '1:52 · Untertitel', hx, hy + 128, { groesse: 12, familie: Z.SCHRIFT_SANS, gewicht: 560, farbe: Z.TINTE_LEISE });
  // Namen der Wesen ringsum
  const koerper = [...sichtbar].sort((a, b) => b.ort.grad - a.ort.grad).slice(0, 12).map((w) => { const sx = kamera.sx(w.x), sy = kamera.sy(w.y), r = w.radius * kamera.zoom * 1.2; return [sx - r, sy - r, sx + r, sy + r]; });
  const vorbelegt = [[x - R - 30, y - R - 50, x + R + 30, y + R + 120], [x - 260, y + R + 30, x + 260, y + R + 110], [hx - 10, hy - 20, hx + 320, hy + 140], [20, 20, 420, 90], [B - 300, H - 110, B, H], [B - 90, 20, B, 90], ...koerper];
  const belegt = [...vorbelegt];
  gebietsnameImFeld(kamera, 0, belegt, 15);
  const kand = sichtbar.sort((a, b) => b.ort.grad - a.ort.grad).slice(0, 40).map((w) => ({ text: w.ort.t, x: kamera.sx(w.x), y: kamera.sy(w.y), r: w.radius * kamera.zoom * 1.1 + 2, groesse: 12.5, w }));
  for (const p of Z.platziereNamen(ctx, kand, { vorbelegt: belegt })) Z.schrift(ctx, p.text, p.x, p.y, { groesse: 12.5, ausrichtung: p.ausrichtung, farbe: Z.tief(welt.gebiete[p.w.gebiet].lch, 0.36) });
  bedienung(kamera);
}

// Werte eines Verbunds aus dem Bestand (wie in der Szene): W = Summe der Paarstärken, Deckel = beste Geltung
function verbundWert(orte, feldName = 'staerke') {
  const paare = new Map();
  for (const f of welt.fugen) {
    if (!orte.includes(f.a) || !orte.includes(f.b)) continue;
    const k = `${Math.min(f.a, f.b)}|${Math.max(f.a, f.b)}`;
    if (!paare.has(k)) paare.set(k, []);
    paare.get(k).push(f);
  }
  let W = 0, deckel = 0;
  for (const fs of paare.values()) {
    if (fs.some((f) => f.lesart === LESART.UNTERSCHEIDEND)) continue;
    const s = paarStaerke(fs.map((f) => f[feldName]));
    W += s;
    for (const f of fs) if (f[feldName] > 0) deckel = Math.max(deckel, GELTUNG[f.geltung] || 0);
  }
  return { W, g: zuwachs(W) * deckel, deckel };
}

function tafelKurve() {
  Z.zeichneGrund(ctx, B, H);
  const x0 = 170, y0 = 820, bw = 1000, bh = 560, Wmax = 4;
  const px = (W) => x0 + (W / Wmax) * bw, py = (f) => y0 - (f - 1) * bh;
  Z.schrift(ctx, 'Wie ein gemeinsames Phänomen wächst', 90, 90, { groesse: 30, gewicht: 560 });
  Z.absatz(ctx, 'Fläche des Verbunds = Summe der Einzelflächen × (1 + g). g = Wⁿ / (cⁿ + Wⁿ) mit n = 2 und c = 1,2, begrenzt durch die beste Geltung im Verbund (Studie 1, Originalgraph 0,7, redaktionell 0,35). W ist die Summe der Paarstärken; eine Fuge trägt Art × Geltung × (1 − e^(−Werke/1,5)). Ohne Fuge, bei trennender oder offener Fuge ist W = 0.', 90, 128, 1250, { groesse: 16, farbe: Z.TINTE_LEISE });
  ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.4); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x0, y0 - bh - 20); ctx.lineTo(x0, y0); ctx.lineTo(x0 + bw + 20, y0); ctx.stroke();
  for (const f of [1, 1.25, 1.5, 1.75, 2]) {
    ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.12); ctx.beginPath(); ctx.moveTo(x0, py(f)); ctx.lineTo(x0 + bw, py(f)); ctx.stroke();
    Z.schrift(ctx, `× ${String(f).replace('.', ',')}`, x0 - 14, py(f) + 5, { groesse: 13, ausrichtung: 'right', familie: Z.SCHRIFT_SANS, farbe: Z.TINTE_LEISE });
  }
  for (let W = 0; W <= Wmax; W++) Z.schrift(ctx, String(W), px(W), y0 + 24, { groesse: 13, ausrichtung: 'center', familie: Z.SCHRIFT_SANS, farbe: Z.TINTE_LEISE });
  Z.schrift(ctx, 'W · Summe der getragenen Paarstärken', x0 + bw, y0 + 50, { groesse: 13, ausrichtung: 'right', familie: Z.SCHRIFT_SANS, gewicht: 600, farbe: Z.TINTE_LEISE });
  for (const [deckel, alpha, name] of [[1, 0.9, 'Studienbelege'], [0.7, 0.55, 'Originalgraph'], [0.35, 0.4, 'redaktionell']]) {
    ctx.beginPath();
    for (let k = 0; k <= 200; k++) { const W = (k / 200) * Wmax; const yy = py(1 + zuwachs(W) * deckel); if (k) ctx.lineTo(px(W), yy); else ctx.moveTo(px(W), yy); }
    ctx.strokeStyle = Z.cssLch([0.5, 0.12, 160], alpha); ctx.lineWidth = deckel === 1 ? 2.6 : 1.4; ctx.stroke();
    Z.schrift(ctx, name, px(Wmax) + 10, py(1 + zuwachs(Wmax) * deckel) + 5, { groesse: 13, familie: Z.SCHRIFT_SANS, farbe: Z.TINTE_LEISE });
  }
  // gestrichelt: bloße Summe (ohne Wachstum)
  ctx.setLineDash([4, 5]); ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.5); ctx.beginPath(); ctx.moveTo(px(0), py(1)); ctx.lineTo(px(Wmax), py(1)); ctx.stroke(); ctx.setLineDash([]);
  const punkte = [
    ['Startfall, streng', verbundWert([1031, 1030, 1032, 1034, 561, 1223, 1053, 1194])],
    ['Startfall, Lesebrücke', verbundWert([1031, 1030, 1032, 1034, 561, 1223, 1053, 1194], 'staerkeLesebruecke')],
    ['Genetische Veranlagung · Autistische Merkmale', verbundWert([151, 169])],
    ['Verbund Unterschiedliche Entwicklungswege', verbundWert([158, 151, 169, 194])],
  ];
  punkte.forEach(([name, w], k) => {
    const X = px(w.W), Y = py(1 + w.g);
    ctx.beginPath(); ctx.arc(X, Y, 6, 0, Math.PI * 2); ctx.fillStyle = Z.cssLch([0.45, 0.14, k < 2 ? 2 : 160]); ctx.fill();
    const t = `${name}: W ${w.W.toFixed(2).replace('.', ',')} → × ${(1 + w.g).toFixed(2).replace('.', ',')}`;
    Z.schrift(ctx, t, X + 12, Y - 10 - (k === 0 ? 0 : k === 1 ? 22 : 0), { groesse: 14.5, kursiv: true });
  });
  Z.absatz(ctx, 'Warum diese Form: Anfangs wächst das Gemeinsame überproportional (zwei getragene Verbindungen wirken mehr als doppelt so stark wie eine), dann sättigt es. Kein Phänomen wird mehr als doppelt so groß wie seine Teile, und viele schwache Modellkanten wirken nie wie Studien.', 1250, 640, 310, { groesse: 15 });
}

function tafelUebersicht() {
  return (async () => {
    Z.zeichneGrund(ctx, B, H);
    const teile = [['welt', 'Weltkarte · 1226 Wesen in zehn Gebieten'], ['gebiet', 'Gebiet · Beziehungen & Borderline mit Überlappung und Porträtlichtung'],
      ['begegnung-modus-streng', 'Startfall streng · halten, trennen, vorbeiziehen, nichts mischt sich'], ['begegnung-modus-lesebruecke', 'Startfall als Lesebrücke · schwache neue Mischfarben'],
      ['verstaerkung', 'Belegte Verstärkung · größer als die Summe der Teile'], ['klang', 'Klangquelle · Ringe aus der gemessenen Lautheit']];
    const bw = 500, bh = 312, gx = 30, gy = 120;
    Z.schrift(ctx, 'Lebende Welt · Leinwand', 30, 60, { groesse: 30, gewicht: 560 });
    Z.schrift(ctx, 'Sechs Bilder mit echten Daten, zur Wahl', 32, 90, { groesse: 16, kursiv: true, farbe: Z.TINTE_LEISE });
    for (const [k, [name, text]] of teile.entries()) {
      const b = await ladeBild(`../bilder/entwurf/${name}.png`);
      const x = gx + (k % 3) * (bw + 25), y = gy + Math.floor(k / 3) * (bh + 70);
      ctx.save(); blobPfad(x + bw / 2, y + bh / 2, 1, 0); ctx.restore();
      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 26); ctx.clip();
      if (b) ctx.drawImage(b, x, y, bw, bh);
      ctx.restore();
      Z.schrift(ctx, text, x + 4, y + bh + 26, { groesse: 14.5, kursiv: true });
    }
  })();
}

const tafeln = { kurve: tafelKurve, uebersicht: tafelUebersicht, klang: tafelKlang, gebiet: tafelGebiet, welt: tafelWelt, begegnung: tafelBegegnung, verstaerkung: tafelVerstaerkung };
await (tafeln[TAFEL] || tafelWelt)();
document.body.dataset.fertig = '1';
