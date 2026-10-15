import { createHmac } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { applyTimestamps, generateJwt } from './jwt-generator';

// jwt.io の既定サンプル（secret: your-256-bit-secret）
const HEADER = '{"alg":"HS256","typ":"JWT"}';
const PAYLOAD = '{"sub":"1234567890","name":"John Doe","iat":1516239022}';
const EXPECTED =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Node の crypto で独立に署名を計算して照合する（実装と同じ経路を使わない）
function nodeSign(
  signingInput: string,
  key: Buffer,
  hash: 'sha256' | 'sha384' | 'sha512',
): string {
  return createHmac(hash, key).update(signingInput).digest('base64url');
}

describe('generateJwt', () => {
  it.each([
    ['HS256', 'sha256'],
    ['HS384', 'sha384'],
    ['HS512', 'sha512'],
  ] as const)(
    '%s の署名が Node の createHmac と一致する（日本語・絵文字を含む鍵と本文）',
    async (algorithm, hash) => {
      const payload = '{"name":"山田太郎","emoji":"🐱😀","n":1}';
      const secret = 'ひみつのかぎ🔑';
      const result = await generateJwt(
        '{"typ":"JWT"}',
        payload,
        secret,
        'text',
        algorithm,
      );
      expect(result.success).toBe(true);
      if (!result.success) return;
      const [h, p, s] = result.token.split('.');
      const expectedSig = nodeSign(
        `${h}.${p}`,
        Buffer.from(secret, 'utf8'),
        hash,
      );
      expect(s).toBe(expectedSig);
      expect(JSON.parse(Buffer.from(p, 'base64url').toString('utf8'))).toEqual(
        JSON.parse(payload),
      );
      expect(JSON.parse(Buffer.from(h, 'base64url').toString('utf8'))).toEqual({
        typ: 'JWT',
        alg: algorithm,
      });
    },
  );

  it('ヘッダーのキー順を保ち、alg が既にあれば位置を変えずに値だけ置き換える', async () => {
    const result = await generateJwt(
      '{"typ":"JWT","alg":"none"}',
      '{}',
      'k',
      'text',
      'HS256',
    );
    expect(result.success && result.header).toBe('{"typ":"JWT","alg":"HS256"}');
  });

  it('CRLF や字下げを含む整形済みJSONでも生成できる', async () => {
    const pretty = '{\r\n  "sub": "1",\r\n  "admin": true\r\n}';
    const result = await generateJwt(pretty, pretty, 'k', 'text', 'HS256');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(JSON.parse(result.payload)).toEqual({ sub: '1', admin: true });
  });

  it('16進数の鍵は空白・コロン区切りを無視する', async () => {
    const plain = await generateJwt(HEADER, PAYLOAD, '616263', 'hex', 'HS256');
    const spaced = await generateJwt(
      HEADER,
      PAYLOAD,
      '61 62:63',
      'hex',
      'HS256',
    );
    expect(spaced).toEqual(plain);
  });

  it('奇数桁・非16進の鍵は invalid-hex、空の16進鍵は空の鍵として扱う', async () => {
    expect(await generateJwt(HEADER, PAYLOAD, 'abc', 'hex', 'HS256')).toEqual({
      success: false,
      error: 'invalid-hex',
    });
    expect(await generateJwt(HEADER, PAYLOAD, '', 'hex', 'HS256')).toEqual(
      await generateJwt(HEADER, PAYLOAD, '', 'text', 'HS256'),
    );
  });

  it('空文字や配列・数値のヘッダー/ペイロードは拒否する', async () => {
    expect(await generateJwt('', PAYLOAD, 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-header',
    });
    expect(await generateJwt('[]', PAYLOAD, 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-header',
    });
    expect(await generateJwt('1', PAYLOAD, 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-header',
    });
    expect(await generateJwt(HEADER, '', 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-payload',
    });
    expect(await generateJwt(HEADER, 'null', 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-payload',
    });
  });

  it('数百KBの大きなペイロードでも生成でき、ペイロードを復元できる', async () => {
    const big = JSON.stringify({ data: 'あ😀'.repeat(100_000) });
    const result = await generateJwt(HEADER, big, 'k', 'text', 'HS512');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.token.split('.')).toHaveLength(3);
    expect(JSON.parse(result.payload)).toEqual(JSON.parse(big));
  });

  it('jwt.io のサンプルと同じ HS256 トークンを生成する', async () => {
    const result = await generateJwt(
      HEADER,
      PAYLOAD,
      'your-256-bit-secret',
      'text',
      'HS256',
    );
    expect(result).toMatchObject({ success: true, token: EXPECTED });
  });

  it('選択したアルゴリズムでヘッダーの alg を上書きする', async () => {
    const result = await generateJwt(HEADER, PAYLOAD, 'k', 'text', 'HS512');
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(JSON.parse(result.header).alg).toBe('HS512');
    // HS512 の署名は 64 バイト = Base64URL 86 文字
    expect(result.token.split('.')[2]).toHaveLength(86);
  });

  it('typ が無ければ JWT を補う', async () => {
    const result = await generateJwt('{}', '{}', 'k', 'text', 'HS256');
    expect(result.success && JSON.parse(result.header)).toEqual({
      typ: 'JWT',
      alg: 'HS256',
    });
  });

  it('16進数の鍵を扱える', async () => {
    const text = await generateJwt(HEADER, PAYLOAD, 'abc', 'text', 'HS256');
    const hex = await generateJwt(HEADER, PAYLOAD, '616263', 'hex', 'HS256');
    expect(hex).toEqual(text);
  });

  it('日本語のペイロードをUTF-8で扱える', async () => {
    const result = await generateJwt(
      '{}',
      '{"name":"山田"}',
      'k',
      'text',
      'HS256',
    );
    expect(result.success).toBe(true);
  });

  it('不正な入力はエラーコードを返す', async () => {
    expect(await generateJwt('{', PAYLOAD, 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-header',
    });
    expect(await generateJwt(HEADER, '[1]', 'k', 'text', 'HS256')).toEqual({
      success: false,
      error: 'invalid-payload',
    });
    expect(await generateJwt(HEADER, PAYLOAD, 'zz', 'hex', 'HS256')).toEqual({
      success: false,
      error: 'invalid-hex',
    });
  });

  it('空の鍵でも生成できる', async () => {
    const result = await generateJwt(HEADER, PAYLOAD, '', 'text', 'HS256');
    expect(result.success).toBe(true);
  });
});

describe('generateJwt - 入力の保持', () => {
  it('2^53を超える整数や空白入り文字列をそのまま署名する', async () => {
    const result = await generateJwt(
      '{}',
      '{ "id": 12345678901234567890, "s": "a  b\\"c" }',
      'k',
      'text',
      'HS256',
    );
    expect(result.success && result.payload).toBe(
      '{"id":12345678901234567890,"s":"a  b\\"c"}',
    );
  });
});

describe('applyTimestamps', () => {
  it('iat と exp を設定する', () => {
    const out = applyTimestamps('{"sub":"1"}', 1_700_000_000_500, 3600);
    expect(JSON.parse(out as string)).toEqual({
      sub: '1',
      iat: 1_700_000_000,
      exp: 1_700_003_600,
    });
  });

  it('JSONオブジェクトでなければ null', () => {
    expect(applyTimestamps('nope', 0, 60)).toBeNull();
    expect(applyTimestamps('[]', 0, 60)).toBeNull();
    expect(applyTimestamps('null', 0, 60)).toBeNull();
    expect(applyTimestamps('', 0, 60)).toBeNull();
  });

  it('既存の iat / exp は上書きされ、他のクレームは保たれる', () => {
    const out = applyTimestamps('{"iat":1,"exp":2,"sub":"x"}', 10_000, 60);
    expect(JSON.parse(out as string)).toEqual({
      iat: 10,
      exp: 70,
      sub: 'x',
    });
  });

  it('空のオブジェクトと TTL 0 でも動く', () => {
    expect(JSON.parse(applyTimestamps('{}', 5_000, 0) as string)).toEqual({
      iat: 5,
      exp: 5,
    });
  });
});
