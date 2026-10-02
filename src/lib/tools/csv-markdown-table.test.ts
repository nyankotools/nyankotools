import { describe, it, expect } from 'vitest';
import {
  csvToMarkdownTable,
  detectDelimiter,
  displayWidth,
  escapeCell,
  type MarkdownTableOptions,
} from './csv-markdown-table';

const base: MarkdownTableOptions = {
  delimiter: ',',
  header: true,
  align: 'none',
  pad: false,
};

function convert(input: string, options: Partial<MarkdownTableOptions> = {}) {
  const r = csvToMarkdownTable(input, { ...base, ...options });
  if (!r.success) throw new Error(r.reason);
  return r;
}

describe('csvToMarkdownTable', () => {
  it('基本のCSVをMarkdownテーブルにする', () => {
    const r = convert('name,age\nAlice,30\nBob,25');
    expect(r.output).toBe(
      '| name | age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |',
    );
    expect(r.rows).toBe(2);
    expect(r.columns).toBe(2);
  });

  it('TSVと自動判定を扱う', () => {
    expect(convert('a\tb\n1\t2', { delimiter: '\t' }).output).toBe(
      '| a | b |\n| --- | --- |\n| 1 | 2 |',
    );
    expect(convert('a\tb\n1\t2', { delimiter: 'auto' }).columns).toBe(2);
    expect(detectDelimiter('a,b\tc')).toBe('\t');
    expect(detectDelimiter('a,b')).toBe(',');
  });

  it('引用符つきの値・パイプ・改行をエスケープする', () => {
    const r = convert('a,b\n"x|y","l1\nl2"');
    expect(r.output).toBe('| a | b |\n| --- | --- |\n| x\\|y | l1<br>l2 |');
  });

  it('列数が足りない行は空セルで補う', () => {
    expect(convert('a,b,c\n1').output).toBe(
      '| a | b | c |\n| --- | --- | --- |\n| 1 |  |  |',
    );
  });

  it('見出しなしなら空の見出し行を補う', () => {
    expect(convert('1,2', { header: false }).output).toBe(
      '|  |  |\n| --- | --- |\n| 1 | 2 |',
    );
  });

  it('配置指定を区切り行に反映する', () => {
    expect(convert('a,b\n1,2', { align: 'left' }).output).toContain(
      '| :-- | :-- |',
    );
    expect(convert('a,b\n1,2', { align: 'center' }).output).toContain(
      '| :-: | :-: |',
    );
    expect(convert('a,b\n1,2', { align: 'right' }).output).toContain(
      '| --: | --: |',
    );
  });

  it('列幅をそろえる（全角は幅2）', () => {
    const r = convert('名前,n\nあ,long', { pad: true, align: 'right' });
    expect(r.output).toBe('| 名前 |    n |\n| ---: | ---: |\n|   あ | long |');
    const c = convert('a,b\nxxxx,y', { pad: true, align: 'center' });
    expect(c.output.split('\n')[1]).toBe('| :--: | :-: |');
  });

  it('空入力と空行を扱う', () => {
    expect(convert('').output).toBe('');
    expect(convert('\n\n').rows).toBe(0);
    expect(convert('a,b\n\n1,2').rows).toBe(1);
  });

  it('閉じていない引用符はエラーにする', () => {
    expect(csvToMarkdownTable('a,"b', base)).toEqual({
      success: false,
      reason: 'unterminated-quote',
    });
  });
});

describe('helpers', () => {
  it('escapeCell', () => {
    expect(escapeCell('a|b')).toBe('a\\|b');
    expect(escapeCell('a\\|b')).toBe('a\\\\\\|b');
    expect(escapeCell('a\r\nb')).toBe('a<br>b');
  });

  it('displayWidth', () => {
    expect(displayWidth('abc')).toBe(3);
    expect(displayWidth('日本語')).toBe(6);
    expect(displayWidth('ｱ')).toBe(1);
    expect(displayWidth('Ａ')).toBe(2);
  });
});
