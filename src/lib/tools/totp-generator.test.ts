import { describe, it, expect } from 'vitest';
import {
  decodeBase32,
  encodeBase32,
  generateSecret,
  parseOtpauthUri,
  secondsRemaining,
  totp,
  verifyTotp,
  type TotpAlgorithm,
} from './totp-generator';

const enc = new TextEncoder();
const SECRETS: Record<TotpAlgorithm, Uint8Array> = {
  'SHA-1': enc.encode('12345678901234567890'),
  'SHA-256': enc.encode('12345678901234567890123456789012'),
  'SHA-512': enc.encode(
    '1234567890123456789012345678901234567890123456789012345678901234',
  ),
};

describe('totp（RFC 6238 テストベクタ）', () => {
  const vectors: [TotpAlgorithm, number, string][] = [
    ['SHA-1', 59, '94287082'],
    ['SHA-1', 1111111109, '07081804'],
    ['SHA-1', 20000000000, '65353130'],
    ['SHA-256', 59, '46119246'],
    ['SHA-512', 59, '90693936'],
  ];
  for (const [algorithm, seconds, code] of vectors) {
    it(`${algorithm} t=${seconds} → ${code}`, async () => {
      const result = await totp(SECRETS[algorithm], seconds * 1000, {
        period: 30,
        digits: 8,
        algorithm,
      });
      expect(result).toBe(code);
    });
  }

  it('6桁は8桁の下6桁と一致する', async () => {
    const result = await totp(SECRETS['SHA-1'], 59_000);
    expect(result).toBe('287082');
  });
});

describe('Base32', () => {
  it('RFC 4648 のエンコード・デコードができる', () => {
    expect(encodeBase32(enc.encode('12345678901234567890'))).toBe(
      'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ',
    );
    expect(encodeBase32(enc.encode('foobar'))).toBe('MZXW6YTBOI');
    expect(decodeBase32('MZXW6YTBOI')).toEqual(enc.encode('foobar'));
  });

  it('小文字・空白・ハイフン・パディングを許容する', () => {
    expect(decodeBase32('mzxw 6ytb-oi======')).toEqual(enc.encode('foobar'));
  });

  it('不正文字・空は null', () => {
    expect(decodeBase32('MZXW1')).toBeNull();
    expect(decodeBase32('  ')).toBeNull();
  });

  it('generateSecret は20バイトぶん（32文字）のBase32を返す', () => {
    const secret = generateSecret();
    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
    expect(decodeBase32(secret)?.length).toBe(20);
  });
});

describe('verifyTotp', () => {
  it('現在・前後1ステップのコードを許容し、ずれを返す', async () => {
    const now = 1_000_000_000_000;
    const secret = SECRETS['SHA-1'];
    const current = await totp(secret, now);
    const previous = await totp(secret, now - 30_000);
    const next = await totp(secret, now + 30_000);
    expect(await verifyTotp(secret, current, now)).toBe(0);
    expect(await verifyTotp(secret, previous, now)).toBe(-1);
    expect(await verifyTotp(secret, next, now)).toBe(1);
  });

  it('範囲外・桁数違い・数字以外は null', async () => {
    const now = 1_000_000_000_000;
    const secret = SECRETS['SHA-1'];
    const old = await totp(secret, now - 120_000);
    expect(await verifyTotp(secret, old, now)).toBeNull();
    expect(await verifyTotp(secret, '12345', now)).toBeNull();
    expect(await verifyTotp(secret, 'abcdef', now)).toBeNull();
  });

  it('window=0 なら前後は不一致', async () => {
    const now = 1_000_000_000_000;
    const secret = SECRETS['SHA-1'];
    const previous = await totp(secret, now - 30_000);
    expect(
      await verifyTotp(
        secret,
        previous,
        now,
        { period: 30, digits: 6, algorithm: 'SHA-1' },
        0,
      ),
    ).toBeNull();
  });
});

describe('secondsRemaining', () => {
  it('周期の境界で period 、直前で 1 を返す', () => {
    expect(secondsRemaining(0, 30)).toBe(30);
    expect(secondsRemaining(29_999, 30)).toBe(1);
    expect(secondsRemaining(30_000, 30)).toBe(30);
    expect(secondsRemaining(45_000, 30)).toBe(15);
  });
});

describe('parseOtpauthUri', () => {
  it('URIから各パラメータを取り出す', () => {
    const result = parseOtpauthUri(
      'otpauth://totp/Example:alice%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Example&algorithm=SHA256&digits=8&period=60',
    );
    expect(result).toEqual({
      secret: 'JBSWY3DPEHPK3PXP',
      algorithm: 'SHA-256',
      digits: 8,
      period: 60,
      issuer: 'Example',
      label: 'Example:alice@example.com',
    });
  });

  it('省略されたパラメータは含めない', () => {
    expect(parseOtpauthUri('otpauth://totp/x?secret=ABC')).toEqual({
      secret: 'ABC',
      label: 'x',
    });
  });

  it('TOTP以外・secretなし・URLでない文字列は null', () => {
    expect(parseOtpauthUri('otpauth://hotp/x?secret=ABC')).toBeNull();
    expect(parseOtpauthUri('otpauth://totp/x')).toBeNull();
    expect(parseOtpauthUri('JBSWY3DPEHPK3PXP')).toBeNull();
  });
});

describe('堅牢性', () => {
  it('5bit未満しかないBase32（例: A）は null', () => {
    expect(decodeBase32('A')).toBeNull();
  });

  it('不正なパーセントエンコードのラベルでも例外を投げない', () => {
    expect(parseOtpauthUri('otpauth://totp/%E0%A4%A?secret=ABC')).toEqual({
      secret: 'ABC',
    });
  });
});
