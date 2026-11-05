// Editorial placement describes the material's subject, never clinical frequency.
const trauma = ['TraumaAtlas', 'Diagnose & Differenzierung', 'Forschung & Einordnung'];
const neuro = ['Neuroatlas', 'ADHS · Randphänomene', 'Diagnose & Differenzierung', 'Phänomenatlas'];
export const mediaPlacements = {
  'traumaatlas-mensch-verbindungen': ['TraumaAtlas', 'Beziehungswerkstatt', 'Beziehungen & Borderline'],
  'traumaatlas-kugel-welle': ['TraumaAtlas', 'Trigger & Kontext'],
  'traumaatlas-lichtfluss-koerper': ['TraumaAtlas', 'Trigger & Kontext'],
  'notebook-trauma-audio': trauma,
  'va-cpt': trauma,
  'va-pe': trauma,
  'assets/media/trauma-mindmap.png': trauma,
  'assets/media/trauma-video.mp4': trauma,
  'notebook-trauma-infographic': trauma,
  'notebooklm-neurodivergenz-video': neuro,
  'notebooklm-dyskalkulie-video': ['Neuroatlas', 'Phänomenatlas'],
  'notebooklm-adhs-dyskalkulie-video': ['Neuroatlas', 'ADHS · Randphänomene', 'Phänomenatlas'],
  'notebooklm-zahlen-audio': ['Neuroatlas', 'Phänomenatlas'],
  'sgw-stress-video': ['Trigger & Kontext', 'Neuroatlas', 'Dynamikraum'],
  'sgw-biopsychosocial-video': ['Phänomenatlas', 'Neuroatlas', 'Beziehungswerkstatt', 'Beziehungen & Borderline'],
  'sgw-sleep-video': ['Neuroatlas', 'ADHS · Randphänomene', 'Phänomenatlas'],
  'awmf-ptbs-patient-2026': trauma,
  'lmu-bpd-information': ['Beziehungen & Borderline', 'Diagnose & Differenzierung'],
  'at-adult-adhd-information': neuro,
  'bavaria-autism-perspectives': neuro,
  'tirol-stress-selfhelp': ['Trigger & Kontext', 'Neuroatlas', 'Dynamikraum'],
  'konstanz-safety-plan': ['TraumaAtlas', 'Beziehungswerkstatt', 'Beziehungen & Borderline'],
  "kunst-wak-erfuellte-zeit-2017": ["Phänomenatlas", "Neuroatlas"],
  "kunst-wak-herbstlicher-farbentaumel-2016": ["Phänomenatlas", "Neuroatlas", "ADHS · Randphänomene"],
  "kunst-wak-ein-ganz-gewoehnlicher-tag-2008": ["Phänomenatlas", "Neuroatlas", "Dynamikraum", "Beziehungswerkstatt", "ADHS · Randphänomene"],
  "kunst-wak-lass-die-puppen-tanzen-2018": ["Phänomenatlas", "Dynamikraum", "Beziehungswerkstatt"],
  "kunst-wak-konflikt-2010": ["Phänomenatlas", "Dynamikraum", "Beziehungswerkstatt", "Beziehungen & Borderline", "Trigger & Kontext"],
  "kunst-wak-relax-2014": ["Phänomenatlas", "Neuroatlas", "Beziehungswerkstatt", "TraumaAtlas"],
  "kunst-wak-schicksalswege-2016": ["Phänomenatlas"],
  "kunst-wak-taenzer-2006": ["Phänomenatlas", "Neuroatlas", "Beziehungswerkstatt"],
  "kunst-wak-nischbach-und-die-schlimmen-jahre-1999": ["Phänomenatlas"],
  "kunst-wak-franz-heinz-2019": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-lennart-2010": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-jannik-2010": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-franco-2015": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-linda-2005": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-evelyne-2005": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-andrea-2008": ["Phänomenatlas", "Beziehungswerkstatt"],
  "kunst-wak-nach-dem-bad-2009": ["Phänomenatlas", "Neuroatlas"],
  "kunst-wak-dornroeschen-2010": ["Phänomenatlas", "Neuroatlas"]
};
export const normalizeText = value => String(value || '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
export const placementsFor = item => mediaPlacements[item.id || item.file] || [];
/** View-local associations. Never append these media endpoints to canonical text relations. */
export function mediaEditorialRelations(media, entries, {targetPrefix='landscape-medium-'}={}) {
  const entryIds=new Set(entries.map(item=>item.id)),seen=new Set(),result=[];
  for(const item of media) for(const relation of item.editorialRelations || []) {
    if(!item.id || !entryIds.has(relation.from) || !['landscape-medium-'+item.id,'media:'+item.id].includes(relation.to))continue;
    const to=targetPrefix+item.id,key=relation.from+'\n'+to+'\n'+relation.label;
    if(seen.has(key))continue;
    seen.add(key);result.push({...relation,to});
  }
  return result;
}
export function mediaMatches(item, { query = '', collection = 'all' } = {}) {
  return (collection === 'all' || placementsFor(item).includes(collection)) &&
    normalizeText([item.title, item.summary, item.atlasPlace, ...(item.tags || [])].join(' ')).includes(normalizeText(query));
}
