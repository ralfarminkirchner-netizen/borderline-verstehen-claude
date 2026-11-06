// Fotografiert Leinwandtafeln mit Playwright (Chromium aus dem Hauptprojekt).
import { createRequire } from 'node:module';
const require = createRequire('/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103/package.json');
const { chromium } = require('playwright-core');
const [,, ziel, ...tafeln] = process.argv;
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const seite = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
const fehler = [];
seite.on('pageerror', (e) => fehler.push(String(e)));
seite.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
for (const t of tafeln) {
  const [name, extra = ''] = t.split('?');
  const t0 = Date.now();
  await seite.goto(`http://127.0.0.1:47231/varianten/claude-welt/leinwand/index.html?tafel=${name}&${extra}`);
  await seite.waitForSelector('body[data-fertig="1"]', { timeout: 120000 });
  await seite.screenshot({ path: `${ziel}/${name}${extra ? '-' + extra.replace(/[^a-z0-9]+/gi, '-') : ''}.png` });
  console.log(name, extra, `${Date.now() - t0} ms`);
}
if (fehler.length) console.log('FEHLER', fehler);
await browser.close();
