export type FrequencyUnit = 'char' | 'word';

export interface FrequencyOptions {
  /** 数える単位。char=文字単位（日本語向け）、word=単語単位（英語向け） */
  unit: FrequencyUnit;
  /** 大文字小文字を区別しない（小文字にそろえて数える） */
  ignoreCase: boolean;
  /** 文字単位のとき、空白・句読点・記号を数えない */
  skipSymbols: boolean;
  /** 上位N件に絞る。0以下・非有限は全件 */
  topN: number;
}

export interface FrequencyEntry {
  item: string;
  count: number;
  /** 全体に占める割合（0〜100） */
  percent: number;
}

export interface FrequencyResult {
  entries: FrequencyEntry[];
  /** 数えた要素の総数 */
  total: number;
  /** 種類数（上位N件に絞る前） */
  unique: number;
}

export const DEFAULT_OPTIONS: FrequencyOptions = {
  unit: 'word',
  ignoreCase: true,
  skipSymbols: true,
  topN: 20,
};

const SYMBOL_PATTERN = /^[\s\p{P}\p{S}\p{Cc}\p{Cf}]+$/u;
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const WORD_FALLBACK = /[\p{L}\p{N}\p{M}]+(?:['’-][\p{L}\p{N}\p{M}]+)*/gu;

function hasSegmenter(): boolean {
  return typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function';
}

/** テキストを数える単位に分割する（正規化前の生のトークン列） */
export function tokenize(
  text: string,
  unit: FrequencyUnit,
  skipSymbols: boolean,
): string[] {
  const tokens: string[] = [];
  if (unit === 'char') {
    const parts: string[] = hasSegmenter()
      ? Array.from(
          new Intl.Segmenter('ja', { granularity: 'grapheme' }).segment(text),
          (s) => s.segment,
        )
      : [...text];
    for (const ch of parts) {
      if (skipSymbols && SYMBOL_PATTERN.test(ch) && !EMOJI_PATTERN.test(ch))
        continue;
      // 改行や空白を数える場合でも、空文字だけは除く
      if (ch === '') continue;
      tokens.push(ch);
    }
    return tokens;
  }

  if (hasSegmenter()) {
    const segmenter = new Intl.Segmenter('ja', { granularity: 'word' });
    for (const s of segmenter.segment(text)) {
      if (s.isWordLike) tokens.push(s.segment);
    }
    return tokens;
  }
  return text.match(WORD_FALLBACK) ?? [];
}

export function countFrequency(
  text: string,
  options: FrequencyOptions = DEFAULT_OPTIONS,
): FrequencyResult {
  const counts = new Map<string, number>();
  let total = 0;
  for (const raw of tokenize(text, options.unit, options.skipSymbols)) {
    const token = options.ignoreCase ? raw.toLowerCase() : raw;
    counts.set(token, (counts.get(token) ?? 0) + 1);
    total++;
  }

  // Array.prototype.sort は安定ソートなので、同数のものは初出順になる
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const limit =
    Number.isFinite(options.topN) && options.topN >= 1
      ? Math.floor(options.topN)
      : sorted.length;

  return {
    entries: sorted.slice(0, limit).map(([item, count]) => ({
      item,
      count,
      percent: total === 0 ? 0 : (count / total) * 100,
    })),
    total,
    unique: sorted.length,
  };
}

function csvField(value: string): string {
  // 表計算ソフトで数式として実行されないよう、先頭の =,+,-,@ などを無効化する
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** 結果をCSV文字列にする（ヘッダ付き、改行はCRLF） */
export function toCsv(
  entries: FrequencyEntry[],
  headers: { rank: string; item: string; count: string; percent: string },
): string {
  const lines = [
    [headers.rank, headers.item, headers.count, headers.percent]
      .map(csvField)
      .join(','),
  ];
  entries.forEach((e, i) => {
    lines.push(
      [
        String(i + 1),
        csvField(e.item),
        String(e.count),
        e.percent.toFixed(2),
      ].join(','),
    );
  });
  return lines.join('\r\n');
}
