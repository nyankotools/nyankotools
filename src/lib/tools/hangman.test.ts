import { describe, expect, it } from 'vitest';
import {
  CATEGORY_IDS,
  MAX_MISSES,
  WORDS,
  guessLetter,
  giveUp,
  isSolved,
  maskWord,
  missedLetters,
  newGame,
  normalizeLetter,
  remainingMisses,
  wordPool,
  type GameState,
} from './hangman';

const zero = () => 0;

function game(word: string): GameState {
  return {
    category: 'animals',
    word,
    meaning: '',
    guessed: [],
    phase: 'playing',
  };
}

function play(state: GameState, letters: string): GameState {
  let s = state;
  for (const l of letters) {
    const r = guessLetter(s, l);
    if (r.ok) s = r.state;
  }
  return s;
}

describe('単語リスト', () => {
  it('全カテゴリが小文字a-zの単語で、重複がない', () => {
    const all = wordPool('all');
    expect(all.length).toBeGreaterThanOrEqual(200);
    for (const e of all) {
      expect(e.word).toMatch(/^[a-z]{3,}$/);
      expect(e.meaning).not.toBe('');
    }
    expect(new Set(all.map((e) => e.word)).size).toBe(all.length);
  });
  it('各カテゴリに十分な単語がある', () => {
    for (const id of CATEGORY_IDS)
      expect(WORDS[id].length).toBeGreaterThanOrEqual(20);
  });
});

describe('newGame', () => {
  it('カテゴリ内の単語から出題する', () => {
    const s = newGame('food', zero);
    expect(WORDS.food.map((e) => e.word)).toContain(s.word);
    expect(s.phase).toBe('playing');
    expect(s.guessed).toEqual([]);
  });
  it('乱数の値で単語が決まり、最大値でも範囲内', () => {
    const last = newGame('jobs', (max) => max - 1);
    expect(last.word).toBe(WORDS.jobs[WORDS.jobs.length - 1].word);
  });
  it('直前の単語は避ける', () => {
    const first = WORDS.animals[0].word;
    expect(newGame('animals', zero, first).word).not.toBe(first);
  });
  it('all は全カテゴリから選べる', () => {
    const last = newGame('all', (max) => max - 1);
    expect(last.word).toBe(WORDS.body[WORDS.body.length - 1].word);
  });
});

describe('normalizeLetter', () => {
  it('大文字・全角を小文字に直す', () => {
    expect(normalizeLetter('A')).toBe('a');
    expect(normalizeLetter('ｚ')).toBe('z');
    expect(normalizeLetter(' b ')).toBe('b');
  });
  it('1文字のアルファベット以外は null', () => {
    expect(normalizeLetter('')).toBeNull();
    expect(normalizeLetter('ab')).toBeNull();
    expect(normalizeLetter('1')).toBeNull();
    expect(normalizeLetter('あ')).toBeNull();
  });
});

describe('guessLetter', () => {
  it('当たりは単語に出てくる位置すべてが開く', () => {
    const r = guessLetter(game('butter'), 't');
    expect(r.ok && r.hit).toBe(true);
    if (r.ok)
      expect(maskWord(r.state)).toEqual([null, null, 't', 't', null, null]);
  });
  it('外れはミスに数えられる', () => {
    const r = guessLetter(game('cat'), 'z');
    expect(r.ok && !r.hit).toBe(true);
    if (r.ok) {
      expect(missedLetters(r.state)).toEqual(['z']);
      expect(remainingMisses(r.state)).toBe(MAX_MISSES - 1);
    }
  });
  it('同じ文字・不正な入力はエラーで状態が変わらない', () => {
    const s = play(game('cat'), 'c');
    expect(guessLetter(s, 'C')).toEqual({ ok: false, error: 'duplicate' });
    expect(guessLetter(s, '1')).toEqual({ ok: false, error: 'invalid' });
  });
  it('全部開くと勝ち', () => {
    const s = play(game('cat'), 'act');
    expect(s.phase).toBe('won');
    expect(isSolved(s)).toBe(true);
    expect(guessLetter(s, 'z')).toEqual({ ok: false, error: 'finished' });
  });
  it('ミスが上限に達すると負け、答えは reveal で見える', () => {
    const s = play(game('cat'), 'bdefgh');
    expect(s.phase).toBe('lost');
    expect(remainingMisses(s)).toBe(0);
    expect(maskWord(s)).toEqual([null, null, null]);
    expect(maskWord(s, true)).toEqual(['c', 'a', 't']);
  });
  it('ミス上限の1回前はまだ続く', () => {
    const s = play(game('cat'), 'bdefg');
    expect(s.phase).toBe('playing');
    expect(remainingMisses(s)).toBe(1);
  });
  it('元の状態を書き換えない', () => {
    const s = game('cat');
    guessLetter(s, 'c');
    expect(s.guessed).toEqual([]);
  });
});

describe('giveUp', () => {
  it('プレイ中ならギブアップになり、終了後は変わらない', () => {
    const s = giveUp(game('cat'));
    expect(s.phase).toBe('gaveUp');
    expect(giveUp(play(game('cat'), 'act')).phase).toBe('won');
    expect(guessLetter(s, 'a')).toEqual({ ok: false, error: 'finished' });
  });
});
