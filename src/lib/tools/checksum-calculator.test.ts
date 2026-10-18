import { describe, expect, it } from 'vitest';
import {
  checksumBytes,
  checksumText,
  compareChecksum,
  createChecksumState,
  normalizeChecksumInput,
} from './checksum-calculator';

describe('checksumText', () => {
  it('"123456789" の標準チェック値と一致する', () => {
    const r = checksumText('123456789');
    expect(r.crc32).toBe('cbf43926');
    expect(r.crc32c).toBe('e3069283');
    expect(r['crc16-arc']).toBe('bb3d');
    expect(r['crc16-ccitt']).toBe('29b1');
    expect(r['crc16-xmodem']).toBe('31c3');
    expect(r.adler32).toBe('091e01de');
  });

  it('Adler-32 は Wikipedia の例と一致する', () => {
    expect(checksumText('Wikipedia').adler32).toBe('11e60398');
  });

  it('Fletcher-16 / 32 は Wikipedia のテストベクタと一致する', () => {
    expect(checksumText('abcde').fletcher16).toBe('c8f0');
    expect(checksumText('abcdef').fletcher16).toBe('2057');
    expect(checksumText('abcdefgh').fletcher16).toBe('0627');
    expect(checksumText('abcde').fletcher32).toBe('f04fc729');
    expect(checksumText('abcdef').fletcher32).toBe('56502d2a');
    expect(checksumText('abcdefgh').fletcher32).toBe('ebe19591');
  });

  it('空入力は初期値から決まる', () => {
    const r = checksumText('');
    expect(r.crc32).toBe('00000000');
    expect(r['crc16-ccitt']).toBe('ffff');
    expect(r.adler32).toBe('00000001');
    expect(r.fletcher32).toBe('00000000');
  });

  it('マルチバイト文字はUTF-8で計算する', () => {
    expect(checksumText('あ').crc32).toBe(
      checksumBytes(new Uint8Array([0xe3, 0x81, 0x82])).crc32,
    );
  });
});

describe('createChecksumState', () => {
  it('チャンク分割しても一括計算と同じ結果になる（奇数境界を含む）', () => {
    const data = new Uint8Array(20000);
    for (let i = 0; i < data.length; i++) data[i] = (i * 31 + 7) & 0xff;
    const whole = checksumBytes(data);
    for (const size of [1, 3, 5551, 5553, 7777]) {
      const state = createChecksumState();
      for (let i = 0; i < data.length; i += size) {
        state.update(data.subarray(i, i + size));
      }
      expect(state.digest()).toEqual(whole);
    }
  });

  it('digest は状態を変更しない', () => {
    const state = createChecksumState();
    state.update(new Uint8Array([1, 2, 3]));
    expect(state.digest()).toEqual(state.digest());
  });

  it('大きなデータでもAdler-32が桁あふれしない', () => {
    const data = new Uint8Array(100000).fill(255);
    expect(checksumBytes(data).adler32).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('compareChecksum', () => {
  const r = checksumText('123456789');

  it('空・形式不正を判定する', () => {
    expect(compareChecksum('  ', r)).toEqual({ status: 'empty' });
    expect(compareChecksum('xyz', r)).toEqual({ status: 'invalid' });
    expect(compareChecksum('abcde', r)).toEqual({ status: 'invalid' });
  });

  it('大文字・0x・接頭辞付きでも一致する', () => {
    expect(compareChecksum('CBF43926', r)).toEqual({
      status: 'match',
      ids: ['crc32'],
    });
    expect(compareChecksum('0xcbf43926', r)).toEqual({
      status: 'match',
      ids: ['crc32'],
    });
    expect(compareChecksum('crc32: cbf43926  file.bin', r)).toEqual({
      status: 'match',
      ids: ['crc32'],
    });
  });

  it('不一致を判定する', () => {
    expect(compareChecksum('00000000', r)).toEqual({ status: 'mismatch' });
    expect(compareChecksum('0000', r)).toEqual({ status: 'mismatch' });
  });
});

describe('normalizeChecksumInput', () => {
  it('接頭辞と余分な語を除く', () => {
    expect(normalizeChecksumInput(' 0xAB12 ')).toBe('ab12');
  });
});
