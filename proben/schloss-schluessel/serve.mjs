// Auslieferung der statischen Probe auf Railway. Liefert nur die fünf
// Laufzeitdateien aus, schreibt nichts, fragt nichts nach außen ab.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DATEIEN = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/schloss.css': ['schloss.css', 'text/css; charset=utf-8'],
  '/schloss.js': ['schloss.js', 'text/javascript; charset=utf-8'],
  '/daten.js': ['daten.js', 'text/javascript; charset=utf-8'],
  '/zugang-texte.js': ['zugang-texte.js', 'text/javascript; charset=utf-8'],
  '/zugangsprofil.js': ['zugangsprofil.js', 'text/javascript; charset=utf-8'],
};
const SCHUTZ = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'x-robots-tag': 'noindex, nofollow',
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
};

createServer(async (req, res) => {
  const pfad = new URL(req.url, 'http://x').pathname;
  const eintrag = DATEIEN[pfad];
  if (!eintrag || (req.method !== 'GET' && req.method !== 'HEAD')) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8', ...SCHUTZ });
    return res.end('Nicht gefunden');
  }
  const inhalt = await readFile(join(ROOT, eintrag[0]));
  res.writeHead(200, { 'content-type': eintrag[1], 'cache-control': 'no-cache', ...SCHUTZ });
  res.end(req.method === 'HEAD' ? undefined : inhalt);
}).listen(Number(process.env.PORT || 8080), '0.0.0.0');
