import { triggerChapters, triggerScenes, triggerSources } from './trigger-data.mjs?v=20261102-trigger';
import { dossierPhenomena } from './dossier-data.mjs';
import { renderTriggerResearch } from './trigger-research.mjs?v=20261102-trigger';

const esc = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const perspectives = [
  {key:'inside',label:'Innen erleben',hint:'Wie sich der Moment anfühlen könnte'},
  {key:'outside',label:'Von außen unterscheiden',hint:'Was im Beispiel beobachtbar und was unbekannt ist'},
  {key:'choice',label:'Spielraum finden',hint:'Eine mögliche nächste Handlung, keine Pflicht'},
];
const jump = (key, label, reading) => `<a href="#${reading ? `trigger-${key}` : 'trigger'}"${reading ? '' : ` data-trigger-jump="trigger-${key}"`}>${esc(label)}</a>`;
const phenomenonLink = (number, reading) => {
  const id = `phenomenon:bpd:bps-ph-${String(number).padStart(3,'0')}`;
  const index = dossierPhenomena.findIndex(item => item.id === id);
  if (index < 0) throw new Error('Ein verknüpftes Triggerphänomen fehlt im Atlas.');
  const item = dossierPhenomena[index];
  const open = [53,54,61].includes(number);
  return `<a href="${reading ? `#dossier-phaenomen-${index + 1}` : '#erleben'}"${reading ? '' : ` data-research-phenomenon="${esc(id)}"`}>${esc(item.title)} <span aria-hidden="true">↗</span>${open ? '<small>offene Recherchefrage</small>' : number === 41 ? '<small>Modell · kein eigener Befund</small>' : ''}</a>`;
};

function renderSourceNotes(keys, id) {
  if (!keys?.length) return '';
  return `<details class="trigger-evidence"><summary>Forschung und Aussagegrenzen</summary><ol>${keys.map(key => {
    const source = triggerSources[key];
    if (!source) throw new Error('Ein Quellenbezug im Triggerraum fehlt.');
    return `<li id="trigger-source-${esc(id)}-${esc(key)}"><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} <span aria-hidden="true">↗</span></a><p>${esc(source.sample)} ${esc(source.limit)}</p><p class="trigger-source-scope">Geprüfter Zugang: ${esc(source.scope)}.</p></li>`;
  }).join('')}</ol></details>`;
}

function renderClaimNotes(keys) {
  if (!keys?.length) return '';
  return `<div class="trigger-claim-notes">${keys.map(key => {
    const source = triggerSources[key];
    return `<p><a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} <span aria-hidden="true">↗</span></a><span>${esc(source.limit)}</span></p>`;
  }).join('')}</div>`;
}

function renderSceneState(sceneIndex, stepIndex, perspectiveKey) {
  const scene = triggerScenes[sceneIndex];
  const step = scene.steps[stepIndex];
  const perspective = perspectives.find(item => item.key === perspectiveKey);
  return `<div class="trigger-scene-moment"><span class="trigger-scene-count">${stepIndex + 1} / ${scene.steps.length}</span><div><p class="eyebrow">${esc(step.label)}</p><h3>${esc(step.signal)}</h3></div></div><div class="trigger-perspective-copy"><p class="trigger-perspective-label">${esc(perspective.hint)}</p><p>${esc(step[perspectiveKey])}</p></div>`;
}

function renderScenes(reading) {
  if (reading) return `<section class="trigger-scenes trigger-scenes-static" id="trigger-verlauf"><p class="eyebrow">Zwei erfundene Mikroverläufe</p><h2>Was zwischen Reiz und Reaktion passiert.</h2><p>Die Beispiele sind neue, fiktive Lehrszenen. Zeiten und Abfolgen veranschaulichen Möglichkeiten; sie bilden keinen allgemeingültigen Ablauf und keinen persönlichen Bericht ab.</p>${triggerScenes.map(scene => `<article><h3>${esc(scene.title)}</h3><p>${esc(scene.setup)}</p>${scene.steps.map(step => `<section class="trigger-static-moment"><p class="eyebrow">${esc(step.label)}</p><h4>${esc(step.signal)}</h4>${perspectives.map(perspective => `<p><strong>${esc(perspective.label)}:</strong> ${esc(step[perspective.key])}</p>`).join('')}</section>`).join('')}</article>`).join('')}</section>`;
  return `<section class="trigger-scenes" id="trigger-verlauf" aria-labelledby="trigger-scene-heading"><div class="trigger-section-intro"><p class="eyebrow">Nicht nur den Höhepunkt ansehen</p><h2 id="trigger-scene-heading">Was geschieht in den Minuten davor?</h2><p>Ein Anlass bleibt derselbe. Seine Bedeutung kann sich verändern. Folge einer erfundenen Szene und wechsle zwischen Erleben, Beobachtung und Handlungsspielraum.</p></div><div class="trigger-scene-switch" role="group" aria-label="Eine fiktive Szene auswählen">${triggerScenes.map((scene,index) => `<button type="button" data-trigger-scene="${index}" aria-pressed="${index === 0}">${esc(scene.title)}</button>`).join('')}</div><div class="trigger-scene-stage"><p class="trigger-scene-setup" id="trigger-scene-setup">${esc(triggerScenes[0].setup)}</p><p class="trigger-fiction-note">Neu erfundene Lehrszene · keine Biografie · keine feste zeitliche Regel</p><div class="trigger-timeline" role="group" aria-label="Moment im Verlauf auswählen">${triggerScenes[0].steps.map((step,index) => `<button type="button" data-trigger-step="${index}" aria-pressed="${index === 0}"><span aria-hidden="true">${String(index + 1).padStart(2,'0')}</span>${esc(step.label)}</button>`).join('')}</div><div class="trigger-perspectives" role="group" aria-label="Perspektive auf den Moment auswählen">${perspectives.map((perspective,index) => `<button type="button" data-trigger-perspective="${perspective.key}" aria-pressed="${index === 0}">${esc(perspective.label)}</button>`).join('')}</div><div id="trigger-scene-state">${renderSceneState(0,0,'inside')}</div><p class="trigger-scene-status sr-only" id="trigger-scene-status" role="status" aria-live="polite"></p></div><p class="trigger-scene-reading">Die Uhr ist hier keine Norm: Die Forschung beschreibt Wechselbeziehungen in kurzen Abständen, keine feste Kette, die bei jedem Menschen gleich abläuft. Auch höhere durchschnittliche Belastung und stärkere zeitliche Wechselwirkungen sind verschiedene Befunde.</p>${renderSourceNotes(['minutes','daily'],'verlauf')}</section>`;
}

export function renderTriggerReader({reading = false} = {}) {
  const heading = reading ? 'h2' : 'h1';
  return `<div class="trigger-landscape${reading ? ' trigger-reading-landscape' : ''}"><header class="trigger-hero"><div class="trigger-hero-copy"><p class="eyebrow">Trigger · Bedeutung · Zustandswechsel</p><${heading}>Wenn aus einem Moment<br><em>ein Alarm</em> wird.</${heading}><p class="trigger-deck">Nicht nur fragen, was ausgelöst hat. Den Aufbau verstehen: Was war vorher? Was wird plötzlich gewiss? Wie viel Angst steckt im Ärger? Und was bleibt, wenn der Moment vorbei ist?</p><p class="trigger-hero-note">Ein Leseraum zwischen Borderline, Trauma, Bindung und Selbstwert. Ein Phänomen kann mehrere Zusammenhänge haben. Keiner davon lässt sich allein aus einer heftigen Reaktion ablesen.</p><div class="trigger-hero-actions">${jump('verlauf','Einen Verlauf ansehen ↓',reading)}${reading ? '' : '<a href="#trigger" data-trigger-jump="trigger-own-situation">Eine eigene Situation erkunden ↓</a>'}</div></div><figure class="trigger-field" aria-labelledby="trigger-field-caption"><div class="trigger-field-rings" aria-hidden="true"></div><div class="trigger-field-center"><span>Ein Moment.</span><strong>Mehr als<br>ein Zusammenhang.</strong></div><span class="trigger-field-node trigger-field-event">Was geschieht?</span><span class="trigger-field-node trigger-field-meaning">Was bedeutet es gerade?</span><span class="trigger-field-node trigger-field-body">Was spüre ich?</span><span class="trigger-field-node trigger-field-impulse">Wozu drängt es?</span><span class="trigger-field-node trigger-field-after">Was klingt nach?</span><figcaption id="trigger-field-caption">Eine Landkarte möglicher Wechselwirkungen.<br>Keine feste Reihenfolge.</figcaption></figure></header><div class="trigger-orientation"><p><strong>Auslöser ist nicht Ursache.</strong> Eine Reaktion ist kein Beweis für eine Diagnose, eine fremde Absicht oder eine verborgene Erinnerung.</p><p><strong>Alarm kann eine Gegenwart haben.</strong> Reale Abwertung, Gewalt und gebrochene Absprachen brauchen eine eigene Betrachtung.</p></div><nav class="trigger-contents" aria-label="Themen im Triggerleseraum"><p class="eyebrow">Acht Zugänge · miteinander verbunden</p><ol>${triggerChapters.map((chapter,index) => `<li>${jump(chapter.key,`${String(index + 1).padStart(2,'0')} ${chapter.kicker}`,reading)}</li>`).join('')}</ol></nav>${renderScenes(reading)}<div class="trigger-chapters">${triggerChapters.map((chapter,index) => `<article class="trigger-chapter" id="trigger-${esc(chapter.key)}"><header class="trigger-chapter-heading"><span class="trigger-chapter-number" aria-hidden="true">${String(index + 1).padStart(2,'0')}</span><p class="eyebrow">${esc(chapter.kicker)}</p><h2>${esc(chapter.title)}</h2></header><div class="trigger-chapter-body"><p class="trigger-chapter-intro">${esc(chapter.intro)}</p>${chapter.paragraphs.map((text,paragraphIndex) => `<p>${esc(text)}</p>${renderClaimNotes(chapter.citations?.[paragraphIndex])}`).join('')}<p class="trigger-focus"><span>Eine Frage zum Mitnehmen</span>${esc(chapter.focus)}</p><div class="trigger-atlas-links"><p>Im erarbeiteten Phänomenatlas weiterlesen</p><div>${chapter.links.map(number => phenomenonLink(number,reading)).join('')}</div></div>${renderSourceNotes(chapter.sources,chapter.key)}</div></article>`).join('')}</div><section class="trigger-return" id="trigger-nachwirkung"><p class="eyebrow">Die Zeit danach gehört dazu</p><h2>Der Alarm kann abklingen.<br>Die Nachwirkung braucht ihren eigenen Blick.</h2><div><p>Wieder ansprechbar zu sein heißt nicht automatisch, schon erholt zu sein. Vielleicht bleibt Scham, Erschöpfung oder das Bedürfnis, alles noch einmal zu erklären. Vielleicht kommt die Angst erst jetzt zum Vorschein, nachdem vorher nur Wut spürbar war. Das sind mögliche Verläufe, keine verborgene Erklärung für jede Wut. Auch die Erholungszeit gehört zur Spur: Was ist nach einigen Minuten anders, was nach einer Stunde, was erst am nächsten Tag? Das sind offene Beobachtungsfenster und keine Norm.</p><p>Im Rückblick kann eine kleine Beobachtung hilfreicher sein als ein Urteil über den ganzen Menschen: Wann wurde der Ton im Kopf schärfer? Was hätte ich zehn Minuten früher noch für möglich gehalten? Woran merke ich, dass eine Pause wirklich entlastet? Was muss zwischen uns noch geklärt oder repariert werden?</p><p>Eine Spur darf unvollständig bleiben. Sie kann mit einer vertrauten Person oder in Behandlung weiter betrachtet werden. Es ist auch möglich, den Leseraum einfach stehen zu lassen.</p></div></section><div class="trigger-editorial-note"><p>Diese neue redaktionelle Synthese verbindet überprüfte Forschungsbefunde mit den bestehenden Phänomenen und ihren Aussagegrenzen. Die Lehrszenen sind ausdrücklich erfunden. Sie erklären keine einzelne Person. Der Begriff „Trigger“ wird hier als alltagssprachlicher Zugang verwendet; BPS, PTBS, komplexe PTBS und narzisstische Persönlichkeitsstörung bleiben verschiedene diagnostische Konzepte.</p></div>${renderTriggerResearch({reading})}</div>`;
}

export function initTriggerReader() {
  const mount = document.getElementById('trigger-landscape');
  if (!mount) return;
  mount.innerHTML = renderTriggerReader();
  let sceneIndex = 0;
  let stepIndex = 0;
  let perspectiveKey = 'inside';
  mount.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.dataset.triggerJump) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const destination = document.getElementById(target.dataset.triggerJump);
      if (destination?.tagName === 'DETAILS') destination.open = true;
      destination?.scrollIntoView({block:'start',behavior:'auto'});
      const focusTarget = destination?.querySelector('h2, h3, summary');
      if (focusTarget) { focusTarget.setAttribute('tabindex','-1'); focusTarget.focus({preventScroll:true}); }
      return;
    }
    if (target.dataset.triggerScene !== undefined) { sceneIndex = Number(target.dataset.triggerScene); stepIndex = 0; }
    else if (target.dataset.triggerStep !== undefined) stepIndex = Number(target.dataset.triggerStep);
    else if (target.dataset.triggerPerspective) perspectiveKey = target.dataset.triggerPerspective;
    else return;
    const scene = triggerScenes[sceneIndex];
    mount.querySelector('#trigger-scene-setup').textContent = scene.setup;
    mount.querySelectorAll('[data-trigger-scene]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.triggerScene) === sceneIndex)));
    mount.querySelectorAll('[data-trigger-step]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.triggerStep) === stepIndex)));
    mount.querySelectorAll('[data-trigger-perspective]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.triggerPerspective === perspectiveKey)));
    mount.querySelector('#trigger-scene-state').innerHTML = renderSceneState(sceneIndex,stepIndex,perspectiveKey);
    mount.querySelector('#trigger-scene-status').textContent = `${scene.title}: ${scene.steps[stepIndex].label}. ${perspectives.find(item => item.key === perspectiveKey).label}.`;
  });
}
