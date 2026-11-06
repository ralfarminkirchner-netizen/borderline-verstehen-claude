// Die Schloss-Regel zaehne() für die Lebende Welt.
// Die Regel und ihre Wortebene sind WÖRTLICH aus proben/schloss-schluessel/schloss.js übernommen
// (Zeilen 25–32, 62–90, 136–166); /schloss/ bleibt unverändert. Angepasst ist nur der Zugriff:
// paar(i) und autoWoerter(i) arbeiten hier auf einem übergebenen Paarobjekt aus dem Weltbestand.
// Abweichung, offen ausgewiesen: Die Kurztexte kommen ungesäubert aus karte.json (Feld s),
// die Probe säubert sie vorher mit saeubern(); die Lesart ist die Art der ersten Fuge des Paars.
const SLOTS = ['lesart', 'beleg', 'grenze', 'wort', 'kontext'];
const VIER = ['lesart', 'beleg', 'grenze', 'wort'];
// Greifen nur die Arten, die die Regel nennt: „Nähe“ und „könnte zusammenhängen“.
const NESTEND = new Set(['annaeherung', 'zusammenhang']);
// Redaktionelle Einordnung („diese beiden zusammen lesen“) greift als Lesart, ebenso eine belegte Aussage,
// die ausdrücklich „verbindet“. „unterscheidet“ oder „vergleicht“ halten beide auseinander.
const lesartGreift = (les) => NESTEND.has(les.art) || les.art === 'einordnung' || (les.art === 'aussage' && /^verbindet\b/.test((les.belege && les.belege[0] && les.belege[0].satz) || ''));

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

// Paar aus dem Weltbestand im Format der Probe (nur die Felder, die zaehne() liest).
export function paarAus(welt, a, b) {
const fugen = welt.fugen.filter((f) => (f.a === a && f.b === b) || (f.a === b && f.b === a));
const quellenVon = (f) => f.quellen.map((q) => welt.quellen[q]).filter(Boolean);
const A = { titel: welt.orte[a].t, kurz: welt.orte[a].s }, B = { titel: welt.orte[b].t, kurz: welt.orte[b].s };
const lesarten = fugen.length
  ? fugen.map((f) => ({ art: f.art, ausBestand: true, belege: [{ satz: f.label }] }))
  : [{ art: 'keine', ausBestand: true, belege: [{ satz: '' }] }];
return { a, b, A, B, lesarten, fugen: fugen.map((f) => ({ ...f, quellen: quellenVon(f) })) };
}

function bestandQuellen(p) {
const out = [];
for (const f of p.fugen) for (const q of f.quellen) if (!out.some((x) => x.titel === q.titel)) out.push(q);
return out;
}
const autoCache = new Map();
function autoWoerter(p) {
const k = `${p.a}|${p.b}`;
if (!autoCache.has(k)) autoCache.set(k, gemeinsam(p.A.kurz, p.B.kurz, titelWoerter(p.A.titel, p.B.titel)));
return autoCache.get(k);
}

// Eingabe e wie in der Probe: { lesart: 0, beleg: null, grenze: null, wort: null, kontext: null }
export const LEER = { lesart: 0, beleg: null, grenze: null, wort: null, kontext: null };

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
export function zaehne(p, e = LEER) {
  // (p wird übergeben)
  const les = p.lesarten[e.lesart] || p.lesarten[0];
  const bestQ = bestandQuellen(p);
  const bestG = (p.fugen.find((f) => f.grenze) || {}).grenze || '';
  const auto = autoWoerter(p);
  const w = e.wort;
  const z = {
    lesart: { greift: lesartGreift(les), les, deine: !les.ausBestand, bestand: p.lesarten[0] },
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
