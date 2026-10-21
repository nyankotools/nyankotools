import { describe, it, expect } from 'vitest';
import {
  DEFAULT_SETTINGS,
  createSession,
  formatDuration,
  isBetter,
  isCorrect,
  parseAnswer,
  parseBests,
  problemLabel,
  rankFor,
  recordBest,
  serializeBests,
  settingsKey,
  summarize,
  validateSettings,
  type TrainerSettings,
} from './mental-math-trainer';

const st = (o: Partial<TrainerSettings> = {}): TrainerSettings => ({
  ...DEFAULT_SETTINGS,
  ...o,
});

describe('validateSettings', () => {
  it('既定値は有効', () => {
    expect(validateSettings(DEFAULT_SETTINGS)).toBeNull();
  });
  it('範囲外はエラー', () => {
    expect(validateSettings(st({ ops: [] }))).toBe('ops');
    expect(validateSettings(st({ digitsA: 0 }))).toBe('digits');
    expect(validateSettings(st({ digitsB: 5 }))).toBe('digits');
    expect(validateSettings(st({ count: 7 }))).toBe('count');
    expect(validateSettings(st({ limitSec: 45 }))).toBe('limit');
  });
});

describe('createSession', () => {
  it('指定数の問題を作り、同じシードなら同じ', () => {
    const s = st({ ops: ['add', 'sub', 'mul', 'div'], digitsA: 2, count: 50 });
    const a = createSession(s, 7);
    expect(a).toHaveLength(50);
    expect(createSession(s, 7)).toEqual(a);
  });
  it('引き算は負にならず、割り算は割り切れる', () => {
    const list = createSession(
      st({ ops: ['sub', 'div'], digitsA: 3, digitsB: 2, count: 50 }),
      3,
    );
    for (const p of list) {
      expect(p.answer).toBeGreaterThanOrEqual(0);
      if (p.op === 'div') expect(p.a % p.b).toBe(0);
    }
  });
  it('選んだ演算だけが出る', () => {
    const list = createSession(st({ ops: ['mul'], count: 30 }), 1);
    expect(list.every((p) => p.op === 'mul')).toBe(true);
    expect(problemLabel({ op: 'mul', a: 3, b: 4, answer: 12 })).toBe('3 × 4');
  });
});

describe('parseAnswer / isCorrect', () => {
  it('整数と全角数字を読む', () => {
    expect(parseAnswer(' 12 ')).toBe(12);
    expect(parseAnswer('１２')).toBe(12);
    expect(parseAnswer('-3')).toBe(-3);
    expect(parseAnswer('0')).toBe(0);
  });
  it('空・小数・文字・桁あふれは null', () => {
    expect(parseAnswer('')).toBeNull();
    expect(parseAnswer('1.5')).toBeNull();
    expect(parseAnswer('1a')).toBeNull();
    expect(parseAnswer('1234567890')).toBeNull();
  });
  it('正誤判定', () => {
    const p = { op: 'add', a: 5, b: 7, answer: 12 } as const;
    expect(isCorrect(p, '12')).toBe(true);
    expect(isCorrect(p, '13')).toBe(false);
    expect(isCorrect(p, 'x')).toBe(false);
  });
});

describe('rankFor / summarize', () => {
  it('境界のランク', () => {
    expect(rankFor(19, 20)).toBe('S');
    expect(rankFor(17, 20)).toBe('A');
    expect(rankFor(14, 20)).toBe('B');
    expect(rankFor(10, 20)).toBe('C');
    expect(rankFor(9, 20)).toBe('D');
    expect(rankFor(0, 0)).toBe('D');
  });
  it('正解率と平均秒数', () => {
    const r = summarize({
      total: 20,
      answered: 10,
      correct: 8,
      elapsedMs: 25000,
    });
    expect(r.accuracy).toBe(40);
    expect(r.avgSec).toBe(2.5);
    expect(r.rank).toBe('D');
  });
  it('未回答のときは平均0', () => {
    expect(
      summarize({ total: 10, answered: 0, correct: 0, elapsedMs: 5000 }).avgSec,
    ).toBe(0);
  });
});

describe('formatDuration', () => {
  it('分:秒.小数', () => {
    expect(formatDuration(0)).toBe('0:00.0');
    expect(formatDuration(65400)).toBe('1:05.4');
    expect(formatDuration(-5)).toBe('0:00.0');
  });
});

describe('ベスト記録', () => {
  it('設定キーは演算の順序に依存しない', () => {
    expect(settingsKey(st({ ops: ['mul', 'add'] }))).toBe(
      settingsKey(st({ ops: ['add', 'mul'] })),
    );
    expect(settingsKey(st({ digitsA: 2 }))).not.toBe(settingsKey(st()));
  });
  it('正解数優先、同数なら時間が短い方が上', () => {
    const prev = { correct: 10, total: 20, ms: 50000 };
    expect(isBetter({ correct: 11, total: 20, ms: 90000 }, prev)).toBe(true);
    expect(isBetter({ correct: 10, total: 20, ms: 40000 }, prev)).toBe(true);
    expect(isBetter({ correct: 10, total: 20, ms: 50000 }, prev)).toBe(false);
    expect(isBetter({ correct: 9, total: 20, ms: 1000 }, prev)).toBe(false);
    expect(isBetter({ correct: 0, total: 20, ms: 1000 }, undefined)).toBe(
      false,
    );
  });
  it('recordBest は元を変更しない', () => {
    const base = {};
    const r = recordBest(base, 'k', { correct: 5, total: 10, ms: 1000 });
    expect(r.updated).toBe(true);
    expect(base).toEqual({});
    expect(r.map.k.correct).toBe(5);
    expect(
      recordBest(r.map, 'k', { correct: 4, total: 10, ms: 1 }).updated,
    ).toBe(false);
  });
  it('件数が増えすぎたら古いものから消す', () => {
    let map = {};
    for (let i = 0; i < 70; i++) {
      map = recordBest(map, `k${i}`, { correct: 1, total: 10, ms: 1 }).map;
    }
    expect(Object.keys(map)).toHaveLength(60);
    expect(map).not.toHaveProperty('k0');
    expect(map).toHaveProperty('k69');
  });
  it('保存と読み込みの往復、壊れた値は無視', () => {
    const map = { a: { correct: 3, total: 10, ms: 900 } };
    expect(parseBests(serializeBests(map))).toEqual(map);
    expect(parseBests(null)).toEqual({});
    expect(parseBests('{oops')).toEqual({});
    expect(parseBests('[1]')).toEqual({});
    expect(parseBests('{"a":{"correct":11,"total":10,"ms":1}}')).toEqual({});
    expect(parseBests('{"a":{"correct":"1","total":10,"ms":1}}')).toEqual({});
    expect(parseBests('{"a":null}')).toEqual({});
  });
});
