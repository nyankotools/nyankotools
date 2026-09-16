import { describe, expect, it } from 'vitest';
import { clampLoremCount, generateLoremIpsum } from './lorem-ipsum';

describe('clampLoremCount', () => {
  it('1未満は1に切り上げる', () => {
    expect(clampLoremCount(0)).toBe(1);
    expect(clampLoremCount(-5)).toBe(1);
  });

  it('200超は200に切り下げる', () => {
    expect(clampLoremCount(1000)).toBe(200);
  });

  it('小数は切り捨てる', () => {
    expect(clampLoremCount(3.7)).toBe(3);
  });

  it('不正な値はデフォルト値にフォールバックする', () => {
    expect(clampLoremCount(NaN)).toBe(3);
  });
});

describe('generateLoremIpsum (latin)', () => {
  it('指定した個数の段落を改行2つで区切って生成する', () => {
    const text = generateLoremIpsum({
      language: 'latin',
      unit: 'paragraphs',
      count: 4,
      fixedOpening: false,
    });
    expect(text.split('\n\n')).toHaveLength(4);
  });

  it('指定した個数の単語をスペース区切りで生成する', () => {
    const text = generateLoremIpsum({
      language: 'latin',
      unit: 'words',
      count: 10,
      fixedOpening: false,
    });
    expect(text.replace(/\.$/, '').split(' ')).toHaveLength(10);
  });

  it('文の先頭は大文字、末尾はピリオドになる', () => {
    const text = generateLoremIpsum({
      language: 'latin',
      unit: 'sentences',
      count: 1,
      fixedOpening: false,
    });
    expect(text).toMatch(/^[A-Z].*\.$/);
  });

  it('fixedOpening指定時は定番の書き出し文から始まる', () => {
    const text = generateLoremIpsum({
      language: 'latin',
      unit: 'paragraphs',
      count: 1,
      fixedOpening: true,
    });
    expect(
      text.startsWith(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      ),
    ).toBe(true);
  });

  it('fixedOpening指定時、単語数指定でも先頭が固定文の単語になる', () => {
    const text = generateLoremIpsum({
      language: 'latin',
      unit: 'words',
      count: 20,
      fixedOpening: true,
    });
    expect(
      text.startsWith(
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
      ),
    ).toBe(true);
  });

  it('生成のたびに異なる結果になる（極めて低い確率でしか一致しない）', () => {
    const a = generateLoremIpsum({
      language: 'latin',
      unit: 'paragraphs',
      count: 3,
      fixedOpening: false,
    });
    const b = generateLoremIpsum({
      language: 'latin',
      unit: 'paragraphs',
      count: 3,
      fixedOpening: false,
    });
    expect(a).not.toBe(b);
  });

  it('個数指定が範囲外でもクランプされる', () => {
    const text = generateLoremIpsum({
      language: 'latin',
      unit: 'words',
      count: 0,
      fixedOpening: false,
    });
    expect(text.replace(/\.$/, '').split(' ')).toHaveLength(1);
  });
});

describe('generateLoremIpsum (ja)', () => {
  it('指定した個数の段落を改行2つで区切って生成する', () => {
    const text = generateLoremIpsum({
      language: 'ja',
      unit: 'paragraphs',
      count: 3,
      fixedOpening: false,
    });
    expect(text.split('\n\n')).toHaveLength(3);
  });

  it('句点で終わる文が指定した個数連結される', () => {
    const text = generateLoremIpsum({
      language: 'ja',
      unit: 'sentences',
      count: 5,
      fixedOpening: false,
    });
    expect(text.match(/。/g)).toHaveLength(5);
  });

  it('fixedOpening指定時は「これはダミーテキストです。」から始まる', () => {
    const text = generateLoremIpsum({
      language: 'ja',
      unit: 'sentences',
      count: 3,
      fixedOpening: true,
    });
    expect(text.startsWith('この文章はダミーテキストです。')).toBe(true);
  });
});
