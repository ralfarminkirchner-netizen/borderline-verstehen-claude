import { dossierPhenomena } from './dossier-data.mjs';

// Snapshot of the completed notebook collection, 2 November 2026.
// Editorial reading paths assert no clinical mechanism.
// Source: recherche-20261102/GESTARTETE-NOTEBOOKS.json. No live synchronization.
export const researchPaths = [
  {
    "slug": "persoenlichkeit",
    "title": "Persönlichkeit · Dimensionen und Funktion",
    "question": "Was lässt sich über Selbstbild, Beziehungen und Handlungsmacht beschreiben, wenn Diagnosekategorien um Dimensionen ergänzt werden?",
    "url": "https://notebook.google.com/notebook/e623833d-07f9-42e3-a621-6047d76ed6d8",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-003",
      "phenomenon:bpd:bps-ph-026",
      "phenomenon:bpd:bps-ph-020"
    ]
  },
  {
    "slug": "entwicklungstrauma",
    "title": "Entwicklungstrauma und Vernachlässigung",
    "question": "Welche frühen Belastungen wurden tatsächlich untersucht, wie verlief die Entwicklung und welche anderen Erklärungen wurden geprüft?",
    "url": "https://notebook.google.com/notebook/478b7c51-a3c1-4030-9c27-a57fa9ab30b1",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-054",
      "phenomenon:bpd:bps-ph-025",
      "phenomenon:bpd:bps-ph-084"
    ]
  },
  {
    "slug": "bindung",
    "title": "Bindungstrauma und Beziehungssicherheit",
    "question": "Wie werden Bindungsangst, Vermeidung und Beziehungssicherheit untersucht, ohne Menschen auf Bindungstypen festzulegen?",
    "url": "https://notebook.google.com/notebook/e356a779-1fca-4475-9ed5-39ed07644337",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-030",
      "phenomenon:bpd:bps-ph-031",
      "phenomenon:bpd:bps-ph-033"
    ]
  },
  {
    "slug": "ursachen-pruefen",
    "title": "Trauma und Persönlichkeit · Ursachen prüfen",
    "question": "Was können prospektive Verläufe, Familien- und genetisch informative Studien über Ursachen sagen – und wo bleiben Zusammenhänge offen?",
    "url": "https://notebook.google.com/notebook/d19ea20b-8fa4-4440-80d1-098ea8b651a3",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-006",
      "phenomenon:bpd:bps-ph-025",
      "phenomenon:bpd:bps-ph-026"
    ]
  },
  {
    "slug": "borderline-komplexe-ptbs",
    "title": "Borderline und komplexe PTBS",
    "question": "Welche Erfahrungen überschneiden sich bei Borderline, PTBS und komplexer PTBS, und wodurch lassen sich ihre Verläufe unterscheiden?",
    "url": "https://notebook.google.com/notebook/35f966ca-86e4-45f1-9ee1-3da6c0f77b6f",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-006",
      "phenomenon:bpd:bps-ph-051",
      "phenomenon:bpd:bps-ph-007"
    ]
  },
  {
    "slug": "narzissmus",
    "title": "Narzissmus · Verletzlichkeit und Überschneidungen",
    "question": "Wie hängen verletzlicher Selbstwert, Scham und Beziehungserleben zusammen? Welche Überschneidungen sind belegt und welche Unterscheidungen bleiben tragfähig?",
    "url": "https://notebook.google.com/notebook/e8a68cb4-935e-49b4-ada5-5da24891f6e8",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-020",
      "phenomenon:bpd:bps-ph-012",
      "phenomenon:bpd:bps-ph-045",
      "phenomenon:bpd:bps-ph-043"
    ]
  },
  {
    "slug": "scham-selbstwert",
    "title": "Scham, Selbstwert und Identität",
    "question": "Wie unterscheiden Studien Scham, Schuld, Selbstkritik und Identitätsunsicherheit – auch jenseits einzelner Diagnosen?",
    "url": "https://notebook.google.com/notebook/ebbc9008-4ca5-47df-8de1-64e068486961",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-012",
      "phenomenon:bpd:bps-ph-013",
      "phenomenon:bpd:bps-ph-021",
      "phenomenon:bpd:bps-ph-003"
    ]
  },
  {
    "slug": "dissoziation",
    "title": "Dissoziation, Wahrnehmung und Zeit",
    "question": "Wie lassen sich Depersonalisation, Erinnerungslücken, Erstarrung und verändertes Zeiterleben auseinanderhalten und untersuchen?",
    "url": "https://notebook.google.com/notebook/08aa9bd7-af74-4f79-a8e4-61000fe01805",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-049",
      "phenomenon:bpd:bps-ph-052",
      "phenomenon:bpd:bps-ph-053",
      "phenomenon:bpd:bps-ph-051"
    ]
  },
  {
    "slug": "mentalisieren",
    "title": "Mentalisierung und epistemisches Vertrauen",
    "question": "Unter welchen Bedingungen verändern sich das Verstehen eigener und fremder Zustände und das Vertrauen in mitgeteiltes Wissen?",
    "url": "https://notebook.google.com/notebook/1a8a71d2-c1ec-41de-a7df-c25e98fc944a",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-035",
      "phenomenon:bpd:bps-ph-040",
      "phenomenon:bpd:bps-ph-041",
      "phenomenon:bpd:bps-ph-042"
    ]
  },
  {
    "slug": "neurodivergenz",
    "title": "ADHS, Autismus, Trauma und Masking",
    "question": "Welche Entwicklungsverläufe und Belastungen helfen, ADHS, Autismus, Trauma und Persönlichkeitsdiagnosen differenziert zu betrachten?",
    "url": "https://notebook.google.com/notebook/f64b8e4a-b53f-4fc7-a3bc-74e7eae7ee13",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-061",
      "phenomenon:bpd:bps-ph-024",
      "phenomenon:bpd:bps-ph-081"
    ]
  },
  {
    "slug": "vermeidung-abhaengigkeit",
    "title": "Vermeidung, Abhängigkeit und Zwanghaftigkeit",
    "question": "Was unterscheidet schützenden Rückzug, abhängige Muster und zwanghafte Kontrolle – und wann überschneiden sich ihre Beschreibungen?",
    "url": "https://notebook.google.com/notebook/341a9a9b-ff25-41ad-8a1c-e41ad8410b4d",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-031",
      "phenomenon:bpd:bps-ph-037",
      "phenomenon:bpd:bps-ph-036"
    ]
  },
  {
    "slug": "parentifizierung",
    "title": "Parentifizierung und Generationen",
    "question": "Wie werden übernommene Verantwortung, Invalidierung, Familienmacht und generationenübergreifende Einflüsse untersucht, ohne Schuldgeschichten zu vereinfachen?",
    "url": "https://notebook.google.com/notebook/673eafcc-ccb8-48b3-8a10-0d42c5165be3",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-013",
      "phenomenon:bpd:bps-ph-021",
      "phenomenon:bpd:bps-ph-026"
    ]
  },
  {
    "slug": "koerper-schlaf",
    "title": "Körper, Interozeption, Schlaf und Stress",
    "question": "Wie genau wurden Körperwahrnehmung, Schmerz, Schlaf und Stress gemessen? Welche körperlichen Erklärungen und Gegenbefunde werden berücksichtigt?",
    "url": "https://notebook.google.com/notebook/bbad9804-0670-46b3-a6c8-5cb9cc8b1ba5",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-057",
      "phenomenon:bpd:bps-ph-056",
      "phenomenon:bpd:bps-ph-064",
      "phenomenon:bpd:bps-ph-065"
    ]
  },
  {
    "slug": "handlungsspielraum",
    "title": "Handlungsspielraum, Schutz und Resilienz",
    "question": "Welche Bedingungen tragen zu Handlungsmacht, Schutz und erlernten Fähigkeiten bei, und was bedeutet Resilienz im jeweiligen Lebenskontext?",
    "url": "https://notebook.google.com/notebook/d8e51ba0-74af-4499-9991-1ce1f56f0184",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-026",
      "phenomenon:bpd:bps-ph-085",
      "phenomenon:bpd:bps-ph-088"
    ]
  },
  {
    "slug": "traumabehandlung",
    "title": "Traumabehandlung · Reihenfolge und Wirksamkeit",
    "question": "Für welche Menschen und Ziele wurden integrierte, gestufte oder unmittelbar traumafokussierte Behandlungen verglichen – mit welchen Risiken und Grenzen?",
    "url": "https://notebook.google.com/notebook/ab9a1e14-d571-4653-b492-102c4519bef5",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-085",
      "phenomenon:bpd:bps-ph-073",
      "phenomenon:bpd:bps-ph-054"
    ]
  },
  {
    "slug": "angehoerige",
    "title": "Angehörige, Grenzen und Beziehungsreparatur",
    "question": "Was wissen wir über Angehörigenangebote, Grenzen und Reparatur nach Konflikten? Welche Folgen wurden für alle Beteiligten untersucht?",
    "url": "https://notebook.google.com/notebook/d3b85d28-9cbc-4433-be58-85a0eed58c30",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-034",
      "phenomenon:bpd:bps-ph-079",
      "phenomenon:bpd:bps-ph-086"
    ]
  },
  {
    "slug": "macht-schutz",
    "title": "Macht, aktuelle Gewalt und Beziehungsschutz",
    "question": "Wie unterscheiden sich aktuelle Gewalt, Kontrolle und Abhängigkeit von erinnerungsbezogenem Beziehungsalarm, und welche Schutzmöglichkeiten wurden untersucht?",
    "url": "https://notebook.google.com/notebook/d006cc7d-69ea-4b80-bd65-d8a8bde7f512",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-034",
      "phenomenon:bpd:bps-ph-070",
      "phenomenon:bpd:bps-ph-079"
    ]
  },
  {
    "slug": "co-regulation",
    "title": "Co-Regulation, Autonomie und Unterstützungskosten",
    "question": "Wann wird gemeinsame Regulation hilfreich erlebt, wann kostet Unterstützung zu viel und wie bleiben Autonomie und Grenzen erhalten?",
    "url": "https://notebook.google.com/notebook/abb7040f-4691-4b32-ba97-c247c089cd2c",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-037",
      "phenomenon:bpd:bps-ph-086",
      "phenomenon:bpd:bps-ph-085",
      "phenomenon:bpd:bps-ph-063"
    ]
  },
  {
    "slug": "diagnose-kontext",
    "title": "Diagnose, Kultur, Geschlecht und Evidenz",
    "question": "Wie beeinflussen Kultur, Geschlecht, Normen und Versorgung die Diagnose? Welche Begriffe halten einem Quellencheck stand, ohne Vielfalt zu pathologisieren?",
    "url": "https://notebook.google.com/notebook/12076ce0-8dc4-4054-bdbf-a466bed7858a",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-080",
      "phenomenon:bpd:bps-ph-082",
      "phenomenon:bpd:bps-ph-072",
      "phenomenon:bpd:bps-ph-095"
    ]
  },
  {
    "slug": "lebensverlauf",
    "title": "Lebensverlauf, Erholung und Teilhabe",
    "question": "Wie unterscheiden sich Symptomremission, persönliche Recovery und gesellschaftliche Teilhabe über den Lebensverlauf – aus Sicht der Betroffenen?",
    "url": "https://notebook.google.com/notebook/13f0fcb5-8f01-4a91-80df-b28464d07482",
    "phenomenonIds": [
      "phenomenon:bpd:bps-ph-083",
      "phenomenon:bpd:bps-ph-084",
      "phenomenon:bpd:bps-ph-087",
      "phenomenon:bpd:bps-ph-088"
    ]
  }
];

const groups = [
  {title:'Persönlichkeit und Entwicklung', introduction:'Von Diagnosemodellen zu frühen Erfahrungen, Bindung und der Frage nach Ursachen.', slugs:['persoenlichkeit','entwicklungstrauma','bindung','ursachen-pruefen','borderline-komplexe-ptbs']},
  {title:'Selbst, Wahrnehmung und Verstehen', introduction:'Selbstwert, Narzissmus und innere Zustände im Zusammenhang lesen, ohne sie gleichzusetzen.', slugs:['narzissmus','scham-selbstwert','dissoziation','mentalisieren']},
  {title:'Nachbarschaften und Körper', introduction:'Entwicklungsprofile, Rückzug und körperliche Erfahrungen öffnen weitere Perspektiven auf den Atlas.', slugs:['neurodivergenz','vermeidung-abhaengigkeit','koerper-schlaf']},
  {title:'Beziehungen, Verantwortung und Schutz', introduction:'Familienrollen, aktuelle Machtverhältnisse und die Kosten gegenseitiger Unterstützung gemeinsam betrachten.', slugs:['parentifizierung','angehoerige','macht-schutz','co-regulation']},
  {title:'Versorgung und eigene Lebenswege', introduction:'Fähigkeiten, Behandlungsentscheidungen, diagnostische Normen und ein tragfähiges Leben gehören zusammen.', slugs:['handlungsspielraum','traumabehandlung','diagnose-kontext','lebensverlauf']},
];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pathBySlug = new Map(researchPaths.map(path => [path.slug, path]));
const phenomenonById = new Map(dossierPhenomena.map((item, index) => [item.id, {...item, readingAnchor:`dossier-phaenomen-${index + 1}`} ]));
const externalLink = (url,label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;

function renderPath(path, reading) {
  const links = path.phenomenonIds.map(id => phenomenonById.get(id)).filter(Boolean).map(item => `<li><a href="${reading ? `#${item.readingAnchor}` : '#erleben'}"${reading ? '' : ` data-research-phenomenon="${esc(item.id)}"`}>${esc(item.title)}</a></li>`).join('');
  return `<article class="research-path" id="recherche-${esc(path.slug)}"><div class="research-path-question"><h4 tabindex="-1">${esc(path.title)}</h4><p>${esc(path.question)}</p></div><div class="research-path-return"><p class="research-path-caption">Anschlüsse im bestehenden Phänomenatlas</p><ul>${links}</ul><p class="research-path-notebook">${externalLink(path.url,'Bericht und Fundstellen im Notebook öffnen')}</p></div></article>`;
}

export function renderResearchConnections(phenomenonId, {reading = false} = {}) {
  const paths = researchPaths.filter(path => path.phenomenonIds.includes(phenomenonId));
  if (!paths.length) return '';
  return `<div class="dossier-research-paths"><h4>Offene Recherche zu diesem Phänomen</h4><p class="caption">Redaktionelle Lesewege · Originalprüfung der neuen Berichte offen</p><ul>${paths.map(path => `<li><a href="${reading ? `#recherche-${esc(path.slug)}` : '#quellen'}"${reading ? '' : ` data-open-research-path="${esc(path.slug)}"`}>${esc(path.title)}</a></li>`).join('')}</ul></div>`;
}

export function renderResearchProgram({reading = false} = {}) {
  return `<section class="research-program" aria-labelledby="research-program-title"><header class="research-program-heading"><p class="eyebrow">Neue NotebookLM-Recherche · 2. November 2026</p><h2 id="research-program-title">Den Atlas in seine Nachbarschaften öffnen.</h2><p class="research-program-lead">20 neue Notebooks führen von den vorhandenen Phänomenen zu Persönlichkeit, Entwicklungs- und Bindungstrauma, Narzissmus, Körper, Beziehungen und Lebenswegen. Jede Frage hat einen Rückweg in den erarbeiteten Bestand.</p></header><div class="research-program-state"><p><strong>Berichte und Fundstellen importiert · Originalprüfung offen</strong></p><p>Die Berichte erschließen Literatur und offene Fragen. Die erste Stichprobe zur Entwicklungsrecherche zeigte überdehnte Ursachenbehauptungen und ungenau übertragene Begriffe. Berichtsaussagen brauchen den Abgleich mit den jeweiligen Originalquellen, ihren Populationen, Methoden und Gegenbefunden.</p><p>Die folgenden Verbindungen sind redaktionelle Lesewege. Die bestehenden 96 Phänomene behalten ihre Herkunft und ihren damaligen Prüfstand.</p></div><div class="research-program-index" role="navigation" aria-label="Recherchefelder">${groups.map((group,index)=>`<a href="${reading ? `#recherchefeld-${index + 1}` : '#quellen'}"${reading ? '' : ` data-research-group="${index + 1}"`}>${esc(group.title)}</a>`).join('')}</div>${groups.map((group,index)=>`<section class="research-path-group" id="recherchefeld-${index + 1}"><div class="research-group-heading"><h3 tabindex="-1">${esc(group.title)}</h3><p>${esc(group.introduction)}</p></div>${group.slugs.map(slug=>renderPath(pathBySlug.get(slug),reading)).join('')}</section>`).join('')}<details class="research-program-method"><summary>Rechercheweg, Zuordnung und Prüfgrenzen</summary><p>Für alle 20 Notebooks sind die Deep-Research-Berichte und die gefundenen Quellen importiert. Ein importierter Eintrag entspricht keiner unabhängig geprüften Studie: Berichte, Übersichten, Primärarbeiten und andere Quellentypen müssen unterschieden und mögliche Dubletten aufgelöst werden. Dies ist eine dokumentierte Momentaufnahme ohne automatische Synchronisierung.</p><p>Die Zuordnung folgt den Leitfragen der Notebooks und den vorhandenen Phänomenen. Planungsfelder und Notebook-Reihenfolge bilden unterschiedliche Ordnungen. Eine Verbindung behauptet weder eine gemeinsame Ursache noch eine Diagnose für einen einzelnen Menschen.</p><p>Das Rechercheprogramm wurde in Google AI Studio ausgearbeitet; die ausgeführten Literaturrecherchen und ihre Fundstellen liegen in den verlinkten Notebooks. Eine direkte Steuerung von NotebookLM durch AI Studio oder eine gemeinsame Token-Abrechnung ist nicht belegt.</p><p>AI-Studio-Planung · privater Arbeitsbeleg · ${externalLink('https://notebook.google.com/notebook/3126b281-4034-4f3b-9857-bc91b8af2866','Rechercheprotokoll im Notebook öffnen')}</p></details></section>`;
}
