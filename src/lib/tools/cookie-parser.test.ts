import { describe, expect, it } from 'vitest';
import {
  looksLikeSetCookie,
  maskValue,
  parseCookies,
  splitDuration,
  toJson,
} from './cookie-parser';

const NOW = Date.parse('2026-10-22T00:00:00Z');

describe('parseCookies: Cookie ヘッダー', () => {
  it('セミコロン区切りのペアに分解する', () => {
    const r = parseCookies('a=1; b=2;c=3', 'auto', NOW);
    expect(r.detected).toBe('request');
    expect(r.entries.map((e) => [e.name, e.value])).toEqual([
      ['a', '1'],
      ['b', '2'],
      ['c', '3'],
    ]);
  });

  it('Cookie: 接頭辞を取り除く', () => {
    const r = parseCookies('Cookie: sid=abc', 'auto', NOW);
    expect(r.entries[0].name).toBe('sid');
  });

  it('値に = を含んでも最初の = で分割する', () => {
    const r = parseCookies('t=a=b==', 'cookie', NOW);
    expect(r.entries[0].value).toBe('a=b==');
  });

  it('= がないペアと同名の重複を指摘する', () => {
    const r = parseCookies('x; a=1; a=2', 'cookie', NOW);
    expect(r.entries[0].issues).toContain('noEquals');
    expect(r.entries[1].issues).toContain('duplicateName');
    expect(r.entries[2].issues).toContain('duplicateName');
  });

  it('パーセントエンコードを復号する', () => {
    const r = parseCookies('n=%E3%81%82', 'cookie', NOW);
    expect(r.entries[0].decoded).toBe('あ');
    expect(
      parseCookies('n=%E3%81', 'cookie', NOW).entries[0].decoded,
    ).toBeNull();
  });

  it('空入力は空の結果', () => {
    expect(parseCookies('  \n ', 'auto', NOW)).toEqual({
      entries: [],
      detected: null,
    });
  });
});

describe('parseCookies: Set-Cookie', () => {
  const line =
    'Set-Cookie: sid=abc123; Domain=example.com; Path=/; Expires=Wed, 21 Oct 2026 07:28:00 GMT; Max-Age=3600; Secure; HttpOnly; SameSite=Lax; Partitioned; Priority=High';

  it('全属性を分解する', () => {
    const r = parseCookies(line, 'auto', NOW);
    expect(r.detected).toBe('set');
    const a = r.entries[0].attributes!;
    expect(r.entries[0].name).toBe('sid');
    expect(a.domain).toBe('example.com');
    expect(a.path).toBe('/');
    expect(a.expires?.ms).toBe(Date.parse('2026-10-21T07:28:00Z'));
    expect(a.maxAge?.seconds).toBe(3600);
    expect(a.secure).toBe(true);
    expect(a.httpOnly).toBe(true);
    expect(a.sameSite?.value).toBe('lax');
    expect(a.partitioned).toBe(true);
    expect(a.priority).toBe('High');
  });

  it('Max-Age が Expires より優先され、両方指定は info として出る', () => {
    const e = parseCookies(line, 'auto', NOW).entries[0];
    expect(e.lifetime).toBe('persistent');
    expect(e.issues).toContain('bothExpiry');
    expect(e.issues).not.toContain('expired');
  });

  it('属性名は大文字小文字を区別しない', () => {
    const a = parseCookies(
      'a=1; SECURE; httponly; samesite=STRICT',
      'set-cookie',
      NOW,
    ).entries[0].attributes!;
    expect(a.secure && a.httpOnly).toBe(true);
    expect(a.sameSite?.value).toBe('strict');
  });

  it('接頭辞なしでも属性があれば Set-Cookie と判定する', () => {
    expect(looksLikeSetCookie('a=1; Path=/')).toBe(true);
    expect(looksLikeSetCookie('a=1; b=2')).toBe(false);
    expect(parseCookies('a=1; Path=/', 'auto', NOW).detected).toBe('set');
  });

  it('SameSite=None で Secure がないと警告', () => {
    const e = parseCookies('a=1; SameSite=None', 'set-cookie', NOW).entries[0];
    expect(e.issues).toContain('sameSiteNoneNoSecure');
    const ok = parseCookies('a=1; SameSite=None; Secure', 'set-cookie', NOW)
      .entries[0];
    expect(ok.issues).not.toContain('sameSiteNoneNoSecure');
  });

  it('不正な SameSite / Expires / Max-Age を検出する', () => {
    const e = parseCookies(
      'a=1; SameSite=Bogus; Expires=nope; Max-Age=1.5',
      'set-cookie',
      NOW,
    ).entries[0];
    expect(e.issues).toEqual(
      expect.arrayContaining([
        'sameSiteInvalid',
        'expiresInvalid',
        'maxAgeInvalid',
      ]),
    );
  });

  it('Partitioned は Secure が必要', () => {
    const e = parseCookies('a=1; Partitioned', 'set-cookie', NOW).entries[0];
    expect(e.issues).toContain('partitionedNoSecure');
  });

  it('Max-Age=0 や過去の Expires は削除扱い', () => {
    const a = parseCookies('a=; Max-Age=0', 'set-cookie', NOW).entries[0];
    expect(a.lifetime).toBe('expired');
    const b = parseCookies(
      'a=1; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'set-cookie',
      NOW,
    ).entries[0];
    expect(b.lifetime).toBe('expired');
    expect(parseCookies('a=1', 'set-cookie', NOW).entries[0].lifetime).toBe(
      'session',
    );
  });

  it('400 日を超える有効期限を指摘する', () => {
    const e = parseCookies('a=1; Max-Age=40000000', 'set-cookie', NOW)
      .entries[0];
    expect(e.issues).toContain('lifetimeOver400d');
  });

  it('__Host- / __Secure- 接頭辞の条件を検証する', () => {
    const bad = parseCookies(
      '__Host-a=1; Secure; Domain=example.com; Path=/',
      'set-cookie',
      NOW,
    ).entries[0];
    expect(bad.issues).toContain('prefixHostInvalid');
    const good = parseCookies('__Host-a=1; Secure; Path=/', 'set-cookie', NOW)
      .entries[0];
    expect(good.issues).not.toContain('prefixHostInvalid');
    const sec = parseCookies('__Secure-a=1', 'set-cookie', NOW).entries[0];
    expect(sec.issues).toContain('prefixSecureInvalid');
  });

  it('未知の属性は unknownAttributes に入る', () => {
    const e = parseCookies('a=1; Foo=bar', 'set-cookie', NOW).entries[0];
    expect(e.unknownAttributes).toEqual([{ name: 'Foo', value: 'bar' }]);
  });

  it('Secure / HttpOnly / SameSite 未指定は info', () => {
    const e = parseCookies('a=1', 'set-cookie', NOW).entries[0];
    expect(e.issues).toEqual(
      expect.arrayContaining([
        'secureMissing',
        'httpOnlyMissing',
        'sameSiteMissing',
      ]),
    );
  });

  it('複数行を混在して処理する', () => {
    const r = parseCookies(
      'Set-Cookie: a=1; Path=/\r\nCookie: b=2; c=3',
      'auto',
      NOW,
    );
    expect(r.detected).toBe('mixed');
    expect(r.entries).toHaveLength(3);
  });
});

describe('補助関数', () => {
  it('maskValue は先頭 2 文字だけ残す', () => {
    expect(maskValue('')).toBe('');
    expect(maskValue('abc')).toBe('•••');
    expect(maskValue('abcdef')).toBe('ab••••');
    expect(maskValue('abcdefghijklmnopqrstuvwxyz')).toBe('ab' + '•'.repeat(10));
  });

  it('toJson は値をマスクできる', () => {
    const { entries } = parseCookies('sid=SECRETVALUE', 'cookie', NOW);
    expect(toJson(entries, false)).not.toContain('SECRETVALUE');
    expect(toJson(entries, true)).toContain('SECRETVALUE');
  });

  it('splitDuration は秒を分解する', () => {
    expect(splitDuration(90061)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
    });
    expect(splitDuration(-60).minutes).toBe(1);
    expect(splitDuration(0)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('maskValue は 4 文字以下を全マスク、5 文字以上は先頭 2 文字だけ残す', () => {
    expect(maskValue('abcd')).toBe('••••');
    expect(maskValue('abcde')).toBe('ab•••');
  });

  it('toJson は日本語の値もマスクする', () => {
    const { entries } = parseCookies('名前=秘密の値', 'cookie', NOW);
    expect(toJson(entries, false)).not.toContain('秘密の値');
    expect(toJson(entries, true)).toContain('秘密の値');
  });
});

describe('入力パターンと境界', () => {
  it('= で始まる（名前が空）の Cookie を emptyName と判定する', () => {
    expect(parseCookies('=abc', 'cookie', NOW).entries[0].issues).toContain(
      'emptyName',
    );
    expect(
      parseCookies('=abc; Path=/', 'set-cookie', NOW).entries[0].issues,
    ).toContain('emptyName');
  });

  it('セミコロンだけの入力は要素ゼロ', () => {
    expect(parseCookies(';;;', 'cookie', NOW).entries).toEqual([]);
  });

  it('日本語の名前と値をそのまま分解する', () => {
    const e = parseCookies('名前=値テスト', 'cookie', NOW).entries[0];
    expect([e.name, e.value, e.decoded]).toEqual(['名前', '値テスト', null]);
  });

  it('LF と CRLF が混在しても行ごとに分解する', () => {
    expect(parseCookies('a=1\r\nb=2\nc=3', 'cookie', NOW).entries).toHaveLength(
      3,
    );
  });

  it('大量の行でも全件処理し、重複を全件指摘する', () => {
    const text = Array.from({ length: 3000 }, () => 'dup=1').join('\n');
    const { entries } = parseCookies(text, 'cookie', NOW);
    expect(entries).toHaveLength(3000);
    expect(entries.every((e) => e.issues.includes('duplicateName'))).toBe(true);
  });
});
