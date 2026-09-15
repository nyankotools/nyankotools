import { describe, expect, it } from 'vitest';
import { computeHash, computeHashes } from './hash-generator';

describe('computeHash', () => {
  it('MD5: 空文字列のハッシュ値が既知の値と一致する', async () => {
    expect(await computeHash('', 'MD5')).toBe(
      'd41d8cd98f00b204e9800998ecf8427e',
    );
  });

  it('MD5: "abc"のハッシュ値が既知の値と一致する', async () => {
    expect(await computeHash('abc', 'MD5')).toBe(
      '900150983cd24fb0d6963f7d28e17f72',
    );
  });

  it('MD5: 日本語（マルチバイト文字）を正しくハッシュ化できる', async () => {
    expect(await computeHash('こんにちは', 'MD5')).toBe(
      'c0e89a293bd36c7a768e4e9d2c5475a8',
    );
  });

  it('SHA-1: "abc"のハッシュ値が既知の値と一致する', async () => {
    expect(await computeHash('abc', 'SHA-1')).toBe(
      'a9993e364706816aba3e25717850c26c9cd0d89d',
    );
  });

  it('SHA-1: 空文字列のハッシュ値が既知の値と一致する', async () => {
    expect(await computeHash('', 'SHA-1')).toBe(
      'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    );
  });

  it('SHA-256: "abc"のハッシュ値が既知の値と一致する', async () => {
    expect(await computeHash('abc', 'SHA-256')).toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    );
  });

  it('SHA-256: 空文字列のハッシュ値が既知の値と一致する', async () => {
    expect(await computeHash('', 'SHA-256')).toBe(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    );
  });
});

describe('computeHashes', () => {
  it('指定した全アルゴリズムの結果をまとめて返す', async () => {
    const result = await computeHashes('abc', ['MD5', 'SHA-1', 'SHA-256']);
    expect(result).toEqual({
      MD5: '900150983cd24fb0d6963f7d28e17f72',
      'SHA-1': 'a9993e364706816aba3e25717850c26c9cd0d89d',
      'SHA-256':
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    });
  });
});
