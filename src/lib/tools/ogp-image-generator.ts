export type Measure = (text: string) => number;

export interface OgpSizePreset {
  id: string;
  width: number;
  height: number;
}

export const OGP_SIZE_PRESETS: OgpSizePreset[] = [
  { id: 'ogp', width: 1200, height: 630 },
  { id: 'x', width: 1200, height: 675 },
  { id: 'square', width: 1080, height: 1080 },
];

export function findSizePreset(id: string): OgpSizePreset {
  return OGP_SIZE_PRESETS.find((p) => p.id === id) ?? OGP_SIZE_PRESETS[0];
}

// 日本語（かな・漢字・全角記号）は1文字ずつ、英単語は単語単位で改行候補にする
const TOKEN_RE = /[、-鿿＀-￯]|[^\s、-鿿＀-￯]+|\s+/g;
// 行頭に来てはいけない文字（句読点・閉じ括弧など）は直前の行に押し込む
const NO_LINE_START = '、。，．,.）」』】〕！？!?・：；ー';

function breakLongToken(
  token: string,
  maxWidth: number,
  measure: Measure,
): string[] {
  const parts: string[] = [];
  let line = '';
  for (const ch of token) {
    if (line !== '' && measure(line + ch) > maxWidth) {
      parts.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line !== '') parts.push(line);
  return parts;
}

/** `measure` で測った幅が maxWidth に収まるよう、テキストを行に分割する（\n は強制改行） */
export function wrapText(
  text: string,
  maxWidth: number,
  measure: Measure,
): string[] {
  const lines: string[] = [];
  for (const paragraph of text.replace(/\r\n?/g, '\n').split('\n')) {
    let line = '';
    for (const token of paragraph.match(TOKEN_RE) ?? []) {
      const isSpace = /^\s+$/.test(token);
      if (line === '' && isSpace) continue;
      if (measure((line + token).trimEnd()) <= maxWidth) {
        line += token;
        continue;
      }
      if (isSpace) continue;
      if (
        token.length === 1 &&
        NO_LINE_START.includes(token) &&
        line !== '' &&
        // 押し込みは1文字分のはみ出しまで（「！！！…」が際限なく同じ行に入るのを防ぐ）
        measure(line + token) <= maxWidth + measure(token)
      ) {
        line += token;
        continue;
      }
      if (line !== '') lines.push(line.trimEnd());
      if (measure(token) > maxWidth) {
        const parts = breakLongToken(token, maxWidth, measure);
        line = parts.pop() ?? '';
        lines.push(...parts);
      } else {
        line = token;
      }
    }
    lines.push(line.trimEnd());
  }
  // 末尾の空行は描画しない
  while (lines.length > 1 && lines[lines.length - 1] === '') lines.pop();
  return lines;
}

export interface TitleLayout {
  fontSize: number;
  lines: string[];
  truncated: boolean;
}

export interface TitleLayoutOptions {
  maxWidth: number;
  maxHeight: number;
  maxFontSize: number;
  minFontSize: number;
  lineHeight: number;
  /** 指定サイズでのテキスト幅を返す */
  measureAt: (text: string, fontSize: number) => number;
}

function truncateLine(line: string, maxWidth: number, measure: Measure) {
  let result = line;
  while (result !== '' && measure(result + '…') > maxWidth) {
    result = result.slice(0, -1);
  }
  return result + '…';
}

/**
 * 枠（maxWidth × maxHeight）に収まる最大のフォントサイズを探し、行分割して返す。
 * 最小サイズでも収まらない場合は、入り切る行数で切って末尾に「…」を付ける。
 */
export function layoutTitle(
  text: string,
  options: TitleLayoutOptions,
): TitleLayout {
  const { maxWidth, maxHeight, maxFontSize, minFontSize, lineHeight } = options;
  const wrapAt = (size: number) =>
    wrapText(text, maxWidth, (s) => options.measureAt(s, size));

  for (
    let size = maxFontSize;
    size >= minFontSize;
    size = size === minFontSize ? 0 : Math.max(minFontSize, size - 4)
  ) {
    const lines = wrapAt(size);
    if (lines.length * size * lineHeight <= maxHeight) {
      return { fontSize: size, lines, truncated: false };
    }
  }

  const size = minFontSize;
  const lines = wrapAt(size);
  const capacity = Math.max(1, Math.floor(maxHeight / (size * lineHeight)));
  const kept = lines.slice(0, capacity);
  kept[kept.length - 1] = truncateLine(kept[kept.length - 1], maxWidth, (s) =>
    options.measureAt(s, size),
  );
  return { fontSize: size, lines: kept, truncated: true };
}

/** ダウンロード用のファイル名 */
export function ogpFileName(preset: OgpSizePreset): string {
  return `ogp-${preset.width}x${preset.height}.png`;
}
