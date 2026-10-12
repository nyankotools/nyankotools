// インベーダーゲームのロジック（DOM・描画に依存しない）。
// 座標は盤面の左上を原点とした px（y は下向きが正）。時間は秒。

export const WIDTH = 360;
export const HEIGHT = 440;

export const COLS = 8;
export const ROWS = 5;
export const ALIEN_W = 18;
export const ALIEN_H = 14;
export const SPACING_X = 30;
export const SPACING_Y = 24;
/** 隊列の左右の移動範囲の余白 */
export const FIELD_MARGIN = 10;
const FLEET_DROP = 12;
const FLEET_START_Y = 44;
/** 行ごとの得点（上の行ほど高い） */
export const ROW_POINTS = [30, 20, 20, 10, 10];

export const PLAYER_W = 26;
export const PLAYER_H = 12;
export const PLAYER_Y = HEIGHT - 34;
const PLAYER_SPEED = 190;
export const START_LIVES = 3;
/** やられたあとの無敵時間 */
export const INVULNERABLE_SECONDS = 2;

export const BULLET_W = 3;
export const BULLET_H = 9;
const PLAYER_BULLET_SPEED = 430;
const MAX_ENEMY_BULLETS = 3;

export const SHIELD_COUNT = 4;
export const SHIELD_COLS = 10;
export const SHIELD_ROWS = 6;
export const SHIELD_CELL = 4;
export const SHIELD_Y = HEIGHT - 92;
/** トーチカの形（# が壁）。下の中央がえぐれている */
const SHIELD_SHAPE = [
  '.########.',
  '##########',
  '##########',
  '##########',
  '###....###',
  '##......##',
];

export const UFO_W = 26;
export const UFO_H = 12;
export const UFO_Y = 20;
const UFO_SPEED = 80;
const UFO_POINTS = [50, 100, 150, 300];

const STEP_SECONDS = 1 / 120;
const MAX_FRAME_SECONDS = 0.1;

export type Rng = () => number;

export interface Bullet {
  /** 中心の x */
  x: number;
  /** 上端の y */
  y: number;
}

export interface Ufo {
  /** 左端の x */
  x: number;
  dir: 1 | -1;
  points: number;
}

export interface Input {
  left: boolean;
  right: boolean;
  fire: boolean;
}

export type OverReason = 'lives' | 'invaded';

export interface InvadersState {
  status: 'playing' | 'over';
  overReason: OverReason | null;
  level: number;
  score: number;
  lives: number;
  /** 自機の中心の x */
  playerX: number;
  /** 0 を超えている間は撃たれてもやられない */
  invulnerable: number;
  /** ROWS × COLS（row * COLS + col）。true なら生きている */
  aliens: boolean[];
  /** 隊列の左上（0行0列の敵の左上）の位置 */
  fleetX: number;
  fleetY: number;
  fleetDir: 1 | -1;
  playerBullet: Bullet | null;
  enemyBullets: Bullet[];
  /** トーチカごとの壁（SHIELD_ROWS × SHIELD_COLS） */
  shields: boolean[][];
  ufo: Ufo | null;
  ufoTimer: number;
  fireTimer: number;
  /** 経過時間（描画のアニメーション用） */
  time: number;
}

export function shieldX(index: number): number {
  const gap =
    (WIDTH - SHIELD_COUNT * SHIELD_COLS * SHIELD_CELL) / (SHIELD_COUNT + 1);
  return gap + index * (SHIELD_COLS * SHIELD_CELL + gap);
}

function createShields(): boolean[][] {
  const one = SHIELD_SHAPE.flatMap((line) =>
    Array.from(line, (ch) => ch === '#'),
  );
  return Array.from({ length: SHIELD_COUNT }, () => one.slice());
}

/** 隊列の左端が動ける範囲の中央（開始位置） */
function fleetStartX(): number {
  const width = (COLS - 1) * SPACING_X + ALIEN_W;
  return (WIDTH - width) / 2;
}

function fleetStartY(level: number): number {
  return FLEET_START_Y + Math.min(level - 1, 5) * 10;
}

function nextFireInterval(level: number, rng: Rng): number {
  const base = Math.max(0.4, 1.3 - 0.1 * (level - 1));
  return base * (0.6 + 0.8 * rng());
}

function nextUfoDelay(rng: Rng): number {
  return 14 + rng() * 12;
}

function resetLevel(state: InvadersState, level: number, rng: Rng) {
  state.level = level;
  state.aliens = new Array<boolean>(ROWS * COLS).fill(true);
  state.fleetX = fleetStartX();
  state.fleetY = fleetStartY(level);
  state.fleetDir = 1;
  state.playerBullet = null;
  state.enemyBullets = [];
  state.shields = createShields();
  state.ufo = null;
  state.ufoTimer = nextUfoDelay(rng);
  state.fireTimer = nextFireInterval(level, rng) + 0.5;
}

export function createGame(rng: Rng): InvadersState {
  const state: InvadersState = {
    status: 'playing',
    overReason: null,
    level: 1,
    score: 0,
    lives: START_LIVES,
    playerX: WIDTH / 2,
    invulnerable: 0,
    aliens: [],
    fleetX: 0,
    fleetY: 0,
    fleetDir: 1,
    playerBullet: null,
    enemyBullets: [],
    shields: [],
    ufo: null,
    ufoTimer: 0,
    fireTimer: 0,
    time: 0,
  };
  resetLevel(state, 1, rng);
  return state;
}

export function aliveCount(state: InvadersState): number {
  return state.aliens.reduce((n, a) => n + (a ? 1 : 0), 0);
}

export function alienPosition(
  state: InvadersState,
  row: number,
  col: number,
): { x: number; y: number } {
  return {
    x: state.fleetX + col * SPACING_X,
    y: state.fleetY + row * SPACING_Y,
  };
}

function overlaps(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
}

/**
 * 矩形に重なる壁を1つ壊す。弾の進行方向（dirY）のもう1マス奥も壊して、えぐれ方を大きくする。
 * 壊したら true
 */
function hitShield(
  state: InvadersState,
  x: number,
  y: number,
  w: number,
  h: number,
  dirY: number,
): boolean {
  for (let s = 0; s < SHIELD_COUNT; s++) {
    const sx = shieldX(s);
    const cells = state.shields[s];
    for (let r = 0; r < SHIELD_ROWS; r++) {
      for (let c = 0; c < SHIELD_COLS; c++) {
        if (!cells[r * SHIELD_COLS + c]) continue;
        const cx = sx + c * SHIELD_CELL;
        const cy = SHIELD_Y + r * SHIELD_CELL;
        if (!overlaps(x, y, w, h, cx, cy, SHIELD_CELL, SHIELD_CELL)) continue;
        cells[r * SHIELD_COLS + c] = false;
        const behind = r + dirY;
        if (behind >= 0 && behind < SHIELD_ROWS) {
          cells[behind * SHIELD_COLS + c] = false;
        }
        return true;
      }
    }
  }
  return false;
}

/** 敵が触れたトーチカの壁を壊す（弾ではないので1マスずつ消すだけ） */
function erodeShieldsByFleet(state: InvadersState) {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (!state.aliens[row * COLS + col]) continue;
      const { x, y } = alienPosition(state, row, col);
      if (y + ALIEN_H < SHIELD_Y) continue;
      for (let s = 0; s < SHIELD_COUNT; s++) {
        const sx = shieldX(s);
        const cells = state.shields[s];
        for (let r = 0; r < SHIELD_ROWS; r++) {
          for (let c = 0; c < SHIELD_COLS; c++) {
            if (!cells[r * SHIELD_COLS + c]) continue;
            const cx = sx + c * SHIELD_CELL;
            const cy = SHIELD_Y + r * SHIELD_CELL;
            if (
              overlaps(x, y, ALIEN_W, ALIEN_H, cx, cy, SHIELD_CELL, SHIELD_CELL)
            ) {
              cells[r * SHIELD_COLS + c] = false;
            }
          }
        }
      }
    }
  }
}

function fleetSpeed(state: InvadersState): number {
  const base = 28 + 6 * Math.min(state.level - 1, 8);
  const ratio = aliveCount(state) / (ROWS * COLS);
  return base * (1 + 3 * (1 - ratio));
}

function aliveColumnRange(state: InvadersState): [number, number] | null {
  let min = COLS;
  let max = -1;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (state.aliens[row * COLS + col]) {
        min = Math.min(min, col);
        max = Math.max(max, col);
      }
    }
  }
  return max < 0 ? null : [min, max];
}

function moveFleet(state: InvadersState, h: number) {
  const range = aliveColumnRange(state);
  if (!range) return;
  const [minCol, maxCol] = range;
  state.fleetX += state.fleetDir * fleetSpeed(state) * h;
  const leftLimit = FIELD_MARGIN - minCol * SPACING_X;
  const rightLimit = WIDTH - FIELD_MARGIN - ALIEN_W - maxCol * SPACING_X;
  if (state.fleetX >= rightLimit && state.fleetDir === 1) {
    state.fleetX = rightLimit;
    state.fleetDir = -1;
    state.fleetY += FLEET_DROP;
  } else if (state.fleetX <= leftLimit && state.fleetDir === -1) {
    state.fleetX = leftLimit;
    state.fleetDir = 1;
    state.fleetY += FLEET_DROP;
  }
}

/** 各列で一番下にいる敵のうち、ランダムな1体が撃つ */
function enemyFire(state: InvadersState, rng: Rng) {
  const shooters: { row: number; col: number }[] = [];
  for (let col = 0; col < COLS; col++) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (state.aliens[row * COLS + col]) {
        shooters.push({ row, col });
        break;
      }
    }
  }
  if (shooters.length === 0) return;
  const pick =
    shooters[
      Math.min(shooters.length - 1, Math.floor(rng() * shooters.length))
    ];
  const { x, y } = alienPosition(state, pick.row, pick.col);
  state.enemyBullets.push({ x: x + ALIEN_W / 2, y: y + ALIEN_H });
}

function enemyBulletSpeed(level: number): number {
  return Math.min(150 + 12 * (level - 1), 270);
}

function tick(state: InvadersState, input: Input, h: number, rng: Rng) {
  state.time += h;
  if (state.invulnerable > 0)
    state.invulnerable = Math.max(0, state.invulnerable - h);

  // 自機
  const dir = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  state.playerX = Math.min(
    WIDTH - FIELD_MARGIN - PLAYER_W / 2,
    Math.max(
      FIELD_MARGIN + PLAYER_W / 2,
      state.playerX + dir * PLAYER_SPEED * h,
    ),
  );
  if (input.fire && !state.playerBullet) {
    state.playerBullet = { x: state.playerX, y: PLAYER_Y - BULLET_H };
  }

  // 自機の弾
  const pb = state.playerBullet;
  if (pb) {
    pb.y -= PLAYER_BULLET_SPEED * h;
    const bx = pb.x - BULLET_W / 2;
    let consumed = pb.y + BULLET_H < 0;
    if (!consumed) {
      outer: for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          if (!state.aliens[row * COLS + col]) continue;
          const a = alienPosition(state, row, col);
          if (
            overlaps(bx, pb.y, BULLET_W, BULLET_H, a.x, a.y, ALIEN_W, ALIEN_H)
          ) {
            state.aliens[row * COLS + col] = false;
            state.score += ROW_POINTS[row];
            consumed = true;
            break outer;
          }
        }
      }
    }
    if (!consumed && state.ufo) {
      const u = state.ufo;
      if (overlaps(bx, pb.y, BULLET_W, BULLET_H, u.x, UFO_Y, UFO_W, UFO_H)) {
        state.score += u.points;
        state.ufo = null;
        state.ufoTimer = nextUfoDelay(rng);
        consumed = true;
      }
    }
    if (!consumed && hitShield(state, bx, pb.y, BULLET_W, BULLET_H, -1)) {
      consumed = true;
    }
    if (consumed) state.playerBullet = null;
  }

  // 全滅したら次のステージへ
  if (aliveCount(state) === 0) {
    resetLevel(state, state.level + 1, rng);
    return;
  }

  // 隊列
  moveFleet(state, h);
  erodeShieldsByFleet(state);
  for (let row = ROWS - 1; row >= 0; row--) {
    for (let col = 0; col < COLS; col++) {
      if (!state.aliens[row * COLS + col]) continue;
      if (state.fleetY + row * SPACING_Y + ALIEN_H >= PLAYER_Y) {
        state.status = 'over';
        state.overReason = 'invaded';
        return;
      }
    }
  }

  // 敵の弾
  state.fireTimer -= h;
  if (state.fireTimer <= 0) {
    if (state.enemyBullets.length < MAX_ENEMY_BULLETS) enemyFire(state, rng);
    state.fireTimer = nextFireInterval(state.level, rng);
  }
  const speed = enemyBulletSpeed(state.level);
  const kept: Bullet[] = [];
  let playerHit = false;
  for (const b of state.enemyBullets) {
    b.y += speed * h;
    if (b.y > HEIGHT) continue;
    const bx = b.x - BULLET_W / 2;
    if (hitShield(state, bx, b.y, BULLET_W, BULLET_H, 1)) continue;
    if (
      state.invulnerable <= 0 &&
      overlaps(
        bx,
        b.y,
        BULLET_W,
        BULLET_H,
        state.playerX - PLAYER_W / 2,
        PLAYER_Y,
        PLAYER_W,
        PLAYER_H,
      )
    ) {
      playerHit = true;
      continue;
    }
    kept.push(b);
  }
  state.enemyBullets = kept;
  if (playerHit) {
    state.lives -= 1;
    state.enemyBullets = [];
    state.playerBullet = null;
    if (state.lives <= 0) {
      state.status = 'over';
      state.overReason = 'lives';
      return;
    }
    state.invulnerable = INVULNERABLE_SECONDS;
  }

  // UFO
  if (state.ufo) {
    state.ufo.x += state.ufo.dir * UFO_SPEED * h;
    if (state.ufo.x > WIDTH || state.ufo.x + UFO_W < 0) {
      state.ufo = null;
      state.ufoTimer = nextUfoDelay(rng);
    }
  } else {
    state.ufoTimer -= h;
    if (state.ufoTimer <= 0) {
      const dirRight = rng() < 0.5;
      const points =
        UFO_POINTS[
          Math.min(UFO_POINTS.length - 1, Math.floor(rng() * UFO_POINTS.length))
        ];
      state.ufo = {
        x: dirRight ? -UFO_W : WIDTH,
        dir: dirRight ? 1 : -1,
        points,
      };
    }
  }
}

/**
 * ゲームを dt 秒進める。長い dt は細かく刻み、弾が敵をすり抜けないようにする。
 * state を直接更新する（終了後は何もしない）
 */
export function step(
  state: InvadersState,
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
