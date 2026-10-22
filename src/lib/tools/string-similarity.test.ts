import { describe, expect, it } from 'vitest';
import {
  compareStrings,
  damerauDistance,
  groupOps,
  jaroWinkler,
  splitUnits,
  type SimilarityOk,
} from './string-similarity';

function ok(a: string, b: string, opts = {}): SimilarityOk {
  const r = compareStrings(a, b, opts);
  if (!r.ok) throw new Error('unexpected too-long');
  return r;
}

describe('compareStrings', () => {
  it('kitten -> sitting は距離3', () => {
    const r = ok('kitten', 'sitting');
    expect(r.distance).toBe(3);
    expect(r.substitutions).toBe(2);
    expect(r.insertions).toBe(1);
    expect(r.deletions).toBe(0);
    expect(r.similarity).toBeCloseTo(1 - 3 / 7);
  });

  it('同一文字列は距離0・類似度1', () => {
    const r = ok('abc', 'abc');
    expect(r.distance).toBe(0);
    expect(r.similarity).toBe(1);
    expect(r.ops.every((o) => o.type === 'equal')).toBe(true);
  });

  it('両方空は類似度1、片方空は挿入/削除のみ', () => {
    expect(ok('', '').similarity).toBe(1);
    const r = ok('', 'abc');
    expect(r.distance).toBe(3);
    expect(r.insertions).toBe(3);
    expect(r.similarity).toBe(0);
    expect(ok('abc', '').deletions).toBe(3);
  });

  it('操作列を適用するとBが復元できる', () => {
    const r = ok('flaw', 'lawn');
    const rebuilt = r.ops.map((o) => o.b ?? '').join('');
    expect(rebuilt).toBe('lawn');
    const original = r.ops.map((o) => o.a ?? '').join('');
    expect(original).toBe('flaw');
    expect(r.distance).toBe(2);
  });

  it('サロゲートペアは1要素として数える', () => {
    const r = ok('a😀b', 'a😎b');
    expect(r.lengthA).toBe(3);
    expect(r.distance).toBe(1);
  });

  it('書記素単位では結合文字を1要素にまとめる', () => {
    const a = 'é'; // é (結合)
    const cp = ok(a, 'é', { unit: 'codepoint' });
    expect(cp.lengthA).toBe(2);
    const gr = ok(a, 'e', { unit: 'grapheme' });
    expect(gr.lengthA).toBe(1);
    expect(gr.distance).toBe(1);
  });

  it('大文字小文字を無視でき、表示は元の文字を保つ', () => {
    const r = ok('ABC', 'abd', { ignoreCase: true });
    expect(r.distance).toBe(1);
    expect(r.ops[0]).toEqual({ type: 'equal', a: 'A', b: 'a' });
  });

  it('上限を超えると too-long を返す', () => {
    const r = compareStrings('a'.repeat(11), 'b', { maxUnits: 10 });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.lengthA).toBe(11);
      expect(r.maxUnits).toBe(10);
    }
  });

  it('上限ちょうどは計算できる', () => {
    const r = ok('a'.repeat(300) + 'x', 'a'.repeat(300) + 'y');
    expect(r.distance).toBe(1);
  });

  it('MAX_UNITS（5000）ちょうどは計算でき、5001 は too-long', () => {
    const exact = compareStrings('a'.repeat(5000), 'a'.repeat(4999) + 'b');
    expect(exact.ok).toBe(true);
    if (exact.ok) expect(exact.distance).toBe(1);
    const over = compareStrings('a'.repeat(5001), 'a');
    expect(over.ok).toBe(false);
  });

  it('書記素単位では ZWJ 絵文字（家族）を1文字、コードポイント単位では5文字', () => {
    const family = '👨‍👩‍👧';
    expect(ok(family, family, { unit: 'grapheme' }).lengthA).toBe(1);
    expect(ok(family, family, { unit: 'codepoint' }).lengthA).toBe(5);
  });
});

describe('Optimal String Alignment の制約', () => {
  it('CA と ABC は OSA では 3（完全なDamerau距離の2とは異なる）', () => {
    expect(damerauDistance(['C', 'A'], ['A', 'B', 'C'])).toBe(3);
  });
});

describe('damerauDistance', () => {
  it('隣接転置は1', () => {
    expect(damerauDistance(['a', 'b'], ['b', 'a'])).toBe(1);
    expect(ok('ab', 'ba').distance).toBe(2);
  });
  it('空文字', () => {
    expect(damerauDistance([], ['a', 'b'])).toBe(2);
    expect(damerauDistance(['a'], [])).toBe(1);
  });
});

describe('jaroWinkler', () => {
  it('MARTHA / MARHTA は約0.961', () => {
    expect(jaroWinkler(Array.from('MARTHA'), Array.from('MARHTA'))).toBeCloseTo(
      0.9611,
      3,
    );
  });
  it('完全一致は1、全く違うと0、空の扱い', () => {
    expect(jaroWinkler(['a'], ['a'])).toBe(1);
    expect(jaroWinkler(['a'], ['b'])).toBe(0);
    expect(jaroWinkler([], [])).toBe(1);
    expect(jaroWinkler([], ['a'])).toBe(0);
  });
});

describe('groupOps / splitUnits', () => {
  it('連続した同種の操作をまとめる', () => {
    const r = ok('abcdef', 'abXYef');
    const runs = groupOps(r.ops);
    expect(runs.map((x) => x.type)).toEqual(['equal', 'replace', 'equal']);
    expect(runs[1]).toMatchObject({ a: 'cd', b: 'XY', count: 2 });
  });
  it('splitUnits はコードポイント分割する', () => {
    expect(splitUnits('😀a', 'codepoint')).toEqual(['😀', 'a']);
  });
});
