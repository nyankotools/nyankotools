export type EpochPreset = 'twitter' | 'discord' | 'custom';

export const EPOCH_TWITTER = 1288834974657;
export const EPOCH_DISCORD = 1420070400000;

/** UUID v1/v6 のグレゴリオ暦起点（1582-10-15）から Unix epoch までのミリ秒 */
const UUID_GREGORIAN_OFFSET_MS = 12219292800000;
const MAX_UINT64 = (1n << 64n) - 1n;
const MAX_DATE_MS = 8.64e15;
export const MAX_LINES = 1000;

export type IdKind = 'snowflake' | 'objectid' | 'uuid' | 'ulid';

export type FieldKey =
  | 'timestampOffset'
  | 'datacenter'
  | 'worker'
  | 'discordWorker'
  | 'discordProcess'
  | 'sequence'
  | 'increment'
  | 'random'
  | 'counter'
  | 'version'
  | 'variant'
  | 'clockSeq'
  | 'node'
  | 'randomBits';

export interface DecodedField {
  key: FieldKey;
  value: string;
}

export interface DecodedTime {
  unixMs: number;
  unixSec: number;
  iso: string;
  jst: string;
}

export type DecodeErrorCode = 'unknown' | 'overflow' | 'invalidUlid';

export type DecodeResult =
  | {
      ok: true;
      input: string;
      kind: IdKind;
      /** UUID の場合は v1 / v6 / v7 のときだけ時刻を持つ */
      time: DecodedTime | null;
      fields: DecodedField[];
    }
  | { ok: false; input: string; error: DecodeErrorCode };

export interface DecodeOptions {
  epochPreset: EpochPreset;
  /** epochPreset が custom のときのエポック（Unix ミリ秒） */
  customEpochMs: number;
}

export function resolveEpoch(options: DecodeOptions): number {
  if (options.epochPreset === 'twitter') return EPOCH_TWITTER;
  if (options.epochPreset === 'discord') return EPOCH_DISCORD;
  return Number.isFinite(options.customEpochMs) ? options.customEpochMs : 0;
}

export function toDecodedTime(unixMs: number): DecodedTime | null {
  if (!Number.isFinite(unixMs) || Math.abs(unixMs) > MAX_DATE_MS) return null;
  const date = new Date(unixMs);
  if (Number.isNaN(date.getTime())) return null;
  const jstDate = new Date(unixMs + 9 * 3600 * 1000);
  const jstIso = Number.isNaN(jstDate.getTime())
    ? ''
    : jstDate.toISOString().replace('Z', '+09:00');
  return {
    unixMs,
    unixSec: Math.floor(unixMs / 1000),
    iso: date.toISOString(),
    jst: jstIso,
  };
}

export function decodeSnowflake(
  id: bigint,
  epochMs: number,
  preset: EpochPreset,
): DecodeResult & { ok: true } {
  const offset = id >> 22n;
  const high = Number((id >> 17n) & 31n);
  const low = Number((id >> 12n) & 31n);
  const seq = Number(id & 4095n);
  const fields: DecodedField[] = [
    { key: 'timestampOffset', value: offset.toString() },
  ];
  if (preset === 'discord') {
    fields.push(
      { key: 'discordWorker', value: String(high) },
      { key: 'discordProcess', value: String(low) },
      { key: 'increment', value: String(seq) },
    );
  } else {
    fields.push(
      { key: 'datacenter', value: String(high) },
      { key: 'worker', value: String(low) },
      { key: 'sequence', value: String(seq) },
    );
  }
  return {
    ok: true,
    input: id.toString(),
    kind: 'snowflake',
    time: toDecodedTime(Number(offset) + epochMs),
    fields,
  };
}

export function decodeObjectId(text: string): DecodeResult & { ok: true } {
  const h = text.toLowerCase();
  const seconds = parseInt(h.slice(0, 8), 16);
  return {
    ok: true,
    input: text,
    kind: 'objectid',
    time: toDecodedTime(seconds * 1000),
    fields: [
      { key: 'random', value: h.slice(8, 18) },
      { key: 'counter', value: String(parseInt(h.slice(18, 24), 16)) },
    ],
  };
}

const VARIANT_LABELS: Array<[number, number, string]> = [
  [0x00, 0x80, 'NCS'],
  [0x80, 0xc0, 'RFC 9562'],
  [0xc0, 0xe0, 'Microsoft'],
  [0xe0, 0x100, 'Reserved'],
];

export function decodeUuid(text: string): DecodeResult & { ok: true } {
  const h = text.replace(/-/g, '').toLowerCase();
  const version = parseInt(h[12], 16);
  const variantByte = parseInt(h.slice(16, 18), 16);
  const variant =
    VARIANT_LABELS.find(
      ([lo, hi]) => variantByte >= lo && variantByte < hi,
    )?.[2] ?? 'Reserved';
  const fields: DecodedField[] = [
    { key: 'version', value: String(version) },
    { key: 'variant', value: variant },
  ];
  let time: DecodedTime | null = null;

  if (version === 1 || version === 6) {
    let ticks: bigint;
    if (version === 1) {
      ticks =
        (BigInt('0x' + h.slice(13, 16)) << 48n) |
        (BigInt('0x' + h.slice(8, 12)) << 32n) |
        BigInt('0x' + h.slice(0, 8));
    } else {
      ticks =
        (BigInt('0x' + h.slice(0, 8)) << 28n) |
        (BigInt('0x' + h.slice(8, 12)) << 12n) |
        BigInt('0x' + h.slice(13, 16));
    }
    time = toDecodedTime(Number(ticks / 10000n) - UUID_GREGORIAN_OFFSET_MS);
    fields.push(
      {
        key: 'clockSeq',
        value: String(parseInt(h.slice(16, 20), 16) & 0x3fff),
      },
      { key: 'node', value: h.slice(20, 32) },
    );
  } else if (version === 7) {
    time = toDecodedTime(Number(BigInt('0x' + h.slice(0, 12))));
    fields.push({
      key: 'randomBits',
      value: h.slice(12, 16).slice(1) + h.slice(16),
    });
  }
  return { ok: true, input: text, kind: 'uuid', time, fields };
}

const CROCKFORD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function decodeUlid(text: string): DecodeResult {
  const upper = text.toUpperCase();
  let ms = 0n;
  for (const ch of upper.slice(0, 10)) {
    ms = ms * 32n + BigInt(CROCKFORD.indexOf(ch));
  }
  // 先頭文字が 7 を超えると 48bit に収まらない
  if (ms >= 1n << 48n) {
    return { ok: false, input: text, error: 'invalidUlid' };
  }
  return {
    ok: true,
    input: text,
    kind: 'ulid',
    time: toDecodedTime(Number(ms)),
    fields: [{ key: 'random', value: upper.slice(10) }],
  };
}

export function decodeId(raw: string, options: DecodeOptions): DecodeResult {
  const text = raw.trim();
  if (/^[0-9a-fA-F]{24}$/.test(text)) return decodeObjectId(text);
  if (/^\d+$/.test(text)) {
    const id = BigInt(text);
    if (id > MAX_UINT64) return { ok: false, input: text, error: 'overflow' };
    const result = decodeSnowflake(
      id,
      resolveEpoch(options),
      options.epochPreset,
    );
    return { ...result, input: text };
  }
  const uuidText = text.replace(/^urn:uuid:/i, '').replace(/^\{(.*)\}$/, '$1');
  if (
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
      uuidText,
    ) ||
    /^[0-9a-fA-F]{32}$/.test(uuidText)
  ) {
    return { ...decodeUuid(uuidText), input: text };
  }
  if (/^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/.test(text)) {
    return decodeUlid(text);
  }
  return { ok: false, input: text, error: 'unknown' };
}

export function decodeMany(
  text: string,
  options: DecodeOptions,
): { results: DecodeResult[]; truncated: boolean } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const truncated = lines.length > MAX_LINES;
  return {
    results: lines.slice(0, MAX_LINES).map((l) => decodeId(l, options)),
    truncated,
  };
}

/** コピー用のTSV: 入力・形式・ISO・JST・UNIX ms */
export function resultsToTsv(results: DecodeResult[]): string {
  return results
    .map((r) => {
      if (!r.ok) return [r.input, '', '', '', ''].join('\t');
      return [
        r.input,
        r.kind,
        r.time?.iso ?? '',
        r.time?.jst ?? '',
        r.time ? String(r.time.unixMs) : '',
      ].join('\t');
    })
    .join('\n');
}
