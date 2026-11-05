// Bedienprüfung 3 (Gewebe-Fassung). Schreibt nur in diesen Ordner. Aufruf: node pruefe.cjs [basisURL]
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');
const { INIT, AUDIT } = require('./helfer.cjs');
const HIER = __dirname;
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SEITE = process.argv[2] || 'file://' + path.resolve(HIER, '../../index.html');
const NUR = process.argv[3] || '';
const LOG = [];
const log = (k, v) => { LOG.push({ k, v }); console.log('■', k, JSON.stringify(v).slice(0, 900)); };
const warte = (p, ms) => p.waitForTimeout(ms);
const bild = (p, n) => p.screenshot({ path: path.join(HIER, n) });

const ZIELE = () => {
  const out = [];
  const sicht = (el) => { const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return false; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || e.hidden) return false; } return r.bottom > 0 && r.top < innerHeight; };
  for (const el of document.querySelectorAll('button, input, a[href], [tabindex]:not([tabindex="-1"]), [role=button]')) {
    if (!sicht(el)) continue;
    const r = el.getBoundingClientRect();
    if (Math.min(r.width, r.height) < 24) out.push(`${el.tagName.toLowerCase()}.${String(el.getAttribute('class') || '').split(' ')[0]} ${Math.round(r.width)}×${Math.round(r.height)} „${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 30)}“`);
  }
  return [...new Set(out)];
};
const FOKUS = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return { el: 'body', ring: false };
  const c = getComputedStyle(el);
  const ring = (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) || (el.closest('svg') && c.stroke && c.stroke !== 'none' && c.stroke !== 'transparent' && !/rgba\(0, 0, 0, 0\)/.test(c.stroke));
  const r = el.getBoundingClientRect();
  return { el: `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') || '').split(' ').slice(0, 2).join('.')}`, name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 50), ring: !!ring, stroke: el.closest('svg') ? c.stroke : undefined, imBild: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth };
};
const zu = (p) => p.evaluate(() => window.__schloss.zustand());
const audit = (p) => p.evaluate(AUDIT);
const kurz = async (p) => { const a = await audit(p); return { klein: a.klein, ueber: a.ueberlappung, aus: a.ausserhalb, quer: a.querScroll, kennung: a.kennung, spuren: a.spuren, url: a.url }; };

async function neu(browser, w, h, extra = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...extra });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const fehler = [], netz = [];
  const herkunft = SEITE.replace(/[^/]*$/, '');
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) fehler.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => fehler.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('data:') && !u.startsWith(herkunft)) netz.push(u); });
  page.on('requestfailed', (r) => fehler.push('requestfailed: ' + r.url()));
  await page.goto(SEITE);
  await warte(page, 1500);
  return { ctx, page, fehler, netz };
}
const PAAR = 'Aufgabenstarre|Wartemodus';
const idx = (p) => p.evaluate(() => window.__schloss.paarVon('Aufgabenstarre', 'Wartemodus'));

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const P = SEITE.startsWith('http') ? 'F-' : '';

  /* ===== A: Maus 1440×900 ===== */
  if (!NUR || NUR === 'A') {
    const { ctx, page, fehler, netz } = await neu(browser, 1440, 900);
    log(P + 'A0 start', { z: await zu(page), audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
    await bild(page, P + 'A0-1440-start.png');
    // Alle fünf Zähne beim Start: leuchtet etwas?
    const zahn = {};
    for (const s of ['Lesart', 'Beleg', 'Grenze', 'Wort', 'Kontext']) {
      await page.click(`.zahn:has-text("${s}")`); await warte(page, 400);
      zahn[s] = { text: await page.locator('.voraus-text').innerText(), liste: await page.locator('.voraus .paar-zeile').count() };
      await page.click(`.zahn:has-text("${s}")`); await warte(page, 200);
    }
    log(P + 'A1 Zähne beim Start', zahn);
    await page.click('.zahn:has-text("Kontext")'); await warte(page, 400); await bild(page, P + 'A1-zahn-kontext-start.png'); await page.click('.zahn:has-text("Kontext")');
    // Ort anklicken
    const pt = await page.evaluate(() => window.__schloss.ortPunkt('Aufgabenstarre'));
    await page.mouse.click(pt.x, pt.y); await warte(page, 900);
    log(P + 'A2 Ort Aufgabenstarre', { z: (await zu(page)).wahl, audit: await kurz(page) });
    await bild(page, P + 'A2-ort.png');
    // Dreher und Umfang
    await page.click('.dreher-blick'); await warte(page, 300);
    await page.click('.dreher-niveau'); await warte(page, 300);
    const ki = await page.locator('.ki-marke').count();
    if (ki) { await page.locator('.ki-marke').first().click(); await warte(page, 200); }
    const weiter = await page.locator('.umfang-wort:has-text("weiterlesen")').count();
    if (weiter) { await page.locator('.umfang-wort:has-text("weiterlesen")').click(); await warte(page, 300); }
    log(P + 'A3 Dreher/Umfang', { ki, weiter, blick: await page.locator('.dreher-blick').innerText(), niveau: await page.locator('.dreher-niveau').innerText(), audit: await kurz(page) });
    await bild(page, P + 'A3-ort-dreher.png');
    // zurücksetzen
    await page.evaluate(() => window.ZUGANGSPROFIL.setze({ blick: 'innen', niveau: 'original', umfang: 'kern' }));
    // Fuge betreten über die Liste
    await page.click('.paar-knopf:has-text("Wartemodus")'); await warte(page, 900);
    const i = await idx(page);
    log(P + 'A4 Schloss', { z: await zu(page), fokus: await page.evaluate(FOKUS), audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
    await bild(page, P + 'A4-schloss.png');
    // Beleg: Riegel wählen, Stein ziehen mit Maus
    await page.click('.riegel-beleg'); await warte(page, 300);
    const st = page.locator('.versuch .stein.ziehbar').first();
    if (await st.count()) {
      const b = await st.boundingBox(); const r = await page.locator('.riegel-beleg').boundingBox();
      await page.mouse.move(b.x + 20, b.y + 12); await page.mouse.down(); await page.mouse.move(b.x + 40, b.y - 40, { steps: 5 }); await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2, { steps: 12 }); await page.mouse.up(); await warte(page, 400);
    }
    log(P + 'A5 Beleg gezogen', { zaehne: await page.evaluate((i) => window.__schloss.zaehne(i), i) });
    // Grenze: wegschieben, dann auflegen
    await page.click('.riegel-grenze'); await warte(page, 300);
    const weg = page.locator('.versuch .stein-knopf:has-text("wegschieben")');
    const wegZahl = [];
    for (let k = 0; k < 4 && await weg.count(); k++) { wegZahl.push(await page.locator('.versuch .stein-text').first().innerText()); await weg.click(); await warte(page, 200); }
    log(P + 'A6 Grenze wegschieben', { wegZahl: wegZahl.map((x) => x.slice(0, 50)), danach: await page.locator('.versuch').innerText() });
    await bild(page, P + 'A6-grenze-weggeschoben.png');
    // Fundstelle
    if (await page.locator('.versuch .fundstelle').count()) { await page.locator('.versuch .fundstelle').first().click(); await warte(page, 200); }
    await page.locator('.versuch .stein-knopf:has-text("auflegen")').click(); await warte(page, 300);
    // Kontext per eigenem Wort
    await page.click('.riegel-kontext'); await warte(page, 300);
    const kvs = await page.locator('.versuch .stein-knopf:has-text("auflegen")').count();
    await page.fill('.versuch .eigen-feld', 'wenn es um den Start geht'); await page.press('.versuch .eigen-feld', 'Enter'); await warte(page, 700);
    log(P + 'A7 eingerastet?', { kvs, z: (await zu(page)).paare[i], ansage: await page.locator('.ansage').innerText(), wirkung: await page.locator('.wirkung').innerText(), audit: await kurz(page) });
    await bild(page, P + 'A7-eingerastet.png');
    // Entscheidungen
    await page.click('.e-gefasst'); await warte(page, 300);
    const w1 = await page.locator('.wirkung').innerText();
    await page.click('.klein-link:has-text("anders entscheiden")'); await warte(page, 200);
    await page.click('.e-offen'); await warte(page, 300);
    await page.click('.klein-link'); await warte(page, 200);
    await page.click('.e-bestritten'); await warte(page, 500);
    log(P + 'A8 Entscheidungen', { w1: w1.slice(0, 200), nachBestritten: await page.locator('.wirkung').innerText(), z: (await zu(page)).paare[i] });
    await bild(page, P + 'A8-bestritten.png');
    // nach Bestreiten: Kontext abnehmen, neu auflegen → wieder?
    await page.click('.riegel-kontext'); await warte(page, 200);
    await page.locator('.versuch .stein-knopf:has-text("abnehmen")').click(); await warte(page, 300);
    const nachAb = (await zu(page)).paare[i];
    await page.fill('.versuch .eigen-feld', 'bei Müdigkeit'); await page.press('.versuch .eigen-feld', 'Enter'); await warte(page, 500);
    log(P + 'A9 nach Bestreiten neu', { nachAb, danach: (await zu(page)).paare[i], wirkung: (await page.locator('.wirkung').innerText()).slice(0, 300) });
    // Erlöschen: Kontext abnehmen
    await page.locator('.versuch .stein-knopf:has-text("abnehmen")').click(); await warte(page, 800);
    log(P + 'A10 erloschen', { z: (await zu(page)).paare[i], wirkung: (await page.locator('.wirkung').innerText()).slice(0, 300), audit: await kurz(page) });
    await bild(page, P + 'A10-erloschen-kitt.png');
    // Wiederaufnahme
    await page.fill('.versuch .eigen-feld', 'am Morgen'); await page.press('.versuch .eigen-feld', 'Enter'); await warte(page, 600);
    log(P + 'A11 wieder', { z: (await zu(page)).paare[i], wirkung: (await page.locator('.wirkung').innerText()).slice(0, 300) });
    await bild(page, P + 'A11-wieder-eingerastet.png');
    // Lesart drehen
    await page.click('.riegel-lesart'); await warte(page, 200);
    const dreh = await page.locator('.dreh-lesart').count();
    // Wort-Riegel
    await page.click('.riegel-wort'); await warte(page, 300);
    const woerter = await page.locator('.wand .wort').count();
    log(P + 'A12 Lesart/Wort', { dreh, woerter, versuch: await page.locator('.versuch').innerText(), audit: await kurz(page) });
    await bild(page, P + 'A12-wort-riegel.png');
    // zurück ins Feld: Zustand?
    await page.click('.zurueck-feld'); await warte(page, 900);
    const zf = await zu(page);
    log(P + 'A13 zurück im Feld', { wahl: zf.wahl, paar: zf.paare[i], fokus: await page.evaluate(FOKUS), spalte: (await page.locator('.spalte').innerText()).slice(0, 300) });
    await bild(page, P + 'A13-zurueck-feld.png');
    // Naht, Fehlstelle, Regeln
    await page.locator('.spalte-zurueck').click().catch(() => {}); await warte(page, 600);
    const n = await page.evaluate(() => window.__schloss.nahtPunkt(0));
    await page.mouse.click(n.x, n.y); await warte(page, 800);
    log(P + 'A14 Naht', { wahl: (await zu(page)).wahl, spalte: (await page.locator('.spalte').innerText()).slice(0, 200), audit: await kurz(page) });
    await bild(page, P + 'A14-naht.png');
    await page.keyboard.press('Escape'); await warte(page, 600);
    const fehlN = await page.locator('.treffer-fehl').count();
    if (fehlN) { const b = await page.locator('.treffer-fehl').first().boundingBox(); await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2); await warte(page, 800); }
    log(P + 'A15 Fehlstelle', { fehlN, wahl: (await zu(page)).wahl, spalte: (await page.locator('.spalte').innerText()).slice(0, 200) });
    await bild(page, P + 'A15-fehlstelle.png');
    await page.keyboard.press('Escape'); await warte(page, 500);
    await page.click('.regeln-link'); await warte(page, 500);
    log(P + 'A16 Regeln', { audit: await kurz(page) });
    await bild(page, P + 'A16-regeln.png');
    await page.keyboard.press('Escape'); await warte(page, 500);
    // Arm im Feld direkt anklicken
    const ap = await page.evaluate(() => window.__schloss.armPunkt(window.__schloss.paarVon('Delay Aversion', 'Zeitblindheit')));
    await page.mouse.click(ap.x, ap.y); await warte(page, 900);
    log(P + 'A17 Arm im Feld angeklickt', { ansicht: (await zu(page)).ansicht, aktiv: (await zu(page)).aktiv });
    await page.keyboard.press('Escape'); await warte(page, 800);
    // Ton an, Einrasten mit Ton
    await page.click('.ecke-wort:has-text("aus")'); await warte(page, 200);
    await page.click('.paar-knopf').catch(() => {});
    log(P + 'A18 Ende', { fehler, netz, spuren: (await audit(page)).spuren });
    await ctx.close();
  }

  /* ===== B: nur Tastatur 1280×800 ===== */
  if (!NUR || NUR === 'B') {
    const { ctx, page, fehler } = await neu(browser, 1280, 800);
    const tabs = [];
    for (let k = 0; k < 40; k++) { await page.keyboard.press('Tab'); await warte(page, 60); tabs.push(await page.evaluate(FOKUS)); }
    log('B1 Tab-Folge Feld', tabs.map((t) => `${t.el} ${(t.name||"").slice(0, 28)} ring=${t.ring}${t.imBild === false ? ' AUSSERHALB' : ''}${t.stroke ? ' stroke=' + t.stroke : ''}`));
    // Fokus auf Ort, Bild
    await page.evaluate(() => document.querySelector('.treffer-ort').focus());
    await page.keyboard.press('Tab'); await page.keyboard.press('Shift+Tab'); await warte(page, 200);
    await bild(page, 'B1-fokus-ort.png');
    // Zahn per Tastatur: Fokus nach Enter?
    await page.evaluate(() => document.querySelector('.zahn').focus());
    await page.keyboard.press('Enter'); await warte(page, 300);
    log('B2 Zahn Enter → Fokus', { fokus: await page.evaluate(FOKUS), voraus: (await zu(page)).voraus });
    await page.keyboard.press('Escape');
    // Ort per Enter wählen
    await page.evaluate(() => [...document.querySelectorAll('.treffer-ort')].find((e) => e.getAttribute('aria-label').startsWith('Aufgabenstarre')).focus());
    await page.keyboard.press('Enter'); await warte(page, 600);
    log('B3 Ort Enter → Fokus', { fokus: await page.evaluate(FOKUS), wahl: (await zu(page)).wahl });
    const t2 = [];
    for (let k = 0; k < 12; k++) { await page.keyboard.press('Tab'); await warte(page, 40); t2.push(await page.evaluate(FOKUS)); }
    log('B3b Tab nach Ortwahl', t2.map((t) => `${t.el} ${(t.name||"").slice(0, 30)} ring=${t.ring}`));
    // Dreher per Pfeil
    await page.evaluate(() => document.querySelector('.dreher-blick').focus());
    await page.keyboard.press('ArrowRight'); await warte(page, 200);
    log('B4 Dreher Pfeil → Fokus', { fokus: await page.evaluate(FOKUS), blick: await page.evaluate(() => window.ZUGANGSPROFIL.blick) });
    await page.evaluate(() => window.ZUGANGSPROFIL.setze({ blick: 'innen' }));
    // Arm-Liste: Fuge betreten
    await page.evaluate(() => [...document.querySelectorAll('.paar-knopf')].find((e) => e.textContent.includes('Wartemodus')).focus());
    await page.keyboard.press('Enter'); await warte(page, 900);
    log('B5 Schloss per Enter', { ansicht: (await zu(page)).ansicht, fokus: await page.evaluate(FOKUS) });
    const t3 = [];
    for (let k = 0; k < 16; k++) { await page.keyboard.press('Tab'); await warte(page, 40); t3.push(await page.evaluate(FOKUS)); }
    log('B6 Tab im Schloss', t3.map((t) => `${t.el} ${(t.name||"").slice(0, 30)} ring=${t.ring}`));
    // Riegel Beleg per Enter → Fokus?
    await page.evaluate(() => document.querySelector('.riegel-beleg').focus());
    await page.keyboard.press('Enter'); await warte(page, 300);
    log('B7 Riegel Enter → Fokus', { fokus: await page.evaluate(FOKUS), riegel: (await zu(page)).riegel });
    await page.keyboard.press('Tab'); await warte(page, 50);
    log('B7b danach Tab', await page.evaluate(FOKUS));
    // Beleg auflegen per Tastatur
    await page.evaluate(() => [...document.querySelectorAll('.versuch .stein-knopf')].find((b) => b.textContent === 'auflegen').focus());
    await page.keyboard.press('Enter'); await warte(page, 300);
    log('B8 auflegen Enter → Fokus', { fokus: await page.evaluate(FOKUS) });
    await bild(page, 'B8-nach-auflegen-fokus.png');
    // Grenze/Kontext per Tastatur
    await page.evaluate(() => document.querySelector('.riegel-grenze').focus()); await page.keyboard.press('Enter'); await warte(page, 200);
    await page.evaluate(() => [...document.querySelectorAll('.versuch .stein-knopf')].find((b) => b.textContent === 'auflegen').focus()); await page.keyboard.press('Space'); await warte(page, 200);
    await page.evaluate(() => document.querySelector('.riegel-kontext').focus()); await page.keyboard.press('Enter'); await warte(page, 200);
    await page.evaluate(() => document.querySelector('.versuch .eigen-feld').focus());
    await page.keyboard.type('wenn es um den Start geht'); await page.keyboard.press('Enter'); await warte(page, 500);
    log('B9 eingerastet per Tastatur', { z: (await zu(page)).paare[await idx(page)], fokus: await page.evaluate(FOKUS) });
    // Escape im Eingabefeld
    await page.evaluate(() => document.querySelector('.riegel-grenze').focus()); await page.keyboard.press('Enter'); await warte(page, 200);
    await page.evaluate(() => document.querySelector('.versuch .stein-knopf') && document.querySelector('.versuch .stein-knopf').click()); await warte(page, 200);
    const hatFeld = await page.locator('.versuch .eigen-feld').count();
    if (hatFeld) { await page.focus('.versuch .eigen-feld'); await page.keyboard.type('halb getippt'); await page.keyboard.press('Escape'); await warte(page, 700); }
    log('B10 Escape im Eingabefeld', { hatFeld, ansicht: (await zu(page)).ansicht });
    if ((await zu(page)).ansicht === 'schloss') { await page.keyboard.press('Escape'); await warte(page, 800); }
    log('B11 zurück per Escape → Fokus', { ansicht: (await zu(page)).ansicht, wahl: (await zu(page)).wahl, fokus: await page.evaluate(FOKUS) });
    await page.keyboard.press('Tab'); await warte(page, 50);
    log('B11b nächster Tab', await page.evaluate(FOKUS));
    // Ecke per Tastatur
    await page.evaluate(() => document.querySelector('.ecke-wort').focus()); await page.keyboard.press('Enter'); await warte(page, 200);
    log('B12 Ecke Enter → Fokus', { fokus: await page.evaluate(FOKUS), reiz: await page.evaluate(() => window.ZUGANGSPROFIL.reiz) });
    // Naht und Fehlstelle per Tastatur
    await page.evaluate(() => document.querySelector('.treffer-naht').focus()); await page.keyboard.press('Enter'); await warte(page, 500);
    log('B13 Naht Enter', { wahl: (await zu(page)).wahl, fokus: await page.evaluate(FOKUS) });
    await bild(page, 'B13-naht-tastatur.png');
    await page.keyboard.press('Escape'); await warte(page, 400);
    await page.evaluate(() => document.querySelector('.treffer-fehl') && document.querySelector('.treffer-fehl').focus()); await page.keyboard.press('Enter'); await warte(page, 500);
    log('B14 Fehl Enter', { wahl: (await zu(page)).wahl, fokus: await page.evaluate(FOKUS) });
    // Wort-Riegel per Tastatur, Paar mit Übersetzung (kein gemeinsames Wort)
    log('B Ende', { fehler, audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
    await ctx.close();
  }

  /* ===== C: Berührung 390×844 ===== */
  if (!NUR || NUR === 'C') {
    const { ctx, page, fehler, netz } = await neu(browser, 390, 844, { hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const cdp = await ctx.newCDPSession(page);
    const tipp = async (x, y) => { await page.touchscreen.tap(x, y); await warte(page, 700); };
    const zieh = async (x0, y0, x1, y1) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
      for (let s = 1; s <= 14; s++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + ((x1 - x0) * s) / 14, y: y0 + ((y1 - y0) * s) / 14 }] }); await warte(page, 16); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await warte(page, 400);
    };
    log('C0 390 start', { audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
    await bild(page, 'C0-390-start.png');
    await page.screenshot({ path: path.join(HIER, 'C0b-390-start-ganz.png'), fullPage: true });
    const pt = await page.evaluate(() => window.__schloss.ortPunkt('Aufgabenstarre'));
    await tipp(pt.x, pt.y);
    log('C1 Ort getippt', { wahl: (await zu(page)).wahl, audit: await kurz(page) });
    await bild(page, 'C1-390-ort.png');
    await page.screenshot({ path: path.join(HIER, 'C1b-390-ort-ganz.png'), fullPage: true });
    const k = page.locator('.paar-knopf:has-text("Wartemodus")');
    await k.scrollIntoViewIfNeeded(); const kb = await k.boundingBox();
    await tipp(kb.x + 30, kb.y + kb.height / 2);
    log('C2 Schloss', { ansicht: (await zu(page)).ansicht, audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
    await bild(page, 'C2-390-schloss.png');
    await page.screenshot({ path: path.join(HIER, 'C2b-390-schloss-ganz.png'), fullPage: true });
    // Beleg-Riegel antippen, Stein mit Finger ziehen
    const rb = page.locator('.riegel-beleg'); await rb.scrollIntoViewIfNeeded(); const rbb = await rb.boundingBox(); await tipp(rbb.x + rbb.width / 2, rbb.y + rbb.height / 2);
    const st = page.locator('.versuch .stein.ziehbar').first();
    await st.scrollIntoViewIfNeeded();
    const sb = await st.boundingBox(); const rr = await page.locator('.riegel-beleg').boundingBox();
    const scrollVor = await page.evaluate(() => [scrollY, document.querySelector('.schloss-ansicht').scrollTop]);
    log('C3 vor Ziehen', { stein: sb, riegel: rr, riegelImBild: rr && rr.y > 0 && rr.y < 844, touchAction: await st.evaluate((e) => getComputedStyle(e).touchAction) });
    await zieh(sb.x + 20, sb.y + 14, rr.x + rr.width / 2, Math.max(5, rr.y + rr.height / 2));
    const i = await idx(page);
    const scrollNach = await page.evaluate(() => [scrollY, document.querySelector('.schloss-ansicht').scrollTop]);
    log('C4 nach Fingerziehen', { zaehne: await page.evaluate((i) => window.__schloss.zaehne(i), i), scrollVor, scrollNach });
    await bild(page, 'C4-390-nach-ziehen.png');
    // Ziehen, wenn Riegel im Bild ist: nach oben scrollen, sodass beide sichtbar
    if (!(await page.evaluate((i) => window.__schloss.zaehne(i).beleg, i))) {
      await page.evaluate(() => { const r = document.querySelector('.riegel-beleg'); r.scrollIntoView({ block: 'start' }); });
      await warte(page, 200);
      const sb2 = await page.locator('.versuch .stein.ziehbar').first().boundingBox(); const rr2 = await page.locator('.riegel-beleg').boundingBox();
      log('C4b Lage', { sb2, rr2 });
      if (sb2 && sb2.y < 844) { await zieh(sb2.x + 20, sb2.y + 14, rr2.x + rr2.width / 2, rr2.y + rr2.height / 2); }
      log('C4c nach zweitem Ziehen', { zaehne: await page.evaluate((i) => window.__schloss.zaehne(i), i) });
    }
    // Grenze und Kontext tippend
    for (const r of ['grenze', 'kontext']) {
      const l = page.locator(`.riegel-${r}`); await l.scrollIntoViewIfNeeded(); const b = await l.boundingBox(); await tipp(b.x + b.width / 2, b.y + b.height / 2);
      const a = page.locator('.versuch .stein-knopf:has-text("auflegen")');
      if (await a.count()) { await a.scrollIntoViewIfNeeded(); const ab = await a.boundingBox(); await tipp(ab.x + ab.width / 2, ab.y + ab.height / 2); }
    }
    log('C5 nach Tippen', { z: (await zu(page)).paare[i], zaehne: await page.evaluate((i) => window.__schloss.zaehne(i), i), audit: await kurz(page) });
    await page.screenshot({ path: path.join(HIER, 'C5-390-schloss-ganz.png'), fullPage: true });
    const e = page.locator('.e-gefasst');
    if (await e.count()) { await e.scrollIntoViewIfNeeded(); const eb = await e.boundingBox(); await tipp(eb.x + eb.width / 2, eb.y + eb.height / 2); }
    // zurück
    const zr = page.locator('.zurueck-feld'); await zr.scrollIntoViewIfNeeded(); const zb = await zr.boundingBox(); await tipp(zb.x + zb.width / 2, zb.y + zb.height / 2);
    log('C6 zurück', { z: await zu(page), audit: await kurz(page) });
    await bild(page, 'C6-390-zurueck.png');
    // Naht antippen, Zahn antippen
    const n = await page.evaluate(() => window.__schloss.nahtPunkt(0));
    if (n.y > 0 && n.y < 844) await tipp(n.x, n.y);
    log('C7 Naht getippt', { wahl: (await zu(page)).wahl, n });
    log('C Ende', { fehler, netz, ziele: await page.evaluate(ZIELE) });
    await ctx.close();
  }

  /* ===== D: reduzierte Bewegung 1280×800 ===== */
  if (!NUR || NUR === 'D') {
    const { ctx, page, fehler } = await neu(browser, 1280, 800, { reducedMotion: 'reduce' });
    const lauf = () => page.evaluate(() => ({ anim: document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.constructor.name), ruhe: window.__schloss.ruhe(), reiz: window.ZUGANGSPROFIL.reiz }));
    await warte(page, 500);
    log('D1 Feld still?', await lauf());
    const pt = await page.evaluate(() => window.__schloss.ortPunkt('Aufgabenstarre'));
    await page.mouse.click(pt.x, pt.y); await warte(page, 300);
    log('D2 nach Klick', await lauf());
    await page.click('.paar-knopf:has-text("Wartemodus")'); await warte(page, 300);
    await warte(page, 500);
    log('D3 Schloss still?', { ...(await lauf()), ansicht: (await zu(page)).ansicht });
    // Ruhig-Schalter auf lebendig trotz Systemwunsch?
    await page.click('.ecke-wort:has-text("ruhig")'); await warte(page, 300);
    log('D4 Bewegung lebendig geklickt', { ...(await lauf()), knopf: await page.locator('.ecke-wort').first().innerText() });
    await bild(page, 'D4-reduziert-lebendig-geklickt.png');
    log('D Ende', { fehler });
    await ctx.close();
  }

  /* ===== E: 1280 und 1440, Schrift groß, Ton ===== */
  if (!NUR || NUR === 'E') {
    for (const [w, h] of [[1280, 800], [1440, 900]]) {
      for (const gross of [false, true]) {
        const { ctx, page, fehler, netz } = await neu(browser, w, h);
        if (gross) { await page.click('.ecke-wort:has-text("normal")'); await warte(page, 600); }
        const tag = `${w}${gross ? '-gross' : ''}`;
        log(`E ${tag} feld`, { audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
        await bild(page, `E-${tag}-feld.png`);
        const pt = await page.evaluate(() => window.__schloss.ortPunkt('Delay Aversion'));
        await page.mouse.click(pt.x, pt.y); await warte(page, 900);
        log(`E ${tag} ort`, { audit: await kurz(page) });
        await bild(page, `E-${tag}-ort.png`);
        await page.click('.paar-knopf >> nth=0'); await warte(page, 900);
        await page.click('.riegel-wort'); await warte(page, 300);
        log(`E ${tag} schloss wort`, { audit: await kurz(page), ziele: await page.evaluate(ZIELE) });
        await bild(page, `E-${tag}-schloss.png`);
        await page.screenshot({ path: path.join(HIER, `E-${tag}-schloss-ganz.png`), fullPage: true });
        if (!gross && w === 1440) {
          // Ton an: Einrasten mit Klang, keine Fehler
          await page.click('.ecke-wort:has-text("aus")'); await warte(page, 200);
          const sp0 = (await audit(page)).spuren.audio;
          const i = await page.evaluate(() => window.__schloss.zustand().aktiv);
          for (const r of ['beleg', 'grenze']) { await page.click(`.riegel-${r}`); await warte(page, 150); const a = page.locator('.versuch .stein-knopf:has-text("auflegen")'); if (await a.count()) { await a.click(); await warte(page, 150); } }
          await page.click('.riegel-kontext'); await page.fill('.versuch .eigen-feld', 'bei Stress'); await page.press('.versuch .eigen-feld', 'Enter'); await warte(page, 600);
          log('E Ton', { audioVorher: sp0, audioNachher: (await audit(page)).spuren.audio, z: (await zu(page)).paare[i], zaehne: await page.evaluate((i) => window.__schloss.zaehne(i), i), fehler });
        }
        log(`E ${tag} ende`, { fehler, netz });
        await ctx.close();
      }
    }
  }
  fs.writeFileSync(path.join(HIER, `${P}protokoll${NUR ? '-' + NUR : ''}.json`), JSON.stringify(LOG, null, 1));
  await browser.close();
})().catch((e) => { console.error('ABBRUCH', e); process.exit(1); });
