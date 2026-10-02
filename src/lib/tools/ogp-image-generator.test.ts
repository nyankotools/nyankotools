import { describe, expect, it } from 'vitest';
import {
  findSizePreset,
  layoutTitle,
  ogpFileName,
  wrapText,
} from './ogp-image-generator';

// 全角（CJK）は10、半角は5の幅として測る
const measure = (s: string) =>
  [...s].reduce((sum, ch) => sum + (/[、-鿿]/.test(ch) ? 10 : 5), 0);

describe('wrapText', () => {
  it('収まるテキストは1行のまま', () => {
    expect(wrapText('hello', 100, measure)).toEqual(['hello']);
  });

  it('英単語は単語単位で折り返す', () => {
    // 1語=25、スペース=5。幅60なら2語（55）まで
    expect(wrapText('aaaaa bbbbb ccccc', 60, measure)).toEqual([
      'aaaaa bbbbb',
      'ccccc',
    ]);
  });

  it('日本語は1文字単位で折り返す', () => {
    expect(wrapText('あいうえおかきく', 40, measure)).toEqual([
      'あいうえ',
      'おかきく',
    ]);
  });

  it('句読点は行頭に来ないよう前の行に付ける', () => {
    expect(wrapText('あいうえ。お', 40, measure)).toEqual(['あいうえ。', 'お']);
  });

  it('幅を超える長い単語は文字単位で分割する', () => {
    expect(wrapText('abcdefghij', 25, measure)).toEqual(['abcde', 'fghij']);
  });

  it('\\n は強制改行で、末尾の空行は捨てる', () => {
    expect(wrapText('a\nb\n\n', 100, measure)).toEqual(['a', 'b']);
    expect(wrapText('a\n\nb', 100, measure)).toEqual(['a', '', 'b']);
  });

  it('空文字は空行1つ', () => {
    expect(wrapText('', 100, measure)).toEqual(['']);
  });
});

describe('layoutTitle', () => {
  const base = {
    maxWidth: 200,
    maxHeight: 100,
    maxFontSize: 40,
    minFontSize: 20,
    lineHeight: 1.25,
    // フォントサイズに比例して幅が変わる（size=10 で上の measure と同じ）
    measureAt: (s: string, size: number) => (measure(s) * size) / 10,
  };

  it('短いタイトルは最大サイズで描画する', () => {
    const r = layoutTitle('あい', base);
    expect(r.fontSize).toBe(40);
    expect(r.lines).toEqual(['あい']);
    expect(r.truncated).toBe(false);
  });

  it('長いタイトルは収まる大きさまでフォントを縮める', () => {
    const r = layoutTitle('あいうえおかきくけこさしすせそたち', base);
    expect(r.fontSize).toBeLessThan(40);
    expect(r.lines.length * r.fontSize * 1.25).toBeLessThanOrEqual(100);
    expect(r.truncated).toBe(false);
  });

  it('最小サイズでも収まらなければ省略記号で切る', () => {
    const r = layoutTitle('あ'.repeat(200), base);
    expect(r.fontSize).toBe(20);
    expect(r.truncated).toBe(true);
    expect(r.lines.length).toBeLessThanOrEqual(4);
    expect(r.lines[r.lines.length - 1].endsWith('…')).toBe(true);
  });
});

describe('layoutTitle: 刻み幅が割り切れない場合', () => {
  it('最小サイズで収まるなら省略記号を付けない', () => {
    const r = layoutTitle('あ'.repeat(8), {
      maxWidth: 100,
      maxHeight: 60,
      maxFontSize: 31,
      minFontSize: 20,
      lineHeight: 1.5,
      measureAt: (s, size) => [...s].length * size,
    });
    expect(r.truncated).toBe(false);
    expect(r.fontSize).toBe(20);
  });
});

describe('wrapText: 禁則', () => {
  it('行頭禁則の押し込みは1文字までで、連続する場合は折り返す', () => {
    const lines = wrapText('あいうえ！！！！', 40, measure);
    expect(lines.every((l) => measure(l) <= 50)).toBe(true);
  });
});

describe('findSizePreset / ogpFileName', () => {
  it('未知のIDは 1200x630 にフォールバックする', () => {
    expect(findSizePreset('nope')).toMatchObject({ width: 1200, height: 630 });
    expect(findSizePreset('square')).toMatchObject({ width: 1080 });
  });

  it('ファイル名にサイズを含める', () => {
    expect(ogpFileName(findSizePreset('x'))).toBe('ogp-1200x675.png');
  });
});
