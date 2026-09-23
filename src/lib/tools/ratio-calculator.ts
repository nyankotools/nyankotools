function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

// 数値の小数桁数を取得する（小数を含む比を整数化して約分するため）
function countDecimals(value: number): number {
  const str = value.toString();
  if (str.includes('e-')) {
    // 例: "1.5e-7" -> 仮数部の小数桁(1) + 指数(7) = 8桁
    const [mantissa, exponent] = str.split('e-');
    const mantissaDecimalIndex = mantissa.indexOf('.');
    const mantissaDecimals =
      mantissaDecimalIndex === -1
        ? 0
        : mantissa.length - mantissaDecimalIndex - 1;
    return mantissaDecimals + Number(exponent);
  }
  const decimalIndex = str.indexOf('.');
  return decimalIndex === -1 ? 0 : str.length - decimalIndex - 1;
}

export interface SimplifiedRatio {
  a: number;
  b: number;
}

/**
 * 比 a:b を最も簡単な整数比に約分する。
 * 小数を含む比は、両辺を10の累乗倍して整数化してから最大公約数で約分する。
 * a・bのいずれかが0以下、NaN、Infinityの場合はnull。
 */
export function simplifyRatio(a: number, b: number): SimplifiedRatio | null {
  if (!isFinite(a) || !isFinite(b) || !(a > 0) || !(b > 0)) return null;

  const decimals = Math.max(countDecimals(a), countDecimals(b));
  const scale = Math.pow(10, decimals);
  const scaledA = Math.round(a * scale);
  const scaledB = Math.round(b * scale);
  if (
    !isFinite(scaledA) ||
    !isFinite(scaledB) ||
    scaledA === 0 ||
    scaledB === 0
  )
    return null;
  const divisor = gcd(scaledA, scaledB);

  return { a: scaledA / divisor, b: scaledB / divisor };
}

export interface ProportionInput {
  a: number | null;
  b: number | null;
  c: number | null;
  d: number | null;
}

/**
 * 比例式 a:b = c:d において、a・b・c・dのうちちょうど1つが未知（null）のとき、
 * その値を計算する（a*d = b*cの関係を利用）。
 * 未知の項がちょうど1つでない場合や、既知の値に0以下・NaN・Infinityが
 * 含まれる場合はnull。
 */
export function solveProportion(input: ProportionInput): number | null {
  const { a, b, c, d } = input;
  const entries = [a, b, c, d];
  if (entries.filter((v) => v === null).length !== 1) return null;

  const known = entries.filter((v): v is number => v !== null);
  if (known.some((v) => !isFinite(v) || !(v > 0))) return null;

  const result =
    a === null
      ? (b! * c!) / d!
      : b === null
        ? (a! * d!) / c!
        : c === null
          ? (a! * d!) / b!
          : (b! * c!) / a!;
  return isFinite(result) ? result : null;
}

export type PercentageMode =
  'partToPercent' | 'percentToPart' | 'partToWhole' | 'changeRate';

export interface PercentageInput {
  mode: PercentageMode;
  /** partToPercent: 部分の値 / percentToPart: 全体の値 / partToWhole: 部分の値 / changeRate: 元の値 */
  value1: number;
  /** partToPercent: 全体の値 / percentToPart: 割合(%) / partToWhole: 割合(%) / changeRate: 新しい値 */
  value2: number;
}

/**
 * 割合(%)に関する4種類の計算を行う。
 * - partToPercent: 部分の値・全体の値 → 割合(%)
 * - percentToPart: 全体の値・割合(%) → 部分の値
 * - partToWhole:   部分の値・割合(%) → 全体の値
 * - changeRate:    元の値・新しい値 → 増減率(%)
 * 入力がNaN・Infinity、または各モードで無効な値（負数・0での除算等）の場合はnull。
 */
export function calculatePercentage(input: PercentageInput): number | null {
  const { mode, value1, value2 } = input;
  if (!isFinite(value1) || !isFinite(value2)) return null;

  let result: number;
  switch (mode) {
    case 'partToPercent':
      if (!(value1 >= 0) || !(value2 > 0)) return null;
      result = (value1 / value2) * 100;
      break;
    case 'percentToPart':
      if (!(value1 >= 0) || !(value2 >= 0)) return null;
      result = (value1 * value2) / 100;
      break;
    case 'partToWhole':
      if (!(value1 >= 0) || !(value2 > 0)) return null;
      result = (value1 / value2) * 100;
      break;
    case 'changeRate':
      if (value1 === 0) return null;
      result = ((value2 - value1) / value1) * 100;
      break;
  }
  return isFinite(result) ? result : null;
}
