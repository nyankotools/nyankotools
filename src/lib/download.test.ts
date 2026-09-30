import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadBlob } from './download';

describe('downloadBlob', () => {
  let anchor: {
    href: string;
    download: string;
    click: ReturnType<typeof vi.fn>;
    remove: ReturnType<typeof vi.fn>;
  };
  let appendChild: ReturnType<typeof vi.fn>;
  let revoke: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    anchor = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
    appendChild = vi.fn();
    vi.stubGlobal('document', {
      createElement: vi.fn(() => anchor),
      body: { appendChild },
    });
    revoke = vi.fn();
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test');
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(revoke);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('a要素を追加してクリックし、すぐ除去する', () => {
    downloadBlob(new Blob(['x']), 'out.txt');
    expect(anchor.download).toBe('out.txt');
    expect(appendChild).toHaveBeenCalledWith(anchor);
    expect(anchor.click).toHaveBeenCalledTimes(1);
    expect(anchor.remove).toHaveBeenCalledTimes(1);
  });

  it('object URL は60秒後に revoke する', () => {
    downloadBlob(new Blob(['x']), 'out.txt');
    vi.advanceTimersByTime(59_999);
    expect(revoke).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(revoke).toHaveBeenCalledWith('blob:test');
  });

  it('連続呼び出しでもそれぞれ revoke する', () => {
    vi.mocked(URL.createObjectURL)
      .mockReturnValueOnce('blob:1')
      .mockReturnValueOnce('blob:2');
    downloadBlob(new Blob(['a']), 'a.txt');
    downloadBlob(new Blob(['b']), 'b.txt');
    vi.advanceTimersByTime(60_000);
    expect(revoke.mock.calls.map((c) => c[0])).toEqual(['blob:1', 'blob:2']);
  });
});
