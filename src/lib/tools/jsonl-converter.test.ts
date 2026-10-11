import { describe, expect, it } from 'vitest';
import {
  csvToJsonl,
  jsonlToCsv,
  jsonlToJson,
  jsonToJsonl,
} from './jsonl-converter';

function ok(result: { success: boolean; output?: string }): string {
  expect(result.success).toBe(true);
  return result.output ?? '';
}

describe('jsonlToJson', () => {
  it('各行をJSON配列にまとめる', () => {
    const output = ok(jsonlToJson('{"a":1}\n{"a":2}\n'));
    expect(JSON.parse(output)).toEqual([{ a: 1 }, { a: 2 }]);
  });

  it('空行・CRLF・BOMを許容する', () => {
    const output = ok(jsonlToJson('﻿{"a":1}\r\n\r\n{"a":2}\r\n'));
    expect(JSON.parse(output)).toEqual([{ a: 1 }, { a: 2 }]);
  });

  it('オブジェクト以外の値も行として扱える', () => {
    const output = ok(jsonlToJson('1\n"x"\n[1,2]\nnull'));
    expect(JSON.parse(output)).toEqual([1, 'x', [1, 2], null]);
  });

  it('空入力は [] になる', () => {
    expect(ok(jsonlToJson('\n\n'))).toBe('[]');
  });

  it('不正な行は元の行番号つきで失敗する', () => {
    const result = jsonlToJson('{"a":1}\n\n{oops}\n');
    expect(result).toMatchObject({
      success: false,
      reason: 'invalid-line',
      line: 3,
    });
  });

  it('空白だけの行は読み飛ばし、行頭・行末の空白は許容する', () => {
    const output = ok(jsonlToJson('{"a":1}\n   \t \n  {"a":2}  \n'));
    expect(JSON.parse(output)).toEqual([{ a: 1 }, { a: 2 }]);
  });

  it('行末のカンマなど余計な記号は invalid-line になる', () => {
    expect(jsonlToJson('{"a":1},\n{"a":2}')).toMatchObject({
      success: false,
      reason: 'invalid-line',
      line: 1,
    });
  });

  it('複数の不正行があっても最初の不正行の行番号を返す', () => {
    expect(jsonlToJson('{"a":1}\nx\ny')).toMatchObject({
      success: false,
      reason: 'invalid-line',
      line: 2,
    });
  });

  it('日本語・絵文字・サロゲートペアを壊さない', () => {
    const output = ok(jsonlToJson('{"t":"あ😀𠮷"}'));
    expect(JSON.parse(output)).toEqual([{ t: 'あ😀𠮷' }]);
  });

  it('1万行の大量データでも行数どおりに変換される', () => {
    const input = Array.from({ length: 10000 }, (_, i) => `{"id":${i}}`).join(
      '\n',
    );
    const parsed = JSON.parse(ok(jsonlToJson(input)));
    expect(parsed).toHaveLength(10000);
    expect(parsed[9999]).toEqual({ id: 9999 });
  });
});

describe('jsonToJsonl', () => {
  it('配列を1要素1行にする', () => {
    expect(ok(jsonToJsonl('[{"a": 1}, {"a": 2}]'))).toBe('{"a":1}\n{"a":2}\n');
  });

  it('空配列は空文字になる', () => {
    expect(ok(jsonToJsonl('[]'))).toBe('');
  });

  it('配列以外は not-array', () => {
    expect(jsonToJsonl('{"a":1}')).toMatchObject({
      success: false,
      reason: 'not-array',
    });
  });

  it('null や数値も not-array', () => {
    expect(jsonToJsonl('null')).toMatchObject({ reason: 'not-array' });
    expect(jsonToJsonl('42')).toMatchObject({ reason: 'not-array' });
  });

  it('不正なJSONは invalid-json', () => {
    expect(jsonToJsonl('[1,')).toMatchObject({
      success: false,
      reason: 'invalid-json',
    });
  });

  it('空白だけの入力は invalid-json', () => {
    expect(jsonToJsonl('   ')).toMatchObject({
      success: false,
      reason: 'invalid-json',
    });
  });

  it('日本語や改行を含む文字列は1行に収まる', () => {
    const output = ok(jsonToJsonl('[{"t":"あ\\nい"}]'));
    expect(output).toBe('{"t":"あ\\nい"}\n');
  });

  it('ネストしたオブジェクトや配列も1行に収まる', () => {
    expect(ok(jsonToJsonl('[{"a":{"b":[1,2]}}]'))).toBe('{"a":{"b":[1,2]}}\n');
  });

  it('要素が数値・文字列・nullでも1要素1行で出力する', () => {
    expect(ok(jsonToJsonl('[1,"x",null]'))).toBe('1\n"x"\nnull\n');
  });

  it('絵文字・サロゲートペアの値をそのまま出力する', () => {
    expect(ok(jsonToJsonl('["😀𠮷"]'))).toBe('"😀𠮷"\n');
  });

  it('17桁以上の整数は精度が落ちる（注意事項どおり）', () => {
    expect(ok(jsonToJsonl('[{"id":12345678901234567890}]'))).toBe(
      '{"id":12345678901234567000}\n',
    );
  });
});

describe('jsonlToCsv', () => {
  it('キーの和集合をヘッダーにする', () => {
    const output = ok(jsonlToCsv('{"a":1,"b":2}\n{"a":3,"c":4}'));
    expect(output).toBe('a,b,c\n1,2,\n3,,4\n');
  });

  it('タブ区切りにできる', () => {
    expect(ok(jsonlToCsv('{"a":1,"b":2}', '\t'))).toBe('a\tb\n1\t2\n');
  });

  it('オブジェクト以外の行は行番号つきで失敗する', () => {
    expect(jsonlToCsv('{"a":1}\n\n[1]')).toMatchObject({
      success: false,
      reason: 'not-object-line',
      line: 3,
    });
  });

  it('文字列行・null行も not-object-line になる', () => {
    expect(jsonlToCsv('{"a":1}\n"x"')).toMatchObject({
      reason: 'not-object-line',
      line: 2,
    });
    expect(jsonlToCsv('null')).toMatchObject({
      reason: 'not-object-line',
      line: 1,
    });
  });

  it('不正な行は invalid-line', () => {
    expect(jsonlToCsv('{"a":1}\nx')).toMatchObject({
      success: false,
      reason: 'invalid-line',
      line: 2,
    });
  });

  it('空入力は空文字', () => {
    expect(ok(jsonlToCsv(''))).toBe('');
  });

  it('キーを持たないオブジェクトだけの入力は空文字', () => {
    expect(ok(jsonlToCsv('{}\n{}'))).toBe('');
  });

  it('カンマ・引用符・改行を含む値はCSVとしてエスケープされる', () => {
    const input = [
      JSON.stringify({ a: 'x,y' }),
      JSON.stringify({ a: 'say "hi"\nbye' }),
    ].join('\n');
    expect(ok(jsonlToCsv(input))).toBe('a\n"x,y"\n"say ""hi""\nbye"\n');
  });

  it('ネストした値はJSON文字列としてセルに入る', () => {
    expect(ok(jsonlToCsv('{"a":{"b":1}}'))).toBe('a\n"{""b"":1}"\n');
  });

  it('タブ区切りの場合、カンマを含む値は引用符なしで出る', () => {
    expect(ok(jsonlToCsv('{"a":"x,y"}', '\t'))).toBe('a\nx,y\n');
  });

  it('日本語のキー・絵文字の値を正しく出力する', () => {
    expect(ok(jsonlToCsv('{"名前":"太郎😀"}'))).toBe('名前\n太郎😀\n');
  });

  it('CRLFの入力も読める', () => {
    expect(ok(jsonlToCsv('{"a":1}\r\n{"a":2}\r\n'))).toBe('a\n1\n2\n');
  });

  it('大量行でも行数どおりCSVになる', () => {
    const input = Array.from({ length: 5000 }, (_, i) =>
      JSON.stringify({ id: i }),
    ).join('\n');
    const lines = ok(jsonlToCsv(input)).trimEnd().split('\n');
    expect(lines).toHaveLength(5001);
    expect(lines[5000]).toBe('4999');
  });
});

describe('csvToJsonl', () => {
  it('ヘッダーをキーにして1行ずつJSONにする（値は文字列）', () => {
    expect(ok(csvToJsonl('name,age\nTaro,30\nHanako,25'))).toBe(
      '{"name":"Taro","age":"30"}\n{"name":"Hanako","age":"25"}\n',
    );
  });

  it('列数の不一致はCSV側のエラーをそのまま返す', () => {
    expect(csvToJsonl('a,b\n1')).toMatchObject({
      success: false,
      reason: 'column-mismatch',
      line: 2,
    });
  });

  it('ヘッダーのみなら空文字', () => {
    expect(ok(csvToJsonl('a,b\n'))).toBe('');
  });

  it('先頭のUTF-8 BOMはヘッダーのキーに残さない', () => {
    expect(ok(csvToJsonl('﻿a,b\n1,2'))).toBe('{"a":"1","b":"2"}\n');
  });

  it('__proto__ 列も失われない', () => {
    const output = ok(csvToJsonl('__proto__,x\n1,2'));
    expect(output).toContain('"__proto__":"1"');
  });

  it('空入力は空文字', () => {
    expect(ok(csvToJsonl(''))).toBe('');
  });

  it('CRLFの改行を扱える', () => {
    expect(ok(csvToJsonl('a,b\r\n1,2\r\n'))).toBe('{"a":"1","b":"2"}\n');
  });

  it('引用符内のカンマ・改行・エスケープされた引用符を正しく扱う', () => {
    expect(ok(csvToJsonl('a,b\n"x,y","line1\nline2 ""q"""'))).toBe(
      '{"a":"x,y","b":"line1\\nline2 \\"q\\""}\n',
    );
  });

  it('引用符が閉じられていなければ unterminated-quote', () => {
    expect(csvToJsonl('a,b\n"x,1')).toMatchObject({
      success: false,
      reason: 'unterminated-quote',
    });
  });

  it('空行を挟んでも列数エラーの行番号は元の位置を指す', () => {
    expect(csvToJsonl('a,b\n\n1')).toMatchObject({
      success: false,
      reason: 'column-mismatch',
      line: 3,
    });
  });

  it('タブ区切りで変換できる', () => {
    expect(ok(csvToJsonl('name\tage\nTaro\t30', '\t'))).toBe(
      '{"name":"Taro","age":"30"}\n',
    );
  });

  it('日本語ヘッダー・絵文字の値を正しく扱う', () => {
    expect(ok(csvToJsonl('名前,絵文字\n太郎,😀'))).toBe(
      '{"名前":"太郎","絵文字":"😀"}\n',
    );
  });

  it('数値や真偽値も文字列として出力される', () => {
    expect(ok(csvToJsonl('n,b\n1,true'))).toBe('{"n":"1","b":"true"}\n');
  });

  it('空のセルは空文字になる', () => {
    expect(ok(csvToJsonl('a,b\n,'))).toBe('{"a":"","b":""}\n');
  });

  it('1列だけの "" 空値行は残る', () => {
    expect(ok(csvToJsonl('a\n""\nx'))).toBe('{"a":""}\n{"a":"x"}\n');
  });

  it('大量行でも行数どおりJSONLになる', () => {
    const input = 'id\n' + Array.from({ length: 5000 }, (_, i) => i).join('\n');
    const lines = ok(csvToJsonl(input)).trimEnd().split('\n');
    expect(lines).toHaveLength(5000);
    expect(lines[4999]).toBe('{"id":"4999"}');
  });
});
