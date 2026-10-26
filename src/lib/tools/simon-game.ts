/** パネルの数 */
export const PANEL_COUNT = 4;

/** パネルごとの音程（Hz）。C4・E4・G4・C5 */
export const PANEL_FREQUENCIES = [261.63, 329.63, 392.0, 523.25] as const;

/** 乱数源（0以上1未満を返す）。テストで差し替える */
export type Rng = () => number;

export type InputResult = 'wrong' | 'partial' | 'complete';

/** 0〜3のパネル番号をランダムに1つ選ぶ */
export function randomPanel(rng: Rng = Math.random): number {
  const n = Math.floor(rng() * PANEL_COUNT);
  return Math.min(Math.max(n, 0), PANEL_COUNT - 1);
}

/** シーケンスの末尾に1つ追加した新しい配列を返す（元の配列は変更しない） */
export function extendSequence(
  sequence: readonly number[],
  rng: Rng = Math.random,
): number[] {
  return [...sequence, randomPanel(rng)];
}

/** 入力済みの列がシーケンスの先頭と一致しているかを判定する */
export function checkInput(
  sequence: readonly number[],
  inputs: readonly number[],
): InputResult {
  if (inputs.length === 0 || inputs.length > sequence.length) {
    return inputs.length === 0 ? 'partial' : 'wrong';
  }
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i] !== sequence[i]) return 'wrong';
  }
  return inputs.length === sequence.length ? 'complete' : 'partial';
}

/** シーケンス再生1ステップの点灯時間（ms）。長くなるほど速くなる */
export function stepDurationMs(length: number): number {
  const base = 600;
  const reduce = Math.max(0, length - 1) * 25;
  return Math.max(250, base - reduce);
}

/** 点灯と点灯の間の消灯時間（ms） */
export function gapDurationMs(length: number): number {
  return Math.round(stepDurationMs(length) * 0.35);
}

export interface GameState {
  sequence: number[];
  /** 現在のラウンドで入力済みの列 */
  inputs: number[];
}

export function newGame(): GameState {
  return { sequence: [], inputs: [] };
}

/** 次のラウンドへ進める（シーケンスを1つ伸ばし、入力をクリア） */
export function nextRound(state: GameState, rng: Rng = Math.random): GameState {
  return { sequence: extendSequence(state.sequence, rng), inputs: [] };
}

export interface PressOutcome {
  state: GameState;
  result: InputResult;
}

/** パネル入力を1つ受け付ける。範囲外の番号は無視（result は現状維持） */
export function pressPanel(state: GameState, panel: number): PressOutcome {
  if (!Number.isInteger(panel) || panel < 0 || panel >= PANEL_COUNT) {
    return { state, result: checkInput(state.sequence, state.inputs) };
  }
  const inputs = [...state.inputs, panel];
  const result = checkInput(state.sequence, inputs);
  return { state: { ...state, inputs }, result };
}

/** 到達したラウンド数（クリアしたシーケンス長）。失敗時は直前に完走した長さ */
export function clearedRounds(state: GameState, failed: boolean): number {
  return failed
    ? Math.max(0, state.sequence.length - 1)
    : state.sequence.length;
}

export function parseBest(raw: string | null): number {
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 && n <= 9999 ? n : 0;
}

/** ベスト更新後の値と更新有無 */
export function updateBest(
  best: number,
  score: number,
): { best: number; isNew: boolean } {
  if (score > best) return { best: score, isNew: true };
  return { best, isNew: false };
}

/** キー入力（1〜4）をパネル番号へ。対象外は -1 */
export function panelFromKey(key: string): number {
  if (key.length !== 1 || key < '1' || key > '4') return -1;
  return Number(key) - 1;
}
