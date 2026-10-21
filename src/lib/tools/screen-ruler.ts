/** ISO/IEC 7810 ID-1（クレジットカード）の寸法 */
export const CARD_WIDTH_MM = 85.6;
export const CARD_HEIGHT_MM = 53.98;
export const MM_PER_INCH = 25.4;

/** 校正スライダー（カード幅のCSSピクセル数）の範囲 */
export const CARD_PX_MIN = 100;
export const CARD_PX_MAX = 800;

/** CSSの規定（1インチ=96px）に基づく既定値 */
export const DEFAULT_PX_PER_MM = 96 / MM_PER_INCH;

/** 保存値として受け付ける px/mm の範囲 */
const PX_PER_MM_MIN = CARD_PX_MIN / CARD_WIDTH_MM;
const PX_PER_MM_MAX = CARD_PX_MAX / CARD_WIDTH_MM;

/** 目盛り数の上限（極端な長さでDOMが膨らむのを防ぐ） */
export const MAX_TICKS = 4000;

export type RulerUnit = 'cm' | 'inch';

export interface RulerTick {
  /** 0 = 最も長い目盛り（cm / インチ）、数値が大きいほど短い */
  level: 0 | 1 | 2 | 3;
  /** 0端からの位置（CSSピクセル） */
  position: number;
  /** 長い目盛りに付ける数字（cm / インチ）。なければ null */
  label: number | null;
}

export function isValidPxPerMm(value: number): boolean {
  return (
    Number.isFinite(value) &&
    value >= PX_PER_MM_MIN - 1e-9 &&
    value <= PX_PER_MM_MAX + 1e-9
  );
}

/** カード幅（CSSピクセル）から px/mm を求める。範囲外・非数は null */
export function pxPerMmFromCardPx(cardPx: number): number | null {
  if (!Number.isFinite(cardPx) || cardPx <= 0) return null;
  const clamped = clampCardPx(cardPx);
  return clamped / CARD_WIDTH_MM;
}

export function cardPxFromPxPerMm(pxPerMm: number): number {
  return pxPerMm * CARD_WIDTH_MM;
}

export function clampCardPx(cardPx: number): number {
  return Math.min(CARD_PX_MAX, Math.max(CARD_PX_MIN, cardPx));
}

/** 校正結果の画素密度（CSSピクセル基準のPPI） */
export function ppiFromPxPerMm(pxPerMm: number): number {
  return pxPerMm * MM_PER_INCH;
}

/** 表示可能なピクセル数に収まる定規の長さ（mm、整数）。収まらなければ 0 */
export function rulerLengthMm(availablePx: number, pxPerMm: number): number {
  if (!Number.isFinite(availablePx) || availablePx <= 0) return 0;
  if (!Number.isFinite(pxPerMm) || pxPerMm <= 0) return 0;
  return Math.floor(availablePx / pxPerMm);
}

/**
 * 目盛りを生成する。
 * cm: 1mm刻み（5mmで中間、10mmで数字付き）。
 * inch: 1/16インチ刻み（1/8, 1/4, 1/2, 1インチで段階的に長くなる）。
 */
export function generateTicks(
  lengthMm: number,
  unit: RulerUnit,
  pxPerMm: number,
): RulerTick[] {
  if (!Number.isFinite(lengthMm) || lengthMm <= 0) return [];
  if (!Number.isFinite(pxPerMm) || pxPerMm <= 0) return [];
  const ticks: RulerTick[] = [];
  if (unit === 'cm') {
    const total = Math.min(Math.floor(lengthMm), MAX_TICKS);
    for (let mm = 0; mm <= total; mm++) {
      const level = mm % 10 === 0 ? 0 : mm % 5 === 0 ? 1 : 3;
      ticks.push({
        level,
        position: mm * pxPerMm,
        label: level === 0 ? mm / 10 : null,
      });
    }
    return ticks;
  }
  const lengthInch = lengthMm / MM_PER_INCH;
  const total = Math.min(Math.floor(lengthInch * 16 + 1e-9), MAX_TICKS);
  for (let n = 0; n <= total; n++) {
    const level = n % 16 === 0 ? 0 : n % 8 === 0 ? 1 : n % 4 === 0 ? 2 : 3;
    ticks.push({
      level,
      position: (n / 16) * MM_PER_INCH * pxPerMm,
      label: level === 0 ? n / 16 : null,
    });
  }
  return ticks;
}

/** localStorage の保存値を px/mm に解釈する。不正なら null */
export function parseCalibration(
  raw: string | null | undefined,
): number | null {
  if (raw == null || raw.trim() === '') return null;
  const value = Number(raw);
  return isValidPxPerMm(value) ? value : null;
}

export function serializeCalibration(pxPerMm: number): string {
  return String(Math.round(pxPerMm * 10000) / 10000);
}

/** 小数を指定桁で丸めて文字列にする（末尾の0は残す） */
export function formatFixed(value: number, digits: number): string {
  if (!Number.isFinite(value)) return '';
  return value.toFixed(digits);
}
