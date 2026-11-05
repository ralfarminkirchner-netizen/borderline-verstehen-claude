import { artworkCredit } from './atlas-public-copy.mjs';
import { explicitlyRelatedMedia } from './atlas-media-associations.mjs';
import { directions, thematicPlacement, subclusters, subclusterPlacement } from './knowledge-landscape.mjs';
import { displaySummary } from './atlas-editorial.mjs';
import { mountPersonalControls, mountProfileControls } from './atlas-personal.mjs';
import { mountDynamics } from './atlas-dynamics.mjs';
import { mountTerrainSpace } from './atlas-terrain-space.mjs';
import { mountNetworkSpace } from './atlas-network-space.mjs';
import { mountChapterSpace } from './atlas-chapter-spaces.mjs';
import { mountRelationshipHeatmap } from './atlas-relationship-heatmap.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu,'');
export const roomImages=['assets/media/traumaatlas-mensch-und-verbindungen.jpg','assets/media/traumaatlas-kugel-in-der-welle.jpg','assets/media/atlas-wegweiser.jpg','assets/media/traumaatlas-lichtfluss-im-koerper.jpg','assets/media/atlas-verarbeitung.jpg','assets/wege-und-spielraum.jpg','assets/media/atlas-wegweiser.jpg','assets/fundus/rollen-normen-und-teilhabe.png'];
export function findRelationPath(from,to,relations,maxDepth=5){
  if(from===to)return [];
  const adjacent=new Map();for(const edge of relations){for(const [a,b] of [[edge.from,edge.to],[edge.to,edge.from]]){if(!adjacent.has(a))adjacent.set(a,[]);adjacent.get(a).push({id:b,edge});}}
  const queue=[{id:from,path:[]}],visited=new Set([from]);
  for(let i=0;i<queue.length;i++){const node=queue[i];if(node.path.length>=maxDepth)continue;for(const next of adjacent.get(node.id)||[]){if(visited.has(next.id))continue;const path=[...node.path,{from:node.id,to:next.id,edge:next.edge}];if(next.id===to)return path;visited.add(next.id);queue.push({id:next.id,path});}}
  return null;
}
export function markSymbols(mark={}){return [mark.familiar?'● Vertraut':'',mark.relevant?'◆ Relevant':'',mark.interested?'◇ Interesse':''].filter(Boolean).join(' · ');}
// Editorial reading lenses select existing entries, never create relations or exclusive placement.
export function chapterLenses(group,items){
  const definitions=group===3?[
    ['signale','Signale wahrnehmen','Was bemerke ich gerade – ohne schon eine Erklärung festzulegen?',/^(Reizbarkeit|Herzrasen|Anspannung|Emotionsregulation|Körper & Schlaf)/i],
    ['rhythmus','Schlaf & Alltag','Welche Fragen zu Schlaf, Tagesverlauf oder Umgebung möchte ich genauer ansehen?',/^(Schlaf und Tagesfunktion|Schlafstörungen|Bett nur|Ein- und Durch|Nicht einschlafen|Schlaf erholt|Körper & Schlaf)/i],
    ['spielraum','Spielraum erkunden','Welche vorhandene Möglichkeit möchte ich erst lesen und für mich prüfen?',/^(Co.Regulation|Kurze Atem|Anspannung und Handlungsspielraum|Eine Bedingung|Anhaltende Schlaf|Herunterfahren)/i]
  ]:group===0?[
    ['naehe','Nähe zulassen','Was wünsche ich mir an Verbindung – und was weiß ich tatsächlich vom Gegenüber?',/^(Bindungstheorie$|Nähe,|Co.Regulation)/i],
    ['eigenraum','Eigenraum achten','Welche Grenze oder Bitte möchte ich verständlich ausdrücken?',/^(Autonomie als|Nähe,|Bitten,|Eine Grenze|Angekündigtes)/i],
    ['offen','Deutungen offenhalten','Welche andere Sicht ist denkbar? Die Innenwelt eines anderen Menschen bleibt offen.',/^(Mentalisieren|Ambivalenz|Perspektiv|Bindungsunsicherheit)/i]
  ]:[];
  return definitions.map(([key,title,question,pattern])=>({key,title,question,entries:items.filter(e=>pattern.test(e.title)).slice(0,6)}));
}
export function mountAtlasRoom(host,{view='landscape',entries=[],relations=[],media=[],sources=[],store,state={},onRead=()=>{},onView=()=>{},onMedia=()=>{},onContext=()=>{},onSelect=()=>{}}={}){
 const byId=new Map(entries.map(e=>[e.id,e]));let alive=true,cleanups=[],inspectionId=null;state.selected??=null;
 const selected=()=>byId.get(state.selected);
 function inspector(){const e=selected();if(!e||inspectionId!==e.id||view==='chapter'||view==='dynamics')return '';const linked=relations.filter(r=>r.from===e.id||r.to===e.id);const materials=explicitlyRelatedMedia(media,e);return `<aside class="ar-inspector" aria-label="Ausgewähltes Phänomen"><button class="ar-inspector-close" data-ar-clear aria-label="Auswahl schließen">×</button><small>${esc(e.collection)}</small><h3 tabindex="-1">${esc(e.title)}</h3><details class="ar-explanation"><summary>Kurze Einordnung</summary><p>${esc(displaySummary(e)?.slice(0,180))}</p></details><svg class="ar-selection-sign" viewBox="0 0 280 64" aria-hidden="true"><path d="M12 54 Q62 4 140 32 T268 12"/><path d="M12 54 Q82 48 140 32 T268 54"/><circle cx="140" cy="32" r="7"/></svg><div class="ar-inspector-actions"><button data-ar-read>Text &amp; Quellen entfalten ↗</button><button data-ar-view="graph">${linked.length} Verbindungen ↗</button></div><details class="ar-personal-fold"><summary>Meine Spur zu diesem Ort</summary><div data-ar-marks></div></details>${materials.length?`<div class="ar-materials">${materials.map((m,i)=>`<figure><button data-ar-media="${i}">${m.poster||/bild|image/i.test(m.format||'')?`<img src="${esc(m.poster||m.file)}" alt="${esc(m.originWork ? m.title : (m.alt||m.title))}" loading="lazy">`:''}<span>${esc(m.title)}</span></button><figcaption>${esc(m.originWork ? artworkCredit(m) : (m.producer||''))}${/^https?:\/\//.test(m.sourceURL||'')?` · <a href="${esc(m.sourceURL)}" target="_blank" rel="noopener noreferrer">Quelle ↗</a>`:''}</figcaption></figure>`).join('')}</div>`:''}</aside>`;}
 function paint(){if(!alive)return;cleanups.forEach(fn=>fn?.());cleanups=[];host.innerHTML=`<div class="atlas-rooms ar-room-${view}">${view==='constellation'?'<p class="lr-stage-banner">Nur auf diesem Gerät. Diese Karte erscheint nicht in öffentlichen Ansichten.</p>':''}${view==='dynamics'?'<div data-ar-dynamics></div>':'<div data-ar-space></div>'}${view==='constellation'?'<details class="ar-profile-manager"><summary>Meine Karten verwalten · speichern, exportieren, löschen</summary><div data-ar-profiles></div></details>':''}${inspector()}</div>`;
 const common={entries,relations,media,sources,store,state,onSelect:choose,onView,onRead,onMedia:m=>onMedia(m,{entryId:state.selected,view,group:state.group})};let scene;
 if(view==='landscape'||view==='fractal')scene=mountTerrainSpace(host.querySelector('[data-ar-space]'),{...common,mode:view==='fractal'?'tree':'landscape'});
 if(view==='graph'||view==='constellation')scene=mountNetworkSpace(host.querySelector('[data-ar-space]'),{...common,personal:view==='constellation'});
 if(view==='heatmap')scene=mountRelationshipHeatmap(host.querySelector('[data-ar-space]'),common);
 if(view==='chapter')scene=mountChapterSpace(host.querySelector('[data-ar-space]'),{...common,group:state.group??3});
 if(view==='dynamics')scene=mountDynamics(host.querySelector('[data-ar-dynamics]'),{entries,relations,media,onOpenEntry:onRead,onOpenMedia:common.onMedia,onHighlight:detail=>{state.scenarioHighlight=detail;}});
 if(scene)cleanups.push(()=>scene.destroy?.());
 host.querySelector('[data-ar-clear]')?.addEventListener('click',()=>{inspectionId=null;paint();});host.querySelector('[data-ar-read]')?.addEventListener('click',()=>onRead(state.selected));host.querySelectorAll('[data-ar-view]').forEach(b=>b.onclick=()=>onView(b.dataset.arView));
 const contextualMedia=explicitlyRelatedMedia(media,state.selected);host.querySelectorAll('[data-ar-media]').forEach(b=>b.onclick=()=>common.onMedia(contextualMedia[Number(b.dataset.arMedia)]));
 const marks=host.querySelector('[data-ar-marks]');if(marks&&store){const c=mountPersonalControls(marks,{store,entry:selected()});cleanups.push(typeof c==='function'?c:()=>c?.destroy?.());}
 const profiles=host.querySelector('[data-ar-profiles]');if(profiles&&store){const c=mountProfileControls(profiles,{store,entries,onNavigate:choose,storageDescription:'Deine Karten bleiben voneinander getrennt. Exportiere eine Kopie, um sie unabhängig aufzubewahren.'});cleanups.push(typeof c==='function'?c:()=>c?.destroy?.());}
 }
 function choose(id){if(!byId.has(id))return;inspectionId=id;state.selected=id;onSelect(byId.get(id));paint();host.querySelector('.ar-inspector h3,.cw-detail h3')?.focus({preventScroll:true});}
 // These two rooms do not read personal marks. Hydration must not restart an active instrument or opening.
 let pending=false;const unsub=store?.subscribe(()=>{if(view==='dynamics'||view==='chapter'||pending)return;pending=true;queueMicrotask(()=>{pending=false;if(alive)paint();});});paint();return {destroy(){alive=false;unsub?.();cleanups.forEach(fn=>fn?.());},focus:choose,setQuery(query){state.query=query;paint();},refreshFilters(){paint();}};
}
