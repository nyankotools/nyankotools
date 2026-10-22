import { describe, it, expect } from 'vitest';
import {
  combineShares,
  gfDiv,
  gfMul,
  splitSecret,
  splitShareLines,
} from './shamir-secret-sharing';

function split(secret: string, n: number, k: number): string[] {
  const r = splitSecret(secret, n, k);
  if (!r.success) throw new Error(r.error);
  return r.shares;
}

function pick<T>(items: T[], indexes: number[]): T[] {
  return indexes.map((i) => items[i]);
}

describe('GF(256)', () => {
  it('既知の積（AESの例: 0x57 * 0x83 = 0xc1）', () => {
    expect(gfMul(0x57, 0x83)).toBe(0xc1);
  });
  it('除算は乗算の逆', () => {
    for (const a of [1, 2, 3, 0x57, 0xff]) {
      for (const b of [1, 5, 0x83, 0xfe]) {
        expect(gfDiv(gfMul(a, b), b)).toBe(a);
      }
    }
    expect(gfMul(0, 7)).toBe(0);
    expect(() => gfDiv(1, 0)).toThrow();
  });
});

describe('splitSecret / combineShares', () => {
  it('n個に分割し、先頭にバージョン・k・x座標を持つ16進になる', () => {
    const shares = split('hello', 5, 3);
    expect(shares).toHaveLength(5);
    shares.forEach((s, i) => {
      expect(s).toMatch(/^[0-9a-f]+$/);
      expect(s.slice(0, 6)).toBe(
        `0103${(i + 1).toString(16).padStart(2, '0')}`,
      );
      expect(s.length).toBe(6 + ('hello'.length + 4) * 2);
    });
  });

  it('任意のk個の組み合わせで復元できる（3-of-5 の全組み合わせ）', () => {
    const secret = 'パスワード 🐱 secret!';
    const shares = split(secret, 5, 3);
    for (let a = 0; a < 5; a++) {
      for (let b = a + 1; b < 5; b++) {
        for (let c = b + 1; c < 5; c++) {
          expect(combineShares(pick(shares, [c, a, b]))).toEqual({
            success: true,
            secret,
          });
        }
      }
    }
  });

  it('k個より多くても全てで復元できる', () => {
    const shares = split('abc', 6, 2);
    expect(combineShares(shares)).toEqual({ success: true, secret: 'abc' });
  });

  it('最小(2-of-2)と最大(255-of-255 / 3-of-255)でも動く', () => {
    expect(combineShares(split('x', 2, 2))).toEqual({
      success: true,
      secret: 'x',
    });
    const big = split('max', 255, 255);
    expect(big).toHaveLength(255);
    expect(combineShares(big)).toEqual({ success: true, secret: 'max' });
    const wide = split('wide', 255, 3);
    expect(combineShares(pick(wide, [0, 100, 254]))).toEqual({
      success: true,
      secret: 'wide',
    });
  });

  it('長い秘密でも復元できる', () => {
    const secret = 'あ'.repeat(2000);
    const shares = split(secret, 4, 4);
    expect(combineShares(shares)).toEqual({ success: true, secret });
  });

  it('k-1個では復元できない', () => {
    const shares = split('top secret', 5, 3);
    expect(combineShares(pick(shares, [0, 1]))).toEqual({
      success: false,
      error: 'not-enough-shares',
    });
  });

  it('しきい値の確認を迂回した場合もk-1個から秘密は得られない', () => {
    // k を 2 に書き換えて不足を偽装しても、チェックサムで破損として弾かれる
    const shares = split('top secret', 5, 3).map((s) => '0102' + s.slice(4));
    const r = combineShares(pick(shares, [0, 1]));
    expect(r.success).toBe(false);
  });

  it('同じ入力でも毎回シェアが変わる（ランダム係数）', () => {
    expect(split('same', 3, 2)[0]).not.toBe(split('same', 3, 2)[0]);
  });

  it('乱数源を差し替えられる（決定的なテスト用）', () => {
    const fixed = (b: Uint8Array) => b.fill(0x55);
    const a = splitSecret('abc', 3, 2, fixed);
    const b = splitSecret('abc', 3, 2, fixed);
    expect(a).toEqual(b);
  });

  it('大文字・空白・改行を含む貼り付けも受け付ける', () => {
    const shares = split('ok', 3, 2);
    const messy = [
      ' ' + shares[2].toUpperCase() + '\n',
      shares[0].replace(/(.{4})/g, '$1 '),
    ];
    expect(combineShares(messy)).toEqual({ success: true, secret: 'ok' });
  });
});

describe('splitSecret のエラー', () => {
  it('空の秘密', () => {
    expect(splitSecret('', 3, 2)).toEqual({
      success: false,
      error: 'empty-secret',
    });
  });
  it('n が範囲外・非整数', () => {
    for (const n of [1, 0, 256, 2.5, NaN, -3]) {
      expect(splitSecret('a', n, 2)).toEqual({
        success: false,
        error: 'invalid-count',
      });
    }
  });
  it('k < 2 または非整数', () => {
    for (const k of [1, 0, -1, 2.5, NaN]) {
      expect(splitSecret('a', 3, k)).toEqual({
        success: false,
        error: 'invalid-threshold',
      });
    }
  });
  it('k > n', () => {
    expect(splitSecret('a', 3, 4)).toEqual({
      success: false,
      error: 'threshold-exceeds-count',
    });
  });
});

describe('combineShares のエラー', () => {
  const shares = split('secret', 4, 2);

  it('シェアなし', () => {
    expect(combineShares([])).toEqual({ success: false, error: 'no-shares' });
  });
  it('不正な形式（16進以外・奇数桁・短すぎ・バージョン違い・x=0）', () => {
    for (const bad of [
      'zzzz',
      shares[0] + '0',
      '010201',
      '02' + shares[0].slice(2),
      '0102' + '00' + shares[0].slice(6),
      '',
    ]) {
      expect(combineShares([shares[0], bad])).toEqual({
        success: false,
        error: 'invalid-format',
        index: 1,
      });
    }
  });
  it('x座標の重複', () => {
    expect(combineShares([shares[0], shares[0]])).toEqual({
      success: false,
      error: 'duplicate-x',
      index: 1,
    });
  });
  it('長さの不一致', () => {
    const other = split('longer secret', 4, 2);
    expect(combineShares([shares[0], other[1]])).toEqual({
      success: false,
      error: 'length-mismatch',
      index: 1,
    });
  });
  it('しきい値の不一致', () => {
    const other = split('secret', 4, 3);
    expect(combineShares([shares[0], other[1]])).toEqual({
      success: false,
      error: 'threshold-mismatch',
      index: 1,
    });
  });
  it('別の秘密のシェアを混ぜると破損として検出される', () => {
    const other = split('Secret', 4, 2);
    expect(combineShares([shares[0], other[1]])).toEqual({
      success: false,
      error: 'corrupted',
    });
  });
  it('シェアの1文字が変わると破損として検出される', () => {
    // 確実に別の文字にして、必ず1バイトのデータ改ざんにする
    const replacement = shares[1][8] === 'f' ? '0' : 'f';
    const tampered = shares[1].slice(0, 8) + replacement + shares[1].slice(9);
    const r = combineShares([shares[0], tampered]);
    expect(r).toEqual({ success: false, error: 'corrupted' });
  });
});

describe('splitShareLines', () => {
  it('改行区切りで分け、空行と前後空白を除く', () => {
    expect(splitShareLines(' a \r\n\n b\n')).toEqual(['a', 'b']);
    expect(splitShareLines('')).toEqual([]);
  });
});

describe('大きな秘密', () => {
  it('乱数が65536バイトを超えても分割・復元できる', () => {
    const secret = 'a'.repeat(40000);
    const shares = split(secret, 3, 3);
    const r = combineShares(shares);
    expect(r.success && r.secret).toBe(secret);
  });
});
