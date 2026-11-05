import { publicText } from './atlas-public-copy.mjs';
// One document-level media surface. The original media element is moved, never
// copied: reader changes cannot tear down playback or create a second sound.
const mounts = new WeakMap();
const corners = new Set(['top-left', 'top-right', 'bottom-left', 'bottom-right']);
const finite = (n, fallback) => Number.isFinite(n) ? n : fallback;
const human = (value, fallback = 'Medium') => publicText(value || fallback)
  .replace(/\b[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\b/ig, 'geschützte Kennung')
  .replace(/\b[0-9a-f]{24,}\b/ig, 'geschützte Kennung');

export function mediaIdentity(src, base = 'https://atlas.invalid/') {
  if (typeof src !== 'string' || !src.trim()) return null;
  try {
    const url = new URL(src, base);
    if (!['https:', 'http:', 'blob:'].includes(url.protocol)) return null;
    url.hash = '';
    // Local originals share identity even when a download decoration is added.
    if (url.origin === new URL(base).origin && /\/assets\/media\//.test(url.pathname)) url.search = '';
    return url.href;
  } catch { return null; }
}

/** Pure geometry helpers are also used for pointer, keyboard and resize paths. */
export function clampWindow(rect, viewport, margin = 12) {
  const vw = Math.max(1, finite(viewport.width, 1)), vh = Math.max(1, finite(viewport.height, 1));
  const gap = Math.min(margin, Math.max(0, (Math.min(vw, vh) - 1) / 2));
  const width = Math.max(1, Math.min(finite(rect.width, 360), vw - gap * 2));
  const height = Math.max(1, Math.min(finite(rect.height, 240), vh - gap * 2));
  return {x: Math.max(gap, Math.min(finite(rect.x, gap), vw - gap - width)),
    y: Math.max(gap, Math.min(finite(rect.y, gap), vh - gap - height)), width, height};
}

export function dockWindow(rect, corner, viewport, margin = 12) {
  const next = clampWindow(rect, viewport, margin);
  if (!corners.has(corner)) return next;
  return clampWindow({...next,
    x: corner.endsWith('right') ? viewport.width - next.width - margin : margin,
    y: corner.startsWith('bottom') ? viewport.height - next.height - margin : margin}, viewport, margin);
}

export function resizeWindow(rect, desiredWidth, viewport, {aspect = 0, chrome = 156, minWidth = 280} = {}) {
  const maximumWidth = Math.max(1, viewport.width - 24);
  let width = Math.min(maximumWidth, Math.max(Math.min(minWidth, maximumWidth), desiredWidth));
  if (aspect > 0) width = Math.min(width, Math.max(1, viewport.height - 24 - chrome) * aspect);
  const height = aspect > 0 ? width / aspect + chrome : rect.height;
  return clampWindow({...rect, width, height}, viewport);
}

export function mountAtlasPlayer(options = {}) {
  const doc = options.document || globalThis.document;
  if (!doc?.body) throw new Error('Die Medienoberfläche benötigt eine geöffnete Atlasansicht.');
  if (mounts.has(doc)) {
    const existing = mounts.get(doc);
    if (options.media) existing.setMedia(options.media);
    return existing;
  }
  const win = doc.defaultView || globalThis.window;
  const host = doc.createElement('div'); host.className = 'atlas-player-host';
  host.setAttribute('aria-label', 'Offene Medien'); doc.body.append(host);
  const styleURL = new URL('./atlas-player.css', import.meta.url).href;
  if (![...doc.querySelectorAll('link[rel="stylesheet"]')].some(link => link.href === styleURL)) {
    const link = doc.createElement('link'); link.rel = 'stylesheet'; link.href = styleURL; doc.head.append(link);
  }
  const records = new Map(), catalogue = new Map(), launchers = new Map();
  const sessionKey = 'atlas.media.windows.v1';
  let lastSessionSave = 0;
  let destroyed = false, top = 0;
  const viewport = () => ({width: win.innerWidth, height: win.innerHeight});
  const keyFor = src => mediaIdentity(src, doc.baseURI);
  const safeURL = value => {
    try { const u = new URL(value, doc.baseURI); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
  };
  const element = (tag, className, text) => {
    const el = doc.createElement(tag); if (className) el.className = className;
    if (text !== undefined) el.textContent = human(text); return el;
  };
  function button(text, callback, label) {
    const b = element('button', '', text); b.type = 'button';
    if (label) b.setAttribute('aria-label', label);
    b.addEventListener('click', callback); return b;
  }
  function setMedia(items = []) {
    for (const item of items) { const key = keyFor(item.file || item.src || item.url); if (key) catalogue.set(key, item); }
  }
  // Keep only catalogue-backed media and window controls in this tab's session.
  // Origins, text, personal notes and arbitrary caller-provided URLs stay out.
  function saveSession(event) {
    if (event?.type === 'timeupdate' && Date.now() - lastSessionSave < 2000) return;
    lastSessionSave = Date.now();
    const state = [...records.values()].filter(r => !r.surface.hidden && catalogue.has(r.key)).slice(-8).map(r => ({
      file: catalogue.get(r.key).file || catalogue.get(r.key).src || catalogue.get(r.key).url,
      rect: r.rect, floatRect: r.floatRect, dock: r.dock, minimized: r.minimized,
      time: finite(r.player.currentTime, 0)
    }));
    try { win.sessionStorage.setItem(sessionKey, JSON.stringify(state)); } catch { /* Playback also works with storage disabled. */ }
  }
  function restoreSession() {
    let state;
    try { state = JSON.parse(win.sessionStorage.getItem(sessionKey) || '[]'); } catch { return; }
    if (!Array.isArray(state)) return;
    for (const saved of state.slice(-8)) {
      const item = catalogue.get(keyFor(saved?.file));
      if (!item || !/^(audio|video)$/i.test(item.format || '')) continue;
      const record = openMedia(item); if (!record) continue;
      record.rect = clampWindow(saved.rect || record.rect, viewport());
      record.floatRect = clampWindow(saved.floatRect || record.rect, viewport());
      record.dock = corners.has(saved.dock) ? saved.dock : null;
      record.minimized = saved.minimized === true; apply(record);
      const seek = () => {
        if (Number.isFinite(saved.time) && saved.time >= 0) record.player.currentTime = Math.min(saved.time, finite(record.player.duration, saved.time));
      };
      if (record.player.readyState) seek(); else record.player.addEventListener('loadedmetadata', seek, {once: true});
    }
  }
  function silenceExcept(player) {
    doc.querySelectorAll('audio,video').forEach(other => { if (other !== player && !other.paused) other.pause(); });
  }
  function apply(record) {
    const v = viewport();
    let visible;
    if (record.minimized) {
      visible = record.dock ? dockWindow({...record.rect, height: 76}, record.dock, v) : clampWindow({...record.rect, height: 76}, v);
      record.rect = {...record.rect, x: visible.x, y: visible.y, width: visible.width};
    } else {
      record.rect = record.dock ? dockWindow(record.rect, record.dock, v) : clampWindow(record.rect, v);
      visible = record.rect;
    }
    Object.assign(record.surface.style, {left: `${visible.x}px`, top: `${visible.y}px`, width: `${visible.width}px`, height: `${visible.height}px`});
    record.surface.classList.toggle('is-minimized', record.minimized);
    record.surface.dataset.dock = record.dock || 'free';
    record.body.hidden = record.minimized; record.resize.hidden = record.minimized || record.kind !== 'video';
    record.minimize.textContent = record.minimized ? 'Öffnen' : 'Klein';
    record.minimize.setAttribute('aria-label', record.minimized ? 'Medienfenster wieder öffnen' : 'Medienfenster minimieren; Wiedergabe läuft weiter');
    record.minimize.setAttribute('aria-expanded', String(!record.minimized));
    record.dockSelect.value = record.dock || 'free';
  }
  function raise(record) { record.surface.style.zIndex = String(++top); }
  function float(record) { if (record.dock) { record.dock = null; record.floatRect = {...record.rect}; } }
  function move(record, dx, dy) {
    float(record); record.rect = {...record.rect, x: record.rect.x + dx, y: record.rect.y + dy};
    record.floatRect = {...record.rect}; apply(record);
  }
  function size(record, delta) {
    float(record); record.rect = resizeWindow(record.rect, record.rect.width + delta, viewport(), {aspect: record.aspect});
    record.floatRect = {...record.rect}; apply(record);
  }
  function returnToOrigin(record) {
    const detail = {media: record.item, origin: record.origin, player: record.player};
    options.onReturn?.(detail);
    doc.dispatchEvent(new win.CustomEvent('atlas-media:return', {detail}));
    const target = record.origin?.element;
    if (target?.isConnected) { target.scrollIntoView({block: 'center', behavior: 'instant'}); target.focus({preventScroll: true}); }
  }
  function updatePlay(record) {
    record.play.textContent = record.player.paused ? '▶' : 'Ⅱ';
    record.play.setAttribute('aria-label', record.player.paused ? 'Wiedergabe starten' : 'Wiedergabe pausieren');
  }
  function play(record) {
    if (!record.player.paused) { record.player.pause(); return; }
    silenceExcept(record.player);
    const attempt = record.player.play();
    attempt?.catch(() => { record.status.textContent = 'Die Wiedergabe konnte nicht starten. Nutze die Mediensteuerung oder die Originalquelle.'; });
  }
  function openMedia(input, origin = {}) {
    if (destroyed) return null;
    if (typeof input === 'string') input = {file: input};
    const original = input?.element;
    const src = input?.file || input?.src || original?.currentSrc || original?.src;
    const key = keyFor(src);
    if (!key) return null;
    let record = records.get(key);
    if (record) {
      record.surface.hidden = false;
      record.minimized = false; if (origin.element || origin.returnTo || origin.view) record.origin = origin;
      apply(record); raise(record); record.title.focus({preventScroll: true}); return record;
    }
    const item = {...catalogue.get(key), ...input};
    const kind = String(item.format || '').toLowerCase().includes('video') || original?.tagName === 'VIDEO' || /\.(mp4|webm|mov)(?:[?#]|$)/i.test(src) ? 'video' : 'audio';
    const player = original || doc.createElement(kind);
    player.controls = true; player.autoplay = false; player.removeAttribute('autoplay'); player.preload = 'metadata';
    if (kind === 'video') player.playsInline = true;
    if (!original) player.src = src;
    if (item.poster && safeURL(item.poster)) player.poster = safeURL(item.poster);
    if (item.track && !player.querySelector('track') && safeURL(item.track)) {
      const track = doc.createElement('track'); track.kind = 'captions'; track.src = safeURL(item.track);
      track.srclang = item.language || 'de'; track.label = human(item.trackLabel || 'Untertitel'); player.append(track);
    }
    const name = human(item.title, kind === 'audio' ? 'Audio hören' : 'Video anschauen');
    const surface = element('section', 'atlas-player lr-media-window'); surface.setAttribute('aria-label', `${name} · Medienfenster`);
    const header = element('header', 'atlas-player-header');
    const title = element('h2', 'atlas-player-title', name); title.tabIndex = 0;
    title.setAttribute('aria-label', `${name}. Mit Pfeiltasten verschieben; Plus und Minus ändern die Größe.`);
    const body = element('div', 'atlas-player-body');
    const initial = clampWindow({x: viewport().width - 452, y: viewport().height - (kind === 'video' ? 422 : 290), width: 440, height: kind === 'video' ? 404 : 266}, viewport());
    record = {key, item, player, kind, surface, title, body, origin, rect: initial, floatRect: {...initial}, dock: null, minimized: false, aspect: kind === 'video' && player.videoWidth && player.videoHeight ? player.videoWidth / player.videoHeight : 16 / 9, playerEvents: []};
    const playback = button('▶', () => play(record), 'Wiedergabe starten'); record.play = playback;
    const minimize = button('Klein', () => { record.minimized = !record.minimized; apply(record); }); record.minimize = minimize;
    const close = button('×', () => { player.pause(); surface.hidden = true; const target = record.origin.element; if (target?.isConnected) target.focus({preventScroll: true}); }, 'Medienfenster schließen und Wiedergabe beenden');
    const actions = element('div', 'atlas-player-window-actions'); actions.append(playback, minimize, close);
    header.append(title, actions); surface.append(header, body); body.append(player);
    const tools = element('div', 'atlas-player-tools');
    const speedLabel = element('label', '', 'Tempo '), speed = doc.createElement('select'); speed.setAttribute('aria-label', 'Wiedergabegeschwindigkeit');
    for (const rate of [.75, 1, 1.25, 1.5, 1.75, 2]) { const option = element('option', '', `${rate.toLocaleString('de')}×`); option.value = String(rate); speed.append(option); }
    speed.value = String(player.playbackRate || 1); speed.addEventListener('change', () => { player.playbackRate = Number(speed.value); }); speedLabel.append(speed);
    tools.append(speedLabel, button('Zum Fundort ↗', () => returnToOrigin(record))); body.append(tools);
    const status = element('p', 'atlas-player-status', 'Bereit. Die Wiedergabe beginnt mit deinem Start.'); status.setAttribute('role', 'status'); record.status = status; body.append(status);
    const layout = element('details', 'atlas-player-layout'), summary = element('summary', '', 'Fenster anordnen'); layout.append(summary);
    const layoutTools = element('div', 'atlas-player-layout-tools');
    const dockLabel = element('label', '', 'Position '), dockSelect = doc.createElement('select'); record.dockSelect = dockSelect;
    dockSelect.setAttribute('aria-label', 'Medienfenster andocken');
    for (const [value, label] of [['free', 'Frei bewegen'], ['top-left', 'Oben links'], ['top-right', 'Oben rechts'], ['bottom-left', 'Unten links'], ['bottom-right', 'Unten rechts']]) { const option = element('option', '', label); option.value = value; dockSelect.append(option); }
    dockSelect.addEventListener('change', () => {
      const next = dockSelect.value;
      if (next === 'free') { record.dock = null; record.rect = {...record.floatRect}; }
      else { if (!record.dock) record.floatRect = {...record.rect}; record.dock = next; }
      apply(record);
    }); dockLabel.append(dockSelect); layoutTools.append(dockLabel);
    for (const [text, dx, dy, label] of [['←', -24, 0, 'Fenster nach links'], ['↑', 0, -24, 'Fenster nach oben'], ['↓', 0, 24, 'Fenster nach unten'], ['→', 24, 0, 'Fenster nach rechts']]) layoutTools.append(button(text, () => move(record, dx, dy), label));
    if (kind === 'video') layoutTools.append(button('Kleiner', () => size(record, -64)), button('Größer', () => size(record, 64)));
    layout.append(layoutTools); body.append(layout);
    function detail(label, content) { const details = element('details', 'atlas-player-extra'); details.append(element('summary', '', label), content); body.append(details); }
    if (item.chapters?.length) {
      const chapters = element('div', 'atlas-player-chapters');
      item.chapters.filter(c => Number.isFinite(c.start) && c.start >= 0).forEach(c => chapters.append(button(`${Math.floor(c.start / 60)}:${String(Math.floor(c.start % 60)).padStart(2, '0')} · ${human(c.title || c.label, 'Kapitel')}`, () => { player.currentTime = c.start; })));
      if (chapters.childElementCount) detail('Kapitel', chapters);
    }
    if (item.transcript) { const transcript = element('div', 'atlas-player-transcript'); transcript.textContent = item.transcript; detail('Sprechtext lesen · automatische Transkription', transcript); }
    if (item.track) { const note = element('p', '', 'Vorhandene Untertitel lassen sich in der Video-Steuerung einschalten.'); detail('Untertitel', note); }
    const sources = element('div', 'atlas-player-sources');
    for (const [url, label] of [[item.sourceURL, 'Öffentliche Originalquelle ↗'], [item.notebookURL || item.notebookUrl, 'Ursprüngliches Notebook ↗'], [item.publicTextAlternative?.url, item.publicTextAlternative?.label || 'Lesbare Alternative ↗']]) {
      const href = safeURL(url); if (!url || !href) continue;
      const link = element('a', '', label); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; sources.append(link);
    }
    if (sources.childElementCount) detail('Quellen & Herkunft', sources);
    const resize = element('button', 'atlas-player-resize', '↘'); resize.type = 'button'; resize.setAttribute('aria-label', 'Videofenster vergrößern; Pfeiltasten ändern die Größe'); record.resize = resize; surface.append(resize);
    function startPointer(event, resizing = false) {
      if (event.button !== 0 || (!resizing && event.target.closest('button,select,a,input,summary'))) return;
      event.preventDefault(); raise(record); float(record);
      const start = {...record.rect}, x = event.clientX, y = event.clientY, target = resizing ? resize : header;
      target.setPointerCapture(event.pointerId);
      const change = e => {
        if (e.pointerId !== event.pointerId) return;
        record.rect = resizing ? resizeWindow(start, start.width + e.clientX - x, viewport(), {aspect: record.aspect}) : {...start, x: start.x + e.clientX - x, y: start.y + e.clientY - y};
        record.floatRect = {...record.rect}; apply(record);
      };
      const end = e => { if (e.pointerId !== event.pointerId) return; target.removeEventListener('pointermove', change); target.removeEventListener('pointerup', end); target.removeEventListener('pointercancel', end); if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId); };
      target.addEventListener('pointermove', change); target.addEventListener('pointerup', end); target.addEventListener('pointercancel', end);
    }
    header.addEventListener('pointerdown', e => startPointer(e)); resize.addEventListener('pointerdown', e => startPointer(e, true));
    title.addEventListener('keydown', e => {
      const step = e.shiftKey ? 40 : 10, direction = {ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step]}[e.key];
      if (direction) { e.preventDefault(); move(record, ...direction); }
      if (kind === 'video' && ['+', '=', '-'].includes(e.key)) { e.preventDefault(); size(record, e.key === '-' ? -32 : 32); }
    });
    resize.addEventListener('keydown', e => { if (['ArrowLeft', 'ArrowDown', 'ArrowRight', 'ArrowUp'].includes(e.key)) { e.preventDefault(); size(record, ['ArrowRight', 'ArrowUp'].includes(e.key) ? 32 : -32); } });
    surface.addEventListener('pointerdown', () => raise(record));
    function listen(name, callback) { player.addEventListener(name, callback); record.playerEvents.push([name, callback]); }
    for (const event of ['play', 'pause', 'ended']) listen(event, () => { updatePlay(record); status.textContent = player.ended ? 'Zu Ende gehört.' : player.paused ? 'Pausiert.' : 'Wiedergabe läuft · du kannst im Atlas weitergehen.'; });
    listen('error', () => { status.textContent = 'Dieses Medium lässt sich gerade nicht laden. Die Originalquelle ist unter „Quellen & Herkunft“ erreichbar, falls vorhanden.'; });
    const syncMetadata = () => {
      if (kind === 'video' && player.videoWidth && player.videoHeight) { record.aspect = player.videoWidth / player.videoHeight; record.rect = resizeWindow(record.rect, record.rect.width, viewport(), {aspect: record.aspect}); record.floatRect = {...record.rect}; apply(record); }
    };
    listen('loadedmetadata', syncMetadata);
    records.set(key, record); host.append(surface); syncMetadata(); apply(record); raise(record); updatePlay(record); title.focus({preventScroll: true});
    return record;
  }

  function adapt(player) {
    if (host.contains(player) || player.dataset.atlasFloatingSource === 'true') return;
    const src = player.currentSrc || player.src || player.querySelector('source')?.src;
    const key = keyFor(src); if (!key) return;
    const context = player.closest('article,.nl-reading-surface,.kl-inspector,section');
    const title = catalogue.get(key)?.title || player.getAttribute('aria-label') || context?.querySelector('h2,h3,h4')?.textContent || (player.tagName === 'VIDEO' ? 'Video anschauen' : 'Audio hören');
    const launch = button(`${player.tagName === 'VIDEO' ? '▷ Video' : '◖ Audio'} im Medienfenster öffnen`, () => {
      const found = catalogue.get(key) || {};
      const baseOrigin = {element: launch, title: human(title), mediaId: found.id,
        view: doc.querySelector('[data-shared-view][aria-pressed="true"]')?.dataset.sharedView,
        scrollY: win.scrollY, libraryItem: doc.querySelector('.nl-material[aria-pressed="true"]')?.dataset.itemId};
      const origin = {...baseOrigin, ...options.captureOrigin?.(baseOrigin)};
      openMedia({...found, file: src, title: found.title || title, element: player}, origin);
    });
    launch.className = 'atlas-media-launch';
    launch.setAttribute('aria-label', `${human(title)} im Medienfenster öffnen`);
    player.dataset.atlasFloatingSource = 'true';
    const wasPlaying = !player.paused; player.replaceWith(launch); launchers.set(launch, player);
    if (wasPlaying) openMedia({...catalogue.get(key), file: src, title, element: player}, {element: launch, title: human(title)});
  }
  function scan() {
    doc.querySelectorAll('audio[controls],video[controls]').forEach(adapt);
    for (const launch of launchers.keys()) if (!launch.isConnected) launchers.delete(launch);
  }
  const onOpen = event => {
    const detail = event.detail || {};
    openMedia(detail.media || detail.item || detail, detail.origin || {});
  };
  const onPlay = event => { if (event.target.matches?.('audio,video')) silenceExcept(event.target); };
  const onResize = () => records.forEach(record => {
    if (record.kind === 'video' && !record.minimized) record.rect = resizeWindow(record.rect, record.rect.width, viewport(), {aspect: record.aspect});
    apply(record);
  });
  setMedia(options.media); scan();
  restoreSession();
  const observer = new win.MutationObserver(scan); observer.observe(doc.body, {childList: true, subtree: true});
  doc.addEventListener('atlas-media:open', onOpen); doc.addEventListener('play', onPlay, true); win.addEventListener('resize', onResize);
  for (const event of ['click', 'pointerup', 'keyup', 'change', 'pause', 'timeupdate']) doc.addEventListener(event, saveSession, event === 'pause' || event === 'timeupdate');
  win.addEventListener('pagehide', saveSession);
  const api = {openMedia, setMedia, element: host, destroy() {
    if (destroyed) return; destroyed = true; observer.disconnect();
    doc.removeEventListener('atlas-media:open', onOpen); doc.removeEventListener('play', onPlay, true); win.removeEventListener('resize', onResize);
    for (const event of ['click', 'pointerup', 'keyup', 'change', 'pause', 'timeupdate']) doc.removeEventListener(event, saveSession, event === 'pause' || event === 'timeupdate');
    win.removeEventListener('pagehide', saveSession);
    records.forEach(record => { record.player.pause(); record.playerEvents.forEach(([name, callback]) => record.player.removeEventListener(name, callback)); });
    for (const [launch, player] of launchers) if (launch.isConnected) { player.pause(); delete player.dataset.atlasFloatingSource; launch.replaceWith(player); }
    records.clear(); launchers.clear(); host.remove(); mounts.delete(doc);
  }};
  mounts.set(doc, api); return api;
}

export const mount = mountAtlasPlayer;
export function openMedia(media, origin) { return mountAtlasPlayer().openMedia(media, origin); }
