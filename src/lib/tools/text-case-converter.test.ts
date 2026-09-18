import { describe, expect, it } from 'vitest';
import { convertTextCase, splitWords } from './text-case-converter';
import type { TextCaseResult } from './text-case-converter';

const EMPTY_RESULT: TextCaseResult = {
  camelCase: '',
  pascalCase: '',
  snakeCase: '',
  kebabCase: '',
  constantCase: '',
  titleCase: '',
  sentenceCase: '',
  lowerCase: '',
  upperCase: '',
};

describe('splitWords', () => {
  it('空文字列は空配列になる', () => {
    expect(splitWords('')).toEqual([]);
  });

  it('空白のみの文字列は空配列になる', () => {
    expect(splitWords('   ')).toEqual([]);
  });

  it('camelCaseを単語に分解する', () => {
    expect(splitWords('helloWorldExample')).toEqual([
      'hello',
      'world',
      'example',
    ]);
  });

  it('連続する大文字（略語）を1単語として扱いつつ後続の単語と分離する', () => {
    expect(splitWords('XMLHttpRequest')).toEqual(['xml', 'http', 'request']);
  });

  it('snake_caseを単語に分解する', () => {
    expect(splitWords('hello_world_example')).toEqual([
      'hello',
      'world',
      'example',
    ]);
  });

  it('kebab-caseを単語に分解する', () => {
    expect(splitWords('hello-world-example')).toEqual([
      'hello',
      'world',
      'example',
    ]);
  });

  it('スペース区切りの文字列を単語に分解する', () => {
    expect(splitWords('Hello World Example')).toEqual([
      'hello',
      'world',
      'example',
    ]);
  });

  it('区切り文字が混在していても分解できる', () => {
    expect(splitWords('Hello_world-example.test')).toEqual([
      'hello',
      'world',
      'example',
      'test',
    ]);
  });

  it('数字と文字の境界も単語として分離する', () => {
    expect(splitWords('item2Value')).toEqual(['item2', 'value']);
  });

  it('末尾の連続大文字（略語）は前の単語と分離される', () => {
    expect(splitWords('convertToHTML')).toEqual(['convert', 'to', 'html']);
  });

  it('大文字の略語のみの入力は1単語として扱われる', () => {
    expect(splitWords('URL')).toEqual(['url']);
  });

  it('タブ・改行のみの文字列は空配列になる', () => {
    expect(splitWords('\t\n\r\n')).toEqual([]);
  });

  it('アンダースコア・ハイフンのみの文字列は空配列になる', () => {
    expect(splitWords('___---')).toEqual([]);
  });

  it('先頭・末尾の区切り文字は無視される', () => {
    expect(splitWords('-hello-world-')).toEqual(['hello', 'world']);
    expect(splitWords('__init__')).toEqual(['init']);
  });

  it('区切り文字にならない記号は単語の一部として保持される', () => {
    expect(splitWords('!!!')).toEqual(['!!!']);
    expect(splitWords('foo@bar.com')).toEqual(['foo@bar', 'com']);
  });

  it('全角英字は1単語として扱われ、小文字化される', () => {
    expect(splitWords('ＡＢＣ')).toEqual(['ａｂｃ']);
  });

  it('サロゲートペア（絵文字）を含んでいても単語が壊れない', () => {
    expect(splitWords('😀hello😀')).toEqual(['😀hello😀']);
  });

  it('大量の単語を含む長い文字列でも正しく分解できる', () => {
    const input = Array(1000).fill('wordExample').join('_');
    const result = splitWords(input);
    expect(result.length).toBe(2000);
    expect(result[0]).toBe('word');
    expect(result[1]).toBe('example');
  });
});

describe('convertTextCase', () => {
  it('空文字列を渡すとすべての結果が空文字列になる', () => {
    expect(convertTextCase('')).toEqual({
      camelCase: '',
      pascalCase: '',
      snakeCase: '',
      kebabCase: '',
      constantCase: '',
      titleCase: '',
      sentenceCase: '',
      lowerCase: '',
      upperCase: '',
    });
  });

  it('各ケースへ正しく変換する', () => {
    expect(convertTextCase('hello world example')).toEqual({
      camelCase: 'helloWorldExample',
      pascalCase: 'HelloWorldExample',
      snakeCase: 'hello_world_example',
      kebabCase: 'hello-world-example',
      constantCase: 'HELLO_WORLD_EXAMPLE',
      titleCase: 'Hello World Example',
      sentenceCase: 'Hello world example',
      lowerCase: 'hello world example',
      upperCase: 'HELLO WORLD EXAMPLE',
    });
  });

  it('camelCase入力から他のケースへ変換する', () => {
    const result = convertTextCase('helloWorldExample');
    expect(result.snakeCase).toBe('hello_world_example');
    expect(result.kebabCase).toBe('hello-world-example');
    expect(result.pascalCase).toBe('HelloWorldExample');
  });

  it('単語が1つだけの場合も正しく変換する', () => {
    const result = convertTextCase('hello');
    expect(result.camelCase).toBe('hello');
    expect(result.pascalCase).toBe('Hello');
    expect(result.snakeCase).toBe('hello');
    expect(result.constantCase).toBe('HELLO');
  });

  it('日本語などの非ASCII文字はそのまま単語として扱う（大文字/小文字変換は影響しない）', () => {
    const result = convertTextCase('こんにちは 世界');
    expect(result.snakeCase).toBe('こんにちは_世界');
    expect(result.titleCase).toBe('こんにちは 世界');
  });

  it('空白のみの入力を渡すとすべての結果が空文字列になる', () => {
    expect(convertTextCase('   \t\n  ')).toEqual(EMPTY_RESULT);
  });

  it('区切り文字のみの入力を渡すとすべての結果が空文字列になる', () => {
    expect(convertTextCase('___---')).toEqual(EMPTY_RESULT);
  });

  it('区切り文字にならない記号のみの入力はそのまま各ケースに反映される', () => {
    const result = convertTextCase('!!!');
    expect(result.camelCase).toBe('!!!');
    expect(result.snakeCase).toBe('!!!');
    expect(result.constantCase).toBe('!!!');
    expect(result.titleCase).toBe('!!!');
  });

  it('CRLF/CR/LFが混在する改行区切りの入力も単語として分解できる', () => {
    const result = convertTextCase('hello\r\nworld\nexample\rtest');
    expect(result.snakeCase).toBe('hello_world_example_test');
  });

  it('末尾の連続大文字（略語）を含む入力を正しく変換する', () => {
    const result = convertTextCase('convertToHTML');
    expect(result.snakeCase).toBe('convert_to_html');
    expect(result.titleCase).toBe('Convert To Html');
    expect(result.kebabCase).toBe('convert-to-html');
  });

  it('絵文字（サロゲートペア）が先頭にある単語はcapitalize（先頭大文字化）が効かないが文字は壊れない', () => {
    const result = convertTextCase('😀hello world');
    // capitalize()は word[0] を1コードユニットとして扱うため、
    // サロゲートペアの上位ハーフだけを取り出す形になり大文字化は効かないが、
    // 文字列が破損（片方のサロゲートだけになる等）しないことを確認する。
    expect(result.pascalCase).toBe('😀helloWorld');
    expect(result.titleCase).toBe('😀hello World');
    expect(result.pascalCase).toContain('😀');
  });

  it('大量の単語を含む長い入力でも変換できる', () => {
    const input = Array(1000).fill('helloWorld').join(' ');
    const result = convertTextCase(input);
    expect(result.snakeCase.split('_').length).toBe(2000);
    expect(result.camelCase.startsWith('helloWorld')).toBe(true);
  });
});
