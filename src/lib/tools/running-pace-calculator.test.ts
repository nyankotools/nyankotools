import { describe, expect, it } from 'vitest';
import {
  calculateHeartRateZones,
  distanceFromTimePace,
  distanceToKm,
  formatDuration,
  formatPace,
  kmToDistance,
  paceFromDistanceTime,
  predictRaceTimes,
  speedKmh,
  timeFromDistancePace,
  toSeconds,
} from './running-pace-calculator';

describe('toSeconds', () => {
  it('時分秒を合計する', () => {
    expect(toSeconds(1, 30, 15)).toBe(5415);
  });
  it('0・負数・非数は null', () => {
    expect(toSeconds(0, 0, 0)).toBeNull();
    expect(toSeconds(-1, 0, 10)).toBeNull();
    expect(toSeconds(NaN, 0, 10)).toBeNull();
  });
  it('過大は null', () => {
    expect(toSeconds(1001, 0, 0)).toBeNull();
  });
});

describe('ペース・タイム・距離', () => {
  it('10kmを50分で走ると5:00/km・12km/h', () => {
    const pace = paceFromDistanceTime(10, 3000)!;
    expect(pace).toBe(300);
    expect(formatPace(pace)).toBe('5:00');
    expect(speedKmh(pace)).toBeCloseTo(12);
  });
  it('距離×ペース→タイム', () => {
    expect(timeFromDistancePace(21.0975, 300)).toBeCloseTo(6329.25);
    expect(formatDuration(6329.25)).toBe('1:45:29');
  });
  it('タイム×ペース→距離', () => {
    expect(distanceFromTimePace(3600, 360)).toBeCloseTo(10);
  });
  it('不正入力は null', () => {
    expect(paceFromDistanceTime(0, 100)).toBeNull();
    expect(paceFromDistanceTime(-5, 100)).toBeNull();
    expect(paceFromDistanceTime(5, 0)).toBeNull();
    expect(paceFromDistanceTime(5000, 100)).toBeNull();
    expect(timeFromDistancePace(10, 0)).toBeNull();
    expect(timeFromDistancePace(10, 99999)).toBeNull();
    expect(distanceFromTimePace(0, 300)).toBeNull();
  });
  it('マイル換算', () => {
    expect(distanceToKm(1, 'mi')).toBeCloseTo(1.609344);
    expect(kmToDistance(1.609344, 'mi')).toBeCloseTo(1);
    expect(distanceToKm(5, 'km')).toBe(5);
  });
});

describe('formatDuration / formatPace', () => {
  it('秒の繰り上がり', () => {
    expect(formatDuration(59.6)).toBe('0:01:00');
    expect(formatPace(299.6)).toBe('5:00');
  });
});

describe('predictRaceTimes', () => {
  it('フルマラソンの予想タイム', () => {
    const list = predictRaceTimes(300);
    const full = list.find((r) => r.id === 'full')!;
    expect(formatDuration(full.seconds)).toBe('3:30:59');
    expect(list.find((r) => r.id === '5k')!.seconds).toBe(1500);
  });
  it('不正ペースは空', () => {
    expect(predictRaceTimes(0)).toEqual([]);
  });
});

describe('calculateHeartRateZones', () => {
  it('40歳・安静時60でカルボーネン法', () => {
    const r = calculateHeartRateZones(40, 60)!;
    expect(r.maxHr).toBe(180);
    expect(r.reserve).toBe(120);
    expect(r.zones[0]).toMatchObject({ minBpm: 120, maxBpm: 132 });
    expect(r.zones[4]).toMatchObject({ minBpm: 168, maxBpm: 180 });
  });
  it('不正入力は null', () => {
    expect(calculateHeartRateZones(5, 60)).toBeNull();
    expect(calculateHeartRateZones(30.5, 60)).toBeNull();
    expect(calculateHeartRateZones(40, 0)).toBeNull();
    expect(calculateHeartRateZones(100, 130)).toBeNull();
    expect(calculateHeartRateZones(40, -1)).toBeNull();
  });
  it('年齢・安静時心拍の境界と、安静時が最大心拍以上なら null', () => {
    expect(calculateHeartRateZones(10, 150)).not.toBeNull();
    expect(calculateHeartRateZones(100, 119)).not.toBeNull();
    expect(calculateHeartRateZones(100, 120)).toBeNull();
    expect(calculateHeartRateZones(40, 151)).toBeNull();
  });
});

describe('境界値', () => {
  it('合計時間の上限（1000時間）ちょうどは許可、超えると null', () => {
    expect(toSeconds(1000, 0, 0)).toBe(3600000);
    expect(toSeconds(1000, 0, 0.5)).toBeNull();
  });
  it('ペースの上限（1km 60分）と距離の上限（1000km）', () => {
    expect(paceFromDistanceTime(1, 3600)).toBe(3600);
    expect(paceFromDistanceTime(1, 3600.5)).toBeNull();
    expect(paceFromDistanceTime(1000, 3600000)).toBe(3600);
    expect(paceFromDistanceTime(1000.5, 100)).toBeNull();
  });
  it('表示の境界: 1時間を超える時間・0のペース', () => {
    expect(formatDuration(36000)).toBe('10:00:00');
    expect(formatPace(0)).toBe('0:00');
    expect(formatPace(59.5)).toBe('1:00');
  });
});
