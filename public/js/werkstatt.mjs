// Persönliche Arbeit: eigene Fugen und Notizen an Orten der Karte.
// Gespeichert im lokalen Dienst auf dem geprüften externen Volume; nichts wird übertragen.
import { ARTEN, GELTUNG, fugenPfad, strich, zeichen } from './fugen.mjs';
import { esc } from './ansichten.mjs';

const RICHTUNG = { aus: 'geht aus', an: 'kommt an', beides: 'in beide Richtungen', offen: 'nicht angegeben' };
const neueId = () => `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
const slugify = (t) => t.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'fuge';

export class Werkstatt {
  constructor(A, { meldung, geh }) {
    this.A = A; this.meldung = meldung; this.geh = geh;
    this.d = { format: 'fugenland-werkstatt', version: 1, gefuege: [], notizen: [], verlauf: [], uebernommen: [] };
    this.ortId = new Map(); this.ortIndex = new Map();
  }

  async laden() {
    const t = await this.A.textePromise;
    t.orte.forEach((o, i) => { this.ortId.set(i, o.id); this.ortIndex.set(o.id, i); });
    try {
      const r = await fetch('/api/werkstatt'); if (!r.ok) throw new Error(r.status);
      const d = await r.json(); this.d = { ...this.d, ...d, ...normalisiere(d, this.ortIndex, true) };
      this.d.uebernommen ||= [];
      this.geladen = true;
    } catch { this.meldung('Der persönliche Speicher ist gerade nicht erreichbar. Speichern ist gesperrt, damit nichts überschrieben wird.'); this.geladen = false; }
    try { this.#karte(); } catch (error) { console.warn('Eigene Arbeit teilweise nicht darstellbar', error); }
  }

  ortVon(teil) { return teil.ortId ? this.ortIndex.get(teil.ortId) ?? null : null; }
  slug(id) { const g = this.d.gefuege.find((x) => x.id === id); if (!g) return 'unbekannt'; const s = slugify(g.titel || 'fuge'); const same = this.d.gefuege.filter((x) => slugify(x.titel || 'fuge') === s); return same.length > 1 ? `${s}-${same.indexOf(g) + 1}` : s; }
  ausSlug(s) { return this.d.gefuege.find((g) => this.slug(g.id) === s)?.id ?? null; }

  #karte() {
    const k = this.A.karte; k.eigene = this.d.gefuege.map((g) => ({ id: g.id, titel: g.titel, art: g.art, teile: g.teile.map((t) => ({ ort: this.ortVon(t) })) })); k.dirty = true;
    const z = document.querySelector('#eigen-zahl'); const n = this.d.gefuege.length + this.d.notizen.length;
    z.hidden = !n; z.textContent = n;
  }

  // Speichern nacheinander, mit Revisionsprüfung: ein fremder neuerer Stand wird nie still überschrieben.
  #speichern(text) {
    this.kette = (this.kette || Promise.resolve()).then(() => this.#speichernJetzt(text));
    return this.kette;
  }

  async #speichernJetzt(text) {
    if (!this.geladen) { this.meldung('Nicht gespeichert: Der Speicher wurde nicht geladen. Bitte neu laden; deine Eingabe bleibt in diesem Fenster.'); return false; }
    this.d.verlauf = (this.d.verlauf || []).slice(-200);
    for (const g of this.d.gefuege) if (g.verlauf?.length > 30) g.verlauf = [g.verlauf[0], ...g.verlauf.slice(-29)];
    try {
      const r = await fetch('/api/werkstatt', { method: 'PUT', headers: { 'content-type': 'application/json', 'if-match': this.d.revision || 'neu' }, body: JSON.stringify(this.d) });
      const antwort = await r.json().catch(() => ({}));
      if (r.status === 409) { this.meldung('Nicht gespeichert: Inzwischen gibt es einen neueren Stand (anderes Fenster?). Bitte neu laden.'); return false; }
      if (!r.ok) throw new Error(antwort.fehler || r.status);
      this.d.revision = antwort.revision; this.#karte(); if (text) this.meldung(text.text, text.rueck); return true;
    } catch (error) {
      try { this.#karte(); } catch { /* Darstellung folgt beim nächsten Laden */ }
      this.meldung(`Nicht gespeichert: ${error.message}. Die Eingabe bleibt in diesem Fenster erhalten.`); return false;
    }
  }

  // ---------- Werkbank ----------
  werkbank(el, id, vorlage) {
    const A = this.A; const alt = id ? this.d.gefuege.find((g) => g.id === id) : null;
    // Ein nicht gespeicherter Entwurf bleibt beim Verlassen erhalten und kehrt beim Wiederöffnen zurück.
    const schluessel = id || 'neu';
    const entwurf = A.entwurf?.schluessel === schluessel && !vorlage ? A.entwurf.g : null;
    const g = entwurf ? entwurf : alt ? structuredClone(alt) : {
      id: neueId(), titel: '', art: vorlage?.art || 'offen', geltung: 'persoenlich', aussage: '', gegenaussage: '', grenze: '', perspektive: '',
      lesebewegung: vorlage?.lesebewegung || '', kontext: vorlage?.kontext || 'Neu in der Werkbank begonnen',
      teile: (vorlage?.teile || []).map((t) => ({ ortId: this.ortId.get(t.ort), name: A.daten.orte[t.ort].t, rolle: t.rolle || '', richtung: 'offen' })),
    };
    if (!alt && !entwurf && g.teile.length === 2 && !g.titel) g.titel = `${g.teile[0].name} – ${g.teile[1].name}`.slice(0, 80);
    if (entwurf) setTimeout(() => this.meldung('Dein nicht gespeicherter Entwurf ist wieder da.'), 300);
    el.innerHTML = `<div class="werkbank">
      <p class="kicker" style="color:var(--eigen)">${zeichen('annaeherung', 30, 12, '#1f4fa8')} Werkbank · ${alt ? 'eigene Fuge bearbeiten' : 'neue eigene Fuge'}</p>
      <div class="feld"><label for="w-titel">Name der Fuge</label><input id="w-titel" type="text" data-erster-fokus value="${esc(g.titel)}" placeholder="Wie willst du sie wiederfinden?"></div>
      <div class="station" id="w-station" style="margin-top:14px"></div>
      <div class="feld"><span>Beteiligte <small>Rollen stehen an der Beteiligung, nicht am Ort.</small></span><ul class="teile" id="w-teile"></ul>
        <div class="suche" style="margin-top:6px"><label for="w-dazu" class="nur-vorlesen">Ort hinzufügen</label><input id="w-dazu" type="search" placeholder="Weiteren Ort hinzufügen …" autocomplete="off" role="combobox" aria-expanded="false" aria-controls="w-treffer" aria-autocomplete="list" style="width:100%;border:2px solid #8f846f;box-shadow:none"><ul class="treffer" id="w-treffer" role="listbox" hidden style="left:0;right:auto"></ul></div>
        ${A.hand.length ? '<button class="knopf klein energie" type="button" id="w-hand" style="margin-top:8px">Orte aus der Hand übernehmen</button>' : ''}
      </div>
      <div class="feld"><span>Art der Fuge</span><div class="artwahl" id="w-art" role="group" aria-label="Art der Fuge"></div><p class="artwahl-grenze" id="w-art-grenze"></p></div>
      <div class="feld"><label for="w-aussage">Aussage <small>Was hältst du fest? In eigenen Worten.</small></label><textarea id="w-aussage">${esc(g.aussage)}</textarea></div>
      <div class="feld"><label for="w-gegen">Gegenrichtung <small>Gilt es auch zurück? Mit eigenem Grund – oder leer lassen.</small></label><textarea id="w-gegen">${esc(g.gegenaussage)}</textarea></div>
      <div class="feld"><label for="w-grenze">Grenze <small>Wann gilt es nicht? Was beweist es nicht?</small></label><textarea id="w-grenze">${esc(g.grenze)}</textarea></div>
      <div class="feld"><label for="w-sicht">Perspektive <small>Aus wessen Sicht?</small></label><input id="w-sicht" type="text" value="${esc(g.perspektive)}"></div>
      <div class="feld"><span>Stand</span><div class="stern-filter" id="w-geltung" role="group" aria-label="Stand">
        <button type="button" class="chip" data-g="persoenlich" aria-pressed="${g.geltung === 'persoenlich'}">persönliche Zuordnung</button>
        <button type="button" class="chip" data-g="offen" aria-pressed="${g.geltung === 'offen'}">offene Frage</button></div>
        <small>${esc(GELTUNG.persoenlich.text)} Eine eigene Fuge wird nie zu belegtem Wissen.</small></div>
      <p class="klein" style="margin-top:14px">Begonnen: ${esc(g.kontext)}</p>
      <div class="taten" style="margin-top:18px">
        <button class="knopf eigen-voll" type="button" id="w-speichern">Speichern</button>
        <button class="knopf" type="button" id="w-abbrechen">${alt ? 'Ohne Änderung zurück' : 'Verwerfen'}</button>
        ${alt ? '<button class="knopf" type="button" id="w-loeschen" style="margin-left:auto">Löschen</button>' : ''}
      </div>
      ${alt?.verlauf?.length ? `<div class="abschnitt"><h3>Verlauf dieser Fuge</h3><ul class="verlauf">${alt.verlauf.slice().reverse().map((v) => `<li>${new Date(v.zeit).toLocaleString('de-DE')} · ${esc(v.was)}</li>`).join('')}</ul></div>` : ''}
    </div>`;
    const $ = (s) => el.querySelector(s);
    const neuZeichnen = () => { stationMehr($('#w-station'), g, A); $('#w-station').classList.toggle('leer', !g.teile.length); };
    const teileZeichnen = () => {
      const ul = $('#w-teile'); ul.innerHTML = '';
      g.teile.forEach((t, n) => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="name">${esc(t.name)}</span>
          <button type="button" class="knopf klein" aria-label="${esc(t.name)} entfernen">Entfernen</button>
          <div class="rolle-feld"><label for="r${n}">als</label><input id="r${n}" type="text" value="${esc(t.rolle)}" placeholder="Rolle, z. B. Auslöser, Kontext, Frage"></div>
          <div class="rolle-feld"><label for="d${n}">Richtung</label><select id="d${n}">${Object.entries(RICHTUNG).map(([k, v]) => `<option value="${k}" ${t.richtung === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>`;
        li.querySelector('button').onclick = () => { g.teile.splice(n, 1); teileZeichnen(); neuZeichnen(); };
        li.querySelector('input').oninput = (e) => { t.rolle = e.target.value; neuZeichnen(); };
        li.querySelector('select').onchange = (e) => { t.richtung = e.target.value; neuZeichnen(); };
        ul.append(li);
      });
      if (!g.teile.length) ul.innerHTML = '<li><span class="klein">Noch keine Beteiligten. Füge Orte hinzu.</span></li>';
    };
    const artEl = $('#w-art');
    for (const [k, d] of Object.entries(ARTEN)) {
      if (k === 'einordnung') continue;
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', String(g.art === k)); b.setAttribute('aria-label', `${d.name}: ${d.nicht}`);
      b.innerHTML = `${zeichen(k, 70, 18, '#1f4fa8')}<b>${esc(d.name)}</b><span class="klein">${esc(d.nicht)}</span>`;
      b.onclick = () => { g.art = k; artEl.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); $('#w-art-grenze').textContent = `${d.zeigt} ${d.nicht}`; neuZeichnen(); };
      artEl.append(b);
    }
    $('#w-geltung').querySelectorAll('[data-g]').forEach((b) => b.onclick = () => { g.geltung = b.dataset.g; $('#w-geltung').querySelectorAll('[data-g]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); });
    // Ort hinzufügen
    const dazu = $('#w-dazu'); const tr = $('#w-treffer');
    const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
    dazu.oninput = () => {
      const q = norm(dazu.value.trim()); tr.innerHTML = ''; if (q.length < 2) { tr.hidden = true; return; }
      const hits = A.daten.orte.map((o, i) => [norm(o.t).indexOf(q), i]).filter(([p]) => p >= 0).sort((a, b) => a[0] - b[0]).slice(0, 8);
      hits.forEach(([, i], k) => {
        const li = document.createElement('li'); li.role = 'option'; li.id = `w-t${k}`; li.innerHTML = `<span class="punkt" style="background:${A.daten.regionen[A.daten.orte[i].r].farbe}"></span><b>${esc(A.daten.orte[i].t)}</b><small>${esc(A.daten.regionen[A.daten.orte[i].r].name)}</small>`;
        li.onpointerdown = (e) => { e.preventDefault(); this.#teilDazu(g, i); dazu.value = ''; tr.hidden = true; teileZeichnen(); neuZeichnen(); };
        tr.append(li);
      });
      tr.hidden = !hits.length; dazu.setAttribute('aria-expanded', String(!tr.hidden)); wahl = -1;
    };
    let wahl = -1;
    dazu.onkeydown = (e) => {
      const opts = [...tr.querySelectorAll('li')];
      if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && opts.length) {
        e.preventDefault(); wahl = Math.max(0, Math.min(opts.length - 1, wahl + (e.key === 'ArrowDown' ? 1 : -1)));
        opts.forEach((o, k) => o.setAttribute('aria-selected', String(k === wahl))); dazu.setAttribute('aria-activedescendant', opts[wahl].id);
      }
      if (e.key === 'Enter' && opts.length) { e.preventDefault(); opts[Math.max(0, wahl)].dispatchEvent(new PointerEvent('pointerdown')); }
      if (e.key === 'Escape') { tr.hidden = true; dazu.setAttribute('aria-expanded', 'false'); }
    };
    dazu.onblur = () => setTimeout(() => { tr.hidden = true; }, 150);
    $('#w-hand')?.addEventListener('click', () => { for (const i of A.hand) this.#teilDazu(g, i); teileZeichnen(); neuZeichnen(); });
    const bank = el.querySelector('.werkbank');
    bank.addEventListener('input', () => { lesen(); A.entwurf = { schluessel, g }; });
    bank.addEventListener('change', () => { A.entwurf = { schluessel, g }; });
    const lesen = () => { g.titel = $('#w-titel').value.trim(); g.aussage = $('#w-aussage').value; g.gegenaussage = $('#w-gegen').value; g.grenze = $('#w-grenze').value; g.perspektive = $('#w-sicht').value; };
    $('#w-titel').oninput = () => { g.titel = $('#w-titel').value; };
    $('#w-speichern').onclick = async () => {
      lesen();
      if (!g.titel) { $('#w-titel').focus(); this.meldung('Gib der Fuge einen Namen, damit du sie wiederfindest.'); return; }
      if (!g.teile.length) { $('#w-dazu').focus(); this.meldung('Eine Fuge braucht mindestens einen beteiligten Ort.'); return; }
      const jetzt = new Date().toISOString(); const k = A.karte;
      const fr = k.frei(); const mitte = k.welt(fr.w / 2, fr.h / 2); g.kamera = { x: Math.round(mitte.x), y: Math.round(mitte.y), z: Math.round(k.zoom * 100) / 100 };
      g.verlauf ||= [];
      if (alt) {
        const was = ['titel', 'art', 'aussage', 'gegenaussage', 'grenze', 'perspektive', 'geltung'].filter((f) => alt[f] !== g[f]).map((f) => ({ titel: 'Name', art: 'Art', aussage: 'Aussage', gegenaussage: 'Gegenrichtung', grenze: 'Grenze', perspektive: 'Perspektive', geltung: 'Stand' }[f]));
        if (JSON.stringify(alt.teile) !== JSON.stringify(g.teile)) was.push('Beteiligte');
        if (!was.length) { this.geh({ ebene: 'eigen', eigen: g.id }); return; }
        g.verlauf.push({ zeit: jetzt, was: `geändert: ${was.join(', ')}`, vorher: { ...alt, verlauf: undefined } });
        g.geaendert = jetzt; this.d.gefuege[this.d.gefuege.findIndex((x) => x.id === g.id)] = g;
      } else {
        g.erstellt = jetzt; g.geaendert = jetzt; g.verlauf.push({ zeit: jetzt, was: 'angelegt' }); this.d.gefuege.push(g);
      }
      if (await this.#speichern({ text: alt ? 'Änderung gespeichert.' : 'Eigene Fuge gespeichert. Sie liegt jetzt auf der Karte.' })) {
        A.entwurf = null;
        if (!alt && g.teile.some((t) => A.hand.includes(this.ortIndex.get(t.ortId)))) document.querySelector('#hand-ablegen').click();
        this.geh({ ebene: 'eigen', eigen: g.id });
      }
    };
    $('#w-abbrechen').onclick = () => { A.entwurf = null; return alt ? this.geh({ ebene: 'eigen', eigen: alt.id }) : history.back(); };
    $('#w-loeschen')?.addEventListener('click', () => this.loeschen(alt.id));
    $('#w-art-grenze').textContent = `${ARTEN[g.art].zeigt} ${ARTEN[g.art].nicht}`;
    teileZeichnen(); neuZeichnen();
  }

  #teilDazu(g, i) {
    const id = this.ortId.get(i); if (g.teile.some((t) => t.ortId === id)) return;
    g.teile.push({ ortId: id, name: this.A.daten.orte[i].t, rolle: '', richtung: 'offen' });
  }

  async loeschen(id) {
    const n = this.d.gefuege.findIndex((g) => g.id === id); if (n < 0) return;
    const [weg] = this.d.gefuege.splice(n, 1);
    this.d.verlauf.push({ zeit: new Date().toISOString(), was: `gelöscht: ${weg.titel}` });
    const ok = await this.#speichern({
      text: `„${weg.titel}“ gelöscht.`,
      rueck: async () => { if (!this.d.gefuege.some((g) => g.id === weg.id)) this.d.gefuege.push(weg); await this.#speichern({ text: 'Wiederhergestellt.' }); this.geh({ ebene: 'eigen', eigen: weg.id }); },
    });
    if (!ok) { this.d.gefuege.splice(n, 0, weg); return; }
    this.geh({ ebene: 'eigen' });
  }

  zeigeAufKarte(id) {
    const g = this.d.gefuege.find((x) => x.id === id); if (!g) return;
    const k = this.A.karte; k.eigenSel = id;
    if (g.kamera) k.fliege(g.kamera.x, g.kamera.y, g.kamera.z);
    else { const pts = g.teile.map((t) => this.ortVon(t)).filter((i) => i !== null).map((i) => this.A.daten.orte[i]); if (pts.length) k.fliege(pts.reduce((s, p) => s + p.x, 0) / pts.length, pts.reduce((s, p) => s + p.y, 0) / pts.length, 1.2); }
  }

  // ---------- Meine Arbeit ----------
  liste(el, id) {
    const A = this.A; const g = id ? this.d.gefuege.find((x) => x.id === id) : null;
    if (g) {
      el.innerHTML = `<p class="kicker" style="color:var(--eigen)">${zeichen(g.art, 40, 14, '#1f4fa8')} Eigene Fuge · ${esc(ARTEN[g.art]?.name || '')}</p>
        <h1 class="titel" tabindex="-1" data-erster-fokus>${esc(g.titel)}</h1>
        <div class="station werkbank" id="e-station"></div>
        ${g.aussage ? `<div class="aussage"><span class="richtung">Aussage</span><p class="satz">${esc(g.aussage)}</p>${g.gegenaussage ? `<span class="richtung">zurück</span><p class="satz">${esc(g.gegenaussage)}</p>` : ''}</div>` : ''}
        <dl class="vermerk">
          <dt>Stand</dt><dd><span class="geltung ${esc(GELTUNG[g.geltung] ? g.geltung : 'persoenlich')}"><i></i>${esc(GELTUNG[g.geltung]?.name || 'persönlich')}</span></dd>
          <dt>Grenze</dt><dd class="${g.grenze ? '' : 'leer'}">${esc(g.grenze || 'fehlt noch')}</dd>
          ${g.perspektive ? `<dt>Perspektive</dt><dd>${esc(g.perspektive)}</dd>` : ''}
          <dt>Entstanden</dt><dd>${esc(g.kontext)} <span class="klein">· ${new Date(g.erstellt).toLocaleString('de-DE')}${g.geaendert !== g.erstellt ? ` · geändert ${new Date(g.geaendert).toLocaleString('de-DE')}` : ''}</span></dd>
          ${g.verlauf?.length > 1 ? `<dt>Verlauf</dt><dd><ul class="verlauf">${g.verlauf.slice().reverse().map((v) => `<li>${new Date(v.zeit).toLocaleString('de-DE')} · ${esc(v.was)}</li>`).join('')}</ul></dd>` : ''}
        </dl>
        <div class="taten"><button class="knopf eigen-voll" type="button" id="e-bearbeiten">Bearbeiten</button><button class="knopf" type="button" id="e-alle">Alle eigenen Fugen</button><button class="knopf" type="button" id="e-loeschen" style="margin-left:auto">Löschen</button></div>`;
      stationMehr(el.querySelector('#e-station'), g, A, (i) => this.geh({ ebene: 'ort', ort: i }));
      el.querySelector('#e-bearbeiten').onclick = () => this.geh({ ebene: 'werkbank', eigen: g.id });
      el.querySelector('#e-alle').onclick = () => this.geh({ ebene: 'eigen' });
      el.querySelector('#e-loeschen').onclick = () => this.loeschen(g.id);
      return;
    }
    el.innerHTML = `<p class="kicker" style="color:var(--eigen)">Meine Arbeit</p>
      <h1 class="titel" tabindex="-1" data-erster-fokus>Was ich festgehalten habe</h1>
      <p class="lead">Eigene Fugen und Notizen liegen auf der Karte an ihren Orten. Sie bleiben auf diesem Rechner, im lokalen Speicher dieser Fassung.</p>
      <div class="taten"><button class="knopf eigen-voll" type="button" id="e-neu">Neue eigene Fuge</button></div>
      <div class="abschnitt"><h3>Eigene Fugen</h3><ul class="eigene-liste" id="e-fugen"></ul></div>
      <div class="abschnitt"><h3>Notizen an Orten</h3><ul class="eigene-liste" id="e-notizen"></ul></div>
      <div class="abschnitt"><h3>Sichern und übernehmen</h3>
        <p class="klein">Export enthält nur deine eigene Arbeit. Ein Import aus der bisherigen Atlasfassung („mein-atlasblick.json“) wird unverändert mitgesichert und zusätzlich lesbar übernommen.</p>
        <div class="taten"><button class="knopf" type="button" id="e-export">Exportieren</button>
        <label class="knopf" for="e-import" style="cursor:pointer">Importieren …</label><input id="e-import" type="file" accept="application/json,.json" class="nur-vorlesen"></div>
        <div id="e-export-text"></div></div>`;
    const ul = el.querySelector('#e-fugen');
    for (const f of [...this.d.gefuege].sort((a, b) => (b.geaendert || '').localeCompare(a.geaendert || ''))) {
      const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.className = 'eintrag';
      b.innerHTML = `${zeichen(f.art, 60, 18, '#1f4fa8')}<b>${esc(f.titel)}</b><small>${f.teile.map((t) => esc(t.name)).join(' · ')}</small>`;
      b.onclick = () => this.geh({ ebene: 'eigen', eigen: f.id }); li.append(b); ul.append(li);
    }
    if (!this.d.gefuege.length) ul.innerHTML = '<li class="klein">Noch keine eigene Fuge. Beginne an einem Ort oder aus einer Fuge.</li>';
    const nl = el.querySelector('#e-notizen');
    for (const n of this.d.notizen) {
      const i = this.ortIndex.get(n.ortId); const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.className = 'eintrag';
      b.innerHTML = `<span class="klein">${n.art === 'frage' ? 'Frage' : 'Beobachtung'}</span><b>${esc(n.text.slice(0, 120))}</b><small>${esc(i !== undefined ? A.daten.orte[i].t : 'Ort nicht im Bestand')}</small>`;
      if (i !== undefined) b.onclick = () => this.geh({ ebene: 'ort', ort: i }); li.append(b); nl.append(li);
    }
    if (!this.d.notizen.length) nl.innerHTML = '<li class="klein">Noch keine Notiz.</li>';
    el.querySelector('#e-neu').onclick = () => this.geh({ ebene: 'werkbank' });
    el.querySelector('#e-export').onclick = () => this.#export(el.querySelector('#e-export-text'));
    el.querySelector('#e-import').onchange = (e) => this.#import(e.target.files[0], el);
  }

  #export(host) {
    const data = JSON.stringify({ ...this.d, exportiert: new Date().toISOString() }, null, 2);
    const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    host.innerHTML = `<p class="klein" style="margin-top:10px"><a href="${url}" download="fugenland-meine-arbeit.json">Datei speichern</a> – falls das Speichern in einer eingebetteten Ansicht gesperrt ist, kannst du den Inhalt hier kopieren:</p><textarea readonly style="width:100%;height:140px;font:12px ui-monospace,monospace;border:2px solid #8f846f;border-radius:8px;padding:8px"></textarea>`;
    host.querySelector('textarea').value = data;
  }

  async #import(file, el) {
    if (!file) return;
    let data; const text = await file.text();
    try { data = JSON.parse(text); } catch { this.meldung('Die Datei ist kein lesbares JSON.'); return; }
    const jetzt = new Date().toISOString(); let neu = 0;
    if (data.format === 'fugenland-werkstatt') {
      const norm = normalisiere(data, this.ortIndex); data.gefuege = norm.gefuege; data.notizen = norm.notizen;
      for (const g of data.gefuege || []) { const alt = this.d.gefuege.find((x) => x.id === g.id); if (!alt) { this.d.gefuege.push(g); neu++; } else if ((g.geaendert || '') > (alt.geaendert || '')) { alt.verlauf = [...(alt.verlauf || []), { zeit: jetzt, was: 'durch neueren Import ersetzt', vorher: { ...alt, verlauf: undefined } }]; Object.assign(alt, { ...g, verlauf: alt.verlauf }); neu++; } }
      for (const n of data.notizen || []) if (!this.d.notizen.some((x) => x.id === n.id)) { this.d.notizen.push(n); neu++; }
    } else if (data.schemaVersion === 1 && Array.isArray(data.profiles)) {
      // Bisheriges Format der Atlasfassung: unverändert sichern und lesbar übernehmen.
      this.d.uebernommen.push({ zeit: jetzt, datei: file.name, format: 'atlas-personal/1', original: data });
      for (const p of data.profiles) {
        for (const [entryId, m] of Object.entries(p.marks || {})) {
          for (const [feld, art] of [['note', 'beobachtung'], ['question', 'frage']]) {
            if (!m[feld] || !this.ortIndex.has(entryId)) continue;
            const text = String(m[feld]); const herkunft = `übernommen aus Profil „${String(p.name || '')}“`;
            if (this.d.notizen.some((x) => x.ortId === entryId && x.text === text && x.herkunft === herkunft)) continue;
            this.d.notizen.push({ id: neueId(), ortId: entryId, art, text, erstellt: String(m.updatedAt || jetzt), herkunft }); neu++;
          }
        }
        for (const gr of p.graphs || []) {
          const teile = (gr.nodes || []).map((n) => (typeof n === 'string' ? n : n.entryId || n.id)).filter((e) => this.ortIndex.has(e)).map((e) => ({ ortId: e, name: this.A.daten.orte[this.ortIndex.get(e)].t, rolle: '', richtung: 'offen' }));
          if (!teile.length) continue;
          this.d.gefuege.push({ id: neueId(), titel: gr.name || gr.title || 'Übernommener Graph', art: 'annaeherung', geltung: 'persoenlich', aussage: gr.note || '', gegenaussage: '', grenze: '', perspektive: '', teile, kontext: `übernommen aus Profil „${p.name}“`, erstellt: gr.createdAt || jetzt, geaendert: jetzt, verlauf: [{ zeit: jetzt, was: 'aus bisheriger Atlasfassung übernommen' }] });
          neu++;
        }
      }
    } else { this.meldung('Unbekanntes Format. Nichts übernommen.'); return; }
    this.d.verlauf.push({ zeit: jetzt, was: `Import ${file.name}: ${neu} Einträge` });
    await this.#speichern({ text: `${neu} Einträge übernommen. Das Original der Datei bleibt mitgesichert.` });
    this.liste(el);
  }

  // ---------- Am Ort: eigene Fugen und Notizen ----------
  amOrt(el, i) {
    const id = this.ortId.get(i); const fugen = this.d.gefuege.filter((g) => g.teile.some((t) => t.ortId === id));
    const notizen = this.d.notizen.filter((n) => n.ortId === id);
    el.innerHTML = `<div class="abschnitt"><h3 style="color:var(--eigen)">Meine Arbeit an diesem Ort</h3>
      <ul class="eigene-liste" id="a-fugen"></ul><ul class="eigene-liste" id="a-notizen" style="margin-top:8px"></ul>
      <div class="feld"><label for="a-text">Eigene Frage oder Beobachtung hier</label><textarea id="a-text" placeholder="Was fällt dir an diesem Ort auf, was willst du klären?"></textarea></div>
      <div class="stern-filter" role="group" aria-label="Art der Notiz" style="margin-top:8px"><button type="button" class="chip" data-a="frage" aria-pressed="true">Frage</button><button type="button" class="chip" data-a="beobachtung" aria-pressed="false">Beobachtung</button>
      <button type="button" class="knopf eigen-voll klein" id="a-speichern" style="margin-left:auto">Notiz speichern</button></div></div>`;
    let art = 'frage';
    el.querySelectorAll('[data-a]').forEach((b) => b.onclick = () => { art = b.dataset.a; el.querySelectorAll('[data-a]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); });
    const fl = el.querySelector('#a-fugen');
    for (const g of fugen) { const li = document.createElement('li'); const b = document.createElement('button'); b.type = 'button'; b.className = 'eintrag'; b.innerHTML = `${zeichen(g.art, 60, 18, '#1f4fa8')}<b>${esc(g.titel)}</b><small>${g.teile.map((t) => esc(t.name)).join(' · ')}</small>`; b.onclick = () => this.geh({ ebene: 'eigen', eigen: g.id }); li.append(b); fl.append(li); }
    const nl = el.querySelector('#a-notizen');
    for (const n of notizen) {
      const li = document.createElement('li'); li.style.cssText = 'display:grid;gap:6px;padding:10px 12px;border:1.5px solid #c9d5ee;border-radius:12px;background:#fff';
      li.innerHTML = `<span class="klein">${n.art === 'frage' ? 'Frage' : 'Beobachtung'} · ${new Date(n.geaendert || n.erstellt).toLocaleDateString('de-DE')}</span><textarea aria-label="Notiz bearbeiten" style="border:2px solid #8f846f;border-radius:8px;padding:8px;font:16px/1.45 var(--serif);min-height:60px">${esc(n.text)}</textarea><div style="display:flex;gap:6px"><button type="button" class="knopf klein" data-tat="sichern">Änderung speichern</button><button type="button" class="knopf klein" data-tat="weg">Löschen</button></div>`;
      li.querySelector('[data-tat=sichern]').onclick = async () => { n.text = li.querySelector('textarea').value; n.geaendert = new Date().toISOString(); await this.#speichern({ text: 'Notiz gespeichert.' }); };
      li.querySelector('[data-tat=weg]').onclick = async () => {
        const k = this.d.notizen.indexOf(n); this.d.notizen.splice(k, 1);
        const ok = await this.#speichern({ text: 'Notiz gelöscht.', rueck: async () => { if (!this.d.notizen.includes(n)) this.d.notizen.push(n); await this.#speichern({ text: 'Wiederhergestellt.' }); this.amOrt(el, i); } });
        if (!ok) this.d.notizen.splice(k, 0, n);
        this.amOrt(el, i);
      };
      nl.append(li);
    }
    el.querySelector('#a-speichern').onclick = async () => {
      const text = el.querySelector('#a-text').value.trim(); if (!text) { el.querySelector('#a-text').focus(); return; }
      const jetzt = new Date().toISOString();
      this.d.notizen.push({ id: neueId(), ortId: id, art, text, erstellt: jetzt, geaendert: jetzt });
      if (await this.#speichern({ text: 'Notiz an diesem Ort gespeichert.' })) this.amOrt(el, i);
    };
  }
}

// Station mit Armen: die Beteiligten im Kreis, die Fuge in der Mitte (nach WiRKGEFÜGE).
export function stationMehr(host, g, A, onOrt) {
  const W = 560; const H = 330; const cx = W / 2; const cy = H / 2 - 6; const n = g.teile.length;
  const R = n <= 2 ? 190 : 125;
  const pts = g.teile.map((t, k) => {
    const ang = n <= 2 ? (k === 0 ? Math.PI : 0) : -Math.PI / 2 + (k / n) * Math.PI * 2;
    return { t, x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R * (n <= 2 ? 1 : 0.92), i: g.teile[k].ortId ? A.werkstatt.ortIndex.get(g.teile[k].ortId) : null };
  });
  const st = strich('persoenlich', 2);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`Eigene Fuge ${g.titel || ''}: ${ARTEN[g.art]?.name || ''} zwischen ${g.teile.map((t) => t.name).join(', ')}`)}">`;
  if (!n) return void (host.innerHTML = '<p class="klein" style="margin:0;padding:18px;text-align:center;font-style:italic">Noch keine Beteiligten. Füge unten Orte hinzu oder übernimm sie aus der Hand.</p>');
  for (const p of pts) {
    const [x1, y1, x2, y2] = p.t.richtung === 'an' ? [cx, cy, p.x, p.y] : [p.x, p.y, cx, cy];
    const d = fugenPfad(g.art, x1 + (x2 - x1) * 0.18, y1 + (y2 - y1) * 0.18, x2 - (x2 - x1) * 0.12, y2 - (y2 - y1) * 0.12, 1.8);
    svg += `<path class="fp ${g.art === 'offen' ? 'offen' : ''} ${g.art === 'uebergang' || p.t.richtung === 'aus' || p.t.richtung === 'an' ? 'fluss' : ''}" d="${d}" stroke="#1f4fa8" stroke-width="${st.width + 0.6}" ${g.art === 'offen' ? 'fill="url(#schraffur)" fill-opacity=".5"' : 'fill="none"'} ${g.geltung === 'offen' ? 'stroke-dasharray="3 5"' : ''}/>`;
  }
  // Station in der Mitte: Form nach Art (Bedingung eckig, sonst rund)
  if (n) svg += g.art === 'bedingung' ? `<rect x="${cx - 13}" y="${cy - 13}" width="26" height="26" fill="#fff" stroke="#1f4fa8" stroke-width="2.5"/>` : `<circle cx="${cx}" cy="${cy}" r="13" fill="#fff" stroke="#1f4fa8" stroke-width="2.5"/>`;
  if (n) svg += `<text x="${cx}" y="${cy + 34}" text-anchor="middle" style="font:italic 600 14px var(--serif);fill:#1f4fa8">${esc(ARTEN[g.art]?.name || '')}</text>`;
  for (const p of pts) {
    const o = p.i !== null && p.i !== undefined ? A.daten.orte[p.i] : null; const farbe = o ? A.daten.regionen[o.r].farbe : '#888';
    const name = p.t.name.length > 26 ? `${p.t.name.slice(0, 24)}…` : p.t.name;
    const below = p.y >= cy - 10;
    svg += `<g class="teil" ${o && onOrt ? `tabindex="0" role="link" data-ort="${p.i}" aria-label="Zu ${esc(p.t.name)}"` : ''} transform="translate(${p.x},${p.y})">
      <circle class="scheibe" r="24" fill="${farbe}" fill-opacity=".13" stroke="${farbe}" stroke-width="2"/><circle r="7" fill="${farbe}"/>
      <text text-anchor="middle" y="${below ? 42 : -32}" style="font:600 14px var(--sans);fill:#1d1a16">${esc(name)}</text>
      ${p.t.rolle ? `<text text-anchor="middle" y="${below ? 60 : -50}" style="font:italic 13.5px var(--serif);fill:#1f4fa8">als ${esc(p.t.rolle.slice(0, 32))}</text>` : ''}
      <text text-anchor="middle" y="${below ? (p.t.rolle ? 76 : 58) : (p.t.rolle ? -66 : -48)}" style="font:12px var(--sans);fill:#6b6254">${esc(RICHTUNG[p.t.richtung] || '')}</text></g>`;
  }
  host.innerHTML = `${svg}</svg>`;
  if (onOrt) host.querySelectorAll('[data-ort]').forEach((el) => { const go = () => onOrt(Number(el.dataset.ort)); el.addEventListener('click', go); el.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); }); });
}

// Importierte und gespeicherte Einträge feldweise neu aufbauen: nur bekannte Felder, bekannte Werte, Zeichenketten.
export function normalisiere(data, ortIndex, behalten = false) {
  const bekannt = (id) => behalten || ortIndex.has(String(id));
  const str = (v, n = 4000) => String(v ?? '').slice(0, n);
  const gefuege = (Array.isArray(data.gefuege) ? data.gefuege : []).filter((g) => g && Array.isArray(g.teile)).map((g) => ({
    id: str(g.id, 60) || neueId(), titel: str(g.titel, 200), art: ARTEN[g.art] && g.art !== 'einordnung' ? g.art : 'offen',
    geltung: g.geltung === 'offen' ? 'offen' : 'persoenlich', aussage: str(g.aussage), gegenaussage: str(g.gegenaussage), grenze: str(g.grenze), perspektive: str(g.perspektive, 400),
    lesebewegung: str(g.lesebewegung, 20), kontext: str(g.kontext, 300), erstellt: str(g.erstellt, 40), geaendert: str(g.geaendert, 40),
    teile: g.teile.filter((t) => t && bekannt(t.ortId)).map((t) => ({ ortId: String(t.ortId), name: str(t.name, 200), rolle: str(t.rolle, 200), richtung: ['aus', 'an', 'beides', 'offen'].includes(t.richtung) ? t.richtung : 'offen' })),
    verlauf: (Array.isArray(g.verlauf) ? g.verlauf : []).slice(-30).map((v) => ({ zeit: str(v?.zeit, 40), was: str(v?.was, 300), ...(v?.vorher && typeof v.vorher === 'object' ? { vorher: v.vorher } : {}) })),
    kamera: g.kamera && Number.isFinite(g.kamera.x) && Number.isFinite(g.kamera.y) && Number.isFinite(g.kamera.z) ? { x: g.kamera.x, y: g.kamera.y, z: g.kamera.z } : undefined,
  })).filter((g) => behalten || g.teile.length);
  const notizen = (Array.isArray(data.notizen) ? data.notizen : []).filter((n) => n && bekannt(n.ortId)).map((n) => ({
    id: str(n.id, 60) || neueId(), ortId: String(n.ortId), art: n.art === 'beobachtung' ? 'beobachtung' : 'frage', text: str(n.text), erstellt: str(n.erstellt, 40), geaendert: str(n.geaendert || n.erstellt, 40), herkunft: n.herkunft ? str(n.herkunft, 300) : undefined,
  }));
  return { gefuege, notizen };
}
