// Prüft /welt/ in echtem Chrome: Desktop und schmal, ohne Skriptfehler, mit Bildern der wichtigsten Zustände.
// Aufruf: node werkzeug/pruefe-welt.mjs <basis-url> <zielordner>
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire('/Volumes/ThunderBolt4_2TB/Development/Projects/borderline-verstehen-claude-20261103/package.json');
const { chromium } = require('playwright-core');
const [,, basis = 'http://127.0.0.1:47232', ziel = 'bilder/pruefung'] = process.argv;
fs.mkdirSync(ziel, { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const bericht = [];

async function lauf(name, viewport, schritte) {
  const seite = await browser.newPage({ viewport, deviceScaleFactor: 2, hasTouch: viewport.width < 760, isMobile: viewport.width < 760 });
  const fehler = [];
  seite.on('pageerror', (e) => fehler.push(`Seitenfehler: ${e.message}`));
  seite.on('console', (m) => { if (m.type() === 'error') fehler.push(`Konsole: ${m.text()}`); });
  seite.on('requestfailed', (r) => fehler.push(`Anfrage: ${r.url()} ${r.failure()?.errorText}`));
  seite.on('response', (r) => { if (r.status() >= 400) fehler.push(`HTTP ${r.status()}: ${r.url()}`); });
  const t0 = Date.now();
  await seite.goto(`${basis}/welt/`);
  await seite.waitForSelector('body[data-bereit="1"]', { timeout: 60000 });
  bericht.push(`${name}: bereit nach ${Date.now() - t0} ms`);
  await seite.waitForTimeout(800);
  for (const [bildname, schritt] of schritte) {
    await schritt(seite);
    await seite.screenshot({ path: `${ziel}/${name}-${bildname}.png` });
  }
  // Bildrate über 2 s messen
  const fps = await seite.evaluate(() => new Promise((ok) => { let n = 0; const t = performance.now(); const f = () => { n++; if (performance.now() - t < 2000) requestAnimationFrame(f); else ok(n / 2); }; requestAnimationFrame(f); }));
  bericht.push(`${name}: ${fps.toFixed(0)} Bilder/s im letzten Zustand`);
  bericht.push(`${name}: ${fehler.length ? fehler.join(' | ') : 'keine Fehler'}`);
  await seite.close();
}

const warte = (ms) => (s) => s.waitForTimeout(ms);
const START = 'Die Angst vor Verlust ist groß';
const tippeAuf = (titel) => async (s) => { const p = await s.evaluate((t) => window.lebendeWelt.aufSchirm(t), titel); await s.mouse.click(p[0], p[1]); await s.waitForTimeout(2600); };
const trefferAuf = (muster, ms = 1500) => async (s) => {
  const h = (await s.evaluate(() => window.lebendeWelt.treffer())).find((x) => x.name && x.name.includes(muster));
  if (!h) throw new Error(`kein Treffer für ${muster}`);
  await s.mouse.click(h.x, h.y); await s.waitForTimeout(ms);
};
const neu = async (s) => { await s.goto(`${basis}/welt/`); await s.waitForSelector('body[data-bereit="1"]'); await s.waitForTimeout(600); };
const desktop = [
  ['1-welt', warte(300)],
  ['2-naeher', async (s) => { for (let k = 0; k < 3; k++) await s.click('#naeher'); await s.waitForTimeout(1500); }],
  ['3-hinwenden', tippeAuf(START)],
  ['4-abschnitt', async (s) => { const b = s.locator('.pfad button').nth(2); if (await b.count()) await b.click(); await s.waitForTimeout(400); }],
  ['5-verbindung', trefferAuf('Verbindung zu', 600)],
  ['6-weiter', trefferAuf('Auch meine Grenze gilt', 2600)],
  ['7-klang', async (s) => { await neu(s); await trefferAuf('Trauma, Sicherheit', 400)(s); await s.mouse.move(5, 500); await s.waitForTimeout(400); for (let k = 0; k < 4; k++) await s.click('#naeher'); await s.waitForTimeout(4000); }],
  ['8-film', async (s) => { await neu(s); await trefferAuf('Überlastung verstehen', 3000)(s); }],
  ['9-bildnisse', async (s) => { await s.keyboard.press('Escape'); await neu(s); await trefferAuf('Lichtung mit Bildnissen', 2000)(s); }],
  ['10-suche', async (s) => { await s.click('#linse'); await s.fill('#suchwort', 'Scham'); await s.waitForTimeout(300); }],
  ['11-zugang', async (s) => { await s.keyboard.press('Escape'); await s.click('#bluete'); await s.click('.blatt[data-wahl="text"]'); await s.waitForTimeout(300); }],
];
const schmal = [
  ['1-welt', warte(300)],
  ['2-hinwenden', async (s) => { await s.evaluate((t) => { location.hash = encodeURIComponent(t); }, START); await s.waitForTimeout(2600); }],
  ['3-lesen', async (s) => { await s.locator('#lesen').evaluate((e) => { e.scrollTop = 200; }); await s.waitForTimeout(300); }],
];
await lauf('desktop', { width: 1440, height: 900 }, desktop);
await lauf('schmal', { width: 390, height: 844 }, schmal);
await browser.close();
console.log(bericht.join('\n'));
