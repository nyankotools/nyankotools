import { applyLineEnding, encodeText } from './encoding-converter';

export type ByteEncoding = 'utf-8' | 'shift_jis' | 'utf-16';

export const BYTE_ENCODINGS: readonly ByteEncoding[] = [
  'utf-8',
  'shift_jis',
  'utf-16',
];

/** 'keep' は入力のまま、'lf' / 'crlf' は改行を統一してから数える */
export type NewlineMode = 'keep' | 'lf' | 'crlf';

export interface ByteCountOptions {
  /** UTF-8 / UTF-16 の先頭にBOMを付けた場合のバイト数で数える */
  bom?: boolean;
  newline?: NewlineMode;
}

export interface ByteCountResult {
  bytes: number;
  /** Unicodeコードポイント数 */
  characters: number;
  /** その文字コードで表現できず「?」（1バイト）として数えた文字（重複なし、出現順） */
  unmappable: string[];
  /** 表現できない文字の出現回数（重複を含む） */
  unmappableCount: number;
}

export function normalizeNewlines(text: string, mode: NewlineMode): string {
  return mode === 'keep' ? text : applyLineEnding(text, mode);
}

function bomBytes(encoding: ByteEncoding, bom: boolean): number {
  if (!bom) return 0;
  return encoding === 'utf-8' ? 3 : encoding === 'utf-16' ? 2 : 0;
}

interface CharInfo {
  bytes: number;
  mappable: boolean;
}

/** 1文字分のバイト数（Shift_JIS はテーブル引きなのでキャッシュする） */
function createCharMeasurer(encoding: ByteEncoding) {
  const cache = new Map<string, CharInfo>();
  return (ch: string): CharInfo => {
    const code = ch.codePointAt(0)!;
    if (encoding === 'utf-8') {
      // 単独サロゲートは U+FFFD（3バイト）にエンコードされる
      const bytes = code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
      return { bytes, mappable: true };
    }
    if (encoding === 'utf-16') {
      return { bytes: code >= 0x10000 ? 4 : 2, mappable: true };
    }
    let info = cache.get(ch);
    if (!info) {
      const r = encodeText(ch, 'shift_jis');
      info = { bytes: r.bytes.length, mappable: r.unmappable.length === 0 };
      cache.set(ch, info);
    }
    return info;
  };
}

/** テキストを指定した文字コードで保存したときのバイト数を数える */
export function countBytes(
  text: string,
  encoding: ByteEncoding,
  options: ByteCountOptions = {},
): ByteCountResult {
  const source = normalizeNewlines(text, options.newline ?? 'keep');
  const measure = createCharMeasurer(encoding);
  let bytes = bomBytes(encoding, options.bom ?? false);
  let characters = 0;
  let unmappableCount = 0;
  const seen = new Set<string>();
  const unmappable: string[] = [];
  for (const ch of source) {
    const info = measure(ch);
    bytes += info.bytes;
    characters++;
    if (!info.mappable) {
      unmappableCount++;
      if (!seen.has(ch)) {
        seen.add(ch);
        unmappable.push(ch);
      }
    }
  }
  return { bytes, characters, unmappable, unmappableCount };
}

export interface LimitSplit {
  /** 上限に収まる先頭部分（コードポイント単位で区切る） */
  head: string;
  /** 上限を超える残り（収まるなら空文字） */
  tail: string;
  /** head のバイト数（BOM を含む） */
  headBytes: number;
  /** head のコードポイント数 */
  headCharacters: number;
  /** 全体のバイト数 */
  totalBytes: number;
  /** 上限を超えているか */
  overLimit: boolean;
  /** 上限までの残りバイト数（超過時は負の値） */
  remaining: number;
}

/** 上限バイト数に収まる範囲と、超過が始まる位置を求める */
export function splitAtByteLimit(
  text: string,
  encoding: ByteEncoding,
  limit: number,
  options: ByteCountOptions = {},
): LimitSplit {
  const source = normalizeNewlines(text, options.newline ?? 'keep');
  const measure = createCharMeasurer(encoding);
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 0;
  const base = bomBytes(encoding, options.bom ?? false);
  let used = base;
  let headEnd = 0;
  let headCharacters = 0;
  let cutFound = false;
  let offset = 0;
  for (const ch of source) {
    const size = measure(ch).bytes;
    if (!cutFound && used + size <= safeLimit) {
      headEnd = offset + ch.length;
      headCharacters++;
    } else {
      cutFound = true;
    }
    used += size;
    offset += ch.length;
  }
  // 先頭から連続して収まる範囲のみを head とするため、headBytes を再計算する
  let headBytes = base;
  for (const ch of source.slice(0, headEnd)) headBytes += measure(ch).bytes;
  return {
    head: source.slice(0, headEnd),
    tail: source.slice(headEnd),
    headBytes,
    headCharacters,
    totalBytes: used,
    overLimit: used > safeLimit,
    remaining: safeLimit - used,
  };
}
