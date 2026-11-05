const STORAGE_KEY = 'borderline.skillWorkshop.v1';
// A visit to another Atlas room pauses the current exercise in this page.
// It is not added to the personal records or restarted by a timer.
const interruptedJourneys = new WeakMap();
const LABELS = {
  orientierung: 'Orientierung', ueberlastung: 'Überlastung', anspannung: 'Anspannung',
  konflikt: 'Konflikt', kontakt: 'Kontakt', verstehen: 'Verstehen', schutz: 'Schutz',
  antrieb: 'Anfangen', scham: 'Scham', schlaf: 'Abend & Schlaf',
  zuhause: 'Zu Hause', arbeit: 'Arbeit / Lernen', unterwegs: 'Unterwegs',
  sehen: 'Sehen', hoeren: 'Hören', atem: 'Atem', still: 'Still & unauffällig',
  'ohne-koerperfokus': 'Ohne Körperfokus', denken: 'Nachdenken', schreiben: 'Schreiben',
  handeln: 'Etwas tun', sprechen: 'Sprechen', bewegung: 'Bewegen'
};
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const normalize = value => String(value ?? '').toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
// Folded paper is a wayfinding metaphor. Shape and colour never encode clinical effect.
// Every phase has the same vertices, so opening and step changes deform the surface.
function foldedWay(kind = 6, phase = 0, opening = 1, n = 24) {
  const colours = [[142,210,189],[239,150,125],[233,199,120],[183,165,223]];
  const pieces = [], bands = 3;
  for (let band = 0; band < bands; band++) {
    const vertices = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, a = u * Math.PI * (kind === 3 ? 1.35 : 1.82) + .32 + band * .13;
      for (let j = 0; j <= 3; j++) {
        const v = j / 3, radius = 95 + band * 24 + v * 19;
        let x = Math.cos(a) * radius, y = Math.sin(a) * radius * .77;
        let z = Math.sin(u * Math.PI * 7 + band) * (6 + 8 * v) + Math.sin(a + phase) * 18;
        if (kind === 1) { x = (u - .5) * 300; y = Math.sin(u * Math.PI * 2 + band * .8) * 55 + band * 21 + (v - .5) * 28; }
        if (kind === 2) { x = (u - .5) * 265; y = (band - 1) * 44 + (v - .5) * 60; z += Math.cos(u * Math.PI * 8) * 24; }
        if (kind === 3) { x += (band - 1) * 41; y *= .8; }
        if (kind === 4) { x = (u - .5) * 280; y = (band - 1) * 45 + (v - .5) * 28 + Math.sin(u * Math.PI) * 55; }
        if (kind === 5) { x += (band - 1) * 38; y += (band - 1) * 24; }
        const yaw = -.3 + Math.sin(phase) * .38, turnX = x * Math.cos(yaw) + z * Math.sin(yaw);
        const turnZ = z * Math.cos(yaw) - x * Math.sin(yaw);
        const scale = 630 / (630 + turnZ), spread = .2 + opening * .8;
        vertices.push([250 + turnX * scale * spread, 238 + (y + turnZ * .26) * scale * spread, turnZ]);
      }
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < 3; j++) {
      const p = [vertices[i * 4 + j], vertices[(i + 1) * 4 + j], vertices[(i + 1) * 4 + j + 1], vertices[i * 4 + j + 1]];
      const light = .64 + .25 * (j / 3) + .12 * Math.sin(i * .82 + band + phase * .3);
      const colour = colours[(kind + band) % colours.length].map(c => Math.round(c * light));
      pieces.push({ depth: p.reduce((sum,q) => sum + q[2], 0), path: `<path d="M${p.map(q => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join('L')}Z" fill="rgb(${colour.join(',')})" stroke="#f5ebd9" stroke-opacity=".2" stroke-width=".45"/>` });
    }
  }
  return pieces.sort((a,b) => b.depth - a.depth).map(p => p.path).join('');
}
const foldMark = (kind, className = '') => `<svg class="sw-foldmark ${className}" viewBox="50 45 400 390" aria-hidden="true" focusable="false">${foldedWay(kind, 0, 1, 12)}</svg>`;
// Atlas titles can be whole sentences. Match an explicitly assigned topic,
// rather than requiring that full sentence to occur in a short skills card.
export function skillTopicQuery(query, skills) {
  const wanted = normalize(query).trim();
  if (!wanted) return '';
  const terms = [...new Set(skills.flatMap(s => [...(s.atlasTerms || []), ...(s.need || []).map(key => LABELS[key] || key)]))];
  const topic = terms.filter(term => normalize(term).length >= 4 && wanted.includes(normalize(term)))
    .sort((a, b) => b.length - a.length)[0];
  return topic || '';
}
const uid = () => `own-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
const blankState = () => ({ version: 1, favorites: [], customSkills: [], experiences: [], updatedAt: null });
const formatTime = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
const safeText = (value, limit = 12000) => typeof value === 'string' ? value.slice(0, limit) : '';
const strings = value => Array.isArray(value) ? value.filter(v => typeof v === 'string').map(v => v.slice(0, 200)).slice(0, 40) : [];
const validDate = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : new Date().toISOString();
// Navigation context stays in this mounted journey, never in the personal store.
const cleanAtlasOrigin = value => value && typeof value === 'object' && typeof value.id === 'string' && value.id.trim() && typeof value.title === 'string' && value.title.trim()
  ? { id: value.id, title: safeText(value.title, 200).trim() } : null;
function cleanCustom(raw) {
  if (!raw || typeof raw !== 'object' || !safeText(raw.title, 160).trim() || !Array.isArray(raw.steps)) return null;
  const steps = raw.steps.filter(s => s && typeof s.text === 'string' && s.text.trim()).slice(0, 30).map((s, i) => ({
    title: safeText(s.title, 160) || `Schritt ${i + 1}`, text: safeText(s.text),
    ...(Number.isFinite(Number(s.seconds)) && Number(s.seconds) > 0 ? { seconds: Math.min(3600, Math.round(Number(s.seconds))) } : {})
  }));
  if (!steps.length) return null;
  return {
    id: typeof raw.id === 'string' && raw.id.startsWith('own-') ? raw.id.slice(0, 120) : uid(),
    title: safeText(raw.title, 160), subtitle: safeText(raw.subtitle, 200) || 'Mein eigener Skill',
    purpose: safeText(raw.purpose), when: safeText(raw.when), limits: safeText(raw.limits), materials: safeText(raw.materials),
    minutes: Math.max(1, Math.min(120, Number(raw.minutes) || 3)), need: strings(raw.need),
    goal: safeText(raw.goal, 160) || 'Eigene Hilfe', environment: strings(raw.environment), preference: strings(raw.preference),
    steps, variants: strings(raw.variants), alternatives: strings(raw.alternatives), atlasTerms: strings(raw.atlasTerms), custom: true,
    origin: { kind: raw.origin?.kind === 'Eigene Hypothese' ? 'Eigene Hypothese' : 'Eigene Beobachtung / Erfahrung', text: safeText(raw.origin?.text) || 'Von dir selbst angelegt. Keine automatisch geprüfte Empfehlung.', sources: strings(raw.origin?.sources) },
    createdAt: validDate(raw.createdAt), updatedAt: validDate(raw.updatedAt)
  };
}
function cleanState(raw) {
  if (!raw || typeof raw !== 'object' || (raw.version != null && raw.version !== 1)) throw new Error('Dieses Dateiformat wird hier nicht unterstützt.');
  return {
    version: 1, favorites: Array.isArray(raw.favorites) ? raw.favorites.filter(v => typeof v === 'string').map(v => v.slice(0, 200)).slice(0, 10000) : [],
    customSkills: (Array.isArray(raw.customSkills) ? raw.customSkills : []).slice(0, 1000).map(cleanCustom).filter(Boolean),
    experiences: (Array.isArray(raw.experiences) ? raw.experiences : []).slice(0, 5000).filter(e => e && typeof e.skillId === 'string').map(e => ({
      id: typeof e.id === 'string' ? e.id.slice(0, 120) : uid(), skillId: e.skillId.slice(0, 120),
      skillTitle: safeText(e.skillTitle, 160), outcome: ['hilfreich', 'neutral', 'unangenehm', 'offen'].includes(e.outcome) ? e.outcome : 'offen',
      note: safeText(e.note), date: validDate(e.date)
    })), updatedAt: raw.updatedAt || null
  };
}

/** Private workshop data stays in its own store. No existing Atlas records are migrated or overwritten. */
export function mountSkillWorkshop(host, options = {}) {
  if (!host) throw new Error('Ein Einbauort für den Skillkoffer fehlt.');
  const ownAbort = new AbortController();
  let instance = null, disposed = false, pendingFocus;
  const ready = initializeSkillWorkshop(host, { ...options, origin: cleanAtlasOrigin(options.origin) }, ownAbort).then(controller => {
    if (disposed) return null;
    instance = controller;
    if (pendingFocus !== undefined) instance.focusSkill(pendingFocus.query, pendingFocus.origin);
    return instance;
  });
  return {
    ready,
    focusSkill(query, origin) {
      if (disposed) return;
      // Omitted origin keeps the current journey; null explicitly starts without one.
      const nextOrigin = origin === undefined ? undefined : cleanAtlasOrigin(origin);
      if (instance) instance.focusSkill(query, nextOrigin);
      else pendingFocus = { query, origin: nextOrigin === undefined ? pendingFocus?.origin : nextOrigin };
    },
    destroy() {
      if (disposed) return;
      disposed = true; ownAbort.abort();
      if (instance) instance.destroy();
      else { host.classList.remove('skill-workshop'); host.innerHTML = ''; }
    }
  };
}
async function initializeSkillWorkshop(host, options, ownAbort) {
  if (!host) throw new Error('Ein Einbauort für den Skillkoffer fehlt.');
  host.classList.add('skill-workshop');
  host.innerHTML = `<div class="sw-opening">${foldMark(6)}<p class="sw-loading" role="status">Der Skillkoffer wird geöffnet …</p></div>`;
  let library;
  try {
    const response = await fetch(new URL('./skill-library.json', import.meta.url), { signal: ownAbort.signal });
    if (!response.ok) throw new Error('Die Bibliothek konnte nicht geladen werden.');
    library = await response.json();
    if (ownAbort.signal.aborted) return null;
  } catch (error) {
    if (error.name !== 'AbortError') host.innerHTML = '<p role="alert">Die Übungen sind gerade nicht verfügbar. Bitte lade die Seite erneut.</p>';
    return { destroy() { ownAbort.abort(); }, focusSkill() {} };
  }
  let state = blankState(), storageOkay = true, storageNote = '';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = cleanState(JSON.parse(saved));
  } catch {
    storageOkay = false;
    storageNote = 'Der persönliche Speicher konnte nicht gelesen werden. Vorhandene Daten werden nicht überschrieben. Neue Änderungen kannst du exportieren.';
  }
  let selectedId = library.skills[0]?.id, mode = 'browse', onlyFavorites = false, editingId = null, selectionOpen = false, choosing = true;
  let filters = { search: '', need: options.initialNeed || '', goal: '', environment: '', minutes: '', preference: '' };
  let guide = null, timer = null, timerLeft = 0, timerTotal = 0, timerRunning = false, timerEnd = 0;
  let announceText = '', destroyed = false;
  const systemMotion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  const motionRoot = globalThis.document?.documentElement;
  let motionState = { paused: Boolean(motionRoot?.classList.contains('atlas-motion-paused')), quiet: Boolean(motionRoot?.classList.contains('atlas-quiet')), reduced: Boolean(systemMotion?.matches || motionRoot?.classList.contains('atlas-reduced')) };
  let foldFrame = 0, foldElement = null, foldState = { phase: 0, opening: .12 }, foldTarget = { phase: 0, opening: 1 };
  const stopFold = () => { if (foldFrame && globalThis.cancelAnimationFrame) cancelAnimationFrame(foldFrame); foldFrame = 0; };
  function paintFold() { if (foldElement?.isConnected) foldElement.innerHTML = foldedWay(6, foldState.phase, foldState.opening); }
  function animateFold() {
    stopFold();
    if (!foldElement?.isConnected) return;
    if (motionState.paused || guide?.paused) { paintFold(); return; }
    if (motionState.reduced || motionState.quiet || !globalThis.requestAnimationFrame) { foldState = { ...foldTarget }; paintFold(); return; }
    const from = { ...foldState }, start = performance.now();
    const tick = now => {
      if (destroyed || !foldElement?.isConnected) { foldFrame = 0; return; }
      const t = Math.min(1, (now - start) / 780), eased = 1 - Math.pow(1 - t, 3);
      foldState = { phase: from.phase + (foldTarget.phase - from.phase) * eased, opening: from.opening + (foldTarget.opening - from.opening) * eased };
      paintFold(); foldFrame = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    foldFrame = requestAnimationFrame(tick);
  }
  function mountWayMotion() {
    if (choosing && !guide) { stopFold(); foldElement = null; return; }
    foldElement = host.querySelector('[data-sw-fold]');
    foldTarget = { phase: guide && !guide.finished ? (guide.index + 1) / selected().steps.length * Math.PI * 2 : 0, opening: 1 };
    if ((motionState.paused || guide?.paused) && foldState.opening < .2) foldState = { ...foldTarget };
    animateFold();
  }
  const updateMotion = event => {
    motionState = { paused: Boolean(event.detail?.paused), quiet: Boolean(event.detail?.quiet), reduced: Boolean(systemMotion?.matches || event.detail?.reduced) };
    animateFold();
  };
  globalThis.window?.addEventListener?.('atlas:motionchange', updateMotion, { signal: ownAbort.signal });
  systemMotion?.addEventListener?.('change', () => { motionState.reduced = Boolean(systemMotion.matches || motionRoot?.classList.contains('atlas-reduced')); animateFold(); }, { signal: ownAbort.signal });
  host.addEventListener('pointerdown', stopFold, { signal: ownAbort.signal, capture: true });
  host.addEventListener('wheel', stopFold, { signal: ownAbort.signal, capture: true, passive: true });
  host.addEventListener('keydown', event => { if (event.key === 'Escape') stopFold(); }, { signal: ownAbort.signal });
  globalThis.document?.addEventListener?.('visibilitychange', () => { if (document.hidden) stopFold(); }, { signal: ownAbort.signal });
  let atlasOrigin = cleanAtlasOrigin(options.origin);
  const allSkills = () => [...library.skills, ...state.customSkills];
  const selected = () => allSkills().find(s => s.id === selectedId) || library.skills[0];
  const interrupted = interruptedJourneys.get(host);
  if (!options.initialNeed && interrupted && allSkills().some(skill => skill.id === interrupted.selectedId)) {
    selectedId = interrupted.selectedId; mode = 'browse'; choosing = false;
    guide = { ...interrupted.guide, paused: true };
    timerLeft = interrupted.timerLeft; timerTotal = interrupted.timerTotal;
    atlasOrigin = interrupted.atlasOrigin;
    announceText = 'Die Übung wartet an deinem letzten Schritt. Du kannst sie fortsetzen oder beenden.';
  }
  interruptedJourneys.delete(host);
  const label = key => LABELS[key] || key;
  const announce = message => { announceText = message; const live = host.querySelector('[data-sw-live]'); if (live) live.textContent = message; };
  function persist() {
    state.updatedAt = new Date().toISOString();
    if (!storageOkay) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { storageOkay = false; storageNote = 'Dein Browser konnte diese Änderung nicht dauerhaft speichern. Exportiere deine Daten, um sie zu behalten.'; announce(storageNote); }
  }
  function stopTimer(reset = false) {
    clearInterval(timer); timer = null; timerRunning = false;
    if (reset) { timerLeft = timerTotal; timerEnd = 0; }
  }
  function prepareTimer(seconds) {
    stopTimer(); timerTotal = Math.max(0, Number(seconds) || 0); timerLeft = timerTotal; timerEnd = 0;
  }
  function paintTimer() {
    const display = host.querySelector('[data-sw-clock]');
    if (display) display.textContent = formatTime(timerLeft);
    const toggle = host.querySelector('[data-action="timer"]');
    if (toggle) { toggle.textContent = timerRunning ? 'Pausieren' : timerLeft === timerTotal ? 'Timer starten' : timerLeft > 0 ? 'Fortsetzen' : 'Erneut starten'; toggle.setAttribute('aria-pressed', String(timerRunning)); }
    const meter = host.querySelector('[data-sw-meter]');
    if (meter) meter.style.setProperty('--sw-progress', `${timerTotal ? (1 - timerLeft / timerTotal) * 100 : 0}%`);
  }
  function toggleTimer() {
    if (timerRunning) { timerLeft = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000)); stopTimer(); }
    else {
      if (!timerLeft) timerLeft = timerTotal;
      timerRunning = true; timerEnd = Date.now() + timerLeft * 1000;
      timer = setInterval(() => {
        timerLeft = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
        if (!timerLeft) { stopTimer(); announce('Die gewählte Zeit ist vorbei. Du entscheidest, wie es weitergeht.'); }
        paintTimer();
      }, 250);
    }
    paintTimer();
  }
  function results() {
    const query = normalize(filters.search);
    return allSkills().filter(s =>
      (!onlyFavorites || state.favorites.includes(s.id)) &&
      (!filters.need || s.need?.includes(filters.need)) &&
      (!filters.goal || s.goal === filters.goal) &&
      (!filters.environment || s.environment?.includes(filters.environment)) &&
      (!filters.minutes || s.minutes <= Number(filters.minutes)) &&
      (!filters.preference || s.preference?.includes(filters.preference)) &&
      (!query || normalize([s.title, s.subtitle, s.purpose, s.when, s.limits, s.goal, ...s.need.map(label), ...(s.atlasTerms || []), ...s.steps.map(x => x.text)].join(' ')).includes(query))
    );
  }
  const selectHTML = (name, title, values) => `<label class="sw-filter"><span>${title}</span><select name="${name}" data-filter="${name}"><option value="">Alles</option>${values.map(v => `<option value="${esc(v.value ?? v)}"${filters[name] === String(v.value ?? v) ? ' selected' : ''}>${esc(v.label ?? label(v))}</option>`).join('')}</select></label>`;
  const atlasButtonHTML = () => `<button type="button" class="sw-atlaslink" data-action="atlas">${atlasOrigin ? 'Zum Ausgangspunkt im Atlas' : 'Im Atlas weiter verstehen'} <span aria-hidden="true">↗</span></button>`;
  const contextHTML = () => atlasOrigin ? `<div class="sw-context"><p><span>Dein Ausgangspunkt im Atlas</span><strong>${esc(atlasOrigin.title)}</strong></p>${atlasButtonHTML()}</div>` : '';
  function wayFigureHTML(skill, current = -1) {
    const count = skill.steps.length;
    const start = count > 6 ? Math.min(Math.max(0, current - 2), count - 6) : 0;
    const points = skill.steps.slice(start, start + 6).map((_, i, visible) => {
      const angle = (195 + i * 275 / Math.max(1, visible.length - 1)) * Math.PI / 180;
      return { index: start + i, x: 50 + Math.cos(angle) * 34, y: 48 + Math.sin(angle) * 31 };
    });
    const route = points.map((p, i) => `${i ? 'L' : 'M'}${p.x * 5},${p.y * 5}`).join(' ');
    const active = points.find(p => p.index === current) || points[0];
    return `<figure class="sw-wayfigure${current >= 0 ? ' is-in-session' : ''}" aria-label="Der Weg durch ${esc(skill.title)}">
      <div class="sw-waydrawing">
        <svg viewBox="0 0 500 500" aria-hidden="true" focusable="false">
          <ellipse class="sw-foldground" cx="250" cy="430" rx="172" ry="20"/>
          <g data-sw-fold>${foldedWay(6, foldState.phase, foldState.opening)}</g>
          <path class="sw-route" d="${route}"/>
          ${current >= 0 ? `<circle class="sw-wayhalo" cx="${active.x * 5}" cy="${active.y * 5}" r="40"/>` : ''}
        </svg>
        <span class="sw-waycenter" aria-hidden="true"><span>${current >= 0 ? String(current + 1).padStart(2, '0') : 'Ein'}</span><span>${current >= 0 ? `von ${count}` : 'kleiner Weg'}</span></span>
        ${points.map(p => `<button type="button" class="sw-waypoint${current === p.index ? ' is-current' : ''}${current > p.index ? ' is-visited' : ''}" style="--sw-x:${p.x}%;--sw-y:${p.y}%" data-step="${p.index}" aria-label="Schritt ${p.index + 1}: ${esc(skill.steps[p.index].title)}"${current === p.index ? ' aria-current="step"' : ''}><span>${String(p.index + 1).padStart(2, '0')}</span><span class="sw-waypoint-label">${esc(skill.steps[p.index].title)}</span></button>`).join('')}
      </div>
      <figcaption><span>${current >= 0 ? 'Dein Tempo. Dein Weg.' : `${count} Schritte. Du hast die Wahl.`}</span>${count > 6 ? `Schritte ${start + 1} bis ${start + points.length} von ${count}. ` : ''}Jeder Punkt öffnet einen Schritt.</figcaption>
      ${count > 6 ? `<label class="sw-stepjump"><span>Direkt zu einem Schritt</span><select data-step-jump>${skill.steps.map((step,i) => `<option value="${i}"${i === Math.max(0,current) ? ' selected' : ''}>${i + 1}. ${esc(step.title)}</option>`).join('')}</select></label>` : ''}
    </figure>`;
  }
  function shell() {
    stopFold();
    host.dataset.swMode = mode;
    host.dataset.swSession = guide && !guide.finished ? 'active' : 'idle';
    host.innerHTML = `
      <header class="sw-header">
        <div class="sw-kicker">Dein Skillkoffer · ein Raum zum Ausprobieren</div>
        <div class="sw-titleline"><h2>Etwas ausprobieren</h2><p>Wähle eine Übungsart. Danach gehst du Schritt für Schritt – in deinem Tempo.</p></div>
        <p class="sw-safety">Du kannst jederzeit aufhören. Nichts verlangt, in den Körper hineinzuspüren, die Augen zu schließen, den Atem anzuhalten, Kälte oder Schmerz.</p>
        <div data-sw-context>${contextHTML()}</div>
        <nav class="sw-tabs" aria-label="Bereiche des Skillkoffers">
          <button type="button" data-action="browse" aria-current="${mode === 'browse' && !onlyFavorites ? 'page' : 'false'}">Übungsraum</button>
          <button type="button" data-action="favorites" aria-pressed="${mode === 'browse' && onlyFavorites}">Meine Favoriten <span>${state.favorites.length}</span></button>
          <button type="button" data-action="custom" aria-current="${mode === 'custom' ? 'page' : 'false'}">Eigene Skills <span>${state.customSkills.length}</span></button>
          <button type="button" data-action="experiences" aria-current="${mode === 'experiences' ? 'page' : 'false'}">Erfahrungen <span>${state.experiences.length}</span></button>
          <button type="button" data-action="data" aria-current="${mode === 'data' ? 'page' : 'false'}">Sichern & mitnehmen</button>
        </nav>
      </header>
      <div class="sw-live sw-sr" role="status" aria-live="polite" data-sw-live>${esc(announceText)}</div>
      ${storageNote ? `<p class="sw-storage-warning" role="status">${esc(storageNote)}</p>` : ''}
      <div data-sw-body></div>
      <footer class="sw-footer"><p>Keine Diagnose. Kein Durchhaltenmüssen. Diese Hilfen ersetzen keine Behandlung. Bei unmittelbarer Gefahr jetzt örtliche Notfallhilfe nutzen; in Deutschland und der EU: <a href="tel:112">112</a>.</p><p>Favoriten, eigene Skills und Erfahrungen bleiben auf diesem Gerät. Du kannst sie bewusst exportieren. Sie erscheinen nicht in öffentlichen Ansichten.</p></footer>`;
    renderBody();
  }
  function renderBody() {
    const body = host.querySelector('[data-sw-body]');
    if (!body) return;
    if (mode === 'browse') {
      const needs = [...new Set(allSkills().flatMap(s => s.need))];
      const preferences = [...new Set(allSkills().flatMap(s => s.preference))];
      body.innerHTML = `<section class="sw-discovery" aria-label="Passende Hilfe auswählen">
        <div class="sw-practice-types"><span class="sw-kicker">1 · Eine Übungsart wählen</span><h3>Was liegt dir gerade?</h3><div>${[['sehen','Umsehen & Sinne'],['atem','Atem beobachten'],['schreiben','Schreiben & Sortieren'],['kontakt','Kontakt aufnehmen'],['handeln','Etwas Kleines tun'],['bewegung','Die Position verändern']].map(([key,title],i) => `<button type="button" data-preference="${key}" style="--sw-order:${i}" aria-pressed="${filters.preference === key}">${foldMark(i)}<span class="sw-type-name">${title}<span aria-hidden="true">↗</span></span></button>`).join('')}</div></div><details class="sw-intents sw-needs"><summary>Lieber nach einer Situation wählen</summary><div>${[['orientierung','einen Anker'],['ueberlastung','weniger Reize'],['konflikt','Abstand im Streit'],['kontakt','Verbindung'],['antrieb','einen Anfang']].map(([key,title]) => `<button type="button" data-need="${key}" aria-pressed="${filters.need === key}">${title}<span aria-hidden="true">↗</span></button>`).join('')}</div></details>
        <details class="sw-refine"><summary>Eine Hilfe genauer auswählen${Object.values(filters).some(Boolean) || onlyFavorites ? ' · Auswahl aktiv' : ''}</summary><div>
        <div class="sw-searchline"><label class="sw-search"><span>Situation, Frage oder Methode</span><input type="search" data-filter="search" value="${esc(filters.search)}" placeholder="Zum Beispiel: Streit, Geräusche, nicht anfangen …"></label><button type="button" class="sw-quiet" data-action="clear-filters">Alle Hilfen</button></div>
        <div class="sw-filters">
          ${selectHTML('need', 'Aktueller Bedarf', needs)}
          ${selectHTML('goal', 'Mein Ziel', [...new Set(allSkills().map(s => s.goal))])}
          ${selectHTML('environment', 'Umgebung', ['zuhause', 'arbeit', 'unterwegs'])}
          ${selectHTML('minutes', 'Verfügbare Zeit', [{value:'2',label:'Bis 2 Minuten'},{value:'3',label:'Bis 3 Minuten'},{value:'5',label:'Bis 5 Minuten'},{value:'15',label:'Bis 15 Minuten'}])}
          ${selectHTML('preference', 'Was mir liegt', preferences)}
        </div></div></details>
      </section><details class="sw-selection"${selectionOpen || onlyFavorites ? ' open' : ''}><summary>${onlyFavorites ? 'Deine gemerkten Hilfen' : 'Eine Übung auswählen'} <span data-sw-count></span></summary><div data-sw-results></div></details><section class="sw-detail" data-sw-detail aria-label="Gewählte Übung"></section>`;
      const visible = results();
      if (!guide && visible.length && !visible.some(s => s.id === selectedId)) selectedId = visible[0].id;
      renderResults(); renderDetail();
    } else if (mode === 'custom') renderCustom(body);
    else if (mode === 'experiences') renderExperiences(body);
    else renderData(body);
  }
  function renderResults() {
    const target = host.querySelector('[data-sw-results]'); if (!target) return;
    const list = results();
    const count = host.querySelector('[data-sw-count]'); if (count) count.textContent = `${list.length} ${list.length === 1 ? 'Möglichkeit' : 'Möglichkeiten'}`;
    target.innerHTML = `<div class="sw-skilllist" role="list">${list.length ? list.map((s, index) => `<div role="listitem"><button type="button" class="sw-skillrow ${s.id === selectedId ? 'is-selected' : ''}" data-skill="${esc(s.id)}" aria-pressed="${s.id === selectedId}">${foldMark(index % 6, 'sw-rowfold')}<span class="sw-rowindex" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span class="sw-rowtop"><span>${esc(s.title)}</span><span class="sw-rowtime">${esc(s.minutes)} min${state.favorites.includes(s.id) ? ' · ★' : ''}</span></span><span class="sw-rowsub">${esc(s.subtitle)}</span><span class="sw-rowtags">${esc(s.need.map(label).slice(0, 2).join(' / '))}${s.custom ? ' · Eigener Skill' : ''}</span></button></div>`).join('') : '<div class="sw-empty"><h3>Vielleicht braucht es gerade etwas anderes.</h3><p>Öffne einen Filter oder setze die Auswahl zurück. Es gibt kein Muss, jetzt eine Übung zu machen.</p><button type="button" data-action="clear-filters">Alle Hilfen ansehen</button></div>'}</div>`;
  }
  function originsHTML(skill) {
    return `<details class="sw-origin"><summary>Herkunft, Grenzen & Alternativen</summary><div class="sw-originbody"><p class="sw-originlabel">${esc(skill.origin?.kind || 'Eigener Eintrag')}</p><p>${esc(skill.origin?.text)}</p><h4>Grenzen & ungeeignete Situationen</h4><p>${esc(skill.limits || 'Bitte ergänze die Grenzen dieses eigenen Skills. Bei Unbehagen beenden.')}</p><h4>Freiwillige Varianten</h4><ul>${(skill.variants?.length ? skill.variants : ['Du kannst jeden Schritt verkürzen oder beenden.']).map(v => `<li>${esc(v)}</li>`).join('')}</ul>${skill.origin?.sources?.length ? `<h4>Fachliche Rückwege</h4><ul class="sw-sources">${skill.origin.sources.map(key => { const source = library.sources[key]; return source ? `<li>${source.url ? `<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.label)} ↗</a>` : `<span>${esc(source.label)}</span>`}<small>${esc(source.type)}${source.note ? ` · ${esc(source.note)}` : ''}</small></li>` : ''; }).join('')}</ul>` : ''}${skill.alternatives?.length ? `<h4>Andere Wege ausprobieren</h4><div class="sw-alternatives">${skill.alternatives.map(id => { const s = allSkills().find(x => x.id === id); return s ? `<button type="button" data-skill="${esc(id)}">${esc(s.title)} ↗</button>` : ''; }).join('')}</div>` : ''}</div></details>`;
  }
  function renderDetail(focus = false) {
    host.dataset.swChoosing = String(choosing && !guide);
    host.dataset.swSession = guide && !guide.finished ? 'active' : 'idle';
    const target = host.querySelector('[data-sw-detail]'); if (!target) return;
    host.dataset.swSession = guide && !guide.finished ? 'active' : 'idle';
    if (!guide && !results().length) { target.innerHTML = '<div class="sw-empty"><span class="sw-kicker">Deine Auswahl</span><h3>Gerade passt keine Hilfe zu diesen Filtern.</h3><p>Du kannst die Auswahl öffnen oder zurücksetzen. Wenn du möchtest, bleib zunächst einfach bei deiner Umgebung.</p><button type="button" data-action="clear-filters">Alle Hilfen ansehen</button></div>'; return; }
    const skill = selected(); if (!skill) return;
    const isFavorite = state.favorites.includes(skill.id);
    const atlasButton = atlasButtonHTML();
    if (guide?.finished) {
      target.innerHTML = `<div class="sw-sessionend"><div class="sw-endmark" aria-hidden="true">${foldMark(5)}</div><div><span class="sw-kicker">Hier darfst du anhalten.</span><h3 tabindex="-1" data-sw-heading>Was möchtest du<br><em>mitnehmen?</em></h3><p>Eine Übung muss nichts bewirken. Auch „passt heute nicht“ ist eine hilfreiche Information.</p><form data-sw-feedback><fieldset><legend>Freiwillige Rückmeldung zu „${esc(skill.title)}“</legend><div class="sw-outcomes">${[['hilfreich','Hilfreich'],['neutral','Unverändert'],['unangenehm','Unangenehm'],['offen','Noch offen']].map(([value,title]) => `<label><input type="radio" name="outcome" value="${value}"><span>${title}</span></label>`).join('')}</div></fieldset><label class="sw-field"><span>Was passte – oder was würdest du ändern? (optional)</span><textarea name="note" rows="3" maxlength="12000" placeholder="Nur für dich. Persönliche Details sind nicht nötig."></textarea></label><button class="sw-primary" type="submit">Erfahrung auf diesem Gerät speichern</button></form><div class="sw-endactions"><button type="button" data-action="overview">Zur Hilfe zurück</button><button type="button" data-action="alternative">Andere Hilfe wählen</button>${atlasButton}</div>${originsHTML(skill)}</div></div>`;
    } else if (guide) {
      const step = skill.steps[guide.index];
      target.innerHTML = `<div class="sw-room sw-guide${guide.paused ? ' is-paused' : ''}"><div class="sw-roomhead"><div><span class="sw-kicker">Du probierst aus</span><span class="sw-exercisename">${esc(skill.title)}</span></div><button type="button" class="sw-quiet" data-action="finish">Für jetzt beenden ↗</button></div>${wayFigureHTML(skill, guide.index)}<div class="sw-instruction"><div class="sw-stepnumber">${guide.paused ? 'Eine Pause für dich' : `Schritt ${String(guide.index + 1).padStart(2, '0')} / ${String(skill.steps.length).padStart(2, '0')}`}</div><h3 tabindex="-1" data-sw-heading>${guide.paused ? 'Hier ist Zeit.' : esc(step.title)}</h3><p class="sw-steptext">${guide.paused ? 'Du musst gerade nichts tun. Schau dich um, leg das Gerät beiseite oder entscheide in Ruhe, ob du weitergehen möchtest.' : esc(step.text)}</p><div class="sw-guidenav"><button type="button" class="sw-quiet" data-action="previous" ${guide.index === 0 ? 'disabled' : ''} aria-label="Zum vorherigen Schritt">← Zurück</button><button type="button" data-action="pause-guide" aria-pressed="${Boolean(guide.paused)}">${guide.paused ? 'Übung fortsetzen' : 'Unterbrechen'}</button>${guide.paused ? '' : `<button type="button" class="sw-primary" data-action="next">${guide.index === skill.steps.length - 1 ? 'Abschließen' : 'Weiter'} <span aria-hidden="true">→</span></button>`}</div>${step.seconds && !guide.paused ? `<details class="sw-timerchoice"><summary>Wenn du magst: ${step.seconds < 60 ? `${step.seconds} Sekunden` : `${Math.floor(step.seconds / 60)}:${String(step.seconds % 60).padStart(2,'0')} Minuten`} Zeit nehmen</summary><div class="sw-timer" data-sw-meter style="--sw-progress:0%"><div><span class="sw-clock" data-sw-clock aria-label="Verbleibende Zeit">${formatTime(timerLeft)}</span><span>Kein Timer startet von selbst.<br>Weitergehen ist jederzeit möglich.</span></div><div class="sw-timerbuttons"><button type="button" data-action="timer" aria-pressed="false">Timer starten</button><button type="button" class="sw-quiet" data-action="timer-reset">Zurücksetzen</button></div></div></details>` : ''}<div class="sw-exitline"><button type="button" class="sw-outer" data-action="outer">Lieber im Raum umsehen <span aria-hidden="true">↗</span></button><span>Verändern, überspringen, aufhören.<br>Du entscheidest.</span></div><details class="sw-sessioncontext"><summary>Grenzen, Herkunft & Varianten dieser Hilfe</summary><p>${esc(skill.limits)}</p>${originsHTML(skill)}</details></div></div>`;
      paintTimer();
    } else {
      target.innerHTML = `<div class="sw-room sw-overview"><div class="sw-roomhead"><span class="sw-kicker">Eine Möglichkeit für dich</span><button type="button" class="sw-save" data-action="favorite" aria-pressed="${isFavorite}" aria-label="${isFavorite ? 'Aus Favoriten entfernen' : 'Als Favorit merken'}">${isFavorite ? '★ Gemerkt' : '☆ Merken'}</button></div>${wayFigureHTML(skill)}<div class="sw-instruction"><div class="sw-detailmeta">${esc(skill.minutes)} Minuten ungefähr · ${esc(skill.goal)}</div><h3 tabindex="-1" data-sw-heading>${esc(skill.title)}</h3><p class="sw-detailintro">${esc(skill.purpose)}</p><div class="sw-startline"><button type="button" class="sw-primary" data-action="start">Einen Schritt ausprobieren <span aria-hidden="true">→</span></button></div><p class="sw-startnote">Freiwillig. Ohne automatischen Timer.</p><details class="sw-before"><summary>Was du vorher wissen möchtest</summary><div class="sw-practical"><div><h4>Passt vielleicht, wenn …</h4><p>${esc(skill.when || 'du diesen eigenen Skill ausprobieren möchtest.')}</p></div><div><h4>Du brauchst</h4><p>${esc(skill.materials || 'Keine besonderen Dinge.')}</p></div><div><h4>Wann lieber nicht?</h4><p>${esc(skill.limits || 'Bei Unbehagen beenden.')}</p></div></div></details></div><div class="sw-roomfoot">${atlasButton}<button type="button" class="sw-quiet" data-action="selection">Andere Hilfe entdecken ↓</button></div></div><div class="sw-notes">${originsHTML(skill)}${skill.media ? `<details class="sw-media"><summary>Optionaler Bildimpuls · ${esc(skill.media.label)}</summary><div><video controls playsinline preload="none" poster="${esc(skill.media.poster)}" aria-label="${esc(skill.media.label)}: stummer Bildimpuls"><source src="${esc(skill.media.src)}" type="video/mp4"><p>${esc(skill.media.description)}</p></video><p>${esc(skill.media.description)}</p><small>${esc(skill.media.credit)}</small></div></details>` : ''}${skill.custom ? `<button type="button" class="sw-editlink" data-action="edit" data-id="${esc(skill.id)}">Eigenen Skill bearbeiten</button>` : ''}</div>`;
    }
    mountWayMotion();
    if (focus) target.querySelector('[data-sw-heading]')?.focus({ preventScroll: true });
  }
  function customStepHTML(step = {}, index = 0) {
    return `<fieldset class="sw-steprow" data-sw-step><legend>Schritt ${index + 1}</legend><label class="sw-field"><span>Überschrift (optional)</span><input name="stepTitle" maxlength="160" value="${esc(step.title)}" placeholder="Zum Beispiel: Im Raum ankommen"></label><label class="sw-field"><span>Was möchtest du tun? *</span><textarea name="stepText" required rows="3" maxlength="12000">${esc(step.text)}</textarea></label><div class="sw-stepcontrols"><label class="sw-field"><span>Optionaler Timer in Sekunden</span><input name="stepSeconds" type="number" min="1" max="3600" value="${esc(step.seconds)}" placeholder="Ohne Timer"></label><button type="button" data-action="remove-step" aria-label="Diesen Schritt entfernen">Schritt entfernen</button></div></fieldset>`;
  }
  function renderCustom(body) {
    const skill = state.customSkills.find(s => s.id === editingId);
    const checked = (key, value) => skill?.[key]?.includes(value) ? ' checked' : '';
    body.innerHTML = `<section class="sw-own"><div class="sw-sectionlead">${foldMark(2)}<span class="sw-kicker">Deine Erfahrung hat einen eigenen Platz</span><h3>${skill ? 'Eigenen Skill bearbeiten' : 'Eine eigene Hilfe festhalten'}</h3><p>Beobachtung und Hypothese bleiben unterscheidbar. Hier wird nichts diagnostiziert oder veröffentlicht.</p></div><div class="sw-ownlayout"><form data-sw-custom>
      <div class="sw-formstage"><span class="sw-kicker">1 · Einen Anfang finden</span><label class="sw-field"><span>Name der Hilfe *</span><input name="title" maxlength="160" required value="${esc(skill?.title)}" placeholder="Ein verständlicher Name"></label>
      <label class="sw-field"><span>Was soll sie ermöglichen? *</span><textarea name="purpose" required rows="2">${esc(skill?.purpose)}</textarea></label>
      </div><details class="sw-formextras"><summary>Situation & ungefähre Dauer ergänzen</summary><div class="sw-fieldpair"><label class="sw-field"><span>Passende Situation</span><input name="when" value="${esc(skill?.when)}"></label><label class="sw-field"><span>Dauer in Minuten</span><input name="minutes" type="number" min="1" max="120" value="${skill?.minutes || 3}"></label></div>
      </details><div class="sw-customsteps"><span class="sw-kicker">2 · Deinen Weg entfalten</span><h4>Deine Anleitung</h4><p>Ein verständlicher Schritt nach dem anderen. Timer starten auch hier erst auf deinen Wunsch.</p><div data-sw-steps>${(skill?.steps || [{}]).map(customStepHTML).join('')}</div><button type="button" data-action="add-step">Weiteren Schritt ergänzen</button></div>
      <details class="sw-formextras"><summary>3 · Bedingungen & Bezüge auffalten</summary><div class="sw-fieldpair"><label class="sw-field"><span>Benötigte Dinge</span><input name="materials" value="${esc(skill?.materials)}"></label><label class="sw-field"><span>Grenzen / wann lieber nicht?</span><input name="limits" value="${esc(skill?.limits)}"></label></div>
      <label class="sw-field"><span>Atlasbezüge & eigene Schlagwörter (durch Komma trennen)</span><input name="atlasTerms" value="${esc(skill?.atlasTerms.join(', '))}" placeholder="Zum Beispiel: Überlastung, Beziehung, Pause"></label>
      <fieldset class="sw-checkboxes"><legend>Bedarf</legend>${['orientierung','anspannung','ueberlastung','konflikt','kontakt','verstehen','schutz','antrieb','scham','schlaf'].map(v => `<label><input name="need" type="checkbox" value="${v}"${checked('need',v)}>${label(v)}</label>`).join('')}</fieldset>
      <fieldset class="sw-checkboxes"><legend>Umgebung</legend>${['zuhause','arbeit','unterwegs'].map(v => `<label><input name="environment" type="checkbox" value="${v}"${checked('environment',v)}>${label(v)}</label>`).join('')}</fieldset>
      <fieldset class="sw-checkboxes"><legend>Eigene Präferenz</legend>${['still','ohne-koerperfokus','sehen','hoeren','denken','schreiben','sprechen','handeln','kontakt','bewegung','atem'].map(v => `<label><input name="preference" type="checkbox" value="${v}"${checked('preference',v)}>${label(v)}</label>`).join('')}</fieldset>
      </details><details class="sw-formextras"><summary>4 · Herkunft & eigene Variante ergänzen</summary><label class="sw-field"><span>Herkunft unterscheiden</span><select name="originKind"><option${skill?.origin.kind !== 'Eigene Hypothese' ? ' selected' : ''}>Eigene Beobachtung / Erfahrung</option><option${skill?.origin.kind === 'Eigene Hypothese' ? ' selected' : ''}>Eigene Hypothese</option></select></label><label class="sw-field"><span>Herkunft / Quelle / eigene Variante (optional)</span><textarea name="originText" rows="2">${esc(skill?.origin.text)}</textarea></label></details><div class="sw-formactions"><button class="sw-primary" type="submit">${skill ? 'Änderungen speichern' : 'Eigenen Skill speichern'}</button>${skill ? '<button type="button" data-action="new-custom">Neue Hilfe anlegen</button>' : ''}</div><p class="sw-localhint">Nur in deinem persönlichen Speicher auf diesem Gerät. Export und Import findest du unter „Sichern & mitnehmen“.</p></form><aside class="sw-ownlist"><h4>Deine gespeicherten Hilfen</h4>${state.customSkills.length ? state.customSkills.map(s => `<div class="sw-ownrow"><strong>${esc(s.title)}</strong><p>${esc(s.origin.kind)}</p><button type="button" data-skill="${esc(s.id)}">Ausprobieren</button><button type="button" data-action="edit" data-id="${esc(s.id)}">Bearbeiten</button></div>`).join('') : '<p>Hier erscheinen deine eigenen Hilfen. Du kannst später weiterarbeiten und eigene Varianten erhalten.</p>'}</aside></div></section>`;
  }
  function renderExperiences(body) {
    const entry = e => {
      const title = e.skillTitle || allSkills().find(s => s.id === e.skillId)?.title || 'Eigene Übung';
      const outcome = {hilfreich:'Hilfreich',neutral:'Unverändert',unangenehm:'Unangenehm',offen:'Noch offen'}[e.outcome];
      return `<li><details class="sw-note"><summary><svg class="sw-notefold" viewBox="0 0 90 90" aria-hidden="true" focusable="false"><path d="M16 62Q-2 28 30 14Q62 1 75 29L64 38Q58 15 33 25Q7 36 26 65Z" fill="#8ed2bd"/><path d="M25 65Q7 39 35 26Q58 17 65 39L59 45Q51 28 36 36Q20 44 33 67Z" fill="#b7a5df"/><path d="M33 67Q23 48 40 39Q51 33 59 46L52 52Q46 44 40 48Q33 52 41 66Z" fill="#e9c778"/></svg><span class="sw-notetitle">${esc(title)}<small>Beobachtung auffalten</small></span></summary><div class="sw-notemeta"><time datetime="${esc(e.date)}">${esc(new Date(e.date).toLocaleString('de-DE', {dateStyle:'medium',timeStyle:'short'}))}</time><span class="sw-outcome sw-outcome-${e.outcome}">${esc(outcome)}</span></div>${e.note ? `<p class="sw-preserve">${esc(e.note)}</p>` : '<p>Ohne zusätzliche Notiz gespeichert.</p>'}<button type="button" data-skill="${esc(e.skillId)}">Hilfe wieder öffnen ↗</button><button type="button" class="sw-quiet" data-action="delete-experience" data-id="${esc(e.id)}">Diese Notiz löschen</button></details></li>`;
    };
    body.innerHTML = `<section class="sw-journal"><div class="sw-sectionlead">${foldMark(5)}<span class="sw-kicker">Freiwillig beobachten</span><h3>Was passt zu dir?</h3><p>Erfahrungen sind keine Wirksamkeitsmessung und keine Diagnose. Sie können helfen, deine Auswahl beim nächsten Mal zu erleichtern.</p></div>${state.experiences.length ? `<ol class="sw-journalentries">${[...state.experiences].reverse().map(entry).join('')}</ol>` : '<div class="sw-empty"><p>Du musst nichts protokollieren. Nach einer Übung kannst du freiwillig etwas festhalten.</p><button type="button" data-action="browse">Eine Hilfe auswählen</button></div>'}</section>`;
  }
  function renderData(body) {
    body.innerHTML = `<section class="sw-data"><div class="sw-sectionlead">${foldMark(3)}<span class="sw-kicker">Deine Daten, deine Entscheidung</span><h3>Sichern & mitnehmen</h3><p>Eine Datei enthält deine Favoriten, eigenen Skills und freiwilligen Erfahrungen. Sie wird heruntergeladen, nicht veröffentlicht.</p></div><div class="sw-datacount"><span><strong>${state.favorites.length}</strong> Favoriten</span><span><strong>${state.customSkills.length}</strong> eigene Skills</span><span><strong>${state.experiences.length}</strong> Erfahrungen</span></div><div class="sw-dataactions"><button type="button" class="sw-primary" data-action="export">Persönliche Datei exportieren ↓</button><label class="sw-import">Datei ergänzend importieren ↑<input type="file" accept="application/json,.json" data-sw-import></label></div><p>Import ergänzt deinen Bestand. Gleichnamige Hilfen mit unterschiedlicher Herkunft bleiben erhalten. Bei derselben gespeicherten Hilfe bleiben deine aktuellen Angaben erhalten; abweichende importierte Varianten erhalten einen eigenen Eintrag.</p><p data-sw-import-result role="status"></p><details class="sw-methodnote"><summary>Was ist in dieser Werkstatt geprüft?</summary><p>Die 16 redaktionellen Alltagshilfen unterscheiden Originalprinzip, bestehende Arbeit und App-Anpassung. Sie sind keine klinisch geprüfte Intervention als Gesamtpaket. Die optionalen kurzen Bildimpulse stammen aus dem TraumaAtlas-Bestand; sie sind stumme KI-Illustrationen und keine Übungsdemonstrationen.</p><p>Das WHO-Handbuch bietet auf seiner offiziellen Seite unter anderem deutsche Text- und Audiozugänge. Externe Angebote öffnen sich bewusst in einem neuen Tab; ihre Sprache und Erreichbarkeit können sich unterscheiden.</p><a href="${esc(library.sources.who.url)}" target="_blank" rel="noopener noreferrer">Zum WHO-Handbuch und den Sprachfassungen ↗</a></details></section>`;
  }
  function chooseSkill(id, focus = true) {
    const found = allSkills().find(s => s.id === id); if (!found) { announce('Diese Hilfe ist in deinem aktuellen Bestand nicht verfügbar.'); return; }
    choosing = false; selectedId = found.id; guide = null; selectionOpen = false; prepareTimer(0);
    if (!results().some(s => s.id === found.id)) { filters = {search:'',need:'',goal:'',environment:'',minutes:'',preference:''}; onlyFavorites = false; mode = 'browse'; shell(); }
    if (mode !== 'browse') { mode = 'browse'; shell(); }
    else { renderResults(); renderDetail(focus); }
    const chooser = host.querySelector('.sw-selection'); if (chooser) chooser.open = false;
    if (focus) host.querySelector('[data-sw-detail]')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }
  function openAtlas() {
    const skill = selected(); const query = atlasOrigin?.title || skill.atlasTerms?.[0] || skill.title;
    const context = { skillTitle: skill.title, atlasTerms: [...(skill.atlasTerms || [])], origin: atlasOrigin ? { ...atlasOrigin } : null };
    prepareTimer(0);
    if (typeof options.onAtlas === 'function') options.onAtlas(query, context);
    else {
      // This is the existing app navigation event, also understood outside the shared view.
      // The old atlas:explore event had no consumer in this app.
      window.dispatchEvent(new CustomEvent('atlas-open', { detail: { query, view: 'landscape', origin: context.origin } }));
      if (window.location.hash !== '#atlas') window.location.hash = 'atlas';
    }
  }
  function runAction(action, button) {
    const skill = selected();
    if (action === 'add-step') {
      const container = host.querySelector('[data-sw-steps]'), count = container?.querySelectorAll('[data-sw-step]').length || 0;
      if (!container) return;
      if (count >= 30) return announce('Eine Anleitung kann bis zu 30 Schritte enthalten.');
      container.insertAdjacentHTML('beforeend', customStepHTML({}, count));
      container.lastElementChild.querySelector('[name="stepText"]')?.focus();
      return;
    }
    if (action === 'remove-step') {
      const container = host.querySelector('[data-sw-steps]');
      if (!container || container.querySelectorAll('[data-sw-step]').length <= 1) return announce('Mindestens ein Schritt gehört zu deiner Anleitung.');
      const row = button.closest('[data-sw-step]'), next = row?.nextElementSibling || row?.previousElementSibling;
      row?.remove();
      container.querySelectorAll('[data-sw-step]').forEach((step, index) => { step.querySelector('legend').textContent = `Schritt ${index + 1}`; });
      next?.querySelector('[name="stepText"]')?.focus();
      return announce('Schritt aus dem Entwurf entfernt. Deine gespeicherte Hilfe wird erst beim Speichern geändert.');
    }
    if (action === 'timer') return toggleTimer();
    if (action === 'timer-reset') { stopTimer(true); paintTimer(); return announce('Timer zurückgesetzt. Er startet nur, wenn du ihn selbst startest.'); }
    if (action === 'atlas') return openAtlas();
    if (action === 'favorite') {
      state.favorites = state.favorites.includes(skill.id) ? state.favorites.filter(x => x !== skill.id) : [...state.favorites, skill.id];
      persist(); renderDetail(); renderResults();
      const fav = host.querySelector('[data-action="favorites"] span'); if (fav) fav.textContent = state.favorites.length;
      host.querySelector('[data-action="favorite"]')?.focus(); return announce(state.favorites.includes(skill.id) ? 'Als Favorit gemerkt.' : 'Aus den Favoriten entfernt.');
    }
    if (action === 'start') { guide = { index: 0, finished: false }; prepareTimer(skill.steps[0].seconds); renderDetail(true); return; }
    if (action === 'pause-guide') {
      if (!guide || guide.finished) return;
      if (timerRunning) timerLeft = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
      stopTimer(); guide.paused = !guide.paused; renderDetail(true);
      return announce(guide.paused ? 'Die Übung und der Timer pausieren. Du entscheidest, ob du weitergehen möchtest.' : 'Der Schritt ist wieder geöffnet. Ein Timer startet nur auf deinen Wunsch.');
    }
    if (action === 'previous' || action === 'next') {
      if (!guide || guide.finished) return;
      const next = guide.index + (action === 'next' ? 1 : -1);
      if (next >= skill.steps.length) { guide.finished = true; prepareTimer(0); }
      else { guide.index = Math.max(0, next); guide.paused = false; prepareTimer(skill.steps[guide.index].seconds); }
      renderDetail(true); return;
    }
    if (action === 'finish') { guide = { ...(guide || {index:0}), finished: true }; prepareTimer(0); renderDetail(true); return; }
    if (action === 'overview') { guide = null; prepareTimer(0); renderDetail(true); return; }
    if (action === 'outer') { chooseSkill('orientieren', false); guide = {index:0, finished:false}; prepareTimer(selected().steps[0].seconds); renderDetail(true); return; }
    if (action === 'alternative') { choosing = true; selectionOpen = false; guide = null; prepareTimer(0); filters = {search:'',need:'',goal:'',environment:'',minutes:'',preference:''}; onlyFavorites = false; shell(); host.querySelector('[data-preference]')?.focus(); return; }
    if (action === 'selection') { const chooser = host.querySelector('.sw-selection'); if (chooser) { selectionOpen = true; chooser.open = true; chooser.scrollIntoView({ block: 'start', behavior: 'instant' }); chooser.querySelector('[data-skill]')?.focus({preventScroll:true}); } return; }
    if (action === 'clear-filters') { choosing = true; selectionOpen = true; filters = {search:'',need:'',goal:'',environment:'',minutes:'',preference:''}; onlyFavorites = false; mode = 'browse'; shell(); announce('Alle Hilfen werden angezeigt.'); host.querySelector('[data-preference]')?.focus(); return; }
    if (action === 'edit') { editingId = button.dataset.id; mode = 'custom'; guide = null; prepareTimer(0); shell(); host.querySelector('[name="title"]')?.focus(); return; }
    if (action === 'new-custom') { editingId = null; mode = 'custom'; shell(); host.querySelector('[name="title"]')?.focus(); return; }
    if (action === 'delete-experience') {
      if (button.dataset.confirmed !== 'true') { button.dataset.confirmed = 'true'; button.textContent = 'Löschen bestätigen'; return; }
      state.experiences = state.experiences.filter(e => e.id !== button.dataset.id); persist(); shell(); announce('Die gewählte Erfahrung wurde gelöscht.'); return;
    }
    if (action === 'export') {
      const payload = JSON.stringify({ kind: 'borderline-skill-workshop', exportedAt: new Date().toISOString(), ...state }, null, 2);
      const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
      const link = document.createElement('a'); link.href = url; link.download = `mein-skillkoffer-${new Date().toISOString().slice(0,10)}.json`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); return announce('Die persönliche Datei wurde zum Download bereitgestellt.');
    }
    if (['browse','favorites','custom','experiences','data'].includes(action)) {
      guide = null; prepareTimer(0);
      if (action === 'favorites') { choosing = true; onlyFavorites = !onlyFavorites; mode = 'browse'; }
      else { mode = action; if (action === 'browse') { onlyFavorites = false; choosing = true; } }
      shell();
    }
  }
  host.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button || !host.contains(button)) return;
    if (button.dataset.preference) {
      filters = {search:'', need:'', goal:'', environment:'', minutes:'', preference:button.dataset.preference};
      choosing = true; selectionOpen = true; onlyFavorites = false; guide = null; prepareTimer(0); shell();
      host.querySelector('.sw-selection')?.scrollIntoView({block:'start', behavior:'instant'});
      host.querySelector('[data-skill]')?.focus({preventScroll:true});
      return announce('Wähle eine Übung aus dieser Art. Du kannst die Auswahl jederzeit ändern.');
    }
    if (button.dataset.need) {
      choosing = true; selectionOpen = true;
      const next = filters.need === button.dataset.need ? '' : button.dataset.need;
      filters = {search:'',need:next,goal:'',environment:'',minutes:'',preference:''};
      onlyFavorites = false; guide = null; prepareTimer(0); shell();
      host.querySelector(`[data-need="${button.dataset.need}"]`)?.focus({preventScroll:true});
      return announce(next ? `Hilfen für ${label(next)}. Du wählst, was passt.` : 'Alle Hilfen sind wieder verfügbar.');
    }
    if (button.dataset.step !== undefined) {
      const index = Number(button.dataset.step);
      if (!Number.isInteger(index) || !selected().steps[index]) return;
      guide = {index, finished:false}; prepareTimer(selected().steps[index].seconds); renderDetail(true); return;
    }
    if (button.dataset.skill) return chooseSkill(button.dataset.skill);
    if (button.dataset.action) runAction(button.dataset.action, button);
  }, { signal: ownAbort.signal });
  host.addEventListener('toggle', event => { if (event.target.matches('.sw-selection')) selectionOpen = event.target.open; }, {capture:true, signal:ownAbort.signal});
  host.addEventListener('input', event => {
    const name = event.target.dataset.filter; if (!name) return;
    filters[name] = event.target.value;
    choosing = true; selectionOpen = true;
    const chooser = host.querySelector('.sw-selection'); if (chooser) chooser.open = true;
    host.querySelectorAll('[data-need]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.need === filters.need)));
    const summary = host.querySelector('.sw-refine > summary');
    if (summary) summary.textContent = `Eine Hilfe genauer auswählen${Object.values(filters).some(Boolean) || onlyFavorites ? ' · Auswahl aktiv' : ''}`;
    const list = results();
    if (!guide) { if (list.length && !list.some(s => s.id === selectedId)) selectedId = list[0].id; renderDetail(); }
    renderResults();
    const count = list.length; announce(`${count} ${count === 1 ? 'Hilfe passt' : 'Hilfen passen'} zu deiner Auswahl.`);
  }, { signal: ownAbort.signal });
  host.addEventListener('submit', event => {
    if (event.target.matches('[data-sw-feedback]')) {
      event.preventDefault(); const form = new FormData(event.target); const skill = selected();
      state.experiences.push({ id: uid(), skillId: skill.id, skillTitle: skill.title, outcome: form.get('outcome') || 'offen', note: String(form.get('note') || ''), date: new Date().toISOString() });
      persist(); guide = null; mode = 'experiences'; shell(); announce('Deine freiwillige Erfahrung ist gespeichert.');
    } else if (event.target.matches('[data-sw-custom]')) {
      event.preventDefault(); const form = new FormData(event.target); const existing = state.customSkills.find(s => s.id === editingId);
      const titles = form.getAll('stepTitle'), seconds = form.getAll('stepSeconds');
      const raw = { ...existing, id: existing?.id || uid(), title: form.get('title'), purpose: form.get('purpose'), when: form.get('when'), minutes: Number(form.get('minutes')), steps: form.getAll('stepText').map((text, index) => ({ title: titles[index], text, seconds: seconds[index] })), materials: form.get('materials'), limits: form.get('limits'), atlasTerms: String(form.get('atlasTerms') || '').split(',').map(x => x.trim()).filter(Boolean), need: form.getAll('need'), environment: form.getAll('environment'), preference: form.getAll('preference'), origin: { ...existing?.origin, kind:form.get('originKind'), text:form.get('originText') }, createdAt: existing?.createdAt || new Date().toISOString(), updatedAt: new Date().toISOString() };
      const custom = cleanCustom(raw); if (!custom) return announce('Bitte gib einen Namen und mindestens einen Schritt ein.');
      state.customSkills = existing ? state.customSkills.map(s => s.id === custom.id ? custom : s) : [...state.customSkills, custom];
      persist(); editingId = custom.id; shell(); announce('Dein eigener Skill ist gespeichert.');
    }
  }, { signal: ownAbort.signal });
  host.addEventListener('change', async event => {
    if (event.target.matches('[data-step-jump]')) {
      const index = Number(event.target.value), skill = selected();
      if (Number.isInteger(index) && index >= 0 && index < skill.steps.length) {
        guide = { index, finished:false, paused:false }; prepareTimer(skill.steps[index].seconds); renderDetail(true);
      }
      return;
    }
    if (!event.target.matches('[data-sw-import]')) return;
    const file = event.target.files?.[0]; if (!file) return;
    const result = host.querySelector('[data-sw-import-result]');
    try {
      if (file.size > 2_000_000) throw new Error('Die Datei ist zu groß. Bitte nutze eine Skillkoffer-Datei bis zwei Megabyte.');
      const raw = JSON.parse(await file.text());
      if (raw.kind !== 'borderline-skill-workshop' && !(raw.version === 1 && Array.isArray(raw.customSkills) && Array.isArray(raw.experiences))) throw new Error('Bitte wähle eine exportierte Skillkoffer-Datei.');
      const incoming = cleanState(raw); let added = 0, variants = 0; const remap = new Map();
      for (const s of incoming.customSkills) {
        const current = state.customSkills.find(x => x.id === s.id);
        if (!current) { state.customSkills.push(s); added++; }
        else if (JSON.stringify({...current,updatedAt:null}) !== JSON.stringify({...s,updatedAt:null})) { const oldId = s.id; s.id = uid(); s.title = `${s.title} · importierte Variante`; state.customSkills.push(s); remap.set(oldId,s.id); variants++; }
      }
      const known = new Set(state.experiences.map(e => e.id));
      for (const e of incoming.experiences) if (!known.has(e.id)) { state.experiences.push({...e,skillId:remap.get(e.skillId) || e.skillId}); known.add(e.id); }
      state.favorites = [...new Set([...state.favorites, ...incoming.favorites.map(id => remap.get(id) || id)])];
      persist(); shell(); const status = host.querySelector('[data-sw-import-result]');
      if (status) status.textContent = `Import ergänzt: ${added} neue eigene Hilfen, ${variants} erhaltene Varianten. Vorhandene Angaben bleiben erhalten.`;
      announce('Deine Datei wurde ergänzend importiert.');
    } catch (error) { if (result) result.textContent = error instanceof SyntaxError ? 'Die Datei enthält kein gültiges JSON. Dein Bestand wurde nicht verändert.' : error.message; }
  }, { signal: ownAbort.signal });
  const externalSkill = event => {
    if (event.detail?.id || event.detail?.query || event.detail?.need) focusSkill(event.detail.id || event.detail.query || event.detail.need, event.detail.origin);
  };
  function focusSkill(query, origin) {
    if (destroyed) return;
    if (origin !== undefined) atlasOrigin = cleanAtlasOrigin(origin);
    const context = host.querySelector('[data-sw-context]');
    if (context) context.innerHTML = contextHTML();
    const wanted = normalize(query);
    const skill = allSkills().find(s => s.id === query) || allSkills().find(s => normalize([s.title,...(s.atlasTerms || []),...s.need.map(label)].join(' ')).includes(wanted));
    if (skill) chooseSkill(skill.id);
    else {
      const topic = skillTopicQuery(query, allSkills());
      filters = { search: topic, need: '', goal: '', environment: '', minutes: '', preference: '' };
      mode = 'browse'; onlyFavorites = false; guide = null; prepareTimer(0); shell();
      announce(topic ? `Hilfen zum Thema ${topic}. Wähle selbst, was gerade passt.` : 'Wähle nach deinem aktuellen Bedarf. Für diesen Atlasbegriff gibt es keine eindeutige Zuordnung.');
    }
  }
  host.addEventListener('atlas:skill', externalSkill, { signal: ownAbort.signal });
  shell();
  return { focusSkill, destroy() {
    destroyed = true;
    if (guide && !guide.finished) {
      const remaining = timerRunning ? Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000)) : timerLeft;
      interruptedJourneys.set(host, { selectedId, guide: { ...guide, paused: true }, timerLeft: remaining, timerTotal, atlasOrigin });
    } else interruptedJourneys.delete(host);
    stopFold(); stopTimer(); ownAbort.abort(); host.classList.remove('skill-workshop'); delete host.dataset.swMode; delete host.dataset.swSession; delete host.dataset.swChoosing; host.innerHTML = '';
  } };
}
