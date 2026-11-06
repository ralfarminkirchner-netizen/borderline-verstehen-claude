// Kleiner statischer Dienst für Leinwand und Prüfung (nur Loopback). Wurzel = Worktree.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const port = Number(process.argv[2] || 47231);
const typen = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json',
  '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.vtt': 'text/vtt', '.svg': 'image/svg+xml' };
http.createServer((req, res) => {
  const p = path.normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^\/+/, '');
  const datei = path.join(wurzel, p);
  if (!datei.startsWith(wurzel) || datei.includes('private-data')) { res.writeHead(403); return res.end(); }
  fs.stat(datei, (fehler, st) => {
    if (fehler || !st.isFile()) { res.writeHead(404); return res.end('nicht da'); }
    const typ = typen[path.extname(datei)] || 'application/octet-stream';
    const range = req.headers.range;
    if (range && /^bytes=/.test(range)) {
      const [a, b] = range.replace('bytes=', '').split('-');
      const start = Number(a), ende = b ? Number(b) : st.size - 1;
      res.writeHead(206, { 'Content-Type': typ, 'Content-Range': `bytes ${start}-${ende}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': ende - start + 1 });
      return fs.createReadStream(datei, { start, end: ende }).pipe(res);
    }
    res.writeHead(200, { 'Content-Type': typ, 'Content-Length': st.size, 'Cache-Control': 'no-store' });
    fs.createReadStream(datei).pipe(res);
  });
}).listen(port, '127.0.0.1', () => console.log(`statisch auf http://127.0.0.1:${port}/ (pid ${process.pid})`));
