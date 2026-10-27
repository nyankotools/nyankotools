import { describe, expect, it } from 'vitest';
import type { ShindanThemeTexts } from '../../i18n/shindan/types';
import { diagnose } from './compose';
import { testTheme, TEST_AXES } from './test-theme';
import type { DiagnosisResult, ThemeSpec } from './types';
import { buildResultView } from './view';

/** テスト用テーマの全IDに「ID自体」を文言として割り当てる */
function idTexts(theme: ThemeSpec): ShindanThemeTexts {
  return {
    name: '',
    title: '',
    description: '',
    h1: '',
    intro: '',
    axes: Object.fromEntries(
      TEST_AXES.map((id) => [
        id,
        { label: id, plus: `${id}+`, minus: `${id}-` },
      ]),
    ),
    questions: {},
    types: Object.fromEntries(
      theme.scoring.types.map((t) => [
        t.id,
        { name: `name:${t.id}`, shortName: `[${t.id}]`, description: 'd' },
      ]),
    ),
    parts: Object.fromEntries(
      theme.slots.map((slot) => [
        slot.id,
        Object.fromEntries(slot.parts.map((p) => [p.id, `<${p.id}>`])),
      ]),
    ),
    howItWorks: [],
  };
}

const texts = idTexts(testTheme);

/** レア度が指定値になる variant を探す */
function resultWithRarity(rarity: string): DiagnosisResult {
  for (let variant = 0; variant < 4096; variant++) {
    const r = diagnose(testTheme, Array(12).fill(0), variant);
    if (r?.rarity === rarity) return r;
  }
  throw new Error(`no ${rarity}`);
}

describe('buildResultView', () => {
  it('称号は レア度接頭辞 + 前半 + 後半 + 短縮名 の順に組み立てる', () => {
    const r = resultWithRarity('LR');
    const view = buildResultView(testTheme, texts, r);
    expect(view.title).toBe(
      `<${r.parts.rarityPrefix[0]}><${r.parts.titlePrefix[0]}><${r.parts.titleSuffix[0]}>[${r.typeId}]`,
    );
  });

  it('レア度接頭辞が空（SSR未満）のときは飛ばす', () => {
    const r = resultWithRarity('N');
    expect(r.parts.rarityPrefix).toEqual([]);
    const view = buildResultView(testTheme, texts, r);
    expect(view.title).toBe(
      `<${r.parts.titlePrefix[0]}><${r.parts.titleSuffix[0]}>[${r.typeId}]`,
    );
  });

  it('出現率を%表記で返す（千分率 / 10）', () => {
    expect(
      buildResultView(testTheme, texts, resultWithRarity('UR')).rarityRate,
    ).toBe(4.5);
    expect(
      buildResultView(testTheme, texts, resultWithRarity('N')).rarityRate,
    ).toBe(40);
  });

  it('軸は採点表の順で、極の名前と★を返す', () => {
    const r = diagnose(testTheme, Array(12).fill(0), 0)!;
    const view = buildResultView(testTheme, texts, r);
    expect(view.axes.map((a) => a.id)).toEqual([...TEST_AXES]);
    for (const axis of view.axes) {
      const pole = r.axes[axis.id].pole;
      expect(axis.poleLabel).toBe(`${axis.id}${pole}`);
      expect(axis.stars).toBe(r.axes[axis.id].stars);
    }
  });

  it('各スロットの部品を文言に置き換える', () => {
    const r = diagnose(testTheme, [0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3], 7)!;
    const view = buildResultView(testTheme, texts, r);
    expect(view.strengths).toEqual(r.parts.strength.map((id) => `<${id}>`));
    expect(view.hiddenSide).toBe(`<${r.parts.hiddenSide[0]}>`);
    expect(view.quote).toBe(`<${r.parts.quote[0]}>`);
    expect(view.luckyItem).toBe(`<${r.parts.luckyItem[0]}>`);
    expect(view.luckyAction).toBe(`<${r.parts.luckyAction[0]}>`);
    expect(view.typeName).toBe(`name:${r.typeId}`);
  });

  it('結果の版が現行と違うときは旧版の採点表の軸順を使う', () => {
    const legacy = {
      ...testTheme.scoring,
      axes: [...testTheme.scoring.axes].reverse(),
    };
    const theme = { ...testTheme, legacyScoring: { 0: legacy } };
    const r = diagnose(theme, Array(12).fill(0), 0, 0);
    expect(r?.themeVersion).toBe(0);
    const view = buildResultView(theme, texts, r!);
    expect(view.axes.map((a) => a.id)).toEqual([...TEST_AXES].reverse());
  });

  it('タイプ・軸の文言が無いときも例外を出さず、空文字になる', () => {
    const r = diagnose(testTheme, Array(12).fill(0), 0)!;
    const view = buildResultView(
      testTheme,
      { ...texts, types: {}, axes: {} },
      r,
    );
    expect(view.typeName).toBe('');
    expect(view.typeDescription).toBe('');
    expect(view.title).not.toContain('[');
    for (const axis of view.axes) {
      expect(axis.label).toBe('');
      expect(axis.poleLabel).toBe('');
    }
  });

  it('文言が欠けている部品は空文字にする（例外を出さない）', () => {
    const r = diagnose(testTheme, Array(12).fill(0), 0)!;
    const view = buildResultView(testTheme, { ...texts, parts: {} }, r);
    expect(view.quote).toBe('');
    expect(view.strengths.every((s) => s === '')).toBe(true);
  });
});
