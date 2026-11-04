// Dein Urteil über eine redaktionell gebildete Fuge: trägt, begrenzt, trägt nicht, gilt hier nicht, offen halten.
// Ohne Urteil bleibt sie „ungeprüft“ – ein eigener Zustand, kein stilles „trägt“.
// Herkunft: drei Ausgänge im Codex-Vertikalschnitt, Parken und Ablehnen in der FASKA-Lernlandschaft, „trägt / begrenzt“
// in Invaria (dort nur im Arbeitsspeicher – hier erst nach Bestätigung des Dienstes „gespeichert“); Ralfs OCR-Übergabe
// vom 4. November: eine Freigabe ist an den konkreten Inhalt gebunden und bleibt nach einer Änderung erloschen,
// auch wenn der alte Inhalt zurückkehrt; ungeprüft, teilweise, fehlerhaft und „gilt nicht“ sind verschiedene Zustände.
import { h } from './dom.mjs';

export const URTEILE = [
  ['traegt', 'trägt', 'Die Raumbildung trägt für diesen Fall.'],
  ['begrenzt', 'begrenzt', 'Trägt nur teilweise oder unter Bedingungen.'],
  ['traegtnicht', 'trägt nicht', 'Die Raumbildung ist für diesen Fall falsch gelesen.'],
  ['giltnicht', 'gilt hier nicht', 'Die Frage dieser Fuge passt auf diesen Fall nicht.'],
  ['offen', 'offen halten', 'Bewusst unentschieden; die Spannung darf stehen bleiben.'],
];
export const urteilName = (w) => URTEILE.find((u) => u[0] === w)?.[1] || 'ungeprüft';

// Abdruck des Inhalts einer Fuge (ohne Lage im Feld). Ändert sich der Inhalt, ändert sich der Abdruck.
export function abdruck(fall) {
  const text = JSON.stringify(fall, (k, v) => (k === 'x' || k === 'y' || k === 'bx' || k === 'by' ? undefined : v));
  let hsh = 0x811c9dc5; for (let i = 0; i < text.length; i++) { hsh ^= text.charCodeAt(i); hsh = Math.imul(hsh, 0x01000193); }
  return (hsh >>> 0).toString(36);
}

// Ein Urteil, dessen Inhalt sich geändert hat, erlischt dauerhaft. Rückkehr des alten Inhalts belebt es nicht wieder.
export function mussErloeschen(z, abd) { return !!(z?.urteil && !z.urteil.erloschen && z.urteil.inhalt !== abd); }
export function erloeschen(zz) {
  const zeit = new Date().toISOString();
  zz.urteil.erloschen = { zeit, grund: 'Der Inhalt dieser Fuge hat sich geändert.' };
  zz.urteilsverlauf = [...(zz.urteilsverlauf || []), { was: 'erloschen', wert: zz.urteil.wert, grund: zz.urteil.erloschen.grund, zeit }];
}
export const feldWert = (z) => (!z?.urteil ? null : z.urteil.erloschen ? 'erloschen' : z.urteil.wert);

export function zeichneUrteil(el, { zustand, inhalt, handlung, werk, wiederZeichnen }) {
  const z = zustand(); const u = z.urteil; const erl = u?.erloschen;
  const grund = h('input', { class: 'feld-eingabe mini urteil-grund', 'aria-label': 'Grund für dein Urteil (freiwillig)', placeholder: 'Grund (freiwillig)' });
  const waehle = (w, l) => {
    handlung('urteil', (zz) => {
      const zeit = new Date().toISOString();
      zz.urteil = { wert: w, grund: grund.value.trim(), zeit, inhalt, aenderung: werk.aenderung + 1, sitzung: werk.sitzung };
      zz.urteilsverlauf = [...(zz.urteilsverlauf || []), { was: 'geurteilt', wert: w, grund: grund.value.trim(), zeit }];
    }, `${l}${grund.value.trim() ? `: ${grund.value.trim()}` : ''}`);
    wiederZeichnen();
  };
  el.replaceChildren(h('div', { class: `urteil u-${erl ? 'erloschen' : u?.wert || 'ungeprueft'}` },
    h('p', { class: 'urteil-kopf' }, h('strong', {}, 'Dein Urteil über diese Raumbildung'), h('span', { class: 'leise' }, ' · redaktionell vorgeschlagen, nicht fachlich geprüft')),
    h('div', { class: 'urteil-wahl', role: 'radiogroup', 'aria-label': 'Urteil' },
      URTEILE.map(([w, l, erkl]) => h('button', { type: 'button', role: 'radio', class: `urteil-knopf w-${w}`, 'aria-checked': String(!erl && u?.wert === w), title: erkl, onclick: () => waehle(w, l) }, l))),
    grund,
    h('p', { class: 'urteil-stand', 'aria-live': 'polite' }, standText(u, werk)),
    (z.urteilsverlauf || []).length > 1 ? h('ol', { class: 'urteil-verlauf', 'aria-label': 'Verlauf deiner Urteile' },
      z.urteilsverlauf.slice().reverse().slice(0, 6).map((v) => h('li', {}, `${new Date(v.zeit).toLocaleString('de-DE')} · ${v.was === 'erloschen' ? `„${urteilName(v.wert)}“ erloschen` : urteilName(v.wert)}${v.grund ? ` – ${v.grund}` : ''}`))) : null));
}

export function standText(u, werk) {
  if (!u) return 'Ungeprüft: noch kein Urteil von dir.';
  const erl = u.erloschen;
  if (erl) return `Erloschen am ${new Date(erl.zeit).toLocaleString('de-DE')}: ${erl.grund} Dein früheres Urteil „${urteilName(u.wert)}“ gilt nicht mehr; bitte neu urteilen.`;
  // Aus einer früheren Sitzung geladen heißt: vom Dienst gelesen, also gespeichert.
  const gespeichert = u.sitzung !== werk.sitzung || werk.bestaetigt >= (u.aenderung || 0);
  return `${urteilName(u.wert)}${u.grund ? ` – ${u.grund}` : ''} · ${new Date(u.zeit).toLocaleString('de-DE')} · ${gespeichert ? 'vom Dienst gespeichert' : 'wird gespeichert …'}`;
}
