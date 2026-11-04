// Herkunft und Geltung: ein Bohrkern unter jeder Fuge. Schichten von unten nach oben:
// Original → Ableitung → Raumbildung → deine Revision. Dazu Schlussproben, die durch alle Schichten getrieben werden.
// Herkunft: W3C PROV (Entität, Aktivität, Akteur; abgeleitet aus, erzeugt durch, zugeschrieben an),
// Grok Fugenfassung „Proben“ (trägt, scheitert, trifft nicht), ChatGPT FUGE „Reichweite“ (öffnet, beweist nicht,
// endet, Rückweg), DAS DAZWISCHEN „Endpunktbeleg bleibt am Widerlager“. Weiterentwickelt: Die Probe wird aus den
// tatsächlichen Feldern der Fuge ausgewertet, nicht als feste Antwort angezeigt.
import { h, technik } from './dom.mjs';

const MODELL = new Set(['reguliert', 'behandlt', 'zielzustand', 'erregung']);

function urteil(probe, art, fall, kanten) {
  switch (probe.id) {
    case 'pfad': return ['scheitert', 'Auch wenn sich im Feld ein Weg über mehrere Fugen gehen lässt: Jede Fuge trägt nur ihre eigene Aussage.'];
    case 'ueberschneidung': return art === 'ueberschneidung'
      ? ['scheitert', 'Die geteilten Phänomene stehen in mehreren Beschreibungen. Daraus folgt keine gemeinsame Ursache und keine Zuordnung einer Person.']
      : ['trifft nicht', 'In diesem Raum wird keine Überschneidung behauptet.'];
    case 'wort': return art === 'uebersetzung'
      ? ['scheitert', `${fall.wortabgleich.gemeinsam.length} gleiche Wortstämme verbinden die Fassungen auf der Sprachebene. Ob sie dasselbe tragen, entscheidet das Einsortieren, nicht der Abgleich.`]
      : ['trifft nicht', 'Hier werden keine zwei Wortlaute verglichen.'];
    case 'endpunkt': {
      if (!kanten.length) return ['trifft nicht', 'Dieser Raum stützt sich nicht auf einzelne Verbindungen.'];
      const mit = kanten.filter((k) => k.quellen.length).length;
      return mit === kanten.length
        ? ['trägt teilweise', `Alle ${kanten.length} Verbindungen nennen im Bestand eine eigene Quelle. Belegt im Sinn einer Prüfung ist die Verbindung damit noch nicht.`]
        : ['scheitert', `${kanten.length - mit} von ${kanten.length} Verbindungen haben keine eigene Quelle. Belegte Orte machen ihre Verbindung nicht belegt.`];
    }
    case 'modell': {
      const m = kanten.filter((k) => MODELL.has(k.typ));
      return m.length ? ['scheitert', `${m.length} Verbindung${m.length > 1 ? 'en sind' : ' ist'} Modellkante${m.length > 1 ? 'n' : ''} (${[...new Set(m.map((k) => k.label))].join(', ')}). Der Bestand sagt selbst: keine individuell bewiesenen Ursachen.`]
        : ['trifft nicht', 'Keine Modellkante in diesem Raum.'];
    }
    default: return ['offen', ''];
  }
}

export function zeichneSchicht(ziel, { art, meta, fall, kanten, zustand, proben, ereignisZahl, ctx }) {
  const gewaehlt = ctx.fluechtig.kante ?? 0;
  const k = kanten[gewaehlt];
  const probe = ctx.fluechtig.probe ? proben.find((p) => p.id === ctx.fluechtig.probe) : null;
  const [wort, grund] = probe ? urteil(probe, art, fall, kanten) : [];

  const schichten = [
    { name: 'Deine Revision', wer: 'du', was: zustand.geaendert ? `${ereignisZahl} Handlung${ereignisZahl === 1 ? '' : 'en'} in diesem Raum, zuletzt ${new Date(zustand.geaendert).toLocaleString('de-DE')}.` : 'Noch nichts von dir in diesem Raum.', cls: 'revision' },
    { name: 'Raumbildung', wer: 'diese Fassung (redaktionell)', was: `${meta.name}: gebildet aus ${fall.gebildetAus || 'dem Bestand'}. Lesart, keine fachliche Prüfung.`, cls: 'raumbildung' },
    { name: 'Ableitung', wer: 'Lesebestand dieser Fassung', was: k ? `Art gelesen aus ${k.grund || 'dem Originaltyp'}.` : 'Ortstexte unverändert aus dem kanonischen Atlas übernommen.', cls: 'ableitung' },
    { name: 'Original', wer: k ? k.herkunft : 'kanonischer Atlasbestand', was: k ? `„${k.label}“${k.detail ? ` – ${k.detail}` : ''}${k.grenze ? ` Grenze: ${k.grenze}` : ' Grenze im Bestand nicht angegeben.'}` : 'Ortsbeschreibungen der beteiligten Gebiete.', cls: 'original', quellen: k?.quellen || [] },
  ];

  ziel.replaceChildren(h('div', { class: 'herkunft' },
    h('div', { class: 'herkunft-kopf' },
      h('h2', {}, 'Herkunft und Geltung'),
      kanten.length > 1 ? h('label', { class: 'herkunft-wahl' }, 'Verbindung ',
        h('select', { onchange: (e) => { ctx.fluechtig.kante = Number(e.target.value); ctx.neuZeichnen(); } },
          kanten.map((x, i) => h('option', { value: String(i), selected: i === gewaehlt }, `${x.label}${x.gegenueber ? ` · ${x.gegenueber.t}` : ''}`)))) : null),
    h('div', { class: 'bohrkern-zeile' },
      h('ol', { class: `bohrkern${probe ? ' angebohrt' : ''}`, 'aria-label': 'Schichten von der Revision bis zum Original' },
        schichten.map((sch) => h('li', { class: `schicht ${sch.cls}` },
          h('p', { class: 'schicht-name' }, sch.name, h('span', { class: 'schicht-wer' }, ` · ${sch.wer}`)),
          h('p', { class: 'schicht-was' }, sch.was),
          sch.quellen?.length ? h('ul', { class: 'schicht-quellen' }, sch.quellen.map((q) => h('li', {}, q.url ? h('a', { href: q.url, target: '_blank', rel: 'noopener' }, q.titel) : q.titel))) : null)),
        probe ? h('li', { class: `stempel ${wort.replace(/\s/g, '-')}`, 'aria-live': 'polite' }, h('strong', {}, wort), h('span', {}, grund), h('span', { class: 'leise' }, `Regel: ${probe.regel} Herkunft: ${probe.herkunft}.`)) : null),
      h('div', { class: 'proben' },
        h('p', { class: 'proben-kopf' }, 'Schlussprobe ansetzen'),
        proben.map((p) => h('button', { type: 'button', class: `probe${probe?.id === p.id ? ' an' : ''}`, 'aria-pressed': String(probe?.id === p.id),
          onclick: () => { ctx.fluechtig.probe = probe?.id === p.id ? null : p.id; if (ctx.fluechtig.probe) ctx.handlung('probe', () => {}, p.satz); ctx.neuZeichnen(); } }, p.satz)),
        h('dl', { class: 'reichweite' },
          h('dt', {}, 'öffnet'), h('dd', {}, meta.kurz),
          h('dt', {}, 'beweist nicht'), h('dd', {}, 'Ursache, Diagnose, Wirksamkeit'),
          h('dt', {}, 'endet'), h('dd', {}, kanten.find((x) => x.grenze)?.grenze || 'Grenze im Bestand nicht angegeben'),
          h('dt', {}, 'Rückweg'), h('dd', {}, 'Originalwortlaut und Quellen in den unteren Schichten')))),
    technik({ 'PROV-Lesart': 'Original = Entität (prov:Entity); Ableitung und Raumbildung = Aktivitäten (prov:Activity, prov:wasDerivedFrom); Akteure: Bestand, Fassung, du (prov:wasAttributedTo)', Raumschlüssel: ctx.key, Kantennummer: k?.n ?? '–', Originaltyp: k?.typ || '–', Quellenschlüssel: (k?.quellen || []).map((q) => q.schluessel).join(', ') || '–' })));
}
