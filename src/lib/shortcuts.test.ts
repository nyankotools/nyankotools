import { describe, expect, it } from 'vitest';
import { matchShortcut } from './shortcuts';

const base = {
  key: '',
  code: '',
  ctrlKey: false,
  metaKey: false,
  altKey: false,
  shiftKey: false,
};

describe('matchShortcut', () => {
  it('Ctrl+Enter / ⌘+Enter は run', () => {
    expect(matchShortcut({ ...base, key: 'Enter', ctrlKey: true })).toBe('run');
    expect(matchShortcut({ ...base, key: 'Enter', metaKey: true })).toBe('run');
  });

  it('Enter 単体・Shift付きは対象外', () => {
    expect(matchShortcut({ ...base, key: 'Enter' })).toBeNull();
    expect(
      matchShortcut({ ...base, key: 'Enter', ctrlKey: true, shiftKey: true }),
    ).toBeNull();
  });

  it('Alt+Shift+C は copy（macOS で key が別の文字になっても code で判定）', () => {
    expect(
      matchShortcut({
        ...base,
        key: 'Ç',
        code: 'KeyC',
        altKey: true,
        shiftKey: true,
      }),
    ).toBe('copy');
  });

  it('Ctrl+Shift+C（開発者ツール）は奪わない', () => {
    expect(
      matchShortcut({
        ...base,
        key: 'C',
        code: 'KeyC',
        ctrlKey: true,
        shiftKey: true,
      }),
    ).toBeNull();
  });

  it('IME 変換中は無視する', () => {
    expect(
      matchShortcut({
        ...base,
        key: 'Enter',
        ctrlKey: true,
        isComposing: true,
      }),
    ).toBeNull();
  });
});
