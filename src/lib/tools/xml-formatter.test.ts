import { describe, it, expect } from 'vitest';
import { formatXml } from './xml-formatter';

function ok(input: string, options = {}): string {
  const r = formatXml(input, options);
  if (!r.success) throw new Error(r.message);
  return r.output;
}

describe('formatXml 整形', () => {
  it('入れ子の要素を2スペースで整形する', () => {
    expect(ok('<a><b><c/></b><d></d></a>')).toBe(
      '<a>\n  <b>\n    <c/>\n  </b>\n  <d></d>\n</a>',
    );
  });

  it('4スペース・タブを選べる', () => {
    expect(ok('<a><b/></a>', { indent: '4' })).toBe('<a>\n    <b/>\n</a>');
    expect(ok('<a><b/></a>', { indent: 'tab' })).toBe('<a>\n\t<b/>\n</a>');
  });

  it('XML宣言・コメント・DOCTYPE・処理命令を保持する', () => {
    const out = ok(
      '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE a [<!ENTITY e "x>y">]><!-- top --><?pi x?><a><!-- c --><b/></a>',
    );
    expect(out).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<!DOCTYPE a [<!ENTITY e "x>y">]>',
        '<!-- top -->',
        '<?pi x?>',
        '<a>',
        '  <!-- c -->',
        '  <b/>',
        '</a>',
      ].join('\n'),
    );
  });

  it('テキストだけの要素は1行のまま保つ', () => {
    expect(ok('<a><b>  hello  </b></a>')).toBe('<a>\n  <b>  hello  </b>\n</a>');
  });

  it('混在コンテンツの空白を壊さない', () => {
    const src = '<p>Hello <b>big</b> <i>world</i>!</p>';
    expect(ok(`<doc><sec>${src}</sec></doc>`)).toBe(
      `<doc>\n  <sec>\n    ${src}\n  </sec>\n</doc>`,
    );
  });

  it('CDATA を含む要素は中身をそのまま保つ', () => {
    expect(ok('<a><s><![CDATA[ <x> & ]]></s></a>')).toBe(
      '<a>\n  <s><![CDATA[ <x> & ]]></s>\n</a>',
    );
  });

  it('属性・名前空間・属性値内の > を保持する', () => {
    const out = ok(
      '<x:a xmlns:x="urn:x"   id = \'1\'  t="a>b"><x:b x:k="v"/></x:a>',
    );
    expect(out).toBe(
      '<x:a xmlns:x="urn:x" id=\'1\' t="a>b">\n  <x:b x:k="v"/>\n</x:a>',
    );
  });

  it('breakAttributes で属性を1行ずつにする（1個の場合は改行しない）', () => {
    expect(
      ok('<a id="1" cls="x"><b k="v"/></a>', { breakAttributes: true }),
    ).toBe('<a\n  id="1"\n  cls="x">\n  <b k="v"/>\n</a>');
  });

  it('整形後も冪等', () => {
    const once = ok('<a><b x="1">t</b><c><d/></c></a>');
    expect(ok(once)).toBe(once);
  });

  it('removeComments でコメントを消す', () => {
    expect(ok('<a><!-- x --><b/></a>', { removeComments: true })).toBe(
      '<a>\n  <b/>\n</a>',
    );
  });
});

describe('formatXml ミニファイ', () => {
  it('要素間の空白を削除する', () => {
    expect(
      ok('<?xml version="1.0"?>\n<a>\n  <b id="1">\n    <c/>\n  </b>\n</a>\n', {
        indent: 'min',
      }),
    ).toBe('<?xml version="1.0"?><a><b id="1"><c/></b></a>');
  });

  it('テキストの空白とコメント（残す場合）を保つ', () => {
    expect(
      ok('<a>\n <p>x <b>y</b> z</p>\n <!-- c -->\n</a>', { indent: 'min' }),
    ).toBe('<a><p>x <b>y</b> z</p><!-- c --></a>');
    expect(
      ok('<a>\n <!-- c -->\n <b/></a>', {
        indent: 'min',
        removeComments: true,
      }),
    ).toBe('<a><b/></a>');
  });
});

describe('formatXml エラー', () => {
  it('閉じタグの不一致で行・列を返す', () => {
    const r = formatXml('<a>\n  <b>\n</a>');
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.line).toBeGreaterThanOrEqual(1);
      expect(r.column).toBeGreaterThanOrEqual(1);
      expect(r.message).not.toBe('');
    }
  });

  it('ルートが複数ならエラー', () => {
    expect(formatXml('<a/><b/>').success).toBe(false);
  });

  it('属性の引用符欠落はエラー', () => {
    expect(formatXml('<a id=1/>').success).toBe(false);
  });
});

describe('formatXml エッジケース', () => {
  it('空入力・空白のみ・テキストのみはエラー', () => {
    for (const src of ['', '   ', 'hello']) {
      expect(formatXml(src).success, JSON.stringify(src)).toBe(false);
    }
  });

  it('CRLF の入力も LF で整形される', () => {
    expect(ok('<a>\r\n  <b/>\r\n</a>')).toBe('<a>\n  <b/>\n</a>');
  });

  it('日本語・絵文字のテキストを整形・ミニファイで壊さない', () => {
    expect(ok('<a>こんにちは😀<b>テスト</b></a>')).toBe(
      '<a>こんにちは😀<b>テスト</b></a>',
    );
    expect(ok('<a> <b>日本語 😀</b> </a>', { indent: 'min' })).toBe(
      '<a><b>日本語 😀</b></a>',
    );
  });

  it('2万要素の入力も整形できる', () => {
    const src = '<r>' + '<i k="v">x</i>'.repeat(20000) + '</r>';
    const out = ok(src);
    expect(out.split('\n').length).toBe(20002);
  });
});
