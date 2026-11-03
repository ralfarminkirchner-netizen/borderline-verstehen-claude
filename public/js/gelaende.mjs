// Das Gelände unter der Karte: Höhe = Dichte der Einträge an dieser Stelle.
// WebGL2 zeichnet Relief, Höhenlinien, Papier und ein Licht, das dem Zeiger folgt.
// Ohne WebGL2 zeichnet derselbe Bestand ein ruhiges Canvas-Gelände.

const N = 256;

export function dichteFeld(orte, regionen, bounds) {
  const dens = new Float32Array(N * N);
  const reg = new Float32Array(N * N * 4);
  const sx = (N - 1) / (bounds.x1 - bounds.x0); const sy = (N - 1) / (bounds.y1 - bounds.y0);
  const R = 7; const sigma = 3.2;
  for (const o of orte) {
    const cx = (o.x - bounds.x0) * sx; const cy = (o.y - bounds.y0) * sy;
    const w = 1 + Math.min(o.n, 30) / 12;
    for (let y = Math.max(0, Math.floor(cy - R)); y <= Math.min(N - 1, Math.ceil(cy + R)); y++) {
      for (let x = Math.max(0, Math.floor(cx - R)); x <= Math.min(N - 1, Math.ceil(cx + R)); x++) {
        const d2 = (x - cx) ** 2 + (y - cy) ** 2; const k = Math.exp(-d2 / (2 * sigma * sigma)) * w;
        dens[y * N + x] += k; const i = (y * N + x) * 4; const c = regionen[o.r].rgb;
        reg[i] += c[0] * k; reg[i + 1] += c[1] * k; reg[i + 2] += c[2] * k; reg[i + 3] += k;
      }
    }
  }
  let max = 0; for (const v of dens) max = Math.max(max, v);
  const h = new Uint8Array(N * N); const col = new Uint8Array(N * N * 4);
  for (let i = 0; i < N * N; i++) {
    h[i] = Math.round(255 * Math.pow(dens[i] / max, 0.55));
    const k = reg[i * 4 + 3] || 1;
    col[i * 4] = reg[i * 4] / k; col[i * 4 + 1] = reg[i * 4 + 1] / k; col[i * 4 + 2] = reg[i * 4 + 2] / k;
    col[i * 4 + 3] = Math.min(255, reg[i * 4 + 3] * 60);
  }
  return { h, col, bounds };
}

const VS = `#version 300 es
in vec2 p; out vec2 uv; void main(){ uv = p*0.5+0.5; gl_Position = vec4(p,0.,1.); }`;

const FS = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D hTex, cTex;
uniform vec2 res; uniform vec2 cam; uniform float zoom; uniform vec4 bounds;
uniform vec2 light; uniform float time; uniform vec3 energy; uniform float calm; uniform float focusR; uniform vec2 focusP;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
void main(){
  vec2 px = uv*res; vec2 w = cam + (px - res*0.5)/zoom; w.y = cam.y + (res.y*0.5 - px.y)/zoom;
  vec2 t = (w - bounds.xy)/(bounds.zw - bounds.xy);
  // Küsten und Höhenlinien leicht unregelmäßig: Rauschen verschiebt nur die Lesestelle des Feldes.
  t += (vec2(noise(w*0.012), noise(w*0.012+17.3)) - 0.5) * 0.018 + (vec2(noise(w*0.05+3.1), noise(w*0.05+9.7)) - 0.5) * 0.004;
  float h = 0.; vec4 c = vec4(0.);
  if (t.x>0. && t.y>0. && t.x<1. && t.y<1.) { h = texture(hTex, t).r; c = texture(cTex, t); }
  float e = 1.0/256.0;
  float hx = texture(hTex, t+vec2(e,0)).r - texture(hTex, t-vec2(e,0)).r;
  float hy = texture(hTex, t+vec2(0,e)).r - texture(hTex, t-vec2(0,e)).r;
  vec3 n = normalize(vec3(-hx*3.2, -hy*3.2, 0.5));
  vec3 L = normalize(vec3(light, 0.9));
  float shade = clamp(dot(n, L), 0., 1.);
  vec3 paper = vec3(0.955, 0.937, 0.898);
  float grain = noise(px*0.9)*0.035 + noise(px*0.11)*0.03;
  vec3 region = mix(c.rgb, paper, 0.35);
  vec3 tint = mix(paper, region, clamp(c.a, 0., 1.)*0.16 + h*0.12);
  vec3 col = tint * (0.93 + 0.12*shade) - grain*0.8;
  // Höhenlinien: feiner Abstand, jede fünfte kräftiger
  float lv = h*22.; float fw = fwidth(lv);
  float line = 1. - smoothstep(0., fw*1.2, abs(fract(lv)-0.5)*2. - (1.-fw*1.4));
  float major = 1. - smoothstep(0., fw*1.4, abs(fract(lv/5.)-0.5)*2. - (1.-fw*1.6));
  col = mix(col, mix(col, region*0.7, 0.5), line*0.28*step(0.02,h));
  col = mix(col, mix(col, region*0.55, 0.6), major*0.35*step(0.02,h));
  // Wasser rund um das Land: leichte Schraffur
  float sea = 1.-smoothstep(0.015, 0.06, h);
  float hatch = step(0.82, fract((px.x+px.y)*0.09));
  col = mix(col, mix(col, vec3(0.80,0.84,0.86), 0.55) - hatch*0.035*(1.-calm*0.5), sea*0.6);
  // Fokus: ausgewähltes Gebiet bleibt hell, Rest tritt zurück
  if (focusR > 0.) { float d = length(w - focusP); col = mix(col, mix(col, vec3(0.93,0.92,0.89), 0.35), smoothstep(focusR, focusR*1.8, d)*0.7); }
  // getragene Energie: warmes Licht am Zeiger
  if (energy.z > 0.) { float d = length(w - energy.xy)*zoom; col += vec3(0.95,0.62,0.25)*energy.z*0.22*exp(-d*d/(2.*120.*120.)); }
  o = vec4(col, 1.);
}`;

export class Gelaende {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = null;
    try { this.gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false, failIfMajorPerformanceCaveat: false }); } catch { this.gl = null; }
    if (new URLSearchParams(location.search).has('ohne-webgl')) this.gl = null;
    this.modus = this.gl ? 'webgl' : 'canvas';
    this.light = [-0.5, 0.6];
  }

  setze(feld) {
    this.feld = feld;
    if (this.gl) this.#initGL(feld); else this.#initCanvas(feld);
  }

  #initGL(feld) {
    const gl = this.gl;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
    try {
      const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
      this.prog = prog; gl.useProgram(prog);
    } catch (error) {
      console.warn('WebGL-Gelände nicht verfügbar, Canvas-Gelände übernimmt.', error.message);
      this.gl = null; this.modus = 'canvas'; return this.#initCanvas(feld);
    }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = (unit, fmt, data) => {
      const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, fmt === 'r' ? gl.R8 : gl.RGBA8, N, N, 0, fmt === 'r' ? gl.RED : gl.RGBA, gl.UNSIGNED_BYTE, data);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    tex(0, 'r', feld.h); tex(1, 'rgba', feld.col);
    this.u = {};
    for (const name of ['hTex', 'cTex', 'res', 'cam', 'zoom', 'bounds', 'light', 'time', 'energy', 'calm', 'focusR', 'focusP']) this.u[name] = gl.getUniformLocation(this.prog, name);
    gl.uniform1i(this.u.hTex, 0); gl.uniform1i(this.u.cTex, 1);
    this.canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); this.gl = null; this.modus = 'canvas'; this.#initCanvas(this.feld); this.onFallback?.(); });
  }

  #initCanvas(feld) {
    this.ctx2 = this.canvas.getContext('2d');
    if (!this.ctx2) {
      // Dieselbe Leinwand hatte bereits einen WebGL-Kontext: eine frische Leinwand übernimmt.
      const fresh = this.canvas.cloneNode(); this.canvas.replaceWith(fresh); this.canvas = fresh; this.ctx2 = fresh.getContext('2d');
    }
    const off = document.createElement('canvas'); off.width = N; off.height = N;
    const c = off.getContext('2d'); const img = c.createImageData(N, N);
    for (let i = 0; i < N * N; i++) {
      const h = feld.h[i] / 255; const a = Math.min(1, feld.col[i * 4 + 3] / 255);
      const base = [244, 239, 229];
      for (let k = 0; k < 3; k++) img.data[i * 4 + k] = base[k] * (1 - a * 0.3 - h * 0.12) + feld.col[i * 4 + k] * (a * 0.3);
      img.data[i * 4 + 3] = 255;
    }
    c.putImageData(img, 0, 0); this.off = off;
  }

  zeichne(view) {
    const { w, h, cam, zoom, energy, calm, focus } = view;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = Math.round(w * dpr); const H = Math.round(h * dpr);
    if (this.canvas.width !== W || this.canvas.height !== H) { this.canvas.width = W; this.canvas.height = H; }
    const b = this.feld.bounds;
    if (this.gl) {
      const gl = this.gl; gl.viewport(0, 0, W, H);
      gl.uniform2f(this.u.res, W, H); gl.uniform2f(this.u.cam, cam.x, cam.y); gl.uniform1f(this.u.zoom, zoom * dpr);
      gl.uniform4f(this.u.bounds, b.x0, b.y0, b.x1, b.y1); gl.uniform2f(this.u.light, this.light[0], this.light[1]);
      gl.uniform1f(this.u.time, performance.now() / 1000); gl.uniform1f(this.u.calm, calm ? 1 : 0);
      gl.uniform3f(this.u.energy, energy?.x || 0, energy?.y || 0, energy?.k || 0);
      gl.uniform1f(this.u.focusR, focus?.r || 0); gl.uniform2f(this.u.focusP, focus?.x || 0, focus?.y || 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      return;
    }
    const c = this.ctx2; c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#dfe3e1'; c.fillRect(0, 0, W, H);
    const s = zoom * dpr;
    c.setTransform(s, 0, 0, s, W / 2 - cam.x * s, H / 2 - cam.y * s);
    c.imageSmoothingEnabled = true; c.drawImage(this.off, b.x0, b.y0, b.x1 - b.x0, b.y1 - b.y0);
  }
}
