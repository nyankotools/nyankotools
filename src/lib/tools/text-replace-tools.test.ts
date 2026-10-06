import { describe, expect, it } from 'vitest';
import { applyLineOperation, type LineOperation } from './text-replace-tools';

function run(text: string, op: LineOperation) {
  const result = applyLineOperation(text, op);
  if (!result.success) throw new Error(result.error);
  return result;
}

const replaceOp = (
  find: string,
  replace: string,
  extra: { regex?: boolean; ignoreCase?: boolean } = {},
): LineOperation => ({
  type: 'replace',
  find,
  replace,
  regex: extra.regex ?? false,
  ignoreCase: extra.ignoreCase ?? false,
});

describe('replace', () => {
  it('文字列をすべて置換し件数を返す', () => {
    expect(run('a-b-c', replaceOp('-', '+'))).toEqual({
      success: true,
      output: 'a+b+c',
      count: 2,
    });
  });

  it('通常モードでは正規表現の特殊文字・$ を文字として扱う', () => {
    const r = run('1.5 (x)', replaceOp('(x)', '$&'));
    expect(r.output).toBe('1.5 $&');
    expect(run('a.b', replaceOp('.', '!')).output).toBe('a!b');
  });

  it('大文字小文字を区別しない指定ができる', () => {
    expect(run('Abc aBC', replaceOp('abc', 'x', { ignoreCase: true }))).toEqual(
      { success: true, output: 'x x', count: 2 },
    );
    expect(run('Abc', replaceOp('abc', 'x')).count).toBe(0);
  });

  it('正規表現モードでキャプチャ参照が使え、^ $ は行単位', () => {
    expect(
      run('a=1\nb=2', replaceOp('(\\w)=(\\d)', '$2:$1', { regex: true }))
        .output,
    ).toBe('1:a\n2:b');
    expect(run('a\nb', replaceOp('^', '> ', { regex: true })).output).toBe(
      '> a\n> b',
    );
  });

  it('不正な正規表現はエラーになる', () => {
    expect(
      applyLineOperation('a', replaceOp('(', '', { regex: true })),
    ).toEqual({ success: false, error: 'invalidRegex' });
  });

  it('検索文字列が空なら何もしない', () => {
    expect(run('abc', replaceOp('', 'x'))).toEqual({
      success: true,
      output: 'abc',
      count: 0,
    });
  });

  it('入力の改行コードを保つ', () => {
    expect(run('a\r\nb', replaceOp('a', 'x')).output).toBe('x\r\nb');
  });
});

describe('extract', () => {
  const extract = (
    keyword: string,
    extra: { regex?: boolean; ignoreCase?: boolean; invert?: boolean } = {},
  ): LineOperation => ({
    type: 'extract',
    keyword,
    regex: extra.regex ?? false,
    ignoreCase: extra.ignoreCase ?? false,
    invert: extra.invert ?? false,
  });

  it('キーワードを含む行だけを残す', () => {
    expect(run('apple\nbanana\npineapple', extract('apple'))).toEqual({
      success: true,
      output: 'apple\npineapple',
      count: 2,
    });
  });

  it('反転すると含む行を取り除く', () => {
    expect(run('a1\nb\nc1', extract('1', { invert: true })).output).toBe('b');
  });

  it('正規表現・大文字小文字無視に対応する', () => {
    expect(
      run(
        'ID-1\nid-x\nzz',
        extract('^id-\\d', { regex: true, ignoreCase: true }),
      ).output,
    ).toBe('ID-1');
  });

  it('g フラグの lastIndex の影響を受けない（連続行で判定がぶれない）', () => {
    expect(run('a\na\na', extract('a', { regex: true })).count).toBe(3);
  });

  it('不正な正規表現はエラー、キーワードが空なら全行を残す', () => {
    expect(applyLineOperation('a', extract('[', { regex: true }))).toEqual({
      success: false,
      error: 'invalidRegex',
    });
    expect(run('a\nb', extract('')).output).toBe('a\nb');
  });

  it('末尾の改行を保つ。結果が空なら改行も付けない', () => {
    expect(run('a\nb\n', extract('a')).output).toBe('a\n');
    expect(run('a\nb\n', extract('zzz')).output).toBe('');
  });
});

describe('affix', () => {
  const affix = (prefix: string, suffix: string, skipEmpty = false) =>
    ({ type: 'affix', prefix, suffix, skipEmpty }) as const;

  it('各行の前後に文字を追加する', () => {
    expect(run('a\nb', affix('"', '",'))).toEqual({
      success: true,
      output: '"a",\n"b",',
      count: 2,
    });
  });

  it('空行を除外できる。末尾の改行行には付けない', () => {
    expect(run('a\n\nb\n', affix('- ', '')).output).toBe('- a\n- \n- b\n');
    expect(run('a\n\nb\n', affix('- ', '', true)).output).toBe('- a\n\n- b\n');
  });

  it('CRLF 入力は LF で出力する', () => {
    expect(run('a\r\nb', affix('>', '')).output).toBe('>a\n>b');
  });
});

describe('numberAdd', () => {
  const add = (
    extra: Partial<Extract<LineOperation, { type: 'numberAdd' }>> = {},
  ): LineOperation => ({
    type: 'numberAdd',
    start: 1,
    step: 1,
    separator: '. ',
    zeroPad: false,
    skipEmpty: false,
    ...extra,
  });

  it('連番を付ける', () => {
    expect(run('a\nb\nc', add()).output).toBe('1. a\n2. b\n3. c');
  });

  it('開始値・増分・区切りを指定できる', () => {
    expect(
      run('a\nb', add({ start: 10, step: 5, separator: ': ' })).output,
    ).toBe('10: a\n15: b');
  });

  it('ゼロ埋めは最大桁数にそろえる', () => {
    const text = Array.from({ length: 10 }, (_, i) => `l${i}`).join('\n');
    const lines = run(text, add({ zeroPad: true })).output.split('\n');
    expect(lines[0]).toBe('01. l0');
    expect(lines[9]).toBe('10. l9');
  });

  it('空行を飛ばすと番号も進まない', () => {
    expect(run('a\n\nb', add({ skipEmpty: true })).output).toBe('1. a\n\n2. b');
  });

  it('負の増分・不正な数値を扱える', () => {
    expect(run('a\nb', add({ start: 1, step: -1 })).output).toBe('1. a\n0. b');
    expect(run('a', add({ start: Number.NaN })).output).toBe('1. a');
  });

  it('空入力は空のまま', () => {
    expect(run('', add())).toEqual({ success: true, output: '', count: 0 });
  });
});

describe('numberRemove', () => {
  const remove: LineOperation = { type: 'numberRemove' };

  it('さまざまな形式の行番号を取り除く', () => {
    const text = '1. a\n2) b\n3: c\n４、d\n5 e\n  6\tf';
    expect(run(text, remove)).toEqual({
      success: true,
      output: 'a\nb\nc\nd\ne\nf',
      count: 6,
    });
  });

  it('番号でない行・数字で始まる単語は変えない', () => {
    expect(run('2024年\n3rd\nabc', remove)).toEqual({
      success: true,
      output: '2024年\n3rd\nabc',
      count: 0,
    });
  });
});

describe('reverse', () => {
  it('行の順序を逆にする。末尾の改行は末尾に残す', () => {
    expect(run('a\nb\nc', { type: 'reverse' }).output).toBe('c\nb\na');
    expect(run('a\nb\n', { type: 'reverse' }).output).toBe('b\na\n');
  });
});
