import { describe, expect, it } from 'vitest';
import {
  applyPreset,
  buildCssDeclaration,
  buildFilterValue,
  clampFilterValue,
  clampShadowBlur,
  clampShadowOffset,
  defaultFilterState,
  FILTER_DEFS,
  FILTER_PRESETS,
  getPreset,
  normalizeColor,
} from './css-filter-generator';

describe('clampFilterValue', () => {
  it('範囲内は四捨五入、範囲外は丸める', () => {
    expect(clampFilterValue('blur', 2.6)).toBe(3);
    expect(clampFilterValue('blur', -4)).toBe(0);
    expect(clampFilterValue('blur', 999)).toBe(50);
    expect(clampFilterValue('brightness', 500)).toBe(300);
    expect(clampFilterValue('hueRotate', 720)).toBe(360);
    expect(clampFilterValue('grayscale', 150)).toBe(100);
  });

  it('NaN・Infinityは効果なしの値に戻す', () => {
    expect(clampFilterValue('brightness', NaN)).toBe(100);
    expect(clampFilterValue('blur', Infinity)).toBe(0);
  });
});

describe('shadow clamps / color', () => {
  it('オフセットとぼかしを丸める', () => {
    expect(clampShadowOffset(-500)).toBe(-100);
    expect(clampShadowOffset(NaN)).toBe(0);
    expect(clampShadowBlur(-3)).toBe(0);
    expect(clampShadowBlur(300)).toBe(100);
  });

  it('色を正規化し、不正値は黒', () => {
    expect(normalizeColor('#ABC')).toBe('#aabbcc');
    expect(normalizeColor('red')).toBe('#000000');
  });
});

describe('buildFilterValue', () => {
  it('初期状態は none', () => {
    expect(buildFilterValue(defaultFilterState())).toBe('none');
    expect(buildCssDeclaration(defaultFilterState())).toBe('filter: none;');
  });

  it('変更した関数だけを定義順に出力する', () => {
    const s = defaultFilterState();
    s.values.sepia = 50;
    s.values.blur = 3;
    s.values.hueRotate = 90;
    expect(buildFilterValue(s)).toBe('blur(3px) hue-rotate(90deg) sepia(50%)');
  });

  it('100%が基準の関数は100のとき省略、100以外は出力', () => {
    const s = defaultFilterState();
    s.values.opacity = 100;
    s.values.brightness = 120;
    expect(buildFilterValue(s)).toBe('brightness(120%)');
    s.values.opacity = 0;
    expect(buildFilterValue(s)).toBe('brightness(120%) opacity(0%)');
  });

  it('範囲外・NaNはクランプ／既定に戻る', () => {
    const s = defaultFilterState();
    s.values.contrast = 9999;
    s.values.saturate = NaN;
    expect(buildFilterValue(s)).toBe('contrast(300%)');
  });

  it('drop-shadowは有効時のみ末尾に付く', () => {
    const s = defaultFilterState();
    s.values.grayscale = 100;
    s.dropShadow = {
      enabled: true,
      offsetX: 500,
      offsetY: -2,
      blur: -1,
      color: 'bad',
    };
    expect(buildFilterValue(s)).toBe(
      'grayscale(100%) drop-shadow(100px -2px 0px #000000)',
    );
    s.dropShadow.enabled = false;
    expect(buildFilterValue(s)).toBe('grayscale(100%)');
  });

  it('drop-shadowだけでも出力される', () => {
    const s = defaultFilterState();
    s.dropShadow.enabled = true;
    expect(buildCssDeclaration(s)).toBe(
      'filter: drop-shadow(4px 4px 6px #000000);',
    );
  });
});

describe('presets', () => {
  it('getPreset', () => {
    expect(getPreset('noir')).toBeDefined();
    expect(getPreset('nope')).toBeUndefined();
  });

  it('全プリセットが範囲内で、何らかの効果を持つ', () => {
    for (const p of FILTER_PRESETS) {
      const state = applyPreset(p);
      for (const d of FILTER_DEFS) {
        expect(state.values[d.key]).toBe(
          clampFilterValue(d.key, state.values[d.key]),
        );
      }
      expect(buildFilterValue(state)).not.toBe('none');
      expect(normalizeColor(state.dropShadow.color)).toBe(
        state.dropShadow.color,
      );
    }
  });

  it('applyPresetは未指定の項目を初期値にする', () => {
    const s = applyPreset(getPreset('noir')!);
    expect(buildFilterValue(s)).toBe(
      'brightness(90%) contrast(130%) grayscale(100%)',
    );
    expect(s.dropShadow.enabled).toBe(false);
  });

  it('shadowプリセットはdrop-shadowを有効にする', () => {
    expect(buildFilterValue(applyPreset(getPreset('shadow')!))).toBe(
      'drop-shadow(6px 8px 8px #000000)',
    );
  });
});
