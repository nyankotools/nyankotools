// SPF / DMARC レコードの組み立てと構文チェック（DNS問い合わせは行わない）

export type Severity = 'error' | 'warn' | 'info';

export type SpfIssueCode =
  | 'empty'
  | 'noVersion'
  | 'versionNotFirst'
  | 'multipleAll'
  | 'allNotLast'
  | 'plusAll'
  | 'neutralAll'
  | 'noAll'
  | 'redirectWithAll'
  | 'multipleRedirect'
  | 'ptr'
  | 'tooManyLookups'
  | 'manyLookups'
  | 'invalidIp4'
  | 'invalidIp6'
  | 'invalidDomain'
  | 'missingValue'
  | 'unknownMechanism'
  | 'duplicateMechanism'
  | 'needsSplit'
  | 'tooLongTotal';

export type DmarcIssueCode =
  | 'empty'
  | 'noVersion'
  | 'versionNotFirst'
  | 'noPolicy'
  | 'policyNotSecond'
  | 'invalidPolicy'
  | 'invalidSubPolicy'
  | 'invalidPct'
  | 'invalidAdkim'
  | 'invalidAspf'
  | 'invalidFo'
  | 'invalidRi'
  | 'invalidUri'
  | 'invalidSyntax'
  | 'unknownTag'
  | 'duplicateTag'
  | 'policyNone'
  | 'pctPartial'
  | 'subWeaker'
  | 'noRua'
  | 'needsSplit';

export interface Issue<C extends string> {
  code: C;
  severity: Severity;
  /** メッセージの {value} に差し込む文字列 */
  value?: string;
}

/** DNS の TXT 文字列 1 つあたりの上限 */
export const TXT_STRING_LIMIT = 255;
/** UDP 応答に収まる目安（これを超えると TCP フォールバックが必要になる） */
export const TXT_TOTAL_WARN = 450;
export const SPF_LOOKUP_LIMIT = 10;

// ---------- 共通 ----------

const DOMAIN_RE =
  /^(?=.{1,253}$)[a-z0-9_]([a-z0-9_-]{0,61}[a-z0-9_])?(\.[a-z0-9_]([a-z0-9_-]{0,61}[a-z0-9_])?)*$/i;

export function isValidDomain(value: string): boolean {
  return DOMAIN_RE.test(value);
}

/** ドメイン入力を正規化する（小文字・末尾ドット・前後空白を除去） */
export function normalizeDomain(value: string): string {
  return value.trim().toLowerCase().replace(/\.+$/, '');
}

export function splitList(text: string): string[] {
  return text
    .split(/[\s,;]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '');
}

/** 255 文字ごとに分割する（DNS の TXT は 1 文字列 255 文字まで） */
export function splitTxtChunks(record: string): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < record.length; i += TXT_STRING_LIMIT) {
    chunks.push(record.slice(i, i + TXT_STRING_LIMIT));
  }
  return chunks.length === 0 ? [''] : chunks;
}

/** DNS 管理画面に貼る引用符付き表記（"..." "..."） */
export function formatQuotedTxt(record: string): string {
  return splitTxtChunks(record)
    .map((c) => `"${c.replace(/"/g, '\\"')}"`)
    .join(' ');
}

export function dmarcHost(domain: string): string {
  const d = normalizeDomain(domain);
  return d === '' ? '_dmarc.example.com' : `_dmarc.${d}`;
}

export function spfHost(domain: string): string {
  const d = normalizeDomain(domain);
  return d === '' ? 'example.com' : d;
}

export function isValidIpv4(value: string): boolean {
  const [addr, cidr, ...rest] = value.split('/');
  if (rest.length > 0) return false;
  if (cidr !== undefined) {
    if (!/^\d{1,2}$/.test(cidr) || Number(cidr) > 32) return false;
  }
  const parts = addr.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => /^\d{1,3}$/.test(p) && Number(p) <= 255);
}

export function isValidIpv6(value: string): boolean {
  const [addr, cidr, ...rest] = value.split('/');
  if (rest.length > 0) return false;
  if (cidr !== undefined) {
    if (!/^\d{1,3}$/.test(cidr) || Number(cidr) > 128) return false;
  }
  if (!addr.includes(':') || /[^0-9a-f:.]/i.test(addr)) return false;
  const halves = addr.split('::');
  if (halves.length > 2) return false;
  const toGroups = (s: string) => (s === '' ? [] : s.split(':'));
  const groups = halves.flatMap(toGroups);
  let count = 0;
  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    if (g.includes('.')) {
      // 末尾に限り埋め込み IPv4 を許可（2 グループ分）
      if (i !== groups.length - 1 || !isValidIpv4(g)) return false;
      count += 2;
    } else {
      if (!/^[0-9a-f]{1,4}$/i.test(g)) return false;
      count += 1;
    }
  }
  return halves.length === 2 ? count < 8 : count === 8;
}

// ---------- SPF 組み立て ----------

export type SpfAll = '-all' | '~all' | '?all' | '+all' | 'none';

export interface SpfBuildInput {
  includes: string[];
  ip4: string[];
  ip6: string[];
  a: boolean;
  mx: boolean;
  redirect: string;
  all: SpfAll;
}

function stripPrefix(value: string, prefix: string): string {
  return value.toLowerCase().startsWith(prefix)
    ? value.slice(prefix.length)
    : value;
}

export function buildSpfRecord(input: SpfBuildInput): string {
  const parts = ['v=spf1'];
  if (input.a) parts.push('a');
  if (input.mx) parts.push('mx');
  for (const ip of input.ip4) parts.push(`ip4:${stripPrefix(ip, 'ip4:')}`);
  for (const ip of input.ip6) parts.push(`ip6:${stripPrefix(ip, 'ip6:')}`);
  for (const d of input.includes) {
    parts.push(`include:${normalizeDomain(stripPrefix(d, 'include:'))}`);
  }
  const redirect = normalizeDomain(
    stripPrefix(input.redirect.trim(), 'redirect='),
  );
  if (input.all !== 'none') {
    // all があると redirect は無視されるため出力しない
    parts.push(input.all);
  } else if (redirect !== '') {
    parts.push(`redirect=${redirect}`);
  }
  return parts.join(' ');
}

// ---------- SPF チェック ----------

export interface SpfMechanism {
  qualifier: '+' | '-' | '~' | '?';
  name: string;
  value: string;
}

export interface SpfCheckResult {
  issues: Issue<SpfIssueCode>[];
  mechanisms: SpfMechanism[];
  /** このレコード内で数えた DNS ルックアップ回数（include 先は含まない概算） */
  lookups: number;
  length: number;
  chunks: string[];
  hasError: boolean;
}

const LOOKUP_MECHANISMS = new Set(['include', 'a', 'mx', 'ptr', 'exists']);
const KNOWN_MECHANISMS = new Set([
  'all',
  'include',
  'a',
  'mx',
  'ptr',
  'ip4',
  'ip6',
  'exists',
]);

function finish<C extends string>(
  issues: Issue<C>[],
): { issues: Issue<C>[]; hasError: boolean } {
  return { issues, hasError: issues.some((i) => i.severity === 'error') };
}

export function checkSpf(raw: string): SpfCheckResult {
  const record = raw.trim().replace(/\s+/g, ' ');
  const issues: Issue<SpfIssueCode>[] = [];
  const mechanisms: SpfMechanism[] = [];
  const empty: SpfCheckResult = {
    issues,
    mechanisms,
    lookups: 0,
    length: 0,
    chunks: [''],
    hasError: false,
  };
  if (record === '') {
    issues.push({ code: 'empty', severity: 'error' });
    return { ...empty, ...finish(issues) };
  }

  const tokens = record.split(' ');
  const versionIndex = tokens.findIndex((t) => t.toLowerCase() === 'v=spf1');
  if (versionIndex === -1) {
    issues.push({ code: 'noVersion', severity: 'error' });
  } else if (versionIndex !== 0) {
    issues.push({ code: 'versionNotFirst', severity: 'error' });
  }

  let lookups = 0;
  let allCount = 0;
  let allIndex = -1;
  let redirectCount = 0;
  let hasRedirect = false;
  const seen = new Set<string>();

  tokens.forEach((token, index) => {
    if (index === versionIndex) return;

    const eq = token.indexOf('=');
    // modifier: name=value（name に : や / を含まないもの）
    if (eq > 0 && /^[a-z][a-z0-9_.-]*$/i.test(token.slice(0, eq))) {
      const name = token.slice(0, eq).toLowerCase();
      const value = token.slice(eq + 1);
      if (name === 'redirect') {
        redirectCount++;
        hasRedirect = true;
        lookups++;
        if (value === '') {
          issues.push({
            code: 'missingValue',
            severity: 'error',
            value: token,
          });
        } else if (!value.includes('%') && !isValidDomain(value)) {
          issues.push({ code: 'invalidDomain', severity: 'error', value });
        }
      }
      return;
    }

    let rest = token;
    let qualifier: SpfMechanism['qualifier'] = '+';
    if ('+-~?'.includes(rest[0])) {
      qualifier = rest[0] as SpfMechanism['qualifier'];
      rest = rest.slice(1);
    }
    const m = /^([a-z0-9]+)(.*)$/i.exec(rest);
    const name = (m ? m[1] : rest).toLowerCase();
    const tail = m ? m[2] : '';
    if (!KNOWN_MECHANISMS.has(name)) {
      issues.push({
        code: 'unknownMechanism',
        severity: 'error',
        value: token,
      });
      return;
    }

    let value = '';
    if (tail.startsWith(':')) value = tail.slice(1);
    else if (tail.startsWith('/'))
      value = tail; // a/24 などの CIDR のみ
    else if (tail !== '') {
      issues.push({
        code: 'unknownMechanism',
        severity: 'error',
        value: token,
      });
      return;
    }
    mechanisms.push({ qualifier, name, value });

    const key = `${name}:${value.toLowerCase()}`;
    if (seen.has(key) && name !== 'all') {
      issues.push({
        code: 'duplicateMechanism',
        severity: 'warn',
        value: token,
      });
    }
    seen.add(key);

    if (LOOKUP_MECHANISMS.has(name)) lookups++;

    switch (name) {
      case 'all':
        allCount++;
        if (allIndex === -1) allIndex = mechanisms.length - 1;
        if (value !== '') {
          issues.push({
            code: 'unknownMechanism',
            severity: 'error',
            value: token,
          });
        }
        break;
      case 'ptr':
        issues.push({ code: 'ptr', severity: 'warn' });
        break;
      case 'ip4':
        if (!isValidIpv4(value)) {
          issues.push({ code: 'invalidIp4', severity: 'error', value: token });
        }
        break;
      case 'ip6':
        if (!isValidIpv6(value)) {
          issues.push({ code: 'invalidIp6', severity: 'error', value: token });
        }
        break;
      case 'include':
      case 'exists':
        if (value === '') {
          issues.push({
            code: 'missingValue',
            severity: 'error',
            value: token,
          });
        } else if (!value.includes('%') && !isValidDomain(value)) {
          issues.push({ code: 'invalidDomain', severity: 'error', value });
        }
        break;
      case 'a':
      case 'mx': {
        const domain = value.startsWith('/') ? '' : value.split('/')[0];
        if (domain !== '' && !domain.includes('%') && !isValidDomain(domain)) {
          issues.push({
            code: 'invalidDomain',
            severity: 'error',
            value: domain,
          });
        }
        break;
      }
    }
  });

  const allMechs = mechanisms.filter((x) => x.name === 'all');
  if (allCount > 1) {
    issues.push({ code: 'multipleAll', severity: 'error' });
  }
  if (allIndex !== -1 && allIndex !== mechanisms.length - 1) {
    issues.push({ code: 'allNotLast', severity: 'warn' });
  }
  if (allMechs.some((x) => x.qualifier === '+')) {
    issues.push({ code: 'plusAll', severity: 'error' });
  }
  if (allMechs.some((x) => x.qualifier === '?')) {
    issues.push({ code: 'neutralAll', severity: 'warn' });
  }
  if (redirectCount > 1) {
    issues.push({ code: 'multipleRedirect', severity: 'error' });
  }
  if (allCount === 0 && !hasRedirect) {
    issues.push({ code: 'noAll', severity: 'warn' });
  }
  if (allCount > 0 && hasRedirect) {
    issues.push({ code: 'redirectWithAll', severity: 'warn' });
  }

  if (lookups > SPF_LOOKUP_LIMIT) {
    issues.push({
      code: 'tooManyLookups',
      severity: 'error',
      value: String(lookups),
    });
  } else if (lookups >= 8) {
    issues.push({
      code: 'manyLookups',
      severity: 'warn',
      value: String(lookups),
    });
  }

  if (record.length > TXT_TOTAL_WARN) {
    issues.push({
      code: 'tooLongTotal',
      severity: 'warn',
      value: String(record.length),
    });
  } else if (record.length > TXT_STRING_LIMIT) {
    issues.push({
      code: 'needsSplit',
      severity: 'info',
      value: String(record.length),
    });
  }

  return {
    mechanisms,
    lookups,
    length: record.length,
    chunks: splitTxtChunks(record),
    ...finish(issues),
  };
}

// ---------- DMARC 組み立て ----------

export type DmarcPolicy = 'none' | 'quarantine' | 'reject';

export interface DmarcBuildInput {
  policy: DmarcPolicy;
  /** '' ならサブドメインポリシーを出力しない（p を継承） */
  subPolicy: '' | DmarcPolicy;
  pct: number;
  rua: string[];
  ruf: string[];
  adkim: '' | 'r' | 's';
  aspf: '' | 'r' | 's';
  fo: '' | '0' | '1' | 'd' | 's';
}

/** メールアドレスに mailto: を付ける（既に付いていればそのまま） */
export function toMailto(value: string): string {
  const v = value.trim();
  return /^mailto:/i.test(v) ? v : `mailto:${v}`;
}

export function buildDmarcRecord(input: DmarcBuildInput): string {
  const parts = ['v=DMARC1', `p=${input.policy}`];
  if (input.subPolicy !== '') parts.push(`sp=${input.subPolicy}`);
  const pct = Math.trunc(Number(input.pct));
  if (Number.isFinite(pct) && pct !== 100) parts.push(`pct=${pct}`);
  if (input.rua.length > 0) {
    parts.push(`rua=${input.rua.map(toMailto).join(',')}`);
  }
  if (input.ruf.length > 0) {
    parts.push(`ruf=${input.ruf.map(toMailto).join(',')}`);
  }
  if (input.adkim !== '') parts.push(`adkim=${input.adkim}`);
  if (input.aspf !== '') parts.push(`aspf=${input.aspf}`);
  if (input.fo !== '') parts.push(`fo=${input.fo}`);
  return parts.join('; ');
}

// ---------- DMARC チェック ----------

export interface DmarcCheckResult {
  issues: Issue<DmarcIssueCode>[];
  tags: { name: string; value: string }[];
  length: number;
  chunks: string[];
  hasError: boolean;
}

const POLICIES = new Set(['none', 'quarantine', 'reject']);
const KNOWN_TAGS = new Set([
  'v',
  'p',
  'sp',
  'pct',
  'rua',
  'ruf',
  'adkim',
  'aspf',
  'fo',
  'ri',
  'rf',
]);
const EMAIL_RE = /^[^\s@,;!]+@[^\s@,;!]+\.[^\s@,;!]+$/;

/** mailto:user@example.com[!10m] の形式かを判定する */
export function isValidDmarcUri(uri: string): boolean {
  const m = /^mailto:([^!]*)(!\d+[kmgt]?)?$/i.exec(uri.trim());
  return m !== null && EMAIL_RE.test(m[1]);
}

export function checkDmarc(raw: string): DmarcCheckResult {
  const record = raw.trim();
  const issues: Issue<DmarcIssueCode>[] = [];
  const tags: { name: string; value: string }[] = [];
  if (record === '') {
    issues.push({ code: 'empty', severity: 'error' });
    return { tags, length: 0, chunks: [''], ...finish(issues) };
  }

  const seen = new Set<string>();
  let order = 0;
  let versionIndex = -1;
  let policyIndex = -1;

  for (const segment of record.split(';')) {
    const part = segment.trim();
    if (part === '') continue;
    const eq = part.indexOf('=');
    if (eq <= 0) {
      issues.push({ code: 'invalidSyntax', severity: 'warn', value: part });
      continue;
    }
    const name = part.slice(0, eq).trim().toLowerCase();
    const value = part.slice(eq + 1).trim();
    tags.push({ name, value });
    if (name === 'v') versionIndex = versionIndex === -1 ? order : versionIndex;
    if (name === 'p') policyIndex = policyIndex === -1 ? order : policyIndex;
    order++;

    if (seen.has(name)) {
      issues.push({ code: 'duplicateTag', severity: 'warn', value: name });
    }
    seen.add(name);
    if (!KNOWN_TAGS.has(name)) {
      issues.push({ code: 'unknownTag', severity: 'info', value: name });
    }
  }

  const get = (name: string) => tags.find((t) => t.name === name)?.value;

  const v = get('v');
  if (v === undefined || v.toUpperCase() !== 'DMARC1') {
    issues.push({ code: 'noVersion', severity: 'error' });
  } else if (versionIndex !== 0) {
    issues.push({ code: 'versionNotFirst', severity: 'error' });
  }

  const p = get('p');
  if (p === undefined) {
    issues.push({ code: 'noPolicy', severity: 'error' });
  } else {
    if (!POLICIES.has(p.toLowerCase())) {
      issues.push({ code: 'invalidPolicy', severity: 'error', value: p });
    } else if (p.toLowerCase() === 'none') {
      issues.push({ code: 'policyNone', severity: 'info' });
    }
    if (versionIndex === 0 && policyIndex !== 1) {
      issues.push({ code: 'policyNotSecond', severity: 'warn' });
    }
  }

  const sp = get('sp');
  if (sp !== undefined) {
    if (!POLICIES.has(sp.toLowerCase())) {
      issues.push({ code: 'invalidSubPolicy', severity: 'error', value: sp });
    } else if (
      p !== undefined &&
      POLICIES.has(p.toLowerCase()) &&
      rank(sp.toLowerCase()) < rank(p.toLowerCase())
    ) {
      issues.push({ code: 'subWeaker', severity: 'warn' });
    }
  }

  const pct = get('pct');
  if (pct !== undefined) {
    if (!/^\d+$/.test(pct) || Number(pct) > 100) {
      issues.push({ code: 'invalidPct', severity: 'error', value: pct });
    } else if (Number(pct) < 100 && p?.toLowerCase() !== 'none') {
      issues.push({ code: 'pctPartial', severity: 'warn', value: pct });
    }
  }

  for (const [tag, code] of [
    ['adkim', 'invalidAdkim'],
    ['aspf', 'invalidAspf'],
  ] as const) {
    const value = get(tag);
    if (value !== undefined && !/^[rs]$/i.test(value)) {
      issues.push({ code, severity: 'error', value });
    }
  }

  const fo = get('fo');
  if (fo !== undefined) {
    const ok = fo.split(':').every((x) => /^[01ds]$/i.test(x.trim()));
    if (!ok) issues.push({ code: 'invalidFo', severity: 'error', value: fo });
  }

  const ri = get('ri');
  if (ri !== undefined && !/^\d+$/.test(ri)) {
    issues.push({ code: 'invalidRi', severity: 'warn', value: ri });
  }

  for (const tag of ['rua', 'ruf']) {
    const value = get(tag);
    if (value === undefined) continue;
    for (const uri of value.split(',')) {
      if (!isValidDmarcUri(uri)) {
        issues.push({
          code: 'invalidUri',
          severity: 'error',
          value: `${tag}=${uri.trim()}`,
        });
      }
    }
  }
  if (get('rua') === undefined) {
    issues.push({ code: 'noRua', severity: 'info' });
  }

  if (record.length > TXT_STRING_LIMIT) {
    issues.push({
      code: 'needsSplit',
      severity: 'info',
      value: String(record.length),
    });
  }

  return {
    tags,
    length: record.length,
    chunks: splitTxtChunks(record),
    ...finish(issues),
  };
}

function rank(policy: string): number {
  return policy === 'reject' ? 2 : policy === 'quarantine' ? 1 : 0;
}
