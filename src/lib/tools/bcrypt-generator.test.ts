import { describe, expect, it } from 'vitest';
import {
  hashPassword,
  parseBcryptHash,
  passwordByteLength,
  verifyPassword,
} from './bcrypt-generator';

// PHPマニュアルに載っている既知のペア（パスワード "rasmuslerdorf"、2y、cost 7）
const KNOWN = '$2y$07$BCryptRequires22Chrcte/VlQH0piJtjXl.0t1XkA8pw9dMXTpOq';

describe('hashPassword', () => {
  it('生成したハッシュを検証できる（cost 4で高速化）', async () => {
    const result = await hashPassword('secret', 4);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.hash).toMatch(/^\$2[ab]\$04\$.{53}$/);
    expect(await verifyPassword('secret', result.hash)).toEqual({
      success: true,
      match: true,
    });
    expect(await verifyPassword('Secret', result.hash)).toEqual({
      success: true,
      match: false,
    });
  });

  it('同じパスワードでもソルトが違うのでハッシュは毎回変わる', async () => {
    const a = await hashPassword('same', 4);
    const b = await hashPassword('same', 4);
    expect(a.success && b.success && a.hash !== b.hash).toBe(true);
  });

  it('範囲外のコストは invalid-cost', async () => {
    for (const cost of [3, 15, 10.5]) {
      expect(await hashPassword('x', cost)).toEqual({
        success: false,
        error: 'invalid-cost',
      });
    }
  });

  it('72バイトを超えるパスワードは拒否する（マルチバイトはバイト数で判定）', async () => {
    expect((await hashPassword('a'.repeat(72), 4)).success).toBe(true);
    expect(await hashPassword('a'.repeat(73), 4)).toEqual({
      success: false,
      error: 'password-too-long',
    });
    // 「あ」は3バイトなので24文字で72バイト
    expect((await hashPassword('あ'.repeat(24), 4)).success).toBe(true);
    expect((await hashPassword('あ'.repeat(25), 4)).success).toBe(false);
  });
});

describe('verifyPassword', () => {
  it('既知のハッシュと一致する', async () => {
    expect(await verifyPassword('rasmuslerdorf', KNOWN)).toEqual({
      success: true,
      match: true,
    });
    expect(await verifyPassword('wrong', KNOWN)).toEqual({
      success: true,
      match: false,
    });
  });

  it('前後の空白を許容し、形式が不正なら invalid-hash', async () => {
    expect((await verifyPassword('rasmuslerdorf', ` ${KNOWN}\n`)).success).toBe(
      true,
    );
    expect(await verifyPassword('rasmuslerdorf', 'not-a-hash')).toEqual({
      success: false,
      error: 'invalid-hash',
    });
  });
});

describe('parseBcryptHash', () => {
  it('バージョン・コスト・ソルト・ダイジェストに分解する', () => {
    expect(parseBcryptHash(KNOWN)).toEqual({
      version: '2y',
      cost: 7,
      salt: 'BCryptRequires22Chrcte',
      digest: '/VlQH0piJtjXl.0t1XkA8pw9dMXTpOq',
    });
  });

  it('長さ・コストが不正なら null', () => {
    expect(parseBcryptHash(KNOWN.slice(0, -1))).toBeNull();
    expect(parseBcryptHash(KNOWN.replace('$07$', '$03$'))).toBeNull();
    expect(parseBcryptHash('')).toBeNull();
  });
});

describe('passwordByteLength', () => {
  it('UTF-8のバイト数を返す', () => {
    expect(passwordByteLength('aあ😀')).toBe(1 + 3 + 4);
  });
});
