export type ClampUnit = 'rem' | 'px';

export interface ClampInput {
  /** 最小フォントサイズ（px） */
  minSize: number;
  /** 最大フォントサイズ（px） */
  maxSize: number;
  /** 最小サイズになる画面幅（px） */
  minViewport: number;
  /** 最大サイズになる画面幅（px） */
  maxViewport: number;
  /** remの基準（px） */
  baseFontSize: number;
  unit: ClampUnit;
}

export interface ClampResult {
  /** clamp(...) 全体 */
  clamp: string;
  /** 中央の推奨値（例: 0.5rem + 2vw） */
  preferred: string;
  /** 傾き（vw単位、画面幅1vwあたりの増加量） */
  slopeVw: number;
  /** 切片（px） */
  interceptPx: number;
}

export type ClampError =
  'invalidSize' | 'invalidViewport' | 'invalidRange' | 'invalidBase';

const NUMBER_PATTERN = /^[+-]?(\d+\.?\d*|\.\d+)$/;

/** 数値文字列をパースする。空・不正はnull */
export function parseNumber(input: string): number | null {
  const trimmed = input.trim();
  if (!NUMBER_PATTERN.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

/** 小数第4位で丸め、末尾の0と-0を除いて文字列化する */
export function formatNumber(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function withUnit(px: number, unit: ClampUnit, base: number): string {
  if (unit === 'rem') return `${formatNumber(px / base)}rem`;
  return `${formatNumber(px)}px`;
}

export function validateClampInput(input: ClampInput): ClampError | null {
  const { minSize, maxSize, minViewport, maxViewport, baseFontSize } = input;
  if (!(minSize >= 0) || !(maxSize >= 0)) return 'invalidSize';
  if (!(minViewport >= 0) || !(maxViewport >= 0)) return 'invalidViewport';
  if (minViewport >= maxViewport) return 'invalidRange';
  if (!(baseFontSize > 0)) return 'invalidBase';
  return null;
}

/** 入力が不正な場合はエラーコードを返す */
export function calculateClamp(input: ClampInput): ClampResult | ClampError {
  const error = validateClampInput(input);
  if (error) return error;
  const { minSize, maxSize, minViewport, maxViewport, baseFontSize, unit } =
    input;

  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const interceptPx = minSize - slope * minViewport;
  const slopeVw = slope * 100;

  const slopeText = `${formatNumber(Math.abs(slopeVw))}vw`;
  const interceptText = withUnit(Math.abs(interceptPx), unit, baseFontSize);
  const slopeIsZero = formatNumber(slopeVw) === '0';
  const interceptIsZero = formatNumber(interceptPx) === '0';

  let preferred: string;
  if (slopeIsZero) {
    preferred = withUnit(interceptPx, unit, baseFontSize);
  } else if (interceptIsZero) {
    preferred = `${slopeVw < 0 ? '-' : ''}${slopeText}`;
  } else {
    const head = `${interceptPx < 0 ? '-' : ''}${interceptText}`;
    preferred = `${head} ${slopeVw < 0 ? '-' : '+'} ${slopeText}`;
  }

  // clamp()の第1引数は小さい方にする（縮小していくケースも許容）
  const low = Math.min(minSize, maxSize);
  const high = Math.max(minSize, maxSize);
  const clamp = `clamp(${withUnit(low, unit, baseFontSize)}, ${preferred}, ${withUnit(high, unit, baseFontSize)})`;

  return { clamp, preferred, slopeVw, interceptPx };
}

/** 指定した画面幅（px）での実際のサイズ（px）を返す */
export function sizeAtViewport(
  input: Pick<
    ClampInput,
    'minSize' | 'maxSize' | 'minViewport' | 'maxViewport'
  >,
  viewport: number,
): number {
  const { minSize, maxSize, minViewport, maxViewport } = input;
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const value = minSize + slope * (viewport - minViewport);
  const low = Math.min(minSize, maxSize);
  const high = Math.max(minSize, maxSize);
  return Math.min(high, Math.max(low, value));
}
