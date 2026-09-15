import { describe, expect, it } from 'vitest';
import { markdownToHtml } from './markdown-preview';

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
