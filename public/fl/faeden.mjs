// Offene Fäden: Gegenstimmen, Lückenfragen und Unterscheidungsfragen aus allen Räumen an einer Stelle,
// und im Ortsraum jedes Beteiligten. Schließen mit Notiz und Wiederöffnen mit Grund bleiben im Verlauf stehen.
// Herkunft: FASKA-Lernspuren (Faden schließen mit Notiz, wieder öffnen; dort verschwinden Abschluss und Notiz beim
// Wiederöffnen und die Notiz läuft über einen Systemdialog – hier bleibt beides sichtbar und die Eingabe liegt im Faden),
// Stoffgraph-Land („Daneben noch offen“), faska-varianten („Wiederholung allein belegt keinen Fortschritt“).
import { h } from './dom.mjs';

const TYP = { gegenstimme: 'Gegenstimme', lueckenfrage: 'Lückenfrage', unterscheidung: 'Unterscheidungsfrage' };

// Aus den Raumzuständen die Fäden lesen. Ein Faden lebt im Zustand seines Raums; nichts wird doppelt gespeichert.
export function sammle({ faelle, raeume, zustand, beteiligteDesFadens }) {
  const out = [];
  for (const [art, liste] of Object.entries(faelle)) liste.forEach((fall, i) => {
    const m = raeume[art]; const key = m.schluessel(fall); const z = zustand(key); if (!z) return;
    const roh = [];
    if (art === 'gegenhalt') for (const e of z.einwaende || []) roh.push({ fid: `gegenstimme:${e.zeit}`, typ: 'gegenstimme', text: e.text, zeit: e.zeit });
    if (art === 'fehlstelle' && z.frage) roh.push({ fid: 'lueckenfrage', typ: 'lueckenfrage', text: z.frage, zeit: z.geaendert });
    if (art === 'ueberschneidung' && z.frage) roh.push({ fid: 'unterscheidung', typ: 'unterscheidung', text: z.frage, zeit: z.geaendert });
    for (const r of roh) {
      const f = z.faeden?.[r.fid] || {};
      out.push({ ...r, key, art, i, fall, raumTitel: m.titel(fall), raumName: m.meta.name, orte: beteiligteDesFadens(art, fall, z), status: f.status || 'offen', verlauf: f.verlauf || [] });
    }
  });
  return out.sort((a, b) => (a.status === b.status ? String(b.zeit).localeCompare(String(a.zeit)) : a.status === 'offen' ? -1 : 1));
}

export function fadenKarte(f, { karte, oeffne, oeffneOrt, aendere, ohneOrte = false }) {
  const eingabe = h('input', { class: 'feld-eingabe mini', 'aria-label': f.status === 'offen' ? 'Notiz zum Schließen' : 'Grund zum Wiederöffnen', placeholder: f.status === 'offen' ? 'Wie hat sich der Faden geklärt? (Notiz)' : 'Warum öffnest du ihn wieder? (Grund)' });
  const schalte = () => {
    const text = eingabe.value.trim(); if (!text) { eingabe.focus(); eingabe.setAttribute('aria-invalid', 'true'); return; }
    const zeit = new Date().toISOString(); const neu = f.status === 'offen' ? 'geschlossen' : 'offen';
    aendere(f, (zz) => { zz.faeden = { ...(zz.faeden || {}) }; const alt = zz.faeden[f.fid] || { verlauf: [] };
      zz.faeden[f.fid] = { status: neu, verlauf: [...alt.verlauf, neu === 'geschlossen' ? { was: 'geschlossen', notiz: text, zeit } : { was: 'wieder geöffnet', grund: text, zeit }] }; },
    `${TYP[f.typ]} ${neu === 'geschlossen' ? 'geschlossen' : 'wieder geöffnet'}: ${text}`);
  };
  return h('li', { class: `faden ${f.status}` },
    h('p', { class: 'faden-kopf' }, h('strong', {}, TYP[f.typ]), ` · ${f.status === 'offen' ? 'offen' : 'geschlossen'} · ${f.raumName}: ${f.raumTitel}`),
    h('p', { class: 'faden-text' }, f.text),
    ohneOrte ? null : h('p', { class: 'faden-orte' }, 'Beteiligt: ', f.orte.flatMap((i, k) => [k ? ', ' : '', h('button', { type: 'button', class: 'liste-eintrag', onclick: () => oeffneOrt(i) }, karte.orte[i].t)])),
    f.verlauf.length ? h('ol', { class: 'faden-verlauf', 'aria-label': 'Verlauf des Fadens' }, f.verlauf.map((v) => h('li', {}, `${new Date(v.zeit).toLocaleString('de-DE')} · ${v.was}: ${v.notiz || v.grund}`))) : null,
    h('div', { class: 'reihe' },
      h('button', { type: 'button', class: 'knopf mini', onclick: () => oeffne(f.art, f.i) }, 'Zum Raum'),
      eingabe, h('button', { type: 'button', class: 'knopf mini leise', onclick: schalte }, f.status === 'offen' ? 'Mit Notiz schließen' : 'Mit Grund wieder öffnen')));
}

export function zeichneSammlung(el, faeden, ctx) {
  const offen = faeden.filter((f) => f.status === 'offen'); const zu = faeden.filter((f) => f.status !== 'offen');
  el.replaceChildren(h('h2', { tabindex: '-1' }, 'Offene Fäden'),
    h('p', { class: 'leise' }, 'Gegenstimmen, Lückenfragen und Unterscheidungsfragen aus allen Räumen. Ein geschlossener Faden behält seine Notiz; wiedergeöffnet behält er beides.'),
    offen.length ? h('ul', { class: 'faeden' }, offen.map((f) => fadenKarte(f, ctx))) : h('p', {}, 'Gerade ist kein Faden offen.'),
    zu.length ? h('section', {}, h('h3', {}, 'Geschlossene Fäden'), h('ul', { class: 'faeden' }, zu.map((f) => fadenKarte(f, ctx)))) : '');
}
