/** robots.txt の1グループ（User-agent の集合と、それに対するルール） */
export interface RobotsGroup {
  userAgents: string[];
  allow: string[];
  disallow: string[];
  /** Crawl-delay（秒）。空文字なら出力しない */
  crawlDelay: string;
}

export interface RobotsInput {
  groups: RobotsGroup[];
  sitemaps: string[];
}

export type RobotsIssueCode =
  | 'noGroups'
  | 'noUserAgent'
  | 'invalidUserAgent'
  | 'duplicateUserAgent'
  | 'pathNoSlash'
  | 'pathFullUrl'
  | 'pathHasSpace'
  | 'invalidCrawlDelay'
  | 'invalidSitemap'
  | 'blockAll'
  | 'blockAllSearch'
  | 'allowOverridesBlockAll'
  | 'emptyGroup';

export interface RobotsIssue {
  code: RobotsIssueCode;
  severity: 'error' | 'warning';
  /** 1始まりのグループ番号（グループに紐づかない場合は undefined） */
  group?: number;
  /** 問題の対象となった値（パス・URL・User-agent など） */
  value?: string;
}

/** 主要クローラー・AIボットの User-agent 名 */
export const CRAWLER_PRESETS: { name: string; kind: 'search' | 'ai' }[] = [
  { name: 'Googlebot', kind: 'search' },
  { name: 'Googlebot-Image', kind: 'search' },
  { name: 'Bingbot', kind: 'search' },
  { name: 'Applebot', kind: 'search' },
  { name: 'DuckDuckBot', kind: 'search' },
  { name: 'Baiduspider', kind: 'search' },
  { name: 'YandexBot', kind: 'search' },
  { name: 'GPTBot', kind: 'ai' },
  { name: 'ChatGPT-User', kind: 'ai' },
  { name: 'OAI-SearchBot', kind: 'ai' },
  { name: 'ClaudeBot', kind: 'ai' },
  { name: 'anthropic-ai', kind: 'ai' },
  { name: 'Google-Extended', kind: 'ai' },
  { name: 'CCBot', kind: 'ai' },
  { name: 'PerplexityBot', kind: 'ai' },
  { name: 'Applebot-Extended', kind: 'ai' },
  { name: 'Bytespider', kind: 'ai' },
  { name: 'Amazonbot', kind: 'ai' },
];

const SEARCH_ENGINE_AGENTS = new Set(
  CRAWLER_PRESETS.filter((c) => c.kind === 'search').map((c) =>
    c.name.toLowerCase(),
  ),
);

export type RobotsPresetId =
  'allowAll' | 'blockAll' | 'blockAi' | 'wordpress' | 'blockQuery';

export const AI_BOT_AGENTS = CRAWLER_PRESETS.filter((c) => c.kind === 'ai').map(
  (c) => c.name,
);

/** プリセットが生成するグループ */
export function presetGroups(id: RobotsPresetId): RobotsGroup[] {
  switch (id) {
    case 'allowAll':
      return [group(['*'], [], [])];
    case 'blockAll':
      return [group(['*'], [], ['/'])];
    case 'blockAi':
      return [group(AI_BOT_AGENTS, [], ['/'])];
    case 'wordpress':
      return [
        group(
          ['*'],
          ['/wp-admin/admin-ajax.php'],
          ['/wp-admin/', '/wp-login.php'],
        ),
      ];
    case 'blockQuery':
      return [group(['*'], [], ['/*?', '/search/'])];
  }
}

function group(
  userAgents: string[],
  allow: string[],
  disallow: string[],
): RobotsGroup {
  return { userAgents, allow, disallow, crawlDelay: '' };
}

/** 空の新規グループ */
export function emptyGroup(): RobotsGroup {
  return group(['*'], [], []);
}

/** 1行1項目のテキストを配列にする（前後の空白を除去し、空行を捨てる） */
export function parseLines(text: string): string[] {
  return text
    .split(/\r\n|\r|\n/)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

/** User-agent 欄（カンマ・空白・改行区切り）を配列にする（重複は除く） */
export function parseUserAgents(text: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of text.split(/[,\s]+/)) {
    const name = raw.trim();
    if (name === '' || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    result.push(name);
  }
  return result;
}

export type PathCheck = 'ok' | 'noSlash' | 'fullUrl' | 'hasSpace';

/** Allow / Disallow のパスを検査する（`/` 始まりであること） */
export function checkPath(path: string): PathCheck {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) return 'fullUrl';
  if (/\s/.test(path)) return 'hasSpace';
  if (!path.startsWith('/')) return 'noSlash';
  return 'ok';
}

function isValidSitemapUrl(url: string): boolean {
  if (/\s/.test(url)) return false;
  try {
    const u = new URL(url);
    return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname;
  } catch {
    return false;
  }
}

function isValidCrawlDelay(value: string): boolean {
  return /^\d+(\.\d+)?$/.test(value.trim());
}

/** 入力に含まれる問題点（エラーと警告）を列挙する */
export function analyzeRobots(input: RobotsInput): RobotsIssue[] {
  const issues: RobotsIssue[] = [];
  if (input.groups.length === 0 && input.sitemaps.length === 0) {
    issues.push({ code: 'noGroups', severity: 'warning' });
  }

  const seenAgents = new Map<string, number>();
  input.groups.forEach((g, i) => {
    const n = i + 1;
    if (g.userAgents.length === 0) {
      issues.push({ code: 'noUserAgent', severity: 'error', group: n });
    }
    for (const ua of g.userAgents) {
      if (/[:#]/.test(ua)) {
        issues.push({
          code: 'invalidUserAgent',
          severity: 'error',
          group: n,
          value: ua,
        });
      }
      const key = ua.toLowerCase();
      const prev = seenAgents.get(key);
      if (prev !== undefined && prev !== n) {
        issues.push({
          code: 'duplicateUserAgent',
          severity: 'warning',
          group: n,
          value: ua,
        });
      } else if (prev === undefined) {
        seenAgents.set(key, n);
      }
    }

    for (const p of [...g.disallow, ...g.allow]) {
      const check = checkPath(p);
      if (check === 'ok') continue;
      issues.push({
        code:
          check === 'noSlash'
            ? 'pathNoSlash'
            : check === 'fullUrl'
              ? 'pathFullUrl'
              : 'pathHasSpace',
        severity: 'error',
        group: n,
        value: p,
      });
    }

    if (g.crawlDelay.trim() !== '' && !isValidCrawlDelay(g.crawlDelay)) {
      issues.push({
        code: 'invalidCrawlDelay',
        severity: 'error',
        group: n,
        value: g.crawlDelay.trim(),
      });
    }

    if (g.disallow.includes('/')) {
      const affectsAll = g.userAgents.includes('*');
      const searchAgents = g.userAgents.filter((ua) =>
        SEARCH_ENGINE_AGENTS.has(ua.toLowerCase()),
      );
      if (g.allow.length > 0) {
        issues.push({
          code: 'allowOverridesBlockAll',
          severity: 'warning',
          group: n,
        });
      } else if (affectsAll) {
        issues.push({ code: 'blockAll', severity: 'warning', group: n });
      } else if (searchAgents.length > 0) {
        issues.push({
          code: 'blockAllSearch',
          severity: 'warning',
          group: n,
          value: searchAgents.join(', '),
        });
      }
    }

    if (
      g.userAgents.length > 0 &&
      g.allow.length === 0 &&
      g.disallow.length === 0 &&
      g.crawlDelay.trim() === '' &&
      input.groups.length > 1
    ) {
      issues.push({ code: 'emptyGroup', severity: 'warning', group: n });
    }
  });

  for (const url of input.sitemaps) {
    if (!isValidSitemapUrl(url)) {
      issues.push({
        code: 'invalidSitemap',
        severity: 'error',
        value: url,
      });
    }
  }
  return issues;
}

/** robots.txt のテキストを組み立てる（User-agent が空のグループは出力しない） */
export function buildRobotsTxt(input: RobotsInput): string {
  const blocks: string[] = [];
  for (const g of input.groups) {
    if (g.userAgents.length === 0) continue;
    const lines: string[] = g.userAgents.map((ua) => `User-agent: ${ua}`);
    if (g.disallow.length === 0 && g.allow.length === 0) {
      lines.push('Disallow:');
    }
    for (const p of g.disallow) lines.push(`Disallow: ${p}`);
    for (const p of g.allow) lines.push(`Allow: ${p}`);
    const delay = g.crawlDelay.trim();
    if (delay !== '' && isValidCrawlDelay(delay)) {
      lines.push(`Crawl-delay: ${delay}`);
    }
    blocks.push(lines.join('\n'));
  }
  if (input.sitemaps.length > 0) {
    blocks.push(input.sitemaps.map((s) => `Sitemap: ${s}`).join('\n'));
  }
  return blocks.length === 0 ? '' : blocks.join('\n\n') + '\n';
}
