#!/usr/bin/env node
// Baut daten.js für die Probe „Schloss und Schlüssel“ aus dem Lesebestand.
// Liest nur: ../../data-readonly/karte.json, ../../data-readonly/texte.json und
// ../../data-readonly/fugenraeume.json (nur die Fehlstellen, die Orte dieses Felds berühren)
// Schreibt nur: ./daten.js (neben diesem Skript)
//
// Aufruf: node baue-daten.mjs
//
// Was hier entschieden wird (und sonst nichts):
//  - welche echten Orte Schloss und Schlüsselbund bilden (Titel + Gebiet, siehe AUSWAHL)
//  - welches Feld um das Schloss liegt (Regel siehe „Das Feld um das Schloss“) und wo seine Orte stehen
//  - welche Bestandsfugen zwischen Schloss und Schlüssel liegen (beide Richtungen)
//  - welche Lesarten die beiden Ortstexte selbst anbieten: nur Sätze, in denen der eine Ort
//    den anderen nennt. Sätze dritter Orte zählen nicht – ein Satz, der zwei Orte je für sich
//    neben einen dritten stellt, behauptet keine Verbindung zwischen ihnen.
//    Trägt ein Satz zwei Lesarten („das Gegenteil am Start — Nähe, nicht Identität“), bekommt
//    jede Lesart mit, was derselbe Satz sonst noch sagt (auchImSatz). Die Oberfläche zeigt das.
// Die Zähne selbst werden im Browser (schloss.js) aus diesen Feldern abgeleitet.

import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = dirname(fileURLToPath(import.meta.url));
const BESTAND = join(HIER, '..', '..', 'data-readonly');
const KARTE = join(BESTAND, 'karte.json');
const TEXTE = join(BESTAND, 'texte.json');
const RAEUME = join(BESTAND, 'fugenraeume.json');
const ZIEL = join(HIER, 'daten.js');

const SCHLOSS = { titel: 'Die Angst vor Verlust ist groß', gebiet: 'Beziehungen & Borderline' };
const AUSWAHL = [
  // erster Eintrag = Startfall: Bedürfnis trifft begrenzte Verfügbarkeit
  { titel: 'Auch meine Grenze gilt', gebiet: 'Beziehungen & Borderline' },
  { titel: 'Eine Antwort bleibt aus', gebiet: 'Beziehungen & Borderline' },
  { titel: 'Wenn Nähe zur Verpflichtung wird', gebiet: 'Beziehungen & Borderline' },
  { titel: 'Verlassenheitsangst und Vermeidungsbemühungen', gebiet: 'Diagnose & Differenzierung' },
  { titel: 'Abstand wünschen', gebiet: 'Beziehungen & Borderline' },
  { titel: 'Rückzug hat mehrere mögliche Bedeutungen', gebiet: 'Beziehungen & Borderline' },
];
// „Abstand wünschen“ und „Rückzug hat mehrere mögliche Bedeutungen“ haben keine Bestandsfuge zur Verlustangst:
// Sie hängen bewusst am Bund, als Fall der glatten Kante (zunächst inkommensurabel).
// Alle anderen Feldfugen der Verlustangst hängen ebenfalls daran (geprüft unten, sonst Abbruch).

const ART_WORT = {
  einordnung: 'Einordnung', offen: 'offen', abstand: 'Abstand', widerspruch: 'Widerspruch',
  spannung: 'Gegenpol', bedingung: 'Bedingung', folge: 'Folge', uebergang: 'Übergang',
  zusammenhang: 'Zusammenhang', aussage: 'Aussage', begrenzung: 'Begrenzung', annaeherung: 'Nähe',
};
const ORTSART_WORT = {
  phenomenon: 'Phänomen', method: 'Methode', concept: 'Begriff', model: 'Modell', exercise: 'Übung',
  practice: 'Praxis', chapter: 'Kapitel', context: 'Kontext', path: 'Weg', dimension: 'Dimension',
  scene: 'Szene', perspective: 'Perspektive', instrument: 'Instrument', source: 'Quelle',
  domain: 'Erfahrungsfeld', population: 'Gruppe', 'interactive-model': 'Modell', finding: 'Befund',
  research: 'Forschung',
};
const GELTUNG_WORT = { original: 'aus dem Original', quelle: 'aus einer Quelle', redaktionell: 'redaktionell zugeordnet', offen: 'offen' };
const STATUS_WORT = {
  proposed: 'vorgeschlagen', 'redaktionelle-zuordnung': 'redaktionelle Zuordnung', beobachtung: 'Beobachtung',
  konzept: 'Konzept', modell: 'Modell', gegenbefund: 'Gegenbefund', intervention: 'Intervention',
  erfahrung: 'Erfahrung', dokument: 'Dokument',
};
const QUELLART_WORT = {
  community: 'Forum', leitlinie: 'Leitlinie', klinik: 'Klinik', studie: 'Studie', uebersicht: 'Übersicht',
  bericht: 'Bericht', ableitung: 'Ableitung', public_health_information: 'Gesundheitsinformation',
};

// Wortregeln für Lesarten aus Sätzen (dieselben Wörter stehen im Bereich „Wie die Zähne entstehen“)
const LESEREGELN = [
  { art: 'spannung', muster: /Gegenteil|Gegenpol/, wort: (s) => (s.match(/Gegenteil[^,.;—–]*/) || s.match(/Gegenpol[^,.;—–]*/))[0].trim() },
  { art: 'annaeherung', muster: /Nähe, nicht Identität|benannte Nähe|\bNähe\b(?! offen)/, wort: (s) => (s.match(/Nähe, nicht Identität/) || s.match(/benannte Nähe/) || ['Nähe'])[0] },
  { art: 'zusammenhang', muster: /[Kk]önnte zusammenhängen/, wort: () => 'könnte zusammenhängen' },
  { art: 'abstand', muster: /nicht notwendig|nicht dasselbe|nicht identisch|unterschieden|keine Identität/, wort: (s) => (s.match(/nicht notwendig[^,.;—–]*/) || s.match(/nicht dasselbe[^,.;—–]*/) || s.match(/nicht identisch[^,.;—–]*/) || s.match(/keine Identität/) || ['muss unterschieden werden'])[0].trim() },
  { art: 'offen', muster: /^Ob .*trennbar/, wort: () => 'ob trennbar' },
];
const LESE_ABSCHNITTE = ['Verwandt und zu unterscheiden', 'Offene Fragen'];

function sha256(datei) {
  return createHash('sha256').update(readFileSync(datei)).digest('hex');
}

// Registernummern („AWMF 028-045“) und PMID/DOI-Angaben stehen nicht im sichtbaren Text;
// die vollständigen Angaben bleiben im Bestand und bei Quellen unter technisch (titelBestand, url).
const REGISTER = [[/\bAWMF[\s-]*(?:Reg(?:ister)?\.?-?(?:Nr\.?)?\s*)?\d{3}[-/]\d{3}[A-Za-z]{0,3}\b/g, 'AWMF-Leitlinie'], [/\b(?:NCT\d{6,}|DRKS\d{6,}|ISRCTN\d{6,})\b/g, 'Studienregister']];
function ohneKennziffern(text) {
  let t = String(text || '');
  t = t.replace(/\s*\((?:[^()]*?;\s*)?(?:PMID|PMCID|DOI|doi)\s*:?\s*[^()]*\)/g, '');
  t = t.replace(/[,;]?\s*\b(?:PMID|PMCID)\s*:?\s*\d{5,}/g, '').replace(/[,;]?\s*\b(?:DOI|doi)\s*:?\s*10\.\S+/g, '');
  for (const [re, ersatz] of REGISTER) t = t.replace(re, ersatz);
  return t;
}
function saeubern(text) {
  return ohneKennziffern(String(text || '')
    .replace(/\s*\([^()]*→[^()]*\)/g, '')       // (MODEL; → technischer-verweis)
    .replace(/\s*→\s*[a-z0-9_-]+/g, '')         // → technischer-verweis
    .replace(/\s*\((?:MODEL|CLAIM|SEALED?|STUB|DRAFT)\)/g, '') // (MODEL) – interne Statusmarke
    .replace(/`[^`]*`/g, '')                    // Code-/Heftnamen
    .replace(/\*\*/g, ''))
    .replace(/[ \t]+/g, ' ')
    .replace(/ ([.,;:])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .trim();
}

function abschnitte(body) {
  const teile = {};
  const re = /^##\s+(.+)$/gm;
  const marken = [];
  let m;
  while ((m = re.exec(body))) marken.push({ titel: m[1].trim(), start: m.index, inhalt: m.index + m[0].length });
  marken.forEach((mk, i) => {
    const ende = i + 1 < marken.length ? marken[i + 1].start : body.length;
    teile[mk.titel] = body.slice(mk.inhalt, ende).trim();
  });
  return teile;
}

// Satzgrenzen: nach . ! ? vor Großbuchstaben oder „ – aber nicht in Klammern und nicht nach
// Abkürzungen (vs., bzw., z. B., ca., et al., u. a., d. h., einzelne Buchstaben).
const ABKUERZUNG = /(?:^|[\s(„])(?:vs|bzw|ca|ggf|evtl|vgl|sog|inkl|usw|etc|Nr|Dr|Prof|Hrsg|al|[A-Za-zÄÖÜäöü])$/;
function saetze(text) {
  const t = saeubern(text.replace(/\n+/g, ' '));
  const out = [];
  let tiefe = 0, start = 0;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (c === '(' || c === '[') tiefe++;
    else if ((c === ')' || c === ']') && tiefe > 0) tiefe--;
    else if ((c === '.' || c === '!' || c === '?') && tiefe === 0) {
      const m = t.slice(i + 1).match(/^(["“”»]?)\s+(?=[A-ZÄÖÜ„])/);
      if (!m) continue;
      if (c === '.' && ABKUERZUNG.test(t.slice(Math.max(0, i - 12), i))) continue;
      out.push(t.slice(start, i + 1 + m[1].length).trim());
      start = i + 1 + m[0].length;
      i = start - 1;
    }
  }
  out.push(t.slice(start).trim());
  return out.filter(Boolean);
}

// Anzeige ohne Abrufvermerke („/ NLM cited_text 30.08.2026“, „, NLM-Ask“) –
// der vollständige Bestandstitel bleibt unter technisch.titelBestand erhalten.
function anzeigeTitel(titel) {
  return String(titel)
    .replace(/\s*(?:\/|,)\s*NLM(?:[- ]?(?:Ask|cited_text))?(?:\s+\d{1,2}\.\d{1,2}\.\d{4})?\s*$/i, '')
    .replace(/\s+cited_text.*$/i, '')
    .replace(/^(.*)$/, (x) => ohneKennziffern(x))
    .trim();
}
function kurzTitel(titel) {
  return anzeigeTitel(String(titel).split(' / ')[0]);
}

function belegZeilen(body) {
  const ab = abschnitte(body)['Belege'] || '';
  return ab.split('\n').map((z) => z.trim()).filter((z) => z.startsWith('- [')).map((z) => {
    const m = z.match(/^- \[([^\]]*)\]\s*([^|]*)\|\s*([^|]*)\|\s*"(.*)"\s*$/);
    if (!m) return null;
    return { art: m[1].trim(), ref: m[2].trim(), titel: m[3].trim(), zitat: m[4].trim() };
  }).filter(Boolean);
}

function zitatFuer(quelle, zeilen) {
  const url = quelle.url || '';
  for (const z of zeilen) {
    if (z.ref.startsWith('url:') && z.ref.slice(4) === url) return z.zitat;
    const pm = z.ref.match(/^pmid:(\d+)/);
    if (pm && url.includes(pm[1])) return z.zitat;
  }
  return '';
}

const karte = JSON.parse(readFileSync(KARTE, 'utf8'));
const texte = JSON.parse(readFileSync(TEXTE, 'utf8'));

function findeOrt({ titel, gebiet }) {
  const r = karte.regionen.findIndex((x) => x.name === gebiet);
  const i = karte.orte.findIndex((o) => o.t === titel && o.r === r);
  if (r < 0 || i < 0) throw new Error(`Ort nicht im Bestand: ${titel} (${gebiet})`);
  return i;
}

function quelleDaten(schluessel, zeilen) {
  const rec = texte.quellen[schluessel] || {};
  const roh = rec.titel || 'Unbenannte Quelle';
  return {
    titel: anzeigeTitel(roh),
    kurz: kurzTitel(roh),
    art: QUELLART_WORT[rec.art] || 'Quelle',
    zitat: zeilen ? zitatFuer(rec, zeilen) : '',
    technisch: { schluessel, url: rec.url || '', titelBestand: roh },
  };
}

function ortDaten(i) {
  const o = karte.orte[i];
  const t = texte.orte[i] || {};
  const body = t.body || '';
  const ab = abschnitte(body);
  const zeilen = belegZeilen(body);
  const mehr = [];
  if (ab['Verwandt und zu unterscheiden']) {
    mehr.push({ titel: 'Verwandt und zu unterscheiden', text: saeubern(ab['Verwandt und zu unterscheiden']) });
  } else if (!Object.keys(ab).length) {
    // Einträge ohne Kapitelgliederung (z. B. Neuroatlas): Absätze unverändert, Zwischentitel als Vorsatz
    const roh = body.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
    const out = [];
    let vorsatz = '';
    for (const absatz of roh) {
      const h = absatz.match(/^#{2,4}\s+(.+)$/);
      if (h) { vorsatz = h[1].trim(); continue; }
      out.push((vorsatz ? vorsatz + ': ' : '') + saeubern(absatz));
      vorsatz = '';
    }
    if (out.length > 1) mehr.push({ titel: 'Im Eintrag', text: out.slice(1).join(' ') });
  }
  return {
    titel: o.t,
    gebiet: karte.regionen[o.r].name,
    ortsart: ORTSART_WORT[o.k] || '',
    kurz: saeubern(o.s),
    mehr,
    quellen: (t.quellen || []).map((q) => quelleDaten(q, zeilen)),
    blick: blickDaten(ab, o),
    bedingungen: bedingungsKlauseln(body),
    grenzSaetze: grenzSaetze(ab),
    herkunft: t.herkunft ? t.herkunft.titel : '',
    technisch: { ortIndex: i, textKennung: t.id || '', herkunftPfad: t.herkunft ? t.herkunft.pfad : '' },
  };
}

/* Blickrichtungen: nur vorhandene Abschnitte des Ortstexts, unverändert (gesäubert wie oben).
   innen  = wie es erlebt wird      („Was Menschen beschreiben“, „Im Alltag“) – nicht „Was Berichte sagen“:
            dort stehen Fundort- und Redaktionsnotizen, kein Erleben.
   Sätze, die Redaktionsnotizen sind (Abrufstand, „nicht extrahiert“, „kein erfundenes Zitat“ …), fallen weg.
   aussen = wovon es zu unterscheiden ist („Was das nicht ist“, „Verwandt und zu unterscheiden“)
   spielraum = nur ein ausdrücklicher Abschnitt „Handlungsspielraum“. Fehlt er, bleibt die Liste leer. */
const BLICK = {
  innen: ['Was Menschen beschreiben', 'Im Alltag'],
  aussen: ['Was das nicht ist', 'Verwandt und zu unterscheiden'],
  spielraum: ['Handlungsspielraum'],
};
const REDAKTION = /nicht extrahiert|kein erfundenes|URL-Lage|Thread-Körper|Thread-Titel|Notebook|Quellenprüfung|Codex|NLM|cited_text|Abrufstand|lag als|hier nicht geprüft/i;
const ohneNotizen = (text) => saetze(text).filter((x) => !REDAKTION.test(x)).join(' ');
function blickDaten(ab, o) {
  const out = {};
  for (const [k, namen] of Object.entries(BLICK)) out[k] = namen.filter((n) => ab[n]).map((n) => ({ abschnitt: n, text: ohneNotizen(ab[n]) })).filter((x) => x.text);
  // Einträge ohne Kapitel: der Kurztext ist das Einzige, was über das Erleben gesagt wird
  if (!out.innen.length) out.innen = [{ abschnitt: 'Kurztext', text: saeubern(o.s) }];
  return out;
}
/* Bedingungen aus dem Wortlaut: Satzteile mit „wenn“, „sobald“, „falls“, „solange“, „bei“, „unter“, „während“.
   Ausgelassen: Belege, Namenslisten, „Was Studien sagen“ und „Was im Manual steht“ (Befundsprache, keine Lage), verneinte Sätze („Nicht dass …“ nennt keine Lage des Orts),
   Wendungen ohne Lage („unter anderem“, „unter diesem Namen“). Das ist eine Wortregel, keine Deutung. */
const BED_MUSTER = /(?:^|[\s,(—–])((?:nur wenn|vor allem bei|besonders bei|wenn|sobald|falls|solange|bei|unter|während)\s[^.,;:—–()]{3,90})/gi;
const BED_AUS = /^(?:unter (?:anderem|diesem|dem Namen|den gelesenen)|bei (?:ADHS|Autismus)\b)/i;
const BED_ABSCHNITT_AUS = new Set(['Belege', 'Wie es sonst genannt wird', 'Was Studien sagen', 'Was im Manual steht']);
function bedingungsKlauseln(body) {
  const out = [];
  const teile = abschnitte(body);
  const liste = Object.keys(teile).length ? Object.entries(teile) : [['', body]];
  for (const [name, text] of liste) {
    if (BED_ABSCHNITT_AUS.has(name)) continue;
    for (const satz of saetze(text)) {
      if (/^Nicht\b/.test(satz)) continue;
      BED_MUSTER.lastIndex = 0;
      let m;
      while ((m = BED_MUSTER.exec(satz))) {
        const klausel = m[1].replace(/\s+und\s+(?:ist|sind|hat|haben|kann|wird)\b.*$/, '').trim();
        if (BED_AUS.test(klausel)) continue;
        if (!out.some((x) => x.klausel === klausel)) out.push({ klausel, satz, abschnitt: name || 'Eintrag' });
      }
    }
  }
  return out;
}
// Sätze, die sagen, wo eine Aussage endet: „Aussagegrenze“ und „Was das nicht ist“, je Satz
function grenzSaetze(ab) {
  const out = [];
  for (const name of ['Aussagegrenze', 'Was das nicht ist']) {
    if (!ab[name]) continue;
    for (const satz of saetze(ab[name])) out.push({ satz, abschnitt: name });
  }
  return out;
}

function leseSaetze(i) {
  const ab = abschnitte((texte.orte[i] || {}).body || '');
  const out = [];
  for (const name of LESE_ABSCHNITTE) {
    if (!ab[name]) continue;
    for (const s of saetze(ab[name])) out.push({ abschnitt: name, satz: s });
  }
  return out;
}

function nennt(satz, titel) {
  return new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${titel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Za-zÄÖÜäöüß]|$)`).test(satz);
}

function klammerNach(satz, titel) {
  const m = satz.match(new RegExp(`${titel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\(([^)]*)\\)`));
  return m ? m[1].trim() : '';
}

function lesartenAusSatz(satz) {
  const out = [];
  for (const regel of LESEREGELN) {
    if (regel.muster.test(satz)) out.push({ art: regel.art, wort: regel.wort(satz) });
  }
  return out;
}

const schlossIndex = findeOrt(SCHLOSS);
const schloss = ortDaten(schlossIndex);

// Ein Paar = zwei Orte. A ist immer die Schlossseite, B der Schlüssel.
function paarDaten(A, B) {
  const tA = karte.orte[A].t;
  const tB = karte.orte[B].t;
  const fugen = [];
  karte.fugen.forEach((f, fi) => {
    const hin = f.a === A && f.b === B;
    const zurueck = f.a === B && f.b === A;
    if (!hin && !zurueck) return;
    fugen.push({
      richtung: hin ? `${tA} → ${tB}` : `${tB} → ${tA}`,
      vomSchloss: hin,
      art: f.art,
      artWort: ART_WORT[f.art] || f.art,
      label: f.label,
      grund: f.grund,
      geltung: f.geltung,
      geltungWort: GELTUNG_WORT[f.geltung] || f.geltung,
      status: f.status,
      statusWort: STATUS_WORT[f.status] || '',
      grenze: saeubern(f.grenze),
      detail: saeubern(f.detail),
      quellen: f.quellen.map((q) => quelleDaten(q, null)),
      herkunft: f.herkunft,
      technisch: { fugeIndex: fi, typ: f.typ, gegen: f.gegen ?? null },
    });
  });
  fugen.sort((x, y) => (y.vomSchloss ? 1 : 0) - (x.vomSchloss ? 1 : 0));

  // Lesarten: zuerst die der Bestandsfuge, dann Sätze der beiden Ortstexte, gleiche Art zusammengeführt
  const lesarten = [];
  const nachArt = new Map();
  function dazu(art, wort, beleg) {
    if (nachArt.has(art)) {
      const l = nachArt.get(art);
      if (!l.belege.some((b) => b.satz === beleg.satz && b.woher === beleg.woher)) l.belege.push(beleg);
      for (const w of beleg.auchImSatz || []) if (!l.auchImSatz.includes(w)) l.auchImSatz.push(w);
      return;
    }
    const l = { art, artWort: ART_WORT[art] || art, wort, ausBestand: beleg.woher === 'Bestandsfuge', auchImSatz: [...(beleg.auchImSatz || [])], belege: [beleg] };
    nachArt.set(art, l);
    lesarten.push(l);
  }
  if (fugen.length) {
    const f = fugen[0];
    dazu(f.art, f.artWort, { woher: 'Bestandsfuge', satz: f.label, geltung: f.geltungWort, status: f.statusWort });
    for (const g of fugen.slice(1)) {
      if (g.art !== f.art) dazu(g.art, g.artWort, { woher: 'Bestandsfuge (Gegenrichtung)', satz: g.label, geltung: g.geltungWort, status: g.statusWort });
    }
  } else {
    lesarten.push({ art: 'keine', artWort: 'keine', wort: 'keine Fuge', ausBestand: true, auchImSatz: [], belege: [{ woher: 'Bestand', satz: 'Im Lesebestand gibt es keine Fuge zwischen beiden Orten.' }] });
  }
  // Nur Sätze, in denen einer der beiden Orte den anderen nennt. Tragen beide denselben Titel
  // (zweimal „Hyperfokus“), lässt sich „nennt den anderen“ nicht von „nennt sich selbst“ trennen: dann keine Sätze.
  const quellenSaetze = tA === tB ? [] : [
    ...leseSaetze(A).filter((x) => nennt(x.satz, tB)).map((x) => ({ ...x, woher: tA, weitere: klammerNach(x.satz, tB) })),
    ...leseSaetze(B).filter((x) => nennt(x.satz, tA)).map((x) => ({ ...x, woher: tB, weitere: klammerNach(x.satz, tA) })),
  ];
  // Ohne Bestandsfuge bleibt die Kante glatt: Sätze werden dann nur als Hinweis mitgegeben, nicht als Lesart.
  if (fugen.length) {
    for (const x of quellenSaetze) {
      const ls = lesartenAusSatz(x.satz);
      for (const l of ls) {
        const auch = ls.filter((o) => o !== l).map((o) => o.wort);
        dazu(l.art, l.wort, { woher: x.woher, satz: x.satz, abschnitt: x.abschnitt, klammer: x.weitere || '', auchImSatz: auch });
      }
    }
  }
  return { a: A, b: B, fugen, lesarten, saetzeOhneFuge: fugen.length ? [] : quellenSaetze.map((x) => ({ woher: x.woher, satz: x.satz })) };
}

/* ---------------- Das Feld um das Schloss ----------------
   Regel: alle Orte im Gebiet des Schlosses, dazu alle Orte, die mit einem von ihnen durch eine
   Bestandsfuge verbunden sind, und genau diese Fugen. Mehr als FELD_MAX Orte: die Gebietsorte
   bleiben alle; von den Nachbarn bleiben die mit den meisten Fugen ins Gebiet, bei Gleichstand
   nach Titel. Die Begrenzung steht dann im Regeltext. */
const FELD_MAX = 160;
const heimR = karte.orte[schlossIndex].r;
const heim = karte.orte.map((o, i) => i).filter((i) => karte.orte[i].r === heimR);
const heimSet = new Set(heim);
const beruehrt = karte.fugen.map((f, fi) => ({ f, fi })).filter(({ f }) => heimSet.has(f.a) || heimSet.has(f.b));
const nachbarZahl = new Map();
for (const { f } of beruehrt) for (const x of [f.a, f.b]) if (!heimSet.has(x)) nachbarZahl.set(x, (nachbarZahl.get(x) || 0) + 1);
let nachbarn = [...nachbarZahl.keys()].sort((x, y) => nachbarZahl.get(y) - nachbarZahl.get(x) || karte.orte[x].t.localeCompare(karte.orte[y].t, 'de') || x - y);
const nachbarnAlle = nachbarn.length;
const begrenzt = heim.length + nachbarn.length > FELD_MAX;
if (begrenzt) nachbarn = nachbarn.slice(0, Math.max(0, FELD_MAX - heim.length));
const feldOrte = [...heim, ...nachbarn];
const feldSet = new Set(feldOrte);
const feldFugen = beruehrt.filter(({ f }) => feldSet.has(f.a) && feldSet.has(f.b));

// ein Paar je Ortspaar; A (Schlossseite): das Schloss selbst, sonst der Gebietsort, sonst Anfang der ersten Fuge
function kanon(x, y, ersteA) {
  if (x === schlossIndex) return [x, y];
  if (y === schlossIndex) return [y, x];
  if (heimSet.has(x) && !heimSet.has(y)) return [x, y];
  if (heimSet.has(y) && !heimSet.has(x)) return [y, x];
  return ersteA === x ? [x, y] : [y, x];
}
const paarSchluessel = new Map();
const paare = [];
function paarIndex(A, B) {
  const k = `${A}|${B}`;
  if (!paarSchluessel.has(k)) { paarSchluessel.set(k, paare.length); paare.push(paarDaten(A, B)); }
  return paarSchluessel.get(k);
}
// zuerst der Schlüsselbund des Schlosses in fester Reihenfolge (erster Eintrag = Startfall)
const bundSchloss = AUSWAHL.map((x) => paarIndex(schlossIndex, findeOrt(x)));
const feldPaare = [];
const gesehenPaar = new Set();
for (const { f } of feldFugen) {
  const k = [Math.min(f.a, f.b), Math.max(f.a, f.b)].join('|');
  if (gesehenPaar.has(k)) continue;
  gesehenPaar.add(k);
  const [A, B] = kanon(f.a, f.b, f.a);
  feldPaare.push(paarIndex(A, B));
}

// Lage: Gebiete als Nachbarschaften. Innerhalb eines Gebiets bleibt die Kartenlage (x/y) erhalten,
// nur gleichmäßig gestreckt und so weit auseinandergeschoben, dass sich Zeichen nicht berühren.
// Fremde Gebiete stehen in der Richtung ihres Kartenzentrums, aber näher herangerückt.
function relax(pkte, anker, dmin, runden = 260) {
  for (let r = 0; r < runden; r++) {
    for (let i = 0; i < pkte.length; i++) {
      for (let j = i + 1; j < pkte.length; j++) {
        const dx = pkte[j].x - pkte[i].x, dy = pkte[j].y - pkte[i].y;
        const d = Math.hypot(dx, dy) || 1e-6;
        if (d < dmin) {
          const s = (dmin - d) / 2;
          const ux = d > 1e-5 ? dx / d : Math.cos(i + j), uy = d > 1e-5 ? dy / d : Math.sin(i + j);
          pkte[i].x -= ux * s; pkte[i].y -= uy * s; pkte[j].x += ux * s; pkte[j].y += uy * s;
        }
      }
    }
    for (let i = 0; i < pkte.length; i++) { pkte[i].x += (anker[i].x - pkte[i].x) * 0.04; pkte[i].y += (anker[i].y - pkte[i].y) * 0.04; }
  }
  return pkte;
}
function gebietsLage(orte, dicht = 1, heim = false) {
  const cx = orte.reduce((a, i) => a + karte.orte[i].x, 0) / orte.length;
  const cy = orte.reduce((a, i) => a + karte.orte[i].y, 0) / orte.length;
  const roh = orte.map((i) => ({ x: karte.orte[i].x - cx, y: karte.orte[i].y - cy }));
  // Heimgebiet: Liegt es auf der Karte als schmaler Streifen, wird es in beiden Richtungen auf gleiche
  // Ausdehnung gestreckt. Reihenfolge und Nachbarschaft der Orte bleiben, nur das Seitenverhältnis ändert sich.
  if (heim && roh.length > 2) {
    const sd = (k) => Math.sqrt(roh.reduce((a, p) => a + p[k] * p[k], 0) / roh.length) || 1;
    const sx = sd('x'), sy = sd('y'), g = Math.sqrt(sx * sy);
    for (const p of roh) { p.x *= g / sx; p.y *= g / sy; }
  }
  let nn = [];
  for (let i = 0; i < roh.length; i++) {
    let m = Infinity;
    for (let j = 0; j < roh.length; j++) if (i !== j) m = Math.min(m, Math.hypot(roh[i].x - roh[j].x, roh[i].y - roh[j].y));
    if (Number.isFinite(m)) nn.push(m);
  }
  nn.sort((a, b) => a - b);
  const median = nn.length ? nn[Math.floor(nn.length / 2)] : 1;
  const k = (1.3 / (median || 1)) * dicht;
  const anker = roh.map((p) => ({ x: p.x * k, y: p.y * k }));
  const pkte = relax(anker.map((p) => ({ ...p })), anker, heim ? 1.5 : 1.12);
  const r = Math.max(0.6, ...pkte.map((p) => Math.hypot(p.x, p.y) + 0.6));
  return { cx, cy, pkte, r };
}
const nachGebiet = new Map();
for (const i of feldOrte) {
  const r = karte.orte[i].r;
  if (!nachGebiet.has(r)) nachGebiet.set(r, []);
  nachGebiet.get(r).push(i);
}
const lagen = new Map();
for (const [r, orte] of nachGebiet) lagen.set(r, { orte, ...gebietsLage(orte, r === heimR ? 1 : 0.55, r === heimR) });
const heimLage = lagen.get(heimR);
const fremde = [...lagen.keys()].filter((r) => r !== heimR).sort((a, b) => a - b);
for (const r of fremde) {
  const l = lagen.get(r);
  l.winkel = Math.atan2(l.cy - heimLage.cy, l.cx - heimLage.cx);
  l.abstand = heimLage.r + l.r + 0.9;
}
// fremde Gebiete dürfen sich nicht überdecken: Winkel auseinanderschieben
for (let runde = 0; runde < 400; runde++) {
  let bewegt = false;
  for (let i = 0; i < fremde.length; i++) {
    for (let j = i + 1; j < fremde.length; j++) {
      const a = lagen.get(fremde[i]), b = lagen.get(fremde[j]);
      const ax = Math.cos(a.winkel) * a.abstand, ay = Math.sin(a.winkel) * a.abstand;
      const bx = Math.cos(b.winkel) * b.abstand, by = Math.sin(b.winkel) * b.abstand;
      if (Math.hypot(ax - bx, ay - by) < a.r + b.r + 0.7) {
        const s = a.winkel <= b.winkel ? 1 : -1;
        a.winkel -= s * 0.02; b.winkel += s * 0.02;
        bewegt = true;
      }
    }
  }
  if (!bewegt) break;
}
const lage = new Map();
for (const [r, l] of lagen) {
  const ox = r === heimR ? 0 : Math.cos(l.winkel) * l.abstand;
  const oy = r === heimR ? 0 : Math.sin(l.winkel) * l.abstand;
  l.orte.forEach((i, k) => lage.set(i, { x: +(ox + l.pkte[k].x).toFixed(3), y: +(oy + l.pkte[k].y).toFixed(3) }));
  l.mitte = { x: +ox.toFixed(3), y: +oy.toFixed(3) };
}

// Schlüsselbund jedes anderen Schlosses im Feld: seine Paare (er auf der Schlossseite), nach Titel
const bunde = { [schlossIndex]: bundSchloss };
for (const pi of feldPaare) {
  const A = paare[pi].a;
  if (A === schlossIndex) continue;
  (bunde[A] = bunde[A] || []).push(pi);
}
for (const A of Object.keys(bunde)) {
  if (Number(A) === schlossIndex) continue;
  bunde[A].sort((x, y) => karte.orte[paare[x].b].t.localeCompare(karte.orte[paare[y].b].t, 'de') || paare[x].b - paare[y].b);
}
// keine stille Kappung: der Bund des Schlosses enthält jede seiner Feldfugen
for (const pi of feldPaare) {
  const p = paare[pi];
  if ((p.a === schlossIndex || p.b === schlossIndex) && !bundSchloss.includes(pi)) throw new Error(`Feldfuge fehlt am Bund: ${karte.orte[p.a].t} – ${karte.orte[p.b].t}`);
}

const orte = {};
for (const i of new Set([...feldOrte, schlossIndex, ...paare.flatMap((p) => [p.a, p.b])])) {
  orte[i] = { ...ortDaten(i), feld: lage.get(i) || null };
}

const feld = {
  orte: feldOrte,
  paare: feldPaare,
  gebiete: [...lagen.entries()].map(([r, l]) => ({ name: karte.regionen[r].name, mitte: l.mitte, radius: +l.r.toFixed(3), heim: r === heimR })),
  regel: {
    text: `Das Feld zeigt alle Orte im Gebiet „${karte.regionen[heimR].name}“, zu dem ${schloss.titel} gehört, dazu jeden Ort, der mit einem von ihnen durch eine Fuge im Lesebestand verbunden ist, und diese Fugen.`,
    begrenzung: begrenzt
      ? `Es wären mehr als ${FELD_MAX} Orte. Alle Orte des Gebiets bleiben; von den übrigen bleiben die mit den meisten Fugen ins Gebiet (bei Gleichstand nach Titel).`
      : 'Begrenzt wird erst bei sehr großen Feldern; hier fehlt nichts.',
    lage: 'Innerhalb eines Gebiets folgt die Lage der Karte, gestreckt (das eigene Gebiet in beiden Richtungen auf gleiche Ausdehnung, andere Gebiete enger) und so weit auseinandergeschoben, dass sich Zeichen nicht berühren. Andere Gebiete stehen in der Richtung, in der sie auf der Karte liegen, aber näher herangerückt.',
  },
  technisch: { heimGebiet: heimR, orteGesamt: feldOrte.length, nachbarnGesamt: nachbarnAlle, fugenGesamt: feldFugen.length, paareGesamt: feldPaare.length, begrenzt, feldMax: FELD_MAX },
};

/* Fehlstellen aus fugenraeume.json: nur Einträge, deren Ränder einen Ort dieses Felds berühren.
   Zusammengelegt wird nur, was denselben Randsatz zu DEMSELBEN Gegenüber (nach Ortsindex, nicht nach Titel)
   im selben Gebiet nennt. Zwei gleichnamige Gegenüber in verschiedenen Gebieten bleiben zwei Fehlstellen. */
const raeume = JSON.parse(readFileSync(RAEUME, 'utf8'));
const fehlstellen = [];
for (const f of raeume.fehlstelle || []) {
  for (const r of f.raender || []) {
    const hier = [r.a, r.b].filter((x) => feldSet.has(x));
    if (!hier.length) continue;
    const gi = f.ort ? f.ort.i : null;
    const gegen = f.ort ? { titel: f.ort.t, gebiet: f.ort.gebiet || (karte.regionen[f.ort.r] || {}).name || '', technisch: { ortIndex: gi } } : null;
    for (const i of hier) {
      const gebiet = karte.regionen[karte.orte[i].r].name;
      let e = fehlstellen.find((x) => x.label === r.label && x.gebildetAus === (f.gebildetAus || '') && x.gebiet === gebiet && x.technisch.gegen === gi);
      if (!e) {
        e = { orte: [], gebiet, modus: f.modus, gebildetAus: f.gebildetAus || '', label: r.label, gegenueber: gegen, detail: saeubern(String(r.detail || '').split(/\n{2,}/)[0]), technisch: { gegen: gi } };
        fehlstellen.push(e);
      }
      if (!e.orte.includes(i)) e.orte.push(i);
    }
  }
}

const daten = {
  format: 'schloss-schluessel-probe',
  version: 5,
  herkunft: {
    erzeugt: new Date().toISOString(),
    skript: 'baue-daten.mjs',
    lesebestand: 'Borderline verstehen · Fugenland-Lesebestand (nur lesend)',
    karte: { datei: relative(HIER, KARTE), sha256: sha256(KARTE), format: karte.format, version: karte.version },
    texte: { datei: relative(HIER, TEXTE), sha256: sha256(TEXTE), format: texte.format, version: texte.version },
    fugenraeume: { datei: relative(HIER, RAEUME), sha256: sha256(RAEUME), format: raeume.format, version: raeume.version, hinweis: raeume.hinweis },
    hinweis: 'Nur gebrauchte Orte und Fugen. Titel, Kurztexte und Fugenfelder unverändert übernommen. Quellentitel für die Anzeige ohne Abrufvermerke (etwa „NLM-Ask“, „cited_text“ mit Datum); der vollständige Bestandstitel steht unter technisch.titelBestand. Aus Ortstexten nur entfernt: technische Verweise (Pfeil + Kennung), Code-Namen, Fettdruck-Zeichen, PMID/DOI-Angaben und Registernummern (etwa „AWMF 028-045“ → „AWMF-Leitlinie“; vollständig im Bestand und bei Quellen unter technisch). Blickrichtungen ohne Redaktionsnotizen. Lesarten aus Sätzen sind Lesarten dieser Probe und stammen nur aus Sätzen, in denen einer der beiden Orte den anderen nennt.',
    leseregeln: LESEREGELN.map((r) => ({ art: r.art, muster: String(r.muster) })),
  },
  schloss: schlossIndex,
  orte,
  paare,
  bunde,
  feld,
  fehlstellen,
};

const kopf = `// Erzeugt von baue-daten.mjs am ${daten.herkunft.erzeugt} – nicht von Hand ändern.\n// Quelle: Lesebestand ${daten.herkunft.karte.datei} und ${daten.herkunft.texte.datei} (nur lesend).\n`;
writeFileSync(ZIEL, `${kopf}window.SCHLOSS_DATEN = ${JSON.stringify(daten, null, 1)};\n`);

console.log(`daten.js geschrieben: Schloss ${schloss.titel}, ${bundSchloss.length} Schlüssel im Bund, ${paare.length} Paare`);
console.log(`Fehlstellen am Feld: ${fehlstellen.map((f) => `${f.orte.map((i) => karte.orte[i].t).join(' + ')} ↔ ${f.gegenueber ? `${f.gegenueber.titel} (${f.gegenueber.gebiet})` : '–'}`).join(' | ')}`);
console.log(`Feld: ${feldOrte.length} Orte (${heim.length} im Gebiet, ${nachbarn.length} von ${nachbarnAlle} Nachbarn), ${feldFugen.length} Fugen, ${feldPaare.length} Ortspaare${begrenzt ? ' – BEGRENZT' : ''}`);
for (const pi of [...new Set([...bundSchloss, ...feldPaare])]) {
  const p = paare[pi];
  console.log(`  ${karte.orte[p.a].t} ⟷ ${karte.orte[p.b].t}: ${p.fugen.length} Fuge(n); Lesarten: ${p.lesarten.map((l) => `${l.wort} [${l.art}]`).join(' | ')}`);
}
