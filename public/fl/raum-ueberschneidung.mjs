// Überschneidung: mehrere Stimmen (Beschreibungskontexte) teilen Phänomene. Eine Fuge mit mehr als zwei Beteiligten.
// Herkunft: Antigravity „Zellgewebe“ (Membranen um Zugehörigkeiten, gleiche Identität in mehreren Räumen),
// Bubble Sets (Collins, Penn, Carpendale 2009), Gruppeninteraktionen jenseits von Paaren (Cencetti u. a. 2021),
// Cursor „Phänomenkörper“ (erkannte Brücken und Verzweigungen aus dem Bestand), Atlasregel „unspezifische Überschneidung“.
// Weiterentwickelt: Die Lage jedes Phänomens ist der Schwerpunkt seiner gewählten Stimmen; Stimmen zu- oder
// abzuschalten ordnet das Feld neu und zeigt, was gemeinsam ist und was unterscheidet. Kein Zentrum, keine Ursache.
import { h, s } from './dom.mjs';

export const meta = {
  art: 'ueberschneidung', name: 'Überschneidung', kurz: 'mehrere Stimmen, ein gemeinsamer Grund',
  bedienung: 'Stimmen zu- und abschalten · Phänomen antippen · Unterscheidungsfrage notieren',
};
export const titel = (f) => f.titel;
export const ort = (f) => ({ x: f.x, y: f.y });
export const schluessel = (f) => `ueberschneidung:${f.phId}`;
export const kanten = () => [];

const FARBEN = ['#b4561c', '#2f6f8f', '#6c7a2a', '#8a3f6e', '#4e5bb0', '#9a7a18'];
const golden = Math.PI * (3 - Math.sqrt(5));

export function zeichne(buehne, fall, ctx) {
  const { stimmen, phaenomene } = ctx.daten.ueberschneidung;
  const z = ctx.zustand();
  const gewaehlt = (z.gewaehlt || fall.start).filter((id) => stimmen.some((x) => x.id === id)).slice(0, 6);
  const sel = gewaehlt.map((id) => stimmen.find((x) => x.id === id));
  const phNach = new Map(phaenomene.map((p) => [p.i, p]));
  const fokus = ctx.fluechtig.fokus ?? fall.ph;

  // Lage: Stimmen auf einem Kreis, Phänomene im Schwerpunkt ihrer gewählten Stimmen.
  const W = 1000, H = 620, cx = 500, cy = 310, R = sel.length > 2 ? 230 : 200;
  const pos = sel.map((_, k) => { const a = -Math.PI / 2 + (k / sel.length) * Math.PI * 2; return [cx + Math.cos(a) * R * 1.25, cy + Math.sin(a) * R]; });
  const mitglied = new Map();
  sel.forEach((v, k) => v.phaenomene.forEach((p) => { if (!mitglied.has(p)) mitglied.set(p, []); mitglied.get(p).push(k); }));
  const gruppen = new Map();
  for (const [p, ks] of mitglied) { const key = ks.join(','); if (!gruppen.has(key)) gruppen.set(key, []); gruppen.get(key).push(p); }
  const punkte = [];
  for (const [key, ps] of gruppen) {
    const ks = key.split(',').map(Number);
    const mx = ks.reduce((a, k) => a + pos[k][0], 0) / ks.length; const my = ks.reduce((a, k) => a + pos[k][1], 0) / ks.length;
    const zugMitte = ks.length === 1 ? 0.62 : 1; // Einzelne Phänomene liegen näher an ihrer Stimme, aber innerhalb der Membran.
    const bx = ks.length === 1 ? cx + (mx - cx) * zugMitte : mx; const by = ks.length === 1 ? cy + (my - cy) * zugMitte : my;
    ps.forEach((p, n) => { const r = 9 * Math.sqrt(n + 0.5); punkte.push({ p, ks, x: bx + Math.cos(n * golden) * r * 1.6, y: by + Math.sin(n * golden) * r }); });
  }
  const alle = punkte.filter((q) => q.ks.length === sel.length && sel.length > 1);
  const mehrere = punkte.filter((q) => q.ks.length > 1 && q.ks.length < sel.length);
  const nur = sel.map((_, k) => punkte.filter((q) => q.ks.length === 1 && q.ks[0] === k));

  // Membran: weich gerundete Hülle um die Punkte einer Stimme.
  const huelle = (pts) => {
    const P = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (P.length < 3) return P;
    const kreuz = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = []; for (const p of P) { while (lo.length >= 2 && kreuz(lo.at(-2), lo.at(-1), p) <= 0) lo.pop(); lo.push(p); }
    const hi = []; for (const p of [...P].reverse()) { while (hi.length >= 2 && kreuz(hi.at(-2), hi.at(-1), p) <= 0) hi.pop(); hi.push(p); }
    return lo.slice(0, -1).concat(hi.slice(0, -1));
  };
  const membranen = sel.map((v, k) => {
    const pts = [pos[k], ...punkte.filter((q) => q.ks.includes(k)).map((q) => [q.x, q.y])];
    const hl = huelle(pts); const d = hl.length > 1 ? `M${hl.map((p) => p.join(' ')).join('L')}Z` : `M${pos[k][0]} ${pos[k][1]}h0.1`;
    return s('g', { class: 'membran', style: `--farbe:${FARBEN[k]}` },
      s('path', { d, class: 'membran-flaeche' }), s('path', { d, class: 'membran-rand' }));
  });
  const phKnopf = (q) => {
    const p = phNach.get(q.p); const istFokus = q.p === fokus;
    return s('g', { class: `ph${q.ks.length > 1 ? ' geteilt' : ''}${istFokus ? ' fokus' : ''}`, transform: `translate(${q.x} ${q.y})`, tabindex: '0', role: 'button',
      'aria-label': `${p.t}: bei ${q.ks.map((k) => sel[k].t).join(', ')}`,
      onclick: () => { ctx.fluechtig.fokus = q.p; zeichne(buehne, fall, ctx); },
      onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ctx.fluechtig.fokus = q.p; zeichne(buehne, fall, ctx); } } },
      s('circle', { r: q.ks.length > 1 ? 6 : 4 }),
      (q.ks.length === sel.length && sel.length > 1) || istFokus ? s('text', { y: -10, 'text-anchor': 'middle' }, p.t) : null);
  };
  const stimmMarke = sel.map((v, k) => s('g', { class: 'stimme-marke', transform: `translate(${pos[k][0]} ${pos[k][1]})`, style: `--farbe:${FARBEN[k]}` },
    s('rect', { x: -4, y: -4, width: 8, height: 8, transform: 'rotate(45)' }),
    s('text', { y: pos[k][1] < cy ? -14 : 24, 'text-anchor': 'middle' }, v.t)));

  const fp = phNach.get(fokus); const fq = punkte.find((q) => q.p === fokus);
  const fokusInfo = fp ? h('div', { class: 'ue-fokus' },
    h('p', { class: 'ue-fokus-titel' }, fp.t), h('p', {}, fp.s), h('button', { type: 'button', class: 'ortlink', 'data-ort': String(fp.i) }, 'Ort lesen'),
    h('p', {}, fq ? `In der gewählten Runde beschrieben bei: ${fq.ks.map((k) => sel[k].t).join(', ')}.` : 'In der gewählten Runde von keiner Stimme beschrieben.'),
    h('p', { class: 'leise' }, `Insgesamt im Bestand bei ${stimmen.filter((v) => v.phaenomene.includes(fokus)).length} von ${stimmen.length} Stimmen.`)) : null;

  const liste = (titel, qs, farbe) => qs.length ? h('section', { class: 'ue-zone', style: farbe ? `--farbe:${farbe}` : '' },
    h('h3', {}, `${titel} · ${qs.length}`),
    h('ul', {}, qs.map((q) => h('li', {}, h('button', { type: 'button', class: `ue-ph${q.p === fokus ? ' an' : ''}`, onclick: () => { ctx.fluechtig.fokus = q.p; zeichne(buehne, fall, ctx); } }, phNach.get(q.p).t))))) : null;

  const notiz = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': 'Deine Unterscheidungsfrage', placeholder: 'Was würde diese Stimmen voneinander unterscheiden? …' });
  notiz.value = z.frage || '';

  buehne.replaceChildren(h('div', { class: 'ueberschneidung' },
    h('div', { class: 'ue-bild' },
      h('p', { class: 'ue-regel' }, 'Eine Überschneidung unterscheidet nicht. Was mehrere Stimmen teilen, sagt nichts über eine gemeinsame Ursache.'),
      s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'ue-svg', role: 'group', 'aria-label': 'Membranen der gewählten Stimmen' },
        membranen, ...punkte.filter((q) => q.ks.length === 1).map(phKnopf), ...punkte.filter((q) => q.ks.length > 1).map(phKnopf), stimmMarke),
      h('div', { class: 'ue-stimmen', role: 'group', 'aria-label': 'Stimmen wählen, bis zu sechs' },
        stimmen.map((v) => {
          const an = gewaehlt.includes(v.id); const k = gewaehlt.indexOf(v.id);
          return h('button', { type: 'button', class: `ue-stimme${an ? ' an' : ''}`, 'aria-pressed': String(an), style: an ? `--farbe:${FARBEN[k]}` : '',
            disabled: !an && gewaehlt.length >= 6,
            onclick: () => { ctx.handlung(an ? 'stimme-ab' : 'stimme-zu', (zz) => { const g = new Set(zz.gewaehlt || fall.start); an ? g.delete(v.id) : g.add(v.id); zz.gewaehlt = [...g]; }, v.t); zeichne(buehne, fall, ctx); } },
            v.t, h('span', { class: 'ue-zahl' }, String(v.phaenomene.length)));
        }))),
    h('div', { class: 'ue-seite' },
      fokusInfo,
      liste('In allen gewählten', alle), liste('In mehreren', mehrere),
      ...sel.map((v, k) => liste(`Nur bei ${v.t}`, nur[k], FARBEN[k])),
      h('p', { class: 'ue-quellen' }, 'Beschreibungen aus: ', sel.map((v) => v.quellen.map((q) => q.titel).join(', ')).filter(Boolean).join(' · ') || 'keine Quelle angegeben'),
      notiz,
      h('button', { type: 'button', class: 'knopf', onclick: () => { ctx.handlung('unterscheidungsfrage', (zz) => { zz.frage = notiz.value.trim(); }, notiz.value.trim()); } }, 'Frage festhalten'))));
}
