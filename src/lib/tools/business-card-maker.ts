import {
  buildFormattedName,
  buildVCard,
  type FnOrder,
  type VCardInput,
} from './vcard-generator';

/** 名刺の標準サイズ（mm、横向き） */
export const CARD_LONG_MM = 91;
export const CARD_SHORT_MM = 55;
/** A4（mm、縦向き） */
const A4_SHORT_MM = 210;
const A4_LONG_MM = 297;

export type Orientation = 'landscape' | 'portrait';
export type CardLayout = 'classic' | 'center' | 'band';
export type FontKind = 'sans' | 'serif';
export type QrContent = 'none' | 'vcard' | 'url';
export type PrintMode = 'a4' | 'single';

export interface CardOptions {
  orientation: Orientation;
  layout: CardLayout;
  font: FontKind;
  /** #rrggbb */
  accent: string;
  familyName: string;
  givenName: string;
  reading: string;
  company: string;
  department: string;
  title: string;
  postal: string;
  address: string;
  phone: string;
  mobile: string;
  email: string;
  url: string;
  qr: QrContent;
  qrSizeMm: number;
  nameSizeMm: number;
  bodySizeMm: number;
  mode: PrintMode;
  /** A4 に並べる枚数（1〜10） */
  count: number;
  showCutLines: boolean;
}

export const NAME_SIZE_MIN = 3;
export const NAME_SIZE_MAX = 9;
export const BODY_SIZE_MIN = 2;
export const BODY_SIZE_MAX = 4;
export const QR_SIZE_MIN = 12;
export const QR_SIZE_MAX = 30;
export const COUNT_MIN = 1;
export const COUNT_MAX = 10;
/** QRコードの周囲の余白（モジュール数）。名刺は面積が限られるため標準の4より狭くしている */
export const QR_QUIET_MODULES = 2;
/** 1モジュールの一辺がこれ未満だと、印刷したQRが読み取りにくい目安（mm） */
export const QR_MIN_MODULE_MM = 0.3;

export const DEFAULT_OPTIONS: CardOptions = {
  orientation: 'landscape',
  layout: 'classic',
  font: 'sans',
  accent: '#1d4ed8',
  familyName: '',
  givenName: '',
  reading: '',
  company: '',
  department: '',
  title: '',
  postal: '',
  address: '',
  phone: '',
  mobile: '',
  email: '',
  url: '',
  qr: 'vcard',
  qrSizeMm: 20,
  nameSizeMm: 5,
  bodySizeMm: 2.6,
  mode: 'a4',
  count: 10,
  showCutLines: true,
};

export type OptionsError =
  'nameSize' | 'bodySize' | 'qrSize' | 'count' | 'accent';

function inRange(value: number, min: number, max: number): boolean {
  return Number.isFinite(value) && value >= min && value <= max;
}

export function validateOptions(opts: CardOptions): OptionsError | null {
  if (!inRange(opts.nameSizeMm, NAME_SIZE_MIN, NAME_SIZE_MAX)) {
    return 'nameSize';
  }
  if (!inRange(opts.bodySizeMm, BODY_SIZE_MIN, BODY_SIZE_MAX)) {
    return 'bodySize';
  }
  if (!inRange(opts.qrSizeMm, QR_SIZE_MIN, QR_SIZE_MAX)) return 'qrSize';
  if (
    !Number.isInteger(opts.count) ||
    opts.count < COUNT_MIN ||
    opts.count > COUNT_MAX
  ) {
    return 'count';
  }
  if (!/^#[0-9a-fA-F]{6}$/.test(opts.accent)) return 'accent';
  return null;
}

/** 名刺1枚の寸法（mm） */
export function cardSize(orientation: Orientation): {
  widthMm: number;
  heightMm: number;
} {
  return orientation === 'landscape'
    ? { widthMm: CARD_LONG_MM, heightMm: CARD_SHORT_MM }
    : { widthMm: CARD_SHORT_MM, heightMm: CARD_LONG_MM };
}

export type PageName = 'bc-a4p' | 'bc-a4l' | 'bc-single-h' | 'bc-single-v';

export interface CardSlot {
  xMm: number;
  yMm: number;
}

export interface SheetLayout {
  pageName: PageName;
  widthMm: number;
  heightMm: number;
  cols: number;
  rows: number;
  /** 左上から行方向に並べた各名刺の位置 */
  slots: CardSlot[];
}

/**
 * 印刷面の構成を返す。A4 は横向き名刺なら縦向き用紙に2×5、縦向き名刺なら横向き用紙に5×2（どちらも10面）。
 * 面は用紙の中央に寄せ、隙間なく並べる。
 */
export function sheetLayout(
  orientation: Orientation,
  mode: PrintMode,
  count: number,
): SheetLayout {
  const card = cardSize(orientation);
  if (mode === 'single') {
    return {
      pageName: orientation === 'landscape' ? 'bc-single-h' : 'bc-single-v',
      widthMm: card.widthMm,
      heightMm: card.heightMm,
      cols: 1,
      rows: 1,
      slots: [{ xMm: 0, yMm: 0 }],
    };
  }
  const landscapePaper = orientation === 'portrait';
  const widthMm = landscapePaper ? A4_LONG_MM : A4_SHORT_MM;
  const heightMm = landscapePaper ? A4_SHORT_MM : A4_LONG_MM;
  const cols = Math.floor(widthMm / card.widthMm);
  const rows = Math.floor(heightMm / card.heightMm);
  const offsetX = (widthMm - cols * card.widthMm) / 2;
  const offsetY = (heightMm - rows * card.heightMm) / 2;
  const total = Math.max(0, Math.min(Math.floor(count), cols * rows));
  const slots: CardSlot[] = [];
  for (let i = 0; i < total; i++) {
    slots.push({
      xMm: offsetX + (i % cols) * card.widthMm,
      yMm: offsetY + Math.floor(i / cols) * card.heightMm,
    });
  }
  return {
    pageName: landscapePaper ? 'bc-a4l' : 'bc-a4p',
    widthMm,
    heightMm,
    cols,
    rows,
    slots,
  };
}

function t(value: string): string {
  return value.trim();
}

/** 1行テキストにする（改行・制御文字は空白にする） */
export function singleLine(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
}

export interface ContactLine {
  label: string;
  value: string;
}

export interface CardContent {
  name: string;
  reading: string;
  company: string;
  /** 部署・役職（空でないものを連結） */
  role: string;
  postal: string;
  address: string;
  contacts: ContactLine[];
}

/** 名刺に表示する内容を組み立てる。postalPrefix は郵便番号の前に付ける記号（日本語版は「〒」） */
export function buildCardContent(
  opts: CardOptions,
  fnOrder: FnOrder,
  postalPrefix: string,
): CardContent {
  const name = buildFormattedName(
    {
      familyName: singleLine(opts.familyName),
      givenName: singleLine(opts.givenName),
      organization: '',
    },
    fnOrder,
  );
  const postal = singleLine(opts.postal);
  const contacts: ContactLine[] = [];
  const add = (label: string, value: string) => {
    const v = singleLine(value);
    if (v !== '') contacts.push({ label, value: v });
  };
  add('TEL', opts.phone);
  add('MOBILE', opts.mobile);
  add('E-mail', opts.email);
  add('URL', opts.url);
  return {
    name,
    reading: singleLine(opts.reading),
    company: singleLine(opts.company),
    role: [singleLine(opts.department), singleLine(opts.title)]
      .filter((p) => p !== '')
      .join('　'),
    postal: postal === '' ? '' : `${postalPrefix}${postal}`,
    address: singleLine(opts.address),
    contacts,
  };
}

/** 名刺に印刷する内容が1つでもあるか */
export function hasContent(content: CardContent): boolean {
  return (
    content.name !== '' ||
    content.reading !== '' ||
    content.company !== '' ||
    content.role !== '' ||
    content.postal !== '' ||
    content.address !== '' ||
    content.contacts.length > 0
  );
}

/** URL を QR 用に整える。スキームが無ければ https:// を補う。空白を含む・http(s)以外は null */
export function normalizeUrl(value: string): string | null {
  const v = singleLine(value);
  if (v === '' || /\s/.test(v)) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const url = new URL(withScheme);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    return withScheme;
  } catch {
    return null;
  }
}

export function toVCardInput(opts: CardOptions): VCardInput {
  const urlValue = normalizeUrl(opts.url) ?? singleLine(opts.url);
  return {
    familyName: t(opts.familyName),
    givenName: t(opts.givenName),
    organization: t(opts.company),
    title: [t(opts.department), t(opts.title)]
      .filter((p) => p !== '')
      .join(' '),
    phones: [
      { type: 'WORK', number: opts.phone },
      { type: 'CELL', number: opts.mobile },
    ],
    emails: [opts.email],
    urls: [urlValue],
    address: {
      type: 'WORK',
      postalCode: opts.postal,
      region: '',
      city: '',
      street: opts.address,
      country: '',
    },
    note: '',
  };
}

export type QrPayload =
  { ok: true; text: string } | { ok: false; reason: 'none' | 'empty' };

/** QR に埋め込む文字列を返す。'none' は QR なし、'empty' は選んだ内容の元データが空 */
export function qrPayload(opts: CardOptions, fnOrder: FnOrder): QrPayload {
  if (opts.qr === 'none') return { ok: false, reason: 'none' };
  if (opts.qr === 'url') {
    const url = normalizeUrl(opts.url);
    return url === null
      ? { ok: false, reason: 'empty' }
      : { ok: true, text: url };
  }
  const result = buildVCard(toVCardInput(opts), { fnOrder });
  return result.ok
    ? { ok: true, text: result.qrText }
    : { ok: false, reason: 'empty' };
}

/** QR の SVG viewBox の一辺（余白込みのモジュール数） */
export function qrViewSize(moduleCount: number): number {
  return moduleCount + QR_QUIET_MODULES * 2;
}

/** 暗いモジュールを1本のパス（M x y h1 v1 h-1 z の連結）にする。余白込みの座標 */
export function qrSvgPath(
  moduleCount: number,
  isDark: (row: number, col: number) => boolean,
): string {
  const parts: string[] = [];
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (isDark(row, col)) {
        parts.push(
          `M${col + QR_QUIET_MODULES} ${row + QR_QUIET_MODULES}h1v1h-1z`,
        );
      }
    }
  }
  return parts.join('');
}

/** 指定の印刷サイズ（余白込みの一辺）での1モジュールの大きさ（mm） */
export function qrModuleMm(qrSizeMm: number, moduleCount: number): number {
  return qrSizeMm / qrViewSize(moduleCount);
}

/** 1モジュールが小さすぎて印刷後に読み取りにくい目安かどうか */
export function isQrModuleTooSmall(
  qrSizeMm: number,
  moduleCount: number,
): boolean {
  return qrModuleMm(qrSizeMm, moduleCount) < QR_MIN_MODULE_MM;
}

export const FONT_STACKS: Record<FontKind, string> = {
  sans: "'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Noto Sans JP', sans-serif",
  serif: "'Hiragino Mincho ProN', 'Yu Mincho', 'MS Mincho', serif",
};
