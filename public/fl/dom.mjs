// Kleine Bauhelfer für DOM und SVG. Text wird immer als Text gesetzt, nie als HTML.
export function h(tag, attrs = {}, ...kinder) {
  const el = document.createElement(tag);
  setze(el, attrs);
  for (const k of kinder.flat()) if (k !== null && k !== undefined && k !== false) el.append(k instanceof Node ? k : String(k));
  return el;
}
const SVGNS = 'http://www.w3.org/2000/svg';
export function s(tag, attrs = {}, ...kinder) {
  const el = document.createElementNS(SVGNS, tag);
  setze(el, attrs);
  for (const k of kinder.flat()) if (k !== null && k !== undefined && k !== false) el.append(k instanceof Node ? k : document.createTextNode(String(k)));
  return el;
}
function setze(el, attrs) {
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'text') el.textContent = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
}
export const leeren = (el) => { while (el.firstChild) el.firstChild.remove(); return el; };

// Lesbare Quellenzeile ohne technische Kennung.
export function quellZeile(q) {
  const wer = [q.autoren, q.jahr].filter(Boolean).join(', ');
  return wer ? `${q.titel} (${wer})` : q.titel;
}

// Technische Details: standardmäßig geschlossen (Grundmanifest Menschliche Oberflächen).
export function technik(eintraege) {
  return h('details', { class: 'technik' }, h('summary', {}, 'Technische Details'),
    h('dl', {}, ...Object.entries(eintraege).flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, String(v ?? ''))])));
}

export const ruhig = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.dataset.bewegung === 'ruht';

// Originaltext lesbar setzen: Markdown-Überschriften werden Überschriften, Absätze bleiben Absätze. Wortlaut unverändert.
export function absaetze(text) {
  return text.split(/\n{2,}|\n(?=#)/).map((b) => b.trim()).filter(Boolean).map((b) => {
    const m = b.match(/^#+\s*(.*)$/m);
    if (m && b.startsWith('#')) { const rest = b.replace(/^#+\s*.*\n?/, ''); return [h('h3', {}, m[1]), rest ? h('p', {}, rest) : null]; }
    return h('p', {}, b);
  }).flat();
}
