export type CodeKind = 'isbn10' | 'ean13' | 'ean8';
export type CheckError = 'empty' | 'chars' | 'length';

export interface CheckSuccess {
  ok: true;
  kind: CodeKind;
  /** ハイフン・空白除去後の入力 */
  normalized: string;
  /** チェックデジットを含む入力か */
  hasCheck: boolean;
  /** チェックデジットを含む場合の検証結果（含まない場合は true） */
  valid: boolean;
  /** 正しいチェックデジット */
  checkDigit: string;
  /** 正しいチェックデジット付きの完全なコード */
  completed: string;
  /** ISBN-13（ISBNとして扱える場合） */
  isbn13?: string;
  /** ISBN-10（978始まりのISBN-13、またはISBN-10の場合） */
  isbn10?: string;
  /** 13桁コードの先頭3桁がISBN用(978/979)か */
  isbnPrefix?: '978' | '979';
  /** 日本国内で割り当てられた接頭辞（45/49）か */
  japanJan?: boolean;
}

export interface CheckFailure {
  ok: false;
  error: CheckError;
}

export type CheckResult = CheckSuccess | CheckFailure;

/** 全角英数を半角にし、ハイフン類・空白を除去して大文字化する。 */
export function normalizeCode(input: string): string {
  return input
    .replace(/[０-９Ａ-Ｚａ-ｚ]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .replace(/[\s\-‐-―−－ー]/g, '')
    .toUpperCase();
}

/** EAN/JAN/ISBN-13 のチェックデジット。body は check を除く数字列。 */
export function eanCheckDigit(body: string): string {
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    // 右端（check の直前）の重みが3
    const weight = (body.length - i) % 2 === 1 ? 3 : 1;
    sum += Number(body[i]) * weight;
  }
  return String((10 - (sum % 10)) % 10);
}

/** ISBN-10 のチェックデジット。body は先頭9桁。 */
export function isbn10CheckDigit(body: string): string {
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(body[i]) * (10 - i);
  const check = (11 - (sum % 11)) % 11;
  return check === 10 ? 'X' : String(check);
}

export function isbn10To13(isbn10: string): string {
  const body = '978' + isbn10.slice(0, 9);
  return body + eanCheckDigit(body);
}

/** 978 始まりの13桁（先頭12桁以上）を ISBN-10 に変換する。 */
export function isbn13To10(isbn13: string): string | null {
  if (!isbn13.startsWith('978')) return null;
  const body = isbn13.slice(3, 12);
  return body + isbn10CheckDigit(body);
}

function isJapanPrefix(code: string): boolean {
  return code.startsWith('45') || code.startsWith('49');
}

export function checkCode(input: string): CheckResult {
  const code = normalizeCode(input);
  if (code === '') return { ok: false, error: 'empty' };
  if (!/^[0-9]+X?$/.test(code)) return { ok: false, error: 'chars' };
  const len = code.length;

  if (len === 9 || len === 10) {
    // X は ISBN-10 の末尾のみ
    if (code.endsWith('X') && len !== 10) return { ok: false, error: 'chars' };
    const body = code.slice(0, 9);
    const checkDigit = isbn10CheckDigit(body);
    const hasCheck = len === 10;
    const valid = !hasCheck || code[9] === checkDigit;
    const isbn10 = body + checkDigit;
    return {
      ok: true,
      kind: 'isbn10',
      normalized: code,
      hasCheck,
      valid,
      checkDigit,
      completed: isbn10,
      isbn10,
      isbn13: isbn10To13(isbn10),
    };
  }

  if (code.endsWith('X')) return { ok: false, error: 'chars' };

  if (len === 12 || len === 13) {
    const body = code.slice(0, 12);
    const checkDigit = eanCheckDigit(body);
    const completed = body + checkDigit;
    const hasCheck = len === 13;
    const prefix = body.slice(0, 3);
    const result: CheckSuccess = {
      ok: true,
      kind: 'ean13',
      normalized: code,
      hasCheck,
      valid: !hasCheck || code[12] === checkDigit,
      checkDigit,
      completed,
    };
    if (prefix === '978' || prefix === '979') {
      result.isbnPrefix = prefix;
      result.isbn13 = completed;
      if (prefix === '978') result.isbn10 = isbn13To10(completed) ?? undefined;
    }
    if (isJapanPrefix(body)) result.japanJan = true;
    return result;
  }

  if (len === 7 || len === 8) {
    const body = code.slice(0, 7);
    const checkDigit = eanCheckDigit(body);
    return {
      ok: true,
      kind: 'ean8',
      normalized: code,
      hasCheck: len === 8,
      valid: len === 7 || code[7] === checkDigit,
      checkDigit,
      completed: body + checkDigit,
    };
  }

  return { ok: false, error: 'length' };
}
