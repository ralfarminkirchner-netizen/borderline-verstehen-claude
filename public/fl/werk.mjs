// Persönliche Arbeit: Zustand je Fugenraum und ein Ereignisprotokoll.
// Gespeichert wird nur auf diesem Rechner über den eigenen Dienst; ein veralteter Stand wird abgewiesen, nicht überschrieben.
const LEER = () => ({ format: 'fugenland-werkstatt', version: 2, gefuege: [], notizen: [], verlauf: [], raeume: {}, ereignisse: [] });

export const werk = { daten: LEER(), revision: 'neu', hoerer: new Set(), stand: 'lädt' };
let timer = null; let laeuft = Promise.resolve();

const melde = (stand) => { werk.stand = stand; for (const f of werk.hoerer) f(stand); };

export async function laden() {
  try {
    const r = await fetch('/api/werkstatt', { cache: 'no-store' });
    if (!r.ok) throw new Error(String(r.status));
    const d = await r.json(); werk.revision = d.revision; delete d.revision;
    werk.daten = { ...LEER(), ...d, raeume: d.raeume || {}, ereignisse: d.ereignisse || [] };
    melde(werk.daten.ereignisse.length ? 'gespeichert' : 'leer');
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

function vormerken() { melde('ungespeichert'); clearTimeout(timer); timer = setTimeout(speichern, 500); }

export function speichern() {
  laeuft = laeuft.then(async () => {
    melde('speichert');
    try {
      const r = await fetch('/api/werkstatt', { method: 'PUT', headers: { 'content-type': 'application/json', 'if-match': werk.revision }, body: JSON.stringify(werk.daten) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 409) { melde('neuerer Stand vorhanden – bitte neu laden'); return; }
      if (!r.ok) { melde(d.fehler || 'nicht gespeichert'); return; }
      werk.revision = d.revision; melde('gespeichert');
    } catch { melde('nicht gespeichert – Dienst nicht erreichbar'); }
  });
  return laeuft;
}
