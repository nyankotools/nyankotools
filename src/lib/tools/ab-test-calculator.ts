/** 余誤差関数 erfc(x)。級数と連分数で倍精度に近い精度を出す。 */
export function erfc(x: number): number {
  if (Number.isNaN(x)) return NaN;
  if (x < 0) return 2 - erfc(-x);
  if (x === 0) return 1;
  if (x > 27) return 0;
  if (x < 3) {
    // erf(x) = 2/√π · e^{-x²} · Σ 2^n x^{2n+1} / (2n+1)!!（全項が正で桁落ちしない）
    let term = x;
    let sum = x;
    for (let n = 1; n < 200; n++) {
      term *= (2 * x * x) / (2 * n + 1);
      sum += term;
      if (term < sum * 1e-17) break;
    }
    const erf = (2 / Math.sqrt(Math.PI)) * Math.exp(-x * x) * sum;
    return 1 - erf;
  }
  // 連分数: erfc(x) = e^{-x²}/√π · 1/(x + (1/2)/(x + 1/(x + (3/2)/(x + ...))))
  let f = x;
  for (let k = 80; k >= 1; k--) {
    f = x + k / 2 / f;
  }
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / f;
}

/** 標準正規分布の累積分布関数 Φ(x) */
export function normalCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2);
}

/** 標準正規分布の逆累積分布関数 Φ⁻¹(p)（0 < p < 1）。範囲外はNaN。 */
export function normalInv(p: number): number {
  if (!(p > 0 && p < 1)) return NaN;
  // Acklam のアルゴリズム + Halley 法で1回補正
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];
  const pLow = 0.02425;
  let x: number;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    x =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pLow) {
    const q = p - 0.5;
    const r = q * q;
    x =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) *
        q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  const e = normalCdf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

export type Tail = 'two' | 'one';

export type AbTestError =
  'visitors' | 'conversions' | 'alpha' | 'baseline' | 'effect' | 'power';

export interface AbTestInput {
  visitorsA: number;
  conversionsA: number;
  visitorsB: number;
  conversionsB: number;
  /** 有意水準（例: 0.05） */
  alpha: number;
  /** two: 両側検定、one: 片側検定（BがAより高いかを検定） */
  tail: Tail;
}

export interface AbTestResult {
  rateA: number;
  rateB: number;
  /** B − A（割合の差） */
  diff: number;
  /** (B − A) ÷ A。Aのコンバージョン率が0のときはnull */
  relativeLift: number | null;
  /** プール分散のz値。標準誤差が0のときは0 */
  z: number;
  pValue: number;
  significant: boolean;
  /** 差（B − A）の (1−α) 信頼区間（両側・非プール標準誤差） */
  ciLower: number;
  ciUpper: number;
  /** 期待度数（4つのセル）のいずれかが5未満 */
  smallExpected: boolean;
}

function isCount(n: number): boolean {
  return Number.isInteger(n) && n >= 0;
}

/** 2標本比率のz検定（プール分散）。入力が不正なときはエラーコードを返す。 */
export function testTwoProportions(
  input: AbTestInput,
): AbTestResult | { error: AbTestError } {
  const { visitorsA, conversionsA, visitorsB, conversionsB, alpha, tail } =
    input;
  if (
    !isCount(visitorsA) ||
    !isCount(visitorsB) ||
    visitorsA < 1 ||
    visitorsB < 1
  )
    return { error: 'visitors' };
  if (
    !isCount(conversionsA) ||
    !isCount(conversionsB) ||
    conversionsA > visitorsA ||
    conversionsB > visitorsB
  )
    return { error: 'conversions' };
  if (!(alpha > 0 && alpha < 0.5)) return { error: 'alpha' };

  const rateA = conversionsA / visitorsA;
  const rateB = conversionsB / visitorsB;
  const diff = rateB - rateA;
  const pooled = (conversionsA + conversionsB) / (visitorsA + visitorsB);
  const se = Math.sqrt(pooled * (1 - pooled) * (1 / visitorsA + 1 / visitorsB));
  const z = se === 0 ? 0 : diff / se;
  const pValue =
    tail === 'two'
      ? erfc(Math.abs(z) / Math.SQRT2)
      : 0.5 * erfc(z / Math.SQRT2);

  const seUnpooled = Math.sqrt(
    (rateA * (1 - rateA)) / visitorsA + (rateB * (1 - rateB)) / visitorsB,
  );
  const zCrit = normalInv(1 - alpha / 2);
  const smallExpected =
    Math.min(
      visitorsA * pooled,
      visitorsA * (1 - pooled),
      visitorsB * pooled,
      visitorsB * (1 - pooled),
    ) < 5;

  return {
    rateA,
    rateB,
    diff,
    relativeLift: rateA === 0 ? null : diff / rateA,
    z,
    pValue,
    significant: pValue < alpha,
    ciLower: diff - zCrit * seUnpooled,
    ciUpper: diff + zCrit * seUnpooled,
    smallExpected,
  };
}

export type EffectType = 'relative' | 'absolute';

export interface SampleSizeInput {
  /** ベースラインのコンバージョン率（0〜1） */
  baselineRate: number;
  /** 検出したい最小の改善。relativeなら比率（0.1 = +10%）、absoluteなら割合の差（0.01 = +1pt） */
  effect: number;
  effectType: EffectType;
  alpha: number;
  /** 検出力 1−β（例: 0.8） */
  power: number;
  tail: Tail;
}

export interface SampleSizeResult {
  /** 改善後に想定されるコンバージョン率 */
  targetRate: number;
  /** 各群の必要サンプルサイズ（切り上げ） */
  perGroup: number;
  total: number;
}

/** 2標本比率の検定に必要な各群のサンプルサイズを求める。 */
export function requiredSampleSize(
  input: SampleSizeInput,
): SampleSizeResult | { error: AbTestError } {
  const { baselineRate: p1, effect, effectType, alpha, power, tail } = input;
  if (!(p1 > 0 && p1 < 1)) return { error: 'baseline' };
  if (!(alpha > 0 && alpha < 0.5)) return { error: 'alpha' };
  if (!(power > 0.5 && power < 1)) return { error: 'power' };
  if (!Number.isFinite(effect) || effect === 0) return { error: 'effect' };
  const p2 = effectType === 'relative' ? p1 * (1 + effect) : p1 + effect;
  if (!(p2 > 0 && p2 < 1) || p2 === p1) return { error: 'effect' };

  const zAlpha = normalInv(tail === 'two' ? 1 - alpha / 2 : 1 - alpha);
  const zBeta = normalInv(power);
  const pBar = (p1 + p2) / 2;
  const numerator =
    zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) +
    zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2));
  const perGroup = Math.ceil(numerator ** 2 / (p2 - p1) ** 2 - 1e-9);
  return { targetRate: p2, perGroup, total: perGroup * 2 };
}
