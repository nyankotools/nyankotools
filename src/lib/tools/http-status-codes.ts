/**
 * HTTPステータスコード一覧の静的データと検索ロジック。
 * 表示文言（名称・意味・原因・対処）は i18n 辞書側で持つ。ここには
 * プロトコル上の定数（コード・標準フレーズ・仕様の出典）だけを置く。
 */

export interface StatusCodeInfo {
  code: number;
  /** 標準のreason phrase（英語・全ロケール共通） */
  phrase: string;
  /** 主な仕様の出典 */
  rfc: string;
}

export const STATUS_CODES = [
  { code: 100, phrase: 'Continue', rfc: 'RFC 9110 §15.2.1' },
  { code: 101, phrase: 'Switching Protocols', rfc: 'RFC 9110 §15.2.2' },
  { code: 102, phrase: 'Processing', rfc: 'RFC 2518' },
  { code: 103, phrase: 'Early Hints', rfc: 'RFC 8297' },
  { code: 200, phrase: 'OK', rfc: 'RFC 9110 §15.3.1' },
  { code: 201, phrase: 'Created', rfc: 'RFC 9110 §15.3.2' },
  { code: 202, phrase: 'Accepted', rfc: 'RFC 9110 §15.3.3' },
  {
    code: 203,
    phrase: 'Non-Authoritative Information',
    rfc: 'RFC 9110 §15.3.4',
  },
  { code: 204, phrase: 'No Content', rfc: 'RFC 9110 §15.3.5' },
  { code: 205, phrase: 'Reset Content', rfc: 'RFC 9110 §15.3.6' },
  { code: 206, phrase: 'Partial Content', rfc: 'RFC 9110 §15.3.7' },
  { code: 207, phrase: 'Multi-Status', rfc: 'RFC 4918' },
  { code: 208, phrase: 'Already Reported', rfc: 'RFC 5842' },
  { code: 226, phrase: 'IM Used', rfc: 'RFC 3229' },
  { code: 300, phrase: 'Multiple Choices', rfc: 'RFC 9110 §15.4.1' },
  { code: 301, phrase: 'Moved Permanently', rfc: 'RFC 9110 §15.4.2' },
  { code: 302, phrase: 'Found', rfc: 'RFC 9110 §15.4.3' },
  { code: 303, phrase: 'See Other', rfc: 'RFC 9110 §15.4.4' },
  { code: 304, phrase: 'Not Modified', rfc: 'RFC 9110 §15.4.5' },
  { code: 305, phrase: 'Use Proxy', rfc: 'RFC 9110 §15.4.6' },
  { code: 307, phrase: 'Temporary Redirect', rfc: 'RFC 9110 §15.4.8' },
  { code: 308, phrase: 'Permanent Redirect', rfc: 'RFC 9110 §15.4.9' },
  { code: 400, phrase: 'Bad Request', rfc: 'RFC 9110 §15.5.1' },
  { code: 401, phrase: 'Unauthorized', rfc: 'RFC 9110 §15.5.2' },
  { code: 402, phrase: 'Payment Required', rfc: 'RFC 9110 §15.5.3' },
  { code: 403, phrase: 'Forbidden', rfc: 'RFC 9110 §15.5.4' },
  { code: 404, phrase: 'Not Found', rfc: 'RFC 9110 §15.5.5' },
  { code: 405, phrase: 'Method Not Allowed', rfc: 'RFC 9110 §15.5.6' },
  { code: 406, phrase: 'Not Acceptable', rfc: 'RFC 9110 §15.5.7' },
  {
    code: 407,
    phrase: 'Proxy Authentication Required',
    rfc: 'RFC 9110 §15.5.8',
  },
  { code: 408, phrase: 'Request Timeout', rfc: 'RFC 9110 §15.5.9' },
  { code: 409, phrase: 'Conflict', rfc: 'RFC 9110 §15.5.10' },
  { code: 410, phrase: 'Gone', rfc: 'RFC 9110 §15.5.11' },
  { code: 411, phrase: 'Length Required', rfc: 'RFC 9110 §15.5.12' },
  { code: 412, phrase: 'Precondition Failed', rfc: 'RFC 9110 §15.5.13' },
  { code: 413, phrase: 'Content Too Large', rfc: 'RFC 9110 §15.5.14' },
  { code: 414, phrase: 'URI Too Long', rfc: 'RFC 9110 §15.5.15' },
  {
    code: 415,
    phrase: 'Unsupported Media Type',
    rfc: 'RFC 9110 §15.5.16',
  },
  { code: 416, phrase: 'Range Not Satisfiable', rfc: 'RFC 9110 §15.5.17' },
  { code: 417, phrase: 'Expectation Failed', rfc: 'RFC 9110 §15.5.18' },
  { code: 418, phrase: "I'm a teapot", rfc: 'RFC 2324' },
  { code: 421, phrase: 'Misdirected Request', rfc: 'RFC 9110 §15.5.20' },
  { code: 422, phrase: 'Unprocessable Content', rfc: 'RFC 9110 §15.5.21' },
  { code: 423, phrase: 'Locked', rfc: 'RFC 4918' },
  { code: 424, phrase: 'Failed Dependency', rfc: 'RFC 4918' },
  { code: 425, phrase: 'Too Early', rfc: 'RFC 8470' },
  { code: 426, phrase: 'Upgrade Required', rfc: 'RFC 9110 §15.5.22' },
  { code: 428, phrase: 'Precondition Required', rfc: 'RFC 6585' },
  { code: 429, phrase: 'Too Many Requests', rfc: 'RFC 6585' },
  {
    code: 431,
    phrase: 'Request Header Fields Too Large',
    rfc: 'RFC 6585',
  },
  {
    code: 451,
    phrase: 'Unavailable For Legal Reasons',
    rfc: 'RFC 7725',
  },
  { code: 500, phrase: 'Internal Server Error', rfc: 'RFC 9110 §15.6.1' },
  { code: 501, phrase: 'Not Implemented', rfc: 'RFC 9110 §15.6.2' },
  { code: 502, phrase: 'Bad Gateway', rfc: 'RFC 9110 §15.6.3' },
  { code: 503, phrase: 'Service Unavailable', rfc: 'RFC 9110 §15.6.4' },
  { code: 504, phrase: 'Gateway Timeout', rfc: 'RFC 9110 §15.6.5' },
  {
    code: 505,
    phrase: 'HTTP Version Not Supported',
    rfc: 'RFC 9110 §15.6.6',
  },
  { code: 506, phrase: 'Variant Also Negotiates', rfc: 'RFC 2295' },
  { code: 507, phrase: 'Insufficient Storage', rfc: 'RFC 4918' },
  { code: 508, phrase: 'Loop Detected', rfc: 'RFC 5842' },
  { code: 510, phrase: 'Not Extended', rfc: 'RFC 2774' },
  {
    code: 511,
    phrase: 'Network Authentication Required',
    rfc: 'RFC 6585',
  },
] as const satisfies readonly StatusCodeInfo[];

export type StatusCodeNumber = (typeof STATUS_CODES)[number]['code'];

export const STATUS_CATEGORIES = ['1xx', '2xx', '3xx', '4xx', '5xx'] as const;
export type StatusCategory = (typeof STATUS_CATEGORIES)[number];
export type CategoryFilter = StatusCategory | 'all';

/** コードの分類（1xx〜5xx）。範囲外は null */
export function categoryOf(code: number): StatusCategory | null {
  if (!Number.isInteger(code) || code < 100 || code > 599) return null;
  return `${Math.floor(code / 100)}xx` as StatusCategory;
}

/** 全角英数・大文字小文字を揃えて前後の空白を除く */
export function normalizeQuery(query: string): string {
  return query.normalize('NFKC').toLowerCase().trim();
}

/**
 * 検索語がコード・説明文に一致するか。
 * 空白区切りの各語がすべて一致（AND）した場合に true。
 * - 数字のみの語: コードの前方一致（`40` → 400〜409、`404` → 404）
 * - `4xx` / `4XX`: 分類の一致
 * - それ以外: haystack（名称・説明など）への部分一致（大文字小文字無視）
 */
export function matchesStatus(
  code: number,
  haystack: string,
  query: string,
  category: CategoryFilter = 'all',
): boolean {
  if (category !== 'all' && categoryOf(code) !== category) return false;
  const q = normalizeQuery(query);
  if (q === '') return true;
  const text = haystack.normalize('NFKC').toLowerCase();
  const codeText = String(code);
  return q.split(/\s+/).every((token) => {
    if (/^\d+$/.test(token)) return codeText.startsWith(token);
    if (/^[1-5]xx$/.test(token)) return categoryOf(code) === token;
    return text.includes(token) || codeText.includes(token);
  });
}
