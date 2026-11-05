export const fieldNames = Object.freeze({
  event: 'Situation', perception: 'Wahrnehmung', body: 'Körper', feeling: 'Gefühl',
  meaning: 'Mögliche Bedeutungen', action: 'Schutzhandlung', consequence: 'Folgen',
  need: 'Bedürfnisse', background: 'Möglicher Hintergrund'
});

const currentKey = 'borderline-spuren-v2';
const legacyKey = 'borderline-spur-v1';
const knownFields = Object.keys(fieldNames);
const legacyFields = ['event', 'body', 'meaning', 'need'];
const maxEntries = 1000;
const clone = value => JSON.parse(JSON.stringify(value));
const object = value => value !== null && typeof value === 'object' &&
  (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const fail = message => { throw new Error(message); };

function fieldsFrom(value, allowed = knownFields) {
  if (!object(value) || Object.keys(value).some(key => !allowed.includes(key))) {
    fail('Die Spur enthält unbekannte oder ungültige Felder. Es wurde nichts übernommen.');
  }
  const fields = {};
  for (const key of knownFields) {
    const text = Object.hasOwn(value, key) ? value[key] : '';
    if (typeof text !== 'string' || text.length > 20000) {
      fail('Ein Feld ist ungültig oder länger als 20.000 Zeichen. Die vorhandenen Daten bleiben erhalten.');
    }
    fields[key] = text;
  }
  return fields;
}

function recordFrom(value) {
  if (!object(value) || typeof value.id !== 'string' || !value.id || value.id.length > 160 ||
      typeof value.title !== 'string' || value.title.length > 120 ||
      typeof value.createdAt !== 'string' || !Number.isFinite(Date.parse(value.createdAt))) {
    fail('Eine gespeicherte Spur ist nicht lesbar. Bitte bewahre die vorhandenen Daten auf.');
  }
  const record = {
    id: value.id, title: value.title || 'Meine Spur', fields: fieldsFrom(value.fields),
    createdAt: new Date(value.createdAt).toISOString()
  };
  if (value.origin !== undefined) {
    if (typeof value.origin !== 'string' || value.origin.length > 120) fail('Die Herkunft einer Spur ist ungültig.');
    record.origin = value.origin;
  }
  return record;
}

function parse(text, message) {
  try { return JSON.parse(text); } catch { return fail(message); }
}

function signature(fields) {
  return JSON.stringify(knownFields.map(key => fields[key]));
}

function freshId(entries) {
  let id;
  do {
    id = globalThis.crypto?.randomUUID?.() || `spur-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  } while (entries.some(record => record.id === id));
  return id;
}

/** Local-only persistence. All writes refresh the current document first.
 * Saving creates a new version; it never overwrites an opened version.
 * localStorage has no cross-tab transaction: concurrent writes at the exact same
 * instant cannot be made atomic. The UI should react to the storage event.
 */
export function createTraceStore(storage) {
  if (!storage || typeof storage.getItem !== 'function' || typeof storage.setItem !== 'function' ||
      typeof storage.removeItem !== 'function') fail('Dieser Browser bietet keinen nutzbaren lokalen Speicher.');

  const readRaw = key => {
    try { return storage.getItem(key); }
    catch { return fail('Der lokale Speicher ist nicht zugänglich. Deine Eingaben bleiben im geöffneten Formular.'); }
  };
  const write = doc => {
    try { storage.setItem(currentKey, JSON.stringify(doc)); }
    catch { return fail('Speichern ist nicht möglich. Bitte lade deine Eingaben als Datei herunter.'); }
  };

  function readDocument() {
    const raw = readRaw(currentKey);
    if (raw === null) return { schema: 2, entries: [], legacyImported: false };
    const value = parse(raw, 'Die gespeicherten Spuren sind beschädigt. Sie wurden nicht verändert.');
    if (!object(value) || value.schema !== 2 || !Array.isArray(value.entries) || value.entries.length > maxEntries ||
        (value.legacyImported !== undefined && typeof value.legacyImported !== 'boolean')) {
      fail('Das gespeicherte Format wird nicht unterstützt. Die vorhandenen Daten wurden nicht verändert.');
    }
    const entries = value.entries.map(recordFrom);
    if (new Set(entries.map(entry => entry.id)).size !== entries.length) {
      fail('Gespeicherte Spuren sind nicht eindeutig zuordenbar. Sie wurden nicht verändert.');
    }
    return { schema: 2, entries, legacyImported: value.legacyImported === true };
  }

  function readMigrated() {
    const doc = readDocument();
    const legacyRaw = readRaw(legacyKey);
    if (legacyRaw === null) return doc;
    const legacy = parse(legacyRaw, 'Die Notiz aus der ersten Fassung ist nicht lesbar. Das Original bleibt erhalten.');
    const fields = fieldsFrom(legacy, legacyFields);
    const hasSavedFields = Object.keys(legacy).some(key => legacyFields.includes(key));
    if (doc.legacyImported && (!hasSavedFields || doc.entries.some(record =>
      record.origin === 'legacy' && signature(record.fields) === signature(fields)))) return doc;
    if (doc.entries.length >= maxEntries) fail('Der Speicher enthält bereits 1.000 Spuren. Die alte Notiz bleibt unverändert erhalten.');
    if (hasSavedFields) {
      doc.entries.unshift({
        id: freshId(doc.entries), title: doc.legacyImported ? 'Meine Spur aus einer älteren offenen Fassung' : 'Meine Spur aus der ersten Fassung', fields,
        createdAt: new Date().toISOString(), origin: 'legacy'
      });
    }
    doc.legacyImported = true;
    // Persist the complete new representation before touching any original.
    // The old key stays intact until its migrated record is explicitly deleted.
    write(doc);
    return doc;
  }

  function sorted(entries) {
    return clone(entries).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  function list() { return sorted(readMigrated().entries); }

  function save({ title = '', fields } = {}) {
    if (typeof title !== 'string' || title.length > 120) fail('Bitte verwende einen Namen mit höchstens 120 Zeichen.');
    const cleanFields = fieldsFrom(fields);
    const doc = readMigrated();
    if (doc.entries.length >= maxEntries) fail('Es sind bereits 1.000 Spuren gespeichert. Exportiere und entferne zuerst eine ältere Spur.');
    const record = {
      id: freshId(doc.entries), title: title.trim() || 'Meine Spur', fields: cleanFields,
      createdAt: new Date().toISOString(), origin: 'local'
    };
    doc.entries.unshift(record);
    write(doc);
    return clone(record);
  }

  function remove(id) {
    const doc = readMigrated();
    const index = doc.entries.findIndex(record => record.id === id);
    if (index < 0) return null;
    const [record] = doc.entries.splice(index, 1);
    const legacyRaw = record.origin === 'legacy' ? readRaw(legacyKey) : null;
    const oldLegacy = legacyRaw !== null && signature(fieldsFrom(JSON.parse(legacyRaw), legacyFields)) === signature(record.fields)
      ? legacyRaw : null;
    // Remove the duplicate original before writing the new list. If the new
    // write fails, the existing v2 record still retains every original field.
    if (oldLegacy !== null) {
      try { storage.removeItem(legacyKey); }
      catch { return fail('Die alte Notiz konnte nicht entfernt werden. Die Spur bleibt gespeichert.'); }
    }
    try { write(doc); }
    catch (error) {
      if (oldLegacy !== null) { try { storage.setItem(legacyKey, oldLegacy); } catch {} }
      throw error;
    }
    return clone(record);
  }

  function restore(value) {
    const record = recordFrom(value);
    const doc = readMigrated();
    const existing = doc.entries.find(entry => entry.id === record.id);
    if (existing && signature(existing.fields) === signature(record.fields)) return clone(existing);
    if (existing) record.id = freshId(doc.entries);
    if (doc.entries.length >= maxEntries) fail('Zum Wiederherstellen muss zuerst Platz für eine Spur frei werden.');
    doc.entries.unshift(record);
    write(doc);
    return clone(record);
  }

  function importRecords(input) {
    const data = typeof input === 'string'
      ? parse(input, 'Die gewählte Datei enthält kein lesbares Spurenformat.') : input;
    let imported;
    if (object(data) && data.schema === 2 && Array.isArray(data.entries)) {
      if (data.entries.length > maxEntries) fail('Eine Datei darf höchstens 1.000 Spuren enthalten.');
      imported = data.entries.map(recordFrom);
    } else if (object(data) && Object.keys(data).length > 0 && Object.keys(data).every(key => legacyFields.includes(key))) {
      imported = [{
        id: '', title: 'Importierte Spur aus der ersten Fassung', fields: fieldsFrom(data, legacyFields),
        createdAt: new Date().toISOString(), origin: 'import'
      }];
    } else fail('Die Datei passt nicht zum Spurenformat. Es wurde nichts übernommen.');

    const doc = readMigrated();
    const seen = new Set(doc.entries.map(record => signature(record.fields)));
    let added = 0;
    let skipped = 0;
    for (const record of imported) {
      const fingerprint = signature(record.fields);
      if (seen.has(fingerprint)) { skipped++; continue; }
      if (doc.entries.length >= maxEntries) fail('Mit diesem Import wären mehr als 1.000 Spuren gespeichert. Es wurde nichts importiert.');
      const next = { ...record, id: record.id && !doc.entries.some(entry => entry.id === record.id) ? record.id : freshId(doc.entries) };
      // Imported origin must never grant access to the local legacy duplicate.
      next.origin = 'import';
      doc.entries.unshift(next);
      seen.add(fingerprint);
      added++;
    }
    if (added) write(doc);
    return { added, skipped };
  }

  function exportData() {
    return { schema: 2, exportedAt: new Date().toISOString(), entries: list() };
  }

  function legacyStatus() {
    const doc = readMigrated();
    return { present: readRaw(legacyKey) !== null, migrated: doc.legacyImported };
  }

  return { list, save, remove, restore, importRecords, exportData, legacyStatus };
}
