import { publicText } from './atlas-public-copy.mjs';
import { renderNotebookItem } from './notebook-context.mjs';
import { openAtlasImageViewer } from './atlas-image-viewer.mjs';

const human = value => publicText(value).replace(/\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/ig,'Herkunftsnachweis').replace(/\b[0-9a-f]{24,}\b/ig,'Herkunftsnachweis');
const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc = value => escape(human(value));
const safeURL = value => /^(https?:\/\/|(?:\.\/)?assets\/)/i.test(value || '') && !/[\u0000-\u001f]/.test(value) ? escape(value) : '';
const fold = value => human(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('de');
const names = {video:'Filme',audio:'Hören',text:'Lesen',image:'Bilder & Karten'};
let sequence = 0;

export function libraryKind(item) {
  const format=String(item.format || '').toLowerCase();
  if(format.includes('audio')) return 'audio';
  if(format.includes('video')) return 'video';
  if(/bild|grafik|mindmap/.test(format) || /\.(png|jpe?g|webp)(?:$|\?)/i.test(item.file || '')) return 'image';
  return 'text';
}
/** One inventory over existing records; duplicates keep the richer context record. */
export function libraryInventory(context, media = []) {
  const result=[...(context.all || [])];
  const ids=new Set(result.map(item=>item.id)),files=new Set(result.map(item=>item.file).filter(Boolean));
  media.forEach((item,i)=>{
    if((item.id && ids.has(item.id)) || (item.file && files.has(item.file))) return;
    const row=item.id ? item : {...item,id:`library-media-${i+1}`};
    result.push(row);ids.add(row.id);if(row.file)files.add(row.file);
  });
  return result;
}
function loadStyle() {
  for(const name of ['notebook-library.css','atlas-image-viewer.css']) {
    const url=new URL(`./${name}`,import.meta.url).href;
    if(!Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(link=>link.href===url)) {
      const link=document.createElement('link');link.rel='stylesheet';link.href=url;document.head.append(link);
    }
  }
}
const excerpt = item => {
  const text = typeof item?.summary === 'string' ? item.summary : item?.blocks?.find(block=>block.text)?.text || '';
  return human(text).replace(/[#*_]/g,'').slice(0,180);
};
function visual(item, {landing=false}={}) {
  const kind=libraryKind(item);
  if(kind==='image') return `<span class="nl-visual nl-image"><img src="${safeURL(item.file)}" alt="" loading="lazy"></span>`;
  if(kind==='video') return `<span class="nl-visual nl-film">${item.poster?`<img src="${safeURL(item.poster)}" alt="" loading="lazy">`:'<span class="nl-film-placeholder" aria-hidden="true">Film</span>'}<span class="nl-play" aria-hidden="true">▷</span></span>`;
  if(kind==='audio') return `<span class="nl-visual nl-wave">${item.id==='notebook-trauma-audio'?'<img src="assets/media/trauma-audio-waveform.png" alt="" loading="lazy">':'<span class="nl-sound-mark" aria-hidden="true">◖</span>'}<span>${landing?'Eine Stimme. Ein Gedanke. Zeit zum Zuhören.':'Audio anhören'}</span></span>`;
  return `<span class="nl-visual nl-pages"><span class="nl-page"><small>${esc(item.format || 'Text')}</small><strong>${esc(item.title)}</strong></span><span class="nl-page"><span>${esc(excerpt(item))}</span><i aria-hidden="true"></i></span></span>`;
}

/** Progressive entry into the complete existing inventory. Never starts playback. */
export function mountNotebookLibrary(host,{context,media=[],onClose=()=>{},node,initialItemId}={}) {
  if(!host || !context)throw new Error('Für die Mediathek fehlen vorhandene Materialien.');
  loadStyle();
  const previousFocus=document.activeElement,uid=`notebook-library-${++sequence}`;
  const inventory=libraryInventory(context,media);
  const element=document.createElement('section');element.className='notebook-library';element.dataset.view='landing';
  element.setAttribute('aria-labelledby',`${uid}-title`);
  element.innerHTML=`<header class="nl-header"><div><p>Stimmen & Wissen</p><h1 id="${uid}-title">Medien</h1></div><div class="nl-header-aside"><p>Ein Thema kann viele Zugänge haben.</p><button type="button" class="nl-close">Zurück <span aria-hidden="true">↗</span></button></div></header><div class="nl-scope"><p class="nl-scope-title"></p><button type="button" class="nl-scope-switch"></button></div><div class="nl-landing"><div class="nl-doorways"></div><button type="button" class="nl-discover">Alle Materialien entdecken <span aria-hidden="true">→</span></button></div><section class="nl-collection" aria-label="Materialauswahl" hidden><div class="nl-collection-heading"><button type="button" class="nl-home">← Medienübersicht</button><h2></h2><p class="nl-result-count" role="status" aria-live="polite"></p></div><details class="nl-find"><summary>Suchen & eingrenzen</summary><div><label for="${uid}-search">Thema oder Wort<input id="${uid}-search" type="search" autocomplete="off" placeholder="Zum Beispiel Schlaf …"></label><label for="${uid}-format">Materialform<select id="${uid}-format"><option value="">Alle Formen</option>${Object.entries(names).map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label></div></details><div class="nl-material-list" role="list" aria-label="Vorhandene Materialien"></div></section><main class="nl-reader" tabindex="-1" aria-label="Geöffnetes Material" hidden><div class="nl-reader-heading"><button type="button" class="nl-reader-back">← Zur Auswahl</button><span class="nl-reader-position"></span></div><div class="nl-reading-surface"></div><nav class="nl-step" aria-label="Zwischen Materialien wechseln"><button type="button" class="nl-previous">← Vorheriges Material</button><button type="button" class="nl-next">Nächstes Material →</button></nav></main>`;
  host.append(element);
  let scopeNode=Boolean(node),selectedId=initialItemId,visible=[],destroyed=false,returnView='landing',returnTrigger=null;
  const input=element.querySelector('input'),format=element.querySelector('select');
  const list=element.querySelector('.nl-material-list'),reader=element.querySelector('.nl-reader'),surface=element.querySelector('.nl-reading-surface');
  const landing=element.querySelector('.nl-landing'),collection=element.querySelector('.nl-collection');
  const scope=()=>scopeNode?context.forNode(node):inventory;
  function pause(){surface.querySelectorAll('audio,video').forEach(player=>player.pause());}
  function show(view,{focus=false}={}) {
    if(view!=='reader')pause();
    if(view!=='reader')element.classList.remove('nl-artwork');
    element.dataset.view=view;landing.hidden=view!=='landing';collection.hidden=view!=='collection';reader.hidden=view!=='reader';
    if(focus){const target=view==='reader'?reader:view==='collection'?element.querySelector('.nl-home'):element.querySelector('.nl-discover');target.focus({preventScroll:true});}
  }
  function renderLanding() {
    const rows=scope();
    element.querySelector('.nl-scope-title').textContent=scopeNode?`Verbunden mit „${human(node.title || node.name || 'diesem Ort')}“`:'';
    const switcher=element.querySelector('.nl-scope-switch');switcher.hidden=!node;switcher.textContent=scopeNode?'Alle Materialien öffnen →':'Zum Zusammenhang zurück';
    const picks={video:rows.find(item=>item.id==='va-cpt')||rows.find(item=>libraryKind(item)==='video'&&item.poster)||rows.find(item=>libraryKind(item)==='video'),audio:rows.find(item=>libraryKind(item)==='audio'),text:rows.find(item=>item.format==='Lernbericht')||rows.find(item=>libraryKind(item)==='text'),image:rows.find(item=>libraryKind(item)==='image'&&!item.originWork)};
    element.querySelector('.nl-doorways').innerHTML=Object.entries(names).map(([kind,label])=>{
      const count=rows.filter(item=>libraryKind(item)===kind).length,item=picks[kind];
      return `<button type="button" class="nl-door nl-door-${kind}" data-kind="${kind}" ${count?'':'disabled'}>${item?visual(item,{landing:true}):'<span class="nl-visual nl-no-material">Noch kein Material</span>'}<span class="nl-door-label"><strong>${label}</strong><span>${count} ${kind==='text'?'Texte':kind==='image'?'Ansichten':'Beiträge'} <span aria-hidden="true">↗</span></span></span></button>`;
    }).join('');
    element.querySelector('.nl-discover').innerHTML=`Alle ${rows.length} Materialien entdecken <span aria-hidden="true">→</span>`;
  }
  function renderCollection() {
    const query=fold(input.value).trim();
    const contextMatches=new Set(context.search(input.value).map(item=>item.id));
    visible=scope().filter(item=>(!format.value || libraryKind(item)===format.value)&&(!query || contextMatches.has(item.id)||fold([item.title,item.summary,item.producer,...(item.tags||[])].join(' ')).includes(query)));
    element.querySelector('.nl-collection-heading h2').textContent=names[format.value] || 'Alle Materialien';
    element.querySelector('.nl-result-count').textContent=`${visible.length} Materialien`;
    list.innerHTML=visible.length?visible.map(item=>`<div role="listitem" class="nl-shelf-item nl-kind-${libraryKind(item)}"><button type="button" class="nl-material" data-item-id="${escape(item.id)}">${visual(item)}<span class="nl-material-label"><small>${esc(item.format==='video'?'Video':item.format)}</small><strong>${esc(item.title)}</strong>${item.match&&!item.originWork?'<em>Thematisch verbunden</em>':''}<span aria-hidden="true">Öffnen ↗</span></span></button></div>`).join(''):'<p class="nl-empty">Zu dieser Auswahl gibt es kein Material. Du kannst ein anderes Wort suchen oder alle Formen wählen.</p>';
  }
  function browse(kind='',trigger=null) {returnTrigger=trigger;format.value=kind;input.value='';renderCollection();show('collection',{focus:true});}
  function choose(id,{focus=true}={}) {
    let item=visible.find(item=>item.id===id);
    if(!item){item=inventory.find(item=>item.id===id);if(!item)return false;scopeNode=false;input.value='';format.value='';renderLanding();renderCollection();}
    if(element.dataset.view!=='reader')returnView=element.dataset.view;
    pause();selectedId=id;element.classList.toggle('nl-artwork',item.originWork==='Walter Andreas Kirchner');surface.innerHTML=renderNotebookItem(item);
    if(libraryKind(item)==='image' && safeURL(item.file)) {
      const figure=surface.querySelector('figure');
      if(figure){const image=figure.querySelector('img');image.alt=human(item.originWork?item.title:item.alt || item.alternative || item.title);const button=document.createElement('button');button.type='button';button.className='nl-open-image';button.textContent=/mindmap/i.test(item.format)?'Karte vergrößern ↗':'Ganzes Bild ansehen ↗';button.addEventListener('click',()=>openAtlasImageViewer({src:item.file,title:human(item.title),alt:human(item.originWork?item.title:item.alt || item.alternative || item.title),sourceLabel:human((item.provenance || item.producer || '').replace(/\s*Reproduktion von der Künstlerwebsite\.?/g,'')),sourceURL:item.sourceURL,trigger:button}));figure.append(button);}
    }
    if(safeURL(item.sourceURL)) {const p=document.createElement('p');p.className='nl-original-source';p.innerHTML=`<a href="${safeURL(item.sourceURL)}" target="_blank" rel="noopener noreferrer">Quelle ↗</a>`;surface.append(p);}
    const index=visible.findIndex(row=>row.id===id);
    element.querySelector('.nl-reader-position').textContent=`${index+1} von ${visible.length} · ${human(item.format==='video'?'Video':item.format)}`;
    element.querySelector('.nl-previous').disabled=index<=0;element.querySelector('.nl-next').disabled=index<0||index>=visible.length-1;
    reader.scrollTop=0;show('reader',{focus});if(focus)element.scrollIntoView({block:'start',behavior:'instant'});return true;
  }
  const close=()=>{if(destroyed)return;destroy();onClose();};
  element.addEventListener('click',event=>{
    const type=event.target.closest('[data-kind]');if(type)browse(type.dataset.kind,type);
    const material=event.target.closest('[data-item-id]');if(material){returnTrigger=material;choose(material.dataset.itemId);}
  });
  input.addEventListener('input',renderCollection);format.addEventListener('change',renderCollection);
  element.querySelector('.nl-close').addEventListener('click',close);
  element.querySelector('.nl-discover').addEventListener('click',event=>browse('',event.currentTarget));
  element.querySelector('.nl-home').addEventListener('click',()=>{show('landing');element.querySelector(`[data-kind="${format.value}"]`)?.focus({preventScroll:true});});
  element.querySelector('.nl-scope-switch').addEventListener('click',()=>{scopeNode=!scopeNode;renderLanding();renderCollection();show('landing',{focus:true});});
  element.querySelector('.nl-reader-back').addEventListener('click',()=>{show(returnView);if(returnTrigger?.isConnected)returnTrigger.focus({preventScroll:true});});
  for(const [selector,direction] of [['.nl-previous',-1],['.nl-next',1]])element.querySelector(selector).addEventListener('click',()=>{const index=visible.findIndex(item=>item.id===selectedId);if(visible[index+direction])choose(visible[index+direction].id);});
  element.addEventListener('keydown',event=>{if(event.key==='Escape'&&!event.defaultPrevented){event.preventDefault();if(element.dataset.view==='reader'){show(returnView,{focus:true});}else if(element.dataset.view==='collection')show('landing',{focus:true});else close();}});
  function destroy(){if(destroyed)return;pause();destroyed=true;element.remove();if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});}
  renderLanding();renderCollection();if(initialItemId)choose(initialItemId,{focus:false});
  element.querySelector('.nl-close').focus({preventScroll:true});
  return {destroy,select(id){return choose(id);},element};
}
