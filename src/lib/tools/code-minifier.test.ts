import { describe, expect, it } from 'vitest';
import { formatCode, minifyCode } from './code-minifier';

describe('formatCode', () => {
  it('CSSを整形する', async () => {
    const result = await formatCode('.a{color:red;margin:0}', 'css');
    expect(result).toBe('.a {\n  color: red;\n  margin: 0;\n}\n');
  });

  it('JavaScriptを整形する', async () => {
    const result = await formatCode(
      'const a=1;function f(x){return x+1}',
      'javascript',
    );
    expect(result).toBe('const a = 1;\nfunction f(x) {\n  return x + 1;\n}\n');
  });

  it('HTMLを整形する', async () => {
    const result = await formatCode('<div><p>hello</p></div>', 'html');
    expect(result).toBe('<div><p>hello</p></div>\n');
  });

  it('インデント幅を指定できる', async () => {
    const result = await formatCode('.a{color:red}', 'css', { tabWidth: 4 });
    expect(result).toBe('.a {\n    color: red;\n}\n');
  });

  it('useTabsを指定するとタブでインデントする', async () => {
    const result = await formatCode('.a{color:red}', 'css', { useTabs: true });
    expect(result).toBe('.a {\n\tcolor: red;\n}\n');
  });

  it('空文字はエラーにならず空文字を返す', async () => {
    const result = await formatCode('', 'css');
    expect(result).toBe('');
  });

  it('構文エラーのあるCSSは例外を投げる', async () => {
    await expect(formatCode('.a{', 'css')).rejects.toThrow();
  });

  it('構文エラーのあるJavaScriptは例外を投げる', async () => {
    await expect(formatCode('const a = ;', 'javascript')).rejects.toThrow();
  });

  it('CSSの日本語・絵文字を含む文字列も整形できる', async () => {
    const result = await formatCode('.a{content:"日本語🐱";}', 'css');
    expect(result).toBe('.a {\n  content: "日本語🐱";\n}\n');
  });

  it('JavaScriptの日本語・絵文字を含む文字列も整形できる', async () => {
    const result = await formatCode(
      'const s="こんにちは🐱世界";function f(){return s}',
      'javascript',
    );
    expect(result).toBe(
      'const s = "こんにちは🐱世界";\nfunction f() {\n  return s;\n}\n',
    );
  });

  it('HTMLの日本語・絵文字を含むテキストも整形できる', async () => {
    const result = await formatCode(
      '<div><p>こんにちは🐱世界</p></div>',
      'html',
    );
    expect(result).toBe('<div><p>こんにちは🐱世界</p></div>\n');
  });

  it('CRLF改行のCSSも整形できる', async () => {
    const result = await formatCode('.a{\r\n  color:red;\r\n}\r\n', 'css');
    expect(result).toBe('.a {\n  color: red;\n}\n');
  });

  it('CRLF改行のJavaScriptも整形できる', async () => {
    const result = await formatCode(
      'const a=1;\r\nfunction f(x){\r\n  return x+1\r\n}\r\n',
      'javascript',
    );
    expect(result).toBe('const a = 1;\nfunction f(x) {\n  return x + 1;\n}\n');
  });

  it('HTMLでもtabWidthオプションが効く', async () => {
    const result = await formatCode('<ul><li>a</li><li>b</li></ul>', 'html', {
      tabWidth: 4,
    });
    expect(result).toBe('<ul>\n    <li>a</li>\n    <li>b</li>\n</ul>\n');
  });

  it('HTMLでもuseTabsオプションが効く', async () => {
    const result = await formatCode('<ul><li>a</li><li>b</li></ul>', 'html', {
      useTabs: true,
    });
    expect(result).toBe('<ul>\n\t<li>a</li>\n\t<li>b</li>\n</ul>\n');
  });

  it('大量のCSSルールでもエラーにならず整形できる', async () => {
    const rules = Array.from(
      { length: 500 },
      (_, i) => `.a${i}{color:red;margin:${i}px}`,
    ).join('');
    const result = await formatCode(rules, 'css');
    expect(result.split('\n').length).toBeGreaterThan(500);
  });
});

describe('minifyCode', () => {
  it('HTML: インライン要素に隣接する語間の空白は1個残す', async () => {
    const result = await minifyCode(
      '<p>Hello <b>world</b> and <i>you</i></p>',
      'html',
    );
    expect(result).toBe('<p>Hello <b>world</b> and <i>you</i></p>');
  });

  it('HTML: コメントを除去しても語間の空白は残る', async () => {
    const result = await minifyCode('<p>Hello <!-- c -->world</p>', 'html');
    expect(result).toBe('<p>Hello world</p>');
  });

  it('HTML: ブロック要素の前後の空白・改行は除去する', async () => {
    const result = await minifyCode(
      '<ul>\n  <li> <a href="#">a</a> </li>\n  <li>b</li>\n</ul>',
      'html',
    );
    expect(result).toBe('<ul><li><a href="#">a</a></li><li>b</li></ul>');
  });

  it('CSSをミニファイする', async () => {
    const result = await minifyCode(
      '.a {\n  color: red;\n  margin: 0;\n}\n',
      'css',
    );
    expect(result).toBe('.a{color:red;margin:0}');
  });

  it('JavaScriptをミニファイする', async () => {
    const result = await minifyCode(
      'function add(a, b) {\n  return a + b;\n}\n',
      'javascript',
    );
    expect(result).not.toContain('\n');
    expect(result.length).toBeLessThan(
      'function add(a, b) {\n  return a + b;\n}\n'.length,
    );
  });

  it('HTMLをミニファイする', async () => {
    const result = await minifyCode('<div>\n  <p>hello</p>\n</div>\n', 'html');
    expect(result).toBe('<div><p>hello</p></div>');
  });

  it('HTMLコメントを除去する', async () => {
    const result = await minifyCode('<div><!-- comment -->hello</div>', 'html');
    expect(result).toBe('<div>hello</div>');
  });

  it('script/style/pre/textarea要素の中身は空白を保持する', async () => {
    const result = await minifyCode(
      '<pre>  a\n  b  </pre><script>\n  const x = 1;\n</script>',
      'html',
    );
    expect(result).toBe(
      '<pre>  a\n  b  </pre><script>\n  const x = 1;\n</script>',
    );
  });

  it('属性値の引用符内にある > や空白はタグの終端として扱わない', async () => {
    const result = await minifyCode(
      '<div title="a > b">  <span data-x="  y  ">z</span>  </div>',
      'html',
    );
    expect(result).toBe(
      '<div title="a > b"><span data-x="  y  ">z</span></div>',
    );
  });

  it('属性値の引用符が閉じていない場合、以降の入力全体がタグの一部として扱われる（既知の仕様）', async () => {
    // readTagは引用符の対応を前提にしているため、閉じ引用符が無いと`>`探索が
    // 入力末尾まで続き、以降のコメント除去・空白圧縮が効かなくなる。
    // 例外や無限ループにはならないが、意図しない出力になる既知の制限として明示する。
    const input = '<div title="unterminated><p>  hello  </p>';
    const result = await minifyCode(input, 'html');
    expect(result).toBe(input.trim());
  });

  it('閉じていないCSSは例外を投げず、閉じていない部分を無視する（csso依存の既知の挙動）', async () => {
    await expect(minifyCode('.a{', 'css')).resolves.toBe('');
  });

  it('JavaScriptの構文エラーは例外を投げる', async () => {
    await expect(minifyCode('const a = ;', 'javascript')).rejects.toThrow();
  });

  it('空文字は空文字を返す', async () => {
    expect(await minifyCode('', 'css')).toBe('');
    expect(await minifyCode('', 'html')).toBe('');
    expect(await minifyCode('', 'javascript')).toBe('');
  });

  it('コメントのみのCSSをミニファイすると空文字になる', async () => {
    const result = await minifyCode('/* just a comment */', 'css');
    expect(result).toBe('');
  });

  it('CSSの日本語・絵文字を含む文字列もミニファイできる', async () => {
    const result = await minifyCode('.a {\n  content: "日本語🐱";\n}\n', 'css');
    expect(result).toBe('.a{content:"日本語🐱"}');
  });

  it('JavaScriptの日本語・絵文字を含む文字列もミニファイできる', async () => {
    const result = await minifyCode(
      'const s = "こんにちは🐱世界";\nfunction f() {\n  return s;\n}\n',
      'javascript',
    );
    expect(result).toBe('const s="こんにちは🐱世界";function f(){return s}');
  });

  it('HTMLの日本語・絵文字を含むテキストもミニファイできる', async () => {
    const result = await minifyCode(
      '<div>\n  <p>こんにちは🐱世界</p>\n</div>\n',
      'html',
    );
    expect(result).toBe('<div><p>こんにちは🐱世界</p></div>');
  });

  it('DOCTYPE宣言やvoid要素（br, img）を含むHTMLもミニファイできる', async () => {
    const result = await minifyCode(
      '<!DOCTYPE html>\n<html>\n  <body>\n    <br>\n    <img src="a.png">\n  </body>\n</html>\n',
      'html',
    );
    expect(result).toBe(
      '<!DOCTYPE html><html><body><br><img src="a.png"></body></html>',
    );
  });

  it('引用符なしの属性値を含むHTMLもミニファイできる', async () => {
    const result = await minifyCode(
      '<div class=box>\n  <span>x</span>\n</div>\n',
      'html',
    );
    expect(result).toBe('<div class=box><span>x</span></div>');
  });
});
