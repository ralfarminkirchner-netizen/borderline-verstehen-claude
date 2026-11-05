import { artworkCredit } from './atlas-public-copy.mjs';
import { directions, thematicPlacement } from './knowledge-landscape.mjs';
import { displaySummary } from './atlas-editorial.mjs';
import { mountPersonalControls } from './atlas-personal.mjs';
import { explicitlyRelatedMedia } from './atlas-media-associations.mjs';

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const norm = value => String(value || '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
export const chapterSpaces = [
  { form: 'dialogue', title: 'Zwischen dir und mir', line: 'Nähe, Eigenraum und die Frage, was wir voneinander wissen.', modes: ['Beobachtung', 'Eine Deutung', 'Offene Frage'], patterns: [/mentalisi|bedeutung.*nachfrag|perspektiv/i, /nahe|autonom|grenz|bindung/i, /kontakt|bitte|nachricht|zuruckweis/i] },
  { form: 'perspectives', title: 'Mehr als eine Ansicht', line: 'Innensicht, Gegenüber und Zeit dürfen ein verschiedenes Bild ergeben.', modes: ['Von innen', 'Im Gegenüber', 'Über die Zeit'], patterns: [/selbstbild|identitat|selbsterleb/i, /scham|schuld|selbstwert/i, /personlichkeit|entwicklung|ruckmeldung/i] },
  { form: 'traces', title: 'Spuren und Gegenwart', line: 'Erinnerung ist kein gerader Weg. Wähle eine Spur, ohne einen Ausgang festzulegen.', modes: ['Erinnerung', 'Gegenwart', 'Unterschiede'], patterns: [/erinner|flashback|wiedererleb/i, /dissozi|gegenwart|orientier/i, /komplex|trauma|geschichte/i] },
  { form: 'body', title: 'Im Körper bemerken', line: 'Eine Körperkarte zum Lesen und Nachfragen. Ihre Orte sind keine medizinische Zuordnung.', modes: ['Signale', 'Schlaf & Rhythmus', 'Spielraum'], patterns: [/herz|atem|korper|anspann|reizbar|magen|schmerz/i, /schlaf|erschopf|erhol|rhythm/i, /co.regul|beweg|beruhr|spielraum|pause|beruhig/i] },
  { form: 'stimuli', title: 'Ein Raum, verschiedene Zugänge', line: 'Verändere die Darstellung von Reizen. Dieses Gedankenbild simuliert keine Person und keine Diagnose.', modes: ['Klang & Licht', 'Aufmerksamkeit', 'Anforderungen'], patterns: [/sensor|licht|gerausch|reiz|uberlast/i, /aufmerksam|exekutiv|plan|anfang|adhs/i, /anforder|autonom|mask|autis/i] },
  { form: 'perception', title: 'Was rückt in den Vordergrund?', line: 'Gefühl, Bedeutung und Zeit sind verschiedene Zugänge zu demselben Erleben.', modes: ['Gefühl', 'Bedeutung', 'Zeit'], patterns: [/gefuhl|emotion|wahrnehm/i, /bedeutung|trigger|denken/i, /zeit|realitat|erleb/i] },
  { form: 'paths', title: 'Es gibt mehr als einen nächsten Schritt', line: 'Öffne eine Möglichkeit. Du musst hier keinen Weg zu Ende gehen.', modes: ['Eine Grenze', 'Unterstützung', 'Etwas ausprobieren'], patterns: [/grenz|schutz|sicher|gewalt/i, /unterstutz|kontakt|hilfe|reparatur/i, /ressourc|skill|ubung|methode|spielraum/i] },
  { form: 'evidence', title: 'Begriffe und Belege', line: 'Ein Modell, eine Beobachtung und eine Quelle sagen nicht dasselbe. Wechsle die Blickebene.', modes: ['Modelle', 'Befunde', 'Quellen'], patterns: [/modell|theori|schule|begriff/i, /forsch|studie|befund|evidenz|unterschied/i, /quelle|bibliograf|leitlinie|diagnos/i] },
];

export function chapterGroupIndex(group) {
  if (group === null || group === undefined) return 3;
  const value = typeof group === 'object' && group !== null ? group.index ?? group.group ?? directions.indexOf(group) : group;
  return Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) < 8 ? Number(value) : 3;
}

// A reading arrangement over the existing corpus. It adds no records or relation claims.
export function createChapterModel(group, entries = [], relations = [], mode = 0, page = 0) {
  const index = chapterGroupIndex(group), definition = chapterSpaces[index];
  const all = entries.filter(entry => thematicPlacement(entry).includes(index));
  const pattern = definition.patterns[mode] || definition.patterns[0];
  const ranked = all.map((entry, order) => ({ entry, order, rank: (pattern.test(norm(entry.title)) ? 10 : 0) + (['phenomenon', 'resource', 'context', 'exercise', 'finding', 'scene'].includes(entry.kind) ? 2 : 0) + (index === 7 && entry.kind === ['model', 'finding', 'source'][mode] ? 8 : 0) })).sort((a, b) => b.rank - a.rank || a.order - b.order).map(item => item.entry);
  const pages = Math.max(1, Math.ceil(ranked.length / 3)), currentPage = ((page % pages) + pages) % pages;
  const nodes = ranked.slice(currentPage * 3, currentPage * 3 + 3), ids = new Set(nodes.map(entry => entry.id));
  return { index, definition, all, nodes, pages, page: currentPage, relations: relations.filter(edge => ids.has(edge.from) && ids.has(edge.to)) };
}


const palettes = ['#8ed2bd','#b7a5df','#ef967d','#8ed2bd','#9bc5df','#e9c778','#ef967d','#b7a5df'];
const roomNotes = [
  'Die beiden Ufer ordnen Fragen zu Beziehung. Der veränderbare Abstand ist eine Bildgestaltung, keine Aussage über zwei Personen.',
  'Die transparenten Ebenen bieten verschiedene Leseblicke auf denselben Bestand. Keine Ebene ersetzt die Sicht eines Menschen.',
  'Die Spuren ordnen das Lesen. Sie stellen keine rekonstruierte Erinnerung und keinen kausalen Ablauf dar.',
  'Die Körperform ist eine Lesehilfe. Ein Ort in dieser Darstellung ist keine medizinische Zuordnung.',
  'Der Regler verändert ausschließlich diese Darstellung. Er simuliert weder das Erleben einer Person noch eine Diagnose.',
  'Die Wellen verändern den Bildfokus. Sie messen kein Gefühl und bestimmen nicht, was jemand erlebt.',
  'Die Wege sind offene Lesezugänge. Weder Reihenfolge noch Ende sind vorgeschrieben.',
  'Die Ebenen unterscheiden Begriffe, Befunde und Quellen. Nur eigens bezeichnete Linien stammen aus dem Beziehungsbestand.'
];
const positions = [[.22,.42],[.51,.25],[.79,.55]];

// Each room folds the same small paper mesh in a different way. These are
// editorial forms; they neither add relations nor place symptoms in a body.
const cwMix=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*t);
const cwUnit=a=>{const n=Math.hypot(...a)||1;return a.map(v=>v/n);};
const cwCross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const cwAnchors=[[-3,.35,.6],[.05,1.85,1.1],[3,-.65,.2]];
const cwRows=28,cwColumns=6;
const cwBody=[[0,2.6],[.45,2.5],[.6,2.1],[.45,1.7],[.95,1.45],[1.4,.8],[1.15,.35],[.9,.7],[.78,-.1],[.95,-1],[.8,-2.5],[.25,-2.5],[0,-1.1],[-.25,-2.5],[-.8,-2.5],[-.95,-1],[-.78,-.1],[-.9,.7],[-1.15,.35],[-1.4,.8],[-.95,1.45],[-.45,1.7],[-.6,2.1],[-.45,2.5]];
const cwBodyPoint=u=>{const f=u*cwBody.length,n=Math.floor(f),t=f-n,points=[-1,0,1,2].map(i=>cwBody[(n+i+cwBody.length)%cwBody.length]);return [0,1].map(i=>.5*((2*points[1][i])+(-points[0][i]+points[2][i])*t+(2*points[0][i]-5*points[1][i]+4*points[2][i]-points[3][i])*t*t+(-points[0][i]+3*points[1][i]-3*points[2][i]+points[3][i])*t*t*t));};
function foldedRoom(index,mode,amount){
 const result=[],a=amount/100;
 for(let part=0;part<3;part++)for(let j=0;j<=cwColumns;j++)for(let i=0;i<=cwRows;i++){
  const u=i/cwRows,v=j/cwColumns*2-1,t=u*Math.PI*2;
  const chosen=part===mode?1:0,pleat=Math.abs(v)*.35+Math.cos(v*Math.PI*3)*.11;
  let x,y,z;
  if(index===0){
   if(part<2){const side=part===0?-1:1,angle=-1.45+u*2.9,r=1.75+v*.67;x=side*(1.5+a*1.5)+side*Math.cos(angle)*r;y=Math.sin(angle)*r*1.35;z=pleat+Math.cos(angle*2+mode*.65)*.65+v*.4;}
   else{x=(u-.5)*(3+a*2.3);y=Math.sin(u*Math.PI)*(.9-mode*.45)+v*.15;z=Math.sin(u*Math.PI*2)*.5+v*.2;}
  }else if(index===1||index===7){
   const angle=(part-1)*.22+(mode-part)*.12,xx=(u-.5)*2.8;
   x=(part-1)*2.5+xx*Math.cos(angle);y=v*(index===7?1.8:2.4)+(u-.5)*.75+(part===mode?.25:0);
   z=xx*Math.sin(angle)+pleat+(chosen?.9:-.45)+Math.sin(u*Math.PI)*.5;
  }else if(index===2){
   x=(u-.5)*9;y=Math.sin(u*Math.PI*2+part*1.2+mode*.38)*(1.3+part*.24)+(part-1)*.52+v*.5;
   z=Math.cos(u*Math.PI*3+part)*.85+pleat+chosen*.55+v*.15+(a-.5)*Math.sin(u*Math.PI)*.7;
  }else if(index===3){
   const body=cwBodyPoint(u),r=(1+v*.17)*(1-part*.09);x=body[0]*r+Math.sin(t*2+mode*.6)*.11;y=body[1]*r-.18;
   z=Math.cos(t*2+mode*.7)*.46+pleat+part*.4+Math.sin(t)*.25;
  }else if(index===4){
   const angle=-2.7+u*5.4,r=(.22+(v+1)*.72)*(part===mode?1.25:.95)*(a*.55+.8);
   x=(part-1)*2.5+Math.cos(angle)*r;y=Math.sin(angle)*r*1.3+(part===1?.9:-.4);
   z=Math.cos(angle*5)*.23*(v+1)+pleat+part*.2+chosen*.3;
  }else if(index===5){
   const r=1+(v+1)*.35;x=Math.cos(t)*r*(2.1+part*.28)+(a-.5)*(part-1)*1.6;y=Math.sin(t)*r*(.75+part*.2);
   z=Math.cos(t*3+mode*.55)*.48+Math.sin(t)*.5+part*.46+pleat;
  }else{
   const width=(.2+u*.45)*(chosen?1.35:1);x=(part-1)*3.3*u*u+v*width;y=-3.1+6*u;
   z=Math.sin(u*Math.PI)*(.9+part*.2)+Math.sin(v*Math.PI)*.23+chosen*.4;
  }
  result.push([x,y,z]);
 }
 return result;
}
function foldedOrigin(index,mode,amount,selected){
 const geometry=foldedRoom(index,mode,amount),perPart=(cwRows+1)*(cwColumns+1);
 const paths=Array.from({length:3},(_,part)=>[0,3,6].map(j=>`<path d="${Array.from({length:cwRows+1},(_,i)=>{const p=geometry[part*perPart+j*(cwRows+1)+i];return `${i?'L':'M'}${(130+p[0]*23+p[2]*3).toFixed(1)} ${(43-p[1]*12).toFixed(1)}`;}).join('')}"/>`).join('')).join('');
 const anchor=cwAnchors[Math.max(0,selected)],x=130+anchor[0]*23+anchor[2]*3,y=43-anchor[1]*12;
 return `<svg class="cw-origin-map" viewBox="0 0 260 88" role="img" aria-label="Der geöffnete Ort im Themenraum ${esc(directions[index].name)}"><g fill="none">${paths}</g><circle cx="${x}" cy="${y}" r="8"/><circle class="cw-origin-point" cx="${x}" cy="${y}" r="3"/></svg>`;
}
function mountFoldedRoom(svg,{index,mode,amount,selected=-1,from,onProject,paused=false,reduced=false,quiet=false}){
 const doc=svg.ownerDocument,win=doc.defaultView,ns='http://www.w3.org/2000/svg';
 // Parse the six hex digits explicitly; the palette stays finite in old browsers.
 const accent=[1,3,5].map(i=>parseInt(palettes[index].slice(i,i+2),16)),paper=[241,244,247],light=cwUnit([-.35,1,.55]);
 svg.innerHTML=`<g class="cw-floor"></g><g class="cw-folds"></g><g class="cw-section-lines"></g>`;
 const folds=svg.querySelector('.cw-folds'),lines=svg.querySelector('.cw-section-lines'),floor=svg.querySelector('.cw-floor');
 const faces=[],ridges=[],verticesPerPart=(cwRows+1)*(cwColumns+1);
 for(let part=0;part<3;part++){
  for(let j=0;j<cwColumns;j++)for(let i=0;i<cwRows;i++){
   const start=part*verticesPerPart+j*(cwRows+1)+i,el=doc.createElementNS(ns,'path');
   el.setAttribute('stroke-width','.45');el.setAttribute('stroke-linejoin','round');folds.append(el);faces.push({el,ids:[start,start+1,start+cwRows+2,start+cwRows+1],part,j});
  }
  for(const j of [0,3,6]){const el=doc.createElementNS(ns,'path');el.setAttribute('fill','none');el.setAttribute('stroke','#1d1d1f');el.setAttribute('stroke-width',j===3?'.75':'1.15');el.setAttribute('opacity',j===3?'.22':'.45');lines.append(el);ridges.push({el,ids:Array.from({length:cwRows+1},(_,i)=>part*verticesPerPart+j*(cwRows+1)+i)});}
 }
 const floorLines=Array.from({length:3},(_,i)=>{const el=doc.createElementNS(ns,'path');el.setAttribute('fill','none');el.setAttribute('stroke',palettes[index]);el.setAttribute('stroke-opacity',String(.12-i*.025));el.setAttribute('stroke-width','.7');floor.append(el);return el;});
 let geometry=from?.geometry||foldedRoom(index,mode,amount).map(p=>[p[0]*.12,p[1]*.18,p[2]*.3]),camera=from?.camera||[0,-.04,13.5,0,0,0,500],frame=0,tween=null,destroyed=false;
 const goalCamera=()=>selected<0?[mode*.1-.1,-.08,11.7,0,0,0,500]:[mode*.08+(selected-1)*.1,-.05,9,...cwAnchors[selected],win.innerWidth>760?335:500];
 const project=(p)=>{const [yaw,pitch,distance,tx,ty,tz,cx]=camera,xx=p[0]-tx,yy=p[1]-ty,zz=p[2]-tz,rx=xx*Math.cos(yaw)+zz*Math.sin(yaw),rz=-xx*Math.sin(yaw)+zz*Math.cos(yaw),ry=yy*Math.cos(pitch)-rz*Math.sin(pitch),depth=distance-(yy*Math.sin(pitch)+rz*Math.cos(pitch));return [cx+rx*750/depth,300-ry*750/depth,depth];};
 function paint(){
  if(destroyed)return;
  const points=geometry.map(project),ordered=[];
  for(const face of faces){const ps=face.ids.map(id=>points[id]),vs=face.ids.map(id=>geometry[id]),n=cwUnit(cwCross(vs[1].map((x,i)=>x-vs[0][i]),vs[3].map((x,i)=>x-vs[0][i])));
   const diffuse=Math.max(0,Math.min(1,n[0]*light[0]+n[1]*light[1]+n[2]*light[2]));
   const color=accent.map((v,i)=>Math.max(0,Math.min(255,Math.round(v*(.62+diffuse*.55)+paper[i]*(.05+diffuse*.06)))));
   const crease=accent.map(v=>Math.round(v*(.28+diffuse*.2)));
   face.el.setAttribute('d',ps.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('')+'Z');face.el.setAttribute('fill',`rgb(${color.join(',')})`);face.el.setAttribute('stroke',`rgb(${crease.join(',')})`);face.el.setAttribute('stroke-width',diffuse>.62?'.35':'.9');face.depth=ps.reduce((v,p)=>v+p[2],0)/4;ordered.push(face);
  }
  ordered.sort((a,b)=>b.depth-a.depth);const fragment=doc.createDocumentFragment();for(const face of ordered)fragment.append(face.el);folds.append(fragment);
  for(const ridge of ridges)ridge.el.setAttribute('d',ridge.ids.map((id,i)=>`${i?'L':'M'}${points[id][0].toFixed(2)} ${points[id][1].toFixed(2)}`).join(''));
  floorLines.forEach((el,i)=>el.setAttribute('d',Array.from({length:65},(_,n)=>project([Math.cos(n/64*Math.PI*2)*(4+i*.5),-3.15,Math.sin(n/64*Math.PI*2)*(2.1+i*.22)])).map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join('')));
  onProject?.(cwAnchors.map(project));
 }
 function tick(now){frame=0;if(!tween||paused||destroyed)return;const p=Math.min(1,(now-tween.start)/tween.duration),t=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;geometry=tween.from.map((v,i)=>cwMix(v,tween.to[i],t));camera=cwMix(tween.camera,tween.goal,t);paint();if(p<1)frame=win.requestAnimationFrame(tick);else tween=null;}
 function set(next={},duration=820){
  if(next.mode!==undefined)mode=next.mode;if(next.amount!==undefined)amount=next.amount;if(next.selected!==undefined)selected=next.selected;
  win.cancelAnimationFrame(frame);frame=0;
  const target=foldedRoom(index,mode,amount),goal=goalCamera();
  if(paused||reduced||quiet||!duration){geometry=target;camera=goal;tween=null;paint();return;}
  tween={from:geometry,to:target,camera:[...camera],goal,start:win.performance.now(),duration};if(!paused)frame=win.requestAnimationFrame(tick);
 }
 function motion(next){paused=!!next.paused;reduced=!!next.reduced;quiet=!!next.quiet;win.cancelAnimationFrame(frame);frame=0;if((reduced||quiet)&&tween){geometry=tween.to;camera=tween.goal;tween=null;paint();}else if(tween&&!paused){tween={...tween,from:geometry,camera:[...camera],start:win.performance.now(),duration:500};frame=win.requestAnimationFrame(tick);}}
 const resize=win.ResizeObserver?new win.ResizeObserver(paint):null;resize?.observe(svg);
 paint();set({},900);
 return {set,motion,snapshot:()=>({geometry:geometry.map(p=>[...p]),camera:[...camera]}),interrupt(){win.cancelAnimationFrame(frame);frame=0;tween=null;},destroy(){destroyed=true;resize?.disconnect();win.cancelAnimationFrame(frame);}};
}

export const chapterRelatedMedia = explicitlyRelatedMedia;
export function mountChapterSpace(host, { group = 3, entries = [], relations = [], media = [], store, state = {}, onSelect = () => {}, onView = () => {}, onMedia = () => {}, onRead = () => {} } = {}) {
  const index = chapterGroupIndex(group); state.chapterSpaces ??= {};
  const local = state.chapterSpaces[index] ??= { mode: 0, amount: 45, page: 0 };
  const doc=host.ownerDocument,win=doc.defaultView,preference=win.matchMedia?.('(prefers-reduced-motion: reduce)');
  let alive=true,personalCleanup,world,motionPaused=local.paused??!!state.calm;
  let globalMotion={paused:doc.documentElement.classList.contains('atlas-motion-paused'),quiet:doc.documentElement.classList.contains('atlas-quiet'),reduced:!!preference?.matches||doc.documentElement.classList.contains('atlas-reduced')};
  const presentation=()=>({...globalMotion,paused:globalMotion.paused||motionPaused||doc.hidden,reduced:globalMotion.reduced||!!preference?.matches});
  const syncMotion=()=>{const current=presentation();world?.motion(current);const room=host.querySelector('.cw-room');room?.classList.toggle('cw-paused',current.paused);const button=host.querySelector('[data-cs-motion]');if(button){button.disabled=globalMotion.paused;button.setAttribute('aria-pressed',String(current.paused));button.textContent=globalMotion.paused?'Global pausiert':motionPaused?'Bewegung an':'Raum anhalten';}};
  const onMotion=event=>{globalMotion={...globalMotion,...event.detail};syncMotion();};
  const onPreference=()=>syncMotion();
  win.addEventListener('atlas:motionchange',onMotion);doc.addEventListener('visibilitychange',onPreference);preference?.addEventListener?.('change',onPreference);
  const captureDetail=()=>{const detail=host.querySelector('.cw-detail');if(!detail)return;local.details??={};const active=host.ownerDocument.activeElement;local.details[detail.dataset.csDetail]={scroll:detail.scrollTop,personalOpen:!!detail.querySelector('.cw-personal')?.open,focusedMeaning:detail.contains(active)?active?.dataset?.personalMeaning:null};};
  const cleanupPersonal=()=>{if(typeof personalCleanup==='function')personalCleanup();else personalCleanup?.destroy?.();personalCleanup=undefined;};
  function render(focus) {
    if (!alive) return;
    const previousWorld=world?.snapshot();world?.destroy();captureDetail();cleanupPersonal();
    const filtered=entries.filter(entry=>(!state.query||norm(entry.title+' '+displaySummary(entry)).includes(norm(state.query)))&&(!state.collection||state.collection==='all'||entry.collection===state.collection)&&(!state.kind||state.kind==='all'||entry.kind===state.kind));
    const model=createChapterModel(index,filtered,relations,local.mode,local.page),{definition,nodes}=model;
    const selected=nodes.find(entry=>entry.id===local.entryId), detailState=local.details?.[selected?.id]||{};
    const suggestions=chapterRelatedMedia(media,selected),image=suggestions.find(item=>/bild|image/i.test(item.format||'')&&item.file);
    const marked=entry=>{const m=store?.markFor(entry.id)||{};return [m.familiar?'●':'',m.relevant?'◆':'',m.interested?'◇':''].filter(Boolean).join(' ');};
    const safeSource=item=>/^https?:\/\//i.test(item.sourceURL||'')?`<a href="${esc(item.sourceURL)}" target="_blank" rel="noopener noreferrer">Quelle ↗</a>`:'';
    host.innerHTML=`<section class="atlas-chapter-space cw-room cs-${definition.form} ${selected?'cw-has-selection':''} ${motionPaused?'cw-paused':''}" style="--cw-accent:${palettes[index]}" aria-label="${esc(directions[index].name)}">
      <div class="cw-environment" aria-hidden="true"><svg class="cw-scene" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet"></svg></div>
      <header class="cw-heading"><button type="button" data-cs-overview aria-label="Zur Landschaft">←</button><div><small>Themenraum</small><h2>${esc(directions[index].name)}</h2></div><label class="cw-topic"><span class="cw-sr-only">Themenraum wechseln</span><select data-cs-topic>${directions.map((d,i)=>`<option value="${i}" ${i===index?'selected':''}>${esc(d.name)}</option>`).join('')}</select></label></header>
      <nav class="cs-modes cw-modes" aria-label="Blick auf den Themenraum">${definition.modes.map((mode,i)=>`<button type="button" data-cs-mode="${i}" aria-pressed="${local.mode===i}">${esc(mode)}</button>`).join('')}</nav>
      <div class="cw-places" role="group" aria-label="Orte im Themenraum">${nodes.map((entry,i)=>`<button type="button" class="cw-place ${selected?.id===entry.id?'cw-place-selected':''}" style="--place-x:${positions[i][0]*100}%;--place-y:${positions[i][1]*100}%;--place-index:${i}" data-cs-entry="${esc(entry.id)}" aria-pressed="${selected?.id===entry.id}"><span class="cw-place-dot" aria-hidden="true"></span><span class="cw-place-title">${esc(entry.title)}</span>${marked(entry)?`<span class="cw-place-mark">${marked(entry)}</span>`:''}<span class="cw-place-action" aria-hidden="true">Öffnen ↗</span></button>`).join('')}${nodes.length?'':'<p class="cw-empty">Zu dieser Auswahl ist hier kein Eintrag sichtbar. Ändere die Suche oder den Atlasbereich.</p>'}</div>
      <div class="cw-ground"><p>${esc(definition.title)}</p><div class="cw-controls">${[0,2,4,5].includes(index)?`<label>${esc({0:'Abstand',2:'Leselicht',4:'Bilddichte',5:'Fokus'}[index])}<input data-cs-amount type="range" min="0" max="100" value="${local.amount}"/></label>`:''}<button type="button" data-cs-prev ${model.pages===1?'disabled':''} aria-label="Vorherige Orte">←</button><span class="cw-page">${model.page+1} / ${model.pages}</span><button type="button" data-cs-next ${model.pages===1?'disabled':''} aria-label="Weitere Orte im Raum">→</button><button type="button" data-cs-motion aria-pressed="${motionPaused}">${motionPaused?'Bewegung an':'Raum anhalten'}</button><details class="cw-about"><summary>Zum Raum</summary><div><p>${esc(definition.line)}</p><p>${esc(roomNotes[index])}</p><button type="button" data-cs-reset>Ansicht zurücksetzen</button></div></details></div></div>
      ${selected?`<aside class="cs-selected cw-detail" data-cs-detail="${esc(selected.id)}" aria-label="Geöffneter Ort"><button type="button" class="cw-close" data-cs-close aria-label="Ort schließen">×</button>${foldedOrigin(index,local.mode,local.amount,nodes.indexOf(selected))}<small>${esc(selected.collection)}</small><h3 tabindex="-1">${esc(selected.title)}</h3><p>${esc(displaySummary(selected))}</p><div class="cw-reading-actions"><button type="button" data-cs-read>Vertiefen & Quellen ↗</button><button type="button" data-cs-network>Verbindungen ↗</button></div>${image?`<figure class="cw-image"><button type="button" data-cs-media="${suggestions.indexOf(image)}"><img src="${esc(image.file)}" alt="${esc(image.originWork?image.title:(image.alt||image.title))}" loading="lazy"><span>${esc(image.title)} ↗</span></button><figcaption>${esc(image.originWork?artworkCredit(image):(image.producer||''))} ${safeSource(image)}</figcaption></figure>`:''}${suggestions.filter(item=>item!==image).map(item=>`<button type="button" class="cw-medium" data-cs-media="${suggestions.indexOf(item)}">${esc(item.format||'Medium')} · ${esc(item.title)} ↗</button>`).join('')}${store?`<details class="cw-personal" ${detailState.personalOpen?'open':''}><summary>Meine Markierungen & Notiz</summary><div data-cs-personal></div></details>`:''}</aside>`:''}
    </section>`;
    if(selected&&store)personalCleanup=mountPersonalControls(host.querySelector('[data-cs-personal]'),{store,entry:selected});
    const detail=host.querySelector('.cw-detail');if(detail){detail.scrollTop=detailState.scroll||0;if(detailState.focusedMeaning)[...detail.querySelectorAll('[data-personal-meaning]')].find(input=>input.dataset.personalMeaning===detailState.focusedMeaning)?.focus({preventScroll:true});}
    const placeButtons=[...host.querySelectorAll('[data-cs-entry]')];
    world=mountFoldedRoom(host.querySelector('.cw-scene'),{index,mode:local.mode,amount:local.amount,selected:nodes.indexOf(selected),from:previousWorld,...presentation(),onProject:points=>{
      if(win.innerWidth<=600)return;
      // The labels follow the same camera as the folded surfaces.
      const room=host.querySelector('.cw-room'),r=room.getBoundingClientRect(),scale=Math.min(r.width/1000,r.height/600),ox=(r.width-1000*scale)/2,oy=(r.height-600*scale)/2;
      placeButtons.forEach((button,i)=>{button.style.setProperty('--place-x',`${(ox+points[i][0]*scale)/r.width*100}%`);button.style.setProperty('--place-y',`${(oy+points[i][1]*scale)/r.height*100}%`);});
    }});
    syncMotion();
    const activate=node=>{const entry=nodes.find(e=>e.id===node.dataset.csEntry);if(!entry)return;local.entryId=entry.id;state.selected=entry.id;onSelect(entry.id);if(alive&&host.isConnected)render({entry:entry.id});};
    host.querySelectorAll('[data-cs-entry]').forEach(button=>button.onclick=()=>activate(button));
    host.querySelectorAll('[data-cs-mode]').forEach(button=>button.onclick=()=>{local.mode=Number(button.dataset.csMode);local.page=0;local.entryId=null;render({mode:local.mode});});
    host.querySelector('[data-cs-overview]').onclick=()=>onView('landscape');
    host.querySelector('[data-cs-topic]').onchange=event=>{state.group=Number(event.target.value);state.sub=null;onView('chapter');};
    host.querySelector('[data-cs-amount]')?.addEventListener('input',event=>{local.amount=Number(event.target.value);world?.set({amount:local.amount},140);});
    const page=delta=>{local.page=(model.page+delta+model.pages)%model.pages;local.entryId=null;render(delta>0?'next':'prev');};
    host.querySelector('[data-cs-prev]').onclick=()=>page(-1);host.querySelector('[data-cs-next]').onclick=()=>page(1);
    host.querySelector('[data-cs-motion]').onclick=()=>{motionPaused=!motionPaused;local.paused=motionPaused;syncMotion();};
    host.querySelector('[data-cs-reset]').onclick=()=>{Object.assign(local,{mode:0,amount:45,page:0,entryId:null});render('reset');};
    host.querySelector('[data-cs-close]')?.addEventListener('click',()=>{local.entryId=null;render({entry:selected.id});});
    host.querySelector('[data-cs-read]')?.addEventListener('click',()=>onRead(selected.id));
    host.querySelector('[data-cs-network]')?.addEventListener('click',()=>{state.selected=selected.id;onView('graph');});
    host.querySelectorAll('[data-cs-media]').forEach(button=>button.onclick=()=>onMedia(suggestions[Number(button.dataset.csMedia)],{entryId:selected.id,group:index,view:'chapter'}));
    const room=host.querySelector('.cw-room');
    // Every direct action interrupts the current flight before handling its action.
    room.addEventListener('pointerdown',()=>world?.interrupt(),{capture:true});
    room.addEventListener('wheel',()=>world?.interrupt(),{passive:true,capture:true});
    room.addEventListener('keydown',event=>{if(event.key==='Escape')world?.interrupt();},{capture:true});
    if(focus?.entry){if(selected)host.querySelector('.cw-detail h3')?.focus({preventScroll:true});else [...host.querySelectorAll('[data-cs-entry]')].find(n=>n.dataset.csEntry===focus.entry)?.focus({preventScroll:true});}
    else if(focus?.mode!==undefined)host.querySelector(`[data-cs-mode="${focus.mode}"]`)?.focus({preventScroll:true});
    else if(focus)host.querySelector(`[data-cs-${focus==='prev'?'prev':focus==='reset'?'reset':'next'}]`)?.focus({preventScroll:true});
  }
  render();
  return {destroy(){alive=false;world?.destroy();win.removeEventListener('atlas:motionchange',onMotion);doc.removeEventListener('visibilitychange',onPreference);preference?.removeEventListener?.('change',onPreference);captureDetail();cleanupPersonal();host.replaceChildren();}};
}
