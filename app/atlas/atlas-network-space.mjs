import { directions, thematicPlacement } from './knowledge-landscape.mjs';
import { explicitlyRelatedMedia } from './atlas-media-associations.mjs';
import { jointForRelation, jointGeometry, safeSourceURL } from './atlas-joints.mjs';

const SVG = 'http://www.w3.org/2000/svg';
const types = {model:'Modell',concept:'Begriff',phenomenon:'Erleben',method:'Methode',exercise:'Übung',practice:'Praxis',source:'Quelle',chapter:'Kapitel',dimension:'Dimension',finding:'Befund',instrument:'Instrument',context:'Kontext',diagnosis:'Einordnung',media:'Medium',path:'Lernpfad'};
const norm = text => String(text || '').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase();
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
const marked = mark => !!(mark?.familiar || mark?.relevant || mark?.interested);
const title = entry => String(entry?.title || 'Unbenannter Eintrag');

/** Traversal may run in either direction; every returned step retains its original edge. */
export function findNetworkPath(from,to,relations) {
  if (from === to) return [];
  const adjacent = new Map();
  for (const edge of relations) for (const [a,b] of [[edge.from,edge.to],[edge.to,edge.from]]) {
    if (!adjacent.has(a)) adjacent.set(a,[]);
    adjacent.get(a).push({id:b,edge});
  }
  const queue=[from], previous=new Map([[from,null]]);
  for (let i=0;i<queue.length;i++) for (const next of adjacent.get(queue[i]) || []) {
    if (previous.has(next.id)) continue;
    previous.set(next.id,{from:queue[i],edge:next.edge});
    if (next.id === to) {
      const result=[];let cursor=to;
      while (cursor !== from) { const step=previous.get(cursor);result.unshift({from:step.from,to:cursor,edge:step.edge});cursor=step.from; }
      return result;
    }
    queue.push(next.id);
  }
  return null;
}

/** Stable, bounded placement. Rectangles never overlap, including long-title nodes. */
export function placeNetworkNodes(entries,centerId) {
  const nodes=[];
  for (let index=0;index<entries.length;index++) {
    const entry=entries[index], center=entry.id===centerId;
    const w=center?244:202, h=center?134:104;
    let x=0,y=0;
    if (index) {
      let placed=false;
      for (let ring=1;!placed;ring++) {
        const count=ring*8, rx=ring*365, ry=ring*245;
        for (let slot=0;slot<count;slot++) {
          const angle=(slot/count*Math.PI*2)-Math.PI/2+(ring%2?.12:0);
          x=Math.round(Math.cos(angle)*rx);y=Math.round(Math.sin(angle)*ry);
          if (nodes.every(other=>Math.abs(x-other.x)>(w+other.w)/2+48 || Math.abs(y-other.y)>(h+other.h)/2+45)) {placed=true;break;}
        }
      }
    }
    nodes.push({entry,id:entry.id,x,y,w,h,center});
  }
  return nodes;
}

export function mountNetworkSpace(host,{entries=[],relations=[],media=[],sources=[],store,state={},personal=false,onSelect=()=>{},onView=()=>{},onMedia=()=>{},onRead=()=>{}}={}) {
  const doc=host.ownerDocument, byId=new Map(entries.map(entry=>[entry.id,entry]));
  const adjacent=new Map();
  for (const edge of relations) if (byId.has(edge.from)&&byId.has(edge.to)) for (const [from,to] of [[edge.from,edge.to],[edge.to,edge.from]]) {
    if (!adjacent.has(from)) adjacent.set(from,[]);adjacent.get(from).push({id:to,edge});
  }
  const key=personal?'spatialPersonal':'spatialGraph';
  const camera=state[key]??={x:0,y:0,zoom:1,limit:6,center:null,calm:false};
  camera.limit=Math.max(4,Number(camera.limit)||8);camera.zoom=clamp(Number(camera.zoom)||1,.24,1.8);
  const viewWindow=doc.defaultView||globalThis;
  const motion={paused:doc.documentElement.classList.contains('atlas-motion-paused'),quiet:doc.documentElement.classList.contains('atlas-quiet'),reduced:!!viewWindow.matchMedia?.('(prefers-reduced-motion: reduce)').matches};
  let layoutFrame=null;
  let flightFrame=null,flight=null,openEdge=null,jointTrigger=null;
  const animations=new Set();
  let disposed=false,nodes=[],anchorIds=new Set(),visibleEdges=[],center,path=null,target=null,focusId=null,drag=null,suppressClick=false;
  const pointers=new Map(), abort=new AbortController(), listeners={signal:abort.signal};
  const make=(tag,className,text)=>{const element=doc.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
  const button=(text,action,className='')=>{const element=make('button',className,text);element.type='button';element.addEventListener('click',action,listeners);return element;};
  const root=make('section','ns-space');root.setAttribute('aria-label',personal?'Persönliche Konstellation':'Beziehungsnetz');
  const header=make('div','ns-header'), heading=make('div','ns-heading');
  heading.append(make('h2','',personal?'Meine Konstellation':'Beziehungsnetz'));
  const stats=make('p','ns-stats');heading.append(stats);header.append(heading);
  const backButton=button('← Zurück',()=>{const previous=camera.history?.at(-1);if(previous&&byId.has(previous))navigate(previous,{back:true});},'ns-back');heading.prepend(backButton);
  const searchToggle=button('Ort oder Weg suchen',()=>{search.hidden=!search.hidden;searchToggle.setAttribute('aria-expanded',String(!search.hidden));if(!search.hidden)input.focus();},'ns-search-toggle');searchToggle.setAttribute('aria-expanded','false');
  const headerTools=make('div','ns-header-tools');headerTools.append(searchToggle);header.append(headerTools);root.append(header);
  const search=make('div','ns-search');search.hidden=true;
  const searchLabel=make('label','','Im gesamten Atlas suchen'), input=make('input');input.type='search';input.placeholder='Begriff, Erleben, Quelle …';input.autocomplete='off';searchLabel.append(input);
  const searchResults=make('div','ns-results');searchResults.setAttribute('aria-live','polite');
  search.append(searchLabel,button('Schließen',()=>{search.hidden=true;searchToggle.setAttribute('aria-expanded','false');searchToggle.focus();},'ns-close'),searchResults);root.append(search);
  const viewport=make('div','ns-viewport');viewport.tabIndex=0;viewport.setAttribute('aria-label','Netzraum. Pfeiltasten verschieben, Plus und Minus zoomen, Pos1 richtet den Blick aus. Die Orte sind mit Tab erreichbar.');
  const world=make('div','ns-world'), svg=doc.createElementNS(SVG,'svg');svg.classList.add('ns-threads');svg.setAttribute('role','group');svg.setAttribute('aria-label','Vorhandene Verbindungen. Mit Enter oder Leertaste auffalten.');
  const nodeLayer=make('div','ns-nodes');world.append(svg,nodeLayer);viewport.append(world);root.append(viewport);
  const caption=make('div','ns-caption');caption.setAttribute('aria-live','polite');
  const context=make('div','ns-context'), captionTitle=make('strong'), captionDetail=make('span');context.append(captionTitle,captionDetail);caption.append(context);root.append(caption);
  const footer=make('div','ns-footer'), controls=make('div','ns-camera-controls');
  controls.append(button('−',()=>zoomAt(camera.zoom/1.2),'ns-zoom'),button('+',()=>zoomAt(camera.zoom*1.2),'ns-zoom'),button('Blick ausrichten',fit));
  controls.children[0].setAttribute('aria-label','Verkleinern');controls.children[1].setAttribute('aria-label','Vergrößern');
  const calmButton=button('Ruhiger Blick',()=>{camera.calm=!camera.calm;motionChange({detail:{}});applyCamera();});calmButton.setAttribute('aria-pressed',String(camera.calm));controls.append(calmButton);
  const more=button('Weitere Nachbarn',()=>{camera.limit+=6;draw();fit();});
  const legend=make('div','ns-legend');
  for(const [mark,label] of [['familiar','Kenne ich'],['relevant','Betrifft mich'],['interested','Interessiert mich']]) legend.append(make('span',`ns-legend-${mark}`,label));
  footer.append(controls,more,legend);root.append(footer);
  const materials=make('div','ns-materials');root.append(materials);
  const jointPanel=make('section','aj-panel');jointPanel.hidden=true;jointPanel.setAttribute('aria-label','Geöffnete Verbindung');root.append(jointPanel);
  host.replaceChildren(root);

  function motionAllowed(){return !motion.paused&&!motion.quiet&&!motion.reduced&&!camera.calm;}
  function stopFlight(){if(flightFrame!==null)viewWindow.cancelAnimationFrame?.(flightFrame);flightFrame=null;flight=null;root.classList.remove('ns-travelling');}
  function cameraEase(progress){
    // Invert the shared on-screen curve cubic-bezier(.77,0,.175,1).
    const sample=(t,a,b)=>3*(1-t)*(1-t)*t*a+3*(1-t)*t*t*b+t*t*t;
    let low=0,high=1,t=.5;for(let i=0;i<12;i++){t=(low+high)/2;if(sample(t,.77,.175)<progress)low=t;else high=t;}
    return sample(t,0,1);
  }
  function navigate(id,{back=false,keyboard=false}={}){
    if(!byId.has(id))return;stopFlight();
    const destination=nodes.find(node=>node.id===id);
    const arrive=(keepFraming=true)=>{if(back){camera.history?.pop();camera.backRequested=true;}camera.arrival=keepFraming?id:null;onSelect(id);};
    // Search can reveal a place outside this world. Frame its actual neighbors on
    // arrival; retaining the old transform would strand that place off screen.
    if(!destination){arrive(false);return;}
    if(id===center?.id){arrive();return;}
    if(!motionAllowed()||keyboard){camera.x=-destination.x*camera.zoom;camera.y=-destination.y*camera.zoom;applyCamera();arrive();return;}
    const zoom=clamp(Math.max(camera.zoom,.88),.24,1.25),start={x:camera.x,y:camera.y,zoom:camera.zoom};
    flight={start,target:{x:-destination.x*zoom,y:-destination.y*zoom,zoom},started:null};root.classList.add('ns-travelling');
    captionTitle.textContent=title(destination.entry);captionDetail.textContent='Annäherung im vorhandenen Netz. Ziehen, Scrollen oder eine Taste unterbricht die Fahrt.';
    const step=now=>{if(disposed||!flight)return;flight.started??=now;const progress=Math.min(1,(now-flight.started)/900),e=cameraEase(progress);
      for(const name of ['x','y','zoom'])camera[name]=flight.start[name]+(flight.target[name]-flight.start[name])*e;
      applyCamera();if(progress<1)flightFrame=viewWindow.requestAnimationFrame(step);else {stopFlight();arrive();}
    };flightFrame=viewWindow.requestAnimationFrame(step);
  }
  const motionChange=event=>{Object.assign(motion,event.detail||{});root.classList.toggle('ns-motion-still',!motionAllowed());if(!motionAllowed()){stopFlight();for(const animation of animations)animation.cancel();animations.clear();}};
  doc.addEventListener('atlas:motionchange',motionChange,listeners);
  root.classList.toggle('ns-motion-still',!motionAllowed());

  function closeJoint({focus=true}={}){jointPanel.hidden=true;root.classList.remove('ns-joint-open');for(const group of svg.children){group.classList.remove('aj-open');group.querySelector('.aj-line')?.setAttribute('d',group.__geometry.path);}for(const animation of animations)animation.cancel();animations.clear();openEdge=null;if(focus&&jointTrigger?.isConnected)jointTrigger.focus({preventScroll:true});}
  function openJoint(edge,trigger,{keyboard=false}={}){
    stopFlight();openEdge=edge;jointTrigger=trigger;const joint=jointForRelation(edge),from=byId.get(edge.from),to=byId.get(edge.to);if(!from||!to)return;
    jointPanel.replaceChildren();jointPanel.hidden=false;root.classList.add('ns-joint-open');jointPanel.dataset.family=joint.family;jointPanel.style.setProperty('--aj-color',joint.color);
    for(const animation of animations)animation.cancel();animations.clear();
    for(const group of svg.children){const active=group.__edge===edge;group.classList.toggle('aj-open',active);group.querySelector('.aj-line')?.setAttribute('d',active?group.__geometry.opened:group.__geometry.path);}
    const heading=make('h3','',joint.label);heading.tabIndex=-1;
    const top=make('div','aj-top');top.append(make('span','aj-family',joint.name),button('Schließen',()=>closeJoint(),'aj-close'));
    const diagram=make('div','aj-diagram');diagram.setAttribute('aria-label','Originalrichtung der Verbindung');
    const preview=doc.createElementNS(SVG,'svg');preview.setAttribute('viewBox','0 0 360 140');preview.setAttribute('aria-hidden','true');
    const smallGeometry=jointGeometry({x:72,y:70},{x:288,y:70},joint.family);
    for(const [d,className] of [[smallGeometry.opened,'aj-diagram-line'],[smallGeometry.ornament,'aj-diagram-ornament']])if(d){const line=doc.createElementNS(SVG,'path');line.setAttribute('d',d);line.classList.add(className);preview.append(line);}
    const marks={hinge:'M174 70 A6 6 0 1 0 186 70 A6 6 0 1 0 174 70',band:'M171 70 Q180 58 189 70 Q180 82 171 70',threshold:'M166 58 V82 M194 58 V82',branch:'M174 78 C180 62 188 64 194 48',seam:'M170 62 V78 M178 66 V74 M186 62 V78',contact:'M172 70 H188',flow:'M166 70 H186 M178 62 L188 70 L178 78'};
    const symbol=doc.createElementNS(SVG,'path');symbol.setAttribute('d',marks[joint.family]||'M174 64 L182 70 L174 76');symbol.classList.add('aj-diagram-symbol');preview.append(symbol);diagram.append(preview);
    for(const [index,entry] of [from,to].entries()){const endpoint=button('',event=>{closeJoint({focus:false});navigate(entry.id,{keyboard:event.detail===0});},`aj-endpoint aj-endpoint-${index}`);endpoint.append(make('small','',index?'Zu diesem Ort':'Von diesem Ort'),make('span','',title(entry)));diagram.append(endpoint);}
    jointPanel.append(top,heading,diagram,make('p','aj-direction-note','Originalrichtung → · kein Kausalitätsnachweis'));
    const meaning=make('details','aj-meaning');meaning.append(make('summary','','Bedeutung & Prüfstand auffalten'));
    if(joint.proposed)meaning.append(make('p','aj-proposed','Vorgeschlagene Beziehung · ursprünglichen Prüfstand beachten.'));
    if(edge.detail)meaning.append(make('p','aj-original-detail',edge.detail));
    meaning.append(make('p','aj-metaphor',joint.note));
    meaning.append(make('p','aj-register',joint.editorial?'Redaktionelle Kante. Sie ordnet den Atlas und ist kein empirischer Beleg.':'Formulierung aus dem vorhandenen Bestand. Reichweite und Quelle bleiben maßgeblich.'));
    meaning.append(make('p','aj-boundary','Nähe ist keine Ursache. Trauma, Neurodivergenz und Persönlichkeit behalten eine eigene Gestalt.'));
    jointPanel.append(meaning);
    const actions=make('div','aj-actions');
    actions.append(button('Beide Orte lesen',()=>{comparison.hidden=!comparison.hidden;},'aj-compare'));
    const comparison=make('div','aj-comparison');comparison.hidden=true;
    for(const entry of [from,to]){const article=make('article');article.append(make('h4','',title(entry)),make('p','',entry.summary||'Zu diesem Ort ist keine Kurzbeschreibung hinterlegt.'),button('Vollständig lesen',()=>onRead(entry.id)));comparison.append(article);}
    jointPanel.append(actions,comparison);
    const origin=make('details','aj-origin'),summary=make('summary','',joint.family==='seam'?'Quellennaht öffnen':'Herkunft öffnen');origin.append(summary);
    const sourceById=new Map(sources.map(source=>[source.id,source]));const attached=(edge.sourceIds||[]).map(id=>sourceById.get(id)).filter(Boolean);
    if(edge.provenance?.title)origin.append(make('p','',edge.provenance.title));
    for(const source of attached){const url=safeSourceURL(source.url),item=url?make('a','',title(source)):make('p','',title(source));if(url){item.href=url;item.target='_blank';item.rel='noopener noreferrer';}origin.append(item);}
    const originalURL=safeSourceURL(edge.provenance?.url);if(originalURL){const link=make('a','','Originalwerk öffnen');link.href=originalURL;link.target='_blank';link.rel='noopener noreferrer';origin.append(link);}
    if(!attached.length&&!edge.provenance?.title)origin.append(make('p','','An dieser Beziehung ist keine einzelne Quellenangabe hinterlegt. Die Herkunft der Orte bleibt im Leser zugänglich.'));
    const technical=make('details','aj-technical');technical.append(make('summary','','Technische Herkunftsdetails'),make('pre','',JSON.stringify(edge,null,2)));origin.append(technical);jointPanel.append(origin);
    actions.append(button(joint.gesture,()=>{if(['seam','contact','threshold'].includes(joint.family)){origin.open=true;summary.focus();}else{comparison.hidden=false;comparison.querySelector('h4')?.focus();}}));
    setCaption(edge.from===center.id?edge.to:edge.from,edge);
    if(motionAllowed()&&!keyboard&&trigger){const pathElement=trigger.querySelector('.aj-line'),geometry=trigger.__geometry;if(pathElement?.animate&&geometry){const animation=pathElement.animate([{d:`path("${geometry.path}")`},{d:`path("${geometry.opened}")`}],{duration:650,easing:'cubic-bezier(.77,0,.175,1)',fill:'forwards'});animations.add(animation);}}
    heading.focus({preventScroll:true});
  }

  function applyCamera() {
    const width=viewport.clientWidth||900,height=viewport.clientHeight||680;
    world.style.transform=`translate(${width/2+camera.x}px,${height/2+camera.y}px) scale(${camera.zoom})`;
    root.dataset.detail=camera.zoom<.48?'far':camera.zoom<.72?'middle':'near';root.classList.toggle('ns-calm',!!camera.calm);
    calmButton.setAttribute('aria-pressed',String(!!camera.calm));
  }
  function zoomAt(next,point) {
    stopFlight();
    const rect=viewport.getBoundingClientRect(),z=clamp(next,.24,1.8),old=camera.zoom;
    const px=point?point.x-rect.left-rect.width/2:0,py=point?point.y-rect.top-rect.height/2:0;
    camera.x=px-(px-camera.x)*z/old;camera.y=py-(py-camera.y)*z/old;camera.zoom=z;applyCamera();
  }
  function fit() {
    stopFlight();
    // A newly mounted room may still be hidden or waiting for its stylesheet.
    if(!nodes.length||viewport.clientWidth<=56||viewport.clientHeight<=180)return false;
    if(viewWindow.getComputedStyle&&viewWindow.getComputedStyle(viewport).position!=='absolute')return false;
    const anchors=nodes.filter(node=>anchorIds.has(node.id));
    const minX=Math.min(...anchors.map(n=>n.x-n.w/2)),maxX=Math.max(...anchors.map(n=>n.x+n.w/2));
    const minY=Math.min(...anchors.map(n=>n.y-n.h/2)),maxY=Math.max(...anchors.map(n=>n.y+n.h/2));
    camera.zoom=clamp(Math.min((viewport.clientWidth-56)/(maxX-minX),(viewport.clientHeight-180)/(maxY-minY),1),.24,1);
    camera.x=-(minX+maxX)/2*camera.zoom;camera.y=-(minY+maxY)/2*camera.zoom-12;
    camera.needsFit=false;world.style.visibility='';applyCamera();return true;
  }
  function queueCameraLayout() {
    if(disposed||layoutFrame!==null)return;
    const update=()=>{layoutFrame=null;if(disposed)return;if(camera.needsFit)fit();else applyCamera();};
    if(viewWindow.requestAnimationFrame)layoutFrame=viewWindow.requestAnimationFrame(update);else update();
  }
  function setCaption(id,hoveredEdge=null) {
    focusId=id;const entry=byId.get(id)||center;if(!entry)return;
    captionTitle.textContent=title(entry);
    const links=hoveredEdge?[hoveredEdge]:visibleEdges.filter(edge=>(edge.from===center.id&&edge.to===id)||(edge.to===center.id&&edge.from===id));
    captionDetail.textContent=links.length?links.map(edge=>`${title(byId.get(edge.from))} → ${edge.label||'steht in Beziehung zu'} → ${title(byId.get(edge.to))}`).join(' · '):id!==center.id?'Keine direkte Verbindung zum Mittelpunkt im vorhandenen Bestand.':path?.length?`${path.length} vorhandene Beziehungen auf dem Weg.`:'Wähle einen Nachbarn: Die vorhandene Beziehung wird hier lesbar.';
    for(const node of nodeLayer.children)node.classList.toggle('ns-in-focus',node.dataset.entry===id);
    for(const group of svg.querySelectorAll('[data-from]')) {
      const active=group.dataset.from===id||group.dataset.to===id;
      group.classList.toggle('ns-edge-focus',active);
      group.classList.toggle('ns-edge-labeled',id!==center.id&&active);
      group.classList.toggle('ns-edge-muted',id!==center.id&&!active);
    }
  }
  function renderSearch() {
    searchResults.replaceChildren();const query=norm(input.value).trim();searchToggle.setAttribute('aria-expanded',String(!search.hidden));
    if(!query){searchResults.append(make('p','','Alle Orte bleiben über ihre Namen und Themen erreichbar.'));return;}
    const matches=entries.filter(entry=>norm([title(entry),...(entry.tags||[])].join(' ')).includes(query));
    searchResults.append(make('p','',`${matches.length} ${matches.length===1?'Ort':'Orte'} gefunden`));
    for(const entry of matches.slice(0,10)) {
      const row=make('div','ns-result');row.append(button(title(entry),event=>navigate(entry.id,{keyboard:event.detail===0})),button('Weg hierher',()=>{state.pathTarget=entry.id;search.hidden=true;draw();fit();},'ns-route-result'));searchResults.append(row);
    }
    if(matches.length>10)searchResults.append(make('p','','Suche genauer, um weitere Orte einzugrenzen.'));
  }
  input.addEventListener('input',renderSearch,listeners);searchToggle.addEventListener('click',()=>{searchToggle.setAttribute('aria-expanded',String(!search.hidden));renderSearch();},listeners);

  function draw() {
    if(disposed)return;
    const marks=entries.filter(entry=>marked(store?.markFor?.(entry.id)));
    center=byId.get(state.selected)||marks[0]||entries.find(entry=>/reizüberlastung|reizuberlastung/i.test(title(entry)))||entries[0];
    if(!center){stats.textContent='Hier sind noch keine Einträge vorhanden.';return;}
    const newCenter=camera.center!==center.id;
    if(newCenter){if(camera.center&&byId.has(camera.center)&&!camera.backRequested)(camera.history??=[]).push(camera.center);camera.backRequested=false;camera.center=center.id;camera.limit=viewport.clientWidth<600?4:8;camera.needsFit=camera.arrival!==center.id;if(camera.needsFit){camera.x=0;camera.y=0;}camera.arrival=null;}
    backButton.hidden=!camera.history?.length;
    target=byId.get(state.pathTarget);path=target?findNetworkPath(center.id,target.id,relations):null;
    const neighbors=[...new Set((adjacent.get(center.id)||[]).map(item=>item.id))];
    const ids=new Set([center.id]);if(path)for(const step of path){ids.add(step.from);ids.add(step.to);}if(target)ids.add(target.id);
    const candidates=personal?[...marks.map(entry=>entry.id),...neighbors]:neighbors;
    const query=norm(state.query).trim();
    const matchesFilter=entry=>(!query||norm([entry.title,entry.summary,...(entry.tags||[])].join(' ')).includes(query))&&(!state.collection||state.collection==='all'||entry.collection===state.collection)&&(!state.kind||state.kind==='all'||entry.kind===state.kind);
    const unique=[...new Set(candidates)].filter(id=>id!==center.id&&matchesFilter(byId.get(id)));
    root.classList.toggle('ns-personal',personal);
    for(const id of unique.slice(0,camera.limit))ids.add(id);
    anchorIds=new Set(ids);
    // Keep the next real connections in the same world, beyond the initial camera.
    // Panning never reaches a decorative graph or an invented relationship.
    if(!personal){
      const continuation=[];
      for(const id of anchorIds)for(const next of adjacent.get(id)||[])if(!ids.has(next.id)&&matchesFilter(byId.get(next.id)))continuation.push(next.id);
      for(const id of [...new Set(continuation)].slice(0,28))ids.add(id);
    }
    const shown=[...ids].map(id=>byId.get(id)).filter(Boolean);nodes=placeNetworkNodes(shown,center.id);
    // Keep visited places fixed while the camera travels. Newly revealed neighbors
    // grow into free positions around the real destination, without replacing data.
    const positions=camera.positions??={},origin=positions[center.id]||{x:0,y:0},occupied=[];
    for(const node of nodes){const saved=positions[node.id];if(saved){node.x=saved.x;node.y=saved.y;occupied.push(node);}}
    for(const node of nodes){if(positions[node.id])continue;let x=node.x+origin.x,y=node.y+origin.y;
      for(let trial=0;occupied.some(other=>Math.abs(x-other.x)<(node.w+other.w)/2+48&&Math.abs(y-other.y)<(node.h+other.h)/2+45);trial++){
        const ring=1+Math.floor(trial/12),angle=(trial%12)/12*Math.PI*2;x=origin.x+Math.cos(angle)*ring*365;y=origin.y+Math.sin(angle)*ring*245;
      }node.x=Math.round(x);node.y=Math.round(y);positions[node.id]={x:node.x,y:node.y};occupied.push(node);
    }
    visibleEdges=relations.filter(edge=>ids.has(edge.from)&&ids.has(edge.to));
    const pathEdges=new Set((path||[]).map(step=>step.edge));
    stats.textContent=`${personal?`${marks.length} persönlich markiert`:`${neighbors.length} direkte Nachbarn`} · ${shown.length} Orte im Raum`;
    more.hidden=camera.limit>=unique.length;more.textContent=personal?'Konstellation erweitern':'Weitere Nachbarn';
    nodeLayer.replaceChildren();svg.replaceChildren();materials.replaceChildren();
    const assigned = explicitlyRelatedMedia(media, center);
    const nodeById=new Map(nodes.map(node=>[node.id,node]));
    // SVG occupies a large fixed coordinate plane; HTML nodes share the same origin.
    svg.setAttribute('viewBox','-12000 -12000 24000 24000');
    const glyphLayer=doc.createElementNS(SVG,'g');glyphLayer.setAttribute('aria-hidden','true');
    for(const edge of visibleEdges) {
      const a=nodeById.get(edge.from),b=nodeById.get(edge.to);if(!a||!b)continue;
      const joint=jointForRelation(edge),geometry=jointGeometry(a,b,joint.family);
      const group=doc.createElementNS(SVG,'g');group.dataset.from=edge.from;group.dataset.to=edge.to;group.dataset.family=joint.family;group.style.setProperty('--aj-color',joint.color);group.__edge=edge;group.__geometry=geometry;
      group.classList.add('ns-edge','aj-joint');if(pathEdges.has(edge))group.classList.add('ns-edge-path');if(joint.proposed)group.classList.add('aj-is-proposed');if(joint.editorial)group.classList.add('aj-is-editorial');group.setAttribute('role','button');group.setAttribute('tabindex','0');group.setAttribute('aria-label',`${title(a.entry)}. ${joint.label}. ${title(b.entry)}. Verbindung auffalten.`);
      group.addEventListener('pointerenter',()=>setCaption(edge.from===center.id?edge.to:edge.from,edge),listeners);
      group.addEventListener('focus',()=>setCaption(edge.from===center.id?edge.to:edge.from,edge),listeners);
      group.addEventListener('click',event=>{if(suppressClick)return;event.stopPropagation();openJoint(edge,group,{keyboard:event.detail===0});},listeners);
      group.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();event.stopPropagation();openJoint(edge,group,{keyboard:true});}},listeners);
      const hit=doc.createElementNS(SVG,'path');hit.setAttribute('d',geometry.path);hit.classList.add('aj-hit');group.append(hit);
      const line=doc.createElementNS(SVG,'path');line.setAttribute('d',geometry.path);line.setAttribute('pathLength','1');line.classList.add('aj-line');group.append(line);
      if(geometry.ornament){const ornament=doc.createElementNS(SVG,'path');ornament.setAttribute('d',geometry.ornament);ornament.setAttribute('pathLength','1');ornament.classList.add('aj-ornament');group.append(ornament);}
      const glyph=doc.createElementNS(SVG,'g');glyph.classList.add('aj-glyph');glyph.setAttribute('transform',`translate(${geometry.midpoint.x},${geometry.midpoint.y}) rotate(${geometry.angle})`);
      const symbol=doc.createElementNS(SVG,joint.family==='hinge'?'circle':'path');if(joint.family==='hinge'){symbol.setAttribute('r','7');symbol.setAttribute('cx','0');symbol.setAttribute('cy','0');}else symbol.setAttribute('d',joint.family==='flow'?'M-9 -5 L0 0 L-9 5':joint.family==='band'?'M-8 0 Q0 -8 8 0 Q0 8 -8 0':'M-4 -4 L4 4 M-4 4 L4 -4');glyph.append(symbol);group.append(glyph);
      const label=doc.createElementNS(SVG,'text');label.setAttribute('x',String(geometry.midpoint.x));label.setAttribute('y',String(geometry.midpoint.y-14));label.textContent=joint.label;group.append(label);svg.append(group);
      // The visible handle must remain above crossing line hit areas. Keyboard
      // access belongs to the original relation group; this is its pointer handle.
      const handle=glyph.cloneNode(true);handle.classList.add('aj-glyph-control');handle.style.setProperty('--aj-color',joint.color);
      const handleHit=doc.createElementNS(SVG,'circle');handleHit.setAttribute('r','16');handleHit.classList.add('aj-glyph-hit');handle.prepend(handleHit);
      handle.addEventListener('pointerenter',()=>setCaption(edge.from===center.id?edge.to:edge.from,edge),listeners);
      handle.addEventListener('click',event=>{if(suppressClick)return;event.stopPropagation();openJoint(edge,group,{keyboard:event.detail===0});},listeners);glyphLayer.append(handle);
    }
    svg.append(glyphLayer);
    for(const node of nodes) {
      const entry=node.entry,mark=store?.markFor?.(entry.id)||{}, kind=entry.kind||'phenomenon';
      const shape=['source','finding'].includes(kind)?'source':['model','concept','dimension','diagnosis'].includes(kind)?'model':['method','exercise','practice','instrument'].includes(kind)?'practice':'experience';
      const element=button('',event=>{if(suppressClick){event.preventDefault();return;}navigate(entry.id,{keyboard:event.detail===0});},`ns-node ns-shape-${shape}${node.center?' ns-center':''}`);
      element.classList.toggle('ns-continuation',!anchorIds.has(entry.id));element.dataset.entry=entry.id;const theme=thematicPlacement(entry)[0]??7;element.style.setProperty('--ns-node-color',['#7cb9e1','#b8a1d2','#da9b94','#88c9b8','#88b4e5','#d4c090','#a9c998','#aaa9cf'][theme]);element.style.cssText+=`left:${node.x-node.w/2}px;top:${node.y-node.h/2}px;width:${node.w}px;height:${node.h}px`;
      const markLabels=[];for(const [name,label]of [['familiar','Kenne ich'],['relevant','Betrifft mich'],['interested','Interessiert mich']])if(mark[name]){element.classList.add(`ns-mark-${name}`);markLabels.push(label);}
      const meta=make('span','ns-node-kind',types[kind]||'Atlasort');element.append(meta,make('span','ns-node-title',title(entry)));
      const groups=thematicPlacement(entry).map(index=>directions[index]?.name).filter(Boolean);
      if(node.center)element.append(make('span','ns-node-context',groups.slice(0,3).join(' · ')));
      else if(personal&&!neighbors.includes(entry.id))element.append(make('span','ns-node-context','Ohne direkte Verbindung'));
      const marksLine=make('span','ns-node-marks',markLabels.join(' · '));if(markLabels.length)element.append(marksLine);
      element.setAttribute('aria-label',`${title(entry)}${markLabels.length?`. ${markLabels.join(', ')}`:''}. ${node.center?'Mittelpunkt':'Ort öffnen'}`);
      element.addEventListener('pointerenter',()=>setCaption(entry.id),listeners);element.addEventListener('focus',()=>{setCaption(entry.id);const box=element.getBoundingClientRect(),area=viewport.getBoundingClientRect();if(box.left<area.left+12||box.right>area.right-12||box.top<area.top+80||box.bottom>area.bottom-135){camera.x=-node.x*camera.zoom;camera.y=-node.y*camera.zoom;applyCamera();}},listeners);
      element.addEventListener('keydown',event=>{
        const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];if(!delta)return;
        const next=nodes.filter(other=>other.id!==node.id&&(other.x-node.x)*delta[0]+(other.y-node.y)*delta[1]>20).sort((a,b)=>{
          const score=other=>Math.hypot(other.x-node.x,other.y-node.y)+Math.abs((other.x-node.x)*delta[1]-(other.y-node.y)*delta[0])*2;
          return score(a)-score(b);
        })[0];if(next){event.preventDefault();event.stopPropagation();[...nodeLayer.children].find(child=>child.dataset.entry===next.id)?.focus({preventScroll:true});}
      },listeners);nodeLayer.append(element);
    }
    caption.querySelectorAll('button,.ns-path-status').forEach(element=>element.remove());
    if(target) {
      const route=make('div','ns-path-status',path===null?`Kein vorhandener Weg zu „${title(target)}“. Die Lücke bleibt sichtbar.`:path.length?`Weg zu „${title(target)}“ · ${path.length} Beziehungen`:'Du bist bereits am Ziel.');
      caption.append(route,button('Weg lösen',()=>{state.pathTarget=null;draw();fit();}));
    }
    if(personal&&!marks.length)caption.append(make('div','ns-path-status','Deine Konstellation beginnt mit einer Markierung im geöffneten Ort. Der Atlas bleibt unverändert.'));
    caption.append(button('Ort lesen',()=>onRead(focusId||center.id),'ns-read'));
    // Only explicit editorial assignments appear here; no global collection or inferred symptom association.
    for(const item of assigned.filter(item=>item.poster||/bild|image/i.test(item.format||'')).slice(0,1)) {
      const preview=button('',()=>onMedia(item),'ns-material');const image=make('img');image.src=item.poster||item.file;image.alt=item.originWork?title(item):(item.alt||title(item));image.loading='lazy';image.addEventListener('error',()=>preview.remove(),{once:true,...listeners});preview.append(image);preview.setAttribute('aria-label',`Bild öffnen: ${title(item)}`);materials.append(preview);
    }

    if(openEdge&&visibleEdges.includes(openEdge)){const trigger=[...svg.children].find(group=>group.__edge===openEdge);openJoint(openEdge,trigger,{keyboard:true});}else {closeJoint({focus:false});setCaption(center.id);}
    if(camera.needsFit){world.style.visibility='hidden';queueCameraLayout();}else applyCamera();
  }

  viewport.addEventListener('wheel',event=>{event.preventDefault();zoomAt(camera.zoom*Math.exp(-event.deltaY*.0014),{x:event.clientX,y:event.clientY});},{passive:false,...listeners});
  viewport.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    stopFlight();
    if(event.target.closest('.aj-joint,.aj-glyph-control'))return;
    if(event.target.closest('button')&&event.pointerType!=='touch')return;
    pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});
    viewport.setPointerCapture(event.pointerId);drag={x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,tapId:event.pointerType==='touch'?event.target.closest('[data-entry]')?.dataset.entry:null,distance:pointers.size===2?pinchDistance():0};if(pointers.size>1)suppressClick=true;root.classList.add('ns-dragging');
  },listeners);
  function pinchDistance(){const values=[...pointers.values()];return values.length===2?Math.hypot(values[0].x-values[1].x,values[0].y-values[1].y):0;}
  viewport.addEventListener('pointermove',event=>{
    if(!pointers.has(event.pointerId))return;pointers.set(event.pointerId,{x:event.clientX,y:event.clientY});if(!drag)return;
    if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>6)suppressClick=true;
    if(pointers.size===2){const distance=pinchDistance();if(drag.distance)zoomAt(camera.zoom*distance/drag.distance,{x:[...pointers.values()].reduce((s,p)=>s+p.x,0)/2,y:[...pointers.values()].reduce((s,p)=>s+p.y,0)/2});drag.distance=distance;}
    else {camera.x+=event.clientX-drag.x;camera.y+=event.clientY-drag.y;applyCamera();}
    drag.x=event.clientX;drag.y=event.clientY;
  },listeners);
  const endDrag=event=>{pointers.delete(event.pointerId);if(!pointers.size){const tap=event.type==='pointerup'&&!suppressClick?drag?.tapId:null;drag=null;root.classList.remove('ns-dragging');if(tap){suppressClick=true;navigate(tap);}setTimeout(()=>{suppressClick=false;},tap?250:0);}else if(drag&&pointers.size===1){const point=[...pointers.values()][0];drag.x=point.x;drag.y=point.y;drag.distance=0;}};
  viewport.addEventListener('pointerup',endDrag,listeners);viewport.addEventListener('pointercancel',endDrag,listeners);
  viewport.addEventListener('keydown',event=>{
    if(event.target!==viewport)return;
    const delta={ArrowLeft:[65,0],ArrowRight:[-65,0],ArrowUp:[0,65],ArrowDown:[0,-65]}[event.key];
    if(delta){event.preventDefault();camera.x+=delta[0];camera.y+=delta[1];applyCamera();}
    else if(['+','=','-','Home'].includes(event.key)){event.preventDefault();if(event.key==='Home')fit();else zoomAt(camera.zoom*(event.key==='-'?1/1.2:1.2));}
  },listeners);
  root.addEventListener('pointerdown',stopFlight,{capture:true,...listeners});
  root.addEventListener('keydown',stopFlight,{capture:true,...listeners});
  root.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!jointPanel.hidden){event.preventDefault();closeJoint();}else if(!search.hidden){search.hidden=true;searchToggle.setAttribute('aria-expanded','false');searchToggle.focus();}}},listeners);
  const observer=globalThis.ResizeObserver?new ResizeObserver(()=>queueCameraLayout()):null;observer?.observe(viewport);
  const unsubscribe=store?.subscribe?.(()=>draw());draw();
  return {destroy(){disposed=true;stopFlight();for(const animation of animations)animation.cancel();animations.clear();if(layoutFrame!==null)viewWindow.cancelAnimationFrame?.(layoutFrame);abort.abort();observer?.disconnect();unsubscribe?.();pointers.clear();host.replaceChildren();}};
}
