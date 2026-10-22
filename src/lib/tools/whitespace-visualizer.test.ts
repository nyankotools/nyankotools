import { describe, expect, it } from 'vitest';
import {
  classifyChar,
  findTrailingWhitespaceLines,
  visualizeWhitespace,
} from './whitespace-visualizer';

describe('classifyChar', () => {
  it('分類できる', () => {
    expect(classifyChar(0x09, true)).toBe('tab');
    expect(classifyChar(0xa0, true)).toBe('nbsp');
    expect(classifyChar(0x3000, true)).toBe('wideSpace');
    expect(classifyChar(0x2003, true)).toBe('otherSpace');
    expect(classifyChar(0x0a, true)).toBe('newline');
    expect(classifyChar(0x00, true)).toBe('control');
    expect(classifyChar(0x85, true)).toBe('control');
    expect(classifyChar(0x200b, true)).toBe('invisible');
    expect(classifyChar(0x3164, true)).toBe('invisible');
    expect(classifyChar(0x41, true)).toBeNull();
  });

  it('半角スペースは設定次第', () => {
    expect(classifyChar(0x20, true)).toBe('space');
    expect(classifyChar(0x20, false)).toBeNull();
  });
});

describe('visualizeWhitespace', () => {
  it('タブ・スペース・NBSP・全角スペースを記号にする', () => {
    const r = visualizeWhitespace('a b\tc d　e');
    expect(r.text).toBe('a·b→c°d□e');
    expect(r.total).toBe(4);
    expect(r.counts.space).toBe(1);
    expect(r.counts.tab).toBe(1);
    expect(r.counts.nbsp).toBe(1);
    expect(r.counts.wideSpace).toBe(1);
  });

  it('改行記号のあとに実際の改行を残す', () => {
    const r = visualizeWhitespace('a\nb\r\nc\rd', { showSpaces: false });
    expect(r.text).toBe('a↵\nb␍↵\nc␍\nd');
    expect(r.counts.newline).toBe(3);
    expect(r.findings.map((f) => f.code).sort()).toEqual([
      'CRLF',
      'U+000A',
      'U+000D',
    ]);
  });

  it('CRLFは1件と数える', () => {
    const r = visualizeWhitespace('\r\n\r\n', { showSpaces: false });
    expect(r.total).toBe(2);
    expect(r.findings).toEqual([
      { code: 'CRLF', category: 'newline', symbol: '␍↵', count: 2 },
    ]);
  });

  it('半角スペースを表示しない設定', () => {
    const r = visualizeWhitespace('a b', { showSpaces: false });
    expect(r.text).toBe('a b');
    expect(r.total).toBe(0);
  });

  it('制御文字と不可視文字', () => {
    const r = visualizeWhitespace('a\u0000b\u007fc\u0085d​e﻿');
    expect(r.text).toBe('a␀b␡c⟦0085⟧d⟦200B⟧e⟦FEFF⟧');
    expect(r.counts.control).toBe(3);
    expect(r.counts.invisible).toBe(2);
  });

  it('同じ文字の件数を集計する', () => {
    const r = visualizeWhitespace('\t\t\t');
    expect(r.findings).toEqual([
      { code: 'U+0009', category: 'tab', symbol: '→', count: 3 },
    ]);
  });

  it('絵文字などのサロゲートペアを壊さない', () => {
    const r = visualizeWhitespace('😀 😀');
    expect(r.text).toBe('😀·😀');
  });

  it('空文字列', () => {
    const r = visualizeWhitespace('');
    expect(r.total).toBe(0);
    expect(r.segments).toEqual([]);
    expect(r.findings).toEqual([]);
  });
});

describe('findTrailingWhitespaceLines', () => {
  it('行末の空白を持つ行を返す', () => {
    expect(findTrailingWhitespaceLines('a \nb\nc\t\r\nd　')).toEqual([1, 3, 4]);
  });

  it('なければ空配列', () => {
    expect(findTrailingWhitespaceLines('a\nb')).toEqual([]);
  });
});

describe('大量入力', () => {
  it('タブ1万個を件数どおり集計する', () => {
    const r = visualizeWhitespace('\t'.repeat(10_000));
    expect(r.total).toBe(10_000);
    expect(r.findings).toHaveLength(1);
    expect(r.findings[0].count).toBe(10_000);
  });

  it('CR のみの改行は CRLF と区別して数える', () => {
    const r = visualizeWhitespace('a\rb\r\nc', { showSpaces: false });
    expect(r.text).toBe('a␍\nb␍↵\nc');
    expect(r.total).toBe(2);
  });
});
