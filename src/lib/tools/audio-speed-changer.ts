/**
 * 音声の速度・ピッチ変更（ブラウザ完結）のロジック。
 *
 * - `encodeWav` / `encodeWavBlob`: Float32 チャンネル配列 → 16bit PCM WAV。他ツールからも再利用できる。
 * - `resample`: 線形補間によるリサンプル（再生速度とピッチが同時に変わる、テープ的な変化）
 * - `timeStretch`: WSOLA（波形類似重畳加算）によるピッチを保った時間伸縮
 * - `processAudio`: 上記を組み合わせた速度・ピッチ変更
 */

export const MIN_SPEED = 0.25;
export const MAX_SPEED = 4;
export const MIN_SEMITONES = -12;
export const MAX_SEMITONES = 12;
/** 処理時間の目安として受け付ける音声の最大長（秒） */
export const MAX_DURATION_SECONDS = 600;
/** 受け付けるファイルサイズの上限（バイト） */
export const MAX_FILE_SIZE = 200 * 1024 * 1024;

export type PitchMode = 'independent' | 'linked';

export interface ProcessOptions {
  /** 再生速度の倍率（1 = 等倍） */
  speed: number;
  /** ピッチ変更（半音単位）。`linked` モードでは無視される */
  semitones: number;
  /**
   * `independent`: 速度とピッチを別々に変える（ピッチを保ったまま速度変更）
   * `linked`: 再生速度の変更に合わせてピッチも変わる（テープ・レコード的）
   */
  mode: PitchMode;
}

export type ParseResult =
  { ok: true; value: number } | { ok: false; error: 'invalid' | 'outOfRange' };

/** 半音数 → 周波数比 */
export function semitonesToRatio(semitones: number): number {
  return Math.pow(2, semitones / 12);
}

/** 全角数字・カンマを整えて数値化する。空欄・NaN は invalid */
function parseNumber(input: string): number | null {
  const normalized = input
    .trim()
    .replace(/[０-９．－]/g, (c) =>
      c === '．'
        ? '.'
        : c === '－'
          ? '-'
          : String.fromCharCode(c.charCodeAt(0) - 0xfee0),
    )
    .replace(/,/g, '.');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)$/.test(normalized)) return null;
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export function parseSpeed(input: string): ParseResult {
  const n = parseNumber(input);
  if (n === null) return { ok: false, error: 'invalid' };
  if (n < MIN_SPEED || n > MAX_SPEED) return { ok: false, error: 'outOfRange' };
  return { ok: true, value: n };
}

export function parseSemitones(input: string): ParseResult {
  const n = parseNumber(input);
  if (n === null) return { ok: false, error: 'invalid' };
  if (n < MIN_SEMITONES || n > MAX_SEMITONES) {
    return { ok: false, error: 'outOfRange' };
  }
  return { ok: true, value: n };
}

/* ------------------------------ WAV エンコード ------------------------------ */

/**
 * Float32 チャンネル配列（-1〜1、範囲外はクリップ）を 16bit PCM の WAV バイト列にする。
 * チャンネルの長さが異なる場合は最短に合わせる。
 */
export function encodeWav(
  channels: Float32Array[],
  sampleRate: number,
): Uint8Array {
  if (channels.length === 0) throw new Error('no channels');
  if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
    throw new Error('invalid sample rate');
  }
  const numChannels = channels.length;
  const frames = Math.min(...channels.map((c) => c.length));
  const dataSize = frames * numChannels * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++)
      view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, Math.round(sampleRate), true);
  view.setUint32(28, Math.round(sampleRate) * numChannels * 2, true);
  view.setUint16(32, numChannels * 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  let offset = 44;
  for (let i = 0; i < frames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const s = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(
        offset,
        s < 0 ? Math.round(s * 32768) : Math.round(s * 32767),
        true,
      );
      offset += 2;
    }
  }
  return new Uint8Array(buffer);
}

export function encodeWavBlob(
  channels: Float32Array[],
  sampleRate: number,
): Blob {
  const bytes = encodeWav(channels, sampleRate);
  return new Blob([bytes.buffer as ArrayBuffer], { type: 'audio/wav' });
}

/* ------------------------------ DSP ------------------------------ */

/** 線形補間で再生。`ratio` 倍速で読むので長さは 1/ratio、ピッチは ratio 倍になる */
export function resample(
  channels: Float32Array[],
  ratio: number,
): Float32Array[] {
  if (!(ratio > 0)) throw new Error('invalid ratio');
  return channels.map((src) => {
    if (Math.abs(ratio - 1) < 1e-9) return src.slice();
    const outLen = Math.max(0, Math.round(src.length / ratio));
    const out = new Float32Array(outLen);
    const last = src.length - 1;
    for (let i = 0; i < outLen; i++) {
      const pos = i * ratio;
      const i0 = Math.floor(pos);
      if (i0 >= last) {
        out[i] = last >= 0 ? src[last] : 0;
        continue;
      }
      const frac = pos - i0;
      out[i] = src[i0] * (1 - frac) + src[i0 + 1] * frac;
    }
    return out;
  });
}

/**
 * WSOLA によるピッチを保った時間伸縮。`rate` 倍速になる（長さは 1/rate）。
 * 重なり位置の探索はモノラルミックスで行い、全チャンネルに同じ位置を適用する。
 */
export function timeStretch(
  channels: Float32Array[],
  rate: number,
  sampleRate: number,
): Float32Array[] {
  if (!(rate > 0)) throw new Error('invalid rate');
  const len = channels.length > 0 ? channels[0].length : 0;
  if (len === 0 || Math.abs(rate - 1) < 1e-9) {
    return channels.map((c) => c.slice());
  }

  const frameSize = Math.max(64, 2 * Math.round((sampleRate * 0.04) / 2));
  const hopSynth = frameSize >> 2;
  const hopAnalysis = hopSynth * rate;
  const searchRadius = Math.floor(frameSize / 10);
  const corrStep = 8; // 相関を取るサンプルの間引き
  const candidateStep = 3; // 探索位置の間引き
  const outLen = Math.max(1, Math.round(len / rate));

  const window = new Float32Array(frameSize);
  for (let i = 0; i < frameSize; i++) {
    window[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / frameSize);
  }

  const mono = new Float32Array(len);
  for (const ch of channels) {
    for (let i = 0; i < len; i++) mono[i] += ch[i] / channels.length;
  }

  const outs = channels.map(() => new Float32Array(outLen));
  const weights = new Float32Array(outLen);
  const at = (arr: Float32Array, i: number) => (i >= 0 && i < len ? arr[i] : 0);

  let prevStart = 0;
  for (let k = 0; k * hopSynth < outLen; k++) {
    const outPos = k * hopSynth;
    const nominal = Math.round(k * hopAnalysis);
    let start = nominal;
    if (k > 0) {
      const target = prevStart + hopSynth;
      let best = -Infinity;
      for (let d = -searchRadius; d <= searchRadius; d += candidateStep) {
        const cand = nominal + d;
        if (cand < 0) continue;
        let dot = 0;
        let energy = 1e-9;
        for (let i = 0; i < frameSize; i += corrStep) {
          const a = at(mono, cand + i);
          dot += a * at(mono, target + i);
          energy += a * a;
        }
        const score = dot / Math.sqrt(energy);
        if (score > best) {
          best = score;
          start = cand;
        }
      }
    }
    const n = Math.min(frameSize, outLen - outPos);
    for (let i = 0; i < n; i++) {
      weights[outPos + i] += window[i];
    }
    for (let c = 0; c < channels.length; c++) {
      const src = channels[c];
      const out = outs[c];
      for (let i = 0; i < n; i++) {
        out[outPos + i] += at(src, start + i) * window[i];
      }
    }
    prevStart = start;
  }

  for (const out of outs) {
    for (let i = 0; i < outLen; i++) {
      if (weights[i] > 1e-3) out[i] /= weights[i];
    }
  }
  return outs;
}

export interface ProcessResult {
  channels: Float32Array[];
  /** 出力の長さ（秒） */
  duration: number;
}

/** 速度・ピッチ変更を適用する */
export function processAudio(
  channels: Float32Array[],
  sampleRate: number,
  options: ProcessOptions,
): ProcessResult {
  const { speed, semitones, mode } = options;
  if (!(speed > 0)) throw new Error('invalid speed');
  let result: Float32Array[];
  if (mode === 'linked') {
    result = resample(channels, speed);
  } else {
    const pitch = semitonesToRatio(semitones);
    // ピッチを保ったまま (速度/ピッチ比) だけ伸縮し、その後リサンプルでピッチを pitch 倍にする
    const stretched = timeStretch(channels, speed / pitch, sampleRate);
    result = resample(stretched, pitch);
  }
  const frames = result.length > 0 ? result[0].length : 0;
  return { channels: result, duration: frames / sampleRate };
}

/* ------------------------------ 補助 ------------------------------ */

export function isAcceptedAudioFile(file: {
  name: string;
  type: string;
}): boolean {
  if (file.type.startsWith('audio/')) return true;
  if (file.type.startsWith('video/')) return true;
  return /\.(mp3|wav|m4a|aac|ogg|oga|opus|flac|weba|webm|mp4|aif|aiff)$/i.test(
    file.name,
  );
}

/** 出力ファイル名（拡張子を .wav にし、速度・ピッチの接尾辞を付ける） */
export function buildOutputFileName(
  originalName: string,
  options: ProcessOptions,
): string {
  const base = originalName.replace(/\.[^./\\]+$/, '') || 'audio';
  const parts: string[] = [];
  if (Math.abs(options.speed - 1) > 1e-9) {
    parts.push(`${formatNumber(options.speed)}x`);
  }
  if (options.mode === 'independent' && options.semitones !== 0) {
    parts.push(
      `${options.semitones > 0 ? '+' : ''}${formatNumber(options.semitones)}st`,
    );
  }
  const suffix = parts.length > 0 ? parts.join('-') : 'copy';
  return `${base}-${suffix}.wav`;
}

function formatNumber(n: number): string {
  return String(Math.round(n * 1000) / 1000);
}

export function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
