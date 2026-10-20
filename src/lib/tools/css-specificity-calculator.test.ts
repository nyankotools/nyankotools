import { describe, expect, it } from 'vitest';
import {
  analyzeSelectors,
  calculateSpecificity,
  compareSpecificity,
  formatSpecificity,
} from './css-specificity-calculator';

function spec(sel: string, parent?: [number, number, number]) {
  const r = calculateSpecificity(sel, parent ?? null);
  if (!r.ok) throw new Error(`error: ${r.code}`);
  return r.spec;
}

function code(sel: string) {
  const r = calculateSpecificity(sel);
  return r.ok ? null : r.code;
}

describe('calculateSpecificity', () => {
  it('基本セレクタ', () => {
    expect(spec('*')).toEqual([0, 0, 0]);
    expect(spec('li')).toEqual([0, 0, 1]);
    expect(spec('.a')).toEqual([0, 1, 0]);
    expect(spec('#id')).toEqual([1, 0, 0]);
    expect(spec('ul ol li.red')).toEqual([0, 1, 3]);
    expect(spec('#x34y')).toEqual([1, 0, 0]);
    expect(spec('li:first-child > a[href]:hover')).toEqual([0, 3, 2]);
  });

  it('結合子は詳細度に影響しない', () => {
    expect(spec('a > b + c ~ d e')).toEqual([0, 0, 5]);
    expect(spec('a>b')).toEqual([0, 0, 2]);
  });

  it('属性セレクタ内の記号は無視される', () => {
    expect(spec('a[href="#x.y, z"]')).toEqual([0, 1, 1]);
    expect(spec("input[type='text' i]")).toEqual([0, 1, 1]);
  });

  it('疑似要素は要素扱い', () => {
    expect(spec('p::before')).toEqual([0, 0, 2]);
    expect(spec('p:after')).toEqual([0, 0, 2]);
    expect(spec('::selection')).toEqual([0, 0, 1]);
    expect(spec('li::marker')).toEqual([0, 0, 2]);
  });

  it(':is / :not / :has は引数の最大値', () => {
    expect(spec(':is(#a, .b)')).toEqual([1, 0, 0]);
    expect(spec(':not(.a, #b)')).toEqual([1, 0, 0]);
    expect(spec('a:has(> img.x)')).toEqual([0, 1, 2]);
    expect(spec(':not(:is(.a, p))')).toEqual([0, 1, 0]);
  });

  it(':where は0', () => {
    expect(spec(':where(#a, .b)')).toEqual([0, 0, 0]);
    expect(spec('a:where(.x)')).toEqual([0, 0, 1]);
  });

  it(':nth-child は 1 + of 引数', () => {
    expect(spec(':nth-child(2n+1)')).toEqual([0, 1, 0]);
    expect(spec(':nth-child(2 of .a, #b)')).toEqual([1, 1, 0]);
    expect(spec(':nth-of-type(2)')).toEqual([0, 1, 0]);
  });

  it('カンマ区切りは最大値', () => {
    expect(spec('a, .b, #c')).toEqual([1, 0, 0]);
    expect(spec('.a .b, p')).toEqual([0, 2, 0]);
  });

  it('その他の疑似クラス', () => {
    expect(spec(':root')).toEqual([0, 1, 0]);
    expect(spec('a:lang(ja)')).toEqual([0, 1, 1]);
    expect(spec(':host(.x)')).toEqual([0, 2, 0]);
  });

  it('名前空間とエスケープ', () => {
    expect(spec('svg|a')).toEqual([0, 0, 1]);
    expect(spec('*|a')).toEqual([0, 0, 1]);
    expect(spec('.a\\:b')).toEqual([0, 1, 0]);
    expect(spec('#日本語')).toEqual([1, 0, 0]);
  });

  it('ネストの & は親の詳細度', () => {
    expect(spec('& .b', [1, 0, 0])).toEqual([1, 1, 0]);
    expect(spec('&:hover', [0, 1, 0])).toEqual([0, 2, 0]);
    expect(spec('> a', [0, 1, 0])).toEqual([0, 1, 1]);
    expect(spec('.b', [1, 0, 0])).toEqual([1, 1, 0]);
    expect(spec('& .b')).toEqual([0, 1, 0]);
  });

  it('不正なセレクタはエラー', () => {
    expect(code('')).toBe('empty');
    expect(code('a,')).toBe('empty');
    expect(code('a[href')).toBe('unclosedBracket');
    expect(code(':is(a')).toBe('unclosedParen');
    expect(code('a)')).toBe('unmatchedParen');
    expect(code('#')).toBe('emptyName');
    expect(code('.')).toBe('emptyName');
    expect(code('a > > b')).toBe('danglingCombinator');
    expect(code('a >')).toBe('danglingCombinator');
    expect(code('> a')).toBe('danglingCombinator');
    expect(code('a { color: red }')).toBe('unexpectedChar');
    expect(code('a[]')).toBe('emptyAttribute');
    expect(code('a[x="y]')).toBe('unclosedString');
    expect(code(':not()')).toBe('empty');
  });

  it('末尾のバックスラッシュと長大なセレクタ', () => {
    expect(code('a\\')).toBe('unexpectedChar');
    expect(spec('.a'.repeat(5000))).toEqual([0, 5000, 0]);
  });

  it(':has は先頭の結合子を許容する', () => {
    expect(code(':has(> a)')).toBeNull();
    expect(code(':has(a >)')).toBe('danglingCombinator');
  });
});

describe('compareSpecificity / formatSpecificity', () => {
  it('左の桁が優先される', () => {
    expect(compareSpecificity([1, 0, 0], [0, 99, 99])).toBe(1);
    expect(compareSpecificity([0, 1, 0], [0, 1, 1])).toBe(-1);
    expect(compareSpecificity([0, 1, 1], [0, 1, 1])).toBe(0);
  });
  it('整形', () => {
    expect(formatSpecificity([1, 2, 3])).toBe('(1, 2, 3)');
  });
});

describe('analyzeSelectors', () => {
  it('最大の詳細度が勝つ', () => {
    const r = analyzeSelectors('p\n#a\n.b');
    expect(r.winnerIndex).toBe(1);
    expect(r.tie).toBe(false);
  });

  it('同点は後勝ち', () => {
    const r = analyzeSelectors('.a\n.b\np');
    expect(r.winnerIndex).toBe(1);
    expect(r.tie).toBe(true);
  });

  it('空行は飛ばし行番号は元のまま', () => {
    const r = analyzeSelectors('a\n\n\r\n.b');
    expect(r.rows.map((x) => x.line)).toEqual([1, 4]);
  });

  it('CR単独の改行も行として扱う', () => {
    const r = analyzeSelectors('.a\r.b\r#c');
    expect(r.rows.map((x) => x.line)).toEqual([1, 2, 3]);
    expect(r.winnerIndex).toBe(2);
  });

  it('不正行は勝者にならない', () => {
    const r = analyzeSelectors('#a\n#b[\n.c');
    expect(r.rows[1].result.ok).toBe(false);
    expect(r.winnerIndex).toBe(0);
  });

  it('有効な行が無いと勝者なし', () => {
    expect(analyzeSelectors('').winnerIndex).toBeNull();
    expect(analyzeSelectors('[').winnerIndex).toBeNull();
  });

  it('親セレクタで & を解決', () => {
    const r = analyzeSelectors('& .x', '#app');
    const row = r.rows[0].result;
    expect(row.ok && row.spec).toEqual([1, 1, 0]);
  });

  it('親セレクタが不正ならエラーを返す', () => {
    expect(analyzeSelectors('& a', '[').parentError?.code).toBe(
      'unclosedBracket',
    );
  });
});

describe('全角スペース区切り', () => {
  it('全角スペースは子孫結合子として扱う', () => {
    expect(calculateSpecificity('ul　li')).toEqual(
      calculateSpecificity('ul li'),
    );
  });
});

describe('数字始まりの識別子', () => {
  it('#1 や .1a は無効なセレクタとしてエラーになる', () => {
    expect(calculateSpecificity('#1').ok).toBe(false);
    expect(calculateSpecificity('.1a').ok).toBe(false);
    expect(calculateSpecificity('.a1').ok).toBe(true);
  });
});
