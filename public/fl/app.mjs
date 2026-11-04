// Fugenland: Feld → Fugenort → Raum → Herkunft → Original, und zurück an dieselbe Stelle.
import { h, leeren, ruhig } from './dom.mjs';
import { Feld } from './feld.mjs';
import { werk, laden, raumZustand, handlung, aendereWerk } from './werk.mjs';
import { zeichneSchicht } from './schicht-herkunft.mjs';
import * as gegenhalt from './raum-gegenhalt.mjs';
import * as schwelle from './raum-schwelle.mjs';
import * as uebersetzung from './raum-uebersetzung.mjs';
import * as ueberschneidung from './raum-ueberschneidung.mjs';
import * as fehlstelle from './raum-fehlstelle.mjs';
import * as entstehung from './raum-entstehung.mjs';
import * as ortsraum from './raum-ort.mjs';
import * as eigen from './raum-eigen.mjs';
import { Spieler, istAufnahme } from './spieler.mjs';

const RAEUME = { uebersetzung, gegenhalt, schwelle, ueberschneidung, entstehung, fehlstelle };
const FARBEN = { uebersetzung: '#2f5f7a', gegenhalt: '#5d554b', schwelle: '#8a4a22', ueberschneidung: '#6b3f78', fehlstelle: '#3d4a3a', entstehung: '#1f6a5c', eigen: '#1f4fa8' };
const ARTNAME = { phenomenon: 'Phänomen', source: 'Quelle', method: 'Verfahren', concept: 'Begriff', chapter: 'Kapitel', model: 'Modell', context: 'Beschreibungskontext', exercise: 'Übung', perspective: 'Perspektive', finding: 'Befund', domain: 'Bereich', instrument: 'Instrument', practice: 'Praxis', dimension: 'Dimension', path: 'Weg', scene: 'Szene', research: 'Forschung', population: 'Gruppe', 'interactive-model': 'Modell' };
const TOENE = ['#b9a27f', '#9fb3a4', '#a9a3c4', '#c9a99a', '#b7c08f', '#d1b37a', '#c49aa6', '#9bb4c9', '#c7b09b', '#a8b8a0'];
const $ = (id) => document.getElementById(id);

const [karte, fr, medien] = await Promise.all(['karte', 'fugenraeume', 'medien'].map((n) => fetch(`/inhalt/${n}.json`).then((r) => r.json())));
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

// Welche Fugenräume berühren welchen Ort: der Weg vom Ort zurück in seine Fugen.
const beteiligte = (art, f) => {
  switch (art) {
    case 'uebersetzung': return f.fassungen.map((x) => x.i);
    case 'gegenhalt': return f.seiten.map((x) => x.i);
    case 'schwelle': return [f.ort.i, ...f.riegel.map((r) => r.gegenueber.i)];
    case 'ueberschneidung': return [f.ph, ...fr.ueberschneidung.stimmen.filter((v) => v.phaenomene.includes(f.ph)).map((v) => v.i)];
    case 'entstehung': return [f.ort.i, ...f.herkuenfte.map((k) => k.quelle.i), ...f.nachfolger.map((k) => k.ziel.i)];
    case 'fehlstelle': return f.ort ? [f.ort.i, ...f.raender.slice(0, 40).map((k) => k.gegenueber.i)] : [];
    default: return [];
  }
};
const amOrt = new Map();
for (const [art, liste] of Object.entries(FAELLE)) liste.forEach((f, i) => { for (const o of new Set(beteiligte(art, f))) { if (!amOrt.has(o)) amOrt.set(o, []); amOrt.get(o).push({ art, i, titel: RAEUME[art].titel(f), artName: RAEUME[art].meta.name }); } });

await laden();
const feld = new Feld($('feld-bild'), { orte: karte.orte, regionen, punkte, farben: FARBEN, onOeffnen: (p) => (p.art === 'eigen' ? oeffneEigen(p.id) : oeffnen(p.art, p.i)), onHover: (p) => { $('feld-status').textContent = p ? `${p.artName}: ${p.titel}` : ''; } });
feld.ereignisse(werk.daten.ereignisse);

new ResizeObserver(() => document.documentElement.style.setProperty('--kopf', `${document.querySelector('.kopf').offsetHeight}px`)).observe(document.querySelector('.kopf'));

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
    h('p', { class: 'legende-eigen' }, h('span', { class: 'glyph-css eigen', 'aria-hidden': 'true' }), 'Deine eigenen Fugen stehen in blauer Tinte im Feld. Orte findest du über die Suche oben; im Ortsraum nimmst du sie in die Hand.'),
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

// Eigene Fugen stehen als eigene Fugenorte im Feld, im Schwerpunkt ihrer Beteiligten.
let texte = null;
const ladeTexte = async () => (texte ??= await fetch('/inhalt/texte.json').then((r) => r.json()));
const ortVonId = new Map();
function ortIndex(t) { if (Number.isInteger(t.ort) && karte.orte[t.ort]) return t.ort; return ortVonId.get(t.ortId) ?? -1; }
function eigenePunkte() {
  for (let k = punkte.length - 1; k >= 0; k--) if (punkte[k].art === 'eigen') punkte.splice(k, 1);
  werk.daten.gefuege.forEach((g) => {
    const os = g.teile.map(ortIndex).filter((i) => i >= 0); if (!os.length) return;
    const x = os.reduce((a, i) => a + karte.orte[i].x, 0) / os.length, y = os.reduce((a, i) => a + karte.orte[i].y, 0) / os.length;
    punkte.push({ art: 'eigen', id: g.id, x, y, titel: g.titel || 'Eigene Fuge ohne Namen', artName: 'Eigene Fuge', key: `eigen:${g.id}`, n: os.length });
  });
  feld.dirty = true;
}
eigenePunkte();

// Hand: Orte aufnehmen und daraus eine eigene Fuge bilden (aus Fugenland 1).
const hand = [];
function zeigeHand() {
  const el = $('hand'); el.hidden = !hand.length; if (!hand.length) return leeren(el);
  leeren(el).append(h('p', { class: 'hand-kopf' }, `In der Hand: ${hand.length}`),
    h('ul', {}, hand.map((i) => h('li', {}, h('button', { type: 'button', class: 'hand-ort', onclick: () => oeffneOrt(i) }, karte.orte[i].t),
      h('button', { type: 'button', class: 'knopf mini leise', 'aria-label': `${karte.orte[i].t} ablegen`, onclick: () => { hand.splice(hand.indexOf(i), 1); zeigeHand(); } }, '×')))),
    h('button', { type: 'button', class: 'knopf mini', disabled: hand.length < 2, onclick: () => neueFuge([...hand]) }, 'Eigene Fuge bilden'),
    h('button', { type: 'button', class: 'knopf mini leise', onclick: () => { hand.length = 0; zeigeHand(); } }, 'Hand leeren'));
}
const nimm = (i) => { if (!hand.includes(i)) hand.push(i); zeigeHand(); };

// Spieler: einer für alles, spielt bei Raumwechseln weiter.
const spieler = new Spieler($('spieler'), { zurueck: (r) => oeffneOrt(r.ort) });
const THEMA = [[/trauma|prolonged|cognitive processing/i, 'TraumaAtlas'], [/neurodivergenz|überlastung|autismus/i, 'Neuroatlas'], [/dyskalkulie|zahlen/i, 'Phänomenatlas'], [/adhs/i, 'ADHS · Randphänomene']];
const aufnahmenFuerGebiet = (name) => medien.filter((m) => istAufnahme(m) && THEMA.some(([re, n]) => n === name && re.test(m.titel)));

// Ein Raum ist offen: ein Fugenraum, ein Ortsraum oder eine eigene Fuge. Alle liegen über dem Feld.
let aktuell = null; let raumAdresse = null;
function entfalte(x, y, ohneFlug, zeichnen, hash) {
  $('liste').hidden = true; $('liste-knopf').setAttribute('aria-pressed', 'false');
  const zeige = () => {
    const [bx, by] = feld.zuBild(x, y); const raum = $('raum'); raum.style.setProperty('--ox', `${bx}px`); raum.style.setProperty('--oy', `${by}px`);
    // Ein neuer Raum beginnt mit geschlossener Herkunftsebene; sie gehört zum Raum, in dem sie geöffnet wurde.
    if (raumAdresse !== hash || raum.hidden) { raum.dataset.schicht = 'aus'; $('schicht-knopf').setAttribute('aria-pressed', 'false'); }
    raumAdresse = hash;
    if (location.hash !== hash) history.pushState(null, '', hash);
    const warOffen = !raum.hidden; zeichnen(); raum.hidden = false; $('app').dataset.ebene = 'raum';
    if (!warOffen) { raum.classList.remove('entfaltet'); void raum.offsetWidth; raum.classList.add('entfaltet'); }
    raum.style.setProperty('--kopfhoehe', `${raum.querySelector('.raum-kopf').offsetHeight}px`);
    $('raum-buehne').scrollTop = 0; $('raum-titel').focus();
  };
  if (ohneFlug || aktuell) { Object.assign(feld.kam, { x, y, z: Math.max(feld.kam.z, 0.9) }); feld.dirty = true; zeige(); }
  else feld.fliegeZu(x, y, Math.max(feld.kam.z, 0.9), zeige);
}

function oeffnen(art, i, { ohneFlug = false } = {}) {
  const m = RAEUME[art]; const liste = FAELLE[art]; i = ((i % liste.length) + liste.length) % liste.length; const fall = liste[i];
  const p = punkte.find((q) => q.art === art && q.i === i); feld.auswahl = p;
  entfalte(p.x, p.y, ohneFlug, () => { aktuell = { typ: 'fuge', art, i, m, fall, key: m.schluessel(fall), fluechtig: {} }; zeichneRaum(); }, `#/raum/${art}/${i}`);
}

function kopf(art, artText, titel, zahl, mitSchicht) {
  $('raum').dataset.art = art; $('raum-art').textContent = artText; $('raum-titel').textContent = titel;
  $('raum-zahl').textContent = zahl || ''; $('raum-vor').hidden = $('raum-nach').hidden = !zahl;
  $('schicht-knopf').hidden = !mitSchicht; if (!mitSchicht) { $('raum').dataset.schicht = 'aus'; $('schicht-knopf').setAttribute('aria-pressed', 'false'); leeren($('raum-schicht')); }
  pfad();
}

function zeichneRaum() {
  const { art, i, m, fall, key } = aktuell;
  kopf(art, `${m.meta.name} · ${m.meta.kurz}`, m.titel(fall), `${i + 1} von ${FAELLE[art].length}`, true);
  const ctx = {
    key, daten: fr, fluechtig: aktuell.fluechtig, ruhig, gebietsMitte, faelle: FAELLE[art], oeffneFall: (j) => oeffnen(art, j),
    zustand: () => raumZustand(key) || {},
    handlung: (wasArt, aendern, was) => { handlung(key, wasArt, m.ort(fall, ctxBasis), aendern, was); feld.ereignisse(werk.daten.ereignisse, true); schicht(); },
    oeffneOriginal, oeffneKapitel, neuZeichnen: () => { m.zeichne($('raum-buehne'), fall, ctx); schicht(); },
  };
  const schicht = () => zeichneSchicht($('raum-schicht'), { art, meta: m.meta, fall, kanten: m.kanten(fall), zustand: ctx.zustand(), proben: fr.proben, ereignisZahl: werk.daten.ereignisse.filter((e) => e.raum === key).length, ctx });
  m.zeichne($('raum-buehne'), fall, ctx); schicht();
}

// Ortsraum: jeder der 1226 Orte im vollen Wortlaut, mit seinen Fugenräumen, Werken, Aufnahmen und Notizen.
async function oeffneOrt(i, { ohneFlug = false } = {}) {
  await ladeTexte(); const o = karte.orte[i]; feld.auswahl = null;
  entfalte(o.x, o.y, ohneFlug, () => { aktuell = { typ: 'ort', i }; zeichneOrt(); }, `#/ort/${i}`);
}
function zeichneOrt() {
  const i = aktuell.i; const o = karte.orte[i];
  kopf('ort', `Ort · ${karte.regionen[o.r].name}`, o.t, '', false);
  ortsraum.zeichne($('raum-buehne'), i, {
    karte, texte, medien, farben: FARBEN, artName: (k) => ARTNAME[k] || 'Eintrag',
    fugenAmOrt: (j) => [...(amOrt.get(j) || []), ...punkte.filter((p) => p.art === 'eigen' && werk.daten.gefuege.find((g) => g.id === p.id)?.teile.some((t) => ortIndex(t) === j)).map((p) => ({ art: 'eigen', i: p.id, titel: p.titel, artName: 'Eigene Fuge' }))],
    oeffne: (art, j) => (art === 'eigen' ? oeffneEigen(j) : oeffnen(art, j)), oeffneOrt,
    aufnahmenFuerGebiet, spiele: (m, r) => spieler.spiele(m, r),
    hand: () => hand, nimm, neueFuge,
    notizen: (id) => werk.daten.notizen.filter((n) => n.ortId === id),
    notizNeu: (id, j, text) => aendereWerk((d) => d.notizen.push({ id: crypto.randomUUID(), ortId: id, text, zeit: new Date().toISOString() }), { art: 'notiz', raum: `ort:${id}`, x: karte.orte[j].x, y: karte.orte[j].y, was: text.slice(0, 160) }),
    notizWeg: (nid) => aendereWerk((d) => { d.notizen = d.notizen.filter((n) => n.id !== nid); }),
  });
}

// Eigene Fuge: Entwurf aus der Hand oder gespeicherte Fuge.
async function neueFuge(orte) {
  await ladeTexte();
  const g = { id: crypto.randomUUID(), titel: '', art: 'offen', geltung: 'persoenlich', aussage: '', gegenaussage: '', grenze: '', perspektive: '', kontext: 'Aus der Hand gebildet', teile: orte.map(teil) };
  aktuell = null; zeigeEigen(g, false);
}
const teil = (i) => ({ ortId: texte.orte[i].id, ort: i, name: karte.orte[i].t, rolle: '', richtung: 'offen' });
async function oeffneEigen(id) { await ladeTexte(); const g = werk.daten.gefuege.find((x) => x.id === id); if (!g) return schliessen(); aktuell = null; zeigeEigen(structuredClone(g), true); }
function zeigeEigen(g, gespeichert) {
  const os = g.teile.map(ortIndex).filter((i) => i >= 0); const x = os.length ? os.reduce((a, i) => a + karte.orte[i].x, 0) / os.length : feld.kam.x; const y = os.length ? os.reduce((a, i) => a + karte.orte[i].y, 0) / os.length : feld.kam.y;
  g.teile.forEach((t) => { t.ort = ortIndex(t); });
  entfalte(x, y, true, () => { aktuell = { typ: 'eigen', g, gespeichert, x, y }; zeichneEigen(); }, gespeichert ? `#/eigen/${g.id}` : '#/eigen/neu');
}
// Die eigene Fuge in der Gestalt ihrer Art: dieselben Räume, gebaut aus deinen Beteiligten und Angaben.
const ortObj = (i) => ({ i, id: texte.orte[i].id, t: karte.orte[i].t, r: karte.orte[i].r, gebiet: karte.regionen[karte.orte[i].r].name, k: karte.orte[i].k, s: karte.orte[i].s, x: karte.orte[i].x, y: karte.orte[i].y });
const eigeneKante = (n, a, b, label, grenze = '') => ({ n: `eigen-${n}`, a, b, label, detail: '', grenze, frage: '', typ: 'eigen', art: 'eigen', grund: 'deine eigene Fuge', herkunft: 'deine eigene Fuge', status: '', quellen: [] });
const woerter = (t) => [...new Set((t.toLowerCase().match(/[a-zäöüß][a-zäöüß-]{3,}/g) || []))];
const stammE = (w) => w.replace(/(ungen|ung|en|er|es|e|n|s)$/, '');
function gestaltFall(g) {
  const os = g.teile.map(ortIndex).filter((i) => i >= 0); const o = os.map(ortObj); const text = (i) => texte.orte[i].body || karte.orte[i].s;
  const fehlt = (n, was) => ({ modul: RAEUME[g.art], name: RAEUME[g.art]?.meta.name, fehlt: `Für diese Gestalt braucht die Fuge ${n} ${was}.` });
  const basis = { gebildetAus: 'deiner eigenen Fuge' };
  switch (g.art) {
    case 'schwelle': {
      if (!o.length || !(g.riegel || []).length) return fehlt('einen Ort und mindestens einen', 'Riegel (Bedingungen im Feld „Riegel“)');
      return { modul: schwelle, name: 'Schwelle', fall: { ...basis, art: 'schwelle', ort: o[0], text: text(os[0]), riegel: g.riegel.map((r, k) => ({ ...eigeneKante(k, os[0], (os[k + 1] ?? os[0]), r), gegenueber: o[k + 1] || o[0] })) } };
    }
    case 'gegenhalt': {
      if (o.length < 2) return fehlt('zwei', 'Beteiligte');
      const aussagen = [g.aussage && eigeneKante(0, os[0], os[1], g.aussage), g.gegenaussage && eigeneKante(1, os[1], os[0], g.gegenaussage)].filter(Boolean);
      return { modul: gegenhalt, name: 'Gegenhalt', fall: { ...basis, art: 'gegenhalt', modus: 'widerspruch', seiten: [o[0], o[1]], aussagen } };
    }
    case 'uebersetzung': {
      if (o.length < 2) return fehlt('zwei', 'Beteiligte');
      const w = [woerter(text(os[0])), woerter(text(os[1]))]; const s1 = new Set(w[1].map(stammE));
      return { modul: uebersetzung, name: 'Übersetzung', fall: { ...basis, art: 'uebersetzung', titel: g.titel, fassungen: [0, 1].map((k) => ({ ...o[k], text: text(os[k]), herkunft: texte.orte[os[k]].herkunft?.titel || o[k].gebiet })), wortabgleich: { gemeinsam: w[0].filter((x) => s1.has(stammE(x))), nurHier: [] } } };
    }
    case 'entstehung': {
      if (o.length < 3) return fehlt('mindestens drei', 'Beteiligte (zwei Herkünfte und den Ort, in dem sie zusammenfließen; der letzte Beteiligte ist der Zusammenfluss)');
      const ziel = os.at(-1);
      return { modul: entstehung, name: 'Entstehung', fall: { ...basis, art: 'entstehung', ort: o.at(-1), text: text(ziel), herkuenfte: os.slice(0, -1).map((i, k) => ({ ...eigeneKante(k, ziel, i, 'in deiner Fuge zusammengeführt'), quelle: o[k], text: text(i) })), nachfolger: [] } };
    }
    case 'fehlstelle': {
      if (!o.length) return fehlt('einen', 'Beteiligten');
      return { modul: fehlstelle, name: 'Fehlstelle', fall: { ...basis, art: 'fehlstelle', modus: 'eigen', ort: o[0], raender: os.slice(1).map((i, k) => ({ ...eigeneKante(k, os[0], i, 'in deiner Fuge'), gegenueber: o[k + 1] })) } };
    }
    case 'ueberschneidung': return { modul: null, name: 'Überschneidung', fehlt: 'Eine Überschneidung baut sich aus den Beschreibungskontexten des Bestands; deine eigene bleibt als Station mit Armen sichtbar.' };
    default: return null; // offene Frage und Nicht-Verbindung haben die Station als Gestalt
  }
}

function zeichneEigen() {
  const { g, gespeichert, x, y } = aktuell;
  kopf('eigen', `Eigene Fuge · ${eigen.ARTEN[g.art] || 'offene Frage'}`, g.titel || 'Neue eigene Fuge', '', false);
  const key = `eigen:${g.id}`;
  eigen.zeichne($('raum-buehne'), g, {
    gespeichert, hand: () => hand, teil, oeffneOrt,
    modus: () => aktuell.modus, setzeModus: (m) => { aktuell.modus = m; },
    gestalt: (gg) => {
      const r = gestaltFall(gg); if (!r?.fall) return r;
      const gctx = { key, daten: fr, fluechtig: aktuell.fluechtig ||= {}, ruhig, gebietsMitte, faelle: [], oeffneFall: () => {},
        zustand: () => raumZustand(key) || {},
        handlung: (wasArt, aendern, was) => { handlung(key, wasArt, { x, y }, aendern, was); feld.ereignisse(werk.daten.ereignisse, true); },
        oeffneOriginal, oeffneKapitel, neuZeichnen: () => zeichneEigen() };
      return { ...r, ctx: gctx };
    },
    entwurf: (neu) => { aktuell.g = neu; zeichneEigen(); },
    speichere: (neu) => {
      const jetzt = new Date().toISOString();
      aendereWerk((d) => {
        const alt = d.gefuege.find((q) => q.id === neu.id);
        neu.verlauf = [...(alt?.verlauf || []), alt ? { zeit: jetzt, was: 'geändert', vorher: { ...alt, verlauf: undefined } } : { zeit: jetzt, was: 'angelegt' }].slice(-30);
        neu.geaendert = jetzt; neu.erstellt ||= jetzt;
        if (alt) Object.assign(alt, neu); else d.gefuege.push(neu);
      }, { art: 'eigene-fuge', raum: `eigen:${neu.id}`, x, y, was: neu.titel || 'eigene Fuge' });
      eigenePunkte(); feld.ereignisse(werk.daten.ereignisse, true);
      hand.length = 0; zeigeHand(); aktuell = null; zeigeEigen(structuredClone(werk.daten.gefuege.find((q) => q.id === neu.id)), true);
    },
    loesche: (id) => {
      if (!confirm('Diese eigene Fuge löschen? Ihr Verlauf bleibt im Protokoll vermerkt.')) return;
      aendereWerk((d) => { d.verlauf = [...(d.verlauf || []), { zeit: new Date().toISOString(), was: `gelöscht: ${g.titel || 'eigene Fuge'}`, vorher: d.gefuege.find((q) => q.id === id) }].slice(-200); d.gefuege = d.gefuege.filter((q) => q.id !== id); });
      eigenePunkte(); schliessen();
    },
  });
}

function schliessen({ ausVerlauf = false } = {}) {
  const war = aktuell; aktuell = null;
  if ($('raum').hidden && !war) return;
  $('raum').hidden = true; $('app').dataset.ebene = 'feld';
  if (war?.typ === 'fuge') feld.auswahl = punkte.find((q) => q.art === war.art && q.i === war.i);
  if (war?.typ === 'eigen') feld.auswahl = punkte.find((q) => q.art === 'eigen' && q.id === war.g.id) || null;
  feld.dirty = true;
  if (!ausVerlauf) history.pushState(null, '', '#/feld');
  pfad(); $('feld-bild').focus();
  const name = war?.typ === 'fuge' ? war.m.titel(war.fall) : war?.typ === 'ort' ? karte.orte[war.i].t : war?.g?.titel;
  if (name) $('feld-status').textContent = `Zurück im Feld bei ${name}.`;
}

function pfad() {
  const n = $('pfad'); leeren(n);
  n.append(h('a', { href: '#/feld', 'aria-current': aktuell ? null : 'page' }, 'Feld'));
  const text = !aktuell ? null : aktuell.typ === 'fuge' ? `${aktuell.m.meta.name}: ${aktuell.m.titel(aktuell.fall)}` : aktuell.typ === 'ort' ? `Ort: ${karte.orte[aktuell.i].t}` : `Eigene Fuge: ${aktuell.g.titel || 'neu'}`;
  if (text) n.append(h('span', { class: 'pfad-trenner', 'aria-hidden': 'true' }, '›'), h('span', { 'aria-current': 'page' }, text));
}

function oeffneOriginal(titel, text, herkunft) {
  $('original-titel').textContent = titel;
  leeren($('original-text')).append(h('p', { class: 'original-herkunft' }, `Herkunft: ${herkunft}. Wortlaut unverändert.`), ...text.split(/\n{2,}/).map((p) => h('p', {}, p)));
  $('original').showModal();
}
async function oeffneKapitel(datei) {
  await ladeTexte();
  const k = texte.fundus.find((x) => x.datei === datei);
  oeffneOriginal(k.titel, k.text.replace(/^#+\s*/gm, ''), `Wissensfundus, Kapitel ${datei.replace(/\.md$/, '')}`);
}
$('original').querySelector('[data-schliessen]').onclick = () => $('original').close();

// Ortsnamen in den Fugenräumen führen in den Ortsraum.
$('raum-buehne').addEventListener('click', (e) => { const b = e.target.closest('[data-ort]'); if (b) { e.preventDefault(); oeffneOrt(Number(b.dataset.ort)); } });

// Ortssuche über alle 1226 Orte.
{
  const input = $('suche'), liste = $('treffer'); let treffer = [], aktiv = -1;
  const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  const titel = karte.orte.map((o) => norm(o.t));
  const zeige = () => {
    leeren(liste); liste.hidden = !treffer.length; input.setAttribute('aria-expanded', String(!!treffer.length));
    treffer.forEach((i, k) => liste.append(h('li', { role: 'option', id: `treffer-${k}`, 'aria-selected': String(k === aktiv), onmousedown: (e) => { e.preventDefault(); waehle(i); } },
      h('strong', {}, karte.orte[i].t), h('span', {}, ` · ${karte.regionen[karte.orte[i].r].name}${amOrt.has(i) ? ` · ${amOrt.get(i).length} Fugenräume` : ''}`))));
    if (aktiv >= 0) input.setAttribute('aria-activedescendant', `treffer-${aktiv}`); else input.removeAttribute('aria-activedescendant');
  };
  const waehle = (i) => { input.value = ''; treffer = []; aktiv = -1; zeige(); oeffneOrt(i); };
  input.addEventListener('input', () => {
    const q = norm(input.value.trim()); aktiv = -1;
    treffer = q.length < 2 ? [] : titel.map((t, i) => [t.startsWith(q) ? 0 : t.includes(q) ? 1 : 9, i]).filter(([r]) => r < 9).sort((a, b) => a[0] - b[0] || karte.orte[b[1]].n - karte.orte[a[1]].n).slice(0, 8).map(([, i]) => i);
    zeige();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { aktiv = Math.min(treffer.length - 1, aktiv + 1); zeige(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { aktiv = Math.max(0, aktiv - 1); zeige(); e.preventDefault(); }
    else if (e.key === 'Enter' && treffer.length) { waehle(treffer[Math.max(0, aktiv)]); e.preventDefault(); }
    else if (e.key === 'Escape') { treffer = []; zeige(); e.stopPropagation(); }
  });
  input.addEventListener('blur', () => setTimeout(() => { treffer = []; zeige(); }, 150));
}

$('raum-zurueck').onclick = () => schliessen();
$('schicht-knopf').onclick = () => { const an = $('raum').dataset.schicht !== 'an'; $('raum').dataset.schicht = an ? 'an' : 'aus'; $('schicht-knopf').setAttribute('aria-pressed', String(an)); if (an) { $('raum-schicht').scrollIntoView({ block: 'start' }); $('raum-schicht').querySelector('select, button')?.focus({ preventScroll: true }); } };
$('raum-vor').onclick = () => aktuell?.typ === 'fuge' && oeffnen(aktuell.art, aktuell.i - 1);
$('raum-nach').onclick = () => aktuell?.typ === 'fuge' && oeffnen(aktuell.art, aktuell.i + 1);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('raum').hidden && !$('original').open && !e.target.closest?.('input, textarea, select')) schliessen(); });

async function route({ erster = false } = {}) {
  const h1 = location.hash;
  let m;
  if ((m = h1.match(/^#\/raum\/(\w+)\/(\d+)/)) && RAEUME[m[1]]) oeffnen(m[1], Number(m[2]), { ohneFlug: erster });
  else if ((m = h1.match(/^#\/ort\/(\d+)/)) && karte.orte[Number(m[1])]) oeffneOrt(Number(m[1]), { ohneFlug: erster });
  else if ((m = h1.match(/^#\/eigen\/([\w-]+)/)) && m[1] !== 'neu') oeffneEigen(m[1]);
  else schliessen({ ausVerlauf: true });
}
addEventListener('popstate', () => route());
await ladeTexte().then(() => texte.orte.forEach((t, i) => ortVonId.set(t.id, i))).then(eigenePunkte);
route({ erster: true });
pfad();
window.fugenland = { feld, punkte, FAELLE, werk, hand };
