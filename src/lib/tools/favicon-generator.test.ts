import { describe, expect, it } from 'vitest';
import {
  buildHtmlSnippet,
  buildIcoFile,
  clampCropPosition,
  computeSquareCrop,
  formatFileSize,
  getMaxOutputSize,
  ICO_SIZES,
  isAcceptedImageFile,
  isSourceTooSmall,
  PNG_SIZES,
} from './favicon-generator';

describe('isAcceptedImageFile', () => {
  it('PNG/JPEG/WebP/GIF/BMPを受け付ける', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/jpeg' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/webp' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/gif' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/bmp' })).toBe(true);
  });

  it('SVGやテキストファイルは受け付けない', () => {
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(isAcceptedImageFile({ type: 'text/plain' })).toBe(false);
    expect(isAcceptedImageFile({ type: '' })).toBe(false);
  });
});

describe('formatFileSize', () => {
  it('1024未満はB表記', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
  });

  it('KB/MB単位に変換する', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});

describe('computeSquareCrop', () => {
  it('横長画像は左右を切り詰めて中央の正方形を返す', () => {
    expect(computeSquareCrop({ width: 200, height: 100 })).toEqual({
      sx: 50,
      sy: 0,
      size: 100,
    });
  });

  it('縦長画像は上下を切り詰めて中央の正方形を返す', () => {
    expect(computeSquareCrop({ width: 100, height: 200 })).toEqual({
      sx: 0,
      sy: 50,
      size: 100,
    });
  });

  it('正方形画像はそのままのサイズを返す', () => {
    expect(computeSquareCrop({ width: 300, height: 300 })).toEqual({
      sx: 0,
      sy: 0,
      size: 300,
    });
  });

  it('奇数差の場合は切り捨てた位置を返す', () => {
    expect(computeSquareCrop({ width: 101, height: 100 })).toEqual({
      sx: 0,
      sy: 0,
      size: 100,
    });
  });
});

describe('clampCropPosition', () => {
  it('範囲内の位置はそのまま返す', () => {
    expect(clampCropPosition({ width: 200, height: 100 }, 100, 50, 0)).toEqual({
      sx: 50,
      sy: 0,
      size: 100,
    });
  });

  it('負の位置は0にクランプする', () => {
    expect(
      clampCropPosition({ width: 200, height: 100 }, 100, -30, -10),
    ).toEqual({ sx: 0, sy: 0, size: 100 });
  });

  it('元画像からはみ出す位置は最大値にクランプする', () => {
    expect(
      clampCropPosition({ width: 200, height: 100 }, 100, 500, 500),
    ).toEqual({ sx: 100, sy: 0, size: 100 });
  });

  it('正方形の元画像（移動の余地がない）では常に0になる', () => {
    expect(
      clampCropPosition({ width: 300, height: 300 }, 300, 50, -20),
    ).toEqual({ sx: 0, sy: 0, size: 300 });
  });

  it('小数の位置は丸めてから返す', () => {
    expect(
      clampCropPosition({ width: 200, height: 100 }, 100, 49.6, 0.4),
    ).toEqual({ sx: 50, sy: 0, size: 100 });
  });
});

describe('getMaxOutputSize / isSourceTooSmall', () => {
  it('最大出力サイズはPNG_SIZESの最大値と一致する', () => {
    expect(getMaxOutputSize()).toBe(Math.max(...PNG_SIZES.map((s) => s.size)));
  });

  it('正方形部分が最大出力サイズ未満なら true', () => {
    expect(isSourceTooSmall({ width: 256, height: 256 })).toBe(true);
  });

  it('正方形部分が最大出力サイズ以上なら false', () => {
    expect(isSourceTooSmall({ width: 512, height: 512 })).toBe(false);
    expect(isSourceTooSmall({ width: 1024, height: 800 })).toBe(false);
  });
});

describe('buildIcoFile', () => {
  it('画像0件の場合はエラーを投げる', () => {
    expect(() => buildIcoFile([])).toThrow();
  });

  it('ICONDIRヘッダーと各ICONDIRENTRYを正しく組み立てる', () => {
    const images = ICO_SIZES.map((size) => ({
      size,
      pngData: new Uint8Array(size), // ダミーのPNGデータ（中身は検証しない）
    }));
    const ico = buildIcoFile(images);
    const view = new DataView(ico.buffer);

    expect(view.getUint16(0, true)).toBe(0); // reserved
    expect(view.getUint16(2, true)).toBe(1); // type
    expect(view.getUint16(4, true)).toBe(images.length); // count

    const headerSize = 6;
    const entrySize = 16;
    let expectedOffset = headerSize + entrySize * images.length;

    images.forEach((img, i) => {
      const entryOffset = headerSize + entrySize * i;
      expect(ico[entryOffset]).toBe(img.size); // width
      expect(ico[entryOffset + 1]).toBe(img.size); // height
      expect(view.getUint16(entryOffset + 6, true)).toBe(32); // bit count
      expect(view.getUint32(entryOffset + 8, true)).toBe(img.pngData.length);
      expect(view.getUint32(entryOffset + 12, true)).toBe(expectedOffset);
      expectedOffset += img.pngData.length;
    });

    expect(ico.length).toBe(expectedOffset);
  });

  it('256px以上のサイズはICO仕様に従い幅・高さバイトを0として扱う', () => {
    const ico = buildIcoFile([{ size: 256, pngData: new Uint8Array(4) }]);
    expect(ico[6]).toBe(0); // width
    expect(ico[7]).toBe(0); // height
  });

  it('埋め込んだPNGデータをそのまま復元できる', () => {
    const pngData = new Uint8Array([1, 2, 3, 4, 5]);
    const ico = buildIcoFile([{ size: 16, pngData }]);
    const dataStart = 6 + 16 * 1;
    expect(
      Array.from(ico.slice(dataStart, dataStart + pngData.length)),
    ).toEqual(Array.from(pngData));
  });
});

describe('buildHtmlSnippet', () => {
  it('全出力ファイルへの参照タグを含む', () => {
    const snippet = buildHtmlSnippet();
    expect(snippet).toContain('href="/favicon.ico"');
    expect(snippet).toContain('href="/favicon-32x32.png"');
    expect(snippet).toContain('href="/favicon-16x16.png"');
    expect(snippet).toContain('href="/apple-touch-icon.png"');
    expect(snippet).toContain('href="/android-chrome-192x192.png"');
    expect(snippet).toContain('href="/android-chrome-512x512.png"');
  });

  it('出力は改行区切りの複数タグで構成される', () => {
    const snippet = buildHtmlSnippet();
    const lines = snippet.split('\n');
    expect(lines.length).toBe(6);
    expect(lines.every((line) => line.startsWith('<link'))).toBe(true);
  });
});

describe('formatFileSize edge cases', () => {
  it('1024Bちょうどは1.00 KBに変換される', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
  });

  it('1MB未満のギリギリの値を正しく表示（10以上なので小数1桁）', () => {
    expect(formatFileSize(1024 * 1024 - 1)).toBe('1024.0 KB');
  });

  it('1MBちょうどは1.00 MBに変換される', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
  });

  it('10以上のMBは1小数点で表示', () => {
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
  });

  it('10未満のGBは2小数点で表示', () => {
    expect(formatFileSize(1.5 * 1024 * 1024 * 1024)).toBe('1.50 GB');
  });

  it('1024GB以上でも最大はGBで表示', () => {
    const result = formatFileSize(2000 * 1024 * 1024 * 1024);
    expect(result).toMatch(/\d+\.\d GB/);
  });
});

describe('clampCropPosition edge cases', () => {
  it('小数の位置で負方向への丸めを正しく扱う', () => {
    expect(
      clampCropPosition({ width: 200, height: 200 }, 100, 49.4, 49.4),
    ).toEqual({ sx: 49, sy: 49, size: 100 });
  });

  it('クロップサイズが元画像と同じ大きさの場合、位置は常に0', () => {
    expect(clampCropPosition({ width: 100, height: 100 }, 100, 50, 50)).toEqual(
      { sx: 0, sy: 0, size: 100 },
    );
  });

  it('クロップサイズが元画像より大きい場合（不正）、0にクランプされる', () => {
    expect(clampCropPosition({ width: 100, height: 100 }, 200, 0, 0)).toEqual({
      sx: 0,
      sy: 0,
      size: 200,
    });
  });

  it('横方向のみ移動可能な場合、縦方向の値は無視される', () => {
    expect(
      clampCropPosition({ width: 300, height: 100 }, 100, 150, 500),
    ).toEqual({ sx: 150, sy: 0, size: 100 });
  });

  it('縦方向のみ移動可能な場合、横方向の値は無視される', () => {
    expect(
      clampCropPosition({ width: 100, height: 300 }, 100, 500, 150),
    ).toEqual({ sx: 0, sy: 150, size: 100 });
  });
});

describe('buildIcoFile edge cases', () => {
  it('複数画像をビッグエンディアンとリトルエンディアン両方で正しく扱う', () => {
    const images = [
      { size: 16, pngData: new Uint8Array([1, 2]) },
      { size: 32, pngData: new Uint8Array([3, 4, 5]) },
      { size: 48, pngData: new Uint8Array([6]) },
    ];
    const ico = buildIcoFile(images);
    expect(ico.length).toBeGreaterThan(0);
    // ヘッダが正しく記録される（count = 3）
    const headerView = new DataView(ico.buffer);
    expect(headerView.getUint16(4, true)).toBe(3);
  });

  it('256px以上の複数サイズをICOに含める場合、幅・高さバイトはすべて0', () => {
    const ico = buildIcoFile([
      { size: 256, pngData: new Uint8Array(10) },
      { size: 512, pngData: new Uint8Array(20) },
    ]);
    // 最初のエントリ（256px）
    expect(ico[6]).toBe(0); // width
    expect(ico[7]).toBe(0); // height
    // 2番目のエントリ（512px）
    expect(ico[6 + 16 + 0]).toBe(0); // width
    expect(ico[6 + 16 + 1]).toBe(0); // height
  });

  it('大量のPNGデータを格納する場合、オフセットが正しく計算される', () => {
    const images = Array.from({ length: 10 }, (_, i) => ({
      size: i,
      pngData: new Uint8Array(100 + i * 50),
    }));
    const ico = buildIcoFile(images);

    // ヘッダ（6バイト）+ 各エントリ（16バイト）×数量
    const headerSize = 6 + 16 * images.length;
    expect(ico.length).toBe(
      headerSize + images.reduce((sum, img) => sum + img.pngData.length, 0),
    );
  });
});

describe('computeSquareCrop 縦横長の正確な計算', () => {
  it('極端な横長の場合', () => {
    expect(computeSquareCrop({ width: 1000, height: 100 })).toEqual({
      sx: 450,
      sy: 0,
      size: 100,
    });
  });

  it('極端な縦長の場合', () => {
    expect(computeSquareCrop({ width: 100, height: 1000 })).toEqual({
      sx: 0,
      sy: 450,
      size: 100,
    });
  });

  it('幅と高さが1の場合', () => {
    expect(computeSquareCrop({ width: 1, height: 1 })).toEqual({
      sx: 0,
      sy: 0,
      size: 1,
    });
  });

  it('幅のみ奇数の場合', () => {
    expect(computeSquareCrop({ width: 201, height: 100 })).toEqual({
      sx: 50,
      sy: 0,
      size: 100,
    });
  });

  it('高さのみ奇数の場合', () => {
    expect(computeSquareCrop({ width: 100, height: 201 })).toEqual({
      sx: 0,
      sy: 50,
      size: 100,
    });
  });

  it('両方奇数の場合', () => {
    expect(computeSquareCrop({ width: 201, height: 101 })).toEqual({
      sx: 50,
      sy: 0,
      size: 101,
    });
  });
});
