export const EXTRACT_TYPES = [
  'email',
  'url',
  'phone',
  'date',
  'ipv4',
  'postal',
  'hashtag',
] as const;

export type ExtractType = (typeof EXTRACT_TYPES)[number];

export interface ExtractOptions {
  types: readonly ExtractType[];
  /** 重複を除去する */
  unique: boolean;
  /** 重複判定で英字の大小を区別しない */
  ignoreCase: boolean;
  /** 昇順に並べ替える（false なら出現順） */
  sort: boolean;
}

export interface ExtractedItem {
  type: ExtractType;
  value: string;
  /** 入力テキスト内の開始位置 */
  index: number;
}

export interface ExtractResult {
  items: ExtractedItem[];
  /** 種類ごとの件数（重複除去後） */
  counts: Record<ExtractType, number>;
  /** 重複除去前の総検出数 */
  totalFound: number;
}

/**
 * すべて量指定子に上限を設けた単純な正規表現。ネストした量指定子を持たないため、
 * 長い入力でも破滅的バックトラック（ReDoS）を起こさない。
 */
const PATTERNS: Record<ExtractType, RegExp> = {
  email:
    /[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]{1,63}(?:\.[A-Za-z0-9-]{1,63}){0,10}\.[A-Za-z]{2,24}/g,
  // ASCII の URL 文字のみ。日本語の文章に直接つながる URL でも文字種の境目で止まる
  url: /https?:\/\/[A-Za-z0-9\-._~:/?#[\]@!$&'()*+,;=%]{1,2000}/g,
  phone:
    /(?<![\d+-])(?:\+\d{1,3}[- ]?\d{1,4}|0\d{1,4})-\d{1,4}-\d{3,4}(?!\d)|(?<!\d)0[5789]0\d{8}(?!\d)/g,
  date: /(?<!\d)(?:(?:19|20)\d{2}[-/.](?:0?[1-9]|1[0-2])[-/.](?:0?[1-9]|[12]\d|3[01])|(?:19|20)\d{2}年 ?(?:0?[1-9]|1[0-2])月 ?(?:0?[1-9]|[12]\d|3[01])日)(?!\d)/g,
  ipv4: /(?<![\d.])(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?!\.?\d)/g,
  postal: /〒? ?(?<![\d-])\d{3}-\d{4}(?![\d-])/g,
  hashtag: /(?<![\p{L}\p{N}_#＃&])[#＃][\p{L}\p{N}_]{1,100}/gu,
};

/** 同じ位置を取り合うときの優先順位（先に処理した種類が勝つ） */
const PRIORITY: readonly ExtractType[] = [
  'url',
  'email',
  'date',
  'ipv4',
  'phone',
  'postal',
  'hashtag',
];

const TRAILING_URL_CHARS = /[.,;:!?'"*]+$/;

/** URL 末尾の句読点や、対応する開き括弧のない閉じ括弧を取り除く */
export function trimUrl(url: string): string {
  let result = url;
  for (;;) {
    const before = result;
    result = result.replace(TRAILING_URL_CHARS, '');
    if (result.endsWith(')') && !result.includes('(')) {
      result = result.slice(0, -1);
    }
    if (result.endsWith(']') && !result.includes('[')) {
      result = result.slice(0, -1);
    }
    if (result === before) return result;
  }
}

function isValidHashtag(tag: string): boolean {
  // 数字だけのタグ（#1 など）は除く
  return /\p{L}/u.test(tag);
}

function normalize(type: ExtractType, value: string): string {
  if (type === 'postal') return value.replace(/[〒 ]/g, '');
  return value;
}

/** 入力テキストから指定した種類の文字列を抽出する */
export function extractFromText(
  text: string,
  options: ExtractOptions,
): ExtractResult {
  const counts = Object.fromEntries(EXTRACT_TYPES.map((t) => [t, 0])) as Record<
    ExtractType,
    number
  >;
  const enabled = new Set(options.types);
  const used = new Uint8Array(text.length);
  const found: ExtractedItem[] = [];

  for (const type of PRIORITY) {
    if (!enabled.has(type)) continue;
    const regex = new RegExp(PATTERNS[type].source, PATTERNS[type].flags);
    for (const match of text.matchAll(regex)) {
      let raw = match[0];
      const index = match.index ?? 0;
      if (type === 'url') raw = trimUrl(raw);
      if (raw.length === 0) continue;
      if (type === 'hashtag' && !isValidHashtag(raw)) continue;
      let overlaps = false;
      for (let i = index; i < index + raw.length; i++) {
        if (used[i]) {
          overlaps = true;
          break;
        }
      }
      if (overlaps) continue;
      used.fill(1, index, index + raw.length);
      found.push({ type, value: normalize(type, raw), index });
    }
  }

  found.sort((a, b) => a.index - b.index);
  const totalFound = found.length;

  let items = found;
  if (options.unique) {
    const seen = new Set<string>();
    items = found.filter((item) => {
      const key = `${item.type}\u0000${
        options.ignoreCase ? item.value.toLowerCase() : item.value
      }`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  if (options.sort) {
    items = [...items].sort((a, b) =>
      a.value < b.value ? -1 : a.value > b.value ? 1 : a.index - b.index,
    );
  }

  for (const item of items) counts[item.type]++;
  return { items, counts, totalFound };
}

export type JoinMode = 'newline' | 'comma' | 'tab';

const SEPARATORS: Record<JoinMode, string> = {
  newline: '\n',
  comma: ', ',
  tab: '\t',
};

/** 抽出結果を区切り文字でつないだ文字列にする */
export function formatItems(
  items: readonly ExtractedItem[],
  mode: JoinMode,
): string {
  return items.map((item) => item.value).join(SEPARATORS[mode]);
}
