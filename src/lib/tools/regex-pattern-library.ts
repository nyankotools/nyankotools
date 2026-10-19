/**
 * 正規表現パターン集の静的データと検索ロジック。
 * 名前・説明文は i18n 辞書側で持つ。ここにはパターン本体・フラグ・分類・
 * 一致/不一致の例といった全ロケール共通の事実だけを置く。
 * 例は Vitest で実際に RegExp にかけて検証している（regex-pattern-library.test.ts）。
 * パターンは JavaScript（ECMAScript）の正規表現として書いてあり、`/` のエスケープは不要。
 */

export const PATTERN_CATEGORIES = [
  'japan',
  'chars',
  'web',
  'datetime',
  'number',
  'dev',
] as const;
export type PatternCategory = (typeof PATTERN_CATEGORIES)[number];
export type CategoryFilter = PatternCategory | 'all';

export interface RegexPattern {
  /** 辞書キー（一意） */
  id: string;
  category: PatternCategory;
  /** パターン本体（スラッシュなし） */
  pattern: string;
  /** フラグ（なければ空文字） */
  flags: string;
  /** 一致するべき例 */
  matches: readonly string[];
  /** 一致してはいけない例 */
  nonMatches: readonly string[];
}

export const PATTERNS = [
  // --- 日本向け ---
  {
    id: 'postal-jp',
    category: 'japan',
    pattern: String.raw`^\d{3}-?\d{4}$`,
    flags: '',
    matches: ['100-0001', '1000001'],
    nonMatches: ['100-001', '10-00001', '100--0001'],
  },
  {
    id: 'postal-jp-hyphen',
    category: 'japan',
    pattern: String.raw`^\d{3}-\d{4}$`,
    flags: '',
    matches: ['100-0001', '060-0000'],
    nonMatches: ['1000001', '100-00011'],
  },
  {
    id: 'phone-jp-mobile',
    category: 'japan',
    pattern: String.raw`^0[789]0-?\d{4}-?\d{4}$`,
    flags: '',
    matches: ['090-1234-5678', '08012345678'],
    nonMatches: ['060-1234-5678', '090-123-45678', '0901234567'],
  },
  {
    id: 'phone-jp-hyphen',
    category: 'japan',
    pattern: String.raw`^0\d{1,4}-\d{1,4}-\d{4}$`,
    flags: '',
    matches: ['03-1234-5678', '045-123-4567', '0123-45-6789'],
    nonMatches: ['3-1234-5678', '03-1234-567', '0312345678'],
  },
  {
    id: 'phone-jp-digits',
    category: 'japan',
    pattern: String.raw`^0\d{9,10}$`,
    flags: '',
    matches: ['0312345678', '09012345678'],
    nonMatches: ['312345678', '031234567', '03-1234-5678'],
  },
  {
    id: 'my-number',
    category: 'japan',
    pattern: String.raw`^\d{12}$`,
    flags: '',
    matches: ['123456789012'],
    nonMatches: ['12345678901', '1234-5678-9012', '1234567890123'],
  },
  {
    id: 'katakana',
    category: 'japan',
    pattern: String.raw`^[ァ-ヶー]+$`,
    flags: '',
    matches: ['ヤマダ', 'ラーメン'],
    nonMatches: ['やまだ', 'ヤマダ1', 'ﾔﾏﾀﾞ', ''],
  },
  {
    id: 'hiragana',
    category: 'japan',
    pattern: String.raw`^[ぁ-んー]+$`,
    flags: '',
    matches: ['やまだ', 'らーめん'],
    nonMatches: ['ヤマダ', '山田', 'やまだ1'],
  },
  {
    id: 'kanji',
    category: 'japan',
    pattern: String.raw`^[\p{Script=Han}々]+$`,
    flags: 'u',
    matches: ['山田', '佐々木'],
    nonMatches: ['やまだ', '山田1', 'Yamada'],
  },
  // --- 文字種 ---
  {
    id: 'hankaku-kana',
    category: 'chars',
    pattern: String.raw`^[ｦ-ﾟ]+$`,
    flags: '',
    matches: ['ﾔﾏﾀﾞ', 'ｱｲｳ'],
    nonMatches: ['ヤマダ', 'ﾔﾏﾀﾞ1'],
  },
  {
    id: 'zenkaku-digits',
    category: 'chars',
    pattern: String.raw`^[０-９]+$`,
    flags: '',
    matches: ['１２３', '０'],
    nonMatches: ['123', '１2', '１２３４５a'],
  },
  {
    id: 'alnum',
    category: 'chars',
    pattern: String.raw`^[A-Za-z0-9]+$`,
    flags: '',
    matches: ['abc123', 'ABC'],
    nonMatches: ['abc 123', 'abc_123', 'ａｂｃ'],
  },
  {
    id: 'no-ascii',
    category: 'chars',
    pattern: String.raw`[^\x00-\x7F]`,
    flags: '',
    matches: ['abcあ', 'é'],
    nonMatches: ['abc 123', 'Hello, World!'],
  },
  {
    id: 'trim-spaces',
    category: 'chars',
    pattern: String.raw`^\s+|\s+$`,
    flags: 'g',
    matches: [' hello', 'hello  ', '\thello\n'],
    nonMatches: ['hello', 'hello world'],
  },
  {
    id: 'blank-line',
    category: 'chars',
    pattern: String.raw`^\s*$`,
    flags: 'm',
    matches: ['', 'a\n\nb', '   '],
    nonMatches: ['abc', 'a\nb'],
  },
  // --- Web ---
  {
    id: 'email',
    category: 'web',
    pattern: String.raw`^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$`,
    flags: '',
    matches: ['a@example.com', 'user.name+tag@sub.example.co.jp'],
    nonMatches: ['a@b', '@example.com', 'a@@example.com', 'a b@example.com'],
  },
  {
    id: 'url-http',
    category: 'web',
    pattern: String.raw`^https?://[^\s/$.?#][^\s]*$`,
    flags: 'i',
    matches: [
      'https://example.com/path?x=1',
      'http://localhost:3000',
      'HTTP://A.COM',
    ],
    nonMatches: [
      'ftp://example.com',
      'example.com',
      'https://exa mple.com',
      'https://',
    ],
  },
  {
    id: 'domain',
    category: 'web',
    pattern: String.raw`^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$`,
    flags: 'i',
    matches: ['example.com', 'sub.example.co.jp', 'xn--abc.example'],
    nonMatches: ['-a.com', 'example', 'a..com', 'a_b.com'],
  },
  {
    id: 'ipv4',
    category: 'web',
    pattern: String.raw`^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$`,
    flags: '',
    matches: ['192.168.0.1', '255.255.255.255', '0.0.0.0'],
    nonMatches: ['256.1.1.1', '192.168.0', '01.2.3.4', '1.2.3.4.5'],
  },
  {
    id: 'mac-address',
    category: 'web',
    pattern: String.raw`^(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$`,
    flags: '',
    matches: ['00:1A:2B:3C:4D:5E', '00-1a-2b-3c-4d-5e'],
    nonMatches: ['00:1A:2B:3C:4D', '00:1A:2B:3C:4D:5G', '001A.2B3C.4D5E'],
  },
  {
    id: 'hex-color',
    category: 'web',
    pattern: String.raw`^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$`,
    flags: '',
    matches: ['#fff', '#1A2b3C'],
    nonMatches: ['#ffff', 'fff', '#ggg'],
  },
  {
    id: 'x-handle',
    category: 'web',
    pattern: String.raw`^@?[A-Za-z0-9_]{1,15}$`,
    flags: '',
    matches: ['@nyanko_tools', 'user123'],
    nonMatches: ['@too_long_name_12345', 'a-b', '@'],
  },
  // --- 日付・時刻 ---
  {
    id: 'date-iso',
    category: 'datetime',
    pattern: String.raw`^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$`,
    flags: '',
    matches: ['2026-10-19', '2024-02-29'],
    nonMatches: ['2026-13-01', '2026-10-32', '2026/10/19', '2026-1-5'],
  },
  {
    id: 'date-slash',
    category: 'datetime',
    pattern: String.raw`^\d{4}/(?:0?[1-9]|1[0-2])/(?:0?[1-9]|[12]\d|3[01])$`,
    flags: '',
    matches: ['2026/1/5', '2026/10/19'],
    nonMatches: ['2026/00/10', '2026/10/32', '2026-10-19'],
  },
  {
    id: 'time-24h',
    category: 'datetime',
    pattern: String.raw`^(?:[01]\d|2[0-3]):[0-5]\d$`,
    flags: '',
    matches: ['00:00', '09:30', '23:59'],
    nonMatches: ['24:00', '12:60', '9:30'],
  },
  // --- 数値 ---
  {
    id: 'integer',
    category: 'number',
    pattern: String.raw`^-?\d+$`,
    flags: '',
    matches: ['0', '-42', '007'],
    nonMatches: ['1.5', '+3', '--1', ''],
  },
  {
    id: 'decimal',
    category: 'number',
    pattern: String.raw`^-?\d+(?:\.\d+)?$`,
    flags: '',
    matches: ['3.14', '-0.5', '10'],
    nonMatches: ['.5', '1.', '1,5'],
  },
  {
    id: 'comma-number',
    category: 'number',
    pattern: String.raw`^\d{1,3}(?:,\d{3})*$`,
    flags: '',
    matches: ['1,234,567', '999'],
    nonMatches: ['1234,567', '12,34', '1,2345'],
  },
  // --- 開発 ---
  {
    id: 'uuid',
    category: 'dev',
    pattern: String.raw`^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$`,
    flags: 'i',
    matches: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123E4567-E89B-12D3-A456-426614174000',
    ],
    nonMatches: ['123e4567e89b12d3a456426614174000', '123e4567-e89b-12d3-a456'],
  },
  {
    id: 'semver',
    category: 'dev',
    pattern: String.raw`^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$`,
    flags: '',
    matches: ['1.2.3', '1.0.0-beta.1+build.5', '0.0.1'],
    nonMatches: ['01.2.3', '1.2', 'v1.2.3'],
  },
  {
    id: 'slug',
    category: 'dev',
    pattern: String.raw`^[a-z0-9]+(?:-[a-z0-9]+)*$`,
    flags: '',
    matches: ['my-post-1', 'abc'],
    nonMatches: ['-a', 'a--b', 'A', 'a-'],
  },
  {
    id: 'username',
    category: 'dev',
    pattern: String.raw`^[A-Za-z][A-Za-z0-9_]{2,15}$`,
    flags: '',
    matches: ['user_01', 'abc'],
    nonMatches: ['1user', 'ab', 'a_very_long_user_name'],
  },
  {
    id: 'password-strong',
    category: 'dev',
    pattern: String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`,
    flags: '',
    matches: ['Passw0rdX', 'aB3dEfGh!'],
    nonMatches: ['password1', 'PASSWORD1', 'Pass1'],
  },
] as const satisfies readonly RegexPattern[];

export type PatternId = (typeof PATTERNS)[number]['id'];

/** パターンを RegExp にする。`g` / `y` は lastIndex の持ち越しを避けるため呼び出しごとに新規生成する。 */
export function compilePattern(p: Pick<RegexPattern, 'pattern' | 'flags'>) {
  return new RegExp(p.pattern, p.flags);
}

/** 例が一致するか。毎回新しい RegExp を作るので g フラグでも安定する。 */
export function testExample(
  p: Pick<RegexPattern, 'pattern' | 'flags'>,
  example: string,
): boolean {
  return compilePattern(p).test(example);
}

/** 空白区切りの語がすべて haystack に含まれるか（大文字小文字は区別しない）。 */
export function matchesPattern(
  category: PatternCategory,
  haystack: string,
  query: string,
  filter: CategoryFilter,
): boolean {
  if (filter !== 'all' && category !== filter) return false;
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;
  const target = haystack.toLowerCase();
  return words.every((w) => target.includes(w));
}

/** regex-tester へ渡す用の `/pattern/flags` 表記。 */
export function toLiteral(p: Pick<RegexPattern, 'pattern' | 'flags'>): string {
  return `/${p.pattern.replace(/\//g, '\\/')}/${p.flags}`;
}
