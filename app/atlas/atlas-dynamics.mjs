// Authored learning scenes. Their sequence is an editorial reading path, never a causal model.
const NICE_BPD = 'https://www.nice.org.uk/guidance/cg78/chapter/Recommendations';
const NICE_AUTISM = 'https://www.nice.org.uk/guidance/cg142/chapter/Recommendations';
export const dynamicsScenarios = [
  {
    id: 'overload', title: 'Wenn alles gleichzeitig kommt', short: 'Reize und Überlastung',
    before: 'Im Café laufen Musik und Gespräche. Das Licht ist grell. Robin verliert den Gesprächsfaden und sagt: „Es wird mir zu viel.“',
    unknown: 'Wir kennen Robins Wahrnehmung und Belastungsgrenze nur aus der Äußerung. Daraus folgt keine Diagnose.',
    hypothesis: 'Lärm, Licht oder die Gleichzeitigkeit könnten gerade eine Rolle spielen. Robin selbst kann sagen, welche Änderung einen Versuch wert ist.',
    action: 'Robin wählt: „Können wir an einen ruhigeren Platz gehen?“ Die andere Person fragt nach, statt die passende Reizstärke festzulegen.',
    after: 'Im Lernbeispiel wird ein ruhigerer Platz vereinbart. Ob Robin dort besser folgen kann, bleibt zu beobachten. Die Veränderung ist ein Versuch.',
    focus: ['dossier:phenomenon:bpd:bps-ph-061', 'neuro:light-sensitivity'],
    resources: ['resource:geraeusche-dosieren', 'resource:licht-passend-machen', 'resource:rueckzugsplatz'],
    media: ['sgw-stress-video'],
    source: { title: 'NICE · Autismus bei Erwachsenen, Umgebung und sensorische Bedürfnisse', url: NICE_AUTISM, text: 'Die Leitlinie empfiehlt, sensorische Bedürfnisse und die konkrete Umgebung in der Versorgung autistischer Erwachsener zu berücksichtigen. Das belegt weder eine Diagnose für Robin noch den Erfolg dieser Szene.' },
    factors: [{ id: 'sleep', label: 'Zusätzlich wenig geschlafen', entryIds: ['verified-section:wave2-sleep-emotion'], text: 'Im veränderten Beispiel berichtet Robin zusätzlich wenig Schlaf. Ein Kontext zum Nachfragen, keine berechnete Ursache.' }, { id: 'choice', label: 'Ein ruhiger Ort ist erreichbar', entryIds: ['resource:rueckzugsplatz'], text: 'Ein erreichbarer Rückzugsort erweitert hier die praktische Auswahl. Robin entscheidet, ob er passt.' }],
  },
  {
    id: 'ambiguity', title: 'Eine Nachricht – mehrere Bedeutungen', short: 'Mehrdeutigkeit und Nähe',
    before: 'Mira fragt nach dem gemeinsamen Abend. Vier Stunden kommt keine Antwort. Sie bemerkt Anspannung und denkt: „Ich bin unwichtig.“',
    unknown: 'Die Nachricht und die fehlende Antwort sind beobachtbar. Alex’ Absicht und Miras Wert sind dadurch nicht erklärt.',
    hypothesis: 'Vielleicht ist Alex beschäftigt, vielleicht ist der Abend unklar, vielleicht ist gerade etwas schwierig. Die andere Innenwelt bleibt offen.',
    action: 'Mira trennt Beobachtung und Bedeutung: „Ich habe noch keine Antwort und bin unsicher. Kannst du mir bis 18 Uhr sagen, ob unser Abend stattfindet?“',
    after: 'Im Lernbeispiel steht nun eine konkrete Bitte im Raum. Eine Antwort und ein besseres Gefühl sind damit nicht garantiert. Mira plant eine eigene Alternative für den Abend.',
    focus: ['scene:nachricht', 'dynamics:mbt'], resources: ['resource:bedeutung-nachfragen', 'resource:konkrete-kontaktanfrage', 'relationship:autonomie'], media: ['sgw-biopsychosocial-video'],
    source: { title: 'NICE · Borderline, offene Fragen und Perspektive der Person', url: NICE_BPD, text: 'NICE empfiehlt in der Krisenversorgung, die Sicht der Person zu verstehen, offen und empathisch zu fragen und Probleme vor Lösungsvorschlägen zu klären. Diese Alltagsszene ist eine redaktionelle Übertragung, keine untersuchte Intervention.' },
    factors: [{ id: 'agreement', label: 'Es gab eine feste Verabredung', entryIds: ['relationship:autonomie'], text: 'Eine ausdrückliche Vereinbarung ist zusätzlich prüfbare Information. Enttäuschung darf sich auch auf die gegenwärtige Unzuverlässigkeit beziehen.' }, { id: 'stress', label: 'Mira berichtet hohen Druck', entryIds: ['verified-section:wave2-mentalizing-stress-limits'], text: 'Hoher Druck ist hier eine ergänzte Beobachtung im Beispiel. Was Alex denkt, wird dadurch nicht sicherer bekannt.' }],
  },
  {
    id: 'double-bind', title: '„Entscheide frei – aber enttäusche mich nicht“', short: 'Widersprüchliche Botschaften',
    before: 'Eine Person sagt: „Du entscheidest selbst. Wenn du heute nicht kommst, bin ich dir offenbar egal.“ Jo möchte zu Hause bleiben und wird still.',
    unknown: 'Der Wortlaut verknüpft freie Wahl mit einer negativen Beziehungsdeutung. Jos Schweigen belegt weder Zustimmung noch eine bestimmte Schutzreaktion.',
    hypothesis: 'Die beiden Botschaften können als widersprüchlich erlebt werden. „Double Bind“ dient hier als Arbeitsbegriff für die Szene; eine dauerhafte Beziehungsstruktur oder Erkrankungsursache ist nicht belegt.',
    action: 'Jo kann sagen: „Ich bleibe heute zu Hause. Dass ich nicht komme, sagt nichts über deinen Wert. Bitte lass mein Nein gelten.“ Die andere Person kann Enttäuschung benennen und auf die Gleichsetzung verzichten.',
    after: 'Im veränderten Lernbeispiel lautet die Antwort: „Ich bin enttäuscht, und deine Entscheidung gilt.“ Ob die Grenze anschließend respektiert wird, muss sich im Verhalten zeigen.',
    focus: ['relationship-original:naehe-druck', 'relationship:autonomie'], resources: ['resource:grenze-ein-satz', 'resource:beduerfnis-konkret-sagen', 'resource:gespraechspause-vereinbaren'], media: ['sgw-biopsychosocial-video'],
    source: { title: 'NICE · Borderline, ruhige Haltung und vollständige Klärung', url: NICE_BPD, text: 'Die Leitlinie stützt eine ruhige, nicht bedrohliche, validierende Klärung in der Krisenversorgung. Sie belegt keine Double-Bind-Ursache. Die Formulierungen und die Veränderung dieser Szene sind redaktionelle Lernbeispiele.' },
    factors: [{ id: 'repeat', label: 'Die Botschaft wiederholt sich', entryIds: ['relationship-original:eigene-grenze'], text: 'Wiederholung ist eine zusätzliche Beobachtung. Sie macht die Frage nach Unterstützung und einer tragbaren Grenze dringlicher, ohne eine Diagnose festzulegen.' }, { id: 'pause', label: 'Jo möchte eine Pause', entryIds: ['resource:gespraechspause-vereinbaren'], text: 'Eine Pause darf hier als eigener Wunsch vorkommen. Eine mögliche Wiederaufnahme braucht eine beidseitig passende Vereinbarung.' }],
  },
];
export function createScenarioState(entries = [], relations = [], media = []) {
  const byId = new Map(entries.map(entry => [entry.id, entry]));
  let scenarioId = dynamicsScenarios[0].id, stage = 'observe', factors = new Set();
  const listeners = new Set();
  const scenario = () => dynamicsScenarios.find(item => item.id === scenarioId);
  function read() {
    const scene = scenario();
    const anchorIds = [...scene.focus, ...(stage === 'change' ? scene.resources : []), ...scene.factors.filter(item => factors.has(item.id)).flatMap(item => item.entryIds)].filter(id => byId.has(id));
    // Expand only actual source relations, with a bounded number of neighbours.
    const anchorSet = new Set(anchorIds), selectedRelations = [], relationIndexes = [], used = new Set(anchorIds);
    for (const anchor of anchorIds) {
      const matches = relations.map((relation, index) => ({ relation, index })).filter(({ relation }) => (relation.from === anchor || relation.to === anchor) && byId.has(relation.from) && byId.has(relation.to));
      const preferred = [...matches.filter(({ relation }) => anchorSet.has(relation.from) && anchorSet.has(relation.to)), ...matches.filter(({ relation }) => !anchorSet.has(relation.from) || !anchorSet.has(relation.to))];
      for (const { relation, index } of preferred.slice(0, 1)) if (!relationIndexes.includes(index)) { selectedRelations.push(relation); relationIndexes.push(index); used.add(relation.from); used.add(relation.to); }
    }
    return { scenarioId, stage, factors: [...factors], scenario: scene, anchorIds: [...new Set(anchorIds)], entryIds: [...used], entries: [...used].map(id => byId.get(id)), relations: selectedRelations, relationIndexes, relationIds: selectedRelations.map((item, index) => item.id || `relation:${relationIndexes[index]}`), media: media.filter(item => scene.media.includes(item.id)), mediaIds: media.filter(item => scene.media.includes(item.id)).map(item => item.id) };
  }
  const emit = () => { const state = read(); for (const listener of listeners) listener(state); return state; };
  return { read, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }, select(id) { if (dynamicsScenarios.some(item => item.id === id)) { scenarioId = id; stage = 'observe'; factors = new Set(); } return emit(); }, setStage(value) { if (['observe', 'hypothesis', 'change'].includes(value)) stage = value; return emit(); }, toggleFactor(id) { if (scenario().factors.some(item => item.id === id)) factors.has(id) ? factors.delete(id) : factors.add(id); return emit(); }, reset() { stage = 'observe'; factors = new Set(); return emit(); } };
}
const el = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
const button = (text, action) => { const node = el('button', text); node.type = 'button'; node.addEventListener('click', action); return node; };
const stagePhase = { observe: 0, hypothesis: .5, change: 1 };
const stageWords = { observe: 'Ausgangslage', hypothesis: 'Deutungen öffnen', change: 'Eingriff · Ausgang offen' };
const blend = (a, b, t) => +(a + (b - a) * t).toFixed(2);
function sceneGeometry(id, phase) {
  const p = Math.max(0, Math.min(1, phase)), opening = Math.sin(p * Math.PI);
  const contours = Array.from({ length: 3 }, (_, i) => {
    const y = 185 + i * 27, lift = (id === 'overload' ? 70 : id === 'double-bind' ? -55 : 45) * p;
    return `M62 ${y} C210 ${y - 135 - opening * 45} 320 ${y + 115 + lift} 460 ${y - 18} C590 ${y - 110 - lift} 720 ${y + 80 - opening * 50} 850 ${y - 35} L850 ${y + 18} C710 ${y + 132 - opening * 30} 590 ${y - 70 - lift} 460 ${y + 26} C320 ${y + 155 + lift} 210 ${y - 88 - opening * 45} 62 ${y + 45} Z`;
  });
  const left = id === 'overload' ? blend(325, 670, p) : id === 'ambiguity' ? blend(235, 260, p) : blend(260, 220, p);
  const right = id === 'overload' ? blend(540, 810, p) : id === 'ambiguity' ? blend(665, 650, p) : blend(650, 710, p);
  return { contours, left, right, path: id === 'overload' ? `M${blend(605, 490, p)} ${blend(265, 245, p)} Q${blend(735, 630, p)} ${blend(305, 350, p)} 780 210` : id === 'ambiguity' ? `M282 205 C345 ${blend(110, 200, p)} 360 ${blend(285, 205, p)} 450 205 C540 ${blend(125, 205, p)} 555 ${blend(300, 205, p)} 618 205` : `M310 265 Q455 ${blend(230, 310, p)} 550 290 M452 249 Q${blend(475, 430, p)} ${blend(210, 180, p)} ${blend(493, 390, p)} 175` };
}
export function scenarioStageSvg(state, phase = stagePhase[state.stage]) {
  const changed = state.stage === 'change', interpreting = state.stage === 'hypothesis', geo = sceneGeometry(state.scenarioId, phase);
  const person = (x, y, name, side) => `<g transform="translate(${x} ${y})" class="ds-person" data-ds-person="${side}"><circle cy="-36" r="18"/><path d="M-32 37 Q-33-13 0-13 Q33-13 32 37 M-20 37 V79 M20 37 V79"/><text y="107">${name}</text></g>`;
  const foundation = `<g class="ds-sculpture" aria-hidden="true">${geo.contours.map((d, i) => `<path class="ds-fold ds-fold-${i}" fill="url(#ds-material-${state.scenarioId}-${i})" data-ds-fold="${i}" d="${d}"/>`).join('')}</g>`;
  let drawing;
  if (state.scenarioId === 'overload') {
    drawing = `<g class="ds-environment" opacity="${blend(.6, .08, phase)}">${Array.from({ length: 18 }, (_, i) => `<path d="M${55 + i * 42} ${45 + (i % 3) * 35} q8-15 16 0 t16 0"/>`).join('')}<path d="M120 16 L120 90 M720 16 L720 90 M103 38 L137 38 M703 38 L737 38"/></g><path class="ds-table" d="M300 265 H550 M340 265 L330 330 M510 265 L520 330"/><g class="ds-baseline" aria-hidden="true"><circle cx="325" cy="160" r="18"/><path d="M293 233 Q292 183 325 183 Q358 183 357 233"/></g>${person(geo.left, 196, 'Robin', 'left')}${person(geo.right, 196, 'Gegenüber', 'right')}<path class="ds-path ds-evolving" d="${geo.path}"/><circle class="ds-place" cx="780" cy="190" r="55"/><text class="ds-place-label" x="780" y="110">Ruhiger Ort</text><text class="ds-speech" x="435" y="390">${changed ? '„Wollen wir den Platz wechseln?“' : interpreting ? 'Licht? Klang? Gleichzeitigkeit?' : '„Es wird mir zu viel.“'}</text>`;
  } else if (state.scenarioId === 'ambiguity') {
    drawing = `${person(geo.left, 200, 'Mira', 'left')}${person(geo.right, 200, 'Alex', 'right')}<rect class="ds-phone" x="389" y="125" width="122" height="170" rx="15"/><path class="ds-message" d="M408 155 H489 V190 H435 L421 202 V190 H408Z"/><text class="ds-phone-label" x="450" y="234">${changed ? 'Konkrete Bitte' : 'Keine Antwort'}</text><text class="ds-clock" x="450" y="270">${changed ? 'bis 18 Uhr?' : '4 Stunden'}</text><path class="ds-gap ds-evolving" d="${geo.path}"/><text class="ds-speech" x="450" y="390">${changed ? '„Findet unser Abend statt?“' : interpreting ? 'Beschäftigt? Unklar? Etwas anderes?' : '„Bin ich unwichtig?“'}</text><text class="ds-open-label" x="665" y="100">Innenwelt offen</text>`;
  } else {
    drawing = `${person(geo.left, 210, 'Jo', 'left')}${person(geo.right, 210, 'Gegenüber', 'right')}<path class="ds-choice ds-evolving" d="${geo.path}"/><text class="ds-speech" x="450" y="70">${changed ? '„Ich bin enttäuscht. Deine Entscheidung gilt.“' : interpreting ? 'Wie passen diese Botschaften zusammen?' : '„Du entscheidest frei …“'}</text><text class="ds-tension" x="450" y="115">${changed ? 'Ein Nein darf stehen' : '„… aber enttäusche mich nicht.“'}</text><path class="ds-boundary" opacity="${blend(.15, 1, phase)}" d="M430 155 V345"/><text class="ds-open-label" x="450" y="390">${changed ? 'Ob die Grenze gilt, zeigt das weitere Verhalten.' : 'Widerspruch benennen · eigenen Wunsch bemerken'}</text>`;
  }
  const materials = ['#ef967d', '#e9c778', '#8ed2bd'].map((color, i) => `<linearGradient id="ds-material-${state.scenarioId}-${i}" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="${color}" stop-opacity=".85"/><stop offset=".48" stop-color="${color}" stop-opacity=".2"/><stop offset="1" stop-color="${color}" stop-opacity=".5"/></linearGradient>`).join('');
  return `<svg viewBox="0 0 900 420" role="img" aria-label="${state.scenarioId === 'overload' ? 'Redaktionelle Lernszene: Gespräch im Café und Bewegung zu einem möglichen ruhigeren Ort' : state.scenarioId === 'ambiguity' ? 'Redaktionelle Lernszene: Zwei Personen, offene Deutungen und eine konkrete Bitte' : 'Redaktionelle Lernszene: Zwei Personen zwischen freier Wahl und Beziehungserwartung'}"><defs>${materials}</defs>${foundation}<g>${drawing}</g></svg>`;
}
export function mountDynamics(host, { entries = [], relations = [], media = [], onHighlight, onOpenEntry, onOpenMedia } = {}) {
  const model = createScenarioState(entries, relations, media), byId = new Map(entries.map(item => [item.id, item]));
  host.classList.add('atlas-dynamics');
  let state = model.read(), phase = 0, frame = 0, runTimer = 0, playing = false, paused = false, globallyPaused = false, reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, quiet = false, tween = null, destroyed = false, scrubbing = false;
  host.append(el('p', 'Eine Situation verändern · Lernbeispiele', 'dynamics-eyebrow'));
  const choices = el('div', undefined, 'dynamics-choices');
  const stage = el('section', undefined, 'dynamics-stage');
  const title = el('h3'), steps = el('div', undefined, 'dynamics-steps');
  const drawing = el('div', undefined, 'dynamics-drawing');
  const stageNote = el('p', 'Die Bänder zeigen eine redaktionelle Lesespur. Ihre Form ist kein Messwert.', 'dynamics-metaphor');
  const transport = el('div', undefined, 'dynamics-transport');
  const play = button('Verlauf ansehen', () => { if (playing) { pause(); return; } playing = true; paused = false; updateTransport(); if (state.stage === 'change') model.reset(); advance(); });
  const pauseControl = button('Pause', () => { if (paused) resume(); else pause(); });
  const reset = button('Rückkehr', () => { stopPlayback(); model.reset(); });
  const scrub = el('input'); scrub.type = 'range'; scrub.min = '0'; scrub.max = '100'; scrub.value = '0'; scrub.setAttribute('aria-label', 'Szenenverlauf');
  const scrubLabel = el('label', undefined, 'dynamics-scrub'); scrubLabel.append(el('span', 'Ausgangslage'), scrub, el('span', 'Veränderter Schritt'));
  const currentLabel = el('span', '', 'dynamics-label'), currentText = el('p');
  const comparison = el('div', undefined, 'dynamics-comparison'), current = el('article', undefined, 'dynamics-moment dynamics-current');
  const outcome = el('details', undefined, 'dynamics-explanation'), outcomeTitle = el('summary'), outcomeText = el('p'); outcome.append(outcomeTitle, outcomeText);
  const baseline = el('details', undefined, 'dynamics-baseline'); baseline.append(el('summary', 'Ausgangslage zum Vergleich')); const baselineText = el('p'); baseline.append(baselineText);
  current.append(currentLabel, currentText, outcome); comparison.append(current, baseline);
  const factors = el('details', undefined, 'dynamics-factors'); factors.append(el('summary', 'Kontext ergänzen')); const factorControls = el('div'), factorNotes = el('div'); factors.append(factorControls, factorNotes);
  const map = el('details', undefined, 'dynamics-map'); map.append(el('summary', 'Diese Begriffe im Atlas erkunden')); const mapContent = el('div'); map.append(mapContent);
  const source = el('details', undefined, 'dynamics-source'); source.append(el('summary', 'Einordnung und fachlicher Bezug')); const sourceText = el('p'), sourceLink = el('a'), sourceBoundary = el('p', 'Die Szene und ihre Lesespur sind redaktionell. Das offene Ende sagt kein individuelles Ergebnis vorher.'); sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer'; source.append(sourceText, sourceLink, sourceBoundary);
  const status = el('span', '', 'dynamics-play-status'); status.setAttribute('role', 'status');
  transport.append(play, pauseControl, reset, status); stage.append(title, steps, drawing, stageNote, scrubLabel, transport, comparison, factors); host.append(choices, stage, map, source);
  for (const item of dynamicsScenarios) { const control = button(item.short, () => { stopPlayback(); model.select(item.id); }); control.dataset.scenario = item.id; choices.append(control); }
  for (const [id, label] of [['observe', 'Ausgangslage'], ['hypothesis', 'Verlauf'], ['change', 'Eingriff']]) { const control = button(label, () => { stopPlayback(); model.setStage(id); }); control.dataset.stage = id; steps.append(control); }
  function applyPhase(p) {
    phase = p; const geo = sceneGeometry(state.scenarioId, p), svg = drawing.querySelector('svg'); if (!svg) return;
    svg.querySelectorAll('[data-ds-fold]').forEach((path, index) => path.setAttribute('d', geo.contours[index]));
    const left = svg.querySelector('[data-ds-person="left"]'), right = svg.querySelector('[data-ds-person="right"]');
    const y = state.scenarioId === 'overload' ? 196 : state.scenarioId === 'ambiguity' ? 200 : 210;
    left?.setAttribute('transform', `translate(${geo.left} ${y})`); right?.setAttribute('transform', `translate(${geo.right} ${y})`);
    svg.querySelector('.ds-evolving')?.setAttribute('d', geo.path); svg.querySelector('.ds-environment')?.setAttribute('opacity', blend(.6, .08, p)); svg.querySelector('.ds-boundary')?.setAttribute('opacity', blend(.15, 1, p));
    scrub.value = String(Math.round(p * 100)); scrub.setAttribute('aria-valuetext', p < .25 ? stageWords.observe : p < .75 ? stageWords.hypothesis : stageWords.change);
  }
  function tick(now) {
    if (!tween || paused || globallyPaused || destroyed) return;
    if (!tween.started) tween.started = now - tween.elapsed;
    tween.elapsed = now - tween.started;
    const t = Math.min(1, tween.elapsed / 1200);
    // The shared on-screen curve: cubic-bezier(.77, 0, .175, 1).
    let lo = 0, hi = 1, u = t;
    for (let i = 0; i < 12; i++) { u = (lo + hi) / 2; const x = 3 * .77 * (1 - u) * (1 - u) * u + 3 * .175 * (1 - u) * u * u + u * u * u; if (x < t) lo = u; else hi = u; }
    const eased = 3 * (1 - u) * u * u + u * u * u;
    applyPhase(tween.from + (tween.to - tween.from) * eased);
    if (t < 1) frame = requestAnimationFrame(tick); else { applyPhase(tween.to); tween = null; frame = 0; updateTransport(); }
  }
  function travel(target) {
    cancelAnimationFrame(frame); tween = null;
    if (reduced || quiet || scrubbing || globallyPaused || Math.abs(target - phase) < .001) { applyPhase(target); return; }
    tween = { from: phase, to: target, started: 0, elapsed: 0 }; if (!paused && !globallyPaused) frame = requestAnimationFrame(tick);
  }
  function updateTransport() { play.textContent = playing ? 'Verlauf anhalten' : state.stage === 'change' ? 'Verlauf erneut ansehen' : 'Verlauf ansehen'; pauseControl.textContent = paused ? 'Fortsetzen' : 'Pause'; pauseControl.disabled = globallyPaused || (!paused && !tween && !playing); status.textContent = globallyPaused ? 'Bewegung im Atlas angehalten' : paused ? 'Angehalten · du kannst direkt weitergehen' : playing ? 'Freiwilliger Verlauf' : ''; host.classList.toggle('dynamics-paused', paused || globallyPaused); }
  function stopPlayback() { clearTimeout(runTimer); runTimer = 0; playing = false; paused = false; updateTransport(); }
  function pause() { clearTimeout(runTimer); cancelAnimationFrame(frame); paused = true; updateTransport(); }
  function resume() { if (globallyPaused) return; paused = false; if (tween) { tween.started = 0; frame = requestAnimationFrame(tick); } if (playing) advance(); updateTransport(); }
  function advance() { clearTimeout(runTimer); if (!playing || paused || globallyPaused) return; runTimer = setTimeout(() => { if (state.stage === 'observe') model.setStage('hypothesis'); else if (state.stage === 'hypothesis') model.setStage('change'); else { playing = false; updateTransport(); return; } advance(); }, 3400); }
  scrub.addEventListener('input', () => { const p = Number(scrub.value) / 100; stopPlayback(); cancelAnimationFrame(frame); tween = null; scrubbing = true; model.setStage(p < .25 ? 'observe' : p < .75 ? 'hypothesis' : 'change'); applyPhase(p); scrubbing = false; updateTransport(); });
  function render(next) {
    const newScene = state.scenarioId !== next.scenarioId || !drawing.firstChild; state = next; const scene = state.scenario;
    choices.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control.dataset.scenario === state.scenarioId)));
    steps.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control.dataset.stage === state.stage)));
    stage.setAttribute('aria-label', scene.title); title.textContent = scene.title;
    if (newScene) { phase = 0; drawing.className = `dynamics-drawing ds-${state.scenarioId}`; drawing.innerHTML = scenarioStageSvg(state, phase); }
    else { const template = document.createElement('template'); template.innerHTML = scenarioStageSvg(state, phase); const fresh = template.content.querySelectorAll('text'); drawing.querySelectorAll('text').forEach((node, index) => { node.textContent = fresh[index].textContent; }); }
    currentLabel.textContent = state.stage === 'observe' ? 'Ausgangsszene · erfunden' : state.stage === 'hypothesis' ? 'Mögliche Deutung · unbewiesen' : 'Veränderter Schritt · Ausgang offen';
    currentText.textContent = state.stage === 'observe' ? scene.before : state.stage === 'hypothesis' ? scene.hypothesis : scene.action;
    outcomeTitle.textContent = state.stage === 'change' ? 'Was danach offen bleibt' : 'Was wir wissen – und was offen bleibt'; outcomeText.textContent = state.stage === 'change' ? scene.after : scene.unknown; baselineText.textContent = scene.before;
    if (newScene) { factorControls.replaceChildren(); for (const factor of scene.factors) { const control = button(factor.label, () => { stopPlayback(); model.toggleFactor(factor.id); }); control.dataset.factor = factor.id; factorControls.append(control); } }
    factorControls.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(state.factors.includes(control.dataset.factor)))); factorNotes.replaceChildren(...scene.factors.filter(item => state.factors.includes(item.id)).map(item => el('p', item.text, 'dynamics-factor-note')));
    const nodes = el('div', undefined, 'dynamics-nodes'); for (const id of state.anchorIds) nodes.append(button(byId.get(id).title, () => onOpenEntry?.(id))); mapContent.replaceChildren(nodes);
    if (state.relations.length) { const details = el('details'); details.append(el('summary', 'Vorhandene Quellenverbindungen ansehen')); for (const relation of state.relations) { const row = el('div', undefined, 'dynamics-relation'); row.append(button(byId.get(relation.from).title, () => onOpenEntry?.(relation.from)), el('span', relation.label), button(byId.get(relation.to).title, () => onOpenEntry?.(relation.to))); if (relation.status) row.append(el('small', `Einordnung im Bestand: ${relation.status}`)); details.append(row); } details.append(el('p', 'Diese Verbindungen stammen aus dem bestehenden Atlas. Die Lesespur ergänzt keine wissenschaftliche Kante.')); mapContent.append(details); }
    if (state.media.length) { const mediaBox = el('div', undefined, 'dynamics-media'); for (const item of state.media) mediaBox.append(button(item.title, () => onOpenMedia?.(item))); mapContent.append(mediaBox); }
    sourceText.textContent = scene.source.text; sourceLink.textContent = scene.source.title; sourceLink.href = scene.source.url;
    if (!scrubbing) travel(stagePhase[state.stage]); updateTransport();
    onHighlight?.({ entryIds: state.entryIds, relationIds: state.relationIds, relationIndexes: state.relationIndexes, relations: state.relations, mediaIds: state.mediaIds, stage: state.stage, scenarioId: state.scenarioId });
  }
  const motion = event => { const setting = event.detail || {}; globallyPaused = !!setting.paused; reduced = !!setting.reduced || matchMedia('(prefers-reduced-motion: reduce)').matches; quiet = !!setting.quiet; if (globallyPaused) { clearTimeout(runTimer); cancelAnimationFrame(frame); } else if (reduced || quiet) { if (tween) { applyPhase(tween.to); tween = null; } if (playing && !paused) advance(); } else if (!paused) { if (tween) { tween.started = 0; frame = requestAnimationFrame(tick); } if (playing) advance(); } updateTransport(); };
  const visibility = () => { if (document.hidden) pause(); };
  window.addEventListener('atlas:motionchange', motion); document.addEventListener('visibilitychange', visibility);
  globallyPaused = document.documentElement.classList.contains('atlas-motion-paused'); quiet = document.documentElement.classList.contains('atlas-quiet'); reduced ||= document.documentElement.classList.contains('atlas-reduced');
  const stop = model.subscribe(render); render(state);
  return { model, destroy() { destroyed = true; clearTimeout(runTimer); cancelAnimationFrame(frame); stop(); window.removeEventListener('atlas:motionchange', motion); document.removeEventListener('visibilitychange', visibility); host.classList.remove('atlas-dynamics'); onHighlight?.({ entryIds: [], relationIds: [], relationIndexes: [], relations: [], mediaIds: [] }); host.replaceChildren(); } };
}
