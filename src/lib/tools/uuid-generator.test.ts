import { describe, expect, it } from 'vitest';
import { clampUuidCount, generateUuids } from './uuid-generator';

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('clampUuidCount', () => {
  it('1未満は1に切り上げる', () => {
    expect(clampUuidCount(0)).toBe(1);
    expect(clampUuidCount(-5)).toBe(1);
  });

  it('100超は100に切り下げる', () => {
    expect(clampUuidCount(1000)).toBe(100);
  });

  it('小数は切り捨てる', () => {
    expect(clampUuidCount(3.7)).toBe(3);
  });

  it('不正な値は1にフォールバックする', () => {
    expect(clampUuidCount(NaN)).toBe(1);
  });
});

describe('generateUuids', () => {
  it('指定した個数だけ生成する', () => {
    const result = generateUuids({ count: 5 });
    expect(result).toHaveLength(5);
  });

  it('デフォルト形式はRFC4122準拠のUUID v4になる', () => {
    const [uuid] = generateUuids({ count: 1 });
    expect(uuid).toMatch(UUID_V4_REGEX);
  });

  it('生成されるUUIDは重複しない', () => {
    const result = generateUuids({ count: 50 });
    expect(new Set(result).size).toBe(50);
  });

  it('removeHyphens指定時はハイフンを含まない', () => {
    const [uuid] = generateUuids({ count: 1, removeHyphens: true });
    expect(uuid).not.toContain('-');
    expect(uuid).toHaveLength(32);
  });

  it('uppercase指定時は大文字になる', () => {
    const [uuid] = generateUuids({ count: 1, uppercase: true });
    expect(uuid).toBe(uuid.toUpperCase());
  });

  it('個数指定が範囲外でもクランプされる', () => {
    expect(generateUuids({ count: 0 })).toHaveLength(1);
    expect(generateUuids({ count: 9999 })).toHaveLength(100);
  });
});
