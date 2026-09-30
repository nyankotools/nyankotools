import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { onTextInput } from './input-scheduler';

function setup(threshold = 10) {
  let listener: () => void = () => {};
  const el = {
    value: '',
    addEventListener: (_type: string, fn: () => void) => {
      listener = fn;
    },
  };
  const handler = vi.fn();
  onTextInput(el as unknown as HTMLTextAreaElement, handler, {
    threshold,
    delay: 100,
  });
  const type = (value: string) => {
    el.value = value;
    listener();
  };
  return { handler, type };
}

describe('onTextInput', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('しきい値未満の入力は即時に処理する', () => {
    const { handler, type } = setup();
    type('abc');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('しきい値以上の入力は遅延し、連続入力は最後の1回にまとまる', () => {
    const { handler, type } = setup();
    type('x'.repeat(10));
    type('x'.repeat(11));
    expect(handler).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('遅延中に短くなったら、待たずに即時処理して古い予約を捨てる', () => {
    const { handler, type } = setup();
    type('x'.repeat(10));
    type('');
    expect(handler).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(100);
    expect(handler).toHaveBeenCalledTimes(1);
  });
});
