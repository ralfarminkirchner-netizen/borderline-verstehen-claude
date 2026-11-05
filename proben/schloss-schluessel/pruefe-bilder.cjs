// Endbilder der Probe „Schloss und Schlüssel“, dritte Fassung (Gewebe, Körper mit Armen, Schwellen-Querschnitt).
// Aufruf (aus diesem Ordner): node pruefe-bilder.cjs
// Schreibt nur nach ./bilder/ende3/. Bedient die Seite wie ein Mensch: Maus, Ziehen, Tastatur, Berührung.
// Video weg3.webm: braucht ein ffmpeg mit VP8 dort, wo Playwright es sucht (PLAYWRIGHT_BROWSERS_PATH/ffmpeg-1011/ffmpeg-mac),
// etwa PLAYWRIGHT_BROWSERS_PATH auf einen Ordner, in dem ffmpeg-1011 auf …/Caches/playwright-safari-check/ffmpeg-1011 zeigt.
// Fehlt es, entstehen alle Bilder trotzdem, nur ohne Video. Die Bilder der zweiten Fassung liegen in ./bilder/ende2/.
const path = require('node:path');
const fs = require('node:fs');
const { chromium } = require('/Volumes/ThunderBolt4_2TB/MeineApps/faska-varianten/node_modules/playwright');

const HIER = __dirname;
const ENDE = path.join(HIER, 'bilder', 'ende3');
const SEITE = 'file://' + path.join(HIER, 'index.html');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(ENDE, { recursive: true });

const protokoll = [];
const merke = (schritt, info = {}) => { protokoll.push({ schritt, ...info }); console.log(schritt, JSON.stringify(info).slice(0, 260)); };
const warte = (page, ms) => page.waitForTimeout(ms);

async function neueSeite(browser, w, h, extra = {}) {
  let ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...extra });
  let page;
  try { page = await ctx.newPage(); } catch (e) {
    if (!extra.recordVideo) throw e;
    console.log('ohne Video weiter:', String(e.message).split('\n')[0]);
    await ctx.close();
    const rest = { ...extra }; delete rest.recordVideo;
    ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, ...rest });
    page = await ctx.newPage();
  }
  const fehler = [], netz = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') fehler.push(`${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => fehler.push(e.message));
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith('data:') && !u.startsWith('file://')) netz.push(u); });
  await page.goto(SEITE);
  await warte(page, 1900);
  return { ctx, page, fehler, netz };
}
const zustand = (page) => page.evaluate(() => window.__schloss.zustand());
const bild = async (page, name) => { await page.screenshot({ path: path.join(ENDE, name) }); merke('bild', { name }); };
const ganzBild = async (page, name) => { await page.screenshot({ path: path.join(ENDE, name), fullPage: true }); merke('bild', { name }); };
const laufend = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
const kleinsteSchrift = (page) => page.evaluate(() => {
  let min = 99, wo = '';
  for (const el of document.querySelectorAll('body *')) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('.ansage, [hidden]')) continue;
    let o = 1; for (let e = el; e; e = e.parentElement) o *= Number(getComputedStyle(e).opacity);
    if (o < 0.05) continue;
    const f = parseFloat(cs.fontSize);
    if (f < min) { min = f; wo = `${el.tagName} ${el.getAttribute('class') || ''} „${el.textContent.trim().slice(0, 30)}“`; }
  }
  return { min, wo };
});
// sichtbare Kennungen: Text, aria-label, title – nichts mit Doppelpunkt-Kennung, Index oder Hash
const kennungen = (page) => page.evaluate(() => {
  const muster = /\b(?:fundus|adhs|neuro|research|trauma|relationship-original|verified-section|context|fundus-source|neuro-source|research-source):[a-z0-9]|\bfugeIndex\b|\bortIndex\b|\b[0-9a-f]{12,}\b|pmid:\d/i;
  const funde = [];
  const txt = document.body.innerText;
  if (muster.test(txt)) funde.push('Text: ' + txt.match(muster)[0]);
  for (const el of document.querySelectorAll('[aria-label],[title]')) {
    for (const a of ['aria-label', 'title']) { const v = el.getAttribute(a); if (v && muster.test(v)) funde.push(`${a}: ${v.slice(0, 60)}`); }
  }
  return funde;
});
const speicher = (page) => page.evaluate(() => { let l = -1, s = -1; try { l = localStorage.length; s = sessionStorage.length; } catch (_) { /* gesperrt */ } return { localStorage: l, sessionStorage: s, cookie: document.cookie, url: location.href.includes('?') || location.hash.length > 1 }; });

const knopf = (page, text, sel = 'button') => page.locator(sel, { hasText: text }).first();
async function klickeOrt(page, titel) {
  const p = await page.evaluate((t) => window.__schloss.ortPunkt(t), titel);
  await page.mouse.move(p.x - 30, p.y - 20, { steps: 4 });
  await page.mouse.move(p.x, p.y, { steps: 6 });
  await page.mouse.click(p.x, p.y);
  await warte(page, 900);
}
async function klickeArm(page, i) {
  const p = await page.evaluate((x) => window.__schloss.armPunkt(x), i);
  await page.mouse.move(p.x, p.y, { steps: 6 });
  await page.mouse.click(p.x, p.y);
  await warte(page, 1100);
}
async function nahtIndex(page, a, b) {
  return page.evaluate(([a, b]) => { for (let n = 0; n < 8; n++) { const x = window.__schloss.nahtPunkt(n); if (!x) break; if (x.name.includes(a) && x.name.includes(b)) return n; } return -1; }, [a, b]);
}
async function klickeNaht(page, n) {
  const p = await page.evaluate((x) => window.__schloss.nahtPunkt(x), n);
  await page.mouse.click(p.x, p.y);
  await warte(page, 900);
}
async function riegel(page, name) { await knopf(page, name, '.riegel').click(); await warte(page, 350); }
// Stein mit der Maus auf den gewählten Riegel ziehen
async function zieheStein(page) {
  const st = await page.locator('.stein.ziehbar').first().boundingBox();
  const zi = await page.locator('.riegel.gewaehlt .riegel-stab').first().boundingBox();
  const von = { x: st.x + 30, y: st.y + 14 }, nach = { x: zi.x + zi.width / 2, y: zi.y + zi.height / 2 };
  await page.mouse.move(von.x, von.y);
  await page.mouse.down();
  for (let s = 1; s <= 20; s++) await page.mouse.move(von.x + ((nach.x - von.x) * s) / 20, von.y + ((nach.y - von.y) * s) / 20);
  await warte(page, 120);
  await page.mouse.up();
  await warte(page, 500);
}
async function zurueckInsFeld(page) { await knopf(page, 'zurück ins Feld').click(); await warte(page, 1300); }
async function betrete(page, a, b) {
  // wie ein Mensch: Ort antippen, dann in seiner Armliste die Fuge wählen
  const i = await page.evaluate(([a, b]) => window.__schloss.paarVon(a, b), [a, b]);
  const z = await zustand(page);
  if (z.ansicht !== 'feld') await zurueckInsFeld(page);
  const w = (await zustand(page)).wahl;
  const titelA = a;
  const gewaehlt = await page.locator('.ort-titel').first().textContent().catch(() => '');
  if (!w || w.art !== 'ort' || gewaehlt !== titelA) {
    if (w) { await knopf(page, 'ganzes Feld').click(); await warte(page, 1000); }
    await klickeOrt(page, titelA);
  }
  await page.locator('.paar-knopf', { hasText: b }).first().click();
  await warte(page, 1100);
  return i;
}
// Riegel mit dem ersten Vorschlag belegen (per Klick „auflegen“)
async function legeAuf(page, name) {
  await riegel(page, name);
  const b = page.locator('.stein-knopf', { hasText: 'auflegen' }).first();
  if (await b.count()) { await b.click(); await warte(page, 350); return true; }
  return false;
}

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const videoRoh = path.join(ENDE, '.video-roh');
  fs.rmSync(videoRoh, { recursive: true, force: true });
  try {
    /* ============ Hauptweg 1440 × 900, lebendig, mit Video ============ */
    const { ctx, page, fehler, netz } = await neueSeite(browser, 1440, 900, { recordVideo: { dir: videoRoh, size: { width: 1440, height: 900 } } });
    merke('start', { schrift: await kleinsteSchrift(page) });
    await bild(page, '01-feld-ueberblick-gewebe.png');

    // Ort als Körper mit Armen, nah
    await klickeOrt(page, 'Aufgabenstarre');
    await warte(page, 600);
    await bild(page, '02-ort-koerper-mit-armen-nah.png');
    merke('ort', { wahl: (await zustand(page)).wahl, schrift: await kleinsteSchrift(page) });

    // Blickrichtungen direkt am Text: innen → außen → Spielraum
    await bild(page, '03a-blick-innen.png');
    await page.locator('.dreher-blick').click(); await warte(page, 400);
    await bild(page, '03b-blick-aussen.png');
    await page.locator('.dreher-blick').click(); await warte(page, 400);
    await bild(page, '03c-blick-spielraum-bestand-schweigt.png');
    await klickeOrt(page, 'Unterstützung bleibt ein Angebot');
    await warte(page, 500);
    await bild(page, '03d-blick-spielraum-mit-text.png');
    await page.locator('.dreher-blick').click(); await warte(page, 300); // zurück zu innen
    await knopf(page, 'ganzes Feld').click(); await warte(page, 900);

    // Naht zwischen zwei Gebieten
    const nP = await nahtIndex(page, 'ADHS', 'Phänomenatlas');
    await klickeNaht(page, nP);
    await bild(page, '04-naht-zwischen-adhs-und-phaenomenatlas-geoeffnet.png');
    merke('naht', { wahl: (await zustand(page)).wahl });

    // Fehlstelle
    await page.locator('.fehlstelle').first().click({ force: true });
    await warte(page, 900);
    await bild(page, '04b-fehlstelle-hohl-in-der-membran.png');
    await knopf(page, 'ganzes Feld').click(); await warte(page, 900);

    // Fuge betreten: Aufgabenstarre ⟷ Hyperfokus
    const iH = await betrete(page, 'Aufgabenstarre', 'Hyperfokus');
    await warte(page, 500);
    await bild(page, '05-schloss-schwellen-querschnitt-start.png');
    merke('schloss', { z: await page.evaluate((i) => window.__schloss.zaehne(i), iH), schrift: await kleinsteSchrift(page) });
    await riegel(page, 'Lesart');
    await knopf(page, 'Lesart drehen').click(); await warte(page, 400);
    await riegel(page, 'Beleg');
    await zieheStein(page);
    await riegel(page, 'Grenze');
    await bild(page, '06-stein-ablegen-riegel-vorschlag.png');
    const fund = page.locator('.fundstelle').first();
    if (await fund.count()) { await fund.click(); await warte(page, 300); await bild(page, '06b-stein-fundstelle-einen-griff-entfernt.png'); await fund.click(); }
    await zieheStein(page);
    await riegel(page, 'Wort');
    await page.locator('.wand-a .wort', { hasText: 'Auftrag' }).first().click(); await warte(page, 250);
    await page.locator('.wand-b .wort', { hasText: 'Tätigkeit' }).first().click(); await warte(page, 300);
    await riegel(page, 'Kontext');
    await bild(page, '07-kontext-zahn-vorschlag-aus-dem-wortlaut.png');
    merke('vor kontext', { z: await page.evaluate((i) => window.__schloss.zaehne(i), iH) });
    await knopf(page, 'auflegen', '.stein-knopf').click();
    await warte(page, 650);
    await bild(page, '08a-einrasten-lichtpuls.png');
    await warte(page, 1600);
    await bild(page, '08-schwellen-querschnitt-eingerastet.png');
    merke('eingerastet', { e: (await zustand(page)).paare[iH] });
    await page.locator('.wirkung').scrollIntoViewIfNeeded();
    await bild(page, '09-drei-entscheidungen.png');
    await knopf(page, 'Für meinen Weg fassen', '.entscheidung').click(); await warte(page, 400);
    // Lage ändern: Bedingung wegnehmen → erlischt, Kittspur bleibt
    await riegel(page, 'Kontext');
    await knopf(page, 'abnehmen', '.stein-knopf').click();
    await warte(page, 1400);
    await bild(page, '10a-schloss-erloschen-gekittet.png');
    merke('erloschen', { e: (await zustand(page)).paare[iH] });
    await zurueckInsFeld(page);
    await klickeOrt(page, 'Hyperfokus');
    await warte(page, 1200);
    await bild(page, '10-feld-gekittete-bruchstelle-nach-erloeschen.png');

    // Wiederaufnahme unter neuer Bedingung (eigenes Wort)
    await klickeArm(page, iH);
    await riegel(page, 'Kontext');
    await page.locator('.stein-knopf', { hasText: 'wegschieben' }).first().click().catch(() => {});
    await warte(page, 250);
    await page.locator('.eigen-feld').click();
    await page.keyboard.type('wenn es um den Anfang einer Aufgabe geht', { delay: 18 });
    await page.keyboard.press('Enter');
    await warte(page, 1900);
    await bild(page, '11a-wiederaufnahme-schloss.png');
    merke('wieder', { e: (await zustand(page)).paare[iH] });
    await knopf(page, 'Offen lassen', '.entscheidung').click(); await warte(page, 300);
    await zurueckInsFeld(page);
    await warte(page, 1500);
    await bild(page, '11-wiederaufnahme-feld-ueber-der-kittspur.png');
    await knopf(page, 'ganzes Feld').click(); await warte(page, 900);

    // Weitere Fugen vorbereiten, damit „Unter welcher Voraussetzung?“ etwas zu strecken hat
    for (const [a, b] of [['Aufgabenstarre', 'Wartemodus'], ['Delay Aversion', 'Zeitblindheit'], ['Wartemodus', 'Zeitblindheit']]) {
      const i = await betrete(page, a, b);
      await legeAuf(page, 'Beleg');
      await legeAuf(page, 'Grenze');
      merke('vorbereitet', { a, b, z: await page.evaluate((x) => window.__schloss.zaehne(x), i) });
      await zurueckInsFeld(page);
    }
    // Bestreiten an einer zweiten Fuge: Reizfilterschwäche ⟷ Reize überfluten mich
    {
      const i = await betrete(page, 'Reizfilterschwäche', 'Reize überfluten mich');
      await riegel(page, 'Wort');
      await page.locator('.wand-a .wort').first().click(); await warte(page, 200);
      await page.locator('.wand-b .wort').first().click(); await warte(page, 300);
      await riegel(page, 'Kontext');
      await page.locator('.eigen-feld').click();
      await page.keyboard.type('bei vielen Reizen zugleich', { delay: 15 });
      await page.keyboard.press('Enter');
      await warte(page, 1500);
      await knopf(page, 'Bestreiten', '.entscheidung').click(); await warte(page, 900);
      await bild(page, '12a-bestritten-im-schloss.png');
      merke('bestritten', { e: (await zustand(page)).paare[i] });
      await zurueckInsFeld(page);
    }
    // Unter welcher Voraussetzung? – Kontext
    if (await knopf(page, 'ganzes Feld').count()) { await knopf(page, 'ganzes Feld').click(); await warte(page, 1000); }
    await page.locator('.zahn', { hasText: 'Kontext' }).click();
    await warte(page, 1500);
    await bild(page, '13-unter-welcher-voraussetzung-kontext-arme-strecken-sich.png');
    merke('voraus kontext', { nur: await page.evaluate(() => window.__schloss.fehltNur('kontext')), zwei: await page.evaluate(() => window.__schloss.fehltMitEinem('kontext')) });
    await page.locator('.zahn', { hasText: 'Kontext' }).click(); await warte(page, 900);
    await bild(page, '12-feld-spuren-kitt-bestritten-offen.png');

    // Regeln
    await knopf(page, 'Wie die Riegel entstehen').click(); await warte(page, 600);
    await bild(page, '14-regeln-wie-die-riegel-entstehen.png');
    await page.locator('.spalte').evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await warte(page, 300);
    await bild(page, '14b-regeln-strichformen.png');
    await knopf(page, 'ganzes Feld').click(); await warte(page, 700);

    // Sprache: einfach (KI-Entwurf) am Text, Original einen Griff entfernt
    await klickeOrt(page, 'Wartemodus');
    await page.locator('.dreher-niveau').click(); await warte(page, 300);
    await page.locator('.dreher-niveau').click(); await warte(page, 300);
    const ki = page.locator('.ki-marke').first();
    if (await ki.count()) { await ki.click(); await warte(page, 300); }
    await bild(page, '15-einfache-sprache-ki-entwurf-original-daneben.png');
    await page.locator('.dreher-niveau').click(); await warte(page, 300);

    // Ruhig gegen lebendig: dieselbe Lage, einmal mit Bewegung, einmal nur Form
    const iW = await betrete(page, 'Aufgabenstarre', 'Wartemodus');
    await riegel(page, 'Kontext');
    await page.locator('.eigen-feld').click();
    await page.keyboard.type('wenn ein Termin den Tag teilt', { delay: 12 });
    await page.keyboard.press('Enter');
    await warte(page, 300);
    await knopf(page, 'zurück ins Feld').click();
    await warte(page, 980);
    await bild(page, '16a-lebendig-arm-hakt-mit-lichtpuls.png');
    merke('lebendig', { e: (await zustand(page)).paare[iW] });
    await warte(page, 2200);
    await bild(page, '16c-lebendig-danach.png');
    await page.locator('.ecke-wort', { hasText: 'lebendig' }).click(); await warte(page, 600);
    await bild(page, '16b-ruhig-nur-form.png');
    merke('ruhig', { ruhe: await page.evaluate(() => window.__schloss.ruhe()), laufend: await laufend(page) });
    await page.locator('.ecke-wort', { hasText: 'ruhig' }).click(); await warte(page, 400);

    // Tastatur: Tab bis zu einem Ort im Feld, Enter wählt, Escape zurück
    await knopf(page, 'ganzes Feld').click(); await warte(page, 600);
    await page.locator('.regeln-link').focus();
    for (let n = 0; n < 4; n++) await page.keyboard.press('Tab');
    await page.keyboard.press('Enter'); await warte(page, 900);
    await bild(page, '17-tastatur-ort-gewaehlt.png');
    merke('tastatur', { wahl: (await zustand(page)).wahl });
    await page.keyboard.press('Escape'); await warte(page, 600);

    // Schrift groß
    await page.locator('.ecke-wort', { hasText: 'normal' }).click(); await warte(page, 500);
    await bild(page, '18-schrift-gross-feld.png');
    await page.locator('.ecke-wort', { hasText: 'groß' }).click(); await warte(page, 300);

    merke('hauptweg', { fehler, netz, kennungen: await kennungen(page), speicher: await speicher(page), schrift: await kleinsteSchrift(page) });
    const vid = page.video();
    await ctx.close();
    if (vid) { try { const p = await vid.path(); fs.renameSync(p, path.join(ENDE, 'weg3.webm')); merke('video', { datei: 'weg3.webm' }); } catch (e) { merke('video fehlt', { grund: String(e.message).split('\n')[0] }); } }

    /* ============ Reduzierte Bewegung ============ */
    {
      const { ctx: c2, page: p2, fehler: f2 } = await neueSeite(browser, 1440, 900, { reducedMotion: 'reduce' });
      await bild(p2, '19-reduzierte-bewegung-feld.png');
      merke('reduziert', { reiz: await p2.evaluate(() => window.ZUGANGSPROFIL.reiz), laufend: await laufend(p2), ruhe: await p2.evaluate(() => window.__schloss.ruhe()), fehler: f2 });
      await c2.close();
    }

    /* ============ 1280 × 800 ============ */
    {
      const { ctx: c3, page: p3, fehler: f3 } = await neueSeite(browser, 1280, 800);
      await bild(p3, '20a-1280-feld.png');
      await betrete(p3, 'Aufgabenstarre', 'Body Doubling');
      await riegel(p3, 'Kontext');
      await bild(p3, '20b-1280-schloss-kontext.png');
      merke('1280', { fehler: f3, schrift: await kleinsteSchrift(p3) });
      await c3.close();
    }

    /* ============ 390 × 844 mit Berührung ============ */
    {
      const { ctx: c4, page: p4, fehler: f4, netz: n4 } = await neueSeite(browser, 390, 844, { hasTouch: true, isMobile: true });
      await bild(p4, '21a-390-feld.png');
      const p = await p4.evaluate(() => window.__schloss.ortPunkt('Aufgabenstarre'));
      await p4.touchscreen.tap(p.x, p.y); await warte(p4, 1000);
      await bild(p4, '21b-390-ort-nah.png');
      await ganzBild(p4, '21c-390-ort-ganze-seite.png');
      const i = await p4.evaluate(() => window.__schloss.paarVon('Aufgabenstarre', 'Hyperfokus'));
      await p4.evaluate(() => window.scrollTo(0, 0));
      await warte(p4, 300);
      const a = await p4.evaluate((x) => window.__schloss.armPunkt(x), i);
      await p4.touchscreen.tap(a.x, a.y); await warte(p4, 1200);
      await bild(p4, '21d-390-schloss-oben.png');
      await p4.locator('.riegel', { hasText: 'Kontext' }).tap(); await warte(p4, 400);
      await p4.locator('.versuch').scrollIntoViewIfNeeded();
      await bild(p4, '21e-390-schloss-kontext-stein.png');
      await ganzBild(p4, '21f-390-schloss-ganze-seite.png');
      merke('390', { fehler: f4, netz: n4, schrift: await kleinsteSchrift(p4), ansicht: (await zustand(p4)).ansicht, breite: await p4.evaluate(() => document.documentElement.scrollWidth) });
      await c4.close();
    }
  } finally {
    fs.rmSync(videoRoh, { recursive: true, force: true });
    fs.writeFileSync(path.join(ENDE, 'protokoll.json'), JSON.stringify(protokoll, null, 1));
    await browser.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
