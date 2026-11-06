// Baut die Medienorte der Lebenden Welt und kopiert den Weltbestand in die App (app/welt/daten).
// Eingabe: data-readonly/medien.json, daten/welt.json, Mediendateien in app/atlas/assets/media (nur lesend)
// Ausgabe: daten/medien.json und app/welt/daten/{welt.json, medien.json, texte/}
//
// Lage: Nur was der Bestand einem Ort zuordnet, liegt an diesem Ort. Medien, die der Bestand nur einem
// Gebiet zuordnet, liegen im Gebiet an einer freien Stelle (aus der Lage der Orte berechnet, nicht erfunden).
// Sichtbar ist nur, was zum Thema gehört: keine Werktitel, keine Urheber- oder Werkzeugangaben.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const hier = path.dirname(fileURLToPath(import.meta.url));
const wurzel = path.resolve(hier, '../..');
const MEDIEN = path.join(wurzel, 'app/atlas/assets/media');
const bestand = JSON.parse(fs.readFileSync(path.join(wurzel, 'data-readonly/medien.json'), 'utf8'));
const welt = JSON.parse(fs.readFileSync(path.join(hier, 'daten/welt.json'), 'utf8'));
const O = welt.orte;

// Gebiete für Medien ohne Ort, aus der Gebietszuordnung des Atlas (siehe sichtung/MEDIENLISTE.md, §4–6).
const GEBIET_OHNE_ORT = {
  'notebook-trauma-audio': 0, 'trauma-mindmap': 0, 'trauma-video': 0, 'trauma-infografik': 0,
  'traumaatlas-mensch-und-verbindungen': 0, 'traumaatlas-kugel-in-der-welle': 0, 'traumaatlas-lichtfluss-im-koerper': 0,
  'neurodivergenz-video': 2, 'dyskalkulie-bewaeltigen': 1, 'adhs-dyskalkulie': 5, 'warum-schlaue-kinder': 1,
  'walter-andreas-kirchner-nischbach-und-die-schlimmen-jahre-1999': 1,
};
const PORTRAITS = new Set([1039, 1042]);

// Sichtbarer Titel: nur Thema. Werktitel und Werkzeugangaben fallen weg.
function sichtbarerTitel(e) {
  if (e.werk || !/\.(mp4|m4a)$/.test(e.datei || '')) return '';
  return String(e.titel).replace(/\s*·\s*(eine kurze )?NotebookLM[^·]*$/i, '').replace(/\s*·\s*[^·]*NotebookLM[^·]*/gi, '').trim();
}

function schluessel(e) {
  const d = path.basename(e.datei || '', path.extname(e.datei || ''));
  if (GEBIET_OHNE_ORT[e.id] !== undefined) return e.id;
  for (const k of Object.keys(GEBIET_OHNE_ORT)) if (d.startsWith(k)) return k;
  return d;
}

function vttZuHinweisen(datei) {
  const p = path.join(MEDIEN, datei);
  if (!fs.existsSync(p)) return [];
  const zeit = (s) => s.split(':').reduce((a, x) => a * 60 + Number(x.replace(',', '.')), 0);
  return fs.readFileSync(p, 'utf8').split(/\r?\n\r?\n/).map((block) => {
    const z = block.split(/\r?\n/);
    const i = z.findIndex((l) => l.includes('-->'));
    if (i < 0) return null;
    const [a, b] = z[i].split('-->').map((s) => zeit(s.trim().split(' ')[0]));
    return { von: +a.toFixed(2), bis: +b.toFixed(2), text: z.slice(i + 1).join(' ').replace(/<[^>]+>/g, '').trim() };
  }).filter((c) => c && c.text);
}

// Hüllkurve des Tons (Lautheit je Abschnitt, 0–1), gemessen aus der Datei.
function huelle(datei, n = 96) {
  const p = path.join(MEDIEN, datei);
  if (!fs.existsSync(p)) return null;
  const roh = execFileSync('ffmpeg', ['-v', 'error', '-i', p, '-vn', '-ac', '1', '-ar', '1000', '-f', 's16le', '-'], { maxBuffer: 1 << 28 });
  const s = new Int16Array(roh.buffer, roh.byteOffset, Math.floor(roh.length / 2));
  const je = Math.floor(s.length / n);
  const werte = [];
  for (let k = 0; k < n; k++) { let q = 0; for (let i = k * je; i < (k + 1) * je; i++) q += s[i] * s[i]; werte.push(Math.sqrt(q / je)); }
  const max = Math.max(...werte) || 1;
  return { dauer: s.length / 1000, werte: werte.map((v) => +(v / max).toFixed(3)) };
}

// Freie Stelle im Gebiet: Ring um den Schwerpunkt, weit weg von Orten und anderen Medien, aber im Gebiet.
const belegt = [];
function freieStelle(k, abstand = 70) {
  const os = O.filter((o) => o.r === k);
  const cx = os.reduce((s, o) => s + o.x, 0) / os.length, cy = os.reduce((s, o) => s + o.y, 0) / os.length;
  const streu = Math.sqrt(os.reduce((s, o) => s + (o.x - cx) ** 2 + (o.y - cy) ** 2, 0) / os.length);
  let best = null;
  for (let ring = 0.35; ring <= 1.1; ring += 0.15) for (let a = 0; a < 48; a++) {
    const th = (a / 48) * Math.PI * 2;
    const x = cx + Math.cos(th) * streu * ring, y = cy + Math.sin(th) * streu * ring;
    const naechsterEigen = Math.min(...os.map((o) => Math.hypot(o.x - x, o.y - y)));
    if (naechsterEigen > streu * 0.6) continue; // muss im Gebiet bleiben
    const frei = Math.min(...O.map((o) => Math.hypot(o.x - x, o.y - y)), ...belegt.map(([bx, by]) => Math.hypot(bx - x, by - y) * 0.5));
    if (!best || frei > best.frei) best = { x, y, frei };
  }
  belegt.push([best.x, best.y]);
  return [Math.round(best.x), Math.round(best.y), Math.max(abstand, Math.round(best.frei * 0.8))];
}

const medien = [];
for (const e of bestand) {
  if (!e.datei) continue; // externe Videos ohne lokale Datei bleiben draußen
  const datei = path.basename(e.datei);
  const art = /\.mp4$/.test(datei) ? 'video' : /\.m4a$/.test(datei) ? 'klang' : 'bild';
  const orte = (e.eintraege || []).filter((i) => O[i]);
  const m = { art, datei: `/assets/media/${datei}`, titel: sichtbarerTitel(e), orte, gebiet: null, x: 0, y: 0, r: 0 };
  if (e.poster) m.poster = `/assets/media/${path.basename(e.poster)}`;
  if (e.untertitel) m.hinweise = vttZuHinweisen(path.basename(e.untertitel));
  if (art !== 'bild') m.huelle = huelle(datei);
  if (orte.length) {
    const o = O[orte[0]];
    m.gebiet = o.r;
    if (orte.some((i) => PORTRAITS.has(i))) { m.gruppe = 'bildnisse'; m.x = Math.round((O[1039].x + O[1042].x) / 2); m.y = Math.round((O[1039].y + O[1042].y) / 2); m.r = 66; }
    else {
      // neben dem Ort, vom Gebietsinneren weg, damit der Ort selbst frei bleibt
      const os = O.filter((q) => q.r === o.r);
      const cx = os.reduce((s, q) => s + q.x, 0) / os.length, cy = os.reduce((s, q) => s + q.y, 0) / os.length;
      let th = Math.atan2(o.y - cy, o.x - cx) || 0;
      // teilen sich zwei Werke denselben Ort, liegen sie nebeneinander statt übereinander
      while (medien.some((q) => q.art === 'bild' && !q.gruppe && Math.hypot(q.x - (o.x + Math.cos(th) * 46), q.y - (o.y + Math.sin(th) * 46)) < 40)) th += 0.9;
      m.x = Math.round(o.x + Math.cos(th) * 46); m.y = Math.round(o.y + Math.sin(th) * 46); m.r = 26;
    }
  } else {
    const k = GEBIET_OHNE_ORT[schluessel(e)];
    if (k === undefined) { console.log('ohne Lage, ausgelassen:', datei); continue; }
    m.gebiet = k;
    [m.x, m.y, m.r] = freieStelle(k, art === 'bild' ? 34 : 60);
    m.r = Math.min(m.r, art === 'bild' ? 40 : 90);
  }
  medien.push(m);
}

const ausgabe = JSON.stringify({ medien });
fs.writeFileSync(path.join(hier, 'daten/medien.json'), ausgabe);

// In die App kopieren (Railway lädt data-readonly nicht hoch; die App braucht vorgebaute Daten).
const app = path.join(wurzel, 'app/welt/daten');
fs.rmSync(app, { recursive: true, force: true });
fs.mkdirSync(path.join(app, 'texte'), { recursive: true });
fs.copyFileSync(path.join(hier, 'daten/welt.json'), path.join(app, 'welt.json'));
fs.writeFileSync(path.join(app, 'medien.json'), ausgabe);
for (const f of fs.readdirSync(path.join(hier, 'daten/texte'))) fs.copyFileSync(path.join(hier, 'daten/texte', f), path.join(app, 'texte', f));
console.log(`medien.json: ${medien.length} Medien`, medien.reduce((z, m) => ((z[m.art] = (z[m.art] || 0) + 1), z), {}), '→ app/welt/daten');
