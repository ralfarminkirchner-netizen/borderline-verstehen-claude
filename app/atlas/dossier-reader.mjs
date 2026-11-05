import { dossierMetadata, dossierPhenomena, dossierFindings, dossierSources } from './dossier-data.mjs';
import { renderResearchConnections } from './research-program.mjs?v=20261102-recherche';

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host = document.querySelector('#dossier-library');
host.classList.add('dossier-library');
const sourceById = new Map(dossierSources.map(source => [source.id, source]));
const collections = {phenomena:dossierPhenomena, findings:dossierFindings, sources:dossierSources};
const names = {phenomena:'Phänomene',findings:'Forschungsbefunde',sources:'Quellfassungen'};
let active = 'phenomena';
const groups = [...new Set(dossierPhenomena.map(item=>item.group).filter(Boolean))];
const textOf = item => [item.title,item.group,item.status,item.summary,...(item.details || []).flatMap(part=>[part.label,part.text])].join(' ');
const detailHtml = item => (item.details || []).filter(part=>part.text).map(part=>`<div class="dossier-detail">${part.label ? `<h4>${esc(part.label)}</h4>` : ''}<p>${esc(part.text)}</p></div>`).join('');
const urlLink = (url,title) => /^https?:\/\//.test(url || '') ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} <span aria-hidden="true">↗</span></a>` : '';
const technicalHtml = item => `<details class="technical-details"><summary>Technische Herkunft anzeigen</summary>${[...(item.technicalDetails || []),...(item.provenance ? Object.entries(item.provenance).map(([label,text])=>({label,text})) : [])].map(part=>`<p><strong>${esc(part.label)}</strong><br>${esc(part.text)}</p>`).join('')}</details>`;
const sourceHtml = source => `<div class="dossier-source"><h4>${esc(source.title)}</h4>${source.status ? `<p class="caption">${esc(source.status)}</p>` : ''}${detailHtml(source)}${urlLink(source.url || source.urls?.[0],'Originalfundstelle öffnen')}${technicalHtml(source)}</div>`;
host.innerHTML = `<div class="dossier-heading"><div><p class="eyebrow">Dein vorhandener Phänomenatlas · 20. Oktober 2026</p><h2>Eine Landschaft, die schon da ist.</h2></div><p>96 Phänomene in 13 Themenfeldern. Klinische Domänen, Erfahrungen, Modelle und Ressourcen bleiben unterscheidbar. Der Katalog ist kein Selbsttest.</p></div><details class="dossier-provenance"><summary>Herkunft und Grenzen dieser Bestandslesung</summary><p>${esc(dossierMetadata.authorStatus)}</p><p>${esc(dossierMetadata.scope)}</p>${dossierMetadata.limits.map(text=>`<p>${esc(text)}</p>`).join('')}<p>Das bestehende Forschungsdossier wurde am 2. November 2026 aus dem ursprünglichen Bibliotheksverweis heruntergeladen und strukturiert erschlossen. Die folgenden Texte bewahren den Stand vom 20. Oktober. Sie wurden nicht als 96 neue medizinische Behauptungen recherchiert oder unabhängig bestätigt.</p><p>Aktuelle Gegenprüfungen und die ergänzende NotebookLM-Recherche findest du unter <a href="#quellen">Quellen</a>. Die Herkunft jedes Eintrags bleibt über seine Quellfassungen erreichbar.</p></details><div class="dossier-tabs" aria-label="Bestand erkunden">${Object.entries(names).map(([key,name])=>`<button data-dossier-kind="${key}" aria-pressed="${active===key}">${collections[key].length} ${name}</button>`).join('')}</div><div class="dossier-filters"><label>Im vorhandenen Bestand suchen<input type="search" id="dossier-search" placeholder="Zum Beispiel Bindung, Mentalisieren oder Masking" autocomplete="off"></label><label>Themenfeld<select id="dossier-group"><option value="all">Alle Themenfelder</option>${groups.map(group=>`<option>${esc(group)}</option>`).join('')}</select></label></div><p id="dossier-count" class="caption" role="status"></p><div id="dossier-results"></div>`;
const search = host.querySelector('#dossier-search'), group = host.querySelector('#dossier-group');
function render() {
  const query = search.value.trim().toLocaleLowerCase('de');
  const items = collections[active].filter(item=>(active!=='phenomena' || group.value==='all' || item.group===group.value) && (!query || textOf(item).toLocaleLowerCase('de').includes(query)));
  host.querySelector('#dossier-count').textContent = `${items.length} von ${collections[active].length} ${names[active]}`;
  host.querySelector('#dossier-results').innerHTML = items.length ? items.map((item,index)=>`<details class="dossier-entry" data-dossier-entry="${esc(item.id)}"><summary><span class="dossier-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><span>${item.group ? `<small>${esc(item.group)}</small>` : ''}<strong>${esc(item.title)}</strong>${item.status ? `<span class="caption">${esc(item.status)}</span>` : ''}</span></summary><div class="dossier-body">${item.summary ? `<p class="dossier-summary">${esc(item.summary)}</p>` : ''}${detailHtml(item)}${active==='sources' ? urlLink(item.url || item.urls?.[0],'Originalfundstelle öffnen') : (item.sourceIds || []).length ? `<details class="dossier-references"><summary>Zugehörige Quellfassungen ansehen</summary>${item.sourceIds.map(id=>sourceById.get(id)).filter(Boolean).map(sourceHtml).join('')}</details>` : ''}${active==='phenomena' ? renderResearchConnections(item.id) : ''}${technicalHtml(item)}</div></details>`).join('') : '<p class="dossier-empty">Zu dieser Auswahl wurde kein Eintrag gefunden. Du kannst den Suchbegriff oder das Themenfeld ändern.</p>';
}
host.addEventListener('click',event=>{
  const tab = event.target.closest('[data-dossier-kind]');
  if(!tab) return;
  active=tab.dataset.dossierKind;
  host.querySelectorAll('[data-dossier-kind]').forEach(button=>button.setAttribute('aria-pressed',String(button===tab)));
  group.disabled=active!=='phenomena';
  render();
});
search.addEventListener('input',render);group.addEventListener('change',render);
window.addEventListener('atlas-dossier-search',event=>{
  const requestedItem = dossierPhenomena.find(item=>item.id===event.detail?.phenomenonId);
  active=requestedItem ? 'phenomena' : collections[event.detail?.kind] ? event.detail.kind : 'phenomena';group.value='all';search.value=requestedItem?.title || (typeof event.detail==='string' ? event.detail : event.detail?.query || '');
  host.querySelectorAll('[data-dossier-kind]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.dossierKind===active)));
  group.disabled=active!=='phenomena';render();
  requestAnimationFrame(()=>{
    const entry=requestedItem && Array.from(host.querySelectorAll('[data-dossier-entry]')).find(element=>element.dataset.dossierEntry===requestedItem.id);
    if(entry){entry.open=true;entry.scrollIntoView({block:'start',behavior:'auto'});entry.querySelector('summary').focus({preventScroll:true});}
    else{host.scrollIntoView({block:'start',behavior:'auto'});search.focus({preventScroll:true});}
  });
});
render();
