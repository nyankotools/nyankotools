import { describe, it, expect } from 'vitest';
import { decodeHtmlEntities, stripHtml } from './html-tag-stripper';

describe('decodeHtmlEntities', () => {
  it('名前付き・数値参照をデコードする', () => {
    expect(decodeHtmlEntities('a &amp; b &lt;c&gt; &#12354; &#x1F600;')).toBe(
      'a & b <c> あ 😀',
    );
  });
  it('二重にはデコードしない', () => {
    expect(decodeHtmlEntities('&amp;lt;')).toBe('&lt;');
  });
  it('未知の名前や範囲外はそのまま残す', () => {
    expect(decodeHtmlEntities('&unknown; &#99999999;')).toBe(
      '&unknown; &#99999999;',
    );
  });
});

describe('stripHtml', () => {
  it('タグを除去してテキストを取り出す', () => {
    expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
  });

  it('script・style・コメント・headの中身を除去する', () => {
    const html =
      '<html><head><title>T</title><style>p{color:red}</style></head><body><!-- c --><script>alert("x<b>")</script><p>本文</p></body></html>';
    expect(stripHtml(html)).toBe('本文');
  });

  it('ブロック要素で改行し、段落間は空行1つ', () => {
    expect(
      stripHtml('<h1>見出し</h1><p>一</p><p>二<br>三</p><div>四</div>'),
    ).toBe('見出し\n\n一\n\n二\n三\n\n四');
  });

  it('ブロック改行を保持しない設定では空白でつなぐ', () => {
    expect(
      stripHtml('<p>一</p><p>二<br>三</p>', { keepBlockBreaks: false }),
    ).toBe('一 二 三');
  });

  it('ソース中の改行・連続空白は1つにまとめる', () => {
    expect(stripHtml('<p>a\n   b\t\tc</p>')).toBe('a b c');
  });

  it('空白の圧縮を切ると元の空白を保つ', () => {
    expect(
      stripHtml('<p>a   b</p>', {
        collapseWhitespace: false,
      }),
    ).toBe('a   b');
  });

  it('preの中の空白と改行を保持する', () => {
    expect(stripHtml('<pre>a  b\n  c</pre>')).toBe('a  b\n  c');
  });

  it('リストを1項目1行にする', () => {
    expect(stripHtml('<ul>\n<li>A</li>\n<li>B</li>\n</ul>')).toBe('A\nB');
  });

  it('テーブルのセルをタブ区切りにする', () => {
    expect(
      stripHtml(
        '<table><tr><th>名</th><th>値</th></tr><tr><td>a</td><td>1</td></tr></table>',
      ),
    ).toBe('名\t値\na\t1');
  });

  it('リンクURLを残す設定', () => {
    expect(
      stripHtml('<a href="https://example.com/?a=1&amp;b=2">サイト</a>', {
        keepLinkUrls: true,
      }),
    ).toBe('サイト (https://example.com/?a=1&b=2)');
    expect(stripHtml('<a href="https://x.test">サイト</a>')).toBe('サイト');
  });

  it('リンクテキストがURLと同じなら重複させず、危険なスキームは出さない', () => {
    expect(
      stripHtml('<a href="https://x.test">https://x.test</a>', {
        keepLinkUrls: true,
      }),
    ).toBe('https://x.test');
    expect(
      stripHtml(
        '<a href="javascript:alert(1)">click</a><a href="#top">top</a>',
        {
          keepLinkUrls: true,
        },
      ),
    ).toBe('clicktop');
  });

  it('画像のaltを残す設定', () => {
    expect(stripHtml('<p>a<img src="x.png" alt="猫">b</p>')).toBe('ab');
    expect(
      stripHtml('<p>a<img src="x.png" alt="猫">b</p>', { keepImageAlt: true }),
    ).toBe('a猫b');
  });

  it('文字参照のデコードを切れる', () => {
    expect(stripHtml('<p>a &amp; b&nbsp;c</p>')).toBe('a & b c');
    expect(stripHtml('<p>a &amp; b</p>', { decodeEntities: false })).toBe(
      'a &amp; b',
    );
  });

  it('タグではない < はそのまま残す', () => {
    expect(stripHtml('1 < 2 and 3 > 2')).toBe('1 < 2 and 3 > 2');
  });

  it('属性値に > を含むタグも正しく処理する', () => {
    expect(stripHtml('<a title="a>b" href="/">x</a>y')).toBe('xy');
  });

  it('閉じていないタグ・script は崩れずに処理する', () => {
    expect(stripHtml('<p>ok<script>alert(1)')).toBe('ok');
    expect(stripHtml('text <div')).toBe('text <div');
  });

  it('大文字小文字を区別しない', () => {
    expect(stripHtml('<P>A</P><SCRIPT>x</SCRIPT>')).toBe('A');
  });

  it('空文字は空文字', () => {
    expect(stripHtml('')).toBe('');
  });

  it('連続する空行を圧縮する設定', () => {
    const html = '<p>a</p><br><br><br><p>b</p>';
    expect(stripHtml(html)).toBe('a\n\nb');
    expect(stripHtml(html, { compressBlankLines: false })).toBe('a\n\n\n\n\nb');
  });

  it('CRLF・CR の改行は段落区切り・空白として扱う', () => {
    expect(stripHtml('<p>a</p>\r\n<p>b</p>')).toBe('a\n\nb');
    expect(stripHtml('a\rb')).toBe('a b');
    expect(stripHtml('a\r\n\r\n\r\nb')).toBe('a b');
  });

  it('サロゲートペア（絵文字）と全角空白を壊さない', () => {
    expect(stripHtml('<p>😀👨‍👩‍👧</p>')).toBe('😀👨‍👩‍👧');
    expect(stripHtml('<p>全角　空白</p>')).toBe('全角　空白');
  });

  it('空のリンクテキストはURLだけを残す', () => {
    expect(
      stripHtml('<a href="https://x.test/"></a>', { keepLinkUrls: true }),
    ).toBe('https://x.test/');
  });

  it('タグでない < で終わる入力を崩さない', () => {
    expect(stripHtml('a <')).toBe('a <');
  });

  it('長い入力（20万文字）でも全文を処理する', () => {
    const body = 'あ'.repeat(200000);
    expect(stripHtml(`<p>${body}</p>`)).toBe(body);
  });

  // 既知の不具合: toLowerCase で İ（U+0130）は2文字に広がり、lower と html の添字がずれる。
  // 9文字以上ずれると script/style の終了タグを読み飛ばし、後続の本文が消える。
  it('İ が多い文書でも script 後の本文を失わない', () => {
    expect(stripHtml('İ'.repeat(9) + '<script>x</script>VISIBLE')).toContain(
      'VISIBLE',
    );
  });
  it('">" が無い "<a" の大量連続でも短時間で終わる', () => {
    const start = Date.now();
    const out = stripHtml('<a b="x"'.repeat(30000));
    expect(typeof out).toBe('string');
    expect(Date.now() - start).toBeLessThan(1000);
  });
});
