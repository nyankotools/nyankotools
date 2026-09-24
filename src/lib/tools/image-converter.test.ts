import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  calculateReductionPercent,
  formatFileSize,
  getOutputFormatOption,
  isAcceptedImageFile,
} from './image-converter';

describe('getOutputFormatOption', () => {
  it('webpの情報を返す', () => {
    expect(getOutputFormatOption('webp')).toEqual({
      value: 'webp',
      mimeType: 'image/webp',
      extension: 'webp',
      supportsQuality: true,
    });
  });

  it('pngは品質指定非対応', () => {
    expect(getOutputFormatOption('png').supportsQuality).toBe(false);
  });
});

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

  it('KB/MB/GB単位に変換する', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB');
    expect(formatFileSize(1536)).toBe('1.50 KB');
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2.00 GB');
  });

  it('10以上の値は小数点1桁に丸める', () => {
    expect(formatFileSize(12.34 * 1024)).toBe('12.3 KB');
  });
});

describe('calculateReductionPercent', () => {
  it('半分に圧縮できた場合は50%', () => {
    expect(calculateReductionPercent(1000, 500)).toBe(50);
  });

  it('サイズが増加した場合は負の値', () => {
    expect(calculateReductionPercent(1000, 1200)).toBe(-20);
  });

  it('元サイズが0の場合は0を返す', () => {
    expect(calculateReductionPercent(0, 100)).toBe(0);
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を変換先フォーマットのものに置き換える', () => {
    expect(buildOutputFileName('photo.png', 'webp')).toBe('photo.webp');
    expect(buildOutputFileName('image.jpeg', 'png')).toBe('image.png');
  });

  it('拡張子がない場合はそのまま付与する', () => {
    expect(buildOutputFileName('noext', 'webp')).toBe('noext.webp');
  });

  it('ドットが先頭にある隠しファイル名は拡張子扱いしない', () => {
    expect(buildOutputFileName('.gitignore', 'webp')).toBe('.gitignore.webp');
  });

  it('jpegの拡張子はjpgになる', () => {
    expect(buildOutputFileName('photo.png', 'jpeg')).toBe('photo.jpg');
  });

  it('複数のドットを含むファイル名は最後のドット以降を置き換える', () => {
    expect(buildOutputFileName('my.photo.backup.png', 'webp')).toBe(
      'my.photo.backup.webp',
    );
  });

  it('大文字の拡張子も置き換える', () => {
    expect(buildOutputFileName('photo.PNG', 'jpeg')).toBe('photo.jpg');
    expect(buildOutputFileName('image.JPEG', 'webp')).toBe('image.webp');
  });

  it('日本語ファイル名を処理できる', () => {
    expect(buildOutputFileName('写真.png', 'webp')).toBe('写真.webp');
    expect(buildOutputFileName('画像.jpeg', 'png')).toBe('画像.png');
  });
});

describe('formatFileSize - edge cases', () => {
  it('1024バイト境界を正しく処理する', () => {
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1024)).toBe('1.00 KB');
  });

  it('極めて小さいファイルサイズを処理する', () => {
    expect(formatFileSize(1)).toBe('1 B');
  });

  it('GB単位の境界を正しく処理する', () => {
    expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.00 GB');
  });

  it('小数点の表示が正しい', () => {
    expect(formatFileSize(100.5 * 1024)).toBe('100.5 KB');
    expect(formatFileSize(5.5 * 1024 * 1024)).toBe('5.50 MB');
  });
});

describe('calculateReductionPercent - edge cases', () => {
  it('元サイズと変換後サイズが同じ場合は0%', () => {
    expect(calculateReductionPercent(1000, 1000)).toBe(0);
  });

  it('元のサイズがゼロの場合は0を返す（ゼロ除算を回避）', () => {
    expect(calculateReductionPercent(0, 0)).toBe(0);
    expect(calculateReductionPercent(0, 500)).toBe(0);
  });

  it('小数点を含むサイズで正しく計算する', () => {
    expect(calculateReductionPercent(1000.5, 500.25)).toBe(50);
  });

  it('非常に小さい削減を丸める', () => {
    expect(calculateReductionPercent(1000, 999)).toBe(0);
  });

  it('非常に大きなファイルサイズで正しく計算する', () => {
    const largeSize = 1024 * 1024 * 1024; // 1GB
    expect(calculateReductionPercent(largeSize, largeSize / 2)).toBe(50);
  });
});

describe('getOutputFormatOption - all formats', () => {
  it('jpegの拡張子はjpgである', () => {
    expect(getOutputFormatOption('jpeg').extension).toBe('jpg');
  });

  it('すべてのフォーマットが定義されている', () => {
    const webp = getOutputFormatOption('webp');
    const jpeg = getOutputFormatOption('jpeg');
    const png = getOutputFormatOption('png');

    expect(webp.value).toBe('webp');
    expect(jpeg.value).toBe('jpeg');
    expect(png.value).toBe('png');

    expect(webp.mimeType).toBe('image/webp');
    expect(jpeg.mimeType).toBe('image/jpeg');
    expect(png.mimeType).toBe('image/png');
  });
});

describe('isAcceptedImageFile - edge cases', () => {
  it('emptyのmimeTypeは受け付けない', () => {
    expect(isAcceptedImageFile({ type: '' })).toBe(false);
  });

  it('大文字のmimeTypeは受け付けない（厳密なチェック）', () => {
    expect(isAcceptedImageFile({ type: 'IMAGE/PNG' })).toBe(false);
  });

  it('spaceを含むmimeTypeは受け付けない', () => {
    expect(isAcceptedImageFile({ type: 'image/png ' })).toBe(false);
  });

  it('複数のslashを含むmimeTypeは受け付けない', () => {
    expect(isAcceptedImageFile({ type: 'image/png/extra' })).toBe(false);
  });
});
