import { describe, it, expect } from 'vitest';
import {
  delayToCentiseconds,
  encodeGif,
  encodeGifSteps,
  gifSizeForWidth,
  frameOrder,
  heightForWidth,
  lzwEncode,
  quantize,
} from './gif-maker';

/** 仕様どおりのGIF用LZWデコーダ（エンコーダの検証用） */
function lzwDecode(data: number[], minCodeSize: number): number[] {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  let codeSize = minCodeSize + 1;
  let dict: number[][] = [];
  const reset = () => {
    dict = [];
    for (let i = 0; i < clear; i++) dict.push([i]);
    dict.push([], []);
    codeSize = minCodeSize + 1;
  };
  reset();
  const out: number[] = [];
  let bitPos = 0;
  let prev: number[] | null = null;
  const read = () => {
    let v = 0;
    for (let i = 0; i < codeSize; i++) {
      const byte = data[(bitPos + i) >> 3];
      v |= ((byte >> ((bitPos + i) & 7)) & 1) << i;
    }
    bitPos += codeSize;
    return v;
  };
  while (bitPos < data.length * 8) {
    const code = read();
    if (code === clear) {
      reset();
      prev = null;
      continue;
    }
    if (code === end) break;
    let entry: number[];
    if (code < dict.length) entry = dict[code];
    else if (prev) entry = [...prev, prev[0]];
    else throw new Error('bad code');
    out.push(...entry);
    if (prev && dict.length < 4096) {
      dict.push([...prev, entry[0]]);
      if (dict.length === 1 << codeSize && codeSize < 12) codeSize++;
    }
    prev = entry;
  }
  return out;
}

describe('lzwEncode', () => {
  const roundTrip = (indices: number[], bits: number) =>
    lzwDecode(lzwEncode(Uint8Array.from(indices), bits), bits);

  it('単純な並びを復元できる', () => {
    const src = [0, 1, 2, 3, 0, 1, 2, 3, 3, 3, 3, 3, 1];
    expect(roundTrip(src, 2)).toEqual(src);
  });

  it('1画素・空でも壊れない', () => {
    expect(roundTrip([1], 2)).toEqual([1]);
    expect(roundTrip([], 2)).toEqual([]);
  });

  it('辞書があふれて何度クリアされても復元できる（疑似乱数＋反復）', () => {
    let seed = 12345;
    const rand = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff);
    const src: number[] = [];
    for (let i = 0; i < 60000; i++) {
      src.push(i % 7 === 0 ? rand() % 256 : (i >> 3) % 5);
    }
    expect(roundTrip(src, 8)).toEqual(src);
  });

  it('同じ値が長く続いても復元できる', () => {
    const src = new Array(20000).fill(5);
    expect(roundTrip(src, 3)).toEqual(src);
  });
});

describe('quantize', () => {
  function rgba(colors: [number, number, number][]) {
    const data = new Uint8ClampedArray(colors.length * 4);
    colors.forEach(([r, g, b], i) => data.set([r, g, b, 255], i * 4));
    return data;
  }

  it('色数が上限以下ならそのままパレットになる', () => {
    const red: [number, number, number] = [248, 0, 0];
    const blue: [number, number, number] = [0, 0, 248];
    const { palette, indices } = quantize(rgba([red, blue, red, blue]), 4);
    expect(palette.length / 3).toBe(2);
    expect(indices[0]).toBe(indices[2]);
    expect(indices[1]).toBe(indices[3]);
    expect(indices[0]).not.toBe(indices[1]);
    const i = indices[0] * 3;
    expect([palette[i], palette[i + 1], palette[i + 2]]).toEqual(red);
  });

  it('上限を超える色は指定数までまとめられる', () => {
    const colors: [number, number, number][] = [];
    for (let i = 0; i < 64; i++)
      colors.push([i * 4, 255 - i * 4, (i * 37) % 256]);
    const { palette, indices } = quantize(rgba(colors), 64, 8);
    expect(palette.length / 3).toBeLessThanOrEqual(8);
    expect(Math.max(...indices)).toBeLessThan(palette.length / 3);
  });

  it('単色でも動く', () => {
    const { palette, indices } = quantize(rgba([[10, 20, 30]]), 1);
    expect(palette.length).toBe(3);
    expect(indices[0]).toBe(0);
  });
});

describe('encodeGif', () => {
  const frame = (delayMs: number) => ({
    palette: Uint8Array.from([255, 0, 0, 0, 0, 255]),
    indices: Uint8Array.from([0, 1, 1, 0]),
    delayMs,
  });
  const text = (b: Uint8Array) => String.fromCharCode(...b);

  it('GIF89a のヘッダ・終端と画面サイズを持つ', () => {
    const bytes = encodeGif({
      width: 2,
      height: 2,
      frames: [frame(100), frame(200)],
      loop: true,
    });
    expect(text(bytes.slice(0, 6))).toBe('GIF89a');
    expect(bytes[6] | (bytes[7] << 8)).toBe(2);
    expect(bytes[8] | (bytes[9] << 8)).toBe(2);
    expect(bytes[bytes.length - 1]).toBe(0x3b);
  });

  it('くり返しありのときだけ NETSCAPE 拡張が入る', () => {
    const base = { width: 2, height: 2, frames: [frame(100)] };
    expect(text(encodeGif({ ...base, loop: true }))).toContain('NETSCAPE2.0');
    expect(text(encodeGif({ ...base, loop: false }))).not.toContain(
      'NETSCAPE2.0',
    );
  });

  it('フレームごとに遅延（1/100秒）が書かれる', () => {
    const bytes = encodeGif({
      width: 2,
      height: 2,
      frames: [frame(120), frame(500)],
      loop: false,
    });
    const delays: number[] = [];
    for (let i = 0; i < bytes.length - 5; i++) {
      if (bytes[i] === 0x21 && bytes[i + 1] === 0xf9 && bytes[i + 2] === 4) {
        delays.push(bytes[i + 4] | (bytes[i + 5] << 8));
      }
    }
    expect(delays).toEqual([12, 50]);
  });
});

describe('encodeGifSteps / gifSizeForWidth', () => {
  it('コマごとに進捗を返し、最終値は encodeGif と同じバイト列', () => {
    const f = {
      palette: Uint8Array.from([0, 0, 0, 255, 255, 255]),
      indices: Uint8Array.from([0, 1, 1, 0]),
      delayMs: 100,
    };
    const options = { width: 2, height: 2, frames: [f, f, f], loop: true };
    const steps = encodeGifSteps(options);
    const seen: number[] = [];
    let r = steps.next();
    while (!r.done) {
      seen.push(r.value);
      r = steps.next();
    }
    expect(seen).toEqual([1, 2, 3]);
    expect(r.value).toEqual(encodeGif(options));
  });

  it('縦長でも高さと画素数の上限に収める', () => {
    const s = gifSizeForWidth({ width: 100, height: 16000 }, 480);
    expect(s.height).toBeLessThanOrEqual(2000);
    expect(s.width * s.height).toBeLessThanOrEqual(1_500_000);
    expect(s.width / s.height).toBeCloseTo(100 / 16000, 1);
    expect(gifSizeForWidth({ width: 200, height: 100 }, 100)).toEqual({
      width: 100,
      height: 50,
    });
    expect(gifSizeForWidth({ width: 10, height: 10 }, 99999).width).toBe(1200);
  });
});

describe('補助関数', () => {
  it('往復再生は両端を重ねずに折り返す', () => {
    expect(frameOrder(4, true)).toEqual([0, 1, 2, 3, 2, 1]);
    expect(frameOrder(4, false)).toEqual([0, 1, 2, 3]);
    expect(frameOrder(2, true)).toEqual([0, 1]);
    expect(frameOrder(1, true)).toEqual([0]);
  });

  it('縦横比を保った高さを返す', () => {
    expect(heightForWidth({ width: 200, height: 100 }, 100)).toBe(50);
    expect(heightForWidth({ width: 1000, height: 1 }, 10)).toBe(1);
  });

  it('遅延は範囲内に丸めて1/100秒にする', () => {
    expect(delayToCentiseconds(500)).toBe(50);
    expect(delayToCentiseconds(1)).toBe(2);
    expect(delayToCentiseconds(999999)).toBe(1000);
    expect(delayToCentiseconds(NaN)).toBe(2);
  });
});
