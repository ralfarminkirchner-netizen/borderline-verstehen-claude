// Begegnung und Wachstum in der Lebenden Welt.
// Alles hier ist offengelegt und aus dem Bestand abgeleitet; nichts wird geschätzt oder erfunden.
//
// 1. Ohne Fuge im Bestand gibt es keine Begegnung: die Wesen ziehen aneinander vorbei.
// 2. Die Lesart der Fuge entscheidet, WAS bei einer Begegnung geschieht:
//    verbindend    → Farben mischen sich (OKLab), das gemeinsame Phänomen wächst
//    unterscheidend → Inkommensurabel: Wände berühren sich, Farben bleiben getrennt, kein Wachstum
//    offen          → eine offene Forschungsfrage: Ring zwischen beiden, kein Wachstum
// 3. Die Stärke einer verbindenden Fuge kommt aus Fugenart × Belegen.
// 4. Das Wachstum des gemeinsamen Phänomens folgt einer Hill-Kurve: überadditiv, aber begrenzt.

export const LESART = { VERBINDEND: 'verbindend', UNTERSCHEIDEND: 'unterscheidend', OFFEN: 'offen' };

const UNTERSCHEIDENDE_ARTEN = new Set(['widerspruch', 'abstand', 'spannung', 'begrenzung']);
const UNTERSCHEIDENDE_TYPEN = new Set(['nicht_dasselbe', 'verwechselbar_mit', 'gegenteil_am_start', 'gegenbeispiel']);
// Wortlaut der Bezeichnung, der eine Unterscheidung statt einer Verbindung aussagt.
const UNTERSCHEIDENDER_WORTLAUT =
  /^(unterscheidet|muss( [a-zäöü]+)? unterschieden|trennt|grenzt|begrenzt|stellt .* gegenüber|ordnet .* auseinander|im Original als Gegenpol)/i;

// Verneinte Aussagen („ist nicht als … zu verstehen“, „belegt noch keine …“) begrenzen, statt zu verbinden.
const VERNEINT = /\b(nicht|kein|keine|keinen|keiner)\b/i;

export function lesart(fuge) {
  if (UNTERSCHEIDENDE_ARTEN.has(fuge.art) || UNTERSCHEIDENDE_TYPEN.has(fuge.typ)) return LESART.UNTERSCHEIDEND;
  if (UNTERSCHEIDENDER_WORTLAUT.test(fuge.label || '')) return LESART.UNTERSCHEIDEND;
  if (fuge.art !== 'offen' && VERNEINT.test(fuge.label || '')) return LESART.UNTERSCHEIDEND;
  if (fuge.art === 'offen') return LESART.OFFEN;
  return LESART.VERBINDEND;
}

// Gewicht einer Fuge (übernommen aus der Sichtung DATENMODELL.md, Abschnitt e):
//   w = basis(art) · g(geltung) · (1 − e^(−q_eff / 1,5))
// basis: belegte Assoziation trägt am stärksten, Kategorie-Zugehörigkeit kaum (eher Verschachtelung).
export const ARTGEWICHT = {
  zusammenhang: 1.0, aussage: 0.7, folge: 0.6, annaeherung: 0.6, uebergang: 0.5, bedingung: 0.45, einordnung: 0.25,
};
// g: Studien- und Quellkanten voll, Kanten des Originalgraphen 0,7, redaktionelle Lesebrücken 0,35.
export const GELTUNG = { quelle: 1, original: 0.7, redaktionell: 0.35, offen: 0 };
export const BELEG_SKALA = 1.5; // 1 / 2 / 3 / 5 Werke → 0,49 / 0,74 / 0,86 / 0,96

// q_eff: verschiedene Werke, die die VERBINDUNG tragen. Sagt der Bestand im Anker ausdrücklich,
// dass die Quellen nur zu einem Endpunkt gehören („kein neuer unabhängiger Beleg“), zählen sie nicht.
// Modus 'lesebruecke' (zur Wahl): solche Endpunktquellen zählen zur Hälfte – sichtbar als Lesebrücke.
export function belegZahl(fuge, modus = 'streng') {
  const werke = new Set(fuge.quellen || []).size;
  if (fuge.anker && fuge.anker.length) return modus === 'lesebruecke' ? werke * 0.5 : 0;
  if (fuge.geltung === 'original' && werke === 0) return 1; // dokumentierter Originalgraph
  return werke;
}

export function staerke(fuge, modus = 'streng') {
  if (lesart(fuge) !== LESART.VERBINDEND) return 0;
  let basis = ARTGEWICHT[fuge.art] ?? 0.25;
  if (fuge.art === 'folge' && fuge.typ === 'abstammung') basis = 0.3; // Herkunft von Schulen, keine Verstärkung
  const q = belegZahl(fuge, modus);
  return basis * (GELTUNG[fuge.geltung] ?? 0) * (1 - Math.exp(-q / BELEG_SKALA));
}

// Mehrere Fugen desselben Paars: Noisy-Or, ein Paar trägt höchstens 1 bei.
export const paarStaerke = (staerken) => 1 - staerken.reduce((p, s) => p * (1 - s), 1);

// Wachstum: g(W) = Gmax · Wⁿ / (cⁿ + Wⁿ), W = Summe der Stärken aller eingerasteten Fugen im Verbund.
// n = 2: anfangs überproportional (zwei getragene Fugen wirken mehr als doppelt so stark wie eine),
// dann Sättigung bei Gmax: kein Phänomen wächst unbegrenzt.
export const KURVE = { Gmax: 1.0, c: 1.2, n: 2 };

export const zuwachs = (W, k = KURVE) => (W <= 0 ? 0 : (k.Gmax * W ** k.n) / (k.c ** k.n + W ** k.n));

// Fläche des gemeinsamen Phänomens = Summe der Einzelflächen × (1 + g).
// Damit ist das Ganze bei jeder getragenen Fuge größer als die Summe seiner Teile, höchstens doppelt so groß.
// deckel: höchste Geltung der beitragenden Fugen (Qualitätsdeckel: viele schwache Kanten wirken nie wie Studien).
export function gemeinsamerRadius(radien, paarStaerken, deckel = 1) {
  const flaeche = radien.reduce((s, r) => s + r * r, 0);
  const W = paarStaerken.reduce((s, x) => s + x, 0);
  const g = zuwachs(W) * deckel;
  return { radius: Math.sqrt(flaeche * (1 + g)), summeRadius: Math.sqrt(flaeche), W, g };
}
