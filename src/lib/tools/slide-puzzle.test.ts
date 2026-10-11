import { describe, it, expect } from 'vitest';
import {
  BLANK,
  SIZES,
  applyResult,
  centerSquare,
  correctTiles,
  createBoard,
  formatTime,
  isComplete,
  isSolvable,
  isSolvedBoard,
  moveByDirection,
  moveTile,
  newGame,
  parseRecords,
  serializeRecords,
  solvedBoard,
} from './slide-puzzle';

// 決定的な疑似乱数（LCG）
function seeded(seed: number) {
  let s = seed;
  return (max: number) => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s % max;
  };
}

describe('solvedBoard / isSolvedBoard', () => {
  it('右下が空きマスの完成形を作る', () => {
    expect(solvedBoard(3)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, BLANK]);
    expect(isSolvedBoard(solvedBoard(4))).toBe(true);
  });

  it('1枚でもずれていれば未完成', () => {
    expect(isSolvedBoard([1, 2, 3, 4, 5, 6, 7, BLANK, 8])).toBe(false);
  });
});

describe('isSolvable', () => {
  it('完成形は解ける', () => {
    for (const s of SIZES) expect(isSolvable(solvedBoard(s), s)).toBe(true);
  });

  it('15パズルで14と15だけ入れ替えた並びは解けない', () => {
    const b = solvedBoard(4);
    [b[13], b[14]] = [b[14], b[13]];
    expect(isSolvable(b, 4)).toBe(false);
  });

  it('3×3: 1と2を入れ替えた並びは解けない', () => {
    const b = solvedBoard(3);
    [b[0], b[1]] = [b[1], b[0]];
    expect(isSolvable(b, 3)).toBe(false);
  });

  it('1手動かした並びは解ける（偶数幅・奇数幅）', () => {
    for (const s of SIZES) {
      const moved = moveByDirection(newGame(solvedBoard(s), s), 'down');
      expect(isSolvable(moved.board, s)).toBe(true);
    }
  });
});

describe('createBoard', () => {
  it('どのサイズでも、解けて完成済みでない並びを作る', () => {
    for (const s of SIZES) {
      for (let seed = 1; seed <= 50; seed++) {
        const board = createBoard(s, seeded(seed));
        expect(board.length).toBe(s * s);
        expect([...board].sort((a, b) => a - b)).toEqual([
          BLANK,
          ...Array.from({ length: s * s - 1 }, (_, i) => i + 1),
        ]);
        expect(isSolvable(board, s)).toBe(true);
        expect(isSolvedBoard(board)).toBe(false);
      }
    }
  });

  it('不正なサイズは RangeError', () => {
    expect(() => createBoard(1)).toThrow(RangeError);
    expect(() => createBoard(2.5)).toThrow(RangeError);
  });
});

describe('moveTile', () => {
  const start = newGame([1, 2, 3, 4, 5, 6, 7, BLANK, 8], 3);

  it('空きマスの隣のタイルは1手で動く', () => {
    const next = moveTile(start, 8);
    expect(next.board).toEqual([1, 2, 3, 4, 5, 6, 7, 8, BLANK]);
    expect(next.moves).toBe(1);
    expect(isComplete(next)).toBe(true);
  });

  it('空きマスと別の行・列のタイル、空きマス自身、範囲外は動かない', () => {
    expect(moveTile(start, 0)).toBe(start);
    expect(moveTile(start, 7)).toBe(start);
    expect(moveTile(start, -1)).toBe(start);
    expect(moveTile(start, 9)).toBe(start);
    expect(moveTile(start, 1.5)).toBe(start);
  });

  it('同じ行の離れたタイルは間をまとめて滑らせ、枚数分を手数に数える', () => {
    const s = newGame([BLANK, 1, 2, 3, 4, 5, 6, 7, 8], 3);
    const next = moveTile(s, 2);
    expect(next.board).toEqual([1, 2, BLANK, 3, 4, 5, 6, 7, 8]);
    expect(next.moves).toBe(2);
  });

  it('同じ列の離れたタイルも滑らせる', () => {
    const s = newGame([BLANK, 1, 2, 3, 4, 5, 6, 7, 8], 3);
    const next = moveTile(s, 6);
    expect(next.board).toEqual([3, 1, 2, 6, 4, 5, BLANK, 7, 8]);
    expect(next.moves).toBe(2);
  });

  it('元の state を書き換えない', () => {
    const before = [...start.board];
    moveTile(start, 8);
    expect(start.board).toEqual(before);
    expect(start.moves).toBe(0);
  });
});

describe('moveByDirection', () => {
  const s = newGame([1, 2, 3, 4, BLANK, 5, 6, 7, 8], 3);

  it('矢印の向きへ、空きマスの反対側のタイルが動く', () => {
    expect(moveByDirection(s, 'left').board[4]).toBe(5);
    expect(moveByDirection(s, 'right').board[4]).toBe(4);
    expect(moveByDirection(s, 'up').board[4]).toBe(7);
    expect(moveByDirection(s, 'down').board[4]).toBe(2);
  });

  it('端では動かない', () => {
    const corner = newGame(solvedBoard(3), 3);
    expect(moveByDirection(corner, 'left')).toBe(corner);
    expect(moveByDirection(corner, 'up')).toBe(corner);
  });
});

describe('correctTiles', () => {
  it('正しい位置のタイル数を数える（空きマスは除く）', () => {
    expect(correctTiles(newGame(solvedBoard(3), 3))).toBe(8);
    expect(correctTiles(newGame([2, 1, 3, 4, 5, 6, 7, 8, BLANK], 3))).toBe(6);
  });
});

describe('ベスト記録', () => {
  it('初回は両方とも更新扱い', () => {
    const r = applyResult({}, 4, 50, 60000);
    expect(r.newBestMoves).toBe(true);
    expect(r.newBestTime).toBe(true);
    expect(r.records[4]).toEqual({ moves: 50, timeMs: 60000 });
  });

  it('手数と時間は別々に更新する', () => {
    const r = applyResult({ 4: { moves: 50, timeMs: 60000 } }, 4, 40, 90000);
    expect(r.newBestMoves).toBe(true);
    expect(r.newBestTime).toBe(false);
    expect(r.records[4]).toEqual({ moves: 40, timeMs: 60000 });
  });

  it('サイズごとに独立している', () => {
    const r = applyResult({ 3: { moves: 20, timeMs: 10000 } }, 4, 99, 99000);
    expect(r.records[3]).toEqual({ moves: 20, timeMs: 10000 });
    expect(r.records[4]).toEqual({ moves: 99, timeMs: 99000 });
  });

  it('保存と復元で値が一致する', () => {
    const records = { 3: { moves: 20, timeMs: 10000 } };
    expect(parseRecords(serializeRecords(records))).toEqual(records);
  });

  it('壊れた保存値・想定外の形は無視する', () => {
    expect(parseRecords(null)).toEqual({});
    expect(parseRecords('not json')).toEqual({});
    expect(parseRecords('[]')).toEqual({});
    expect(parseRecords('{"3":{"moves":-1,"timeMs":5}}')).toEqual({});
    expect(parseRecords('{"9":{"moves":1,"timeMs":5}}')).toEqual({});
  });
});

describe('formatTime', () => {
  it('m:ss.s 形式にする', () => {
    expect(formatTime(0)).toBe('0:00.0');
    expect(formatTime(65300)).toBe('1:05.3');
    expect(formatTime(-5)).toBe('0:00.0');
  });
});

describe('centerSquare', () => {
  it('横長画像は左右を、縦長画像は上下を切る', () => {
    expect(centerSquare(400, 200)).toEqual({ x: 100, y: 0, side: 200 });
    expect(centerSquare(200, 301)).toEqual({ x: 0, y: 50, side: 200 });
    expect(centerSquare(100, 100)).toEqual({ x: 0, y: 0, side: 100 });
  });

  it('幅や高さが0の画像でも例外にならず、一辺0の領域を返す', () => {
    expect(centerSquare(0, 0)).toEqual({ x: 0, y: 0, side: 0 });
    expect(centerSquare(0, 50)).toEqual({ x: 0, y: 25, side: 0 });
  });
});

describe('移動の境界（端・長い行/列）', () => {
  it('上下方向の矢印は端で動かず、内側では正しいタイルが動く', () => {
    // 空きマスが上端（index 1）
    const top = newGame([1, BLANK, 3, 4, 5, 6, 7, 8, 9], 3);
    expect(moveByDirection(top, 'down')).toBe(top);
    expect(moveByDirection(top, 'up').board[1]).toBe(5);
    // 空きマスが下端（index 7）
    const bottom = newGame([1, 2, 3, 4, 5, 6, 7, BLANK, 9], 3);
    expect(moveByDirection(bottom, 'up')).toBe(bottom);
    expect(moveByDirection(bottom, 'down').board[7]).toBe(5);
  });

  it('5×5の行を端から端まで滑らせると、手数は枚数分（4）になる', () => {
    const board = [
      BLANK,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
    ];
    const next = moveTile(newGame(board, 5), 4);
    expect(next.board.slice(0, 5)).toEqual([1, 2, 3, 4, BLANK]);
    expect(next.moves).toBe(4);
  });

  it('2×2 の盤面も扱える', () => {
    const b = solvedBoard(2);
    expect(b).toEqual([1, 2, 3, BLANK]);
    expect(isComplete(newGame(b, 2))).toBe(true);
    const created = createBoard(2, seeded(7));
    expect(isSolvable(created, 2)).toBe(true);
    expect(isSolvedBoard(created)).toBe(false);
  });

  it('完成済みの盤面では isComplete が true、1枚でもずれると false', () => {
    expect(isComplete(newGame(solvedBoard(5), 5))).toBe(true);
    const off = solvedBoard(4);
    [off[0], off[1]] = [off[1], off[0]];
    expect(isComplete(newGame(off, 4))).toBe(false);
  });
});

describe('ベスト記録（追加の境界）', () => {
  it('同じ手数・同じ時間は「更新」にならない', () => {
    const r = applyResult({ 3: { moves: 20, timeMs: 10000 } }, 3, 20, 10000);
    expect(r.newBestMoves).toBe(false);
    expect(r.newBestTime).toBe(false);
  });

  it('壊れた値（0・小数の切り捨てで0になる・null・文字列）は個別に無視する', () => {
    expect(parseRecords('{"3":{"moves":0.5,"timeMs":5}}')).toEqual({});
    expect(parseRecords('{"3":null}')).toEqual({});
    expect(parseRecords('{"4":{"moves":"5","timeMs":5}}')).toEqual({});
    expect(parseRecords('{"3":{"moves":12.7,"timeMs":5000.9}}')).toEqual({
      3: { moves: 12, timeMs: 5000 },
    });
  });

  it('有効なサイズの記録だけ残し、他は捨てる', () => {
    const raw = '{"3":{"moves":5,"timeMs":900},"4":{"moves":"x"}}';
    expect(parseRecords(raw)).toEqual({ 3: { moves: 5, timeMs: 900 } });
  });
});

describe('formatTime（境界）', () => {
  it('小数第1位で切り捨て、59.9秒→1分へ繰り上がり、1時間以上も分で表示する', () => {
    expect(formatTime(999)).toBe('0:00.9');
    expect(formatTime(59999)).toBe('0:59.9');
    expect(formatTime(60000)).toBe('1:00.0');
    expect(formatTime(3600000)).toBe('60:00.0');
  });
});
