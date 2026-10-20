/**
 * メールヘッダー解析のロジック（文言・DOMを持たない）。
 * 折り返し(folded)ヘッダーのunfold、RFC 2047 エンコード語のデコード、
 * Receivedの経路と各ホップの遅延、Authentication-Resultsの判定、
 * From / Return-Path / Reply-To の不一致検出を行う。
 */

export interface RawHeader {
  name: string;
  value: string;
}

export interface ParsedHeaders {
  headers: RawHeader[];
  /** ヘッダーとして読み取れず無視した行数（空行は数えない） */
  invalidCount: number;
}

const HEADER_LINE = /^([!-9;-~]+):[ \t]*(.*)$/;

/** 生のヘッダーテキストを unfold して name/value の配列にする。最初の空行（本文との境界）で止める。 */
export function parseRawHeaders(input: string): ParsedHeaders {
  const lines = input.replace(/\r\n?/g, '\n').split('\n');
  const headers: RawHeader[] = [];
  let invalidCount = 0;
  let current: RawHeader | null = null;

  for (const line of lines) {
    if (line.trim() === '') {
      if (headers.length > 0) break;
      continue;
    }
    if (/^[ \t]/.test(line) && current) {
      current.value = `${current.value} ${line.trim()}`.trim();
      continue;
    }
    const match = HEADER_LINE.exec(line);
    if (match) {
      current = { name: match[1], value: match[2].trim() };
      headers.push(current);
    } else {
      current = null;
      // mbox の "From " 行は無視対象としてカウントしない
      if (!/^From /.test(line)) invalidCount++;
    }
  }
  return { headers, invalidCount };
}

function getAll(headers: RawHeader[], name: string): string[] {
  const lower = name.toLowerCase();
  return headers
    .filter((h) => h.name.toLowerCase() === lower)
    .map((h) => h.value);
}

function getFirst(headers: RawHeader[], name: string): string | undefined {
  return getAll(headers, name)[0];
}

// ---------- RFC 2047 ----------

function decodeBytes(bytes: number[], charset: string): string {
  try {
    return new TextDecoder(charset.toLowerCase()).decode(new Uint8Array(bytes));
  } catch {
    return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
  }
}

function decodeEncodedText(encoding: string, text: string): number[] {
  const bytes: number[] = [];
  if (encoding.toLowerCase() === 'b') {
    let binary: string;
    try {
      binary = atob(text.replace(/[^A-Za-z0-9+/]/g, ''));
    } catch {
      binary = '';
    }
    for (let i = 0; i < binary.length; i++) bytes.push(binary.charCodeAt(i));
    return bytes;
  }
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '_') bytes.push(0x20);
    else if (ch === '=' && /^[0-9A-Fa-f]{2}$/.test(text.slice(i + 1, i + 3))) {
      bytes.push(parseInt(text.slice(i + 1, i + 3), 16));
      i += 2;
    } else bytes.push(ch.charCodeAt(0) & 0xff);
  }
  return bytes;
}

/** RFC 2047 のエンコード語（=?charset?B/Q?...?=）をデコードする。デコードできない語はそのまま残す。 */
export function decodeMimeWords(value: string): string {
  const word = /=\?([^?\s]+)\?([bBqQ])\?([^?\s]*)\?=/g;
  // エンコード語どうしの間の空白は無視する
  const collapsed = value.replace(
    /(=\?[^?\s]+\?[bBqQ]\?[^?\s]*\?=)\s+(?==\?[^?\s]+\?[bBqQ]\?)/g,
    '$1',
  );
  let result = '';
  let lastIndex = 0;
  let runCharset = '';
  let runBytes: number[] = [];

  const flush = () => {
    if (runBytes.length > 0) {
      result += decodeBytes(runBytes, runCharset);
      runBytes = [];
      runCharset = '';
    }
  };

  for (const m of collapsed.matchAll(word)) {
    const index = m.index ?? 0;
    const between = collapsed.slice(lastIndex, index);
    if (between !== '') {
      flush();
      result += between;
    }
    // 言語指定（charset*lang）は charset だけ使う
    const charset = m[1].split('*')[0];
    if (
      runBytes.length > 0 &&
      runCharset.toLowerCase() !== charset.toLowerCase()
    ) {
      flush();
    }
    runCharset = charset;
    runBytes.push(...decodeEncodedText(m[2], m[3]));
    lastIndex = index + m[0].length;
  }
  flush();
  return result + collapsed.slice(lastIndex);
}

// ---------- アドレス ----------

export interface Mailbox {
  address: string | null;
  domain: string | null;
  displayName: string;
}

export function parseMailbox(raw: string | undefined): Mailbox | null {
  if (raw === undefined) return null;
  const decoded = decodeMimeWords(raw).trim();
  if (decoded === '') return null;
  const angle = /<([^>]*)>/.exec(decoded);
  let address: string | null;
  let displayName: string;
  if (angle) {
    address = angle[1].trim().toLowerCase() || null;
    displayName = decoded.slice(0, angle.index).trim();
  } else {
    const plain = /[^\s<>(),;"]+@[^\s<>(),;"]+/.exec(decoded);
    address = plain ? plain[0].toLowerCase() : null;
    displayName = plain
      ? decoded.replace(plain[0], '').replace(/[()]/g, '').trim()
      : decoded;
  }
  displayName = displayName.replace(/^"(.*)"$/, '$1').trim();
  if (address !== null && !address.includes('@')) address = null;
  const domain = address ? address.slice(address.lastIndexOf('@') + 1) : null;
  return { address, domain, displayName };
}

export function isAlignedDomain(a: string, b: string): boolean {
  return a === b || a.endsWith(`.${b}`) || b.endsWith(`.${a}`);
}

// ---------- Received ----------

export interface Hop {
  /** 1 が送信元に最も近いホップ */
  index: number;
  from: string | null;
  by: string | null;
  with: string | null;
  ip: string | null;
  /** UTCミリ秒。日時が読めなければ null */
  time: number | null;
  /** 直前のホップ（時刻が読めるもの）からの経過秒。先頭や不明は null */
  delaySeconds: number | null;
  rawDate: string;
}

function parseReceived(value: string): Omit<Hop, 'index' | 'delaySeconds'> {
  const semi = value.lastIndexOf(';');
  const body = semi >= 0 ? value.slice(0, semi) : value;
  const rawDate = semi >= 0 ? value.slice(semi + 1).trim() : '';
  const from = /\bfrom\s+(\S+)/i.exec(body);
  const by = /\bby\s+(\S+)/i.exec(body);
  const withMatch = /\bwith\s+(\S+)/i.exec(body);
  const ipv4 = /\[(\d{1,3}(?:\.\d{1,3}){3})\]/.exec(body);
  const ipv6 = /\[(?:IPv6:)?([0-9a-f]*:[0-9a-f:.]+)\]/i.exec(body);
  const cleanedDate = rawDate.replace(/\([^)]*\)/g, '').trim();
  const parsed = cleanedDate === '' ? NaN : Date.parse(cleanedDate);
  return {
    from: from ? from[1] : null,
    by: by ? by[1] : null,
    with: withMatch ? withMatch[1].replace(/;$/, '') : null,
    ip: ipv4 ? ipv4[1] : ipv6 ? ipv6[1] : null,
    time: Number.isNaN(parsed) ? null : parsed,
    rawDate,
  };
}

/** Received ヘッダー（新しい順に並ぶ）を、送信元に近い順のホップ配列にする。 */
export function parseHops(receivedNewestFirst: string[]): Hop[] {
  const ordered = [...receivedNewestFirst].reverse().map(parseReceived);
  let previousTime: number | null = null;
  return ordered.map((hop, i) => {
    let delaySeconds: number | null = null;
    if (hop.time !== null) {
      if (previousTime !== null) {
        delaySeconds = Math.round((hop.time - previousTime) / 1000);
      }
      previousTime = hop.time;
    }
    return { ...hop, index: i + 1, delaySeconds };
  });
}

/** 秒数を "1h 02m 03s" 形式にする（負数は先頭に - を付ける）。 */
export function formatDuration(seconds: number): string {
  const sign = seconds < 0 ? '-' : '';
  let rest = Math.abs(Math.round(seconds));
  const h = Math.floor(rest / 3600);
  rest -= h * 3600;
  const m = Math.floor(rest / 60);
  const s = rest - m * 60;
  if (h > 0) {
    return `${sign}${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
  }
  if (m > 0) return `${sign}${m}m ${String(s).padStart(2, '0')}s`;
  return `${sign}${s}s`;
}

// ---------- 認証結果 ----------

export type AuthMethod = 'spf' | 'dkim' | 'dmarc' | 'arc' | 'compauth';
export type AuthStatus = 'pass' | 'warn' | 'fail';

export interface AuthResult {
  method: AuthMethod;
  result: string;
  detail: string;
  source: 'Authentication-Results' | 'Received-SPF';
  status: AuthStatus;
}

function authStatus(result: string): AuthStatus {
  const r = result.toLowerCase();
  if (r === 'pass') return 'pass';
  if (r === 'fail' || r === 'permerror') return 'fail';
  return 'warn';
}

export function parseAuthResults(headers: RawHeader[]): AuthResult[] {
  const results: AuthResult[] = [];
  for (const value of getAll(headers, 'Authentication-Results')) {
    const cleaned = value.replace(/\([^)]*\)/g, ' ');
    for (const segment of cleaned.split(';')) {
      const m = /^\s*(spf|dkim|dmarc|arc|compauth)=([a-z]+)(.*)$/is.exec(
        segment,
      );
      if (!m) continue;
      results.push({
        method: m[1].toLowerCase() as AuthMethod,
        result: m[2].toLowerCase(),
        detail: m[3].replace(/\s+/g, ' ').trim(),
        source: 'Authentication-Results',
        status: authStatus(m[2]),
      });
    }
  }
  for (const value of getAll(headers, 'Received-SPF')) {
    const m =
      /^\s*(pass|fail|softfail|neutral|none|temperror|permerror)\b(.*)$/is.exec(
        value,
      );
    if (!m) continue;
    results.push({
      method: 'spf',
      result: m[1].toLowerCase(),
      detail: m[2]
        .replace(/\([^)]*\)/g, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
      source: 'Received-SPF',
      status: authStatus(m[1]),
    });
  }
  return results;
}

// ---------- 総合解析 ----------

export type WarningCode =
  | 'noAuthResults'
  | 'spfFail'
  | 'spfSoftfail'
  | 'dkimFail'
  | 'dmarcFail'
  | 'authNotPass'
  | 'returnPathMismatch'
  | 'replyToMismatch'
  | 'displayNameSpoof'
  | 'noReceived'
  | 'negativeDelay'
  | 'longDelay'
  | 'noMessageId'
  | 'noDate';

export interface Warning {
  code: WarningCode;
  /** 関係するドメインやホップ番号など（表示用の補足） */
  detail?: string;
}

export interface MessageSummary {
  subject: string;
  from: Mailbox | null;
  to: string;
  date: string;
  messageId: string;
  returnPath: Mailbox | null;
  replyTo: Mailbox | null;
}

export interface EmailAnalysis {
  summary: MessageSummary;
  hops: Hop[];
  /** 最初と最後のホップの時刻差（秒）。算出できなければ null */
  totalDelaySeconds: number | null;
  auth: AuthResult[];
  warnings: Warning[];
}

/** この秒数を超えるホップ間の遅延を「長い」とみなす */
export const LONG_DELAY_SECONDS = 300;

export function analyzeEmailHeaders(headers: RawHeader[]): EmailAnalysis {
  const from = parseMailbox(getFirst(headers, 'From'));
  const returnPath = parseMailbox(getFirst(headers, 'Return-Path'));
  const replyTo = parseMailbox(getFirst(headers, 'Reply-To'));
  const summary: MessageSummary = {
    subject: decodeMimeWords(getFirst(headers, 'Subject') ?? ''),
    from,
    to: decodeMimeWords(getFirst(headers, 'To') ?? ''),
    date: getFirst(headers, 'Date') ?? '',
    messageId: getFirst(headers, 'Message-ID') ?? '',
    returnPath,
    replyTo,
  };

  const hops = parseHops(getAll(headers, 'Received'));
  const timed = hops.filter((h) => h.time !== null);
  const totalDelaySeconds =
    timed.length >= 2
      ? Math.round(
          ((timed[timed.length - 1].time as number) -
            (timed[0].time as number)) /
            1000,
        )
      : null;

  const auth = parseAuthResults(headers);
  const warnings: Warning[] = [];

  if (auth.length === 0) warnings.push({ code: 'noAuthResults' });
  for (const a of auth) {
    if (a.method === 'spf') {
      if (a.result === 'softfail') warnings.push({ code: 'spfSoftfail' });
      else if (a.status === 'fail') warnings.push({ code: 'spfFail' });
      else if (a.status === 'warn') {
        warnings.push({ code: 'authNotPass', detail: `spf=${a.result}` });
      }
    } else if (a.method === 'dkim') {
      if (a.status === 'fail') warnings.push({ code: 'dkimFail' });
      else if (a.status === 'warn') {
        warnings.push({ code: 'authNotPass', detail: `dkim=${a.result}` });
      }
    } else if (a.method === 'dmarc') {
      if (a.status === 'fail') warnings.push({ code: 'dmarcFail' });
      else if (a.status === 'warn') {
        warnings.push({ code: 'authNotPass', detail: `dmarc=${a.result}` });
      }
    }
  }

  if (from?.domain) {
    if (
      returnPath?.domain &&
      !isAlignedDomain(from.domain, returnPath.domain)
    ) {
      warnings.push({
        code: 'returnPathMismatch',
        detail: `${from.domain} / ${returnPath.domain}`,
      });
    }
    if (replyTo?.domain && !isAlignedDomain(from.domain, replyTo.domain)) {
      warnings.push({
        code: 'replyToMismatch',
        detail: `${from.domain} / ${replyTo.domain}`,
      });
    }
    const embedded = /[^\s<>(),;"]+@([^\s<>(),;"]+)/.exec(from.displayName);
    if (embedded && !isAlignedDomain(embedded[1].toLowerCase(), from.domain)) {
      warnings.push({
        code: 'displayNameSpoof',
        detail: `${embedded[0]} / ${from.address}`,
      });
    }
  }

  if (hops.length === 0) warnings.push({ code: 'noReceived' });
  for (const hop of hops) {
    if (hop.delaySeconds === null) continue;
    if (hop.delaySeconds < -60) {
      warnings.push({ code: 'negativeDelay', detail: `#${hop.index}` });
    } else if (hop.delaySeconds >= LONG_DELAY_SECONDS) {
      warnings.push({
        code: 'longDelay',
        detail: `#${hop.index} (${formatDuration(hop.delaySeconds)})`,
      });
    }
  }
  if (summary.messageId === '') warnings.push({ code: 'noMessageId' });
  if (summary.date === '') warnings.push({ code: 'noDate' });

  return { summary, hops, totalDelaySeconds, auth, warnings };
}
