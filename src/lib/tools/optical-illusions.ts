/**
 * 錯視ギャラリーの図形計算。
 * 各錯視を「図形のリスト」として返す純粋関数群（DOM・文言は持たない）。
 * 描画側は図形を SVG 属性に変換するだけでよい（style 属性は使わない）。
 */

export const VIEW_WIDTH = 400;
export const VIEW_HEIGHT = 260;

export const ILLUSION_IDS = [
  'muller-lyer',
  'ponzo',
  'zollner',
  'ebbinghaus',
  'cafe-wall',
  'checker-shadow',
  'hermann-grid',
  'poggendorff',
  'fraser-spiral',
] as const;

export type IllusionId = (typeof ILLUSION_IDS)[number];

/** main: 図の本体 / inducer: 錯視を起こす要因 / guide: 「実は同じ・平行」を確かめる補助線 */
export type ShapeRole = 'main' | 'inducer' | 'guide';

interface ShapeBase {
  role: ShapeRole;
}

export type Shape =
  | (ShapeBase & {
      kind: 'line';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      stroke: string;
      width: number;
      dash?: boolean;
    })
  | (ShapeBase & {
      kind: 'rect';
      x: number;
      y: number;
      w: number;
      h: number;
      fill: string;
      opacity?: number;
    })
  | (ShapeBase & {
      kind: 'circle';
      cx: number;
      cy: number;
      r: number;
      fill?: string;
      stroke?: string;
      width?: number;
      dash?: boolean;
    })
  | (ShapeBase & {
      kind: 'polygon';
      points: [number, number][];
      fill: string;
      opacity?: number;
    })
  | (ShapeBase & {
      kind: 'text';
      x: number;
      y: number;
      text: string;
      fill: string;
      size: number;
    });

export interface Illusion {
  id: IllusionId;
  width: number;
  height: number;
  shapes: Shape[];
}

export const MIN_STRENGTH = 0;
export const MAX_STRENGTH = 100;
export const DEFAULT_STRENGTH = 70;

/** 強さのスライダーが効く錯視か */
const NO_STRENGTH: readonly IllusionId[] = ['checker-shadow'];
/** 「錯視の要因を隠す」が効く（inducer を持つ）錯視か */
const NO_INDUCER: readonly IllusionId[] = [
  'checker-shadow',
  'hermann-grid',
  'fraser-spiral',
];

export function usesStrength(id: IllusionId): boolean {
  return !NO_STRENGTH.includes(id);
}

export function hasInducers(id: IllusionId): boolean {
  return !NO_INDUCER.includes(id);
}

export function isIllusionId(value: string): value is IllusionId {
  return (ILLUSION_IDS as readonly string[]).includes(value);
}

export function clampStrength(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_STRENGTH;
  return Math.min(MAX_STRENGTH, Math.max(MIN_STRENGTH, Math.round(value)));
}

const INK = '#111827';
const PAPER = '#ffffff';
const GUIDE = '#dc2626';

/** 線形補間。t=0 で a、t=1 で b */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** 色 base の上に黒を opacity で重ねたときのグレー値（0-255 の整数） */
export function shadowedGray(base: number, opacity: number): number {
  return Math.round(base * (1 - opacity));
}

export function grayHex(value: number): string {
  const v = Math.min(255, Math.max(0, Math.round(value)));
  const h = v.toString(16).padStart(2, '0');
  return `#${h}${h}${h}`;
}

function background(fill: string): Shape {
  return {
    kind: 'rect',
    role: 'main',
    x: 0,
    y: 0,
    w: VIEW_WIDTH,
    h: VIEW_HEIGHT,
    fill,
  };
}

function mullerLyer(s: number): Shape[] {
  const fin = lerp(14, 44, s / 100);
  const d = fin * Math.SQRT1_2;
  const x1 = 100;
  const x2 = 300;
  const shapes: Shape[] = [background(PAPER)];
  const rows: { y: number; inward: boolean }[] = [
    { y: 80, inward: true },
    { y: 180, inward: false },
  ];
  for (const { y, inward } of rows) {
    shapes.push({
      kind: 'line',
      role: 'main',
      x1,
      y1: y,
      x2,
      y2: y,
      stroke: INK,
      width: 3,
    });
    // 内向き（矢じり形）は短く、外向き（矢羽根形）は長く見える
    const dx = inward ? d : -d;
    for (const [ex, sign] of [
      [x1, 1],
      [x2, -1],
    ] as const) {
      for (const dy of [-d, d]) {
        shapes.push({
          kind: 'line',
          role: 'inducer',
          x1: ex,
          y1: y,
          x2: ex + sign * dx,
          y2: y + dy,
          stroke: INK,
          width: 3,
        });
      }
    }
  }
  for (const x of [x1, x2]) {
    shapes.push({
      kind: 'line',
      role: 'guide',
      x1: x,
      y1: 30,
      x2: x,
      y2: 230,
      stroke: GUIDE,
      width: 1.5,
      dash: true,
    });
  }
  return shapes;
}

/** ポンゾ錯視で収束線の半幅を高さ y で求める */
export function ponzoHalfGap(y: number, s: number): number {
  const bottom = 80;
  const top = lerp(80, 10, s / 100);
  const t = (250 - y) / (250 - 20);
  return lerp(bottom, top, t);
}

function ponzo(s: number): Shape[] {
  const shapes: Shape[] = [background(PAPER)];
  for (const sign of [-1, 1]) {
    shapes.push({
      kind: 'line',
      role: 'inducer',
      x1: 200 + sign * ponzoHalfGap(250, s),
      y1: 250,
      x2: 200 + sign * ponzoHalfGap(20, s),
      y2: 20,
      stroke: '#6b7280',
      width: 4,
    });
  }
  for (const y of [70, 200]) {
    shapes.push({
      kind: 'line',
      role: 'main',
      x1: 150,
      y1: y,
      x2: 250,
      y2: y,
      stroke: GUIDE,
      width: 6,
    });
  }
  for (const x of [150, 250]) {
    shapes.push({
      kind: 'line',
      role: 'guide',
      x1: x,
      y1: 50,
      x2: x,
      y2: 220,
      stroke: '#2563eb',
      width: 1.5,
      dash: true,
    });
  }
  return shapes;
}

function zollner(s: number): Shape[] {
  const tilt = lerp(10, 60, s / 100);
  const rad = (tilt * Math.PI) / 180;
  const half = 14;
  const shapes: Shape[] = [background(PAPER)];
  const ys = [50, 100, 150, 200];
  ys.forEach((y, row) => {
    shapes.push({
      kind: 'line',
      role: 'main',
      x1: 30,
      y1: y,
      x2: 370,
      y2: y,
      stroke: INK,
      width: 3,
    });
    // 行ごとに傾きの向きを反転させる
    const sign = row % 2 === 0 ? 1 : -1;
    for (let x = 50; x <= 350; x += 20) {
      const dx = Math.sin(rad) * half * sign;
      const dy = Math.cos(rad) * half;
      shapes.push({
        kind: 'line',
        role: 'inducer',
        x1: x - dx,
        y1: y - dy,
        x2: x + dx,
        y2: y + dy,
        stroke: INK,
        width: 1.5,
      });
    }
  });
  for (const x of [30, 130, 230, 330]) {
    shapes.push({
      kind: 'line',
      role: 'guide',
      x1: x,
      y1: 20,
      x2: x,
      y2: 240,
      stroke: GUIDE,
      width: 1.5,
      dash: true,
    });
  }
  return shapes;
}

/** エビングハウスの周囲の円: 大きい円の半径と小さい円の半径 */
export function ebbinghausRadii(s: number): { large: number; small: number } {
  return {
    large: lerp(18, 32, s / 100),
    small: lerp(12, 6, s / 100),
  };
}

function ebbinghaus(s: number): Shape[] {
  const center = 18;
  const { large, small } = ebbinghausRadii(s);
  const shapes: Shape[] = [background(PAPER)];
  const cy = 130;
  const groups = [
    { cx: 105, r: large, n: 5 },
    { cx: 295, r: small, n: 8 },
  ];
  for (const { cx, r, n } of groups) {
    const d = center + 6 + r;
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n - Math.PI / 2;
      shapes.push({
        kind: 'circle',
        role: 'inducer',
        cx: cx + d * Math.cos(a),
        cy: cy + d * Math.sin(a),
        r,
        fill: '#9ca3af',
      });
    }
  }
  for (const cx of [105, 295]) {
    shapes.push({
      kind: 'circle',
      role: 'main',
      cx,
      cy,
      r: center,
      fill: '#ea580c',
    });
  }
  for (const y of [cy - center, cy + center]) {
    shapes.push({
      kind: 'line',
      role: 'guide',
      x1: 10,
      y1: y,
      x2: 390,
      y2: y,
      stroke: '#2563eb',
      width: 1.5,
      dash: true,
    });
  }
  return shapes;
}

/** カフェウォールの行ずらし量（セル幅 40 に対して 0〜12） */
export function cafeWallShift(s: number): number {
  return lerp(0, 12, s / 100);
}

function cafeWall(s: number): Shape[] {
  const x0 = 40;
  const x1 = 360;
  const cell = 40;
  const rowH = 30;
  const rows = 6;
  const y0 = 40;
  const shift = cafeWallShift(s);
  const shapes: Shape[] = [
    background(PAPER),
    {
      kind: 'rect',
      role: 'main',
      x: x0,
      y: y0,
      w: x1 - x0,
      h: rows * rowH - 2,
      fill: '#8a8a8a',
    },
  ];
  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * shift;
    for (let k = -1; k * cell < x1 - x0; k++) {
      const a = Math.max(x0, x0 + offset + k * cell);
      const b = Math.min(x1, x0 + offset + (k + 1) * cell);
      if (b <= a) continue;
      shapes.push({
        kind: 'rect',
        role: 'inducer',
        x: a,
        y: y0 + r * rowH,
        w: b - a,
        h: rowH - 2,
        fill: k % 2 === 0 ? '#111111' : '#ffffff',
      });
    }
  }
  for (let r = 1; r < rows; r++) {
    const y = y0 + r * rowH - 1;
    shapes.push({
      kind: 'line',
      role: 'guide',
      x1: x0 - 20,
      y1: y,
      x2: x1 + 20,
      y2: y,
      stroke: GUIDE,
      width: 1.5,
    });
  }
  return shapes;
}

export const CHECKER_LIGHT = 200;
export const CHECKER_DARK = 120;
export const CHECKER_SHADOW_OPACITY = 1 - CHECKER_DARK / CHECKER_LIGHT;

function checkerShadow(): Shape[] {
  const size = 50;
  const x0 = 100;
  const y0 = 40;
  const shapes: Shape[] = [background(PAPER)];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const light = (r + c) % 2 === 0;
      shapes.push({
        kind: 'rect',
        role: 'main',
        x: x0 + c * size,
        y: y0 + r * size,
        w: size,
        h: size,
        fill: grayHex(light ? CHECKER_LIGHT : CHECKER_DARK),
      });
    }
  }
  // 右下の 2x2 マスに影をかける（A はこの影の中の明るいマス）
  shapes.push({
    kind: 'rect',
    role: 'main',
    x: x0 + 2 * size,
    y: y0 + 2 * size,
    w: 2 * size,
    h: 2 * size,
    fill: '#000000',
    opacity: CHECKER_SHADOW_OPACITY,
  });
  const a = { x: x0 + 2.5 * size, y: y0 + 2.5 * size };
  const b = { x: x0 + 1.5 * size, y: y0 + 0.5 * size };
  const len = Math.hypot(a.x - b.x, a.y - b.y);
  const nx = (-(a.y - b.y) / len) * 8;
  const ny = ((a.x - b.x) / len) * 8;
  shapes.push({
    kind: 'polygon',
    role: 'guide',
    points: [
      [a.x + nx, a.y + ny],
      [b.x + nx, b.y + ny],
      [b.x - nx, b.y - ny],
      [a.x - nx, a.y - ny],
    ],
    fill: grayHex(CHECKER_DARK),
  });
  shapes.push(
    {
      kind: 'text',
      role: 'main',
      x: a.x,
      y: a.y + 6,
      text: 'A',
      fill: '#ffffff',
      size: 18,
    },
    {
      kind: 'text',
      role: 'main',
      x: b.x,
      y: b.y + 6,
      text: 'B',
      fill: '#ffffff',
      size: 18,
    },
  );
  return shapes;
}

/** ヘルマン格子: 4x4 の黒いマスと隙間の幅 */
export function hermannGap(s: number): number {
  return lerp(8, 22, s / 100);
}

function hermannGrid(s: number): Shape[] {
  const n = 4;
  const sq = 44;
  const gap = hermannGap(s);
  const total = n * sq + (n - 1) * gap;
  const ox = (VIEW_WIDTH - total) / 2;
  const oy = (VIEW_HEIGHT - total) / 2;
  const shapes: Shape[] = [background(PAPER)];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      shapes.push({
        kind: 'rect',
        role: 'main',
        x: ox + c * (sq + gap),
        y: oy + r * (sq + gap),
        w: sq,
        h: sq,
        fill: '#111111',
      });
    }
  }
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      shapes.push({
        kind: 'circle',
        role: 'guide',
        cx: ox + (c + 1) * sq + c * gap + gap / 2,
        cy: oy + (r + 1) * sq + r * gap + gap / 2,
        r: Math.min(5, gap / 2),
        fill: GUIDE,
      });
    }
  }
  return shapes;
}

/** ポッゲンドルフ: 斜線の傾き・遮へい板の幅。線は板の左右で完全に一直線 */
export function poggendorffLineY(x: number): number {
  return 40 + (x - 60) * 0.7;
}

export function poggendorffBarWidth(s: number): number {
  return lerp(40, 100, s / 100);
}

function poggendorff(s: number): Shape[] {
  const w = poggendorffBarWidth(s);
  const left = 200 - w / 2;
  const right = 200 + w / 2;
  const shapes: Shape[] = [
    background(PAPER),
    {
      kind: 'rect',
      role: 'inducer',
      x: left,
      y: 15,
      w,
      h: 230,
      fill: '#9ca3af',
    },
  ];
  const segs: [number, number][] = [
    [60, left],
    [right, 340],
  ];
  for (const [a, b] of segs) {
    shapes.push({
      kind: 'line',
      role: 'main',
      x1: a,
      y1: poggendorffLineY(a),
      x2: b,
      y2: poggendorffLineY(b),
      stroke: INK,
      width: 3,
    });
  }
  shapes.push({
    kind: 'line',
    role: 'guide',
    x1: 60,
    y1: poggendorffLineY(60),
    x2: 340,
    y2: poggendorffLineY(340),
    stroke: GUIDE,
    width: 1.5,
    dash: true,
  });
  return shapes;
}

/** フレーザー錯視: 同心円の半径 */
export const FRASER_RADII = [30, 60, 90, 120] as const;

export function fraserSegmentCount(r: number): number {
  return 2 * Math.round((Math.PI * r) / 16);
}

function fraserSpiral(s: number): Shape[] {
  const tilt = lerp(5, 40, s / 100);
  const rad = (tilt * Math.PI) / 180;
  const cx = 200;
  const cy = 130;
  const half = 8;
  const shapes: Shape[] = [background('#a3a3a3')];
  for (const r of FRASER_RADII) {
    const n = fraserSegmentCount(r);
    for (let i = 0; i < n; i++) {
      const a = (2 * Math.PI * i) / n;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      // 接線方向を tilt だけ回した向きの短い線分
      const ta = a + Math.PI / 2 + rad;
      shapes.push({
        kind: 'line',
        role: 'main',
        x1: px - Math.cos(ta) * half,
        y1: py - Math.sin(ta) * half,
        x2: px + Math.cos(ta) * half,
        y2: py + Math.sin(ta) * half,
        stroke: i % 2 === 0 ? '#111111' : '#fafafa',
        width: 5,
      });
    }
  }
  for (const r of FRASER_RADII) {
    shapes.push({
      kind: 'circle',
      role: 'guide',
      cx,
      cy,
      r,
      stroke: GUIDE,
      width: 1.5,
    });
  }
  return shapes;
}

export function buildIllusion(id: IllusionId, strength: number): Illusion {
  const s = clampStrength(strength);
  let shapes: Shape[];
  switch (id) {
    case 'muller-lyer':
      shapes = mullerLyer(s);
      break;
    case 'ponzo':
      shapes = ponzo(s);
      break;
    case 'zollner':
      shapes = zollner(s);
      break;
    case 'ebbinghaus':
      shapes = ebbinghaus(s);
      break;
    case 'cafe-wall':
      shapes = cafeWall(s);
      break;
    case 'checker-shadow':
      shapes = checkerShadow();
      break;
    case 'hermann-grid':
      shapes = hermannGrid(s);
      break;
    case 'poggendorff':
      shapes = poggendorff(s);
      break;
    case 'fraser-spiral':
      shapes = fraserSpiral(s);
      break;
  }
  return { id, width: VIEW_WIDTH, height: VIEW_HEIGHT, shapes };
}

export interface DisplayOptions {
  showGuides: boolean;
  hideInducers: boolean;
}

/** 表示オプションに応じて描く図形を選ぶ（元の順序＝重なり順は保つ） */
export function visibleShapes(shapes: Shape[], opts: DisplayOptions): Shape[] {
  return shapes.filter((sh) => {
    if (sh.role === 'guide') return opts.showGuides;
    if (sh.role === 'inducer') return !opts.hideInducers;
    return true;
  });
}

/** 次の錯視（末尾の次は先頭に戻る） */
export function nextIllusion(id: IllusionId): IllusionId {
  const i = ILLUSION_IDS.indexOf(id);
  return ILLUSION_IDS[(i + 1) % ILLUSION_IDS.length];
}
