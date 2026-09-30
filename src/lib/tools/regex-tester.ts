export interface RegexGroupMatch {
  name: string | null;
  value: string | undefined;
}

export interface RegexMatchResult {
  match: string;
  index: number;
  groups: RegexGroupMatch[];
}

export interface RegexTestResult {
  isValid: boolean;
  error: string | null;
  matches: RegexMatchResult[];
}

/** 「全マッチ検索」表示のため、常に g フラグを補って RegExp を組み立てる */
function buildGlobalRegex(pattern: string, flags: string): RegExp {
  const normalizedFlags = flags.includes('g') ? flags : `${flags}g`;
  return new RegExp(pattern, normalizedFlags);
}

/**
 * パターン中に出現するキャプチャグループを先頭から走査し、
 * 名前付きグループなら名前を、そうでなければ null を、出現順の配列として返す。
 * 非キャプチャグループ `(?:...)` や先読み・後読みはキャプチャグループとして数えない。
 */
function getCaptureGroupNames(source: string): (string | null)[] {
  const names: (string | null)[] = [];
  let i = 0;
  let inClass = false;
  while (i < source.length) {
    const ch = source[i];
    if (ch === '\\') {
      i += 2;
      continue;
    }
    if (inClass) {
      if (ch === ']') inClass = false;
      i++;
      continue;
    }
    if (ch === '[') {
      inClass = true;
      i++;
      continue;
    }
    if (ch === '(') {
      if (source[i + 1] === '?') {
        const c2 = source[i + 2];
        if (c2 === ':' || c2 === '=' || c2 === '!') {
          i += 3;
          continue;
        }
        if (c2 === '<' && (source[i + 3] === '=' || source[i + 3] === '!')) {
          i += 4;
          continue;
        }
        if (c2 === '<') {
          const end = source.indexOf('>', i + 3);
          names.push(source.slice(i + 3, end));
          i = end + 1;
          continue;
        }
      }
      names.push(null);
      i++;
      continue;
    }
    i++;
  }
  return names;
}

export function testRegex(
  pattern: string,
  flags: string,
  text: string,
): RegexTestResult {
  if (pattern === '') {
    return { isValid: true, error: null, matches: [] };
  }

  let regex: RegExp;
  try {
    regex = buildGlobalRegex(pattern, flags);
  } catch (e) {
    return { isValid: false, error: (e as Error).message, matches: [] };
  }

  const groupNames = getCaptureGroupNames(regex.source);
  const matches: RegexMatchResult[] = [];
  for (const m of text.matchAll(regex)) {
    const groups: RegexGroupMatch[] = [];
    for (let i = 1; i < m.length; i++) {
      groups.push({ name: groupNames[i - 1] ?? null, value: m[i] });
    }
    matches.push({ match: m[0], index: m.index ?? 0, groups });
  }
  return { isValid: true, error: null, matches };
}

export interface RegexReplaceResult {
  result: string;
  error: string | null;
}

export function replaceWithRegex(
  pattern: string,
  flags: string,
  text: string,
  replacement: string,
): RegexReplaceResult {
  if (pattern === '') {
    return { result: text, error: null };
  }

  try {
    const regex = buildGlobalRegex(pattern, flags);
    return { result: text.replace(regex, replacement), error: null };
  } catch (e) {
    return { result: text, error: (e as Error).message };
  }
}

/** Worker（または同期フォールバック）に渡す、1回分の正規表現テスト・置換の依頼 */
export interface RegexJobRequest {
  id: number;
  pattern: string;
  flags: string;
  text: string;
  /** 空文字のときは置換を行わない */
  replacement: string;
}

export interface RegexJobResponse {
  id: number;
  test: RegexTestResult;
  /** replacement が空、またはパターンが不正・空のとき null */
  replace: RegexReplaceResult | null;
}

/** テストと置換をまとめて実行する。Worker 内でも、メインスレッドのフォールバックでも同じ関数を使う */
export function runRegexJob(request: RegexJobRequest): RegexJobResponse {
  const { id, pattern, flags, text, replacement } = request;
  const test = testRegex(pattern, flags, text);
  const replace =
    test.isValid && pattern !== '' && replacement !== ''
      ? replaceWithRegex(pattern, flags, text, replacement)
      : null;
  return { id, test, replace };
}
