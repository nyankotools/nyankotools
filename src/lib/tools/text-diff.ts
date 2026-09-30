export type DiffLineType = 'equal' | 'added' | 'removed';

export interface DiffLine {
  type: DiffLineType;
  text: string;
  leftLine: number | null;
  rightLine: number | null;
}

export interface DiffOptions {
  ignoreWhitespace?: boolean;
  ignoreCase?: boolean;
}

export interface DiffStats {
  added: number;
  removed: number;
  equal: number;
}

function normalizeLine(line: string, options: DiffOptions): string {
  let normalized = line;
  if (options.ignoreWhitespace) {
    normalized = normalized.trim().replace(/\s+/g, ' ');
  }
  if (options.ignoreCase) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
}

/**
 * 行列（正規化済み）のLCS表を作り、行ごとの差分を返す。
 * 行番号は、前後を切り落とした分（offsetA / offsetB）を足して元の番号に直す。
 */
function lcsDiff(
  a: string[],
  b: string[],
  na: string[],
  nb: string[],
  offsetA: number,
  offsetB: number,
): DiffLine[] {
  const n = a.length;
  const m = b.length;
  const width = m + 1;
  // 巨大な入力でも配列の配列を作らず、1本の型付き配列で持つ
  const dp = new Int32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * width + j] =
        na[i] === nb[j]
          ? dp[(i + 1) * width + j + 1] + 1
          : Math.max(dp[(i + 1) * width + j], dp[i * width + j + 1]);
    }
  }

  const removed = (i: number): DiffLine => ({
    type: 'removed',
    text: a[i],
    leftLine: i + 1 + offsetA,
    rightLine: null,
  });
  const added = (j: number): DiffLine => ({
    type: 'added',
    text: b[j],
    leftLine: null,
    rightLine: j + 1 + offsetB,
  });

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (na[i] === nb[j]) {
      result.push({
        type: 'equal',
        text: a[i],
        leftLine: i + 1 + offsetA,
        rightLine: j + 1 + offsetB,
      });
      i++;
      j++;
    } else if (dp[(i + 1) * width + j] >= dp[i * width + j + 1]) {
      result.push(removed(i++));
    } else {
      result.push(added(j++));
    }
  }
  while (i < n) result.push(removed(i++));
  while (j < m) result.push(added(j++));
  return result;
}

/**
 * 2つのテキストを行単位でLCS（最長共通部分列）比較し、行ごとの差分を返す。
 * 表示は元の文字列のまま、比較のみ正規化した値で行う。
 * 先頭・末尾で一致する行はLCS表に載せず切り落とす（ほぼ同じ長文の比較でメモリと時間を節約）。
 */
export function diffLines(
  left: string,
  right: string,
  options: DiffOptions = {},
): DiffLine[] {
  const a = left.split('\n');
  const b = right.split('\n');
  const na = a.map((line) => normalizeLine(line, options));
  const nb = b.map((line) => normalizeLine(line, options));

  let head = 0;
  while (head < a.length && head < b.length && na[head] === nb[head]) head++;
  let tail = 0;
  while (
    tail < a.length - head &&
    tail < b.length - head &&
    na[a.length - 1 - tail] === nb[b.length - 1 - tail]
  ) {
    tail++;
  }

  const equal = (i: number, j: number): DiffLine => ({
    type: 'equal',
    text: a[i],
    leftLine: i + 1,
    rightLine: j + 1,
  });
  const result: DiffLine[] = [];
  for (let k = 0; k < head; k++) result.push(equal(k, k));
  result.push(
    ...lcsDiff(
      a.slice(head, a.length - tail),
      b.slice(head, b.length - tail),
      na.slice(head, a.length - tail),
      nb.slice(head, b.length - tail),
      head,
      head,
    ),
  );
  for (let k = tail; k > 0; k--) result.push(equal(a.length - k, b.length - k));
  return result;
}

export function getDiffStats(lines: DiffLine[]): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, equal: 0 };
  for (const line of lines) {
    stats[line.type]++;
  }
  return stats;
}
