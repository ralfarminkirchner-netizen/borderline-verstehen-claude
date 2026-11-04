// Schwelle: eine Aussage steht hinter einem Tor. Jede Geltungsgrenze oder Bedingung ist ein Riegel.
// Herkunft: Grok „Schwelle – Übergang prüfen“ (Möglichkeit, Regel, Versuch, Wirkung bleiben auseinander),
// Formvorschlag „Schwelle“ (DAS DAZWISCHEN B: eine eingerichtete Schwelle belegt keine erfolgte Überschreitung),
// Bedingungsfuge aus dem Auftrag. Weiterentwickelt: Riegel lassen sich einzeln ziehen (entziehen) und prüfen;
// die Aussage zeigt, unter wie vielen ihrer Bestandsbedingungen sie noch steht.
import { h, absaetze } from './dom.mjs';

export const meta = {
  art: 'schwelle', name: 'Schwelle', kurz: 'Voraussetzungen prüfen und entziehen',
  bedienung: 'Riegel ziehen · Riegel prüfen (erfüllt, ungeklärt, verletzt) · Stufen des Übergangs ablesen',
};
export const titel = (f) => f.ort.t;
export const ort = (f) => ({ x: f.ort.x, y: f.ort.y });
export const schluessel = (f) => `schwelle:${f.ort.id}`;
export const kanten = (f) => f.riegel;

const PRUEF = [['erfuellt', 'erfüllt'], ['ungeklaert', 'ungeklärt'], ['verletzt', 'verletzt']];
const rk = (r) => `${r.n}`;

export function zeichne(buehne, fall, ctx) {
  const z = ctx.zustand();
  const gezogen = new Set(z.gezogen || []); const pruef = z.pruefung || {};
  const stecken = fall.riegel.filter((r) => !gezogen.has(rk(r)));

  const riegel = fall.riegel.map((r, i) => {
    const raus = gezogen.has(rk(r));
    const text = `${r.label} · ${r.gegenueber.t}`;
    return h('li', { class: `riegel${raus ? ' raus' : ''}`, style: `--i:${i}` },
      h('button', {
        type: 'button', class: 'riegel-stange', 'aria-pressed': String(raus),
        'aria-label': `${raus ? 'Riegel zurückschieben' : 'Riegel ziehen'}: ${text}`,
        onclick: () => {
          ctx.handlung(raus ? 'riegel-zurueck' : 'riegel-gezogen', (zz) => {
            const g = new Set(zz.gezogen || []); raus ? g.delete(rk(r)) : g.add(rk(r)); zz.gezogen = [...g];
          }, text);
          zeichne(buehne, fall, ctx);
        },
      }, h('span', { class: 'riegel-griff', 'aria-hidden': 'true' }), h('span', { class: 'riegel-text' }, text)),
      h('p', { class: 'riegel-herkunft' }, `${r.grenze ? `Grenze: ${r.grenze}` : r.art === 'bedingung' ? 'Bedingung im Modell' : 'Grenze im Bestand nicht angegeben'}${r.quellen.length ? ` · ${r.quellen.length} Quelle${r.quellen.length > 1 ? 'n' : ''}` : ' · ohne Quelle'}`),
      h('div', { class: 'pruef', role: 'radiogroup', 'aria-label': 'Deine Prüfung dieses Riegels' },
        PRUEF.map(([w, l]) => h('button', {
          type: 'button', role: 'radio', class: `pruef-chip ${w}`, 'aria-checked': String(pruef[rk(r)] === w),
          onclick: () => { ctx.handlung('riegel-geprueft', (zz) => { zz.pruefung = { ...(zz.pruefung || {}), [rk(r)]: zz.pruefung?.[rk(r)] === w ? undefined : w }; }, `${l}: ${text}`); zeichne(buehne, fall, ctx); },
        }, l))));
  });

  const versucht = Object.values(pruef).some(Boolean);
  const stufen = [
    ['Möglichkeit', 'Der Bestand nennt die Aussage.', true],
    ['Regel', `${fall.riegel.length} Bedingungen oder Grenzen sind formuliert.`, fall.riegel.length > 0],
    ['Versuch', versucht ? 'Du hast Riegel geprüft.' : 'Noch kein Riegel von dir geprüft.', versucht],
    ['Wirkung', 'Ob der Übergang gelingt, belegt diese Schwelle nicht.', false],
  ];

  const offen = stecken.length === 0;
  buehne.replaceChildren(h('div', { class: `schwelle${offen ? ' tor-offen' : ''}`, style: `--entzogen:${(fall.riegel.length - stecken.length) / fall.riegel.length}` },
    h('div', { class: 'tor' },
      h('div', { class: 'pfosten links', 'aria-hidden': 'true' }), h('div', { class: 'pfosten rechts', 'aria-hidden': 'true' }),
      h('ol', { class: 'riegel-liste', 'aria-label': 'Riegel dieser Schwelle' }, riegel)),
    h('div', { class: 'jenseits' },
      h('p', { class: 'jenseits-kopf' }, `${fall.ort.gebiet} · hinter der Schwelle`),
      h('h2', { class: 'jenseits-titel' }, fall.ort.t),
      h('div', { class: 'jenseits-text' }, absaetze(fall.text)),
      h('p', { class: 'jenseits-stand' }, offen
        ? 'Alle Riegel gezogen. Was ohne diese Grenzen gilt, sagt der Bestand nicht – die Aussage steht jetzt ohne ihren Rahmen.'
        : `Die Aussage steht unter ${stecken.length} von ${fall.riegel.length} ihrer Bestandsgrenzen.`),
      gezogen.size ? h('ul', { class: 'entzogen', 'aria-label': 'Entzogene Grenzen' },
        fall.riegel.filter((r) => gezogen.has(rk(r))).map((r) => h('li', {}, `entzogen: ${r.grenze || r.label}`))) : null,
      h('ol', { class: 'stufen', 'aria-label': 'Stufen des Übergangs' },
        stufen.map(([n, t, an]) => h('li', { class: an ? 'an' : 'aus' }, h('strong', {}, n), h('span', {}, t)))),
      h('p', { class: 'leise' }, 'Ziehen verändert nur deine Lesart. Der Bestand und seine Grenzen bleiben unverändert.'))));
}
