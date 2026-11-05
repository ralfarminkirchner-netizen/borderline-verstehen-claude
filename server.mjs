// Lokaler Dienst der Claude-Fassung „Borderline verstehen · Fugenland“.
// Lauscht ausschließlich auf Loopback. Liefert die eigene Oberfläche, den
// abgeleiteten Lesebestand und den persönlichen Speicher aus.
// Jede Schreiboperation läuft vorher durch die Volume-Prüfung.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, createReadStream } from 'node:fs';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireExternalWriteTarget, checkVolume, pruefeZiel, ExternalStorageError } from './scripts/external-storage.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4393);
// Öffentliche Lesefassung (Railway): lauscht nach außen, prüft kein Mac-Volume, speichert nichts.
const OEFFENTLICH = Boolean(process.env.RAILWAY_ENVIRONMENT || process.env.FUGENLAND_OEFFENTLICH === '1');
const HOST = OEFFENTLICH ? '0.0.0.0' : '127.0.0.1';
const PROBEN = join(ROOT, 'proben');
const PUBLIC = join(ROOT, 'public');
const CONTENT = join(ROOT, 'data-readonly');
const PRIVATE_DIR = process.env.WERKSTATT_DIR || join(ROOT, 'private-data');
const WERKSTATT_FILE = join(PRIVATE_DIR, 'werkstatt.json');
// Medien werden lesend aus dem kanonischen Atlasbestand ausgeliefert, nicht kopiert.
const MEDIA_ROOTS = { atlas: '/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-atlas/dist/assets/media' };

// Startprüfung: ohne registriertes Volume startet der Dienst nicht.
if (!OEFFENTLICH) {
  checkVolume();
  requireExternalWriteTarget(PRIVATE_DIR);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
};

const LOCAL_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`, `[::1]:${PORT}`]);

function allowedRequest(req) {
  // Öffentlich: nur lesen, von jeder Adresse.
  if (OEFFENTLICH) return req.method === 'GET' || req.method === 'HEAD';
  // Nur Anfragen an die eigene Loopback-Adresse; schreibende Anfragen nur
  // aus derselben Herkunft. Schützt vor fremden Webseiten und DNS-Rebinding.
  if (!LOCAL_HOSTS.has(req.headers.host || '')) return false;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const origin = req.headers.origin;
    if (!origin || !LOCAL_HOSTS.has(origin.replace(/^https?:\/\//, ''))) return false;
  }
  return true;
}

// Gleiche Schutzköpfe für alle Antworten: nur eigene Skripte und Verbindungen, Einbettung nur im Variantenraum.
const SCHUTZ = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'content-security-policy': "default-src 'self'; script-src 'self'; connect-src 'self'; img-src 'self' data: blob:; media-src 'self' https://www.media.eo.va.gov; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'none'; frame-ancestors 'self' http://127.0.0.1:4191 http://localhost:4191",
};

function send(res, status, body, type = 'application/json; charset=utf-8') {
  if (res.headersSent) { res.destroy(); return; }
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store', ...SCHUTZ });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

async function readBody(req, limit = 8 * 1024 * 1024) {
  const chunks = []; let size = 0;
  for await (const chunk of req) { size += chunk.length; if (size > limit) throw new Anfragefehler(413, 'Die eigene Arbeit ist zu groß für einen Speichervorgang.'); chunks.push(chunk); }
  return Buffer.concat(chunks).toString('utf8');
}

class Anfragefehler extends Error { constructor(status, text) { super(text); this.status = status; } }
const revision = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
let schreibKette = Promise.resolve();

const EMPTY = () => ({ format: 'fugenland-werkstatt', version: 2, gefuege: [], notizen: [], verlauf: [], raeume: {}, ereignisse: [] });

// Ein unlesbarer Speicher wird nie als leer behandelt: Lesen und Schreiben halten an.
async function loadWerkstatt() {
  if (OEFFENTLICH) return { data: EMPTY(), revision: 'oeffentlich' }; // persönlicher Speicher wird öffentlich nie gelesen
  if (!existsSync(WERKSTATT_FILE)) return { data: EMPTY(), revision: 'neu' };
  const text = await readFile(WERKSTATT_FILE, 'utf8');
  try { return { data: JSON.parse(text), revision: revision(text) }; }
  catch { throw new Anfragefehler(503, 'Der persönliche Speicher ist unlesbar. Nichts wird überschrieben; die Datei muss geprüft werden.'); }
}

async function saveWerkstatt(data) {
  // Eine Volume-Prüfung je Speichervorgang, danach Pfadprüfung jedes einzelnen Ziels.
  checkVolume();
  const target = pruefeZiel(WERKSTATT_FILE);
  await mkdir(pruefeZiel(PRIVATE_DIR), { recursive: true, mode: 0o700 });
  if (existsSync(target)) {
    // Vorherigen Stand als Sicherung behalten, bevor er ersetzt wird.
    const backup = pruefeZiel(join(PRIVATE_DIR, 'werkstatt.vorher.json'));
    await writeFile(backup, await readFile(target), { mode: 0o600 });
  }
  const tmp = pruefeZiel(`${target}.${process.pid}.${randomBytes(4).toString('hex')}.schreiben`);
  const text = JSON.stringify(data, null, 2);
  await writeFile(tmp, text, { mode: 0o600 });
  await rename(tmp, target);
  return revision(text);
}

const istText = (v) => v === undefined || typeof v === 'string';
function validWerkstatt(data) {
  if (!data || data.format !== 'fugenland-werkstatt' || !Array.isArray(data.gefuege) || !Array.isArray(data.notizen)) return false;
  const artOk = /^[a-z]{3,20}$/; const geltungOk = new Set(['persoenlich', 'offen']);
  return data.gefuege.every((g) => g && typeof g.id === 'string' && istText(g.titel) && artOk.test(g.art || '') && geltungOk.has(g.geltung)
      && ['aussage', 'gegenaussage', 'grenze', 'perspektive', 'kontext'].every((k) => istText(g[k]))
      && Array.isArray(g.teile) && g.teile.every((t) => t && typeof t.ortId === 'string' && istText(t.rolle) && istText(t.name)))
    && data.notizen.every((n) => n && typeof n.id === 'string' && typeof n.ortId === 'string' && typeof n.text === 'string')
    // Fugenräume: persönlicher Zustand je Raum und das Ereignisprotokoll, aus dem das Feld lebt.
    && (data.raeume === undefined || (data.raeume && typeof data.raeume === 'object' && !Array.isArray(data.raeume)
      && Object.entries(data.raeume).every(([k, v]) => /^[a-z]{4,20}:[^\s]{1,200}$/.test(k) && v && typeof v === 'object')))
    && (data.ereignisse === undefined || (Array.isArray(data.ereignisse) && data.ereignisse.length <= 20000
      && data.ereignisse.every((e) => e && typeof e.art === 'string' && typeof e.raum === 'string' && typeof e.zeit === 'string'
        && Number.isFinite(e.x) && Number.isFinite(e.y))));
}

async function serveFile(res, file, req) {
  let info;
  try { info = await stat(file); } catch { return send(res, 404, { fehler: 'nicht gefunden' }); }
  if (!info.isFile()) return send(res, 404, { fehler: 'nicht gefunden' });
  const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream';
  const kopf = { 'content-type': type, 'cache-control': 'no-cache', 'accept-ranges': 'bytes', ...SCHUTZ };
  let start = 0; let end = info.size - 1; let status = 200;
  const range = req.headers.range;
  if (range && info.size > 0) {
    const m = range.match(/^bytes=(\d*)-(\d*)$/);
    if (!m || (!m[1] && !m[2])) { res.writeHead(416, { ...kopf, 'content-range': `bytes */${info.size}` }); return res.end(); }
    if (!m[1]) { start = Math.max(0, info.size - Number(m[2])); } else { start = Number(m[1]); if (m[2]) end = Math.min(Number(m[2]), info.size - 1); }
    if (start > end || start >= info.size) { res.writeHead(416, { ...kopf, 'content-range': `bytes */${info.size}` }); return res.end(); }
    status = 206; kopf['content-range'] = `bytes ${start}-${end}/${info.size}`;
  }
  res.writeHead(status, { ...kopf, 'content-length': info.size ? end - start + 1 : 0 });
  if (req.method === 'HEAD' || !info.size) return res.end();
  const stream = createReadStream(file, { start, end });
  stream.on('error', () => res.destroy());
  stream.pipe(res);
}

function inside(base, rel) {
  const full = normalize(join(base, rel));
  return full.startsWith(base + '/') || full === base ? full : null;
}

const server = createServer(async (req, res) => {
  try {
    if (!allowedRequest(req)) return send(res, 403, { fehler: OEFFENTLICH ? 'Diese öffentliche Fassung speichert nichts.' : 'Nur lokale Anfragen dieser Oberfläche.' });
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = decodeURIComponent(url.pathname);

    if (path === '/api/werkstatt' && req.method === 'GET') { const { data, revision: rev } = await loadWerkstatt(); return send(res, 200, { ...data, revision: rev }); }
    if (path === '/api/werkstatt' && req.method === 'PUT') {
      let data;
      try { data = JSON.parse(await readBody(req)); } catch (error) { if (error instanceof Anfragefehler) throw error; throw new Anfragefehler(400, 'Kein lesbares JSON.'); }
      if (!validWerkstatt(data)) throw new Anfragefehler(400, 'Unbekanntes oder unvollständiges Format.');
      // Speichervorgänge laufen nacheinander; ein veralteter Stand wird abgewiesen statt überschrieben.
      const ergebnis = schreibKette.then(async () => {
        const { revision: aktuell } = await loadWerkstatt();
        if ((req.headers['if-match'] || '') !== aktuell) throw new Anfragefehler(409, 'Es gibt einen neueren Stand.');
        delete data.revision; data.gespeichert = new Date().toISOString();
        try { return { rev: await saveWerkstatt(data), zeit: data.gespeichert }; }
        catch (error) { if (error instanceof ExternalStorageError) throw new Anfragefehler(503, error.message); throw error; }
      });
      schreibKette = ergebnis.catch(() => {});
      const { rev, zeit } = await ergebnis;
      return send(res, 200, { ok: true, gespeichert: zeit, revision: rev });
    }
    if (path === '/api/status') {
      let volume = 'geprüft';
      try { checkVolume(); } catch (e) { volume = e.message; }
      return send(res, 200, { volume, speicher: existsSync(WERKSTATT_FILE) ? 'vorhanden' : 'leer' });
    }
    if (path.startsWith('/inhalt/')) {
      const file = inside(CONTENT, path.slice('/inhalt/'.length));
      return file ? await serveFile(res, file, req) : send(res, 404, { fehler: 'nicht gefunden' });
    }
    if (path.startsWith('/proben/')) {
      const rel2 = path.slice('/proben/'.length);
      const file = inside(PROBEN, rel2.endsWith('/') || rel2 === '' ? rel2 + 'index.html' : rel2);
      return file ? await serveFile(res, file, req) : send(res, 404, { fehler: 'nicht gefunden' });
    }
    if (path.startsWith('/medien/')) {
      const [, , root, ...rest] = path.split('/');
      const base = MEDIA_ROOTS[root];
      const file = base && inside(base, rest.join('/'));
      return file ? await serveFile(res, file, req) : send(res, 404, { fehler: 'nicht gefunden' });
    }
    const rel = path === '/' ? 'index.html' : path.slice(1);
    const file = inside(PUBLIC, rel);
    if (!file) return send(res, 404, { fehler: 'nicht gefunden' });
    return await serveFile(res, file, req);
  } catch (error) {
    if (error instanceof Anfragefehler) return send(res, error.status, { fehler: error.message });
    send(res, 500, { fehler: 'Interner Fehler.' });
    console.error(error.message);
  }
});

process.on('unhandledRejection', (error) => console.error('Unbehandelt:', error?.message));
server.listen(PORT, HOST, () => console.log(`Fugenland läuft: http://${HOST}:${PORT}/`));
