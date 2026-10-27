import { describe, expect, it } from 'vitest';
import { testTheme } from './test-theme';
import type { ScoringTable, ThemeSpec } from './types';
import { validateTheme } from './validate';

/** 現行の採点表だけを差し替えたテーマ */
function withScoring(f: (s: ScoringTable) => ScoringTable): ThemeSpec {
  return { ...testTheme, scoring: f(testTheme.scoring) };
}

/** 現行の採点表の1問目だけを差し替えたテーマ */
function withFirstQuestion(
  f: (
    q: ScoringTable['questions'][number],
  ) => ScoringTable['questions'][number],
): ThemeSpec {
  return withScoring((s) => ({
    ...s,
    questions: s.questions.map((q, i) => (i === 0 ? f(q) : q)),
  }));
}

describe('validateTheme', () => {
  it('テスト用テーマは正常', () => {
    expect(validateTheme(testTheme)).toEqual([]);
  });

  it('旧版の採点表を正しく持つテーマは正常（版番号が現行より小さい）', () => {
    expect(
      validateTheme({
        ...testTheme,
        version: 2,
        legacyScoring: { 1: testTheme.scoring },
      }),
    ).toEqual([]);
  });

  it('ID重複・未知の参照・候補不足を検出する', () => {
    const broken: ThemeSpec = {
      ...testTheme,
      slots: [
        {
          id: 'x',
          count: 2,
          parts: [
            { id: 'a', when: [{ axis: 'nope', pole: '+' }] },
            { id: 'a', weight: 0 },
          ],
        },
      ],
    };
    const errors = validateTheme(broken);
    expect(errors).toContain('x: 部品IDが重複: a');
    expect(errors).toContain('x/a: 未知の軸を参照: nope');
    expect(errors).toContain('x/a: weight は正の数');
    expect(errors.some((e) => e.startsWith('v1/x: ++++/N の候補が'))).toBe(
      true,
    );
  });

  it('旧版の採点表に対しても部品の候補数を検査する', () => {
    // 旧版は軸 energy がなく、energy の極を条件にした部品が候補にならない
    const withoutEnergy = <T>(record: Record<string, T>) =>
      Object.fromEntries(
        Object.entries(record).filter(([axis]) => axis !== 'energy'),
      );
    const legacy = {
      ...testTheme.scoring,
      axes: testTheme.scoring.axes.filter((a) => a.id !== 'energy'),
      types: testTheme.scoring.types
        .filter((t) => t.poles.energy === '+')
        .map((t) => ({ ...t, poles: withoutEnergy(t.poles) })),
      questions: testTheme.scoring.questions.map((q) => ({
        ...q,
        choices: q.choices.map((c) => ({
          ...c,
          effects: withoutEnergy(c.effects),
        })),
      })),
    };
    const energyOnly = {
      id: 'energyOnly',
      count: 1,
      parts: [
        { id: 'p', when: [{ axis: 'energy', pole: '+' as const }] },
        { id: 'm', when: [{ axis: 'energy', pole: '-' as const }] },
      ],
    };
    const errors = validateTheme({
      ...testTheme,
      version: 2,
      legacyScoring: { 1: legacy },
      slots: [...testTheme.slots, energyOnly],
    });
    expect(errors.some((e) => e.startsWith('v1/energyOnly:'))).toBe(true);
    expect(errors.some((e) => e.startsWith('v2/'))).toBe(false);
  });

  it('版・テーマID・count・★3の到達可能性を検査する', () => {
    const errors = validateTheme({
      ...testTheme,
      id: 'a|b',
      legacyScoring: { 1: testTheme.scoring },
      scoring: {
        ...testTheme.scoring,
        axes: testTheme.scoring.axes.map((a) => ({ ...a, stars: [3, 99] })),
      },
      slots: [{ id: 'z', count: 0, parts: [{ id: 'p' }] }],
    });
    expect(errors).toContain('テーマIDは英小文字・数字・ハイフンのみ');
    expect(errors).toContain('旧版 v1 は現行より小さい1以上の整数');
    expect(errors).toContain('z: count は1以上の整数');
    expect(errors).toContain('v1: 軸 energy の★3に届く回答がない');
  });

  it('テーマIDの形式（空・大文字・空白）と版番号（0・小数）を検査する', () => {
    for (const id of ['', 'Neko', 'a b']) {
      expect(validateTheme({ ...testTheme, id })).toContain(
        'テーマIDは英小文字・数字・ハイフンのみ',
      );
    }
    for (const version of [0, 1.5]) {
      expect(validateTheme({ ...testTheme, version })).toContain(
        'version は1以上の整数',
      );
    }
  });

  it('旧版のキーが不正（先頭ゼロ・非数・現行と同じ版）なら検出する', () => {
    const errors = validateTheme({
      ...testTheme,
      version: 2,
      // 型は数値キーだが、データ（JSON等）由来の不正なキーを想定して無理に通す
      legacyScoring: {
        '01': testTheme.scoring,
        x: testTheme.scoring,
        2: testTheme.scoring,
      } as unknown as ThemeSpec['legacyScoring'],
    });
    expect(errors).toContain('旧版 v01 は現行より小さい1以上の整数');
    expect(errors).toContain('旧版 vx は現行より小さい1以上の整数');
    expect(errors).toContain('旧版 v2 は現行より小さい1以上の整数');
  });

  it('タイプの抜け・出現率の合計・相性帯を検査する', () => {
    const broken: ThemeSpec = {
      ...testTheme,
      scoring: {
        ...testTheme.scoring,
        types: testTheme.scoring.types.slice(1),
        rarityRates: { ...testTheme.scoring.rarityRates, N: 401 },
      },
      compat: { bands: [[65, 100]] },
    };
    const errors = validateTheme(broken);
    expect(errors).toContain('v1: 極の組み合わせ ++++ にタイプがない');
    expect(errors).toContain('v1: 出現率は0以上の整数で合計1000');
    expect(errors).toContain('相性の bands は「軸数+1」個');
    expect(errors).toContain('相性の bands [65, 100] は 0 < min ≤ max ≤ 99');
  });

  it('5択以上・1択の設問を検出する（共有URLは1問2bit）', () => {
    const q = testTheme.scoring.questions[0];
    const five = withScoring((s) => ({
      ...s,
      questions: [
        { ...q, choices: [...q.choices, { id: 'c5', effects: {} }] },
        ...s.questions.slice(1),
      ],
    }));
    expect(validateTheme(five)).toContain('v1: 設問 q1 の選択肢は2〜4個');
    const one = withFirstQuestion((question) => ({
      ...question,
      choices: [question.choices[0]],
    }));
    expect(validateTheme(one)).toContain('v1: 設問 q1 の選択肢は2〜4個');
  });

  it('採点表の重複（軸・設問・選択肢・タイプ・極の組み合わせ）を検出する', () => {
    const axis = testTheme.scoring.axes[0];
    const type = testTheme.scoring.types[0];
    expect(
      validateTheme(withScoring((s) => ({ ...s, axes: [...s.axes, axis] }))),
    ).toContain('v1: 軸IDが重複: energy');
    expect(
      validateTheme(
        withScoring((s) => ({
          ...s,
          questions: [...s.questions, s.questions[0]],
        })),
      ),
    ).toContain('v1: 設問IDが重複: q1');
    expect(
      validateTheme(
        withFirstQuestion((q) => ({
          ...q,
          choices: [q.choices[0], q.choices[0]],
        })),
      ),
    ).toContain('v1: 設問 q1 の選択肢IDが重複: c1');
    expect(
      validateTheme(
        withScoring((s) => ({
          ...s,
          types: [...s.types, { ...type, id: 'dup' }],
        })),
      ),
    ).toContain('v1: 極の組み合わせ ++++ に複数のタイプ');
    expect(
      validateTheme(
        withScoring((s) => ({
          ...s,
          types: [...s.types, { ...s.types[1], id: s.types[0].id }],
        })),
      ),
    ).toContain('v1: タイプIDが重複: type0');
  });

  it('選択肢が未知の軸を参照する・配点が整数でないものを検出する', () => {
    const unknown = withFirstQuestion((q) => ({
      ...q,
      choices: q.choices.map((c) => ({ ...c, effects: { nope: 1 } })),
    }));
    expect(validateTheme(unknown)).toContain(
      'v1: q1/c1 が未知の軸を参照: nope',
    );
    const fractional = withFirstQuestion((q) => ({
      ...q,
      choices: q.choices.map((c) => ({ ...c, effects: { energy: 1.5 } })),
    }));
    expect(validateTheme(fractional)).toContain('v1: q1/c1 の配点は整数');
  });

  it('★閾値が 0 < ★2 < ★3 でなければ検出する', () => {
    for (const stars of [
      [5, 3],
      [0, 3],
      [3, 3],
      [NaN, 5],
    ] as [number, number][]) {
      const errors = validateTheme(
        withScoring((s) => ({
          ...s,
          axes: s.axes.map((a) => (a.id === 'energy' ? { ...a, stars } : a)),
        })),
      );
      expect(errors).toContain('v1: 軸 energy の★閾値は 0 < ★2 < ★3');
    }
  });

  it('出現率の負の値・小数を検出する（合計が1000でも）', () => {
    const negative = withScoring((s) => ({
      ...s,
      rarityRates: { ...s.rarityRates, N: 1400, R: -400 },
    }));
    expect(validateTheme(negative)).toContain(
      'v1: 出現率は0以上の整数で合計1000',
    );
    const fractional = withScoring((s) => ({
      ...s,
      rarityRates: { ...s.rarityRates, N: 400.5, SR: 169.5 },
    }));
    expect(validateTheme(fractional)).toContain(
      'v1: 出現率は0以上の整数で合計1000',
    );
  });

  it('スロットの ID重複・count の型・空の部品・レア度の未知値を検出する', () => {
    expect(
      validateTheme({
        ...testTheme,
        slots: [...testTheme.slots, testTheme.slots[0]],
      }),
    ).toContain('スロットIDが重複: titlePrefix');
    expect(
      validateTheme({
        ...testTheme,
        slots: [{ id: 'z', count: 1.5, parts: [{ id: 'a' }] }],
      }),
    ).toContain('z: count は1以上の整数');
    const empty = validateTheme({
      ...testTheme,
      slots: [{ id: 'z', count: 1, parts: [] }],
    });
    expect(empty).toContain('v1/z: ++++/N の候補が 0 件（1 件以上必要）');
    const rarity = validateTheme({
      ...testTheme,
      slots: [
        {
          id: 'z',
          count: 1,
          rarityMin: 'XR' as 'N',
          parts: [{ id: 'a', rarityMin: 'YY' as 'N' }],
        },
      ],
    });
    expect(rarity).toContain('z: 未知のレア度 XR');
    expect(rarity).toContain('z/a: 未知のレア度 YY');
  });

  it('部品の weight が NaN・0・負なら検出する', () => {
    for (const weight of [NaN, 0, -1, Infinity]) {
      expect(
        validateTheme({
          ...testTheme,
          slots: [
            { id: 'z', count: 1, parts: [{ id: 'a', weight }, { id: 'b' }] },
          ],
        }),
      ).toContain('z/a: weight は正の数');
    }
  });

  it('when の極の誤記と、タイプの未知の軸キーを検出する', () => {
    const errors = validateTheme({
      ...testTheme,
      scoring: {
        ...testTheme.scoring,
        types: testTheme.scoring.types.map((t, i) =>
          i === 0 ? { ...t, poles: { ...t.poles, nope: '+' } } : t,
        ),
      },
      slots: [
        {
          id: 'z',
          count: 1,
          parts: [
            { id: 'a', when: [{ axis: 'energy', pole: 'x' as '+' }] },
            { id: 'b' },
          ],
        },
      ],
    });
    expect(errors).toContain('z/a: 極は + か -: x');
    expect(errors).toContain('v1: タイプ type0 が未知の軸を参照: nope');
  });

  it('相性の bands の小数・範囲外（0・100・min > max）を検出する', () => {
    const fractional: ThemeSpec = {
      ...testTheme,
      compat: {
        bands: testTheme.compat.bands.map(([a, b]) => [a + 0.5, b]) as [
          number,
          number,
        ][],
      },
    };
    expect(validateTheme(fractional)).toContain('相性の bands は整数');
    for (const band of [
      [0, 50],
      [50, 100],
      [70, 65],
    ] as [number, number][]) {
      const errors = validateTheme({
        ...testTheme,
        compat: { bands: [band, ...testTheme.compat.bands.slice(1)] },
      });
      expect(errors).toContain(
        `相性の bands [${band[0]}, ${band[1]}] は 0 < min ≤ max ≤ 99`,
      );
    }
  });
});
