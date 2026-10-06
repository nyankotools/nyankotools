import { describe, expect, it } from 'vitest';
import {
  CAT_SIZE,
  createState,
  jump,
  step,
  WORLD_WIDTH,
  type Input,
} from './cat-runner';

const NONE: Input = { left: false, right: false };
const RIGHT: Input = { left: false, right: true };
const LEFT: Input = { left: true, right: false };

function run(s: ReturnType<typeof createState>, seconds: number, input: Input) {
  for (let t = 0; t < seconds; t += 0.01) step(s, 0.01, input);
}

describe('cat-runner', () => {
  it('左右に移動でき、画面外には出ない', () => {
    const s = createState();
    const x0 = s.x;
    step(s, 0.1, RIGHT);
    expect(s.x).toBeGreaterThan(x0);
    run(s, 1, LEFT);
    expect(s.x).toBeGreaterThanOrEqual(0);
    s.x = 0;
    step(s, 0.1, LEFT);
    expect(s.x).toBe(0);
    s.x = WORLD_WIDTH - CAT_SIZE;
    s.goalMoved = false;
    s.goalX = 9999;
    step(s, 0.1, RIGHT);
    expect(s.x).toBe(WORLD_WIDTH - CAT_SIZE);
  });

  it('ジャンプして着地し、空中での二段ジャンプはできない', () => {
    const s = createState();
    jump(s);
    step(s, 0.1, NONE);
    expect(s.y).toBeGreaterThan(0);
    const vy = s.vy;
    jump(s);
    expect(s.vy).toBe(vy);
    run(s, 1, NONE);
    expect(s.y).toBe(0);
    expect(s.over).toBe(false);
  });

  it('床のない穴に落ちるとゲームオーバー', () => {
    const s = createState();
    s.x = 125;
    run(s, 1, NONE);
    expect(s.over).toBe(true);
    expect(s.cause).toBe('pit');
  });

  it('穴は早めに跳べば隠しブロックに当たらず越えられる', () => {
    const s = createState();
    s.x = 90;
    jump(s);
    run(s, 0.8, RIGHT);
    expect(s.over).toBe(false);
    expect(s.ceilings[0].revealed).toBe(false);
    expect(s.x).toBeGreaterThan(185);
  });

  it('穴の縁ぎりぎりで跳ぶと隠しブロックに頭をぶつけて穴に落ちる', () => {
    const s = createState();
    s.x = 104;
    jump(s);
    run(s, 1, RIGHT);
    expect(s.ceilings[0].revealed).toBe(true);
    expect(s.over).toBe(true);
    expect(s.cause).toBe('pit');
    // 横に進まず穴の中へ真下に落ちる
    expect(s.x).toBeLessThan(150);
  });

  it('崩れる床：乗ると消えて落ちる', () => {
    const s = createState();
    s.x = 225;
    run(s, 0.5, RIGHT);
    expect(s.floors[2].gone).toBe(true);
    expect(s.over).toBe(true);
    expect(s.cause).toBe('pit');
  });

  it('天井ブロックは発動前は当たらず、発動後に落ちてくる', () => {
    const s = createState();
    const block = s.hazards[0];
    expect(block.triggered).toBe(false);
    s.x = 319;
    step(s, 0.01, RIGHT);
    expect(block.triggered).toBe(true);
    const y0 = block.y;
    step(s, 0.05, NONE);
    expect(block.y).toBeLessThan(y0);
    // 落下中に当たらないよう猫を離しておく
    s.x = 100;
    run(s, 1, NONE);
    expect(block.y).toBe(0);
  });

  it('天井ブロックは発動後に歩き続ければ逃げ切れる', () => {
    const s = createState();
    s.x = 319;
    run(s, 1, RIGHT);
    expect(s.cause).not.toBe('block');
  });

  it('トゲは発動すると地面から飛び出して当たる', () => {
    const s = createState();
    s.x = 410;
    run(s, 0.5, NONE);
    expect(s.over).toBe(true);
    expect(s.cause).toBe('spike');
  });

  it('ゴール旗は一度逃げ、2回目で到達するとクリア', () => {
    const s = createState();
    s.hazards = [];
    s.floors = [{ x: 0, width: 600, gone: false }];
    s.x = 490;
    step(s, 0.01, RIGHT);
    expect(s.goalMoved).toBe(true);
    expect(s.cleared).toBe(false);
    run(s, 1, RIGHT);
    expect(s.cleared).toBe(true);
  });

  it('終了後は進まない', () => {
    const s = createState();
    s.over = true;
    const x = s.x;
    step(s, 1, RIGHT);
    expect(s.x).toBe(x);
  });
});
