import { describe, expect, it } from 'vitest';
import {
  buildOutputFileName,
  calculateReductionPercent,
  compressToTarget,
  DEFAULT_COMPRESS_OPTIONS,
  formatFileSize,
  getCompressFormatOption,
  isAcceptedImageFile,
  parseTargetBytes,
  scaledDimensions,
  searchQuality,
} from './image-compress-to-size';

// 品質に比例してサイズが増える擬似エンコーダ（scaleは面積に効く）
function fakeEncoder(basePerQuality: number) {
  const calls: Array<[number, number]> = [];
  const encode = async (scale: number, quality: number) => {
    calls.push([scale, quality]);
    return {
      size: Math.round(basePerQuality * quality * scale * scale),
      data: `s${scale}q${quality}`,
    };
  };
  return { encode, calls };
}

describe('parseTargetBytes', () => {
  it('KB/MBをバイトに変換する', () => {
    expect(parseTargetBytes(200, 'KB')).toBe(204800);
    expect(parseTargetBytes(1, 'MB')).toBe(1048576);
    expect(parseTargetBytes(0.5, 'MB')).toBe(524288);
  });
  it('無効な値はnull', () => {
    expect(parseTargetBytes(0, 'KB')).toBeNull();
    expect(parseTargetBytes(-1, 'KB')).toBeNull();
    expect(parseTargetBytes(NaN, 'KB')).toBeNull();
    expect(parseTargetBytes(Infinity, 'KB')).toBeNull();
    expect(parseTargetBytes(0.0001, 'KB')).toBeNull();
  });
});

describe('searchQuality', () => {
  const opts = { minQuality: 5, maxQuality: 100 };

  it('最大品質で収まるなら1回で返す', async () => {
    const { encode } = fakeEncoder(10);
    const r = await searchQuality((q) => encode(1, q), 5000, opts);
    expect(r.hit?.quality).toBe(100);
    expect(r.attempts).toBe(1);
  });

  it('目標以下になる最大の品質を見つける', async () => {
    const { encode } = fakeEncoder(100);
    // size = 100 * q → 目標 5050 なら q=50
    const r = await searchQuality((q) => encode(1, q), 5050, opts);
    expect(r.hit?.quality).toBe(50);
    expect(r.hit?.size).toBe(5000);
    // 品質51は超過している
    expect(100 * 51).toBeGreaterThan(5050);
  });

  it('ちょうど目標と同じサイズは許容する', async () => {
    const { encode } = fakeEncoder(100);
    const r = await searchQuality((q) => encode(1, q), 3000, opts);
    expect(r.hit?.quality).toBe(30);
  });

  it('最低品質でも届かなければnull', async () => {
    const { encode } = fakeEncoder(100);
    const r = await searchQuality((q) => encode(1, q), 100, opts);
    expect(r.hit).toBeNull();
    expect(r.smallest?.size).toBe(500);
  });

  it('最低品質ちょうどで収まる場合は最低品質', async () => {
    const { encode } = fakeEncoder(100);
    const r = await searchQuality((q) => encode(1, q), 500, opts);
    expect(r.hit?.quality).toBe(5);
  });

  it('エンコード回数は対数オーダー', async () => {
    const { encode, calls } = fakeEncoder(100);
    await searchQuality((q) => encode(1, q), 7777, opts);
    expect(calls.length).toBeLessThanOrEqual(10);
  });

  it('エンコード失敗（null）なら探索を諦める', async () => {
    const r = await searchQuality(async () => null, 1000, opts);
    expect(r.hit).toBeNull();
    expect(r.smallest).toBeNull();
  });
});

describe('compressToTarget', () => {
  it('縮小せず品質だけで収まる場合はscale=1', async () => {
    const { encode } = fakeEncoder(100);
    const r = await compressToTarget(encode, 5050);
    expect(r).toMatchObject({ status: 'ok', quality: 50, scale: 1 });
  });

  it('届かない場合は縮小率を下げて再挑戦する', async () => {
    const { encode } = fakeEncoder(100);
    // scale1 の最小サイズは500。目標300 → scale0.7 (500*0.49=245) で収まる
    const r = await compressToTarget(encode, 300);
    expect(r.status).toBe('ok');
    if (r.status === 'ok') {
      expect(r.scale).toBe(0.7);
      expect(r.size).toBeLessThanOrEqual(300);
    }
  });

  it('縮小を許可しない場合はunreachableと最小結果を返す', async () => {
    const { encode, calls } = fakeEncoder(100);
    const r = await compressToTarget(encode, 300, {
      ...DEFAULT_COMPRESS_OPTIONS,
      allowResize: false,
    });
    expect(r.status).toBe('unreachable');
    if (r.status === 'unreachable') {
      expect(r.best?.size).toBe(500);
      expect(r.best?.scale).toBe(1);
    }
    expect(calls.every(([s]) => s === 1)).toBe(true);
  });

  it('どの縮小率でも届かなければunreachable', async () => {
    const { encode } = fakeEncoder(100);
    const r = await compressToTarget(encode, 1);
    expect(r.status).toBe('unreachable');
    if (r.status === 'unreachable') {
      expect(r.best?.scale).toBe(0.2);
    }
  });
});

describe('補助関数', () => {
  it('scaledDimensionsは最小1px', () => {
    expect(scaledDimensions(1000, 500, 0.5)).toEqual({
      width: 500,
      height: 250,
    });
    expect(scaledDimensions(1, 1, 0.2)).toEqual({ width: 1, height: 1 });
  });
  it('buildOutputFileName', () => {
    expect(buildOutputFileName('photo.png', 'jpeg')).toBe(
      'photo-compressed.jpg',
    );
    expect(buildOutputFileName('a.b.JPG', 'webp')).toBe('a.b-compressed.webp');
    expect(buildOutputFileName('noext', 'webp')).toBe('noext-compressed.webp');
  });
  it('formatFileSize', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(204800)).toBe('200.0 KB');
  });
  it('isAcceptedImageFile', () => {
    expect(isAcceptedImageFile({ type: 'image/png' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'image/gif' })).toBe(true);
    expect(isAcceptedImageFile({ type: 'application/pdf' })).toBe(false);
    expect(isAcceptedImageFile({ type: 'image/svg+xml' })).toBe(false);
    expect(isAcceptedImageFile({ type: '' })).toBe(false);
  });
  it('buildOutputFileName: 先頭のドットだけの名前は拡張子扱いしない', () => {
    expect(buildOutputFileName('.hidden', 'jpeg')).toBe(
      '.hidden-compressed.jpg',
    );
    expect(buildOutputFileName('日本語.写真.png', 'webp')).toBe(
      '日本語.写真-compressed.webp',
    );
  });
  it('getCompressFormatOption: 既知の形式のMIMEと拡張子を返し、未知は例外', () => {
    expect(getCompressFormatOption('jpeg')).toEqual({
      value: 'jpeg',
      mimeType: 'image/jpeg',
      extension: 'jpg',
    });
    expect(getCompressFormatOption('webp').mimeType).toBe('image/webp');
    expect(() => getCompressFormatOption('png' as unknown as 'jpeg')).toThrow();
  });
  it('calculateReductionPercent: 削減率を四捨五入し、増加は負の値', () => {
    expect(calculateReductionPercent(1000, 250)).toBe(75);
    expect(calculateReductionPercent(1000, 1000)).toBe(0);
    expect(calculateReductionPercent(1000, 1500)).toBe(-50);
    expect(calculateReductionPercent(3, 2)).toBe(33);
    expect(calculateReductionPercent(0, 100)).toBe(0);
  });
  it('formatFileSize: 単位境界（1023B/1KB/10KB/MB/GB）', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(1023)).toBe('1023 B');
    expect(formatFileSize(1024)).toBe('1.00 KB');
    expect(formatFileSize(10 * 1024)).toBe('10.0 KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.00 MB');
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10.0 MB');
    expect(formatFileSize(1024 ** 3)).toBe('1.00 GB');
    // 上限単位（GB）を超えてもGBのまま
    expect(formatFileSize(1024 ** 4)).toBe('1024.0 GB');
  });
  it('parseTargetBytes: 大きな値・小数MBの端', () => {
    expect(parseTargetBytes(1024, 'MB')).toBe(1024 * 1024 * 1024);
    expect(parseTargetBytes(1, 'KB')).toBe(1024);
    // 1バイト未満に丸められる値は無効
    expect(parseTargetBytes(0.0009, 'KB')).toBeNull();
  });
  it('scaledDimensions: 縮小率0でも最小1px', () => {
    expect(scaledDimensions(100, 100, 0)).toEqual({ width: 1, height: 1 });
  });
  it('searchQuality: 最大品質が失敗（null）でも最低品質で判定を続ける', async () => {
    const encode = async (q: number) =>
      q === 100 ? null : { size: 10 * q, data: q };
    const r = await searchQuality(encode, 1000, {
      minQuality: 5,
      maxQuality: 100,
    });
    // 100は失敗 → 5(50B)で収まり → 二分探索で 99(990B) が最大
    expect(r.hit?.quality).toBe(99);
    expect(r.hit?.size).toBe(990);
  });
});

describe('compressToTarget 追加', () => {
  it('縮小不可かつ品質だけで届く場合はscale=1で成功', async () => {
    const { encode } = fakeEncoder(100);
    const r = await compressToTarget(encode, 5050, {
      ...DEFAULT_COMPRESS_OPTIONS,
      allowResize: false,
    });
    expect(r).toMatchObject({ status: 'ok', quality: 50, scale: 1 });
  });
  it('全エンコードが失敗するとunreachableでbestはnull', async () => {
    const r = await compressToTarget(async () => null, 1000);
    expect(r).toEqual({ status: 'unreachable', best: null });
  });
});
