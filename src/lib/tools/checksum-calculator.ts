export const CHECKSUM_ALGORITHMS = [
  { id: 'crc32', label: 'CRC-32', bits: 32 },
  { id: 'crc32c', label: 'CRC-32C (Castagnoli)', bits: 32 },
  { id: 'crc16-arc', label: 'CRC-16/ARC', bits: 16 },
  { id: 'crc16-ccitt', label: 'CRC-16/CCITT-FALSE', bits: 16 },
  { id: 'crc16-xmodem', label: 'CRC-16/XMODEM', bits: 16 },
  { id: 'adler32', label: 'Adler-32', bits: 32 },
  { id: 'fletcher16', label: 'Fletcher-16', bits: 16 },
  { id: 'fletcher32', label: 'Fletcher-32', bits: 32 },
] as const;

export type ChecksumId = (typeof CHECKSUM_ALGORITHMS)[number]['id'];

export type ChecksumResult = Record<ChecksumId, string>;

/** ファイル1件あたりの上限（チャンク単位で読むのでメモリには全体を載せない） */
export const MAX_FILE_SIZE = 1024 * 1024 * 1024;

/** ファイルを読み込む際の1チャンクのサイズ */
export const CHUNK_SIZE = 4 * 1024 * 1024;

interface CrcParams {
  width: 16 | 32;
  poly: number;
  init: number;
  reflected: boolean;
  xorOut: number;
}

const CRC_PARAMS: Record<string, CrcParams> = {
  crc32: {
    width: 32,
    poly: 0x04c11db7,
    init: 0xffffffff,
    reflected: true,
    xorOut: 0xffffffff,
  },
  crc32c: {
    width: 32,
    poly: 0x1edc6f41,
    init: 0xffffffff,
    reflected: true,
    xorOut: 0xffffffff,
  },
  'crc16-arc': {
    width: 16,
    poly: 0x8005,
    init: 0,
    reflected: true,
    xorOut: 0,
  },
  'crc16-ccitt': {
    width: 16,
    poly: 0x1021,
    init: 0xffff,
    reflected: false,
    xorOut: 0,
  },
  'crc16-xmodem': {
    width: 16,
    poly: 0x1021,
    init: 0,
    reflected: false,
    xorOut: 0,
  },
};

function reverseBits(value: number, width: number): number {
  let result = 0;
  for (let i = 0; i < width; i++) {
    result = ((result << 1) | ((value >>> i) & 1)) >>> 0;
  }
  return result;
}

function buildTable(params: CrcParams): Uint32Array {
  const table = new Uint32Array(256);
  const { width, poly, reflected } = params;
  const topBit = 2 ** (width - 1);
  const mask = width === 32 ? 0xffffffff : 0xffff;
  const reflectedPoly = reverseBits(poly, width);
  for (let i = 0; i < 256; i++) {
    let crc: number;
    if (reflected) {
      crc = i;
      for (let k = 0; k < 8; k++) {
        crc = crc & 1 ? (crc >>> 1) ^ reflectedPoly : crc >>> 1;
      }
    } else {
      crc = (i << (width - 8)) >>> 0;
      for (let k = 0; k < 8; k++) {
        crc = crc & topBit ? ((crc << 1) ^ poly) >>> 0 : (crc << 1) >>> 0;
      }
      crc &= mask;
    }
    table[i] = crc >>> 0;
  }
  return table;
}

const tableCache = new Map<string, Uint32Array>();

function getTable(id: string): Uint32Array {
  let table = tableCache.get(id);
  if (!table) {
    table = buildTable(CRC_PARAMS[id]!);
    tableCache.set(id, table);
  }
  return table;
}

function hex(value: number, bits: number): string {
  return (value >>> 0).toString(16).padStart(bits / 4, '0');
}

export interface ChecksumState {
  update(chunk: Uint8Array): void;
  digest(): ChecksumResult;
}

/** 逐次的に（チャンクごとに）チェックサムを計算する状態を作る */
export function createChecksumState(): ChecksumState {
  const crcIds = Object.keys(CRC_PARAMS);
  const tables = crcIds.map(getTable);
  const crcs = crcIds.map((id) => CRC_PARAMS[id]!.init);
  let adlerA = 1;
  let adlerB = 0;
  let f16a = 0;
  let f16b = 0;
  let f32a = 0;
  let f32b = 0;
  let pending = -1; // Fletcher-32 の未処理の下位バイト

  function update(chunk: Uint8Array) {
    for (let c = 0; c < crcIds.length; c++) {
      const params = CRC_PARAMS[crcIds[c]!]!;
      const table = tables[c]!;
      let crc = crcs[c]!;
      if (params.reflected) {
        for (let i = 0; i < chunk.length; i++) {
          crc = table[(crc ^ chunk[i]!) & 0xff]! ^ (crc >>> 8);
        }
      } else {
        for (let i = 0; i < chunk.length; i++) {
          crc =
            ((crc << 8) & 0xffff) ^ table[((crc >>> 8) ^ chunk[i]!) & 0xff]!;
        }
      }
      crcs[c] = crc >>> 0;
    }

    // Adler-32: 5552バイトごとに剰余を取れば桁あふれしない
    for (let start = 0; start < chunk.length; start += 5552) {
      const end = Math.min(start + 5552, chunk.length);
      for (let i = start; i < end; i++) {
        adlerA += chunk[i]!;
        adlerB += adlerA;
      }
      adlerA %= 65521;
      adlerB %= 65521;
    }

    for (let i = 0; i < chunk.length; i++) {
      const byte = chunk[i]!;
      f16a = (f16a + byte) % 255;
      f16b = (f16b + f16a) % 255;

      if (pending < 0) {
        pending = byte;
      } else {
        f32a = (f32a + (pending | (byte << 8))) % 65535;
        f32b = (f32b + f32a) % 65535;
        pending = -1;
      }
    }
  }

  function digest(): ChecksumResult {
    const result = {} as ChecksumResult;
    crcIds.forEach((id, c) => {
      const params = CRC_PARAMS[id]!;
      result[id as ChecksumId] = hex(
        (crcs[c]! ^ params.xorOut) >>> 0,
        params.width,
      );
    });
    result.adler32 = hex(((adlerB << 16) | adlerA) >>> 0, 32);
    result.fletcher16 = hex((f16b << 8) | f16a, 16);

    // 奇数バイトの場合は末尾を0で埋めた16ビットワードとして扱う（状態は変更しない）
    let a = f32a;
    let b = f32b;
    if (pending >= 0) {
      a = (a + pending) % 65535;
      b = (b + a) % 65535;
    }
    result.fletcher32 = hex(((b << 16) | a) >>> 0, 32);
    return result;
  }

  return { update, digest };
}

/** バイト列の全チェックサム（小文字16進数）を計算する */
export function checksumBytes(data: Uint8Array): ChecksumResult {
  const state = createChecksumState();
  state.update(data);
  return state.digest();
}

/** テキストをUTF-8に変換して全チェックサムを計算する */
export function checksumText(text: string): ChecksumResult {
  return checksumBytes(new TextEncoder().encode(text));
}

/**
 * 照合用に貼り付けられた値を正規化する（小文字化・`0x`や`crc32:`等の接頭辞除去・空白除去）。
 * `<値>  <ファイル名>` 形式は先頭の語だけを使う。
 */
export function normalizeChecksumInput(input: string): string {
  const text = input
    .trim()
    .replace(/^[A-Za-z][A-Za-z0-9/_-]*\s*[:=]\s*/, '')
    .toLowerCase();
  const first = text.split(/\s+/)[0] ?? '';
  return first.replace(/^0x/, '');
}

export type ChecksumCompareResult =
  | { status: 'empty' }
  | { status: 'invalid' }
  | { status: 'match'; ids: ChecksumId[] }
  | { status: 'mismatch' };

/** 貼り付けられた値と一致するアルゴリズムを探す（4桁なら16ビット系、8桁なら32ビット系） */
export function compareChecksum(
  input: string,
  result: ChecksumResult,
): ChecksumCompareResult {
  const value = normalizeChecksumInput(input);
  if (value === '') return { status: 'empty' };
  if (
    !/^[0-9a-f]+$/.test(value) ||
    (value.length !== 4 && value.length !== 8)
  ) {
    return { status: 'invalid' };
  }
  const ids = CHECKSUM_ALGORITHMS.filter(
    (a) => a.bits / 4 === value.length && result[a.id] === value,
  ).map((a) => a.id);
  return ids.length > 0 ? { status: 'match', ids } : { status: 'mismatch' };
}
