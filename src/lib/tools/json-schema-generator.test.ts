import { describe, it, expect } from 'vitest';
import { generateJsonSchema } from './json-schema-generator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gen(input: string, options = {}): Record<string, any> {
  const result = generateJsonSchema(input, options);
  if (!result.success) throw new Error(result.reason);
  return JSON.parse(result.schema);
}

describe('generateJsonSchema', () => {
  it('プリミティブ・ネスト・配列のスキーマを作る', () => {
    const s = gen(
      '{"id":1,"price":1.5,"name":"a","ok":true,"n":null,"t":[1,2]}',
    );
    expect(s.$schema).toBe('https://json-schema.org/draft/2020-12/schema');
    expect(s.type).toBe('object');
    expect(s.properties.id).toEqual({ type: 'integer' });
    expect(s.properties.price).toEqual({ type: 'number' });
    expect(s.properties.name).toEqual({ type: 'string' });
    expect(s.properties.ok).toEqual({ type: 'boolean' });
    expect(s.properties.n).toEqual({ type: 'null' });
    expect(s.properties.t).toEqual({
      type: 'array',
      items: { type: 'integer' },
    });
    expect(s.required).toEqual(['id', 'price', 'name', 'ok', 'n', 't']);
  });

  it('配列内のオブジェクトを統合し、欠けるキーは required から外す', () => {
    const s = gen('[{"a":1,"b":"x"},{"a":2}]');
    expect(s.type).toBe('array');
    expect(s.items.required).toEqual(['a']);
    expect(Object.keys(s.items.properties)).toEqual(['a', 'b']);
  });

  it('型が混在すると type が配列になり、integer と number は number にまとまる', () => {
    expect(gen('[1,"a",null]').items.type).toEqual([
      'null',
      'integer',
      'string',
    ]);
    expect(gen('[1,1.5]').items.type).toBe('number');
  });

  it('空配列は items を付けない', () => {
    expect(gen('{"a":[]}').properties.a).toEqual({ type: 'array' });
  });

  it('format を推測し、不一致や無効化では付けない', () => {
    const s = gen(
      '{"d":"2024-01-02","t":"2024-01-02T03:04:05Z","e":"a@b.co","u":"https://x.com/a","i":"123e4567-e89b-12d3-a456-426614174000"}',
    );
    expect(s.properties.d.format).toBe('date');
    expect(s.properties.t.format).toBe('date-time');
    expect(s.properties.e.format).toBe('email');
    expect(s.properties.u.format).toBe('uri');
    expect(s.properties.i.format).toBe('uuid');
    expect(gen('["2024-01-02","hello"]').items.format).toBeUndefined();
    expect(
      gen('{"d":"2024-01-02"}', { detectFormats: false }).properties.d.format,
    ).toBeUndefined();
  });

  it('オプション: draft・required・additionalProperties・title', () => {
    const s = gen('{"a":1}', {
      draft: '07',
      required: false,
      noAdditionalProperties: true,
      title: ' User ',
    });
    expect(s.$schema).toBe('http://json-schema.org/draft-07/schema#');
    expect(s.required).toBeUndefined();
    expect(s.additionalProperties).toBe(false);
    expect(s.title).toBe('User');
  });

  it('ルートがプリミティブでも動く', () => {
    expect(gen('"x"').type).toBe('string');
  });

  it('空・不正・深すぎる入力を失敗として返す', () => {
    expect(generateJsonSchema('  ')).toEqual({
      success: false,
      reason: 'empty',
    });
    expect(generateJsonSchema('{a')).toEqual({
      success: false,
      reason: 'invalid-json',
    });
    const deep = '['.repeat(20000) + ']'.repeat(20000);
    const result = generateJsonSchema(deep);
    expect(result.success).toBe(false);
  });
});

describe('generateJsonSchema: 特殊なキー', () => {
  it('__proto__ キーも properties に残る', () => {
    const result = generateJsonSchema('{"__proto__":1}');
    expect(result.success && result.schema).toContain('"__proto__"');
  });
});
