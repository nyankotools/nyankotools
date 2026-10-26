/**
 * 英単語5文字当てゲームのロジック。
 * 内蔵の単語リストから答えを選び、5文字の単語を6回まで推測する。
 * 判定は2段階（位置が合う文字 → 残りの文字の出現回数）で行い、同じ文字が重複する単語でも正しく数える。
 */
import { secureRandomInt, type RandomInt } from '../random';
import { ANSWER_WORDS, EXTRA_GUESS_WORDS } from './word-guess-game-words';

export type { RandomInt };
export { ANSWER_WORDS, EXTRA_GUESS_WORDS };

export const WORD_LENGTH = 5;
export const MAX_ATTEMPTS = 6;

export type LetterState = 'correct' | 'present' | 'absent';

export type Phase = 'playing' | 'won' | 'lost' | 'gaveUp';

export interface GameState {
  answer: string;
  /** 送信済みの推測（小文字、順番どおり） */
  guesses: string[];
  phase: Phase;
}

export type GuessError = 'length' | 'chars' | 'unknown' | 'finished';

export type GuessResult =
  | { ok: true; state: GameState; result: LetterState[] }
  | { ok: false; error: GuessError };

const VALID_WORDS: ReadonlySet<string> = new Set([
  ...ANSWER_WORDS,
  ...EXTRA_GUESS_WORDS,
]);

/** 回答として受け付ける単語か（内蔵リストにあるか） */
export function isKnownWord(word: string): boolean {
  return VALID_WORDS.has(word);
}

/** 入力を小文字にそろえる。全角や大文字も受け付け、前後の空白は無視する */
export function normalizeGuess(text: string): string {
  return text.normalize('NFKC').trim().toLowerCase();
}

/** 1文字の入力を a〜z の小文字にする。それ以外は null */
export function normalizeLetter(text: string): string | null {
  const s = normalizeGuess(text);
  return /^[a-z]$/.test(s) ? s : null;
}

/**
 * 推測を答えと比べて、1文字ずつ判定する。
 * 位置が合う文字を先に確定し、残りの文字は答えに余っている数だけ「含まれる」とする。
 */
export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array.from(guess, () => 'absent');
  const remaining = new Map<string, number>();
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
    } else {
      remaining.set(answer[i], (remaining.get(answer[i]) ?? 0) + 1);
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue;
    const left = remaining.get(guess[i]) ?? 0;
    if (left > 0) {
      result[i] = 'present';
      remaining.set(guess[i], left - 1);
    }
  }
  return result;
}

/** 新しいゲーム。直前の答え（exclude）は、ほかに選べるなら出さない */
export function newGame(
  randomInt: RandomInt = secureRandomInt,
  exclude?: string,
): GameState {
  const candidates = ANSWER_WORDS.filter((w) => w !== exclude);
  const pool = candidates.length > 0 ? candidates : ANSWER_WORDS;
  return {
    answer: pool[randomInt(pool.length)],
    guesses: [],
    phase: 'playing',
  };
}

/** 推測を1回送信する。勝ち負けも判定する */
export function submitGuess(state: GameState, input: string): GuessResult {
  if (state.phase !== 'playing') return { ok: false, error: 'finished' };
  const guess = normalizeGuess(input);
  if (!/^[a-z]*$/.test(guess)) return { ok: false, error: 'chars' };
  if (guess.length !== WORD_LENGTH) return { ok: false, error: 'length' };
  if (!isKnownWord(guess)) return { ok: false, error: 'unknown' };
  const guesses = [...state.guesses, guess];
  let phase: Phase = 'playing';
  if (guess === state.answer) phase = 'won';
  else if (guesses.length >= MAX_ATTEMPTS) phase = 'lost';
  return {
    ok: true,
    state: { ...state, guesses, phase },
    result: evaluateGuess(guess, state.answer),
  };
}

/** ギブアップ。すでに終わっているゲームはそのまま返す */
export function giveUp(state: GameState): GameState {
  return state.phase === 'playing' ? { ...state, phase: 'gaveUp' } : state;
}

const RANK: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 };

/** これまでの推測から、アルファベットごとの最も強い判定を返す（キーボード表示用） */
export function keyStates(state: GameState): Record<string, LetterState> {
  const out: Record<string, LetterState> = {};
  for (const guess of state.guesses) {
    evaluateGuess(guess, state.answer).forEach((s, i) => {
      const letter = guess[i];
      if (!(letter in out) || RANK[s] > RANK[out[letter]]) out[letter] = s;
    });
  }
  return out;
}

const EMOJI: Record<LetterState, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬛',
};

/** 結果を絵文字の升目にした共有用テキスト（答えの文字は含めない） */
export function resultGrid(state: GameState): string {
  return state.guesses
    .map((g) =>
      evaluateGuess(g, state.answer)
        .map((s) => EMOJI[s])
        .join(''),
    )
    .join('\n');
}
