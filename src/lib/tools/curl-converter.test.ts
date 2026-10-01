import { describe, expect, it } from 'vitest';
import {
  convertCurl,
  generateAxios,
  generateFetch,
  parseCurlCommand,
  tokenizeCommand,
  type ParsedCurl,
} from './curl-converter';

function parse(command: string): ParsedCurl {
  const result = parseCurlCommand(command);
  if (!result.success) throw new Error(`parse failed: ${result.reason}`);
  return result.value;
}

describe('tokenizeCommand', () => {
  it('引用符・エスケープ・行継続を処理する', () => {
    expect(tokenizeCommand(`a 'b c' "d \\" e" f\\ g`)).toEqual([
      'a',
      'b c',
      'd " e',
      'f g',
    ]);
    expect(tokenizeCommand('a \\\n  b')).toEqual(['a', 'b']);
    expect(tokenizeCommand('a \\\r\n  b')).toEqual(['a', 'b']);
  });

  it("$'...' のANSI-Cエスケープを解釈する", () => {
    expect(tokenizeCommand("$'a\\nb\\'c\\u0041'")).toEqual(["a\nb'cA"]);
  });

  it('引用符が閉じていなければ null', () => {
    expect(tokenizeCommand(`a 'b`)).toBeNull();
    expect(tokenizeCommand(`a "b`)).toBeNull();
  });
});

describe('parseCurlCommand', () => {
  it('エラーケース', () => {
    expect(parseCurlCommand('  ')).toEqual({ success: false, reason: 'empty' });
    expect(parseCurlCommand('wget http://a')).toEqual({
      success: false,
      reason: 'not-curl',
    });
    expect(parseCurlCommand('curl -s')).toEqual({
      success: false,
      reason: 'no-url',
    });
    expect(parseCurlCommand(`curl 'http://a`)).toEqual({
      success: false,
      reason: 'unclosed-quote',
    });
  });

  it('単純なGET。先頭の $ とスキーム省略を処理する', () => {
    const v = parse('$ curl example.com/api');
    expect(v.url).toBe('http://example.com/api');
    expect(v.method).toBe('GET');
    expect(v.body).toBeNull();
  });

  it('ヘッダ・メソッド・-XPUT 直付け・連結短縮オプション', () => {
    const v = parse(
      `curl -sSL -XPUT -H 'Accept: text/plain' -H "X-A:1" https://a.test/x`,
    );
    expect(v.method).toBe('PUT');
    expect(v.headers).toEqual([
      ['Accept', 'text/plain'],
      ['X-A', '1'],
    ]);
    expect(v.warnings).toEqual([]);
  });

  it('同名ヘッダは後勝ち、値なしヘッダ指定は削除', () => {
    const v = parse(
      `curl -H 'a: 1' -H 'A: 2' -H 'B: x' -H 'B:' https://a.test`,
    );
    expect(v.headers).toEqual([['a', '2']]);
  });

  it('-d でPOSTになり Content-Type を補う。複数の -d は & で連結', () => {
    const v = parse(`curl -d a=1 -d b=2 https://a.test`);
    expect(v.method).toBe('POST');
    expect(v.body).toBe('a=1&b=2');
    expect(v.headers).toEqual([
      ['Content-Type', 'application/x-www-form-urlencoded'],
    ]);
  });

  it('明示した Content-Type は上書きしない', () => {
    const v = parse(`curl -H 'content-type: application/json' -d '{}' a.test`);
    expect(v.headers).toEqual([['content-type', 'application/json']]);
  });

  it('--data-urlencode は値をエンコードする', () => {
    const v = parse(
      `curl --data-urlencode 'q=a b&c' --data-urlencode 'x y' a.test`,
    );
    expect(v.body).toBe('q=a%20b%26c&x%20y');
  });

  it('-G でデータをクエリに付ける', () => {
    const v = parse(`curl -G -d a=1 'https://a.test/p?x=0#h'`);
    expect(v.method).toBe('GET');
    expect(v.url).toBe('https://a.test/p?x=0&a=1#h');
    expect(v.body).toBeNull();
  });

  it('-I は HEAD', () => {
    expect(parse('curl -I https://a.test').method).toBe('HEAD');
  });

  it('--json は Content-Type / Accept を補う', () => {
    const v = parse(`curl --json '{"a":1}' https://a.test`);
    expect(v.method).toBe('POST');
    expect(v.headers).toEqual([
      ['Content-Type', 'application/json'],
      ['Accept', 'application/json'],
    ]);
  });

  it('-u / -A / -e / -b / --oauth2-bearer', () => {
    const v = parse(
      `curl -u me:p:w -A UA -e http://r -b 'a=1' --oauth2-bearer tok https://a.test`,
    );
    expect(v.basicAuth).toEqual({ username: 'me', password: 'p:w' });
    expect(v.headers).toEqual([
      ['User-Agent', 'UA'],
      ['Referer', 'http://r'],
      ['Cookie', 'a=1'],
      ['Authorization', 'Bearer tok'],
    ]);
  });

  it('-F はフォームになり Content-Type を除く', () => {
    const v = parse(
      `curl -H 'Content-Type: multipart/form-data' -F a=1 -F f=@x.txt https://a.test`,
    );
    expect(v.method).toBe('POST');
    expect(v.form).toEqual([
      ['a', '1', false],
      ['f', '@x.txt', true],
    ]);
    expect(v.headers).toEqual([]);
    expect(v.warnings).toEqual([{ code: 'file-reference', value: '@x.txt' }]);
  });

  it('警告: ファイル参照・-k・未対応オプション・複数URL', () => {
    const v = parse(
      `curl -k --foo -d @body.json https://a.test https://b.test`,
    );
    expect(v.warnings).toEqual([
      { code: 'insecure' },
      { code: 'unsupported-option', option: '--foo' },
      { code: 'file-reference', value: '@body.json' },
      { code: 'multiple-urls', url: 'https://a.test' },
    ]);
  });

  it('値を取る無視オプションの引数をURLと誤認しない', () => {
    const v = parse(`curl -o out.txt --max-time 5 -m 3 https://a.test`);
    expect(v.url).toBe('https://a.test');
  });

  it('--url と --option=value 形式', () => {
    const v = parse(`curl --url https://a.test --request=DELETE`);
    expect(v.url).toBe('https://a.test');
    expect(v.method).toBe('DELETE');
  });
});

describe('レビュー指摘の回帰', () => {
  it('--form-string は @ をリテラルとして扱う', () => {
    const v = parse(`curl --form-string 'a=@foo' https://a.test`);
    expect(v.warnings).toEqual([]);
    expect(generateFetch(v)).toContain('formData.append("a", "@foo");');
  });

  it('--json @file は警告する', () => {
    expect(parse('curl --json @b.json https://a.test').warnings).toEqual([
      { code: 'file-reference', value: '@b.json' },
    ]);
  });

  it('ファイルフォームのコメントはロケール非依存', () => {
    const code = generateFetch(parse('curl -F f=@x.txt https://a.test'));
    expect(code).toContain('/* file contents: x.txt */');
  });

  it('値が変わるJSONは文字列のまま出力する', () => {
    const code = generateFetch(
      parse(
        `curl -H 'Content-Type: application/json' -d '{"id":12345678901234567890}' https://a.test`,
      ),
    );
    expect(code).toContain('body: "{\\"id\\":12345678901234567890}",');
  });

  it('GET/HEAD にボディがあると警告する', () => {
    expect(parse('curl -X GET -d a=1 https://a.test').warnings).toEqual([
      { code: 'body-not-allowed', method: 'GET' },
    ]);
  });

  it('値を取る未登録オプションの引数をURLにしない', () => {
    const v = parse(`curl --noproxy '*' https://a.test`);
    expect(v.url).toBe('https://a.test');
    expect(v.warnings).toEqual([]);
  });
});

describe('generateFetch', () => {
  it('GETはオプションなし', () => {
    expect(generateFetch(parse('curl https://a.test'))).toBe(
      [
        'const response = await fetch("https://a.test");',
        'const data = await response.text();',
        'console.log(data);',
      ].join('\n'),
    );
  });

  it('JSONボディは JSON.stringify のオブジェクトにする', () => {
    const code = generateFetch(
      parse(
        `curl -X POST https://a.test -H 'Content-Type: application/json' -d '{"a":[1,2]}'`,
      ),
    );
    expect(code).toContain('method: "POST",');
    expect(code).toContain('"Content-Type": "application/json",');
    expect(code).toContain(
      'body: JSON.stringify({\n    "a": [\n      1,\n      2\n    ]\n  }),',
    );
  });

  it('JSONとして不正なボディは文字列のまま', () => {
    const code = generateFetch(
      parse(`curl https://a.test -H 'Content-Type: application/json' -d '{x'`),
    );
    expect(code).toContain('body: "{x",');
  });

  it('Basic認証は Authorization ヘッダにする', () => {
    const code = generateFetch(parse('curl -u user:pass https://a.test'));
    expect(code).toContain(`"Authorization": "Basic ${btoa('user:pass')}",`);
  });

  it('フォームは FormData を使う', () => {
    const code = generateFetch(parse('curl -F a=1 https://a.test'));
    expect(code).toContain('const formData = new FormData();');
    expect(code).toContain('formData.append("a", "1");');
    expect(code).toContain('body: formData,');
  });

  it('値の特殊文字を安全にエスケープする', () => {
    const code = generateFetch(
      parse(`curl -H 'X: a"b\\c' 'https://a.test/?q="'`),
    );
    expect(code).toContain('"X": "a\\"b\\\\c"');
    expect(code).toContain('fetch("https://a.test/?q=\\""');
  });
});

describe('generateAxios', () => {
  it('メソッドは小文字、JSONは data にオブジェクト', () => {
    const code = generateAxios(
      parse(
        `curl https://a.test -H 'Content-Type: application/json' -d '{"a":1}'`,
      ),
    );
    expect(code).toContain('import axios from "axios";');
    expect(code).toContain('method: "post",');
    expect(code).toContain('data: {\n    "a": 1\n  },');
    expect(code).toContain('console.log(response.data);');
  });

  it('Basic認証は auth オプション', () => {
    const code = generateAxios(parse('curl -u user:pass https://a.test'));
    expect(code).toContain(
      'auth: {\n    username: "user",\n    password: "pass",\n  },',
    );
    expect(code).not.toContain('Authorization');
  });
});

describe('convertCurl', () => {
  it('形式を切り替えて変換する', () => {
    const result = convertCurl('curl https://a.test', 'axios');
    expect(result.success && result.code).toContain('axios');
  });

  it('失敗理由をそのまま返す', () => {
    expect(convertCurl('', 'fetch')).toEqual({
      success: false,
      reason: 'empty',
    });
  });
});

describe('マルチバイト文字と複雑なケース', () => {
  it('日本語・emoji を含むヘッダーとボディを正しく処理する', () => {
    const v = parse(
      `curl -H 'X-Name: 日本語' -d 'text=こんにちは👋' https://a.test`,
    );
    expect(v.headers).toEqual([
      ['X-Name', '日本語'],
      ['Content-Type', 'application/x-www-form-urlencoded'],
    ]);
    expect(v.body).toBe('text=こんにちは👋');
  });

  it('複数行コマンド（行末の \\ で継続）を正しく処理する', () => {
    const v = parse(`curl -X POST \\
  -H 'Content-Type: application/json' \\
  -d '{"a":1}' \\
  https://a.test`);
    expect(v.method).toBe('POST');
    expect(v.headers).toEqual([['Content-Type', 'application/json']]);
    expect(v.body).toBe('{"a":1}');
  });

  it('生成コードがマルチバイト文字を正しくエスケープする', () => {
    const code = generateFetch(
      parse(`curl -H 'X-Name: 日本語' https://a.test`),
    );
    expect(code).toContain('"X-Name": "日本語"');
  });

  it('大量のヘッダーとデータを処理できる', () => {
    const headers = Array.from(
      { length: 50 },
      (_, i) => `-H 'X-${i}: value${i}'`,
    ).join(' ');
    const v = parse(`curl ${headers} -d a=1 https://a.test`);
    // -d があるので Content-Type が自動追加される
    expect(v.headers).toHaveLength(51);
    expect(v.body).toBe('a=1');
  });

  it('URL にクエリ・フラグメント・特殊文字を含む場合を処理', () => {
    const v = parse(`curl 'https://a.test/path?a=1&b=2#hash'`);
    expect(v.url).toBe('https://a.test/path?a=1&b=2#hash');
  });
});
