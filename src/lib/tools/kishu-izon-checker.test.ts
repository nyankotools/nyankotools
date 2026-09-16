import { describe, expect, it } from 'vitest';
import {
  findKishuIzonMoji,
  replaceKishuIzonMoji,
  summarizeMatches,
} from './kishu-izon-checker';

describe('findKishuIzonMoji', () => {
  it('該当する文字がなければ空配列を返す', () => {
    expect(findKishuIzonMoji('こんにちは、World!')).toEqual([]);
  });

  it('丸数字を検出する', () => {
    const matches = findKishuIzonMoji('①②③');
    expect(matches).toHaveLength(3);
    expect(matches[0]).toMatchObject({
      index: 0,
      char: '①',
      codePoint: 'U+2460',
      category: '丸数字',
      replacement: '(1)',
    });
    expect(matches[2].index).toBe(2);
  });

  it('通常の文字に紛れた機種依存文字も位置を正しく検出する', () => {
    const matches = findKishuIzonMoji('価格㍉本体㈱御中');
    expect(matches.map((m) => m.char)).toEqual(['㍉', '㈱']);
    expect(matches[0].index).toBe(2);
    expect(matches[1].index).toBe(5);
  });

  it('元号記号・単位記号・その他記号を検出する', () => {
    const chars = ['㍻', '㎏', '№', '℡', '髙', '﨑'];
    for (const char of chars) {
      expect(findKishuIzonMoji(char)).toHaveLength(1);
    }
  });

  it('ローマ数字の大文字・小文字を区別してラベル付けする', () => {
    const [upper] = findKishuIzonMoji('Ⅳ');
    const [lower] = findKishuIzonMoji('ⅳ');
    expect(upper.replacement).toBe('IV');
    expect(lower.replacement).toBe('iv');
  });

  it('localeを指定すると英語のラベル・置き換え候補になる', () => {
    const [match] = findKishuIzonMoji('㍉', 'en');
    expect(match.category).toBe('Unit symbol (ligature)');
    expect(match.replacement).toBe('milli');
  });
});

describe('summarizeMatches', () => {
  it('同じ文字の出現回数を集計する', () => {
    const matches = findKishuIzonMoji('①①②');
    const summary = summarizeMatches(matches);
    expect(summary).toHaveLength(2);
    expect(summary.find((s) => s.char === '①')?.count).toBe(2);
    expect(summary.find((s) => s.char === '②')?.count).toBe(1);
  });
});

describe('replaceKishuIzonMoji', () => {
  it('検出した文字を安全な表記に置き換える', () => {
    expect(replaceKishuIzonMoji('①㍉㈱髙')).toBe('(1)ミリ(株)高');
  });

  it('該当しない文字はそのまま残す', () => {
    expect(replaceKishuIzonMoji('こんにちは①')).toBe('こんにちは(1)');
  });
});
