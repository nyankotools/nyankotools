import { describe, expect, it } from 'vitest';
import { compat } from './compat';
import { diagnose } from './compose';
import { randomInput, testRandom, testTheme } from './test-theme';

describe('compat', () => {
  it('対称で、相性%は一致軸数ごとの範囲内', () => {
    const rand = testRandom(11);
    for (let i = 0; i < 2000; i++) {
      const x = randomInput(rand);
      const y = randomInput(rand);
      const a = diagnose(testTheme, x.answers, x.variant)!;
      const b = diagnose(testTheme, y.answers, y.variant)!;
      const ab = compat(testTheme, a, b);
      expect(compat(testTheme, b, a)).toEqual(ab);
      if (ab.twins) continue;
      const [min, max] = testTheme.compat.bands[ab.matches];
      expect(ab.percent).toBeGreaterThanOrEqual(min);
      expect(ab.percent).toBeLessThanOrEqual(max);
      expect(ab.percent).toBeLessThan(100);
    }
  });

  it('一致軸数を数える', () => {
    const a = diagnose(testTheme, Array(12).fill(0), 0)!; // 全軸 +
    const b = diagnose(testTheme, Array(12).fill(3), 0)!; // 全軸 −
    expect(compat(testTheme, a, b).matches).toBe(0);
    const c = diagnose(testTheme, [...Array(11).fill(0), 1], 0)!;
    expect(compat(testTheme, a, c)).toMatchObject({ matches: 4, twins: false });
  });

  it('一致軸数0（全軸が反対）は最下段の帯域に入る', () => {
    const a = diagnose(testTheme, Array(12).fill(0), 0)!;
    const b = diagnose(testTheme, Array(12).fill(3), 0)!;
    const r = compat(testTheme, a, b);
    expect(r.matches).toBe(0);
    const [min, max] = testTheme.compat.bands[0];
    expect(r.percent).toBeGreaterThanOrEqual(min);
    expect(r.percent).toBeLessThanOrEqual(max);
  });

  it('回答が完全一致なら名前が違っても双子（100%）', () => {
    const answers = [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3];
    const a = diagnose(testTheme, answers, 0)!;
    const b = diagnose(testTheme, answers, 999)!;
    expect(compat(testTheme, a, b)).toEqual({
      matches: 4,
      twins: true,
      percent: 100,
    });
  });

  it('回答が同じでも版が違えば双子にしない（双子は同じ版のときのみ）', () => {
    const answers = Array(12).fill(0);
    const a = diagnose(testTheme, answers, 0)!;
    const revised = { ...a, themeVersion: 2 };
    const r = compat(testTheme, a, revised);
    expect(r.twins).toBe(false);
    expect(r.percent).toBeLessThan(100);
    expect(compat(testTheme, revised, a)).toEqual(r);
  });

  it('版が違う結果同士は、軸IDが一致する分だけ比べ、双子にはしない', () => {
    const answers = Array(12).fill(0);
    const a = diagnose(testTheme, answers, 0)!;
    // 旧版の結果を想定: 軸 energy がない
    const axes = Object.fromEntries(
      Object.entries(a.axes).filter(([axis]) => axis !== 'energy'),
    );
    const old = { ...a, themeVersion: 0, axes, code: '1.0.AAAAAA' };
    expect(compat(testTheme, a, old)).toEqual(compat(testTheme, old, a));
    expect(compat(testTheme, a, old)).toMatchObject({
      matches: 3,
      twins: false,
    });
  });
});
