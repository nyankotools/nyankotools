// 水平器: DeviceOrientationEvent の beta / gamma から傾きを求める純ロジック。
// 端末座標系での「上向きベクトル」(重力の逆向き) を経由して計算する。

export type LevelMode = 'flat' | 'upright';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Calibration {
  /** flat: x 方向の傾き / upright: 回転角 (度) */
  a: number;
  /** flat: y 方向の傾き / upright: 未使用 */
  b: number;
}

export interface LevelReading {
  /** flat: 左右の傾き (右が高いと正)。upright: 画面内の回転のずれ */
  x: number;
  /** flat: 前後の傾き (上端が高いと正)。upright: 0 */
  y: number;
  /** 水平(垂直)からのずれの大きさ (度) */
  total: number;
  /** upright で端末が寝すぎていて測れないとき false */
  valid: boolean;
}

export const NO_CALIBRATION: Calibration = { a: 0, b: 0 };
/** 「水平」と判定する許容角 (度) */
export const DEFAULT_TOLERANCE = 0.5;
/** 気泡が端に届く角度 (度) */
export const BUBBLE_RANGE = 10;
/** upright で端末が寝すぎ (画面が上を向く) と判断する |u.z| のしきい値 */
const UPRIGHT_MAX_Z = 0.85;

const DEG = 180 / Math.PI;
const RAD = Math.PI / 180;

export function isValidAngle(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/** beta / gamma (度) を端末座標系の上向き単位ベクトルへ。値が不正なら null */
export function toUpVector(beta: unknown, gamma: unknown): Vec3 | null {
  if (!isValidAngle(beta) || !isValidAngle(gamma)) return null;
  const b = beta * RAD;
  const g = gamma * RAD;
  return {
    x: -Math.cos(b) * Math.sin(g),
    y: Math.sin(b),
    z: Math.cos(b) * Math.cos(g),
  };
}

/** 指数移動平均 (alpha: 0..1、大きいほど追従が速い)。prev が null なら next */
export function smoothVector(
  prev: Vec3 | null,
  next: Vec3,
  alpha: number,
): Vec3 {
  if (!prev) return next;
  const a = Math.min(1, Math.max(0, alpha));
  const v = {
    x: prev.x + (next.x - prev.x) * a,
    y: prev.y + (next.y - prev.y) * a,
    z: prev.z + (next.z - prev.z) * a,
  };
  const len = Math.hypot(v.x, v.y, v.z);
  return len === 0 ? next : { x: v.x / len, y: v.y / len, z: v.z / len };
}

/** 角度を -180〜180 に収める */
export function wrapAngle(deg: number): number {
  let r = deg % 360;
  if (r > 180) r -= 360;
  if (r <= -180) r += 360;
  return r;
}

/** 90度刻みの最寄りの向きからのずれ (-45〜45) */
export function deviationFromQuarter(deg: number): number {
  const w = wrapAngle(deg);
  let r = w % 90;
  if (r > 45) r -= 90;
  if (r < -45) r += 90;
  return r;
}

/** 校正前の生の値 (flat: 左右/前後の傾き, upright: 回転角) */
export function rawAngles(
  up: Vec3,
  mode: LevelMode,
): { a: number; b: number; valid: boolean } {
  if (mode === 'flat') {
    // 裏返し (画面が下向き) でも極端な値にならないよう z の符号は保持
    return {
      a: Math.atan2(up.x, up.z) * DEG,
      b: Math.atan2(up.y, up.z) * DEG,
      valid: up.z > 0,
    };
  }
  return {
    a: Math.atan2(up.x, up.y) * DEG,
    b: 0,
    valid: Math.abs(up.z) < UPRIGHT_MAX_Z,
  };
}

export function computeLevel(
  up: Vec3,
  mode: LevelMode,
  calibration: Calibration = NO_CALIBRATION,
): LevelReading {
  const raw = rawAngles(up, mode);
  if (mode === 'flat') {
    const x = raw.a - calibration.a;
    const y = raw.b - calibration.b;
    return { x, y, total: Math.hypot(x, y), valid: raw.valid };
  }
  const x = wrapAngle(deviationFromQuarter(raw.a) - calibration.a);
  return { x, y: 0, total: Math.abs(x), valid: raw.valid };
}

/** 現在の姿勢を「水平 (0度)」として記録する校正値 */
export function calibrationFrom(up: Vec3, mode: LevelMode): Calibration {
  const raw = rawAngles(up, mode);
  if (mode === 'flat') return { a: raw.a, b: raw.b };
  return { a: deviationFromQuarter(raw.a), b: 0 };
}

/** 許容角以内なら水平 */
export function isLevel(
  reading: LevelReading,
  tolerance: number = DEFAULT_TOLERANCE,
): boolean {
  return reading.valid && reading.total <= Math.max(0, tolerance);
}

/** 気泡の位置 (-1〜1)。画面座標 (右が +x、下が +y)。円の内側に収める */
export function bubblePosition(
  reading: LevelReading,
  mode: LevelMode,
  range: number = BUBBLE_RANGE,
): { x: number; y: number } {
  const r = range > 0 ? range : BUBBLE_RANGE;
  // 気泡は高い側へ動く。upright は横方向の管なので x のみ使う
  const dx = reading.x / r;
  const dy = mode === 'flat' ? -reading.y / r : 0;
  const len = Math.hypot(dx, dy);
  if (len > 1) return { x: dx / len, y: dy / len };
  return { x: dx, y: dy };
}

/** 傾斜率 (%)。90度付近は上限で丸める */
export function slopePercent(deg: number): number {
  const abs = Math.abs(deg);
  if (abs >= 89.9) return Infinity;
  return Math.tan(abs * RAD) * 100;
}

export function formatAngle(deg: number, digits = 1): string {
  if (!Number.isFinite(deg)) return '-';
  const fixed = Math.abs(deg).toFixed(digits);
  // -0.0 を避ける
  const sign = deg < 0 && Number(fixed) !== 0 ? '-' : '';
  return `${sign}${fixed}`;
}

export function formatSlope(deg: number): string {
  const p = slopePercent(deg);
  if (!Number.isFinite(p)) return '-';
  return p >= 100 ? p.toFixed(0) : p.toFixed(1);
}

export type SensorSupport = 'unsupported' | 'needs-permission' | 'ready';

/** DeviceOrientationEvent の有無と requestPermission の有無から状態を決める */
export function detectSupport(ctor: unknown): SensorSupport {
  if (typeof ctor !== 'function') return 'unsupported';
  const maybe = ctor as { requestPermission?: unknown };
  return typeof maybe.requestPermission === 'function'
    ? 'needs-permission'
    : 'ready';
}
