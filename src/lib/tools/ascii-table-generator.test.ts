import { describe, expect, it } from 'vitest';
import {
  csvToAsciiTable,
  displayWidth,
  detectDelimiter,
  type AsciiTableOptions,
} from './ascii-table-generator';

const base: AsciiTableOptions = {
  delimiter: 'auto',
  style: 'ascii',
  align: 'left',
  header: true,
  rowSeparators: false,
};

function run(input: string, options: Partial<AsciiTableOptions> = {}) {
  const result = csvToAsciiTable(input, { ...base, ...options });
  if (!result.success) throw new Error('failed');
  return result;
}

describe('displayWidth', () => {
  it('全角は2、半角は1、結合文字は0', () => {
    expect(displayWidth('abc')).toBe(3);
    expect(displayWidth('あい')).toBe(4);
    expect(displayWidth('é')).toBe(1);
    expect(displayWidth('')).toBe(0);
  });
});

describe('detectDelimiter', () => {
  it('タブがあればタブ', () => {
    expect(detectDelimiter('a\tb')).toBe('\t');
    expect(detectDelimiter('a,b')).toBe(',');
  });
});

describe('csvToAsciiTable', () => {
  it('ASCII罫線で見出し区切り付きの表を作る', () => {
    expect(run('a,bb\n1,2').output).toBe(
      [
        '+---+----+',
        '| a | bb |',
        '+---+----+',
        '| 1 | 2  |',
        '+---+----+',
      ].join('\n'),
    );
  });

  it('見出しなしなら区切り線を引かない', () => {
    expect(run('a,b\n1,2', { header: false }).output).toBe(
      ['+---+---+', '| a | b |', '| 1 | 2 |', '+---+---+'].join('\n'),
    );
  });

  it('全行に区切り線を引ける', () => {
    const lines = run('a\n1\n2', {
      header: false,
      rowSeparators: true,
    }).output.split('\n');
    expect(lines).toHaveLength(7);
    expect(lines[2]).toBe('+---+');
  });

  it('全角を幅2として揃える', () => {
    const lines = run('名前,x\nab,y').output.split('\n');
    expect(lines[1]).toBe('| 名前 | x |');
    expect(lines[3]).toBe('| ab   | y |');
  });

  it('Unicode罫線（単線・角丸・二重線）', () => {
    expect(run('a', { style: 'single' }).output).toBe('┌───┐\n│ a │\n└───┘');
    expect(run('a', { style: 'rounded' }).output).toBe('╭───╮\n│ a │\n╰───╯');
    expect(run('a', { style: 'double' }).output).toBe('╔═══╗\n║ a ║\n╚═══╝');
  });

  it('Unicode罫線の交点', () => {
    expect(run('a,b\n1,2', { style: 'single' }).output.split('\n')[2]).toBe(
      '├───┼───┤',
    );
  });

  it('右揃え・中央揃え', () => {
    expect(run('abcd\nx', { align: 'right', header: false }).output).toContain(
      '|    x |',
    );
    expect(run('abcd\nx', { align: 'center', header: false }).output).toContain(
      '|  x   |',
    );
  });

  it('列数が足りない行は空セルで補う', () => {
    const result = run('a,b,c\n1');
    expect(result.columns).toBe(3);
    expect(result.output).toContain('| 1 |   |   |');
  });

  it('セル内改行は複数行で表示する', () => {
    const result = run('"a\nb",c\n1,2', { header: false });
    expect(result.output.split('\n')).toEqual([
      '+---+---+',
      '| a | c |',
      '| b |   |',
      '| 1 | 2 |',
      '+---+---+',
    ]);
  });

  it('空セルだけの列でも罫線が崩れない', () => {
    expect(run('a,\n1,').output.split('\n')[0]).toBe('+---+--+');
  });

  it('空入力は空文字、空行は無視', () => {
    expect(run('').output).toBe('');
    expect(run('a\n\n1', { header: false }).rows).toBe(2);
  });

  it('TSVを自動判定する', () => {
    expect(run('a\tb').columns).toBe(2);
  });

  it('閉じていない引用符はエラー', () => {
    const result = csvToAsciiTable('a,"b', base);
    expect(result).toEqual({ success: false, reason: 'unterminated-quote' });
  });

  it('CRLF入力はLF入力と同じ表になる', () => {
    expect(run('a,b\r\n1,2').output).toBe(run('a,b\n1,2').output);
  });

  it('絵文字（幅2）を含む列も揃える', () => {
    const lines = run('👍,x\nab,y').output.split('\n');
    expect(lines[1]).toBe('| 👍 | x |');
    expect(lines[3]).toBe('| ab | y |');
  });

  it('多行の入力でも表の行数が一致する', () => {
    const input = Array.from({ length: 2000 }, (_, i) => `${i},name${i}`).join(
      '\n',
    );
    const result = run(input);
    expect(result.rows).toBe(2000);
    expect(result.output.split('\n')).toHaveLength(2000 + 3);
  });
});
