import { getInvisibleGroup } from './zero-width-char-remover';

export type WhitespaceCategory =
  | 'space'
  | 'tab'
  | 'nbsp'
  | 'wideSpace'
  | 'otherSpace'
  | 'newline'
  | 'control'
  | 'invisible';

export const whitespaceCategories: WhitespaceCategory[] = [
  'space',
  'tab',
  'nbsp',
  'wideSpace',
  'otherSpace',
  'newline',
  'control',
  'invisible',
];

export interface VisualizeOptions {
  /** 半角スペースも「·」で表示する */
  showSpaces: boolean;
}

export interface Segment {
  text: string;
  /** null のときは通常の文字（そのまま表示） */
  category: WhitespaceCategory | null;
}

export interface Finding {
  /** `U+0009` 形式。CRLF のみ `CRLF` */
  code: string;
  category: WhitespaceCategory;
  /** 表示に使った記号 */
  symbol: string;
  count: number;
}

export interface VisualizeResult {
  segments: Segment[];
  findings: Finding[];
  counts: Record<WhitespaceCategory, number>;
  total: number;
  /** 表示用に記号へ置き換えた文字列（改行記号のあとには実際の改行も残す） */
  text: string;
}

/** 通常の文字としては見づらい、その他の不可視文字（ハングルフィラーなど） */
const EXTRA_INVISIBLE = new Set([0x115f, 0x1160, 0x3164, 0xffa0, 0x2800]);

export function formatCodePoint(cp: number): string {
  return `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

function hex(cp: number): string {
  return cp.toString(16).toUpperCase().padStart(4, '0');
}

function isOtherSpace(cp: number): boolean {
  return (
    cp === 0x1680 ||
    (cp >= 0x2000 && cp <= 0x200a) ||
    cp === 0x202f ||
    cp === 0x205f
  );
}

/** 1文字を分類する。表示対象でない文字は null */
export function classifyChar(
  cp: number,
  showSpaces: boolean,
): WhitespaceCategory | null {
  if (cp === 0x20) return showSpaces ? 'space' : null;
  if (cp === 0x09) return 'tab';
  if (cp === 0x0a || cp === 0x0d || cp === 0x2028 || cp === 0x2029)
    return 'newline';
  if (cp === 0xa0) return 'nbsp';
  if (cp === 0x3000) return 'wideSpace';
  if (isOtherSpace(cp)) return 'otherSpace';
  if (cp < 0x20 || (cp >= 0x7f && cp <= 0x9f)) return 'control';
  if (getInvisibleGroup(cp) !== null || EXTRA_INVISIBLE.has(cp))
    return 'invisible';
  return null;
}

function symbolFor(cp: number, category: WhitespaceCategory): string {
  switch (category) {
    case 'space':
      return '·';
    case 'tab':
      return '→';
    case 'nbsp':
      return '°';
    case 'wideSpace':
      return '□';
    case 'otherSpace':
      return '␣';
    case 'newline':
      if (cp === 0x0d) return '␍';
      if (cp === 0x2029) return '¶';
      if (cp === 0x2028) return '⏎';
      return '↵';
    case 'control':
      if (cp < 0x20) return String.fromCodePoint(0x2400 + cp);
      if (cp === 0x7f) return '␡';
      return `⟦${hex(cp)}⟧`;
    case 'invisible':
      return `⟦${hex(cp)}⟧`;
  }
}

export function visualizeWhitespace(
  text: string,
  options: VisualizeOptions = { showSpaces: true },
): VisualizeResult {
  const segments: Segment[] = [];
  const counts = Object.fromEntries(
    whitespaceCategories.map((c) => [c, 0]),
  ) as Record<WhitespaceCategory, number>;
  const findingMap = new Map<string, Finding>();
  let total = 0;
  let plain = '';

  const flushPlain = () => {
    if (plain) segments.push({ text: plain, category: null });
    plain = '';
  };
  const mark = (
    code: string,
    category: WhitespaceCategory,
    symbol: string,
    after = '',
  ) => {
    flushPlain();
    segments.push({ text: symbol, category });
    if (after) segments.push({ text: after, category: null });
    counts[category]++;
    total++;
    const found = findingMap.get(code);
    if (found) found.count++;
    else findingMap.set(code, { code, category, symbol, count: 1 });
  };

  const chars = [...text];
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const cp = ch.codePointAt(0)!;
    const category = classifyChar(cp, options.showSpaces);
    if (category === null) {
      plain += ch;
      continue;
    }
    if (category === 'newline') {
      if (cp === 0x0d && chars[i + 1] === '\n') {
        mark('CRLF', 'newline', '␍↵', '\n');
        i++;
      } else {
        // CR 単独のときも、表示上は改行して見せる
        mark(formatCodePoint(cp), 'newline', symbolFor(cp, category), '\n');
      }
      continue;
    }
    mark(formatCodePoint(cp), category, symbolFor(cp, category));
  }
  flushPlain();

  const findings = [...findingMap.values()].sort((a, b) => {
    const ca = whitespaceCategories.indexOf(a.category);
    const cb = whitespaceCategories.indexOf(b.category);
    return ca !== cb ? ca - cb : a.code.localeCompare(b.code);
  });

  return {
    segments,
    findings,
    counts,
    total,
    text: segments.map((s) => s.text).join(''),
  };
}

/** 行末の空白（半角スペース・タブ・全角スペース・NBSP）を持つ行の番号（1始まり） */
export function findTrailingWhitespaceLines(text: string): number[] {
  const normalized = text.replaceAll('\r\n', '\n');
  const lines: string[] = [];
  let current = '';
  for (const ch of normalized) {
    const cp = ch.codePointAt(0)!;
    if (cp === 0x0a || cp === 0x0d || cp === 0x2028 || cp === 0x2029) {
      lines.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  lines.push(current);
  const result: number[] = [];
  lines.forEach((line, i) => {
    const last = line.codePointAt(line.length - 1);
    if (last === 0x20 || last === 0x09 || last === 0xa0 || last === 0x3000)
      result.push(i + 1);
  });
  return result;
}
