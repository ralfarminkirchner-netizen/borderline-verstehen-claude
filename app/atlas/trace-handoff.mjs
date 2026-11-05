import { fieldNames } from './trace-store.mjs';

const keys = Object.keys(fieldNames);
const marker = 'Ergänzung aus der Neuro-Werkstatt';
const invalid = () => ({ok:false, message:'Die Übergabe ist unvollständig oder zu lang. Dein bisheriger Entwurf bleibt erhalten.'});

// Atomic, local handover: existing notes are retained and nothing is saved here.
export function mergeTraceHandoff(current, incoming) {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming) || !incoming.fields || typeof incoming.fields !== 'object' || Array.isArray(incoming.fields)) return invalid();
  if (incoming.title !== undefined && (typeof incoming.title !== 'string' || incoming.title.length > 120)) return invalid();
  if (Object.keys(incoming.fields).some(key => !keys.includes(key))) return invalid();
  if (Object.values(incoming.fields).some(value => typeof value !== 'string' || value.length > 20000)) return invalid();
  if (!Object.values(incoming.fields).some(value => value.trim())) return invalid();
  const fields = Object.fromEntries(keys.map(key => [key, current?.fields?.[key] || '']));
  for (const key of keys) {
    const addition = incoming.fields[key]?.trim();
    if (!addition) continue;
    const previous = fields[key];
    const marked = `${marker}\n${addition}`;
    if (previous.trim() === addition || previous.includes(marked)) continue;
    fields[key] = previous.trim() ? `${previous}\n\n${marked}` : addition;
    if (fields[key].length > 20000) return invalid();
  }
  return {ok:true, draft:{title:current?.title?.trim() ? current.title : (incoming.title?.trim() || 'Meine Neuroatlas-Frage'), fields}, message:'Die Auswahl ergänzt deinen Entwurf in „Meine Spuren“. Vorhandener Text bleibt erhalten. Prüfe die Notiz und speichere sie bei Bedarf.'};
}
