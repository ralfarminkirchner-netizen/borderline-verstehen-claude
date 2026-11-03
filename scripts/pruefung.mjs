// Gesamtprüfung im echten Browser mit isoliertem Prüfdatenordner.
// Startet einen eigenen Prüfdienst (eigener Port, eigener Datenordner), bedient den Gesamtweg,
// nimmt Bilder und ein Bewegungsvideo auf und schreibt ein Protokoll. Persönliche Daten bleiben unberührt.
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm, readFile, readdir, rename } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { requireExternalWriteTarget } from './external-storage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = requireExternalWriteTarget(join(ROOT, 'evidence', 'pruefung-20261103'));
const DATA = requireExternalWriteTarget(join(ROOT, '.cache', 'pruefdaten'));
const TMP = requireExternalWriteTarget(join(ROOT, '.cache', 'tmp'));
const PROFILE = requireExternalWriteTarget(join(ROOT, '.cache', 'pw-profil'));
const EXE = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const PORT = 4394; const BASE = `http://127.0.0.1:${PORT}`;
const RAUM = 'http://127.0.0.1:4191/';
const nur = process.argv[2];

await rm(DATA, { recursive: true, force: true });
for (const d of [OUT, join(OUT, 'bilder'), join(OUT, 'video'), DATA, TMP, PROFILE]) await mkdir(d, { recursive: true });
process.env.TMPDIR = TMP;
process.env.PLAYWRIGHT_BROWSERS_PATH = join(ROOT, '.cache', 'pw-browsers');

const log = []; const ok = (name, pass, detail = '') => { log.push({ name, pass, detail }); console.log(`${pass ? 'OK  ' : 'FEHL'} ${name}${detail ? ` · ${detail}` : ''}`); };
const server = spawn(process.execPath, [join(ROOT, 'server.mjs')], { env: { ...process.env, PORT: String(PORT), WERKSTATT_DIR: DATA }, stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((res, rej) => { server.stdout.on('data', (b) => String(b).includes('läuft') && res()); server.stderr.on('data', (b) => rej(new Error(String(b)))); setTimeout(() => rej(new Error('Prüfdienst startet nicht')), 8000); });

const bild = async (page, name) => { await page.waitForTimeout(250); await page.screenshot({ path: join(OUT, 'bilder', `${name}.png`) }); };
const settle = (page, ms = 1700) => page.waitForTimeout(ms);
const hash = (page) => page.evaluate(() => location.hash);
const art = async (page) => page.evaluate(async () => { const m = await import('/js/main.mjs'); return m.A; });

// Bewegungsaufnahme: echte Bildschirmbilder per Chrome-Screencast, danach mit ffmpeg zu MP4 gesetzt.
async function aufnahme(page, name) {
  const dir = join(TMP, `frames-${name}`); await rm(dir, { recursive: true, force: true }); await mkdir(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page); const frames = []; let n = 0;
  cdp.on('Page.screencastFrame', async (f) => {
    const file = join(dir, `${String(n++).padStart(5, '0')}.jpg`); frames.push({ file, t: f.metadata.timestamp });
    await writeFile(file, Buffer.from(f.data, 'base64')); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {});
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 82, everyNthFrame: 1 });
  return async () => {
    await cdp.send('Page.stopScreencast').catch(() => {}); await new Promise((r) => setTimeout(r, 400));
    const list = frames.map((f, k) => `file '${f.file}'\nduration ${Math.max(0.016, Math.min(1.5, ((frames[k + 1]?.t ?? f.t + 0.5) - f.t))).toFixed(3)}`).join('\n');
    const listFile = join(dir, 'liste.txt'); await writeFile(listFile, `${list}\nfile '${frames.at(-1).file}'\n`);
    const out = join(OUT, 'video', `${name}.mp4`);
    await new Promise((res, rej) => { const p = spawn('/opt/homebrew/bin/ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', listFile, '-vf', 'fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', out]); p.on('exit', (c) => (c ? rej(new Error(`ffmpeg ${c}`)) : res())); });
    await rm(dir, { recursive: true, force: true });
    return { datei: out, bilder: frames.length, sekunden: Math.round(frames.at(-1).t - frames[0].t) };
  };
}

async function launch(opts = {}) {
  return chromium.launch({ executablePath: EXE, headless: true, args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', ...(opts.args || [])] });
}

// ---------------- Desktop: der durchgehende Weg mit Video ----------------
async function desktop() {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage(); const fehler = []; const stop = await aufnahme(page, 'gesamtweg-desktop');
  page.on('pageerror', (e) => fehler.push(e.message)); page.on('console', (m) => m.type() === 'error' && fehler.push(m.text()));
  const netz = []; page.on('request', (r) => netz.push(r.url()));
  await page.goto(BASE); await settle(page, 2200);
  const modus = await page.evaluate(async () => (await import('/js/main.mjs')).A.gelaende.modus);
  ok('Einstieg lädt, Grafik', true, modus);
  await bild(page, '01-ueberblick');
  // Bewegung: ziehen und zoomen
  await page.mouse.move(700, 450); await page.mouse.down(); await page.mouse.move(560, 380, { steps: 18 }); await page.mouse.up();
  for (let k = 0; k < 6; k++) { await page.mouse.wheel(0, -160); await page.waitForTimeout(60); }
  await settle(page, 600);
  // Gebiet über Einstieg
  await page.getByRole('button', { name: 'ADHS · Randphänomene' }).first().click(); await settle(page);
  ok('Gebiet geöffnet', (await hash(page)).startsWith('#/gebiet/'), await hash(page));
  await bild(page, '02-gebiet');
  // Ort aus dem Gebiet
  await page.locator('#g-orte button', { hasText: 'Aufgabenstarre' }).first().click(); await settle(page);
  const ortHash = await hash(page); ok('Ort geöffnet', ortHash.startsWith('#/ort/'), ortHash);
  await bild(page, '03-ort');
  // Fuge aus dem Fugenstern
  const fugen = page.locator('#o-stern [data-fuge]');
  ok('Fugenstern hat Fugen', (await fugen.count()) > 0, `${await fugen.count()} gezeichnet`);
  await page.locator('#o-stern [data-fuge][aria-label^="Spannung"]').first().click({ force: true }); await settle(page);
  ok('Fuge geöffnet', (await hash(page)).includes('/fuge/'), await hash(page));
  await bild(page, '04-fuge-neben');
  for (const b of ['gegen', 'durch', 'fehlt', 'kippt']) { await page.locator('#f-bew button', { hasText: new RegExp(`^${b}$`) }).click(); await page.waitForTimeout(800); }
  await bild(page, '05-fuge-kippt');
  await page.locator('#f-bew button', { hasText: /^fehlt$/ }).click(); await page.waitForTimeout(800);
  await bild(page, '06-fuge-fehlt');
  // Vergleich: andere Fuge gleicher Art
  const vergleich = await page.locator('#f-vergleich button').count(); const keinVergleich = await page.locator('#f-vergleich').innerText();
  ok('Vergleich gleicher Fugenart (oder ehrlich: keine weitere)', vergleich > 0 || /keine weitere Fuge/.test(keinVergleich), vergleich ? `${vergleich} Vergleichsfugen` : keinVergleich);
  const linsen = {}; for (const b of ['neben', 'fehlt', 'kippt', 'takt']) { await page.locator('#f-bew button', { hasText: new RegExp(`^${b}$`) }).click(); await page.waitForTimeout(250); linsen[b] = (await page.locator('#f-linse').innerText()).slice(0, 60); }
  ok('Lesebewegungen öffnen jeweils eigenen Inhalt', new Set(Object.values(linsen)).size === 4, JSON.stringify(linsen));
  // Zurück zum Ort über den Pfad
  await page.locator('#pfad li').nth(2).locator('button').click(); await settle(page);
  ok('Rückweg über Pfad zum Ort', (await hash(page)) === ortHash, await hash(page));
  // Original
  await page.locator('#o-lesen').click(); await settle(page, 2200);
  ok('Original geöffnet', (await hash(page)).endsWith('/original'));
  await bild(page, '07-original');
  const lese = await page.evaluate(() => { const s = document.querySelector('#blatt-inhalt'); s.scrollTop = s.scrollHeight; const a = document.querySelector('.lesen article'); const r = a.getBoundingClientRect(); return { text: a.innerText.length, sichtbar: s.clientHeight, gesamt: s.scrollHeight, artikelBreite: r.width }; });
  await settle(page, 500); await bild(page, '08-original-ende');
  ok('Original vollständig erreichbar', lese.gesamt >= lese.sichtbar && lese.text > 200, JSON.stringify(lese));
  await page.getByRole('button', { name: /^Zurück zu/ }).click(); await settle(page);
  ok('Zurück vom Original zum Ort', (await hash(page)) === ortHash);
  await page.goBack(); await settle(page); const back1 = await hash(page);
  await page.goForward(); await settle(page);
  ok('Browser-Zurück fliegt zurück', back1.endsWith('/original'), back1);

  // Ein tiefes Fundus-Kapitel mit Abschnittsleiste
  await page.evaluate(() => { location.hash = '#/ort/forschungsstand-und-offene-fragen/original'; }); await settle(page, 2500);
  const kapitel = await page.evaluate(() => ({ h: document.querySelectorAll('.lesen article h2').length, len: document.querySelector('.lesen article')?.innerText.length || 0 }));
  ok('Fundus-Kapitel vollständig gesetzt', kapitel.len > 3000, JSON.stringify(kapitel));
  if (kapitel.h) { await page.locator('#l-toc button').nth(Math.min(2, kapitel.h - 1)).click(); await settle(page, 900); }
  await bild(page, '09-kapitel');

  // Werk des Vaters an seinem Ort und Aufnahme im gemeinsamen Spieler
  await page.evaluate(() => { location.hash = '#/ort/borderline-verstehen-menschen-offenhalten'; }); await settle(page, 2200);
  const werk = await page.evaluate(() => { const img = document.querySelector('.werk img'); return img ? { geladen: img.complete && img.naturalWidth > 0, ueberText: !!document.querySelector('.werk figure *:not(img):not(figcaption)') } : null; });
  ok('Werk des Vaters ganz und ohne Text darüber', !!werk?.geladen, JSON.stringify(werk));
  await page.locator('.werk').scrollIntoViewIfNeeded(); await bild(page, '17-werk-am-ort');
  await page.evaluate(() => { location.hash = '#/gebiet/traumaatlas'; }); await settle(page, 2000);
  await page.locator('#g-medien .medium-zug').first().click(); await page.waitForTimeout(2500);
  const spielt = await page.evaluate(() => { const m = document.querySelector('#spieler audio, #spieler video'); return m ? { zeit: m.currentTime, pausiert: m.paused, fehler: m.error?.code || null } : null; });
  ok('Aufnahme spielt im gemeinsamen Spieler', spielt && spielt.zeit > 0.5 && !spielt.fehler, JSON.stringify(spielt));
  await bild(page, '18-spieler');
  await page.evaluate(() => { location.hash = '#/ort/emdr-2'; }); await settle(page, 1500);
  const weiter = await page.evaluate(() => { const m = document.querySelector('#spieler audio, #spieler video'); return m && !m.paused; });
  ok('Spieler läuft bei Navigation weiter', weiter);
  await page.locator('#spieler [data-t=zu]').click();

  // Tragen und Einfangen
  await page.evaluate(() => { location.hash = '#/ort/emdr-2'; }); await settle(page, 2000);
  await page.locator('#o-tragen').click(); await settle(page, 400);
  const ziel = await page.evaluate(async () => { const { A } = await import('/js/main.mjs'); const i = A.daten.orte.findIndex((o) => o.t === 'Flashbacks'); return A.karte.schirm(A.daten.orte[i].x, A.daten.orte[i].y); });
  await page.mouse.move(300, 300); await page.mouse.move(ziel.x + 30, ziel.y - 40, { steps: 25 }); await page.waitForTimeout(500);
  await bild(page, '10-energie-tragen');
  await page.mouse.move(ziel.x, ziel.y, { steps: 6 }); await page.mouse.click(ziel.x, ziel.y); await settle(page, 600);
  const hand = await page.locator('#hand-liste li').count(); ok('Zweiten Ort bewusst eingefangen', hand === 2, `${hand} in der Hand`);
  await page.mouse.move(ziel.x - 80, ziel.y + 60, { steps: 20 }); await page.waitForTimeout(400);
  await bild(page, '11-kombination');
  ok('Kombination zeigt gemeinsame Nachbarn', /gemeinsame|gemeinsamer|keine gemeinsamen/.test(await page.locator('#hand-hinweis').innerText()), await page.locator('#hand-hinweis').innerText());
  // Lösen eines Elements
  await page.locator('#hand-liste li').nth(1).getByRole('button').click(); await page.waitForTimeout(300);
  ok('Element wieder gelöst', (await page.locator('#hand-liste li').count()) === 1);
  await page.mouse.click(ziel.x, ziel.y); await settle(page, 400);

  // Werkbank: eigene Fuge anlegen
  await page.locator('#hand-fuge').click(); await settle(page);
  await page.fill('#w-titel', 'Prüffuge: Verfahren und Erleben');
  await page.fill('#r0', 'Verfahren (synthetisch)'); await page.selectOption('#d0', 'aus');
  await page.fill('#r1', 'Erleben (synthetisch)'); await page.selectOption('#d1', 'an');
  await page.getByRole('button', { name: /^Bedingung:/ }).click();
  await page.fill('#w-aussage', 'Synthetische Prüfaussage: Unter welchen Bedingungen lese ich beides zusammen?');
  await page.fill('#w-grenze', 'Kein Wirksamkeitsnachweis. Nur Prüfdaten.');
  await page.locator('#w-dazu').fill('Dissoz'); await page.waitForTimeout(300);
  await page.locator('#w-treffer li').first().dispatchEvent('pointerdown'); await page.waitForTimeout(300);
  await bild(page, '12-werkbank');
  // Kontrast der Eingabefelder messen
  const kontrast = await page.evaluate(() => {
    const lum = (c) => { const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const el = document.querySelector('#w-aussage'); const cs = getComputedStyle(el);
    const a = lum(cs.color); const b = lum(cs.backgroundColor); const rand = lum(cs.borderTopColor);
    return { text: ((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(1), rahmen: ((Math.max(rand, b) + 0.05) / (Math.min(rand, b) + 0.05)).toFixed(1) };
  });
  ok('Eingabe kontrastreich', Number(kontrast.text) >= 7 && Number(kontrast.rahmen) >= 3, JSON.stringify(kontrast));
  await page.locator('#w-speichern').click(); await settle(page, 1800);
  ok('Eigene Fuge gespeichert', (await hash(page)).startsWith('#/eigen/'), await hash(page));
  await bild(page, '13-eigene-fuge');
  const datei = JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8'));
  ok('Datei im Prüfdatenordner', datei.gefuege.length === 1 && datei.gefuege[0].teile.length === 3, `${datei.gefuege[0].teile.map((t) => `${t.name} als ${t.rolle || '–'}`).join('; ')}`);
  // Neuladen und Wiederöffnen
  const eigenHash = await hash(page);
  await page.reload(); await settle(page, 2500);
  ok('Nach Neuladen wieder geöffnet', (await page.locator('#blatt-inhalt h1').innerText()).includes('Prüffuge'));
  // Bearbeiten
  await page.locator('#e-bearbeiten').click(); await settle(page, 800);
  await page.fill('#w-aussage', 'Geänderte synthetische Prüfaussage.'); await page.locator('#w-speichern').click(); await settle(page, 1500);
  const nach = JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8'));
  ok('Bearbeitung mit Verlauf', nach.gefuege[0].aussage.startsWith('Geänderte') && nach.gefuege[0].verlauf.length === 2, nach.gefuege[0].verlauf.map((v) => v.was).join(' | '));
  // Perspektivwechsel bewahrt Kamera und Auswahl
  const vorher = await page.evaluate(async () => { const { A } = await import('/js/main.mjs'); return { cam: { ...A.karte.cam }, z: A.karte.zoom, h: location.hash }; });
  await page.locator('#linsen-knopf').click(); await page.locator('[data-linse=fugen]').click(); await page.waitForTimeout(500);
  const nachher = await page.evaluate(async () => { const { A } = await import('/js/main.mjs'); return { cam: { ...A.karte.cam }, z: A.karte.zoom, h: location.hash }; });
  ok('Perspektivwechsel bewahrt Kamera und Auswahl', Math.abs(vorher.cam.x - nachher.cam.x) < 0.5 && vorher.z === nachher.z && vorher.h === nachher.h);
  await bild(page, '14-perspektive-fugenarten');
  await page.locator('#linsen-knopf').click(); await page.locator('[data-linse=geltung]').click(); await page.waitForTimeout(400);
  await page.evaluate(() => { location.hash = '#/gebiet/traumaatlas'; }); await settle(page, 1800);
  await bild(page, '15-perspektive-herkunft');
  await page.locator('#linsen-knopf').click(); await page.locator('[data-linse=gebiete]').click(); await page.waitForTimeout(300);
  // Notiz an einem Ort
  await page.evaluate(() => { location.hash = '#/ort/flashbacks'; }); await settle(page, 1800);
  await page.fill('#a-text', 'Synthetische Prüffrage an diesem Ort.'); await page.locator('#a-speichern').click(); await settle(page, 800);
  await page.reload(); await settle(page, 2500);
  const notiz = await page.locator('#o-eigene textarea[aria-label="Notiz bearbeiten"]').inputValue().catch(() => '');
  ok('Notiz nach Neuladen am selben Ort', notiz.includes('Prüffrage'), notiz);
  await page.locator('#o-eigene').scrollIntoViewIfNeeded(); await bild(page, '16-notiz-am-ort');
  // Löschen mit Rückgängig, dann endgültig
  await page.evaluate((h) => { location.hash = h; }, eigenHash); await settle(page, 1500);
  await page.locator('#e-loeschen').click(); await page.locator('#meldung button', { hasText: 'Rückgängig' }).waitFor(); await settle(page, 300);
  ok('Gelöscht', JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8')).gefuege.length === 0);
  await page.locator('#meldung button', { hasText: 'Rückgängig' }).click(); await settle(page, 1200);
  ok('Rückgängig stellt wieder her', JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8')).gefuege.length === 1);
  await page.locator('#e-loeschen').click(); await page.locator('#meldung button', { hasText: 'Rückgängig' }).waitFor(); await settle(page, 1200);
  ok('Endgültig gelöscht', JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8')).gefuege.length === 0);
  // Tastatur
  await page.evaluate(() => { location.hash = '#/ort/emdr-2'; }); await settle(page, 1600);
  await page.locator('#ueberlage').focus(); const h0 = await hash(page);
  await page.keyboard.press('ArrowRight'); await settle(page, 900); const h1 = await hash(page);
  ok('Tastatur: Pfeil wählt Nachbarort', h1 !== h0 && h1.startsWith('#/ort/'), `${h0} → ${h1}`);
  await page.keyboard.press('Escape'); await settle(page, 900);
  ok('Tastatur: Escape geht eine Ebene zurück', (await hash(page)).startsWith('#/gebiet/'), await hash(page));
  await page.keyboard.press('Tab'); const fokus = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return `${e.tagName} outline ${cs.outlineStyle} ${cs.outlineWidth}`; });
  ok('Fokus sichtbar', /solid|auto/.test(fokus), fokus);
  // Netz: keine fremden Ziele
  const fremd = netz.filter((u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'));
  ok('Keine Anfragen an fremde Dienste beim Gesamtweg', fremd.length === 0, fremd.slice(0, 5).join(' '));
  ok('Keine Skriptfehler (Desktop)', fehler.length === 0, fehler.slice(0, 3).join(' | '));
  const v = await stop(); ok('Bewegungsaufnahme Desktop', v.bilder > 100, `${v.bilder} Bilder, ${v.sekunden} s`); await ctx.close(); await browser.close();
}

// ---------------- Schmal: Telefon mit Berührung ----------------
async function schmal() {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage(); const fehler = []; const stop = await aufnahme(page, 'gesamtweg-schmal'); page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(BASE); await settle(page, 2200); await bild(page, '20-schmal-ueberblick');
  await page.getByRole('button', { name: 'TraumaAtlas' }).first().tap(); await settle(page);
  await page.locator('#g-orte button').first().tap(); await settle(page);
  await bild(page, '21-schmal-ort');
  const sheet = await page.evaluate(() => { const b = document.querySelector('#blatt').getBoundingClientRect(); return { top: b.top, h: b.height, w: b.width, vw: innerWidth }; });
  ok('Schmal: Blatt von unten, Karte sichtbar', sheet.top > 200 && sheet.w <= sheet.vw, JSON.stringify(sheet));
  await page.locator('#o-stern [data-fuge]').first().tap({ force: true }); await settle(page); await bild(page, '22-schmal-fuge');
  await page.evaluate(() => { location.hash = '#/ort/forschungsstand-und-offene-fragen/original'; }); await settle(page, 2500);
  await bild(page, '23-schmal-original');
  const ueber = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || [...document.querySelectorAll('.lesen article *')].some((e) => e.getBoundingClientRect().right > innerWidth + 1 && getComputedStyle(e).overflowX !== 'auto'));
  ok('Schmal: kein waagerechtes Abschneiden im Original', !ueber);
  await page.evaluate(() => { location.hash = '#/werkbank'; }); await settle(page, 1500); await bild(page, '24-schmal-werkbank');
  ok('Keine Skriptfehler (schmal)', fehler.length === 0, fehler.join(' | '));
  const v = await stop(); ok('Bewegungsaufnahme schmal', v.bilder > 30, `${v.bilder} Bilder, ${v.sekunden} s`); await ctx.close(); await browser.close();
}

// ---------------- Ausfall der Grafiktechnik, reduzierte Bewegung ----------------
async function ausfall() {
  const browser = await launch({ args: ['--disable-webgl', '--disable-webgl2', '--disable-3d-apis'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(BASE); await settle(page, 2200);
  const st = await page.evaluate(async () => { const { A } = await import('/js/main.mjs'); return { modus: A.gelaende.modus, ruhig: A.ruhig, cls: document.querySelector('#app').className }; });
  ok('WebGL-Ausfall: Canvas-Gelände übernimmt', st.modus === 'canvas', JSON.stringify(st));
  ok('Reduzierte Bewegung erkannt', st.ruhig === true);
  await bild(page, '30-ohne-webgl-ueberblick');
  await page.evaluate(() => { location.hash = '#/ort/emdr-2'; }); await page.waitForTimeout(250);
  const sofort = await page.evaluate(async () => { const { A } = await import('/js/main.mjs'); return A.karte.flug === null; });
  ok('Reduzierte Bewegung: kein Flug, sofortiger Wechsel', sofort);
  await settle(page, 600); await bild(page, '31-ohne-webgl-ort');
  await page.locator('#o-stern [data-fuge]').first().click({ force: true }); await settle(page, 600); await bild(page, '32-ohne-webgl-fuge');
  ok('Keine Skriptfehler (ohne WebGL)', fehler.length === 0, fehler.join(' | '));
  await ctx.close(); await browser.close();
}

// ---------------- Eingebettet wie im Variantenraum ----------------
async function eingebettet() {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const raum = await page.goto(RAUM).then((r) => r?.ok()).catch(() => false);
  if (!raum) { ok('Variantenraum erreichbar', false, 'Raum antwortet nicht; eingebettete Prüfung offen'); await browser.close(); return; }
  // Nur der DOM dieser Prüfseite wird ergänzt; Dateien des Raums bleiben unverändert.
  await page.evaluate((src) => {
    const f = document.createElement('iframe'); f.id = 'pruef-frame'; f.src = src; f.setAttribute('sandbox', 'allow-scripts allow-same-origin'); f.referrerPolicy = 'no-referrer';
    f.style.cssText = 'position:fixed;left:20px;top:20px;width:515px;height:603px;border:1px solid #ccc;background:#fff;z-index:99999';
    document.body.append(f);
  }, BASE + '/');
  await page.waitForTimeout(3500);
  const frame = page.frame({ url: new RegExp(`^${BASE}`) });
  ok('Eingebettet: lädt im Sandbox-Rahmen', !!frame);
  if (!frame) { await browser.close(); return; }
  await page.locator('#pruef-frame').screenshot({ path: join(OUT, 'bilder', '40-eingebettet-ueberblick.png') });
  await frame.evaluate(() => { location.hash = '#/ort/emdr-2'; }); await page.waitForTimeout(2000);
  await page.locator('#pruef-frame').screenshot({ path: join(OUT, 'bilder', '41-eingebettet-ort.png') });
  await frame.evaluate(() => { location.hash = '#/werkbank'; }); await page.waitForTimeout(1500);
  await frame.fill('#w-titel', 'Eingebettete Prüffuge');
  await frame.evaluate(() => { const i = document.querySelector('#w-dazu'); i.value = 'Flashb'; i.dispatchEvent(new Event('input')); });
  await page.waitForTimeout(300); await frame.locator('#w-treffer li').first().dispatchEvent('pointerdown');
  await frame.locator('#w-speichern').click(); await page.waitForTimeout(1500);
  const gespeichert = JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8')).gefuege.some((g) => g.titel === 'Eingebettete Prüffuge');
  ok('Eingebettet: Speichern funktioniert im Sandbox-Rahmen', gespeichert);
  await page.locator('#pruef-frame').screenshot({ path: join(OUT, 'bilder', '42-eingebettet-eigene-fuge.png') });
  await frame.evaluate(() => { location.hash = '#/ort/forschungsstand-und-offene-fragen/original'; }); await page.waitForTimeout(2500);
  const lesbar = await frame.evaluate(() => { const s = document.querySelector('#blatt-inhalt'); const r = s.getBoundingClientRect(); return { oben: r.top, hoehe: r.height, gesamt: s.scrollHeight, fh: innerHeight }; });
  ok('Eingebettet: Original im eigenen Leseraum scrollbar', lesbar.hoehe > 300 && lesbar.gesamt > lesbar.hoehe, JSON.stringify(lesbar));
  await page.locator('#pruef-frame').screenshot({ path: join(OUT, 'bilder', '43-eingebettet-original.png') });
  await browser.close();
}

try {
  if (!nur || nur === 'desktop') await desktop();
  if (!nur || nur === 'schmal') await schmal();
  if (!nur || nur === 'ausfall') await ausfall();
  if (!nur || nur === 'eingebettet') await eingebettet();
} catch (error) { ok('Prüflauf abgebrochen', false, error.message.split('\n')[0]); }
finally { server.kill(); }
await writeFile(join(OUT, `protokoll${nur ? `-${nur}` : ''}.json`), JSON.stringify({ zeit: new Date().toISOString(), basis: BASE, datenordner: DATA, ergebnisse: log }, null, 2));
const fail = log.filter((l) => !l.pass).length; console.log(`\n${log.length - fail}/${log.length} bestanden`);
process.exit(fail ? 1 : 0);
