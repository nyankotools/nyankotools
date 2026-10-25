/** 分割数の警告しきい値（これを超えるとパーツが多すぎる旨を警告する）。 */
export const WARN_PART_COUNT = 1000;

/** 分割数の上限（これを超える設定は受け付けない）。 */
export const MAX_PART_COUNT = 10000;

/** ファイルサイズの警告しきい値（メモリ不足の恐れ）。 */
export const WARN_FILE_BYTES = 1024 * 1024 * 1024;

/** 「全部ZIPでダウンロード」で扱える合計サイズの上限（メモリに全て載せるため）。 */
export const ZIP_MAX_BYTES = 100 * 1024 * 1024;

export type SizeUnit = 'KB' | 'MB';

export interface PartRange {
  /** 1始まりの連番 */
  index: number;
  /** 開始バイト（含む） */
  start: number;
  /** 終了バイト（含まない） */
  end: number;
}

export type SplitErrorCode = 'invalid-size' | 'too-many-parts' | 'empty-file';

export class FileSplitterError extends Error {
  constructor(public code: SplitErrorCode) {
    super(code);
    this.name = 'FileSplitterError';
  }
}

/** 数値と単位（KB/MB。1KB=1024バイト）をバイト数にする。不正な値は null。 */
export function toBytes(value: number, unit: SizeUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  const bytes = Math.floor(value * (unit === 'MB' ? 1024 * 1024 : 1024));
  return Number.isFinite(bytes) && bytes >= 1 ? bytes : null;
}

/** 分割数を求める。 */
export function countParts(totalBytes: number, partBytes: number): number {
  if (totalBytes <= 0 || partBytes <= 0) return 0;
  return Math.ceil(totalBytes / partBytes);
}

/** パーツの連番に必要な桁数（最低3桁）。 */
export function indexDigits(partCount: number): number {
  return Math.max(3, String(Math.max(partCount, 1)).length);
}

/** `name.001` 形式のパーツ名を作る。 */
export function partName(
  fileName: string,
  index: number,
  partCount: number,
): string {
  return `${fileName}.${String(index).padStart(indexDigits(partCount), '0')}`;
}

/** 分割範囲を計算する。最後のパーツだけ端数になる。 */
export function planSplit(totalBytes: number, partBytes: number): PartRange[] {
  if (!Number.isFinite(totalBytes) || totalBytes <= 0) {
    throw new FileSplitterError('empty-file');
  }
  if (!Number.isFinite(partBytes) || partBytes < 1) {
    throw new FileSplitterError('invalid-size');
  }
  const n = countParts(totalBytes, partBytes);
  if (n > MAX_PART_COUNT) throw new FileSplitterError('too-many-parts');
  const ranges: PartRange[] = [];
  for (let i = 0; i < n; i++) {
    const start = i * partBytes;
    ranges.push({
      index: i + 1,
      start,
      end: Math.min(start + partBytes, totalBytes),
    });
  }
  return ranges;
}

/** 分割前の警告。 */
export function splitWarnings(
  totalBytes: number,
  partBytes: number,
): ('many-parts' | 'large-file')[] {
  const warnings: ('many-parts' | 'large-file')[] = [];
  if (countParts(totalBytes, partBytes) > WARN_PART_COUNT)
    warnings.push('many-parts');
  if (totalBytes > WARN_FILE_BYTES) warnings.push('large-file');
  return warnings;
}

/** バイト数を人が読める形式にする。 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  // 丸めた結果が1024に達するときは次の単位で表示する
  const kb = (bytes / 1024).toFixed(1);
  if (Number(kb) < 1024) return `${kb} KB`;
  const mb = (bytes / 1024 / 1024).toFixed(1);
  if (Number(mb) < 1024) return `${mb} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

/** 範囲 { start, end } を持つ Blob から、その範囲だけを切り出す（全体をコピーしない）。 */
export function sliceBlob(blob: Blob, range: PartRange): Blob {
  return blob.slice(range.start, range.end);
}

export interface ParsedPartName {
  /** 連番を除いた元のファイル名 */
  base: string;
  /** 連番 */
  number: number;
}

/** `name.ext.001` のようなパーツ名を解析する。該当しなければ null。 */
export function parsePartName(fileName: string): ParsedPartName | null {
  const m = /^(.+)\.(\d{3,})$/.exec(fileName);
  if (!m) return null;
  const number = Number(m[2]);
  // 欠番検出が1〜最大値を走査するため、分割上限を超える数字（年月日など）はパーツ名とみなさない
  if (!Number.isSafeInteger(number) || number > MAX_PART_COUNT) return null;
  return { base: m[1], number };
}

export interface MergeNamed {
  name: string;
}

export type MergeIssue =
  | { type: 'not-part'; names: string[] }
  | { type: 'mixed-base'; bases: string[] }
  | { type: 'duplicate'; numbers: number[] }
  | { type: 'missing'; numbers: number[] }
  | { type: 'not-from-one'; first: number };

export interface MergePlan<T extends MergeNamed> {
  /** 連番順に並べたパーツ（解析できたもののみ） */
  ordered: T[];
  /** 復元後のファイル名（決められない場合は null） */
  outputName: string | null;
  /** 結合を止めるべき問題（空なら結合してよい） */
  issues: MergeIssue[];
}

/** 抜けている連番を返す（最小〜最大の間）。1から始まらない場合は先頭側の抜けも含める。 */
export function findMissingNumbers(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const set = new Set(numbers);
  const max = Math.max(...numbers);
  const missing: number[] = [];
  for (let n = 1; n <= max; n++) {
    if (!set.has(n)) missing.push(n);
  }
  return missing;
}

/** 結合の計画を立てる：名前から連番を読み、並べ替え、欠番・重複・別ファイルの混在を検出する。 */
export function planMerge<T extends MergeNamed>(parts: T[]): MergePlan<T> {
  const issues: MergeIssue[] = [];
  const parsed: { item: T; info: ParsedPartName }[] = [];
  const notParts: string[] = [];
  for (const item of parts) {
    const info = parsePartName(item.name);
    if (info) parsed.push({ item, info });
    else notParts.push(item.name);
  }
  if (notParts.length > 0) issues.push({ type: 'not-part', names: notParts });
  if (parsed.length === 0) {
    return { ordered: [], outputName: null, issues };
  }

  parsed.sort((a, b) => a.info.number - b.info.number);
  const bases = Array.from(new Set(parsed.map((p) => p.info.base)));
  if (bases.length > 1) issues.push({ type: 'mixed-base', bases });

  const numbers = parsed.map((p) => p.info.number);
  const duplicates = Array.from(
    new Set(numbers.filter((n, i) => numbers.indexOf(n) !== i)),
  );
  if (duplicates.length > 0)
    issues.push({ type: 'duplicate', numbers: duplicates });

  const missing = findMissingNumbers(numbers);
  if (missing.length > 0) {
    if (numbers[0] > 1 && missing.length === numbers[0] - 1) {
      issues.push({ type: 'not-from-one', first: numbers[0] });
    } else {
      issues.push({ type: 'missing', numbers: missing });
    }
  }

  return {
    ordered: parsed.map((p) => p.item),
    outputName: bases.length === 1 ? bases[0] : null,
    issues,
  };
}

/** 抜けた連番を「1, 2, 5-7」のような短い表記にする。 */
export function formatNumberList(numbers: number[], limit = 20): string {
  const sorted = Array.from(new Set(numbers)).sort((a, b) => a - b);
  const groups: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    groups.push(j > i ? `${sorted[i]}-${sorted[j]}` : String(sorted[i]));
    i = j + 1;
  }
  if (groups.length > limit) return `${groups.slice(0, limit).join(', ')}, …`;
  return groups.join(', ');
}

/** ダウンロード名として使えるよう、パスや禁止文字を取り除く。空なら fallback。 */
export function safeFileName(name: string, fallback = 'restored'): string {
  const cleaned = name
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/^\.+/, '')
    .trim();
  return cleaned || fallback;
}
