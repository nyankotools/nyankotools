import { describe, expect, it } from 'vitest';
import {
  convertPagesToMarkdown,
  type ConvertOptions,
  type PdfPageInput,
  type PdfTextItem,
} from './pdf-to-markdown';

const OPTS: ConvertOptions = {
  removeHeaderFooter: true,
  detectTables: true,
  pageSeparator: false,
};

const W = 595;
const H = 842;

/** 1行分のテキスト片を作る（文字幅は size*0.5 の等幅とみなす） */
function text(
  str: string,
  x: number,
  y: number,
  size = 12,
  style: { bold?: boolean; italic?: boolean } = {},
): PdfTextItem {
  return {
    str,
    x,
    y,
    width: str.length * size * 0.5,
    fontSize: size,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
  };
}

const page = (items: PdfTextItem[]): PdfPageInput => ({
  width: W,
  height: H,
  items,
});

/** 本文の下地（本文サイズを12ptに確定させるための長文段落） */
function bodyLines(startY: number, count: number, x = 72): PdfTextItem[] {
  return Array.from({ length: count }, (_, i) =>
    text(
      'This is an ordinary body line of running text for the document',
      x,
      startY - i * 18,
    ),
  );
}

const convert = (pages: PdfPageInput[], opts = OPTS) =>
  convertPagesToMarkdown(pages, opts);

describe('見出し', () => {
  it('本文より大きい文字を見出しにし、大きさ順にレベルを振る', () => {
    const r = convert([
      page([
        text('Document Title', 72, 750, 24),
        text('Section One', 72, 700, 18),
        ...bodyLines(670, 3),
      ]),
    ]);
    expect(r.markdown).toContain('# Document Title');
    expect(r.markdown).toContain('## Section One');
  });

  it('本文サイズだけの文書には見出しを作らない', () => {
    const r = convert([page(bodyLines(750, 3))]);
    expect(r.markdown).not.toMatch(/^#/m);
  });

  it('太字だけの短い1行は小見出しにする', () => {
    const r = convert([
      page([
        text('Overview', 72, 750, 12, { bold: true }),
        ...bodyLines(730, 4),
      ]),
    ]);
    expect(r.markdown).toMatch(/^## Overview$/m);
  });

  it('折り返された同サイズの見出しは1つにまとめる', () => {
    const r = convert([
      page([
        text('A very long title that', 72, 750, 24),
        text('wraps onto two lines', 72, 720, 24),
        ...bodyLines(660, 3),
      ]),
    ]);
    expect(r.markdown).toContain(
      '# A very long title that wraps onto two lines',
    );
  });
});

describe('段落', () => {
  it('行間が広がったら段落を分ける', () => {
    const r = convert([
      page([
        text('First paragraph line one', 72, 750),
        text('first paragraph line two.', 72, 732),
        text('Second paragraph starts here', 72, 700),
      ]),
    ]);
    const paras = r.markdown.trim().split('\n\n');
    expect(paras).toEqual([
      'First paragraph line one first paragraph line two.',
      'Second paragraph starts here',
    ]);
  });

  it('日本語の折り返しはスペースなしで連結する', () => {
    const r = convert([
      page([
        text('これは日本語の文章で、行の途中で', 72, 750),
        text('折り返されています。', 72, 732),
      ]),
    ]);
    expect(r.markdown.trim()).toBe(
      'これは日本語の文章で、行の途中で折り返されています。',
    );
  });

  it('英語のハイフネーション折り返しを結合する', () => {
    const r = convert([
      page([text('an inter-', 72, 750), text('national standard', 72, 732)]),
    ]);
    expect(r.markdown.trim()).toBe('an international standard');
  });

  it('同じ行の離れたテキスト片の間にスペースを入れる', () => {
    const r = convert([
      page([text('Hello', 72, 750), text('World', 72 + 5 * 6 + 4, 750)]),
    ]);
    expect(r.markdown.trim()).toBe('Hello World');
  });

  it('行頭の # や > は記法にならないよう退避する', () => {
    const r = convert([page([text('# not a heading', 72, 750)])]);
    expect(r.markdown.trim()).toBe('\\# not a heading');
  });

  it('*・バッククォート・< をエスケープする', () => {
    const r = convert([page([text('a*b `c` <d>', 72, 750)])]);
    expect(r.markdown.trim()).toBe('a\\*b \\`c\\` \\<d>');
  });
});

describe('インライン装飾', () => {
  it('太字・斜体の部分だけを ** / * で囲む', () => {
    const r = convert([
      page([
        text('plain ', 72, 750),
        text('strong', 72 + 6 * 6, 750, 12, { bold: true }),
        text(' and ', 72 + 12 * 6, 750),
        text('slanted', 72 + 17 * 6, 750, 12, { italic: true }),
      ]),
    ]);
    expect(r.markdown.trim()).toBe('plain **strong** and *slanted*');
  });

  it('段落全体が太字なら段落単位で1回だけ囲む', () => {
    const r = convert([
      page([
        text('This whole paragraph is bold and continues', 72, 750, 12, {
          bold: true,
        }),
        text('onto a second line, which is also bold.', 72, 732, 12, {
          bold: true,
        }),
      ]),
    ]);
    expect(r.markdown.trim()).toBe(
      '**This whole paragraph is bold and continues onto a second line, which is also bold.**',
    );
  });
});

describe('箇条書き', () => {
  it('・や数字の記号をリストにする', () => {
    const r = convert([
      page([
        text('・りんご', 72, 750),
        text('・みかん', 72, 732),
        text('1. first', 72, 700),
        text('2. second', 72, 682),
      ]),
    ]);
    expect(r.markdown.trim()).toBe(
      ['- りんご', '- みかん', '1. first', '2. second'].join('\n'),
    );
  });

  it('記号だけが別の塊になっている箇条書きも1項目にする', () => {
    const r = convert([
      page([
        text('•', 72, 750),
        text('Item text', 100, 750),
        text('•', 72, 732),
        text('Another item', 100, 732),
      ]),
    ]);
    expect(r.markdown.trim()).toBe('- Item text\n- Another item');
  });

  it('インデントの深い項目はネストする', () => {
    const r = convert([
      page([
        text('- parent', 72, 750),
        text('- child', 100, 732),
        text('- sibling', 72, 714),
      ]),
    ]);
    expect(r.markdown.trim()).toBe('- parent\n    - child\n- sibling');
  });

  it('ぶら下げインデントの折り返し行を項目に連結する', () => {
    const r = convert([
      page([
        text('- a long item that wraps', 72, 750),
        text('onto the next line', 84, 732),
        text('- next item', 72, 714),
      ]),
    ]);
    expect(r.markdown.trim()).toBe(
      '- a long item that wraps onto the next line\n- next item',
    );
  });
});

describe('表', () => {
  const tableItems = [
    text('Name', 72, 700),
    text('Qty', 250, 700),
    text('Price', 400, 700),
    text('Apple', 72, 680),
    text('3', 250, 680),
    text('120', 400, 680),
    text('Melon', 72, 660),
    text('1', 250, 660),
    text('800', 400, 660),
  ];

  it('桁の揃った行を GFM の表にする', () => {
    const r = convert([page([text('Intro line', 72, 750), ...tableItems])]);
    expect(r.tableCount).toBe(1);
    expect(r.markdown).toBe(
      [
        'Intro line',
        '',
        '| Name | Qty | Price |',
        '| --- | --- | --- |',
        '| Apple | 3 | 120 |',
        '| Melon | 1 | 800 |',
        '',
      ].join('\n'),
    );
  });

  it('列間が幅つきの空白片で埋められていても表になる（pdf.js の出力形式）', () => {
    const gap = (x: number, y: number, to: number) =>
      text(' '.repeat(3), x, y, 12, {}) && {
        ...text(' ', x, y),
        width: to - x,
      };
    const r = convert([
      page([
        text('Name', 72, 700),
        gap(94, 700, 250),
        text('Qty', 250, 700),
        text('Apple', 72, 680),
        gap(102, 680, 250),
        text('3', 250, 680),
      ]),
    ]);
    expect(r.tableCount).toBe(1);
    expect(r.markdown).toContain('| Apple | 3 |');
  });

  it('空欄のあるセルを保つ', () => {
    const r = convert([
      page([
        text('A', 72, 700),
        text('B', 250, 700),
        text('C', 400, 700),
        text('x', 72, 680),
        text('z', 400, 680),
        text('p', 72, 660),
        text('q', 250, 660),
        text('r', 400, 660),
      ]),
    ]);
    expect(r.markdown).toContain('| x |  | z |');
  });

  it('セル内の | をエスケープする', () => {
    const r = convert([
      page([
        text('A', 72, 700),
        text('B', 250, 700),
        text('a|b', 72, 680),
        text('c', 250, 680),
      ]),
    ]);
    expect(r.markdown).toContain('| a\\|b | c |');
  });

  it('detectTables を切ると表にしない', () => {
    const r = convert([page(tableItems)], { ...OPTS, detectTables: false });
    expect(r.tableCount).toBe(0);
    expect(r.markdown).not.toContain('|');
  });

  it('複数行に1つも列の揃いがなければ表にしない', () => {
    const r = convert([page([text('only one line', 72, 700)])]);
    expect(r.tableCount).toBe(0);
  });
});

describe('ヘッダー・フッター', () => {
  const pages = [1, 2, 3].map((n) =>
    page([
      text('Company Report', 72, 810),
      ...bodyLines(700, 2),
      text(String(n), 290, 30),
    ]),
  );

  it('全ページで繰り返す行とページ番号を除去する', () => {
    const r = convert(pages);
    expect(r.markdown).not.toContain('Company Report');
    expect(r.markdown).not.toMatch(/^\d$/m);
    expect(r.markdown).toContain('ordinary body line');
  });

  it('removeHeaderFooter を切ると残す', () => {
    const r = convert(pages, { ...OPTS, removeHeaderFooter: false });
    expect(r.markdown).toContain('Company Report');
  });

  it('1ページだけの文書でもページ番号は除去する', () => {
    const r = convert([page([text('Body', 72, 700), text('- 1 -', 280, 30)])]);
    expect(r.markdown.trim()).toBe('Body');
  });
});

describe('段組み', () => {
  it('2段組みは左の段を読み切ってから右の段を読む', () => {
    const left = Array.from({ length: 6 }, (_, i) =>
      text(`left column text line number ${i}`, 50, 750 - i * 15),
    );
    const right = Array.from({ length: 6 }, (_, i) =>
      text(`right column text line number ${i}`, 320, 750 - i * 15),
    );
    const r = convert([page([...left, ...right])]);
    const md = r.markdown;
    expect(md.indexOf('left column text line number 5')).toBeLessThan(
      md.indexOf('right column text line number 0'),
    );
    expect(r.tableCount).toBe(0);
  });
});

describe('ページ', () => {
  it('pageSeparator で水平線を入れる', () => {
    const r = convert(
      [page([text('One.', 72, 700)]), page([text('Two.', 72, 700)])],
      { ...OPTS, pageSeparator: true },
    );
    expect(r.markdown).toBe('One.\n\n---\n\nTwo.\n');
  });

  it('ページをまたぐ文は結合する', () => {
    const r = convert([
      page([text('the sentence that continues', 72, 100)]),
      page([text('on the next page.', 72, 780)]),
    ]);
    expect(r.markdown.trim()).toBe(
      'the sentence that continues on the next page.',
    );
  });

  it('テキストのないページを emptyPages に報告する', () => {
    const r = convert([page([text('Body', 72, 700)]), page([])]);
    expect(r.emptyPages).toEqual([2]);
    expect(r.pageCount).toBe(2);
  });

  it('全ページがテキストなしなら空のMarkdownを返す', () => {
    const r = convert([page([]), page([])]);
    expect(r.markdown).toBe('');
    expect(r.emptyPages).toEqual([1, 2]);
    expect(r.charCount).toBe(0);
  });

  it('空白だけのテキスト片は無視する', () => {
    const r = convert([page([text('   ', 72, 700), text('Body', 72, 680)])]);
    expect(r.markdown.trim()).toBe('Body');
  });
});

describe('レビュー指摘の回帰', () => {
  it('3ページ以上にまたがる段落を結合する（途中のページが1段落だけでも）', () => {
    const r = convert([
      page([text('the sentence starts here and', 72, 100)]),
      page([text('keeps going through the middle page and', 72, 780)]),
      page([text('finally ends here.', 72, 780)]),
    ]);
    expect(r.markdown.trim()).toBe(
      'the sentence starts here and keeps going through the middle page and finally ends here.',
    );
  });

  it('表の中の「-」だけのセルを保つ', () => {
    const r = convert([
      page([
        text('Name', 72, 700),
        text('Note', 250, 700),
        text('Price', 400, 700),
        text('Apple', 72, 680),
        text('-', 250, 680),
        text('120', 400, 680),
      ]),
    ]);
    expect(r.markdown).toContain('| Apple | - | 120 |');
  });

  it('_ で囲まれた語や [text](url) を記法として解釈させない', () => {
    const r = convert([page([text('_foo_ and [a](b) ~~x~~', 72, 700)])]);
    expect(r.markdown.trim()).toBe(String.raw`\_foo\_ and [a\](b) \~\~x\~\~`);
  });

  it('年号のような4桁の数字だけの行はページ番号として消さない', () => {
    const r = convert([page([text('Body', 72, 700), text('2025', 280, 30)])]);
    expect(r.markdown).toContain('2025');
  });
});
