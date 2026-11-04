// Ein gemeinsamer Spieler (aus Fugenland 1 übernommen): startet nur auf Klick, lässt sich verkleinern,
// spielt bei jedem Raum- und Feldwechsel weiter und führt zurück an den Ort, von dem aus er gestartet wurde.
import { h, leeren } from './dom.mjs';

const istVideo = (m) => /\.(mp4|webm)$/i.test(m.datei || m.extern || '');
export const istAufnahme = (m) => !m.werk && /\.(m4a|mp3|mp4|webm)$/i.test(m.datei || m.extern || '');

export class Spieler {
  constructor(el, { zurueck }) { this.el = el; this.zurueck = zurueck; }

  spiele(m, rueck) {
    const src = m.datei || m.extern; const el = leeren(this.el);
    const medium = istVideo(m)
      ? h('video', { controls: true, playsinline: true, preload: 'metadata', poster: m.poster || null }, h('source', { src }), m.untertitel ? h('track', { kind: 'subtitles', srclang: 'de', src: m.untertitel, label: 'Deutsch', default: true }) : null)
      : h('audio', { controls: true, preload: 'metadata', src });
    const klein = h('button', { type: 'button', class: 'knopf mini', 'aria-label': 'Spieler verkleinern', onclick: () => { const k = el.classList.toggle('klein'); klein.textContent = k ? '+' : '–'; klein.setAttribute('aria-label', k ? 'Spieler vergrößern' : 'Spieler verkleinern'); } }, '–');
    el.append(
      h('div', { class: 'spieler-kopf' },
        h('p', {}, h('strong', {}, m.titel), h('span', { class: 'leise' }, ` ${m.urheber}${m.extern ? ' · externe Quelle' : ''}${m.ki ? ' · KI-erzeugt' : ''}`)),
        klein, h('button', { type: 'button', class: 'knopf mini', 'aria-label': 'Spieler schließen', onclick: () => { medium.pause(); el.hidden = true; leeren(el); } }, '×')),
      medium,
      m.pruefung ? h('p', { class: 'spieler-pruefung' }, m.pruefung) : null,
      rueck ? h('button', { type: 'button', class: 'knopf mini leise', onclick: () => this.zurueck(rueck) }, `Zurück zu: ${rueck.name.slice(0, 40)}`) : null);
    el.hidden = false; el.classList.remove('klein');
    medium.play().catch(() => {});
  }
}
