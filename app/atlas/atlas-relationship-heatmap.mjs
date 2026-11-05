import { directions, thematicPlacement } from './knowledge-landscape.mjs';

const norm=value=>String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').toLocaleLowerCase('de');
const shortNames=['Bindung','Selbst','Trauma','Körper','Alltag','Erleben','Schutz','Forschung'];

/** One original directed relation record per cell; theme memberships are not inferred edges. */
export function aggregateThemeRelations(entries=[],relations=[],placement=thematicPlacement) {
  const byId=new Map(entries.map(entry=>[entry.id,entry]));
  const memberships=new Map(entries.map(entry=>[entry.id,[...new Set(placement(entry))].filter(index=>Number.isInteger(index)&&index>=0&&index<directions.length)]));
  const cells=directions.map((_,from)=>directions.map((_,to)=>({from,to,count:0,relations:[]})));
  let relationCount=0, crossThemeRecordCount=0, assignmentCount=0, missingEndpointCount=0;
  for (const relation of relations) {
    if (!byId.has(relation.from)||!byId.has(relation.to)) {missingEndpointCount++;continue;}
    relationCount++;
    const from=memberships.get(relation.from),to=memberships.get(relation.to);
    if(from.some(a=>to.some(b=>a!==b)))crossThemeRecordCount++;
    for(const a of from)for(const b of to){const cell=cells[a][b];cell.relations.push(relation);cell.count++;assignmentCount++;}
  }
  return {cells,byId,relationCount,crossThemeRecordCount,assignmentCount,missingEndpointCount,max:Math.max(0,...cells.flat().map(cell=>cell.count))};
}

export function mountRelationshipHeatmap(host,{entries=[],relations=[],state={},onSelect=()=>{},onView=()=>{}}={}) {
  const doc=host.ownerDocument,win=doc.defaultView,abort=new AbortController();
  let selectionAbort=new AbortController();
  let expanded=false,localPaused=false,frame=0,lastTime=null,traceProgress=1,traceLength=0;
  let motion={paused:doc.documentElement.classList.contains('atlas-motion-paused'),quiet:doc.documentElement.classList.contains('atlas-quiet'),reduced:doc.documentElement.classList.contains('atlas-reduced')||Boolean(win.matchMedia?.('(prefers-reduced-motion: reduce)').matches)};
  const make=(tag,className,text)=>{const element=doc.createElement(tag);if(className)element.className=className;if(text!==undefined)element.textContent=text;return element;};
  const button=(text,action,className='',signal=abort.signal)=>{const element=make('button',className,text);element.type='button';element.addEventListener('click',action,{signal});return element;};
  const query=norm(state.query).trim();
  const scoped=entries.filter(entry=>(!state.collection||state.collection==='all'||entry.collection===state.collection)&&(!state.kind||state.kind==='all'||entry.kind===state.kind)&&(!query||norm([entry.title,entry.summary,...(entry.tags||[])].join(' ')).includes(query)));
  const data=aggregateThemeRelations(scoped,relations);
  const saved=state.relationshipHeatmap??={from:Number.isInteger(state.group)?state.group:0,to:null,page:0};
  expanded=Boolean(saved.expanded);
  saved.from=Number.isInteger(saved.from)&&saved.from>=0&&saved.from<directions.length?saved.from:0;
  if(!Number.isInteger(saved.to)||saved.to<0||saved.to>=directions.length){const row=data.cells[saved.from];saved.to=row.reduce((best,cell)=>cell.to!==saved.from&&cell.count>row[best].count?cell.to:best,(saved.from+1)%directions.length);}
  saved.page=Math.max(0,Number(saved.page)||0);
  const root=make('section','rh-space');root.setAttribute('aria-label','Verbindungen der Themen');
  const header=make('header','rh-header');const heading=make('div','rh-heading');heading.append(make('p','rh-eyebrow','Der Weberahmen'),make('h2','','Verbindungen der Themen'),make('p','rh-intro','Ein Feld öffnen. Eine Verbindung verfolgen.'));header.append(heading);
  const details=make('details','rh-explanation'),summary=make('summary','','Wie wird gezählt?');details.append(summary,make('p','',`Jedes Feld zählt vorhandene, gerichtete Beziehungen zwischen Einträgen: von der Zeile zur Spalte. ${data.crossThemeRecordCount.toLocaleString('de-DE')} Beziehungsdatensätze verbinden unterschiedliche Themen. Ein Eintrag kann mehreren Themen angehören; seine Beziehung erscheint dann in mehreren Feldern, je Feld einmal. Die Summe der Felder ist deshalb keine Zahl unabhängiger Beziehungen. Helligkeit zeigt die Anzahl im Bestand, keine Stärke, Häufigkeit im Leben oder Ursache.`));header.append(details);root.append(header);
  const body=make('div','rh-body'),map=make('div','rh-map'),matrix=make('div','rh-matrix');
  matrix.setAttribute('role','group');matrix.setAttribute('aria-label','Beziehungen von Zeile zu Spalte');
  const corner=make('div','rh-corner','von ↓\nzu →');corner.setAttribute('aria-hidden','true');matrix.append(corner);
  const columnLabels=[],rowLabels=[],palette=['#ef967d','#b7a5df','#e9c778','#8ed2bd','#ef967d','#b7a5df','#8ed2bd','#e9c778'];
  for(let to=0;to<directions.length;to++){const label=make('div','rh-column',shortNames[to]);label.title=directions[to].name;label.style.setProperty('--rh-accent',palette[to]);columnLabels.push(label);matrix.append(label);}
  const cellButtons=[];
  for(let from=0;from<directions.length;from++){
    const label=make('div','rh-row',shortNames[from]);label.title=directions[from].name;label.style.setProperty('--rh-accent',palette[from]);rowLabels.push(label);matrix.append(label);
    for(let to=0;to<directions.length;to++){
      const cell=data.cells[from][to],strength=data.max?Math.log1p(cell.count)/Math.log1p(data.max):0;
      const element=button(cell.count?cell.count.toLocaleString('de-DE'):'·',()=>{saved.from=from;saved.to=to;saved.page=0;renderSelection();trace(true);},'rh-cell');
      element.style.setProperty('--rh-strength',String(strength));element.style.setProperty('--rh-lightness',`${17+strength*39}%`);
      const night=document.documentElement.dataset.appearance==='dark';
      element.style.setProperty('--rh-accent',palette[to]);element.style.setProperty('--rh-fill',`color-mix(in srgb, ${palette[to]} ${Math.round(18+strength*48)}%, ${night?'#101727':'#ffffff'})`);
      element.style.setProperty('--rh-text',night?(strength>.58?'#101727':'#f5ebd9'):'#1d1d1f');
      element.classList.toggle('rh-cell-empty',!cell.count);element.classList.toggle('rh-cell-diagonal',from===to);
      element.setAttribute('aria-label',`${directions[from].name} nach ${directions[to].name}: ${cell.count} ${cell.count===1?'Beziehung':'Beziehungen'}`);
      element.title=`${directions[from].name} → ${directions[to].name}: ${cell.count}`;
      cellButtons.push({from,to,element});matrix.append(element);
    }
  }
  const svgNode=tag=>doc.createElementNS('http://www.w3.org/2000/svg',tag);
  const thread=svgNode('svg');thread.classList.add('rh-thread');thread.setAttribute('aria-hidden','true');
  const traceBase=svgNode('path'),traceLine=svgNode('path'),cursor=svgNode('circle');traceBase.classList.add('rh-thread-base');traceLine.classList.add('rh-thread-line');cursor.classList.add('rh-thread-cursor');cursor.setAttribute('r','5');thread.append(traceBase,traceLine,cursor);matrix.append(thread);
  map.append(matrix);
  const scale=make('div','rh-scale');scale.append(make('span','','weniger'),make('i',''),make('span','','mehr Beziehungen'));map.append(scale);
  const routeTools=make('div','rh-route-tools');routeTools.append(make('p','rh-reading-key','Zeile → Feld → Spalte'));
  const replay=button('Lesespur verfolgen',()=>trace(true),'rh-replay'),pause=button('Pause',()=>{localPaused=!localPaused;syncMotion();},'rh-pause');pause.setAttribute('aria-pressed','false');routeTools.append(replay,pause);map.append(routeTools);
  map.append(make('p','rh-totals',`${data.relationCount.toLocaleString('de-DE')} Originalbeziehungen · ${data.assignmentCount.toLocaleString('de-DE')} Themenzuordnungen`));
  const panel=make('section','rh-selection');panel.setAttribute('aria-label','Beziehungen im gewählten Feld');body.append(map,panel);root.append(body);host.replaceChildren(root);
  function renderSelection(){
    const focusedPageLabel=panel.contains(doc.activeElement)?doc.activeElement?.getAttribute('aria-label'):null;
    selectionAbort.abort();selectionAbort=new AbortController();
    const selectionButton=(text,action,className='')=>button(text,action,className,selectionAbort.signal);
    const cell=data.cells[saved.from][saved.to],perPage=5,pages=Math.max(1,Math.ceil(cell.count/perPage));saved.page=Math.min(saved.page,pages-1);
    for(const candidate of cellButtons){candidate.element.setAttribute('aria-pressed',String(candidate.from===saved.from&&candidate.to===saved.to));candidate.element.classList.toggle('rh-reading-row',candidate.from===saved.from);candidate.element.classList.toggle('rh-reading-column',candidate.to===saved.to);}
    rowLabels.forEach((label,index)=>label.classList.toggle('rh-label-selected',index===saved.from));columnLabels.forEach((label,index)=>label.classList.toggle('rh-label-selected',index===saved.to));
    panel.replaceChildren();
    panel.append(make('p','rh-direction','Das ausgewählte Feld'));
    const pair=make('div','rh-topic-pair');pair.style.setProperty('--rh-from',palette[saved.from]);pair.style.setProperty('--rh-to',palette[saved.to]);
    const origin=make('div','rh-topic rh-topic-from'),destination=make('div','rh-topic rh-topic-to');origin.append(make('span','rh-topic-label','Von · Zeile'),make('h3','',directions[saved.from].name));destination.append(make('span','rh-topic-label','Zu · Spalte'),make('h3','',directions[saved.to].name));pair.append(origin,make('span','rh-arrow','↓'),destination);panel.append(pair);
    const count=make('p','rh-count');count.append(make('strong','',cell.count.toLocaleString('de-DE')),make('span','',cell.count===1?'vorhandene Beziehung':'vorhandene Beziehungen'));count.setAttribute('aria-live','polite');panel.append(count);
    if(!cell.count){panel.append(make('p','rh-empty','Für diese beiden Themen ist im gewählten Bestand keine gerichtete Beziehung hinterlegt.'));return;}
    const records=make('details','rh-records'),recordsTitle=make('summary','','Beziehungen entfalten');records.open=expanded;records.addEventListener('toggle',()=>{expanded=records.open;saved.expanded=expanded;},{signal:selectionAbort.signal});records.append(recordsTitle,make('p','rh-records-intro','Die Einträge öffnen oder ihrer Verbindung ins Netz folgen.'));panel.append(records);
    const list=make('ol','rh-relations');
    for(const relation of cell.relations.slice(saved.page*perPage,(saved.page+1)*perPage)){
      const from=data.byId.get(relation.from),to=data.byId.get(relation.to),item=make('li','rh-relation');
      item.append(selectionButton(from.title,()=>onSelect(from.id),'rh-entry'),make('p','rh-relation-label',relation.label||'steht in Beziehung zu'),selectionButton(to.title,()=>onSelect(to.id),'rh-entry'));
      const action=selectionButton('Im Netz ansehen ↗',()=>{state.pathTarget=to.id;onSelect(from.id);onView('graph');},'rh-open-network');action.setAttribute('aria-label',`${from.title} und ${to.title} im Netz ansehen`);item.append(action);list.append(item);
    }
    records.append(list);
    if(pages>1){const paging=make('nav','rh-paging');paging.setAttribute('aria-label','Weitere Beziehungen');const previous=selectionButton('←',()=>{saved.page--;renderSelection();}),next=selectionButton('→',()=>{saved.page++;renderSelection();});previous.disabled=saved.page===0;next.disabled=saved.page===pages-1;previous.setAttribute('aria-label','Vorherige Beziehungen');next.setAttribute('aria-label','Weitere Beziehungen');paging.append(previous,make('span','',`${saved.page+1} / ${pages}`),next);records.append(paging);if(['Vorherige Beziehungen','Weitere Beziehungen'].includes(focusedPageLabel)){const target=focusedPageLabel==='Vorherige Beziehungen'?previous:next;(target.disabled?(target===previous?next:previous):target).focus({preventScroll:true});}}
  }
  function stop(){if(frame)win.cancelAnimationFrame(frame);frame=0;lastTime=null;}
  function paintTrace(progress){
    traceProgress=progress;traceLine.style.strokeDasharray=String(traceLength);traceLine.style.strokeDashoffset=String(traceLength*(1-progress));
    if(traceLength){const point=traceLine.getPointAtLength(traceLength*progress);cursor.setAttribute('cx',String(point.x));cursor.setAttribute('cy',String(point.y));}
    cursor.classList.toggle('rh-cursor-arrived',progress===1);pause.disabled=progress===1&&!localPaused;
  }
  function blocked(){return motion.paused||localPaused||doc.hidden;}
  function tick(time){frame=0;if(blocked())return;if(lastTime!==null)traceProgress=Math.min(1,traceProgress+(time-lastTime)/1050);lastTime=time;paintTrace(traceProgress);if(traceProgress<1)frame=win.requestAnimationFrame(tick);else lastTime=null;}
  function measureTrace(){
    const base=matrix.getBoundingClientRect(),origin=rowLabels[saved.from].getBoundingClientRect(),target=cellButtons.find(candidate=>candidate.from===saved.from&&candidate.to===saved.to).element.getBoundingClientRect(),destination=columnLabels[saved.to].getBoundingClientRect();
    const x1=origin.right-base.left-3,y1=origin.top-base.top+origin.height/2,x2=target.right-base.left-5,y2=destination.bottom-base.top+2,bend=target.bottom-base.top-6;
    const radius=Math.min(11,Math.max(2,(x2-x1-16)/2),Math.max(2,(bend-y2)/2));
    const path=`M ${x1} ${y1} C ${x1+10} ${y1} ${x1+6} ${bend} ${x1+16} ${bend} H ${x2-radius} Q ${x2} ${bend} ${x2} ${bend-radius} V ${y2}`;
    thread.setAttribute('viewBox',`0 0 ${base.width} ${base.height}`);traceBase.setAttribute('d',path);traceLine.setAttribute('d',path);traceLength=traceLine.getTotalLength();paintTrace(traceProgress);
  }
  function trace(animate=false){stop();traceProgress=animate&&!motion.quiet&&!motion.reduced&&!blocked()?0:1;measureTrace();if(traceProgress<1)frame=win.requestAnimationFrame(tick);}
  function syncMotion(){
    stop();root.classList.toggle('rh-is-paused',blocked());pause.textContent=localPaused?'Fortsetzen':'Pause';pause.setAttribute('aria-pressed',String(localPaused));
    if(motion.quiet||motion.reduced)paintTrace(1);else if(traceProgress<1&&!blocked())frame=win.requestAnimationFrame(tick);
  }
  win.addEventListener('atlas:motionchange',event=>{motion={...motion,...event.detail};syncMotion();},{signal:abort.signal});
  doc.addEventListener('visibilitychange',syncMotion,{signal:abort.signal});
  win.addEventListener('resize',measureTrace,{signal:abort.signal});
  renderSelection();
  const resize=typeof win.ResizeObserver==='function'?new win.ResizeObserver(measureTrace):null;resize?.observe(matrix);trace();
  return {destroy(){stop();resize?.disconnect();abort.abort();selectionAbort.abort();root.remove();}};
}
