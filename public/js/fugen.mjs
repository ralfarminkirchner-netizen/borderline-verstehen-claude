// Fugenarten: Name, Lesart, Grenze, Herkunft der Idee und Geometrie.
// Dieselbe Pfadgeometrie zeichnet die Karte (Canvas Path2D) und die Großansicht (SVG).

export const ARTEN = {
  annaeherung: {
    name: 'Annäherung', kurz: 'nähert sich',
    zeigt: 'Im Bestand werden beide als benachbart, ähnlich oder im selben Abschnitt genannt.',
    nicht: 'Nähe ist keine Gleichheit und keine Ursache.',
    idee: 'Linktyp „benannte Nähe“ im Vault, Brücke in WiRKGEFÜGE',
    farbe: '#3f6e5a',
  },
  abstand: {
    name: 'Abstand', kurz: 'ist zu unterscheiden von',
    zeigt: 'Der Bestand hält ausdrücklich fest: nicht dasselbe, verwechselbar, zu unterscheiden.',
    nicht: 'Unterscheiden heißt nicht unvereinbar.',
    idee: 'Linktyp „nicht dasselbe“ im Vault, Hermes „zu unterscheiden“',
    farbe: '#5b5f8a',
  },
  spannung: {
    name: 'Spannung', kurz: 'steht in Spannung zu',
    zeigt: 'Im Original als Gegenpol beschrieben; beide ziehen in unterschiedliche Richtungen.',
    nicht: 'Spannung ist kein Konflikt zwischen Personen und kein Fehler.',
    idee: 'WiRKGEFÜGE „steht in Spannung zu“; Zickzack der Reibung aus DAS DAZWISCHEN (Zusammenführung, unversioniert)',
    farbe: '#a0522d',
  },
  widerspruch: {
    name: 'Widerspruch', kurz: 'widerspricht',
    zeigt: 'Ein Gegenbeispiel oder Einwand steht gegen eine Aussage.',
    nicht: 'Ein Einwand bleibt lokal; er widerlegt nicht das Ganze.',
    idee: 'Einwand in Grok „Fugenfassung“ 0.2, Gegenbeispiel im Bestand',
    farbe: '#9a2f2f',
  },
  bedingung: {
    name: 'Bedingung', kurz: 'setzt voraus',
    zeigt: 'Im Modell als Voraussetzung oder Begründung angegeben.',
    nicht: 'Eine Bedingung ist keine Ursache und keine Erlaubnis.',
    idee: 'Bedingung/Schwelle in Grok, WiRKGEFÜGE und Cursor-Phänomenkörper',
    farbe: '#7a6420',
  },
  folge: {
    name: 'Zeitliche Folge', kurz: 'folgt auf',
    zeigt: 'Eine Abfolge: hervorgegangen aus, zeitversetzt. Bei „hervorgegangen aus“ zeigt die Spitze auf den Ursprung.',
    nicht: 'Eine Abfolge ist kein Schluss und kein Beweis.',
    idee: 'Zeit in WiRKGEFÜGE, „drei Zeiten“ in Grok, zeitliche Folge bei Cursor',
    farbe: '#4f6f85',
  },
  uebergang: {
    name: 'Gerichteter Übergang', kurz: 'ist im Modell gerichtet auf',
    zeigt: 'Im Originalgraph als Behandlungs-, Regulations- oder Zielbezug eingetragen, meist ohne eigene Quelle.',
    nicht: 'Kein Wirksamkeitsnachweis, keine Indikation, keine Behandlungsempfehlung.',
    idee: 'Gerichtete Veränderung im Cursor-Phänomenkörper, Richtung in WiRKGEFÜGE',
    farbe: '#2f5f7a',
  },
  gegenseitig: {
    name: 'Gegenseitigkeit', kurz: 'und zurück',
    zeigt: 'Beide Richtungen sind im Bestand als eigene Aussagen vorhanden.',
    nicht: 'Gegenseitigkeit wird nie automatisch angenommen; jede Richtung hat ihren eigenen Grund.',
    idee: 'Richtung und Gegenrichtung als zwei Aussagen (Grok, WiRKGEFÜGE)',
    farbe: '#5a4a7a',
  },
  offen: {
    name: 'Offenes Dazwischen', kurz: 'öffnet eine Frage zu',
    zeigt: 'Beide werden in einer Forschungsarbeit gemeinsam untersucht oder als Frage geöffnet; ein Ergebnis ist damit nicht behauptet.',
    nicht: 'Gemeinsam untersucht heißt nicht: zusammenhängend.',
    idee: '„ungeklärt“ und Leerwerte in Grok und „Fuge der Relationen“ 0.2',
    farbe: '#6d6457',
  },
  unterbrechung: {
    name: 'Unterbrechung', kurz: 'ist unterbrochen von',
    zeigt: 'Eine Verbindung, die abbricht oder ausgesetzt ist.',
    nicht: 'Eine Unterbrechung ist kein Ende.',
    idee: 'Bruch (↯) in WiRKGEFÜGE; gekittete Bruchstelle in DAS DAZWISCHEN (Zusammenführung, unversioniert), die keine Heilung behauptet',
    farbe: '#7a5a3a', nurEigen: true,
  },
  nichtverbindung: {
    name: 'Nichtverbindung', kurz: 'ist ausdrücklich nicht verbunden mit',
    zeigt: 'Hier wird bewusst keine Verbindung gezogen.',
    nicht: 'Nichtverbindung ist eine Aussage, keine Lücke.',
    idee: 'Nichtverbindung in WiRKGEFÜGE (Arme enden bei 45 %)',
    farbe: '#444',
    nurEigen: true,
  },
  aussage: {
    name: 'Belegte Einzelaussage', kurz: 'nach einer Quelle',
    zeigt: 'Eine Aussage aus einer genannten Studie oder Quelle, im Wortlaut des Bestands.',
    nicht: 'Gilt für die untersuchte Gruppe und Bedingung; kein Versprechen für Einzelne und keine Behandlungsempfehlung.',
    idee: 'Quellengebundene Aussagen des Bestands; Stützung in Grok „Fugenfassung“ 0.2',
    farbe: '#2b2620',
  },
  zusammenhang: {
    name: 'Statistischer Zusammenhang', kurz: 'hängt statistisch zusammen mit',
    zeigt: 'Eine Quelle berichtet einen statistischen Zusammenhang zwischen beiden.',
    nicht: 'Ein Zusammenhang ist keine Ursache, keine Vorhersage für Einzelne und keine Nähe im Erleben.',
    idee: 'Unterscheidung von Stützung und Folgerung in Grok „Fugenfassung“ 0.2',
    farbe: '#3d5c6e',
  },
  begrenzung: {
    name: 'Begrenzung', kurz: 'begrenzt',
    zeigt: 'Die Quelle begrenzt eine zu starke Lesart der anderen Aussage.',
    nicht: 'Eine Begrenzung widerlegt nicht und ersetzt keine Erklärung.',
    idee: 'Geltungsachse und „folgt nicht“ in Grok „Fugenfassung“ 0.2',
    farbe: '#6e4a2e',
  },
  einordnung: {
    name: 'Einordnung', kurz: 'gehört zu',
    zeigt: 'Gehört zu, beschrieben in, Kontext: die Ordnung des Originalbestands.',
    nicht: 'Einordnung ist keine inhaltliche Beziehung.',
    idee: 'Originalkanten des Atlasbestands',
    farbe: '#8c8273',
  },
};

export const GELTUNG = {
  quelle: { name: 'mit Quelle', text: 'Die Beziehung nennt eine Quelle im Bestand.' },
  original: { name: 'aus dem Originalbestand', text: 'Übernommen aus einem Originalgraphen; dort ohne eigene Quellenangabe.' },
  redaktionell: { name: 'redaktionell vorgeschlagen', text: 'Von der Redaktion vorgeschlagen und nicht fachlich geprüft; keine fachliche Feststellung.' },
  offen: { name: 'offen', text: 'Eine offene Frage. Ob und wie beides zusammenhängt, ist nicht geklärt.' },
  persoenlich: { name: 'persönlich', text: 'Deine eigene Zuordnung. Sie bleibt auf diesem Gerät.' },
  kuenstlerisch: { name: 'künstlerisch', text: 'Eine Bildzuordnung als Anregung, keine Deutung des Werks.' },
};

export const LESEBEWEGUNGEN = [
  { id: 'neben', name: 'neben', frage: 'Was zeigt sich, wenn beide gleichrangig nebeneinander stehen?' },
  { id: 'gegen', name: 'gegen', frage: 'Wo widersprechen sie sich, wo reiben sie?' },
  { id: 'durch', name: 'durch', frage: 'Wie sieht das eine aus, durch das andere gelesen?' },
  { id: 'fehlt', name: 'fehlt', frage: 'Welche dritte Stimme fehlt hier?' },
  { id: 'kippt', name: 'kippt', frage: 'Wo kippt die Verbindung, wo bricht sie?' },
  { id: 'takt', name: 'takt', frage: 'Was bewegt sich bei beiden gemeinsam?' },
];
export const LESEBEWEGUNGEN_HERKUNFT = 'Die sechs Lesebewegungen stammen aus dem ChatGPT-Entwurf „FUGE“ (Juli 2026); Codex hat sie in „FUGEN“ als Leseweisen übernommen.';

// Geometrie: Pfad von (x1,y1) nach (x2,y2). s = Maßstab für Ornamente (Pixel).
export function fugenPfad(art, x1, y1, x2, y2, s = 1) {
  const dx = x2 - x1; const dy = y2 - y1; const L = Math.hypot(dx, dy) || 1;
  const ux = dx / L; const uy = dy / L; const nx = -uy; const ny = ux;
  const P = (t, o = 0) => [x1 + dx * t + nx * o, y1 + dy * t + ny * o];
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const bow = Math.min(L * 0.18, 60 * s);
  switch (art) {
    case 'annaeherung': {
      // zwei Bögen, die sich in der Mitte treffen
      const m = P(0.5); const c1 = P(0.25, bow); const c2 = P(0.75, bow);
      const d1 = P(0.25, -bow); const d2 = P(0.75, -bow);
      return `M${f(P(0))} Q${f(c1)} ${f(m)} Q${f(c2)} ${f(P(1))} M${f(P(0))} Q${f(d1)} ${f(m)} Q${f(d2)} ${f(P(1))}`;
    }
    case 'abstand': {
      const o = 3.2 * s; const g0 = 0.42; const g1 = 0.58;
      const tick = (t) => `M${f(P(t, -7 * s))} L${f(P(t, 7 * s))}`;
      return `M${f(P(0, o))} L${f(P(g0, o))} M${f(P(0, -o))} L${f(P(g0, -o))} M${f(P(g1, o))} L${f(P(1, o))} M${f(P(g1, -o))} L${f(P(1, -o))} ${tick(g0)} ${tick(g1)}`;
    }
    case 'spannung': {
      const n = Math.max(6, Math.round(L / (14 * s))); let d = `M${f(P(0))}`;
      for (let i = 1; i < n; i++) d += ` L${f(P(i / n, (i % 2 ? 1 : -1) * 5 * s))}`;
      return `${d} L${f(P(1))}`;
    }
    case 'widerspruch': {
      // zwei Linien, die frontal mit Zähnen aufeinandertreffen
      const a = P(0.47); const b = P(0.53);
      const t1 = `M${f(P(0.47, 0))} L${f(P(0.43, 7 * s))} M${f(P(0.47, 0))} L${f(P(0.43, -7 * s))}`;
      const t2 = `M${f(P(0.53, 0))} L${f(P(0.57, 7 * s))} M${f(P(0.53, 0))} L${f(P(0.57, -7 * s))}`;
      return `M${f(P(0))} L${f(a)} ${t1} M${f(P(1))} L${f(b)} ${t2}`;
    }
    case 'bedingung': {
      const w = 7 * s; const a = P(0.44); const b = P(0.56);
      return `M${f(P(0))} L${f(a)} M${f(P(0.44, -w))} L${f(P(0.44, w))} L${f(P(0.56, w))} L${f(P(0.56, -w))} Z M${f(b)} L${f(P(1))}`;
    }
    case 'folge': {
      // Trittsteine mit kleiner werdender Lücke Richtung Ziel
      let d = '';
      const n = Math.max(4, Math.round(L / (22 * s)));
      for (let i = 0; i < n; i++) {
        const t0 = (i + 0.15) / n; const t1 = (i + 0.7) / n;
        d += `M${f(P(t0))} L${f(P(t1))} `;
      }
      const tip = P(0.96); return `${d}M${f(P(0.9, 5 * s))} L${f(tip)} L${f(P(0.9, -5 * s))}`;
    }
    case 'uebergang': {
      const c = P(0.5, bow * 0.5); let d = `M${f(P(0))} Q${f(c)} ${f(P(1))}`;
      for (const t of [0.3, 0.5, 0.7]) {
        const p = P(t, bow * 0.5 * 4 * t * (1 - t));
        d += ` M${f([p[0] - ux * 6 * s + nx * 5 * s, p[1] - uy * 6 * s + ny * 5 * s])} L${f(p)} L${f([p[0] - ux * 6 * s - nx * 5 * s, p[1] - uy * 6 * s - ny * 5 * s])}`;
      }
      return d;
    }
    case 'gegenseitig': {
      const o = 3.5 * s;
      const head = (t, dir) => { const p = P(t, dir * o); return `M${f([p[0] - dir * ux * 6 * s + nx * 4 * s, p[1] - dir * uy * 6 * s + ny * 4 * s])} L${f(p)} L${f([p[0] - dir * ux * 6 * s - nx * 4 * s, p[1] - dir * uy * 6 * s - ny * 4 * s])}`; };
      return `M${f(P(0, o))} L${f(P(1, o))} M${f(P(1, -o))} L${f(P(0, -o))} ${head(0.62, 1)} ${head(0.38, -1)}`;
    }
    case 'offen': {
      // keine Linie: eine linsenförmige offene Fläche zwischen beiden (Umriss)
      const a = P(0.2); const b = P(0.8);
      return `M${f(a)} Q${f(P(0.5, bow))} ${f(b)} Q${f(P(0.5, -bow))} ${f(a)} Z`;
    }
    case 'aussage': {
      // durchgezogen, mit einem Belegzeichen (Raute) in der Mitte
      const m = P(0.5); const w = 5 * s;
      return `M${f(P(0))} L${f(P(1))} M${f([m[0] - ux * w, m[1] - uy * w])} L${f([m[0] + nx * w, m[1] + ny * w])} L${f([m[0] + ux * w, m[1] + uy * w])} L${f([m[0] - nx * w, m[1] - ny * w])} Z`;
    }
    case 'zusammenhang': {
      // weiche Welle: gemeinsame Schwankung, keine Richtung
      const n = Math.max(3, Math.round(L / (26 * s))); let d = `M${f(P(0))}`;
      for (let i = 0; i < n; i++) d += ` Q${f(P((i + 0.5) / n, (i % 2 ? -1 : 1) * 7 * s))} ${f(P((i + 1) / n))}`;
      return d;
    }
    case 'begrenzung': {
      // Linie endet vor dem Ziel an einer Schranke
      return `M${f(P(0))} L${f(P(0.78))} M${f(P(0.78, -8 * s))} L${f(P(0.78, 8 * s))} M${f(P(0.86, -4 * s))} L${f(P(0.86, 4 * s))}`;
    }
    case 'unterbrechung': {
      return `M${f(P(0))} L${f(P(0.42))} M${f(P(0.42, -6 * s))} L${f(P(0.42, 6 * s))} M${f(P(0.58, -6 * s))} L${f(P(0.58, 6 * s))} M${f(P(0.58))} L${f(P(1))}`;
    }
    case 'nichtverbindung': {
      const cap = (t) => `M${f(P(t, -5 * s))} L${f(P(t, 5 * s))}`;
      return `M${f(P(0))} L${f(P(0.3))} ${cap(0.3)} M${f(P(1))} L${f(P(0.7))} ${cap(0.7)} M${f(P(0.47, -4 * s))} L${f(P(0.53, 4 * s))} M${f(P(0.47, 4 * s))} L${f(P(0.53, -4 * s))}`;
    }
    default:
      return `M${f(P(0))} L${f(P(1))}`;
  }
}

// Linienstil je Geltung (Strichart), unabhängig von der Form der Fugenart.
export function strich(geltung, s = 1) {
  switch (geltung) {
    case 'redaktionell': return { dash: [5 * s, 3 * s], width: 1.3 };
    case 'offen': return { dash: [2 * s, 4 * s], width: 1.2 };
    case 'persoenlich': return { dash: [], width: 2.2, farbe: '#1f4fa8' };
    case 'original': return { dash: [], width: 1.2 };
    default: return { dash: [], width: 1.7 };
  }
}

// Gegenseitigkeit nur bei gerichteten Arten, die im Bestand in beiden Richtungen vorkommen.
// Symmetrische Arten (Abstand, Spannung, Annäherung …) behalten ihre Form; die zweite Aussage bleibt sichtbar.
export function fugenArt(fuge) {
  return fuge.gegen !== undefined && fuge.gegenGleich && ['uebergang', 'folge', 'bedingung'].includes(fuge.art) ? 'gegenseitig' : fuge.art;
}

// Kleines Zeichen der Fugenart für Schaltflächen und Legenden (SVG-Markup).
export function zeichen(art, w = 56, h = 18, farbe) {
  const d = fugenPfad(art, 4, h / 2, w - 4, h / 2, 0.8);
  const fill = art === 'offen' ? `fill="url(#schraffur)"` : 'fill="none"';
  return `<svg class="zeichen" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><path d="${d}" ${fill} stroke="${farbe || ARTEN[art]?.farbe || '#333'}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
