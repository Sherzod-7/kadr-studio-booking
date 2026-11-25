// Har bir studiya uchun 3 tadan interyer sahnasi.
// Foto, video va podkast xonalari rang va jihozlar orqali birinchi qarashda farqlanadi.
import {
  Scene, W, H, room, rect, poly, line, ell, path, glow, floorShadow, softbox, octabox, camera,
  plant, stool, armchair, sofa, rug, boomMic, headphones, foamPanels, hexPanels, ledTube,
  spotCone, truss, monitor, windowPane, sunBeam, floorPatch, brickWall, backdropRoll, table,
  laptop, lamp, bookshelf, makeupMirror, haze, shade, lightStand,
} from './scene-kit.mjs';

// ---------- 1. Yorug‘ Loft — tabiiy yorug‘likli fotostudiya ----------
function loftWide() {
  const s = new Scene();
  room(s, {
    back: [250, 120, 950, 640],
    wall: '#f3f0ea',
    floor: s.lin([[0, '#c7a47c'], [1, '#9c7651']]),
    planks: 14,
    left: s.lin([[0, '#e9e4da'], [1, '#f4f1eb']], 0, 0, 1, 0),
    ceiling: s.lin([[0, '#efebe4'], [1, '#f7f5f1']]),
  });
  brickWall(s, 250, 120, 700, 520, '#f4f1ec');
  windowPane(s, 310, 170, 220, 380, { trees: true });
  windowPane(s, 670, 170, 220, 380, { trees: true });
  sunBeam(s, 310, 170, 220, 380, 160, 260, 0.4);
  sunBeam(s, 670, 170, 220, 380, 160, 260, 0.4);
  floorPatch(s, [[330, 650], [560, 650], [700, 860], [420, 860]], 0.5);
  floorPatch(s, [[690, 650], [920, 650], [1080, 860], [800, 860]], 0.5);
  rug(s, 600, 760, 300, 70, '#d9cdb8');
  armchair(s, 600, 760, 0.95, '#d7c6aa');
  plant(s, 170, 830, 1.15);
  plant(s, 1030, 700, 0.75);
  // otrajatel (reflektor)
  lightStand(s, 1080, 860, 420, 1);
  s.add(ell(1080, 420, 95, 110, s.rad([[0, '#ffffff'], [0.8, '#f1ede4'], [1, '#d4cdbf']])));
  s.add(ell(1080, 420, 95, 110, 'none', 'stroke="#c9b27a" stroke-width="6"'));
  return s.svg();
}

function loftCorner() {
  const s = new Scene();
  room(s, {
    back: [-40, 60, 760, 700],
    wall: s.lin([[0, '#f6f2ea'], [1, '#ebe4d7']], 0, 0, 1, 0),
    right: s.lin([[0, '#e2dbcf'], [1, '#d1c8b9']], 0, 0, 1, 0),
    floor: s.lin([[0, '#c4a07a'], [1, '#93704e']]),
    planks: 10,
  });
  windowPane(s, 60, 110, 300, 470, { trees: true, cols: 3, rows: 4, frame: '#1f1f1f' });
  sunBeam(s, 60, 110, 300, 470, 380, 230, 0.5);
  floorPatch(s, [[120, 710], [420, 710], [720, 900], [330, 900]], 0.55);
  // shaffof parda
  s.add(path('M380 90 Q400 380 372 700 L430 700 Q445 380 420 90 Z', 'rgba(255,255,255,.55)'));
  stool(s, 520, 820, 1.2);
  plant(s, 860, 760, 1.25);
  s.add(rect(980, 200, 140, 180, s.lin([[0, '#cbbfa9'], [1, '#b2a58c']]), 'rx="4"'));
  s.add(rect(992, 212, 116, 156, s.lin([[0, '#e8dfcf'], [1, '#d3c6ae']])));
  return s.svg();
}

function loftSet() {
  const s = new Scene();
  room(s, {
    back: [180, 100, 1020, 660],
    wall: '#efe9df',
    floor: s.lin([[0, '#c09b74'], [1, '#916d4b']]),
    planks: 16,
  });
  backdropRoll(s, 380, 820, 140, 660, '#d8c3a5');
  stool(s, 600, 760, 1);
  softbox(s, 240, 850, 330, 1.05, 1, true);
  camera(s, 960, 880, 1.05, -1, false);
  sunBeam(s, -60, 80, 200, 300, 260, 360, 0.25);
  return s.svg();
}

// ---------- 2. Siklorama — oq siklorama, studiya chiroqlari ----------
function cycWide() {
  const s = new Scene();
  s.add(rect(0, 0, W, H, s.lin([[0, '#f4f5f6'], [0.62, '#fbfbfb'], [0.72, '#f1f1f0'], [1, '#d9d9d6']])));
  // siklorama egri chizig‘i
  s.add(path('M120 0 L120 520 Q120 650 300 690 L900 690 Q1080 650 1080 520 L1080 0 Z', s.lin([[0, '#fbfbfb'], [0.8, '#ffffff'], [1, '#f2f2f0']])));
  s.add(path('M120 520 Q120 650 300 690 L900 690 Q1080 650 1080 520', 'none', 'stroke="rgba(0,0,0,.05)" stroke-width="30" filter="' + s.blur(18) + '"'));
  s.add(rect(0, 690, W, 210, s.lin([[0, '#eeeeec'], [1, '#d6d6d2']])));
  floorShadow(s, 600, 700, 200, 20, 0.12);
  octabox(s, 230, 860, 320, 1.1);
  softbox(s, 990, 860, 300, 1.05, -1);
  camera(s, 640, 900, 1.2, -1, false);
  truss(s, 0, W, 30, '#3a3a3c');
  return s.svg();
}

function cycColors() {
  const s = new Scene();
  room(s, { back: [140, 90, 1060, 650], wall: '#ededeb', floor: s.lin([[0, '#cfcfcb'], [1, '#a9a9a4']]) });
  const colors = ['#d94f3d', '#e9b949', '#2f6fb2', '#2b2b2e', '#8bb59a', '#e7d9c4', '#b46aa0'];
  colors.forEach((c, i) => {
    const x = 190 + i * 125;
    s.add(rect(x - 10, 120, 120, 26, '#1d1d1f', 'rx="10"'));
    const len = 260 + ((i * 97) % 220);
    s.add(rect(x, 140, 100, len, s.lin([[0, shade(c, 0.08)], [1, shade(c, -0.12)]], 0, 0, 1, 0)));
  });
  backdropRoll(s, 420, 780, 160, 650, '#2f6fb2');
  stool(s, 600, 790, 1.05, '#d9d9d6');
  octabox(s, 1050, 880, 330, 1);
  return s.svg();
}

function cycMakeup() {
  const s = new Scene();
  room(s, { back: [120, 80, 1080, 640], wall: '#f2eee8', floor: s.lin([[0, '#cfc8bd'], [1, '#a9a196']]) });
  makeupMirror(s, 300, 180, 600, 330);
  s.add(rect(250, 560, 700, 30, '#e9e4dc'));
  s.add(rect(250, 590, 700, 110, '#d8d1c6'));
  floorShadow(s, 600, 720, 360, 20, 0.25);
  s.add(rect(330, 530, 40, 30, '#2b2b2e', 'rx="4"'));
  s.add(rect(390, 520, 22, 40, '#c97d6b', 'rx="6"'));
  s.add(rect(820, 525, 60, 35, '#e7d9c4', 'rx="6"'));
  stool(s, 600, 850, 1.05, '#2b2b2e');
  plant(s, 1080, 800, 0.9);
  return s.svg();
}

// ---------- 3. Kadr Sahna — xromakey videostudiya ----------
function greenWide() {
  const s = new Scene();
  room(s, {
    back: [160, 110, 1040, 640],
    wall: '#2fa24f',
    left: s.lin([[0, '#1d1f22'], [1, '#2a2d31']], 0, 0, 1, 0),
    right: s.lin([[0, '#2a2d31'], [1, '#1b1d20']], 0, 0, 1, 0),
    ceiling: '#131416',
    floor: s.lin([[0, '#2c9a4a'], [1, '#1e7a39']]),
  });
  s.add(rect(160, 110, 880, 530, s.rad([[0, '#45c066'], [1, '#2a9447']], 0.5, 0.5, 0.7)));
  s.add(rect(160, 600, 880, 60, s.lin([[0, '#2a9447', 0], [1, '#000', 0.12]]), `filter="${s.blur(10)}"`));
  truss(s, 0, W, 40);
  spotCone(s, 340, 90, 470, 700, 150, '#fff6e2', 0.18);
  spotCone(s, 860, 90, 730, 700, 150, '#fff6e2', 0.18);
  stool(s, 600, 740, 0.95, '#1e1e20');
  camera(s, 330, 900, 1.25, 1, true);
  softbox(s, 1010, 880, 360, 1, -1);
  return s.svg();
}

function greenControl() {
  const s = new Scene();
  room(s, {
    back: [100, 80, 1100, 600],
    wall: '#1c1e22',
    floor: s.lin([[0, '#2a2c30'], [1, '#141518']]),
    left: '#18191c',
    right: '#18191c',
    ceiling: '#0f1012',
  });
  // studiya oynasi orqali yashil sahna
  s.add(rect(160, 120, 880, 330, s.rad([[0, '#4cc56d'], [1, '#237f3e']])));
  s.add(rect(160, 120, 880, 330, 'none', 'stroke="#0c0c0d" stroke-width="16"'));
  s.add(poly([[160, 120], [420, 120], [260, 450], [160, 450]], 'rgba(255,255,255,.06)'));
  table(s, 600, 640, 1000, 80, 1, '#2d2f34');
  monitor(s, 330, 470, 230, 140, s.lin([[0, '#3aa15a'], [1, '#1d5a33']]));
  monitor(s, 600, 455, 260, 155, s.lin([[0, '#2c3e66'], [1, '#141c30']]));
  monitor(s, 870, 470, 230, 140, s.lin([[0, '#c98f4a'], [1, '#5a3a1f']]));
  s.add(rect(470, 600, 260, 30, '#3a3c42', 'rx="6"'));
  for (let i = 0; i < 8; i++) s.add(rect(485 + i * 30, 607, 18, 14, i % 3 ? '#62656d' : '#d94f3d', 'rx="3"'));
  return s.svg();
}

function greenPrompter() {
  const s = new Scene();
  room(s, {
    back: [220, 120, 980, 640],
    wall: '#33a855',
    left: '#1f2124',
    right: '#24262a',
    ceiling: '#141517',
    floor: s.lin([[0, '#2e9d4c'], [1, '#1f7b3a']]),
  });
  s.add(rect(220, 120, 760, 520, s.rad([[0, '#4dc46c'], [1, '#2c9849']])));
  // LED panellar
  [[150, 300], [1050, 300]].forEach(([x, y]) => {
    lightStand(s, x, 880, y + 120, 1);
    glow(s, x, y, 200, '#ffffff', 0.35);
    s.add(rect(x - 80, y - 60, 160, 120, s.lin([[0, '#ffffff'], [1, '#e6ecf2']]), 'rx="8" stroke="#1d1d1f" stroke-width="8"'));
  });
  // telesuflyor
  camera(s, 600, 900, 1.15, -1, true);
  s.add(poly([[480, 520], [720, 520], [690, 660], [510, 660]], 'rgba(200,220,255,.28)', 'stroke="#111" stroke-width="6"'));
  s.add(rect(505, 470, 190, 46, '#111113', 'rx="6"'));
  return s.svg();
}

// ---------- 4. Neon Box — RGB LED videostudiya ----------
function neonWide() {
  const s = new Scene();
  room(s, {
    back: [220, 140, 980, 640],
    wall: '#17142a',
    left: s.lin([[0, '#0d0b1a'], [1, '#1b1733']], 0, 0, 1, 0),
    right: s.lin([[0, '#1b1733'], [1, '#0c0a17']], 0, 0, 1, 0),
    ceiling: '#08070f',
    floor: s.lin([[0, '#1f1a38'], [1, '#07060d']]),
  });
  haze(s, '#7a3cff', 0.25);
  ledTube(s, 300, 200, 300, 600, '#ff2fb3', 9);
  ledTube(s, 900, 200, 900, 600, '#22d3ee', 9);
  ledTube(s, 420, 180, 780, 180, '#a855f7', 7);
  ledTube(s, 40, 90, 200, 210, '#ff2fb3', 8);
  ledTube(s, 1160, 90, 1000, 210, '#22d3ee', 8);
  s.add(poly([[300, 640], [900, 640], [1200, 900], [0, 900]], s.lin([[0, '#ff2fb3', 0.1], [0.5, '#a855f7', 0.12], [1, '#22d3ee', 0.08]], 0, 0, 1, 0)));
  floorShadow(s, 600, 760, 200, 18, 0.5);
  stool(s, 600, 760, 1, '#3b3550');
  glow(s, 600, 560, 260, '#ff2fb3', 0.12);
  camera(s, 980, 900, 1.1, -1, true);
  return s.svg();
}

function neonPanel() {
  const s = new Scene();
  room(s, { back: [120, 90, 1080, 660], wall: '#120f22', floor: s.lin([[0, '#1a1630'], [1, '#06050b']]), left: '#0b0a15', right: '#0b0a15', ceiling: '#06050b' });
  const cols = ['#ff2fb3', '#a855f7', '#6366f1', '#22d3ee', '#34d399'];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      const col = cols[(r + c) % cols.length];
      const x = 210 + c * 135;
      const y = 140 + r * 115;
      glow(s, x + 55, y + 45, 110, col, 0.22);
      s.add(rect(x, y, 110, 90, s.lin([[0, shade(col, 0.35)], [1, col]]), 'rx="6" opacity=".9"'));
    }
  }
  s.add(poly([[120, 660], [1080, 660], [1200, 900], [0, 900]], s.lin([[0, '#a855f7', 0.18], [1, '#000', 0]])));
  armchair(s, 600, 820, 0.95, '#2d2a3a');
  return s.svg();
}

function neonRig() {
  const s = new Scene();
  room(s, { back: [260, 160, 940, 620], wall: '#0f0d1c', floor: s.lin([[0, '#1c1733'], [1, '#05040a']]), left: '#0a0914', right: '#0a0914', ceiling: '#05040a' });
  haze(s, '#22d3ee', 0.18);
  // dumaloq neon
  s.add(ell(600, 360, 170, 170, 'none', `stroke="#ff2fb3" stroke-width="40" opacity=".35" filter="${s.blur(20)}"`));
  s.add(ell(600, 360, 170, 170, 'none', 'stroke="#ff7bd0" stroke-width="12"'));
  s.add(ell(600, 360, 170, 170, 'none', 'stroke="#fff" stroke-width="4" opacity=".8"'));
  ledTube(s, 0, 760, 360, 620, '#22d3ee', 8);
  ledTube(s, 1200, 760, 840, 620, '#22d3ee', 8);
  camera(s, 330, 900, 1.15, 1, true);
  softbox(s, 950, 880, 360, 0.95, -1);
  glow(s, 950, 380, 200, '#a855f7', 0.25);
  return s.svg();
}

// ---------- 5. Sado Podkast — ovoz izolyatsiyali xona ----------
function podWide() {
  const s = new Scene();
  room(s, {
    back: [160, 110, 1040, 620],
    wall: '#262b38',
    left: s.lin([[0, '#151925'], [1, '#22283a']], 0, 0, 1, 0),
    right: s.lin([[0, '#22283a'], [1, '#141822']], 0, 0, 1, 0),
    ceiling: '#11141c',
    floor: s.lin([[0, '#3a3430'], [1, '#1b1816']]),
  });
  foamPanels(s, 200, 150, 9, 4, 88, '#2e3546', 10);
  glow(s, 600, 380, 420, '#ffb46b', 0.18);
  rug(s, 600, 790, 420, 80, '#5a3d33');
  table(s, 600, 640, 640, 70, 1, '#7a573c');
  boomMic(s, 400, 572, 470, 470, 1);
  boomMic(s, 800, 572, 730, 470, 1);
  headphones(s, 560, 560, 0.8);
  laptop(s, 650, 590, 0.7);
  lamp(s, 1080, 860, 1.1);
  s.add(rect(940, 560, 60, 30, '#ffb46b', 'rx="4" opacity=".8"'));
  return s.svg();
}

function podDesk() {
  const s = new Scene();
  s.add(rect(0, 0, W, H, s.lin([[0, '#1f2431'], [1, '#141822']])));
  foamPanels(s, -20, -20, 13, 6, 92, '#2b3242', 8);
  glow(s, 820, 260, 420, '#ffb46b', 0.28);
  // stol ustki qismi (yaqin plan)
  s.add(poly([[0, 600], [W, 600], [W, H], [0, H]], s.lin([[0, '#8a6444'], [1, '#4b3322']])));
  s.add(rect(0, 590, W, 14, '#5b3e29'));
  boomMic(s, 200, 600, 520, 420, 1.6);
  headphones(s, 880, 640, 1.4);
  // mikser
  s.add(poly([[150, 760], [560, 760], [600, 880], [110, 880]], '#1b1c20'));
  for (let i = 0; i < 6; i++) {
    s.add(rect(180 + i * 62, 780, 10, 80, '#333'));
    s.add(rect(172 + i * 62, 800 + ((i * 17) % 40), 26, 14, i === 2 ? '#d94f3d' : '#c9c9c9', 'rx="3"'));
  }
  s.add(ell(960, 830, 60, 30, '#e8e1d4'));
  s.add(ell(960, 822, 46, 20, '#5a3a24'));
  return s.svg();
}

function podBooth() {
  const s = new Scene();
  room(s, { back: [140, 100, 1060, 640], wall: '#2a2f3c', floor: s.lin([[0, '#3a3430'], [1, '#191614']]), left: '#171b25', right: '#171b25', ceiling: '#10131a' });
  hexPanels(s, 200, 160, 52, 9, 4, ['#c7743e', '#2f3a4f', '#e1c79a', '#3d4a63']);
  glow(s, 600, 420, 400, '#ffc786', 0.2);
  table(s, 600, 660, 520, 60, 1, '#6d4c33');
  boomMic(s, 600, 600, 600, 480, 1.1);
  armchair(s, 600, 860, 0.85, '#3a4256');
  plant(s, 1080, 820, 0.95);
  lamp(s, 140, 860, 1);
  return s.svg();
}

// ---------- 6. Suhbat Xonasi — 4 kamerali podkast lounji ----------
function loungeWide() {
  const s = new Scene();
  room(s, {
    back: [180, 120, 1020, 620],
    wall: '#3a2f2a',
    left: s.lin([[0, '#211a17'], [1, '#342a25']], 0, 0, 1, 0),
    right: s.lin([[0, '#342a25'], [1, '#1f1916']], 0, 0, 1, 0),
    ceiling: '#18120f',
    floor: s.lin([[0, '#6a4b33'], [1, '#2e1f15']]),
    planks: 12,
    plankLine: 'rgba(0,0,0,.2)',
  });
  bookshelf(s, 240, 160, 720, 400);
  glow(s, 600, 330, 420, '#ffcf8a', 0.22);
  rug(s, 600, 780, 430, 85, '#7d4f3a');
  armchair(s, 400, 800, 0.9, '#b8844f', 1);
  armchair(s, 800, 800, 0.9, '#b8844f', -1);
  s.add(ell(600, 760, 90, 24, '#2a2420'));
  s.add(rect(590, 760, 20, 60, '#2a2420'));
  lightStand(s, 470, 760, 520, 0.8);
  s.add(rect(456, 490, 28, 60, '#202024', 'rx="12"'));
  lightStand(s, 730, 760, 520, 0.8);
  s.add(rect(716, 490, 28, 60, '#202024', 'rx="12"'));
  camera(s, 120, 900, 1.05, 1, true);
  camera(s, 1080, 900, 1.05, -1, true);
  return s.svg();
}

function loungeSofa() {
  const s = new Scene();
  room(s, {
    back: [100, 100, 1100, 650],
    wall: s.lin([[0, '#4a3a31'], [1, '#33271f']], 0, 0, 1, 0),
    floor: s.lin([[0, '#5c412c'], [1, '#2a1c12']]),
    left: '#231b16',
    right: '#231b16',
    ceiling: '#18120f',
  });
  // vertikal yog‘och reykalar
  for (let x = 120; x < 1090; x += 34) s.add(rect(x, 100, 18, 550, 'rgba(255,220,170,.07)'));
  ledTube(s, 120, 140, 1080, 140, '#ffb35c', 6);
  glow(s, 600, 260, 450, '#ffb35c', 0.18);
  sofa(s, 600, 760, 1.05, '#5d6b5a');
  plant(s, 160, 800, 1.1);
  lamp(s, 1040, 800, 1.05);
  return s.svg();
}

function loungeCams() {
  const s = new Scene();
  room(s, { back: [80, 80, 1120, 620], wall: '#1d1a18', floor: s.lin([[0, '#3a2c22'], [1, '#14100c']]), left: '#141210', right: '#141210', ceiling: '#0e0c0b' });
  const screens = [
    ['#7a5236', '#3b2a1e'],
    ['#5d6b5a', '#2c352c'],
    ['#b8844f', '#5a3f25'],
    ['#4f6d7a', '#25353c'],
  ];
  screens.forEach(([a, b], i) => {
    const x = 160 + (i % 2) * 460;
    const y = 120 + Math.floor(i / 2) * 250;
    s.add(rect(x, y, 420, 220, '#0b0b0c', 'rx="8"'));
    s.add(rect(x + 10, y + 10, 400, 200, s.lin([[0, a], [1, b]]), 'rx="4"'));
    s.add(ell(x + 210, y + 120, 60, 70, 'rgba(0,0,0,.25)'));
    s.add(ell(x + 210, y + 80, 34, 38, 'rgba(0,0,0,.3)'));
    glow(s, x + 30, y + 30, 10, '#ff3b30', 0.9);
  });
  table(s, 600, 720, 900, 60, 1, '#2b2522');
  s.add(rect(380, 670, 440, 40, '#232326', 'rx="6"'));
  for (let i = 0; i < 4; i++) s.add(rect(410 + i * 100, 680, 60, 20, i === 1 ? '#d94f3d' : '#6c6c72', 'rx="4"'));
  return s.svg();
}

export const studioScenes = {
  'yorug-loft': [loftWide, loftCorner, loftSet],
  siklorama: [cycWide, cycColors, cycMakeup],
  'kadr-sahna': [greenWide, greenControl, greenPrompter],
  'neon-box': [neonWide, neonPanel, neonRig],
  'sado-podkast': [podWide, podDesk, podBooth],
  'suhbat-xonasi': [loungeWide, loungeSofa, loungeCams],
};

