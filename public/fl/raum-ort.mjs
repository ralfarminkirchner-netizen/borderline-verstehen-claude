// Ortsraum: der vollständige Wortlaut eines der 1226 Orte, mit Herkunft und Quellen – und mit allem, was an ihm hängt:
// die Fugenräume, an denen er beteiligt ist, Werke von Walter Andreas Kirchner, Aufnahmen, eigene Notizen, Nachbarn.
// Aus Fugenland 1 übernommen (Leseraum, Werk am Ort, Spieler, Notiz am Ort), hier um die Fugenräume des Orts ergänzt.
import { h, absaetze, quellZeile, technik } from './dom.mjs';

export function zeichne(buehne, i, ctx) {
  const o = ctx.karte.orte[i]; const t = ctx.texte.orte[i]; const g = ctx.karte.regionen[o.r];
  const quellen = (t.quellen || []).map((q) => ({ schluessel: q, ...(ctx.texte.quellen[q] || { titel: 'Quelle ohne Titel im Bestand' }) }));
  const fugen = ctx.fugenAmOrt(i);
  const werke = ctx.medien.filter((m) => m.werk && m.eintraege.includes(i));
  const aufnahmen = ctx.aufnahmenFuerGebiet(g.name);
  const notizen = ctx.notizen(t.id);
  const nachbarn = ctx.karte.fugen.filter((f) => (f.a === i || f.b === i) && f.a !== f.b);
  const inHand = ctx.hand().includes(i);

  const notiz = h('textarea', { class: 'feld-eingabe', rows: '2', 'aria-label': `Notiz am Ort ${o.t}`, placeholder: 'Notiz an diesem Ort …' });

  buehne.replaceChildren(h('div', { class: 'ortsraum' },
    h('article', { class: 'ort-text' },
      h('p', { class: 'ort-gebiet' }, `${g.name} · ${ctx.artName(o.k)}`),
      h('div', { class: 'ort-wortlaut' }, absaetze(t.body || o.s)),
      h('p', { class: 'ort-herkunft' }, `Herkunft: ${t.herkunft?.titel || g.name}. Wortlaut unverändert aus dem kanonischen Atlas.`),
      quellen.length ? h('section', { class: 'ort-quellen' }, h('h3', {}, `Quellen (${quellen.length})`),
        h('ol', {}, quellen.map((q) => h('li', {}, /^https?:/.test(q.url || '') ? h('a', { href: q.url, target: '_blank', rel: 'noopener noreferrer' }, quellZeile(q)) : quellZeile(q))))) : h('p', { class: 'leise' }, 'Keine Quelle an diesem Ort im Bestand.'),
      technik({ Ortskennung: t.id, Herkunftspfad: t.herkunft?.pfad || '–', Stand: t.herkunft?.commit || '–' })),
    h('aside', { class: 'ort-seite' },
      h('section', { class: 'ort-fugen' }, h('h3', {}, fugen.length ? `In ${fugen.length} Fugenräumen beteiligt` : 'In keinem Fugenraum beteiligt'),
        fugen.length ? h('ul', {}, fugen.map((f) => h('li', {}, h('button', { type: 'button', class: 'ort-fuge', style: `--farbe:${ctx.farben[f.art]}`, onclick: () => ctx.oeffne(f.art, f.i) },
          h('span', { class: `glyph-css ${f.art}`, 'aria-hidden': 'true' }), h('span', {}, h('strong', {}, f.artName), h('span', {}, f.titel)))))) : h('p', { class: 'leise' }, 'Die Kanten dieses Orts bilden keinen eigenen Fugenraum. Du kannst mit ihm eine eigene Fuge bilden.')),
      h('div', { class: 'reihe' },
        h('button', { type: 'button', class: 'knopf', 'aria-pressed': String(inHand), onclick: () => { ctx.nimm(i); zeichne(buehne, i, ctx); } }, inHand ? 'In der Hand' : 'In die Hand nehmen'),
        h('button', { type: 'button', class: 'knopf leise', onclick: () => ctx.neueFuge([i]) }, 'Eigene Fuge beginnen')),
      ...werke.map((w) => h('figure', { class: 'werk' },
        h('img', { src: w.datei, alt: w.alt || '', loading: 'lazy' }),
        h('figcaption', {}, w.herkunft, ' ', /^https?:/.test(w.quelle || '') ? h('a', { href: w.quelle, target: '_blank', rel: 'noopener noreferrer' }, 'Werk auf der Künstlerseite') : null,
          h('span', { class: 'werk-hinweis' }, 'Bildzuordnung als Anregung; keine Deutung des Werks.')))),
      aufnahmen.length ? h('section', { class: 'ort-medien' }, h('h3', {}, `Aufnahmen zum Gebiet ${g.name}`),
        aufnahmen.map((m) => h('button', { type: 'button', class: 'medium-zug', onclick: () => ctx.spiele(m, { ort: i, name: o.t }) },
          h('span', { class: 'play', 'aria-hidden': 'true' }, '▶'), h('span', {}, h('strong', {}, m.titel), h('small', {}, `${/\.(mp4|webm)$/i.test(m.datei || m.extern) ? 'Video' : 'Audio'} · ${m.urheber}${m.ki ? ' · KI-erzeugt' : ''}`)))),
        h('p', { class: 'leise' }, 'Zuordnung redaktionell über das Thema der Aufnahme; im Bestand hängen diese Aufnahmen an keinem einzelnen Ort.')) : null,
      h('section', { class: 'ort-notizen' }, h('h3', {}, 'Deine Notizen an diesem Ort'),
        notizen.length ? h('ul', {}, notizen.map((n) => h('li', {}, h('span', {}, n.text), h('span', { class: 'leise' }, ` · ${new Date(n.zeit).toLocaleDateString('de-DE')}`),
          h('button', { type: 'button', class: 'knopf mini leise', onclick: () => { ctx.notizWeg(n.id); zeichne(buehne, i, ctx); } }, 'entfernen')))) : null,
        notiz, h('button', { type: 'button', class: 'knopf leise', onclick: () => { const tx = notiz.value.trim(); if (!tx) return notiz.focus(); ctx.notizNeu(t.id, i, tx); zeichne(buehne, i, ctx); } }, 'Notiz anheften')),
      h('section', { class: 'ort-nachbarn' }, h('h3', {}, `Kanten im Bestand (${nachbarn.length})`),
        h('ul', {}, nachbarn.slice(0, 24).map((f) => { const j = f.a === i ? f.b : f.a; return h('li', {}, h('button', { type: 'button', class: 'liste-eintrag', onclick: () => ctx.oeffneOrt(j) }, `${f.label} · ${ctx.karte.orte[j].t}`)); })),
        nachbarn.length > 24 ? h('p', { class: 'leise' }, `… und ${nachbarn.length - 24} weitere. Über die Suche ist jeder Ort erreichbar.`) : null))));
}
