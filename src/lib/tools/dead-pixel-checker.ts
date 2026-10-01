export interface TestColor {
  id: string;
  hex: string;
}

/** ドット抜け・色ムラの確認に使う単色（表示順）。白・黒は輝点/黒点、RGB原色は特定色のサブピクセル不良の確認用。 */
export const TEST_COLORS: TestColor[] = [
  { id: 'white', hex: '#ffffff' },
  { id: 'black', hex: '#000000' },
  { id: 'red', hex: '#ff0000' },
  { id: 'green', hex: '#00ff00' },
  { id: 'blue', hex: '#0000ff' },
  { id: 'yellow', hex: '#ffff00' },
  { id: 'cyan', hex: '#00ffff' },
  { id: 'magenta', hex: '#ff00ff' },
  { id: 'gray', hex: '#808080' },
];

/** 色の循環インデックス。delta は負でもよく、先頭・末尾で反対側へ回り込む。 */
export function cycleIndex(
  current: number,
  delta: number,
  length: number,
): number {
  if (length <= 0) return 0;
  return (((current + delta) % length) + length) % length;
}
