import { describe, expect, it } from 'vitest';
import {
  checkAnagram,
  checkPalindrome,
  defaultOptions,
  normalizeChars,
  type NormalizeOptions,
} from './anagram-palindrome-checker';

const off: NormalizeOptions = {
  nfkc: false,
  ignoreCase: false,
  ignoreSpaces: false,
  ignorePunctuation: false,
  unifyKana: false,
  ignoreLongVowel: false,
  ignoreDakuten: false,
};

describe('normalizeChars', () => {
  it('全オフなら入力をそのままコードポイント単位で返す', () => {
    expect(normalizeChars('A b!', off)).toEqual(['A', ' ', 'b', '!']);
  });

  it('サロゲートペアを1文字として扱う', () => {
    expect(normalizeChars('a𠮷😀', off)).toEqual(['a', '𠮷', '😀']);
  });

  it('大文字小文字・空白・記号を無視する', () => {
    expect(normalizeChars('A man, a plan!', defaultOptions).join('')).toBe(
      'amanaplan',
    );
  });

  it('NFKCで全角英数と半角カナを正規化する', () => {
    expect(normalizeChars('ＡＢｃ１', defaultOptions).join('')).toBe('abc1');
    expect(normalizeChars('ｶﾞｷﾞ', defaultOptions).join('')).toBe('がぎ');
  });

  it('カタカナをひらがなに統一する', () => {
    expect(normalizeChars('カタカナ', defaultOptions).join('')).toBe(
      'かたかな',
    );
    expect(normalizeChars('ヴ', defaultOptions).join('')).toBe('ゔ');
    expect(
      normalizeChars('カタカナ', { ...off, unifyKana: false }).join(''),
    ).toBe('カタカナ');
  });

  it('長音符は既定では残り、オプションで無視できる', () => {
    expect(normalizeChars('ラーメン', defaultOptions).join('')).toBe(
      'らーめん',
    );
    expect(
      normalizeChars('ラーメン', {
        ...defaultOptions,
        ignoreLongVowel: true,
      }).join(''),
    ).toBe('らめん');
  });

  it('濁点・半濁点を無視できる', () => {
    const o = { ...defaultOptions, ignoreDakuten: true };
    expect(normalizeChars('がぎぱぷヴ', o).join('')).toBe('かきはふう');
  });

  it('長音符は記号無視で消えない', () => {
    expect(normalizeChars('ー!', defaultOptions).join('')).toBe('ー');
  });

  it('全角スペースやゼロ幅文字も空白として無視する', () => {
    expect(normalizeChars('a　b​c\n', defaultOptions).join('')).toBe('abc');
  });
});

describe('checkAnagram', () => {
  it('アナグラムを判定する', () => {
    const r = checkAnagram('Listen', 'Silent');
    expect(r.status).toBe('anagram');
    expect(r.normalizedA).toBe('listen');
    expect(r.extraInA).toEqual([]);
    expect(r.extraInB).toEqual([]);
  });

  it('空白・記号を無視して判定する', () => {
    expect(checkAnagram('Dormitory', 'dirty room!').status).toBe('anagram');
  });

  it('日本語（ひらがな・カタカナ混在）を判定する', () => {
    expect(checkAnagram('しんぶんし', 'ブンシシン').status).toBe('anagram');
  });

  it('同一文字列は identical', () => {
    expect(checkAnagram('abc', 'ABC').status).toBe('identical');
  });

  it('不一致のとき過不足を返す', () => {
    const r = checkAnagram('aabc', 'abdd');
    expect(r.status).toBe('different');
    expect(r.extraInA).toEqual([
      { char: 'a', count: 1 },
      { char: 'c', count: 1 },
    ]);
    expect(r.extraInB).toEqual([{ char: 'd', count: 2 }]);
  });

  it('大文字小文字を区別するオプション', () => {
    const o = { ...defaultOptions, ignoreCase: false };
    expect(checkAnagram('Ab', 'ba', o).status).toBe('different');
  });

  it('どちらかが空なら empty', () => {
    expect(checkAnagram('', 'abc').status).toBe('empty');
    expect(checkAnagram('!!', 'abc').status).toBe('empty');
  });

  it('サロゲートペアを1文字として数える', () => {
    const r = checkAnagram('𠮷a', 'a𠮷');
    expect(r.status).toBe('anagram');
    expect(r.lengthA).toBe(2);
  });

  it('濁点無視でアナグラムになる', () => {
    const o = { ...defaultOptions, ignoreDakuten: true };
    expect(checkAnagram('たいこ', 'こだい', o).status).toBe('anagram');
    expect(checkAnagram('たいこ', 'こだい').status).toBe('different');
  });
});

describe('checkPalindrome', () => {
  it('英語の回文を判定する', () => {
    expect(checkPalindrome('A man, a plan, a canal: Panama').status).toBe(
      'palindrome',
    );
  });

  it('日本語の回文（かな・カタカナ差を無視）を判定する', () => {
    expect(checkPalindrome('たけやぶやけた').status).toBe('palindrome');
    expect(checkPalindrome('タケヤブ やけた！').status).toBe('palindrome');
    expect(checkPalindrome('しんぶんし').status).toBe('palindrome');
  });

  it('回文でないとき reversed を返す', () => {
    const r = checkPalindrome('abc');
    expect(r.status).toBe('not');
    expect(r.reversed).toBe('cba');
    expect(r.length).toBe(3);
  });

  it('空・記号のみは empty', () => {
    expect(checkPalindrome('').status).toBe('empty');
    expect(checkPalindrome(' ,. ').status).toBe('empty');
  });

  it('1文字は回文', () => {
    expect(checkPalindrome('a').status).toBe('palindrome');
  });

  it('サロゲートペアを壊さず反転する', () => {
    const r = checkPalindrome('😀a𠮷', { ...off });
    expect(r.reversed).toBe('𠮷a😀');
    expect(r.status).toBe('not');
    expect(checkPalindrome('𠮷a𠮷', off).status).toBe('palindrome');
  });

  it('オプションを切ると区別する', () => {
    expect(checkPalindrome('Aba', off).status).toBe('not');
    expect(checkPalindrome('a b a', off).status).toBe('palindrome');
    expect(checkPalindrome('ab a', off).status).toBe('not');
  });
});

describe('エッジケース', () => {
  it('長い入力（5万文字）でも同一判定できる', () => {
    const a = 'あ'.repeat(50000);
    expect(checkAnagram(a, a).status).toBe('identical');
  });

  it('絵文字は記号扱いで既定では無視され、無視しなければ比較される', () => {
    expect(checkAnagram('😀👍', '👍😀').status).toBe('empty');
    const o = { ...defaultOptions, ignorePunctuation: false };
    expect(checkAnagram('😀👍', '👍😀', o).status).toBe('anagram');
  });

  it('全角英数の回文を判定する', () => {
    expect(checkPalindrome('ＡｂＢａ').status).toBe('palindrome');
  });
});
