import {createWorldRenderer,worldPlaces,worldHeight} from './atlas-world-renderer.mjs';
import {jointForRelation,jointGeometry} from './atlas-joints.mjs';
import {directions,thematicPlacement,subclusters,subclusterPlacement} from './knowledge-landscape.mjs';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const centers=[[300,240],[720,200],[220,560],[750,590],[1260,550],[1250,200],[1190,880],[500,900]];
const colors=['#8ed2bd','#b7a5df','#ef967d','#9bc9a3','#92c4e0','#e9c778','#c3cf8b','#d6a9bb'];
export function terrainMembers(entries,group,sub=null){return entries.filter(e=>thematicPlacement(e).includes(group)&&(sub===null||subclusterPlacement(e,group)===sub));}
export function terrainContours(cx,cy,r,seed=0){
 const points=Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,k=1+Math.sin(i*2.3+seed)*.12;return [cx+Math.cos(a)*r*1.28*k,cy+Math.sin(a)*r*.81*k];});
 const point=(i)=>points[(i+8)%8],pair=p=>p.map(n=>n.toFixed(1)).join(',');
 return `M${pair(points[0])} `+points.map((p,i)=>{const before=point(i-1),next=point(i+1),after=point(i+2);return `C${pair([p[0]+(next[0]-before[0])/6,p[1]+(next[1]-before[1])/6])} ${pair([next[0]-(after[0]-p[0])/6,next[1]-(after[1]-p[1])/6])} ${pair(next)}`;}).join(' ')+' Z';
}
export function terrainLayout(width){const narrow=width<=700;return {narrow,width:narrow?780:1560,height:1130,centers:narrow?[[200,190],[580,190],[200,430],[580,430],[200,670],[580,670],[200,910],[580,910]]:centers,subregions:narrow?[[390,230],[390,550],[390,870]]:[[420,330],[1110,320],[775,760]],leaves:narrow?[[200,270],[580,270],[200,560],[580,560],[200,850],[580,850]]:[[370,260],[800,230],[1220,290],[350,700],[790,740],[1220,720]]};}
export function terrainPage(state,mode,group,sub,total,delta=0){state.terrainPages??={};const key=`${mode}:${group}:${sub}`;const page=Math.max(0,Math.min(Math.max(0,Math.ceil(total/6)-1),(Number.isInteger(state.terrainPages[key])?state.terrainPages[key]:0)+delta));state.terrainPages[key]=page;return page;}

/** Push readable names apart and off an open branch. Bounds stay inside the stage. */
export function separateLabels(items, bounds, obstacles = [], rounds = 28) {
  const placed = items.map(item => ({ ...item }));
  if (placed.length > 1) {
    const cx = placed.reduce((sum, item) => sum + item.x, 0) / placed.length;
    const cy = placed.reduce((sum, item) => sum + item.y, 0) / placed.length;
    if (placed.every(item => Math.hypot(item.x - cx, item.y - cy) < 56)) {
      placed.forEach((item, index) => {
        const angle = -Math.PI / 2 + index / placed.length * Math.PI * 2;
        const reach = Math.max(128, item.minLead || 0, (item.w + item.h) * .55);
        item.x = cx + Math.cos(angle) * reach;
        item.y = cy + Math.sin(angle) * reach * .74;
      });
    }
  }
  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < placed.length; i++) {
      const a = placed[i];
      if (a.anchor && a.minLead) {
        const dx = a.x - a.anchor.x, dy = a.y - a.anchor.y, dist = Math.hypot(dx, dy);
        if (dist < a.minLead) {
          const angle = dist < 1 ? -Math.PI / 2 + i : Math.atan2(dy, dx);
          a.x = a.anchor.x + Math.cos(angle) * a.minLead;
          a.y = a.anchor.y + Math.sin(angle) * a.minLead;
        }
      }
      for (let j = 0; j < i; j++) {
        const b = placed[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        if (dx === 0 && dy === 0) { dx = .4; dy = 1; }
        const needX = (Math.max(a.w, 150) + Math.max(b.w, 150)) / 2 + 28;
        const needY = (Math.max(a.h, 68) + Math.max(b.h, 68)) / 2 + 22;
        if (Math.abs(dx) < needX && Math.abs(dy) < needY) {
          if (Math.abs(dx) / needX >= Math.abs(dy) / needY) {
            const shift = (needX - Math.abs(dx)) / 2 + 1;
            a.x += dx >= 0 ? shift : -shift; b.x -= dx >= 0 ? shift : -shift;
          } else {
            const shift = (needY - Math.abs(dy)) / 2 + 1;
            a.y += dy >= 0 ? shift : -shift; b.y -= dy >= 0 ? shift : -shift;
          }
        }
      }
      for (const obstacle of obstacles) {
        const dx = a.x - obstacle.x, dy = a.y - obstacle.y, dist = Math.hypot(dx, dy) || .01;
        const need = obstacle.r + Math.hypot(a.w, a.h) * .22;
        if (dist < need) { a.x += dx / dist * (need - dist); a.y += dy / dist * (need - dist); }
      }
      a.x = Math.max(bounds.left + a.w / 2, Math.min(bounds.right - a.w / 2, a.x));
      a.y = Math.max(bounds.top + a.h / 2, Math.min(bounds.bottom - a.h / 2, a.y));
    }
  }
  return placed;
}

export function mountTerrainSpace(host,{entries=[],relations=[],store,state={},mode='landscape',onSelect=()=>{},onView=()=>{}}={}){
 const narrow=host.clientWidth<=700,media=matchMedia('(prefers-reduced-motion: reduce)');
 let motion={paused:document.documentElement.classList.contains('atlas-motion-paused'),quiet:document.documentElement.classList.contains('atlas-quiet'),reduced:media.matches||document.documentElement.classList.contains('atlas-reduced')};
 let alive=true,frame=0,renderer,transition=null,morph=null,tour=null,orbit=null,drag=null,moved=false,clock=0,last=0,pointers=new Map(),pinch=0;
 const marked=e=>{const m=store?.markFor(e.id);return !!(m?.familiar||m?.relevant||m?.interested);};
 const filtered=()=>entries.filter(e=>(!state.query||norm([e.title,e.summary,...(e.tags||[])].join(' ')).includes(norm(state.query)))&&(!state.collection||state.collection==='all'||state.collection===e.collection)&&(!state.kind||state.kind==='all'||state.kind===e.kind));
 const places=worldPlaces(mode,narrow),previousMode=state.worldLast?.mode||mode;
 function place(g,m=mode){const p=[...worldPlaces(m,narrow)[g]];if(m==='landscape')p[1]=worldHeight(p[0],p[2],narrow)+.3;return p;}
 function subpoint(g,s,m=mode){const p=place(g,m),a=s*Math.PI*2/3-Math.PI/2;if(m==='tree'){p[0]+=Math.cos(a)*2.1;p[1]+=Math.sin(a)*1.5;p[2]+=.3;}else{p[0]+=Math.cos(a)*2.3;p[2]+=Math.sin(a)*2.3;p[1]=worldHeight(p[0],p[2],narrow)+.4;}return p;}
 function nodePoint(n,m=mode){if(n.type==='group')return place(n.group,m);if(n.type==='sub')return subpoint(n.group,n.key,m);const p=subpoint(n.group,state.sub,m),a=n.index/6*Math.PI*2-Math.PI/2;p[0]+=Math.cos(a)*1.6;if(m==='tree')p[1]+=Math.sin(a)*1.2;else{p[2]+=Math.sin(a)*1.6;p[1]=worldHeight(p[0],p[2],narrow)+.35;}return p;}
 function focusEntries(items){
  const ids=new Set(items.map(item=>item.id)),byId=new Map(items.map(item=>[item.id,item]));
  const linked=(relations||[]).filter(edge=>ids.has(edge.from)&&ids.has(edge.to));
  if(!linked.length)return items;
  const seen=[],have=new Set();
  for(const edge of linked)for(const id of [edge.from,edge.to])if(!have.has(id)){have.add(id);seen.push(byId.get(id));}
  for(const item of items)if(!have.has(item.id))seen.push(item);
  return seen;
 }
 function nodes(){
  if(state.group==null)return directions.map((d,g)=>({type:'group',key:g,title:d.name,subtitle:`${terrainMembers(filtered(),g).length} Orte`,group:g}));
  const g=state.group;if(state.sub==null)return subclusters[g].map(([title],s)=>({type:'sub',key:s,title,subtitle:`${terrainMembers(filtered(),g,s).length} Orte`,group:g}));
  const items=focusEntries(terrainMembers(filtered(),g,state.sub)),page=terrainPage(state,mode,g,state.sub,items.length);
  return items.slice(page*6,page*6+6).map((e,i)=>({type:'entry',key:e.id,title:e.title,subtitle:marked(e)?'Markiert':'',index:i,group:g,selected:state.selected===e.id}));
 }
 function destination(entry=null){
  const center=entry?nodePoint(entry):state.group==null?(mode==='tree'?[0,4,0]:[0,1,0]):state.sub==null?place(state.group):subpoint(state.group,state.sub);
  let offset=mode==='tree'?[0,.5,state.group==null?(narrow?43:34):state.sub==null?(narrow?15:12):(narrow?12:9)]:state.group==null?[0,narrow?40:23,narrow?20:26]:[2,state.sub==null?(narrow?19:14):(narrow?15:10),state.sub==null?(narrow?19:14):(narrow?15:11)];
  if(entry)offset=mode==='tree'?[.8,.3,narrow?10:7]:[2,narrow?12:7,narrow?12:8];
  return {target:center,eye:center.map((v,i)=>v+offset[i])};
 }
 const clone=c=>({eye:[...c.eye],target:[...c.target]});
 state.terrainCameras??={};let focusKey=`${state.group??'all'}:${state.sub??'all'}`,camera=clone(state.worldLast?.camera||state.terrainCameras[mode]||destination());
 if(previousMode!==mode&&!motion.reduced&&!motion.quiet&&!motion.paused){morph={elapsed:0,duration:1800};transition={from:clone(camera),to:destination(),elapsed:0,duration:1800};}
 else if(!state.worldLast||state.terrainCameras[mode]?.focusKey!==focusKey)camera=destination();
 function persist(){state.terrainCameras[mode]={...clone(camera),focusKey};state.worldLast={mode,camera:clone(camera)};}
 host.innerHTML=`<section class="aw-world aw-${mode}" aria-label="${mode==='tree'?'Räumlicher Atlasbaum':'Räumliche Wissenslandschaft'}"><canvas class="aw-canvas" aria-hidden="true"></canvas><div class="aw-atmosphere" aria-hidden="true"></div><div class="aw-topline"><nav aria-label="Vertiefungsstufe"></nav><button class="aw-room-link" data-room hidden>Themenraum ↗</button></div><p class="aw-caption">${mode==='tree'?'Derselbe Bestand, senkrecht. Nähe ist keine Ursache.':'Jedes Gebiet hat eine eigene Farbe. Nähe ist keine Ursache.'}</p><div class="aw-viewport" tabindex="0" aria-label="${mode==='tree'?'Baum':'Landschaft'} bewegen. Pfeiltasten verschieben, Plus und Minus zoomen, Escape unterbricht eine Fahrt."><svg class="aw-anchor-lines" aria-hidden="true"></svg><svg class="aw-relations" aria-label="Vorhandene Beziehungen in diesem Ausschnitt"></svg><div class="aw-places"></div></div><div class="aw-relation-note" hidden></div><div class="aw-journey" hidden><span class="aw-journey-step"></span><p></p><button data-tour-next>Weiter →</button><button data-tour-room hidden>In den Themenraum fahren</button><button data-tour-stop>Rundgang beenden</button></div><div class="aw-bottomline"><details class="aw-legend"><summary>Wie dieser Raum gelesen wird ↗</summary><p>Jedes Gebiet ist ein eigener Körper. Bänder zur Mitte sind nur Orientierung. In der Nähe zeichnen die farbigen Fugen vorhandene Beziehungen. Nähe ist keine Ursache.</p><button data-net>Beziehungen im Netz öffnen ↗</button></details><div class="aw-page"></div><div class="aw-controls"><button data-tour>Rundgang starten</button><button data-orbit aria-pressed="false">Umlauf</button><button data-camera="out" aria-label="Verkleinern">−</button><button data-camera="home" aria-label="Zur Übersicht zurückfahren">⌖</button><button data-camera="in" aria-label="Vergrößern">+</button></div></div><div class="aw-status" role="status" aria-live="polite"></div></section>`;
 const scene=host.querySelector('.aw-world'),canvas=host.querySelector('canvas'),viewport=host.querySelector('.aw-viewport'),labels=host.querySelector('.aw-places'),lines=host.querySelector('.aw-anchor-lines'),journey=host.querySelector('.aw-journey');
 let currentNodes=[],labelButtons=[],anchors=[],ghosts=[];
 function trail(){
  const nav=host.querySelector('.aw-topline nav');nav.innerHTML=`<button data-up="all" ${state.group==null?'aria-current="location"':''}>Atlas</button>${state.group!=null?`<span> / </span><button data-up="group" ${state.sub==null?'aria-current="location"':''}>${esc(directions[state.group].name)}</button>`:''}${state.group!=null&&state.sub!=null?`<span> / </span><span>${esc(subclusters[state.group][state.sub][0])}</span>`:''}`;
  nav.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{interrupt();if(b.dataset.up==='all')state.group=null;state.sub=null;travel();});host.querySelector('[data-room]').hidden=state.group==null;const roomJump=journey.querySelector('[data-tour-room]');if(roomJump)roomJump.hidden=state.group==null;
  scene.classList.toggle('aw-focused',state.group!=null);
 }
 function fillLabels(keepGhosts=true){
  if(keepGhosts&&labels.children.length&&!motion.reduced&&!motion.quiet&&!motion.paused){const g=document.createElement('div');g.className='aw-context-ghost';g.innerHTML=labels.innerHTML;g.querySelectorAll('button').forEach(b=>{b.disabled=true;b.tabIndex=-1;b.removeAttribute('aria-label');});g.setAttribute('aria-hidden','true');viewport.append(g);ghosts.push({el:g,elapsed:0});}
  currentNodes=nodes();labels.innerHTML=currentNodes.map((n,i)=>`<button class="aw-place aw-place-${n.type} ${n.selected?'is-selected':''}" data-place="${i}" style="--place-color:${colors[n.group]}" aria-label="${esc(n.title)} ${n.type==='entry'?'öffnen':'erkunden'}"><i aria-hidden="true"></i><span>${esc(n.title)}</span><small>${esc(n.subtitle)}</small></button>`).join('');
  labelButtons=[...labels.querySelectorAll('[data-place]')];lines.innerHTML=currentNodes.map(n=>`<path style="stroke:${colors[n.group]}"/>`).join('');anchors=[...lines.children];
  labelButtons.forEach(b=>b.onclick=()=>{if(moved)return;interrupt();const n=currentNodes[Number(b.dataset.place)];if(n.type==='entry'){state.selected=n.key;fly(destination(n),()=>{persist();onSelect(n.key);});}else{state.group=n.type==='group'?n.key:state.group;state.sub=n.type==='sub'?n.key:null;travel();}});
  const pageHost=host.querySelector('.aw-page');if(state.group!=null&&state.sub!=null){const items=terrainMembers(filtered(),state.group,state.sub),p=terrainPage(state,mode,state.group,state.sub,items.length);pageHost.innerHTML=`<button data-page="-1" ${p===0?'disabled':''} aria-label="Vorherige Orte">←</button><span>${items.length?p*6+1:0}–${Math.min(items.length,p*6+6)} / ${items.length}</span><button data-page="1" ${p*6+6>=items.length?'disabled':''} aria-label="Weitere Orte">→</button>`;pageHost.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{interrupt();terrainPage(state,mode,state.group,state.sub,items.length,Number(b.dataset.page));fillLabels();wake();});}else pageHost.innerHTML='';trail();
 }
 function fly(to,complete=null){
  if(motion.reduced||motion.quiet||motion.paused){camera=to;transition=null;draw();complete?.();return;}
  transition={from:clone(camera),to,elapsed:0,duration:1450,complete};wake();
 }
 function travel(){focusKey=`${state.group??'all'}:${state.sub??'all'}`;fillLabels();fly(destination());host.querySelector('.aw-status').textContent=state.sub!=null?subclusters[state.group][state.sub][0]:state.group!=null?directions[state.group].name:'Gesamtatlas';}
 function stopTour(){tour=null;journey.hidden=true;host.querySelector('[data-tour]').textContent='Rundgang starten';}
 function interrupt(){transition=null;if(morph)morph.frozen=true;orbit=null;host.querySelector('[data-orbit]').setAttribute('aria-pressed','false');stopTour();}
 const tourSteps=[{g:null,s:null,title:'Das Ganze zuerst',text:'Die Faltungen geben acht Lesegebieten Raum. Wähle jederzeit selbst einen Ort.'},{g:3,s:null,title:'Ein Lesegebiet öffnet sich',text:'Die Kamera nähert sich. Die vorherige Lage bleibt im Übergang sichtbar.'},{g:3,s:1,title:'Vom Gebiet zu einzelnen Orten',text:'Hier findest du die Texte mit ihrer Herkunft. Redaktionelle Nähe bleibt von fachlichen Beziehungen getrennt.'},{g:null,s:null,title:'Wieder Zusammenhang sehen',text:'Zurückfahren öffnet den Blick. Im Baum verändert derselbe Körper seine Gestalt; im Netz werden belegte Beziehungen lesbar.'}];
 function tourStep(index){tour={index,elapsed:0};const step=tourSteps[index];state.group=step.g;state.sub=step.s;travel();journey.hidden=false;journey.querySelector('p').textContent=step.text;journey.querySelector('span').textContent=`${index+1} / ${tourSteps.length} · ${step.title}`;journey.querySelector('[data-tour-next]').textContent=index===tourSteps.length-1?'Abschließen':'Weiter →';host.querySelector('[data-tour]').textContent='Rundgang läuft';wake();}
 host.querySelector('[data-tour]').onclick=()=>{interrupt();tourStep(0);};host.querySelector('[data-tour-next]').onclick=()=>{const next=tour.index+1;if(next===tourSteps.length)stopTour();else tourStep(next);};host.querySelector('[data-tour-stop]').onclick=stopTour;
 function showRelation(edge,joint){
  const note=host.querySelector('.aw-relation-note');note.hidden=false;note.replaceChildren();
  const title=document.createElement('strong');title.textContent=joint.name;
  const line=document.createElement('p');line.textContent=joint.label||'steht in Beziehung zu';
  const limit=document.createElement('p');limit.textContent=joint.editorial?'Redaktionelle Kante. Sie ordnet, sie belegt nicht.':'Vorhandene Formulierung. Nähe ist keine Ursache.';
  const open=document.createElement('button');open.type='button';open.textContent='Im Netz weitergehen';open.onclick=()=>{state.selected=edge.from;onView('graph');};
  const close=document.createElement('button');close.type='button';close.textContent='Schließen';close.onclick=()=>{note.hidden=true;host.querySelectorAll('.aw-relation.is-open').forEach(el=>el.classList.remove('is-open'));draw();};
  note.append(title,line,limit,open,close);
 }
 let bridgeCache;
 function themeBridges(){
  if(bridgeCache)return bridgeCache;
  const member=new Map(entries.map(entry=>[entry.id,thematicPlacement(entry)])),tally=new Map();
  for(const edge of relations||[])for(const ga of member.get(edge.from)||[])for(const gb of member.get(edge.to)||[])if(ga!==gb){const lo=Math.min(ga,gb),hi=Math.max(ga,gb),key=`${lo}:${hi}`;tally.set(key,(tally.get(key)||0)+1);}
  bridgeCache=[...tally.entries()].map(([key,count])=>{const [lo,hi]=key.split(':').map(Number);return {lo,hi,count};}).sort((a,b)=>b.count-a.count).slice(0,6);
  return bridgeCache;
 }
 function paintRelations(projected){
  const svg=host.querySelector('.aw-relations');if(!svg)return;
  const NS='http://www.w3.org/2000/svg';
  if(state.group==null){
    const pairs=themeBridges(),at=new Map(currentNodes.map((node,i)=>[node.key,projected[i]]));
    const key='bridge:'+pairs.map(pair=>`${pair.lo}${pair.hi}${pair.count}`).join();
    if(svg.dataset.key!==key){
      svg.dataset.key=key;svg.replaceChildren();
      for(const pair of pairs){
        const group=document.createElementNS(NS,'g');group.classList.add('aw-bridge');group.__pair=pair;group.style.setProperty('--aj-color',colors[pair.lo]);
        group.setAttribute('role','img');group.setAttribute('aria-label',`${directions[pair.lo].name} und ${directions[pair.hi].name}. ${pair.count} vorhandene Beziehungen. Keine Ursache.`);
        const path=document.createElementNS(NS,'path');path.classList.add('aw-bridge-line');group.append(path);svg.append(group);
      }
    }
    for(const group of svg.children){
      const pair=group.__pair,a=at.get(pair?.lo),b=at.get(pair?.hi);if(!a||!b||!a.visible||!b.visible)continue;
      const mx=(a.x+b.x)/2,my=(a.y+b.y)/2,dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1,bow=Math.min(64,len*.16);
      const cx=mx+(-dy/len)*bow,cy=my+(dx/len)*bow;
      group.querySelector('path').setAttribute('d',`M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`);
      group.querySelector('path').style.strokeWidth=String(Math.min(4.5,1.4+Math.log2(pair.count+1)*.45));
    }
    return;
  }
  const index=new Map();
  if(state.sub!=null)currentNodes.forEach((n,i)=>{if(n.type==='entry'&&projected[i].visible)index.set(n.key,projected[i]);});
  const edges=(relations||[]).filter(edge=>index.has(edge.from)&&index.has(edge.to)).slice(0,3);
  const key=edges.map(edge=>`${edge.from}>${edge.to}:${edge.label||''}`).join('|');
  if(svg.dataset.key!==key){
    svg.dataset.key=key;svg.replaceChildren();
    const NS='http://www.w3.org/2000/svg';
    for(const edge of edges){
      const joint=jointForRelation(edge),group=document.createElementNS(NS,'g');
      group.classList.add('aw-relation');if(joint.editorial)group.classList.add('is-editorial');
      group.dataset.family=joint.family;group.style.setProperty('--aj-color',joint.color);
      group.setAttribute('role','button');group.setAttribute('tabindex','0');
      group.setAttribute('aria-label',`${joint.name}. ${joint.label}. Verbindung öffnen.`);
      const hit=document.createElementNS(NS,'path'),line=document.createElementNS(NS,'path'),branch=document.createElementNS(NS,'path');
      hit.classList.add('aw-relation-hit');line.classList.add('aw-relation-line');branch.classList.add('aw-relation-branch');branch.setAttribute('pathLength','1');group.append(hit,line,branch);group.__edge=edge;
      const open=event=>{event?.preventDefault();event?.stopPropagation();svg.querySelectorAll('.is-open').forEach(el=>el.classList.remove('is-open'));group.classList.add('is-open');showRelation(edge,joint);draw();};
      group.addEventListener('click',open);group.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')open(event);});
      svg.append(group);
    }
    if(!edges.length){const note=host.querySelector('.aw-relation-note');if(note)note.hidden=true;}
  }
  for(const group of svg.children){
    const edge=group.__edge,a=index.get(edge?.from),b=index.get(edge?.to);if(!a||!b)continue;
    const geometry=jointGeometry({x:a.x,y:a.y},{x:b.x,y:b.y},group.dataset.family);
    const open=group.classList.contains('is-open'),line=group.querySelector('.aw-relation-line'),branch=group.querySelector('.aw-relation-branch');
    group.querySelector('.aw-relation-hit').setAttribute('d',geometry.path);
    if(group.dataset.family==='branch'){line.setAttribute('d',geometry.path);if(branch)branch.setAttribute('d',geometry.ornament||'');}
    else{line.setAttribute('d',open?geometry.opened:geometry.path);if(branch)branch.setAttribute('d',open?(geometry.ornament||''):'');}
  }
 }
 function draw(){
  if(!alive||!renderer)return;let progress=morph?Math.min(1,morph.elapsed/morph.duration):1;progress=progress*progress*(3-2*progress);
  renderer.draw(camera,clock/1000,progress);
  const projected=currentNodes.map(n=>{const next=nodePoint(n),old=nodePoint(n,previousMode);return renderer.project(next.map((v,i)=>old[i]+(v-old[i])*progress),camera);});
  const width=scene.clientWidth,height=scene.clientHeight,positions=projected.map(p=>({...p}));
  // Ordered side rails on a narrow screen keep long names readable and connected to their real anchors.
  if(narrow&&state.group==null){for(const side of [-1,1]){const ids=currentNodes.map((n,i)=>i).filter(i=>(nodePoint(currentNodes[i])[0]<0?-1:1)===side).sort((a,b)=>projected[a].y-projected[b].y);ids.forEach((i,j)=>{positions[i].x=side<0?width*.225:width*.775;positions[i].y=130+j*(height-245)/Math.max(1,ids.length-1);});}}
  else if(state.group==null){
    positions.forEach((p,i)=>{const w=(labelButtons[i]?.offsetWidth||150)/2+14,h=(labelButtons[i]?.offsetHeight||64)/2+14;p.x=Math.max(w,Math.min(width-w,p.x));p.y=Math.max(105,Math.min(height-95,p.y));});
  }else{
    const obstacles=[];
    if(state.sub!=null)host.querySelectorAll('.aw-relation[data-family="branch"]').forEach(group=>{
      const edge=group.__edge,a=projected[currentNodes.findIndex(n=>n.key===edge?.from)],b=projected[currentNodes.findIndex(n=>n.key===edge?.to)];
      if(!a||!b)return;for(const point of jointGeometry({x:a.x,y:a.y},{x:b.x,y:b.y},'branch').growth||[])obstacles.push({x:point.x,y:point.y,r:84});
    });
    const laid=separateLabels(positions.map((p,i)=>({x:p.x,y:p.y,w:Math.max(150,labelButtons[i]?.offsetWidth||150),h:Math.max(68,labelButtons[i]?.offsetHeight||68),anchor:projected[i],minLead:156})),{left:12,right:Math.max(13,width-12),top:narrow?108:96,bottom:Math.max(97,height-(narrow?116:84))},obstacles,32);
    laid.forEach((p,i)=>{positions[i].x=p.x;positions[i].y=p.y;});
  }
  labelButtons.forEach((b,i)=>{const p=positions[i],anchor=projected[i];b.style.left=`${p.x}px`;b.style.top=`${p.y}px`;b.style.visibility=anchor.visible?'visible':'hidden';anchors[i].setAttribute('d',`M${anchor.x} ${anchor.y} Q${anchor.x} ${p.y} ${p.x} ${p.y}`);anchors[i].style.visibility=anchor.visible?'visible':'hidden';});paintRelations(projected);persist();
 }
 function tick(now){frame=0;if(!alive)return;const dt=last?Math.min(60,now-last):16;last=now;
  if(!motion.paused){clock+=dt; if(transition){transition.elapsed+=dt;const t=Math.min(1,transition.elapsed/transition.duration),e=t*t*t*(t*(t*6-15)+10),arc=Math.sin(Math.PI*t);camera={eye:transition.from.eye.map((v,i)=>v+(transition.to.eye[i]-v)*e+(i===1?arc*2.5:i===0?arc*1.8:0)),target:transition.from.target.map((v,i)=>v+(transition.to.target[i]-v)*e)};if(t===1){const done=transition.complete;transition=null;done?.();}}
   if(morph&&!morph.frozen){morph.elapsed+=dt;if(morph.elapsed>=morph.duration)morph=null;}
   if(orbit){orbit.elapsed+=dt;const a=orbit.elapsed/13000*Math.PI*2;camera.eye=[camera.target[0]+Math.sin(a)*orbit.radius,camera.target[1]+orbit.height,camera.target[2]+Math.cos(a)*orbit.radius];}
   if(tour&&!motion.reduced&&!motion.quiet){tour.elapsed+=dt;if(tour.elapsed>6800){const next=tour.index+1;if(next<tourSteps.length)tourStep(next);else stopTour();}}
   ghosts=ghosts.filter(g=>{g.elapsed+=dt;g.el.style.opacity=String(Math.max(0,1-g.elapsed/650));if(g.elapsed>=650){g.el.remove();return false;}return true;});
  }
  draw();if(!motion.paused&&(transition||(morph&&!morph.frozen)||orbit||tour||ghosts.length))frame=requestAnimationFrame(tick);else last=0;
 }
 function wake(){if(!frame&&alive)frame=requestAnimationFrame(tick);}
 const placeCounts=directions.map((_,g)=>Math.max(1,terrainMembers(entries,g).length)),placePeak=Math.max(...placeCounts);
 renderer=createWorldRenderer(canvas,{mode,narrow,fromMode:previousMode,weights:placeCounts.map(n=>n/placePeak)});const resize=new ResizeObserver(()=>{renderer.resize(scene.clientWidth,scene.clientHeight);draw();});resize.observe(scene);fillLabels(false);draw();wake();
 function zoom(scale){interrupt();camera.eye=camera.eye.map((v,i)=>camera.target[i]+(v-camera.target[i])*scale);const d=Math.hypot(...camera.eye.map((v,i)=>v-camera.target[i]));if(d<3||d>100)camera.eye=camera.eye.map((v,i)=>camera.target[i]+(v-camera.target[i])*(d<3?3/d:100/d));draw();}
 host.querySelectorAll('[data-camera]').forEach(b=>b.onclick=()=>{interrupt();if(b.dataset.camera==='home'){state.group=null;state.sub=null;travel();}else zoom(b.dataset.camera==='in'?.8:1.25);});
 host.querySelector('[data-orbit]').onclick=e=>{interrupt();if(motion.reduced||motion.quiet){host.querySelector('.aw-status').textContent='Für einen Umlauf reduzierte Bewegung und ruhige Ansicht ausschalten.';return;}const delta=camera.eye.map((v,i)=>v-camera.target[i]);orbit={elapsed:Math.atan2(delta[0],delta[2])/Math.PI/2*13000,radius:Math.hypot(delta[0],delta[2]),height:delta[1]};e.currentTarget.setAttribute('aria-pressed','true');wake();};
 function enterRoom(){persist();const go=()=>onView('chapter');if(motion.reduced||motion.quiet||motion.paused){go();return;}const dest=destination();fly({target:dest.target,eye:dest.target.map((v,i)=>v+(dest.eye[i]-v)*.58)},go);}
 host.querySelector('[data-room]').onclick=enterRoom;journey.querySelector('[data-tour-room]').onclick=enterRoom;host.querySelector('[data-net]').onclick=()=>onView('graph');
 viewport.onwheel=e=>{e.preventDefault();zoom(e.deltaY<0?.92:1.09);};
 viewport.onkeydown=e=>{if(e.key==='Escape'){interrupt();draw();return;}if(e.target!==viewport)return;const k=e.key;if(['+','=','-','Home','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(k)){e.preventDefault();interrupt();if(k==='Home'){state.group=null;state.sub=null;fillLabels();camera=destination();}else if(k==='+'||k==='=')zoom(.8);else if(k==='-')zoom(1.25);else{const dx=k==='ArrowLeft'?1:k==='ArrowRight'?-1:0,dy=k==='ArrowUp'?1:k==='ArrowDown'?-1:0;camera.eye[0]+=dx;camera.target[0]+=dx;const axis=mode==='tree'?1:2;camera.eye[axis]+=dy;camera.target[axis]+=dy;}draw();}};
 const distance=()=>{const [a,b]=[...pointers.values()];return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;};
 viewport.onpointerdown=e=>{if(e.target.closest?.('.aw-relation'))return;if(!pointers.size)moved=false;interrupt();pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});pinch=distance();drag={x:e.clientX,y:e.clientY,eye:[...camera.eye],target:[...camera.target]};};
 viewport.onpointermove=e=>{if(!pointers.has(e.pointerId)||!drag)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>7){moved=true;viewport.setPointerCapture(e.pointerId);}if(!moved)return;if(pointers.size===2){const d=distance();if(pinch)zoom(pinch/d);pinch=d;return;}const scale=Math.hypot(...camera.eye.map((v,i)=>v-camera.target[i]))/scene.clientHeight*.58;camera.eye=[...drag.eye];camera.target=[...drag.target];camera.eye[0]-=dx*scale;camera.target[0]-=dx*scale;const axis=mode==='tree'?1:2;camera.eye[axis]+=(mode==='tree'?1:-1)*dy*scale;camera.target[axis]+=(mode==='tree'?1:-1)*dy*scale;draw();};
 const finish=e=>{pointers.delete(e.pointerId);const remaining=[...pointers.values()][0];drag=remaining?{x:remaining.x,y:remaining.y,eye:[...camera.eye],target:[...camera.target]}:null;pinch=0;};viewport.onpointerup=finish;viewport.onpointercancel=finish;
 const onMotion=e=>{motion={...motion,...e.detail};if(motion.reduced||motion.quiet){if(transition){camera=transition.to;const done=transition.complete;transition=null;done?.();}morph=null;orbit=null;ghosts.forEach(g=>g.el.remove());ghosts=[];}last=0;draw();wake();};window.addEventListener('atlas:motionchange',onMotion);
 const onAppearance=()=>{last=0;draw();};window.addEventListener('atlas:appearance',onAppearance);
 return {destroy(){persist();alive=false;cancelAnimationFrame(frame);resize.disconnect();renderer.destroy();window.removeEventListener('atlas:motionchange',onMotion);window.removeEventListener('atlas:appearance',onAppearance);pointers.clear();host.replaceChildren();}};
}
