const INIT = () => {
  window.__spuren = { speicher: [], url: [], audio: 0 };
  for (const s of ['localStorage', 'sessionStorage']) {
    try {
      const st = window[s];
      for (const m of ['setItem', 'removeItem', 'clear']) {
        const o = st[m].bind(st);
        Object.defineProperty(st, m, { value: (...a) => { window.__spuren.speicher.push(`${s}.${m}(${a[0] || ''})`); return o(...a); } });
      }
    } catch (_) { /* egal */ }
  }
  for (const m of ['pushState', 'replaceState']) {
    const o = history[m].bind(history);
    history[m] = (...a) => { window.__spuren.url.push(`${m} ${a[2]}`); return o(...a); };
  }
  window.addEventListener('hashchange', () => window.__spuren.url.push('hash ' + location.hash));
  const AC = window.AudioContext;
  if (AC) window.AudioContext = class extends AC { constructor(...a) { super(...a); window.__spuren.audio++; } };
  if (window.indexedDB) { const o = indexedDB.open.bind(indexedDB); indexedDB.open = (...a) => { window.__spuren.speicher.push('indexedDB.open ' + a[0]); return o(...a); }; }
  const cookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
  Object.defineProperty(document, 'cookie', { get() { return cookie.get.call(document); }, set(v) { window.__spuren.speicher.push('cookie'); cookie.set.call(document, v); } });
};

// Prüfung am sichtbaren Zustand: kleine Schrift, Kennungen, Überlappungen, Überlauf
const AUDIT = () => {
  const D = window.SCHLOSS_DATEN;
  const tech = new Set();
  (function w(x, k, tief) {
    if (x && typeof x === 'object') { for (const [kk, v] of Object.entries(x)) w(v, kk, tief || kk === 'technisch' || kk === 'herkunft'); }
    else if (typeof x === 'string' && x.length >= 5 && /[_:0-9]/.test(x) && !/\s/.test(x) && (tief || /^(id|typ|status|art|geltung)$/.test(k || ''))) tech.add(x);
  })(D.orte); (function w(x, k, tief) {
    if (x && typeof x === 'object') { for (const [kk, v] of Object.entries(x)) w(v, kk, tief || kk === 'technisch'); }
    else if (typeof x === 'string' && x.length >= 5 && /[_:0-9]/.test(x) && !/\s/.test(x) && (tief || /^(id|typ|status|art|geltung)$/.test(k || ''))) tech.add(x);
  })(D.paare);
  const muster = /\b[0-9a-f]{10,}\b|[0-9a-f]{8}-[0-9a-f]{4}-|\b[a-z]+(?:-[a-z]+)*-source:|\bpmid\b|\bdoi\b|pmcid|sha256|\b[a-z]+_[a-z]+(?:_[a-z]+)*\b|undefined|\[object|\{[a-z]+\}/i;
  const sicht = (el) => {
    if (!el || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    if (r.bottom < 0 || r.right < 0 || r.top > innerHeight || r.left > innerWidth) return false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const c = getComputedStyle(e);
      if (c.display === 'none' || c.visibility === 'hidden' || parseFloat(c.opacity) < 0.08 || e.hidden) return false;
      if (e.tagName === 'DETAILS' && !e.open && !el.closest('summary')) return false;
    }
    return true;
  };
  const name = (el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute('class') || '').split(' ').filter(Boolean).slice(0, 2).join('.')}`;
  const klein = [], kennung = [], textEls = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = tw.nextNode());) {
    const t = n.textContent.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    const el = n.parentElement;
    if (!el || el.closest('script,style') || !sicht(el)) continue;
    let fs = parseFloat(getComputedStyle(el).fontSize);
    if (el.closest('svg')) { const svg = el.closest('svg'); const m = svg.getScreenCTM && el.getScreenCTM ? el.getScreenCTM() : null; if (m) fs *= Math.hypot(m.a, m.b); }
    if (fs < 11.95) klein.push(`${fs.toFixed(1)}px ${name(el)}: ${t.slice(0, 40)}`);
    if (muster.test(t) || /\bNaN\b/.test(t) || [...tech].some((x) => t.includes(x))) kennung.push(`text ${name(el)}: ${t.slice(0, 90)}`);
    textEls.push(el);
  }
  for (const el of document.querySelectorAll('[aria-label],[title],[alt],[aria-valuetext],[aria-description]')) {
    for (const a of ['aria-label', 'title', 'alt', 'aria-valuetext', 'aria-description']) {
      const v = el.getAttribute(a);
      if (v && (muster.test(v) || [...tech].some((x) => v.includes(x)))) kennung.push(`${a} ${name(el)}: ${v.slice(0, 90)}`);
    }
  }
  // Überlappung sichtbarer Textblöcke (Blattelemente mit eigenem Text)
  const blaetter = [...new Set(textEls)].filter((el) => ![...el.children].some((c) => textEls.includes(c)));
  const rs = blaetter.map((el) => ({ el, r: el.getBoundingClientRect() })).filter((x) => x.r.width > 2 && x.r.height > 2);
  const ueber = [];
  for (let i = 0; i < rs.length; i++) for (let j = i + 1; j < rs.length; j++) {
    const a = rs[i], b = rs[j];
    if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
    const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left);
    const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (w <= 2 || h <= 2) continue;
    const fl = w * h, kl = Math.min(a.r.width * a.r.height, b.r.width * b.r.height);
    if (fl / kl < 0.18) continue;
    ueber.push(`${name(a.el)} „${a.el.textContent.trim().slice(0, 24)}“ × ${name(b.el)} „${b.el.textContent.trim().slice(0, 24)}“ (${Math.round((100 * fl) / kl)}% des kleineren)`);
  }
  const ausserhalb = blaetter.filter((el) => { const r = el.getBoundingClientRect(); return r.right > innerWidth + 1 || r.left < -1; }).map((el) => `${name(el)}: ${el.textContent.trim().slice(0, 30)}`);
  const ae = document.activeElement;
  return {
    klein: [...new Set(klein)].slice(0, 25), kleinAnzahl: new Set(klein).size,
    kennung: [...new Set(kennung)].slice(0, 25),
    ueberlappung: ueber.slice(0, 30), ueberlappungAnzahl: ueber.length,
    ausserhalb: ausserhalb.slice(0, 15),
    querScroll: document.documentElement.scrollWidth > innerWidth + 1,
    fokus: ae ? `${name(ae)} ${ae.getAttribute('aria-label') ? '[' + ae.getAttribute('aria-label').slice(0, 60) + ']' : ''} sichtbar=${sicht(ae)}` : null,
    spuren: window.__spuren, url: location.href.replace(/^.*\//, ''),
  };
};


module.exports={INIT,AUDIT};
