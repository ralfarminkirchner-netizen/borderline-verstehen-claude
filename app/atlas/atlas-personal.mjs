// Personal overlays retain canonical entry keys; the Atlas itself is never changed.
export const PERSONAL_SCHEMA = 1;
export const markMeanings = [
  ['familiar', 'Kenne ich', 'Mir ist dieses Erleben vertraut.'],
  ['relevant', 'Betrifft mich gerade', 'Das ist im Moment für mich bedeutsam.'],
  ['interested', 'Möchte ich verstehen', 'Darüber möchte ich mehr erfahren.'],
];
const copy = value => JSON.parse(JSON.stringify(value));
const fitsStorage = value => new TextEncoder().encode(JSON.stringify(value)).byteLength <= 512 * 1024;
const cleanText = (value, max = 6000) => typeof value === 'string' ? value.slice(0, max) : '';
const uid = () => globalThis.crypto?.randomUUID?.() || `profile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const initial = () => { const id = uid(); return { schemaVersion: PERSONAL_SCHEMA, activeProfileId: id, profiles: [{ id, name: 'Mein Blick', marks: {} }] }; };
function normalize(raw, allowed) {
  if (!raw || raw.schemaVersion !== PERSONAL_SCHEMA || !Array.isArray(raw.profiles) || !raw.profiles.length || raw.profiles.length > 50) throw new Error('Die Datei enthält keine gültigen persönlichen Atlasdaten.');
  const ids = new Set();
  const profiles = raw.profiles.map(profile => {
    if (typeof profile?.id !== 'string' || !profile.id || profile.id.length > 200 || ids.has(profile.id) || !profile.marks || typeof profile.marks !== 'object' || Array.isArray(profile.marks)) throw new Error('Die Profile konnten nicht gelesen werden.');
    ids.add(profile.id);
    const marks = {};
    for (const [entryId, mark] of Object.entries(profile.marks)) {
      if (['__proto__', 'prototype', 'constructor'].includes(entryId) || (allowed && !allowed.has(entryId)) || !mark || typeof mark !== 'object') throw new Error('Eine Markierung passt nicht zum vorhandenen Atlas.');
      const value = Object.fromEntries(markMeanings.map(([key]) => [key, mark[key] === true]));
      Object.assign(value, { note: cleanText(mark.note), question: cleanText(mark.question), intensity: ['leicht', 'mittel', 'stark'].includes(mark.intensity) ? mark.intensity : '', since: /^\d{4}-\d{2}-\d{2}$/.test(mark.since || '') ? mark.since : '', updatedAt: cleanText(mark.updatedAt, 40) });
      if (mark.provenance && typeof mark.provenance === 'object') value.provenance = Object.fromEntries(['kind','provider','model','createdAt'].map(key => [key, cleanText(mark.provenance[key], 200)]));
      Object.defineProperty(marks, entryId, { value, enumerable: true, writable: true, configurable: true });
    }
    return { id: profile.id, name: cleanText(profile.name, 80).trim() || 'Unbenannter Blick', marks };
  });
  return { schemaVersion: PERSONAL_SCHEMA, activeProfileId: ids.has(raw.activeProfileId) ? raw.activeProfileId : profiles[0].id, profiles };
}
function importedState(text, allowed) { const next = normalize(JSON.parse(text), allowed); if (!fitsStorage(next)) throw new Error('Die persönlichen Daten sind zu groß.'); return next; }
export function createPersonalStore({ storage, storageKey = 'atlas-personal-v1', initialState, entryIds, onPersist } = {}) {
  const allowed = entryIds ? new Set(entryIds) : null;
  let state = initialState ? normalize(initialState, allowed) : initial();
  let storageError = '', pendingPersists = 0, persistAttempt = 0, persisted = false;
  if (storage) { try { const saved = storage.getItem(storageKey); if (saved) state = normalize(JSON.parse(saved), allowed); } catch { storageError = 'Gespeicherte Markierungen konnten nicht geladen werden. Neue Änderungen bleiben zunächst in dieser Ansicht.'; } }
  const listeners = new Set(), persistenceListeners = new Set(), history = [];
  const active = () => state.profiles.find(profile => profile.id === state.activeProfileId);
  const emit = () => { for (const listener of listeners) listener(copy(state)); };
  const emitPersistence = () => { for (const listener of persistenceListeners) listener(); };
  function persist() {
    const attempt = ++persistAttempt;
    const failed = 'Das Speichern ist fehlgeschlagen. Die Änderungen bleiben in dieser Ansicht; bitte exportieren.';
    try {
      storage?.setItem(storageKey, JSON.stringify(state));
      const result = onPersist?.(copy(state));
      if (result?.then) {
        pendingPersists++; persisted = false; emitPersistence();
        const settle = error => {
          pendingPersists--;
          if (attempt === persistAttempt) { storageError = error ? failed : ''; persisted = !error; }
          emitPersistence();
        };
        Promise.resolve(result).then(() => settle(false), () => settle(true));
      } else if (storage || onPersist) { storageError = ''; persisted = true; emitPersistence(); }
    } catch { storageError = failed; persisted = false; emitPersistence(); }
  }
  function commit(change) { const before = copy(state); change(); if (!fitsStorage(state)) { state = before; storageError = 'Der persönliche Speicher ist voll. Diese Änderung wurde nicht übernommen. Kürze zuerst vorhandene Notizen oder entferne einen Blick; exportiere Arbeit, die du aufbewahren möchtest.'; emit(); return false; } history.push(before); if (history.length > 50) history.shift(); persist(); emit(); return true; }
  const store = {
    read: () => copy(state), activeProfile: () => copy(active()), markFor: entryId => copy(active().marks[entryId] || {}),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    subscribePersistence(listener) { persistenceListeners.add(listener); return () => persistenceListeners.delete(listener); },
    get isPersisting() { return pendingPersists > 0; },
    get persistenceState() { return storageError ? 'error' : pendingPersists ? 'saving' : persisted ? 'saved' : 'idle'; },
    get persistenceMessage() { return storageError || (pendingPersists ? 'Deine persönlichen Änderungen werden gespeichert …' : persisted ? 'Deine persönlichen Änderungen sind gespeichert.' : ''); }, get canUndo() { return history.length > 0; },
    setMark(entryId, patch) {
      if (typeof entryId !== 'string' || ['__proto__', 'constructor', 'prototype'].includes(entryId) || (allowed && !allowed.has(entryId))) throw new Error('Dieses Phänomen gehört nicht zum vorhandenen Atlas.');
      const candidate = copy(state); const profile = candidate.profiles.find(item => item.id === candidate.activeProfileId);
      Object.defineProperty(profile.marks, entryId, { value: { ...store.markFor(entryId), ...patch, updatedAt: new Date().toISOString() }, enumerable: true });
      const safe = normalize(candidate, allowed);
      return commit(() => { state = safe; });
    },
    removeMark(entryId) { if (Object.hasOwn(active().marks, entryId)) commit(() => { delete active().marks[entryId]; }); },
    addProfile(name) { if (state.profiles.length >= 50) { storageError = 'Du kannst bis zu 50 Blicke anlegen. Entferne zuerst einen Blick, wenn du einen weiteren brauchst.'; emit(); return null; } const id = uid(); return commit(() => { state.profiles.push({ id, name: cleanText(name, 80).trim() || 'Weiterer Blick', marks: {} }); state.activeProfileId = id; }) ? id : null; },
    renameProfile(id, name) { if (state.profiles.some(item => item.id === id)) commit(() => { state.profiles.find(item => item.id === id).name = cleanText(name, 80).trim() || 'Unbenannter Blick'; }); },
    selectProfile(id) { if (state.activeProfileId !== id && state.profiles.some(item => item.id === id)) commit(() => { state.activeProfileId = id; }); },
    deleteProfile(id) { if (!state.profiles.some(item => item.id === id)) return; commit(() => { state.profiles = state.profiles.filter(item => item.id !== id); if (!state.profiles.length) state = initial(); else if (!state.profiles.some(item => item.id === state.activeProfileId)) state.activeProfileId = state.profiles[0].id; }); },
    clearAll() { commit(() => { state = initial(); }); },
    undo() { if (history.length) { state = history.pop(); persist(); emit(); } },
    exportJSON: () => JSON.stringify(state, null, 2),
    importJSON(text) { const next = importedState(text, allowed); commit(() => { state = next; }); },
    hydrate(raw) { state = normalize(raw, allowed); history.length = 0; emit(); },
  };
  return store;
}
// A native leave/reload warning exists only while an asynchronous save is pending.
export function guardPendingPersonalWrites(store, target = globalThis.window) {
  let listening = false;
  const warn = event => { if (store.isPersisting) { event.preventDefault(); event.returnValue = ''; } };
  const sync = () => {
    if (listening === store.isPersisting) return;
    listening = store.isPersisting;
    if (listening) target.addEventListener('beforeunload', warn);
    else target.removeEventListener('beforeunload', warn);
  };
  const stop = store.subscribePersistence(sync); sync();
  return () => { stop(); if (listening) target.removeEventListener('beforeunload', warn); listening = false; };
}
const el = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
function mountPersistenceStatus(host, store) {
  const status = el('p', undefined, 'personal-status');
  status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
  const update = () => { status.textContent = store.persistenceMessage; status.hidden = !status.textContent; status.dataset.state = store.persistenceState; };
  update(); host.append(status);
  return store.subscribePersistence(update);
}
const button = (text, action) => { const node = el('button', text); node.type = 'button'; node.addEventListener('click', action); return node; };
function field(text, input) { const label = el('label', undefined, 'personal-field'); label.append(el('span', text), input); return label; }
function confirmInline(host, message, action) { const box = el('div', undefined, 'personal-confirm'); box.setAttribute('role', 'group'); box.setAttribute('aria-label', message); box.append(el('p', message), button('Ja, löschen', () => { box.remove(); action(); }), button('Abbrechen', () => box.remove())); host.append(box); box.querySelector('button').focus(); }
// Unsaved form values survive view repainting, but never enter persistence before Save.
const personalDrafts = new WeakMap();
export function mountPersonalControls(host, { store, entry }) {
  host.classList.add('atlas-personal');
  let stopStatus;
  let drafts = personalDrafts.get(store); if (!drafts) { drafts = new Map(); personalDrafts.set(store, drafts); }
  function render() {
    stopStatus?.();
    const draftKey = JSON.stringify([store.activeProfile().id, entry.id]);
    const draft = drafts.get(draftKey);
    const detailsOpen = draft?.open ?? (host.querySelector('details')?.open || false);
    const focusedMeaning = document.activeElement?.dataset?.personalMeaning;
    const mark = store.markFor(entry.id); host.replaceChildren();
    host.append(el('h3', 'Mein Blick auf dieses Phänomen'), el('p', `Für „${store.activeProfile().name}“ · persönliche Beobachtung, keine Diagnose.`, 'personal-help'));
    const meanings = el('div', undefined, 'personal-meanings');
    for (const [key, title, hint] of markMeanings) { const input = el('input'); input.type = 'checkbox'; input.checked = !!mark[key]; input.dataset.personalMeaning = key; const label = field(title, input); label.title = hint; input.addEventListener('change', () => store.setMark(entry.id, { [key]: input.checked })); meanings.append(label); }
    host.append(meanings);
    const details = el('details'); details.open = detailsOpen; details.append(el('summary', 'Notiz, Frage und zeitliche Einordnung'));
    const note = el('textarea'); note.value = draft?.note ?? mark.note ?? ''; note.rows = 3; note.maxLength = 6000;
    const question = el('textarea'); question.value = draft?.question ?? mark.question ?? ''; question.rows = 2; question.maxLength = 6000;
    const intensity = el('select'); for (const [value, text] of [['', 'Nicht einordnen'], ['leicht', 'Leicht'], ['mittel', 'Mittel'], ['stark', 'Stark']]) { const option = el('option', text); option.value = value; intensity.append(option); } intensity.value = mark.intensity || '';
    intensity.value = draft?.intensity ?? mark.intensity ?? '';
    const since = el('input'); since.type = 'date'; since.value = draft?.since ?? mark.since ?? '';
    const capture = () => drafts.set(draftKey, { note: note.value, question: question.value, intensity: intensity.value, since: since.value, open: details.open });
    for (const input of [note, question, intensity, since]) { input.addEventListener('input', capture); input.addEventListener('change', capture); }
    details.addEventListener('toggle', () => { if (drafts.has(draftKey)) capture(); });
    details.append(field('Meine Notiz (freiwillig)', note), field('Meine offene Frage (freiwillig)', question), field('So intensiv erlebe ich es gerade (freiwillig)', intensity), field('Beobachtet am / seit (freiwillig)', since), button('Einordnung speichern', () => { capture(); if (store.setMark(entry.id, { note: note.value, question: question.value, intensity: intensity.value, since: since.value }) !== false) drafts.delete(draftKey); }));
    host.append(details);
    if (Object.keys(mark).length) host.append(button('Markierung entfernen', () => { drafts.delete(draftKey); store.removeMark(entry.id); }));
    const undo = button('Rückgängig', () => store.undo()); undo.disabled = !store.canUndo; host.append(undo);
    stopStatus = mountPersistenceStatus(host, store);
    if (focusedMeaning) [...host.querySelectorAll('input[type=checkbox]')].find(input => input.dataset.personalMeaning === focusedMeaning)?.focus();
  }
  const stop = store.subscribe(render); render(); return () => { stop(); stopStatus?.(); host.replaceChildren(); };
}
export function mountProfileControls(host, { store, entries = [], onNavigate, storageDescription = 'Der angeschlossene Speicher bestimmt, ob deine Änderungen über diese Sitzung hinaus erhalten bleiben. Exportiere persönliche Aufzeichnungen, die du zusätzlich aufbewahren möchtest.' } = {}) {
  host.classList.add('atlas-personal', 'personal-profiles'); const byId = new Map(entries.map(entry => [entry.id, entry]));
  let filter = 'all', stopStatus;
  function render() {
    stopStatus?.();
    const snapshot = store.read(), profile = store.activeProfile(); host.replaceChildren();
    host.append(el('h2', 'Meine Phänomene'), el('p', 'Jeder Blick hat eigene Markierungen und Notizen. Andere Blicke werden beim Wechsel nicht vermischt.', 'personal-help'), el('p', storageDescription, 'personal-help'));
    const select = el('select'); for (const item of snapshot.profiles) { const option = el('option', item.name); option.value = item.id; select.append(option); } select.value = profile.id; select.addEventListener('change', () => store.selectProfile(select.value));
    host.append(field('Aktueller Blick', select));
    const name = el('input'); name.type = 'text'; name.value = profile.name; name.maxLength = 80;
    host.append(field('Name dieses Blicks', name), button('Namen speichern', () => store.renameProfile(profile.id, name.value)), button('Neuen Blick anlegen', () => store.addProfile('Weiterer Blick')));
    const filters = el('div', undefined, 'personal-filters'); for (const [key, title] of [['all', 'Alle Markierungen'], ...markMeanings]) { const control = button(title, () => { filter = key; render(); }); control.setAttribute('aria-pressed', String(filter === key)); filters.append(control); } host.append(filters);
    const list = el('div', undefined, 'personal-mark-list');
    const marked = Object.entries(profile.marks).filter(([, mark]) => filter === 'all' || mark[filter]);
    for (const [entryId, mark] of marked) {
      const entry = byId.get(entryId), row = el('article', undefined, 'personal-mark');
      row.append(button(entry?.title || 'Phänomen im Atlas', () => onNavigate?.(entryId)), el('p', markMeanings.filter(([key]) => mark[key]).map(([, title]) => title).join(' · ') || 'Persönliche Notiz'));
      if (mark.note) { const note = el('p', mark.note); note.dataset.publicCopyPreserve = ''; row.append(note); } if (mark.question) { const question = el('p', `Offene Frage: ${mark.question}`); question.dataset.publicCopyPreserve = ''; row.append(question); }
      if (mark.since || mark.intensity) row.append(el('small', [mark.since ? new Date(`${mark.since}T12:00:00`).toLocaleDateString('de-DE') : '', mark.intensity ? `Intensität: ${mark.intensity}` : ''].filter(Boolean).join(' · ')));
      row.append(button('Entfernen', () => store.removeMark(entryId))); list.append(row);
    }
    if (!marked.length) list.append(el('p', 'Hier ist noch nichts markiert. Öffne ein Phänomen im Atlas und wähle, was es für dich bedeutet.'));
    host.append(list);
    const undo = button('Letzte Änderung rückgängig', () => store.undo()); undo.disabled = !store.canUndo; host.append(undo);
    host.append(button('Diesen Blick löschen', () => confirmInline(host, `„${profile.name}“ mit allen zugehörigen Markierungen und Notizen löschen?`, () => store.deleteProfile(profile.id))));
    const transfer = el('details'); transfer.append(el('summary', 'Persönliche Daten übertragen oder löschen'));
    transfer.append(el('p', 'Ein Export enthält alle Blicke, Notizen und vollständige Atlasverweise. Behandle ihn wie persönliche Aufzeichnungen.'));
    transfer.append(button('Export herunterladen', () => { const url = URL.createObjectURL(new Blob([store.exportJSON()], { type: 'application/json' })); const link = el('a'); link.href = url; link.download = 'mein-atlasblick.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }));
    const technicalImport = el('details'); technicalImport.append(el('summary', 'Technischer JSON-Import'));
    const input = el('textarea'); input.rows = 4; input.setAttribute('aria-label', 'Persönliche Atlasdaten importieren'); input.placeholder = 'Hier einen persönlichen Atlasexport einfügen';
    const feedback = el('p'); feedback.setAttribute('role', 'status');
    technicalImport.append(input, button('Import prüfen', () => { try { importedState(input.value, new Set(entries.map(item => item.id))); feedback.replaceChildren(el('span', 'Gültiger Export. Der Import ersetzt alle gegenwärtigen Blicke. '), button('Jetzt ersetzen', () => { try { store.importJSON(input.value); } catch { feedback.textContent = 'Der Import konnte nicht übernommen werden.'; } })); } catch { feedback.textContent = 'Dieser Export passt nicht zum vorhandenen Atlas oder ist zu groß. Es wurde nichts verändert.'; } }), feedback);
    transfer.append(technicalImport, button('Alle persönlichen Daten löschen', () => confirmInline(host, 'Alle Blicke, Markierungen und Notizen löschen? Du kannst diese Änderung in dieser Sitzung rückgängig machen.', () => store.clearAll())));
    host.append(transfer);
    stopStatus = mountPersistenceStatus(host, store);
  }
  const stop = store.subscribe(render); render(); return () => { stop(); stopStatus?.(); host.replaceChildren(); };
}
