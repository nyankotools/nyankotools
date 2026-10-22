import { describe, expect, it } from 'vitest';
import {
  checkFlags,
  displayChar,
  explainRegex,
  fillTemplate,
  splitRegexLiteral,
} from './regex-explainer';

const kinds = (p: string, f = '') =>
  explainRegex(p, f).tokens.map((t) => t.kind);

describe('explainRegex: 基本要素', () => {
  it('リテラルと量指定子を分解する', () => {
    const r = explainRegex('ab+c*?');
    expect(r.ok).toBe(true);
    expect(r.tokens.map((t) => [t.kind, t.source])).toEqual([
      ['literal', 'a'],
      ['literal', 'b'],
      ['qPlus', '+'],
      ['literal', 'c'],
      ['qStar', '*?'],
    ]);
    expect(r.tokens[4].lazy).toBe(true);
    expect(r.tokens[2].lazy).toBeUndefined();
  });

  it('アンカー・任意文字・エスケープクラス', () => {
    expect(kinds('^.\\d\\D\\w\\W\\s\\S\\b\\B$')).toEqual([
      'start',
      'any',
      'digit',
      'notDigit',
      'word',
      'notWord',
      'whitespace',
      'notWhitespace',
      'wordBoundary',
      'notWordBoundary',
      'end',
    ]);
  });

  it('{n} {n,} {n,m} 量指定子', () => {
    const r = explainRegex('a{2}b{3,}c{1,4}?');
    expect(r.tokens.map((t) => t.kind)).toEqual([
      'literal',
      'qExact',
      'literal',
      'qAtLeast',
      'literal',
      'qRange',
    ]);
    expect(r.tokens[5].p).toEqual({ min: '1', max: '4' });
    expect(r.tokens[5].lazy).toBe(true);
  });

  it('スペースとエスケープ文字', () => {
    expect(kinds('a b\\n\\t\\.')).toEqual([
      'literal',
      'space',
      'literal',
      'escNewline',
      'escTab',
      'escapedLiteral',
    ]);
  });

  it('空パターンも成功する', () => {
    const r = explainRegex('');
    expect(r.ok).toBe(true);
    expect(r.tokens).toEqual([]);
  });

  it('選択 | をグループ内外で分解する', () => {
    const r = explainRegex('a|(b|c)');
    expect(r.tokens.map((t) => [t.kind, t.depth])).toEqual([
      ['literal', 0],
      ['alternation', 0],
      ['group', 0],
      ['literal', 1],
      ['alternation', 1],
      ['literal', 1],
    ]);
  });
});

describe('explainRegex: グループ', () => {
  it('キャプチャ・名前付き・非キャプチャに番号を振る', () => {
    const r = explainRegex('(a)(?<year>\\d{4})(?:b)');
    expect(r.groupCount).toBe(2);
    expect(r.groupNames).toEqual(['year']);
    expect(r.tokens.filter((t) => t.depth === 0).map((t) => t.kind)).toEqual([
      'group',
      'namedGroup',
      'nonCapture',
    ]);
    expect(r.tokens[0].p.n).toBe('1');
    expect(r.tokens[2].p).toEqual({ name: 'year', n: '2' });
  });

  it('先読み・後読み', () => {
    expect(kinds('(?=a)(?!b)(?<=c)(?<!d)')).toEqual([
      'lookahead',
      'literal',
      'negLookahead',
      'literal',
      'lookbehind',
      'literal',
      'negLookbehind',
      'literal',
    ]);
  });

  it('グループへの量指定子は閉じ括弧の後に並ぶ', () => {
    const r = explainRegex('(ab)+');
    expect(r.tokens.map((t) => [t.kind, t.depth])).toEqual([
      ['group', 0],
      ['literal', 1],
      ['literal', 1],
      ['qPlus', 0],
    ]);
  });

  it('後方参照と名前付き後方参照', () => {
    expect(kinds('(a)\\1')).toEqual(['group', 'literal', 'backref']);
    const r = explainRegex('(?<x>a)\\k<x>');
    expect(r.tokens[2].kind).toBe('namedBackref');
    expect(r.tokens[2].p.name).toBe('x');
  });

  it('修飾子グループ', () => {
    const r = explainRegex('(?i-s:a)');
    expect(r.tokens[0].kind).toBe('modifierGroup');
    expect(r.tokens[0].p.flags).toBe('+i -s');
  });
});

describe('explainRegex: 文字クラス', () => {
  it('範囲とエスケープを内側に並べる', () => {
    const r = explainRegex('[a-z\\d_-]');
    expect(r.tokens.map((t) => [t.kind, t.depth])).toEqual([
      ['classOpen', 0],
      ['classRange', 1],
      ['digit', 1],
      ['literal', 1],
      ['literal', 1],
    ]);
    expect(r.tokens[1].p).toEqual({ from: 'a', to: 'z' });
  });

  it('否定クラスと ] の直前の - はリテラル', () => {
    expect(kinds('[^a-]')).toEqual(['negClassOpen', 'literal', 'literal']);
  });

  it('クラス内の \\b はバックスペース', () => {
    expect(kinds('[\\b]')).toEqual(['classOpen', 'escBackspace']);
  });

  it('非uモードでは [\\d-z] は3つの要素になる', () => {
    expect(kinds('[\\d-z]')).toEqual([
      'classOpen',
      'digit',
      'literal',
      'literal',
    ]);
  });
});

describe('explainRegex: 各種エスケープ', () => {
  it('\\x \\u \\u{} \\c', () => {
    const r = explainRegex('\\x41\\u0042\\u{1F600}\\cJ', 'u');
    expect(r.ok).toBe(true);
    expect(r.tokens.map((t) => t.kind)).toEqual([
      'codePoint',
      'codePoint',
      'codePoint',
      'controlLetter',
    ]);
    expect(r.tokens[0].p.hex).toBe('U+0041');
    expect(r.tokens[2].p.hex).toBe('U+1F600');
  });

  it('\\p{...} はuフラグ時のみ', () => {
    expect(kinds('\\p{L}\\P{Lu}', 'u')).toEqual([
      'unicodeProp',
      'notUnicodeProp',
    ]);
    expect(kinds('\\p')).toEqual(['escapedLiteral']);
  });

  it('レガシー8進と存在しない後方参照（非uモード）', () => {
    expect(kinds('\\101')).toEqual(['codePoint']);
    expect(kinds('\\8')).toEqual(['escapedLiteral']);
    expect(kinds('\\0')).toEqual(['escNul']);
  });

  it('非uモードでは不正な量指定子 { はリテラル', () => {
    const r = explainRegex('a{,3}');
    expect(r.ok).toBe(true);
    expect(r.tokens.map((t) => t.kind)).toEqual([
      'literal',
      'literal',
      'literal',
      'literal',
      'literal',
    ]);
  });

  it('サロゲートペアの絵文字をリテラルとして1要素にする', () => {
    const r = explainRegex('😀', 'u');
    expect(r.tokens).toHaveLength(1);
    expect(r.tokens[0].source).toBe('😀');
  });
});

describe('explainRegex: エラー', () => {
  const err = (p: string, f = '') => explainRegex(p, f).error;

  it('閉じていないグループは開き括弧の位置', () => {
    expect(err('ab(c')).toEqual({ code: 'unterminatedGroup', index: 2 });
  });

  it('余分な閉じ括弧', () => {
    expect(err('ab)c')).toEqual({ code: 'unmatchedParen', index: 2 });
  });

  it('閉じていない文字クラス', () => {
    expect(err('x[abc')).toEqual({ code: 'unterminatedClass', index: 1 });
  });

  it('範囲の順序違い', () => {
    expect(err('[z-a]')).toEqual({ code: 'rangeOutOfOrder', index: 1 });
  });

  it('繰り返す対象が無い', () => {
    expect(err('*a')).toEqual({ code: 'nothingToRepeat', index: 0 });
    expect(err('a**')).toEqual({ code: 'nothingToRepeat', index: 2 });
    expect(err('^*')).toEqual({ code: 'nothingToRepeat', index: 1 });
    expect(err('(?<=a)+')).toEqual({ code: 'nothingToRepeat', index: 6 });
    expect(err('{2}')?.code).toBe('nothingToRepeat');
  });

  it('{n,m} の大小逆転', () => {
    expect(err('a{3,2}')).toEqual({ code: 'quantifierOutOfOrder', index: 1 });
  });

  it('末尾のバックスラッシュ', () => {
    expect(err('ab\\')).toEqual({ code: 'trailingBackslash', index: 2 });
  });

  it('不正なグループ構文とグループ名', () => {
    expect(err('(?x)')).toEqual({ code: 'invalidGroup', index: 0 });
    expect(err('(?<1a>x)')).toEqual({ code: 'invalidGroupName', index: 0 });
    expect(err('(?<a')?.code).toBe('invalidGroupName');
  });

  it('未定義の名前付き参照', () => {
    expect(err('(?<a>x)\\k<b>')).toEqual({
      code: 'undefinedGroupName',
      index: 7,
    });
  });

  it('uモード: 不正なエスケープ・後方参照・単独括弧・量指定子', () => {
    expect(err('\\a', 'u')?.code).toBe('invalidEscape');
    expect(err('\\2', 'u')?.code).toBe('invalidBackref');
    expect(err('a]', 'u')?.code).toBe('loneBracket');
    expect(err('a{', 'u')?.code).toBe('incompleteQuantifier');
    expect(err('[\\d-z]', 'u')?.code).toBe('invalidClassRange');
    expect(err('\\p{', 'u')?.code).toBe('invalidEscape');
  });

  it('uモードでない場合は同じパターンでも成功する', () => {
    expect(explainRegex('\\a').ok).toBe(true);
    expect(explainRegex('a]').ok).toBe(true);
  });

  it('パーサーが見逃す不正は RegExp の判定で補う', () => {
    const r = explainRegex('\\p{NoSuchProperty}', 'u');
    expect(r.ok).toBe(false);
    expect(r.error?.code).toBe('native');
    expect(r.error?.index).toBe(-1);
    expect(r.error?.detail).toBeTruthy();
  });

  it('エラー時は tokens が空', () => {
    expect(explainRegex('(a').tokens).toEqual([]);
  });
});

describe('フラグ', () => {
  it('有効なフラグを順に返す', () => {
    const r = explainRegex('a', 'gi');
    expect(r.flags).toEqual(['g', 'i']);
    expect(r.flagError).toBeNull();
  });

  it('未知のフラグ・重複・u と v の併用', () => {
    expect(checkFlags('gx').error).toEqual({
      code: 'invalidFlag',
      index: 1,
      char: 'x',
    });
    expect(checkFlags('gg').error?.code).toBe('duplicateFlag');
    expect(checkFlags('uv').error?.code).toBe('flagUV');
    expect(explainRegex('a', 'q').ok).toBe(false);
  });

  it('v フラグでも解析できる', () => {
    expect(explainRegex('\\p{L}', 'v').ok).toBe(true);
  });
});

describe('境界・多言語', () => {
  it('日本語のリテラルは1文字ずつ分解する', () => {
    const r = explainRegex('あいう');
    expect(r.ok).toBe(true);
    expect(r.tokens.map((t) => t.source)).toEqual(['あ', 'い', 'う']);
  });

  it('サロゲートペアは非uモードでも1要素（表示上の単位は文字）', () => {
    expect(explainRegex('😀').tokens).toHaveLength(1);
    expect(explainRegex('😀', 'u').tokens).toHaveLength(1);
  });

  it('長いパターン（5000文字）でも落ちずに分解する', () => {
    const r = explainRegex('a'.repeat(5000));
    expect(r.ok).toBe(true);
    expect(r.tokens).toHaveLength(5000);
  });

  it('CRLF を含むパターンは CR と LF をそれぞれ1要素にする', () => {
    const r = explainRegex('a\r\nb');
    expect(r.ok).toBe(true);
    expect(r.tokens.map((t) => t.kind)).toEqual([
      'literal',
      'literal',
      'literal',
      'literal',
    ]);
  });

  it('y と d フラグは有効、d と u の併用も有効', () => {
    expect(explainRegex('a', 'y').ok).toBe(true);
    expect(explainRegex('a', 'd').flags).toEqual(['d']);
    expect(explainRegex('a', 'du').ok).toBe(true);
  });

  it('空のフラグ文字列は有効、フラグが空白なら invalidFlag', () => {
    expect(checkFlags('').error).toBeNull();
    expect(checkFlags(' ').error?.code).toBe('invalidFlag');
  });

  it('splitRegexLiteral は未知フラグや余分な文字を含むと null', () => {
    expect(splitRegexLiteral('/a/q')).toBeNull();
    expect(splitRegexLiteral('/a/g extra')).toBeNull();
    expect(splitRegexLiteral('/a/dgimsuvy')?.flags).toBe('dgimsuvy');
  });
});

describe('補助関数', () => {
  it('splitRegexLiteral', () => {
    expect(splitRegexLiteral('/a+b/gi')).toEqual({
      pattern: 'a+b',
      flags: 'gi',
    });
    expect(splitRegexLiteral(' /a/ ')).toEqual({ pattern: 'a', flags: '' });
    expect(splitRegexLiteral('a/b/')).toBeNull();
    expect(splitRegexLiteral('/a/zz')).toBeNull();
    expect(splitRegexLiteral('//')).toBeNull();
  });

  it('displayChar', () => {
    expect(displayChar(0x61)).toBe('a');
    expect(displayChar(0x20)).toBe('␠');
    expect(displayChar(10)).toBe('U+000A');
  });

  it('fillTemplate', () => {
    expect(fillTemplate('{a}と{b}と{c}', { a: '1', b: '2' })).toBe('1と2と');
    expect(fillTemplate('$&{a}', { a: '$1' })).toBe('$&$1');
  });
});
