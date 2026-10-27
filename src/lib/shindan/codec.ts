/**
 * 共有URLの符号化（16.4）。
 * payload = 回答（1問2bit）+ variant（12bit）を base64url にしたもの。12問なら36bit = 6文字。
 * 名前そのものは含めない。復号できない値は例外を出さず null を返す。
 */
const ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const ANSWER_BITS = 2;
const VARIANT_BITS = 12;

export type DecodedPayload = { answers: number[]; variant: number };

export type ShareCode = {
  engineVersion: number;
  themeVersion: number;
  payload: string;
};

function payloadLength(questionCount: number): number {
  return Math.ceil((questionCount * ANSWER_BITS + VARIANT_BITS) / 6);
}

function pushBits(bits: number[], value: number, width: number): void {
  for (let i = width - 1; i >= 0; i--) bits.push((value >>> i) & 1);
}

function readBits(bits: readonly number[], start: number, width: number) {
  let value = 0;
  for (let i = 0; i < width; i++) value = value * 2 + bits[start + i];
  return value;
}

export function encodePayload(
  answers: readonly number[],
  variant: number,
): string {
  const bits: number[] = [];
  for (const a of answers) pushBits(bits, a, ANSWER_BITS);
  pushBits(bits, variant, VARIANT_BITS);
  while (bits.length % 6 !== 0) bits.push(0);
  let out = '';
  for (let i = 0; i < bits.length; i += 6)
    out += ALPHABET[readBits(bits, i, 6)];
  return out;
}

/** payload を復号する。長さ・文字・余りbit（0であること）を検証し、1つの結果に1つの表記だけを許す */
export function decodePayload(
  payload: string,
  questionCount: number,
): DecodedPayload | null {
  if (payload.length !== payloadLength(questionCount)) return null;
  const bits: number[] = [];
  for (const ch of payload) {
    const index = ALPHABET.indexOf(ch);
    if (index < 0) return null;
    pushBits(bits, index, 6);
  }
  const answers: number[] = [];
  for (let i = 0; i < questionCount; i++) {
    answers.push(readBits(bits, i * ANSWER_BITS, ANSWER_BITS));
  }
  const variantStart = questionCount * ANSWER_BITS;
  // 12bit の最大値は VARIANT_MAX と同じなので、範囲の検査は不要
  const variant = readBits(bits, variantStart, VARIANT_BITS);
  if (bits.slice(variantStart + VARIANT_BITS).some((b) => b !== 0)) return null;
  return { answers, variant };
}

export function formatShareCode(code: ShareCode): string {
  return `${code.engineVersion}.${code.themeVersion}.${code.payload}`;
}

export function parseShareCode(text: string): ShareCode | null {
  const m = /^([1-9]\d{0,2})\.([1-9]\d{0,2})\.([A-Za-z0-9_-]{1,64})$/.exec(
    text,
  );
  if (!m) return null;
  return {
    engineVersion: Number(m[1]),
    themeVersion: Number(m[2]),
    payload: m[3],
  };
}

/** `#r=<自分>&vs=<相手>` を組み立てる */
export function buildShareHash(self: string, vs?: string): string {
  return vs ? `#r=${self}&vs=${vs}` : `#r=${self}`;
}

/** URLハッシュから自分と相手の共有コード（未検証の文字列）を取り出す */
export function parseShareHash(
  hash: string,
): { self: string; vs?: string } | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  const self = params.get('r');
  if (!self) return null;
  const vs = params.get('vs');
  return vs ? { self, vs } : { self };
}

/**
 * 貼り付けられた文字列（共有URL・`#r=...`・共有コードそのもの）から共有コードを取り出す。
 * 相性用URL（`&vs=`付き）の場合は、そのURLの持ち主（r）のコードを返す。形式が違えば null。
 */
export function extractShareCode(text: string): string | null {
  const trimmed = text.trim();
  const hashIndex = trimmed.indexOf('#');
  const code =
    hashIndex >= 0 ? parseShareHash(trimmed.slice(hashIndex))?.self : trimmed;
  return code && parseShareCode(code) ? code : null;
}
