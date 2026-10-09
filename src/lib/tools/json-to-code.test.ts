import { describe, it, expect } from 'vitest';
import { jsonToCode, type CodeLanguage } from './json-to-code';

function gen(input: string, language: CodeLanguage, rootName?: string) {
  const result = jsonToCode(input, { language, rootName });
  if (!result.success) throw new Error(result.reason);
  return result.code;
}

const SAMPLE =
  '{"id":1,"price":1.5,"name":"a","ok":true,"tag":null,"tags":["x"],"user":{"age":3}}';

describe('jsonToCode', () => {
  it('typescript は jsonToTypeScript と同じ結果を返す', () => {
    expect(gen('{"a":1}', 'typescript')).toBe(
      'interface Root {\n  a: number;\n}\n',
    );
  });

  it('空・不正なJSONは失敗を返す', () => {
    expect(jsonToCode(' ', { language: 'go' })).toEqual({
      success: false,
      reason: 'empty',
    });
    expect(jsonToCode('{a:1}', { language: 'java' })).toEqual({
      success: false,
      reason: 'invalid-json',
    });
  });

  it('C#: クラスとプロパティを出力し、nullはobject?になる', () => {
    expect(gen(SAMPLE, 'csharp')).toBe(`using System.Collections.Generic;
using System.Text.Json.Serialization;

public class Root
{
    [JsonPropertyName("id")]
    public long Id { get; set; }
    [JsonPropertyName("price")]
    public double Price { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    [JsonPropertyName("ok")]
    public bool Ok { get; set; }
    [JsonPropertyName("tag")]
    public object? Tag { get; set; }
    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; }
    [JsonPropertyName("user")]
    public User User { get; set; }
}

public class User
{
    [JsonPropertyName("age")]
    public long Age { get; set; }
}
`);
  });

  it('Go: 構造体とjsonタグを出力し、省略可能な値はポインタ+omitemptyになる', () => {
    expect(gen('{"id":1,"items":[{"a":1,"b":"x"},{"a":2}],"n":null}', 'go'))
      .toBe(`type Root struct {
	ID    int64   \`json:"id"\`
	Items []Items \`json:"items"\`
	N     any     \`json:"n"\`
}

type Items struct {
	A int64   \`json:"a"\`
	B *string \`json:"b,omitempty"\`
}
`);
  });

  it('Python: 子のdataclassを先に出力し、省略可能な値は末尾で既定値None', () => {
    expect(
      gen(
        '{"first-name":"a","opt":[{"a":1},{}],"n":null,"user":{"age":1}}',
        'python',
      ),
    ).toBe(`from dataclasses import dataclass
from typing import Any


@dataclass
class User:
    age: int


@dataclass
class Opt:
    a: int | None = None


@dataclass
class Root:
    first_name: str  # "first-name"
    opt: list[Opt]
    n: Any
    user: User
`);
  });

  it('Java: recordを出力し、キー名が違う場合は@JsonPropertyを付ける', () => {
    expect(gen('{"user_id":1,"tags":[1.5],"default":true}', 'java'))
      .toBe(`import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

record Root(
    @JsonProperty("user_id") long userId,
    List<Double> tags,
    @JsonProperty("default") boolean default_
) {}
`);
  });

  it('整数と小数が混ざる数値は小数になる', () => {
    expect(gen('{"v":[1,2.5]}', 'go')).toContain('[]float64');
    expect(gen('{"v":[1,2]}', 'go')).toContain('[]int64');
  });

  it('値の型が混ざる場合はany、1種類+nullはnull許容になる', () => {
    expect(gen('{"v":[1,"a"]}', 'go')).toContain('[]any');
    expect(gen('{"v":[1,null]}', 'csharp')).toContain('List<long?>');
    expect(gen('{"v":["a",null]}', 'python')).toContain('list[str | None]');
    expect(gen('{"v":[1,null]}', 'java')).toContain('List<Long>');
  });

  it('ルートが配列のときは要素の型を出力し、型の別名を付ける', () => {
    expect(gen('[{"a":1}]', 'go')).toBe(
      'type RootItem struct {\n\tA int64 `json:"a"`\n}\n\ntype Root = []RootItem\n',
    );
    expect(gen('[1,2]', 'python')).toBe('Root = list[int]\n');
  });

  it('プロパティ名がクラス名と同じになる場合は連番を付ける（C#）', () => {
    expect(gen('{"root":1}', 'csharp')).toContain('public long Root2 {');
  });

  it('予約された型名・重複する型名を避ける', () => {
    expect(gen('{"list":{"a":1}}', 'csharp')).toContain(
      'public class ListType',
    );
    expect(gen('{"a":{"x":{"v":1}},"b":{"x":{"w":1}}}', 'go')).toContain(
      'type X2 struct',
    );
  });

  it('空のオブジェクトを出力できる', () => {
    expect(gen('{}', 'java')).toBe('record Root() {}\n');
    expect(gen('{}', 'python')).toContain('class Root:\n    pass');
    expect(gen('{}', 'csharp')).toBe('public class Root\n{\n}\n');
    expect(gen('{}', 'go')).toBe('type Root struct {}\n');
  });

  it('深すぎるJSONはtoo-deepを返す', () => {
    const deep = '['.repeat(5000) + ']'.repeat(5000);
    const result = jsonToCode(deep, { language: 'go' });
    expect(result.success).toBe(false);
  });

  it('Pythonの予約語・組み込み型名、Javaのrecordで使えない名前を避ける', () => {
    expect(gen('{"none":{"a":1}}', 'python')).toContain('class NoneType:');
    expect(gen('{"list":[1],"x":["a"]}', 'python')).toContain(
      'list_: list[int]',
    );
    expect(gen('{"hashCode":1,"wait":2}', 'java')).toContain('long hashCode_');
  });

  it('ルートが空配列・スカラー・nullのとき、各言語で別名として出力する', () => {
    expect(gen('[]', 'csharp')).toBe(
      'using System.Collections.Generic;\n\n// Root: List<object>\n',
    );
    expect(gen('"x"', 'go')).toBe('type Root = string\n');
    expect(gen('null', 'python')).toBe(
      'from typing import Any\n\n\nRoot = Any\n',
    );
    // Java / C# には型の別名がないため、スカラーのルートはコメントで示す
    expect(gen('3', 'java')).toBe('// Root: long\n');
  });

  it('日本語・絵文字・空のキーでも構文を壊さない', () => {
    expect(gen('{"名前":"a"}', 'python')).toContain('名前: str');
    expect(gen('{"名前":"a"}', 'go')).toContain('X名前 string');
    expect(gen('{"名前":"a"}', 'go')).toContain('`json:"名前"`');
    expect(gen('{"🙂":1}', 'python')).toContain('field: int  # "🙂"');
    expect(gen('{"":1}', 'go')).toContain('json:""');
  });

  it('JSONの改行がCRLFでも同じ結果になる', () => {
    expect(gen('{\r\n  "a": 1,\r\n  "b": "x"\r\n}', 'go')).toBe(
      gen('{\n  "a": 1,\n  "b": "x"\n}', 'go'),
    );
  });

  it('全角の記号を含むJSONは invalid-json になる', () => {
    expect(jsonToCode('{"a"：1}', { language: 'csharp' })).toEqual({
      success: false,
      reason: 'invalid-json',
    });
  });

  it('ルート名は各言語の型名の規則に整えられる', () => {
    expect(gen('{"a":1}', 'go', 'user profile')).toContain('type UserProfile');
    expect(gen('{"a":1}', 'java', '  ')).toContain('record Root(');
    expect(gen('{"a":1}', 'go', 'api-response')).toContain('type ApiResponse');
  });

  it('同じオブジェクト内で整数と小数のフィールドを別々に判定する', () => {
    const go = gen('{"a":1,"b":2.5}', 'go');
    expect(go).toContain('A int64');
    expect(go).toContain('B float64');
  });

  it('値の型が混ざる配列はJavaで Object になる', () => {
    expect(gen('{"v":[1,"a"]}', 'java')).toContain('List<Object>');
  });
});
