import { describe, expect, it } from 'vitest';
import {
  CAT_SIZE,
  CAT_X,
  FLAP_VELOCITY,
  FLOOR_Y,
  GAP_MARGIN,
  MAX_FALL_SPEED,
  PIPE_GAP,
  PIPE_SPACING,
  PIPE_WIDTH,
  WORLD_WIDTH,
  advance,
  createGame,
  flap,
  hitsPipe,
  isNewBest,
  parseBest,
  pickGapY,
} from './cat-jump';
import type { CatJumpState } from './cat-jump';

const mid = () => 0.5;

describe('pickGapY', () => {
  it('rngの両端でも余白の範囲に収まる', () => {
    const min = GAP_MARGIN + PIPE_GAP / 2;
    const max = FLOOR_Y - GAP_MARGIN - PIPE_GAP / 2;
    expect(pickGapY(() => 0)).toBe(min);
    expect(pickGapY(() => 0.999999)).toBeLessThanOrEqual(max);
    expect(pickGapY(() => 1)).toBeLessThanOrEqual(max);
    expect(pickGapY(() => -3)).toBe(min);
    expect(pickGapY(() => 0.5)).toBe((min + max) / 2);
  });
});

describe('flap / advance', () => {
  it('開始前は動かない', () => {
    const s = createGame();
    const y = s.y;
    advance(s, 0.5, mid);
    expect(s.y).toBe(y);
    expect(s.started).toBe(false);
  });

  it('羽ばたくと開始し、上向きの速度になる', () => {
    const s = createGame();
    flap(s);
    expect(s.started).toBe(true);
    expect(s.vy).toBe(FLAP_VELOCITY);
    const y = s.y;
    advance(s, 0.05, mid);
    expect(s.y).toBeLessThan(y);
  });

  it('羽ばたかないと落下し、落下速度には上限がある', () => {
    const s = createGame();
    flap(s);
    advance(s, 0.1, mid);
    advance(s, 0.1, mid);
    expect(s.over).toBe(false);
    for (let i = 0; i < 20 && !s.over; i++) advance(s, 0.1, mid);
    expect(s.over).toBe(true);
    expect(s.cause).toBe('ground');
    expect(s.vy).toBeLessThanOrEqual(MAX_FALL_SPEED);
  });

  it('終了後は羽ばたいても進まない', () => {
    const s = createGame();
    flap(s);
    while (!s.over) advance(s, 0.1, mid);
    const snapshot = JSON.stringify(s);
    flap(s);
    advance(s, 0.1, mid);
    expect(JSON.stringify(s)).toBe(snapshot);
  });

  it('天井では止まるだけで終了しない', () => {
    const s = createGame();
    s.y = 2;
    flap(s);
    advance(s, 0.05, mid);
    expect(s.y).toBeGreaterThanOrEqual(0);
    expect(s.over).toBe(false);
  });

  it('dtが0・負・NaNなら何もしない', () => {
    const s = createGame();
    flap(s);
    const y = s.y;
    advance(s, 0, mid);
    advance(s, -1, mid);
    advance(s, NaN, mid);
    expect(s.y).toBe(y);
  });

  it('巨大なdtでも壁抜けせず、一度に進む量が制限される', () => {
    const s = createGame();
    flap(s);
    advance(s, 1000, mid);
    expect(s.pipes.length).toBeGreaterThan(0);
    expect(s.pipes[0]!.x).toBeGreaterThan(WORLD_WIDTH - 50);
  });
});

describe('土管の生成', () => {
  function hover(s: CatJumpState) {
    // 穴の中心の高さを保ち続ける（テスト用に毎ステップ位置を戻す）
    s.y = s.pipes.length ? s.pipes[0]!.gapY - CAT_SIZE / 2 : s.y;
    s.vy = 0;
  }

  it('最初の土管は右端から出てくる', () => {
    const s = createGame();
    flap(s);
    advance(s, 0.02, mid);
    expect(s.pipes).toHaveLength(1);
    expect(s.pipes[0]!.x).toBeLessThanOrEqual(WORLD_WIDTH);
  });

  it('間隔が空いたら次の土管が追加され、乱数が穴の位置に反映される', () => {
    const values = [0, 1, 0.5, 0.25];
    let i = 0;
    const rng = () => values[i++ % values.length]!;
    const s = createGame();
    flap(s);
    let guard = 0;
    while (s.pipes.length < 2 && guard++ < 1000) {
      hover(s);
      s.started = true;
      advance(s, 0.016, rng);
      if (s.over) break;
    }
    expect(s.pipes.length).toBeGreaterThanOrEqual(2);
    const [a, b] = s.pipes;
    expect(b!.x - a!.x).toBeGreaterThanOrEqual(PIPE_SPACING - 1);
    expect(a!.gapY).not.toBe(b!.gapY);
  });
});

describe('当たり判定', () => {
  const pipeAtCat = { x: CAT_X, gapY: 200, passed: false };

  it('穴の中なら当たらない', () => {
    expect(hitsPipe(200 - CAT_SIZE / 2, pipeAtCat)).toBe(false);
  });

  it('穴の上下の壁に当たる', () => {
    expect(hitsPipe(200 - PIPE_GAP / 2 - CAT_SIZE, pipeAtCat)).toBe(true);
    expect(hitsPipe(200 + PIPE_GAP / 2, pipeAtCat)).toBe(true);
  });

  it('横に離れていれば高さに関係なく当たらない', () => {
    expect(hitsPipe(0, { x: CAT_X + CAT_SIZE, gapY: 300, passed: false })).toBe(
      false,
    );
    expect(
      hitsPipe(0, { x: CAT_X - PIPE_WIDTH, gapY: 300, passed: false }),
    ).toBe(false);
  });

  it('土管に突っ込むと終了する', () => {
    const s = createGame();
    flap(s);
    s.y = 10;
    s.vy = 0;
    s.pipes = [{ x: CAT_X, gapY: 300, passed: false }];
    advance(s, 0.016, mid);
    expect(s.over).toBe(true);
    expect(s.cause).toBe('pipe');
  });
});

describe('スコア', () => {
  it('土管を通り抜けると1点入り、二重には数えない', () => {
    const s = createGame();
    flap(s);
    s.pipes = [{ x: CAT_X - PIPE_WIDTH + 0.5, gapY: 200, passed: false }];
    for (let i = 0; i < 5; i++) {
      s.y = 200 - CAT_SIZE / 2;
      s.vy = 0;
      advance(s, 0.016, mid);
    }
    expect(s.over).toBe(false);
    expect(s.score).toBe(1);
    expect(s.pipes.filter((p) => p.passed)).toHaveLength(1);
  });
});

describe('ベストスコア', () => {
  it('parseBestは不正な値を0にする', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest(undefined)).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-3')).toBe(0);
    expect(parseBest('2.5')).toBe(0);
    expect(parseBest('999999')).toBe(0);
    expect(parseBest('12')).toBe(12);
  });

  it('isNewBestは0点では更新しない', () => {
    expect(isNewBest(0, 0)).toBe(false);
    expect(isNewBest(3, 3)).toBe(false);
    expect(isNewBest(4, 3)).toBe(true);
    expect(isNewBest(1, 0)).toBe(true);
  });
});
