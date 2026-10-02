import { describe, expect, it } from 'vitest';
import {
  compareHash,
  computeFileHashes,
  normalizeHashInput,
} from './file-hash-calculator';

const enc = (s: string) => new TextEncoder().encode(s);

describe('computeFileHashes', () => {
  it('"hello" の各ハッシュ値が一致する', async () => {
    const h = await computeFileHashes(enc('hello'));
    expect(h.MD5).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(h['SHA-1']).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
    expect(h['SHA-256']).toBe(
      '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
    );
    expect(h['SHA-384']).toHaveLength(96);
    expect(h['SHA-512']).toHaveLength(128);
  });

  it('空データのハッシュ値を計算できる', async () => {
    const h = await computeFileHashes(new Uint8Array(0));
    expect(h.MD5).toBe('d41d8cd98f00b204e9800998ecf8427e');
    expect(h['SHA-256']).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('normalizeHashInput', () => {
  it('空白除去・小文字化・接頭辞除去を行う', () => {
    expect(normalizeHashInput('  AB CD\n')).toBe('abcd');
    expect(normalizeHashInput('SHA256: ABCD')).toBe('abcd');
    expect(normalizeHashInput('sha-256=abcd')).toBe('abcd');
    const md5 = '5d41402abc4b2a76b9719d911017c592';
    expect(normalizeHashInput(`${md5}  hello.iso`)).toBe(md5);
    expect(normalizeHashInput(md5.replace(/(..)/g, '$1 ').trim())).toBe(md5);
  });
});

describe('compareHash', () => {
  it('一致・不一致・不正・空を判定する', async () => {
    const h = await computeFileHashes(enc('hello'));
    expect(compareHash('', h)).toEqual({ status: 'empty' });
    expect(compareHash(h.MD5.toUpperCase(), h)).toEqual({
      status: 'match',
      algorithm: 'MD5',
    });
    expect(compareHash(`sha256: ${h['SHA-256']}`, h)).toEqual({
      status: 'match',
      algorithm: 'SHA-256',
    });
    expect(compareHash('0'.repeat(40), h)).toEqual({
      status: 'mismatch',
      algorithm: 'SHA-1',
    });
    expect(compareHash('abc', h)).toEqual({ status: 'invalid' });
    expect(compareHash('z'.repeat(32), h)).toEqual({ status: 'invalid' });
  });
});
