// Fugenland: Feld → Fugenort → Raum → Herkunft → Original, und zurück an dieselbe Stelle.
import { h, leeren, ruhig } from './dom.mjs';
import { Feld } from './feld.mjs';
import { werk, laden, raumZustand, handlung } from './werk.mjs';
import { zeichneSchicht } from './schicht-herkunft.mjs';
import * as gegenhalt from './raum-gegenhalt.mjs';
import * as schwelle from './raum-schwelle.mjs';
import * as uebersetzung from './raum-uebersetzung.mjs';
import * as ueberschneidung from './raum-ueberschneidung.mjs';
import * as fehlstelle from './raum-fehlstelle.mjs';
import * as entstehung from './raum-entstehung.mjs';

const RAEUME = { uebersetzung, gegenhalt, schwelle, ueberschneidung, entstehung, fehlstelle };
const FARBEN = { uebersetzung: '#2f5f7a', gegenhalt: '#5d554b', schwelle: '#8a4a22', ueberschneidung: '#6b3f78', fehlstelle: '#3d4a3a', entstehung: '#1f6a5c' };
const TOENE = ['#b9a27f', '#9fb3a4', '#a9a3c4', '#c9a99a', '#b7c08f', '#d1b37a', '#c49aa6', '#9bb4c9', '#c7b09b', '#a8b8a0'];
const $ = (id) => document.getElementById(id);

const [karte, fr] = await Promise.all([fetch('/inhalt/karte.json').then((r) => r.json()), fetch('/inhalt/fugenraeume.json').then((r) => r.json())]);
const regionen = karte.regionen.map((r, i) => ({ ...r, ton: TOENE[i % TOENE.length] }));
const gebietsMitte = (name) => { const r = regionen.find((x) => x.name === name); return { x: r.x, y: r.y + r.r * 0.55 }; };

// Überschneidungsfälle: jedes Phänomen, das mindestens drei Stimmen beschreiben.
const ueFaelle = fr.ueberschneidung.phaenomene.map((p) => {
  const st = fr.ueberschneidung.stimmen.filter((v) => v.phaenomene.includes(p.i));
  return { titel: p.t, phId: p.id, ph: p.i, x: p.x, y: p.y, start: st.slice(0, 4).map((v) => v.id), zahl: st.length, gebildetAus: fr.ueberschneidung.gebildetAus };
}).filter((f) => f.zahl >= 3).sort((a, b) => b.zahl - a.zahl);

// Im Feld stehen Schwellen ab drei Riegeln und alle Fehlstellen; die übrigen Schwellen bleiben im Bestand.
const FAELLE = { uebersetzung: fr.uebersetzung, gegenhalt: fr.gegenhalt, schwelle: fr.schwelle.filter((f) => f.riegel.length >= 3), ueberschneidung: ueFaelle, fehlstelle: fr.fehlstelle, entstehung: fr.entstehung };
const ctxBasis = { gebietsMitte };
const punkte = Object.entries(FAELLE).flatMap(([art, liste]) => liste.map((fall, i) => {
  const m = RAEUME[art]; const o = m.ort(fall, ctxBasis);
  return { art, i, fall, x: o.x, y: o.y, titel: m.titel(fall), artName: m.meta.name, key: m.schluessel(fall), n: art === 'schwelle' ? fall.riegel.length : 0 };
}));

await laden();
const feld = new Feld($('feld-bild'), { orte: karte.orte, regionen, punkte, farben: FARBEN, onOeffnen: (p) => oeffnen(p.art, p.i), onHover: (p) => { $('feld-status').textContent = p ? `${p.artName}: ${p.titel}` : ''; } });
feld.ereignisse(werk.daten.ereignisse);

// Speicherstand sichtbar halten.
const stand = $('speicher-stand');
const zeigeStand = (s) => { stand.textContent = { leer: 'Noch keine eigene Arbeit', gespeichert: 'Gespeichert', ungespeichert: 'Wird gleich gespeichert', speichert: 'Speichert …', lädt: 'Lädt …' }[s] || s; stand.dataset.stand = s; };
werk.hoerer.add(zeigeStand); zeigeStand(werk.stand);

// Bewegung: folgt der Systemeinstellung, lässt sich hier anhalten.
const bk = $('bewegung-knopf');
const setzeBewegung = (aus) => { document.documentElement.dataset.bewegung = aus ? 'ruht' : 'an'; bk.setAttribute('aria-pressed', String(aus)); bk.textContent = aus ? 'Bewegung ruht' : 'Bewegung an'; };
setzeBewegung(matchMedia('(prefers-reduced-motion: reduce)').matches);
bk.onclick = () => setzeBewegung(document.documentElement.dataset.bewegung !== 'ruht');

// Legende: jede Fugenart mit eigenem Zeichen, Zahl und Funktion. Ausblenden ändert nur die Sicht.
function legende() {
  leeren($('legende')).append(h('p', { class: 'legende-kopf' }, 'Fugen tragen das Feld'),
    h('ul', {}, Object.entries(RAEUME).map(([art, m]) => h('li', { class: 'legende-art', style: `--farbe:${FARBEN[art]}` },
      h('span', { class: `glyph-css ${art}`, 'aria-hidden': 'true' }),
      h('span', { class: 'legende-text' }, h('strong', {}, m.meta.name), h('span', {}, m.meta.kurz), h('span', { class: 'leise' }, `${FAELLE[art].length} Orte im Feld`)),
      h('span', { class: 'legende-knoepfe' },
        h('button', { type: 'button', class: 'knopf mini', onclick: () => oeffnen(art, 0) }, 'Betreten'),
        h('button', { type: 'button', class: 'knopf mini leise', 'aria-pressed': String(!feld.sichtbar.has(art)), onclick: (e) => {
          feld.sichtbar.has(art) ? feld.sichtbar.delete(art) : feld.sichtbar.add(art); feld.dirty = true; e.currentTarget.setAttribute('aria-pressed', String(!feld.sichtbar.has(art))); e.currentTarget.textContent = feld.sichtbar.has(art) ? 'ausblenden' : 'einblenden';
        } }, 'ausblenden'))))),
    h('p', { class: 'legende-fuss' }, 'Ausblenden ändert nur die Sicht, nie den Bestand. Ein Ring um einen Fugenort zeigt, dass du dort gearbeitet hast; die bräunliche Tönung wächst nur aus deinen gespeicherten Handlungen.'));
}
legende();

// Liste: gleichwertiger Weg ohne Bild, auch für Tastatur und Vorlesen.
function liste() {
  leeren($('liste')).append(h('h2', {}, 'Alle Fugenorte'), ...Object.entries(RAEUME).map(([art, m]) => h('section', { class: 'liste-art' },
    h('h3', { style: `color:${FARBEN[art]}` }, `${m.meta.name} · ${m.meta.kurz}`),
    h('p', { class: 'leise' }, `Bedienung im Raum: ${m.meta.bedienung}`),
    h('ul', {}, FAELLE[art].map((f, i) => h('li', {}, h('button', { type: 'button', class: 'liste-eintrag', onclick: () => oeffnen(art, i) }, m.titel(f), raumZustand(m.schluessel(f))?.geaendert ? h('span', { class: 'bearbeitet' }, ' · von dir bearbeitet') : null)))))));
}
$('liste-knopf').onclick = () => { const an = $('liste').hidden; $('liste').hidden = !an; $('liste-knopf').setAttribute('aria-pressed', String(an)); if (an) { liste(); $('liste').querySelector('button')?.focus(); } };

// Raum öffnen: Flug zum Fugenort, dann entfaltet sich der Raum aus dieser Stelle.
let aktuell = null;
function oeffnen(art, i, { ohneFlug = false } = {}) {
  const m = RAEUME[art]; const liste = FAELLE[art]; i = ((i % liste.length) + liste.length) % liste.length; const fall = liste[i];
  const p = punkte.find((q) => q.art === art && q.i === i);
  feld.auswahl = p; $('liste').hidden = true; $('liste-knopf').setAttribute('aria-pressed', 'false');
  const zeige = () => {
    const [bx, by] = feld.zuBild(p.x, p.y); const raum = $('raum'); raum.style.setProperty('--ox', `${bx}px`); raum.style.setProperty('--oy', `${by}px`);
    aktuell = { art, i, m, fall, key: m.schluessel(fall), fluechtig: {} };
    if (location.hash !== `#/raum/${art}/${i}`) history.pushState(null, '', `#/raum/${art}/${i}`);
    zeichneRaum(); raum.hidden = false; $('app').dataset.ebene = 'raum'; raum.classList.remove('entfaltet'); void raum.offsetWidth; raum.classList.add('entfaltet');
    raum.style.setProperty('--kopfhoehe', `${raum.querySelector('.raum-kopf').offsetHeight}px`);
    $('raum-titel').focus();
  };
  if (ohneFlug || aktuell) { Object.assign(feld.kam, { x: p.x, y: p.y, z: Math.max(feld.kam.z, 0.9) }); feld.dirty = true; zeige(); }
  else feld.fliegeZu(p.x, p.y, Math.max(feld.kam.z, 0.9), zeige);
}

function zeichneRaum() {
  const { art, i, m, fall, key } = aktuell;
  $('raum').dataset.art = art; $('raum-art').textContent = `${m.meta.name} · ${m.meta.kurz}`; $('raum-titel').textContent = m.titel(fall);
  $('raum-zahl').textContent = `${i + 1} von ${FAELLE[art].length}`;
  pfad();
  const ctx = {
    key, daten: fr, fluechtig: aktuell.fluechtig, ruhig, gebietsMitte, faelle: FAELLE[art], oeffneFall: (j) => oeffnen(art, j),
    zustand: () => raumZustand(key) || {},
    handlung: (wasArt, aendern, was) => { handlung(key, wasArt, m.ort(fall, ctxBasis), aendern, was); feld.ereignisse(werk.daten.ereignisse, true); schicht(); },
    oeffneOriginal, oeffneKapitel, neuZeichnen: () => { m.zeichne($('raum-buehne'), fall, ctx); schicht(); },
  };
  const schicht = () => zeichneSchicht($('raum-schicht'), { art, meta: m.meta, fall, kanten: m.kanten(fall), zustand: ctx.zustand(), proben: fr.proben, ereignisZahl: werk.daten.ereignisse.filter((e) => e.raum === key).length, ctx });
  m.zeichne($('raum-buehne'), fall, ctx); schicht();
  $('raum').style.setProperty('--kopfhoehe', `${$('raum').querySelector('.raum-kopf').offsetHeight}px`);
}

function schliessen({ ausVerlauf = false } = {}) {
  if (!aktuell) return; const war = aktuell; aktuell = null;
  $('raum').hidden = true; $('app').dataset.ebene = 'feld'; feld.auswahl = punkte.find((q) => q.art === war.art && q.i === war.i); feld.dirty = true;
  if (!ausVerlauf) history.pushState(null, '', '#/feld');
  pfad(); $('feld-bild').focus(); $('feld-status').textContent = `Zurück im Feld bei ${war.m.titel(war.fall)}.`;
}

function pfad() {
  const n = $('pfad'); leeren(n);
  n.append(h('a', { href: '#/feld', 'aria-current': aktuell ? null : 'page' }, 'Feld'));
  if (aktuell) n.append(h('span', { class: 'pfad-trenner', 'aria-hidden': 'true' }, '›'), h('span', { 'aria-current': 'page' }, `${aktuell.m.meta.name}: ${aktuell.m.titel(aktuell.fall)}`));
}

function oeffneOriginal(titel, text, herkunft) {
  $('original-titel').textContent = titel;
  leeren($('original-text')).append(h('p', { class: 'original-herkunft' }, `Herkunft: ${herkunft}. Wortlaut unverändert.`), ...text.split(/\n{2,}/).map((p) => h('p', {}, p)));
  $('original').showModal();
}
let texte = null;
async function oeffneKapitel(datei) {
  texte ??= await fetch('/inhalt/texte.json').then((r) => r.json());
  const k = texte.fundus.find((x) => x.datei === datei);
  oeffneOriginal(k.titel, k.text.replace(/^#+\s*/gm, ''), `Wissensfundus, Kapitel ${datei.replace(/\.md$/, '')}`);
}
$('original').querySelector('[data-schliessen]').onclick = () => $('original').close();

$('raum-zurueck').onclick = () => schliessen();
$('schicht-knopf').onclick = () => { const an = $('raum').dataset.schicht !== 'an'; $('raum').dataset.schicht = an ? 'an' : 'aus'; $('schicht-knopf').setAttribute('aria-pressed', String(an)); if (an) $('raum-schicht').querySelector('select, button')?.focus(); };
$('raum-vor').onclick = () => oeffnen(aktuell.art, aktuell.i - 1);
$('raum-nach').onclick = () => oeffnen(aktuell.art, aktuell.i + 1);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && aktuell && !$('original').open) schliessen(); });

function route({ erster = false } = {}) {
  const m = location.hash.match(/^#\/raum\/(\w+)\/(\d+)/);
  if (m && RAEUME[m[1]]) oeffnen(m[1], Number(m[2]), { ohneFlug: erster });
  else schliessen({ ausVerlauf: true });
}
addEventListener('popstate', () => route());
route({ erster: true });
pfad();
window.fugenland = { feld, punkte, FAELLE, werk };
