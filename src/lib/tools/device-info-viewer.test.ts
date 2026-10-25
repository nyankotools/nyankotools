import { describe, expect, it } from 'vitest';
import {
  API_DEFINITIONS,
  buildReport,
  classifyPointer,
  countSupported,
  describeCpuCores,
  describeDeviceMemory,
  detectApiSupport,
  formatDpr,
  formatResolution,
  normalizeGpuString,
  physicalResolution,
} from './device-info-viewer';

describe('detectApiSupport', () => {
  it('navigator / window 上のプロパティ有無を判定する', () => {
    const rows = detectApiSupport(
      { Notification: class {} },
      { clipboard: {}, requestMIDIAccess: () => {} },
    );
    const byId = Object.fromEntries(rows.map((r) => [r.id, r.supported]));
    expect(byId.clipboard).toBe(true);
    expect(byId.midi).toBe(true);
    expect(byId.notification).toBe(true);
    expect(byId.bluetooth).toBe(false);
    expect(byId.eyedropper).toBe(false);
  });

  it('全定義分の行を返し、IDは重複しない', () => {
    const rows = detectApiSupport({}, {});
    expect(rows).toHaveLength(API_DEFINITIONS.length);
    expect(new Set(rows.map((r) => r.id)).size).toBe(rows.length);
    expect(countSupported(rows)).toBe(0);
  });

  it('null / undefined / プリミティブでも落ちない', () => {
    expect(countSupported(detectApiSupport(null, undefined))).toBe(0);
    expect(countSupported(detectApiSupport('x', 1))).toBe(0);
  });

  it('値がundefinedでもキーが存在すれば対応扱い', () => {
    const rows = detectApiSupport({}, { usb: undefined });
    expect(rows.find((r) => r.id === 'usb')?.supported).toBe(true);
  });
});

describe('formatResolution / physicalResolution / formatDpr', () => {
  it('解像度を整形する', () => {
    expect(formatResolution(1920, 1080)).toBe('1920 × 1080 px');
    expect(formatResolution(NaN, 1)).toBeNull();
    expect(formatResolution(-1, 1)).toBeNull();
  });
  it('物理ピクセルを概算する', () => {
    expect(physicalResolution(1440, 900, 2)).toBe('2880 × 1800 px');
    expect(physicalResolution(1536, 864, 1.25)).toBe('1920 × 1080 px');
    expect(physicalResolution(100, 100, 0)).toBeNull();
  });
  it('DPRを整形する', () => {
    expect(formatDpr(2)).toBe('2x');
    expect(formatDpr(1.25)).toBe('1.25x');
    expect(formatDpr(1.3333333)).toBe('1.333x');
    expect(formatDpr(NaN)).toBeNull();
  });
});

describe('describeDeviceMemory / describeCpuCores', () => {
  it('メモリは8以上でcapped', () => {
    expect(describeDeviceMemory(4)).toEqual({ gb: 4, capped: false });
    expect(describeDeviceMemory(8)).toEqual({ gb: 8, capped: true });
    expect(describeDeviceMemory(0.5)).toEqual({ gb: 0.5, capped: false });
  });
  it('取得不可はnull', () => {
    expect(describeDeviceMemory(Infinity)).toBeNull();
    expect(describeDeviceMemory(undefined)).toBeNull();
    expect(describeDeviceMemory(null)).toBeNull();
    expect(describeDeviceMemory(0)).toBeNull();
    expect(describeDeviceMemory(NaN)).toBeNull();
  });
  it('CPUコア数', () => {
    expect(describeCpuCores(8)).toBe(8);
    expect(describeCpuCores(0)).toBeNull();
    expect(describeCpuCores(2.5)).toBeNull();
    expect(describeCpuCores(undefined)).toBeNull();
  });
});

describe('classifyPointer', () => {
  it('fine を優先し、なければ coarse、どちらもなければ none', () => {
    expect(classifyPointer(true, true)).toBe('fine');
    expect(classifyPointer(false, true)).toBe('coarse');
    expect(classifyPointer(false, false)).toBe('none');
  });
});

describe('normalizeGpuString', () => {
  it('空白を整え、空はnull', () => {
    expect(normalizeGpuString('  ANGLE  (NVIDIA)\n ')).toBe('ANGLE (NVIDIA)');
    expect(normalizeGpuString('   ')).toBeNull();
    expect(normalizeGpuString(null)).toBeNull();
    expect(normalizeGpuString(undefined)).toBeNull();
  });
});

describe('buildReport', () => {
  it('ラベルと値を改行区切りで出力する', () => {
    expect(
      buildReport([
        { label: 'A', value: '1' },
        { label: 'B', value: '2' },
      ]),
    ).toBe('A: 1\nB: 2');
    expect(buildReport([])).toBe('');
  });
});
