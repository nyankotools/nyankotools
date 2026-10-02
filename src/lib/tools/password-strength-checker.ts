export type PasswordIssue =
  | 'too-short'
  | 'common'
  | 'common-base'
  | 'only-digits'
  | 'only-letters'
  | 'repeated'
  | 'sequence'
  | 'keyboard';

/** 0=非常に弱い 〜 4=非常に強い */
export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordCheckResult {
  length: number;
  hasLowercase: boolean;
  hasUppercase: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  /** 文字種から求めた総当たり換算のビット数（パターン補正前） */
  rawBits: number;
  /** 繰り返し・連番・キーボード配列・よくあるパスワードを割り引いたビット数 */
  bits: number;
  score: PasswordScore;
  issues: PasswordIssue[];
}

/** オンライン攻撃（ログイン試行の回数制限あり）を想定した1秒あたりの試行回数 */
export const ONLINE_GUESSES_PER_SECOND = 100;
/** オフライン攻撃（高速ハッシュ＋GPU）を想定した1秒あたりの試行回数 */
export const OFFLINE_GUESSES_PER_SECOND = 1e10;

const MIN_RECOMMENDED_LENGTH = 8;

/** よく使われるパスワード（小文字・記号置換後の比較用の抜粋） */
const COMMON_PASSWORDS = new Set([
  'password',
  'passw0rd',
  'password1',
  'password123',
  '123456',
  '1234567',
  '12345678',
  '123456789',
  '1234567890',
  '111111',
  '000000',
  '123123',
  '654321',
  '666666',
  '121212',
  '112233',
  'qwerty',
  'qwerty123',
  'qwertyuiop',
  'asdfgh',
  'asdfghjkl',
  'zxcvbn',
  'zxcvbnm',
  '1qaz2wsx',
  '1q2w3e4r',
  'abc123',
  'abcdef',
  'abcd1234',
  'iloveyou',
  'admin',
  'admin123',
  'administrator',
  'root',
  'toor',
  'login',
  'welcome',
  'welcome1',
  'letmein',
  'monkey',
  'dragon',
  'master',
  'shadow',
  'sunshine',
  'princess',
  'football',
  'baseball',
  'superman',
  'batman',
  'trustno1',
  'hello',
  'hello123',
  'freedom',
  'whatever',
  'secret',
  'test',
  'test123',
  'guest',
  'user',
  'default',
  'changeme',
  'pass',
  'pass1234',
  'mypassword',
  'ninja',
  'mustang',
  'michael',
  'jordan',
  'charlie',
  'access',
  'flower',
  'cheese',
  'computer',
  'internet',
  'samurai',
  'sakura',
  'pokemon',
  'naruto',
]);

const KEYBOARD_ROWS = [
  '1234567890',
  'qwertyuiop',
  'asdfghjkl',
  'zxcvbnm',
  '!@#$%^&*()',
];

const LEET_MAP: Record<string, string> = {
  '@': 'a',
  '4': 'a',
  '0': 'o',
  '3': 'e',
  $: 's',
  '5': 's',
  '1': 'l',
  '!': 'i',
};

type PairKind = 'repeat' | 'sequence' | 'keyboard';

function classifyPair(a: string, b: string): PairKind | null {
  if (a === b) return 'repeat';
  const la = a.toLowerCase();
  const lb = b.toLowerCase();
  const diff = lb.charCodeAt(0) - la.charCodeAt(0);
  if (
    (diff === 1 || diff === -1) &&
    /^[a-z0-9]$/.test(la) &&
    /^[a-z0-9]$/.test(lb) &&
    /[0-9]/.test(la) === /[0-9]/.test(lb)
  ) {
    return 'sequence';
  }
  for (const row of KEYBOARD_ROWS) {
    const i = row.indexOf(la);
    const j = row.indexOf(lb);
    if (i >= 0 && j >= 0 && Math.abs(i - j) === 1) return 'keyboard';
  }
  return null;
}

/** 同じ種類のパターンが3文字以上続く箇所の「2文字目以降」を数え、検出した種類を返す */
function findPatterns(password: string): {
  coveredChars: number;
  kinds: Set<PairKind>;
} {
  const chars = Array.from(password);
  const kinds = new Set<PairKind>();
  let coveredChars = 0;
  let i = 1;
  while (i < chars.length) {
    const kind = classifyPair(chars[i - 1], chars[i]);
    if (kind === null) {
      i++;
      continue;
    }
    let end = i;
    while (
      end + 1 < chars.length &&
      classifyPair(chars[end], chars[end + 1]) === kind
    ) {
      end++;
    }
    const pairCount = end - i + 1;
    if (pairCount >= 2) {
      kinds.add(kind);
      coveredChars += pairCount;
    }
    i = end + 1;
  }
  return { coveredChars, kinds };
}

function normalizeLeet(text: string): string {
  return Array.from(text.toLowerCase(), (c) => LEET_MAP[c] ?? c).join('');
}

function isInCommonList(text: string): boolean {
  return (
    COMMON_PASSWORDS.has(text) || COMMON_PASSWORDS.has(normalizeLeet(text))
  );
}

function commonKind(password: string): 'common' | 'common-base' | null {
  const lower = password.toLowerCase();
  if (isInCommonList(lower)) return 'common';
  // 末尾の数字・記号だけを足した派生（password2024! など）
  const base = lower.replace(/[0-9!@#$%^&*._-]+$/, '');
  if (base.length >= 3 && base !== lower && isInCommonList(base)) {
    return 'common-base';
  }
  return null;
}

function poolOf(password: string) {
  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const number = /[0-9]/.test(password);
  const symbol = /[\x21-\x2f\x3a-\x40\x5b-\x60\x7b-\x7e]/.test(password);
  const other = /[^\x21-\x7e]/.test(password);
  const size =
    (lower ? 26 : 0) +
    (upper ? 26 : 0) +
    (number ? 10 : 0) +
    (symbol ? 33 : 0) +
    (other ? 100 : 0);
  return { size, lower, upper, number, symbol };
}

function scoreOf(bits: number): PasswordScore {
  if (bits < 28) return 0;
  if (bits < 36) return 1;
  if (bits < 60) return 2;
  if (bits < 80) return 3;
  return 4;
}

/** パスワードの強度を評価する（入力はこの関数の外へ出さない） */
export function checkPassword(password: string): PasswordCheckResult {
  const length = Array.from(password).length;
  const pool = poolOf(password);
  const issues: PasswordIssue[] = [];

  if (length === 0) {
    return {
      length: 0,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSymbol: false,
      rawBits: 0,
      bits: 0,
      score: 0,
      issues,
    };
  }

  const bitsPerChar = Math.log2(pool.size);
  const rawBits = length * bitsPerChar;

  const { coveredChars, kinds } = findPatterns(password);
  let bits = Math.max(1, length - coveredChars) * bitsPerChar;
  if (kinds.has('repeat')) issues.push('repeated');
  if (kinds.has('sequence')) issues.push('sequence');
  if (kinds.has('keyboard')) issues.push('keyboard');

  // 同じ並びの繰り返し（abab、passwordpassword など）は1回分の長さとして扱う
  const chunk = /^(.+?)\1+$/u.exec(password);
  if (chunk) {
    bits = Math.min(bits, Array.from(chunk[1]).length * bitsPerChar);
    if (!issues.includes('repeated')) issues.push('repeated');
  }

  const common = commonKind(password);
  if (common === 'common') {
    bits = Math.min(bits, 10);
    issues.push('common');
  } else if (common === 'common-base') {
    bits = Math.min(bits, 20);
    issues.push('common-base');
  } else {
    // 辞書語を含む（MyPassword123 など）場合、その語は1文字分の強さとして扱う
    const lower = normalizeLeet(password);
    const word = [...COMMON_PASSWORDS].find(
      (w) => w.length >= 5 && /^[a-z]+$/.test(w) && lower.includes(w),
    );
    if (word) {
      bits = Math.min(
        bits,
        Math.max(1, length - word.length + 1) * bitsPerChar,
      );
      issues.push('common-base');
    }
  }

  if (/^[0-9]+$/.test(password)) issues.push('only-digits');
  else if (/^[A-Za-z]+$/.test(password)) issues.push('only-letters');
  if (length < MIN_RECOMMENDED_LENGTH) issues.push('too-short');

  let score = scoreOf(bits);
  if (common === 'common') score = 0;
  else if (length < MIN_RECOMMENDED_LENGTH && score > 1) score = 1;

  return {
    length,
    hasLowercase: pool.lower,
    hasUppercase: pool.upper,
    hasNumber: pool.number,
    hasSymbol: pool.symbol,
    rawBits,
    bits,
    score,
    issues,
  };
}

export type DurationUnit =
  | 'instant'
  | 'seconds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'years'
  | 'millionYears';

export interface CrackDuration {
  unit: DurationUnit;
  /** unit が instant / millionYears のときは 0 */
  value: number;
}

const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;
const YEAR = 31_557_600;

/** 秒数を、表示に向いた単位の概数に変える */
export function describeDuration(seconds: number): CrackDuration {
  if (!Number.isFinite(seconds) || seconds >= YEAR * 1e6) {
    return { unit: 'millionYears', value: 0 };
  }
  if (seconds < 1) return { unit: 'instant', value: 0 };
  if (seconds < MINUTE) return { unit: 'seconds', value: Math.floor(seconds) };
  if (seconds < HOUR) {
    return { unit: 'minutes', value: Math.floor(seconds / MINUTE) };
  }
  if (seconds < DAY) {
    return { unit: 'hours', value: Math.floor(seconds / HOUR) };
  }
  if (seconds < YEAR) {
    return { unit: 'days', value: Math.floor(seconds / DAY) };
  }
  return { unit: 'years', value: Math.floor(seconds / YEAR) };
}

/** 平均的に総当たりで見つかるまでの時間（探索空間の半分を試す想定）を返す */
export function estimateCrackSeconds(
  bits: number,
  guessesPerSecond: number,
): number {
  if (bits <= 0) return 0;
  return 2 ** (bits - 1) / guessesPerSecond;
}
