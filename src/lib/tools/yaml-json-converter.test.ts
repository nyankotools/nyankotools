import { describe, expect, it } from 'vitest';
import { yamlToJson, jsonToYaml } from './yaml-json-converter';

describe('yamlToJson', () => {
  it('シンプルなキーと値をJSONに変換する', () => {
    const result = yamlToJson('name: Taro\nage: 30');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual({ name: 'Taro', age: 30 });
    }
  });

  it('ネストしたオブジェクトと配列を変換する', () => {
    const yaml = ['name: Taro', 'hobbies:', '  - reading', '  - coding'].join(
      '\n',
    );
    const result = yamlToJson(yaml);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(JSON.parse(result.output)).toEqual({
        name: 'Taro',
        hobbies: ['reading', 'coding'],
      });
    }
  });

  it('インデント幅を指定できる', () => {
    const result = yamlToJson('key: value', 4);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('{\n    "key": "value"\n}');
    }
  });

  it('不正なYAMLはエラーを返す', () => {
    const result = yamlToJson('key: value\n  bad: indent');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });

  it('タブ文字を含むYAMLはエラーを返す', () => {
    const result = yamlToJson('key:\n\t- value');
    expect(result.success).toBe(false);
  });
});

describe('jsonToYaml', () => {
  it('シンプルなJSONをYAMLに変換する', () => {
    const result = jsonToYaml('{"name":"Taro","age":30}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe('name: Taro\nage: 30\n');
    }
  });

  it('ネストしたオブジェクトと配列を変換する', () => {
    const result = jsonToYaml('{"name":"Taro","hobbies":["reading","coding"]}');
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output).toBe(
        'name: Taro\nhobbies:\n  - reading\n  - coding\n',
      );
    }
  });

  it('不正なJSONはエラーを返す', () => {
    const result = jsonToYaml('{invalid}');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.message.length).toBeGreaterThan(0);
    }
  });
});

describe('往復変換', () => {
  it('YAML→JSON→YAMLで同じ構造に戻る', () => {
    const original = 'name: Taro\nhobbies:\n  - reading\n  - coding\n';
    const json = yamlToJson(original);
    expect(json.success).toBe(true);
    if (!json.success) return;
    const yaml = jsonToYaml(json.output);
    expect(yaml.success).toBe(true);
    if (!yaml.success) return;
    expect(yaml.output).toBe(original);
  });
});
