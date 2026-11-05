/* Schloss und Schlüssel – Probe, vierte Fassung (Nachbesserung 05.11.)
   Das Feld ist Gewebe: Gebiete sind helle Membranen, jeder Ort ein Körper, dessen Umriss aus seinem
   Fugenprofil kommt. Aus jeder echten Fuge läuft ein Faserbündel zum Treffpunkt; wie weit es dicht bleibt,
   folgt allein der gemeinsamen Regel zaehne() – nie dem Abstand. Danach franst es aus und verblasst.
   Eine Fuge betreten heißt: Schließzylinder im Querschnitt – vier Stifte (Lesart, Beleg, Grenze, Wort)
   und ein Kontext-Hebel, der einen fehlenden Stift „nur unter“ einer Bedingung halten kann.
   Keine Abhängigkeiten, keine Netzanfragen, nichts wird gespeichert. Daten: daten.js (baue-daten.mjs). */
(() => {
  'use strict';

  const D = window.SCHLOSS_DATEN;
  const raum = document.getElementById('raum');
  if (!D) { raum.textContent = 'Die Datei daten.js fehlt.'; return; }
  const NS = 'http://www.w3.org/2000/svg';
  const PROFIL = window.ZUGANGSPROFIL || { umfang: 'kern', niveau: 'original', blick: 'innen', reiz: 'ruhig', ton: false, schrift: 'normal', setze() {}, beobachte() {} };
  const ZT = () => window.ZUGANG_TEXTE || null;
  const systemStill = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const lebendig = () => !systemStill() && PROFIL.reiz === 'lebendig';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const f1 = (x) => Math.round(x * 10) / 10;
  const jetzt = () => performance.now();
  const glatt = (x) => x * x * (3 - 2 * x);

  /* ================= Bestand vorbereiten ================= */
  const SLOTS = ['lesart', 'beleg', 'grenze', 'wort', 'kontext'];
  const VIER = ['lesart', 'beleg', 'grenze', 'wort'];
  const SLOT_NAME = { lesart: 'Lesart', beleg: 'Beleg', grenze: 'Grenze', wort: 'Wort', kontext: 'Kontext' };
  // Greifen nur die Arten, die die Regel nennt: „Nähe“ und „könnte zusammenhängen“.
  const NESTEND = new Set(['annaeherung', 'zusammenhang']);
  const TRENNEND = new Set(['spannung', 'widerspruch', 'abstand', 'begrenzung']);
  const GEBIET_FARBE = { 'ADHS · Randphänomene': 'blau', Neuroatlas: 'minze', 'Phänomenatlas': 'koralle', 'Beziehungen & Borderline': 'pflaume', 'Forschung & Einordnung': 'schiefer' };
  const FARBEN = {
    blau: { tief: '#2f45d6', dunkel: '#1b2994', hauch: '#d3dbfb', licht: '#f1f4ff', faser: '#5367e0' },
    minze: { tief: '#1a8467', dunkel: '#0f5c47', hauch: '#c8ecdf', licht: '#eefaf5', faser: '#2f9a7a' },
    koralle: { tief: '#d05a33', dunkel: '#8f3517', hauch: '#ffd9ca', licht: '#fff4ef', faser: '#d9734f' },
    pflaume: { tief: '#9a3a74', dunkel: '#6a2050', hauch: '#f4dbea', licht: '#fcf3f8', faser: '#ad5689' },
    schiefer: { tief: '#4d5e7e', dunkel: '#2f3b52', hauch: '#e0e6ef', licht: '#f6f8fb', faser: '#687a99' },
  };
  const farbeG = (g) => FARBEN[GEBIET_FARBE[g] || 'schiefer'];
  const farbe = (ort) => farbeG(ort.gebiet);
  const KURZ_GEBIET = { 'ADHS · Randphänomene': 'ADHS', 'Beziehungen & Borderline': 'Beziehungen', 'Forschung & Einordnung': 'Forschung' };
  const kurzG = (g) => KURZ_GEBIET[g] || g;

  // Gleicher Titel in zwei Gebieten (zweimal „Hyperfokus“): der Ort außerhalb des Heimgebiets trägt sein Gebiet im Namen
  {
    const heim = D.orte[D.schloss].gebiet;
    const zahl = new Map();
    for (const o of Object.values(D.orte)) zahl.set(o.titel, (zahl.get(o.titel) || 0) + 1);
    for (const o of Object.values(D.orte)) {
      o.titelBestand = o.titel;
      if (zahl.get(o.titel) > 1 && o.gebiet !== heim) o.titel = `${o.titel} (${o.gebiet})`;
    }
  }
  for (const p of D.paare) { p.A = D.orte[p.a]; p.B = D.orte[p.b]; }

  /* ---------------- Sprache: nur Wortebene ---------------- */
  const STOPP = new Set(('aber alle allem allen aller alles also auch auf aus bei beim bis bist dabei dadurch dafür daher dahin damals damit danach dann daran darauf darin darum davon davor dass dazu dem den denen denn der des dessen deshalb die dies diese diesem diesen dieser dieses doch dort dran durch eher eine einem einen einer eines einfach einige etwas euch fast für gegen genau ganz gibt haben hatte hier hinter ihre ihrem ihren ihrer immer indem jede jedem jeden jeder jedes jetzt kann kein keine keinem keinen keiner können könnte manche manchmal mehr meist mich mir mit nach neben nicht nichts noch nun nur oder ohne schon sehr sein seine seinem seinen seiner selbst sich sie sind solche soll sollen sondern sowie über und uns unter viel viele vom von vor vorher während andere anderen anderer anderes anderem lange langen länger dauert dauern wann warum was weil weit welche welcher wenn wer werden wie wieder will wird wurde würde zum zur zwar zwischen ein das ist als bis wie wer wo').split(' '));
  const FUNDORT = new Set(['forum', 'foren', 'thread', 'studie', 'studien', 'leitlinie', 'leitlinien', 'quelle', 'quellen', 'community', 'klinik', 'manual', 'portal', 'portalseite']);
  function tokens(text) {
    const out = [];
    const re = /[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)*/g;
    let m;
    while ((m = re.exec(text))) out.push({ roh: m[0], klein: m[0].toLowerCase(), start: m.index, ende: m.index + m[0].length });
    return out;
  }
  const titelWoerter = (...t) => new Set(t.flatMap((x) => tokens(x).map((y) => y.klein)));
  const zaehlt = (klein, aus) => klein.length >= 4 && !STOPP.has(klein) && !FUNDORT.has(klein) && !aus.has(klein);
  const zaehltHand = (klein, aus) => klein.length >= 3 && !STOPP.has(klein) && !FUNDORT.has(klein) && !aus.has(klein);
  function gleicherStamm(a, b) {
    if (a === b) return true;
    let i = 0;
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    return i >= 5 && i >= Math.min(a.length, b.length) - 2;
  }
  function gemeinsam(t1, t2, aus) {
    const B = tokens(t2).filter((x) => zaehlt(x.klein, aus));
    const out = [];
    const gesehen = new Set();
    for (const a of tokens(t1)) {
      if (!zaehlt(a.klein, aus) || gesehen.has(a.klein)) continue;
      const b = B.find((x) => gleicherStamm(a.klein, x.klein));
      if (b) { gesehen.add(a.klein); out.push({ a: a.klein, b: b.klein, roh: a.roh, rohB: b.roh }); }
    }
    return out;
  }
  const ersterSatz = (text) => { const m = String(text).match(/^.*?[.!?](?=\s+[A-ZÄÖÜ„(]|\s*$)/); return m ? m[0] : String(text); };
  // Nennt ein Satz einen Ort? Voller Titel, Titel ohne Klammer oder Titelstamm („Reizfilter“ für „Reizfilterschwäche“)
  function ortNamen(ort) {
    const t = ort.titelBestand || ort.titel;
    const out = new Set([t]);
    const ohne = t.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
    out.add(ohne);
    if (!/\s/.test(ohne)) {
      const stamm = ohne.replace(/(schwäche|störung|sensitivität|heit|keit|ung)$/i, '');
      if (stamm.length >= 6 && stamm !== ohne) out.add(stamm);
    }
    return [...out].filter((x) => x.length >= 4);
  }
  const nenntOrt = (satz, ort) => ortNamen(ort).some((n) => satz.includes(n));

  /* ================= Zustand ================= */
  const S = {
    ansicht: 'feld',
    wahl: null, // { art: 'ort', k } | { art: 'naht', k } | { art: 'fehl', k } | { art: 'fuge', k } | { art: 'lesen' }
    voraus: null,
    aktiv: null,
    riegel: null,
    vorschlag: { grenze: 0, kontext: 0, beleg: 0 },
    wortHalb: null,
    hover: null,
    hoverPaar: null,
    regelOffen: false,
    licht: null,
    paare: D.paare.map(() => ({ lesart: 0, beleg: null, grenze: null, wort: null, kontext: null, eingerastet: false, bedingt: false, entscheidung: null, bestritten: false, kitt: false, wieder: false, verlauf: [], frisch: null })),
  };
  const paar = (i) => D.paare[i];
  const ein = (i) => S.paare[i];

  const autoCache = new Map();
  function autoWoerter(i) {
    const p = paar(i);
    if (!autoCache.has(i)) autoCache.set(i, gemeinsam(p.A.kurz, p.B.kurz, titelWoerter(p.A.titel, p.B.titel)));
    return autoCache.get(i);
  }
  function bestandQuellen(p) {
    const out = [];
    for (const f of p.fugen) for (const q of f.quellen) if (!out.some((x) => x.titel === q.titel)) out.push(q);
    return out;
  }

  /* ===== Die EINE Regel für Schloss und Feld: zaehne(Paar, Eingaben). Alles andere ruft sie auf. =====
     Vier Stifte sind nötig:
       Lesart  greift bei „Nähe“ oder „könnte zusammenhängen“ (aus Bestandsfuge oder Sätzen, die den Partner nennen).
       Beleg   greift bei Quellen der Fuge oder einer aufgelegten Ortsquelle (die bleibt deine Lesart).
       Grenze  greift bei einer Bestandsgrenze der Fuge, einem Satz, der beide nennt, oder einem Stein, den du
               bewusst als deine Grenze auflegst (Grenze eines Orts, Vermerk, eigenes Wort).
       Wort    greift bei einem gemeinsamen Wort der Kurztexte oder deiner Übersetzung.
     Kontext ist kein Pflichtstift, sondern ein Hebel: Fehlt genau einer der Stifte Beleg, Grenze oder Wort,
     hält eine aufgelegte Bedingung ihn – die Fuge rastet dann „nur unter“ dieser Bedingung ein. Die Lesart
     ersetzt sie nie: eine Bedingung ändert die Lage, nicht, was die Lesart sagt. */
  function zaehne(i, e) {
    const p = paar(i);
    const les = p.lesarten[e.lesart] || p.lesarten[0];
    const bestQ = bestandQuellen(p);
    const bestG = (p.fugen.find((f) => f.grenze) || {}).grenze || '';
    const auto = autoWoerter(i);
    const w = e.wort;
    const z = {
      lesart: { greift: NESTEND.has(les.art), les, deine: !les.ausBestand, bestand: p.lesarten[0] },
      beleg: { greift: bestQ.length > 0 || !!e.beleg, bestand: bestQ, dein: e.beleg },
      grenze: { greift: !!bestG || !!e.grenze, bestand: bestG, dein: e.grenze },
      wort: { greift: auto.length > 0 || !!(w && w.art === 'uebersetzung'), auto, dein: w },
      kontext: { greift: !!e.kontext, dein: e.kontext },
    };
    z.fehlend = VIER.filter((s) => !z[s].greift);
    z.vier = z.fehlend.length === 0;
    z.bedingt = !z.vier && z.fehlend.length === 1 && z.fehlend[0] !== 'lesart' && z.kontext.greift;
    z.ersetzt = z.bedingt ? z.fehlend[0] : null;
    z.alle = z.vier || z.bedingt;
    return z;
  }
  const bewerte = (i) => zaehne(i, ein(i));
  // Mögliche Eingaben, die genau diesen einen Zahn verändern (dieselben Handlungen wie im Schloss)
  function versuche(i, e, slot) {
    const p = paar(i);
    if (slot === 'lesart') return p.lesarten.map((_, j) => ({ ...e, lesart: j }));
    if (slot === 'beleg') { const q = [...p.A.quellen, ...p.B.quellen][0]; return q ? [{ ...e, beleg: { titel: q.titel, von: p.A.quellen.includes(q) ? p.A.titel : p.B.titel } }] : []; }
    if (slot === 'grenze') return [{ ...e, grenze: { text: 'deine Grenze', art: 'eigen' } }];
    if (slot === 'kontext') return [{ ...e, kontext: { text: 'deine Bedingung', dein: true } }];
    if (slot === 'wort') {
      const aus = titelWoerter(p.A.titel, p.B.titel);
      const a = tokens(p.A.kurz).find((x) => zaehltHand(x.klein, aus));
      const b = tokens(p.B.kurz).find((x) => zaehltHand(x.klein, aus));
      return a && b ? [{ ...e, wort: { art: 'uebersetzung', a: a.roh, b: b.roh } }] : [];
    }
    return [];
  }
  // Zwischenspeicher je Bild: dieselbe Frage nicht hundertfach rechnen. Geleert bei jedem Neuzeichnen.
  let MEMO = new Map();
  const merke = (k, fn) => { if (!MEMO.has(k)) MEMO.set(k, fn()); return MEMO.get(k); };
  const vergiss = () => { MEMO = new Map(); };
  const fehltNur = (i, slot) => merke(`n${i}|${slot}`, () => fehltNurRoh(i, slot));
  const fehltMitEinem = (i, slot) => merke(`m${i}|${slot}`, () => fehltMitEinemRoh(i, slot));
  // „Unter welcher Voraussetzung?“ – reicht genau diese eine Handlung, damit die Fuge einrastet?
  function fehltNurRoh(i, slot) {
    const e = ein(i), z = zaehne(i, e);
    if (z.alle || z[slot].greift) return false;
    return versuche(i, e, slot).some((x) => zaehne(i, x).alle);
  }
  // … oder fehlt nach ihr noch genau eine weitere?
  function fehltMitEinemRoh(i, slot) {
    const e = ein(i), z = zaehne(i, e);
    if (z.alle || z[slot].greift || fehltNur(i, slot)) return false;
    return SLOTS.some((s2) => s2 !== slot && !z[s2].greift && versuche(i, e, slot).some((x) => versuche(i, x, s2).some((y) => zaehne(i, y).alle)));
  }
  // blockiert: mit dem, was Bestand und Ortstexte anbieten, ist dieser Stift nicht zu füllen
  const blockiert = (i, slot) => merke(`b${i}|${slot}`, () => blockiertRoh(i, slot));
  function blockiertRoh(i, slot) {
    const e = ein(i), z = zaehne(i, e);
    if (z[slot].greift) return false;
    return !versuche(i, e, slot).some((x) => zaehne(i, x)[slot].greift);
  }
  const spaltBleibt = (i) => blockiert(i, 'lesart');

  /* ---------------- Steine: Vorschläge aus dem Wortlaut (keine KI, keine Netzanfrage) ---------------- */
  // Grenzen: uneingeschränkt nur Sätze, die den Partner nennen. Grenzen eines einzelnen Orts und der Vermerk der
  // Fuge sind gekennzeichnet und greifen nur, wenn du sie bewusst auflegst – dann als „deine Grenze“.
  function grenzVorschlaege(i) {
    const p = paar(i);
    const out = [];
    const dazu = (x) => { if (!out.some((y) => y.text === x.text)) out.push(x); };
    for (const [o, anderer] of [[p.A, p.B], [p.B, p.A]]) for (const g of o.grenzSaetze || []) if (nenntOrt(g.satz, anderer)) dazu({ text: g.satz, art: 'partner', woher: o.titel, abschnitt: g.abschnitt, marke: `Grenze aus ${o.titel} · nennt ${anderer.titel}` });
    for (const f of p.fugen) if (f.detail && !f.grenze) dazu({ text: f.detail, art: 'vermerk', woher: 'Vermerk der Fuge', marke: 'Vermerk der Fuge (keine Bestandsgrenze)' });
    for (const o of [p.A, p.B]) for (const g of (o.grenzSaetze || []).filter((x) => x.abschnitt === 'Aussagegrenze').slice(0, 1)) dazu({ text: ersterSatz(g.satz), satz: g.satz, art: 'ort', woher: o.titel, abschnitt: g.abschnitt, marke: `Grenze des Orts ${o.titel}, nicht der Verbindung` });
    return out;
  }
  // Bedingungen: nur aus Sätzen, die den Partner nennen (Titel, Titelstamm). „Was Studien sagen“ und
  // „Was im Manual steht“ sind schon beim Bauen ausgeschlossen.
  function kontextVorschlaege(i) {
    const p = paar(i);
    const out = [];
    for (const [o, anderer] of [[p.A, p.B], [p.B, p.A]]) {
      for (const b of o.bedingungen || []) if (nenntOrt(b.satz, anderer) && !out.some((y) => y.text === b.klausel)) out.push({ text: b.klausel, woher: o.titel, satz: b.satz, abschnitt: b.abschnitt, marke: `Bedingung aus ${o.titel} · der Satz nennt ${anderer.titel}` });
    }
    return out;
  }
  function belegVorschlaege(i) {
    const p = paar(i);
    const out = [];
    for (const o of [p.A, p.B]) for (const q of o.quellen) if (!out.some((y) => y.titel === q.titel)) out.push({ titel: q.titel, art: q.art, zitat: q.zitat, von: o.titel });
    return out;
  }
  function grenzMarke(g) {
    if (!g) return '';
    if (g.art === 'partner') return 'Grenze aus dem Wortlaut · nennt beide · von dir aufgelegt';
    if (g.art === 'vermerk') return 'deine Grenze · aus dem Vermerk der Fuge (keine Bestandsgrenze)';
    if (g.art === 'ort') return `deine Grenze · Satz aus der Grenze des Orts ${g.woher}, nicht der Verbindung`;
    return 'deine Grenze';
  }
  const belegMarke = (b) => (b ? `Quelle von ${b.von}, nicht der Verbindung · von dir aufgelegt` : '');

  /* ---------------- Verbsatz und die zwei Sätze einer Fuge ---------------- */
  function verbSatz(i) {
    const p = paar(i);
    const f = p.fugen[0];
    if (!f) return null;
    const [subj, obj] = f.vomSchloss ? [p.A, p.B] : [p.B, p.A];
    let verb = f.label;
    const m = f.label.match(/^im Original als (.+?) beschrieben$/);
    if (m) verb = m[1] === 'Gegenpol' ? 'im Original Gegenpol zu' : m[1] === 'begrifflich benachbart' ? 'im Original begrifflich benachbart mit' : `im Original als ${m[1]} beschrieben zu`;
    return { subj, verb, obj };
  }

  function zustandWort(i) {
    const e = ein(i), z = bewerte(i);
    if (e.eingerastet) {
      let w = e.wieder ? 'wieder eingerastet' : 'eingerastet';
      if (z.bedingt) w += ` – nur unter „${e.kontext.text}“`;
      if (z.lesart.deine) w += ', entgegen der Bestandslesart';
      return w;
    }
    if (e.entscheidung === 'bestritten') return 'bestritten';
    if (e.kitt) return 'erloschen – die Bruchstelle ist gekittet';
    if (spaltBleibt(i)) return 'der Spalt bleibt – ein gültiger Zustand';
    return 'noch nicht eingerastet';
  }

  /* ---------------- Einrasten, Erlöschen, Entscheidungen ---------------- */
  const ZEIT_WORT = ['zuerst', 'dann', 'dann', 'dann'];
  function verlauf(i, art, text) { ein(i).verlauf.push({ art, text }); }
  function nachAenderung(i, was) {
    vergiss();
    const e = ein(i);
    if (e.entscheidung === 'bestritten') e.entscheidung = null; // eine neue Lage hebt das Bestreiten auf, die Spur bleibt
    const z = zaehne(i, e);
    if (e.eingerastet && !z.alle) {
      const warBedingt = e.bedingt;
      e.eingerastet = false; e.bedingt = false; e.kitt = true; e.entscheidung = null; e.frisch = 'riss'; e.frischS = 'riss';
      verlauf(i, 'erloschen', `erloschen: ${was}`);
      melde(warBedingt && !e.kontext ? 'Erloschen – die Bedingung ist weg, die bedingte Passung auch. Die Bruchstelle bleibt gekittet.' : `Erloschen – ${was}. Die Bruchstelle bleibt gekittet.`, i);
      klang('aus');
    } else if (!e.eingerastet && z.alle) {
      e.eingerastet = true; e.bedingt = z.bedingt; e.wieder = e.kitt || e.bestritten; e.frisch = 'hak'; e.frischS = 'hak';
      const unter = z.bedingt ? `nur unter „${e.kontext.text}“` : e.kontext ? `auch unter „${e.kontext.text}“` : 'in dieser Lage';
      verlauf(i, e.wieder ? 'wieder' : 'ein', `${e.wieder ? 'wieder eingerastet' : 'eingerastet'} ${unter}${z.lesart.deine ? ', entgegen der Bestandslesart' : ''}`);
      melde(`${e.wieder ? 'Wieder eingerastet' : 'Eingerastet'} ${unter}. Deine Lesart, kein fachlicher Befund.`, i);
      klang('ein');
    } else if (e.eingerastet) {
      e.bedingt = z.bedingt;
    }
  }
  function entscheide(i, art) {
    const e = ein(i);
    if (art === 'bestritten') {
      e.eingerastet = false; e.bedingt = false; e.entscheidung = 'bestritten'; e.bestritten = true; e.frisch = 'riss'; e.frischS = 'riss';
      verlauf(i, 'bestritten', 'bestritten – ein Sperrbalken liegt quer');
      melde('Bestritten. Ein Sperrbalken liegt quer im Zylinder, die Verbindung ist gelöst.', i);
      klang('aus');
    } else {
      e.entscheidung = art;
      verlauf(i, art, art === 'gefasst' ? 'für deinen Weg gefasst – Goldnaht' : 'offen gelassen – Ring um den Knoten');
      melde(art === 'gefasst' ? 'Für deinen Weg gefasst: eine Goldnaht zieht über den Arm. Nur in dieser offenen Seite.' : 'Offen gelassen: ein Ring um den Knoten, weder Zustimmung noch Widerspruch.', i);
    }
  }

  /* ================= DOM-Gerüst ================= */
  function hEl(tag, cls, eltern, text) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    if (eltern) eltern.appendChild(el);
    return el;
  }
  function sEl(tag, attrs, eltern) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    if (eltern) eltern.appendChild(el);
    return el;
  }
  function knopf(cls, eltern, text, fn, schluessel) {
    const b = hEl('button', cls, eltern, text);
    b.type = 'button';
    b.dataset.schluessel = schluessel || `${cls.split(' ')[0]}|${text}`;
    if (fn) b.addEventListener('click', (ev) => { ev.stopPropagation(); fn(ev); });
    return b;
  }
  // Fokus über einen Neubau retten: Schlüssel merken, danach dasselbe Element wieder fokussieren
  function mitFokus(fn) {
    const ae = document.activeElement;
    const key = ae && ae.dataset ? ae.dataset.schluessel : null;
    fn();
    if (!key) return;
    const ziel = document.querySelector(`[data-schluessel="${CSS.escape(key)}"]`) || document.querySelector(`[data-schluessel^="${CSS.escape(key.split('|')[0])}|"]`);
    if (ziel && ziel !== document.activeElement && !ziel.closest('[hidden]')) ziel.focus({ preventScroll: true });
  }

  raum.innerHTML = '';
  const kopf = hEl('header', 'kopf', raum);
  const kopfTitel = hEl('div', 'kopf-titel', kopf);
  hEl('h1', '', kopfTitel, 'Schloss und Schlüssel');
  const kopfUnter = hEl('p', 'kopf-unter', kopfTitel, 'Unter welchen Voraussetzungen zwei Orte zusammenpassen');
  const ecke = hEl('div', 'ecke', kopf);
  const ansageEl = hEl('div', 'ansage', raum);
  ansageEl.setAttribute('aria-live', 'polite');

  const feldAnsicht = hEl('section', 'feld-ansicht', raum);
  feldAnsicht.setAttribute('aria-label', 'Feld');
  const spalte = hEl('aside', 'spalte', feldAnsicht);
  const feldFlaeche = hEl('div', 'feld-flaeche', feldAnsicht);
  const svg = sEl('svg', { class: 'gewebe', role: 'group', 'aria-label': 'Feld der Orte' }, feldFlaeche);
  const defsSvg = sEl('svg', { class: 'defs-global', width: '0', height: '0', 'aria-hidden': 'true', focusable: 'false' }, raum);
  const defs = sEl('defs', {}, defsSvg);
  const gMembran = sEl('g', { class: 'membranen' }, svg);
  const gNaht = sEl('g', { class: 'naehte' }, svg);
  const gArme = sEl('g', { class: 'arme' }, svg);
  const gKoerper = sEl('g', { class: 'koerper' }, svg);
  const gSpur = sEl('g', { class: 'spuren' }, svg);
  const gSchrift = sEl('g', { class: 'schrift' }, svg);
  /* Bleibende Trefferflächen in Schichten: unten Nähte/Fehlstellen, dann Körper, darüber die Armbänder
     (die im Inneren der Körper ausgespart sind – die Mitte eines Körpers gehört immer dem Körper).
     Fokussierbar ist eine eigene, unsichtbare Schicht in Lesereihenfolge (Ort, dann seine Arme). */
  const gTrefferUnten = sEl('g', { class: 'treffer treffer-unten' }, svg);
  const gTrefferOrt = sEl('g', { class: 'treffer treffer-ort-schicht' }, svg);
  const gTrefferArm = sEl('g', { class: 'treffer treffer-arm' }, svg);
  const gFokus = sEl('g', { class: 'fokus-schicht' }, svg);
  const gTreffer = gTrefferUnten;
  // Schlüsselbart am Rand des Felds: zwischen Lesespalte und Gewebe, nie über dem Gewebe
  const vorausEl = hEl('div', 'voraus-schluessel', feldAnsicht);

  const schlossAnsicht = hEl('section', 'schloss-ansicht', raum);
  schlossAnsicht.setAttribute('aria-label', 'Schloss');
  schlossAnsicht.hidden = true;

  // Meldungen: Lichtschrift an der Fuge (Feld) bzw. am Treffpunkt im Zylinder (Schloss), dazu für Vorleser
  let lichtTimer = 0;
  function melde(text, i) {
    ansageEl.textContent = '';
    setTimeout(() => { ansageEl.textContent = text; }, 30);
    S.licht = { text, i: i ?? S.aktiv, start: jetzt() };
    clearTimeout(lichtTimer);
    lichtTimer = setTimeout(() => { S.licht = null; if (S.ansicht === 'feld') zeichneFeld(); else zeichneMechanik(jetzt()); }, 5200);
  }

  /* ================= Zugang direkt am Text ================= */
  const BLICK_STELLE = { innen: 'erlebt', aussen: 'unterschieden', spielraum: 'Spielraum' };
  const BLICK_LANG = { innen: 'von innen erlebt', aussen: 'von außen unterschieden', spielraum: 'auf Spielraum hin' };
  const NIVEAU_WORT = { original: 'im Original', alltag: 'in Alltagssprache', einfach: 'in einfacher Sprache' };
  function dreher(eltern, feld, woerter, titel) {
    const b = knopf(`dreher dreher-${feld}`, eltern, '', null, `dreher-${feld}|`);
    const werte = PROFIL.werte ? PROFIL.werte[feld] : Object.keys(woerter);
    const reihe = Object.keys(woerter).filter((k) => werte.includes(k));
    b.setAttribute('aria-label', `${titel}: ${woerter[PROFIL[feld]]}. Drehen wechselt.`);
    hEl('span', 'dreher-wort', b, woerter[PROFIL[feld]]);
    hEl('span', 'dreher-zeichen', b, '⟳');
    const dreh = (d) => {
      const j = reihe.indexOf(PROFIL[feld]);
      PROFIL.setze({ [feld]: reihe[(j + d + reihe.length) % reihe.length] });
    };
    b.addEventListener('click', (ev) => { ev.stopPropagation(); dreh(1); });
    b.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') { ev.preventDefault(); dreh(1); }
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') { ev.preventDefault(); dreh(-1); }
    });
    return b;
  }
  function baueEcke() {
    mitFokus(() => {
      ecke.innerHTML = '';
      const z = hEl('p', 'ecke-satz', ecke);
      hEl('span', '', z, 'Bewegung ');
      if (systemStill()) hEl('span', 'ecke-fest', z, 'ruhig (System)');
      else {
        const b = knopf('ecke-wort', z, PROFIL.reiz === 'lebendig' ? 'lebendig' : 'ruhig', () => PROFIL.setze({ reiz: PROFIL.reiz === 'lebendig' ? 'ruhig' : 'lebendig' }), 'ecke-reiz|');
        b.setAttribute('aria-pressed', String(PROFIL.reiz === 'lebendig'));
      }
      hEl('span', 'ecke-trenn', z, ' · ');
      hEl('span', '', z, 'Schrift ');
      knopf('ecke-wort', z, PROFIL.schrift === 'gross' ? 'groß' : 'normal', () => PROFIL.setze({ schrift: PROFIL.schrift === 'gross' ? 'normal' : 'gross' }), 'ecke-schrift|');
      hEl('span', 'ecke-trenn', z, ' · ');
      hEl('span', '', z, 'Ton ');
      knopf('ecke-wort', z, PROFIL.ton ? 'an' : 'aus', () => PROFIL.setze({ ton: !PROFIL.ton }), 'ecke-ton|');
      hEl('p', 'probe', ecke, 'Probe – speichert nicht');
    });
  }

  /* ---------------- Ortstexte nach Blick, Umfang, Niveau ---------------- */
  const normal = (t) => String(t || '').replace(/\s+/g, ' ').trim();
  function ortZT(ort) {
    const z = ZT();
    if (!z || !z.orte) return null;
    const t = z.orte[ort.titel] || z.orte[ort.titelBestand] || null;
    // gleicher Titel, anderer Ort (etwa zweimal „Hyperfokus“): nur nehmen, wenn das Original übereinstimmt
    if (t && t.original && t.original.kern && normal(t.original.kern) !== normal(ersterSatz(ort.kurz))) return null;
    return t;
  }
  function abschnittFassung(ort, abschnitt, text, niveau) {
    if (niveau === 'original') return { text, ki: false, fehlt: false, orig: text, niveau };
    const t = ortZT(ort);
    if (t && t[niveau]) {
      if ((abschnitt === 'Was Menschen beschreiben' || abschnitt === 'Kurztext') && t[niveau].mehr) return { text: t[niveau].mehr, ki: true, fehlt: false, orig: text, niveau };
      const o = String(t.original.ganz || '').split(/\n{2,}/);
      const v = String(t[niveau].ganz || '').split(/\n{2,}/);
      const j = o.findIndex((x) => x.startsWith(`${abschnitt}:`));
      if (j >= 0 && v[j] && o.length === v.length) return { text: v[j].replace(/^[^:]{2,48}:\s+/, ''), ki: true, fehlt: false, orig: text, niveau };
    }
    return { text, ki: false, fehlt: true, orig: text, niveau };
  }
  function blickTeile(ort, blick = PROFIL.blick, umfang = PROFIL.umfang, niveau = PROFIL.niveau) {
    const ab = (ort.blick && ort.blick[blick]) || [];
    if (!ab.length) return [];
    const wahl = umfang === 'ganz' ? ab : ab.slice(0, 1);
    return wahl.map((a, j) => {
      const f = abschnittFassung(ort, a.abschnitt, a.text, niveau);
      if (umfang === 'kern' && j === 0) return { ...f, abschnitt: a.abschnitt, text: ersterSatz(f.text), orig: ersterSatz(f.orig), gekuerzt: ersterSatz(f.text) !== f.text };
      return { ...f, abschnitt: a.abschnitt };
    });
  }
  function kurzFassung(ort, umfang = PROFIL.umfang, niveau = PROFIL.niveau) {
    const t = ortZT(ort);
    const orig = umfang === 'kern' ? ersterSatz(ort.kurz) : ort.kurz;
    if (niveau === 'original') return { text: orig, ki: false, fehlt: false, orig, niveau };
    const v = t && t[niveau];
    if (!v || !v.kern) return { text: orig, ki: false, fehlt: true, orig, niveau };
    return { text: umfang === 'kern' ? v.kern : v.mehr || v.kern, ki: true, fehlt: false, orig, niveau };
  }
  const KI_WORT = { einfach: 'einfache Sprache', alltag: 'Alltagssprache' };
  const FEHLT_WORT = { einfach: 'Einfache Fassung fehlt noch – hier steht das Original', alltag: 'Alltagsfassung fehlt noch – hier steht das Original' };
  /* Ein Text, der eine KI-Fassung sein kann: Halten zeigt das Original am selben Platz.
     Für Tastatur und Berührung gleichwertig: die Marke darunter schaltet das Original um. */
  function haltbarerText(eltern, teil, cls, schluessel) {
    const p = hEl('p', `${cls}${teil.ki ? ' haltbar' : ''}`, eltern, teil.text);
    if (teil.ki) {
      let timer = 0;
      const zeige = (an) => { p.textContent = an ? teil.orig : teil.text; p.classList.toggle('zeigt-original', an); if (m) { m.setAttribute('aria-pressed', String(an)); m.querySelector('.ki-griff').textContent = an ? ' · Original – loslassen oder tippen kehrt zurück' : ' · Original: Text halten oder hier tippen'; } };
      p.addEventListener('pointerdown', () => { clearTimeout(timer); timer = setTimeout(() => zeige(true), 280); });
      for (const ev of ['pointerup', 'pointerleave', 'pointercancel']) p.addEventListener(ev, () => { clearTimeout(timer); if (p.classList.contains('zeigt-original') && !p.dataset.fest) zeige(false); });
      const m = knopf('ki-marke', eltern, '', () => { const an = !p.classList.contains('zeigt-original'); p.dataset.fest = an ? '1' : ''; zeige(an); }, schluessel);
      hEl('span', '', m, `${KI_WORT[teil.niveau] || 'vereinfacht'} – KI-Entwurf`);
      hEl('span', 'ki-griff', m, ' · Original: Text halten oder hier tippen');
      m.setAttribute('aria-pressed', 'false');
      eltern.insertBefore(m, p);
    } else if (teil.fehlt) eltern.insertBefore(hEl('span', 'ki-fehlt', null, FEHLT_WORT[teil.niveau] || 'Fassung fehlt noch – hier steht das Original'), p);
    return p;
  }

  /* ================= Feld: Lage, Membranen, Nähte, Fehlstellen ================= */
  const FELD_ORTE = D.feld.orte.map(String);
  const FELD_PAARE = D.feld.paare.filter((i) => paar(i).fugen.length);
  const W = {};
  for (const k of FELD_ORTE) W[k] = { x: D.orte[k].feld.x, y: D.orte[k].feld.y };
  for (const g of D.feld.gebiete) {
    const f = g.heim ? 1.32 : 1.2;
    for (const k of FELD_ORTE) if (D.orte[k].gebiet === g.name) { W[k].x = g.mitte.x + (W[k].x - g.mitte.x) * f; W[k].y = g.mitte.y + (W[k].y - g.mitte.y) * f; }
  }
  {
    const heim = D.feld.gebiete.find((g) => g.heim);
    const imG = (g) => FELD_ORTE.filter((k) => D.orte[k].gebiet === g.name);
    const fest = imG(heim);
    const ABST = 1.6;
    const fremd = D.feld.gebiete.filter((g) => !g.heim).sort((a, b) => Math.hypot(a.mitte.x - heim.mitte.x, a.mitte.y - heim.mitte.y) - Math.hypot(b.mitte.x - heim.mitte.x, b.mitte.y - heim.mitte.y));
    for (const g of fremd) {
      const orte = imG(g);
      const dx = heim.mitte.x - g.mitte.x, dy = heim.mitte.y - g.mitte.y, l = Math.hypot(dx, dy) || 1;
      const ux = dx / l, uy = dy / l;
      const naechster = () => Math.min(...orte.flatMap((a) => fest.map((b) => Math.hypot(W[a].x - W[b].x, W[a].y - W[b].y))));
      let schritte = 0;
      while (naechster() > ABST && schritte++ < 400) for (const k of orte) { W[k].x += ux * 0.02; W[k].y += uy * 0.02; }
      schritte = 0;
      while (naechster() < ABST - 0.05 && schritte++ < 400) for (const k of orte) { W[k].x -= ux * 0.02; W[k].y -= uy * 0.02; }
      g.mitteNeu = { x: orte.reduce((a, k) => a + W[k].x, 0) / orte.length, y: orte.reduce((a, k) => a + W[k].y, 0) / orte.length };
      fest.push(...orte);
    }
    heim.mitteNeu = { ...heim.mitte };
  }
  const welt = (() => {
    const xs = FELD_ORTE.map((k) => W[k].x), ys = FELD_ORTE.map((k) => W[k].y);
    return { x0: Math.min(...xs) - 1.3, x1: Math.max(...xs) + 1.3, y0: Math.min(...ys) - 1.3, y1: Math.max(...ys) + 1.3 };
  })();
  const GEBIETE = D.feld.gebiete.map((g) => ({ ...g, mitte: g.mitteNeu || g.mitte, orte: FELD_ORTE.filter((k) => D.orte[k].gebiet === g.name) }));

  // Fehlstellen: hohle Stelle neben den genannten Orten, nach außen; mehrere am selben Ort fächern auf
  const FEHL = (D.fehlstellen || []).map((f, k) => {
    const orte = f.orte.map(String).filter((x) => W[x]);
    const g = GEBIETE.find((x) => x.name === f.gebiet);
    const cx = orte.reduce((a, x) => a + W[x].x, 0) / orte.length, cy = orte.reduce((a, x) => a + W[x].y, 0) / orte.length;
    const geschwister = (D.fehlstellen || []).map((x, j) => ({ x, j })).filter(({ x }) => x.orte.join() === f.orte.join());
    const rang = geschwister.findIndex(({ j }) => j === k), anzahl = geschwister.length;
    let w = Math.atan2(cy - (g ? g.mitte.y : 0), cx - (g ? g.mitte.x : 0));
    w += (rang - (anzahl - 1) / 2) * 0.75;
    const gegen = f.gegenueber ? `${f.gegenueber.titel} (${f.gegenueber.gebiet})` : '';
    return { ...f, k, orte, gegen, c: { x: cx + Math.cos(w) * 0.66, y: cy + Math.sin(w) * 0.66 }, r: 0.24 };
  });

  // Membranen: weiche Vereinigung von Kreisen je Gebiet, gegen die Nachbargebiete mit einer schmalen Fuge
  const MEMBRAN = (() => {
    const R = 1.12, sig = 0.3, spalt = 0.16, st = 0.06;
    const nx = Math.ceil((welt.x1 - welt.x0) / st) + 1, ny = Math.ceil((welt.y1 - welt.y0) / st) + 1;
    const fG = GEBIETE.map(() => new Float32Array(nx * ny));
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const x = welt.x0 + i * st, y = welt.y0 + j * st;
      GEBIETE.forEach((g, gi) => {
        let s = 0;
        for (const k of g.orte) s += Math.exp((R - Math.hypot(x - W[k].x, y - W[k].y)) / sig);
        fG[gi][j * nx + i] = s > 0 ? sig * Math.log(s) : -9;
      });
    }
    const pfade = GEBIETE.map((g, gi) => {
      const v = new Float32Array(nx * ny);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const n = j * nx + i;
        let andere = -9;
        GEBIETE.forEach((_, h) => { if (h !== gi) andere = Math.max(andere, fG[h][n]); });
        let w = Math.min(fG[gi][n], fG[gi][n] - andere - spalt);
        const x = welt.x0 + i * st, y = welt.y0 + j * st;
        for (const f of FEHL) if (f.gebiet === g.name) w = Math.min(w, Math.hypot(x - f.c.x, y - f.c.y) - f.r);
        if (i === 0 || j === 0 || i === nx - 1 || j === ny - 1) w = -1;
        v[n] = w;
      }
      return konturen(v, nx, ny, welt.x0, welt.y0, st).map((l) => chaikin(chaikin(l)));
    });
    return { fG, nx, ny, st, pfade };
  })();
  function feldWert(gi, x, y) {
    const { nx, ny, st, fG } = MEMBRAN;
    const i = clamp(Math.round((x - welt.x0) / st), 0, nx - 1), j = clamp(Math.round((y - welt.y0) / st), 0, ny - 1);
    return fG[gi][j * nx + i];
  }
  function konturen(v, nx, ny, x0, y0, st) {
    const nach = new Map();
    const pkt = new Map();
    const P = (i, j) => v[j * nx + i];
    const kante = (typ, i, j) => {
      const key = `${typ}${i},${j}`;
      if (!pkt.has(key)) {
        let x, y;
        if (typ === 'h') { const a = P(i, j), b = P(i + 1, j); const t = a / (a - b); x = x0 + (i + t) * st; y = y0 + j * st; }
        else { const a = P(i, j), b = P(i, j + 1); const t = a / (a - b); x = x0 + i * st; y = y0 + (j + t) * st; }
        pkt.set(key, [x, y]);
      }
      return key;
    };
    const verbinde = (a, b) => {
      if (!nach.has(a)) nach.set(a, []);
      if (!nach.has(b)) nach.set(b, []);
      nach.get(a).push(b); nach.get(b).push(a);
    };
    for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
      const idx = (a > 0 ? 8 : 0) | (b > 0 ? 4 : 0) | (c > 0 ? 2 : 0) | (d > 0 ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const T = () => kante('h', i, j), B = () => kante('h', i, j + 1), L = () => kante('v', i, j), R = () => kante('v', i + 1, j);
      const mitte = (a + b + c + d) / 4 > 0;
      switch (idx) {
        case 1: case 14: verbinde(L(), B()); break;
        case 2: case 13: verbinde(B(), R()); break;
        case 3: case 12: verbinde(L(), R()); break;
        case 4: case 11: verbinde(T(), R()); break;
        case 6: case 9: verbinde(T(), B()); break;
        case 7: case 8: verbinde(T(), L()); break;
        case 5: if (mitte) { verbinde(T(), R()); verbinde(L(), B()); } else { verbinde(T(), L()); verbinde(B(), R()); } break;
        case 10: if (mitte) { verbinde(T(), L()); verbinde(B(), R()); } else { verbinde(T(), R()); verbinde(L(), B()); } break;
        default: break;
      }
    }
    const besucht = new Set();
    const schleifen = [];
    for (const start of nach.keys()) {
      if (besucht.has(start)) continue;
      const l = [];
      let vor = null, cur = start;
      while (cur && !besucht.has(cur)) {
        besucht.add(cur);
        l.push(pkt.get(cur));
        const nb = nach.get(cur).find((x) => x !== vor && !besucht.has(x));
        vor = cur; cur = nb;
      }
      if (l.length > 6) schleifen.push(l);
    }
    return schleifen;
  }
  function chaikin(l) {
    const out = [];
    for (let i = 0; i < l.length; i++) {
      const a = l[i], b = l[(i + 1) % l.length];
      out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    return out;
  }

  // Nähte: für jedes Gebietspaar mit Fugen über die Grenze ein Ort „Zwischen A und B“, auf der Naht selbst
  const NAEHTE = (() => {
    const m = new Map();
    for (const i of FELD_PAARE) {
      const p = paar(i);
      if (p.A.gebiet === p.B.gebiet) continue;
      const [g1, g2] = [p.A.gebiet, p.B.gebiet].sort((x, y) => (D.feld.gebiete.findIndex((g) => g.name === x) - D.feld.gebiete.findIndex((g) => g.name === y)));
      const k = `${g1}|${g2}`;
      if (!m.has(k)) m.set(k, { k, a: g1, b: g2, paare: [] });
      m.get(k).paare.push(i);
    }
    const out = [...m.values()];
    for (const n of out) {
      const ga = GEBIETE.findIndex((g) => g.name === n.a), gb = GEBIETE.findIndex((g) => g.name === n.b);
      const punkte = n.paare.map((i) => {
        const p = paar(i);
        const P = p.A.gebiet === n.a ? W[p.a] : W[p.b], Q = p.A.gebiet === n.a ? W[p.b] : W[p.a];
        let lo = 0, hi = 1;
        for (let r = 0; r < 24; r++) {
          const t = (lo + hi) / 2, x = P.x + (Q.x - P.x) * t, y = P.y + (Q.y - P.y) * t;
          if (feldWert(ga, x, y) > feldWert(gb, x, y)) lo = t; else hi = t;
        }
        const t = (lo + hi) / 2;
        return { x: P.x + (Q.x - P.x) * t, y: P.y + (Q.y - P.y) * t };
      });
      n.c = { x: punkte.reduce((a, q) => a + q.x, 0) / punkte.length, y: punkte.reduce((a, q) => a + q.y, 0) / punkte.length };
      const A = GEBIETE[ga].mitte, B = GEBIETE[gb].mitte;
      const l = Math.hypot(B.x - A.x, B.y - A.y) || 1;
      n.quer = { x: -(B.y - A.y) / l, y: (B.x - A.x) / l };
      n.laengs = { x: (B.x - A.x) / l, y: (B.y - A.y) / l };
    }
    return out;
  })();

  /* ---------------- Arme: einer je echter Fuge ---------------- */
  const ARME = [];
  for (const i of FELD_PAARE) {
    const p = paar(i);
    const richtungen = new Set(p.fugen.map((f) => f.vomSchloss));
    const zaehl = { true: 0, false: 0 };
    for (const f of p.fugen) {
      const vonA = f.vomSchloss;
      ARME.push({ n: ARME.length, i, f, von: String(vonA ? p.a : p.b), zu: String(vonA ? p.b : p.a), vonA, beide: richtungen.size === 2, nr: zaehl[vonA]++, len: 0, tween: null });
    }
  }
  const armeAm = (k) => ARME.filter((a) => a.von === k || a.zu === k);
  const ersterArm = (i) => ARME.find((x) => x.i === i && (!x.beide || x.vonA)) || ARME.find((x) => x.i === i);

  // Form des Arms: Lesart der Fuge; hat der Mensch im Schloss eine andere Lesart gewählt, die gewählte
  function armArt(a) {
    const e = ein(a.i);
    if (e.lesart > 0) return paar(a.i).lesarten[e.lesart].art;
    return a.f.art;
  }
  const armArtWort = (a) => { const e = ein(a.i); return e.lesart > 0 ? paar(a.i).lesarten[e.lesart].artWort : a.f.artWort; };
  const FORM_NAME = {
    spannung: 'Zickzack – Gegenpol, Spannung', widerspruch: 'Doppelstrich mit Kreuz – Widerspruch', annaeherung: 'geflochtenes Band – Nähe',
    zusammenhang: 'lose Stichlinie – könnte zusammenhängen', abstand: 'gerade Schattenfuge – Abstand', begrenzung: 'gerade Schattenfuge – Begrenzung',
    uebergang: 'Strömung mit Winkeln – Übergang', bedingung: 'Schwelle am Ende – Bedingung', aussage: 'Linie mit Raute – Aussage',
    einordnung: 'Linie mit Raute – Einordnung', offen: 'Ring am Ende – offene Frage',
  };

  /* ---------------- Kamera ---------------- */
  const CAM = { cx: 0, cy: 0, k: 1, ziel: null, basis: null };
  let FL = { x: 0, y: 0, w: 100, h: 100 };
  const schmal = () => FL.w < 600;
  function messeFeld() {
    if (window.innerWidth < 700) {
      const bw = welt.x1 - welt.x0, bh = welt.y1 - welt.y0;
      feldFlaeche.style.height = `${Math.round(clamp(window.innerWidth * (bh / bw) + 70, 400, window.innerHeight * 0.75))}px`;
    } else feldFlaeche.style.height = '';
    const r = feldFlaeche.getBoundingClientRect();
    FL = { x: 0, y: 0, w: r.width, h: r.height };
    svg.setAttribute('viewBox', `0 0 ${f1(r.width)} ${f1(r.height)}`);
    // Rand: unten Platz für den Schlüsselbart „Unter welcher Voraussetzung?“
    const rand = r.width < 600 ? { l: 12, r: 12, o: 30, u: 30 } : { l: 60, r: 120, o: 40, u: 46 };
    const bw = welt.x1 - welt.x0, bh = welt.y1 - welt.y0;
    const k = Math.min((r.width - rand.l - rand.r) / bw, (r.height - rand.o - rand.u) / bh);
    const cx = (welt.x0 + welt.x1) / 2 - ((rand.l - rand.r) / 2) / k, cy = (welt.y0 + welt.y1) / 2 - ((rand.o - rand.u) / 2) / k;
    CAM.basis = { cx, cy, k };
    camZiel(true);
  }
  function camZiel(sofort) {
    let z = { ...CAM.basis };
    const w = S.wahl;
    if (w && w.art === 'ort') { const p = W[w.k]; z = { cx: p.x, cy: p.y + (schmal() ? 0.2 : 0.1), k: CAM.basis.k * (schmal() ? 2.0 : 1.75) }; }
    else if (w && w.art === 'naht') { const n = NAEHTE.find((x) => x.k === w.k); z = { cx: n.c.x, cy: n.c.y, k: CAM.basis.k * 1.45 }; }
    else if (w && w.art === 'fehl') { const f = FEHL[w.k]; z = { cx: f.c.x, cy: f.c.y, k: CAM.basis.k * 1.6 }; }
    else if (w && w.art === 'fuge') { const p = paar(w.k); z = { cx: (W[p.a].x + W[p.b].x) / 2, cy: (W[p.a].y + W[p.b].y) / 2 + 0.15, k: CAM.basis.k * (schmal() ? 1.9 : 1.8) }; }
    const halbW = FL.w / 2 / z.k, halbH = FL.h / 2 / z.k;
    if (z.k > CAM.basis.k) {
      z.cx = clamp(z.cx, welt.x0 + halbW - 0.6, welt.x1 - halbW + 0.6);
      z.cy = clamp(z.cy, welt.y0 + halbH - 0.6, welt.y1 - halbH + 0.9);
    }
    CAM.ziel = z;
    if (sofort || !lebendig()) { CAM.cx = z.cx; CAM.cy = z.cy; CAM.k = z.k; }
    lauf();
  }
  const sx = (x) => FL.w / 2 + (x - CAM.cx) * CAM.k;
  const sy = (y) => FL.h / 2 + (y - CAM.cy) * CAM.k;
  const zoomStufe = () => CAM.k / CAM.basis.k;

  /* ================= Feld zeichnen ================= */
  GEBIETE.forEach((g, gi) => {
    const c = farbeG(g.name);
    const rg = sEl('radialGradient', { id: `mem${gi}`, cx: '50%', cy: '42%', r: '70%' }, defs);
    sEl('stop', { offset: '0%', 'stop-color': '#ffffff' }, rg);
    sEl('stop', { offset: '45%', 'stop-color': c.licht }, rg);
    sEl('stop', { offset: '100%', 'stop-color': c.hauch }, rg);
    const kg = sEl('radialGradient', { id: `leib${gi}`, cx: '38%', cy: '32%', r: '78%' }, defs);
    sEl('stop', { offset: '0%', 'stop-color': '#ffffff' }, kg);
    sEl('stop', { offset: '55%', 'stop-color': c.licht }, kg);
    sEl('stop', { offset: '100%', 'stop-color': c.hauch }, kg);
  });
  {
    const fl = sEl('filter', { id: 'weich', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    sEl('feGaussianBlur', { stdDeviation: '5' }, fl);
    const fl2 = sEl('filter', { id: 'hauch', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    sEl('feGaussianBlur', { stdDeviation: '2.2' }, fl2);
    const sch = sEl('filter', { id: 'schatten', x: '-40%', y: '-40%', width: '180%', height: '180%' }, defs);
    sEl('feDropShadow', { dx: '0', dy: '2', stdDeviation: '2.6', 'flood-color': '#1b2440', 'flood-opacity': '0.16' }, sch);
    const gl = sEl('filter', { id: 'glimm', x: '-20%', y: '-60%', width: '140%', height: '220%' }, defs);
    sEl('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: '3', result: 'b' }, gl);
    sEl('feFlood', { 'flood-color': '#ffd24a', 'flood-opacity': '0.75' }, gl);
    sEl('feComposite', { in2: 'b', operator: 'in', result: 'g' }, gl);
    const mg = sEl('feMerge', {}, gl);
    sEl('feMergeNode', { in: 'g' }, mg);
    sEl('feMergeNode', { in: 'SourceGraphic' }, mg);
    const verlauf = (id, stops, x2 = '0', y2 = '1') => { const lg = sEl('linearGradient', { id, x1: '0', y1: '0', x2, y2 }, defs); stops.forEach(([o, c]) => sEl('stop', { offset: o, 'stop-color': c }, lg)); };
    verlauf('stahl', [['0', '#6a7396'], ['0.45', '#454d70'], ['1', '#262c4a']], '1', '0');
    verlauf('messing', [['0', '#ffe27a'], ['0.5', '#f2b300'], ['1', '#c48a00']], '1', '0');
    verlauf('grau', [['0', '#e4e7f0'], ['0.5', '#cdd2e0'], ['1', '#aeb4c8']], '1', '0');
    verlauf('kern', [['0', '#ffffff'], ['0.55', '#f1f3f9'], ['1', '#d9deea']]);
    verlauf('kernGold', [['0', '#fffbe8'], ['0.55', '#fff1c2'], ['1', '#f0d68a']]);
    verlauf('gehaeuse', [['0', '#f6f7fb'], ['1', '#e2e5ef']]);
    const pat = sEl('pattern', { id: 'schraffur', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    sEl('rect', { width: 6, height: 6, fill: '#5b6380' }, pat);
    sEl('rect', { width: 2.4, height: 6, fill: '#c3c8d8' }, pat);
  }
  // Je Arm ein Verlauf für die Deckkraft: dicht bis zur Regelreichweite, dann ausfransend bis zum Treffpunkt
  const VERLAUF = ARME.map((a) => {
    const lg = sEl('linearGradient', { id: `fv${a.n}`, gradientUnits: 'userSpaceOnUse' }, defs);
    const stops = [0, 1, 2, 3].map(() => sEl('stop', {}, lg));
    return { lg, stops };
  });
  GEBIETE.map((g, gi) => {
    const d = MEMBRAN.pfade[gi].map((l) => `M${l.map((q) => `${f1(q[0] * 100)},${f1(q[1] * 100)}`).join('L')}Z`).join('');
    const c = farbeG(g.name);
    const grp = sEl('g', { class: 'membran' }, gMembran);
    sEl('path', { d, class: 'membran-rand', fill: 'none', stroke: c.tief, 'stroke-opacity': '0.10', 'stroke-width': '16', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' }, grp);
    sEl('path', { d, class: 'membran-flaeche', fill: `url(#mem${gi})`, 'fill-rule': 'evenodd', stroke: c.tief, 'stroke-opacity': '0.42', 'stroke-width': '1.6', 'vector-effect': 'non-scaling-stroke' }, grp);
    sEl('path', { d, class: 'membran-glanz', fill: 'none', stroke: '#ffffff', 'stroke-opacity': '0.9', 'stroke-width': '3', transform: 'translate(0,1.2)', 'vector-effect': 'non-scaling-stroke' }, grp);
    return grp;
  });

  function armGeo(a) {
    const p = paar(a.i);
    const A = W[p.a], B = W[p.b];
    const ax = sx(A.x), ay = sy(A.y), bx = sx(B.x), by = sy(B.y);
    const L = Math.hypot(bx - ax, by - ay) || 1;
    const nxv = -(by - ay) / L, nyv = (bx - ax) / L;
    // Die Bahn selbst ist gerade (zweite Fuge in dieselbe Richtung: leicht gebogen); das Organische kommt aus den Fasern
    const biege = a.nr * 0.12;
    const cx = (ax + bx) / 2 + nxv * L * biege, cy = (ay + by) / 2 + nyv * L * biege;
    return { ax, ay, bx, by, cx, cy, L };
  }
  const bez = (g, t) => { const u = 1 - t; return [u * u * g.ax + 2 * u * t * g.cx + t * t * g.bx, u * u * g.ay + 2 * u * t * g.cy + t * t * g.by]; };
  const koerperR = () => (schmal() ? clamp(11 * Math.sqrt(zoomStufe()), 10, 19) : clamp(17 * Math.sqrt(zoomStufe()), 16, 29));

  /* ---------------- Körper: Umriss aus dem Fugenprofil ----------------
     Je Fuge eine Ausbuchtung in Richtung des Partners: verbindende Lesarten (Nähe, Zusammenhang, Übergang …)
     weich gerundet, trennende (Gegenpol, Widerspruch, Abstand) als Kerbe, eine offene Frage als Delle mit Ring.
     Grundform nach Ortsart (Phänomen rund, Begriff sechsfach, Methode eckig, Kapitel oval). Die Größe ist für alle
     Orte gleich – nie aus Textmenge oder Zahl der Fugen. */
  const GRUNDFORM = { 'Phänomen': 'rund', Begriff: 'sechs', Modell: 'sechs', Methode: 'eckig', Praxis: 'eckig', 'Übung': 'eckig', Instrument: 'eckig', Weg: 'eckig', Befund: 'oval', Forschung: 'oval', Quelle: 'oval', Kapitel: 'oval', Szene: 'oval', Kontext: 'drei', Erfahrungsfeld: 'drei', Gruppe: 'drei', Dimension: 'drei', Perspektive: 'drei' };
  function grund(form, th) {
    if (form === 'sechs') return 1 + 0.07 * Math.cos(6 * th);
    if (form === 'eckig') { const c = Math.abs(Math.cos(th)), s = Math.abs(Math.sin(th)); return 0.95 / Math.pow(c ** 4 + s ** 4, 0.25); }
    if (form === 'oval') return 1 / Math.sqrt((Math.cos(th) / 1.16) ** 2 + (Math.sin(th) / 0.86) ** 2);
    if (form === 'drei') return 1 + 0.08 * Math.cos(3 * th + Math.PI / 2);
    return 1;
  }
  const winkelAbst = (a, b) => { let d = a - b; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };
  function beule(art, d) {
    if (art === 'offen') return -0.24 * Math.exp(-((d / 0.34) ** 2));
    if (TRENNEND.has(art)) return -0.36 * Math.max(0, 1 - Math.abs(d) / 0.2) + 0.13 * Math.exp(-(((Math.abs(d) - 0.33) / 0.13) ** 2));
    return 0.44 * Math.exp(-((d / 0.42) ** 2));
  }
  let FORMEN = {};
  function baueFormen() {
    FORMEN = {};
    const R = koerperR();
    FELD_ORTE.forEach((k, idx) => {
      const o = D.orte[k];
      const beulen = [];
      for (const a of armeAm(k)) {
        if (a.beide && a.von !== k) continue; // beidseitig: je Ort sein eigener Arm
        const g = armGeo(a);
        const amA = String(paar(a.i).a) === k;
        const px = amA ? g.ax : g.bx, py = amA ? g.ay : g.by;
        beulen.push({ th: Math.atan2(g.cy - py, g.cx - px), art: a.f.art, a });
      }
      FORMEN[k] = { k, idx, x: sx(W[k].x), y: sy(W[k].y), R, beulen, grund: GRUNDFORM[o.ortsart] || 'rund' };
    });
  }
  function radius(form, th, phase = null) {
    let r = grund(form.grund, th);
    for (const b of form.beulen) r += beule(b.art, winkelAbst(th, b.th));
    if (phase !== null) r *= 1 + 0.045 * Math.sin(phase + th * 2 + form.idx);
    return form.R * clamp(r, 0.56, 1.6);
  }
  function umrissPfad(form, phase, skala = 1) {
    const n = 72, pk = [];
    for (let s = 0; s < n; s++) { const th = (s / n) * Math.PI * 2; const r = radius(form, th, phase) * skala; pk.push([form.x + Math.cos(th) * r, form.y + Math.sin(th) * r]); }
    let d = '';
    for (let s = 0; s < n; s++) {
      const a = pk[s], b = pk[(s + 1) % n];
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      d += s === 0 ? `M${f1(m[0])},${f1(m[1])}` : `Q${f1(a[0])},${f1(a[1])} ${f1(m[0])},${f1(m[1])}`;
    }
    const a = pk[0], m = [(pk[0][0] + pk[1][0]) / 2, (pk[0][1] + pk[1][1]) / 2];
    return `${d}Q${f1(a[0])},${f1(a[1])} ${f1(m[0])},${f1(m[1])}Z`;
  }

  /* ---------------- Faserbahn ----------------
     Ein Arm läuft vom Rand seines Körpers bis zum Treffpunkt: bei beidseitigen Fugen die Mitte,
     sonst der Rand des Partners. Wie weit er DICHT bleibt (a.len, Anteil der Bahn), folgt nur dem
     Regelzustand (armZiel); danach franst er aus und verblasst bis zum Treffpunkt. Der Abstand entscheidet nie. */
  function armZiel(a) {
    const e = ein(a.i);
    if (e.eingerastet) return 1;
    if (S.voraus && fehltNur(a.i, S.voraus)) return 0.92;
    if (S.voraus && fehltMitEinem(a.i, S.voraus)) return 0.76;
    if (e.entscheidung === 'bestritten') return 0.3;
    if (spaltBleibt(a.i)) return 0.3;
    const z = bewerte(a.i);
    return z.fehlend.length <= 1 ? 0.62 : z.fehlend.length === 2 ? 0.5 : 0.4;
  }
  function bahn(a, g) {
    const vonF = FORMEN[a.von], zuF = FORMEN[a.zu];
    const amA = a.vonA;
    const [px, py] = amA ? [g.ax, g.ay] : [g.bx, g.by];
    const thV = Math.atan2(g.cy - py, g.cx - px);
    const r0 = vonF ? radius(vonF, thV) * 0.9 : 12;
    const [qx, qy] = amA ? [g.bx, g.by] : [g.ax, g.ay];
    const thZ = Math.atan2(g.cy - qy, g.cx - qx);
    const r1 = zuF ? radius(zuF, thZ) * 0.95 : 12;
    const t0 = r0 / g.L, tEnde = a.beide ? 0.5 : 1 - r1 / g.L;
    const pk = [];
    const lang = Math.max(1, (tEnde - t0) * g.L);
    const n = Math.max(8, Math.ceil(lang / 5));
    for (let s = 0; s <= n; s++) { const tt = t0 + ((tEnde - t0) * s) / n; pk.push(bez(g, amA ? tt : 1 - tt)); }
    return pk;
  }
  const pfadAus = (pk) => `M${pk.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L')}`;
  function normale(pk, s) {
    const a = pk[Math.max(0, s - 1)], b = pk[Math.min(pk.length - 1, s + 1)];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l, (b[0] - a[0]) / l, (b[1] - a[1]) / l];
  }
  function bogenLaenge(pk) { let s = 0; for (let i = 1; i < pk.length; i++) s += Math.hypot(pk[i][0] - pk[i - 1][0], pk[i][1] - pk[i - 1][1]); return s; }
  function punktBei(pk, d) {
    let s = 0;
    for (let i = 1; i < pk.length; i++) {
      const l = Math.hypot(pk[i][0] - pk[i - 1][0], pk[i][1] - pk[i - 1][1]);
      if (s + l >= d) { const t = (d - s) / (l || 1); return { p: [pk[i - 1][0] + (pk[i][0] - pk[i - 1][0]) * t, pk[i - 1][1] + (pk[i][1] - pk[i - 1][1]) * t], s: i }; }
      s += l;
    }
    return { p: pk[pk.length - 1], s: pk.length - 1 };
  }
  const teilBahn = (pk, u) => pk.slice(0, Math.max(2, Math.round(u * (pk.length - 1)) + 1));

  // Fasermuster je Lesart (leise im Überblick): Nähe geflochten, Zusammenhang lose, Gegenpol gezackt, Abstand parallel mit Spalt
  function muster(art, d, j, phase) {
    if (art === 'annaeherung') return Math.sin(d / 7 + j * Math.PI / 2 + phase) * 1.7;
    if (art === 'zusammenhang') return Math.sin(d / 19 + j * 1.3 + phase) * 2.6;
    if (TRENNEND.has(art)) return art === 'abstand' || art === 'begrenzung' ? 0 : ((Math.floor(d / 6) % 2) ? 1.3 : -1.3);
    return Math.sin(d / 13 + j + phase) * 0.9;
  }
  const FASERN = 4;
  function zeichneFasern(grp, a, pk, len, c, opt) {
    const n = pk.length;
    const art = armArt(a);
    const spalt = art === 'abstand' || art === 'begrenzung' ? 2.3 : 1.15;
    const leb = lebendig();
    const phase = leb ? zeit / 1300 + a.n * 0.7 : 0;
    const wiege = leb ? 4.2 * Math.sin(zeit / 1500 + a.n * 1.3) : 0; // ganzer Arm wiegt in Ruhe
    const ausfrans = opt.ausfrans;
    const dPk = []; let acc = 0;
    for (let s = 0; s < n; s++) { if (s) acc += Math.hypot(pk[s][0] - pk[s - 1][0], pk[s][1] - pk[s - 1][1]); dPk.push(acc); }
    const lang = acc || 1;
    // Verlauf: Deckkraft dicht bis len, dann ausfransend bis zum Treffpunkt
    const v = VERLAUF[a.n];
    setzeAttr(v.lg, { x1: f1(pk[0][0]), y1: f1(pk[0][1]), x2: f1(pk[n - 1][0]), y2: f1(pk[n - 1][1]) });
    const op = opt.deckkraft;
    const st = len >= 0.995 ? [[0, op], [0.5, op], [0.9, op], [1, op]] : [[0, op], [len, op], [Math.min(1, len + (1 - len) * 0.45), op * (opt.stark ? 0.45 : 0.14)], [1, opt.stark ? op * 0.12 : 0]];
    v.stops.forEach((s, j) => setzeAttr(s, { offset: f1(st[j][0] * 1000) / 1000, 'stop-color': c, 'stop-opacity': f1(st[j][1] * 100) / 100 }));
    const enden = [];
    const nF = opt.fasern || FASERN;
    for (let j = 0; j < nF; j++) {
      const o = j - (nF - 1) / 2;
      const q = pk.map((p, s) => {
        const u = s / (n - 1);
        const [nx, ny] = normale(pk, s);
        let off = o * spalt + muster(art, dPk[s], j, phase) * Math.min(1, u * 5);
        off += (wiege + Math.min(4, lang * 0.02) * (a.vonA ? 1 : -1)) * Math.sin(u * Math.PI);
        if (u > len && ausfrans) {
          const f = (u - len) / Math.max(0.001, 1 - len);
          off += o * Math.pow(f, 1.2) * 13 + Math.sin(f * 5 + j * 2.1 + phase) * f * 6;
        }
        off *= Math.min(1, u * 4 + 0.3);
        return [p[0] + nx * off, p[1] + ny * off];
      });
      sEl('path', { d: pfadAus(q), fill: 'none', stroke: `url(#fv${a.n})`, 'stroke-width': opt.faser, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, grp);
      enden.push(q[q.length - 1]);
    }
    // Knötchen entlang des dichten Teils, Sporen an den ausfransenden Enden
    const dichtBis = lang * len;
    if (!opt.ohneKnoten) for (let d = 10; d < dichtBis - 4; d += opt.stark ? 13 : 18) {
      const { p, s } = punktBei(pk, d);
      const [nx, ny] = normale(pk, s);
      const off = wiege * Math.sin((d / lang) * Math.PI);
      sEl('circle', { cx: f1(p[0] + nx * off), cy: f1(p[1] + ny * off), r: f1(opt.knoten), fill: c, 'fill-opacity': f1(op * 0.9) }, grp);
    }
    if (len < 0.995 && ausfrans) for (const q of enden) sEl('circle', { cx: f1(q[0]), cy: f1(q[1]), r: '1.4', fill: c, 'fill-opacity': '0.28' }, grp);
    // lebendig: die dichten Fasern leuchten (ruhig: nur Form)
    if (leb && opt.glimm) sEl('path', { d: pfadAus(teilBahn(pk, len)), fill: 'none', stroke: opt.stark ? '#8fa0ff' : c, 'stroke-opacity': opt.stark ? '0.38' : '0.22', 'stroke-width': opt.stark ? '11' : '8', 'stroke-linecap': 'round', filter: 'url(#weich)' }, grp);
  }
  function setzeAttr(el, attrs) { for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v); }

  // Ein Arm in seiner vollen Strichform (beim Heranzoomen, Antippen, Darüberfahren)
  function zeichneArmForm(grp, pk, art, farbe, breite, phase, mitQuelle, attrs = {}) {
    if (pk.length < 2) return;
    const lang = bogenLaenge(pk);
    const strich = (d, a2 = {}) => sEl('path', { d, fill: 'none', stroke: farbe, 'stroke-width': breite, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs, ...a2 }, grp);
    if (art === 'annaeherung') {
      const links = [], rechts = [];
      pk.forEach((q, s) => {
        const [nx, ny] = normale(pk, s);
        const t = s / (pk.length - 1);
        const w = breite * (1.25 - 0.75 * t);
        const off = Math.sin(t * Math.PI * 2 + phase) * breite * 0.55 * Math.sin(t * Math.PI);
        links.push([q[0] + nx * (w + off), q[1] + ny * (w + off)]);
        rechts.push([q[0] - nx * (w - off), q[1] - ny * (w - off)]);
      });
      sEl('path', { d: `${pfadAus(links)}L${rechts.reverse().map((q) => `${f1(q[0])},${f1(q[1])}`).join('L')}Z`, fill: farbe, 'fill-opacity': '0.78', stroke: farbe, 'stroke-width': '0.8', 'stroke-linejoin': 'round', ...attrs }, grp);
    } else if (art === 'spannung') {
      const z = [];
      for (let d = 0, k = 0; d <= lang; d += 7, k++) {
        const { p, s } = punktBei(pk, d);
        const [nx, ny] = normale(pk, s);
        const amp = d < 4 ? 0 : (k % 2 ? 1 : -1) * breite * 1.9;
        z.push([p[0] + nx * amp, p[1] + ny * amp]);
      }
      z.push(pk[pk.length - 1]);
      strich(pfadAus(z), { 'stroke-width': breite * 0.95 });
    } else if (art === 'widerspruch') {
      for (const o of [-1, 1]) strich(pfadAus(pk.map((q, s) => { const [nx, ny] = normale(pk, s); return [q[0] + nx * o * breite * 0.9, q[1] + ny * o * breite * 0.9]; })), { 'stroke-width': breite * 0.6 });
      const { p, s } = punktBei(pk, lang * 0.55);
      const [nx, ny, tx, ty] = normale(pk, s);
      const r = breite * 2.2;
      strich(`M${f1(p[0] - (nx + tx) * r)},${f1(p[1] - (ny + ty) * r)}L${f1(p[0] + (nx + tx) * r)},${f1(p[1] + (ny + ty) * r)}M${f1(p[0] - (nx - tx) * r)},${f1(p[1] - (ny - ty) * r)}L${f1(p[0] + (nx - tx) * r)},${f1(p[1] + (ny - ty) * r)}`, { 'stroke-width': breite * 0.7 });
    } else if (art === 'abstand' || art === 'begrenzung') {
      strich(pfadAus(pk.map((q, s) => { const [nx, ny] = normale(pk, s); return [q[0] + nx * breite * 1.6, q[1] + ny * breite * 1.6]; })), { 'stroke-width': breite * 0.55, 'stroke-opacity': '0.35' });
      strich(pfadAus(pk), { 'stroke-width': breite * 0.8 });
      const q = pk[pk.length - 1];
      const [nx, ny] = normale(pk, pk.length - 1);
      strich(`M${f1(q[0] - nx * breite * 2.4)},${f1(q[1] - ny * breite * 2.4)}L${f1(q[0] + nx * breite * 2.4)},${f1(q[1] + ny * breite * 2.4)}`, { 'stroke-width': breite * 0.9, 'stroke-linecap': 'butt' });
    } else if (art === 'zusammenhang') {
      strich(pfadAus(pk), { 'stroke-dasharray': `${breite * 2.2} ${breite * 2.2}`, 'stroke-width': breite * 0.85 });
    } else if (art === 'uebergang') {
      strich(pfadAus(pk), { 'stroke-width': breite * 0.7 });
      for (let d = 10; d < lang - 4; d += 14) {
        const { p, s } = punktBei(pk, d);
        const [nx, ny, tx, ty] = normale(pk, s);
        const r = breite * 1.9;
        strich(`M${f1(p[0] - tx * r + nx * r)},${f1(p[1] - ty * r + ny * r)}L${f1(p[0])},${f1(p[1])}L${f1(p[0] - tx * r - nx * r)},${f1(p[1] - ty * r - ny * r)}`, { 'stroke-width': breite * 0.65 });
      }
    } else if (art === 'bedingung') {
      strich(pfadAus(pk), { 'stroke-width': breite * 0.8 });
      const q = pk[pk.length - 1];
      const [nx, ny, tx, ty] = normale(pk, pk.length - 1);
      const r = breite * 2.6;
      strich(`M${f1(q[0] - nx * r)},${f1(q[1] - ny * r)}L${f1(q[0] + nx * r)},${f1(q[1] + ny * r)}M${f1(q[0] - nx * r - tx * 3)},${f1(q[1] - ny * r - ty * 3)}L${f1(q[0] - nx * r)},${f1(q[1] - ny * r)}M${f1(q[0] + nx * r - tx * 3)},${f1(q[1] + ny * r - ty * 3)}L${f1(q[0] + nx * r)},${f1(q[1] + ny * r)}`, { 'stroke-width': breite * 0.9 });
    } else if (art === 'aussage' || art === 'einordnung') {
      strich(pfadAus(pk), { 'stroke-width': breite * 0.8 });
      const { p, s } = punktBei(pk, lang * 0.55);
      const [nx, ny, tx, ty] = normale(pk, s);
      const r = breite * 2.1;
      sEl('path', { d: `M${f1(p[0] + tx * r)},${f1(p[1] + ty * r)}L${f1(p[0] + nx * r * 0.7)},${f1(p[1] + ny * r * 0.7)}L${f1(p[0] - tx * r)},${f1(p[1] - ty * r)}L${f1(p[0] - nx * r * 0.7)},${f1(p[1] - ny * r * 0.7)}Z`, fill: '#ffffff', stroke: farbe, 'stroke-width': breite * 0.7, ...attrs }, grp);
    } else if (art === 'offen') {
      strich(pfadAus(pk), { 'stroke-width': breite * 0.8 });
      const q = pk[pk.length - 1];
      sEl('circle', { cx: f1(q[0]), cy: f1(q[1]), r: f1(breite * 2.2), fill: '#ffffff', stroke: farbe, 'stroke-width': breite * 0.8, ...attrs }, grp);
    } else strich(pfadAus(pk), { 'stroke-width': breite * 0.8 });
    if (mitQuelle) {
      for (let d = 9; d < Math.min(lang - 6, 40); d += 9) {
        const { p, s } = punktBei(pk, d);
        const [nx, ny, tx, ty] = normale(pk, s);
        const r = breite * 1.5;
        strich(`M${f1(p[0] - (nx + tx) * r)},${f1(p[1] - (ny + ty) * r)}L${f1(p[0] + (nx + tx) * r)},${f1(p[1] + (ny + ty) * r)}`, { 'stroke-width': '1.4', stroke: '#ffffff', 'stroke-opacity': '0.95' });
        strich(`M${f1(p[0] - (nx + tx) * r)},${f1(p[1] - (ny + ty) * r)}L${f1(p[0] + (nx + tx) * r)},${f1(p[1] + (ny + ty) * r)}`, { 'stroke-width': '0.9' });
      }
    }
  }
  /* Spuren an der Fuge – im Überblick lesbar:
     Kitt = breite Kintsugi-Naht mit sichtbarem Spalt; Sperrbalken = Bestreiten; Ring = offen gelassen;
     Goldnaht über dem Arm = für deinen Weg gefasst. */
  function kittNaht(grp, p, tan, gross = 1, deck = 1) {
    const [tx, ty] = tan, nx = -ty, ny = tx;
    const sp = 7 * gross, h = 13 * gross;
    // Spalt: Papier quer über der Bahn
    sEl('path', { d: `M${f1(p[0] - tx * sp)},${f1(p[1] - ty * sp)}L${f1(p[0] + tx * sp)},${f1(p[1] + ty * sp)}`, stroke: '#fbfcfe', 'stroke-width': f1(h * 1.6), 'stroke-linecap': 'butt', 'stroke-opacity': f1(0.92 * deck) }, grp);
    const z = [[-1, -0.1], [-0.6, 0.55], [-0.2, -0.5], [0.2, 0.5], [0.6, -0.45], [1, 0.1]].map(([u, v]) => [p[0] + nx * u * h + tx * v * sp, p[1] + ny * u * h + ty * v * sp]);
    sEl('path', { d: pfadAus(z), fill: 'none', stroke: '#fff3c4', 'stroke-width': f1(7.5 * gross), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': f1(deck) }, grp);
    sEl('path', { d: pfadAus(z), fill: 'none', stroke: '#c98a00', 'stroke-width': f1(4.2 * gross), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'kitt', 'stroke-opacity': f1(deck) }, grp);
    sEl('path', { d: pfadAus(z), fill: 'none', stroke: '#ffe48a', 'stroke-width': f1(1.4 * gross), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-opacity': f1(deck) }, grp);
  }
  function sperrBalken(grp, p, tan, gross = 1) {
    const [tx, ty] = tan, nx = -ty, ny = tx;
    const h = 14 * gross, w = 3 * gross;
    const ecken = [[-w, -h], [w, -h], [w, h], [-w, h]].map(([u, v]) => `${f1(p[0] + tx * u + nx * v)},${f1(p[1] + ty * u + ny * v)}`);
    sEl('path', { d: `M${ecken.join('L')}Z`, fill: '#1f2547', stroke: '#ffffff', 'stroke-width': '1.4', class: 'sperrbalken' }, grp);
  }
  function goldKnoten(grp, p, gross = 1) {
    sEl('circle', { cx: f1(p[0]), cy: f1(p[1]), r: f1(10 * gross), fill: '#fff4c2', 'fill-opacity': '0.9', filter: 'url(#weich)' }, grp);
    sEl('circle', { cx: f1(p[0] - 2.8 * gross), cy: f1(p[1]), r: f1(4.4 * gross), fill: 'none', stroke: '#c48a00', 'stroke-width': f1(2.3 * gross) }, grp);
    sEl('circle', { cx: f1(p[0] + 2.8 * gross), cy: f1(p[1]), r: f1(4.4 * gross), fill: 'none', stroke: '#c48a00', 'stroke-width': f1(2.3 * gross) }, grp);
  }

  function hervorgehoben(a) {
    const w = S.wahl;
    if (w && w.art === 'ort') return a.von === w.k || a.zu === w.k;
    if (w && w.art === 'naht') return NAEHTE.find((n) => n.k === w.k).paare.includes(a.i);
    if (w && w.art === 'fuge') return a.i === w.k;
    if (S.voraus) return fehltNur(a.i, S.voraus) || fehltMitEinem(a.i, S.voraus);
    if (S.hoverPaar !== null) return a.i === S.hoverPaar;
    if (S.hover) return a.von === S.hover || a.zu === S.hover;
    return true;
  }
  const gedaempft = () => !!((S.wahl && ['ort', 'naht', 'fuge'].includes(S.wahl.art)) || S.voraus || S.hover || S.hoverPaar !== null);
  // volle Strichform: nah heran gezoomt, Ort/Fuge gewählt, darübergefahren
  const stark = (a) => (S.hoverPaar === a.i) || (S.wahl && S.wahl.art === 'fuge' && S.wahl.k === a.i) || (S.wahl && S.wahl.art === 'ort' && (a.von === S.wahl.k || a.zu === S.wahl.k)) || (S.wahl && S.wahl.art === 'naht' && hervorgehoben(a)) || (zoomStufe() > 1.9 && !gedaempft());

  /* Bleibende Trefferflächen: einmal angelegt, bei jedem Bild nur verschoben.
     Reihenfolge = Tab-Reihenfolge: Orte von oben nach unten, je Ort direkt danach seine eigenen Arme. */
  const TR = { ort: {}, naht: {}, fehl: {}, arm: {} };
  // Ein Ziel = fokussierbares Element (Tastatur) + Trefferfläche(n) für Zeiger mit derselben Geometrie
  function ziel(tag, attrs, label, tun, hover, schluessel, schichten) {
    const f = sEl(tag, { ...attrs, tabindex: '0', role: 'button', 'aria-label': label, 'data-schluessel': schluessel, class: `${attrs.class || ''} fokus-ziel` }, gFokus);
    f.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tun(null); } });
    f.addEventListener('click', (ev) => { ev.stopPropagation(); tun(null); });
    if (hover) { f.addEventListener('focus', () => { hover(true); zeichneFeld(); }); f.addEventListener('blur', () => { hover(false); zeichneFeld(); }); }
    const hs = schichten.map((g) => {
      const h = sEl(tag, { ...attrs, 'aria-hidden': 'true', 'aria-label': label }, g);
      h.addEventListener('click', (ev) => { ev.stopPropagation(); tun(ev); });
      if (hover) { h.addEventListener('pointerenter', () => { hover(true); zeichneFeld(); }); h.addEventListener('pointerleave', () => { hover(false); zeichneFeld(); }); }
      return h;
    });
    return { f, h: hs[0], w: hs[1] || null, alle: [f, ...hs] };
  }
  const setzeZiel = (z, attrs) => { for (const el of z.alle) setzeAttr(el, attrs); };
  // Welcher gezeichnete Arm liegt einem Punkt am nächsten? Überlappen sich Trefferflächen, gewinnt der nächste.
  function naechsterArm(x, y) {
    let best = null, bd = Infinity;
    for (const a of ARME) {
      const q = a.tpk;
      if (!q) continue;
      for (let s = 1; s < q.length; s++) {
        const [x1, y1] = q[s - 1], [x2, y2] = q[s];
        const dx = x2 - x1, dy = y2 - y1, l2 = dx * dx + dy * dy || 1;
        const u = clamp(((x - x1) * dx + (y - y1) * dy) / l2, 0, 1);
        const d = Math.hypot(x - (x1 + u * dx), y - (y1 + u * dy));
        if (d < bd) { bd = d; best = a; }
      }
    }
    return { a: best, d: bd };
  }
  /* Trefferflächen der Arme: jede Stelle im Band um die gezeichneten Arme gehört dem NÄCHSTEN Arm
     (Raster 3 px, Reichweite 9 px). So öffnet ein Klick nie eine Fuge, deren Arm weiter weg ist als ein anderer.
     Neu berechnet nur, wenn sich Kamera oder Reichweiten geändert haben. */
  let flaechenSig = '', flaechenZeit = 0;
  function baueArmFlaechen() {
    const sig = `${f1(CAM.cx * 100)}|${f1(CAM.cy * 100)}|${f1(CAM.k)}|${FL.w}|${FL.h}|${ARME.map((a) => Math.round(a.len * 50)).join('')}`;
    if (sig === flaechenSig) return;
    if (lebendig() && jetzt() - flaechenZeit < 220) return;
    flaechenSig = sig; flaechenZeit = jetzt();
    const c = 2, nx = Math.ceil(FL.w / c) + 1, ny = Math.ceil(FL.h / c) + 1;
    const dist = new Float32Array(nx * ny).fill(1e9);
    const wer = new Int16Array(nx * ny).fill(-1);
    const RAD = schmal() ? 8 : 9;
    for (const a of ARME) {
      if (!a.tpk || !FORMEN[a.von]) continue;
      // vom Körpermittelpunkt an: die Ausbuchtung in Richtung eines Arms gehört diesem Arm
      const q = [[FORMEN[a.von].x, FORMEN[a.von].y], ...a.tpk];
      let entlang = 0;
      for (let s = 1; s < q.length; s++) {
        const [x1, y1] = q[s - 1], [x2, y2] = q[s];
        const l = Math.hypot(x2 - x1, y2 - y1), n = Math.max(1, Math.ceil(l / 1.5));
        for (let m = 0; m <= n; m++) {
          const px = x1 + ((x2 - x1) * m) / n, py = y1 + ((y2 - y1) * m) / n;
          // Kreuzen sich zwei Arme, gehört die Stelle dem, dessen eigener Körper näher ist (Wurzel-Vorrang)
          const vorrang = 0.12 * (entlang + (l * m) / n);
          const i0 = Math.max(0, Math.floor((px - RAD) / c)), i1 = Math.min(nx - 1, Math.ceil((px + RAD) / c));
          const j0 = Math.max(0, Math.floor((py - RAD) / c)), j1 = Math.min(ny - 1, Math.ceil((py + RAD) / c));
          for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
            const d0 = Math.hypot(i * c + c / 2 - px, j * c + c / 2 - py);
            const d = d0 + vorrang;
            const k = j * nx + i;
            if (d0 <= RAD && d < dist[k]) { dist[k] = d; wer[k] = a.n; }
          }
        }
        entlang += l;
      }
    }
    // die Mitte jedes Körpers bleibt frei
    for (const F of Object.values(FORMEN)) {
      const rr = F.R * 0.75;
      for (let j = Math.max(0, Math.floor((F.y - rr) / c)); j <= Math.min(ny - 1, Math.ceil((F.y + rr) / c)); j++) {
        for (let i = Math.max(0, Math.floor((F.x - rr) / c)); i <= Math.min(nx - 1, Math.ceil((F.x + rr) / c)); i++) {
          if (Math.hypot(i * c + c / 2 - F.x, j * c + c / 2 - F.y) < rr) wer[j * nx + i] = -1;
        }
      }
    }
    const teile = ARME.map(() => []);
    for (let j = 0; j < ny; j++) {
      let i = 0;
      while (i < nx) {
        const w = wer[j * nx + i];
        if (w < 0) { i++; continue; }
        let k = i;
        while (k + 1 < nx && wer[j * nx + k + 1] === w) k++;
        teile[w].push(`M${i * c},${j * c}h${(k - i + 1) * c}v${c}h${-(k - i + 1) * c}z`);
        i = k + 1;
      }
    }
    ARME.forEach((a) => { if (TR.arm[a.n]) TR.arm[a.n].h.setAttribute('d', teile[a.n].join('') || 'M0,0'); });
  }
  function lokal(ev) { const r = feldFlaeche.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; }
  // Ein Klick auf eine Trefferfläche: Körper vor Arm, der nächste gezeichnete Arm vor dem obersten, Naht nur, wenn kein Arm nah ist
  function armKlick(ev, a) {
    if (!ev) return betrete(a.i);
    const kk = koerperUnter(ev);
    if (kk) return waehle({ art: 'ort', k: kk });
    const { x, y } = lokal(ev);
    const n = naechsterArm(x, y);
    if (n.a && n.d <= 13) return betrete(n.a.i);
    const naht = NAEHTE.find((m) => Math.hypot(x - sx(m.c.x), y - sy(m.c.y)) < 18);
    if (naht) return waehle({ art: 'naht', k: naht.k });
    return betrete(a.i);
  }
  // Ein Klick auf einen Arm, der genau über einem Körper liegt, meint den Körper
  function koerperUnter(ev) {
    if (!ev) return null;
    const r = feldFlaeche.getBoundingClientRect();
    const x = ev.clientX - r.left, y = ev.clientY - r.top;
    for (const k of FELD_ORTE) { const F = FORMEN[k]; if (F && Math.hypot(x - F.x, y - F.y) < F.R * 0.95) return k; }
    return null;
  }
  {
    const reihe = [...FELD_ORTE].sort((a, b) => (W[a].y - W[b].y) || (W[a].x - W[b].x));
    for (const k of reihe) {
      const o = D.orte[k];
      TR.ort[k] = ziel('circle', { class: 'treffer-ort', fill: 'transparent' }, `${o.titel}, ${o.gebiet}`, () => waehle({ art: 'ort', k }), (an) => { S.hover = an ? k : S.hover === k ? null : S.hover; }, `ort|${k}`, [gTrefferOrt]);
      for (const a of ARME.filter((x) => x.von === k)) {
        const p = paar(a.i);
        const v = verbSatz(a.i);
        TR.arm[a.n] = ziel('path', { class: 'arm-treffer', fill: 'none', stroke: 'transparent', 'stroke-width': '14', 'stroke-linecap': 'round' }, `Fuge betreten: ${p.A.titel} und ${p.B.titel} – ${v.subj.titel} ${v.verb} ${v.obj.titel}`, (ev) => armKlick(ev, a), (an) => { S.hoverPaar = an ? a.i : S.hoverPaar === a.i ? null : S.hoverPaar; }, `arm|${a.n}`, [gTrefferArm]);
        setzeAttr(TR.arm[a.n].h, { class: 'arm-flaeche', stroke: 'none', fill: 'transparent', 'stroke-width': '0' });
        // beim Darüberfahren zählt der nächste gezeichnete Arm, nicht der oberste
        for (const h of [TR.arm[a.n].h]) h.addEventListener('pointermove', (ev) => { const { x, y } = lokal(ev); const n = naechsterArm(x, y); const i = n.a && n.d <= 13 ? n.a.i : a.i; if (S.hoverPaar !== i) { S.hoverPaar = i; zeichneFeld(); } });
      }
    }
    for (const n of NAEHTE) {
      const tun = () => waehle({ art: 'naht', k: n.k });
      const kreis = ziel('circle', { class: 'treffer-naht', fill: 'transparent' }, `Naht zwischen ${n.a} und ${n.b} öffnen`, tun, (an) => { S.hoverNaht = an ? n.k : S.hoverNaht === n.k ? null : S.hoverNaht; }, `naht|${n.k}`, [gTrefferUnten]);
      const schild = sEl('rect', { class: 'treffer-schild', fill: 'transparent', 'aria-hidden': 'true' }, gTrefferUnten);
      schild.addEventListener('click', (ev) => { ev.stopPropagation(); tun(); });
      TR.naht[n.k] = { kreis, schild };
    }
    for (const f of FEHL) TR.fehl[f.k] = ziel('circle', { class: 'fehlstelle treffer-fehl', fill: 'transparent' }, `Fehlstelle neben ${f.orte.map((k) => D.orte[k].titel).join(' und ')}: hier fehlt ein festgehaltener Befund`, () => waehle({ art: 'fehl', k: f.k }), null, `fehl|${f.k}`, [gTrefferUnten]);
  }

  let zeit = 0;
  const AN = D.paare.map(() => ({ hak: 0, riss: 0, haengen: [] })); // Bewegungsereignisse je Paar (nur lebendig)
  function treffpunkt(i) {
    const a = ersterArm(i);
    if (!a || !a.pk) return null;
    const q = a.pk[a.pk.length - 1];
    const v = a.pk[Math.max(0, a.pk.length - 3)];
    const l = Math.hypot(q[0] - v[0], q[1] - v[1]) || 1;
    return { p: q, tan: [(q[0] - v[0]) / l, (q[1] - v[1]) / l] };
  }
  function zeichneFeld() {
    if (!CAM.basis || S.ansicht !== 'feld') return;
    vergiss();
    baueFormen();
    const R = koerperR();
    const k100 = CAM.k / 100;
    const leb = lebendig();
    const atem = leb ? 1 + Math.sin(zeit / 2600) * 0.018 : 1;
    gMembran.setAttribute('transform', `translate(${f1(FL.w / 2 - CAM.cx * CAM.k * atem)},${f1(FL.h / 2 - CAM.cy * CAM.k * atem)}) scale(${(k100 * atem).toFixed(5)})`);
    gNaht.innerHTML = ''; gArme.innerHTML = ''; gKoerper.innerHTML = ''; gSpur.innerHTML = ''; gSchrift.innerHTML = '';
    const hart = [], weich = []; // Belegte Flächen für Beschriftungen: hart = Körper, Schilder; weich = Faserbahnen

    // Fehlstellen: hohl, hell gerandet
    const fehlSchilder = [];
    for (const f of FEHL) {
      const x = sx(f.c.x), y = sy(f.c.y), r = f.r * CAM.k;
      const an = S.wahl && S.wahl.art === 'fehl' && S.wahl.k === f.k;
      const grp = sEl('g', { class: `fehl-bild${an ? ' an' : ''}` }, gNaht);
      setzeZiel(TR.fehl[f.k], { cx: f1(x), cy: f1(y), r: f1(Math.max(r + 4, 14)) });
      sEl('circle', { cx: f1(x), cy: f1(y), r: f1(Math.max(4, r - 3)), fill: 'none', stroke: farbeG(f.gebiet).tief, 'stroke-opacity': an ? '0.9' : '0.55', 'stroke-width': an ? '2.2' : '1.5', 'stroke-dasharray': '3 4' }, grp);
      if (zoomStufe() > 1.2 || an) fehlSchilder.push({ x, y, r });
      hart.push({ l: x - r, r: x + r, t: y - r, b: y + r });
    }

    const nahtSchilder = [];
    for (const n of NAEHTE) {
      const x = sx(n.c.x), y = sy(n.c.y);
      const an = (S.wahl && S.wahl.art === 'naht' && S.wahl.k === n.k) || S.hoverNaht === n.k;
      const grp = sEl('g', { class: `naht-bild${an ? ' an' : ''}` }, gNaht);
      setzeZiel(TR.naht[n.k].kreis, { cx: f1(x), cy: f1(y), r: '16' });
      const q = n.quer, l = n.laengs;
      const goldig = n.paare.some((i) => ein(i).kitt || ein(i).eingerastet);
      for (let s = -2; s <= 2; s++) {
        const cx = x + q.x * s * 9, cy = y + q.y * s * 9;
        sEl('path', { d: `M${f1(cx - l.x * 7 - q.x * 3)},${f1(cy - l.y * 7 - q.y * 3)}L${f1(cx + l.x * 7 + q.x * 3)},${f1(cy + l.y * 7 + q.y * 3)}`, stroke: goldig ? '#c48a00' : '#56607f', 'stroke-width': '1.8', 'stroke-linecap': 'round' }, grp);
      }
      hart.push({ l: x - 16, r: x + 16, t: y - 16, b: y + 16 });
      nahtSchilder.push({ n, x, y, an });
    }

    // Arme als Faserbündel
    const dimm = gedaempft();
    const breiteForm = schmal() ? clamp(1.6 * Math.sqrt(zoomStufe()), 1.5, 2.6) : clamp(2.4 * Math.sqrt(zoomStufe()), 2.2, 3.6);
    const armSchilder = [];
    for (const a of ARME) {
      const g = armGeo(a);
      const e = ein(a.i);
      const pk = bahn(a, g);
      a.pk = pk;
      const hell = hervorgehoben(a);
      a.hell = hell;
      const c = farbe(D.orte[a.von]);
      const grp = sEl('g', { class: `arm${hell ? '' : ' leise'}${dimm && hell ? ' betont' : ''}` }, gArme);
      const len = clamp(a.len, 0.02, 1);
      const dicht = teilBahn(pk, len);
      // Trefferfläche nur über dem sichtbar gezeichneten Teil (dicht und der noch sichtbare Anfang des Ausfransens);
      // beidseitig: jede Hälfte für sich
      a.tpk = teilBahn(pk, Math.min(1, len + (1 - len) * 0.3));
      if (TR.arm[a.n]) TR.arm[a.n].f.setAttribute('d', pfadAus(a.tpk));
      for (let d = 0, lg = bogenLaenge(dicht); d < lg; d += 12) { const { p } = punktBei(dicht, d); weich.push({ l: p[0] - 5, r: p[0] + 5, t: p[1] - 5, b: p[1] + 5 }); }
      // Voraussetzung: leuchtender Hof um die Arme, denen genau dieser Zahn fehlt
      if (S.voraus && hell) {
        const nur = fehltNur(a.i, S.voraus);
        sEl('path', { d: pfadAus(dicht), fill: 'none', stroke: '#ffcf3a', 'stroke-opacity': nur ? '0.8' : '0.4', 'stroke-width': nur ? 13 : 8, 'stroke-linecap': 'round', filter: 'url(#weich)' }, grp);
      }
      if (e.eingerastet) sEl('path', { d: pfadAus(dicht), fill: 'none', stroke: '#ffd447', 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-opacity': e.bedingt ? '0.3' : '0.45', filter: 'url(#weich)' }, grp);
      const st = stark(a);
      // Deckkraft folgt der Passung: je mehr Zähne fehlen, desto leiser – so liest sich das Gewebe als Rangfolge, nicht als Knäuel
      const zp = bewerte(a.i), fehlt = zp.fehlend.length;
      const passung = spaltBleibt(a.i) || e.entscheidung === 'bestritten' ? 0.14 : fehlt <= 1 ? 0.78 : fehlt === 2 ? 0.5 : 0.24;
      zeichneFasern(grp, a, pk, len, st ? c.tief : c.faser, { stark: st, deckkraft: st ? 0.9 : e.eingerastet ? 0.95 : passung, faser: st ? 1.2 : fehlt <= 1 ? 1.15 : 0.9, fasern: !st && !e.eingerastet && fehlt >= 3 ? 2 : FASERN, ohneKnoten: !st && !e.eingerastet && fehlt >= 3, knoten: st ? 1.9 : 1.5, ausfrans: !e.eingerastet, glimm: hell });
      const z = bewerte(a.i);
      // Bestandsform als Schatten, wenn du eine andere Lesart gewählt hast
      if (z.lesart.deine && (st || e.eingerastet)) zeichneArmForm(grp, dicht, a.f.art, c.tief, breiteForm * 0.8, 0, false, { 'stroke-opacity': '0.22', 'fill-opacity': '0.18', transform: 'translate(0,4)' });
      if (st) zeichneArmForm(grp, dicht, armArt(a), e.eingerastet ? c.dunkel : c.tief, breiteForm, leb ? zeit / 900 + a.n : 0, z.beleg.greift);
      // bedingte Passung: gestrichelter Goldfaden über dem Arm
      if (e.eingerastet && e.bedingt) sEl('path', { d: pfadAus(dicht), fill: 'none', stroke: '#b98300', 'stroke-width': 1.6, 'stroke-dasharray': '2 5', 'stroke-linecap': 'round' }, grp);
      // für deinen Weg gefasst: Goldnaht mit Stichen über dem Arm
      if (e.eingerastet && e.entscheidung === 'gefasst') {
        sEl('path', { d: pfadAus(dicht), fill: 'none', stroke: '#fff1b0', 'stroke-width': 6, 'stroke-linecap': 'round' }, grp);
        sEl('path', { d: pfadAus(dicht), fill: 'none', stroke: '#d29a00', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, grp);
        for (let d = 6, lg = bogenLaenge(dicht); d < lg - 3; d += 9) { const { p, s } = punktBei(dicht, d); const [nx, ny] = normale(dicht, s); sEl('path', { d: `M${f1(p[0] - nx * 4)},${f1(p[1] - ny * 4)}L${f1(p[0] + nx * 4)},${f1(p[1] + ny * 4)}`, stroke: '#8f6400', 'stroke-width': 1.2 }, grp); }
      }
      // Verbsatz an der Faser: nur einer, am Faserende des Arms, über den gefahren wird – oder die Arme des gewählten Orts
      const zeigeText = (S.hoverPaar === a.i && (!a.beide || a.vonA) && !(S.wahl && S.wahl.art === 'fuge' && S.wahl.k === a.i)) || (S.wahl && S.wahl.art === 'ort' && a.von === S.wahl.k) || (S.wahl && S.wahl.art === 'naht' && hell && (!a.beide || a.vonA));
      if (zeigeText) {
        const voll0 = S.hoverPaar === a.i;
        const sp = voll0 ? punktBei(dicht, bogenLaenge(dicht) * 0.6).p : pk[pk.length - 1];
        const anderer = D.orte[a.zu];
        const v = verbSatz(a.i);
        const voll = S.hoverPaar === a.i;
        armSchilder.push({ x: sp[0], y: sp[1], prio: voll ? 2 : 1, art: voll ? `${v.subj.titel} ` : armArtWort(a), rest: voll ? `${v.verb} ${v.obj.titel}` : S.wahl && S.wahl.art === 'naht' ? ` · ${paar(a.i).A.titel} – ${paar(a.i).B.titel}` : ` · ${anderer.titel}` });
      }
    }
    baueArmFlaechen();
    // Spuren am Treffpunkt
    for (const i of FELD_PAARE) {
      const e = ein(i);
      const tp = treffpunkt(i);
      if (!tp) continue;
      const an = AN[i];
      const grp = sEl('g', { class: 'spur' }, gSpur);
      const g0 = clamp(Math.sqrt(zoomStufe()), 1, 1.5);
      if (e.kitt) {
        const deck = leb && an.riss ? clamp((zeit - an.riss - 900) / 500, 0, 1) : 1;
        if (deck > 0) kittNaht(grp, tp.p, tp.tan, g0, deck);
      }
      if (e.entscheidung === 'bestritten') sperrBalken(grp, tp.p, tp.tan, g0);
      // gerissen: zwei, drei Fasern hängen kurz nach
      if (leb && an.riss && zeit - an.riss < 1300) {
        const t = clamp((zeit - an.riss) / 1300, 0, 1);
        const c = farbe(paar(i).A).faser;
        for (let s = 0; s < 3; s++) {
          const lgh = 12 + s * 7, ox = (s - 1) * 4;
          const p0 = [tp.p[0] + ox, tp.p[1]];
          sEl('path', { d: `M${f1(p0[0])},${f1(p0[1])}Q${f1(p0[0] + 5 + ox)},${f1(p0[1] + lgh * 0.6)} ${f1(p0[0] + ox * 1.5 + Math.sin(zeit / 160 + s) * 3)},${f1(p0[1] + lgh * (0.6 + t * 0.7))}`, fill: 'none', stroke: c, 'stroke-width': '1.2', 'stroke-opacity': f1(0.9 * (1 - t)) }, grp);
        }
      }
      const voll = ARME.filter((x) => x.i === i).every((x) => x.len > 0.97);
      if (e.eingerastet && voll) {
        let gross = g0;
        if (leb && an.hak) {
          const dt = zeit - an.hak;
          if (dt > 0 && dt < 700) gross *= 1 + 0.38 * Math.sin((dt / 700) * Math.PI * 2.5) * (1 - dt / 700); // Nachfedern
          const puls = clamp(1 - dt / 1400, 0, 1);
          if (puls > 0 && dt > 0) sEl('circle', { cx: f1(tp.p[0]), cy: f1(tp.p[1]), r: f1(10 + (1 - puls) * 52), fill: '#fff4c2', 'fill-opacity': f1(0.35 * puls), stroke: '#f2b300', 'stroke-width': f1(4 * puls + 0.5), 'stroke-opacity': f1(puls) }, grp);
        }
        goldKnoten(grp, tp.p, gross);
        if (e.entscheidung === 'offen') sEl('circle', { cx: f1(tp.p[0]), cy: f1(tp.p[1]), r: f1(14 * g0), fill: 'none', stroke: '#4b5378', 'stroke-width': '2', 'stroke-dasharray': '4 3' }, grp);
      }
      // Lichtpuls wandert beim Einhaken an den Fasern entlang zum Knoten
      if (leb && e.eingerastet && an.hak && zeit < an.hak && zeit > an.hak - 1200) {
        for (const x of ARME.filter((y) => y.i === i && y.pk)) {
          const tp2 = clamp(x.len, 0, 1);
          const q = punktBei(x.pk, bogenLaenge(x.pk) * tp2).p;
          sEl('circle', { cx: f1(q[0]), cy: f1(q[1]), r: '8', fill: '#fff1a8', 'fill-opacity': '0.85', filter: 'url(#weich)' }, grp);
          sEl('circle', { cx: f1(q[0]), cy: f1(q[1]), r: '2.6', fill: '#ffffff' }, grp);
        }
      }
      // gewählte Fuge, noch offen: ein Schlüsselloch am Treffpunkt und was fehlt
      if (S.wahl && S.wahl.art === 'fuge' && S.wahl.k === i && !e.eingerastet && e.entscheidung !== 'bestritten' && !e.kitt && (bewerte(i).fehlend.length || spaltBleibt(i))) {
        const [x, y] = tp.p;
        sEl('circle', { cx: f1(x), cy: f1(y), r: '15', fill: '#ffffff', 'fill-opacity': '0.92', stroke: '#2a3260', 'stroke-width': '1.6', 'stroke-dasharray': '4 3' }, grp);
        sEl('path', { d: `M${f1(x)},${f1(y - 7)}a4,4 0 1,1 0.01,0Zm-2.4,5.5h4.8l1.6,8h-8Z`, fill: '#2a3260' }, grp);
        const z = bewerte(i);
        const zeile = spaltBleibt(i) ? 'der Spalt bleibt' : `es fehlt: ${z.fehlend.map((sl) => SLOT_NAME[sl]).join(', ')}`;
        const fs = 13 * (PROFIL.schrift === 'gross' ? 1.25 : 1);
        const breit = zeile.length * fs * 0.55, hoch = fs * 1.3;
        const c = platziere(hart, [{ x, y: y + 22, a: 'middle' }, { x, y: y - 22 - hoch, a: 'middle' }, { x: x + 22, y: y - hoch / 2, a: 'start' }, { x: x - 22, y: y - hoch / 2, a: 'end' }], breit, hoch, Infinity, weich);
        const t = sEl('text', { x: f1(c.x), y: f1(c.y + fs), class: 'schluesselloch-text', 'text-anchor': c.a }, gSchrift);
        t.textContent = zeile;
      }
      hart.push({ l: tp.p[0] - 8, r: tp.p[0] + 8, t: tp.p[1] - 8, b: tp.p[1] + 8 });
    }

    // Körper
    const namen = [];
    const phase = leb ? zeit / 1100 : null;
    for (const k of FELD_ORTE) {
      const o = D.orte[k];
      const F = FORMEN[k];
      const c = farbe(o);
      const gewaehlt = S.wahl && S.wahl.art === 'ort' && S.wahl.k === k;
      const inFuge = S.wahl && S.wahl.art === 'fuge' && (String(paar(S.wahl.k).a) === k || String(paar(S.wahl.k).b) === k);
      const leise = dimm && !gewaehlt && !inFuge && S.hover !== k && !ARME.some((a) => a.hell && (a.von === k || a.zu === k));
      const grp = sEl('g', { class: `ort-bild${gewaehlt ? ' gewaehlt' : ''}${leise ? ' leise' : ''}` }, gKoerper);
      setzeZiel(TR.ort[k], { cx: f1(F.x), cy: f1(F.y), r: f1(Math.max(12.5, R * 1.05)) });
      if (leb && !leise) sEl('path', { d: umrissPfad(F, phase, 1.45), fill: c.hauch, 'fill-opacity': '0.55', filter: 'url(#weich)' }, grp);
      if (gewaehlt || inFuge) sEl('path', { d: umrissPfad(F, phase, 1.32), fill: c.hauch, 'fill-opacity': '0.85' }, grp);
      const gi = GEBIETE.findIndex((g) => g.name === o.gebiet);
      sEl('path', { d: umrissPfad(F, phase), fill: `url(#leib${gi})`, stroke: c.tief, 'stroke-width': gewaehlt ? '2.8' : '1.8', 'stroke-linejoin': 'round', filter: 'url(#schatten)' }, grp);
      sEl('path', { d: umrissPfad({ ...F, R: F.R * 0.62 }, phase), fill: 'none', stroke: c.tief, 'stroke-opacity': '0.22', 'stroke-width': '1', 'stroke-dasharray': '1.5 3' }, grp);
      sEl('ellipse', { cx: f1(F.x - F.R * 0.28), cy: f1(F.y - F.R * 0.34), rx: f1(F.R * 0.34), ry: f1(F.R * 0.18), fill: '#ffffff', 'fill-opacity': '0.75', transform: `rotate(-24 ${f1(F.x - F.R * 0.28)} ${f1(F.y - F.R * 0.34)})` }, grp);
      for (const b of F.beulen) if (b.art === 'offen') { const r = radius(F, b.th) * 0.92; sEl('circle', { cx: f1(F.x + Math.cos(b.th) * r), cy: f1(F.y + Math.sin(b.th) * r), r: f1(F.R * 0.22), fill: '#ffffff', stroke: c.tief, 'stroke-width': '1.4' }, grp); }
      namen.push({ k, x: F.x, y: F.y, R: F.R * 1.3, o, gewaehlt: gewaehlt || inFuge, leise, hover: S.hover === k });
      hart.push({ l: F.x - F.R * 1.25, r: F.x + F.R * 1.25, t: F.y - F.R * 1.25, b: F.y + F.R * 1.25 });
    }

    const sfak = PROFIL.schrift === 'gross' ? 1.25 : 1;
    legeNamen(namen, hart, weich);
    // Gebietsnamen außen an der Membran; schmal nur, wo sie nichts überdecken
    const heimM = GEBIETE.find((g) => g.heim).mitte;
    GEBIETE.forEach((g, gi) => {
      let dx = g.mitte.x - heimM.x, dy = g.mitte.y - heimM.y;
      const l = Math.hypot(dx, dy);
      if (g.heim || l < 1e-6) { dx = 0; dy = -1; } else { dx /= l; dy /= l; }
      let best = null, bw = -Infinity;
      for (const lp of MEMBRAN.pfade[gi]) for (const q of lp) { const w = q[0] * dx + q[1] * dy; if (w > bw) { bw = w; best = q; } }
      if (!best) return;
      const X = sx(best[0]) + dx * 14, Y = sy(best[1]) + dy * 14;
      if (X < -10 || X > FL.w + 10 || Y < -10 || Y > FL.h + 10) return;
      const text = g.name.toUpperCase();
      const fs = (schmal() ? 11.5 : 13) * sfak;
      const breit = text.length * fs * 0.98, hoch = fs * 1.25;
      const a = Math.abs(dx) < 0.45 ? 'middle' : dx > 0 ? 'start' : 'end';
      const y0 = dy < -0.45 ? Y - hoch : Math.abs(dy) <= 0.45 ? Y - hoch / 2 : Y;
      const innen = (c) => ({ ...c, x: c.a === 'start' ? Math.min(c.x, FL.w - 6 - breit) : c.a === 'end' ? Math.max(c.x, 6 + breit) : clamp(c.x, 6 + breit / 2, FL.w - 6 - breit / 2) });
      const kand = [{ x: X, y: y0, a }, { x: X, y: y0 - 18, a }, { x: X, y: y0 + 18, a }, { x: X - 40, y: y0, a }, { x: X + 40, y: y0, a }, { x: X, y: y0 + 36, a }, { x: X, y: y0 - 36, a }, ...[30, 52, 76].map((d) => ({ x: X + dx * d, y: y0 + dy * d, a })), { x: X - 90, y: y0, a }, { x: X + 90, y: y0, a }, { x: X, y: y0 + 56, a }, { x: X, y: y0 - 56, a }].map(innen);
      const c = platziere(hart, kand, breit, hoch, schmal() ? 0 : Infinity, weich);
      if (!c) return;
      const t = sEl('text', { x: f1(c.x), y: f1(c.y + fs * 0.95), class: `gebiet-name${g.heim ? ' heim' : ''}`, fill: farbeG(g.name).tief, 'text-anchor': c.a }, gSchrift);
      t.textContent = text;
    });
    for (const fs of fehlSchilder) {
      const text = 'hier fehlt ein Befund';
      const breit = text.length * 7.4 * sfak, hoch = 15 * sfak;
      const c = platziere(hart, [{ x: fs.x, y: fs.y + fs.r + 4, a: 'middle' }, { x: fs.x, y: fs.y - fs.r - 4 - hoch, a: 'middle' }, { x: fs.x + fs.r + 6, y: fs.y - hoch / 2, a: 'start' }, { x: fs.x - fs.r - 6, y: fs.y - hoch / 2, a: 'end' }], breit, hoch, 20, weich);
      if (!c) continue;
      const t = sEl('text', { x: f1(c.x), y: f1(c.y + 11.5 * sfak), class: 'fehl-text', 'text-anchor': c.a }, gSchrift);
      t.textContent = text;
    }
    armSchilder.sort((a, b) => b.prio - a.prio);
    for (const as of armSchilder) {
      const text = as.art + as.rest;
      // schmal: der ausgeschriebene Satz in zwei Zeilen (Ort, dann Verb und Partner), damit er keine Namen überdeckt
      const zwei = as.prio > 1 && schmal();
      const breit = (zwei ? Math.max(as.art.length, as.rest.length) * 7.6 : text.length * 7.1) * sfak, hoch = (zwei ? 33 : 16) * sfak;
      const kand = [];
      for (const d of [8, 20, 34, 50]) kand.push({ x: as.x + d, y: as.y - hoch / 2, a: 'start' }, { x: as.x - d, y: as.y - hoch / 2, a: 'end' }, { x: as.x, y: as.y - hoch - d, a: 'middle' }, { x: as.x, y: as.y + d, a: 'middle' });
      const c = platziere(hart, kand, breit, hoch, as.prio > 1 ? Infinity : 2, weich);
      if (!c) continue; // kein freier Platz: dieser Arm bleibt unbeschriftet, statt Schilder zu stapeln
      const t = sEl('text', { x: f1(c.x), y: f1(c.y + 11.5 * sfak), class: `arm-text${as.prio > 1 ? ' voll' : ''}`, 'text-anchor': c.a }, gSchrift);
      const ts = sEl('tspan', { class: 'arm-text-art' }, t);
      ts.textContent = as.art;
      const ts2 = sEl('tspan', zwei ? { x: f1(c.x), dy: '1.2em' } : {}, t);
      ts2.textContent = zwei ? as.rest.trim() : as.rest;
    }
    for (const ns of nahtSchilder) {
      // im Überblick trägt die Schraffur die Naht; ihr Name erscheint beim Darüberfahren, Fokus oder Öffnen
      if (!ns.an) { setzeAttr(TR.naht[ns.n.k].schild, { width: 0, height: 0 }); continue; }
      const text = `Zwischen ${kurzG(ns.n.a)} und ${kurzG(ns.n.b)}`;
      const breit = text.length * 6.6 * sfak, hoch = 15 * sfak;
      const q = ns.n.quer, lg = ns.n.laengs;
      const kand = [1, -1].flatMap((sg) => [28, 44, 62].map((d) => ({ x: ns.x + q.x * d * sg, y: ns.y + q.y * d * sg - hoch / 2, a: 'middle' })));
      for (const sg of [1, -1]) for (const d of [30, 50]) kand.push({ x: ns.x + lg.x * d * sg, y: ns.y + lg.y * d * sg - hoch / 2, a: 'middle' });
      kand.push({ x: ns.x + 20, y: ns.y - hoch / 2, a: 'start' }, { x: ns.x - 20, y: ns.y - hoch / 2, a: 'end' });
      const c = platziere(hart, kand, breit, hoch, ns.an ? Infinity : breit * hoch * 0.15, weich);
      if (!c) { setzeAttr(TR.naht[ns.n.k].schild, { width: 0, height: 0 }); continue; }
      const t = sEl('text', { x: f1(c.x), y: f1(c.y + 11.5 * sfak), class: `naht-text${ns.an ? ' an' : ''}`, 'text-anchor': c.a }, gSchrift);
      t.textContent = text;
      setzeAttr(TR.naht[ns.n.k].schild, { x: f1(c.a === 'middle' ? c.x - breit / 2 : c.a === 'start' ? c.x : c.x - breit), y: f1(c.y - 2), width: f1(breit), height: f1(hoch + 4) });
    }
    // Lichtschrift an der Fuge
    if (S.licht && S.licht.i !== null && FELD_PAARE.includes(S.licht.i)) {
      const tp = treffpunkt(S.licht.i);
      if (tp) {
        const alter = jetzt() - S.licht.start;
        const deck = leb ? clamp(Math.min(alter / 300, (5000 - alter) / 600), 0, 1) : 1;
        if (deck > 0) {
        const zeilen = umbruch(S.licht.text, schmal() ? 30 : 44).slice(0, 3);
        const fs = 14 * sfak;
        const breit = Math.max(...zeilen.map((z) => z.length)) * fs * 0.5, hoch = zeilen.length * fs * 1.3;
        const c = platziere(hart, [{ x: tp.p[0], y: tp.p[1] - 26 - hoch, a: 'middle' }, { x: tp.p[0], y: tp.p[1] + 24, a: 'middle' }, { x: tp.p[0] + 24, y: tp.p[1] - hoch / 2, a: 'start' }, { x: tp.p[0] - 24, y: tp.p[1] - hoch / 2, a: 'end' }].map((q) => ({ ...q, x: q.a === 'middle' ? clamp(q.x, breit / 2 + 6, FL.w - breit / 2 - 6) : q.x })), breit, hoch, Infinity, weich);
        const t = sEl('text', { x: f1(c.x), y: f1(c.y + fs), class: 'lichtschrift', 'text-anchor': c.a, opacity: f1(deck), filter: leb ? 'url(#glimm)' : '' }, gSchrift);
        zeilen.forEach((z, j) => { const ts = sEl('tspan', { x: f1(c.x), dy: j ? '1.3em' : '0' }, t); ts.textContent = z; });
        }
      }
    }
  }
  function platziere(hart, kand0, breit, hoch, hoechstens = Infinity, weich = []) {
    // Kandidaten zuerst in die Fläche schieben: nichts wird am Rand abgeschnitten
    const kand = kand0.map((c) => ({ ...c, x: c.a === 'middle' ? clamp(c.x, breit / 2 + 5, FL.w - breit / 2 - 5) : c.a === 'start' ? clamp(c.x, 5, FL.w - breit - 5) : clamp(c.x, breit + 5, FL.w - 5), y: clamp(c.y, 3, FL.h - hoch - 3) }));
    const rect = (c) => ({ l: c.a === 'middle' ? c.x - breit / 2 : c.a === 'start' ? c.x : c.x - breit, t: c.y, r: c.a === 'middle' ? c.x + breit / 2 : c.a === 'start' ? c.x + breit : c.x, b: c.y + hoch });
    const flaeche = (r, liste) => liste.reduce((s, q) => s + Math.max(0, Math.min(r.r, q.r) - Math.max(r.l, q.l)) * Math.max(0, Math.min(r.b, q.b) - Math.max(r.t, q.t)), 0);
    const stoss = (r) => flaeche(r, hart) + 0.3 * flaeche(r, weich) + (r.l < 4 || r.r > FL.w - 4 || r.t < 2 || r.b > FL.h - 2 ? 1e5 : 0);
    let best = kand[0], bs = Infinity;
    for (const c of kand) { const st = stoss(rect(c)); if (st < bs) { best = c; bs = st; } if (st === 0) break; }
    // Grenze gilt nur für Überdeckung mit Schrift und Körpern (hart); Fasern darunter sind erlaubt
    if (flaeche(rect(best), hart) > hoechstens) return null;
    hart.push(rect(best));
    return best;
  }
  // Namen so legen, dass sie weder einander noch Körper, Schilder oder Faserbahnen überdecken
  function legeNamen(namen, hart, weich) {
    const sfak = PROFIL.schrift === 'gross' ? 1.25 : 1;
    namen.sort((a, b) => Number(b.gewaehlt) - Number(a.gewaehlt) || Number(b.hover) - Number(a.hover) || Number(a.leise) - Number(b.leise));
    for (const n of namen) {
      if (n.x < -n.R || n.x > FL.w + n.R || n.y < -n.R || n.y > FL.h + n.R) continue; // Körper außerhalb des Bildes: kein Name
      const gr = n.gewaehlt ? 19 : schmal() ? 12 : 13;
      const zeilen = n.o.titel.length > 18 ? umbruch(n.o.titel, n.gewaehlt ? 22 : 17) : [n.o.titel];
      const breit = Math.max(...zeilen.map((z) => z.length)) * gr * (n.gewaehlt ? 0.5 : 0.58) * sfak + 4;
      const hoch = zeilen.length * gr * 1.15 * sfak + 2;
      const R = n.R;
      const kand = [
        { x: n.x, y: n.y + R + 4, a: 'middle' }, { x: n.x, y: n.y - R - 4 - hoch, a: 'middle' },
        { x: n.x + R + 6, y: n.y - hoch / 2, a: 'start' }, { x: n.x - R - 6, y: n.y - hoch / 2, a: 'end' },
        { x: n.x + R * 0.8, y: n.y + R * 0.6, a: 'start' }, { x: n.x - R * 0.8, y: n.y + R * 0.6, a: 'end' },
        { x: n.x + R * 0.8, y: n.y - R * 0.6 - hoch, a: 'start' }, { x: n.x - R * 0.8, y: n.y - R * 0.6 - hoch, a: 'end' },
        { x: n.x, y: n.y + R + 18, a: 'middle' }, { x: n.x, y: n.y - R - 18 - hoch, a: 'middle' },
      ].map((c) => ({ ...c, x: c.a === 'middle' ? clamp(c.x, breit / 2 + 5, FL.w - breit / 2 - 5) : c.a === 'start' ? Math.min(c.x, FL.w - breit - 5) : Math.max(c.x, breit + 5) }));
      if (n.gewaehlt) { const [u, o] = kand; kand[0] = o; kand[1] = u; }
      const rect = (c) => ({ l: c.a === 'middle' ? c.x - breit / 2 : c.a === 'start' ? c.x : c.x - breit, t: c.y, r: (c.a === 'middle' ? c.x + breit / 2 : c.a === 'start' ? c.x + breit : c.x), b: c.y + hoch });
      const fl = (r, liste) => liste.reduce((s, q) => s + Math.max(0, Math.min(r.r, q.r) - Math.max(r.l, q.l)) * Math.max(0, Math.min(r.b, q.b) - Math.max(r.t, q.t)), 0);
      let best = null, bestS = Infinity, bestH = Infinity;
      for (const c of kand) { const r = rect(c); const h = fl(r, hart); const st = h * 3 + fl(r, weich) + (r.t < 2 || r.b > FL.h - 2 ? 5000 : 0); if (st < bestS) { best = c; bestS = st; bestH = h; } if (st === 0) break; }
      // schmal und kein Platz: der Name erscheint erst beim Antippen oder Heranzoomen
      if (schmal() && bestH > 4 && !n.gewaehlt && !n.hover) continue;
      hart.push(rect(best));
      const t = sEl('text', { x: f1(best.x), y: f1(best.y + gr * 0.92 * sfak), class: `ort-name${n.gewaehlt ? ' gewaehlt' : ''}${n.leise ? ' leise' : ''}`, 'text-anchor': best.a }, gSchrift);
      zeilen.forEach((z, j) => { const ts = sEl('tspan', { x: f1(best.x), dy: j ? '1.15em' : '0' }, t); ts.textContent = z; });
    }
  }
  function umbruch(t, n) {
    const w = t.split(' ');
    const out = [''];
    for (const x of w) { if ((out[out.length - 1] + ' ' + x).trim().length > n && out[out.length - 1]) out.push(x); else out[out.length - 1] = (out[out.length - 1] + ' ' + x).trim(); }
    return out.slice(0, 4);
  }

  /* ---------------- Schlüsselbart am Feldrand: „Unter welcher Voraussetzung?“ ---------------- */
  function baueVoraus() {
    vergiss();
    mitFokus(() => {
      vorausEl.innerHTML = '';
      const kopfV = hEl('p', 'voraus-frage', vorausEl, 'Unter welcher Voraussetzung?');
      kopfV.id = 'voraus-frage';
      const bart = hEl('div', 'bart', vorausEl);
      bart.setAttribute('role', 'radiogroup');
      bart.setAttribute('aria-labelledby', 'voraus-frage');
      // Silhouette: Reide (Ring), Halm, Bart mit vier Zähnen und einem Kontext-Hebel am Ende
      const bild = sEl('svg', { class: 'bart-bild', viewBox: '0 0 300 74', 'aria-hidden': 'true', preserveAspectRatio: 'xMinYMid meet' }, bart);
      sEl('circle', { cx: '26', cy: '30', r: '20', fill: 'none', stroke: '#2a3260', 'stroke-width': '5' }, bild);
      sEl('circle', { cx: '26', cy: '30', r: '8', fill: 'none', stroke: '#2a3260', 'stroke-width': '2', 'stroke-opacity': '0.5' }, bild);
      sEl('path', { d: 'M46,26 L292,26 L292,34 L46,34 Z', fill: '#2a3260' }, bild);
      const xs = { lesart: 82, beleg: 132, grenze: 182, wort: 232, kontext: 276 };
      const hoehe = { lesart: 28, beleg: 20, grenze: 34, wort: 16, kontext: 24 };
      for (const s of SLOTS) {
        const x = xs[s], h = hoehe[s];
        const an = S.voraus === s;
        if (s === 'kontext') sEl('path', { d: `M${x - 10},34 L${x - 10},${34 + h - 6} Q${x - 10},${34 + h} ${x - 4},${34 + h} L${x + 12},${34 + h - 8} L${x + 12},34 Z`, class: `zahn-pfad hebel${an ? ' an' : ''}` }, bild);
        else sEl('path', { d: `M${x - 18},34 L${x - 18},${34 + h - 6} Q${x - 18},${34 + h} ${x - 12},${34 + h} L${x + 12},${34 + h} Q${x + 18},${34 + h} ${x + 18},${34 + h - 6} L${x + 18},34 Z`, class: `zahn-pfad${an ? ' an' : ''}` }, bild);
      }
      for (const s of SLOTS) {
        const b = knopf(`zahn zahn-${s}${S.voraus === s ? ' an' : ''}`, bart, SLOT_NAME[s], () => { S.voraus = S.voraus === s ? null : s; if (S.voraus) S.wahl = null; camZiel(); baueVoraus(); baueSpalte(); lauf(); zeichneFeld(); }, `zahn|${s}`);
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', String(S.voraus === s));
        b.style.left = `${((xs[s] - (s === 'kontext' ? 14 : 22)) / 300) * 100}%`;
        b.style.width = `${((s === 'kontext' ? 34 : 44) / 300) * 100}%`;
      }
      const text = hEl('p', 'voraus-text', vorausEl);
      if (!S.voraus) text.textContent = 'Wähle einen Zahn. Arme, denen nur er noch fehlt, strecken sich und leuchten; schwächer die, denen danach noch einer fehlt.';
      else {
        const nur = FELD_PAARE.filter((i) => fehltNur(i, S.voraus));
        const zwei = FELD_PAARE.filter((i) => fehltMitEinem(i, S.voraus));
        if (S.voraus === 'kontext') text.textContent = nur.length ? 'Leuchtend: Fugen, die unter einer Bedingung einrasten könnten – ihnen fehlt genau Beleg, Grenze oder Wort. Die Lage ändert sich, nicht der Ort.' : 'Gerade könnte keine Fuge allein durch eine Bedingung einrasten. Eine Bedingung ersetzt nie die Lesart.';
        else text.textContent = nur.length ? `Leuchtend: Fugen, denen nur noch ${SLOT_NAME[S.voraus]} fehlt. Schwächer: danach fehlt noch einer.` : zwei.length ? `Keiner Fuge fehlt nur ${SLOT_NAME[S.voraus]}. Schwach leuchten die, denen danach noch einer fehlt.` : `Gerade fehlt keiner Fuge ${SLOT_NAME[S.voraus]} als letzter Zahn.`;
      }
    });
  }

  /* ---------------- Bewegung ---------------- */
  let rafId = 0, letzte = 0;
  function lauf() { if (!rafId) rafId = requestAnimationFrame(schritt); }
  function schritt(t) {
    rafId = 0;
    vergiss();
    const dt = Math.min(0.05, (t - (letzte || t)) / 1000);
    letzte = t;
    zeit = t;
    let weiter = false;
    if (S.ansicht === 'feld') {
      for (const a of ARME) {
        const z = armZiel(a);
        if (!lebendig()) { a.len = z; a.tween = null; continue; }
        if (a.tween) {
          const tw = a.tween;
          const u = clamp((t - tw.start) / tw.dauer, 0, 1);
          if (t < tw.start) a.len = tw.von;
          else if (tw.art === 'wachsen') a.len = tw.von + (tw.zu - tw.von) * glatt(u);
          else a.len = tw.zu + (tw.von - tw.zu) * Math.pow(1 - u, 3) * Math.cos(u * 7) ; // zurückschnellen mit Nachschwingen
          a.len = clamp(a.len, 0.02, 1);
          if (u >= 1) a.tween = null;
          weiter = true;
        } else if (Math.abs(a.len - z) > 0.002) { a.len += (z - a.len) * Math.min(1, dt * (z > a.len ? 3.2 : 7)); weiter = true; } else a.len = z;
      }
      if (lebendig() && CAM.ziel) {
        for (const k of ['cx', 'cy', 'k']) {
          const d = CAM.ziel[k] - CAM[k];
          if (Math.abs(d) > (k === 'k' ? 0.05 : 0.001)) { CAM[k] += d * Math.min(1, dt * 4); weiter = true; } else CAM[k] = CAM.ziel[k];
        }
      }
      if (lebendig()) weiter = true; // Fasern wiegen, Membranen atmen
      zeichneFeld();
    } else if (S.ansicht === 'schloss') {
      weiter = zeichneMechanik(t) || weiter;
    }
    if (weiter && !document.hidden) lauf();
  }
  // Frische Ereignisse aus dem Schloss im Feld nachspielen – erst nach der Überblendung
  function frischeImFeld() {
    const start = jetzt() + 420;
    for (const i of FELD_PAARE) {
      const e = ein(i);
      if (!e.frisch) continue;
      const an = AN[i];
      if (lebendig()) {
        if (e.frisch === 'hak') {
          for (const a of ARME.filter((x) => x.i === i)) { const von = Math.min(a.len, 0.5); a.len = von; a.tween = { art: 'wachsen', von, zu: 1, start, dauer: 1200 }; }
          an.hak = start + 1200; an.riss = 0;
        } else if (e.frisch === 'riss') {
          for (const a of ARME.filter((x) => x.i === i)) { a.len = 1; a.tween = { art: 'schnellen', von: 1, zu: armZiel(a), start, dauer: 520 }; }
          an.riss = start; an.hak = 0;
        }
      } else { an.hak = 0; an.riss = 0; for (const a of ARME.filter((x) => x.i === i)) { a.len = armZiel(a); a.tween = null; } }
    }
    // die Meldung leuchtet noch einmal an der Fuge im Feld, wenn das Ereignis hier nachgespielt wird
    if (S.licht && FELD_PAARE.includes(S.licht.i) && S.paare[S.licht.i].frisch) {
      S.licht.start = lebendig() ? start + 900 : jetzt();
      clearTimeout(lichtTimer);
      lichtTimer = setTimeout(() => { S.licht = null; if (S.ansicht === 'feld') zeichneFeld(); }, 5200 + (lebendig() ? 1300 : 0));
    }
    for (const e of S.paare) e.frisch = null;
  }

  /* ================= Lesespalte ================= */
  function waehle(w) {
    if (S.ansicht !== 'feld') return;
    const gleich = w && S.wahl && w.art === S.wahl.art && w.k === S.wahl.k;
    S.wahl = gleich ? null : w;
    if (w) S.voraus = null;
    camZiel();
    baueVoraus();
    baueSpalte();
    zeichneFeld();
  }
  function armGlyphe(eltern, art, farbeArm) {
    const s = sEl('svg', { class: 'glyphe', viewBox: '0 0 64 22', 'aria-hidden': 'true' }, eltern);
    const pk = []; for (let x = 4; x <= 58; x += 2) pk.push([x, 11]);
    zeichneArmForm(s, pk, art, farbeArm, 2.2, 0.6, false);
    return s;
  }
  function baueSpalte() {
    vergiss();
    mitFokus(() => {
      spalte.innerHTML = '';
      const w = S.wahl;
      if (!w) return spalteStart();
      if (w.art === 'ort') return spalteOrt(w.k);
      if (w.art === 'naht') return spalteNaht(w.k);
      if (w.art === 'fehl') return spalteFehl(w.k);
      if (w.art === 'fuge') return spalteFuge(w.k);
      if (w.art === 'lesen') return spalteLesen();
    });
  }
  function zurueckZeile() {
    return knopf('spalte-zurueck', spalte, '← ganzes Feld', () => { S.wahl = null; camZiel(); baueSpalte(); zeichneFeld(); }, 'zurueck|');
  }
  function spalteStart() {
    hEl('p', 'spalte-lead', spalte, 'Jeder Ort ist ein Körper, geformt aus seinen Fugen. Aus jeder Fuge läuft ein Faserbündel zum Partner – dicht, so weit die Voraussetzungen tragen, dann franst es aus.');
    hEl('p', 'spalte-hinweis', spalte, 'Tippe einen Körper an, um ihn nah zu lesen. Tippe eine Faser an, um die Fuge zu betreten.');
    knopf('regeln-link', spalte, 'Wie lese ich das Feld?', () => waehle({ art: 'lesen' }), 'lesen|');
  }
  function spalteLesen() {
    zurueckZeile();
    hEl('h2', 'ort-titel klein', spalte, 'Wie lese ich das Feld?');
    hEl('p', 'spalte-hinweis', spalte, 'Wie weit eine Faser dicht bleibt, folgt nur ihren Voraussetzungen. Danach franst sie aus und verblasst bis zum Treffpunkt. Der Abstand entscheidet nie. Passung ist deine Lesart, kein fachlicher Befund.');
    const ul = hEl('ul', 'legende', spalte);
    for (const art of ['annaeherung', 'zusammenhang', 'spannung', 'widerspruch', 'abstand', 'uebergang', 'aussage', 'offen']) {
      const li = hEl('li', '', ul);
      armGlyphe(li, art, '#2f45d6');
      hEl('span', '', li, FORM_NAME[art]);
    }
    const koerper = [['Ausbuchtung', 'eine verbindende Fuge in dieser Richtung'], ['Kerbe', 'Gegenpol, Widerspruch oder Abstand'], ['Delle mit Ring', 'eine offene Frage']];
    const ul2 = hEl('ul', 'legende-text', spalte);
    for (const [a, b] of koerper) { const li = hEl('li', '', ul2); hEl('b', '', li, a); hEl('span', '', li, ` – ${b}`); }
    const ul3 = hEl('ul', 'legende-text', spalte);
    for (const [a, b] of [['Goldknoten', 'eingerastet'], ['Goldnaht mit Spalt', 'erloschen, gekittet'], ['Sperrbalken', 'bestritten'], ['Ring um den Knoten', 'offen gelassen']]) { const li = hEl('li', '', ul3); hEl('b', '', li, a); hEl('span', '', li, ` – ${b}`); }
  }
  // Das Zitat eines Orts mit drei Lesestellen am Rand: erlebt · unterschieden · Spielraum (nur, wo der Bestand etwas hat)
  let zitatEl = null;
  function zitatBlock(eltern, o) {
    const block = hEl('div', 'zitat-ort', eltern);
    const stellen = hEl('div', 'lesestellen', block);
    stellen.setAttribute('role', 'radiogroup');
    stellen.setAttribute('aria-label', 'Blickrichtung am Text');
    const da = ['innen', 'aussen', 'spielraum'].filter((b) => (o.blick[b] || []).length);
    for (const b of da) {
      const k = knopf(`lesestelle stelle-${b}${PROFIL.blick === b ? ' an' : ''}`, stellen, BLICK_STELLE[b], () => PROFIL.setze({ blick: b }), `stelle|${b}`);
      k.setAttribute('role', 'radio');
      k.setAttribute('aria-checked', String(PROFIL.blick === b));
      k.setAttribute('aria-label', BLICK_LANG[b]);
    }
    const textEl = hEl('div', `zitat-text blick-${PROFIL.blick}`, block);
    fuelleZitat(textEl, o);
    zitatEl = { textEl, o, block };
    return block;
  }
  function fuelleZitat(textEl, o) {
    textEl.innerHTML = '';
    const blick = (o.blick[PROFIL.blick] || []).length ? PROFIL.blick : 'innen';
    const teile = blickTeile(o, blick);
    if (!teile.length) hEl('p', 'blick-leer', textEl, 'Dazu sagt der Bestand nichts.');
    teile.forEach((t, j) => {
      const ab = hEl('div', 'blick-abschnitt', textEl);
      hEl('span', 'blick-quelle', ab, t.abschnitt === 'Kurztext' ? 'Kurztext' : `aus „${t.abschnitt}“`);
      haltbarerText(ab, t, 'blick-absatz', `ki|${j}`);
    });
    if (teile.length) {
      const ende = hEl('p', 'umfang-zeile', textEl);
      const voll = o.blick[blick] || [];
      const mehrDa = PROFIL.umfang === 'kern' ? teile.some((t) => t.gekuerzt) || voll.length > 1 : PROFIL.umfang === 'mehr' ? voll.length > 1 : false;
      if (mehrDa) knopf('umfang-wort', ende, 'weiterlesen ↓', () => PROFIL.setze({ umfang: PROFIL.umfang === 'kern' ? 'mehr' : 'ganz' }), 'umfang|mehr');
      if (PROFIL.umfang !== 'kern') knopf('umfang-wort', ende, 'kürzer ↑', () => PROFIL.setze({ umfang: 'kern' }), 'umfang|kern');
      const sp = hEl('span', 'sprach-zeile', ende);
      hEl('span', '', sp, 'Sprache ');
      dreher(sp, 'niveau', NIVEAU_WORT, 'Sprache');
    }
  }
  // Text wechselt am Platz, mit Überblendung (ruhig: sofort)
  function aktualisiereZitat() {
    if (!zitatEl || !zitatEl.block.isConnected) return false;
    const { textEl, o, block } = zitatEl;
    for (const k of block.querySelectorAll('.lesestelle')) { const an = k.classList.contains(`stelle-${PROFIL.blick}`); k.classList.toggle('an', an); k.setAttribute('aria-checked', String(an)); }
    const tausche = () => mitFokus(() => { textEl.className = `zitat-text blick-${PROFIL.blick}`; fuelleZitat(textEl, o); textEl.classList.remove('blende'); });
    if (lebendig()) { textEl.classList.add('blende'); setTimeout(tausche, 220); } else tausche();
    return true;
  }
  function spalteOrt(k) {
    const o = D.orte[k];
    zurueckZeile();
    const kopfO = hEl('div', 'ort-kopf', spalte);
    kopfO.style.color = farbe(o).tief;
    kopfO.textContent = `${o.gebiet}${o.ortsart ? ' · ' + o.ortsart : ''}`;
    hEl('h2', 'ort-titel', spalte, o.titel);
    zitatBlock(spalte, o);
    for (const f of FEHL.filter((x) => x.orte.includes(k))) {
      const b = knopf('fehl-hinweis', spalte, '', () => waehle({ art: 'fehl', k: f.k }), `fehlhinweis|${f.k}`);
      hEl('span', 'fehl-ring', b);
      hEl('span', '', b, `Daneben eine hohle Stelle: ${f.label} „${f.gegen}“ – ohne festgehaltenen Befund.`);
    }
    hEl('p', 'dock-text', spalte, 'Seine Fasern sind im Feld beschriftet. Eine antippen betritt die Fuge.');
  }
  function spalteNaht(k) {
    const n = NAEHTE.find((x) => x.k === k);
    zurueckZeile();
    hEl('div', 'ort-kopf', spalte, 'Naht');
    const h = hEl('h2', 'ort-titel naht-titel', spalte);
    hEl('span', '', h, 'Zwischen ');
    const a = hEl('span', '', h, n.a); a.style.color = farbeG(n.a).tief;
    hEl('span', '', h, ' und ');
    const b = hEl('span', '', h, n.b); b.style.color = farbeG(n.b).tief;
    hEl('p', 'spalte-lead klein', spalte, 'Hier reichen Fasern über die Naht zwischen zwei Gebieten. Sie sind im Feld beschriftet; eine antippen betritt die Fuge.');
    if (n.paare.some((i) => ein(i).kitt || ein(i).eingerastet)) hEl('p', 'dock-text', spalte, 'Goldene Stiche an der Naht: hier ist schon einmal etwas eingerastet.');
  }
  function spalteFehl(kf) {
    const f = FEHL[kf];
    zurueckZeile();
    hEl('div', 'ort-kopf', spalte, `Fehlstelle · ${f.gebiet}`);
    hEl('h2', 'ort-titel', spalte, 'Hier fehlt ein festgehaltener Befund');
    hEl('p', 'spalte-lead klein', spalte, `${f.orte.map((k) => D.orte[k].titel).join(' und ')}: ${f.label} „${f.gegen}“. Der Bestand hält dazu keinen Befund fest.`);
    if (f.detail) hEl('blockquote', 'zitat', spalte, f.detail);
    hEl('p', 'dock-text', spalte, `Gebildet aus: ${f.gebildetAus}. Die hohle Stelle ist kein Fehler des Felds; sie zeigt, wo der Bestand selbst eine Lücke nennt.`);
  }
  function spalteFuge(i) {
    const v = verbSatz(i);
    zurueckZeile();
    hEl('div', 'ort-kopf', spalte, 'Fuge');
    const h = hEl('h2', 'ort-titel naht-titel', spalte);
    const a = hEl('span', '', h, v.subj.titel); a.style.color = farbe(v.subj).tief;
    hEl('span', 'vs-verb', h, ` ${v.verb} `);
    const b = hEl('span', '', h, v.obj.titel); b.style.color = farbe(v.obj).tief;
    hEl('p', 'fuge-zustand', spalte, zustandWort(i));
    hEl('p', 'dock-text', spalte, 'Passung ist deine Lesart, kein fachlicher Befund.');
    knopf('regeln-link', spalte, 'Fuge wieder betreten →', () => betrete(i), 'wieder|');
  }

  /* ================= Schloss: Schließzylinder im Querschnitt ================= */
  function betrete(i) {
    if (!paar(i).fugen.length) return;
    S.aktiv = i;
    const z = bewerte(i);
    S.riegel = VIER.find((s) => !z[s].greift && !blockiert(i, s)) || (z.alle ? 'lesart' : VIER.find((s) => !z[s].greift)) || 'lesart';
    S.wortHalb = null;
    S.regelOffen = false;
    S.vorschlag = { grenze: 0, kontext: 0, beleg: 0 };
    MA = null;
    zeigeAnsicht('schloss');
  }
  function zeigeAnsicht(ziel) {
    const vorher = S.ansicht;
    const tauschen = () => {
      S.ansicht = ziel;
      feldAnsicht.hidden = ziel !== 'feld';
      schlossAnsicht.hidden = ziel !== 'schloss';
      raum.classList.toggle('im-schloss', ziel === 'schloss');
      kopfUnter.textContent = ziel === 'schloss' ? 'Eine Fuge betreten: der Schließzylinder zwischen zwei Orten' : 'Unter welchen Voraussetzungen zwei Orte zusammenpassen';
      if (ziel === 'schloss') {
        baueSchloss(); schlossAnsicht.scrollTop = 0; if (window.innerWidth < 700) window.scrollTo(0, 0);
        const f = schlossAnsicht.querySelector('.verbsatz'); if (f) f.focus({ preventScroll: true });
      } else {
        // Rückweg: das Feld zeigt die zuletzt betretene Fuge, Fokus liegt auf ihrer Faser
        if (S.aktiv !== null && vorher === 'schloss') S.wahl = { art: 'fuge', k: S.aktiv };
        messeFeld(); frischeImFeld(); baueVoraus(); baueSpalte(); zeichneFeld(); lauf();
        if (vorher === 'schloss' && S.aktiv !== null) { const a = ersterArm(S.aktiv); const el = a && TR.arm[a.n] && TR.arm[a.n].f; if (el) el.focus({ preventScroll: true }); }
      }
      raum.classList.remove('wechsel');
    };
    if (lebendig() && vorher !== ziel) {
      if (ziel === 'schloss' && S.aktiv !== null) {
        const p = paar(S.aktiv);
        CAM.ziel = { cx: (W[p.a].x + W[p.b].x) / 2, cy: (W[p.a].y + W[p.b].y) / 2, k: CAM.basis.k * 2.6 };
        lauf();
      }
      raum.classList.add('wechsel');
      setTimeout(tauschen, 360);
    } else tauschen();
  }

  let MA = null; // Mechanik-Zustand: Stiftlagen (federnd), Schlüssel-Einschub, Ereignisse
  let MECH = null; // aktuelle DOM-Teile der Mechanik
  function stiftZustand(i, s, z) {
    if (s === 'kontext') return z.kontext.greift ? (z.bedingt ? 'haelt' : 'liegt') : 'frei';
    if (z[s].greift) return 'greift';
    if (z.ersetzt === s) return 'bedingt';
    return blockiert(i, s) ? 'blockiert' : 'fehlt';
  }
  const STIFT_WORT = { greift: 'greift', bedingt: 'nur unter Bedingung', fehlt: 'fehlt', blockiert: 'nicht zu füllen', haelt: 'hält einen Stift', liegt: 'liegt auf', frei: 'zusätzlich' };
  function riegelInhalt(s, i, z) {
    const e = ein(i);
    if (s === 'lesart') return z.lesart.deine ? `„${z.lesart.les.wort}“ – deine Lesart; der Bestand sagt: ${z.lesart.bestand.artWort}` : `„${z.lesart.les.wort}“ – Lesart des Bestands`;
    if (s === 'beleg') return z.beleg.bestand.length ? `Quelle der Fuge: ${z.beleg.bestand[0].titel}` : e.beleg ? `${e.beleg.titel} – ${belegMarke(e.beleg)}` : 'Die Fuge selbst nennt keine Quelle.';
    if (s === 'grenze') return z.grenze.bestand ? `Grenze der Fuge: ${z.grenze.bestand}` : e.grenze ? `„${e.grenze.text}“ – ${grenzMarke(e.grenze)}` : 'Die Fuge nennt keine eigene Grenze.';
    if (s === 'wort') return z.wort.auto.length ? `gemeinsames Wort: ${z.wort.auto.map((w) => w.roh).slice(0, 3).join(', ')}` : e.wort ? `deine Übersetzung: ${e.wort.a} = ${e.wort.b}` : 'Die Kurztexte teilen kein Wort.';
    if (s === 'kontext') return e.kontext ? `${z.bedingt ? `hält ${SLOT_NAME[z.ersetzt]} – nur unter` : 'zusätzlich unter'} „${e.kontext.text}“` : 'Kein Pflichtstift. Hält einen fehlenden Beleg, eine Grenze oder ein Wort „nur unter“ einer Bedingung.';
    return '';
  }
  const REGEL = {
    lesart: 'Greift nur bei „Nähe“ oder „könnte zusammenhängen“. Lesarten kommen aus der Bestandsfuge und aus Sätzen der beiden Orte, in denen einer den anderen nennt.',
    beleg: 'Greift, wenn die Fuge selbst Quellen nennt. Die Quelle eines Orts kannst du auflegen – sie bleibt dann gekennzeichnet als deine Lesart.',
    grenze: 'Greift bei einer Grenze der Fuge oder einem Satz, der beide nennt. Die Grenze eines einzelnen Orts oder der Vermerk greift nur, wenn du sie bewusst als deine Grenze auflegst.',
    wort: 'Greift, wenn beide Kurztexte ein Wort teilen (gleicher Stamm, ohne Füllwörter und Titel) oder wenn du je ein Wort als Übersetzung ablegst.',
    kontext: 'Kein Pflichtstift. Fehlt genau einer der Stifte Beleg, Grenze oder Wort, kann eine Bedingung ihn halten – dann rastet die Fuge nur unter ihr ein. Die Lesart ersetzt sie nie. Nimmst du die Bedingung ab, erlischt die bedingte Passung mit Kittspur.',
  };

  function baueSchloss() {
    vergiss();
    mitFokus(() => {
      const i = S.aktiv;
      const p = paar(i), e = ein(i), z = bewerte(i);
      schlossAnsicht.innerHTML = '';
      const leiste = hEl('div', 'schloss-leiste', schlossAnsicht);
      knopf('zurueck-feld', leiste, '← zurück ins Feld', () => zeigeAnsicht('feld'), 'zurueckfeld|');
      const v = verbSatz(i);
      const vs = hEl('h2', 'verbsatz', schlossAnsicht);
      vs.tabIndex = -1;
      const o1 = hEl('span', 'vs-ort', vs, v.subj.titel); o1.style.color = farbe(v.subj).tief;
      hEl('span', 'vs-punkt', vs, ' · ');
      hEl('span', 'vs-verb', vs, v.verb);
      hEl('span', 'vs-punkt', vs, ' · ');
      const o2 = hEl('span', 'vs-ort', vs, v.obj.titel); o2.style.color = farbe(v.obj).tief;

      // Was die Fuge meint, steht am Stift Lesart, wo sie endet am Stift Grenze – kein Vorspann über dem Zylinder.

      const quer = hEl('div', `querschnitt${e.eingerastet ? ' eingerastet' : ''}${spaltBleibt(i) ? ' spalt' : ''}`, schlossAnsicht);
      const wandA = hEl('div', 'wand wand-a', quer);
      const wandB = hEl('div', 'wand wand-b', quer);
      const mitte = hEl('div', 'schwelle', quer);
      baueWand(wandA, p.A, i, 'L');
      baueWand(wandB, p.B, i, 'K');
      const mech = hEl('div', 'mechanik', mitte);
      const bild = sEl('svg', { class: 'mechanik-bild', 'aria-hidden': 'true' }, mech);
      const stifte = hEl('div', 'stifte', mech);
      stifte.setAttribute('role', 'group');
      stifte.setAttribute('aria-label', 'Vier Stifte und der Kontext-Hebel');
      const knoepfe = {};
      for (const s of SLOTS) {
        const st = stiftZustand(i, s, z);
        const b = knopf(`stift stift-${s} st-${st}${S.riegel === s ? ' gewaehlt' : ''}`, stifte, '', () => { S.riegel = s; S.wortHalb = null; S.regelOffen = false; baueSchloss(); }, `stift|${s}`);
        b.setAttribute('aria-pressed', String(S.riegel === s));
        b.setAttribute('aria-label', `${SLOT_NAME[s]}: ${STIFT_WORT[st]}. ${riegelInhalt(s, i, z)}`);
        hEl('span', 'stift-name', b, SLOT_NAME[s]);
        hEl('span', 'stift-wort', b, STIFT_WORT[st]);
        knoepfe[s] = b;
      }
      const schild = hEl('div', 'stift-schild', mech);
      schild.setAttribute('aria-hidden', 'true');
      hEl('span', 'schild-name', schild, `${SLOT_NAME[S.riegel]} · ${STIFT_WORT[stiftZustand(i, S.riegel, z)]}`);
      hEl('span', 'schild-text', schild, riegelInhalt(S.riegel, i, z));
      const griffe = {};
      if (e.eingerastet && !e.entscheidung) {
        for (const [art, wort, zeichen] of [['gefasst', 'fassen', 'naht'], ['bestritten', 'bestreiten', 'balken'], ['offen', 'offen lassen', 'ring']]) {
          const g = knopf(`griff griff-${art}`, mech, '', () => { entscheide(i, art); baueSchloss(); }, `griff|${art}`);
          const gs = sEl('svg', { class: 'griff-zeichen', viewBox: '0 0 28 28', 'aria-hidden': 'true' }, g);
          if (zeichen === 'naht') { sEl('path', { d: 'M3,20 Q14,6 25,10', fill: 'none', stroke: '#d29a00', 'stroke-width': '4', 'stroke-linecap': 'round' }, gs); for (const x of [8, 14, 20]) sEl('path', { d: `M${x},${x === 14 ? 9 : x === 8 ? 12 : 8} l2,6`, stroke: '#8f6400', 'stroke-width': '1.4' }, gs); }
          if (zeichen === 'balken') sEl('rect', { x: '11', y: '2', width: '6', height: '24', rx: '1', fill: '#1f2547', transform: 'rotate(18 14 14)' }, gs);
          if (zeichen === 'ring') sEl('circle', { cx: '14', cy: '14', r: '9', fill: 'none', stroke: '#4b5378', 'stroke-width': '2.4', 'stroke-dasharray': '4 3' }, gs);
          hEl('span', 'griff-wort', g, wort);
          g.setAttribute('aria-label', `${wort}: ${FOLGE[art]}`);
          griffe[art] = g;
        }
      }

      const haengen = hEl('div', 'haengen', mitte);
      const versuch = hEl('section', 'versuch', haengen);
      const wirkung = hEl('section', 'wirkung', haengen);
      const fadenV = hEl('span', 'faden faden-v', haengen);
      const fadenW = hEl('span', 'faden faden-w', haengen);
      baueVersuch(versuch, i, z);
      baueWirkung(wirkung, i, z);
      MECH = { i, mech, bild, knoepfe, schild, griffe, fadenV, fadenW, haengen, quer };
      if (!MA || MA.i !== i) MA = { i, ein: lebendig() ? 0 : 1, start: jetzt(), stift: {}, v: {}, hak: 0, riss: 0, dreh: e.eingerastet ? 1 : 0 };
      if (e.frischS === 'hak') { MA.hak = jetzt(); MA.riss = 0; }
      if (e.frischS === 'riss') { MA.riss = jetzt(); MA.hak = 0; }
      e.frischS = null;
    });
    requestAnimationFrame(() => { zeichneMechanik(jetzt()); lauf(); });
  }
  function baueWand(el, ort, i, seite) {
    const c = farbe(ort);
    el.style.setProperty('--wand', c.tief);
    el.style.setProperty('--wand-hauch', c.hauch);
    hEl('div', 'wand-gebiet', el, kurzG(ort.gebiet));
    hEl('h3', 'wand-titel', el, ort.titel);
    const wortModus = S.riegel === 'wort';
    const z = bewerte(i);
    const auto = z.wort.auto;
    const aus = titelWoerter(paar(i).A.titel, paar(i).B.titel);
    if (!wortModus) {
      const f = kurzFassung(ort);
      // markierte gemeinsame Wörter nur im Original
      if (f.ki) { haltbarerText(el, f, 'wand-text', `wandki|${seite}`); wandLesart(el, ort, z); return; }
      const txt = hEl('p', 'wand-text', el);
      let pos = 0;
      for (const t of tokens(f.text)) {
        txt.appendChild(document.createTextNode(f.text.slice(pos, t.start)));
        const geteilt = auto.some((w) => (seite === 'L' ? w.a : w.b) === t.klein);
        const dein = z.wort.dein && (seite === 'L' ? z.wort.dein.a : z.wort.dein.b) === t.roh;
        hEl('span', geteilt ? 'wort-geteilt' : dein ? 'wort-dein' : '', txt, t.roh);
        pos = t.ende;
      }
      txt.appendChild(document.createTextNode(f.text.slice(pos)));
      if (f.fehlt) el.insertBefore(hEl('span', 'ki-fehlt', null, FEHLT_WORT[f.niveau]), txt);
      wandLesart(el, ort, z);
      return;
    }
    const text = ort.kurz;
    const txt = hEl('p', 'wand-text', el);
    let pos = 0;
    for (const t of tokens(text)) {
      txt.appendChild(document.createTextNode(text.slice(pos, t.start)));
      const geteilt = auto.some((w) => (seite === 'L' ? w.a : w.b) === t.klein);
      const dein = z.wort.dein && (seite === 'L' ? z.wort.dein.a : z.wort.dein.b) === t.roh;
      const halb = S.wortHalb && S.wortHalb.seite === seite && S.wortHalb.wort === t.roh;
      if (zaehltHand(t.klein, aus)) {
        const b = knopf(`wort${geteilt ? ' geteilt' : ''}${dein ? ' dein' : ''}${halb ? ' halb' : ''}`, txt, t.roh, () => wortTippen(i, seite, t.roh), `wort|${seite}|${t.roh}`);
        b.setAttribute('aria-label', `Wort ${t.roh} ${seite === 'L' ? 'links' : 'rechts'} ablegen`);
      } else hEl('span', geteilt ? 'wort-geteilt' : dein ? 'wort-dein' : '', txt, t.roh);
      pos = t.ende;
    }
    txt.appendChild(document.createTextNode(text.slice(pos)));
    hEl('p', 'wand-hinweis', el, 'Wörter nur aus dem Original-Kurztext');
  }
  // Beim Stift Lesart: der Satz, in dem dieser Ort den anderen nennt, steht in seiner eigenen Wand (Original)
  function wandLesart(el, ort, z) {
    if (S.riegel !== 'lesart') return;
    for (const bl of z.lesart.les.belege.slice(0, 3).filter((x) => x.woher === ort.titel)) {
      const q = hEl('blockquote', 'wand-satz', el);
      hEl('span', 'wand-satz-woher', q, bl.abschnitt);
      q.appendChild(document.createTextNode(`„${bl.satz}“`));
    }
  }
  function wortTippen(i, seite, wort) {
    const e = ein(i);
    if (!S.wortHalb || S.wortHalb.seite === seite) { S.wortHalb = { seite, wort }; baueSchloss(); return; }
    const a = seite === 'L' ? wort : S.wortHalb.wort, b = seite === 'K' ? wort : S.wortHalb.wort;
    e.wort = { art: 'uebersetzung', a, b };
    S.wortHalb = null;
    nachAenderung(i, 'Wort geändert');
    baueSchloss();
  }

  function stein(eltern, v, opt) {
    const st = hEl('div', `stein${opt.liegt ? ' liegt' : ''}${opt.gekennzeichnet ? ' gekennzeichnet' : ''}`, eltern);
    hEl('span', 'stein-marke', st, opt.marke);
    const t = hEl('p', 'stein-text', st, opt.text);
    if (v && v.satz && v.satz !== opt.text) {
      const f = knopf('fundstelle', st, `ganzer Satz · ${v.woher}${v.abschnitt ? ' · ' + v.abschnitt : ''}`, () => {
        const offen = st.classList.toggle('zeigt-satz');
        t.textContent = offen ? `„${v.satz}“` : opt.text;
        f.setAttribute('aria-expanded', String(offen));
      }, 'fundstelle|');
      f.setAttribute('aria-expanded', 'false');
    } else if (v && v.woher && !opt.marke.includes(v.woher)) hEl('span', 'stein-woher', st, `aus ${v.woher}${v.abschnitt ? ' · ' + v.abschnitt : ''}`);
    const tun = hEl('div', 'stein-tun', st);
    for (const [wort, fn, cls] of opt.tun || []) knopf(`stein-knopf ${cls || ''}`, tun, wort, fn, `stein|${wort}`);
    if (opt.ziehbar) macheZiehbar(st, opt.ziehbar);
    return st;
  }
  // Stein mit Maus oder Finger auf den Stift ziehen; am Rand scrollt die Seite mit
  function macheZiehbar(st, fertig) {
    let start = null, scrollZug = 0, letzt = null;
    st.classList.add('ziehbar');
    const ziel = () => (MECH && MECH.knoepfe[S.riegel]) || null;
    const ueber = (x, y) => { const r = ziel(); if (!r) return false; const b = r.getBoundingClientRect(); return x > b.left - 30 && x < b.right + 30 && y > b.top - 30 && y < b.bottom + 30; };
    const scroller = () => (window.innerWidth < 700 ? document.scrollingElement : schlossAnsicht);
    const randScroll = () => {
      if (!start || !letzt) return;
      const y = letzt.y;
      const d = y < 70 ? -14 : y > window.innerHeight - 70 ? 14 : 0;
      if (d) {
        const sc = scroller();
        const vor = sc.scrollTop;
        sc.scrollTop += d;
        start.y -= sc.scrollTop - vor;
        st.style.transform = `translate(${letzt.x - start.x}px, ${letzt.y - start.y}px) rotate(-1.5deg)`;
      }
      scrollZug = requestAnimationFrame(randScroll);
    };
    st.addEventListener('pointerdown', (ev) => {
      if (ev.target.closest('button')) return;
      start = { x: ev.clientX, y: ev.clientY };
      letzt = { x: ev.clientX, y: ev.clientY };
      st.setPointerCapture(ev.pointerId);
      st.classList.add('zieht');
      scrollZug = requestAnimationFrame(randScroll);
    });
    st.addEventListener('pointermove', (ev) => {
      if (!start) return;
      letzt = { x: ev.clientX, y: ev.clientY };
      st.style.transform = `translate(${ev.clientX - start.x}px, ${ev.clientY - start.y}px) rotate(-1.5deg)`;
      const r = ziel();
      if (r) r.classList.toggle('ziel', ueber(ev.clientX, ev.clientY));
    });
    const ende = (ev, gilt) => {
      if (!start) return;
      cancelAnimationFrame(scrollZug);
      const treffer = gilt && ueber(ev.clientX, ev.clientY);
      start = null; letzt = null;
      st.classList.remove('zieht');
      st.style.transform = '';
      const r = ziel();
      if (r) r.classList.remove('ziel');
      if (treffer) fertig();
    };
    st.addEventListener('pointerup', (ev) => ende(ev, true));
    st.addEventListener('pointercancel', (ev) => ende(ev, false));
  }
  function eigenesWort(eltern, platzhalter, fn, schluessel) {
    const f = hEl('form', 'eigen', eltern);
    const l = hEl('label', 'eigen-label', f, 'oder ein eigenes Wort ablegen');
    const inp = hEl('input', 'eigen-feld', l);
    inp.type = 'text'; inp.maxLength = 80; inp.placeholder = platzhalter; inp.autocomplete = 'off';
    inp.dataset.schluessel = `eigen|${schluessel}`;
    inp.value = ENTWURF[schluessel] || '';
    inp.addEventListener('input', () => { ENTWURF[schluessel] = inp.value; });
    // Escape im Feld: nur den Fokus abgeben – nichts verwerfen, das Schloss nicht verlassen
    inp.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); inp.blur(); } });
    f.addEventListener('submit', (ev) => { ev.preventDefault(); const t = inp.value.trim(); if (t) { ENTWURF[schluessel] = ''; fn(t); } });
    hEl('span', 'eigen-tipp', f, '↵ legt ab');
  }
  const ENTWURF = {}; // ungesendete eigene Wörter, nur im Speicher dieser Seite
  function regelZeile(el, s) {
    const z = hEl('div', 'regel-zeile', el);
    const b = knopf('klein-link', z, S.regelOffen ? 'Regel schließen' : 'Warum greift er – oder nicht?', () => { S.regelOffen = !S.regelOffen; baueSchloss(); }, 'regel|');
    b.setAttribute('aria-expanded', String(S.regelOffen));
    if (S.regelOffen) hEl('p', 'regel-text', z, REGEL[s]);
  }
  function baueVersuch(el, i, z) {
    const s = S.riegel;
    const e = ein(i);
    hEl('h3', 'spalten-titel', el, `Versuch · ${SLOT_NAME[s]}`);
    const neu = (was) => { nachAenderung(i, was); baueSchloss(); };
    if (s === 'lesart') {
      const les = z.lesart.les;
      if (z.lesart.deine) {
        const d = hEl('p', 'versuch-satz deine', el);
        hEl('b', '', d, `„${les.wort}“ ist deine Lesart`);
        d.appendChild(document.createTextNode(` – der Bestand sagt: ${z.lesart.bestand.artWort}.`));
      } else hEl('p', 'versuch-satz', el, z.lesart.greift ? `„${les.wort}“ greift: diese Lesart lässt beide ineinandergreifen.` : `„${les.wort}“ greift nicht: ${TRENNEND.has(les.art) ? 'diese Lesart hält beide auseinander.' : 'diese Lesart sagt nicht, dass beide zusammengehören.'}`);
      if (les.auchImSatz && les.auchImSatz.length) hEl('p', 'auch-satz', el, `Derselbe Satz sagt auch: ${les.auchImSatz.map((w) => `„${w}“`).join(', ')}.`);
      // Sätze eines Orts stehen in dessen Wand; hier nur die Bestandsfuge selbst
      const ortsTitel = [paar(i).A.titel, paar(i).B.titel];
      for (const bl of les.belege.slice(0, 3).filter((x) => !ortsTitel.includes(x.woher))) {
        const q = hEl('p', 'beleg-satz', el);
        hEl('span', 'beleg-woher', q, bl.woher.startsWith('Bestandsfuge') ? `${bl.woher} · ${bl.geltung || ''}` : `${bl.woher} · ${bl.abschnitt}`);
        q.appendChild(document.createTextNode(`„${bl.satz}“`));
      }
      if (paar(i).lesarten.length > 1) {
        const n = paar(i).lesarten[(e.lesart + 1) % paar(i).lesarten.length];
        knopf('dreh-lesart', el, `Lesart drehen → „${n.wort}“${n.ausBestand ? '' : ' (deine Lesart)'}`, () => { e.lesart = (e.lesart + 1) % paar(i).lesarten.length; neu('die Lesart ist gedreht'); }, 'drehlesart|');
      } else hEl('p', 'ruhig-satz', el, 'Der Bestand bietet für diese Fuge nur diese eine Lesart. Der Spalt bleibt – ein gültiger Zustand, kein Fehler.');
      regelZeile(el, s);
      return;
    }
    if (s === 'beleg') {
      if (z.beleg.bestand.length) {
        hEl('p', 'versuch-satz', el, 'Die Fuge selbst nennt Quellen. Der Stift greift von selbst.');
        for (const q of z.beleg.bestand.slice(0, 3)) stein(el, null, { marke: `Quelle der Fuge · ${q.art}`, text: q.titel, liegt: true });
        regelZeile(el, s);
        return;
      }
      const vs = belegVorschlaege(i);
      if (e.beleg) {
        stein(el, null, { marke: belegMarke(e.beleg), text: e.beleg.titel, liegt: true, gekennzeichnet: true, tun: [['abnehmen', () => { e.beleg = null; neu('der Beleg ist abgenommen'); }]] });
        regelZeile(el, s);
        return;
      }
      if (!vs.length) { hEl('p', 'ruhig-satz', el, 'Keiner der beiden Orte nennt eine Quelle. Dieser Stift bleibt offen.'); regelZeile(el, s); return; }
      hEl('p', 'versuch-satz', el, 'Die Fuge selbst nennt keine Quelle. Ein Ort tut es – seine Quelle belegt den Ort, nicht die Verbindung.');
      vorschlagSteine(el, i, 'beleg', vs.map((x) => ({ ...x, text: x.titel, satz: x.zitat || '', woher: x.von, marke: `Quelle von ${x.von}, nicht der Verbindung · ${x.art}` })), (v) => { e.beleg = { titel: v.titel, von: v.von }; neu('Beleg'); }, false);
      regelZeile(el, s);
      return;
    }
    if (s === 'wort') {
      if (z.wort.auto.length) { hEl('p', 'versuch-satz', el, `Beide Kurztexte teilen ein Wort: ${z.wort.auto.map((w) => (w.roh === w.rohB ? `„${w.roh}“` : `„${w.roh}“ / „${w.rohB}“`)).join(', ')}. Der Stift greift von selbst.`); regelZeile(el, s); return; }
      if (e.wort) {
        stein(el, null, { marke: 'deine Übersetzung', text: `${e.wort.a} = ${e.wort.b}`, liegt: true, tun: [['abnehmen', () => { e.wort = null; neu('die Übersetzung ist abgenommen'); }]] });
        regelZeile(el, s);
        return;
      }
      hEl('p', 'versuch-satz', el, S.wortHalb ? `„${S.wortHalb.wort}“ liegt bereit. Tippe jetzt ein Wort im anderen Ort.` : 'Die Kurztexte teilen kein Wort. Tippe ein Wort im einen Ort und eines im anderen – das ist deine Übersetzung.');
      regelZeile(el, s);
      return;
    }
    // Grenze und Kontext: Stein ablegen
    const bestG = s === 'grenze' ? z.grenze.bestand : '';
    if (bestG) { hEl('p', 'versuch-satz', el, 'Die Fuge nennt ihre Grenze. Der Stift greift von selbst.'); stein(el, null, { marke: 'Grenze der Fuge', text: bestG, liegt: true }); regelZeile(el, s); return; }
    const liegt = s === 'grenze' ? e.grenze : e.kontext;
    const abnehmen = () => {
      if (s === 'grenze') e.grenze = null; else e.kontext = null;
      neu(s === 'kontext' ? 'die Bedingung ist abgenommen, die Lage hat sich geändert' : 'die Grenze ist abgenommen');
    };
    if (liegt) {
      const marke = s === 'grenze' ? grenzMarke(liegt) : liegt.dein ? 'deine Bedingung' : `${liegt.marke} · von dir aufgelegt`;
      stein(el, liegt.dein ? null : liegt, { marke, text: liegt.text, liegt: true, gekennzeichnet: s === 'grenze' && liegt.art !== 'partner', tun: [['abnehmen', abnehmen]] });
      if (s === 'kontext') hEl('p', 'ruhig-satz', el, z.bedingt ? `Diese Bedingung hält den fehlenden Stift ${SLOT_NAME[z.ersetzt]}. Nimmst du sie ab, erlischt die bedingte Passung.` : z.vier ? 'Alle vier Stifte greifen schon; die Bedingung liegt zusätzlich auf.' : 'Eine Bedingung hält höchstens einen fehlenden Stift – und nie die Lesart.');
      regelZeile(el, s);
      return;
    }
    const vs = s === 'grenze' ? grenzVorschlaege(i) : kontextVorschlaege(i);
    hEl('p', 'versuch-satz', el, s === 'kontext'
      ? (z.fehlend.length === 1 && z.fehlend[0] !== 'lesart' ? `Fehlt nur noch ${SLOT_NAME[z.fehlend[0]]}: unter einer Bedingung kann die Fuge trotzdem einrasten – nur unter ihr.` : 'Eine Bedingung ändert die Lage, nicht den Ort. Sie hält höchstens einen fehlenden Stift, nie die Lesart.')
      : 'Wo endet die Aussage dieser Fuge? Lege einen Stein auf den Stift.');
    if (vs.length) vorschlagSteine(el, i, s, vs, (v) => { if (s === 'grenze') e.grenze = { ...v }; else e.kontext = { ...v }; nachAenderung(i, s === 'kontext' ? 'Bedingung' : 'Grenze'); baueSchloss(); }, s === 'grenze');
    else hEl('p', 'ruhig-satz', el, s === 'kontext' ? 'Im Wortlaut steht keine Bedingung für diese Verbindung.' : 'Der Wortlaut gibt hier keine Grenze her.');
    eigenesWort(el, s === 'kontext' ? 'z. B. wenn es um den Start geht' : 'z. B. gilt nur für den Start', (t) => {
      if (s === 'grenze') e.grenze = { text: t, art: 'eigen' }; else e.kontext = { text: t, dein: true };
      nachAenderung(i, s === 'kontext' ? 'Bedingung' : 'Grenze');
      baueSchloss();
    }, `${i}|${s}`);
    regelZeile(el, s);
  }
  // Vorschläge nacheinander; nach dem letzten kein Kreis, sondern ein ruhiger Satz
  function vorschlagSteine(el, i, s, vs, leg, gekennzeichnet) {
    const j = S.vorschlag[s];
    if (j >= vs.length) {
      hEl('p', 'ruhig-satz', el, 'Mehr Vorschläge gibt der Wortlaut nicht her.');
      knopf('klein-link', el, 'Vorschläge noch einmal ansehen', () => { S.vorschlag[s] = 0; baueSchloss(); }, 'vonvorn|');
      return;
    }
    const v = vs[j];
    const nimm = () => leg(v);
    const rest = vs.length - j - 1;
    stein(el, v, { marke: `${v.marke} – gestrichelt, bis du ihn auflegst`, text: v.text, ziehbar: nimm, gekennzeichnet: gekennzeichnet && v.art !== 'partner', tun: [['auflegen', nimm, 'haupt'], ['wegschieben', () => { S.vorschlag[s]++; baueSchloss(); }]] });
    if (gekennzeichnet && v.art !== 'partner') hEl('p', 'stein-hinweis', el, 'Aufgelegt greift er – aber als deine Grenze, nicht als Grenze der Verbindung.');
    if (!rest) hEl('p', 'stein-hinweis', el, 'Das ist der letzte Vorschlag aus dem Wortlaut.');
  }
  const FOLGE = {
    gefasst: 'Eine Goldnaht zieht über den Arm. Er bleibt eingehakt – für deinen Weg, nur in dieser offenen Seite.',
    bestritten: 'Ein Sperrbalken schiebt sich quer in den Zylinder. Die Verbindung löst sich; der Balken bleibt als Spur.',
    offen: 'Ein Ring legt sich um den Knoten: eingehakt, weder Zustimmung noch Widerspruch.',
  };
  function baueWirkung(el, i, z) {
    const e = ein(i);
    hEl('h3', 'spalten-titel', el, 'Wirkung');
    // Lichtschrift: die Meldung leuchtet am Faden, der vom Treffpunkt hierher hängt
    if (S.licht && S.licht.i === i && jetzt() - S.licht.start < 5000) hEl('p', 'licht-zeile', el, S.licht.text).setAttribute('aria-hidden', 'true');
    const kopfW = hEl('p', 'wirkung-wort', el);
    if (e.eingerastet) {
      kopfW.textContent = e.wieder ? 'wieder eingerastet' : 'eingerastet';
      if (z.bedingt) hEl('p', 'wirkung-bedingt', el, `nur unter: „${e.kontext.text}“`);
      if (z.lesart.deine) hEl('p', 'wirkung-gegen', el, `entgegen der Bestandslesart (${z.lesart.bestand.artWort})`);
      if (e.beleg && !z.beleg.bestand.length) hEl('p', 'wirkung-unter', el, `mit einer Quelle von ${e.beleg.von}, nicht der Verbindung`);
      if (e.grenze && e.grenze.art !== 'partner' && !z.grenze.bestand) hEl('p', 'wirkung-unter', el, 'mit deiner Grenze');
      hEl('p', 'wirkung-unter', el, 'deine Lesart, kein fachlicher Befund');
      if (!e.entscheidung) hEl('p', 'wirkung-frage', el, 'Gleicher Gedanke? Greif am Treffpunkt: fassen, bestreiten oder offen lassen.');
      else {
        hEl('p', 'wirkung-entschieden', el, FOLGE[e.entscheidung]);
        knopf('klein-link', el, 'anders entscheiden', () => { e.entscheidung = null; baueSchloss(); }, 'anders|');
      }
    } else if (e.entscheidung === 'bestritten') {
      kopfW.textContent = 'bestritten';
      hEl('p', 'wirkung-unter', el, FOLGE.bestritten);
      hEl('p', 'wirkung-unter', el, 'Ändere eine Voraussetzung, um sie unter neuer Lage noch einmal zu prüfen.');
    } else if (spaltBleibt(i)) {
      kopfW.textContent = 'der Spalt bleibt';
      kopfW.classList.add('ruhig');
      hEl('p', 'wirkung-unter', el, 'Keine Lesart des Bestands lässt beide ineinandergreifen. Das ist ein gültiger Zustand: unvergleichbar, nicht falsch. Auch eine Bedingung ändert daran nichts.');
    } else {
      kopfW.textContent = e.kitt ? 'erloschen' : 'noch nicht';
      kopfW.classList.add('ruhig');
      const f = z.fehlend;
      hEl('p', 'wirkung-unter', el, `Es fehlt noch: ${f.map((s) => SLOT_NAME[s]).join(', ')}.${f.length === 1 && f[0] !== 'lesart' ? ` Oder eine Bedingung hält ${SLOT_NAME[f[0]]} – dann rastet die Fuge nur unter ihr ein.` : ''}`);
    }
    if (e.verlauf.length) {
      const v = hEl('div', 'verlauf', el);
      hEl('h4', 'verlauf-titel', v, 'An dieser Fuge');
      const ol = hEl('ol', 'verlauf-liste', v);
      const zeige = e.verlauf.slice(-4);
      zeige.forEach((x, j) => {
        const li = hEl('li', `v-${x.art}`, ol);
        hEl('span', 'v-wann', li, j === zeige.length - 1 ? 'jetzt' : ZEIT_WORT[j]);
        hEl('span', 'v-was', li, x.text);
      });
    }
  }

  /* Der Zylinder: Gehäuse oben, Kern unten, dazwischen die Scherlinie. Die Faser von A ist der Schlüsselbart,
     der in den Kern geschoben wird. Je Stift ein Kernstift (unten, sitzt auf dem Bart) und ein Gehäusestift
     (oben, gefedert). Greift der Stift, liegt die Trennung genau auf der Scherlinie; fehlt er, ragt der
     Gehäusestift quer über die Scherlinie und sperrt. Am Ende des Bartes wartet die Faser von B mit einem Haken. */
  function zeichneMechanik(t) {
    if (!MECH || S.ansicht !== 'schloss' || !MECH.mech.isConnected) return false;
    const { i, mech, bild, knoepfe, schild, griffe } = MECH;
    const e = ein(i), z = bewerte(i), p = paar(i);
    const w = mech.clientWidth;
    if (!w) return false;
    const leb = lebendig();
    const eng = w < 520;
    const xP0 = eng ? 22 : 40, xP1 = w - (eng ? 70 : 104);
    const xs = {};
    VIER.forEach((s, j) => { xs[s] = xP0 + (xP1 - xP0) * ((eng ? 0.1 : 0.13) + j * (eng ? 0.19 : 0.19)); });
    xs.kontext = xP0 + (xP1 - xP0) * (eng ? 0.91 : 0.84);
    // Schild des gewählten Stifts zuerst messen: es steht waagrecht und vollständig über dem Gehäuse
    const sw = Math.min(eng ? w - 8 : 360, w - 8);
    const schildLinks = clamp(xs[S.riegel] - 24, 4, w - sw - 4);
    Object.assign(schild.style, { left: `${f1(schildLinks)}px`, width: `${f1(sw)}px`, top: '0px' });
    const hS = schild.offsetHeight || 40;
    const yH0 = Math.max(64, hS + 18), yS = yH0 + 90, yK = yS + 46, yP1 = yS + 84;
    const H = yP1 + 78;
    mech.style.height = `${H}px`;
    bild.setAttribute('viewBox', `0 0 ${w} ${H}`);
    bild.setAttribute('width', w); bild.setAttribute('height', H);
    bild.innerHTML = '';
    let weiter = false;
    const g = (tag, a, el = bild) => sEl(tag, a, el);
    const cA = farbe(p.A), cB = farbe(p.B);
    const xTip = xP1 - 6, K = { x: xTip + (eng ? 22 : 30), y: yK };
    const pw = eng ? 20 : 30;
    // Einschub des Bartes (lebendig: schiebt sich beim Betreten hinein)
    if (leb && MA.ein < 1) { MA.ein = clamp((t - MA.start - 150) / 900, 0, 1); weiter = true; } else if (!leb) MA.ein = 1;
    const schub = (1 - glatt(MA.ein)) * -(w * 0.35);
    // Drehung des Kerns beim Einrasten
    const drehZiel = e.eingerastet ? 1 : 0;
    if (leb) { const d = drehZiel - MA.dreh; if (Math.abs(d) > 0.01) { MA.dreh += d * 0.08; weiter = true; } else MA.dreh = drehZiel; } else MA.dreh = drehZiel;

    // Gehäuse und Kern
    const gehaeuseR = xs.wort + pw / 2 + 16;
    g('rect', { x: xP0 - 8, y: yH0, width: gehaeuseR - xP0 + 16, height: yS - yH0 + 6, rx: 12, fill: 'url(#gehaeuse)', stroke: '#aab1c7', 'stroke-width': 1.5 });
    g('rect', { x: xP0 - 8, y: yS, width: xP1 - xP0 + 20, height: yP1 - yS, rx: 18, fill: MA.dreh > 0.5 ? 'url(#kernGold)' : 'url(#kern)', stroke: MA.dreh > 0.5 ? '#c99a1c' : '#8f97ad', 'stroke-width': 2.2 });
    g('rect', { x: xP0 - 2, y: yK - 19, width: xP1 - xP0 + 8, height: 38, rx: 6, fill: '#e9ecf4' });
    // Scherlinie: zwischen Gehäuse und Kern. Liegen alle Trennungen darauf, dreht der Kern.
    g('line', { x1: xP0 - 8, y1: yS, x2: xP1 + 12, y2: yS, stroke: '#6b7290', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
    const sl = g('text', { x: f1(gehaeuseR + 14), y: yS - 7, class: 'mech-schrift' });
    sl.textContent = MA.dreh > 0.5 ? 'Scherlinie frei – der Kern dreht' : 'Scherlinie';
    // Fasern von A: laufen von der linken Wand in den Bart
    const fasern = (x0, x1, y, c, n = 3, frans = 0, ph = 0) => {
      for (let j = 0; j < n; j++) {
        const o = (j - (n - 1) / 2) * 3.2;
        const pk = [];
        for (let x = x0, s = 0; (x1 > x0 ? x <= x1 : x >= x1); x += (x1 > x0 ? 6 : -6), s++) {
          const u = Math.abs(x - x0) / Math.abs(x1 - x0 || 1);
          const f = frans && u > 1 - frans ? (u - (1 - frans)) / frans : 0;
          pk.push([x, y + o * (1 + f * 3) + Math.sin(x / 9 + j * 1.6 + ph) * 1.4 + f * Math.sin(j * 2 + ph) * 6]);
        }
        if (pk.length > 1) g('path', { d: pfadAus(pk), fill: 'none', stroke: c, 'stroke-width': 1.8, 'stroke-opacity': frans ? 0.8 : 0.9, 'stroke-linecap': 'round' });
      }
    };
    const ph = leb ? t / 700 : 0;
    fasern(0, xP0 + schub + 10, yK, cA.faser, 5, 0, ph);
    // Stifte
    const lageZiel = {};
    for (const s of VIER) {
      const st = stiftZustand(i, s, z);
      lageZiel[s] = st === 'greift' || st === 'bedingt' ? 0 : st === 'blockiert' ? 22 : 18;
      if (MA.stift[s] === undefined) MA.stift[s] = leb ? 30 : lageZiel[s];
      if (MA.v[s] === undefined) MA.v[s] = 0;
      if (leb && MA.ein > 0.6) {
        // federnd auf die Ziel-Lage springen (sichtbares Nachfedern)
        const a = (lageZiel[s] - MA.stift[s]) * 0.18 - MA.v[s] * 0.22;
        MA.v[s] += a; MA.stift[s] += MA.v[s];
        if (Math.abs(MA.v[s]) > 0.02 || Math.abs(lageZiel[s] - MA.stift[s]) > 0.05) weiter = true;
      } else if (!leb) MA.stift[s] = lageZiel[s];
    }
    // Bart: Profil mit Zähnen unter jedem Stift
    const Lk = 26, Ld = 32;
    const bart = [];
    const xB0 = xP0 - 4 + schub, xB1 = xTip + schub;
    bart.push([xB0, yK + 16], [xB0, yK - 10]);
    for (const s of VIER) {
      const x = xs[s] + schub;
      const top = yS + Lk + MA.stift[s];
      bart.push([x - pw / 2 - 7, yK - 10], [x - pw / 2 - 2, top], [x + pw / 2 + 2, top], [x + pw / 2 + 7, yK - 10]);
    }
    bart.push([xB1 - 12, yK - 10], [xB1, yK], [xB1 - 12, yK + 16]);
    g('path', { d: `M${bart.map((q) => `${f1(q[0])},${f1(q[1])}`).join('L')}Z`, fill: cA.hauch, stroke: cA.tief, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    // Faserstruktur im Bart: die Faser von A IST der Bart
    for (let j = 0; j < 3; j++) g('path', { d: `M${f1(xB0)},${yK + 2 + j * 4}L${f1(xB1 - 10)},${yK + 2 + j * 4}`, stroke: cA.faser, 'stroke-width': 1, 'stroke-opacity': 0.55, 'stroke-dasharray': '6 3' });
    // Gehäusekammern, Federn, Stifte
    for (const s of VIER) {
      const x = xs[s];
      const st = stiftZustand(i, s, z);
      const lage = MA.stift[s];
      const sel = S.riegel === s;
      g('rect', { x: x - pw / 2 - 3, y: yH0 + 6, width: pw + 6, height: yS - yH0 - 6 + Lk + 30, fill: sel ? '#dfe5ff' : '#d8dce8', rx: 4 });
      const dTop = yS - Ld + lage, dBot = yS + lage;
      // Feder
      const fed = [];
      const fy0 = yH0 + 8, fy1 = dTop - 2;
      for (let k = 0; k <= 8; k++) fed.push([x + (k % 2 ? 6 : -6) * (k && k < 8 ? 1 : 0), fy0 + ((fy1 - fy0) * k) / 8]);
      g('path', { d: pfadAus(fed), fill: 'none', stroke: '#6b7290', 'stroke-width': 2, 'stroke-linejoin': 'round' });
      // Gehäusestift
      g('rect', { x: x - pw / 2, y: dTop, width: pw, height: Ld, rx: 4, fill: st === 'blockiert' ? 'url(#schraffur)' : 'url(#stahl)', stroke: '#1f2547', 'stroke-width': 1.2 });
      // Kernstift
      const kTop = dBot, kBot = dBot + Lk;
      const kFill = st === 'greift' ? 'url(#messing)' : st === 'bedingt' ? '#fff3c4' : 'url(#grau)';
      g('rect', { x: x - pw / 2, y: kTop, width: pw, height: kBot - kTop, rx: 4, fill: kFill, stroke: st === 'greift' ? '#b58300' : st === 'bedingt' ? '#b98300' : '#8f97ad', 'stroke-width': 1.4, 'stroke-dasharray': st === 'bedingt' ? '3 2' : '' });
      // Scherlinie an diesem Stift: Gold, wo er greift; Tinte, wo der Gehäusestift quer im Weg steht
      if (st === 'greift' || st === 'bedingt') g('line', { x1: x - pw / 2 - 6, y1: yS, x2: x + pw / 2 + 6, y2: yS, stroke: st === 'greift' ? '#f2b300' : '#d9a520', 'stroke-width': 3.2, 'stroke-dasharray': st === 'bedingt' ? '4 2' : '' });
      else { g('line', { x1: x - pw / 2 - 6, y1: yS, x2: x + pw / 2 + 6, y2: yS, stroke: '#1f2547', 'stroke-width': 3.2 }); g('path', { d: `M${x - pw / 2 - 5},${yS - 5}l4,10M${x + pw / 2 + 1},${yS - 5}l4,10`, stroke: '#1f2547', 'stroke-width': 1.4 }); }
      if (sel) g('rect', { x: x - pw / 2 - 7, y: yH0 + 2, width: pw + 14, height: yP1 - yH0 + 4, rx: 6, fill: 'none', stroke: '#6b80ff', 'stroke-width': 2.4 });
    }
    // Kontext-Hebel: unter dem Kern, kippt hoch, wenn eine Bedingung aufliegt; hält er einen Stift, läuft eine Goldstütze dorthin
    {
      const x = xs.kontext, st = stiftZustand(i, 'kontext', z), sel = S.riegel === 'kontext';
      const auf = st !== 'frei';
      const wink = auf ? -24 : 8;
      const px = x - 16, py = yP1 + 14;
      const ex = f1(px + Math.cos((wink * Math.PI) / 180) * 44), ey = f1(py + Math.sin((wink * Math.PI) / 180) * 44);
      g('path', { d: `M${px},${py}L${ex},${ey}`, stroke: auf ? '#c48a00' : '#aab1c7', 'stroke-width': 9, 'stroke-linecap': 'round' });
      g('path', { d: `M${px},${py}L${ex},${ey}`, stroke: auf ? '#ffe27a' : '#ffffff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-dasharray': auf ? '' : '3 4' });
      g('circle', { cx: px, cy: py, r: 6, fill: '#5b6380', stroke: '#fff', 'stroke-width': 1.5 });
      if (st === 'haelt') {
        const zx = xs[z.ersetzt];
        g('path', { d: `M${f1(px + 30)},${f1(py - 14)}Q${f1((px + zx) / 2)},${yP1 + 26} ${f1(zx)},${yS + Lk + 4}`, fill: 'none', stroke: '#c48a00', 'stroke-width': 2.2, 'stroke-dasharray': '5 3' });
      }
      if (sel) g('rect', { x: x - 34, y: yP1 + 2, width: 64, height: 42, rx: 6, fill: 'none', stroke: '#6b80ff', 'stroke-width': 2.4 });
    }
    // Faser von B mit Haken am Ende des Bartes
    const hakZu = e.eingerastet;
    const dr = MA.dreh;
    const bEnde = hakZu ? K.x + 6 : K.x + 26 + (1 - dr) * 10;
    fasern(w, bEnde, yK, cB.faser, 5, hakZu ? 0 : 0.4, ph + 1);
    if (hakZu) {
      g('path', { d: `M${f1(K.x + 18)},${yK - 15} q-21,0 -21,15 q0,15 18,15`, fill: 'none', stroke: cB.tief, 'stroke-width': 4.5, 'stroke-linecap': 'round' });
    } else g('path', { d: `M${f1(bEnde + 4)},${yK - 14} q-14,4 -10,18`, fill: 'none', stroke: cB.tief, 'stroke-width': 3.6, 'stroke-linecap': 'round', 'stroke-opacity': 0.75 });
    // Spuren am Treffpunkt
    if (e.kitt) kittNaht(bild, [K.x, K.y], [1, 0], 1.5, 1);
    if (e.entscheidung === 'bestritten') {
      g('rect', { x: K.x - 30, y: yS + 4, width: 12, height: yP1 - yS - 8, rx: 2, fill: '#1f2547', transform: `rotate(10 ${K.x - 24} ${yK})`, class: 'sperrbalken' });
    }
    if (e.eingerastet && MA.ein >= 1) {
      let gross = 1.6;
      if (leb && MA.hak) {
        const dt = t - MA.hak - 400;
        if (dt > 0 && dt < 700) { gross *= 1 + 0.4 * Math.sin((dt / 700) * Math.PI * 2.5) * (1 - dt / 700); weiter = true; }
        const puls = clamp(1 - dt / 1500, 0, 1);
        if (dt > 0 && puls > 0) { g('circle', { cx: K.x, cy: K.y, r: f1(16 + (1 - puls) * 70), fill: '#fff4c2', 'fill-opacity': f1(0.3 * puls), stroke: '#f2b300', 'stroke-width': f1(5 * puls + 0.5), 'stroke-opacity': f1(puls) }); weiter = true; }
        if (dt <= 0) weiter = true;
      }
      goldKnoten(bild, [K.x, K.y], gross);
      if (e.entscheidung === 'gefasst') {
        g('path', { d: `M0,${yK - 22}L${f1(w)},${yK - 22}`, stroke: '#fff1b0', 'stroke-width': 7 });
        g('path', { d: `M0,${yK - 22}L${f1(w)},${yK - 22}`, stroke: '#d29a00', 'stroke-width': 3.6 });
        for (let x = 8; x < w; x += 12) g('path', { d: `M${x},${yK - 27}l3,10`, stroke: '#8f6400', 'stroke-width': 1.2 });
      }
      if (e.entscheidung === 'offen') g('circle', { cx: K.x, cy: K.y, r: 26, fill: 'none', stroke: '#4b5378', 'stroke-width': 2.4, 'stroke-dasharray': '6 4' });
      if (e.bedingt) g('circle', { cx: K.x, cy: K.y, r: 19, fill: 'none', stroke: '#b98300', 'stroke-width': 1.8, 'stroke-dasharray': '2 4' });
    }
    // Reißen: Fasern schnellen zurück, zwei, drei bleiben kurz hängen
    if (leb && MA.riss && t - MA.riss < 1400) {
      const q = clamp((t - MA.riss) / 1400, 0, 1);
      for (let s = 0; s < 3; s++) g('path', { d: `M${f1(K.x - 6 + s * 5)},${yK}q${4 - s * 3},${10 + q * 18} ${-2 + s * 2},${18 + q * (24 + s * 8)}`, fill: 'none', stroke: s % 2 ? cB.faser : cA.faser, 'stroke-width': 1.5, 'stroke-opacity': f1(1 - q) });
      weiter = true;
    }
    // Namen und Zustandswörter unter dem Kern (die Knöpfe liegen darüber)
    const knopfBreit = Math.max(44, pw + 26);
    for (const s of SLOTS) {
      const b = knoepfe[s];
      if (!b) continue;
      const x = xs[s];
      if (s === 'kontext') { const kb = eng ? 58 : 82; Object.assign(b.style, { left: `${f1(Math.min(x - kb / 2, w - kb - 2))}px`, top: `${yP1 + 2}px`, width: `${kb}px`, height: `${H - yP1 - 2}px` }); continue; }
      Object.assign(b.style, { left: `${f1(x - knopfBreit / 2)}px`, top: `${yH0}px`, width: `${knopfBreit}px`, height: `${H - yH0}px` });
    }
    // Schild des gewählten Stifts: waagrecht und vollständig neben dem Stift, oben über dem Gehäuse
    {
      const x = xs[S.riegel];
      const oben = yH0 - 10 - hS;
      schild.style.top = `${f1(oben)}px`;
      const yz = S.riegel === 'kontext' ? yP1 + 4 : yH0 + 4;
      g('path', { d: `M${f1(x)},${f1(oben + hS)}L${f1(x)},${f1(yz)}`, stroke: '#6b80ff', 'stroke-width': 1.6, 'stroke-dasharray': '3 3' });
    }
    // Griffe am Treffpunkt
    if (griffe.gefasst) {
      const gb = 70;
      const pos = eng
        ? { gefasst: [w - gb - 2, yS - 66], bestritten: [w - 2 * gb - 6, yS - 66], offen: [w - gb - 2, yP1 + 6] }
        : { gefasst: [Math.min(K.x - gb / 2, w - gb - 2), yS - 70], bestritten: [K.x - gb - 22, yP1 + 8], offen: [Math.min(K.x + 4, w - gb - 2), yP1 + 8] };
      for (const art of ['gefasst', 'bestritten', 'offen']) Object.assign(griffe[art].style, { left: `${f1(pos[art][0])}px`, top: `${f1(pos[art][1])}px`, width: `${gb}px` });
      // Fäden vom Knoten zu den Griffen
      for (const art of ['gefasst', 'bestritten', 'offen']) g('path', { d: `M${f1(K.x)},${f1(K.y)}L${f1(pos[art][0] + gb / 2)},${f1(pos[art][1] + (pos[art][1] < K.y ? 50 : 4))}`, stroke: '#c48a00', 'stroke-width': 1.2, 'stroke-dasharray': '2 3' });
    }
    // Fäden zu Versuch und Wirkung
    const hr = MECH.haengen.getBoundingClientRect(), mr = mech.getBoundingClientRect();
    const ab = mr.left - hr.left;
    MECH.fadenV.style.left = `${f1(ab + xs[S.riegel])}px`;
    MECH.fadenW.style.left = `${f1(ab + K.x)}px`;
    return weiter || (leb && MA.ein < 1);
  }

  /* ================= Ton (leise, synthetisch, nur auf Wunsch) ================= */
  let hoerer = null;
  function klang(art) {
    if (!PROFIL.ton) return;
    try { hoerer = hoerer || new (window.AudioContext || window.webkitAudioContext)(); } catch (_) { return; }
    if (hoerer.state === 'suspended') hoerer.resume().catch(() => {});
    const t = hoerer.currentTime;
    const ton = (typ, f0, f1x, dauer, laut, verz = 0) => {
      const o = hoerer.createOscillator();
      const g = hoerer.createGain();
      o.type = typ;
      o.frequency.setValueAtTime(f0, t + verz);
      if (f1x) o.frequency.exponentialRampToValueAtTime(f1x, t + verz + dauer);
      g.gain.setValueAtTime(0.0001, t + verz);
      g.gain.exponentialRampToValueAtTime(laut, t + verz + 0.014);
      g.gain.exponentialRampToValueAtTime(0.0001, t + verz + dauer);
      o.connect(g); g.connect(hoerer.destination);
      o.start(t + verz); o.stop(t + verz + dauer + 0.05);
    };
    if (art === 'ein') { ton('sine', 784, 0, 0.32, 0.045); ton('sine', 1175, 0, 0.42, 0.03, 0.07); }
    else if (art === 'aus') ton('sine', 540, 190, 0.55, 0.04);
  }

  /* ================= Profil, Tastatur, Start ================= */
  function profilAnwenden(neu, vorher) {
    document.documentElement.style.setProperty('--sf', PROFIL.schrift === 'gross' ? '1.25' : '1');
    raum.classList.toggle('ruhig', !lebendig());
    baueEcke();
    const nurText = neu && vorher && Object.keys(neu).every((k) => neu[k] === vorher[k] || ['blick', 'niveau', 'umfang'].includes(k));
    if (S.ansicht === 'feld') {
      if (nurText && S.wahl && S.wahl.art === 'ort' && aktualisiereZitat()) return;
      baueVoraus(); baueSpalte(); zeichneFeld(); lauf();
    } else { if (lebendig() && MA) MA.ein = 1; baueSchloss(); }
  }
  PROFIL.beobachte((neu, vorher) => profilAnwenden(neu, vorher));
  if (window.matchMedia) { try { window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => profilAnwenden()); } catch (_) { /* alte Browser */ } }
  feldFlaeche.addEventListener('click', () => { if (S.wahl || S.voraus) { S.wahl = null; S.voraus = null; camZiel(); baueVoraus(); baueSpalte(); zeichneFeld(); } });
  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    if (ev.target && /^(INPUT|TEXTAREA)$/.test(ev.target.tagName)) return;
    if (S.ansicht === 'schloss') zeigeAnsicht('feld');
    else if (S.wahl || S.voraus) { S.wahl = null; S.voraus = null; camZiel(); baueVoraus(); baueSpalte(); zeichneFeld(); }
  });
  let rTimer = 0;
  window.addEventListener('resize', () => { clearTimeout(rTimer); rTimer = setTimeout(() => { if (S.ansicht === 'feld') { messeFeld(); zeichneFeld(); } else zeichneMechanik(jetzt()); }, 60); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) lauf(); });

  profilAnwenden();
  messeFeld();
  // Lebendig: die Fasern wachsen beim Öffnen aus den Körpern
  for (const a of ARME) a.len = lebendig() ? 0.02 : armZiel(a);
  baueVoraus();
  baueSpalte();
  zeichneFeld();
  lauf();

  // Prüfschnittstelle (nur lesen und dieselben Handlungen auslösen, die auch die Oberfläche hat)
  window.__schloss = {
    zustand: () => ({ ansicht: S.ansicht, wahl: S.wahl, voraus: S.voraus, aktiv: S.aktiv, riegel: S.riegel, paare: S.paare.map((e, i) => ({ i, eingerastet: e.eingerastet, bedingt: e.bedingt, entscheidung: e.entscheidung, kitt: e.kitt, wieder: e.wieder, kontext: e.kontext && e.kontext.text, verlauf: e.verlauf.map((v) => v.art) })) }),
    paarVon: (a, b) => D.paare.findIndex((p) => (p.A.titel === a && p.B.titel === b) || (p.A.titel === b && p.B.titel === a)),
    zaehne: (i) => { const z = bewerte(i); return { ...Object.fromEntries(SLOTS.map((s) => [s, z[s].greift])), alle: z.alle, bedingt: z.bedingt }; },
    fehltNur: (slot) => FELD_PAARE.filter((i) => fehltNur(i, slot)),
    fehltMitEinem: (slot) => FELD_PAARE.filter((i) => fehltMitEinem(i, slot)),
    ortPunkt: (titel) => { const k = FELD_ORTE.find((x) => D.orte[x].titel === titel); const r = feldFlaeche.getBoundingClientRect(); return k ? { x: r.left + sx(W[k].x), y: r.top + sy(W[k].y) } : null; },
    nahtPunkt: (n) => { const x = NAEHTE[n]; const r = feldFlaeche.getBoundingClientRect(); return x ? { x: r.left + sx(x.c.x), y: r.top + sy(x.c.y), name: `${x.a} | ${x.b}` } : null; },
    armPunkt: (i, anteil = 0.5) => { const a = ersterArm(i); if (!a || !a.pk) return null; const d = teilBahn(a.pk, a.len); const q = punktBei(d, bogenLaenge(d) * anteil).p; const r = feldFlaeche.getBoundingClientRect(); return { x: r.left + q[0], y: r.top + q[1] }; },
    arme: () => ARME.map((a) => { const d = a.tpk || []; const r = feldFlaeche.getBoundingClientRect(); return { n: a.n, i: a.i, von: D.orte[a.von].titel, zu: D.orte[a.zu].titel, pk: d.map((q) => [r.left + q[0], r.top + q[1]]) }; }),
    stiftPunkt: (s) => { const b = MECH && MECH.knoepfe[s]; if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
    ruhe: () => !rafId,
    messe: () => { const t0 = performance.now(); if (S.ansicht === 'feld') zeichneFeld(); else zeichneMechanik(jetzt()); return performance.now() - t0; },
  };
})();
