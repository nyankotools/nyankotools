/** 文字列の類似度・編集距離（レーベンシュタイン / Damerau(OSA) / Jaro-Winkler） */

export type CompareUnit = 'codepoint' | 'grapheme';

export const MAX_UNITS = 5000;

export type EditOpType = 'equal' | 'insert' | 'delete' | 'replace';

export interface EditOp {
  type: EditOpType;
  /** A側の要素（insert では null） */
  a: string | null;
  /** B側の要素（delete では null） */
  b: string | null;
}

export interface EditRun {
  type: EditOpType;
  /** A側の連続した文字列（insert では空） */
  a: string;
  /** B側の連続した文字列（delete では空） */
  b: string;
  /** この連続区間が含む要素数（ops の個数） */
  count: number;
}

export interface SimilarityOptions {
  unit?: CompareUnit;
  ignoreCase?: boolean;
  maxUnits?: number;
}

export interface SimilarityOk {
  ok: true;
  lengthA: number;
  lengthB: number;
  distance: number;
  /** 隣接転置を1操作とみなす距離（Optimal String Alignment） */
  damerauDistance: number;
  /** 0〜1。1 - 距離 / 長い方の長さ。両方空なら 1 */
  similarity: number;
  /** 0〜1 */
  jaroWinkler: number;
  insertions: number;
  deletions: number;
  substitutions: number;
  ops: EditOp[];
}

export interface SimilarityTooLong {
  ok: false;
  reason: 'too-long';
  lengthA: number;
  lengthB: number;
  maxUnits: number;
}

export type SimilarityResult = SimilarityOk | SimilarityTooLong;

/** 文字列を比較単位（コードポイント or 書記素）に分割する */
export function splitUnits(text: string, unit: CompareUnit): string[] {
  if (
    unit === 'grapheme' &&
    typeof Intl !== 'undefined' &&
    'Segmenter' in Intl
  ) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return Array.from(seg.segment(text), (s) => s.segment);
  }
  return Array.from(text);
}

function levenshteinMatrix(a: string[], b: string[]): Uint16Array {
  const w = b.length + 1;
  const m = new Uint16Array((a.length + 1) * w);
  for (let j = 0; j <= b.length; j++) m[j] = j;
  for (let i = 1; i <= a.length; i++) {
    m[i * w] = i;
    const ai = a[i - 1];
    for (let j = 1; j <= b.length; j++) {
      const cost = ai === b[j - 1] ? 0 : 1;
      const sub = m[(i - 1) * w + j - 1] + cost;
      const del = m[(i - 1) * w + j] + 1;
      const ins = m[i * w + j - 1] + 1;
      m[i * w + j] = Math.min(sub, del, ins);
    }
  }
  return m;
}

/** Optimal String Alignment 距離（隣接転置を1とする）。3行ローリング。 */
export function damerauDistance(a: string[], b: string[]): number {
  const n = a.length;
  const m = b.length;
  if (n === 0) return m;
  if (m === 0) return n;
  let prev2 = new Array<number>(m + 1).fill(0);
  let prev = Array.from({ length: m + 1 }, (_, j) => j);
  let cur = new Array<number>(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    cur[0] = i;
    for (let j = 1; j <= m; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
    }
    const tmp = prev2;
    prev2 = prev;
    prev = cur;
    cur = tmp;
  }
  return prev[m];
}

/** Jaro-Winkler 類似度（0〜1）。両方空なら 1、片方のみ空なら 0。 */
export function jaroWinkler(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  if (a.length === 0 || b.length === 0) return 0;
  const window = Math.max(0, Math.floor(Math.max(a.length, b.length) / 2) - 1);
  const aMatched = new Array<boolean>(a.length).fill(false);
  const bMatched = new Array<boolean>(b.length).fill(false);
  let matches = 0;
  for (let i = 0; i < a.length; i++) {
    const start = Math.max(0, i - window);
    const end = Math.min(b.length - 1, i + window);
    for (let j = start; j <= end; j++) {
      if (!bMatched[j] && a[i] === b[j]) {
        aMatched[i] = true;
        bMatched[j] = true;
        matches++;
        break;
      }
    }
  }
  if (matches === 0) return 0;
  let transpositions = 0;
  let k = 0;
  for (let i = 0; i < a.length; i++) {
    if (!aMatched[i]) continue;
    while (!bMatched[k]) k++;
    if (a[i] !== b[k]) transpositions++;
    k++;
  }
  const t = transpositions / 2;
  const jaro =
    (matches / a.length + matches / b.length + (matches - t) / matches) / 3;
  let prefix = 0;
  while (
    prefix < 4 &&
    prefix < a.length &&
    prefix < b.length &&
    a[prefix] === b[prefix]
  ) {
    prefix++;
  }
  return jaro + prefix * 0.1 * (1 - jaro);
}

function buildOps(a: string[], b: string[]): EditOp[] {
  // 共通の接頭辞・接尾辞を除いてから行列を作る
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const head: EditOp[] = [];
  for (let i = 0; i < start; i++)
    head.push({ type: 'equal', a: a[i], b: b[i] });
  const tail: EditOp[] = [];
  for (let i = endA, j = endB; i < a.length; i++, j++) {
    tail.push({ type: 'equal', a: a[i], b: b[j] });
  }

  const ma = a.slice(start, endA);
  const mb = b.slice(start, endB);
  const w = mb.length + 1;
  const mat = levenshteinMatrix(ma, mb);
  const mid: EditOp[] = [];
  let i = ma.length;
  let j = mb.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const same = ma[i - 1] === mb[j - 1];
      const diag = mat[(i - 1) * w + j - 1] + (same ? 0 : 1);
      if (mat[i * w + j] === diag) {
        mid.push({
          type: same ? 'equal' : 'replace',
          a: ma[i - 1],
          b: mb[j - 1],
        });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && mat[i * w + j] === mat[(i - 1) * w + j] + 1) {
      mid.push({ type: 'delete', a: ma[i - 1], b: null });
      i--;
    } else {
      mid.push({ type: 'insert', a: null, b: mb[j - 1] });
      j--;
    }
  }
  mid.reverse();
  return [...head, ...mid, ...tail];
}

export function compareStrings(
  textA: string,
  textB: string,
  options: SimilarityOptions = {},
): SimilarityResult {
  const unit = options.unit ?? 'codepoint';
  const maxUnits = options.maxUnits ?? MAX_UNITS;
  const prep = (s: string) => (options.ignoreCase ? s.toLowerCase() : s);
  // 表示用は元の文字、比較用は大小無視後の文字
  const origA = splitUnits(textA, unit);
  const origB = splitUnits(textB, unit);
  if (origA.length > maxUnits || origB.length > maxUnits) {
    return {
      ok: false,
      reason: 'too-long',
      lengthA: origA.length,
      lengthB: origB.length,
      maxUnits,
    };
  }
  const a = options.ignoreCase ? origA.map(prep) : origA;
  const b = options.ignoreCase ? origB.map(prep) : origB;

  const rawOps = buildOps(a, b);
  // 大小無視時は表示用に元の文字へ戻す
  let ia = 0;
  let ib = 0;
  const ops = rawOps.map((op): EditOp => {
    const oa = op.a === null ? null : origA[ia++];
    const ob = op.b === null ? null : origB[ib++];
    return { type: op.type, a: oa, b: ob };
  });

  let insertions = 0;
  let deletions = 0;
  let substitutions = 0;
  for (const op of ops) {
    if (op.type === 'insert') insertions++;
    else if (op.type === 'delete') deletions++;
    else if (op.type === 'replace') substitutions++;
  }
  const distance = insertions + deletions + substitutions;
  const longest = Math.max(a.length, b.length);
  return {
    ok: true,
    lengthA: a.length,
    lengthB: b.length,
    distance,
    damerauDistance: damerauDistance(a, b),
    similarity: longest === 0 ? 1 : 1 - distance / longest,
    jaroWinkler: jaroWinkler(a, b),
    insertions,
    deletions,
    substitutions,
    ops,
  };
}

/** 同じ種類が連続する操作をまとめて表示しやすくする */
export function groupOps(ops: EditOp[]): EditRun[] {
  const runs: EditRun[] = [];
  for (const op of ops) {
    const last = runs[runs.length - 1];
    if (last && last.type === op.type) {
      last.a += op.a ?? '';
      last.b += op.b ?? '';
      last.count++;
    } else {
      runs.push({
        type: op.type,
        a: op.a ?? '',
        b: op.b ?? '',
        count: 1,
      });
    }
  }
  return runs;
}
