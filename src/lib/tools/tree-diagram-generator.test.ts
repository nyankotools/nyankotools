import { describe, expect, it } from 'vitest';
import {
  indentedTextToTree,
  parseIndentedTree,
  splitComment,
  treeToIndentedText,
  type TreeOptions,
} from './tree-diagram-generator';

const base: TreeOptions = {
  style: 'unicode',
  indent: 'auto',
  showRoot: true,
  maxDepth: 0,
  comments: true,
  commentMarker: '#',
};

function convert(input: string, over: Partial<TreeOptions> = {}) {
  const r = indentedTextToTree(input, { ...base, ...over });
  if (!r.success) throw new Error(`failed: ${r.reason}`);
  return r.output;
}

describe('indentedTextToTree', () => {
  it('2スペースのインデントをUnicodeツリーにする', () => {
    expect(convert('project/\n  src/\n    a.ts\n    b.ts\n  README.md')).toBe(
      [
        'project/',
        '├── src/',
        '│   ├── a.ts',
        '│   └── b.ts',
        '└── README.md',
      ].join('\n'),
    );
  });

  it('ASCIIスタイル', () => {
    expect(convert('r\n  a\n  b', { style: 'ascii' })).toBe('r\n|-- a\n`-- b');
  });

  it('4スペース・タブ・箇条書きに対応する', () => {
    const expected = 'r\n├── a\n│   └── x\n└── b';
    expect(convert('r\n    a\n        x\n    b')).toBe(expected);
    expect(convert('r\n\ta\n\t\tx\n\tb')).toBe(expected);
    expect(convert('- r\n  - a\n    - x\n  - b')).toBe(expected);
    expect(convert('r\n    a\n        x\n    b', { indent: '4' })).toBe(
      expected,
    );
  });

  it('ルートを非表示にできる（単一ルートのみ）', () => {
    expect(convert('r\n  a\n  b', { showRoot: false })).toBe('├── a\n└── b');
    expect(convert('r\ns\n  a', { showRoot: false })).toBe('r\ns\n└── a');
  });

  it('コメントを桁揃えし、全角幅を考慮する', () => {
    const out = convert('p\n  日本/ # 国\n  a.ts // ソース');
    const lines = out.split('\n');
    expect(lines[1]).toBe('├── 日本/  # 国');
    expect(lines[2]).toBe('└── a.ts   # ソース');
  });

  it('コメント記号を // にできる／コメント解析をオフにできる', () => {
    expect(convert('a\n  b # c', { commentMarker: '//' })).toBe(
      'a\n└── b  // c',
    );
    expect(convert('a\n  b # c', { comments: false })).toBe('a\n└── b # c');
  });

  it('深さで折りたたみ ... を表示する', () => {
    const text = 'r\n  a\n    x\n  b';
    expect(convert(text, { maxDepth: 1 })).toBe('r\n└── ...');
    expect(convert(text, { maxDepth: 2 })).toBe('r\n├── a\n│   └── ...\n└── b');
  });

  it('空入力は空文字、空行は無視する', () => {
    expect(convert('')).toBe('');
    expect(convert('a\n\n  b\n')).toBe('a\n└── b');
  });

  it('CRLFでも動く', () => {
    expect(convert('a\r\n  b')).toBe('a\n└── b');
  });
});

describe('エラー', () => {
  const err = (text: string, over: Partial<TreeOptions> = {}) =>
    indentedTextToTree(text, { ...base, ...over });

  it('階層の飛び', () => {
    expect(err('a\n    b\n  c')).toMatchObject({
      success: false,
      reason: 'skipped-level',
      line: 2,
    });
    expect(err('a\n  b\n      c', { indent: '2' })).toMatchObject({
      success: false,
      reason: 'skipped-level',
      line: 3,
    });
  });

  it('インデントが揃っていない', () => {
    expect(err('a\n  b\n   c')).toMatchObject({
      reason: 'inconsistent-indent',
      line: 3,
    });
  });

  it('最初の行がインデントされている', () => {
    expect(err('  a\nb')).toMatchObject({
      reason: 'bad-first-indent',
      line: 1,
    });
  });

  it('名前が空', () => {
    expect(err('a\n  # only comment')).toMatchObject({
      reason: 'empty-name',
      line: 2,
    });
  });

  it('タブ指定でスペースのインデントはエラー', () => {
    expect(err('a\n  b', { indent: 'tab' })).toMatchObject({
      reason: 'inconsistent-indent',
    });
  });
});

describe('splitComment / parseIndentedTree', () => {
  it('C# のような名前はコメントにしない', () => {
    expect(splitComment('C#', true)).toEqual({ name: 'C#', comment: '' });
    expect(splitComment('a.ts  #  note', true)).toEqual({
      name: 'a.ts',
      comment: 'note',
    });
  });

  it('ノード数を数える', () => {
    const r = parseIndentedTree('a\n  b\nc', {
      indent: 'auto',
      comments: true,
    });
    expect(r).toMatchObject({ success: true, nodes: 3 });
  });
});

describe('treeToIndentedText', () => {
  it('Unicodeツリーをインデントに戻す', () => {
    const tree =
      'project/\n├── src/\n│   ├── a.ts\n│   └── b.ts\n└── README.md';
    expect(
      treeToIndentedText(tree, { indent: '2', bullets: false }).output,
    ).toBe('project/\n  src/\n    a.ts\n    b.ts\n  README.md');
  });

  it('ASCIIツリー・タブ・箇条書き', () => {
    const tree = 'r\n|-- a\n|   `-- x\n`-- b';
    expect(
      treeToIndentedText(tree, { indent: 'tab', bullets: true }).output,
    ).toBe('- r\n\t- a\n\t\t- x\n\t- b');
  });

  it('往復で元に戻り、桁揃えの余白は詰める', () => {
    const src = 'p\n  日本/ # 国\n  a.ts # ソース';
    const tree = convert(src);
    expect(
      treeToIndentedText(tree, { indent: '2', bullets: false }).output,
    ).toBe('p\n  日本/ # 国\n  a.ts # ソース');
  });

  it('ルートが無いツリーは最小深さを0にそろえる', () => {
    expect(
      treeToIndentedText('├── a\n└── b', { indent: '2', bullets: false })
        .output,
    ).toBe('a\nb');
  });

  it('空入力', () => {
    expect(treeToIndentedText('', { indent: '2', bullets: false })).toEqual({
      output: '',
      lines: 0,
    });
  });
});
