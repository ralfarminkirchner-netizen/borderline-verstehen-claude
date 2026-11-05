// A navigable layout of actual collections. Coordinates carry no empirical meaning.
export function renderSpatialAtlas(target, { entries = [], relations = [], onRead = () => {}, onCollection = () => {} } = {}) {
  if (!target?.ownerDocument) throw new TypeError('Die Atlaslandschaft benötigt einen Anzeigebereich.');
  const doc = target.ownerDocument;
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  const names = [...new Set(entries.map(entry => entry.collection).filter(Boolean))];
  const cross = relations.filter(relation => byId.has(relation.from) && byId.has(relation.to) && byId.get(relation.from).collection !== byId.get(relation.to).collection);
  const normal = text => String(text || '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const themes = [
    { id: 'all', title: 'Alles erkunden', explanation: 'Alle tatsächlichen Einträge und Atlasbereiche bleiben zugänglich.' },
    { id: 'experience', title: 'Erleben', terms: /erleb|phanomen|wahrnehm|gefuhl|emotion|scham|selbstwert|identitat|schmerz|angst|leere|dissozi|konzentration|aufmerksam/, explanation: 'Titel und Schlagwörter zu Erleben, Wahrnehmung, Gefühlen, Scham, Selbstwert, Identität, Schmerz, Angst oder Aufmerksamkeit.' },
    { id: 'relationship', title: 'Beziehung', terms: /bezieh|bindung|nahe|autonom|zuruckweis|konflikt|grenz|mentalis|partner|kontakt|reparatur|einsam|scham|anerkenn/, explanation: 'Titel und Schlagwörter zu Beziehung, Bindung, Nähe, Autonomie, Zurückweisung, Grenzen, Konflikt und Reparatur.' },
    { id: 'development', title: 'Entwicklung', terms: /entwickl|kindheit|identitat|personlich|resilien|trauma|lernen|epigen|veranlag|geneti|neuro|autism|adhs|wachstum|biograf/, explanation: 'Titel und Schlagwörter zu Entwicklung, Kindheit, Persönlichkeit, Identität, Lernen, Genetik, Neuroentwicklung und Ressourcen nach Belastung.' },
    { id: 'body', title: 'Körper', terms: /korper|schlaf|stress|uberlast|sensor|sinnes|reiz|schmerz|arousal|atem|mudig|beweg|erschopf|vegetat|spannung|hyperaktiv|motor/, explanation: 'Titel und Schlagwörter zu Körper, Schlaf, Stress, Sinnesverarbeitung, Reizen, Überlastung, Schmerz, Atmung oder Erschöpfung.' },
    { id: 'methods', title: 'Methoden', terms: /methode|therap|behandl|ubung|unterstutz|ressourc|stabilis|grounding|fokus|plan|lernpfad/, explanation: 'Als Methode, Ressource, Übung oder Alltagsbaustein geführte Einträge sowie Titel und Schlagwörter zu Unterstützung, Behandlung, Stabilisierung und Lernpfaden.' }
  ];
  const practiceKinds = new Set(['method', 'resource', 'exercise', 'practice', 'methode', 'ressource', 'ubung', 'alltagsbaustein']);
  const kindName = kind => ({ method: 'Methode', resource: 'Ressource', exercise: 'Übung', practice: 'Alltagsbaustein', phenomenon: 'Phänomen', concept: 'Begriff', model: 'Modell', chapter: 'Lesekapitel', path: 'Lernpfad', finding: 'Befund', context: 'Kontext', source: 'Quelle', dimension: 'Erfahrungsdimension', instrument: 'Instrument', scene: 'Lehrszene', perspective: 'Perspektive', domain: 'Themenbereich', population: 'Untersuchte Personengruppe', 'interactive-model': 'Interaktives Modell' }[kind] || kind || 'Wissenseintrag');
  let theme = themes[0], selected = null, query = '', limit = 12;
  let view = doc.defaultView?.matchMedia?.('(max-width: 700px)').matches ? 'list' : 'map';
  function match(entry) {
    if (theme.id === 'all') return 'Alle Materialien dieses Atlasbereichs';
    if (theme.id === 'methods' && practiceKinds.has(normal(entry.kind))) return `Materialart: ${kindName(entry.kind)}`;
    if (theme.terms.test(normal(entry.title))) return `Zuordnung über den Titel: „${entry.title}“`;
    const tag = (entry.tags || []).find(value => theme.terms.test(normal(value)));
    return tag ? `Zuordnung über das Schlagwort: „${tag}“` : '';
  }
  const el = (tag, text, className) => { const node = doc.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
  const button = (title, action, className) => { const node = el('button', title, className); node.type = 'button'; node.addEventListener('click', action); return node; };
  const root = el('section', undefined, 'spatial-atlas');
  const style = el('style');
  style.textContent = `
    .spatial-atlas{--sa-ink:#173e35;--sa-paper:#fbfcf7;--sa-line:#b9cbbb;color:var(--sa-ink);margin-block:1.5rem}.spatial-atlas *{box-sizing:border-box}.spatial-atlas h2,.spatial-atlas h3,.spatial-atlas h4{color:inherit}.spatial-atlas p{max-width:80ch}.spatial-atlas button{font:inherit;cursor:pointer}.spatial-atlas :focus-visible{outline:3px solid #a75619;outline-offset:3px}.spatial-atlas [hidden]{display:none!important}
    .spatial-atlas .sa-caption{font-size:.9rem;line-height:1.5}.sa-themes,.sa-views{display:flex;flex-wrap:wrap;gap:.55rem;margin-block:1rem}.sa-themes button,.sa-views button,.sa-action{min-height:44px;padding:.65rem 1rem;border:1px solid var(--sa-line);border-radius:2rem;color:var(--sa-ink);background:#fff}.sa-themes button[aria-pressed=true],.sa-views button[aria-pressed=true]{color:#fff;background:#245744;border-color:#245744}
    .sa-map-scroll{overflow:auto;border:1px solid var(--sa-line);border-radius:1rem;background:radial-gradient(ellipse at center,#f7faf0,#e8f0e5);overscroll-behavior-x:contain}.sa-canvas{position:relative;width:100%;min-width:900px;aspect-ratio:1200/760}.sa-canvas svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}.sa-canvas line{stroke:#849d8a;stroke-width:2}.sa-canvas line.is-selected{stroke:#8b491f;stroke-width:2}.sa-cluster{position:absolute;transform:translate(-50%,-50%);width:170px;min-height:90px;padding:.75rem;border:1px solid #91ac94;border-radius:1rem;background:#fff;color:var(--sa-ink);box-shadow:0 5px 18px #254a3510;text-align:center;line-height:1.25}.sa-cluster strong,.sa-cluster span{display:block}.sa-cluster strong{font-size:1rem;overflow-wrap:anywhere}.sa-cluster span{font-size:.82rem;margin-top:.4rem}.sa-cluster[aria-pressed=true]{border:3px solid #8b491f;background:#fff8ed}.sa-map-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:230px;text-align:center;pointer-events:none}.sa-map-center strong{display:block;font-size:1.35rem}.sa-map-center p{font-size:.9rem;line-height:1.45;margin-block:.55rem}
    .sa-complete-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:1rem}.sa-list-area{padding:1rem;border:1px solid var(--sa-line);border-radius:.75rem;background:#f7faf3}.sa-list-area h3{margin-top:0}.sa-list-area ul{padding-left:1.1rem}.sa-list-area li{margin-bottom:.5rem}.sa-text-button{min-height:44px;padding:.2rem 0;border:0;background:transparent;color:#245744;text-align:left;text-decoration:underline;text-underline-offset:.16em;line-height:1.45}.sa-list-area>.sa-action{margin-top:.5rem}
    .sa-detail{margin-top:1.25rem;border:1px solid var(--sa-line);padding:clamp(1rem,3vw,1.8rem);border-radius:1rem;background:var(--sa-paper)}.sa-detail-search{display:flex;flex-direction:column;gap:.35rem;max-width:34rem;margin-block:1rem;font-weight:600}.sa-detail-search input{font:inherit;min-height:44px;padding:.65rem;border:1px solid var(--sa-line);border-radius:.5rem;background:#fff;color:var(--sa-ink)}.sa-detail .sa-entry-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:.75rem;margin-block:1rem}.sa-entry{display:block;width:100%;padding:1rem;border:1px solid var(--sa-line);border-radius:.6rem;text-align:left;color:var(--sa-ink);background:#fff}.sa-entry strong,.sa-entry span,.sa-entry small{display:block}.sa-entry strong{font-size:1rem;line-height:1.4}.sa-entry small{margin-top:.45rem;font-size:.8rem;line-height:1.5}.sa-entry span{margin-top:.5rem;line-height:1.45;font-size:.92rem}.sa-crossing{padding:1rem 0;border-top:1px solid var(--sa-line)}.sa-crossing h4{margin:.4rem 0}.sa-crossing .sa-endpoint{display:inline-flex;flex-direction:column;padding:.5rem .7rem;margin:.25rem;border:1px solid var(--sa-line);border-radius:.4rem;text-align:left;background:#fff;color:var(--sa-ink);min-height:44px}.sa-endpoint small{font-size:.78rem;line-height:1.5}.sa-relation-label{display:block;font-weight:700;margin:.5rem}.sa-detail details{margin-top:1rem}.sa-detail summary{cursor:pointer}.sa-detail pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.8rem}.spatial-atlas a{color:#245744;text-decoration:underline;text-underline-offset:.15em}
    @media(max-width:700px){.sa-canvas{min-width:900px}.sa-cluster{width:152px}.sa-map-center{width:195px}.sa-themes button,.sa-views button{padding:.6rem .8rem}.sa-complete-list{grid-template-columns:1fr}}
    @media(prefers-reduced-motion:reduce){.spatial-atlas *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
  `;
  root.append(style, el('h2', 'Die verbundenen Atlasbereiche'));
  root.append(el('p', 'Jeder Atlasbereich hat einen eigenen Platz und denselben Zugang. Wähle einen Einstieg und dann einen Bereich. Seine tatsächlichen Einträge und die benannten Verbindungen zu anderen Arbeiten öffnen sich darunter.'));
  const themeButtons = el('div', undefined, 'sa-themes'); themeButtons.setAttribute('role', 'group'); themeButtons.setAttribute('aria-label', 'Thematische Einstiege in die Atlaslandschaft');
  const themeNote = el('p', '', 'sa-caption'); themeNote.setAttribute('role', 'status');
  const editorial = el('details'), editorialSummary = el('summary', 'Wie die redaktionellen Einstiege entstehen');
  editorial.append(editorialSummary, el('p', 'Die Einstiege sind transparente Lesehilfen. Sie suchen ausschließlich im vorhandenen Titel, in Schlagwörtern und bei Methoden in der Materialart. Sie stellen keine Diagnose, gleiche Ursache oder empirische Gruppierung fest. Ein nicht zugeordneter Eintrag bleibt über „Alles erkunden“ und die vollständige Bereichsliste erreichbar.'));
  const definitions = el('dl'); for (const item of themes.slice(1)) definitions.append(el('dt', item.title), el('dd', item.explanation)); editorial.append(definitions);
  const viewButtons = el('div', undefined, 'sa-views'); viewButtons.setAttribute('role', 'group'); viewButtons.setAttribute('aria-label', 'Darstellung der Atlasbereiche');
  const mapPanel = el('div');
  mapPanel.append(el('p', 'Die Positionen dienen nur dem übersichtlichen Layout. Abstände, Reihenfolge und Linien zeigen keine Stärke, Häufigkeit oder Kausalität. Linien verbinden ausschließlich Bereiche mit einer tatsächlich hinterlegten, benannten Beziehung. Beim thematischen Einstieg werden Beziehungen gezeigt, deren beide Einträge zugeordnet sind. Auf kleinen Bildschirmen kann die Karte seitlich gescrollt werden.', 'sa-caption'));
  const mapScroll = el('div', undefined, 'sa-map-scroll'); mapScroll.tabIndex = 0; mapScroll.setAttribute('role', 'region'); mapScroll.setAttribute('aria-label', 'Seitlich scrollbare Atlaslandschaft; vollständige Listenalternative verfügbar');
  const canvas = el('div', undefined, 'sa-canvas'); mapScroll.append(canvas); mapPanel.append(mapScroll);
  const listPanel = el('div', undefined, 'sa-complete-list');
  const detail = el('div', undefined, 'sa-detail');
  root.append(themeButtons, themeNote, editorial, viewButtons, mapPanel, listPanel, detail);
  target.replaceChildren(root);
  function matching(name) { return entries.filter(entry => (!name || entry.collection === name) && match(entry)); }
  function selectCollection(name, focus = true) {
    selected = name; query = ''; limit = 12; renderOverview(); renderDetail();
    if (focus) { const heading = detail.querySelector('h3'); heading?.focus({ preventScroll: true }); detail.scrollIntoView?.({ block: 'nearest', behavior: 'auto' }); }
  }
  function renderOverview() {
    themeButtons.replaceChildren(...themes.map(item => {
      const node = button(item.title, () => { theme = item; query = ''; limit = 12; renderOverview(); renderDetail(); themeButtons.children[themes.indexOf(item)]?.focus({ preventScroll: true }); });
      node.setAttribute('aria-pressed', item.id === theme.id ? 'true' : 'false'); return node;
    }));
    themeNote.textContent = `${theme.title}: ${theme.explanation} ${matching().length} Einträge sind in diesem Einstieg zugeordnet.`;
    viewButtons.replaceChildren(...[['map', 'Räumliche Karte'], ['list', 'Vollständige Bereichsliste']].map(([value, title]) => {
      const node = button(title, () => { view = value; renderOverview(); viewButtons.children[value === 'map' ? 0 : 1]?.focus({ preventScroll: true }); }); node.setAttribute('aria-pressed', view === value ? 'true' : 'false'); return node;
    }));
    mapPanel.hidden = view !== 'map'; listPanel.hidden = view !== 'list';
    canvas.replaceChildren(); listPanel.replaceChildren();
    const positions = new Map();
    names.forEach((name, index) => { const angle = -Math.PI / 2 + index * Math.PI * 2 / Math.max(1, names.length); positions.set(name, { x: 600 + Math.cos(angle) * 470, y: 380 + Math.sin(angle) * 285 }); });
    const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', '0 0 1200 760'); svg.setAttribute('aria-hidden', 'true');
    const currentIds = new Set(matching().map(entry => entry.id));
    const visibleCross = cross.filter(relation => currentIds.has(relation.from) && currentIds.has(relation.to));
    const drawn = new Set();
    for (const relation of visibleCross) {
      const from = byId.get(relation.from).collection, to = byId.get(relation.to).collection;
      const key = JSON.stringify([from, to].sort()); if (drawn.has(key)) continue; drawn.add(key);
      const a = positions.get(from), b = positions.get(to); if (!a || !b) continue;
      const line = doc.createElementNS('http://www.w3.org/2000/svg', 'line');
      for (const [name, value] of Object.entries({ x1: a.x, y1: a.y, x2: b.x, y2: b.y })) line.setAttribute(name, value);
      if (from === selected || to === selected) line.setAttribute('class', 'is-selected'); svg.append(line);
    }
    canvas.append(svg);
    const center = el('div', undefined, 'sa-map-center'); center.append(el('strong', theme.title), el('p', `${names.length} Atlasbereiche · ${visibleCross.length} benannte Querverbindungen`), el('p', 'Ein Bereich öffnet seine Einträge und Beziehungen.')); canvas.append(center);
    for (const name of names) {
      const all = entries.filter(entry => entry.collection === name), subset = matching(name), position = positions.get(name);
      const cluster = button('', () => selectCollection(name), 'sa-cluster');
      cluster.style.left = `${position.x / 12}%`; cluster.style.top = `${position.y / 7.6}%`;
      cluster.setAttribute('aria-pressed', selected === name ? 'true' : 'false');
      cluster.append(el('strong', name), el('span', theme.id === 'all' ? `${all.length} Einträge` : `${subset.length} passende von ${all.length} Einträgen`)); canvas.append(cluster);
      const section = el('section', undefined, 'sa-list-area'); section.append(el('h3', name), el('p', theme.id === 'all' ? `${all.length} tatsächliche Einträge` : `${subset.length} dem Einstieg zugeordnete von ${all.length} Einträgen`, 'sa-caption'));
      const list = el('ul');
      for (const entry of subset.slice(0, 3)) { const item = el('li'); item.append(button(entry.title, () => onRead(entry.id), 'sa-text-button')); list.append(item); }
      if (subset.length) section.append(list); else section.append(el('p', 'Für diesen Einstieg gibt es hier keine Zuordnung über Titel, Schlagwörter oder Materialart. Mit „Alles erkunden“ bleibt der gesamte Bereich erreichbar.', 'sa-caption'));
      section.append(button('Bereich hier erkunden', () => selectCollection(name), 'sa-action')); listPanel.append(section);
    }
  }
  function entryCard(entry) {
    const node = button('', () => onRead(entry.id), 'sa-entry');
    node.append(el('small', `${entry.collection} · ${kindName(entry.kind)}`), el('strong', entry.title));
    if (entry.summary) node.append(el('span', entry.summary));
    if (theme.id !== 'all') node.append(el('small', match(entry)));
    return node;
  }
  function renderCrossings(container, subset) {
    container.append(el('h4', 'Benannte Beziehungen zwischen den Beständen'));
    container.append(el('p', 'Die Formulierung jeder Verbindung stammt aus ihrem hinterlegten Atlasmodell oder der ausdrücklich redaktionellen Verknüpfung. Eine Verbindung behauptet keine individuelle Ursache.', 'sa-caption'));
    if (!subset.length) { container.append(el('p', 'Für diese Auswahl ist noch keine ausdrückliche bestandsübergreifende Beziehung hinterlegt. Gemeinsame Wörter allein werden hier nicht in Kanten umgewandelt.')); return; }
    container.append(el('p', `${subset.length} tatsächliche Querverbindungen in dieser Auswahl.`, 'sa-caption'));
    for (const relation of subset) {
      const from = byId.get(relation.from), to = byId.get(relation.to), article = el('article', undefined, 'sa-crossing');
      const fromButton = button('', () => onRead(from.id), 'sa-endpoint'); fromButton.append(el('small', from.collection), el('strong', from.title));
      const toButton = button('', () => onRead(to.id), 'sa-endpoint'); toButton.append(el('small', to.collection), el('strong', to.title));
      article.append(fromButton, el('span', relation.label || 'steht im Originalmodell in Beziehung zu', 'sa-relation-label'), toButton);
      if (relation.detail || relation.boundary) article.append(el('p', relation.detail || relation.boundary));
      const provenance = typeof relation.provenance === 'string' ? relation.provenance : relation.provenance?.title;
      if (provenance) article.append(el('p', `Herkunft: ${provenance}`, 'sa-caption'));
      const url = relation.provenance?.url;
      if (/^https?:\/\//i.test(url || '')) { const anchor = el('a', 'Zum Original dieser Beziehung'); anchor.href = url; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; article.append(anchor); }
      const technical = el('details'); technical.append(el('summary', 'Technische Herkunft öffnen'), el('pre', JSON.stringify(relation, null, 2))); article.append(technical); container.append(article);
    }
  }
  function renderDetail() {
    detail.replaceChildren();
    const heading = el('h3', selected || 'Querverbindungen der gemeinsamen Atlaslandschaft'); heading.tabIndex = -1; detail.append(heading);
    if (!selected) {
      detail.append(el('p', 'Die Übersicht zeigt die bereits ausdrücklich verbundenen Arbeiten. Wähle einen Bereich in der Karte oder Liste, um seine Einträge, Grenzen und Rückwege zu lesen.'));
      const ids = new Set(matching().map(entry => entry.id)); renderCrossings(detail, cross.filter(relation => ids.has(relation.from) && ids.has(relation.to))); return;
    }
    detail.append(button('Diesen Bereich in der gemeinsamen Navigation öffnen', () => onCollection(selected), 'sa-action'));
    const label = el('label', 'In den zugeordneten Einträgen suchen', 'sa-detail-search');
    const search = el('input'); search.type = 'search'; search.value = query; search.placeholder = 'Titel, Beschreibung oder Schlagwort'; label.append(search); detail.append(label);
    const result = el('div'); detail.append(result);
    function renderResults() {
      const subset = matching(selected).filter(entry => normal([entry.title, entry.summary, ...(entry.tags || [])].join(' ')).includes(normal(query)));
      result.replaceChildren(el('p', `${subset.length} Einträge in „${selected}“ für den Einstieg „${theme.title}“.`, 'sa-caption'));
      const grid = el('div', undefined, 'sa-entry-grid'); grid.append(...subset.slice(0, limit).map(entryCard)); result.append(grid);
      if (!subset.length) result.append(el('p', 'Keine passenden Einträge. Ändere die Suche oder wähle „Alles erkunden“.'));
      if (subset.length > limit) result.append(button(`Weitere Einträge ansehen (${subset.length - limit} verbleibend)`, () => { const oldLimit = limit; limit += 12; renderResults(); result.querySelectorAll('.sa-entry')[oldLimit]?.focus(); }, 'sa-action'));
      const ids = new Set(subset.map(entry => entry.id)); renderCrossings(result, cross.filter(relation => (ids.has(relation.from) || ids.has(relation.to)) && match(byId.get(relation.from)) && match(byId.get(relation.to))));
    }
    search.addEventListener('input', () => { query = search.value; limit = 12; renderResults(); }); renderResults();
  }
  renderOverview(); renderDetail();
  return { element: root, collectionCount: names.length, crossRelationCount: cross.length };
}
