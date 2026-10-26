import { describe, expect, it } from 'vitest';
import {
  MAX_OFFLINE_MS,
  buyUpgrade,
  canBuy,
  clickCat,
  clickPower,
  createState,
  formatNumber,
  parseState,
  perSecond,
  serializeState,
  tick,
  upgradeCost,
} from './cat-clicker';

describe('click and upgrades', () => {
  it('クリックで加算される', () => {
    const s = clickCat(clickCat(createState(0)));
    expect(s.points).toBe(2);
    expect(s.total).toBe(2);
    expect(s.clicks).toBe(2);
  });

  it('足りないと買えず、買うと消費してレベルが上がる', () => {
    let s = createState(0);
    expect(canBuy(s, 'paw')).toBe(false);
    expect(buyUpgrade(s, 'paw')).toBeNull();
    s = { ...s, points: 25 };
    const b = buyUpgrade(s, 'paw')!;
    expect(b.points).toBe(5);
    expect(b.levels.paw).toBe(1);
    expect(clickPower(b.levels)).toBe(2);
  });

  it('コストはレベルで増える', () => {
    expect(upgradeCost('paw', 0)).toBe(20);
    expect(upgradeCost('paw', 1)).toBe(23);
    expect(upgradeCost('paw', 5)).toBeGreaterThan(upgradeCost('paw', 4));
  });

  it('毎秒の加算量', () => {
    const s = createState(0);
    expect(perSecond(s.levels)).toBe(0);
    expect(perSecond({ ...s.levels, kitten: 2, yarn: 1 })).toBe(7);
  });
});

describe('tick', () => {
  const base = {
    ...createState(1000),
    levels: { ...createState(0).levels, kitten: 2 },
  };

  it('経過時間から加算する', () => {
    const r = tick(base, 1000 + 5000);
    expect(r.gained).toBe(10);
    expect(r.state.points).toBe(10);
    expect(r.state.lastAt).toBe(6000);
    expect(r.capped).toBe(false);
  });

  it('放置の上限を超えたぶんは切り捨てる', () => {
    const r = tick(base, 1000 + MAX_OFFLINE_MS * 3);
    expect(r.capped).toBe(true);
    expect(r.elapsedMs).toBe(MAX_OFFLINE_MS);
    expect(r.gained).toBe(2 * (MAX_OFFLINE_MS / 1000));
  });

  it('時計が戻っても加算せず基準時刻だけ更新する', () => {
    const r = tick(base, 10);
    expect(r.gained).toBe(0);
    expect(r.state.lastAt).toBe(10);
    expect(tick(base, NaN).gained).toBe(0);
  });
});

describe('save data', () => {
  it('往復できる', () => {
    let s = { ...createState(123), points: 50 };
    s = clickCat(s);
    const back = parseState(serializeState(s))!;
    expect(back).toEqual(s);
  });

  it('不正なデータは null', () => {
    expect(parseState(null)).toBeNull();
    expect(parseState('')).toBeNull();
    expect(parseState('{bad')).toBeNull();
    expect(parseState('[]')).toBeNull();
    expect(parseState('null')).toBeNull();
    const ok = JSON.parse(serializeState(createState(1)));
    expect(parseState(JSON.stringify({ ...ok, v: 99 }))).toBeNull();
    expect(parseState(JSON.stringify({ ...ok, points: -1 }))).toBeNull();
    expect(parseState(JSON.stringify({ ...ok, points: '5' }))).toBeNull();
    expect(parseState(JSON.stringify({ ...ok, points: 1e301 }))).toBeNull();
    expect(
      parseState(JSON.stringify({ ...ok, levels: { paw: 1.5 } })),
    ).toBeNull();
    expect(
      parseState(JSON.stringify({ ...ok, levels: { paw: -1 } })),
    ).toBeNull();
  });

  it('未知のレベルキーは無視し、欠けたキーは0になる', () => {
    const ok = JSON.parse(serializeState(createState(1)));
    const s = parseState(JSON.stringify({ ...ok, levels: { paw: 2, x: 9 } }))!;
    expect(s.levels.paw).toBe(2);
    expect(s.levels.boat).toBe(0);
  });
});

describe('formatNumber', () => {
  it('読みやすく表記する', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(12.34)).toBe('12.3');
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1234)).toBe('1,234');
    expect(formatNumber(1_500_000)).toBe('1.50M');
    expect(formatNumber(2.5e9)).toBe('2.50B');
    expect(formatNumber(999_999_999)).toBe('1.00B');
    expect(formatNumber(1e40)).toBe('1.00e40');
    expect(formatNumber(NaN)).toBe('0');
    expect(formatNumber(-5)).toBe('0');
  });
});
