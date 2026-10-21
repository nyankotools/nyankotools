import { describe, expect, it } from 'vitest';
import {
  countPatterns,
  evaluate,
  generateSecret,
  giveUp,
  newGame,
  normalizeConfig,
  parseGuess,
  submitGuess,
  type GameState,
} from './hit-and-blow';

/** 決まった列を順に返す乱数 */
function seq(values: number[]) {
  let i = 0;
  return (max: number) => values[i++ % values.length] % max;
}

const noRepeat = { digits: 4, allowRepeat: false };
const repeat = { digits: 4, allowRepeat: true };

describe('evaluate', () => {
  it('全桁一致は Hit のみ', () => {
    expect(evaluate([1, 2, 3, 4], [1, 2, 3, 4])).toEqual({ hit: 4, blow: 0 });
  });
  it('数字だけ合っていれば Blow', () => {
    expect(evaluate([1, 2, 3, 4], [4, 3, 2, 1])).toEqual({ hit: 0, blow: 4 });
    expect(evaluate([1, 2, 3, 4], [1, 3, 5, 6])).toEqual({ hit: 1, blow: 1 });
  });
  it('一致なし', () => {
    expect(evaluate([1, 2, 3, 4], [5, 6, 7, 8])).toEqual({ hit: 0, blow: 0 });
  });
  it('重複ありでも二重に数えない', () => {
    // 答え 1123 / 推測 1111: Hit 2（1桁目・2桁目）、残りの答えの1は無いので Blow 0
    expect(evaluate([1, 1, 2, 3], [1, 1, 1, 1])).toEqual({ hit: 2, blow: 0 });
    // 答え 1223 / 推測 2211: Hit は2桁目の2のみ。Blow は 2が1つ・1が1つ
    expect(evaluate([1, 2, 2, 3], [2, 2, 1, 1])).toEqual({ hit: 1, blow: 2 });
    expect(evaluate([0, 0, 0], [0, 0, 0])).toEqual({ hit: 3, blow: 0 });
    expect(evaluate([0, 0, 1], [1, 0, 0])).toEqual({ hit: 1, blow: 2 });
  });
});

describe('generateSecret', () => {
  it('重複なしは桁がすべて異なる', () => {
    for (let n = 0; n < 50; n++) {
      const s = generateSecret(noRepeat);
      expect(s).toHaveLength(4);
      expect(new Set(s).size).toBe(4);
      expect(s.every((d) => d >= 0 && d <= 9)).toBe(true);
    }
  });
  it('重複ありは乱数どおりに並ぶ', () => {
    expect(generateSecret(repeat, seq([3, 3, 0, 9]))).toEqual([3, 3, 0, 9]);
  });
  it('桁数は3〜5に丸められる', () => {
    expect(generateSecret({ digits: 3, allowRepeat: true })).toHaveLength(3);
    expect(generateSecret({ digits: 5, allowRepeat: false })).toHaveLength(5);
    expect(generateSecret({ digits: 9, allowRepeat: false })).toHaveLength(5);
    expect(generateSecret({ digits: 1, allowRepeat: true })).toHaveLength(3);
  });
});

describe('normalizeConfig', () => {
  it('不正な桁数は既定値や範囲内に直す', () => {
    expect(normalizeConfig({ digits: NaN, allowRepeat: true }).digits).toBe(4);
    expect(normalizeConfig({ digits: 2.6, allowRepeat: true }).digits).toBe(3);
  });
});

describe('parseGuess', () => {
  it('正しい入力を桁の配列にする（全角・前後の空白も可）', () => {
    expect(parseGuess('1234', noRepeat)).toEqual({
      ok: true,
      digits: [1, 2, 3, 4],
    });
    expect(parseGuess(' １２３４ ', noRepeat)).toEqual({
      ok: true,
      digits: [1, 2, 3, 4],
    });
    expect(parseGuess('0123', noRepeat)).toEqual({
      ok: true,
      digits: [0, 1, 2, 3],
    });
  });
  it('エラーの種類を返す', () => {
    expect(parseGuess('', noRepeat)).toEqual({ ok: false, error: 'empty' });
    expect(parseGuess('   ', noRepeat)).toEqual({ ok: false, error: 'empty' });
    expect(parseGuess('12a4', noRepeat)).toEqual({
      ok: false,
      error: 'nonDigit',
    });
    expect(parseGuess('-123', noRepeat)).toEqual({
      ok: false,
      error: 'nonDigit',
    });
    expect(parseGuess('123', noRepeat)).toEqual({ ok: false, error: 'length' });
    expect(parseGuess('12345', noRepeat)).toEqual({
      ok: false,
      error: 'length',
    });
    expect(parseGuess('1123', noRepeat)).toEqual({
      ok: false,
      error: 'repeat',
    });
  });
  it('重複ありなら同じ数字も入力できる', () => {
    expect(parseGuess('1123', repeat)).toEqual({
      ok: true,
      digits: [1, 1, 2, 3],
    });
  });
});

describe('submitGuess / giveUp', () => {
  const base = (): GameState => ({
    config: noRepeat,
    secret: [1, 2, 3, 4],
    guesses: [],
    phase: 'playing',
  });

  it('推測が履歴に追加され、元の状態は変わらない', () => {
    const s = base();
    const r = submitGuess(s, '1357');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.state.guesses).toEqual([
      { digits: [1, 3, 5, 7], hit: 1, blow: 1 },
    ]);
    expect(r.state.phase).toBe('playing');
    expect(s.guesses).toHaveLength(0);
  });
  it('正解で勝ちになり、以降の推測は受け付けない', () => {
    const r = submitGuess(base(), '1234');
    expect(r.ok && r.state.phase).toBe('won');
    if (!r.ok) return;
    expect(submitGuess(r.state, '1234')).toEqual({
      ok: false,
      error: 'finished',
    });
  });
  it('不正な入力は履歴に追加されない', () => {
    expect(submitGuess(base(), '11')).toEqual({ ok: false, error: 'length' });
  });
  it('ギブアップで終了し、終了後は変わらない', () => {
    const g = giveUp(base());
    expect(g.phase).toBe('gaveUp');
    expect(submitGuess(g, '1234')).toEqual({ ok: false, error: 'finished' });
    expect(giveUp(g)).toBe(g);
    const won = submitGuess(base(), '1234');
    if (won.ok) expect(giveUp(won.state)).toBe(won.state);
  });
});

describe('newGame / countPatterns', () => {
  it('新しいゲームは履歴が空で playing', () => {
    const g = newGame({ digits: 3, allowRepeat: true }, seq([1, 2, 3]));
    expect(g).toMatchObject({
      secret: [1, 2, 3],
      guesses: [],
      phase: 'playing',
    });
  });
  it('組み合わせの総数', () => {
    expect(countPatterns(noRepeat)).toBe(5040);
    expect(countPatterns(repeat)).toBe(10000);
    expect(countPatterns({ digits: 3, allowRepeat: false })).toBe(720);
    expect(countPatterns({ digits: 5, allowRepeat: false })).toBe(30240);
  });
});
