import {
  hashPassword,
  MAX_PASSWORD_BYTES,
  passwordByteLength,
} from './bcrypt-generator';

export { MIN_COST, MAX_COST, DEFAULT_COST } from './bcrypt-generator';

export type HtpasswdAlgorithm = 'bcrypt' | 'sha1';

/** 一度に処理するユーザー数の上限（bcryptの計算でブラウザが固まらないように） */
export const MAX_USERS = 100;

export interface HtpasswdEntry {
  /** 入力テキスト上の行番号（1始まり） */
  line: number;
  username: string;
  password: string;
}

export type HtpasswdLineError =
  | 'missing-colon'
  | 'empty-username'
  | 'invalid-username'
  | 'empty-password'
  | 'duplicate-username'
  | 'password-too-long';

export interface HtpasswdIssue {
  line: number;
  error: HtpasswdLineError;
}

export interface ParsedUsers {
  entries: HtpasswdEntry[];
  issues: HtpasswdIssue[];
  /** 上限を超えた分は処理しない */
  truncated: boolean;
}

export interface HtpasswdResult {
  /** 生成した .htpasswd の行 */
  lines: string[];
  /** 各ユーザーの Authorization ヘッダー（lines と同じ順） */
  headers: string[];
  issues: HtpasswdIssue[];
  truncated: boolean;
}

/**
 * 「ユーザー名:パスワード」を1行1ユーザーで解析する。
 * 最初の「:」で分割するので、パスワードに「:」を含められる。空行は無視する。
 */
export function parseUsers(text: string): ParsedUsers {
  const entries: HtpasswdEntry[] = [];
  const issues: HtpasswdIssue[] = [];
  const seen = new Set<string>();
  let truncated = false;
  const rawLines = text.split(/\r\n|\r|\n/);
  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    if (raw.trim() === '') continue;
    const line = i + 1;
    const idx = raw.indexOf(':');
    if (idx < 0) {
      issues.push({ line, error: 'missing-colon' });
      continue;
    }
    const username = raw.slice(0, idx);
    const password = raw.slice(idx + 1);
    if (username === '') {
      issues.push({ line, error: 'empty-username' });
      continue;
    }
    if (
      // eslint-disable-next-line no-control-regex
      /[\u0000-\u001f\u007f]/.test(username) ||
      username !== username.trim()
    ) {
      issues.push({ line, error: 'invalid-username' });
      continue;
    }
    if (password === '') {
      issues.push({ line, error: 'empty-password' });
      continue;
    }
    if (seen.has(username)) {
      issues.push({ line, error: 'duplicate-username' });
      continue;
    }
    if (entries.length >= MAX_USERS) {
      truncated = true;
      break;
    }
    seen.add(username);
    entries.push({ line, username, password });
  }
  return { entries, issues, truncated };
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

/** UTF-8でエンコードしたうえでBase64にする */
export function utf8ToBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

/** .htpasswd のSHA-1形式（{SHA}＋SHA-1のBase64） */
export async function sha1Htpasswd(password: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    'SHA-1',
    new TextEncoder().encode(password),
  );
  return `{SHA}${bytesToBase64(new Uint8Array(digest))}`;
}

/** bcryptの$2b$はApacheが確実に読める$2y$に揃える（計算結果は同じ） */
export function toApacheBcrypt(hash: string): string {
  return hash.replace(/^\$2[ab]\$/, '$2y$');
}

/** Basic認証の Authorization ヘッダー値を作る */
export function basicAuthHeader(username: string, password: string): string {
  return `Authorization: Basic ${utf8ToBase64(`${username}:${password}`)}`;
}

export async function generateHtpasswd(
  text: string,
  algorithm: HtpasswdAlgorithm,
  cost: number,
): Promise<HtpasswdResult> {
  const parsed = parseUsers(text);
  const issues = [...parsed.issues];
  const lines: string[] = [];
  const headers: string[] = [];
  for (const entry of parsed.entries) {
    let hash: string;
    if (algorithm === 'sha1') {
      hash = await sha1Htpasswd(entry.password);
    } else {
      if (passwordByteLength(entry.password) > MAX_PASSWORD_BYTES) {
        issues.push({ line: entry.line, error: 'password-too-long' });
        continue;
      }
      const result = await hashPassword(entry.password, cost);
      if (!result.success) {
        throw new RangeError(`invalid bcrypt cost: ${cost}`);
      }
      hash = toApacheBcrypt(result.hash);
    }
    lines.push(`${entry.username}:${hash}`);
    headers.push(basicAuthHeader(entry.username, entry.password));
  }
  issues.sort((a, b) => a.line - b.line);
  return { lines, headers, issues, truncated: parsed.truncated };
}
