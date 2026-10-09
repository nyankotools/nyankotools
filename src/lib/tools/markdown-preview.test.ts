import { describe, expect, it } from 'vitest';
import {
  defaultOptions,
  htmlToMarkdown,
  markdownToHtml,
  type HtmlToMarkdownOptions,
} from './markdown-preview';

function expectHtml(input: string): string {
  const result = markdownToHtml(input);
  expect(result.success).toBe(true);
  return result.success ? result.output : '';
}

describe('markdownToHtml', () => {
  it('見出しをh1〜h3タグに変換する', () => {
    const html = expectHtml('# 見出し1\n## 見出し2\n### 見出し3');
    expect(html).toContain('<h1>見出し1</h1>');
    expect(html).toContain('<h2>見出し2</h2>');
    expect(html).toContain('<h3>見出し3</h3>');
  });

  it('太字・斜体を変換する', () => {
    const html = expectHtml('**太字** と *斜体*');
    expect(html).toContain('<strong>太字</strong>');
    expect(html).toContain('<em>斜体</em>');
  });

  it('リンクと画像を変換する', () => {
    const html = expectHtml(
      '[にゃんこ](https://example.com) ![alt](https://example.com/cat.png)',
    );
    expect(html).toContain('<a href="https://example.com">にゃんこ</a>');
    expect(html).toContain('<img src="https://example.com/cat.png" alt="alt">');
  });

  it('箇条書き・番号付きリストを変換する', () => {
    const html = expectHtml('- りんご\n- みかん');
    expect(html).toContain('<ul>');
    expect(html).toContain('<li>りんご</li>');

    const orderedHtml = expectHtml('1. 一番目\n2. 二番目');
    expect(orderedHtml).toContain('<ol>');
    expect(orderedHtml).toContain('<li>一番目</li>');
  });

  it('コードブロックとインラインコードを変換する', () => {
    const html = expectHtml('```js\nconst x = 1;\n```\n\n`inline`');
    expect(html).toContain('<pre><code');
    expect(html).toContain('const x = 1;');
    expect(html).toContain('<code>inline</code>');
  });

  it('引用と水平線を変換する', () => {
    const html = expectHtml('> 引用文\n\n---');
    expect(html).toContain('<blockquote>');
    expect(html).toContain('<hr>');
  });

  it('GFMの打ち消し線・テーブルに対応する', () => {
    const html = expectHtml('~~取り消し~~');
    expect(html).toContain('<del>取り消し</del>');

    const tableHtml = expectHtml('| a | b |\n| - | - |\n| 1 | 2 |');
    expect(tableHtml).toContain('<table>');
  });

  it('空文字を渡すと空文字のHTMLを返す', () => {
    expect(expectHtml('')).toBe('');
  });
});

function convert(html: string, options: Partial<HtmlToMarkdownOptions> = {}) {
  const result = htmlToMarkdown(html, { ...defaultOptions, ...options });
  if (!result.success) throw new Error(result.message);
  return result.output;
}

describe('htmlToMarkdown', () => {
  it('見出し・段落・強調・リンクを変換する', () => {
    expect(
      convert(
        '<h1>Title</h1><p>a <strong>b</strong> <em>c</em> <a href="https://x.test/">d</a></p>',
      ),
    ).toBe('# Title\n\na **b** *c* [d](https://x.test/)');
  });

  it('見出しをsetext形式にできる', () => {
    expect(convert('<h1>Title</h1>', { headingStyle: 'setext' })).toBe(
      'Title\n=====',
    );
  });

  it('箇条書きのマーカーを選べる', () => {
    expect(
      convert('<ul><li>a</li><li>b</li></ul>', { bulletMarker: '*' }),
    ).toBe('*   a\n*   b');
  });

  it('コードブロックをフェンス形式・インデント形式で出力する', () => {
    const html = '<pre><code>x = 1</code></pre>';
    expect(convert(html)).toBe('```\nx = 1\n```');
    expect(convert(html, { codeBlockStyle: 'indented' })).toBe('    x = 1');
  });

  it('表をGFMの表にし、セル内の | をエスケープする', () => {
    expect(
      convert(
        '<table><tr><th>A</th><th>B</th></tr><tr><td>1|2</td><td>3</td></tr></table>',
      ),
    ).toBe('| A | B |\n| --- | --- |\n| 1\\|2 | 3 |');
  });

  it('取り消し線を ~~ にする', () => {
    expect(convert('<p><del>x</del></p>')).toBe('~~x~~');
  });

  it('script / style の中身は出力しない', () => {
    expect(
      convert('<style>p{}</style><script>alert(1)</script><p>ok</p>'),
    ).toBe('ok');
  });

  it('画像・リンクを取り除くオプション', () => {
    const html = '<p><img src="a.png" alt="pic"><a href="/x">link</a></p>';
    expect(convert(html)).toBe('![pic](a.png)[link](/x)');
    expect(convert(html, { removeImages: true, removeLinks: true })).toBe(
      'link',
    );
  });

  it('空文字は空文字を返す', () => {
    expect(convert('')).toBe('');
  });

  it('空白のみの入力は空文字を返す', () => {
    expect(convert('   \n\t  ')).toBe('');
  });

  it('空の表は何も出力しない', () => {
    expect(convert('<table></table>')).toBe('');
  });

  it('閉じタグが欠けた不正なHTMLでも例外にならず変換する', () => {
    const result = htmlToMarkdown('<p>abc<div>x<li>y', defaultOptions);
    expect(result.success).toBe(true);
    if (result.success) expect(result.output).toContain('abc');
  });

  it('日本語・絵文字・サロゲートペアの文字を壊さない', () => {
    expect(convert('<p>日本語 😀 𠮷野家</p>')).toBe('日本語 😀 𠮷野家');
  });

  it('CRLF / CR の改行を含むHTMLを変換する', () => {
    expect(convert('<p>a</p>\r\n<p>b</p>\r\n')).toBe('a\n\nb');
    expect(convert('<p>a</p>\r<p>b</p>')).toBe('a\n\nb');
  });

  it('セル内の改行は空白1つにまとめられる', () => {
    expect(
      convert('<table><tr><th>A</th></tr><tr><td>x\ny</td></tr></table>'),
    ).toBe('| A |\n| --- |\n| x y |');
  });

  it('セル内のバックスラッシュをエスケープする', () => {
    const bs = String.fromCharCode(92);
    expect(
      convert(`<table><tr><th>A</th></tr><tr><td>a${bs}b</td></tr></table>`),
    ).toBe(`| A |\n| --- |\n| a${bs}${bs}b |`);
  });

  it('列数が揃っていない行は空セルで埋める', () => {
    expect(
      convert(
        '<table><tr><th>A</th><th>B</th><th>C</th></tr><tr><td>1</td></tr></table>',
      ),
    ).toBe('| A | B | C |\n| --- | --- | --- |\n| 1 |  |  |');
  });

  it('thead / tbody の表も変換する', () => {
    expect(
      convert(
        '<table><thead><tr><th>A</th></tr></thead><tbody><tr><td>1</td></tr></tbody></table>',
      ),
    ).toBe('| A |\n| --- |\n| 1 |');
  });

  it('Markdownの記号をエスケープして文字として残す', () => {
    expect(convert('<p>*star* _u_ [x]</p>')).toBe('\\*star\\* \\_u\\_ \\[x\\]');
  });

  it('pre 内のHTMLエスケープされた文字をデコードする', () => {
    expect(convert('<pre><code>&lt;div&gt;</code></pre>')).toBe(
      '```\n<div>\n```',
    );
  });

  it('script が本文の途中にあっても中身だけを除く', () => {
    expect(convert('<p>a<script>x</script>b</p>')).toBe('ab');
  });

  it('iframe を含むHTMLでは周囲の本文だけを出力する', () => {
    expect(convert('<iframe src="https://evil.test"></iframe><p>t</p>')).toBe(
      't',
    );
  });

  it('大量の要素（2000件のリスト）も例外なく変換する', () => {
    const html =
      '<ul>' +
      Array.from({ length: 2000 }, (_, i) => `<li>item ${i}</li>`).join('') +
      '</ul>';
    const out = convert(html);
    expect(out.split('\n')).toHaveLength(2000);
    expect(out).toContain('item 1999');
  });
});
