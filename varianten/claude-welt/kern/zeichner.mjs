// Zeichner der Lebenden Welt (Canvas 2D).
// Grundsatz: heller, warmer Lichtgrund; Farbe nur aus Gebieten und Wesen; Schrift dunkel auf hell.
import { cssLch, oklchToRgb, css, mischeOklch, oklchToOklab, oklabToRgb } from './farbe.mjs';
import { LESART } from './begegnung.mjs';

export const GRUND = [0.968, 0.012, 82];        // warmes Papier
export const GRUND_HELL = [0.985, 0.008, 85];   // Lichthof
export const TINTE = [0.3, 0.025, 60];          // Schrift, warmes Fast-Schwarz
export const TINTE_LEISE = [0.46, 0.02, 60];

export const SCHRIFT_SERIF = '"Newsreader", "Iowan Old Style", Georgia, serif';
export const SCHRIFT_SANS = '"Manrope", "Avenir Next", system-ui, sans-serif';

// Tiefe Fassung einer Gebietsfarbe für Kerne und Schrift (Kontrast auf dem Papier ≥ 4,5:1 bei L ≤ 0,50).
export const tief = (lch, L = 0.47) => [L, Math.min(0.19, lch[1] * 1.55), lch[2]];
export const hell = (lch, L = 0.88) => [L, lch[1] * 0.7, lch[2]];

// Eigenfarbe eines Wesens: Gebietston, leicht verschoben nach Art des Orts (aus dem Bestand: Feld k).
// Versatz [ΔL, Faktor Buntheit, ΔFarbton] — sichtbar, aber in der Familie des Gebiets.
const ARTVERSATZ = { phenomenon: [0, 1, 0], concept: [0.02, 0.9, 14], method: [0.0, 0.95, -16], model: [0.03, 0.85, 32],
  source: [0.05, 0.55, 0], chapter: [0.04, 0.65, -6], exercise: [0.0, 1.0, -28], context: [0.03, 0.85, 22],
  perspective: [0.02, 0.9, -22], practice: [0.0, 1.0, -34], finding: [0.03, 0.8, 40] };
export function eigenfarbe(gebietLch, art) {
  const [dL, fC, dh] = ARTVERSATZ[art] || [0.02, 0.8, 0];
  return [gebietLch[0] + dL, gebietLch[1] * fC, (gebietLch[2] + dh + 360) % 360];
}

export class Kamera {
  constructor(cx, cy, zoom, w, h) { Object.assign(this, { cx, cy, zoom, w, h }); }
  sx(x) { return (x - this.cx) * this.zoom + this.w / 2; }
  sy(y) { return (y - this.cy) * this.zoom + this.h / 2; }
  wx(sx) { return (sx - this.w / 2) / this.zoom + this.cx; }
  wy(sy) { return (sy - this.h / 2) / this.zoom + this.cy; }
  sichtbar(x, y, rand = 40) { const a = this.sx(x), b = this.sy(y); return a > -rand && b > -rand && a < this.w + rand && b < this.h + rand; }
}

// ——— Grund ———
let kornMuster = null;
function korn(ctx) {
  if (kornMuster) return kornMuster;
  const c = new OffscreenCanvas(256, 256), g = c.getContext('2d');
  const d = g.createImageData(256, 256);
  let s = 7;
  const zufall = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < d.data.length; i += 4) {
    const v = 128 + (zufall() - 0.5) * 70;
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 10;
  }
  g.putImageData(d, 0, 0);
  kornMuster = ctx.createPattern(c, 'repeat');
  return kornMuster;
}

export function zeichneGrund(ctx, w, h) {
  ctx.fillStyle = cssLch(GRUND);
  ctx.fillRect(0, 0, w, h);
  const r = Math.hypot(w, h) * 0.6;
  const g = ctx.createRadialGradient(w * 0.48, h * 0.42, 0, w * 0.48, h * 0.42, r);
  g.addColorStop(0, cssLch(GRUND_HELL, 0.9));
  g.addColorStop(1, cssLch([0.93, 0.018, 75], 0.0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
}

export function zeichneKorn(ctx, w, h) {
  ctx.save();
  ctx.fillStyle = korn(ctx);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// ——— Feld ———
export function feldBild(feld, pixel) {
  const c = new OffscreenCanvas(feld.nx, feld.ny);
  c.getContext('2d').putImageData(new ImageData(pixel, feld.nx, feld.ny), 0, 0);
  return c;
}

export function zeichneFeld(ctx, kamera, feld, bild, alpha = 1) {
  const g = feld.grenzen;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bild, kamera.sx(g.x0), kamera.sy(g.y0), feld.nx * feld.zelle * kamera.zoom, feld.ny * feld.zelle * kamera.zoom);
  ctx.restore();
}

function pfad(ctx, kamera, linie, versatz) {
  ctx.beginPath();
  linie.forEach((p, i) => {
    const [x, y] = versatz ? versatz(p, i) : p;
    if (i === 0) ctx.moveTo(kamera.sx(x), kamera.sy(y)); else ctx.lineTo(kamera.sx(x), kamera.sy(y));
  });
}

export function zeichneHoehenlinien(ctx, kamera, linienJeStufe) {
  ctx.save();
  ctx.lineJoin = 'round';
  linienJeStufe.forEach(({ linien, stufe }, k) => {
    ctx.strokeStyle = cssLch([0.5, 0.03, 70], 0.07 + k * 0.012);
    ctx.lineWidth = 0.7;
    for (const l of linien) { pfad(ctx, kamera, l); ctx.stroke(); }
  });
  ctx.restore();
}

// Membranen: doppelte, atmende Linie in der tiefen Gebietsfarbe.
export function zeichneMembranen(ctx, kamera, membranen, welt, t = 0, ruhe = 0) {
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  for (const { gebiet, linien } of membranen) {
    const lch = welt.gebiete[gebiet].lch;
    const atem = (1 - ruhe) * 2.2;
    for (const l of linien) {
      const versatz = (p, i) => {
        const w = Math.sin(i * 0.21 + t * 0.7 + gebiet) * atem + Math.sin(i * 0.053 - t * 0.4) * atem;
        return [p[0] + w, p[1] + w * 0.6];
      };
      pfad(ctx, kamera, l, versatz);
      ctx.strokeStyle = cssLch(tief(lch, 0.55), 0.38);
      ctx.lineWidth = 1.25;
      ctx.stroke();
      ctx.strokeStyle = cssLch(hell(lch, 0.95), 0.7);
      ctx.lineWidth = 3.5;
      ctx.globalCompositeOperation = 'source-over';
    }
  }
  ctx.restore();
}

// ——— Schrift in der Welt ———
export function schrift(ctx, text, x, y, { groesse = 14, farbe = TINTE, alpha = 1, gewicht = 450, kursiv = false,
  familie = SCHRIFT_SERIF, ausrichtung = 'left', hof = true, sperrung = 0, grundlinie = 'alphabetic' } = {}) {
  ctx.save();
  ctx.font = `${kursiv ? 'italic ' : ''}${gewicht} ${groesse}px ${familie}`;
  ctx.textAlign = ausrichtung;
  ctx.textBaseline = grundlinie;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${sperrung}px`;
  if (hof) {
    ctx.lineJoin = 'round';
    ctx.strokeStyle = cssLch(GRUND_HELL, 0.82 * alpha);
    ctx.lineWidth = Math.max(3, groesse * 0.32);
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = cssLch(farbe, alpha);
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function umbreche(ctx, text, breite, font) {
  ctx.save();
  ctx.font = font;
  const woerter = text.split(/\s+/);
  const zeilen = [];
  let z = '';
  for (const w of woerter) {
    const probe = z ? `${z} ${w}` : w;
    if (ctx.measureText(probe).width > breite && z) { zeilen.push(z); z = w; } else z = probe;
  }
  if (z) zeilen.push(z);
  ctx.restore();
  return zeilen;
}

// Text entlang einer Kurve (Bezeichnung einer Fuge auf ihrer Brücke).
export function textAufKurve(ctx, text, punkte, { groesse = 12, farbe = TINTE_LEISE, kursiv = true, alpha = 1, versatz = 0,
  familie = SCHRIFT_SERIF, gewicht = 450, sperrung = 0 } = {}) {
  ctx.save();
  ctx.font = `${kursiv ? 'italic ' : ''}${gewicht} ${groesse}px ${familie}`;
  const laengen = [0];
  for (let i = 1; i < punkte.length; i++) laengen.push(laengen[i - 1] + Math.hypot(punkte[i][0] - punkte[i - 1][0], punkte[i][1] - punkte[i - 1][1]));
  const gesamt = laengen[laengen.length - 1];
  const textBreite = ctx.measureText(text).width + sperrung * text.length;
  let s = Math.max(0, (gesamt - textBreite) / 2);
  // Leserichtung von links nach rechts
  if (punkte[0][0] > punkte[punkte.length - 1][0]) { punkte = [...punkte].reverse(); }
  const anStelle = (d) => {
    let i = 1; while (i < laengen.length - 1 && laengen[i] < d) i++;
    const t = (d - laengen[i - 1]) / (laengen[i] - laengen[i - 1] || 1);
    const [a, b] = [punkte[i - 1], punkte[i]];
    return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, w: Math.atan2(b[1] - a[1], b[0] - a[0]) };
  };
  for (const ch of text) {
    const cw = ctx.measureText(ch).width + sperrung;
    const p = anStelle(s + cw / 2);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.w);
    ctx.translate(0, versatz);
    ctx.lineJoin = 'round';
    ctx.strokeStyle = cssLch(GRUND_HELL, 0.85 * alpha);
    ctx.lineWidth = 3.2;
    ctx.textAlign = 'center';
    ctx.strokeText(ch, 0, 0);
    ctx.fillStyle = cssLch(farbe, alpha);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
    s += cw;
  }
  ctx.restore();
}

// ——— Wesen ———
// Arm einer Fuge: Richtung zum Heimatort des Gegenübers, Form nach Lesart.
export function armGeometrie(w, f, partner, t, ruhe, laengeFaktor = 1) {
  const winkel = Math.atan2(partner.hy - w.hy, partner.hx - w.hx);
  const basis = w.radius;
  let laenge;
  if (f.lesart === LESART.VERBINDEND) laenge = basis * (1.6 + 4.2 * f.staerke);
  else if (f.lesart === LESART.OFFEN) laenge = basis * 1.9;
  else laenge = basis * 1.7;
  laenge *= laengeFaktor;
  const wiegen = Math.sin(t * 0.8 + w.phase + winkel * 3) * 0.22 * (1 - ruhe);
  const p0 = [w.x + Math.cos(winkel) * basis * 0.7, w.y + Math.sin(winkel) * basis * 0.7];
  const p2 = [w.x + Math.cos(winkel + wiegen) * laenge, w.y + Math.sin(winkel + wiegen) * laenge];
  const mitte = [(p0[0] + p2[0]) / 2, (p0[1] + p2[1]) / 2];
  const quer = laenge * 0.18 * Math.sin(w.phase * 2 + winkel);
  const p1 = [mitte[0] - Math.sin(winkel) * quer, mitte[1] + Math.cos(winkel) * quer];
  return { p0, p1, p2, winkel: winkel + wiegen, laenge };
}

const bez = (a, b, c, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1]];

export function zeichneArm(ctx, kamera, arm, f, farbe, { alpha = 1, perlen = true, dicke = 1 } = {}) {
  const { p0, p1, p2 } = arm;
  const S = (p) => [kamera.sx(p[0]), kamera.sy(p[1])];
  const [a, b, c] = [S(p0), S(p1), S(p2)];
  ctx.save();
  ctx.lineCap = 'round';
  if (f.lesart === LESART.OFFEN) {
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = cssLch(farbe, 0.55 * alpha);
    ctx.lineWidth = 1 * dicke;
    ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(...b, ...c); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.arc(c[0], c[1], 2.6 * dicke, 0, Math.PI * 2);
    ctx.lineWidth = 0.9 * dicke; ctx.stroke();
  } else if (f.lesart === LESART.UNTERSCHEIDEND) {
    ctx.strokeStyle = cssLch(farbe, 0.7 * alpha);
    ctx.lineWidth = 1.1 * dicke;
    ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo(...b, ...c); ctx.stroke();
    const w = arm.winkel + Math.PI / 2, l = 4.2 * dicke;
    ctx.lineWidth = 1.6 * dicke;
    ctx.beginPath(); ctx.moveTo(c[0] + Math.cos(w) * l, c[1] + Math.sin(w) * l); ctx.lineTo(c[0] - Math.cos(w) * l, c[1] - Math.sin(w) * l); ctx.stroke();
  } else {
    // verbindend: sich verjüngende Faser, getragene Fugen mit Perlen (Belegstellen)
    const n = 14;
    for (let i = 0; i < n; i++) {
      const q0 = bez(a, b, c, i / n), q1 = bez(a, b, c, (i + 1) / n);
      ctx.strokeStyle = cssLch(farbe, (0.75 - (i / n) * 0.45) * alpha);
      ctx.lineWidth = (0.6 + (1 - i / n) * 1.3) * dicke * (0.6 + f.staerke);
      ctx.beginPath(); ctx.moveTo(...q0); ctx.lineTo(...q1); ctx.stroke();
    }
    if (perlen) {
      const zahl = Math.min(4, f.quellen.length);
      for (let k = 0; k < zahl; k++) {
        const p = bez(a, b, c, 0.45 + k * 0.14);
        ctx.fillStyle = cssLch(farbe, 0.85 * alpha);
        ctx.beginPath(); ctx.arc(p[0], p[1], 1.5 * dicke, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  ctx.restore();
}

export function zeichneKoerper(ctx, kamera, w, farbe, { alpha = 1, glanz = 1, groesse = 1 } = {}) {
  const x = kamera.sx(w.x), y = kamera.sy(w.y);
  const r = Math.max(1.4, w.radius * kamera.zoom * (w.atem || 1) * groesse);
  ctx.save();
  // Lichthof
  const hof = ctx.createRadialGradient(x, y, 0, x, y, r * 3.4);
  hof.addColorStop(0, cssLch(hell(farbe, 0.9), 0.55 * alpha * glanz));
  hof.addColorStop(1, cssLch(hell(farbe, 0.95), 0));
  ctx.fillStyle = hof;
  ctx.beginPath(); ctx.arc(x, y, r * 3.4, 0, Math.PI * 2); ctx.fill();
  // Membran des Körpers, leicht unregelmäßig
  ctx.beginPath();
  const n = 18;
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2;
    const rr = r * (1 + 0.07 * Math.sin(a * 3 + w.phase) + 0.05 * Math.sin(a * 5 - w.phase * 2));
    const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
    if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  const fuell = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  fuell.addColorStop(0, cssLch([Math.min(0.92, farbe[0] + 0.12), farbe[1] * 0.8, farbe[2]], alpha));
  fuell.addColorStop(1, cssLch(tief(farbe, 0.56), alpha));
  ctx.fillStyle = fuell;
  ctx.fill();
  ctx.strokeStyle = cssLch(tief(farbe, 0.42), 0.6 * alpha);
  ctx.lineWidth = 0.8;
  ctx.stroke();
  // Kern
  ctx.fillStyle = cssLch([0.98, 0.02, farbe[2]], 0.85 * alpha);
  ctx.beginPath(); ctx.arc(x - r * 0.22, y - r * 0.25, Math.max(0.6, r * 0.22), 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  return { x, y, r };
}

// Schwarmpunkt für den weiten Blick.
export function zeichnePunkt(ctx, kamera, w, farbe, alpha = 1) {
  const x = kamera.sx(w.x), y = kamera.sy(w.y);
  const r = Math.max(1.1, Math.min(3.6, 0.9 + Math.sqrt(w.ort.grad) * 0.42)) * (w.atem || 1);
  ctx.fillStyle = cssLch(hell(farbe, 0.86), 0.35 * alpha);
  ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = cssLch(tief(farbe, 0.5), 0.9 * alpha);
  ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}

// Namen ohne Überdeckung: gierig nach Wichtigkeit platzieren.
export function platziereNamen(ctx, kandidaten, { groesse = 13, vorbelegt = [] } = {}) {
  const belegt = [...vorbelegt];
  const ergebnis = [];
  ctx.save();
  for (const k of kandidaten) {
    ctx.font = `${k.gewicht || 450} ${k.groesse || groesse}px ${SCHRIFT_SERIF}`;
    const b = ctx.measureText(k.text).width, h = (k.groesse || groesse) * 1.25;
    const optionen = [[k.x + k.r + 5, k.y + h * 0.32, 'left'], [k.x - k.r - 5, k.y + h * 0.32, 'right'],
      [k.x, k.y - k.r - 6, 'center'], [k.x, k.y + k.r + h * 0.95, 'center']];
    for (const [x, y, a] of optionen) {
      const x0 = a === 'left' ? x : a === 'right' ? x - b : x - b / 2;
      const box = [x0 - 2, y - h * 0.85, x0 + b + 2, y + h * 0.2];
      if (belegt.some((q) => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]))) continue;
      belegt.push(box);
      ergebnis.push({ ...k, x, y, ausrichtung: a });
      break;
    }
  }
  ctx.restore();
  return ergebnis;
}

// Ortsnamen in der lebenden Welt: mit Luft zwischen den Namen, nicht über fremden Körpern,
// möglichst wenige fremde Körper zugedeckt (wo sie dicht stehen, einige), lange Namen in höchstens drei Zeilen, und ruhig von Bild zu Bild (wer eben stand, bleibt, wo er stand).
// kandidaten: [{ text, x, y, r, groesse, gewicht, w }] nach Vorrang sortiert; w.i ist der Ort. Wer keinen Platz findet,
// macht dem Nächsten Platz, bis hoechstens Namen stehen.
// hindernisse: [{ x, y, r, i }] Körper auf dem Schirm; erlaubt(box, kandidat): darf hier ein Name liegen?
// vorher: Map Ort → Lage aus dem letzten Bild (wird hier fortgeschrieben).
export function platziereOrtsnamen(ctx, kandidaten, { vorbelegt = [], hindernisse = [], erlaubt = () => true, vorher = new Map(),
  luft = 8, mindestAbstand = 56, breiteMax = 230, zeilenMax = 3, koerperMax = 2, hoechstens = Infinity, schirm = { w: Infinity, h: Infinity } } = {}) {
  const belegt = [...vorbelegt];
  const ergebnis = [];
  const naechste = new Map();
  // Körper in ein Raster, damit jede Probe nur ihre Nachbarschaft ansieht
  const Z = 48, raster = new Map();
  for (const h of hindernisse) {
    for (let gx = Math.floor((h.x - h.r) / Z); gx <= Math.floor((h.x + h.r) / Z); gx++)
      for (let gy = Math.floor((h.y - h.r) / Z); gy <= Math.floor((h.y + h.r) / Z); gy++) {
        const s = `${gx},${gy}`; if (!raster.has(s)) raster.set(s, []); raster.get(s).push(h);
      }
  }
  // Wie viele fremde Körper deckt ein Name zu? (kern: welcher Teil des Körpers zählt)
  const zugedeckt = (box, eigen, kern) => {
    const gesehen = new Set();
    for (let gx = Math.floor(box[0] / Z); gx <= Math.floor(box[2] / Z); gx++)
      for (let gy = Math.floor(box[1] / Z); gy <= Math.floor(box[3] / Z); gy++) {
        for (const h of raster.get(`${gx},${gy}`) || []) {
          if (h.i === eigen || gesehen.has(h)) continue;
          const qx = Math.max(box[0], Math.min(h.x, box[2])), qy = Math.max(box[1], Math.min(h.y, box[3]));
          if (Math.hypot(qx - h.x, qy - h.y) < h.r * kern + 1) gesehen.add(h);
        }
      }
    return gesehen.size;
  };
  // Wie dicht stehen Körper um einen Punkt? (Körper je Quadratpixel im Umkreis R)
  const dichteUm = (x, y, R = 90) => {
    let n = 0;
    for (let gx = Math.floor((x - R) / Z); gx <= Math.floor((x + R) / Z); gx++)
      for (let gy = Math.floor((y - R) / Z); gy <= Math.floor((y + R) / Z); gy++)
        for (const h of raster.get(`${gx},${gy}`) || []) if (Math.hypot(h.x - x, h.y - y) < R) n++;
    return n / (Math.PI * R * R); // Körper, die in mehreren Zellen stehen, zählen mehrfach; das schadet nicht, es macht nur nachsichtiger
  };
  const schneidet = (box) => belegt.some((q) => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]));
  const anker = [];
  ctx.save();
  // Wer im letzten Bild stand, kommt zuerst dran und darf etwas näher rücken: so flackert nichts,
  // wenn die Wesen sich bewegen. Neue Namen füllen danach nur, was frei geblieben ist.
  // Ausnahme: Kandidaten mit vorrang (der Startort) stehen immer vorn, auch wenn sie eben erst ins Bild kommen.
  const reihe = [...kandidaten.filter((k) => k.vorrang),
    ...kandidaten.filter((k) => !k.vorrang && vorher.has(k.w.i)), ...kandidaten.filter((k) => !k.vorrang && !vorher.has(k.w.i))];
  for (const k of reihe) {
    if (ergebnis.length >= hoechstens) break;
    const blieb = vorher.has(k.w.i) || k.vorrang;
    if (anker.some(([ax, ay]) => Math.hypot(ax - k.x, ay - k.y) < mindestAbstand * (blieb ? 0.7 : 1))) continue;
    const gr = k.groesse || 13;
    const font = `${k.gewicht || 450} ${gr}px ${SCHRIFT_SERIF}`;
    ctx.font = font;
    const zeilen = ctx.measureText(k.text).width > breiteMax ? umbreche(ctx, k.text, breiteMax, font) : [k.text];
    if (zeilen.length > zeilenMax) continue; // was nicht in drei Zeilen passt, erscheint erst beim Hinwenden
    ctx.font = font;
    const b = Math.max(...zeilen.map((z) => ctx.measureText(z).width));
    const zh = gr * 1.22, hoehe = zh * (zeilen.length - 1) + gr;
    const d = k.r + 5;
    // Lagen als Grundlinie der ersten Zeile und Ausrichtung: rechts, links, oben, unten, dann schräg
    const mitteY = k.y - hoehe / 2 + gr * 0.8;
    const ueber = (hoehe - gr) + 2;
    const lagen = {
      rechts: [k.x + d, mitteY, 'left'], links: [k.x - d, mitteY, 'right'],
      oben: [k.x, k.y - d - ueber, 'center'], unten: [k.x, k.y + d + gr * 0.85, 'center'],
      obenrechts: [k.x + d * 0.7, k.y - d * 0.7 - ueber, 'left'], untenrechts: [k.x + d * 0.7, k.y + d * 0.7 + gr * 0.85, 'left'],
      obenlinks: [k.x - d * 0.7, k.y - d * 0.7 - ueber, 'right'], untenlinks: [k.x - d * 0.7, k.y + d * 0.7 + gr * 0.85, 'right'],
    };
    const war = vorher.get(k.w.i);
    const folge = war ? [war, ...Object.keys(lagen).filter((n) => n !== war)] : Object.keys(lagen);
    // Die frühere Lage, solange sie geht; sonst von den freien Lagen die, die am wenigsten Körper zudeckt
    // Wo die Körper dicht stehen, darf ein Name einige zudecken (sonst stünde dort keiner); Luft zwischen Namen bleibt.
    const duldung = Math.max(koerperMax, Math.floor(dichteUm(k.x, k.y) * (b + 4) * (hoehe + gr * 0.3) * 0.45));
    let beste = null;
    for (const name of folge) {
      const [x, y, a] = lagen[name];
      const x0 = a === 'left' ? x : a === 'right' ? x - b : x - b / 2;
      const box = [x0 - 2, y - gr * 0.85, x0 + b + 2, y - gr * 0.85 + hoehe + gr * 0.3];
      const l = blieb && name === war ? luft * 0.8 : luft;
      const mitLuft = [box[0] - l, box[1] - l * 0.9, box[2] + l, box[3] + l * 0.9];
      if (schneidet(mitLuft)) continue;
      if (!erlaubt(box, k)) continue;
      // wer eben schon stand, duldet etwas mehr, damit Namen nicht springen, wenn ein Körper vorbeizieht
      const n = zugedeckt(box, k.w.i, 0.7) - (name === war ? 0.5 : 0);
      if (!k.vorrang && n > duldung + (name === war ? 2 : 0)) continue;
      if (!beste || n < beste.n) beste = { n, name, x, y, a, box };
      if (n <= 0 || name === war) break; // die alte Lage genügt: bleiben, auch wenn eine andere eine Spur freier wäre
    }
    // Der Vorrang-Name (Startort) bleibt nie weg: notfalls in den Schirm geschoben und ohne Luft, zuletzt einfach darüber
    if (!beste && k.vorrang) {
      for (const name of ['rechts', 'links', 'oben', 'unten', 'obenrechts', 'obenlinks', 'untenrechts', 'untenlinks']) {
        const [x, y, a] = lagen[name];
        const x0 = a === 'left' ? x : a === 'right' ? x - b : x - b / 2;
        const schub = Math.min(0, schirm.w - 10 - (x0 + b + 2)) + Math.max(0, 10 - (x0 - 2));
        const box = [x0 - 2 + schub, y - gr * 0.85, x0 + b + 2 + schub, y - gr * 0.85 + hoehe + gr * 0.3];
        if (box[1] < 10 || box[3] > schirm.h - 10 || schneidet(box)) continue;
        beste = { name, x: x + schub, y, a, box };
        break;
      }
      if (!beste) { const [x, y, a] = lagen.oben; const x0 = x - b / 2; beste = { name: 'oben', x, y, a, box: [x0 - 2, y - gr * 0.85, x0 + b + 2, y - gr * 0.85 + hoehe + gr * 0.3] }; }
    }
    if (!beste) continue;
    belegt.push(beste.box);
    anker.push([k.x, k.y]);
    naechste.set(k.w.i, beste.name);
    ergebnis.push({ ...k, x: beste.x, y: beste.y, ausrichtung: beste.a, zeilen, zeilenhoehe: zh, box: beste.box });
  }
  ctx.restore();
  vorher.clear();
  for (const [i, n] of naechste) vorher.set(i, n);
  return ergebnis;
}

// ——— Begegnung: gemeinsamer Körper, pixelgenau in OKLab gemischt ———
// glieder: [{x,y,r,lch,gruppe}] in Bildschirmkoordinaten; brücken: [{a,b,staerke}] (Indizes in glieder)
// gruppe: Glieder derselben Gruppe verschmelzen; verschiedene Gruppen bleiben getrennt (inkommensurabel)
export function zeichneVerbund(ctx, glieder, bruecken, { schwelle = 1, weich = 0.25, alpha = 1 } = {}) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const g of glieder) { x0 = Math.min(x0, g.x - g.r * 3); y0 = Math.min(y0, g.y - g.r * 3); x1 = Math.max(x1, g.x + g.r * 3); y1 = Math.max(y1, g.y + g.r * 3); }
  x0 = Math.floor(x0); y0 = Math.floor(y0);
  const bw = Math.ceil(x1 - x0), bh = Math.ceil(y1 - y0);
  const bild = ctx.createImageData(bw, bh);
  const labs = glieder.map((g) => oklchToOklab(g.lch));
  const gruppen = [...new Set(glieder.map((g) => g.gruppe))];
  const segFeld = (px, py, a, b, s) => {
    const ax = glieder[a].x, ay = glieder[a].y, bx = glieder[b].x, by = glieder[b].y;
    const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
    const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2));
    const qx = ax + vx * t - px, qy = ay + vy * t - py;
    const dicke = Math.min(glieder[a].r, glieder[b].r) * (0.1 + 0.55 * s);
    return (dicke * dicke) / (qx * qx + qy * qy + 1);
  };
  for (let j = 0; j < bh; j++) {
    for (let i = 0; i < bw; i++) {
      const px = x0 + i, py = y0 + j;
      const beitrag = new Array(glieder.length);
      const gruppeSumme = {};
      for (let k = 0; k < glieder.length; k++) {
        const g = glieder[k];
        const d2 = (px - g.x) ** 2 + (py - g.y) ** 2;
        beitrag[k] = (g.r * g.r) / (d2 + 1);
        gruppeSumme[g.gruppe] = (gruppeSumme[g.gruppe] || 0) + beitrag[k];
      }
      for (const br of bruecken) {
        const v = segFeld(px, py, br.a, br.b, br.staerke);
        beitrag[br.a] += v * 0.5; beitrag[br.b] += v * 0.5;
        gruppeSumme[glieder[br.a].gruppe] += v;
      }
      // stärkste Gruppe bestimmt das Pixel; Gruppen mischen sich nicht
      let best = gruppen[0], bestWert = -1, zweit = 0;
      for (const gr of gruppen) {
        const v = gruppeSumme[gr] || 0;
        if (v > bestWert) { zweit = bestWert; bestWert = v; best = gr; } else if (v > zweit) zweit = v;
      }
      const a = Math.min(1, Math.max(0, (bestWert - schwelle * (1 - weich)) / (schwelle * weich * 2)));
      if (a <= 0) continue;
      let L = 0, A = 0, B = 0, W = 0;
      for (let k = 0; k < glieder.length; k++) {
        if (glieder[k].gruppe !== best) continue;
        const w = beitrag[k] ** 2;
        L += labs[k][0] * w; A += labs[k][1] * w; B += labs[k][2] * w; W += w;
      }
      L /= W; A /= W; B /= W;
      // Tiefe zur Mitte: der Körper leuchtet innen heller
      const innen = Math.min(1, bestWert / (schwelle * 4));
      L = L + innen * 0.06;
      // Wand zwischen Gruppen: hell und fein
      const wand = zweit > schwelle * 0.55 ? Math.exp(-(((bestWert - zweit) / (schwelle * 0.18)) ** 2)) : 0;
      L = L + wand * (0.97 - L);
      A *= 1 - wand; B *= 1 - wand;
      // Rand leicht dunkler (Membran)
      const rand = Math.exp(-(((bestWert - schwelle) / (schwelle * 0.12)) ** 2));
      L -= rand * 0.13;
      const rgb = oklabToRgb([L, A, B]);
      const o = (j * bw + i) * 4;
      bild.data[o] = rgb[0] * 255; bild.data[o + 1] = rgb[1] * 255; bild.data[o + 2] = rgb[2] * 255;
      bild.data[o + 3] = a * 255 * alpha;
    }
  }
  const c = new OffscreenCanvas(bw, bh);
  c.getContext('2d').putImageData(bild, 0, 0);
  ctx.drawImage(c, x0, y0);
}

export function mischfarbe(farben, gewichte) { return mischeOklch(farben, gewichte); }
export { cssLch, css, oklchToRgb };

// Gebietsname auf einem flachen Bogen über (oder unter) seiner Membran, wie auf alten Karten.
// Der Bogen ist ein Kreisausschnitt um den Schwerpunkt der Membran mit Mindestradius, damit kleine
// Gebiete keine eingerollte Schrift bekommen. Kollidiert der obere Platz, wird der untere genommen.
export function gebietsnameAmRand(ctx, kamera, name, linien, farbe, { groesse = 13, sperrung = 2.4, abstand = 10, belegt = [], frei = () => true } = {}) {
  if (!linien.length) return null;
  const linie = linien.reduce((a, b) => (b.length > a.length ? b : a));
  const pts = linie.map((p) => [kamera.sx(p[0]), kamera.sy(p[1])]);
  const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
  let y0 = Infinity, y1 = -Infinity;
  for (const p of pts) { if (Math.abs(p[0] - cx) < 60) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); } }
  ctx.save();
  ctx.font = `620 ${groesse}px ${SCHRIFT_SANS}`;
  const breite = ctx.measureText(name).width + sperrung * name.length;
  ctx.restore();
  const R = Math.max(420, breite * 1.1);
  let xl = Infinity, xr = -Infinity, cy = 0;
  for (const p of pts) { xl = Math.min(xl, p[0]); xr = Math.max(xr, p[0]); cy += p[1]; }
  cy /= pts.length;
  const bildW = ctx.canvas.width / (window.devicePixelRatio > 1 ? Math.min(2, window.devicePixelRatio) : 1), bildH = ctx.canvas.height / (window.devicePixelRatio > 1 ? Math.min(2, window.devicePixelRatio) : 1);
  const ueberschneidet = (box) => box[0] < 8 || box[1] < 8 || box[2] > bildW - 8 || box[3] > bildH - 8 || belegt.some((q) => !(box[2] < q[0] || box[0] > q[2] || box[3] < q[1] || box[1] > q[3]));
  const boxFrei = (box) => { for (let i = 0; i <= 6; i++) for (const yy of [box[1] + 3, box[3] - 3]) if (!frei(box[0] + ((box[2] - box[0]) * i) / 6, yy)) return false; return true; };
  const versuche = [[true, y0 - abstand], [false, y1 + abstand + groesse]];
  for (const [oben, yRand] of versuche) {
    const box = [cx - breite / 2 - 6, yRand - groesse - (oben ? 0 : 6), cx + breite / 2 + 6, yRand + (oben ? 8 : 4)];
    if (box[1] < 6 || ueberschneidet(box) || !boxFrei(box)) continue;
    const bogen = [];
    const halb = (breite * 0.62) / R;
    for (let k = -20; k <= 20; k++) {
      const a = (k / 20) * halb;
      const x = cx + Math.sin(a) * R;
      const y = oben ? yRand + (1 - Math.cos(a)) * R : yRand - (1 - Math.cos(a)) * R;
      bogen.push([x, y]);
    }
    textAufKurve(ctx, name, bogen, { groesse, farbe, kursiv: false, familie: SCHRIFT_SANS, gewicht: 620, sperrung });
    belegt.push(box);
    return box;
  }
  // seitlich, gerade gesetzt
  for (const seite of ['links', 'rechts']) {
    const x = seite === 'links' ? xl - abstand : xr + abstand;
    const box = seite === 'links' ? [x - breite - 4, cy - groesse, x + 4, cy + 6] : [x - 4, cy - groesse, x + breite + 4, cy + 6];
    if (ueberschneidet(box) || !boxFrei(box)) continue;
    schrift(ctx, name, x, cy, { groesse, farbe, familie: SCHRIFT_SANS, gewicht: 620, sperrung, ausrichtung: seite === 'links' ? 'right' : 'left' });
    belegt.push(box);
    return box;
  }
  // zuletzt: über die eigene Fläche, mit Papierhof (ein Name fehlt nie)
  const mx = Math.min(bildW - breite / 2 - 12, Math.max(breite / 2 + 12, cx)), my = Math.min(bildH - 20, Math.max(30, cy));
  for (const dy of [0, -groesse * 1.6, groesse * 1.6, -groesse * 3.2, groesse * 3.2, -groesse * 6, groesse * 6, -groesse * 9, groesse * 9]) {
    const box = [mx - breite / 2 - 4, my + dy - groesse, mx + breite / 2 + 4, my + dy + 6];
    if (ueberschneidet(box)) continue;
    schrift(ctx, name, mx, my + dy, { groesse, farbe, familie: SCHRIFT_SANS, gewicht: 620, sperrung, ausrichtung: 'center' });
    belegt.push(box);
    return box;
  }
  return null;
}

// Sichtbarer Quellentitel ohne Register- oder Prüfkennungen (Manifest „Menschliche Oberflächen“).
export function quellTitel(q) {
  const t = String(q.titel || '').replace(/\s*\b\d{3}-\d{3}\b;?/g, '').replace(/\s{2,}/g, ' ').trim();
  const autoren = Array.isArray(q.autoren) ? q.autoren : q.autoren ? [q.autoren] : [];
  const wer = autoren.length ? `${autoren[0].split(' ').slice(-1)[0]}${autoren.length > 1 ? ' u. a.' : ''}` : '';
  return { titel: t, wer, jahr: q.jahr ? String(q.jahr) : '' };
}

// Die vier Zähne der Schloss-Regel (Lesart, Beleg, Grenze, Wort) als kleiner Bogen aus Samen.
export function zeichneZaehne(ctx, x, y, winkel, z, { farbe = TINTE_LEISE, groesse = 1 } = {}) {
  const namen = ['lesart', 'beleg', 'grenze', 'wort'];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(winkel);
  namen.forEach((n, k) => {
    const a = (k - 1.5) * 0.42;
    const px = Math.sin(a) * 15 * groesse, py = -Math.cos(a) * 15 * groesse + 15 * groesse - 11 * groesse;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, 0, 2.2 * groesse, 3.6 * groesse, 0, 0, Math.PI * 2);
    if (z[n].greift) { ctx.fillStyle = cssLch(farbe, 0.9); ctx.fill(); }
    else { ctx.fillStyle = cssLch(GRUND_HELL, 0.9); ctx.fill(); ctx.strokeStyle = cssLch(farbe, 0.7); ctx.lineWidth = 0.9; ctx.stroke(); }
    ctx.restore();
  });
  ctx.restore();
}

// Quellstein: Mandel mit so vielen Punkten wie Belegen.
export function zeichneQuellstein(ctx, x, y, zahl, farbe) {
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, 9, 5.5, -0.35, 0, Math.PI * 2);
  ctx.fillStyle = cssLch([0.985, 0.01, farbe[2]], 0.96);
  ctx.fill();
  ctx.strokeStyle = cssLch(tief(farbe, 0.45), 0.75);
  ctx.lineWidth = 1;
  ctx.stroke();
  for (let k = 0; k < Math.min(4, zahl); k++) {
    ctx.beginPath();
    ctx.arc(x - (Math.min(4, zahl) - 1) * 2.4 + k * 4.8, y + 0.5 - (k - (Math.min(4, zahl) - 1) / 2) * 0.8, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = cssLch(tief(farbe, 0.42), 0.95);
    ctx.fill();
  }
  ctx.restore();
}

// Absatz in der Welt (kein Kasten): Zeilen mit Papierhof.
export function absatz(ctx, text, x, y, breite, { groesse = 15, zeilenabstand = 1.42, kursiv = false, farbe = TINTE, gewicht = 430, alpha = 1, ausrichtung = 'left' } = {}) {
  const font = `${kursiv ? 'italic ' : ''}${gewicht} ${groesse}px ${SCHRIFT_SERIF}`;
  const zeilen = umbreche(ctx, text, breite, font);
  zeilen.forEach((z, i) => schrift(ctx, z, x, y + i * groesse * zeilenabstand, { groesse, kursiv, farbe, gewicht, alpha, ausrichtung }));
  return y + zeilen.length * groesse * zeilenabstand;
}
