import { describe, expect, it } from 'vitest';
import {
  convertDelimited,
  unescapeDelimiter,
  type DelimiterOptions,
} from './delimiter-converter';

const base: DelimiterOptions = {
  inputDelimiter: 'newline',
  inputCustom: '',
  outputDelimiter: 'comma',
  outputCustom: '',
  trim: false,
  removeEmpty: false,
  dedupe: false,
  stripQuotes: false,
  quote: 'none',
};

function run(text: string, o: Partial<DelimiterOptions> = {}) {
  return convertDelimited(text, { ...base, ...o });
}

describe('convertDelimited', () => {
  it('改行をカンマに変換できる', () => {
    expect(run('a\nb\nc').output).toBe('a,b,c');
  });

  it('CRLF・CRの改行も区切りとして扱う', () => {
    expect(run('a\r\nb\rc').items).toEqual(['a', 'b', 'c']);
  });

  it('カンマを改行に変換できる', () => {
    expect(
      run('a,b,c', { inputDelimiter: 'comma', outputDelimiter: 'newline' })
        .output,
    ).toBe('a\nb\nc');
  });

  it('タブ・セミコロン・パイプで相互変換できる', () => {
    expect(
      run('a\tb', { inputDelimiter: 'tab', outputDelimiter: 'semicolon' })
        .output,
    ).toBe('a;b');
    expect(
      run('a;b', { inputDelimiter: 'semicolon', outputDelimiter: 'pipe' })
        .output,
    ).toBe('a|b');
  });

  it('カンマ+スペースで出力できる', () => {
    expect(run('a\nb', { outputDelimiter: 'commaSpace' }).output).toBe('a, b');
  });

  it('スペース区切りは連続・全角スペースを1つの区切りとして扱う', () => {
    expect(run('a  b　c', { inputDelimiter: 'space' }).items).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('任意文字列の区切りを指定できる', () => {
    expect(
      run('a<>b<>c', { inputDelimiter: 'custom', inputCustom: '<>' }).items,
    ).toEqual(['a', 'b', 'c']);
    expect(
      run('a\nb', { outputDelimiter: 'custom', outputCustom: ' / ' }).output,
    ).toBe('a / b');
  });

  it('カスタム区切りの \\n と \\t をエスケープとして解釈する', () => {
    expect(unescapeDelimiter('\\n\\t\\\\')).toBe('\n\t\\');
    expect(
      run('a,b', {
        inputDelimiter: 'comma',
        outputDelimiter: 'custom',
        outputCustom: '\\n',
      }).output,
    ).toBe('a\nb');
  });

  it('カスタム区切りが空なら分割しない', () => {
    expect(
      run('a,b', { inputDelimiter: 'custom', inputCustom: '' }).items,
    ).toEqual(['a,b']);
  });

  it('空入力は空の結果になる', () => {
    expect(run('')).toEqual({ items: [], output: '' });
  });

  it('前後の空白削除と空要素除去ができる', () => {
    const r = run(' a , ,b,, c ', {
      inputDelimiter: 'comma',
      trim: true,
      removeEmpty: true,
    });
    expect(r.items).toEqual(['a', 'b', 'c']);
    expect(r.output).toBe('a,b,c');
  });

  it('trim なしでは空白だけの要素は空要素除去されない', () => {
    expect(run('a\n \nb', { removeEmpty: true }).items).toEqual([
      'a',
      ' ',
      'b',
    ]);
  });

  it('重複を除去し先に出現したものを残す', () => {
    expect(run('b\na\nb\nc\na', { dedupe: true }).items).toEqual([
      'b',
      'a',
      'c',
    ]);
  });

  it('引用符を付与できる', () => {
    expect(run('a\nb', { quote: 'double' }).output).toBe('"a","b"');
    expect(run('a\nb', { quote: 'single' }).output).toBe("'a','b'");
    expect(run('a\nb', { quote: 'backtick' }).output).toBe('`a`,`b`');
  });

  it('項目内の同じ引用符は二重化される', () => {
    expect(run('say "hi"', { quote: 'double' }).output).toBe('"say ""hi"""');
    expect(run("it's", { quote: 'single' }).output).toBe("'it''s'");
  });

  it('入力の引用符を外せる', () => {
    expect(
      run('"a", \'b\' ,`c`,d', {
        inputDelimiter: 'comma',
        trim: true,
        stripQuotes: true,
      }).items,
    ).toEqual(['a', 'b', 'c', 'd']);
  });

  it('引用符を外して付け直せる（二重化は元に戻る）', () => {
    expect(
      run('"say ""hi"""', {
        inputDelimiter: 'semicolon',
        stripQuotes: true,
        quote: 'single',
      }).output,
    ).toBe('\'say "hi"\'');
  });

  it('片側だけの引用符や1文字の引用符は外さない', () => {
    expect(run('"a\n"\n\'b"', { stripQuotes: true }).items).toEqual([
      '"a',
      '"',
      '\'b"',
    ]);
  });

  it('末尾の改行は空要素になり、空要素除去で消える', () => {
    expect(run('a\nb\n').items).toEqual(['a', 'b', '']);
    expect(run('a\nb\n', { removeEmpty: true }).items).toEqual(['a', 'b']);
  });

  it('空要素除去の後に引用符を付けるため、空要素は引用符だけにならない', () => {
    expect(run('a\n\nb', { removeEmpty: true, quote: 'double' }).output).toBe(
      '"a","b"',
    );
  });
});

describe('境界・多バイト文字（追加）', () => {
  it('スペース区切りは前後の空白で空要素を作る（空要素除去で消える）', () => {
    expect(run(' a b ', { inputDelimiter: 'space' }).items).toEqual([
      '',
      'a',
      'b',
      '',
    ]);
    expect(
      run(' a b ', { inputDelimiter: 'space', removeEmpty: true }).items,
    ).toEqual(['a', 'b']);
  });

  it('日本語・絵文字（サロゲートペア）の項目を壊さず、引用符で囲める', () => {
    expect(run('日本語\n😀\nあ,い', { quote: 'double' }).output).toBe(
      '"日本語","😀","あ,い"',
    );
  });

  it('出力の CRLF 区切りは改行 \n のエスケープで指定できる（\r\n は \r と \n）', () => {
    expect(
      run('a,b', {
        inputDelimiter: 'comma',
        outputDelimiter: 'custom',
        outputCustom: '\r\n',
      }).output,
    ).toBe('a\r\nb');
  });

  it('大量の項目（10万件）も重複除去・結合が完了する', () => {
    const text = Array.from(
      { length: 100000 },
      (_, i) => `item${i % 5000}`,
    ).join('\n');
    const r = run(text, { dedupe: true, outputDelimiter: 'comma' });
    expect(r.items).toHaveLength(5000);
    expect(r.output.split(',')).toHaveLength(5000);
  });

  it('trim・引用符除去・空要素除去・重複除去の組み合わせ順が正しい', () => {
    expect(
      run('  "a" \n\n "a" \n \'\' \n b', {
        trim: true,
        stripQuotes: true,
        removeEmpty: true,
        dedupe: true,
      }).items,
    ).toEqual(['a', 'b']);
  });

  it('mixed 改行（LF・CR・CRLF）が混ざっても正しく分割する', () => {
    expect(run('a\nb\rc\r\nd').items).toEqual(['a', 'b', 'c', 'd']);
  });
});
