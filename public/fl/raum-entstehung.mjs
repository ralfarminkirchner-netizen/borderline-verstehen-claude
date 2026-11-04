// Entstehung: mehrere Herkünfte fließen in einem Ort zusammen; von dort laufen Nachfolger weiter.
// Herkunft: gemeinsame Sinnbildung (De Jaegher und Di Paolo 2007: Beiträge, Wendepunkte, gemeinsam Entstandenes
// auseinanderhalten), Spiralwellenmyzel (lokale Reifung, Ausbreitung), WiRKGEFÜGE „zeit“ und Grok „drei Zeiten“,
// DAS DAZWISCHEN „Werdung“ (Stufen). Weiterentwickelt: Der Zusammenfluss ist eine Fuge mit mehr als zwei Beteiligten;
// jeder Zustrom bekommt seinen eigenen Beitrag, und was erst im Zusammenfluss entsteht, wird getrennt festgehalten.
import { h, s, absaetze } from './dom.mjs';

export const meta = {
  art: 'entstehung', name: 'Entstehung', kurz: 'mehrere Beiträge, ein Wendepunkt, gemeinsam Entstandenes',
  bedienung: 'Zustrom öffnen · Beitrag benennen · Wendepunkt setzen · Gemeinsames festhalten · flussabwärts gehen',
};
export const titel = (f) => f.ort.t;
export const ort = (f) => ({ x: f.ort.x, y: f.ort.y });
export const schluessel = (f) => `entstehung:${f.ort.id}`;
export const kanten = (f) => [...f.herkuenfte, ...f.nachfolger.map((k) => ({ ...k, gegenueber: k.ziel }))];

export function zeichne(buehne, fall, ctx) {
  const z = ctx.zustand(); const beitraege = z.beitraege || {};
  const n = fall.herkuenfte.length; const offen = ctx.fluechtig.strom ?? 0; const hk = fall.herkuenfte[offen];
  const W = 900, H = 520, mx = 450, my = 300;
  const quellX = (i) => 90 + (i * (W - 180)) / Math.max(1, n - 1 || 1) + (n === 1 ? (W - 180) / 2 : 0);
  const stroeme = fall.herkuenfte.map((k, i) => {
    const x = quellX(i); const d = `M${x} 30 C ${x} 170, ${mx + (x - mx) * 0.25} 200, ${mx} ${my - 40}`;
    const an = i === offen; const benannt = !!beitraege[k.quelle.id];
    return s('g', { class: `strom${an ? ' an' : ''}${benannt ? ' benannt' : ''}`, tabindex: '0', role: 'button', 'aria-label': `Zustrom aus ${k.quelle.t}${benannt ? ', Beitrag benannt' : ''}`,
      onclick: () => { ctx.fluechtig.strom = i; zeichne(buehne, fall, ctx); },
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctx.fluechtig.strom = i; zeichne(buehne, fall, ctx); } } },
      s('path', { d, class: 'strom-bett' }), s('path', { d, class: 'strom-wasser' }),
      s('text', { x, y: 18, 'text-anchor': 'middle' }, k.quelle.t));
  });
  const deltas = fall.nachfolger.slice(0, 6).map((k, i, arr) => {
    const x = 150 + (i * (W - 300)) / Math.max(1, arr.length - 1 || 1) + (arr.length === 1 ? (W - 300) / 2 : 0);
    return s('g', { class: 'delta' }, s('path', { d: `M${mx} ${my + 40} C ${mx} ${my + 110}, ${x} ${my + 120}, ${x} ${H - 40}`, class: 'strom-bett schmal' }),
      s('text', { x, y: H - 18, 'text-anchor': 'middle' }, k.ziel.t));
  });

  const beitrag = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': `Was trägt ${hk.quelle.t} bei?`, placeholder: `Was trägt „${hk.quelle.t}“ zu ${fall.ort.t} bei?` });
  beitrag.value = beitraege[hk.quelle.id] || '';
  const wende = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': 'Wendepunkt', placeholder: 'Woran wendet es sich hier – was wird anders als in jeder Herkunft allein?' });
  wende.value = z.wendepunkt || '';
  const gemeinsam = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': 'Gemeinsam Entstandenes', placeholder: 'Was gibt es erst durch den Zusammenfluss – in keiner Herkunft allein?' });
  gemeinsam.value = z.gemeinsam || '';
  const weiter = ctx.faelle.findIndex((f) => fall.nachfolger.some((k) => k.ziel.id === f.ort.id));

  buehne.replaceChildren(h('div', { class: 'entstehung' },
    h('div', { class: 'fluss-bild' },
      s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'fluss-svg', role: 'group', 'aria-label': `${n} Zuströme und ${fall.nachfolger.length} Nachfolger` },
        stroeme, deltas,
        s('ellipse', { cx: mx, cy: my, rx: 130, ry: 44, class: `becken-zusammen${z.wendepunkt ? ' gewendet' : ''}` }),
        s('text', { x: mx, y: my + 5, 'text-anchor': 'middle', class: 'becken-name-svg' }, fall.ort.t)),
      h('p', { class: 'leise' }, '„Hervorgegangen aus“ ist die Ideengeschichte des Bestands, keine Ursache und kein Wirknachweis. Die Breite der Ströme ist gleich: Der Bestand gewichtet die Herkünfte nicht.')),
    h('div', { class: 'fluss-seite' },
      h('section', { class: 'zustrom' },
        h('p', { class: 'zustrom-kopf' }, `Zustrom ${offen + 1} von ${n}: ${hk.quelle.gebiet}`),
        h('h2', {}, hk.quelle.t), h('button', { type: 'button', class: 'ortlink', 'data-ort': String(hk.quelle.i) }, 'Ort lesen'),
        h('div', { class: 'zustrom-text' }, absaetze(hk.text).slice(0, 4)),
        h('p', { class: 'leise' }, `Bestand: „${hk.label}“. ${hk.detail || ''}`),
        beitrag,
        h('button', { type: 'button', class: 'knopf', onclick: () => { ctx.handlung('beitrag', (zz) => { zz.beitraege = { ...(zz.beitraege || {}), [hk.quelle.id]: beitrag.value.trim() }; }, `${hk.quelle.t}: ${beitrag.value.trim()}`); zeichne(buehne, fall, ctx); } }, 'Beitrag benennen')),
      h('section', { class: 'zusammenfluss' },
        h('h2', {}, `Im Zusammenfluss: ${fall.ort.t}`), h('button', { type: 'button', class: 'ortlink', 'data-ort': String(fall.ort.i) }, 'Ort lesen'),
        h('div', { class: 'zustrom-text' }, absaetze(fall.text).slice(0, 3)),
        wende,
        h('button', { type: 'button', class: 'knopf', onclick: () => { ctx.handlung('wendepunkt', (zz) => { zz.wendepunkt = wende.value.trim(); }, wende.value.trim()); zeichne(buehne, fall, ctx); } }, 'Wendepunkt setzen'),
        gemeinsam,
        h('button', { type: 'button', class: 'knopf leise', onclick: () => { ctx.handlung('gemeinsam', (zz) => { zz.gemeinsam = gemeinsam.value.trim(); }, gemeinsam.value.trim()); zeichne(buehne, fall, ctx); } }, 'Gemeinsam Entstandenes festhalten'),
        h('p', { class: 'leise' }, `${Object.values(beitraege).filter(Boolean).length} von ${n} Beiträgen benannt${z.wendepunkt ? ' · Wendepunkt gesetzt' : ''}${z.gemeinsam ? ' · Gemeinsames festgehalten' : ''}.`),
        weiter >= 0 ? h('button', { type: 'button', class: 'knopf leise', onclick: () => ctx.oeffneFall(weiter) }, `Flussabwärts: ${ctx.faelle[weiter].ort.t}`) : null))));
}
