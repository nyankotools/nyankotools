export type Encoding =
  'utf-8' | 'shift_jis' | 'euc-jp' | 'iso-2022-jp' | 'utf-16le' | 'utf-16be';

export const ENCODINGS: readonly Encoding[] = [
  'utf-8',
  'shift_jis',
  'euc-jp',
  'iso-2022-jp',
  'utf-16le',
  'utf-16be',
];

/** 文字化け診断で「誤って解釈した側」として扱う文字コード（Encoding + windows-1252） */
type MisreadEncoding = Encoding | 'windows-1252';

const REPLACEMENT = '�';

// ---------- 逆引きテーブル（TextDecoder の結果から文字→バイト列を構築） ----------

type ReverseTable = Map<string, number[]>;

const tableCache = new Map<string, ReverseTable>();

function addEntry(table: ReverseTable, decoder: TextDecoder, bytes: number[]) {
  const text = decoder.decode(new Uint8Array(bytes));
  if (text === '' || text.includes(REPLACEMENT)) return;
  const chars = Array.from(text);
  if (chars.length !== 1) return;
  if (!table.has(chars[0])) table.set(chars[0], bytes);
}

function buildShiftJisTable(): ReverseTable {
  const table: ReverseTable = new Map();
  const decoder = new TextDecoder('shift_jis');
  for (let b = 0x00; b <= 0x7f; b++) addEntry(table, decoder, [b]);
  for (let b = 0xa1; b <= 0xdf; b++) addEntry(table, decoder, [b]);
  for (let lead = 0x81; lead <= 0xfc; lead++) {
    if (lead > 0x9f && lead < 0xe0) continue;
    // 0xED/0xEE は 0xFA-0xFC と重複する NEC選定IBM拡張。IBM拡張側を優先する
    if (lead === 0xed || lead === 0xee) continue;
    for (let trail = 0x40; trail <= 0xfc; trail++) {
      if (trail === 0x7f) continue;
      addEntry(table, decoder, [lead, trail]);
    }
  }
  return table;
}

function buildEucJpTable(): ReverseTable {
  const table: ReverseTable = new Map();
  const decoder = new TextDecoder('euc-jp');
  for (let b = 0x00; b <= 0x7f; b++) addEntry(table, decoder, [b]);
  for (let b = 0xa1; b <= 0xdf; b++) addEntry(table, decoder, [0x8e, b]);
  for (let lead = 0xa1; lead <= 0xfe; lead++) {
    for (let trail = 0xa1; trail <= 0xfe; trail++) {
      addEntry(table, decoder, [lead, trail]);
    }
  }
  for (let lead = 0xa1; lead <= 0xfe; lead++) {
    for (let trail = 0xa1; trail <= 0xfe; trail++) {
      addEntry(table, decoder, [0x8f, lead, trail]);
    }
  }
  return table;
}

function buildWindows1252Table(): ReverseTable {
  const table: ReverseTable = new Map();
  const decoder = new TextDecoder('windows-1252');
  for (let b = 0x00; b <= 0xff; b++) addEntry(table, decoder, [b]);
  return table;
}

function getTable(name: 'shift_jis' | 'euc-jp' | 'windows-1252'): ReverseTable {
  let table = tableCache.get(name);
  if (!table) {
    table =
      name === 'shift_jis'
        ? buildShiftJisTable()
        : name === 'euc-jp'
          ? buildEucJpTable()
          : buildWindows1252Table();
    tableCache.set(name, table);
  }
  return table;
}

/** 同じ字を指す Unicode 上の別コードポイント（WHATWG表とCP932慣習の差）。表にない側を代替で引く */
const ALTERNATE_CHARS = new Map<string, string>([
  ['〜', '～'],
  ['～', '〜'],
  ['‖', '∥'],
  ['∥', '‖'],
  ['−', '－'],
  ['－', '−'],
  ['¢', '￠'],
  ['￠', '¢'],
  ['£', '￡'],
  ['￡', '£'],
  ['¬', '￢'],
  ['￢', '¬'],
  ['—', '―'],
  ['―', '—'],
]);

function lookup(table: ReverseTable, ch: string): number[] | undefined {
  const seq = table.get(ch);
  if (seq) return seq;
  const alt = ALTERNATE_CHARS.get(ch);
  return alt ? table.get(alt) : undefined;
}

export type LineEnding = 'lf' | 'crlf';

/** テキスト中で優先している改行（CRLFがLFと同数以上ならCRLF） */
export function detectLineEnding(text: string): LineEnding {
  const crlf = (text.match(/\r\n/g) ?? []).length;
  const lf = (text.match(/\n/g) ?? []).length - crlf;
  return crlf > 0 && crlf >= lf ? 'crlf' : 'lf';
}

export function applyLineEnding(text: string, ending: LineEnding): string {
  const normalized = text.replace(/\r\n|\r/g, '\n');
  return ending === 'crlf' ? normalized.replace(/\n/g, '\r\n') : normalized;
}

// ---------- エンコード ----------

export interface EncodeResult {
  bytes: Uint8Array;
  /** その文字コードで表現できず「?」に置き換えた文字（重複なし、出現順） */
  unmappable: string[];
}

export interface EncodeOptions {
  /** UTF-8 / UTF-16 の先頭にBOMを付ける */
  bom?: boolean;
}

function encodeUtf16(text: string, littleEndian: boolean, bom: boolean) {
  const units = text.length + (bom ? 1 : 0);
  const buffer = new ArrayBuffer(units * 2);
  const view = new DataView(buffer);
  let offset = 0;
  if (bom) {
    view.setUint16(0, 0xfeff, littleEndian);
    offset = 2;
  }
  for (let i = 0; i < text.length; i++) {
    view.setUint16(offset + i * 2, text.charCodeAt(i), littleEndian);
  }
  return new Uint8Array(buffer);
}

function encodeWithTable(
  text: string,
  table: ReverseTable,
): { bytes: number[]; unmappable: string[] } {
  const bytes: number[] = [];
  const unmappable: string[] = [];
  const seen = new Set<string>();
  for (const ch of text) {
    const seq = lookup(table, ch);
    if (seq) {
      bytes.push(...seq);
    } else {
      bytes.push(0x3f);
      if (!seen.has(ch)) {
        seen.add(ch);
        unmappable.push(ch);
      }
    }
  }
  return { bytes, unmappable };
}

function encodeIso2022Jp(text: string) {
  const eucTable = getTable('euc-jp');
  const bytes: number[] = [];
  const unmappable: string[] = [];
  const seen = new Set<string>();
  let inKanji = false;
  for (const ch of text) {
    const seq = lookup(eucTable, ch);
    if (seq && seq.length === 1) {
      if (inKanji) {
        bytes.push(0x1b, 0x28, 0x42);
        inKanji = false;
      }
      bytes.push(seq[0]);
    } else if (seq && seq.length === 2 && seq[0] !== 0x8e) {
      if (!inKanji) {
        bytes.push(0x1b, 0x24, 0x42);
        inKanji = true;
      }
      bytes.push(seq[0] - 0x80, seq[1] - 0x80);
    } else {
      if (inKanji) {
        bytes.push(0x1b, 0x28, 0x42);
        inKanji = false;
      }
      bytes.push(0x3f);
      if (!seen.has(ch)) {
        seen.add(ch);
        unmappable.push(ch);
      }
    }
  }
  if (inKanji) bytes.push(0x1b, 0x28, 0x42);
  return { bytes, unmappable };
}

/** テキストを指定した文字コードのバイト列に変換する。表現できない文字は「?」に置き換える */
export function encodeText(
  text: string,
  encoding: Encoding,
  options: EncodeOptions = {},
): EncodeResult {
  switch (encoding) {
    case 'utf-8': {
      const body = new TextEncoder().encode(text);
      if (!options.bom) return { bytes: body, unmappable: [] };
      const bytes = new Uint8Array(body.length + 3);
      bytes.set([0xef, 0xbb, 0xbf]);
      bytes.set(body, 3);
      return { bytes, unmappable: [] };
    }
    case 'utf-16le':
      return {
        bytes: encodeUtf16(text, true, options.bom ?? false),
        unmappable: [],
      };
    case 'utf-16be':
      return {
        bytes: encodeUtf16(text, false, options.bom ?? false),
        unmappable: [],
      };
    case 'shift_jis': {
      const r = encodeWithTable(text, getTable('shift_jis'));
      return { bytes: Uint8Array.from(r.bytes), unmappable: r.unmappable };
    }
    case 'euc-jp': {
      const r = encodeWithTable(text, getTable('euc-jp'));
      return { bytes: Uint8Array.from(r.bytes), unmappable: r.unmappable };
    }
    case 'iso-2022-jp': {
      const r = encodeIso2022Jp(text);
      return { bytes: Uint8Array.from(r.bytes), unmappable: r.unmappable };
    }
  }
}

// ---------- デコード ----------

export interface DecodeResult {
  text: string;
  /** 不正なバイト列があり U+FFFD に置き換えられた数 */
  errorCount: number;
}

/** 指定した文字コードとして解釈する（BOMは除去する。不正なバイトは U+FFFD になる） */
export function decodeBytes(
  bytes: Uint8Array,
  encoding: Encoding,
): DecodeResult {
  const decoder = new TextDecoder(encoding, { ignoreBOM: false });
  const text = decoder.decode(bytes);
  let errorCount = 0;
  for (const ch of text) if (ch === REPLACEMENT) errorCount++;
  return { text, errorCount };
}

// ---------- 判定 ----------

export interface DetectCandidate {
  encoding: Encoding;
  /** 大きいほど日本語テキストとして自然 */
  score: number;
}

export interface DetectResult {
  /** ASCII のみ（どの文字コードでも同じ内容になる） */
  ascii: boolean;
  /** 最有力の候補（ASCIIのみの場合は utf-8） */
  best: Encoding;
  /** 不正なバイトなく解釈できた候補を有力順に並べたもの */
  candidates: DetectCandidate[];
}

function isAscii(bytes: Uint8Array): boolean {
  for (const b of bytes) if (b > 0x7f) return false;
  return true;
}

/** 日本語テキストとしての自然さ（かな・漢字の割合が高く、珍しい文字が少ないほど高い） */
export function scoreJapaneseText(text: string): number {
  let good = 0;
  let bad = 0;
  let total = 0;
  for (const ch of text) {
    const code = ch.codePointAt(0)!;
    if (code < 0x80) continue;
    total++;
    if (
      (code >= 0x3040 && code <= 0x30ff) ||
      (code >= 0x4e00 && code <= 0x9fff) ||
      (code >= 0x3000 && code <= 0x303f) ||
      (code >= 0xff01 && code <= 0xff60)
    ) {
      good++;
    } else if (
      ch === REPLACEMENT ||
      (code >= 0xff61 && code <= 0xff9f) ||
      (code >= 0x80 && code <= 0x24f) ||
      (code >= 0xe000 && code <= 0xf8ff)
    ) {
      bad++;
    }
  }
  if (total === 0) return 0;
  return (good - bad * 2) / total;
}

export function detectEncoding(bytes: Uint8Array): DetectResult {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return {
      ascii: false,
      best: 'utf-8',
      candidates: [{ encoding: 'utf-8', score: 2 }],
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return {
      ascii: false,
      best: 'utf-16le',
      candidates: [{ encoding: 'utf-16le', score: 2 }],
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return {
      ascii: false,
      best: 'utf-16be',
      candidates: [{ encoding: 'utf-16be', score: 2 }],
    };
  }
  if (isAscii(bytes)) {
    let hasEscape = false;
    for (let i = 0; i + 2 < bytes.length; i++) {
      if (
        bytes[i] === 0x1b &&
        ((bytes[i + 1] === 0x24 &&
          (bytes[i + 2] === 0x42 || bytes[i + 2] === 0x40)) ||
          (bytes[i + 1] === 0x28 &&
            (bytes[i + 2] === 0x4a || bytes[i + 2] === 0x49)))
      ) {
        hasEscape = true;
        break;
      }
    }
    if (hasEscape) {
      return {
        ascii: false,
        best: 'iso-2022-jp',
        candidates: [{ encoding: 'iso-2022-jp', score: 2 }],
      };
    }
    return { ascii: true, best: 'utf-8', candidates: [] };
  }

  const candidates: DetectCandidate[] = [];
  for (const encoding of ['utf-8', 'shift_jis', 'euc-jp'] as const) {
    const { text, errorCount } = decodeBytes(bytes, encoding);
    if (errorCount > 0) continue;
    // UTF-8 として不正なバイトなく読めるなら、偶然一致する確率は極めて低いので優先する
    const bonus = encoding === 'utf-8' ? 1 : 0;
    candidates.push({ encoding, score: scoreJapaneseText(text) + bonus });
  }
  candidates.sort((a, b) => b.score - a.score);
  if (candidates.length === 0) {
    // どれも不正なバイトを含む場合は、置換文字が最も少ないものを選ぶ
    let best: Encoding = 'utf-8';
    let fewest = Infinity;
    for (const encoding of ['shift_jis', 'utf-8', 'euc-jp'] as const) {
      const { errorCount } = decodeBytes(bytes, encoding);
      if (errorCount < fewest) {
        fewest = errorCount;
        best = encoding;
      }
    }
    return { ascii: false, best, candidates: [] };
  }
  return { ascii: false, best: candidates[0].encoding, candidates };
}

// ---------- 文字化け診断 ----------

/** 「本来の文字コード」→「誤って解釈された文字コード」の組み合わせ（よくある順） */
const MISREAD_PAIRS: readonly { actual: Encoding; misread: MisreadEncoding }[] =
  [
    { actual: 'utf-8', misread: 'shift_jis' },
    { actual: 'utf-8', misread: 'windows-1252' },
    { actual: 'shift_jis', misread: 'windows-1252' },
    { actual: 'shift_jis', misread: 'utf-8' },
    { actual: 'euc-jp', misread: 'shift_jis' },
    { actual: 'euc-jp', misread: 'windows-1252' },
    { actual: 'utf-8', misread: 'euc-jp' },
    { actual: 'shift_jis', misread: 'euc-jp' },
  ];

export interface MojibakeCandidate {
  /** 本来の文字コード */
  actual: Encoding;
  /** 誤って解釈された文字コード */
  misread: MisreadEncoding;
  /** 復元したテキスト */
  text: string;
  score: number;
}

/** 化けた文字列に含まれる U+FFFD の部分に入れる、UTF-8 として読める目印のバイト列 */
const REPLACEMENT_BYTES = [0xef, 0xbf, 0xbd];

function encodeAsMisread(
  text: string,
  misread: MisreadEncoding,
  allowReplacement: boolean,
): Uint8Array | null {
  const parts = allowReplacement ? text.split(REPLACEMENT) : [text];
  const bytes: number[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (i > 0) bytes.push(...REPLACEMENT_BYTES);
    let part: Uint8Array;
    if (misread === 'windows-1252') {
      const r = encodeWithTable(parts[i], getTable('windows-1252'));
      if (r.unmappable.length > 0) return null;
      part = Uint8Array.from(r.bytes);
    } else {
      const r = encodeText(parts[i], misread);
      if (r.unmappable.length > 0) return null;
      part = r.bytes;
    }
    // 巨大入力でもスタックを溢れさせないよう、スプレッドではなくループで追加する
    for (let j = 0; j < part.length; j++) bytes.push(part[j]);
  }
  return Uint8Array.from(bytes);
}

/**
 * 文字化けしたテキストを、ありがちな文字コードの取り違えとして逆変換し、
 * 日本語として自然に読める復元候補を自然さの高い順に返す。
 * UTF-8 を Shift_JIS 等で読んだ際に失われた部分（U+FFFD）は、復元結果でも U+FFFD として残る。
 */
export function diagnoseMojibake(text: string): MojibakeCandidate[] {
  if (text.trim() === '') return [];
  const results: MojibakeCandidate[] = [];
  for (const { actual, misread } of MISREAD_PAIRS) {
    const bytes = encodeAsMisread(text, misread, actual === 'utf-8');
    if (!bytes) continue;
    const decoded = decodeBytes(bytes, actual);
    const restored = decoded.text.replace(/�+/g, REPLACEMENT);
    if (restored === text) continue;
    const readable = restored.replaceAll(REPLACEMENT, '');
    const chars = Array.from(restored).length;
    if (chars === 0 || Array.from(readable).length / chars < 0.6) continue;
    if (!Array.from(readable).some((c) => c.codePointAt(0)! >= 0x80)) continue;
    if (actual !== 'utf-8' && decoded.errorCount > 0) continue;
    const score = scoreJapaneseText(readable);
    if (score <= 0.3) continue;
    results.push({ actual, misread, text: restored, score });
  }
  results.sort((a, b) => b.score - a.score);
  return results;
}
