export type SizeUnit = 'KB' | 'MB' | 'GB' | 'TB';
export type SpeedUnit = 'kbps' | 'Mbps' | 'Gbps' | 'MBps';

export type DownloadTimeError =
  'invalidSize' | 'invalidSpeed' | 'invalidEfficiency';

export interface DownloadTimeInput {
  size: number;
  sizeUnit: SizeUnit;
  speed: number;
  speedUnit: SpeedUnit;
  /** 回線速度に対する実効速度の割合（%、0より大きく100以下） */
  efficiency: number;
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface DownloadTimeResult {
  /** 所要時間（秒） */
  totalSeconds: number;
  /** 実効速度（MB/s） */
  effectiveMBps: number;
}

/** ファイルサイズの単位（10進。1KB = 1000バイト）をバイトへ換算する倍率 */
const SIZE_BYTES: Record<SizeUnit, number> = {
  KB: 1e3,
  MB: 1e6,
  GB: 1e9,
  TB: 1e12,
};

/** 通信速度の単位を bit/s へ換算する倍率（1MB/s = 8Mbps） */
const SPEED_BITS: Record<SpeedUnit, number> = {
  kbps: 1e3,
  Mbps: 1e6,
  Gbps: 1e9,
  MBps: 8e6,
};

/** ファイルサイズ・通信速度・実効率からダウンロード所要時間を求める。 */
export function calculateDownloadTime(
  input: DownloadTimeInput,
): DownloadTimeResult | { error: DownloadTimeError } {
  const { size, sizeUnit, speed, speedUnit, efficiency } = input;
  if (!Number.isFinite(size) || size <= 0) return { error: 'invalidSize' };
  if (!Number.isFinite(speed) || speed <= 0) return { error: 'invalidSpeed' };
  if (!Number.isFinite(efficiency) || efficiency <= 0 || efficiency > 100)
    return { error: 'invalidEfficiency' };

  const bits = size * SIZE_BYTES[sizeUnit] * 8;
  const effectiveBps = speed * SPEED_BITS[speedUnit] * (efficiency / 100);
  return {
    totalSeconds: bits / effectiveBps,
    effectiveMBps: effectiveBps / 8e6,
  };
}

/** 秒数を日・時・分・秒に分解する（秒は四捨五入して繰り上がりも反映）。 */
export function splitDuration(totalSeconds: number): Duration {
  let rest = Math.round(totalSeconds);
  const days = Math.floor(rest / 86400);
  rest -= days * 86400;
  const hours = Math.floor(rest / 3600);
  rest -= hours * 3600;
  const minutes = Math.floor(rest / 60);
  return { days, hours, minutes, seconds: rest - minutes * 60 };
}
