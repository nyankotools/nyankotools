export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

export const UTM_FIELDS = [
  'source',
  'medium',
  'campaign',
  'term',
  'content',
] as const;
export type UtmField = (typeof UTM_FIELDS)[number];

export interface UtmOptions {
  /** 値を小文字に統一する（GA4 は大文字小文字を区別するため） */
  lowercase: boolean;
}

export type UtmBuildError =
  'empty' | 'invalid' | 'missingScheme' | 'unsupportedScheme' | 'noParams';

export type UtmBuildResult =
  | {
      success: true;
      url: string;
      /** 既存の同名 utm_* を置き換えた場合、そのキー（例: utm_source） */
      replaced: string[];
    }
  | { success: false; error: UtmBuildError };

export interface UtmPreset {
  source: string;
  medium: string;
}

export const SOURCE_MEDIUM_PRESETS: UtmPreset[] = [
  { source: 'google', medium: 'cpc' },
  { source: 'yahoo', medium: 'cpc' },
  { source: 'facebook', medium: 'social' },
  { source: 'instagram', medium: 'social' },
  { source: 'x', medium: 'social' },
  { source: 'line', medium: 'social' },
  { source: 'youtube', medium: 'video' },
  { source: 'newsletter', medium: 'email' },
  { source: 'qr', medium: 'offline' },
];

export const CAMPAIGN_PRESETS: string[] = [
  'spring_sale',
  'summer_sale',
  'black_friday',
  'new_year_sale',
  'product_launch',
  'newsletter_weekly',
  'webinar',
  'brand_awareness',
];

export function emptyUtm(): UtmParams {
  return { source: '', medium: '', campaign: '', term: '', content: '' };
}

function utmKey(field: UtmField): string {
  return `utm_${field}`;
}

function normalizeValue(value: string, options: UtmOptions): string {
  const trimmed = value.trim();
  return options.lowercase ? trimmed.toLowerCase() : trimmed;
}

function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text.replace(/\+/g, ' '));
  } catch {
    return text;
  }
}

/** GA4 のキャンペーン集計に必要なのに未入力の項目 */
export function findMissingRecommended(utm: UtmParams): UtmField[] {
  return (['source', 'medium', 'campaign'] as const).filter(
    (f) => utm[f].trim() === '',
  );
}

/** 単一の URL を検証して URL オブジェクトにする */
export function parseTargetUrl(
  input: string,
): { success: true; url: URL } | { success: false; error: UtmBuildError } {
  const text = input.trim();
  if (text === '') return { success: false, error: 'empty' };
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    if (/^[^\s:/?#]+\.[^\s/?#]+/.test(text)) {
      return { success: false, error: 'missingScheme' };
    }
    return { success: false, error: 'invalid' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { success: false, error: 'unsupportedScheme' };
  }
  if (url.hostname === '') return { success: false, error: 'invalid' };
  return { success: true, url };
}

/**
 * URL に UTM パラメータを付ける。
 * 既存のクエリ（順序・エンコード）とフラグメントはそのまま保持し、
 * 値を指定した utm_* だけを置き換える（空欄の項目は既存の値を触らない）。
 */
export function buildUtmUrl(
  input: string,
  utm: UtmParams,
  options: UtmOptions = { lowercase: false },
): UtmBuildResult {
  const parsed = parseTargetUrl(input);
  if (!parsed.success) return parsed;
  const url = parsed.url;

  const additions: { key: string; value: string }[] = [];
  for (const field of UTM_FIELDS) {
    const value = normalizeValue(utm[field], options);
    if (value !== '') additions.push({ key: utmKey(field), value });
  }
  if (additions.length === 0) return { success: false, error: 'noParams' };

  const keys = new Set(additions.map((a) => a.key));
  const replaced: string[] = [];
  const kept: string[] = [];
  const rawQuery = url.search.replace(/^\?/, '');
  for (const segment of rawQuery.split('&')) {
    if (segment === '') continue;
    const key = safeDecode(segment.split('=')[0]);
    if (keys.has(key)) {
      if (!replaced.includes(key)) replaced.push(key);
    } else {
      kept.push(segment);
    }
  }
  const added = additions.map(
    (a) => `${a.key}=${encodeURIComponent(a.value.toWellFormed())}`,
  );
  const query = [...kept, ...added].join('&');

  url.search = '';
  const href = url.href;
  const hashIndex = href.indexOf('#');
  const head = hashIndex === -1 ? href : href.slice(0, hashIndex);
  const tail = hashIndex === -1 ? '' : href.slice(hashIndex);
  return { success: true, url: `${head}?${query}${tail}`, replaced };
}

/** URL に付いている utm_* を取り出す（履歴の読み込み用）。URL として不正なら null。 */
export function extractUtm(input: string): UtmParams | null {
  const parsed = parseTargetUrl(input);
  if (!parsed.success) return null;
  const utm = emptyUtm();
  for (const [key, value] of parsed.url.searchParams.entries()) {
    for (const field of UTM_FIELDS) {
      if (key === utmKey(field)) utm[field] = value;
    }
  }
  return utm;
}

export interface BulkItem {
  /** 入力の行（1始まり、空行も数える） */
  line: number;
  input: string;
  result: UtmBuildResult;
}

/** 1行1URLの入力をまとめて処理する。空行は無視する。 */
export function buildBulk(
  text: string,
  utm: UtmParams,
  options: UtmOptions = { lowercase: false },
): BulkItem[] {
  const items: BulkItem[] = [];
  text.split(/\r?\n/).forEach((raw, index) => {
    const input = raw.trim();
    if (input === '') return;
    items.push({
      line: index + 1,
      input,
      result: buildUtmUrl(input, utm, options),
    });
  });
  return items;
}

/** 成功した URL だけを改行区切りにする */
export function joinSuccessUrls(items: BulkItem[]): string {
  return items
    .flatMap((i) => (i.result.success ? [i.result.url] : []))
    .join('\n');
}

export interface HistoryEntry {
  url: string;
  at: number;
}

export const HISTORY_LIMIT = 20;

/** 履歴の先頭に追加する。同じ URL は先頭へ移動し、上限を超えた古いものを捨てる。 */
export function addHistory(
  history: HistoryEntry[],
  urls: string[],
  at: number,
  limit = HISTORY_LIMIT,
): HistoryEntry[] {
  let next = history;
  for (const url of urls) {
    next = [{ url, at }, ...next.filter((e) => e.url !== url)];
  }
  return next.slice(0, limit);
}

/** localStorage から読んだ文字列を安全に履歴へ復元する（壊れたデータは捨てる） */
export function parseHistory(
  json: string | null,
  limit = HISTORY_LIMIT,
): HistoryEntry[] {
  if (!json) return [];
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  const entries: HistoryEntry[] = [];
  for (const item of data) {
    if (
      item !== null &&
      typeof item === 'object' &&
      typeof (item as HistoryEntry).url === 'string' &&
      typeof (item as HistoryEntry).at === 'number' &&
      (item as HistoryEntry).url !== ''
    ) {
      entries.push({
        url: (item as HistoryEntry).url,
        at: (item as HistoryEntry).at,
      });
    }
  }
  return entries.slice(0, limit);
}

export function serializeHistory(history: HistoryEntry[]): string {
  return JSON.stringify(history);
}
