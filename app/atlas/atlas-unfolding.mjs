// Presentation only: existing nodes, listeners, media and source texts are moved,
// never copied into a second content model.
const memories = new WeakMap();
const controllers = new WeakMap();
const colors = ['#8ed2bd','#ef967d','#e9c778','#b7a5df','#9fc7e1','#d8b9a6'];
const svgNS='http://www.w3.org/2000/svg';
function leaf(index){
 const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('viewBox','0 0 180 112');svg.setAttribute('aria-hidden','true');
 const forms=[['M12 86 Q24 23 82 12 L163 44 102 99Z','M12 86 82 12 102 99','M82 12 163 44 102 99'],['M16 72 57 10 Q136 8 164 83 L86 101Z','M16 72 57 10 86 101','M57 10 164 83 86 101'],['M13 88 37 24 112 9 167 69 92 102Z','M13 88 112 9 92 102','M112 9 167 69 92 102']][index%3];
 for(let i=0;i<3;i++){const path=document.createElementNS(svgNS,'path');path.setAttribute('d',forms[i]);path.setAttribute('fill',i===0?colors[index%colors.length]:i===1?'#ffffff':'#101727');path.setAttribute('fill-opacity',i===0?'1':i===1?'.2':'.16');svg.append(path);}
 const line=document.createElementNS(svgNS,'path');line.setAttribute('d','M3 103 Q60 92 90 103 T177 103');line.setAttribute('fill','none');line.setAttribute('stroke',colors[index%colors.length]);line.setAttribute('stroke-width','1.5');svg.append(line);return svg;
}
export function graphicTabs(nav){
 if(!nav||nav.classList.contains('af-graphic-tabs'))return;
 nav.classList.add('af-graphic-tabs');nav.querySelectorAll('button').forEach((button,i)=>button.prepend(leaf(i)));
}
export function unfoldSurface(target,{key='surface',title='Einen Zugang entfalten',intro='Wähle einen Flügel und gehe von dort ins Detail.',groups=[],after=null}={}){
 if(target.querySelector(':scope > .af-unfold'))return controllers.get(target);
 controllers.get(target)?.destroy();
 const available=groups.map(g=>({...g,nodes:(g.nodes||[]).filter(Boolean)})).filter(g=>g.nodes.length);
 if(!available.length)return;
 let memory=memories.get(target);if(!memory){memory={};memories.set(target,memory);}
 const shell=document.createElement('section');shell.className='af-unfold';shell.setAttribute('aria-label',title);
 const heading=document.createElement('h3');heading.className='af-title';heading.textContent=title;
 const description=document.createElement('p');description.className='af-intro';description.textContent=intro;
 const nav=document.createElement('nav');nav.className='af-fan';nav.setAttribute('aria-label',title);
 const panels=document.createElement('div');panels.className='af-panels';shell.append(heading,description,nav,panels);
 if(after)after.after(shell);else target.prepend(shell);
 const list=[];
 available.forEach((group,i)=>{
  const button=document.createElement('button');button.type='button';button.className='af-wing';button.style.setProperty('--af-color',colors[i%colors.length]);button.setAttribute('aria-expanded','false');
  const label=document.createElement('strong');label.textContent=group.label;const hint=document.createElement('span');hint.textContent=group.hint||'Entfalten';button.append(leaf(i),label,hint);nav.append(button);
  const detail=document.createElement('details');detail.className='af-fold';const summary=document.createElement('summary');summary.textContent=group.label;const content=document.createElement('div');content.className='af-content';content.append(...group.nodes);detail.append(summary,content);panels.append(detail);
  const update=()=>{button.setAttribute('aria-expanded',String(detail.open));shell.classList.toggle('af-has-open',list.some(pair=>pair.detail.open));};
  const open=()=>{const next=!detail.open;for(const pair of list)if(pair.detail!==detail)pair.detail.open=false;detail.open=next;memory[key]=next?group.label:null;list.forEach(pair=>pair.update());};
  button.onclick=open;summary.addEventListener('click',e=>{e.preventDefault();open();});
  list.push({detail,button,update});
  if(memory[key]===group.label)detail.open=true;
 });
 list.forEach(pair=>pair.update());
 const observers=[];
 // Long catalogues unfold in small batches. All original nodes and their
 // listeners remain in place; the existing server/load-more path is retained.
 for(const results of shell.querySelectorAll('.shared-results,.shared-media-list,.shared-external-list')){
  let limit=6;const more=document.createElement('button');more.type='button';more.className='af-show-more';
  const draw=()=>{const rows=Array.from(results.children);rows.forEach((node,i)=>node.hidden=i>=limit);more.hidden=rows.length<=limit;more.textContent=`Weitere ${Math.min(6,Math.max(0,rows.length-limit))} entfalten`;};
  results.after(more);more.onclick=()=>{limit+=6;draw();};const observer=new MutationObserver(draw);observer.observe(results,{childList:true});observers.push(observer);draw();
 }
 const controller={destroy(){observers.forEach(observer=>observer.disconnect());controllers.delete(target);}};controllers.set(target,controller);return controller;
}
export function unfoldReader(target){
 const nodes=selector=>Array.from(target.querySelectorAll(':scope > '+selector));
 const text=[...nodes('.shared-level'),...nodes('.shared-prose'),...nodes('.shared-editorial')];
 for(const prose of nodes('.shared-prose')){
  const headings=Array.from(prose.children).filter(node=>/^H[2-4]$/.test(node.tagName));
  for(const heading of headings){const fold=document.createElement('details');fold.className='af-text-fold';const summary=document.createElement('summary');summary.textContent=heading.textContent;heading.before(fold);fold.append(summary);let node=heading.nextSibling;while(node&&!/^H[2-4]$/.test(node.nodeName)){const next=node.nextSibling;fold.append(node);node=next;}heading.remove();}
 }
 return unfoldSurface(target,{key:'reader',title:'Von hier aus tiefer gehen',intro:'Der Text, seine Verbindungen und seine Herkunft bleiben eigene Zugänge.',after:target.querySelector('.shared-lead'),groups:[
  {label:'Text entfalten',hint:'Die vollständige Lesefassung',nodes:text},
  {label:'Verbindungen',hint:'Weiterlesen und gegenüberstellen',nodes:[...nodes('.shared-reading-links'),...nodes('.shared-reading-actions')]},
  {label:'Herkunft',hint:'Original und Aussagegrenze',nodes:nodes('.shared-source-return')},
  {label:'Meine Spur',hint:'Privat markieren und notieren',nodes:nodes('.shared-reader-marks')},
  {label:'Medien',hint:'Hören und sehen',nodes:[...nodes('.shared-media-heading'),...nodes('.shared-media-list')]}
 ]});
}
export function unfoldWorkshop(target,view){
 const one=s=>target.querySelector(s),all=s=>Array.from(target.querySelectorAll(s));
 const g=(label,selectors,hint)=>({label,hint,nodes:selectors.flatMap(s=>all(s))});
 const configurations={
  register:[g('Atlasbereiche',['.shared-landscape'],'Die Sammlung als Ganzes'),g('Einträge',['.shared-library-heading','.shared-results','#shared-more'],'In kleinen Schritten lesen')],
  methods:[g('Eine Situation auseinanderlegen',['.shared-method-practice'],'Beobachten, deuten, handeln'),g('Wortlaut erkunden',['.shared-phrase'],'Ein bestehendes Instrument öffnen'),g('Ressourcen finden',['.shared-course-options','#resource-count','.shared-results'],'Passend zum gewählten Kontext')],
  course:[g('Ausgangslage',['.shared-course-options','#course-context'],'Instrument, Szene und Lesart'),g('Verlauf erkunden',['.shared-course-stages','#course-reading','#course-branches'],'Einen Schritt nach dem anderen'),g('Herkunft',[':scope > details'],'Originalinstrumente und Grenzen')],
  compare:[g('Auswahl verändern',['.shared-compare-pickers'],'Bis zu drei Einträge'),...all('.shared-compare > article').map(node=>({label:node.querySelector('h3')?.textContent||'Vergleich',hint:'Eine Beschreibung entfalten',nodes:[node]})),g('Vergleichsfragen',[':scope > .shared-level'],'Unterschiede bewusst erhalten')],
  media:[g('Medien öffnen',['.shared-media-list'],'In Bild, Ton und Text eintreten'),g('Fachquellen',['.shared-external-list'],'Öffentliche Grundlagen'),g('Weitere Zugänge',['.shared-media-alternatives'],'Netz und Lernansichten')],
  companion:[g('Eine Frage entwickeln',['[data-ac-form]','[data-ac-status]','[data-ac-result]'],'Kontext bewusst auswählen'),g('Verbindung einrichten',['[data-ac-settings]'],'Nur auf deinen Auftrag senden'),g('Den eigenen Rhythmus wählen',[':scope > details:not([data-ac-settings])'],'Lesen, Bewegung und Medien')],
  relationships:[g('Wortlaut untersuchen',['[data-rw-form]'],'Mit einer konkreten Situation beginnen'),g('Lesarten entfalten',['[data-rw-result]','[data-rw-reflect]'],'Ergebnis und Gegenlesart'),g('Deine Sitzung',[':scope > section:not([data-rw-reflect])',':scope > details'],'Übernehmen, exportieren, Herkunft')]
 };
 if(view==='neurotools'){graphicTabs(one('nav[aria-label="Neuroatlas-Werkzeuge"]'));return;}
 if(view==='learn'){
  const body=one('#shared-learning-body');if(!body)return;
  const groups=[{label:'Lesewege',hint:'Vom Ganzen zur eigenen Frage',nodes:all('.shared-learning-paths, #shared-path-reading').filter(node=>!node.closest('details'))},g('Überlieferte Lernpfade',['#shared-learning-body > details'],'Bestehende Wege weitergehen'),g('Eine Lernkarte',['.shared-flashcard','#notebook-card-select'],'Fragen und Antworten entfalten')];
  return unfoldSurface(body,{key:'learn',groups,after:body.querySelector(':scope > p')});
 }
 const groups=configurations[view];if(!groups)return;
 const heading=one(':scope > h2')||one(':scope > header')||one(':scope > .shared-graph-heading')||one('.ac-heading');
 return unfoldSurface(target,{key:view,groups,after:heading?.nextElementSibling?.tagName==='P'?heading.nextElementSibling:heading});
}
