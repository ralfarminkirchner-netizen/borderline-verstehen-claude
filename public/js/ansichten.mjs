// Blätter: Gebiet, Ort mit Fugenstern, Fugenstation, Leseraum und Legende.
import { A, geh, aufnehmen, meldung } from './main.mjs';
import { ARTEN, GELTUNG, LESEBEWEGUNGEN, LESEBEWEGUNGEN_HERKUNFT, fugenPfad, fugenArt, strich, zeichen } from './fugen.mjs';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ART_NAMEN = { phenomenon: 'Phänomen', source: 'Quelle', method: 'Methode', concept: 'Begriff', chapter: 'Kapitel', model: 'Modell', context: 'Kontext', exercise: 'Übung', perspective: 'Perspektive', finding: 'Befund', domain: 'Bereich', instrument: 'Instrument', practice: 'Praxis', dimension: 'Dimension', path: 'Lernweg', scene: 'Szene', research: 'Forschung', population: 'Gruppe', 'interactive-model': 'Modell' };
const artName = (k) => ART_NAMEN[k] || 'Eintrag';
const ort = (i) => A.daten.orte[i];
const anderer = (f, i) => (f.a === i ? f.b : f.a);
// Gleichnamige Orte aus verschiedenen Beständen erhalten einen menschlichen Unterscheider.
let doppelt = null;
export function nm(i) {
  if (!doppelt) { const c = new Map(); A.daten.orte.forEach((o) => c.set(o.t, (c.get(o.t) || 0) + 1)); doppelt = c; }
  const o = ort(i); if (doppelt.get(o.t) < 2) return o.t;
  const gleicheArt = A.daten.orte.filter((p) => p.t === o.t && p.k === o.k).length > 1;
  return `${o.t} · ${gleicheArt ? A.daten.regionen[o.r].name : artName(o.k)}`;
}
const sicherUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '');
const ORDNUNG = ['widerspruch', 'begrenzung', 'spannung', 'abstand', 'bedingung', 'aussage', 'zusammenhang', 'uebergang', 'gegenseitig', 'folge', 'annaeherung', 'offen', 'einordnung'];

function kicker(i) {
  const o = ort(i); const g = A.daten.regionen[o.r];
  return `<p class="kicker"><span class="punkt" style="background:${g.farbe}"></span>${esc(g.name)} · ${artName(o.k)}</p>`;
}

// ---------------- Gebiet ----------------
export function gebiet(el, r) {
  const g = A.daten.regionen[r];
  const orte = A.daten.orte.map((o, i) => [o, i]).filter(([o]) => o.r === r).sort((a, b) => b[0].n - a[0].n);
  const max = Math.max(...g.links.map((l) => l[1]), 1);
  const arten = {}; for (const [o] of orte) arten[o.k] = (arten[o.k] || 0) + 1;
  el.innerHTML = `
    <p class="kicker"><span class="punkt" style="background:${g.farbe}"></span>Gebiet</p>
    <h1 class="titel" tabindex="-1" data-erster-fokus>${esc(g.name)}</h1>
    <p class="lead">${esc(g.summary)}</p>
    <p class="klein">${g.count} Einträge: ${Object.entries(arten).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${n} ${artName(k)}`).join(', ')}.</p>
    <div class="abschnitt"><h3>Orte, an denen viel zusammenläuft</h3><div class="verwandt" id="g-orte"></div></div>
    <div class="abschnitt" id="g-medien" hidden><h3>Aufnahmen zu diesem Gebiet</h3><div class="medien-liste"></div>
      <p class="klein">Zuordnung redaktionell über das Thema der Aufnahme; im Bestand hängen diese Aufnahmen an keinem einzelnen Ort.</p></div>
    <div class="abschnitt"><h3>Nachbargebiete über Fugen im Bestand</h3><div class="gebiete-band" id="g-nach"></div>
      <p class="klein">Die Länge zeigt, wie viele Originalkanten beide Gebiete verbinden. Auf der Karte liegen stark verbundene Gebiete näher beieinander; das ist Anordnung, keine Messung von Verwandtschaft.</p></div>`;
  const orteEl = el.querySelector('#g-orte');
  for (const [o, i] of orte.slice(0, 14)) {
    const b = document.createElement('button'); b.type = 'button';
    b.innerHTML = `<b>${esc(o.t)}</b><br><span class="klein">${artName(o.k)} · ${o.n} Fugen</span>`;
    b.onclick = () => geh({ ebene: 'ort', ort: i }); orteEl.append(b);
  }
  // Audio und Video ohne Ortsbezug: thematisch dem Gebiet zugeordnet, als solche gekennzeichnet.
  const THEMA = [[/trauma|prolonged|cognitive processing/i, 'TraumaAtlas'], [/neurodivergenz|überlastung|autismus/i, 'Neuroatlas'], [/dyskalkulie|zahlen/i, 'Phänomenatlas'], [/adhs/i, 'ADHS · Randphänomene']];
  const aufnahmen = A.medien.filter((m) => !m.werk && /\.(m4a|mp3|mp4|webm)$/i.test(m.datei || m.extern || '') && THEMA.some(([re, name]) => name === g.name && re.test(m.titel)));
  if (aufnahmen.length) {
    const box = el.querySelector('#g-medien'); box.hidden = false;
    for (const m of aufnahmen) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'medium-zug'; b.style.marginBottom = '8px';
      b.innerHTML = `<span class="play"><svg viewBox="0 0 20 20" width="18" height="18"><path d="M6 4l10 6-10 6z" fill="#fbf8f2"/></svg></span><span><b>${esc(m.titel)}</b><small>${/\.(mp4|webm)$/i.test(m.datei || m.extern) ? 'Video' : 'Audio'} · ${esc(m.urheber)}${m.extern ? ' · externe Quelle' : ''}</small></span>`;
      const anker = orte[0]?.[1] ?? 0;
      b.onclick = () => A.spieler.spiele(m, anker); box.querySelector('.medien-liste').append(b);
    }
  }
  const nach = el.querySelector('#g-nach');
  for (const [j, n] of g.links.slice(0, 7)) {
    const h = A.daten.regionen[j]; const b = document.createElement('button'); b.type = 'button';
    b.innerHTML = `<span class="punkt" style="width:12px;height:12px;border-radius:50%;background:${h.farbe}"></span><span>${esc(h.name)}<span class="balken" style="display:block;width:${Math.max(6, n / max * 100)}%;background:${h.farbe}"></span></span><span class="klein">${n}</span>`;
    b.onclick = () => geh({ ebene: 'gebiet', gebiet: j }); nach.append(b);
  }
}

// ---------------- Ort ----------------
export function ort_(el, i) { return ortAnsicht(el, i); }
export { ortAnsicht as ort };

function ortAnsicht(el, i) {
  const o = ort(i);
  const fugen = A.adj[i].map((fi) => [fi, A.daten.fugen[fi]]);
  const proArt = {}; for (const [, f] of fugen) { const a = fugenArt(f); proArt[a] = (proArt[a] || 0) + 1; }
  const medien = A.medienZuOrt.get(i) || [];
  const werke = medien.filter((m) => m.werk); const aufnahmen = medien.filter((m) => !m.werk && (m.datei || m.extern) && /Audio|Video/i.test(`${m.format} ${m.datei}`.replace(/\.(m4a|mp3)/, ' Audio').replace(/\.(mp4|webm)/, ' Video')));
  el.innerHTML = `
    ${kicker(i)}
    <h1 class="titel" tabindex="-1" data-erster-fokus>${esc(nm(i))}</h1>
    <div class="stern-filter" role="group" aria-label="Fugenarten an diesem Ort" id="o-filter"></div>
    <div class="stern" id="o-stern"></div>
    <p class="lead" id="o-lead">${esc(o.s)}</p>
    <div class="taten">
      <button class="knopf voll" type="button" id="o-lesen">Ganzes Original lesen</button>
      <button class="knopf energie" type="button" id="o-tragen" aria-pressed="${A.hand.includes(i)}">${A.hand.includes(i) ? 'In der Hand' : 'Aufnehmen und tragen'}</button>
      <button class="knopf" type="button" id="o-eigen">Eigene Fuge hier beginnen</button>
    </div>
    <div id="o-medien"></div>
    <div id="o-eigene"></div>
    <div class="abschnitt" id="o-quellen" hidden><h3>Quellen dieses Ortes</h3><ul class="quellen"></ul></div>`;
  // Filter-Chips mit Zeichen der Fugenart
  const filter = el.querySelector('#o-filter'); const aktiv = new Set(ORDNUNG.filter((a) => a !== 'einordnung' && proArt[a]));
  if (!aktiv.size && proArt.einordnung) aktiv.add('einordnung');
  for (const a of ORDNUNG) {
    if (!proArt[a]) continue;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.setAttribute('aria-pressed', String(aktiv.has(a)));
    b.innerHTML = `${zeichen(a, 34, 14)}${ARTEN[a].name} <span class="n">${proArt[a]}</span>`;
    b.title = ARTEN[a].zeigt;
    b.onclick = () => { aktiv.has(a) ? aktiv.delete(a) : aktiv.add(a); b.setAttribute('aria-pressed', String(aktiv.has(a))); stern(el.querySelector('#o-stern'), i, fugen, aktiv); };
    filter.append(b);
  }
  if (!fugen.length) filter.innerHTML = '<p class="klein">Zu diesem Ort hält der Bestand keine Fuge fest.</p>';
  stern(el.querySelector('#o-stern'), i, fugen, aktiv);

  el.querySelector('#o-lesen').onclick = () => geh({ ebene: 'lesen', ort: i });
  el.querySelector('#o-tragen').onclick = (e) => { aufnehmen(i); e.currentTarget.setAttribute('aria-pressed', 'true'); e.currentTarget.textContent = 'In der Hand'; };
  el.querySelector('#o-eigen').onclick = () => geh({ ebene: 'werkbank', vorlage: { teile: [{ ort: i }], kontext: `Begonnen am Ort „${o.t}“` } });

  // Medien: Werke des Vaters ganz und ohne Text darüber; Aufnahmen über den gemeinsamen Spieler
  const med = el.querySelector('#o-medien');
  for (const w of werke.slice(0, 1)) {
    med.insertAdjacentHTML('beforeend', `<figure class="werk"><img src="${esc(w.datei)}" alt="${esc(w.alt)}" loading="lazy"><figcaption>${esc(w.herkunft)}${sicherUrl(w.quelle) ? ` <a href="${esc(w.quelle)}" target="_blank" rel="noopener noreferrer">Werk auf der Künstlerseite</a>` : ''}</figcaption></figure>`);
  }
  for (const m of aufnahmen) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'medium-zug';
    b.innerHTML = `<span class="play"><svg viewBox="0 0 20 20" width="18" height="18"><path d="M6 4l10 6-10 6z" fill="#fbf8f2"/></svg></span><span><b>${esc(m.titel)}</b><small>${esc(m.format || '')} · ${esc(m.urheber)}</small></span>`;
    b.onclick = () => A.spieler.spiele(m, i); med.append(b);
  }
  A.werkstatt.amOrt(el.querySelector('#o-eigene'), i);
  // Text und Quellen nachladen
  A.textePromise.then((t) => {
    if (A.zustand.ort !== i) return;
    const tx = t.orte[i]; const q = el.querySelector('#o-quellen');
    const ids = [...new Set([...(tx.quellen || []), ...fugen.flatMap(([, f]) => f.quellen || [])])].filter((id) => t.quellen[id]).slice(0, 8);
    if (ids.length) {
      q.hidden = false; q.querySelector('ul').innerHTML = ids.map((id) => quelleHtml(t.quellen[id])).join('');
    }
    const fund = t.fundus.find((f) => f.eintrag === i);
    const lang = (tx.body || '').length;
    el.querySelector('#o-lesen').textContent = fund ? 'Ganzes Kapitel lesen' : lang > 600 ? 'Ganzes Original lesen' : 'Original und Herkunft';
  });
}

function quelleHtml(q) {
  return `<li>${esc(q.titel)}${q.autoren ? ` <span class="klein">${esc(Array.isArray(q.autoren) ? q.autoren.join(', ') : q.autoren)}</span>` : ''}${q.jahr ? ` <span class="klein">(${esc(q.jahr)})</span>` : ''}${sicherUrl(q.url) ? `<a class="url" href="${esc(q.url)}" target="_blank" rel="noopener noreferrer">${esc(q.url.replace(/^https?:\/\//, '').slice(0, 80))}</a>` : ''}</li>`;
}

// Der Fugenstern: der Ort in der Mitte, jeder Nachbar genau einmal, nach seiner stärksten Fugenart in Sektoren.
function stern(host, i, fugen, aktiv) {
  const W = Math.max(300, Math.min(560, host.clientWidth || 480)); const schmal = W < 420;
  // Je Nachbar: alle Fugen zu ihm, die stärkste (erste in ORDNUNG) bestimmt Sektor und Form.
  const nach = new Map();
  for (const [fi, f] of fugen) {
    const a = fugenArt(f); if (!aktiv.has(a)) continue;
    const n = anderer(f, i); if (n === i) continue;
    if (!nach.has(n)) nach.set(n, []); nach.get(n).push({ fi, f, a });
  }
  for (const l of nach.values()) l.sort((x, y) => ORDNUNG.indexOf(x.a) - ORDNUNG.indexOf(y.a));
  const gruppen = ORDNUNG.map((a) => [a, [...nach].filter(([, l]) => l[0].a === a).sort((x, y) => ort(y[0]).n - ort(x[0]).n).slice(0, schmal ? 4 : 6)]).filter(([, l]) => l.length);
  const total = gruppen.reduce((s, [, l]) => s + l.length, 0);
  const H = Math.round(W * (total > 8 ? 0.8 : 0.7)); const cx = W / 2; const cy = H / 2;
  const R = Math.min(W * (schmal ? 0.3 : 0.27), H * 0.37);
  let ang = -Math.PI / 2 - Math.PI / Math.max(total, 1); const teile = [];
  const gap = gruppen.length > 1 ? 0.18 : 0; const verfuegbar = Math.PI * 2 - gap * gruppen.length;
  for (const [, l] of gruppen) {
    for (const [n, alle] of l) {
      ang += verfuegbar / total * 0.5;
      const rr = R * (0.84 + (teile.length % 2) * 0.16);
      teile.push({ n, alle, x: cx + Math.cos(ang) * rr, y: cy + Math.sin(ang) * rr, ang });
      ang += verfuegbar / total * 0.5;
    }
    ang += gap;
  }
  const g = A.daten.regionen[ort(i).r];
  const anim = (a) => (a === 'folge' ? 'schritt' : a === 'spannung' ? 'zittern' : '');
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="group" aria-label="Fugen von ${esc(nm(i))}">`;
  svg += `<circle cx="${cx}" cy="${cy}" r="${R * 1.06}" fill="none" stroke="#e3dacb" stroke-dasharray="2 5"/>`;
  for (const t of teile) {
    // mehrere Fugen zum selben Nachbarn: parallel versetzte Striche, jede einzeln anwählbar
    t.alle.forEach(({ fi, f, a }, k) => {
      const st = strich(f.geltung); const aus = f.a === i;
      const off = (k - (t.alle.length - 1) / 2) * 7; const nx = -Math.sin(t.ang) * off; const ny = Math.cos(t.ang) * off;
      const [x1, y1, x2, y2] = aus ? [cx + nx, cy + ny, t.x + nx, t.y + ny] : [t.x + nx, t.y + ny, cx + nx, cy + ny];
      const d = fugenPfad(a, x1 + (x2 - x1) * 0.1, y1 + (y2 - y1) * 0.1, x2 - (x2 - x1) * 0.1, y2 - (y2 - y1) * 0.1, 1.1);
      const label = `${ARTEN[a].name} zu ${nm(t.n)}: ${f.label}`;
      svg += `<g class="greif" tabindex="0" role="button" data-fuge="${fi}" aria-label="${esc(label)}"><path d="${d}" stroke="transparent" stroke-width="16" fill="none"/><path class="fp ${a === 'offen' ? 'offen' : ''} ${anim(a)}" d="${d}" stroke="${ARTEN[a].farbe}" stroke-width="${st.width + 0.6}" ${st.dash.length ? `stroke-dasharray="${st.dash.join(' ')}"` : ''}/></g>`;
    });
  }
  for (const t of teile) {
    const o = ort(t.n); const gg = A.daten.regionen[o.r];
    const c = Math.cos(t.ang); const mitte = Math.abs(c) < 0.3; const rechts = c >= 0; const oben = Math.sin(t.ang) < 0;
    const anchor = mitte ? 'middle' : rechts ? 'start' : 'end';
    const lx = t.x + (mitte ? 0 : rechts ? 9 : -9);
    const avail = mitte ? W * 0.55 : rechts ? W - lx - 4 : lx - 4;
    // Zeilenumbruch statt Abschneiden: höchstens zwei Zeilen, dann Auslassung
    const per = Math.max(7, Math.floor(avail / 6.8)); const worte = nm(t.n).split(' '); const zeilen = [''];
    for (const w of worte) { if ((`${zeilen.at(-1)} ${w}`).trim().length > per && zeilen.at(-1)) zeilen.push(''); zeilen[zeilen.length - 1] = `${zeilen.at(-1)} ${w}`.trim(); }
    if (zeilen.length > 2) { zeilen.length = 2; zeilen[1] = `${zeilen[1].slice(0, per - 1)}…`; }
    zeilen.forEach((z, k) => { if (z.length > per) zeilen[k] = `${z.slice(0, per - 1)}…`; });
    const y0 = mitte ? (oben ? t.y - 12 - (zeilen.length - 1) * 14 : t.y + 19) : t.y + 4 - (zeilen.length - 1) * 7;
    const mehr = t.alle.length > 1 ? ` <tspan class="mehrfach">· ${t.alle.length} Fugen</tspan>` : '';
    svg += `<g class="knoten" tabindex="0" role="link" data-ort="${t.n}" aria-label="Zu ${esc(nm(t.n))}"><circle class="r" cx="${t.x}" cy="${t.y}" r="11" fill="transparent"/><circle cx="${t.x}" cy="${t.y}" r="5.5" fill="${gg.farbe}" stroke="#fbf8f2" stroke-width="2"/><text text-anchor="${anchor}">${zeilen.map((z, k) => `<tspan x="${lx}" y="${y0 + k * 14}">${esc(z)}${k === zeilen.length - 1 ? mehr : ''}</tspan>`).join('')}</text></g>`;
  }
  svg += `<g class="mitte"><circle cx="${cx}" cy="${cy}" r="15" fill="${g.farbe}" stroke="#fbf8f2" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="22" fill="none" stroke="${g.farbe}" stroke-opacity=".35" stroke-width="1.5"/></g>`;
  const alleNach = new Set(fugen.filter(([, f]) => aktiv.has(fugenArt(f))).map(([, f]) => anderer(f, i)));
  const mehr = alleNach.size - teile.length;
  svg += '</svg>';
  host.innerHTML = svg + (mehr > 0 ? `<p class="klein" style="text-align:center;margin:0">${mehr} weitere Nachbarn dieser Arten liegen auf der Karte</p>` : '');
  host.querySelectorAll('[data-fuge]').forEach((n) => {
    const go = () => geh({ ebene: 'fuge', ort: i, fuge: Number(n.dataset.fuge) });
    n.addEventListener('click', go); n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    n.addEventListener('pointerenter', () => { A.karte.fugeSel = Number(n.dataset.fuge); A.karte.dirty = true; });
    n.addEventListener('pointerleave', () => { A.karte.fugeSel = null; A.karte.dirty = true; });
  });
  host.querySelectorAll('[data-ort]').forEach((n) => {
    const go = () => geh({ ebene: 'ort', ort: Number(n.dataset.ort) });
    n.addEventListener('click', go); n.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    n.addEventListener('pointerenter', () => { A.karte.hover = Number(n.dataset.ort); A.karte.dirty = true; });
    n.addEventListener('pointerleave', () => { A.karte.hover = null; A.karte.dirty = true; });
  });
}

// ---------------- Fugenstation ----------------
const satz = (f) => `<b>${esc(nm(f.a))}</b> <span class="rel">— ${esc(f.label)} —</span> <b>${esc(nm(f.b))}</b>`;

export function fuge(el, i, fi) {
  const f = A.daten.fugen[fi]; const art = fugenArt(f); const def = ARTEN[art];
  const gegen = f.gegen !== undefined ? A.daten.fugen[f.gegen] : null;
  const [a, b] = [f.a, f.b];
  const gleicherName = ort(a).t === ort(b).t;
  el.innerHTML = `
    <p class="kicker">${zeichen(art, 40, 14)} Fuge · ${esc(def.name)}</p>
    <h1 class="titel fugentitel" tabindex="-1" data-erster-fokus><span>${esc(nm(a))}</span> ${zeichen(art, 54, 20)} <span>${esc(nm(b))}</span></h1>
    ${gleicherName ? '<p class="klein" style="margin-top:-6px">Gleicher Begriff in zwei Beständen; die Fuge verbindet beide Fassungen.</p>' : ''}
    <div class="station" id="f-station"></div>
    <div class="bewegungen" role="group" aria-label="Lesebewegung" id="f-bew"></div>
    <p class="frage" id="f-frage" aria-live="polite"></p>
    <div class="linse" id="f-linse" aria-live="polite"></div>
    <div class="aussage">
      <span class="richtung" aria-label="Richtung">→</span><p class="satz">${satz(f)}</p>
      ${gegen ? `<span class="richtung" aria-label="Gegenrichtung">←</span><p class="satz">${satz(gegen)}</p>` : '<span class="richtung" aria-label="Gegenrichtung">←</span><p class="satz leer">Für die Gegenrichtung hält der Bestand keine eigene Aussage fest.</p>'}
    </div>
    <dl class="vermerk">
      <dt>Zeigt</dt><dd>${esc(def.zeigt)}</dd>
      <dt>Sagt nicht</dt><dd>${esc(def.nicht)}</dd>
      <dt>Grenze</dt><dd class="${f.grenze ? '' : 'leer'}">${esc(f.grenze || 'Im Bestand nicht angegeben. Das heißt nicht, dass es keine Grenze gibt.')}</dd>
      ${f.frage ? `<dt>Offene Frage</dt><dd>${esc(f.frage)}</dd>` : ''}
      ${f.kausal === false ? '<dt>Ursache</dt><dd>Im Bestand ausdrücklich nicht als Ursache gemeint.</dd>' : ''}
      <dt>Herkunft</dt><dd><span class="geltung ${f.geltung}"><i></i>${esc(GELTUNG[f.geltung].name)}</span> ${esc(GELTUNG[f.geltung].text)}<br><span class="klein">${esc(f.herkunft || 'Herkunft im Bestand nicht benannt')}. Art gelesen aus ${esc(f.grund)}.</span></dd>
      ${f.detail ? `<dt>Erläuterung</dt><dd class="serif">${esc(f.detail)}</dd>` : ''}
      <dt>Quellen</dt><dd><ul class="quellen" id="f-quellen"><li class="klein">wird geladen …</li></ul></dd>
    </dl>
    <div class="taten">
      <button class="knopf voll" type="button" id="f-eigen">Eigene Lesart festhalten</button>
      <button class="knopf energie" type="button" id="f-tragen">Beide aufnehmen</button>
      <button class="knopf" type="button" id="f-a">Zu ${esc(nm(a).slice(0, 30))}</button>
      <button class="knopf" type="button" id="f-b">Zu ${esc(nm(b).slice(0, 30))}</button>
    </div>
    <div class="abschnitt"><h3>Vergleich: andere Fugen dieser Art</h3><div class="verwandt" id="f-vergleich"></div></div>`;
  const st = el.querySelector('#f-station');
  let bewegung = 'neben';
  const linse = el.querySelector('#f-linse');
  const zeichne = () => { station(st, f, art, bewegung); linse.innerHTML = linsenInhalt(bewegung, f, gegen, def); verbinde(linse); };
  const verbinde = (box) => {
    box.querySelectorAll('[data-ort]').forEach((x) => x.addEventListener('click', () => geh({ ebene: 'ort', ort: Number(x.dataset.ort) })));
    box.querySelector('[data-dritte]')?.addEventListener('click', () => geh({ ebene: 'werkbank', vorlage: { teile: [{ ort: a }, { ort: b }], art: 'offen', kontext: `Dritte Stimme zur Fuge „${nm(a)} – ${nm(b)}“ gesucht` } }));
  };
  const bew = el.querySelector('#f-bew');
  for (const l of LESEBEWEGUNGEN) {
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = l.name; btn.setAttribute('aria-pressed', String(l.id === bewegung));
    btn.onclick = () => { bewegung = l.id; bew.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === btn))); el.querySelector('#f-frage').textContent = l.frage; zeichne(); };
    bew.append(btn);
  }
  el.querySelector('#f-frage').textContent = LESEBEWEGUNGEN[0].frage;
  zeichne();
  el.querySelector('#f-eigen').onclick = () => geh({ ebene: 'werkbank', vorlage: { teile: [{ ort: a }, { ort: b }], art: ['einordnung', 'aussage'].includes(art) ? 'offen' : art, lesebewegung: bewegung, kontext: `Aus der Fuge „${nm(a)} — ${f.label} — ${nm(b)}“` } });
  el.querySelector('#f-tragen').onclick = () => { aufnehmen(a); aufnehmen(b); };
  el.querySelector('#f-a').onclick = () => geh({ ebene: 'ort', ort: a });
  el.querySelector('#f-b').onclick = () => geh({ ebene: 'ort', ort: b });
  const ref = ort(i); const gleiche = [];
  A.daten.fugen.forEach((g, gi) => { if (gi !== fi && gi !== f.gegen && fugenArt(g) === art && ort(g.a).t !== ort(g.b).t) gleiche.push([gi, g, Math.hypot(ort(g.a).x - ref.x, ort(g.a).y - ref.y)]); });
  gleiche.sort((p, q) => p[2] - q[2]);
  const vg = el.querySelector('#f-vergleich');
  for (const [gi, g] of gleiche.slice(0, 6)) {
    const btn = document.createElement('button'); btn.type = 'button';
    btn.innerHTML = `${zeichen(art, 60, 16)}<b>${esc(nm(g.a))}</b> <span class="klein">${esc(g.label)}</span> <b>${esc(nm(g.b))}</b>`;
    btn.onclick = () => geh({ ebene: 'fuge', ort: g.a, fuge: gi }); vg.append(btn);
  }
  if (!gleiche.length) vg.innerHTML = '<p class="klein">Im Bestand gibt es keine weitere Fuge dieser Art.</p>';
  A.textePromise.then((t) => {
    const ids = [...new Set([...(f.quellen || []), ...(gegen?.quellen || [])])].filter((id) => t.quellen[id]);
    const ul = el.querySelector('#f-quellen'); if (!ul) return;
    ul.innerHTML = ids.length ? ids.slice(0, 10).map((id) => quelleHtml(t.quellen[id])).join('') : '<li class="klein">Diese Beziehung nennt keine eigene Quelle.</li>';
  });
}

// Jede Lesebewegung öffnet einen eigenen Ausschnitt aus dem Bestand – oder sagt, dass er fehlt.
function linsenInhalt(bew, f, gegen, def) {
  const oa = ort(f.a); const ob = ort(f.b);
  const nachbarn = (i) => new Set(A.adj[i].map((fi) => anderer(A.daten.fugen[fi], i)));
  if (bew === 'neben') return `<div class="nebeneinander"><div><b>${esc(nm(f.a))}</b><p>${esc(oa.s || 'Im Bestand ohne Zusammenfassung.')}</p></div><div><b>${esc(nm(f.b))}</b><p>${esc(ob.s || 'Im Bestand ohne Zusammenfassung.')}</p></div></div>`;
  if (bew === 'gegen') return `<p><b>Wo es reibt.</b> ${gegen ? `In der Gegenrichtung sagt der Bestand: ${satz(gegen)}.` : 'Eine Gegenaussage hält der Bestand nicht fest.'} ${esc(def.nicht)}</p>`;
  if (bew === 'durch') return `<p><b>${esc(nm(f.a))}, gelesen durch ${esc(nm(f.b))}.</b> ${esc(ob.s || '')}</p><p class="klein">Die Linse ist eine Leseweise; sie verändert keine Aussage des Bestands.</p>`;
  if (bew === 'fehlt') {
    const na = nachbarn(f.a); const gemeinsam = [...nachbarn(f.b)].filter((n) => na.has(n) && n !== f.a && n !== f.b).slice(0, 6);
    return gemeinsam.length
      ? `<p><b>Mögliche dritte Stimmen</b> – Orte, mit denen beide im Bestand verbunden sind:</p><div class="chips">${gemeinsam.map((n) => `<button type="button" class="chip" data-ort="${n}">${esc(nm(n))}</button>`).join('')}</div><button type="button" class="knopf klein" data-dritte>Eigene dritte Stimme festhalten</button>`
      : `<p><b>Keine gemeinsame dritte Stimme im Bestand.</b> Beide teilen keinen Nachbarn. Was fehlt, kannst du selbst festhalten.</p><button type="button" class="knopf klein" data-dritte>Eigene dritte Stimme festhalten</button>`;
  }
  if (bew === 'kippt') return `<p><b>Wo sie kippt.</b> ${f.grenze ? esc(f.grenze) : 'Der Bestand nennt für diese Fuge keine Grenze. Wo würde sie für dich kippen? Das bleibt eine offene Frage, keine Antwort.'}</p>${f.frage ? `<p class="klein">Offene Frage im Bestand: ${esc(f.frage)}</p>` : ''}`;
  if (bew === 'takt') {
    const arten = (i) => { const m = new Map(); for (const fi of A.adj[i]) { const a = fugenArt(A.daten.fugen[fi]); m.set(a, (m.get(a) || 0) + 1); } return m; };
    const ma = arten(f.a); const mb = arten(f.b); const beide = [...ma.keys()].filter((k) => mb.has(k) && k !== 'einordnung');
    return beide.length ? `<p><b>Gemeinsame Bewegung.</b> Beide tragen im Bestand Fugen dieser Arten:</p><div class="chips">${beide.map((k) => `<span class="chip" aria-pressed="false">${zeichen(k, 30, 12)}${esc(ARTEN[k].name)} <span class="n">${ma.get(k)} · ${mb.get(k)}</span></span>`).join('')}</div>` : '<p><b>Kein gemeinsamer Takt im Bestand.</b> Außer dieser Fuge teilen beide keine Fugenart.</p>';
  }
  return '';
}

// Großansicht einer Fuge; die Lesebewegung ordnet die Beteiligten räumlich neu.
export function station(host, f, art, bewegung, eigen) {
  const W = 560; const H = 300; const cy = 150;
  const pos = {
    neben: [[140, cy], [420, cy]], gegen: [[160, 105], [400, 195]], durch: [[235, cy], [325, cy]],
    fehlt: [[150, 120], [410, 120]], kippt: [[150, 115], [410, 190]], takt: [[150, cy], [410, cy]],
  }[bewegung] || [[140, cy], [420, cy]];
  const [pa, pb] = pos; const def = ARTEN[art]; const st = strich(eigen ? 'persoenlich' : f.geltung, 2.2);
  const oa = ort(f.a); const ob = ort(f.b);
  const ga = A.daten.regionen[oa.r]; const gb = A.daten.regionen[ob.r];
  const d = fugenPfad(art, pa[0] + 36, pa[1] + (pb[1] - pa[1]) * 0.08, pb[0] - 36, pb[1] - (pb[1] - pa[1]) * 0.08, 2.2);
  const anim = art === 'folge' ? 'schritt' : art === 'spannung' ? 'zittern' : '';
  const wrap = (t, n = 18) => { const words = t.split(' '); const lines = ['']; for (const w of words) { if ((lines.at(-1) + w).length > n && lines.at(-1)) lines.push(''); lines[lines.length - 1] += `${w} `; } return lines.slice(0, 3); };
  const teil = (o, g, p, rolle, idx) => {
    const lines = wrap(nm(idx));
    return `<g class="teil bew" tabindex="0" role="link" data-ort="${idx}" aria-label="Zu ${esc(nm(idx))}" style="transform:translate(${p[0]}px,${p[1]}px)">
      <circle r="104" fill="url(#halo-${idx})"/>
      <circle class="scheibe" r="32" fill="${g.farbe}" fill-opacity=".14" stroke="${g.farbe}" stroke-width="2"/>
      <circle r="9" fill="${g.farbe}"/>
      ${lines.map((l, n) => `<text text-anchor="middle" y="${52 + n * 18}">${esc(l.trim())}</text>`).join('')}
      ${rolle ? `<text class="rolle" text-anchor="middle" y="${52 + lines.length * 18}">als ${esc(rolle)}</text>` : ''}
    </g>`;
  };
  let extra = '';
  if (bewegung === 'durch') extra = `<circle cx="${pb[0]}" cy="${pb[1]}" r="70" fill="${gb.farbe}" fill-opacity=".08" stroke="${gb.farbe}" stroke-dasharray="3 4"/>`;
  if (bewegung === 'fehlt') extra = `<g style="transform:translate(280px,232px)"><circle r="28" fill="none" stroke="#6b6254" stroke-width="2" stroke-dasharray="4 5"/><text text-anchor="middle" y="6" style="font:600 20px var(--serif);fill:#6b6254">?</text><text text-anchor="middle" y="50" style="font:italic 13px var(--serif);fill:#6b6254">eine dritte Stimme fehlt</text></g>
    <path d="M${pa[0] + 20} ${pa[1] + 30} Q 230 220 254 228 M${pb[0] - 20} ${pb[1] + 30} Q 330 220 306 228" fill="none" stroke="#9c927f" stroke-dasharray="2 5"/>`;
  if (bewegung === 'kippt') extra = `<g style="transform:translate(280px,152px) rotate(-14deg)"><path d="M-10 -22 L4 -4 L-6 2 L8 22" fill="none" stroke="#9a2f2f" stroke-width="2.4" stroke-linejoin="round"/></g>`;
  if (bewegung === 'gegen') extra = `<g style="transform:translate(280px,150px)"><circle r="16" fill="#fff" stroke="#a0522d" stroke-width="1.5"/><path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#a0522d" stroke-width="2"/></g>`;
  const takt = bewegung === 'takt' ? 'class="takt"' : '';
  const ra = f.teile?.[0]?.rolle; const rb = f.teile?.[1]?.rolle;
  host.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`${def.name} zwischen ${oa.t} und ${ob.t}, Lesebewegung ${bewegung}`)}">
    <style>.takt .teil{animation:takt 1.6s ease-in-out infinite}@keyframes takt{50%{transform:var(--t) scale(1.06)}}</style>
    <defs>${[[f.a, ga], [f.b, gb]].map(([n, g]) => `<radialGradient id="halo-${n}"><stop offset="0" stop-color="${g.farbe}" stop-opacity=".16"/><stop offset=".7" stop-color="${g.farbe}" stop-opacity=".05"/><stop offset="1" stop-color="${g.farbe}" stop-opacity="0"/></radialGradient>`).join('')}</defs>
    ${extra}
    <path class="groß ${art === 'offen' ? 'offen' : ''} fp ${anim}" d="${d}" stroke="${eigen ? '#1f4fa8' : def.farbe}" stroke-width="${st.width + 1.2}" ${art === 'offen' ? 'fill="url(#schraffur)" fill-opacity=".5"' : ''} ${st.dash.length ? `stroke-dasharray="${st.dash.join(' ')}"` : ''}/>
    <g ${takt}>${teil(oa, ga, pa, ra, f.a)}${teil(ob, gb, pb, rb, f.b)}</g>
    <text x="${(pa[0] + pb[0]) / 2}" y="${(pa[1] + pb[1]) / 2 - 26}" text-anchor="middle" style="font:italic 600 15px var(--serif);fill:${eigen ? '#1f4fa8' : def.farbe}">${esc(def.name)}</text>
  </svg>`;
  host.querySelectorAll('.teil').forEach((n) => {
    n.style.setProperty('--t', n.style.transform);
    const go = () => geh({ ebene: 'ort', ort: Number(n.dataset.ort) });
    n.addEventListener('click', go); n.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
  });
}

// ---------------- Leseraum ----------------
export async function lesen(el, i) {
  const o = ort(i); const g = A.daten.regionen[o.r];
  el.innerHTML = `<div class="lesen"><nav class="leiste" aria-label="Lage und Abschnitte"><canvas class="lagebild" width="300" height="220" aria-hidden="true"></canvas><ol id="l-toc"></ol></nav>
    <article><p class="kicker"><span class="punkt" style="background:${g.farbe}"></span>${esc(g.name)} · Original</p><p class="klein">Wird geladen …</p></article></div>`;
  const t = await A.textePromise; if (A.zustand.ort !== i || A.zustand.ebene !== 'lesen') return;
  const tx = t.orte[i]; const fund = t.fundus.find((f) => f.eintrag === i);
  let html = '';
  if (fund) html = markdown(fund.text);
  else {
    // Quellenzeilen wie „[leitlinie] url:… | …“ gehören in die Quellen, nicht in den Fließtext.
    const zeilen = (tx.body || o.s || '').split('\n');
    const quellZeilen = zeilen.filter((z) => /^\s*\[[^\]]+\]\s/.test(z));
    const body = zeilen.filter((z) => !/^\s*\[[^\]]+\]\s/.test(z)).join('\n');
    var extraQuellen = quellZeilen.map((z) => { const typ = z.match(/^\s*\[([^\]]+)\]/)[1]; const url = (z.match(/url:(\S+)/) || [])[1] || ''; const rest = z.replace(/^\s*\[[^\]]+\]\s*/, '').replace(/url:\S+\s*\|?\s*/, '').replace(/^\|\s*/, ''); return { titel: rest.replace(/^"|"$/g, ''), art: typ, url, autoren: '', jahr: '' }; });
    // Originaltexte tragen teils Markdown-Gliederung; sie wird gesetzt, nicht als Zeichen gezeigt.
    html = `<h1 tabindex="-1" data-erster-fokus>${esc(o.t)}</h1>${markdown(body.replace(/^#\s+.*\n+/, '')).replace(/<p>([\s\S]*?)<\/p>/g, (m, inner) => `<p>${verweise(inner, i)}</p>`)}`;
  }
  if (tx.korrektur) html = `<div class="korrektur"><b>Redaktionell präzisiert.</b> ${esc(tx.korrektur.text)}<br><span class="klein">Ursprünglicher Wortlaut: „${esc(tx.korrektur.original)}“</span></div>${html}`;
  const quellen = (tx.quellen || []).filter((id) => t.quellen[id]);
  const art = el.querySelector('article');
  art.innerHTML = `<p class="kicker"><span class="punkt" style="background:${g.farbe}"></span>${esc(g.name)} · ${fund ? 'vollständiges Kapitel' : 'Originaltext im Bestand'}</p>${html}
    ${quellen.length || (typeof extraQuellen !== 'undefined' && extraQuellen.length) ? `<div class="abschnitt"><h3>Quellen</h3><ul class="quellen">${quellen.map((id) => quelleHtml(t.quellen[id])).join('')}${(typeof extraQuellen !== 'undefined' ? extraQuellen : []).map(quelleHtml).join('')}</ul></div>` : ''}
    <div class="herkunft"><b>Herkunft.</b> ${esc(tx.herkunft?.titel || 'nicht benannt')}${fund ? ' · vollständiger Text aus dem Wissensfundus' : ''}.
      Der Text steht hier unverändert. Hervorgehobene Begriffe führen zu Orten der Karte; diese Verweise sind Wortübereinstimmungen, keine fachliche Verbindung.
      <details class="technik"><summary>Technische Details</summary><pre>${esc([tx.herkunft?.pfad, tx.herkunft?.commit, fund?.datei].filter(Boolean).join('\n'))}</pre></details></div>
    <div class="taten"><button class="knopf voll" type="button" id="l-zurueck">Zurück zu ${esc(o.t.slice(0, 40))}</button></div>`;
  if (!art.querySelector('h1')) art.insertAdjacentHTML('afterbegin', `<h1 tabindex="-1" data-erster-fokus>${esc(o.t)}</h1>`);
  art.querySelector('h1').setAttribute('tabindex', '-1'); art.querySelector('h1').focus({ preventScroll: true });
  art.querySelector('#l-zurueck').onclick = () => geh({ ebene: 'ort', ort: i });
  art.querySelectorAll('.verweis').forEach((b) => b.addEventListener('click', () => geh({ ebene: 'ort', ort: Number(b.dataset.ort) })));
  // Abschnittsleiste und Lagebild
  const toc = el.querySelector('#l-toc'); const heads = [...art.querySelectorAll('h2')];
  heads.forEach((h, n) => { h.id = `abschnitt-${n}`; const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.textContent = h.textContent; b.onclick = () => h.scrollIntoView({ behavior: A.ruhig ? 'auto' : 'smooth' }); li.append(b); toc.append(li); });
  if (!heads.length) toc.innerHTML = `<li class="da"><button type="button">${esc(o.t)}</button></li>`;
  const scroller = document.querySelector('#blatt-inhalt'); if (A.zustand.ebene !== 'lesen') return;
  const mark = () => { let cur = 0; heads.forEach((h, n) => { if (h.getBoundingClientRect().top < 160) cur = n; }); toc.querySelectorAll('li').forEach((li, n) => li.classList.toggle('da', n === cur)); };
  scroller.onscroll = heads.length ? mark : null; mark();
  lagebild(el.querySelector('.lagebild'), i);
}

function lagebild(cv, i) {
  const c = cv.getContext('2d'); const o = ort(i); const S = 0.9;
  c.fillStyle = '#efe8da'; c.fillRect(0, 0, cv.width, cv.height);
  c.save(); c.translate(cv.width / 2 - o.x * S, cv.height / 2 - o.y * S); c.scale(S, S);
  for (const fi of A.adj[i]) { const f = A.daten.fugen[fi]; const a = ort(f.a); const b = ort(f.b); c.strokeStyle = ARTEN[fugenArt(f)].farbe; c.globalAlpha = 0.55; c.lineWidth = 1.2 / S; c.beginPath(); c.moveTo(a.x, a.y); c.lineTo(b.x, b.y); c.stroke(); }
  c.globalAlpha = 1;
  A.daten.orte.forEach((p) => { if (Math.abs(p.x - o.x) < 200 && Math.abs(p.y - o.y) < 150) { c.fillStyle = A.daten.regionen[p.r].farbe; c.beginPath(); c.arc(p.x, p.y, 2.2 / S, 0, 7); c.fill(); } });
  c.strokeStyle = '#1d1a16'; c.lineWidth = 2 / S; c.beginPath(); c.arc(o.x, o.y, 7 / S, 0, 7); c.stroke(); c.restore();
}

// Ortsnamen im Text werden zu Verweisen (nur längere, eindeutige Titel derselben Region und Nachbarn).
function verweise(html, i) {
  const kand = new Map();
  const add = (n) => { const t = ort(n).t; if (t.length >= 7 && n !== i && !/[()[\]]/.test(t)) kand.set(t, n); };
  for (const fi of A.adj[i]) add(anderer(A.daten.fugen[fi], i));
  let out = html; let count = 0;
  for (const [t, n] of [...kand].sort((a, b) => b[0].length - a[0].length)) {
    if (count > 12) break;
    const re = new RegExp(`(^|[\\s„(])(${esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=[\\s.,;:!?“)]|$)`, 'i');
    if (re.test(out)) { out = out.replace(re, `$1<button type="button" class="verweis" data-ort="${n}">$2</button>`); count++; }
  }
  return out;
}

function markdown(src) {
  const lines = src.replace(/\r/g, '').split('\n'); const out = []; let list = null; let para = []; let table = [];
  const inline = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<i>$2</i>').replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  const flush = () => {
    if (para.length) { out.push(`<p>${inline(para.join(' '))}</p>`); para = []; }
    if (list) { out.push(`<${list.t}>${list.items.map((x) => `<li>${inline(x)}</li>`).join('')}</${list.t}>`); list = null; }
    if (table.length) { const rows = table.filter((r) => !/^\|?\s*:?-{2,}/.test(r)); out.push(`<table>${rows.map((r, n) => `<tr>${r.replace(/^\||\|$/g, '').split('|').map((c) => n ? `<td>${inline(c.trim())}</td>` : `<th>${inline(c.trim())}</th>`).join('')}</tr>`).join('')}</table>`); table = []; }
  };
  let first = true;
  for (const line of lines) {
    const h = line.match(/^(#{1,4})\s+(.*)/);
    if (h) { flush(); const lvl = h[1].length; out.push(lvl === 1 && first ? `<h1>${inline(h[2])}</h1>` : `<h${Math.min(3, lvl + (lvl === 1 ? 1 : 0))}>${inline(h[2])}</h${Math.min(3, lvl + (lvl === 1 ? 1 : 0))}>`); first = false; continue; }
    if (/^\s*\|/.test(line)) { if (para.length || list) { const t = table; table = []; flush(); table = t; } table.push(line.trim()); continue; }
    const li = line.match(/^\s*(?:[-*]|(\d+)\.)\s+(.*)/);
    if (li) { if (para.length) { const p = para; para = []; out.push(`<p>${inline(p.join(' '))}</p>`); } const t = li[1] ? 'ol' : 'ul'; if (!list || list.t !== t) { flush(); list = { t, items: [] }; } list.items.push(li[2]); continue; }
    if (/^>\s?/.test(line)) { flush(); out.push(`<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`); continue; }
    if (!line.trim()) { flush(); continue; }
    if (list && /^\s{2,}/.test(line)) { list.items[list.items.length - 1] += ` ${line.trim()}`; continue; }
    if (table.length) flush();
    para.push(line.trim());
  }
  flush(); return out.join('\n');
}

// ---------------- Legende ----------------
export function legende(el) {
  const arten = Object.entries(ARTEN);
  const zahl = {}; A.daten.fugen.forEach((f) => { const a = fugenArt(f); zahl[a] = (zahl[a] || 0) + 1; });
  el.innerHTML = `
    <p class="kicker">Lesehilfe</p>
    <h1 class="titel" tabindex="-1" data-erster-fokus>So ist diese Karte gebaut</h1>
    <p class="lead">Jeder Punkt ist ein Eintrag des Atlasbestands. Gebiete sind die zehn Sammlungen. Fugen sind die Beziehungen, die der Bestand zwischen Einträgen festhält – gezeichnet nach ihrer Art.</p>
    <div class="grenzen">
      <div class="grenze"><b>Lage</b><p>Gebiete mit vielen Verbindungen liegen näher beieinander; innerhalb eines Gebiets ziehen Fugen Einträge zusammen. Nähe ist Anordnung, keine Messung von Verwandtschaft.</p></div>
      <div class="grenze"><b>Höhe</b><p>Das Relief zeigt, wo viele Einträge dicht liegen. Es bewertet nichts.</p></div>
      <div class="grenze"><b>Fugenart</b><p>Eine redaktionelle Lesart dieser Fassung über den unveränderten Originalkanten. Jede Fuge nennt, woraus ihre Art gelesen wurde.</p></div>
    </div>
    <div class="abschnitt"><h3>Fugenarten: Form, Bedeutung, Grenze</h3><div class="legende" id="l-arten"></div></div>
    <div class="abschnitt"><h3>Herkunft einer Verbindung: die Strichart</h3><div class="legende" id="l-geltung"></div></div>
    <div class="abschnitt"><h3>Bedienung</h3><p class="text" style="font-size:16px">Ziehen verschiebt, Mausrad oder zwei Finger zoomen. Ein Ort öffnet sich mit Tippen; sein Fugenstern zeigt, wie er mit anderen zusammenhängt. „Aufnehmen“ trägt einen Ort als Licht über die Karte: Orte mit einer Fuge zu ihm zeigen ihre Art. Tippen fängt weitere Orte ein; Ringe markieren gemeinsame Nachbarn der Kombination. Tastatur: Pfeile wählen den nächsten Ort in dieser Richtung, A nimmt auf, Plus und Minus zoomen, Escape geht zurück.</p></div>
    <details class="technik"><summary>Woher die Ideen stammen</summary><p class="text" style="font-size:16px">Fugenarten und ihre Grenzen bündeln WiRKGEFÜGE (Station mit Armen, Nichtverbindung), die Grok-„Fugenfassung“ (Bedingung ist keine Ursache, Einwand bleibt lokal, Richtung und Gegenrichtung getrennt), WiRKGEFÜGE (Bruch, Spannung), DAS DAZWISCHEN (Reibung, Schwelle, gekittete Bruchstelle; Zusammenführung, unversioniert) und den Cursor-Phänomenkörper (Ausgangs- und Eingangsrolle, Bericht und Lesart getrennt). Die sechs Lesebewegungen stammen aus dem ChatGPT-Entwurf „FUGE“, über Codex „FUGEN“ vermittelt. Flug mit Ankunft und Rückweg nach OneZoom; Kategorien als Regionen eines Körpers nach Of the Oak; übereinandergleitende Blätter nach 11 Tanjung. Gestaltung und Umsetzung: Claude.</p></details>
    <details class="technik"><summary>Technische Details</summary><pre id="l-tech"></pre></details>`;
  const la = el.querySelector('#l-arten');
  for (const [k, d] of arten) {
    la.insertAdjacentHTML('beforeend', `<div class="reihe">${zeichen(k, 60, 22)}<div><b>${esc(d.name)}</b> <span class="klein">${zahl[k] ? `${zahl[k]} im Bestand` : d.nurEigen ? 'nur in eigener Arbeit' : 'im Bestand nicht vorhanden'}</span><p>${esc(d.zeigt)}</p><p class="nicht">${esc(d.nicht)}</p><p class="klein">Idee: ${esc(d.idee)}</p></div></div>`);
  }
  const lg = el.querySelector('#l-geltung');
  for (const [k, d] of Object.entries(GELTUNG)) lg.insertAdjacentHTML('beforeend', `<div class="reihe"><span class="geltung ${k}"><i></i></span><div><b>${esc(d.name)}</b><p>${esc(d.text)}</p></div></div>`);
  fetch('/api/status').then((r) => r.json()).then((s) => {
    el.querySelector('#l-tech').textContent = `Grafik: ${A.gelaende.modus === 'webgl' ? 'WebGL2-Gelände' : 'Canvas-Gelände (ohne WebGL)'}\nSpeicher: ${s.speicher}, Volume: ${s.volume}\nBestand: ${A.daten.orte.length} Orte, ${A.daten.fugen.length} Originalkanten`;
  }).catch(() => {});
}
