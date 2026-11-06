// Farbe der Lebenden Welt: wahrnehmungsgetreu in OKLab (Björn Ottosson, 2020).
// Gebietsfarben sind feste OKLCH-Werte und ändern sich weder mit Modus noch Sprache.
// Gemischt wird in OKLab; danach wird die Buntheit auf das gewichtete Mittel der
// Ausgangsbuntheiten angehoben, damit Mischungen nicht zu Grau verschmutzen.

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklab([r, g, b]) {
  const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

export function oklabToRgb([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const G = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const B = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [R, G, B].map((c) => Math.min(1, Math.max(0, linearToSrgb(c))));
}

export const oklchToOklab = ([L, C, h]) => [L, C * Math.cos((h * Math.PI) / 180), C * Math.sin((h * Math.PI) / 180)];
export const oklabToOklch = ([L, a, b]) => [L, Math.hypot(a, b), ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360];

export const oklchToRgb = (lch) => oklabToRgb(oklchToOklab(lch));
export const css = (rgb, alpha = 1) =>
  `rgba(${Math.round(rgb[0] * 255)},${Math.round(rgb[1] * 255)},${Math.round(rgb[2] * 255)},${alpha})`;
export const cssLch = (lch, alpha = 1) => css(oklchToRgb(lch), alpha);

// Mischung mehrerer Farben (OKLCH-Eingaben) mit Gewichten.
// 1. gewichtetes Mittel in OKLab (wahrnehmungsgleichmäßig)
// 2. Buntheit auf das gewichtete Mittel der Einzelbuntheiten setzen (kein Grauschleier)
export function mischeOklch(farben, gewichte) {
  let L = 0, a = 0, b = 0, C = 0, W = 0;
  farben.forEach((f, i) => {
    const w = gewichte ? gewichte[i] : 1;
    const lab = oklchToOklab(f);
    L += lab[0] * w; a += lab[1] * w; b += lab[2] * w; C += f[1] * w; W += w;
  });
  if (W <= 0) return farben[0];
  L /= W; a /= W; b /= W; C /= W;
  const [, c0, h] = oklabToOklch([L, a, b]);
  // Liegen die Farbtöne fast gegenüber, verschwindet der Ton; dann bleibt die Mischung bewusst ruhig.
  const C2 = c0 < 0.01 ? c0 : Math.max(c0, C * 0.92);
  return [L, C2, h];
}

// Feste Gebietsfarben, in Kartenreihenfolge von karte.json (Index 0–9).
// Helle Pastelltöne in der Familie des bestehenden Atlas (Minze, Flieder, Koralle, Himmel, Sand),
// aber zehn unterscheidbare Farbtöne statt acht wiederholter.
export const GEBIETSFARBEN = [
  // Farbtöne rund um den Kreis verteilt (Abstand 30–40°), Nachbargebiete der Karte nie benachbart im Ton.
  { name: 'TraumaAtlas', lch: [0.74, 0.11, 38] },                 // Koralle
  { name: 'Phänomenatlas', lch: [0.78, 0.09, 160] },              // Minze
  { name: 'Neuroatlas', lch: [0.74, 0.09, 250] },                 // Himmel
  { name: 'Dynamikraum', lch: [0.77, 0.1, 140] },                 // Moos
  { name: 'Beziehungswerkstatt', lch: [0.8, 0.1, 100] },          // Sand
  { name: 'ADHS · Randphänomene', lch: [0.79, 0.11, 70] },        // Aprikose
  { name: 'Beziehungen & Borderline', lch: [0.71, 0.12, 2] },     // Rose
  { name: 'Diagnose & Differenzierung', lch: [0.72, 0.1, 290] },  // Flieder
  { name: 'Trigger & Kontext', lch: [0.8, 0.11, 95] },            // Goldgelb
  { name: 'Forschung & Einordnung', lch: [0.76, 0.075, 210] },    // Seegrün
];

// Kontrast nach WCAG für Text auf dem hellen Grund.
export function kontrast(rgb1, rgb2) {
  const lum = ([r, g, b]) => 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
  const [x, y] = [lum(rgb1), lum(rgb2)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
