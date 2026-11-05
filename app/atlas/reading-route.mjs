const LIMIT = 40;
const copy = point => point ? { ...point } : null;

function normalizePoint(value, fallback) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (typeof value.id !== 'string' || !value.id.trim()) return null;
  const id = value.id.trim();
  const previous = fallback?.id === id ? fallback : null;
  const offset = value.offset === undefined ? previous?.offset ?? 0 : value.offset;
  const perspective = value.perspective === undefined ? previous?.perspective : value.perspective;
  return {
    id,
    offset: Number.isFinite(offset) && offset >= 0 ? offset : 0,
    perspective: typeof perspective === 'string' && perspective.trim() ? perspective : 'all',
  };
}

function normalizeStack(value, current) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const candidate of value.slice(-LIMIT)) {
    const point = normalizePoint(candidate);
    if (!point) continue;
    if (result.at(-1)?.id === point.id) result[result.length - 1] = point;
    else result.push(point);
  }
  while (result.at(-1)?.id === current?.id && result.length) result.pop();
  return result;
}

/** A bounded reading path. Storage, rendering and source access belong to its caller. */
export function createReadingRoute(seed) {
  const imported = seed && typeof seed === 'object' && !Array.isArray(seed) ? seed : {};
  let current = normalizePoint(imported.current);
  let anchor = normalizePoint(imported.anchor) || copy(current);
  let trail = current ? normalizeStack(imported.trail, current) : [];
  let future = current ? normalizeStack(imported.future, current) : [];
  if (!current && anchor) current = copy(anchor);

  function push(stack, point) {
    stack.push(copy(point));
    if (stack.length > LIMIT) stack.shift();
  }

  return {
    get canBack() { return trail.length > 0; },
    get canForward() { return future.length > 0; },
    visit(value) {
      const point = normalizePoint(value, current);
      if (!point) return copy(current);
      if (!anchor) anchor = copy(point);
      if (current && current.id !== point.id) {
        push(trail, current);
        future = [];
      }
      current = point;
      return copy(current);
    },
    update(value) {
      const point = normalizePoint(value, current);
      if (point && current?.id === point.id) current = point;
      return copy(current);
    },
    back() {
      if (!trail.length) return copy(current);
      push(future, current);
      current = trail.pop();
      return copy(current);
    },
    forward() {
      if (!future.length) return copy(current);
      push(trail, current);
      current = future.pop();
      return copy(current);
    },
    snapshot() {
      return { anchor: copy(anchor), current: copy(current), trail: trail.map(copy), future: future.map(copy) };
    },
  };
}
