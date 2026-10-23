import { describe, expect, it } from 'vitest';
import { convertToCurl, type FetchToCurlWarning } from './fetch-to-curl';

function convert(input: string, multiline = false) {
  const result = convertToCurl(input, { multiline });
  if (!result.success) throw new Error(`failed: ${result.reason}`);
  return result;
}

function codes(warnings: FetchToCurlWarning[]) {
  return warnings.map((w) => w.code);
}

describe('fetch', () => {
  it('URLだけのGET', () => {
    const r = convert(`fetch("https://api.example.com/users");`);
    expect(r.command).toBe(`curl 'https://api.example.com/users'`);
    expect(r.warnings).toEqual([]);
  });

  it('POST + headers + JSON.stringify（await・const代入つき）', () => {
    const r = convert(`
const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer abc",
  },
  body: JSON.stringify({ name: "Taro", age: 20 }),
});
const data = await response.json();
`);
    expect(r.command).toBe(
      `curl 'https://api.example.com/users' -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer abc' --data-raw '{"name":"Taro","age":20}'`,
    );
    expect(r.warnings).toEqual([]);
  });

  it('複数行出力は行末バックスラッシュで区切る', () => {
    const r = convert(`fetch("https://a.test/", { method: "DELETE" })`, true);
    expect(r.command).toBe(`curl 'https://a.test/' \\\n  -X DELETE`);
  });

  it('文字列ボディにはContent-Typeを補う（fetchの既定）', () => {
    const r = convert(
      `fetch("https://a.test/", {method:"POST", body:"hello"})`,
    );
    expect(r.command).toBe(
      `curl 'https://a.test/' -X POST -H 'Content-Type: text/plain;charset=UTF-8' --data-raw 'hello'`,
    );
  });

  it('Content-Typeを明示していれば補わない（大文字小文字無視）', () => {
    const r = convert(
      `fetch("https://a.test/", {method:"POST", headers:{"content-type":"text/csv"}, body:"a,b"})`,
    );
    expect(r.command).toBe(
      `curl 'https://a.test/' -X POST -H 'content-type: text/csv' --data-raw 'a,b'`,
    );
  });

  it('変数・テンプレートリテラル・文字列連結を解決する', () => {
    const r = convert(`
const base = 'https://a.test';
const id = 42;
const token = "tok";
fetch(\`\${base}/items/\${id}\`, { headers: { Authorization: 'Bearer ' + token } });
`);
    expect(r.command).toBe(
      `curl 'https://a.test/items/42' -H 'Authorization: Bearer tok'`,
    );
    expect(r.warnings).toEqual([]);
  });

  it('解決できない変数はプレースホルダにして警告する', () => {
    const r = convert(
      `fetch("https://a.test/", { headers: { Authorization: "Bearer " + token } })`,
    );
    expect(r.command).toContain(`'Authorization: Bearer <token>'`);
    expect(r.warnings).toEqual([{ code: 'unresolved', expr: 'token' }]);
  });

  it('JSON.stringify 内の未解決変数もプレースホルダになる', () => {
    const r = convert(
      `fetch("https://a.test/", {method:"POST", body: JSON.stringify({ name: userName, n: 1 })})`,
    );
    expect(r.command).toContain(`--data-raw '{"name":"<userName>","n":1}'`);
    expect(codes(r.warnings)).toContain('unresolved');
  });

  it('JSON.stringify のインデントとundefinedの省略', () => {
    const r = convert(
      `fetch("https://a.test/", {method:"POST", body: JSON.stringify({a: 1, b: undefined}, null, 2)})`,
    );
    expect(r.command).toContain(`--data-raw '{\n  "a": 1\n}'`);
  });

  it('URLSearchParams ボディ', () => {
    const r = convert(
      `fetch("https://a.test/", {method:"POST", body: new URLSearchParams({a:"1 2", b:"x&y"})})`,
    );
    expect(r.command).toContain(
      `-H 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8'`,
    );
    expect(r.command).toContain(`--data-raw 'a=1+2&b=x%26y'`);
  });

  it('FormData は -F になりContent-Typeヘッダは外す', () => {
    const r = convert(`
const fd = new FormData();
fd.append("name", "Taro");
fd.append("file", fileInput.files[0]);
fd.append("at", "@x");
fetch("https://a.test/up", { method: "POST", headers: {"Content-Type": "multipart/form-data"}, body: fd });
`);
    expect(r.command).toBe(
      `curl 'https://a.test/up' -X POST -F 'name=Taro' -F 'file=@fileInput.files[0]' --form-string 'at=@x'`,
    );
    expect(r.warnings).toEqual([
      { code: 'file-reference', name: 'fileInput.files[0]' },
    ]);
  });

  it('new Headers と headers.append', () => {
    const r = convert(`
const h = new Headers({ Accept: "text/html" });
h.append("X-Id", "7");
fetch("https://a.test/", { headers: h });
`);
    expect(r.command).toBe(
      `curl 'https://a.test/' -H 'Accept: text/html' -H 'X-Id: 7'`,
    );
  });

  it('ヘッダを配列のペアで指定', () => {
    const r = convert(
      `fetch("https://a.test/", { headers: [["A","1"],["B","2"]] })`,
    );
    expect(r.command).toBe(`curl 'https://a.test/' -H 'A: 1' -H 'B: 2'`);
  });

  it('Chromeの「fetchとしてコピー」形式（引用符つきキー・null ボディ）', () => {
    const r = convert(`fetch("https://a.test/api", {
  "headers": {
    "accept": "*/*",
    "sec-ch-ua": "\\"Chromium\\";v=\\"120\\""
  },
  "referrer": "https://a.test/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});`);
    expect(r.command).toBe(
      `curl 'https://a.test/api' -H 'accept: */*' -H 'sec-ch-ua: "Chromium";v="120"' -e 'https://a.test/'`,
    );
    expect(r.warnings).toEqual([{ code: 'credentials' }]);
  });

  it('redirect: follow は -L', () => {
    const r = convert(`fetch("https://a.test/", {redirect: "follow"})`);
    expect(r.command).toBe(`curl 'https://a.test/' -L`);
  });

  it('HEADは -I', () => {
    const r = convert(`fetch("https://a.test/", {method: "head"})`);
    expect(r.command).toBe(`curl 'https://a.test/' -I`);
  });

  it('未対応のオプションは警告する', () => {
    const r = convert(`fetch("https://a.test/", {foo: 1})`);
    expect(r.warnings).toEqual([{ code: 'unsupported-option', option: 'foo' }]);
  });

  it('GETにボディがあると警告する', () => {
    const r = convert(`fetch("https://a.test/", {body: "x"})`);
    expect(r.warnings).toEqual([{ code: 'body-not-allowed', method: 'GET' }]);
  });

  it('プレーンオブジェクトをbodyに渡すと警告する', () => {
    const r = convert(`fetch("https://a.test/", {method:"POST", body: {a:1}})`);
    expect(codes(r.warnings)).toContain('body-object');
    expect(r.command).toContain(`--data-raw '[object Object]'`);
  });

  it('相対URLは警告する', () => {
    const r = convert(`fetch("/api/users")`);
    expect(r.command).toBe(`curl '/api/users'`);
    expect(r.warnings).toEqual([{ code: 'relative-url', url: '/api/users' }]);
  });

  it('new URL と new Request', () => {
    const r = convert(`
fetch(new URL("/x?y=1", "https://a.test"));
`);
    expect(r.command).toBe(`curl 'https://a.test/x?y=1'`);
    const r2 = convert(
      `fetch(new Request("https://a.test/", { method: "PUT", body: "z" }))`,
    );
    expect(r2.command).toContain(`-X PUT`);
    expect(r2.command).toContain(`--data-raw 'z'`);
  });

  it('then/catch の連鎖があっても変換できる', () => {
    const r = convert(
      `fetch("https://a.test/").then((res) => res.json()).then(d => console.log(d)).catch(console.error);`,
    );
    expect(r.command).toBe(`curl 'https://a.test/'`);
  });

  it('async関数やIIFEの中のfetchも見つける', () => {
    const r = convert(`
async function load() {
  try {
    const res = await fetch("https://a.test/in-fn");
  } catch (e) {}
}
(async () => {
  await load();
})();
`);
    expect(r.command).toBe(`curl 'https://a.test/in-fn'`);
    const r2 = convert(`
const get = async () => {
  const r = await fetch("https://a.test/arrow");
};
`);
    expect(r2.command).toBe(`curl 'https://a.test/arrow'`);
  });

  it('コメント・セミコロンなし・末尾カンマに対応する', () => {
    const r = convert(`
// ユーザー取得
const url = 'https://a.test/u' /* inline */
fetch(url, {
  method: 'GET', // trailing
})
`);
    expect(r.command).toBe(`curl 'https://a.test/u'`);
  });

  it('文字列エスケープを解釈し、シングルクォートはシェル用にエスケープする', () => {
    const r = convert(
      `fetch("https://a.test/", {method:"POST", body: "it's\\nok \\u0041\\x42"})`,
    );
    expect(r.command).toContain(`--data-raw 'it'\\''s\nok AB'`);
  });

  it('スプレッドで合成したヘッダ', () => {
    const r = convert(`
const base = { Accept: "a" };
fetch("https://a.test/", { headers: { ...base, "X-A": "1" } });
`);
    expect(r.command).toBe(`curl 'https://a.test/' -H 'Accept: a' -H 'X-A: 1'`);
  });

  it('JSON.parse した値を使える', () => {
    const r = convert(`
const payload = JSON.parse('{"a":[1,2]}');
fetch("https://a.test/", {method:"POST", body: JSON.stringify(payload)});
`);
    expect(r.command).toContain(`--data-raw '{"a":[1,2]}'`);
  });

  it('複数のリクエストは最初だけ変換して警告する', () => {
    const r = convert(`fetch("https://a.test/1"); fetch("https://a.test/2");`);
    expect(r.command).toBe(`curl 'https://a.test/1'`);
    expect(r.warnings).toEqual([{ code: 'multiple-requests', count: 1 }]);
  });
});

describe('axios', () => {
  it('axios.get + params', () => {
    const r = convert(
      `axios.get("https://a.test/s", { params: { q: "a b", tags: ["x","y"], skip: undefined, n: 2 } })`,
    );
    expect(r.command).toBe(
      `curl 'https://a.test/s?q=a+b&tags[]=x&tags[]=y&n=2'`,
    );
  });

  it('axios.post はオブジェクトをJSONにしてContent-Typeを補う', () => {
    const r = convert(
      `axios.post("https://a.test/u", { name: "Taro" }, { headers: { "X-Key": "k" } })`,
    );
    expect(r.command).toBe(
      `curl 'https://a.test/u' -X POST -H 'X-Key: k' -H 'Content-Type: application/json' --data-raw '{"name":"Taro"}'`,
    );
  });

  it('axios(config) 形式と baseURL・auth・timeout', () => {
    const r = convert(`
axios({
  method: 'put',
  baseURL: 'https://a.test/api/',
  url: '/items/1',
  data: 'raw',
  auth: { username: 'me', password: "p'w" },
  timeout: 2500,
});
`);
    expect(r.command).toBe(
      `curl 'https://a.test/api/items/1' -X PUT --data-raw 'raw' -u 'me:p'\\''w' --max-time 2.5`,
    );
  });

  it('axios(url, config) 形式', () => {
    const r = convert(`axios("https://a.test/", { method: "delete" })`);
    expect(r.command).toBe(`curl 'https://a.test/' -X DELETE`);
  });

  it('axios.request と import / require 行', () => {
    const r = convert(`
import axios from 'axios';
const axiosAlt = require('axios');
const res = await axios.request({ url: 'https://a.test/r', method: 'PATCH', data: { a: 1 } });
`);
    expect(r.command).toContain(`curl 'https://a.test/r' -X PATCH`);
    expect(r.command).toContain(`--data-raw '{"a":1}'`);
  });

  it('動詞メソッドの method は設定の method より優先される', () => {
    const r = convert(`axios.get("https://a.test/", { method: "post" })`);
    expect(r.command).toBe(`curl 'https://a.test/'`);
  });

  it('withCredentials と未対応オプションは警告する', () => {
    const r = convert(
      `axios.get("https://a.test/", { withCredentials: true, proxy: false, responseType: "json" })`,
    );
    expect(r.warnings).toEqual([
      { code: 'credentials' },
      { code: 'unsupported-option', option: 'proxy' },
    ]);
  });

  it('headers.common などの入れ子は警告して無視する', () => {
    const r = convert(
      `axios.get("https://a.test/", { headers: { common: { A: "1" }, B: "2" } })`,
    );
    expect(r.command).toBe(`curl 'https://a.test/' -H 'B: 2'`);
    expect(r.warnings).toEqual([
      { code: 'unsupported-option', option: 'headers.common' },
    ]);
  });
});

describe('安全性と失敗', () => {
  it('コードを評価しない（関数呼び出しは実行されず未解決になる）', () => {
    const g = globalThis as unknown as { __fetchToCurlPwned?: boolean };
    g.__fetchToCurlPwned = false;
    const r = convert(
      `fetch("https://a.test/", { headers: { X: (globalThis.__fetchToCurlPwned = true, "a") } })`,
    );
    expect(g.__fetchToCurlPwned).toBe(false);
    expect(r.command).toContain('curl');
    const r2 = convert(
      `fetch("https://a.test/", { headers: { X: (() => { globalThis.__fetchToCurlPwned = true; return "a"; })() } })`,
    );
    expect(g.__fetchToCurlPwned).toBe(false);
    expect(codes(r2.warnings)).toContain('unresolved');
  });

  it('空入力', () => {
    expect(convertToCurl('  \n ')).toEqual({ success: false, reason: 'empty' });
  });

  it('リクエストが無い', () => {
    expect(convertToCurl('const a = 1;')).toEqual({
      success: false,
      reason: 'no-request',
    });
  });

  it('引用符が閉じていないと構文エラー', () => {
    expect(convertToCurl('fetch("https://a.test/')).toEqual({
      success: false,
      reason: 'syntax-error',
    });
  });

  it('URLが無い', () => {
    expect(convertToCurl('fetch()')).toEqual({
      success: false,
      reason: 'no-url',
    });
  });

  it('深すぎる入れ子でもクラッシュしない', () => {
    const deep = `fetch("https://a.test/", {body: ${'['.repeat(20000)}${']'.repeat(20000)}})`;
    const result = convertToCurl(deep);
    expect(result.success === true || result.reason === 'syntax-error').toBe(
      true,
    );
  });
});

describe('method のシェルクォート', () => {
  it('英大文字以外を含む method はクォートされる', () => {
    const r = convert(`fetch("https://a.test/", {method: "POST; rm -rf ~"})`);
    expect(r.command).toContain(`-X 'POST; RM -RF ~'`);
  });
});

describe('境界・多言語・入力パターン', () => {
  it('URL 内のシングルクォートはシェルで閉じられないようにエスケープする', () => {
    const r = convert(`fetch("https://a.test/'; rm -rf ~; echo '")`);
    expect(r.command).toBe(`curl 'https://a.test/'\\''; rm -rf ~; echo '\\'''`);
  });

  it('日本語の文字列ボディはそのまま --data-raw に入る（UTF-8）', () => {
    const r = convert(
      `fetch("https://a.test/", {method: "POST", body: "こんにちは、世界"})`,
    );
    expect(r.command).toContain(`--data-raw 'こんにちは、世界'`);
    expect(r.warnings).toEqual([]);
  });

  it('日本語を含む URL も変換できる', () => {
    const r = convert(`fetch("https://a.test/検索?q=猫")`);
    expect(r.command).toBe(`curl 'https://a.test/検索?q=猫'`);
  });

  it('CRLF の改行を含む入力も変換できる', () => {
    const r = convert(
      'const url = "https://a.test/";\r\nfetch(url, {\r\n  method: "PUT",\r\n  body: "x"\r\n});\r\n',
    );
    expect(r.command).toBe(
      `curl 'https://a.test/' -X PUT -H 'Content-Type: text/plain;charset=UTF-8' --data-raw 'x'`,
    );
  });
});
