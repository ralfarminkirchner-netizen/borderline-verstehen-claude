import { directions, subclusters, thematicPlacement, subclusterPlacement } from './knowledge-landscape.mjs';
import { openAtlasImageViewer } from './atlas-image-viewer.mjs';

// Branches arrange editorial topics. Only supplied edges represent a named relation.
const TAU = Math.PI * 2;
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm = value => String(value ?? '').toLocaleLowerCase('de').normalize('NFD').replace(/\p{Diacritic}/gu, '');
const endId = value => typeof value === 'object' ? value?.id : value;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const union = (a, b) => ({minX:Math.min(a.minX,b.minX),minY:Math.min(a.minY,b.minY),maxX:Math.max(a.maxX,b.maxX),maxY:Math.max(a.maxY,b.maxY)});
const pointBounds = p => ({minX:p.x-12,minY:p.y-12,maxX:p.x+12,maxY:p.y+12});

// These are existing illustrations, not generated portraits or diagnostic pictures.
// A picture's thematic attachment is editorial; it never creates a research relation.
export function collectFractalImages(nodes=[], media=[], contextItems=[]) {
  const pictures=[], seen=new Set(), isImage=value=>/\.(?:png|jpe?g|webp|svg)(?:[?#]|$)/i.test(value||'');
  const add=item=>{if(!item.src||/wissenslandschaft\.png/i.test(item.src)||seen.has(item.src))return;seen.add(item.src);pictures.push(item);};
  for(const raw of [...contextItems,...media]) {
    const src=isImage(raw.file||raw.src)?raw.file||raw.src:isImage(raw.poster)?raw.poster:null;
    if(!src)continue;
    const identity=raw.file||raw.src||raw.poster;
    const canonical=contextItems.find(item=>(item.file||item.src||item.poster)===identity)||raw;
    add({key:`image:${canonical.id||src}`,type:'image',src,title:canonical.title||'Vorhandenes Bild',alt:canonical.alt||canonical.title||'Vorhandenes Bild',material:canonical,
      sourceLabel:canonical.producer||canonical.origin?.title||'Vorhandener Medienbestand',sourceURL:canonical.notebookURL||canonical.notebookUrl||canonical.sourceURL||'',
      note:canonical.provenance||'Vorhandenes Material; thematisch im Atlas verortet.',tags:canonical.tags||[],isPoster:src===raw.poster});
  }
  for(const node of nodes) {
    // Preserve the original heading and image alternative from the source entry.
    const body=String(node.body||node.content||'');
    for(const match of body.matchAll(/!\[([^\]]*)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const src=match[2];if(!isImage(src)||!src.startsWith('assets/fundus/'))continue;
      const headings=[...body.slice(0,match.index).matchAll(/^##\s+(.+)$/gm)];
      add({key:`image:${src}`,type:'image',src,title:headings.at(-1)?.[1]||node.title,alt:match[1]||node.title,node,
        sourceLabel:node.origin?.title||node.collection||'Atlas-Fundus',sourceURL:node.origin?.url||'',
        note:'Redaktionelles Denkbild aus dem vorhandenen Fundus. Kein Messwert und kein vollständiges Kausalmodell.',tags:node.tags||[]});
    }
  }
  return pictures;
}

export function buildFractalLayout(nodes = []) {
  const root = {key:'root',type:'root',title:'Ein Atlas. Viele Zugänge.',x:0,y:0,angle:-Math.PI/2,depth:0,children:[],count:nodes.length};
  const all = [root], leaves = new Map(), groups = directions.map(() => [[],[],[]]);
  for (const node of nodes) {
    const group = Number.isInteger(node.groups?.[0]) && node.groups[0]>=0 && node.groups[0]<8 ? node.groups[0] : thematicPlacement(node)[0];
    const sub = Number.isInteger(node.subcluster) && node.subcluster>=0 && node.subcluster<3 ? node.subcluster : subclusterPlacement(node,group);
    groups[group][sub].push(node);
  }
  function add(parent, props) {
    const p = {...props,parent,children:[],depth:parent.depth+1};
    parent.children.push(p); all.push(p); return p;
  }
  function fork(parent, items, angle, length, level=0) {
    if (!items.length) return;
    if (items.length === 1) {
      const node=items[0], leaf=add(parent,{key:node.id,type:'leaf',node,title:node.title,count:1,angle,x:parent.x+Math.cos(angle)*length,y:parent.y+Math.sin(angle)*length});
      leaves.set(node.id,leaf); return;
    }
    const branch=add(parent,{key:`${parent.key}-b${all.length}`,type:'branch',count:items.length,angle,x:parent.x+Math.cos(angle)*length,y:parent.y+Math.sin(angle)*length});
    const half=Math.ceil(items.length/2), spread=.46*Math.pow(.88,level);
    fork(branch,items.slice(0,half),angle-spread,length*.76,level+1);
    fork(branch,items.slice(half),angle+spread,length*.76,level+1);
  }
  directions.forEach((direction,g) => {
    const angle=(-163+g*146/7)*Math.PI/180;
    const area=add(root,{key:`area-${g}`,type:'area',title:direction.name,subtitle:direction.sub,count:groups[g].flat().length,group:g,angle,x:Math.cos(angle)*570,y:Math.sin(angle)*570});
    subclusters[g].forEach(([title],s) => {
      const subAngle=angle+(s-1)*.20;
      const items=groups[g][s].sort((a,b)=>String(a.title).localeCompare(String(b.title),'de'));
      const sub=add(area,{key:`area-${g}-sub-${s}`,type:'sub',title,count:items.length,group:g,subcluster:s,angle:subAngle,x:area.x+Math.cos(subAngle)*230,y:area.y+Math.sin(subAngle)*230});
      fork(sub,items,subAngle,105);
    });
  });
  function bounds(item) {
    item.bounds=item.children.reduce((box,child)=>union(box,bounds(child)),pointBounds(item));
    return item.bounds;
  }
  bounds(root);
  return {root,all,leaves,areas:root.children};
}

export function anchoredZoom(camera, point, factor, limits={min:.01,max:1000}) {
  const k=clamp(camera.k*factor,limits.min,limits.max);
  return {k,x:point.x-(point.x-camera.x)*k/camera.k,y:point.y-(point.y-camera.y)*k/camera.k};
}

export function mountFractalAtlas(host, {nodes=[],edges=[],sources=[],media=[],notebookContext=null,onSelect=()=>{},onContext=()=>{},onBack=()=>{},state={}}={}) {
  if (!host) throw new TypeError('Ein Ort für die Verzweigungen fehlt.');
  const layout=buildFractalLayout(nodes), callbacks=[];
  let destroyed=false, width=1, height=1, dpr=1, camera={x:0,y:0,k:1}, fitK=1, frame=0, animation=null;
  let selected=state?.selectedId ? layout.leaves.get(state.selectedId) : null, hovered=null, hitTargets=[], activeGroup=layout.all.find(item=>item.key===state?.groupKey&&item.type!=='leaf'&&item.type!=='branch')||layout.root;
  const pictures=collectFractalImages(nodes,media,notebookContext?.all||[]), imageAssets=new Map(), groupImageCounts=new Map();
  for(const picture of pictures) {
    const group=thematicPlacement({title:picture.title,summary:picture.alt,tags:picture.tags})[0], area=layout.areas[group];
    const sibling=groupImageCounts.get(group)||0;groupImageCounts.set(group,sibling+1);
    const angle=area.angle+(sibling%2?-.22:.22), radius=330+Math.floor((sibling+1)/2)*180;
    Object.assign(picture,{parent:area,group,angle,x:Math.cos(angle)*radius,y:Math.sin(angle)*radius});
  }
  let selectedPicture=pictures.find(item=>item.key===state?.selectedImageKey)||null;
  let dragging=false, moved=false, lastPointer=null, pinch=null, searchTimer=null;
  const pointers=new Map(), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const scene=document.createElement('section'); scene.className='fractal-atlas';
  scene.innerHTML=`<canvas class="fractal-canvas" tabindex="0" role="img" aria-label="Verzweigungen des Atlas. Mit Pfeiltasten bewegen, Plus und Minus zoomen. Themen und alle Einträge sind auch über die Suche erreichbar."></canvas>
    <header class="fractal-heading"><span class="fractal-eyebrow">DER ATLAS · EINE WEITERE PERSPEKTIVE</span><h2>Verzweigungen<span>Dem Zusammenhang<br>auf der Spur.</span></h2><p>Themenzuordnungen · Querverbindungen öffnen am Eintrag</p></header>
    <div class="fractal-breadcrumb" aria-label="Themenweg"></div>
    <div class="fractal-tools"><label class="fractal-search-label"><span>Eintrag finden</span><input type="search" placeholder="Welcher Gedanke führt dich weiter?" autocomplete="off" aria-label="Alle Atlas-Einträge durchsuchen"></label><div class="fractal-search-results" hidden></div></div>
    <nav class="fractal-theme-index" aria-label="Acht Themenräume">${directions.map((d,i)=>`<button data-theme="${i}">${esc(d.name)} <span aria-hidden="true">↗</span></button>`).join('')}</nav>
    <div class="fractal-compass" aria-hidden="true"><span>NÄHE</span><i></i><span>ÜBERBLICK</span></div>
    <div class="fractal-controls" role="group" aria-label="Kartenansicht"><button data-fractal="out" aria-label="Herauszoomen">−</button><output class="fractal-zoom" aria-label="Vergrößerung">1×</output><button data-fractal="in" aria-label="Hineinzoomen">+</button><button data-fractal="fit">Gesamter Atlas</button><button data-fractal="back">Zur Karte ↗</button></div>
    <aside class="fractal-selection" hidden></aside>
    <footer class="fractal-caption"><span class="fractal-live" aria-live="polite"></span>${pictures.length?`<details class="fractal-image-index"><summary>${pictures.length} Bildwege</summary><div>${pictures.map((item,i)=>`<button data-picture="${i}">${esc(item.title)} <span>↗</span></button>`).join('')}</div></details>`:''}<details><summary>Wie diese Ansicht entsteht</summary><p>Die acht Themen und ihre Unterthemen folgen der bestehenden redaktionellen Zuordnung. Feinere Zweige ordnen Einträge alphabetisch im Raum. Äste und Bildwege zeigen keine Abstammung, Wirkung oder Ursache. Benannte Querverbindungen stammen aus dem Atlas und öffnen sich am gewählten Eintrag. Bildkreise zeigen vorhandene Materialien; ihre Herkunft bleibt am Bild erreichbar.</p></details><span class="fractal-gesture">Ziehen zum Wandern · Scrollen zum Vertiefen</span></footer>`;
  host.replaceChildren(scene);
  const canvas=scene.querySelector('canvas'), ctx=canvas.getContext('2d'), crumb=scene.querySelector('.fractal-breadcrumb'), panel=scene.querySelector('.fractal-selection');
  const search=scene.querySelector('input'), results=scene.querySelector('.fractal-search-results'), zoomOutput=scene.querySelector('.fractal-zoom'), live=scene.querySelector('.fractal-live');
  const edgeMap=new Map();
  for (const edge of edges) {
    const from=endId(edge.from), to=endId(edge.to);
    if (!layout.leaves.has(from)||!layout.leaves.has(to)) continue;
    for(const id of [from,to]) {if(!edgeMap.has(id))edgeMap.set(id,[]);edgeMap.get(id).push(edge);}
  }
  function listen(target,event,handler,options) {target.addEventListener(event,handler,options);callbacks.push(()=>target.removeEventListener(event,handler,options));}
  const screen = p => ({x:p.x*camera.k+camera.x,y:p.y*camera.k+camera.y});
  const world = p => ({x:(p.x-camera.x)/camera.k,y:(p.y-camera.y)/camera.k});
  const visible = (p,pad=100) => p.x>-pad&&p.y>-pad&&p.x<width+pad&&p.y<height+pad;
  function requestDraw() {if(!frame&&!destroyed)frame=requestAnimationFrame(draw);}
  function aim(target, instant=false) {
    if(reduced.matches||instant){camera=target;animation=null;requestDraw();return;}
    animation={from:{...camera},to:target,start:performance.now(),duration:700};requestDraw();
  }
  function fitBounds(bounds, instant=false, centerBias=0) {
    const horizontal=width<620?26:100, top=width<620?190:190, bottom=width<620?170:105;
    const k=clamp(Math.min((width-horizontal*2)/(bounds.maxX-bounds.minX+70),(height-top-bottom)/(bounds.maxY-bounds.minY+50)),fitK*.55,fitK*512);
    aim({k,x:width/2-(bounds.minX+bounds.maxX)*.5*k,y:top+(height-top-bottom)/2-(bounds.minY+bounds.maxY)*.5*k+centerBias},instant);
  }
  function groupPath(item) {const path=[];for(let p=item;p;p=p.parent)if(p.type!=='branch')path.unshift(p);return path;}
  function renderCrumb(item=activeGroup) {
    const path=groupPath(item).filter(p=>p.type!=='leaf');
    crumb.innerHTML=path.map((p,i)=>`<button data-path="${i}">${esc(p.type==='root'?'Atlas':p.title)}</button>`).join('<span aria-hidden="true">/</span>');
    crumb.querySelectorAll('button').forEach((button,i)=>button.addEventListener('click',()=>navigate(path[i])));
    scene.classList.toggle('fractal-deep',item.type!=='root');
  }
  function navigate(item) {
    selected=null;selectedPicture=null;panel.hidden=true;activeGroup=item;renderCrumb(item);fitBounds(item.bounds);
    live.textContent=item.type==='root'?`${nodes.length.toLocaleString('de')} Einträge · acht Themenräume`:`${item.title} · ${item.count.toLocaleString('de')} Einträge`;
  }
  function materialFor(node) {try{return notebookContext?.forNode?.(node)||[];}catch{return [];}}
  function showPicture(picture,travel=true) {
    selected=null;selectedPicture=picture;activeGroup=picture.parent;renderCrumb(activeGroup);panel.hidden=false;
    panel.innerHTML=`<button class="fractal-selection-close" aria-label="Bildvorschau schließen">×</button><span class="fractal-eyebrow">${picture.isPoster?'VIDEOPOSTER':'BILDWEG'} · ${esc(activeGroup.title)}</span><h3>${esc(picture.title)}</h3><p class="fractal-picture-origin">${esc(picture.sourceLabel)}</p><p>${esc(picture.note)}</p><div class="fractal-selection-actions"><button data-enlarge>Bild groß ansehen ↗</button><button data-picture-context>${picture.node?'Einordnung im Fundus':'Material & Einordnung'} ↗</button>${/^https?:\/\//i.test(picture.sourceURL)?`<a href="${esc(picture.sourceURL)}" target="_blank" rel="noopener noreferrer">Herkunft ↗</a>`:''}</div>`;
    const enlarge=panel.querySelector('[data-enlarge]');
    enlarge.onclick=()=>openAtlasImageViewer({src:picture.src,alt:picture.alt,title:picture.title,sourceLabel:picture.sourceLabel,sourceURL:picture.sourceURL,trigger:enlarge});
    panel.querySelector('[data-picture-context]').onclick=()=>picture.node?onSelect(picture.node):onContext(null,picture.material?.id);
    panel.querySelector('.fractal-selection-close').onclick=()=>{selectedPicture=null;panel.hidden=true;canvas.focus({preventScroll:true});requestDraw();};
    live.textContent=`${picture.title} · ${picture.isPoster?'vorhandenes Videoposter':'vorhandenes Bild'} · redaktioneller Themenweg`;
    if(travel){const k=clamp(fitK*8,fitK,fitK*512);aim({k,x:width*(width<620?.5:.37)-picture.x*k,y:height*(width<620?.36:.47)-picture.y*k});}requestDraw();
  }
  function showSelection(leaf, open=false) {
    if(!leaf)return;
    selected=leaf;selectedPicture=null;activeGroup=leaf.parent;while(activeGroup.type==='branch')activeGroup=activeGroup.parent;
    renderCrumb(leaf);const materials=materialFor(leaf.node), links=edgeMap.get(leaf.key)||[];
    const sourceCount=(leaf.node.sourceIds||[]).filter(id=>sources.some(s=>s.id===id)).length;
    panel.hidden=false;
    panel.innerHTML=`<button class="fractal-selection-close" aria-label="Eintragsvorschau schließen">×</button><span class="fractal-eyebrow">${esc(directions[leaf.parent.group??activeGroup.group]?.name||leaf.node.collection)}</span><h3>${esc(leaf.title)}</h3><p>${esc(String(leaf.node.summary||'').slice(0,220))}</p><span class="fractal-selection-meta">${links.length} benannte Verbindungen${sourceCount?` · ${sourceCount} Quellen`:''}</span><div class="fractal-selection-actions"><button data-read>Eintrag öffnen ↗</button>${materials.length?`<button data-material>Material & Medien · ${materials.length} ↗</button>`:''}</div>${materials.length?`<div class="fractal-materials">${materials.slice(0,3).map((item,i)=>`<button data-material-index="${i}"><span>${esc(item.format||'Material')}</span>${esc(item.title)} ↗</button>`).join('')}</div>`:''}`;
    panel.querySelector('.fractal-selection-close').onclick=()=>{selected=null;panel.hidden=true;canvas.focus({preventScroll:true});requestDraw();};
    panel.querySelector('[data-read]').onclick=()=>onSelect(leaf.node);
    panel.querySelector('[data-material]')?.addEventListener('click',()=>onContext(leaf.node));
    panel.querySelectorAll('[data-material-index]').forEach(button=>button.onclick=()=>onContext(leaf.node,materials[Number(button.dataset.materialIndex)].id));
    live.textContent=`${leaf.title} · ${links.length} benannte Verbindungen`;
    requestDraw();if(open)onSelect(leaf.node);
  }
  function focus(id) {
    const leaf=layout.leaves.get(typeof id==='object'?id?.id:id);if(!leaf)return false;
    showSelection(leaf);const k=clamp(fitK*150,fitK,fitK*512);
    aim({k,x:width*(width<620?.5:.43)-leaf.x*k,y:height*.48-leaf.y*k});return true;
  }
  function bezier(item) {
    const a=screen(item.parent), b=screen(item), length=Math.hypot(b.x-a.x,b.y-a.y);
    const pa=item.parent.type==='root'?-Math.PI/2:item.parent.angle;
    ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+Math.cos(pa)*length*.52,a.y+Math.sin(pa)*length*.52,b.x-Math.cos(item.angle)*length*.35,b.y-Math.sin(item.angle)*length*.35,b.x,b.y);
  }
  function wrapText(text,maxWidth,font) {
    ctx.font=font;const words=String(text).split(/\s+/), lines=[];let line='';
    for(const word of words){const candidate=line?`${line} ${word}`:word;if(line&&ctx.measureText(candidate).width>maxWidth){lines.push(line);line=word;}else line=candidate;}if(line)lines.push(line);return lines;
  }
  function updateDepth(){scene.classList.toggle('fractal-deep',camera.k>fitK*1.6||activeGroup.type!=='root'||!!selected||!!selectedPicture);}
  function draw(now) {
    frame=0;if(destroyed)return;
    if(animation){const t=clamp((now-animation.start)/animation.duration,0,1), eased=1-Math.pow(1-t,4);camera={x:animation.from.x+(animation.to.x-animation.from.x)*eased,y:animation.from.y+(animation.to.y-animation.from.y)*eased,k:Math.exp(Math.log(animation.from.k)+(Math.log(animation.to.k)-Math.log(animation.from.k))*eased)};if(t>=1)animation=null;}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
    const glow=ctx.createRadialGradient(width*.5,height*.55,0,width*.5,height*.5,Math.max(width,height)*.8);glow.addColorStop(0,'#164d4c');glow.addColorStop(.52,'#09373b');glow.addColorStop(1,'#04292e');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
    // Fine stationary texture remains sharp at every camera scale.
    ctx.fillStyle='rgba(224,211,166,.075)';for(let i=0;i<150;i++){const x=(i*137.51)%width,y=(i*i*19.73)%height;ctx.fillRect(x,y,1,1);}
    updateDepth();
    const selectedPath=new Set();for(let p=selected;p?.parent;p=p.parent)selectedPath.add(p);
    const hoveredPath=new Set();for(let p=hovered;p?.parent;p=p.parent)hoveredPath.add(p);
    hitTargets=[];
    for(const item of layout.all){
      if(!item.parent)continue;
      const a=screen(item.parent), b=screen(item), box=item.bounds;
      if((Math.max(a.x,b.x)<-100||Math.min(a.x,b.x)>width+100||Math.max(a.y,b.y)<-100||Math.min(a.y,b.y)>height+100)&&!selectedPath.has(item))continue;
      const length=Math.hypot(b.x-a.x,b.y-a.y);if(length<.5)continue;
      const highlighted=selectedPath.has(item), lit=highlighted||hoveredPath.has(item);
      ctx.beginPath();bezier(item);
      ctx.lineWidth=clamp((item.type==='area'?6:item.type==='sub'?3.6:Math.sqrt(item.count)*.4)*camera.k,.45,item.type==='area'?20:10);
      ctx.strokeStyle=highlighted?'#d8aa7f':lit?'#ded6b6':item.type==='area'?'#7eaa96':item.type==='sub'?'#6c9d8b':'rgba(129,174,147,.63)';ctx.lineCap='round';ctx.stroke();
      if(highlighted&&!reduced.matches){ctx.beginPath();bezier(item);ctx.strokeStyle='rgba(255,228,178,.6)';ctx.lineWidth=1.1;ctx.setLineDash([1,22]);ctx.lineDashOffset=-now*.013;ctx.stroke();ctx.setLineDash([]);}
      if(item.type==='leaf'&&visible(b,30)){
        const r=clamp(3.9*camera.k,1.4,14);ctx.save();ctx.translate(b.x,b.y);ctx.rotate(item.angle);ctx.beginPath();ctx.ellipse(0,0,r*1.65,r*.72,0,0,TAU);ctx.fillStyle=lit?'#e0b085':camera.k>fitK*8?'#a6b59a':'#729b82';ctx.fill();ctx.strokeStyle='rgba(234,223,191,.5)';ctx.lineWidth=.6;ctx.stroke();ctx.restore();
        if(r>3.5)hitTargets.push({item,x:b.x,y:b.y,r:Math.max(12,r*1.65),priority:2});
      }
    }
    if(selected){
      const from=screen(selected), links=edgeMap.get(selected.key)||[];
      ctx.save();for(const edge of links){const other=layout.leaves.get(endId(edge.from)===selected.key?endId(edge.to):endId(edge.from)), to=screen(other);if(!visible(from)&&!visible(to))continue;
        ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.quadraticCurveTo((from.x+to.x)/2,(from.y+to.y)/2-Math.min(160,Math.abs(from.x-to.x)*.2+50),to.x,to.y);ctx.strokeStyle='rgba(226,174,126,.65)';ctx.lineWidth=1.1;ctx.setLineDash([5,6]);ctx.stroke();ctx.setLineDash([]);
        if(visible(to)){ctx.beginPath();ctx.arc(to.x,to.y,7,0,TAU);ctx.strokeStyle='#e9ba8c';ctx.stroke();}
        if(visible(from)&&visible(to)&&Math.hypot(to.x-from.x,to.y-from.y)>130){const text=String(edge.label||edge.relation||'Benannte Verbindung'),font='12px "Manrope", sans-serif',lines=wrapText(text,Math.min(230,width-48),font),x=(from.x+to.x)/2,y=(from.y+to.y)/2-25,w=Math.max(...lines.map(line=>ctx.measureText(line).width));if(x-w/2>=16&&x+w/2<=width-16&&y>=20&&y+lines.length*16<=height-20){ctx.font=font;ctx.fillStyle='#ead0ad';ctx.textAlign='center';lines.forEach((line,i)=>ctx.fillText(line,x,y+i*16));}}
      }ctx.restore();
    }
    const occupied=[], labelQueue=[];
    for(const picture of pictures) {
      const p=screen(picture), r=clamp(68*camera.k,width<620?15:23,width<620?110:180);
      if(!visible(p,r+60))continue;
      let asset=imageAssets.get(picture.src);
      if(!asset){asset=new Image();asset.decoding='async';asset.onload=requestDraw;asset.onerror=requestDraw;imageAssets.set(picture.src,asset);asset.src=picture.src;}
      const chosen=picture===selectedPicture, parent=screen(picture.parent);
      ctx.save();ctx.beginPath();ctx.moveTo(parent.x,parent.y);ctx.quadraticCurveTo(p.x,parent.y,p.x,p.y);ctx.strokeStyle=chosen?'#d8aa7f':'rgba(148,179,151,.5)';ctx.lineWidth=chosen?1.4:.8;ctx.stroke();
      ctx.shadowColor='#001e25';ctx.shadowBlur=chosen?28:16;ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.fillStyle='#eee9d7';ctx.fill();ctx.shadowBlur=0;
      // Fit the entire original inside the circle: no crop can remove a diagram's caveat.
      if(asset.complete&&asset.naturalWidth){const diagonal=Math.hypot(asset.naturalWidth,asset.naturalHeight),w=2*(r-3)*asset.naturalWidth/diagonal,h=2*(r-3)*asset.naturalHeight/diagonal;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(asset,p.x-w/2,p.y-h/2,w,h);}
      ctx.beginPath();ctx.arc(p.x,p.y,r+2,0,TAU);ctx.strokeStyle=chosen?'#edc69b':'#9bac8c';ctx.lineWidth=chosen?2:1;ctx.stroke();
      if(picture.isPoster){ctx.beginPath();ctx.arc(p.x+r*.6,p.y+r*.6,11,0,TAU);ctx.fillStyle='#07383a';ctx.fill();ctx.fillStyle='#ead4ad';ctx.font='11px sans-serif';ctx.textAlign='center';ctx.fillText('▶',p.x+r*.6+1,p.y+r*.6+4);}
      if(camera.k>fitK*2.5||chosen||picture===hovered){const lines=wrapText(picture.title,width<620?180:230,'12px "Manrope", sans-serif');ctx.shadowColor='#02272d';ctx.shadowBlur=8;ctx.textAlign='center';ctx.fillStyle='#eee9d1';lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,p.x,p.y+r+22+i*16));}
      ctx.restore();hitTargets.push({item:picture,x:p.x,y:p.y,r:r+6,priority:6});occupied.push({x:p.x-r-8,y:p.y-r-8,w:r*2+16,h:r*2+32});
    }
    for(const item of layout.all){
      const p=screen(item);if(!visible(p,60))continue;
      let inActive=activeGroup.type==='root';for(let ancestor=item;ancestor&&!inActive;ancestor=ancestor.parent)inActive=ancestor===activeGroup;
      if(!inActive&&(item.type==='area'||item.type==='sub'))continue;
      if(item.type==='area'&&camera.k<fitK*5&&(width>=620||camera.k>fitK*2.2))labelQueue.push({item,p,rank:0});
      if(item.type==='sub'&&camera.k>fitK*1.8&&camera.k<fitK*26)labelQueue.push({item,p,rank:1});
      if(item.type==='leaf'&&(camera.k>fitK*14||item===selected||item===hovered))labelQueue.push({item,p,rank:item===selected?-2:item===hovered?-1:2});
    }
    labelQueue.sort((a,b)=>a.rank-b.rank);
    for(const {item,p} of labelQueue){
      const isLeaf=item.type==='leaf', size=isLeaf?clamp(12+Math.log2(camera.k/fitK/14)*1.4,12,20):item.type==='area'?clamp(width/70,14,21):16;
      const font=`${isLeaf?'400':'500'} ${size}px ${isLeaf?'"Manrope", sans-serif':'"Newsreader", Georgia, serif'}`;
      const maxWidth=isLeaf?220:item.type==='area'?150:200, lines=wrapText(item.title,maxWidth,font), lineHeight=size*1.2;
      const textW=Math.min(maxWidth,Math.max(...lines.map(line=>ctx.measureText(line).width)))+18,textH=Math.min(lines.length,3)*lineHeight+10;
      let x=p.x+14, y=p.y-textH*.5;
      if(!isLeaf){x=p.x-textW*.5;y=p.y+(item.angle>-Math.PI/2?12:-textH-10);}
      if(item.type==='area'){const anchor=screen({x:item.x*1.4,y:item.y*1.4});x=anchor.x-textW*.5+(item.group===3?-30:item.group===4?30:0);y=anchor.y-textH*.5;}
      if(item.type!=='area')x=clamp(x,12,Math.max(12,width-textW-12));
      const box={x,y,w:textW,h:textH+(isLeaf?0:17)};
      if(item.type!=='area'&&item!==selected&&item!==hovered&&occupied.some(b=>x<b.x+b.w+5&&x+textW>b.x-5&&y<b.y+b.h+5&&y+box.h>b.y-5))continue;
      occupied.push(box);ctx.save();ctx.shadowColor='#02272d';ctx.shadowBlur=9;ctx.shadowOffsetY=1;
      ctx.font=font;ctx.textAlign='left';ctx.textBaseline='top';ctx.fillStyle=item===selected?'#f1c797':'#eee9d1';lines.slice(0,3).forEach((line,i)=>ctx.fillText(line,x+6,y+5+i*lineHeight));
      if(!isLeaf){ctx.font='10px "Manrope", sans-serif';ctx.fillStyle='#a9bdad';ctx.fillText(`${item.count.toLocaleString('de')} Einträge  ↗`,x+6,y+textH+2);}
      ctx.restore();
      hitTargets.push({item,x:x+textW/2,y:y+box.h/2,w:textW+10,h:box.h+10,priority:isLeaf?4:3});
    }
    const origin=screen(layout.root);
    if(visible(origin)&&camera.k<fitK*4){ctx.fillStyle='#d3b58d';ctx.beginPath();ctx.arc(origin.x,origin.y,5,0,TAU);ctx.fill();}
    zoomOutput.value=`${(camera.k/fitK).toLocaleString('de',{maximumFractionDigits:camera.k/fitK<10?1:0})}×`;
    if(animation||(selected&&!reduced.matches))requestDraw();
  }
  function resize() {
    const rect=scene.getBoundingClientRect(), old={width,height,k:fitK};width=Math.max(1,rect.width);height=Math.max(1,rect.height);dpr=Math.min(3,Math.max(1,devicePixelRatio||1));
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    const bounds=layout.root.bounds;fitK=Math.max(.01,Math.min((width-(width<620?48:160))/(bounds.maxX-bounds.minX+100),(height-(width<620?330:260))/(bounds.maxY-bounds.minY+80)));
    if(old.width===1){if(state?.camera&&[state.camera.x,state.camera.y,state.camera.k].every(Number.isFinite)&&state.camera.k>0){camera={x:state.camera.x,y:state.camera.y,k:clamp(state.camera.k,fitK*.55,fitK*512)};requestDraw();}else fitBounds(bounds,true);}
    else {const middle=world({x:old.width/2,y:old.height/2}),k=camera.k*fitK/old.k;camera={k,x:width/2-middle.x*k,y:height/2-middle.y*k};requestDraw();}
    updateDepth();
  }
  function zoom(factor,point={x:width/2,y:height/2}) {animation=null;camera=anchoredZoom(camera,point,factor,{min:fitK*.55,max:fitK*512});requestDraw();}
  const localPoint=event=>{const rect=canvas.getBoundingClientRect();return{x:event.clientX-rect.left,y:event.clientY-rect.top};};
  function hit(point){return hitTargets.filter(t=>t.w?Math.abs(t.x-point.x)<t.w/2&&Math.abs(t.y-point.y)<t.h/2:Math.hypot(t.x-point.x,t.y-point.y)<t.r).sort((a,b)=>b.priority-a.priority)[0]?.item||null;}
  listen(canvas,'wheel',event=>{event.preventDefault();const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?height:1);zoom(Math.exp(-clamp(pixels,-200,200)*.003),localPoint(event));},{passive:false});
  listen(canvas,'pointerdown',event=>{if(event.button!==undefined&&event.button!==0)return;canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);const p=localPoint(event);pointers.set(event.pointerId,p);animation=null;dragging=true;if(pointers.size===1){moved=false;lastPointer=p;}else moved=true;canvas.classList.add('is-grabbing');if(pointers.size===2){const[a,b]=[...pointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),mid:{x:(a.x+b.x)/2,y:(a.y+b.y)/2}};}});
  listen(canvas,'pointermove',event=>{const p=localPoint(event);if(!pointers.has(event.pointerId)){const next=hit(p);if(next!==hovered){hovered=next;canvas.style.cursor=next?'pointer':'grab';requestDraw();}return;}
    const prior=pointers.get(event.pointerId);pointers.set(event.pointerId,p);
    if(pointers.size>=2){const[a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),mid={x:(a.x+b.x)/2,y:(a.y+b.y)/2};if(pinch){zoom(distance/Math.max(1,pinch.distance),pinch.mid);camera.x+=mid.x-pinch.mid.x;camera.y+=mid.y-pinch.mid.y;}pinch={distance,mid};moved=true;requestDraw();}
    else{const dx=p.x-prior.x,dy=p.y-prior.y;camera.x+=dx;camera.y+=dy;if(Math.hypot(p.x-lastPointer.x,p.y-lastPointer.y)>5)moved=true;requestDraw();}
  });
  function pointerEnd(event){if(!pointers.has(event.pointerId))return;const p=localPoint(event), wasPinch=!!pinch;pointers.delete(event.pointerId);if(pointers.size<2)pinch=null;if(!pointers.size){dragging=false;canvas.classList.remove('is-grabbing');if(!moved&&!wasPinch){const item=hit(p);if(item?.type==='leaf')showSelection(item,true);else if(item?.type==='image')showPicture(item);else if(item)navigate(item);}}else{lastPointer=[...pointers.values()][0];moved=true;}}
  listen(canvas,'pointerup',pointerEnd);listen(canvas,'pointercancel',event=>{pointers.delete(event.pointerId);pinch=null;dragging=pointers.size>0;moved=true;if(dragging)lastPointer=[...pointers.values()][0];else canvas.classList.remove('is-grabbing');});
  listen(canvas,'dblclick',event=>{event.preventDefault();zoom(2,localPoint(event));});
  listen(canvas,'keydown',event=>{let handled=true;if(event.key.startsWith('Arrow'))animation=null;switch(event.key){case '+':case '=':zoom(1.6);break;case '-':case '_':zoom(1/1.6);break;case 'ArrowLeft':camera.x+=60;requestDraw();break;case 'ArrowRight':camera.x-=60;requestDraw();break;case 'ArrowUp':camera.y+=60;requestDraw();break;case 'ArrowDown':camera.y-=60;requestDraw();break;case 'Home':navigate(layout.root);break;case 'Escape':selected=null;selectedPicture=null;panel.hidden=true;results.hidden=true;requestDraw();break;default:handled=false;}if(handled)event.preventDefault();});
  scene.querySelectorAll('[data-fractal]').forEach(button=>listen(button,'click',()=>{const action=button.dataset.fractal;if(action==='in')zoom(1.8);if(action==='out')zoom(1/1.8);if(action==='fit')navigate(layout.root);if(action==='back')onBack();}));
  scene.querySelectorAll('[data-theme]').forEach(button=>listen(button,'click',()=>navigate(layout.areas[Number(button.dataset.theme)])));
  scene.querySelectorAll('[data-picture]').forEach(button=>listen(button,'click',()=>{button.closest('details').open=false;showPicture(pictures[Number(button.dataset.picture)]);}));
  function renderResults(){const query=norm(search.value).trim();if(!query){results.hidden=true;return;}const matches=nodes.filter(n=>norm(`${n.title} ${n.collection} ${(n.tags||[]).join(' ')}`).includes(query));results.innerHTML=`<span>${matches.length.toLocaleString('de')} passende Einträge${matches.length>40?' · Suche weiter eingrenzen':''}</span>${matches.slice(0,40).map((node,i)=>`<button data-result="${i}"><strong>${esc(node.title)}</strong><small>${esc(node.collection)}</small></button>`).join('')}`;results.hidden=false;results.querySelectorAll('button').forEach((button,i)=>button.onclick=()=>{focus(matches[i].id);results.hidden=true;});}
  listen(search,'input',()=>{clearTimeout(searchTimer);searchTimer=setTimeout(renderResults,100);});
  listen(search,'keydown',event=>{if(event.key==='Escape')results.hidden=true;if(event.key==='ArrowDown'){event.preventDefault();results.querySelector('button')?.focus();}if(event.key==='Enter')results.querySelector('button')?.click();});
  const observer=new ResizeObserver(resize);observer.observe(scene);listen(reduced,'change',()=>{if(reduced.matches&&animation){camera={...animation.to};animation=null;}requestDraw();});
  renderCrumb(activeGroup);live.textContent=activeGroup.type==='root'?`${nodes.length.toLocaleString('de')} Einträge · acht Themenräume`:`${activeGroup.title} · ${activeGroup.count.toLocaleString('de')} Einträge`;resize();if(selected)showSelection(selected);else if(selectedPicture)showPicture(selectedPicture,false);
  return {focus,snapshot:()=>({camera:{...camera},selectedId:selected?.key||null,selectedImageKey:selectedPicture?.key||null,groupKey:activeGroup?.key||'root',zoom:camera.k/fitK,entryCount:layout.leaves.size,imageCount:pictures.length}),destroy(){destroyed=true;cancelAnimationFrame(frame);clearTimeout(searchTimer);observer.disconnect();callbacks.forEach(remove=>remove());for(const asset of imageAssets.values())asset.onload=asset.onerror=null;scene.remove();}};
}
