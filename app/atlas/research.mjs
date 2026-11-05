import { renderResearchProgram } from './research-program.mjs?v=20261102-recherche';

export const notebookResearch = {
  title: 'Quellenprüfung aus dem bestehenden Notebook',
  introduction: 'Bestehendes Notebook „Borderline-Persönlichkeitsstörung“ · Recherche vom 2. November 2026',
  notebookURL: 'https://notebook.google.com/notebook/c533f807-9698-43af-bd29-cea37a38bc30',
  status: {
    researchCompleted: true,
    citedResults: 22,
    importedSources: 9,
    failedSourceImports: 1,
    reportImported: true,
    importVerified: true,
    importDescription: 'Bericht und neun abrufbare Webquellen ergänzt; ein weiterer Volltextimport fehlgeschlagen.',
  },
  cards: [
    {
      title: 'Leitlinie: Aktualisierung angemeldet',
      summary: 'Die Meldung von Juni 2026 kündigt eine Überarbeitung an. Eine verabschiedete Neufassung ist damit nicht belegt.',
      details: [
        'Die AWMF bezeichnet ihren Eintrag vom 17. Juni 2026 ausdrücklich als Anmeldung der Version 2.0. Eine Anmeldung beschreibt ein geplantes Leitlinienvorhaben; sie enthält noch keine verabschiedeten neuen Behandlungsempfehlungen. Die Fassung von 2022 ist im Register als abgelaufen gekennzeichnet. Ihr Veröffentlichungsjahr und der aktuelle Registerstatus gehören deshalb zusammen.',
        'Für diesen Atlas wurde mit der Anmeldung keine neue gültige Leitlinienfassung nachgewiesen. Aussagen über eine bereits veröffentlichte „Leitlinie 2026“ lassen sich daraus nicht ableiten. Die Anmeldung kann zum aktuellen Stand der Überarbeitung führen; konkrete Empfehlungen müssen weiterhin an der jeweils bezeichneten Originalfassung und ihrem Gültigkeitsstand geprüft werden.',
      ],
      sources: [
        { label: 'AWMF: Anmeldung der Aktualisierung', url: 'https://www.awmf.org/aktuelles/awmf-aktuell/borderline-persoenlichkeitsstoerung-1' },
        { label: 'AWMF: Eintrag im Leitlinienregister', url: 'https://register.awmf.org/de/leitlinien/detail/038-015' },
      ],
      atlasLink: { label: 'Weiter im Atlas: Therapien', url: '#therapien' },
    },
    {
      title: 'Angehörige: Was Family Connections zeigt',
      summary: 'Die randomisierte Studie von 2024 zeigte nach der Behandlung keine gesicherte Überlegenheit gegenüber dem aktiven Vergleichsprogramm.',
      details: [
        '2024 wurden 121 Angehörige untersucht: 63 mit Family Connections und 58 im Vergleichsprogramm. Beide Programme umfassten zwölf zweistündige Sitzungen. Verbesserungen innerhalb einer Gruppe belegen noch keinen Vorteil gegenüber der anderen. Nach sechs Monaten weist das Flussdiagramm nur 37 Teilnehmende aus: 25 und 12. Die im Text genannten 41,6 Prozent Ausfälle passen dazu nicht; bezogen auf die anfangs 121 fehlen 69,4 Prozent.',
        'Die naturalistische Untersuchung von 2026 verglich 141 Teilnehmende in Präsenz mit 27 online, ohne Zufallszuweisung. Fehlende statistisch signifikante Unterschiede bei Belastung und Depression beweisen keine gleiche Wirksamkeit. Unterschiede der Ausgangslage und die kleine Onlinegruppe begrenzen den Vergleich.',
      ],
      sources: [
        { label: 'Originalstudie: Family Connections, 2024', url: 'https://onlinelibrary.wiley.com/doi/full/10.1111/famp.13089' },
        { label: 'Originalstudie: Online und Präsenz, 2026', url: 'https://link.springer.com/article/10.1186/s40479-026-00341-7' },
      ],
      atlasLink: { label: 'Weiter im Atlas: Angehörige', url: '#angehoerige' },
    },
    {
      title: 'Entwicklung: Mehrere Einflüsse zusammendenken',
      summary: '106 Studien mit 86.871 Teilnehmenden ergeben keinen gesicherten Vorrang einer einzelnen untersuchten Risikodomäne.',
      details: [
        'Die Meta-Analyse fasst prospektive Untersuchungen zur Entwicklung von Borderline-Symptomen zusammen. Im geprüften Originalabstract werden 106 Studien mit insgesamt 86.871 Teilnehmenden genannt. Zwischen den untersuchten Risikodomänen wurde kein statistisch gesicherter Unterschied ihrer Vorhersagestärke gefunden. Daraus folgt weder, dass alle Einflüsse gleich stark wirken, noch dass ihre Bedeutung für jede einzelne Person gleich ist.',
        'Die Prüfung blieb hier auf das Originalabstract begrenzt. Eine Rangfolge der wichtigsten Schutzfaktoren ist damit nicht belegt. Ebenso lässt sich daraus keine individuelle Ursache oder Prognose ableiten. Für den Atlas stützt die Quelle eine Betrachtung mehrerer Entwicklungsbedingungen; weitergehende Gewichtungen benötigen eine Prüfung des vollständigen Originalartikels.',
      ],
      sources: [
        { label: 'Originalabstract: Meta-Analyse zur Entwicklung, 2024', url: 'https://pubmed.ncbi.nlm.nih.gov/39243819/' },
      ],
      atlasLink: { label: 'Weiter im Atlas: Entwicklung', url: '#entwicklung' },
    },
    {
      title: 'Körper und Bewegung: Ein kleiner Versuch',
      summary: 'Nach Radfahren oder einem neutralen Video nahm der negative Affekt in beiden Gruppen ab; ein Vorteil der Bewegung wurde nicht nachgewiesen.',
      details: [
        'St-Amour und Kolleg:innen untersuchten 2022 insgesamt 28 Personen. Nach einer Belastungsaufgabe folgten entweder 20 Minuten Radfahren oder ein neutrales Video. Beide Gruppen zeigten anschließend Verbesserungen; ein statistisch gesicherter Vorteil der Bewegung gegenüber der Vergleichsbedingung wurde nicht gefunden. Die kleine Stichprobe und die einmalige Untersuchung begrenzen die Aussagekraft.',
        'Die Studie belegt keine langfristige Wirkung und erlaubt keine Verallgemeinerung auf jedes Bewegungsangebot oder jede Belastungssituation. Es wurden keine der Bewegung zugeschriebenen unerwünschten Wirkungen berichtet; bei dieser Größe und Dauer ist das kein umfassender Sicherheitsnachweis. Körperbezogene Möglichkeiten können im Atlas als vorsichtig zu erkundende Unterstützung erscheinen; ein gesicherter spezifischer Behandlungseffekt lässt sich aus diesem Versuch nicht ableiten.',
      ],
      sources: [
        { label: 'Originalstudie: St-Amour und Kolleg:innen, 2022', url: 'https://cpe.psychopen.eu/index.php/cpe/article/view/7495' },
      ],
      atlasLink: { label: 'Weiter im Atlas: Therapien', url: '#therapien' },
    },
  ],
  review: {
    title: 'Wie der Bericht geprüft wurde',
    paragraphs: [
      'Der neue Deep-Research-Bericht dient als Suchhilfe. Seine 22 zitierten Treffer sind keine 22 einzeln geprüften Fachquellen. Die Treffer enthalten unterschiedliche Quellentypen; für die Aussagen oben wurden die verlinkten Originalquellen herangezogen. Bei der Entwicklungsübersicht blieb die Prüfung auf das Originalabstract begrenzt.',
      'Widersprüche zwischen Bericht und Original sowie Grenzen der Studien bleiben sichtbar. Frühere Berichte und weitere Inhalte des bestehenden Notebooks wurden dadurch nicht pauschal bestätigt. Dieser Block dokumentiert den angegebenen Recherchezeitpunkt; es gibt keine laufende Synchronisierung mit NotebookLM.',
    ],
  },
};

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

const paragraphs = (items) => items.map((paragraph) => `<p>${escapeHTML(paragraph)}</p>`).join('');

const externalLink = ({ label, url }) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)}</a>`;

const renderCard = (card) => `<details class="research-card"><summary><span class="research-card-title">${escapeHTML(card.title)}</span><span class="research-card-summary">${escapeHTML(card.summary)}</span></summary><div class="research-card-body">${paragraphs(card.details)}<ul class="research-source-links">${card.sources.map((source) => `<li>${externalLink(source)}</li>`).join('')}</ul><p class="research-atlas-link"><a href="${escapeHTML(card.atlasLink.url)}">${escapeHTML(card.atlasLink.label)}</a></p></div></details>`;

export function renderNotebookResearch({ reading = false } = {}) {
  const { status } = notebookResearch;
  const researchStatus = status.researchCompleted
    ? `Recherche im bestehenden Notebook abgeschlossen · ${status.citedResults} zitierte Treffer`
    : 'Recherche im bestehenden Notebook noch nicht abgeschlossen';
  const importContents = `${status.importedSources} ausgewählte Fachquellen${status.reportImported ? ' und der Bericht' : ''}`;
  const importStatus = status.importVerified
    ? status.importDescription || `Import bestätigt: ${importContents}.`
    : `Import angegeben: ${importContents}. Die Bestätigung des Imports ist noch offen.`;

  return `${renderResearchProgram({ reading })}<section class="notebook-research${reading ? ' notebook-research-reading' : ''}"><h2>${escapeHTML(notebookResearch.title)}</h2><p class="research-intro">${escapeHTML(notebookResearch.introduction)}</p><details class="research-disclosure"><summary>Vier Gegenprüfungen und ihre Quellen ansehen</summary><div class="research-content"><p class="research-status">${escapeHTML(researchStatus)}</p><p class="research-import-status">${escapeHTML(importStatus)}</p><p>${externalLink({ label: 'Bestehendes Notebook öffnen', url: notebookResearch.notebookURL })}</p><div class="research-grid">${notebookResearch.cards.map(renderCard).join('')}</div><details class="research-review"><summary>${escapeHTML(notebookResearch.review.title)}</summary>${paragraphs(notebookResearch.review.paragraphs)}</details></div></details></section>`;
}
