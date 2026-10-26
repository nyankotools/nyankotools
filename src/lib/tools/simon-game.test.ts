import { describe, expect, it } from 'vitest';
import {
  checkInput,
  clearedRounds,
  extendSequence,
  gapDurationMs,
  newGame,
  nextRound,
  panelFromKey,
  parseBest,
  pressPanel,
  randomPanel,
  stepDurationMs,
  updateBest,
} from './simon-game';

describe('randomPanel', () => {
  it('乱数を0〜3へ変換する', () => {
    expect(randomPanel(() => 0)).toBe(0);
    expect(randomPanel(() => 0.26)).toBe(1);
    expect(randomPanel(() => 0.5)).toBe(2);
    expect(randomPanel(() => 0.99)).toBe(3);
  });
  it('範囲外の乱数でも0〜3に収める', () => {
    expect(randomPanel(() => 1)).toBe(3);
    expect(randomPanel(() => -1)).toBe(0);
  });
});

describe('extendSequence', () => {
  it('元の配列を変更せず末尾に追加する', () => {
    const seq = [1, 2];
    const next = extendSequence(seq, () => 0.9);
    expect(next).toEqual([1, 2, 3]);
    expect(seq).toEqual([1, 2]);
  });
});

describe('checkInput', () => {
  it('途中まで合っていれば partial', () => {
    expect(checkInput([0, 1, 2], [0, 1])).toBe('partial');
  });
  it('全部合っていれば complete', () => {
    expect(checkInput([0, 1, 2], [0, 1, 2])).toBe('complete');
  });
  it('違えば wrong', () => {
    expect(checkInput([0, 1, 2], [0, 2])).toBe('wrong');
  });
  it('長すぎる入力は wrong、空入力は partial', () => {
    expect(checkInput([0], [0, 0])).toBe('wrong');
    expect(checkInput([0], [])).toBe('partial');
  });
});

describe('ラウンド進行', () => {
  it('nextRound で1つ伸び入力が空になる', () => {
    const s = nextRound(newGame(), () => 0.3);
    expect(s.sequence).toEqual([1]);
    expect(s.inputs).toEqual([]);
  });
  it('正しく押すと complete になり、次ラウンドへ進める', () => {
    let s = nextRound(newGame(), () => 0);
    const out = pressPanel(s, 0);
    expect(out.result).toBe('complete');
    s = nextRound(out.state, () => 0.9);
    expect(s.sequence).toEqual([0, 3]);
    expect(pressPanel(s, 0).result).toBe('partial');
  });
  it('間違えると wrong', () => {
    const s = nextRound(newGame(), () => 0);
    expect(pressPanel(s, 2).result).toBe('wrong');
  });
  it('範囲外・小数のパネル番号は無視する', () => {
    const s = nextRound(newGame(), () => 0);
    expect(pressPanel(s, 4).state).toBe(s);
    expect(pressPanel(s, -1).state).toBe(s);
    expect(pressPanel(s, 1.5).state).toBe(s);
  });
});

describe('clearedRounds', () => {
  it('失敗時は直前に完走した長さ', () => {
    const s = { sequence: [0, 1, 2], inputs: [] };
    expect(clearedRounds(s, true)).toBe(2);
    expect(clearedRounds(s, false)).toBe(3);
    expect(clearedRounds(newGame(), true)).toBe(0);
  });
});

describe('速度', () => {
  it('長くなるほど短くなり下限がある', () => {
    expect(stepDurationMs(1)).toBe(600);
    expect(stepDurationMs(5)).toBeLessThan(stepDurationMs(1));
    expect(stepDurationMs(1000)).toBe(250);
    expect(gapDurationMs(1)).toBeGreaterThan(0);
  });
});

describe('ベスト記録', () => {
  it('parseBest は不正値を0にする', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-3')).toBe(0);
    expect(parseBest('2.5')).toBe(0);
    expect(parseBest('12')).toBe(12);
    expect(parseBest('99999')).toBe(0);
  });
  it('updateBest は上回ったときだけ更新', () => {
    expect(updateBest(5, 7)).toEqual({ best: 7, isNew: true });
    expect(updateBest(5, 5)).toEqual({ best: 5, isNew: false });
    expect(updateBest(0, 0)).toEqual({ best: 0, isNew: false });
  });
});

describe('panelFromKey', () => {
  it('1〜4をパネル番号に変換する', () => {
    expect(panelFromKey('1')).toBe(0);
    expect(panelFromKey('4')).toBe(3);
    expect(panelFromKey('5')).toBe(-1);
    expect(panelFromKey('0')).toBe(-1);
    expect(panelFromKey('a')).toBe(-1);
    expect(panelFromKey('Enter')).toBe(-1);
  });
});
