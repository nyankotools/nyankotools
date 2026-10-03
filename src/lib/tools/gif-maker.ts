import type { Size } from './image-cropper';

export interface QuantizedFrame {
  /** RGB を並べた配列（長さは 3 × 色数。2 のべき乗に満たない分は呼び出し側で補わない） */
  palette: Uint8Array;
  /** 1ピクセルにつき1つのパレット番号 */
  indices: Uint8Array;
}

export interface GifFrame extends QuantizedFrame {
  delayMs: number;
}

export interface GifOptions extends Size {
  frames: GifFrame[];
  /** true なら無限にくり返す。false なら1回だけ再生する */
  loop: boolean;
}

export const MAX_FRAMES = 100;
export const MAX_GIF_WIDTH = 1200;
export const MAX_GIF_HEIGHT = 2000;
/** 1コマの画素数の上限。減色・LZWの時間とメモリを抑える */
export const MAX_FRAME_PIXELS = 1_500_000;
export const MIN_DELAY_MS = 20;
export const MAX_DELAY_MS = 10_000;

/** 再生順の番号。pingpong なら 0,1,2,1 のように折り返す（両端は重ねない） */
export function frameOrder(count: number, pingpong: boolean): number[] {
  const order = Array.from({ length: count }, (_, i) => i);
  if (pingpong && count > 2) {
    for (let i = count - 2; i >= 1; i--) order.push(i);
  }
  return order;
}

/** 元画像の縦横比を保ったまま、幅を width にしたときの高さ（最小1） */
export function heightForWidth(source: Size, width: number): number {
  return Math.max(1, Math.round((source.height * width) / source.width));
}

/**
 * 幅を width にしたときの GIF の大きさ。縦長の画像で高さや画素数が大きくなりすぎる
 * （GIF の幅・高さは 65535 まで、減色のメモリも増える）ときは、縦横比を保って縮める。
 */
export function gifSizeForWidth(source: Size, width: number): Size {
  const w0 = Math.min(Math.max(Math.round(width), 1), MAX_GIF_WIDTH);
  const h0 = heightForWidth(source, w0);
  const k = Math.min(
    1,
    MAX_GIF_HEIGHT / h0,
    Math.sqrt(MAX_FRAME_PIXELS / (w0 * h0)),
  );
  return {
    width: Math.max(1, Math.floor(w0 * k)),
    height: Math.max(1, Math.floor(h0 * k)),
  };
}

/** 遅延をGIFの単位（1/100秒）にそろえる。範囲外は丸める */
export function delayToCentiseconds(ms: number): number {
  const v = Number.isFinite(ms) ? ms : MIN_DELAY_MS;
  return Math.round(Math.min(Math.max(v, MIN_DELAY_MS), MAX_DELAY_MS) / 10);
}

// ---- 減色（メディアンカット） ----

interface Bin {
  /** 15bit（5bit × RGB）の色番号 */
  key: number;
  count: number;
  r: number;
  g: number;
  b: number;
}

interface Box {
  bins: Bin[];
  total: number;
}

const channel = (bin: Bin, c: 0 | 1 | 2) =>
  c === 0 ? bin.r : c === 1 ? bin.g : bin.b;

function longestChannel(bins: Bin[]): 0 | 1 | 2 {
  const lo = [255, 255, 255];
  const hi = [0, 0, 0];
  for (const bin of bins) {
    for (const c of [0, 1, 2] as const) {
      const v = channel(bin, c);
      if (v < lo[c]) lo[c] = v;
      if (v > hi[c]) hi[c] = v;
    }
  }
  const range = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]];
  return range[0] >= range[1] && range[0] >= range[2]
    ? 0
    : range[1] >= range[2]
      ? 1
      : 2;
}

function average(bins: Bin[]): [number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (const bin of bins) {
    r += bin.r * bin.count;
    g += bin.g * bin.count;
    b += bin.b * bin.count;
    n += bin.count;
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
}

/**
 * RGBA の画像を最大 maxColors 色（2〜256）に減色する。透明は扱わず、
 * 呼び出し側で背景色に合成した画像を渡すこと（アルファ値は無視する）。
 */
export function quantize(
  rgba: Uint8ClampedArray | Uint8Array,
  pixelCount: number,
  maxColors = 256,
): QuantizedFrame {
  const limit = Math.min(Math.max(Math.round(maxColors), 2), 256);
  // 各チャンネル5bitに丸めた色ごとに出現数と平均色を集める
  const sums = new Map<number, Bin>();
  const keys = new Uint16Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) {
    const r = rgba[i * 4];
    const g = rgba[i * 4 + 1];
    const b = rgba[i * 4 + 2];
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    keys[i] = key;
    const bin = sums.get(key);
    if (bin) {
      bin.count++;
      bin.r += r;
      bin.g += g;
      bin.b += b;
    } else {
      sums.set(key, { key, count: 1, r, g, b });
    }
  }
  const bins = [...sums.values()].map((bin) => ({
    ...bin,
    r: bin.r / bin.count,
    g: bin.g / bin.count,
    b: bin.b / bin.count,
  }));

  // 色数が足りていれば、そのままパレットにする（減色による劣化なし）
  const boxes: Box[] = [{ bins, total: pixelCount }];
  while (boxes.length < limit) {
    let target = -1;
    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].bins.length < 2) continue;
      if (target < 0 || boxes[i].total > boxes[target].total) target = i;
    }
    if (target < 0) break;
    const { bins: list, total } = boxes[target];
    const c = longestChannel(list);
    const sorted = [...list].sort((a, b) => channel(a, c) - channel(b, c));
    // 出現数の合計が半分になる位置で分ける（両側に最低1色は残す）
    let acc = 0;
    let cut = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      acc += sorted[i].count;
      cut = i + 1;
      if (acc >= total / 2) break;
    }
    const left = sorted.slice(0, cut);
    const right = sorted.slice(cut);
    const leftTotal = left.reduce((s, b) => s + b.count, 0);
    boxes.splice(
      target,
      1,
      { bins: left, total: leftTotal },
      { bins: right, total: total - leftTotal },
    );
  }

  const palette = new Uint8Array(boxes.length * 3);
  const indexOfKey = new Map<number, number>();
  boxes.forEach((box, i) => {
    const [r, g, b] = average(box.bins);
    palette[i * 3] = r;
    palette[i * 3 + 1] = g;
    palette[i * 3 + 2] = b;
    for (const bin of box.bins) indexOfKey.set(bin.key, i);
  });
  const indices = new Uint8Array(pixelCount);
  for (let i = 0; i < pixelCount; i++) indices[i] = indexOfKey.get(keys[i])!;
  return { palette, indices };
}

// ---- GIF書き出し ----

/** GIF用の可変長コードのLZW圧縮。minCodeSize は 2〜8 */
export function lzwEncode(indices: Uint8Array, minCodeSize: number): number[] {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  const out: number[] = [];
  let acc = 0;
  let accBits = 0;
  let codeSize = minCodeSize + 1;
  let next = end + 1;
  let dict = new Map<number, number>();

  const emit = (code: number) => {
    acc |= code << accBits;
    accBits += codeSize;
    while (accBits >= 8) {
      out.push(acc & 0xff);
      acc >>>= 8;
      accBits -= 8;
    }
  };

  emit(clear);
  if (indices.length === 0) {
    emit(end);
  } else {
    let prefix = indices[0];
    for (let i = 1; i < indices.length; i++) {
      const byte = indices[i];
      const key = (prefix << 8) | byte;
      const found = dict.get(key);
      if (found !== undefined) {
        prefix = found;
        continue;
      }
      emit(prefix);
      if (next < 4096) {
        dict.set(key, next++);
        // 次のコードがいまの桁数に収まらなくなったら桁数を増やす
        if (next - 1 > (1 << codeSize) - 1 && codeSize < 12) codeSize++;
      } else {
        emit(clear);
        dict = new Map();
        codeSize = minCodeSize + 1;
        next = end + 1;
      }
      prefix = byte;
    }
    emit(prefix);
    emit(end);
  }
  if (accBits > 0) out.push(acc & 0xff);
  return out;
}

/** 書き込み先を倍々に伸ばす Uint8Array（number[] だと大きな GIF でメモリを食うため） */
class ByteBuffer {
  private bytes = new Uint8Array(1 << 16);
  private length = 0;
  push(...values: number[]) {
    if (this.length + values.length > this.bytes.length) {
      const grown = new Uint8Array(
        Math.max(this.bytes.length * 2, this.length + values.length),
      );
      grown.set(this.bytes.subarray(0, this.length));
      this.bytes = grown;
    }
    for (const v of values) this.bytes[this.length++] = v;
  }
  toUint8Array(): Uint8Array {
    return this.bytes.slice(0, this.length);
  }
}

function pushSubBlocks(out: ByteBuffer, data: number[]) {
  for (let i = 0; i < data.length; i += 255) {
    const chunk = data.slice(i, i + 255);
    out.push(chunk.length, ...chunk);
  }
  out.push(0);
}

function pushWord(out: ByteBuffer, v: number) {
  out.push(v & 0xff, (v >> 8) & 0xff);
}

/** パレットのうち使う色数を、2のべき乗（2〜256）に切り上げたときの bit 数（1〜8） */
function colorTableBits(colors: number): number {
  let bits = 1;
  while (1 << bits < colors) bits++;
  return bits;
}

/** 各フレームが独自のカラーテーブルを持つ GIF89a を作る */
/**
 * GIF を作る。1コマ書き終えるごとに、書き終えたコマ数を yield する（呼び出し側が
 * 合間にブラウザへ制御を返せるようにするため）。最終的な値は GIF のバイト列。
 */
export function* encodeGifSteps(
  options: GifOptions,
): Generator<number, Uint8Array> {
  const { width, height, frames, loop } = options;
  const out = new ByteBuffer();
  const text = (s: string) => {
    for (const ch of s) out.push(ch.charCodeAt(0));
  };

  text('GIF89a');
  pushWord(out, width);
  pushWord(out, height);
  out.push(0x00, 0, 0); // グローバルカラーテーブルなし
  if (loop) {
    out.push(0x21, 0xff, 0x0b);
    text('NETSCAPE2.0');
    out.push(0x03, 0x01, 0x00, 0x00, 0x00);
  }

  let done = 0;
  for (const frame of frames) {
    const colors = frame.palette.length / 3;
    const bits = colorTableBits(colors);
    out.push(0x21, 0xf9, 0x04, 0x00); // 描画後は何もしない（透明なし）
    pushWord(out, delayToCentiseconds(frame.delayMs));
    out.push(0x00, 0x00);
    out.push(0x2c);
    pushWord(out, 0);
    pushWord(out, 0);
    pushWord(out, width);
    pushWord(out, height);
    out.push(0x80 | (bits - 1)); // ローカルカラーテーブルあり
    const table = 1 << bits;
    for (let i = 0; i < table * 3; i++) out.push(frame.palette[i] ?? 0);
    const minCodeSize = Math.max(2, bits);
    out.push(minCodeSize);
    pushSubBlocks(out, lzwEncode(frame.indices, minCodeSize));
    yield ++done;
  }
  out.push(0x3b);
  return out.toUint8Array();
}

/** 各コマの GIF を一度に作る（テストや小さなGIF向け） */
export function encodeGif(options: GifOptions): Uint8Array {
  const steps = encodeGifSteps(options);
  for (;;) {
    const r = steps.next();
    if (r.done) return r.value;
  }
}

export function gifFileName(): string {
  return 'animation.gif';
}
