import { describe, it, expect } from 'vitest';
import { envToJson, jsonToEnv, parseEnv } from './env-json-converter';

describe('parseEnv', () => {
  it('コメント・空行・exportを扱う', () => {
    const r = parseEnv('# c\n\nexport A=1\nB = two\n');
    expect(r).toEqual({ ok: true, values: { A: '1', B: 'two' } });
  });

  it('引用符・行末コメント・エスケープを扱う', () => {
    const r = parseEnv(
      'A="x y" # c\nB=\'a\\nb\'\nC="a\\nb"\nD=v #c\nE=a#b\nF=',
    );
    expect(r).toEqual({
      ok: true,
      values: { A: 'x y', B: 'a\\nb', C: 'a\nb', D: 'v', E: 'a#b', F: '' },
    });
  });

  it('複数行の引用符付き値を扱う', () => {
    const r = parseEnv('K="line1\nline2"\nZ=1');
    expect(r).toEqual({ ok: true, values: { K: 'line1\nline2', Z: '1' } });
  });

  it('重複キーは後勝ち、CRLFとBOMを許容する', () => {
    const r = parseEnv('﻿A=1\r\nA=2\r\n');
    expect(r).toEqual({ ok: true, values: { A: '2' } });
  });

  it('不正行は行番号付きでエラーにする', () => {
    expect(parseEnv('A=1\nnotvalid')).toEqual({
      ok: false,
      message: '2: notvalid',
    });
    expect(parseEnv('A="open')).toEqual({ ok: false, message: '1: A' });
    expect(parseEnv('1A=x').ok).toBe(false);
  });

  it('未知のエスケープはバックスラッシュを残す', () => {
    expect(parseEnv('P="C:\\Users\\Admin"')).toEqual({
      ok: true,
      values: { P: 'C:\\Users\\Admin' },
    });
  });

  it('= 直後のコメントは空値になる', () => {
    expect(parseEnv('A= # c\nB=#x')).toEqual({
      ok: true,
      values: { A: '', B: '' },
    });
  });

  it('envToJson でも __proto__ キーが出力に残る', () => {
    const r = envToJson('__proto__=x', { indent: 0 });
    expect(r).toEqual({ success: true, output: '{"__proto__":"x"}' });
  });

  it('__proto__ キーでもプロトタイプを汚染しない', () => {
    const r = parseEnv('__proto__=x');
    expect(r.ok && Object.keys(r.values)).toEqual(['__proto__']);
    expect(({} as Record<string, unknown>).x).toBeUndefined();
  });
});

describe('envToJson', () => {
  it('既定では文字列のまま出力する', () => {
    expect(envToJson('PORT=3000\nDEBUG=true', { indent: 0 })).toEqual({
      success: true,
      output: '{"PORT":"3000","DEBUG":"true"}',
    });
  });

  it('parseValues で型変換する（先頭ゼロ・巨大整数は文字列のまま）', () => {
    expect(
      envToJson(
        'PORT=3000\nDEBUG=false\nZ=007\nBIG=12345678901234567890\nF=1.5',
        { indent: 0, parseValues: true },
      ),
    ).toEqual({
      success: true,
      output:
        '{"PORT":3000,"DEBUG":false,"Z":"007","BIG":"12345678901234567890","F":1.5}',
    });
  });

  it('不正な入力はエラー', () => {
    expect(envToJson('oops').success).toBe(false);
  });
});

describe('jsonToEnv', () => {
  it('単純な値はそのまま、特殊な値は引用符で囲む', () => {
    const r = jsonToEnv(
      '{"A":"1","B":"x y","C":"a\\nb","D":"","E":null,"F":true,"G":5,"H":"q\\"t","I":"a#b"}',
    );
    expect(r).toEqual({
      success: true,
      output:
        'A=1\nB="x y"\nC="a\\nb"\nD=\nE=\nF=true\nG=5\nH="q\\"t"\nI="a#b"',
    });
  });

  it('往復で値が保たれる', () => {
    const json = '{"A":"x y","B":"a\\nb","C":"p\\\\q"}';
    const env = jsonToEnv(json);
    expect(env.success).toBe(true);
    if (!env.success) return;
    const back = envToJson(env.output, { indent: 0 });
    expect(back.success && JSON.parse(back.output)).toEqual(JSON.parse(json));
  });

  it('ネスト・配列・不正キー・非オブジェクトはエラー', () => {
    expect(jsonToEnv('{"A":{"b":1}}').success).toBe(false);
    expect(jsonToEnv('{"A":[1]}').success).toBe(false);
    expect(jsonToEnv('{"a b":1}').success).toBe(false);
    expect(jsonToEnv('[1]').success).toBe(false);
    expect(jsonToEnv('{bad').success).toBe(false);
  });
});
