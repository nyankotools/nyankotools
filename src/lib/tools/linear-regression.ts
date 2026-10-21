export type RegressionError = 'tooFew' | 'xConstant' | 'tooMany';

export interface Point {
  x: number;
  y: number;
}

export interface ParsePairsResult {
  points: Point[];
  /** x,y の2数値として読めなかった行の数 */
  invalidCount: number;
}

export interface RegressionResult {
  count: number;
  slope: number;
  intercept: number;
  /** 相関係数 r（yが全て同値のときはnull） */
  r: number | null;
  /** 決定係数 R²（yが全て同値のときはnull） */
  r2: number | null;
  meanX: number;
  meanY: number;
}

export const MAX_REGRESSION_POINTS = 10000;

const NUMBER_RE = /^[+-]?(\d+\.?\d*|\.\d+)(e[+-]?\d+)?$/i;

function normalize(text: string): string {
  return text
    .replace(/−/g, '-')
    .replace(/[０-９．－＋]/g, (c) =>
      c === '．'
        ? '.'
        : c === '－'
          ? '-'
          : c === '＋'
            ? '+'
            : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    );
}

/** 1行1組。カンマ・タブ・スペース・読点・セミコロン区切りの x,y を読み取る。 */
export function parsePairs(text: string): ParsePairsResult {
  const points: Point[] = [];
  let invalidCount = 0;
  for (const line of normalize(text).split(/\r\n|\r|\n/)) {
    const tokens = line.split(/[\s,、，;；]+/).filter((t) => t !== '');
    if (tokens.length === 0) continue;
    if (
      tokens.length !== 2 ||
      !NUMBER_RE.test(tokens[0]) ||
      !NUMBER_RE.test(tokens[1])
    ) {
      invalidCount++;
      continue;
    }
    const x = Number(tokens[0]);
    const y = Number(tokens[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) points.push({ x, y });
    else invalidCount++;
  }
  return { points, invalidCount };
}

/** 最小二乗法による回帰直線 y = slope·x + intercept と相関係数。 */
export function calculateRegression(
  points: Point[],
): RegressionResult | { error: RegressionError } {
  const n = points.length;
  if (n < 2) return { error: 'tooFew' };
  if (n > MAX_REGRESSION_POINTS) return { error: 'tooMany' };

  if (points.every((p) => p.x === points[0].x)) return { error: 'xConstant' };

  const meanX = points.reduce((a, p) => a + p.x, 0) / n;
  const meanY = points.reduce((a, p) => a + p.y, 0) / n;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }
  if (!(sxx > 0) || !Number.isFinite(sxx)) return { error: 'xConstant' };

  // y が（誤差を除いて）一定なら傾き 0、r と R² は計算不可
  const yConstant = syy <= 1e-24 * (syy + n * meanY * meanY);
  const slope = yConstant ? 0 : sxy / sxx;
  const intercept = meanY - slope * meanX;
  let r: number | null = null;
  let r2: number | null = null;
  if (!yConstant) {
    r = Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy)));
    r2 = r * r;
  }
  return { count: n, slope, intercept, r, r2, meanX, meanY };
}

/** x に対する予測値 y。 */
export function predictY(
  result: Pick<RegressionResult, 'slope' | 'intercept'>,
  x: number,
): number | null {
  if (!Number.isFinite(x)) return null;
  const y = result.slope * x + result.intercept;
  return Number.isFinite(y) ? y : null;
}
