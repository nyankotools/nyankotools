/** 箱押しパズル（倉庫番風）のロジック（DOM・文言に依存しない純関数） */

export type Direction = 'up' | 'down' | 'left' | 'right';

export const DIRECTIONS: readonly Direction[] = ['up', 'down', 'left', 'right'];

const DELTAS: Record<Direction, [number, number]> = {
  up: [-1, 0],
  down: [1, 0],
  left: [0, -1],
  right: [0, 1],
};

/**
 * ステージ記法
 * `#` 壁 / ` ` 床 / `.` ゴール / `$` 箱 / `*` ゴール上の箱 / `@` プレイヤー / `+` ゴール上のプレイヤー
 * 行の長さは不揃いでよい。プレイヤーから到達できない床は壁として扱う。
 */
export const LEVELS: readonly (readonly string[])[] = [
  ['#####', '#@$.#', '#####'],
  ['######', '#    #', '# $@ #', '#.   #', '######'],
  ['#######', '#     #', '#.$@$.#', '#######'],
  ['#######', '#     #', '# .$. #', '#  $  #', '#  @  #', '#######'],
  ['########', '#      #', '# .**$@#', '#      #', '#####  #', '    ####'],
  [
    ' ########',
    ' #      #',
    '##.##   #',
    '#  $  $ #',
    '# .    @#',
    '##########',
  ],
  ['#########', '#.      #', '#   $   #', '#  @# $.#', '#########'],
  [
    '#########',
    '#   #   #',
    '# . $ . #',
    '#  $@$  #',
    '#   .   #',
    '#       #',
    '#########',
  ],
  [
    '  #######',
    '###     #',
    '#   $.$ #',
    '# #  @  #',
    '#  .$.  #',
    '#       #',
    '#########',
  ],
  [
    '##########',
    '#   #    #',
    '# $ #  . #',
    '#   $  $ #',
    '#@ .   . #',
    '#   #    #',
    '##########',
  ],
  ['####', '# .#', '#  ###', '#*@  #', '#  $ #', '#  ###', '####'],
  [
    '########',
    '#..    #',
    '#   #$ #',
    '####   #',
    '# $@$  #',
    '#     .#',
    '########',
  ],
  [
    '#########',
    '#.  ##. #',
    '#      .#',
    '##$     #',
    '##   # ##',
    '# #$$#$ #',
    '# .   @ #',
    '#########',
  ],
  [
    '#########',
    '#  ##   #',
    '#  $@$$.#',
    '# . #   #',
    '# .$.   #',
    '#########',
  ],
  [
    '#########',
    '#       #',
    '#  $    #',
    '#     ###',
    '#  #    #',
    '#   #*$ #',
    '#. .#@# #',
    '#########',
  ],
  [
    '#########',
    '#.  $   #',
    '#.##$ $ #',
    '#  .   ##',
    '#  . #  #',
    '#$$#.#  #',
    '# @##   #',
    '#########',
  ],
  [
    '#########',
    '#.      #',
    '# $    ##',
    '### #$. #',
    '# $ #@ .#',
    '#    ## #',
    '#########',
  ],
  [
    '#########',
    '#.  #   #',
    '#  $@$$ #',
    '#  ##   #',
    '# .#  # #',
    '#   #$  #',
    '# .    .#',
    '#########',
  ],
  [
    '########',
    '#     .#',
    '# ##   #',
    '#   #$ #',
    '#$* #. #',
    '#+# $$ #',
    '###  . #',
    '########',
  ],
  [
    '#########',
    '##    @ #',
    '#   # $ #',
    '#..##   #',
    '#   ##  #',
    '#  . $$ #',
    '#       #',
    '#########',
  ],
];

export interface Puzzle {
  width: number;
  height: number;
  /** 長さ width*height。壁（到達できない床を含む）なら true */
  walls: boolean[];
  /** 長さ width*height。ゴールなら true */
  goals: boolean[];
}

export interface Move {
  dir: Direction;
  /** 箱を押した手なら true */
  pushed: boolean;
}

export interface GameState {
  /** 箱の位置（昇順） */
  boxes: number[];
  player: number;
  history: Move[];
}

export interface ParsedLevel {
  puzzle: Puzzle;
  start: GameState;
}

export function toIndex(puzzle: Puzzle, row: number, col: number): number {
  return row * puzzle.width + col;
}

export function toRowCol(
  puzzle: Puzzle,
  index: number,
): { row: number; col: number } {
  return { row: Math.floor(index / puzzle.width), col: index % puzzle.width };
}

/** 盤の外・壁なら true */
function blocked(puzzle: Puzzle, row: number, col: number): boolean {
  if (row < 0 || row >= puzzle.height || col < 0 || col >= puzzle.width)
    return true;
  return puzzle.walls[row * puzzle.width + col];
}

/** ステージ記法を解釈する。プレイヤーが無い・ゴールと箱の数が違う場合は例外 */
export function parseLevel(rows: readonly string[]): ParsedLevel {
  const height = rows.length;
  const width = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const walls = new Array<boolean>(width * height).fill(true);
  const goals = new Array<boolean>(width * height).fill(false);
  const boxes: number[] = [];
  let player = -1;
  const floor = new Array<boolean>(width * height).fill(false);
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const ch = rows[r][c] ?? '#';
      const i = r * width + c;
      if (ch === '#') continue;
      floor[i] = true;
      if (ch === '.' || ch === '*' || ch === '+') goals[i] = true;
      if (ch === '$' || ch === '*') boxes.push(i);
      if (ch === '@' || ch === '+') {
        if (player !== -1) throw new Error('プレイヤーが複数います');
        player = i;
      }
    }
  }
  if (player === -1) throw new Error('プレイヤーがいません');
  // プレイヤーから到達できる床だけを床とする
  const seen = new Array<boolean>(width * height).fill(false);
  const stack = [player];
  seen[player] = true;
  while (stack.length > 0) {
    const cur = stack.pop() as number;
    const r = Math.floor(cur / width);
    const c = cur % width;
    for (const dir of DIRECTIONS) {
      const [dr, dc] = DELTAS[dir];
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= height || nc < 0 || nc >= width) continue;
      const ni = nr * width + nc;
      if (!floor[ni] || seen[ni]) continue;
      seen[ni] = true;
      stack.push(ni);
    }
  }
  for (let i = 0; i < walls.length; i++) walls[i] = !seen[i];
  const goalCount = goals.filter((g, i) => g && seen[i]).length;
  const reachableBoxes = boxes.filter((b) => seen[b]);
  if (reachableBoxes.length !== goalCount || reachableBoxes.length === 0) {
    throw new Error('箱とゴールの数が一致しません');
  }
  const puzzle: Puzzle = {
    width,
    height,
    walls,
    goals: goals.map((g, i) => g && seen[i]),
  };
  return {
    puzzle,
    start: {
      boxes: reachableBoxes.sort((a, b) => a - b),
      player,
      history: [],
    },
  };
}

/** 盤の端（外周）に床が接していないか。ステージが閉じているかの確認用 */
export function isEnclosed(rows: readonly string[]): boolean {
  const { puzzle } = parseLevel(rows);
  for (let r = 0; r < puzzle.height; r++) {
    for (let c = 0; c < puzzle.width; c++) {
      if (puzzle.walls[r * puzzle.width + c]) continue;
      for (const dir of DIRECTIONS) {
        const [dr, dc] = DELTAS[dir];
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= puzzle.height || nc < 0 || nc >= puzzle.width) {
          return false;
        }
      }
    }
  }
  return true;
}

export function newGame(parsed: ParsedLevel): GameState {
  return {
    boxes: parsed.start.boxes.slice(),
    player: parsed.start.player,
    history: [],
  };
}

/** 1歩動く。壁・押せない箱に当たったら同じ state を返す */
export function step(
  puzzle: Puzzle,
  state: GameState,
  dir: Direction,
): GameState {
  const [dr, dc] = DELTAS[dir];
  const { row, col } = toRowCol(puzzle, state.player);
  const nr = row + dr;
  const nc = col + dc;
  if (blocked(puzzle, nr, nc)) return state;
  const next = nr * puzzle.width + nc;
  const boxIdx = state.boxes.indexOf(next);
  if (boxIdx === -1) {
    return {
      boxes: state.boxes,
      player: next,
      history: [...state.history, { dir, pushed: false }],
    };
  }
  const br = nr + dr;
  const bc = nc + dc;
  if (blocked(puzzle, br, bc)) return state;
  const beyond = br * puzzle.width + bc;
  if (state.boxes.includes(beyond)) return state;
  const boxes = state.boxes.slice();
  boxes[boxIdx] = beyond;
  boxes.sort((a, b) => a - b);
  return {
    boxes,
    player: next,
    history: [...state.history, { dir, pushed: true }],
  };
}

/** 直前の1手を戻す。履歴がなければ同じ state を返す */
export function undo(puzzle: Puzzle, state: GameState): GameState {
  const last = state.history[state.history.length - 1];
  if (!last) return state;
  const [dr, dc] = DELTAS[last.dir];
  const { row, col } = toRowCol(puzzle, state.player);
  const prev = (row - dr) * puzzle.width + (col - dc);
  let boxes = state.boxes;
  if (last.pushed) {
    const from = (row + dr) * puzzle.width + (col + dc);
    boxes = state.boxes.map((b) => (b === from ? state.player : b));
    boxes.sort((a, b) => a - b);
  }
  return { boxes, player: prev, history: state.history.slice(0, -1) };
}

export function isSolved(puzzle: Puzzle, state: GameState): boolean {
  return state.boxes.every((b) => puzzle.goals[b]);
}

export function moveCount(state: GameState): number {
  return state.history.length;
}

export function pushCount(state: GameState): number {
  return state.history.filter((m) => m.pushed).length;
}

export function boxesOnGoal(puzzle: Puzzle, state: GameState): number {
  return state.boxes.filter((b) => puzzle.goals[b]).length;
}

/**
 * 幅優先探索でステージを解く（テスト用・ヒント無し）。
 * 最少手の手順を返し、解けない場合や探索上限を超えた場合は null。
 */
export function solve(
  puzzle: Puzzle,
  start: GameState,
  maxStates = 3_000_000,
): Direction[] | null {
  const keyOf = (boxes: number[], player: number) =>
    `${boxes.join(',')}|${player}`;
  if (isSolved(puzzle, start)) return [];
  const parent = new Map<string, { prev: string; dir: Direction }>();
  const startKey = keyOf(start.boxes, start.player);
  parent.set(startKey, { prev: '', dir: 'up' });
  let frontier: GameState[] = [{ ...start, history: [] }];
  while (frontier.length > 0) {
    const nextFrontier: GameState[] = [];
    for (const cur of frontier) {
      const curKey = keyOf(cur.boxes, cur.player);
      for (const dir of DIRECTIONS) {
        const moved = step(puzzle, cur, dir);
        if (moved === cur) continue;
        const key = keyOf(moved.boxes, moved.player);
        if (parent.has(key)) continue;
        parent.set(key, { prev: curKey, dir });
        if (isSolved(puzzle, moved)) {
          const path: Direction[] = [];
          let k = key;
          while (k !== startKey) {
            const p = parent.get(k) as { prev: string; dir: Direction };
            path.push(p.dir);
            k = p.prev;
          }
          return path.reverse();
        }
        if (parent.size > maxStates) return null;
        // 履歴は探索に不要なので持ち回らない
        nextFrontier.push({
          boxes: moved.boxes,
          player: moved.player,
          history: [],
        });
      }
    }
    frontier = nextFrontier;
  }
  return null;
}

/** スワイプ量から方向を決める。閾値未満なら null */
export function directionFromDelta(
  dx: number,
  dy: number,
  threshold = 24,
): Direction | null {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (Math.max(ax, ay) < threshold) return null;
  if (ax >= ay) return dx > 0 ? 'right' : 'left';
  return dy > 0 ? 'down' : 'up';
}

export function directionFromKey(key: string): Direction | null {
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      return 'up';
    case 'ArrowDown':
    case 's':
    case 'S':
      return 'down';
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return 'left';
    case 'ArrowRight':
    case 'd':
    case 'D':
      return 'right';
    default:
      return null;
  }
}

/** ステージごとの最少手数の記録（ステージ番号 0 始まり → 手数） */
export type Records = Record<number, number>;

export function parseRecords(raw: string | null, levelCount: number): Records {
  if (!raw) return {};
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return {};
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data))
    return {};
  const out: Records = {};
  for (const [k, v] of Object.entries(data)) {
    const idx = Number(k);
    if (
      Number.isInteger(idx) &&
      idx >= 0 &&
      idx < levelCount &&
      typeof v === 'number' &&
      Number.isInteger(v) &&
      v > 0
    ) {
      out[idx] = v;
    }
  }
  return out;
}

export function serializeRecords(records: Records): string {
  return JSON.stringify(records);
}

/** 記録を更新する。新記録なら更新後の records と isNewBest=true を返す */
export function updateRecord(
  records: Records,
  level: number,
  moves: number,
): { records: Records; isNewBest: boolean } {
  const current = records[level];
  if (current !== undefined && current <= moves) {
    return { records, isNewBest: false };
  }
  return { records: { ...records, [level]: moves }, isNewBest: true };
}
