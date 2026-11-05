// Gesamt-App „Borderline verstehen“ für Railway: Atlas (Fassung history-01 aus dem Variantenraum)
// unter /, die Funktion „Schloss und Schlüssel“ unter /schloss/. Liefert nur Dateien aus, speichert nichts.
// /api/personal gibt es hier nicht: Der Atlas meldet dann selbst, dass kein gespeicherter Blick geladen wurde.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { dirname, extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const ATLAS = join(HIER, 'atlas');
const SCHLOSS = join(HIER, '..', 'proben', 'schloss-schluessel');
const SCHLOSS_DATEIEN = new Set(['index.html', 'schloss.css', 'schloss.js', 'daten.js', 'zugang-texte.js', 'zugangsprofil.js', 'atlas-rueckweg.js']);
const TYPEN = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
  '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4', '.wav': 'audio/wav', '.mp4': 'video/mp4', '.webm': 'video/webm',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.vtt': 'text/vtt',
};
// Große Mediendateien werden nicht mit hochgeladen (Railway-Upload bricht nach 30 s ab). Fehlen sie
// lokal, leitet der Server auf dieselbe Datei im öffentlichen kanonischen Atlas um (nur lesend; am
// 5.11.2026 alle 42 Dateien gleich groß, Stichprobe von 8 Prüfsummen gleich).
const MEDIEN_QUELLE = process.env.MEDIEN_QUELLE || 'https://borderline-verstehen-atlas-production.up.railway.app';
const SCHUTZ = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', 'x-robots-tag': 'noindex, nofollow' };

function nichtGefunden(res) { res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', ...SCHUTZ }); res.end('Nicht gefunden'); }

async function liefere(req, res, datei, pfad = '') {
  let info;
  try { info = await stat(datei); } catch {
    if (pfad.startsWith('/assets/media/') && MEDIEN_QUELLE) { res.writeHead(302, { location: MEDIEN_QUELLE + encodeURI(pfad), ...SCHUTZ }); return res.end(); }
    return nichtGefunden(res);
  }
  if (!info.isFile()) return nichtGefunden(res);
  const typ = TYPEN[extname(datei).toLowerCase()] || 'application/octet-stream';
  const kopf = { 'content-type': typ, 'accept-ranges': 'bytes', 'cache-control': /\.(html|mjs|js|css|json)$/.test(datei) ? 'no-cache' : 'public, max-age=86400', ...SCHUTZ };
  const bereich = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (bereich && (bereich[1] || bereich[2])) {
    let start = bereich[1] ? Number(bereich[1]) : info.size - Number(bereich[2]);
    let ende = bereich[1] && bereich[2] ? Number(bereich[2]) : info.size - 1;
    if (start < 0) start = 0;
    if (start >= info.size || ende < start) { res.writeHead(416, { 'content-range': `bytes */${info.size}`, ...SCHUTZ }); return res.end(); }
    ende = Math.min(ende, info.size - 1);
    res.writeHead(206, { ...kopf, 'content-range': `bytes ${start}-${ende}/${info.size}`, 'content-length': ende - start + 1 });
    if (req.method === 'HEAD') return res.end();
    return createReadStream(datei, { start, end: ende }).pipe(res);
  }
  res.writeHead(200, { ...kopf, 'content-length': info.size });
  if (req.method === 'HEAD') return res.end();
  createReadStream(datei).pipe(res);
}

createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return nichtGefunden(res);
  let pfad;
  try { pfad = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { return nichtGefunden(res); }
  if (pfad === '/schloss') { res.writeHead(301, { location: '/schloss/', ...SCHUTZ }); return res.end(); }
  if (pfad.startsWith('/schloss/')) {
    const name = pfad.slice('/schloss/'.length) || 'index.html';
    return SCHLOSS_DATEIEN.has(name) ? liefere(req, res, join(SCHLOSS, name)) : nichtGefunden(res);
  }
  const rel = normalize(pfad.endsWith('/') ? pfad + 'index.html' : pfad).replace(/^([/\\])+/, '');
  const datei = join(ATLAS, rel);
  if (!datei.startsWith(ATLAS + sep)) return nichtGefunden(res);
  liefere(req, res, datei, pfad);
}).listen(Number(process.env.PORT || 8080), '0.0.0.0');
