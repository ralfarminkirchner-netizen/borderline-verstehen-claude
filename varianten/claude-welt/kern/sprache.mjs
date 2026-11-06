// Sichtbare Sprache der Lebenden Welt.
// In der Oberfläche steht nur, was das Thema betrifft. Wie der Bestand gebaut, gesammelt oder geprüft wurde,
// bleibt in den Daten (Originalfelder bleiben erhalten), erscheint aber nie als Text in der Welt.

// Gebietsnamen nach Inhalt statt nach Herkunftsprojekt (Kartenreihenfolge 0–9).
export const GEBIETSNAMEN = [
  'Trauma',
  'Neurodiversität & Entwicklung',
  'Phänomene im Kontext',
  'Dynamik & Mentalisieren',
  'Sprache in Beziehungen',
  'ADHS · Randphänomene',
  'Beziehungen & Borderline',
  'Diagnose & Differenzierung',
  'Trigger & Kontext',
  'Forschung & Einordnung',
];

// Bezeichnungen von Fugen: Verweise auf Original, Modellgraph, Quellenabschnitt oder Lernszene fallen weg.
const UMSCHRIFT = [
  [/^im Original eingeordnet in$/, 'gehört zu'],
  [/^wird im Forschungskontext untersucht mit$/, 'wird zusammen untersucht mit'],
  [/^wird im Original als Behandlungsbezug zugeordnet$/, 'hat Bezug zur Behandlung'],
  [/^modelliert als regulierend \/ aktivierend$/, 'wird als regulierend / aktivierend beschrieben'],
  [/^wird im selben Quellenabschnitt genannt mit$/, 'wird zusammen genannt mit'],
  [/^im Original als Profilbezug zugeordnet$/, 'gehört zum Profil von'],
  [/^im Original als begrifflich benachbart beschrieben$/, 'ist begrifflich benachbart'],
  [/^im Modell begründet mit$/, 'wird begründet mit'],
  [/^vertieft Originalmethode$/, 'vertieft die Methode'],
  [/^im Original als Gegenpol beschrieben$/, 'gilt als Gegenpol'],
  [/^unterscheidet Symptomdomäne und Alltagsszene$/, 'unterscheidet Symptom und Alltagserleben'],
  [/^ergänzt die Lernszene um eine Methodenfrage$/, 'ergänzt eine Methodenfrage'],
  [/^vertieft Zweck und Beleggrenzen$/, 'vertieft Zweck und Grenzen'],
];

export function sichtbareBezeichnung(label = '') {
  for (const [muster, ersatz] of UMSCHRIFT) if (muster.test(label)) return ersatz;
  return label;
}

// Sätze, die über den Bestand statt über das Thema sprechen.
const WERKSTATTSATZ = /redaktion|lesebrücke|lernanschluss|quelle|prüfstand|endpunkt|lesegrad|dossier|werkstattkarte|\babschnitt|\bdie texte\b|angegebenen texte|benannten texte|im original|bestand|zusätzliche studie|fiktive|erfundene|szene|grenzkarte|neue abschnitt/i;

function saetze(text) {
  return String(text || '')
    .split(/\n+/)
    .flatMap((absatz) => absatz.split(/(?<=[.!?])\s+/))
    .flatMap((s) => s.split(/;\s+/))
    .map((s) => s.trim())
    .filter(Boolean);
}

const grossAnfang = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
const mitPunkt = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

// Behält nur Sätze zum Thema; Teilsätze nach Semikolon werden zu eigenen Sätzen.
export function sichtbarerText(text) {
  return saetze(text).filter((s) => !WERKSTATTSATZ.test(s)).map((s) => mitPunkt(grossAnfang(s))).join(' ');
}

// Quellen, die in der Welt genannt werden dürfen: Literatur, Leitlinien, Klassifikationen.
// Projektdateien und Ableitungen bleiben Herkunftsdaten und erscheinen nicht.
const UNSICHTBARE_QUELLARTEN = new Set(['Original-Projektdatei', 'ableitung']);
export const quelleSichtbar = (q) => Boolean(q && q.titel) && !UNSICHTBARE_QUELLARTEN.has(q.art);

// Fließtext eines Orts: Sätze über Sammlung, Prüfung, Herkunft oder Werkzeuge fallen weg; Überschriften bleiben,
// wenn unter ihnen noch etwas zum Thema steht.
const FLIESS_WERKSTATT = /redaktion|lesebrücke|lernanschluss|prüfstand|lesegrad|dossier|werkstattkarte|projektdatei|originalgraph|im original\b|(im|aus dem|laut|dem) bestand|übernahme|recherche|kanonisiert|volltext|metadaten|extern verifiziert|quellenangabe|quellenlage|quellengebunden|quellenkante|codex|claude|notebooklm|\bki-|sichtung|lehrgrundlage|forschungsanschluss|modell- und recherche|kuratier|titel-\/abstract|prüflauf|registernummer|des originals|quellenbestand|geprüften bestand|bis zur prüfung/i;

export function sichtbarerFliesstext(body) {
  const bloecke = String(body || '').replace(/\[([^\]]+)\]\([^)]*\.md\)/g, '$1').replace(/^(#{1,4}\s[^\n]*)\n(?!\n)/gm, '$1\n\n').split(/\n{2,}/);
  const aus = [];
  for (const b of bloecke) {
    const z = b.trim();
    if (!z) continue;
    if (/^#{1,4}\s/.test(z)) { if (!FLIESS_WERKSTATT.test(z)) aus.push(z); continue; }
    const zeilen = z.split('\n').map((l) => {
      const liste = /^\s*[-*]\s+/.test(l) ? l.match(/^\s*[-*]\s+/)[0] : '';
      const s = l.slice(liste.length).split(/(?<=[.!?])\s+/).filter((x) => !FLIESS_WERKSTATT.test(x)).join(' ').trim();
      return s ? liste + s : '';
    }).filter(Boolean);
    if (zeilen.length) aus.push(zeilen.join('\n'));
  }
  // Überschriften ohne folgenden Inhalt entfernen
  return aus.filter((b, k) => !/^#{1,4}\s/.test(b) || (aus[k + 1] && !/^#{1,4}\s/.test(aus[k + 1]))).join('\n\n');
}
export const sichtbarerKernsatz = (s) => String(s || '').replace(/\s*·?\s*\b[a-z]+_[a-z_]+\b/g, '').split(/(?<=[.!?])\s+/).filter((x) => !FLIESS_WERKSTATT.test(x)).join(' ').trim();
