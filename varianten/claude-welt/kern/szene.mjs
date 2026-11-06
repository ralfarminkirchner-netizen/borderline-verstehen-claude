// Nahe Szene: mehrere Wesen im Augenblick ihrer Begegnung (Bildschirmkoordinaten).
// Alle Zustände kommen aus dem Bestand: welche Fugen es gibt, ihre Lesart, ihr Mischgewicht und ihre Stärke.
// Vorgabe nicht streng: jede verbindende Fuge mischt, gewachsen wird nur über Belege.
import * as Z from './zeichner.mjs';
import { LESART, paarStaerke, zuwachs, GELTUNG } from './begegnung.mjs';
import { mischeOklch } from './farbe.mjs';

export const radiusPx = (grad, s = 1) => (11 + 7 * Math.log2(1 + grad)) * s;
const koerperFarbe = (lch) => [lch[0] - 0.05, Math.min(0.2, lch[1] * 1.45), lch[2]];

// glieder: [{ i, x, y }]; modus: 'nah' (Vorgabe) | 'streng' (nur Werkstatt)
export function zeichneSzene(ctx, welt, glieder, { modus = 'nah', massstab = 1.7, t = 0, wachsen = 1, vorbei = null, fokus = null, beschrift = {} } = {}) {
  const O = welt.orte;
  const idx = new Map(glieder.map((g, k) => [g.i, k]));
  const farbe = (i) => Z.eigenfarbe(welt.gebiete[O[i].r].lch, O[i].k);
  const feld = modus === 'streng' ? 'staerke' : 'staerkeLesebruecke';
  const mischFeld = modus === 'streng' ? 'staerke' : 'misch';

  // Paare innerhalb der Szene, mit allen Fugen
  const paare = new Map();
  for (const f of welt.fugen) {
    if (!idx.has(f.a) || !idx.has(f.b)) continue;
    const k = `${Math.min(f.a, f.b)}|${Math.max(f.a, f.b)}`;
    if (!paare.has(k)) paare.set(k, { a: Math.min(f.a, f.b), b: Math.max(f.a, f.b), fugen: [] });
    paare.get(k).fugen.push(f);
  }
  for (const p of paare.values()) {
    p.trennend = p.fugen.some((f) => f.lesart === LESART.UNTERSCHEIDEND);
    p.staerke = p.trennend ? 0 : paarStaerke(p.fugen.map((f) => f[feld]));      // trägt Wachstum
    p.misch = p.trennend ? 0 : paarStaerke(p.fugen.map((f) => f[mischFeld]));   // lässt Farben ineinanderlaufen
    p.haupt = [...p.fugen].sort((x, y) => (y[mischFeld] - x[mischFeld]) || (y.quellen.length - x.quellen.length))[0];
  }

  // Verbünde: Zusammenhangskomponenten über mischende Paare
  const gruppe = glieder.map((_, k) => k);
  const wurzel = (k) => (gruppe[k] === k ? k : (gruppe[k] = wurzel(gruppe[k])));
  for (const p of paare.values()) if (p.misch > 0) gruppe[wurzel(idx.get(p.a))] = wurzel(idx.get(p.b));
  const verbund = new Map();
  glieder.forEach((g, k) => { const w = wurzel(k); if (!verbund.has(w)) verbund.set(w, []); verbund.get(w).push(k); });

  // Wachstum je Verbund (Fläche × (1 + g)), Deckel = höchste Geltung der tragenden Fugen
  const wachstum = new Map();
  for (const [w, ks] of verbund) {
    const ps = [...paare.values()].filter((p) => p.staerke > 0 && ks.includes(idx.get(p.a)));
    const W = ps.reduce((s, p) => s + p.staerke, 0);
    const deckel = Math.max(0, ...ps.flatMap((p) => p.fugen.filter((f) => f[feld] > 0).map((f) => GELTUNG[f.geltung] || 0)));
    wachstum.set(w, { W, g: zuwachs(W) * deckel, ps });
  }

  const r0 = glieder.map((g) => radiusPx(O[g.i].grad, massstab));
  const armMass = massstab;
  const rr = glieder.map((g, k) => r0[k] * Math.sqrt(1 + wachstum.get(wurzel(k)).g * wachsen));

  // 1 · Hof jedes Verbunds in seiner Mischfarbe (OKLab, nach Fläche gewichtet)
  for (const [w, ks] of verbund) {
    const { g } = wachstum.get(w);
    const misch = mischeOklch(ks.map((k) => farbe(glieder[k].i)), ks.map((k) => rr[k] ** 2));
    const cx = ks.reduce((s, k) => s + glieder[k].x * rr[k] ** 2, 0) / ks.reduce((s, k) => s + rr[k] ** 2, 0);
    const cy = ks.reduce((s, k) => s + glieder[k].y * rr[k] ** 2, 0) / ks.reduce((s, k) => s + rr[k] ** 2, 0);
    const weite = Math.max(...ks.map((k) => Math.hypot(glieder[k].x - cx, glieder[k].y - cy) + rr[k])) * (1.25 + g * 0.9);
    const hof = ctx.createRadialGradient(cx, cy, 0, cx, cy, weite);
    hof.addColorStop(0, Z.cssLch(Z.hell(misch, 0.9), ks.length > 1 ? 0.75 : 0.5));
    hof.addColorStop(0.6, Z.cssLch(Z.hell(misch, 0.93), ks.length > 1 ? 0.35 : 0.2));
    hof.addColorStop(1, Z.cssLch(Z.hell(misch, 0.96), 0));
    ctx.fillStyle = hof;
    ctx.beginPath(); ctx.arc(cx, cy, weite, 0, Math.PI * 2); ctx.fill();
    if (ks.length > 1 && g > 0.02) {
      // äußere Membran des gemeinsamen Phänomens
      ctx.save();
      ctx.strokeStyle = Z.cssLch(Z.tief(misch, 0.55), 0.35);
      ctx.lineWidth = 1.2;
      ctx.setLineDash([]);
      ctx.beginPath();
      for (let a = 0; a <= 64; a++) {
        const th = (a / 64) * Math.PI * 2;
        const rad = weite * 0.78 * (1 + 0.025 * Math.sin(th * 5 + t));
        const px = cx + Math.cos(th) * rad, py = cy + Math.sin(th) * rad;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  // 2 · Arme aller Wesen zu Partnern außerhalb der Szene (Richtung zum Heimatort des Partners)
  for (const [k, g] of glieder.entries()) {
    const fs = welt.fugen.filter((f) => (f.a === g.i || f.b === g.i) && !(idx.has(f.a) && idx.has(f.b)));
    const w = { x: 0, y: 0, hx: O[g.i].x, hy: O[g.i].y, radius: r0[k], phase: (O[g.i].x * 0.0131 + O[g.i].y * 0.0173) % 6.28 };
    for (const f of fs.slice(0, 14)) {
      const j = f.a === g.i ? f.b : f.a;
      const arm = Z.armGeometrie({ ...w, x: O[g.i].x, y: O[g.i].y }, { ...f, staerke: f[feld] }, { hx: O[j].x, hy: O[j].y }, t, 0, 1.25);
      // in Bildschirmkoordinaten um das Glied
      const kam = { sx: (x) => g.x + (x - O[g.i].x), sy: (y) => g.y + (y - O[g.i].y) };
      Z.zeichneArm(ctx, kam, arm, { ...f, staerke: Math.max(0.25, f[feld]) }, Z.tief(farbe(g.i), 0.55), { alpha: 0.7, dicke: 1.1 });
    }
  }

  // 3 · Offene Fragen ohne Mischung: Arme greifen ineinander, Lücke bleibt
  for (const p of paare.values()) {
    if (p.misch > 0 || p.trennend) continue;
    const A = glieder[idx.get(p.a)], B = glieder[idx.get(p.b)];
    const ra = rr[idx.get(p.a)], rb = rr[idx.get(p.b)];
    const ang = Math.atan2(B.y - A.y, B.x - A.x);
    const mx = (A.x + Math.cos(ang) * ra + B.x - Math.cos(ang) * rb) / 2, my = (A.y + Math.sin(ang) * ra + B.y - Math.sin(ang) * rb) / 2;
    const offen = p.haupt.lesart === LESART.OFFEN;
    for (const [P, rP, sgn, i] of [[A, ra, 1, p.a], [B, rb, -1, p.b]]) {
      const sx = P.x + Math.cos(ang) * rP * sgn, sy = P.y + Math.sin(ang) * rP * sgn;
      const ex = mx - Math.cos(ang) * 5 * sgn, ey = my - Math.sin(ang) * 5 * sgn;
      const quer = Math.hypot(ex - sx, ey - sy) * 0.12 * sgn;
      ctx.save();
      ctx.strokeStyle = Z.cssLch(Z.tief(farbe(i), 0.5), 0.75);
      ctx.lineWidth = 1.5;
      if (offen) ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo((sx + ex) / 2 - Math.sin(ang) * quer, (sy + ey) / 2 + Math.cos(ang) * quer, ex, ey);
      ctx.stroke();
      // Haken: kleiner Bogen am Ende
      ctx.beginPath();
      ctx.arc(ex, ey, 3.2, ang + (sgn > 0 ? -Math.PI / 2 : Math.PI / 2), ang + (sgn > 0 ? Math.PI / 2 : Math.PI * 1.5));
      ctx.stroke();
      ctx.restore();
    }
    p.mitte = [mx, my, ang];
  }

  // 4 · Körper: Verbünde pixelgenau in OKLab, trennende Paare als Wand
  const gl = glieder.map((g, k) => ({ x: g.x, y: g.y, r: rr[k], lch: koerperFarbe(farbe(g.i)), gruppe: wurzel(k) }));
  // sichtbare Brücke: Wurzel des Mischgewichts, damit auch unbelegte Verbindungen als Hals lesbar sind
  const br = [...paare.values()].filter((p) => p.misch > 0).map((p) => ({ a: idx.get(p.a), b: idx.get(p.b), staerke: Math.min(1, Math.sqrt(p.misch)) }));
  Z.zeichneVerbund(ctx, gl, br);
  // Adern: helle Ströme entlang tragender Brücken, so dick wie ihre Stärke
  for (const b of br) {
    const A = gl[b.a], Bq = gl[b.b];
    ctx.save();
    ctx.lineCap = 'round';
    const verlauf = ctx.createLinearGradient(A.x, A.y, Bq.x, Bq.y);
    verlauf.addColorStop(0, Z.cssLch(Z.hell(A.lch, 0.95), 0.0));
    verlauf.addColorStop(0.5, Z.cssLch(Z.hell(mischeOklch([A.lch, Bq.lch]), 0.96), 0.75));
    verlauf.addColorStop(1, Z.cssLch(Z.hell(Bq.lch, 0.95), 0.0));
    ctx.strokeStyle = verlauf;
    ctx.lineWidth = 1 + 3.2 * b.staerke;
    ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(Bq.x, Bq.y); ctx.stroke();
    ctx.restore();
  }

  // Geisterumriss: Größe der Teile vor der Begegnung (nur wo gewachsen)
  glieder.forEach((g, k) => {
    if (rr[k] - r0[k] < 1.5) return;
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = Z.cssLch(Z.TINTE_LEISE, 0.45);
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(g.x, g.y, r0[k], 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  });
  // Körnung: so viele Körner wie das Wesen Fugen im Bestand hat (höchstens 24), auf einer Sonnenblumenspirale
  glieder.forEach((g, k) => {
    const n = Math.min(24, O[g.i].grad);
    const tiefe = Z.tief(farbe(g.i), 0.5);
    for (let m = 0; m < n; m++) {
      const rad = rr[k] * 0.78 * Math.sqrt((m + 0.5) / n);
      const th = m * 2.39996 + t * 0.05;
      ctx.fillStyle = Z.cssLch(tiefe, 0.42);
      ctx.beginPath(); ctx.arc(g.x + Math.cos(th) * rad, g.y + Math.sin(th) * rad, 1.3 + rr[k] * 0.018, 0, Math.PI * 2); ctx.fill();
    }
  });
  // Kerne
  glieder.forEach((g, k) => {
    ctx.fillStyle = Z.cssLch([0.985, 0.02, farbe(g.i)[2]], 0.9);
    ctx.beginPath(); ctx.arc(g.x - rr[k] * 0.22, g.y - rr[k] * 0.26, rr[k] * 0.2, 0, Math.PI * 2); ctx.fill();
  });


  return { paare, verbund, wachstum, rr, r0, idx, farbe, wurzel };
}

export function beschrifte(ctx, welt, glieder, info, { namen = {}, fugen = [] } = {}) {
  const O = welt.orte;
  glieder.forEach((g, k) => {
    const n = namen[g.i] || {};
    const r = info.rr[k];
    const dx = n.dx ?? r + 9, dy = n.dy ?? 5;
    Z.schrift(ctx, O[g.i].t, g.x + dx, g.y + dy, { groesse: n.groesse || 15, gewicht: n.gewicht || 520,
      ausrichtung: n.ausrichtung || 'left', farbe: Z.tief(welt.gebiete[O[g.i].r].lch, 0.36) });
  });
  for (const f of fugen) {
    const p = [...info.paare.values()].find((q) => (q.a === Math.min(f.a, f.b) && q.b === Math.max(f.a, f.b)));
    if (!p) continue;
    const A = glieder[info.idx.get(p.a)], B = glieder[info.idx.get(p.b)];
    const text = f.text || p.haupt.sicht?.label || p.haupt.label;
    const off = f.versatz ?? -10;
    const pts = [];
    const ang = Math.atan2(B.y - A.y, B.x - A.x);
    const nx = -Math.sin(ang), ny = Math.cos(ang);
    for (let s = 0; s <= 20; s++) {
      const u = s / 20;
      const bog = Math.sin(u * Math.PI) * (f.bogen ?? 10);
      pts.push([A.x + (B.x - A.x) * u + nx * (off + bog), A.y + (B.y - A.y) * u + ny * (off + bog)]);
    }
    Z.textAufKurve(ctx, text, pts, { groesse: f.groesse || 13, farbe: Z.TINTE_LEISE, kursiv: true });
  }
}
