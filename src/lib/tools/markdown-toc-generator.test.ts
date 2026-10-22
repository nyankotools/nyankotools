import { describe, expect, it } from 'vitest';
import {
  defaultTocOptions,
  extractHeadings,
  generateToc,
  slugifyHeading,
  stripInlineMarkdown,
} from './markdown-toc-generator';

const opts = (o: Partial<typeof defaultTocOptions> = {}) => ({
  ...defaultTocOptions,
  ...o,
});

describe('stripInlineMarkdown', () => {
  it('リンク・コード・強調を除去する', () => {
    expect(stripInlineMarkdown('[Docs](http://a.b) と `code`')).toBe(
      'Docs と code',
    );
    expect(stripInlineMarkdown('**Bold** and *it* and ~~del~~')).toBe(
      'Bold and it and del',
    );
    expect(stripInlineMarkdown('![alt](x.png) pic')).toBe('alt pic');
  });
  it('snake_case のアンダースコアは残す', () => {
    expect(stripInlineMarkdown('snake_case_name')).toBe('snake_case_name');
    expect(stripInlineMarkdown('_em_ text')).toBe('em text');
  });
});

describe('slugifyHeading', () => {
  it('GitHub形式にする', () => {
    expect(slugifyHeading('Hello, World!')).toBe('hello-world');
    expect(slugifyHeading('A & B')).toBe('a--b');
    expect(slugifyHeading('使い方 (Usage)')).toBe('使い方-usage');
    expect(slugifyHeading('snake_case')).toBe('snake_case');
  });
});

describe('extractHeadings', () => {
  it('ATX見出しを抽出し閉じ#を除く', () => {
    const h = extractHeadings('# A\n\n## B ##\n###### C\n####### no');
    expect(h.map((x) => [x.level, x.text])).toEqual([
      [1, 'A'],
      [2, 'B'],
      [6, 'C'],
    ]);
  });
  it('コードブロック内の # は無視する', () => {
    const md = '# A\n```sh\n# comment\n```\n~~~\n## x\n~~~\n## B';
    expect(extractHeadings(md).map((x) => x.text)).toEqual(['A', 'B']);
  });
  it('長いフェンスは短いフェンスでは閉じない', () => {
    const md = '````\n```\n# in\n````\n# out';
    expect(extractHeadings(md).map((x) => x.text)).toEqual(['out']);
  });
  it('Setext見出しを扱う', () => {
    const md = 'Title\n=====\n\nSub *x*\n---\n\n---\n\ntext';
    const h = extractHeadings(md);
    expect(h.map((x) => [x.level, x.text, x.line])).toEqual([
      [1, 'Title', 1],
      [2, 'Sub x', 4],
    ]);
  });
  it('フロントマターを除外する', () => {
    const md = '---\ntitle: x\n# not\n---\n# Real';
    expect(extractHeadings(md).map((x) => x.text)).toEqual(['Real']);
  });
  it('# の後にスペースがない行や4スペースインデントは見出しにしない', () => {
    expect(extractHeadings('#tag\n    # code')).toEqual([]);
  });
  it('重複見出しに連番を付ける', () => {
    const h = extractHeadings('# A\n## Dup\n## Dup\n## Dup\n## Dup-1');
    expect(h.map((x) => x.anchor)).toEqual([
      'a',
      'dup',
      'dup-1',
      'dup-2',
      'dup-1-1',
    ]);
  });
  it('日本語見出しのアンカー', () => {
    expect(extractHeadings('# はじめに')[0].anchor).toBe('はじめに');
  });
  it('CRLFと空見出し', () => {
    expect(extractHeadings('# A\r\n#\r\n## B').map((x) => x.text)).toEqual([
      'A',
      'B',
    ]);
  });
});

describe('generateToc', () => {
  const md = '# A\n## B\n### C\n#### D\n## E\n# F';

  it('深さ指定とネストの箇条書き', () => {
    expect(generateToc(md, opts({ maxLevel: 2 })).markdown).toBe(
      ['- [A](#a)', '  - [B](#b)', '  - [E](#e)', '- [F](#f)'].join('\n'),
    );
  });
  it('番号付きは兄弟ごとに連番、インデント3以上', () => {
    expect(
      generateToc(md, opts({ style: 'number', maxLevel: 2 })).markdown,
    ).toBe(
      ['1. [A](#a)', '   1. [B](#b)', '   2. [E](#e)', '2. [F](#f)'].join('\n'),
    );
  });
  it('最小レベル指定で先頭を基準にする', () => {
    const r = generateToc(md, opts({ minLevel: 2, maxLevel: 3 }));
    expect(r.markdown).toBe(
      ['- [B](#b)', '  - [C](#c)', '- [E](#e)'].join('\n'),
    );
    expect(r.included).toBe(3);
  });
  it('レベルが飛んでも1段だけ深くする', () => {
    expect(generateToc('# A\n### C', opts()).markdown).toBe(
      '- [A](#a)\n  - [C](#c)',
    );
  });
  it('リンクなし・インデント4・括弧のエスケープ', () => {
    expect(
      generateToc('# A\n## B', opts({ links: false, indent: 4 })).markdown,
    ).toBe('- A\n    - B');
    expect(generateToc('# a [b] c', opts()).markdown).toBe(
      '- [a \\[b\\] c](#a-b-c)',
    );
  });
  it('範囲外の見出しがあっても重複連番は文書全体で決まる', () => {
    const r = generateToc('# X\n#### X\n# X', opts({ maxLevel: 1 }));
    expect(r.markdown).toBe('- [X](#x)\n- [X](#x-2)');
  });
  it('見出しなしは空文字', () => {
    expect(generateToc('just text').markdown).toBe('');
  });
  it('minLevel > maxLevel でも入れ替えて扱う', () => {
    expect(generateToc(md, opts({ minLevel: 3, maxLevel: 2 })).included).toBe(
      3,
    );
  });
});

describe('エッジケース', () => {
  it('空文字は見出しなし・目次も空', () => {
    const r = generateToc('');
    expect(r.included).toBe(0);
    expect(r.markdown).toBe('');
  });

  it('絵文字を含む見出しのアンカーは GitHub 同様に絵文字を除く', () => {
    expect(extractHeadings('# 😀 Hello 日本語')[0].anchor).toBe(
      '-hello-日本語',
    );
  });

  it('2000見出しでも全件を処理し、同名見出しに連番を付ける', () => {
    const md = Array.from({ length: 2000 }, (_, i) => `## H${i % 50}`).join(
      '\n',
    );
    const r = generateToc(md);
    expect(r.included).toBe(2000);
    const h0 = r.headings.filter((h) => h.text === 'H0').map((h) => h.anchor);
    expect(h0.length).toBe(40);
    expect(h0[h0.length - 1]).toBe('h0-39');
  });
});
