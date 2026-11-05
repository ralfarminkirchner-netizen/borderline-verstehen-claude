import {mountAtlasAppearance,mountAtlasMotion} from './atlas-art-direction.mjs';
import {unfoldReader,unfoldWorkshop} from './atlas-unfolding.mjs';
import { explicitlyRelatedMedia } from './atlas-media-associations.mjs';
import { observePublicCopy, publicText, artworkCredit } from './atlas-public-copy.mjs';
observePublicCopy();
import { createReadingRoute } from './reading-route.mjs';
import { applyEditorialCorrections, displaySummary } from './atlas-editorial.mjs';
import { mountKnowledgeLandscape, searchText, matchesSearch } from './knowledge-landscape.mjs';
import { mountSkillWorkshop } from './skill-workshop.mjs';
import { mountPersonalWorkbench } from './personal-workbench.mjs';
import { mountAtlasLab } from './atlas-lab.mjs';
import { renderSpatialAtlas } from './spatial-atlas.mjs';
import { renderNotebookExplorer } from './notebook-explorer.mjs';
import { createNotebookContext, fetchNotebookReports } from './notebook-context.mjs';
import { mountNotebookLibrary } from './notebook-library.mjs';
import { mountFractalAtlas } from './fractal-atlas.mjs';
import { mountAtlasRoom } from './atlas-rooms.mjs';
import { mountTerrainSpace } from './atlas-terrain-space.mjs';
import { mountNetworkSpace } from './atlas-network-space.mjs';
import { mountDynamics } from './atlas-dynamics.mjs';
import { mediaEditorialRelations } from './atlas-selection.mjs';
import { createPersonalStore, mountPersonalControls, guardPendingPersonalWrites } from './atlas-personal.mjs';
import { mountAtlasPlayer } from './atlas-player.mjs';
import { mountAtlasCompanion, attachSpeechInputs, applyAtlasPreferences, readAtlasPreferences } from './atlas-companion.mjs';
import { mountTraumaImagePassages } from './trauma-image-passages.mjs';
import { mediaMatches, placementsFor } from './atlas-selection.mjs';
import { renderRelationshipWorkshop } from './relationship-workshop.mjs';
import { renderNeuroWorkbench } from './neuro-workbench.mjs';
const host = document.querySelector('#shared-atlas');
applyAtlasPreferences(readAtlasPreferences());
if (!document.querySelector('link[data-atlas-stage-shell]')) {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./atlas-stage-shell.css', import.meta.url).href;
  stylesheet.dataset.atlasStageShell = '';
  const sceneStyle=document.createElement('link');sceneStyle.rel='stylesheet';sceneStyle.href=new URL('./relationship-scene.css',import.meta.url).href;document.head.append(sceneStyle);
  document.head.append(stylesheet);
}
for(const name of ['atlas-personal','atlas-dynamics','atlas-player','atlas-companion','atlas-rooms','atlas-terrain-space','atlas-network-space','atlas-chapter-spaces','atlas-navigation','atlas-world','atlas-network-space','atlas-relationship-heatmap','atlas-chapter-world','atlas-joints','atlas-art-direction','atlas-unfolding','atlas-lichtraum']){const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./'+name+'.css',import.meta.url).href+(name==='atlas-lichtraum'?'?v=20261103-runde4':'');document.head.append(style);}
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeURL = value => /^(https?:\/\/|\.\/|assets\/|#)/.test(value || '') ? value : '';
const link = (url, title) => safeURL(url) ? `<a href="${esc(url)}" ${url.startsWith('http')?'target="_blank" rel="noopener noreferrer"':''}>${esc(title)}</a>` : esc(title);
// Deliberately small Markdown reader. Original HTML and executable markup never run.
function markdown(value) {
  const inline = text => String(text).split(/(!?\[[^\]]+\]\((?:https?:\/\/|assets\/|\.\/|#)[^\s)]+\))/g).map(part=>{const m=part.match(/^(!?)\[([^\]]+)\]\(((?:https?:\/\/|assets\/|\.\/|#)[^\s)]+)\)$/);return m?(m[1]?`<img class="shared-fundus-image" src="${esc(safeURL(m[3]))}" alt="${esc(publicText(m[2]))}" loading="lazy">`:link(m[3],publicText(m[2]))):esc(publicText(part)).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<em>$1</em>');}).join('');
  const lines=String(value??'').split('\n');let output='',i=0;
  while(i<lines.length){
    const line=lines[i];if(!line.trim()){i++;continue;}
    const heading=line.match(/^(#{1,6}) (.*)$/);
    if(heading){const level=Math.min(4,heading[1].length+1);output+=`<h${level}>${inline(heading[2])}</h${level}>`;i++;continue;}
    if(/^\|/.test(line)&&/^\|?[ :|-]+\|[ :|-]*$/.test(lines[i+1]||'')){
      const cells=t=>t.replace(/^\||\|$/g,'').split('|').map(v=>v.trim());
      const headers=cells(line);i+=2;const rows=[];while(i<lines.length&&/^\|/.test(lines[i]))rows.push(cells(lines[i++]));
      output+=`<div class="shared-table-scroll"><table><thead><tr>${headers.map(t=>`<th scope="col">${inline(t)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(t=>`<td>${inline(t)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;continue;
    }
    if(/^[-*] /.test(line)){const items=[];while(i<lines.length&&/^[-*] /.test(lines[i]))items.push(lines[i++].replace(/^[-*] /,''));output+=`<ul>${items.map(t=>`<li>${inline(t)}</li>`).join('')}</ul>`;continue;}
    if(/^\d+\. /.test(line)){const items=[];while(i<lines.length&&/^\d+\. /.test(lines[i]))items.push(lines[i++].replace(/^\d+\. /,''));output+=`<ol>${items.map(t=>`<li>${inline(t)}</li>`).join('')}</ol>`;continue;}
    if(/^---+$/.test(line)){output+='<hr>';i++;continue;}
    const paragraph=[];while(i<lines.length&&lines[i].trim()&&!/^(#{1,6} |[-*] |\d+\. )/.test(lines[i]))paragraph.push(lines[i++]);
    output+=`<p>${paragraph.map(inline).join('<br>')}</p>`;
  }
  return output;
}
const views = [['landscape','Gesamtatlas'],['fractal','Verzweigungen'],['graph','Beziehungsnetz'],['heatmap','Heatmap'],['context','Stimmen & Wissen'],['constellation','Meine Orientierung'],['chapter','Themenkapitel'],['dynamics','Situationen erkunden'],['skills','Regulation & Skills'],['companion','Begleitung & Einstellungen'],['lab','Werkzeuge'],['personal','Eigene Einträge'],['prompts','Chatvorlagen'],['register','Leseregister'],['spatial','Atlasraum'],['course','Verläufe & Perspektiven'],['compare','Vergleichen'],['methods','Methodenwerkstatt'],['relationships','Beziehungswerkstatt'],['neurotools','Neuro-Werkstatt'],['media','Medien'],['learn','Lernwege'],['notebooks','Forschung & Berichte'],['landscapeLegacy','Bisherige Raumkarte'],['fractalLegacy','Bisherige Verzweigungen']];
const perspectives = [['all','Alle Ebenen'],['experience','Subjektives Erleben'],['observation','Beobachtbares'],['relationship','Beziehung'],['context','Kontext'],['model','Modelle & Grenzen'],['practice','Handlungsspielraum']];
let entries=[], relations=[], sources=[], media=[], notebookCards={}, notebookContext=null, contextPlace=null, contextOrigin='landscape', supplement={}, instruments={}, phraseSignals={}, originalPaths=[], collectionInfo=[], current=null, graph=null, selectedView='landscape', compareIds=[], cardIndex=0, flipped=false;
try{const savedView=sessionStorage.getItem('borderline.atlas.view.v1');if(views.some(([view])=>view===savedView))selectedView=savedView;}catch{}
let remembered={};try{remembered=JSON.parse(sessionStorage.getItem('borderline.atlas.filters.v1')||'{}')||{};}catch{}
let fractalState={};try{fractalState=JSON.parse(sessionStorage.getItem('borderline.atlas.fractal.v1')||'{}')||{};}catch{}
const state={query:typeof remembered.query==='string'?remembered.query:'',collection:remembered.collection||'all',kind:remembered.kind||'all',perspective:remembered.perspective||'all'};
const roomState={group:null,sub:null,variants:{},selected:null,...state};
let personalStore,player,companion,companionPanel,readerMarksCleanup,persistQueue=Promise.resolve();
const find = id=>entries.find(item=>item.id===id);
let routeSeed;try{routeSeed=JSON.parse(sessionStorage.getItem('borderline.atlas.reading-route.v1')||'null');}catch{}
let readingRoute=createReadingRoute(routeSeed),readerOrigin=null,readerReturnFocus=null,contextReturn=null,skillOrigin=null;
function saveReadingRoute(){try{const reader=document.querySelector('#shared-reader');sessionStorage.setItem('borderline.atlas.reading-route.v1',JSON.stringify({...readingRoute.snapshot(),open:!!reader&&!reader.hidden,origin:readerOrigin}));}catch{}}
function captureReadingPosition(){const reader=document.querySelector('#shared-reader');if(current&&reader&&!reader.hidden&&!host.hidden){readingRoute.update({id:current,offset:Math.max(0,reader.scrollTop),perspective:state.perspective});saveReadingRoute();}}
function syncControls(){for(const [id,key] of [['shared-search','query'],['shared-collection','collection'],['shared-kind','kind'],['shared-perspective','perspective']]){const el=document.getElementById(id);if(el)el.value=state[key];}}
function returnToOrigin(target){
  captureReadingPosition();target.hidden=true;
  const origin=readerOrigin,trigger=readerReturnFocus;readerOrigin=null;readerReturnFocus=null;
  if(origin){
    const changed=selectedView!==origin.view||Object.keys(state).some(key=>state[key]!==origin.state[key]);
    Object.assign(state,origin.state);syncControls();
    const selectionChanged=origin.entryId&&roomState.selected!==origin.entryId;
    if(origin.entryId)roomState.selected=origin.entryId;
    if(changed){switchView(origin.view);if(origin.entryId)graph?.focus?.(origin.entryId);}else if(selectionChanged)graph?.focus?.(origin.entryId);
  }
  const focus=trigger?.isConnected?trigger:host.querySelector('[data-mode="'+selectedView+'"]')||host.querySelector('[data-section][aria-pressed="true"]')||host.querySelector('[data-home]');
  focus?.focus({preventScroll:true});saveReadingRoute();
}
function closeReaderOnEscape(event){
  const reader=document.querySelector('#shared-reader');
  if(event.key!=='Escape'||event.defaultPrevented||host.hidden||!reader||reader.hidden||document.querySelector('dialog[open], [role="dialog"][aria-modal="true"]:not(#shared-reader):not([hidden])'))return;
  event.preventDefault();returnToOrigin(reader);
}
function followReading(direction){captureReadingPosition();const point=readingRoute[direction]();if(!point||!find(point.id))return;state.perspective=perspectives.some(([value])=>value===point.perspective)?point.perspective:'all';syncControls();renderReader(find(point.id),undefined,{track:false});const reader=document.querySelector('#shared-reader');reader.scrollTop=point.offset;reader.querySelector('h2')?.focus({preventScroll:true});saveReadingRoute();}
function resumeReadingRoute(){
  const point=readingRoute.snapshot().current,item=point&&find(point.id);
  if(routeSeed?.open===false||!item)return false;
  const saved=routeSeed?.origin,originState={...state};
  if(saved?.state&&typeof saved.state==='object')for(const key of ['query','collection','kind','perspective'])if(typeof saved.state[key]==='string')originState[key]=saved.state[key];
  if(!perspectives.some(([value])=>value===originState.perspective))originState.perspective='all';
  readerOrigin={view:views.some(([value])=>value===saved?.view)?saved.view:selectedView,state:originState,entryId:find(saved?.entryId)?.id||null};
  state.perspective=perspectives.some(([value])=>value===point.perspective)?point.perspective:'all';syncControls();
  renderReader(item,undefined,{track:false});
  const restore=()=>{const reader=document.querySelector('#shared-reader');if(current!==point.id||!reader||reader.hidden){window.removeEventListener('hashchange',restore);return;}if(host.hidden)return;window.removeEventListener('hashchange',restore);requestAnimationFrame(()=>{if(current===point.id&&!reader.hidden&&!host.hidden)reader.scrollTop=point.offset;});};
  if(host.hidden)window.addEventListener('hashchange',restore);else restore();
  return true;
}
function editorialNote(item){return (item.editorialCorrections||[]).map(c=>`<section class="shared-editorial"><p class="eyebrow">Redaktionell präzisierte Lesefassung</p><p>${esc(c.boundary)}</p><p>${(c.sourceUrls||[]).map((url,i)=>link(url,i?'NIMH · Selbstfürsorge':'WHO · Bewegung')).join(' · ')}</p><p class="caption">${esc(c.reviewLevel)}</p><details><summary>Erhaltene Originalformulierung lesen</summary><div class="shared-prose">${markdown(item.body||item.summary)}</div></details></section>`).join('');}

const normal = value=>String(value||'').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu,'');
const allText = item=>searchText(item,sources);
const collectionNames = ()=>[...new Set(entries.map(item=>item.collection))];
const typeLabel = kind=>({phenomenon:'Phänomen',concept:'Begriff',chapter:'Lesekapitel',method:'Methode',resource:'Ressource',context:'Kontext',model:'Modell',finding:'Befund',research:'Forschungsbericht',diagnosis:'Diagnostische Einordnung',instrument:'Instrument',exercise:'Übung',practice:'Alltagsbaustein',dimension:'Dimension',path:'Lernpfad',scene:'Lehrszene',perspective:'Perspektive',claim:'Aussage',source:'Quelle',domain:'Themenbereich',population:'Untersuchte Personengruppe','interactive-model':'Interaktives Modell'}[kind]||kind||'Wissenseintrag');
const filtered = ()=>entries.filter(item=>(state.collection==='all'||item.collection===state.collection)&&(state.kind==='all'||item.kind===state.kind)&&matchesSearch(allText(item),state.query));
function sourceFor(id) {return sources.find(source=>source.id===id);}
function sourceHTML(item) {
  const refs=(item.sourceIds||[]).map(sourceFor).filter(Boolean);
  return `<div class="shared-source-return"><h3>Herkunft & Aussagegrenze</h3><p>${esc(item.boundary||'Aus dem bestehenden Atlas übernommen. Eine redaktionelle Zuordnung ist keine individuelle Diagnose und kein Ursachenbeweis.')}</p><p>${esc(item.origin?.title||item.collection)} · ${esc(item.origin?.author||'Bestehender Atlasbestand · Redaktion und Quellen im Original')}</p>${safeURL(item.origin?.url)?`<p>${link(item.origin.url,'Zum Originalwerk zurück ↗')}</p>`:'<p class="caption">Für dieses Original ist kein öffentlicher App-Link belegt. Die übernommene Fassung und ihre Herkunft bleiben hier erhalten; der lokale Quellbestand wird nicht als öffentlicher Link ausgegeben.</p>'}${refs.length?`<ul>${refs.map(source=>`<li>${link(source.url||source.href,source.title||'Quelle')}<p class="caption">${esc(source.status||source.boundary||source.summary||'Quellenzuordnung im ursprünglichen Atlas. Prüfstand im Original beachten.')}</p></li>`).join('')}</ul>`:'<p class="caption">Diese Passage hat keine gesondert zugeordnete, neu geprüfte Einzelstudie. Die ursprüngliche Quellenzuordnung ist in der Herkunft dokumentiert.</p>'}${item.historicalText?`<details><summary>Historische Formulierung und redaktionelle Korrektur</summary><p>Diese ältere Formulierung wird als Dokumentation des Originals erhalten. Maßgeblich für die öffentliche Einordnung ist die oben stehende korrigierte Lesefassung.</p><p>${esc(item.historicalText.reason)}</p><div class="shared-prose">${markdown(item.historicalText.body)}</div></details>`:''}<details><summary>Technische Herkunft öffnen</summary><pre>${esc(JSON.stringify({id:item.id,origin:item.origin,sourceIds:item.sourceIds},null,2))}</pre></details></div>`;
}
function renderReader(item, target=document.querySelector('#shared-reader'),{track=true}={}) {
  if(!item||!target)return;
  const opening=target.hidden,changing=current!==item.id;
  if(track){captureReadingPosition();if(!readerOrigin||opening){readerOrigin={view:selectedView,state:{...state},entryId:roomState.selected};readerReturnFocus=document.activeElement;readingRoute=createReadingRoute();}readingRoute.visit({id:item.id,offset:!changing?readingRoute.snapshot().current?.offset||0:0,perspective:state.perspective});}
  current=item.id;roomState.selected=item.id;companion?.refreshContext();
  let body=item.editorialCorrections?.length?displaySummary(item):item.body||item.summary;
  const p=state.perspective;
  const original=item.perspectives;
  if(original&&!item.editorialCorrections?.length&&p!=='all')body=original[p]||body;
  if(!original&&p!=='all'){const words={experience:/erleb|gef[uü]hl|sp[uü]r|innen|scham|angst|wahrnehm/i,observation:/beobacht|verhalt|sichtbar|handlung|bericht|erfass|mess/i,relationship:/beziehung|bindung|partner|grenz|macht|kontakt|nahe|nähe/i,context:/kontext|umwelt|alltag|situation|schlaf|belast|reiz|schutz/i,model:/modell|theor|erkl[aä]r|diagnos|grenz|evidenz|unsicher|unterscheid/i,practice:/method|[uü]bung|unterst[uü]tz|behandl|alltag|prakt|strategie|hilf|alternative/i}[p];const parts=String(body).split(/\n\s*\n/).filter(part=>words?.test(part));body=parts.length?parts.slice(0,5).join('\n\n'):'In diesem Eintrag ist für diese Blickrichtung keine getrennte Passage ausgewiesen. Öffne „Alle Ebenen“, um den vollständigen Originaltext zu lesen.';}
  target.innerHTML=`<div class="shared-reader-top"><span class="eyebrow">${esc(item.collection)} · ${esc(typeLabel(item.kind))}</span><button data-close-reader class="quiet">Zum Ausgangspunkt zurück</button></div><nav class="shared-reading-route" aria-label="Leseweg"><button data-reading-back ${readingRoute.canBack?'':'disabled'}>← Ein Schritt zurück</button><button data-reading-forward ${readingRoute.canForward?'':'disabled'}>Weiter im Leseweg →</button><span>Ausgangspunkt: ${esc(find(readingRoute.snapshot().anchor?.id)?.title||item.title)}</span></nav><h2 tabindex="-1">${esc(item.title)}</h2><p class="shared-lead">${esc(displaySummary(item))}</p>${p!=='all'&&!original?`<p class="shared-level">Blickrichtung: ${esc(perspectives.find(x=>x[0]===p)[1])}. ${esc({experience:'Textbasierte Lesehilfe: ausgewählt sind Passagen zu Erleben und Gefühlen. Die Auswahl bestätigt keine subjektive Erfahrung.',observation:'Textbasierte Lesehilfe: ausgewählt sind Passagen zu Verhalten, Beobachtung und Messung. Beobachtung und Interpretation getrennt prüfen.',relationship:'Textbasierte Lesehilfe zu Beziehung, Grenzen und Handlungsspielraum. Vollständigen Kontext und Verantwortlichkeiten mitlesen.',context:'Textbasierte Lesehilfe zu Umwelt und Belastungsbedingungen. Sie erklärt keine individuelle Ursache.',model:'Textbasierte Lesehilfe: ausgewählt sind Passagen zu Erklärungen und Aussagegrenzen. Für den vollständigen Kontext „Alle Ebenen“ wählen.',practice:'Textbasierte Lesehilfe: ausgewählt sind Passagen zu Unterstützung, Methoden und Alternativen. Für den vollständigen Kontext „Alle Ebenen“ wählen.'}[p])}</p>`:''}<div class="shared-prose">${markdown(body)}</div>${editorialNote(item)}<div class="shared-reading-actions"><button data-add-compare="${esc(item.id)}">Zum Vergleich hinzufügen</button><button data-neighborhood="${esc(item.id)}">Verbindungen erkunden</button></div>${sourceHTML(item)}${relatedMedia(item).length?`<h3 class="shared-media-heading">Passende Medien in diesem Themenraum</h3><div class="shared-media-list">${relatedMedia(item).map(mediaCard).join('')}</div>`:''}`;
  readerMarksCleanup?.();const marks=document.createElement('div');marks.className='shared-reader-marks';target.querySelector('.shared-reading-actions').before(marks);if(personalStore)readerMarksCleanup=mountPersonalControls(marks,{store:personalStore,entry:item});
  target.hidden=false;
  target.scrollTop=readingRoute.snapshot().current?.offset||0;
  if(track&&(opening||changing))target.querySelector('h2')?.focus({preventScroll:true});
  saveReadingRoute();
  if(item.toolView&&views.some(([value])=>value===item.toolView)){
    const button=document.createElement('button');button.textContent='Neuro-Werkstatt öffnen';button.setAttribute('data-open-tool',item.toolView);
    button.onclick=()=>{switchView(item.toolView);const heading=document.querySelector('#shared-view h2');if(heading){heading.setAttribute('tabindex','-1');heading.focus();}document.querySelector('#shared-view').scrollIntoView({block:'start',behavior:'instant'});};
    target.querySelector('.shared-reading-actions').append(button);
  }
  target.querySelector('[data-close-reader]').onclick=()=>returnToOrigin(target);
  target.querySelector('[data-reading-back]').onclick=()=>followReading('back');
  target.querySelector('[data-reading-forward]').onclick=()=>followReading('forward');
  const linked=relations.filter(r=>r.from===item.id||r.to===item.id).map(r=>({r,item:find(r.from===item.id?r.to:r.from)})).filter(x=>x.item).slice(0,8);
  if(linked.length){const section=document.createElement('section');section.className='shared-reading-links';section.innerHTML=`<h3>Verbunden weiterlesen</h3>${linked.map(({r,item:n})=>`<button data-read-related="${esc(n.id)}"><span>${esc(r.label||'steht in Beziehung zu')}</span><strong>${esc(n.title)}</strong></button>`).join('')}`;target.querySelector('.shared-source-return').before(section);section.querySelectorAll('[data-read-related]').forEach(b=>b.onclick=()=>{renderReader(find(b.dataset.readRelated));target.querySelector('h2')?.focus({preventScroll:true});});}
  target.querySelector('[data-add-compare]').onclick=()=>{if(!compareIds.includes(item.id))compareIds.push(item.id);compareIds=compareIds.slice(-3);switchView('compare');};
  target.querySelector('[data-neighborhood]').onclick=()=>{switchView('graph');graph?.focus?.(item.id);};
  unfoldReader(target);
  document.querySelectorAll('[data-entry]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.entry===item.id)));
}
function entryButton(item,extra='') {return `<button class="shared-entry ${extra}" data-entry="${esc(item.id)}"><span class="eyebrow">${esc(item.collection)} · ${esc(typeLabel(item.kind))}</span><strong>${esc(item.title)}</strong><span>${esc(displaySummary(item)?.slice(0,180))}</span></button>`;}
function bindEntries(target) {target.querySelectorAll('[data-entry]').forEach(button=>button.onclick=()=>{const item=find(button.dataset.entry);renderReader(item);if(selectedView==='graph')renderGraph(item.id);document.querySelector('#shared-reader h2')?.focus({preventScroll:true});});}
function renderSpatial(){
  renderSpatialAtlas(document.querySelector('#shared-view'),{entries:filtered(),relations,onRead:id=>{renderReader(find(id));document.querySelector('#shared-reader h2')?.focus({preventScroll:true});},onCollection:name=>{state.collection=name;document.querySelector('#shared-collection').value=name;switchView('landscape');}});
}
function skillFor(value,origin=null){
  skillOrigin=origin;switchView('skills');graph?.focusSkill?.(typeof value==='string'?value:value?.query||'',origin);
}
function renderLandscapeLegacy(){
  graph=mountKnowledgeLandscape(document.querySelector('#shared-view'),{entries,relations:[...relations,...mediaEditorialRelations(media,entries)],sources,media,notebookContext,onContext:(node=null,initialItemId=null)=>openContext(node,initialItemId,'landscape'),state,onStateChange(){try{sessionStorage.setItem('borderline.atlas.filters.v1',JSON.stringify(state));}catch{}for(const [id,key] of [['shared-search','query'],['shared-collection','collection'],['shared-kind','kind'],['shared-perspective','perspective']]){const el=document.getElementById(id);if(el)el.value=state[key];}if(current&&!document.querySelector('#shared-reader').hidden)renderReader(find(current));},
    onRead:id=>{renderReader(find(id));const reader=document.querySelector('#shared-reader');reader.querySelector('h2')?.focus({preventScroll:true});},
    onSkill:skillFor,onLab:(id,tool='compare')=>{switchView('lab');graph?.open?.(tool,id);}});
  mountTraumaImagePassages(document.querySelector('#shared-view'),{media,onExplore:item=>{graph.focus('landscape-medium-'+item.id);const stage=document.querySelector('.kl-composition');stage?.scrollIntoView({block:'start',behavior:'instant'});const heading=document.querySelector('.kl-inspector h3');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}});
}
function openContext(node=null,initialItemId=null,origin=selectedView){
  if(selectedView!=='context'){
    contextOrigin=origin==='context'?'landscape':origin;
    contextReturn={view:contextOrigin,entryId:roomState.selected,group:roomState.group,sub:roomState.sub,trigger:document.activeElement,scrollTop:document.querySelector('#shared-view')?.scrollTop||0,inspectorScroll:host.querySelector('.ar-inspector,.cw-detail')?.scrollTop||0};
  }else if(contextOrigin==='context')contextOrigin='landscape';
  contextPlace={node,initialItemId};switchView('context');
}
function returnFromContext(){
  const origin=contextReturn;contextPlace=null;contextReturn=null;
  if(origin){roomState.group=origin.group;roomState.sub=origin.sub;roomState.selected=origin.entryId;}
  switchView(origin?.view|| (contextOrigin==='context'?'landscape':contextOrigin));
  if(origin?.entryId)graph?.focus?.(origin.entryId);
  const panel=document.querySelector('#shared-view'),inspector=host.querySelector('.ar-inspector,.cw-detail');
  if(origin){if(panel)panel.scrollTop=origin.scrollTop;if(inspector)inspector.scrollTop=origin.inspectorScroll;}
  const focus=origin?.trigger?.isConnected?origin.trigger:host.querySelector('.ar-inspector h3,.cw-detail h3')||host.querySelector('[data-mode="'+selectedView+'"]')||host.querySelector('[data-section][aria-pressed="true"]');
  focus?.focus({preventScroll:true});
}
function renderContext(){const panel=document.querySelector('#shared-view');panel.classList.add('lr-stage','lr-stage-media');panel.replaceChildren();const allowed=item=>!item.originWork||item.id===contextPlace?.initialItemId;const context={...notebookContext,all:notebookContext.all.filter(allowed)};graph=mountNotebookLibrary(panel,{context,media:media.filter(allowed),...(contextPlace||{}),onClose:returnFromContext});const banner=document.createElement('p');banner.className='lr-stage-banner';banner.textContent='Medienfenster. Ton und Bild starten erst, wenn du sie selbst einschaltest.';panel.prepend(banner);}
function renderFractalLegacy(){
 const engine=mountFractalAtlas(document.querySelector('#shared-view'),{nodes:entries,edges:relations,sources,media,notebookContext,state:fractalState,onSelect:node=>{renderReader(find(node.id)||node);document.querySelector('#shared-reader h2')?.focus({preventScroll:true});},onContext:(node=null,initialItemId=null)=>openContext(node,initialItemId,'fractal'),onBack:()=>switchView('landscape')});
 graph={...engine,destroy(){fractalState=engine.snapshot();try{sessionStorage.setItem('borderline.atlas.fractal.v1',JSON.stringify(fractalState));}catch{}engine.destroy();}};
}
function renderSkills(){const panel=document.querySelector('#shared-view');panel.classList.add('lr-stage','lr-stage-skill');graph=mountSkillWorkshop(panel,{origin:skillOrigin,onAtlas:(query,context)=>{if(context?.origin?.id&&find(context.origin.id)){state.query='';state.collection='all';state.kind='all';syncControls();switchView('landscape');graph?.focus?.(context.origin.id);}else{state.query=typeof query==='string'?query:query?.query||'';syncControls();switchView('landscape');}}});}
function renderPersonal(prompts=false){graph=mountPersonalWorkbench(document.querySelector('#shared-view'),{nodes:entries,sources,onSelect:id=>{state.query='';document.querySelector('#shared-search').value='';switchView('landscape');graph?.focus?.(id);}});if(prompts)graph.showPrompts();}
function renderLab(){graph=mountAtlasLab(document.querySelector('#shared-view'),{nodes:entries,edges:relations,sources,onSelect:id=>{switchView('landscape');graph?.focus?.(id);},onSkill:skillFor});}
function renderRegister() {
  const list=filtered(), target=document.querySelector('#shared-view');
  target.innerHTML=`<div class="shared-landscape">${collectionNames().filter(name=>state.collection==='all'||state.collection===name).map((name,index)=>{const items=list.filter(item=>item.collection===name);if(!items.length)return '';return `<section class="shared-island island-${index%5}"><div class="shared-island-title"><h2>${esc(name)}</h2><span>${items.length} Einträge</span></div><p>${esc(collectionInfo.find(c=>c.title===name)?.summary||'Ein eigener Zugang im gemeinsamen Wissensnetz. Originale, Unterschiede und Quellen bleiben erreichbar.')}</p><div class="shared-island-entries">${items.slice(0,4).map(item=>entryButton(item)).join('')}</div><button data-collection-open="${esc(name)}">Diesen Atlas vollständig erkunden</button></section>`;}).join('')}</div><div class="shared-library-heading"><h2>${state.query?'Suchergebnisse':'Gemeinsames Leseregister'}</h2><p id="shared-count" role="status">${list.length} passende Einträge · Lesen, Beziehungen und Quellen im selben Atlas</p></div><div class="shared-results">${list.slice(0,80).map(item=>entryButton(item)).join('')}</div>${list.length>80?'<button id="shared-more">Weitere Einträge laden</button>':''}${list.length?'':'<p>Für diese Kombination gibt es keinen Eintrag. Eine andere Auswahl kann weitere Perspektiven öffnen.</p>'}`;
  let limit=80;target.querySelector('#shared-more')?.addEventListener('click',event=>{limit+=80;const results=target.querySelector('.shared-results');results.innerHTML=list.slice(0,limit).map(item=>entryButton(item)).join('');bindEntries(results);if(limit>=list.length)event.target.remove();});
  target.querySelectorAll('[data-collection-open]').forEach(button=>button.onclick=()=>{state.collection=button.dataset.collectionOpen;document.querySelector('#shared-collection').value=state.collection;render();});bindEntries(target);
}
function renderGraphLegacy(centerId) {
  const list=filtered(), target=document.querySelector('#shared-view');
  if(!list.length){target.innerHTML='<p>Keine passenden Begriffe. Ändere Suche oder Filter.</p>';return;}
  const center=find(centerId)||list.find(item=>item.id===current)||list.find(item=>item.id==='trauma:scham')||list.find(item=>relations.some(r=>r.from===item.id||r.to===item.id))||list[0];
  const connected=relations.filter(r=>r.from===center.id||r.to===center.id);
  const neighborIds=[...new Set(connected.flatMap(r=>[r.from,r.to]).filter(id=>id!==center.id))];
  const neighborLimit=window.matchMedia('(max-width:600px)').matches?4:window.matchMedia('(max-width:950px)').matches?8:12;
  const neighborhood=neighborIds.map(find).filter(Boolean).slice(0,neighborLimit);
  const shown=[center,...neighborhood], selectedRelations=connected.filter(r=>shown.some(n=>n.id===r.from)&&shown.some(n=>n.id===r.to));
  target.innerHTML=`<div class="shared-graph-heading"><div><h2>Ein Begriff und sein Umfeld</h2><p>Wähle einen Begriff, um das Netz weiterzubewegen. Linien tragen ihre Bedeutung; Anordnung und Abstand sind keine Messwerte. Die Filter bestimmen die Startauswahl; verbundene Nachbarn bleiben atlasübergreifend sichtbar. Bis zu ${neighborLimit} Nachbarn stehen in dieser Bildschirmgröße im Bild, die vollständige Nachbarschaft darunter.</p></div><label>Bei einem anderen Begriff beginnen<select id="shared-graph-start">${list.map(item=>`<option value="${esc(item.id)}" ${center.id===item.id?'selected':''}>${esc(item.title)} · ${esc(item.collection)}</option>`).join('')}</select></label></div><div class="shared-orbit"><svg viewBox="0 0 1000 760" aria-hidden="true"></svg><div class="shared-orbit-nodes"></div></div><div class="shared-graph-relations"><h3>${selectedRelations.length} erläuterte Beziehungen</h3>${selectedRelations.length?'':'<p>Für diesen Eintrag ist noch keine ausdrückliche semantische Kante belegt. Die gemeinsame Sammlung ersetzt diesen fehlenden Nachweis nicht.</p>'}${selectedRelations.map((r,i)=>`<button data-relation="${i}"><strong>${esc(find(r.from)?.title)}</strong><span>${esc(r.label||'steht im Original in Beziehung zu')}</span><strong>${esc(find(r.to)?.title)}</strong></button>`).join('')}</div><div id="shared-relation-detail" aria-live="polite"></div><details><summary>Vollständige Nachbarschaft (${neighborIds.length}) und gefilterte Auswahl</summary><h3>Alle Nachbarn</h3><div class="shared-results">${neighborIds.map(find).filter(Boolean).map(item=>entryButton(item)).join('')}</div><h3>Gefilterte Auswahl</h3><div class="shared-results">${list.map(item=>entryButton(item)).join('')}</div></details>`;
  const svg=target.querySelector('svg'), layer=target.querySelector('.shared-orbit-nodes');
  const positions=new Map([[center.id,{x:500,y:380}]]);
  neighborhood.forEach((item,i)=>{const angle=-Math.PI/2+i*Math.PI*2/neighborhood.length;positions.set(item.id,{x:500+Math.cos(angle)*365,y:380+Math.sin(angle)*275});});
  const ns='http://www.w3.org/2000/svg';
  selectedRelations.forEach(r=>{const a=positions.get(r.from),b=positions.get(r.to),line=document.createElementNS(ns,'line');for(const [k,v] of Object.entries({x1:a.x,y1:a.y,x2:b.x,y2:b.y}))line.setAttribute(k,v);svg.append(line);});
  layer.innerHTML=shown.map(item=>{const pos=positions.get(item.id);return `<button class="shared-orbit-node ${item.id===center.id?'is-center':''}" data-entry="${esc(item.id)}" aria-pressed="${item.id===center.id}" style="left:${pos.x/10}%;top:${pos.y/7.6}%"><small>${esc(item.collection)}</small><strong>${esc(item.title)}</strong></button>`;}).join('');
  target.querySelector('#shared-graph-start').onchange=event=>{renderGraph(event.target.value);renderReader(find(event.target.value));};
  target.querySelectorAll('[data-relation]').forEach(button=>button.onclick=()=>{
    const r=selectedRelations[Number(button.dataset.relation)], refs=(r.sourceIds||[]).map(sourceFor).filter(Boolean);
    const status={beobachtung:'Beobachteter Zusammenhang',modell:'Originalmodell',vorschlag:'Vorschlag',proposed:'Vorschlag',gegenbefund:'Gegenbefund',hypothese:'Hypothese',redaktionell:'Redaktionelle Beziehung'}[r.status]||'Modell- oder redaktionelle Lesebeziehung';
    const origin=typeof r.provenance==='string'?r.provenance:r.provenance?.title||'Quellengebundene Originalbeziehung';
    target.querySelector('#shared-relation-detail').innerHTML=`<article class="shared-edge-reading"><p class="eyebrow">${esc(status)}</p><h3>${esc(r.label)}</h3><p>${esc(r.detail||r.boundary||'Diese Beziehung ist eine Aussage des ursprünglichen Atlasmodells. Sie ist kein individueller Befund und kein eigenständiger Kausalitätsnachweis.')}</p><p class="caption">${esc(origin)}</p>${r.provenance?.url?`<p>${link(r.provenance.url,'Zum Original der Beziehung')}</p>`:''}${refs.length?`<h4>Quellen für diese Beziehung</h4><ul>${refs.map(source=>`<li>${link(source.url||source.href,source.title)}<p>${esc(source.readScope||source.status||source.boundary||'Prüfstand im Original beachten.')}</p></li>`).join('')}</ul>`:'<p>Keine eigene empirische Einzelquelle an dieser Kante ausgewiesen. Die Verbindung bleibt eine ursprüngliche Modellzuordnung.</p>'}<button data-entry="${esc(r.to)}">${esc(find(r.to)?.title)} lesen</button><details><summary>Technische Herkunft öffnen</summary><pre>${esc(JSON.stringify({sourceIds:r.sourceIds,provenance:r.provenance},null,2))}</pre></details></article>`;bindEntries(target.querySelector('#shared-relation-detail'));
  });bindEntries(target);
}
function renderHeatmap(){renderRoom('heatmap');}
function renderTextMatrix(target) {
  const list=filtered(), cols=['Trauma','Bindung','Scham','Selbstwert','Schlaf','Stress','Körper','ADHS','Autismus','Dissoziation','Grenzen','Ressourcen'];
  const rows=collectionNames().filter(name=>state.collection==='all'||state.collection===name);
  // Counts are a reproducible text-index, never clinical prevalence or strength.
  const cells=rows.map(name=>cols.map(term=>list.filter(item=>item.collection===name&&normal(allText(item)).includes(normal(term)))));
  target.innerHTML=`<h2>Wo wird ein Thema behandelt?</h2><p>Die Themenmatrix zählt Einträge, in deren Titel, Beschreibung, Volltext oder Originaltags der jeweilige Suchbegriff vorkommt. Sie zeigt die Abdeckung dieses Bestands. Die Farben bedeuten keine Häufigkeit bei Menschen, kein Risiko und keine Stärke eines Zusammenhangs.</p><label>Darstellung<select id="matrix-display"><option value="coverage">Abdeckung: keine / einzelne / mehrere</option><option value="count">Anzahl passender Atlas-Einträge</option></select></label><div class="shared-table-scroll"><table class="shared-matrix"><caption>Textbasierter Bestandsindex · Worttreffer, keine semantische oder klinische Bewertung</caption><thead><tr><th>Atlasbereich</th>${cols.map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map((name,ri)=>`<tr><th scope="row">${esc(name)}</th>${cols.map((term,ci)=>{const n=cells[ri][ci].length;return `<td><button data-cell="${ri},${ci}" class="coverage-${n===0?0:n<4?1:2}" aria-label="${esc(name)}: ${esc(term)}, ${n} Einträge"><span data-n="${n}">${n===0?'—':n<4?'einzelne':'mehrere'}</span></button></td>`;}).join('')}</tr>`).join('')}</tbody></table></div><div id="matrix-evidence"><p>Öffne ein Feld, um alle zugrunde liegenden Einträge nachzulesen.</p></div>`;
  target.querySelector('#matrix-display').onchange=e=>target.querySelectorAll('[data-n]').forEach(el=>{const n=Number(el.dataset.n);el.textContent=e.target.value==='count'?n:n===0?'—':n<4?'einzelne':'mehrere';});
  target.querySelectorAll('[data-cell]').forEach(button=>button.onclick=()=>{const[ri,ci]=button.dataset.cell.split(',').map(Number);const out=target.querySelector('#matrix-evidence');out.innerHTML=`<h3>${esc(rows[ri])} · ${esc(cols[ci])}</h3><p>${cells[ri][ci].length} nachlesbare Treffer. Ein Worttreffer kann auch eine Abgrenzung oder einen Gegenbefund enthalten.</p><div class="shared-results">${cells[ri][ci].map(item=>entryButton(item)).join('')}</div>`;bindEntries(out);});
}
function renderCompare(){renderCompareContent();unfoldWorkshop(document.querySelector('#shared-view'),'compare');}
function renderCompareContent() {
  const target=document.querySelector('#shared-view'),list=filtered();
  if(!compareIds.length)compareIds=[list.find(item=>item.id==='context:ptsd'),list.find(item=>item.id==='context:complex-ptsd')].filter(Boolean).map(item=>item.id);if(!compareIds.length)compareIds=list.slice(0,2).map(item=>item.id);
  target.innerHTML=`<h2>Ähnliches ansehen, Unterschiede erhalten</h2><p>Stelle bis zu drei Einträge nebeneinander. Vergleichbar sind Beschreibungen und Fragen; gleiche Wörter beweisen keine gemeinsame Ursache. Eine Diagnose erfordert eine fachliche, persönliche Abklärung.</p><div class="shared-compare-pickers">${[0,1,2].map(i=>`<label>Vergleich ${i+1}<select data-compare-slot="${i}"><option value="">Nicht ausgewählt</option>${[...new Map([...list,...compareIds.map(find).filter(Boolean)].map(item=>[item.id,item])).values()].map(item=>`<option value="${esc(item.id)}" ${compareIds[i]===item.id?'selected':''}>${esc(item.title)} · ${esc(item.collection)}</option>`).join('')}</select></label>`).join('')}</div><div class="shared-compare">${compareIds.map(find).filter(Boolean).map(item=>`<article><span class="eyebrow">${esc(item.collection)} · ${esc(typeLabel(item.kind))}</span><h3>${esc(item.title)}</h3><p>${esc(displaySummary(item))}</p>${item.editorialCorrections?.length?editorialNote(item):`<h4>Beschreibung und Einordnung</h4><div class="shared-prose">${markdown(item.body)}</div>`}<h4>Was diese Beschreibung nicht entscheidet</h4><p>${esc(item.boundary||'Einzelne Ähnlichkeiten entscheiden weder über Diagnose noch Ursache oder passende Unterstützung.')}</p>${sourceHTML(item)}</article>`).join('')}</div><p class="shared-level">Vergleichsfragen: Seit wann? Unter welchen Bedingungen? Wie verändert sich das Erleben mit Schlaf, Sicherheit, Anforderungen oder Beziehungskontext? Welche Gegenbeispiele gibt es? Was sagt die Person selbst? Eine dieser Fragen kann bereits hilfreicher sein als eine vorschnelle Zuordnung.</p>`;
  target.querySelectorAll('[data-compare-slot]').forEach(select=>select.onchange=()=>{compareIds=Array.from(target.querySelectorAll('[data-compare-slot]')).map(s=>s.value);const slot=select.dataset.compareSlot;renderCompare();target.querySelector(`[data-compare-slot="${slot}"]`).focus();});
}
function renderCourse() {
  const target=document.querySelector('#shared-view'), dynamics=instruments.dynamics, chameleon=instruments.chameleonDynamics;
  target.innerHTML=`<h2>Ein Verlauf ist keine feste Schablone.</h2><p>Hier arbeiten zwei übernommene Instrumente im gemeinsamen Atlas: die siebenstufige Dynamikansicht und das vorgeschlagene Chamäleon-Modell. Die Szenen sind erfunden. Schritte, Blickrichtungen und Handlungsvarianten verändern den gelesenen Inhalt; es werden keine Reaktionen berechnet oder persönlichen Diagnosen abgeleitet.</p><div class="shared-course-options"><label>Instrument<select id="course-instrument"><option value="dynamics">Dynamikraum · Situation und Rückwirkung</option><option value="chameleon">Chamäleon · Begegnung und Ausdruck</option></select></label><label id="course-scene-label">Szene<select id="course-scene">${(dynamics?.scenarios||[]).map((s,i)=>`<option value="${i}">${esc(s.title)}</option>`).join('')}</select></label><label>Lesart<select id="course-lens"></select></label></div><div id="course-context"></div><div class="shared-course-stages" role="group" aria-label="Schritte im Verlauf"></div><article id="course-reading" class="shared-course-reading" aria-live="polite"></article><div id="course-branches"></div><details><summary>Originalinstrumente und Aussagegrenzen</summary><p>Der Dynamikraum vergleicht alternative Beschreibungen und mögliche Unterbrechungen. Das Chamäleon-Modell ist ein historischer KI-Modellvorschlag, keine validierte Erklärung für Maskierung, Trauma oder eine Person.</p><p>${link('https://phaenomenautik-koharenz.x99t4dyxr9.chatgpt.site/','Zum ursprünglichen Phänomenatlas')} · <a href="#trigger">Zu den vorhandenen Trigger-Lehrszenen</a></p><p>${esc(chameleon?.sourceRelation||'Originale und Bearbeitung bleiben getrennt dokumentiert.')}</p><details><summary>Technische Instrumentherkunft</summary><pre>${esc(JSON.stringify(chameleon?.provenance||{},null,2))}</pre></details></details>`;
  let step=0;
  const select=target.querySelector('#course-instrument'),scene=target.querySelector('#course-scene'),lens=target.querySelector('#course-lens');
  const draw=()=>{
    const isChameleon=select.value==='chameleon';
    const selectedScene=dynamics?.scenarios[Number(scene.value)||0];
    const steps=isChameleon?(chameleon?.steps||[]).map(s=>s.label):(dynamics?.stages||[]);
    target.querySelector('#course-scene-label').hidden=isChameleon;
    if(step>=steps.length)step=0;
    target.querySelector('#course-context').innerHTML=`<p class="shared-level">${esc(isChameleon?chameleon?.intro:selectedScene?.context)}</p>`;
    const stages=target.querySelector('.shared-course-stages');stages.innerHTML=steps.map((title,i)=>`<button data-stage="${i}" aria-pressed="${step===i}"><small>${i+1}</small><br>${esc(title)}</button>`).join('');
    stages.querySelectorAll('[data-stage]').forEach(button=>button.onclick=()=>{step=Number(button.dataset.stage);draw();stages.querySelector(`[data-stage="${step}"]`).focus();});
    const output=target.querySelector('#course-reading'),branches=target.querySelector('#course-branches');
    if(isChameleon){
      const stage=chameleon.steps[step],perspective=chameleon.lenses.find(l=>l.id===lens.value)||chameleon.lenses[0];
      output.innerHTML=`<p class="eyebrow">Vorgeschlagene Erkundung · ${esc(perspective.label)}</p><h3>${esc(stage.label)}</h3><p>${esc(stage.text)}</p><h4>Diese Blickrichtung fragt</h4><p>${esc(perspective.stepQuestions?.[stage.id]||perspective.question)}</p><p>${esc(perspective.text)}</p><p class="caption">${esc(perspective.limit)}</p>`;
      branches.innerHTML=(chameleon.branches||[]).filter(b=>b.from===stage.id).map(b=>`<details class="shared-level"><summary>${esc(b.label)} · Gedankenvariante</summary><p>${esc(b.question)}</p><p>Diese Frage ändert die Betrachtung. Eine bestimmte Wirkung oder ein besserer Ausgang wird nicht vorausgesetzt.</p></details>`).join('');
    }else{
      const texts=selectedScene?.[lens.value]||selectedScene?.base||[];
      output.innerHTML=`<p class="eyebrow">Erfundene Lehrszene · ${esc(lens.options[lens.selectedIndex]?.textContent)}</p><h3>${esc(steps[step])}</h3><p>${esc(texts[step]||'Für diesen Schritt ist keine getrennte Beschreibung überliefert.')}</p><p class="caption">Reihenfolge zum Lesen. Keine allgemeine Kausalkette, kein festgelegter Verlauf für Menschen.</p>`;
      branches.innerHTML=`<div class="actions"><button id="course-previous" ${step===0?'disabled':''}>Vorheriger Schritt</button><button id="course-next" ${step===steps.length-1?'disabled':''}>Nächster Schritt</button></div>`;
      const move=(change,id)=>{step+=change;draw();const button=branches.querySelector(id);(button&&!button.disabled?button:stages.querySelector(`[data-stage="${step}"]`)).focus();};
      branches.querySelector('#course-previous').onclick=()=>move(-1,'#course-previous');branches.querySelector('#course-next').onclick=()=>move(1,'#course-next');
    }
  };
  const setLenses=()=>{lens.innerHTML=select.value==='chameleon'?(chameleon?.lenses||[]).map(l=>`<option value="${esc(l.id)}">${esc(l.label)}</option>`).join(''):'<option value="base">Eine mögliche Schleife</option><option value="other">Andere Erklärung und anderer Verlauf</option><option value="exit">Unterbrechung und Schutz</option>';step=0;draw();};
  select.onchange=setLenses;scene.onchange=()=>{step=0;draw();};lens.onchange=draw;setLenses();
}

function renderMethods() {
  const target=document.querySelector('#shared-view'),list=filtered().filter(item=>['method','resource','instrument','exercise','practice'].includes(item.kind));
  target.innerHTML=`<div class="shared-graph-heading"><div><h2>Methodenwerkstatt</h2><p>Vorhandene Verfahren und Ressourcen im gemeinsamen Leseraum. Alltagshilfe, Reflexionswerkzeug und fachliche Behandlung behalten ihre unterschiedlichen Zwecke und Grenzen.</p></div><a href="#therapien">Zur bestehenden Behandlungsübersicht ↗</a></div><div class="shared-method-practice"><h3>Beobachtung und Bedeutung auseinanderlegen</h3><p>Weiterentwicklung der vorhandenen Beziehungswerkstatt · fiktives Beispiel, keine Auswertung persönlicher Daten.</p><label>Eine Lesart wählen<select id="method-scene"><option value="silence">Eine Antwort bleibt aus</option><option value="noise">Ein Gespräch wird zu laut</option><option value="boundary">Eine Grenze wird übergangen</option></select></label><div id="method-scene-result"></div><a href="#trigger">Den interaktiven Verlauf mit einer Situation erkunden ↗</a></div><details class="shared-phrase"><summary>Vorhandenes Instrument: Begriffe in einer Beschreibung wiederfinden</summary><p>${esc(phraseSignals.boundary)}</p><label for="shared-phrase-input">Eine erfundene oder eigene kurze Beschreibung</label><textarea id="shared-phrase-input" class="shared-phrase-input" placeholder="Zum Beispiel: Ich verliere beim Planen das Zeitgefühl."></textarea><p class="caption">Die Eingabe bleibt in dieser geöffneten Ansicht. Sie wird weder gespeichert noch an einen Dienst gesendet.</p><button id="shared-phrase-run">Vorhandene Signale im Text nachschlagen</button><div id="shared-phrase-results" aria-live="polite"></div></details><div class="shared-course-options"><label>Ressource passend zu einem Zustand<select id="resource-state"><option value="all">Alle Zustände</option>${Object.entries(instruments.resourceStates||{}).map(([id,title])=>`<option value="${esc(id)}">${esc(title)}</option>`).join('')}</select></label><label>Situation<select id="resource-situation"><option value="all">Alle Situationen</option>${Object.entries(instruments.resourceSituations||{}).map(([id,title])=>`<option value="${esc(id)}">${esc(title)}</option>`).join('')}</select></label></div><p id="resource-count">${list.length} Methoden, Ressourcen und Instrumente in dieser Auswahl. Originale Evidenzbewertungen werden nicht pauschal bestätigt.</p><div class="shared-results">${list.map(item=>entryButton(item)).join('')}</div>`;
  const scenes={silence:['Die vereinbarte Antwortzeit ist vorbei.','„Ich bin unwichtig“ ist eine mögliche Bedeutung, keine beobachtete Absicht.','Arbeitslast, eine vergessene Nachricht, benötigter Abstand oder ein wiederholter Bruch von Absprachen bleiben verschiedene Möglichkeiten.','Eine konkrete Nachfrage oder ein eigener Kontaktwunsch kann formuliert werden. Eine Antwort darf nicht erzwungen werden.'],noise:['Mehrere Stimmen überlagern sich; eine Person verlässt den Raum.','Überforderung, Angst oder Wut wären unterschiedliche berichtbare Erfahrungen. Schweigen teilt sie nicht eindeutig mit.','Lautstärke, Erschöpfung, Sinnesverarbeitung und Beziehungskontext getrennt erfragen.','Reize reduzieren und eine freiwillige Pause anbieten. Später klären, ob eine Abmachung gebraucht wird.'],boundary:['Eine Person hat Nein gesagt; die andere setzt die Handlung fort.','Die Grenzüberschreitung lässt sich benennen, auch wenn die Absicht ungeklärt ist.','Ein vermuteter Trigger oder eine Diagnose hebt die Grenze nicht auf.','Die Handlung unterbrechen, Abstand und konkrete Sicherheit ermöglichen. Wiedergutmachung begründet keinen Anspruch auf weiteren Kontakt.']};
  const update=()=>{target.querySelector('#method-scene-result').innerHTML=scenes[target.querySelector('#method-scene').value].map((t,i)=>`<div><h4>${['Beobachtung','Erleben & Deutung','Offene Alternativen','Möglicher nächster Schritt'][i]}</h4><p>${esc(t)}</p></div>`).join('');};target.querySelector('#method-scene').onchange=update;update();const updateResources=()=>{const state=target.querySelector('#resource-state').value,situation=target.querySelector('#resource-situation').value;const matches=list.filter(item=>(state==='all'||item.states?.includes(state))&&(situation==='all'||item.situations?.includes(situation)));target.querySelector('.shared-results').innerHTML=matches.map(item=>entryButton(item)).join('')||'<p>Für diese Kombination ist keine Ressource ausdrücklich zugeordnet. Weitere Optionen bleiben über eine offenere Auswahl erreichbar.</p>';target.querySelector('#resource-count').textContent=`${matches.length} passende Originaleinträge · Zuordnungen sind freiwillige Angebote, keine berechneten Behandlungsempfehlungen.`;bindEntries(target);};target.querySelector('#resource-state').onchange=updateResources;target.querySelector('#resource-situation').onchange=updateResources;bindEntries(target);
  target.querySelector('#shared-phrase-run').onclick=()=>{
    const tokens=value=>(String(value).toLowerCase().match(/[A-Za-zÄÖÜäöüß0-9]+/g)||[]),input=tokens(target.querySelector('#shared-phrase-input').value);
    const matches=(phraseSignals.cards||[]).map(card=>({...card,matches:card.signals.filter(signal=>{const words=tokens(signal);return words.length&&input.some((_,i)=>words.every((w,j)=>input[i+j]===w));})})).filter(card=>card.matches.length);
    const out=target.querySelector('#shared-phrase-results');out.innerHTML=`<p>${matches.length} Karten mit einem wörtlichen Signal. Auch unspezifische Wörter können einen Treffer auslösen. Es gibt keine Punktzahl und keine automatische Phänomenzuordnung.</p>${matches.map(card=>`<p>Wörtlich gefunden: ${card.matches.map(esc).join(', ')}</p>${find(card.entryId)?entryButton(find(card.entryId)):''}`).join('')}${matches.length?'':'<p>Ein Nichttreffer bedeutet lediglich, dass keines der hinterlegten Signale wörtlich vorkommt.</p>'}`;bindEntries(out);
  };
}
function mediaCard(item) {
  const format=String(item.format||'').toLowerCase(),file=safeURL(item.file),review=typeof item.review==='string'?publicText(item.review):'';
  if(item.originWork==='Walter Andreas Kirchner'&&file)return `<article class="shared-media-item shared-artwork"><a class="shared-media-image" href="${esc(file)}"><img src="${esc(file)}" alt="${esc(item.title)}" loading="lazy"></a><h3>${esc(item.title)}</h3><p class="caption shared-media-provenance" data-credit="${esc((item.provenance||item.producer).replace(/\s*Reproduktion von der Künstlerwebsite\.?/g,''))}">${esc(artworkCredit(item))}</p>${item.sourceURL?`<p class="shared-media-original-source">${link(item.sourceURL,'Quelle ↗')}</p>`:''}</article>`;
  return `<article class="shared-media-item"><p class="eyebrow">${esc(item.producer||'NotebookLM')} · ${esc(item.format)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${file&&format==='audio'?`<audio controls preload="metadata" src="${esc(file)}"></audio>`:file&&format==='youtube'?`<iframe class="shared-video-embed" src="${esc(file)}" title="${esc(item.title)}" loading="lazy" allow="fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`:file&&format==='video'?`<video controls preload="metadata" src="${esc(file)}" ${item.poster?`poster="${esc(item.poster)}"`:''}>${item.track?`<track kind="captions" src="${esc(safeURL(item.track))}" srclang="${esc(item.language||'de')}" label="${esc(item.trackLabel||'Untertitel')}" default>`:''}</video>`:file&&['infografik','mindmap','bild'].includes(format)?`<a class="shared-media-image" href="${esc(file)}"><img src="${esc(file)}" alt="${esc(item.alt||item.title)}" loading="lazy"></a>`:item.html?`<div class="shared-prose">${markdown(item.html)}</div>`:''}${file&&!['audio','video','youtube','infografik','mindmap','bild'].includes(format)?`<p>${link(file,'Öffnen oder herunterladen')}</p>`:''}<p class="caption">${esc(review||'Quellen und Hinweise zum Inhalt findest du am Beitrag.')} ${esc(typeof item.access==='string'?item.access:item.access?.player||'Direkt in dieser App verfügbar.')}</p>${item.corrections?.length?`<section class="shared-media-review"><h4>Fachliche Einordnung zum Medium</h4><p>Diese Präzisierungen gehören zur Nutzung des Mediums.</p>${item.corrections.map(c=>`<p><strong>${['audio','video'].includes(format)&&Number.isFinite(c.start)&&c.start>=0?`${Math.floor(c.start/60)}:${String(Math.floor(c.start%60)).padStart(2,'0')} · `:''}${esc(c.topic)}</strong><br>${esc(c.publicCorrection)} ${(c.sourceIds||[]).map(id=>{const source=sourceFor('verified:'+id);return source?link(source.url,source.title):'';}).join(' · ')}</p>`).join('')}</section>`:''}${item.provenance&&!item.notebookURL?`<p class="caption shared-media-provenance">${esc(item.provenance)}</p>`:''}${placementsFor(item).length?`<p class="caption">Atlaszugänge: ${placementsFor(item).map(esc).join(' · ')}</p>`:''}${item.tags?.length?`<p class="shared-media-tags">${item.tags.map(esc).join(' · ')}</p>`:''}${item.publicTextAlternative?`<p>${link(item.publicTextAlternative.url,item.publicTextAlternative.label)}</p>`:''}${item.sourceURL?`<p class="shared-media-original-source">${link(item.sourceURL,'Öffentliche Originalquelle und weitere Materialien ↗')}</p>`:''}${item.transcript?`<details><summary>Sprechtext lesen · automatische Transkription</summary><div class="shared-prose">${markdown(item.transcript)}</div><p class="caption">Automatisch lokal transkribiert; Erkennungsfehler sind möglich. Fachliche Korrekturen stehen in der Einordnung und in der lesbaren Alternative.</p></details>`:''}${item.alternative?`<details><summary>Lesbare Alternative & Grundlagen</summary><div class="shared-prose">${markdown(item.alternative)}</div></details>`:''}${item.notebookURL?`<details><summary>Notebook und Herstellung</summary><p>${link(item.notebookURL,'Zum ursprünglichen Notebook (Google-Anmeldung kann erforderlich sein)')}</p><p>${esc(item.provenance||'NotebookLM-Ausgabe, auf Basis der im Notebook importierten Quellen. Keine Originalarbeit Ralfs.')}</p></details>`:''}</article>`;
}
function renderExternalResources(){return `<h3>Öffentliche Fachseiten & Methodenmaterialien</h3><div class="shared-external-list">${(supplement.germanExternals||[]).filter(item=>mediaMatches(item,state)).map(item=>`<article><p class="eyebrow">${esc(item.contentClass)} · ${esc(item.language)}</p><h4>${link(item.url,item.title)}</h4><p>${esc(item.producer)}</p><p>${esc(item.summary)}</p><p class="caption">Ort im Atlas: ${esc(item.atlasPlace)}. ${esc(item.review)}</p>${item.limits?.length?`<p class="caption">${item.limits.map(esc).join(' ')}</p>`:''}</article>`).join('')}</div>`;}
function relatedMedia(item) {return explicitlyRelatedMedia(media,item?.id);}

function renderMedia() {
  const target=document.querySelector('#shared-view');
  const list=media.filter(item=>!item.originWork&&mediaMatches(item,state));
  target.innerHTML=`<h2>Hören, sehen und erkunden</h2><p>NotebookLM-Ausgaben, öffentliche Fachvermittlung und redaktionelle Lernansichten haben verschiedene Herkunft. Fertig vorliegende Medien lassen sich hier direkt nutzen; der jeweilige Prüfstand steht am Medium.</p><p role="status">${list.length} Medien${state.query?' zur aktuellen Suche':''}</p><div class="shared-media-list">${list.length?list.map(mediaCard).join(''):'<p class="shared-level">Zu dieser Suche liegt noch kein passendes fertiges Medium vor. Wähle alle Atlasbereiche und leere die Suche für alle vorhandenen Medien.</p>'}</div><p class="caption">Themenzuordnung: redaktionell nach dem Inhalt des Mediums. Sie bezeichnet keine Häufigkeit und keine besondere Wirksamkeit für eine Diagnose.</p>${renderExternalResources()}<h3>Redaktionelle Lernansichten</h3><div class="shared-media-alternatives"><button data-open-view="graph">Begriffsnetz direkt erkunden</button><button data-open-view="learn">Lernkarten direkt nutzen</button><a href="#trigger">Zwei interaktive Lehrszenen öffnen</a><a href="lesefassung.html">Bestehende ausführliche Lesefassung öffnen</a></div>`;
  target.querySelectorAll('[data-open-view]').forEach(button=>button.onclick=()=>switchView(button.dataset.openView));
}

const learningPaths=[{title:'Erleben ist noch keine Erklärung',query:'Wahrnehmung',steps:['phenomenon','context','concept']},{title:'Trauma, Beziehung und Schutz',query:'Trauma',steps:['chapter','method','phenomenon']},{title:'Neurodivergenz im Alltag',query:'ADHS',steps:['chapter','phenomenon','resource']},{title:'Scham, Selbstwert und Reparatur',query:'Scham',steps:['concept','chapter','method']}];
let learningMode='atlas', notebookCardIndex=0, notebookFlipped=false;
function renderLearn(){renderLearnContent();unfoldWorkshop(document.querySelector('#shared-view'),'learn');}
function renderLearnContent(){
 const target=document.querySelector('#shared-view');
 target.innerHTML=`<div class="shared-matrix-modes" role="group" aria-label="Herkunft der Lernkarten"><button data-learning-mode="atlas">Atlas-Lernwege und Originalpassagen</button><button data-learning-mode="notebook">NotebookLM · ${notebookCards.cards?.length||0} geprüfte Karten</button></div><div id="shared-learning-body"></div>`;
 target.querySelectorAll('[data-learning-mode]').forEach(button=>{button.setAttribute('aria-pressed',String(learningMode===button.dataset.learningMode));button.onclick=()=>{learningMode=button.dataset.learningMode;renderLearn();updateScope();target.querySelector(`[data-learning-mode="${learningMode}"]`).focus();};});
 const body=target.querySelector('#shared-learning-body');if(learningMode==='notebook')renderNotebookCards(body);else renderAtlasLearn(body);
}
function renderNotebookCards(target){
 const cards=notebookCards.cards||[],card=cards[notebookCardIndex];
 if(!card){target.innerHTML='<p>Es liegt noch keine geprüfte Notebook-Kartenauswahl vor.</p>';return;}
 target.innerHTML=`<h2>Trauma, Entwicklung und Behandlung</h2><p>NotebookLM hat 50 Karten erzeugt. Alle wurden gelesen; 27 ausgewählte Karten wurden präzisiert und für diesen Lernzugang übernommen. Die ursprüngliche KI-Ausgabe und die redaktionellen Korrekturen bleiben unterscheidbar. Kein Diagnosetest.</p><label>Eine Frage wählen<select id="notebook-card-select">${cards.map((c,i)=>`<option value="${i}" ${i===notebookCardIndex?'selected':''}>${esc(c.question)}</option>`).join('')}</select></label><article class="shared-flashcard"><p class="eyebrow">${notebookCardIndex+1} von ${cards.length} · NotebookLM mit redaktioneller Prüfung</p><h3>${esc(card.question)}</h3><button id="notebook-card-flip" aria-expanded="${notebookFlipped}">${notebookFlipped?'Antwort verbergen':'Antwort ansehen'}</button><div ${notebookFlipped?'':'hidden'}><p>${esc(card.answer)}</p><p class="caption">${esc(card.origin?.change||'Redaktionell geprüft; Wortlaut beibehalten.')}</p>${sourceHTML({id:card.id,collection:'NotebookLM-Lernkarten',origin:{title:'NotebookLM · kuratierte Auswahl mit Codex-Korrekturen',url:'https://notebook.google.com/notebook/ab9a1e14-d571-4653-b492-102c4519bef5'},boundary:(notebookCards.limits||[]).join(' '),sourceIds:card.sourceIds.map(id=>'verified:'+id)})}</div><div class="actions"><button id="notebook-card-prev" ${notebookCardIndex===0?'disabled':''}>Vorherige Karte</button><button id="notebook-card-next" ${notebookCardIndex===cards.length-1?'disabled':''}>Nächste Karte</button></div></article>`;
 target.querySelector('#notebook-card-select').onchange=e=>{notebookCardIndex=Number(e.target.value);notebookFlipped=false;renderNotebookCards(target);target.querySelector('#notebook-card-select').focus();};
 target.querySelector('#notebook-card-flip').onclick=()=>{notebookFlipped=!notebookFlipped;renderNotebookCards(target);target.querySelector('#notebook-card-flip').focus();};
 const move=(change,id)=>{notebookCardIndex+=change;notebookFlipped=false;renderNotebookCards(target);const button=target.querySelector(id);(button&&!button.disabled?button:target.querySelector('#notebook-card-flip')).focus();};
 target.querySelector('#notebook-card-prev').onclick=()=>move(-1,'#notebook-card-prev');target.querySelector('#notebook-card-next').onclick=()=>move(1,'#notebook-card-next');
}
function renderAtlasLearn(target) {
  const cards=filtered().filter(item=>item.summary&&item.body&&item.body!==item.summary);
  if(cardIndex>=cards.length)cardIndex=0;
  const card=cards[cardIndex];
  target.innerHTML=`<h2>Eigene Wege durch den Atlas</h2><p>Diese Lernwege und Karten wurden für die gemeinsame App redaktionell entwickelt. Sie verwenden vorhandene Atlaspassagen; sie sind keine automatisch geprüften NotebookLM-Ausgaben.</p><div class="shared-learning-paths">${learningPaths.map((path,i)=>`<button data-path="${i}"><span class="eyebrow">Leseweg</span><strong>${esc(path.title)}</strong><span>Begriffe → Kontext → Quellen → Handlungsspielraum</span></button>`).join('')}</div><details><summary>Neun vorhandene Lernpfade aus dem Phänomenatlas</summary><div class="shared-learning-paths">${originalPaths.map((path,i)=>`<button data-original-path="${i}"><strong>${esc(path.title)}</strong><span>${esc(path.question)}</span></button>`).join('')}</div></details><div id="shared-path-reading"></div><h3>Lernkarten aus der aktuellen Auswahl</h3>${card?`<article class="shared-flashcard"><p class="eyebrow">${cardIndex+1} von ${cards.length} · ${esc(card.collection)}</p><h3>${esc(card.title)}</h3><p>Wie beschreibt der Originalbestand dieses Phänomen oder diesen Begriff? Welche Grenze ist zu beachten?</p><button id="shared-flip" aria-expanded="${flipped}">${flipped?'Antwort verbergen':'Antwort ansehen'}</button><div ${flipped?'':'hidden'}><p>${esc(displaySummary(card))}</p>${card.editorialCorrections?.length?editorialNote(card):`<div class="shared-prose">${markdown(card.body?.slice(0,1800))}</div>`}<p>${esc(card.boundary||'Die Beschreibung ist keine persönliche Diagnose.')}</p><button data-entry="${esc(card.id)}">Vollständig lesen & Quellen prüfen</button></div><div class="actions"><button id="shared-card-prev" ${cardIndex===0?'disabled':''}>Vorherige Karte</button><button id="shared-card-next" ${cardIndex===cards.length-1?'disabled':''}>Nächste Karte</button></div></article>`:'<p>In dieser Auswahl liegen keine Karten vor.</p>'}`;
  target.querySelectorAll('[data-path]').forEach(button=>button.onclick=()=>{const path=learningPaths[Number(button.dataset.path)];const matches=entries.filter(item=>normal(allText(item)).includes(normal(path.query)));const out=target.querySelector('#shared-path-reading');out.innerHTML=`<h3>${esc(path.title)}</h3><ol>${path.steps.flatMap(kind=>matches.filter(item=>item.kind===kind).slice(0,2)).map(item=>`<li>${entryButton(item)}</li>`).join('')}</ol><p>Halte beim Lesen auseinander: Was berichtet jemand? Was lässt sich beobachten? Was erklärt ein Modell? Was bleibt offen?</p>`;bindEntries(out);});
  target.querySelectorAll('[data-original-path]').forEach(button=>button.onclick=()=>{const path=originalPaths[Number(button.dataset.originalPath)],out=target.querySelector('#shared-path-reading');out.innerHTML=`<h3>${esc(path.title)}</h3><p>${esc(path.question)}</p><p>Übernommener Leseweg aus dem Phänomenatlas. Die Reihenfolge zeigt eine redaktionelle Erkundung, keinen Beweisgang.</p><ol>${path.nodeIds.map(find).filter(Boolean).map(item=>`<li>${entryButton(item)}</li>`).join('')}</ol>`;bindEntries(out);});if(card){target.querySelector('#shared-flip').onclick=()=>{flipped=!flipped;renderLearn();document.querySelector('#shared-flip').focus();};target.querySelector('#shared-card-prev').onclick=()=>{cardIndex--;flipped=false;renderLearn();const button=document.querySelector('#shared-card-prev');(button&&!button.disabled?button:document.querySelector('#shared-flip')).focus();};target.querySelector('#shared-card-next').onclick=()=>{cardIndex++;flipped=false;renderLearn();const button=document.querySelector('#shared-card-next');(button&&!button.disabled?button:document.querySelector('#shared-flip')).focus();};}bindEntries(target);
}
let relationshipPanel;
function renderRelationships() {
  if(!relationshipPanel){
    relationshipPanel=document.createElement('div');
    renderRelationshipWorkshop(relationshipPanel,{onRead:(title,meta)=>{
      const item=find('relationship:'+meta.concept)||entries.find(entry=>entry.title===title);
      if(item){renderReader(item);document.querySelector('#shared-reader h2')?.focus();}
    },onNavigate:hash=>{if(hash==='#trigger')location.hash=hash;}});
  }
  document.querySelector('#shared-view').replaceChildren(relationshipPanel);
}
let neuroPanel;
function renderNeuroTools() {
  if (!neuroPanel) {
    neuroPanel=document.createElement('div');
    renderNeuroWorkbench(neuroPanel,{entries,relations,sources,
      onRead:value=>{const item=typeof value==='string'?find(value):find(value?.id);if(item){renderReader(item);document.querySelector('#shared-reader h2')?.focus();}},
      getTraceEntries:()=>{let traces=[];window.dispatchEvent(new CustomEvent('atlas-traces-request',{detail:{receive:value=>{traces=value;}}}));return traces;},
      onTrace:payload=>{let result={ok:false,message:'Die Spurenwerkstatt ist noch nicht bereit. Bitte lade die Seite erneut.'};window.dispatchEvent(new CustomEvent('atlas-trace-draft',{detail:{payload,receive:value=>{result=value;}}}));return result;}
    });
  }
  document.querySelector('#shared-view').replaceChildren(neuroPanel);
}
function readRoomEntry(id){const item=typeof id==='string'?find(id):id;if(!item)return;renderReader(item);document.querySelector('#shared-reader h2')?.focus({preventScroll:true});}
function renderRoom(view=selectedView){Object.assign(roomState,state);roomState.view=view;const panel=document.querySelector('#shared-view');if(view==='constellation')panel.classList.add('lr-stage','lr-stage-karte');graph=mountAtlasRoom(panel,{view,entries,relations,sources,media,store:personalStore,state:roomState,onRead:readRoomEntry,onView:switchView,onMedia:(item,origin)=>{if(/audio|video/i.test(item.format||item.kind||'')||/\.(mp4|m4a|mp3|webm)(?:$|\?)/i.test(item.file||'')){player.openMedia(item,origin);}else openContext(null,item.id,selectedView);},onContext:openContext,onSelect:item=>{current=item.id;companion?.refreshContext();}});}
function renderLandscape(){renderRoom('landscape');}
function renderFractal(){renderRoom('fractal');}
function renderGraph(id){if(id)roomState.selected=id;renderRoom('graph');}
function renderCompanion(){if(!companion)return;document.querySelector('#shared-view').replaceChildren(companionPanel);companion.refreshContext();}
function render() {
  document.querySelector('#shared-view')?.classList.remove('lr-stage','lr-stage-skill','lr-stage-media','lr-stage-karte','lr-ride');
  host.dataset.selectedView=selectedView;
  try{sessionStorage.setItem('borderline.atlas.view.v1',selectedView);}catch{}
  try{sessionStorage.setItem('borderline.atlas.filters.v1',JSON.stringify(state));}catch{}
  if(graph?.destroy)graph.destroy();
  graph=null;
  ({landscape:renderLandscape,fractal:renderFractal,context:renderContext,register:renderRegister,skills:renderSkills,lab:renderLab,personal:()=>renderPersonal(),prompts:()=>renderPersonal(true),spatial:renderSpatial,graph:renderGraph,constellation:()=>renderRoom('constellation'),chapter:()=>renderRoom('chapter'),dynamics:()=>renderRoom('dynamics'),companion:renderCompanion,landscapeLegacy:renderLandscapeLegacy,fractalLegacy:renderFractalLegacy,heatmap:renderHeatmap,course:renderCourse,compare:renderCompare,methods:renderMethods,relationships:renderRelationships,neurotools:renderNeuroTools,media:renderMedia,learn:renderLearn,notebooks:()=>renderNotebookExplorer(document.querySelector('#shared-view'),supplement)}[selectedView])();
  if(!['compare','learn'].includes(selectedView)){const target=document.querySelector('#shared-view');unfoldWorkshop(selectedView==='relationships'?relationshipPanel:selectedView==='companion'?companionPanel:selectedView==='neurotools'?neuroPanel:target,selectedView);}
  updateScope();
  syncNavigation();
  const arrival=pendingArrival;pendingArrival=null;
  if(arrival?.image&&!motionReduced())playStageArrival(arrival.image);
}
function updateScope(){
 const local=['context','skills','lab','personal','prompts','companion','dynamics'].includes(selectedView)||selectedView==='notebooks'||selectedView==='course'||selectedView==='relationships'||selectedView==='neurotools'||(selectedView==='learn'&&learningMode==='notebook');
 for(const id of ['shared-search','shared-collection','shared-kind']){
   const control=host.querySelector('#'+id);control.disabled=local||(selectedView==='media'&&id==='shared-kind');control.setAttribute('aria-describedby','shared-filter-scope');
 }
 host.querySelector('#shared-perspective').setAttribute('aria-describedby','shared-filter-scope');
 host.querySelector('#shared-results-status').textContent=local?'Dieser Werkzeugraum hat eigene Auswahlmöglichkeiten.':selectedView==='media'?`${media.filter(item=>!item.originWork&&mediaMatches(item,state)).length} Medien in der Auswahl`:`${filtered().length} Einträge in der Auswahl`;
 host.querySelector('#shared-filter-scope').textContent=(local?'Nutze die Auswahl direkt im Werkzeug. Die gemeinsame Suche und Materialauswahl bleiben für die anderen Ansichten erhalten.':selectedView==='media'?'Suche und Atlasbereich wählen passende Medien und Fachseiten aus. Die Materialauswahl gilt für Wissenseinträge.':selectedView==='compare'?'Die Auswahl begrenzt die Vergleichsliste. Bereits gewählte Vergleichspartner bleiben erhalten.':'Suche, Atlasbereich und Material gelten für diese Ansicht.')+' Die Blickrichtung wählt passende Einträge aus und bietet im Lesebereich eine Textperspektive.';
}
let rideToken=0,rideFrame=0,pendingArrival=null;
function motionReduced(){return document.documentElement.classList.contains('atlas-reduced')||document.documentElement.classList.contains('atlas-motion-paused')||document.documentElement.classList.contains('atlas-quiet')||matchMedia('(prefers-reduced-motion: reduce)').matches;}
function snapshotLandscape(){
  const canvas=document.querySelector('#shared-view canvas.aw-canvas');
  if(!canvas)return '';
  try{return canvas.toDataURL('image/jpeg',.55);}catch{return '';}
}
function playStageArrival(image){
  document.querySelector('.lr-arrival')?.remove();
  const layer=document.createElement('div');layer.className='lr-arrival';layer.setAttribute('aria-hidden','true');
  const picture=document.createElement('img');picture.alt='';picture.src=image;layer.append(picture);
  host.append(layer);
  const remove=()=>layer.remove();
  layer.addEventListener('animationend',remove,{once:true});
  setTimeout(remove,1400);
}
function stopCameraRide(){rideToken++;cancelAnimationFrame(rideFrame);rideFrame=0;document.querySelector('#shared-view')?.classList.remove('atlas-zoom-out','atlas-zoom-in');}
function startCameraRide(){
  if(motionReduced()){switchView('dynamics',true);return;}
  const token=++rideToken;
  if(graph?.destroy)graph.destroy();
  graph=null;
  const stage=document.querySelector('#shared-view');
  stage.classList.remove('skill-workshop','lr-stage','lr-stage-skill','lr-stage-media','lr-stage-karte');
  delete stage.dataset.swMode;delete stage.dataset.swSession;delete stage.dataset.swChoosing;
  stage.classList.add('lr-ride');
  stage.innerHTML=`<div class="lr-ride-camera"><div class="lr-ride-stop" data-stop="landscape" style="--z:0"></div><div class="lr-ride-stop" data-stop="graph" style="--z:1"></div><div class="lr-ride-stop" data-stop="dynamics" style="--z:2"></div></div><div class="lr-ride-hud"><p data-ride-caption>Landschaft</p><button type="button" data-ride-stop>Fahrt anhalten</button></div>`;
  const camera=stage.querySelector('.lr-ride-camera');
  const caption=stage.querySelector('[data-ride-caption]');
  const scenes=[];
  const place=(name,mount)=>scenes.push(mount(stage.querySelector(`[data-stop="${name}"]`)));
  place('landscape',node=>mountTerrainSpace(node,{entries,relations,state:roomState,mode:'landscape',onSelect:id=>{current=id;},onView:view=>{stopCameraRide();switchView(view,true);}}));
  place('graph',node=>mountNetworkSpace(node,{entries,relations,media,sources,state:roomState,personal:false,onSelect:id=>{current=id;},onView:view=>{stopCameraRide();switchView(view,true);},onRead:id=>{stopCameraRide();readRoomEntry(id);}}));
  place('dynamics',node=>mountDynamics(node,{entries,relations,media,onOpenEntry:id=>{stopCameraRide();readRoomEntry(id);}}));
  graph={destroy(){scenes.splice(0).forEach(scene=>scene?.destroy?.());cancelAnimationFrame(rideFrame);}};
  let z=0,drag=null,stopped=false;
  const settle=view=>{if(stopped||token!==rideToken)return;stopped=true;stopCameraRide();switchView(view,true);};
  const nearest=()=>z<1100?'landscape':z<2300?'graph':'dynamics';
  const onKey=event=>{if(event.key==='Escape'){event.preventDefault();settle(nearest());}};
  const onDown=event=>{if(event.target?.closest?.('[data-ride-stop]'))return;drag={x:event.clientX,y:event.clientY};};
  const onMove=event=>{if(!drag)return;if(Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>14)settle(nearest());};
  const onWheel=()=>settle(nearest());
  stage.querySelector('[data-ride-stop]').onclick=()=>settle(nearest());
  window.addEventListener('keydown',onKey);
  window.addEventListener('pointerdown',onDown);
  window.addEventListener('pointermove',onMove);
  window.addEventListener('wheel',onWheel,{passive:true});
  const detach=()=>{window.removeEventListener('keydown',onKey);window.removeEventListener('pointerdown',onDown);window.removeEventListener('pointermove',onMove);window.removeEventListener('wheel',onWheel);};
  const started=performance.now(),duration=8600;
  const frame=now=>{
    if(token!==rideToken||stopped){detach();return;}
    if(motionReduced()){detach();settle('dynamics');return;}
    const t=Math.min(1,(now-started)/duration),eased=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
    z=eased*3200;
    camera.style.transform=`translate3d(0,0,${z}px)`;
    caption.textContent=z<1100?'Landschaft':z<2300?'Netz':'Lernszene';
    if(t<1)rideFrame=requestAnimationFrame(frame);
    else {
      detach();stopped=true;stage.classList.add('lr-ride-settled');camera.style.transform='none';
      stage.querySelectorAll('.lr-ride-stop').forEach(stop=>{stop.hidden=stop.dataset.stop!=='dynamics';stop.style.transform='none';});
      selectedView='dynamics';host.dataset.selectedView='dynamics';try{sessionStorage.setItem('borderline.atlas.view.v1','dynamics');}catch{}syncNavigation();
    }
  };
  rideFrame=requestAnimationFrame(frame);
}
function syncNavigation(){
 const atlas=['landscape','fractal','graph','heatmap','chapter'].includes(selectedView),praxis=['dynamics','skills'].includes(selectedView),section=atlas?'atlas':praxis?'praxis':selectedView==='constellation'?'meine':selectedView==='context'||selectedView==='media'?'medien':null;
 host.querySelectorAll('[data-section]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.section===section)));
 const choices=atlas?[['landscape','Landschaft'],['fractal','Baum'],['graph','Netz'],['heatmap','Heatmap']]:praxis?[['dynamics','Szenarien'],['skills','Skillkoffer']]:[];
 const bar=host.querySelector('.atlas-subnavigation');if(!bar)return;bar.innerHTML=choices.map(([v,t])=>`<button data-mode="${v}" aria-pressed="${selectedView===v}">${t}</button>`).join('')+(selectedView==='chapter'?'<span>Themenraum</span>':'')+(praxis?'<a class="schloss-zugang" href="schloss/">Schloss & Schlüssel</a>':'')+(atlas||praxis?'<button type="button" data-ride="1">Kamerazug</button>':'');bar.hidden=!choices.length;
 bar.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{stopCameraRide();switchView(b.dataset.mode);});
 bar.querySelector('[data-ride]')?.addEventListener('click',()=>startCameraRide());
}
function switchView(view,duringRide=false) {if(!views.some(([v])=>v===view))return;const stageKinds={skills:'skill',context:'media',media:'media',constellation:'karte'};pendingArrival=['landscape','fractal'].includes(selectedView)&&stageKinds[view]&&!duringRide&&!motionReduced()?{kind:stageKinds[view],image:snapshotLandscape()}:null;captureReadingPosition();const reader=host.querySelector('#shared-reader');if(reader)reader.hidden=true;saveReadingRoute();selectedView=view;host.querySelector('.shared-more-tools')?.removeAttribute('open');host.querySelectorAll('[data-shared-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.sharedView===view)));const stage=document.querySelector('#shared-view');const reduced=document.documentElement.classList.contains('atlas-reduced')||matchMedia('(prefers-reduced-motion: reduce)').matches;if(stage&&!reduced&&!duringRide){stage.classList.remove('atlas-passage');void stage.offsetWidth;stage.classList.add('atlas-passage');}render();}

async function init() {
  const response=await fetch('./atlas-collection.json');if(!response.ok)throw new Error('Sammlung nicht verfügbar');const data=await response.json();
  entries=data.entries||[];relations=data.relations||[];sources=data.sources||[];collectionInfo=data.collections||[];instruments=data.instruments||{};originalPaths=data.learningPaths||[];phraseSignals=data.phraseSignals||{};
  try{const response=await fetch('./atlas-editorial.json');if(response.ok){const editorial=await response.json();entries=applyEditorialCorrections(entries,editorial.corrections||[]);}}catch{}
  try{const response=await fetch('./atlas-media.json');if(response.ok)media=await response.json();}catch{}
  try{const response=await fetch('./atlas-notebook-cards.json');if(response.ok)notebookCards=await response.json();}catch{}
  try{const response=await fetch('./atlas-supplement.json');if(response.ok){supplement=await response.json();media.push(...(supplement.germanMedia||[]));}}catch{}
  let reports=[];try{reports=await fetchNotebookReports();}catch{}
  notebookContext=createNotebookContext({entries,relations,sources,media,supplement,cards:notebookCards,reports});
  // The shell becomes interactive together with its store and player, so a late initial render cannot interrupt an early gesture.
  host.inert=true;
  host.innerHTML=`<header class="atlas-shell">
    <div class="atlas-shell-top"><a class="atlas-shell-identity" href="#atlas" data-home><span class="atlas-brand-sign" aria-hidden="true">◌</span><span><strong>Borderline verstehen</strong><small>Beziehungen · Entwicklung · eigener Spielraum</small></span></a>
    <nav class="atlas-primary" aria-label="Hauptbereiche"><button data-section="atlas">Atlas</button><button data-section="medien">Medien</button><button data-section="praxis">Ausprobieren</button><button data-section="meine">Meine Karte</button></nav>
    <div class="atlas-shell-tools"><details class="atlas-shell-filters"><summary aria-label="Atlas durchsuchen und filtern">⌕ <span>Suche</span></summary><div class="atlas-shell-filter-panel"><label class="atlas-shell-search" for="shared-search"><span>Was möchtest du finden?</span><input id="shared-search" type="search" placeholder="Phänomen, Frage oder Quelle …" autocomplete="off"></label><div class="shared-controls"><label>Atlasbereich<select id="shared-collection"><option value="all">Alle Atlasbereiche</option>${collectionNames().map(name=>`<option>${esc(name)}</option>`).join('')}</select></label><label>Material<select id="shared-kind"><option value="all">Alle Materialarten</option>${[...new Set(entries.map(item=>item.kind))].map(kind=>`<option value="${esc(kind)}">${esc(typeLabel(kind))}</option>`).join('')}</select></label><label>Blickrichtung<select id="shared-perspective">${perspectives.map(([value,title])=>`<option value="${value}">${title}</option>`).join('')}</select></label></div><p id="shared-results-status" role="status"></p><p id="shared-filter-scope"></p></div></details>
    <details class="shared-more-tools"><summary aria-label="Einstellungen und weitere Werkzeuge">☷ <span>Einstellungen</span></summary><div><button data-shared-view="companion">Darstellung, Datenschutz &amp; Begleitung ↗</button><details class="atlas-extra-routes"><summary>Weitere Zugänge zum selben Atlas</summary>${[
      ['Lesen &amp; Vergleichen',['register','compare','course','learn']],
      ['Werkstätten',['methods','relationships','neurotools','lab']],
      ['Eigene Inhalte',['personal','prompts']],
      ['Bestand &amp; frühere Ansichten',['notebooks','media','spatial','landscapeLegacy','fractalLegacy']]
    ].map(([title,ids])=>`<section><h3>${title}</h3>${ids.map(id=>`<button data-shared-view="${id}">${views.find(([v])=>v===id)[1]}</button>`).join('')}</section>`).join('')}<a href="#start">Beziehungskarte ↗</a></details></div></details></div></div>
    <div class="atlas-subnavigation" aria-label="Ansicht im gewählten Bereich"></div>
  </header><div id="shared-view"></div><aside id="shared-reader" class="shared-reader" role="dialog" aria-label="Atlas-Lesebereich" hidden></aside>`;
  mountAtlasAppearance(host);mountAtlasMotion(host);
  host.querySelector('[data-home]').onclick=()=>{roomState.group=null;roomState.sub=null;switchView('landscape');};
  host.querySelectorAll('[data-section]').forEach(button=>button.onclick=()=>{const section=button.dataset.section;if(section==='atlas')switchView(['landscape','fractal','graph','heatmap','chapter'].includes(selectedView)?selectedView:'landscape');if(section==='medien')openContext();if(section==='praxis')switchView('dynamics');if(section==='meine')switchView('constellation');});
  const reader=host.querySelector('#shared-reader');
  window.addEventListener('keydown',closeReaderOnEscape);
  let readingScrollFrame=null;
  reader.addEventListener('scroll',()=>{if(readingScrollFrame!==null)return;readingScrollFrame=requestAnimationFrame(()=>{readingScrollFrame=null;captureReadingPosition();});},{passive:true});
  for(const [id,key] of [['shared-search','query'],['shared-collection','collection'],['shared-kind','kind'],['shared-perspective','perspective']])host.querySelector('#'+id).value=state[key];
  host.querySelectorAll('[data-shared-view]').forEach(button=>button.onclick=()=>{if(button.dataset.sharedView==='context')openContext();else switchView(button.dataset.sharedView);});
  host.querySelector('.atlas-shell').addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const panel=event.target.closest('details[open]');
    if(!panel)return;
    panel.removeAttribute('open');panel.querySelector('summary')?.focus();event.preventDefault();
  });
  host.querySelectorAll('.atlas-shell details').forEach(panel=>panel.addEventListener('toggle',()=>{
    if(!panel.open)return;
    host.querySelectorAll('.atlas-shell details[open]').forEach(other=>{if(other!==panel&&!other.contains(panel)&&!panel.contains(other))other.removeAttribute('open');});
  }));
  for(const [id,key] of [['shared-search','query'],['shared-collection','collection'],['shared-kind','kind'],['shared-perspective','perspective']])host.querySelector(`#${id}`).addEventListener(id==='shared-search'?'input':'change',event=>{state[key]=event.target.value;Object.assign(roomState,{query:state.query,collection:state.collection,kind:state.kind});try{sessionStorage.setItem('borderline.atlas.filters.v1',JSON.stringify(state));}catch{}if(selectedView==='landscape'&&graph){if(key==='query')graph.setQuery(state.query);else graph.refreshFilters();if(current&&key==='perspective')renderReader(find(current));updateScope();return;}if(key==='perspective'){if(current)renderReader(find(current));return;}cardIndex=0;render();});
  let initialState,personalLoaded=false,personalRevision=null;try{const response=await fetch('/api/personal',{cache:'no-store',credentials:'same-origin'});if(!response.ok)throw new Error('Profilzugang nicht verfügbar');initialState=(await response.json()).state||undefined;personalRevision=response.headers.get('ETag');personalLoaded=Boolean(personalRevision);}catch{}
  if(!personalLoaded){const warning=document.createElement('p');warning.className='ar-storage-warning';warning.setAttribute('role','status');warning.textContent='Dein gespeicherter Blick konnte nicht geladen werden. Änderungen bleiben in dieser Ansicht und überschreiben keine gespeicherten Profile. Bitte exportiere neue Arbeit vor dem erneuten Laden.';host.querySelector('.atlas-shell').append(warning);}
  personalStore=createPersonalStore({entryIds:entries.map(e=>e.id),initialState,onPersist:snapshot=>{if(!personalLoaded)return Promise.reject(new Error('Gespeicherter Bestand wurde nicht geladen'));const task=persistQueue.catch(()=>{}).then(async()=>{if(!personalLoaded)throw new Error('Bitte zuerst gespeicherten Stand neu laden');const response=await fetch('/api/personal',{method:'PUT',headers:{'Content-Type':'application/json','If-Match':personalRevision},body:JSON.stringify(snapshot),cache:'no-store',credentials:'same-origin'});if(!response.ok){if(response.status===412||response.status===428){personalLoaded=false;const warning=document.createElement('p');warning.className='ar-storage-warning';warning.setAttribute('role','alert');warning.textContent='Dein Blick wurde in einem anderen Fenster geändert. Diese Arbeit wurde nicht darübergespeichert. Exportiere sie bei Bedarf und lade anschließend den aktuellen Stand neu.';host.querySelector('.atlas-shell').append(warning);}throw new Error('Speichern fehlgeschlagen');}personalRevision=response.headers.get('ETag');});persistQueue=task;return task;}});
  guardPendingPersonalWrites(personalStore);
  player=mountAtlasPlayer({media:[...media,...notebookContext.all],captureOrigin:()=>({view:selectedView,entryId:roomState.selected,group:roomState.group}),onReturn:({origin})=>{if(origin.group!==undefined)roomState.group=origin.group;if(origin.entryId)roomState.selected=origin.entryId;switchView(origin.view||'landscape');if(origin.entryId)graph?.focus?.(origin.entryId);}});
  companionPanel=document.createElement('section');
  companion=mountAtlasCompanion(companionPanel,{onShowSelection:()=>{switchView('graph');if(roomState.selected)graph?.focus?.(roomState.selected);},getContext:()=>{const item=find(roomState.selected);return {selection:item?[{title:item.title,text:displaySummary(item)}]:[],sources:(item?.sourceIds||[]).map(sourceFor).filter(Boolean).map(s=>({title:s.title,text:s.summary||s.boundary||s.status||'',url:s.url||s.href})),media:relatedMedia(item||{}).slice(0,4).map(m=>({title:m.title,text:m.originWork?artworkCredit(m):(m.summary||''),url:m.sourceURL||m.url})),personal:item?[{title:item.title,text:personalStore.markFor(item.id).note||personalStore.markFor(item.id).question||''}]:[]};},onAcceptSuggestion:suggestion=>{const item=find(roomState.selected);const box=document.createElement('section');box.className='ac-proposal';const title=document.createElement('h3');title.textContent='Vorschlag prüfen und übernehmen';const text=document.createElement('textarea');text.rows=7;text.value=suggestion.text;const note=document.createElement('p');note.textContent=item?'Du kannst den Entwurf bearbeiten und ausdrücklich als eigene Arbeitsnotiz zum ausgewählten Ort speichern. Herkunft: '+suggestion.provider+' · '+suggestion.model+'.':'Wähle zuerst einen Ort im Atlas. Der Vorschlag bleibt hier bearbeitbar.';const save=document.createElement('button');save.textContent='Als bearbeitete Arbeitsnotiz speichern';save.disabled=!item;save.onclick=()=>{personalStore.setMark(item.id,{note:text.value,question:suggestion.question,provenance:{kind:'companion-draft',provider:suggestion.provider,model:suggestion.model,createdAt:new Date().toISOString()}});note.textContent='Als persönliche Arbeitsnotiz gespeichert. Der Ausgangsentwurf bleibt ein Vorschlag.';save.disabled=true;};box.append(title,note,text,save);companionPanel.append(box);box.scrollIntoView({block:'nearest'});}});
  attachSpeechInputs(document.body);
  render();
  resumeReadingRoute();
  host.inert=false;
  window.addEventListener('pagehide',captureReadingPosition);
  window.addEventListener('atlas-open',event=>{location.hash='atlas';if(event.detail?.query){state.query=event.detail.query;host.querySelector('#shared-search').value=state.query;}if(event.detail?.view)switchView(event.detail.view);else render();});
}
init().catch(error=>{console.error('Atlas initialization:',error);host.inert=false;host.innerHTML='<h1>Die Atlaslandschaft konnte nicht geladen werden.</h1><p>Die vorhandenen Bereiche und lokalen Spuren bleiben über die Navigation erreichbar. Bitte lade diese Seite erneut.</p><a href="#start">Zur Beziehungskarte</a>';});
