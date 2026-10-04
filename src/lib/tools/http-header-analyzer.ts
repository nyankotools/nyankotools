export interface ParsedHeader {
  name: string;
  value: string;
}

export interface ParsedHeaders {
  statusLine: string | null;
  headers: ParsedHeader[];
  /** ヘッダーとして解釈できなかった行数 */
  invalidCount: number;
}

export type FindingStatus = 'good' | 'warn' | 'missing' | 'info';

export type FindingId =
  | 'hsts'
  | 'csp'
  | 'xcto'
  | 'xfo'
  | 'referrer'
  | 'permissions'
  | 'coop'
  | 'corp'
  | 'server'
  | 'poweredBy'
  | 'cookie'
  | 'cors';

/** 指摘の詳細コード。表示文言は辞書側で引く */
export type IssueCode =
  | 'hstsNoMaxAge'
  | 'hstsShort'
  | 'cspReportOnly'
  | 'cspUnsafeInline'
  | 'cspUnsafeEval'
  | 'cspWildcard'
  | 'cspNoFallback'
  | 'xctoInvalid'
  | 'xfoAllowFrom'
  | 'xfoInvalid'
  | 'xfoCoveredByCsp'
  | 'referrerWeak'
  | 'serverVersion'
  | 'cookieNoSecure'
  | 'cookieNoHttpOnly'
  | 'cookieNoSameSite'
  | 'cookieSameSiteNoneInsecure'
  | 'corsWildcard'
  | 'corsWildcardCredentials'
  | 'corsNull';

export interface Finding {
  id: FindingId;
  status: FindingStatus;
  issues: IssueCode[];
  /** 該当ヘッダーの値（Cookie は値を含めず名前のみ） */
  value?: string;
}

export interface Recommendation {
  name: string;
  value: string;
}

export interface HeaderAnalysis {
  findings: Finding[];
  recommendations: Recommendation[];
}

export type RecommendationFormat = 'raw' | 'nginx' | 'apache' | 'headers-file';

const HSTS_MIN_MAX_AGE = 15552000; // 180日

const RECOMMENDED: Record<string, string> = {
  hsts: 'max-age=31536000; includeSubDomains',
  csp: "default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
  xcto: 'nosniff',
  xfo: 'SAMEORIGIN',
  referrer: 'strict-origin-when-cross-origin',
  permissions: 'camera=(), microphone=(), geolocation=()',
};

const RECOMMENDED_NAMES: Record<string, string> = {
  hsts: 'Strict-Transport-Security',
  csp: 'Content-Security-Policy',
  xcto: 'X-Content-Type-Options',
  xfo: 'X-Frame-Options',
  referrer: 'Referrer-Policy',
  permissions: 'Permissions-Policy',
};

/** 貼り付けられたレスポンスヘッダー文字列を解析する（ステータス行・折り返し行に対応） */
export function parseHeaders(text: string): ParsedHeaders {
  const headers: ParsedHeader[] = [];
  let statusLine: string | null = null;
  let invalidCount = 0;

  for (const rawLine of text.split(/\r\n|\r|\n/)) {
    if (rawLine.trim() === '') continue;
    if (/^[ \t]/.test(rawLine) && headers.length > 0) {
      headers[headers.length - 1].value += ` ${rawLine.trim()}`;
      continue;
    }
    const line = rawLine.trim();
    if (statusLine === null && headers.length === 0 && /^HTTP\//i.test(line)) {
      statusLine = line;
      continue;
    }
    const match = /^([!#$%&'*+\-.^_`|~0-9A-Za-z]+):(.*)$/.exec(line);
    if (!match) {
      invalidCount++;
      continue;
    }
    headers.push({ name: match[1], value: match[2].trim() });
  }
  return { statusLine, headers, invalidCount };
}

function getValues(headers: ParsedHeader[], name: string): string[] {
  const lower = name.toLowerCase();
  return headers
    .filter((h) => h.name.toLowerCase() === lower)
    .map((h) => h.value);
}

function getJoined(headers: ParsedHeader[], name: string): string | null {
  const values = getValues(headers, name);
  return values.length === 0 ? null : values.join(', ');
}

function statusOf(issues: IssueCode[]): FindingStatus {
  return issues.length === 0 ? 'good' : 'warn';
}

function parseCsp(value: string): Map<string, string[]> {
  const directives = new Map<string, string[]>();
  for (const part of value.split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) continue;
    const name = tokens[0].toLowerCase();
    if (!directives.has(name)) directives.set(name, tokens.slice(1));
  }
  return directives;
}

function analyzeCsp(headers: ParsedHeader[]): Finding {
  const enforced = getJoined(headers, 'content-security-policy');
  const reportOnly = getJoined(headers, 'content-security-policy-report-only');
  if (enforced === null) {
    if (reportOnly !== null) {
      return {
        id: 'csp',
        status: 'warn',
        issues: ['cspReportOnly'],
        value: reportOnly,
      };
    }
    return { id: 'csp', status: 'missing', issues: [] };
  }

  const directives = parseCsp(enforced);
  const issues: IssueCode[] = [];
  const scriptSources =
    directives.get('script-src') ?? directives.get('default-src');
  if (!scriptSources) {
    issues.push('cspNoFallback');
  } else {
    const lowered = scriptSources.map((s) => s.toLowerCase());
    const hasNonceOrHash = lowered.some(
      (s) => s.startsWith("'nonce-") || /^'sha(256|384|512)-/.test(s),
    );
    if (lowered.includes("'unsafe-inline'") && !hasNonceOrHash) {
      issues.push('cspUnsafeInline');
    }
    if (lowered.includes("'unsafe-eval'")) issues.push('cspUnsafeEval');
    if (lowered.includes('*') || lowered.includes('https:')) {
      issues.push('cspWildcard');
    }
  }
  return { id: 'csp', status: statusOf(issues), issues, value: enforced };
}

function analyzeHsts(headers: ParsedHeader[]): Finding {
  const value = getJoined(headers, 'strict-transport-security');
  if (value === null) return { id: 'hsts', status: 'missing', issues: [] };
  const match = /max-age\s*=\s*"?(\d+)"?/i.exec(value);
  const issues: IssueCode[] = [];
  if (!match) issues.push('hstsNoMaxAge');
  else if (Number(match[1]) < HSTS_MIN_MAX_AGE) issues.push('hstsShort');
  return { id: 'hsts', status: statusOf(issues), issues, value };
}

function analyzeXfo(headers: ParsedHeader[], csp: Finding): Finding {
  const value = getJoined(headers, 'x-frame-options');
  if (value === null) {
    const coveredByCsp =
      csp.value !== undefined &&
      csp.status !== 'missing' &&
      parseCsp(csp.value).has('frame-ancestors') &&
      !csp.issues.includes('cspReportOnly');
    return coveredByCsp
      ? { id: 'xfo', status: 'good', issues: ['xfoCoveredByCsp'] }
      : { id: 'xfo', status: 'missing', issues: [] };
  }
  const normalized = value.trim().toUpperCase();
  const issues: IssueCode[] = [];
  if (normalized.startsWith('ALLOW-FROM')) issues.push('xfoAllowFrom');
  else if (normalized !== 'DENY' && normalized !== 'SAMEORIGIN') {
    issues.push('xfoInvalid');
  }
  return { id: 'xfo', status: statusOf(issues), issues, value };
}

function analyzeReferrer(headers: ParsedHeader[]): Finding {
  const value = getJoined(headers, 'referrer-policy');
  if (value === null) return { id: 'referrer', status: 'missing', issues: [] };
  // 複数指定時は最後の有効値が使われる
  const last = value.split(',').pop()!.trim().toLowerCase();
  const issues: IssueCode[] =
    last === 'unsafe-url' ||
    last === 'no-referrer-when-downgrade' ||
    last === ''
      ? ['referrerWeak']
      : [];
  return { id: 'referrer', status: statusOf(issues), issues, value };
}

function analyzeCookies(headers: ParsedHeader[]): Finding[] {
  return getValues(headers, 'set-cookie').map((cookie) => {
    const [pair, ...attrs] = cookie.split(';').map((s) => s.trim());
    const name = pair.split('=')[0].trim();
    const attrNames = attrs.map((a) => a.split('=')[0].trim().toLowerCase());
    const sameSite = attrs
      .find((a) => a.split('=')[0].trim().toLowerCase() === 'samesite')
      ?.split('=')[1]
      ?.trim()
      .toLowerCase();
    const secure = attrNames.includes('secure');
    const issues: IssueCode[] = [];
    if (!secure) issues.push('cookieNoSecure');
    if (!attrNames.includes('httponly')) issues.push('cookieNoHttpOnly');
    if (sameSite === undefined) issues.push('cookieNoSameSite');
    else if (sameSite === 'none' && !secure) {
      issues.push('cookieSameSiteNoneInsecure');
    }
    return { id: 'cookie', status: statusOf(issues), issues, value: name };
  });
}

function analyzeCors(headers: ParsedHeader[]): Finding | null {
  const origin = getJoined(headers, 'access-control-allow-origin');
  if (origin === null) return null;
  const credentials =
    getJoined(headers, 'access-control-allow-credentials')?.toLowerCase() ===
    'true';
  const issues: IssueCode[] = [];
  const trimmed = origin.trim();
  if (trimmed === '*') {
    issues.push(credentials ? 'corsWildcardCredentials' : 'corsWildcard');
  } else if (trimmed.toLowerCase() === 'null') {
    issues.push('corsNull');
  }
  const status: FindingStatus =
    issues.length === 0
      ? 'good'
      : issues[0] === 'corsWildcard'
        ? 'info'
        : 'warn';
  return { id: 'cors', status, issues, value: origin };
}

/** 解析済みヘッダーをセキュリティ観点で評価し、不足・弱い設定の推奨値を返す */
export function analyzeHeaders(headers: ParsedHeader[]): HeaderAnalysis {
  const findings: Finding[] = [];
  const hsts = analyzeHsts(headers);
  const csp = analyzeCsp(headers);
  const xcto = ((): Finding => {
    const value = getJoined(headers, 'x-content-type-options');
    if (value === null) return { id: 'xcto', status: 'missing', issues: [] };
    const issues: IssueCode[] =
      value.trim().toLowerCase() === 'nosniff' ? [] : ['xctoInvalid'];
    return { id: 'xcto', status: statusOf(issues), issues, value };
  })();
  const xfo = analyzeXfo(headers, csp);
  const referrer = analyzeReferrer(headers);

  const simplePresence = (
    id: 'permissions' | 'coop' | 'corp',
    name: string,
  ) => {
    const value = getJoined(headers, name);
    const missingStatus: FindingStatus =
      id === 'permissions' ? 'missing' : 'info';
    return value === null
      ? ({ id, status: missingStatus, issues: [] } as Finding)
      : ({ id, status: 'good', issues: [], value } as Finding);
  };
  const permissions = simplePresence('permissions', 'permissions-policy');
  const coop = simplePresence('coop', 'cross-origin-opener-policy');
  const corp = simplePresence('corp', 'cross-origin-resource-policy');

  findings.push(hsts, csp, xcto, xfo, referrer, permissions, coop, corp);

  const server = getJoined(headers, 'server');
  if (server !== null && /\d/.test(server)) {
    findings.push({
      id: 'server',
      status: 'warn',
      issues: ['serverVersion'],
      value: server,
    });
  } else if (server !== null) {
    findings.push({ id: 'server', status: 'info', issues: [], value: server });
  }
  const poweredBy = getJoined(headers, 'x-powered-by');
  if (poweredBy !== null) {
    findings.push({
      id: 'poweredBy',
      status: 'warn',
      issues: [],
      value: poweredBy,
    });
  }
  findings.push(...analyzeCookies(headers));
  const cors = analyzeCors(headers);
  if (cors) findings.push(cors);

  const recommendations: Recommendation[] = [];
  const recommend = (key: keyof typeof RECOMMENDED) => {
    recommendations.push({
      name: RECOMMENDED_NAMES[key],
      value: RECOMMENDED[key],
    });
  };
  const byId = (id: FindingId) => findings.find((f) => f.id === id)!;
  for (const key of ['hsts', 'csp', 'xcto', 'xfo', 'referrer', 'permissions']) {
    const f = byId(key as FindingId);
    // CSP は既に設定がある場合、一律の置き換え値は提示しない（既存ポリシーを壊しかねないため）
    if (f.status === 'missing' || (f.status === 'warn' && key !== 'csp')) {
      recommend(key);
    } else if (key === 'csp' && f.issues.includes('cspReportOnly')) {
      recommend(key);
    }
  }
  return { findings, recommendations };
}

/** 推奨ヘッダーを、各サーバー設定の書式に整形する */
export function formatRecommendations(
  recommendations: Recommendation[],
  format: RecommendationFormat,
): string {
  switch (format) {
    case 'raw':
      return recommendations.map((r) => `${r.name}: ${r.value}`).join('\n');
    case 'nginx':
      return recommendations
        .map((r) => `add_header ${r.name} "${r.value}" always;`)
        .join('\n');
    case 'apache':
      return recommendations
        .map((r) => `Header always set ${r.name} "${r.value}"`)
        .join('\n');
    case 'headers-file':
      return recommendations.length === 0
        ? ''
        : `/*\n${recommendations.map((r) => `  ${r.name}: ${r.value}`).join('\n')}`;
  }
}
