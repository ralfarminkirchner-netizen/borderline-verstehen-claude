/** Isolated image viewer. Include atlas-image-viewer.css and call openAtlasImageViewer. */
const MIN_ZOOM = 0.0001;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Display text stays human; original image and provenance URLs remain untouched. */
export function humanImageText(value, fallback = '') {
  const label = String(value ?? '')
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, 'Herkunftsnachweis')
    .replace(/\b[0-9a-f]{24,}\b/gi, 'Herkunftsnachweis')
    .trim();
  return label || fallback;
}

/** Scale about a point measured from the centre of the viewing area. */
export function zoomImageAt(view, targetScale, point = { x: 0, y: 0 }) {
  const scale = clamp(targetScale, view.minScale, view.maxScale);
  const ratio = scale / view.scale;
  return { ...view, scale, x: point.x - (point.x - view.x) * ratio, y: point.y - (point.y - view.y) * ratio };
}

export function fitImage(width, height, boxWidth, boxHeight) {
  if (![width, height, boxWidth, boxHeight].every(value => Number.isFinite(value) && value > 0)) return null;
  return Math.max(MIN_ZOOM, Math.min(1, boxWidth / width, boxHeight / height));
}

/**
 * Open the original image in a modal. No uploads or derivative files are created.
 * `trigger` receives focus on close; sourceURL is optional, never inferred.
 */
export function openAtlasImageViewer({ src, alt = '', title = 'Bild ansehen', sourceLabel = '', sourceURL = '', trigger = document.activeElement } = {}) {
  if (typeof src !== 'string' || !src.trim()) throw new TypeError('Eine Bildquelle ist erforderlich.');
  const previous = document.querySelector('.atlas-image-viewer');
  if (previous) previous.close();

  const dialog = document.createElement('dialog');
  dialog.className = 'atlas-image-viewer';
  const displayTitle = humanImageText(title, 'Bild ansehen');
  dialog.setAttribute('aria-label', displayTitle);
  dialog.innerHTML = `<div class="aiv-shell"><header class="aiv-header"><div class="aiv-heading"><h2></h2><p class="aiv-source" hidden></p></div><button type="button" class="aiv-close" aria-label="Bildansicht schließen">Schließen <span aria-hidden="true">×</span></button></header><div class="aiv-stage" tabindex="0" aria-label="Bildbereich. Mit den Pfeiltasten verschieben."><img draggable="false"><p class="aiv-message" role="status">Bild wird geladen …</p></div><footer class="aiv-footer"><div class="aiv-controls" aria-label="Bildansicht steuern"><button type="button" data-action="out" aria-label="Verkleinern">−</button><span class="aiv-scale" aria-live="polite">–</span><button type="button" data-action="in" aria-label="Vergrößern">+</button><button type="button" data-action="reset">Einpassen</button></div><p class="aiv-hint">Ziehen zum Verschieben · Mausrad oder zwei Finger zum Vergrößern</p></footer></div>`;
  const $ = selector => dialog.querySelector(selector);
  const heading = $('h2'), image = $('img'), stage = $('.aiv-stage'), message = $('.aiv-message'), scaleLabel = $('.aiv-scale');
  heading.textContent = displayTitle;
  image.alt = humanImageText(alt);
  image.src = src;
  if (sourceLabel || sourceURL) {
    const source = $('.aiv-source');
    let url;
    try { url = new URL(sourceURL, document.baseURI); } catch { /* optional */ }
    const label = humanImageText(sourceLabel, 'Originalquelle öffnen');
    if (sourceURL && url && ['http:', 'https:'].includes(url.protocol)) {
      source.hidden = false;
      const link = document.createElement('a');
      link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = label;
      source.append(link);
    } else if (sourceLabel) { source.hidden = false; source.textContent = label; }
  }
  document.body.append(dialog);
  let view = null;
  const pointers = new Map();
  let gesture = null;
  const paint = () => {
    if (!view) return;
    image.style.transform = `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
    scaleLabel.textContent = `${Math.round(view.scale * 100)} %`;
  };
  const reset = () => {
    const fit = fitImage(image.naturalWidth, image.naturalHeight, stage.clientWidth - 24, stage.clientHeight - 24);
    if (!fit) return;
    view = { scale: fit, minScale: fit, maxScale: Math.max(4, fit), x: 0, y: 0 };
    image.style.width = `${image.naturalWidth}px`;
    message.hidden = true;
    paint();
  };
  const pointInStage = (x, y) => {
    const rect = stage.getBoundingClientRect();
    return { x: x - rect.left - rect.width / 2, y: y - rect.top - rect.height / 2 };
  };
  const zoom = (factor, point) => { if (view) { view = zoomImageAt(view, view.scale * factor, point); paint(); } };
  image.addEventListener('load', reset);
  image.addEventListener('error', () => { message.hidden = false; message.textContent = 'Das Bild konnte nicht geladen werden.'; });
  $('.aiv-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-action="in"]').addEventListener('click', () => zoom(1.25));
  dialog.querySelector('[data-action="out"]').addEventListener('click', () => zoom(1 / 1.25));
  dialog.querySelector('[data-action="reset"]').addEventListener('click', reset);
  stage.addEventListener('wheel', event => { if (!view) return; event.preventDefault(); zoom(Math.exp(-event.deltaY * 0.0015), pointInStage(event.clientX, event.clientY)); }, { passive: false });
  const startGesture = () => {
    const points = [...pointers.values()];
    if (!view || !points.length) { gesture = null; return; }
    if (points.length === 1) gesture = { x: points[0].x, y: points[0].y, view: { ...view } };
    else {
      const [a, b] = points;
      gesture = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), view: { ...view } };
    }
  };
  stage.addEventListener('pointerdown', event => {
    if (!view || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stage.setPointerCapture(event.pointerId); startGesture();
  });
  stage.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId) || !gesture) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const points = [...pointers.values()];
    if (points.length === 1) view = { ...gesture.view, x: gesture.view.x + points[0].x - gesture.x, y: gesture.view.y + points[0].y - gesture.y };
    else {
      const [a, b] = points, x = (a.x + b.x) / 2, y = (a.y + b.y) / 2;
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      view = zoomImageAt(gesture.view, gesture.view.scale * distance / gesture.distance, pointInStage(gesture.x, gesture.y));
      view.x += x - gesture.x; view.y += y - gesture.y;
    }
    paint();
  });
  const endPointer = event => { if (pointers.delete(event.pointerId)) startGesture(); };
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);
  stage.addEventListener('lostpointercapture', endPointer);
  dialog.addEventListener('keydown', event => {
    if (!view || event.altKey || event.ctrlKey || event.metaKey) return;
    const keys = { '+': () => zoom(1.25), '=': () => zoom(1.25), '-': () => zoom(1 / 1.25), '0': reset,
      ArrowLeft: () => { view.x += 40; paint(); }, ArrowRight: () => { view.x -= 40; paint(); },
      ArrowUp: () => { view.y += 40; paint(); }, ArrowDown: () => { view.y -= 40; paint(); } };
    if (keys[event.key]) { event.preventDefault(); keys[event.key](); }
  });
  let observer;
  if (typeof ResizeObserver !== 'undefined') { observer = new ResizeObserver(() => { if (view) reset(); }); observer.observe(stage); }
  dialog.addEventListener('close', () => { observer?.disconnect(); dialog.remove(); if (trigger?.isConnected) trigger.focus(); }, { once: true });
  dialog.showModal();
  $('.aiv-close').focus();
  if (image.complete && image.naturalWidth) reset();
  return { close: () => dialog.close(), dialog };
}
