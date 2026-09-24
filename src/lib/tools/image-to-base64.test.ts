import { describe, expect, it } from 'vitest';
import {
  decodeBase64Image,
  formatEncodedOutput,
  formatFileSize,
  getExtensionForMimeType,
  isImageFile,
} from './image-to-base64';

// 1x1の透過PNG
const PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
// 1x1の透過GIF
const GIF_BASE64 = 'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const SVG_BASE64 = btoa('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

describe('isImageFile', () => {
  it('MIMEタイプがimage/で始まればtrue', () => {
    expect(isImageFile({ type: 'image/png' })).toBe(true);
    expect(isImageFile({ type: 'image/svg+xml' })).toBe(true);
  });

  it('画像以外はfalse', () => {
    expect(isImageFile({ type: 'text/plain' })).toBe(false);
    expect(isImageFile({ type: '' })).toBe(false);
  });
});

describe('formatFileSize', () => {
  it('1024バイト未満はB単位', () => {
    expect(formatFileSize(500)).toBe('500 B');
  });

  it('KB単位に変換される', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB');
  });

  it('MB単位に変換される', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});

describe('formatEncodedOutput', () => {
  const dataUrl = `data:image/png;base64,${PNG_BASE64}`;

  it('data-urlスタイルはそのまま返す', () => {
    expect(formatEncodedOutput(dataUrl, 'data-url')).toBe(dataUrl);
  });

  it('base64-onlyスタイルはプレフィックスを除去する', () => {
    expect(formatEncodedOutput(dataUrl, 'base64-only')).toBe(PNG_BASE64);
  });

  it('カンマがない場合はそのまま返す', () => {
    expect(formatEncodedOutput(PNG_BASE64, 'base64-only')).toBe(PNG_BASE64);
  });
});

describe('getExtensionForMimeType', () => {
  it('既知のMIMEタイプは対応する拡張子を返す', () => {
    expect(getExtensionForMimeType('image/png')).toBe('png');
    expect(getExtensionForMimeType('image/jpeg')).toBe('jpg');
    expect(getExtensionForMimeType('image/svg+xml')).toBe('svg');
  });

  it('未知のMIMEタイプはbinを返す', () => {
    expect(getExtensionForMimeType('image/avif')).toBe('bin');
  });
});

describe('decodeBase64Image', () => {
  it('Data URL形式のPNGをデコードできる', () => {
    const result = decodeBase64Image(`data:image/png;base64,${PNG_BASE64}`);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/png');
      expect(result.dataUrl).toBe(`data:image/png;base64,${PNG_BASE64}`);
    }
  });

  it('プレフィックス無しのBase64文字列でもマジックナンバーから判定できる（PNG）', () => {
    const result = decodeBase64Image(PNG_BASE64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/png');
    }
  });

  it('プレフィックス無しのBase64文字列でもマジックナンバーから判定できる（GIF）', () => {
    const result = decodeBase64Image(GIF_BASE64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/gif');
    }
  });

  it('SVGのテキスト先頭からも判定できる', () => {
    const result = decodeBase64Image(SVG_BASE64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/svg+xml');
    }
  });

  it('改行や空白が混在していても取り除いてデコードする', () => {
    const chunked = PNG_BASE64.match(/.{1,16}/g)!.join('\n');
    const result = decodeBase64Image(`data:image/png;base64,${chunked}`);
    expect(result.success).toBe(true);
  });

  it('画像として判定できないBase64文字列は失敗する', () => {
    const result = decodeBase64Image(btoa('hello world'));
    expect(result.success).toBe(false);
  });

  it('Base64として不正な文字列は失敗する', () => {
    const result = decodeBase64Image('not-valid-base64-@@@');
    expect(result.success).toBe(false);
  });

  it('空文字は失敗する', () => {
    expect(decodeBase64Image('').success).toBe(false);
    expect(decodeBase64Image('   ').success).toBe(false);
  });

  // === JPEGのテスト ===
  it('JPEGファイル（Data URL）をデコードできる', () => {
    // JPEG magic number: FF D8 FF
    const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const jpegBase64 = btoa(String.fromCharCode(...jpegBytes));
    const result = decodeBase64Image(`data:image/jpeg;base64,${jpegBase64}`);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/jpeg');
    }
  });

  it('JPEGファイル（マジックナンバーのみ）を検出できる', () => {
    const jpegBytes = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const jpegBase64 = btoa(String.fromCharCode(...jpegBytes));
    const result = decodeBase64Image(jpegBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/jpeg');
    }
  });

  // === WebPのテスト ===
  it('WebPファイル（Data URL）をデコードできる', () => {
    // WebP magic: RIFF....WEBP
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const webpBase64 = btoa(String.fromCharCode(...webpBytes));
    const result = decodeBase64Image(`data:image/webp;base64,${webpBase64}`);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/webp');
    }
  });

  it('WebPファイル（マジックナンバーのみ）を検出できる', () => {
    const webpBytes = new Uint8Array([
      0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
    ]);
    const webpBase64 = btoa(String.fromCharCode(...webpBytes));
    const result = decodeBase64Image(webpBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/webp');
    }
  });

  // === BMPのテスト ===
  it('BMPファイル（Data URL）をデコードできる', () => {
    // BMP magic: BM
    const bmpBytes = new Uint8Array([0x42, 0x4d, 0x00, 0x00, 0x00, 0x00]);
    const bmpBase64 = btoa(String.fromCharCode(...bmpBytes));
    const result = decodeBase64Image(`data:image/bmp;base64,${bmpBase64}`);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/bmp');
    }
  });

  it('BMPファイル（マジックナンバーのみ）を検出できる', () => {
    const bmpBytes = new Uint8Array([0x42, 0x4d, 0x00, 0x00, 0x00, 0x00]);
    const bmpBase64 = btoa(String.fromCharCode(...bmpBytes));
    const result = decodeBase64Image(bmpBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/bmp');
    }
  });

  // === ICOのテスト ===
  it('ICOファイル（Data URL）をデコードできる', () => {
    // ICO magic: 00 00 01 00
    const icoBytes = new Uint8Array([
      0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    const icoBase64 = btoa(String.fromCharCode(...icoBytes));
    const result = decodeBase64Image(`data:image/x-icon;base64,${icoBase64}`);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/x-icon');
    }
  });

  it('ICOファイル（マジックナンバーのみ）を検出できる', () => {
    const icoBytes = new Uint8Array([
      0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00,
    ]);
    const icoBase64 = btoa(String.fromCharCode(...icoBytes));
    const result = decodeBase64Image(icoBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/x-icon');
    }
  });

  // === Data URL形式のバリエーション ===
  it('Data URLのcharsetパラメータがある場合はマッチしない（現在の実装の制限）', () => {
    // data:image/svg+xml;charset=utf-8;base64,...
    // 現在の正規表現ではcharsetパラメータをサポートしていない
    const result = decodeBase64Image(
      `data:image/svg+xml;charset=utf-8;base64,${SVG_BASE64}`,
    );
    // この形式は現在マッチしないため失敗する（想定される動作）
    expect(result.success).toBe(false);
  });

  it('MIMEタイプが存在しない場合は失敗する', () => {
    const result = decodeBase64Image(`data:;base64,${PNG_BASE64}`);
    expect(result.success).toBe(false);
  });

  // === 大きなBase64入力のテスト ===
  it('大きなBase64入力（decode側）をデコードできる', () => {
    // 1MB超のBase64文字列を作成（画像データとして解釈可能）
    const largeData = new Uint8Array(1024 * 100); // 100KB of PNG header
    // PNG magic number
    largeData[0] = 0x89;
    largeData[1] = 0x50;
    largeData[2] = 0x4e;
    largeData[3] = 0x47;
    const largeBase64 = btoa(String.fromCharCode(...largeData));
    const result = decodeBase64Image(largeBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/png');
      expect(result.byteLength).toBe(largeData.length);
    }
  });

  // === SVGバリエーション ===
  it('SVGテキストが<?xml開始でも検出できる', () => {
    const svgXmlBase64 = btoa('<?xml version="1.0"?><svg></svg>');
    const result = decodeBase64Image(svgXmlBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/svg+xml');
    }
  });

  it('SVGテキストが空白を含む場合でも検出できる', () => {
    const svgBase64 = btoa('  \n  <svg></svg>');
    const result = decodeBase64Image(svgBase64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/svg+xml');
    }
  });

  // === カンマを含むBase64 ===
  it('Data URLフォーマットにマッチしない（カンマなし）場合、マジックナンバーで判定する', () => {
    // 正規表現にマッチしない形式だが、マジックナンバーがあれば判定可能
    const result = decodeBase64Image(PNG_BASE64);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.mimeType).toBe('image/png');
    }
  });
});
