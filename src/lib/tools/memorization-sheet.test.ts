import { describe, it, expect } from 'vitest';
import {
  parseLine,
  parseSheet,
  extractAnswers,
  toggleMarker,
} from './memorization-sheet';

describe('parseLine', () => {
  it('囲んだ語を隠す対象にする', () => {
    expect(parseLine('日本の首都は**東京**です')).toEqual([
      { text: '日本の首都は', hidden: false },
      { text: '東京', hidden: true },
      { text: 'です', hidden: false },
    ]);
  });

  it('複数の語を扱う', () => {
    expect(parseLine('**a** and **b**')).toEqual([
      { text: 'a', hidden: true },
      { text: ' and ', hidden: false },
      { text: 'b', hidden: true },
    ]);
  });

  it('閉じていない ** は文字のまま', () => {
    expect(parseLine('a **b')).toEqual([{ text: 'a **b', hidden: false }]);
  });

  it('空の **** は文字のまま', () => {
    expect(parseLine('a****b')).toEqual([{ text: 'a****b', hidden: false }]);
  });

  it('空行は空配列', () => {
    expect(parseLine('')).toEqual([]);
  });

  it('HTMLの記号はそのまま文字列として保持する', () => {
    expect(parseLine('**<img src=x onerror=alert(1)>**')).toEqual([
      { text: '<img src=x onerror=alert(1)>', hidden: true },
    ]);
  });
});

describe('parseSheet / extractAnswers', () => {
  it('空入力は空', () => {
    expect(parseSheet('')).toEqual([]);
  });

  it('CRLF でも行分割できる', () => {
    expect(parseSheet('a\r\n**b**\rc')).toHaveLength(3);
  });

  it('答えを出現順に取り出す', () => {
    const lines = parseSheet('**一** と\n**二**、**三**');
    expect(extractAnswers(lines)).toEqual(['一', '二', '三']);
  });
});

describe('入力パターン', () => {
  it('サロゲートペアや結合絵文字を含む語もそのまま隠す', () => {
    expect(parseLine('**👨‍👩‍👧**')).toEqual([{ text: '👨‍👩‍👧', hidden: true }]);
  });

  it('多数の語でも答えを全て取り出せる', () => {
    const line = Array.from({ length: 5000 }, (_, i) => `**w${i}**`).join(' ');
    expect(extractAnswers(parseSheet(line))).toHaveLength(5000);
  });
});

describe('toggleMarker', () => {
  it('全体を選択しても囲める', () => {
    expect(toggleMarker('abc', 0, 3)).toEqual({
      text: '**abc**',
      start: 2,
      end: 5,
    });
  });

  it('選択範囲を囲む', () => {
    expect(toggleMarker('abc def', 4, 7)).toEqual({
      text: 'abc **def**',
      start: 6,
      end: 9,
    });
  });

  it('すでに囲まれていれば外す', () => {
    expect(toggleMarker('abc **def**', 6, 9)).toEqual({
      text: 'abc def',
      start: 4,
      end: 7,
    });
  });

  it('選択がなければ何もしない', () => {
    expect(toggleMarker('abc', 1, 1)).toEqual({
      text: 'abc',
      start: 1,
      end: 1,
    });
  });
});
