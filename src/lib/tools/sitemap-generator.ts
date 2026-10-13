export const CHANGEFREQ_VALUES = [
  'always',
  'hourly',
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'never',
] as const;
export type ChangeFreq = (typeof CHANGEFREQ_VALUES)[number];

/** sitemaps.org の1ファイルあたりの上限 */
export const MAX_URLS_PER_FILE = 50_000;
export const MAX_BYTES_PER_FILE = 52_428_800; // 50MiB（非圧縮）
const MAX_URL_LENGTH = 2048;

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: string;
}

export type IssueReason =
  | 'invalid-url'
  | 'unsupported-scheme'
  | 'too-long'
  | 'duplicate'
  | 'invalid-option';

export interface SitemapIssue {
  /** 1始まりの行番号 */
  line: number;
  text: string;
  reason: IssueReason;
  /** invalid-option のときの原因トークン */
  token?: string;
}

export interface SitemapDefaults {
  lastmod: string;
  changefreq: string;
  priority: string;
}

export interface ParseResult {
  entries: SitemapEntry[];
  issues: SitemapIssue[];
  /** 出現したホスト名（sitemapは同一ホストのURLのみ含められる） */
  hosts: string[];
  /** 既定値のうち不正で無視したもの */
  invalidDefaults: (keyof SitemapDefaults)[];
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** ローカル日付を YYYY-MM-DD にする */
export function formatDate(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isRealDate(y: number, m: number, d: number): boolean {
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/** W3C Datetime（YYYY / YYYY-MM / YYYY-MM-DD / 時刻付き）として有効か */
export function isValidLastmod(value: string): boolean {
  const m =
    /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2}))?)?)?$/.exec(
      value,
    );
  if (!m) return false;
  const month = m[2] ? Number(m[2]) : 1;
  if (month < 1 || month > 12) return false;
  if (m[3]) {
    if (!isRealDate(Number(m[1]), month, Number(m[3]))) return false;
  }
  if (m[4] !== undefined) {
    if (Number(m[4]) > 23 || Number(m[5]) > 59) return false;
    if (m[6] !== undefined && Number(m[6]) > 59) return false;
  }
  return true;
}

export function isChangeFreq(value: string): value is ChangeFreq {
  return (CHANGEFREQ_VALUES as readonly string[]).includes(value);
}

/** 0.0〜1.0 の数値文字列を正規化する。不正なら undefined */
export function normalizePriority(value: string): string | undefined {
  const v = value.trim();
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(v)) return undefined;
  const n = Number(v);
  if (!(n >= 0 && n <= 1)) return undefined;
  return Number.isInteger(n * 10) ? n.toFixed(1) : String(n);
}

type NormalizedUrl =
  | { ok: true; href: string; host: string }
  | { ok: false; reason: 'invalid-url' | 'unsupported-scheme' | 'too-long' };

function normalizeUrl(raw: string): NormalizedUrl {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: 'invalid-url' };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    // host:port/path は scheme と誤解釈されるので無効URL扱いにする
    if (/^[^:/]+:\d/.test(raw)) return { ok: false, reason: 'invalid-url' };
    return { ok: false, reason: 'unsupported-scheme' };
  }
  if (!url.hostname) return { ok: false, reason: 'invalid-url' };
  url.hash = '';
  if (url.href.length > MAX_URL_LENGTH) {
    return { ok: false, reason: 'too-long' };
  }
  return { ok: true, href: url.href, host: url.host };
}

/**
 * 1行1URLのテキストを解析する。
 * 行は `URL [lastmod] [changefreq] [priority]`（空白区切り・順不同）で個別に上書きできる。
 * 空行と `#` で始まる行は無視する。
 */
export function parseSitemapInput(
  text: string,
  defaults: SitemapDefaults,
): ParseResult {
  const invalidDefaults: (keyof SitemapDefaults)[] = [];
  let defLastmod: string | undefined;
  let defFreq: ChangeFreq | undefined;
  let defPriority: string | undefined;

  const dl = defaults.lastmod.trim();
  if (dl) {
    if (isValidLastmod(dl)) defLastmod = dl;
    else invalidDefaults.push('lastmod');
  }
  const df = defaults.changefreq.trim().toLowerCase();
  if (df) {
    if (isChangeFreq(df)) defFreq = df;
    else invalidDefaults.push('changefreq');
  }
  const dp = defaults.priority.trim();
  if (dp) {
    defPriority = normalizePriority(dp);
    if (defPriority === undefined) invalidDefaults.push('priority');
  }

  const entries: SitemapEntry[] = [];
  const issues: SitemapIssue[] = [];
  const seen = new Set<string>();
  const hosts: string[] = [];

  const lines = text.split(/\r\n|\r|\n/);
  lines.forEach((rawLine, index) => {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) return;
    const lineNo = index + 1;
    const [urlPart, ...tokens] = line.split(/\s+/);

    const normalized = normalizeUrl(urlPart);
    if (!normalized.ok) {
      issues.push({ line: lineNo, text: urlPart, reason: normalized.reason });
      return;
    }

    let lastmod = defLastmod;
    let changefreq = defFreq;
    let priority = defPriority;
    for (const token of tokens) {
      if (/^\d{4}(?:-|$)/.test(token)) {
        if (!isValidLastmod(token)) {
          issues.push({
            line: lineNo,
            text: urlPart,
            reason: 'invalid-option',
            token,
          });
          return;
        }
        lastmod = token;
        continue;
      }
      const lower = token.toLowerCase();
      if (isChangeFreq(lower)) {
        changefreq = lower;
        continue;
      }
      const p = normalizePriority(token);
      if (p !== undefined) {
        priority = p;
        continue;
      }
      issues.push({
        line: lineNo,
        text: urlPart,
        reason: 'invalid-option',
        token,
      });
      return;
    }

    if (seen.has(normalized.href)) {
      issues.push({ line: lineNo, text: urlPart, reason: 'duplicate' });
      return;
    }
    seen.add(normalized.href);
    if (!hosts.includes(normalized.host)) hosts.push(normalized.host);

    const entry: SitemapEntry = { loc: normalized.href };
    if (lastmod) entry.lastmod = lastmod;
    if (changefreq) entry.changefreq = changefreq;
    if (priority) entry.priority = priority;
    entries.push(entry);
  });

  return { entries, issues, hosts, invalidDefaults };
}

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const URLSET_OPEN =
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
const INDEX_OPEN =
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

function entryXml(entry: SitemapEntry): string {
  const lines = ['  <url>', `    <loc>${escapeXml(entry.loc)}</loc>`];
  if (entry.lastmod) {
    lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
  }
  if (entry.changefreq) {
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
  }
  if (entry.priority) {
    lines.push(`    <priority>${escapeXml(entry.priority)}</priority>`);
  }
  lines.push('  </url>');
  return lines.join('\n');
}

export function buildUrlset(entries: SitemapEntry[]): string {
  return [
    XML_DECLARATION,
    URLSET_OPEN,
    ...entries.map(entryXml),
    '</urlset>',
    '',
  ].join('\n');
}

export function buildSitemapIndex(locs: string[], lastmod?: string): string {
  const items = locs.map((loc) => {
    const lines = ['  <sitemap>', `    <loc>${escapeXml(loc)}</loc>`];
    if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
    lines.push('  </sitemap>');
    return lines.join('\n');
  });
  return [XML_DECLARATION, INDEX_OPEN, ...items, '</sitemapindex>', ''].join(
    '\n',
  );
}

export interface SitemapLimits {
  maxUrls: number;
  maxBytes: number;
}

const DEFAULT_LIMITS: SitemapLimits = {
  maxUrls: MAX_URLS_PER_FILE,
  maxBytes: MAX_BYTES_PER_FILE,
};

/** 上限（件数・バイト数）に収まるようにエントリを分割する */
export function splitEntries(
  entries: SitemapEntry[],
  limits: SitemapLimits = DEFAULT_LIMITS,
): SitemapEntry[][] {
  const encoder = new TextEncoder();
  const overhead = encoder.encode(
    `${XML_DECLARATION}\n${URLSET_OPEN}\n</urlset>\n`,
  ).length;
  const chunks: SitemapEntry[][] = [];
  let current: SitemapEntry[] = [];
  let bytes = overhead;
  for (const entry of entries) {
    const size = encoder.encode(entryXml(entry)).length + 1;
    if (
      current.length > 0 &&
      (current.length >= limits.maxUrls || bytes + size > limits.maxBytes)
    ) {
      chunks.push(current);
      current = [];
      bytes = overhead;
    }
    current.push(entry);
    bytes += size;
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export interface SitemapFile {
  filename: string;
  xml: string;
  kind: 'urlset' | 'index';
}

/**
 * 出力ファイル一式を作る。1ファイルに収まるなら sitemap.xml のみ。
 * 超える場合は sitemap-1.xml … と、それらを束ねる sitemap-index.xml を返す。
 */
export function buildSitemapFiles(
  entries: SitemapEntry[],
  limits: SitemapLimits = DEFAULT_LIMITS,
): SitemapFile[] {
  if (entries.length === 0) return [];
  const chunks = splitEntries(entries, limits);
  if (chunks.length === 1) {
    return [
      { filename: 'sitemap.xml', xml: buildUrlset(chunks[0]), kind: 'urlset' },
    ];
  }
  const origin = new URL(entries[0].loc).origin;
  const files: SitemapFile[] = chunks.map((chunk, i) => ({
    filename: `sitemap-${i + 1}.xml`,
    xml: buildUrlset(chunk),
    kind: 'urlset',
  }));
  files.push({
    filename: 'sitemap-index.xml',
    xml: buildSitemapIndex(files.map((f) => `${origin}/${f.filename}`)),
    kind: 'index',
  });
  return files;
}
