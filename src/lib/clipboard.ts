import { trackEvent } from './analytics';

/**
 * テキストをクリップボードへコピーする。成功したら true。
 * Clipboard API が使えない環境（非セキュアコンテキスト等）では
 * 一時的な textarea と execCommand('copy') にフォールバックする。
 * 成功時は計測イベント `copy` を送る（内容は送らない）。
 */
export async function copyText(text: string): Promise<boolean> {
  let ok: boolean;
  try {
    await navigator.clipboard.writeText(text);
    ok = true;
  } catch {
    ok = legacyCopy(text);
  }
  if (ok) trackEvent('copy');
  return ok;
}

function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined') return false;
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  // モーダル<dialog>の表示中は外側の要素がinertで選択できないため、
  // フォーカス中の要素が属するダイアログの内側に置く
  const host =
    (previouslyFocused?.closest?.('dialog') as HTMLElement | null) ??
    document.body;
  host.appendChild(textarea);
  try {
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    // キーボード操作のユーザーがボタンの位置を見失わないよう、フォーカスを戻す
    previouslyFocused?.focus?.();
  }
}
