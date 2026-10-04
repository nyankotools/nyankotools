import { describe, it, expect } from 'vitest';
import {
  calculateDownloadTime,
  splitDuration,
  type DownloadTimeInput,
} from './download-time-calculator';

const base: DownloadTimeInput = {
  size: 1,
  sizeUnit: 'GB',
  speed: 100,
  speedUnit: 'Mbps',
  efficiency: 100,
};

describe('calculateDownloadTime', () => {
  it('1GBを100Mbpsなら80秒', () => {
    const r = calculateDownloadTime(base);
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(80);
    expect(r.effectiveMBps).toBeCloseTo(12.5);
  });

  it('実効率80%なら時間は1.25倍', () => {
    const r = calculateDownloadTime({ ...base, efficiency: 80 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(100);
  });

  it('MB/s は 8倍の Mbps と同じ', () => {
    const a = calculateDownloadTime({ ...base, speed: 10, speedUnit: 'MBps' });
    const b = calculateDownloadTime({ ...base, speed: 80, speedUnit: 'Mbps' });
    if ('error' in a || 'error' in b) throw new Error('unexpected error');
    expect(a.totalSeconds).toBeCloseTo(b.totalSeconds);
  });

  it('単位の換算（1TBを1Gbpsなら8000秒）', () => {
    const r = calculateDownloadTime({
      ...base,
      sizeUnit: 'TB',
      speed: 1,
      speedUnit: 'Gbps',
    });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(8000);
  });

  it('不正な入力はエラー', () => {
    expect(calculateDownloadTime({ ...base, size: 0 })).toEqual({
      error: 'invalidSize',
    });
    expect(calculateDownloadTime({ ...base, size: NaN })).toEqual({
      error: 'invalidSize',
    });
    expect(calculateDownloadTime({ ...base, speed: -1 })).toEqual({
      error: 'invalidSpeed',
    });
    expect(calculateDownloadTime({ ...base, efficiency: 0 })).toEqual({
      error: 'invalidEfficiency',
    });
    expect(calculateDownloadTime({ ...base, efficiency: 101 })).toEqual({
      error: 'invalidEfficiency',
    });
  });

  it('極めて小さいサイズで計算できる', () => {
    const r = calculateDownloadTime({
      ...base,
      size: 0.001,
      sizeUnit: 'KB',
      speed: 1,
      speedUnit: 'kbps',
    });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(0.008);
  });

  it('極めて小さい速度で計算できる', () => {
    const r = calculateDownloadTime({
      ...base,
      size: 1,
      sizeUnit: 'MB',
      speed: 0.001,
      speedUnit: 'Mbps',
    });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(8000);
  });

  it('実効率が100%で計算できる', () => {
    const r = calculateDownloadTime({ ...base, efficiency: 100 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(80);
  });

  it('実効率が1%で計算できる', () => {
    const r = calculateDownloadTime({ ...base, efficiency: 1 });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(8000);
  });

  it('実効率が100より大きいとエラー', () => {
    expect(calculateDownloadTime({ ...base, efficiency: 100.1 })).toEqual({
      error: 'invalidEfficiency',
    });
  });

  it('Infinity はエラー', () => {
    expect(calculateDownloadTime({ ...base, size: Infinity })).toEqual({
      error: 'invalidSize',
    });
    expect(calculateDownloadTime({ ...base, speed: Infinity })).toEqual({
      error: 'invalidSpeed',
    });
    expect(calculateDownloadTime({ ...base, efficiency: Infinity })).toEqual({
      error: 'invalidEfficiency',
    });
  });

  it('負の値はエラー', () => {
    expect(calculateDownloadTime({ ...base, size: -1 })).toEqual({
      error: 'invalidSize',
    });
    expect(calculateDownloadTime({ ...base, speed: -1 })).toEqual({
      error: 'invalidSpeed',
    });
    expect(calculateDownloadTime({ ...base, efficiency: -1 })).toEqual({
      error: 'invalidEfficiency',
    });
  });

  it('大きなファイルサイズを処理できる', () => {
    const r = calculateDownloadTime({
      ...base,
      size: 100,
      sizeUnit: 'TB',
      speed: 1,
      speedUnit: 'Gbps',
    });
    if ('error' in r) throw new Error('unexpected error');
    expect(r.totalSeconds).toBeCloseTo(800000);
  });
});

describe('splitDuration', () => {
  it('日・時・分・秒に分解する', () => {
    expect(splitDuration(93784)).toEqual({
      days: 1,
      hours: 2,
      minutes: 3,
      seconds: 4,
    });
  });

  it('秒の四捨五入で繰り上がる', () => {
    expect(splitDuration(59.6)).toEqual({
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 0,
    });
  });

  it('0秒で分解できる', () => {
    expect(splitDuration(0)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('数秒で分解できる', () => {
    expect(splitDuration(5)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 5,
    });
  });

  it('1分未満の秒で四捨五入される', () => {
    expect(splitDuration(0.4)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });

  it('1分以上1.5分未満で繰り上がらない', () => {
    expect(splitDuration(69.4)).toEqual({
      days: 0,
      hours: 0,
      minutes: 1,
      seconds: 9,
    });
  });

  it('1日以上で日・時・分・秒に分解される', () => {
    expect(splitDuration(86400)).toEqual({
      days: 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  });
});
