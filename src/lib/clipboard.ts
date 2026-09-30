/**
 * テキストをクリップボードへコピーする。成功したら true。
 * Clipboard API が使えない環境（非セキュアコンテキスト等）では
 * 一時的な textarea と execCommand('copy') にフォールバックする。
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return legacyCopy(text);
  }
}

function legacyCopy(text: string): boolean {
  if (typeof document === 'undefined') return false;
  const previouslyFocused = document.activeElement as HTMLElement | null;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
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
