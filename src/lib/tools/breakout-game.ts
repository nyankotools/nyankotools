// ブロック崩しのロジック（DOM・描画に依存しない）。
// 座標は盤面の左上を原点とした px（y は下向きが正）。時間は秒。

export const WIDTH = 360;
export const HEIGHT = 440;

export const COLS = 10;
export const ROWS = 6;
export const BRICK_W = 32;
export const BRICK_H = 14;
export const BRICK_X0 = (WIDTH - COLS * BRICK_W) / 2;
export const BRICK_Y0 = 50;
/** 行ごとの得点（上の行ほど高い） */
export const ROW_POINTS = [60, 50, 40, 30, 20, 10];

export const PADDLE_W = 60;
export const PADDLE_H = 10;
export const PADDLE_Y = HEIGHT - 32;
const PADDLE_SPEED = 320;
/** パドルの端で返したときの、真上からの最大の傾き（ラジアン） */
const MAX_BOUNCE_ANGLE = (65 * Math.PI) / 180;
/** 発射時の真上からのばらつき（ラジアン） */
const LAUNCH_SPREAD = (25 * Math.PI) / 180;

export const BALL_R = 5;
export const START_LIVES = 3;

const STEP_SECONDS = 1 / 240;
const MAX_FRAME_SECONDS = 0.1;

export type Rng = () => number;

export interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface Input {
  left: boolean;
  right: boolean;
  /** 待機中のボールを発射する */
  launch: boolean;
  /** マウス・タッチでパドルの中心を直接指定する x。使わないときは null */
  targetX: number | null;
}

export interface BreakoutState {
  status: 'playing' | 'over';
  level: number;
  score: number;
  lives: number;
  /** パドルの中心の x */
  paddleX: number;
  ball: Ball;
  /** false の間、ボールはパドルの上で待機している */
  served: boolean;
  /** ROWS × COLS（row * COLS + col）。true ならブロックが残っている */
  bricks: boolean[];
  /** 経過時間（描画のアニメーション用） */
  time: number;
}

export function ballSpeed(level: number): number {
  return Math.min(230 + 22 * (level - 1), 400);
}

export function brickPosition(
  row: number,
  col: number,
): { x: number; y: number } {
  return { x: BRICK_X0 + col * BRICK_W, y: BRICK_Y0 + row * BRICK_H };
}

export function bricksLeft(state: BreakoutState): number {
  return state.bricks.reduce((n, b) => n + (b ? 1 : 0), 0);
}

function parkBall(state: BreakoutState) {
  state.served = false;
  state.ball = {
    x: state.paddleX,
    y: PADDLE_Y - BALL_R,
    vx: 0,
    vy: 0,
  };
}

function resetLevel(state: BreakoutState, level: number) {
  state.level = level;
  state.bricks = new Array<boolean>(ROWS * COLS).fill(true);
  state.paddleX = WIDTH / 2;
  parkBall(state);
}

export function createGame(): BreakoutState {
  const state: BreakoutState = {
    status: 'playing',
    level: 1,
    score: 0,
    lives: START_LIVES,
    paddleX: WIDTH / 2,
    ball: { x: 0, y: 0, vx: 0, vy: 0 },
    served: false,
    bricks: [],
    time: 0,
  };
  resetLevel(state, 1);
  return state;
}

function clampPaddle(x: number): number {
  return Math.min(WIDTH - PADDLE_W / 2, Math.max(PADDLE_W / 2, x));
}

function launch(state: BreakoutState, rng: Rng) {
  const angle = (rng() * 2 - 1) * LAUNCH_SPREAD;
  const speed = ballSpeed(state.level);
  state.ball.vx = Math.sin(angle) * speed;
  state.ball.vy = -Math.cos(angle) * speed;
  state.served = true;
}

/** 円と矩形が重なっていれば、押し戻し量の小さい軸を返す。重なっていなければ null */
function circleRectHit(
  b: Ball,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
): 'x' | 'y' | null {
  const nearestX = Math.min(rx + rw, Math.max(rx, b.x));
  const nearestY = Math.min(ry + rh, Math.max(ry, b.y));
  const dx = b.x - nearestX;
  const dy = b.y - nearestY;
  if (dx * dx + dy * dy >= BALL_R * BALL_R) return null;
  const overlapX = Math.min(b.x + BALL_R - rx, rx + rw - (b.x - BALL_R));
  const overlapY = Math.min(b.y + BALL_R - ry, ry + rh - (b.y - BALL_R));
  return overlapX < overlapY ? 'x' : 'y';
}

function tick(state: BreakoutState, input: Input, h: number, rng: Rng) {
  state.time += h;

  // パドル
  if (input.targetX !== null) {
    state.paddleX = clampPaddle(input.targetX);
  } else {
    const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    state.paddleX = clampPaddle(state.paddleX + dir * PADDLE_SPEED * h);
  }

  if (!state.served) {
    state.ball.x = state.paddleX;
    state.ball.y = PADDLE_Y - BALL_R;
    if (input.launch) launch(state, rng);
    return;
  }

  const ball = state.ball;
  ball.x += ball.vx * h;
  ball.y += ball.vy * h;

  // 壁（左右・上）
  if (ball.x - BALL_R < 0) {
    ball.x = BALL_R;
    ball.vx = Math.abs(ball.vx);
  } else if (ball.x + BALL_R > WIDTH) {
    ball.x = WIDTH - BALL_R;
    ball.vx = -Math.abs(ball.vx);
  }
  if (ball.y - BALL_R < 0) {
    ball.y = BALL_R;
    ball.vy = Math.abs(ball.vy);
  }

  // パドル（下向きに動いているときだけ返す）
  if (ball.vy > 0) {
    const left = state.paddleX - PADDLE_W / 2;
    if (
      circleRectHit(ball, left, PADDLE_Y, PADDLE_W, PADDLE_H) !== null &&
      ball.y < PADDLE_Y + PADDLE_H / 2
    ) {
      const offset = Math.max(
        -1,
        Math.min(1, (ball.x - state.paddleX) / (PADDLE_W / 2)),
      );
      const angle = offset * MAX_BOUNCE_ANGLE;
      const speed = ballSpeed(state.level);
      ball.vx = Math.sin(angle) * speed;
      ball.vy = -Math.cos(angle) * speed;
      ball.y = PADDLE_Y - BALL_R;
    }
  }

  // ブロック（1ステップで壊すのは1個）
  outer: for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (!state.bricks[row * COLS + col]) continue;
      const p = brickPosition(row, col);
      const axis = circleRectHit(ball, p.x, p.y, BRICK_W, BRICK_H);
      if (!axis) continue;
      state.bricks[row * COLS + col] = false;
      state.score += ROW_POINTS[row];
      if (axis === 'x') {
        ball.vx =
          ball.x < p.x + BRICK_W / 2 ? -Math.abs(ball.vx) : Math.abs(ball.vx);
      } else {
        ball.vy =
          ball.y < p.y + BRICK_H / 2 ? -Math.abs(ball.vy) : Math.abs(ball.vy);
      }
      break outer;
    }
  }

  if (bricksLeft(state) === 0) {
    resetLevel(state, state.level + 1);
    return;
  }

  // 下に落ちた
  if (ball.y - BALL_R > HEIGHT) {
    state.lives -= 1;
    if (state.lives <= 0) {
      state.status = 'over';
      return;
    }
    parkBall(state);
  }
}

/**
 * ゲームを dt 秒進める。長い dt は細かく刻み、ボールがブロックをすり抜けないようにする。
 * state を直接更新する（終了後は何もしない）
 */
export function step(
  state: BreakoutState,
  input: Input,
  dt: number,
  rng: Rng,
): void {
  let remaining = Math.min(Math.max(dt, 0), MAX_FRAME_SECONDS);
  while (remaining > 1e-9 && state.status === 'playing') {
    const h = Math.min(STEP_SECONDS, remaining);
    tick(state, input, h, rng);
    remaining -= h;
  }
}

// ---- ベスト記録 ----

/** 保存された文字列からベストスコアを読む。不正な値は 0 */
export function parseBest(raw: string | null): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : 0;
}

export function serializeBest(score: number): string {
  return String(Math.max(0, Math.floor(score)));
}
