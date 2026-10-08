// タイピング速度テストのロジック（DOM・文言に依存しない純TS）。
// 日本語はかな文を「許容されるローマ字表記すべて」で判定する（し=si/shi/ci、ん=n/nn/xn、っ=子音重ね/xtu 等）。

/** 1つのお題。kana があればローマ字入力で判定し、なければ text をそのまま打つ */
export interface TypingPrompt {
  /** 画面に表示する文（日本語は漢字かな交じり） */
  text: string;
  /** 日本語のみ。ひらがな（ー・句読点・半角英数記号可）で書いた読み */
  kana: string | null;
}

// ---------- かな → ローマ字パターン ----------

interface Option {
  /** このパターンで消費するかなの文字数 */
  kanaLen: number;
  patterns: string[];
}

function row(
  kana: string,
  romaji: string[][],
  into: Record<string, string[]>,
): void {
  [...kana].forEach((ch, i) => {
    into[ch] = romaji[i];
  });
}

const SINGLE: Record<string, string[]> = {};
row('あいえお', [['a'], ['i'], ['e'], ['o']], SINGLE);
SINGLE['う'] = ['u', 'wu'];
row(
  'かきくけこ',
  [['ka', 'ca'], ['ki'], ['ku', 'cu', 'qu'], ['ke'], ['ko', 'co']],
  SINGLE,
);
row(
  'さしすせそ',
  [['sa'], ['shi', 'si', 'ci'], ['su'], ['se', 'ce'], ['so']],
  SINGLE,
);
row(
  'たちつてと',
  [['ta'], ['chi', 'ti'], ['tsu', 'tu'], ['te'], ['to']],
  SINGLE,
);
row('なにぬねの', [['na'], ['ni'], ['nu'], ['ne'], ['no']], SINGLE);
row('はひふへほ', [['ha'], ['hi'], ['fu', 'hu'], ['he'], ['ho']], SINGLE);
row('まみむめも', [['ma'], ['mi'], ['mu'], ['me'], ['mo']], SINGLE);
row('やゆよ', [['ya'], ['yu'], ['yo']], SINGLE);
row('らりるれろ', [['ra'], ['ri'], ['ru'], ['re'], ['ro']], SINGLE);
row('わを', [['wa'], ['wo']], SINGLE);
row('がぎぐげご', [['ga'], ['gi'], ['gu'], ['ge'], ['go']], SINGLE);
row('ざじずぜぞ', [['za'], ['ji', 'zi'], ['zu'], ['ze'], ['zo']], SINGLE);
row('だぢづでど', [['da'], ['di'], ['du'], ['de'], ['do']], SINGLE);
row('ばびぶべぼ', [['ba'], ['bi'], ['bu'], ['be'], ['bo']], SINGLE);
row('ぱぴぷぺぽ', [['pa'], ['pi'], ['pu'], ['pe'], ['po']], SINGLE);
row(
  'ぁぃぅぇぉ',
  [
    ['xa', 'la'],
    ['xi', 'li'],
    ['xu', 'lu'],
    ['xe', 'le'],
    ['xo', 'lo'],
  ],
  SINGLE,
);
row(
  'ゃゅょゎ',
  [
    ['xya', 'lya'],
    ['xyu', 'lyu'],
    ['xyo', 'lyo'],
    ['xwa', 'lwa'],
  ],
  SINGLE,
);
SINGLE['ゔ'] = ['vu'];
SINGLE['ー'] = ['-'];
SINGLE['、'] = [','];
SINGLE['。'] = ['.'];
SINGLE['？'] = ['?'];
SINGLE['！'] = ['!'];

/** 拗音など2文字で1音になる表記（分けて打つ「ki」+「xya」も別途受け付ける） */
const DIGRAPH: Record<string, string[]> = {};
function digraphs(
  base: string,
  prefixes: string[],
  small = 'ゃゅょ',
  vowels = 'auo',
): void {
  [...small].forEach((s, i) => {
    DIGRAPH[base + s] = prefixes.map((p) => p + vowels[i]);
  });
}
digraphs('き', ['ky']);
digraphs('ぎ', ['gy']);
digraphs('し', ['sh', 'sy']);
digraphs('じ', ['j', 'zy', 'jy']);
digraphs('ち', ['ch', 'ty', 'cy']);
digraphs('ぢ', ['dy']);
digraphs('に', ['ny']);
digraphs('ひ', ['hy']);
digraphs('び', ['by']);
digraphs('ぴ', ['py']);
digraphs('み', ['my']);
digraphs('り', ['ry']);
digraphs('ふ', ['fy']);
digraphs('て', ['th'], 'ぃゅ', 'iu');
digraphs('で', ['dh'], 'ぃゅ', 'iu');
digraphs('う', ['w'], 'ぃぇ', 'ie');
digraphs('ふ', ['f'], 'ぁぃぇぉ', 'aieo');
digraphs('し', ['sh', 'sy'], 'ぇ', 'e');
digraphs('じ', ['j', 'zy'], 'ぇ', 'e');
digraphs('ち', ['ch', 'ty'], 'ぇ', 'e');

/** カタカナをひらがなに寄せる（ー・・は触らない） */
export function normalizeKana(text: string): string {
  return text.replace(/[ァ-ヶ]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60),
  );
}

function isConsonantStart(pattern: string): boolean {
  return /^[b-df-hj-mp-tv-z]/.test(pattern);
}

/** っ・ん以外の、位置 p から始まる選択肢 */
function baseOptions(kana: string, p: number): Option[] {
  const ch = kana[p];
  const out: Option[] = [];
  const pair = kana.slice(p, p + 2);
  if (pair.length === 2 && DIGRAPH[pair]) {
    out.push({ kanaLen: 2, patterns: DIGRAPH[pair] });
  }
  out.push({ kanaLen: 1, patterns: SINGLE[ch] ?? [ch.toLowerCase()] });
  return out;
}

function optionsAt(kana: string, p: number): Option[] {
  const ch = kana[p];
  if (ch === 'っ') {
    const out: Option[] = [
      { kanaLen: 1, patterns: ['xtu', 'ltu', 'xtsu', 'ltsu'] },
    ];
    if (p + 1 < kana.length && kana[p + 1] !== 'っ' && kana[p + 1] !== 'ん') {
      const doubled: Option[] = [];
      for (const next of baseOptions(kana, p + 1)) {
        const patterns: string[] = [];
        for (const pat of next.patterns) {
          if (isConsonantStart(pat) && pat[0] !== 'n')
            patterns.push(pat[0] + pat);
          // っち は tchi とも打てる
          if (pat.startsWith('ch')) patterns.push('t' + pat);
        }
        if (patterns.length > 0) {
          doubled.push({ kanaLen: 1 + next.kanaLen, patterns });
        }
      }
      return [...doubled, ...out];
    }
    return out;
  }
  if (ch === 'ん') {
    const out: Option[] = [];
    if (p + 1 < kana.length) {
      // 次が母音・な行・や行でなければ n 1回でよい
      for (const next of baseOptions(kana, p + 1)) {
        const patterns = next.patterns
          .filter((pat) => isConsonantStart(pat) && !/^[ny]/.test(pat))
          .map((pat) => 'n' + pat);
        if (patterns.length > 0) {
          out.push({ kanaLen: 1 + next.kanaLen, patterns });
        }
      }
    }
    out.push({ kanaLen: 1, patterns: ['nn', 'xn'] });
    return out;
  }
  return baseOptions(kana, p);
}

export interface KanaParse {
  /** 入力がどの表記の先頭としても矛盾しない */
  valid: boolean;
  /** 入力がちょうどお題全体の表記になった */
  complete: boolean;
}

/** かな文に対し、入力済みローマ字 typed が許容表記の先頭として有効か判定する */
export function parseKana(kanaText: string, typed: string): KanaParse {
  const kana = normalizeKana(kanaText);
  const input = typed.toLowerCase();
  const states: Set<number>[] = Array.from(
    { length: input.length + 1 },
    () => new Set<number>(),
  );
  states[0].add(0);
  let partial = false;
  let complete = false;
  for (let k = 0; k <= input.length; k++) {
    const rest = input.slice(k);
    for (const p of states[k]) {
      if (p >= kana.length) {
        if (k === input.length) complete = true;
        continue;
      }
      for (const opt of optionsAt(kana, p)) {
        for (const pat of opt.patterns) {
          if (rest.length >= pat.length) {
            if (rest.startsWith(pat)) {
              states[k + pat.length].add(p + opt.kanaLen);
            }
          } else if (pat.startsWith(rest)) {
            partial = true;
          }
        }
      }
    }
  }
  const atEnd = states[input.length].size > 0;
  return { valid: atEnd || partial || complete, complete };
}

/**
 * typed と矛盾しない表記のうち、いちばん標準的なもの全体を返す（画面のガイド用）。
 * typed が有効でなければ null。
 */
export function romajiGuide(kanaText: string, typed: string): string | null {
  const kana = normalizeKana(kanaText);
  const input = typed.toLowerCase();
  const failed = new Set<string>();
  function walk(p: number, built: string): string | null {
    if (p >= kana.length) {
      return built.length >= input.length && built.startsWith(input)
        ? built
        : null;
    }
    const key = `${p}:${Math.min(built.length, input.length)}`;
    if (failed.has(key)) return null;
    for (const opt of optionsAt(kana, p)) {
      for (const pat of opt.patterns) {
        const next = built + pat;
        const consistent =
          next.length >= input.length
            ? next.startsWith(input)
            : input.startsWith(next);
        if (!consistent) continue;
        const found = walk(p + opt.kanaLen, next);
        if (found !== null) return found;
      }
    }
    failed.add(key);
    return null;
  }
  return walk(0, '');
}

// ---------- 1打鍵ごとの判定 ----------

export interface AdvanceResult {
  accepted: boolean;
  /** 受理後の入力済み文字列（ミスのときは変わらない） */
  typed: string;
  /** お題を打ち終えた */
  complete: boolean;
  /** ミスしたとき、本来打つべきだった文字（苦手キーの集計用） */
  expected: string | null;
}

/** 表示・比較に使う、お題全体の正解表記（日本語は標準ローマ字） */
export function guideFor(prompt: TypingPrompt, typed: string): string {
  if (prompt.kana === null) return prompt.text;
  return romajiGuide(prompt.kana, typed) ?? romajiGuide(prompt.kana, '') ?? '';
}

/** 次に打つべき1文字 */
export function expectedChar(
  prompt: TypingPrompt,
  typed: string,
): string | null {
  return guideFor(prompt, typed)[typed.length] ?? null;
}

export function advance(
  prompt: TypingPrompt,
  typed: string,
  ch: string,
): AdvanceResult {
  const next = typed + ch;
  if (prompt.kana === null) {
    const ok = prompt.text.startsWith(next);
    return {
      accepted: ok,
      typed: ok ? next : typed,
      complete: ok && next === prompt.text,
      expected: ok ? null : (prompt.text[typed.length] ?? null),
    };
  }
  const result = parseKana(prompt.kana, next);
  if (!result.valid) {
    return {
      accepted: false,
      typed,
      complete: false,
      expected: expectedChar(prompt, typed),
    };
  }
  return {
    accepted: true,
    typed: next.toLowerCase(),
    complete: result.complete,
    expected: null,
  };
}

// ---------- 集計 ----------

export interface TypingStats {
  elapsedMs: number;
  correct: number;
  misses: number;
  /** 1分あたりの単語数（5打鍵=1語） */
  wpm: number;
  /** 1分あたりの正打鍵数 */
  cpm: number;
  /** 正確性（%、小数1桁）。打鍵がなければ0 */
  accuracy: number;
}

export function calcStats(
  correct: number,
  misses: number,
  elapsedMs: number,
): TypingStats {
  const minutes = elapsedMs / 60000;
  const total = correct + misses;
  const round1 = (n: number) => Math.round(n * 10) / 10;
  return {
    elapsedMs,
    correct,
    misses,
    wpm: minutes > 0 ? round1(correct / 5 / minutes) : 0,
    cpm: minutes > 0 ? Math.round(correct / minutes) : 0,
    accuracy: total > 0 ? round1((correct / total) * 100) : 0,
  };
}

export interface WeakKey {
  key: string;
  misses: number;
}

/** ミスの多かったキーを多い順（同数はキー順）に最大 limit 件返す */
export function weakKeys(misses: Record<string, number>, limit = 5): WeakKey[] {
  return Object.entries(misses)
    .filter(([, n]) => n > 0)
    .map(([key, n]) => ({ key, misses: n }))
    .sort((a, b) => b.misses - a.misses || a.key.localeCompare(b.key))
    .slice(0, limit);
}

/** 苦手キーの表示用ラベル */
export function keyLabel(key: string): string {
  return key === ' ' ? 'Space' : key;
}

// ---------- お題 ----------

export const JA_PROMPTS: TypingPrompt[] = [
  { text: '今日はいい天気ですね', kana: 'きょうはいいてんきですね' },
  { text: '吾輩は猫である', kana: 'わがはいはねこである' },
  { text: '猫は気ままな生き物です', kana: 'ねこはきままないきものです' },
  { text: '早起きは三文の徳', kana: 'はやおきはさんもんのとく' },
  { text: '七転び八起き', kana: 'ななころびやおき' },
  { text: '習うより慣れろ', kana: 'ならうよりなれろ' },
  { text: '急がば回れ', kana: 'いそがばまわれ' },
  { text: '石の上にも三年', kana: 'いしのうえにもさんねん' },
  { text: '今夜は月がきれいですね', kana: 'こんやはつきがきれいですね' },
  { text: 'おはようございます', kana: 'おはようございます' },
  { text: 'ありがとうございました', kana: 'ありがとうございました' },
  { text: '明日は雨が降るでしょう', kana: 'あしたはあめがふるでしょう' },
  { text: '好きな食べ物はラーメンです', kana: 'すきなたべものはらーめんです' },
  { text: '新幹線で京都へ行く', kana: 'しんかんせんできょうとへいく' },
  {
    text: '小さな一歩が大きな力になる',
    kana: 'ちいさないっぽがおおきなちからになる',
  },
  {
    text: '毎日少しずつ練習しよう',
    kana: 'まいにちすこしずつれんしゅうしよう',
  },
  {
    text: '学校の帰りに本を買った',
    kana: 'がっこうのかえりにほんをかった',
  },
  {
    text: '夏休みの宿題が終わらない',
    kana: 'なつやすみのしゅくだいがおわらない',
  },
  {
    text: '温かいお茶を飲んで一息つく',
    kana: 'あたたかいおちゃをのんでひといきつく',
  },
  { text: '猫じゃらしで遊ぶ', kana: 'ねこじゃらしであそぶ' },
  { text: '鉄道の旅は楽しい', kana: 'てつどうのたびはたのしい' },
  {
    text: '窓の外に夕焼けが広がる',
    kana: 'まどのそとにゆうやけがひろがる',
  },
  { text: 'コーヒーとパンで朝食', kana: 'こーひーとぱんでちょうしょく' },
  { text: 'ファイルを保存しました', kana: 'ふぁいるをほぞんしました' },
  { text: '今日も一日頑張ろう', kana: 'きょうもいちにちがんばろう' },
];

export const EN_PROMPTS: TypingPrompt[] = [
  'The quick brown fox jumps over the lazy dog.',
  'A cat sleeps on the warm windowsill.',
  'Practice a little every day and you will improve.',
  'Please save the file before closing the window.',
  'It is a beautiful day for a long walk.',
  'The train leaves at seven in the morning.',
  'Good tools make hard work feel easy.',
  'She sells sea shells by the sea shore.',
  'Typing fast is easier when you keep a steady rhythm.',
  'Where there is a will, there is a way.',
  'Tea and toast make a simple breakfast.',
  'Look up at the sky and count the stars.',
  'He packed his bags and went to the station.',
  'Small steps lead to big results.',
  'Always back up your work to a safe place.',
  'The library is quiet on rainy afternoons.',
].map((text) => ({ text, kana: null }));

export type TypingMode = 'ja' | 'en';

export const ROUND_SIZES = [3, 5, 10] as const;

/** 重複なしで count 件選ぶ（rng は 0以上1未満を返す関数） */
export function pickPrompts(
  mode: TypingMode,
  count: number,
  rng: () => number = Math.random,
): TypingPrompt[] {
  const pool = [...(mode === 'ja' ? JA_PROMPTS : EN_PROMPTS)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, Math.max(0, Math.min(count, pool.length)));
}
