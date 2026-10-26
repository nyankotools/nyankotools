import { describe, it, expect } from 'vitest';
import {
  BET_OPTIONS,
  DECKS,
  RESHUFFLE_BELOW,
  STARTING_CHIPS,
  betOptions,
  canDouble,
  clampBet,
  createShoe,
  deal,
  doubleDown,
  handValue,
  hit,
  initialState,
  isBlackjack,
  isBroke,
  nextRound,
  parseSave,
  serializeSave,
  stand,
  type Card,
  type GameState,
  type Rank,
} from './blackjack';

const c = (rank: Rank, suit: Card['suit'] = 'S'): Card => ({ rank, suit });

/**
 * 引く順（P1, D1(表), P2, D2(裏), 以降のヒット…）に並べた山札を作る。
 * 山札は末尾から引くので逆順にし、52枚以上になるよう先頭を埋める。
 */
function stacked(order: Rank[]): Card[] {
  const filler = Array.from({ length: 60 }, () => c('2', 'C'));
  return [...filler, ...order.map((r) => c(r)).reverse()];
}

function start(order: Rank[], bet = 100, chips = 1000): GameState {
  return deal(initialState(chips, stacked(order)), bet);
}

describe('handValue', () => {
  it('Aは11、バーストしそうなら1として数える', () => {
    expect(handValue([c('A'), c('6')])).toEqual({ total: 17, soft: true });
    expect(handValue([c('A'), c('6'), c('10')])).toEqual({
      total: 17,
      soft: false,
    });
    expect(handValue([c('A'), c('A'), c('9')])).toEqual({
      total: 21,
      soft: true,
    });
    expect(handValue([c('K'), c('Q'), c('2')]).total).toBe(22);
  });

  it('ブラックジャックは最初の2枚の21だけ', () => {
    expect(isBlackjack([c('A'), c('K')])).toBe(true);
    expect(isBlackjack([c('7'), c('7'), c('7')])).toBe(false);
  });
});

describe('createShoe', () => {
  it('6デッキ312枚で、各カードが6枚ずつある', () => {
    const shoe = createShoe(DECKS, (max) => max - 1);
    expect(shoe).toHaveLength(52 * DECKS);
    const count = shoe.filter((x) => x.rank === 'A' && x.suit === 'H').length;
    expect(count).toBe(DECKS);
  });
});

describe('deal', () => {
  it('ベット分を引き、2枚ずつ配る', () => {
    const s = start(['10', '9', '7', '8']);
    expect(s.phase).toBe('player');
    expect(s.chips).toBe(900);
    expect(s.bet).toBe(100);
    expect(s.player.map((x) => x.rank)).toEqual(['10', '7']);
    expect(s.dealer.map((x) => x.rank)).toEqual(['9', '8']);
  });

  it('不正なベットは無視する', () => {
    const base = initialState(100, stacked(['2', '3', '4', '5']));
    expect(deal(base, 0)).toBe(base);
    expect(deal(base, 101)).toBe(base);
    expect(deal(base, 1.5)).toBe(base);
    expect(deal(base, -10)).toBe(base);
  });

  it('プレイ中は新しく配れない', () => {
    const s = start(['10', '9', '7', '8']);
    expect(deal(s, 10)).toBe(s);
  });

  it('プレイヤーのブラックジャックは3:2で払い戻す', () => {
    const s = start(['A', '9', 'K', '8'], 100);
    expect(s.phase).toBe('done');
    expect(s.outcome).toBe('blackjack');
    expect(s.payout).toBe(250);
    expect(s.chips).toBe(1150);
  });

  it('ディーラーだけブラックジャックなら負け、両方なら引き分け', () => {
    const lose = start(['10', 'A', '9', 'K'], 100);
    expect(lose.outcome).toBe('lose');
    expect(lose.chips).toBe(900);
    const push = start(['A', 'A', 'K', 'K'], 100);
    expect(push.outcome).toBe('push');
    expect(push.chips).toBe(1000);
  });

  it('山札が少ないときは新しくシャッフルする', () => {
    const low = initialState(1000, [c('2'), c('3')]);
    const s = deal(low, 10);
    expect(s.shoe.length).toBeGreaterThan(RESHUFFLE_BELOW);
    expect(s.shoe.length).toBe(52 * DECKS - 4);
  });

  it('山札がちょうど52枚ならシャッフルせず、51枚以下なら引き直す', () => {
    const exact = initialState(
      1000,
      Array.from({ length: 52 }, () => c('2')),
    );
    expect(deal(exact, 10).shoe).toHaveLength(52 - 4);
    const under = initialState(
      1000,
      Array.from({ length: 51 }, () => c('2')),
    );
    expect(deal(under, 10).shoe).toHaveLength(52 * DECKS - 4);
  });

  it('端数のチップ（7枚）でブラックジャックなら3:2の払い戻しは切り捨て', () => {
    const s = start(['A', '9', 'K', '8'], 7, 7);
    expect(s.outcome).toBe('blackjack');
    expect(s.payout).toBe(17);
    expect(s.chips).toBe(17);
  });
});

describe('stand とディーラーの動き', () => {
  it('ディーラーは16まで引き、17でスタンドする', () => {
    // P: 10+8=18, D: 10+6=16 -> 引いて 5 で 21? 例: 引く札 A -> 17
    const s = stand(start(['10', '10', '8', '6', 'A']));
    expect(s.dealer.map((x) => x.rank)).toEqual(['10', '6', 'A']);
    expect(handValue(s.dealer).total).toBe(17);
    expect(s.outcome).toBe('win');
    expect(s.chips).toBe(1100);
  });

  it('ソフト17でもスタンドする', () => {
    // D: A+6 = ソフト17
    const s = stand(start(['10', 'A', '7', '6', '5']));
    expect(s.dealer).toHaveLength(2);
    expect(s.outcome).toBe('push');
    expect(s.chips).toBe(1000);
  });

  it('ディーラーがバーストしたら勝ち', () => {
    const s = stand(start(['10', '10', '7', '6', 'K']));
    expect(s.outcome).toBe('dealerBust');
    expect(s.payout).toBe(200);
  });

  it('プレイヤーが低ければ負け', () => {
    const s = stand(start(['10', '10', '6', '8']));
    expect(s.outcome).toBe('lose');
    expect(s.chips).toBe(900);
  });

  it('終局後・ベット前は何も起きない', () => {
    const done = stand(start(['10', '10', '6', '8']));
    expect(stand(done)).toBe(done);
    expect(hit(done)).toBe(done);
    const idle = initialState();
    expect(hit(idle)).toBe(idle);
    expect(stand(idle)).toBe(idle);
  });
});

describe('hit', () => {
  it('バーストしたら即負けでディーラーは引かない', () => {
    const s = hit(start(['10', '9', '6', '8', 'K']));
    expect(s.outcome).toBe('bust');
    expect(s.dealer).toHaveLength(2);
    expect(s.chips).toBe(900);
  });

  it('21になったら自動でスタンドする', () => {
    // P: 5+6=11 -> 10 で 21。D: 10+7=17
    const s = hit(start(['5', '10', '6', '7', '10']));
    expect(s.phase).toBe('done');
    expect(s.outcome).toBe('win');
  });

  it('21未満ならプレイを続けられる', () => {
    const s = hit(start(['2', '10', '3', '7', '4']));
    expect(s.phase).toBe('player');
    expect(s.player).toHaveLength(3);
  });
});

describe('doubleDown', () => {
  it('ベットを2倍にして1枚だけ引き、勝てば2倍の払い戻し', () => {
    // P: 5+6=11, 引く 10 -> 21。D: 10+7=17
    const s0 = start(['5', '10', '6', '7', '10'], 100);
    expect(canDouble(s0)).toBe(true);
    const s = doubleDown(s0);
    expect(s.doubled).toBe(true);
    expect(s.bet).toBe(200);
    expect(s.outcome).toBe('win');
    expect(s.payout).toBe(400);
    expect(s.chips).toBe(1200);
  });

  it('負けたら2倍分を失う', () => {
    const s = doubleDown(start(['5', '10', '6', '9', '2'], 100));
    expect(s.outcome).toBe('lose');
    expect(s.chips).toBe(800);
  });

  it('バーストしても2倍分を失う', () => {
    const s = doubleDown(start(['10', '9', '6', '8', 'K'], 100));
    expect(s.outcome).toBe('bust');
    expect(s.chips).toBe(800);
  });

  it('チップが足りない・3枚目以降は不可', () => {
    const poor = start(['5', '10', '6', '7', '2'], 600);
    expect(canDouble(poor)).toBe(false);
    expect(doubleDown(poor)).toBe(poor);
    const hitOnce = hit(start(['2', '10', '3', '7', '2']));
    expect(canDouble(hitOnce)).toBe(false);
  });
});

describe('チップとリセット', () => {
  it('全額を賭けて負けるとチップ0で、続行できない', () => {
    const s = stand(start(['10', '10', '6', '8'], 1000));
    expect(s.chips).toBe(0);
    expect(isBroke(s)).toBe(true);
    expect(isBroke(initialState(500))).toBe(false);
  });

  it('nextRound は山札とチップを引き継ぐ', () => {
    const done = stand(start(['10', '10', '6', '8']));
    const next = nextRound(done);
    expect(next.phase).toBe('betting');
    expect(next.chips).toBe(900);
    expect(next.shoe).toBe(done.shoe);
    expect(next.player).toEqual([]);
    const playing = start(['2', '10', '3', '7']);
    expect(nextRound(playing)).toBe(playing);
  });

  it('betOptions は持ちチップに収まるものだけ', () => {
    expect(betOptions(1000)).toEqual([...BET_OPTIONS]);
    expect(betOptions(60)).toEqual([10, 50]);
    expect(betOptions(5)).toEqual([5]);
    expect(betOptions(0)).toEqual([]);
    expect(clampBet(60, 500)).toBe(50);
    expect(clampBet(5, 50)).toBe(5);
    expect(clampBet(0, 50)).toBe(0);
    expect(clampBet(1000, 1)).toBe(10);
  });
});

describe('保存データ', () => {
  it('往復できる', () => {
    expect(parseSave(serializeSave({ chips: 1200, best: 1500 }))).toEqual({
      chips: 1200,
      best: 1500,
    });
  });

  it('壊れた値・範囲外は初期値に戻す', () => {
    const initial = { chips: STARTING_CHIPS, best: STARTING_CHIPS };
    expect(parseSave(null)).toEqual(initial);
    expect(parseSave('not json')).toEqual(initial);
    expect(parseSave('null')).toEqual(initial);
    expect(parseSave('{"chips":"abc"}')).toEqual(initial);
    expect(parseSave('{"chips":-5}')).toEqual(initial);
    expect(parseSave('{"chips":1.5}')).toEqual(initial);
  });

  it('チップ0の保存は初期チップに戻す', () => {
    expect(parseSave('{"chips":0,"best":300}').chips).toBe(STARTING_CHIPS);
  });

  it('best が不正でも chips 以上の値に補正される', () => {
    expect(parseSave('{"chips":500,"best":"x"}')).toEqual({
      chips: 500,
      best: STARTING_CHIPS,
    });
    expect(parseSave('{"chips":1500,"best":900}').best).toBe(1500);
  });
});
