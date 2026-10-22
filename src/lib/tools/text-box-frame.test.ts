import { describe, expect, it } from 'vitest';
import {
  frameText,
  splitLines,
  type TextBoxFrameOptions,
} from './text-box-frame';

const base: TextBoxFrameOptions = {
  style: 'single',
  align: 'left',
  paddingX: 1,
  paddingY: 0,
  tail: false,
  comment: 'none',
};
const run = (input: string, o: Partial<TextBoxFrameOptions> = {}) =>
  frameText(input, { ...base, ...o });

describe('splitLines', () => {
  it('タブを展開し末尾の改行1つを無視する', () => {
    expect(splitLines('a\tb\r\nc\n')).toEqual(['a    b', 'c']);
    expect(splitLines('a\n\n')).toEqual(['a', '']);
  });
});

describe('frameText: 罫線', () => {
  it('単線で囲む', () => {
    expect(run('hello').output).toBe('┌───────┐\n│ hello │\n└───────┘');
  });

  it('ASCII・二重線・太線・角丸', () => {
    expect(run('a', { style: 'ascii' }).output).toBe('+---+\n| a |\n+---+');
    expect(run('a', { style: 'double' }).output).toBe('╔═══╗\n║ a ║\n╚═══╝');
    expect(run('a', { style: 'heavy' }).output).toBe('┏━━━┓\n┃ a ┃\n┗━━━┛');
    expect(run('a', { style: 'rounded' }).output).toBe('╭───╮\n│ a │\n╰───╯');
    expect(run('a', { style: 'hash' }).output).toBe('#####\n# a #\n#####');
    expect(run('a', { style: 'star' }).output).toBe('*****\n* a *\n*****');
  });

  it('全角は幅2で揃える', () => {
    const out = run('あい\nabc').output.split('\n');
    expect(out).toEqual(['┌──────┐', '│ あい │', '│ abc  │', '└──────┘']);
  });

  it('中央・右揃え', () => {
    expect(run('abcd\nab', { align: 'right' }).output).toContain('│   ab │');
    expect(run('abcd\nab', { align: 'center' }).output).toContain('│  ab  │');
  });

  it('余白を指定できる。範囲外や非数は丸める', () => {
    expect(run('a', { paddingX: 0 }).output).toBe('┌─┐\n│a│\n└─┘');
    expect(run('a', { paddingY: 1 }).output).toBe(
      '┌───┐\n│   │\n│ a │\n│   │\n└───┘',
    );
    expect(run('a', { paddingX: -3 }).output).toBe('┌─┐\n│a│\n└─┘');
    expect(run('a', { paddingX: NaN }).output).toBe('┌─┐\n│a│\n└─┘');
  });

  it('空行を含む複数行', () => {
    expect(run('a\n\nb').output.split('\n')).toHaveLength(5);
  });

  it('空入力は空の出力', () => {
    expect(run('')).toEqual({ output: '', lines: 0, width: 0 });
    expect(run('  \n ').output).toBe('');
  });
});

describe('frameText: 吹き出し', () => {
  it('1行は < > で囲む', () => {
    expect(run('hi', { style: 'speech' }).output).toBe(' ____\n< hi >\n ----');
  });

  it('複数行は / \\ | で囲む', () => {
    expect(run('ab\nc\nd', { style: 'speech' }).output).toBe(
      [' ____', '/ ab \\', '| c  |', '\\ d  /', ' ----'].join('\n'),
    );
  });

  it('しっぽを付けられる', () => {
    expect(run('hi', { style: 'speech', tail: true }).output).toBe(
      ' ____\n< hi >\n ----\n  \\\n   \\',
    );
  });

  it('考え込み吹き出し', () => {
    expect(run('hi', { style: 'thought', tail: true }).output).toBe(
      ' ____\n( hi )\n ----\n  o\n   O',
    );
  });

  it('全角でも幅が合う', () => {
    expect(run('こんにちは', { style: 'speech' }).output).toBe(
      ' ____________\n< こんにちは >\n ------------',
    );
  });
});

describe('frameText: コメント', () => {
  it('行コメントを付ける', () => {
    expect(run('a', { style: 'ascii', comment: 'slash' }).output).toBe(
      '// +---+\n// | a |\n// +---+',
    );
    expect(run('a', { style: 'ascii', comment: 'hash' }).output).toBe(
      '# +---+\n# | a |\n# +---+',
    );
    expect(run('a', { style: 'ascii', comment: 'dash' }).output).toBe(
      '-- +---+\n-- | a |\n-- +---+',
    );
  });

  it('空行は接頭辞だけにして末尾空白を残さない', () => {
    const out = run('a\n\nb', {
      style: 'speech',
      comment: 'hash',
    }).output.split('\n');
    expect(out.every((line) => line === line.trimEnd())).toBe(true);
  });

  it('ブロックコメントで囲み、*/ を壊さない', () => {
    expect(run('a*/b', { style: 'ascii', comment: 'block' }).output).toBe(
      '/*\n * +------+\n * | a* /b |\n * +------+\n */',
    );
  });
});

describe('frameText: 結果情報', () => {
  it('行数と幅を返す', () => {
    const r = run('あいう\nab');
    expect(r.width).toBe(6);
    expect(r.lines).toBe(4);
  });
});

describe('大量入力・境界', () => {
  it('長い1行（500文字）でも幅が揃う', () => {
    const r = run('a'.repeat(500));
    expect(r.width).toBe(500);
    expect(r.output.split('\n')[1]).toBe(`│ ${'a'.repeat(500)} │`);
  });

  it('CR のみの改行で行を分ける', () => {
    expect(splitLines('a\rb')).toEqual(['a', 'b']);
  });
});

describe('wideBorder（罫線を全角幅で扱う）', () => {
  it('罫線の繰り返し数を半分にして右端を揃える', () => {
    // 内側 = 幅4 + 余白2 = 6 → 罫線3個（各全角幅）
    expect(run('あい', { wideBorder: true }).output).toBe(
      '┌───┐\n│ あい │\n└───┘',
    );
  });

  it('内側が奇数幅なら右に空白を1つ足して偶数にする', () => {
    // 幅1 + 余白2 = 3 → 4 に補正、罫線2個
    expect(run('a', { wideBorder: true }).output).toBe('┌──┐\n│ a  │\n└──┘');
  });

  it('ASCII・吹き出しなど罫線文字を使わない枠は変わらない', () => {
    expect(run('a', { style: 'ascii', wideBorder: true }).output).toBe(
      run('a', { style: 'ascii' }).output,
    );
    expect(run('a', { style: 'speech', wideBorder: true }).output).toBe(
      run('a', { style: 'speech' }).output,
    );
  });
});

describe('wideBorder の対象スタイル', () => {
  it('太線は対象', () => {
    expect(run('あい', { style: 'heavy', wideBorder: true }).output).toBe(
      '┏━━━┓\n┃ あい ┃\n┗━━━┛',
    );
  });

  it('角丸は角が半角幅なので辺の罫線を1個増やす', () => {
    // 行は 2+6+2=10 桁、上辺は 1+2*4+1=10 桁
    expect(run('あい', { style: 'rounded', wideBorder: true }).output).toBe(
      '╭────╮\n│ あい │\n╰────╯',
    );
  });

  it('二重線は対象外', () => {
    expect(run('あい', { style: 'double', wideBorder: true }).output).toBe(
      run('あい', { style: 'double' }).output,
    );
  });
});
