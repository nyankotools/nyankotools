import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from './clipboard';

function stubDom(execResult: boolean | 'throw') {
  const textarea = {
    value: '',
    style: {} as Record<string, string>,
    setAttribute: vi.fn(),
    select: vi.fn(),
    setSelectionRange: vi.fn(),
    remove: vi.fn(),
  };
  const button = { focus: vi.fn() };
  const doc = {
    activeElement: button,
    createElement: vi.fn(() => textarea),
    body: { appendChild: vi.fn() },
    execCommand: vi.fn(() => {
      if (execResult === 'throw') throw new Error('x');
      return execResult;
    }),
  };
  vi.stubGlobal('document', doc);
  return { textarea, button, doc };
}

afterEach(() => vi.unstubAllGlobals());

describe('copyText', () => {
  it('Clipboard API が成功すれば true、フォールバックしない', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const { doc } = stubDom(true);
    await expect(copyText('abc')).resolves.toBe(true);
    expect(doc.execCommand).not.toHaveBeenCalled();
  });

  it('reject 時は execCommand にフォールバックし、後始末とフォーカス復帰を行う', async () => {
    vi.stubGlobal('navigator', {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    const { textarea, button, doc } = stubDom(true);
    await expect(copyText('日本語😀')).resolves.toBe(true);
    expect(textarea.value).toBe('日本語😀');
    expect(doc.execCommand).toHaveBeenCalledWith('copy');
    expect(textarea.setSelectionRange).toHaveBeenCalledWith(
      0,
      '日本語😀'.length,
    );
    expect(textarea.remove).toHaveBeenCalledTimes(1);
    expect(button.focus).toHaveBeenCalledTimes(1);
  });

  it('navigator.clipboard が無くてもフォールバックする', async () => {
    vi.stubGlobal('navigator', {});
    const { doc } = stubDom(true);
    await expect(copyText('x')).resolves.toBe(true);
    expect(doc.execCommand).toHaveBeenCalled();
  });

  it('execCommand が false なら false（後始末は行う）', async () => {
    vi.stubGlobal('navigator', {});
    const { textarea, button } = stubDom(false);
    await expect(copyText('x')).resolves.toBe(false);
    expect(textarea.remove).toHaveBeenCalledTimes(1);
    expect(button.focus).toHaveBeenCalledTimes(1);
  });

  it('execCommand が例外でも false で、textarea は必ず除去する', async () => {
    vi.stubGlobal('navigator', {});
    const { textarea } = stubDom('throw');
    await expect(copyText('x')).resolves.toBe(false);
    expect(textarea.remove).toHaveBeenCalledTimes(1);
  });

  it('activeElement が null でも落ちない', async () => {
    vi.stubGlobal('navigator', {});
    const { doc } = stubDom(true);
    doc.activeElement = null as never;
    await expect(copyText('x')).resolves.toBe(true);
  });

  it('document が無い環境では false', async () => {
    vi.stubGlobal('navigator', {});
    await expect(copyText('x')).resolves.toBe(false);
  });
});
