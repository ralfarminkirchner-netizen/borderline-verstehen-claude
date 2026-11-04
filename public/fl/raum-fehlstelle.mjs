// Fehlstelle: eine ausgesparte Kammer. Ihr Rand ist beschriftet mit dem, was an sie grenzt; ihre Mitte bleibt leer.
// Herkunft: FEHLT (ChatGPT FUGE: dritte Stimme suchen), „Fehlstelle“ (Codex-Erkundung 2026-11-04: unbekannt, fehlt,
// nicht zugänglich bleiben unterscheidbar), Nichtverbindung (WiRKGEFÜGE, Codex FUGEN), ehrliche Unverbundenheit
// (DAS DAZWISCHEN Spur), typisierte Leerwerte (Grok Fugenfassung). Weiterentwickelt: Die Lücke ist ein eigener
// Gegenstand mit Rand aus echten Kanten; du ordnest sie ein, stellst ihre Frage und kannst eine Nicht-Verbindung begründen.
import { h, s } from './dom.mjs';

export const meta = {
  art: 'fehlstelle', name: 'Fehlstelle', kurz: 'Lücke und Nicht-Verbindung als eigener Gegenstand',
  bedienung: 'Rand abtasten · Lücke einordnen · Frage stellen · Nicht-Verbindung begründen',
};
export const titel = (f) => f.modus === 'nicht-erreichbar' ? f.kapitel.titel : f.ort.t;
export const ort = (f, ctx) => f.ort ? { x: f.ort.x, y: f.ort.y } : ctx.gebietsMitte('Forschung & Einordnung');
export const schluessel = (f) => f.modus === 'nicht-erreichbar' ? `fehlstelle:kapitel-${f.kapitel.datei}` : `fehlstelle:${f.ort.id}`;
export const kanten = (f) => f.raender;

const ARTEN = [
  ['unbekannt', 'unbekannt', 'Niemand weiß es bisher.'],
  ['nicht-untersucht', 'nicht untersucht', 'Es wurde nicht danach gefragt.'],
  ['nicht-zugaenglich', 'nicht zugänglich', 'Es gibt etwas, aber es ist hier nicht erreichbar.'],
  ['bewusst-offen', 'bewusst offen', 'Es soll offen bleiben.'],
];
const BESTAND = {
  'befund-fehlt': 'Der Bestand sagt, dass hier untersucht wurde. Einen Befund hält er an dieser Stelle nicht fest.',
  eigen: 'Diese Lücke hast du selbst gesetzt. Ihr Rand sind die Orte deiner eigenen Fuge; sie ist kein Befund des Bestands.',
  'nicht-erreichbar': 'Das Kapitel liegt im Fundus vor, hat im Atlasbestand aber keinen eigenen Ort. Von der Karte aus ist es nicht erreichbar.',
};

export function zeichne(buehne, fall, ctx) {
  const z = ctx.zustand();
  const rand = fall.raender; const sichtbar = rand.slice(0, 14);
  const gewaehlt = ctx.fluechtig.rand ?? null;
  const nicht = z.nichtverbindungen || [];

  const W = 640, C = 320, R = 210;
  const marken = sichtbar.map((r, i) => {
    const a = -Math.PI / 2 + (i / Math.max(sichtbar.length, 1)) * Math.PI * 2;
    const x = C + Math.cos(a) * (R + 18), y = C + Math.sin(a) * (R + 18);
    const istNicht = nicht.some((n) => n.zu === r.gegenueber.id);
    return s('g', { class: `rand-marke${gewaehlt === i ? ' an' : ''}${istNicht ? ' nicht' : ''}`, transform: `translate(${x} ${y})`, tabindex: '0', role: 'button',
      'aria-label': `Rand: ${r.gegenueber.t} – ${r.label}`,
      onclick: () => { ctx.fluechtig.rand = i; zeichne(buehne, fall, ctx); },
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctx.fluechtig.rand = i; zeichne(buehne, fall, ctx); } } },
      s('circle', { r: 7 }), istNicht ? s('path', { d: 'M-6 -6L6 6M6 -6L-6 6', class: 'kreuz' }) : null);
  });

  const r = gewaehlt !== null ? sichtbar[gewaehlt] : null;
  const grund = h('input', { class: 'feld-eingabe', 'aria-label': 'Begründung der Nicht-Verbindung', placeholder: 'Warum hängt das hier ausdrücklich nicht zusammen?' });
  const randInfo = r ? h('div', { class: 'rand-info' },
    h('p', { class: 'rand-info-kopf' }, `Am Rand: ${r.gegenueber.gebiet}`),
    h('p', { class: 'rand-info-titel' }, r.gegenueber.t), h('button', { type: 'button', class: 'ortlink', 'data-ort': String(r.gegenueber.i) }, 'Ort lesen'),
    h('p', {}, `Bestand: „${r.label}“. ${r.detail || ''}`),
    r.quellen.length ? h('p', { class: 'leise' }, `Quelle: ${r.quellen.map((q) => q.titel).join(' · ')}`) : null,
    grund,
    h('button', { type: 'button', class: 'knopf leise', onclick: () => {
      ctx.handlung('nicht-verbindung', (zz) => { zz.nichtverbindungen = [...(zz.nichtverbindungen || []).filter((n) => n.zu !== r.gegenueber.id), { zu: r.gegenueber.id, name: r.gegenueber.t, grund: grund.value.trim() }]; }, r.gegenueber.t);
      zeichne(buehne, fall, ctx);
    } }, 'Als Nicht-Verbindung festhalten')) : h('p', { class: 'leise' }, rand.length ? 'Einen Punkt am Rand antippen: Er zeigt, was an diese Lücke grenzt.' : 'Diese Lücke hat im Bestand keinen Rand aus Kanten.');

  const frage = h('textarea', { class: 'feld-eingabe kammer-frage-eingabe', rows: '2', 'aria-label': 'Die Frage dieser Lücke', placeholder: 'Welche Frage stellt diese Lücke?' });
  frage.value = z.frage || '';

  buehne.replaceChildren(h('div', { class: 'fehlstelle' },
    h('div', { class: 'kammer-bild' },
      s('svg', { viewBox: `0 0 ${W} ${W}`, class: 'kammer-svg', role: 'group', 'aria-label': 'Rand der Lücke' },
        s('defs', {}, s('pattern', { id: 'kammer-schraffur', width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, s('line', { x1: 0, y1: 0, x2: 0, y2: 9 }))),
        s('circle', { cx: C, cy: C, r: R + 18, class: 'kammer-rand' }),
        s('circle', { cx: C, cy: C, r: R, class: 'kammer-wand' }),
        s('circle', { cx: C, cy: C, r: R - 26, class: 'kammer-leere' }),
        marken),
      h('div', { class: 'kammer-mitte' },
        h('p', { class: 'kammer-art' }, z.art ? ARTEN.find((a) => a[0] === z.art)[1] : 'noch nicht eingeordnet'),
        h('p', { class: 'kammer-frage' }, z.frage || 'Diese Kammer wird nicht automatisch gefüllt.'))),
    h('div', { class: 'kammer-seite' },
      h('p', { class: 'kammer-bestand' }, BESTAND[fall.modus]), fall.ort ? h('button', { type: 'button', class: 'ortlink', 'data-ort': String(fall.ort.i) }, 'Ort lesen') : null,
      fall.kapitel ? h('div', {}, h('p', { class: 'kammer-kapitel' }, fall.kapitel.anfang.replace(/[#*]/g, '').slice(0, 420) + ' …'),
        h('button', { type: 'button', class: 'knopf leise', onclick: () => ctx.oeffneKapitel(fall.kapitel.datei) }, 'Kapitel im Fundus lesen')) : null,
      h('p', { class: 'kammer-zahl' }, rand.length ? `${rand.length} Kanten bilden den Rand${rand.length > sichtbar.length ? ` (${sichtbar.length} am Kreis, alle unten)` : ''}.` : ''),
      randInfo,
      h('fieldset', { class: 'einordnung' }, h('legend', {}, 'Deine Einordnung der Lücke'),
        ARTEN.map(([k, l, erkl]) => h('label', { class: `einordnung-wahl${z.art === k ? ' an' : ''}` },
          h('input', { type: 'radio', name: 'lueckenart', value: k, checked: z.art === k, onchange: () => { ctx.handlung('luecke-eingeordnet', (zz) => { zz.art = k; }, l); zeichne(buehne, fall, ctx); } }),
          h('span', {}, h('strong', {}, l), ` – ${erkl}`)))),
      frage,
      h('button', { type: 'button', class: 'knopf', onclick: () => { ctx.handlung('luecken-frage', (zz) => { zz.frage = frage.value.trim(); }, frage.value.trim()); zeichne(buehne, fall, ctx); } }, 'Frage an die Lücke heften'),
      nicht.length ? h('ul', { class: 'nicht-liste', 'aria-label': 'Begründete Nicht-Verbindungen' }, nicht.map((n) => h('li', {}, `nicht verbunden mit ${n.name}${n.grund ? `: ${n.grund}` : ''}`))) : null,
      rand.length > sichtbar.length ? h('section', { class: 'rand-alle' }, h('h3', {}, `Alle ${rand.length} Randkanten`),
        h('ul', {}, rand.map((k) => h('li', {}, `${k.gegenueber.t} – ${k.label}`)))) : null)));
}
