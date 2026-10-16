import { describe, it, expect } from 'vitest';
import {
  COLS,
  POINTS_PER_FOOD,
  ROWS,
  createGame,
  parseBest,
  placeFood,
  queueDirection,
  serializeBest,
  step,
  tickMs,
  type SnakeState,
} from './snake-game';

const rng = () => 0;

function game(): SnakeState {
  const s = createGame(rng);
  s.food = { x: 0, y: 0 };
  return s;
}

describe('createGame', () => {
  it('長さ3の蛇が右向きで始まり、餌は蛇の上にない', () => {
    const s = createGame(() => 0.5);
    expect(s.snake).toHaveLength(3);
    expect(s.dir).toBe('right');
    expect(s.status).toBe('playing');
    expect(s.snake.some((c) => c.x === s.food!.x && c.y === s.food!.y)).toBe(
      false,
    );
  });
});

describe('step', () => {
  it('向きに沿って1マス進み、長さは変わらない', () => {
    const s = game();
    const head = s.snake[0];
    step(s, rng);
    expect(s.snake[0]).toEqual({ x: head.x + 1, y: head.y });
    expect(s.snake).toHaveLength(3);
  });

  it('餌を食べると伸びて得点が入り、次の餌が置かれる', () => {
    const s = game();
    s.food = { x: s.snake[0].x + 1, y: s.snake[0].y };
    step(s, rng);
    expect(s.snake).toHaveLength(4);
    expect(s.score).toBe(POINTS_PER_FOOD);
    expect(s.eaten).toBe(1);
    expect(s.food).not.toBeNull();
    expect(s.snake.some((c) => c.x === s.food!.x && c.y === s.food!.y)).toBe(
      false,
    );
  });

  it('壁にぶつかるとゲームオーバー', () => {
    const s = game();
    s.snake = [
      { x: COLS - 1, y: 5 },
      { x: COLS - 2, y: 5 },
    ];
    step(s, rng);
    expect(s.status).toBe('over');
    expect(s.overReason).toBe('wall');
  });

  it('自分の体にぶつかるとゲームオーバー', () => {
    const s = game();
    s.snake = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
      { x: 4, y: 5 },
      { x: 4, y: 4 },
    ];
    s.dir = 'up';
    queueDirection(s, 'left');
    step(s, rng);
    expect(s.status).toBe('over');
    expect(s.overReason).toBe('self');
  });

  it('餌を食べないときは、空く尻尾のマスへ進める', () => {
    const s = game();
    s.snake = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
    ];
    s.dir = 'up';
    queueDirection(s, 'right');
    step(s, rng);
    expect(s.status).toBe('playing');
    expect(s.snake[0]).toEqual({ x: 6, y: 5 });
  });

  it('尻尾のマスに餌があるときは、伸びるので自滅になる', () => {
    const s = game();
    s.snake = [
      { x: 5, y: 5 },
      { x: 5, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 5 },
    ];
    s.dir = 'up';
    s.food = { x: 6, y: 5 };
    queueDirection(s, 'right');
    step(s, rng);
    expect(s.status).toBe('over');
  });

  it('盤面を埋め尽くすとクリアになる', () => {
    const s = game();
    const cells = [];
    for (let y = 0; y < ROWS; y++) {
      for (let i = 0; i < COLS; i++) {
        cells.push({ x: y % 2 === 0 ? i : COLS - 1 - i, y });
      }
    }
    // 蛇行する経路の最後の1マスだけを空け、そこに餌を置く
    const last = cells.pop()!;
    s.snake = cells.reverse();
    s.dir = last.x === COLS - 1 ? 'right' : 'left';
    s.food = last;
    // 頭の位置から最後のマスへ向かう向きを合わせる
    const head = s.snake[0];
    s.dir =
      last.x > head.x
        ? 'right'
        : last.x < head.x
          ? 'left'
          : last.y > head.y
            ? 'down'
            : 'up';
    step(s, rng);
    expect(s.status).toBe('won');
    expect(s.food).toBeNull();
  });

  it('終了後は動かない', () => {
    const s = game();
    s.status = 'over';
    const before = JSON.stringify(s);
    step(s, rng);
    expect(JSON.stringify(s)).toBe(before);
  });
});

describe('queueDirection', () => {
  it('反対向きと同じ向きは無視する', () => {
    const s = game();
    expect(queueDirection(s, 'left')).toBe(false);
    expect(queueDirection(s, 'right')).toBe(false);
    expect(s.queue).toEqual([]);
  });

  it('1歩の間に素早く2回曲がる入力を順に反映する', () => {
    const s = game();
    expect(queueDirection(s, 'up')).toBe(true);
    expect(queueDirection(s, 'left')).toBe(true);
    step(s, rng);
    expect(s.dir).toBe('up');
    step(s, rng);
    expect(s.dir).toBe('left');
  });

  it('先行入力は2つまで', () => {
    const s = game();
    queueDirection(s, 'up');
    queueDirection(s, 'left');
    expect(queueDirection(s, 'down')).toBe(false);
    expect(s.queue).toEqual(['up', 'left']);
  });

  it('先行入力した向きの反対（逆走）も無視する', () => {
    const s = game();
    queueDirection(s, 'up');
    expect(queueDirection(s, 'down')).toBe(false);
  });

  it('ゲーム終了後は入力を受け付けない', () => {
    const s = game();
    s.status = 'over';
    expect(queueDirection(s, 'up')).toBe(false);
    expect(s.queue).toEqual([]);
  });

  it('先行入力の末尾と比べて判定する（キューの途中の向きに対して90度の曲がりは通す）', () => {
    const s = game();
    expect(queueDirection(s, 'up')).toBe(true);
    // 末尾は up なので、その反対の down は拒否、left は受理
    expect(queueDirection(s, 'down')).toBe(false);
    expect(queueDirection(s, 'left')).toBe(true);
  });
});

describe('placeFood', () => {
  it('蛇のいないマスだけから選ぶ', () => {
    const snake = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      if (i !== 123) snake.push({ x: i % COLS, y: Math.floor(i / COLS) });
    }
    expect(placeFood(snake, () => 0.99)).toEqual({
      x: 123 % COLS,
      y: Math.floor(123 / COLS),
    });
  });

  it('空きマスがなければ null', () => {
    const snake = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      snake.push({ x: i % COLS, y: Math.floor(i / COLS) });
    }
    expect(placeFood(snake, rng)).toBeNull();
  });

  it('乱数が1を返しても盤内の空きマスを選ぶ（添字の境界外に出ない）', () => {
    const snake = [{ x: 0, y: 0 }];
    const food = placeFood(snake, () => 1);
    expect(food).not.toBeNull();
    expect(food!.x).toBeGreaterThanOrEqual(0);
    expect(food!.x).toBeLessThan(COLS);
    expect(food!.y).toBeGreaterThanOrEqual(0);
    expect(food!.y).toBeLessThan(ROWS);
    expect(food).not.toEqual({ x: 0, y: 0 });
  });

  it('空きが1マスだけなら、乱数に関係なくそのマスを選ぶ', () => {
    const snake = [];
    for (let i = 0; i < COLS * ROWS; i++) {
      if (i !== 0) snake.push({ x: i % COLS, y: Math.floor(i / COLS) });
    }
    expect(placeFood(snake, () => 0)).toEqual({ x: 0, y: 0 });
    expect(placeFood(snake, () => 0.999)).toEqual({ x: 0, y: 0 });
  });
});

describe('tickMs', () => {
  it('食べるほど短くなり、下限で止まる', () => {
    const s = game();
    const first = tickMs(s);
    s.eaten = 5;
    expect(tickMs(s)).toBeLessThan(first);
    s.eaten = 1000;
    expect(tickMs(s)).toBe(70);
  });

  it('開始直後の間隔は 150ms、下限は 70ms', () => {
    const s = game();
    expect(tickMs(s)).toBe(150);
    s.eaten = 20;
    expect(tickMs(s)).toBe(70);
  });
});

describe('ベストスコア', () => {
  it('不正な値は 0 として扱う', () => {
    expect(parseBest(null)).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-5')).toBe(0);
    expect(parseBest('1.5')).toBe(0);
    expect(parseBest('120')).toBe(120);
  });

  it('0 や安全な整数の範囲を超える値も 0 として扱う', () => {
    expect(parseBest('0')).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('9007199254740993')).toBe(0);
    expect(parseBest('NaN')).toBe(0);
  });

  it('保存形式は整数の文字列', () => {
    expect(serializeBest(120.7)).toBe('120');
    expect(serializeBest(-3)).toBe('0');
  });
});
