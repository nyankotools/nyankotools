export type SortOrder =
  'none' | 'asc' | 'desc' | 'numericAsc' | 'numericDesc' | 'shuffle';

export interface TextListOptions {
  /** 各行の前後の空白を削除する */
  trimLines: boolean;
  /** 空行を削除する */
  removeEmptyLines: boolean;
  /** 重複する行を削除する（先に出現した行を残す） */
  dedupe: boolean;
  /** 重複判定・ソート時に大文字・小文字を区別しない */
  caseInsensitive: boolean;
  sortOrder: SortOrder;
}

export function splitIntoLines(text: string): string[] {
  if (text === '') return [];
  return text.split(/\r\n|\r|\n/);
}

function dedupeLines(lines: string[], caseInsensitive: boolean): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of lines) {
    const key = caseInsensitive ? line.toLowerCase() : line;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(line);
  }
  return result;
}

function compareText(a: string, b: string, caseInsensitive: boolean): number {
  const keyA = caseInsensitive ? a.toLowerCase() : a;
  const keyB = caseInsensitive ? b.toLowerCase() : b;
  return keyA.localeCompare(keyB, 'ja');
}

/** 行内で最初に見つかった数値（先頭の符号・小数点を含む）を数値ソートのキーとして使う */
function numericValue(line: string): number {
  const match = line.match(/-?\d+(\.\d+)?/);
  return match ? Number.parseFloat(match[0]) : Number.NaN;
}

function sortLines(
  lines: string[],
  order: SortOrder,
  caseInsensitive: boolean,
  random: () => number,
): string[] {
  switch (order) {
    case 'none':
      return lines;
    case 'asc':
      return [...lines].sort((a, b) => compareText(a, b, caseInsensitive));
    case 'desc':
      return [...lines].sort((a, b) => compareText(b, a, caseInsensitive));
    case 'numericAsc':
    case 'numericDesc': {
      const withValue = lines.map((line, index) => ({
        line,
        index,
        value: numericValue(line),
      }));
      withValue.sort((a, b) => {
        // 数値を含まない行はソート順の末尾にまとめ、元の順序を保つ
        if (Number.isNaN(a.value) && Number.isNaN(b.value))
          return a.index - b.index;
        if (Number.isNaN(a.value)) return 1;
        if (Number.isNaN(b.value)) return -1;
        return order === 'numericAsc' ? a.value - b.value : b.value - a.value;
      });
      return withValue.map((item) => item.line);
    }
    case 'shuffle': {
      const result = [...lines];
      for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
      }
      return result;
    }
  }
}

/**
 * テキストを行単位で処理する（前後の空白削除・空行削除・重複削除・ソート/シャッフル）。
 * `random` はシャッフルの乱数源で、テストで決定的な結果を得るために差し替え可能にしている。
 */
export function processTextList(
  text: string,
  options: TextListOptions,
  random: () => number = Math.random,
): string[] {
  let lines = splitIntoLines(text);
  if (options.trimLines) lines = lines.map((line) => line.trim());
  if (options.removeEmptyLines) lines = lines.filter((line) => line !== '');
  if (options.dedupe) lines = dedupeLines(lines, options.caseInsensitive);
  return sortLines(lines, options.sortOrder, options.caseInsensitive, random);
}
