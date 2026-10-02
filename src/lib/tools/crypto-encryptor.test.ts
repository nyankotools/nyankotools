import { describe, it, expect } from 'vitest';
import { decryptText, encryptText } from './crypto-encryptor';

describe('crypto-encryptor', () => {
  it('暗号化したテキストを同じパスワードで復号できる（日本語・絵文字含む）', async () => {
    const plain = 'こんにちは 🐱\n2行目';
    const encrypted = await encryptText(plain, 'pass-word');
    expect(encrypted).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(await decryptText(encrypted, 'pass-word')).toEqual({
      success: true,
      text: plain,
    });
  });

  it('同じ入力でも毎回異なる出力になる（ソルト・IVがランダム）', async () => {
    const a = await encryptText('same', 'pw');
    const b = await encryptText('same', 'pw');
    expect(a).not.toBe(b);
  });

  it('パスワードが違う場合は wrong-password', async () => {
    const encrypted = await encryptText('secret', 'right');
    expect(await decryptText(encrypted, 'wrong')).toEqual({
      success: false,
      error: 'wrong-password',
    });
  });

  it('暗号文を改ざんすると復号に失敗する', async () => {
    const encrypted = await encryptText('secret', 'pw');
    const bytes = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0));
    bytes[bytes.length - 1] ^= 1;
    const tampered = btoa(String.fromCharCode(...bytes));
    expect(await decryptText(tampered, 'pw')).toEqual({
      success: false,
      error: 'wrong-password',
    });
  });

  it('Base64でない・短すぎる・バージョン違いは invalid-format', async () => {
    for (const payload of ['', 'not base64!!', 'AAAA', btoa('x'.repeat(60))]) {
      expect(await decryptText(payload, 'pw')).toEqual({
        success: false,
        error: 'invalid-format',
      });
    }
  });

  it('暗号文中の改行・空白は無視して復号できる', async () => {
    const encrypted = await encryptText('wrapped', 'pw');
    const wrapped = encrypted.replace(/(.{20})/g, '$1\n ');
    expect(await decryptText(wrapped, 'pw')).toEqual({
      success: true,
      text: 'wrapped',
    });
  });
});
