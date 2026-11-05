// Source-bound editorial matrix from the existing Neuroatlas, not a diagnostic score.
export function renderNeuroHeatmap(target, { entries = [], relations = [], sources = [], allowedEntryIds = null, initialState = {}, onStateChange = () => {}, onRead = () => {} } = {}) {
  if (!target?.ownerDocument) throw new TypeError('Die Neuroatlas-Matrix benötigt einen Anzeigebereich.');
  const doc = target.ownerDocument;
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const sourceById = new Map(sources.map(source => [source.id, source]));
  // Keep full entry metadata for the readable endpoints, dimensions and sources.
  // A globally selected phenomenon or context brings its documented counterpart.
  const allowed = allowedEntryIds == null ? null : new Set(allowedEntryIds);
  const associations = relations.filter(relation => relation.from?.startsWith('neuro:') && relation.to?.startsWith('context:') && byId.has(relation.from) && byId.has(relation.to) && (!allowed || allowed.has(relation.from) || allowed.has(relation.to)));
  const collator = new Intl.Collator('de');
  const sortEntries = values => [...values].sort((a, b) => collator.compare(a.title, b.title));
  const phenomena = sortEntries(new Set(associations.map(relation => byId.get(relation.from))));
  const contexts = sortEntries(new Set(associations.map(relation => byId.get(relation.to))));
  const dimensions = [...new Set(phenomena.map(entry => entry.dimensionId).filter(Boolean))].map(id => ({ id, title: byId.get(`dimension:${id}`)?.title || 'Weitere Erfahrungsdimension' })).sort((a, b) => collator.compare(a.title, b.title));
  const pairs = new Map();
  for (const relation of associations) {
    const key = JSON.stringify([relation.from, relation.to]);
    if (!pairs.has(key)) pairs.set(key, []);
    pairs.get(key).push(relation);
  }
  const el = (tag, text, className) => {
    const node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const root = el('section', undefined, 'neuro-map');
  const style = el('style');
  style.textContent = `
    .neuro-map{--nm-ink:#173e35;--nm-soft:#f0f4ed;--nm-line:#b5c6b8;color:var(--nm-ink);margin-block:1.5rem}
    .neuro-map *{box-sizing:border-box}.neuro-map h2,.neuro-map h3,.neuro-map h4{color:inherit}
    .neuro-map p{max-width:78ch}.neuro-map-caption{font-size:.91rem;line-height:1.55}
    .neuro-map-controls{display:flex;flex-wrap:wrap;gap:.8rem;margin-block:1.25rem}
    .neuro-map-controls label{display:flex;flex:1 1 14rem;flex-direction:column;gap:.35rem;font-weight:600}
    .neuro-map-controls input,.neuro-map-controls select{width:100%;min-height:44px;border:1px solid var(--nm-line);border-radius:.5rem;background:#fff;color:var(--nm-ink);padding:.65rem;font:inherit}
    .neuro-map-scroll{overflow:auto;max-height:65vh;border:1px solid var(--nm-line);border-radius:.65rem;background:#fff;isolation:isolate;overscroll-behavior:contain}
    .neuro-map table{border-collapse:separate;border-spacing:0;width:max-content;min-width:100%;font-size:.9rem;line-height:1.35}
    .neuro-map th,.neuro-map td{border-right:1px solid #d4dfd5;border-bottom:1px solid #d4dfd5;padding:.55rem;text-align:center;vertical-align:middle;min-width:8rem;max-width:11rem}
    .neuro-map thead th{position:sticky;top:0;background:var(--nm-soft);z-index:2;font-weight:700}
    .neuro-map tbody th{position:sticky;left:0;z-index:1;background:#fff;text-align:left;min-width:12rem;max-width:17rem}
    .neuro-map thead th:first-child{left:0;z-index:3;min-width:12rem}
    .neuro-map button{font:inherit;cursor:pointer}.neuro-map-cell{display:block;width:100%;min-height:44px;border:1px solid #aac6af;border-radius:.35rem;background:#e3efe3;color:#163e31;padding:.4rem;font-weight:700}
    .neuro-map-cell[aria-pressed=true]{background:#245744;color:#fff;border-color:#245744}.neuro-map-empty{color:#63776b}
    .neuro-map :focus-visible{outline:3px solid #9b4c11;outline-offset:3px}
    .neuro-map-detail{margin-top:1rem;padding:clamp(1rem,3vw,1.7rem);border:1px solid var(--nm-line);border-radius:.7rem;background:#f8faf5}
    .neuro-map-detail ul{padding-left:1.4rem}.neuro-map-detail li{margin-bottom:.8rem}.neuro-map-detail a{color:#225637;text-decoration:underline;text-underline-offset:.16em;overflow-wrap:anywhere}
    .neuro-map-detail .neuro-map-actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1rem}.neuro-map-actions button{min-height:44px;padding:.6rem .9rem;color:#fff;background:#245744;border:1px solid #245744;border-radius:.4rem}
    .neuro-map-detail details{margin-top:1.25rem}.neuro-map-detail summary{cursor:pointer}.neuro-map-detail pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.8rem}
    @media(max-width:600px){.neuro-map tbody th,.neuro-map thead th:first-child{min-width:9.5rem;max-width:11rem}.neuro-map th,.neuro-map td{min-width:7.5rem}.neuro-map-scroll{max-height:58vh}.neuro-map-controls{gap:.65rem}}
    @media(prefers-reduced-motion:reduce){.neuro-map *{scroll-behavior:auto!important;transition:none!important}}
  `;
  root.append(style, el('h2', 'Welche Phänomene werden in welchen Kontexten beschrieben?'));
  root.append(el('p', 'Diese Matrix bewahrt die quellenbezogenen Zuordnungen des ursprünglichen Neuroatlas. Eine grüne Zelle bedeutet ausschließlich: Der Katalog beschreibt dieses Phänomen in diesem Kontext. Sie zeigt weder Häufigkeit noch Stärke, Risiko oder eine persönliche Diagnose.'));
  root.append(el('p', 'Ein Strich bedeutet: Hier ist keine Zuordnung im Katalog eingetragen. Das schließt einen Zusammenhang nicht aus. Die Quellen sind überwiegend öffentliche Gesundheitsinformationen; daraus werden keine Evidenzstufen abgeleitet.', 'neuro-map-caption'));
  const controls = el('div', undefined, 'neuro-map-controls');
  const searchLabel = el('label', 'Phänomen suchen');
  const search = el('input'); search.type = 'search'; search.placeholder = 'Zum Beispiel Konzentration, Schlaf, Schmerz …';
  searchLabel.append(search);
  const dimensionLabel = el('label', 'Erfahrungsdimension');
  const dimensionSelect = el('select');
  const contextLabel = el('label', 'Beschrieben im Kontext');
  const contextSelect = el('select');
  const option = (title, value) => { const node = el('option', title); node.value = value; return node; };
  dimensionSelect.append(option('Alle Erfahrungsdimensionen', ''), ...dimensions.map(item => option(item.title, item.id)));
  contextSelect.append(option('Alle Kontexte', ''), ...contexts.map(item => option(item.title, item.id)));
  search.value = String(initialState.query || '');
  if (dimensions.some(item => item.id === initialState.dimensionId)) dimensionSelect.value = initialState.dimensionId;
  if (contexts.some(item => item.id === initialState.contextId)) contextSelect.value = initialState.contextId;
  dimensionLabel.append(dimensionSelect); contextLabel.append(contextSelect);
  controls.append(searchLabel, dimensionLabel, contextLabel); root.append(controls);
  const status = el('p', '', 'neuro-map-caption'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const help = el('p', 'Die Tabelle lässt sich seitlich und nach unten scrollen. Mit der Tabulatortaste erreichst du die grünen Quellenzellen. Enter oder die Leertaste öffnet die Beschreibung und ihre Grenzen.', 'neuro-map-caption');
  const matrix = el('div', undefined, 'neuro-map-scroll'); matrix.tabIndex = 0; matrix.setAttribute('role', 'region'); matrix.setAttribute('aria-label', 'Scrollbare Matrix von Phänomenen und Kontexten');
  const detail = el('div', undefined, 'neuro-map-detail'); detail.setAttribute('aria-live', 'polite');
  root.append(status, help, matrix, detail);
  target.replaceChildren(root);
  let selectedPair = pairs.has(initialState.selectedPair) ? initialState.selectedPair : null;
  const getState = () => ({ query: search.value, dimensionId: dimensionSelect.value, contextId: contextSelect.value, selectedPair });
  const normal = text => String(text || '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const sourceLink = source => {
    const url = source.url || source.href;
    if (!/^https?:\/\//i.test(url || '')) return el('span', source.title || 'Quelle im Originalbestand');
    const anchor = el('a', source.title || 'Originalquelle'); anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; return anchor;
  };
  function readPair(from, to, notify = true) {
    selectedPair = JSON.stringify([from, to]);
    matrix.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', button._pair === selectedPair ? 'true' : 'false'));
    const records = pairs.get(selectedPair) || [];
    const phenomenon = byId.get(from), context = byId.get(to);
    detail.replaceChildren(el('h3', `${phenomenon.title} · ${context.title}`));
    detail.append(el('p', 'Quellenbezogene redaktionelle Zuordnung aus dem Neuroatlas. Ähnliches Erleben kann mehrere Erklärungen haben.', 'neuro-map-caption'));
    for (const relation of records) {
      const paragraphs = String(relation.detail || relation.description || '').split(/\n\s*\n/).filter(Boolean);
      detail.append(el('h4', 'Beschreibung im Kontext'), el('p', paragraphs.shift() || 'Im Originalkatalog als Zusammenhang beschrieben.'));
      const qualification = paragraphs.join('\n\n') || relation.qualification;
      if (qualification) detail.append(el('h4', 'Grenze der Einordnung'), el('p', qualification));
      const refs = [...new Set(relation.sourceIds || [])].map(id => sourceById.get(id)).filter(Boolean);
      if (refs.length) {
        detail.append(el('h4', 'Quellen für genau diese Zuordnung'));
        const list = el('ul');
        for (const source of refs) {
          const item = el('li'); item.append(sourceLink(source));
          const metadata = [source.publisher, source.accessedAt ? `Zugriff im Originalbestand: ${source.accessedAt}` : ''].filter(Boolean).join(' · ');
          if (metadata) item.append(el('p', metadata, 'neuro-map-caption'));
          const scope = source.scopeNote || source.readScope || source.boundary || source.summary;
          if (scope) item.append(el('p', scope, 'neuro-map-caption'));
          list.append(item);
        }
        detail.append(list);
      } else detail.append(el('p', 'An dieser Zuordnung ist keine auflösbare Einzelquelle hinterlegt. Das ist eine Grenze des übernommenen Registers.'));
      const origin = typeof relation.provenance === 'string' ? relation.provenance : relation.provenance?.title;
      if (origin) detail.append(el('p', `Herkunft: ${origin}`, 'neuro-map-caption'));
    }
    const actions = el('div', undefined, 'neuro-map-actions');
    for (const [id, title] of [[from, 'Phänomen vollständig lesen'], [to, 'Kontext und unterscheidende Fragen lesen']]) {
      const button = el('button', title); button.type = 'button'; button.addEventListener('click', () => onRead(id)); actions.append(button);
    }
    detail.append(actions);
    const technical = el('details'), summary = el('summary', 'Technische Herkunft öffnen');
    technical.append(summary, el('pre', JSON.stringify({ from, to, relations: records }, null, 2))); detail.append(technical);
    if (notify) onStateChange(getState());
  }
  function renderMatrix() {
    const query = normal(search.value);
    const rows = phenomena.filter(entry => (!dimensionSelect.value || entry.dimensionId === dimensionSelect.value) && normal([entry.title, entry.summary, ...(entry.aliases || [])].join(' ')).includes(query));
    const columns = contexts.filter(entry => !contextSelect.value || entry.id === contextSelect.value);
    const rowIds = new Set(rows.map(entry => entry.id)), columnIds = new Set(columns.map(entry => entry.id));
    const visible = associations.filter(relation => rowIds.has(relation.from) && columnIds.has(relation.to));
    status.textContent = `${rows.length} Phänomene · ${columns.length} Kontexte · ${visible.length} von ${associations.length} ursprünglichen Quellenzuordnungen in dieser Auswahl.`;
    matrix.replaceChildren();
    if (!rows.length || !columns.length) {
      matrix.append(el('p', 'Für diese Filter gibt es keine passenden Einträge. Ändere die Suche oder Erfahrungsdimension.'));
    } else {
      const table = el('table'), caption = el('caption', 'Quellenzuordnungen im Neuroatlas: ● = beschrieben; – = keine Zuordnung im Katalog.');
      caption.style.cssText = 'text-align:left;padding:.8rem;'; table.append(caption);
      const thead = el('thead'), header = el('tr'), corner = el('th', 'Phänomen'); corner.scope = 'col'; header.append(corner);
      for (const context of columns) { const th = el('th', context.title); th.scope = 'col'; header.append(th); }
      thead.append(header); table.append(thead);
      const tbody = el('tbody');
      for (const phenomenon of rows) {
        const row = el('tr'), title = el('th', phenomenon.title); title.scope = 'row'; row.append(title);
        for (const context of columns) {
          const key = JSON.stringify([phenomenon.id, context.id]), cell = el('td');
          if (pairs.has(key)) {
            const button = el('button', '●', 'neuro-map-cell'); button.type = 'button'; button._pair = key;
            button.setAttribute('aria-label', `${phenomenon.title} im Kontext ${context.title}: Beschreibung, Grenze und Quellen lesen`);
            button.setAttribute('aria-pressed', selectedPair === key ? 'true' : 'false');
            button.addEventListener('click', () => readPair(phenomenon.id, context.id)); cell.append(button);
          } else { cell.textContent = '–'; cell.className = 'neuro-map-empty'; cell.setAttribute('aria-label', 'Keine Zuordnung im Katalog; kein Ausschluss eines Zusammenhangs'); }
          row.append(cell);
        }
        tbody.append(row);
      }
      table.append(tbody); matrix.append(table);
    }
    if (selectedPair) {
      const [from, to] = JSON.parse(selectedPair);
      if (rowIds.has(from) && columnIds.has(to)) readPair(from, to, false);
      else { selectedPair = null; detail.replaceChildren(el('p', 'Wähle eine grüne Zelle, um Beschreibung, Aussagegrenze und genau zugeordnete Quellen zu lesen.')); }
    } else detail.replaceChildren(el('p', 'Wähle eine grüne Zelle, um Beschreibung, Aussagegrenze und genau zugeordnete Quellen zu lesen.'));
    onStateChange(getState());
  }
  search.addEventListener('input', renderMatrix); dimensionSelect.addEventListener('change', renderMatrix); contextSelect.addEventListener('change', renderMatrix);
  renderMatrix();
  return { element: root, associationCount: associations.length, getState };
}
