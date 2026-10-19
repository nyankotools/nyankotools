import bcrypt from 'bcryptjs';
import { describe, expect, it } from 'vitest';
import {
  MAX_USERS,
  basicAuthHeader,
  generateHtpasswd,
  parseUsers,
  sha1Htpasswd,
  toApacheBcrypt,
  utf8ToBase64,
} from './htpasswd-generator';

describe('parseUsers', () => {
  it('1行1ユーザーを解析し、空行とCRLFを許容する', () => {
    const r = parseUsers('alice:pw1\r\n\r\nbob:pw2\n');
    expect(r.entries).toEqual([
      { line: 1, username: 'alice', password: 'pw1' },
      { line: 3, username: 'bob', password: 'pw2' },
    ]);
    expect(r.issues).toEqual([]);
  });

  it('最初のコロンで分割し、パスワードにコロンを含められる', () => {
    expect(parseUsers('a:b:c').entries[0]).toMatchObject({
      username: 'a',
      password: 'b:c',
    });
  });

  it('不正な行を行番号つきで報告する', () => {
    const r = parseUsers(
      ['nocolon', ':pw', 'u:', ' sp:pw', 'ok:pw', 'ok:other'].join('\n'),
    );
    expect(r.issues).toEqual([
      { line: 1, error: 'missing-colon' },
      { line: 2, error: 'empty-username' },
      { line: 3, error: 'empty-password' },
      { line: 4, error: 'invalid-username' },
      { line: 6, error: 'duplicate-username' },
    ]);
    expect(r.entries).toHaveLength(1);
  });

  it('ユーザー数の上限を超えると truncated になる', () => {
    const text = Array.from(
      { length: MAX_USERS + 1 },
      (_, i) => `u${i}:p`,
    ).join('\n');
    const r = parseUsers(text);
    expect(r.entries).toHaveLength(MAX_USERS);
    expect(r.truncated).toBe(true);
  });
});

describe('sha1Htpasswd', () => {
  it('htpasswd -s と同じ結果になる', async () => {
    expect(await sha1Htpasswd('password')).toBe(
      '{SHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g=',
    );
  });
});

describe('basicAuthHeader', () => {
  it('RFC 7617 の例と一致する', () => {
    expect(basicAuthHeader('Aladdin', 'open sesame')).toBe(
      'Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==',
    );
  });

  it('日本語はUTF-8でエンコードする', () => {
    expect(utf8ToBase64('あ')).toBe('44GC');
  });
});

describe('toApacheBcrypt', () => {
  it('$2a$/$2b$を$2y$に揃え、他はそのまま', () => {
    expect(toApacheBcrypt('$2b$04$abc')).toBe('$2y$04$abc');
    expect(toApacheBcrypt('$2a$04$abc')).toBe('$2y$04$abc');
    expect(toApacheBcrypt('$2y$04$abc')).toBe('$2y$04$abc');
  });
});

describe('generateHtpasswd', () => {
  it('SHA-1で複数ユーザーの行とヘッダーを作る', async () => {
    const r = await generateHtpasswd('alice:password\nbob:x', 'sha1', 10);
    expect(r.lines[0]).toBe('alice:{SHA}W6ph5Mm5Pz8GgiULbPgzG37mj9g=');
    expect(r.lines).toHaveLength(2);
    expect(r.headers[0]).toBe(basicAuthHeader('alice', 'password'));
    expect(r.issues).toEqual([]);
  });

  it('bcryptは$2y$で出力され、元のパスワードで検証できる', async () => {
    const r = await generateHtpasswd('alice:secret', 'bcrypt', 4);
    const [user, hash] = r.lines[0].split(/:(.*)/s);
    expect(user).toBe('alice');
    expect(hash).toMatch(/^\$2y\$04\$.{53}$/);
    expect(await bcrypt.compare('secret', hash)).toBe(true);
  });

  it('bcryptで72バイト超のパスワードは行ごとにエラーにし、他は生成する', async () => {
    const r = await generateHtpasswd(
      `long:${'a'.repeat(73)}\nshort:ok`,
      'bcrypt',
      4,
    );
    expect(r.lines).toHaveLength(1);
    expect(r.issues).toEqual([{ line: 1, error: 'password-too-long' }]);
  });

  it('SHA-1なら長いパスワードも通る', async () => {
    const r = await generateHtpasswd(`long:${'a'.repeat(200)}`, 'sha1', 10);
    expect(r.lines).toHaveLength(1);
  });

  it('範囲外のコストは例外', async () => {
    await expect(generateHtpasswd('a:b', 'bcrypt', 99)).rejects.toThrow(
      RangeError,
    );
  });

  it('入力が空なら何も出力しない', async () => {
    const r = await generateHtpasswd('  \n', 'sha1', 10);
    expect(r.lines).toEqual([]);
    expect(r.issues).toEqual([]);
  });
});
