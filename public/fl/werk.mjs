// Persönliche Arbeit: Zustand je Fugenraum und ein Ereignisprotokoll.
// Gespeichert wird nur auf diesem Rechner über den eigenen Dienst; ein veralteter Stand wird abgewiesen, nicht überschrieben.
const LEER = () => ({ format: 'fugenland-werkstatt', version: 2, gefuege: [], notizen: [], verlauf: [], raeume: {}, ereignisse: [] });

// aenderung zählt jede lokale Änderung; bestaetigt ist die höchste Änderung, deren Schreiben der Dienst bestätigt hat.
export const werk = { daten: LEER(), revision: 'neu', hoerer: new Set(), stand: 'lädt', aenderung: 0, bestaetigt: 0, unklar: null, sitzung: Math.random().toString(36).slice(2) };
let timer = null; let laeuft = Promise.resolve();

const melde = (stand) => { werk.stand = stand; for (const f of werk.hoerer) f(stand); };

export async function laden() {
  try {
    const r = await fetch('/api/werkstatt', { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const d = await r.json(); werk.revision = d.revision; delete d.revision;
    werk.daten = { ...LEER(), ...d, raeume: d.raeume || {}, ereignisse: d.ereignisse || [] };
    melde(werk.daten.ereignisse.length ? 'geladen' : 'leer');
  } catch { melde('nicht erreichbar'); }
}

export const raumZustand = (key) => werk.daten.raeume[key] || null;

// Jede Handlung in einem Raum verändert dessen Zustand und hinterlässt ein Ereignis am Ort des Raums im Feld.
export function handlung(key, art, ort, aendern, was = '') {
  const z = structuredClone(werk.daten.raeume[key] || {});
  aendern(z); z.geaendert = new Date().toISOString();
  werk.daten.raeume[key] = z;
  werk.daten.ereignisse.push({ zeit: z.geaendert, art, raum: key, x: Math.round(ort.x), y: Math.round(ort.y), was: String(was).slice(0, 160) });
  vormerken();
  return z;
}

function vormerken() { werk.aenderung++; melde('ungespeichert'); clearTimeout(timer); timer = setTimeout(speichern, 500); }

// Drei Ausgänge eines Speichervorgangs: gespeichert (der Dienst hat bestätigt), nicht gespeichert (abgelehnt oder
// nachweislich nicht geschrieben) und Wirkung unklar (die Antwort fehlt, der Dienst kann geschrieben haben oder nicht).
// Unklar zählt nie als gespeichert. Geklärt wird durch Lesen des Speichers, nicht durch erneutes Senden;
// solange das nicht gelingt, wird nicht blind weitergeschrieben.
export function speichern() {
  laeuft = laeuft.then(async () => {
    if (werk.unklar && !(await klaeren())) return;
    melde('speichert'); const nr = werk.aenderung; const text = JSON.stringify(werk.daten);
    let r;
    try { r = await fetch('/api/werkstatt', { method: 'PUT', headers: { 'content-type': 'application/json', 'if-match': werk.revision }, body: text }); }
    catch { werk.unklar = { nr, text }; melde('unklar'); await klaeren(); return; }
    const d = await r.json().catch(() => null);
    if (r.status === 409) { melde('neuerer Stand vorhanden – bitte neu laden'); return; }
    if (!r.ok) { melde((d && d.fehler) || 'nicht gespeichert'); return; }
    if (!d || typeof d.revision !== 'string') { werk.unklar = { nr, text }; melde('unklar'); await klaeren(); return; }
    werk.revision = d.revision; werk.bestaetigt = Math.max(werk.bestaetigt, nr); melde('gespeichert');
  });
  return laeuft;
}

// Liest den Stand des Dienstes und entscheidet den offenen Ausgang. true: geklärt; false: weiter unklar oder überholt.
async function klaeren() {
  const u = werk.unklar;
  let d;
  try { const r = await fetch('/api/werkstatt', { cache: 'no-store' }); if (!r.ok) throw new Error(String(r.status)); d = await r.json(); }
  catch { melde('unklar'); return false; }
  const rev = d.revision; delete d.revision; delete d.gespeichert;
  const gesendet = JSON.parse(u.text); delete gesendet.gespeichert;
  werk.unklar = null;
  if (rev === werk.revision) { melde('nicht gespeichert'); return true; }
  if (JSON.stringify(d) === JSON.stringify(gesendet)) { werk.revision = rev; werk.bestaetigt = Math.max(werk.bestaetigt, u.nr); melde('gespeichert'); return true; }
  melde('neuerer Stand vorhanden – bitte neu laden'); return false;
}

// Werkbank und Notizen: ändern die gemeinsamen Listen und hinterlassen auf Wunsch ein Ereignis im Feld.
export function aendereWerk(aendern, ereignis = null) {
  aendern(werk.daten);
  if (ereignis) werk.daten.ereignisse.push({ zeit: new Date().toISOString(), ...ereignis, x: Math.round(ereignis.x), y: Math.round(ereignis.y) });
  vormerken();
}
