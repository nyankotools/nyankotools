/** Standard Gamepad mapping（mapping === 'standard'）のボタン名。index は Gamepad.buttons の添字。 */
export const STANDARD_BUTTON_NAMES = [
  'A / ✕',
  'B / ○',
  'X / □',
  'Y / △',
  'LB / L1',
  'RB / R1',
  'LT / L2',
  'RT / R2',
  'Back / Share',
  'Start / Options',
  'L3',
  'R3',
  '↑',
  '↓',
  '←',
  '→',
  'Home / PS',
] as const;

/** ボタンの表示名。standard 配置なら名前付き、それ以外は番号。 */
export function buttonLabel(index: number, mapping: string): string {
  if (mapping === 'standard' && index < STANDARD_BUTTON_NAMES.length) {
    return STANDARD_BUTTON_NAMES[index];
  }
  return `#${index}`;
}

/** デッドゾーン内の入力を 0 にする。範囲外は -1〜1 に収める。 */
export function applyDeadzone(value: number, deadzone: number): number {
  const v = Math.max(-1, Math.min(1, value));
  return Math.abs(v) < deadzone ? 0 : v;
}

/** 2軸（スティック）の傾き。斜めで1を超える値は1に収める。 */
export function stickMagnitude(x: number, y: number): number {
  return Math.min(1, Math.hypot(x, y));
}

/** スティックを離した状態で中心からずれていないか（ドリフト）。 */
export function isDrifting(x: number, y: number, threshold: number): boolean {
  return stickMagnitude(x, y) > threshold;
}

/** 軸の値を小数2桁の文字列にする（-0.00 は 0.00 にそろえる）。 */
export function formatAxis(value: number): string {
  const text = value.toFixed(2);
  return text === '-0.00' ? '0.00' : text;
}

/** ボタン値（0〜1）を百分率の整数にする。 */
export function buttonPercent(value: number): number {
  return Math.round(Math.max(0, Math.min(1, value)) * 100);
}

/** 軸の配列を2本ずつスティックにまとめる（奇数本の末尾は1軸だけのスティック）。 */
export function groupAxes(axes: readonly number[]): [number, number?][] {
  const sticks: [number, number?][] = [];
  for (let i = 0; i < axes.length; i += 2) sticks.push([axes[i], axes[i + 1]]);
  return sticks;
}
