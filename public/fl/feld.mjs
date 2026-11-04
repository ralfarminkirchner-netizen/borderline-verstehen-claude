// Das Feld: Gelände aus der Dichte der 1226 Orte, darauf die Fugenorte als eigene Zeichen – keine Kantenwolke.
// Lebendig ist nur, was belegt ist: Die Reifungsschicht entsteht ausschließlich aus gespeicherten Handlungen
// (Ereignisprotokoll) und breitet sich nach einer neuen Handlung sichtbar aus. Herkunft der Idee: Spiralwellenmyzel
// (ChatGPT, Transduktion und Invarianz: lokale Reifung, Ausbreitung, Umbau), Lenia und Reaktions-Diffusion nur als
// Gestaltungsanregung; hier ist es reine Diffusion echter Ereignisse, ohne Wirkbehauptung.
import { ruhig } from './dom.mjs';

const N = 160; // Rasterauflösung der Gelände- und Reifungsschicht

export class Feld {
  constructor(canvas, { orte, regionen, punkte, farben, onOeffnen, onHover }) {
    Object.assign(this, { canvas, orte, regionen, punkte, farben, onOeffnen, onHover });
    this.c = canvas.getContext('2d');
    const xs = orte.map((o) => o.x), ys = orte.map((o) => o.y);
    this.welt = { x0: Math.min(...xs) - 260, x1: Math.max(...xs) + 260, y0: Math.min(...ys) - 260, y1: Math.max(...ys) + 260 };
    this.kam = { x: (this.welt.x0 + this.welt.x1) / 2, y: (this.welt.y0 + this.welt.y1) / 2, z: 0.3 };
    this.sichtbar = new Set(Object.keys(farben));
    this.reife = new Float32Array(N * N); this.reifeZiel = new Float32Array(N * N); this.wellen = 0;
    this.hover = null; this.auswahl = null; this.flug = null;
    this.gelaende = this.#gelaende();
    this.#bedienung();
    new ResizeObserver(() => this.groesse()).observe(canvas);
    this.groesse();
    const schleife = (t) => { this.#schritt(t); requestAnimationFrame(schleife); };
    requestAnimationFrame(schleife);
  }

  groesse() {
    const r = this.canvas.getBoundingClientRect(); const d = Math.min(devicePixelRatio || 1, 2);
    this.w = r.width; this.h = r.height; this.canvas.width = Math.round(r.width * d); this.canvas.height = Math.round(r.height * d); this.d = d;
    if (!this.gestartet) { this.ganz(); this.gestartet = true; }
    this.dirty = true;
  }
  // Überblick: auf breiten Flächen bleibt links Platz für die Legende.
  ganz() { const links = this.w > 900 ? 410 : 0; const unten = this.w > 900 ? 60 : this.h * 0.32; const sx = (this.w - links) / (this.welt.x1 - this.welt.x0), sy = (this.h - unten) / (this.welt.y1 - this.welt.y0); this.kam.z = Math.min(sx, sy) * 0.98; this.kam.x = (this.welt.x0 + this.welt.x1) / 2 - links / 2 / this.kam.z; this.kam.y = (this.welt.y0 + this.welt.y1) / 2 + (unten / 2 - 10) / this.kam.z; this.dirty = true; }
  zuBild(x, y) { return [(x - this.kam.x) * this.kam.z + this.w / 2, (y - this.kam.y) * this.kam.z + this.h / 2]; }
  zuWelt(px, py) { return [(px - this.w / 2) / this.kam.z + this.kam.x, (py - this.h / 2) / this.kam.z + this.kam.y]; }
  zelle(x, y) { const i = Math.floor(((x - this.welt.x0) / (this.welt.x1 - this.welt.x0)) * N), j = Math.floor(((y - this.welt.y0) / (this.welt.y1 - this.welt.y0)) * N); return i >= 0 && j >= 0 && i < N && j < N ? j * N + i : -1; }

  // Gelände: Gauß-Abdruck jedes Orts in der Tönung seines Gebiets, in Terrassen gestuft.
  #gelaende() {
    const dichte = new Float32Array(N * N), farbe = Array.from({ length: N * N }, () => [0, 0, 0, 0]);
    const rgb = this.regionen.map((r) => r.ton.match(/\w\w/g).map((x) => parseInt(x, 16)));
    for (const o of this.orte) {
      const ci = ((o.x - this.welt.x0) / (this.welt.x1 - this.welt.x0)) * N, cj = ((o.y - this.welt.y0) / (this.welt.y1 - this.welt.y0)) * N;
      for (let dj = -6; dj <= 6; dj++) for (let di = -6; di <= 6; di++) {
        const i = Math.round(ci) + di, j = Math.round(cj) + dj; if (i < 0 || j < 0 || i >= N || j >= N) continue;
        const g = Math.exp(-((i - ci) ** 2 + (j - cj) ** 2) / 9); const k = j * N + i; dichte[k] += g;
        const f = farbe[k]; const c = rgb[o.r]; f[0] += c[0] * g; f[1] += c[1] * g; f[2] += c[2] * g; f[3] += g;
      }
    }
    const off = document.createElement('canvas'); off.width = N; off.height = N; const oc = off.getContext('2d'); const img = oc.createImageData(N, N);
    for (let k = 0; k < N * N; k++) {
      const stufe = Math.min(5, Math.floor(Math.log2(1 + dichte[k] * 2.2))); if (!stufe) continue;
      const f = farbe[k]; img.data.set([f[0] / f[3], f[1] / f[3], f[2] / f[3], 40 + stufe * 26], k * 4);
    }
    oc.putImageData(img, 0, 0); this.dichte = dichte; return off;
  }

  // Reifung aus dem Ereignisprotokoll. Neue Ereignisse lösen eine sichtbare Ausbreitung aus.
  ereignisse(liste, neu = false) {
    this.reifeZiel.fill(0); this.zaehler = new Map();
    for (const e of liste) { const k = this.zelle(e.x, e.y); if (k >= 0) this.reifeZiel[k] += 1; this.zaehler.set(e.raum, (this.zaehler.get(e.raum) || 0) + 1); }
    for (let r = 0; r < 6; r++) this.#diffundiere(this.reifeZiel);
    if (!neu || ruhig()) { this.reife.set(this.reifeZiel); this.wellen = 0; } else this.wellen = 40;
    this.letztes = neu ? liste.at(-1) : null; this.wellenStart = performance.now();
    this.#reifeBild(); this.dirty = true;
  }
  #diffundiere(a) {
    const b = new Float32Array(a.length);
    for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) { const k = j * N + i; b[k] = a[k] * 0.5 + (a[k - 1] + a[k + 1] + a[k - N] + a[k + N]) * 0.125; }
    a.set(b);
  }
  #reifeBild() {
    this.reifeOff ??= Object.assign(document.createElement('canvas'), { width: N, height: N });
    const oc = this.reifeOff.getContext('2d'); const img = oc.createImageData(N, N); let max = 0;
    for (const v of this.reife) max = Math.max(max, v);
    for (let k = 0; k < N * N; k++) { const v = this.reife[k]; if (v < 0.004) continue; const t = Math.min(1, Math.sqrt(v / Math.max(max, 0.05))); const ring = (Math.floor(t * 6) % 2) ? 1 : 0.78; img.data.set([196, 112, 40, Math.round(150 * t * ring)], k * 4); }
    oc.putImageData(img, 0, 0);
  }

  fliegeZu(x, y, z, fertig) {
    if (ruhig()) { Object.assign(this.kam, { x, y, z }); this.dirty = true; fertig?.(); return; }
    this.flug = { von: { ...this.kam }, nach: { x, y, z }, t0: performance.now(), dauer: 700, fertig };
  }

  #schritt(t) {
    if (this.flug) {
      const f = this.flug; const u = Math.min(1, (t - f.t0) / f.dauer); const e = u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2;
      this.kam.x = f.von.x + (f.nach.x - f.von.x) * e; this.kam.y = f.von.y + (f.nach.y - f.von.y) * e;
      this.kam.z = Math.exp(Math.log(f.von.z) + (Math.log(f.nach.z) - Math.log(f.von.z)) * e); this.dirty = true;
      if (u >= 1) { this.flug = null; f.fertig?.(); }
    }
    if (this.wellen > 0) { // Ausbreitung: die Reifung wächst von der neuen Handlung aus auf ihren Zielzustand.
      for (let k = 0; k < this.reife.length; k++) this.reife[k] += (this.reifeZiel[k] - this.reife[k]) * 0.12;
      this.wellen--; this.#reifeBild(); this.dirty = true;
    }
    if (this.letztes && t - this.wellenStart < 1600 && !ruhig()) this.dirty = true;
    if (!this.dirty) return; this.dirty = false; this.#zeichne(t);
  }

  #zeichne(t) {
    const c = this.c, { w, h, d, kam } = this;
    c.setTransform(d, 0, 0, d, 0, 0); c.fillStyle = '#efe9dd'; c.fillRect(0, 0, w, h);
    const [gx, gy] = this.zuBild(this.welt.x0, this.welt.y0); const gw = (this.welt.x1 - this.welt.x0) * kam.z, gh = (this.welt.y1 - this.welt.y0) * kam.z;
    c.imageSmoothingEnabled = true; c.drawImage(this.gelaende, gx, gy, gw, gh);
    if (this.reifeOff) { c.globalCompositeOperation = 'multiply'; c.drawImage(this.reifeOff, gx, gy, gw, gh); c.globalCompositeOperation = 'source-over'; }
    // Welle: ein Ring läuft vom Ort der neuesten Handlung aus und vergeht.
    if (this.letztes && !ruhig()) {
      const u = (t - this.wellenStart) / 1600; if (u < 1) { const [x, y] = this.zuBild(this.letztes.x, this.letztes.y); c.strokeStyle = `rgba(180,86,28,${0.6 * (1 - u)})`; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 8 + u * 90, 0, Math.PI * 2); c.stroke(); }
    }
    // Orte als feine Körnung des Geländes.
    c.fillStyle = 'rgba(70,62,52,0.45)'; const pr = Math.max(0.8, Math.min(2.2, kam.z * 3));
    for (const o of this.orte) { const [x, y] = this.zuBild(o.x, o.y); if (x < -5 || y < -5 || x > w + 5 || y > h + 5) continue; c.fillRect(x - pr / 2, y - pr / 2, pr, pr); }
    // Gebietsnamen.
    c.textAlign = 'center'; c.textBaseline = 'middle';
    for (const r of this.regionen) { const [x, y] = this.zuBild(r.x, r.y - r.r * 0.86); if (y < 70) continue; c.font = `600 ${Math.max(11, Math.min(17, 13 * kam.z * 2.4))}px "Iowan Old Style", Georgia, serif`; c.fillStyle = 'rgba(40,34,28,0.78)'; c.fillText(r.name, x, y); }
    // Fugenorte.
    const s = Math.max(5, Math.min(13, 6 + kam.z * 9));
    // Entzerrung im Bildraum: Zeichen weichen einander aus, ein feiner Faden zeigt die wahre Lage. Die Daten bleiben unberührt.
    const vis = [];
    for (const p of this.punkte) { p.bx = undefined; if (!this.sichtbar.has(p.art)) continue; const [x, y] = this.zuBild(p.x, p.y); if (x < -30 || y < -30 || x > w + 30 || y > h + 30) continue; p.tx = x; p.ty = y; p.bx = x; p.by = y; vis.push(p); }
    const abst = s * 1.9;
    for (let it = 0; it < 6; it++) for (let a = 0; a < vis.length; a++) for (let b = a + 1; b < vis.length; b++) {
      const P = vis[a], Q = vis[b]; let dx = Q.bx - P.bx, dy = Q.by - P.by; let dd = Math.hypot(dx, dy);
      if (dd >= abst) continue; if (dd < 0.01) { dx = Math.cos(a * 2.4 + b); dy = Math.sin(a * 2.4 + b); dd = 1; } const k = (abst - dd) / 2 / dd;
      P.bx -= dx * k; P.by -= dy * k; Q.bx += dx * k; Q.by += dy * k;
    }
    for (const p of vis) { const ox = p.bx - p.tx, oy = p.by - p.ty, d = Math.hypot(ox, oy), m = abst * 3; if (d > m) { p.bx = p.tx + (ox / d) * m; p.by = p.ty + (oy / d) * m; } }
    c.strokeStyle = 'rgba(60,52,44,0.35)'; c.lineWidth = 0.8;
    for (const p of vis) if (Math.hypot(p.bx - p.tx, p.by - p.ty) > 4) { c.beginPath(); c.moveTo(p.tx, p.ty); c.lineTo(p.bx, p.by); c.stroke(); c.fillStyle = 'rgba(60,52,44,0.6)'; c.fillRect(p.tx - 1, p.ty - 1, 2, 2); }
    for (const p of vis) this.#zeichen(c, p, p.bx, p.by, s, p === this.hover || p === this.auswahl);
    // Semantischer Zoom: nah heran tragen die Fugenorte ihren Namen.
    if (kam.z > 1.1) { c.font = '600 11px system-ui, sans-serif'; c.textAlign = 'center'; for (const p of vis) { const t = p.titel.length > 34 ? p.titel.slice(0, 32) + '…' : p.titel; c.lineWidth = 3.5; c.strokeStyle = 'rgba(239,233,221,0.95)'; c.strokeText(t, p.bx, p.by + s + 12); c.fillStyle = '#2b251f'; c.fillText(t, p.bx, p.by + s + 12); } }
    const zeig = this.hover || this.auswahl;
    if (zeig && this.sichtbar.has(zeig.art)) this.#schild(c, zeig);
  }

  #zeichen(c, p, x, y, s, an) {
    const f = this.farben[p.art]; c.save(); c.translate(x, y); c.lineWidth = an ? 2.2 : 1.4; c.strokeStyle = f; c.fillStyle = f;
    const reif = Math.min(6, this.zaehler?.get(p.key) || 0);
    if (reif) { c.strokeStyle = 'rgba(180,86,28,0.85)'; c.lineWidth = 1.3; c.beginPath(); for (let a = 0; a <= reif * Math.PI * 2 / 3; a += 0.15) { const r = s * 0.9 + a * 1.4; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); } c.stroke(); c.strokeStyle = f; c.lineWidth = an ? 2.2 : 1.4; }
    const urteil = this.urteile?.get(p.key);
    if (urteil === 'traegtnicht' || urteil === 'giltnicht') c.globalAlpha = 0.42;
    switch (p.art) {
      case 'gegenhalt': // zwei Bruchblöcke mit offenem Spalt
        c.beginPath(); c.moveTo(-s, -s * 0.8); c.lineTo(-s * 0.25, -s * 0.8); c.lineTo(-s * 0.45, -s * 0.1); c.lineTo(-s * 0.2, s * 0.8); c.lineTo(-s, s * 0.8); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(s, -s * 0.8); c.lineTo(s * 0.3, -s * 0.8); c.lineTo(s * 0.12, -s * 0.05); c.lineTo(s * 0.35, s * 0.8); c.lineTo(s, s * 0.8); c.closePath(); c.fill(); break;
      case 'schwelle': { // Tor mit so vielen Riegeln, wie die Schwelle hat
        c.fillRect(-s * 0.8, -s, s * 0.3, s * 2); c.fillRect(s * 0.5, -s, s * 0.3, s * 2);
        const n = Math.min(5, p.n); for (let i = 0; i < n; i++) { const yy = -s * 0.7 + (i * s * 1.4) / Math.max(1, n - 1 || 1); c.fillRect(-s * 0.95, yy - 1, s * 1.9, 2.2); } break; }
      case 'uebersetzung': // zwei Linsen, die sich teilweise decken
        c.globalAlpha = 0.35; c.beginPath(); c.arc(-s * 0.35, 0, s * 0.75, 0, Math.PI * 2); c.fill(); c.beginPath(); c.arc(s * 0.35, 0, s * 0.75, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
        c.beginPath(); c.arc(-s * 0.35, 0, s * 0.75, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.arc(s * 0.35, 0, s * 0.75, 0, Math.PI * 2); c.stroke(); break;
      case 'ueberschneidung': // drei Membranen
        c.globalAlpha = 0.28; for (let k = 0; k < 3; k++) { const a = -Math.PI / 2 + k * 2.094; c.beginPath(); c.arc(Math.cos(a) * s * 0.45, Math.sin(a) * s * 0.45, s * 0.65, 0, Math.PI * 2); c.fill(); } c.globalAlpha = 1;
        c.beginPath(); c.arc(0, 0, 2.2, 0, Math.PI * 2); c.fill(); break;
      case 'entstehung': // mehrere Zuströme laufen in einem Becken zusammen
        c.lineWidth = an ? 2.6 : 2; c.beginPath(); c.moveTo(-s, -s); c.quadraticCurveTo(-s * 0.2, -s * 0.2, 0, s * 0.2); c.moveTo(0, -s * 1.1); c.lineTo(0, s * 0.2); c.moveTo(s, -s); c.quadraticCurveTo(s * 0.2, -s * 0.2, 0, s * 0.2); c.stroke();
        c.beginPath(); c.ellipse(0, s * 0.45, s * 0.6, s * 0.32, 0, 0, Math.PI * 2); c.fill(); break;
      case 'eigen': { // deine Fuge: Station mit so vielen Armen wie Beteiligte, blaue Tinte
        const n = Math.max(2, p.n); c.lineWidth = an ? 2.4 : 1.8; for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k / n) * Math.PI * 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.cos(a) * s, Math.sin(a) * s); c.stroke(); c.beginPath(); c.arc(Math.cos(a) * s, Math.sin(a) * s, 2.4, 0, Math.PI * 2); c.fill(); }
        c.fillStyle = '#efe9dd'; c.beginPath(); c.arc(0, 0, s * 0.32, 0, Math.PI * 2); c.fill(); c.stroke(); break; }
      case 'fehlstelle': // schraffierter Ring, leere Mitte
        c.beginPath(); c.arc(0, 0, s * 0.95, 0, Math.PI * 2); c.stroke(); c.save(); c.beginPath(); c.arc(0, 0, s * 0.95, 0, Math.PI * 2); c.arc(0, 0, s * 0.5, 0, Math.PI * 2, true); c.clip();
        for (let k = -s; k < s; k += 3) { c.beginPath(); c.moveTo(k, -s); c.lineTo(k + s, s); c.stroke(); } c.restore();
        c.fillStyle = '#efe9dd'; c.beginPath(); c.arc(0, 0, s * 0.5, 0, Math.PI * 2); c.fill(); break;
    }
    c.globalAlpha = 1;
    // Zustandsmarke deines Urteils: gefüllt trägt, halb begrenzt, Kreuz trägt nicht, Strich gilt hier nicht, Ring offen, orange gestrichelt erloschen.
    if (urteil) {
      const mx = s * 1.05, my = s * 1.05, r = 5.6;
      c.fillStyle = '#fbf8f2'; c.beginPath(); c.arc(mx, my, r + 2, 0, Math.PI * 2); c.fill();
      c.strokeStyle = urteil === 'erloschen' ? '#b4561c' : '#1d1a16'; c.fillStyle = '#1d1a16'; c.lineWidth = 1.6;
      c.beginPath(); if (urteil === 'erloschen') c.setLineDash([2, 2]); c.arc(mx, my, r, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
      if (urteil === 'traegt') { c.beginPath(); c.arc(mx, my, r, 0, Math.PI * 2); c.fill(); }
      if (urteil === 'begrenzt') { c.beginPath(); c.arc(mx, my, r, Math.PI / 2, Math.PI * 1.5); c.closePath(); c.fill(); }
      if (urteil === 'traegtnicht') { c.beginPath(); c.moveTo(mx - 3.6, my - 3.6); c.lineTo(mx + 3.6, my + 3.6); c.moveTo(mx + 3.6, my - 3.6); c.lineTo(mx - 3.6, my + 3.6); c.stroke(); }
      if (urteil === 'giltnicht') { c.beginPath(); c.moveTo(mx - 3.4, my); c.lineTo(mx + 3.4, my); c.stroke(); }
    }
    c.restore();
  }

  #schild(c, p) {
    const [x, y] = p.bx !== undefined ? [p.bx, p.by] : this.zuBild(p.x, p.y); c.font = '600 13px system-ui, sans-serif'; const t = p.titel.length > 58 ? p.titel.slice(0, 56) + '…' : p.titel; const t2 = p.artName;
    const bw = Math.max(c.measureText(t).width, c.measureText(t2).width) + 20; const bx = Math.min(this.w - bw - 8, Math.max(8, x - bw / 2)); const by = y - 58 < 60 ? y + 18 : y - 58;
    c.fillStyle = 'rgba(251,248,242,0.97)'; c.strokeStyle = '#1d1a16'; c.lineWidth = 1.2; c.beginPath(); c.roundRect(bx, by, bw, 42, 6); c.fill(); c.stroke();
    c.textAlign = 'left'; c.fillStyle = this.farben[p.art]; c.font = '600 11px system-ui, sans-serif'; c.fillText(t2.toUpperCase(), bx + 10, by + 13);
    c.fillStyle = '#1d1a16'; c.font = '600 13px system-ui, sans-serif'; c.fillText(t, bx + 10, by + 29);
  }

  treffer(px, py) {
    let best = null, bd = 18 * 18;
    for (const p of this.punkte) { if (!this.sichtbar.has(p.art) || p.bx === undefined) continue; const dd = (p.bx - px) ** 2 + (p.by - py) ** 2; if (dd < bd) { bd = dd; best = p; } }
    return best;
  }

  #bedienung() {
    const cv = this.canvas; const zeiger = new Map(); let ziehen = null, bewegt = false, pinch = null;
    cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); zeiger.set(e.pointerId, [e.offsetX, e.offsetY]); bewegt = false; ziehen = { x: e.offsetX, y: e.offsetY, kx: this.kam.x, ky: this.kam.y };
      if (zeiger.size === 2) { const [a, b] = [...zeiger.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: this.kam.z }; } });
    cv.addEventListener('pointermove', (e) => {
      if (zeiger.has(e.pointerId)) zeiger.set(e.pointerId, [e.offsetX, e.offsetY]);
      if (pinch && zeiger.size === 2) { const [a, b] = [...zeiger.values()]; this.kam.z = Math.max(0.08, Math.min(6, pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d)); bewegt = true; this.dirty = true; return; }
      if (ziehen && zeiger.size === 1) { const dx = e.offsetX - ziehen.x, dy = e.offsetY - ziehen.y; if (Math.abs(dx) + Math.abs(dy) > 4) bewegt = true; if (bewegt) { this.kam.x = ziehen.kx - dx / this.kam.z; this.kam.y = ziehen.ky - dy / this.kam.z; this.dirty = true; } return; }
      const p = this.treffer(e.offsetX, e.offsetY); if (p !== this.hover) { this.hover = p; cv.style.cursor = p ? 'pointer' : 'grab'; this.dirty = true; this.onHover?.(p); }
    });
    const ende = (e) => { zeiger.delete(e.pointerId); if (zeiger.size < 2) pinch = null;
      if (ziehen && !bewegt && e.type === 'pointerup') { const p = this.treffer(e.offsetX, e.offsetY); if (p) this.onOeffnen(p); }
      if (!zeiger.size) ziehen = null; };
    cv.addEventListener('pointerup', ende); cv.addEventListener('pointercancel', ende);
    cv.addEventListener('pointerleave', () => { if (this.hover) { this.hover = null; this.dirty = true; } });
    cv.addEventListener('wheel', (e) => { e.preventDefault(); const [wx, wy] = this.zuWelt(e.offsetX, e.offsetY); const f = Math.exp(-e.deltaY * 0.0015); this.kam.z = Math.max(0.08, Math.min(6, this.kam.z * f)); const [nx, ny] = this.zuWelt(e.offsetX, e.offsetY); this.kam.x += wx - nx; this.kam.y += wy - ny; this.dirty = true; }, { passive: false });
    cv.addEventListener('keydown', (e) => {
      const st = 60 / this.kam.z; const m = { ArrowLeft: [-st, 0], ArrowRight: [st, 0], ArrowUp: [0, -st], ArrowDown: [0, st] }[e.key];
      if (m) { this.kam.x += m[0]; this.kam.y += m[1]; this.dirty = true; e.preventDefault(); }
      else if (e.key === '+' || e.key === '=') { this.kam.z = Math.min(6, this.kam.z * 1.25); this.dirty = true; }
      else if (e.key === '-') { this.kam.z = Math.max(0.08, this.kam.z / 1.25); this.dirty = true; }
      else if (e.key === '0') this.ganz();
    });
  }
}
