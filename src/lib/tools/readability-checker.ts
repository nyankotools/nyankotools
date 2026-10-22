/**
 * 文章の読みやすさ診断。形態素解析は使わず、正規表現と文字種判定のみで
 * 文長・漢字率・文末の重複・接続詞の連続・読点の多寡を指標化する。
 */

export type IssueKind =
  'long' | 'commaMany' | 'commaNone' | 'endingRepeat' | 'conjunctionRun';

export type MetricKey =
  | 'sentenceCount'
  | 'avgLength'
  | 'longSentences'
  | 'kanjiRatio'
  | 'endingRepeat'
  | 'conjunctionRun'
  | 'commaAvg';

export interface MetricResult {
  key: MetricKey;
  /** 表示用の数値。算出不能のときは null */
  value: number | null;
  /** 注意が必要か */
  warn: boolean;
}

export interface SentenceResult {
  /** 元の文字列（末尾の改行・空白を含む。連結すると入力と一致する） */
  raw: string;
  /** 空白・改行を除いた長さ（日本語を含まない文は語数×3で換算） */
  length: number;
  commas: number;
  issues: IssueKind[];
}

export interface ReadabilityOptions {
  /** 1文の長さの上限（既定 60） */
  maxLength: number;
  /** 1文あたりの読点の上限（既定 3） */
  maxCommas: number;
}

export interface ReadabilityResult {
  sentences: SentenceResult[];
  metrics: MetricResult[];
  /** 0〜100。文が無いときは null */
  score: number | null;
}

export const DEFAULT_MAX_LENGTH = 60;
export const DEFAULT_MAX_COMMAS = 3;
/** 同じ文末がこの回数以上続いたら指摘する */
export const ENDING_RUN_MIN = 3;
/** 接続詞で始まる文がこの回数以上続いたら指摘する */
export const CONJUNCTION_RUN_MIN = 2;
/** 読点が無い文を指摘する最小の長さ */
export const COMMA_NONE_MIN_LENGTH = 40;
/** 漢字率の目安（日本語文字に占める割合） */
export const KANJI_RATIO_HIGH = 0.4;
export const KANJI_RATIO_LOW = 0.15;
/** 漢字率を評価する最小の日本語文字数 */
export const KANJI_MIN_JA_CHARS = 30;

const TERMINATORS = new Set(['。', '！', '？', '!', '?', '．']);
const CLOSERS = new Set([
  '」',
  '』',
  '）',
  ')',
  '"',
  '”',
  '’',
  '】',
  '］',
  '〕',
]);

const RE_KANJI = /[\p{Script=Han}々]/u;
const RE_JA = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}々]/u;
const RE_COMMA = /[、，,]/gu;
const RE_TRAILING = /[。．.！？!?」』）)"”’】］〕…\s]+$/u;

/** 文末表現の候補（長いものを先に判定する） */
const ENDINGS = [
  'でしょう',
  'ましょう',
  'でした',
  'ました',
  'ません',
  'である',
  'だった',
  'です',
  'ます',
  'した',
  'ない',
  'だ',
  'た',
  'る',
  'う',
  'い',
];

const JA_CONJUNCTIONS = [
  'しかしながら',
  'しかし',
  'けれども',
  'ですが',
  'だが',
  'ところが',
  'そして',
  'それから',
  'また',
  'さらに',
  'しかも',
  'そのうえ',
  'だから',
  'ですから',
  'したがって',
  'そのため',
  'それゆえ',
  'つまり',
  'すなわち',
  'ただし',
  'なお',
  'そこで',
  'ちなみに',
  '一方',
  'それでは',
  'では',
  'そもそも',
  'なぜなら',
  'たとえば',
  '例えば',
];

const RE_EN_CONJUNCTION =
  /^(however|but|and|also|so|therefore|moreover|furthermore|thus|then|besides|meanwhile|instead|nevertheless)\b/i;

function isTerminatorAt(text: string, i: number): boolean {
  const ch = text[i];
  if (TERMINATORS.has(ch)) return true;
  if (ch === '.') {
    const next = text[i + 1];
    return next === undefined || /\s/.test(next);
  }
  return false;
}

/** 入力を文に分割する。連結すると元の文字列に一致する。 */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let cur = '';
  let i = 0;
  const flush = () => {
    if (cur.trim() === '') return;
    out.push(cur);
    cur = '';
  };
  while (i < text.length) {
    const ch = text[i];
    cur += ch;
    i++;
    const justTerminated = isTerminatorAt(text, i - 1);
    const justNewline = ch === '\n' && cur.trim() !== '';
    if (justTerminated || justNewline) {
      if (justTerminated) {
        while (
          i < text.length &&
          (isTerminatorAt(text, i) || CLOSERS.has(text[i]))
        ) {
          cur += text[i];
          i++;
        }
      }
      while (i < text.length && /\s/.test(text[i])) {
        cur += text[i];
        i++;
      }
      flush();
    }
  }
  if (cur.trim() !== '') {
    out.push(cur);
  } else if (cur !== '' && out.length > 0) {
    out[out.length - 1] += cur;
  }
  return out;
}

function countMatches(text: string, re: RegExp): number {
  let n = 0;
  for (const ch of text) if (re.test(ch)) n++;
  return n;
}

function effectiveLength(body: string): number {
  const compact = Array.from(body.replace(/\s/g, '')).length;
  if (RE_JA.test(body)) return compact;
  const words = body.split(/\s+/).filter(Boolean).length;
  return words * 3;
}

/** 文末表現のキー。日本語を含まない文は空文字（評価対象外）。 */
export function endingKey(body: string): string {
  if (!RE_JA.test(body)) return '';
  const stripped = body.replace(RE_TRAILING, '');
  if (stripped === '') return '';
  for (const e of ENDINGS) if (stripped.endsWith(e)) return e;
  return Array.from(stripped).slice(-2).join('');
}

export function startsWithConjunction(body: string): boolean {
  const s = body.replace(/^[\s「『（(]+/u, '');
  if (RE_EN_CONJUNCTION.test(s)) return true;
  return JA_CONJUNCTIONS.some((c) => s.startsWith(c));
}

function sanitizeInt(value: number, fallback: number, min: number): number {
  if (!Number.isFinite(value)) return fallback;
  const v = Math.floor(value);
  return v >= min ? v : fallback;
}

export function analyze(
  text: string,
  options: Partial<ReadabilityOptions> = {},
): ReadabilityResult {
  const maxLength = sanitizeInt(
    options.maxLength ?? DEFAULT_MAX_LENGTH,
    DEFAULT_MAX_LENGTH,
    5,
  );
  const maxCommas = sanitizeInt(
    options.maxCommas ?? DEFAULT_MAX_COMMAS,
    DEFAULT_MAX_COMMAS,
    0,
  );

  const parts = splitSentences(text.replace(/\r\n?/g, '\n'));
  const bodies = parts.map((p) => p.trim());
  const sentences: SentenceResult[] = parts.map((raw, idx) => {
    const body = bodies[idx];
    const commas = (body.match(RE_COMMA) ?? []).length;
    const length = effectiveLength(body);
    const issues: IssueKind[] = [];
    if (length > maxLength) issues.push('long');
    if (commas > maxCommas) issues.push('commaMany');
    if (commas === 0 && length >= COMMA_NONE_MIN_LENGTH) {
      issues.push('commaNone');
    }
    return { raw, length, commas, issues };
  });

  // 文末の連続
  const keys = bodies.map(endingKey);
  const endingFlagged = markRuns(
    keys.length,
    (i) => keys[i] !== '' && keys[i] === keys[i - 1],
    ENDING_RUN_MIN,
  );
  // 接続詞の連続
  const conj = bodies.map(startsWithConjunction);
  const conjFlagged = markRuns(
    conj.length,
    (i) => conj[i] && conj[i - 1],
    CONJUNCTION_RUN_MIN,
    (i) => conj[i],
  );
  endingFlagged.forEach(
    (f, i) => f && sentences[i].issues.push('endingRepeat'),
  );
  conjFlagged.forEach(
    (f, i) => f && sentences[i].issues.push('conjunctionRun'),
  );

  const n = sentences.length;
  const count = (kind: IssueKind) =>
    sentences.filter((s) => s.issues.includes(kind)).length;
  const longCount = count('long');
  const commaIssues = sentences.filter(
    (s) => s.issues.includes('commaMany') || s.issues.includes('commaNone'),
  ).length;
  const endingCount = count('endingRepeat');
  const conjCount = count('conjunctionRun');

  const jaChars = countMatches(text, RE_JA);
  const kanji = countMatches(text, RE_KANJI);
  const kanjiRatio = jaChars > 0 ? kanji / jaChars : null;
  const kanjiWarn =
    kanjiRatio !== null &&
    jaChars >= KANJI_MIN_JA_CHARS &&
    (kanjiRatio > KANJI_RATIO_HIGH || kanjiRatio < KANJI_RATIO_LOW);

  const totalLength = sentences.reduce((a, s) => a + s.length, 0);
  const totalCommas = sentences.reduce((a, s) => a + s.commas, 0);
  const avgLength = n > 0 ? totalLength / n : null;
  const commaAvg = n > 0 ? totalCommas / n : null;

  const metrics: MetricResult[] = [
    { key: 'sentenceCount', value: n, warn: false },
    {
      key: 'avgLength',
      value: avgLength,
      warn: avgLength !== null && avgLength > maxLength,
    },
    { key: 'longSentences', value: longCount, warn: longCount > 0 },
    { key: 'kanjiRatio', value: kanjiRatio, warn: kanjiWarn },
    { key: 'endingRepeat', value: endingCount, warn: endingCount > 0 },
    { key: 'conjunctionRun', value: conjCount, warn: conjCount > 0 },
    { key: 'commaAvg', value: commaAvg, warn: commaIssues > 0 },
  ];

  let score: number | null = null;
  if (n > 0) {
    const penalty =
      50 * (longCount / n) +
      25 * (endingCount / n) +
      25 * (commaIssues / n) +
      15 * (conjCount / n) +
      (kanjiWarn ? 10 : 0);
    score = Math.round(Math.min(100, Math.max(0, 100 - penalty)));
  }

  return { sentences, metrics, score };
}

/**
 * 条件 cond(i)（直前と同じ/連続）が成り立つ連続区間を求め、
 * 区間内の文数が minRun 以上なら全て true にする。
 * start(i) が渡された場合は、条件の起点となる文（接続詞で始まる文など）。
 */
function markRuns(
  n: number,
  cond: (i: number) => boolean,
  minRun: number,
  start?: (i: number) => boolean,
): boolean[] {
  const flags: boolean[] = new Array<boolean>(n).fill(false);
  let i = 0;
  while (i < n) {
    const startsRun = start ? start(i) : true;
    if (!startsRun) {
      i++;
      continue;
    }
    let j = i + 1;
    while (j < n && cond(j)) j++;
    if (j - i >= minRun) for (let k = i; k < j; k++) flags[k] = true;
    i = j;
  }
  return flags;
}

export function scoreLevel(score: number): 'good' | 'fair' | 'poor' {
  if (score >= 80) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}
