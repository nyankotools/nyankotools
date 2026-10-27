import { describe, expect, it } from 'vitest';
import { parseProgress } from './progress';
import { testTheme } from './test-theme';

const raw = (value: unknown) => JSON.stringify(value);

describe('parseProgress', () => {
  it('現行版の途中の回答を読み戻す', () => {
    expect(
      parseProgress(
        raw({ version: 1, answers: [0, 3, 2], variant: 42 }),
        testTheme,
      ),
    ).toEqual({ version: 1, answers: [0, 3, 2], variant: 42 });
  });

  it('相性の相手（vs）は共有コードの形式のときだけ残す', () => {
    expect(
      parseProgress(
        raw({ version: 1, answers: [], variant: 0, vs: '1.1.AAAAAA' }),
        testTheme,
      ),
    ).toEqual({ version: 1, answers: [], variant: 0, vs: '1.1.AAAAAA' });
    expect(
      parseProgress(
        raw({ version: 1, answers: [], variant: 0, vs: 'garbage' }),
        testTheme,
      ),
    ).toEqual({ version: 1, answers: [], variant: 0 });
  });

  it('vs が文字列でなければ捨て、variant は 0 と上限（4095）をどちらも許す', () => {
    expect(
      parseProgress(
        raw({ version: 1, answers: [0], variant: 0, vs: 123 }),
        testTheme,
      ),
    ).toEqual({ version: 1, answers: [0], variant: 0 });
    for (const variant of [0, 4095]) {
      expect(
        parseProgress(raw({ version: 1, answers: [0], variant }), testTheme),
      ).toEqual({ version: 1, answers: [0], variant });
    }
  });

  it('壊れた値・版違い・範囲外は null（例外を出さない）', () => {
    const cases: unknown[] = [
      { version: 2, answers: [0], variant: 0 },
      { version: '1', answers: [0], variant: 0 },
      { version: 1, answers: Array(12).fill(0), variant: 0 }, // 全問答え済みは途中ではない
      { version: 1, answers: [4], variant: 0 },
      { version: 1, answers: [-1], variant: 0 },
      { version: 1, answers: [0.5], variant: 0 },
      { version: 1, answers: '0,1', variant: 0 },
      { version: 1, answers: [0], variant: 4096 },
      { version: 1, answers: [0], variant: -1 },
      { version: 1, answers: [0], variant: '1' },
      null,
      [],
    ];
    for (const value of cases) {
      expect(parseProgress(raw(value), testTheme), raw(value)).toBeNull();
    }
    for (const text of [null, '', '{', 'undefined']) {
      expect(parseProgress(text, testTheme), String(text)).toBeNull();
    }
  });
});
