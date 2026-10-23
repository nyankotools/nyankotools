/** 緯度経度の度分秒変換・2点間距離（Haversine）の純粋ロジック */

export type Axis = 'lat' | 'lon';

export type ParseError =
  | 'empty'
  | 'invalidChars'
  | 'tooManyParts'
  | 'directionMismatch'
  | 'minutesOutOfRange'
  | 'secondsOutOfRange'
  | 'notInteger'
  | 'outOfRange';

export type ParseResult =
  { ok: true; value: number } | { ok: false; error: ParseError };

/** 地球の平均半径（IUGG, m） */
export const EARTH_RADIUS_M = 6371008.8;
const METERS_PER_MILE = 1609.344;
const METERS_PER_NAUTICAL_MILE = 1852;

const NUMBER_RE = /\d+(?:\.\d+)?|\.\d+/g;
const DIRECTION_RE = /[NSEW北南東西]/gi;

function normalize(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/′′|''|[″”“]/g, '"')
    .replace(/[′’‘´`]/g, "'")
    .replace(/[º˚]/g, '°')
    .replace(/度/g, '°')
    .replace(/分/g, "'")
    .replace(/秒/g, '"');
}

/**
 * 緯度または経度の文字列を10進度に変換する。
 * 10進度（35.6586）・度分秒（35°39'31"）・度分（35°39.5'）・
 * 方位文字（N/S/E/W、北南東西）・全角文字に対応する。
 */
export function parseAngle(input: string, axis: Axis): ParseResult {
  let s = normalize(input).trim();
  if (s === '') return { ok: false, error: 'empty' };

  // 方位文字
  const dirs = s.match(DIRECTION_RE) ?? [];
  if (dirs.length > 1) return { ok: false, error: 'directionMismatch' };
  let negative = false;
  if (dirs.length === 1) {
    const d = dirs[0].toUpperCase();
    const allowed =
      axis === 'lat' ? ['N', 'S', '北', '南'] : ['E', 'W', '東', '西'];
    if (!allowed.includes(d)) return { ok: false, error: 'directionMismatch' };
    negative = d === 'S' || d === 'W' || d === '南' || d === '西';
    s = s
      .replace(DIRECTION_RE, ' ')
      .replace(/[緯経]/g, ' ')
      .trim();
  }

  // 先頭の符号
  const signMatch = s.match(/^([+\-−‐–])\s*/);
  if (signMatch) {
    if (signMatch[1] !== '+') negative = true;
    s = s.slice(signMatch[0].length);
  }

  const nums = s.match(NUMBER_RE) ?? [];
  const rest = s.replace(NUMBER_RE, ' ');
  if (nums.length === 0 || !/^[\s°'",:]*$/.test(rest)) {
    return { ok: false, error: 'invalidChars' };
  }
  if (nums.length > 3) return { ok: false, error: 'tooManyParts' };

  const [deg, min, sec] = nums.map(Number);
  if (nums.length >= 2) {
    if (!Number.isInteger(deg)) return { ok: false, error: 'notInteger' };
    if (min >= 60) return { ok: false, error: 'minutesOutOfRange' };
  }
  if (nums.length === 3) {
    if (!Number.isInteger(min)) return { ok: false, error: 'notInteger' };
    if (sec >= 60) return { ok: false, error: 'secondsOutOfRange' };
  }

  const abs = deg + (min ?? 0) / 60 + (sec ?? 0) / 3600;
  const limit = axis === 'lat' ? 90 : 180;
  if (abs > limit) return { ok: false, error: 'outOfRange' };
  return { ok: true, value: negative && abs !== 0 ? -abs : abs };
}

export interface DmsParts {
  /** 方位（N/S/E/W） */
  direction: 'N' | 'S' | 'E' | 'W';
  degrees: number;
  minutes: number;
  /** 秒（小数桁は指定桁に丸め済み） */
  seconds: number;
}

function directionOf(value: number, axis: Axis, nonZero: boolean) {
  const negative = value < 0 && nonZero;
  if (axis === 'lat') return negative ? 'S' : 'N';
  return negative ? 'W' : 'E';
}

/** 10進度を度分秒に分解する。秒の小数桁で丸め、繰り上がりを正しく処理する。 */
export function toDms(value: number, axis: Axis, decimals = 2): DmsParts {
  const scale = 10 ** decimals;
  const total = Math.round(Math.abs(value) * 3600 * scale);
  const secUnits = total % (60 * scale);
  const rest = (total - secUnits) / (60 * scale);
  const minutes = rest % 60;
  return {
    direction: directionOf(value, axis, total > 0),
    degrees: (rest - minutes) / 60,
    minutes,
    seconds: secUnits / scale,
  };
}

export function formatDms(value: number, axis: Axis, decimals = 2): string {
  const p = toDms(value, axis, decimals);
  return `${p.degrees}°${p.minutes}′${p.seconds.toFixed(decimals)}″ ${p.direction}`;
}

/** 度分形式（度と小数の分） */
export function formatDdm(value: number, axis: Axis, decimals = 4): string {
  const scale = 10 ** decimals;
  const total = Math.round(Math.abs(value) * 60 * scale);
  const minUnits = total % (60 * scale);
  const degrees = (total - minUnits) / (60 * scale);
  const dir = directionOf(value, axis, total > 0);
  return `${degrees}°${(minUnits / scale).toFixed(decimals)}′ ${dir}`;
}

/** 10進度（符号付き）の文字列 */
export function formatDecimal(value: number, decimals = 6): string {
  const text = value.toFixed(decimals);
  return Number(text) === 0 ? (0).toFixed(decimals) : text;
}

export interface Point {
  lat: number;
  lon: number;
}

const toRad = (d: number) => (d * Math.PI) / 180;
const toDeg = (r: number) => (r * 180) / Math.PI;

/** Haversine公式による大圏距離（メートル） */
export function haversineMeters(a: Point, b: Point): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)));
  return EARTH_RADIUS_M * c;
}

/** AからBへの初期方位角（北=0°、時計回り、0以上360未満）。同一地点はnull。 */
export function initialBearing(a: Point, b: Point): number | null {
  if (a.lat === b.lat && a.lon === b.lon) return null;
  const p1 = toRad(a.lat);
  const p2 = toRad(b.lat);
  const dLon = toRad(b.lon - a.lon);
  const y = Math.sin(dLon) * Math.cos(p2);
  const x =
    Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dLon);
  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return bearing >= 359.9999999999 ? 0 : bearing;
}

/** 2点間の大圏の中間点 */
export function midpoint(a: Point, b: Point): Point {
  const p1 = toRad(a.lat);
  const p2 = toRad(b.lat);
  const l1 = toRad(a.lon);
  const dLon = toRad(b.lon - a.lon);
  const bx = Math.cos(p2) * Math.cos(dLon);
  const by = Math.cos(p2) * Math.sin(dLon);
  const lat = Math.atan2(
    Math.sin(p1) + Math.sin(p2),
    Math.sqrt((Math.cos(p1) + bx) ** 2 + by ** 2),
  );
  let lon = l1 + Math.atan2(by, Math.cos(p1) + bx);
  lon = ((toDeg(lon) + 540) % 360) - 180;
  return { lat: toDeg(lat), lon };
}

/** 方位角を16方位のインデックス（0=N, 1=NNE, …）にする */
export function compassIndex(bearing: number): number {
  return Math.round((((bearing % 360) + 360) % 360) / 22.5) % 16;
}

export const COMPASS_ABBR = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const;

export interface DistanceResult {
  meters: number;
  kilometers: number;
  miles: number;
  nauticalMiles: number;
  initialBearing: number | null;
  finalBearing: number | null;
  midpoint: Point;
}

export function measure(a: Point, b: Point): DistanceResult {
  const meters = haversineMeters(a, b);
  const back = initialBearing(b, a);
  return {
    meters,
    kilometers: meters / 1000,
    miles: meters / METERS_PER_MILE,
    nauticalMiles: meters / METERS_PER_NAUTICAL_MILE,
    initialBearing: initialBearing(a, b),
    finalBearing: back === null ? null : (back + 180) % 360,
    midpoint: midpoint(a, b),
  };
}
