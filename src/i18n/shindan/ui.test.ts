import { describe, expect, it } from 'vitest';
import { shindanUiJa } from './ui';

/** 文言中の {name} 形式のプレースホルダ名を取り出す */
function placeholdersOf(text: string): string[] {
  return [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
}

/**
 * 文言ごとに期待するプレースホルダ。ランタイムの fill() は未知のキーを "undefined" に置き換えるため、
 * ここで取りこぼしや綴りのずれを検出する。
 */
const EXPECTED_PLACEHOLDERS: Partial<
  Record<keyof typeof shindanUiJa, string[]>
> = {
  questionCount: ['total'],
  progress: ['current', 'total'],
  remaining: ['n'],
  resultFor: ['name'],
  typeIs: ['type'],
  rarityRate: ['rate'],
};

describe('診断の共通文言（shindanUiJa）', () => {
  it('プレースホルダが期待どおりで、綴りのずれがない', () => {
    for (const [key, expected] of Object.entries(EXPECTED_PLACEHOLDERS)) {
      const text = shindanUiJa[key as keyof typeof shindanUiJa];
      if (typeof text !== 'string') throw new Error(`${key} は文字列ではない`);
      expect(placeholdersOf(text), key).toEqual(expected);
    }
  });

  it('プレースホルダを持たない文言に { } が混入していない', () => {
    for (const [key, value] of Object.entries(shindanUiJa)) {
      if (typeof value !== 'string' || key in EXPECTED_PLACEHOLDERS) continue;
      expect(placeholdersOf(value), key).toEqual([]);
      expect(value.includes('{') || value.includes('}'), key).toBe(false);
    }
  });

  it('空の文言がない（文字列と免責の配列）', () => {
    for (const [key, value] of Object.entries(shindanUiJa)) {
      if (typeof value === 'string') {
        expect(value.trim(), key).not.toBe('');
      }
    }
    expect(shindanUiJa.disclaimers.length).toBeGreaterThan(0);
    for (const item of shindanUiJa.disclaimers) {
      expect(item.trim()).not.toBe('');
    }
  });

  it('6段階のレア度すべてに表示名がある', () => {
    expect(Object.keys(shindanUiJa.rarityLabels).sort()).toEqual(
      ['LR', 'N', 'R', 'SR', 'SSR', 'UR'].sort(),
    );
    for (const label of Object.values(shindanUiJa.rarityLabels)) {
      expect(label.trim()).not.toBe('');
    }
  });

  it('結果画面に医学的・心理学的な診断ではない旨の注意が出る', () => {
    expect(shindanUiJa.resultNote).toContain(
      '医学的・心理学的な診断ではありません',
    );
    expect(
      shindanUiJa.disclaimers.some((d) =>
        d.includes('医学的・心理学的な診断ではありません'),
      ),
    ).toBe(true);
  });
});
