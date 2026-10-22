/** この大きさを超えると警告を表示する（Base64化で約1.33倍のテキストになり、画面が重くなるため） */
export const WARN_FILE_SIZE = 5 * 1024 * 1024;
/** これを超えるファイルは変換しない */
export const MAX_FILE_SIZE = 30 * 1024 * 1024;

export type SizeCheck = 'ok' | 'warn' | 'too-large';

export function checkFileSize(bytes: number): SizeCheck {
  if (bytes > MAX_FILE_SIZE) return 'too-large';
  if (bytes > WARN_FILE_SIZE) return 'warn';
  return 'ok';
}

/** バイト数を人間が読みやすい単位（B/KB/MB/GB）の文字列に変換する */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`;
}

const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  ico: 'image/x-icon',
  pdf: 'application/pdf',
  zip: 'application/zip',
  json: 'application/json',
  xml: 'application/xml',
  txt: 'text/plain',
  csv: 'text/csv',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  ogg: 'audio/ogg',
  mp4: 'video/mp4',
  webm: 'video/webm',
  woff: 'font/woff',
  woff2: 'font/woff2',
  ttf: 'font/ttf',
  otf: 'font/otf',
};

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
  'image/vnd.microsoft.icon': 'ico',
  'audio/mpeg': 'mp3',
  'audio/x-wav': 'wav',
  'text/plain': 'txt',
  'text/javascript': 'js',
  'application/javascript': 'js',
  'application/xml': 'xml',
  'application/octet-stream': 'bin',
};
for (const [ext, mime] of Object.entries(MIME_BY_EXTENSION)) {
  if (!(mime in EXTENSION_BY_MIME)) EXTENSION_BY_MIME[mime] = ext;
}

export function getExtensionForMimeType(mimeType: string): string {
  return EXTENSION_BY_MIME[mimeType.toLowerCase()] ?? 'bin';
}

/** ブラウザが返すMIMEタイプが空の場合に、拡張子から推定する */
export function guessMimeType(fileName: string, browserType: string): string {
  if (browserType) return browserType;
  const dot = fileName.lastIndexOf('.');
  const ext = dot === -1 ? '' : fileName.slice(dot + 1).toLowerCase();
  return MIME_BY_EXTENSION[ext] ?? 'application/octet-stream';
}

/** バイト列をBase64にする（大きな配列でも引数上限に当たらないよう分割する） */
export function bytesToBase64(bytes: Uint8Array): string {
  const CHUNK = 0x8000;
  let binary = '';
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export type OutputStyle = 'data-uri' | 'base64-only';

/** 指定文字数ごとに改行する（0以下は改行しない） */
export function wrapLines(text: string, width: number): string {
  if (width <= 0 || text.length <= width) return text;
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += width) {
    lines.push(text.slice(i, i + width));
  }
  return lines.join('\n');
}

export function buildDataUri(mimeType: string, base64: string): string {
  return `data:${mimeType};base64,${base64}`;
}

/** 出力形式と折り返しに応じた最終文字列を作る。Data URIは1行のまま（折り返すと無効なURIになるため） */
export function formatOutput(
  base64: string,
  mimeType: string,
  style: OutputStyle,
  wrapWidth: number,
): string {
  if (style === 'data-uri') return buildDataUri(mimeType, base64);
  return wrapLines(base64, wrapWidth);
}

/** 先頭バイト（マジックナンバー）からMIMEタイプを推定する。判定できない場合はnull */
export function detectMimeType(bytes: Uint8Array): string | null {
  const startsWith = (sig: number[], offset = 0) =>
    bytes.length >= offset + sig.length &&
    sig.every((value, i) => bytes[offset + i] === value);

  if (startsWith([0x89, 0x50, 0x4e, 0x47])) return 'image/png';
  if (startsWith([0xff, 0xd8, 0xff])) return 'image/jpeg';
  if (startsWith([0x47, 0x49, 0x46, 0x38])) return 'image/gif';
  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x45, 0x42, 0x50], 8)
  )
    return 'image/webp';
  if (
    startsWith([0x52, 0x49, 0x46, 0x46]) &&
    startsWith([0x57, 0x41, 0x56, 0x45], 8)
  )
    return 'audio/wav';
  if (startsWith([0x25, 0x50, 0x44, 0x46, 0x2d])) return 'application/pdf';
  if (startsWith([0x50, 0x4b, 0x03, 0x04])) return 'application/zip';
  if (startsWith([0x49, 0x44, 0x33]) || startsWith([0xff, 0xfb]))
    return 'audio/mpeg';
  if (startsWith([0x4f, 0x67, 0x67, 0x53])) return 'audio/ogg';
  if (startsWith([0x77, 0x4f, 0x46, 0x46])) return 'font/woff';
  if (startsWith([0x77, 0x4f, 0x46, 0x32])) return 'font/woff2';
  if (startsWith([0x66, 0x74, 0x79, 0x70], 4)) return 'video/mp4';
  if (startsWith([0x00, 0x00, 0x01, 0x00])) return 'image/x-icon';
  if (startsWith([0x42, 0x4d])) return 'image/bmp';
  const head = Array.from(bytes.subarray(0, 200))
    .map((b) => String.fromCharCode(b))
    .join('')
    .trimStart();
  if (head.startsWith('<svg') || head.startsWith('<?xml')) {
    return head.includes('<svg') ? 'image/svg+xml' : 'application/xml';
  }
  return null;
}

export interface DecodeSuccess {
  success: true;
  bytes: Uint8Array<ArrayBuffer>;
  mimeType: string;
  /** MIMEタイプがData URIで明示されていたか（falseなら先頭バイトからの推定） */
  mimeFromHeader: boolean;
}

export interface DecodeFailure {
  success: false;
}

export type DecodeOutcome = DecodeSuccess | DecodeFailure;

/** `%XX` を含むパーセントエンコード文字列をバイト列にする。不正ならnull */
function percentDecodeToBytes(text: string): Uint8Array<ArrayBuffer> | null {
  const out: number[] = [];
  const encoder = new TextEncoder();
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '%') {
      const hex = text.slice(i + 1, i + 3);
      if (!/^[0-9a-fA-F]{2}$/.test(hex)) return null;
      out.push(parseInt(hex, 16));
      i += 2;
    } else {
      const cp = text.codePointAt(i)!;
      const char = String.fromCodePoint(cp);
      if (cp > 0xffff) i++;
      out.push(...encoder.encode(char));
    }
  }
  return Uint8Array.from(out);
}

/** Base64（標準・URLセーフ、改行・空白・パディング欠落を許容）をバイト列にする。不正ならnull */
export function base64ToBytes(input: string): Uint8Array<ArrayBuffer> | null {
  const cleaned = input
    .replace(/\s+/g, '')
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .replace(/=+$/, '');
  if (cleaned === '' || !/^[A-Za-z0-9+/]+$/.test(cleaned)) return null;
  if (cleaned.length % 4 === 1) return null;
  const padded = cleaned + '='.repeat((4 - (cleaned.length % 4)) % 4);
  try {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

/** Data URI（Base64 / パーセントエンコード）またはBase64文字列をファイルのバイト列に戻す */
export function decodeToFile(input: string): DecodeOutcome {
  const trimmed = input.trim();
  if (!trimmed) return { success: false };

  let mimeHint: string | null = null;
  let bytes: Uint8Array<ArrayBuffer> | null;

  if (/^data:/i.test(trimmed)) {
    const comma = trimmed.indexOf(',');
    if (comma === -1) return { success: false };
    const meta = trimmed.slice(5, comma).split(';');
    const payload = trimmed.slice(comma + 1);
    const isBase64 = meta.some((m) => m.trim().toLowerCase() === 'base64');
    const first = meta[0].trim().toLowerCase();
    if (first.includes('/')) mimeHint = first;
    bytes = isBase64 ? base64ToBytes(payload) : percentDecodeToBytes(payload);
  } else {
    bytes = base64ToBytes(trimmed);
  }

  if (!bytes || bytes.length === 0) return { success: false };
  const mimeType =
    mimeHint ?? detectMimeType(bytes) ?? 'application/octet-stream';
  return { success: true, bytes, mimeType, mimeFromHeader: mimeHint !== null };
}
