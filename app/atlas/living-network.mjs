/* Editorial geography, actual graph. A drawn fibre always joins two supplied nodes. */
export const NETWORK_GROUPS = Object.freeze([
  {name:'Bindung & Beziehung',x:760,y:300,color:'#cba583',angle:-.28,length:410,width:94,bow:-58},
  {name:'Selbst & Persönlichkeit',x:1090,y:210,color:'#d5b5a1',angle:.46,length:330,width:67,bow:43},
  {name:'Trauma & Geschichte',x:450,y:530,color:'#b8ad9e',angle:-.38,length:520,width:122,bow:-64},
  {name:'Körper & Regulation',x:850,y:510,color:'#a7bca7',angle:.57,length:420,width:89,bow:50},
  {name:'Neurodivergenz & Alltag',x:1170,y:510,color:'#a1b9bc',angle:1.13,length:355,width:84,bow:-42},
  {name:'Wahrnehmen & Erleben',x:1180,y:340,color:'#e4d4b6',angle:-.52,length:270,width:62,bow:-30},
  {name:'Schutz & Handlungsspielraum',x:1000,y:720,color:'#a6b99a',angle:-.12,length:490,width:66,bow:-39},
  {name:'Modelle & Forschung',x:650,y:730,color:'#b9b8ae',angle:.16,length:415,width:63,bow:-42}
].map(Object.freeze));

const WIDTH=1400, HEIGHT=850, MAX_EDGES=700, FRAME_MS=1000/30;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=value=>{let h=2166136261;for(const c of String(value??'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const unit=(key,salt)=>hash(`${key}|${salt}`)/4294967295;
const endpoint=value=>value&&typeof value==='object'?value.id:value;
const rgba=(hex,a)=>{const n=parseInt(hex.slice(1),16);return `rgba(${n>>16},${n>>8&255},${n&255},${a})`;};
const fits=node=>node.matches!==false&&node.visible!==false&&node.filtered!==true&&node.dimmed!==true;
const titleOf=node=>String(node.title||node.name||'').trim();
const humanTitle=title=>!!title&&!/^[a-f\d]{8}-[a-f\d-]{20,}$/i.test(title);

// Thumbnails belong to the media record itself. They are never borrowed to
// imply that an illustration is evidence for a neighbouring phenomenon.
export function networkImageFor(node){
  const medium=node?.media;
  if(!medium)return null;
  const src=[medium.poster,medium.file].find(value=>typeof value==='string'&&/^assets\/[\w./-]+\.(?:png|jpe?g|webp|svg)$/i.test(value)&&!value.includes('..')&&!value.includes('wissenslandschaft'));
  return src?{src,title:medium.title||titleOf(node),credit:medium.producer||'Atlas-Medienbestand'}:null;
}

export function atlasSymbolFor(node){
  if(!node||!humanTitle(titleOf(node))||networkImageFor(node))return null;
  const text=titleOf(node).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  if(/gerausch|horen|larm|stimme/.test(text))return 'Ohr';
  if(/licht|helligkeit/.test(text))return 'Licht';
  if(/atem|atmen/.test(text))return 'Atem';
  if(/pause|unterbrechen|stopp/.test(text))return 'Pause';
  if(/bindung|beziehung|nahe|distanz|verlassen|zuruckweis/.test(text))return 'Bindung';
  if(/grenz|sicher|schutz|handlungsspielraum/.test(text))return 'Schutz';
  return ['Bindung','Selbst','Geschichte','Körper','Vielfalt','Wahrnehmen','Schutz','Forschung'][nodeGroups(node)[0]];
}

// Original Atlas line drawings: reading aids, without a diagnostic meaning.
const SYMBOL_PATHS=Object.freeze({
  Bindung:'M-13-9a6 6 0 1 0 0-12a6 6 0 1 0 0 12 M13-9a6 6 0 1 0 0-12a6 6 0 1 0 0 12 M-25 17Q-25-5-13-5Q-3-5-2 11 M25 17Q25-5 13-5Q3-5 2 11 M-17 20Q-7 31 0 15Q7 0 17 10',
  Selbst:'M-3-24C-24-24-24 11-12 22 M-3-24C20-24 24-5 15 5L18 10L10 12L9 25 M-8-13Q5-19 8-8Q10-2 3 4Q-7 9-4 23 M-24-6Q-17-10-13-5 M20-17L26-22 M21-10L29-10',
  Geschichte:'M-24 19Q-11 8-4-8Q5-25 23-20 M-23 11Q-15 6-12-5 M-15 23Q-6 17-4 8 M-5-6Q-11-17-21-17 M5-17Q7-6 19-6 M-16 3Q-25-2-26-10 M3-22Q-2-28-10-27',
  Körper:'M0-15a6 6 0 1 0 0-12a6 6 0 1 0 0 12 M-7-9Q-10 3-7 12L-10 27 M7-9Q10 3 7 12L10 27 M-7-5L-19 9 M7-5L19 9 M-7 12Q0 16 7 12 M-23-17Q-30-1-23 17 M23-17Q30-1 23 17',
  Vielfalt:'M0 27L0-11 M0 3Q-22 2-22-13Q-4-17 0 3 M0 17Q20 16 23 1Q5-1 0 17 M0-11Q-9-28 1-29Q15-22 0-11 M-26 18L-22 20 M18-20L23-24',
  Wahrnehmen:'M-28 0Q0-28 28 0Q0 28-28 0 M0-10a10 10 0 1 0 0 20a10 10 0 1 0 0-20 M0-4a4 4 0 1 0 0 8a4 4 0 1 0 0-8 M-18-20L-21-25 M0-24L0-29 M18-20L21-25',
  Schutz:'M0-27Q12-19 25-18L24 0Q22 18 0 29Q-22 18-24 0L-25-18Q-12-19 0-27 M-11 1L-3 10L13-9 M-16-11Q-10-12-6-16',
  Forschung:'M-5 10a17 17 0 1 0 0-34a17 17 0 1 0 0 34 M8 6L26 25 M13 1L30 20 M-17-7L-11-1L-4-10L3-4L9-15 M-17 4L3 4',
  Ohr:'M-14 12Q-26-21-4-26Q20-28 18-4Q17 8 6 14Q3 29-8 27 M-12-7Q-12-21 1-17Q14-11 4 1Q-8-2-6 11 M24-16Q33-3 25 10 M-22-18L-28-23',
  Licht:'M0-15a15 15 0 1 0 0 30a15 15 0 1 0 0-30 M0-22L0-30 M0 22L0 30 M22 0L30 0 M-22 0L-30 0 M16-16L22-22 M-16-16L-22-22 M16 16L22 22 M-16 16L-22 22',
  Atem:'M-27-10Q-9-20 5-11Q20-2 26-11 M-27 3Q-9-7 5 2Q20 11 27 2 M-24 17Q-7 7 7 16Q21 25 28 16',
  Pause:'M-9-19L-9 19 M9-19L9 19 M-24-22Q-34 0-24 22 M24-22Q34 0 24 22'
});
export function atlasSymbolSvg(node){
  const symbol=atlasSymbolFor(node);
  return symbol?`<svg viewBox="-36 -36 72 72" aria-hidden="true" focusable="false"><path d="${SYMBOL_PATHS[symbol]}" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round"/></svg>`:'';
}

function nodeGroups(node){
  const given=Array.isArray(node.groups)?node.groups:[node.group];
  const valid=given.map(Number).filter(g=>Number.isInteger(g)&&g>=0&&g<NETWORK_GROUPS.length);
  return valid.length?[...new Set(valid)]:[hash(node.id)%NETWORK_GROUPS.length];
}

function place(node){
  const groups=nodeGroups(node),g=NETWORK_GROUPS[groups[0]],key=node.id;
  const sub=Number.isInteger(node.subcluster)?((node.subcluster%3)+3)%3:hash(`${key}|sub`)%3;
  // Three overlapping folds along one asymmetric leaf, rather than radial star clusters.
  const u=(sub+.08+unit(key,'along')*.84)/3;
  const t=u*2-1, envelope=Math.pow(Math.sin(Math.PI*u),.72);
  const across=(unit(key,'across')-.5)*2;
  const lx=t*g.length*.5;
  const spine=Math.sin(Math.PI*u)*g.bow+Math.sin(u*Math.PI*2)*12;
  const ly=spine+across*g.width*envelope;
  const c=Math.cos(g.angle),s=Math.sin(g.angle);
  return {node,id:node.id,groups,group:groups[0],sub,u,
    x:clamp(g.x+lx*c-ly*s,45,1360),y:clamp(g.y+lx*s+ly*c,48,815),
    spineX:g.x+lx*c-spine*s,spineY:g.y+lx*s+spine*c,
    depth:.22+(.5+.5*Math.cos(across*Math.PI/2))*.52+unit(key,'depth')*.25,
    phase:unit(key,'phase')*Math.PI*2,color:g.color,degree:0,match:fits(node)};
}

/**
 * Mount an ink-and-fibre view of supplied records and relations. Coordinates are
 * projected directly from 1400 × 850 to the canvas CSS box, so HTML map labels
 * can use left:x/14% and top:y/8.5%. No independent fitting or automatic zoom.
 * Pass every node, marking filter misses with matches:false. onSelect receives
 * the original node object; onGroup receives its numeric group index.
 */
export function mountLivingNetwork(canvas,{
  nodes=[],edges=[],group=null,selected=null,onSelect=()=>{},onGroup=()=>{},onRelation=()=>{},reducedMotion,showLabels=true,labelInsetLeft=0,labelExclusions=()=>[]
}={}){
  if(!canvas?.getContext)throw new TypeError('A canvas is required.');
  const ctx=canvas.getContext('2d',{alpha:false});
  if(!ctx)throw new Error('Canvas2D is unavailable.');
  const win=canvas.ownerDocument?.defaultView||globalThis;
  const doc=canvas.ownerDocument;
  const media=win.matchMedia?.('(prefers-reduced-motion: reduce)');
  const narrowMedia=win.matchMedia?.('(max-width: 700px)');
  let still=reducedMotion===undefined?!!media?.matches:!!reducedMotion;
  const selectedId=endpoint(selected),activeGroup=Number.isInteger(group)&&NETWORK_GROUPS[group]?group:null;
  const points=[],byId=new Map();
  for(const node of nodes){if(node?.id===undefined||byId.has(node.id))continue;const p=place(node);points.push(p);byId.set(p.id,p);}
  const basePositions=new Map(points.map(p=>[p,{x:p.x,y:p.y,spineX:p.spineX,spineY:p.spineY}]));
  let geography=NETWORK_GROUPS,mobileLayout=null;
  function updateGeography(){
    const narrow=narrowMedia?!!narrowMedia.matches:Number(win.innerWidth)<=700;
    if(narrow===mobileLayout)return;
    mobileLayout=narrow;
    // Match the two-column territory names on a narrow screen. All records,
    // endpoint pairs and deterministic folds remain the same while the map fits.
    geography=narrow?NETWORK_GROUPS.map((g,i)=>({...g,x:WIDTH*(i%2?.75:.25),y:HEIGHT*(.12+Math.floor(i/2)*.23)})):NETWORK_GROUPS;
    for(const p of points){
      const base=basePositions.get(p),from=NETWORK_GROUPS[p.group],to=geography[p.group];
      p.x=narrow?to.x+(base.x-from.x)*.68:base.x;
      p.y=narrow?to.y+(base.y-from.y)*.48:base.y;
      p.spineX=narrow?to.x+(base.spineX-from.x)*.68:base.spineX;
      p.spineY=narrow?to.y+(base.spineY-from.y)*.48:base.spineY;
    }
  }
  const relations=[];
  const neighbors=new Set(selectedId===undefined||selectedId===null?[]:[selectedId]);
  for(const edge of edges){
    const a=byId.get(endpoint(edge.from??edge.source)),b=byId.get(endpoint(edge.to??edge.target));
    if(!a||!b)continue;
    a.degree++;b.degree++;
    const chosen=a.id===selectedId||b.id===selectedId;
    if(chosen){neighbors.add(a.id);neighbors.add(b.id);}
    const key=`${String(a.id)}|${String(b.id)}|${String(edge.type??edge.kind??edge.label??'')}`;
    relations.push({a,b,edge,chosen,key,order:hash(key),bend:(unit(key,'bend')-.5)*30});
  }
  const hasSelection=byId.has(selectedId);
  const relevant=p=>hasSelection?neighbors.has(p.id):activeGroup===null||p.groups.includes(activeGroup);
  const lit=p=>p.match&&relevant(p);
  // Stable sampling keeps real endpoint pairs. Focus relations get priority;
  // the remainder is a deterministic sample, independent of animation frames.
  const priority=e=>e.chosen?-3:activeGroup!==null&&e.a.groups.includes(activeGroup)&&e.b.groups.includes(activeGroup)?-2:
    activeGroup!==null&&(e.a.groups.includes(activeGroup)||e.b.groups.includes(activeGroup))?-1:0;
  const sampled=relations.slice().sort((a,b)=>priority(a)-priority(b)||a.order-b.order||a.key.localeCompare(b.key)).slice(0,MAX_EDGES);
  // Back fibres first, illuminated real connections last.
  sampled.sort((a,b)=>Number(lit(a.a)&&lit(a.b))-Number(lit(b.a)&&lit(b.b))||Number(a.chosen)-Number(b.chosen)||a.order-b.order);
  const stats=Object.freeze({nodes:points.length,edges:relations.length,drawnEdges:sampled.length,
    sampled:sampled.length<relations.length,maxEdges:MAX_EDGES});
  if(canvas.dataset){canvas.dataset.networkNodes=String(stats.nodes);canvas.dataset.networkEdges=String(stats.edges);
    canvas.dataset.networkDrawnEdges=String(stats.drawnEdges);canvas.dataset.networkSampled=String(stats.sampled);}

  const important=points.filter(p=>lit(p)&&humanTitle(titleOf(p.node))).sort((a,b)=>{
    const score=p=>(p.id===selectedId?10000:0)+(/bindung|scham|mentalisi|grenz|trigger|sicher|selbstwert|zurückweis|regulation|überlast/i.test(titleOf(p.node))?34:0)+
      Math.min(p.degree,45)+(p.node.kind==='phenomenon'?12:0)-(titleOf(p.node).length>65?20:0);
    return score(b)-score(a)||String(a.id).localeCompare(String(b.id));
  });
  const front=[];
  if(activeGroup===null&&!hasSelection){for(let g=0;g<NETWORK_GROUPS.length;g++){const p=important.find(p=>p.group===g);if(p)front.push(p);}}
  for(const p of important){if(front.length===12)break;if(!front.includes(p))front.push(p);}
  const frontIds=new Set(front.map(p=>p.id));

  let width=0,height=0,dpr=1,alive=true,frame=0,lastFrame=-Infinity,dirty=true;
  let camera={x:0,y:0,k:1},hover=null,down=null,detail=1,drawTime=0;
  const relationLabels=[];
  let pointer={x:0,y:0},aim={x:0,y:0};
  const screen=new Map();
  const visualKnots=[],images=new Map(),symbolPaths=new Map();
  let excludedLabels=null;
  const previousCursor=canvas.style.cursor;
  const now=()=>win.performance?.now?.()??Date.now();
  const request=fn=>win.requestAnimationFrame(fn),cancel=id=>win.cancelAnimationFrame(id);

  function project(x,y){return {x:x*width/WIDTH*camera.k+camera.x,y:y*height/HEIGHT*camera.k+camera.y};}
  function animated(p,time){
    if(still)return {x:p.x,y:p.y};
    const g=geography[p.group],breath=Math.sin(time/19000*Math.PI*2+p.group*.81);
    return {x:p.x+Math.cos(g.angle)*breath*1.4+pointer.x*(p.depth-.35)*3,
      y:p.y+Math.sin(g.angle+.9)*breath*1.25+pointer.y*(p.depth-.35)*2.5};
  }
  function refreshScreen(time){
    screen.clear();
    for(const p of points){const v=animated(p,time);screen.set(p.id,project(v.x,v.y));}
  }
  function strand(e,pointAt){
    const a=screen.get(e.a.id),b=screen.get(e.b.id);
    if(e.a===e.b){
      ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(a.x+14,a.y-20,a.x-14,a.y-20,a.x,a.y);return;
    }
    const ga=geography[e.a.group],gb=geography[e.b.group];
    let c1,c2;
    if(e.a.group===e.b.group){
      const mx=(e.a.spineX+e.b.spineX)/2,my=(e.a.spineY+e.b.spineY)/2;
      const nx=-Math.sin(ga.angle)*e.bend,ny=Math.cos(ga.angle)*e.bend;
      c1=project(e.a.x*.25+mx*.75+nx,e.a.y*.25+my*.75+ny);
      c2=project(e.b.x*.25+mx*.75+nx,e.b.y*.25+my*.75+ny);
    }else{
      const dx=gb.x-ga.x,dy=gb.y-ga.y,len=Math.hypot(dx,dy)||1;
      const nx=-dy/len*e.bend,ny=dx/len*e.bend;
      c1=project(e.a.x*.18+ga.x*.51+gb.x*.31+nx,e.a.y*.18+ga.y*.51+gb.y*.31+ny);
      c2=project(e.b.x*.18+gb.x*.51+ga.x*.31+nx,e.b.y*.18+gb.y*.51+ga.y*.31+ny);
    }
    if(pointAt!==undefined){const t=pointAt,u=1-t;return {x:u*u*u*a.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*b.x,y:u*u*u*a.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*b.y};}
    ctx.moveTo(a.x,a.y);ctx.bezierCurveTo(c1.x,c1.y,c2.x,c2.y,b.x,b.y);
  }
  function drawFibres(){
    for(const e of sampled){
      const both=e.a.match&&e.b.match,focused=lit(e.a)&&lit(e.b),adjacent=hasSelection&&e.chosen;
      const a=screen.get(e.a.id),b=screen.get(e.b.id);
      if(Math.max(a.x,b.x)<-260||Math.min(a.x,b.x)>width+260||Math.max(a.y,b.y)<-180||Math.min(a.y,b.y)>height+180)continue;
      if(detail>=1.7&&![a,b].some(q=>q.x>-60&&q.x<width+60&&q.y>-60&&q.y<height+60))continue;
      const opacity=!both?.045:adjacent?.66:focused?.19:activeGroup!==null||hasSelection?.055:.12;
      const gradient=ctx.createLinearGradient(a.x,a.y,b.x+(a.x===b.x?.01:0),b.y+(a.y===b.y?.01:0));
      gradient.addColorStop(0,rgba(both?e.a.color:'#77858a',opacity));
      gradient.addColorStop(.48,rgba(adjacent?'#e1bd94':focused?'#c8caba':'#879997',opacity*.76));
      gradient.addColorStop(1,rgba(both?e.b.color:'#77858a',opacity));
      ctx.strokeStyle=gradient;ctx.lineWidth=adjacent?1.12:focused?.64:.46;
      ctx.beginPath();strand(e);ctx.stroke();
      // A travelling mark follows the stored source-to-target reading direction.
      // Its speed/size conveys no measured strength or probability.
      if(!still&&focused&&e.a!==e.b&&e.order%17===0){
        const t=(drawTime/11000+e.order/4294967295)%1,q=strand(e,t);
        ctx.fillStyle=rgba('#efc6a6',.75);ctx.beginPath();ctx.arc(q.x,q.y,1.65/Math.sqrt(detail),0,Math.PI*2);ctx.fill();
      }
    }
  }
  function drawKnots(){
    for(const p of points){
      const q=screen.get(p.id);if(q.x<-20||q.x>width+20||q.y<-20||q.y>height+20)continue;
      const focus=lit(p),isSelected=p.id===selectedId,isHover=hover===p;
      const radius=(isSelected?4.2:isHover?3.6:frontIds.has(p.id)?2.7:1.05+Math.min(Math.sqrt(p.degree),5)*.2)*Math.min(Math.sqrt(camera.k),1.5);
      const alpha=!p.match?.17:focus?.45+p.depth*.38:.16;
      if(focus&&(frontIds.has(p.id)||isSelected||isHover)){
        const r=radius*(isSelected?5:4),glow=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,r);
        glow.addColorStop(0,rgba(p.color,isSelected?.34:.2));glow.addColorStop(1,rgba(p.color,0));
        ctx.fillStyle=glow;ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle=rgba(p.match?p.color:'#869194',alpha);
      ctx.beginPath();ctx.ellipse(q.x,q.y,radius,radius*.7,geography[p.group].angle,0,Math.PI*2);ctx.fill();
      if(isSelected||isHover){ctx.strokeStyle=rgba('#f1e7d4',.85);ctx.lineWidth=.8;ctx.beginPath();ctx.arc(q.x,q.y,radius+3,0,Math.PI*2);ctx.stroke();}
    }
  }
  function imageFor(src){
    if(images.has(src))return images.get(src);
    if(!win.Image)return null;
    const image=new win.Image();images.set(src,image);
    image.onload=()=>{if(alive)invalidate();};image.onerror=()=>{if(alive)invalidate();};
    image.src=src;return image;
  }
  function drawVisuals(){
    visualKnots.length=0;
    if(hasSelection){if(canvas.dataset){canvas.dataset.networkImageNodes='0';canvas.dataset.networkSymbolNodes='0';}return;}
    if(excludedLabels===null)excludedLabels=labelExclusions().filter(b=>[b.x,b.y,b.w,b.h].every(Number.isFinite));
    const inView=p=>{const q=screen.get(p.id);return q&&q.x>32&&q.x<width-32&&q.y>32&&q.y<height-32;};
    const mediaPoints=points.filter(p=>lit(p)&&networkImageFor(p.node));
    const candidates=[...new Set([...(hover&&lit(hover)?[hover]:[]),...mediaPoints,...front,...important])].filter(inView);
    const max=detail<1.4?12:detail<2.2?20:32;
    const symbolCounts=new Map();
    for(const p of candidates){
      if(visualKnots.length>=max)break;
      const origin=screen.get(p.id),image=networkImageFor(p.node),symbol=atlasSymbolFor(p.node);
      if(!image&&!symbol)continue;
      // Repeated reading aids are a visual sample, never a count or weight of
      // the supplied records. Every original point remains drawn and selectable.
      if(!image&&p!==hover&&(symbolCounts.get(symbol)||0)>=2)continue;
      const radius=(image?(mobileLayout?26:32):mobileLayout?23:27)*Math.min(1.55,Math.sqrt(camera.k));
      const options=[origin];
      // A small thumbnail can sit beside its original point when a mobile
      // territory heading covers that point. The drawn stem preserves identity;
      // neither the stored point nor any supplied relation is moved.
      if(mobileLayout){for(const b of excludedLabels){if(origin.x+radius+4<=b.x||origin.x-radius-4>=b.x+b.w||origin.y+radius+4<=b.y||origin.y-radius-4>=b.y+b.h)continue;
        options.push({x:origin.x,y:b.y+b.h+radius+8},{x:origin.x,y:b.y-radius-8},{x:b.x-radius-8,y:origin.y},{x:b.x+b.w+radius+8,y:origin.y});}}
      const q=options.find(q=>Math.hypot(q.x-origin.x,q.y-origin.y)<=130&&q.x-radius>=8&&q.x+radius<=width-8&&q.y-radius>=8&&q.y+radius<=height-8&&
        (mobileLayout||detail>=1.7||q.x-radius>=width*labelInsetLeft)&&
        excludedLabels.every(b=>q.x+radius+4<=b.x||q.x-radius-4>=b.x+b.w||q.y+radius+4<=b.y||q.y-radius-4>=b.y+b.h)&&
        visualKnots.every(v=>Math.hypot(v.x-q.x,v.y-q.y)>=v.radius+radius+17));
      if(!q)continue;
      visualKnots.push({p,x:q.x,y:q.y,radius,image});
      if(!image)symbolCounts.set(symbol,(symbolCounts.get(symbol)||0)+1);
      ctx.save();
      if(q!==origin){ctx.strokeStyle=rgba(p.color,.45);ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(origin.x,origin.y);ctx.lineTo(q.x,q.y);ctx.stroke();}
      ctx.shadowColor=rgba(p.color,.18);ctx.shadowBlur=18;
      const wash=ctx.createRadialGradient(q.x-radius*.3,q.y-radius*.4,0,q.x,q.y,radius);
      wash.addColorStop(0,rgba(p.color,.2));wash.addColorStop(1,'#14252b');
      ctx.fillStyle=wash;ctx.beginPath();ctx.arc(q.x,q.y,radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
      if(image){
        const img=imageFor(image.src);
        if(img?.complete&&img.naturalWidth>0){
          const scale=(radius-2)*2/Math.hypot(img.naturalWidth,img.naturalHeight);
          ctx.save();ctx.beginPath();ctx.arc(q.x,q.y,radius-1,0,Math.PI*2);ctx.clip();
          ctx.drawImage(img,q.x-img.naturalWidth*scale/2,q.y-img.naturalHeight*scale/2,img.naturalWidth*scale,img.naturalHeight*scale);ctx.restore();
        }
      }else if(win.Path2D){
        if(!symbolPaths.has(symbol))symbolPaths.set(symbol,new win.Path2D(SYMBOL_PATHS[symbol]));
        ctx.save();ctx.translate(q.x,q.y);ctx.scale(radius/47,radius/47);ctx.strokeStyle=rgba(p.color,.95);ctx.lineWidth=1.6;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke(symbolPaths.get(symbol));ctx.restore();
      }
      ctx.strokeStyle=rgba(p.color,p===hover||p.id===selectedId ? .95:.55);ctx.lineWidth=p===hover||p.id===selectedId?1.5:.8;
      ctx.beginPath();ctx.arc(q.x,q.y,radius,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle=rgba(p.color,.2);ctx.lineWidth=.6;ctx.beginPath();ctx.arc(q.x,q.y,radius+4,0,Math.PI*2);ctx.stroke();ctx.restore();
    }
    if(canvas.dataset){canvas.dataset.networkImageNodes=String(visualKnots.filter(v=>v.image).length);canvas.dataset.networkSymbolNodes=String(visualKnots.filter(v=>!v.image).length);}
  }
  function linesFor(text,maxWidth){
    const words=text.split(/\s+/),lines=[];let line='';
    for(const word of words){const next=line?`${line} ${word}`:word;if(line&&ctx.measureText(next).width>maxWidth){lines.push(line);line=word;}else line=next;}
    if(line)lines.push(line);
    if(lines.length>2){lines.length=2;while(ctx.measureText(`${lines[1]}…`).width>maxWidth&&lines[1].length>3)lines[1]=lines[1].slice(0,-1);lines[1]+='…';}
    return lines;
  }
  function drawLabels(){
    if(!showLabels)return;
    const limit=detail<1.4?12:detail<2.2?28:detail<3.2?52:84;
    const inView=p=>{const q=screen.get(p.id);return q&&q.x>=8&&q.x<=width-8&&q.y>=8&&q.y<=height-8;};
    const detailed=(detail<1.4?front:important).filter(inView).slice(0,limit);
    const labels=hover&&lit(hover)&&humanTitle(titleOf(hover.node))&&!detailed.includes(hover)?[hover,...detailed.slice(0,limit-1)]:detailed;
    const inset=detail<1.7?labelInsetLeft:0;
    const occupied=inset>0?[{x:0,y:0,w:width*inset,h:height}]:[];
    for(const v of visualKnots)occupied.push({x:v.x-v.radius,y:v.y-v.radius,w:v.radius*2,h:v.radius*2});
    // Keep the space occupied by the caller's HTML territory names clear.
    if(activeGroup===null&&!hasSelection&&detail<1.7){for(const g of geography){const q=project(g.x,g.y),w=mobileLayout?width*.43:290,h=mobileLayout?100:150;occupied.push({x:q.x-w/2,y:q.y-h/2,w,h});}}
    const fontSize=(width<650?13:15)*Math.min(1.18,Math.pow(detail,.12));
    ctx.font=`500 ${fontSize}px "Newsreader", Georgia, serif`;ctx.textBaseline='top';
    for(const p of labels){
      const q=screen.get(p.id);if(q.x<8||q.x>width-8||q.y<8||q.y>height-8)continue;
      const lines=linesFor(titleOf(p.node),width<650?140:190);
      const w=Math.max(...lines.map(s=>ctx.measureText(s).width)),h=lines.length*(fontSize+3);
      const r=(visualKnots.find(v=>v.p===p)?.radius||0)+12;
      const offsets=[[r,-h-8],[r,11],[-w-r,-h-8],[-w-r,11],[-w/2,-h-r],[-w/2,r]];
      let box=null;
      for(const [dx,dy] of offsets){const b={x:q.x+dx,y:q.y+dy,w,h};if(b.x<8||b.x+b.w>width-8||b.y<8||b.y+b.h>height-8)continue;
        if(occupied.every(o=>b.x+b.w+8<o.x||b.x>o.x+o.w+8||b.y+b.h+5<o.y||b.y>o.y+o.h+5)){box=b;break;}}
      if(!box)continue;occupied.push(box);
      ctx.save();ctx.shadowColor='#101b22';ctx.shadowBlur=7;ctx.lineWidth=3;ctx.strokeStyle='rgba(16,27,34,.85)';
      ctx.fillStyle=p.id===selectedId||p===hover?'#f5e8d2':'#dcded1';
      lines.forEach((line,i)=>{const y=box.y+i*(fontSize+3);ctx.strokeText(line,box.x,y);ctx.fillText(line,box.x,y);});
      ctx.restore();
    }
    relationLabels.length=0;
    if(detail<1.7)return;
    ctx.font='500 11px "Manrope", sans-serif';
    for(const e of sampled.filter(e=>lit(e.a)&&lit(e.b)&&e.a!==e.b).sort((a,b)=>a.order-b.order)){
      if(relationLabels.length>=(detail<2.6?7:18))break;
      const text=String(e.edge.label||e.edge.relation||e.edge.kind||'steht in Beziehung zu').replaceAll('-',' '),q=strand(e,.5);
      const lines=linesFor(text,Math.min(230,width-40)),w=Math.max(...lines.map(line=>ctx.measureText(line).width)),h=lines.length*16+8,box={x:q.x-w/2-6,y:q.y-h/2-4,w:w+12,h};
      if(box.x<Math.max(12,width*inset)||box.x+box.w>width-12||box.y<12||box.y+box.h>height-12)continue;
      if(occupied.some(o=>box.x<o.x+o.w+10&&box.x+box.w+10>o.x&&box.y<o.y+o.h+7&&box.y+box.h+7>o.y))continue;
      occupied.push(box);relationLabels.push({...box,edge:e.edge});
      ctx.fillStyle='rgba(16,27,34,.92)';ctx.fillRect(box.x,box.y,box.w,box.h);
      ctx.fillStyle='#e6b596';lines.forEach((line,i)=>ctx.fillText(line,box.x+6,box.y+4+i*16));
    }
  }
  function draw(time){
    if(!alive||!width||!height)return;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#101b22';ctx.fillRect(0,0,width,height);
    const wash=ctx.createLinearGradient(0,0,width,height);wash.addColorStop(0,'rgba(40,61,63,.18)');
    wash.addColorStop(.5,'rgba(17,31,37,0)');wash.addColorStop(1,'rgba(59,51,43,.12)');ctx.fillStyle=wash;ctx.fillRect(0,0,width,height);
    drawTime=time;refreshScreen(still?0:time);drawFibres();drawKnots();drawVisuals();drawLabels();dirty=false;
  }
  function tick(time){
    frame=0;if(!alive||doc?.hidden)return;
    if(still){if(dirty)draw(0);return;}
    if(time-lastFrame>=FRAME_MS){lastFrame=time;pointer.x+=(aim.x-pointer.x)*.045;pointer.y+=(aim.y-pointer.y)*.045;draw(time);}
    frame=request(tick);
  }
  function invalidate(){dirty=true;if(!alive||frame||doc?.hidden)return;frame=request(tick);}
  function resize(){
    if(!alive)return;const box=canvas.getBoundingClientRect();
    width=Math.max(0,canvas.clientWidth||box.width);height=Math.max(0,canvas.clientHeight||box.height);dpr=clamp(Number(win.devicePixelRatio)||1,1,2);
    updateGeography();excludedLabels=null;
    const w=Math.max(1,Math.round(width*dpr)),h=Math.max(1,Math.round(height*dpr));
    if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;
    draw(still?0:now());invalidate();
  }
  function coordinates(event){const b=canvas.getBoundingClientRect();return {x:(event.clientX-b.left)*width/(b.width||1),y:(event.clientY-b.top)*height/(b.height||1)};}
  function nearest(q){const visual=visualKnots.find(v=>Math.hypot(q.x-v.x,q.y-v.y)<=v.radius+4);if(visual)return visual.p;let best=null,distance=15*15;for(const p of points){const s=screen.get(p.id);if(!s)continue;const d=(q.x-s.x)**2+(q.y-s.y)**2;if(d<distance){best=p;distance=d;}}return best;}
  function groupAt(q){
    const world={x:(q.x-camera.x)/camera.k*WIDTH/(width||1),y:(q.y-camera.y)/camera.k*HEIGHT/(height||1)};
    let index=null,distance=Infinity;
    geography.forEach((g,i)=>{const d=Math.hypot((world.x-g.x)/1.3,world.y-g.y);if(d<distance&&points.some(p=>p.groups.includes(i))){distance=d;index=i;}});
    return distance<190?index:null;
  }
  function move(event){pointerMovement(event);const q=coordinates(event);const next=nearest(q);if(next!==hover){hover=next;invalidate();}
    if(!still&&event.pointerType!=='touch'){aim={x:clamp(q.x/(width||1)*2-1,-1,1),y:clamp(q.y/(height||1)*2-1,-1,1)};}
    canvas.style.cursor=hover||groupAt(q)!==null?'pointer':previousCursor;
  }
  function leave(){aim={x:0,y:0};if(hover){hover=null;invalidate();}canvas.style.cursor=previousCursor;}
  function activate(event){const q=coordinates(event),rel=relationLabels.find(b=>q.x>=b.x-6&&q.x<=b.x+b.w+6&&q.y>=b.y-6&&q.y<=b.y+b.h+6);if(rel){onRelation(rel.edge);return;}const p=nearest(q);if(p)onSelect(p.node);else{const g=groupAt(q);if(g!==null)onGroup(g);}}
  const activePointers=new Set();
  function pointerDown(event){if(event.button!==undefined&&event.button!==0)return;activePointers.add(event.pointerId);down=activePointers.size===1?{x:event.clientX,y:event.clientY,id:event.pointerId,moved:false}:null;}
  function pointerMovement(event){if(down&&event.pointerId===down.id&&Math.hypot(event.clientX-down.x,event.clientY-down.y)>=6)down.moved=true;}
  function pointerUp(event){activePointers.delete(event.pointerId);if(!down||event.pointerId!==down.id)return;const start=down;down=null;if(!start.moved&&Math.hypot(event.clientX-start.x,event.clientY-start.y)<6)activate(event);}
  function pointerCancel(event){activePointers.delete(event.pointerId);down=null;}
  function syntheticClick(event){if(event.detail===0)activate(event);}
  function motionChange(event){if(reducedMotion!==undefined)return;still=event.matches;pointer={x:0,y:0};aim={x:0,y:0};if(frame){cancel(frame);frame=0;}invalidate();}
  function visibility(){if(doc?.hidden){if(frame)cancel(frame);frame=0;}else{lastFrame=-Infinity;invalidate();}}
  const Resize=win.ResizeObserver||globalThis.ResizeObserver;
  const observer=Resize?new Resize(resize):null;
  observer?.observe(canvas);if(!observer)win.addEventListener('resize',resize);
  canvas.addEventListener('pointermove',move,{passive:true});canvas.addEventListener('pointerleave',leave,{passive:true});
  canvas.addEventListener('pointerdown',pointerDown,{passive:true});canvas.addEventListener('click',syntheticClick);
  // Window capture also sees pointerup when the caller captures map dragging.
  win.addEventListener('pointerup',pointerUp,true);win.addEventListener('pointercancel',pointerCancel,true);win.addEventListener('pointermove',pointerMovement,true);
  doc?.addEventListener?.('visibilitychange',visibility);media?.addEventListener?.('change',motionChange);
  resize();
  return {
    stats,
    setDetail(value){detail=clamp(Number(value)||1,.6,5);excludedLabels=null;if(canvas.dataset)canvas.dataset.networkDetail=detail<1.4?'Gebiete':detail<2.2?'Einträge':detail<3.2?'Beziehungen':'Zusammenhänge';invalidate();},
    setCamera(next={}){camera={x:Number.isFinite(next.x)?next.x:camera.x,y:Number.isFinite(next.y)?next.y:camera.y,k:Number.isFinite(next.k)?clamp(next.k,.2,8):camera.k};excludedLabels=null;invalidate();},
    destroy(){if(!alive)return;alive=false;if(frame)cancel(frame);frame=0;observer?.disconnect();
      if(!observer)win.removeEventListener('resize',resize);
      canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);
      canvas.removeEventListener('pointerdown',pointerDown);canvas.removeEventListener('click',syntheticClick);
      win.removeEventListener('pointerup',pointerUp,true);win.removeEventListener('pointercancel',pointerCancel,true);win.removeEventListener('pointermove',pointerMovement,true);
      doc?.removeEventListener?.('visibilitychange',visibility);media?.removeEventListener?.('change',motionChange);
      for(const img of images.values()){img.onload=null;img.onerror=null;}images.clear();symbolPaths.clear();visualKnots.length=0;
      canvas.style.cursor=previousCursor;screen.clear();}
  };
}
