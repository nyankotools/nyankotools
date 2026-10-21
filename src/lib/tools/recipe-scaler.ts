/**
 * レシピ人数換算のロジック。
 * 材料リスト中の数量（整数・小数・分数・帯分数・全角数字・範囲）を、
 * 元の人数→目標人数の比で拡大・縮小する。単位や数値のない行はそのまま残す。
 */

export type RoundingMode = 'fraction' | 'decimal' | 'integer';

export interface ScaleOptions {
  /** 元の人数（0より大きい値） */
  fromServings: number;
  /** 目標の人数（0より大きい値） */
  toServings: number;
  /** 丸め方。既定は 'fraction' */
  rounding?: RoundingMode;
  /** 帯分数の整数部と分数部をつなぐ文字列。既定は半角スペース（日本語なら 'と' など） */
  mixedJoin?: string;
}

export interface ScaledLine {
  original: string;
  scaled: string;
  /** この行で換算した数値の個数（0なら行はそのまま） */
  scaledCount: number;
}

export interface ScaleResult {
  factor: number;
  lines: ScaledLine[];
  text: string;
  /** 換算した数値の総数 */
  scaledCount: number;
}

const VULGAR: Record<string, number> = {
  '½': 1 / 2,
  '⅓': 1 / 3,
  '⅔': 2 / 3,
  '¼': 1 / 4,
  '¾': 3 / 4,
  '⅛': 1 / 8,
  '⅜': 3 / 8,
  '⅝': 5 / 8,
  '⅞': 7 / 8,
};

const VULGAR_CLASS = '[½⅓⅔¼¾⅛⅜⅝⅞]';

const NUM_SOURCE = [
  // 帯分数（1と1/2、1 1/2、1と½、1½）
  `\\d+(?:\\s*と\\s*|\\s+)(?:\\d+/\\d+|${VULGAR_CLASS})`,
  `\\d+${VULGAR_CLASS}`,
  // 分数
  `\\d+/\\d+`,
  VULGAR_CLASS,
  // 3桁区切り（1,000 / 1,234.5）
  `\\d{1,3}(?:,\\d{3})+(?:\\.\\d+)?`,
  // 整数・小数
  `\\d+(?:\\.\\d+)?`,
].join('|');

const RANGE_SEP = '[〜~～–−-]';

const TOKEN_RE = new RegExp(
  `(${NUM_SOURCE})(?:(\\s*${RANGE_SEP}\\s*)(${NUM_SOURCE}))?`,
  'g',
);

/** 時間・温度・長さなど、人数に比例しない数値に付く単位 */
const SKIP_AFTER_RE =
  /^\s*(?:℃|°|度|分|秒|時間|(?:min(?:ute)?s?|hours?|hrs?|secs?|seconds?|cm|mm)(?![A-Za-z]))/i;

/** 人数の表記（換算ではなく目標人数に置き換える） */
const SERVINGS_AFTER_RE =
  /^\s*(?:人分|人前|servings?(?![A-Za-z])|people(?![A-Za-z])|persons?(?![A-Za-z]))/i;
const SERVINGS_BEFORE_RE = /(?:serves)\s*:?\s*$/i;

/** 全角数字・全角小数点・全角スラッシュを半角にする（文字数は変えない） */
function normalizeWidth(text: string): string {
  return text.replace(/[０-９．／]/g, (ch) => {
    if (ch === '．') return '.';
    if (ch === '／') return '/';
    return String.fromCharCode(ch.charCodeAt(0) - 0xfee0);
  });
}

/** 1つの数量表記を数値にする。解釈できなければ null */
export function parseQuantity(token: string): number | null {
  const s = token.trim();
  const vulgarMatch = s.match(
    new RegExp(`^(?:(\\d+)\\s*(?:と)?\\s*)?(${VULGAR_CLASS})$`),
  );
  if (vulgarMatch) {
    const whole = vulgarMatch[1] ? Number(vulgarMatch[1]) : 0;
    return whole + VULGAR[vulgarMatch[2]];
  }
  const mixed = s.match(/^(\d+)(?:\s*と\s*|\s+)(\d+)\/(\d+)$/);
  if (mixed) {
    const d = Number(mixed[3]);
    if (d === 0) return null;
    return Number(mixed[1]) + Number(mixed[2]) / d;
  }
  const frac = s.match(/^(\d+)\/(\d+)$/);
  if (frac) {
    const d = Number(frac[2]);
    if (d === 0) return null;
    return Number(frac[1]) / d;
  }
  if (/^\d{1,3}(?:,\d{3})+(?:\.\d+)?$|^\d+(?:\.\d+)?$/.test(s)) {
    return Number(s.replace(/,/g, ''));
  }
  return null;
}

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return a;
}

function tidy(v: number, digits: number): string {
  const s = Number(v.toFixed(digits)).toString();
  if (s === '0' && v > 0) return Number(v.toPrecision(1)).toString();
  return s;
}

/** 数値を指定の丸め方で文字列にする */
export function formatQuantity(
  value: number,
  mode: RoundingMode,
  mixedJoin = ' ',
): string {
  if (!Number.isFinite(value) || value <= 0) return '0';

  if (mode === 'integer') {
    const r = Math.round(value);
    return r === 0 ? tidy(value, 1) : String(r);
  }

  if (mode === 'decimal') {
    if (value >= 100) return String(Math.round(value));
    return tidy(value, value >= 1 ? 1 : 2);
  }

  // fraction
  if (value >= 10) return String(Math.round(value));
  if (value < 1 / 16) return tidy(value, 2);

  let n = 0;
  let d = 0;
  for (const den of [1, 2, 4, 3, 8]) {
    const k = Math.round(value * den);
    if (Math.abs(value - k / den) <= 0.04) {
      n = k;
      d = den;
      break;
    }
  }
  if (d === 0) {
    n = Math.round(value * 8);
    d = 8;
  }
  const whole = Math.floor(n / d);
  let rest = n % d;
  let den = d;
  if (rest === 0) return String(whole);
  const g = gcd(rest, den);
  rest /= g;
  den /= g;
  return whole === 0 ? `${rest}/${den}` : `${whole}${mixedJoin}${rest}/${den}`;
}

/** 目標人数の倍率。人数が不正なら null */
export function scaleFactor(from: number, to: number): number | null {
  if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
  if (from <= 0 || to <= 0) return null;
  return to / from;
}

function scaleLine(
  line: string,
  factor: number,
  toServings: number,
  mode: RoundingMode,
  mixedJoin: string,
): ScaledLine {
  // 「1. 玉ねぎを切る」のような行頭の番号は数量ではない
  const norm = normalizeWidth(line);
  const lead = norm.match(/^\s*(?:[-*・•]\s*)?\d+[.)、）](?!\d)\s*/);
  const start = lead ? lead[0].length : 0;
  const re = new RegExp(TOKEN_RE.source, 'g');
  re.lastIndex = start;

  let out = line.slice(0, start);
  let last = start;
  let count = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(norm)) !== null) {
    const index = m.index;
    const end = index + m[0].length;
    const prev = index > 0 ? norm[index - 1] : '';
    if (/[A-Za-z#/\d.,]/.test(prev)) continue;

    const a = parseQuantity(m[1]);
    const b = m[3] !== undefined ? parseQuantity(m[3]) : null;
    if (a === null || (m[3] !== undefined && b === null)) continue;

    const after = norm.slice(end);
    if (SKIP_AFTER_RE.test(after)) continue;

    let replaced: string;
    if (
      m[3] === undefined &&
      (SERVINGS_AFTER_RE.test(after) ||
        SERVINGS_BEFORE_RE.test(norm.slice(0, index)))
    ) {
      replaced = String(toServings);
    } else {
      replaced = formatQuantity(a * factor, mode, mixedJoin);
      if (m[3] !== undefined && b !== null) {
        replaced += `${m[2]}${formatQuantity(b * factor, mode, mixedJoin)}`;
      }
    }

    out += line.slice(last, index) + replaced;
    last = end;
    count++;
  }
  out += line.slice(last);
  return { original: line, scaled: out, scaledCount: count };
}

/**
 * 材料リストを換算する。人数が不正（0以下・非有限）なら null。
 * 倍率が1のときは文面を変更しない。
 */
export function scaleRecipe(
  text: string,
  options: ScaleOptions,
): ScaleResult | null {
  const factor = scaleFactor(options.fromServings, options.toServings);
  if (factor === null) return null;
  const mode = options.rounding ?? 'fraction';
  const join = options.mixedJoin ?? ' ';

  const lines: ScaledLine[] = text.split(/\r\n|\r|\n/).map((line) => {
    if (factor === 1 || line.trim() === '') {
      return { original: line, scaled: line, scaledCount: 0 };
    }
    return scaleLine(line, factor, options.toServings, mode, join);
  });

  return {
    factor,
    lines,
    text: lines.map((l) => l.scaled).join('\n'),
    scaledCount: lines.reduce((sum, l) => sum + l.scaledCount, 0),
  };
}
