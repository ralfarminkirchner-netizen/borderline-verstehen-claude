import { publicText, artworkCredit } from './atlas-public-copy.mjs';
/* Existing NotebookLM material only. Matching is an editorial navigation aid,
 * never a clinical relation or a claim that NotebookLM explicitly mapped a node. */
const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' ? value : '';
const fold = value => text(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('de').replace(/ß/g, 'ss');
const stop = new Set('aber alle allein als also andere auch auf aus bei beim bis das dass dem den der des die diese dieser dieses durch ein eine einem einen einer eines er es fur gegen hat hier ich im in ist kann kein keine mit nach nicht noch nur oder ohne sein sich sie sind so sowie uber um und uns unter vom von vor was wenn werden wie wir wird wo zu zum zur zwischen'.split(' '));
const words = value => [...new Set(fold(value).match(/[a-z0-9]{3,}/g) || [])].filter(w => !stop.has(w));
// Source systems also use GUIDs outside the RFC UUID version/variant fields.
const UUID = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/ig;
const HASH = /\b[0-9a-f]{24,}\b/ig;
// Apostrophes belong to several imported source URLs. Keep them in the target.
const SOURCE_URL = /https?:\/\/[^\s<>"]+/ig;
const human = value => publicText(text(value)).replace(SOURCE_URL, 'Quelle öffnen').replace(UUID, '[technische Kennung]').replace(HASH, '[technische Kennung]');
const esc = value => human(String(value ?? '')).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const href = value => {
  const s = text(value).trim();
  return /^(https?:\/\/|(?:\.\/)?assets\/)/i.test(s) && !/[\u0000-\u001f]/.test(s) ? s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;') : '';
};
const aliases = [
  ['adhs','aufmerksamkeitsdefizit','aufmerksamkeit','exekutiv','konzentration'],
  ['autismus','autistisch','sensorik','sinnesreize','reizuberflutung','uberlastung'],
  ['ptbs','ptsd','trauma','traumafolgen','traumatisierung'],
  ['bindung','bindungsangst','nahe','zuruckweisung','verlassen','beziehungssicherheit'],
  ['dissoziation','dissoziativ','flashback','erstarrung','unwirklich'],
  ['scham','selbstwert','identitat'], ['schutz','sicherheit','gewalt','macht','grenzen'],
  ['resilienz','handlungsspielraum','selbstwirksamkeit'],
  ['korper','interozeption','schlaf','stress','erschopfung'],
  ['narzissmus','narzisstisch'], ['co-regulation','koregulation','coregulation']
];
function topical(node, item) {
  // Deliberately use item metadata rather than every word in a long report:
  // mentioning a phenomenon once in a report is insufficient for a graph match.
  const a = words([node.title, node.name, ...list(node.tags)].join(' '));
  const b = words([item.title, item.notebookTitle, ...list(item.tags)].join(' '));
  const terms = a.filter(x => b.some(y => x === y || (Math.min(x.length,y.length) >= 6 && (x.startsWith(y) || y.startsWith(x)))));
  const af = fold([node.title,node.name,...list(node.tags)].join(' '));
  const bf = fold([item.title,item.notebookTitle,...list(item.tags)].join(' '));
  for (const group of aliases) if (group.some(x => af.includes(x)) && group.some(x => bf.includes(x))) terms.push(group[0]);
  return [...new Set(terms)];
}
function indexText(item) {
  return fold(publicText([item.title,item.notebookTitle,item.summary,...list(item.tags),item.answer,item.transcript,
    ...list(item.blocks).flatMap(b => [b.text,...list(b.items)]),
    ...list(item.sections).flatMap(s => [s.title,...list(s.blocks).flatMap(b => [b.text,...list(b.items)])]),
    ...list(item.corrections).flatMap(c => typeof c === 'string' ? c : [c.problem,c.publicCorrection,c.correction,c.text]),
  ].filter(Boolean).join(' ')));
}
function normalize(item, fallback) {
  return {...item,id:item.id || fallback,title:item.title || item.question || 'NotebookLM-Material',
    format:item.format || 'Dokument',producer:item.producer || 'NotebookLM',
    tags:list(item.tags),sourceIds:list(item.sourceIds),entryIds:list(item.entryIds),
    blocks:list(item.blocks),corrections:list(item.corrections)};
}

/** Fetch the actual existing complete exports, independently of the graph. */
export async function fetchNotebookReports(url = new URL('./notebook-reports.json', import.meta.url)) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Die vorhandenen NotebookLM-Berichte konnten nicht geladen werden.');
  return response.json();
}

/** Full catalog: no top-N selection and no hidden truncation. */
export function createNotebookContext({entries = [],media = [],sources = [],supplement = {},cards = [],reports = []} = {}) {
  const all = [];
  list(media).filter(m => /notebooklm/i.test(m.producer || '') || /^notebook/.test(m.id || '')).forEach((m,i) => {
    const map = /mindmap/i.test(m.format || '') ? supplement.mindmapTree : null;
    all.push(normalize({...m,tree:map?.tree,sourceIds:m.sourceIds || map?.sourceIds || [],
      corrections:[...list(m.corrections),...list(map?.corrections)],
      provenance:m.provenance || map?.provenance},`notebook-media-${i+1}`));
  });
  if (supplement.report) {
    const r = supplement.report;
    all.push(normalize({...r,id:'notebook-trauma-reviewed-report',format:'Lernbericht',producer:'NotebookLM · redaktionell von Codex geprüft',
      summary:r.intro,tags:['Trauma','Sicherheit','Behandlung','Handlungsspielraum'],
      sourceIds:list(r.sources).map(s => s.id).filter(Boolean),notebookUrl:supplement.mindmapTree?.notebookUrl,
      limits:[...list(r.publicLimits),...list(r.reviewScope?.limits)]},'notebook-trauma-reviewed-report'));
  }
  const cardList = Array.isArray(cards) ? cards : list(cards.cards);
  cardList.forEach((c,i) => all.push(normalize({...c,title:c.question,format:'Lernkarte',
    summary:'Vorhandene NotebookLM-Lernkarte · redaktionelle Lernfassung',tags:['Trauma','Sicherheit','Behandlung'],
    provenance:c.origin,limits:!Array.isArray(cards) ? cards.limits : [],
    corrections:c.origin?.change ? [c.origin.change] : []},`notebook-card-${i+1}`)));
  const raw = Array.isArray(reports) ? reports : list(reports.reports);
  raw.forEach((r,i) => all.push(normalize({...r,corrections:r.corrections || r.review?.issues || [],
    limits:[...list(r.limits),'NotebookLM-Rohbericht. Der gesamte Bericht und seine Originalquellen sind nicht vollständig verifiziert.'],
    format:r.format || 'Recherchebericht'},`notebook-report-${i+1}`)));
  if (!Array.isArray(reports)) list(reports.artifacts).forEach((r,i) => all.push(normalize(r,`notebook-artifact-${i+1}`)));
  const unique = [...new Map(all.map(item => [item.id,item])).values()];
  const searchIndex = new Map(unique.map(item => [item.id,indexText(item)]));
  const sourceMap = new Map(list(sources).map(s => [s.id,s]));
  const entryMap = new Map(list(entries).map(e => [e.id,e]));
  return {
    all:unique,
    counts:{total:unique.length,formats:Object.fromEntries([...new Set(unique.map(i=>i.format))].map(format=>[format,unique.filter(i=>i.format===format).length]))},
    search(query = '',{format} = {}) {
      const q = words(query);
      return unique.filter(item => (!format || format === 'Alle' || item.format === format) && q.every(w => searchIndex.get(item.id).includes(w)));
    },
    forNode(value) {
      const node = typeof value === 'string' ? entryMap.get(value) : value;
      if (!node) return [];
      const explicit = new Set([...list(node.notebookContextIds),...list(node.mediaIds),...list(node.notebookIds)]);
      return unique.flatMap(item => {
        if (explicit.has(item.id) || item.entryIds.includes(node.id)) return [{...item,match:{kind:'explicit',label:'Im Bestand direkt zugeordnet',terms:[]}}];
        const shared = item.sourceIds.filter(id => list(node.sourceIds).includes(id));
        if (shared.length) return [{...item,match:{kind:'source',label:'Gemeinsamer Quellenbezug',terms:shared.map(id=>sourceMap.get(id)?.title).filter(Boolean),sourceIds:shared}}];
        const terms = topical(node,item);
        return terms.length ? [{...item,match:{kind:'topical',label:'Thematischer Anschluss · redaktionelle Navigation',terms}}] : [];
      }).sort((a,b)=>({explicit:0,source:1,topical:2}[a.match.kind]-{explicit:0,source:1,topical:2}[b.match.kind]));
    }
  };
}

function blocksHTML(blocks) {
  return list(blocks).map(b => {
    const type = b.type || 'paragraph';
    if (type === 'list') return `<ul>${list(b.items).map(x=>`<li>${inlineHTML(x)}</li>`).join('')}</ul>`;
    if (/^heading[1-6]$/.test(type)) return `<h${Math.min(5,Number(type.at(-1))+1)}>${inlineHTML(b.text)}</h${Math.min(5,Number(type.at(-1))+1)}>`;
    return `<p class="notebook-context-paragraph">${inlineHTML(b.text)}</p>`;
  }).join('');
}
function inlineHTML(value) {
  const original = text(value);
  let html = '', cursor = 0;
  for (const match of original.matchAll(SOURCE_URL)) {
    html += esc(original.slice(cursor, match.index));
    const target = href(match[0]);
    html += target ? `<a href="${target}" target="_blank" rel="noopener noreferrer">Quelle öffnen</a>` : esc(match[0]);
    cursor = match.index + match[0].length;
  }
  return html + esc(original.slice(cursor));
}
function treeHTML(tree) {
  if (!tree) return '';
  return `<li><span>${esc(tree.label || tree.title)}</span>${tree.relation ? `<small> ${esc(tree.relation)}</small>`:''}${list(tree.children).length?`<ul>${tree.children.map(treeHTML).join('')}</ul>`:''}</li>`;
}
function correctionHTML(c) {
  if (typeof c === 'string') return `<li>${esc(c)}</li>`;
  const label = c.topic || c.title || c.timestamp || c.time || '';
  const body = c.publicCorrection || c.correction || c.corrected || c.text || c.note || c.description || '';
  return `<li>${label?`<strong>${esc(label)}</strong> `:''}${c.problem?`<p>${esc(c.problem)}</p>`:''}${esc(body)}</li>`;
}
/** Self-contained safe markup. Playback is always initiated by a human gesture. */
export function renderNotebookItem(item) {
  if (!item) return '';
  const file=href(item.file),track=href(item.track),poster=href(item.poster),book=href(item.notebookUrl || item.notebookURL);
  const fmt=fold(item.format);
  if(item.originWork === 'Walter Andreas Kirchner' && file) return `<article class="notebook-context-item notebook-artwork"><figure><img src="${file}" alt="${esc(item.title)}"><figcaption><h2>${esc(item.title)}</h2><p>${esc(artworkCredit(item))}</p></figcaption></figure></article>`;
  let player='';
  if(file && fmt.includes('audio')) player=`<audio controls preload="metadata" src="${file}" aria-label="${esc(item.title)}"></audio>`;
  else if(file && fmt.includes('video')) player=`<video controls playsinline preload="metadata" src="${file}"${poster?` poster="${poster}"`:''} aria-label="${esc(item.title)}">${track?`<track kind="captions" src="${track}" srclang="de" label="Deutsch">`:''}</video>`;
  else if(file && (fmt.includes('grafik') || fmt.includes('mindmap') || /\.(png|jpe?g|webp)$/i.test(item.file))) player=`<figure><img src="${file}" loading="lazy" alt="${esc(item.title)}">${item.tree?'<figcaption>Die vollständige zugängliche Baumfassung folgt unter der Abbildung. Gruppierung ist keine Kausalität.</figcaption>':''}</figure>`;
  const corrections=list(item.corrections);
  const limits=list(item.limits);
  const refs=list(item.references);
  return `<article class="notebook-context-item"><header><p class="notebook-context-kind">${esc(item.format === 'video' ? 'Video' : item.format)} · ${esc(item.producer)}</p><h2>${esc(item.title)}</h2>${item.match?`<p class="notebook-context-match">${esc(item.match.label)}${list(item.match.terms).length?` · ${esc(item.match.terms.join(', '))}`:''}</p>`:''}${item.summary?`<p>${esc(typeof item.summary==='string'?item.summary:'')}</p>`:''}</header>${item.provenance?`<p class="notebook-context-provenance">${esc(item.provenance)}</p>`:''}${limits.length?`<aside class="notebook-context-limits"><ul>${limits.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></aside>`:''}${corrections.length?`<details class="notebook-context-corrections"><summary>Einordnung und vorhandene Korrekturen (${corrections.length})</summary><ul>${corrections.map(correctionHTML).join('')}</ul></details>`:''}${player}${item.answer?`<details class="notebook-context-answer"><summary>Antwort aufdecken</summary><p>${esc(item.answer)}</p></details>`:''}${blocksHTML(item.blocks)}${list(item.sections).map(s=>`<section><h3>${esc(s.title)}</h3>${blocksHTML(s.blocks)}${s.reviewBasis?`<p class="notebook-context-review">${esc(s.reviewBasis)}</p>`:''}</section>`).join('')}${item.tree?`<ul class="notebook-context-tree">${treeHTML(item.tree)}</ul>`:''}${item.transcript?`<details><summary>Transkript lesen</summary><p>${esc(item.transcript)}</p></details>`:''}${refs.length?`<details class="notebook-context-references"><summary>Literaturangaben im Anbieterbericht (${refs.length})</summary><p>Literatureinträge sind keine Zählung geprüfter Originalstudien.</p><ol>${refs.map(r=>`<li>${href(r.url)?`<a href="${href(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title || 'Literaturangabe öffnen')}</a>`:esc(r.title || r.text || 'Literaturangabe')}</li>`).join('')}</ol></details>`:''}${book?`<p><a href="${book}" target="_blank" rel="noopener noreferrer">Original in NotebookLM öffnen ↗</a></p>`:''}</article>`;
}
