import { describe, expect, it } from 'vitest';
import { diagnose } from './compose';
import { selectParts } from './select';
import { randomInput, testRandom, testTheme } from './test-theme';
import type { AxisResult, Part, Slot, ThemeSpec } from './types';

const axes: Record<string, AxisResult> = {
  energy: { score: 3, pole: '+', stars: 2 },
  social: { score: -1, pole: '-', stars: 1 },
  curious: { score: 0, pole: '+', stars: 1 },
  affection: { score: -6, pole: '-', stars: 3 },
};

function slotOf(theme: ThemeSpec, id: string): Slot {
  return theme.slots.find((s) => s.id === id)!;
}

/** スロットの部品リストだけを差し替えたテーマを作る */
function withParts(
  theme: ThemeSpec,
  slotId: string,
  fn: (parts: Part[]) => Part[],
): ThemeSpec {
  return {
    ...theme,
    slots: theme.slots.map((s) =>
      s.id === slotId ? { ...s, parts: fn(s.parts) } : s,
    ),
  };
}

/** 同じ入力で2つのテーマの結果を比べ、スロットごとに変わった件数を数える */
function countChanges(base: ThemeSpec, changed: ThemeSpec, n: number) {
  const rand = testRandom(7);
  const diff: Record<string, number> = {};
  for (let i = 0; i < n; i++) {
    const { answers, variant } = randomInput(rand);
    const a = diagnose(base, answers, variant)!;
    const b = diagnose(changed, answers, variant)!;
    for (const slotId of Object.keys(a.parts)) {
      if (a.parts[slotId].join() !== b.parts[slotId].join()) {
        diff[slotId] = (diff[slotId] ?? 0) + 1;
      }
    }
  }
  return diff;
}

describe('selectParts (HRW)', () => {
  it('when 条件を満たす部品だけから、重複なく count 個選ぶ', () => {
    const slot = slotOf(testTheme, 'strength');
    for (let seed = 0; seed < 200; seed++) {
      const ids = selectParts(slot, seed * 7919, axes, 'N');
      expect(ids).toHaveLength(3);
      expect(new Set(ids).size).toBe(3);
      for (const id of ids) {
        expect(id).toMatch(/^st-(energyp|socialm|curiousp|affectionm)-/);
      }
    }
  });

  it('when の条件を一つも満たさなければ空', () => {
    const slot: Slot = {
      id: 's',
      count: 1,
      parts: [{ id: 'p', when: [{ axis: 'energy', pole: '-' }] }],
    };
    expect(selectParts(slot, 1, axes, 'N')).toEqual([]);
  });

  it('候補が count 件に足りないときは候補の数だけ返す（検証は validate の役目）', () => {
    const slot: Slot = {
      id: 's',
      count: 3,
      parts: [{ id: 'a' }, { id: 'b' }],
    };
    expect(selectParts(slot, 5, axes, 'N').sort()).toEqual(['a', 'b']);
  });

  it('スロットと部品の rarityMin を守る', () => {
    const slot = slotOf(testTheme, 'rarityPrefix');
    expect(selectParts(slot, 1, axes, 'SR')).toEqual([]);
    for (let seed = 0; seed < 200; seed++) {
      expect(selectParts(slot, seed, axes, 'SSR')[0]).toMatch(/^rp-ssr-/);
      expect(selectParts(slot, seed, axes, 'UR')[0]).toMatch(/^rp-(ssr|ur)-/);
    }
  });

  it('weight が大きい部品ほど選ばれやすい', () => {
    const slot: Slot = {
      id: 's',
      count: 1,
      parts: [{ id: 'a', weight: 3 }, { id: 'b' }],
    };
    let a = 0;
    for (let seed = 0; seed < 10000; seed++) {
      if (selectParts(slot, seed * 104729, axes, 'N')[0] === 'a') a++;
    }
    expect(a / 10000).toBeGreaterThan(0.72);
    expect(a / 10000).toBeLessThan(0.78);
  });

  it('部品を1件追加しても、変わるのはそのスロットの約 1/(n+1) だけ', () => {
    const quote = slotOf(testTheme, 'quote');
    const added: ThemeSpec = {
      ...testTheme,
      slots: testTheme.slots.map((s) =>
        s === quote ? { ...s, parts: [...s.parts, { id: 'qt-new' }] } : s,
      ),
    };
    const n = 20000;
    const diff = countChanges(testTheme, added, n);
    expect(Object.keys(diff)).toEqual(['quote']);
    const expected = 1 / (quote.parts.length + 1);
    expect(diff.quote / n).toBeGreaterThan(expected * 0.7);
    expect(diff.quote / n).toBeLessThan(expected * 1.3);
  }, 30000);

  it('部品を1件追加して変わった人は、新部品を引いた人だけ（他の結果は不変）', () => {
    const added = withParts(testTheme, 'quote', (parts) => [
      ...parts,
      { id: 'qt-new' },
    ]);
    const rand = testRandom(21);
    for (let i = 0; i < 5000; i++) {
      const { answers, variant } = randomInput(rand);
      const a = diagnose(testTheme, answers, variant)!;
      const b = diagnose(added, answers, variant)!;
      expect(b.typeId).toBe(a.typeId);
      expect(b.rarity).toBe(a.rarity);
      expect(b.axes).toEqual(a.axes);
      if (a.parts.quote[0] !== b.parts.quote[0]) {
        expect(b.parts.quote).toEqual(['qt-new']);
      }
    }
  });

  it('部品を削除しても、変わるのはその部品を引いていた人だけ', () => {
    const removed: ThemeSpec = {
      ...testTheme,
      slots: testTheme.slots.map((s) =>
        s.id === 'luckyItem'
          ? { ...s, parts: s.parts.filter((p) => p.id !== 'li-0') }
          : s,
      ),
    };
    const rand = testRandom(9);
    for (let i = 0; i < 5000; i++) {
      const { answers, variant } = randomInput(rand);
      const a = diagnose(testTheme, answers, variant)!;
      const b = diagnose(removed, answers, variant)!;
      if (a.parts.luckyItem[0] !== 'li-0') {
        expect(b.parts).toEqual(a.parts);
      } else {
        expect(b.parts.luckyItem[0]).not.toBe('li-0');
      }
    }
  });

  it.each([
    ['weight を 1 → 3 に上げる', (p: Part): Part => ({ ...p, weight: 3 })],
    [
      'when に条件を足す',
      (p: Part): Part => ({ ...p, when: [{ axis: 'affection', pole: '-' }] }),
    ],
  ])('部品の %s と、変わるのはその部品が勝った・負けた人だけ', (_, change) => {
    const target = 'st-energyp-0';
    const changed = withParts(testTheme, 'strength', (parts) =>
      parts.map((p) => (p.id === target ? change(p) : p)),
    );
    const rand = testRandom(33);
    for (let i = 0; i < 5000; i++) {
      const { answers, variant } = randomInput(rand);
      const a = diagnose(testTheme, answers, variant)!;
      const b = diagnose(changed, answers, variant)!;
      for (const slotId of Object.keys(a.parts)) {
        if (a.parts[slotId].join() === b.parts[slotId].join()) continue;
        expect(slotId).toBe('strength');
        expect(
          a.parts[slotId].includes(target) || b.parts[slotId].includes(target),
        ).toBe(true);
      }
    }
  });
});
