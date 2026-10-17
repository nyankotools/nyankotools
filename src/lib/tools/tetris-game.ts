// 落ち物パズル（テトリス風）のロジック（DOM・描画に依存しない）。
// 盤面は COLS×ROWS のマス目。座標は左上が原点（y は下向きが正）。

export const COLS = 10;
export const ROWS = 20;
/** 「ネクスト」に表示する個数 */
export const NEXT_COUNT = 3;
export const LINES_PER_LEVEL = 10;

const LINE_SCORES = [0, 100, 300, 500, 800];
const BASE_DROP_MS = 800;
const DROP_FACTOR = 0.85;
const MIN_DROP_MS = 50;
const BAG_SIZE = 7;

export type Rng = () => number;
export type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export interface Cell {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  /** 回転状態 0〜3（時計回りに増える） */
  rot: number;
  /** ミノの外接正方形の左上のマス */
  x: number;
  y: number;
}

export type Board = (PieceType | null)[][];

export interface TetrisState {
  board: Board;
  current: Piece;
  hold: PieceType | null;
  /** 現在のミノでまだホールドしていなければ true */
  canHold: boolean;
  /** これから出てくるミノ（先頭が次） */
  queue: PieceType[];
  score: number;
  lines: number;
  level: number;
  status: 'playing' | 'over';
}

const BASE_SHAPES: Record<PieceType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

function rotateCw(m: number[][]): number[][] {
  const n = m.length;
  return m.map((_, r) => m[0].map((__, c) => m[n - 1 - c][r]));
}

function toCells(m: number[][]): Cell[] {
  const cells: Cell[] = [];
  m.forEach((row, y) =>
    row.forEach((v, x) => {
      if (v) cells.push({ x, y });
    }),
  );
  return cells;
}

/** 各ミノの4方向分の相対マス */
const SHAPES: Record<PieceType, Cell[][]> = Object.fromEntries(
  PIECE_TYPES.map((type) => {
    const rots: Cell[][] = [];
    let m = BASE_SHAPES[type];
    for (let i = 0; i < 4; i++) {
      rots.push(toCells(m));
      m = rotateCw(m);
    }
    return [type, rots];
  }),
) as Record<PieceType, Cell[][]>;

/** 回転できなかったときに順に試す位置のずれ（壁・床・他のミノに押し返す） */
const KICKS: [number, number][] = [
  [0, 0],
  [-1, 0],
  [1, 0],
  [0, -1],
  [-2, 0],
  [2, 0],
];

export function emptyBoard(): Board {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => null),
  );
}

/** ミノが占める盤面上のマス */
export function pieceCells(piece: Piece): Cell[] {
  return SHAPES[piece.type][piece.rot].map((c) => ({
    x: c.x + piece.x,
    y: c.y + piece.y,
  }));
}

/** 壁・床・既に置かれたブロックと重なるか（盤面の上にはみ出す位置も不可） */
export function collides(board: Board, piece: Piece): boolean {
  return pieceCells(piece).some(
    (c) =>
      c.x < 0 ||
      c.x >= COLS ||
      c.y < 0 ||
      c.y >= ROWS ||
      board[c.y][c.x] !== null,
  );
}

function shuffledBag(rng: Rng): PieceType[] {
  const bag = [...PIECE_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.min(i, Math.floor(rng() * (i + 1)));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

/** 7種を1巡ずつ出す方式で、キューを常に BAG_SIZE 個以上に保つ */
function refill(queue: PieceType[], rng: Rng) {
  while (queue.length < BAG_SIZE) queue.push(...shuffledBag(rng));
}

export function spawnPiece(type: PieceType): Piece {
  const size = BASE_SHAPES[type].length;
  return { type, rot: 0, x: Math.floor((COLS - size) / 2), y: 0 };
}

export function createGame(rng: Rng): TetrisState {
  const queue: PieceType[] = [];
  refill(queue, rng);
  const type = queue.shift()!;
  refill(queue, rng);
  return {
    board: emptyBoard(),
    current: spawnPiece(type),
    hold: null,
    canHold: true,
    queue,
    score: 0,
    lines: 0,
    level: 1,
    status: 'playing',
  };
}

/** 次のミノを出す。出現位置が埋まっていればゲームオーバー */
function spawnNext(state: TetrisState, rng: Rng) {
  const type = state.queue.shift()!;
  refill(state.queue, rng);
  state.current = spawnPiece(type);
  if (collides(state.board, state.current)) state.status = 'over';
}

export function levelFor(lines: number): number {
  return Math.floor(lines / LINES_PER_LEVEL) + 1;
}

/** 自動で1段落ちる間隔（ミリ秒）。レベルが上がるほど短くなる */
export function dropMs(level: number): number {
  return Math.max(
    MIN_DROP_MS,
    Math.round(BASE_DROP_MS * DROP_FACTOR ** (level - 1)),
  );
}

export function moveHorizontal(state: TetrisState, dx: -1 | 1): boolean {
  if (state.status !== 'playing') return false;
  const next = { ...state.current, x: state.current.x + dx };
  if (collides(state.board, next)) return false;
  state.current = next;
  return true;
}

/** 回転する。dir=1 が時計回り、-1 が反時計回り。入らないときは位置をずらして試す */
export function rotate(state: TetrisState, dir: 1 | -1): boolean {
  if (state.status !== 'playing') return false;
  const rot = (state.current.rot + dir + 4) % 4;
  for (const [dx, dy] of KICKS) {
    const next = {
      ...state.current,
      rot,
      x: state.current.x + dx,
      y: state.current.y + dy,
    };
    if (!collides(state.board, next)) {
      state.current = next;
      return true;
    }
  }
  return false;
}

/** ミノを今の位置で固定し、ライン消去・得点・次のミノの出現まで行う */
function lock(state: TetrisState, rng: Rng) {
  for (const c of pieceCells(state.current)) {
    state.board[c.y][c.x] = state.current.type;
  }
  const kept = state.board.filter((row) => row.some((v) => v === null));
  const cleared = ROWS - kept.length;
  if (cleared > 0) {
    while (kept.length < ROWS) {
      kept.unshift(Array.from({ length: COLS }, () => null));
    }
    state.board = kept;
    state.score += LINE_SCORES[cleared] * state.level;
    state.lines += cleared;
    state.level = levelFor(state.lines);
  }
  state.canHold = true;
  spawnNext(state, rng);
}

/** ソフトドロップ（1段下げる）。下げられたら 1 点。着地済みなら何もしない */
export function softDrop(state: TetrisState): boolean {
  if (state.status !== 'playing') return false;
  const next = { ...state.current, y: state.current.y + 1 };
  if (collides(state.board, next)) return false;
  state.current = next;
  state.score += 1;
  return true;
}

/** 時間経過による自動落下。下げられなければその場で固定する */
export function gravityStep(state: TetrisState, rng: Rng): void {
  if (state.status !== 'playing') return;
  const next = { ...state.current, y: state.current.y + 1 };
  if (collides(state.board, next)) lock(state, rng);
  else state.current = next;
}

/** 落下先の y（ゴースト表示用） */
export function ghostY(state: TetrisState): number {
  let y = state.current.y;
  while (!collides(state.board, { ...state.current, y: y + 1 })) y++;
  return y;
}

/** ハードドロップ（一気に落として固定）。落とした段数 × 2 点 */
export function hardDrop(state: TetrisState, rng: Rng): void {
  if (state.status !== 'playing') return;
  const y = ghostY(state);
  state.score += (y - state.current.y) * 2;
  state.current = { ...state.current, y };
  lock(state, rng);
}

/** ホールド。1つのミノにつき1回だけ。保持中のミノがあれば入れ替える */
export function holdPiece(state: TetrisState, rng: Rng): boolean {
  if (state.status !== 'playing' || !state.canHold) return false;
  const held = state.hold;
  state.hold = state.current.type;
  state.canHold = false;
  if (held === null) {
    spawnNext(state, rng);
  } else {
    state.current = spawnPiece(held);
    if (collides(state.board, state.current)) state.status = 'over';
  }
  return true;
}

export function parseBest(raw: string | null): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isSafeInteger(n) && n > 0 ? n : 0;
}

export function serializeBest(score: number): string {
  return String(Math.max(0, Math.floor(score)));
}
