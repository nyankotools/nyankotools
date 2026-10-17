import { describe, it, expect } from 'vitest';
import {
  COLS,
  ROWS,
  PIECE_TYPES,
  collides,
  createGame,
  dropMs,
  emptyBoard,
  ghostY,
  gravityStep,
  hardDrop,
  holdPiece,
  levelFor,
  moveHorizontal,
  parseBest,
  pieceCells,
  rotate,
  serializeBest,
  softDrop,
  spawnPiece,
  type PieceType,
  type TetrisState,
} from './tetris-game';

const rng = () => 0;

function game(type: PieceType = 'T'): TetrisState {
  const s = createGame(rng);
  s.current = spawnPiece(type);
  return s;
}

/** 最下段を、指定した列以外すべて埋める */
function fillBottom(s: TetrisState, gaps: number[], row = ROWS - 1) {
  for (let x = 0; x < COLS; x++)
    s.board[row][x] = gaps.includes(x) ? null : 'J';
}

describe('ミノの形', () => {
  it('どのミノ・どの回転でも4マスで、盤面内に出現できる', () => {
    for (const type of PIECE_TYPES) {
      for (let rot = 0; rot < 4; rot++) {
        const p = { ...spawnPiece(type), rot };
        expect(pieceCells(p)).toHaveLength(4);
      }
      expect(collides(emptyBoard(), spawnPiece(type))).toBe(false);
    }
  });

  it('4回回転すると元の向きに戻る', () => {
    const s = game('L');
    const before = JSON.stringify(pieceCells(s.current));
    for (let i = 0; i < 4; i++) expect(rotate(s, 1)).toBe(true);
    expect(JSON.stringify(pieceCells(s.current))).toBe(before);
  });

  it('Oミノは回転しても占めるマスが変わらない', () => {
    const s = game('O');
    const key = (cs: { x: number; y: number }[]) =>
      cs
        .map((c) => `${c.x},${c.y}`)
        .sort()
        .join('|');
    const before = key(pieceCells(s.current));
    rotate(s, 1);
    expect(key(pieceCells(s.current))).toBe(before);
  });
});

describe('createGame', () => {
  it('空の盤面で始まり、キューに次のミノが入っている', () => {
    const s = createGame(() => 0.3);
    expect(s.board.flat().every((v) => v === null)).toBe(true);
    expect(s.queue.length).toBeGreaterThanOrEqual(3);
    expect(s.level).toBe(1);
    expect(s.status).toBe('playing');
  });

  it('7種を1巡ずつ出す（最初の7個に全種類が1つずつ含まれる）', () => {
    const s = createGame(() => 0.7);
    const first7 = [s.current.type, ...s.queue.slice(0, 6)];
    expect([...first7].sort()).toEqual([...PIECE_TYPES].sort());
  });
});

describe('移動と回転', () => {
  it('左右に動かせるが、壁では止まる', () => {
    const s = game('O');
    for (let i = 0; i < 20; i++) moveHorizontal(s, -1);
    expect(Math.min(...pieceCells(s.current).map((c) => c.x))).toBe(0);
    expect(moveHorizontal(s, -1)).toBe(false);
    for (let i = 0; i < 20; i++) moveHorizontal(s, 1);
    expect(Math.max(...pieceCells(s.current).map((c) => c.x))).toBe(COLS - 1);
  });

  it('壁際で縦長Iを回転すると、壁から押し返されて回転できる', () => {
    const s = game('I');
    rotate(s, 1); // 縦
    for (let i = 0; i < 20; i++) moveHorizontal(s, 1);
    expect(rotate(s, 1)).toBe(true);
    expect(collides(s.board, s.current)).toBe(false);
  });

  it('周りが埋まっていて入らない回転は失敗し、状態は変わらない', () => {
    const s = game('I');
    // 縦向きになる列(x=5付近)を塞ぎ、キックの候補もすべて塞ぐ
    for (let y = 0; y < 6; y++)
      for (let x = 0; x < COLS; x++) s.board[y][x] = 'J';
    for (let x = 0; x < COLS; x++) s.board[1][x] = null;
    const before = { ...s.current };
    expect(rotate(s, 1)).toBe(false);
    expect(s.current).toEqual(before);
  });
});

describe('落下', () => {
  it('ソフトドロップは1段下げて1点、床では動かない', () => {
    const s = game('O');
    expect(softDrop(s)).toBe(true);
    expect(s.score).toBe(1);
    expect(s.current.y).toBe(1);
    s.current.y = ROWS - 2;
    expect(softDrop(s)).toBe(false);
    expect(s.score).toBe(1);
  });

  it('自動落下は着地するまで1段ずつ下げ、着地後の次の刻みで固定する', () => {
    const s = game('O');
    s.current.y = ROWS - 2;
    const next = s.queue[0];
    gravityStep(s, rng);
    expect(s.board[ROWS - 1].filter((v) => v === 'O')).toHaveLength(2);
    expect(s.current.type).toBe(next);
    expect(s.current.y).toBe(0);
  });

  it('ゴーストは落下先を指し、ハードドロップはそこへ固定して段数×2点', () => {
    const s = game('O');
    expect(ghostY(s)).toBe(ROWS - 2);
    hardDrop(s, rng);
    expect(s.score).toBe((ROWS - 2) * 2);
    expect(s.board[ROWS - 1].filter((v) => v === 'O')).toHaveLength(2);
    expect(s.board[ROWS - 2].filter((v) => v === 'O')).toHaveLength(2);
  });
});

describe('ライン消去と得点', () => {
  it('1ライン消すと100点、上の段が1段下がる', () => {
    const s = game('I');
    fillBottom(s, [3, 4, 5, 6]);
    s.board[ROWS - 2][0] = 'Z';
    hardDrop(s, rng);
    expect(s.lines).toBe(1);
    expect(s.score).toBe(100 + (ROWS - 2) * 2);
    expect(s.board[ROWS - 1][0]).toBe('Z');
    expect(s.board[ROWS - 2].every((v) => v === null)).toBe(true);
  });

  it('複数ライン同時消しは得点が大きい（2/3/4ライン = 300/500/800）', () => {
    for (const [n, pts] of [
      [2, 300],
      [3, 500],
      [4, 800],
    ] as const) {
      const s = game('I');
      s.current = { ...spawnPiece('I'), rot: 1 }; // 縦のIは x = 5 の列に落ちる
      for (let i = 0; i < n; i++) fillBottom(s, [5], ROWS - 1 - i);
      const drop = ghostY(s) - s.current.y;
      hardDrop(s, rng);
      expect(s.lines).toBe(n);
      expect(s.score).toBe(pts + drop * 2);
    }
  });

  it('10ライン消すごとにレベルが上がり、得点にレベルが掛かる', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(9)).toBe(1);
    expect(levelFor(10)).toBe(2);
    expect(levelFor(25)).toBe(3);
    const s = game('I');
    s.lines = 9;
    fillBottom(s, [3, 4, 5, 6]);
    hardDrop(s, rng);
    expect(s.level).toBe(2);
    const t = game('I');
    t.level = 2;
    fillBottom(t, [3, 4, 5, 6]);
    const drop = ghostY(t) * 2;
    hardDrop(t, rng);
    expect(t.score).toBe(100 * 2 + drop);
  });

  it('落下間隔はレベルが上がるほど短くなり、下限がある', () => {
    expect(dropMs(1)).toBeGreaterThan(dropMs(5));
    expect(dropMs(5)).toBeGreaterThan(dropMs(10));
    expect(dropMs(999)).toBe(50);
  });
});

describe('ホールド', () => {
  it('最初のホールドは現在のミノを保持して次のミノが出る', () => {
    const s = game('T');
    const next = s.queue[0];
    expect(holdPiece(s, rng)).toBe(true);
    expect(s.hold).toBe('T');
    expect(s.current.type).toBe(next);
    expect(s.canHold).toBe(false);
  });

  it('固定するまで再ホールドできず、固定後は入れ替えられる', () => {
    const s = game('T');
    holdPiece(s, rng);
    const cur = s.current.type;
    expect(holdPiece(s, rng)).toBe(false);
    hardDrop(s, rng);
    expect(s.canHold).toBe(true);
    const after = s.current.type;
    expect(holdPiece(s, rng)).toBe(true);
    expect(s.current.type).toBe('T');
    expect(s.hold).toBe(after);
    expect(cur).toBeDefined();
  });
});

describe('ゲームオーバー', () => {
  it('出現位置が埋まっていると次のミノが出た時点で終了し、以降の操作は無効', () => {
    const s = game('O');
    // ライン消去で空かないよう、1列だけ空けて出現位置を埋める
    for (let y = 0; y < 4; y++) fillBottom(s, [0], y);
    s.current.y = ROWS - 2;
    gravityStep(s, rng);
    expect(s.status).toBe('over');
    const snapshot = JSON.stringify(s);
    expect(moveHorizontal(s, 1)).toBe(false);
    expect(rotate(s, 1)).toBe(false);
    expect(softDrop(s)).toBe(false);
    expect(holdPiece(s, rng)).toBe(false);
    hardDrop(s, rng);
    gravityStep(s, rng);
    expect(JSON.stringify(s)).toBe(snapshot);
  });
});

describe('ベストスコアの保存形式', () => {
  it('不正な値は0として扱う', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-5')).toBe(0);
    expect(parseBest('1.5')).toBe(0);
    expect(parseBest('1200')).toBe(1200);
    expect(serializeBest(1200.9)).toBe('1200');
    expect(serializeBest(-3)).toBe('0');
  });

  it('0・空文字・非常に長い数字列・安全な整数を超える値は扱いを確認する', () => {
    expect(parseBest('0')).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('9'.repeat(400))).toBe(0);
    expect(parseBest('9007199254740993')).toBe(0);
    expect(parseBest('9007199254740991')).toBe(Number.MAX_SAFE_INTEGER);
  });
});

describe('追加の境界ケース', () => {
  it('左回転してから右回転すると元に戻る', () => {
    const s = game('L');
    const before = JSON.stringify(pieceCells(s.current));
    expect(rotate(s, -1)).toBe(true);
    expect(s.current.rot).toBe(3);
    expect(rotate(s, 1)).toBe(true);
    expect(JSON.stringify(pieceCells(s.current))).toBe(before);
  });

  it('積まれたブロックに横から当たると、横移動できない', () => {
    const s = game('O');
    // O は x=4〜5、y=0〜1 に出現する。右隣の列に縦に積む
    for (let y = 0; y < 2; y++) s.board[y][6] = 'J';
    expect(moveHorizontal(s, 1)).toBe(false);
    expect(s.current.x).toBe(4);
  });

  it('出現位置が埋まっている状態でホールドすると、入れ替え先が出られずゲームオーバーになる', () => {
    const s = game('T');
    s.hold = 'I';
    // I は出現時に盤面 y=1 の x=3〜6 を使う
    for (let x = 3; x <= 6; x++) s.board[1][x] = 'J';
    expect(holdPiece(s, rng)).toBe(true);
    expect(s.hold).toBe('T');
    expect(s.status).toBe('over');
  });

  it('乱数が範囲外（1.0）を返しても7種すべてが出る', () => {
    const s = createGame(() => 1);
    const first7 = [s.current.type, ...s.queue.slice(0, 6)];
    expect([...first7].sort()).toEqual([...PIECE_TYPES].sort());
  });

  it('長時間プレイしてもキューは常に3個以上あり、盤面の大きさは変わらない', () => {
    let seed = 12345;
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x80000000;
    };
    const s = createGame(random);
    for (let i = 0; i < 300 && s.status === 'playing'; i++) {
      // 4マス幅のIでも盤面の外にはみ出さないよう、x は 0〜6 に収める
      s.current = { ...s.current, x: (i * 3) % (COLS - 3) };
      hardDrop(s, random);
      expect(s.queue.length).toBeGreaterThanOrEqual(3);
      expect(s.board).toHaveLength(ROWS);
      expect(s.board.every((row) => row.length === COLS)).toBe(true);
    }
  });

  it('レベル1の落下間隔は800ms、レベル2は680ms', () => {
    expect(dropMs(1)).toBe(800);
    expect(dropMs(2)).toBe(680);
  });
});
