import { describe, it, expect } from 'vitest';
import {
  blockTop,
  clampNumber,
  defaultFontSize,
  defaultStroke,
  layoutCaption,
  memeFileName,
  normalizeCaption,
  wrapLine,
} from './meme-generator';

/** 1文字 = size * 0.5 の等幅として測る */
const measure = (text: string, size: number) =>
  Array.from(text).length * size * 0.5;

describe('normalizeCaption', () => {
  it('大文字化と前後の空行除去', () => {
    expect(normalizeCaption('\n\nHello\r\nworld\n\n', true)).toEqual([
      'HELLO',
      'WORLD',
    ]);
    expect(normalizeCaption('Abc', false)).toEqual(['Abc']);
  });
  it('空文字は空配列', () => {
    expect(normalizeCaption('', true)).toEqual([]);
    expect(normalizeCaption(' \n ', false)).toEqual([]);
  });
});

describe('wrapLine', () => {
  it('収まるなら折り返さない', () => {
    expect(wrapLine('hello world', 100, 10, measure)).toEqual(['hello world']);
  });
  it('英単語は空白で折り返す', () => {
    // 1文字5px、幅50px = 10文字
    expect(wrapLine('hello brave world', 50, 10, measure)).toEqual([
      'hello',
      'brave',
      'world',
    ]);
  });
  it('日本語は1文字ずつ折り返せる', () => {
    expect(wrapLine('あいうえおかきくけこ', 25, 10, measure)).toEqual([
      'あいうえお',
      'かきくけこ',
    ]);
  });
  it('幅を超える長い1語は文字単位で割る', () => {
    const lines = wrapLine('abcdefghijkl', 30, 10, measure);
    expect(lines).toEqual(['abcdef', 'ghijkl']);
  });
  it('空行は空文字1行', () => {
    expect(wrapLine('  ', 30, 10, measure)).toEqual(['']);
  });
});

describe('layoutCaption', () => {
  it('空のキャプションは行なし', () => {
    const r = layoutCaption(
      [],
      { maxWidth: 100, maxHeight: 100, baseSize: 20, autoShrink: true },
      measure,
    );
    expect(r.lines).toEqual([]);
    expect(r.height).toBe(0);
  });
  it('収まるなら基準サイズのまま', () => {
    const r = layoutCaption(
      ['HI'],
      { maxWidth: 200, maxHeight: 100, baseSize: 40, autoShrink: true },
      measure,
    );
    expect(r.size).toBe(40);
    expect(r.lines).toEqual(['HI']);
    expect(r.overflow).toBe(false);
  });
  it('長い文は折り返して高さに収まる最大サイズまで縮む', () => {
    const text = 'THIS IS A VERY LONG MEME CAPTION';
    const r = layoutCaption(
      [text],
      { maxWidth: 200, maxHeight: 60, baseSize: 60, autoShrink: true },
      measure,
    );
    expect(r.overflow).toBe(false);
    expect(r.height).toBeLessThanOrEqual(60);
    expect(r.size).toBeLessThan(60);
    // 1つ大きいサイズは収まらない
    const bigger = layoutCaption(
      [text],
      { maxWidth: 200, maxHeight: 60, baseSize: r.size + 1, autoShrink: false },
      measure,
    );
    expect(bigger.overflow).toBe(true);
  });
  it('自動縮小オフなら基準サイズで折り返すだけ', () => {
    const r = layoutCaption(
      ['aaaa bbbb cccc'],
      { maxWidth: 50, maxHeight: 10, baseSize: 20, autoShrink: false },
      measure,
    );
    expect(r.size).toBe(20);
    expect(r.lines.length).toBeGreaterThan(1);
    expect(r.overflow).toBe(true);
  });
  it('最小サイズでも収まらなければ overflow', () => {
    const r = layoutCaption(
      ['x '.repeat(500)],
      { maxWidth: 40, maxHeight: 20, baseSize: 30, autoShrink: true },
      measure,
    );
    expect(r.overflow).toBe(true);
    expect(r.size).toBe(8);
  });
  it('複数行の改行を保つ', () => {
    const r = layoutCaption(
      ['ONE', 'TWO'],
      { maxWidth: 500, maxHeight: 500, baseSize: 20, autoShrink: true },
      measure,
    );
    expect(r.lines).toEqual(['ONE', 'TWO']);
  });
});

describe('blockTop / defaults / names', () => {
  it('上は余白、下は下端から', () => {
    expect(blockTop('top', 400, 100, 10)).toBe(10);
    expect(blockTop('bottom', 400, 100, 10)).toBe(290);
    expect(blockTop('bottom', 50, 100, 10)).toBe(0);
  });
  it('初期値', () => {
    expect(defaultFontSize(800, 400)).toBe(50);
    expect(defaultFontSize(10, 10)).toBe(16);
    expect(defaultStroke(48)).toBe(6);
    expect(defaultStroke(1)).toBe(1);
  });
  it('clampNumber', () => {
    expect(clampNumber(NaN, 1, 5, 3)).toBe(3);
    expect(clampNumber(9, 1, 5)).toBe(5);
  });
  it('ファイル名', () => {
    expect(memeFileName('cat.photo.png', 'png')).toBe('cat.photo-meme.png');
    expect(memeFileName('a.png', 'jpeg')).toBe('a-meme.jpg');
    expect(memeFileName(null, 'png')).toBe('image-meme.png');
  });
});
