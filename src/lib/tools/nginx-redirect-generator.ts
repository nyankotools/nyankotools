export type WwwMode = 'none' | 'add' | 'remove';
export type SlashMode = 'none' | 'add' | 'remove';
export type RedirectMatchMode = 'exact' | 'prefix';
export type RedirectStatus = 301 | 302 | 307 | 308;

export interface NginxInput {
  /** HTTPからHTTPSへ301リダイレクトする */
  forceHttps: boolean;
  /** CDN・リバースプロキシ配下。X-Forwarded-Proto を見て判定する */
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
}

export interface RedirectRule {
  from: string;
  to: string;
  status: RedirectStatus;
}

export type NginxIssueCode =
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
  | 'slashRedirectConflict'
  | 'certificateNeeded'
  | 'proxyScheme';

export interface NginxIssue {
  code: NginxIssueCode;
  severity: 'error' | 'warning';
  value?: string;
  line?: number;
}

export const REDIRECT_STATUSES: readonly RedirectStatus[] = [
  301, 302, 307, 308,
];

export function emptyInput(): NginxInput {
  return {
    forceHttps: true,
    behindProxy: false,
    www: 'none',
    domain: '',
    trailingSlash: 'none',
    removeIndex: false,
    redirectsText: '',
    redirectMatch: 'exact',
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

/** 空白・制御文字、および設定ファイルの構文を壊す文字（; { } 引用符 バックスラッシュ $）を含むか */
// eslint-disable-next-line no-control-regex
const UNSAFE_COMMON = /[\s\x00-\x1f\x7f;{}"'`\\$]/;

/** 元パス: nginx はデコード後のパスと照合するので % は不可。日本語などはそのまま書ける */
function isValidFrom(from: string): boolean {
  return (
    from.startsWith('/') && !UNSAFE_COMMON.test(from) && !/[?#%]/.test(from)
  );
}

function isValidTo(to: string): boolean {
  if (UNSAFE_COMMON.test(to) || /[^\x21-\x7e]/.test(to)) return false;
  if (to.startsWith('/')) return !to.startsWith('//');
  return /^https?:\/\/[^/\s]+/i.test(to);
}

export interface ParsedRedirects {
  rules: (RedirectRule & { line: number })[];
  issues: NginxIssue[];
}

/** リダイレクト入力（1行に「元パス 転送先 [ステータス]」）を解析する。空行と # で始まる行は無視 */
export function parseRedirects(text: string): ParsedRedirects {
  const rules: ParsedRedirects['rules'] = [];
  const issues: NginxIssue[] = [];
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

function usableRedirects(input: NginxInput): RedirectRule[] {
  const { rules } = parseRedirects(input.redirectsText);
  const loops = loopingLines(rules, input.redirectMatch);
  const seen = new Set<string>();
  return rules
    .filter((r) => {
      if (loops.has(r.line) || seen.has(r.from)) return false;
      seen.add(r.from);
      return true;
    })
    .map(({ from, to, status }) => ({ from, to, status }));
}

function domainState(input: NginxInput): { domain: string; ok: boolean } {
  const domain = normalizeDomain(input.domain);
  return { domain, ok: isValidDomain(domain) };
}

const IND = '    ';

function redirectLocation(r: RedirectRule, mode: RedirectMatchMode): string[] {
  if (mode === 'exact') {
    return [
      `${IND}location = "${r.from}" {`,
      `${IND}${IND}return ${r.status} "${r.to}";`,
      `${IND}}`,
    ];
  }
  const base = r.from.length > 1 ? r.from.replace(/\/+$/, '') : '';
  const toBase = r.to.replace(/\/+$/, '');
  const regexBody =
    toBase === ''
      ? `^${escapeRegex(base)}(?:/(?<rest>.*))?$`
      : `^${escapeRegex(base)}(?<rest>/.*)?$`;
  const dest = toBase === '' ? '/$rest' : `${toBase}$rest`;
  return [
    `${IND}location ~ "${regexBody}" {`,
    `${IND}${IND}return ${r.status} "${dest}";`,
    `${IND}}`,
  ];
}

/** nginx 設定（server ブロックの断片）を組み立てる。不正な入力に由来するルールは出力しない */
export function buildNginx(input: NginxInput): string {
  const { domain, ok: domainOk } = domainState(input);
  const wwwActive = input.www !== 'none' && domainOk;
  const canonical = input.www === 'add' ? `www.${domain}` : domain;
  const scheme = input.forceHttps ? 'https' : '$scheme';
  const sslHere = input.forceHttps && !input.behindProxy;
  const blocks: string[] = [];

  if (sslHere) {
    const names = domainOk ? `${domain} www.${domain}` : '_';
    const host = wwwActive ? canonical : '$host';
    blocks.push(
      [
        '# Redirect HTTP to HTTPS (separate server block)',
        'server {',
        `${IND}listen 80;`,
        `${IND}listen [::]:80;`,
        `${IND}server_name ${names};`,
        `${IND}return 301 https://${host}$request_uri;`,
        '}',
      ].join('\n'),
    );
  }

  if (wwwActive) {
    const source = input.www === 'add' ? domain : `www.${domain}`;
    const listen = sslHere
      ? [
          `${IND}listen 443 ssl;`,
          `${IND}listen [::]:443 ssl;`,
          `${IND}server_name ${source};`,
          `${IND}ssl_certificate /path/to/fullchain.pem;`,
          `${IND}ssl_certificate_key /path/to/privkey.pem;`,
        ]
      : [
          `${IND}listen 80;`,
          `${IND}listen [::]:80;`,
          `${IND}server_name ${source};`,
        ];
    blocks.push(
      [
        input.www === 'add'
          ? '# Redirect to www (separate server block)'
          : '# Redirect www to non-www (separate server block)',
        'server {',
        ...listen,
        `${IND}return 301 ${scheme}://${canonical}$request_uri;`,
        '}',
      ].join('\n'),
    );
  }

  const parts: string[][] = [];
  if (input.forceHttps && input.behindProxy) {
    parts.push([
      `${IND}# Force HTTPS behind a proxy`,
      `${IND}if ($http_x_forwarded_proto = "http") {`,
      `${IND}${IND}return 301 https://$host$request_uri;`,
      `${IND}}`,
    ]);
  }
  if (input.trailingSlash === 'add') {
    parts.push([
      `${IND}# Add a trailing slash to URLs without a file extension`,
      `${IND}rewrite ^([^.]*[^/])$ ${scheme}://$host$1/ permanent;`,
    ]);
  } else if (input.trailingSlash === 'remove') {
    parts.push([
      `${IND}# Remove the trailing slash (except real directories)`,
      `${IND}if (!-d $request_filename) {`,
      `${IND}${IND}rewrite ^/(.+)/$ ${scheme}://$host/$1 permanent;`,
      `${IND}}`,
    ]);
  }
  if (input.removeIndex) {
    parts.push([
      `${IND}# Redirect /index.html and /index.php to the directory`,
      `${IND}if ($request_uri ~* "^(.*/)index\\.(?:html?|php)(?:\\?|$)") {`,
      `${IND}${IND}return 301 ${scheme}://$host$1$is_args$args;`,
      `${IND}}`,
    ]);
  }
  const redirects = usableRedirects(input);
  if (redirects.length > 0) {
    parts.push([
      `${IND}# Redirects`,
      ...redirects.flatMap((r) => redirectLocation(r, input.redirectMatch)),
    ]);
  }
  if (parts.length > 0) {
    blocks.push(
      [
        '# Add the following inside your main server { } block',
        ...parts.flatMap((p, i) => (i === 0 ? p : ['', ...p])),
      ].join('\n'),
    );
  }

  return blocks.length === 0 ? '' : blocks.join('\n\n') + '\n';
}

/** 入力内容の問題点を返す */
export function analyzeNginx(input: NginxInput): NginxIssue[] {
  const issues: NginxIssue[] = [];

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

  if (buildNginx(input) === '' && issues.length === 0) {
    issues.push({ code: 'noRules', severity: 'warning' });
  }

  if (input.trailingSlash !== 'none' && usableRedirects(input).length > 0) {
    issues.push({ code: 'slashRedirectConflict', severity: 'warning' });
  }
  if (
    input.forceHttps &&
    !input.behindProxy &&
    input.www !== 'none' &&
    domainState(input).ok
  ) {
    issues.push({ code: 'certificateNeeded', severity: 'warning' });
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
