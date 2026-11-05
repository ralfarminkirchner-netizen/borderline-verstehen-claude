/** Visual reading aids for existing relations. These never add or reinterpret an edge. */
const families = Object.freeze({
  branch: { name: 'Verzweigung', color: '#2f8f78', gesture: 'Zuordnung auffalten', note: 'Eine Zuordnung im vorhandenen Modell. Die Verzweigung behauptet weder Ursache noch zeitliche Reihenfolge.' },
  seam: { name: 'Quellennaht', color: '#8a6a12', gesture: 'Herkunft öffnen', note: 'Hier wird eine Beschreibung oder Modellbegründung mit ihrer Herkunft verbunden.' },
  contact: { name: 'Lose Stichlinie', color: '#6556a8', gesture: 'Quellenkontakt ansehen', note: 'Ein Kontakt im Quellenmaterial. Daraus folgt keine Ähnlichkeit, Diagnose oder Ursache.' },
  hinge: { name: 'Gelenk', color: '#c4543d', gesture: 'Gegenüberstellen', note: 'Beide Begriffe lassen sich nebeneinander lesen. Der Originaltext bestimmt, worin die Unterscheidung besteht.' },
  band: { name: 'Elastisches Band', color: '#2f8f78', gesture: 'Bezug auffalten', note: 'Eine im Original benannte begriffliche Nähe. Nähe ist keine gemeinsame Ursache.' },
  flow: { name: 'Gerichtete Strömung', color: '#c4543d', gesture: 'Modellbezug verfolgen', note: 'Die Richtung folgt dem vorhandenen Modellbezug. Sie ist kein individueller Wirknachweis.' },
  threshold: { name: 'Schwelle', color: '#8a6a12', gesture: 'Schwelle öffnen', note: 'Eine Schwelle in eine andere Frage oder Fassung. Sie ist kein abgeschlossener Beweis und keine Ursache.' },
  weave: { name: 'Verflechtung', color: '#6556a8', gesture: 'Verbindung auffalten', note: 'Eine vorhandene Beziehung. Maßgeblich bleiben ihre ursprüngliche Formulierung und Quelle.' },
});

export function jointForRelation(edge = {}) {
  const type = edge.originalType || '', label = String(edge.label || '');
  const editorial = edge.status === 'redaktionelle-zuordnung' || edge.relationType === 'research-question' || ['comparison', 'practice', 'tension'].includes(edge.kind);
  let family = 'weave';
  // Some unreviewed original types say more than the original display label.
  // Keep that weaker, explicit formulation instead of promoting a proposal.
  if (/begrifflich benachbart|ähnelt im beschriebenen Erleben|vertieft denselben/.test(label)) family = 'band';
  else if (['nicht_dasselbe','gegenteil_am_start','verwechselbar_mit','gegenbeispiel'].includes(type) || /unterschieden werden|gegenüber|nebeneinander|auseinander/.test(label)) family = 'hinge';
  else if (['co_mentioned_with','investigated_in_context_of'].includes(type) || /beschrieben im Kontext|untersucht in|assoziiert|Risiko/.test(label)) family = 'contact';
  else if (['described_in','fundierung'].includes(type) || /eingeordnet|im Original/.test(label)) family = 'seam';
  else if (['abstammung','kategorie','phase','profil'].includes(type) || /Erfahrungsdimension|gehört zur/.test(label)) family = 'branch';
  else if (['reguliert','erregung','zielzustand','behandlt','kann_strategie_sein_gegen'].includes(type)) family = 'flow';
  else if (type === 'benannte_naehe') family = 'band';
  else if (type === 'voraussetzung' || edge.relationType === 'research-question' || /öffnet eine Forschungsfrage/.test(label)) family = 'threshold';
  return { family, ...families[family], proposed: edge.status === 'proposed', editorial, label: label || 'steht in Beziehung zu' };
}

const point = p => `${Number(p.x.toFixed(2))} ${Number(p.y.toFixed(2))}`;
const shifted = (p,n,d) => ({x:p.x+n.x*d,y:p.y+n.y*d});

/** Same-command cubic paths permit a genuine shape interpolation when opened. */
export function jointGeometry(a,b,family='weave') {
  const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy)||1;
  const coincident=dx===0&&dy===0,normal=coincident?{x:0,y:1}:{x:-dy/length,y:dx/length}, bend=Math.min(80,Math.max(28,length*.1));
  const at=t=>({x:a.x+dx*t,y:a.y+dy*t});
  const cubic = amount => {
    const c1=shifted(at(.34),normal,amount),c2=shifted(at(.66),normal,amount);if(coincident){c1.x-=bend;c2.x+=bend;}
    return `M${point(a)} C${point(c1)} ${point(c2)} ${point(b)}`;
  };
  const path=cubic(bend), opened=cubic(family==='hinge'?-bend*.42:family==='threshold'?bend*.22:bend*1.55);
  const midpoint=shifted(at(.5),normal,bend*.75);
  const angle=Math.atan2(dy,dx)*180/Math.PI;
  let ornament='',growth=[];
  if(family==='seam'||family==='contact') {
    const stitches=family==='contact'?[.4,.6]:[.3,.4,.5,.6,.7];
    ornament=stitches.map(t=>{const p=shifted(at(t),normal,3*bend*t*(1-t));return `M${point(shifted(p,normal,-8))} L${point(shifted(p,normal,8))}`;}).join(' ');
  } else if(family==='branch') {
    const reach=Math.max(220,length*.9);
    const root=at(.05);
    const trunk=shifted(root,normal,reach*.62);
    const fork=shifted(at(.24),normal,reach*1.05);
    const tipA=shifted(at(.7),normal,reach*1.55);
    const tipB=shifted(at(.46),normal,reach*.7);
    growth=[a,trunk,fork,tipA,tipB];
    ornament=`M${point(a)} Q${point(shifted(root,normal,reach*.2))} ${point(trunk)} Q${point(fork)} ${point(tipA)} M${point(fork)} Q${point(shifted(at(.34),normal,reach*.82))} ${point(tipB)}`;
  } else if(family==='threshold') {
    const sill=at(.5);
    ornament=`M${point(shifted(sill,normal,-18))} L${point(shifted(sill,normal,18))}`;
  } else if(family==='weave') ornament=cubic(-bend*.65);
  return { path, opened, ornament, midpoint, angle, length, growth };
}

export function safeSourceURL(value) {
  try { const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:null; } catch { return null; }
}
