/**
 * エンジンのテスト用テーマ。部品数は猫タイプ診断の目安量（16.8）に合わせ、
 * かぶり率・HRW の影響範囲を本番に近い条件で検証できるようにしている。
 */
import { DEFAULT_RARITY_RATES } from './rarity';
import type { Part, Pole, Question, ResultType, ThemeSpec } from './types';

export const TEST_AXES = ['energy', 'social', 'curious', 'affection'] as const;
const POLES: Pole[] = ['+', '-'];

function range<T>(n: number, fn: (i: number) => T): T[] {
  return Array.from({ length: n }, (_, i) => fn(i));
}

/** 12問。各軸3問ずつを主に担当し、3問ごとに隣の軸にも少し寄与する */
const questions: Question[] = range(12, (i) => {
  const axis = TEST_AXES[i % 4];
  const sub = i % 3 === 0 ? TEST_AXES[(i + 1) % 4] : undefined;
  return {
    id: `q${i + 1}`,
    choices: [2, 1, -1, -2].map((value, c) => ({
      id: `c${c + 1}`,
      effects: sub
        ? { [axis]: value, [sub]: Math.sign(value) }
        : { [axis]: value },
    })),
  };
});

const types: ResultType[] = range(16, (mask) => ({
  id: `type${mask}`,
  poles: Object.fromEntries(
    TEST_AXES.map((axis, i) => [axis, (mask >> i) & 1 ? '-' : '+']),
  ),
}));

/** 8極 × perPole 個の部品（それぞれ1つの極を when 条件に持つ） */
function polarParts(prefix: string, perPole: number): Part[] {
  return TEST_AXES.flatMap((axis) =>
    POLES.flatMap((pole) =>
      range(perPole, (i) => ({
        id: `${prefix}-${axis}${pole === '+' ? 'p' : 'm'}-${i}`,
        when: [{ axis, pole }],
      })),
    ),
  );
}

function plainParts(prefix: string, n: number): Part[] {
  return range(n, (i) => ({ id: `${prefix}-${i}` }));
}

export const testTheme: ThemeSpec = {
  id: 'test',
  version: 1,
  scoring: {
    questions,
    axes: TEST_AXES.map((id) => ({ id, stars: [3, 5] })),
    types,
    rarityRates: DEFAULT_RARITY_RATES,
  },
  slots: [
    { id: 'titlePrefix', count: 1, parts: plainParts('tp', 60) },
    { id: 'titleSuffix', count: 1, parts: polarParts('ts', 6) },
    { id: 'strength', count: 3, parts: polarParts('st', 10) },
    { id: 'hiddenSide', count: 1, parts: polarParts('hs', 5) },
    { id: 'quote', count: 1, parts: plainParts('qt', 60) },
    { id: 'luckyItem', count: 1, parts: plainParts('li', 40) },
    { id: 'luckyAction', count: 1, parts: plainParts('la', 40) },
    {
      id: 'rarityPrefix',
      count: 1,
      rarityMin: 'SSR',
      parts: [
        ...range(30, (i) => ({ id: `rp-ssr-${i}`, rarityMin: 'SSR' as const })),
        ...range(15, (i) => ({ id: `rp-ur-${i}`, rarityMin: 'UR' as const })),
        ...range(15, (i) => ({
          id: `rp-lr-${i}`,
          rarityMin: 'LR' as const,
          weight: 3,
        })),
      ],
    },
  ],
  compat: {
    bands: [
      [65, 71],
      [72, 78],
      [79, 85],
      [86, 92],
      [93, 99],
    ],
  },
};

/** 0〜1 の疑似乱数（テストの再現性のため固定seed。mulberry32） */
export function testRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomInput(rand: () => number): {
  answers: number[];
  variant: number;
} {
  return {
    answers: range(12, () => Math.floor(rand() * 4)),
    variant: Math.floor(rand() * 4096),
  };
}
