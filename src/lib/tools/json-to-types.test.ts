import { describe, it, expect } from 'vitest';
import { jsonToTypeScript, toPascalCase } from './json-to-types';

function gen(input: string, options = {}): string {
  const result = jsonToTypeScript(input, options);
  if (!result.success) throw new Error(result.reason);
  return result.code;
}

describe('jsonToTypeScript', () => {
  it('プリミティブとネストしたオブジェクトをinterfaceにする', () => {
    expect(
      gen('{"id":1,"name":"a","ok":true,"tag":null,"user":{"age":3}}'),
    ).toBe(
      `interface Root {
  id: number;
  name: string;
  ok: boolean;
  tag: null;
  user: User;
}

interface User {
  age: number;
}
`,
    );
  });

  it('配列の要素のオブジェクトを統合し、欠けるキーを省略可能にする', () => {
    expect(gen('{"items":[{"a":1,"b":"x"},{"a":2}]}')).toBe(
      `interface Root {
  items: Items[];
}

interface Items {
  a: number;
  b?: string;
}
`,
    );
  });

  it('混在する型はユニオンにし、配列のユニオンは括弧で囲む', () => {
    expect(gen('{"v":[1,"a",null]}')).toContain(
      'v: (number | string | null)[];',
    );
    expect(gen('{"v":[1,2]}')).toContain('v: number[];');
  });

  it('空配列はunknown[]にする', () => {
    expect(gen('{"v":[]}')).toContain('v: unknown[];');
    expect(gen('{"v":[[],[1]]}')).toContain('v: number[][];');
  });

  it('識別子にできないキーは引用符で囲む', () => {
    const code = gen('{"first-name":"a","0":1,"ok_1":2}');
    expect(code).toContain('"first-name": string;');
    expect(code).toContain('"0": number;');
    expect(code).toContain('ok_1: number;');
  });

  it('同名のキーが別の場所にあっても型名が衝突しない', () => {
    const code = gen('{"a":{"data":{"x":1}},"b":{"data":{"y":"s"}}}');
    expect(code).toContain('interface Data {');
    expect(code).toContain('interface Data2 {');
  });

  it('標準の型名と衝突する名前は避ける', () => {
    expect(gen('{"date":{"y":1}}')).toContain('date: DateType;');
  });

  it('ルートが配列・プリミティブのときはtype宣言にする', () => {
    expect(gen('[{"a":1}]')).toBe(
      `type Root = RootItem[];

interface RootItem {
  a: number;
}
`,
    );
    expect(gen('"x"')).toBe('type Root = string;\n');
    expect(gen('null')).toBe('type Root = null;\n');
  });

  it('オプション: ルート名・type・export', () => {
    expect(
      gen('{"a":1}', {
        rootName: 'api response',
        style: 'type',
        exportDeclarations: true,
      }),
    ).toBe(`export type ApiResponse = {\n  a: number;\n};\n`);
  });

  it('空のオブジェクトを出力できる', () => {
    expect(gen('{}')).toBe('interface Root {}\n');
  });

  it('__proto__ キーも通常のキーとして扱う', () => {
    expect(gen('{"__proto__":1}')).toContain('__proto__: number;');
  });

  it('エラーを理由つきで返す', () => {
    expect(jsonToTypeScript('  ')).toEqual({ success: false, reason: 'empty' });
    expect(jsonToTypeScript('{a:1}')).toEqual({
      success: false,
      reason: 'invalid-json',
    });
  });

  it('深すぎるネストでも例外を投げずに結果を返す', () => {
    const depth = 20000;
    const input = '['.repeat(depth) + ']'.repeat(depth);
    expect(() => jsonToTypeScript(input)).not.toThrow();
  });
});

describe('toPascalCase', () => {
  it('区切り文字・先頭の数字・空文字を扱う', () => {
    expect(toPascalCase('user_name')).toBe('UserName');
    expect(toPascalCase('first-name')).toBe('FirstName');
    expect(toPascalCase('1st')).toBe('_1st');
    expect(toPascalCase('---')).toBe('Item');
    expect(toPascalCase('名前')).toBe('名前');
  });
});

describe('エッジケース', () => {
  it('絵文字・サロゲートペアを含むキーを扱う', () => {
    const code = gen('{"emoji_😀":"a","surrogate":"b"}');
    expect(code).toContain('emoji_😀');
  });

  it('UTF-16・UTF-32混合の複雑なJSON', () => {
    const code = gen('{"日本語":1,"中文":2,"한국어":3,"العربية":4,"🎉":5}');
    expect(code).toContain('interface Root');
  });

  it('大量のキーを持つオブジェクト', () => {
    const keys = Array.from({ length: 100 }, (_, i) => `k${i}`);
    const input =
      '{' + keys.map((k) => `"${k}":${Math.random() * 100}`).join(',') + '}';
    const result = jsonToTypeScript(input);
    expect(result.success).toBe(true);
  });

  it('ネストされた配列のユニオン型', () => {
    const code = gen('{"data":[[1,2],["a","b"],[true]]}');
    expect(code).toContain('data:');
  });

  it('nullと値が混在する配列', () => {
    const code = gen('{"values":[1,null,"a",null,true]}');
    expect(code).toContain('values:');
  });

  it('複数レベルのネストで同じキー名が現れる', () => {
    const code = gen(
      '{"level1":{"item":{"level2":{"item":{"level3":{"item":1}}}}}}',
    );
    expect(code).toContain('interface');
  });

  it('絵文字を含むキーと値', () => {
    const code = gen(JSON.stringify({ emoji_key: '😀emoji' }));
    expect(code).toContain('emoji_key');
  });
});
