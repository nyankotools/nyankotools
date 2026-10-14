export type StampKind = 'round' | 'square' | 'date';
export type StampOrientation = 'horizontal' | 'vertical';
export type StampFontKey = 'serif' | 'sans';
export type StampThickness = 'thin' | 'normal' | 'thick';
export type StampDateStyle = 'dot' | 'slash' | 'kanji' | 'era';

/** 外部フォントは読み込まず、端末にあるフォントだけを使う */
export const STAMP_FONT_STACKS: Record<StampFontKey, string> = {
  serif:
    '"Hiragino Mincho ProN", "Yu Mincho", "Noto Serif JP", "MS PMincho", "Times New Roman", serif',
  sans: '"Hiragino Sans", "Yu Gothic", "Meiryo", "Noto Sans JP", system-ui, sans-serif',
};

export const MIN_STAMP_SIZE = 64;
export const MAX_STAMP_SIZE = 2000;
export const DEFAULT_STAMP_COLOR = '#d7261e';

const THICKNESS_RATIO: Record<StampThickness, number> = {
  thin: 0.025,
  normal: 0.045,
  thick: 0.07,
};

const LINE_HEIGHT = 1.12;

export function clampSize(value: number): number {
  if (!Number.isFinite(value)) return 300;
  return Math.round(Math.min(Math.max(value, MIN_STAMP_SIZE), MAX_STAMP_SIZE));
}

/** '#rgb' / '#rrggbb' を '#rrggbb' に正規化する。不正なら既定色 */
export function normalizeStampColor(value: string): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!m) return DEFAULT_STAMP_COLOR;
  let hex = m[1].toLowerCase();
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  return `#${hex}`;
}

/** 入力欄の文字を行に分ける（各行の前後の空白は除く）。空行は捨てる */
export function stampLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '');
}

function isWide(ch: string): boolean {
  const code = ch.codePointAt(0) ?? 0;
  return code >= 0x2e80 || (code >= 0x1100 && code <= 0x11ff) || code >= 0xff00;
}

/** 文字列の幅の見積もり（1em単位）。全角は1、半角は0.58 */
export function textWidthEm(text: string): number {
  let w = 0;
  for (const ch of text) w += isWide(ch) ? 1 : 0.58;
  return w;
}

/**
 * 縦書きの列に分ける。右の列から順に返す（1つ目が右端）。
 * 角印で改行なしの4文字以上は、2列（右列が先）に分ける。
 */
export function verticalColumns(lines: string[], kind: StampKind): string[][] {
  let source = lines;
  if (kind === 'square' && lines.length === 1) {
    const chars = Array.from(lines[0]);
    if (chars.length >= 4) {
      const half = Math.ceil(chars.length / 2);
      source = [chars.slice(0, half).join(''), chars.slice(half).join('')];
    }
  }
  return source.map((l) => Array.from(l));
}

export interface StampText {
  text: string;
  x: number;
  y: number;
  fontSize: number;
}

export interface StampLayout {
  size: number;
  shape:
    | { type: 'circle'; cx: number; cy: number; r: number }
    | { type: 'rect'; x: number; y: number; width: number; height: number };
  lineWidth: number;
  rules: { x1: number; y1: number; x2: number; y2: number }[];
  texts: StampText[];
}

export interface StampSpec {
  kind: StampKind;
  /** 丸印・角印は名前など。日付印は上段 */
  text: string;
  /** 日付印の下段（部署名など） */
  subText: string;
  /** 日付印の中段（整形済み） */
  dateText: string;
  orientation: StampOrientation;
  thickness: StampThickness;
  size: number;
}

interface Box {
  cx: number;
  cy: number;
  width: number;
  height: number;
}

/** 箱に収まるよう横書きの行を配置する */
function layoutHorizontal(
  lines: string[],
  box: Box,
  maxFont: number,
): StampText[] {
  if (lines.length === 0) return [];
  const widest = Math.max(...lines.map(textWidthEm));
  const fontSize = Math.max(
    1,
    Math.min(
      maxFont,
      box.width / Math.max(widest, 0.5),
      box.height / (lines.length * LINE_HEIGHT),
    ),
  );
  const lh = fontSize * LINE_HEIGHT;
  return lines.map((text, i) => ({
    text,
    x: box.cx,
    y: box.cy + (i - (lines.length - 1) / 2) * lh,
    fontSize,
  }));
}

/** 箱に収まるよう縦書きの列を配置する（1文字ずつ。列は右から左へ） */
function layoutVertical(
  columns: string[][],
  box: Box,
  maxFont: number,
): StampText[] {
  if (columns.length === 0) return [];
  const longest = Math.max(...columns.map((c) => c.length));
  const colGap = 1.1;
  const fontSize = Math.max(
    1,
    Math.min(
      maxFont,
      box.width / (columns.length * colGap),
      box.height / (longest * 1.04),
    ),
  );
  const colW = fontSize * colGap;
  const rowH = fontSize * 1.04;
  const out: StampText[] = [];
  columns.forEach((chars, ci) => {
    const x = box.cx + ((columns.length - 1) / 2 - ci) * colW;
    chars.forEach((ch, ri) => {
      out.push({
        text: ch,
        x,
        y: box.cy + (ri - (chars.length - 1) / 2) * rowH,
        fontSize,
      });
    });
  });
  return out;
}

export function computeStampLayout(spec: StampSpec): StampLayout {
  const size = clampSize(spec.size);
  const lineWidth = Math.max(1, size * THICKNESS_RATIO[spec.thickness]);
  const c = size / 2;
  const edge = lineWidth / 2 + size * 0.01;
  const lines = stampLines(spec.text);

  if (spec.kind === 'square') {
    const frame = {
      type: 'rect' as const,
      x: edge,
      y: edge,
      width: size - edge * 2,
      height: size - edge * 2,
    };
    const inner = size - (edge + lineWidth / 2 + size * 0.06) * 2;
    const box = { cx: c, cy: c, width: inner, height: inner };
    const texts =
      spec.orientation === 'vertical'
        ? layoutVertical(verticalColumns(lines, 'square'), box, size)
        : layoutHorizontal(lines, box, size);
    return { size, shape: frame, lineWidth, rules: [], texts };
  }

  const r = size / 2 - edge;
  const shape = { type: 'circle' as const, cx: c, cy: c, r };

  if (spec.kind === 'round') {
    const side = (r - lineWidth / 2) * 2 * 0.7;
    const box = { cx: c, cy: c, width: side, height: side };
    const texts =
      spec.orientation === 'vertical'
        ? layoutVertical(verticalColumns(lines, 'round'), box, size)
        : layoutHorizontal(lines, box, size);
    return { size, shape, lineWidth, rules: [], texts };
  }

  // 日付印: 上段・中段（日付）・下段を、2本の横線で区切る
  const off = r * 0.24;
  const chord = (dy: number) => 2 * Math.sqrt(Math.max(0, r * r - dy * dy));
  const ruleWidth = Math.max(1, lineWidth * 0.7);
  const rules = [-off, off].map((dy) => {
    const half = chord(dy) / 2 - lineWidth;
    return { x1: c - half, y1: c + dy, x2: c + half, y2: c + dy };
  });
  const texts: StampText[] = [];
  const upper = stampLines(spec.text).slice(0, 1);
  const lower = stampLines(spec.subText).slice(0, 1);
  const date = spec.dateText.trim();
  if (date !== '') {
    texts.push(
      ...layoutHorizontal(
        [date],
        {
          cx: c,
          cy: c,
          width: chord(off) * 0.92 - lineWidth * 2,
          height: off * 2 - ruleWidth * 2 - size * 0.02,
        },
        size,
      ),
    );
  }
  const bandTop = r * 0.62;
  const bandBox = (sign: 1 | -1): Box => {
    const mid = (off + bandTop) / 2;
    return {
      cx: c,
      cy: c + sign * mid,
      width: chord(bandTop) * 0.88,
      height: (bandTop - off) * 0.82,
    };
  };
  texts.push(...layoutHorizontal(upper, bandBox(-1), size));
  texts.push(...layoutHorizontal(lower, bandBox(1), size));
  return { size, shape, lineWidth, rules, texts };
}

/** 'YYYY-MM-DD' を検証して分解する。不正なら null */
export function parseIsoDate(
  value: string,
): { year: number; month: number; day: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return { year, month, day };
}

function eraLabel(year: number, month: number, day: number): string {
  const n = year * 10000 + month * 100 + day;
  const eras: [number, number, string][] = [
    [20190501, 2018, '令和'],
    [19890108, 1988, '平成'],
    [19261225, 1925, '昭和'],
    [19120730, 1911, '大正'],
  ];
  for (const [start, base, name] of eras) {
    if (n >= start) {
      const y = year - base;
      return `${name}${y === 1 ? '元' : y}年${month}月${day}日`;
    }
  }
  return `${year}年${month}月${day}日`;
}

/** 日付印に入れる日付の文字列。不正な日付は空文字 */
export function formatStampDate(iso: string, style: StampDateStyle): string {
  const d = parseIsoDate(iso);
  if (!d) return '';
  const mm = String(d.month).padStart(2, '0');
  const dd = String(d.day).padStart(2, '0');
  switch (style) {
    case 'dot':
      return `${d.year}.${mm}.${dd}`;
    case 'slash':
      return `${d.year}/${mm}/${dd}`;
    case 'kanji':
      return `${d.year}年${d.month}月${d.day}日`;
    case 'era':
      return eraLabel(d.year, d.month, d.day);
  }
}

/** 端末のローカル日付を 'YYYY-MM-DD' にする */
export function toLocalIsoDate(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function stampFileName(kind: StampKind): string {
  return `seal-${kind}.png`;
}

/** 何も描くものがない（文字が空）かどうか */
export function isStampEmpty(spec: StampSpec): boolean {
  if (spec.kind === 'date') {
    return (
      stampLines(spec.text).length === 0 &&
      stampLines(spec.subText).length === 0 &&
      spec.dateText.trim() === ''
    );
  }
  return stampLines(spec.text).length === 0;
}
