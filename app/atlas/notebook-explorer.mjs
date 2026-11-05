import { publicText } from './atlas-public-copy.mjs';
// Interactive Atlas presentation of actual NotebookLM outputs and the research ledger.
// Original grouping, reviewed interpretation and provider progress remain distinct.
export function renderNotebookExplorer(target, data = {}) {
  if (!target?.ownerDocument) throw new TypeError('Der Forschungsraum benötigt einen Anzeigebereich.');
  const doc = target.ownerDocument;
  const progress = data.progress || {}, mapData = data.mindmapTree || {}, report = data.report || {};
  const sources = new Map((report.sources || []).map(source => [source.id, source]));
  const el = (tag, text, className) => { const node = doc.createElement(tag); if (text !== undefined) node.textContent = publicText(text); if (className) node.className = className; return node; };
  const button = (text, action, className) => { const node = el('button', text, className); node.type = 'button'; node.addEventListener('click', action); return node; };
  const norm = value => String(value || '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const safeUrl = value => { try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.href : null; } catch { return null; } };
  const link = (title, value) => { const url = safeUrl(value); if (!url) return el('span', title); const node = el('a', title); node.href = url; node.target = '_blank'; node.rel = 'noopener noreferrer'; return node; };
  const list = items => { const node = el('ul'); for (const text of items || []) node.append(el('li', text)); return node; };
  const details = (title, ...children) => { const node = el('details'); node.append(el('summary', title), ...children); return node; };
  const root = el('section', undefined, 'notebook-explorer');
  root.setAttribute('aria-label', 'NotebookLM und Forschung erkunden');
  const style = el('style');
  style.textContent = `
    .notebook-explorer{--nx-ink:#203f3a;--nx-muted:#485f5a;--nx-line:#9bb3aa;--nx-pale:#eef5ef;--nx-accent:#285b49;--ink:var(--nx-ink);--muted:var(--nx-muted);--line:var(--nx-line);--mint:var(--nx-accent);color-scheme:light;background:#edf0e7;color:var(--nx-ink);padding:clamp(16px,3vw,40px);border-radius:10px;line-height:1.65;max-width:100%;overflow-wrap:anywhere}.notebook-explorer *{box-sizing:border-box}.notebook-explorer h2,.notebook-explorer h3,.notebook-explorer h4{line-height:1.3}.notebook-explorer button,.notebook-explorer input,.notebook-explorer select{font:inherit}.notebook-explorer button,.notebook-explorer select{min-height:44px}.notebook-explorer button{cursor:pointer;border:1px solid var(--nx-line);border-radius:.45rem;padding:.55rem .8rem;background:#fff;color:var(--nx-ink)}.notebook-explorer button:hover{background:var(--nx-pale)}.notebook-explorer button[aria-pressed=true]{background:var(--nx-accent);color:#fff;border-color:var(--nx-accent)}#shared-atlas .notebook-explorer :focus-visible,.notebook-explorer :focus-visible{outline:3px solid #94561e;outline-offset:3px}.notebook-explorer a{color:#255b45;text-decoration:underline;text-underline-offset:.16em}.notebook-explorer summary{cursor:pointer;padding:.5rem 0;min-height:44px}.notebook-explorer details{margin:.7rem 0}.notebook-explorer li{margin:.3rem 0}.nx-tabs,.nx-toolbar,.nx-section-nav,.nx-pager{display:flex;gap:.5rem;flex-wrap:wrap;align-items:center;margin:1rem 0}.nx-caption{font-size:.9rem;color:var(--nx-muted)}.nx-panel{padding-top:.5rem;min-width:0}.nx-note{padding:.8rem 1rem;background:var(--nx-pale);border-left:4px solid var(--nx-accent);margin:1rem 0}.nx-map-layout{display:grid;grid-template-columns:minmax(260px,.95fr) minmax(280px,1.05fr);gap:1.25rem;align-items:start}.nx-tree-panel{max-height:640px;overflow:auto;border:1px solid var(--nx-line);border-radius:.6rem;padding:.7rem}.nx-tree,.nx-tree ul{list-style:none;margin:0;padding:0}.nx-tree ul{padding-left:1.15rem;margin-left:.6rem;border-left:1px solid var(--nx-line)}.nx-tree-row{display:flex;align-items:flex-start;gap:.3rem;margin:.25rem 0}.nx-tree-toggle{flex:0 0 44px;padding:.3rem!important;font-size:1.1rem}.nx-tree-select{flex:1;text-align:left;border-color:transparent!important}.nx-tree-spacer{flex:0 0 44px}.nx-tree-tag{display:block;font-size:.75rem;font-weight:400}.nx-map-detail{padding:1rem;border:1px solid var(--nx-line);border-radius:.6rem;min-width:0}.nx-map-detail .nx-child{display:block;text-align:left;width:100%;margin:.4rem 0}.nx-correction{padding:.7rem 1rem;border-left:4px solid #9b6c31;background:#fcf7e9;margin:1rem 0}.nx-correction h4{margin:.1rem 0 .4rem}.nx-source-list{padding-left:1.15rem}.nx-source-list li{margin:.5rem 0}.nx-source-list details{font-size:.9rem}.nx-source-list dt{font-weight:650;margin-top:.5rem}.nx-source-list dd{margin-left:0}.nx-reading{max-width:78ch}.nx-quiz{padding:1rem;border:1px solid var(--nx-line);border-radius:.6rem;margin:1.25rem 0}.nx-quiz fieldset{border:0;padding:0;margin:0;min-width:0}.nx-quiz legend{font-weight:650;margin-bottom:.5rem}.nx-choice{display:flex;gap:.65rem;align-items:flex-start;padding:.65rem .4rem;min-height:44px;cursor:pointer}.nx-choice input{width:1.1rem;height:1.1rem;flex-shrink:0;margin-top:.25rem;accent-color:var(--nx-accent)}.nx-answer{margin-top:.8rem}.nx-filters{display:grid;grid-template-columns:minmax(180px,2fr) repeat(2,minmax(160px,1fr));gap:.8rem;margin:1rem 0}.nx-filters label{display:flex;flex-direction:column;gap:.35rem;font-weight:600}.nx-filters input,.nx-filters select{width:100%;min-height:44px;background:white;border:1px solid var(--nx-line);border-radius:.4rem;color:var(--nx-ink);padding:.55rem}.nx-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.7rem;margin:1rem 0}.nx-stat{padding:.8rem;background:var(--nx-pale);border-radius:.5rem}.nx-stat strong{display:block;font-size:1.5rem;line-height:1.3}.nx-stat span{font-size:.9rem}.nx-research-card{border-top:1px solid var(--nx-line);padding:1rem 0}.nx-research-card h4{margin:.2rem 0}.nx-status{font-weight:650;font-size:.9rem}.nx-research-card p{margin:.6rem 0}.nx-run{padding:.8rem 0;border-top:1px solid var(--nx-line)}.nx-run h4{margin:.2rem 0}.nx-section-nav button{text-align:left}.nx-report-copy{white-space:pre-wrap;max-height:35rem;overflow:auto;font-family:inherit}.nx-list-button{display:block;text-align:left;margin:.35rem 0;max-width:100%}
    .nx-tree-panel,.nx-tree-select,.nx-filters label,.nx-filters input,.nx-filters select{min-width:0}.notebook-explorer button{max-width:100%;white-space:normal}
    @media(max-width:760px){.nx-map-layout{grid-template-columns:minmax(0,1fr)}.nx-tree-panel{max-height:420px}.nx-filters{grid-template-columns:minmax(0,1fr)}.nx-tree ul{padding-left:.55rem;margin-left:.25rem}.nx-map-detail{padding:.8rem}}
    @media(prefers-reduced-motion:reduce){.notebook-explorer *{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
  `;
  root.append(style, el('h2', 'Forschung erkunden und verstehen'));
  root.append(el('p', 'Eine tatsächlich erzeugte NotebookLM-Mindmap, ein redaktionell geprüfter Bericht und die zusätzliche Recherchewelle werden hier auf unterschiedliche Weise zugänglich. Die interaktiven Ansichten sind Atlas-Entwicklungen.'));
  const tabs = el('div', undefined, 'nx-tabs'); tabs.setAttribute('role', 'group'); tabs.setAttribute('aria-label', 'Ansicht im Forschungsraum');
  const panel = el('div', undefined, 'nx-panel');
  let activeView = 'map', selectedSection = report.sections?.[0]?.id;
  const quizState = new Map();
  function sampleText(sample) {
    if (typeof sample !== 'object' || sample === null) return String(sample || '');
    const parts = [];
    if (sample.population) parts.push(sample.population);
    if (Number.isFinite(sample.interviews)) parts.push(`${sample.interviews} Interviews.`);
    if (Number.isFinite(sample.internetSources)) parts.push(`${sample.internetSources} öffentliche Internetquellen; keine zusätzlichen Studien.`);
    for (const [key, label] of [['randomized', 'randomisiert'], ['postRandomizationExcluded', 'nach Randomisierung ausgeschlossen'], ['analyzed', 'analysiert']]) if (Number.isFinite(sample[key])) parts.push(`${sample[key]} ${label}.`);
    if (sample.arms) parts.push(`Behandlungsgruppen: ${Object.entries(sample.arms).map(([name, count]) => `${name}: ${count}`).join('; ')}.`);
    if (Number.isFinite(sample.dropoutTotal)) parts.push(`${sample.dropoutTotal} Therapieabbrüche insgesamt.`);
    if (sample.dropoutArms) parts.push(`Therapieabbrüche nach Gruppe: ${Object.entries(sample.dropoutArms).map(([name, count]) => `${name}: ${count}`).join('; ')}.`);
    if (Array.isArray(sample.followUpMonths)) parts.push(`Nachbeobachtung nach ${sample.followUpMonths.join(' und ')} Monaten.`);
    return parts.join(' ');
  }
  function sourceList(ids) {
    const node = el('ul', undefined, 'nx-source-list');
    for (const id of [...new Set(ids || [])]) {
      const source = sources.get(id); if (!source) continue;
      const item = el('li'); item.append(link(source.title || 'Fachquelle öffnen', source.url));
      const who = Array.isArray(source.authors) ? source.authors.join(', ') : source.authors;
      if (who || source.year) item.append(el('div', [who, source.year].filter(Boolean).join(' · '), 'nx-caption'));
      const metadata = el('dl');
      for (const [field, label] of [['design', 'Art und Studiendesign'], ['sample', 'Stichprobe'], ['readScope', 'Tatsächlich geprüft']]) {
        if (source[field]) metadata.append(el('dt', label), el('dd', field === 'sample' ? (source.sampleDescription || sampleText(source[field])) : source[field]));
      }
      const limits = (source.limits || []).length ? list(source.limits) : null;
      const body = [metadata]; if (limits) body.push(el('p', 'Aussagegrenzen'), limits);
      if (safeUrl(source.fullTextURL)) body.push(link('Öffentlichen Volltext öffnen', source.fullTextURL));
      item.append(details('Prüfstand und Aussagegrenzen', ...body)); node.append(item);
    }
    return node;
  }
  function accountLink(url) {
    return details('Rückweg zum Notebook', el('p', 'Das Original liegt in deinem Google-Konto. Dieser Rückweg kann eine Anmeldung und passende Zugriffsrechte benötigen; die Lernansicht hier ist unabhängig davon lesbar.', 'nx-caption'), link('Original im Notebook öffnen', url));
  }
  const flatNodes = [], nodeParents = new Map();
  function collect(node, parent = null) { if (!node || typeof node.label !== 'string') return; flatNodes.push(node); if (parent) nodeParents.set(node, parent); for (const child of node.children || []) collect(child, node); }
  collect(mapData.tree);
  const expanded = new Set(flatNodes.filter(node => node.children?.length));
  let selectedNode = mapData.tree;
  function renderMap() {
    panel.append(el('h3', mapData.title || 'Die Mindmap erkunden'));
    if (!flatNodes.length) { panel.append(el('p', 'Für diese Ansicht liegt noch keine Baumkarte vor.')); return; }
    panel.append(el('p', mapData.review || 'Die Baumkarte gibt die Gliederung der tatsächlichen NotebookLM-Ausgabe wieder.'));
    panel.append(el('p', 'Linien bedeuten „gliedert in“. Die räumliche Anordnung zeigt keine Stärke, Entfernung oder Ursache. Präzisierungen erscheinen getrennt neben dem Originalbegriff.', 'nx-note'));
    const toolbar = el('div', undefined, 'nx-toolbar');
    const layout = el('div', undefined, 'nx-map-layout'), treePanel = el('div', undefined, 'nx-tree-panel');
    treePanel.setAttribute('aria-label', 'Gliederungsbaum der Mindmap');
    const detailPanel = el('div', undefined, 'nx-map-detail'); detailPanel.tabIndex = -1;
    layout.append(treePanel, detailPanel);
    const correctionFor = node => (mapData.corrections || []).filter(correction => correction.nodeLabel === node.label);
    const branchSection = node => {
      const chain = []; let current = node;
      while (current) { chain.unshift(current); current = nodeParents.get(current); }
      const sectionId = ({ 'Beobachtbare Phänomene und Erleben': 'betrachtungsebenen', 'Diagnosen und Abgrenzung': 'diagnosen', 'Schutz und Sicherheit': 'schutz', 'Modelle und Studien': 'studien', 'Herkunft': 'quellen' })[chain[1]?.label];
      return (report.sections || []).find(section => section.id === sectionId);
    };
    function showDetail(focus = false) {
      detailPanel.replaceChildren(); if (!selectedNode) return;
      const ancestors = []; let parent = nodeParents.get(selectedNode);
      while (parent) { ancestors.unshift(parent.label); parent = nodeParents.get(parent); }
      if (ancestors.length) detailPanel.append(el('p', ancestors.join(' › '), 'nx-caption'));
      detailPanel.append(el('h4', selectedNode.label));
      const children = selectedNode.children || [];
      detailPanel.append(el('p', children.length ? `Dieser Originalbegriff gliedert sich in ${children.length} untergeordnete Themen.` : 'Dieser Begriff ist ein Endpunkt der ursprünglichen Mindmap. Er ist keine vollständige fachliche Definition.', 'nx-caption'));
      const corrections = correctionFor(selectedNode);
      for (const correction of corrections) {
        const box = el('div', undefined, 'nx-correction'); box.append(el('h4', 'Geprüfte Präzisierung'), el('p', correction.publicCorrection), sourceList(correction.sourceIds)); detailPanel.append(box);
      }
      if (children.length) { const childNav = el('div'); childNav.append(el('p', 'Untergeordnete Themen öffnen:')); for (const child of children) childNav.append(button(child.label, () => { selectedNode = child; expanded.add(selectedNode); drawTree(); showDetail(true); }, 'nx-child')); detailPanel.append(childNav); }
      const section = branchSection(selectedNode);
      if (section) {
        const explanation = el('div'); explanation.append(el('h4', 'Einordnung in der geprüften Lernfassung'), el('p', 'Die folgende Verbindung zum Bericht ist eine redaktionelle Lesehilfe des Atlas.', 'nx-caption'));
        const first = (section.blocks || []).find(block => block.type === 'paragraph'); if (first) explanation.append(el('p', first.text));
        explanation.append(button(`Im Bericht weiterlesen: ${section.title}`, () => { selectedSection = section.id; switchView('report', true); }), sourceList(section.sourceIds)); detailPanel.append(explanation);
      } else detailPanel.append(el('p', 'Wähle einen Zweig, um die Originalgliederung, die zugehörigen fachlichen Präzisierungen und den Rückweg zur geprüften Lernfassung zu erkunden.'));
      if (focus) detailPanel.focus();
    }
    function drawTree() {
      treePanel.replaceChildren();
      function branch(node) {
        const item = el('li'), row = el('div', undefined, 'nx-tree-row'), children = node.children || [];
        if (children.length) {
          const toggle = button(expanded.has(node) ? '−' : '+', () => { const open = !expanded.has(node); if (open) expanded.add(node); else expanded.delete(node); childList.hidden = !open; toggle.textContent = open ? '−' : '+'; toggle.setAttribute('aria-expanded', String(open)); });
          toggle.className = 'nx-tree-toggle'; toggle.setAttribute('aria-label', `Unterthemen von ${node.label}`); toggle.setAttribute('aria-expanded', String(expanded.has(node))); row.append(toggle);
        } else row.append(el('span', undefined, 'nx-tree-spacer'));
        const choice = button(node.label, () => { selectedNode = node; for (const previous of treePanel.querySelectorAll('.nx-tree-select')) previous.setAttribute('aria-pressed', 'false'); choice.setAttribute('aria-pressed', 'true'); showDetail(true); }, 'nx-tree-select');
        choice.setAttribute('aria-pressed', String(selectedNode === node));
        if (correctionFor(node).length) choice.append(el('span', 'Geprüfte Präzisierung vorhanden', 'nx-tree-tag'));
        row.append(choice); item.append(row);
        const childList = el('ul'); childList.hidden = !expanded.has(node); for (const child of children) childList.append(branch(child)); if (children.length) item.append(childList);
        return item;
      }
      const tree = el('ul', undefined, 'nx-tree'); tree.append(branch(mapData.tree)); treePanel.append(tree);
    }
    toolbar.append(button('Alle Zweige öffnen', () => { for (const node of flatNodes) if (node.children?.length) expanded.add(node); drawTree(); }), button('Zweige einklappen', () => { expanded.clear(); expanded.add(mapData.tree); drawTree(); }));
    panel.append(toolbar, layout); drawTree(); showDetail();
    const complete = details(`Vollständige Begriffsliste · ${flatNodes.length} Begriffe`);
    for (const node of flatNodes) complete.append(button(node.label, () => { selectedNode = node; let parent = nodeParents.get(node); while (parent) { expanded.add(parent); parent = nodeParents.get(parent); } drawTree(); showDetail(true); }, 'nx-list-button'));
    panel.append(complete, details('Quellen der Lehrgrundlage', sourceList(mapData.sourceIds)), accountLink(mapData.notebookUrl));
  }
  function renderQuestion(question) {
    const form = el('form', undefined, 'nx-quiz'), fieldset = el('fieldset'); fieldset.append(el('legend', question.question));
    const saved = quizState.get(question.id) || { selected: null, revealed: false };
    const feedback = el('div', undefined, 'nx-answer'); feedback.setAttribute('aria-live', 'polite');
    const radios = [];
    (question.choices || []).forEach((choice, index) => {
      const label = el('label', undefined, 'nx-choice'), radio = el('input'); radio.type = 'radio'; radio.name = 'understanding-choice'; radio.value = String(index); radio.checked = saved.selected === index;
      radio.addEventListener('change', () => { saved.selected = index; saved.revealed = false; quizState.set(question.id, saved); feedback.replaceChildren(); });
      radios.push(radio); label.append(radio, el('span', choice.text)); fieldset.append(label);
    });
    function reveal() {
      feedback.replaceChildren();
      if (saved.selected === null) { feedback.append(el('p', 'Wähle eine Antwort, um die Erläuterung zu öffnen.')); return; }
      saved.revealed = true; quizState.set(question.id, saved);
      const correct = Boolean(question.choices?.[saved.selected]?.correct);
      feedback.append(el('p', correct ? 'Diese Antwort passt zur geprüften Lernfassung.' : 'Diese Antwort wird durch die geprüfte Lernfassung nicht gedeckt.'), el('p', question.explanation));
      if (!correct) { const answer = (question.choices || []).find(choice => choice.correct); if (answer) feedback.append(el('p', `Passende Antwort: ${answer.text}`)); }
      feedback.append(sourceList(question.sourceIds), button('Noch einmal überlegen', () => { saved.selected = null; saved.revealed = false; quizState.set(question.id, saved); for (const radio of radios) radio.checked = false; feedback.replaceChildren(); radios[0]?.focus(); }));
    }
    const submit = el('button', 'Antwort prüfen'); submit.type = 'submit'; form.append(fieldset, submit, feedback);
    form.addEventListener('submit', event => { event.preventDefault(); reveal(); }); if (saved.revealed) reveal();
    return form;
  }
  function renderReport() {
    panel.append(el('h3', report.title || 'Der geprüfte Bericht'), el('p', report.intro || ''));
    panel.append(el('p', 'Ausgangspunkt: ein tatsächlich erzeugter NotebookLM-Bericht. Die öffentliche Lernfassung wurde von Codex geprüft und redaktionell korrigiert. Abschnittswechsel und Lernfragen sind daraus entwickelte Atlas-Interaktionen.', 'nx-note'));
    const sections = report.sections || [];
    if (!sections.length) { if (report.markdown) { const copy = el('div', report.markdown, 'nx-report-copy'); copy.tabIndex = 0; copy.setAttribute('aria-label', 'Vollständige Lernfassung'); panel.append(copy); } else panel.append(el('p', 'Für diese Ansicht liegt noch kein Bericht vor.')); return; }
    if (!sections.some(section => section.id === selectedSection)) selectedSection = sections[0].id;
    const nav = el('div', undefined, 'nx-section-nav'); nav.setAttribute('role', 'group'); nav.setAttribute('aria-label', 'Abschnitte im Bericht');
    const reading = el('article', undefined, 'nx-reading'); reading.tabIndex = -1;
    function drawSection(focus = false) {
      reading.replaceChildren(); const section = sections.find(item => item.id === selectedSection);
      for (const control of nav.children) control.setAttribute('aria-pressed', String(control.dataset.section === selectedSection));
      reading.append(el('h4', section.title));
      for (const block of section.blocks || []) { if (block.type === 'paragraph') reading.append(el('p', block.text)); else if (block.type === 'list') reading.append(list(block.items)); }
      const questions = section.id === 'lernfragen' ? (report.questions || []) : (report.questions || []).filter(question => question.sectionId === section.id);
      if (questions.length) { reading.append(el('h4', 'Verständnis erproben'), el('p', 'Diese Fragen beziehen sich auf das Material. Deine Antworten bleiben nur während dieser Ansicht erhalten; es gibt keine persönliche Bewertung oder Diagnose.', 'nx-caption')); for (const question of questions) reading.append(renderQuestion(question)); }
      if (section.sourceIds?.length) reading.append(el('h4', 'Quellen zu diesem Abschnitt'), sourceList(section.sourceIds));
      if (section.reviewBasis || section.limits?.length) reading.append(details('Prüfgrundlage und Grenzen', el('p', section.reviewBasis || ''), list(section.limits)));
      if (focus) reading.focus();
    }
    for (const section of sections) { const control = button(section.title, () => { selectedSection = section.id; drawSection(true); }); control.dataset.section = section.id; nav.append(control); }
    panel.append(nav, reading); drawSection();
    const corrections = details('Redaktionelle Korrekturen am Notebook-Original');
    for (const correction of report.corrections || []) { const item = el('div', undefined, 'nx-correction'); item.append(el('h4', correction.section || 'Präzisierung'), el('p', correction.publicCorrection), sourceList(correction.sourceIds)); corrections.append(item); }
    panel.append(corrections, details('Prüfumfang dieser Lernfassung', el('p', report.reviewScope || ''), list(report.publicLimits)));
    if (report.markdown) { const copy = el('div', report.markdown, 'nx-report-copy'); copy.tabIndex = 0; copy.setAttribute('aria-label', 'Vollständige Lernfassung'); panel.append(details('Vollständige Lernfassung am Stück lesen', copy)); }
  }
  function renderProgress() {
    panel.append(el('h3', 'Die zusätzliche Recherchewelle'), el('p', '48 unterscheidbare Fragen schließen konkrete Lücken im bisherigen Atlas. Einige Fragen teilen sich einen Recherchelauf. Die folgenden Gesamtzahlen werden je Lauf gezählt; Fragekarten werden nicht addiert.'));
    const totals = progress.totals || {}, stats = el('div', undefined, 'nx-stats');
    const metrics = [['distinctQuestions', 'verschiedene Fragen'], ['startedQuestions', 'Fragen gestartet'], ['runsStarted', 'Rechercheläufe gestartet'], ['runsResultReceived', 'Läufe mit Ergebnis'], ['runsImported', 'Läufe mit Import'], ['providerFound', 'gemeldete Fundstellen'], ['sourceEntriesImported', 'importierte Quelleinträge'], ['reportEntriesImported', 'importierte Rohberichte'], ['providerReportsFullyReadByAudit', 'Rohberichte vollständig gelesen'], ['newPublicationAbstractsReadByAudit', 'verschiedene Publikationsabstracts gelesen'], ['newPrimaryFulltextsReadByAudit', 'neue Primärvolltexte vollständig gelesen']];
    for (const [key, label] of metrics) { const stat = el('div', undefined, 'nx-stat'); stat.append(el('strong', Number.isFinite(totals[key]) ? totals[key] : 'Offen'), el('span', label)); stats.append(stat); }
    panel.append(stats, el('p', 'Fundstellen sind Suchergebnisse. Importierte Quelleinträge sind Kandidaten, noch keine geprüften Belege. Die Zahl einzigartiger Studien ist nicht ermittelt. Die separat geprüften Quellen des Trauma-Berichts sind in diesen Recherchewerten nicht enthalten.', 'nx-note'));
    if (progress.updated) { const date = new Date(progress.updated); if (!Number.isNaN(date.getTime())) panel.append(el('p', `Erfasster Stand: ${date.toLocaleString('de-DE')}`, 'nx-caption')); }
    const questions = progress.questions || [], runs = progress.runs || [], byRun = new Map(runs.map(run => [run.id, run]));
    const filters = el('div', undefined, 'nx-filters');
    const searchLabel = el('label', 'Fragen und Lücken durchsuchen'), search = el('input'); search.type = 'search'; search.placeholder = 'Zum Beispiel: Schlaf, Scham oder Masking'; searchLabel.append(search);
    const topicLabel = el('label', 'Themenfeld'), topic = el('select'); topic.append(newOption('Alle Themenfelder', ''));
    for (const title of [...new Set(questions.map(question => question.notebookTitle).filter(Boolean))]) topic.append(newOption(title.replace(/^Atlas\s*·\s*/, ''), title)); topicLabel.append(topic);
    const statusLabel = el('label', 'Bearbeitungsstand'), status = el('select');
    for (const [value, label] of [['', 'Alle Bearbeitungsstände'], ['waiting', 'Gestartet · Ergebnis noch offen'], ['received', 'Ergebnis erhalten'], ['imported', 'Importiert'], ['read', 'Rohbericht gelesen'], ['verified', 'Einzelne Aussagen geprüft']]) status.append(newOption(label, value)); statusLabel.append(status); filters.append(searchLabel, topicLabel, statusLabel);
    const resultCount = el('p', undefined, 'nx-caption'); resultCount.setAttribute('role', 'status');
    const results = el('div'), pager = el('div', undefined, 'nx-pager');
    let page = 0; const pageSize = 8;
    function newOption(text, value) { const option = el('option', text); option.value = value; return option; }
    const stage = item => item.verified ? 'Einzelne Aussagen geprüft · Grenzen unter Neue Ergebnisse' : (item.readResult || item.read) ? 'Rohbericht gelesen · Originalquellen nur im dokumentierten Umfang geprüft' : item.imported ? 'Importiert · Prüfung der Originalquellen offen' : item.resultReceived ? 'Ergebnis erhalten · Import offen' : item.started ? 'Gestartet · Ergebnis noch offen' : 'Bearbeitung noch offen';
    function matchesStatus(question) { return !status.value || (status.value === 'waiting' ? question.started && !question.resultReceived : status.value === 'received' ? question.resultReceived : Boolean(question[status.value])); }
    function drawResults() {
      results.replaceChildren(); pager.replaceChildren();
      const term = norm(search.value), matching = questions.filter(question => (!topic.value || question.notebookTitle === topic.value) && matchesStatus(question) && (!term || norm([question.title, question.humanText, question.gap, question.notebookTitle].join(' ')).includes(term)));
      const pageCount = Math.max(1, Math.ceil(matching.length / pageSize)); page = Math.min(page, pageCount - 1);
      resultCount.textContent = `${matching.length} von ${questions.length} Fragen passen zur Auswahl. Die Gesamtzahlen oben bleiben unabhängig vom Filter.`;
      if (!matching.length) results.append(el('p', 'Keine Frage passt zu dieser Auswahl. Ändere Suchbegriff oder Filter.'));
      for (const question of matching.slice(page * pageSize, (page + 1) * pageSize)) {
        const card = el('article', undefined, 'nx-research-card'); card.append(el('p', String(question.notebookTitle || 'Atlas-Recherche').replace(/^Atlas\s*·\s*/, ''), 'nx-caption'), el('h4', question.title || 'Recherchefrage'), el('p', question.humanText || ''), el('p', stage(question), 'nx-status'));
        if (question.gap) card.append(details('Welche Lücke im Atlas schließt die Frage?', el('p', question.gap)));
        const run = byRun.get(question.runId); if (run) card.append(el('p', `${(run.questionIds || []).length} ${(run.questionIds || []).length === 1 ? 'Frage gehört' : 'Fragen gehören'} zu diesem Recherchelauf. Seine Fundstellen und Importe werden einmal in der Laufübersicht gezählt.`, 'nx-caption'));
        if (safeUrl(question.notebookUrl)) card.append(accountLink(question.notebookUrl)); results.append(card);
      }
      if (pageCount > 1) { const previous = button('Vorherige Fragen', () => { page--; drawResults(); resultCount.focus(); }), next = button('Weitere Fragen', () => { page++; drawResults(); resultCount.focus(); }); previous.disabled = page === 0; next.disabled = page >= pageCount - 1; pager.append(previous, el('span', `Seite ${page + 1} von ${pageCount}`), next); }
    }
    resultCount.tabIndex = -1;
    search.addEventListener('input', () => { page = 0; drawResults(); }); topic.addEventListener('change', () => { page = 0; drawResults(); }); status.addEventListener('change', () => { page = 0; drawResults(); });
    panel.append(filters, resultCount, results, pager); drawResults();
    const runList = details(`Rechercheläufe einzeln prüfen · ${runs.length} Läufe`);
    for (const run of runs) {
      const item = el('article', undefined, 'nx-run'); item.append(el('h4', String(run.title || 'Recherchelauf').replace(/^Atlas\s*·\s*/, '')), el('p', stage(run), 'nx-status'));
      const counts = run.counts || {}; const bits = [];
      for (const [key, label] of [['providerFound', 'gemeldete Fundstellen'], ['sourceEntries', 'importierte Quelleinträge'], ['reportEntries', 'importierte Rohberichte']]) if (Number.isFinite(counts[key])) bits.push(`${counts[key]} ${label}`);
      if (bits.length) item.append(el('p', bits.join(' · ')));
      const runQuestions = questions.filter(question => (run.questionIds || []).includes(question.id)); if (runQuestions.length) item.append(list(runQuestions.map(question => question.humanText || question.title)));
      if (safeUrl(run.notebookUrl)) item.append(accountLink(run.notebookUrl)); runList.append(item);
    }
    panel.append(runList, details('Arbeitsweise und Grenzen', el('p', 'Die Recherchen wurden über das angemeldete Google-Konto in der vorhandenen Benutzeroberfläche gestartet. Eine gemeinsame Tokenabrechnung oder eine Steuerung von NotebookLM durch AI Studio ist nicht nachgewiesen. Ein zusätzlicher kostenpflichtiger API-Betrieb wurde nicht eingerichtet.'), el('p', 'Für alle 27 Rechercheläufe wurden Abschluss und Import in der Anbieteroberfläche geprüft. Sie bündeln 48 verschiedene Fragen. Ein empfangenes Ergebnis bedeutet noch nicht, dass jede Teilfrage tragfähig beantwortet ist. Importierte Rohberichte sind keine automatisch wissenschaftlich geprüften Synthesen.')));
  }
  function renderQuality() {
    const review = data.wave2Review || {}, scope = review.readScope || {};
    panel.append(el('h3', 'Was die neuen Recherchen tragen – und was korrigiert werden muss'), el('p', `${(scope.reportsFullyRead || []).length} neue NotebookLM-Rohberichte wurden vollständig gelesen. Die folgenden Einordnungen verhindern, dass ungesicherte Aussagen als Atlaswissen übernommen werden. Die vollständigen Anbieterberichte bleiben Forschungsrohfassungen.`));
    const fulltext=data.fulltextReview, fulltextCount=fulltext?.counts?.originalMainArticlesReadCompletely || 0;
    const counts = el('p', `${scope.totalDistinctPublicationAbstractsRead || scope.newPrimaryAbstractsRead || 0} verschiedene Publikationsabstracts in der früheren Prüfung gelesen · ${fulltextCount || scope.newPrimaryFullTextsCompletelyRead || 0} zusätzliche Hauptvolltexte vollständig gelesen.`, 'nx-status'); panel.append(counts);
    if(scope.limits) panel.append(el('p', `Prüfumfang der früheren Gegenprüfung: ${scope.limits}`, 'nx-caption'));
    if(fulltext){const completed=details('Zusätzliche Volltextprüfung: Methoden, Ergebnisse und Grenzen',el('p',fulltext.scope));for(const source of fulltext.sources || []){const article=el('article');article.append(link(source.title,source.url),el('p',[source.authors,source.year].filter(Boolean).join(' · ')),el('p',[source.design,sampleText(source.sample)].filter(Boolean).join('. ')),el('p',source.claim),el('p',`${source.readScope} ${source.boundary}`,'nx-caption'));completed.append(article);}panel.append(completed);}
    const reviewedSources = new Map((review.sources || []).map(source => [source.id, source]));
    for(const entry of review.reports || []) {
      const article = el('article', undefined, 'nx-report-section');
      article.append(el('h4', entry.title), el('p', entry.publicStatusText, 'nx-status'));
      for(const issue of entry.issues || []) {
        const correction = details(issue.topic, el('p', issue.publicCorrection));
        correction.append(el('p', `Grund der Korrektur: ${issue.problem}`, 'nx-caption'));
        for(const id of issue.sources || []) { const source=reviewedSources.get(id) || sources.get(id); if(source) correction.append(link(source.title, source.url)); }
        article.append(correction);
      }
      panel.append(article);
    }
    const sourceList=details('Quellen der Gegenprüfung und ihre Grenzen');
    for(const source of review.sources || []) {
      const article=el('article');article.append(link(source.title,source.url),el('p',[source.authors || source.author,source.year].filter(Boolean).join(' · ')),el('p',[source.design,(source.sampleDescription || sampleText(source.sample))].filter(Boolean).join('. ')),el('p',source.verifiedClaim || source.claim || source.category || 'Aussagen nur im dokumentierten Prüfumfang verwenden.'),el('p',`${source.readScope || ''} ${Array.isArray(source.limits)?source.limits.join(' '):source.limits || ''}`,'nx-caption'));sourceList.append(article);
    }
    panel.append(sourceList);
  }
  const views = [['map', 'Mindmap erkunden'], ['report', 'Bericht und Lernfragen'], ['progress', 'Recherchefragen und Fortschritt'], ['quality', 'Neue Ergebnisse gegenprüfen']];
  function switchView(name, focus = false) {
    activeView = name; panel.replaceChildren();
    for (const control of tabs.children) control.setAttribute('aria-pressed', String(control.dataset.view === activeView));
    if (activeView === 'report') renderReport(); else if (activeView === 'progress') renderProgress(); else if (activeView === 'quality') renderQuality(); else renderMap();
    if (focus) { panel.tabIndex = -1; panel.focus(); }
  }
  for (const [name, label] of views) { const control = button(label, () => switchView(name, true)); control.dataset.view = name; tabs.append(control); }
  root.append(tabs, panel); target.replaceChildren(root); switchView(activeView);
  return { element: root, mindmapNodeCount: flatNodes.length, researchQuestionCount: (progress.questions || []).length, researchRunCount: (progress.runs || []).length, reportSectionCount: (report.sections || []).length };
}
