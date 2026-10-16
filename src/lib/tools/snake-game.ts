// スネークゲームのロジック（DOM・描画に依存しない）。
// 盤面は COLS×ROWS のマス目。座標は左上が原点（y は下向きが正）。

export const COLS = 20;
export const ROWS = 20;
export const POINTS_PER_FOOD = 10;

const BASE_TICK_MS = 150;
const TICK_STEP_MS = 4;
const MIN_TICK_MS = 70;
/** 先行入力として覚えておく向きの数（素早い連続操作を取りこぼさないため） */
const MAX_QUEUE = 2;

export type Rng = () => number;
export type Dir = 'up' | 'down' | 'left' | 'right';

export interface Cell {
  x: number;
  y: number;
}

export interface SnakeState {
  /** 先頭（頭）から順に並んだ体のマス */
  snake: Cell[];
  /** 現在進んでいる向き */
  dir: Dir;
  /** 次の移動以降に反映する向きの先行入力 */
  queue: Dir[];
  /** 餌のマス。盤面が蛇で埋まったら null */
  food: Cell | null;
  score: number;
  /** 食べた餌の数 */
  eaten: number;
  status: 'playing' | 'over' | 'won';
  overReason: 'wall' | 'self' | null;
}

const DELTA: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/** 蛇のいないマスからランダムに餌の位置を選ぶ。空きマスがなければ null */
export function placeFood(snake: Cell[], rng: Rng): Cell | null {
  const occupied = new Set(snake.map((c) => c.y * COLS + c.x));
  const free: number[] = [];
  for (let i = 0; i < COLS * ROWS; i++) {
    if (!occupied.has(i)) free.push(i);
  }
  if (free.length === 0) return null;
  const pick = free[Math.min(free.length - 1, Math.floor(rng() * free.length))];
  return { x: pick % COLS, y: Math.floor(pick / COLS) };
}

export function createGame(rng: Rng): SnakeState {
  const y = Math.floor(ROWS / 2);
  const snake: Cell[] = [
    { x: 6, y },
    { x: 5, y },
    { x: 4, y },
  ];
  return {
    snake,
    dir: 'right',
    queue: [],
    food: placeFood(snake, rng),
    score: 0,
    eaten: 0,
    status: 'playing',
    overReason: null,
  };
}

/** 向きの入力を受け付ける。反対向き・同じ向きは無視する（その場で逆走して自滅するのを防ぐ） */
export function queueDirection(state: SnakeState, dir: Dir): boolean {
  if (state.status !== 'playing') return false;
  const last = state.queue.length
    ? state.queue[state.queue.length - 1]
    : state.dir;
  if (dir === last || dir === OPPOSITE[last]) return false;
  if (state.queue.length >= MAX_QUEUE) return false;
  state.queue.push(dir);
  return true;
}

/** 1マス分進める。壁・自分の体にぶつかるとゲームオーバー、盤面を埋め尽くすとクリア */
export function step(state: SnakeState, rng: Rng): void {
  if (state.status !== 'playing') return;
  const next = state.queue.shift();
  if (next) state.dir = next;

  const head = state.snake[0];
  const d = DELTA[state.dir];
  const target: Cell = { x: head.x + d.x, y: head.y + d.y };

  if (target.x < 0 || target.x >= COLS || target.y < 0 || target.y >= ROWS) {
    state.status = 'over';
    state.overReason = 'wall';
    return;
  }

  const eating =
    state.food !== null &&
    state.food.x === target.x &&
    state.food.y === target.y;

  // 餌を食べないときは尻尾が空くので、尻尾のマスへは進める
  const body = eating ? state.snake : state.snake.slice(0, -1);
  if (body.some((c) => c.x === target.x && c.y === target.y)) {
    state.status = 'over';
    state.overReason = 'self';
    return;
  }

  state.snake.unshift(target);
  if (eating) {
    state.eaten += 1;
    state.score += POINTS_PER_FOOD;
    state.food = placeFood(state.snake, rng);
    if (state.food === null) state.status = 'won';
  } else {
    state.snake.pop();
  }
}

/** 次に進むまでの間隔（ミリ秒）。餌を食べるほど短くなる */
export function tickMs(state: SnakeState): number {
  return Math.max(MIN_TICK_MS, BASE_TICK_MS - state.eaten * TICK_STEP_MS);
}

export function parseBest(raw: string | null): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : 0;
}

export function serializeBest(score: number): string {
  return String(Math.max(0, Math.floor(score)));
}
