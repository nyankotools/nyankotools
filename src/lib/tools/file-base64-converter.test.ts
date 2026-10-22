import { describe, expect, it } from 'vitest';
import {
  MAX_FILE_SIZE,
  WARN_FILE_SIZE,
  base64ToBytes,
  buildDataUri,
  bytesToBase64,
  checkFileSize,
  decodeToFile,
  detectMimeType,
  formatFileSize,
  formatOutput,
  getExtensionForMimeType,
  guessMimeType,
  wrapLines,
} from './file-base64-converter';

const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

describe('checkFileSize', () => {
  it('分類する', () => {
    expect(checkFileSize(0)).toBe('ok');
    expect(checkFileSize(WARN_FILE_SIZE)).toBe('ok');
    expect(checkFileSize(WARN_FILE_SIZE + 1)).toBe('warn');
    expect(checkFileSize(MAX_FILE_SIZE)).toBe('warn');
    expect(checkFileSize(MAX_FILE_SIZE + 1)).toBe('too-large');
  });
});

describe('formatFileSize', () => {
  it('単位を切り替える', () => {
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1536)).toBe('1.50 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
  it('境界値と大きな単位を扱う', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
    expect(formatFileSize(3 * 1024 * 1024 * 1024)).toBe('3.00 GB');
  });
});

describe('guessMimeType / getExtensionForMimeType', () => {
  it('ブラウザの値を優先し、空なら拡張子から推定する', () => {
    expect(guessMimeType('a.pdf', 'application/x-foo')).toBe(
      'application/x-foo',
    );
    expect(guessMimeType('doc.PDF', '')).toBe('application/pdf');
    expect(guessMimeType('font.woff2', '')).toBe('font/woff2');
    expect(guessMimeType('noext', '')).toBe('application/octet-stream');
  });
  it('MIMEから拡張子を引く', () => {
    expect(getExtensionForMimeType('image/jpeg')).toBe('jpg');
    expect(getExtensionForMimeType('application/pdf')).toBe('pdf');
    expect(getExtensionForMimeType('audio/mpeg')).toBe('mp3');
    expect(getExtensionForMimeType('font/woff2')).toBe('woff2');
    expect(getExtensionForMimeType('x/unknown')).toBe('bin');
  });
});

describe('bytesToBase64', () => {
  it('小さな値を変換する', () => {
    expect(bytesToBase64(new Uint8Array([]))).toBe('');
    expect(bytesToBase64(new TextEncoder().encode('Man'))).toBe('TWFu');
    expect(bytesToBase64(new TextEncoder().encode('Ma'))).toBe('TWE=');
  });
  it('分割サイズをまたぐ大きな配列でも往復できる', () => {
    const bytes = new Uint8Array(100_000).map((_, i) => i % 256);
    const back = base64ToBytes(bytesToBase64(bytes));
    expect(back).toEqual(bytes);
  });
});

describe('wrapLines / formatOutput', () => {
  it('指定幅で折り返す', () => {
    expect(wrapLines('abcdefg', 3)).toBe('abc\ndef\ng');
    expect(wrapLines('abc', 0)).toBe('abc');
    expect(wrapLines('abc', 76)).toBe('abc');
  });
  it('Data URIは折り返さない', () => {
    expect(formatOutput('AAAA', 'text/plain', 'data-uri', 2)).toBe(
      'data:text/plain;base64,AAAA',
    );
    expect(buildDataUri('a/b', 'x')).toBe('data:a/b;base64,x');
  });
  it('Base64のみは折り返せる', () => {
    expect(formatOutput('AAAAAA', 'text/plain', 'base64-only', 4)).toBe(
      'AAAA\nAA',
    );
  });
});

describe('base64ToBytes', () => {
  it('パディング欠落・改行・URLセーフ文字を許容する', () => {
    expect(base64ToBytes('TWE')).toEqual(new Uint8Array([77, 97]));
    expect(base64ToBytes('TW\nFu')).toEqual(new Uint8Array([77, 97, 110]));
    expect(base64ToBytes('-_8')).toEqual(new Uint8Array([0xfb, 0xff]));
  });
  it('不正な入力はnull', () => {
    expect(base64ToBytes('')).toBeNull();
    expect(base64ToBytes('@@@@')).toBeNull();
    expect(base64ToBytes('A')).toBeNull();
  });
});

describe('detectMimeType', () => {
  it('代表的な形式を判定する', () => {
    expect(
      detectMimeType(Uint8Array.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31])),
    ).toBe('application/pdf');
    expect(detectMimeType(Uint8Array.from([0x50, 0x4b, 0x03, 0x04]))).toBe(
      'application/zip',
    );
    expect(detectMimeType(new TextEncoder().encode('  <svg xmlns="x"/>'))).toBe(
      'image/svg+xml',
    );
    expect(
      detectMimeType(
        Uint8Array.from([
          0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x41, 0x56, 0x45,
        ]),
      ),
    ).toBe('audio/wav');
  });
  it('不明ならnull', () => {
    expect(detectMimeType(Uint8Array.from([1, 2, 3, 4]))).toBeNull();
    expect(detectMimeType(new Uint8Array())).toBeNull();
  });
});

describe('decodeToFile', () => {
  it('Data URIをデコードする', () => {
    const r = decodeToFile(`data:image/png;base64,${PNG_BASE64}`);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.mimeType).toBe('image/png');
      expect(r.mimeFromHeader).toBe(true);
      expect(r.bytes[0]).toBe(0x89);
    }
  });
  it('プレフィックス無しはマジックナンバーから判定する', () => {
    const r = decodeToFile(PNG_BASE64);
    expect(r.success && r.mimeType).toBe('image/png');
    expect(r.success && r.mimeFromHeader).toBe(false);
  });
  it('判定できないバイナリはoctet-streamになる', () => {
    const r = decodeToFile('AQIDBA==');
    expect(r.success && r.mimeType).toBe('application/octet-stream');
  });
  it('charset等のパラメータ付きData URIを扱う', () => {
    const r = decodeToFile('data:text/plain;charset=utf-8;base64,SGVsbG8=');
    expect(r.success && r.mimeType).toBe('text/plain');
    expect(r.success && new TextDecoder().decode(r.bytes)).toBe('Hello');
  });
  it('パーセントエンコードのData URIを扱う', () => {
    const r = decodeToFile('data:text/plain,Hello%20%E3%81%82');
    expect(r.success && new TextDecoder().decode(r.bytes)).toBe('Hello あ');
  });
  it('MIME省略のData URIも扱う', () => {
    const r = decodeToFile('data:;base64,SGVsbG8=');
    expect(r.success && r.mimeType).toBe('application/octet-stream');
  });
  it('不正な入力は失敗する', () => {
    expect(decodeToFile('').success).toBe(false);
    expect(decodeToFile('   ').success).toBe(false);
    expect(decodeToFile('not-valid-base64-@@@').success).toBe(false);
    expect(decodeToFile('data:image/png;base64,').success).toBe(false);
    expect(decodeToFile('data:image/png').success).toBe(false);
    expect(decodeToFile('data:text/plain,%zz').success).toBe(false);
  });
});
