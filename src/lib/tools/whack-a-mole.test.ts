import { describe, expect, it } from 'vitest';
import {
  DURATION_MS,
  FIRST_SPAWN_MS,
  HOLE_COUNT,
  SPAWN_INTERVAL_END_MS,
  SPAWN_INTERVAL_START_MS,
  VISIBLE_END_MS,
  VISIBLE_START_MS,
  accuracyPercent,
  advance,
  createGame,
  isFinished,
  isNewBest,
  parseBest,
  pickHole,
  remainingMs,
  spawnIntervalMs,
  visibleMs,
  whack,
} from './whack-a-mole';

const first = () => 0;

describe('難易度', () => {
  it('開始時と終了時の値になる', () => {
    expect(spawnIntervalMs(0)).toBe(SPAWN_INTERVAL_START_MS);
    expect(spawnIntervalMs(DURATION_MS)).toBe(SPAWN_INTERVAL_END_MS);
    expect(visibleMs(0)).toBe(VISIBLE_START_MS);
    expect(visibleMs(DURATION_MS)).toBe(VISIBLE_END_MS);
  });
  it('時間が進むほど短くなる', () => {
    expect(spawnIntervalMs(15000)).toBeLessThan(spawnIntervalMs(5000));
    expect(visibleMs(25000)).toBeLessThan(visibleMs(10000));
  });
  it('範囲外や不正な値でも範囲内に収まる', () => {
    expect(spawnIntervalMs(-100)).toBe(SPAWN_INTERVAL_START_MS);
    expect(spawnIntervalMs(DURATION_MS * 3)).toBe(SPAWN_INTERVAL_END_MS);
    expect(visibleMs(NaN)).toBe(VISIBLE_START_MS);
  });
});

describe('pickHole', () => {
  it('使用中の穴を避ける', () => {
    expect(pickHole([0, 1, 2], first)).toBe(3);
    expect(pickHole([0], (max) => max - 1)).toBe(HOLE_COUNT - 1);
  });
  it('空きが無ければ null', () => {
    const all = Array.from({ length: HOLE_COUNT }, (_, i) => i);
    expect(pickHole(all, first)).toBeNull();
  });
});

describe('advance', () => {
  it('最初の出現前は何も出ない', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS - 1, first);
    expect(s.moles).toHaveLength(0);
  });
  it('最初の出現時刻にモグラが出る', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    expect(s.moles).toEqual([
      { hole: 0, expiresAt: FIRST_SPAWN_MS + visibleMs(FIRST_SPAWN_MS) },
    ]);
    expect(s.nextSpawnAt).toBe(
      FIRST_SPAWN_MS + spawnIntervalMs(FIRST_SPAWN_MS),
    );
  });
  it('元の state を書き換えない', () => {
    const g = createGame();
    advance(g, 5000, first);
    expect(g).toEqual(createGame());
  });
  it('叩かれず引っ込むと escaped が増える', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    const later = advance(s, FIRST_SPAWN_MS + VISIBLE_START_MS, () => 0);
    expect(later.escaped).toBeGreaterThanOrEqual(1);
  });
  it('時刻が大きく飛んでも出現を取りこぼさない', () => {
    const jumped = advance(createGame(), DURATION_MS, first);
    let stepped = createGame();
    for (let t = 0; t <= DURATION_MS; t += 100) {
      stepped = advance(stepped, t, first);
    }
    expect(jumped.escaped + jumped.moles.length).toBe(
      stepped.escaped + stepped.moles.length,
    );
  });
  it('制限時間後は新しい出現が無く、モグラも残らない', () => {
    const s = advance(createGame(), DURATION_MS + 10000, first);
    expect(s.moles).toHaveLength(0);
    expect(s.nextSpawnAt).toBeGreaterThanOrEqual(DURATION_MS);
  });
  it('同じ穴に重ねて出さない', () => {
    // 常に先頭の空き穴を選ぶので、同時に出ている穴が重複しないことを確認する
    let s = createGame();
    for (let t = 0; t < 6000; t += 50) {
      s = advance(s, t, first);
      const holes = s.moles.map((m) => m.hole);
      expect(new Set(holes).size).toBe(holes.length);
    }
  });
  it('後半は出現の間隔が短くなる（難易度上昇）', () => {
    const times: number[] = [];
    let s = createGame();
    let prevNext = s.nextSpawnAt;
    for (let t = 0; t <= DURATION_MS; t += 10) {
      s = advance(s, t, first);
      if (s.nextSpawnAt !== prevNext) {
        times.push(prevNext);
        prevNext = s.nextSpawnAt;
      }
    }
    const gaps = times.slice(1).map((v, i) => v - times[i]);
    expect(gaps.length).toBeGreaterThan(10);
    expect(gaps[gaps.length - 1]).toBeLessThan(gaps[0]);
  });
});

describe('whack', () => {
  it('モグラがいる穴を叩くと命中', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    const r = whack(s, 0, FIRST_SPAWN_MS + 100);
    expect(r.hit).toBe(true);
    expect(r.state.hits).toBe(1);
    expect(r.state.moles).toHaveLength(0);
  });
  it('同じモグラは2回命中しない', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    const r1 = whack(s, 0, FIRST_SPAWN_MS + 100);
    const r2 = whack(r1.state, 0, FIRST_SPAWN_MS + 150);
    expect(r2.hit).toBe(false);
    expect(r2.state.hits).toBe(1);
    expect(r2.state.misses).toBe(1);
  });
  it('空の穴はミス', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    const r = whack(s, 5, FIRST_SPAWN_MS + 100);
    expect(r.hit).toBe(false);
    expect(r.state.misses).toBe(1);
  });
  it('引っ込む時刻以降はミス', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    const r = whack(s, 0, FIRST_SPAWN_MS + visibleMs(FIRST_SPAWN_MS));
    expect(r.hit).toBe(false);
  });
  it('制限時間後は無効', () => {
    const s = advance(createGame(), FIRST_SPAWN_MS, first);
    const r = whack(s, 0, DURATION_MS);
    expect(r.hit).toBe(false);
    expect(r.state).toBe(s);
  });
});

describe('スコア・記録', () => {
  it('命中率', () => {
    expect(accuracyPercent(createGame())).toBe(0);
    expect(accuracyPercent({ ...createGame(), hits: 3, misses: 1 })).toBe(75);
    expect(accuracyPercent({ ...createGame(), hits: 1, misses: 2 })).toBe(33);
  });
  it('残り時間と終了判定', () => {
    expect(remainingMs(0)).toBe(DURATION_MS);
    expect(remainingMs(DURATION_MS + 5)).toBe(0);
    expect(remainingMs(-10)).toBe(DURATION_MS);
    expect(isFinished(DURATION_MS - 1)).toBe(false);
    expect(isFinished(DURATION_MS)).toBe(true);
  });
  it('parseBest は壊れた値を 0 にする', () => {
    expect(parseBest('25')).toBe(25);
    expect(parseBest(null)).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-3')).toBe(0);
    expect(parseBest('1.5')).toBe(0);
  });
  it('isNewBest', () => {
    expect(isNewBest(10, 5)).toBe(true);
    expect(isNewBest(5, 5)).toBe(false);
    expect(isNewBest(0, 0)).toBe(false);
  });
});
