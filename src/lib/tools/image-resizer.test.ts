import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  calculateReductionPercent,
  clampDimensionValue,
  computeDimensionsForPercent,
  computeHeightForWidth,
  computeTargetDimensions,
  computeWidthForHeight,
  formatFileSize,
  getOutputFormatOption,
  isAcceptedImageFile,
  isValidDimensionValue,
} from './image-resizer';

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
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2.00 GB');
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

  it('jpegの拡張子はjpgになる', () => {
    expect(buildOutputFileName('photo.png', 'jpeg')).toBe('photo.jpg');
  });

  it('拡張子がない場合はそのまま付与する', () => {
    expect(buildOutputFileName('noext', 'webp')).toBe('noext.webp');
  });
});

describe('isValidDimensionValue', () => {
  it('1〜10000の整数はtrue', () => {
    expect(isValidDimensionValue(1)).toBe(true);
    expect(isValidDimensionValue(800)).toBe(true);
    expect(isValidDimensionValue(10000)).toBe(true);
  });

  it('範囲外や整数でない値はfalse', () => {
    expect(isValidDimensionValue(0)).toBe(false);
    expect(isValidDimensionValue(-10)).toBe(false);
    expect(isValidDimensionValue(10001)).toBe(false);
    expect(isValidDimensionValue(100.5)).toBe(false);
    expect(isValidDimensionValue(NaN)).toBe(false);
  });
});

describe('clampDimensionValue', () => {
  it('範囲内の値はそのまま（四捨五入して）返す', () => {
    expect(clampDimensionValue(500)).toBe(500);
    expect(clampDimensionValue(500.4)).toBe(500);
  });

  it('下限未満は1に、上限超過は10000にクランプする', () => {
    expect(clampDimensionValue(0)).toBe(1);
    expect(clampDimensionValue(-100)).toBe(1);
    expect(clampDimensionValue(50000)).toBe(10000);
  });

  it('数値でない値は1を返す', () => {
    expect(clampDimensionValue(NaN)).toBe(1);
    expect(clampDimensionValue(Infinity)).toBe(1);
  });
});

describe('computeHeightForWidth', () => {
  it('縦横比を保って高さを計算する', () => {
    expect(computeHeightForWidth({ width: 1000, height: 500 }, 400)).toBe(200);
  });

  it('割り切れない場合は四捨五入する', () => {
    expect(computeHeightForWidth({ width: 1000, height: 333 }, 100)).toBe(33);
  });

  it('最低でも1pxを返す', () => {
    expect(computeHeightForWidth({ width: 1000, height: 1 }, 1)).toBe(1);
  });

  it('元の幅が0の場合は0を返す', () => {
    expect(computeHeightForWidth({ width: 0, height: 100 }, 50)).toBe(0);
  });

  it('極端な縦横比では上限（10000px）にクランプする', () => {
    expect(computeHeightForWidth({ width: 1, height: 10000 }, 10000)).toBe(
      10000,
    );
  });
});

describe('computeWidthForHeight', () => {
  it('縦横比を保って幅を計算する', () => {
    expect(computeWidthForHeight({ width: 1000, height: 500 }, 250)).toBe(500);
  });

  it('元の高さが0の場合は0を返す', () => {
    expect(computeWidthForHeight({ width: 100, height: 0 }, 50)).toBe(0);
  });

  it('極端な縦横比では上限（10000px）にクランプする', () => {
    expect(computeWidthForHeight({ width: 10000, height: 1 }, 10000)).toBe(
      10000,
    );
  });
});

describe('computeDimensionsForPercent', () => {
  it('50%に縮小する', () => {
    expect(
      computeDimensionsForPercent({ width: 800, height: 600 }, 50),
    ).toEqual({
      width: 400,
      height: 300,
    });
  });

  it('200%に拡大する', () => {
    expect(
      computeDimensionsForPercent({ width: 800, height: 600 }, 200),
    ).toEqual({ width: 1600, height: 1200 });
  });

  it('0%以下は1%として扱う（0px化を防ぐ）', () => {
    expect(computeDimensionsForPercent({ width: 800, height: 600 }, 0)).toEqual(
      { width: 8, height: 6 },
    );
  });

  it('大きな元画像に高い倍率をかけても上限（10000px）にクランプする', () => {
    expect(
      computeDimensionsForPercent({ width: 4000, height: 3000 }, 500),
    ).toEqual({ width: 10000, height: 10000 });
  });
});

describe('computeTargetDimensions', () => {
  const original = { width: 1000, height: 500 };

  it('modeがwidthの場合は幅から高さを算出する', () => {
    expect(
      computeTargetDimensions(original, { mode: 'width', width: 500 }),
    ).toEqual({ width: 500, height: 250 });
  });

  it('modeがheightの場合は高さから幅を算出する', () => {
    expect(
      computeTargetDimensions(original, { mode: 'height', height: 100 }),
    ).toEqual({ width: 200, height: 100 });
  });

  it('modeがbothの場合は縦横比を無視して指定値をそのまま使う', () => {
    expect(
      computeTargetDimensions(original, {
        mode: 'both',
        width: 300,
        height: 300,
      }),
    ).toEqual({ width: 300, height: 300 });
  });

  it('modeがpercentの場合は拡大縮小率を適用する', () => {
    expect(
      computeTargetDimensions(original, { mode: 'percent', percent: 50 }),
    ).toEqual({ width: 500, height: 250 });
  });

  it('値未指定の場合は元のサイズを使う', () => {
    expect(computeTargetDimensions(original, { mode: 'width' })).toEqual({
      width: 1000,
      height: 500,
    });
  });

  it('範囲外の指定値は妥当な範囲にクランプする（不正入力での極小/極大化を防ぐ）', () => {
    expect(
      computeTargetDimensions(original, { mode: 'width', width: 50000 }),
    ).toEqual({ width: 10000, height: 5000 });
    expect(
      computeTargetDimensions(original, { mode: 'both', width: 0, height: -5 }),
    ).toEqual({ width: 1, height: 1 });
  });
});
