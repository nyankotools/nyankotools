import { describe, expect, it } from 'vitest';
import { csvToJson, jsonToCsv } from './csv-json-converter';

describe('csvToJson', () => {
  it('1列CSVの "" （引用符つき空値）の行は読み飛ばさずレコードにする', () => {
    for (const input of ['name\nA\n""\nB', 'name\nA\n""\nB\n']) {
      const result = csvToJson(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(JSON.parse(result.output)).toEqual([
          { name: 'A' },
          { name: '' },
          { name: 'B' },
        ]);
      }
    }
  });

  it('末尾が改行なしの "" 行もレコードにする', () => {
    const result = csvToJson('name\nA\n""');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([{ name: 'A' }, { name: '' }]);
    }
  });

  it('引用符なしの空行は1列CSVでも従来どおり無視する', () => {
    const result = csvToJson('name\nA\n\nB\n\n');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([{ name: 'A' }, { name: 'B' }]);
    }
  });

  it('末尾や途中の空行は読み飛ばす', () => {
    const result = csvToJson('a,b\n1,2\n\n3,4\n\n');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([
        { a: '1', b: '2' },
        { a: '3', b: '4' },
      ]);
    }
  });

  it('空行を挟んだあとの列数不一致でも、元の行番号を報告する', () => {
    const result = csvToJson('a,b\n\n1');
    expect(result.success).toBe(false);
    if (!result.success && result.reason === 'column-mismatch') {
      expect(result.line).toBe(3);
    }
  });

  it('ヘッダーが __proto__ の列も出力から消えない', () => {
    const result = csvToJson('__proto__,b\n1,2');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toContain('"__proto__": "1"');
    }
  });

  it('シンプルなCSVをJSONに変換する', () => {
    const result = csvToJson('name,age\nTaro,30\nHanako,25');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([
        { name: 'Taro', age: '30' },
        { name: 'Hanako', age: '25' },
      ]);
    }
  });

  it('引用符で囲まれたカンマ・改行・エスケープされた引用符を扱える', () => {
    const csv = 'name,note\n"Taro","hello, ""world""\nnew line"';
    const result = csvToJson(csv);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([
        { name: 'Taro', note: 'hello, "world"\nnew line' },
      ]);
    }
  });

  it('タブ区切りを指定できる', () => {
    const result = csvToJson('name\tage\nTaro\t30', '\t');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([{ name: 'Taro', age: '30' }]);
    }
  });

  it('ヘッダーのみの場合は空配列を返す', () => {
    const result = csvToJson('name,age');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual([]);
    }
  });

  it('列数がヘッダーと一致しない行はエラー情報を返す', () => {
    const result = csvToJson('name,age\nTaro,30,extra');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('column-mismatch');
      if (result.reason === 'column-mismatch') {
        expect(result.line).toBe(2);
        expect(result.expectedColumns).toBe(2);
        expect(result.actualColumns).toBe(3);
      }
    }
  });

  it('引用符が閉じられていない場合はエラーを返す', () => {
    const result = csvToJson('name\n"Taro');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('unterminated-quote');
    }
  });
});

describe('jsonToCsv', () => {
  it('シンプルなJSON配列をCSVに変換する', () => {
    const result = jsonToCsv('[{"name":"Taro","age":30}]');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name,age\nTaro,30\n');
    }
  });

  it('オブジェクト間でキーが異なる場合は列を統合する', () => {
    const result = jsonToCsv('[{"a":1},{"a":2,"b":3}]');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('a,b\n1,\n2,3\n');
    }
  });

  it('カンマ・改行・引用符を含む値はダブルクォートでエスケープする', () => {
    const result = jsonToCsv('[{"note":"a,b\\n\\"c\\""}]');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('note\n"a,b\n""c"""\n');
    }
  });

  it('空配列は空文字列を返す', () => {
    const result = jsonToCsv('[]');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('');
    }
  });

  it('配列でないJSONはエラーを返す', () => {
    const result = jsonToCsv('{"a":1}');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('not-array');
    }
  });

  it('配列の要素がオブジェクトでない場合はエラーを返す', () => {
    const result = jsonToCsv('[1, 2]');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('not-object');
      if (result.reason === 'not-object') {
        expect(result.index).toBe(0);
      }
    }
  });

  it('不正なJSONはエラーを返す', () => {
    const result = jsonToCsv('{invalid}');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('invalid-json');
    }
  });
});

describe('往復変換', () => {
  it('CSV→JSON→CSVで同じ内容に戻る', () => {
    const original = 'name,age\nTaro,30\nHanako,25\n';
    const json = csvToJson(original);
    expect(json.success).toBe(true);
    if (!json.success) return;
    const csv = jsonToCsv(json.output);
    expect(csv.success).toBe(true);
    if (!csv.success) return;
    expect(csv.output).toBe(original);
  });
});
