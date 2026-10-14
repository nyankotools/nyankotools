export type DistanceUnit = 'km' | 'mi';
export type PaceMode = 'pace' | 'time' | 'distance';

export const KM_PER_MILE = 1.609344;
export const MAX_DISTANCE_KM = 1000;
export const MAX_TIME_SECONDS = 1000 * 3600;
export const MAX_PACE_SECONDS_PER_KM = 3600;

export function distanceToKm(value: number, unit: DistanceUnit): number {
  return unit === 'mi' ? value * KM_PER_MILE : value;
}

export function kmToDistance(km: number, unit: DistanceUnit): number {
  return unit === 'mi' ? km / KM_PER_MILE : km;
}

/** 時・分・秒から合計秒数を求める。不正な値（負数・非数）は null。 */
export function toSeconds(
  hours: number,
  minutes: number,
  seconds: number,
): number | null {
  if (![hours, minutes, seconds].every((v) => isFinite(v) && v >= 0))
    return null;
  const total = hours * 3600 + minutes * 60 + seconds;
  return total > 0 && total <= MAX_TIME_SECONDS ? total : null;
}

function validDistance(km: number): boolean {
  return isFinite(km) && km > 0 && km <= MAX_DISTANCE_KM;
}

function validPace(secPerKm: number): boolean {
  return (
    isFinite(secPerKm) && secPerKm > 0 && secPerKm <= MAX_PACE_SECONDS_PER_KM
  );
}

/** 距離(km)と時間(秒)から1kmあたりの秒数。 */
export function paceFromDistanceTime(
  distanceKm: number,
  seconds: number,
): number | null {
  if (!validDistance(distanceKm)) return null;
  if (!isFinite(seconds) || seconds <= 0 || seconds > MAX_TIME_SECONDS)
    return null;
  const pace = seconds / distanceKm;
  return validPace(pace) ? pace : null;
}

/** 距離(km)と1kmあたりの秒数からタイム(秒)。 */
export function timeFromDistancePace(
  distanceKm: number,
  secPerKm: number,
): number | null {
  if (!validDistance(distanceKm) || !validPace(secPerKm)) return null;
  const t = distanceKm * secPerKm;
  return t <= MAX_TIME_SECONDS ? t : null;
}

/** タイム(秒)と1kmあたりの秒数から距離(km)。 */
export function distanceFromTimePace(
  seconds: number,
  secPerKm: number,
): number | null {
  if (!isFinite(seconds) || seconds <= 0 || seconds > MAX_TIME_SECONDS)
    return null;
  if (!validPace(secPerKm)) return null;
  const d = seconds / secPerKm;
  return validDistance(d) ? d : null;
}

/** 1kmあたりの秒数から時速(km/h)。 */
export function speedKmh(secPerKm: number): number {
  return 3600 / secPerKm;
}

/** 秒数を h:mm:ss に整形する（四捨五入して秒単位）。 */
export function formatDuration(totalSeconds: number): string {
  const rounded = Math.round(totalSeconds);
  const h = Math.floor(rounded / 3600);
  const m = Math.floor((rounded % 3600) / 60);
  const s = rounded % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** 1km（または1マイル）あたりの秒数を m:ss に整形する。 */
export function formatPace(secondsPerUnit: number): string {
  const rounded = Math.round(secondsPerUnit);
  const m = Math.floor(rounded / 60);
  const s = rounded % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export interface RaceDistance {
  id: string;
  km: number;
}

export const raceDistances: RaceDistance[] = [
  { id: '1mile', km: KM_PER_MILE },
  { id: '3k', km: 3 },
  { id: '5k', km: 5 },
  { id: '10k', km: 10 },
  { id: 'half', km: 21.0975 },
  { id: 'full', km: 42.195 },
  { id: '100k', km: 100 },
];

export interface RacePrediction {
  id: string;
  km: number;
  seconds: number;
}

/** 同一ペースで走り続けた場合の大会距離別の予想タイム。 */
export function predictRaceTimes(secPerKm: number): RacePrediction[] {
  if (!validPace(secPerKm)) return [];
  return raceDistances.map((r) => ({
    id: r.id,
    km: r.km,
    seconds: r.km * secPerKm,
  }));
}

export interface HeartRateZone {
  zone: number;
  minPercent: number;
  maxPercent: number;
  minBpm: number;
  maxBpm: number;
}

export interface HeartRateResult {
  maxHr: number;
  restingHr: number;
  reserve: number;
  zones: HeartRateZone[];
}

export const MIN_AGE = 10;
export const MAX_AGE = 100;

const zoneBounds: [number, number][] = [
  [50, 60],
  [60, 70],
  [70, 80],
  [80, 90],
  [90, 100],
];

/**
 * カルボーネン法（心拍予備量法）による心拍ゾーン。
 * 最大心拍数 = 220 - 年齢、目標心拍数 = (最大 - 安静時) × 強度 + 安静時。
 */
export function calculateHeartRateZones(
  age: number,
  restingHr: number,
): HeartRateResult | null {
  if (!Number.isInteger(age) || age < MIN_AGE || age > MAX_AGE) return null;
  if (!isFinite(restingHr) || restingHr < 20 || restingHr > 150) return null;
  const maxHr = 220 - age;
  if (restingHr >= maxHr) return null;
  const reserve = maxHr - restingHr;
  const zones = zoneBounds.map(([lo, hi], i) => ({
    zone: i + 1,
    minPercent: lo,
    maxPercent: hi,
    minBpm: Math.round(restingHr + (reserve * lo) / 100),
    maxBpm: Math.round(restingHr + (reserve * hi) / 100),
  }));
  return { maxHr, restingHr, reserve, zones };
}
