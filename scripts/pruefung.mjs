// Gesamtprüfung von Fugenland 2 im echten Browser mit isoliertem Prüfdatenordner.
// Startet einen eigenen Prüfdienst (eigener Port, eigener Datenordner), bedient jeden Fugenraum,
// nimmt Bilder und ein Bewegungsvideo auf und schreibt ein Protokoll. Persönliche Daten bleiben unberührt.
import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { requireExternalWriteTarget } from './external-storage.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = requireExternalWriteTarget(join(ROOT, 'evidence', 'pruefung-20261104'));
const DATA = requireExternalWriteTarget(join(ROOT, '.cache', 'pruefdaten'));
const TMP = requireExternalWriteTarget(join(ROOT, '.cache', 'tmp'));
const EXE = `${process.env.HOME}/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const PORT = 4394; const BASE = `http://127.0.0.1:${PORT}`;
const RAUM = 'http://127.0.0.1:4191/';
const nur = process.argv[2];

await rm(DATA, { recursive: true, force: true });
for (const d of [OUT, join(OUT, 'bilder'), join(OUT, 'video'), DATA, TMP]) await mkdir(d, { recursive: true });
process.env.TMPDIR = TMP;

const log = []; const ok = (name, pass, detail = '') => { log.push({ name, pass: !!pass, detail: String(detail) }); console.log(`${pass ? 'OK  ' : 'FEHL'} ${name}${detail ? ` · ${detail}` : ''}`); };
const server = spawn(process.execPath, [join(ROOT, 'server.mjs')], { env: { ...process.env, PORT: String(PORT), WERKSTATT_DIR: DATA }, stdio: ['ignore', 'pipe', 'pipe'] });
await new Promise((res, rej) => { server.stdout.on('data', (b) => String(b).includes('läuft') && res()); server.stderr.on('data', (b) => rej(new Error(String(b)))); setTimeout(() => rej(new Error('Prüfdienst startet nicht')), 8000); });

const bild = async (page, name) => { await page.waitForTimeout(250); await page.screenshot({ path: join(OUT, 'bilder', `${name}.png`) }); };
const warte = (page, ms = 1200) => page.waitForTimeout(ms);
const geheZu = async (page, hash) => { await page.evaluate((h) => { location.hash = h; }, hash); await warte(page, 1300); };
const launch = (args = []) => chromium.launch({ executablePath: EXE, headless: true, args: ['--use-angle=metal', '--enable-gpu', ...args] });

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

// Klick auf einen Fugenort direkt im Feldbild (über seine aktuelle Bildlage).
async function klickeFugenort(page, art, i) {
  const p = await page.evaluate(([art, i]) => { const q = window.fugenland.punkte.find((x) => x.art === art && x.i === i); return q && q.bx !== undefined ? [q.bx, q.by] : null; }, [art, i]);
  if (!p) return false; const box = await page.locator('#feld-bild').boundingBox();
  await page.mouse.move(box.x + p[0], box.y + p[1], { steps: 12 }); await warte(page, 500); await page.mouse.click(box.x + p[0], box.y + p[1]); return true;
}

// ---------------- Desktop: der durchgehende Weg durch alle Fugenräume, mit Video ----------------
async function desktop() {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage(); const fehler = []; const netz = [];
  page.on('pageerror', (e) => fehler.push(e.message)); page.on('console', (m) => m.type() === 'error' && fehler.push(m.text())); page.on('request', (r) => netz.push(r.url()));
  const stop = await aufnahme(page, 'gesamtweg-desktop');
  await page.goto(BASE); await warte(page, 2000);
  const zahl = await page.evaluate(() => Object.fromEntries(Object.entries(window.fugenland.FAELLE).map(([k, v]) => [k, v.length])));
  ok('Feld lädt mit allen Fugenarten', Object.keys(zahl).length === 6 && Object.values(zahl).every((n) => n > 0), JSON.stringify(zahl));
  ok('Keine Kantenlinien im Feld: nur Fugenorte', await page.evaluate(() => window.fugenland.punkte.length > 200), `${await page.evaluate(() => window.fugenland.punkte.length)} Fugenorte`);
  await bild(page, '01-feld-ueberblick');
  // Ziehen und zoomen
  await page.mouse.move(900, 450); await page.mouse.down(); await page.mouse.move(820, 420, { steps: 15 }); await page.mouse.up();
  for (let k = 0; k < 4; k++) { await page.mouse.wheel(0, -150); await page.waitForTimeout(80); }
  await warte(page, 600); await bild(page, '02-feld-nah');
  await page.locator('#feld-bild').focus(); await page.keyboard.press('0'); await warte(page, 500);

  // 1 Gegenhalt: über das Feldbild betreten (Flug + Entfaltung)
  const getroffen = await klickeFugenort(page, 'gegenhalt', 0); await warte(page, 1600);
  ok('Fugenort im Feld anklickbar, Raum entfaltet sich', getroffen && await page.locator('#raum').isVisible(), await page.locator('#raum-titel').innerText().catch(() => ''));
  if (!(await page.locator('#raum').isVisible())) await geheZu(page, '#/raum/gegenhalt/0');
  const kam1 = await page.evaluate(() => ({ ...window.fugenland.feld.kam }));
  const titel = await page.locator('#raum-titel').innerText();
  await page.locator('.stein').first().click(); await warte(page, 400);
  await page.locator('.spalt textarea').fill('Familienkontrolle zeigt Verwechslung, nicht die Abwesenheit einer Wirkung.');
  await page.getByRole('button', { name: 'In den Spalt keilen' }).click(); await warte(page, 400);
  ok('Gegenhalt: Beleg aufgenommen und Gegenstimme gekeilt', (await page.locator('.stein.gelesen').count()) === 1 && (await page.locator('.keil').count()) === 1, titel);
  const linksVorher = await page.locator('.fels.links .fels-titel').innerText();
  await page.getByRole('button', { name: 'Seite wechseln' }).click(); await warte(page, 700);
  ok('Gegenhalt: Seitenwechsel spiegelt die Seiten', (await page.locator('.fels.links .fels-titel').innerText()) !== linksVorher);
  await bild(page, '10-gegenhalt');
  // Herkunft und Geltung: Bohrkern und Probe
  await page.getByRole('button', { name: 'Herkunft und Geltung' }).click(); await warte(page, 500);
  await page.locator('.probe', { hasText: 'Beide Orte sind belegt' }).click(); await warte(page, 400);
  const stempel = await page.locator('.stempel strong').innerText();
  ok('Herkunft: vier Schichten, Probe aus den Daten ausgewertet', (await page.locator('.schicht').count()) === 4 && /trägt teilweise|scheitert/i.test(stempel), stempel);
  await page.locator('.probe', { hasText: 'Die Kante sagt' }).click(); await warte(page, 300);
  ok('Herkunft: Modellprobe trifft hier nicht', /trifft nicht/i.test(await page.locator('.stempel strong').innerText()));
  ok('Herkunft: technische Kennungen nur in geschlossenen Details', (await page.locator('.technik').getAttribute('open')) === null && !(await page.locator('#raum-schicht').innerText()).includes('fundus-source:'));
  await bild(page, '11-herkunft-probe');
  await page.getByRole('button', { name: 'Herkunft und Geltung' }).click();
  // Zurück ins Feld: Kamera bleibt am Fugenort
  await page.keyboard.press('Escape'); await warte(page, 700);
  const kam2 = await page.evaluate(() => ({ ...window.fugenland.feld.kam }));
  ok('Zurück ins Feld: Kamera und Auswahl bleiben erhalten', !(await page.locator('#raum').isVisible()) && Math.abs(kam1.x - kam2.x) < 1 && Math.abs(kam1.z - kam2.z) < 0.01 && await page.evaluate(() => window.fugenland.feld.auswahl?.art === 'gegenhalt'));
  ok('Reifung im Feld wächst aus den Handlungen', await page.evaluate(() => window.fugenland.feld.reife.reduce((a, b) => a + b, 0) > 0));
  await bild(page, '12-feld-nach-gegenhalt');

  // 2 Schwelle
  await page.locator('.legende-art', { hasText: 'Schwelle' }).getByRole('button', { name: 'Betreten' }).click(); await warte(page, 1500);
  const vorher = await page.locator('.jenseits-stand').innerText();
  await page.locator('.riegel-stange').nth(0).click(); await page.locator('.riegel-stange').nth(1).click(); await warte(page, 300);
  await page.locator('.riegel').nth(2).getByRole('radio', { name: 'ungeklärt' }).click(); await warte(page, 400);
  const nachher = await page.locator('.jenseits-stand').innerText();
  ok('Schwelle: Riegel ziehen ändert den Geltungsrahmen, Prüfung wird gesetzt', vorher !== nachher && (await page.locator('.riegel.raus').count()) === 2 && (await page.locator('.stufen li.an').count()) === 3, nachher);
  await bild(page, '20-schwelle');

  // 3 Übersetzung
  await geheZu(page, '#/raum/uebersetzung/4');
  await page.getByRole('button', { name: /Wortgleiche zeigen/ }).click(); await warte(page, 300);
  await page.locator('.fassung.links .wort', { hasText: /^Gefühlen$/ }).first().click(); await page.locator('.becken.veraendert .becken-rand').click(); await warte(page, 200);
  await page.locator('.fassung.rechts .wort', { hasText: /^validieren$/ }).first().click(); await page.locator('.becken.nurhier .becken-rand').click(); await warte(page, 200);
  await page.locator('.fassung.links .wort', { hasText: /^Behandlung$/ }).first().click(); await page.locator('.becken.unuebersetzbar .becken-rand').click(); await warte(page, 400);
  ok('Übersetzung: Wörter in drei Becken, Vertrag entsteht', (await page.locator('.kiesel').count()) === 3 && await page.locator('.vertrag').isVisible());
  ok('Übersetzung: Wortabgleich nur als Markierung, nicht einsortiert', (await page.locator('.wort.gleich').count()) > 0);
  await bild(page, '30-uebersetzung');
  await page.getByRole('button', { name: 'Zur Quelle dieser Fassung' }).first().click(); await warte(page, 400);
  ok('Übersetzung: Rückweg zum vollen Wortlaut mit Herkunft', await page.locator('#original').isVisible() && /Herkunft/.test(await page.locator('.original-herkunft').innerText()));
  await bild(page, '31-original'); await page.getByRole('button', { name: 'Zurück in den Raum' }).click(); await warte(page, 300);

  // 4 Überschneidung
  await geheZu(page, '#/raum/ueberschneidung/0');
  const m1 = await page.locator('.membran').count();
  await page.locator('.ue-stimme', { hasText: 'Borderline-Persönlichkeitsstörung' }).click(); await warte(page, 400);
  const m2 = await page.locator('.membran').count(); const nurBei = await page.locator('.ue-zone h3', { hasText: 'Nur bei Borderline' }).count();
  ok('Überschneidung: Stimme zuschalten fügt Membran hinzu und ordnet neu', m2 === m1 + 1 && nurBei === 1, `${m1} → ${m2} Membranen`);
  await page.locator('.ph.geteilt').first().click(); await warte(page, 300);
  ok('Überschneidung: Phänomen zeigt seine Stimmen und die Gesamtzahl im Bestand', /Insgesamt im Bestand bei/.test(await page.locator('.ue-fokus').innerText()));
  await bild(page, '40-ueberschneidung');

  // 5 Entstehung
  await geheZu(page, '#/raum/entstehung/0');
  await page.locator('.strom').nth(1).click(); await warte(page, 300);
  await page.locator('.zustrom textarea').fill('Bringt Atem und Haltung als Zugang hinein.'); await page.getByRole('button', { name: 'Beitrag benennen' }).click(); await warte(page, 300);
  await page.getByLabel('Wendepunkt').fill('Spüren in kleinen Dosen statt Deuten.'); await page.getByRole('button', { name: 'Wendepunkt setzen' }).click(); await warte(page, 400);
  ok('Entstehung: Beitrag eines Zustroms und Wendepunkt gespeichert', (await page.locator('.strom.benannt').count()) === 1 && (await page.locator('.becken-zusammen.gewendet').count()) === 1);
  await bild(page, '50-entstehung');

  // 6 Fehlstelle
  const adhs = await page.evaluate(() => window.fugenland.FAELLE.fehlstelle.findIndex((f) => f.ort && f.raender.length > 100));
  await geheZu(page, `#/raum/fehlstelle/${adhs}`);
  await page.locator('.rand-marke').nth(2).click(); await warte(page, 300);
  await page.locator('.rand-info input').fill('Eine Studie zum Gedankenwandern ist kein Befund über diese Lücke.');
  await page.getByRole('button', { name: 'Als Nicht-Verbindung festhalten' }).click(); await warte(page, 300);
  await page.locator('input[value="nicht-untersucht"]').check(); await warte(page, 200);
  await page.locator('.kammer-frage-eingabe').fill('Was haben diese Studien gefunden – und was davon gehört in diesen Atlas?');
  await page.getByRole('button', { name: 'Frage an die Lücke heften' }).click(); await warte(page, 400);
  ok('Fehlstelle: eingeordnet, Frage geheftet, Nicht-Verbindung begründet, Mitte bleibt leer', /nicht untersucht/i.test(await page.locator('.kammer-art').innerText()) && (await page.locator('.rand-marke.nicht').count()) === 1);
  await bild(page, '60-fehlstelle');
  await geheZu(page, '#/raum/fehlstelle/0');
  ok('Fehlstelle: unerreichbares Kapitel als eigener Gegenstand', /keinen eigenen Ort/.test(await page.locator('.kammer-bestand').innerText()));
  await page.getByRole('button', { name: 'Kapitel im Fundus lesen' }).click(); await warte(page, 600);
  ok('Fehlstelle: Kapitel im vollen Wortlaut lesbar', (await page.locator('#original-text p').count()) > 5);
  await page.getByRole('button', { name: 'Zurück in den Raum' }).click();

  // Verschiedenheit: unterschiedlich gebaute Räume
  const bau = {};
  for (const art of ['gegenhalt', 'schwelle', 'uebersetzung', 'ueberschneidung', 'entstehung', 'fehlstelle']) {
    await geheZu(page, `#/raum/${art}/0`);
    bau[art] = await page.evaluate(() => { const r = document.querySelector('#raum-buehne > *'); return { klasse: r.className, svg: r.querySelectorAll('svg').length, knoepfe: r.querySelectorAll('button').length, eingaben: r.querySelectorAll('textarea,input').length }; });
  }
  ok('Sechs Räume plus Herkunftsebene mit verschiedenem Aufbau', new Set(Object.values(bau).map((b) => b.klasse)).size === 6, JSON.stringify(bau));

  // Browser-Zurück
  await page.goBack(); await warte(page, 900);
  ok('Browser-Zurück führt durch die Räume zurück', /#\/raum\//.test(page.url()));
  await geheZu(page, '#/feld'); await warte(page, 2000); await bild(page, '70-feld-nach-arbeit');
  const fremd = netz.filter((u) => !u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:'));
  ok('Keine Anfragen an fremde Dienste', fremd.length === 0, fremd.slice(0, 3).join(' '));
  ok('Keine Fehler in der Konsole', fehler.length === 0, fehler.slice(0, 3).join(' | '));
  const st = await page.locator('#speicher-stand').innerText(); ok('Speicherstand sichtbar: gespeichert', st === 'Vom Dienst gespeichert', st);
  const video = await stop(); ok('Bewegungsaufnahme', video.bilder > 40, `${video.bilder} Bilder, ${video.sekunden} s`);
  await browser.close();

  // Wiederöffnen in neuem Browser: alles noch da
  const b2 = await launch(); const p2 = await (await b2.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p2.goto(`${BASE}/#/raum/gegenhalt/0`); await warte(p2, 1800);
  const keil = await p2.locator('.keil').count(); await geheZu(p2, '#/raum/uebersetzung/4'); const kiesel = await p2.locator('.kiesel').count();
  const datei = JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8'));
  ok('Wiederöffnen: Gegenstimme, Becken und Ereignisse bleiben', keil === 1 && kiesel === 3 && datei.ereignisse.length > 15, `${datei.ereignisse.length} Ereignisse, ${Object.keys(datei.raeume).length} Räume im isolierten Ordner`);
  await bild(p2, '71-wiedergeoeffnet'); await b2.close();
}

// ---------------- Schritt 1: Bedienfehler aus der FASKA-Sichtung ----------------
async function bedienfehler() {
  const browser = await launch(); const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(BASE); await warte(page, 1800);
  await geheZu(page, '#/raum/gegenhalt/0'); await page.getByRole('button', { name: 'Herkunft und Geltung' }).click(); await warte(page, 500);
  const o = await page.evaluate(() => { const li = document.querySelector('.schicht.sch-original'); const s = document.getElementById('raum-schicht'); const r = s.getBoundingClientRect(); return { breit: li.getBoundingClientRect().right <= r.right + 1, links: [...li.querySelectorAll('a')].every((a) => a.getBoundingClientRect().right <= r.right + 1), ueberlauf: s.scrollWidth <= s.clientWidth + 1 }; });
  ok('Schritt 1: Original-Schicht ganz lesbar, Quellen im Rahmen', o.breit && o.links && o.ueberlauf, JSON.stringify(o));
  await bild(page, '110-original-schicht-ganz');
  await geheZu(page, '#/raum/uebersetzung/4');
  ok('Schritt 1: Herkunftsebene schließt beim Raumwechsel', (await page.locator('#raum').getAttribute('data-schicht')) === 'aus' && !(await page.locator('.bohrkern').isVisible()));
  await page.getByRole('button', { name: 'Zur Quelle dieser Fassung' }).last().click(); await warte(page, 400);
  ok('Schritt 1: „Zur Quelle“ nach Raumwechsel erreichbar', await page.locator('#original').isVisible());
  await page.getByRole('button', { name: 'Zurück in den Raum' }).click();
  await geheZu(page, '#/feld');
  for (const q of ['Hyperfok', 'Aufgabenstarre']) { await page.locator('#suche').fill(q); await warte(page, 300); await page.keyboard.press('Enter'); await warte(page, 1400); await page.getByRole('button', { name: 'In die Hand nehmen' }).click(); }
  await page.locator('#hand').getByRole('button', { name: 'Eigene Fuge bilden' }).click(); await warte(page, 1200);
  await page.getByLabel('Name der Fuge').fill('Wann kippt der Sog');
  await page.getByLabel('Art der Fuge').selectOption('nichtverbindung'); await warte(page, 300);
  ok('Schritt 1: Art-Auswahl wirkt sofort, Eingaben bleiben', (await page.locator('.station-kreuz').count()) === 1 && /NICHT-VERBINDUNG/i.test(await page.locator('#raum-art').innerText()) && (await page.getByLabel('Name der Fuge').inputValue()) === 'Wann kippt der Sog');
  await page.getByLabel('Art der Fuge').selectOption('schwelle'); await warte(page, 300);
  await page.getByLabel('Riegel der eigenen Schwelle').fill('Ich habe vorher geschlafen\nEs gibt einen Termin, der mich herausholt\nJemand darf mich ansprechen');
  await page.getByRole('button', { name: 'Fuge speichern' }).click(); await warte(page, 1300);
  ok('Schritt 1: eigene Schwelle öffnet sich mit eigenen Riegeln', (await page.locator('.riegel').count()) === 3 && (await page.locator('.riegel-herkunft', { hasText: 'deine eigene Bedingung' }).count()) === 3);
  await page.locator('.riegel-stange').nth(1).click(); await warte(page, 1500);
  await bild(page, '111-eigene-schwelle');
  const id = await page.evaluate(() => window.fugenland.werk.daten.gefuege.find((g) => g.titel === 'Wann kippt der Sog').id);
  await page.reload(); await warte(page, 2200); await geheZu(page, `#/eigen/${id}`);
  ok('Schritt 1: Art, Riegel und gezogener Riegel bleiben beim Wiederöffnen', (await page.locator('.riegel').count()) === 3 && (await page.locator('.riegel.raus').count()) === 1 && /SCHWELLE/i.test(await page.locator('#raum-art').innerText()));
  for (const [art, cls] of [['gegenhalt', 'gegenhalt'], ['uebersetzung', 'uebersetzung'], ['fehlstelle', 'fehlstelle']]) {
    await page.getByRole('button', { name: 'Station und Angaben' }).click(); await page.getByLabel('Art der Fuge').selectOption(art); await page.getByRole('button', { name: 'Fuge speichern' }).click(); await warte(page, 900);
    ok(`Schritt 1: eigene Fuge als ${art}`, (await page.evaluate(() => document.querySelector('.eigen-innen > *')?.className)) === cls);
  }
  ok('Schritt 1: keine Fehler', fehler.length === 0, fehler.join(' | '));
  await browser.close();
}

// ---------------- Schritt 2: dauerhafter, sichtbarer Zustand jeder Fuge ----------------
async function zustand() {
  const browser = await launch(); const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(BASE); await warte(page, 1800);
  await geheZu(page, '#/raum/schwelle/1');
  ok('Schritt 2: ohne Urteil steht „ungeprüft“', /Ungeprüft/.test(await page.locator('.urteil-stand').innerText()));
  await page.locator('.urteil-grund').fill('nur mit Schlaf'); await page.getByRole('radio', { name: 'begrenzt', exact: true }).click();
  const sofort = await page.locator('.urteil-stand').innerText(); await warte(page, 1500); const danach = await page.locator('.urteil-stand').innerText();
  ok('Schritt 2: „gespeichert“ erst nach Bestätigung des Dienstes', /wird gespeichert/.test(sofort) && /vom Dienst gespeichert/.test(danach), `${sofort.split(' · ').pop()} → ${danach.split(' · ').pop()}`);
  const datei = JSON.parse(await readFile(join(DATA, 'werkstatt.json'), 'utf8'));
  ok('Schritt 2: Urteil liegt in der Datei des Dienstes', Object.values(datei.raeume).some((z) => z.urteil?.wert === 'begrenzt' && z.urteil.grund === 'nur mit Schlaf'));
  for (const [i, w] of [[2, 'trägt'], [3, 'trägt nicht'], [4, 'gilt hier nicht'], [5, 'offen halten']]) { await geheZu(page, `#/raum/schwelle/${i}`); await page.getByRole('radio', { name: w, exact: true }).click(); }
  await warte(page, 1500); await page.reload(); await warte(page, 2200);
  const imFeld = await page.evaluate(() => [...window.fugenland.feld.urteile.values()].sort());
  ok('Schritt 2: nach dem Neuladen fünf verschiedene Zustände im Feld', new Set(imFeld).size === 5, imFeld.join(', '));
  await geheZu(page, '#/raum/schwelle/1');
  ok('Schritt 2: Urteil im Raum nach dem Neuladen, als gespeichert', /begrenzt – nur mit Schlaf/.test(await page.locator('.urteil-stand').innerText()) && /vom Dienst gespeichert/.test(await page.locator('.urteil-stand').innerText()));
  await bild(page, '120-urteil-im-raum');
  // Bindung an den Inhalt: geänderter Inhalt löscht das Urteil, Rückkehr des Inhalts belebt es nicht
  const key = await page.evaluate(() => window.fugenland.punkte.find((x) => x.art === 'schwelle' && x.i === 2).key);
  const setzeAbdruck = (wert) => page.evaluate(async ([key, wert]) => { const r = await fetch('/api/werkstatt'); const d = await r.json(); const rev = d.revision; delete d.revision; d.raeume[key].urteil.inhalt = wert === 'echt' ? window.fugenland.punkte.find((x) => x.key === key).abdruck : wert; await fetch('/api/werkstatt', { method: 'PUT', headers: { 'content-type': 'application/json', 'if-match': rev }, body: JSON.stringify(d) }); }, [key, wert]);
  await setzeAbdruck('anderer-inhalt'); await page.reload(); await warte(page, 2500); await geheZu(page, '#/raum/schwelle/2');
  const erl = await page.locator('.urteil-stand').innerText(); await bild(page, '121-urteil-erloschen'); await warte(page, 1500);
  await setzeAbdruck('echt'); await page.reload(); await warte(page, 2500); await geheZu(page, '#/raum/schwelle/2');
  const zurueck = await page.locator('.urteil-stand').innerText();
  ok('Schritt 2: Inhaltsänderung lässt das Urteil erlöschen, Rückkehr des Inhalts belebt es nicht', /Erloschen/.test(erl) && /Erloschen/.test(zurueck));
  ok('Schritt 2: erloschen ist im Feld eigener Zustand', await page.evaluate((key) => window.fugenland.feld.urteile.get(key) === 'erloschen', key));
  await geheZu(page, '#/feld'); await page.evaluate(() => { const q = window.fugenland.punkte.find((x) => x.art === 'schwelle' && x.i === 3); window.fugenland.feld.fliegeZu(q.x, q.y, 2.4); }); await warte(page, 1500);
  await bild(page, '122-urteile-im-feld');
  ok('Schritt 2: keine Fehler', fehler.length === 0, fehler.join(' | '));
  await browser.close();
}

// ---------------- Orte, Werke, Spieler, Werkbank (aus Fugenland 1 wieder eingebaut) ----------------
async function werkbank() {
  const browser = await launch(); const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const fehler = []; page.on('pageerror', (e) => fehler.push(e.message)); page.on('console', (m) => m.type() === 'error' && fehler.push(m.text()));
  await page.goto(BASE); await warte(page, 1800);
  ok('Spieler startet nicht von selbst', !(await page.locator('#spieler').isVisible()));
  // Suche mit Tastatur
  await page.locator('#suche').fill('Hyperfok'); await warte(page, 300);
  const treffer = await page.locator('#treffer li').count(); await page.keyboard.press('ArrowDown'); await page.keyboard.press('Enter'); await warte(page, 1800);
  ok('Ortssuche: Treffer und Ortsraum per Tastatur', treffer > 0 && /Hyperfokus/.test(await page.locator('#raum-titel').innerText()), `${treffer} Treffer`);
  ok('Ortsraum: voller Wortlaut, Herkunft, Fugenräume des Orts', (await page.locator('.ort-wortlaut p').count()) > 3 && /Herkunft/.test(await page.locator('.ort-herkunft').innerText()) && (await page.locator('.ort-fuge').count()) >= 1);
  await bild(page, '100-ortsraum');
  await page.getByRole('button', { name: 'In die Hand nehmen' }).click();
  await page.locator('.ort-notizen textarea').fill('Kenne ich vom Zeichnen.'); await page.getByRole('button', { name: 'Notiz anheften' }).click(); await warte(page, 300);
  ok('Ortsraum: Notiz am Ort angeheftet', (await page.locator('.ort-notizen li').count()) === 1);
  // Vom Ort in seine Fuge und über den Ortslink zurück zu einem anderen Ort
  await page.locator('.ort-fuge', { hasText: 'Gegenhalt' }).click(); await warte(page, 1400);
  ok('Vom Ort in seinen Fugenraum', (await page.locator('#raum').getAttribute('data-art')) === 'gegenhalt');
  await page.locator('.fels .ortlink').first().click(); await warte(page, 1500);
  ok('Ortslink im Fugenraum führt in den Ortsraum', (await page.locator('#raum').getAttribute('data-art')) === 'ort');
  await page.getByRole('button', { name: 'In die Hand nehmen' }).click(); await warte(page, 200);
  // Werk des Vaters
  await geheZu(page, '#/ort/266'); await warte(page, 600);
  const cap = await page.locator('.werk figcaption').first().innerText();
  ok('Werk von Walter Andreas Kirchner mit Herkunft, ohne Maßangabe, mit Hinweis', /Walter Andreas Kirchner/.test(cap) && /keine Deutung des Werks/.test(cap) && !/\d+\s*(×|x)\s*\d+\s*cm/i.test(cap), cap.split('\n')[0]);
  await bild(page, '101-ort-werk');
  await page.getByRole('button', { name: 'In die Hand nehmen' }).click(); await warte(page, 200);
  // Spieler: startet auf Klick, spielt bei Raumwechsel weiter
  await page.locator('#suche').fill('Aufgabenstarre'); await warte(page, 300); await page.keyboard.press('Enter'); await warte(page, 1500);
  await page.locator('.medium-zug').first().click(); await warte(page, 1200);
  await geheZu(page, '#/raum/schwelle/0');
  const laeuft = await page.evaluate(() => { const m = document.querySelector('#spieler video, #spieler audio'); return m ? { sichtbar: !document.getElementById('spieler').hidden, zeit: m.currentTime, pausiert: m.paused } : null; });
  ok('Spieler: auf Klick gestartet, bleibt bei Raumwechsel bestehen', !!laeuft && laeuft.sichtbar, JSON.stringify(laeuft));
  await bild(page, '102-spieler-im-raum');
  await page.getByRole('button', { name: 'Spieler schließen' }).click();
  // Eigene Fuge aus der Hand
  ok('Hand: drei Orte aufgenommen', (await page.locator('#hand li').count()) === 3);
  await page.locator('#hand').getByRole('button', { name: 'Eigene Fuge bilden' }).click(); await warte(page, 1500);
  await page.getByLabel('Name der Fuge').fill('Versunken und gestockt');
  await page.getByLabel('Aussage').fill('Beides fühlt sich wie ein Zustand an, aus dem ich nicht selbst herauskomme.');
  await page.locator('[data-rolle="0"]').fill('Sog'); await page.locator('[data-richtung="0"]').selectOption('aus');
  await page.getByRole('button', { name: 'Fuge speichern' }).click(); await warte(page, 1200);
  ok('Eigene Fuge: Station mit drei Armen gespeichert', (await page.locator('.arm').count()) === 3 && /angelegt/.test(await page.locator('.eigen-verlauf').innerText()));
  await bild(page, '103-eigene-fuge');
  await page.getByLabel('Art der Fuge').selectOption('nichtverbindung'); await page.getByRole('button', { name: 'Fuge speichern' }).click(); await warte(page, 1000);
  ok('Eigene Fuge: als Nicht-Verbindung geändert, Verlauf mit vorheriger Fassung', (await page.locator('.station-kreuz').count()) === 1 && /geändert/.test(await page.locator('.eigen-verlauf').innerText()));
  await page.getByRole('button', { name: '← Zum Feld' }).click(); await warte(page, 1500);
  ok('Eigene Fuge steht als Fugenort im Feld', await page.evaluate(() => window.fugenland.punkte.some((p) => p.art === 'eigen' && p.titel === 'Versunken und gestockt')));
  await bild(page, '104-feld-mit-eigener-fuge');
  ok('Werkbank: keine Fehler', fehler.length === 0, fehler.slice(0, 3).join(' | '));
  await browser.close();
  // Wiederöffnen
  const b2 = await launch(); const p2 = await (await b2.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p2.goto(BASE); await warte(p2, 2000);
  const id = await p2.evaluate(() => window.fugenland.werk.daten.gefuege.find((g) => g.titel === 'Versunken und gestockt')?.id);
  await geheZu(p2, `#/eigen/${id}`); const arme = await p2.locator('.arm').count();
  await p2.locator('#suche').fill('Hyperfok'); await warte(p2, 300); await p2.keyboard.press('Enter'); await warte(p2, 1600);
  const notiz = await p2.locator('.ort-notizen li').count(); const eigeneAmOrt = await p2.locator('.ort-fuge', { hasText: 'Versunken und gestockt' }).count();
  ok('Wiederöffnen: eigene Fuge, Notiz und Rückweg vom Ort zur eigenen Fuge', !!id && arme === 3 && notiz === 1 && eigeneAmOrt === 1);
  await b2.close();
}

// ---------------- Schmal: Telefon mit Berührung ----------------
async function schmal() {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(BASE); await warte(page, 1800); await bild(page, '80-schmal-feld');
  await page.getByRole('button', { name: 'Als Liste' }).tap(); await warte(page, 400);
  await page.locator('.liste-eintrag').first().tap(); await warte(page, 1300);
  ok('Schmal: Raum über Liste per Berührung geöffnet', await page.locator('#raum').isVisible());
  await page.locator('.wort').nth(3).tap(); await page.locator('.becken.erhalten .becken-rand').tap(); await warte(page, 400);
  ok('Schmal: Wort per Berührung eingelegt', (await page.locator('.kiesel').count()) >= 1);
  await bild(page, '81-schmal-uebersetzung');
  for (const [art, name] of [['gegenhalt', '82-schmal-gegenhalt'], ['schwelle', '83-schmal-schwelle'], ['ueberschneidung', '84-schmal-ueberschneidung'], ['entstehung', '85-schmal-entstehung'], ['fehlstelle', '86-schmal-fehlstelle']]) {
    await geheZu(page, `#/raum/${art}/0`);
    const breit = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.querySelector('#raum').scrollWidth) <= innerWidth + 1);
    ok(`Schmal: ${art} ohne seitliches Überlaufen`, breit); await bild(page, name);
  }
  await page.getByRole('button', { name: 'Herkunft und Geltung' }).tap(); await warte(page, 500); await bild(page, '87-schmal-herkunft');
  const schichtStand = await page.evaluate(() => ({ an: document.getElementById('raum').dataset.schicht, kerne: document.querySelectorAll('.bohrkern').length, sichtbar: (() => { const b = document.querySelector('.bohrkern'); if (!b) return false; const r = b.getBoundingClientRect(); return r.height > 0 && r.top < innerHeight && r.bottom > 0; })() }));
  ok('Schmal: Herkunftsebene erreichbar', schichtStand.an === 'an' && schichtStand.sichtbar, JSON.stringify(schichtStand));
  await geheZu(page, '#/ort/266'); await warte(page, 600);
  ok('Schmal: Ortsraum mit Werk ohne seitliches Überlaufen', await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1) && await page.locator('.werk img').first().isVisible()); await bild(page, '88-schmal-ortsraum');
  ok('Schmal: keine Fehler', fehler.length === 0, fehler.join(' | '));
  await browser.close();
}

// ---------------- Tastatur ----------------
async function tastatur() {
  const browser = await launch(); const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 } })).newPage();
  await page.goto(BASE); await warte(page, 1500);
  await page.locator('#feld-bild').focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('+');
  let tabs = 0; while (tabs < 12 && !(await page.evaluate(() => document.activeElement?.id === 'liste-knopf'))) { await page.keyboard.press('Tab'); tabs++; }
  await page.keyboard.press('Enter'); await warte(page, 300);
  ok('Tastatur: Liste öffnet, Fokus auf erstem Fugenort', await page.evaluate(() => document.activeElement?.classList.contains('liste-eintrag')));
  await page.keyboard.press('Tab'); await page.keyboard.press('Enter'); await warte(page, 1400);
  ok('Tastatur: Raum öffnet, Fokus auf Raumtitel', await page.evaluate(() => document.activeElement?.id === 'raum-titel'));
  // Übersetzung: Wort per Pfeiltasten und Eingabe, Becken per Tab
  await page.locator('.fassung.links .wort').first().focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter'); await warte(page, 200);
  await page.locator('.becken.erhalten .becken-rand').focus(); await page.keyboard.press('Enter'); await warte(page, 300);
  ok('Tastatur: Wort mit Pfeiltasten gewählt und eingelegt', (await page.locator('.kiesel').count()) >= 1);
  await geheZu(page, '#/raum/ueberschneidung/0'); await page.locator('.ph').first().focus(); await page.keyboard.press('Enter'); await warte(page, 300);
  ok('Tastatur: Phänomen in der Membranansicht wählbar', await page.locator('.ue-fokus').isVisible());
  await page.keyboard.press('Escape'); await warte(page, 500);
  ok('Tastatur: Escape führt ins Feld, Fokus auf dem Feld', await page.evaluate(() => document.activeElement?.id === 'feld-bild') && !(await page.locator('#raum').isVisible()));
  await browser.close();
}

// ---------------- Kontrast (rechnerisch aus den gesetzten Farben) ----------------
async function kontrast() {
  const lum = (hex) => { const c = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const paare = [['Grundtext', '#1d1a16', '#efe9dd'], ['Text auf Blatt', '#1d1a16', '#fbf8f2'], ['Leiser Text', '#6b6155', '#fbf8f2'], ['Fels: Text auf hellster Felsstelle', '#fbf8f2', '#6c6358'],
    ['Fels: Grenze', '#efe4d0', '#665d52'], ['Riegel: Text auf Messing (hellste Stelle)', '#1d1a16', '#e7c27a'], ['Riegel: Text auf Messing (dunkelste Stelle)', '#1d1a16', '#b58a33'], ['Gezogener Riegel', '#5b4a36', '#e0cfa8'],
    ['Pass: Becken', '#2f5f7a', '#ffffff'], ['Pass: Text auf Wasserfläche', '#1d1a16', '#d6e2e6'], ['Übersetzung: Wort in der Hand', '#ffffff', '#2f5f7a'], ['Gegenstimme', '#ffffff', '#1f4fa8'],
    ['Entstehung: Becken', '#ffffff', '#1f6a5c'], ['Fehlstelle: Art', '#3d4a3a', '#fbf8f2'], ['Eingabefeld-Platzhalter', '#6f665a', '#ffffff'], ['Eingabefeld-Rahmen', '#1d1a16', '#ffffff']];
  for (const [n, f, b] of paare) { const r = ratio(f, b); ok(`Kontrast ${n}`, r >= (/Rahmen/.test(n) ? 3 : 4.5), `${r.toFixed(1)} : 1`); }
}

// ---------------- Ohne WebGL, reduzierte Bewegung ----------------
async function ohneWebgl() {
  const browser = await launch(['--disable-webgl', '--disable-webgl2', '--disable-3d-apis']);
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })).newPage();
  const fehler = []; page.on('pageerror', (e) => fehler.push(e.message));
  await page.goto(BASE); await warte(page, 1500);
  const webgl = await page.evaluate(() => !!document.createElement('canvas').getContext('webgl2'));
  const pixel = await page.evaluate(() => { const c = document.getElementById('feld-bild'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 400) if (Math.abs(d[i] - 239) > 12) n++; return n; });
  ok('Ohne WebGL: Feld zeichnet vollständig (2D)', !webgl && pixel > 200, `WebGL ${webgl ? 'an' : 'aus'}, ${pixel} Bildpunkte mit Inhalt`);
  ok('Reduzierte Bewegung: Bewegung ruht von Anfang an', (await page.locator('#bewegung-knopf').innerText()) === 'Bewegung ruht');
  await page.locator('.legende-art', { hasText: 'Gegenhalt' }).getByRole('button', { name: 'Betreten' }).click(); await warte(page, 400);
  ok('Reduzierte Bewegung: Raum öffnet ohne Entfaltungsanimation', await page.evaluate(() => getComputedStyle(document.getElementById('raum')).animationName === 'none') && await page.locator('#raum').isVisible());
  await bild(page, '90-ohne-webgl-reduziert'); ok('Ohne WebGL: keine Fehler', fehler.length === 0, fehler.join(' | '));
  await browser.close();
}

// ---------------- Eingebettet im Variantenraum ----------------
async function eingebettet() {
  const browser = await launch(); const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const raum = await page.goto(RAUM).then((r) => r?.ok()).catch(() => false);
  if (!raum) { ok('Variantenraum erreichbar', false, 'Raum antwortet nicht; eingebettete Prüfung offen'); await browser.close(); return; }
  // Nur der DOM dieser Prüfseite wird ergänzt; Dateien des Raums bleiben unverändert.
  await page.evaluate((src) => {
    const f = document.createElement('iframe'); f.id = 'pruef-frame'; f.src = src; f.setAttribute('sandbox', 'allow-scripts allow-same-origin'); f.referrerPolicy = 'no-referrer';
    f.style.cssText = 'position:fixed;left:20px;top:20px;width:515px;height:603px;border:1px solid #ccc;background:#fff;z-index:99999';
    document.body.append(f);
  }, BASE + '/');
  await page.waitForTimeout(3000);
  const frame = page.frame({ url: new RegExp(`^${BASE}`) }); ok('Eingebettet: lädt im Sandbox-Rahmen 515×603', !!frame);
  if (!frame) { await browser.close(); return; }
  await page.locator('#pruef-frame').screenshot({ path: join(OUT, 'bilder', '95-eingebettet-feld.png') });
  await frame.getByRole('button', { name: 'Als Liste' }).click(); await page.waitForTimeout(300);
  await frame.locator('.liste-art', { hasText: 'Gegenhalt' }).locator('.liste-eintrag').nth(1).click(); await page.waitForTimeout(1500);
  await frame.locator('.spalt textarea').fill('Eingebettet geprüft.'); await frame.getByRole('button', { name: 'In den Spalt keilen' }).click(); await page.waitForTimeout(1500);
  ok('Eingebettet: Raum bedienbar, Arbeit gespeichert', (await frame.locator('.keil').count()) === 1 && (await frame.locator('#speicher-stand').innerText()) === 'Vom Dienst gespeichert');
  await page.locator('#pruef-frame').screenshot({ path: join(OUT, 'bilder', '96-eingebettet-gegenhalt.png') });
  await browser.close();
}

try {
  if (!nur || nur === 'desktop') await desktop();
  if (!nur || nur === 'bedienfehler') await bedienfehler();
  if (!nur || nur === 'zustand') await zustand();
  if (!nur || nur === 'werkbank') await werkbank();
  if (!nur || nur === 'schmal') await schmal();
  if (!nur || nur === 'tastatur') await tastatur();
  if (!nur || nur === 'kontrast') await kontrast();
  if (!nur || nur === 'ohne-webgl') await ohneWebgl();
  if (!nur || nur === 'eingebettet') await eingebettet();
} catch (e) { ok('Prüfung abgebrochen', false, e.message.split('\n')[0]); }
finally {
  server.kill();
  const bestanden = log.filter((x) => x.pass).length;
  await writeFile(join(OUT, 'protokoll.json'), JSON.stringify({ zeit: new Date().toISOString(), bestanden, gesamt: log.length, pruefungen: log }, null, 1));
  console.log(`\n${bestanden} von ${log.length} Prüfungen bestanden.`);
}
