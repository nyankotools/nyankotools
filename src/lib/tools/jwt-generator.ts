import {
  formatBytes,
  hmacBytes,
  parseHex,
  type HmacAlgorithm,
} from './hmac-generator';

export const JWT_ALGORITHMS = ['HS256', 'HS384', 'HS512'] as const;
export type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number];
export type JwtSecretFormat = 'text' | 'hex';

export type JwtGenerateErrorCode =
  'invalid-header' | 'invalid-payload' | 'invalid-hex';

export type JwtGenerateResult =
  | { success: true; token: string; header: string; payload: string }
  | { success: false; error: JwtGenerateErrorCode };

const HASH_BY_ALGORITHM: Record<JwtAlgorithm, HmacAlgorithm> = {
  HS256: 'SHA-256',
  HS384: 'SHA-384',
  HS512: 'SHA-512',
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseObject(text: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(text);
    return isPlainObject(value) ? value : null;
  } catch {
    return null;
  }
}

/** 妥当なJSON文字列から、文字列リテラル外の空白だけを取り除く（値は一切変えない） */
function minifyJson(text: string): string {
  let out = '';
  let inString = false;
  let escaped = false;
  for (const ch of text) {
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
    } else if (ch === '"') {
      inString = true;
      out += ch;
    } else if (ch !== ' ' && ch !== '\t' && ch !== '\n' && ch !== '\r') {
      out += ch;
    }
  }
  return out;
}

function base64UrlEncodeString(text: string): string {
  return formatBytes(new TextEncoder().encode(text), 'base64url');
}

/**
 * ヘッダーJSON・ペイロードJSON・秘密鍵からHMAC署名のJWTを組み立てる。
 * ヘッダーの alg は選択したアルゴリズムで上書きし、typ が無ければ "JWT" を補う
 */
export async function generateJwt(
  headerText: string,
  payloadText: string,
  secret: string,
  secretFormat: JwtSecretFormat,
  algorithm: JwtAlgorithm,
): Promise<JwtGenerateResult> {
  const headerObject = parseObject(headerText);
  if (!headerObject) return { success: false, error: 'invalid-header' };
  const payloadObject = parseObject(payloadText);
  if (!payloadObject) return { success: false, error: 'invalid-payload' };

  let keyBytes: Uint8Array;
  if (secretFormat === 'hex') {
    const parsed = parseHex(secret);
    if (!parsed) return { success: false, error: 'invalid-hex' };
    keyBytes = parsed;
  } else {
    keyBytes = new TextEncoder().encode(secret);
  }

  // 入力のキー順を保つ（alg が既にあればその位置のまま値だけ置き換わる）
  const headerWithAlg: Record<string, unknown> = {
    ...headerObject,
    alg: algorithm,
  };
  if (!('typ' in headerWithAlg)) headerWithAlg.typ = 'JWT';
  const header = JSON.stringify(headerWithAlg);
  // 入力の数値や重複キーを変えないよう、再シリアライズせず文字列の外の空白だけ除く
  const payload = minifyJson(payloadText);
  const signingInput = `${base64UrlEncodeString(header)}.${base64UrlEncodeString(payload)}`;
  const signature = await hmacBytes(
    keyBytes,
    new TextEncoder().encode(signingInput),
    HASH_BY_ALGORITHM[algorithm],
  );
  return {
    success: true,
    token: `${signingInput}.${formatBytes(signature, 'base64url')}`,
    header,
    payload,
  };
}

/**
 * ペイロードJSONに iat（発行日時）と exp（iat + ttlSeconds）を設定して整形し直す。
 * JSONオブジェクトでなければ null
 */
export function applyTimestamps(
  payloadText: string,
  nowMs: number,
  ttlSeconds: number,
): string | null {
  const payload = parseObject(payloadText);
  if (!payload) return null;
  const iat = Math.floor(nowMs / 1000);
  return JSON.stringify({ ...payload, iat, exp: iat + ttlSeconds }, null, 2);
}
