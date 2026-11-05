// Matrix: Fenstergröße × Umfang × Niveau × Schrift – ragt Ortstext aus seiner Platte, überdeckt er Zähne, Bund oder den anderen Ort?
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
const AUS = __dirname;
const SEITE = 'file://' + path.resolve(AUS, '..', '..', 'index.html');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MESS = () => {
  const box = (s) => [...document.querySelectorAll(s)].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 1 && r.height > 1 && getComputedStyle(e).visibility !== 'hidden'; }).map((e) => e.getBoundingClientRect());
  const schnitt = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const tL = box('.ort-schloss .ort-kurz, .ort-schloss .ort-mehr'), tK = box('.ort-schluessel .ort-kurz, .ort-schluessel .ort-mehr');
  const zahn = box('.zahn'), bund = box('.bund-schluessel, .bund-name'), kopf = box('.kopf h1, .griff, .zugang-knopf, .regeln > summary');
  const flL = document.querySelector('#buehne .flaeche-l, #buehne path') ? null : null;
  const sum = (A, B) => Math.round(A.reduce((s, a) => s + B.reduce((t, b) => t + schnitt(a, b), 0), 0));
  const ganz = (A) => A.reduce((m, r) => ({ top: Math.min(m.top, r.top), bottom: Math.max(m.bottom, r.bottom), left: Math.min(m.left, r.left), right: Math.max(m.right, r.right) }), { top: 1e9, bottom: -1e9, left: 1e9, right: -1e9 });
  const mehr = [...document.querySelectorAll('.ort-mehr')].map((e) => ({ oy: getComputedStyle(e).overflowY, sh: e.scrollHeight, ch: e.clientHeight }));
  return { LxK: sum(tL, tK), LxZahn: sum(tL, zahn), KxZahn: sum(tK, zahn), LxBund: sum(tL, bund), KxBund: sum(tK, bund), xKopf: sum(tL.concat(tK), kopf), untenL: Math.round(ganz(tL).bottom), untenK: Math.round(ganz(tK).bottom), H: innerHeight, mehr };
};
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const out = [];
  for (const [w, h, touch] of [[1440, 900, false], [1280, 800, false], [390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    const fehler = [];
    page.on('pageerror', (e) => fehler.push(e.message));
    await page.goto(SEITE); await page.waitForTimeout(900);
    for (const schrift of ['normal', 'gross']) for (const niveau of ['original', 'einfach']) for (const umfang of ['kern', 'mehr', 'ganz']) {
      await page.evaluate((p) => window.ZUGANGSPROFIL.setze(p), { schrift, niveau, umfang });
      await page.waitForTimeout(450);
      const m = await page.evaluate(MESS);
      const name = `${w}-${schrift}-${niveau}-${umfang}`;
      out.push({ name, ...m });
      if (['1440-normal-original-ganz', '1440-normal-original-mehr', '1440-gross-einfach-ganz', '1280-normal-original-ganz', '390-normal-original-mehr', '390-normal-original-kern', '390-gross-original-kern', '1280-gross-original-mehr'].includes(name)) await page.screenshot({ path: path.join(AUS, `M-${name}.png`) });
    }
    out.push({ name: `${w} fehler`, fehler });
    await ctx.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(AUS, 'matrix.json'), JSON.stringify(out, null, 1));
  for (const o of out) console.log(o.name, JSON.stringify({ ...o, name: undefined, mehr: undefined }));
})();
