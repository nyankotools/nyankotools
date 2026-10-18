export type VerticalLayout = 'chars' | 'columns';

export interface VerticalOptions {
  /** 句読点・長音・括弧などを縦書き用の字形（Vertical Forms）に置き換える */
  glyphs: boolean;
  /** 半角の英数字・記号を全角にする */
  fullWidth: boolean;
  /** chars: 1文字1行 / columns: 行を右から左へ並べた縦組みの表 */
  layout: VerticalLayout;
  /** columns のとき1列に入れる最大文字数。0 以下は折り返さない */
  maxPerColumn: number;
}

export const DEFAULT_VERTICAL_OPTIONS: VerticalOptions = {
  glyphs: true,
  fullWidth: true,
  layout: 'chars',
  maxPerColumn: 0,
};

/** 縦書き用字形への置換表 */
export const VERTICAL_GLYPH_MAP: Readonly<Record<string, string>> = {
  '，': '︐',
  '、': '︑',
  '。': '︒',
  '：': '︓',
  '；': '︔',
  '！': '︕',
  '？': '︖',
  '…': '︙',
  '‥': '︰',
  '—': '︱',
  '―': '︱',
  ー: '︱',
  '－': '︱',
  '（': '︵',
  '）': '︶',
  '｛': '︷',
  '｝': '︸',
  '〔': '︹',
  '〕': '︺',
  '【': '︻',
  '】': '︼',
  '《': '︽',
  '》': '︾',
  '〈': '︿',
  '〉': '﹀',
  '「': '﹁',
  '」': '﹂',
  '『': '﹃',
  '』': '﹄',
  '［': '﹇',
  '］': '﹈',
};

const IDEOGRAPHIC_SPACE = '　';

/** 半角の ASCII 印字可能文字と空白を全角にする。 */
export function toFullWidth(text: string): string {
  let out = '';
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code === 0x20) out += IDEOGRAPHIC_SPACE;
    else if (code >= 0x21 && code <= 0x7e)
      out += String.fromCodePoint(code + 0xfee0);
    else out += ch;
  }
  return out;
}

/** 句読点・長音・括弧を縦書き用字形に置き換える。 */
export function toVerticalGlyphs(text: string): string {
  let out = '';
  for (const ch of text) out += VERTICAL_GLYPH_MAP[ch] ?? ch;
  return out;
}

function splitLines(text: string): string[] {
  return text.split(/\r\n|\r|\n/);
}

/** 1文字ずつ改行する。元の改行は空行になる。 */
export function toCharPerLine(text: string): string {
  return splitLines(text)
    .map((line) => Array.from(line).join('\n'))
    .join('\n\n');
}

/** 行を列に見立て、右から左へ並べた縦組みの表にする。 */
export function toColumns(text: string, maxPerColumn: number): string {
  const limit =
    Number.isFinite(maxPerColumn) && maxPerColumn > 0
      ? Math.floor(maxPerColumn)
      : 0;
  const columns: string[][] = [];
  for (const line of splitLines(text)) {
    const chars = Array.from(line);
    if (limit === 0 || chars.length <= limit) {
      columns.push(chars);
      continue;
    }
    for (let i = 0; i < chars.length; i += limit) {
      columns.push(chars.slice(i, i + limit));
    }
  }
  const rows = columns.reduce((max, c) => Math.max(max, c.length), 0);
  if (rows === 0) return '';
  const rightToLeft = [...columns].reverse();
  const lines: string[] = [];
  for (let r = 0; r < rows; r++) {
    lines.push(
      rightToLeft.map((c) => c[r] ?? IDEOGRAPHIC_SPACE).join(IDEOGRAPHIC_SPACE),
    );
  }
  return lines.join('\n');
}

/** 縦書き用に変換する。 */
export function convertVertical(
  input: string,
  options: Partial<VerticalOptions> = {},
): string {
  const opt = { ...DEFAULT_VERTICAL_OPTIONS, ...options };
  let text = input;
  if (opt.fullWidth) text = toFullWidth(text);
  if (opt.glyphs) text = toVerticalGlyphs(text);
  if (text === '') return '';
  return opt.layout === 'columns'
    ? toColumns(text, opt.maxPerColumn)
    : toCharPerLine(text);
}
