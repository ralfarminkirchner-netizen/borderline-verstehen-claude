/* Interaction follows the existing Phänomenatlas atlas-space and WiRKGEFÜGE:
   one relation field, selected surroundings, stable camera and source return.
   Coordinates below are thematic layout, never evidence or similarity scores. */
const SVG = 'http://www.w3.org/2000/svg';
const WORLD = { width: 2000, height: 1280 };
const GROUP_LAYOUT = [
  { x: 340, y: 220, columns: 3 },
  { x: 1000, y: 220, columns: 3 },
  { x: 1660, y: 220, columns: 3 },
  { x: 650, y: 800, columns: 3 },
  { x: 1410, y: 800, columns: 2 }
];
let instanceSequence = 0;
const clamp = (n, low, high) => Math.max(low, Math.min(high, n));

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function svgElement(tag, attrs = {}) {
  const element = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) element.setAttribute(key, String(value));
  return element;
}

function positionsForGroups(nodes) {
  const groups = [...new Set(nodes.map(node => node.group || 'Zusammenhänge'))];
  const positions = new Map();
  const headings = [];
  groups.forEach((group, groupIndex) => {
    const members = nodes.filter(node => (node.group || 'Zusammenhänge') === group);
    const layout = GROUP_LAYOUT[groupIndex] || { x: WORLD.width / 2, y: 800 + groupIndex * 190, columns: 3 };
    headings.push({ group, index: groupIndex, x: layout.x, y: layout.y - 140 });
    members.forEach((node, index) => {
      const row = Math.floor(index / layout.columns);
      const rowSize = Math.min(layout.columns, members.length - row * layout.columns);
      // 180×130px labels have at least 40px horizontal / 60px vertical air.
      positions.set(node.id, { x: layout.x + (index % layout.columns - (rowSize - 1) / 2) * 220, y: layout.y + row * 190, groupIndex });
    });
  });
  return { positions, headings };
}

/** Mount a local SVG relation field. All visible names come from content titles.
 * Nodes and edges are supplied by the source-bound editorial model.
 * onSelect(node), onEdgeSelect(edge) receive the original objects unchanged.
 */
export function mountAtlasSpace({ container, nodes = [], edges = [], onSelect, onEdgeSelect }) {
  if (!container) throw new TypeError('Eine Atlasfläche wird benötigt.');
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const relations = edges.filter(edge => nodeById.has(edge.from) && nodeById.has(edge.to));
  const { positions, headings } = positionsForGroups(nodes);
  const root = makeElement('div', 'atlas-space');
  const stage = makeElement('div', 'atlas-space-stage');
  stage.tabIndex = 0;
  stage.setAttribute('role', 'region');
  stage.setAttribute('aria-label', 'Beziehungskarte. Mit Pfeiltasten verschieben, mit Plus und Minus zoomen. Begriffe mit Tab erreichen.');
  // clip prevents native focus scrolling from creating a second, hidden camera.
  Object.assign(stage.style, { position: 'relative', overflow: 'clip', touchAction: 'none', minHeight: '520px' });
  const world = makeElement('div', 'atlas-space-world');
  Object.assign(world.style, { position: 'absolute', width: `${WORLD.width}px`, height: `${WORLD.height}px`, transformOrigin: '0 0' });
  const svg = svgElement('svg', { class: 'atlas-space-edges', width: WORLD.width, height: WORLD.height, viewBox: `0 0 ${WORLD.width} ${WORLD.height}`, 'aria-label': 'Benannte Beziehungen zwischen den Begriffen' });
  Object.assign(svg.style, { position: 'absolute', inset: '0', overflow: 'visible' });
  world.append(svg);
  const nodeElements = new Map();
  const edgeElements = [];
  let selectedId = null;
  let activeEdge = null;
  let hoveredEdge = null;
  let focusedEdge = null;
  let lensTest = () => true;
  let camera = { x: 0, y: 0, zoom: 1 };
  let disposed = false;
  let initialized = false;
  let suppressClick = false;
  let keyboardNavigation = false;
  let width = 1, height = 1;
  const cleanup = [];
  const listen = (element, type, fn, options) => { element.addEventListener(type, fn, options); cleanup.push(() => element.removeEventListener(type, fn, options)); };

  function announce(message) { status.textContent = message; }
  function transform() {
    world.style.transform = `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`;
    root.style.setProperty('--atlas-scale', camera.zoom);
  }
  function revealKeyboardFocus(element, position) {
    if (!keyboardNavigation) return;
    const bounds = stage.getBoundingClientRect();
    const target = element.getBoundingClientRect();
    const inset = 20;
    if (target.left >= bounds.left + inset && target.right <= bounds.right - inset && target.top >= bounds.top + inset && target.bottom <= bounds.bottom - inset) return;
    // Keep the chosen reading scale. A long relation may extend beyond the
    // viewport; its midpoint is the meaningful focus location in that case.
    camera.x = width / 2 - position.x * camera.zoom;
    camera.y = height / 2 - position.y * camera.zoom;
    transform();
  }
  listen(globalThis, 'keydown', event => { if (event.key === 'Tab') keyboardNavigation = true; }, true);
  listen(globalThis, 'pointerdown', () => { keyboardNavigation = false; }, true);
  function fit() {
    camera.zoom = clamp(Math.min((width - 42) / WORLD.width, (height - 42) / WORLD.height), .2, 1.2);
    camera.x = (width - WORLD.width * camera.zoom) / 2;
    camera.y = (height - WORLD.height * camera.zoom) / 2;
    transform();
  }
  function zoomAt(factor, x = width / 2, y = height / 2) {
    const next = clamp(camera.zoom * factor, .2, 2.7);
    const ratio = next / camera.zoom;
    camera.x = x - (x - camera.x) * ratio;
    camera.y = y - (y - camera.y) * ratio;
    camera.zoom = next;
    transform();
  }
  function paintSelection() {
    const neighbors = new Set();
    for (const edge of relations) {
      if (edge.from === selectedId) neighbors.add(edge.to);
      if (edge.to === selectedId) neighbors.add(edge.from);
    }
    for (const node of nodes) {
      const button = nodeElements.get(node.id);
      const selected = node.id === selectedId;
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-neighbor', neighbors.has(node.id));
      button.classList.toggle('is-muted', !lensTest(node));
      button.setAttribute('aria-pressed', String(selected));
    }
    for (const { edge, element, label } of edgeElements) {
      const hot = edge.from === selectedId || edge.to === selectedId;
      element.classList.toggle('is-selected', hot);
      element.classList.toggle('is-active', edge === activeEdge);
      element.classList.toggle('is-muted', !lensTest(nodeById.get(edge.from)) && !lensTest(nodeById.get(edge.to)));
      label.style.display = edge === (hoveredEdge || focusedEdge || activeEdge) ? '' : 'none';
    }
  }
  function choose(id, emit = true) {
    const node = nodeById.get(id);
    if (!node) return;
    selectedId = id;
    activeEdge = null;
    paintSelection();
    announce(`${node.title}. ${relations.filter(edge => edge.from === id || edge.to === id).length} benannte Beziehungen.`);
    if (emit) onSelect?.(node);
  }

  // Relations pass behind label clearances, rather than running through text.
  const maskId = `atlas-label-clearance-${++instanceSequence}`;
  const defs = svgElement('defs');
  const mask = svgElement('mask', { id: maskId, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: WORLD.width, height: WORLD.height });
  mask.append(svgElement('rect', { x: 0, y: 0, width: WORLD.width, height: WORLD.height, fill: 'white' }));
  const occupied = [...positions.values()].map(p => ({ x: p.x, y: p.y, width: 200, height: 150 }));
  occupied.push(...headings.map(p => ({ x: p.x, y: p.y, width: 580, height: 55 })));
  occupied.forEach(box => mask.append(svgElement('rect', { x: box.x - box.width / 2, y: box.y - box.height / 2, width: box.width, height: box.height, rx: 12, fill: 'black' })));
  defs.append(mask);
  svg.append(defs);
  function relationLabelPosition(a, b, cx, cy, title) {
    const dx = b.x - a.x, dy = b.y - a.y, length = Math.max(1, Math.hypot(dx, dy));
    const labelWidth = Math.min(700, String(title).length * 11 + 28);
    const clear = p => p.x - labelWidth / 2 > 15 && p.x + labelWidth / 2 < WORLD.width - 15 && p.y > 25 && p.y < WORLD.height - 25 && occupied.every(box => Math.abs(p.x - box.x) >= (labelWidth + box.width) / 2 || Math.abs(p.y - box.y) >= (44 + box.height) / 2);
    for (const t of [.5, .35, .65, .2, .8]) {
      const x = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * cx + t ** 2 * b.x;
      const y = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * cy + t ** 2 * b.y;
      for (const offset of [0, 55, -55, 110, -110, 180, -180, 270, -270]) {
        const p = { x: x - dy / length * offset, y: y + dx / length * offset };
        if (clear(p)) return p;
      }
    }
    // A quiet inter-group corridor remains available even for very long titles.
    return { x: WORLD.width / 2, y: 555 };
  }
  relations.forEach((edge, index) => {
    const a = positions.get(edge.from), b = positions.get(edge.to);
    const dx = b.x - a.x, dy = b.y - a.y;
    const length = Math.max(1, Math.hypot(dx, dy));
    const curve = index % 2 ? 18 : -18;
    const cx = (a.x + b.x) / 2 - dy / length * curve;
    const cy = (a.y + b.y) / 2 + dx / length * curve;
    const element = svgElement('g', { class: 'atlas-edge', 'data-kind': edge.kind || 'relation', tabindex: 0, role: 'button', 'aria-label': `${nodeById.get(edge.from).title}: ${edge.label || 'steht in Beziehung zu'} ${nodeById.get(edge.to).title}` });
    const pathData = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
    element.append(svgElement('path', { class: 'atlas-edge-hit', d: pathData, fill: 'none', stroke: 'transparent', 'stroke-width': 16, mask: `url(#${maskId})` }));
    element.append(svgElement('path', { class: 'atlas-edge-line', d: pathData, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5, mask: `url(#${maskId})` }));
    const labelPosition = relationLabelPosition(a, b, cx, cy, edge.label || 'Zusammenhang');
    const label = svgElement('text', { class: 'atlas-edge-label', x: labelPosition.x, y: labelPosition.y, 'text-anchor': 'middle' });
    label.textContent = edge.label || 'Zusammenhang';
    label.style.display = 'none';
    element.append(label);
    const activate = () => { if (!suppressClick) { activeEdge = edge; paintSelection(); onEdgeSelect?.(edge); } };
    listen(element, 'click', activate);
    listen(element, 'keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); activate(); } });
    listen(element, 'pointerenter', () => { hoveredEdge = edge; paintSelection(); });
    listen(element, 'pointerleave', () => { if (hoveredEdge === edge) hoveredEdge = null; paintSelection(); });
    listen(element, 'focus', () => { focusedEdge = edge; paintSelection(); revealKeyboardFocus(element, labelPosition); });
    listen(element, 'blur', () => { if (focusedEdge === edge) focusedEdge = null; paintSelection(); });
    svg.append(element);
    edgeElements.push({ edge, element, label });
  });

  for (const heading of headings) {
    const label = makeElement('div', 'atlas-group-label', heading.group);
    label.dataset.group = heading.group;
    label.style.setProperty('--atlas-group-index', heading.index);
    Object.assign(label.style, { position: 'absolute', left: `${heading.x}px`, top: `${heading.y}px`, transform: 'translate(-50%, -50%)', pointerEvents: 'none' });
    world.append(label);
  }
  nodes.forEach(node => {
    const p = positions.get(node.id);
    const button = makeElement('button', 'atlas-node');
    button.type = 'button';
    button.dataset.group = node.group || 'Zusammenhänge';
    button.dataset.kind = node.kind || 'phenomenon';
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', node.title);
    button.style.setProperty('--atlas-group-index', p.groupIndex);
    Object.assign(button.style, { position: 'absolute', left: `${p.x}px`, top: `${p.y}px`, width: '180px', transform: 'translate(-50%, -50%)' });
    const mark = makeElement('span', 'atlas-node-mark');
    mark.setAttribute('aria-hidden', 'true');
    button.append(mark, makeElement('span', 'atlas-node-title', node.title));
    listen(button, 'click', () => { if (!suppressClick) choose(node.id); });
    listen(button, 'focus', () => { button.classList.toggle('is-keyboard-focus', keyboardNavigation); revealKeyboardFocus(button, p); });
    listen(button, 'blur', () => { button.classList.remove('is-keyboard-focus'); });
    world.append(button);
    nodeElements.set(node.id, button);
  });

  stage.append(world);
  const controls = makeElement('div', 'atlas-space-controls');
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', 'Kartenausschnitt');
  for (const [title, text, action] of [
    ['Ansicht verkleinern', '−', () => zoomAt(1 / 1.25)],
    ['Ansicht vergrößern', '+', () => zoomAt(1.25)],
    ['Alle Zusammenhänge zeigen', 'Überblick', fit]
  ]) {
    const button = makeElement('button', '', text);
    button.type = 'button';
    button.setAttribute('aria-label', title);
    listen(button, 'click', action);
    controls.append(button);
  }
  const status = makeElement('span', 'atlas-space-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  // Kept accessible without requiring the host's stylesheet to implement .sr-only.
  Object.assign(status.style, { position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clipPath: 'inset(50%)' });
  const caption = makeElement('p', 'atlas-space-caption', 'Die Anordnung bündelt Themen. Nur benannte Linien zeigen einen erläuterten Zusammenhang; Nähe bedeutet keine Ursache. Ziehen verschiebt den Ausschnitt. Strg/⌘ und Mausrad zoomen.');
  root.append(stage, controls, caption, status);
  container.replaceChildren(root);

  const pointers = new Map();
  let drag = null, pinch = null;
  const point = event => { const rect = stage.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; };
  listen(stage, 'pointerdown', event => {
    if (event.button !== 0 && event.pointerType !== 'touch') return;
    const p = point(event);
    pointers.set(event.pointerId, p);
    drag = { id: event.pointerId, start: p, previous: p, moved: false };
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinch = { distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)), zoom: camera.zoom };
      drag = null;
      suppressClick = true;
    }
    // Capture background drags immediately; node clicks retain their native target.
    if (!event.target.closest('button,[role="button"]')) stage.setPointerCapture?.(event.pointerId);
  });
  listen(stage, 'pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    const p = point(event);
    pointers.set(event.pointerId, p);
    if (pointers.size === 2 && pinch) {
      const [a, b] = [...pointers.values()];
      const target = pinch.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.distance;
      zoomAt(target / camera.zoom, (a.x + b.x) / 2, (a.y + b.y) / 2);
      return;
    }
    if (!drag || drag.id !== event.pointerId) return;
    if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) > 5) {
      drag.moved = true;
      suppressClick = true;
      stage.classList.add('is-panning');
      stage.setPointerCapture?.(event.pointerId);
    }
    if (drag.moved) {
      camera.x += p.x - drag.previous.x;
      camera.y += p.y - drag.previous.y;
      transform();
    }
    drag.previous = p;
  });
  const pointerUp = event => {
    pointers.delete(event.pointerId);
    pinch = null;
    if (drag?.id === event.pointerId) drag = null;
    stage.classList.remove('is-panning');
    if (stage.hasPointerCapture?.(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    setTimeout(() => { suppressClick = false; }, 0);
  };
  listen(stage, 'pointerup', pointerUp);
  listen(stage, 'pointercancel', pointerUp);
  listen(stage, 'wheel', event => {
    // Ordinary wheel/trackpad scrolling belongs to the surrounding page.
    // Ctrl also covers the browser's trackpad pinch gesture.
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const p = point(event);
    zoomAt(Math.exp(-event.deltaY * .0013), p.x, p.y);
  }, { passive: false });
  listen(stage, 'keydown', event => {
    if (event.target !== stage) return;
    const step = event.shiftKey ? 120 : 55;
    const actions = {
      ArrowLeft: () => { camera.x += step; transform(); },
      ArrowRight: () => { camera.x -= step; transform(); },
      ArrowUp: () => { camera.y += step; transform(); },
      ArrowDown: () => { camera.y -= step; transform(); },
      '+': () => zoomAt(1.25), '=': () => zoomAt(1.25), '-': () => zoomAt(1 / 1.25), '0': fit, Home: fit
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  });
  function resize() {
    if (disposed) return;
    const rect = stage.getBoundingClientRect();
    const previousWidth = width, previousHeight = height;
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    if (!initialized && width > 1) { initialized = true; fit(); }
    else if (initialized) { camera.x += (width - previousWidth) / 2; camera.y += (height - previousHeight) / 2; transform(); }
  }
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(stage);
  listen(globalThis, 'resize', resize);
  resize();
  return {
    select(id) {
      const initial = selectedId === null;
      choose(id, false);
      if (initial && positions.has(id)) {
        const p = positions.get(id);
        camera.zoom = .85;
        camera.x = width / 2 - p.x * camera.zoom;
        camera.y = height / 2 - p.y * camera.zoom;
        transform();
      }
    },
    setLens(lens) {
      if (typeof lens === 'function') lensTest = lens;
      else if (Array.isArray(lens) || lens instanceof Set) {
        const values = new Set(lens);
        lensTest = node => values.has(node.id) || values.has(node.group) || values.has(node.kind);
      } else if (lens && typeof lens === 'object') {
        const ids = new Set(lens.ids || lens.nodeIds || []), groups = new Set(lens.groups || []), kinds = new Set(lens.kinds || []);
        lensTest = node => (!ids.size && !groups.size && !kinds.size) || ids.has(node.id) || groups.has(node.group) || kinds.has(node.kind);
      } else {
        const hasMatch = nodes.some(node => node.group === lens || node.kind === lens);
        lensTest = node => !hasMatch || node.group === lens || node.kind === lens;
      }
      paintSelection();
    },
    focus(id, { zoom } = {}) {
      const p = positions.get(id);
      if (!p) return;
      camera.zoom = zoom === undefined ? Math.max(.85, camera.zoom) : clamp(zoom, .2, 2.7);
      camera.x = width / 2 - p.x * camera.zoom;
      camera.y = height / 2 - p.y * camera.zoom;
      transform();
      choose(id, false);
    },
    fitNeighborhood(id, { minZoom = .75, maxZoom = 1.15 } = {}) {
      const p = positions.get(id);
      if (!p) return;
      const ids = new Set([id]);
      for (const edge of relations) {
        if (edge.from === id) ids.add(edge.to);
        if (edge.to === id) ids.add(edge.from);
      }
      const points = [...ids].map(key => positions.get(key));
      const x0 = Math.min(...points.map(point => point.x)) - 140;
      const x1 = Math.max(...points.map(point => point.x)) + 140;
      const y0 = Math.min(...points.map(point => point.y)) - 80;
      const y1 = Math.max(...points.map(point => point.y)) + 80;
      const fitted = Math.min((width - 40) / (x1 - x0), (height - 40) / (y1 - y0));
      camera.zoom = clamp(fitted, minZoom, maxZoom);
      // When a whole neighborhood cannot fit legibly, anchor its selected term.
      const center = fitted < minZoom ? p : { x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
      camera.x = width / 2 - center.x * camera.zoom;
      camera.y = height / 2 - center.y * camera.zoom;
      transform();
      choose(id, false);
    },
    destroy() { disposed = true; observer?.disconnect(); cleanup.forEach(fn => fn()); root.remove(); }
  };
}
