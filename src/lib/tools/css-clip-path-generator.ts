export interface ClipPoint {
  x: number;
  y: number;
}

export type ClipShape = 'polygon' | 'circle' | 'ellipse' | 'inset';

export interface CircleParams {
  radius: number;
  cx: number;
  cy: number;
}

export interface EllipseParams {
  rx: number;
  ry: number;
  cx: number;
  cy: number;
}

export interface InsetParams {
  top: number;
  right: number;
  bottom: number;
  left: number;
  round: number;
}

export const MIN_POINTS = 3;
export const MAX_POINTS = 24;

function pts(...values: number[]): ClipPoint[] {
  const out: ClipPoint[] = [];
  for (let i = 0; i < values.length; i += 2) {
    out.push({ x: values[i], y: values[i + 1] });
  }
  return out;
}

export const POLYGON_PRESETS: { id: string; points: ClipPoint[] }[] = [
  { id: 'triangle', points: pts(50, 0, 0, 100, 100, 100) },
  { id: 'trapezoid', points: pts(20, 0, 80, 0, 100, 100, 0, 100) },
  { id: 'parallelogram', points: pts(25, 0, 100, 0, 75, 100, 0, 100) },
  { id: 'rhombus', points: pts(50, 0, 100, 50, 50, 100, 0, 50) },
  { id: 'pentagon', points: pts(50, 0, 100, 38, 82, 100, 18, 100, 0, 38) },
  {
    id: 'hexagon',
    points: pts(25, 0, 75, 0, 100, 50, 75, 100, 25, 100, 0, 50),
  },
  {
    id: 'octagon',
    points: pts(30, 0, 70, 0, 100, 30, 100, 70, 70, 100, 30, 100, 0, 70, 0, 30),
  },
  {
    id: 'star',
    points: pts(
      50,
      0,
      61,
      35,
      98,
      35,
      68,
      57,
      79,
      91,
      50,
      70,
      21,
      91,
      32,
      57,
      2,
      35,
      39,
      35,
    ),
  },
  {
    id: 'arrow',
    points: pts(0, 20, 60, 20, 60, 0, 100, 50, 60, 100, 60, 80, 0, 80),
  },
  {
    id: 'chevron',
    points: pts(75, 0, 100, 50, 75, 100, 0, 100, 25, 50, 0, 0),
  },
  {
    id: 'message',
    points: pts(0, 0, 100, 0, 100, 75, 75, 75, 75, 100, 50, 75, 0, 75),
  },
  {
    id: 'cross',
    points: pts(
      20,
      0,
      80,
      0,
      80,
      20,
      100,
      20,
      100,
      80,
      80,
      80,
      80,
      100,
      20,
      100,
      20,
      80,
      0,
      80,
      0,
      20,
      20,
      20,
    ),
  },
];

/** 0〜100の範囲に収め、小数第1位に丸める */
export function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  const clamped = Math.min(100, Math.max(0, value));
  return Math.round(clamped * 10) / 10;
}

/** `50%` のように整数は小数点なしで整形する */
export function formatPercent(value: number): string {
  return `${clampPercent(value)}%`;
}

/** step が正のとき、step刻みにスナップする（0・負は無効） */
export function snapValue(value: number, step: number): number {
  if (!(step > 0)) return value;
  return Math.round(value / step) * step;
}

export function buildPolygonValue(points: ClipPoint[]): string {
  return `polygon(${points
    .map((p) => `${formatPercent(p.x)} ${formatPercent(p.y)}`)
    .join(', ')})`;
}

export function buildCircleValue(params: CircleParams): string {
  return `circle(${formatPercent(params.radius)} at ${formatPercent(params.cx)} ${formatPercent(params.cy)})`;
}

export function buildEllipseValue(params: EllipseParams): string {
  return `ellipse(${formatPercent(params.rx)} ${formatPercent(params.ry)} at ${formatPercent(params.cx)} ${formatPercent(params.cy)})`;
}

export function buildInsetValue(params: InsetParams): string {
  const base = [params.top, params.right, params.bottom, params.left]
    .map(formatPercent)
    .join(' ');
  const round = clampPercent(params.round);
  return round > 0 ? `inset(${base} round ${round}%)` : `inset(${base})`;
}

export function buildClipPathDeclaration(value: string): string {
  return `clip-path: ${value};`;
}

/** ベンダープレフィックス付きも含めた、コピー用の宣言 */
export function buildClipPathWithPrefix(value: string): string {
  return `-webkit-clip-path: ${value};\nclip-path: ${value};`;
}

/** 最後の頂点と先頭の頂点の中点に頂点を追加する（上限に達していればそのまま） */
export function addPoint(points: ClipPoint[]): ClipPoint[] {
  if (points.length >= MAX_POINTS) return points;
  const last = points[points.length - 1];
  const first = points[0];
  return [
    ...points,
    {
      x: clampPercent((last.x + first.x) / 2),
      y: clampPercent((last.y + first.y) / 2),
    },
  ];
}

/** 頂点を削除する（3点未満にはならない） */
export function removePoint(points: ClipPoint[], index: number): ClipPoint[] {
  if (points.length <= MIN_POINTS) return points;
  if (index < 0 || index >= points.length) return points;
  return points.filter((_, i) => i !== index);
}

export function movePoint(
  points: ClipPoint[],
  index: number,
  x: number,
  y: number,
): ClipPoint[] {
  if (index < 0 || index >= points.length) return points;
  return points.map((p, i) =>
    i === index ? { x: clampPercent(x), y: clampPercent(y) } : p,
  );
}

/** ポインタ座標をプレビュー領域内のパーセント座標へ変換する */
export function pointFromPointer(
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  snapStep = 0,
): ClipPoint {
  if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  return {
    x: clampPercent(snapValue(x, snapStep)),
    y: clampPercent(snapValue(y, snapStep)),
  };
}
