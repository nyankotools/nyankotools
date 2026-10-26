import { secureRandomInt, shuffle } from '../random';
import type { RandomInt } from '../random';

export type { RandomInt };

export const SUITS = ['S', 'H', 'D', 'C'] as const;
export type Suit = (typeof SUITS)[number];
export const RANKS = [
  'A',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
] as const;
export type Rank = (typeof RANKS)[number];

export interface Card {
  rank: Rank;
  suit: Suit;
}

export const DECKS = 6;
/** 山札がこの枚数を下回ったら、次のラウンド開始前にシャッフルし直す */
export const RESHUFFLE_BELOW = 52;
export const STARTING_CHIPS = 1000;
export const BET_OPTIONS: readonly number[] = [10, 50, 100, 500];
export const DEFAULT_BET = 50;
export const DEALER_STAND = 17;

export function cardValue(card: Card): number {
  if (card.rank === 'A') return 11;
  if (card.rank === 'J' || card.rank === 'Q' || card.rank === 'K') return 10;
  return Number(card.rank);
}

export interface HandValue {
  total: number;
  /** Aを11として数えている（ソフトハンド） */
  soft: boolean;
}

export function handValue(cards: readonly Card[]): HandValue {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    total += cardValue(card);
    if (card.rank === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return { total, soft: aces > 0 };
}

export function isBlackjack(cards: readonly Card[]): boolean {
  return cards.length === 2 && handValue(cards).total === 21;
}

export function isBust(cards: readonly Card[]): boolean {
  return handValue(cards).total > 21;
}

/** 6デッキ（既定）を安全な乱数でシャッフルした山札。末尾から引く */
export function createShoe(
  decks: number = DECKS,
  randomInt: RandomInt = secureRandomInt,
): Card[] {
  const cards: Card[] = [];
  for (let d = 0; d < decks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) cards.push({ rank, suit });
    }
  }
  return shuffle(cards, randomInt);
}

export type Phase = 'betting' | 'player' | 'done';
export type Outcome =
  'blackjack' | 'win' | 'dealerBust' | 'push' | 'lose' | 'bust';

export interface GameState {
  /** 手持ちチップ（ベット済みの分は含まない） */
  chips: number;
  /** 現在のラウンドのベット（ダブルダウン後は2倍） */
  bet: number;
  shoe: readonly Card[];
  player: readonly Card[];
  dealer: readonly Card[];
  phase: Phase;
  outcome: Outcome | null;
  /** 終局時に手元へ戻ったチップ（ベット込み） */
  payout: number;
  doubled: boolean;
}

export function initialState(
  chips: number = STARTING_CHIPS,
  shoe: readonly Card[] = [],
): GameState {
  return {
    chips,
    bet: 0,
    shoe,
    player: [],
    dealer: [],
    phase: 'betting',
    outcome: null,
    payout: 0,
    doubled: false,
  };
}

/** チップが尽きて続行できない状態 */
export function isBroke(state: GameState): boolean {
  return state.phase !== 'player' && state.chips < 1;
}

/** 選べるベット額。最小額に満たない端数のチップしかないときは、残り全部 */
export function betOptions(chips: number): number[] {
  if (!Number.isInteger(chips) || chips < 1) return [];
  const options = BET_OPTIONS.filter((b) => b <= chips);
  return options.length > 0 ? [...options] : [chips];
}

/** 持ちチップに収まる範囲で、希望のベット額に最も近い選択肢を返す */
export function clampBet(chips: number, wanted: number): number {
  const options = betOptions(chips);
  if (options.length === 0) return 0;
  let best = options[0];
  for (const o of options) {
    if (o <= wanted) best = o;
  }
  return best;
}

function draw(shoe: readonly Card[]): [Card, Card[]] {
  const rest = shoe.slice();
  const card = rest.pop();
  if (!card) throw new Error('shoe is empty');
  return [card, rest];
}

function payoutFor(outcome: Outcome, bet: number): number {
  switch (outcome) {
    case 'blackjack':
      return Math.floor(bet * 2.5);
    case 'win':
    case 'dealerBust':
      return bet * 2;
    case 'push':
      return bet;
    default:
      return 0;
  }
}

function settle(state: GameState, outcome: Outcome): GameState {
  const payout = payoutFor(outcome, state.bet);
  return {
    ...state,
    phase: 'done',
    outcome,
    payout,
    chips: state.chips + payout,
  };
}

/** ラウンドを始める。ベットできない（額が不正・チップ不足・プレイ中）ときは同じ state を返す */
export function deal(
  state: GameState,
  bet: number,
  randomInt: RandomInt = secureRandomInt,
): GameState {
  if (state.phase === 'player') return state;
  if (!Number.isInteger(bet) || bet < 1 || bet > state.chips) return state;
  let shoe = state.shoe;
  if (shoe.length < RESHUFFLE_BELOW) shoe = createShoe(DECKS, randomInt);
  const pile = shoe.slice();
  const player: Card[] = [];
  const dealer: Card[] = [];
  // 配る順: プレイヤー、ディーラー（表）、プレイヤー、ディーラー（裏）
  for (const hand of [player, dealer, player, dealer]) {
    const card = pile.pop();
    if (!card) throw new Error('shoe is empty');
    hand.push(card);
  }
  const started: GameState = {
    chips: state.chips - bet,
    bet,
    shoe: pile,
    player,
    dealer,
    phase: 'player',
    outcome: null,
    payout: 0,
    doubled: false,
  };
  const playerBj = isBlackjack(player);
  const dealerBj = isBlackjack(dealer);
  if (playerBj && dealerBj) return settle(started, 'push');
  if (playerBj) return settle(started, 'blackjack');
  if (dealerBj) return settle(started, 'lose');
  return started;
}

/** ディーラーが17以上になるまで引き、結果を確定する（ソフト17でもスタンド） */
function dealerPlays(state: GameState): GameState {
  let shoe = state.shoe;
  let dealer = state.dealer;
  while (handValue(dealer).total < DEALER_STAND) {
    const [card, rest] = draw(shoe);
    dealer = [...dealer, card];
    shoe = rest;
  }
  const next = { ...state, shoe, dealer };
  const p = handValue(next.player).total;
  const d = handValue(dealer).total;
  if (d > 21) return settle(next, 'dealerBust');
  if (p > d) return settle(next, 'win');
  if (p < d) return settle(next, 'lose');
  return settle(next, 'push');
}

export function hit(state: GameState): GameState {
  if (state.phase !== 'player') return state;
  const [card, shoe] = draw(state.shoe);
  const next = { ...state, shoe, player: [...state.player, card] };
  const total = handValue(next.player).total;
  if (total > 21) return settle(next, 'bust');
  if (total === 21) return dealerPlays(next);
  return next;
}

export function stand(state: GameState): GameState {
  if (state.phase !== 'player') return state;
  return dealerPlays(state);
}

/** 最初の2枚の時点で、同額を追加できるときだけ可能 */
export function canDouble(state: GameState): boolean {
  return (
    state.phase === 'player' &&
    state.player.length === 2 &&
    state.chips >= state.bet
  );
}

/** ダブルダウン: ベットを2倍にして1枚だけ引き、スタンドする */
export function doubleDown(state: GameState): GameState {
  if (!canDouble(state)) return state;
  const [card, shoe] = draw(state.shoe);
  const next: GameState = {
    ...state,
    chips: state.chips - state.bet,
    bet: state.bet * 2,
    doubled: true,
    shoe,
    player: [...state.player, card],
  };
  if (isBust(next.player)) return settle(next, 'bust');
  return dealerPlays(next);
}

/** 次のラウンド前の状態（山札と持ちチップは引き継ぐ） */
export function nextRound(state: GameState): GameState {
  if (state.phase === 'player') return state;
  return initialState(state.chips, state.shoe);
}

/** localStorage 用: 保存データ { chips, best } */
export interface Save {
  chips: number;
  best: number;
}

export function serializeSave(save: Save): string {
  return JSON.stringify(save);
}

/** 壊れた値・範囲外の値は無視して初期値に戻す */
export function parseSave(raw: string | null): Save {
  const fallback: Save = { chips: STARTING_CHIPS, best: STARTING_CHIPS };
  if (!raw) return fallback;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== 'object' || data === null) return fallback;
    const { chips, best } = data as Record<string, unknown>;
    const ok = (v: unknown): v is number =>
      typeof v === 'number' &&
      Number.isInteger(v) &&
      v >= 0 &&
      v <= 1_000_000_000;
    if (!ok(chips)) return fallback;
    // 0チップで保存されていたら、リセット扱いで初期チップに戻す
    return {
      chips: chips < 1 ? STARTING_CHIPS : chips,
      best: Math.max(ok(best) ? best : 0, chips, STARTING_CHIPS),
    };
  } catch {
    return fallback;
  }
}
