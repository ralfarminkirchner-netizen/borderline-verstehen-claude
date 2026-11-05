import { observePublicCopy, publicText } from './atlas-public-copy.mjs';
observePublicCopy();
import { initTriggerReader } from './trigger-reader.mjs?v=20261102-trigger';
import './atlas-reader.mjs';
import './dossier-reader.mjs?v=20261102-recherche';
import { renderNotebookResearch } from './research.mjs?v=20261102-recherche';
import { sources, therapies, phenomena } from './knowledge.mjs';
import { scenarios, developmentNodes, atlasSources } from './scenarios.mjs';
import { createTraceStore, fieldNames } from './trace-store.mjs';
import { mergeTraceHandoff } from './trace-handoff.mjs';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const keys = Object.keys(fieldNames);
const sourceMap = new Map(sources.map(source => [source.id, source]));
const externalLink = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} <span aria-hidden="true">↗</span></a>`;
function citations(ids) {
  return `<details class="citations"><summary>Quellen und Grenzen</summary>${ids.map(id => {
    const source = sourceMap.get(id);
    return source ? `<p>${externalLink(source.url, source.title)}<br><small>${esc(source.limit)}</small></p>` : '';
  }).join('')}</details>`;
}
let statusTimer;
function tell(message) {
  $('#status').textContent = message;
  $('#status').classList.add('visible');
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => $('#status').classList.remove('visible'), 9000);
}

const pageTitles = {atlas:'Atlas erkunden',start:'Beziehungskarte', erleben:'Erleben', trigger:'Trigger verstehen', entwicklung:'Entwicklung', situationen:'Perspektiven', therapien:'Unterstützung', angehoerige:'Für Angehörige', werkstatt:'Meine Spuren', quellen:'Quellen'};
function route(initial = false) {
  const requested = location.hash.slice(1);
  if (requested === 'inhalt') { $('#inhalt').focus(); return; }
  const page = Object.hasOwn(pageTitles, requested) ? requested : 'atlas';
  document.querySelectorAll('[data-page]').forEach(section => {
    const hidden = section.dataset.page !== page;
    section.hidden = hidden; section.inert = hidden;
    section.setAttribute('aria-hidden', String(hidden));
  });
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === `#${page}`) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = page === 'start'
    ? 'Borderline verstehen · Ein Atlas für Beziehungen und Entwicklung'
    : `${pageTitles[page]} · Borderline verstehen`;
  if (!initial) { $('#inhalt').focus({preventScroll:true}); window.scrollTo({top:0, behavior:'instant'}); }
}
window.addEventListener('hashchange', () => route());
document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.dialog}`).showModal()));

$('#phenomena').innerHTML = phenomena.map((item, index) => `<article class="phenomenon panel"><span class="card-symbol" aria-hidden="true">${['⌁','◌','↔','◐','◎','⤴','≈'][index]}</span><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><details><summary>Näher hinsehen</summary><h3>Im Körper</h3><p>${esc(item.body)}</p><h3>In Beziehungen</h3><p>${esc(item.relation)}</p><h3>Eine offene Frage</h3><p>${esc(item.question)}</p><h3>Was unterstützen könnte</h3><p>${esc(item.help)}</p>${citations(item.sourceIds)}</details></article>`).join('');

const prompts = {
  event:['Was ist konkret geschehen?','Ein Satz kann reichen. Gegenwärtige Verletzungen und gebrochene Absprachen dürfen klar benannt werden.'],
  perception:['Was hast du bemerkt, gehört oder gesehen?','Beobachtung und Deutung können nebeneinander stehen. Vielleicht fehlt noch eine Information.'],
  body:['Was spürst du gerade – oder auch nicht?','Eine Körperempfindung beweist keine bestimmte Ursache oder verborgene Erinnerung. Du darfst dieses Feld auslassen.'],
  feeling:['Welche Gefühle sind da?','Mehrere Gefühle, Unklarheit und wechselndes Erleben sind möglich. Es gibt keine richtige Antwort.'],
  meaning:['Welche möglichen Bedeutungen bekommt der Moment?','Du kannst mehrere Vermutungen notieren. „Ich weiß es noch nicht“ ist eine vollständige Antwort.'],
  action:['Was tust du oder möchtest du tun, um dich zu schützen?','Welche Funktion könnte die Handlung haben? Ihre Wirkung auf andere und eigene Verantwortung bleiben mit im Blick.'],
  consequence:['Was folgt kurzfristig – und vielleicht später?','Was entlastet? Was erschwert Kontakt oder verletzt eine Grenze? Beobachtetes und Befürchtetes lassen sich unterscheiden.'],
  need:['Was brauchst du und worum könntest du bitten?','Ein Bedürfnis darf bestehen; die andere Person darf über eine Bitte frei entscheiden.'],
  background:['Welche Zusammenhänge möchtest du offen prüfen?','Heutige Belastungen, Körperzustand und frühere Erfahrungen sind mögliche Einflüsse. Keine Geschichte muss rekonstruiert werden.']
};
let selectedField = 'event';
let draft = {title:'', fields:Object.fromEntries(keys.map(key => [key, '']))};
let dirty = false;
let store;
try { store = createTraceStore(window.localStorage); } catch { tell('Der lokale Speicher ist nicht zugänglich. Du kannst schreiben und deinen Entwurf als Datei herunterladen.'); }
const deleted = [];
function updateDraft(key, value) {
  draft.fields[key] = value;
  dirty = true;
  document.querySelectorAll('[data-field]').forEach(input => {
    if (input.dataset.field === key && input.value !== value) input.value = value;
    if (input.dataset.field === key) input.closest('details').classList.toggle('filled', Boolean(value.trim()));
  });
  if (key === selectedField && $('#step-input').value !== value) $('#step-input').value = value;
}
function renderMap() {
  $('#reaction-map').innerHTML = keys.map((key, index) => `<button type="button" data-step="${key}" aria-pressed="${key === selectedField}"><span class="map-dot" aria-hidden="true">${['◌','◉','≈','⌁','◇','↗','↔','◎','⋯'][index]}</span>${esc(fieldNames[key])}</button>`).join('');
  $('#step-title').textContent = fieldNames[selectedField];
  $('#step-label').textContent = 'Deine Notiz · freiwillig';
  $('#step-question').textContent = prompts[selectedField][0];
  $('#step-hint').textContent = prompts[selectedField][1];
  $('#step-input').value = draft.fields[selectedField];
}
$('#reaction-map').addEventListener('click', event => {
  const button = event.target.closest('[data-step]');
  if (!button) return;
  selectedField = button.dataset.step;
  // Keep focus on the chosen native button while changing only the editor.
  $('#reaction-map').querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  $('#step-title').textContent = fieldNames[selectedField];
  $('#step-question').textContent = prompts[selectedField][0];
  $('#step-hint').textContent = prompts[selectedField][1];
  $('#step-input').value = draft.fields[selectedField];
});
$('#step-input').addEventListener('input', event => updateDraft(selectedField, event.target.value));
$('#trace-fields').innerHTML = keys.map(key => `<details class="trace-field"${key === 'event' ? ' open' : ''}><summary>${esc(fieldNames[key])}</summary><label for="trace-${key}">${esc(prompts[key][0])}</label><textarea id="trace-${key}" data-field="${key}" rows="3" maxlength="20000"></textarea><p class="caption">${esc(prompts[key][1])}</p></details>`).join('');
$('#trace-fields').addEventListener('input', event => { if (event.target.dataset.field) updateDraft(event.target.dataset.field, event.target.value); });
$('#trace-title').addEventListener('input', event => { draft.title = event.target.value; dirty = true; });
function syncDraft() {
  $('#trace-title').value = draft.title;
  document.querySelectorAll('[data-field]').forEach(input => {
    input.value = draft.fields[input.dataset.field];
    input.closest('details').classList.toggle('filled', Boolean(input.value.trim()));
  });
  $('#step-input').value = draft.fields[selectedField];
}
window.addEventListener('atlas-traces-request', event => {
  if (typeof event.detail?.receive !== 'function') return;
  try { event.detail.receive(store ? store.list().map(item=>({...item,fields:{...item.fields}})) : []); }
  catch { event.detail.receive([]); tell('Gespeicherte Spuren sind momentan nicht lesbar. Der vorhandene Bestand bleibt erhalten.'); }
});
window.addEventListener('atlas-trace-draft', event => {
  const result = mergeTraceHandoff(draft, event.detail?.payload);
  if (result.ok) {
    draft = result.draft; dirty = true; syncDraft();
    location.hash = 'werkstatt'; route();
    requestAnimationFrame(()=>$('#trace-title').focus());
  }
  tell(result.message);
  if (typeof event.detail?.receive === 'function') event.detail.receive({ok:result.ok,message:result.message});
});
function mayReplaceDraft() { return !dirty || window.confirm('Dein Entwurf ist noch nicht gespeichert. Möchtest du ihn durch die ausgewählte Spur oder ein leeres Blatt ersetzen?'); }
function saveDraft() {
  if (!keys.some(key => draft.fields[key].trim())) { tell('Notiere zunächst etwas in einem beliebigen Feld.'); return; }
  if (!store) { tell('Speichern ist hier nicht möglich. Lade deinen Entwurf als Datei herunter.'); return; }
  try {
    const title = draft.title.trim() || draft.fields.event.trim().split('\n')[0].slice(0, 90) || 'Meine Spur';
    store.save({title, fields:draft.fields});
    draft.title = title; dirty = false; syncDraft(); renderLibrary();
    tell('Eine neue Fassung ist in diesem Browser gespeichert.');
  } catch { tell('Die Spur konnte nicht gespeichert werden. Vorhandene Daten bleiben erhalten. Bitte lade den Entwurf als Datei herunter.'); }
}
$('#save-map').addEventListener('click', saveDraft);
$('#trace-form').addEventListener('submit', event => { event.preventDefault(); saveDraft(); });
$('#new-trace').addEventListener('click', () => {
  if (!mayReplaceDraft()) return;
  draft = {title:'', fields:Object.fromEntries(keys.map(key => [key, '']))}; dirty = false; syncDraft();
  tell('Ein leeres Blatt ist geöffnet. Gespeicherte Fassungen bleiben erhalten.');
});
const humanDate = value => new Intl.DateTimeFormat('de-DE', {dateStyle:'medium', timeStyle:'short'}).format(new Date(value));
window.addEventListener('personal-workbench-saved', () => renderLibrary());
function renderLibrary() {
  try {
    const entries = store ? store.list() : [];
    $('#trace-count').textContent = `${entries.length} ${entries.length === 1 ? 'gespeicherte Fassung' : 'gespeicherte Fassungen'}`;
    $('#trace-list').innerHTML = entries.length ? entries.map(entry => `<article class="trace-card"><h3>${esc(entry.title)}</h3><p class="caption">${esc(humanDate(entry.createdAt))}${entry.origin === 'legacy' ? ' · Aus bisheriger Notiz übernommen' : entry.origin === 'import' ? ' · Aus Datei eingelesen' : ''}</p><p>${esc((entry.fields.event || entry.fields.feeling || entry.fields.need || 'Notizen in weiteren Feldern').slice(0, 160))}</p><div class="actions"><button data-open="${esc(entry.id)}">Öffnen</button><button class="quiet" data-delete="${esc(entry.id)}">Löschen</button></div></article>`).join('') : '<p class="empty">Hier erscheinen deine gespeicherten Fassungen. Du kannst mit einem einzigen Feld beginnen.</p>';
  } catch { $('#trace-count').textContent = 'Speicher momentan nicht lesbar'; $('#trace-list').innerHTML = '<p>Die vorhandenen Daten wurden nicht verändert. Bitte sichere den Browserbestand, bevor du weitere Änderungen versuchst.</p>'; }
}
$('#trace-list').addEventListener('click', event => {
  const open = event.target.closest('[data-open]');
  const remove = event.target.closest('[data-delete]');
  if (!store || (!open && !remove)) return;
  try {
    if (open) {
      if (!mayReplaceDraft()) return;
      const record = store.list().find(entry => entry.id === open.dataset.open);
      if (!record) { renderLibrary(); tell('Diese Fassung wurde in einem anderen Fenster verändert.'); return; }
      draft = {title:record.title, fields:{...record.fields}}; dirty = false; syncDraft();
      $('#trace-title').focus(); tell('Die gespeicherte Fassung ist geöffnet. Speichern legt eine weitere Fassung an.');
    } else {
      const record = store.remove(remove.dataset.delete);
      if (record) deleted.push(record);
      $('#undo-delete').hidden = !deleted.length; renderLibrary(); tell('Die Fassung ist gelöscht. Du kannst sie in diesem geöffneten Fenster wiederherstellen.');
      if (!$('#undo-delete').hidden) $('#undo-delete').focus();
    }
  } catch { tell('Die Änderung war nicht möglich. Bitte sichere deine Daten und versuche es erneut.'); }
});
$('#undo-delete').addEventListener('click', () => {
  try {
    if (!deleted.length || !store) return;
    store.restore(deleted.at(-1)); deleted.pop(); renderLibrary();
    $('#undo-delete').hidden = !deleted.length; tell('Die zuletzt gelöschte Fassung ist wiederhergestellt.');
  } catch { tell('Wiederherstellen war nicht möglich. Die gelöschte Fassung bleibt in diesem geöffneten Fenster verfügbar.'); }
});
function download(content, filename, mime) {
  const url = URL.createObjectURL(new Blob([content], {type:mime}));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
$('#export-current').addEventListener('click', () => {
  const title = draft.title || 'Meine Spur';
  download(`${title}\n\n${keys.map(key => `${fieldNames[key]}\n${draft.fields[key] || '—'}`).join('\n\n')}\n`, 'borderline-spur.txt', 'text/plain;charset=utf-8');
  tell('Der Entwurf wurde als Textdatei zum Herunterladen übergeben.');
});
$('#export-all').addEventListener('click', () => {
  try { if (!store) throw new Error(); download(JSON.stringify(store.exportData(), null, 2), 'borderline-spuren.json', 'application/json'); tell('Die gespeicherten Fassungen wurden als Datei zum Herunterladen übergeben.'); }
  catch { tell('Exportieren war nicht möglich. Die vorhandenen Daten wurden nicht verändert.'); }
});
let pendingImport;
$('#import-file').addEventListener('change', async event => {
  const file = event.target.files?.[0];
  const preview = $('#import-preview'); pendingImport = undefined; preview.hidden = true;
  if (!file) return;
  try {
    if (file.size > 3000000) throw new Error();
    const parsed = JSON.parse(await file.text());
    const scratch = new Map();
    const validator = createTraceStore({getItem:key => scratch.get(key) ?? null, setItem:(key, value) => scratch.set(key, value), removeItem:key => scratch.delete(key)});
    validator.importRecords(parsed);
    const incoming = validator.list();
    pendingImport = parsed;
    preview.innerHTML = `<h3>Datei prüfen</h3><p>${incoming.length} ${incoming.length === 1 ? 'Fassung ist lesbar' : 'Fassungen sind lesbar'}. Vorhandene Fassungen bleiben erhalten; gleiche Inhalte werden übersprungen.</p><ul>${incoming.slice(0, 5).map(record => `<li>${esc(record.title)}</li>`).join('')}</ul><button id="confirm-import" class="primary">Jetzt in diesem Browser übernehmen</button><button id="cancel-import" class="quiet">Abbrechen</button>`;
    preview.hidden = false;
  } catch { tell('Die Datei konnte nicht als Spurensicherung gelesen werden. Es wurde nichts übernommen.'); }
});
$('#import-preview').addEventListener('click', event => {
  if (event.target.id === 'cancel-import') { pendingImport = undefined; $('#import-preview').hidden = true; $('#import-file').value = ''; }
  if (event.target.id !== 'confirm-import' || !pendingImport) return;
  try {
    if (!store) throw new Error();
    const result = store.importRecords(pendingImport); pendingImport = undefined;
    $('#import-preview').hidden = true; $('#import-file').value = ''; renderLibrary();
    tell(`${result.added} Fassungen übernommen, ${result.skipped} gleiche Inhalte übersprungen.`);
  } catch { tell('Übernehmen war nicht möglich. Die vorhandenen Daten wurden nicht verändert.'); }
});
window.addEventListener('storage', event => {
  if (['borderline-spur-v1','borderline-spuren-v2'].includes(event.key)) { renderLibrary(); tell('Der Speicher wurde in einem anderen Fenster verändert. Dein offener Entwurf bleibt stehen.'); }
});

function chooseDevelopment(id) {
  const item = developmentNodes.find(node => node.id === id) || developmentNodes[0];
  $('#development-map').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.development === item.id)));
  $('#development-detail').innerHTML = `<p class="eyebrow">Ein möglicher Einfluss · kein festgelegter Weg</p><h2>${esc(item.title)}</h2><p>${esc(item.summary)}</p><div class="example"><h3>Ein erfundenes Beispiel</h3><p>${esc(item.example)}</p></div><h3>Eine offene Frage</h3><p>${esc(item.question)}</p><details><summary>Was sich daraus nicht ableiten lässt</summary><p>${esc(item.limit)}</p></details>`;
}
$('#development-map').innerHTML = developmentNodes.map((node, index) => `<button data-development="${esc(node.id)}" aria-pressed="false"><span aria-hidden="true">${['◌','↔','◇','⌁','◎','↗'][index]}</span>${esc(node.title)}</button>`).join('');
$('#development-map').addEventListener('click', event => { const button = event.target.closest('[data-development]'); if (button) chooseDevelopment(button.dataset.development); });
$('#development-citations').innerHTML = citations(['adversity-2020','prospective-2016','development-2024','resilience-2025']);
chooseDevelopment(developmentNodes[0].id);

let currentScenario = scenarios[0];
let currentView = 'person';
const viewLabels = {person:'Erleben', other:'Gegenüber', observer:'Beobachtung', alternatives:'Andere Erklärungen', unknown:'Unbekanntes', actions:'Handlungsspielraum'};
function renderPerspective() {
  $('#perspectives').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === currentView)));
  const view = currentScenario.views[currentView];
  $('#perspective-label').textContent = viewLabels[currentView];
  $('#perspective-title').textContent = view.title;
  $('#perspective-text').textContent = view.text;
  $('#perspective-questions').innerHTML = view.questions.map(question => `<p>${esc(question)}</p>`).join('');
}
function renderScenario() {
  $('#scenario-select').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === currentScenario.id)));
  $('#scene-title').textContent = currentScenario.title; $('#scene-text').textContent = currentScenario.scene; renderPerspective();
}
$('#scenario-select').innerHTML = scenarios.map((scenario, index) => `<button data-scenario="${esc(scenario.id)}" aria-pressed="false"><span aria-hidden="true">${['✉','◷','↔','◇'][index]}</span>${esc(scenario.title)}</button>`).join('');
$('#perspectives').innerHTML = Object.entries(viewLabels).map(([key, label]) => `<button data-view="${key}" aria-pressed="false">${esc(label)}</button>`).join('');
$('#scenario-select').addEventListener('click', event => { const button = event.target.closest('[data-scenario]'); if (!button) return; currentScenario = scenarios.find(item => item.id === button.dataset.scenario); renderScenario(); });
$('#perspectives').addEventListener('click', event => { const button = event.target.closest('[data-view]'); if (button) { currentView = button.dataset.view; renderPerspective(); } });
renderScenario();

const categories = {core:{title:'Borderline im Mittelpunkt', note:'Diese strukturierten Behandlungsansätze richten sich unmittelbar an Borderline-bezogene Schwierigkeiten. Verfügbarkeit, persönliche Ziele, Sicherheit und eine tragfähige Zusammenarbeit zählen mit.'}, ptsd:{title:'Bei zusätzlicher PTBS', note:'Traumafokussierte Verfahren behandeln eine zusätzlich festgestellte posttraumatische Belastungsstörung. Sie sind keine automatische Erklärung oder Behandlung jedes Borderline-Erlebens.'}, adjunct:{title:'Ergänzende Unterstützung', note:'Ergänzende Ansätze und Medikamente haben andere Aufgaben und eine andere Evidenzlage als die Borderline-Psychotherapie. Sie ersetzen keine gemeinsam geplante Kernbehandlung.'}};
const dimensions = {goal:'Ziel', course:'Typischer Ablauf', fit:'Voraussetzungen und Passung', limits:'Grenzen', evidence:'Forschungsstand'};
function therapyDetails(item) { return Object.entries(dimensions).map(([key, label]) => `<h3>${esc(label)}</h3><p>${esc(item[key])}</p>`).join(''); }
function chooseCategory(category) {
  $('#therapy-filters').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  $('#category-note').textContent = categories[category].note;
  $('#therapy-grid').innerHTML = therapies.filter(item => item.category === category).map(item => `<article class="panel therapy-card"><p class="eyebrow">${esc(categories[item.category].title)}</p><h2>${esc(item.title)}</h2><p>${esc(item.short)}</p><details><summary>Ziele, Ablauf und Grenzen</summary>${therapyDetails(item)}${citations(item.sourceIds)}</details></article>`).join('');
}
$('#therapy-filters').innerHTML = Object.entries(categories).map(([key, category]) => `<button data-category="${key}" aria-pressed="false">${esc(category.title)}</button>`).join('');
$('#therapy-filters').addEventListener('click', event => { const button = event.target.closest('[data-category]'); if (button) chooseCategory(button.dataset.category); });
for (const selector of ['#compare-a','#compare-b']) $(selector).innerHTML = therapies.map(item => `<option value="${esc(item.id)}">${esc(item.title)}</option>`).join('');
$('#compare-a').value = 'dbt'; $('#compare-b').value = 'mbt';
function compare() {
  const a = therapies.find(item => item.id === $('#compare-a').value);
  const b = therapies.find(item => item.id === $('#compare-b').value);
  $('#comparison-result').innerHTML = `<div class="compare-row compare-heading"><div><h3>${esc(a.title)}</h3><p>${esc(categories[a.category].title)}</p></div><div><h3>${esc(b.title)}</h3><p>${esc(categories[b.category].title)}</p></div></div>${Object.entries(dimensions).map(([key, label]) => `<div class="compare-row"><div><h4>${esc(label)}</h4><p>${esc(a[key])}</p></div><div><h4>${esc(label)}</h4><p>${esc(b[key])}</p></div></div>`).join('')}<div class="compare-row"><div>${citations(a.sourceIds)}</div><div>${citations(b.sourceIds)}</div></div>`;
}
$('#compare-a').addEventListener('change', compare); $('#compare-b').addEventListener('change', compare);
chooseCategory('core'); compare();
$('#therapy-citations').innerHTML = citations(['s3-borderline','apa-2024','boots-2026']);
$('#family-citations').innerHTML = citations(['family-2024','family-2026','apa-2024']);
$('#atlas-sources').innerHTML = atlasSources.map(source => `<details class="source-item"><summary>${esc(source.name)}</summary><p class="eyebrow">${esc(source.kind)}</p><p>${esc(source.incorporated)}</p><p class="caption">${esc(source.limit)}</p>${source.url ? externalLink(source.url, 'Werkverbindung öffnen') : ''}${source.path ? `<details class="technical"><summary>Technische Herkunft öffnen</summary><p>Originalpfad des geprüften Werkbestands:</p><code>${esc(source.path)}</code></details>` : ''}</details>`).join('');
$('#notebook-research').innerHTML = renderNotebookResearch();
document.addEventListener('click', event => {
  const phenomenonLink = event.target.closest('[data-research-phenomenon]');
  const pathLink = event.target.closest('[data-open-research-path]');
  const groupLink = event.target.closest('[data-research-group]');
  if (!phenomenonLink && !pathLink && !groupLink) return;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (phenomenonLink) {
    if (location.hash !== '#erleben') history.pushState(null, '', '#erleben');
    route(true);
    window.dispatchEvent(new CustomEvent('atlas-dossier-search', {detail:{phenomenonId:phenomenonLink.dataset.researchPhenomenon}}));
    return;
  }
  if (location.hash !== '#quellen') history.pushState(null, '', '#quellen');
  route(true);
  const target = document.getElementById(pathLink ? `recherche-${pathLink.dataset.openResearchPath}` : `recherchefeld-${groupLink.dataset.researchGroup}`);
  requestAnimationFrame(() => {target?.scrollIntoView({block:'start',behavior:'auto'});target?.querySelector('h3, h4')?.focus({preventScroll:true});});
});
$('#research-sources').innerHTML = sources.map(source => `<details class="source-item"><summary>${esc(source.title)}</summary><p class="eyebrow">${esc(source.type)} · ${esc(source.date)}</p><p>${esc(source.claim)}</p><p class="caption">${esc(source.limit)}</p>${externalLink(source.url, 'Originalquelle öffnen')}</details>`).join('');
initTriggerReader(); renderMap(); renderLibrary(); route(true);
