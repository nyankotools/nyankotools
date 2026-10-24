import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import {
  baseNameOf,
  buildZip,
  collectImageRefs,
  formatBytes,
  hasTransparency,
  imageEntryName,
  ImageDataError,
  isCommonObjectName,
  passesSizeFilter,
  toRgba,
} from './pdf-image-extractor';

const ops = { paintImageXObject: 85, paintInlineImageXObject: 86 };

describe('collectImageRefs', () => {
  it('画像XObjectとインライン画像を出現順に集め、他の演算子は無視する', () => {
    const inline = { width: 1, height: 1, kind: 2, data: new Uint8Array(3) };
    const refs = collectImageRefs(
      [10, 85, 83, 86, 85],
      [[], ['img_a', 10, 10], ['mask'], [inline], ['img_b', 5, 5]],
      ops,
    );
    expect(refs).toEqual([
      { type: 'object', name: 'img_a' },
      { type: 'inline', data: inline },
      { type: 'object', name: 'img_b' },
    ]);
  });

  it('同じ名前の画像XObjectは1回だけ数える', () => {
    const refs = collectImageRefs([85, 85, 85], [['x'], ['x'], ['y']], ops);
    expect(refs.map((r) => (r.type === 'object' ? r.name : ''))).toEqual([
      'x',
      'y',
    ]);
  });

  it('不正な引数は無視し、空なら空配列', () => {
    expect(collectImageRefs([85, 86], [null, [null]], ops)).toEqual([]);
    expect(collectImageRefs([], [], ops)).toEqual([]);
  });
});

describe('isCommonObjectName', () => {
  it('g_ で始まる名前は共有オブジェクト', () => {
    expect(isCommonObjectName('g_d0_img_1')).toBe(true);
    expect(isCommonObjectName('img_p0_1')).toBe(false);
  });
});

describe('passesSizeFilter', () => {
  it('短辺が閾値以上なら採用する', () => {
    expect(passesSizeFilter(100, 100, 100)).toBe(true);
    expect(passesSizeFilter(500, 99, 100)).toBe(false);
    expect(passesSizeFilter(1, 1, 0)).toBe(true);
  });
});

describe('toRgba', () => {
  it('RGB24 に不透明の alpha を足す', () => {
    const out = toRgba(2, 2, 1, [1, 2, 3, 4, 5, 6]);
    expect(Array.from(out)).toEqual([1, 2, 3, 255, 4, 5, 6, 255]);
  });

  it('RGBA32 はそのまま写す', () => {
    const out = toRgba(3, 1, 1, [9, 8, 7, 0]);
    expect(Array.from(out)).toEqual([9, 8, 7, 0]);
    expect(hasTransparency(out)).toBe(true);
  });

  it('1bpp は行ごとのバイト境界を考慮し、1を白にする', () => {
    // 幅3・高さ2。1行目 101、2行目 010（各行1バイト、上位ビットから）
    const out = toRgba(1, 3, 2, [0b10100000, 0b01000000]);
    const v = Array.from({ length: 6 }, (_, i) => out[i * 4]);
    expect(v).toEqual([255, 0, 255, 0, 255, 0]);
    expect(hasTransparency(out)).toBe(false);
  });

  it('幅が8の倍数でない1bppでも次の行を読み違えない', () => {
    // 幅9 → 1行2バイト
    const out = toRgba(1, 9, 2, [0xff, 0x80, 0x00, 0x00]);
    expect(out[8 * 4]).toBe(255);
    expect(out[9 * 4]).toBe(0);
  });

  it('データ不足・未対応kind・不正サイズは ImageDataError', () => {
    expect(() => toRgba(2, 2, 2, [1, 2, 3])).toThrow(ImageDataError);
    expect(() => toRgba(9, 1, 1, [0, 0, 0, 0])).toThrow(ImageDataError);
    expect(() => toRgba(2, 0, 1, [])).toThrow(ImageDataError);
    expect(() => toRgba(1, 9, 1, [0xff])).toThrow(ImageDataError);
  });
});

describe('imageEntryName / baseNameOf', () => {
  it('ページ番号を総ページ数の桁に揃える', () => {
    expect(imageEntryName('doc', 3, 2, 120)).toBe('doc_p003_img02.png');
    expect(imageEntryName('doc', 1, 12, 9)).toBe('doc_p1_img12.png');
  });

  it('拡張子を除いたファイル名を返す', () => {
    expect(baseNameOf('report.final.pdf')).toBe('report.final');
    expect(baseNameOf('.pdf')).toBe('pdf');
  });
});

describe('buildZip', () => {
  it('ZIPに格納でき、同名は連番で衝突を避ける', () => {
    const zip = buildZip([
      { name: 'a.png', data: new Uint8Array([1, 2]) },
      { name: 'a.png', data: new Uint8Array([3]) },
      { name: 'b.png', data: new Uint8Array([4]) },
    ]);
    const files = unzipSync(zip);
    expect(Object.keys(files).sort()).toEqual(['a.png', 'a_2.png', 'b.png']);
    expect(Array.from(files['a_2.png'])).toEqual([3]);
  });
});

describe('formatBytes', () => {
  it('単位を切り替える', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(3 * 1048576)).toBe('3.00 MB');
  });
});
