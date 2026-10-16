export type WwwMode = 'none' | 'add' | 'remove';
export type SlashMode = 'none' | 'add' | 'remove';
export type RedirectMatchMode = 'exact' | 'prefix';

export interface HtaccessInput {
  /** HTTPからHTTPSへ301リダイレクトする */
  forceHttps: boolean;
  /** CDN・リバースプロキシ（Cloudflare等）配下。X-Forwarded-Proto も見てループを防ぐ */
  behindProxy: boolean;
  www: WwwMode;
  /** www の統一先となるドメイン（www.なし。例: example.com） */
  domain: string;
  trailingSlash: SlashMode;
  /** /index.html・/index.php への直接アクセスをディレクトリ（/）へ301する */
  removeIndex: boolean;
  /** 1行に「元パス 転送先 [301|302|307|308]」 */
  redirectsText: string;
  redirectMatch: RedirectMatchMode;
  /** Options -Indexes（ディレクトリ一覧の表示を無効化） */
  disableIndexes: boolean;
  errorDoc403: string;
  errorDoc404: string;
  errorDoc500: string;
}

export interface RedirectRule {
  from: string;
  to: string;
  status: RedirectStatus;
}

export type RedirectStatus = 301 | 302 | 307 | 308;

export type HtaccessIssueCode =
  | 'noRules'
  | 'domainRequired'
  | 'invalidDomain'
  | 'invalidRedirectFormat'
  | 'invalidFrom'
  | 'invalidTo'
  | 'invalidStatus'
  | 'redirectLoop'
  | 'duplicateRedirect'
  | 'redirectChain'
  | 'httpTarget'
  | 'invalidErrorDoc'
  | 'httpsLoopRisk'
  | 'proxyScheme';

export interface HtaccessIssue {
  code: HtaccessIssueCode;
  severity: 'error' | 'warning';
  /** 問題の値（行の内容・ドメインなど） */
  value?: string;
  /** 該当する行番号（リダイレクト入力の行。1始まり） */
  line?: number;
}

export const REDIRECT_STATUSES: readonly RedirectStatus[] = [
  301, 302, 307, 308,
];

export function emptyInput(): HtaccessInput {
  return {
    forceHttps: true,
    behindProxy: false,
    www: 'none',
    domain: '',
    trailingSlash: 'none',
    removeIndex: false,
    redirectsText: '',
    redirectMatch: 'exact',
    disableIndexes: false,
    errorDoc403: '',
    errorDoc404: '',
    errorDoc500: '',
  };
}

/** 入力されたドメインから、スキーム・パス・先頭の www.・ポートを取り除いて小文字にする */
export function normalizeDomain(raw: string): string {
  let d = raw.trim().toLowerCase();
  d = d.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
  d = d.replace(/[/?#].*$/, '');
  d = d.replace(/:\d+$/, '');
  d = d.replace(/\.$/, '');
  d = d.replace(/^www\./, '');
  return d;
}

/** 「ラベル.ラベル」形式（ASCII、2ラベル以上）のドメイン名か */
export function isValidDomain(domain: string): boolean {
  return /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(
    domain,
  );
}

/** 正規表現の特殊文字をエスケープする */
export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const CONTROL_OR_NON_ASCII = /[^\x21-\x7e]/;

function isValidFrom(from: string): boolean {
  return (
    from.startsWith('/') &&
    !CONTROL_OR_NON_ASCII.test(from) &&
    !/["\\?#]/.test(from)
  );
}

function isValidTo(to: string): boolean {
  if (CONTROL_OR_NON_ASCII.test(to) || /["\\$]/.test(to)) return false;
  if (to.startsWith('/')) return !to.startsWith('//');
  return /^https?:\/\/[^/\s]+/i.test(to);
}

function isValidErrorDoc(path: string): boolean {
  return (
    path.startsWith('/') &&
    !path.startsWith('//') &&
    !CONTROL_OR_NON_ASCII.test(path) &&
    !/["\\$]/.test(path)
  );
}

export interface ParsedRedirects {
  rules: (RedirectRule & { line: number })[];
  issues: HtaccessIssue[];
}

/** リダイレクト入力（1行に「元パス 転送先 [ステータス]」）を解析する。空行と # で始まる行は無視 */
export function parseRedirects(text: string): ParsedRedirects {
  const rules: ParsedRedirects['rules'] = [];
  const issues: HtaccessIssue[] = [];
  text.split(/\r\n|\r|\n/).forEach((raw, i) => {
    const line = i + 1;
    const trimmed = raw.trim();
    if (trimmed === '' || trimmed.startsWith('#')) return;
    const tokens = trimmed.split(/\s+/);
    if (tokens.length < 2 || tokens.length > 3) {
      issues.push({
        code: 'invalidRedirectFormat',
        severity: 'error',
        value: trimmed,
        line,
      });
      return;
    }
    const [from, to, statusToken] = tokens;
    if (!isValidFrom(from)) {
      issues.push({
        code: 'invalidFrom',
        severity: 'error',
        value: from,
        line,
      });
      return;
    }
    if (!isValidTo(to)) {
      issues.push({ code: 'invalidTo', severity: 'error', value: to, line });
      return;
    }
    let status: RedirectStatus = 301;
    if (statusToken !== undefined) {
      const n = /^\d+$/.test(statusToken) ? Number(statusToken) : NaN;
      if (!REDIRECT_STATUSES.includes(n as RedirectStatus)) {
        issues.push({
          code: 'invalidStatus',
          severity: 'error',
          value: statusToken,
          line,
        });
        return;
      }
      status = n as RedirectStatus;
    }
    rules.push({ from, to, status, line });
  });
  return { rules, issues };
}

/** 転送先がパス形式のとき、そのパス部分（クエリなし）を返す。絶対URLなら null */
function targetPath(to: string): string | null {
  return to.startsWith('/') ? to.replace(/[?#].*$/, '') : null;
}

function isLoop(rule: RedirectRule, mode: RedirectMatchMode): boolean {
  const path = targetPath(rule.to);
  if (path === null) return false;
  if (path === rule.from) return true;
  if (mode === 'prefix') {
    const base = rule.from.endsWith('/') ? rule.from : rule.from + '/';
    return path.startsWith(base);
  }
  return false;
}

/** ループするルール（自己参照、完全一致での A→B→A のような循環）を、行番号の集合で返す */
function loopingLines(
  rules: (RedirectRule & { line: number })[],
  mode: RedirectMatchMode,
): Set<number> {
  const lines = new Set<number>();
  const next = new Map<string, string>();
  for (const r of rules) {
    const path = targetPath(r.to);
    if (path !== null && !next.has(r.from)) next.set(r.from, path);
  }
  for (const r of rules) {
    if (isLoop(r, mode)) {
      lines.add(r.line);
      continue;
    }
    if (mode !== 'exact') continue;
    let cur = targetPath(r.to);
    for (let i = 0; cur !== null && i <= rules.length; i++) {
      if (cur === r.from) {
        lines.add(r.line);
        break;
      }
      cur = next.get(cur) ?? null;
    }
  }
  return lines;
}

/** 出力に含められるリダイレクト（解析に成功し、ループしないもの） */
function usableRedirects(input: HtaccessInput): RedirectRule[] {
  const { rules } = parseRedirects(input.redirectsText);
  const loops = loopingLines(rules, input.redirectMatch);
  return rules
    .filter((r) => !loops.has(r.line))
    .map(({ from, to, status }) => ({ from, to, status }));
}

function domainState(input: HtaccessInput): {
  domain: string;
  ok: boolean;
} {
  const domain = normalizeDomain(input.domain);
  return { domain, ok: isValidDomain(domain) };
}

function errorDocs(input: HtaccessInput): { code: number; path: string }[] {
  return (
    [
      [403, input.errorDoc403],
      [404, input.errorDoc404],
      [500, input.errorDoc500],
    ] as const
  )
    .map(([code, raw]) => ({ code, path: raw.trim() }))
    .filter((e) => e.path !== '' && isValidErrorDoc(e.path));
}

/** .htaccess の内容を組み立てる。不正な入力に由来するルールは出力しない（analyzeHtaccess で警告される） */
export function buildHtaccess(input: HtaccessInput): string {
  const { domain, ok: domainOk } = domainState(input);
  const scheme = input.forceHttps ? 'https' : '%{REQUEST_SCHEME}';
  const rewrite: string[] = [];

  const wwwActive = input.www !== 'none' && domainOk;
  if (wwwActive) {
    const escaped = escapeRegex(domain);
    const sourceHost =
      input.www === 'add' ? `^${escaped}$` : `^www\\.${escaped}$`;
    const canonicalHost = input.www === 'add' ? `www.${domain}` : domain;
    rewrite.push(
      input.www === 'add' ? '# Redirect to www' : '# Redirect www to non-www',
      `RewriteCond %{HTTP_HOST} ${sourceHost} [NC]`,
      `RewriteRule ^ ${scheme}://${canonicalHost}%{REQUEST_URI} [L,R=301]`,
      '',
    );
  }

  if (input.forceHttps) {
    rewrite.push('# Force HTTPS', 'RewriteCond %{HTTPS} off');
    if (input.behindProxy) {
      rewrite.push('RewriteCond %{HTTP:X-Forwarded-Proto} !https');
    }
    rewrite.push(
      'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
      '',
    );
  }

  if (input.trailingSlash === 'add') {
    rewrite.push(
      '# Add trailing slash to directories',
      'RewriteCond %{REQUEST_FILENAME} -d',
      `RewriteRule [^/]$ ${scheme}://%{HTTP_HOST}%{REQUEST_URI}/ [L,R=301]`,
      '',
    );
  } else if (input.trailingSlash === 'remove') {
    rewrite.push(
      '# Remove trailing slash (except real directories)',
      'RewriteCond %{REQUEST_FILENAME} !-d',
      `RewriteRule ^(.+)/$ ${scheme}://%{HTTP_HOST}/$1 [L,R=301]`,
      '',
    );
  }

  if (input.removeIndex) {
    rewrite.push(
      '# Redirect /index.html and /index.php to the directory',
      'RewriteCond %{THE_REQUEST} ^[A-Z]+\\s/(?:.*/)?index\\.(?:html?|php)[\\s?] [NC]',
      `RewriteRule ^(.*/)?index\\.(?:html?|php)$ ${scheme}://%{HTTP_HOST}/$1 [L,R=301,NC]`,
      '',
    );
  }

  const blocks: string[] = [];
  if (rewrite.length > 0) {
    while (rewrite[rewrite.length - 1] === '') rewrite.pop();
    blocks.push(
      [
        '<IfModule mod_rewrite.c>',
        'RewriteEngine On',
        '',
        ...rewrite,
        '</IfModule>',
      ].join('\n'),
    );
  }

  const redirects = usableRedirects(input);
  if (redirects.length > 0) {
    const lines = redirects.map((r) =>
      input.redirectMatch === 'exact'
        ? `RedirectMatch ${r.status} "^${escapeRegex(r.from)}$" "${r.to}"`
        : `Redirect ${r.status} "${r.from}" "${r.to}"`,
    );
    blocks.push(
      ['# Redirects', '<IfModule mod_alias.c>', ...lines, '</IfModule>'].join(
        '\n',
      ),
    );
  }

  const misc: string[] = [];
  if (input.disableIndexes) {
    misc.push('# Disable directory listing', 'Options -Indexes');
  }
  const docs = errorDocs(input);
  if (docs.length > 0) {
    if (misc.length > 0) misc.push('');
    misc.push(
      '# Custom error pages',
      ...docs.map((d) => `ErrorDocument ${d.code} ${d.path}`),
    );
  }
  if (misc.length > 0) blocks.push(misc.join('\n'));

  return blocks.length === 0 ? '' : blocks.join('\n\n') + '\n';
}

/** 入力内容の問題点（出力に含まれないルール、ループの恐れなど）を返す */
export function analyzeHtaccess(input: HtaccessInput): HtaccessIssue[] {
  const issues: HtaccessIssue[] = [];

  if (input.www !== 'none') {
    const { domain, ok } = domainState(input);
    if (domain === '') {
      issues.push({ code: 'domainRequired', severity: 'error' });
    } else if (!ok) {
      issues.push({ code: 'invalidDomain', severity: 'error', value: domain });
    }
  }

  const parsed = parseRedirects(input.redirectsText);
  issues.push(...parsed.issues);

  const loops = loopingLines(parsed.rules, input.redirectMatch);
  const seen = new Set<string>();
  for (const rule of parsed.rules) {
    if (loops.has(rule.line)) {
      issues.push({
        code: 'redirectLoop',
        severity: 'error',
        value: rule.from,
        line: rule.line,
      });
      continue;
    }
    if (seen.has(rule.from)) {
      issues.push({
        code: 'duplicateRedirect',
        severity: 'warning',
        value: rule.from,
        line: rule.line,
      });
    }
    seen.add(rule.from);
    if (input.forceHttps && /^http:\/\//i.test(rule.to)) {
      issues.push({
        code: 'httpTarget',
        severity: 'warning',
        value: rule.to,
        line: rule.line,
      });
    }
  }
  const froms = new Set(parsed.rules.map((r) => r.from));
  for (const rule of parsed.rules) {
    const path = targetPath(rule.to);
    if (path !== null && path !== rule.from && froms.has(path)) {
      issues.push({
        code: 'redirectChain',
        severity: 'warning',
        value: rule.to,
        line: rule.line,
      });
    }
  }

  for (const raw of [input.errorDoc403, input.errorDoc404, input.errorDoc500]) {
    const path = raw.trim();
    if (path !== '' && !isValidErrorDoc(path)) {
      issues.push({ code: 'invalidErrorDoc', severity: 'error', value: path });
    }
  }

  const hasRules = buildHtaccess(input) !== '';
  if (!hasRules && issues.length === 0) {
    issues.push({ code: 'noRules', severity: 'warning' });
  }

  if (input.forceHttps && !input.behindProxy) {
    issues.push({ code: 'httpsLoopRisk', severity: 'warning' });
  }
  if (
    input.behindProxy &&
    !input.forceHttps &&
    (input.www !== 'none' ||
      input.trailingSlash !== 'none' ||
      input.removeIndex)
  ) {
    issues.push({ code: 'proxyScheme', severity: 'warning' });
  }

  return issues;
}
