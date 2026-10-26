/** 一筆書きパズル（オイラー路）のロジック。UI文言・DOMには依存しない。 */

export type Difficulty = 'easy' | 'normal' | 'hard';

export const DIFFICULTIES: readonly Difficulty[] = ['easy', 'normal', 'hard'];

export const DIFFICULTY_SPECS: Record<
  Difficulty,
  { vertices: number; edges: number }
> = {
  easy: { vertices: 5, edges: 6 },
  normal: { vertices: 7, edges: 10 },
  hard: { vertices: 9, edges: 14 },
};

export interface Point {
  x: number;
  y: number;
}

export type Edge = readonly [number, number];

export interface Puzzle {
  /** 頂点の座標（0〜1の正規化座標） */
  points: Point[];
  /** 辺（頂点番号の組。a < b に正規化済み） */
  edges: Edge[];
}

/** 0以上1未満を返す乱数関数。テストでは決定的なものを注入する */
export type Rng = () => number;

/** シード付きの決定的な乱数（mulberry32） */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function isDifficulty(value: unknown): value is Difficulty {
  return DIFFICULTIES.includes(value as Difficulty);
}

function normalize(a: number, b: number): Edge {
  return a < b ? [a, b] : [b, a];
}

/** 各頂点の次数（辺の本数） */
export function degrees(puzzle: Puzzle, edgeIndexes?: number[]): number[] {
  const deg = puzzle.points.map(() => 0);
  const list = edgeIndexes ?? puzzle.edges.map((_, i) => i);
  for (const i of list) {
    const e = puzzle.edges[i]!;
    deg[e[0]] = deg[e[0]]! + 1;
    deg[e[1]] = deg[e[1]]! + 1;
  }
  return deg;
}

/** 次数が奇数の頂点（奇点）の番号 */
export function oddVertices(puzzle: Puzzle, edgeIndexes?: number[]): number[] {
  const out: number[] = [];
  degrees(puzzle, edgeIndexes).forEach((d, v) => {
    if (d % 2 === 1) out.push(v);
  });
  return out;
}

/** 指定した辺だけで、辺を持つ頂点がすべて1つにつながっているか（辺が無ければ true） */
export function isConnected(puzzle: Puzzle, edgeIndexes?: number[]): boolean {
  const list = edgeIndexes ?? puzzle.edges.map((_, i) => i);
  if (list.length === 0) return true;
  const adj = new Map<number, number[]>();
  for (const i of list) {
    const [a, b] = puzzle.edges[i]!;
    adj.set(a, [...(adj.get(a) ?? []), b]);
    adj.set(b, [...(adj.get(b) ?? []), a]);
  }
  const first = adj.keys().next().value as number;
  const seen = new Set<number>([first]);
  const stack = [first];
  while (stack.length > 0) {
    const v = stack.pop()!;
    for (const w of adj.get(v) ?? []) {
      if (!seen.has(w)) {
        seen.add(w);
        stack.push(w);
      }
    }
  }
  return seen.size === adj.size;
}

/** 一筆書き（オイラー路）が存在するか：連結で、奇点が0個または2個 */
export function hasEulerTrail(puzzle: Puzzle): boolean {
  if (puzzle.edges.length === 0) return false;
  const odd = oddVertices(puzzle).length;
  return isConnected(puzzle) && (odd === 0 || odd === 2);
}

/** 一筆書きの始点にできる頂点（奇点が2個ならその2つ、0個なら辺を持つ全頂点） */
export function startVertices(puzzle: Puzzle): number[] {
  if (!hasEulerTrail(puzzle)) return [];
  const odd = oddVertices(puzzle);
  if (odd.length === 2) return odd;
  const deg = degrees(puzzle);
  return deg.flatMap((d, v) => (d > 0 ? [v] : []));
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len2 = dx * dx + dy * dy;
  const t =
    len2 === 0
      ? 0
      : Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2));
  return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
}

/** 辺が他の頂点に近すぎる（頂点の上を通って見える）と描画で紛らわしいため避ける */
const VERTEX_CLEARANCE = 0.08;
const GRID = 4;
const MAX_ATTEMPTS = 300;

function shuffle<T>(items: T[], rng: Rng): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function pick<T>(items: T[], rng: Rng): T {
  return items[Math.min(items.length - 1, Math.floor(rng() * items.length))]!;
}

function layout(count: number, rng: Rng): Point[] {
  const cells = shuffle(
    Array.from({ length: GRID * GRID }, (_, i) => i),
    rng,
  ).slice(0, count);
  return cells.map((cell) => {
    const col = cell % GRID;
    const row = Math.floor(cell / GRID);
    const jx = (rng() - 0.5) * 0.5;
    const jy = (rng() - 0.5) * 0.5;
    return {
      x: 0.1 + (0.8 * (col + 0.5 + jx)) / GRID,
      y: 0.1 + (0.8 * (row + 0.5 + jy)) / GRID,
    };
  });
}

function attempt(
  spec: { vertices: number; edges: number },
  rng: Rng,
): Puzzle | null {
  const pts = layout(spec.vertices, rng);
  const n = pts.length;
  const allowed = (a: number, b: number): boolean =>
    pts.every(
      (p, k) =>
        k === a ||
        k === b ||
        distanceToSegment(p, pts[a]!, pts[b]!) >= VERTEX_CLEARANCE,
    );
  const used = new Set<string>();
  const walked: Edge[] = [];
  let cur = Math.min(n - 1, Math.floor(rng() * n));
  // 1本の軌跡（トレイル）として辺を足していくので、必ず連結で奇点は0個か2個になる
  while (walked.length < spec.edges) {
    const options: number[] = [];
    for (let w = 0; w < n; w++) {
      if (w === cur) continue;
      const [a, b] = normalize(cur, w);
      if (used.has(`${a}-${b}`)) continue;
      if (allowed(cur, w)) options.push(w);
    }
    if (options.length === 0) break;
    const next = pick(options, rng);
    const e = normalize(cur, next);
    used.add(`${e[0]}-${e[1]}`);
    walked.push(e);
    cur = next;
  }
  if (walked.length === 0) return null;
  // 辺を持たない頂点は取り除いて番号を詰める
  const touched = [...new Set(walked.flatMap((e) => [e[0], e[1]]))].sort(
    (a, b) => a - b,
  );
  const remap = new Map(touched.map((v, i) => [v, i]));
  return {
    points: touched.map((v) => pts[v]!),
    edges: shuffle(walked, rng).map((e) =>
      normalize(remap.get(e[0])!, remap.get(e[1])!),
    ),
  };
}

/** 一筆書きできることが保証された盤面を作る。rng を注入すると結果が決定的になる */
export function generatePuzzle(
  difficulty: Difficulty,
  rng: Rng = Math.random,
): Puzzle {
  const spec = DIFFICULTY_SPECS[difficulty];
  let best: Puzzle | null = null;
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const p = attempt(spec, rng);
    if (!p) continue;
    if (p.edges.length === spec.edges) return p;
    if (!best || p.edges.length > best.edges.length) best = p;
  }
  // 通常は到達しない。最も辺の多かった盤面を返す
  return (
    best ?? {
      points: [
        { x: 0.2, y: 0.2 },
        { x: 0.8, y: 0.2 },
        { x: 0.5, y: 0.8 },
      ],
      edges: [
        [0, 1],
        [0, 2],
        [1, 2],
      ],
    }
  );
}

export interface GameState {
  puzzle: Puzzle;
  /** たどった頂点の順 */
  path: number[];
  /** たどった辺の番号（path と同じ順で path.length - 1 本） */
  used: number[];
}

export function createGame(puzzle: Puzzle): GameState {
  return { puzzle, path: [], used: [] };
}

export function currentVertex(game: GameState): number | null {
  return game.path.length === 0 ? null : game.path[game.path.length - 1]!;
}

/** 辺を持つ頂点なら始点として選べる（正しい始点かどうかは問わない） */
export function start(game: GameState, vertex: number): GameState | null {
  if (game.path.length > 0) return null;
  if (!degrees(game.puzzle)[vertex]) return null;
  return { ...game, path: [vertex], used: [] };
}

/** 現在地から to へ引ける未使用の辺の番号。無ければ -1 */
export function findEdge(game: GameState, to: number): number {
  const from = currentVertex(game);
  if (from === null || from === to) return -1;
  return game.puzzle.edges.findIndex(
    (e, i) =>
      !game.used.includes(i) &&
      ((e[0] === from && e[1] === to) || (e[0] === to && e[1] === from)),
  );
}

/** 現在地から to へ未使用の辺を1本たどる。できなければ null */
export function move(game: GameState, to: number): GameState | null {
  const i = findEdge(game, to);
  if (i < 0) return null;
  return {
    ...game,
    path: [...game.path, to],
    used: [...game.used, i],
  };
}

/** 1手戻す。始点だけ選んだ状態からは始点の選択を取り消す */
export function undo(game: GameState): GameState {
  if (game.path.length === 0) return game;
  return {
    ...game,
    path: game.path.slice(0, -1),
    used: game.used.slice(0, -1),
  };
}

export function isSolved(game: GameState): boolean {
  return game.used.length === game.puzzle.edges.length;
}

export function remainingEdges(game: GameState): number[] {
  return game.puzzle.edges.flatMap((_, i) =>
    game.used.includes(i) ? [] : [i],
  );
}

/** 現在地から、残りの辺をすべて通り切る経路がまだあるか */
export function canFinish(game: GameState): boolean {
  const cur = currentVertex(game);
  if (cur === null) return hasEulerTrail(game.puzzle);
  const rest = remainingEdges(game);
  if (rest.length === 0) return true;
  const deg = degrees(game.puzzle, rest);
  if (!deg[cur]) return false;
  const odd = oddVertices(game.puzzle, rest);
  if (!(odd.length === 0 || (odd.length === 2 && odd.includes(cur))))
    return false;
  return isConnected(game.puzzle, rest);
}

/** 現在地から出る未使用の辺の本数が0で、未クリアなら行き止まり */
export function isDeadEnd(game: GameState): boolean {
  const cur = currentVertex(game);
  if (cur === null || isSolved(game)) return false;
  return !game.puzzle.edges.some(
    (e, i) => !game.used.includes(i) && (e[0] === cur || e[1] === cur),
  );
}

export type Hint =
  | { kind: 'start'; vertex: number }
  | { kind: 'edge'; edge: number; to: number };

/**
 * ヒント。始点が未選択なら始点を、選択済みなら「進んでも完成できる辺」を返す。
 * 橋（通ると戻れなくなる辺）はなるべく避ける（Fleury法）。完成不能な状態では null
 */
export function getHint(game: GameState): Hint | null {
  if (isSolved(game)) return null;
  const cur = currentVertex(game);
  if (cur === null) {
    const starts = startVertices(game.puzzle);
    return starts.length > 0 ? { kind: 'start', vertex: starts[0]! } : null;
  }
  if (!canFinish(game)) return null;
  for (let i = 0; i < game.puzzle.edges.length; i++) {
    if (game.used.includes(i)) continue;
    const e = game.puzzle.edges[i]!;
    if (e[0] !== cur && e[1] !== cur) continue;
    const to = e[0] === cur ? e[1] : e[0];
    const next = move(game, to);
    // 同じ頂点間に未使用の辺が複数あっても1本目で判定してよい（辺は重複しない）
    if (next && canFinish(next)) return { kind: 'edge', edge: i, to };
  }
  return null;
}
