/** 選択できる画像ファイルの上限サイズ（Base64化すると約1.33倍に膨らむため、テキスト量が扱いやすい範囲に制限する） */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function isImageFile(file: { type: string }): boolean {
  return file.type.startsWith('image/');
}

/** バイト数を人間が読みやすい単位（B/KB/MB/GB）の文字列に変換する */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ['KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = -1;
  do {
    value /= 1024;
    unitIndex++;
  } while (value >= 1024 && unitIndex < units.length - 1);
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[unitIndex]}`;
}

export type OutputStyle = 'data-url' | 'base64-only';

/** Data URL（`data:image/png;base64,...`）から、出力スタイルに応じた文字列を組み立てる */
export function formatEncodedOutput(
  dataUrl: string,
  style: OutputStyle,
): string {
  if (style === 'data-url') return dataUrl;
  const commaIndex = dataUrl.indexOf(',');
  return commaIndex === -1 ? dataUrl : dataUrl.slice(commaIndex + 1);
}

export interface DecodeSuccess {
  success: true;
  dataUrl: string;
  mimeType: string;
  byteLength: number;
}

export interface DecodeFailure {
  success: false;
}

export type DecodeOutcome = DecodeSuccess | DecodeFailure;

const DATA_URL_PATTERN = /^data:([^;,]+);base64,([\s\S]*)$/i;

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/svg+xml': 'svg',
  'image/x-icon': 'ico',
};

export function getExtensionForMimeType(mimeType: string): string {
  return MIME_EXTENSIONS[mimeType] ?? 'bin';
}

/** 画像データの先頭バイト（マジックナンバー）からMIMEタイプを推定する。判定できない場合はnull */
function detectImageMimeType(bytes: Uint8Array): string | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'image/png';
  }
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return 'image/jpeg';
  }
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x38
  ) {
    return 'image/gif';
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return 'image/webp';
  }
  if (bytes.length >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d) {
    return 'image/bmp';
  }
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    bytes[2] === 0x01 &&
    bytes[3] === 0x00
  ) {
    return 'image/x-icon';
  }
  const textStart = Array.from(bytes.slice(0, 200))
    .map((b) => String.fromCharCode(b))
    .join('')
    .trimStart();
  if (textStart.startsWith('<?xml') || textStart.startsWith('<svg')) {
    return 'image/svg+xml';
  }
  return null;
}

/** Data URLまたはBase64文字列（改行・空白混在可）をパースし、画像データとして妥当か検証する */
export function decodeBase64Image(input: string): DecodeOutcome {
  const trimmed = input.trim();
  if (!trimmed) return { success: false };

  const dataUrlMatch = trimmed.match(DATA_URL_PATTERN);
  const mimeTypeHint = dataUrlMatch?.[1]?.trim().toLowerCase() ?? null;
  const rawPayload = dataUrlMatch ? dataUrlMatch[2] : trimmed;
  const base64Payload = rawPayload.replace(/\s+/g, '');
  if (base64Payload === '') return { success: false };

  let bytes: Uint8Array;
  try {
    const binary = atob(base64Payload);
    bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  } catch {
    return { success: false };
  }
  if (bytes.length === 0) return { success: false };

  const detected = detectImageMimeType(bytes);
  const mimeType =
    mimeTypeHint && mimeTypeHint.startsWith('image/') ? mimeTypeHint : detected;
  if (!mimeType) return { success: false };

  return {
    success: true,
    dataUrl: `data:${mimeType};base64,${base64Payload}`,
    mimeType,
    byteLength: bytes.length,
  };
}
