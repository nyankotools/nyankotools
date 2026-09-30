import { describe, expect, it } from 'vitest';
import { convert } from './toml-converter';

describe('convert: TOML → JSON', () => {
  it('シンプルなキーと値をJSONに変換する', () => {
    const result = convert('toml', 'json', 'name = "Taro"\nage = 30');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual({ name: 'Taro', age: 30 });
    }
  });

  it('テーブルと配列を変換する', () => {
    const toml = [
      'name = "Taro"',
      'hobbies = ["reading", "coding"]',
      '',
      '[address]',
      'city = "Tokyo"',
    ].join('\n');
    const result = convert('toml', 'json', toml);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual({
        name: 'Taro',
        hobbies: ['reading', 'coding'],
        address: { city: 'Tokyo' },
      });
    }
  });

  it('インデント幅を指定できる', () => {
    const result = convert('toml', 'json', 'key = "value"', 4);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('{\n    "key": "value"\n}');
    }
  });

  it('不正なTOMLはエラーを返す', () => {
    const result = convert('toml', 'json', 'key = ');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });
});

describe('convert: JSON → TOML', () => {
  it('シンプルなJSONをTOMLに変換する', () => {
    const result = convert('json', 'toml', '{"name":"Taro","age":30}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name = "Taro"\nage = 30\n');
    }
  });

  it('ネストしたオブジェクトはテーブルとして出力する', () => {
    const result = convert(
      'json',
      'toml',
      '{"name":"Taro","address":{"city":"Tokyo"}}',
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(
        'name = "Taro"\n\n[address]\ncity = "Tokyo"\n',
      );
    }
  });

  it('トップレベルが配列や文字列の場合はエラーを返す', () => {
    const result = convert('json', 'toml', '[1, 2, 3]');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('toml-top-level');
    }
  });

  it('不正なJSONはエラーを返す', () => {
    const result = convert('json', 'toml', '{invalid}');
    expect(result.success).toBe(false);
  });
});

describe('convert: TOML → YAML / YAML → TOML', () => {
  it('TOMLをYAMLに変換する', () => {
    const result = convert('toml', 'yaml', 'name = "Taro"\nage = 30');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name: Taro\nage: 30\n');
    }
  });

  it('YAMLをTOMLに変換する', () => {
    const result = convert('yaml', 'toml', 'name: Taro\nage: 30\n');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name = "Taro"\nage = 30\n');
    }
  });

  it('不正なYAMLはエラーを返す', () => {
    const result = convert('yaml', 'toml', 'key: value\n  bad: indent');
    expect(result.success).toBe(false);
  });
});

describe('同一フォーマット変換（整形）', () => {
  it('TOML→TOMLで整形し直す', () => {
    const result = convert('toml', 'toml', 'name    =    "Taro"');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name = "Taro"\n');
    }
  });
});

describe('往復変換', () => {
  it('TOML→JSON→TOMLで同じ構造に戻る', () => {
    const original = 'name = "Taro"\nhobbies = ["reading", "coding"]\n';
    const json = convert('toml', 'json', original);
    expect(json.success).toBe(true);
    if (!json.success) return;
    const toml = convert('json', 'toml', json.output);
    expect(toml.success).toBe(true);
    if (!toml.success) return;
    expect(toml.output).toBe(
      'name = "Taro"\nhobbies = [ "reading", "coding" ]\n',
    );
  });
});

describe('境界値', () => {
  it('空文字列のTOMLは空オブジェクトのJSONに変換される', () => {
    const result = convert('toml', 'json', '');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('{}');
    }
  });

  it('空文字列のYAMLはnullになり、TOMLへの変換はエラーになる', () => {
    const result = convert('yaml', 'toml', '');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('toml-top-level');
    }
  });

  it('空白のみのJSONはパースエラーになる', () => {
    const result = convert('json', 'toml', '   ');
    expect(result.success).toBe(false);
  });
});

describe('同一フォーマット変換（YAML/JSON）', () => {
  it('YAML→YAMLで整形し直す', () => {
    const result = convert('yaml', 'yaml', 'name:    Taro\nage:   30');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name: Taro\nage: 30\n');
    }
  });

  it('JSON→JSONでインデントを整形し直す', () => {
    const result = convert('json', 'json', '{"name":"Taro","age":30}', 4);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('{\n    "name": "Taro",\n    "age": 30\n}');
    }
  });
});

describe('マルチバイト文字', () => {
  it('日本語や絵文字を含む値をTOML→JSONに変換できる', () => {
    const result = convert('toml', 'json', '"名前" = "太郎"\nemoji = "🐱🐶"');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual({
        名前: '太郎',
        emoji: '🐱🐶',
      });
    }
  });

  it('日本語キーを含むJSONをTOMLに変換できる（キーは引用符付きで出力される）', () => {
    const result = convert('json', 'toml', '{"名前":"太郎"}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('"名前" = "太郎"\n');
    }
  });

  it('引用符なしの全角キーはTOMLとして不正な形式でエラーになる', () => {
    const result = convert('toml', 'json', '名前 = "太郎"');
    expect(result.success).toBe(false);
  });

  it('CRLF改行のTOML/YAML入力も正しく変換できる', () => {
    const tomlResult = convert('toml', 'json', 'a = 1\r\nb = 2\r\n');
    expect(tomlResult.success).toBe(true);
    if (tomlResult.success) {
      expect(JSON.parse(tomlResult.output)).toEqual({ a: 1, b: 2 });
    }

    const yamlResult = convert('yaml', 'json', 'a: 1\r\nb: 2\r\n');
    expect(yamlResult.success).toBe(true);
    if (yamlResult.success) {
      expect(JSON.parse(yamlResult.output)).toEqual({ a: 1, b: 2 });
    }
  });
});

describe('特殊な値・データ構造', () => {
  it('nullを含むオブジェクトをTOMLに変換すると、そのフィールドは除外される', () => {
    const result = convert('json', 'toml', '{"a":null,"b":1}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('b = 1\n');
    }
  });

  it('TOMLのnan/infはJSON変換時にnullになる（JSON仕様の制約）', () => {
    const result = convert('toml', 'json', 'a = nan\nb = inf\nc = -inf');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual({ a: null, b: null, c: null });
    }
  });

  it('精度を失う巨大な整数を含むTOMLはエラーになる', () => {
    const result = convert('toml', 'json', 'a = 9223372036854775807');
    expect(result.success).toBe(false);
  });

  it('配列のテーブル（array of tables）を含むJSONをTOMLに変換できる', () => {
    const result = convert(
      'json',
      'toml',
      '{"fruit":[{"name":"apple"},{"name":"banana"}]}',
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(
        '[[fruit]]\nname = "apple"\n\n[[fruit]]\nname = "banana"\n',
      );
    }
  });

  it('トップレベルが文字列のYAMLをTOMLに変換するとエラーになる', () => {
    const result = convert('yaml', 'toml', 'just a plain string');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('toml-top-level');
    }
  });

  it('インデント幅の指定はYAML出力にも反映される', () => {
    const result = convert('json', 'yaml', '{"address":{"city":"Tokyo"}}', 4);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('address:\n    city: Tokyo\n');
    }
  });
});
