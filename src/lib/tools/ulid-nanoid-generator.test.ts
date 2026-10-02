import { describe, expect, it } from 'vitest';
import {
  clampIdCount,
  clampNanoidSize,
  generateNanoids,
  generateUlids,
  normalizeAlphabet,
} from './ulid-nanoid-generator';

const ULID_REGEX = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe('clamp', () => {
  it('個数は1〜100、サイズは1〜128に丸める', () => {
    expect(clampIdCount(0)).toBe(1);
    expect(clampIdCount(1000)).toBe(100);
    expect(clampIdCount(NaN)).toBe(1);
    expect(clampNanoidSize(0)).toBe(1);
    expect(clampNanoidSize(999)).toBe(128);
    expect(clampNanoidSize(NaN)).toBe(21);
  });
});

describe('generateUlids', () => {
  it('26文字のCrockford Base32で生成される', () => {
    const ids = generateUlids({ count: 5 });
    expect(ids).toHaveLength(5);
    for (const id of ids) expect(id).toMatch(ULID_REGEX);
  });

  it('タイムスタンプ部が既知の値と一致する', () => {
    // ULID仕様の例: 1469918176385ms → 01ARYZ6S41
    const [id] = generateUlids({ count: 1, now: 1469918176385 });
    expect(id.slice(0, 10)).toBe('01ARYZ6S41');
  });

  it('同一バッチは生成順に昇順で重複しない', () => {
    const ids = generateUlids({ count: 100, now: 1700000000000 });
    expect(new Set(ids).size).toBe(100);
    expect([...ids].sort()).toEqual(ids);
  });

  it('小文字オプション', () => {
    const [id] = generateUlids({ count: 1, lowercase: true });
    expect(id).toBe(id.toLowerCase());
    expect(id).toHaveLength(26);
  });
});

describe('generateNanoids', () => {
  it('既定は指定サイズ・URL-safe文字のみ', () => {
    const result = generateNanoids({ count: 10, size: 21 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.ids).toHaveLength(10);
    for (const id of result.ids) expect(id).toMatch(/^[A-Za-z0-9_-]{21}$/);
  });

  it('カスタム文字セットとサイズを守る（2文字でも動く）', () => {
    const result = generateNanoids({ count: 20, size: 40, alphabet: 'ab' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const id of result.ids) expect(id).toMatch(/^[ab]{40}$/);
  });

  it('文字セットの重複は除去され、1種類だけならエラー', () => {
    expect(normalizeAlphabet('aabbc')).toEqual(['a', 'b', 'c']);
    expect(generateNanoids({ count: 1, size: 5, alphabet: 'aaaa' })).toEqual({
      ok: false,
      reason: 'alphabet-length',
    });
  });

  it('256文字を超える文字セットはエラー', () => {
    const alphabet = Array.from({ length: 300 }, (_, i) =>
      String.fromCodePoint(0x4e00 + i),
    ).join('');
    expect(generateNanoids({ count: 1, size: 5, alphabet }).ok).toBe(false);
  });

  it('サロゲートペアを1文字として扱う', () => {
    const result = generateNanoids({ count: 1, size: 4, alphabet: '😀😁' });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(Array.from(result.ids[0])).toHaveLength(4);
  });
});
