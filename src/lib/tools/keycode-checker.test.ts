import { describe, expect, it } from 'vitest';
import {
  buildKeyEventInfo,
  describeLocation,
  describeModifiers,
  type KeyEventInput,
  type LocationLabels,
} from './keycode-checker';

const JA_LOCATION_LABELS: LocationLabels = {
  standard: '標準',
  left: '左側',
  right: '右側',
  numpad: 'テンキー',
  unknown: '不明',
};
const JA_NONE_LABEL = 'なし';
const JA_LABELS = { location: JA_LOCATION_LABELS, none: JA_NONE_LABEL };

const EN_LOCATION_LABELS: LocationLabels = {
  standard: 'standard',
  left: 'left',
  right: 'right',
  numpad: 'numpad',
  unknown: 'unknown',
};

function baseInput(overrides: Partial<KeyEventInput> = {}): KeyEventInput {
  return {
    key: 'a',
    code: 'KeyA',
    keyCode: 65,
    location: 0,
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    repeat: false,
    ...overrides,
  };
}

describe('describeLocation', () => {
  it('0〜3のlocationをラベルに変換する', () => {
    expect(describeLocation(0, JA_LOCATION_LABELS)).toBe('標準');
    expect(describeLocation(1, JA_LOCATION_LABELS)).toBe('左側');
    expect(describeLocation(2, JA_LOCATION_LABELS)).toBe('右側');
    expect(describeLocation(3, JA_LOCATION_LABELS)).toBe('テンキー');
  });

  it('未知の値・想定外の値はunknownラベルを返す', () => {
    expect(describeLocation(99, JA_LOCATION_LABELS)).toBe('不明');
    expect(describeLocation(-1, JA_LOCATION_LABELS)).toBe('不明');
    expect(describeLocation(1.5, JA_LOCATION_LABELS)).toBe('不明');
    expect(describeLocation(NaN, JA_LOCATION_LABELS)).toBe('不明');
  });

  it('ラベルを差し替えれば任意の言語で表示できる（ロジック層は文言を持たない）', () => {
    expect(describeLocation(1, EN_LOCATION_LABELS)).toBe('left');
    expect(describeLocation(3, EN_LOCATION_LABELS)).toBe('numpad');
    expect(describeLocation(99, EN_LOCATION_LABELS)).toBe('unknown');
  });
});

describe('describeModifiers', () => {
  it('修飾キーが押されていなければnoneLabelを返す', () => {
    const noModifiers = {
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
    };
    expect(describeModifiers(noModifiers, JA_NONE_LABEL)).toBe('なし');
    expect(describeModifiers(noModifiers, 'None')).toBe('None');
  });

  it('単一の修飾キーをそのまま表示する（キー名自体は言語共通）', () => {
    expect(
      describeModifiers(
        { ctrlKey: true, altKey: false, shiftKey: false, metaKey: false },
        JA_NONE_LABEL,
      ),
    ).toBe('Ctrl');

    expect(
      describeModifiers(
        { ctrlKey: false, altKey: true, shiftKey: false, metaKey: false },
        JA_NONE_LABEL,
      ),
    ).toBe('Alt');

    expect(
      describeModifiers(
        { ctrlKey: false, altKey: false, shiftKey: true, metaKey: false },
        JA_NONE_LABEL,
      ),
    ).toBe('Shift');

    expect(
      describeModifiers(
        { ctrlKey: false, altKey: false, shiftKey: false, metaKey: true },
        JA_NONE_LABEL,
      ),
    ).toBe('Meta');
  });

  it('複数の修飾キーをCtrl→Alt→Shift→Metaの順に連結する', () => {
    expect(
      describeModifiers(
        { ctrlKey: true, altKey: true, shiftKey: true, metaKey: true },
        JA_NONE_LABEL,
      ),
    ).toBe('Ctrl + Alt + Shift + Meta');

    expect(
      describeModifiers(
        { ctrlKey: false, altKey: false, shiftKey: true, metaKey: true },
        JA_NONE_LABEL,
      ),
    ).toBe('Shift + Meta');

    expect(
      describeModifiers(
        { ctrlKey: false, altKey: true, shiftKey: false, metaKey: true },
        JA_NONE_LABEL,
      ),
    ).toBe('Alt + Meta');
  });
});

describe('buildKeyEventInfo', () => {
  it('生の値にlocationLabel・modifierLabelを付加する', () => {
    const info = buildKeyEventInfo(
      baseInput({
        key: 'Enter',
        code: 'NumpadEnter',
        keyCode: 13,
        location: 3,
        ctrlKey: true,
      }),
      JA_LABELS,
    );

    expect(info.key).toBe('Enter');
    expect(info.code).toBe('NumpadEnter');
    expect(info.locationLabel).toBe('テンキー');
    expect(info.modifierLabel).toBe('Ctrl');
    expect(info.repeat).toBe(false);
  });

  it('修飾キーなし・repeat: trueの入力も正しく変換する（長押し中のkeydown）', () => {
    const info = buildKeyEventInfo(baseInput({ repeat: true }), JA_LABELS);

    expect(info.repeat).toBe(true);
    expect(info.modifierLabel).toBe('なし');
    expect(info.locationLabel).toBe('標準');
  });

  it('スペースキー（key: " "）の生の値をそのまま保持する（表示用の変換はページ側の責務）', () => {
    const info = buildKeyEventInfo(
      baseInput({ key: ' ', code: 'Space', keyCode: 32 }),
      JA_LABELS,
    );

    expect(info.key).toBe(' ');
    expect(info.code).toBe('Space');
  });

  it('日本語入力（IME変換中）を想定したkey: "Process"やkeyCode: 229も扱える', () => {
    const info = buildKeyEventInfo(
      baseInput({ key: 'Process', code: 'Unidentified', keyCode: 229 }),
      JA_LABELS,
    );

    expect(info.key).toBe('Process');
    expect(info.code).toBe('Unidentified');
    expect(info.keyCode).toBe(229);
  });

  it('未知のlocation値はlocationLabelがunknownラベルになる', () => {
    const info = buildKeyEventInfo(
      baseInput({ location: 99 as unknown as 0 }),
      JA_LABELS,
    );

    expect(info.locationLabel).toBe('不明');
  });

  it('渡すラベルを差し替えれば英語版でも同じロジックで正しいラベルになる', () => {
    const info = buildKeyEventInfo(baseInput({ location: 1 }), {
      location: EN_LOCATION_LABELS,
      none: 'None',
    });

    expect(info.locationLabel).toBe('left');
    expect(info.modifierLabel).toBe('None');
  });
});
