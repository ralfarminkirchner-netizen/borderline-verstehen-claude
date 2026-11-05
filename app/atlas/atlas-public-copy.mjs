// Presentation only: original records, source addresses and provenance stay intact.
// Deliberately no blanket replacement of "KI": it also means Konfidenzintervall.
const phrases = [
  [/Diese öffentliche Lernansicht verbindet einen tatsächlich erzeugten NotebookLM-Bericht mit transparenten redaktionellen Korrekturen und Verständnisfragen\. Sie ersetzt keine individuelle Abklärung oder Behandlung\./g, 'Trauma verstehen: Unterschiede, Schutz und Handlungsspielraum. Einordnungen und Verständnisfragen begleiten den Bericht. Er ersetzt keine individuelle Abklärung oder Behandlung.'],
  [/KI-(Audioübersicht|Videoübersicht|Gegenprüfungen|Gegenprüfung)/gi, '$1'],
  [/KI-Werkstatt/gi, 'Quellenwerkstatt'],
  [/KI-Gesprächen/gi, 'Arbeitsgesprächen'],
  [/KI-Gespräche/gi, 'Arbeitsgespräche'],
  [/KI-Werkzeuge/gi, 'Werkzeuge'],
  [/KI-bezogenen/gi, 'ergänzenden'],
  [/KI-Pseudoschrift/gi, 'Beschriftungen'],
  [/\bAI Studio\b/gi, 'Recherchezugang'],
  [/Google AI Studio wurde mit allgemeinen,[^\n]*?individuelle Krankheitsgeschichte ab\./g, 'Die Ansichten eröffnen mehrere Wege durch die Inhalte. Sie bilden keine Anatomie und keine individuelle Krankheitsgeschichte ab.'],
  [/Die frühere Startillustration wurde in Google AI Studio[^\n]*?in die App eingebaut\./g, 'Die Beziehungskarte erschließt vorhandene Atlaspassagen. Die Illustrationen sind keine medizinischen Abbildungen.'],
  [/NotebookLM hat 50 Karten erzeugt\. Alle wurden gelesen; 27 ausgewählte Karten wurden präzisiert und für diesen Lernzugang übernommen\. Die ursprüngliche KI-Ausgabe und die redaktionellen Korrekturen bleiben unterscheidbar\./g, '27 ausgewählte und präzisierte Lernkarten laden zum Wiederholen ein. Die ursprünglichen Formulierungen und die Korrekturen bleiben zugänglich.'],
  [/NotebookLM-Ausgaben, öffentliche Fachvermittlung und redaktionelle Lernansichten haben verschiedene Herkunft\. Fertig vorliegende Medien lassen sich hier direkt nutzen; der jeweilige Prüfstand steht am Medium\./g, 'Hören, sehen und Zusammenhänge entdecken. Die Medien lassen sich hier direkt nutzen; Quellen und inhaltliche Hinweise stehen am jeweiligen Beitrag.'],
  [/Die Recherchen wurden über das angemeldete Google-Konto[^\n]*?API-Betrieb wurde nicht eingerichtet\./g, 'Die Rechercheberichte erschließen die gesammelten Fragen und Quellen. Sie ersetzen keine Prüfung der Originalstudien.'],
  [/Eine tatsächlich erzeugte NotebookLM-Mindmap, ein redaktionell geprüfter Bericht und die zusätzliche Recherchewelle werden hier auf unterschiedliche Weise zugänglich\. Die interaktiven Ansichten sind Atlas-Entwicklungen\./g, 'Eine Baumkarte, ein inhaltlich geprüfter Bericht und weitere Recherchen eröffnen unterschiedliche Zugänge zu denselben Fragen.'],
  [/Ausgangspunkt: ein tatsächlich erzeugter NotebookLM-Bericht\. Die öffentliche Lernfassung wurde von Codex geprüft und redaktionell korrigiert\. Abschnittswechsel und Lernfragen sind daraus entwickelte Atlas-Interaktionen\./g, 'Der Bericht verbindet Quellen, Einordnungen und offene Fragen. Abschnittswechsel und Lernfragen helfen beim Erschließen.'],
  [/KI-generierter Bildimpuls/gi, 'Bildimpuls'],
  [/stumme KI-Illustrationen/gi, 'stumme Illustrationen'],
  [/keine automatisch geprüften NotebookLM-Ausgaben/gi, 'keine wissenschaftlich geprüften Darstellungen'],

  [/Die Audiofassung ist KI-generiert\.?/gi, ''],
  [/KI-(?:generierte[nmrs]?|Illustrationen)/gi, 'Bildmaterial'],
  [/KI-generiert/gi, 'erstellt'],
  [/KI-(Vorschlag|Antwort|Entwurf|Modellvorschlag|Ausgabe|Illustration|Vermittlung)/gi, '$1'],
  [/KI-redaktionell/gi, 'redaktionell'],
  [/keine KI- oder klinische Beurteilung/gi, 'keine klinische Beurteilung'],
  [/an keinen KI-Dienst/gi, 'an keinen externen Dienst'],
  [/an eine KI/gi, 'an einen externen Dienst'],
  [/automatischen? KI-Anschluss/gi, 'automatischen Versand'],
  [/KI-Dienst/gi, 'externen Dienst'],
  [/NotebookLM-Ausgaben/gi, 'Lernmaterialien'],
  [/NotebookLM-Ausgabe/gi, 'Ausgangsfassung'],
  [/NotebookLM-(?:Rohberichte|Berichte)/gi, 'Rechercheberichte'],
  [/NotebookLM-(?:Rohbericht|Bericht|Recherche)/gi, 'Recherchebericht'],
  [/NotebookLM-(?:Studio-)?Export/gi, 'Medienexport'],
  [/NotebookLM-Material/gi, 'Material'],
  [/NotebookLM-Lernkarte/gi, 'Lernkarte'],
  [/NotebookLM/gi, 'Quellenbestand'],
  [/(?:von|durch) Codex (?:geprüft|erstellt|entwickelt)/gi, 'inhaltlich bearbeitet'],
  [/Codex/gi, 'Redaktion'],
  [/Google AI Studio/gi, 'Recherchezugang'],
  [/Nano\s?Banana(?:\s+\d+)?(?:\s+Lite)?/gi, 'Bildwerkstatt'],
  [/Gemini(?:\s+\d+(?:\.\d+)?)?(?:\s+(?:Pro|Flash|Lite))?/gi, 'Recherchezugang'],
  [/ChatGPT/gi, 'Recherchezugang'],
  [/OpenAI/gi, 'externer Anbieter'],
  [/Ollama/gi, 'lokaler Anbieter'],
  [/\bKI\b(?=\s*[-–·:]\s*(?:generiert|redaktionell|Vorschlag|Ausgabe))/gi, 'Material'],
];

/** Use for text and search indexes, never for URLs, keys or data attributes. */
export function publicText(value) {
  let output = String(value ?? '');
  for (const [pattern, replacement] of phrases) output = output.replace(pattern, replacement);
  return output;
}

const excluded = 'script,style,textarea,input,select,option,code,pre,[contenteditable],[data-public-copy-preserve],[data-ac-settings],[data-ac-preview]';
const attributes = ['aria-label', 'aria-description', 'title', 'alt', 'placeholder'];
const observers = new WeakMap();

/** Also covers older renderers and lazy routes without mutating their records. */
export function preparePublicCopy(root) {
  if (!root) return;
  const visit = node => {
    const element = node.nodeType === 1 ? node : node.parentElement;
    if (element?.closest?.(excluded)) return;
    if (node.nodeType === 3) {
      // Preserve text-node boundary whitespace, e.g. text adjacent to a link.
      const source = node.nodeValue;
      if (!source.trim()) return;
      const result = publicText(source).trim();
      const next = result ? `${source.match(/^\s*/)[0]}${result}${source.match(/\s*$/)[0]}` : '';
      if (next !== source) node.nodeValue = next;
      return;
    }
    if (node.nodeType === 1) for (const name of attributes) {
      if (!node.hasAttribute(name)) continue;
      const before = node.getAttribute(name), after = publicText(before);
      if (after !== before) node.setAttribute(name, after);
    }
    for (const child of [...(node.childNodes || [])]) visit(child);
  };
  visit(root);
}

export function observePublicCopy(doc = globalThis.document) {
  if (!doc?.documentElement) return () => {};
  if (observers.has(doc)) return observers.get(doc);
  preparePublicCopy(doc.documentElement);
  const Observer = doc.defaultView?.MutationObserver;
  if (!Observer) return () => {};
  const observer = new Observer(records => {
    for (const record of records) {
      if (record.type === 'childList') for (const node of record.addedNodes) preparePublicCopy(node);
      else preparePublicCopy(record.target);
    }
  });
  observer.observe(doc.documentElement, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
  const stop = () => { observer.disconnect(); observers.delete(doc); };
  observers.set(doc, stop);
  return stop;
}

// Factual artwork caption; original provenance stays in the record and viewer.
export function artworkCredit(item) {
  return String(item.provenance || item.producer || item.originWork || '')
    .replace(/\s*Reproduktion von der Künstlerwebsite\.?/g, '')
    .split(' · ').filter(part => part !== item.title).join(' · ');
}
