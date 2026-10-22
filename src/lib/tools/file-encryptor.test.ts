import { describe, it, expect } from 'vitest';
import {
  CHUNK_SIZE,
  MAX_FILE_SIZE,
  decryptFile,
  encryptFile,
  encryptedFileName,
  sanitizeFileName,
} from './file-encryptor';

function bytesOf(size: number): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(size);
  for (let i = 0; i < size; i++) out[i] = (i * 31 + 7) & 0xff;
  return out;
}

async function toBytes(blob: Blob): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await blob.arrayBuffer());
}

async function roundTrip(size: number) {
  const data = bytesOf(size);
  const enc = await encryptFile(
    new Blob([data], { type: 'image/png' }),
    'photo.png',
    'pw',
  );
  const dec = await decryptFile(enc, 'pw');
  expect(dec.success).toBe(true);
  if (!dec.success) return;
  expect(dec.name).toBe('photo.png');
  expect(dec.type).toBe('image/png');
  expect(await toBytes(dec.blob)).toEqual(data);
}

describe('file-encryptor', () => {
  it.each([
    ['空ファイル', 0],
    ['1バイト', 1],
    ['チャンクちょうど', CHUNK_SIZE],
    ['チャンク+1バイト', CHUNK_SIZE + 1],
    ['2チャンク+端数', CHUNK_SIZE * 2 + 123],
  ])(
    '%s を暗号化して復号できる',
    async (_label, size) => {
      await roundTrip(size);
    },
    30_000,
  );

  it('同じ入力でも毎回異なる出力になる', async () => {
    const blob = new Blob(['same']);
    const a = await toBytes(await encryptFile(blob, 'a.txt', 'pw'));
    const b = await toBytes(await encryptFile(blob, 'a.txt', 'pw'));
    expect(a).not.toEqual(b);
  });

  it('パスワードが違う場合は wrong-password', async () => {
    const enc = await encryptFile(new Blob(['x']), 'a.txt', 'right');
    expect(await decryptFile(enc, 'wrong')).toEqual({
      success: false,
      error: 'wrong-password',
    });
  });

  it('マジックが違う・短すぎるデータは invalid-format', async () => {
    expect(await decryptFile(new Blob(['hello']), 'pw')).toEqual({
      success: false,
      error: 'invalid-format',
    });
    expect(await decryptFile(new Blob([new Uint8Array(200)]), 'pw')).toEqual({
      success: false,
      error: 'invalid-format',
    });
  });

  it('データ部の1バイトを書き換えると corrupted', async () => {
    const enc = await toBytes(
      await encryptFile(new Blob([bytesOf(100)]), 'a.bin', 'pw'),
    );
    enc[enc.length - 20] ^= 1;
    expect(await decryptFile(new Blob([enc]), 'pw')).toEqual({
      success: false,
      error: 'corrupted',
    });
  });

  it('ヘッダを書き換えると復号に失敗する（ヘッダも認証される）', async () => {
    const enc = await toBytes(await encryptFile(new Blob(['x']), 'a', 'pw'));
    enc[12] ^= 1; // ソルト
    const res = await decryptFile(new Blob([enc]), 'pw');
    expect(res.success).toBe(false);
  });

  it('チャンク境界で末尾を切り詰めると truncated', async () => {
    const enc = await encryptFile(
      new Blob([bytesOf(CHUNK_SIZE * 2 + 5)]),
      'a.bin',
      'pw',
    );
    const cut = enc.slice(0, enc.size - (5 + 16));
    expect(await decryptFile(cut, 'pw')).toEqual({
      success: false,
      error: 'truncated',
    });
  });

  it('メタ情報だけで本体が無いデータは truncated', async () => {
    const enc = await encryptFile(new Blob(['abc']), 'a.txt', 'pw');
    const metaOnlyEnd = enc.size - (3 + 16);
    expect(await decryptFile(enc.slice(0, metaOnlyEnd), 'pw')).toEqual({
      success: false,
      error: 'truncated',
    });
  });

  it('進捗コールバックが最後に完了値で呼ばれる', async () => {
    const calls: [number, number][] = [];
    const size = CHUNK_SIZE + 10;
    const enc = await encryptFile(
      new Blob([bytesOf(size)]),
      'a',
      'pw',
      (d, t) => calls.push([d, t]),
    );
    expect(calls.at(-1)).toEqual([size, size]);
    const dcalls: [number, number][] = [];
    await decryptFile(enc, 'pw', (d, t) => dcalls.push([d, t]));
    expect(dcalls.at(-1)?.[0]).toBe(dcalls.at(-1)?.[1]);
  });

  it('上限を超えるファイルは暗号化で RangeError', async () => {
    const fake = { size: MAX_FILE_SIZE + 1, type: '' } as Blob;
    await expect(encryptFile(fake, 'big', 'pw')).rejects.toThrow(RangeError);
  });

  it('長いファイル名は切り詰められ、復号できる', async () => {
    const enc = await encryptFile(new Blob(['x']), 'あ'.repeat(500), 'pw');
    const dec = await decryptFile(enc, 'pw');
    expect(dec.success && dec.name.length).toBe(200);
  });

  it('保存名・ファイル名の整形', () => {
    expect(encryptedFileName('a.txt')).toBe('a.txt.enc');
    expect(encryptedFileName('')).toBe('file.enc');
    expect(sanitizeFileName('../etc/passwd')).toBe('.._etc_passwd');
    expect(sanitizeFileName('..')).toBe('decrypted-file');
    expect(sanitizeFileName('')).toBe('decrypted-file');
    expect(sanitizeFileName('ok.txt')).toBe('ok.txt');
  });

  it('日本語・絵文字・記号を含むファイル名を復号後も保てる', async () => {
    const name = '日本語ファイル😀 (1).txt';
    const enc = await encryptFile(new Blob(['x']), name, 'pw');
    const dec = await decryptFile(enc, 'pw');
    expect(dec.success && dec.name).toBe(name);
  });

  it('MIMEタイプが空のファイルも暗号化・復号できる', async () => {
    const enc = await encryptFile(new Blob([]), 'empty', 'pw');
    const dec = await decryptFile(enc, 'pw');
    expect(dec.success && dec.type).toBe('');
    expect(dec.success && dec.blob.size).toBe(0);
  });

  it('復号側でも上限を超えるサイズは too-large（読み込み前に拒否）', async () => {
    const fake = {
      size: MAX_FILE_SIZE + 4096 + 1024 * 1024 + 1,
    } as Blob;
    expect(await decryptFile(fake, 'pw')).toEqual({
      success: false,
      error: 'too-large',
    });
  });

  it('チャンクの順序を入れ替えると corrupted', async () => {
    const enc = await toBytes(
      await encryptFile(new Blob([bytesOf(CHUNK_SIZE * 2 + 5)]), 'a.bin', 'pw'),
    );
    const metaLen = new DataView(enc.buffer).getUint16(9, false);
    const cipherChunk = CHUNK_SIZE + 16;
    const base = 4 + 1 + 4 + 2 + 16 + 7 + metaLen + 16;
    const swapped = new Uint8Array(enc);
    swapped.set(enc.subarray(base + cipherChunk, base + 2 * cipherChunk), base);
    swapped.set(enc.subarray(base, base + cipherChunk), base + cipherChunk);
    expect(await decryptFile(new Blob([swapped]), 'pw')).toEqual({
      success: false,
      error: 'corrupted',
    });
  });

  it('最終チャンクの後ろに余分なデータを付けると corrupted', async () => {
    const enc = await toBytes(await encryptFile(new Blob(['abc']), 'a', 'pw'));
    const extended = new Uint8Array(enc.length + 40);
    extended.set(enc);
    expect(await decryptFile(new Blob([extended]), 'pw')).toEqual({
      success: false,
      error: 'corrupted',
    });
  });

  it('バージョンやチャンクサイズが不正なヘッダは invalid-format', async () => {
    const enc = await toBytes(await encryptFile(new Blob(['abc']), 'a', 'pw'));
    const badVersion = new Uint8Array(enc);
    badVersion[4] = 2;
    expect(await decryptFile(new Blob([badVersion]), 'pw')).toEqual({
      success: false,
      error: 'invalid-format',
    });
    const tooSmallChunk = new Uint8Array(enc);
    new DataView(tooSmallChunk.buffer).setUint32(5, 512, false);
    expect(await decryptFile(new Blob([tooSmallChunk]), 'pw')).toEqual({
      success: false,
      error: 'invalid-format',
    });
  });

  it('ヘッダのチャンクサイズを書き換えても復号は成功しない（ヘッダも認証される）', async () => {
    const enc = await toBytes(await encryptFile(new Blob(['abc']), 'a', 'pw'));
    const tampered = new Uint8Array(enc);
    new DataView(tampered.buffer).setUint32(5, 2048, false);
    const res = await decryptFile(new Blob([tampered]), 'pw');
    expect(res.success).toBe(false);
  });

  it('途中（チャンク境界以外）で切り詰めると復号に失敗する', async () => {
    const enc = await encryptFile(
      new Blob([bytesOf(CHUNK_SIZE + 500)]),
      'a.bin',
      'pw',
    );
    const cut = enc.slice(0, enc.size - 100);
    const res = await decryptFile(cut, 'pw');
    expect(res.success).toBe(false);
  });

  it('制御文字・bidi制御文字・パス区切りを含むファイル名を整形する', () => {
    expect(sanitizeFileName('日本語: ファイル?.txt')).toBe(
      '日本語_ ファイル_.txt',
    );
    expect(sanitizeFileName('‮gnp.exe')).toBe('_gnp.exe');
    expect(sanitizeFileName('a\u0000b\u007f.txt')).toBe('a_b_.txt');
    expect(sanitizeFileName('a\\b|c"d.txt')).toBe('a_b_c_d.txt');
    expect(sanitizeFileName('a.txt. ')).toBe('a.txt');
    expect(sanitizeFileName('   ')).toBe('decrypted-file');
  });
});
