import { describe, expect, it } from 'vitest';
import { strToU8, zipSync } from 'fflate';
import {
  MAX_ENTRIES,
  ZipToolError,
  baseName,
  createZip,
  extractEntry,
  formatBytes,
  listZip,
  sanitizeEntryName,
  uniqueNames,
  zipFileName,
} from './zip-tool';

const file = (name: string, text: string) => ({ name, data: strToU8(text) });

describe('sanitizeEntryName', () => {
  it('パストラバーサルや先頭スラッシュを取り除く', () => {
    expect(sanitizeEntryName('../../etc/passwd')).toBe('etc/passwd');
    expect(sanitizeEntryName('/abs/path.txt')).toBe('abs/path.txt');
    expect(sanitizeEntryName('C:\\Users\\a\\b.txt')).toBe('Users/a/b.txt');
    expect(sanitizeEntryName('a/./b//c.txt')).toBe('a/b/c.txt');
  });
});

describe('baseName', () => {
  it('パスの最後の区間を返す', () => {
    expect(baseName('a/b/c.txt')).toBe('c.txt');
    expect(baseName('dir/')).toBe('dir');
    expect(baseName('../')).toBe('file');
  });
});

describe('uniqueNames', () => {
  it('重複する名前に連番を付ける', () => {
    expect(uniqueNames(['a.txt', 'a.txt', 'A.TXT', 'b'])).toEqual([
      'a.txt',
      'a (2).txt',
      'A (3).TXT',
      'b',
    ]);
  });
  it('拡張子がない名前・隠しファイルも扱える', () => {
    expect(uniqueNames(['memo', 'memo', '.env', '.env'])).toEqual([
      'memo',
      'memo (2)',
      '.env',
      '.env (2)',
    ]);
  });
});

describe('zipFileName', () => {
  it('.zip を保証し、使えない文字を除く', () => {
    expect(zipFileName('photos')).toBe('photos.zip');
    expect(zipFileName('photos.ZIP')).toBe('photos.zip');
    expect(zipFileName('a/b:c')).toBe('abc.zip');
    expect(zipFileName('  ')).toBe('archive.zip');
  });
});

describe('formatBytes', () => {
  it('単位を切り替える', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.0 MB');
  });
});

describe('createZip / listZip / extractEntry', () => {
  it('作成したZIPを一覧・展開すると元の内容に戻る（日本語名を含む）', () => {
    const zip = createZip([
      file('hello.txt', 'hello world'),
      file('日本語/メモ.txt', 'こんにちは'),
    ]);
    const entries = listZip(zip);
    expect(entries.map((e) => e.name)).toEqual([
      'hello.txt',
      '日本語/メモ.txt',
    ]);
    expect(entries[0].size).toBe(11);
    expect(entries[0].isDirectory).toBe(false);
    expect(new TextDecoder().decode(extractEntry(zip, '日本語/メモ.txt'))).toBe(
      'こんにちは',
    );
  });

  it('同名ファイルは連番で別エントリになる', () => {
    const zip = createZip([file('a.txt', '1'), file('a.txt', '2')]);
    expect(listZip(zip).map((e) => e.name)).toEqual(['a.txt', 'a (2).txt']);
  });

  it('圧縮レベル0は無圧縮、9は繰り返しデータを小さくする', () => {
    const big = file('big.txt', 'abcabcabc'.repeat(2000));
    const stored = createZip([big], 0);
    const packed = createZip([big], 9);
    expect(packed.length).toBeLessThan(stored.length);
    expect(listZip(stored)[0].compressedSize).toBe(big.data.length);
  });

  it('フォルダのエントリを判別できる', () => {
    const zip = zipSync({
      'dir/': new Uint8Array(0),
      'dir/a.txt': strToU8('x'),
    });
    const entries = listZip(zip);
    expect(entries.find((e) => e.name === 'dir/')?.isDirectory).toBe(true);
    expect(entries.find((e) => e.name === 'dir/a.txt')?.isDirectory).toBe(
      false,
    );
  });

  it('壊れたデータは invalid-zip エラーになる', () => {
    expect(() => listZip(strToU8('this is not a zip'))).toThrowError(
      ZipToolError,
    );
    try {
      listZip(strToU8('this is not a zip'));
    } catch (e) {
      expect((e as ZipToolError).code).toBe('invalid-zip');
    }
  });

  it('存在しないエントリの展開は invalid-zip エラーになる', () => {
    const zip = createZip([file('a.txt', 'x')]);
    expect(() => extractEntry(zip, 'nope.txt')).toThrowError(ZipToolError);
  });

  it('申告サイズを偽装したZIPでも、展開結果は申告サイズを超えない（ZIP爆弾対策）', () => {
    const zip = createZip(
      [{ name: 'a.txt', data: new Uint8Array(100_000).fill(97) }],
      9,
    );
    const dv = new DataView(zip.buffer, zip.byteOffset, zip.byteLength);
    for (let i = 0; i < zip.length - 4; i++) {
      const sig = dv.getUint32(i, true);
      if (sig === 0x04034b50) dv.setUint32(i + 22, 10, true);
      if (sig === 0x02014b50) dv.setUint32(i + 24, 10, true);
    }
    expect(listZip(zip)[0].size).toBe(10);
    expect(extractEntry(zip, 'a.txt').length).toBeLessThanOrEqual(10);
  });

  it('エントリ数が上限を超えると作成を拒否する', () => {
    const files = Array.from({ length: MAX_ENTRIES + 1 }, (_, i) =>
      file(`f${i}.txt`, ''),
    );
    expect(() => createZip(files)).toThrowError(ZipToolError);
  });

  it('0バイトファイル（空ファイル）を正しく扱える', () => {
    const zip = createZip([
      file('empty.txt', ''),
      file('also-empty', ''),
      file('with-content.txt', 'hello'),
    ]);
    const entries = listZip(zip);
    expect(entries).toHaveLength(3);
    expect(entries[0].size).toBe(0);
    expect(entries[1].size).toBe(0);
    expect(entries[2].size).toBe(5);
    expect(extractEntry(zip, 'empty.txt')).toEqual(new Uint8Array(0));
  });
});
