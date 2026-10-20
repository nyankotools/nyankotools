import { describe, expect, it } from 'vitest';
import {
  NO_CALIBRATION,
  bubblePosition,
  calibrationFrom,
  computeLevel,
  detectSupport,
  deviationFromQuarter,
  formatAngle,
  formatSlope,
  isLevel,
  slopePercent,
  smoothVector,
  toUpVector,
  wrapAngle,
} from './spirit-level';

function up(beta: number, gamma: number) {
  const v = toUpVector(beta, gamma);
  if (!v) throw new Error('invalid');
  return v;
}

describe('toUpVector', () => {
  it('水平に置くと (0,0,1)', () => {
    const v = up(0, 0);
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(0);
    expect(v.z).toBeCloseTo(1);
  });
  it('縦持ち (beta=90) は (0,1,0)', () => {
    const v = up(90, 0);
    expect(v.y).toBeCloseTo(1);
    expect(v.z).toBeCloseTo(0);
  });
  it('単位ベクトルになる', () => {
    const v = up(37, -22);
    expect(Math.hypot(v.x, v.y, v.z)).toBeCloseTo(1);
  });
  it('null / NaN / 文字列は null', () => {
    expect(toUpVector(null, 0)).toBeNull();
    expect(toUpVector(0, undefined)).toBeNull();
    expect(toUpVector(NaN, 0)).toBeNull();
    expect(toUpVector('1', 0)).toBeNull();
  });
});

describe('computeLevel (flat)', () => {
  it('水平なら 0', () => {
    const r = computeLevel(up(0, 0), 'flat');
    expect(r.total).toBeCloseTo(0);
    expect(isLevel(r)).toBe(true);
  });
  it('beta / gamma の小さな傾きが各軸に出る', () => {
    const r = computeLevel(up(3, 4), 'flat');
    expect(r.y).toBeCloseTo(3, 1);
    expect(r.x).toBeCloseTo(-4, 1);
    expect(r.total).toBeCloseTo(5, 1);
  });
  it('裏返しは valid=false', () => {
    expect(computeLevel(up(180, 0), 'flat').valid).toBe(false);
  });
  it('許容角の境界', () => {
    const r = computeLevel(up(0.5, 0), 'flat');
    expect(isLevel(r, 0.5)).toBe(true);
    expect(isLevel(r, 0.4)).toBe(false);
    expect(isLevel(computeLevel(up(180, 0), 'flat'))).toBe(false);
  });
});

describe('キャリブレーション', () => {
  it('現在の姿勢をゼロ点にすると 0 になる', () => {
    const tilted = up(2, -3);
    const cal = calibrationFrom(tilted, 'flat');
    const r = computeLevel(tilted, 'flat', cal);
    expect(r.x).toBeCloseTo(0);
    expect(r.y).toBeCloseTo(0);
    expect(isLevel(r)).toBe(true);
  });
  it('ゼロ点との差分が出る', () => {
    const cal = calibrationFrom(up(2, 0), 'flat');
    const r = computeLevel(up(5, 0), 'flat', cal);
    expect(r.y).toBeCloseTo(3, 1);
  });
  it('校正なしと NO_CALIBRATION は同じ', () => {
    expect(computeLevel(up(1, 1), 'flat')).toEqual(
      computeLevel(up(1, 1), 'flat', NO_CALIBRATION),
    );
  });
  it('upright でもゼロ点が効く', () => {
    const v = up(90, 3);
    const cal = calibrationFrom(v, 'upright');
    expect(computeLevel(v, 'upright', cal).total).toBeCloseTo(0);
  });
});

describe('computeLevel (upright)', () => {
  it('縦持ちでまっすぐなら 0', () => {
    const r = computeLevel(up(90, 0), 'upright');
    expect(r.total).toBeCloseTo(0);
    expect(r.valid).toBe(true);
  });
  it('横持ち (90度回転) もずれ 0 として扱う', () => {
    // 端末の右辺が上 = u.x が 1
    const r = computeLevel({ x: 1, y: 0, z: 0 }, 'upright');
    expect(r.total).toBeCloseTo(0);
  });
  it('画面内の回転は右が高いと正', () => {
    const a = (5 * Math.PI) / 180;
    const r = computeLevel({ x: Math.sin(a), y: Math.cos(a), z: 0 }, 'upright');
    expect(r.x).toBeCloseTo(5);
    expect(r.total).toBeCloseTo(5);
  });
  it('上下逆さまでも判定できる', () => {
    const r = computeLevel({ x: 0, y: -1, z: 0 }, 'upright');
    expect(r.total).toBeCloseTo(0);
  });
  it('寝かせている (画面が上向き) と valid=false', () => {
    expect(computeLevel(up(0, 0), 'upright').valid).toBe(false);
  });
});

describe('bubblePosition', () => {
  it('水平なら中央', () => {
    expect(bubblePosition(computeLevel(up(0, 0), 'flat'), 'flat')).toEqual({
      x: expect.closeTo(0),
      y: expect.closeTo(0),
    });
  });
  it('右が高いと気泡は右、上端が高いと気泡は上 (画面座標で負)', () => {
    const right = bubblePosition({ x: 5, y: 0, total: 5, valid: true }, 'flat');
    expect(right.x).toBeCloseTo(0.5);
    const top = bubblePosition({ x: 0, y: 5, total: 5, valid: true }, 'flat');
    expect(top.y).toBeCloseTo(-0.5);
  });
  it('範囲を超えても円の内側に収まる', () => {
    const p = bubblePosition({ x: 40, y: 40, total: 56, valid: true }, 'flat');
    expect(Math.hypot(p.x, p.y)).toBeCloseTo(1);
  });
  it('upright は x のみ', () => {
    const p = bubblePosition({ x: -5, y: 9, total: 5, valid: true }, 'upright');
    expect(p.x).toBeCloseTo(-0.5);
    expect(p.y).toBe(0);
  });
  it('range が不正でも NaN にならない', () => {
    const p = bubblePosition({ x: 1, y: 1, total: 1, valid: true }, 'flat', 0);
    expect(Number.isFinite(p.x)).toBe(true);
  });
});

describe('補助関数', () => {
  it('wrapAngle', () => {
    expect(wrapAngle(190)).toBeCloseTo(-170);
    expect(wrapAngle(-190)).toBeCloseTo(170);
    expect(wrapAngle(180)).toBe(180);
    expect(wrapAngle(-180)).toBe(180);
    expect(wrapAngle(720)).toBeCloseTo(0);
  });
  it('deviationFromQuarter', () => {
    expect(deviationFromQuarter(3)).toBeCloseTo(3);
    expect(deviationFromQuarter(93)).toBeCloseTo(3);
    expect(deviationFromQuarter(-87)).toBeCloseTo(3);
    expect(deviationFromQuarter(177)).toBeCloseTo(-3);
    expect(deviationFromQuarter(-180)).toBeCloseTo(0);
  });
  it('slopePercent / formatSlope', () => {
    expect(slopePercent(45)).toBeCloseTo(100);
    expect(slopePercent(0)).toBe(0);
    expect(slopePercent(-5.7106)).toBeCloseTo(10, 2);
    expect(slopePercent(90)).toBe(Infinity);
    expect(formatSlope(2)).toBe('3.5');
    expect(formatSlope(60)).toBe('173');
    expect(formatSlope(90)).toBe('-');
  });
  it('formatAngle は -0 を出さない', () => {
    expect(formatAngle(-0.01)).toBe('0.0');
    expect(formatAngle(-1.26)).toBe('-1.3');
    expect(formatAngle(2)).toBe('2.0');
    expect(formatAngle(NaN)).toBe('-');
  });
  it('smoothVector', () => {
    const a = { x: 0, y: 0, z: 1 };
    expect(smoothVector(null, a, 0.5)).toBe(a);
    const s = smoothVector(a, { x: 1, y: 0, z: 0 }, 0.5);
    expect(Math.hypot(s.x, s.y, s.z)).toBeCloseTo(1);
    expect(s.x).toBeGreaterThan(0);
    expect(smoothVector(a, { x: 1, y: 0, z: 0 }, 0)).toEqual(a);
  });
  it('detectSupport', () => {
    expect(detectSupport(undefined)).toBe('unsupported');
    expect(detectSupport(function () {})).toBe('ready');
    const ios = Object.assign(function () {}, {
      requestPermission: () => Promise.resolve('granted'),
    });
    expect(detectSupport(ios)).toBe('needs-permission');
  });
});
