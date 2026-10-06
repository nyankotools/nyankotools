import { unzipSync, zipSync, type Zippable } from 'fflate';

/** 入力（作成時は合計、解凍時はZIPファイルと展開後の合計）の上限。メモリに全て載せるため。 */
export const MAX_TOTAL_BYTES = 100 * 1024 * 1024;

/** ZIP内のエントリ数の上限。 */
export const MAX_ENTRIES = 5000;

export type ZipLevel = 0 | 1 | 6 | 9;

export interface ZipInputFile {
  name: string;
  data: Uint8Array;
}

export interface ZipEntry {
  /** ZIP内のパス（フォルダは末尾が `/`） */
  name: string;
  /** 展開後のサイズ（バイト） */
  size: number;
  /** 圧縮後のサイズ（バイト） */
  compressedSize: number;
  isDirectory: boolean;
}

export type ZipErrorCode =
  'too-large' | 'too-many-entries' | 'invalid-zip' | 'unsupported';

export class ZipToolError extends Error {
  constructor(public code: ZipErrorCode) {
    super(code);
    this.name = 'ZipToolError';
  }
}

/** バイト数を人が読める形式（B / KB / MB）にする。 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * ZIP内に入れるパスを安全な形にする。
 * 区切りを `/` に揃え、先頭の `/`・ドライブ名・`.`/`..` の区間（パストラバーサル）を取り除く。
 */
export function sanitizeEntryName(name: string): string {
  const parts = name
    .replace(/\\/g, '/')
    .replace(/^[a-zA-Z]:/, '')
    .split('/')
    .filter((p) => p !== '' && p !== '.' && p !== '..');
  return parts.join('/');
}

/** 保存用のファイル名（パスの最後の区間）。空になる場合は fallback を返す。 */
export function baseName(path: string, fallback = 'file'): string {
  const parts = sanitizeEntryName(path).split('/');
  const last = parts[parts.length - 1];
  return last === '' || last === undefined ? fallback : last;
}

/** 同名のファイルがあれば `name (2).ext` のように連番を付けて重複を避ける。 */
export function uniqueNames(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((raw) => {
    const name = sanitizeEntryName(raw) || 'file';
    let candidate = name;
    if (used.has(candidate.toLowerCase())) {
      const dot = name.lastIndexOf('.');
      const hasExt = dot > name.lastIndexOf('/') + 1;
      const stem = hasExt ? name.slice(0, dot) : name;
      const ext = hasExt ? name.slice(dot) : '';
      let n = 2;
      while (used.has(`${stem} (${n})${ext}`.toLowerCase())) n++;
      candidate = `${stem} (${n})${ext}`;
    }
    used.add(candidate.toLowerCase());
    return candidate;
  });
}

/** ZIPのダウンロード名を決める（拡張子 .zip を保証する）。 */
export function zipFileName(input: string): string {
  const base = input
    .trim()
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\.zip$/i, '')
    .trim();
  return `${base || 'archive'}.zip`;
}

/** ファイルをZIPにまとめる。level 0 は無圧縮（格納のみ）。 */
export function createZip(
  files: ZipInputFile[],
  level: ZipLevel = 6,
  now: Date = new Date(),
): Uint8Array {
  if (files.length > MAX_ENTRIES) throw new ZipToolError('too-many-entries');
  const total = files.reduce((sum, f) => sum + f.data.length, 0);
  if (total > MAX_TOTAL_BYTES) throw new ZipToolError('too-large');

  const names = uniqueNames(files.map((f) => f.name));
  const zippable: Zippable = {};
  files.forEach((file, index) => {
    zippable[names[index]] = [file.data, { level, mtime: now }];
  });
  return zipSync(zippable);
}

/** ZIPの中身の一覧を返す（ファイルは展開しない）。 */
export function listZip(data: Uint8Array): ZipEntry[] {
  if (data.length > MAX_TOTAL_BYTES) throw new ZipToolError('too-large');
  const entries: ZipEntry[] = [];
  try {
    unzipSync(data, {
      filter(file) {
        entries.push({
          name: file.name,
          size: file.originalSize,
          compressedSize: file.size,
          isDirectory: file.name.endsWith('/'),
        });
        return false;
      },
    });
  } catch (error) {
    throw classifyZipError(error);
  }
  if (entries.length > MAX_ENTRIES) throw new ZipToolError('too-many-entries');
  const total = entries.reduce((sum, e) => sum + e.size, 0);
  if (total > MAX_TOTAL_BYTES) throw new ZipToolError('too-large');
  return entries;
}

/** ZIPから1ファイルだけ展開する。 */
export function extractEntry(data: Uint8Array, name: string): Uint8Array {
  try {
    const result = unzipSync(data, { filter: (file) => file.name === name });
    const out = result[name];
    if (!out) throw new ZipToolError('invalid-zip');
    return out;
  } catch (error) {
    throw classifyZipError(error);
  }
}

function classifyZipError(error: unknown): ZipToolError {
  if (error instanceof ZipToolError) return error;
  const message = String((error as Error | undefined)?.message ?? error);
  // fflate: 未対応の圧縮方式・暗号化は "unknown compression type N" 等で失敗する
  if (/compression|encrypt/i.test(message))
    return new ZipToolError('unsupported');
  return new ZipToolError('invalid-zip');
}
