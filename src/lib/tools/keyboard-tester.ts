/** キー配列の1キー。code は KeyboardEvent.code（配列・言語に依存しない物理キー名）。 */
export interface KeyDef {
  code: string;
  label: string;
  /** 幅（標準キー=1）。main/nav の行でのみ使う */
  w?: number;
  /** テンキーの縦横の占有マス数 */
  colSpan?: 2;
  rowSpan?: 2;
}

/** キー間の空き（キーボード上の隙間）。w は幅（標準キー=1） */
export interface SpacerDef {
  spacer: number;
}

export type KeyOrSpacer = KeyDef | SpacerDef;

export function isSpacer(item: KeyOrSpacer): item is SpacerDef {
  return 'spacer' in item;
}

function k(code: string, label: string, w = 1): KeyDef {
  return { code, label, w };
}

function letters(chars: string): KeyDef[] {
  return [...chars].map((c) => k(`Key${c}`, c));
}

function fKeys(from: number, to: number): KeyDef[] {
  const keys: KeyDef[] = [];
  for (let n = from; n <= to; n++) keys.push(k(`F${n}`, `F${n}`));
  return keys;
}

/** フルサイズ（ANSI配列）の物理キー配置。JIS固有キーなど配置にないキーは押下時に「その他のキー」へ出す。 */
export const KEYBOARD_LAYOUT: {
  main: KeyOrSpacer[][];
  nav: KeyOrSpacer[][];
  numpad: KeyDef[];
} = {
  main: [
    [
      k('Escape', 'Esc'),
      { spacer: 1 },
      ...fKeys(1, 4),
      { spacer: 0.5 },
      ...fKeys(5, 8),
      { spacer: 0.5 },
      ...fKeys(9, 12),
    ],
    [
      k('Backquote', '`'),
      ...[...'1234567890'].map((d) => k(`Digit${d}`, d)),
      k('Minus', '-'),
      k('Equal', '='),
      k('Backspace', 'Backspace', 2),
    ],
    [
      k('Tab', 'Tab', 1.5),
      ...letters('QWERTYUIOP'),
      k('BracketLeft', '['),
      k('BracketRight', ']'),
      k('Backslash', '\\', 1.5),
    ],
    [
      k('CapsLock', 'Caps', 1.75),
      ...letters('ASDFGHJKL'),
      k('Semicolon', ';'),
      k('Quote', "'"),
      k('Enter', 'Enter', 2.25),
    ],
    [
      k('ShiftLeft', 'Shift', 2.25),
      ...letters('ZXCVBNM'),
      k('Comma', ','),
      k('Period', '.'),
      k('Slash', '/'),
      k('ShiftRight', 'Shift', 2.75),
    ],
    [
      k('ControlLeft', 'Ctrl', 1.25),
      k('MetaLeft', 'Win', 1.25),
      k('AltLeft', 'Alt', 1.25),
      k('Space', 'Space', 6.25),
      k('AltRight', 'Alt', 1.25),
      k('MetaRight', 'Win', 1.25),
      k('ContextMenu', 'Menu', 1.25),
      k('ControlRight', 'Ctrl', 1.25),
    ],
  ],
  nav: [
    [k('PrintScreen', 'PrtSc'), k('ScrollLock', 'ScrLk'), k('Pause', 'Pause')],
    [k('Insert', 'Ins'), k('Home', 'Home'), k('PageUp', 'PgUp')],
    [k('Delete', 'Del'), k('End', 'End'), k('PageDown', 'PgDn')],
    [],
    [{ spacer: 1 }, k('ArrowUp', '↑')],
    [k('ArrowLeft', '←'), k('ArrowDown', '↓'), k('ArrowRight', '→')],
  ],
  numpad: [
    { code: 'NumLock', label: 'Num' },
    { code: 'NumpadDivide', label: '/' },
    { code: 'NumpadMultiply', label: '*' },
    { code: 'NumpadSubtract', label: '-' },
    { code: 'Numpad7', label: '7' },
    { code: 'Numpad8', label: '8' },
    { code: 'Numpad9', label: '9' },
    { code: 'NumpadAdd', label: '+', rowSpan: 2 },
    { code: 'Numpad4', label: '4' },
    { code: 'Numpad5', label: '5' },
    { code: 'Numpad6', label: '6' },
    { code: 'Numpad1', label: '1' },
    { code: 'Numpad2', label: '2' },
    { code: 'Numpad3', label: '3' },
    { code: 'NumpadEnter', label: 'Enter', rowSpan: 2 },
    { code: 'Numpad0', label: '0', colSpan: 2 },
    { code: 'NumpadDecimal', label: '.' },
  ],
};

/** 配置に含まれる全キーの code（重複なし）。 */
export function layoutCodes(): string[] {
  const codes: string[] = [];
  const rows = [...KEYBOARD_LAYOUT.main, ...KEYBOARD_LAYOUT.nav];
  for (const row of rows) {
    for (const item of row) if (!isSpacer(item)) codes.push(item.code);
  }
  for (const key of KEYBOARD_LAYOUT.numpad) codes.push(key.code);
  return codes;
}

const LAYOUT_CODE_SET = new Set(layoutCodes());

export function isLayoutKey(code: string): boolean {
  return LAYOUT_CODE_SET.has(code);
}

/** 押下済みの code のうち、配置に含まれるキーの数と配置全体の数。 */
export function countCoverage(pressed: Iterable<string>): {
  pressed: number;
  total: number;
} {
  let count = 0;
  for (const code of new Set(pressed)) if (LAYOUT_CODE_SET.has(code)) count++;
  return { pressed: count, total: LAYOUT_CODE_SET.size };
}

/** KeyboardEvent.location の番号を識別子にする（0=標準, 1=左, 2=右, 3=テンキー）。 */
export function locationName(
  location: number,
): 'standard' | 'left' | 'right' | 'numpad' {
  switch (location) {
    case 1:
      return 'left';
    case 2:
      return 'right';
    case 3:
      return 'numpad';
    default:
      return 'standard';
  }
}

/** 配置にないキーの表示名。印字できるキーはその文字、そうでなければ code。 */
export function otherKeyLabel(code: string, key: string): string {
  const printable = key.length === 1 && key.trim() !== '';
  return printable ? `${key} (${code})` : code || key || '?';
}
