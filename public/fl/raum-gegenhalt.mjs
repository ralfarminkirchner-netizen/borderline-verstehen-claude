// Gegenhalt: zwei Seiten treffen nicht glatt aufeinander. Dazwischen liegt ein Spalt, der offen bleibt.
// Herkunft: Reibung (DAS DAZWISCHEN, Zusammenführung B), Einwand (Grok Fugenfassung 0.2), GEGEN (ChatGPT FUGE),
// „Gegenhalt“ und „Spalte“ (Codex-Erkundung 2026-11-04). Weiterentwickelt: Belege als einzeln wägbare Steine je Seite,
// eigene Gegenstimmen werden in den Spalt gekeilt, der Spalt schließt sich nie durch Mehrheit.
import { h, s, quellZeile } from './dom.mjs';

export const meta = {
  art: 'gegenhalt', name: 'Gegenhalt', kurz: 'Widerspruch bleibt mit Belegen offen',
  bedienung: 'Belege einzeln aufnehmen · Gegenstimme in den Spalt keilen · Seite wechseln',
};
const MODUS = { widerspruch: 'Widerspruch', spannung: 'Gegenpol', abstand: 'Nicht dasselbe' };

export const titel = (f) => `${f.seiten[0].t} ⟷ ${f.seiten[1].t}`;
export const ort = (f) => ({ x: (f.seiten[0].x + f.seiten[1].x) / 2, y: (f.seiten[0].y + f.seiten[1].y) / 2 });
export const schluessel = (f) => `gegenhalt:${f.seiten[0].id}~${f.seiten[1].id}`;
export const kanten = (f) => f.aussagen;

// Unregelmäßige Bruchkante aus einer festen Saat: dieselbe Fuge hat immer dieselbe Kante.
function bruch(seed, n, breite) {
  let z = seed; const r = () => ((z = (z * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: n + 1 }, (_, i) => [Math.round(r() * breite), Math.round((i / n) * 1000)]);
}

export function zeichne(buehne, fall, ctx) {
  const z = ctx.zustand();
  const gewechselt = !!z.gewechselt;
  const [A, B] = gewechselt ? [fall.seiten[1], fall.seiten[0]] : fall.seiten;
  const von = (seite) => fall.aussagen.filter((k) => k.a === seite.i);
  const seed = fall.seiten[0].i * 31 + fall.seiten[1].i;
  const kanteL = bruch(seed, 14, 60); const kanteR = bruch(seed + 7, 14, 60);
  const frage = fall.aussagen.find((k) => k.frage)?.frage;
  const detail = h('div', { class: 'spalt-detail', 'aria-live': 'polite' },
    h('p', { class: 'spalt-hinweis' }, 'Einen Stein aufnehmen: Er zeigt die Quelle, auf die sich diese Seite stützt.'));

  const stein = (q, seite, k) => {
    const gelesen = (z.gelesen || []).includes(q.schluessel);
    return h('button', {
      type: 'button', class: `stein${gelesen ? ' gelesen' : ''}`, 'aria-pressed': String(gelesen),
      onclick: () => {
        ctx.handlung('beleg-aufgenommen', (zz) => { zz.gelesen = [...new Set([...(zz.gelesen || []), q.schluessel])]; }, `${seite.t}: ${q.titel}`);
        detail.replaceChildren(
          h('p', { class: 'spalt-detail-kopf' }, `Beleg der Seite „${seite.t}“`),
          h('p', { class: 'spalt-detail-titel' }, quellZeile(q)),
          h('p', {}, `Trägt die Aussage „${k.label}“.`),
          q.url ? h('a', { href: q.url, target: '_blank', rel: 'noopener' }, 'Quelle außerhalb öffnen') : h('p', { class: 'leise' }, 'Im Bestand ohne Adresse.'),
          h('p', { class: 'leise' }, 'Ein gelesener Beleg macht die Seite nicht schwerer. Er hebt nur hervor, was du angesehen hast.'));
        zeichne(buehne, fall, ctx); buehne.querySelector('.spalt-detail')?.replaceWith(detail);
      },
    }, h('span', { class: 'stein-name' }, q.autoren ? q.autoren.split(',')[0] + (q.jahr ? ` ${q.jahr}` : '') : q.titel));
  };

  const fels = (seite, kante, rechts) => {
    const aussagen = von(seite);
    const poly = rechts
      ? `polygon(${kante.map(([x, y]) => `${x / 10}% ${y / 10}%`).join(',')}, 100% 100%, 100% 0%)`
      : `polygon(0% 0%, ${kante.map(([x, y]) => `${100 - x / 10}% ${y / 10}%`).join(',')}, 0% 100%)`;
    return h('div', { class: `fels ${rechts ? 'rechts' : 'links'}`, style: `clip-path:${poly}` },
      h('div', { class: 'fels-innen' },
        h('p', { class: 'fels-gebiet' }, seite.gebiet),
        h('h2', { class: 'fels-titel' }, seite.t), h('button', { type: 'button', class: 'ortlink', 'data-ort': String(seite.i) }, 'Ort lesen'),
        h('p', { class: 'fels-kurz' }, seite.s),
        aussagen.length
          ? h('ul', { class: 'fels-aussagen' }, aussagen.map((k) => h('li', {}, h('strong', {}, `sagt: ${k.label}`), k.grenze ? h('span', { class: 'fels-grenze' }, `Grenze: ${k.grenze}`) : null)))
          : h('p', { class: 'fels-leer' }, 'Diese Seite sagt im Bestand nichts Eigenes über die andere; sie wird angesprochen.'),
        h('div', { class: 'steine', role: 'group', 'aria-label': `Belege der Seite ${seite.t}` },
          aussagen.flatMap((k) => k.quellen.map((q) => stein(q, seite, k))),
          aussagen.every((k) => !k.quellen.length) ? h('p', { class: 'fels-leer' }, 'Keine Quelle an dieser Seite im Bestand.') : null)));
  };

  const keile = (z.einwaende || []).map((e, n) => h('li', { class: 'keil' },
    h('span', { class: 'keil-text' }, e.text),
    h('span', { class: 'keil-wer' }, 'deine Gegenstimme'),
    h('button', { type: 'button', class: 'knopf mini', onclick: () => { ctx.handlung('gegenstimme-entfernt', (zz) => { zz.einwaende.splice(n, 1); }, e.text); zeichne(buehne, fall, ctx); } }, 'herausnehmen')));

  const eingabe = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': 'Eigene Gegenstimme', placeholder: 'Eigene Gegenstimme oder Frage …' });
  const spalt = h('div', { class: 'spalt' },
    s('svg', { class: 'spalt-riss', viewBox: '0 0 100 1000', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
      s('path', { d: `M50 0 ${kanteL.map(([x, y], i) => `L${50 + (i % 2 ? 1 : -1) * (6 + x / 10)} ${y}`).join(' ')} L50 1000` })),
    h('div', { class: 'spalt-innen' },
      h('p', { class: 'spalt-modus' }, MODUS[fall.modus] || 'Gegenhalt'),
      h('p', { class: 'spalt-frage' }, frage || 'Was müsste geklärt sein, damit eine Seite trägt – und woran würdest du es erkennen?'),
      h('p', { class: 'spalt-frage-herkunft' }, frage ? 'Frage aus dem Bestand' : 'Raumfrage dieser Fassung, nicht aus dem Bestand'),
      detail,
      h('ul', { class: 'keile', 'aria-label': 'Gegenstimmen im Spalt' }, keile),
      eingabe,
      h('div', { class: 'reihe' },
        h('button', { type: 'button', class: 'knopf', onclick: () => {
          const t = eingabe.value.trim(); if (!t) { eingabe.focus(); return; }
          ctx.handlung('gegenstimme', (zz) => { zz.einwaende = [...(zz.einwaende || []), { text: t, zeit: new Date().toISOString() }]; }, t);
          zeichne(buehne, fall, ctx);
        } }, 'In den Spalt keilen'),
        h('button', { type: 'button', class: 'knopf leise', onclick: () => {
          ctx.handlung('seite-gewechselt', (zz) => { zz.gewechselt = !zz.gewechselt; }, 'Seitenwechsel');
          buehne.querySelector('.gegenhalt')?.classList.add('kippt'); setTimeout(() => zeichne(buehne, fall, ctx), ctx.ruhig() ? 0 : 380);
        } }, 'Seite wechseln')),
      h('p', { class: 'spalt-regel' }, 'Der Spalt schließt sich nicht durch die Zahl der Belege. Er bleibt offen, bis du ihn begründet anders liest.')));

  buehne.replaceChildren(h('div', { class: 'gegenhalt' }, fels(A, kanteL, false), spalt, fels(B, kanteR, true)));
}
