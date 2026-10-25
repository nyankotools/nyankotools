/** 音声ファイルからBPM（テンポ）を推定する純ロジック。オンセット検出＋自己相関。 */

export const MIN_BPM = 60;
export const MAX_BPM = 200;
/** 受け付ける音声の最大長（秒） */
export const MAX_DURATION_SECONDS = 20 * 60;
/** 受け付けるファイルサイズの上限（バイト） */
export const MAX_FILE_SIZE = 200 * 1024 * 1024;
/** 解析に使う最短の長さ（秒） */
export const MIN_ANALYZE_SECONDS = 4;
/** 解析に使う最長の区間（秒）。長い曲は中央付近のこの長さだけを解析する */
export const MAX_ANALYZE_SECONDS = 90;

export interface DetectOptions {
  minBpm?: number;
  maxBpm?: number;
  maxAnalyzeSeconds?: number;
}

export interface BpmResult {
  /** 推定したBPM（小数あり） */
  bpm: number;
  /** 0〜1。周期性の強さの目安（正解率ではない） */
  confidence: number;
  /** 半分・2倍のテンポ候補（取り違えやすいため併記する） */
  alternatives: number[];
}

/** 複数チャンネルを平均してモノラルにする */
export function mixToMono(channels: Float32Array[]): Float32Array {
  if (channels.length === 0) return new Float32Array(0);
  if (channels.length === 1) return channels[0];
  const length = Math.min(...channels.map((c) => c.length));
  const out = new Float32Array(length);
  for (const ch of channels) {
    for (let i = 0; i < length; i++) out[i] += ch[i];
  }
  const inv = 1 / channels.length;
  for (let i = 0; i < length; i++) out[i] *= inv;
  return out;
}

/** フレームごとのRMSから、正規化・対数圧縮したオンセット強度を求める */
export function computeOnsetEnvelope(
  samples: Float32Array,
  hop: number,
): Float32Array {
  const frames = Math.floor(samples.length / hop);
  const rms = new Float32Array(frames);
  const win = hop * 2;
  let maxRms = 0;
  for (let f = 0; f < frames; f++) {
    const start = f * hop;
    const end = Math.min(samples.length, start + win);
    let sum = 0;
    for (let i = start; i < end; i++) sum += samples[i] * samples[i];
    const v = Math.sqrt(sum / Math.max(1, end - start));
    rms[f] = v;
    if (v > maxRms) maxRms = v;
  }
  const onset = new Float32Array(frames);
  if (maxRms < 1e-4) return onset;
  let prev = 0;
  for (let f = 0; f < frames; f++) {
    const c = Math.log1p((rms[f] / maxRms) * 10);
    onset[f] = Math.max(0, c - prev);
    prev = c;
  }
  return onset;
}

/** 3点の三角窓で平滑化し、ピークを少し太らせる（フレーム間の揺れを吸収する） */
function smooth(x: Float32Array): Float32Array {
  const out = new Float32Array(x.length);
  for (let i = 0; i < x.length; i++) {
    out[i] = 0.5 * x[i] + 0.25 * (x[i - 1] ?? 0) + 0.25 * (x[i + 1] ?? 0);
  }
  return out;
}

/** 平均を引いた系列の自己相関（遅れ 0..maxLag）。偏りを避けるため有効区間の長さで割る */
function autocorrelate(x: Float32Array, maxLag: number): Float64Array {
  const n = x.length;
  let mean = 0;
  for (let i = 0; i < n; i++) mean += x[i];
  mean /= n;
  const d = new Float64Array(n);
  for (let i = 0; i < n; i++) d[i] = x[i] - mean;
  const acf = new Float64Array(maxLag + 1);
  for (let lag = 0; lag <= maxLag && lag < n; lag++) {
    let sum = 0;
    for (let i = lag; i < n; i++) sum += d[i] * d[i - lag];
    acf[lag] = sum / (n - lag);
  }
  return acf;
}

/**
 * モノラルPCMからBPMを推定する。
 * 無音・短すぎる・周期が見つからない場合は null。
 */
export function detectBpm(
  samples: Float32Array,
  sampleRate: number,
  options: DetectOptions = {},
): BpmResult | null {
  const minBpm = options.minBpm ?? MIN_BPM;
  const maxBpm = options.maxBpm ?? MAX_BPM;
  const maxSeconds = options.maxAnalyzeSeconds ?? MAX_ANALYZE_SECONDS;
  if (!(sampleRate > 0) || !(minBpm > 0) || maxBpm <= minBpm) return null;
  if (samples.length < MIN_ANALYZE_SECONDS * sampleRate) return null;

  // 長い音声は中央付近だけを解析する
  let segment = samples;
  const maxSamples = Math.floor(maxSeconds * sampleRate);
  if (samples.length > maxSamples) {
    const start = Math.floor((samples.length - maxSamples) / 2);
    segment = samples.subarray(start, start + maxSamples);
  }

  const hop = Math.max(1, Math.round(sampleRate / 250));
  const frameRate = sampleRate / hop;
  const onset = smooth(computeOnsetEnvelope(segment, hop));

  const minLag = Math.max(2, Math.floor((60 * frameRate) / maxBpm));
  const maxLag = Math.ceil((60 * frameRate) / minBpm);
  if (onset.length < maxLag * 3) return null;

  const acf = autocorrelate(onset, Math.min(onset.length - 1, maxLag * 4 + 2));
  const zero = acf[0];
  if (!(zero > 1e-12)) return null;

  const r = (lag: number) => (lag < acf.length ? acf[lag] / zero : 0);
  // 倍の周期は±1フレームの揺れを許容して最大値を取る
  const rNear = (lag: number) => Math.max(r(lag - 1), r(lag), r(lag + 1), 0);
  const score = (lag: number) => r(lag) + 0.5 * rNear(lag * 2);

  let bestLag = -1;
  let bestScore = -Infinity;
  for (let lag = minLag; lag <= maxLag; lag++) {
    const s = score(lag);
    if (s > bestScore) {
      bestScore = s;
      bestLag = lag;
    }
  }
  if (bestLag < 0 || r(bestLag) <= 0.02) return null;

  // オクターブ誤り対策: 半分の周期（2倍のテンポ）でも同程度に強い周期性があれば、速い方を採る
  for (;;) {
    const half = Math.round(bestLag / 2);
    if (half < minLag) break;
    let cand = half;
    for (const l of [half - 1, half + 1]) {
      if (l >= minLag && r(l) > r(cand)) cand = l;
    }
    if (r(cand) >= 0.9 * r(bestLag)) bestLag = cand;
    else break;
  }

  // 放物線補間でフレーム単位以下に精密化する
  let refined = bestLag;
  if (bestLag > minLag && bestLag < maxLag) {
    const a = score(bestLag - 1);
    const b = score(bestLag);
    const c = score(bestLag + 1);
    const denom = a - 2 * b + c;
    if (Math.abs(denom) > 1e-12) {
      const shift = (0.5 * (a - c)) / denom;
      if (Math.abs(shift) <= 1) refined = bestLag + shift;
    }
  }

  const bpm = (60 * frameRate) / refined;
  const confidence = Math.min(1, Math.max(0, r(bestLag)));
  const alternatives: number[] = [];
  if (bpm / 2 >= 40) alternatives.push(bpm / 2);
  if (bpm * 2 <= 280) alternatives.push(bpm * 2);
  return { bpm, confidence, alternatives };
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export function confidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.5) return 'high';
  if (confidence >= 0.25) return 'medium';
  return 'low';
}

/** 表示用に小数1桁へ丸める（整数に近ければ整数） */
export function formatBpm(bpm: number): string {
  const rounded = Math.round(bpm * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

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
