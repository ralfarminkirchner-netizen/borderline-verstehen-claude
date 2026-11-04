// Übersetzung: derselbe Ort in zwei Gebieten, zwei Wortlaute. Dazwischen ein Pass mit Becken.
// Herkunft: „Verkörperungsvertrag“ (ChatGPT, Transduktion und Invarianz, 2026-08-01: was erhalten bleiben muss,
// was sich verändern darf, was nicht übersetzbar ist, wo Verfälschung beginnt, Rückkehr zum Ursprung),
// Formvorschlag „Übersetzung“ (DAS DAZWISCHEN B), DURCH (ChatGPT FUGE), Antigravity „gemeinsame Kapitelidentität“.
// Weiterentwickelt: Wörter der Originale werden einzeln in Becken gelegt; der Wortabgleich ist nur ein sichtbarer
// Vorschlag auf Sprachebene und wird nie selbst einsortiert.
import { h } from './dom.mjs';

export const meta = {
  art: 'uebersetzung', name: 'Übersetzung', kurz: 'erhalten, verändert, verloren',
  bedienung: 'Wort aufnehmen · in ein Becken legen · Wortgleiche zeigen · Original lesen',
};
export const titel = (f) => f.titel;
export const ort = (f) => ({ x: f.fassungen[0].x, y: f.fassungen[0].y });
export const schluessel = (f) => `uebersetzung:${f.fassungen.map((x) => x.id).join('~')}`;
export const kanten = () => [];

const BECKEN = [
  ['erhalten', 'bleibt erhalten', 'Trägt in beiden Fassungen.'],
  ['veraendert', 'verändert sich', 'Ist da, aber anders gefasst.'],
  ['nurhier', 'nur in einer Fassung', 'Fehlt drüben – ist es trotzdem unverzichtbar?'],
  ['unuebersetzbar', 'nicht übersetzbar', 'Lässt sich nicht hinübertragen und wird gerade deshalb geschützt.'],
  ['verfaelschung', 'hier beginnt Verfälschung', 'Hier ersetzt die Fassung, statt zu übertragen.'],
];
const stamm = (w) => w.toLowerCase().replace(/(ungen|ung|en|er|es|e|n|s)$/, '');

export function zeichne(buehne, fall, ctx) {
  const z = ctx.zustand();
  const paar = z.paar || [0, 1];
  const fs = paar.map((i) => fall.fassungen[i]);
  const gleich = new Set(fall.wortabgleich.gemeinsam.map(stamm));
  const hand = ctx.fluechtig.hand || null;

  const fassung = (f, seite) => {
    const teile = f.text.replace(/^#+\s*/gm, '').split(/([A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]*)/);
    const text = h('p', { class: 'fassung-text', onkeydown: (e) => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const ws = [...text.querySelectorAll('.wort')]; const i = ws.indexOf(document.activeElement);
      const n = ws[Math.max(0, Math.min(ws.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)))];
      if (n) { ws.forEach((w) => w.setAttribute('tabindex', '-1')); n.setAttribute('tabindex', '0'); n.focus(); e.preventDefault(); }
    } }, teile.map((t, i) => {
      if (i % 2 === 0) return t;
      const istGleich = z.zeigeGleiche && gleich.has(stamm(t));
      const inHand = hand && hand.wort === t && hand.seite === seite;
      return h('button', { type: 'button', class: `wort${istGleich ? ' gleich' : ''}${inHand ? ' in-hand' : ''}`, tabindex: i === 1 ? '0' : '-1',
        onclick: () => { ctx.fluechtig.hand = inHand ? null : { wort: t, seite, gebiet: f.gebiet }; zeichne(buehne, fall, ctx); buehne.querySelector('.wort.in-hand')?.focus(); } }, t);
    }));
    return h('article', { class: `fassung ${seite === 0 ? 'links' : 'rechts'}` },
      h('p', { class: 'fassung-gebiet' }, f.gebiet),
      h('h2', { class: 'fassung-titel' }, f.t), h('button', { type: 'button', class: 'ortlink', 'data-ort': String(f.i) }, 'Ort lesen'),
      text,
      h('button', { type: 'button', class: 'knopf leise', onclick: () => ctx.oeffneOriginal(`${f.t} · ${f.gebiet}`, f.text, f.herkunft || f.gebiet) }, 'Zur Quelle dieser Fassung'));
  };

  const becken = BECKEN.map(([k, name, erkl]) => {
    const drin = (z.becken?.[k] || []);
    return h('li', { class: `becken ${k}${hand ? ' bereit' : ''}` },
      h('button', { type: 'button', class: 'becken-rand', disabled: !hand, 'aria-label': hand ? `„${hand.wort}“ hier ablegen: ${name}` : `${name} – zuerst ein Wort aufnehmen`,
        onclick: () => {
          const w = ctx.fluechtig.hand; if (!w) return; ctx.fluechtig.hand = null;
          ctx.handlung('wort-eingelegt', (zz) => { zz.becken = { ...(zz.becken || {}) }; zz.becken[k] = [...(zz.becken[k] || []), w]; }, `${w.wort} → ${name}`);
          zeichne(buehne, fall, ctx);
        } }, h('span', { class: 'becken-name' }, name), h('span', { class: 'becken-erkl' }, erkl)),
      h('ul', { class: 'becken-inhalt' }, drin.map((w, i) => h('li', {},
        h('button', { type: 'button', class: `kiesel s${w.seite}`, title: `aus ${w.gebiet} – antippen nimmt es heraus`,
          onclick: () => { ctx.handlung('wort-entnommen', (zz) => { zz.becken[k].splice(i, 1); }, w.wort); zeichne(buehne, fall, ctx); } }, w.wort)))));
  });

  const vertrag = BECKEN.filter(([k]) => z.becken?.[k]?.length).map(([k, name]) => h('li', {}, h('strong', {}, `${name}: `), z.becken[k].map((w) => w.wort).join(', ')));
  const mehr = fall.fassungen.length > 2;

  buehne.replaceChildren(h('div', { class: 'uebersetzung' },
    fassung(fs[0], 0),
    h('div', { class: 'pass' },
      h('p', { class: 'pass-kopf' }, hand ? `In der Hand: „${hand.wort}“ aus ${hand.gebiet}. Leg es in ein Becken.` : 'Tippe ein Wort in einer Fassung an und leg es in ein Becken.'),
      h('ol', { class: 'becken-liste' }, becken),
      h('div', { class: 'reihe' },
        h('button', { type: 'button', class: 'knopf leise', 'aria-pressed': String(!!z.zeigeGleiche),
          onclick: () => { ctx.handlung('wortgleiche', (zz) => { zz.zeigeGleiche = !zz.zeigeGleiche; }, 'Wortabgleich'); zeichne(buehne, fall, ctx); } },
          z.zeigeGleiche ? 'Wortgleiche ausblenden' : `Wortgleiche zeigen (${fall.wortabgleich.gemeinsam.length})`),
        mehr ? h('button', { type: 'button', class: 'knopf leise', onclick: () => {
          ctx.handlung('fassung-gewechselt', (zz) => { const p = zz.paar || [0, 1]; zz.paar = [p[0], (p[1] + 1) % fall.fassungen.length || 1]; }, 'andere Fassung'); zeichne(buehne, fall, ctx);
        } }, 'Andere Fassung daneben') : null),
      z.zeigeGleiche ? h('p', { class: 'leise' }, 'Unterstrichen: gleiche Wortstämme in beiden Fassungen. Das ist Sprachähnlichkeit, keine Bedeutungsgleichheit – einsortieren musst du selbst.') : null,
      vertrag.length ? h('div', { class: 'vertrag' }, h('p', { class: 'vertrag-kopf' }, 'Dein Übersetzungsvertrag für diesen Ort'), h('ul', {}, vertrag),
        h('p', { class: 'leise' }, 'Rückkehr: beide Fassungen bleiben über „Zur Quelle“ im vollen Wortlaut erreichbar.')) : null),
    fassung(fs[1], 1)));
}
