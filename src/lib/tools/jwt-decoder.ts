export type JwtPartErrorCode = 'invalid-base64' | 'invalid-json';

export interface JwtPart {
  /** Base64URLエンコードされたままの元セグメント */
  raw: string;
  /** JSONとしてパース済みの値。パースに失敗した場合は null */
  json: unknown;
  errorCode: JwtPartErrorCode | null;
}

export type JwtDecodeErrorCode = 'invalid-format';

export interface JwtDecodeResult {
  isValid: boolean;
  errorCode: JwtDecodeErrorCode | null;
  header: JwtPart | null;
  payload: JwtPart | null;
  /** 署名部分は検証せず、Base64URL文字列のまま返す */
  signature: string | null;
}

function base64UrlDecodeToString(segment: string): string {
  const normalized = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

function decodePart(raw: string): JwtPart {
  let decoded: string;
  try {
    decoded = base64UrlDecodeToString(raw);
  } catch {
    return { raw, json: null, errorCode: 'invalid-base64' };
  }
  try {
    return { raw, json: JSON.parse(decoded), errorCode: null };
  } catch {
    return { raw, json: null, errorCode: 'invalid-json' };
  }
}

export function decodeJwt(token: string): JwtDecodeResult {
  const trimmed = token.trim();
  if (trimmed === '') {
    return {
      isValid: false,
      errorCode: null,
      header: null,
      payload: null,
      signature: null,
    };
  }

  const parts = trimmed.split('.');
  if (parts.length !== 3 || parts.some((part) => part === '')) {
    return {
      isValid: false,
      errorCode: 'invalid-format',
      header: null,
      payload: null,
      signature: null,
    };
  }

  const [headerRaw, payloadRaw, signature] = parts;
  return {
    isValid: true,
    errorCode: null,
    header: decodePart(headerRaw),
    payload: decodePart(payloadRaw),
    signature,
  };
}

/** exp/iat/nbf等、UNIX秒(数値)のクレームを日時に変換する。数値でなければ null */
export function unixSecondsToDate(value: unknown): Date | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime()) ? null : date;
}
