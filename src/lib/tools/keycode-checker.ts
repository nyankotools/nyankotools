export type KeyLocation = 0 | 1 | 2 | 3;

export interface KeyEventInput {
  key: string;
  code: string;
  keyCode: number;
  location: KeyLocation;
  shiftKey: boolean;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  repeat: boolean;
}

export interface KeyEventInfo extends KeyEventInput {
  locationLabel: string;
  modifierLabel: string;
}

/** locationラベルの表示文言。呼び出し側（ページ）がロケールごとに用意する */
export interface LocationLabels {
  standard: string;
  left: string;
  right: string;
  numpad: string;
  unknown: string;
}

export interface KeyEventLabels {
  location: LocationLabels;
  /** 修飾キーが1つも押されていないときの表示文言（例: "なし" / "None"） */
  none: string;
}

/** KeyboardEvent.location（0〜3、またはそれ以外の想定外の値）をラベルに変換する */
export function describeLocation(
  location: number,
  labels: LocationLabels,
): string {
  switch (location) {
    case 0:
      return labels.standard;
    case 1:
      return labels.left;
    case 2:
      return labels.right;
    case 3:
      return labels.numpad;
    default:
      return labels.unknown;
  }
}

/**
 * 押されている修飾キー（Ctrl/Alt/Shift/Meta）を「Ctrl + Shift」のような表記にまとめる。
 * キー名自体（Ctrl/Alt/Shift/Meta）は言語を問わず共通の表記のため固定値とし、
 * 何も押されていない場合の文言のみ呼び出し側から渡す。
 */
export function describeModifiers(
  input: Pick<KeyEventInput, 'ctrlKey' | 'altKey' | 'shiftKey' | 'metaKey'>,
  noneLabel: string,
): string {
  const active: string[] = [];
  if (input.ctrlKey) active.push('Ctrl');
  if (input.altKey) active.push('Alt');
  if (input.shiftKey) active.push('Shift');
  if (input.metaKey) active.push('Meta');
  return active.length > 0 ? active.join(' + ') : noneLabel;
}

/** KeyboardEventから抽出した生の値に、表示用のラベルを付加する */
export function buildKeyEventInfo(
  input: KeyEventInput,
  labels: KeyEventLabels,
): KeyEventInfo {
  return {
    ...input,
    locationLabel: describeLocation(input.location, labels.location),
    modifierLabel: describeModifiers(input, labels.none),
  };
}
