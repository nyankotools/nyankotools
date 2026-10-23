import { describe, expect, it } from 'vitest';
import {
  compassIndex,
  formatDdm,
  formatDecimal,
  formatDms,
  haversineMeters,
  initialBearing,
  measure,
  midpoint,
  parseAngle,
  toDms,
} from './coordinate-converter';

function val(input: string, axis: 'lat' | 'lon' = 'lat') {
  const r = parseAngle(input, axis);
  if (!r.ok) throw new Error(r.error);
  return r.value;
}
function err(input: string, axis: 'lat' | 'lon' = 'lat') {
  const r = parseAngle(input, axis);
  return r.ok ? null : r.error;
}

describe('parseAngle', () => {
  it('10進度を読む', () => {
    expect(val('35.6586')).toBeCloseTo(35.6586, 10);
    expect(val('-33.8688')).toBeCloseTo(-33.8688, 10);
    expect(val('+10')).toBe(10);
  });
  it('度分秒を読む', () => {
    expect(val(`35°39'31"`)).toBeCloseTo(35 + 39 / 60 + 31 / 3600, 10);
    expect(val('35 39 31')).toBeCloseTo(35 + 39 / 60 + 31 / 3600, 10);
    expect(val('35度39分31秒')).toBeCloseTo(35 + 39 / 60 + 31 / 3600, 10);
    expect(val('35°39′31.5″')).toBeCloseTo(35 + 39 / 60 + 31.5 / 3600, 10);
  });
  it('度分を読む', () => {
    expect(val(`35°30'`)).toBeCloseTo(35.5, 10);
  });
  it('方位文字で符号が決まる', () => {
    expect(val('35.5 S')).toBe(-35.5);
    expect(val('N 35.5')).toBe(35.5);
    expect(val('139.5W', 'lon')).toBe(-139.5);
    expect(val('東経 139.5', 'lon')).toBe(139.5);
    expect(val('南緯35.5')).toBe(-35.5);
  });
  it('全角文字を受け付ける', () => {
    expect(val('３５．５')).toBe(35.5);
    expect(val('－３５．５')).toBe(-35.5);
  });
  it('軸と合わない方位文字はエラー', () => {
    expect(err('35 E', 'lat')).toBe('directionMismatch');
    expect(err('139 N', 'lon')).toBe('directionMismatch');
    expect(err('N 35 S')).toBe('directionMismatch');
  });
  it('範囲外・不正入力はエラー', () => {
    expect(err('')).toBe('empty');
    expect(err('   ')).toBe('empty');
    expect(err('90.1')).toBe('outOfRange');
    expect(err('181', 'lon')).toBe('outOfRange');
    expect(err('abc')).toBe('invalidChars');
    expect(err('35 60 0')).toBe('minutesOutOfRange');
    expect(err('35 10 60')).toBe('secondsOutOfRange');
    expect(err('35.5 10 10')).toBe('notInteger');
    expect(err('35 10.5 10')).toBe('notInteger');
    expect(err('1 2 3 4')).toBe('tooManyParts');
    expect(err('35-10')).toBe('invalidChars');
  });
  it('境界値を受け付ける', () => {
    expect(val('90')).toBe(90);
    expect(val('-180', 'lon')).toBe(-180);
    expect(err('90 0 1')).toBe('outOfRange');
  });
  it('-0 は 0 にする', () => {
    expect(Object.is(val('-0'), 0)).toBe(true);
  });
});

describe('formatDms', () => {
  it('東京タワー付近を度分秒にする', () => {
    expect(formatDms(35.6586, 'lat', 2)).toBe('35°39′30.96″ N');
    expect(formatDms(139.7454, 'lon', 1)).toBe('139°44′43.4″ E');
  });
  it('負値は S / W', () => {
    expect(formatDms(-33.8688, 'lat', 0)).toBe('33°52′8″ S');
    expect(formatDms(-70.5, 'lon', 0)).toBe('70°30′0″ W');
  });
  it('秒の丸めで繰り上がる', () => {
    const p = toDms(10 + 59 / 60 + 59.999 / 3600, 'lat', 2);
    expect(p).toMatchObject({ degrees: 11, minutes: 0, seconds: 0 });
  });
  it('0度は方位が正方向で、微小な負値でも丸め後0ならN', () => {
    expect(formatDms(0, 'lat', 0)).toBe('0°0′0″ N');
    expect(formatDms(-0.0000001, 'lon', 0)).toBe('0°0′0″ E');
  });
  it('往復して値が戻る', () => {
    const p = toDms(35.658611, 'lat', 3);
    const back = val(`${p.degrees} ${p.minutes} ${p.seconds}`);
    expect(back).toBeCloseTo(35.658611, 6);
  });
});

describe('formatDdm / formatDecimal', () => {
  it('度分形式', () => {
    expect(formatDdm(35.5, 'lat', 2)).toBe('35°30.00′ N');
    expect(formatDdm(-0.99999999, 'lon', 2)).toBe('1°0.00′ W');
  });
  it('10進度は桁数を揃え、-0を出さない', () => {
    expect(formatDecimal(35.6586)).toBe('35.658600');
    expect(formatDecimal(-0.0000001)).toBe('0.000000');
  });
});

describe('距離と方位', () => {
  const tokyo = { lat: 35.6762, lon: 139.6503 };
  const osaka = { lat: 34.6937, lon: 135.5023 };
  const london = { lat: 51.5074, lon: -0.1278 };
  const paris = { lat: 48.8566, lon: 2.3522 };

  it('東京〜大阪は約392km', () => {
    const km = haversineMeters(tokyo, osaka) / 1000;
    expect(km).toBeGreaterThan(390);
    expect(km).toBeLessThan(395);
  });
  it('ロンドン〜パリは約343km', () => {
    expect(haversineMeters(london, paris) / 1000).toBeCloseTo(343.5, 0);
  });
  it('同一地点は距離0・方位なし', () => {
    const r = measure(tokyo, tokyo);
    expect(r.meters).toBe(0);
    expect(r.initialBearing).toBeNull();
    expect(r.finalBearing).toBeNull();
  });
  it('赤道上を東へ1度は約111.2km・方位90度', () => {
    const a = { lat: 0, lon: 0 };
    const b = { lat: 0, lon: 1 };
    expect(haversineMeters(a, b) / 1000).toBeCloseTo(111.195, 2);
    expect(initialBearing(a, b)).toBeCloseTo(90, 6);
    expect(initialBearing(b, a)).toBeCloseTo(270, 6);
  });
  it('真北・真南の方位', () => {
    expect(initialBearing({ lat: 0, lon: 0 }, { lat: 10, lon: 0 })).toBeCloseTo(
      0,
      6,
    );
    expect(initialBearing({ lat: 10, lon: 0 }, { lat: 0, lon: 0 })).toBeCloseTo(
      180,
      6,
    );
  });
  it('対蹠点は地球半周', () => {
    const d = haversineMeters({ lat: 0, lon: 0 }, { lat: 0, lon: 180 });
    expect(d / 1000).toBeCloseTo(20015.1, 0);
  });
  it('日付変更線をまたぐ距離と最終方位', () => {
    const a = { lat: 0, lon: 179 };
    const b = { lat: 0, lon: -179 };
    const r = measure(a, b);
    expect(r.kilometers).toBeCloseTo(222.39, 1);
    expect(r.initialBearing).toBeCloseTo(90, 6);
    expect(r.finalBearing).toBeCloseTo(90, 6);
  });
  it('マイル・海里の換算', () => {
    const r = measure({ lat: 0, lon: 0 }, { lat: 0, lon: 1 });
    expect(r.miles).toBeCloseTo(r.meters / 1609.344, 9);
    expect(r.nauticalMiles).toBeCloseTo(60.04, 1);
  });
  it('中間点', () => {
    const m = midpoint({ lat: 0, lon: 0 }, { lat: 0, lon: 10 });
    expect(m.lat).toBeCloseTo(0, 9);
    expect(m.lon).toBeCloseTo(5, 9);
    const dateLine = midpoint({ lat: 0, lon: 170 }, { lat: 0, lon: -170 });
    expect(Math.abs(dateLine.lon)).toBeCloseTo(180, 6);
  });
  it('16方位', () => {
    expect(compassIndex(0)).toBe(0);
    expect(compassIndex(359)).toBe(0);
    expect(compassIndex(90)).toBe(4);
    expect(compassIndex(202.5)).toBe(9);
  });
});
