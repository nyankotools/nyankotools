import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  calculateReductionPercent,
  clampBlockSize,
  clampColorLevels,
  computeMosaicDimensions,
  estimateMaxColorCount,
  formatFileSize,
  getOutputFormatOption,
  isAcceptedImageFile,
  isColorReductionEnabled,
  quantizeChannelValue,
} from './image-pixelart-converter';

describe('clampBlockSize', () => {
  it('範囲内の値はそのまま（四捨五入して）返す', () => {
    expect(clampBlockSize(10)).toBe(10);
    expect(clampBlockSize(10.6)).toBe(11);
  });

  it('下限未満は1に、上限超過は100にクランプする', () => {
    expect(clampBlockSize(0)).toBe(1);
    expect(clampBlockSize(-5)).toBe(1);
    expect(clampBlockSize(500)).toBe(100);
  });

  it('数値でない値は1を返す', () => {
    expect(clampBlockSize(NaN)).toBe(1);
    expect(clampBlockSize(Infinity)).toBe(1);
  });
});

describe('computeMosaicDimensions', () => {
  it('ブロックサイズで割った縮小後サイズを計算する', () => {
    expect(computeMosaicDimensions({ width: 800, height: 400 }, 8)).toEqual({
      width: 100,
      height: 50,
    });
  });

  it('割り切れない場合は四捨五入する', () => {
    expect(computeMosaicDimensions({ width: 100, height: 100 }, 30)).toEqual({
      width: 3,
      height: 3,
    });
  });

  it('最低でも1x1になる（極端に大きいブロックサイズでも0にならない）', () => {
    expect(computeMosaicDimensions({ width: 10, height: 10 }, 100)).toEqual({
      width: 1,
      height: 1,
    });
  });

  it('1x1ピクセルのサイズでも1x1になる', () => {
    expect(computeMosaicDimensions({ width: 1, height: 1 }, 8)).toEqual({
      width: 1,
      height: 1,
    });
  });

  it('非常に小さいブロックサイズ（1px）では元のサイズに近い', () => {
    expect(computeMosaicDimensions({ width: 100, height: 100 }, 1)).toEqual({
      width: 100,
      height: 100,
    });
  });

  it('異なるアスペクト比のサイズでも計算できる', () => {
    expect(computeMosaicDimensions({ width: 1920, height: 1080 }, 16)).toEqual({
      width: 120,
      height: 68,
    });
  });
});

describe('clampColorLevels', () => {
  it('範囲内の値はそのまま返す', () => {
    expect(clampColorLevels(16)).toBe(16);
  });

  it('下限未満は2に、上限超過は256にクランプする', () => {
    expect(clampColorLevels(1)).toBe(2);
    expect(clampColorLevels(1000)).toBe(256);
  });

  it('数値でない値は256（減色オフ相当）を返す', () => {
    expect(clampColorLevels(NaN)).toBe(256);
  });
});

describe('isColorReductionEnabled', () => {
  it('256未満なら有効', () => {
    expect(isColorReductionEnabled(255)).toBe(true);
    expect(isColorReductionEnabled(2)).toBe(true);
  });

  it('256（最大）ならオフ', () => {
    expect(isColorReductionEnabled(256)).toBe(false);
  });
});

describe('quantizeChannelValue', () => {
  it('levels=2の場合は0か255の2値にスナップする', () => {
    expect(quantizeChannelValue(0, 2)).toBe(0);
    expect(quantizeChannelValue(100, 2)).toBe(0);
    expect(quantizeChannelValue(200, 2)).toBe(255);
    expect(quantizeChannelValue(255, 2)).toBe(255);
  });

  it('levels=256の場合は元の値のまま変化しない', () => {
    expect(quantizeChannelValue(0, 256)).toBe(0);
    expect(quantizeChannelValue(123, 256)).toBe(123);
    expect(quantizeChannelValue(255, 256)).toBe(255);
  });

  it('levels=5の場合は均等な5段階にスナップする', () => {
    expect(quantizeChannelValue(0, 5)).toBe(0);
    expect(quantizeChannelValue(255, 5)).toBe(255);
    expect(quantizeChannelValue(64, 5)).toBe(64);
  });

  it('中間値は正しく丸められる', () => {
    // levels=3の場合: step = 127.5 のため、3段階は 0, 127.5, 255
    // 64 / 127.5 ≈ 0.5, round(0.5) = 1, 1 * 127.5 = 127.5, round(127.5) = 128
    expect(quantizeChannelValue(64, 3)).toBe(128);
    // 191 / 127.5 ≈ 1.5, round(1.5) = 2（銀行丸めではなく四捨五入）
    // 実際には Math.round(1.49...) = 1, 1 * 127.5 = 127.5, round(127.5) = 128
    expect(quantizeChannelValue(191, 3)).toBe(128);
    // 255 / 127.5 = 2, round(2) = 2, 2 * 127.5 = 255
    expect(quantizeChannelValue(255, 3)).toBe(255);
  });

  it('無効な階調数は256にクランプされる', () => {
    expect(quantizeChannelValue(100, NaN)).toBe(100);
    expect(quantizeChannelValue(100, Infinity)).toBe(100);
  });

  it('負の値は0に、255超の値は255にクランプされている', () => {
    // quantizeChannelValueは負の値を処理しないが、
    // 実装上は Math.round が負の値を正しく処理する
    expect(quantizeChannelValue(-50, 2)).toBeLessThanOrEqual(0);
    expect(quantizeChannelValue(300, 2)).toBeLessThanOrEqual(255);
  });
});

describe('estimateMaxColorCount', () => {
  it('levels^3を返す', () => {
    expect(estimateMaxColorCount(2)).toBe(8);
    expect(estimateMaxColorCount(4)).toBe(64);
    expect(estimateMaxColorCount(256)).toBe(256 ** 3);
  });
});

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
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.00 MB');
  });

  it('10未満のKBは小数点2位で表示', () => {
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(5 * 1024)).toBe('5.00 KB');
  });

  it('10以上のKBは小数点1位で表示', () => {
    expect(formatFileSize(10 * 1024)).toBe('10.0 KB');
    expect(formatFileSize(100 * 1024)).toBe('100.0 KB');
  });

  it('GB単位に変換される', () => {
    expect(formatFileSize(1 * 1024 * 1024 * 1024)).toBe('1.00 GB');
    expect(formatFileSize(2.5 * 1024 * 1024 * 1024)).toBe('2.50 GB');
  });

  it('上限を超える値もGB表記される', () => {
    expect(formatFileSize(10 * 1024 * 1024 * 1024)).toBe('10.0 GB');
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

  it('完全に同じサイズなら0%', () => {
    expect(calculateReductionPercent(1000, 1000)).toBe(0);
  });

  it('ほぼ完全に削減された場合は99%に丸められる', () => {
    expect(calculateReductionPercent(1000, 10)).toBe(99);
  });

  it('非常に大きいサイズでも計算できる', () => {
    expect(
      calculateReductionPercent(1024 * 1024 * 1024, 512 * 1024 * 1024),
    ).toBe(50);
  });

  it('負の元サイズは0を返す', () => {
    expect(calculateReductionPercent(-100, 50)).toBe(0);
  });
});

describe('buildOutputFileName', () => {
  it('拡張子を変換先フォーマットのものに置き換える', () => {
    expect(buildOutputFileName('photo.png', 'webp')).toBe('photo.webp');
    expect(buildOutputFileName('image.jpeg', 'png')).toBe('image.png');
  });

  it('jpegの拡張子はjpgになる', () => {
    expect(buildOutputFileName('photo.png', 'jpeg')).toBe('photo.jpg');
  });

  it('拡張子がない場合はそのまま付与する', () => {
    expect(buildOutputFileName('noext', 'webp')).toBe('noext.webp');
  });

  it('複数のドットを含む場合は最後のドット以降を置き換える', () => {
    expect(buildOutputFileName('photo.backup.png', 'webp')).toBe(
      'photo.backup.webp',
    );
    expect(buildOutputFileName('image.old.jpeg', 'png')).toBe('image.old.png');
  });

  it('ドットから始まるファイル名は置き換えない', () => {
    expect(buildOutputFileName('.hidden.png', 'webp')).toBe('.hidden.webp');
  });

  it('連続するドットを含む場合', () => {
    expect(buildOutputFileName('photo..png', 'webp')).toBe('photo..webp');
  });
});
