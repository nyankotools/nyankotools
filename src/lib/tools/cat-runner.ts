export const WORLD_WIDTH = 600;
export const WORLD_HEIGHT = 160;
export const CAT_SIZE = 28;
export const CAT_START_X = 10;

const GRAVITY = 1800;
const JUMP_VELOCITY = 620;
const WALK_SPEED = 140;
// 当たり判定は見た目より少し小さくして理不尽さを「罠」だけに留める
const HIT_MARGIN = 5;
const FALL_DEATH_Y = -30;
const GOAL_FAKE_X = 540;
const GOAL_REAL_X = 592;

export type HazardKind = 'spike' | 'block' | 'enemy';

export interface Hazard {
  kind: HazardKind;
  x: number;
  /** 地面からの下端の高さ */
  y: number;
  width: number;
  height: number;
  /** 猫の x がこの値以上になると発動する */
  triggerX: number;
  triggered: boolean;
  vx: number;
  vy: number;
  /** 縦移動の停止位置（y） */
  stopY: number;
}

export interface Floor {
  x: number;
  width: number;
  /** 猫の x がこの値以上になると崩れて消える（未指定なら崩れない） */
  collapseAt?: number;
  gone: boolean;
}

/** 見えない天井。上昇中の頭が当たると姿を現し、そこで上昇が止まる。 */
export interface Ceiling {
  x: number;
  /** 地面からの下端の高さ */
  y: number;
  width: number;
  height: number;
  revealed: boolean;
}

export type DeathCause = 'pit' | 'spike' | 'block' | 'enemy';

export interface RunnerState {
  x: number;
  /** 地面からの猫の高さ */
  y: number;
  vy: number;
  floors: Floor[];
  hazards: Hazard[];
  ceilings: Ceiling[];
  goalX: number;
  goalMoved: boolean;
  over: boolean;
  cleared: boolean;
  cause: DeathCause | null;
}

export interface Input {
  left: boolean;
  right: boolean;
}

function hazard(
  kind: HazardKind,
  x: number,
  y: number,
  width: number,
  height: number,
  triggerX: number,
  vx: number,
  vy: number,
  stopY = y,
): Hazard {
  return {
    kind,
    x,
    y,
    width,
    height,
    triggerX,
    triggered: false,
    vx,
    vy,
    stopY,
  };
}

/** ステージは固定。見た目が無害なのに発動する罠を並べる（しょぼんのアクション風）。 */
export function createState(): RunnerState {
  return {
    x: CAT_START_X,
    y: 0,
    vy: 0,
    floors: [
      { x: 0, width: 120, gone: false },
      // 120〜190 は普通の穴
      { x: 190, width: 40, gone: false },
      // 普通の床に見えるが、乗ると崩れる
      { x: 230, width: 55, collapseAt: 235, gone: false },
      { x: 285, width: 235, gone: false },
      // ゴール直前の床。旗が逃げた直後に崩れる
      { x: 520, width: 55, collapseAt: 500, gone: false },
      { x: 575, width: 25, gone: false },
    ],
    hazards: [
      // 天井から落ちてくるブロック
      hazard('block', 330, 135, 30, 30, 320, 0, -300, 0),
      // 地面から飛び出すトゲ
      hazard('spike', 425, -20, 22, 20, 410, 0, 400, 0),
      // 右端から突進してくる敵
      hazard('enemy', 600, 0, 24, 24, 460, -260, 0),
    ],
    // 最初の穴の奥側に隠れたブロック。早めに跳んで下降中に通り抜ければ越えられる
    ceilings: [{ x: 150, y: 40, width: 25, height: 40, revealed: false }],
    goalX: GOAL_FAKE_X,
    goalMoved: false,
    over: false,
    cleared: false,
    cause: null,
  };
}

export function jump(state: RunnerState): void {
  if (state.over || state.cleared || state.y > 0) return;
  state.vy = JUMP_VELOCITY;
}

function hasFloorUnder(state: RunnerState, centerX: number): boolean {
  return state.floors.some(
    (f) => !f.gone && centerX >= f.x && centerX < f.x + f.width,
  );
}

function hits(state: RunnerState, h: Hazard): boolean {
  if (!h.triggered) return false;
  const left = state.x + HIT_MARGIN;
  const right = state.x + CAT_SIZE - HIT_MARGIN;
  const bottom = state.y + HIT_MARGIN;
  const top = state.y + CAT_SIZE - HIT_MARGIN;
  return (
    h.x < right && h.x + h.width > left && h.y < top && h.y + h.height > bottom
  );
}

/** dt（秒）だけ進める。 */
export function step(state: RunnerState, dt: number, input: Input): void {
  if (state.over || state.cleared) return;

  // 見えないブロックに頭をぶつけたら、横に動けず真下に落ちる
  const stunned = state.ceilings.some((c) => c.revealed);
  const dir = stunned ? 0 : (input.right ? 1 : 0) - (input.left ? 1 : 0);
  state.x = Math.min(
    WORLD_WIDTH - CAT_SIZE,
    Math.max(0, state.x + dir * WALK_SPEED * dt),
  );

  // 罠の発動
  for (const f of state.floors) {
    if (f.collapseAt !== undefined && state.x >= f.collapseAt) f.gone = true;
  }
  for (const h of state.hazards) {
    if (!h.triggered && state.x >= h.triggerX) h.triggered = true;
  }
  // 逃げるゴール旗
  if (!state.goalMoved && state.x + CAT_SIZE >= state.goalX - 40) {
    state.goalMoved = true;
    state.goalX = GOAL_REAL_X;
  }

  for (const h of state.hazards) {
    if (!h.triggered) continue;
    h.x += h.vx * dt;
    h.y += h.vy * dt;
    if (h.vy < 0 && h.y <= h.stopY) {
      h.y = h.stopY;
      h.vy = 0;
    } else if (h.vy > 0 && h.y >= h.stopY) {
      h.y = h.stopY;
      h.vy = 0;
    }
  }

  // 縦方向
  const prevY = state.y;
  state.vy -= GRAVITY * dt;
  state.y += state.vy * dt;
  // 床より下に沈み始めたら、横移動で床の上に来ても引き上げない
  if (
    state.y <= 0 &&
    prevY >= 0 &&
    hasFloorUnder(state, state.x + CAT_SIZE / 2)
  ) {
    state.y = 0;
    state.vy = 0;
  }

  if (state.vy > 0) {
    for (const c of state.ceilings) {
      const overlapX = c.x < state.x + CAT_SIZE && c.x + c.width > state.x;
      const overlapY = c.y < state.y + CAT_SIZE && c.y + c.height > state.y;
      if (overlapX && overlapY) {
        c.revealed = true;
        state.y = c.y - CAT_SIZE;
        state.vy = 0;
      }
    }
  }

  if (state.y < FALL_DEATH_Y) {
    state.over = true;
    state.cause = 'pit';
    return;
  }
  const hit = state.hazards.find((h) => hits(state, h));
  if (hit) {
    state.over = true;
    state.cause = hit.kind;
    return;
  }
  if (state.goalMoved && state.x + CAT_SIZE >= state.goalX) {
    state.cleared = true;
  }
}
