import { describe, it, expect } from 'vitest';
import {
  formatCodePoint,
  getInvisibleGroup,
  invisibleGroups,
  removeInvisible,
  scanInvisible,
  visualizeInvisible,
} from './zero-width-char-remover';

const ZWSP = '\u200B';
const ZWJ = '\u200D';
const BOM = '\uFEFF';

describe('getInvisibleGroup', () => {
  it('グループを判定する', () => {
    expect(getInvisibleGroup(0x200b)).toBe('zeroWidth');
    expect(getInvisibleGroup(0x200d)).toBe('joiner');
    expect(getInvisibleGroup(0x202e)).toBe('direction');
    expect(getInvisibleGroup(0x00ad)).toBe('other');
    expect(getInvisibleGroup(0xe0041)).toBe('tag');
  });

  it('通常の文字・空白は対象外', () => {
    expect(getInvisibleGroup(0x41)).toBeNull();
    expect(getInvisibleGroup(0x20)).toBeNull();
    expect(getInvisibleGroup(0x3000)).toBeNull();
    expect(getInvisibleGroup(0xa0)).toBeNull();
  });
});

describe('scanInvisible', () => {
  it('コードポイントごとに件数を数える（昇順）', () => {
    const scan = scanInvisible(`a${ZWSP}b${ZWSP}${BOM}c${ZWJ}`);
    expect(scan.total).toBe(4);
    expect(scan.findings).toEqual([
      { code: 0x200b, group: 'zeroWidth', count: 2 },
      { code: 0x200d, group: 'joiner', count: 1 },
      { code: 0xfeff, group: 'zeroWidth', count: 1 },
    ]);
  });

  it('何もなければ空', () => {
    expect(scanInvisible('こんにちは abc')).toEqual({
      findings: [],
      total: 0,
    });
  });

  it('Unicodeタグ文字（サロゲートペア）も1文字として数える', () => {
    const tag = String.fromCodePoint(0xe0041);
    const scan = scanInvisible(`x${tag}${tag}`);
    expect(scan.total).toBe(2);
    expect(scan.findings[0]).toEqual({
      code: 0xe0041,
      group: 'tag',
      count: 2,
    });
  });
});

describe('removeInvisible', () => {
  it('指定グループだけ除去する', () => {
    const text = `a${ZWSP}b${ZWJ}c`;
    expect(removeInvisible(text, ['zeroWidth'])).toEqual({
      text: `ab${ZWJ}c`,
      removed: 1,
    });
  });

  it('全グループを指定すれば全部消える', () => {
    const text = `${BOM}a${ZWSP}b${ZWJ}c\u00AD`;
    expect(removeInvisible(text, invisibleGroups)).toEqual({
      text: 'abc',
      removed: 4,
    });
  });

  it('グループ未指定なら何も消さない', () => {
    expect(removeInvisible(`a${ZWSP}`, [])).toEqual({
      text: `a${ZWSP}`,
      removed: 0,
    });
  });

  it('通常の空白・改行・絵文字は残す', () => {
    const text = 'a b　c\nd 😀';
    expect(removeInvisible(text, invisibleGroups).text).toBe(text);
  });

  it('タグ文字（サロゲートペア）を壊さず除去する', () => {
    const tag = String.fromCodePoint(0xe0041);
    expect(removeInvisible(`a${tag}b`, ['tag']).text).toBe('ab');
  });
});

describe('visualizeInvisible', () => {
  it('対象文字を [U+XXXX] に置き換える', () => {
    expect(visualizeInvisible(`a${ZWSP}b${BOM}`)).toBe('a[U+200B]b[U+FEFF]');
  });

  it('formatCodePoint は大文字4桁以上', () => {
    expect(formatCodePoint(0xad)).toBe('U+00AD');
    expect(formatCodePoint(0xe0041)).toBe('U+E0041');
  });
});
