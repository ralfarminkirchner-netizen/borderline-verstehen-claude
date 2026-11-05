// Bedienprüfung der dritten Fassung (Schloss · Feld · Spur · Zugang). Ändert an der Probe nichts.
// Aufruf: node bilder/pruefung2-bedienung/bedienpruefung.cjs  – schreibt nur in diesen Ordner.
const path = require('node:path');
const fs = require('node:fs');
const http = require('node:http');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');

const AUS = __dirname;
const PROBE = path.resolve(AUS, '..', '..');
const SEITE = 'file://' + path.join(PROBE, 'index.html');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const P = {};
const log = (k, v) => { P[k] = v; console.log('■', k, JSON.stringify(v).slice(0, 600)); };
const warte = (p, ms) => p.waitForTimeout(ms);
const bild = (p, n) => p.screenshot({ path: path.join(AUS, n) });
const ansicht = (p) => p.evaluate(() => window.__schloss.ansicht());
const zustand = (p) => p.evaluate(() => window.__schloss.zustand());

// Instrumentierung: Speicher, URL, Klang
const INIT = () => {
  window.__spuren = { speicher: [], url: [], audio: 0 };
  for (const s of ['localStorage', 'sessionStorage']) {
    try {
      const st = window[s];
      for (const m of ['setItem', 'removeItem', 'clear']) {
        const o = st[m].bind(st);
        Object.defineProperty(st, m, { value: (...a) => { window.__spuren.speicher.push(`${s}.${m}(${a[0] || ''})`); return o(...a); } });
      }
    } catch (_) { /* egal */ }
  }
  for (const m of ['pushState', 'replaceState']) {
    const o = history[m].bind(history);
    history[m] = (...a) => { window.__spuren.url.push(`${m} ${a[2]}`); return o(...a); };
  }
  window.addEventListener('hashchange', () => window.__spuren.url.push('hash ' + location.hash));
  const AC = window.AudioContext;
  if (AC) window.AudioContext = class extends AC { constructor(...a) { super(...a); window.__spuren.audio++; } };
  if (window.indexedDB) { const o = indexedDB.open.bind(indexedDB); indexedDB.open = (...a) => { window.__spuren.speicher.push('indexedDB.open ' + a[0]); return o(...a); }; }
  const cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  Object.defineProperty(document, 'cookie', { get() { return cookie.get.call(document); }, set(v) { window.__spuren.speicher.push('cookie'); cookie.set.call(document, v); } });
};

// Prüfung am sichtbaren Zustand: kleine Schrift, Kennungen, Überlappungen, Überlauf
const AUDIT = () => {
  const D = window.SCHLOSS_DATEN;
  const tech = new Set();
  (function w(x, k, tief) {
    if (x && typeof x === 'object') { for (const [kk, v] of Object.entries(x)) w(v, kk, tief || kk === 'technisch' || kk === 'herkunft'); }
    else if (typeof x === 'string' && x.length >= 5 && /[_:0-9]/.test(x) && !/\s/.test(x) && (tief || /^(id|typ|status|art|geltung)$/.test(k || ''))) tech.add(x);
  })(D.orte); (function w(x, k, tief) {
    if (x && typeof x === 'object') { for (const [kk, v] of Object.entries(x)) w(v, kk, tief || kk === 'technisch'); }
    else if (typeof x === 'string' && x.length >= 5 && /[_:0-9]/.test(x) && !/\s/.test(x) && (tief || /^(id|typ|status|art|geltung)$/.test(k || ''))) tech.add(x);
  })(D.paare);
  const muster = /\b[0-9a-f]{10,}\b|[0-9a-f]{8}-[0-9a-f]{4}-|\b[a-z]+(?:-[a-z]+)*-source:|\bpmid\b|\bdoi\b|pmcid|sha256|\b[a-z]+_[a-z]+(?:_[a-z]+)*\b|undefined|\[object|\{[a-z]+\}/i;
  const sicht = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    if (r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const c = getComputedStyle(e);
      if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < 0.08 || e.hidden) return false;
      if (e.tagName === 'DETAILS' && !e.open && !el.closest('summary')) return false;
    }
    return true;
  };
  const name = (el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') || '').split(' ').filter(Boolean).slice(0, 2).join('.')}`;
  const klein = [], kennung = [], textEls = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const t = n.textContent.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || el.closest('script,style') || !sicht(el)) continue;
    let fs = parseFloat(getComputedStyle(el).fontSize);
    if (el.closest('svg')) { const svg = el.closest('svg'); const m = svg.getScreenCTM && el.getScreenCTM ? el.getScreenCTM() : null; if (m) fs *= Math.hypot(m.a, m.b); }
    if (fs < 11.95) klein.push(`${fs.toFixed(1)}px ${name(el)}: ${t.slice(0, 40)}`);
    if (muster.test(t) || /\bNaN\b/.test(t) || [...tech].some((x) => t.includes(x))) kennung.push(`text ${name(el)}: ${t.slice(0, 90)}`);
    textEls.push(el);
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[alt],[aria-valuetext],[aria-description]')) {
    for (const a of ['aria-label', 'title', 'alt', 'aria-valuetext', 'aria-description']) {
      const v = el.getAttribute(a);
      if (v && (muster.test(v) || [...tech].some((x) => v.includes(x)))) kennung.push(`${a} ${name(el)}: ${v.slice(0, 90)}`);
    }
  }
  // Überlappung sichtbarer Textblöcke (Blattelemente mit eigenem Text)
  const blaetter = [...new Set(textEls)].filter((el) => ![...el.children].some((c) => textEls.includes(c)));
  const rs = blaetter.map((el) => ({ el, r: el.getBoundingClientRect() })).filter((x) => x.r.width > 2 && x.r.height > 2);
  const ueber = [];
  for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
    const a = rs[i], b = rs[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
    const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (w <= 2 || h <= 2) continue;
    const fl = w * h, kl = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
    if (fl / kl < 0.18) continue;
    ueber.push(`${name(a.el)} „${a.el.textContent.trim().slice(0, 24)}“ × ${name(b.el)} „${b.el.textContent.trim().slice(0, 24)}“ (${Math.round((100 * fl) / kl)}% des kleineren)`);
  }
  const ausserhalb = blaetter.filter((el) => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).map((el) => `${name(el)}: ${el.textContent.trim().slice(0, 30)}`);
  const ae = document.activeElement;
  return {
    klein: [...new Set(klein)].slice(0, 25), kleinAnzahl: new Set(klein).size,
    kennung: [...new Set(kennung)].slice(0, 25),
    ueberlappung: ueber.slice(0, 30), ueberlappungAnzahl: ueber.length,
    ausserhalb: ausserhalb.slice(0, 15),
    querScroll: document.documentElement.scrollWidth > innerWidth + 1,
    fokus: ae ? `${name(ae)} ${ae.getAttribute('aria-label') ? '[' + ae.getAttribute('aria-label').slice(0, 60) + ']' : ''} sichtbar=${sicht(ae)}` : null,
    spuren: window.__spuren, url: location.href.replace(/^.*\//, ''),
  };
};

async function neu(browser, w, h, extra = {}, url = SEITE) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...extra });
  await ctx.addInitScript(INIT);
  const page = await ctx.newPage();
  const fehler = [], netz = [];
  const herkunft = url.replace(/[^/]*$/, '');
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) fehler.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => fehler.push('pageerror: ' + e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('data:') && !u.startsWith(herkunft)) netz.push(u); });
  page.on('requestfailed', (r) => fehler.push('requestfailed: ' + r.url()));
  await page.goto(url);
  await warte(page, 900);
  return { ctx, page, fehler, netz };
}
const audit = (p) => p.evaluate(AUDIT);
async function zgAuf(p) { if (await p.locator('.zugang-flaeche').isHidden()) { await p.click('.zugang-knopf'); await warte(p, 300); } }
async function zgZu(p) { if (await p.locator('.zugang-flaeche').isVisible()) { await p.click('.zugang-knopf'); await warte(p, 300); } }
// sichtbare Texte nach Bereich, um Profilwirkung zu messen
const TEXTE = () => {
  const t = (s) => [...document.querySelectorAll(s)].map((e) => e.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' | ');
  return {
    kopf: t('.kopf'), schlossOrt: t('.ort-schloss'), schluesselOrt: t('.ort-schluessel'), zaehne: t('.zahn'), marken: t('.naht-marke'),
    status: t('.spalt-kopf, .zahn-feld'), regeln: [...document.querySelectorAll('.regeln [data-t], .regeln [data-feldregel]')].map((e) => e.textContent.trim()).join(' | '),
    feldLesen: t('.feld-lesen'), feldVoraus: t('.feld-voraus'), feldNamen: t('.f-name'), spur: t('.spur-liste'), ansage: t('.ansage'), bund: t('.bund-titel, .bund-name'),
    ariaZahn: [...document.querySelectorAll('.zahn')].map((e) => e.getAttribute('aria-label') || '').join(' | ').slice(0, 300),
  };
};
const diff = (a, b) => Object.fromEntries(Object.keys(a).map((k) => [k, a[k] === b[k] ? (a[k] ? 'GLEICH' : 'leer') : 'anders']));

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });

  /* ======== A: Maus, 1440 × 900, file:// ======== */
  {
    const { ctx, page, fehler, netz } = await neu(browser, 1440, 900);
    log('A0 start', { ansicht: await ansicht(page), audit: await audit(page) });
    // Feld per Griff, Ort wählen, Voraussetzung wählen
    await page.click('.griff-name >> text=Feld'); await warte(page, 1500);
    await page.click('.f-zeichen-knopf[aria-label^="Zeitblindheit,"]'); await warte(page, 400);
    await page.click('.f-zahn-wort'); await warte(page, 600);
    const a1 = await ansicht(page);
    log('A1 feld gewählt', { feldWahl: a1.feldWahl, voraus: a1.voraus, licht: a1.licht, audit: await audit(page) });
    await bild(page, 'A1-feld-zeitblindheit-wort.png');
    await page.click('.griff-name >> text=Spur'); await warte(page, 1200);
    log('A2 spur', { a: await ansicht(page), audit: await audit(page) });
    await bild(page, 'A2-spur.png');
    await page.click('.griff-name >> text=Feld'); await warte(page, 1200);
    const a3 = await ansicht(page);
    log('A3 zurück im Feld', { feldWahl: a3.feldWahl, voraus: a3.voraus, erhalten: a3.feldWahl === a1.feldWahl && a3.voraus === a1.voraus });
    // Feld → Schloss → Feld: bleibt die Feldauswahl?
    await page.click('.griff-name >> text=Schloss'); await warte(page, 1700);
    const a4 = await ansicht(page);
    await page.click('.griff-name >> text=Feld'); await warte(page, 1700);
    const a5 = await ansicht(page);
    log('A4 Feld→Schloss→Feld', { imSchloss: `${a4.schloss} – ${a4.schluessel}`, feldWahlVorher: a1.feldWahl, feldWahlNachher: a5.feldWahl, vorausNachher: a5.voraus });
    // Plus im Feld mit gewähltem Ort: was wird betreten?
    await page.click('.f-zeichen-knopf[aria-label^="Zeitblindheit,"]'); await warte(page, 400);
    await page.mouse.move(1430, 890);
    await page.keyboard.press('+'); await warte(page, 1700);
    const a6 = await ansicht(page);
    log('A5 Plus mit Wahl Zeitblindheit', { betreten: `${a6.schloss} – ${a6.schluessel}` });

    // Profilwirkung: Schloss
    const s0 = await page.evaluate(TEXTE);
    const z0 = await zustand(page);
    await zgAuf(page);
    await page.click('.zg-bahn >> nth=0 >> .zg-name >> text=einfach'); await warte(page, 400);
    await bild(page, 'A6-zugang-einfach.png');
    log('A6 zugang offen', { audit: await audit(page) });
    await zgZu(page); await page.mouse.move(700, 890); await warte(page, 500);
    const s1 = await page.evaluate(TEXTE);
    const z1 = await zustand(page);
    await page.click('.regeln > summary'); await warte(page, 400);
    const s1r = await page.evaluate(TEXTE);
    await bild(page, 'A7-schloss-einfach-regeln.png');
    log('A7 einfach im Schloss', { wirkung: diff(s0, s1), regelnOffenAnders: s1r.regeln !== s0.regeln, zaehneOriginal: z0.zaehne, zaehneEinfach: z1.zaehne, lesart: [z0.lesart, z1.lesart], beispielZahn: [s0.zaehne.slice(0, 160), s1.zaehne.slice(0, 160)], beispielStatus: [s0.status.slice(0, 160), s1.status.slice(0, 160)], audit: await audit(page) });
    await page.click('.regeln > summary'); await warte(page, 300);
    // Wort-Modus unter einfach: Original-Kurztexte?
    await page.click('.zahn-wort .zahn-wert'); await warte(page, 700);
    const sw = await page.evaluate(TEXTE);
    log('A8 Wortmodus einfach', { schlossOrt: sw.schlossOrt.slice(0, 200), gleichWieOriginal: sw.schlossOrt === s0.schlossOrt });
    await page.keyboard.press('Escape'); await warte(page, 400);
    // Feld unter einfach
    await page.keyboard.press('-'); await warte(page, 1700);
    await page.click('.f-zahn-wort'); await warte(page, 500);
    const f1 = await page.evaluate(TEXTE);
    await bild(page, 'A9-feld-einfach.png');
    await zgAuf(page); await page.click('.zg-bahn >> nth=0 >> .zg-name >> text=fachlich'); await zgZu(page); await warte(page, 400);
    const f0 = await page.evaluate(TEXTE);
    log('A9 einfach im Feld', { wirkung: diff(f0, f1), lesen: [f0.feldLesen.slice(0, 200), f1.feldLesen.slice(0, 200)], voraus: [f0.feldVoraus.slice(0, 150), f1.feldVoraus.slice(0, 150)], audit: await audit(page) });
    // Umfang kern/ganz im Feld
    await zgAuf(page); await page.focus('.zg-kante'); await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await zgZu(page); await warte(page, 400);
    const fg = await page.evaluate(TEXTE);
    log('A10 Umfang ganz im Feld', { lesenAnders: fg.feldLesen !== f0.feldLesen, laengeKern: f0.feldLesen.length, laengeGanz: fg.feldLesen.length, audit: await audit(page) });
    await bild(page, 'A10-feld-ganz.png');
    // Ton: Standard aus, einschalten, Klang auslösen
    const tonStart = (await ansicht(page)).profil.ton;
    const audioVorher = (await audit(page)).spuren.audio;
    await zgAuf(page); await page.click('.zg-ton'); await warte(page, 300); await page.click('.zg-muster >> text=Lebendig'); await warte(page, 400); await zgZu(page);
    await page.click('.griff-name >> text=Schloss'); await warte(page, 1700);
    const k = await page.locator('.ort-schluessel .ort-name').boundingBox();
    await page.mouse.move(k.x + 20, k.y + 10); await page.mouse.down(); await page.mouse.move(k.x - 300, k.y + 10, { steps: 25 }); await page.mouse.up(); await warte(page, 2000);
    log('A11 Ton', { tonStart, audioVorher, audioNachher: (await audit(page)).spuren.audio, profil: (await ansicht(page)).profil, zustand: await zustand(page), fehler: fehler.slice() });
    await zgAuf(page); await page.click('.zg-ton'); await zgZu(page);
    // Schrift groß, alle Ansichten
    await zgAuf(page); await page.click('.zg-schrift'); await zgZu(page); await warte(page, 500);
    log('A12 groß Schloss', { audit: await audit(page) }); await bild(page, 'A12-gross-schloss.png');
    await page.keyboard.press('-'); await warte(page, 1700);
    log('A12 groß Feld', { audit: await audit(page) }); await bild(page, 'A12-gross-feld.png');
    await page.keyboard.press('-'); await warte(page, 1200);
    log('A12 groß Spur', { audit: await audit(page) }); await bild(page, 'A12-gross-spur.png');
    log('A Ende', { fehler, netz, audit: await audit(page) });
    await ctx.close();
  }

  /* ======== B: nur Tastatur ======== */
  {
    const { ctx, page, fehler } = await neu(browser, 1440, 900);
    const halt = async (n) => {
      const out = [];
      for (let i = 0; i < n; i++) {
        await page.keyboard.press('Tab');
        out.push(await page.evaluate(() => {
          const e = document.activeElement;
          const r = e.getBoundingClientRect();
          let sicht = r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight;
          for (let x = e; x && x.nodeType === 1; x = x.parentElement) { const c = getComputedStyle(x); if (c.visibility === 'hidden' || c.display === 'none' || parseFloat(c.opacity) < 0.08) sicht = false; }
          const cs = getComputedStyle(e);
          const ring = cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 || cs.boxShadow !== 'none' || cs.textDecorationLine !== 'none';
          return `${e.tagName.toLowerCase()}.${String(e.getAttribute('class') || '').split(' ')[0]}${e.getAttribute('aria-label') ? ' [' + e.getAttribute('aria-label').slice(0, 40) + ']' : ' „' + (e.innerText || '').trim().slice(0, 25) + '“'}${sicht ? '' : ' UNSICHTBAR'}${ring ? '' : ' (kein Ring?)'}`;
        }));
      }
      return out;
    };
    log('B1 Tab im Schloss', await halt(30));
    await bild(page, 'B1-tab-schloss.png');
    // zum Griff tabben
    await page.focus('body');
    let n = 0;
    for (; n < 80; n++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => document.activeElement.classList.contains('griff-schiene'))) break; }
    log('B2 Tabs bis Griff', n + 1);
    await page.keyboard.press('ArrowRight'); await warte(page, 1600);
    const b3 = await ansicht(page);
    const f3 = await page.evaluate(() => `${document.activeElement.className} ${document.activeElement.getAttribute('aria-label') || ''}`);
    log('B3 Pfeil → Feld', { ansicht: b3.ansicht, fokus: f3 });
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await warte(page, 400);
    const f4 = await page.evaluate(() => document.activeElement.getAttribute('aria-label'));
    await page.keyboard.press('Enter'); await warte(page, 400);
    const b4 = await ansicht(page);
    log('B4 Pfeile im Feld + Enter', { fokus: f4, feldWahl: b4.feldWahl });
    log('B5 Tab im Feld', await halt(30));
    await bild(page, 'B5-tab-feld.png');
    // Voraussetzung per Tastatur
    await page.focus('.f-zahn-grenze'); await page.keyboard.press('Enter'); await warte(page, 400);
    const vEnter = (await ansicht(page)).voraus;
    await page.keyboard.press('Space'); await warte(page, 400);
    const vSpace = (await ansicht(page)).voraus;
    log('B6 Voraussetzung per Tastatur', { nachEnter: vEnter, nachLeertaste: vSpace });
    // Escape-Kette im Feld
    await page.focus('.f-zahn-wort'); await page.keyboard.press('Enter'); await warte(page, 300);
    const e0 = await ansicht(page);
    await page.keyboard.press('Escape'); const e1 = await ansicht(page);
    await page.keyboard.press('Escape'); const e2 = await ansicht(page);
    await page.keyboard.press('Escape'); const e3 = await ansicht(page);
    const fe = await page.evaluate(() => `${document.activeElement.tagName} ${document.activeElement.className}`);
    log('B7 Escape im Feld', { start: [e0.voraus, e0.feldWahl], eins: [e1.voraus, e1.feldWahl], zwei: [e2.voraus, e2.feldWahl], drei: [e3.ansicht, e3.voraus, e3.feldWahl], fokusDanach: fe });
    // Spur per Taste und zurück, Fokus
    await page.keyboard.press('-'); await warte(page, 1200);
    const sp = await ansicht(page);
    const fsp = await page.evaluate(() => `${document.activeElement.className} ${(document.activeElement.getAttribute('aria-label') || '').slice(0, 60)}`);
    log('B8 Spur per Minus', { ansicht: sp.ansicht, fokus: fsp, tab: await halt(8) });
    await page.keyboard.press('Escape'); await warte(page, 1200);
    log('B9 Escape in Spur', (await ansicht(page)).ansicht);
    // Plus betritt, Fokus im Schloss
    await page.keyboard.press('+'); await warte(page, 1700);
    const fs1 = await page.evaluate(() => `${document.activeElement.className}`);
    log('B10 Plus → Schloss', { ansicht: (await ansicht(page)).ansicht, fokus: fs1, tab: await halt(12) });
    // Zugang per Tastatur, Fokus kehrt zurück?
    await page.focus('.zugang-knopf'); await page.keyboard.press('Enter'); await warte(page, 300);
    const zf = await page.evaluate(() => document.activeElement.className);
    const zt = await halt(14);
    await page.keyboard.press('Escape'); await warte(page, 300);
    const zfz = await page.evaluate(() => document.activeElement.className);
    log('B11 Zugang Tastatur', { fokusBeimOeffnen: zf, tabs: zt, fokusNachEscape: zfz, offen: await page.locator('.zugang-flaeche').isVisible() });
    // Muster per Leertaste und Schrift per Enter
    await page.focus('.zugang-knopf'); await page.keyboard.press('Enter'); await warte(page, 300);
    await page.keyboard.press('Space'); await warte(page, 300);
    const m1 = (await ansicht(page)).profil;
    await page.focus('.zg-bahn >> nth=1 >> .zg-schiene'); await page.keyboard.press('End'); const m2 = (await ansicht(page)).profil.reiz;
    await page.keyboard.press('Home'); const m3 = (await ansicht(page)).profil.reiz;
    await page.focus('.zg-kante'); await page.keyboard.press('ArrowDown'); const m4 = (await ansicht(page)).profil.umfang;
    log('B12 Zugang Bedienung', { nachLeertasteErstesMuster: m1, endeReiz: m2, homeReiz: m3, kanteRunter: m4 });
    await bild(page, 'B12-zugang-tastatur.png');
    await page.keyboard.press('Escape');
    // Regeln mit Tastatur
    await page.focus('.regeln > summary'); await page.keyboard.press('Enter'); await warte(page, 300);
    log('B13 Regeln Enter', { offen: await page.evaluate(() => document.querySelector('.regeln').open), audit: await audit(page) });
    await bild(page, 'B13-regeln-offen.png');
    await page.keyboard.press('Escape');
    log('B Ende', { fehler, audit: await audit(page) });
    await ctx.close();
  }

  /* ======== G: Spur mit Änderung, Tastatur ======== */
  {
    const { ctx, page, fehler } = await neu(browser, 1440, 900);
    await page.focus('.zahn-grenze'); await page.keyboard.press('Enter'); await warte(page, 700);
    const fokusG = await page.evaluate(() => `${document.activeElement.tagName} ${document.activeElement.className}`);
    await page.keyboard.type('es um den Anfang geht', { delay: 15 }); await page.keyboard.press('Enter'); await warte(page, 900);
    const zg1 = await zustand(page);
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
    await page.keyboard.press('-'); await warte(page, 1700);
    const vor = await ansicht(page);
    await page.keyboard.press('-'); await warte(page, 1200);
    const sp = await ansicht(page);
    const fokus = await page.evaluate(() => `${document.activeElement.className} ${(document.activeElement.getAttribute('aria-label') || '').slice(0, 90)}`);
    await bild(page, 'G1-spur-mit-aenderung.png');
    const au = await audit(page);
    await page.keyboard.press('Enter'); await warte(page, 1700);
    const nach = await ansicht(page);
    // Schritt in Feld ruhig + Wahl erhalten nach Zugangwechsel?
    await page.keyboard.press('-'); await warte(page, 1700);
    await page.click('.f-zeichen-knopf[aria-label^="Delay Aversion,"]'); await page.click('.f-zahn-beleg'); await warte(page, 300);
    await page.evaluate(() => window.ZUGANGSPROFIL.setze({ niveau: 'einfach', umfang: 'ganz', schrift: 'gross', reiz: 'ruhig' })); await warte(page, 500);
    const nachProfil = await ansicht(page);
    // Lesespalte: eine Fuge per Enter betreten
    await page.focus('.f-lesen-fuge'); 
    const lf = await page.evaluate(() => document.activeElement.innerText.replace(/\s+/g, ' '));
    const lfStil = await page.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return { bg: c.backgroundColor, outline: c.outlineStyle, shadow: c.boxShadow, elternBg: getComputedStyle(e.closest('.feld-lesen')).backgroundColor }; });
    await bild(page, 'G2-lesespalte-fokus.png');
    await page.keyboard.press('Enter'); await warte(page, 600);
    const lfNach = await ansicht(page);
    log('G Spur/Tastatur', { fokusNachGrenzeEnter: fokusG, verlauf: zg1.verlauf, grenzeGreift: zg1.zaehne.grenze, vorSpur: vor.ansicht, spur: sp.ansicht, fokusInSpur: fokus, nachEnter: `${nach.ansicht}: ${nach.schloss} – ${nach.schluessel}`, wahlNachProfil: [nachProfil.feldWahl, nachProfil.voraus], lesespalteFokus: lf, lesespalteStil: lfStil, nachLesespalteEnter: `${lfNach.ansicht}: ${lfNach.schloss} – ${lfNach.schluessel}`, audit: au, fehler });
    await ctx.close();
  }

  /* ======== C: Berührung 390 × 844 ======== */
  {
    const { ctx, page, fehler, netz } = await neu(browser, 390, 844, { hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    log('C0 390 Schloss', { audit: await audit(page) });
    await bild(page, 'C0-390-schloss.png');
    await page.tap('.griff-name >> text=Feld'); await warte(page, 1500);
    log('C1 390 Feld', { a: await ansicht(page), audit: await audit(page) });
    await bild(page, 'C1-390-feld.png');
    const zb = await page.evaluate(() => window.__schloss.feldPunkt('Zeitblindheit'));
    await page.touchscreen.tap(zb.x, zb.y); await warte(page, 500);
    const c2 = await ansicht(page);
    await page.tap('.f-zahn-grenze'); await warte(page, 500);
    log('C2 390 Ort antippen', { feldWahl: c2.feldWahl, voraus: (await ansicht(page)).voraus, audit: await audit(page) });
    await bild(page, 'C2-390-feld-wahl.png');
    await page.tap('.griff-name >> text=Spur'); await warte(page, 1000);
    await page.tap('.griff-name >> text=Feld'); await warte(page, 1000);
    const c3 = await ansicht(page);
    log('C3 390 Wahl über Spur erhalten', { feldWahl: c3.feldWahl, voraus: c3.voraus });
    await page.tap('.zugang-knopf'); await warte(page, 400);
    const zfl = await page.locator('.zugang-flaeche').boundingBox();
    const scrollbar = await page.evaluate(() => { const z = document.querySelector('.zugang-flaeche'); return { sh: z.scrollHeight, ch: z.clientHeight, oy: getComputedStyle(z).overflowY }; });
    log('C4 390 Zugang', { kasten: zfl, scroll: scrollbar, audit: await audit(page) });
    await bild(page, 'C4-390-zugang.png');
    // Gleitbahn per Wischen
    const sch = await page.locator('.zg-bahn >> nth=0 >> .zg-schiene').boundingBox();
    const cdp = await ctx.newCDPSession(page);
    const t1 = (x, y) => [{ x, y, id: 1, radiusX: 4, radiusY: 4, force: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: t1(sch.x + sch.width - 4, sch.y + sch.height / 2) });
    for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: t1(sch.x + sch.width - 4 - (sch.width * i) / 10, sch.y + sch.height / 2) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await warte(page, 300);
    const nv = (await ansicht(page)).profil.niveau;
    // Textkante per Wischen
    const kt = await page.locator('.zg-kante').boundingBox();
    const u0 = (await ansicht(page)).profil.umfang;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: t1(kt.x + 40, kt.y + kt.height / 2) });
    for (let i = 1; i <= 10; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: t1(kt.x + 40, kt.y + kt.height / 2 + 9 * i) });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await warte(page, 300);
    log('C5 390 Wischen am Zugang', { niveauNachWischNachLinks: nv, umfangVorher: u0, umfangNachher: (await ansicht(page)).profil.umfang, scrollTop: await page.evaluate(() => document.querySelector('.zugang-flaeche').scrollTop) });
    await bild(page, 'C5-390-zugang-gewischt.png');
    await page.tap('.zugang-knopf'); await warte(page, 400);
    log('C6 390 Feld einfach', { audit: await audit(page) });
    await bild(page, 'C6-390-feld-einfach.png');
    // betreten per Tippen auf eine Naht
    const naht = await page.evaluate(() => { const p = window.__schloss.fugePunkt('Aufgabenstarre', 'Hyperfokus'); const e = document.elementFromPoint(p.x, p.y); return e ? e.className.baseVal || e.className : null; });
    await page.tap('.f-lesen-fuge >> nth=0'); await warte(page, 1600);
    log('C6b Naht unter Finger bei Voraussetzung ohne Licht', naht);
    log('C7 390 Schloss einfach', { a: await ansicht(page), audit: await audit(page) });
    await bild(page, 'C7-390-schloss-einfach.png');
    await page.tap('.regeln > summary'); await warte(page, 400);
    log('C8 390 Regeln offen', { audit: await audit(page) });
    await bild(page, 'C8-390-regeln.png');
    await page.tap('.regeln > summary'); await warte(page, 300);
    await page.evaluate(() => window.ZUGANGSPROFIL.setze({ schrift: 'gross' })); await warte(page, 500);
    log('C9 390 groß Schloss', { audit: await audit(page) }); await bild(page, 'C9-390-gross-schloss.png');
    await page.tap('.griff-name >> text=Feld'); await warte(page, 1500);
    log('C9 390 groß Feld', { audit: await audit(page) }); await bild(page, 'C9-390-gross-feld.png');
    log('C Ende', { fehler, netz });
    await ctx.close();
  }

  /* ======== D: reduzierte Bewegung ======== */
  {
    const { ctx, page, fehler } = await neu(browser, 1440, 900, { reducedMotion: 'reduce' });
    const p0 = (await ansicht(page)).profil;
    await page.keyboard.press('-'); await warte(page, 150);
    const sofort = (await ansicht(page)).ansicht;
    await page.click('.f-zahn-wort'); await warte(page, 400);
    const lauf1 = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => a.animationName || a.constructor.name));
    await page.click('.f-zahn-wort'); await warte(page, 200);
    const fp = await page.evaluate(() => window.__schloss.fugePunkt('Aufgabenstarre', 'Hyperfokus'));
    await page.mouse.click(fp.x, fp.y); await warte(page, 150);
    const nach = (await ansicht(page)).ansicht;
    const lauf2 = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
    // Schlüssel heranziehen: läuft die Feder trotzdem?
    log('D reduziert', { profilStart: p0, sofortImFeld: sofort, laufendImFeld: lauf1, nachTippen: nach, laufendSchloss: lauf2, fehler, audit: await audit(page) });
    await bild(page, 'D-reduziert-schloss.png');
    await ctx.close();
  }

  /* ======== E: 1280 × 800 ======== */
  {
    const { ctx, page, fehler, netz } = await neu(browser, 1280, 800);
    log('E1 1280 Schloss', { audit: await audit(page) });
    await page.click('.zahn-grenze .zahn-wert'); await warte(page, 600);
    log('E1b 1280 Grenzfeld offen', { audit: await audit(page) }); await bild(page, 'E1b-1280-grenzfeld.png');
    await page.keyboard.press('Escape'); await warte(page, 300);
    await page.keyboard.press('-'); await warte(page, 1600);
    await page.click('.f-zahn-wort'); await warte(page, 400);
    log('E2 1280 Feld', { audit: await audit(page) }); await bild(page, 'E2-1280-feld.png');
    await zgAuf(page);
    log('E3 1280 Zugang', { audit: await audit(page) }); await bild(page, 'E3-1280-zugang.png');
    await page.click('.zg-muster >> text=Alles, fachlich'); await zgZu(page); await warte(page, 400);
    log('E4 1280 Feld ganz', { audit: await audit(page) }); await bild(page, 'E4-1280-feld-ganz.png');
    await page.keyboard.press('-'); await warte(page, 1200);
    log('E5 1280 Spur', { audit: await audit(page) });
    log('E Ende', { fehler, netz });
    await ctx.close();
  }

  /* ======== F: statischer Dienst, alle Dateien ======== */
  {
    const typen = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };
    const dienst = http.createServer((req, res) => {
      const name = decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/^\/+/, '') || 'index.html';
      const datei = path.join(PROBE, name);
      if (!datei.startsWith(PROBE) || !fs.existsSync(datei) || fs.statSync(datei).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'content-type': typen[path.extname(datei)] || 'application/octet-stream' });
      fs.createReadStream(datei).pipe(res);
    });
    await new Promise((r) => dienst.listen(0, '127.0.0.1', r));
    const url = `http://127.0.0.1:${dienst.address().port}/index.html`;
    const { ctx, page, fehler, netz } = await neu(browser, 1440, 900, {}, url);
    await page.mouse.wheel(0, 260); await warte(page, 1700);
    const a = await ansicht(page);
    await page.click('.f-zahn-wort'); await warte(page, 400);
    const fp = await page.evaluate(() => window.__schloss.fugePunkt('Reizfilterschwäche', 'Reize überfluten mich'));
    await page.mouse.click(fp.x, fp.y); await warte(page, 1700);
    await page.mouse.wheel(0, -260); await warte(page, 800);
    await page.evaluate(() => window.ZUGANGSPROFIL.setze({ niveau: 'einfach', umfang: 'ganz', ton: true }));
    await warte(page, 400);
    const ls = await page.evaluate(() => { try { return [localStorage.length, sessionStorage.length]; } catch (e) { return String(e); } });
    log('F Dienst', { nachRad: a.ansicht, danach: await ansicht(page), speicherLaenge: ls, fehler, netz, audit: await audit(page) });
    await ctx.close();
    await new Promise((r) => dienst.close(r));
  }

  await browser.close();
  fs.writeFileSync(path.join(AUS, 'protokoll.json'), JSON.stringify(P, null, 1));
})().catch((e) => { console.error(e); fs.writeFileSync(path.join(AUS, 'protokoll.json'), JSON.stringify({ ...P, ABBRUCH: String(e.stack) }, null, 1)); process.exit(1); });
