import { mountAtlasSpace } from './atlas-space.mjs';
import { atlasNodes, atlasEdges, atlasLineage } from './atlas-relations.mjs';
import { sources } from './knowledge.mjs';
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = value => (Array.isArray(value) ? value : [value]).filter(Boolean).map(text => `<p>${escape(text)}</p>`).join('');
const sourceById = new Map(sources.map(item => [item.id,item]));
const lineageById = new Map(atlasLineage.map(item => [item.id,item]));
const nodeById = new Map(atlasNodes.map(item => [item.id,item]));
const link = (url,title) => /^https?:\/\//.test(url || '') ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(title)} <span aria-hidden="true">↗</span></a>` : '';
const reader = document.querySelector('#atlas-reader');
let selected = atlasNodes[0], selectedTab = 'moment', graph;
const tabs = {moment:'Im Alltag', connections:'Verbindungen', possibilities:'Spielraum', origins:'Herkunft'};
const dossierQueries = {'gefuehlswelle':'Affekt','wut':'Wut','leere':'Leere','rueckzug':'Rückzug','entfremdung':'Dissoziation','antwort-aus':'Zurückweisung','verlustangst':'Verlassen','naehe-druck':'Bindung','abstand':'Nähe','eigene-grenze':'Nähe','gemeinsam-regulieren':'Regulation','kritik':'Zurückweisung','scham-schuld':'Scham','selbstbild':'Identität','mensch-rolle':'Selbstpräsentation','normen':'Stigma','beobachtung-deutung':'Mentalisieren','andere-innenwelt':'Mentalisieren','wirkung-absicht':'Empathie','validierung':'Vertrauensbildung','verantwortung':'Reparatur','passung-macht':'Stigma','pause':'Stress','reparatur':'Reparatur','entwicklung':'Recovery','ueberlappung':'BPS','unterstuetzungskosten':'Erschöpfung','behandlung':'Recovery'};
function lineageDetail(item, technical = true) {
  return `<div class="reader-source"><h3>${escape(item.title)}</h3><p class="caption">${escape(item.kind)} · ${escape(item.authorStatus)}</p>${paragraphs(item.incorporated)}${item.passage ? `<p class="caption">Geprüfte Stelle: ${escape(item.passage)}</p>` : ''}${paragraphs(item.limit)}${link(item.url,'Zum bestehenden Werk')}${technical && item.path ? `<details class="technical"><summary>Technische Herkunft öffnen</summary><code>${escape(item.path)}</code></details>` : ''}</div>`;
}
function originBody(node) {
  return `${paragraphs(node.knowledgeStatus)}${(node.lineageIds || []).map(id => lineageById.get(id)).filter(Boolean).map(item => lineageDetail(item)).join('')}${(node.atlasRefs || []).map(item => `<p>${link(item.url,item.title)}</p>`).join('')}${(node.sourceIds || []).map(id => sourceById.get(id)).filter(Boolean).map(item => `<div class="reader-source"><h3>${escape(item.title)}</h3><p class="caption">${escape(item.type)} · ${escape(item.date)}</p>${paragraphs(item.claim)}<p class="caption">${escape(item.limit)}</p>${link(item.url,'Originalquelle öffnen')}</div>`).join('')}`;
}
function readerBody(node) {
  if(selectedTab === 'origins') return originBody(node);
  if(selectedTab === 'possibilities') return `<h3>Eine mögliche nächste Handlung</h3>${paragraphs(node.action)}<p class="reader-question">${escape(node.question)}</p><div class="actions"><a href="#trigger">An einer eigenen Situation weiterdenken <span aria-hidden="true">↗</span></a></div><p class="caption" style="margin-top:20px">Eine Möglichkeit, keine Anweisung. Du kannst den Gedanken auch offenlassen.</p>`;
  if(selectedTab === 'connections') {
    const edges = atlasEdges.filter(edge => edge.from===node.id || edge.to===node.id);
    return `<p class="caption">Dieselben Begriffe begegnen dir in mehreren Zusammenhängen. Eine Verbindung erklärt keinen einzelnen Menschen.</p><ul class="reader-relations">${edges.map((edge,index) => {const other=nodeById.get(edge.from===node.id ? edge.to : edge.from); return `<li><button data-follow="${escape(other.id)}"><small>${escape(edge.label)} <span aria-hidden="true">↗</span></small>${escape(other.title)}</button><p>${escape(edge.explanation)}</p><button class="relation-limit" data-relation="${index}">Aussagegrenze ansehen</button></li>`;}).join('')}</ul>`;
  }
  return `<div class="scene-quote">${paragraphs(node.situation)}</div><h3>Was sich beobachten lässt</h3>${paragraphs(node.observation)}<h3>Eine mögliche Lesart</h3>${paragraphs(node.interpretation)}<details><summary>Was wir noch nicht wissen</summary>${paragraphs(node.uncertainty)}</details>`;
}
function renderNode(node, {focusReader = false} = {}) {
  selected = node;
  reader.innerHTML = `<p class="reader-context">${escape(node.group)}</p><h2>${escape(node.title)}</h2><p class="reader-summary">${escape(node.summary)}</p><div class="reader-tabs" aria-label="Ausgewählten Zusammenhang entfalten">${Object.entries(tabs).map(([key,title]) => `<button data-reader-tab="${key}" aria-pressed="${selectedTab===key}">${escape(title)}</button>`).join('')}</div><div class="reader-body">${readerBody(node)}</div><div class="reader-deeper"><span class="caption">Im vorhandenen Phänomenatlas weitergehen</span><button data-open-dossier="${escape(dossierQueries[node.id] || '')}">${escape(node.id==='ueberlappung' ? 'Überschneidungen' : dossierQueries[node.id] || 'Alle Themenfelder')} erkunden <span aria-hidden="true">↗</span></button></div>`;
  graph?.select(node.id);
  if(focusReader) {reader.setAttribute('tabindex','-1');reader.focus({preventScroll:true});}
}
function renderEdge(edge) {
  const from = nodeById.get(edge.from), to = nodeById.get(edge.to);
  reader.innerHTML = `<p class="reader-context">Eine mögliche Beziehung</p><h2>${escape(edge.label)}</h2><div class="reader-body"><p class="scene-quote">${escape(from.title)}<br><span aria-hidden="true">↔</span><br>${escape(to.title)}</p><h3>Was diese Verbindung meint</h3>${paragraphs(edge.explanation)}<h3>Wo ihre Aussage endet</h3>${paragraphs(edge.limit)}<div class="actions"><button data-follow="${escape(from.id)}">${escape(from.title)}</button><button data-follow="${escape(to.id)}">${escape(to.title)}</button></div>${(edge.lineageIds || []).map(id=>lineageById.get(id)).filter(Boolean).map(item=>lineageDetail(item)).join('')}</div>`;
}
function choose(node, {move = false} = {}) {
  if(!node) return;
  renderNode(node);
  if(move) graph.focus(node.id,{zoom:window.innerWidth < 800 ? 1 : .95});
}
reader.addEventListener('click',event=>{
  const deeper=event.target.closest('[data-open-dossier]');
  if(deeper) {location.hash='erleben';window.dispatchEvent(new CustomEvent('atlas-dossier-search',{detail:{query:deeper.dataset.openDossier,kind:selected.id==='ueberlappung' ? 'findings' : 'phenomena'}}));return;}
  const tab=event.target.closest('[data-reader-tab]');
  if(tab) {selectedTab=tab.dataset.readerTab; renderNode(selected);reader.querySelector(`[data-reader-tab="${selectedTab}"]`).focus({preventScroll:true}); return;}
  const follow=event.target.closest('[data-follow]');
  if(follow) {choose(nodeById.get(follow.dataset.follow),{move:true}); return;}
  const relation=event.target.closest('[data-relation]');
  if(relation) renderEdge(atlasEdges.filter(edge => edge.from===selected.id || edge.to===selected.id)[Number(relation.dataset.relation)]);
});
graph=mountAtlasSpace({container:document.querySelector('#relationship-space'),nodes:atlasNodes,edges:atlasEdges,onSelect:node=>choose(node),onEdgeSelect:renderEdge});
const groups=[...new Set(atlasNodes.map(node=>node.group))];
const lens=document.querySelector('#atlas-lens');
lens.innerHTML += groups.map(group=>`<option value="${escape(group)}">${escape(group)}</option>`).join('');
lens.addEventListener('change',()=>graph.setLens(lens.value==='all' ? ()=>true : node=>node.group===lens.value));
const entryNodes={antwort:'antwort-aus',absage:'verlustangst',hilfe:'gemeinsam-regulieren',grenze:'eigene-grenze'};
function chooseEntry(key,move=true) {
  const node=nodeById.get(entryNodes[key]) || atlasNodes[0];
  selectedTab='moment';choose(node,{move});
  document.querySelectorAll('[data-atlas-entry]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.atlasEntry===key)));
}
document.querySelectorAll('[data-atlas-entry]').forEach(button=>button.addEventListener('click',()=>chooseEntry(button.dataset.atlasEntry)));
const finder=document.querySelector('#atlas-finder'), input=document.querySelector('#atlas-search'),results=document.querySelector('#atlas-search-results');
document.querySelector('#open-atlas-search').addEventListener('click',event=>{finder.hidden=!finder.hidden;event.currentTarget.setAttribute('aria-expanded',String(!finder.hidden));if(!finder.hidden)input.focus();});
input.addEventListener('input',()=>{
  const query=input.value.trim().toLocaleLowerCase('de');
  const matches=query ? atlasNodes.filter(node=>[node.title,node.summary,node.group,node.situation].join(' ').toLocaleLowerCase('de').includes(query)) : [];
  results.innerHTML = matches.length ? matches.map(node=>`<button data-search-node="${escape(node.id)}">${escape(node.title)}</button>`).join('') : query ? '<p class="caption">Zu diesem Wort wurde kein passender Begriff gefunden. Eine andere Formulierung kann helfen.</p>' : '';
});
results.addEventListener('click',event=>{const button=event.target.closest('[data-search-node]');if(button)choose(nodeById.get(button.dataset.searchNode),{move:true});});
document.querySelector('#atlas-lineage').innerHTML = `<div class="lineage-list">${atlasLineage.map(item=>`<article class="lineage-entry"><h3>${escape(item.title)}</h3><div>${paragraphs(item.incorporated)}<p class="caption">${escape(item.kind)} · ${escape(item.authorStatus)}<br>${escape(item.passage)}</p><p class="caption">${escape(item.limit)}</p>${link(item.url,'Bestehendes Werk öffnen')}${item.path ? `<details class="technical"><summary>Technische Herkunft öffnen</summary><code>${escape(item.path)}</code></details>` : ''}</div></article>`).join('')}</div>`;
chooseEntry('antwort',false);
// Initial local context is legible on small screens; the explicit overview stays available.
requestAnimationFrame(()=>{if(window.innerWidth<800)graph.focus(selected.id,{zoom:1});});

document.querySelector('#read-selected').addEventListener('click',()=>{reader.scrollIntoView({block:'start',behavior:'auto'});reader.setAttribute('tabindex','-1');reader.focus({preventScroll:true});});
