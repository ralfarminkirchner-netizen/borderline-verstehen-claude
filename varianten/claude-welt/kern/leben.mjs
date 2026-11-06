// Leben: wie die Wesen sich in ihren Gebieten bewegen.
// Jedes Wesen hat seinen Heimatort aus der Karte und streift in einem Bereich, der zur Weite
// seines Gebiets passt. Die Bewegung ist eine langsame Überlagerung weniger Schwingungen;
// Phase und Takt kommen aus dem Ort selbst (Lage, Zahl seiner Fugen), nicht aus einer Kennung.
import { sigmaFuer } from './feld.mjs';

export function bereiteWesen(welt) {
  const fugenJe = welt.orte.map(() => []);
  welt.fugen.forEach((f, i) => { fugenJe[f.a].push(i); fugenJe[f.b].push(i); });
  return welt.orte.map((o, i) => {
    const g = welt.gebiete[o.r];
    const sig = sigmaFuer(g);
    const phase = (o.x * 0.0131 + o.y * 0.0173) % (Math.PI * 2);
    return {
      i, ort: o, gebiet: o.r, hx: o.x, hy: o.y, x: o.x, y: o.y,
      radius: 3.2 + 1.5 * Math.sqrt(o.grad),
      streifen: sig * 0.45,
      phase,
      takt: 0.035 + 0.02 * (1 / (1 + o.grad * 0.15)), // viel verbundene Wesen bewegen sich ruhiger
      fugen: fugenJe[i],
    };
  });
}

// Position zur Zeit t (Sekunden). ruhe ∈ [0,1]: 1 = Bewegung ruht.
export function bewege(wesen, t, ruhe = 0) {
  const amp = 1 - ruhe;
  for (const w of wesen) {
    const p = w.phase, k = w.takt * Math.PI * 2;
    const dx = Math.sin(t * k + p) * 0.62 + Math.sin(t * k * 2.31 + p * 1.7) * 0.28 + Math.sin(t * k * 0.43 + p * 3.1) * 0.35;
    const dy = Math.cos(t * k * 0.87 + p * 1.3) * 0.58 + Math.sin(t * k * 1.93 + p * 0.6) * 0.3 + Math.cos(t * k * 0.51 + p * 2.3) * 0.35;
    w.x = w.hx + dx * w.streifen * amp;
    w.y = w.hy + dy * w.streifen * amp;
    w.atem = 1 + Math.sin(t * 0.9 + p) * 0.06 * amp;
  }
}

// Spur der letzten Sekunden (für das Vorbeiziehen).
export function spur(w, t, dauer = 14, schritte = 28, ruhe = 0) {
  const kopie = [{ ...w }];
  const punkte = [];
  for (let s = schritte; s >= 0; s--) {
    bewege(kopie, t - (dauer * s) / schritte, ruhe);
    punkte.push([kopie[0].x, kopie[0].y]);
  }
  return punkte;
}
