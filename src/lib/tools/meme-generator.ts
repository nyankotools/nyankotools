import type { OutputFormat } from './image-cropper';

export type MemeMeasure = (text: string, size: number) => number;

export type CaptionPlacement = 'top' | 'bottom';

/** 太字・縁取り用のシステムフォントスタック（外部フォントは読み込まない） */
export const MEME_FONT_STACK =
  'Impact, "Arial Black", "Haettenschweiler", "Hiragino Kaku Gothic ProN", "Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", system-ui, sans-serif';

export const MAX_FONT_SIZE = 2000;
export const MAX_STROKE = 100;
export const MIN_FONT_SIZE = 8;
/** 行の高さ（フォントサイズに対する倍率） */
export const LINE_HEIGHT_RATIO = 1.15;

export function clampNumber(
  value: number,
  min: number,
  max: number,
  fallback = min,
): number {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

export function buildMemeFont(size: number): string {
  const px = Math.round(clampNumber(size, 1, MAX_FONT_SIZE, 16));
  return `bold ${px}px ${MEME_FONT_STACK}`;
}

/** 改行を揃え、必要なら大文字にする。前後の空行は取り除く */
export function normalizeCaption(text: string, uppercase: boolean): string[] {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  while (lines.length > 0 && lines[0].trim() === '') lines.shift();
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.map((l) => (uppercase ? l.toUpperCase() : l));
}

const CJK =
  /[\u3000-\u303f\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/;

/** 折り返しの最小単位に分ける。英単語は空白ごと、日本語などは1文字ずつ */
function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let word = '';
  const flush = () => {
    if (word !== '') tokens.push(word);
    word = '';
  };
  for (const ch of Array.from(line)) {
    if (CJK.test(ch)) {
      flush();
      tokens.push(ch);
    } else {
      word += ch;
      if (/\s/.test(ch)) flush();
    }
  }
  flush();
  return tokens;
}

/** 1行を maxWidth に収まるよう折り返す。1語が幅を超えるときは文字単位で割る */
export function wrapLine(
  line: string,
  maxWidth: number,
  size: number,
  measure: MemeMeasure,
): string[] {
  if (line.trim() === '') return [''];
  const out: string[] = [];
  let current = '';
  const push = () => {
    const trimmed = current.replace(/\s+$/, '');
    if (trimmed !== '') out.push(trimmed);
    current = '';
  };
  for (const token of tokenize(line)) {
    if (current === '' && token.trim() === '') continue;
    if (measure((current + token).trimEnd(), size) <= maxWidth) {
      current += token;
      continue;
    }
    push();
    if (measure(token.trimEnd(), size) <= maxWidth) {
      current = token;
      continue;
    }
    // 1語だけで幅を超える場合は文字ごとに割る
    for (const ch of Array.from(token)) {
      if (current !== '' && measure(current + ch, size) > maxWidth) push();
      current += ch;
    }
  }
  push();
  return out.length > 0 ? out : [''];
}

export function wrapCaption(
  lines: string[],
  maxWidth: number,
  size: number,
  measure: MemeMeasure,
): string[] {
  return lines.flatMap((l) => wrapLine(l, maxWidth, size, measure));
}

export interface CaptionLayout {
  size: number;
  lines: string[];
  lineHeight: number;
  /** 文字ブロック全体の高さ */
  height: number;
  /** 最小サイズまで縮めても収まらなかった */
  overflow: boolean;
}

export interface LayoutOptions {
  maxWidth: number;
  maxHeight: number;
  baseSize: number;
  /** false のときは baseSize のまま折り返すだけ */
  autoShrink: boolean;
  minSize?: number;
}

/**
 * 幅で折り返し、ブロックの高さが maxHeight に収まる最大のフォントサイズを探す。
 * 空のキャプションは行なしで返す。
 */
export function layoutCaption(
  lines: string[],
  options: LayoutOptions,
  measure: MemeMeasure,
): CaptionLayout {
  const base = Math.round(clampNumber(options.baseSize, 1, MAX_FONT_SIZE, 16));
  const empty: CaptionLayout = {
    size: base,
    lines: [],
    lineHeight: Math.round(base * LINE_HEIGHT_RATIO),
    height: 0,
    overflow: false,
  };
  if (lines.every((l) => l.trim() === '')) return empty;
  const maxWidth = Math.max(1, options.maxWidth);
  const min = Math.min(
    base,
    Math.max(1, Math.round(options.minSize ?? MIN_FONT_SIZE)),
  );

  const build = (size: number): CaptionLayout => {
    const wrapped = wrapCaption(lines, maxWidth, size, measure);
    const lineHeight = Math.round(size * LINE_HEIGHT_RATIO);
    const fits =
      wrapped.length * lineHeight <= options.maxHeight &&
      wrapped.every((l) => measure(l, size) <= maxWidth);
    return {
      size,
      lines: wrapped,
      lineHeight,
      height: wrapped.length * lineHeight,
      overflow: !fits,
    };
  };

  if (!options.autoShrink) return build(base);
  // 収まる最大サイズを二分探索する（小さいほど収まりやすい前提）
  let lo = min;
  let hi = base;
  let best = build(min);
  if (best.overflow) return best;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const candidate = build(mid);
    if (!candidate.overflow) {
      best = candidate;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return best;
}

/** ブロックの上端のy座標 */
export function blockTop(
  placement: CaptionPlacement,
  imageHeight: number,
  blockHeight: number,
  margin: number,
): number {
  const m = Math.max(0, margin);
  return Math.round(
    placement === 'top' ? m : Math.max(0, imageHeight - blockHeight - m),
  );
}

/** 画像の高さに合わせた文字サイズの初期値 */
export function defaultFontSize(width: number, height: number): number {
  const byHeight = height / 8;
  const byWidth = width / 8;
  return Math.max(16, Math.round(Math.min(byHeight, byWidth)));
}

/** 文字サイズに合わせた縁取りの太さの初期値 */
export function defaultStroke(size: number): number {
  return Math.max(1, Math.round(size / 8));
}

export function memeFileName(
  sourceName: string | null,
  format: OutputFormat,
): string {
  const base = (sourceName ?? '').replace(/\.[^./\\]*$/, '').trim();
  return `${base || 'image'}-meme.${format === 'jpeg' ? 'jpg' : format}`;
}
