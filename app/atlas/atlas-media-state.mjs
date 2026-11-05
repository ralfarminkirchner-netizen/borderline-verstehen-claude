const PREFIX = 'borderline.atlas.media.v1:';

// Positions belong to the original local asset, shared by every reader of it.
export function mediaKey(src, base) {
  try {
    const url = new URL(src, base);
    const origin = new URL(base).origin;
    return /^https?:$/.test(url.protocol) && url.origin === origin && /^\/assets\/media\/[^/]/.test(url.pathname) ? PREFIX + url.pathname : null;
  } catch { return null; }
}

export function readPosition(storage, key, duration) {
  if (!key || !Number.isFinite(duration) || duration <= 0) return 0;
  try {
    const saved = JSON.parse(storage.getItem(key));
    if (!saved || !Number.isFinite(saved.time) || !Number.isFinite(saved.duration) || Math.abs(saved.duration - duration) > 2) return 0;
    return saved.time > 0 && saved.time < duration - 1 ? saved.time : 0;
  } catch { return 0; }
}

export function writePosition(storage, key, time, duration) {
  if (!key || !Number.isFinite(time) || !Number.isFinite(duration) || duration <= 0) return false;
  try {
    storage.setItem(key, JSON.stringify({time: time >= duration - 1 ? 0 : Math.max(0, time), duration}));
    return true;
  } catch { return false; }
}

/** Resume the position, never playback. Removed players pause and save as well. */
export function installMediaContinuity(root = document) {
  const players = new Map();
  // An untouched copy in another reader must not overwrite the last used player.
  const activePlayers = new Map();
  let storage;
  try { storage = window.localStorage; } catch { return () => {}; }
  const saveAll = () => {
    players.forEach(state => state.captureUnobservedProgress());
    players.forEach(state => state.save());
  };
  function attach(player) {
    if (players.has(player)) return;
    let lastSaved = 0, restoredSource = '', restoredPosition = null, observedTime = player.currentTime;
    const key = () => mediaKey(player.currentSrc || player.src, document.baseURI);
    const state = {};
    const save = () => activePlayers.get(key()) === state && writePosition(storage, key(), player.currentTime, player.duration);
    const activate = (explicit = false) => {
      const currentKey = key();
      if (!currentKey || !Number.isFinite(player.currentTime)) return;
      if (explicit || player.currentTime !== observedTime) {
        restoredPosition = null;
        activePlayers.set(currentKey, state);
      }
      observedTime = player.currentTime;
    };
    const isRestoredSeek = () => restoredPosition !== null && Math.abs(player.currentTime - restoredPosition) < 0.01;
    const restore = () => {
      const source = player.currentSrc || player.src;
      if (restoredSource === source || !Number.isFinite(player.duration) || player.duration <= 0) return;
      restoredSource = source;
      restoredPosition = null;
      const position = readPosition(storage, key(), player.duration);
      if (position) { restoredPosition = position; player.currentTime = position; }
      observedTime = player.currentTime;
    };
    const tick = () => { activate(); if (Date.now() - lastSaved > 4000) { save(); lastSaved = Date.now(); } };
    const pause = () => { activate(); save(); };
    const seeking = () => { if (!isRestoredSeek()) activate(true); };
    const seeked = () => {
      if (isRestoredSeek()) { restoredPosition = null; return; }
      activate(true); save();
    };
    const events = {loadedmetadata: restore, durationchange: restore, play: () => activate(true), seeking, pause, seeked, ended: () => { activate(true); save(); }, timeupdate: tick};
    Object.entries(events).forEach(([name, fn]) => player.addEventListener(name, fn));
    Object.assign(state, {save, captureUnobservedProgress() { if (!activePlayers.has(key())) activate(); }, detach() {
      activate(); save();
      Object.entries(events).forEach(([name, fn]) => player.removeEventListener(name, fn));
      player.pause();
      for (const [source, active] of activePlayers) if (active === state) activePlayers.delete(source);
    }});
    players.set(player, state);
    if (player.readyState >= 1) restore();
  }
  function scan() {
    for (const [player, state] of players) if (!player.isConnected) { state.detach(); players.delete(player); }
    root.querySelectorAll('audio[controls],video[controls]').forEach(attach);
  }
  scan();
  const observer = new MutationObserver(scan);
  observer.observe(root, {childList: true, subtree: true});
  const onVisibility = () => { if (document.visibilityState === 'hidden') saveAll(); };
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('pagehide', saveAll);
  return () => { observer.disconnect(); saveAll(); players.forEach(state => state.detach()); players.clear(); document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pagehide', saveAll); };
}
