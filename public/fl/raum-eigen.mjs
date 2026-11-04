// Eigene Fuge: eine Station mit Armen zu jedem Beteiligten (zwei oder mehr), mit Rolle und Richtung je Beteiligung.
// Herkunft: WiRKGEFÜGE (Station mit Armen; Arme enden bei der Nichtverbindung vor der Mitte), Grok und WiRKGEFÜGE
// (Rolle und Richtung an der Beteiligung, nicht am Ort; Gegenrichtung nie automatisch), Werkbank aus Fugenland 1
// (Aussage, Gegenrichtung, Grenze, Perspektive, Stand, Verlauf mit vorheriger Fassung).
// Weiterentwickelt: Die eigene Fuge steht als eigener Fugenort im Feld und ist von jedem ihrer Orte aus erreichbar.
import { h, s } from './dom.mjs';

export const RICHTUNG = { aus: 'geht aus', an: 'kommt an', beides: 'in beide Richtungen', offen: 'nicht angegeben' };
export const ARTEN = { offen: 'offene Frage', uebersetzung: 'Übersetzung', gegenhalt: 'Gegenhalt', schwelle: 'Schwelle', ueberschneidung: 'Überschneidung', entstehung: 'Entstehung', fehlstelle: 'Fehlstelle', nichtverbindung: 'Nicht-Verbindung' };
const GELTUNG = { persoenlich: 'persönliche Zuordnung', offen: 'offene Frage' };

// Eine gespeicherte eigene Fuge öffnet sich in der Gestalt ihrer Art; die Station bleibt der Ort zum Bearbeiten.
export function zeichne(buehne, g, ctx) {
  const gestalt = ctx.gespeichert ? ctx.gestalt(g) : null;
  const modus = ctx.modus() || (gestalt?.fall ? 'gestalt' : 'station');
  const umschalter = h('div', { class: 'eigen-modus', role: 'group', 'aria-label': 'Ansicht der eigenen Fuge' },
    h('button', { type: 'button', class: 'knopf mini', 'aria-pressed': String(modus === 'gestalt'), disabled: !gestalt?.fall, onclick: () => { ctx.setzeModus('gestalt'); zeichne(buehne, g, ctx); } }, gestalt?.name ? `Als ${gestalt.name}` : 'Gestalt'),
    h('button', { type: 'button', class: 'knopf mini', 'aria-pressed': String(modus !== 'gestalt'), onclick: () => { ctx.setzeModus('station'); zeichne(buehne, g, ctx); } }, 'Station und Angaben'),
    gestalt && !gestalt.fall ? h('span', { class: 'leise' }, gestalt.fehlt) : !ctx.gespeichert ? h('span', { class: 'leise' }, 'Nach dem Speichern öffnet sich die Fuge in der Gestalt ihrer Art.') : null);
  const innen = h('div', { class: 'eigen-innen' });
  // Stand der persönlichen Zuordnung: erloschen bleibt sichtbar, bis du neu bestätigst.
  const stand = (g.endeGeaendert || g.erloschen) && ctx.gespeichert ? h('div', { class: 'eigen-stand erloschen', role: 'status' },
    g.endeGeaendert ? h('p', {}, h('strong', {}, 'Ende hat sich geändert, prüfen: '), `Der Wortlaut von ${g.endeGeaendert.orte.map((n) => `„${n}“`).join(' und ')} ist nicht mehr der, gegen den du diese Fuge gesetzt hast.`) : null,
    g.erloschen ? h('p', {}, h('strong', {}, 'Persönliche Zuordnung erloschen, '), `${g.erloschen.grund} (${new Date(g.erloschen.zeit).toLocaleString('de-DE')}).`) : null,
    h('button', { type: 'button', class: 'knopf mini', onclick: () => ctx.bestaetige() }, 'Neu bestätigen')) : null;
  buehne.replaceChildren(h('div', { class: 'eigen-rahmen' }, umschalter, stand || '', innen));
  if (modus === 'gestalt' && gestalt?.fall) { gestalt.modul.zeichne(innen, gestalt.fall, gestalt.ctx); return; }
  station(innen, g, ctx);
}

function station(buehne, g, ctx) {
  const n = g.teile.length; const W = 560, C = 280, R = 190; const nicht = g.art === 'nichtverbindung';
  const pos = g.teile.map((_, k) => { const a = -Math.PI / 2 + (k / Math.max(n, 1)) * Math.PI * 2; return [C + Math.cos(a) * R, C + Math.sin(a) * R]; });
  const arme = g.teile.map((t, k) => {
    const [x, y] = pos[k]; const ende = nicht ? 0.45 : 1; const ex = x + (C - x) * ende * 0.86, ey = y + (C - y) * ende * 0.86;
    const pfeil = (t.richtung === 'aus' || t.richtung === 'beides') ? s('circle', { cx: ex, cy: ey, r: 5, class: 'arm-aus' }) : null;
    const ankunft = (t.richtung === 'an' || t.richtung === 'beides') ? s('path', { d: `M${x + (C - x) * 0.12} ${y + (C - y) * 0.12} l0 0`, class: 'arm-an' }) : null;
    return s('g', { class: `arm r-${t.richtung || 'offen'}` }, s('line', { x1: x, y1: y, x2: ex, y2: ey }), pfeil, ankunft,
      s('circle', { cx: x, cy: y, r: 9, class: 'platz' }),
      s('text', { x, y: y + (y < C ? -16 : 26), 'text-anchor': 'middle' }, t.name.length > 28 ? t.name.slice(0, 26) + '…' : t.name),
      t.rolle ? s('text', { x, y: y + (y < C ? -32 : 42), 'text-anchor': 'middle', class: 'rolle-text' }, t.rolle) : null);
  });
  const name = h('input', { class: 'feld-eingabe', value: g.titel || '', 'aria-label': 'Name der Fuge', placeholder: 'Name der Fuge' });
  const feld = (k, l, ph) => { const el = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': l, placeholder: ph }); el.value = g[k] || ''; el.dataset.k = k; return h('label', { class: 'eigen-feld' }, h('span', {}, l), el); };
  const art = h('select', { 'aria-label': 'Art der Fuge', onchange: () => ctx.entwurf(lese()) }, Object.entries(ARTEN).map(([k, v]) => h('option', { value: k, selected: g.art === k }, v)));
  const riegel = h('textarea', { class: 'feld-eingabe', rows: '3', 'aria-label': 'Riegel der eigenen Schwelle', placeholder: 'Eine Bedingung je Zeile – jede wird ein Riegel' });
  riegel.value = (g.riegel || []).join('\n');
  const aenderungsGrund = h('input', { class: 'feld-eingabe', 'aria-label': 'Grund der Änderung', placeholder: 'Grund der Änderung (freiwillig)' });
  const gespeicherteTeile = ctx.gespeichert ? ctx.gespeicherteTeile() : [];
  const teileGeaendert = ctx.gespeichert && (gespeicherteTeile.length !== g.teile.length || g.teile.some((t) => !gespeicherteTeile.includes(t.ortId)));
  const lese = () => { const neu = structuredClone(g); neu.titel = name.value.trim(); neu.art = art.value;
    buehne.querySelectorAll('[data-k]').forEach((el) => { neu[el.dataset.k] = el.value.trim(); });
    buehne.querySelectorAll('[data-rolle]').forEach((el) => { neu.teile[Number(el.dataset.rolle)].rolle = el.value.trim(); });
    buehne.querySelectorAll('[data-richtung]').forEach((el) => { neu.teile[Number(el.dataset.richtung)].richtung = el.value; });
    if (neu.art === 'schwelle' || g.riegel) neu.riegel = riegel.value.split('\n').map((x) => x.trim()).filter(Boolean);
    return neu; };

  buehne.replaceChildren(h('div', { class: 'eigen' },
    h('div', { class: 'station-bild' },
      s('svg', { viewBox: `0 0 ${W} ${W}`, class: 'station-svg', role: 'img', 'aria-label': `Station mit ${n} Beteiligten${nicht ? ', ausdrücklich nicht verbunden' : ''}` },
        s('circle', { cx: C, cy: C, r: 34, class: `station-mitte${nicht ? ' nicht' : ''}` }), arme,
        nicht ? s('path', { d: `M${C - 14} ${C - 14}L${C + 14} ${C + 14}M${C + 14} ${C - 14}L${C - 14} ${C + 14}`, class: 'station-kreuz' }) : null),
      h('p', { class: 'leise' }, nicht ? 'Nicht-Verbindung: Die Arme enden vor der Mitte. Du hältst fest, dass hier ausdrücklich nichts verbindet.' : 'Deine Fuge, in blauer Tinte. Sie ist deine Zuordnung, kein Befund des Bestands.'),
      h('ol', { class: 'plaetze' }, g.teile.map((t, k) => h('li', {},
        h('button', { type: 'button', class: 'liste-eintrag', onclick: () => ctx.oeffneOrt(t.ort) }, t.name),
        h('input', { class: 'feld-eingabe mini', value: t.rolle || '', 'data-rolle': String(k), 'aria-label': `Rolle von ${t.name}`, placeholder: 'Rolle' }),
        h('select', { 'data-richtung': String(k), 'aria-label': `Richtung von ${t.name}` }, Object.entries(RICHTUNG).map(([v, l]) => h('option', { value: v, selected: (t.richtung || 'offen') === v }, l))),
        h('button', { type: 'button', class: 'knopf mini leise', onclick: () => { const neu = lese(); neu.teile.splice(k, 1); ctx.entwurf(neu); } }, 'lösen')))),
      ctx.hand().filter((i) => !g.teile.some((t) => t.ort === i)).length ? h('button', { type: 'button', class: 'knopf leise', onclick: () => { const neu = lese(); for (const i of ctx.hand()) if (!neu.teile.some((t) => t.ort === i)) neu.teile.push(ctx.teil(i)); ctx.entwurf(neu); } }, 'Orte aus der Hand dazunehmen') : null),
    h('div', { class: 'eigen-seite' },
      name, h('label', { class: 'eigen-feld' }, h('span', {}, 'Art'), art),
      feld('aussage', 'Aussage', 'Was verbindet sich hier – in deinen Worten?'),
      g.art === 'schwelle' ? h('label', { class: 'eigen-feld' }, h('span', {}, 'Riegel (Bedingungen der Schwelle)'), riegel) : null,
      feld('gegenaussage', 'Gegenrichtung', 'Gilt es auch zurück? Mit eigenem Grund – oder leer lassen.'),
      feld('grenze', 'Grenze', 'Wo hört diese Verbindung auf zu gelten?'),
      feld('perspektive', 'Perspektive', 'Aus wessen Sicht?'),
      h('fieldset', { class: 'einordnung' }, h('legend', {}, 'Stand'), Object.entries(GELTUNG).map(([k, l]) => h('label', { class: 'einordnung-wahl' }, h('input', { type: 'radio', name: 'geltung', value: k, checked: g.geltung === k, 'data-k': 'geltung' }), h('span', {}, l)))),
      teileGeaendert && g.geltung === 'persoenlich' && !g.erloschen ? h('p', { class: 'eigen-hinweis' }, 'Du hast Beteiligte gelöst oder hinzugenommen. Beim Speichern erlischt die persönliche Zuordnung sichtbar; du kannst sie danach neu bestätigen.') : null,
      ctx.gespeichert ? aenderungsGrund : null,
      h('div', { class: 'reihe' },
        h('button', { type: 'button', class: 'knopf', disabled: g.teile.length < 2, onclick: () => { const neu = lese(); neu.geltung = buehne.querySelector('input[name=geltung]:checked')?.value || 'persoenlich'; ctx.speichere(neu, aenderungsGrund.value.trim()); } }, g.teile.length < 2 ? 'Mindestens zwei Beteiligte' : 'Fuge speichern'),
        ctx.gespeichert ? h('button', { type: 'button', class: 'knopf leise', onclick: () => ctx.loesche(g.id) }, 'Fuge löschen') : null),
      g.verlauf?.length ? h('section', { class: 'eigen-verlauf' }, h('h3', {}, 'Verlauf'), h('ol', {}, g.verlauf.slice().reverse().map((v) => h('li', {},
        h('strong', {}, `${v.fassung ? `Fassung ${v.fassung} · ` : ''}${v.was}`), ` · ${new Date(v.zeit).toLocaleString('de-DE')}`,
        v.grund ? h('span', { class: 'verlauf-grund' }, `Grund: ${v.grund}`) : null,
        v.erloschen ? h('span', { class: 'verlauf-erloschen' }, `Zuordnung erloschen, ${v.erloschen}`) : null,
        v.vorher && v.nachher ? h('span', { class: 'verlauf-vn' }, `vorher: ${v.vorher.teile.join(', ')} (${v.vorher.art}) → nachher: ${v.nachher.teile.join(', ')} (${v.nachher.art})`) : null)))) : null)));
  // Radio-Eingaben tragen data-k, dürfen aber nur den gewählten Wert liefern.
  buehne.querySelectorAll('input[name=geltung]').forEach((el) => el.removeAttribute('data-k'));
}
