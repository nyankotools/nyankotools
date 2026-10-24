import { describe, it, expect } from 'vitest';
import { encodeGif, lzwEncode } from './gif-maker';
import {
  baseNameOf,
  changeDelays,
  decodeGif,
  encodeRgbaGif,
  frameFileName,
  gifNameFor,
  indexFrame,
  MAX_FRAMES,
  resolveLoopCount,
  totalDurationMs,
  zipNameFor,
  type DecodedGif,
} from './gif-splitter';

// ---- テスト用の GIF ビルダー（デコーダとは独立に仕様どおり書く） ----

interface TestImage {
  left?: number;
  top?: number;
  width: number;
  height: number;
  /** 転送順の色番号（インターレース時は転送順に並べる） */
  indices: number[];
  /** 指定するとローカルカラーテーブルになる（RGB の並び） */
  palette?: number[];
  interlaced?: boolean;
  transparent?: number;
  disposal?: number;
  delayCs?: number;
  gce?: boolean;
}

function buildGif(opts: {
  width: number;
  height: number;
  global?: number[];
  loop?: number;
  images: TestImage[];
  trailer?: boolean;
  version?: string;
}): Uint8Array {
  const b: number[] = [];
  const word = (v: number) => b.push(v & 0xff, v >> 8);
  const table = (rgb: number[]) => {
    let bits = 1;
    while (2 << (bits - 1) < rgb.length / 3) bits++;
    const size = 1 << bits;
    for (let i = 0; i < size * 3; i++) b.push(rgb[i] ?? 0);
    return bits;
  };
  const tableBits = (rgb: number[]) => {
    let bits = 1;
    while (1 << bits < rgb.length / 3) bits++;
    return bits;
  };
  for (const ch of opts.version ?? 'GIF89a') b.push(ch.charCodeAt(0));
  word(opts.width);
  word(opts.height);
  if (opts.global) {
    b.push(0x80 | (tableBits(opts.global) - 1), 0, 0);
    table(opts.global);
  } else {
    b.push(0, 0, 0);
  }
  if (opts.loop !== undefined) {
    b.push(0x21, 0xff, 0x0b);
    for (const ch of 'NETSCAPE2.0') b.push(ch.charCodeAt(0));
    b.push(3, 1);
    word(opts.loop);
    b.push(0);
  }
  for (const img of opts.images) {
    if (img.gce !== false) {
      b.push(0x21, 0xf9, 4);
      b.push(
        ((img.disposal ?? 0) << 2) | (img.transparent !== undefined ? 1 : 0),
      );
      word(img.delayCs ?? 10);
      b.push(img.transparent ?? 0, 0);
    }
    b.push(0x2c);
    word(img.left ?? 0);
    word(img.top ?? 0);
    word(img.width);
    word(img.height);
    const pal = img.palette ?? opts.global!;
    const bits = tableBits(pal);
    b.push(
      (img.palette ? 0x80 : 0) |
        (img.interlaced ? 0x40 : 0) |
        (img.palette ? bits - 1 : 0),
    );
    if (img.palette) table(img.palette);
    const min = Math.max(2, bits);
    b.push(min);
    const data = lzwEncode(Uint8Array.from(img.indices), min);
    for (let i = 0; i < data.length; i += 255) {
      const chunk = data.slice(i, i + 255);
      b.push(chunk.length, ...chunk);
    }
    b.push(0);
  }
  if (opts.trailer !== false) b.push(0x3b);
  return Uint8Array.from(b);
}

const RED = [255, 0, 0];
const GREEN = [0, 255, 0];
const BLUE = [0, 0, 255];
const WHITE = [255, 255, 255];

function pixel(gif: DecodedGif, frame: number, x: number, y: number) {
  const o = (y * gif.width + x) * 4;
  return Array.from(gif.frames[frame].rgba.subarray(o, o + 4));
}

function mustDecode(bytes: Uint8Array): DecodedGif {
  const r = decodeGif(bytes);
  if (!r.ok) throw new Error(`decode failed: ${r.error}`);
  return r.gif;
}

describe('decodeGif', () => {
  it('gif-maker で作った GIF をそのまま読み戻せる（ラウンドトリップ）', () => {
    const w = 8;
    const h = 6;
    const colorsA = [10, 20, 30, 200, 100, 50, 0, 255, 128];
    const bytes = encodeGif({
      width: w,
      height: h,
      loop: true,
      frames: [
        {
          palette: Uint8Array.from(colorsA),
          indices: Uint8Array.from({ length: w * h }, (_, i) => i % 3),
          delayMs: 200,
        },
        {
          palette: Uint8Array.from([255, 255, 0, 0, 255, 255]),
          indices: Uint8Array.from({ length: w * h }, (_, i) => i % 2),
          delayMs: 60,
        },
      ],
    });
    const gif = mustDecode(bytes);
    expect(gif.width).toBe(w);
    expect(gif.height).toBe(h);
    expect(gif.frames).toHaveLength(2);
    expect(gif.loopCount).toBe(0);
    expect(gif.frames.map((f) => f.delayMs)).toEqual([200, 60]);
    for (let i = 0; i < w * h; i++) {
      const c = i % 3;
      const o = i * 4;
      expect(Array.from(gif.frames[0].rgba.subarray(o, o + 4))).toEqual([
        colorsA[c * 3],
        colorsA[c * 3 + 1],
        colorsA[c * 3 + 2],
        255,
      ]);
    }
    expect(pixel(gif, 1, 1, 0)).toEqual([0, 255, 255, 255]);
    expect(pixel(gif, 1, 0, 0)).toEqual([255, 255, 0, 255]);
  });

  it('LZW のコード表が一杯になる大きな画像（クリアコード含む）も正しく展開する', () => {
    const w = 120;
    const h = 90;
    // 擬似乱数の色番号。辞書があふれてクリアコードが入るようにする
    let s = 12345;
    const indices = Array.from({ length: w * h }, () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff;
      return (s >> 16) % 16;
    });
    const global: number[] = [];
    for (let i = 0; i < 16; i++) global.push(i * 16, 255 - i * 16, i * 8);
    const gif = mustDecode(
      buildGif({
        width: w,
        height: h,
        global,
        images: [{ width: w, height: h, indices }],
      }),
    );
    for (let i = 0; i < w * h; i += 97) {
      const c = indices[i];
      expect(Array.from(gif.frames[0].rgba.subarray(i * 4, i * 4 + 4))).toEqual(
        [global[c * 3], global[c * 3 + 1], global[c * 3 + 2], 255],
      );
    }
  });

  it('ローカルカラーテーブルがグローバルより優先される', () => {
    const gif = mustDecode(
      buildGif({
        width: 2,
        height: 1,
        global: [...RED, ...GREEN],
        images: [
          { width: 2, height: 1, indices: [0, 1] },
          {
            width: 2,
            height: 1,
            indices: [0, 1],
            palette: [...BLUE, ...WHITE],
          },
        ],
      }),
    );
    expect(pixel(gif, 0, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(gif, 1, 0, 0)).toEqual([0, 0, 255, 255]);
    expect(pixel(gif, 1, 1, 0)).toEqual([255, 255, 255, 255]);
  });

  it('インターレースの行を正しい位置に並べ替える', () => {
    const height = 10;
    // 転送順: 0,8 / 4 / 2,6 / 1,3,5,7,9 の各行が持つ色番号 = 行番号
    const order = [0, 8, 4, 2, 6, 1, 3, 5, 7, 9];
    const global: number[] = [];
    for (let i = 0; i < 10; i++) global.push(i * 20, 0, 0);
    const gif = mustDecode(
      buildGif({
        width: 1,
        height,
        global,
        images: [{ width: 1, height, indices: order, interlaced: true }],
      }),
    );
    for (let y = 0; y < height; y++) {
      expect(pixel(gif, 0, 0, y)).toEqual([y * 20, 0, 0, 255]);
    }
  });

  it('透過色は前のコマの内容を残す（処分方法0）', () => {
    const gif = mustDecode(
      buildGif({
        width: 2,
        height: 1,
        global: [...RED, ...GREEN, ...BLUE, ...WHITE],
        images: [
          { width: 2, height: 1, indices: [0, 1] },
          { width: 2, height: 1, indices: [2, 3], transparent: 3 },
        ],
      }),
    );
    expect(pixel(gif, 1, 0, 0)).toEqual([0, 0, 255, 255]);
    // 透過色の画素は前のコマのまま
    expect(pixel(gif, 1, 1, 0)).toEqual([0, 255, 0, 255]);
  });

  it('最初のコマの透過色は透明のRGBA（アルファ0）になる', () => {
    const gif = mustDecode(
      buildGif({
        width: 2,
        height: 1,
        global: [...RED, ...GREEN],
        images: [{ width: 2, height: 1, indices: [0, 1], transparent: 1 }],
      }),
    );
    expect(pixel(gif, 0, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(gif, 0, 1, 0)[3]).toBe(0);
  });

  it('処分方法2は、そのコマの範囲を透明に戻してから次を描く', () => {
    const gif = mustDecode(
      buildGif({
        width: 3,
        height: 1,
        global: [...RED, ...GREEN, ...BLUE, ...WHITE],
        images: [
          { width: 3, height: 1, indices: [0, 0, 0], disposal: 2 },
          { left: 1, width: 1, height: 1, indices: [1] },
        ],
      }),
    );
    expect(pixel(gif, 0, 2, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(gif, 1, 0, 0)[3]).toBe(0);
    expect(pixel(gif, 1, 1, 0)).toEqual([0, 255, 0, 255]);
    expect(pixel(gif, 1, 2, 0)[3]).toBe(0);
  });

  it('処分方法1は前のコマを残したまま重ねる（部分更新）', () => {
    const gif = mustDecode(
      buildGif({
        width: 3,
        height: 1,
        global: [...RED, ...GREEN],
        images: [
          { width: 3, height: 1, indices: [0, 0, 0], disposal: 1 },
          { left: 2, width: 1, height: 1, indices: [1] },
        ],
      }),
    );
    expect(pixel(gif, 1, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(gif, 1, 2, 0)).toEqual([0, 255, 0, 255]);
    expect(gif.frames[1].left).toBe(2);
    expect(gif.frames[1].frameWidth).toBe(1);
  });

  it('処分方法3は、そのコマを描く前の状態に戻す', () => {
    const gif = mustDecode(
      buildGif({
        width: 2,
        height: 1,
        global: [...RED, ...GREEN, ...BLUE],
        images: [
          { width: 2, height: 1, indices: [0, 0] },
          { width: 1, height: 1, indices: [1], disposal: 3 },
          { left: 1, width: 1, height: 1, indices: [2] },
        ],
      }),
    );
    expect(pixel(gif, 1, 0, 0)).toEqual([0, 255, 0, 255]);
    // 3コマ目の時点では、2コマ目で描いた緑が消えて赤に戻っている
    expect(pixel(gif, 2, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(gif, 2, 1, 0)).toEqual([0, 0, 255, 255]);
  });

  it('最初のコマが処分方法3でも落ちない（空の状態に戻る）', () => {
    const gif = mustDecode(
      buildGif({
        width: 1,
        height: 1,
        global: [...RED, ...GREEN],
        images: [
          { width: 1, height: 1, indices: [0], disposal: 3 },
          { width: 1, height: 1, indices: [1], transparent: 1 },
        ],
      }),
    );
    expect(pixel(gif, 1, 0, 0)[3]).toBe(0);
  });

  it('論理スクリーンからはみ出すコマは切り取る', () => {
    const gif = mustDecode(
      buildGif({
        width: 2,
        height: 2,
        global: [...RED, ...GREEN],
        images: [
          { left: 1, top: 1, width: 3, height: 3, indices: Array(9).fill(1) },
        ],
      }),
    );
    expect(pixel(gif, 0, 1, 1)).toEqual([0, 255, 0, 255]);
    expect(pixel(gif, 0, 0, 0)[3]).toBe(0);
    expect(gif.frames[0].frameWidth).toBe(1);
  });

  it('表示時間: 0〜1/100秒は100ms、画像制御拡張なしも100ms', () => {
    const gif = mustDecode(
      buildGif({
        width: 1,
        height: 1,
        global: [...RED, ...GREEN],
        images: [
          { width: 1, height: 1, indices: [0], delayCs: 0 },
          { width: 1, height: 1, indices: [0], delayCs: 1 },
          { width: 1, height: 1, indices: [0], delayCs: 2 },
          { width: 1, height: 1, indices: [0], delayCs: 250 },
          { width: 1, height: 1, indices: [0], gce: false },
        ],
      }),
    );
    expect(gif.frames.map((f) => f.delayMs)).toEqual([100, 100, 20, 2500, 100]);
  });

  it('NETSCAPE拡張: 回数の読み取り・無指定はnull', () => {
    const base = {
      width: 1,
      height: 1,
      global: [...RED, ...GREEN],
      images: [{ width: 1, height: 1, indices: [0] }],
    };
    expect(mustDecode(buildGif({ ...base, loop: 0 })).loopCount).toBe(0);
    expect(mustDecode(buildGif({ ...base, loop: 3 })).loopCount).toBe(3);
    expect(mustDecode(buildGif(base)).loopCount).toBeNull();
  });

  it('GIF87a も読める', () => {
    const gif = mustDecode(
      buildGif({
        version: 'GIF87a',
        width: 1,
        height: 1,
        global: [...RED, ...GREEN],
        images: [{ width: 1, height: 1, indices: [1], gce: false }],
      }),
    );
    expect(pixel(gif, 0, 0, 0)).toEqual([0, 255, 0, 255]);
  });

  it('トレーラが無くてもコマの区切りで終わっていれば受け入れる', () => {
    const gif = mustDecode(
      buildGif({
        width: 1,
        height: 1,
        global: [...RED, ...GREEN],
        images: [{ width: 1, height: 1, indices: [0] }],
        trailer: false,
      }),
    );
    expect(gif.frames).toHaveLength(1);
  });

  it('範囲外の色番号は黒になる', () => {
    const gif = mustDecode(
      buildGif({
        width: 1,
        height: 1,
        global: [...RED, ...GREEN],
        images: [
          {
            width: 1,
            height: 1,
            indices: [3],
            // 2色のテーブルに対して3番を指す
          },
        ],
      }),
    );
    expect(pixel(gif, 0, 0, 0)).toEqual([0, 0, 0, 255]);
  });
});

describe('decodeGif のエラー', () => {
  const valid = buildGif({
    width: 20,
    height: 20,
    global: [...RED, ...GREEN, ...BLUE, ...WHITE],
    images: [
      {
        width: 20,
        height: 20,
        indices: Array.from({ length: 400 }, (_, i) => i % 4),
      },
      {
        width: 20,
        height: 20,
        indices: Array.from({ length: 400 }, (_, i) => (i * 7) % 4),
      },
    ],
  });

  const errorOf = (bytes: Uint8Array) => {
    const r = decodeGif(bytes);
    return r.ok ? 'ok' : r.error;
  };

  it('GIFでないデータ・空データ', () => {
    expect(errorOf(new Uint8Array(0))).toBe('not-gif');
    expect(errorOf(new TextEncoder().encode('hello world'))).toBe('not-gif');
    expect(errorOf(Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0, 0, 0, 0]))).toBe(
      'not-gif',
    );
  });

  it('ヘッダだけ・途中で切れたGIFは truncated', () => {
    expect(errorOf(valid.subarray(0, 8))).toBe('truncated');
    expect(errorOf(valid.subarray(0, 20))).toBe('truncated');
  });

  it('画像データの途中で切れても例外を投げずエラーを返す', () => {
    for (let cut = 6; cut < valid.length - 1; cut += 7) {
      const r = decodeGif(valid.subarray(0, cut));
      // コマの区切りちょうどで切れた場合のみ ok になり得る
      if (r.ok) expect(r.gif.frames.length).toBeLessThan(2);
      else expect(['truncated', 'corrupt', 'no-frames']).toContain(r.error);
    }
    expect(errorOf(valid.subarray(0, valid.length - 30))).not.toBe('ok');
  });

  it('コマが1つも無いGIFは no-frames', () => {
    expect(
      errorOf(
        buildGif({
          width: 1,
          height: 1,
          global: [...RED, ...GREEN],
          images: [],
        }),
      ),
    ).toBe('no-frames');
  });

  it('不正なブロック種別は corrupt', () => {
    const bytes = Uint8Array.from(valid);
    // ヘッダ(6)+LSD(7)+GCT(4色=12バイト) の直後がブロック種別
    bytes[25] = 0x55;
    expect(errorOf(bytes)).toBe('corrupt');
  });

  it('LZWのデータが壊れている（辞書にないコード）と corrupt', () => {
    const bad = Uint8Array.from([
      ...Array.from('GIF89a', (c) => c.charCodeAt(0)),
      4,
      0,
      4,
      0,
      0x80,
      0,
      0,
      0,
      0,
      0,
      255,
      255,
      255,
      0x2c,
      0,
      0,
      0,
      0,
      4,
      0,
      4,
      0,
      0,
      2,
      2,
      0xff,
      0xff, // 画素数ぶんに足りないままデータが終わる
      0,
      0x3b,
    ]);
    expect(errorOf(bad)).toBe('corrupt');
  });

  it('幅・高さが0は corrupt', () => {
    const bytes = Uint8Array.from(valid);
    bytes[6] = 0;
    bytes[7] = 0;
    expect(errorOf(bytes)).toBe('corrupt');
  });

  it('1コマの画素数が上限を超えるGIFは too-large（大きなバッファを確保しない）', () => {
    const bytes = Uint8Array.from(valid);
    bytes[6] = 0xff;
    bytes[7] = 0xff;
    bytes[8] = 0xff;
    bytes[9] = 0xff;
    expect(errorOf(bytes)).toBe('too-large');
  });

  it('コマ数が上限を超えると too-many-frames', () => {
    const images = Array.from({ length: MAX_FRAMES + 1 }, () => ({
      width: 1,
      height: 1,
      indices: [0],
    }));
    expect(
      errorOf(
        buildGif({ width: 1, height: 1, global: [...RED, ...GREEN], images }),
      ),
    ).toBe('too-many-frames');
  });

  it('全コマの画素数の合計が上限を超えると too-large', () => {
    // 2000x1500 = 3M画素 × 14コマ > 4000万
    const w = 2000;
    const h = 1500;
    const images = Array.from({ length: 14 }, () => ({
      width: 1,
      height: 1,
      indices: [0],
    }));
    expect(
      errorOf(
        buildGif({ width: w, height: h, global: [...RED, ...GREEN], images }),
      ),
    ).toBe('too-large');
  });
});

describe('changeDelays', () => {
  it('倍率: 2倍速で表示時間が半分、0.5倍で2倍', () => {
    expect(changeDelays([100, 200, 50], 'speed', 2)).toEqual([50, 100, 25]);
    expect(changeDelays([100, 200], 'speed', 0.5)).toEqual([200, 400]);
  });

  it('下限20ms・上限10000msに収める', () => {
    expect(changeDelays([30], 'speed', 10)).toEqual([20]);
    expect(changeDelays([9000], 'speed', 0.1)).toEqual([10000]);
    expect(changeDelays([100], 'fixed', 5)).toEqual([20]);
    expect(changeDelays([100], 'fixed', 99999)).toEqual([10000]);
  });

  it('固定ms: すべて同じ値にする', () => {
    expect(changeDelays([10, 500, 80], 'fixed', 150)).toEqual([150, 150, 150]);
  });

  it('不正な倍率（0・負・NaN）は等倍として扱う', () => {
    expect(changeDelays([100], 'speed', 0)).toEqual([100]);
    expect(changeDelays([100], 'speed', -2)).toEqual([100]);
    expect(changeDelays([100], 'speed', Number.NaN)).toEqual([100]);
  });

  it('倍率が範囲外なら 0.1〜10 に丸める', () => {
    expect(changeDelays([100], 'speed', 1000)).toEqual([20]);
    expect(changeDelays([100], 'speed', 0.001)).toEqual([1000]);
  });

  it('合計時間と、ループ回数の決め方', () => {
    expect(totalDurationMs([100, 250])).toBe(350);
    expect(resolveLoopCount(true, null)).toBe(0);
    expect(resolveLoopCount(true, 3)).toBe(3);
    expect(resolveLoopCount(false, 0)).toBeNull();
  });
});

describe('名前', () => {
  it('連番ファイル名は3桁以上で、コマ数に合わせて桁を増やす', () => {
    expect(frameFileName(0, 5)).toBe('frame-001.png');
    expect(frameFileName(11, 300)).toBe('frame-012.png');
    expect(frameFileName(0, 1000)).toBe('frame-0001.png');
  });

  it('元のファイル名から保存名を作る', () => {
    expect(baseNameOf('cat.gif')).toBe('cat');
    expect(baseNameOf('C:\\pics\\my.cat.GIF')).toBe('my.cat');
    expect(baseNameOf('.gif')).toBe('animation');
    expect(zipNameFor('cat.gif')).toBe('cat-frames.zip');
    expect(gifNameFor('cat.gif')).toBe('cat-edited.gif');
    expect(gifNameFor('')).toBe('animation-edited.gif');
  });
});

describe('encodeRgbaGif（再エンコード）', () => {
  const solid = (n: number, rgba: number[]) =>
    Uint8Array.from({ length: n * 4 }, (_, i) => rgba[i % 4]);

  it('読み込んだGIFを再エンコードして読み戻すと、色・表示時間・ループが保たれる', () => {
    const original = mustDecode(
      buildGif({
        width: 4,
        height: 2,
        loop: 0,
        global: [...RED, ...GREEN, ...BLUE, ...WHITE],
        images: [
          {
            width: 4,
            height: 2,
            indices: [0, 1, 2, 3, 3, 2, 1, 0],
            delayCs: 5,
          },
          {
            width: 4,
            height: 2,
            indices: [3, 3, 3, 3, 0, 0, 0, 0],
            delayCs: 30,
          },
        ],
      }),
    );
    const out = encodeRgbaGif(
      original.width,
      original.height,
      original.frames.map((f, i) => ({
        rgba: f.rgba,
        delayMs: [40, 300][i],
      })),
      original.loopCount,
    );
    const again = mustDecode(out);
    expect(again.loopCount).toBe(0);
    expect(again.frames.map((f) => f.delayMs)).toEqual([40, 300]);
    for (let i = 0; i < 2; i++) {
      expect(Array.from(again.frames[i].rgba)).toEqual(
        Array.from(original.frames[i].rgba),
      );
    }
  });

  it('透明を含むコマは透明のまま書き出され、前のコマが透けない', () => {
    const w = 2;
    const h = 1;
    const a = Uint8Array.from([255, 0, 0, 255, 0, 0, 0, 0]);
    const b = Uint8Array.from([0, 0, 0, 0, 0, 255, 0, 255]);
    const again = mustDecode(
      encodeRgbaGif(
        w,
        h,
        [
          { rgba: a, delayMs: 100 },
          { rgba: b, delayMs: 100 },
        ],
        0,
      ),
    );
    expect(pixel(again, 0, 0, 0)).toEqual([255, 0, 0, 255]);
    expect(pixel(again, 0, 1, 0)[3]).toBe(0);
    expect(pixel(again, 1, 0, 0)[3]).toBe(0);
    expect(pixel(again, 1, 1, 0)).toEqual([0, 255, 0, 255]);
  });

  it('全面が透明のコマも書き出せる', () => {
    const again = mustDecode(
      encodeRgbaGif(2, 2, [{ rgba: new Uint8Array(16), delayMs: 100 }], null),
    );
    expect(again.loopCount).toBeNull();
    expect(pixel(again, 0, 1, 1)[3]).toBe(0);
  });

  it('indexFrame: 不透明のみなら透明番号は無し、透明があればパレット末尾', () => {
    const opaque = indexFrame(solid(4, [10, 20, 30, 255]), 4);
    expect(opaque.transparentIndex).toBe(-1);
    const mixed = indexFrame(
      Uint8Array.from([10, 20, 30, 255, 0, 0, 0, 0, 10, 20, 30, 255]),
      3,
    );
    expect(mixed.transparentIndex).toBe(mixed.palette.length / 3 - 1);
    expect(mixed.indices[1]).toBe(mixed.transparentIndex);
    expect(mixed.indices[0]).not.toBe(mixed.transparentIndex);
  });

  it('多色のコマも256色以内に減色して書き出せる', () => {
    const w = 32;
    const h = 32;
    const rgba = new Uint8Array(w * h * 4);
    for (let i = 0; i < w * h; i++) {
      rgba[i * 4] = (i * 7) & 255;
      rgba[i * 4 + 1] = (i * 13) & 255;
      rgba[i * 4 + 2] = (i * 29) & 255;
      rgba[i * 4 + 3] = 255;
    }
    const again = mustDecode(encodeRgbaGif(w, h, [{ rgba, delayMs: 100 }], 0));
    expect(again.frames).toHaveLength(1);
    expect(again.frames[0].rgba[3]).toBe(255);
  });
});
