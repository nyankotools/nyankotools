/** 対応する画像ファイルの上限サイズ */
export const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** Exif解析対象として受け付けるかどうか（JPEGのみ。Exifは主にJPEG/TIFFの仕組みのため） */
export function isJpegFile(file: { type: string }): boolean {
  return file.type === 'image/jpeg';
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

// --- Exifタグの整形 ---

export type OrientationKey =
  | 'normal'
  | 'flip-horizontal'
  | 'rotate-180'
  | 'flip-vertical'
  | 'transpose'
  | 'rotate-90-cw'
  | 'transverse'
  | 'rotate-90-ccw';

const ORIENTATION_KEYS: Record<number, OrientationKey> = {
  1: 'normal',
  2: 'flip-horizontal',
  3: 'rotate-180',
  4: 'flip-vertical',
  5: 'transpose',
  6: 'rotate-90-cw',
  7: 'transverse',
  8: 'rotate-90-ccw',
};

/** Exifの`Orientation`タグ（1〜8の数値）を、表示用ラベルのキーに変換する */
export function getOrientationKey(value: unknown): OrientationKey | undefined {
  return typeof value === 'number' ? ORIENTATION_KEYS[value] : undefined;
}

export type WhiteBalanceKey = 'auto' | 'manual';

/** Exifの`WhiteBalance`タグ（0=自動 / 1=マニュアル）を、表示用ラベルのキーに変換する */
export function getWhiteBalanceKey(
  value: unknown,
): WhiteBalanceKey | undefined {
  if (value === 0) return 'auto';
  if (value === 1) return 'manual';
  return undefined;
}

/** Exifの`Flash`タグ（ビットフラグ）の最下位ビットから、発光の有無を判定する */
export function didFlashFire(value: unknown): boolean | undefined {
  return typeof value === 'number' ? (value & 0x1) === 1 : undefined;
}

/** 秒数（小数）を、カメラでの表記に近い分数/整数の文字列（例: "1/125"・"2"）に変換する */
export function formatExposureTime(value: unknown): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  if (value >= 1) {
    return Number.isInteger(value) ? `${value}` : value.toFixed(1);
  }
  const denominator = Math.round(1 / value);
  return denominator > 0 ? `1/${denominator}` : undefined;
}

/** F値を"f/2.8"のようなカメラ表記の文字列に変換する */
export function formatFNumber(value: unknown): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return `f/${Math.round(value * 10) / 10}`;
}

/** 焦点距離（mm）を"50mm"のような文字列に変換する */
export function formatFocalLength(value: unknown): string | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return `${Math.round(value * 10) / 10}mm`;
}

/** Dateオブジェクトを"YYYY-MM-DD HH:mm:ss"形式の文字列に変換する（タイムゾーン変換は行わない） */
export function formatDateTime(value: unknown): string | undefined {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    return undefined;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`;
}

/** 緯度・経度（10進度数）を"35.658581, 139.745433"のような文字列に変換する */
export function formatGpsCoordinates(
  latitude: unknown,
  longitude: unknown,
): string | undefined {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return undefined;
  }
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

/** 文字列タグの末尾null文字・前後空白を除去する。空文字になった場合はundefinedを返す */
export function trimTagString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.replace(/\0+$/, '').trim();
  return trimmed === '' ? undefined : trimmed;
}

export interface ExifSummary {
  make?: string;
  model?: string;
  lensModel?: string;
  software?: string;
  dateTimeOriginal?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: number;
  focalLength?: string;
  flash?: boolean;
  whiteBalance?: WhiteBalanceKey;
  orientation?: OrientationKey;
  gpsCoordinates?: string;
}

/** exifrの`parse()`が返すタグオブジェクトから、表示用に整形したサマリーを組み立てる */
export function buildExifSummary(
  tags: Record<string, unknown> | undefined | null,
): ExifSummary {
  if (!tags) return {};
  return {
    make: trimTagString(tags.Make),
    model: trimTagString(tags.Model),
    lensModel: trimTagString(tags.LensModel),
    software: trimTagString(tags.Software),
    dateTimeOriginal: formatDateTime(tags.DateTimeOriginal ?? tags.CreateDate),
    exposureTime: formatExposureTime(tags.ExposureTime),
    fNumber: formatFNumber(tags.FNumber),
    iso: typeof tags.ISO === 'number' ? tags.ISO : undefined,
    focalLength: formatFocalLength(tags.FocalLength),
    flash: didFlashFire(tags.Flash),
    whiteBalance: getWhiteBalanceKey(tags.WhiteBalance),
    orientation: getOrientationKey(tags.Orientation),
    gpsCoordinates: formatGpsCoordinates(tags.latitude, tags.longitude),
  };
}

/** サマリーの項目が1つでも取得できたかどうか */
export function hasAnyExifField(summary: ExifSummary): boolean {
  return Object.values(summary).some((value) => value !== undefined);
}

export interface RawExifEntry {
  key: string;
  value: string;
}

function formatRawTagValue(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date) return formatDateTime(value);
  if (ArrayBuffer.isView(value)) return undefined; // バイナリ値（サムネイル等）は表示しない
  if (Array.isArray(value)) {
    if (value.length === 0) return undefined;
    return value.join(', ');
  }
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? String(value)
      : String(Math.round(value * 10000) / 10000);
  }
  if (typeof value === 'object') return undefined; // ネストした複雑な構造は非表示
  return String(value);
}

/** exifrの`parse()`が返すタグオブジェクトから、全項目を一覧表示するためのエントリー配列を組み立てる */
export function buildRawExifEntries(
  tags: Record<string, unknown> | undefined | null,
): RawExifEntry[] {
  if (!tags) return [];
  const entries: RawExifEntry[] = [];
  for (const [key, value] of Object.entries(tags)) {
    if (key === 'latitude' || key === 'longitude') continue; // GPS座標はサマリー側に表示するためスキップ
    const formatted = formatRawTagValue(value);
    if (formatted !== undefined) {
      entries.push({ key, value: formatted });
    }
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key));
}

// --- Exif削除（バイト列からAPP1のExifセグメントのみを取り除く） ---

const EXIF_IDENTIFIER = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"

export function isJpegBytes(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  );
}

function isExifApp1Segment(bytes: Uint8Array, contentStart: number): boolean {
  if (contentStart + EXIF_IDENTIFIER.length > bytes.length) return false;
  return EXIF_IDENTIFIER.every((b, i) => bytes[contentStart + i] === b);
}

/**
 * JPEGのバイト列から、Exif情報（APP1セグメントのうち"Exif\0\0"で始まるもの）だけを取り除く。
 * マーカーセグメントを走査して対象セグメントを飛ばすだけで、画像データの再圧縮は行わないため画質は劣化しない。
 * JPEGとして解釈できないバイト列を渡した場合は、そのまま返す。
 */
export function removeExifFromJpegBytes(
  bytes: Uint8Array,
): Uint8Array<ArrayBuffer> {
  if (!isJpegBytes(bytes)) return bytes as Uint8Array<ArrayBuffer>;

  const kept: number[] = [0xff, 0xd8]; // SOI
  let offset = 2;

  while (offset + 1 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      for (let i = offset; i < bytes.length; i++) kept.push(bytes[i]);
      break;
    }
    const marker = bytes[offset + 1];

    // SOS（スキャン開始）以降は画像本体データなので、そのままコピーして終了する
    if (marker === 0xda) {
      for (let i = offset; i < bytes.length; i++) kept.push(bytes[i]);
      break;
    }
    // 0xFF埋めのパディング、およびTEM(0x01)・RSTn(0xD0-0xD9)等の長さフィールドを持たないマーカー
    if (marker === 0xff) {
      kept.push(0xff);
      offset += 1;
      continue;
    }
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      kept.push(0xff, marker);
      offset += 2;
      if (marker === 0xd9) break; // EOI
      continue;
    }

    if (offset + 3 >= bytes.length) {
      for (let i = offset; i < bytes.length; i++) kept.push(bytes[i]);
      break;
    }
    const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
    if (length < 2) {
      // 長さフィールドが不正（自身の2バイトより短い）。これ以上マーカーとして解釈せず、末尾までそのまま保持する
      for (let i = offset; i < bytes.length; i++) kept.push(bytes[i]);
      break;
    }
    const segmentEnd = Math.min(offset + 2 + length, bytes.length);

    const isExifSegment =
      marker === 0xe1 && length >= 8 && isExifApp1Segment(bytes, offset + 4);

    if (!isExifSegment) {
      for (let i = offset; i < segmentEnd; i++) kept.push(bytes[i]);
    }
    offset = segmentEnd;
  }

  return Uint8Array.from(kept);
}

export interface RemoveExifResult {
  bytes: Uint8Array<ArrayBuffer>;
  hadExif: boolean;
}

/** Exif削除を行い、実際にExifセグメントが見つかって取り除かれたかどうかも合わせて返す */
export function removeExifFromJpeg(bytes: Uint8Array): RemoveExifResult {
  const result = removeExifFromJpegBytes(bytes);
  return { bytes: result, hadExif: result.length !== bytes.length };
}

/** 元のファイル名から、Exif削除後のファイル名を組み立てる（例: "photo.jpg" → "photo-no-exif.jpg"） */
export function buildNoExifFileName(originalName: string): string {
  const lastDot = originalName.lastIndexOf('.');
  const base = lastDot > 0 ? originalName.slice(0, lastDot) : originalName;
  const ext = lastDot > 0 ? originalName.slice(lastDot) : '.jpg';
  return `${base}-no-exif${ext}`;
}
