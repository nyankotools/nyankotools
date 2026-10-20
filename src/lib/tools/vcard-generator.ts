export type PhoneType = 'CELL' | 'WORK' | 'HOME' | 'FAX';
export type AddressType = 'HOME' | 'WORK';
export type FnOrder = 'family-given' | 'given-family';

export interface VCardPhone {
  type: PhoneType;
  number: string;
}

export interface VCardAddress {
  type: AddressType;
  postalCode: string;
  region: string;
  city: string;
  street: string;
  country: string;
}

export interface VCardInput {
  familyName: string;
  givenName: string;
  organization: string;
  title: string;
  phones: VCardPhone[];
  emails: string[];
  urls: string[];
  address: VCardAddress;
  note: string;
}

export type VCardWarning = 'email-invalid' | 'url-invalid';

export type VCardResult =
  | { ok: false; reason: 'empty' }
  | {
      ok: true;
      /** .vcf 保存用（75オクテットで折り返し済み・CRLF） */
      vcard: string;
      /** QR化用（折り返しなし・CRLF）。短いほどQRが読み取りやすい */
      qrText: string;
      warnings: VCardWarning[];
    };

export interface BuildOptions {
  fnOrder?: FnOrder;
}

export const emptyAddress: VCardAddress = {
  type: 'HOME',
  postalCode: '',
  region: '',
  city: '',
  street: '',
  country: '',
};

const CRLF = '\r\n';
const MAX_OCTETS = 75;

/** vCard 3.0 の TEXT 値のエスケープ（バックスラッシュ・セミコロン・カンマ・改行） */
export function escapeText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

const encoder = new TextEncoder();

/** 1行を75オクテット以内に折り返す（継続行は先頭に半角スペース、文字の途中では切らない） */
export function foldLine(line: string): string {
  if (encoder.encode(line).length <= MAX_OCTETS) return line;
  const parts: string[] = [];
  let current = '';
  let currentBytes = 0;
  let limit = MAX_OCTETS;
  for (const ch of line) {
    const bytes = encoder.encode(ch).length;
    if (currentBytes + bytes > limit) {
      parts.push(current);
      current = '';
      currentBytes = 0;
      limit = MAX_OCTETS - 1;
    }
    current += ch;
    currentBytes += bytes;
  }
  parts.push(current);
  return parts.join(CRLF + ' ');
}

function clean(value: string): string {
  return value.trim();
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/** URL・電話番号などの値から改行と制御文字を取り除く（行の注入を防ぐ） */
function singleLine(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim();
}

/** 表示名（FN）を組み立てる。姓名が無ければ組織名にフォールバックする */
export function buildFormattedName(
  input: Pick<VCardInput, 'familyName' | 'givenName' | 'organization'>,
  fnOrder: FnOrder = 'family-given',
): string {
  const family = clean(input.familyName);
  const given = clean(input.givenName);
  const parts = fnOrder === 'family-given' ? [family, given] : [given, family];
  const name = parts.filter((p) => p !== '').join(' ');
  return name !== '' ? name : clean(input.organization);
}

function buildLines(
  input: VCardInput,
  options: BuildOptions,
): { lines: string[]; warnings: VCardWarning[] } | null {
  const fn = buildFormattedName(input, options.fnOrder);
  const phones = input.phones
    .map((p) => ({ type: p.type, number: singleLine(p.number) }))
    .filter((p) => p.number !== '');
  const emails = input.emails.map(singleLine).filter((e) => e !== '');
  const urls = input.urls.map(singleLine).filter((u) => u !== '');
  const a = input.address;
  const addressParts = [
    '',
    '',
    clean(a.street),
    clean(a.city),
    clean(a.region),
    clean(a.postalCode),
    clean(a.country),
  ];
  const hasAddress = addressParts.some((p) => p !== '');
  const org = clean(input.organization);
  const title = clean(input.title);
  const note = input.note.trim();
  const family = clean(input.familyName);
  const given = clean(input.givenName);

  const hasContent =
    fn !== '' ||
    phones.length > 0 ||
    emails.length > 0 ||
    urls.length > 0 ||
    hasAddress ||
    org !== '' ||
    title !== '' ||
    note !== '';
  if (!hasContent) return null;

  const warnings: VCardWarning[] = [];
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  // 3.0 では N と FN が必須。名前が全く無いときは FN を空にせず N も空で出す
  lines.push(`N:${escapeText(family)};${escapeText(given)};;;`);
  lines.push(`FN:${escapeText(fn)}`);
  if (org !== '') lines.push(`ORG:${escapeText(org)}`);
  if (title !== '') lines.push(`TITLE:${escapeText(title)}`);
  for (const p of phones) {
    lines.push(`TEL;TYPE=${p.type}:${escapeText(p.number)}`);
  }
  for (const e of emails) {
    if (!EMAIL_PATTERN.test(e) && !warnings.includes('email-invalid')) {
      warnings.push('email-invalid');
    }
    lines.push(`EMAIL;TYPE=INTERNET:${escapeText(e)}`);
  }
  for (const u of urls) {
    if (!isValidUrl(u) && !warnings.includes('url-invalid')) {
      warnings.push('url-invalid');
    }
    // URL は URI 型なのでエスケープしない（改行は除去済み）
    lines.push(`URL:${u}`);
  }
  if (hasAddress) {
    lines.push(`ADR;TYPE=${a.type}:${addressParts.map(escapeText).join(';')}`);
  }
  if (note !== '') lines.push(`NOTE:${escapeText(note)}`);
  lines.push('END:VCARD');
  return { lines, warnings };
}

/** vCard 3.0 を生成する。何も入力されていなければ ok: false */
export function buildVCard(
  input: VCardInput,
  options: BuildOptions = {},
): VCardResult {
  const built = buildLines(input, options);
  if (!built) return { ok: false, reason: 'empty' };
  return {
    ok: true,
    vcard: built.lines.map(foldLine).join(CRLF) + CRLF,
    qrText: built.lines.join(CRLF),
    warnings: built.warnings,
  };
}

/** 保存ファイル名（.vcf）。ファイル名に使えない文字は除く */
export function vcardFileName(name: string): string {
  const base = name
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .replace(/\s+/g, '_');
  return `${base === '' ? 'contact' : base}.vcf`;
}

/** QRの一辺のモジュール数がこの値以上だと細かくなり、読み取りにくくなる目安（バージョン12相当） */
export const DENSE_MODULE_COUNT = 65;
