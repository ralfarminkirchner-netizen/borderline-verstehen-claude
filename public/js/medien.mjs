// Ein gemeinsamer Spieler: immer nur ein hörbares Medium, minimierbar, spielt bei Navigation weiter.
import { esc } from './ansichten.mjs';

export class Spieler {
  constructor(el, A, { geh }) { this.el = el; this.A = A; this.geh = geh; this.medium = null; }

  spiele(m, ort) {
    this.medium = m; this.ort = ort; this.rueck = { ...this.A.zustand };
    const rueckName = this.rueck.ebene === 'gebiet' ? this.A.daten.regionen[this.rueck.gebiet].name : this.A.daten.orte[ort].t;
    const video = /\.(mp4|webm)$/i.test(m.datei || m.extern || '');
    const src = m.datei || m.extern;
    this.el.hidden = false; this.el.classList.remove('klein');
    this.el.innerHTML = `<div class="spieler-kopf"><b>${esc(m.titel)}<small>${esc(m.urheber)}${m.extern ? ' · externe Quelle' : ''}</small></b>
        <span><button class="knopf klein" type="button" data-t="klein" aria-label="Spieler verkleinern">–</button>
        <button class="knopf klein" type="button" data-t="zu" aria-label="Spieler schließen">×</button></span></div>
      ${video ? `<video controls playsinline preload="metadata" ${m.poster ? `poster="${esc(m.poster)}"` : ''}><source src="${esc(src)}">${m.untertitel ? `<track kind="subtitles" srclang="de" src="${esc(m.untertitel)}" label="Deutsch" default>` : ''}</video>` : `<audio controls preload="metadata" src="${esc(src)}"></audio>`}
      ${m.pruefung ? `<p class="klein" style="margin:6px 0 0">${esc(m.pruefung)}</p>` : ''}
      <button class="knopf klein zurueck-ort" type="button" data-t="ort" style="margin-top:8px">Zurück zu: ${esc(rueckName.slice(0, 40))}</button>`;
    const media = this.el.querySelector('video,audio');
    media.play().catch(() => {});
    this.el.querySelector('[data-t=klein]').onclick = (e) => { const k = this.el.classList.toggle('klein'); e.currentTarget.textContent = k ? '+' : '–'; e.currentTarget.setAttribute('aria-label', k ? 'Spieler vergrößern' : 'Spieler verkleinern'); };
    this.el.querySelector('[data-t=zu]').onclick = () => { media.pause(); this.el.hidden = true; this.el.innerHTML = ''; };
    this.el.querySelector('[data-t=ort]').onclick = () => this.geh(this.rueck);
  }
}
