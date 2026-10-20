export type LinkKind = 'mailto' | 'tel' | 'sms';
export type SmsStyle = 'standard' | 'ios';

export interface MailtoInput {
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
}

export type LinkWarning =
  | { code: 'invalidEmail'; values: string[] }
  | { code: 'tooLong'; length: number };

export type LinkError = 'invalidPhone' | 'invalidExt' | 'emptyPhone';

export type LinkResult =
  | { ok: true; href: string; warnings: LinkWarning[] }
  | { ok: false; error: LinkError };

/** mailto の長さ警告のしきい値（古いブラウザ・メーラーで切れやすい目安） */
export const LONG_HREF_THRESHOLD = 2000;

/** カンマ・セミコロン・改行で区切って空要素を除く */
export function splitList(text: string): string[] {
  return text
    .split(/[,;\r\n]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

/** 改行を CRLF（%0D%0A になる）にそろえる */
export function normalizeCrlf(text: string): string {
  return text.replace(/\r\n|\r|\n/g, '\r\n');
}

function encodeAddress(addr: string): string {
  return encodeURIComponent(addr).replace(/%40/g, '@');
}

/** 簡易チェック: 空白なし・@ が1つ・前後が空でない・ドメインに . を含む */
export function isPlausibleEmail(addr: string): boolean {
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(addr);
}

function lengthWarnings(href: string): LinkWarning[] {
  return href.length > LONG_HREF_THRESHOLD
    ? [{ code: 'tooLong', length: href.length }]
    : [];
}

export function buildMailto(input: MailtoInput): LinkResult {
  const to = splitList(input.to);
  const cc = splitList(input.cc);
  const bcc = splitList(input.bcc);
  const invalid = [...to, ...cc, ...bcc].filter((a) => !isPlausibleEmail(a));

  const params: string[] = [];
  if (cc.length > 0) params.push(`cc=${cc.map(encodeAddress).join(',')}`);
  if (bcc.length > 0) params.push(`bcc=${bcc.map(encodeAddress).join(',')}`);
  if (input.subject !== '') {
    params.push(`subject=${encodeURIComponent(input.subject)}`);
  }
  if (input.body !== '') {
    params.push(`body=${encodeURIComponent(normalizeCrlf(input.body))}`);
  }

  const href =
    `mailto:${to.map(encodeAddress).join(',')}` +
    (params.length > 0 ? `?${params.join('&')}` : '');

  const warnings: LinkWarning[] = [];
  if (invalid.length > 0)
    warnings.push({ code: 'invalidEmail', values: invalid });
  warnings.push(...lengthWarnings(href));
  return { ok: true, href, warnings };
}

/** 電話番号を正規化する。全角は半角にし、空白を除く。不正なら null */
export function normalizePhone(raw: string): string | null {
  const s = raw.normalize('NFKC').replace(/\s+/g, '');
  if (!/^\+?[0-9().-]*[0-9][0-9().-]*$/.test(s)) return null;
  return s;
}

export function buildTel(number: string, ext: string): LinkResult {
  if (number.trim() === '') return { ok: false, error: 'emptyPhone' };
  const phone = normalizePhone(number);
  if (phone === null) return { ok: false, error: 'invalidPhone' };
  const extension = ext.normalize('NFKC').replace(/\s+/g, '');
  if (extension !== '' && !/^[0-9]+$/.test(extension)) {
    return { ok: false, error: 'invalidExt' };
  }
  const href = `tel:${phone}${extension !== '' ? `;ext=${extension}` : ''}`;
  return { ok: true, href, warnings: [] };
}

export function buildSms(
  numbers: string,
  body: string,
  style: SmsStyle = 'standard',
): LinkResult {
  const list = splitList(numbers);
  const normalized: string[] = [];
  for (const n of list) {
    const phone = normalizePhone(n);
    if (phone === null) return { ok: false, error: 'invalidPhone' };
    normalized.push(phone);
  }
  let href = `sms:${normalized.join(',')}`;
  if (body !== '') {
    const sep = style === 'ios' ? '&' : '?';
    href += `${sep}body=${encodeURIComponent(body.replace(/\r\n|\r/g, '\n'))}`;
  }
  return { ok: true, href, warnings: lengthWarnings(href) };
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** href 属性用に & などをエスケープしたアンカータグを返す */
export function buildAnchor(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}
