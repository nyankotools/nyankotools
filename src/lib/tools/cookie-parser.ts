export type CookieMode = 'auto' | 'cookie' | 'set-cookie';
export type CookieKind = 'request' | 'set';

export type SameSiteValue = 'strict' | 'lax' | 'none' | 'invalid';

export type IssueCode =
  | 'noEquals'
  | 'emptyName'
  | 'duplicateName'
  | 'sameSiteInvalid'
  | 'sameSiteNoneNoSecure'
  | 'partitionedNoSecure'
  | 'expiresInvalid'
  | 'maxAgeInvalid'
  | 'expired'
  | 'bothExpiry'
  | 'lifetimeOver400d'
  | 'secureMissing'
  | 'httpOnlyMissing'
  | 'sameSiteMissing'
  | 'prefixSecureInvalid'
  | 'prefixHostInvalid';

export type IssueSeverity = 'warn' | 'info';

export const ISSUE_SEVERITY: Record<IssueCode, IssueSeverity> = {
  noEquals: 'warn',
  emptyName: 'warn',
  duplicateName: 'warn',
  sameSiteInvalid: 'warn',
  sameSiteNoneNoSecure: 'warn',
  partitionedNoSecure: 'warn',
  expiresInvalid: 'warn',
  maxAgeInvalid: 'warn',
  expired: 'info',
  bothExpiry: 'info',
  lifetimeOver400d: 'info',
  secureMissing: 'info',
  httpOnlyMissing: 'info',
  sameSiteMissing: 'info',
  prefixSecureInvalid: 'warn',
  prefixHostInvalid: 'warn',
};

export interface CookieAttributes {
  domain: string | null;
  path: string | null;
  /** Expires の元の文字列と、解釈できた場合のエポックms */
  expires: { raw: string; ms: number | null } | null;
  /** Max-Age の元の文字列と、整数として解釈できた場合の秒数 */
  maxAge: { raw: string; seconds: number | null } | null;
  secure: boolean;
  httpOnly: boolean;
  sameSite: { raw: string; value: SameSiteValue } | null;
  partitioned: boolean;
  priority: string | null;
}

export type Lifetime = 'session' | 'persistent' | 'expired';

export interface CookieEntry {
  kind: CookieKind;
  name: string;
  value: string;
  /** パーセントエンコードを復号した値（復号できない／同一なら null） */
  decoded: string | null;
  /** Set-Cookie のみ */
  attributes: CookieAttributes | null;
  /** 解釈できなかった属性 */
  unknownAttributes: { name: string; value: string }[];
  /** Set-Cookie のみ */
  lifetime: Lifetime | null;
  issues: IssueCode[];
}

export interface ParseResult {
  entries: CookieEntry[];
  /** 実際に適用した種別 */
  detected: CookieKind | 'mixed' | null;
}

const KNOWN_ATTRIBUTES = [
  'domain',
  'path',
  'expires',
  'max-age',
  'secure',
  'httponly',
  'samesite',
  'partitioned',
  'priority',
];

const DAY_MS = 86400 * 1000;

function splitNameValue(part: string): {
  name: string;
  value: string;
  hasEquals: boolean;
} {
  const idx = part.indexOf('=');
  if (idx === -1) return { name: part.trim(), value: '', hasEquals: false };
  return {
    name: part.slice(0, idx).trim(),
    value: part.slice(idx + 1).trim(),
    hasEquals: true,
  };
}

function tryDecode(value: string): string | null {
  if (!value.includes('%')) return null;
  try {
    const decoded = decodeURIComponent(value);
    return decoded === value ? null : decoded;
  } catch {
    return null;
  }
}

/** ヘッダー名の接頭辞（"Set-Cookie:" / "Cookie:"）を取り除く */
function stripHeaderName(line: string): {
  body: string;
  kind: CookieKind | null;
} {
  const m = /^\s*(set-cookie|cookie)\s*:\s*/i.exec(line);
  if (!m) return { body: line.trim(), kind: null };
  return {
    body: line.slice(m[0].length).trim(),
    kind: m[1].toLowerCase() === 'set-cookie' ? 'set' : 'request',
  };
}

/** 接頭辞なしの 1 行が Set-Cookie らしいか（先頭以外のセグメントに既知の属性がある） */
export function looksLikeSetCookie(body: string): boolean {
  const parts = body.split(';').slice(1);
  return parts.some((p) => {
    const name = p.split('=')[0].trim().toLowerCase();
    return KNOWN_ATTRIBUTES.includes(name);
  });
}

function parseSetCookie(body: string, now: number): CookieEntry {
  const segments = body.split(';');
  const first = splitNameValue(segments[0] ?? '');
  const attrs: CookieAttributes = {
    domain: null,
    path: null,
    expires: null,
    maxAge: null,
    secure: false,
    httpOnly: false,
    sameSite: null,
    partitioned: false,
    priority: null,
  };
  const unknownAttributes: { name: string; value: string }[] = [];

  for (const seg of segments.slice(1)) {
    if (seg.trim() === '') continue;
    const { name, value } = splitNameValue(seg);
    switch (name.toLowerCase()) {
      case 'domain':
        attrs.domain = value;
        break;
      case 'path':
        attrs.path = value;
        break;
      case 'expires': {
        const ms = Date.parse(value);
        attrs.expires = { raw: value, ms: Number.isNaN(ms) ? null : ms };
        break;
      }
      case 'max-age': {
        attrs.maxAge = {
          raw: value,
          seconds: /^-?\d+$/.test(value) ? Number(value) : null,
        };
        break;
      }
      case 'secure':
        attrs.secure = true;
        break;
      case 'httponly':
        attrs.httpOnly = true;
        break;
      case 'samesite': {
        const v = value.toLowerCase();
        attrs.sameSite = {
          raw: value,
          value: v === 'strict' || v === 'lax' || v === 'none' ? v : 'invalid',
        };
        break;
      }
      case 'partitioned':
        attrs.partitioned = true;
        break;
      case 'priority':
        attrs.priority = value;
        break;
      default:
        unknownAttributes.push({ name, value });
    }
  }

  const issues: IssueCode[] = [];
  if (!first.hasEquals) issues.push('noEquals');
  else if (first.name === '') issues.push('emptyName');

  if (attrs.sameSite?.value === 'invalid') issues.push('sameSiteInvalid');
  if (attrs.sameSite?.value === 'none' && !attrs.secure) {
    issues.push('sameSiteNoneNoSecure');
  }
  if (attrs.partitioned && !attrs.secure) issues.push('partitionedNoSecure');
  if (attrs.expires && attrs.expires.ms === null) issues.push('expiresInvalid');
  if (attrs.maxAge && attrs.maxAge.seconds === null)
    issues.push('maxAgeInvalid');
  if (attrs.expires?.ms != null && attrs.maxAge?.seconds != null) {
    issues.push('bothExpiry');
  }

  // 有効期限: Max-Age が優先される
  let lifetime: Lifetime = 'session';
  let lifetimeMs: number | null = null;
  if (attrs.maxAge?.seconds != null) {
    lifetimeMs = attrs.maxAge.seconds * 1000;
    lifetime = attrs.maxAge.seconds <= 0 ? 'expired' : 'persistent';
  } else if (attrs.expires?.ms != null) {
    lifetimeMs = attrs.expires.ms - now;
    lifetime = attrs.expires.ms <= now ? 'expired' : 'persistent';
  }
  if (lifetime === 'expired') issues.push('expired');
  if (
    lifetime === 'persistent' &&
    lifetimeMs !== null &&
    lifetimeMs > 400 * DAY_MS
  ) {
    issues.push('lifetimeOver400d');
  }

  const lowerName = first.name.toLowerCase();
  if (lowerName.startsWith('__secure-') && !attrs.secure) {
    issues.push('prefixSecureInvalid');
  }
  if (
    lowerName.startsWith('__host-') &&
    (!attrs.secure || attrs.domain !== null || attrs.path !== '/')
  ) {
    issues.push('prefixHostInvalid');
  }

  if (!attrs.secure) issues.push('secureMissing');
  if (!attrs.httpOnly) issues.push('httpOnlyMissing');
  if (!attrs.sameSite) issues.push('sameSiteMissing');

  return {
    kind: 'set',
    name: first.name,
    value: first.value,
    decoded: tryDecode(first.value),
    attributes: attrs,
    unknownAttributes,
    lifetime,
    issues,
  };
}

function parseRequestCookie(body: string): CookieEntry[] {
  const entries: CookieEntry[] = [];
  for (const part of body.split(';')) {
    if (part.trim() === '') continue;
    const { name, value, hasEquals } = splitNameValue(part);
    const issues: IssueCode[] = [];
    if (!hasEquals) issues.push('noEquals');
    else if (name === '') issues.push('emptyName');
    entries.push({
      kind: 'request',
      name,
      value,
      decoded: tryDecode(value),
      attributes: null,
      unknownAttributes: [],
      lifetime: null,
      issues,
    });
  }
  return entries;
}

/**
 * Cookie / Set-Cookie の文字列を解析する。複数行の場合は行ごとに処理する。
 * 行頭の "Set-Cookie:" / "Cookie:" があればそれを優先し、なければ mode に従う
 * （auto は属性の有無で判定）。
 */
export function parseCookies(
  text: string,
  mode: CookieMode = 'auto',
  now: number = Date.now(),
): ParseResult {
  const entries: CookieEntry[] = [];
  const kinds = new Set<CookieKind>();

  for (const rawLine of text.split(/\r\n|\r|\n/)) {
    if (rawLine.trim() === '') continue;
    const { body, kind: prefixKind } = stripHeaderName(rawLine);
    if (body === '') continue;
    let kind: CookieKind;
    if (prefixKind) kind = prefixKind;
    else if (mode === 'cookie') kind = 'request';
    else if (mode === 'set-cookie') kind = 'set';
    else kind = looksLikeSetCookie(body) ? 'set' : 'request';

    kinds.add(kind);
    if (kind === 'set') entries.push(parseSetCookie(body, now));
    else entries.push(...parseRequestCookie(body));
  }

  // 同一名の重複（Cookie ヘッダーのみ）
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (e.kind === 'request' && e.name) {
      counts.set(e.name, (counts.get(e.name) ?? 0) + 1);
    }
  }
  for (const e of entries) {
    if (e.kind === 'request' && (counts.get(e.name) ?? 0) > 1) {
      e.issues.push('duplicateName');
    }
  }

  let detected: ParseResult['detected'] = null;
  if (kinds.size === 2) detected = 'mixed';
  else if (kinds.size === 1) detected = [...kinds][0];
  return { entries, detected };
}

/** 値を控えめに表示するためのマスク（先頭 2 文字だけ残す） */
export function maskValue(value: string): string {
  const chars = Array.from(value);
  if (chars.length === 0) return '';
  if (chars.length <= 4) return '•'.repeat(chars.length);
  return (
    chars.slice(0, 2).join('') + '•'.repeat(Math.min(chars.length - 2, 10))
  );
}

/** コピー用の JSON。includeValue が false の場合は値をマスクする */
export function toJson(entries: CookieEntry[], includeValue: boolean): string {
  const out = entries.map((e) => ({
    kind: e.kind,
    name: e.name,
    value: includeValue ? e.value : maskValue(e.value),
    valueLength: e.value.length,
    ...(e.attributes
      ? {
          attributes: {
            domain: e.attributes.domain,
            path: e.attributes.path,
            expires: e.attributes.expires?.raw ?? null,
            maxAge: e.attributes.maxAge?.raw ?? null,
            secure: e.attributes.secure,
            httpOnly: e.attributes.httpOnly,
            sameSite: e.attributes.sameSite?.raw ?? null,
            partitioned: e.attributes.partitioned,
            priority: e.attributes.priority,
          },
        }
      : {}),
    issues: e.issues,
  }));
  return JSON.stringify(out, null, 2);
}

/** 秒数を「N日 N時間 N分 N秒」風の部品に分解する */
export function splitDuration(seconds: number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} {
  const abs = Math.abs(Math.trunc(seconds));
  return {
    days: Math.floor(abs / 86400),
    hours: Math.floor((abs % 86400) / 3600),
    minutes: Math.floor((abs % 3600) / 60),
    seconds: abs % 60,
  };
}
