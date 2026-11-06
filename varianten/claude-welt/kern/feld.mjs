// Gebietsfeld: Jedes Gebiet ist eine Dichte aus seinen eigenen Orten (Gaußkerne),
// keine gezeichnete Grenze. Die Membran eines Gebiets ist die Linie, an der seine Dichte
// den Schwellwert TAU erreicht. Wo zwei Dichten über der Schwelle liegen, überlappen sich Gebiete;
// dort wird die Farbe in OKLab gemischt.
import { oklchToOklab, oklabToRgb, mischeOklch } from './farbe.mjs';

export const TAU = 0.26;

// Kernbreite aus mittlerem Ortsabstand des Gebiets (Radius / Wurzel der Ortszahl):
// dünn besiedelte Gebiete bekommen weitere Kerne, damit ihre Membran zusammenhält.
export function sigmaFuer(gebiet) {
  return 30 + 0.9 * gebiet.r / Math.sqrt(Math.max(1, gebiet.zahl || 20));
}

// Weiches Wertrauschen für Pigmentwolken (deterministisch, aus der Lage berechnet).
function rausch(x, y) {
  const h = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return (h(i, j) * (1 - u) + h(i + 1, j) * u) * (1 - v) + (h(i, j + 1) * (1 - u) + h(i + 1, j + 1) * u) * v;
}
export const wolke = (x, y) => 0.55 * rausch(x / 90, y / 90) + 0.3 * rausch(x / 37, y / 37) + 0.15 * rausch(x / 13, y / 13);

export function weltGrenzen(orte, rand = 260) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const o of orte) { x0 = Math.min(x0, o.x); y0 = Math.min(y0, o.y); x1 = Math.max(x1, o.x); y1 = Math.max(y1, o.y); }
  return { x0: x0 - rand, y0: y0 - rand, x1: x1 + rand, y1: y1 + rand };
}

// Berechnet für jedes Gebiet ein Dichteraster über den Weltgrenzen.
export function berechneFeld(welt, { zellen = 360 } = {}) {
  const g = weltGrenzen(welt.orte);
  const breite = g.x1 - g.x0, hoehe = g.y1 - g.y0;
  const zelle = Math.max(breite, hoehe) / zellen;
  const nx = Math.ceil(breite / zelle), ny = Math.ceil(hoehe / zelle);
  const anzahl = welt.gebiete.length;
  const dichte = Array.from({ length: anzahl }, () => new Float32Array(nx * ny));
  const sig = welt.gebiete.map(sigmaFuer);
  for (const o of welt.orte) {
    const s = sig[o.r];
    const reich = Math.ceil((3 * s) / zelle);
    const cx = Math.round((o.x - g.x0) / zelle), cy = Math.round((o.y - g.y0) / zelle);
    const d = dichte[o.r];
    const k = 1 / (2 * s * s);
    for (let j = Math.max(0, cy - reich); j <= Math.min(ny - 1, cy + reich); j++) {
      const wy = g.y0 + j * zelle - o.y;
      for (let i = Math.max(0, cx - reich); i <= Math.min(nx - 1, cx + reich); i++) {
        const wx = g.x0 + i * zelle - o.x;
        d[j * nx + i] += Math.exp(-(wx * wx + wy * wy) * k);
      }
    }
  }
  return { grenzen: g, zelle, nx, ny, dichte, sigma: sig };
}

const glatt = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Färbt das Feld wie Aquarell auf Papier (alles in OKLab gegen den Papierton gerechnet, außerhalb durchsichtig): Pigment je Gebiet, Mischung in OKLab,
// leichte Randverdunkelung an der Membran (wie trocknende Wasserfarbe).
export function faerbeFeld(feld, welt, grund, { staerke = 0.5, rand = 0.13 } = {}) {
  const { nx, ny, dichte, grenzen: gr, zelle } = feld;
  const pixel = new Uint8ClampedArray(nx * ny * 4);
  const grundLab = oklchToOklab(grund);
  // Waschung: Gebietsfarben heller und weniger bunt als die Wesen selbst
  const farben = welt.gebiete.map((x) => [Math.min(0.9, x.lch[0] + 0.06), x.lch[1] * 0.8, x.lch[2]]);
  const anteile = new Array(farben.length);
  for (let p = 0; p < nx * ny; p++) {
    let summe = 0, rest = 1, randwert = 0;
    const wx = gr.x0 + (p % nx) * zelle, wy = gr.y0 + Math.floor(p / nx) * zelle;
    const blüte = 0.72 + 0.56 * wolke(wx, wy);
    for (let k = 0; k < farben.length; k++) {
      const f = dichte[k][p];
      // am Rand eine dünne Lasur, zum dichten Kern hin satter
      const a = (glatt(TAU * 0.99, TAU * 1.04, f) * 0.55 + glatt(TAU, TAU * 6, f) * 0.45) * staerke * blüte;
      anteile[k] = a;
      summe += a;
      rest *= 1 - a;
      randwert = Math.max(randwert, f > TAU ? Math.exp(-(((f - TAU * 1.15) / (TAU * 0.3)) ** 2)) : 0);
    }
    let lab, deckungAlpha = 1;
    if (summe < 1e-4) { lab = grundLab; deckungAlpha = 0; }
    else {
      const misch = oklchToOklab(mischeOklch(farben, anteile));
      const deckung = 1 - rest;
      deckungAlpha = Math.min(1, deckung * 10);
      lab = [0, 1, 2].map((i) => grundLab[i] * (1 - deckung) + misch[i] * deckung);
      // Randverdunkelung: Pigment sammelt sich an der Membran
      lab[0] -= randwert * rand * 0.5 * deckung;
      lab[1] *= 1 + randwert * 0.6;
      lab[2] *= 1 + randwert * 0.6;
    }
    const rgb = oklabToRgb(lab);
    pixel[p * 4] = rgb[0] * 255; pixel[p * 4 + 1] = rgb[1] * 255; pixel[p * 4 + 2] = rgb[2] * 255; pixel[p * 4 + 3] = deckungAlpha * 255;
  }
  return pixel;
}

// Marching Squares: Isolinien eines Rasters als Liste geschlossener/offener Polylinien in Weltkoordinaten.
export function isolinien(feld, werte, schwelle) {
  const { nx, ny, grenzen: g, zelle } = feld;
  const segmente = [];
  const v = (i, j) => werte[j * nx + i];
  const lerp = (a, b, va, vb) => a + ((schwelle - va) / (vb - va || 1e-9)) * (b - a);
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), d = v(i, j + 1);
      const idx = (a > schwelle ? 8 : 0) | (b > schwelle ? 4 : 0) | (c > schwelle ? 2 : 0) | (d > schwelle ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const x = g.x0 + i * zelle, y = g.y0 + j * zelle, z = zelle;
      const oben = [lerp(x, x + z, a, b), y], rechts = [x + z, lerp(y, y + z, b, c)];
      const unten = [lerp(x, x + z, d, c), y + z], links = [x, lerp(y, y + z, a, d)];
      const paare = {
        1: [[links, unten]], 2: [[unten, rechts]], 3: [[links, rechts]], 4: [[oben, rechts]],
        5: [[links, oben], [unten, rechts]], 6: [[oben, unten]], 7: [[links, oben]], 8: [[links, oben]],
        9: [[oben, unten]], 10: [[links, unten], [oben, rechts]], 11: [[oben, rechts]], 12: [[links, rechts]],
        13: [[unten, rechts]], 14: [[links, unten]],
      }[idx];
      for (const s of paare) segmente.push(s);
    }
  }
  return verkette(segmente);
}

function verkette(segmente) {
  const schl = (p) => `${Math.round(p[0] * 10)},${Math.round(p[1] * 10)}`;
  const anfang = new Map();
  segmente.forEach((s, i) => {
    for (const p of s) { const k = schl(p); if (!anfang.has(k)) anfang.set(k, []); anfang.get(k).push(i); }
  });
  const benutzt = new Uint8Array(segmente.length);
  const linien = [];
  for (let i = 0; i < segmente.length; i++) {
    if (benutzt[i]) continue;
    benutzt[i] = 1;
    const linie = [segmente[i][0], segmente[i][1]];
    for (const richtung of [1, -1]) {
      for (;;) {
        const ende = richtung === 1 ? linie[linie.length - 1] : linie[0];
        const kand = (anfang.get(schl(ende)) || []).find((k) => !benutzt[k]);
        if (kand === undefined) break;
        benutzt[kand] = 1;
        const s = segmente[kand];
        const naechster = schl(s[0]) === schl(ende) ? s[1] : s[0];
        if (richtung === 1) linie.push(naechster); else linie.unshift(naechster);
      }
    }
    if (linie.length > 4) linien.push(linie);
  }
  return linien;
}

// Chaikin-Glättung für weiche Membranen.
export function glaette(linie, runden = 2) {
  let p = linie;
  for (let r = 0; r < runden; r++) {
    const q = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [a, b] = [p[i], p[i + 1]];
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  return p;
}

// Gesamtdichte für Höhenlinien (Gelände der Dichte).
export function gesamtDichte(feld) {
  const n = feld.nx * feld.ny;
  const s = new Float32Array(n);
  for (const d of feld.dichte) for (let i = 0; i < n; i++) s[i] += d[i];
  return s;
}

// Wert eines Gebietsfeldes an einem Weltpunkt (bilinear).
export function dichteAn(feld, k, x, y) {
  const { grenzen: g, zelle, nx, ny } = feld;
  const fx = (x - g.x0) / zelle, fy = (y - g.y0) / zelle;
  const i = Math.floor(fx), j = Math.floor(fy);
  if (i < 0 || j < 0 || i >= nx - 1 || j >= ny - 1) return 0;
  const tx = fx - i, ty = fy - j, d = feld.dichte[k];
  return (d[j * nx + i] * (1 - tx) + d[j * nx + i + 1] * tx) * (1 - ty) + (d[(j + 1) * nx + i] * (1 - tx) + d[(j + 1) * nx + i + 1] * tx) * ty;
}
