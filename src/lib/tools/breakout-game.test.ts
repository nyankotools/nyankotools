import { describe, it, expect } from 'vitest';
import {
  BALL_R,
  BRICK_H,
  BRICK_W,
  COLS,
  HEIGHT,
  PADDLE_W,
  PADDLE_Y,
  ROWS,
  ROW_POINTS,
  START_LIVES,
  WIDTH,
  ballSpeed,
  brickPosition,
  bricksLeft,
  createGame,
  parseBest,
  serializeBest,
  step,
  type BreakoutState,
  type Input,
} from './breakout-game';

const NONE: Input = {
  left: false,
  right: false,
  launch: false,
  targetX: null,
};
const rng = () => 0.5;

function served(state = createGame()): BreakoutState {
  step(state, { ...NONE, launch: true }, 0.01, rng);
  return state;
}

describe('createGame', () => {
  it('初期状態', () => {
    const s = createGame();
    expect(s.status).toBe('playing');
    expect(s.lives).toBe(START_LIVES);
    expect(s.score).toBe(0);
    expect(s.served).toBe(false);
    expect(bricksLeft(s)).toBe(ROWS * COLS);
    expect(s.ball.y).toBe(PADDLE_Y - BALL_R);
  });
});

describe('パドルと待機中のボール', () => {
  it('キーで動き、端で止まる', () => {
    const s = createGame();
    step(s, { ...NONE, right: true }, 0.1, rng);
    expect(s.paddleX).toBeGreaterThan(WIDTH / 2);
    for (let i = 0; i < 20; i++) step(s, { ...NONE, right: true }, 0.1, rng);
    expect(s.paddleX).toBe(WIDTH - PADDLE_W / 2);
    for (let i = 0; i < 40; i++) step(s, { ...NONE, left: true }, 0.1, rng);
    expect(s.paddleX).toBe(PADDLE_W / 2);
  });

  it('targetX で直接動き、範囲内に収まる', () => {
    const s = createGame();
    step(s, { ...NONE, targetX: 100 }, 0.01, rng);
    expect(s.paddleX).toBe(100);
    step(s, { ...NONE, targetX: -50 }, 0.01, rng);
    expect(s.paddleX).toBe(PADDLE_W / 2);
    step(s, { ...NONE, targetX: 9999 }, 0.01, rng);
    expect(s.paddleX).toBe(WIDTH - PADDLE_W / 2);
  });

  it('発射するまでボールはパドルに乗ってついてくる', () => {
    const s = createGame();
    step(s, { ...NONE, targetX: 80 }, 0.05, rng);
    expect(s.served).toBe(false);
    expect(s.ball.x).toBe(80);
  });

  it('発射するとボールは上向きに動き、速さが一定', () => {
    const s = served();
    expect(s.served).toBe(true);
    expect(s.ball.vy).toBeLessThan(0);
    expect(Math.hypot(s.ball.vx, s.ball.vy)).toBeCloseTo(ballSpeed(1), 5);
  });
});

describe('反射', () => {
  it('左右の壁で反射する', () => {
    const s = served();
    s.ball = { x: BALL_R + 1, y: 300, vx: -200, vy: 0.001 };
    step(s, NONE, 0.05, rng);
    expect(s.ball.vx).toBeGreaterThan(0);
    s.ball = { x: WIDTH - BALL_R - 1, y: 300, vx: 200, vy: 0.001 };
    step(s, NONE, 0.05, rng);
    expect(s.ball.vx).toBeLessThan(0);
  });

  it('天井で反射する', () => {
    const s = served();
    s.bricks.fill(false);
    s.bricks[0] = true;
    s.ball = { x: 200, y: BALL_R + 1, vx: 0, vy: -200 };
    step(s, NONE, 0.02, rng);
    expect(s.ball.vy).toBeGreaterThan(0);
  });

  it('パドルの中央では真上、右寄りでは右上に返る', () => {
    const s = served();
    s.paddleX = 180;
    s.ball = { x: 180, y: PADDLE_Y - BALL_R, vx: 0, vy: 200 };
    step(s, NONE, 0.01, rng);
    expect(s.ball.vy).toBeLessThan(0);
    expect(Math.abs(s.ball.vx)).toBeLessThan(1);

    s.ball = {
      x: 180 + PADDLE_W / 2 - 2,
      y: PADDLE_Y - BALL_R,
      vx: 0,
      vy: 200,
    };
    step(s, NONE, 0.01, rng);
    expect(s.ball.vy).toBeLessThan(0);
    expect(s.ball.vx).toBeGreaterThan(50);
  });

  it('パドルの左寄りでは左上に返る', () => {
    const s = served();
    s.paddleX = 180;
    s.ball = {
      x: 180 - PADDLE_W / 2 + 2,
      y: PADDLE_Y - BALL_R,
      vx: 0,
      vy: 200,
    };
    step(s, NONE, 0.01, rng);
    expect(s.ball.vx).toBeLessThan(-50);
  });
});

describe('ブロック', () => {
  it('下から当たると壊れて得点が入り、ボールは下向きに返る', () => {
    const s = served();
    const p = brickPosition(ROWS - 1, 4);
    s.ball = {
      x: p.x + BRICK_W / 2,
      y: p.y + BRICK_H + BALL_R - 1,
      vx: 0,
      vy: -200,
    };
    const before = bricksLeft(s);
    step(s, NONE, 0.01, rng);
    expect(bricksLeft(s)).toBe(before - 1);
    expect(s.bricks[(ROWS - 1) * COLS + 4]).toBe(false);
    expect(s.score).toBe(ROW_POINTS[ROWS - 1]);
    expect(s.ball.vy).toBeGreaterThan(0);
  });

  it('横から当たると横方向だけ反転する', () => {
    const s = served();
    s.bricks.fill(false);
    s.bricks[0] = true;
    s.bricks[1] = true;
    const p = brickPosition(0, 0);
    // 0列目の左側から右向きに当てる（左の壁との間に隙間を作るため位置をずらしたブロックは使わず、1列目の右側から）
    const q = brickPosition(0, 1);
    s.ball = {
      x: q.x + BRICK_W + BALL_R - 1,
      y: q.y + BRICK_H / 2,
      vx: -200,
      vy: 0,
    };
    step(s, NONE, 0.01, rng);
    expect(s.bricks[1]).toBe(false);
    expect(s.ball.vx).toBeGreaterThan(0);
    expect(p.x).toBeLessThan(q.x);
  });

  it('上の行ほど高得点', () => {
    expect(ROW_POINTS[0]).toBeGreaterThan(ROW_POINTS[ROWS - 1]);
    expect(ROW_POINTS).toHaveLength(ROWS);
  });

  it('長い dt でもブロックをすり抜けない', () => {
    const s = served();
    s.ball = { x: 180, y: BRICK_Y_BELOW(), vx: 0, vy: -400 };
    step(s, NONE, 5, rng); // 内部で 0.1 秒に丸められる
    expect(s.score).toBeGreaterThan(0);
  });

  it('全部壊すと次のステージへ進み、ブロックが戻って待機状態になる', () => {
    const s = served();
    s.bricks.fill(false);
    const last = brickPosition(ROWS - 1, 0);
    s.bricks[(ROWS - 1) * COLS] = true;
    s.ball = {
      x: last.x + BRICK_W / 2,
      y: last.y + BRICK_H + BALL_R - 1,
      vx: 0,
      vy: -200,
    };
    step(s, NONE, 0.01, rng);
    expect(s.level).toBe(2);
    expect(bricksLeft(s)).toBe(ROWS * COLS);
    expect(s.served).toBe(false);
    expect(s.lives).toBe(START_LIVES);
  });
});

function BRICK_Y_BELOW() {
  return brickPosition(ROWS - 1, 0).y + BRICK_H + 30;
}

describe('ライフとゲームオーバー', () => {
  it('落とすと残機が減り、ボールは待機状態に戻る', () => {
    const s = served();
    s.paddleX = 20;
    s.ball = { x: 300, y: HEIGHT - 5, vx: 0, vy: 300 };
    step(s, NONE, 0.1, rng);
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.served).toBe(false);
    expect(s.status).toBe('playing');
  });

  it('残機が0になるとゲームオーバーで、以後は進まない', () => {
    const s = served();
    s.lives = 1;
    s.paddleX = 20;
    s.ball = { x: 300, y: HEIGHT - 5, vx: 0, vy: 300 };
    step(s, NONE, 0.1, rng);
    expect(s.status).toBe('over');
    expect(s.lives).toBe(0);
    const t = s.time;
    step(s, { ...NONE, launch: true }, 0.1, rng);
    expect(s.time).toBe(t);
  });

  it('負・0 の dt では何も起きない', () => {
    const s = served();
    const t = s.time;
    step(s, NONE, -1, rng);
    step(s, NONE, 0, rng);
    expect(s.time).toBe(t);
  });
});

describe('ballSpeed', () => {
  it('ステージが進むと速くなり、上限がある', () => {
    expect(ballSpeed(2)).toBeGreaterThan(ballSpeed(1));
    expect(ballSpeed(100)).toBe(ballSpeed(50));
  });
});

describe('ベスト記録', () => {
  it('parseBest は不正な値を 0 にする', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-5')).toBe(0);
    expect(parseBest('1.5')).toBe(0);
    expect(parseBest('120')).toBe(120);
  });

  it('serializeBest は整数文字列にする', () => {
    expect(serializeBest(120.9)).toBe('120');
    expect(serializeBest(-3)).toBe('0');
  });
});
