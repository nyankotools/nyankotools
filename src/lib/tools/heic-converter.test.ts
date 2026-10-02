import { describe, it, expect } from 'vitest';
import {
  buildHeicOutputFileName,
  getHeicOutputOption,
  hasHeifSignature,
} from './heic-converter';

function ftyp(brand: string): Uint8Array {
  const bytes = new Uint8Array(24);
  bytes.set([0, 0, 0, 24], 0);
  bytes.set(
    Array.from('ftyp', (c) => c.charCodeAt(0)),
    4,
  );
  bytes.set(
    Array.from(brand, (c) => c.charCodeAt(0)),
    8,
  );
  return bytes;
}

describe('hasHeifSignature', () => {
  it('HEIC/HEIFのブランドを検出する', () => {
    for (const brand of ['heic', 'heix', 'mif1', 'msf1', 'hevc']) {
      expect(hasHeifSignature(ftyp(brand))).toBe(true);
    }
  });

  it('それ以外のブランド・短すぎるデータ・PNGは検出しない', () => {
    expect(hasHeifSignature(ftyp('isom'))).toBe(false);
    expect(hasHeifSignature(new Uint8Array(8))).toBe(false);
    expect(
      hasHeifSignature(
        new Uint8Array([
          0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13,
        ]),
      ),
    ).toBe(false);
  });
});

describe('buildHeicOutputFileName', () => {
  it('拡張子を変換先に置き換える', () => {
    expect(buildHeicOutputFileName('IMG_0001.HEIC', 'jpeg')).toBe(
      'IMG_0001.jpg',
    );
    expect(buildHeicOutputFileName('a.b.heic', 'png')).toBe('a.b.png');
    expect(buildHeicOutputFileName('noext', 'webp')).toBe('noext.webp');
  });
});

describe('getHeicOutputOption', () => {
  it('PNGは画質設定が無効', () => {
    expect(getHeicOutputOption('png').supportsQuality).toBe(false);
    expect(getHeicOutputOption('jpeg').supportsQuality).toBe(true);
  });
});
