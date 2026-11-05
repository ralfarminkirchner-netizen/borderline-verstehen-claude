import { renderNeuroHeatmap } from './neuro-heatmap.mjs';
import { displaySummary } from './atlas-editorial.mjs';

// A reading desk for the existing atlas corpus. No personal data is written.
const normal = value => String(value || '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
const TABS = [ ['matrix', 'Matrix', 'Quellenbezogene Zuordnungen'], ['compare', 'Vergleichen', 'Ähnlichkeit und Unterschiede'], ['flow', 'Verläufe', 'Situationen mit offenen Ausgängen'], ['perspectives', 'Perspektiven', 'Wirkung und Deutung auseinanderhalten'], ['methods', 'Methoden', 'Vorhandene Ressourcenwerkstatt'], ['learn', 'Lernen', 'Lernkarten und Erkundungspfade'] ];
const PERSPECTIVE_LEVELS = [
  ['absicht', 'Absicht', 'Was wollte die Person ausdrücken oder erreichen? Was sagt sie selbst dazu?'],
  ['wortlaut', 'Wortlaut', 'Was ist tatsächlich gesagt oder getan worden? Welcher Kontext ist nachprüfbar?'],
  ['wirkung', 'Wirkung', 'Was wurde erlebt oder bemerkt? Wessen Erfahrung wird beschrieben?'],
  ['deutung', 'Deutung', 'Welche Bedeutung wird dem Geschehen gegeben? Welche andere Erklärung bleibt möglich?'],
  ['geltung', 'Geltung', 'Worauf stützt sich die Aussage? Was ist offen, und was könnte sie verändern?'],
];
// New fictional teaching material. These are neither private originals nor graph relations.
const PERSPECTIVE_SCENES = [
  { id: 'nachricht', title: 'Eine kurze Nachricht', setting: 'Im fiktiven Chat steht „Wann kommst du?“. Die angesprochene Person erlebt Druck. Die Absicht ist zunächst unbekannt.',
    statements: {
      absicht: ['Die schreibende Person sagt später: „Ich wollte wissen, ob ich mit dem Essen warten soll.“', 'reported'],
      wortlaut: ['Im Chat steht: „Wann kommst du?“', 'observed'],
      wirkung: ['Die angesprochene Person berichtet von Enge im Brustkorb und dem Wunsch, sich sofort zu rechtfertigen.', 'reported'],
      deutung: ['Vielleicht ist die Frage ein Vorwurf, weil ich zu spät bin.', 'inferred'],
      geltung: ['Die Frage allein entscheidet noch nicht, ob ein Vorwurf gemeint war.', 'inferred'],
    }, counter: 'Die Person könnte gerade den Abend planen. Welche zusätzliche Auskunft würde zwischen diesen Lesarten unterscheiden?', dissent: 'Der Druck kann erlebt worden sein, während die schreibende Person ihre Absicht anders beschreibt.', boundary: 'Eine kurze Antwort, eine Rückfrage oder eine Pause bleiben möglich. Niemand muss seine gesamte Deutung sofort klären.' },
  { id: 'grenze', title: 'Eine ausgesprochene Kontaktpause', setting: 'Eine Person bittet ausdrücklich um Ruhe bis morgen. Im fiktiven Chat folgen danach weitere Nachrichten.',
    statements: {
      absicht: ['Die schreibende Person sagt: „Ich wollte nur helfen und das gleich klären.“', 'reported'],
      wortlaut: ['Nach „Bitte schreib mir heute nicht mehr“ folgen im Chat drei weitere Nachrichten.', 'observed'],
      wirkung: ['Die angesprochene Person berichtet, sich bedrängt zu fühlen.', 'reported'],
      deutung: ['Vielleicht hält die andere Person ihre Klärung für dringlicher als meine Bitte um Ruhe.', 'inferred'],
      geltung: ['Die Kontaktpause kann respektiert werden, auch wenn die Absicht der weiteren Nachrichten ungeklärt bleibt.', 'inferred'],
    }, counter: 'Eine erklärte Hilfsabsicht ist eine zusätzliche Auskunft. Sie widerlegt weder die weiteren Nachrichten noch die ausgesprochene Bitte.', dissent: 'Die Absicht kann unterschiedlich verstanden werden. Die Bitte um Kontaktpause muss dafür nicht zurückgenommen werden.', boundary: 'Eine ausdrücklich gesetzte Kontaktgrenze bleibt bestehen. Weitere Klärung braucht keine Fortsetzung des Kontakts gegen diese Grenze.' },
  { id: 'erinnerung', title: 'Zwei Erinnerungen an ein Gespräch', setting: 'Zwei Personen erinnern dieselbe Absprache verschieden. Eine kurze Notiz ist vorhanden; sie klärt nicht alle Einzelheiten.',
    statements: {
      absicht: ['Eine Person sagt: „Ich wollte eine Möglichkeit vorschlagen und noch nichts zusagen.“', 'reported'],
      wortlaut: ['In der gemeinsamen Notiz steht: „Samstag wäre möglich.“', 'observed'],
      wirkung: ['Die andere Person berichtet von Enttäuschung, weil sie bereits fest mit Samstag gerechnet hat.', 'reported'],
      deutung: ['Vielleicht haben beide unterschiedlich verstanden, wie verbindlich „möglich“ gemeint war.', 'inferred'],
      geltung: ['Die Notiz belegt diese Formulierung, aber nicht sämtliche Einzelheiten des damaligen Gesprächs.', 'inferred'],
    }, counter: 'Eine weitere zeitnahe Notiz oder eine bestätigte Absprache könnte die Rekonstruktion verändern. Auch dann bleiben Erinnerung und Dokument verschieden.', dissent: 'Die Erinnerungen müssen nicht vollständig übereinstimmen. Eine künftige Vereinbarung lässt sich trotzdem ausdrücklich bestätigen.', boundary: 'Wenn die Rekonstruktion nur noch Druck erhöht, darf sie offen bleiben. Eine neue Absprache muss die Vergangenheit nicht abschließend entscheiden.' },
];
const EVIDENCE_POSITIONS = [['observed', 'Beobachtet'], ['reported', 'Berichtet'], ['inferred', 'Gefolgert'], ['open', 'Noch offen']];
const EVIDENCE_PROMPTS = {
  observed: 'Was genau ist zugänglich: Wortlaut, Handlung oder eigene Wahrnehmung? Daraus folgt noch keine fremde Absicht.',
  reported: 'Wer beschreibt das, aus welcher Perspektive? Ein Bericht erhält diese Erfahrung oder Auskunft, ohne alles unabhängig zu bestätigen.',
  inferred: 'Welche Beobachtung trägt diesen Schluss? Eine andere Erklärung und ein möglicher Gegenbeleg halten ihn prüfbar.',
  open: 'Die Einordnung darf offen bleiben. Welche Information fehlt, und ist weitere Klärung jetzt überhaupt nötig?',
};
const CONTEXT_QUESTIONS = {
  'context:adhd': ['Zeigt sich das Muster seit der Entwicklung und in verschiedenen Lebensbereichen? Welche Anforderungen verändern es?', 'Eine aktuelle Konzentrationsstörung allein genügt nicht: Schlaf, Stress, Angst, Depression und körperliche Ursachen können ähnlich aussehen. Fehlende Erinnerung an die Kindheit ist für sich kein Gegenbeweis.'],
  'context:autism': ['Welche Entwicklungs-, Kommunikations- und Sinneserfahrungen sind bekannt? Was kostet Anpassung, was hilft tatsächlich?', 'Eine einzelne Überlastungssituation belegt keinen Autismus. Eine ruhige Außenwirkung widerlegt innere Belastung nicht. Neuroentwicklung und spätere Traumafolgen können gemeinsam vorkommen.'],
  'context:ptsd': ['Gibt es ein relevantes Ereignis und ein anhaltendes Muster aus Wiedererleben, Vermeidung und weiteren Beschwerden? Was ist heute anders?', 'Ein Triggergefühl oder starke Anspannung allein belegt keine PTSD. Eine reale gegenwärtige Gefahr muss zuerst als gegenwärtige Situation beurteilt werden.'],
  'context:complex-ptsd': ['Was spricht für PTSD und welche zusätzlichen, anhaltenden Schwierigkeiten werden beschrieben? Was erfordert eine fachliche Abklärung?', 'Komplexe PTSD ist kein Synonym für jede komplexe Lebensgeschichte oder Borderline. Ähnliche Selbstwert- und Beziehungsprobleme allein klären die Diagnose nicht.'],
  'context:borderline': ['Wie verhalten sich Emotionen, Selbstbild und Beziehungen über Zeit und Situationen? Welche andere Erklärung oder Mehrfachbelastung muss geprüft werden?', 'Ein heftiger Konflikt oder Zurückweisungsschmerz genügt nicht für eine Persönlichkeitsdiagnose. Trauma ist weder notwendige noch hinreichende Erklärung. Tatsächliche Grenzverletzungen bleiben relevant.'],
  'context:dissociation': ['Was wurde konkret bemerkt: Erinnerungslücken, Unwirklichkeit, Abstand oder etwas anderes? Wann und wie lange, mit welchen Folgen?', '„Weit weg“ ist eine Beschreibung, noch keine Diagnose. Schlafmangel, Medikamente, Substanzen und körperliche Ursachen gehören gegebenenfalls in eine Abklärung.'],
  'context:bipolar': ['Gibt es abgegrenzte Phasen mit verändertem Antrieb, Schlafbedürfnis und Aktivität? Wie lange und gegenüber welchem sonstigen Zustand?', 'Ein rascher Stimmungswechsel allein belegt keine bipolare Episode. Situation, Dauer und Veränderungen von Energie und Aktivität sind wichtige Kontextfragen.'],
};
const PERSPECTIVES = {
  erleben: ['Erleben', 'Welche eigenen Worte passen? Eine Deutung und eine Körperempfindung dürfen verschieden oder unbekannt sein.'],
  beobachtung: ['Beobachtung', 'Was wäre hörbar, sichtbar oder zeitlich feststellbar? Welche Aussage beschreibt bereits eine Vermutung?'],
  beziehung: ['Beziehung', 'Wer darf was entscheiden? Was wurde vereinbart, erbeten oder abgelehnt? Eine Erklärung hebt die Verantwortung für Grenzverletzungen nicht auf.'],
  kontext: ['Kontext', 'Welche aktuellen Bedingungen, Abhängigkeiten, Reize, Ressourcen und Alternativen verändern diese Situation?'],
};
let mountCount = 0;

export function mountAtlasLab(host, { nodes = [], edges = [], sources = [], onSelect = () => {}, onSkill = () => {} } = {}) {
  if (!host?.ownerDocument) throw new TypeError('Die Werkbank benötigt einen Anzeigebereich.');
  const doc = host.ownerDocument;
  const stylesheet = new URL('./atlas-lab.css', import.meta.url).href;
  if (![...doc.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === stylesheet)) {
    const link = doc.createElement('link'); link.rel = 'stylesheet'; link.href = stylesheet; doc.head.append(link);
  }
  const el = (tag, text, className) => {
    const result = doc.createElement(tag);
    if (text !== undefined) result.textContent = String(text);
    if (className) result.className = className;
    return result;
  };
  const button = (text, action, className = '') => {
    const result = el('button', text, className); result.type = 'button';
    result.addEventListener('click', event => {
      const hadFocus = doc.activeElement === result, oldText = result.textContent;
      const focusKey = result.dataset.alFocus;
      action(event);
      if (hadFocus && !result.isConnected && root.isConnected) {
        const replacement = [...root.querySelectorAll('button')].find(control => !control.closest('[hidden]') && (focusKey ? control.dataset.alFocus === focusKey : control.textContent === oldText));
        replacement?.focus({ preventScroll: true });
      }
    }); return result;
  };
  const option = (text, value) => { const result = el('option', text); result.value = value; return result; };
  const field = (text, control) => { const label = el('label', text, 'al-field'); label.append(control); return label; };
  const select = (pairs, value) => {
    const result = el('select'); result.append(...pairs.map(([id, title]) => option(title, id))); if (value !== undefined) result.value = value;
    result.addEventListener('change', () => {
      const hadFocus = doc.activeElement === result, labelText = result.parentElement?.firstChild?.textContent;
      queueMicrotask(() => {
        if (hadFocus && !result.isConnected && root.isConnected) [...root.querySelectorAll('label')].find(label => label.firstChild?.textContent === labelText)?.querySelector('select')?.focus({ preventScroll: true });
      });
    }); return result;
  };
  const svg = (tag, attributes = {}, text) => {
    const node = doc.createElementNS ? doc.createElementNS('http://www.w3.org/2000/svg', tag) : doc.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    if (text !== undefined) node.textContent = String(text);
    return node;
  };
  const kicker = text => el('p', text, 'al-kicker');
  const note = text => el('p', text, 'al-note');
  const title = value => {
    const text = value?.title || value?.label || 'Eintrag aus dem Atlas';
    return /(?:^|\/)[\w.-]+\.(?:json|mjs|ts|md|csv)$|\/Volumes\/|[a-f0-9]{24,}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-/i.test(text) ? value?.origin?.title || 'Quelle im Originalbestand' : text;
  };
  const root = el('section', undefined, 'atlas-lab');
  root.append(kicker('Verstehen · ausprobieren · wieder ansehen'), el('h2', 'Die Atlas-Werkbank'), el('p', 'Ein Phänomen kann mehrere Erklärungen haben. Hier lassen sich Zuordnungen prüfen, Situationen verändern und hilfreiche Möglichkeiten erkunden.', 'al-lead'));
  const tabs = el('div', undefined, 'al-tabs'); tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Werkzeuge des Atlas');
  const panel = el('div', undefined, 'al-panel'); panel.setAttribute('role', 'tabpanel'); panel.tabIndex = -1;
  const surfaceId = `atlas-workbench-${++mountCount}`; panel.id = `${surfaceId}-panel`;
  const status = el('p', 'Vorhandene Werkzeuge werden geladen …', 'al-note'); status.setAttribute('role', 'status');
  root.append(tabs, status, panel); host.replaceChildren(root);
  let dead = false, currentTab = 'matrix', pendingNode = null, data = null, comparisonNode = null, comparisonOther = null;
  let matrixPhenomenon = null, matrixView = 'network', comparisonContexts = [];
  let methodSelection = null, matrixState = {}, flowStage = 0, flowScenario = 'nachricht', flowBranch = 'base', flowPerspective = 'erleben';
  const methodFilters = { query: '', state: '', situation: '' };
  let cardIndex = 0, cardRevealed = false, learningMode = 'cards', pathIndex = 0, pathStep = 0;
  const seenCards = new Set(), revisitCards = new Set();
  let perspectiveScene = PERSPECTIVE_SCENES[0].id, perspectiveLevel = 'wirkung', perspectivePaused = false;
  const perspectiveWorks = new Map();
  const tabButtons = new Map();
  TABS.forEach(([key, text, description], index) => {
    const control = button(text, () => open(key)); control.setAttribute('role', 'tab'); control.setAttribute('aria-selected', key === currentTab ? 'true' : 'false'); control.tabIndex = index ? -1 : 0; control.setAttribute('aria-label', `${text}: ${description}`);
    control.id = `${surfaceId}-${key}`; control.setAttribute('aria-controls', panel.id);
    control.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % TABS.length;
      if (event.key === 'ArrowLeft') target = (index - 1 + TABS.length) % TABS.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = TABS.length - 1;
      if (target !== undefined) { event.preventDefault(); open(TABS[target][0]); tabButtons.get(TABS[target][0]).focus(); }
    });
    tabButtons.set(key, control); tabs.append(control);
  });
  const abort = new AbortController();
  const ready = Promise.all([
    fetch(new URL('./atlas-collection.json', import.meta.url), { signal: abort.signal }).then(response => { if (!response.ok) throw Error('Bestand nicht erreichbar'); return response.json(); }),
    fetch(new URL('./atlas-notebook-cards.json', import.meta.url), { signal: abort.signal }).then(response => response.ok ? response.json() : { cards: [] }).catch(() => ({ cards: [] })),
  ]).then(([corpus, cards]) => {
    if (dead) return;
    const corpusById = new Map((corpus.entries || []).map(item => [item.id, item]));
    const entries = nodes.length ? nodes.map(item => ({ ...corpusById.get(item.id), ...item })) : corpus.entries || [];
    const relations = edges.length ? edges : corpus.relations || [];
    const sourceEntries = sources.length ? sources : corpus.sources || [];
    data = { ...corpus, entries, relations, sources: sourceEntries, cards: cards.cards || [], cardMetadata: cards,
      byId: new Map(entries.map(item => [item.id, item])), sourceById: new Map(sourceEntries.map(item => [item.id, item])) };
    data.associations = relations.filter(item => item.from?.startsWith('neuro:') && item.to?.startsWith('context:') && data.byId.has(item.from) && data.byId.has(item.to));
    data.phenomena = [...new Set(data.associations.map(item => data.byId.get(item.from)))].sort((a, b) => title(a).localeCompare(title(b), 'de'));
    data.methods = (corpus.methods || []).map(item => ({ ...item, ...data.byId.get(item.id) }));
    data.paths = corpus.learningPaths || [];
    status.textContent = 'Die Werkzeuge verwenden den erhaltenen Atlasbestand. Zuordnungen sind keine Häufigkeits- oder Diagnosescores.';
    open(currentTab, pendingNode); return data;
  }).catch(error => {
    if (dead || error.name === 'AbortError') return;
    status.textContent = 'Die Werkbank konnte ihren Bestand gerade nicht laden. Der Atlas bleibt erreichbar.';
    panel.replaceChildren(button('Bestand erneut laden', () => doc.defaultView.location.reload()));
  });

  function sourceList(ids, target) {
    const list = el('ul', undefined, 'al-sources');
    [...new Set(ids || [])].forEach(id => {
      const source = data.sourceById.get(id) || data.sourceById.get(`verified:${id}`);
      if (!source) return;
      const row = el('li'); const url = source.url || source.href;
      if (/^https?:\/\//i.test(url || '')) {
        const link = el('a', title(source)); link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; row.append(link);
      } else row.append(el('span', title(source)));
      if (source.scopeNote || source.readScope) row.append(note(source.scopeNote || source.readScope));
      list.append(row);
    });
    if (list.childElementCount) { target.append(el('h4', 'Quellenrückweg'), list); }
    else target.append(note('Für diesen Eintrag ist kein eigener externer Quellenlink hinterlegt. Die redaktionelle Herkunft steht beim Eintrag im Atlas.'));
  }
  function original(entry, target) {
    if (entry?.origin?.title) target.append(note(`Erhaltener Bestand: ${entry.origin.title}.`));
    if (entry?.boundary) target.append(note(entry.boundary));
    if (entry?.id && data.byId.has(entry.id)) target.append(button('Im Atlas verorten', () => onSelect(entry.id), 'al-linkbutton'));
  }
  function editorialContext(entry, target) {
    if (!entry.editorialCorrections?.[0]?.editorialText) return;
    target.append(kicker('Redaktionell präzisiert'));
    entry.editorialCorrections.forEach((correction, index) => {
      if (index && correction.editorialText) markdown(correction.editorialText, target);
      if (correction.boundary) target.append(note(correction.boundary));
      const links = el('ul', undefined, 'al-sources');
      (correction.sourceUrls || []).forEach(url => {
        if (!/^https?:\/\//i.test(url)) return;
        let address;
        try { address = new URL(url); } catch { return; }
        const row = el('li'), link = el('a', `Fachquelle bei ${address.hostname.replace(/^www\./, '')}`);
        link.href = address.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; row.append(link); links.append(row);
      });
      if (links.childElementCount) target.append(links);
    });
    const preserved = el('details'); preserved.append(el('summary', 'Unveränderte Originalfassung ansehen'));
    markdown(entry.body || entry.summary, preserved); target.append(preserved);
  }
  function markdown(text, target) {
    // Plain, intentionally small renderer: no source HTML, embedded scripts or remote images.
    const chunks = String(text || '').split(/\n\s*\n/);
    chunks.forEach(chunk => {
      const clean = chunk.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
      if (/^#{1,4}\s/.test(clean)) target.append(el('h4', clean.replace(/^#{1,4}\s+/, '')));
      else if (/^[-*]\s/.test(clean)) {
        const list = el('ul'); clean.split(/\n/).filter(Boolean).forEach(line => list.append(el('li', line.replace(/^[-*]\s+/, '')))); target.append(list);
      } else if (clean.trim()) target.append(el('p', clean));
    });
  }
  function open(key, nodeId) {
    const aliases = { heatmap: 'matrix', comparison: 'compare', dynamics: 'flow', learning: 'learn', dazwischen: 'perspectives', interpretation: 'perspectives' };
    currentTab = aliases[key] || (TABS.some(([id]) => id === key) ? key : 'matrix');
    if (nodeId) {
      pendingNode = typeof nodeId === 'string' ? nodeId : nodeId.id; comparisonNode = pendingNode; methodSelection = pendingNode;
      if (currentTab === 'methods') Object.assign(methodFilters, { query: '', state: '', situation: '' });
    }
    tabButtons.forEach((control, id) => { control.setAttribute('aria-selected', String(id === currentTab)); control.tabIndex = id === currentTab ? 0 : -1; });
    panel.setAttribute('aria-label', TABS.find(([id]) => id === currentTab)?.[1] || 'Atlas-Werkbank');
    panel.setAttribute('aria-labelledby', tabButtons.get(currentTab).id);
    if (!data || dead) return;
    panel.replaceChildren();
    if (currentTab === 'matrix') renderMatrix();
    if (currentTab === 'compare') renderComparison();
    if (currentTab === 'flow') renderFlow();
    if (currentTab === 'perspectives') renderPerspectives();
    if (currentTab === 'methods') renderMethods();
    if (currentTab === 'learn') renderLearning();
  }
  function renderPerspectives() {
    const scene = PERSPECTIVE_SCENES.find(item => item.id === perspectiveScene) || PERSPECTIVE_SCENES[0];
    if (!perspectiveWorks.has(scene.id)) perspectiveWorks.set(scene.id, {
      statements: Object.fromEntries(Object.entries(scene.statements).map(([key, [text, position]]) => [key, { text, position }])),
      counter: scene.counter, dissent: scene.dissent,
    });
    const work = perspectiveWorks.get(scene.id);
    panel.append(el('h3', 'Wirkung und Deutung auseinanderhalten'), el('p', 'Eine Wirkung kann erlebt sein, während die Absicht offen bleibt. Wähle einen Blick auf dieselbe Situation und prüfe, worauf die jeweilige Aussage beruht.', 'al-lead'));
    const scenePicker = select(PERSPECTIVE_SCENES.map(item => [item.id, item.title]), scene.id);
    scenePicker.addEventListener('change', () => { perspectiveScene = scenePicker.value; perspectivePaused = false; open('perspectives'); });
    const controls = el('div', undefined, 'al-controls'); controls.append(field('Fiktive Situation wählen', scenePicker));
    const pause = button(perspectivePaused ? 'Probe fortsetzen' : 'Für jetzt unterbrechen', () => { perspectivePaused = !perspectivePaused; open('perspectives'); });
    pause.dataset.alFocus = 'perspective-pause'; controls.append(pause); panel.append(controls, el('p', scene.setting, 'al-perspective-setting'));
    if (perspectivePaused) {
      const rest = el('section', undefined, 'al-perspective-rest'); rest.setAttribute('role', 'status');
      rest.append(el('h4', 'Für jetzt darf es offen bleiben'), el('p', 'Die Probe ist unterbrochen. Deine Änderungen bleiben in dieser Ansicht erhalten. Du entscheidest, ob und wann du fortsetzt.'), el('p', scene.boundary)); panel.append(rest);
    } else {
      const spread = el('div', undefined, 'al-perspective-stage');
      const lenses = el('nav', undefined, 'al-perspective-lenses'); lenses.setAttribute('aria-label', 'Blicke auf dieselbe Situation');
      const sheet = el('section', undefined, 'al-perspective-sheet'); sheet.id = `${surfaceId}-perspective-sheet`;
      const [levelId, levelTitle, question] = PERSPECTIVE_LEVELS.find(([id]) => id === perspectiveLevel) || PERSPECTIVE_LEVELS[2];
      const lensDrawing = svg('svg', { viewBox: '0 0 500 500', 'aria-hidden': 'true', focusable: 'false' });
      const positions = [[250, 111], [382, 213], [332, 371], [168, 371], [118, 213]];
      PERSPECTIVE_LEVELS.forEach(([id, label], index) => {
        const [x, y] = positions[index];
        lensDrawing.append(svg('ellipse', { cx: x, cy: y, rx: 113, ry: 96, transform: `rotate(${index * 72} ${x} ${y})`, class: `al-perspective-petal${id === levelId ? ' is-selected' : ''}` }));
        const lens = button(label, () => { perspectiveLevel = id; open('perspectives'); }, 'al-perspective-lens');
        lens.style.left = `${x / 5}%`; lens.style.top = `${y / 5}%`;
        lens.dataset.alFocus = `perspective-${id}`; lens.setAttribute('aria-pressed', String(id === levelId)); lens.setAttribute('aria-controls', sheet.id);
        lens.addEventListener('keydown', event => {
          let next = index;
          if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % PERSPECTIVE_LEVELS.length;
          else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + PERSPECTIVE_LEVELS.length) % PERSPECTIVE_LEVELS.length;
          else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = PERSPECTIVE_LEVELS.length - 1; else return;
          event.preventDefault(); lenses.querySelectorAll('button')[next]?.focus();
        });
        lenses.append(lens);
      });
      const sharedSituation = el('p', 'Dieselbe Situation', 'al-lens-center');
      lenses.append(lensDrawing, sharedSituation, note('Fünf Blickrichtungen. Keine feste Reihenfolge.'));
      sheet.setAttribute('aria-label', levelTitle); sheet.append(el('h4', levelTitle), el('p', question, 'al-perspective-question'));
      function writing(label, value, change, rows = 3) {
        const input = el('textarea'); input.value = value; input.rows = rows; input.maxLength = 2400; input.autocomplete = 'off';
        input.addEventListener('input', () => change(input.value)); return field(label, input);
      }
      const statement = work.statements[levelId];
      sheet.append(writing('Aussage im Beispiel — du kannst sie verändern', statement.text, value => { statement.text = value; }));
      const position = select(EVIDENCE_POSITIONS, statement.position);
      const positionNote = note(EVIDENCE_PROMPTS[statement.position]); positionNote.setAttribute('role', 'status');
      position.addEventListener('change', () => { statement.position = position.value; positionNote.textContent = EVIDENCE_PROMPTS[position.value]; });
      sheet.append(field('Wie ordnest du diese Aussage ein?', position), positionNote, note('Deine Einordnung bleibt eine bewusste Prüfentscheidung. Die App beurteilt weder Personen noch Absichten.'));
      spread.append(lenses, sheet); panel.append(spread);
      const checks = el('div', undefined, 'al-perspective-checks');
      checks.append(writing('Welche andere Lesart oder welcher Gegenbeleg könnte etwas ändern?', work.counter, value => { work.counter = value; }, 4), writing('Welcher Dissens darf offen bleiben?', work.dissent, value => { work.dissent = value; }, 4));
      panel.append(checks);
      const boundary = el('aside', undefined, 'al-perspective-boundary'); boundary.append(el('h4', 'Klärung hat Grenzen'), el('p', scene.boundary), el('p', 'Eine tatsächliche Grenzverletzung wird durch eine mögliche andere Deutung nicht aufgehoben. Verständigung muss nicht von einer Person allein hergestellt werden.'));
      panel.append(boundary);
    }
    const reset = button('Dieses Beispiel neu beginnen', () => { perspectiveWorks.delete(scene.id); perspectivePaused = false; open('perspectives'); }, 'al-linkbutton'); reset.dataset.alFocus = 'perspective-reset';
    panel.append(reset, note('Frei bearbeitbare Lehrprobe. Die App hält Änderungen nur im Arbeitsspeicher dieser Ansicht, sendet sie nicht und legt keine Datei an. Beim Neuladen gehen sie verloren.'));
    const origin = el('section', undefined, 'al-perspective-origin');
    origin.append(el('h4', 'Aus dem bestehenden Werkzusammenhang'), el('p', 'Redaktionelle Übertragung von Werkprinzipien aus DAS DAZWISCHEN und seiner lesenden Verbindung mit WiRKGEFÜGE: unterschiedliche Perspektiven prüfen, Gegenbelege zulassen und offene Grenzen erhalten. Die Situationen und Formulierungen dieser Probe wurden für den Atlas neu geschrieben.'));
    const technical = el('details'); technical.append(el('summary', 'Technische Herkunft öffnen'));
    const provenance = el('dl');
    [
      ['Originalwerk', 'dazwischen-werkraum / src/data/wirkgefuege.ts; Knoten und Relationen am 02.11.2026 geprüft'],
      ['Originalschlüssel', 'absicht, wortlaut, wirkung, deutung, geltung, fehlbarkeit, verstehensschwelle, erklaerungsdruck, dissens'],
      ['Originalfassung · SHA-256', 'd20c20a3a08e80f25db0d0fe5e4498fb57bbc9d964639664fb5fdd1f0b2dbf29'],
      ['Werkverbindung', 'wirkgefuege / adapters/dazwischen.py; source.path, start, end, original_id; dazwischen:<original_id>'],
      ['Prüfgrenze', 'Redaktionelle Übertragung; keine privaten Quellpakete, keine neue Graphkante und kein klinisch validiertes Verfahren. Originalmodell lesend ausgeführt; aktuelle menschliche Abnahme offen.'],
    ].forEach(([label, value]) => provenance.append(el('dt', label), el('dd', value)));
    technical.append(provenance); origin.append(technical); panel.append(origin);
  }
  function renderMatrix() {
    const intro = el('div', undefined, 'al-tool-intro');
    intro.append(kicker('Zuordnungen untersuchen'), el('h3', 'Ein Phänomen, mehrere Kontexte'), el('p', 'Wähle ein Phänomen. Folge einem Faden und lies, was der vorhandene Katalog darüber beschreibt — samt Grenze und Quelle.'));
    panel.append(intro);
    if (pendingNode?.startsWith('context:')) matrixState.contextId = pendingNode;
    else if (pendingNode?.startsWith('neuro:')) { matrixPhenomenon = pendingNode; matrixState.query = ''; }
    pendingNode = null;
    const views = el('div', undefined, 'al-segments'); views.setAttribute('aria-label', 'Ansicht der Quellenzuordnungen');
    const body = el('div');
    [['network', 'Visuell untersuchen'], ['table', 'Vollständige Zuordnungstabelle']].forEach(([id, label]) => {
      const control = button(label, () => { matrixView = id; open('matrix'); });
      control.setAttribute('aria-pressed', String(matrixView === id)); views.append(control);
    });
    panel.append(views, body);
    if (matrixView === 'table') {
      renderNeuroHeatmap(body, { entries: data.entries, relations: data.relations, sources: data.sources, initialState: matrixState, onStateChange: state => { matrixState = state; }, onRead: onSelect });
      return;
    }
    const contexts = [...new Set(data.associations.map(item => data.byId.get(item.to)))].sort((a, b) => title(a).localeCompare(title(b), 'de'));
    const dimensions = [...new Set(data.phenomena.map(item => item.dimensionId).filter(Boolean))];
    const search = el('input'); search.type = 'search'; search.placeholder = 'Zum Beispiel Konzentration, Scham, Schlaf'; search.value = matrixState.query || '';
    const dimension = select([['', 'Alle Erfahrungsdimensionen'], ...dimensions.map(id => [id, title(data.byId.get(`dimension:${id}`))])], matrixState.dimensionId || '');
    const context = select([['', 'Alle Kontexte'], ...contexts.map(item => [item.id, title(item)])], matrixState.contextId || '');
    const controls = el('div', undefined, 'al-controls'); controls.append(field('Phänomen suchen', search), field('Erfahrungsdimension', dimension), field('Kontext eingrenzen', context));
    const picker = select([], '');
    const selection = field('Phänomen auswählen', picker); selection.classList.add('al-phenomenon-picker');
    const count = note(''); count.setAttribute('role', 'status');
    const investigation = el('div', undefined, 'al-investigation');
    body.append(controls, selection, count, investigation);
    function choosePhenomenon() {
      Object.assign(matrixState, { query: search.value, dimensionId: dimension.value, contextId: context.value });
      const matches = data.phenomena.filter(item => (!dimension.value || item.dimensionId === dimension.value) && normal([title(item), item.summary, ...(item.aliases || [])].join(' ')).includes(normal(search.value)));
      picker.replaceChildren(...matches.map(item => option(title(item), item.id)));
      let pair;
      try { pair = JSON.parse(matrixState.selectedPair || 'null'); } catch { /* An absent former selection starts a new reading. */ }
      const selected = matches.find(item => item.id === matrixPhenomenon) || matches.find(item => item.id === pair?.[0]) || matches.find(item => item.id === 'neuro:concentration') || matches[0];
      picker.disabled = !selected;
      if (selected) { picker.value = selected.id; matrixPhenomenon = selected.id; }
      count.textContent = `${matches.length} Phänomene in dieser Suche · ${data.associations.length} Quellenzuordnungen im gesamten Bestand. Fäden zeigen Zuordnungen, keine Häufigkeit oder Ursache.`;
      drawInvestigation(selected);
    }
    function drawInvestigation(phenomenon) {
      investigation.replaceChildren();
      if (!phenomenon) { investigation.append(el('h4', 'Hier passt gerade kein Eintrag.'), el('p', 'Ändere die Suche oder die Erfahrungsdimension. Die vollständige Tabelle bleibt über den Ansichtsschalter erreichbar.')); return; }
      const allRecords = data.associations.filter(item => item.from === phenomenon.id);
      const visibleRecords = allRecords.filter(item => !context.value || item.to === context.value);
      const contextIds = [...new Set(visibleRecords.map(item => item.to))];
      const figure = el('figure', undefined, 'al-association-figure');
      const drawing = el('div', undefined, 'al-association-drawing');
      drawing.style.height = `${Math.max(530, Math.ceil(contextIds.length / 2) * 52 + 110)}px`;
      const threads = svg('svg', { viewBox: '0 0 1000 760', preserveAspectRatio: 'none', 'aria-hidden': 'true', focusable: 'false', class: 'al-association-threads' });
      const centerShape = svg('path', { d: 'M500 239 C568 212 627 277 614 348 C632 418 561 470 498 445 C428 468 368 416 386 346 C369 282 429 215 500 239 Z', class: 'al-phenomenon-shape' });
      threads.append(centerShape);
      const center = el('div', undefined, 'al-association-center'); center.append(el('span', 'Das gewählte Phänomen', 'al-note'), el('h4', title(phenomenon)), el('span', `${contextIds.length} von ${new Set(allRecords.map(item => item.to)).size} zugeordneten Kontexten`, 'al-note'));
      drawing.append(threads, center);
      const reader = el('section', undefined, 'al-association-reader'); reader.id = `${surfaceId}-association-reader`; reader.setAttribute('aria-label', 'Beschreibung und Quellen der gewählten Zuordnung');
      const choices = [];
      let chosen;
      try { chosen = JSON.parse(matrixState.selectedPair || 'null')?.[1]; } catch { /* No previous pair. */ }
      if (!contextIds.includes(chosen)) chosen = contextIds[0];
      const leftCount = Math.ceil(contextIds.length / 2);
      contextIds.forEach((id, index) => {
        const left = index < leftCount, localIndex = left ? index : index - leftCount;
        const sideCount = left ? leftCount : contextIds.length - leftCount;
        const fraction = sideCount <= 1 ? .5 : localIndex / (sideCount - 1);
        const x = left ? 275 - Math.sin(fraction * Math.PI) * 35 : 725 + Math.sin(fraction * Math.PI) * 35, y = 70 + fraction * 620;
        const path = svg('path', { d: `M${left ? 411 : 589} ${328 + (fraction - .5) * 65} C${left ? 340 : 660} ${335 + (fraction - .5) * 150},${left ? 365 : 635} ${y},${x} ${y}`, class: 'al-source-thread', 'vector-effect': 'non-scaling-stroke' });
        const point = svg('circle', { cx: x, cy: y, r: 4, class: 'al-source-point' }); threads.insertBefore(path, centerShape); threads.append(point);
        const choice = button(title(data.byId.get(id)), () => read(id), 'al-context-choice');
        choice.style.left = `${left ? (x - 230) / 10 : (x + 10) / 10}%`; choice.style.top = `${y / 7.6}%`;
        choice.classList.add(left ? 'is-left' : 'is-right');
        choice.setAttribute('aria-controls', reader.id); choice.setAttribute('aria-pressed', String(id === chosen));
        choice.addEventListener('keydown', event => {
          let next = index;
          if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % choices.length;
          else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + choices.length) % choices.length;
          else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = choices.length - 1; else return;
          event.preventDefault(); choices[next]?.choice.focus();
        });
        choices.push({ id, choice, path, point }); drawing.append(choice);
      });
      figure.append(drawing, el('figcaption', 'Jeder Faden führt zu einem im Katalog zugeordneten Kontext. Die Anordnung dient dem Lesen; Abstände und Fadenstärken haben keine diagnostische Bedeutung.'));
      investigation.append(figure, reader);
      function read(id) {
        matrixState.selectedPair = JSON.stringify([phenomenon.id, id]);
        choices.forEach(item => { const active = item.id === id; item.choice.setAttribute('aria-pressed', String(active)); item.path.setAttribute('class', `al-source-thread${active ? ' is-selected' : ''}`); item.point.setAttribute('class', `al-source-point${active ? ' is-selected' : ''}`); });
        reader.replaceChildren(kicker('Die gewählte Zuordnung'), el('h4', title(data.byId.get(id))), el('p', title(phenomenon), 'al-reader-phenomenon'));
        const records = visibleRecords.filter(item => item.to === id);
        records.forEach(relation => {
          const paragraphs = String(relation.detail || relation.description || relation.explanation || '').split(/\n\s*\n/).filter(Boolean);
          reader.append(el('h5', 'Beschreibung im Kontext'), el('p', paragraphs.shift() || relation.label || 'Im Originalkatalog zugeordnet.'));
          const qualification = paragraphs.join('\n\n') || relation.qualification || relation.boundary || relation.limit;
          if (qualification) reader.append(el('h5', 'Grenze der Einordnung'), el('p', qualification));
          sourceList(relation.sourceIds, reader);
          const provenance = typeof relation.provenance === 'string' ? relation.provenance : relation.provenance?.title;
          if (provenance) reader.append(note(`Herkunft: ${provenance}`));
        });
        const actions = el('div', undefined, 'al-actions'); actions.append(button('Phänomen vollständig lesen', () => onSelect(phenomenon.id), 'al-linkbutton'), button('Kontext und unterscheidende Fragen lesen', () => onSelect(id), 'al-linkbutton'));
        const technical = el('details'); technical.append(el('summary', 'Technische Herkunft öffnen'), el('pre', JSON.stringify({ from: phenomenon.id, to: id, relations: records }, null, 2)));
        reader.append(actions, technical);
      }
      if (chosen) read(chosen);
      else reader.append(el('h4', 'In diesem Kontext ist keine Zuordnung eingetragen.'), el('p', 'Das schließt einen Zusammenhang nicht aus. Wähle „Alle Kontexte“, um die erhaltenen Zuordnungen dieses Phänomens zu sehen.'));
    }
    picker.addEventListener('change', () => { matrixPhenomenon = picker.value; drawInvestigation(data.byId.get(picker.value)); });
    search.addEventListener('input', choosePhenomenon); dimension.addEventListener('change', choosePhenomenon); context.addEventListener('change', choosePhenomenon); choosePhenomenon();
    panel.append(button('Eine Ähnlichkeit genauer vergleichen', () => { comparisonNode = matrixPhenomenon; open('compare'); }, 'al-action'));
  }
  function comparisonFigure(firstId, secondId, selected) {
    const figure = el('figure', undefined, 'al-comparison-figure');
    const same = firstId === secondId;
    const firstSet = new Set(data.associations.filter(item => item.to === firstId).map(item => item.from));
    const secondSet = new Set(data.associations.filter(item => item.to === secondId).map(item => item.from));
    const shared = [...firstSet].filter(id => secondSet.has(id)), onlyFirst = [...firstSet].filter(id => !secondSet.has(id)), onlySecond = [...secondSet].filter(id => !firstSet.has(id));
    const drawing = svg('svg', { viewBox: '0 0 1000 340', 'aria-hidden': 'true', focusable: 'false' });
    drawing.append(svg('path', { d: 'M506 45 C387 6 155 23 92 150 C32 274 289 335 489 289 C590 259 599 110 506 45 Z', class: 'al-compare-leaf is-first' }), svg('path', { d: 'M494 45 C613 6 845 23 908 150 C968 274 711 335 511 289 C410 259 401 110 494 45 Z', class: 'al-compare-leaf is-second' }));
    const labels = el('div', undefined, 'al-comparison-labels');
    const firstLabel = el('div'); firstLabel.append(el('span', 'Erster Kontext', 'al-note'), el('h4', title(data.byId.get(firstId))), el('span', `${onlyFirst.length} nur hier zugeordnet`, 'al-note'));
    const center = el('div', undefined, 'al-comparison-shared'); center.append(el('strong', String(shared.length)), el('span', 'gemeinsam beschriebene Phänomene'));
    const secondLabel = el('div'); secondLabel.append(el('span', 'Zweiter Kontext', 'al-note'), el('h4', title(data.byId.get(secondId))), el('span', `${onlySecond.length} nur hier zugeordnet`, 'al-note'));
    labels.append(firstLabel, center, secondLabel); figure.append(drawing, labels);
    figure.append(el('figcaption', same ? 'Du betrachtest zweimal denselben Kontext. Wähle einen anderen, um Unterschiede zu untersuchen.' : 'Verglichen werden ausschließlich die eingetragenen Phänomenzuordnungen dieser beiden Kontexte. Flächen und Überschneidung sind nicht maßstäblich; fehlende Zuordnung bedeutet keinen Ausschluss.'));
    const lists = el('div', undefined, 'al-comparison-lists');
    [[onlyFirst, 'Nur im ersten Kontext eingetragen'], [shared, 'In beiden Kontexten eingetragen'], [onlySecond, 'Nur im zweiten Kontext eingetragen']].forEach(([ids, heading]) => {
      const column = el('section'); column.append(el('h5', heading));
      if (!ids.length) column.append(note('Keine weiteren Einträge in dieser Auswahl.'));
      const ordered = ids.sort((a, b) => title(data.byId.get(a)).localeCompare(title(data.byId.get(b)), 'de'));
      const appendChoices = (values, target) => values.forEach(id => { const choice = button(title(data.byId.get(id)), () => { comparisonNode = id; open('compare'); }, 'al-comparison-term'); choice.setAttribute('aria-pressed', String(id === selected?.id)); target.append(choice); });
      appendChoices(ordered.slice(0, 5), column);
      if (ordered.length > 5) { const more = el('details'); more.append(el('summary', `${ordered.length - 5} weitere Phänomene ansehen`)); appendChoices(ordered.slice(5), more); column.append(more); }
      lists.append(column);
    });
    figure.append(lists); return figure;
  }
  function renderComparison() {
    panel.append(kicker('Erklärungen offen halten'), el('h3', 'Was sieht ähnlich aus – und was unterscheidet es?'), el('p', 'Die Matrix zeigt redaktionell dokumentierte Kontexte. Der Vergleich ergänzt offene Kontext- und Gegenfragen. Er stellt keine persönlichen Diagnosen und bewertet keine Person.'));
    const controls = el('div', undefined, 'al-controls');
    const mode = select([['contexts', 'Ein Phänomen in verschiedenen Kontexten'], ['entries', 'Zwei Atlaseinträge gegenüberstellen']], comparisonNode && !data.phenomena.some(item => item.id === comparisonNode) ? 'entries' : 'contexts');
    controls.append(field('Vergleichsart', mode));
    const content = el('div'); panel.append(controls, content);
    mode.addEventListener('change', draw);
    function draw() {
      content.replaceChildren();
      if (mode.value === 'entries') { drawEntries(); return; }
      let selected = data.phenomena.find(item => item.id === comparisonNode) || data.byId.get('neuro:concentration') || data.phenomena[0];
      if (!selected) { content.append(note('In diesem Bestand sind keine Neuroatlas-Zuordnungen verfügbar.')); return; }
      const picker = select(data.phenomena.map(item => [item.id, title(item)]), selected.id);
      const shortcuts = el('div', undefined, 'al-shortcuts');
      ['neuro:concentration', 'neuro:mood-swings', 'neuro:rejection-sensitivity', 'neuro:sleep-problems'].forEach(id => {
        if (data.byId.has(id)) shortcuts.append(button(title(data.byId.get(id)), () => { comparisonNode = id; draw(); }, 'al-chip'));
      });
      const selection = el('div', undefined, 'al-controls'); selection.append(field('Phänomen', picker)); content.append(shortcuts, selection);
      const visual = el('div');
      const spread = el('div', undefined, 'al-compare-spread'); content.append(visual, spread);
      picker.addEventListener('change', () => { comparisonNode = picker.value; draw(); });
      const associations = data.associations.filter(item => item.from === selected.id);
      const contexts = [...new Set(associations.map(item => item.to))];
      const contextsPicker = el('div', undefined, 'al-controls');
      const first = select(contexts.map(id => [id, title(data.byId.get(id))]), contexts.includes(comparisonContexts[0]) ? comparisonContexts[0] : contexts[0]);
      const second = select(contexts.map(id => [id, title(data.byId.get(id))]), contexts.includes(comparisonContexts[1]) ? comparisonContexts[1] : contexts[1] || contexts[0]);
      contextsPicker.append(field('Erster Kontext', first), field('Zweiter Kontext', second)); content.insertBefore(contextsPicker, spread);
      const drawSpread = () => {
        comparisonContexts = [first.value, second.value];
        visual.replaceChildren(comparisonFigure(first.value, second.value, selected));
        spread.replaceChildren();
        [first.value, second.value].forEach(id => {
          const context = data.byId.get(id); if (!context) return;
          const records = associations.filter(item => item.to === id);
          const side = el('article', undefined, 'al-compare-side');
          side.append(kicker('Beschrieben im Kontext'), el('h4', title(context)), el('p', title(selected), 'al-compare-phenomenon'));
          const descriptions = [...new Set(records.map(item => item.detail || item.explanation || item.label).filter(Boolean))];
          side.append(el('h5', 'Was der vorhandene Katalog beschreibt'));
          descriptions.forEach(text => markdown(text, side));
          const questions = CONTEXT_QUESTIONS[id] || ['Seit wann, in welchen Situationen und mit welchen konkreten Folgen zeigt sich dieses Erleben? Welche andere Erklärung passt ebenfalls?', 'Ähnlichkeit allein klärt weder Ursache noch Diagnose. Welche Beobachtung würde der eigenen Erklärung widersprechen? Welche Informationen fehlen?'];
          side.append(el('h5', 'Offene Kontextfrage'), el('p', questions[0]), el('h5', 'Gegenbelege und Aussagegrenzen'), el('p', questions[1]));
          side.append(note('Die Kontext- und Gegenfragen sind redaktionelle Orientierung, kein validierter Diagnosetest.'));
          sourceList(records.flatMap(item => item.sourceIds || []), side); original(context, side); spread.append(side);
        });
      };
      first.addEventListener('change', drawSpread); second.addEventListener('change', drawSpread); drawSpread();
      content.append(button('Phänomen auf der Karte zeigen', () => onSelect(selected.id), 'al-action'));
    }
    function drawEntries() {
      const options = [...data.entries].sort((a, b) => title(a).localeCompare(title(b), 'de')).map(item => [item.id, `${title(item)} · ${item.collection || 'Atlas'}`]);
      const first = select(options, data.byId.has(comparisonNode) ? comparisonNode : options[0]?.[0]);
      const adjacent = data.relations.find(edge => edge.from === first.value && edge.to !== first.value && data.byId.has(edge.to));
      const second = select(options, data.byId.has(comparisonOther) ? comparisonOther : adjacent?.to || options[1]?.[0]);
      const pickers = el('div', undefined, 'al-controls'); pickers.append(field('Erster Eintrag', first), field('Zweiter Eintrag', second));
      const spread = el('div', undefined, 'al-compare-spread'), connection = el('div', undefined, 'al-comparison-relation');
      content.append(pickers, spread, connection);
      const visual = el('figure', undefined, 'al-entry-pair-figure'); content.insertBefore(visual, spread);
      const change = () => {
        comparisonNode = first.value; comparisonOther = second.value; spread.replaceChildren(); connection.replaceChildren();
        [data.byId.get(first.value), data.byId.get(second.value)].forEach(entry => {
          if (!entry) return;
          const side = el('article', undefined, 'al-compare-side');
          const kind = { phenomenon: 'Phänomen', model: 'Erklärungsmodell', diagnosis: 'Diagnose', method: 'Methode', exercise: 'Übung', source: 'Quelle', context: 'Kontext' }[entry.kind] || entry.originalKind || 'Atlaseintrag';
          side.append(kicker(kind), el('h4', title(entry)), el('p', displaySummary(entry) || 'Beschreibung im Atlas öffnen.'));
          editorialContext(entry, side);
          side.append(el('h5', 'Beim Vergleichen offen halten'), el('p', 'Welche konkrete Beobachtung passt? Welche passt nicht? Welche Bedeutung kommt von der Person selbst, welche wird erst im Nachhinein vermutet? Welche andere Erklärung und welcher Kontext bleiben möglich?'));
          original(entry, side); sourceList(entry.sourceIds, side); spread.append(side);
        });
        const relations = data.relations.filter(edge => (edge.from === first.value && edge.to === second.value) || (edge.from === second.value && edge.to === first.value));
        visual.replaceChildren();
        const pairDrawing = svg('svg', { viewBox: '0 0 1000 190', 'aria-hidden': 'true', focusable: 'false' });
        pairDrawing.append(svg('path', { d: 'M65 96 C65 12 375 10 375 96 C375 185 65 182 65 96 Z', class: 'al-compare-leaf is-first' }), svg('path', { d: 'M625 96 C625 12 935 10 935 96 C935 185 625 182 625 96 Z', class: 'al-compare-leaf is-second' }));
        if (relations.length) pairDrawing.append(svg('path', { d: 'M375 96 C460 30 540 160 625 96', class: 'al-entry-real-edge' }));
        visual.append(pairDrawing, el('figcaption', relations.length ? `${relations.length} ausdrücklich eingetragene Beziehung${relations.length === 1 ? '' : 'en'} zwischen den gewählten Einträgen. Beschreibung und Quellen stehen darunter.` : 'Zwei Einträge nebeneinander. Zwischen ihnen ist keine direkte Beziehung im Bestand eingetragen.'));
        connection.append(el('h4', 'Im Bestand ausdrücklich verbunden?'));
        if (!relations.length) connection.append(el('p', 'Zwischen diesen beiden Einträgen ist keine direkte Beziehung eingetragen. Die gemeinsame Ansicht ergänzt keine Kante und behauptet keine gemeinsame Ursache.'));
        relations.forEach(edge => {
          const from = data.byId.get(edge.from), to = data.byId.get(edge.to);
          connection.append(el('p', `${title(from)} → ${edge.label || 'steht in Beziehung zu'} → ${title(to)}`, 'al-relation-label'));
          if (edge.detail || edge.explanation) markdown(edge.detail || edge.explanation, connection);
          if (edge.boundary || edge.limit) connection.append(note(edge.boundary || edge.limit));
          sourceList(edge.sourceIds, connection);
        });
      };
      first.addEventListener('change', change); second.addEventListener('change', change); change();
    }
    draw(); pendingNode = null;
  }
  function renderFlow() {
    const dynamics = data.instruments?.dynamics;
    const scenarios = dynamics?.scenarios || [];
    const chameleon = data.instruments?.chameleonDynamics;
    panel.append(kicker('Ein Verlauf ist keine Vorhersage'), el('h3', 'Eine Situation kann anders weitergehen'), el('p', 'Erfundene Lehrszenen aus dem Dynamikraum. Verändere Lesart und Handlungsweg; die Reaktion eines anderen Menschen und die spätere Wirkung bleiben offen.'));
    const choose = select([...scenarios.map(item => [item.id, item.title]), ...(chameleon ? [['chameleon', chameleon.title]] : [])], flowScenario);
    const controls = el('div', undefined, 'al-controls'); controls.append(field('Szene aus dem vorhandenen Bestand', choose)); panel.append(controls);
    const area = el('div'); panel.append(area);
    choose.addEventListener('change', () => { flowScenario = choose.value; flowStage = 0; draw(); });
    function draw() {
      area.replaceChildren();
      if (choose.value === 'chameleon') { drawChameleon(); return; }
      const scenario = scenarios.find(item => item.id === choose.value) || scenarios[0]; if (!scenario) { area.append(note('Keine Verlaufsszene geladen.')); return; }
      area.append(el('blockquote', scenario.quote), note(scenario.context));
      const branches = el('div', undefined, 'al-segments'); branches.setAttribute('aria-label', 'Möglicher Verlauf');
      [['base', 'Gesetztes Beispiel'], ['other', 'Andere Erklärung'], ['exit', 'Andere Handlung']].forEach(([id, label]) => {
        const control = button(label, () => { flowBranch = id; draw(); }); control.setAttribute('aria-pressed', String(flowBranch === id)); branches.append(control);
      });
      const perspective = select(Object.entries(PERSPECTIVES).map(([id, item]) => [id, item[0]]), flowPerspective);
      const perspectiveRow = el('div', undefined, 'al-controls'); perspectiveRow.append(field('Blick auf denselben Moment', perspective));
      perspective.addEventListener('change', () => { flowPerspective = perspective.value; draw(); });
      area.append(branches, perspectiveRow);
      const labels = [...(dynamics.stages || []), 'Erholung & Nachsehen'];
      const timeline = el('ol', undefined, 'al-timeline'); timeline.setAttribute('aria-label', 'Momente der fiktiven Szene');
      const detail = el('article', undefined, 'al-flow-detail'); detail.tabIndex = -1;
      labels.forEach((text, index) => {
        const row = el('li'); const control = button(text, () => { flowStage = index; draw(); }); control.setAttribute('aria-current', index === flowStage ? 'step' : 'false'); row.append(control); timeline.append(row);
      });
      const stage = Math.min(flowStage, labels.length - 1);
      detail.append(kicker(`Moment ${stage + 1} von ${labels.length} · ${flowBranch === 'base' ? 'Beispiel' : flowBranch === 'other' ? 'Andere Erklärung' : 'Andere Handlung'}`), el('h4', labels[stage]));
      const recovery = 'Erweiterte offene Station: Was ist später tatsächlich passiert? Was hat eher geholfen, was war unangenehm oder ohne Wirkung? Welche Unterstützung oder Veränderung der Bedingungen ist nötig? Erholung wird nicht aus einer gewählten Abzweigung berechnet.';
      detail.append(el('p', stage < 7 ? scenario[flowBranch]?.[stage] || 'Dieser Moment ist im Beispiel nicht beschrieben.' : recovery, 'al-flow-text'));
      const lens = el('aside', undefined, 'al-lens'); lens.append(el('h5', `Perspektive ${PERSPECTIVES[flowPerspective][0]}`), el('p', PERSPECTIVES[flowPerspective][1]));
      if (flowPerspective === 'beobachtung') lens.append(el('p', stage === 1 || stage === 5 ? 'Hier enthält das Beispiel einen Wortlaut oder eine Handlung. Motive und Wirkung bleiben trotzdem zu erfragen.' : 'Dieser Moment enthält gesetzte innere Annahmen oder offene Folgen. Sie sind von außen nicht unmittelbar feststellbar.'));
      if (flowPerspective === 'beziehung' && scenario.id === 'grenze') lens.append(el('p', 'In dieser Szene wird ein ausgesprochenes Nein übergangen. Selbstregulation ersetzt weder Schutz noch die Verantwortung der grenzverletzenden Person.'));
      if (flowPerspective === 'kontext') lens.append(el('p', scenario.context));
      detail.append(lens);
      if (stage < 7 && flowBranch !== 'base') {
        const previous = el('details'); previous.append(el('summary', 'Mit dem gesetzten Beispiel vergleichen'), el('p', scenario.base[stage])); detail.append(previous);
      }
      const actions = el('div', undefined, 'al-actions');
      const back = button('Vorheriger Moment', () => { flowStage = Math.max(0, stage - 1); draw(); }); back.disabled = stage === 0;
      const next = button('Nächster Moment', () => { flowStage = Math.min(labels.length - 1, stage + 1); draw(); }); next.disabled = stage === labels.length - 1;
      actions.append(back, next, button('Passende Alltagshilfe suchen', () => onSkill({ query: scenario.id === 'grenze' ? 'Grenzen und Schutz' : scenario.id === 'kritik' ? 'Scham und Selbstfreundlichkeit' : 'Ungewissheit und Orientierung' }), 'al-action'));
      detail.append(actions, note('Herkunft: Erhaltene fiktive Dynamikraum-Szenen mit fachlichen Aussagegrenzen. Die Station „Erholung & Nachsehen“ und die Fokusfragen sind eine redaktionelle Erweiterung.'));
      const spread = el('div', undefined, 'al-flow-layout'); spread.append(timeline, detail); area.append(spread);
      sourceList(['dynamics-source:nimh', 'dynamics-source:nice'], area);
    }
    function drawChameleon() {
      area.append(el('p', chameleon.intro), note('Erhaltener Vorschlag aus dem Phänomenatlas, redaktionell geöffnet: Gedankenvarianten und Lesarten, kein nachgewiesener klinischer Mechanismus. Die ursprünglichen Varianten bleiben im Original erhalten.'));
      const lensSelect = select(chameleon.lenses.map(item => [item.id, item.label]), chameleon.lenses.some(item => item.id === flowPerspective) ? flowPerspective : chameleon.lenses[0]?.id);
      const row = el('div', undefined, 'al-controls'); row.append(field('Lesart', lensSelect)); area.append(row);
      const lens = chameleon.lenses.find(item => item.id === lensSelect.value);
      const timeline = el('ol', undefined, 'al-timeline');
      chameleon.steps.forEach((step, index) => {
        const li = el('li'), control = button(step.label, () => { flowStage = index; drawChameleonStage(); }); control.setAttribute('aria-current', index === flowStage ? 'step' : 'false'); li.append(control); timeline.append(li);
      });
      const detail = el('article', undefined, 'al-flow-detail'), spread = el('div', undefined, 'al-flow-layout'); spread.append(timeline, detail); area.append(spread);
      lensSelect.addEventListener('change', () => { flowPerspective = lensSelect.value; drawChameleonStage(); });
      function drawChameleonStage() {
        const activeLens = chameleon.lenses.find(item => item.id === lensSelect.value) || lens;
        const stage = Math.min(flowStage, chameleon.steps.length - 1), step = chameleon.steps[stage]; detail.replaceChildren();
        timeline.querySelectorAll('button').forEach((control, index) => control.setAttribute('aria-current', index === stage ? 'step' : 'false'));
        detail.append(kicker('Erkundungsschritt · Wirkung offen'), el('h4', step.label), el('p', step.text, 'al-flow-text'));
        const lensBox = el('aside', undefined, 'al-lens'); lensBox.append(el('h5', activeLens.label), el('p', activeLens.text), el('p', activeLens.stepQuestions?.[step.id] || activeLens.question), note(activeLens.limit)); detail.append(lensBox);
        const branches = chameleon.branches.filter(item => item.from === step.id);
        branches.forEach(branch => { const disclosure = el('details'); disclosure.append(el('summary', `Gedankenvariante: ${branch.label}`), el('p', branch.question), note('Diese Frage verändert keine berechnete Wirkung. Der Ausgang bleibt offen.')); detail.append(disclosure); });
        const actions = el('div', undefined, 'al-actions');
        const back = button('Zurück', () => { flowStage = Math.max(0, stage - 1); drawChameleonStage(); }); back.disabled = stage === 0;
        const next = button('Weiter', () => { flowStage = Math.min(chameleon.steps.length - 1, stage + 1); drawChameleonStage(); }); next.disabled = stage === chameleon.steps.length - 1;
        actions.append(back, next); detail.append(actions); original({ ...chameleon, id: chameleon.phenomenonId }, detail);
      }
      drawChameleonStage();
    }
    draw();
  }
  function renderMethods() {
    panel.append(kicker('Bewährte Wege bewahren'), el('h3', 'Die vorhandene Methodenwerkstatt'), el('p', 'Ressourcen aus TraumaAtlas, Neuroatlas und den weiteren Sammlungen. Zustand und Situation filtern redaktionelle Passung; sie berechnen weder Wirkung noch Behandlungsbedarf.'));
    const search = el('input'); search.type = 'search'; search.placeholder = 'Methode, Zweck oder Begriff'; search.value = methodFilters.query;
    const state = select([['', 'Alle Bedürfnisse'], ...Object.entries(data.instruments?.resourceStates || {})], methodFilters.state);
    const situation = select([['', 'Alle Situationen'], ...Object.entries(data.instruments?.resourceSituations || {})], methodFilters.situation);
    const controls = el('div', undefined, 'al-controls'); controls.append(field('Methoden durchsuchen', search), field('Aktuell hilfreich bei …', state), field('Umgebung / Situation', situation)); panel.append(controls);
    const count = el('p', '', 'al-note'); count.setAttribute('role', 'status');
    const rail = el('div', undefined, 'al-method-rail'); rail.setAttribute('aria-label', 'Gefilterte Methoden');
    const detail = el('article', undefined, 'al-method-detail');
    const spread = el('div', undefined, 'al-method-layout'); spread.append(rail, detail); panel.append(count, spread);
    const draw = () => {
      Object.assign(methodFilters, { query: search.value, state: state.value, situation: situation.value });
      const words = normal(search.value).split(/\s+/).filter(Boolean);
      const methods = data.methods.filter(item => words.every(word => normal([title(item), displaySummary(item), item.body, ...(item.tags || [])].join(' ')).includes(word)) && (!state.value || item.states?.includes(state.value)) && (!situation.value || item.situations?.includes(situation.value)));
      count.textContent = `${methods.length} von ${data.methods.length} Methoden im erhaltenen Bestand. Innerhalb einer Auswahl wird qualitativ gefiltert, ohne Rangfolge der Wirksamkeit.`;
      rail.replaceChildren();
      let selected = methods.find(item => item.id === methodSelection) || methods[0];
      if (!selected) { detail.replaceChildren(el('h4', 'Hier ist noch keine passende Zuordnung eingetragen.'), el('p', 'Ein leeres Ergebnis bedeutet nicht, dass dir nichts helfen kann. Ändere einen Filter oder gehe zum Skillkoffer.'), button('Zum Skillkoffer', () => onSkill({ query: search.value }), 'al-action')); return; }
      methods.forEach(item => {
        const control = button(title(item), () => { methodSelection = item.id; drawDetail(item); rail.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button === control))); }, 'al-method-choice');
        control.setAttribute('aria-pressed', String(item.id === selected.id));
        const subtitle = el('small', [item.collection, item.duration].filter(Boolean).join(' · ')); control.append(subtitle); rail.append(control);
      });
      drawDetail(selected);
    };
    function drawDetail(item) {
      detail.replaceChildren(kicker(item.collection || 'Methodenbestand'), el('h4', title(item)));
      if (item.duration) detail.append(note(`Zeitangabe des Originals: ${item.duration}. Du kannst früher aufhören.`));
      const corrected = Boolean(item.editorialCorrections?.[0]?.editorialText);
      markdown(corrected ? displaySummary(item) : item.body || displaySummary(item), detail);
      if (corrected) editorialContext(item, detail);
      if (!corrected && item.steps?.length && !item.body) { const list = el('ol'); item.steps.forEach(text => list.append(el('li', text))); detail.append(list); }
      original(item, detail); sourceList(item.sourceIds, detail);
      detail.append(button('Passende angeleitete Alltagshilfe öffnen', () => onSkill({ query: title(item), nodeId: item.id }), 'al-action'));
      detail.append(note('Eine Alltagshilfe ersetzt keine fachlich begleitete Traumabehandlung. Bei Reizüberlastung und Unbehagen darfst du abbrechen oder eine außenorientierte Alternative wählen.'));
    }
    search.addEventListener('input', draw); state.addEventListener('change', draw); situation.addEventListener('change', draw); draw(); pendingNode = null;
  }
  function renderLearning() {
    panel.append(kicker('Wissen wiederfinden'), el('h3', 'Fragen statt Prüfung'), el('p', 'Lernkarten helfen beim Wiederansehen. Lernpfade verbinden vorhandene Begriffe, Modelle und Quellen. Es gibt keine Bewertung deiner Person.'));
    const modes = el('div', undefined, 'al-segments');
    [['cards', 'Geprüfte Lernkarten'], ['paths', 'Erkundungspfade']].forEach(([id, label]) => { const control = button(label, () => { learningMode = id; renderBody(); }); control.setAttribute('aria-pressed', String(learningMode === id)); modes.append(control); });
    const content = el('div'); panel.append(modes, content);
    function renderBody() {
      modes.querySelectorAll('button').forEach((control, index) => control.setAttribute('aria-pressed', String(learningMode === (index ? 'paths' : 'cards'))));
      content.replaceChildren(); if (learningMode === 'paths') { drawPath(); return; } drawCards();
    }
    function drawCards() {
      content.replaceChildren(); const cards = data.cards;
      if (!cards.length) { content.append(note('Die Lernkarten sind gerade nicht erreichbar. Die Erkundungspfade bleiben verfügbar.')); return; }
      cardIndex = Math.min(cardIndex, cards.length - 1); const card = cards[cardIndex];
      const progress = el('div', undefined, 'al-learning-progress');
      cards.forEach((item, index) => { const dot = button(`${index + 1}`, () => { cardIndex = index; cardRevealed = false; drawCards(); }, 'al-card-dot'); dot.setAttribute('aria-label', `Lernkarte ${index + 1}: ${item.question}`); dot.setAttribute('aria-current', index === cardIndex ? 'step' : 'false'); if (seenCards.has(item.id)) dot.classList.add('is-seen'); if (revisitCards.has(item.id)) dot.classList.add('is-revisit'); progress.append(dot); });
      const sheet = el('article', undefined, 'al-learning-sheet'); sheet.append(kicker(`Lernkarte ${cardIndex + 1} von ${cards.length}`), el('h4', card.question));
      const answer = el('div', undefined, 'al-card-answer'); answer.hidden = !cardRevealed;
      answer.append(el('p', card.answer)); sourceList(card.sourceIds, answer);
      if (card.origin?.change) answer.append(note(card.origin.change));
      const reveal = button(cardRevealed ? 'Antwort wieder verdecken' : 'Antwort ansehen', () => { cardRevealed = !cardRevealed; drawCards(); }, 'al-action'); reveal.setAttribute('aria-expanded', String(cardRevealed));
      reveal.dataset.alFocus = 'reveal-answer';
      sheet.append(reveal, answer);
      const actions = el('div', undefined, 'al-actions');
      actions.append(button('Erneut ansehen', () => { revisitCards.add(card.id); seenCards.delete(card.id); advance(); }), button('Fürs Erste verstanden', () => { seenCards.add(card.id); revisitCards.delete(card.id); advance(); }));
      sheet.append(actions, note(`In dieser Sitzung: ${seenCards.size} fürs Erste verstanden, ${revisitCards.size} zum Wiederansehen. Kein Test und kein persönlicher Score. Beim Neuladen beginnt diese freiwillige Lernmarkierung neu.`));
      const nav = el('div', undefined, 'al-actions'); nav.append(button('Vorherige Karte', () => { cardIndex = (cardIndex - 1 + cards.length) % cards.length; cardRevealed = false; drawCards(); }), button('Nächste Karte', advance));
      content.append(progress, sheet, nav, note('Herkunft: NotebookLM-Ausgangsmaterial, redaktionell ausgewählt und korrigiert. 27 von 50 ursprünglichen Karten; keine Übernahme ungeprüfter Zahlen. Die fachlichen Korrekturen stehen jeweils bei der Antwort.'));
      function advance() { cardIndex = (cardIndex + 1) % cards.length; cardRevealed = false; drawCards(); }
    }
    function drawPath() {
      const paths = data.paths; if (!paths.length) { content.append(note('Keine Lernpfade im Bestand.')); return; }
      const path = paths[pathIndex] || paths[0];
      const picker = select(paths.map((item, index) => [String(index), item.title]), String(pathIndex)); content.append(field('Vorhandenen Lernpfad wählen', picker), el('p', path.question, 'al-lead'));
      const entries = (path.nodeIds || []).map(id => data.byId.get(id)).filter(Boolean);
      const route = el('ol', undefined, 'al-route'); const detail = el('article', undefined, 'al-learning-sheet');
      entries.forEach((entry, index) => { const row = el('li'), control = button(title(entry), () => { pathStep = index; drawStep(); }); control.setAttribute('aria-current', pathStep === index ? 'step' : 'false'); row.append(control); route.append(row); });
      const spread = el('div', undefined, 'al-path-layout'); spread.append(route, detail); content.append(spread);
      picker.addEventListener('change', () => { pathIndex = Number(picker.value); pathStep = 0; renderBody(); });
      function drawStep() {
        const entry = entries[Math.min(pathStep, entries.length - 1)]; if (!entry) return;
        route.querySelectorAll('button').forEach((control, index) => control.setAttribute('aria-current', pathStep === index ? 'step' : 'false'));
        detail.replaceChildren(kicker(`Station ${pathStep + 1} von ${entries.length}`), el('h4', title(entry)), el('p', displaySummary(entry) || ''));
        if (entry.editorialCorrections?.[0]?.editorialText) editorialContext(entry, detail);
        else if (entry.body && entry.body !== entry.summary) { const deeper = el('details'); deeper.append(el('summary', 'Vorhandenen Text vertiefen')); markdown(entry.body, deeper); detail.append(deeper); }
        original(entry, detail); sourceList(entry.sourceIds, detail);
        const actions = el('div', undefined, 'al-actions');
        const back = button('Vorherige Station', () => { pathStep = Math.max(0, pathStep - 1); drawStep(); }); back.disabled = pathStep === 0;
        const next = button('Nächste Station', () => { pathStep = Math.min(entries.length - 1, pathStep + 1); drawStep(); }); next.disabled = pathStep === entries.length - 1;
        actions.append(back, next); detail.append(actions);
      }
      drawStep();
    }
    renderBody();
  }
  return { ready, open, destroy() { dead = true; abort.abort(); root.remove(); } };
}
