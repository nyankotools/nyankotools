export const WORLD_WIDTH = 320;
export const WORLD_HEIGHT = 440;
/** 地面の上面（これより下は地面） */
export const FLOOR_Y = 400;
export const CAT_X = 80;
export const CAT_SIZE = 28;
export const PIPE_WIDTH = 52;
export const PIPE_GAP = 130;
export const PIPE_SPACING = 190;
export const PIPE_SPEED = 110;
export const GRAVITY = 1100;
export const FLAP_VELOCITY = -340;
export const MAX_FALL_SPEED = 520;
/** 当たり判定は見た目より少し小さくする */
export const HIT_MARGIN = 5;
/** 土管の穴の中心が取れる、天井・地面からの余白 */
export const GAP_MARGIN = 40;
/** 1回の計算で進める最大の時間（秒）。タブ切替直後などの大きな dt でも壁抜けしないようにする */
export const MAX_STEP = 1 / 60;
export const MAX_FRAME_DT = 0.1;

export type Rng = () => number;
export type DeathCause = 'pipe' | 'ground';

export interface Pipe {
  x: number;
  /** 穴の中心の y（上が 0） */
  gapY: number;
  passed: boolean;
}

export interface CatJumpState {
  /** 猫の上端の y（上が 0） */
  y: number;
  vy: number;
  pipes: Pipe[];
  score: number;
  started: boolean;
  over: boolean;
  cause: DeathCause | null;
}

export function createGame(): CatJumpState {
  return {
    y: (FLOOR_Y - CAT_SIZE) / 2,
    vy: 0,
    pipes: [],
    score: 0,
    started: false,
    over: false,
    cause: null,
  };
}

/** 穴の中心 y を決める。rng は [0, 1) を返す関数。 */
export function pickGapY(rng: Rng): number {
  const min = GAP_MARGIN + PIPE_GAP / 2;
  const max = FLOOR_Y - GAP_MARGIN - PIPE_GAP / 2;
  const r = Math.min(Math.max(rng(), 0), 1 - Number.EPSILON);
  return Math.round(min + r * (max - min));
}

/** 羽ばたく。最初の1回でゲームが始まる。終了後は何も起きない。 */
export function flap(state: CatJumpState): void {
  if (state.over) return;
  state.started = true;
  state.vy = FLAP_VELOCITY;
}

/** 猫（当たり判定の矩形）が土管に当たっているか。 */
export function hitsPipe(y: number, pipe: Pipe): boolean {
  const left = CAT_X + HIT_MARGIN;
  const right = CAT_X + CAT_SIZE - HIT_MARGIN;
  if (pipe.x >= right || pipe.x + PIPE_WIDTH <= left) return false;
  const top = y + HIT_MARGIN;
  const bottom = y + CAT_SIZE - HIT_MARGIN;
  const gapTop = pipe.gapY - PIPE_GAP / 2;
  const gapBottom = pipe.gapY + PIPE_GAP / 2;
  return top < gapTop || bottom > gapBottom;
}

function stepOnce(state: CatJumpState, dt: number, rng: Rng): void {
  state.vy = Math.min(MAX_FALL_SPEED, state.vy + GRAVITY * dt);
  state.y += state.vy * dt;
  // 天井は突き抜けず、頭が当たって止まるだけにする
  if (state.y < 0) {
    state.y = 0;
    if (state.vy < 0) state.vy = 0;
  }

  for (const p of state.pipes) p.x -= PIPE_SPEED * dt;
  state.pipes = state.pipes.filter((p) => p.x + PIPE_WIDTH > -4);
  const last = state.pipes[state.pipes.length - 1];
  if (!last || last.x <= WORLD_WIDTH - PIPE_SPACING) {
    state.pipes.push({
      x: last ? Math.max(last.x + PIPE_SPACING, WORLD_WIDTH) : WORLD_WIDTH,
      gapY: pickGapY(rng),
      passed: false,
    });
  }

  if (state.pipes.some((p) => hitsPipe(state.y, p))) {
    state.over = true;
    state.cause = 'pipe';
    return;
  }
  if (state.y + CAT_SIZE - HIT_MARGIN >= FLOOR_Y) {
    state.y = FLOOR_Y - CAT_SIZE + HIT_MARGIN;
    state.over = true;
    state.cause = 'ground';
    return;
  }
  for (const p of state.pipes) {
    if (!p.passed && p.x + PIPE_WIDTH < CAT_X) {
      p.passed = true;
      state.score += 1;
    }
  }
}

/** dt（秒）だけ進める。開始前・終了後は何もしない。 */
export function advance(state: CatJumpState, dt: number, rng: Rng): void {
  if (!state.started || state.over || !(dt > 0)) return;
  let left = Math.min(dt, MAX_FRAME_DT);
  while (left > 1e-9 && !state.over) {
    const d = Math.min(MAX_STEP, left);
    stepOnce(state, d, rng);
    left -= d;
  }
}

export function parseBest(raw: string | null | undefined): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 && n < 100000 ? n : 0;
}

export function isNewBest(score: number, best: number): boolean {
  return score > 0 && score > best;
}
