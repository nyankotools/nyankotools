import { describe, it, expect } from 'vitest';
import {
  ALIEN_H,
  ALIEN_W,
  BULLET_H,
  COLS,
  FIELD_MARGIN,
  INVULNERABLE_SECONDS,
  PLAYER_W,
  PLAYER_Y,
  ROWS,
  ROW_POINTS,
  SHIELD_COLS,
  SHIELD_ROWS,
  SHIELD_Y,
  START_LIVES,
  UFO_W,
  UFO_Y,
  WIDTH,
  aliveCount,
  alienPosition,
  createGame,
  parseBest,
  serializeBest,
  shieldX,
  step,
  type Input,
  type InvadersState,
} from './invaders-game';

const NONE: Input = { left: false, right: false, fire: false };
const rng = () => 0.5;

/** 他の要素が邪魔しない、敵が1体だけの状態を作る */
function lone(row: number, col: number, state = createGame(rng)) {
  state.aliens = new Array<boolean>(ROWS * COLS).fill(false);
  state.aliens[row * COLS + col] = true;
  state.fireTimer = 999;
  state.ufoTimer = 999;
  return state;
}

function run(state: InvadersState, input: Input, seconds: number) {
  for (let t = 0; t < seconds; t += 0.05) step(state, input, 0.05, rng);
}

describe('createGame', () => {
  it('敵は全員生きていて、ライフ・スコア・ステージが初期値', () => {
    const s = createGame(rng);
    expect(aliveCount(s)).toBe(ROWS * COLS);
    expect(s.lives).toBe(START_LIVES);
    expect(s.score).toBe(0);
    expect(s.level).toBe(1);
    expect(s.status).toBe('playing');
    expect(s.shields).toHaveLength(4);
  });

  it('隊列は画面の左右の余白の内側から始まる', () => {
    const s = createGame(rng);
    expect(s.fleetX).toBeGreaterThanOrEqual(FIELD_MARGIN);
    expect(s.fleetX + (COLS - 1) * 30 + ALIEN_W).toBeLessThanOrEqual(
      WIDTH - FIELD_MARGIN,
    );
  });
});

describe('自機', () => {
  it('左右に動き、画面の端で止まる', () => {
    const s = createGame(rng);
    s.fireTimer = 999;
    run(s, { ...NONE, right: true }, 5);
    expect(s.playerX).toBe(WIDTH - FIELD_MARGIN - PLAYER_W / 2);
    run(s, { ...NONE, left: true }, 5);
    expect(s.playerX).toBe(FIELD_MARGIN + PLAYER_W / 2);
  });

  it('弾は画面に1発だけ（撃ち続けても増えない）', () => {
    const s = createGame(rng);
    step(s, { ...NONE, fire: true }, 0.016, rng);
    const firstY = s.playerBullet!.y;
    step(s, { ...NONE, fire: true }, 0.016, rng);
    expect(s.playerBullet).not.toBeNull();
    expect(s.playerBullet?.y).toBeLessThan(firstY);
  });

  it('弾が画面の上へ抜けたら消え、また撃てる', () => {
    const s = lone(0, 0);
    // 敵のいない列の真上へ撃つ
    s.playerX = WIDTH - FIELD_MARGIN - PLAYER_W / 2;
    step(s, { ...NONE, fire: true }, 0.016, rng);
    run(s, NONE, 1.5);
    expect(s.playerBullet).toBeNull();
  });
});

describe('当たり判定と得点', () => {
  it('弾が敵に当たると敵が消えて行ごとの得点が入る', () => {
    for (const row of [0, 2, 4]) {
      const s = lone(row, 3);
      // 他の敵がいないので、全滅判定を避けるために別の敵を足す
      s.aliens[0] = true;
      const target = alienPosition(s, row, 3);
      s.playerX = target.x + ALIEN_W / 2;
      s.playerBullet = { x: s.playerX, y: target.y + ALIEN_H - 1 };
      step(s, NONE, 0.016, rng);
      expect(s.aliens[row * COLS + 3]).toBe(false);
      expect(s.score).toBe(ROW_POINTS[row]);
      expect(s.playerBullet).toBeNull();
    }
  });

  it('UFOに当てると得点が入ってUFOが消える', () => {
    const s = lone(4, 0);
    s.aliens[0] = true;
    s.ufo = { x: 100, dir: 1, points: 150 };
    s.playerBullet = { x: 100 + UFO_W / 2, y: UFO_Y + 4 };
    step(s, NONE, 0.016, rng);
    expect(s.score).toBe(150);
    expect(s.ufo).toBeNull();
  });

  it('敵が全員いなくなったら次のステージへ（スコア・ライフは引き継ぐ）', () => {
    const s = lone(2, 2);
    s.score = 40;
    s.lives = 2;
    const target = alienPosition(s, 2, 2);
    s.playerBullet = { x: target.x + ALIEN_W / 2, y: target.y + 2 };
    step(s, NONE, 0.016, rng);
    expect(s.level).toBe(2);
    expect(aliveCount(s)).toBe(ROWS * COLS);
    expect(s.score).toBe(40 + ROW_POINTS[2]);
    expect(s.lives).toBe(2);
  });
});

describe('隊列', () => {
  it('端に着くと一段降りて向きを変える', () => {
    const s = createGame(rng);
    s.fireTimer = 999;
    const y0 = s.fleetY;
    for (let i = 0; i < 600 && s.fleetDir === 1; i++) {
      step(s, NONE, 0.05, rng);
    }
    expect(s.fleetDir).toBe(-1);
    expect(s.fleetY).toBeGreaterThan(y0);
    const right = s.fleetX + (COLS - 1) * 30 + ALIEN_W;
    expect(right).toBeLessThanOrEqual(WIDTH - FIELD_MARGIN + 0.001);
  });

  it('数が減るほど速くなる', () => {
    const full = createGame(rng);
    full.fireTimer = 999;
    const few = lone(0, 0);
    few.aliens[1] = true;
    few.fleetX = full.fleetX;
    const x0 = full.fleetX;
    step(full, NONE, 0.05, rng);
    step(few, NONE, 0.05, rng);
    expect(few.fleetX - x0).toBeGreaterThan(full.fleetX - x0);
  });

  it('自機の高さまで降りてきたらゲームオーバー（invaded）', () => {
    const s = lone(0, 0);
    s.fleetY = PLAYER_Y - ALIEN_H + 1;
    step(s, NONE, 0.016, rng);
    expect(s.status).toBe('over');
    expect(s.overReason).toBe('invaded');
  });

  it('隊列が触れたトーチカの壁は壊れる', () => {
    const s = lone(0, 0);
    s.fleetX = shieldX(0);
    s.fleetY = SHIELD_Y;
    const before = s.shields[0].filter(Boolean).length;
    s.fleetDir = 1;
    step(s, NONE, 0.016, rng);
    expect(s.shields[0].filter(Boolean).length).toBeLessThan(before);
  });
});

describe('敵の弾', () => {
  function bulletAtPlayer(s: InvadersState) {
    s.enemyBullets = [{ x: s.playerX, y: PLAYER_Y - 2 }];
  }

  it('当たるとライフが減り、無敵時間に入って弾が消える', () => {
    const s = lone(0, 0);
    bulletAtPlayer(s);
    step(s, NONE, 0.016, rng);
    expect(s.lives).toBe(START_LIVES - 1);
    expect(s.invulnerable).toBeGreaterThan(INVULNERABLE_SECONDS - 0.1);
    expect(s.enemyBullets).toHaveLength(0);
    expect(s.status).toBe('playing');
  });

  it('無敵時間中は当たってもやられない', () => {
    const s = lone(0, 0);
    s.invulnerable = 1;
    bulletAtPlayer(s);
    step(s, NONE, 0.016, rng);
    expect(s.lives).toBe(START_LIVES);
  });

  it('最後のライフを失うとゲームオーバー（lives）', () => {
    const s = lone(0, 0);
    s.lives = 1;
    bulletAtPlayer(s);
    step(s, NONE, 0.016, rng);
    expect(s.lives).toBe(0);
    expect(s.status).toBe('over');
    expect(s.overReason).toBe('lives');
  });

  it('トーチカの壁に当たると弾は消え、壁が壊れる', () => {
    const s = lone(0, 0);
    const col = 2;
    const x = shieldX(0) + col * 4 + 2;
    s.enemyBullets = [{ x, y: SHIELD_Y - BULLET_H + 1 }];
    const before = s.shields[0].filter(Boolean).length;
    step(s, NONE, 0.016, rng);
    expect(s.enemyBullets).toHaveLength(0);
    expect(s.shields[0].filter(Boolean).length).toBeLessThan(before);
    expect(SHIELD_COLS * SHIELD_ROWS).toBe(s.shields[0].length);
  });

  it('同時に飛ぶ弾は3発まで', () => {
    const s = createGame(rng);
    s.invulnerable = 999;
    for (let i = 0; i < 400; i++) {
      s.fireTimer = 0;
      step(s, NONE, 0.001, rng);
      expect(s.enemyBullets.length).toBeLessThanOrEqual(3);
      if (s.status === 'over') break;
    }
  });
});

describe('UFO', () => {
  it('一定時間たつと画面の端から現れ、横切ると消える', () => {
    const s = lone(4, 0);
    s.aliens[1] = true;
    s.ufoTimer = 0.01;
    step(s, NONE, 0.05, rng);
    expect(s.ufo).not.toBeNull();
    for (let i = 0; i < 200 && s.ufo; i++) step(s, NONE, 0.05, rng);
    expect(s.ufo).toBeNull();
  });
});

describe('step', () => {
  it('ゲームオーバー後は何も進まない', () => {
    const s = lone(0, 0);
    s.status = 'over';
    const x = s.fleetX;
    step(s, { ...NONE, right: true }, 0.1, rng);
    expect(s.fleetX).toBe(x);
  });

  it('経過時間が0や負なら何も進まない', () => {
    const s = lone(0, 0);
    const before = JSON.stringify(s);
    step(s, { ...NONE, right: true, fire: true }, 0, rng);
    step(s, { ...NONE, right: true }, -1, rng);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('長い経過時間でも弾が敵をすり抜けない', () => {
    const s = lone(0, 0);
    s.aliens[COLS * ROWS - 1] = true;
    const target = alienPosition(s, 0, 0);
    s.playerBullet = { x: target.x + ALIEN_W / 2, y: target.y + ALIEN_H + 30 };
    step(s, NONE, 10, rng);
    // 1フレームに許す時間を超える dt を渡しても、敵に当たるまでは進む
    expect(s.aliens[0]).toBe(false);
    expect(s.score).toBeGreaterThan(0);
  });
});

describe('ベスト記録', () => {
  it('正の整数だけを読み、不正な値は0', () => {
    expect(parseBest('1200')).toBe(1200);
    expect(parseBest(null)).toBe(0);
    expect(parseBest('abc')).toBe(0);
    expect(parseBest('-5')).toBe(0);
    expect(parseBest('1.5')).toBe(0);
    expect(parseBest('')).toBe(0);
    expect(parseBest('0')).toBe(0);
  });

  it('保存用の文字列に変換できる', () => {
    expect(serializeBest(420)).toBe('420');
    expect(serializeBest(-3)).toBe('0');
  });
});
