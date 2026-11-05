/* Zugangsprofil – app-unabhängig, nur im Speicher. Beschreibung: ZUGANGSPROFIL.md
   window.ZUGANGSPROFIL ist ein schlichtes Objekt mit sechs Feldern. Es ändert nur die Form,
   in der ein Inhalt erscheint, nie den Inhalt selbst. Nichts wird gespeichert oder gesendet.
   Zum Ändern: ZUGANGSPROFIL.setze({ niveau: 'einfach' }) – Beobachter: ZUGANGSPROFIL.beobachte(fn). */
(() => {
  'use strict';
  const WERTE = {
    umfang: ['kern', 'mehr', 'ganz'],
    niveau: ['einfach', 'alltag', 'original'],
    blick: ['innen', 'aussen', 'spielraum'],
    reiz: ['ruhig', 'lebendig'],
    ton: [false, true],
    schrift: ['normal', 'gross'],
  };
  let still = false;
  try { still = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (_) { still = false; }
  const profil = { umfang: 'kern', niveau: 'original', blick: 'innen', reiz: still ? 'ruhig' : 'lebendig', ton: false, schrift: 'normal' };
  const beobachter = new Set();
  Object.defineProperty(profil, 'werte', { value: WERTE, enumerable: false });
  Object.defineProperty(profil, 'setze', {
    enumerable: false,
    value(teil) {
      const vorher = { ...profil };
      let anders = false;
      for (const [k, v] of Object.entries(teil || {})) {
        if (!WERTE[k] || !WERTE[k].includes(v) || profil[k] === v) continue;
        profil[k] = v;
        anders = true;
      }
      if (anders) for (const fn of beobachter) { try { fn({ ...profil }, vorher); } catch (e) { setTimeout(() => { throw e; }); } }
      return profil;
    },
  });
  Object.defineProperty(profil, 'beobachte', {
    enumerable: false,
    value(fn) { beobachter.add(fn); return () => beobachter.delete(fn); },
  });
  window.ZUGANGSPROFIL = profil;
})();
