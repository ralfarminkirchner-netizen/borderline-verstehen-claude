// Die Karte: ein zusammenhängender, verschiebbarer und zoombarer Raum.
// Semantischer Zoom: Gebiete → Orte → Fugen eines Ortes. Flüge sind jederzeit unterbrechbar.
import { fugenPfad, strich, fugenArt, ARTEN } from './fugen.mjs';

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export class Karte {
  constructor({ el, overlay, gelaende, daten, regionen }) {
    this.el = el; this.cv = overlay; this.ctx = overlay.getContext('2d');
    this.gel = gelaende; this.d = daten; this.reg = regionen;
    this.cam = { x: 0, y: 0 }; this.zoom = 0.3; this.w = 1; this.h = 1;
    this.sel = null; this.hover = null; this.fugeSel = null;
    this.linse = 'gebiete'; this.ruhig = false; this.inset = { r: 0, b: 0 };
    this.getragen = []; this.energie = null; this.eigene = [];
    this.flug = null; this.dirty = true; this.zeiger = null;
    this.adj = daten.orte.map(() => []);
    daten.fugen.forEach((f, i) => { this.adj[f.a].push(i); this.adj[f.b].push(i); });
    // Perspektiven: je Ort die vorherrschende Fugenart und die stärkste Herkunft seiner Verbindungen.
    this.ortArt = daten.orte.map((_, i) => {
      const n = {}; for (const fi of this.adj[i]) { const a = fugenArt(daten.fugen[fi]); if (a !== 'einordnung') n[a] = (n[a] || 0) + 1; }
      return Object.entries(n).sort((p, q) => q[1] - p[1])[0]?.[0] || null;
    });
    this.ortHerkunft = daten.orte.map((_, i) => {
      const g = new Set(this.adj[i].map((fi) => daten.fugen[fi].geltung));
      return g.has('quelle') ? 'quelle' : g.has('redaktionell') ? 'redaktionell' : g.has('offen') ? 'offen' : g.size ? 'original' : null;
    });
    this.#bounds(); this.#input();
    new ResizeObserver(() => this.groesse()).observe(el);
    this.groesse();
    const loop = () => { this.#tick(); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  #bounds() {
    let x0 = Infinity; let y0 = Infinity; let x1 = -Infinity; let y1 = -Infinity;
    for (const o of this.d.orte) { x0 = Math.min(x0, o.x); y0 = Math.min(y0, o.y); x1 = Math.max(x1, o.x); y1 = Math.max(y1, o.y); }
    const pad = 220; this.bounds = { x0: x0 - pad, y0: y0 - pad, x1: x1 + pad, y1: y1 + pad };
  }

  groesse() {
    const r = this.el.getBoundingClientRect(); this.w = r.width; this.h = r.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.cv.width = Math.round(this.w * dpr); this.cv.height = Math.round(this.h * dpr); this.dpr = dpr;
    if (!this.started) { this.ueberblick(true); this.started = true; }
    this.dirty = true;
  }

  // Sichtbarer Bereich ohne die vom Blatt verdeckte Fläche.
  frei() { return { w: Math.max(120, this.w - this.inset.r), h: Math.max(120, this.h - this.inset.b) }; }
  zielKamera(x, y) {
    // Kamera so setzen, dass (x,y) in der Mitte des freien Bereichs liegt.
    const f = this.frei();
    return { x: x + (this.w / 2 - f.w / 2) / this.zoomZiel, y: y + (this.h / 2 - f.h / 2) / this.zoomZiel };
  }

  ueberblick(sofort) {
    // Der Überblick lässt Platz für Kopf und Einstiegskarte (sichere Fläche), damit kein Gebiet darunter liegt.
    const b = this.bounds; const f = this.frei();
    const karte = document.querySelector('#willkommen:not([hidden])')?.getBoundingClientRect();
    const unten = karte && f.w < 760 ? karte.height + 16 : 0; const oben = 56;
    const h = Math.max(160, f.h - unten - oben);
    const z = Math.min(f.w / (b.x1 - b.x0), h / (b.y1 - b.y0)) * 1.02;
    this.zoomZiel = z;
    const mitteY = (b.y0 + b.y1) / 2 + ((unten - oben) / 2) / z;
    this.fliege((b.x0 + b.x1) / 2, mitteY, z, sofort);
  }

  fliege(x, y, z, sofort) {
    this.zoomZiel = z; const c = this.zielKamera(x, y);
    if (sofort || this.ruhig) { this.cam = c; this.zoom = z; this.flug = null; this.dirty = true; this.onBewegt?.(); return; }
    const from = { ...this.cam, z: this.zoom };
    const dist = Math.hypot(c.x - from.x, c.y - from.y) * Math.min(from.z, z);
    const dur = Math.min(1600, 520 + dist * 0.7);
    // Bei weiten Wegen erst etwas heraus, dann hinein (wie ein Flug über die Karte).
    const peak = dist > this.w * 0.9 ? Math.min(from.z, z) * 0.55 : null;
    this.flug = { from, to: { ...c, z }, t0: performance.now(), dur, peak };
    this.onFlug?.(true);
  }

  stoppeFlug() { if (this.flug) { this.flug = null; this.onFlug?.(false); } }
  ueberspringeFlug() { if (this.flug) { const t = this.flug.to; this.cam = { x: t.x, y: t.y }; this.zoom = t.z; this.flug = null; this.onFlug?.(false); this.dirty = true; } }

  zuOrt(i, z) {
    const o = this.d.orte[i];
    this.fliege(o.x, o.y, z || Math.max(this.zoom, 1.25));
  }
  zuGebiet(r) {
    const g = this.reg[r]; const f = this.frei();
    this.fliege(g.x, g.y, Math.min(2.2, Math.min(f.w, f.h) / (g.r * 2.3)));
  }

  welt(px, py) { return { x: this.cam.x + (px - this.w / 2) / this.zoom, y: this.cam.y + (py - this.h / 2) / this.zoom }; }
  schirm(x, y) { return { x: (x - this.cam.x) * this.zoom + this.w / 2, y: (y - this.cam.y) * this.zoom + this.h / 2 }; }

  treffer(px, py, radius = 14) {
    const w = this.welt(px, py); let best = null; let bd = (radius / this.zoom) ** 2;
    this.d.orte.forEach((o, i) => { const d = (o.x - w.x) ** 2 + (o.y - w.y) ** 2; if (d < bd && this.#sichtbar(i)) { bd = d; best = i; } });
    return best;
  }

  fugeTreffer(px, py) {
    if (this.sel === null) return null;
    const w = this.welt(px, py); let best = null; let bd = (10 / this.zoom);
    for (const fi of this.adj[this.sel]) {
      const f = this.d.fugen[fi]; if (f.art === 'einordnung' && this.zoom < 1.4) continue;
      const a = this.d.orte[f.a]; const b = this.d.orte[f.b];
      const dx = b.x - a.x; const dy = b.y - a.y; const L2 = dx * dx + dy * dy || 1;
      const t = Math.max(0.1, Math.min(0.9, ((w.x - a.x) * dx + (w.y - a.y) * dy) / L2));
      const d = Math.hypot(a.x + dx * t - w.x, a.y + dy * t - w.y);
      if (d < bd) { bd = d; best = fi; }
    }
    return best;
  }

  #sichtbar(i) {
    if (this.linse === 'eigen') return this.eigene.some((g) => g.teile.some((t) => t.ort === i)) || i === this.sel;
    return true;
  }

  #input() {
    const el = this.el; const ptrs = new Map(); let drag = null; let pinch = null; let moved = 0;
    el.addEventListener('pointerdown', (e) => {
      if (e.target !== this.cv) return;
      this.stoppeFlug(); el.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = 0;
      if (ptrs.size === 1) drag = { x: e.clientX, y: e.clientY, cam: { ...this.cam } };
      if (ptrs.size === 2) { const [p, q] = [...ptrs.values()]; pinch = { d: Math.hypot(p.x - q.x, p.y - q.y), z: this.zoom }; drag = null; }
    });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect(); const px = e.clientX - r.left; const py = e.clientY - r.top;
      this.zeiger = { x: px, y: py };
      this.gel.light = [(px / this.w - 0.5) * 1.4, (0.5 - py / this.h) * 1.4];
      if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch && ptrs.size === 2) {
        const [p, q] = [...ptrs.values()]; const d = Math.hypot(p.x - q.x, p.y - q.y);
        const mid = { x: (p.x + q.x) / 2 - r.left, y: (p.y + q.y) / 2 - r.top };
        this.#zoomUm(mid.x, mid.y, (pinch.z * d / pinch.d) / this.zoom); moved += 10; return;
      }
      if (drag) {
        const dx = e.clientX - drag.x; const dy = e.clientY - drag.y; moved = Math.max(moved, Math.hypot(dx, dy));
        if (moved > 4) { this.cam = { x: drag.cam.x - dx / this.zoom, y: drag.cam.y - dy / this.zoom }; this.dirty = true; this.onBewegt?.(); }
        return;
      }
      const h = this.treffer(px, py);
      if (h !== this.hover) { this.hover = h; this.dirty = true; this.onHover?.(h, px, py); }
      else if (h !== null) this.onHover?.(h, px, py);
      if (this.getragen.length) this.dirty = true;
      el.style.cursor = h !== null ? 'pointer' : (this.getragen.length ? 'none' : 'grab');
    });
    const up = (e) => {
      const wasTap = moved <= 4 && !pinch && ptrs.size === 1;
      ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) drag = null;
      if (!wasTap || e.type === 'pointercancel') return;
      const r = el.getBoundingClientRect(); const px = e.clientX - r.left; const py = e.clientY - r.top;
      const i = this.treffer(px, py, e.pointerType === 'touch' ? 24 : 14);
      if (i !== null) return this.onTap?.(i);
      const fi = this.fugeTreffer(px, py);
      if (fi !== null) return this.onFuge?.(fi);
      this.onLeer?.(this.welt(px, py));
    };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    el.addEventListener('pointerleave', () => { this.zeiger = null; if (this.hover !== null) { this.hover = null; this.onHover?.(null); this.dirty = true; } });
    el.addEventListener('wheel', (e) => {
      e.preventDefault(); this.stoppeFlug();
      const r = el.getBoundingClientRect();
      const k = Math.exp(-e.deltaY * (e.ctrlKey ? 0.012 : 0.0016));
      this.#zoomUm(e.clientX - r.left, e.clientY - r.top, k);
    }, { passive: false });
  }

  #zoomUm(px, py, k) {
    const before = this.welt(px, py);
    this.zoom = Math.max(0.08, Math.min(6, this.zoom * k));
    const after = this.welt(px, py);
    this.cam.x += before.x - after.x; this.cam.y += before.y - after.y; this.dirty = true; this.onBewegt?.();
  }
  zoomSchritt(k) { this.stoppeFlug(); this.#zoomUm(this.frei().w / 2, this.frei().h / 2, k); }
  verschiebe(dx, dy) { this.stoppeFlug(); this.cam.x += dx / this.zoom; this.cam.y += dy / this.zoom; this.dirty = true; this.onBewegt?.(); }

  #tick() {
    const now = performance.now();
    if (this.flug) {
      const f = this.flug; const t = Math.min(1, (now - f.t0) / f.dur); const e = ease(t);
      this.cam = { x: f.from.x + (f.to.x - f.from.x) * e, y: f.from.y + (f.to.y - f.from.y) * e };
      let z = f.from.z * Math.pow(f.to.z / f.from.z, e);
      if (f.peak) z = Math.min(z, f.peak + (Math.max(f.from.z, f.to.z) - f.peak) * Math.abs(2 * e - 1) ** 1.5);
      this.zoom = z; this.dirty = true;
      if (t >= 1) { this.flug = null; this.onFlug?.(false); this.onBewegt?.(); }
    }
    // Dauerhaft gezeichnet wird nur, wenn sich etwas bewegt: getragene Energie oder schreitende/zitternde Fugen.
    const animated = !this.ruhig && ((this.getragen.length && this.zeiger) || this.bewegteFugen);
    if (!this.dirty && !(animated && now - (this.letztes || 0) > 33)) return;
    this.dirty = false; this.letztes = now;
    const energie = this.getragen.length && this.zeiger ? { ...this.welt(this.zeiger.x, this.zeiger.y), k: 1 } : null;
    const focus = this.sel !== null ? { x: this.d.orte[this.sel].x, y: this.d.orte[this.sel].y, r: 260 } : null;
    this.gel.zeichne({ w: this.w, h: this.h, cam: this.cam, zoom: this.zoom, energy: energie, calm: this.ruhig, focus });
    this.#zeichne(now, energie);
  }

  // ------- Zeichnen der Überlagerung -------
  #zeichne(now, energie) {
    const c = this.ctx; const dpr = this.dpr; const z = this.zoom;
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, this.cv.width, this.cv.height);
    c.setTransform(dpr * z, 0, 0, dpr * z, dpr * (this.w / 2 - this.cam.x * z), dpr * (this.h / 2 - this.cam.y * z));
    const orte = this.d.orte; const fugen = this.d.fugen;
    const view = { x0: this.cam.x - this.w / 2 / z, x1: this.cam.x + this.w / 2 / z, y0: this.cam.y - this.h / 2 / z, y1: this.cam.y + this.h / 2 / z };
    const inView = (o, m = 40) => o.x > view.x0 - m && o.x < view.x1 + m && o.y > view.y0 - m && o.y < view.y1 + m;
    const t = now / 1000;

    // Hervorgehobene Orte: Auswahl, Getragenes und deren Nachbarn
    const fokus = new Set(); const geteilt = new Map();
    const quelle = this.getragen.length ? this.getragen : (this.sel !== null ? [this.sel] : []);
    for (const i of quelle) for (const fi of this.adj[i]) {
      const f = fugen[fi]; const n = f.a === i ? f.b : f.a; fokus.add(fi);
      geteilt.set(n, (geteilt.get(n) || 0) + 1);
    }

    // 1) Leise Fugen im Ortsmaßstab
    // Ohne Auswahl und erst nah: einzelne leise Fäden, nie ein Netz über allem.
    if (z > 1.3 && !quelle.length && this.linse !== 'eigen') {
      c.lineWidth = 0.7 / z; c.globalAlpha = Math.min(0.2, (z - 1.3) * 0.3);
      for (const f of fugen) {
        if (f.art === 'einordnung') continue;
        const a = orte[f.a]; const b = orte[f.b];
        if (!inView(a, 200) && !inView(b, 200)) continue;
        c.strokeStyle = this.linse === 'gebiete' ? '#6d6457' : (ARTEN[fugenArt(f)]?.farbe || '#666');
        c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke();
      }
      c.globalAlpha = 1;
    }

    // 2) Fugen der Auswahl in ihrer Form
    this.bewegteFugen = false;
    if (quelle.length && this.linse !== 'eigen') {
      for (const fi of fokus) {
        const f = fugen[fi]; const art = fugenArt(f);
        if (art === 'einordnung' && z < 0.9 && !this.getragen.length) continue;
        if (art === 'folge' || art === 'spannung') this.bewegteFugen = true;
        this.#fuge(c, orte[f.a], orte[f.b], art, f.geltung, fi === this.fugeSel, t, z);
      }
    }

    // 3) Eigene Fugen (persönlich, blaue Tinte)
    for (const g of this.eigene) {
      const teile = g.teile.filter((p) => p.ort !== null && p.ort !== undefined);
      if (teile.length < 2) continue;
      const mx = teile.reduce((s, p) => s + orte[p.ort].x, 0) / teile.length; const my = teile.reduce((s, p) => s + orte[p.ort].y, 0) / teile.length;
      for (const p of teile) this.#fuge(c, orte[p.ort], { x: mx, y: my }, g.art, 'persoenlich', g.id === this.eigenSel, t, z, true);
      c.fillStyle = '#1f4fa8'; c.beginPath(); c.arc(mx, my, 4.5 / z, 0, Math.PI * 2); c.fill();
      if (z > 0.35) { this.#label(c, g.titel || 'Eigene Fuge', mx, my + 16 / z, 12, '#1f4fa8', z, 'italic 600'); }
    }

    // 4) Orte
    const rad = (o) => (1.8 + Math.sqrt(o.n) * 0.55) * Math.min(1.5, Math.max(0.75, Math.sqrt(z))) / z;
    for (let i = 0; i < orte.length; i++) {
      const o = orte[i]; if (!inView(o)) continue; if (!this.#sichtbar(i)) continue;
      const g = this.reg[o.r];
      const hi = geteilt.get(i);
      let alpha = 1;
      if (quelle.length && !hi && !quelle.includes(i)) alpha = this.getragen.length ? 0.35 : 0.6;
      const r = rad(o) * (hi ? 1.5 : 1);
      if (this.linse === 'fugen') {
        const art = this.ortArt[i]; c.globalAlpha = art ? alpha : alpha * 0.35;
        c.fillStyle = art ? ARTEN[art].farbe : '#a49a88';
      } else if (this.linse === 'geltung') {
        const h = this.ortHerkunft[i]; c.globalAlpha = alpha;
        c.fillStyle = { quelle: '#1d1a16', original: '#7d7466', redaktionell: '#b0a38c', offen: '#f4efe5' }[h] || '#d6ccba';
        if (h === 'offen' || h === 'redaktionell') { c.strokeStyle = h === 'offen' ? '#6d6457' : '#8c8273'; c.lineWidth = 1.2 / z; c.setLineDash(h === 'offen' ? [1.5 / z, 1.5 / z] : []); c.beginPath(); c.arc(o.x, o.y, r, 0, Math.PI * 2); c.fill(); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; continue; }
      } else { c.globalAlpha = alpha; c.fillStyle = g.farbe; }
      c.beginPath(); c.arc(o.x, o.y, r, 0, Math.PI * 2); c.fill();
      if (hi && hi > 1 && this.getragen.length > 1) {
        // gemeinsamer Nachbar mehrerer getragener Orte: doppelter Ring
        c.strokeStyle = '#b4561c'; c.lineWidth = 1.6 / z;
        c.beginPath(); c.arc(o.x, o.y, r + 5 / z, 0, Math.PI * 2); c.stroke();
        c.beginPath(); c.arc(o.x, o.y, r + 9 / z, 0, Math.PI * 2); c.stroke();
      }
      c.globalAlpha = 1;
    }

    // 5) Auswahl und Schwebe
    const ring = (i, col, w, extra = 0) => {
      const o = orte[i]; c.strokeStyle = col; c.lineWidth = w / z;
      c.beginPath(); c.arc(o.x, o.y, rad(o) + (7 + extra) / z, 0, Math.PI * 2); c.stroke();
    };
    if (this.hover !== null) ring(this.hover, '#1d1a16', 1.4);
    if (this.sel !== null) {
      const pulse = this.ruhig ? 0 : Math.sin(t * 2.2) * 2;
      ring(this.sel, '#1d1a16', 2.2, pulse);
    }
    for (const i of this.getragen) ring(i, '#b4561c', 2.4, 3);

    // 6) Beschriftungen mit Kollisionsvermeidung
    this.#beschrifte(c, z, inView, geteilt, quelle);

    // 7) Getragene Energie am Zeiger
    if (energie) {
      const e = energie; const n = this.getragen.length;
      for (let k = 0; k < n; k++) {
        const ang = t * 1.4 + (k / n) * Math.PI * 2; const rr = n > 1 ? 14 / z : 0;
        const x = e.x + Math.cos(ang) * rr; const y = e.y + Math.sin(ang) * rr;
        const grad = c.createRadialGradient(x, y, 0, x, y, 22 / z);
        grad.addColorStop(0, 'rgba(255,214,150,0.95)'); grad.addColorStop(0.35, 'rgba(214,120,40,0.55)'); grad.addColorStop(1, 'rgba(214,120,40,0)');
        c.fillStyle = grad; c.beginPath(); c.arc(x, y, 22 / z, 0, Math.PI * 2); c.fill();
        c.fillStyle = this.reg[orte[this.getragen[k]].r].farbe; c.beginPath(); c.arc(x, y, 4 / z, 0, Math.PI * 2); c.fill();
      }
      // Fäden vom Zeiger zu den getragenen Orten zeigen, woher die Energie stammt
      c.strokeStyle = 'rgba(180,86,28,0.5)'; c.lineWidth = 1 / z; c.setLineDash([3 / z, 4 / z]);
      for (const i of this.getragen) { c.beginPath(); c.moveTo(orte[i].x, orte[i].y); c.lineTo(e.x, e.y); c.stroke(); }
      c.setLineDash([]);
      // Nahe Orte mit Fuge zur Energie zeigen ihre Fugenart als Zeichen
      const nahe = [...fokus].map((fi) => { const f = fugen[fi]; const n = this.getragen.includes(f.a) ? f.b : f.a; return [fi, Math.hypot(orte[n].x - e.x, orte[n].y - e.y) * z]; })
        .filter(([, d]) => d <= 150).sort((p, q) => p[1] - q[1]).slice(0, 3);
      for (const [fi] of nahe) {
        const f = fugen[fi]; const n = this.getragen.includes(f.a) ? f.b : f.a; const o = orte[n];
        const d = Math.hypot(o.x - e.x, o.y - e.y) * z;
        const k = 1 - d / 150; c.globalAlpha = 0.25 + k * 0.75;
        this.#label(c, ARTEN[fugenArt(f)].name, o.x, o.y - (14 + 10 * k) / z, 11, ARTEN[fugenArt(f)].farbe, z, '600');
        c.globalAlpha = 1;
      }
    }
  }

  #fuge(c, a, b, art, geltung, aktiv, t, z, eigen) {
    const s = 1 / z; const st = strich(geltung, s);
    const def = ARTEN[art] || ARTEN.einordnung;
    // Endpunkte etwas vom Ortspunkt zurücknehmen
    const dx = b.x - a.x; const dy = b.y - a.y; const L = Math.hypot(dx, dy) || 1; const m = 8 / z;
    const x1 = a.x + dx / L * m; const y1 = a.y + dy / L * m; const x2 = b.x - (eigen ? 0 : dx / L * m); const y2 = b.y - (eigen ? 0 : dy / L * m);
    let path; try { path = new Path2D(fugenPfad(art, x1, y1, x2, y2, s)); } catch { return; }
    c.save();
    if (art === 'offen') {
      c.fillStyle = this.schraffur(c); c.globalAlpha = aktiv ? 0.9 : 0.55; c.fill(path); c.globalAlpha = 1;
    }
    if (aktiv) { c.strokeStyle = 'rgba(255,250,240,0.95)'; c.lineWidth = (st.width + 4) / z; c.setLineDash([]); c.stroke(path); }
    c.strokeStyle = st.farbe || def.farbe; c.lineWidth = (aktiv ? st.width + 1 : st.width) / z;
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.setLineDash(st.dash.map((v) => v));
    // Bewegung je Art: Übergang fließt, Folge schreitet, Spannung zittert, sonst ruhig
    if (!this.ruhig) {
      // Übergänge bleiben ruhig: Bewegung würde eine Wirkung nahelegen.
      if (art === 'folge') { c.lineDashOffset = -Math.floor(t * 2) * 6 / z; }
      if (art === 'spannung') c.translate(Math.sin(t * 37) * 0.6 / z, Math.cos(t * 41) * 0.6 / z);
    }
    c.stroke(path); c.restore();
  }

  schraffur(c) {
    if (this._pat) return this._pat;
    const p = document.createElement('canvas'); p.width = 8; p.height = 8; const g = p.getContext('2d');
    g.strokeStyle = 'rgba(109,100,87,0.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, 8); g.lineTo(8, 0); g.stroke();
    this._pat = c.createPattern(p, 'repeat'); return this._pat;
  }

  schriften() {
    if (!this._schrift) { const cs = getComputedStyle(document.documentElement); this._schrift = { serif: cs.getPropertyValue('--serif-name') || 'Georgia', sans: cs.getPropertyValue('--sans-name') || 'system-ui' }; }
    return this._schrift;
  }

  #label(c, text, x, y, px, farbe, z, weight = '500') {
    c.save(); c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const p = this.schirm(x, y);
    c.font = `${weight} ${px}px ${this.schriften().sans}`;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 3.5; c.strokeStyle = 'rgba(246,242,233,0.92)'; c.strokeText(text, p.x, p.y);
    c.fillStyle = farbe; c.fillText(text, p.x, p.y); c.restore();
  }

  #beschrifte(c, z, inView, geteilt, quelle) {
    c.save(); c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    const placed = [];
    const frei = (x, y, w, h) => !placed.some((r) => x < r.x + r.w && x + w > r.x && y < r.y + r.h && y + h > r.y);
    const { serif, sans } = this.schriften();
    // Beschriftung mit Ausweichstellen: oben, unten, rechts, links; sonst entfällt sie (keine Überlagerung).
    const put = (text, x, y, font, color, halo = true, maxW = 220, punkt = false) => {
      c.font = font; let tx = text; let w = c.measureText(tx).width;
      while (w > maxW && tx.length > 8) { tx = `${tx.slice(0, -2).trimEnd()}…`; w = c.measureText(tx).width; }
      const h = parseFloat(font.match(/(\d+)px/)[1]) + 4;
      const stellen = punkt ? [[0, 0, 'center'], [0, 26, 'center'], [w / 2 + 12, 13, 'center'], [-w / 2 - 12, 13, 'center']] : [[0, 0, 'center']];
      for (const [dx, dy] of stellen) {
        const px = x + dx; const py = y + dy;
        if (px - w / 2 < 2 || px + w / 2 > this.w - 2 || py < 52 || py > this.h - 4) continue;
        if (!frei(px - w / 2 - 3, py - h / 2, w + 6, h)) continue;
        placed.push({ x: px - w / 2 - 3, y: py - h / 2, w: w + 6, h });
        c.textAlign = 'center'; c.textBaseline = 'middle';
        if (halo) { c.lineWidth = 4; c.lineJoin = 'round'; c.strokeStyle = 'rgba(246,242,233,0.94)'; c.strokeText(tx, px, py); }
        c.fillStyle = color; c.fillText(tx, px, py); return true;
      }
      return false;
    };
    // Auswahl, Getragenes und Schwebe zuerst
    const order = [];
    if (this.sel !== null) order.push([this.sel, 3]);
    for (const i of this.getragen) order.push([i, 3]);
    if (this.hover !== null) order.push([this.hover, 3]);
    const neighbours = [...geteilt.keys()].sort((a, b) => this.d.orte[b].n - this.d.orte[a].n);
    for (const i of neighbours.slice(0, this.w < 600 ? 7 : 18)) order.push([i, 2]);
    // Gebietsnamen im Überblick
    const regionAlpha = Math.max(0, Math.min(1, (1.1 - z) / 0.6));
    const done = new Set();
    for (const [i, lvl] of order) {
      if (done.has(i)) continue; done.add(i);
      const o = this.d.orte[i]; if (!inView(o, 0)) continue;
      const p = this.schirm(o.x, o.y);
      const big = lvl === 3;
      put(o.t, p.x, p.y - (big ? 18 : 14), `${big ? 600 : 500} ${big ? 14 : 12}px ${sans}`, big ? '#1d1a16' : '#3b352d', true, big ? 260 : 190, true);
    }
    if (regionAlpha > 0.02) {
      c.globalAlpha = regionAlpha;
      this.reg.forEach((g) => {
        const p = this.schirm(g.x, g.y);
        const size = Math.max(13, Math.min(26, 11 + Math.sqrt(g.count) * 0.9 * Math.min(1, z * 3)));
        for (const dy of [0, -size * 1.3, size * 1.3, -size * 2.4]) if (put(g.name.toUpperCase(), p.x, p.y + dy, `600 ${Math.round(size)}px ${serif}`, g.tinte, true, 340)) break;
      });
      c.globalAlpha = 1;
    }
    if (z > 0.45) {
      const cands = [];
      this.d.orte.forEach((o, i) => { if (!done.has(i) && inView(o, 0) && this.#sichtbar(i)) cands.push(i); });
      cands.sort((a, b) => this.d.orte[b].n - this.d.orte[a].n);
      // Wenige ruhige Beschriftungen; bei einer Auswahl sprechen vor allem deren Nachbarn.
      const limit = quelle.length ? 6 : Math.round(Math.min(26, 10 + (z - 0.45) * 14));
      let n = 0;
      c.globalAlpha = quelle.length ? 0.7 : 1;
      for (const i of cands) {
        if (n > limit) break;
        const o = this.d.orte[i]; const p = this.schirm(o.x, o.y);
        if (put(o.t, p.x, p.y - 12, `500 ${z > 1.6 ? 12.5 : 11.5}px ${sans}`, '#3b352d', true, 170, true)) n++;
      }
      c.globalAlpha = 1;
    }
    c.restore();
  }
}
