import { describe, expect, it } from 'vitest';
import {
  ANSWER_WORDS,
  EXTRA_GUESS_WORDS,
  MAX_ATTEMPTS,
  WORD_LENGTH,
  evaluateGuess,
  giveUp,
  isKnownWord,
  keyStates,
  newGame,
  normalizeGuess,
  normalizeLetter,
  resultGrid,
  submitGuess,
  type GameState,
} from './word-guess-game';

function game(answer: string, guesses: string[] = []): GameState {
  return { answer, guesses, phase: 'playing' };
}

describe('単語リスト', () => {
  it('すべて小文字a〜zの5文字で、重複がない', () => {
    const all = [...ANSWER_WORDS, ...EXTRA_GUESS_WORDS];
    expect(all.every((w) => /^[a-z]{5}$/.test(w))).toBe(true);
    expect(new Set(all).size).toBe(all.length);
  });

  it('出題語は1000語以上、受け付ける語は2000語以上', () => {
    expect(ANSWER_WORDS.length).toBeGreaterThanOrEqual(1000);
    expect(ANSWER_WORDS.length + EXTRA_GUESS_WORDS.length).toBeGreaterThan(
      2000,
    );
  });
});

describe('evaluateGuess', () => {
  it('完全一致はすべて correct', () => {
    expect(evaluateGuess('apple', 'apple')).toEqual(Array(5).fill('correct'));
  });

  it('含まれない文字は absent', () => {
    expect(evaluateGuess('crane', 'blind')).toEqual([
      'absent',
      'absent',
      'absent',
      'correct',
      'absent',
    ]);
  });

  it('位置違いは present', () => {
    expect(evaluateGuess('trace', 'react')).toEqual([
      'present',
      'present',
      'correct',
      'correct',
      'present',
    ]);
  });

  it('答えに1つしかない文字を重ねて推測しても、1つだけ判定する', () => {
    // 答え: ABIDE（Eは1つ）。推測 EERIE の E は位置が合う最後の1つだけ correct
    expect(evaluateGuess('eerie', 'abide')).toEqual([
      'absent',
      'absent',
      'absent',
      'present',
      'correct',
    ]);
  });

  it('同じ文字を5つ重ねても、答えの1個分だけ correct になる', () => {
    // 答え ABIDE の E は index 4 のみ。EEEEE でも index 4 だけ correct
    expect(evaluateGuess('eeeee', 'abide')).toEqual([
      'absent',
      'absent',
      'absent',
      'absent',
      'correct',
    ]);
  });

  it('答えに2個ある文字は、位置が合う分を先に消費してから残りを present にする', () => {
    // 答え HELLO の L は index 2,3。推測 LOLLL: index 2,3 が correct、先頭の L と末尾の L は absent
    expect(evaluateGuess('lolll', 'hello')).toEqual([
      'absent',
      'present',
      'correct',
      'correct',
      'absent',
    ]);
  });

  it('位置が合う文字を優先し、余った分だけ present にする', () => {
    // 答え: SPEED、推測 ERASE: E(0) は答えのEが残っているので present、E(4) も present
    expect(evaluateGuess('erase', 'speed')).toEqual([
      'present',
      'absent',
      'absent',
      'present',
      'present',
    ]);
    // 答え: ROBOT、推測 FLOOR: O(2) は位置違いで present、O(3) は位置が合って correct
    expect(evaluateGuess('floor', 'robot')).toEqual([
      'absent',
      'absent',
      'present',
      'correct',
      'present',
    ]);
  });
});

describe('入力の正規化', () => {
  it('大文字・全角・前後の空白を吸収する', () => {
    expect(normalizeGuess('  ＡＰＰＬＥ ')).toBe('apple');
    expect(normalizeLetter('Ａ')).toBe('a');
  });

  it('1文字でないか、a〜z以外なら null', () => {
    expect(normalizeLetter('ab')).toBeNull();
    expect(normalizeLetter('1')).toBeNull();
    expect(normalizeLetter('あ')).toBeNull();
  });
});

describe('submitGuess', () => {
  it('正解で won になる', () => {
    const r = submitGuess(game('apple'), 'apple');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.state.phase).toBe('won');
      expect(r.state.guesses).toEqual(['apple']);
    }
  });

  it('外れは playing のまま、6回目で lost', () => {
    let s = game('apple');
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const r = submitGuess(s, 'house');
      expect(r.ok).toBe(true);
      if (!r.ok) return;
      s = r.state;
      expect(s.phase).toBe(i === MAX_ATTEMPTS - 1 ? 'lost' : 'playing');
    }
  });

  it('6回目に当てれば won', () => {
    const s = game('apple', Array(MAX_ATTEMPTS - 1).fill('house'));
    const r = submitGuess(s, 'apple');
    expect(r.ok && r.state.phase).toBe('won');
  });

  it('文字数が違う・リストにない・英字以外はエラーで、状態を変えない', () => {
    const s = game('apple');
    expect(submitGuess(s, 'app')).toEqual({ ok: false, error: 'length' });
    expect(submitGuess(s, 'applez')).toEqual({ ok: false, error: 'length' });
    expect(submitGuess(s, 'zzzzz')).toEqual({ ok: false, error: 'unknown' });
    expect(submitGuess(s, 'ab12e')).toEqual({ ok: false, error: 'chars' });
    expect(s.guesses).toEqual([]);
  });

  it('前後の空白・大文字は受け付ける', () => {
    const r = submitGuess(game('apple'), '  APPLE ');
    expect(r.ok && r.state.phase).toBe('won');
  });

  it('空の入力・日本語・絵文字は length / chars エラーになる', () => {
    const s = game('apple');
    expect(submitGuess(s, '')).toEqual({ ok: false, error: 'length' });
    expect(submitGuess(s, 'りんご')).toEqual({ ok: false, error: 'chars' });
    expect(submitGuess(s, '😀😀😀😀😀')).toEqual({ ok: false, error: 'chars' });
  });

  it('リスト外の単語はエラーで、最終行でも lost にならず回数も増えない', () => {
    const almost = game('apple', Array(MAX_ATTEMPTS - 1).fill('house'));
    const r = submitGuess(almost, 'zzzzz');
    expect(r).toEqual({ ok: false, error: 'unknown' });
    expect(almost.guesses).toHaveLength(MAX_ATTEMPTS - 1);
    // 6回目の正しい単語で won になることは別テストで確認済み
    const r2 = submitGuess(almost, 'apple');
    expect(r2.ok && r2.state.phase).toBe('won');
  });

  it('5回目までの外れでは lost にならない（6回目で初めて lost）', () => {
    const r = submitGuess(
      game('apple', Array(MAX_ATTEMPTS - 2).fill('house')),
      'about',
    );
    expect(r.ok && r.state.phase).toBe('playing');
    expect(r.ok && r.state.guesses).toHaveLength(MAX_ATTEMPTS - 1);
  });

  it('終了後は受け付けない', () => {
    const done: GameState = { ...game('apple'), phase: 'lost' };
    expect(submitGuess(done, 'house')).toEqual({
      ok: false,
      error: 'finished',
    });
  });

  it('同じ単語を2回推測してもよい', () => {
    const first = submitGuess(game('apple'), 'house');
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(submitGuess(first.state, 'house').ok).toBe(true);
  });
});

describe('newGame / giveUp', () => {
  it('リスト内の単語が選ばれ、直前の答えは除外される', () => {
    const s = newGame(() => 0);
    expect(s.answer).toBe(ANSWER_WORDS[0]);
    expect(s.phase).toBe('playing');
    expect(newGame(() => 0, ANSWER_WORDS[0]).answer).toBe(ANSWER_WORDS[1]);
  });

  it('答えは受け付ける単語でもある', () => {
    expect(ANSWER_WORDS.every((w) => isKnownWord(w))).toBe(true);
  });

  it('giveUp は playing のときだけ状態を変える', () => {
    expect(giveUp(game('apple')).phase).toBe('gaveUp');
    const won: GameState = { ...game('apple'), phase: 'won' };
    expect(giveUp(won)).toBe(won);
  });
});

describe('keyStates / resultGrid', () => {
  it('文字ごとに最も強い判定を返す', () => {
    const s = game('apple', ['pizza', 'apple']);
    const k = keyStates(s);
    expect(k.a).toBe('correct');
    expect(k.p).toBe('correct');
    expect(k.z).toBe('absent');
  });

  it('同じ文字が前の推測で present、後の推測で absent なら present を保つ', () => {
    // 答え CRANE。BLEED は E(2) が present、E(3) は残数切れで absent
    const k = keyStates(game('crane', ['bleed']));
    expect(k.e).toBe('present');
    expect(k.b).toBe('absent');
  });

  it('present の後に correct が来たら correct になる', () => {
    const k = keyStates(game('crane', ['bleed', 'crane']));
    expect(k.e).toBe('correct');
  });

  it('推測がないと keyStates は空、resultGrid は空文字', () => {
    expect(keyStates(game('apple'))).toEqual({});
    expect(resultGrid(game('apple'))).toBe('');
  });

  it('共有テキストは絵文字の升目だけで、答えの文字を含まない', () => {
    const grid = resultGrid(game('apple', ['house', 'apple']));
    expect(grid.split('\n')).toHaveLength(2);
    expect(grid.split('\n')[1]).toBe('🟩🟩🟩🟩🟩');
    expect(grid).not.toMatch(/[a-z]/i);
  });

  it('WORD_LENGTH は5', () => {
    expect(WORD_LENGTH).toBe(5);
  });
});
