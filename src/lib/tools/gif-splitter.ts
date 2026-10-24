import {
  delayToCentiseconds,
  lzwEncode,
  MAX_DELAY_MS,
  MIN_DELAY_MS,
  quantize,
} from './gif-maker';

// ---- 上限 ----

/** 読み込める GIF ファイルの大きさ（バイト） */
export const MAX_FILE_BYTES = 50 * 1024 * 1024;
/** 取り出すコマ数の上限 */
export const MAX_FRAMES = 300;
/** 1コマの画素数の上限（論理スクリーンの幅 × 高さ） */
export const MAX_FRAME_PIXELS = 4_000_000;
/** 全コマの画素数の合計の上限。1コマを RGBA 4 バイトで持つため、160MB 相当 */
export const MAX_TOTAL_PIXELS = 40_000_000;

export type GifDecodeError =
  | 'not-gif'
  | 'truncated'
  | 'corrupt'
  | 'too-large'
  | 'too-many-frames'
  | 'no-frames';

export interface DecodedFrame {
  /** 論理スクリーン全体に合成した RGBA（長さは width × height × 4） */
  rgba: Uint8Array;
  /** 表示時間（ミリ秒）。0〜10ms の指定はブラウザと同じく 100ms とみなす */
  delayMs: number;
  /** 処分方法（0〜3。4以上は 0 とみなす） */
  disposal: number;
  /** このコマの画像データが置かれていた範囲（論理スクリーン内に収まる部分） */
  left: number;
  top: number;
  frameWidth: number;
  frameHeight: number;
}

export interface DecodedGif {
  width: number;
  height: number;
  frames: DecodedFrame[];
  /** NETSCAPE 拡張のくり返し回数。0 は無限、null は拡張なし（1回だけ再生） */
  loopCount: number | null;
}

export type GifDecodeResult =
  { ok: true; gif: DecodedGif } | { ok: false; error: GifDecodeError };

class DecodeFailure extends Error {
  constructor(public code: GifDecodeError) {
    super(code);
  }
}

class Reader {
  pos = 0;
  constructor(public bytes: Uint8Array) {}
  get remaining(): number {
    return this.bytes.length - this.pos;
  }
  u8(): number {
    if (this.pos >= this.bytes.length) throw new DecodeFailure('truncated');
    return this.bytes[this.pos++];
  }
  u16(): number {
    const lo = this.u8();
    return lo | (this.u8() << 8);
  }
  take(n: number): Uint8Array {
    if (this.remaining < n) throw new DecodeFailure('truncated');
    const out = this.bytes.subarray(this.pos, this.pos + n);
    this.pos += n;
    return out;
  }
  /** サブブロックの列を終端（長さ0）まで読み、つなげて返す */
  subBlocks(): Uint8Array {
    const parts: Uint8Array[] = [];
    let total = 0;
    for (;;) {
      const size = this.u8();
      if (size === 0) break;
      const part = this.take(size);
      parts.push(part);
      total += size;
    }
    const out = new Uint8Array(total);
    let at = 0;
    for (const p of parts) {
      out.set(p, at);
      at += p.length;
    }
    return out;
  }
}

/**
 * GIF 用の LZW を展開する。出力は expected 個ぶんで打ち切る。
 * データが足りない（途中で終わる）ときは 'corrupt'。
 */
function lzwDecode(
  data: Uint8Array,
  minCodeSize: number,
  expected: number,
): Uint8Array {
  if (minCodeSize < 1 || minCodeSize > 8) throw new DecodeFailure('corrupt');
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  const prefix = new Uint16Array(4096);
  const suffix = new Uint8Array(4096);
  const stack = new Uint8Array(4097);
  const out = new Uint8Array(expected);
  let pos = 0;
  let codeSize = minCodeSize + 1;
  let next = end + 1;
  let prev = -1;
  let first = 0;
  let acc = 0;
  let accBits = 0;
  let at = 0;

  while (pos < expected) {
    while (accBits < codeSize) {
      if (at >= data.length) throw new DecodeFailure('corrupt');
      acc |= data[at++] << accBits;
      accBits += 8;
    }
    const code = acc & ((1 << codeSize) - 1);
    acc >>>= codeSize;
    accBits -= codeSize;

    if (code === clear) {
      codeSize = minCodeSize + 1;
      next = end + 1;
      prev = -1;
      continue;
    }
    if (code === end) break;
    if (prev === -1) {
      if (code >= clear) throw new DecodeFailure('corrupt');
      out[pos++] = code;
      prev = code;
      first = code;
      continue;
    }
    let cur = code;
    let sp = 0;
    if (code >= next) {
      if (code > next) throw new DecodeFailure('corrupt');
      stack[sp++] = first;
      cur = prev;
    }
    while (cur >= clear) {
      if (cur >= next || sp >= 4096) throw new DecodeFailure('corrupt');
      stack[sp++] = suffix[cur];
      cur = prefix[cur];
    }
    first = cur;
    stack[sp++] = cur;
    while (sp > 0 && pos < expected) out[pos++] = stack[--sp];
    if (next < 4096) {
      prefix[next] = prev;
      suffix[next] = first;
      next++;
      if (next === 1 << codeSize && codeSize < 12) codeSize++;
    }
    prev = code;
  }
  if (pos < expected) throw new DecodeFailure('corrupt');
  return out;
}

/** インターレースの転送順 k 行目が、実際の何行目かを返す対応表 */
function interlaceRows(height: number): Uint16Array {
  const rows = new Uint16Array(height);
  let k = 0;
  const passes: [number, number][] = [
    [0, 8],
    [4, 8],
    [2, 4],
    [1, 2],
  ];
  for (const [start, step] of passes) {
    for (let y = start; y < height; y += step) rows[k++] = y;
  }
  return rows;
}

function readColorTable(r: Reader, bits: number): Uint8Array {
  return r.take(3 * (2 << bits)).slice();
}

/** GIF（GIF87a / GIF89a）を展開し、各コマを論理スクリーン全体のRGBAに合成する */
export function decodeGif(input: Uint8Array): GifDecodeResult {
  try {
    return { ok: true, gif: decode(input) };
  } catch (error) {
    if (error instanceof DecodeFailure) return { ok: false, error: error.code };
    return { ok: false, error: 'corrupt' };
  }
}

function decode(input: Uint8Array): DecodedGif {
  if (input.length > MAX_FILE_BYTES) throw new DecodeFailure('too-large');
  const r = new Reader(input);
  const sig = String.fromCharCode(...input.subarray(0, 6));
  if (input.length < 6 || (sig !== 'GIF87a' && sig !== 'GIF89a')) {
    throw new DecodeFailure('not-gif');
  }
  r.pos = 6;
  const width = r.u16();
  const height = r.u16();
  const packed = r.u8();
  r.u8(); // 背景色の番号（描画には使わない。ブラウザと同じく透明のまま）
  r.u8(); // 縦横比
  if (width === 0 || height === 0) throw new DecodeFailure('corrupt');
  if (width * height > MAX_FRAME_PIXELS) throw new DecodeFailure('too-large');
  const globalTable =
    packed & 0x80 ? readColorTable(r, packed & 0x07) : new Uint8Array(0);

  const canvas = new Uint8Array(width * height * 4);
  const frames: DecodedFrame[] = [];
  let loopCount: number | null = null;
  // 直前の画像制御拡張
  let gce: { disposal: number; delayCs: number; transparent: number } | null =
    null;
  let prevDisposal = 0;
  let prevRect = { left: 0, top: 0, w: 0, h: 0 };
  let prevSaved: Uint8Array | null = null;

  for (;;) {
    if (r.remaining === 0) {
      // トレーラが無くても、コマの区切りで終わっていれば受け入れる
      break;
    }
    const block = r.u8();
    if (block === 0x3b) break;
    if (block === 0x00) continue; // 余分なパディング
    if (block === 0x21) {
      const label = r.u8();
      if (label === 0xf9) {
        const size = r.u8();
        const body = r.take(size);
        if (size >= 4) {
          gce = {
            disposal: (body[0] >> 2) & 0x07,
            delayCs: body[1] | (body[2] << 8),
            transparent: body[0] & 1 ? body[3] : -1,
          };
        }
        r.subBlocks();
      } else if (label === 0xff) {
        const size = r.u8();
        const id = String.fromCharCode(...r.take(size));
        const data = r.subBlocks();
        if (
          id === 'NETSCAPE2.0' &&
          data.length >= 3 &&
          data[0] === 1 &&
          loopCount === null
        ) {
          loopCount = data[1] | (data[2] << 8);
        }
      } else {
        r.subBlocks();
      }
      continue;
    }
    if (block !== 0x2c) {
      // 1コマ以上読めていれば、末尾の不正は無視して読めた分を返す
      if (frames.length > 0) break;
      throw new DecodeFailure('corrupt');
    }

    // ---- 画像 ----
    if (frames.length + 1 > MAX_FRAMES)
      throw new DecodeFailure('too-many-frames');
    if ((frames.length + 1) * width * height > MAX_TOTAL_PIXELS) {
      throw new DecodeFailure('too-large');
    }
    const left = r.u16();
    const top = r.u16();
    const fw = r.u16();
    const fh = r.u16();
    if (fw * fh > MAX_FRAME_PIXELS) throw new DecodeFailure('too-large');
    const ipacked = r.u8();
    const palette =
      ipacked & 0x80 ? readColorTable(r, ipacked & 0x07) : globalTable;
    const interlaced = (ipacked & 0x40) !== 0;
    const minCodeSize = r.u8();
    const data = r.subBlocks();
    const indices =
      fw * fh === 0 ? new Uint8Array(0) : lzwDecode(data, minCodeSize, fw * fh);

    // 直前のコマの処分を適用する
    if (frames.length > 0) {
      if (prevDisposal === 2) {
        clearRect(canvas, width, height, prevRect);
      } else if (prevDisposal === 3 && prevSaved) {
        canvas.set(prevSaved);
      }
    }
    const disposal = gce && gce.disposal <= 3 ? gce.disposal : 0;
    const saved = disposal === 3 ? canvas.slice() : null;

    const transparent = gce ? gce.transparent : -1;
    const rowMap = interlaced ? interlaceRows(fh) : null;
    const colors = palette.length / 3;
    for (let k = 0; k < fh; k++) {
      const y = top + (rowMap ? rowMap[k] : k);
      if (y >= height) continue;
      for (let x = 0; x < fw; x++) {
        const cx = left + x;
        if (cx >= width) break;
        const idx = indices[k * fw + x];
        if (idx === transparent) continue;
        const o = (y * width + cx) * 4;
        if (idx < colors) {
          canvas[o] = palette[idx * 3];
          canvas[o + 1] = palette[idx * 3 + 1];
          canvas[o + 2] = palette[idx * 3 + 2];
        } else {
          canvas[o] = 0;
          canvas[o + 1] = 0;
          canvas[o + 2] = 0;
        }
        canvas[o + 3] = 255;
      }
    }

    const cs = gce ? gce.delayCs : 0;
    const rect = {
      left: Math.min(left, width),
      top: Math.min(top, height),
      w: Math.max(0, Math.min(fw, width - left)),
      h: Math.max(0, Math.min(fh, height - top)),
    };
    frames.push({
      rgba: canvas.slice(),
      delayMs: cs <= 1 ? 100 : cs * 10,
      disposal,
      left: rect.left,
      top: rect.top,
      frameWidth: rect.w,
      frameHeight: rect.h,
    });
    prevDisposal = disposal;
    prevRect = rect;
    prevSaved = saved;
    gce = null;
  }

  if (frames.length === 0) throw new DecodeFailure('no-frames');
  return { width, height, frames, loopCount };
}

function clearRect(
  canvas: Uint8Array,
  width: number,
  height: number,
  rect: { left: number; top: number; w: number; h: number },
) {
  for (let y = rect.top; y < Math.min(rect.top + rect.h, height); y++) {
    const start = (y * width + rect.left) * 4;
    canvas.fill(0, start, start + rect.w * 4);
  }
}

// ---- 表示時間の一括変更 ----

export type DelayMode = 'speed' | 'fixed';

export const MIN_SPEED = 0.1;
export const MAX_SPEED = 10;

const clampDelay = (ms: number) =>
  Math.min(Math.max(Math.round(ms), MIN_DELAY_MS), MAX_DELAY_MS);

/**
 * 表示時間を一括で変える。
 * speed: 倍率（2 なら 2 倍速＝表示時間は半分、0.5 なら半分の速さ）
 * fixed: すべてのコマを value ミリ秒にする
 * 結果は 20〜10000ms に収め、整数にする。
 */
export function changeDelays(
  delays: number[],
  mode: DelayMode,
  value: number,
): number[] {
  if (mode === 'fixed') {
    const v = Number.isFinite(value) ? value : MIN_DELAY_MS;
    return delays.map(() => clampDelay(v));
  }
  const speed = Math.min(
    Math.max(Number.isFinite(value) && value > 0 ? value : 1, MIN_SPEED),
    MAX_SPEED,
  );
  return delays.map((d) => clampDelay(d / speed));
}

export function totalDurationMs(delays: number[]): number {
  return delays.reduce((sum, d) => sum + d, 0);
}

/** 書き出すくり返し回数。チェックありなら元の回数（無ければ無限）、なしなら1回だけ（null） */
export function resolveLoopCount(
  loop: boolean,
  original: number | null,
): number | null {
  if (!loop) return null;
  return original ?? 0;
}

// ---- 書き出し用の名前 ----

/** 連番のPNG名。桁数は 3 桁以上で、コマ数に合わせて増やす（index は 0 始まり） */
export function frameFileName(index: number, total: number): string {
  const digits = Math.max(3, String(total).length);
  return `frame-${String(index + 1).padStart(digits, '0')}.png`;
}

/** 元のファイル名から拡張子を除いたもの。空なら 'animation' */
export function baseNameOf(fileName: string): string {
  const name = fileName.replace(/^.*[\\/]/, '').replace(/\.[^.]*$/, '');
  const clean = name.replace(/[\\/:*?"<>|]/g, '').trim();
  return clean || 'animation';
}

export function zipNameFor(fileName: string): string {
  return `${baseNameOf(fileName)}-frames.zip`;
}

export function gifNameFor(fileName: string): string {
  return `${baseNameOf(fileName)}-edited.gif`;
}

// ---- RGBA からの書き出し（透明対応） ----

export interface RgbaFrame {
  /** 幅 × 高さ × 4 の RGBA。アルファが 128 未満の画素は透明として書く */
  rgba: Uint8Array;
  delayMs: number;
}

interface IndexedFrame {
  palette: Uint8Array;
  indices: Uint8Array;
  /** 透明色の番号。透明が無ければ -1 */
  transparentIndex: number;
}

export function indexFrame(rgba: Uint8Array, pixelCount: number): IndexedFrame {
  let opaque = 0;
  for (let i = 0; i < pixelCount; i++) if (rgba[i * 4 + 3] >= 128) opaque++;
  if (opaque === pixelCount) {
    const q = quantize(rgba, pixelCount, 256);
    return { ...q, transparentIndex: -1 };
  }
  if (opaque === 0) {
    return {
      palette: new Uint8Array(3),
      indices: new Uint8Array(pixelCount),
      transparentIndex: 0,
    };
  }
  // 不透明の画素だけで 255 色に減色し、最後の番号を透明に割り当てる
  const compact = new Uint8Array(opaque * 4);
  let c = 0;
  for (let i = 0; i < pixelCount; i++) {
    if (rgba[i * 4 + 3] >= 128) {
      compact.set(rgba.subarray(i * 4, i * 4 + 4), c * 4);
      c++;
    }
  }
  const q = quantize(compact, opaque, 255);
  const colors = q.palette.length / 3;
  const palette = new Uint8Array((colors + 1) * 3);
  palette.set(q.palette);
  const indices = new Uint8Array(pixelCount);
  c = 0;
  for (let i = 0; i < pixelCount; i++) {
    indices[i] = rgba[i * 4 + 3] >= 128 ? q.indices[c++] : colors;
  }
  return { palette, indices, transparentIndex: colors };
}

class Bytes {
  private parts: number[] = [];
  push(...v: number[]) {
    for (const x of v) this.parts.push(x);
  }
  word(v: number) {
    this.parts.push(v & 0xff, (v >> 8) & 0xff);
  }
  text(s: string) {
    for (const ch of s) this.parts.push(ch.charCodeAt(0));
  }
  blocks(data: number[]) {
    for (let i = 0; i < data.length; i += 255) {
      const chunk = data.slice(i, i + 255);
      this.parts.push(chunk.length);
      for (const v of chunk) this.parts.push(v);
    }
    this.parts.push(0);
  }
  done(): Uint8Array {
    return Uint8Array.from(this.parts);
  }
}

/**
 * 完全なRGBAのコマ列からアニメーションGIFを作る（透明対応）。
 * loopCount: 0 は無限、正の数はその回数、null はくり返しなし。
 */
export function encodeRgbaGif(
  width: number,
  height: number,
  frames: RgbaFrame[],
  loopCount: number | null,
): Uint8Array {
  const out = new Bytes();
  out.text('GIF89a');
  out.word(width);
  out.word(height);
  out.push(0x00, 0, 0);
  if (loopCount !== null) {
    out.push(0x21, 0xff, 0x0b);
    out.text('NETSCAPE2.0');
    out.push(0x03, 0x01);
    out.word(Math.min(Math.max(Math.round(loopCount), 0), 65535));
    out.push(0x00);
  }
  for (const frame of frames) {
    const { palette, indices, transparentIndex } = indexFrame(
      frame.rgba,
      width * height,
    );
    const colors = palette.length / 3;
    let bits = 1;
    while (1 << bits < colors) bits++;
    const hasTransparent = transparentIndex >= 0;
    // 透明を含むコマは、描画後に消して次のコマへ前のコマが透けないようにする
    const disposal = hasTransparent ? 2 : 1;
    out.push(0x21, 0xf9, 0x04, (disposal << 2) | (hasTransparent ? 1 : 0));
    out.word(delayToCentiseconds(frame.delayMs));
    out.push(hasTransparent ? transparentIndex : 0, 0x00);
    out.push(0x2c);
    out.word(0);
    out.word(0);
    out.word(width);
    out.word(height);
    out.push(0x80 | (bits - 1));
    for (let i = 0; i < (1 << bits) * 3; i++) out.push(palette[i] ?? 0);
    const minCodeSize = Math.max(2, bits);
    out.push(minCodeSize);
    out.blocks(lzwEncode(indices, minCodeSize));
  }
  out.push(0x3b);
  return out.done();
}
