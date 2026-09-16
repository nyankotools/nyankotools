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
 * 2つのテキストを行単位でLCS（最長共通部分列）比較し、行ごとの差分を返す。
 * 表示は元の文字列のまま、比較のみ正規化した値で行う。
 */
export function diffLines(
  left: string,
  right: string,
  options: DiffOptions = {},
): DiffLine[] {
  const a = left.split('\n');
  const b = right.split('\n');
  const n = a.length;
  const m = b.length;
  const na = a.map((line) => normalizeLine(line, options));
  const nb = b.map((line) => normalizeLine(line, options));

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        na[i] === nb[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (na[i] === nb[j]) {
      result.push({
        type: 'equal',
        text: a[i],
        leftLine: i + 1,
        rightLine: j + 1,
      });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      result.push({
        type: 'removed',
        text: a[i],
        leftLine: i + 1,
        rightLine: null,
      });
      i++;
    } else {
      result.push({
        type: 'added',
        text: b[j],
        leftLine: null,
        rightLine: j + 1,
      });
      j++;
    }
  }
  while (i < n) {
    result.push({
      type: 'removed',
      text: a[i],
      leftLine: i + 1,
      rightLine: null,
    });
    i++;
  }
  while (j < m) {
    result.push({
      type: 'added',
      text: b[j],
      leftLine: null,
      rightLine: j + 1,
    });
    j++;
  }
  return result;
}

export function getDiffStats(lines: DiffLine[]): DiffStats {
  const stats: DiffStats = { added: 0, removed: 0, equal: 0 };
  for (const line of lines) {
    stats[line.type]++;
  }
  return stats;
}
