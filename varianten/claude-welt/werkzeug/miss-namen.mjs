// Misst, wie gedrängt die Ortsnamen bei mittlerem Zoom stehen: je Gebiet und Zoom Zahl der Namen,
// engster Abstand zwischen zwei Namen, Namen über fremden Körpern. Macht dazu Bilder.
// Aufruf: node werkzeug/miss-namen.mjs <basis-url> <zielordner>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103/package.json');
const { chromium } = require('playwright-core');
const [,, basis = 'http://127.0.0.1:47232', ziel = 'bilder/namen'] = process.argv;
fs.mkdirSync(ziel, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });

function abstand(a, b) {
  const dx = Math.max(0, Math.max(a[0], b[0]) - Math.min(a[2], b[2]));
  const dy = Math.max(0, Math.max(a[1], b[1]) - Math.min(a[3], b[3]));
  return Math.hypot(dx, dy);
}
function kreisInBox(k, b) {
  const qx = Math.max(b[0], Math.min(k.x, b[2])), qy = Math.max(b[1], Math.min(k.y, b[3]));
  return Math.hypot(qx - k.x, qy - k.y) < k.r * 0.8;
}

const zeilen = [];
for (const [name, viewport] of [['desktop', { width: 1440, height: 900 }], ['schmal', { width: 390, height: 844 }]]) {
  const seite = await browser.newPage({ viewport, deviceScaleFactor: 1, hasTouch: viewport.width < 760, isMobile: viewport.width < 760 });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(e.message));
  await seite.goto(`${basis}/welt/`);
  await seite.waitForSelector('body[data-bereit="1"]');
  for (let k = 0; k < 10; k++) {
    const [x, y] = await seite.evaluate((k) => window.lebendeWelt.gebietsmitte(k), k);
    for (const f of [2.0, 2.7, 3.3]) {
      await seite.evaluate(([x, y, f]) => window.lebendeWelt.blick(x, y, f), [x, y, f]);
      await seite.waitForTimeout(500);
      const { namen, koerper } = await seite.evaluate(() => ({ namen: window.lebendeWelt.namen().map((n) => ({ ...n, box: [n.box[0] + 3, n.box[1] + 2, n.box[2] - 3, n.box[3] - 2] })), koerper: window.lebendeWelt.koerper() }));
      let eng = Infinity, unter8 = 0;
      for (let a = 0; a < namen.length; a++) {
        let naechst = Infinity;
        for (let b = 0; b < namen.length; b++) if (a !== b) naechst = Math.min(naechst, abstand(namen[a].box, namen[b].box));
        eng = Math.min(eng, naechst); if (naechst < 8) unter8++;
      }
      const ueber = namen.filter((n) => koerper.some((k) => k.i !== n.ort && kreisInBox(k, n.box))).length;
      const flaeche = viewport.width * viewport.height / 1e5;
      zeilen.push(`${name}\tGebiet ${k}\tZoom ${f}\tNamen ${namen.length}\tje 100k px² ${(namen.length / flaeche).toFixed(1)}\tengster ${eng === Infinity ? '-' : eng.toFixed(1)}\tunter 8px ${unter8}\tüber fremdem Körper ${ueber}\tKörper ${koerper.length}`);
      if (f === 2.7) await seite.screenshot({ path: `${ziel}/${name}-gebiet${k}-zoom${f}.png` });
    }
  }
  if (fehler.length) zeilen.push(`${name}: Fehler ${fehler.join(' | ')}`);
  await seite.close();
}
await browser.close();
console.log(zeilen.join('\n'));
