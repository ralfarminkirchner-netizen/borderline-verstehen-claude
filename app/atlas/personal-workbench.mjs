import { createTraceStore, fieldNames } from './trace-store.mjs';

const META_KEY = 'borderline-spuren-metadata-v1';
const TRACE_KEY = 'borderline-spuren-v2';
const kinds = { observation: 'Eigene Beobachtung', hypothesis: 'Eigene Hypothese', excerpt: 'Übernommene Aussage', question: 'Offene Frage' };
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = value => JSON.parse(JSON.stringify(value));
const blankFields = () => Object.fromEntries(Object.keys(fieldNames).map(key => [key, '']));
const blankMeta = () => ({ kind: 'observation', origin: '', tags: [], links: [] });
const signature = fields => JSON.stringify(Object.keys(fieldNames).map(key => fields[key] || ''));
const normalized = text => String(text || '').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const unique = values => [...new Set(values)];

/** Metadata extends the existing Spuren records; it never replaces their fields. */
export function validatePersonalMetadata(value) {
  if (!value || value.schema !== 1 || !value.entries || typeof value.entries !== 'object' || Array.isArray(value.entries)) throw new Error('Die ergänzenden Angaben sind nicht lesbar. Der vorhandene Speicher bleibt unverändert.');
  const entries = Object.create(null);
  for (const [id, meta] of Object.entries(value.entries)) {
    if (!id || id.length > 160 || !meta || typeof meta !== 'object' || !Object.hasOwn(kinds, meta.kind) || typeof meta.origin !== 'string' || meta.origin.length > 5000 || !Array.isArray(meta.tags) || meta.tags.length > 100 || !meta.tags.every(tag => typeof tag === 'string' && tag.length <= 120) || !Array.isArray(meta.links) || meta.links.length > 500 || !meta.links.every(link => link && ['node', 'source'].includes(link.type) && typeof link.id === 'string' && link.id.length <= 200)) throw new Error('Ein ergänzender Eintrag hat ein unbekanntes Format. Es wurde nichts ersetzt.');
    if (meta.variants !== undefined && (!Array.isArray(meta.variants) || meta.variants.length > 100 || !meta.variants.every(item => typeof item === 'string' && item.length < 150000))) throw new Error('Die importierten Varianten sind nicht lesbar.');
    entries[id] = { kind: meta.kind, origin: meta.origin, tags: unique(meta.tags), links: [...new Map(meta.links.map(link => [`${link.type}:${link.id}`, { type: link.type, id: link.id }])).values()], ...(meta.variants ? { variants: [...meta.variants] } : {}) };
  }
  return { schema: 1, entries };
}

export function buildPrompt(template, values = {}, context = {}) {
  const parts = [template.instruction, '\nMeine freiwilligen Angaben:'];
  for (const field of template.fields) if (String(values[field.key] || '').trim()) parts.push(`${field.label}\n${String(values[field.key]).trim()}`);
  if (!template.fields.some(field => String(values[field.key] || '').trim())) parts.push('Ich habe noch keine persönlichen Angaben ergänzt. Beginne mit wenigen hilfreichen Rückfragen.');
  if (context.note?.trim()) parts.push(`Bewusst ergänzter Kontext:\n${context.note.trim()}`);
  if (context.references?.length) parts.push(`Bewusst ausgewählte Atlasbezüge und Quellen (keine automatische Bestätigung ihrer Aussagen):\n${context.references.map(item => `• ${item.title}${item.url ? ` — ${item.url}` : ''}`).join('\n')}`);
  parts.push('Antworte verständlich und respektvoll. Unterscheide Beobachtung, subjektives Erleben, Hypothese, Erklärungsmodell und Diagnose. Nenne Alternativen, hilfreiche Rückfragen und Grenzen deiner Aussage. Keine Ferndiagnose für mich oder andere, keine erfundenen Quellen. Psychologische Erklärungen entschuldigen keine Grenzverletzung; berücksichtige reale Machtverhältnisse und Schutz. Behaupte keinen Zugriff auf Inhalte, die dir nicht vorliegen. Persönliche Angaben sind freiwillig.');
  return parts.join('\n\n');
}

/** Synchronous controller; ready resolves when the local prompt library is loaded.
 * nodes: collection.entries, sources: collection.sources, onSelect: (nodeId) => void.
 * No personal entry is sent over the network. */
export function mountPersonalWorkbench(host, { nodes = [], sources = [], onSelect = () => {} } = {}) {
  let destroyed = false, store, metadata = { schema: 1, entries: Object.create(null) }, records = [], metadataError = '', storage;
  let tab = 'entries', query = '', activeId = '', draft = { title: '', fields: blankFields(), meta: blankMeta() }, dirty = false;
  let library = null, selectedTemplate = '', promptQuery = '', pendingImport = null, entryLinkQuery = '', promptLinkQuery = '';
  let backupText = '', importText = '', entryStep = 0;
  const promptDrafts = new Map();
  const nodeList = Array.isArray(nodes) ? nodes : Object.values(nodes || {});
  const sourceList = Array.isArray(sources) ? sources : Object.values(sources || {});
  const referenceItems = [...nodeList.map(item => ({ ...item, type: 'node' })), ...sourceList.map(item => ({ ...item, type: 'source' }))];
  const references = new Map(referenceItems.map(item => [`${item.type}:${item.id}`, item]));
  const uid = `personal-workbench-${Math.random().toString(36).slice(2)}`;
  const cssURL = new URL('./personal-workbench.css', import.meta.url).href;
  if (![...document.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === cssURL)) {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = cssURL; document.head.append(link);
  }
  host.classList.add('personal-workbench');
  let initialError = '';
  try { storage = window.localStorage; store = createTraceStore(storage); records = store.list(); }
  catch (error) { initialError = error.message; }
  function readMetadata() {
    try { const raw = storage?.getItem(META_KEY); metadata = raw ? validatePersonalMetadata(JSON.parse(raw)) : { schema: 1, entries: Object.create(null) }; metadataError = ''; }
    catch { metadataError = 'Tags und Verknüpfungen konnten nicht gelesen werden. Ihr gespeichertes Original bleibt unverändert. Bitte den lokalen Speicher zuerst sichern.'; }
  }
  if (storage) readMetadata();
  function persistMetadata(id, meta) {
    if (metadataError) throw new Error(metadataError);
    // Refresh before writes so another opened workbench does not silently lose its metadata.
    const raw = storage.getItem(META_KEY);
    const current = raw ? validatePersonalMetadata(JSON.parse(raw)) : { schema: 1, entries: Object.create(null) };
    current.entries[id] = clone(meta);
    metadata = validatePersonalMetadata(current);
    try { storage.setItem(META_KEY, JSON.stringify(metadata)); }
    catch { throw new Error('Die Spur wurde gespeichert. Ergänzende Angaben konnten nicht gespeichert werden; sie bleiben hier im Entwurf und können heruntergeladen werden.'); }
  }
  const labelFor = link => references.get(`${link.type}:${link.id}`)?.title || (link.type === 'source' ? 'Verknüpfte Quelle – hier nicht verfügbar' : 'Atlasbezug – hier nicht verfügbar');
  const hrefFor = item => { try { const url = new URL(item?.url); return ['https:', 'http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } };
  const formattedDate = date => new Intl.DateTimeFormat('de', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
  function status(message) { const region = host.querySelector('.pw-status'); if (region) region.textContent = message; }
  function refreshRecords() { if (!store) throw new Error('Der lokale Speicher ist nicht verfügbar. Du kannst den Entwurf herunterladen.'); records = store.list(); }
  function currentPrompt() {
    if (!promptDrafts.has(selectedTemplate)) promptDrafts.set(selectedTemplate, { values: {}, note: '', links: [], preview: null, sourceChanged: false, step: 0 });
    return promptDrafts.get(selectedTemplate);
  }
  const currentTemplate = () => library?.templates.find(item => item.id === selectedTemplate);
  function promptText() {
    const template = currentTemplate(), state = currentPrompt();
    return state.preview ?? (template ? buildPrompt(template, state.values, { note: state.note, references: state.links.map(link => references.get(`${link.type}:${link.id}`)).filter(Boolean).map(item => ({ title: item.title, url: hrefFor(item) })) }) : '');
  }
  function updatePreview(force = false) {
    const state = currentPrompt();
    // A manually edited preview is the text the person chose to copy. Keep it
    // until they explicitly ask to rebuild it from the input fields.
    if (force || state.preview === null) { state.preview = null; state.sourceChanged = false; }
    else state.sourceChanged = true;
    const preview = host.querySelector('[data-prompt-preview]'); if (preview) preview.value = promptText();
    const notice = host.querySelector('[data-prompt-state]'); if (notice) notice.hidden = !state.sourceChanged;
  }
  function linkedHTML(links, target) {
    return links.length ? `<div class="pw-linked">${links.map((link, index) => `<span><button type="button" data-open-link="${index}" data-target="${target}">${esc(labelFor(link))}</button><button type="button" data-remove-link="${index}" data-target="${target}" aria-label="${esc(`${labelFor(link)} entfernen`)}">×</button></span>`).join('')}</div>` : '<p class="pw-note">Noch kein Atlasbezug ausgewählt.</p>';
  }
  function linkPickerHTML(target) {
    const search = target === 'entry' ? entryLinkQuery : promptLinkQuery;
    return `<label for="${uid}-${target}-links">Atlas oder Quellen verbinden</label><small>Beziehungen sind persönliche Zuordnungen, keine wissenschaftlich belegten Zusammenhänge.</small><div class="pw-link-picker"><input id="${uid}-${target}-links" data-link-query="${target}" value="${esc(search)}" placeholder="Begriff, Methode oder Quelle suchen" autocomplete="off"><button type="button" data-search-links="${target}">Suchen</button></div><div class="pw-link-results" data-link-results="${target}"></div><div data-linked="${target}">${linkedHTML(target === 'entry' ? draft.meta.links : currentPrompt().links, target)}</div>`;
  }
  const entryChapters = [
    { title: 'Der Moment', question: 'Was ist dir nachgegangen?', field: 'event', hint: 'Ein Satz genügt. Du musst noch nichts erklären.', more: [] },
    { title: 'Das Erleben', question: 'Wie war dieser Moment für dich?', field: 'perception', hint: 'Was du wahrgenommen hast, darf erst einmal für sich stehen.', more: ['body', 'feeling'] },
    { title: 'Die Bedeutung', question: 'Welche Bedeutung gibst du dem?', field: 'meaning', hint: 'Eine Deutung ist eine Möglichkeit. Andere dürfen daneben bestehen.', more: ['background'] },
    { title: 'Das Bedürfnis', question: 'Was hättest du gebraucht?', field: 'need', hint: 'Auch ein noch unklarer Wunsch verdient einen Platz.', more: ['action', 'consequence'] },
    { title: 'Der Zusammenhang', question: 'Wo gehört diese Spur für dich hin?', hint: 'Eine persönliche Einordnung. Kein abschließendes Urteil.', more: [] }
  ];
  const stationNames = {
    experience: ['Erlebnis', 'Gefühl', 'Deutung', 'Frage'], explanations: ['Muster', 'Umstände', 'Erklärungen', 'Gegenblick'],
    relationship: ['Verlauf', 'Meine Sicht', 'Andere Sicht', 'Grenzen'], conversation: ['Anliegen', 'Bedürfnis', 'Bitte', 'Sicherheit'],
    trigger: ['Davor', 'Belastung', 'Reaktion', 'Ausnahmen'], skill: ['Bedürfnis', 'Rahmen', 'Vorlieben', 'Erfahrung'],
    appointment: ['Anliegen', 'Verlauf', 'Unterstützung', 'Fragen'], sources: ['Aussage', 'Quelle', 'Kontext', 'Zweifel']
  };
  function journeyHTML(labels, step, target) {
    const positions = [[7, 54], [28.5, 25], [50, 55], [71.5, 25], [93, 53]];
    return `<nav class="pw-journey" aria-label="${target === 'prompt' ? 'Dein Weg zur Gesprächsvorbereitung' : 'Kapitel deiner Spur'}"><svg viewBox="0 0 1000 130" preserveAspectRatio="none" aria-hidden="true"><path class="pw-thread-shadow" d="M70 83 C145 83 178 13 285 38 S405 112 500 85 S625 6 715 38 S850 115 930 81"/><path class="pw-thread" d="M70 83 C145 83 178 13 285 38 S405 112 500 85 S625 6 715 38 S850 115 930 81"/></svg>${labels.map((label, index) => { const position = positions[index] || [93, 62]; return `<button type="button" class="pw-station${index < step ? ' is-past' : ''}" style="--station-x:${position[0]}%;--station-y:${position[1]}%" data-journey="${target}" data-step="${index}" aria-label="Station ${index + 1}: ${esc(label)}"${index === step ? ' aria-current="step"' : ''}><span class="pw-station-number">${String(index + 1).padStart(2, '0')}</span><span class="pw-station-name">${esc(label)}</span></button>`; }).join('')}</nav>`;
  }
  function focusStep() {
    const heading = host.querySelector('[data-step-heading]');
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView?.({ block: 'nearest', behavior: 'auto' });
  }
  function renderEntryList() {
    const list = host.querySelector('[data-entry-list]'); if (!list) return;
    const needle = normalized(query);
    const filtered = records.filter(record => normalized([record.title, ...Object.values(record.fields), ...(metadata.entries[record.id]?.tags || []), metadata.entries[record.id]?.origin, ...(metadata.entries[record.id]?.links || []).map(labelFor)].join(' ')).includes(needle));
    list.innerHTML = filtered.length ? filtered.map(record => `<button type="button" class="pw-timeline-entry" data-open-entry="${esc(record.id)}" aria-current="${record.id === activeId}"><span class="pw-entry-date">${esc(formattedDate(record.createdAt))}</span><span class="pw-entry-words"><strong>${esc(record.title)}</strong><span class="pw-entry-excerpt">${esc((record.fields.event || record.fields.perception || record.fields.meaning || '').slice(0, 180))}</span><small>${esc(kinds[metadata.entries[record.id]?.kind] || 'Persönliche Spur')}${metadata.entries[record.id]?.tags?.length ? ` · ${esc(metadata.entries[record.id].tags.join(' · '))}` : ''}</small></span><span class="pw-entry-arrow" aria-hidden="true">↗</span></button>`).join('') : '<p class="pw-empty">Hier entsteht mit der Zeit deine eigene Spur.<br><span>Auch eine offene Frage kann ihr Anfang sein.</span></p>';
    const count = host.querySelector('[data-entry-count]'); if (count) count.textContent = `${filtered.length} von ${records.length} gespeicherten Fassungen`;
  }
  function entryHTML() {
    const chapter = entryChapters[entryStep];
    const variants = (draft.meta.variants || []).map(raw => {
      try { const meta = JSON.parse(raw); return `<p><strong>${esc(kinds[meta.kind] || 'Importierte Einordnung')}</strong><br>${esc(typeof meta.origin === 'string' ? meta.origin : 'Herkunft nicht angegeben')}${Array.isArray(meta.tags) ? `<br>${esc(meta.tags.filter(tag => typeof tag === 'string').join(' · '))}` : ''}</p>`; }
      catch { return '<p>Eine weitere importierte Variante ist im Export vollständig erhalten.</p>'; }
    }).join('');
    const fieldHTML = (key, main = false) => `<label class="${main ? 'pw-writing-label' : ''}" for="${uid}-field-${key}">${main ? '<span class="pw-sr-only">' : ''}${esc(fieldNames[key])}${main ? '</span>' : ''}<textarea class="${main ? 'pw-writing-area' : ''}" id="${uid}-field-${key}" data-pw-field="${key}" rows="${main ? 5 : 3}" maxlength="20000" placeholder="${main ? 'Hier ist Platz für deine Worte …' : ''}">${esc(draft.fields[key])}</textarea></label>`;
    return `<div class="pw-body"><section class="pw-editor pw-diary" aria-label="Persönliche Spur bearbeiten"><div class="pw-section-top"><p class="pw-eyebrow">${activeId ? 'Eine Spur weiterführen' : 'Ein neues Tagebuchblatt'}</p><button type="button" class="pw-text-button" data-action="new">Neues Blatt <span aria-hidden="true">↗</span></button></div>${journeyHTML(['Moment', 'Erleben', 'Bedeutung', 'Bedürfnis', 'Einordnen'], entryStep, 'entry')}${metadataError ? `<p role="alert">${esc(metadataError)}</p>` : ''}<form data-entry-form><div class="pw-page-turn" key="${entryStep}"><p class="pw-step-kicker">${String(entryStep + 1).padStart(2, '0')} / 05 · ${chapter.title}</p><h3 class="pw-step-heading" data-step-heading tabindex="-1">${chapter.question}</h3><p class="pw-step-hint">${chapter.hint}</p>${entryStep === 0 ? `<label class="pw-title-label" for="${uid}-title">Gib diesem Blatt einen Namen<input id="${uid}-title" data-title maxlength="120" value="${esc(draft.title)}" placeholder="Das Gespräch nach dem langen Tag"></label>` : ''}${chapter.field ? fieldHTML(chapter.field, true) : `<div class="pw-entry-context"><label for="${uid}-kind">Wie ordnest du diesen Eintrag ein?<select id="${uid}-kind" data-kind>${Object.entries(kinds).map(([key, title]) => `<option value="${key}"${draft.meta.kind === key ? ' selected' : ''}>${title}</option>`).join('')}</select></label><label for="${uid}-tags">Deine Schlagwörter<input id="${uid}-tags" data-tags value="${esc(draft.meta.tags.join(', '))}" maxlength="12000" placeholder="Mit Komma trennen"></label><label for="${uid}-origin">Herkunft und Einordnung<small>Eigene Erinnerung, Gesprächsnotiz oder Quelle eines Zitats. Persönliche Angaben sind freiwillig.</small><textarea id="${uid}-origin" data-origin maxlength="5000" rows="3">${esc(draft.meta.origin)}</textarea></label>${variants ? `<details><summary>Erhaltene importierte Einordnungen</summary>${variants}</details>` : ''}${linkPickerHTML('entry')}</div>`}${chapter.more.length ? `<details class="pw-deeper"><summary>${entryStep === 1 ? 'Körper und Gefühle näher beschreiben' : entryStep === 2 ? 'Möglichen Hintergrund ergänzen' : 'Schutzhandlung und Folgen ergänzen'}</summary>${chapter.more.map(key => fieldHTML(key)).join('')}</details>` : ''}</div><div class="pw-step-navigation"><button type="button" data-action="entry-back"${entryStep === 0 ? ' disabled' : ''}><span aria-hidden="true">←</span> Zurück</button><span>Alles darf offenbleiben.</span>${entryStep < 4 ? '<button type="button" data-action="entry-next">Weiter <span aria-hidden="true">→</span></button>' : '<span class="pw-end-mark" aria-hidden="true">✳</span>'}</div><div class="pw-save-line"><button type="submit" class="pw-primary">${activeId ? 'Als neue Fassung speichern' : 'Spur speichern'} <span aria-hidden="true">↗</span></button><p data-draft-state>${dirty ? 'Noch nicht gespeichert.' : activeId ? 'Gespeicherte Fassung geöffnet.' : 'Dein Entwurf bleibt in dieser geöffneten Ansicht.'}</p></div><details class="pw-further"><summary>Mit diesem Blatt weiterarbeiten</summary><div class="pw-actions"><button type="button" data-action="export-draft">Diesen Entwurf herunterladen</button><button type="button" data-action="use-prompt">Ein Gespräch vorbereiten</button></div><p class="pw-note">Speichern legt eine neue Fassung an. Frühere Fassungen bleiben erhalten. Diese App sendet deine Einträge nicht an einen Server oder ein LLM.</p></details></form></section><section class="pw-archive" aria-label="Gespeicherte persönliche Spuren"><div class="pw-archive-heading"><div><p class="pw-eyebrow">Was bleiben darf</p><h3>Deine bisherigen Spuren.</h3><small data-entry-count></small></div><label class="pw-archive-search" for="${uid}-entry-search"><span class="pw-sr-only">Eigene Einträge durchsuchen</span><input id="${uid}-entry-search" data-entry-search value="${esc(query)}" type="search" placeholder="In deinen Spuren suchen"></label></div><div class="pw-timeline" data-entry-list></div><details class="pw-backup"><summary>Deine Spuren sichern oder mitbringen</summary><div class="pw-actions"><button type="button" data-action="export">Alles herunterladen</button><button type="button" data-action="copy-backup">Sicherung als JSON kopieren</button><label class="pw-file-button">Datei importieren<input type="file" data-import-file accept="application/json,.json" aria-label="Persönliche Spuren aus JSON-Datei importieren"></label></div><small>Importe ergänzen deinen Bestand. Vorhandene Fassungen bleiben erhalten.</small></details>${backupText ? `<details open><summary>JSON-Sicherung ansehen und manuell kopieren</summary><label for="${uid}-backup">Deine JSON-Sicherung<textarea id="${uid}-backup" data-json-backup readonly rows="6" spellcheck="false">${esc(backupText)}</textarea></label><small>Enthält alle gespeicherten Fassungen, Tags und Bezüge.</small></details>` : ''}<details${importText ? ' open' : ''}><summary>JSON aus Text importieren</summary><label for="${uid}-import-text">JSON-Sicherung einfügen<textarea id="${uid}-import-text" data-import-text rows="6" maxlength="26214400" spellcheck="false" placeholder="Hier die vollständige JSON-Sicherung einfügen">${esc(importText)}</textarea></label><button type="button" data-action="prepare-text-import">JSON prüfen</button><small>Erst prüfen, dann bewusst ergänzen. Dein Bestand wird nicht ersetzt.</small></details>${pendingImport ? importHTML() : ''}</section></div>`;
  }
  function importHTML() {
    return `<section class="pw-import" aria-label="Import prüfen"><h3>Import prüfen</h3><p>Die JSON-Sicherung enthält ${pendingImport.count} Spuren. Voraussichtlich ${pendingImport.added} neue Spuren und ${pendingImport.skipped} bereits vorhandene Inhalte. Enthaltene Tags und Verknüpfungen werden ergänzt. Vorhandene Fassungen werden nicht ersetzt.</p><p class="pw-note">Importierte Texte werden als persönliche Inhalte behandelt. Es wird nichts veröffentlicht.</p><div class="pw-actions"><button type="button" data-action="confirm-import">Jetzt ergänzend importieren</button><button type="button" data-action="cancel-import">Abbrechen</button></div></section>`;
  }
  function renderPromptList() {
    const list = host.querySelector('[data-prompt-list]'); if (!list) return;
    const templates = (library?.templates || []).filter(item => normalized(`${item.title} ${item.purpose} ${item.audience}`).includes(normalized(promptQuery)));
    list.innerHTML = templates.map((item, index) => `<button type="button" data-template="${esc(item.id)}" aria-current="${item.id === selectedTemplate}"><span class="pw-template-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.purpose)}</small></span><span aria-hidden="true">↗</span></button>`).join('') || '<p>Keine passende Vorlage.</p>';
  }
  function promptHTML() {
    const template = currentTemplate();
    if (!template) return '<div class="pw-editor"><p>Die lokalen Gesprächsvorlagen werden geladen.</p></div>';
    const state = currentPrompt();
    const last = template.fields.length;
    state.step = Math.min(state.step || 0, last);
    const field = template.fields[state.step];
    const labels = [...(stationNames[template.id] || template.fields.map((_, index) => `Frage ${index + 1}`)), 'Mitnehmen'];
    return `<div class="pw-body"><section class="pw-editor pw-conversation" aria-label="Kopiervorlage bearbeiten"><div class="pw-intention"><p class="pw-eyebrow">Dein Anliegen</p><h3>${esc(template.title)}</h3><p>${esc(template.purpose)}</p><details class="pw-template-picker"><summary>Ein anderes Anliegen wählen <span aria-hidden="true">↗</span></summary><label for="${uid}-prompt-search"><span class="pw-sr-only">Anliegen finden</span><input id="${uid}-prompt-search" type="search" data-prompt-search value="${esc(promptQuery)}" placeholder="Gespräch, Skill, Quelle …"></label><div class="pw-template-list" data-prompt-list></div><small>${esc(library.authorship)}</small></details></div>${journeyHTML(labels, state.step, 'prompt')}<div class="pw-page-turn"><p class="pw-step-kicker">${String(state.step + 1).padStart(2, '0')} / ${String(last + 1).padStart(2, '0')} · ${field ? 'Ein Gedanke nach dem anderen' : 'Prüfen, entscheiden, mitnehmen'}</p>${field ? `<h3 class="pw-step-heading" data-step-heading tabindex="-1">${esc(field.label)}</h3><p class="pw-step-hint">${esc(field.hint)} Alle Angaben sind freiwillig.</p><label class="pw-writing-label" for="${uid}-prompt-${field.key}"><span class="pw-sr-only">${esc(field.label)}</span><textarea class="pw-writing-area" id="${uid}-prompt-${field.key}" data-prompt-field="${esc(field.key)}" rows="6" maxlength="20000" placeholder="Du kannst einfach anfangen …">${esc(state.values[field.key] || '')}</textarea></label>` : `<h3 class="pw-step-heading" data-step-heading tabindex="-1">Deine Worte. Dein nächster Schritt.</h3><p class="pw-step-hint">Das ist der Text, den du kopierst. Lies ihn in Ruhe und ändere alles, was nicht nach dir klingt.</p><div class="pw-preview"><label for="${uid}-preview"><span class="pw-sr-only">Deine tatsächliche Kopiervorschau</span><textarea id="${uid}-preview" data-prompt-preview rows="14" spellcheck="true">${esc(promptText())}</textarea></label><p class="pw-preview-state" data-prompt-state role="status"${state.sourceChanged ? '' : ' hidden'}>Du hast Eingabefelder oder Bezüge geändert. Kopiert wird weiterhin deine bearbeitete Vorschau. Wähle „Aus Feldern neu erzeugen“, um die aktuellen Angaben zu übernehmen; dabei wird deine bisherige Vorschau ersetzt.</p></div><details class="pw-deeper"><summary>Atlasbezüge oder weiteren Kontext ergänzen</summary><label for="${uid}-prompt-note">Zusätzlicher Kontext<textarea id="${uid}-prompt-note" data-prompt-note rows="3" maxlength="20000">${esc(state.note)}</textarea></label>${linkPickerHTML('prompt')}<button type="button" data-action="include-entry-links">Bezüge der geöffneten Spur ergänzen</button><p class="pw-note">Nur ausgewählte Atlas- und Quellenbezüge werden übernommen. Dein persönlicher Spurtext bleibt bei dir.</p></details><div class="pw-actions pw-copy-actions"><button type="button" class="pw-primary" data-action="copy">Kopiervorlage kopieren <span aria-hidden="true">↗</span></button><button type="button" data-action="regenerate">Aus Feldern neu erzeugen</button><button type="button" data-action="download-prompt">Text herunterladen</button></div><p class="pw-note">Deine Änderungen an der Vorschau bleiben erhalten, bis du sie bewusst neu erzeugst. Kopieren sendet nichts. Prüfe vor dem Einfügen in einen externen Chat, was du dort teilen möchtest.</p>`}</div><div class="pw-step-navigation"><button type="button" data-action="prompt-back"${state.step === 0 ? ' disabled' : ''}><span aria-hidden="true">←</span> Zurück</button><span>${field ? 'Eine Pause ist auch ein Schritt.' : 'Du entscheidest, was du teilst.'}</span>${state.step < last ? `<button type="button" class="${state.step === last - 1 ? 'pw-primary' : ''}" data-action="prompt-next">${state.step === last - 1 ? 'Kopiervorschau öffnen' : 'Weiter'} <span aria-hidden="true">→</span></button>` : '<span class="pw-end-mark" aria-hidden="true">✳</span>'}</div><p class="pw-privacy">Nur hier, in dieser geöffneten Ansicht. Dieses Werkzeug sendet keine Angaben an eine KI. Im separaten Companion entscheidest du ausdrücklich, welchen Kontext du teilst. Lade deinen Text herunter, wenn du ihn behalten möchtest.</p></section></div>`;
  }
  function render() {
    if (destroyed) return;
    const previousStatus = host.querySelector('.pw-status')?.textContent || initialError;
    host.innerHTML = `<header class="pw-header"><div class="pw-header-copy"><p class="pw-eyebrow">Ein persönlicher Raum im Atlas</p><h2>${tab === 'prompts' ? 'Erst sortieren.<br><em>Dann ins Gespräch.</em>' : 'Was dich bewegt,<br><em>darf Worte finden.</em>'}</h2><p class="pw-header-intro">${tab === 'prompts' ? 'Vier Fragen. Eine Spur zu dem, was dir wichtig ist.<br>Du bestimmst, was du erzählen und teilen möchtest.' : 'Ein Moment, ein Gefühl, eine offene Frage.<br>Halte fest, was du verstehen möchtest — in deinem Tempo.'}</p></div><div class="pw-header-mark" aria-hidden="true"><svg viewBox="0 0 220 220"><path d="M31 154C6 89 58 27 119 43s94 72 53 109-108 6-88-41 94-44 108 1-39 91-97 78"/><path d="M29 166C5 96 61 20 125 40s88 78 45 115-107 3-84-44 94-35 106 3-36 84-95 77"/><circle cx="31" cy="154" r="5"/><circle cx="95" cy="190" r="5"/></svg><span>Gedanken dürfen<br>ihre Kreise ziehen.</span></div><div class="pw-tabs" role="tablist" aria-label="Persönliche Werkzeuge"><button type="button" role="tab" id="${uid}-entries-tab" aria-controls="${uid}-panel" aria-selected="${tab === 'entries'}" tabindex="${tab === 'entries' ? 0 : -1}" data-tab="entries">Eigene Spuren</button><button type="button" role="tab" id="${uid}-prompts-tab" aria-controls="${uid}-panel" aria-selected="${tab === 'prompts'}" tabindex="${tab === 'prompts' ? 0 : -1}" data-tab="prompts">Ein Gespräch vorbereiten</button></div></header><div id="${uid}-panel" role="tabpanel" aria-labelledby="${uid}-${tab}-tab">${tab === 'entries' ? entryHTML() : promptHTML()}</div><p class="pw-status" role="status" aria-live="polite">${esc(previousStatus)}</p>`;
    if (tab === 'entries') renderEntryList(); else renderPromptList();
  }
  function markDirty() { dirty = true; const note = host.querySelector('[data-draft-state]'); if (note) note.textContent = 'Noch nicht gespeichert.'; }
  function mayReplaceDraft() { return !dirty || window.confirm('Die geöffnete Spur enthält ungespeicherte Änderungen. Eine andere Fassung öffnen und diese Änderungen verwerfen? Du kannst vorher den Entwurf herunterladen.'); }
  function openEntry(id) {
    if (!mayReplaceDraft()) return false;
    try { refreshRecords(); const record = records.find(item => item.id === id); if (!record) { status('Diese Spur ist hier nicht mehr vorhanden.'); return false; } activeId = id; draft = { title: record.title, fields: clone(record.fields), meta: clone(metadata.entries[id] || blankMeta()) }; dirty = false; entryStep = 0; tab = 'entries'; render(); host.querySelector('[data-title]')?.focus(); return true; }
    catch (error) { status(error.message); return false; }
  }
  function download(data, name, type = 'application/json') {
    const url = URL.createObjectURL(new Blob([type === 'application/json' ? JSON.stringify(data, null, 2) : data], { type: `${type};charset=utf-8` }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = name; document.body.append(anchor); anchor.click(); anchor.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function payload(withDraft = false) {
    const traces = withDraft ? { schema: 2, entries: [] } : store ? store.exportData() : { schema: 2, entries: [] };
    const meta = clone(metadata);
    if (withDraft) {
      const id = globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}`;
      traces.entries = [{ id, title: draft.title.trim() || 'Meine Spur', fields: clone(draft.fields), origin: 'local', createdAt: new Date().toISOString() }];
      meta.entries = { [id]: clone(draft.meta) };
    }
    return { format: 'borderline-personal-workbench', version: 1, exportedAt: new Date().toISOString(), traces, metadata: meta, ...(!withDraft && metadataError ? { unreadableMetadataOriginal: storage?.getItem(META_KEY) } : {}) };
  }
  function showLinkResults(target) {
    const needle = normalized(target === 'entry' ? entryLinkQuery : promptLinkQuery), container = host.querySelector(`[data-link-results="${target}"]`);
    if (!container) return;
    const selected = target === 'entry' ? draft.meta.links : currentPrompt().links;
    const found = needle ? referenceItems.filter(item => !selected.some(link => link.id === item.id && link.type === item.type) && normalized(`${item.title} ${(item.tags || []).join(' ')} ${item.summary || ''}`).includes(needle)).slice(0, 12) : [];
    container.innerHTML = found.length ? found.map(item => `<button type="button" data-add-link="${esc(item.id)}" data-link-type="${item.type}" data-target="${target}">${esc(item.title)}<small>${item.type === 'source' ? 'Quelle' : 'Atlasbezug'} · Zum Eintrag hinzufügen</small></button>`).join('') : needle ? '<p class="pw-note">Keine weiteren Treffer. Versuche einen verwandten Begriff.</p>' : '<p class="pw-note">Suche nach einem Begriff, um bewusste Verbindungen anzulegen.</p>';
  }
  function updateLinked(target) { const links = target === 'entry' ? draft.meta.links : currentPrompt().links; host.querySelector(`[data-linked="${target}"]`).innerHTML = linkedHTML(links, target); if (target === 'entry') markDirty(); else updatePreview(); }
  function mergedImportMetadata(importData, destinationRecords, current) {
    const next = { schema: 1, entries: Object.assign(Object.create(null), clone(current.entries)) };
    for (const imported of importData.traces.entries || []) {
      const additional = importData.metadata.entries[imported.id]; if (!additional) continue;
      const destination = destinationRecords.find(record => signature(record.fields) === signature(imported.fields)); if (!destination) continue;
      const previous = next.entries[destination.id];
      next.entries[destination.id] = previous && JSON.stringify(previous) !== JSON.stringify(additional)
        ? { ...previous, tags: unique([...previous.tags, ...additional.tags]), links: [...new Map([...previous.links, ...additional.links].map(link => [`${link.type}:${link.id}`, link])).values()], variants: unique([...(previous.variants || []), JSON.stringify(additional)]) }
        : clone(additional);
    }
    return validatePersonalMetadata(next);
  }
  function simulateImport(importData) {
    refreshRecords();
    const memory = new Map([[TRACE_KEY, JSON.stringify({ schema: 2, entries: records })]]);
    const sandbox = createTraceStore({ getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value), removeItem: key => memory.delete(key) });
    const result = sandbox.importRecords(importData.traces);
    // Reject oversized or malformed merged metadata before writing any imported trace.
    mergedImportMetadata(importData, sandbox.list(), metadata);
    return result;
  }
  function prepareImportText(text) {
    pendingImport = null;
    try {
      if (new Blob([text]).size > 25 * 1024 * 1024) throw new Error('Diese JSON-Sicherung ist für den Import im Browser zu groß. Bitte verwende eine Sicherung unter 25 MB.');
      const parsed = JSON.parse(text);
      const combined = parsed?.format === 'borderline-personal-workbench';
      if (combined && parsed.version !== 1) throw new Error('Diese Exportversion wird hier noch nicht unterstützt.');
      const traces = combined ? parsed.traces : parsed;
      const importedMeta = combined ? validatePersonalMetadata(parsed.metadata) : { schema: 1, entries: Object.create(null) };
      readMetadata(); if (metadataError) throw new Error(metadataError);
      const result = simulateImport({ traces, metadata: importedMeta });
      pendingImport = { traces, metadata: importedMeta, count: traces.schema === 2 ? traces.entries.length : 1, ...result };
      render(); host.querySelector('.pw-import button')?.focus();
      status('Die JSON-Sicherung wurde geprüft. Erst „Jetzt ergänzend importieren“ schreibt in deinen lokalen Bestand.');
    } catch (error) { render(); status(error instanceof SyntaxError ? 'Die Sicherung enthält kein lesbares JSON. Es wurde nichts verändert.' : error.message); }
  }
  async function prepareImport(file) {
    try {
      if (file.size > 25 * 1024 * 1024) throw new Error('Diese Datei ist für den Import im Browser zu groß. Bitte verwende eine Spuren-Datei unter 25 MB.');
      prepareImportText(await file.text());
    } catch (error) { status(error.message); }
  }
  function confirmImport() {
    if (!pendingImport) return;
    if (metadataError) throw new Error(metadataError);
    const importData = pendingImport;
    // Validate current metadata again before changing the trace store.
    const raw = storage.getItem(META_KEY); if (raw) validatePersonalMetadata(JSON.parse(raw));
    readMetadata();
    simulateImport(importData);
    const result = store.importRecords(importData.traces); refreshRecords();
    window.dispatchEvent(new CustomEvent('personal-workbench-saved', { detail: { imported: result.added } }));
    const next = mergedImportMetadata(importData, records, metadata);
    try { storage.setItem(META_KEY, JSON.stringify(next)); metadata = next; }
    catch { throw new Error('Die Spuren sind ergänzt. Tags und Verknüpfungen konnten nicht gespeichert werden. Die Importdatei und alle bisherigen Fassungen bleiben erhalten; bitte sichere den Bestand und wiederhole den Import, sobald Speicher verfügbar ist.'); }
    pendingImport = null; render(); status(`${result.added} Spuren ergänzt; ${result.skipped} bereits vorhandene Inhalte erkannt. Frühere Fassungen bleiben erhalten.`);
  }
  function handleInput(event) {
    const target = event.target;
    if (target.matches('[data-import-text]')) { importText = target.value; if (pendingImport) { pendingImport = null; host.querySelector('.pw-import')?.remove(); status('Der Text wurde geändert. Bitte prüfe die JSON-Sicherung erneut.'); } }
    if (target.matches('[data-title]')) { draft.title = target.value; markDirty(); }
    if (target.matches('[data-pw-field]')) { draft.fields[target.dataset.pwField] = target.value; markDirty(); }
    if (target.matches('[data-kind]')) { draft.meta.kind = target.value; markDirty(); }
    if (target.matches('[data-origin]')) { draft.meta.origin = target.value; markDirty(); }
    if (target.matches('[data-tags]')) { draft.meta.tags = unique(target.value.split(',').map(item => item.trim()).filter(Boolean)); markDirty(); }
    if (target.matches('[data-entry-search]')) { query = target.value; renderEntryList(); }
    if (target.matches('[data-prompt-search]')) { promptQuery = target.value; renderPromptList(); }
    if (target.matches('[data-prompt-field]')) { currentPrompt().values[target.dataset.promptField] = target.value; updatePreview(); }
    if (target.matches('[data-prompt-note]')) { currentPrompt().note = target.value; updatePreview(); }
    if (target.matches('[data-prompt-preview]')) currentPrompt().preview = target.value;
    if (target.matches('[data-link-query]')) { if (target.dataset.linkQuery === 'entry') entryLinkQuery = target.value; else promptLinkQuery = target.value; showLinkResults(target.dataset.linkQuery); }
  }
  async function handleClick(event) {
    const button = event.target.closest('button'); if (!button || !host.contains(button)) return;
    try {
      if (button.dataset.tab) { tab = button.dataset.tab; render(); host.querySelector(`[data-tab="${tab}"]`)?.focus(); }
      if (button.dataset.openEntry) openEntry(button.dataset.openEntry);
      if (button.dataset.template) { selectedTemplate = button.dataset.template; render(); focusStep(); }
      if (button.dataset.journey) { const step = Number(button.dataset.step); if (button.dataset.journey === 'entry') entryStep = Math.max(0, Math.min(4, step)); else currentPrompt().step = Math.max(0, Math.min(currentTemplate()?.fields.length || 0, step)); render(); focusStep(); }
      if (button.dataset.searchLinks) showLinkResults(button.dataset.searchLinks);
      if (button.dataset.addLink) { const target = button.dataset.target, links = target === 'entry' ? draft.meta.links : currentPrompt().links; if (!links.some(link => link.id === button.dataset.addLink && link.type === button.dataset.linkType)) links.push({ id: button.dataset.addLink, type: button.dataset.linkType }); updateLinked(target); showLinkResults(target); }
      if (button.dataset.removeLink !== undefined) { const target = button.dataset.target, links = target === 'entry' ? draft.meta.links : currentPrompt().links; links.splice(Number(button.dataset.removeLink), 1); updateLinked(target); }
      if (button.dataset.openLink !== undefined) {
        const links = button.dataset.target === 'entry' ? draft.meta.links : currentPrompt().links, link = links[Number(button.dataset.openLink)], item = references.get(`${link.type}:${link.id}`);
        if (link.type === 'node' && item) onSelect(link.id);
        else if (hrefFor(item)) window.open(hrefFor(item), '_blank', 'noopener,noreferrer');
        else status('Dieser Bezug ist gespeichert, aber in dieser Ansicht nicht verfügbar. Er bleibt beim Export erhalten.');
      }
      switch (button.dataset.action) {
        case 'entry-next': entryStep = Math.min(4, entryStep + 1); render(); focusStep(); break;
        case 'entry-back': entryStep = Math.max(0, entryStep - 1); render(); focusStep(); break;
        case 'prompt-next': currentPrompt().step = Math.min(currentTemplate()?.fields.length || 0, currentPrompt().step + 1); render(); focusStep(); break;
        case 'prompt-back': currentPrompt().step = Math.max(0, currentPrompt().step - 1); render(); focusStep(); break;
        case 'new': if (mayReplaceDraft()) { activeId = ''; draft = { title: '', fields: blankFields(), meta: blankMeta() }; dirty = false; entryStep = 0; render(); host.querySelector('[data-title]')?.focus(); } break;
        case 'export': download(payload(), 'meine-spuren-und-verbindungen.json'); status('Deine gespeicherten Spuren und ergänzenden Angaben wurden als Datei bereitgestellt.'); break;
        case 'copy-backup': {
          refreshRecords(); readMetadata(); backupText = JSON.stringify(payload(), null, 2); render();
          const preview = host.querySelector('[data-json-backup]');
          try { if (!navigator.clipboard?.writeText) throw new Error(); await navigator.clipboard.writeText(backupText); status('Die JSON-Sicherung aller gespeicherten Spuren, Tags und Bezüge wurde kopiert.'); }
          catch { preview.focus(); preview.select(); let copied = false; try { copied = document.execCommand('copy'); } catch {} status(copied ? 'Die JSON-Sicherung wurde kopiert.' : 'Die JSON-Sicherung ist markiert. Kopiere sie mit ⌘C beziehungsweise Strg+C.'); }
          break;
        }
        case 'prepare-text-import': prepareImportText(importText); break;
        case 'export-draft': download(payload(true), 'meine-spur-entwurf.json'); status('Der aktuelle Entwurf wurde als importierbare Datei bereitgestellt.'); break;
        case 'confirm-import': confirmImport(); break;
        case 'cancel-import': pendingImport = null; render(); status('Import abgebrochen.'); break;
        case 'use-prompt': tab = 'prompts'; render(); status('Wähle ein Anliegen. Persönliche Texte werden nicht automatisch übernommen.'); break;
        case 'include-entry-links': currentPrompt().links = [...new Map([...currentPrompt().links, ...draft.meta.links].map(link => [`${link.type}:${link.id}`, link])).values()]; updateLinked('prompt'); status('Atlas- und Quellenbezüge ergänzt. Dein persönlicher Spurtext wurde nicht übernommen.'); break;
        case 'regenerate': updatePreview(true); status('Die Vorschau wurde aus deinen Eingabefeldern neu erzeugt.'); break;
        case 'download-prompt': download(promptText(), 'meine-kopiervorlage.txt', 'text/plain'); status('Die bearbeitete Kopiervorlage wurde als Textdatei bereitgestellt.'); break;
        case 'copy': {
          const text = promptText(), preview = host.querySelector('[data-prompt-preview]');
          try { if (!navigator.clipboard?.writeText) throw new Error(); await navigator.clipboard.writeText(text); status('Die sichtbare Kopiervorlage wurde kopiert.'); }
          catch { preview.focus(); preview.select(); let copied = false; try { copied = document.execCommand('copy'); } catch {} status(copied ? 'Die sichtbare Kopiervorlage wurde kopiert.' : 'Die Vorschau ist markiert. Kopiere sie mit ⌘C beziehungsweise Strg+C.'); }
          break;
        }
      }
    } catch (error) { status(error.message || 'Dieser Schritt konnte nicht abgeschlossen werden. Deine Eingaben bleiben geöffnet.'); }
  }
  function handleSubmit(event) {
    if (!event.target.matches('[data-entry-form]')) return;
    event.preventDefault();
    let savedRecord = null;
    try {
      if (metadataError) throw new Error(metadataError);
      readMetadata(); if (metadataError) throw new Error(metadataError);
      validatePersonalMetadata({ schema: 1, entries: { draft: draft.meta } });
      if (!draft.title.trim() && !Object.values(draft.fields).some(text => text.trim())) throw new Error('Gib der Spur einen Namen oder halte eine Beobachtung, Vermutung oder Frage fest.');
      if (!store) throw new Error('Der lokale Speicher ist nicht verfügbar. Lade den Entwurf herunter, um ihn zu behalten.');
      const record = store.save({ title: draft.title, fields: draft.fields }); savedRecord = record; activeId = record.id;
      refreshRecords(); window.dispatchEvent(new CustomEvent('personal-workbench-saved', { detail: { id: record.id } }));
      persistMetadata(record.id, draft.meta); refreshRecords(); dirty = false; draft.title = record.title; render(); status('Neue Fassung lokal gespeichert. Frühere Spuren bleiben erhalten.');
    } catch (error) { if (savedRecord) renderEntryList(); status(savedRecord ? 'Die Spur wurde gespeichert. Die ergänzenden Angaben konnten nicht vollständig gespeichert werden. Sie bleiben im geöffneten Entwurf; lade ihn zur Sicherung herunter.' : error.message); }
  }
  function handleChange(event) { if (event.target.matches('[data-import-file]') && event.target.files?.[0]) prepareImport(event.target.files[0]); }
  function handleKeydown(event) {
    if (!event.target.matches('[role="tab"]') || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault(); tab = event.key === 'Home' ? 'entries' : event.key === 'End' ? 'prompts' : tab === 'entries' ? 'prompts' : 'entries'; render(); host.querySelector(`[data-tab="${tab}"]`)?.focus();
  }
  function handleStorage(event) {
    if (![META_KEY, TRACE_KEY, 'borderline-spur-v1'].includes(event.key)) return;
    try { refreshRecords(); readMetadata(); renderEntryList(); status('Der lokale Bestand wurde in einer anderen Ansicht geändert. Dein geöffneter Entwurf bleibt erhalten.'); }
    catch (error) { status(error.message); }
  }
  host.addEventListener('input', handleInput); host.addEventListener('change', handleChange); host.addEventListener('click', handleClick); host.addEventListener('submit', handleSubmit); host.addEventListener('keydown', handleKeydown); window.addEventListener('storage', handleStorage);
  render();
  const ready = fetch(new URL('./prompt-library.json', import.meta.url)).then(response => { if (!response.ok) throw new Error(); return response.json(); }).then(data => {
    if (!Array.isArray(data.templates) || !data.templates.length) throw new Error();
    library = data; selectedTemplate = data.templates[0].id; if (tab === 'prompts') render(); return data.templates.length;
  }).catch(() => { if (!destroyed) status('Die lokalen Kopiervorlagen konnten nicht geladen werden. Eigene Spuren bleiben verfügbar. Bitte lade die Seite erneut.'); return 0; });
  return { ready, openEntry, refresh() { try { refreshRecords(); readMetadata(); renderEntryList(); } catch (error) { status(error.message); } }, showPrompts() { tab = 'prompts'; render(); }, destroy() { destroyed = true; host.removeEventListener('input', handleInput); host.removeEventListener('change', handleChange); host.removeEventListener('click', handleClick); host.removeEventListener('submit', handleSubmit); host.removeEventListener('keydown', handleKeydown); window.removeEventListener('storage', handleStorage); host.replaceChildren(); host.classList.remove('personal-workbench'); } };
}
