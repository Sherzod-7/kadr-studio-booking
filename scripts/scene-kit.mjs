// Interyer sahnalarini SVG ko‘rinishida chizish uchun kichik to‘plam.
// Natija keyin sharp orqali WebP formatga o‘tkaziladi (scripts/generate-images.mjs).

export const W = 1200;
export const H = 900;

export class Scene {
  constructor() {
    this.defs = [];
    this.body = [];
    this.n = 0;
  }
  id(p = 'g') {
    this.n += 1;
    return `${p}${this.n}`;
  }
  lin(stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1, units = 'objectBoundingBox') {
    const id = this.id('l');
    this.defs.push(
      `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" gradientUnits="${units}">${stopsXml(stops)}</linearGradient>`,
    );
    return `url(#${id})`;
  }
  rad(stops, cx = 0.5, cy = 0.5, r = 0.5, units = 'objectBoundingBox', fx, fy) {
    const id = this.id('r');
    const f = fx !== undefined ? ` fx="${fx}" fy="${fy}"` : '';
    this.defs.push(
      `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}"${f} gradientUnits="${units}">${stopsXml(stops)}</radialGradient>`,
    );
    return `url(#${id})`;
  }
  blur(sd) {
    const id = this.id('b');
    this.defs.push(
      `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${sd}"/></filter>`,
    );
    return `url(#${id})`;
  }
  add(...s) {
    this.body.push(...s);
    return this;
  }
  svg() {
    const grain = this.id('grain');
    const vig = this.rad(
      [
        [0, '#000', 0],
        [0.62, '#000', 0],
        [1, '#000', 0.38],
      ],
      0.5,
      0.48,
      0.78,
    );
    this.defs.push(
      `<filter id="${grain}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer></filter>`,
    );
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${this.defs.join('')}</defs>${this.body.join('')}<rect width="${W}" height="${H}" fill="${vig}"/><rect width="${W}" height="${H}" filter="url(#${grain})"/></svg>`;
  }
}

function stopsXml(stops) {
  return stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`)
    .join('');
}

export const poly = (pts, fill, extra = '') =>
  `<polygon points="${pts.map((p) => p.join(',')).join(' ')}" fill="${fill}" ${extra}/>`;
export const rect = (x, y, w, h, fill, extra = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
export const line = (x1, y1, x2, y2, stroke, sw = 4, extra = '') =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`;
export const ell = (cx, cy, rx, ry, fill, extra = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
export const path = (d, fill, extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Perspektivali xona: orqa devor [x1,y1,x2,y2], qolgan yuzalar burchaklarga cho‘ziladi.
 */
export function room(s, o) {
  const [x1, y1, x2, y2] = o.back;
  s.add(poly([[0, 0], [W, 0], [x2, y1], [x1, y1]], o.ceiling ?? s.lin([[0, '#d9d6cf'], [1, '#ecebe6']])));
  s.add(poly([[0, 0], [x1, y1], [x1, y2], [0, H]], o.left ?? s.lin([[0, '#d6d2ca'], [1, '#e9e6df']], 0, 0, 1, 0)));
  s.add(poly([[W, 0], [x2, y1], [x2, y2], [W, H]], o.right ?? s.lin([[0, '#efede8'], [1, '#d8d4cc']], 0, 0, 1, 0)));
  s.add(rect(x1, y1, x2 - x1, y2 - y1, o.wall ?? '#f1efea'));
  s.add(poly([[0, H], [W, H], [x2, y2], [x1, y2]], o.floor ?? '#b9b2a6'));
  if (o.planks) {
    const n = o.planks;
    for (let i = 0; i <= n; i++) {
      const bx = lerp(x1, x2, i / n);
      const fx = lerp(-W * 0.6, W * 1.6, i / n);
      s.add(line(bx, y2, fx, H, o.plankLine ?? 'rgba(70,45,20,.18)', 2));
    }
  }
  // devor va pol tutashgan joydagi yumshoq soya
  s.add(rect(x1, y2 - 6, x2 - x1, 14, 'rgba(0,0,0,.10)', `filter="${s.blur(6)}"`));
}

export function floorShadow(s, cx, cy, rx, ry, a = 0.28) {
  s.add(ell(cx, cy, rx, ry, `rgba(0,0,0,${a})`, `filter="${s.blur(Math.max(6, ry * 0.8))}"`));
}

export function glow(s, cx, cy, r, color, a = 0.6) {
  s.add(ell(cx, cy, r, r, s.rad([[0, color, a], [1, color, 0]])));
}

export function lightStand(s, x, footY, topY, k = 1, color = '#1d1d1f') {
  const spread = 46 * k;
  floorShadow(s, x, footY + 4, spread * 1.2, 8 * k, 0.25);
  s.add(line(x, footY - 60 * k, x - spread, footY, color, 4 * k));
  s.add(line(x, footY - 60 * k, x + spread, footY, color, 4 * k));
  s.add(line(x, footY - 60 * k, x + spread * 0.25, footY + 6 * k, color, 4 * k));
  s.add(line(x, footY - 60 * k, x, topY, color, 5 * k));
}

/** To‘rtburchak softboks (old yuzasi yorug‘). */
export function softbox(s, x, footY, topY, k = 1, facing = 1, warm = false) {
  lightStand(s, x, footY, topY + 40 * k, k);
  const w = 150 * k;
  const h = 190 * k;
  const cx = x + facing * 20 * k;
  const face = s.lin(
    warm
      ? [[0, '#fffaf0'], [1, '#ffe6bf']]
      : [[0, '#ffffff'], [0.7, '#f3f5f8'], [1, '#dfe4ea']],
  );
  glow(s, cx, topY + h * 0.35, w * 1.4, warm ? '#ffe7c2' : '#ffffff', 0.55);
  // korpus (orqa tomoni)
  s.add(
    poly(
      [
        [cx - facing * w * 0.15, topY - h * 0.42],
        [cx - facing * w * 0.6, topY + h * 0.05],
        [cx - facing * w * 0.6, topY + h * 0.55],
        [cx - facing * w * 0.15, topY + h * 0.95],
      ],
      '#232326',
    ),
  );
  s.add(rect(cx - w / 2 + facing * 20 * k, topY - h * 0.45, w, h * 1.4, face, `rx="${4 * k}"`));
  s.add(
    rect(cx - w / 2 + facing * 20 * k, topY - h * 0.45, w, h * 1.4, 'none', `rx="${4 * k}" stroke="#2a2a2c" stroke-width="${6 * k}"`),
  );
}

/** Oktaboks (sakkiz burchakli yorug‘lik). */
export function octabox(s, x, footY, topY, k = 1, tint = '#ffffff') {
  lightStand(s, x, footY, topY, k);
  const r = 120 * k;
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = Math.PI / 8 + (i * Math.PI) / 4;
    pts.push([x + Math.cos(a) * r, topY - r * 0.2 + Math.sin(a) * r]);
  }
  glow(s, x, topY - r * 0.2, r * 2.2, tint, 0.5);
  s.add(poly(pts, s.rad([[0, '#ffffff'], [0.7, tint], [1, '#d9dde3']])));
  s.add(poly(pts, 'none', `stroke="#26262a" stroke-width="${7 * k}"`));
}

/** Shtativdagi kamera. */
export function camera(s, x, footY, k = 1, facing = -1, rec = true) {
  const top = footY - 330 * k;
  floorShadow(s, x, footY + 4, 80 * k, 10 * k, 0.3);
  const c = '#18181a';
  s.add(line(x, top + 40 * k, x - 70 * k, footY, c, 6 * k));
  s.add(line(x, top + 40 * k, x + 70 * k, footY, c, 6 * k));
  s.add(line(x, top + 40 * k, x + 10 * k, footY + 10 * k, c, 6 * k));
  s.add(line(x, top + 40 * k, x, top + 150 * k, c, 7 * k));
  s.add(line(x, top + 30 * k, x - facing * 110 * k, top + 70 * k, '#2b2b2e', 6 * k));
  s.add(rect(x - 60 * k, top - 40 * k, 120 * k, 75 * k, s.lin([[0, '#3a3a3e'], [1, '#141416']]), `rx="${10 * k}"`));
  s.add(rect(x - 25 * k, top - 62 * k, 50 * k, 24 * k, '#26262a', `rx="${5 * k}"`));
  const lx = x + facing * 70 * k;
  s.add(rect(Math.min(lx, x + facing * 60 * k) - (facing < 0 ? 40 * k : 0), top - 30 * k, 50 * k, 55 * k, '#202023', `rx="${6 * k}"`));
  s.add(ell(lx + facing * 22 * k, top - 3 * k, 14 * k, 30 * k, s.lin([[0, '#4a5568'], [1, '#0b0b0c']])));
  if (rec) glow(s, x + 40 * k * -facing, top - 28 * k, 12 * k, '#ff3b30', 0.9);
}

export function plant(s, x, footY, k = 1) {
  floorShadow(s, x, footY, 60 * k, 10 * k, 0.25);
  const leaves = [];
  const greens = ['#3f6b4a', '#4e7f57', '#2f5a3c', '#5c8f63'];
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI / 2 + (i - 5) * 0.27;
    const len = (150 + (i % 3) * 40) * k;
    const ex = x + Math.cos(a) * len;
    const ey = footY - 110 * k + Math.sin(a) * len;
    leaves.push(line(x, footY - 100 * k, ex, ey, '#3b4f37', 3 * k));
    leaves.push(
      ell(ex, ey, 34 * k, 14 * k, greens[i % 4], `transform="rotate(${(a * 180) / Math.PI} ${ex} ${ey})"`),
    );
  }
  s.add(...leaves);
  s.add(path(`M${x - 50 * k} ${footY - 110 * k} L${x + 50 * k} ${footY - 110 * k} L${x + 38 * k} ${footY} L${x - 38 * k} ${footY} Z`, s.lin([[0, '#d8cfc2'], [1, '#b7ab9b']], 0, 0, 1, 0)));
}

export function stool(s, x, footY, k = 1, color = '#8a6a4a') {
  floorShadow(s, x, footY + 2, 55 * k, 8 * k, 0.25);
  s.add(line(x - 35 * k, footY - 180 * k, x - 45 * k, footY, color, 7 * k));
  s.add(line(x + 35 * k, footY - 180 * k, x + 45 * k, footY, color, 7 * k));
  s.add(line(x, footY - 180 * k, x, footY + 4 * k, color, 7 * k));
  s.add(line(x - 40 * k, footY - 70 * k, x + 40 * k, footY - 70 * k, color, 5 * k));
  s.add(ell(x, footY - 182 * k, 52 * k, 14 * k, s.lin([[0, '#a88560'], [1, '#6f5236']])));
}

export function armchair(s, x, footY, k = 1, color = '#c9b8a0', facing = 1) {
  floorShadow(s, x, footY + 4, 150 * k, 16 * k, 0.3);
  const dark = shade(color, -0.18);
  s.add(line(x - 100 * k, footY - 40 * k, x - 110 * k, footY, '#3a2c20', 6 * k));
  s.add(line(x + 100 * k, footY - 40 * k, x + 110 * k, footY, '#3a2c20', 6 * k));
  // suyanchiq
  s.add(rect(x - 120 * k + facing * 20 * k, footY - 270 * k, 220 * k, 170 * k, s.lin([[0, color], [1, dark]]), `rx="${40 * k}"`));
  // o‘rindiq
  s.add(rect(x - 130 * k, footY - 140 * k, 260 * k, 100 * k, s.lin([[0, shade(color, 0.06)], [1, dark]]), `rx="${30 * k}"`));
  // qo‘ltiqlar
  s.add(rect(x - 150 * k, footY - 190 * k, 50 * k, 150 * k, dark, `rx="${22 * k}"`));
  s.add(rect(x + 100 * k, footY - 190 * k, 50 * k, 150 * k, dark, `rx="${22 * k}"`));
}

export function sofa(s, x, footY, k = 1, color = '#4a5a6a') {
  floorShadow(s, x, footY + 6, 280 * k, 18 * k, 0.32);
  const dark = shade(color, -0.2);
  s.add(rect(x - 260 * k, footY - 250 * k, 520 * k, 150 * k, s.lin([[0, color], [1, dark]]), `rx="${36 * k}"`));
  s.add(rect(x - 270 * k, footY - 140 * k, 540 * k, 110 * k, s.lin([[0, shade(color, 0.08)], [1, dark]]), `rx="${30 * k}"`));
  s.add(rect(x - 300 * k, footY - 190 * k, 60 * k, 170 * k, dark, `rx="${26 * k}"`));
  s.add(rect(x + 240 * k, footY - 190 * k, 60 * k, 170 * k, dark, `rx="${26 * k}"`));
  s.add(line(x - 230 * k, footY - 25 * k, x - 235 * k, footY, '#2a2420', 7 * k));
  s.add(line(x + 230 * k, footY - 25 * k, x + 235 * k, footY, '#2a2420', 7 * k));
}

export function rug(s, cx, cy, w, h, color) {
  s.add(ell(cx, cy, w, h, color));
  s.add(ell(cx, cy, w * 0.86, h * 0.8, 'none', `stroke="rgba(255,255,255,.18)" stroke-width="4"`));
}

/** Mikrofon kronshteynda: baza nuqtasi (bx,by), mikrofon nuqtasi (mx,my). */
export function boomMic(s, bx, by, mx, my, k = 1) {
  const ex = (bx + mx) / 2 + 40 * k;
  const ey = Math.min(by, my) - 90 * k;
  s.add(path(`M${bx} ${by} L${ex} ${ey} L${mx} ${my}`, 'none', `stroke="#202024" stroke-width="${7 * k}" stroke-linejoin="round" stroke-linecap="round"`));
  s.add(rect(bx - 14 * k, by - 4 * k, 28 * k, 20 * k, '#202024', `rx="${4 * k}"`));
  s.add(ell(mx, my - 10 * k, 30 * k, 30 * k, '#2c2c30'));
  s.add(rect(mx - 22 * k, my - 48 * k, 44 * k, 96 * k, s.lin([[0, '#55555c'], [0.5, '#1d1d20'], [1, '#3a3a40']], 0, 0, 1, 0), `rx="${20 * k}"`));
  for (let i = 0; i < 5; i++) {
    s.add(line(mx - 18 * k, my - 36 * k + i * 12 * k, mx + 18 * k, my - 36 * k + i * 12 * k, 'rgba(255,255,255,.12)', 2 * k));
  }
}

export function headphones(s, x, y, k = 1) {
  s.add(path(`M${x - 40 * k} ${y} A ${40 * k} ${42 * k} 0 0 1 ${x + 40 * k} ${y}`, 'none', `stroke="#1b1b1e" stroke-width="${8 * k}"`));
  s.add(rect(x - 54 * k, y - 8 * k, 26 * k, 40 * k, '#2a2a2e', `rx="${10 * k}"`));
  s.add(rect(x + 28 * k, y - 8 * k, 26 * k, 40 * k, '#2a2a2e', `rx="${10 * k}"`));
}

/** Akustik ko‘pik panellari (piramida naqshli kvadratlar). */
export function foamPanels(s, x, y, cols, rows, size, base = '#2f3442', gap = 8) {
  const light = shade(base, 0.22);
  const dark = shade(base, -0.25);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const px = x + c * (size + gap);
      const py = y + r * (size + gap);
      s.add(rect(px, py, size, size, base));
      const m = size / 2;
      s.add(poly([[px, py], [px + size, py], [px + m, py + m]], light));
      s.add(poly([[px, py], [px + m, py + m], [px, py + size]], shade(base, 0.08)));
      s.add(poly([[px + size, py], [px + size, py + size], [px + m, py + m]], dark));
      s.add(poly([[px, py + size], [px + size, py + size], [px + m, py + m]], shade(base, -0.12)));
    }
  }
}

export function hexPanels(s, cx, cy, r, cols, rows, colors) {
  const w = Math.sqrt(3) * r;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = cx + col * (w + 6) + (row % 2) * (w / 2 + 3);
      const y = cy + row * (r * 1.5 + 5);
      const pts = [];
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 6 + (i * Math.PI) / 3;
        pts.push([x + Math.cos(a) * r, y + Math.sin(a) * r]);
      }
      const col0 = colors[(row * 3 + col * 2) % colors.length];
      s.add(poly(pts, s.lin([[0, shade(col0, 0.1)], [1, shade(col0, -0.15)]])));
    }
  }
}

export function ledTube(s, x1, y1, x2, y2, color, w = 10) {
  s.add(line(x1, y1, x2, y2, color, w * 5, `opacity=".35" filter="${s.blur(w * 2.2)}"`));
  s.add(line(x1, y1, x2, y2, color, w * 1.8, `opacity=".8" filter="${s.blur(w * 0.6)}"`));
  s.add(line(x1, y1, x2, y2, '#ffffff', w * 0.6, 'opacity=".9"'));
}

export function spotCone(s, x, y, toX, toY, spread, color = '#fff4dc', a = 0.22) {
  s.add(poly([[x - 10, y], [x + 10, y], [toX + spread, toY], [toX - spread, toY]], s.lin([[0, color, a * 1.6], [1, color, 0]]), `filter="${s.blur(10)}"`));
  s.add(ell(toX, toY, spread, spread * 0.18, color, `opacity="${a * 1.2}" filter="${s.blur(14)}"`));
  s.add(rect(x - 18, y - 26, 36, 34, '#1a1a1c', 'rx="6"'));
  glow(s, x, y + 6, 22, color, 0.9);
}

export function truss(s, x1, x2, y, color = '#2b2b2e') {
  s.add(line(x1, y, x2, y, color, 8));
  s.add(line(x1, y + 26, x2, y + 26, color, 8));
  for (let x = x1; x < x2; x += 40) {
    s.add(line(x, y, x + 20, y + 26, color, 3));
    s.add(line(x + 20, y + 26, x + 40, y, color, 3));
  }
}

export function monitor(s, x, y, w, h, screen) {
  s.add(rect(x - w / 2, y, w, h, '#111113', 'rx="8"'));
  s.add(rect(x - w / 2 + 8, y + 8, w - 16, h - 16, screen, 'rx="4"'));
  s.add(rect(x - 6, y + h, 12, 50, '#1b1b1e'));
  s.add(rect(x - 50, y + h + 44, 100, 10, '#1b1b1e', 'rx="4"'));
}

export function windowPane(s, x, y, w, h, o = {}) {
  const frame = o.frame ?? '#2a2a2a';
  s.add(rect(x, y, w, h, s.lin([[0, '#e9f1f8'], [0.6, '#fbfcfd'], [1, '#f3efe4']])));
  if (o.trees) {
    s.add(ell(x + w * 0.25, y + h * 0.9, w * 0.35, h * 0.25, 'rgba(120,150,120,.25)', `filter="${s.blur(12)}"`));
    s.add(ell(x + w * 0.8, y + h * 0.85, w * 0.3, h * 0.2, 'rgba(120,150,120,.2)', `filter="${s.blur(14)}"`));
  }
  const cols = o.cols ?? 2;
  const rows = o.rows ?? 3;
  for (let i = 1; i < cols; i++) s.add(rect(x + (w * i) / cols - 4, y, 8, h, frame));
  for (let i = 1; i < rows; i++) s.add(rect(x, y + (h * i) / rows - 4, w, 8, frame));
  s.add(rect(x, y, w, h, 'none', `stroke="${frame}" stroke-width="12"`));
}

/** Derazadan polga tushadigan yorug‘lik. */
export function sunBeam(s, wx, wy, ww, wh, dx, dy, a = 0.35) {
  const pts = [
    [wx, wy],
    [wx + ww, wy],
    [wx + ww + dx, wy + wh + dy],
    [wx + dx, wy + wh + dy],
  ];
  s.add(poly(pts, s.lin([[0, '#fffaf0', a], [1, '#fff4dc', 0]]), `filter="${s.blur(18)}"`));
}

export function floorPatch(s, pts, a = 0.45) {
  s.add(poly(pts, `rgba(255,248,232,${a})`, `filter="${s.blur(10)}"`));
}

export function brickWall(s, x, y, w, h, base = '#f2efe9', mortar = 'rgba(150,140,125,.22)') {
  s.add(rect(x, y, w, h, base));
  const bh = 22;
  const bw = 70;
  for (let r = 0, yy = y; yy < y + h; r++, yy += bh) {
    s.add(line(x, yy, x + w, yy, mortar, 2));
    const off = (r % 2) * (bw / 2);
    for (let xx = x - off; xx < x + w; xx += bw) {
      if (xx > x) s.add(line(xx, yy, xx, Math.min(yy + bh, y + h), mortar, 2));
    }
  }
}

export function backdropRoll(s, x1, x2, topY, bottomY, color) {
  s.add(rect(x1 - 20, topY - 22, x2 - x1 + 40, 26, '#1d1d1f', 'rx="10"'));
  s.add(path(`M${x1} ${topY} L${x2} ${topY} L${x2} ${bottomY - 60} Q${x2} ${bottomY} ${x2 + 40} ${bottomY + 30} L${x1 - 40} ${bottomY + 30} Q${x1} ${bottomY} ${x1} ${bottomY - 60} Z`, s.lin([[0, shade(color, 0.05)], [0.8, color], [1, shade(color, 0.12)]])));
}

export function table(s, x, y, w, d, k = 1, top = '#6b4f37') {
  floorShadow(s, x, y + 180 * k, w * 0.55, 18 * k, 0.3);
  s.add(line(x - w * 0.42, y + 20 * k, x - w * 0.45, y + 180 * k, '#1f1f22', 8 * k));
  s.add(line(x + w * 0.42, y + 20 * k, x + w * 0.45, y + 180 * k, '#1f1f22', 8 * k));
  s.add(poly([[x - w * 0.42, y - d], [x + w * 0.42, y - d], [x + w / 2, y], [x - w / 2, y]], s.lin([[0, shade(top, 0.12)], [1, top]])));
  s.add(rect(x - w / 2, y, w, 14 * k, shade(top, -0.3)));
}

export function laptop(s, x, y, k = 1) {
  s.add(poly([[x - 70 * k, y], [x + 70 * k, y], [x + 80 * k, y + 14 * k], [x - 80 * k, y + 14 * k]], '#b9bcc2'));
  s.add(poly([[x - 66 * k, y], [x + 66 * k, y], [x + 60 * k, y - 90 * k], [x - 60 * k, y - 90 * k]], '#2a2c31'));
  s.add(poly([[x - 58 * k, y - 6 * k], [x + 58 * k, y - 6 * k], [x + 53 * k, y - 82 * k], [x - 53 * k, y - 82 * k]], s.lin([[0, '#3d5a8a'], [1, '#1f2a44']])));
}

export function lamp(s, x, footY, k = 1, color = '#ffd8a0') {
  glow(s, x, footY - 300 * k, 160 * k, color, 0.45);
  s.add(line(x, footY - 290 * k, x, footY, '#1d1d1f', 5 * k));
  s.add(ell(x, footY, 36 * k, 8 * k, '#1d1d1f'));
  s.add(path(`M${x - 50 * k} ${footY - 280 * k} L${x + 50 * k} ${footY - 280 * k} L${x + 32 * k} ${footY - 345 * k} L${x - 32 * k} ${footY - 345 * k} Z`, s.lin([[0, '#fff1d6'], [1, '#f1c98a']])));
}

export function bookshelf(s, x, y, w, h, k = 1) {
  s.add(rect(x, y, w, h, '#3b2e24'));
  const shelves = 4;
  const palette = ['#b8553f', '#d8b26e', '#4f6d7a', '#e8e1d4', '#2f4b3a', '#8a5a7a', '#c97d3d'];
  for (let i = 0; i < shelves; i++) {
    const sy = y + ((i + 1) * h) / shelves;
    s.add(rect(x, sy - 8 * k, w, 8 * k, '#5a463a'));
    let bx = x + 10 * k;
    let j = i * 3;
    while (bx < x + w - 30 * k) {
      const bw = (14 + ((j * 7) % 13)) * k;
      const bh = (h / shelves) * (0.55 + ((j * 13) % 30) / 100);
      if ((j * 5) % 11 === 3) {
        bx += 24 * k; // bo‘sh joy
      } else {
        s.add(rect(bx, sy - 8 * k - bh, bw, bh, palette[j % palette.length]));
        bx += bw + 2 * k;
      }
      j++;
    }
  }
}

export function makeupMirror(s, x, y, w, h) {
  s.add(rect(x, y, w, h, s.lin([[0, '#dfe6ea'], [1, '#f8f8f6']], 0, 0, 1, 1), 'rx="6"'));
  s.add(rect(x, y, w, h, 'none', 'stroke="#2a2a2c" stroke-width="10" rx="6"'));
  const n = 6;
  for (let i = 0; i < n; i++) {
    const bx = x + (w * (i + 0.5)) / n;
    glow(s, bx, y - 4, 26, '#fff2d0', 0.9);
    s.add(ell(bx, y - 4, 9, 9, '#fffaf0'));
  }
  for (let i = 0; i < 4; i++) {
    const by = y + (h * (i + 0.5)) / 4;
    glow(s, x - 4, by, 22, '#fff2d0', 0.8);
    glow(s, x + w + 4, by, 22, '#fff2d0', 0.8);
    s.add(ell(x - 4, by, 8, 8, '#fffaf0'));
    s.add(ell(x + w + 4, by, 8, 8, '#fffaf0'));
  }
}

export function haze(s, color, a = 0.18) {
  s.add(rect(0, 0, W, H, s.rad([[0, color, a], [1, color, 0]], 0.5, 0.45, 0.6)));
}

export function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const f = (c) => Math.round(Math.max(0, Math.min(255, amt >= 0 ? c + (255 - c) * amt : c * (1 + amt))));
  r = f(r);
  g = f(g);
  b = f(b);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}
