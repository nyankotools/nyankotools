import jsQR from 'jsqr';

export type QrContentKind =
  'url' | 'wifi' | 'email' | 'tel' | 'sms' | 'geo' | 'vcard' | 'text';

export interface WifiInfo {
  ssid: string;
  password: string;
  security: string;
  hidden: boolean;
}

export interface QrContent {
  kind: QrContentKind;
  /** kind が url のときだけ、リンクとして開いてよい http(s) のURL */
  url?: string;
  wifi?: WifiInfo;
}

/** 読み取った文字列の種類を判定する。リンクとして開けるのは http(s) のみ（javascript: 等は text 扱い）。 */
export function classifyContent(text: string): QrContent {
  const trimmed = text.trim();
  if (/^https?:\/\/\S+$/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return { kind: 'url', url: parsed.href };
      }
    } catch {
      // URLとして解釈できなければ通常のテキストとして扱う
    }
    return { kind: 'text' };
  }
  const wifi = parseWifi(trimmed);
  if (wifi) return { kind: 'wifi', wifi };
  if (/^mailto:/i.test(trimmed)) return { kind: 'email' };
  if (/^tel:/i.test(trimmed)) return { kind: 'tel' };
  if (/^smsto?:/i.test(trimmed)) return { kind: 'sms' };
  if (/^geo:/i.test(trimmed)) return { kind: 'geo' };
  if (/^BEGIN:VCARD/i.test(trimmed)) return { kind: 'vcard' };
  return { kind: 'text' };
}

/** `WIFI:T:WPA;S:ssid;P:pass;H:true;;` 形式（`\;` `\\` `\,` `\:` `\"` のエスケープ対応）を解析する。 */
export function parseWifi(text: string): WifiInfo | null {
  if (!/^WIFI:/i.test(text)) return null;
  const body = text.slice(5);
  const fields: Record<string, string> = {};
  let key = '';
  let value = '';
  let inValue = false;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (ch === '\\' && i + 1 < body.length) {
      const next = body[++i];
      if (inValue) value += next;
      else key += next;
    } else if (ch === ':' && !inValue) {
      inValue = true;
    } else if (ch === ';') {
      if (inValue && key) fields[key.toUpperCase()] = value;
      key = '';
      value = '';
      inValue = false;
    } else if (inValue) {
      value += ch;
    } else {
      key += ch;
    }
  }
  if (inValue && key) fields[key.toUpperCase()] = value;
  if (fields.S === undefined) return null;
  return {
    ssid: fields.S,
    password: fields.P ?? '',
    security: fields.T ?? '',
    hidden: (fields.H ?? '').toLowerCase() === 'true',
  };
}

export interface DecodeSource {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

/** 画像のピクセルデータからQRコードを読み取る（jsQR。QRコードのみ対応）。読み取れなければ null。 */
export function decodeQrFromImageData(source: DecodeSource): string | null {
  const result = jsQR(source.data, source.width, source.height, {
    inversionAttempts: 'attemptBoth',
  });
  return result && result.data !== '' ? result.data : null;
}

/** 履歴の先頭と同じ内容なら追加しない（カメラが同じコードを連続で捉えても重複させない）。 */
export function addToHistory(history: string[], text: string): string[] {
  if (history[0] === text) return history;
  return [text, ...history.filter((item) => item !== text)].slice(0, 20);
}
